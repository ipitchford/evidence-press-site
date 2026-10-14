#!/usr/bin/env node
'use strict';

// Evidence Atlas bounded relationship-discovery generator (Stage 2).
// Design record: docs/ATLAS_DISCOVERY_PILOT.md.
//
// This tool nominates unrecorded release pairs through separately reported
// retrieval routes. It reads papers/*/meta.json, papers/*/body.md, the method
// registry and the relationship registry. Every file it writes is confined to
// data/atlas-discovery/ (or to a directory outside the repository for tests).
// It has no write path to the accepted graph, the registries, papers/ or the
// live proposal register.

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  loadRelationshipArtifacts, buildResearchGraph, normalizeDoiReference, internalReleaseSlug, buildReleaseIdentityIndex
} = require('./research-graph');
const { expectedProposalId, validateProposal } = require('./atlas-proposals');
const text = require('./atlas-text');

const GENERATOR_VERSION = '0.2.0';
const GENERATOR_SOURCE_FILES = ['tools/atlas-text.js', 'tools/atlas-discovery.js'];
const BASE_URL = 'https://evidencepress.org';
const ROUTES = ['citation-overlap', 'citation-path', 'shared-object', 'lexical', 'semantic'];
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_CLIP_CHARS = 24000;
const CUTOFFS = [25, 50, 100];
const INFERENCE_LIMIT = 'A discovery candidate is a retrieval result from separately reported routes. It is not an accepted relationship, dependency, novelty, priority or correctness claim, and it has no write path to the accepted Atlas graph.';
const CLAIM_CEILING = 'This run record nominates release pairs for human review. Recovery of hidden recorded links shows only that a route can find links of the kind already recorded, and only to the extent that the leakage audit shows the counterpart was not named explicitly.';
const QUARANTINE_DIR = 'data/atlas-discovery';
const RUNS_DIR = 'data/atlas-discovery/runs';
const DRAFTS_DIR = 'data/atlas-discovery/drafts';
const INTAKE_DIR = 'data/atlas-discovery/drafts/intake';
const BENCHMARK_PATH = 'data/atlas-discovery/BENCHMARK.json';
const DRAFT_RECORD_TYPE = 'evidence-atlas-discovery-draft';
const RUN_RECORD_TYPE = 'evidence-atlas-discovery-run';

const isRelease = id => typeof id === 'string' && id.startsWith('release:');
const slugOf = id => id.slice('release:'.length);
const isoNow = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const validIso = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) && Number.isFinite(Date.parse(value));

function generatorSourceSha256(root) {
  return text.sha256(GENERATOR_SOURCE_FILES.map(rel => `${rel}:${text.sha256(fs.readFileSync(path.join(root, rel)))}`).join('\n'));
}

// Resolve a path and confine it. A path is accepted when its real location is
// under <root>/<mustBeUnder>/, or (when allowOutsideRepo is set) when it lies
// entirely outside the repository. Any other location inside the repository is
// refused, including symlinks that point back inside it.
function confinePath(root, candidate, { allowOutsideRepo = false, mustBeUnder = QUARANTINE_DIR } = {}) {
  const rootReal = fs.realpathSync(root);
  const resolved = path.resolve(root, String(candidate));
  let probe = resolved;
  while (!fs.existsSync(probe)) probe = path.dirname(probe);
  const realExisting = fs.realpathSync(probe);
  const real = path.join(realExisting, path.relative(probe, resolved));
  const quarantine = path.join(rootReal, mustBeUnder);
  const insideRepo = real === rootReal || real.startsWith(rootReal + path.sep);
  const insideQuarantine = real === quarantine || real.startsWith(quarantine + path.sep);
  if (insideQuarantine) return real;
  if (!insideRepo && allowOutsideRepo) return real;
  throw new Error(`path ${candidate} is not under ${mustBeUnder}${allowOutsideRepo ? ' or outside the repository' : ''}; refusing`);
}

function identityIndex(papers) { return buildReleaseIdentityIndex(papers); }

function loadGraph(root, papers) {
  const methodRegistry = JSON.parse(fs.readFileSync(path.join(root, 'data', 'METHOD_REGISTRY.json'), 'utf8'));
  const relationshipRegistry = loadRelationshipArtifacts(root).registry;
  return buildResearchGraph({
    papers, methodRegistry, relationshipRegistry, baseUrl: BASE_URL,
    sourceCommit: '0'.repeat(40), sourceDate: '2026-01-01T00:00:00Z'
  });
}

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

// Conservative canonical form for an external reference: DOI when present,
// otherwise https scheme, lower-case host without www, no trailing slash, no
// fragment, sorted query parameters, and no arXiv version suffix.
function normalizeExternalReference(rawUrl, baseUrl, index) {
  if (internalReleaseSlug(rawUrl, baseUrl, index)) return null;
  const doi = normalizeDoiReference(rawUrl);
  if (doi) return `doi:${doi}`;
  try {
    const url = new URL(String(rawUrl).trim());
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let pathname = url.pathname.replace(/\/+$/, '');
    if (host === 'arxiv.org') pathname = pathname.replace(/v\d+$/, '');
    const params = [...url.searchParams.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1));
    const query = params.length ? '?' + params.map(([k, v]) => `${k}=${v}`).join('&') : '';
    return `https://${host}${pathname}${query}`;
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

// Undirected distance-two over accepted direct release edges. Predicate
// direction is deliberately ignored; the evidence says so.
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
        if (!out.has(key)) out.set(key, { score: 0, evidence: { pathType: 'undirected-distance-two', intermediaries: [] } });
        out.get(key).score += 1;
        out.get(key).evidence.intermediaries.push(mid);
      }
    }
  }
  return out;
}

