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
    if (c && !/^https:\/\/github.com\/ipitchford\/evidence-press-site\/actions\//.test(c.html_url || '')) throw Error(`Required CI has a non-canonical URL: ${name}`);
    if (!c || c.status !== 'completed') throw Object.assign(Error(`Required CI incomplete: ${name}`), {pending: true});
    if (c.conclusion !== 'success') throw Error(`Required CI failed: ${name} (${c.conclusion}). Repair CI, then resume deployment at this commit.`);
  }
  return required.map(name => latest.get(name).id);
}
// Pending CI is waited on (bounded by DEPLOY_CI_WAIT_SECONDS, default 1800); failed CI is refused at once.
function waitFor(commit, fetch, {waitSeconds = 1800, pollSeconds = 30, sleep = s => cp.execFileSync('sleep', [String(s)]), log = console.error} = {}) {
  const deadline = Date.now() + waitSeconds * 1000;
  for (;;) {
    try { return validate(fetch(), commit); }
    catch (e) {
      if (!e.pending || Date.now() + pollSeconds * 1000 > deadline) throw e;
      log(`${e.message}; waiting ${pollSeconds}s (deadline ${new Date(deadline).toISOString()})`);
      sleep(pollSeconds);
    }
  }
}
if (require.main === module) {
  try {
    const commit = cp.execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
    const fetch = () => JSON.parse(cp.execFileSync('gh', ['api', `repos/ipitchford/evidence-press-site/commits/${commit}/check-runs?per_page=100`, '--paginate', '--slurp'], {encoding:'utf8',maxBuffer:32<<20}));
    const waitSeconds = Number(process.env.DEPLOY_CI_WAIT_SECONDS ?? 1800);
    if (!Number.isFinite(waitSeconds) || waitSeconds < 0) throw Error('DEPLOY_CI_WAIT_SECONDS must be a non-negative number');
    waitFor(commit, fetch, {waitSeconds});
    console.log(`Canonical required CI passed for ${commit}`);
  } catch (e) { console.error(`REFUSING DEPLOY: ${e.message}`); process.exitCode=1; }
}
module.exports = {validate, waitFor, required};
