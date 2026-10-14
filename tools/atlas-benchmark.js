#!/usr/bin/env node
'use strict';

// Freezes the Evidence Atlas discovery benchmark INDEPENDENTLY of the
// generator. This module must not require tools/atlas-discovery.js. Positives
// are extracted here from the accepted graph via the site's own graph builder;
// negative controls come from a maintainer-confirmed list whose confirmation
// must precede the freeze. Design record: docs/ATLAS_DISCOVERY_PILOT.md.
// Writes only data/atlas-discovery/BENCHMARK.json.

const fs = require('fs');
const path = require('path');
const { loadRelationshipArtifacts, buildResearchGraph } = require('./research-graph');
const text = require('./atlas-text');

const BENCHMARK_REL = 'data/atlas-discovery/BENCHMARK.json';
const CONTROLS_REL = 'data/atlas-discovery/NEGATIVE_CONTROLS.json';
const BENCHMARK_VERSION = '0.2.0';
const BASE_URL = 'https://evidencepress.org';
const GENERATOR_SOURCE_FILES = ['tools/atlas-text.js', 'tools/atlas-discovery.js'];
const CLAIM_CEILING = 'The benchmark freezes links already recorded in the accepted Atlas graph and maintainer-confirmed negative controls. Recovery against it shows only that a route can find links of the recorded kind, subject to the leakage audit in the evaluation record. The controls were proposed as lexically similar pairs with no declared signal, so they bound burden on the lexical and semantic routes only.';

const validIso = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) && Number.isFinite(Date.parse(value));

// Independent extraction of recorded direct release pairs from the accepted
// graph. Deliberately duplicates, rather than imports, the generator's notion
// so that the two can be cross-checked in tests.
function recordedDirectPairs(root, corpus) {
  const methodRegistry = JSON.parse(fs.readFileSync(path.join(root, 'data', 'METHOD_REGISTRY.json'), 'utf8'));
  const relationshipRegistry = loadRelationshipArtifacts(root).registry;
  const graph = buildResearchGraph({ papers: corpus.papers, methodRegistry, relationshipRegistry, baseUrl: BASE_URL, sourceCommit: '0'.repeat(40), sourceDate: '2026-01-01T00:00:00Z' });
  const keys = new Set();
  for (const edge of graph.edges) {
    if (String(edge.source).startsWith('release:') && String(edge.target).startsWith('release:')) {
      keys.add(text.pairKey(edge.source.slice(8), edge.target.slice(8)));
    }
  }
  return [...keys].sort().map(key => key.split('|'));
}

function selectHidden(positives, fingerprint) {
  const ranked = positives.map(pair => ({ pair, key: text.sha256(`${fingerprint}:${text.pairKey(...pair)}`) }));
  ranked.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return ranked.slice(0, Math.floor(positives.length / 2)).map(item => item.pair);
}

function sourceHash(root, files) {
  return text.sha256(files.map(rel => `${rel}:${text.sha256(fs.readFileSync(path.join(root, rel)))}`).join('\n'));
}

function freezeBenchmark(root, { controlsPath = CONTROLS_REL, frozenAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z') } = {}) {
  const corpus = text.loadCorpus(root);
  const positives = recordedDirectPairs(root, corpus);
  const directKeys = new Set(positives.map(p => text.pairKey(...p)));
  const controls = JSON.parse(fs.readFileSync(path.join(root, controlsPath), 'utf8'));
  if (!controls.confirmedBy || !Array.isArray(controls.pairs) || !controls.pairs.length) {
    throw new Error(`${controlsPath}: needs confirmedBy, confirmedAt and a non-empty pairs list`);
  }
  if (!validIso(controls.confirmedAt)) throw new Error(`${controlsPath}: confirmedAt must be an ISO UTC date-time of the form YYYY-MM-DDTHH:MM:SSZ`);
  if (!validIso(frozenAt)) throw new Error('frozenAt must be an ISO UTC date-time');
  if (controls.confirmedAt > frozenAt) throw new Error(`${controlsPath}: confirmedAt ${controls.confirmedAt} is after frozenAt ${frozenAt}; confirmation must precede the freeze`);
  const slugs = new Set(corpus.slugs);
  const seen = new Set();
  const negatives = controls.pairs.map(item => {
    const [a, b] = item.pair || [];
    if (!slugs.has(a) || !slugs.has(b) || a === b) throw new Error(`negative control ${a}|${b} does not name two distinct releases`);
    const key = text.pairKey(a, b);
    if (directKeys.has(key)) throw new Error(`negative control ${key} is a recorded positive`);
    if (seen.has(key)) throw new Error(`negative control ${key} is listed twice`);
    seen.add(key);
    if (!item.reason) throw new Error(`negative control ${key} lacks a reason`);
    return { pair: [a, b].sort(), reason: item.reason };
  });
  const benchmark = {
    schemaVersion: '1.0',
    recordType: 'evidence-atlas-discovery-benchmark',
    benchmarkVersion: BENCHMARK_VERSION,
    benchmarkSourceSha256: sourceHash(root, ['tools/atlas-text.js', 'tools/atlas-benchmark.js']),
    generatorSourceSha256AtFreeze: sourceHash(root, GENERATOR_SOURCE_FILES),
    frozenAt,
    corpusFingerprint: corpus.fingerprint,
    releaseCount: corpus.slugs.length,
    positives,
    hidden: selectHidden(positives, corpus.fingerprint),
    negatives,
    freezeProvenance: {
      negativeControlsPath: controlsPath,
      confirmedBy: controls.confirmedBy,
      confirmedAt: controls.confirmedAt,
      confirmationNote: controls.confirmationNote || null,
      selectionRule: 'sha256(fingerprint:pairKey) ascending, first floor(n/2)',
      positivesSource: 'release-to-release edges of the accepted graph built by tools/research-graph.js, extracted in tools/atlas-benchmark.js without importing the generator'
    },
    claimCeiling: CLAIM_CEILING
  };
  const file = path.join(root, BENCHMARK_REL);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(benchmark, null, 2) + '\n');
  return benchmark;
}

function loadBenchmark(root) {
  const raw = fs.readFileSync(path.join(root, BENCHMARK_REL), 'utf8');
  return { benchmark: JSON.parse(raw), sha256: text.sha256(raw), path: BENCHMARK_REL };
}

function main() {
  const [command] = process.argv.slice(2);
  const root = path.join(__dirname, '..');
  if (command === 'freeze') {
    const benchmark = freezeBenchmark(root);
    console.log(`froze ${benchmark.positives.length} positives (${benchmark.hidden.length} hidden) and ${benchmark.negatives.length} negatives at corpus ${benchmark.corpusFingerprint.slice(0, 12)}`);
  } else {
    throw new Error('usage: atlas-benchmark.js freeze   (propose negative controls with tools/atlas-negatives.js)');
  }
}

module.exports = { BENCHMARK_REL, CONTROLS_REL, BENCHMARK_VERSION, recordedDirectPairs, selectHidden, freezeBenchmark, loadBenchmark };

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exit(1); }
}
