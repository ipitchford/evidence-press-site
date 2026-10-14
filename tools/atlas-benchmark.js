#!/usr/bin/env node
'use strict';

// Freezes the Evidence Atlas discovery benchmark independently of the
// generator. Design record: docs/ATLAS_DISCOVERY_PILOT.md. Writes only
// data/atlas-discovery/BENCHMARK.json.

const fs = require('fs');
const path = require('path');
const text = require('./atlas-text');
const disc = require('./atlas-discovery');

const BENCHMARK_REL = 'data/atlas-discovery/BENCHMARK.json';
const CONTROLS_REL = 'data/atlas-discovery/NEGATIVE_CONTROLS.json';
const CLAIM_CEILING = 'The benchmark freezes links already recorded in the accepted Atlas graph and maintainer-confirmed negative controls. Recovery against it shows only that a route can find links of the recorded kind.';

function selectHidden(positives, fingerprint) {
  const ranked = positives.map(pair => ({ pair, key: text.sha256(`${fingerprint}:${text.pairKey(...pair)}`) }));
  ranked.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return ranked.slice(0, Math.floor(positives.length / 2)).map(item => item.pair);
}

function proposeNegatives(root, { count = 12, lexicalTopK = 150 } = {}) {
  const corpus = text.loadCorpus(root);
  const graph = disc.loadGraph(root, corpus.papers);
  const direct = disc.directPairs(graph);
  const adjacencyMap = disc.adjacency(graph);
  const overlap = disc.routeCitationOverlap(corpus.papers, disc.identityIndex(corpus.papers));
  const paths = disc.routeCitationPath(graph, new Set());
  const shared = disc.routeSharedObject(corpus.papers);
  const lexical = disc.routeLexical(corpus.texts, lexicalTopK);
  const titles = new Map(corpus.papers.map(p => [p.slug, p.shortTitle || p.title]));
  const out = [];
  for (const [key, entry] of lexical) {
    if (direct.has(key) || overlap.has(key) || paths.has(key) || shared.has(key) || adjacencyMap.has(key)) continue;
    const pair = key.split('|');
    out.push({
      pair,
      titles: pair.map(slug => titles.get(slug)),
      lexicalScore: entry.score,
      topTerms: entry.evidence.terms.slice(0, 6).map(t => t.term),
      reasons: ['no shared external reference', 'no shared keyword or mathObject', 'no shared citation intermediary', 'no shared cluster or lineage', 'no direct edge']
    });
    if (out.length >= count) break;
  }
  return out;
}

function freezeBenchmark(root, { controlsPath = CONTROLS_REL, frozenAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z') } = {}) {
  const corpus = text.loadCorpus(root);
  const graph = disc.loadGraph(root, corpus.papers);
  const direct = disc.directPairs(graph);
  const positives = [...direct.keys()].sort().map(key => key.split('|'));
  const controls = JSON.parse(fs.readFileSync(path.join(root, controlsPath), 'utf8'));
  if (!controls.confirmedBy || !controls.confirmedAt || !Array.isArray(controls.pairs) || !controls.pairs.length) {
    throw new Error(`${controlsPath}: needs confirmedBy, confirmedAt and a non-empty pairs list`);
  }
  const slugs = new Set(corpus.slugs);
  const seen = new Set();
  const negatives = controls.pairs.map(item => {
    const [a, b] = item.pair || [];
    if (!slugs.has(a) || !slugs.has(b) || a === b) throw new Error(`negative control ${a}|${b} does not name two distinct releases`);
    const key = text.pairKey(a, b);
    if (direct.has(key)) throw new Error(`negative control ${key} is a recorded positive`);
    if (seen.has(key)) throw new Error(`negative control ${key} is listed twice`);
    seen.add(key);
    if (!item.reason) throw new Error(`negative control ${key} lacks a reason`);
    return { pair: [a, b].sort(), reason: item.reason };
  });
  const benchmark = {
    schemaVersion: '1.0',
    recordType: 'evidence-atlas-discovery-benchmark',
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
      selectionRule: 'sha256(fingerprint:pairKey) ascending, first floor(n/2)'
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
  const [command, ...rest] = process.argv.slice(2);
  const root = path.join(__dirname, '..');
  if (command === 'propose-negatives') {
    const count = Number((rest.find(a => a.startsWith('--count=')) || '--count=12').split('=')[1]);
    console.log(JSON.stringify(proposeNegatives(root, { count }), null, 2));
  } else if (command === 'freeze') {
    const benchmark = freezeBenchmark(root);
    console.log(`froze ${benchmark.positives.length} positives (${benchmark.hidden.length} hidden) and ${benchmark.negatives.length} negatives at corpus ${benchmark.corpusFingerprint.slice(0, 12)}`);
  } else {
    throw new Error('usage: atlas-benchmark.js propose-negatives [--count=N] | freeze');
  }
}

module.exports = { BENCHMARK_REL, CONTROLS_REL, selectHidden, proposeNegatives, freezeBenchmark, loadBenchmark };

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exit(1); }
}
