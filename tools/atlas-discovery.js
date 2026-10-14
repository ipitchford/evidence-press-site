#!/usr/bin/env node
'use strict';

// Evidence Atlas bounded relationship-discovery generator (Stage 2).
// Design record: docs/ATLAS_DISCOVERY_PILOT.md.
//
// This tool nominates unrecorded release pairs through separately reported
// retrieval routes. It reads papers/*/meta.json, papers/*/body.md, the method
// registry and the relationship registry. It writes only under
// data/atlas-discovery/. It has no write path to the accepted graph.

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  loadRelationshipArtifacts, buildResearchGraph, normalizeDoiReference, internalReleaseSlug, buildReleaseIdentityIndex
} = require('./research-graph');
const { expectedProposalId } = require('./atlas-proposals');
const text = require('./atlas-text');

const GENERATOR_VERSION = '0.1.0';
const BASE_URL = 'https://evidencepress.org';
const ROUTES = ['citation-overlap', 'citation-path', 'shared-object', 'lexical', 'semantic'];
const EMBEDDING_MODEL = 'text-embedding-3-small';
const CUTOFFS = [25, 50, 100];
const INFERENCE_LIMIT = 'A discovery candidate is a retrieval result from separately reported routes. It is not an accepted relationship, dependency, novelty, priority or correctness claim, and it has no write path to the accepted Atlas graph.';
const CLAIM_CEILING = 'This run record nominates release pairs for human review. Recovery of hidden recorded links shows only that a route can find links of the kind already recorded.';
const RUNS_DIR = 'data/atlas-discovery/runs';
const DRAFTS_DIR = 'data/atlas-discovery/drafts';
const BENCHMARK_PATH = 'data/atlas-discovery/BENCHMARK.json';

function identityIndex(papers) { return buildReleaseIdentityIndex(papers); }

function loadGraph(root, papers) {
  const methodRegistry = JSON.parse(fs.readFileSync(path.join(root, 'data', 'METHOD_REGISTRY.json'), 'utf8'));
  const relationshipRegistry = loadRelationshipArtifacts(root).registry;
  return buildResearchGraph({
    papers, methodRegistry, relationshipRegistry, baseUrl: BASE_URL,
    sourceCommit: '0'.repeat(40), sourceDate: '2026-01-01T00:00:00Z'
  });
}

const isRelease = id => typeof id === 'string' && id.startsWith('release:');
const slugOf = id => id.slice('release:'.length);
const isoNow = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');

function directPairs(graph) {
  const pairs = new Map();
  for (const edge of graph.edges) {
    if (!isRelease(edge.source) || !isRelease(edge.target)) continue;
    const key = text.pairKey(slugOf(edge.source), slugOf(edge.target));
    if (!pairs.has(key)) pairs.set(key, []);
    pairs.get(key).push({ source: edge.source, target: edge.target, predicate: edge.predicate });
  }
  return pairs;
}

function adjacency(graph) {
  const memberships = new Map();
  for (const edge of graph.edges) {
    if (!isRelease(edge.source) || isRelease(edge.target)) continue;
    if (!['member-of-cluster', 'member-of-lineage'].includes(edge.predicate)) continue;
    if (!memberships.has(edge.target)) memberships.set(edge.target, { predicate: edge.predicate, slugs: [] });
    memberships.get(edge.target).slugs.push(slugOf(edge.source));
  }
  const shared = new Map();
  for (const [nodeId, { predicate, slugs }] of [...memberships].sort((x, y) => (x[0] < y[0] ? -1 : 1))) {
    const sorted = [...slugs].sort();
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const key = text.pairKey(sorted[i], sorted[j]);
        if (!shared.has(key)) shared.set(key, []);
        shared.get(key).push({ nodeId, predicate });
      }
    }
  }
  return shared;
}

function normalizeExternalReference(rawUrl, baseUrl, index) {
  if (internalReleaseSlug(rawUrl, baseUrl, index)) return null;
  const doi = normalizeDoiReference(rawUrl);
  if (doi) return `doi:${doi}`;
  try {
    const url = new URL(String(rawUrl).trim());
    url.hash = '';
    return `${url.protocol}//${url.hostname.toLowerCase().replace(/^www\./, '')}${url.pathname.replace(/\/+$/, '')}${url.search}`;
  } catch { return null; }
}

