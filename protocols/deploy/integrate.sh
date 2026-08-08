#!/usr/bin/env bash
#
# integrate.sh — NON-DESTRUCTIVE integration of Productivity Protocols into the
# Evidence Press site, WITHOUT editing the live build.js. It builds the main site,
# builds the protocols subsystem, and mounts protocols/dist at dist/protocols, so
# the merged dist/ serves the whole site with /protocols/ included.
#
# It does NOT deploy. `wrangler pages deploy` is a maintainer step, deliberately
# left out. See deploy/README.md.
#
# NOTE: this rebuilds the whole site into the repo's dist/. Run it when you intend
# to (re)build for review or deployment — not casually, since dist/ is tracked.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"   # evidence-press-site
cd "$ROOT"

echo "1/3  main site build  (build.js -> dist/)"
node build.js

echo "2/3  protocols build  (protocols/build-protocols.js -> protocols/dist/)"
node protocols/build-protocols.js

echo "3/4  mount            (protocols/dist -> dist/protocols/)"
rm -rf dist/protocols
cp -R protocols/dist dist/protocols

echo "4/4  sitemap merge    (fold /protocols/ page URLs into dist/sitemap.xml)"
node tools/merge-protocols-sitemap.js

echo "done: merged site in dist/  ·  /protocols/ is available and in the main sitemap"
echo "verify locally:  python3 -m http.server 8080 -d dist   # then open /protocols/"
echo "deploy (MAINTAINER step, not run here):  wrangler pages deploy dist"
