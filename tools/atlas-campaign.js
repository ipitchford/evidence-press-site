#!/usr/bin/env node
'use strict';
// Local supplementary evaluation receipts; never executes research or updates WORK_LEDGER.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const TOOL_DIRECTORY = fs.realpathSync(__dirname);
const REPOSITORY_CANDIDATE = path.dirname(TOOL_DIRECTORY);
// A downloaded standalone script must not accidentally protect its entire parent
// (e.g. the user's home). Recognize this checkout only by its local sentinels.
function repositoryRoot() {
  try {
    if (fs.statSync(path.join(REPOSITORY_CANDIDATE, 'AGENTS.md')).isFile()
      && fs.statSync(path.join(REPOSITORY_CANDIDATE, 'data', 'OPERATING_MODEL.json')).isFile()
      && fs.realpathSync(path.join(REPOSITORY_CANDIDATE, 'tools', 'atlas-campaign.js')) === fs.realpathSync(__filename)) return REPOSITORY_CANDIDATE;
  } catch (_) { /* Standalone distribution: protect only the tool directory. */ }
  return null;
}
const REPOSITORY_ROOT = repositoryRoot();
const PROTECTED_ROOT = REPOSITORY_ROOT || TOOL_DIRECTORY;
const STATUSES = ['success', 'null', 'failed', 'stopped', 'duplicate', 'budget-exhausted'];
const DIMENSIONS = ['retrieval', 'researchUtility', 'scientificOutcome'];
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
function canonical(x) {
  if (typeof x === 'number' && !Number.isFinite(x)) throw Error('nonfinite number');
  if (x === null || typeof x !== 'object') return JSON.stringify(x);
  if (Array.isArray(x)) return '[' + x.map(canonical).join(',') + ']';
  return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + canonical(x[k])).join(',') + '}';
}
function check(ok, message) { if (!ok) throw Error(message); }
function keys(x, required, optional = []) {
  check(x && typeof x === 'object' && !Array.isArray(x), 'expected object');
  check(required.every(k => Object.hasOwn(x, k)), 'missing required field');
  check(Object.keys(x).every(k => [...required, ...optional].includes(k)), 'unknown field (timestamps are automatic)');
  canonical(x);
}
function string(x) { check(typeof x === 'string' && x.trim().length > 0, 'expected nonempty string'); }
function strings(x) { check(Array.isArray(x), 'expected array'); x.forEach(string); }
function digest(x) { check(typeof x === 'string' && /^[a-f0-9]{64}$/.test(x), 'expected SHA256'); }
function external(dir, creating = false) {
  const abs = path.resolve(dir);
  const resolved = creating ? path.join(fs.realpathSync(path.dirname(abs)), path.basename(abs)) : fs.realpathSync(abs);
  check(resolved !== PROTECTED_ROOT && !resolved.startsWith(PROTECTED_ROOT + path.sep), REPOSITORY_ROOT
    ? 'campaign must be outside repository' : 'campaign must be outside standalone tool directory');
  return resolved;
}
function identity(x, verify) {
  keys(x, ['path', 'sha256']); string(x.path); digest(x.sha256);
  check(path.isAbsolute(x.path), 'identity paths must be absolute');
  if (verify) check(hash(fs.readFileSync(x.path)) === x.sha256, 'evidence/identity hash mismatch');
}
function validateSpec(s, verify = false) {
  keys(s, ['question', 'indexIdentity', 'packetIdentity', 'conditions', 'arms', 'tasks', 'measurementPlan', 'declaration']);
  string(s.question); identity(s.indexIdentity, verify); identity(s.packetIdentity, verify);
  strings(s.conditions); string(s.measurementPlan);
  check(s.declaration === 'registered-before-outcomes', 'prospective declaration required');
  check(Array.isArray(s.arms) && s.arms.length === 2, 'exactly two matched arms required');
  s.arms.forEach(a => {
    keys(a, ['id', 'model', 'tools', 'budget']); check(['baseline', 'atlas'].includes(a.id), 'invalid arm');
    string(a.model); strings(a.tools); keys(a.budget, ['maxTokens', 'maxSeconds']);
    Object.values(a.budget).forEach(n => check(Number.isSafeInteger(n) && n > 0, 'positive integer budget required'));
  });
  check(new Set(s.arms.map(a => a.id)).size === 2, 'duplicate arm');
  const comparable = a => canonical({ model: a.model, tools: a.tools, budget: a.budget });
  check(comparable(s.arms[0]) === comparable(s.arms[1]), 'arms must match model/tools/budget; only Atlas packet access differs');
  check(Array.isArray(s.tasks) && s.tasks.length > 0, 'tasks required');
  const ids = new Set();
  s.tasks.forEach(t => {
    keys(t, ['id', 'question', 'source', 'sourceDate', 'previouslyUnknownEvidence'], ['attemptId']);
    ['id', 'question', 'source', 'previouslyUnknownEvidence'].forEach(k => string(t[k]));
    check(/^\d{4}-\d{2}-\d{2}$/.test(t.sourceDate) && new Date(t.sourceDate).toISOString().slice(0, 10) === t.sourceDate, 'invalid source date');
    check(t.sourceDate <= new Date().toISOString().slice(0, 10), 'future source date');
    if (t.attemptId !== undefined) string(t.attemptId);
    check(!ids.has(t.id), 'duplicate task'); ids.add(t.id);
  });
}
function sealed(payload) { return { payload, sha256: hash(canonical(payload)) }; }
function read(file) {
  const x = JSON.parse(fs.readFileSync(file, 'utf8'));
  keys(x, ['payload', 'sha256']); digest(x.sha256);
  check(hash(canonical(x.payload)) === x.sha256, 'receipt hash mismatch'); return x;
}
function write(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 }); }
function clock(after) {
  const now = new Date().toISOString();
  check(!after || now >= after, 'clock moved backwards'); return now;
}
function begin(dir, spec) {
  validateSpec(spec, true); dir = external(dir, true);
  fs.mkdirSync(dir, { mode: 0o700 }); // exclusive; never reuse an existing campaign
  const m = sealed({ schemaVersion: '1.0', kind: 'atlas-prospective-campaign', createdAt: clock(), spec });
  write(path.join(dir, 'manifest.json'), m); return { manifestSha256: m.sha256, head: m.sha256, createdAt: m.payload.createdAt };
}
function validateOutcome(o, spec, verify = false) {
  keys(o, ['taskId', 'armId', 'status', 'reason', 'evidence', 'dimensions', 'metrics'], ['supersedes']);
  check(spec.tasks.some(t => t.id === o.taskId), 'unknown task');
  check(spec.arms.some(a => a.id === o.armId), 'unknown arm');
  check(STATUSES.includes(o.status), 'invalid status'); string(o.reason);
  check(Array.isArray(o.evidence), 'evidence array required'); o.evidence.forEach(e => identity(e, verify));
  keys(o.dimensions, DIMENSIONS);
  DIMENSIONS.forEach(k => {
    keys(o.dimensions[k], ['value', 'reason']);
    check([true, false, null].includes(o.dimensions[k].value), 'dimension must be true/false/null');
    string(o.dimensions[k].reason);
  });
  check(o.evidence.length > 0 || !DIMENSIONS.some(k => o.dimensions[k].value === true), 'positive result needs evidence');
  keys(o.metrics, ['elapsedSeconds', 'humanEffortSeconds', 'tokens']);
  Object.values(o.metrics).forEach(m => {
    keys(m, ['value', 'reason']); string(m.reason);
    check(m.value === null || (typeof m.value === 'number' && Number.isFinite(m.value) && m.value >= 0), 'metric must be nonnegative finite number or null');
    if (m.value !== null) check(o.evidence.length > 0, 'measured metrics need evidence');
  });
  if (o.supersedes !== undefined) digest(o.supersedes);
}
function load(dir) {
  const m = read(path.join(dir, 'manifest.json'));
  keys(m.payload, ['schemaVersion', 'kind', 'createdAt', 'spec']);
  check(m.payload.kind === 'atlas-prospective-campaign' && m.payload.schemaVersion === '1.0', 'wrong manifest type');
  validateSpec(m.payload.spec);
  const files = fs.readdirSync(dir).filter(n => n !== '.lock' && n !== 'manifest.json').sort();
  let head = m.sha256, time = m.payload.createdAt; const events = [], latest = new Map();
  check(new Date(time).toISOString() === time && time <= clock(), 'invalid manifest clock');
  files.forEach((file, i) => {
    check(file === String(i + 1).padStart(8, '0') + '.json', 'unexpected file or missing event');
    const e = read(path.join(dir, file));
    keys(e.payload, ['sequence', 'previousHash', 'recordedAt', 'outcome']);
    check(e.payload.sequence === i + 1 && e.payload.previousHash === head, 'broken hash chain');
    check(new Date(e.payload.recordedAt).toISOString() === e.payload.recordedAt && e.payload.recordedAt >= time && e.payload.recordedAt <= clock(), 'invalid event clock');
    const o = e.payload.outcome; validateOutcome(o, m.payload.spec);
    const key = JSON.stringify([o.taskId, o.armId]), previous = latest.get(key);
    check(previous ? o.supersedes === previous.sha256 : o.supersedes === undefined, 'revision must supersede latest outcome');
    latest.set(key, e); events.push(e); head = e.sha256; time = e.payload.recordedAt;
  });
  return { m, head, time, events, latest };
}
function record(dir, outcome, expectedHead) {
  digest(expectedHead); dir = external(dir);
  const lock = path.join(dir, '.lock'); const fd = fs.openSync(lock, 'wx', 0o600);
  try {
    const s = load(dir); check(s.head === expectedHead, 'stale expected head');
    validateOutcome(outcome, s.m.payload.spec, true);
    const previous = s.latest.get(JSON.stringify([outcome.taskId, outcome.armId]));
    check(previous ? outcome.supersedes === previous.sha256 : outcome.supersedes === undefined, 'revision must supersede latest outcome');
    const e = sealed({ sequence: s.events.length + 1, previousHash: s.head, recordedAt: clock(s.time), outcome });
    write(path.join(dir, String(e.payload.sequence).padStart(8, '0') + '.json'), e);
    return { head: e.sha256, recordedAt: e.payload.recordedAt };
  } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}
