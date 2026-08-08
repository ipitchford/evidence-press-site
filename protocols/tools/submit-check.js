#!/usr/bin/env node
'use strict';
/*
 * submit-check.js <pack-id> — the foundry INTAKE gate. Runs the pack-scoped gates
 * for one candidate (manifest -> validate -> tests -> hostile) and prints GO / NO-GO
 * with reasons. Does not touch other packs, build, or receipts. This is what a
 * submission CI job or a reviewer runs on a proposed pack. Apache-2.0.
 */
const { makeManifest } = require('./make-manifest');
const { validatePack } = require('./validate');
const { runTestsForPack } = require('./eval-harness');
const { scanPack, selfTest } = require('./hostile-tests');

const id = process.argv[2];
if (!id) { console.error('usage: node tools/submit-check.js <pack-id>'); process.exit(2); }

makeManifest(id);
const v = validatePack(id);
const t = runTestsForPack(id);
const sf = selfTest();
const h = scanPack(id);
const ok = v.length === 0 && t.failures.length === 0 && t.total > 0 && sf.length === 0 && h.length === 0;

console.log(`submit-check ${id}: ${ok ? 'GO' : 'NO-GO'}  (validate ${v.length ? 'fail' : 'ok'}, tests ${t.passed}/${t.total}, hostile ${h.length ? 'findings' : 'clean'})`);
if (!ok) {
  v.forEach(e => console.log('  validate: ' + e));
  t.failures.forEach(e => console.log('  tests: ' + e));
  sf.forEach(e => console.log('  detector self-test: ' + e));
  h.forEach(e => console.log('  hostile: ' + e));
  console.log('\nA candidate is GO only when it is a well-formed kernel instance, its tests pass, and the security lint is clean. See GOVERNANCE.md.');
}
process.exit(ok ? 0 : 1);
