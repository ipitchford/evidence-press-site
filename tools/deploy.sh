#!/usr/bin/env bash
# Evidence Press — one-command publish.
#
#   ./tools/deploy.sh            # build, gate, deploy, then push URLs to IndexNow
#   ./tools/deploy.sh --commit-dirty=true   # extra args are forwarded to wrangler
#
# Steps, in order (any failure aborts — set -e): build the exact ledgered
# candidate; run protocol, site, link and live-preservation gates; verify
# Cloudflare authentication; deploy; perform exact protocol and full-site live
# readback; then submit the sitemap to IndexNow.
#
# IndexNow submission is wired in here so Bing/Yandex/DuckDuckGo/Seznam learn of
# new or changed pages on every deploy, with no separate manual step. It runs
# LAST, after the pages and the key file are live, so ownership validation passes.
set -euo pipefail
cd "$(dirname "$0")/.."

# Cloudflare Pages can expose a new deployment at its preview hostname a few
# seconds before every custom-domain edge serves the same bytes.  Retry only
# the read-only post-deploy gates; build, review, authentication and upload
# failures still stop immediately.  A persistent mismatch remains fatal.
POST_DEPLOY_READBACK_ATTEMPTS="${EP_POST_DEPLOY_READBACK_ATTEMPTS:-6}"
POST_DEPLOY_READBACK_DELAY_SECONDS="${EP_POST_DEPLOY_READBACK_DELAY_SECONDS:-5}"
if [[ ! "$POST_DEPLOY_READBACK_ATTEMPTS" =~ ^[1-9][0-9]*$ ]]; then
  echo "REFUSING DEPLOY: EP_POST_DEPLOY_READBACK_ATTEMPTS must be a positive integer" >&2
  exit 1
fi
if [[ ! "$POST_DEPLOY_READBACK_DELAY_SECONDS" =~ ^[0-9]+$ ]]; then
  echo "REFUSING DEPLOY: EP_POST_DEPLOY_READBACK_DELAY_SECONDS must be a non-negative integer" >&2
  exit 1
fi

retry_post_deploy_readback() {
  local label="$1"
  shift
  local attempt
  for ((attempt = 1; attempt <= POST_DEPLOY_READBACK_ATTEMPTS; attempt++)); do
    if "$@"; then
      return 0
    fi
    if (( attempt == POST_DEPLOY_READBACK_ATTEMPTS )); then
      echo "REFUSING DEPLOY: ${label} failed after ${attempt} attempt(s)" >&2
      return 1
    fi
    echo "${label} has not converged at the custom domain; retrying in ${POST_DEPLOY_READBACK_DELAY_SECONDS}s (${attempt}/${POST_DEPLOY_READBACK_ATTEMPTS})..." >&2
    sleep "$POST_DEPLOY_READBACK_DELAY_SECONDS"
  done
}

if [[ ! -f protocols/PUBLISHED.json ]]; then
  echo "REFUSING DEPLOY: protocols/PUBLISHED.json is missing" >&2
  exit 1
fi
read -r PROTOCOL_SOURCE_COMMIT PROTOCOL_SOURCE_DIRTY < <(node -e '
  const ledger = require("./protocols/PUBLISHED.json");
  process.stdout.write(String(ledger.source && ledger.source.commit) + " " + String(ledger.source && ledger.source.dirty) + "\n");
')
if [[ ! "$PROTOCOL_SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ || "$PROTOCOL_SOURCE_DIRTY" != "false" ]]; then
  echo "REFUSING DEPLOY: protocol ledger must pin a full clean source commit; reseal the candidate after commit A" >&2
  exit 1
fi

echo "==> [1/9] composite build (main site + exact ledgered /protocols/ source)"
PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT="$PROTOCOL_SOURCE_COMMIT" \
  REQUIRE_COMMITTED_MANIFESTS=1 ./protocols/deploy/integrate.sh

echo "==> [2/9] exact protocol release-integrity gate"
node protocols/tools/check-release-integrity.js

echo "==> [3/9] site metadata, rendering, and link gates"
node tools/check-operating-model.js
node tools/test-operating-model.js
node tools/test-atlas-roadmap.js
node tools/test-atlas-proposals.js --built
node tools/test-render.js
node tools/test-articles.js
node tools/test-metadata.js
node tools/check-links.js

echo "==> [4/9] live publication-preservation gates"
node tools/check-published.js --live
node tools/check-publication-integrity.js --live

echo "==> [5/9] verify Cloudflare authentication"
npx wrangler whoami

echo "==> [6/9] deploy to Cloudflare Pages"
npx wrangler pages deploy dist --project-name evidence-press "$@"

echo "==> [7/9] exact protocol live byte readback"
retry_post_deploy_readback "exact protocol live byte readback" \
  node protocols/tools/check-release-integrity.js --live https://evidencepress.org/

echo "==> [8/9] full-site post-deploy readback"
retry_post_deploy_readback "published-site post-deploy readback" \
  node tools/check-published.js --live --post-deploy
retry_post_deploy_readback "publication-integrity post-deploy readback" \
  node tools/check-publication-integrity.js --live

echo "==> [9/9] IndexNow submission"
node tools/indexnow-submit.js

echo
echo "Guarded deployment and post-deploy readback completed."
