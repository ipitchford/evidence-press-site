#!/usr/bin/env node
'use strict';
// Synthetic retrospective fixtures only: these are not prospective research outcomes.
const assert = require('assert/strict'), fs = require('fs'), os = require('os'), path = require('path');
const { spawn, spawnSync } = require('child_process');
const c = require('./atlas-campaign');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-campaign-test-'));
const clone = x => JSON.parse(JSON.stringify(x));
let tests = 0, seq = 0;
function test(name, fn) { fn(); tests++; console.log('ok ' + name); }
const evidence = path.join(root, 'evidence.json'); fs.writeFileSync(evidence, '{"synthetic":true}');
const identity = { path: evidence, sha256: c.hash(fs.readFileSync(evidence)) };
const spec = { question: 'Synthetic recorder test', indexIdentity: identity, packetIdentity: identity,
  conditions: ['synthetic only'], measurementPlan: 'No scientific inference', declaration: 'registered-before-outcomes',
  arms: ['baseline', 'atlas'].map(id => ({ id, model: 'test-only', tools: ['local'], budget: { maxTokens: 100, maxSeconds: 10 } })),
  tasks: [{ id: 't1', question: 'Synthetic', source: 'fixture', sourceDate: '2026-01-01', previouslyUnknownEvidence: 'Test declaration, not an experiment', attemptId: 'fixture-only' },
    { id: 't2', question: 'Synthetic second task', source: 'fixture', sourceDate: '2026-01-01', previouslyUnknownEvidence: 'Test only' }] };
const outcome = { taskId: 't1', armId: 'atlas', status: 'null', reason: 'Synthetic null', evidence: [identity],
  dimensions: Object.fromEntries(['retrieval', 'researchUtility', 'scientificOutcome'].map(k => [k, { value: null, reason: 'not assessed' }])),
  metrics: { elapsedSeconds: { value: 0, reason: 'synthetic zero' }, humanEffortSeconds: { value: null, reason: 'unknown' }, tokens: { value: null, reason: 'unknown' } } };