function report(dir, expectedHead) {
  dir = external(dir); check(!fs.existsSync(path.join(dir, '.lock')), 'writer active or stale lock; inspect before recovery');
  const s = load(dir); if (expectedHead !== undefined) check(s.head === expectedHead, 'expected head mismatch');
  const rows = s.m.payload.spec.tasks.flatMap(t => s.m.payload.spec.arms.map(a => {
    const e = s.latest.get(JSON.stringify([t.id, a.id]));
    return { taskId: t.id, armId: a.id, attemptId: t.attemptId || null, status: e ? e.payload.outcome.status : 'missing', outcome: e ? e.payload.outcome : null };
  }));
  check(!fs.existsSync(path.join(dir, '.lock')), 'writer started; retry report');
  return { kind: 'atlas-campaign-descriptive-report', manifestSha256: s.m.sha256, head: s.head,
    registeredDenominator: rows.length, recordedPairs: s.latest.size, eventCount: s.events.length,
    counts: Object.fromEntries([...STATUSES, 'missing'].map(k => [k, rows.filter(r => r.status === k).length])),
    dimensions: Object.fromEntries(DIMENSIONS.map(k => [k, { true: rows.filter(r => r.outcome?.dimensions[k].value === true).length, false: rows.filter(r => r.outcome?.dimensions[k].value === false).length, unknown: rows.filter(r => !r.outcome || r.outcome.dimensions[k].value === null).length }])),
    rows, history: s.events, claimCeiling: 'Descriptive receipts only; no causal effect, star vote, independent validation, or human-effort inference. Supplemental to WORK_LEDGER.' };
}
function main(args) {
  const [command, dir, input, head] = args;
  if (command === 'begin' && args.length === 3) return begin(dir, JSON.parse(fs.readFileSync(input, 'utf8')));
  if (command === 'record' && args.length === 4) return record(dir, JSON.parse(fs.readFileSync(input, 'utf8')), head);
  if (command === 'report' && [2, 3].includes(args.length)) return report(dir, input);
  throw Error('Usage: atlas-campaign.js begin DIR SPEC.json | record DIR OUTCOME.json EXPECTED_HEAD | report DIR [EXPECTED_HEAD]');
}
if (require.main === module) { try { console.log(JSON.stringify(main(process.argv.slice(2)), null, 2)); } catch (e) { console.error(e.message); process.exitCode = 1; } }
module.exports = { begin, record, report, canonical, hash, main };
