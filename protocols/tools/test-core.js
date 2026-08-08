#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');
const { validate } = require('./lib/jsonschema');
const tar = require('./lib/tar');
const U = require('./lib/util');
const {
  liveAssurance, recomputeLiveResult, replayClaim,
  _sourceTreeExists, _sourceBlobMatches, _recomputeRows
} = require('./verify-all');
const { BARE_SYSTEM_PROMPT, buildResultRecord, packRelativeFile, requireNewRunArtifacts, requireCleanEvaluationSource, extractProtocolPrefix, aggregate } = require('./run-eval');
const { validateSkillFrontmatter, positiveResultSupported } = require('./validate');
const { evidenceCeiling } = require('./eval-harness');

function testDateTimeFormat() {
  const schema = { type: 'string', format: 'date-time' };
  assert.deepStrictEqual(validate(schema, '2026-08-08T12:00:00Z'), []);
  assert.deepStrictEqual(validate(schema, '2026-08-08T12:00:00+01:00'), []);
  assert(validate(schema, '2026-08-08T12:00:00').length > 0, 'timezone-free date-time must fail');
  assert(validate(schema, '2026-99-99T12:00:00Z').length > 0, 'impossible date-time must fail');
  assert(validate(schema, '2026-02-30T12:00:00Z').length > 0, 'impossible calendar day must fail');
  assert(validate(schema, '2026-08-08T25:00:00Z').length > 0, 'impossible time must fail');
  const dateSchema = { type: 'string', format: 'date' };
  assert.deepStrictEqual(validate(dateSchema, '2028-02-29'), []);
  assert(validate(dateSchema, '2027-02-29').length > 0, 'invalid leap day must fail');
}

function testExclusiveMinimum() {
  const schema = { type: 'number', exclusiveMinimum: 0 };
  assert.deepStrictEqual(validate(schema, 0.01), []);
  assert(validate(schema, 0).length > 0, 'exclusive boundary must fail');
  assert(validate(schema, -1).length > 0, 'values below the exclusive boundary must fail');
}

function testConditionalSchemaBranches() {
  const schema = {
    type: 'object',
    properties: {
      kind: { enum: ['future', 'legacy'] },
      binding: { type: 'string' },
      legacy_note: { type: 'string' }
    },
    required: ['kind'],
    if: { properties: { kind: { const: 'future' } }, required: ['kind'] },
    then: { required: ['binding'] },
    else: { required: ['legacy_note'] }
  };
  assert.deepStrictEqual(validate(schema, { kind: 'future', binding: 'hash-bound' }), []);
  assert(validate(schema, { kind: 'future', legacy_note: 'wrong branch' }).some(e => e.msg.includes("'binding'")),
    'true conditional branch must be enforced');
  assert.deepStrictEqual(validate(schema, { kind: 'legacy', legacy_note: 'preserved' }), []);
  assert(validate(schema, { kind: 'legacy', binding: 'wrong branch' }).some(e => e.msg.includes("'legacy_note'")),
    'false conditional branch must be enforced');
}

function testGitIdentity() {
  const git = U.gitIdentity();
  assert.match(git.sourceCommitFull, /^[0-9a-f]{40}$/);
  assert.match(git.sourceTree, /^[0-9a-f]{40}$/);
  assert.strictEqual(typeof git.dirty, 'boolean');
  assert.strictEqual(U.NODE_COMPATIBILITY, U.readJSON(path.join(U.ROOT, 'package.json')).engines.node,
    'receipt Node compatibility must match package.engines.node');
}