function fresh() { const dir = path.join(root, 'campaign-' + (++seq)); return { dir, ...c.begin(dir, clone(spec)) }; }
async function run() {
  test('all registered pairs remain in denominator before outcomes', () => { const x = fresh(), r = c.report(x.dir); assert.equal(r.registeredDenominator, 4); assert.equal(r.counts.missing, 4); assert.equal(r.dimensions.scientificOutcome.unknown, 4); });
  test('exclusive begin and repository output rejection', () => { const x = fresh(); assert.throws(() => c.begin(x.dir, spec)); assert.throws(() => c.begin(path.join(__dirname, 'campaign-test-forbidden'), spec), /outside repository/); });
  test('identities bind actual bytes', () => { const s = clone(spec); s.indexIdentity.sha256 = '0'.repeat(64); assert.throws(() => c.begin(path.join(root, 'bad-id'), s), /hash mismatch/); });
  test('matched arms and unique tasks enforced', () => { const s = clone(spec); s.arms[1].model = 'other'; assert.throws(() => c.begin(path.join(root, 'bad-arm'), s), /must match/); s.arms[1].model = 'test-only'; s.tasks.push(s.tasks[0]); assert.throws(() => c.begin(path.join(root, 'bad-task'), s), /duplicate task/); });
  test('automatic clocks and zero versus unknown metrics', () => { const x = fresh(); const before = new Date().toISOString(); const e = c.record(x.dir, outcome, x.head); assert.ok(e.recordedAt >= before); const r = c.report(x.dir, e.head); assert.equal(r.rows.find(r => r.armId === 'atlas').outcome.metrics.elapsedSeconds.value, 0); assert.equal(r.rows[1].outcome.metrics.humanEffortSeconds.value, null); assert.equal(r.counts.missing, 3); });
  test('no timestamp injection, unknown arms/tasks, nonfinite metrics or invalid statuses', () => { const x = fresh(); for (const change of [{ recordedAt: '2000-01-01' }, { armId: 'other' }, { taskId: 'other' }, { status: 'verified' }]) assert.throws(() => c.record(x.dir, { ...outcome, ...change }, x.head)); const o = clone(outcome); o.metrics.tokens.value = NaN; assert.throws(() => c.record(x.dir, o, x.head), /nonfinite/); assert.equal(c.report(x.dir).eventCount, 0); });
  test('outcomes cannot overwrite; revisions retain full prior history', () => { const x = fresh(), a = c.record(x.dir, outcome, x.head); assert.throws(() => c.record(x.dir, outcome, a.head), /supersede/); const b = c.record(x.dir, { ...outcome, status: 'stopped', supersedes: a.head, reason: 'Correction: synthetic stop' }, a.head); const r = c.report(x.dir, b.head); assert.equal(r.eventCount, 2); assert.equal(r.recordedPairs, 1); assert.equal(r.counts.stopped, 1); assert.equal(r.history[0].payload.outcome.status, 'null'); assert.throws(() => c.record(x.dir, outcome, x.head), /stale/); });
  test('each terminal status retains denominator', () => { for (const status of ['success', 'null', 'failed', 'stopped', 'duplicate', 'budget-exhausted']) { const x = fresh(); c.record(x.dir, { ...outcome, status }, x.head); const r = c.report(x.dir); assert.equal(r.counts[status], 1); assert.equal(r.registeredDenominator, 4); } });
  test('positive dimensions require evidence; evidence changes rejected on append', () => { const x = fresh(), o = clone(outcome); o.evidence = []; o.dimensions.retrieval.value = true; assert.throws(() => c.record(x.dir, o, x.head), /needs evidence/); o.evidence = [{ ...identity, sha256: '0'.repeat(64) }]; assert.throws(() => c.record(x.dir, o, x.head), /hash mismatch/); });
  test('manifest and event tampering detected', () => { const x = fresh(); const p = path.join(x.dir, 'manifest.json'); fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('Synthetic recorder test', 'Changed question')); assert.throws(() => c.report(x.dir), /hash mismatch/); const y = fresh(); c.record(y.dir, outcome, y.head); const e = path.join(y.dir, '00000001.json'); fs.writeFileSync(e, fs.readFileSync(e, 'utf8').replace('Synthetic null', 'Tampered null')); assert.throws(() => c.report(y.dir), /hash mismatch/); });
  test('missing event and externally anchored tail deletion detected', () => { const x = fresh(), a = c.record(x.dir, outcome, x.head); c.record(x.dir, { ...outcome, taskId: 't2' }, a.head); fs.unlinkSync(path.join(x.dir, '00000001.json')); assert.throws(() => c.report(x.dir), /missing event/); const y = fresh(), b = c.record(y.dir, outcome, y.head); fs.unlinkSync(path.join(y.dir, '00000001.json')); assert.throws(() => c.report(y.dir, b.head), /head mismatch/); });
  test('active/stale lock fails closed without stealing lock', () => { const x = fresh(); fs.writeFileSync(path.join(x.dir, '.lock'), ''); assert.throws(() => c.record(x.dir, outcome, x.head)); assert.throws(() => c.report(x.dir), /lock/); });
  test('report is read-only', () => { const x = fresh(), before = fs.readFileSync(path.join(x.dir, 'manifest.json')); c.report(x.dir); assert.deepEqual(fs.readdirSync(x.dir), ['manifest.json']); assert.deepEqual(fs.readFileSync(path.join(x.dir, 'manifest.json')), before); });
  test('retrieval success does not imply utility or scientific outcome', () => { const x = fresh(), o = clone(outcome); o.dimensions.retrieval.value = true; o.dimensions.researchUtility.value = false; c.record(x.dir, o, x.head); const r = c.report(x.dir); assert.equal(r.dimensions.retrieval.true, 1); assert.equal(r.dimensions.researchUtility.false, 1); assert.equal(r.dimensions.scientificOutcome.true, 0); assert.equal(r.dimensions.scientificOutcome.unknown, 4); });
  test('backdated event rejected even if its content hash is recomputed', () => { const x = fresh(); c.record(x.dir, outcome, x.head); const file = path.join(x.dir, '00000001.json'), e = JSON.parse(fs.readFileSync(file)); e.payload.recordedAt = '2000-01-01T00:00:00.000Z'; e.sha256 = c.hash(c.canonical(e.payload)); fs.writeFileSync(file, JSON.stringify(e)); assert.throws(() => c.report(x.dir), /event clock/); });
  test('manifest timestamp injection and invalid metric types rejected', () => { assert.throws(() => c.begin(path.join(root, 'injected'), { ...spec, createdAt: '2000-01-01' }), /unknown field/); const x = fresh(); for (const value of [-1, '0', Infinity]) { const o = clone(outcome); o.metrics.tokens.value = value; assert.throws(() => c.record(x.dir, o, x.head)); } });
  test('repository symlink cannot bypass output boundary', () => { const link = path.join(root, 'repo-link'); fs.symlinkSync(path.join(__dirname, '..'), link); assert.throws(() => c.begin(path.join(link, 'forbidden-campaign'), spec), /outside repository/); });
  test('actual standalone CLI permits sibling campaign but protects its own directory', () => {
    const downloads = path.join(root, 'Downloads'); fs.mkdirSync(downloads);
    const standalone = path.join(downloads, 'atlas-campaign.js');
    fs.copyFileSync(path.join(__dirname, 'atlas-campaign.js'), standalone);
    const input = path.join(root, 'standalone-spec.json'); fs.writeFileSync(input, JSON.stringify(spec));
    const sibling = path.join(root, 'standalone-campaign');
    const ok = spawnSync(process.execPath, [standalone, 'begin', sibling, input], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stderr);
    const report = spawnSync(process.execPath, [standalone, 'report', sibling], { encoding: 'utf8' });
    assert.equal(report.status, 0, report.stderr); assert.equal(JSON.parse(report.stdout).registeredDenominator, 4);
    const forbidden = path.join(downloads, 'campaign');
    const denied = spawnSync(process.execPath, [standalone, 'begin', forbidden, input], { encoding: 'utf8' });
    assert.equal(denied.status, 1); assert.match(denied.stderr, /outside standalone tool directory/);
    assert.equal(fs.existsSync(forbidden), false);
  });
  const x = fresh(), input = path.join(root, 'outcome.json'); fs.writeFileSync(input, JSON.stringify(outcome));
  const child = () => new Promise(resolve => { const p = spawn(process.execPath, [path.join(__dirname, 'atlas-campaign.js'), 'record', x.dir, input, x.head], { stdio: 'ignore' }); p.on('exit', resolve); });
  const codes = await Promise.all([child(), child()]);
  test('concurrent writers cannot overwrite or fork history', () => { assert.deepEqual(codes.sort(), [0, 1]); assert.equal(c.report(x.dir).eventCount, 1); });
  console.log(`ALL ${tests} ATLAS CAMPAIGN TESTS PASSED (synthetic, not experimental evidence)`);
}
run().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => fs.rmSync(root, { recursive: true, force: true }));