// Declared keywords that label a release's status, genre or production method
// rather than a mathematical or empirical object. They are excluded from the
// shared-object route because two releases sharing one say nothing about a
// relationship between them. Keep this list short and explicit; it is tested.
const GENRE_KEYWORDS = new Set([
  'unrefereed candidate', 'computer-assisted mathematics', 'computer-assisted proof', 'computer-assisted algebra',
  'reproducible research', 'negative results', 'exact certificates', 'exact certificate', 'exact arithmetic',
  'validated numerics', 'computational commutative algebra'
]);

function routeSharedObject(papers) {
  const objects = new Map();
  for (const paper of papers) {
    objects.set(paper.slug, {
      keywords: new Set((paper.keywords || []).map(k => String(k).toLowerCase().replace(/\s+/g, ' ').trim()).filter(k => k && !GENRE_KEYWORDS.has(k))),
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

// Top-K is taken over ELIGIBLE pairs only (excluded pairs never consume a slot).
function routeLexical(texts, topK, excluded = new Set()) {
  const { vectors } = text.tfidfVectors(texts);
  const scored = [];
  const slugs = [...vectors.keys()].sort();
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const key = text.pairKey(slugs[i], slugs[j]);
      if (excluded.has(key)) continue;
      const score = text.cosine(vectors.get(slugs[i]), vectors.get(slugs[j]));
      if (score > 0) scored.push({ key, a: slugs[i], b: slugs[j], score });
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
    text: c => `Common neighbour: both releases are at undirected distance two through ${c.routes['citation-path'].evidence.intermediaries.join(', ')}; a shared neighbour does not imply a direct relationship.`
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
  { routes: { ...EMPTY_ROUTES, 'citation-path': { score: 1, evidence: { pathType: 'undirected-distance-two', intermediaries: ['sample'] } } }, existingAdjacency: [] },
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

function buildRunRecord({ root, mode, corpus, routes, candidates, topK, routesRequested, benchmarkInfo, evaluation, semanticProvenance }) {
  const routesRun = ROUTES.filter(r => routes[r] instanceof Map);
  const routesNotRun = ROUTES.filter(r => routes[r] === 'not-run')
    .map(route => ({ route, reason: route === 'semantic' ? 'not requested (--semantic absent)' : 'not implemented' }));
  routesNotRun.push({
    route: 'symbolic-normalisation',
    reason: 'excluded from the pilot: only a small minority of releases declare mathObjects, so there is no reliable formal-object layer to normalise'
  });
  return {
    schemaVersion: '1.0',
    recordType: RUN_RECORD_TYPE,
    generatorVersion: GENERATOR_VERSION,
    generatorSourceSha256: generatorSourceSha256(root),
    generatedAt: isoNow(),
    mode,
    corpusFingerprint: corpus.fingerprint,
    releaseCount: corpus.slugs.length,
    parameters: { topK, routesRequested, topKAppliesTo: 'eligible pairs only (recorded direct pairs never consume a slot)' },
    routesRun,
    routesNotRun,
    semanticProvenance,
    determinism: semanticProvenance
      ? 'Non-semantic routes are deterministic for a corpus fingerprint and generator source hash. The semantic route is reproducible only while semanticProvenance.vectorsSha256 matches; provider or model changes can alter it.'
      : 'All routes run are deterministic for a corpus fingerprint and generator source hash.',
    benchmark: benchmarkInfo,
    candidateCount: candidates.length,
    candidates,
    evaluation,
    reviewerEffort: null,
    claimCeiling: CLAIM_CEILING,
    inferenceLimit: INFERENCE_LIMIT
  };
}

function runDiscovery(root, { topK = 100, semanticVectors = null, benchmark = null } = {}) {
  const corpus = text.loadCorpus(root);
  const graph = loadGraph(root, corpus.papers);
  const direct = directPairs(graph);
  const hiddenKeys = new Set(benchmark ? benchmark.hidden.map(p => text.pairKey(...p)) : []);
  const excluded = new Set([...direct.keys()].filter(key => !hiddenKeys.has(key)));
  let semantic = 'not-run';
  let semanticProvenance = null;
  if (semanticVectors instanceof Map) {
    semantic = semanticScoresFromVectors(semanticVectors, topK, EMBEDDING_MODEL, excluded);
    semanticProvenance = vectorProvenance(semanticVectors);
  }
  const routes = {
    'citation-overlap': routeCitationOverlap(corpus.papers, identityIndex(corpus.papers)),
    'citation-path': routeCitationPath(graph, hiddenKeys),
    'shared-object': routeSharedObject(corpus.papers),
    lexical: routeLexical(corpus.texts, topK, excluded),
    semantic
  };
  const candidates = assembleCandidates({ routes, excluded, adjacencyMap: adjacency(graph), benchmark });
  const routesRequested = ROUTES.filter(r => routes[r] !== 'not-run');
  return buildRunRecord({
    root, mode: benchmark ? 'evaluate' : 'run', corpus, routes, candidates, topK, routesRequested,
    benchmarkInfo: null, evaluation: null, semanticProvenance
  });
}

// ---------------------------------------------------------------- semantic ---

function defaultCacheDir() { return path.join(os.homedir(), 'Library', 'Caches', 'evidence-press-atlas-discovery'); }

function validCachedVector(entry, model, textSha256) {
  return Boolean(entry) && entry.model === model && entry.textSha256 === textSha256 && entry.clipChars === EMBEDDING_CLIP_CHARS
    && Array.isArray(entry.vector) && entry.vector.length > 0 && entry.vector.every(x => typeof x === 'number' && Number.isFinite(x));
}

async function embedTexts(texts, { apiKey, cacheDir = defaultCacheDir(), fetchImpl = globalThis.fetch, model = EMBEDDING_MODEL, batchSize = 32 } = {}) {
  const dir = path.join(cacheDir, model);
  fs.mkdirSync(dir, { recursive: true });
  const vectors = new Map();
  const pending = [];
  for (const [slug, body] of [...texts].sort((x, y) => (x[0] < y[0] ? -1 : 1))) {
    const fullHash = text.sha256(body);
    const clipped = body.slice(0, EMBEDDING_CLIP_CHARS);
    const file = path.join(dir, `${fullHash}-${EMBEDDING_CLIP_CHARS}.json`);
    let cached = null;
    if (fs.existsSync(file)) {
      try { cached = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { cached = null; }
    }
    if (validCachedVector(cached, model, fullHash)) vectors.set(slug, cached.vector);
    else pending.push({ slug, clipped, file, fullHash });
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
      const entry = { model, textSha256: target.fullHash, clipChars: EMBEDDING_CLIP_CHARS, vector: item.embedding };
      if (!validCachedVector(entry, model, target.fullHash)) throw new Error(`semantic route: provider returned an invalid vector for ${target.slug}`);
      fs.writeFileSync(target.file, JSON.stringify(entry));
      vectors.set(target.slug, item.embedding);
    }
  }
  return vectors;
}

function vectorProvenance(vectors, model = EMBEDDING_MODEL) {
  const slugs = [...vectors.keys()].sort();
  const digest = text.sha256(slugs.map(s => `${s}:${text.sha256(JSON.stringify(vectors.get(s)))}`).join('\n'));
  return { model, clipChars: EMBEDDING_CLIP_CHARS, vectorCount: slugs.length, dimension: slugs.length ? vectors.get(slugs[0]).length : 0, vectorsSha256: digest };
}

function semanticScoresFromVectors(vectors, topK, model = EMBEDDING_MODEL, excluded = new Set()) {
  const norm = v => Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  const slugs = [...vectors.keys()].sort();
  const norms = new Map(slugs.map(s => [s, norm(vectors.get(s))]));
  const scored = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const key = text.pairKey(slugs[i], slugs[j]);
      if (excluded.has(key)) continue;
      const a = vectors.get(slugs[i]);
      const b = vectors.get(slugs[j]);
      let dot = 0;
      for (let k = 0; k < a.length; k++) dot += a[k] * b[k];
      scored.push({ key, score: dot / (norms.get(slugs[i]) * norms.get(slugs[j])) });
    }
  }
  scored.sort((x, y) => y.score - x.score || (x.key < y.key ? -1 : 1));
  return new Map(scored.slice(0, topK).map(item => [item.key, { score: Number(item.score.toFixed(6)), evidence: { model } }]));
}

async function semanticVectorsForCorpus(root, { apiKey = process.env.OPENAI_API_KEY, cacheDir, fetchImpl, model = EMBEDDING_MODEL } = {}) {
  if (!apiKey) throw new Error('semantic route requested with --semantic but OPENAI_API_KEY is not set; the route is never silently skipped');
  const corpus = text.loadCorpus(root);
  return embedTexts(corpus.texts, { apiKey, cacheDir, fetchImpl, model });
}

// -------------------------------------------------------------- evaluation ---

function rankingStats(ordered, hiddenKeys, negativeKeys) {
  const position = new Map(ordered.map((key, i) => [key, i + 1]));
  const recoveryAt = {};
  const negativesAt = {};
  for (const k of CUTOFFS) {
    const hits = hiddenKeys.filter(key => position.has(key) && position.get(key) <= k).length;
    recoveryAt[k] = { hits, fraction: hiddenKeys.length ? Number((hits / hiddenKeys.length).toFixed(4)) : null };
    negativesAt[k] = negativeKeys.filter(key => position.has(key) && position.get(key) <= k).length;
  }
  const hiddenRanks = {};
  for (const key of hiddenKeys) hiddenRanks[key] = position.has(key) ? position.get(key) : 'absent';
  return { ranked: ordered.length, recoveryAt, negativesAt, hiddenRanks };
}

// Does either member of a hidden pair name its counterpart explicitly? If so,
// lexical or semantic recovery of that pair may be label leakage rather than
// discovery under genuine missingness.
function leakageAudit(corpus, hiddenPairs) {
  const metaBySlug = new Map(corpus.papers.map(p => [p.slug, p]));
  const lower = new Map([...corpus.texts].map(([s, t]) => [s, t.toLowerCase()]));
  const mentions = (from, to) => {
    const body = lower.get(from) || '';
    const meta = metaBySlug.get(to) || {};
    const kinds = [];
    const slugRe = new RegExp(`(^|[^a-z0-9-])${to.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9-]|$)`);
    if (to.length >= 4 && slugRe.test(body)) kinds.push('slug');
    if (meta.title && body.includes(String(meta.title).toLowerCase())) kinds.push('title');
    if (meta.shortTitle && String(meta.shortTitle).length >= 12 && body.includes(String(meta.shortTitle).toLowerCase())) kinds.push('shortTitle');
    const doi = normalizeDoiReference(meta.doi, { allowBare: true });
    if (doi && body.includes(doi)) kinds.push('doi');
    if (body.includes(`/releases/${to.toLowerCase()}/`)) kinds.push('releaseUrl');
    return kinds;
  };
  const pairs = hiddenPairs.map(([a, b]) => {
    const ab = mentions(a, b);
    const ba = mentions(b, a);
    return { pairKey: text.pairKey(a, b), explicitMention: ab.length + ba.length > 0, mentionKinds: { [`${a}->${b}`]: ab, [`${b}->${a}`]: ba } };
  });
  return {
    method: 'Case-insensitive search of each member\'s abstract and body for the counterpart\'s slug, title, short title (12+ characters), DOI or release URL.',
    hiddenCount: pairs.length,
    hiddenWithExplicitMention: pairs.filter(p => p.explicitMention).length,
    pairs
  };
}

function evaluateRun(record, benchmark, corpus = null) {
  const hiddenKeys = benchmark.hidden.map(p => text.pairKey(...p));
  const negativeKeys = benchmark.negatives.map(n => text.pairKey(...n.pair));
  const perRoute = {};
  for (const route of ROUTES) {
    const withSignal = record.candidates.filter(c => c.routes[route] && c.routes[route] !== 'not-run');
    if (!withSignal.length) { perRoute[route] = { ranked: 0, note: 'no signal or not run' }; continue; }
    withSignal.sort((x, y) => y.routes[route].score - x.routes[route].score || (x.pairKey < y.pairKey ? -1 : 1));
    perRoute[route] = rankingStats(withSignal.map(c => c.pairKey), hiddenKeys, negativeKeys);
  }
  const union = rankingStats(record.candidates.map(c => c.pairKey), hiddenKeys, negativeKeys);
  const audit = corpus ? leakageAudit(corpus, benchmark.hidden) : null;
  let unionWithoutExplicitMention = null;
  if (audit) {
    const clean = audit.pairs.filter(p => !p.explicitMention).map(p => p.pairKey);
    unionWithoutExplicitMention = rankingStats(record.candidates.map(c => c.pairKey), clean, negativeKeys);
  }
  return {
    hiddenCount: hiddenKeys.length,
    negativeCount: negativeKeys.length,
    cutoffs: CUTOFFS,
    perRoute,
    union,
    leakageAudit: audit,
    unionWithoutExplicitMention,
    controlsCaveat: 'Negative controls were proposed as lexically similar pairs with no citation, keyword, path or adjacency signal and then confirmed by the maintainer. They therefore carry at most lexical and semantic signal and are structurally disadvantaged on the union ordering, which sorts by route-signal count first. negativesAt for the lexical and semantic routes measures where known controls rank on those routes; negativesAt for the union is not an estimate of false-proposal burden among unlabelled candidates. Burden among emitted candidates requires blinded labelling of a sample.',
    reviewerEffort: null,
    note: 'recovery, false-proposal burden and reviewer effort are reported separately and never combined'
  };
}

function evaluateDiscovery(root, { topK = 100, semanticVectors = null, benchmark, benchmarkInfo = null } = {}) {
  const corpus = text.loadCorpus(root);
  if (!benchmark || benchmark.corpusFingerprint !== corpus.fingerprint) {
    throw new Error(`benchmark corpus fingerprint ${String(benchmark && benchmark.corpusFingerprint).slice(0, 12)} does not match the live corpus ${corpus.fingerprint.slice(0, 12)}; refreeze before evaluating`);
  }
  const record = runDiscovery(root, { topK, semanticVectors, benchmark });
  record.benchmark = benchmarkInfo || { path: BENCHMARK_PATH, sha256: null, hiddenCount: benchmark.hidden.length, negativeCount: benchmark.negatives.length };
  record.evaluation = evaluateRun(record, benchmark, corpus);
  return record;
}

// ------------------------------------------------------------------ drafts ---

function routeSummary(candidate) {
  const parts = [];
  const r = candidate.routes;
  const has = route => r[route] && r[route] !== 'not-run';
  if (has('citation-overlap')) parts.push(`shared external references: ${r['citation-overlap'].evidence.sharedReferences.join(', ')}`);
  if (has('citation-path')) parts.push(`undirected distance two through: ${r['citation-path'].evidence.intermediaries.join(', ')}`);
  if (has('shared-object')) parts.push(`shared declared objects: ${[...r['shared-object'].evidence.keywords, ...r['shared-object'].evidence.mathObjects].join(', ')}`);
  if (has('lexical')) parts.push(`lexical cosine ${r.lexical.score} on terms ${r.lexical.evidence.terms.slice(0, 6).map(t => t.term).join(', ')}`);
  if (has('semantic')) parts.push(`embedding cosine ${r.semantic.score} (${r.semantic.evidence.model})`);
  return parts.join('; ') || 'no route signal';
}

// Load a run record for drafting. The path must be confined to the runs
// directory and the record must match the live corpus and generator.
function loadRunRecordForDraft(root, runPathArg) {
  const real = confinePath(root, runPathArg, { mustBeUnder: RUNS_DIR });
  const runPath = path.relative(fs.realpathSync(root), real).split(path.sep).join('/');
  if (!fs.existsSync(real)) throw new Error(`run record ${runPath} does not exist`);
  const raw = fs.readFileSync(real, 'utf8');
  const record = JSON.parse(raw);
  const corpus = text.loadCorpus(root);
  const problems = [];
  if (record.recordType !== RUN_RECORD_TYPE) problems.push(`recordType ${record.recordType} is not ${RUN_RECORD_TYPE}`);
  if (record.generatorVersion !== GENERATOR_VERSION) problems.push(`generatorVersion ${record.generatorVersion} is not the current ${GENERATOR_VERSION}`);
  if (record.generatorSourceSha256 !== generatorSourceSha256(root)) problems.push('generatorSourceSha256 does not match the current generator source');
  if (record.corpusFingerprint !== corpus.fingerprint) problems.push('corpusFingerprint does not match the live corpus');
  if (!Array.isArray(record.candidates)) problems.push('candidates is not an array');
  if (problems.length) throw new Error(`run record ${runPath} is not usable for drafting: ${problems.join('; ')}`);
  return { record, runPath, runSha256: text.sha256(raw), corpus };
}

function loadBenchmarkIfPresent(root) {
  const file = path.join(root, BENCHMARK_PATH);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function negativeKeySet(benchmark) {
  return new Set(benchmark ? benchmark.negatives.map(n => text.pairKey(...n.pair)) : []);
}

function checkPairsDraftable({ corpus, graph, pairKeys, benchmark, allowNegative }) {
  const slugs = new Set(corpus.slugs);
  const direct = directPairs(graph);
  const negatives = negativeKeySet(benchmark);
  const flags = new Set();
  for (const key of pairKeys) {
    const [a, b] = key.split('|');
    if (!slugs.has(a) || !slugs.has(b) || a === b) throw new Error(`pair ${key} does not name two distinct live releases`);
    if (direct.has(key)) throw new Error(`pair ${key} already has a direct Atlas edge; nothing to nominate`);
    if (negatives.has(key)) {
      if (!allowNegative) throw new Error(`pair ${key} is a benchmark negative control; pass --allow-negative to draft it deliberately`);
      flags.add('benchmark-negative-control');
    }
  }
  return flags;
}

function proposalTemplateForPair({ record, runPath, candidate, metaA, metaB, extraFlags }) {
  const [a, b] = candidate.pair;
  const rank = record.candidates.indexOf(candidate) + 1;
  const evidence = routeSummary(candidate);
  const riskFlags = ['route-derived-candidate', 'rival-explanation-untested', ...extraFlags];
  if (candidate.existingAdjacency.length) riskFlags.push('existing-adjacency');
  return {
    kind: 'relationship-candidate',
    title: `Candidate connection: ${metaA.shortTitle || a} and ${metaB.shortTitle || b}`,
    question: `Do releases ${a} and ${b} share a lemma, antecedent, unresolved assumption, reusable verifier or dependency that the Atlas does not record?`,
    summary: `Discovery routes with signal: ${evidence}. Rule-generated rival explanation (${candidate.rivalExplanation.ruleId}): ${candidate.rivalExplanation.text}`,
    whyNow: `Nominated at rank ${rank} of ${record.candidateCount} in run record ${runPath} (routes run: ${record.routesRun.join(', ')}; corpus ${record.corpusFingerprint}). The pair has no direct Atlas edge.`,
    submitter: {
      actorType: 'agent',
      displayName: 'Evidence Atlas discovery generator',
      humanContributors: [],
      agentContributors: [{
        system: 'Evidence Atlas discovery generator',
        model: `atlas-discovery ${GENERATOR_VERSION}`,
        role: 'Deterministic multi-route retrieval over the frozen Evidence Press corpus',
        runRecordUrl: runPath,
        provenanceNote: `Rule-generated from run record ${runPath} at corpus ${record.corpusFingerprint}; no model judgment was applied to this draft.`
      }],
      contactUrl: null
    },
    atlasAnchors: [
      { nodeId: `release:${a}`, basis: `First member of the candidate pair; ${evidence}` },
      { nodeId: `release:${b}`, basis: `Second member of the candidate pair; ${evidence}` }
    ],
    sourceRefs: [`${BASE_URL}/releases/${a}/`, `${BASE_URL}/releases/${b}/`, runPath],
    priorArtStatus: 'not-started',
    assessments: { novelty: 'unassessed', importance: 'unassessed', tractability: 'unassessed' },
    cheapFalsifier: 'Read both technical accounts and check whether the shared terms, references or intermediaries name the same mathematical object or the same dependency; if they do not, reject the candidate.',
    expectedInformationGain: 'If a maintainer confirms a specific shared object or dependency, one relationship can be asserted additively in the registry; if rejected, the rule-generated rival explanation is retained as negative knowledge.',
    resourceEstimate: { class: 'small', basis: 'Two release pages and their evidence packages are public and replayable.' },
    riskFlags: [...new Set(riskFlags)]
  };
}

function proposalTemplateForGroup({ record, runPath, members, metas, nominated, extraFlags }) {
  const pairSummaries = nominated.map(p => `${p.key} (rank ${p.rank}): ${routeSummary(p.candidate)}`);
  const keywordCounts = new Map();
  for (const m of metas.values()) {
    for (const k of new Set((m.keywords || []).map(k => String(k).toLowerCase()))) {
      if (!GENRE_KEYWORDS.has(k)) keywordCounts.set(k, (keywordCounts.get(k) || 0) + 1);
    }
  }
  const common = [...keywordCounts].filter(([, n]) => n === members.length).map(([k]) => k).sort();
  return {
    kind: 'relationship-candidate',
    title: `Candidate shared objects among ${members.length} releases${common.length ? ` declaring ${common.slice(0, 3).join(', ')}` : ''}`,
    question: `Which of the member pairs among ${members.join(', ')} share a specific formal object, antecedent or dependency that the Atlas does not record?`,
    summary: `${nominated.length} of ${members.length * (members.length - 1) / 2} member pairs are discovery candidates with no direct Atlas edge. ${pairSummaries.join(' | ')}`,
    whyNow: `Nominated from run record ${runPath} (routes run: ${record.routesRun.join(', ')}; corpus ${record.corpusFingerprint}). The member list was supplied at draft time. Co-occurrence of these pairs in the candidate ordering is a retrieval observation, not evidence of a programme, lineage or dependency.`,
    submitter: {
      actorType: 'agent',
      displayName: 'Evidence Atlas discovery generator',
      humanContributors: [],
      agentContributors: [{
        system: 'Evidence Atlas discovery generator',
        model: `atlas-discovery ${GENERATOR_VERSION}`,
        role: 'Deterministic multi-route retrieval over the frozen Evidence Press corpus, grouped by a member list supplied at draft time',
        runRecordUrl: runPath,
        provenanceNote: `Rule-generated from run record ${runPath} at corpus ${record.corpusFingerprint}; the member list was supplied at draft time and no model judgment was applied to this draft.`
      }],
      contactUrl: null
    },
    atlasAnchors: members.map(slug => ({ nodeId: `release:${slug}`, basis: `Group member; ${metas.get(slug).shortTitle || slug}` })),
    sourceRefs: [...members.map(slug => `${BASE_URL}/releases/${slug}/`), runPath],
    priorArtStatus: 'not-started',
    assessments: { novelty: 'unassessed', importance: 'unassessed', tractability: 'unassessed' },
    cheapFalsifier: 'For each nominated pair, read both technical accounts and check whether the shared terms, references or intermediaries name the same formal object or a dependency; reject every pair that fails, and reject the whole record if none survives.',
    expectedInformationGain: 'Each pair a maintainer confirms can be asserted additively as one relationship; nothing about the group as a whole follows from confirming some pairs. Rejected pairs retain their rule-generated rival explanations as negative knowledge.',
    resourceEstimate: { class: 'small', basis: 'All member release pages and evidence packages are public and replayable.' },
    riskFlags: [...new Set(['route-derived-candidate', 'rival-explanation-untested', 'group-membership-supplied-at-draft', ...extraFlags])]
  };
}

function wrapDraft({ root, runPath, runSha256, record, template }) {
  return {
    schemaVersion: '1.0',
    recordType: DRAFT_RECORD_TYPE,
    generatorVersion: GENERATOR_VERSION,
    generatorSourceSha256: generatorSourceSha256(root),
    draftedAt: isoNow(),
    runRecord: { path: runPath, sha256: runSha256, corpusFingerprint: record.corpusFingerprint },
    claimCeiling: 'A draft is generator output awaiting intake. It has no proposal identity, no submission time and no review state until a person takes it into the register through the normal publication gate.',
    proposalTemplate: template
  };
}

function draftProposal({ root, runPathArg, pairKey, allowNegative = false }) {
  const { record, runPath, runSha256, corpus } = loadRunRecordForDraft(root, runPathArg);
  const candidate = record.candidates.find(c => c.pairKey === pairKey);
  if (!candidate) throw new Error(`pair ${pairKey} is not a candidate in ${runPath}`);
  const graph = loadGraph(root, corpus.papers);
  const benchmark = loadBenchmarkIfPresent(root);
  const extraFlags = checkPairsDraftable({ corpus, graph, pairKeys: [pairKey], benchmark, allowNegative });
  const metaBySlug = new Map(corpus.papers.map(p => [p.slug, p]));
  const template = proposalTemplateForPair({ record, runPath, candidate, metaA: metaBySlug.get(candidate.pair[0]), metaB: metaBySlug.get(candidate.pair[1]), extraFlags: [...extraFlags] });
  return wrapDraft({ root, runPath, runSha256, record, template });
}

function draftGroupProposal({ root, runPathArg, slugs, allowNegative = false }) {
  const members = [...new Set(slugs)].sort();
  if (members.length < 3) throw new Error('a group draft needs at least three distinct releases');
  const { record, runPath, runSha256, corpus } = loadRunRecordForDraft(root, runPathArg);
  const slugSet = new Set(corpus.slugs);
  for (const slug of members) if (!slugSet.has(slug)) throw new Error(`group member ${slug} is not a live release`);
  const byKey = new Map(record.candidates.map(c => [c.pairKey, c]));
  const direct = directPairs(loadGraph(root, corpus.papers));
  const nominated = [];
  const unrecordedKeys = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const key = text.pairKey(members[i], members[j]);
      if (direct.has(key)) continue; // recorded pairs are neither nominated nor checked
      unrecordedKeys.push(key);
      const candidate = byKey.get(key);
      if (candidate) nominated.push({ key, candidate, rank: record.candidates.indexOf(candidate) + 1 });
    }
  }
  if (!nominated.length) throw new Error('none of the group pairs is a candidate in the run record');
  const benchmark = loadBenchmarkIfPresent(root);
  const negatives = negativeKeySet(benchmark);
  const flagged = unrecordedKeys.filter(key => negatives.has(key));
  if (flagged.length && !allowNegative) throw new Error(`group contains benchmark negative-control pair(s) ${flagged.join(', ')}; pass --allow-negative to draft deliberately`);
  const metas = new Map(members.map(slug => [slug, corpus.papers.find(p => p.slug === slug)]));
  const template = proposalTemplateForGroup({ record, runPath, members, metas, nominated, extraFlags: flagged.length ? ['benchmark-negative-control'] : [] });
  return wrapDraft({ root, runPath, runSha256, record, template });
}

// Intake turns a draft into a full proposal record at a stated submission time,
// validates it with the live proposal validator and the schema's field list,
// and returns it. The CLI writes it under the quarantine, never into
// data/atlas-proposals/.
function intakeDraft({ root, draftPathArg, submittedAt }) {
  const real = confinePath(root, draftPathArg, { mustBeUnder: DRAFTS_DIR });
  const draft = JSON.parse(fs.readFileSync(real, 'utf8'));
  if (draft.recordType !== DRAFT_RECORD_TYPE) throw new Error(`${draftPathArg} is not a discovery draft`);
  if (!validIso(submittedAt)) throw new Error(`submittedAt ${submittedAt} is not an ISO UTC date-time of the form YYYY-MM-DDTHH:MM:SSZ`);
  if (draft.generatorSourceSha256 !== generatorSourceSha256(root)) throw new Error('draft was produced by a different generator source; redraft before intake');
  const corpus = text.loadCorpus(root);
  if (draft.runRecord.corpusFingerprint !== corpus.fingerprint) throw new Error('draft corpus fingerprint does not match the live corpus; redraft before intake');
  const runReal = path.join(root, draft.runRecord.path);
  if (!fs.existsSync(runReal) || text.sha256(fs.readFileSync(runReal, 'utf8')) !== draft.runRecord.sha256) throw new Error('the run record the draft cites is missing or changed; redraft before intake');
  const expiresAt = new Date(Date.parse(submittedAt) + 183 * 86400000).toISOString().replace(/\.\d+Z$/, 'Z');
  const proposal = {
    schemaVersion: '1.0',
    recordType: 'evidence-atlas-research-proposal',
    proposalId: null,
    ...draft.proposalTemplate,
    submittedAt,
    expiresAt,
    currentState: 'awaiting-review',
    decisionReceipts: []
  };
  proposal.proposalId = expectedProposalId(proposal);
  const schema = JSON.parse(fs.readFileSync(path.join(root, 'schemas', 'atlas-proposal.schema.json'), 'utf8'));
  const allowed = new Set(Object.keys(schema.properties || {}));
  const errors = [];
  for (const key of Object.keys(proposal)) if (!allowed.has(key)) errors.push(`field ${key} is not in the proposal schema`);
  for (const key of schema.required || []) if (!(key in proposal)) errors.push(`required field ${key} is missing`);
  const policy = JSON.parse(fs.readFileSync(path.join(root, 'data', 'ATLAS_PROPOSAL_POLICY.json'), 'utf8'));
  const graph = loadGraph(root, corpus.papers);
  errors.push(...validateProposal(proposal, { policy, graph, root }));
  if (errors.length) throw new Error(`intake refused: ${errors.join('; ')}`);
  return proposal;
}

// --------------------------------------------------------------------- CLI ---

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
  const dir = confinePath(root, outDir, { allowOutsideRepo: true });
  fs.mkdirSync(dir, { recursive: true });
  const stamp = record.generatedAt.slice(0, 10);
  const suffix = record.mode === 'evaluate' ? '-evaluation' : '';
  const file = path.join(dir, `${stamp}-${record.corpusFingerprint.slice(0, 12)}${suffix}.json`);
  fs.writeFileSync(file, JSON.stringify(record, null, 2) + '\n');
  return file;
}

function writeConfined(root, dirRel, fileName, value) {
  const dir = confinePath(root, dirRel, { allowOutsideRepo: true });
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, fileName);
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
  return file;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.join(__dirname, '..');
  const command = args._[0];
  const topK = Number(args['top-k'] || 100);
  const outDir = args.out || RUNS_DIR;
  if (command === 'run') {
    const semanticVectors = args.semantic ? await semanticVectorsForCorpus(root) : null;
    const record = runDiscovery(root, { topK, semanticVectors });
    const file = writeRun(root, record, outDir);
    console.log(`wrote ${path.relative(root, file)}: ${record.candidateCount} candidates from routes ${record.routesRun.join(', ')}`);
    return;
  }
  if (command === 'evaluate') {
    const { loadBenchmark } = require('./atlas-benchmark');
    const { benchmark, sha256 } = loadBenchmark(root);
    const semanticVectors = args.semantic ? await semanticVectorsForCorpus(root) : null;
    const benchmarkInfo = { path: BENCHMARK_PATH, sha256, hiddenCount: benchmark.hidden.length, negativeCount: benchmark.negatives.length };
    const record = evaluateDiscovery(root, { topK, semanticVectors, benchmark, benchmarkInfo });
    const file = writeRun(root, record, outDir);
    const u = record.evaluation.union;
    const h = record.evaluation.hiddenCount;
    const leak = record.evaluation.leakageAudit;
    console.log(`wrote ${path.relative(root, file)}: union recovery@25 ${u.recoveryAt[25].hits}/${h}, @100 ${u.recoveryAt[100].hits}/${h}; hidden pairs with explicit counterpart mention ${leak.hiddenWithExplicitMention}/${leak.hiddenCount}`);
    return;
  }
  if (command === 'draft') {
    if (!args.run) throw new Error('draft needs --run <run record under data/atlas-discovery/runs> and --pair a,b or --group a,b,c');
    const allowNegative = Boolean(args['allow-negative']);
    let draft;
    let fileName;
    if (args.group) {
      const slugs = String(args.group).split(',').map(s => s.trim()).filter(Boolean);
      draft = draftGroupProposal({ root, runPathArg: args.run, slugs, allowNegative });
      fileName = `group--${[...new Set(slugs)].sort().join('--')}.json`;
    } else if (args.pair) {
      const [a, b] = String(args.pair).split(',').map(s => s.trim());
      draft = draftProposal({ root, runPathArg: args.run, pairKey: text.pairKey(a, b), allowNegative });
      fileName = `${[a, b].sort().join('--')}.json`;
    } else throw new Error('draft needs --pair a,b or --group a,b,c');
    const file = writeConfined(root, args.out || DRAFTS_DIR, fileName, draft);
    console.log(`wrote ${path.relative(root, file)} (draft; no proposal identity until intake)`);
    return;
  }
  if (command === 'intake') {
    if (!args.draft || !args['submitted-at']) throw new Error('intake needs --draft <draft under data/atlas-discovery/drafts> and --submitted-at YYYY-MM-DDTHH:MM:SSZ');
    const proposal = intakeDraft({ root, draftPathArg: args.draft, submittedAt: String(args['submitted-at']) });
    const file = writeConfined(root, args.out || INTAKE_DIR, path.basename(String(args.draft)), proposal);
    console.log(`wrote ${path.relative(root, file)} (${proposal.proposalId}); it enters data/atlas-proposals/ only through the normal publication gate`);
    return;
  }
  throw new Error(`unknown command ${command}; use run | evaluate | draft | intake`);
}

