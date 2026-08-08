#!/usr/bin/env bash
# Evidence Press — one-command publish.
#
#   ./tools/deploy.sh            # build, gate, deploy, then push URLs to IndexNow
#   ./tools/deploy.sh --commit-dirty=true   # extra args are forwarded to wrangler
#
# Steps, in order (any failure aborts — set -e):
#   1. protocols/deploy/integrate.sh     reproduce the ledgered protocol build
#      and build/mount the current main site
#   2. protocol release-integrity gate   require exact clean-source ledger parity
#   3. node tools/check-published.js     refuse a build that would drop a live URL
#   4. wrangler pages deploy dist        publish to Cloudflare Pages
#   5. node tools/indexnow-submit.js     push every sitemap URL to IndexNow
#
# IndexNow submission is wired in here so Bing/Yandex/DuckDuckGo/Seznam learn of
# new or changed pages on every deploy, with no separate manual step. It runs
# LAST, after the pages and the key file are live, so ownership validation passes.
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f protocols/PUBLISHED.json ]]; then
  echo "REFUSING DEPLOY: protocols/PUBLISHED.json is missing" >&2
  exit 1
fi
read -r PROTOCOL_SOURCE_COMMIT PROTOCOL_SOURCE_DIRTY < <(node -e '
  const ledger = require("./protocols/PUBLISHED.json");
  process.stdout.write(String(ledger.source && ledger.source.commit) + " " + String(ledger.source && ledger.source.dirty));
')
if [[ ! "$PROTOCOL_SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ || "$PROTOCOL_SOURCE_DIRTY" != "false" ]]; then
  echo "REFUSING DEPLOY: protocol ledger must pin a full clean source commit; reseal the candidate after commit A" >&2
  exit 1
fi

echo "==> [1/5] composite build (main site + exact ledgered /protocols/ source)"
PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT="$PROTOCOL_SOURCE_COMMIT" \
  REQUIRE_COMMITTED_MANIFESTS=1 ./protocols/deploy/integrate.sh

echo "==> [2/5] exact protocol release-integrity gate"
node protocols/tools/check-release-integrity.js

echo "==> [3/5] published-URL gate"
node tools/check-published.js

echo "==> [4/5] deploy to Cloudflare Pages"
npx wrangler pages deploy dist --project-name evidence-press "$@"

echo "==> [5/5] IndexNow submission"
node tools/indexnow-submit.js

echo
echo "Done. If this deploy added a NEW release, record it in the ledger and commit:"
echo "    node tools/check-published.js --record && git add PUBLISHED.json && git commit -m 'chore: record published URLs'"
