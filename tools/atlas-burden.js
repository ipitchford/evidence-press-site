#!/usr/bin/env node
'use strict';

// Blinded false-proposal burden estimate for the Evidence Atlas discovery
// pilot. Design record: docs/ATLAS_DISCOVERY_PILOT.md, "Burden estimate".
//
// A stratified random sample of emitted candidates (strata = route-signal
// count) is labelled by a Claude model applying the pilot's cheap falsifier,
// blind to rank, stratum and benchmark role. Known recorded pairs and the
// confirmed negative controls are mixed in as calibration items so the
// labeller's own sensitivity and specificity are measured alongside.
//
// The labels are a same-vendor model's readings. They estimate how many
// emitted candidates would survive the cheap falsifier; they are not
// maintainer decisions, never enter the proposal register, and add no
// accepted relationship. Writes only under data/atlas-discovery/burden/.

const fs = require('fs');
const path = require('path');
const text = require('./atlas-text');
const disc = require('./atlas-discovery');
const batch = require('./atlas-claude-batch');

const BURDEN_DIR = 'data/atlas-discovery/burden';
const TOOL_VERSION = '0.1.0';
const LABEL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'confidence', 'sharedObject', 'basis'],
  properties: {
    verdict: { type: 'string', enum: ['accept', 'reject'] },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    sharedObject: { type: ['string', 'null'] },
    basis: { type: 'string' }
  }
};
const SYSTEM = [
  'You are reading two research releases from the same small publisher and applying one test.',
  'ACCEPT only if the two releases share the SAME specific mathematical or empirical object (a named theorem, conjecture, construction, invariant, model, dataset, bound or problem instance), or one result applies to, generalises, specialises, extends, is a stated companion of, or is a successor to the other.',
  'REJECT if they share only a field, a method, a genre, a background citation, or vocabulary.',
  'Use only the supplied texts. Default to REJECT unless the texts support a specific shared object or dependency.',
  'Answer with the JSON object only: verdict, confidence, sharedObject (the shared object or dependency in a few words, or null), basis (one sentence).'
].join(' ');

function wilson(successes, n, z = 1.96) {
  if (!n) return { estimate: null, low: null, high: null, n: 0 };
  const p = successes / n;
  const denom = 1 + z * z / n;
  const centre = (p + z * z / (2 * n)) / denom;
  const half = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denom;
  return { estimate: Number(p.toFixed(4)), low: Number(Math.max(0, centre - half).toFixed(4)), high: Number(Math.min(1, centre + half).toFixed(4)), n };
}

// Deterministic stratified sample plus calibration items, in a blind order.
function designSample({ record, runSha256, benchmark, perStratum = 15 }) {
  const negatives = new Set(benchmark.negatives.map(n => text.pairKey(...n.pair)));
  const strata = new Map();
  for (const c of record.candidates) {
    if (negatives.has(c.pairKey)) continue; // controls enter as calibration, not sample
    if (!strata.has(c.routeSignalCount)) strata.set(c.routeSignalCount, []);
    strata.get(c.routeSignalCount).push(c.pairKey);
  }
  const items = [];
  const strataSummary = [];
  for (const [count, keys] of [...strata].sort((a, b) => a[0] - b[0])) {
    const ranked = keys.map(key => ({ key, h: text.sha256(`${runSha256}:sample:${key}`) })).sort((a, b) => (a.h < b.h ? -1 : 1));
    const chosen = ranked.slice(0, perStratum).map(r => r.key);
    strataSummary.push({ routeSignalCount: count, population: keys.length, sampled: chosen.length });
    for (const key of chosen) items.push({ pairKey: key, role: 'sample', stratum: count });
  }
  for (const pair of benchmark.positives) items.push({ pairKey: text.pairKey(...pair), role: 'calibration-positive', stratum: null });
  for (const n of benchmark.negatives) items.push({ pairKey: text.pairKey(...n.pair), role: 'calibration-negative', stratum: null });
  // blind order: hash of pair key only, so neither role nor stratum is inferable from position
  items.sort((a, b) => (text.sha256(`${runSha256}:order:${a.pairKey}`) < text.sha256(`${runSha256}:order:${b.pairKey}`) ? -1 : 1));
  items.forEach((item, i) => { item.customId = `item-${String(i + 1).padStart(3, '0')}`; });
  return { items, strataSummary, perStratum };
}

