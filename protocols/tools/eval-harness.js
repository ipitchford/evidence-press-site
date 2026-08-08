#!/usr/bin/env node
'use strict';
/*
 * eval-harness.js — two gates.
 *
 *  --tests : run each pack's tests/cases.json. A case's checks are evaluated
 *            against a named fixture; the case succeeds when the aggregate
 *            result equals its `expect` (pass or fail). Discrimination cases
 *            (expect: fail) prove the graders reject a real violation. This is
 *            the EXAMPLE_CONFORMANCE gate: it checks the pack's OWN shipped
 *            examples against deterministic graders and runs NO model. It cannot
 *            grant TASKSET_PASSED, which requires a live run over fresh tasks.
 *
 *  --evals : validate each pack's eval task-set and any result files against
 *            eval-result.schema.json, and enforce the evidence ceiling
 *            (a benchmark design cannot imply CAUSAL_EFFECT_SUPPORTED). Offline
 *            and structural — it does NOT run live models, so it never raises a
 *            protocol above CROSS_MODEL_REPRODUCED on its own.
 *
 *  (no flag) : run both.
 *
 * Exit non-zero on any failure. Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const { validate, deepEqual } = require('./lib/jsonschema');
const U = require('./lib/util');

const EVIDENCE = U.readJSON(path.join(U.ROOT, 'status', 'productivity-evidence.json'));
const CEILING = EVIDENCE.design_ceiling;
const ORDER = new Map(EVIDENCE.states.map(s => [s.id, s.order]));
const EVAL_SCHEMA = U.readJSON(path.join(U.ROOT, 'schema', 'eval-result.schema.json'));

// ---- grader DSL ----
function resolvePath(obj, dotted) {
  return dotted.split('.').reduce((cur, k) => (cur == null ? undefined : cur[k]), obj);
}
function runCheck(check, text, jsonCache) {
  const [op, arg] = Object.entries(check)[0];
  const json = () => {
    if (jsonCache.value === undefined) jsonCache.value = JSON.parse(text);
    return jsonCache.value;
  };
  switch (op) {
    case 'contains': return text.includes(arg);
    case 'not_contains': return !text.includes(arg);
    case 'matches': return new RegExp(arg).test(text);
    case 'min_count': return (text.match(new RegExp(arg[0], 'g')) || []).length >= arg[1];
    case 'max_count': return (text.match(new RegExp(arg[0], 'g')) || []).length <= arg[1];
    case 'json_path_exists': return resolvePath(json(), arg) !== undefined;
    case 'json_equals': return deepEqual(resolvePath(json(), arg[0]), arg[1]);
    case 'json_length': {
      const v = resolvePath(json(), arg[0]);
      const len = v == null ? 0 : v.length;
      if (arg[1] === 'eq') return len === arg[2];
      if (arg[1] === 'gte') return len >= arg[2];
      if (arg[1] === 'lte') return len <= arg[2];
      return false;
    }
    default: throw new Error('unknown check op: ' + op);
  }
}

function runTestsForPack(id) {
  const dir = U.packDir(id);
  const casesPath = path.join(dir, 'tests', 'cases.json');
  if (!fs.existsSync(casesPath)) return { total: 0, passed: 0, failures: [`${id}: no tests/cases.json`] };
  const spec = U.readJSON(casesPath);
  const failures = [];
  let passed = 0;
  for (const c of spec.cases) {
    const rel = spec.fixtures[c.fixture];
    if (!rel) { failures.push(`${id}/${c.id}: unknown fixture '${c.fixture}'`); continue; }
    const text = fs.readFileSync(path.join(dir, rel), 'utf8');
    const jsonCache = {};
    let allPass = true;
    try {
      for (const chk of c.checks) if (!runCheck(chk, text, jsonCache)) { allPass = false; break; }
    } catch (e) { failures.push(`${id}/${c.id}: ${e.message}`); continue; }
    const success = c.expect === 'pass' ? allPass : !allPass;
    if (success) passed++;
    else failures.push(`${id}/${c.id} (maps_to ${c.maps_to}, expect ${c.expect}): graders returned ${allPass ? 'pass' : 'fail'}`);
  }
  return { total: spec.cases.length, passed, failures };
}

function runEvalsForPack(id) {
  const dir = U.packDir(id);
  const evalsDir = path.join(dir, 'evals');
  const failures = [];
  let checked = 0;
  if (!fs.existsSync(evalsDir)) return { checked, failures };
  for (const f of fs.readdirSync(evalsDir).filter(f => f.endsWith('.json'))) {
    const data = U.readJSON(path.join(evalsDir, f));
    // A result has arms as objects (with metrics); a task-set has arms as
    // strings (the arm names). Only results carry implied_evidence_status.
    const isResult = Array.isArray(data.arms) && data.arms.length > 0
      && typeof data.arms[0] === 'object' && 'implied_evidence_status' in data;
    if (!isResult) continue;
    checked++;
    for (const e of validate(EVAL_SCHEMA, data)) failures.push(`${id}/evals/${f} ${e.path}: ${e.msg}`);
    // Evidence ceiling: implied positive state may not exceed the design's ceiling.
    const implied = data.implied_evidence_status;
    const impliedOrder = ORDER.get(implied);
    const ceilingState = CEILING[data.design];
    const ceilingOrder = ORDER.get(ceilingState);
    if (impliedOrder != null && impliedOrder >= 1 && impliedOrder <= 4 && impliedOrder > ceilingOrder) {
      failures.push(`${id}/evals/${f}: implied_evidence_status ${implied} exceeds the ${data.design} ceiling ${ceilingState}`);
    }
  }
  return { checked, failures };
}

function main() {
  const mode = process.argv[2];
  const runTests = !mode || mode === '--tests';
  const runEvals = !mode || mode === '--evals';
  const packs = U.listPacks();
  let failed = 0;

  if (runTests) {
    console.log('# tests (EXAMPLE_CONFORMANCE gate — offline, checks shipped examples, runs no model)');
    let total = 0, passed = 0;
    for (const id of packs) {
      const r = runTestsForPack(id);
      total += r.total; passed += r.passed;
      if (r.failures.length) { failed++; console.log(`  ✗ ${id}: ${r.passed}/${r.total}`); r.failures.forEach(x => console.log('      - ' + x)); }
      else console.log(`  ✓ ${id}: ${r.passed}/${r.total}`);
    }
    console.log(`  tests total: ${passed}/${total}\n`);
  }

  if (runEvals) {
    console.log('# evals (design validity + evidence ceiling)');
    for (const id of packs) {
      const r = runEvalsForPack(id);
      if (r.failures.length) { failed++; console.log(`  ✗ ${id}: ${r.checked} result file(s)`); r.failures.forEach(x => console.log('      - ' + x)); }
      else console.log(`  ✓ ${id}: ${r.checked} result file(s) valid, ceiling respected`);
    }
    console.log('  note: offline — no live runs; does not grant CROSS_MODEL_REPRODUCED.\n');
  }

  process.exit(failed ? 1 : 0);
}

if (require.main === module) main();
module.exports = { runTestsForPack, runEvalsForPack };