function pairwise(itemsBySlug, combine) {
  const out = new Map();
  const slugs = [...itemsBySlug.keys()].sort();
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const result = combine(itemsBySlug.get(slugs[i]), itemsBySlug.get(slugs[j]));
      if (result) out.set(text.pairKey(slugs[i], slugs[j]), result);
    }
  }
  return out;
}

function routeCitationOverlap(papers, index, baseUrl = BASE_URL) {
  const refs = new Map();
  for (const paper of papers) {
    const set = new Set();
    for (const work of paper.relatedWorks || []) {
      const ref = normalizeExternalReference(work.url, baseUrl, index);
      if (ref) set.add(ref);
    }
    refs.set(paper.slug, set);
  }
  return pairwise(refs, (a, b) => {
    const shared = [...a].filter(ref => b.has(ref)).sort();
    return shared.length ? { score: shared.length, evidence: { sharedReferences: shared } } : null;
  });
}

function routeCitationPath(graph, excludedPairKeys) {
  const neighbours = new Map();
  const direct = new Set();
  for (const edge of graph.edges) {
    if (!isRelease(edge.source) || !isRelease(edge.target)) continue;
    const a = slugOf(edge.source);
    const b = slugOf(edge.target);
    if (excludedPairKeys.has(text.pairKey(a, b))) continue;
    direct.add(text.pairKey(a, b));
    if (!neighbours.has(a)) neighbours.set(a, new Set());
    if (!neighbours.has(b)) neighbours.set(b, new Set());
    neighbours.get(a).add(b);
    neighbours.get(b).add(a);
  }
  const out = new Map();
  for (const [mid, set] of [...neighbours].sort((x, y) => (x[0] < y[0] ? -1 : 1))) {
    const slugs = [...set].sort();
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        const key = text.pairKey(slugs[i], slugs[j]);
        if (direct.has(key)) continue;
        if (!out.has(key)) out.set(key, { score: 0, evidence: { intermediaries: [] } });
        out.get(key).score += 1;
        out.get(key).evidence.intermediaries.push(mid);
      }
    }
  }
  return out;
}

function routeSharedObject(papers) {
  const objects = new Map();
  for (const paper of papers) {
    objects.set(paper.slug, {
      keywords: new Set((paper.keywords || []).map(k => String(k).toLowerCase().replace(/\s+/g, ' ').trim()).filter(Boolean)),
      mathObjects: new Set((paper.mathObjects || []).map(o => String(o.id || '').toLowerCase()).filter(Boolean))
    });
  }
  return pairwise(objects, (a, b) => {
    const keywords = [...a.keywords].filter(k => b.keywords.has(k)).sort();
    const mathObjects = [...a.mathObjects].filter(k => b.mathObjects.has(k)).sort();
    const score = keywords.length + mathObjects.length;
    return score ? { score, evidence: { keywords, mathObjects } } : null;
  });
}

function routeLexical(texts, topK) {
  const { vectors } = text.tfidfVectors(texts);
  const scored = [];
  const slugs = [...vectors.keys()].sort();
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const score = text.cosine(vectors.get(slugs[i]), vectors.get(slugs[j]));
      if (score > 0) scored.push({ key: text.pairKey(slugs[i], slugs[j]), a: slugs[i], b: slugs[j], score });
    }
  }
  scored.sort((x, y) => y.score - x.score || (x.key < y.key ? -1 : 1));
  const out = new Map();
  for (const item of scored.slice(0, topK)) {
    out.set(item.key, {
      score: Number(item.score.toFixed(6)),
      evidence: { terms: text.topContributingTerms(vectors.get(item.a), vectors.get(item.b), 10) }
    });
  }
  return out;
}

function signals(candidate) { return ROUTES.filter(r => candidate.routes[r] && candidate.routes[r] !== 'not-run'); }