function buildRequests(root, items, corpus) {
  const metaBySlug = new Map(corpus.papers.map(p => [p.slug, p]));
  const bodies = new Map(corpus.slugs.map(s => [s, fs.readFileSync(path.join(root, 'papers', s, 'body.md'), 'utf8')]));
  return items.map(item => {
    const [a, b] = item.pairKey.split('|');
    const user = [
      FRAMING,
      '', '===== RELEASE A =====', text.releaseExcerpt(metaBySlug.get(a), bodies.get(a)),
      '', '===== RELEASE B =====', text.releaseExcerpt(metaBySlug.get(b), bodies.get(b))
    ].join('\n');
    return batch.structuredRequest(item.customId, { system: SYSTEM, user, schema: LABEL_SCHEMA, effort: 'high', maxTokens: 4000 });
  });
}

// Blindness: the labeller must not be told anything about an item beyond the
// two release texts. Release texts themselves may contain words like "rank"
// or "hidden" (mathematics), so the check applies to the framing the tool
// adds and to the request's field set, not to the excerpts.
const FRAMING = 'Apply the test to these two releases.';
const BLIND_FORBIDDEN = /\b(rank|benchmark|hidden|negative control|calibration|stratum|sample)\b/i;
function assertBlind(requests) {
  if (BLIND_FORBIDDEN.test(SYSTEM) || BLIND_FORBIDDEN.test(FRAMING)) throw new Error('labeller framing would reveal design information');
  for (const r of requests) {
    const keys = Object.keys(r.params).sort().join(',');
    if (keys !== 'max_tokens,messages,model,output_config,system') throw new Error(`request ${r.custom_id} carries unexpected fields: ${keys}`);
    if (!/^item-\d{3}$/.test(r.custom_id)) throw new Error(`request ${r.custom_id} has a revealing custom_id`);
  }
}

function summarise(items, labels, strataSummary) {
  const byRole = role => items.filter(i => i.role === role);
  const accepted = item => labels.get(item.customId) && labels.get(item.customId).verdict === 'accept';
  const labelled = item => labels.has(item.customId);
  const pos = byRole('calibration-positive').filter(labelled);
  const neg = byRole('calibration-negative').filter(labelled);
  const calibration = {
    sensitivityOnRecordedPairs: wilson(pos.filter(accepted).length, pos.length),
    specificityOnNegativeControls: wilson(neg.filter(i => !accepted(i)).length, neg.length),
    note: 'Recorded pairs are links the maintainer already asserted; the labeller should accept them. Negative controls were confirmed unrelated; the labeller should reject them. Both are limits on what the sample labels mean, not evidence about any candidate.'
  };
  const perStratum = strataSummary.map(s => {
    const sample = items.filter(i => i.role === 'sample' && i.stratum === s.routeSignalCount && labelled(i));
    const rate = wilson(sample.filter(accepted).length, sample.length);
    const projected = rate.estimate === null ? null : { estimate: Number((rate.estimate * s.population).toFixed(1)), low: Number((rate.low * s.population).toFixed(1)), high: Number((rate.high * s.population).toFixed(1)) };
    return { ...s, labelled: sample.length, accepted: sample.filter(accepted).length, acceptRate: rate, projectedAcceptsInPopulation: projected };
  });
  const total = perStratum.reduce((acc, s) => {
    if (!s.projectedAcceptsInPopulation) return acc;
    acc.estimate += s.projectedAcceptsInPopulation.estimate; acc.low += s.projectedAcceptsInPopulation.low; acc.high += s.projectedAcceptsInPopulation.high; acc.population += s.population;
    return acc;
  }, { estimate: 0, low: 0, high: 0, population: 0 });
  return { calibration, perStratum, projectedAcceptsAcrossCandidates: { ...total, estimate: Number(total.estimate.toFixed(1)), low: Number(total.low.toFixed(1)), high: Number(total.high.toFixed(1)) } };
}