function testWalkerRejectsSymlinks() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-walk-control-'));
  try {
    fs.writeFileSync(path.join(tmpRoot, 'regular.txt'), 'bounded\n');
    fs.symlinkSync(path.join(tmpRoot, 'regular.txt'), path.join(tmpRoot, 'link.txt'));
    assert.throws(() => U.walk(tmpRoot), /refusing symbolic link/);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

function testReplayBoundary() {
  assert.strictEqual(replayClaim({ dirty: false }).byte_identical_expected, true);
  assert.strictEqual(replayClaim({ dirty: true }).byte_identical_expected, false);
  assert.strictEqual(replayClaim({ dirty: null }).byte_identical_expected, false);
}

function testAgentSkillsFrontmatter() {
  const good = {
    name: 'document-to-action-plan',
    description: 'Extract source-linked actions. Use for supplied business documents.',
    license: 'Apache-2.0',
    metadata: { protocol_version: '0.1.0' },
    'allowed-tools': 'Read'
  };
  assert.deepStrictEqual(validateSkillFrontmatter(good, good.name), []);
  const bad = { ...good, 'allowed-tools': ['read'] };
  assert(validateSkillFrontmatter(bad, good.name).some(x => x.includes('space-separated string')),
    'the formerly shipped YAML-list shape must be rejected');
}

function testPositiveEvidenceDecision() {
  const result = {
    evidence_profile: {
      setting: 'benchmark',
      study_stage: 'development',
      identification: 'descriptive',
      review_status: 'internal',
      claim_boundary: 'Synthetic control only.'
    },
    arms: [
      { arm: 'agent_without_protocol', acceptance_pass_rate: 0.7, metrics: { safety_events: 0 } },
      { arm: 'agent_with_protocol', acceptance_pass_rate: 0.9, metrics: { safety_events: 0 } }
    ],
    decision: {
      primary_outcome: 'acceptance_pass_rate',
      direction: 'higher_is_better',
      smallest_worthwhile_difference: 0.1,
      observed_difference: 0.2,
      registered_before_results: true,
      blocking_regressions: [],
      supports_gain: true
    }
  };
  assert.strictEqual(positiveResultSupported(result, 'BENCHMARK_SIGNAL'), false,
    'candidate v0.2 must not auto-promote even a favourable declared point estimate');
  assert.strictEqual(positiveResultSupported({ ...result, decision: undefined }, 'BENCHMARK_SIGNAL'), false,
    'a favourable metric without a registered decision must not earn a benefit status');
  const safetyRegression = JSON.parse(JSON.stringify(result));
  safetyRegression.arms[1].metrics.safety_events = 1;
  assert.strictEqual(positiveResultSupported(safetyRegression, 'BENCHMARK_SIGNAL'), false);
  assert.strictEqual(positiveResultSupported(result, 'CONTROLLED_USER_SIGNAL'), false,
    'a benchmark must not exceed its design ceiling');
}

function testEvidenceProfileDimensions() {
  assert.strictEqual(evidenceCeiling({
    setting: 'organizational_field', study_stage: 'feasibility',
    identification: 'observational', review_status: 'internal'
  }), 'NO_IMPACT_EVIDENCE', 'field setting plus feasibility must not become a positive signal');
  assert.strictEqual(evidenceCeiling({
    setting: 'organizational_field', study_stage: 'confirmatory',
    identification: 'observational', review_status: 'independently_reviewed'
  }), 'FIELD_SIGNAL', 'reviewed organizational observation is not automatically causal');
  assert.strictEqual(evidenceCeiling({
    setting: 'controlled_user', study_stage: 'confirmatory',
    identification: 'randomized', review_status: 'independently_reviewed'
  }), 'CAUSAL_EFFECT_SUPPORTED', 'causal ceiling depends on identification and review, not field setting');
}

function testCrossModelRequiresSameOutcome() {
  const source = U.packDir('goal-to-verified-deliverable');
  assert.strictEqual(liveAssurance(source), null,
    '0.1.0 predecessor runs must not certify the current 0.1.1 pack');

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-live-assurance-'));
  const copy = path.join(tmpRoot, 'goal-to-verified-deliverable');
  try {
    fs.cpSync(source, copy, { recursive: true });
    const protocolFile = path.join(copy, 'protocol.yaml');
    const historicalProtocol = fs.readFileSync(protocolFile, 'utf8')
      .replace('version: 0.1.1', 'version: 0.1.0');
    fs.writeFileSync(protocolFile, historicalProtocol);
    const original = liveAssurance(copy);
    assert(original, 'predecessor live evidence should remain inspectable against its exact version');
    assert.strictEqual(original.rung, 'CROSS_MODEL_REPRODUCED');
    const evalDir = path.join(copy, 'evals');
    const cross = fs.readdirSync(evalDir)
      .find(name => name.includes('gpt-5.2') && name.endsWith('.json'));
    assert(cross, 'cross-model result fixture missing');
    const file = path.join(evalDir, cross);
    const result = JSON.parse(fs.readFileSync(file, 'utf8'));
    result.implied_evidence_status = 'BENCHMARK_SIGNAL';
    fs.writeFileSync(file, JSON.stringify(result, null, 2) + '\n');
    const mutated = liveAssurance(copy);
    assert(mutated, 'mutated evidence should still retain a task-set result');
    assert.strictEqual(mutated.rung, 'TASKSET_PASSED', 'different outcomes must not earn cross-model reproduction');
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

function testRunnerCostBoundary() {
  const arm = aggregate('agent_with_protocol', [{
    acceptance_pass: true,
    completion: 1,
    judge: { quality: 0.9, grounded: true },
    runner_cost_usd: 0.25,
    evaluation_cost_usd: 4.75,
    elapsed_ms: 600,
    safety_event: false
  }]);
  assert.strictEqual(arm.metrics.cost_usd, 0.25,
    'operational cost must exclude blind-judge/evaluation overhead');
}

function testMissingJudgeBoundary() {
  const rows = [{
    acceptance_pass: true,
    completion: 1,
    judge: { quality: null, grounded: null, followed: null, n_judges: 0 },
    runner_cost_usd: 0.25,
    evaluation_cost_usd: 0,
    elapsed_ms: 600,
    safety_event: false
  }];
  const arm = aggregate('agent_with_protocol', rows);
  assert.strictEqual(arm.metrics.quality, null, 'missing judge output is not zero quality');
  assert.strictEqual(arm.metrics.accuracy, null, 'missing judge output is not an accuracy failure');
  assert.strictEqual(arm.metrics.safety_events, null, 'zero safety events is unknown when judge coverage is missing');
}

function testEvaluationMetricBounds() {
  const schema = U.readJSON(path.join(U.ROOT, 'schema', 'eval-result.schema.json'));
  const record = U.readJSON(path.join(U.packDir('adversarial-output-review'), 'evals', 'result.template.json'));
  record.arms[1].acceptance_pass_rate = 1.01;
  record.arms[1].metrics.cost_usd = -0.01;
  record.arms[1].metrics.quality = 1.2;
  const errors = validate(schema, record);
  assert(errors.some(error => error.path.endsWith('acceptance_pass_rate')), 'acceptance rate above 1 must fail');
  assert(errors.some(error => error.path.endsWith('cost_usd')), 'negative cost must fail');
  assert(errors.some(error => error.path.endsWith('quality')), 'normalised quality above 1 must fail');
}

function testCleanEvaluationSourceRequired() {
  assert.throws(() => requireCleanEvaluationSource({
    sourceCommitFull: 'a'.repeat(40), sourceTree: 'b'.repeat(40), dirty: true
  }), /requires a clean Git source/);
  assert.doesNotThrow(() => requireCleanEvaluationSource({
    sourceCommitFull: 'a'.repeat(40), sourceTree: 'b'.repeat(40), dirty: false
  }));
}

function testUstarLongPathBoundary() {
  const longName = 'productivity-protocols-starter/company-pilot/fixtures/known-bad/pilot-observations-pre-randomization-exclusion-status.json';
  assert(Buffer.byteLength(longName) > 100, 'fixture must exercise the ustar prefix field');
  const archive = tar.build([{ name: longName, data: Buffer.from('{}\n') }], 0);
  const field = (offset, length) => {
    const raw = archive.subarray(offset, offset + length);
    const nul = raw.indexOf(0);
    return raw.subarray(0, nul < 0 ? raw.length : nul).toString('utf8');
  };
  const base = field(0, 100), prefix = field(345, 155);
  assert.strictEqual(`${prefix}/${base}`, longName, 'long ustar paths must round-trip without truncation');
  assert.throws(() => tar.build([{ name: '../escape', data: Buffer.alloc(0) }], 0), /unsafe tar entry name/);
}

function testReleaseSourceOverrideBoundary() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-source-override-'));
  const git = args => childProcess.execFileSync('git', args, {
    cwd: temporary, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
  try {
    git(['init', '-q']);
    git(['config', 'user.name', 'Productivity Protocols test']);
    git(['config', 'user.email', 'test@invalid.example']);
    fs.writeFileSync(path.join(temporary, 'content.txt'), 'substantive input\n');
    git(['add', 'content.txt']);
    git(['commit', '-q', '-m', 'substantive source']);
    const source = git(['rev-parse', 'HEAD']);
    fs.writeFileSync(path.join(temporary, 'PUBLISHED.json'), '{}\n');
    git(['add', 'PUBLISHED.json']);
    git(['commit', '-q', '-m', 'release control']);
    const identity = U.gitIdentity(temporary, source);
    assert.strictEqual(identity.sourceCommitFull, source);
    assert.strictEqual(identity.dirty, false);
    fs.writeFileSync(path.join(temporary, 'changed.txt'), 'substantive later change\n');
    git(['add', 'changed.txt']);
    git(['commit', '-q', '-m', 'stale substantive change']);
    assert.throws(() => U.gitIdentity(temporary, source), /substantive files changed/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

function testRunnerRefusesArtifactOverwrite() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-eval-overwrite-'));
  try {
    const existing = path.join(tmpRoot, 'result-existing.json');
    fs.writeFileSync(existing, '{}\n');
    assert.throws(() => requireNewRunArtifacts(existing, path.join(tmpRoot, 'new.json')), /refusing to overwrite/);
    assert.doesNotThrow(() => requireNewRunArtifacts(path.join(tmpRoot, 'new-a.json'), path.join(tmpRoot, 'new-b.json')));
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

function testTemplateBindingsCurrent() {
  for (const id of U.listPacks()) {
    const dir = U.packDir(id);
    const record = U.readJSON(path.join(dir, 'evals', 'result.template.json'));
    assert.strictEqual(record.schema_version, '2.0');
    assert.strictEqual(record.record_kind, 'template');
    const runner = record.runner;
    const protocolRaw = fs.readFileSync(path.join(dir, runner.pack.protocol_file), 'utf8');
    const protocol = require('./lib/yaml').load(protocolRaw);
    assert.strictEqual(runner.pack.id, id);
    assert.strictEqual(runner.pack.version, protocol.version);
    assert.strictEqual(runner.pack.protocol_sha256, U.sha256String(protocolRaw), `${id}: stale template protocol hash`);
    const taskRaw = fs.readFileSync(path.join(dir, runner.task_file), 'utf8');
    const taskSet = JSON.parse(taskRaw);
    assert.strictEqual(runner.tasks_sha256, U.sha256String(taskRaw), `${id}: stale template task hash`);
    assert.deepStrictEqual(runner.task_ids, taskSet.tasks.map(task => task.id), `${id}: stale template task order`);
    const without = runner.interventions.agent_without_protocol;
    assert.strictEqual(without.prompt, BARE_SYSTEM_PROMPT);
    assert.strictEqual(without.prompt_sha256, U.sha256String(BARE_SYSTEM_PROMPT));
    const withProtocol = runner.interventions.agent_with_protocol;
    const armRaw = fs.readFileSync(path.join(dir, withProtocol.file), 'utf8');
    assert.strictEqual(withProtocol.file_sha256, U.sha256String(armRaw), `${id}: stale template arm hash`);
    assert.strictEqual(withProtocol.effective_prompt_sha256, U.sha256String(extractProtocolPrefix(armRaw)),
      `${id}: stale template effective-prompt hash`);
  }
}

function testV2RunnerRecordAndBindings() {
  const schema = U.readJSON(path.join(U.ROOT, 'schema', 'eval-result.schema.json'));
  const source = U.packDir('document-to-action-plan');
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-v2-eval-'));
  const copy = path.join(tmpRoot, 'document-to-action-plan');
  try {
    fs.cpSync(source, copy, { recursive: true });
    const taskFile = packRelativeFile(copy, 'evals/live/dtap-core-v1.tasks.json', 'task file');
    const taskRaw = fs.readFileSync(taskFile.abs, 'utf8');
    const taskSet = JSON.parse(taskRaw);
    const armFile = packRelativeFile(copy, 'adapters/generic-chat/prompt.md', 'protocol arm');
    const promptMd = fs.readFileSync(armFile.abs, 'utf8');
    const historical = U.readJSON(path.join(copy, 'evals', 'result-live-o4-mini-2026-08-08.json'));
    const historicalRaw = fs.readFileSync(path.join(copy, 'evals/live/runs/live-o4-mini-2026-08-08.jsonl'), 'utf8');
    const rows = historicalRaw.trim().split('\n').map(line => JSON.parse(line)).map(row => {
      const next = { ...row, runner_cost_usd: row.cost_usd, evaluation_cost_usd: 0 };
      delete next.cost_usd;
      return next;
    });
    const rawContent = rows.map(row => JSON.stringify(row)).join('\n') + '\n';
    const outputsFile = 'evals/live/runs/test-v2-bound.jsonl';

    // Give the prospective v2 result a real, clean source commit without
    // touching the host repository. Raw outputs are deliberately written only
    // after the input tree is committed.
    childProcess.execFileSync('git', ['init', '-q'], { cwd: tmpRoot });
    childProcess.execFileSync('git', ['add', 'document-to-action-plan'], { cwd: tmpRoot });
    childProcess.execFileSync('git', [
      '-c', 'user.name=Productivity Protocols test',
      '-c', 'user.email=test@invalid.example',
      'commit', '-q', '-m', 'bound evaluation inputs'
    ], { cwd: tmpRoot });
    const gitRead = args => childProcess.execFileSync('git', args, { cwd: tmpRoot }).toString().trim();
    const sourceIdentity = {
      sourceCommitFull: gitRead(['rev-parse', 'HEAD']),
      sourceTree: gitRead(['rev-parse', 'HEAD^{tree}']),
      dirty: false
    };
    fs.writeFileSync(path.join(copy, outputsFile), rawContent);
    const record = buildResultRecord({
      packId: 'document-to-action-plan', packDir: copy,
      taskSet, tasks: taskSet.tasks, taskFile, tasksRaw: taskRaw,
      armFile, promptMd, protocolPrefix: extractProtocolPrefix(promptMd),
      protocolRaw: fs.readFileSync(path.join(copy, 'protocol.yaml'), 'utf8'),
      source: sourceIdentity,
      outputsFile, rawContent,
      runnerModel: 'test-runner', judges: ['test-judge'], date: '2026-08-08', tag: 'regression',
      withoutRows: rows.filter(row => row.arm === 'agent_without_protocol'),
      withRows: rows.filter(row => row.arm === 'agent_with_protocol'),
      withoutAggregate: historical.arms.find(arm => arm.arm === 'agent_without_protocol'),
      withAggregate: historical.arms.find(arm => arm.arm === 'agent_with_protocol')
    });

    assert.deepStrictEqual(validate(schema, record), [],
      'the exact object emitted by the v2 result builder must validate with eval-harness schema semantics');
    assert(_sourceTreeExists(record.runner.source, copy), 'recorded commit must resolve to its exact tree');
    assert(_sourceBlobMatches(copy, record.runner.source, 'protocol.yaml', record.runner.pack.protocol_sha256),
      'protocol bytes must exist in the recorded source commit');
    assert(_sourceBlobMatches(copy, record.runner.source, armFile.rel, record.runner.interventions.agent_with_protocol.file_sha256),
      'arm bytes must exist in the recorded source commit');
    assert(_sourceBlobMatches(copy, record.runner.source, taskFile.rel, record.runner.tasks_sha256),
      'task bytes must exist in the recorded source commit');
    assert(_recomputeRows(taskSet, rows, record.runner, true),
      'hash-bound rows must recompute before the complete result is checked');
    assert.strictEqual(recomputeLiveResult(copy, record).pass, true,
      'an untampered, fully bound v2 run should recompute');

    const dirtySource = JSON.parse(JSON.stringify(record));
    dirtySource.runner.source.dirty = true;
    assert(validate(schema, dirtySource).some(error => error.path.endsWith('.source.dirty')),
      'a schema-v2 result must declare a clean pre-run input source');
    assert.strictEqual(recomputeLiveResult(copy, dirtySource), null,
      'a dirty-source result cannot earn live assurance');

    const armTamper = JSON.parse(JSON.stringify(record));
    armTamper.runner.interventions.agent_with_protocol.file_sha256 = '0'.repeat(64);
    assert.strictEqual(recomputeLiveResult(copy, armTamper), null,
      'a schema-shaped but false protocol-arm hash must be rejected');

    // Even if the record is edited to match a dirty working-file change, the
    // verifier must reject it because the changed bytes are absent from the
    // recorded source commit.
    fs.writeFileSync(armFile.abs, promptMd + '\n# post-commit mutation\n');
    const workingTreeTamper = JSON.parse(JSON.stringify(record));
    const changedArmRaw = fs.readFileSync(armFile.abs, 'utf8');
    workingTreeTamper.runner.interventions.agent_with_protocol.file_sha256 = U.sha256String(changedArmRaw);
    workingTreeTamper.runner.interventions.agent_with_protocol.effective_prompt_sha256 = U.sha256String(extractProtocolPrefix(changedArmRaw));
    assert.strictEqual(recomputeLiveResult(copy, workingTreeTamper), null,
      'working-tree input bytes absent from the recorded commit must be rejected');
    fs.writeFileSync(armFile.abs, promptMd);

    const costTamper = JSON.parse(JSON.stringify(record));
    costTamper.arms.find(arm => arm.arm === 'agent_with_protocol').metrics.cost_usd += 1;
    assert.strictEqual(recomputeLiveResult(copy, costTamper), null,
      'operational-cost headlines must equal the hash-bound runner-row total');

    const duplicateRows = rows.map(row => ({ ...row }));
    const withIndexes = duplicateRows.map((row, i) => row.arm === 'agent_with_protocol' ? i : -1).filter(i => i >= 0);
    duplicateRows[withIndexes[1]].task = duplicateRows[withIndexes[0]].task;
    const duplicateRaw = duplicateRows.map(row => JSON.stringify(row)).join('\n') + '\n';
    fs.writeFileSync(path.join(copy, outputsFile), duplicateRaw);
    const duplicateRecord = JSON.parse(JSON.stringify(record));
    duplicateRecord.runner.outputs_sha256 = U.sha256String(duplicateRaw);
    assert.strictEqual(recomputeLiveResult(copy, duplicateRecord), null,
      'duplicating one passing task must not substitute for complete task-set coverage');

    const legacyBypass = JSON.parse(JSON.stringify(record));
    legacyBypass.schema_version = '1.0';
    delete legacyBypass.record_kind;
    assert.strictEqual(recomputeLiveResult(copy, legacyBypass), null,
      'a current 0.1.1 result cannot claim legacy schema 1.0 to omit intervention binding');

    const missingBinding = JSON.parse(JSON.stringify(record));
    delete missingBinding.runner.interventions;
    assert(validate(schema, missingBinding).some(e => e.msg.includes("'interventions'")),
      'schema-version 2.0 results must carry the complete intervention binding');
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

function main() {
  testDateTimeFormat();
  testExclusiveMinimum();
  testConditionalSchemaBranches();
  testGitIdentity();
  testWalkerRejectsSymlinks();
  testReplayBoundary();
  testAgentSkillsFrontmatter();
  testPositiveEvidenceDecision();
  testEvidenceProfileDimensions();
  testCrossModelRequiresSameOutcome();
  testRunnerCostBoundary();
  testMissingJudgeBoundary();
  testEvaluationMetricBounds();
  testCleanEvaluationSourceRequired();
  testUstarLongPathBoundary();
  testReleaseSourceOverrideBoundary();
  testRunnerRefusesArtifactOverwrite();
  testTemplateBindingsCurrent();
  testV2RunnerRecordAndBindings();
  console.log('test-core: 19/19 checks passed');
}

if (require.main === module) main();