const RIVAL_RULES = [
  {
    id: 'recorded-adjacency',
    when: c => c.existingAdjacency.length > 0,
    text: c => `Already-recorded adjacency: the releases share ${c.existingAdjacency.map(a => a.nodeId).join(', ')}, so the candidate may add nothing beyond registered membership.`
  },
  {
    id: 'common-vocabulary',
    when: c => signals(c).length > 0 && signals(c).every(r => r === 'lexical' || r === 'semantic'),
    text: c => {
      const terms = ((c.routes.lexical && c.routes.lexical !== 'not-run' && c.routes.lexical.evidence) || { terms: [] }).terms.slice(0, 5).map(t => t.term);
      return `Common vocabulary without common mechanism: the shared terms (${terms.join(', ') || 'embedding similarity only'}) may be method or genre vocabulary that recurs across unrelated releases.`;
    }
  },
  {
    id: 'shared-background-citation',
    when: c => signals(c).join() === 'citation-overlap',
    text: c => `Shared background citation: both releases cite ${c.routes['citation-overlap'].evidence.sharedReferences.join(', ')}, which may be a standard reference rather than a dependency between the releases.`
  },
  {
    id: 'common-neighbour',
    when: c => signals(c).join() === 'citation-path',
    text: c => `Common neighbour: both releases relate to ${c.routes['citation-path'].evidence.intermediaries.join(', ')} independently; a shared intermediary does not imply a direct relationship.`
  },
  {
    id: 'broad-keyword',
    when: c => signals(c).join() === 'shared-object',
    text: c => `Declared keyword overlap: ${[...c.routes['shared-object'].evidence.keywords, ...c.routes['shared-object'].evidence.mathObjects].join(', ')} may be broad field labels rather than a shared object.`
  },
  {
    id: 'field-convention',
    when: () => true,
    text: () => 'Coincident vocabulary and references within one research area: the signals may reflect field convention rather than a specific shared lemma, antecedent, assumption or dependency.'
  }
];

// Synthetic evidence patterns proving every rule is reachable (tested).
const EMPTY_ROUTES = { 'citation-overlap': null, 'citation-path': null, 'shared-object': null, lexical: null, semantic: 'not-run' };
const RIVAL_RULE_SAMPLES = [
  { routes: { ...EMPTY_ROUTES }, existingAdjacency: [{ nodeId: 'cluster:sample', predicate: 'member-of-cluster' }] },
  { routes: { ...EMPTY_ROUTES, lexical: { score: 0.2, evidence: { terms: [{ term: 'bound', contribution: 0.1 }] } } }, existingAdjacency: [] },
  { routes: { ...EMPTY_ROUTES, 'citation-overlap': { score: 1, evidence: { sharedReferences: ['doi:10.1000/x'] } } }, existingAdjacency: [] },
  { routes: { ...EMPTY_ROUTES, 'citation-path': { score: 1, evidence: { intermediaries: ['sample'] } } }, existingAdjacency: [] },
  { routes: { ...EMPTY_ROUTES, 'shared-object': { score: 1, evidence: { keywords: ['sat'], mathObjects: [] } } }, existingAdjacency: [] },
  { routes: { ...EMPTY_ROUTES, lexical: { score: 0.2, evidence: { terms: [] } }, 'citation-overlap': { score: 1, evidence: { sharedReferences: ['doi:10.1000/x'] } } }, existingAdjacency: [] }
];

function rivalExplanation(candidate) {
  const rule = RIVAL_RULES.find(r => r.when(candidate));
  return { ruleId: rule.id, text: rule.text(candidate), generatedBy: 'rule-generated' };
}