module.exports = {
  GENERATOR_VERSION, GENERATOR_SOURCE_FILES, ROUTES, RIVAL_RULES, RIVAL_RULE_SAMPLES, INFERENCE_LIMIT, CLAIM_CEILING, EMBEDDING_MODEL,
  EMBEDDING_CLIP_CHARS, BASE_URL, CUTOFFS, QUARANTINE_DIR, RUNS_DIR, DRAFTS_DIR, INTAKE_DIR, BENCHMARK_PATH, DRAFT_RECORD_TYPE, RUN_RECORD_TYPE,
  GENRE_KEYWORDS, generatorSourceSha256, confinePath, identityIndex, loadGraph, directPairs, adjacency, normalizeExternalReference,
  routeCitationOverlap, routeCitationPath, routeSharedObject, routeLexical, signals, rivalExplanation, assembleCandidates,
  buildRunRecord, runDiscovery, embedTexts, validCachedVector, vectorProvenance, semanticScoresFromVectors, semanticVectorsForCorpus,
  rankingStats, leakageAudit, evaluateRun, evaluateDiscovery, routeSummary, loadRunRecordForDraft, draftProposal, draftGroupProposal,
  intakeDraft, parseArgs, writeRun, writeConfined
};

if (require.main === module) main().catch(error => { console.error(error.message); process.exit(1); });
