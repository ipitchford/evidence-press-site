#!/usr/bin/env bash
# Evidence Press — one-command publish.
#
#   ./tools/deploy.sh            # build, gate, deploy, then push URLs to IndexNow
#   ./tools/deploy.sh --build-receipt /tmp/reviewed/receipt.json --branch main
# Extra args are forwarded to Wrangler; a dirty source tree is always refused.
#
# Steps, in order (any failure aborts — set -e): build the exact ledgered
# candidate; run protocol, site, link and live-preservation gates; verify
# Cloudflare authentication; deploy; perform exact protocol and full-site live
# readback; then submit the sitemap to IndexNow. Discovery failure does not
# negate successful publication; its separate retry is recorded outside dist.
#
# IndexNow submission is wired in here so Bing/Yandex/DuckDuckGo/Seznam learn of
# new or changed pages on every deploy, with no separate manual step. It runs
# LAST, after the pages and the key file are live, so ownership validation passes.
set -euo pipefail
cd "$(dirname "$0")/.."

BUILD_RECEIPT=""
WRANGLER_ARGS=()
while (( $# )); do
  case "$1" in
    --build-receipt)
      if (( $# < 2 )) || [[ -z "$2" || "$2" == --* || -n "$BUILD_RECEIPT" ]]; then
        echo "REFUSING DEPLOY: --build-receipt needs one receipt path" >&2
        exit 1
      fi
      BUILD_RECEIPT="$2"
      shift 2
      ;;
    *) WRANGLER_ARGS+=("$1"); shift ;;
  esac
done

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

echo "==> [1/9] verified composite artifact (build once or reuse exact reviewed bytes)"
if [[ -n "$BUILD_RECEIPT" ]]; then
  node tools/build-artifact.js verify --receipt "$BUILD_RECEIPT"
else
  BUILD_RECEIPT="$(node tools/build-artifact.js prepare --print-receipt)"
fi

echo "==> [2/9] exact protocol release-integrity gate"
node protocols/tools/check-release-integrity.js

echo "==> [3/9] site metadata, rendering, and link gates"
node tools/check-operating-model.js
node tools/test-operating-model.js
node tools/test-atlas-roadmap.js
node tools/test-atlas-proposals.js --built
node tools/test-research-graph.js --built
node tools/test-claim-assurance.js --built
node tools/test-baseline-receipt.js
node tools/test-implementation-status.js
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
# Recheck after all local/live pre-upload gates and authentication: they must
# not mutate either the source, the checked dist tree, or the preserved copy.
BUILD_ARTIFACT="$(node tools/build-artifact.js verify --receipt "$BUILD_RECEIPT" --print-artifact)"
# macOS ships Bash 3.2, where an empty array trips nounset with the usual form.
npx wrangler pages deploy "$BUILD_ARTIFACT" --project-name evidence-press ${WRANGLER_ARGS[@]+"${WRANGLER_ARGS[@]}"}

echo "==> [7/9] exact protocol live byte readback"
retry_post_deploy_readback "exact protocol live byte readback" \
  node protocols/tools/check-release-integrity.js --live https://evidencepress.org/

echo "==> [8/9] full-site post-deploy readback"
retry_post_deploy_readback "published-site post-deploy readback" \
  node tools/check-published.js --live --post-deploy
retry_post_deploy_readback "publication-integrity post-deploy readback" \
  node tools/check-publication-integrity.js --live

echo "==> [9/9] IndexNow submission"
DISCOVERY_STATUS="accepted"
if ! node tools/indexnow-submit.js; then
  DISCOVERY_STATUS="failed"
  echo "Publication and canonical readback passed; IndexNow discovery failed. Retry only: node tools/indexnow-submit.js" >&2
fi
DEPLOYMENT_RECEIPT="$(node tools/build-artifact.js deployment-result --receipt "$BUILD_RECEIPT" --discovery "$DISCOVERY_STATUS")"

echo
echo "Guarded deployment and canonical post-deploy readback completed. IndexNow: ${DISCOVERY_STATUS}."
echo "Operational deployment receipt: ${DEPLOYMENT_RECEIPT}"