function assembleCandidates({ routes, excluded, adjacencyMap, benchmark = null }) {
  const keys = new Set();
  for (const route of ROUTES) {
    const map = routes[route];
    if (map instanceof Map) for (const key of map.keys()) keys.add(key);
  }
  const hidden = new Set(benchmark ? benchmark.hidden.map(p => text.pairKey(...p)) : []);
  const negatives = new Set(benchmark ? benchmark.negatives.map(n => text.pairKey(...n.pair)) : []);
  const candidates = [];
  for (const key of [...keys].sort()) {
    if (excluded.has(key)) continue;
    const routeEntries = {};
    for (const route of ROUTES) {
      const map = routes[route];
      routeEntries[route] = map === 'not-run' ? 'not-run' : (map instanceof Map && map.has(key) ? map.get(key) : null);
    }
    const candidate = {
      pair: key.split('|'),
      pairKey: key,
      routes: routeEntries,
      routeSignalCount: 0,
      existingAdjacency: adjacencyMap.get(key) || [],
      rivalExplanation: null,
      inferenceLimit: INFERENCE_LIMIT,
      benchmarkRole: hidden.has(key) ? 'hidden-positive' : negatives.has(key) ? 'negative-control' : null
    };
    candidate.routeSignalCount = signals(candidate).length;
    candidate.rivalExplanation = rivalExplanation(candidate);
    candidates.push(candidate);
  }
  const lex = c => (c.routes.lexical && c.routes.lexical !== 'not-run') ? c.routes.lexical.score : 0;
  candidates.sort((x, y) => y.routeSignalCount - x.routeSignalCount || lex(y) - lex(x) || (x.pairKey < y.pairKey ? -1 : 1));
  return candidates;
}

function buildRunRecord({ mode, corpus, routes, candidates, topK, routesRequested, benchmarkInfo, evaluation }) {
  const routesRun = ROUTES.filter(r => routes[r] instanceof Map);
  const routesNotRun = ROUTES.filter(r => routes[r] === 'not-run')
    .map(route => ({ route, reason: route === 'semantic' ? 'not requested (--semantic absent)' : 'not implemented' }));
  routesNotRun.push({
    route: 'symbolic-normalisation',
    reason: 'excluded from the pilot: only a small minority of releases declare mathObjects, so there is no reliable formal-object layer to normalise'
  });
  return {
    schemaVersion: '1.0',
    recordType: 'evidence-atlas-discovery-run',
    generatorVersion: GENERATOR_VERSION,
    generatedAt: isoNow(),
    mode,
    corpusFingerprint: corpus.fingerprint,
    releaseCount: corpus.slugs.length,
    parameters: { topK, routesRequested },
    routesRun,
    routesNotRun,
    benchmark: benchmarkInfo,
    candidateCount: candidates.length,
    candidates,
    evaluation,
    reviewerEffort: null,
    claimCeiling: CLAIM_CEILING,
    inferenceLimit: INFERENCE_LIMIT
  };
}

function runDiscovery(root, { topK = 100, semanticScores = null, benchmark = null } = {}) {
  const corpus = text.loadCorpus(root);
  const graph = loadGraph(root, corpus.papers);
  const direct = directPairs(graph);
  const hiddenKeys = new Set(benchmark ? benchmark.hidden.map(p => text.pairKey(...p)) : []);
  const excluded = new Set([...direct.keys()].filter(key => !hiddenKeys.has(key)));
  const routes = {
    'citation-overlap': routeCitationOverlap(corpus.papers, identityIndex(corpus.papers)),
    'citation-path': routeCitationPath(graph, hiddenKeys),
    'shared-object': routeSharedObject(corpus.papers),
    lexical: routeLexical(corpus.texts, topK),
    semantic: semanticScores instanceof Map ? semanticScores : 'not-run'
  };
  const candidates = assembleCandidates({ routes, excluded, adjacencyMap: adjacency(graph), benchmark });
  const routesRequested = ROUTES.filter(r => routes[r] !== 'not-run');
  return buildRunRecord({
    mode: benchmark ? 'evaluate' : 'run', corpus, routes, candidates, topK, routesRequested, benchmarkInfo: null, evaluation: null
  });
}

function defaultCacheDir() { return path.join(os.homedir(), 'Library', 'Caches', 'evidence-press-atlas-discovery'); }

