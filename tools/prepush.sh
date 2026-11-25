#!/usr/bin/env bash
# Evidence Press — run the PR CI suite locally before pushing, so hosted CI
# rarely fails and a release does not pay for a second PR/CI cycle.
#
#   ./tools/prepush.sh            # source-level CI gates (about a minute)
#   ./tools/prepush.sh --built    # also the gates CI runs against a built dist/
#
# This is a convenience mirror of .github/workflows/ci.yml, not a substitute for
# it: hosted CI (Node 18/20/22 matrix, accessibility, reproducible rebuild)
# remains the deploy admission gate.
set -euo pipefail
cd "$(dirname "$0")/.."
# Prefer a real interpreter over wrapper shims (the scanners invoke python3).
[[ -x /opt/homebrew/bin/python3 ]] && export PATH="/opt/homebrew/bin:$PATH"
BUILT=0
case "${1:-}" in
  "") ;;
  --built) BUILT=1 ;;
  *) echo "usage: tools/prepush.sh [--built]" >&2; exit 2 ;;
esac

step() { echo "==> $*"; }

step "public text source gate"
node tools/test-public-text.js
node tools/check-public-text.js --source > /dev/null

step "syntax"
node --check build.js
for f in tools/*.js assets/js/*.js protocols/tools/*.js protocols/tools/lib/*.js; do node --check "$f"; done

step "contract and hostile-control suites"
for t in test-svg-xml check-svg-wellformed test-render test-site-nav test-deploy-ci \
         test-build-artifact test-deploy-build-artifact test-articles test-minds-explored \
         test-release-pages test-audio-recipe test-operating-model test-research-graph \
         test-atlas-roadmap test-atlas-proposals test-atlas-discovery test-atlas-memory \
         test-atlas-campaign test-static-hosting test-check-published-live-index \
         check-static-hosting test-claim-assurance test-baseline-receipt \
         test-implementation-status test-art-direction test-release-art; do
  node "tools/$t.js" > /dev/null
done
node tools/build-audio-provenance-status.js --check

step "protocol manifests"
node protocols/tools/make-manifest.js
git diff --exit-code -- 'protocols/protocols/*/MANIFEST.json'

if (( BUILT )); then
  step "built-output gates (requires a fresh composite build in dist/)"
  node tools/test-research-graph.js --built
  node tools/check-public-text.js --built > /dev/null
  node tools/check-svg-wellformed.js --built
  node tools/test-atlas-delivery.js
  node tools/test-atlas-proposals.js --built
  node tools/test-claim-assurance.js --built
  node tools/test-metadata.js
  node tools/test-license-scope.js --built
  node tools/check-links.js
  node tools/test-site-nav.js --built
  node tools/test-institutional-page-identity.js
  node tools/check-published.js
fi
echo "prepush: all local CI gates passed"
