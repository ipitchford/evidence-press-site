#!/usr/bin/env bash
#
# integrate.sh — composite candidate build for Productivity Protocols and the
# Evidence Press host. The root generator owns the main site and /productivity/;
# the subsystem generator owns /protocols/. This script validates and mounts both
# into one generated dist/ candidate.
#
# It does NOT deploy. `wrangler pages deploy` is a maintainer step, deliberately
# left out. See deploy/README.md.
#
# NOTE: this replaces generated dist/ output. dist/ is ignored, but the command is
# still intended for deliberate review/deploy preparation because it rebuilds the
# complete publication candidate.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"   # evidence-press-site
cd "$ROOT"

echo "1/6  main site build  (build.js -> dist/)"
node build.js

echo "2/6  protocol gates    (schemas, examples, pilot controls, hostile fixtures)"
node protocols/tools/verify-all.js --no-build
if [[ "${REQUIRE_COMMITTED_MANIFESTS:-0}" == "1" ]]; then
  git diff --exit-code -- 'protocols/protocols/*/MANIFEST.json'
fi

echo "3/6  protocols build  (protocols/build-protocols.js -> protocols/dist/)"
node protocols/build-protocols.js

echo "4/6  starter replay   (fresh extraction -> 31 pilot controls)"
node protocols/tools/test-starter-kit.js

echo "5/6  mount            (protocols/dist -> dist/protocols/)"
rm -rf dist/protocols
cp -R protocols/dist dist/protocols

echo "6/6  sitemap merge    (fold /protocols/ page URLs into dist/sitemap.xml)"
node tools/merge-protocols-sitemap.js

echo "done: merged site in dist/  ·  /protocols/ is available and in the main sitemap"
echo "verify locally:  python3 -m http.server 8080 -d dist   # then open /protocols/"
echo "deploy (MAINTAINER step, not run here):  wrangler pages deploy dist"