async function embedTexts(texts, { apiKey, cacheDir = defaultCacheDir(), fetchImpl = globalThis.fetch, model = EMBEDDING_MODEL, batchSize = 32 } = {}) {
  const dir = path.join(cacheDir, model);
  fs.mkdirSync(dir, { recursive: true });
  const vectors = new Map();
  const pending = [];
  for (const [slug, body] of [...texts].sort((x, y) => (x[0] < y[0] ? -1 : 1))) {
    const clipped = body.slice(0, 24000);
    const file = path.join(dir, `${text.sha256(clipped)}.json`);
    if (fs.existsSync(file)) vectors.set(slug, JSON.parse(fs.readFileSync(file, 'utf8')).vector);
    else pending.push({ slug, clipped, file });
  }
  for (let i = 0; i < pending.length; i += batchSize) {
    const batch = pending.slice(i, i + batchSize);
    const response = await fetchImpl('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input: batch.map(item => item.clipped) })
    });
    if (!response.ok) throw new Error(`semantic route: embeddings request failed with HTTP ${response.status}`);
    const payload = await response.json();
    for (const item of payload.data) {
      const target = batch[item.index];
      fs.writeFileSync(target.file, JSON.stringify({ model, vector: item.embedding }));
      vectors.set(target.slug, item.embedding);
    }
  }
  return vectors;
}

function semanticScoresFromVectors(vectors, topK, model = EMBEDDING_MODEL) {
  const norm = v => Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  const slugs = [...vectors.keys()].sort();
  const norms = new Map(slugs.map(s => [s, norm(vectors.get(s))]));
  const scored = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const a = vectors.get(slugs[i]);
      const b = vectors.get(slugs[j]);
      let dot = 0;
      for (let k = 0; k < a.length; k++) dot += a[k] * b[k];
      scored.push({ key: text.pairKey(slugs[i], slugs[j]), score: dot / (norms.get(slugs[i]) * norms.get(slugs[j])) });
    }
  }
  scored.sort((x, y) => y.score - x.score || (x.key < y.key ? -1 : 1));
  return new Map(scored.slice(0, topK).map(item => [item.key, { score: Number(item.score.toFixed(6)), evidence: { model } }]));
}

async function semanticRoute(root, { apiKey = process.env.OPENAI_API_KEY, cacheDir, fetchImpl, model = EMBEDDING_MODEL, topK = 100 } = {}) {
  if (!apiKey) throw new Error('semantic route requested with --semantic but OPENAI_API_KEY is not set; the route is never silently skipped');
  const corpus = text.loadCorpus(root);
  const vectors = await embedTexts(corpus.texts, { apiKey, cacheDir, fetchImpl, model });
  return semanticScoresFromVectors(vectors, topK, model);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) { args[arg.slice(2)] = next; i++; } else args[arg.slice(2)] = true;
    } else args._.push(arg);
  }
  return args;
}

function writeRun(root, record, outDir) {
  const dir = path.join(root, outDir);
  fs.mkdirSync(dir, { recursive: true });
  const stamp = record.generatedAt.slice(0, 10);
  const suffix = record.mode === 'evaluate' ? '-evaluation' : '';
  const file = path.join(dir, `${stamp}-${record.corpusFingerprint.slice(0, 12)}${suffix}.json`);
  fs.writeFileSync(file, JSON.stringify(record, null, 2) + '\n');
  return file;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.join(__dirname, '..');
  const command = args._[0];
  const topK = Number(args['top-k'] || 100);
  const outDir = args.out || RUNS_DIR;
  if (command === 'run') {
    const semanticScores = args.semantic ? await semanticRoute(root, { topK }) : null;
    const record = runDiscovery(root, { topK, semanticScores });
    const file = writeRun(root, record, outDir);
    console.log(`wrote ${path.relative(root, file)}: ${record.candidateCount} candidates from routes ${record.routesRun.join(', ')}`);
    return;
  }
  throw new Error(`unknown command ${command}; use run | evaluate | draft`);
}

module.exports = {
  GENERATOR_VERSION, ROUTES, RIVAL_RULES, RIVAL_RULE_SAMPLES, INFERENCE_LIMIT, CLAIM_CEILING, EMBEDDING_MODEL, BASE_URL, CUTOFFS,
  RUNS_DIR, DRAFTS_DIR, BENCHMARK_PATH,
  identityIndex, loadGraph, directPairs, adjacency, normalizeExternalReference,
  routeCitationOverlap, routeCitationPath, routeSharedObject, routeLexical,
  signals, rivalExplanation, assembleCandidates, buildRunRecord, runDiscovery, embedTexts, semanticScoresFromVectors, semanticRoute, parseArgs, writeRun
};

if (require.main === module) main().catch(error => { console.error(error.message); process.exit(1); });