async function estimateBurden(root, { runPathArg, apiKey = process.env.ANTHROPIC_API_KEY, fetchImpl, perStratum = 15, dryRun = false, batchId = null, pollMs, sleep, onPoll } = {}) {
  const { record, runPath, runSha256, corpus } = disc.loadRunRecordForDraft(root, runPathArg);
  if (record.mode !== 'run') throw new Error('burden estimation needs a production run record (mode run), not an evaluation record');
  const { loadBenchmark } = require('./atlas-benchmark');
  const { benchmark, sha256: benchmarkSha256 } = loadBenchmark(root);
  if (benchmark.corpusFingerprint !== corpus.fingerprint) throw new Error('benchmark corpus fingerprint does not match the live corpus; refreeze first');
  const design = designSample({ record, runSha256, benchmark, perStratum });
  const requests = buildRequests(root, design.items, corpus);
  assertBlind(requests);
  const base = {
    schemaVersion: '1.0',
    recordType: 'evidence-atlas-discovery-burden-estimate',
    toolVersion: TOOL_VERSION,
    generatorVersion: record.generatorVersion,
    corpusFingerprint: corpus.fingerprint,
    runRecord: { path: runPath, sha256: runSha256, candidateCount: record.candidateCount },
    benchmark: { path: disc.BENCHMARK_PATH, sha256: benchmarkSha256, positives: benchmark.positives.length, negatives: benchmark.negatives.length },
    design: { method: 'stratified by routeSignalCount; deterministic selection by sha256(runSha256:sample:pairKey); calibration items mixed in; blind order by sha256(runSha256:order:pairKey)', perStratum, strata: design.strataSummary, itemCount: design.items.length, labellerSees: 'title, one-line, keywords, abstract, specialist summary, technical account, relationship to earlier work and up to ten external references of each release; nothing else' },
    labeller: { model: batch.DEFAULT_MODEL, vendor: 'Anthropic', effort: 'high', outputSchema: LABEL_SCHEMA, system: SYSTEM, independenceNote: 'Same-vendor model as the agent that built the generator. Its labels are an evaluation statistic for the pilot, not an independent review and not intake decisions.' },
    claimCeiling: 'This record estimates how many emitted candidates a model reader would accept under the cheap falsifier, with calibration against recorded pairs and confirmed controls. It does not make any pair a relationship, does not replace maintainer intake, and is not independent assurance.'
  };
  if (dryRun) return { ...base, generatedAt: null, items: design.items.map(i => ({ ...i, requestSha256: batch.sha256(requests.find(r => r.custom_id === i.customId).params) })), labels: null, summary: null, dryRun: true };
  const run = batchId
    ? await batch.resumeBatch(batchId, requests, { apiKey, fetchImpl, pollMs, sleep, onPoll })
    : await batch.runBatch(requests, { apiKey, fetchImpl, pollMs, sleep, onPoll });
  const labels = new Map();
  const failures = [];
  for (const item of design.items) {
    const parsed = batch.parseStructuredResult(run.byId.get(item.customId));
    if (parsed.ok) labels.set(item.customId, parsed.value); else failures.push({ customId: item.customId, reason: parsed.reason });
  }
  const items = design.items.map(i => ({ ...i, requestSha256: run.requestSha256ById.get(i.customId), label: labels.get(i.customId) || null }));
  return { ...base, generatedAt: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), batch: { id: run.batchId, createdAt: run.createdAt, endedAt: run.endedAt, requestCounts: run.requestCounts }, items, failures, summary: summarise(design.items, labels, design.strataSummary), dryRun: false };
}

async function main() {
  const args = disc.parseArgs(process.argv.slice(2));
  const root = path.join(__dirname, '..');
  if (!args.run) throw new Error('usage: atlas-burden.js --run <run record under data/atlas-discovery/runs> [--per-stratum N] [--dry-run] [--batch-id ID] [--out DIR]');
  const result = await estimateBurden(root, { runPathArg: args.run, perStratum: Number(args['per-stratum'] || 15), dryRun: Boolean(args['dry-run']), batchId: args['batch-id'] || null, onPoll: b => console.error(`batch ${b.id}: ${b.processing_status} ${JSON.stringify(b.request_counts || {})}`) });
  const name = `${(result.generatedAt || 'dry-run').slice(0, 10)}-${result.corpusFingerprint.slice(0, 12)}${result.dryRun ? '-dry-run' : ''}.json`;
  const file = disc.writeConfined(root, args.out || BURDEN_DIR, name, result);
  console.log(`wrote ${path.relative(root, file)}`);
  if (result.summary) {
    const s = result.summary;
    console.log(`calibration: sensitivity ${JSON.stringify(s.calibration.sensitivityOnRecordedPairs)} specificity ${JSON.stringify(s.calibration.specificityOnNegativeControls)}`);
    for (const st of s.perStratum) console.log(`stratum ${st.routeSignalCount}: ${st.accepted}/${st.labelled} accepted -> projected ${JSON.stringify(st.projectedAcceptsInPopulation)} of ${st.population}`);
    console.log(`projected accepts across ${s.projectedAcceptsAcrossCandidates.population} candidates: ${JSON.stringify(s.projectedAcceptsAcrossCandidates)}`);
  }
}

module.exports = { BURDEN_DIR, TOOL_VERSION, LABEL_SCHEMA, SYSTEM, wilson, designSample, buildRequests, assertBlind, summarise, estimateBurden };

if (require.main === module) main().catch(error => { console.error(error.message); process.exit(1); });
