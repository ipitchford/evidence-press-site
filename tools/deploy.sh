#!/usr/bin/env bash
# Evidence Press — one-command publish.
#
#   ./tools/deploy.sh            # build, gate, deploy, then push URLs to IndexNow
#   ./tools/deploy.sh --commit-dirty=true   # extra args are forwarded to wrangler
#
# Steps, in order (any failure aborts — set -e):
#   1. node build.js                     rebuild dist/ from papers/
#   2. node tools/check-published.js     refuse a build that would drop a live URL
#   3. wrangler pages deploy dist        publish to Cloudflare Pages
#   4. node tools/indexnow-submit.js     push every sitemap URL to IndexNow
#
# IndexNow submission is wired in here so Bing/Yandex/DuckDuckGo/Seznam learn of
# new or changed pages on every deploy, with no separate manual step. It runs
# LAST, after the pages and the key file are live, so ownership validation passes.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> [1/4] build"
node build.js

echo "==> [2/4] published-URL gate"
node tools/check-published.js

echo "==> [3/4] deploy to Cloudflare Pages"
npx wrangler pages deploy dist --project-name evidence-press "$@"

echo "==> [4/4] IndexNow submission"
node tools/indexnow-submit.js

echo
echo "Done. If this deploy added a NEW release, record it in the ledger and commit:"
echo "    node tools/check-published.js --record && git add PUBLISHED.json && git commit -m 'chore: record published URLs'"
