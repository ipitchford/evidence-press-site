#!/usr/bin/env node
'use strict';
const cp = require('node:child_process');
const required = [18, 20, 22].map(n => `Build and verify (Node ${n})`).concat('Accessibility (axe via pa11y-ci)');
function validate(pages, commit) {
  if (!/^[a-f0-9]{40}$/.test(commit) || !Array.isArray(pages) || !pages.length) throw Error('Invalid CI identity or response');
  const latest = new Map();
  for (const page of pages) {
    if (!Array.isArray(page.check_runs)) throw Error('Malformed canonical check response');
    for (const check of page.check_runs) {
      if (check.head_sha !== commit || check.app?.slug !== 'github-actions') continue;
      if (!Number.isSafeInteger(check.id)) throw Error('Malformed check identity');
      if (!latest.has(check.name) || latest.get(check.name).id < check.id) latest.set(check.name, check);
    }
  }
  for (const name of required) {
    const c = latest.get(name);
    if (!c || c.status !== 'completed' || c.conclusion !== 'success' ||
        !/^https:\/\/github.com\/ipitchford\/evidence-press-site\/actions\//.test(c.html_url || '')) {
      throw Error(`Required CI incomplete: ${name}. Wait for or repair CI, then resume deployment at this commit.`);
    }
  }
  return required.map(name => latest.get(name).id);
}
if (require.main === module) {
  try {
    const commit = cp.execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
    const raw = cp.execFileSync('gh', ['api', `repos/ipitchford/evidence-press-site/commits/${commit}/check-runs?per_page=100`, '--paginate', '--slurp'], {encoding:'utf8',maxBuffer:32<<20});
    validate(JSON.parse(raw), commit);
    console.log(`Canonical required CI passed for ${commit}`);
  } catch (e) { console.error(`REFUSING DEPLOY: ${e.message}`); process.exitCode=1; }
}
module.exports = {validate, required};
