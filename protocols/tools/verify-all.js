#!/usr/bin/env node
'use strict';
/*
 * verify-all.js — the single command that runs every gate and writes the
 * receipts. Order: make-manifest -> validate -> tests -> evals -> hostile ->
 * per-pack + repository receipts -> build. Exit non-zero if any gate fails.
 *
 * The receipt records the ACHIEVED assurance status — never higher than the
 * gates justify. The OFFLINE gates cap at EXAMPLE_CONFORMANCE_VALIDATED (they run
 * no model). TASKSET_PASSED is granted only when a committed live-eval result
 * RECOMPUTES a passing agent-with-protocol arm from its raw outputs (see
 * liveAssurance). CROSS_MODEL_REPRODUCED needs >= 2 separate passing runs;
 * SECURITY_REVIEWED needs a human review — neither is claimed here automatically.
 *
 * Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const { load } = require('./lib/yaml');
const U = require('./lib/util');
const { makeManifest } = require('./make-manifest');
const { validatePack } = require('./validate');
const { runTestsForPack, runEvalsForPack } = require('./eval-harness');
const { scanPack, selfTest } = require('./hostile-tests');

const { validate: validateJson } = require('./lib/jsonschema');
const { passFrac, detCompliance } = require('./lib/graders');
const EVAL_SCHEMA = U.readJSON(path.join(U.ROOT, 'schema', 'eval-result.schema.json'));
const CONFIG = U.readJSON(path.join(U.ROOT, 'site.config.json'));
const RECEIPT_COMMAND = 'node tools/verify-all.js';

// RECOMPUTE a live result's acceptance from the COMMITTED raw outputs — never
// trust the runner-written taskset_passed boolean or author-computed metrics
// (that would be the original self-grading defect, one layer removed). The result
// must bind to this pack + version, and its referenced task set and raw-outputs
// files must match the SHA-256s recorded in the result. Acceptance is recomputed
// with the deterministic graders only (completion + non-negated compliance); the
// blind-judge signals are advisory and do not gate the rung. Returns {pass, models}
// or null (untrusted / unverifiable → not granted).
function recomputeLiveResult(dir, d) {
  const liveDir = path.join(dir, 'evals', 'live');
  if (!fs.existsSync(liveDir)) return null;
  const runner = d.runner || {};
  const p = load(fs.readFileSync(path.join(dir, 'protocol.yaml'), 'utf8'));
  if (d.protocol_id !== path.basename(dir) || d.protocol_version !== p.version) return null;
  // task set: locate by task_set id and verify its hash
  let tasksSpec = null;
  for (const tf of fs.readdirSync(liveDir).filter(f => f.endsWith('.tasks.json'))) {
    const raw = fs.readFileSync(path.join(liveDir, tf), 'utf8');
    let spec; try { spec = JSON.parse(raw); } catch { continue; }
    if (spec.task_set === d.task_set) {
      if (runner.tasks_sha256 && U.sha256String(raw) !== runner.tasks_sha256) return null;
      tasksSpec = spec; break;
    }
  }
  if (!tasksSpec) return null;
  // raw outputs: locate the jsonl whose hash matches the recorded outputs_sha256
  const runsDir = path.join(liveDir, 'runs');
  if (!fs.existsSync(runsDir)) return null;
  let rows = null;
  for (const rf of fs.readdirSync(runsDir).filter(f => f.endsWith('.jsonl'))) {
    const raw = fs.readFileSync(path.join(runsDir, rf), 'utf8');
    if (runner.outputs_sha256 && U.sha256String(raw) === runner.outputs_sha256) {
      rows = raw.trim().split('\n').map(l => JSON.parse(l)); break;
    }
  }
  if (!rows) return null;
  const byId = new Map(tasksSpec.tasks.map(t => [t.id, t]));
  const withRows = rows.filter(r => r.arm === 'agent_with_protocol');
  if (withRows.length !== tasksSpec.tasks.length) return null;
  for (const r of withRows) {
    const task = byId.get(r.task); if (!task) return null;
    const completion = passFrac(task.completion, r.output || '');
    const detUnsafe = detCompliance(task.det_unsafe, r.output || '');
    if (!(completion === 1 && !detUnsafe)) return { pass: false, models: runner.models || [] };
  }
  return { pass: true, models: runner.models || [] };
}

// A pack earns TASKSET_PASSED from >=1 recomputed-passing live result;
// CROSS_MODEL_REPRODUCED requires >= 2 SEPARATE passing runs with >= 2 distinct
// models (one result file listing two models cannot fake it). Absence of a live
// run is not a failure — the pack stays at its offline rung.
function liveAssurance(dir) {
  const evalsDir = path.join(dir, 'evals');
  if (!fs.existsSync(evalsDir)) return null;
  const passing = [];
  for (const f of fs.readdirSync(evalsDir).filter(f => f.endsWith('.json'))) {
    const d = U.readJSON(path.join(evalsDir, f));
    const isResult = Array.isArray(d.arms) && d.arms.length && typeof d.arms[0] === 'object' && 'implied_evidence_status' in d && d.runner;
    if (!isResult || validateJson(EVAL_SCHEMA, d).length) continue;
    const rc = recomputeLiveResult(dir, d);
    if (rc && rc.pass) passing.push({ models: rc.models, implied: d.implied_evidence_status });
  }
  if (!passing.length) return null;
  const distinct = new Set(passing.flatMap(x => x.models));
  const rung = (passing.length >= 2 && distinct.size >= 2) ? 'CROSS_MODEL_REPRODUCED' : 'TASKSET_PASSED';
  return { rung, models: [...distinct], implied: passing[passing.length - 1].implied, recomputed: true };
}

const LADDER = ['DRAFT', 'STRUCTURE_VALIDATED', 'EXAMPLE_CONFORMANCE_VALIDATED', 'TASKSET_PASSED', 'CROSS_MODEL_REPRODUCED', 'SECURITY_REVIEWED', 'FIELD_READY'];

// The offline pipeline can honestly reach EXAMPLE_CONFORMANCE_VALIDATED and no
// higher: it checks the pack's own worked examples against deterministic graders
// (tests) and the eval designs (evals), but it runs no model over a fresh task.
// TASKSET_PASSED and above require live runs this command does not perform.
function achievedStatus({ validateOk, exampleOk, hostileOk }) {
  if (!hostileOk) return 'DRAFT';           // a security finding blocks any positive claim
  if (validateOk && exampleOk) return 'EXAMPLE_CONFORMANCE_VALIDATED';
  if (validateOk) return 'STRUCTURE_VALIDATED';
  return 'DRAFT';
}

function runAll(opts) {
  opts = opts || {};
  const git = U.gitIdentity();
  const packs = U.listPacks();
  const results = [];
  let anyFail = false;

  // detector self-test first — a broken detector must not pass packs
  const selfFailures = selfTest();
  const hostileSelfOk = selfFailures.length === 0;
  if (!hostileSelfOk) { anyFail = true; console.log('✗ hostile detector self-test failed'); selfFailures.forEach(f => console.log('    - ' + f)); }

  for (const id of packs) {
    makeManifest(id);
    const validateErrs = validatePack(id);
    const tests = runTestsForPack(id);
    const evals = runEvalsForPack(id);
    const hostileFindings = scanPack(id);

    const validateOk = validateErrs.length === 0;
    const testsOk = tests.failures.length === 0 && tests.total > 0;
    const evalsOk = evals.failures.length === 0;
    const exampleOk = testsOk && evalsOk;               // the EXAMPLE_CONFORMANCE gate needs both
    const hostileOk = hostileSelfOk && hostileFindings.length === 0;
    const packOk = validateOk && exampleOk && hostileOk;
    if (!packOk) anyFail = true;

    const p = load(fs.readFileSync(path.join(U.packDir(id), 'protocol.yaml'), 'utf8'));
    const manifest = U.readJSON(path.join(U.packDir(id), 'MANIFEST.json'));
    const offlineStatus = achievedStatus({ validateOk, exampleOk, hostileOk });
    // A live run can raise the rung above the offline ceiling — only from EXAMPLE_
    // CONFORMANCE_VALIDATED (all offline gates must already pass).
    const live = offlineStatus === 'EXAMPLE_CONFORMANCE_VALIDATED' ? liveAssurance(U.packDir(id)) : null;
    // A maintainer-set DEPRECATED source status is terminal: the gates never un-deprecate a pack.
    const status = p.assurance_status === 'DEPRECATED' ? 'DEPRECATED' : (live ? live.rung : offlineStatus);

    const checks = [
      { name: 'manifest', passed: true, summary: `${manifest.files.length} files hashed` },
      { name: 'validate', passed: validateOk, summary: validateOk ? 'schema + kernel invariants ok' : validateErrs.join('; ') },
      { name: 'tests', passed: testsOk, summary: `${tests.passed}/${tests.total} cases`, counts: { total: tests.total, passed: tests.passed, failed: tests.total - tests.passed } },
      { name: 'evals', passed: evalsOk, summary: evalsOk ? 'eval designs valid, ceiling respected' : evals.failures.join('; ') },
      { name: 'hostile', passed: hostileOk, summary: hostileOk ? 'clean' : hostileFindings.join('; ') }
    ];
    // Only recorded when a live run exists; its absence is not a failed gate.
    if (live) checks.push({ name: 'live', passed: true, summary: `taskset_passed on ${live.models.join(', ')} → ${live.rung} (measured evidence: ${live.implied})` });

    const receipt = {
      schema_version: '1.0',
      scope: 'protocol',
      subject_id: id,
      version: p.version,
      source_commit: git.sourceCommit,
      source_date: git.sourceDate,
      toolchain: { node: process.version, builder: `verify-all@${CONFIG.softwareVersion}` },
      checks,
      files_sha256: manifest.files.map(f => ({ path: f.path, sha256: f.sha256 })),
      assurance_status: status,
      productivity_evidence: p.productivity_evidence,
      replay: { command: RECEIPT_COMMAND, byte_identical_expected: true }
    };
    fs.writeFileSync(path.join(U.packDir(id), 'RECEIPT.json'), JSON.stringify(receipt, null, 2) + '\n');
    results.push({ id, packOk, status, tests, validateErrs, evals, hostileFindings });
  }

  // repository receipt
  const repoChecks = ['manifest', 'validate', 'tests', 'evals', 'hostile'].map(name => {
    const passedAll = results.every(r => {
      if (name === 'validate') return r.validateErrs.length === 0;
      if (name === 'tests') return r.tests.failures.length === 0 && r.tests.total > 0;
      if (name === 'evals') return r.evals.failures.length === 0;
      if (name === 'hostile') return hostileSelfOk && r.hostileFindings.length === 0;
      return true;
    });
    return { name, passed: passedAll, summary: `${results.filter(r => r.packOk).length}/${results.length} packs` };
  });
  const repoReceipt = {
    schema_version: '1.0',
    scope: 'repository',
    subject_id: 'productivity-protocols',
    version: CONFIG.softwareVersion,
    source_commit: git.sourceCommit,
    source_date: git.sourceDate,
    toolchain: { node: process.version, builder: `verify-all@${CONFIG.softwareVersion}` },
    checks: repoChecks,
    files_sha256: results.map(r => ({ path: `protocols/${r.id}/RECEIPT.json`, sha256: U.sha256File(path.join(U.packDir(r.id), 'RECEIPT.json')) })),
    // The repository is only as assured as its weakest pack; a single failed pack
    // pulls the whole candidate down to that pack's status (DRAFT if it failed).
    assurance_status: results.length ? results.map(r => r.status).reduce((a, b) => (LADDER.indexOf(a) <= LADDER.indexOf(b) ? a : b)) : 'DRAFT',
    productivity_evidence: 'NO_IMPACT_EVIDENCE',
    replay: { command: RECEIPT_COMMAND, byte_identical_expected: true }
  };
  fs.writeFileSync(path.join(U.ROOT, 'RECEIPT.json'), JSON.stringify(repoReceipt, null, 2) + '\n');

  // report
  console.log('\n# verify-all');
  for (const r of results) {
    console.log(`  ${r.packOk ? '✓' : '✗'} ${r.id} → ${r.status} (tests ${r.tests.passed}/${r.tests.total})`);
    if (!r.packOk) {
      r.validateErrs.forEach(e => console.log('      validate: ' + e));
      r.tests.failures.forEach(e => console.log('      tests: ' + e));
      r.evals.failures.forEach(e => console.log('      evals: ' + e));
      r.hostileFindings.forEach(e => console.log('      hostile: ' + e));
    }
  }

  if (opts.build !== false) {
    if (anyFail) {
      console.log('\n(build skipped: one or more gates failed — publishable output is never built on a failed gate)');
    } else {
      console.log('');
      require('../build-protocols').main();
    }
  }
  console.log(`\nverify-all: ${results.filter(r => r.packOk).length}/${results.length} packs pass every gate; repo receipt written.`);
  return { anyFail, results };
}

function main() {
  const { anyFail } = runAll({ build: process.argv.includes('--no-build') ? false : true });
  process.exit(anyFail ? 1 : 0);
}

if (require.main === module) main();
module.exports = { runAll, liveAssurance, recomputeLiveResult };
