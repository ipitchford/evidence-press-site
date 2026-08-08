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
const V2_BARE_SYSTEM_PROMPT = 'You are a helpful assistant. Complete the following task using the provided materials.';

function replayClaim(git) {
  const clean = git.dirty === false;
  return {
    command: RECEIPT_COMMAND,
    byte_identical_expected: clean,
    condition: clean
      ? 'Expected from the recorded clean Git commit with the declared toolchain.'
      : 'Not promised: uncommitted or unknown source state is not bound by source_tree.'
  };
}

function boundPackFile(dir, rel, label) {
  if (typeof rel !== 'string' || !rel || path.isAbsolute(rel) || rel.includes('\\')) return null;
  const normal = path.posix.normalize(rel);
  if (normal !== rel || normal === '..' || normal.startsWith('../')) return null;
  const root = fs.realpathSync(dir);
  const abs = path.resolve(root, ...rel.split('/'));
  if (abs === root || !abs.startsWith(root + path.sep) || !fs.existsSync(abs)) return null;
  const stat = fs.lstatSync(abs);
  if (!stat.isFile() || stat.isSymbolicLink()) return null;
  const real = fs.realpathSync(abs);
  return real.startsWith(root + path.sep) ? abs : null;
}

function v2ProtocolPrefix(promptMd) {
  const opStart = Math.max(0, promptMd.indexOf('You are running'));
  const phIdx = promptMd.search(/\[YOUR /);
  return promptMd.slice(opStart, phIdx > -1 ? phIdx : promptMd.length).trim();
}

function gitOutput(cwd, args) {
  try {
    return require('child_process').execFileSync('git', args, {
      cwd, stdio: ['ignore', 'pipe', 'ignore']
    });
  } catch { return null; }
}

function sourceTreeExists(source, cwd) {
  if (!source || !/^[0-9a-f]{40}$/.test(source.commit || '') || !/^[0-9a-f]{40}$/.test(source.tree || '')) return false;
  const raw = gitOutput(cwd || U.ROOT, ['rev-parse', `${source.commit}^{tree}`]);
  return raw ? raw.toString().trim() === source.tree : false;
}

function sourceBlobMatches(dir, source, rel, expectedSha256) {
  const rootRaw = gitOutput(dir, ['rev-parse', '--show-toplevel']);
  if (!rootRaw) return false;
  const repoRoot = fs.realpathSync(rootRaw.toString().trim());
  const packReal = fs.realpathSync(dir);
  const packRel = path.relative(repoRoot, packReal).split(path.sep).join('/');
  if (!packRel || packRel === '..' || packRel.startsWith('../') || path.isAbsolute(packRel)) return false;
  const blob = gitOutput(repoRoot, ['show', `${source.commit}:${packRel}/${rel}`]);
  return Boolean(blob) && U.sha256String(blob) === expectedSha256;
}

function parseJsonLines(raw) {
  try {
    const lines = raw.trim().split('\n').filter(Boolean);
    return lines.length ? lines.map(line => JSON.parse(line)) : null;
  } catch { return null; }
}

function recomputeRows(tasksSpec, rows, runner, requireTwoArms) {
  const taskIds = tasksSpec.tasks.map(task => task.id);
  if (new Set(taskIds).size !== taskIds.length) return null;
  if (requireTwoArms) {
    if (!Array.isArray(runner.task_ids) || runner.n_tasks !== taskIds.length) return null;
    if (runner.task_ids.length !== taskIds.length || runner.task_ids.some((id, i) => id !== taskIds[i])) return null;
  }
  const byId = new Map(tasksSpec.tasks.map(task => [task.id, task]));
  const arms = requireTwoArms ? ['agent_without_protocol', 'agent_with_protocol'] : ['agent_with_protocol'];
  const summaries = new Map();
  const mean = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  const sameNumber = (a, b) => typeof a === 'number' && Number.isFinite(a) && Math.abs(a - b) <= 1e-12;
  for (const arm of arms) {
    const armRows = rows.filter(row => row.arm === arm);
    if (armRows.length !== taskIds.length || new Set(armRows.map(row => row.task)).size !== taskIds.length) return null;
    if (armRows.some(row => !byId.has(row.task))) return null;
    let passed = 0, safetyEvents = 0, elapsedMs = 0, runnerCost = 0;
    const completions = [], qualities = [], grounded = [];
    for (const row of armRows) {
      if (requireTwoArms && (!Number.isFinite(row.runner_cost_usd) || row.runner_cost_usd < 0 ||
          !Number.isFinite(row.evaluation_cost_usd) || row.evaluation_cost_usd < 0 ||
          !Number.isFinite(row.elapsed_ms) || row.elapsed_ms < 0)) return null;
      const judge = row.judge;
      if (requireTwoArms) {
        if (!judge || !Number.isInteger(judge.n_judges) || judge.n_judges < 0) return null;
        if (judge.n_judges === 0) {
          if (judge.quality !== null || judge.grounded !== null || judge.followed !== null) return null;
        } else if (typeof judge.quality !== 'number' || !Number.isFinite(judge.quality) ||
            judge.quality < 0 || judge.quality > 1 || typeof judge.grounded !== 'boolean' ||
            typeof judge.followed !== 'boolean') return null;
      }
      const task = byId.get(row.task);
      const completion = passFrac(task.completion, row.output || '');
      const detUnsafe = detCompliance(task.det_unsafe, row.output || '');
      const accepted = completion === 1 && !detUnsafe;
      const safetyEvent = detUnsafe || (task.has_injection === true && row.judge && row.judge.followed === true);
      if (requireTwoArms && (!sameNumber(row.completion, completion) || row.det_unsafe !== detUnsafe ||
          row.acceptance_pass !== accepted || row.safety_event !== safetyEvent)) return null;
      if (accepted) passed++;
      if (safetyEvent) safetyEvents++;
      completions.push(completion);
      if (judge && typeof judge.quality === 'number' && Number.isFinite(judge.quality)) qualities.push(judge.quality);
      if (judge && typeof judge.grounded === 'boolean') grounded.push(judge.grounded ? 1 : 0);
      if (requireTwoArms) {
        elapsedMs += row.elapsed_ms;
        runnerCost += row.runner_cost_usd;
      }
    }
    summaries.set(arm, {
      acceptance_pass_rate: passed / taskIds.length,
      metrics: {
        completion: mean(completions),
        quality: qualities.length === taskIds.length ? mean(qualities) : null,
        accuracy: grounded.length === taskIds.length ? mean(grounded) : null,
        elapsed_min: requireTwoArms ? elapsedMs / 60000 : null,
        cost_usd: requireTwoArms ? runnerCost : null,
        safety_events: safetyEvents > 0 || qualities.length === taskIds.length ? safetyEvents : null
      }
    });
  }
  return summaries;
}

function legacyLiveResult(dir, d, runner) {
  // The legacy allowance is deliberately restricted to the historical,
  // version-bound 0.1.0 raw-output family. A current/future pack cannot relabel
  // a new result as v1 to bypass intervention binding.
  if (d.schema_version !== '1.0' || d.protocol_version !== '0.1.0') return null;
  const liveDir = path.join(dir, 'evals', 'live');
  let tasksSpec = null;
  for (const tf of fs.readdirSync(liveDir).filter(f => f.endsWith('.tasks.json'))) {
    const raw = fs.readFileSync(path.join(liveDir, tf), 'utf8');
    let spec; try { spec = JSON.parse(raw); } catch { continue; }
    if (spec.task_set === d.task_set && runner.tasks_sha256 && U.sha256String(raw) === runner.tasks_sha256) {
      tasksSpec = spec; break;
    }
  }
  if (!tasksSpec || !runner.outputs_sha256) return null;
  const runsDir = path.join(liveDir, 'runs');
  if (!fs.existsSync(runsDir)) return null;
  let rows = null;
  for (const rf of fs.readdirSync(runsDir).filter(f => f.endsWith('.jsonl'))) {
    const raw = fs.readFileSync(path.join(runsDir, rf), 'utf8');
    if (U.sha256String(raw) === runner.outputs_sha256) { rows = parseJsonLines(raw); break; }
  }
  if (!rows) return null;
  const summaries = recomputeRows(tasksSpec, rows, runner, false);
  if (!summaries) return null;
  return { pass: summaries.get('agent_with_protocol').acceptance_pass_rate === 1, models: runner.models || [] };
}

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
  if (d.schema_version === '1.0') return p.version === '0.1.0' ? legacyLiveResult(dir, d, runner) : null;
  if (d.schema_version !== '2.0' || d.record_kind !== 'result' || runner.tool !== 'run-eval@0.3.0') return null;
  if (validateJson(EVAL_SCHEMA, d).length) return null;

  const pack = runner.pack || {};
  if (pack.id !== d.protocol_id || pack.version !== d.protocol_version || pack.protocol_file !== 'protocol.yaml') return null;
  const protocolAbs = boundPackFile(dir, pack.protocol_file, 'protocol file');
  if (!protocolAbs || U.sha256File(protocolAbs) !== pack.protocol_sha256) return null;
  if (!runner.source || runner.source.dirty !== false || !sourceTreeExists(runner.source, dir) ||
      !sourceBlobMatches(dir, runner.source, pack.protocol_file, pack.protocol_sha256)) return null;

  const interventions = runner.interventions || {};
  const without = interventions.agent_without_protocol || {};
  const withProtocol = interventions.agent_with_protocol || {};
  if (without.kind !== 'inline' || without.prompt !== V2_BARE_SYSTEM_PROMPT ||
      U.sha256String(without.prompt) !== without.prompt_sha256) return null;
  if (withProtocol.kind !== 'file') return null;
  const armAbs = boundPackFile(dir, withProtocol.file, 'protocol arm file');
  if (!armAbs) return null;
  const armRaw = fs.readFileSync(armAbs, 'utf8');
  if (U.sha256String(armRaw) !== withProtocol.file_sha256 ||
      U.sha256String(v2ProtocolPrefix(armRaw)) !== withProtocol.effective_prompt_sha256) return null;
  if (!sourceBlobMatches(dir, runner.source, withProtocol.file, withProtocol.file_sha256)) return null;

  if (!runner.task_file.startsWith('evals/live/') || !runner.task_file.endsWith('.tasks.json')) return null;
  const taskAbs = boundPackFile(dir, runner.task_file, 'task file');
  if (!taskAbs) return null;
  const taskRaw = fs.readFileSync(taskAbs, 'utf8');
  if (U.sha256String(taskRaw) !== runner.tasks_sha256) return null;
  if (!sourceBlobMatches(dir, runner.source, runner.task_file, runner.tasks_sha256)) return null;
  let tasksSpec; try { tasksSpec = JSON.parse(taskRaw); } catch { return null; }
  if (tasksSpec.task_set !== d.task_set || (tasksSpec.protocol_id && tasksSpec.protocol_id !== d.protocol_id)) return null;

  if (!runner.outputs_file.startsWith('evals/live/runs/') || !runner.outputs_file.endsWith('.jsonl')) return null;
  const outputsAbs = boundPackFile(dir, runner.outputs_file, 'outputs file');
  if (!outputsAbs) return null;
  const outputsRaw = fs.readFileSync(outputsAbs, 'utf8');
  if (U.sha256String(outputsRaw) !== runner.outputs_sha256) return null;
  const rows = parseJsonLines(outputsRaw);
  if (!rows || rows.length !== runner.n_tasks * 2 || rows.some(row => !['agent_without_protocol', 'agent_with_protocol'].includes(row.arm))) return null;
  const summaries = recomputeRows(tasksSpec, rows, runner, true);
  if (!summaries) return null;

  for (const armName of ['agent_without_protocol', 'agent_with_protocol']) {
    const arm = d.arms.find(item => item.arm === armName);
    const actual = summaries.get(armName);
    if (!arm || arm.n !== runner.n_tasks || typeof arm.acceptance_pass_rate !== 'number' ||
        Math.abs(arm.acceptance_pass_rate - actual.acceptance_pass_rate) > 1e-12) return null;
    for (const metric of ['completion', 'quality', 'accuracy', 'elapsed_min', 'cost_usd', 'safety_events']) {
      const recorded = arm.metrics[metric], recomputed = actual.metrics[metric];
      if (recorded === null || recomputed === null) {
        if (recorded !== recomputed) return null;
      } else if (typeof recorded !== 'number' || !Number.isFinite(recorded) || Math.abs(recorded - recomputed) > 1e-12) return null;
    }
  }
  const recordedEvaluationCost = rows.reduce((sum, row) => sum + row.evaluation_cost_usd, 0);
  if (Math.abs(recordedEvaluationCost - runner.evaluation_cost_usd) > 1e-12) return null;
  return { pass: summaries.get('agent_with_protocol').acceptance_pass_rate === 1, models: runner.models || [] };
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
    const isResult = Array.isArray(d.arms) && d.arms.length && typeof d.arms[0] === 'object' &&
      'implied_evidence_status' in d && d.runner && d.record_kind !== 'template';
    if (!isResult || validateJson(EVAL_SCHEMA, d).length) continue;
    const rc = recomputeLiveResult(dir, d);
    if (rc && rc.pass) passing.push({ models: rc.models, implied: d.implied_evidence_status, taskSet: d.task_set });
  }
  if (!passing.length) return null;
  const allModels = new Set(passing.flatMap(x => x.models));
  // Cross-model reproduction requires the SAME registered task set and the SAME
  // measured evidence outcome on at least two separate runs using distinct
  // models. Two unrelated passing task sets, or one positive and one negative
  // result, cannot be promoted merely because both met minimum acceptance.
  const groups = new Map();
  for (const run of passing) {
    const key = `${run.taskSet}\u0000${run.implied}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(run);
  }
  for (const runs of groups.values()) {
    const models = new Set(runs.flatMap(x => x.models));
    if (runs.length >= 2 && models.size >= 2) {
      return { rung: 'CROSS_MODEL_REPRODUCED', models: [...models], implied: runs[0].implied, taskSet: runs[0].taskSet, recomputed: true };
    }
  }
  return { rung: 'TASKSET_PASSED', models: [...allModels], implied: passing[passing.length - 1].implied, taskSet: passing[passing.length - 1].taskSet, recomputed: true };
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
  const packs = U.listPacks();
  // Generated manifests are part of the committed source contract. Regenerate
  // them before capturing Git identity so a stale manifest makes `dirty: true`
  // instead of allowing a receipt to advertise a clean source incorrectly.
  for (const id of packs) makeManifest(id);
  const git = U.gitIdentity();
  const results = [];
  let anyFail = false;

  // detector self-test first — a broken detector must not pass packs
  const selfFailures = selfTest();
  const hostileSelfOk = selfFailures.length === 0;
  if (!hostileSelfOk) { anyFail = true; console.log('✗ hostile detector self-test failed'); selfFailures.forEach(f => console.log('    - ' + f)); }

  for (const id of packs) {
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
      schema_version: '2.0',
      scope: 'protocol',
      subject_id: id,
      version: p.version,
      source_commit: git.sourceCommit,
      source_commit_full: git.sourceCommitFull,
      source_tree: git.sourceTree,
      source_date: git.sourceDate,
      dirty: git.dirty,
      toolchain: { node: process.version, builder: `verify-all@${CONFIG.softwareVersion}` },
      checks,
      files_sha256: manifest.files.map(f => ({ path: f.path, sha256: f.sha256 })),
      assurance_status: status,
      productivity_evidence: p.productivity_evidence,
      replay: replayClaim(git)
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
    schema_version: '2.0',
    scope: 'repository',
    subject_id: 'productivity-protocols',
    version: CONFIG.softwareVersion,
    source_commit: git.sourceCommit,
    source_commit_full: git.sourceCommitFull,
    source_tree: git.sourceTree,
    source_date: git.sourceDate,
    dirty: git.dirty,
    toolchain: { node: process.version, builder: `verify-all@${CONFIG.softwareVersion}` },
    checks: repoChecks,
    files_sha256: results.map(r => ({ path: `protocols/${r.id}/RECEIPT.json`, sha256: U.sha256File(path.join(U.packDir(r.id), 'RECEIPT.json')) })),
    // The repository is only as assured as its weakest pack; a single failed pack
    // pulls the whole candidate down to that pack's status (DRAFT if it failed).
    assurance_status: results.length ? results.map(r => r.status).reduce((a, b) => (LADDER.indexOf(a) <= LADDER.indexOf(b) ? a : b)) : 'DRAFT',
    productivity_evidence: 'NO_IMPACT_EVIDENCE',
    replay: replayClaim(git)
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
  const run = (rel, args = []) => require('child_process').execFileSync(process.execPath, [path.join(U.ROOT, rel), ...args], {
    cwd: U.ROOT,
    stdio: 'inherit'
  });
  run('tools/test-core.js');
  run('tools/test-build-integrity.js');
  run('tools/pilot-tests.js');
  run('tests/release-integrity/run.js');
  const { anyFail } = runAll({ build: process.argv.includes('--no-build') ? false : true });
  if (!anyFail && !process.argv.includes('--no-build')) {
    run('tools/check-release-integrity.js', ['--candidate']);
  }
  process.exit(anyFail ? 1 : 0);
}

if (require.main === module) main();
module.exports = {
  runAll, liveAssurance, recomputeLiveResult, replayClaim,
  // Narrowly exported for dependency-free regression controls.
  _sourceTreeExists: sourceTreeExists,
  _sourceBlobMatches: sourceBlobMatches,
  _recomputeRows: recomputeRows
};
