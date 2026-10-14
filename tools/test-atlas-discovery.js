#!/usr/bin/env node
'use strict';

// Deterministic gates for the Evidence Atlas discovery pilot.
// Design record: docs/ATLAS_DISCOVERY_PILOT.md.

const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');
let failures = 0;
function ok(condition, label, detail = '') {
  if (condition) console.log(`ok      ${label}`);
  else { failures++; console.log(`FAIL    ${label}${detail ? ` — ${detail}` : ''}`); }
}
function tmpCorpus(slugs, { omitBody = null } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-text-'));
  fs.mkdirSync(path.join(dir, 'papers'));
  for (const slug of slugs) {
    fs.mkdirSync(path.join(dir, 'papers', slug));
    fs.writeFileSync(path.join(dir, 'papers', slug, 'meta.json'),
      JSON.stringify({ slug, title: slug, abstract: `Abstract ${slug}`, keywords: [], relatedWorks: [] }));
    if (slug !== omitBody) {
      fs.writeFileSync(path.join(dir, 'papers', slug, 'body.md'),
        `## Summary\n\nBody text for ${slug} with resultant polynomial words.\n`);
    }
  }
  return dir;
}
// A temporary repository-like root that shares the live papers/ and schemas/
// via symlink and copies the registries, so freeze and draft gates can be
// exercised without touching the real quarantine.
function tmpRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-repo-'));
  for (const rel of ['papers', 'schemas']) fs.symlinkSync(path.join(ROOT, rel), path.join(dir, rel));
  fs.mkdirSync(path.join(dir, 'data', 'atlas-discovery', 'runs'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'tools'));
  for (const f of ['METHOD_REGISTRY.json', 'RELATIONSHIP_REGISTRY.json', 'ATLAS_PROPOSAL_POLICY.json']) fs.copyFileSync(path.join(ROOT, 'data', f), path.join(dir, 'data', f));
  for (const f of ['atlas-text.js', 'atlas-discovery.js', 'atlas-benchmark.js']) fs.copyFileSync(path.join(ROOT, 'tools', f), path.join(dir, 'tools', f));
  return dir;
}
const strip = record => JSON.stringify({ ...record, generatedAt: null });

async function main() {
  const text = require('./atlas-text');
  const disc = require('./atlas-discovery');
  const bench = require('./atlas-benchmark');
  const negatives = require('./atlas-negatives');
  const { validateProposal, expectedProposalId } = require('./atlas-proposals');

  // ------------------------------------------------------------ atlas-text ---
  {
    const dir = tmpCorpus(['alpha', 'beta']);
    const corpus = text.loadCorpus(dir);
    ok(corpus.slugs.join(',') === 'alpha,beta', 'loadCorpus returns sorted slugs');
    ok(/^[a-f0-9]{64}$/.test(corpus.fingerprint), 'corpus fingerprint is sha256 hex');
    ok(text.loadCorpus(dir).fingerprint === corpus.fingerprint, 'fingerprint is stable across loads');
    fs.writeFileSync(path.join(dir, 'papers', 'beta', 'body.md'), 'changed');
    ok(text.loadCorpus(dir).fingerprint !== corpus.fingerprint, 'fingerprint changes when a body changes');
  }
  {
    const dir = tmpCorpus(['alpha', 'beta'], { omitBody: 'beta' });
    let threw = null;
    try { text.loadCorpus(dir); } catch (error) { threw = error.message; }
    ok(threw && threw.includes('beta'), 'loadCorpus throws naming a release with no body.md', threw);
  }
  {
    const toks = text.tokenize('The $x^2$ resultant Resultant, polynomial $$\\int f$$ and A 1999 ab-cd');
    ok(toks.join(' ') === 'resultant resultant polynomial ab-cd', 'tokenize strips maths, numbers, short and stop words and lowercases', toks.join(' '));
  }
  {
    const docs = new Map([['a', 'resultant polynomial jacobian'], ['b', 'resultant polynomial'], ['c', 'glauber dynamics mixing']]);
    const { vectors, df } = text.tfidfVectors(docs);
    ok(df.get('resultant') === 2 && df.get('jacobian') === 1, 'document frequencies are counted');
    ok(!vectors.get('a').has('jacobian'), 'terms with df < 2 are dropped from vectors');
    const sab = text.cosine(vectors.get('a'), vectors.get('b'));
    const sac = text.cosine(vectors.get('a'), vectors.get('c'));
    ok(sab > 0.99 && sac === 0, 'cosine is 1 for identical surviving terms and 0 for disjoint', `${sab} ${sac}`);
    const top = text.topContributingTerms(vectors.get('a'), vectors.get('b'), 5);
    ok(top.length === 2 && ['polynomial', 'resultant'].includes(top[0].term), 'top contributing terms are the shared ones');
    ok(top.every((t, i) => i === 0 || top[i - 1].contribution >= t.contribution), 'contributions are sorted descending');
  }
  ok(text.pairKey('zeta', 'alpha') === 'alpha|zeta', 'pairKey sorts slugs');

  // ---------------------------------------------------------------- routes ---
  {
    const dir = tmpCorpus(['a', 'b', 'c', 'd']);
    const write = (slug, meta) => fs.writeFileSync(path.join(dir, 'papers', slug, 'meta.json'),
      JSON.stringify({ slug, title: slug, abstract: '', keywords: [], relatedWorks: [], doi: `10.5281/zenodo.${slug.charCodeAt(0)}`, ...meta }));
    write('a', { keywords: ['Fair Division', 'SAT'], relatedWorks: [{ citation: 'X', url: 'https://arxiv.org/abs/1v2' }, { citation: 'Y', url: 'https://doi.org/10.1000/Y' }, { citation: 'Q', url: 'http://www.example.org/paper?b=2&a=1#frag' }] });
    write('b', { keywords: ['fair division'], relatedWorks: [{ citation: 'X', url: 'https://www.arxiv.org/abs/1/' }, { citation: 'Q', url: 'https://example.org/paper/?a=1&b=2' }] });
    write('c', { relatedWorks: [{ citation: 'Y', url: 'doi:10.1000/y' }, { citation: 'Z', url: 'https://example.org/z' }] });
    write('d', { relatedWorks: [{ citation: 'internal', url: 'https://doi.org/10.5281/zenodo.97' }] });
    const corpus = text.loadCorpus(dir);
    const index = disc.identityIndex(corpus.papers);
    const overlap = disc.routeCitationOverlap(corpus.papers, index, 'https://evidencepress.org');
    ok(overlap.get('a|b') && overlap.get('a|b').score === 2 && overlap.get('a|b').evidence.sharedReferences.join() === 'https://arxiv.org/abs/1,https://example.org/paper?a=1&b=2',
      'citation-overlap canonicalises scheme, www, trailing slash, fragment, query order and arXiv version', JSON.stringify(overlap.get('a|b')));
    ok(overlap.get('a|c') && overlap.get('a|c').evidence.sharedReferences[0] === 'doi:10.1000/y', 'citation-overlap normalises DOIs across forms');
    ok(!overlap.has('a|d'), 'internal release citations are excluded from citation-overlap');
    ok(disc.normalizeExternalReference('ftp://example.org/x', 'https://evidencepress.org', index) === null, 'non-http references are ignored');
    const shared = disc.routeSharedObject(corpus.papers);
    ok(shared.get('a|b') && shared.get('a|b').evidence.keywords.join() === 'fair division', 'shared-object normalises keyword case');
  }
  {
    const graph = { nodes: [], edges: [
      { source: 'release:a', target: 'release:c', predicate: 'cites-related-release' },
      { source: 'release:c', target: 'release:b', predicate: 'extends-result' },
      { source: 'release:d', target: 'release:a', predicate: 'cites-related-release' }
    ] };
    const paths = disc.routeCitationPath(graph, new Set());
    ok(paths.get('a|b') && paths.get('a|b').evidence.intermediaries.join() === 'c' && paths.get('a|b').evidence.pathType === 'undirected-distance-two',
      'citation-path is undirected distance two and says so in its evidence');
    ok(!paths.has('a|c'), 'citation-path does not emit directly linked pairs');
    ok(!disc.routeCitationPath(graph, new Set(['a|c'])).has('a|b'), 'hidden edges are removed from the citation-path input');
  }
  {
    const dir = tmpCorpus(['g1', 'g2', 'g3']);
    const write = (slug, keywords) => fs.writeFileSync(path.join(dir, 'papers', slug, 'meta.json'), JSON.stringify({ slug, title: slug, abstract: '', keywords, relatedWorks: [] }));
    write('g1', ['Unrefereed Candidate', 'computer-assisted mathematics', 'fair division']);
    write('g2', ['unrefereed candidate', 'fair division']);
    write('g3', ['unrefereed candidate', 'computer-assisted mathematics']);
    const shared = disc.routeSharedObject(text.loadCorpus(dir).papers);
    ok(shared.get('g1|g2') && shared.get('g1|g2').evidence.keywords.join() === 'fair division', 'shared-object keeps substantive keywords');
    ok(!shared.has('g1|g3') && !shared.has('g2|g3'), 'shared-object ignores genre and status keywords');
    ok(disc.GENRE_KEYWORDS.has('unrefereed candidate'), 'genre keyword list is explicit and exported');
  }
  {
    const docs = new Map([['a', 'resultant polynomial jacobian minor'], ['b', 'resultant polynomial jacobian'], ['c', 'resultant polynomial'], ['d', 'glauber mixing resultant']]);
    const all = disc.routeLexical(docs, 2);
    const eligible = disc.routeLexical(docs, 2, new Set(['a|b']));
    ok(all.size === 2 && all.has('a|b'), 'lexical top-K without exclusions includes the strongest pair');
    ok(eligible.size === 2 && !eligible.has('a|b'), 'lexical top-K is taken over eligible pairs only, so an excluded pair never consumes a slot');
  }
  {
    const rule = c => disc.rivalExplanation(c).ruleId;
    const base = { routes: { 'citation-overlap': null, 'citation-path': null, 'shared-object': null, lexical: null, semantic: 'not-run' }, existingAdjacency: [] };
    ok(rule({ ...base, routes: { ...base.routes, lexical: { score: 0.3, evidence: { terms: [{ term: 'bound', contribution: 0.1 }] } } } }) === 'common-vocabulary', 'lexical-only candidate gets the common-vocabulary rival');
    ok(rule({ ...base, routes: { ...base.routes, 'citation-overlap': { score: 1, evidence: { sharedReferences: ['x'] } } } }) === 'shared-background-citation', 'overlap-only candidate gets the background-citation rival');
    ok(rule({ ...base, routes: { ...base.routes, 'citation-path': { score: 1, evidence: { pathType: 'undirected-distance-two', intermediaries: ['c'] } } } }) === 'common-neighbour', 'path-only candidate gets the common-neighbour rival');
    ok(rule({ ...base, routes: { ...base.routes, 'shared-object': { score: 1, evidence: { keywords: ['sat'], mathObjects: [] } } } }) === 'broad-keyword', 'keyword-only candidate gets the broad-keyword rival');
    ok(rule({ ...base, existingAdjacency: [{ nodeId: 'cluster:x', predicate: 'member-of-cluster' }] }) === 'recorded-adjacency', 'adjacency dominates the rival table');
    ok(rule({ ...base, routes: { ...base.routes, lexical: { score: 0.3, evidence: { terms: [] } }, 'citation-overlap': { score: 1, evidence: { sharedReferences: ['x'] } } } }) === 'field-convention', 'multi-route candidate gets the field-convention rival');
    const reached = new Set();
    for (const r of disc.RIVAL_RULES) for (const sample of disc.RIVAL_RULE_SAMPLES) if (disc.rivalExplanation(sample).ruleId === r.id) reached.add(r.id);
    ok(reached.size === disc.RIVAL_RULES.length, 'every rival rule is reachable by a synthetic evidence pattern', [...reached].join(','));
  }

  // ---------------------------------------------------- live corpus run ---
  {
    const first = disc.runDiscovery(ROOT, { topK: 30 });
    const second = disc.runDiscovery(ROOT, { topK: 30 });
    ok(strip(first) === strip(second), 'two runs on the same corpus are identical apart from generatedAt');
    ok(first.corpusFingerprint === text.loadCorpus(ROOT).fingerprint, 'run record carries the live corpus fingerprint');
    ok(first.generatorVersion === disc.GENERATOR_VERSION && first.generatorSourceSha256 === disc.generatorSourceSha256(ROOT), 'run record carries the generator version and source hash');
    ok(first.routesNotRun.some(r => r.route === 'semantic'), 'disabled routes are recorded with their reason, not dropped');
    const liveExtraction = disc.loadObjectsForCorpus(ROOT, first.corpusFingerprint);
    ok(liveExtraction ? (first.routesRun.includes('symbolic-object') && first.objectExtraction && first.objectExtraction.sha256 === liveExtraction.sha256)
      : first.routesNotRun.some(r => r.route === 'symbolic-object' && /extract/.test(r.reason)),
    'symbolic-object runs with recorded provenance when an extraction exists for the live corpus, otherwise its absence is recorded with the reason');
    const required = ['pair', 'pairKey', 'routes', 'routeSignalCount', 'existingAdjacency', 'rivalExplanation', 'inferenceLimit', 'benchmarkRole'];
    ok(first.candidates.every(c => required.every(k => k in c) && disc.ROUTES.every(r => r in c.routes)), 'every candidate carries every route and required field');
    const direct = disc.directPairs(disc.loadGraph(ROOT, text.loadCorpus(ROOT).papers));
    ok(first.candidates.every(c => !direct.has(c.pairKey)), 'directly linked pairs are excluded in run mode');
    ok(first.candidates.length > 0 && first.candidates[0].routeSignalCount >= first.candidates[first.candidates.length - 1].routeSignalCount, 'candidates are ordered by route signal count first');
    const lexicalRanked = first.candidates.filter(c => c.routes.lexical && c.routes.lexical !== 'not-run').length;
    ok(lexicalRanked === 30, 'lexical route fills its full top-K with eligible pairs', String(lexicalRanked));
  }

  // -------------------------------------------------------- path confinement ---
  {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'runs-'));
    const record = disc.buildRunRecord({ root: ROOT, mode: 'run', corpus: { fingerprint: 'a'.repeat(64), slugs: [] }, routes: {}, candidates: [], topK: 1, routesRequested: [], benchmarkInfo: null, evaluation: null, semanticProvenance: null });
    const file = disc.writeRun(ROOT, record, outside);
    ok(file.startsWith(fs.realpathSync(outside)) && fs.existsSync(file), 'writeRun honours an output directory outside the repository');
    for (const bad of ['data/atlas-proposals', 'dist/api', 'papers/x', 'data', path.join(ROOT, 'tools')]) {
      let threw = null;
      try { disc.writeRun(ROOT, record, bad); } catch (e) { threw = e.message; }
      ok(threw && /refusing/.test(threw), `writeRun refuses a repository path outside the quarantine (${bad})`, threw);
    }
    const link = path.join(outside, 'link-into-repo');
    fs.symlinkSync(path.join(ROOT, 'data', 'atlas-proposals'), link);
    let threw = null;
    try { disc.writeRun(ROOT, record, link); } catch (e) { threw = e.message; }
    ok(threw && /refusing/.test(threw), 'writeRun refuses a symlink that resolves back into the repository', threw);
    ok(disc.confinePath(ROOT, 'data/atlas-discovery/runs/new.json').endsWith(path.join('data', 'atlas-discovery', 'runs', 'new.json')), 'confinePath accepts a not-yet-existing file under the quarantine');
  }

  // --------------------------------------------------------------- semantic ---
  {
    let threw = null;
    try { await disc.semanticVectorsForCorpus(ROOT, { apiKey: '', cacheDir: fs.mkdtempSync(path.join(os.tmpdir(), 'emb-')) }); } catch (error) { threw = error.message; }
    ok(threw && /semantic/.test(threw) && /OPENAI_API_KEY/.test(threw), 'semantic route fails loudly without a credential', threw);
  }
  {
    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'emb-'));
    const calls = [];
    const fakeFetch = async (url, init) => {
      const body = JSON.parse(init.body);
      calls.push(body.input.length);
      return { ok: true, status: 200, json: async () => ({ data: body.input.map((t, i) => ({ index: i, embedding: t.includes('alpha') ? [1, 0] : [0, 1] })) }) };
    };
    const texts = new Map([['alpha', 'alpha text'], ['beta', 'beta text'], ['gamma', 'alpha again']]);
    const first = await disc.embedTexts(texts, { apiKey: 'test', cacheDir, fetchImpl: fakeFetch });
    const second = await disc.embedTexts(texts, { apiKey: 'test', cacheDir, fetchImpl: fakeFetch });
    ok(first.get('alpha')[0] === 1 && second.get('gamma')[0] === 1, 'embedTexts returns vectors per slug');
    ok(calls.length === 1, 'cached vectors are not re-requested', String(calls));
    const scores = disc.semanticScoresFromVectors(first, 10);
    ok(scores.get('alpha|gamma').score === 1 && scores.get('alpha|beta').score === 0, 'semantic scores are cosines over vectors');
    ok(!disc.semanticScoresFromVectors(first, 1, disc.EMBEDDING_MODEL, new Set(['alpha|gamma'])).has('alpha|gamma'), 'semantic top-K is taken over eligible pairs only');
    const prov = disc.vectorProvenance(first);
    ok(/^[a-f0-9]{64}$/.test(prov.vectorsSha256) && prov.vectorCount === 3 && prov.dimension === 2, 'vector provenance hashes the vectors');
    // corrupt a cache entry: it must be ignored and refetched
    const cacheFile = fs.readdirSync(path.join(cacheDir, disc.EMBEDDING_MODEL))[0];
    fs.writeFileSync(path.join(cacheDir, disc.EMBEDDING_MODEL, cacheFile), JSON.stringify({ model: disc.EMBEDDING_MODEL, vector: [NaN] }));
    await disc.embedTexts(texts, { apiKey: 'test', cacheDir, fetchImpl: fakeFetch });
    ok(calls.length === 2, 'an invalid cache entry is ignored and refetched', String(calls));
    ok(!disc.validCachedVector({ model: disc.EMBEDDING_MODEL, textSha256: 'x', clipChars: 1, vector: [1] }, disc.EMBEDDING_MODEL, 'x'), 'cache entries from a different clipping policy are rejected');
    const failing = async () => ({ ok: false, status: 429, json: async () => ({}) });
    let threw = null;
    try { await disc.embedTexts(new Map([['delta', 'delta text']]), { apiKey: 'test', cacheDir, fetchImpl: failing }); } catch (error) { threw = error.message; }
    ok(threw && /429/.test(threw), 'embedding HTTP failures are raised, not swallowed', threw);
  }

  // -------------------------------------------------------------- benchmark ---
  {
    const positives = [['a', 'b'], ['c', 'd'], ['e', 'f'], ['g', 'h'], ['i', 'j']];
    const h1 = bench.selectHidden(positives, 'f'.repeat(64));
    const h2 = bench.selectHidden(positives, 'f'.repeat(64));
    ok(h1.length === 2 && JSON.stringify(h1) === JSON.stringify(h2), 'hidden selection is deterministic and takes floor(n/2)');
    ok(h1.every(p => positives.some(q => q[0] === p[0] && q[1] === p[1])), 'hidden pairs are drawn from the positives');
  }
  {
    const benchSource = fs.readFileSync(path.join(ROOT, 'tools', 'atlas-benchmark.js'), 'utf8');
    ok(!/require\(['"]\.\/atlas-discovery['"]\)/.test(benchSource) && !/require\(['"]\.\/atlas-negatives['"]\)/.test(benchSource), 'the benchmark module does not import the generator');
    const corpus = text.loadCorpus(ROOT);
    const independent = bench.recordedDirectPairs(ROOT, corpus).map(p => text.pairKey(...p)).sort();
    const generator = [...disc.directPairs(disc.loadGraph(ROOT, corpus.papers)).keys()].sort();
    ok(JSON.stringify(independent) === JSON.stringify(generator), 'independent positive extraction agrees with the generator\'s direct pairs');
  }
  {
    const proposals = negatives.proposeNegatives(ROOT, { count: 5 });
    ok(proposals.length === 5 && proposals.every(p => p.pair.length === 2 && p.lexicalScore > 0 && p.reasons.length >= 3), 'proposeNegatives returns lexically similar pairs with no declared signal');
  }
  {
    const dir = tmpRepo();
    const direct = bench.recordedDirectPairs(ROOT, text.loadCorpus(ROOT));
    const [x, y] = direct[0];
    const controlsPath = path.join(dir, 'data', 'atlas-discovery', 'NEGATIVE_CONTROLS.json');
    const controls = { confirmedBy: 'test', confirmedAt: '2026-10-14T00:00:00Z', pairs: [{ pair: [x, y], reason: 'deliberately a positive' }] };
    fs.writeFileSync(controlsPath, JSON.stringify(controls));
    let threw = null;
    try { bench.freezeBenchmark(dir, { frozenAt: '2026-10-14T01:00:00Z' }); } catch (e) { threw = e.message; }
    ok(threw && /positive/.test(threw), 'freeze rejects a negative control that is a recorded positive', threw);
    const prop = negatives.proposeNegatives(ROOT, { count: 2 });
    controls.pairs = prop.map(p => ({ pair: p.pair, reason: 'test' }));
    controls.confirmedAt = '2026-10-14T02:00:00Z';
    fs.writeFileSync(controlsPath, JSON.stringify(controls));
    threw = null;
    try { bench.freezeBenchmark(dir, { frozenAt: '2026-10-14T01:00:00Z' }); } catch (e) { threw = e.message; }
    ok(threw && /confirmation must precede/.test(threw), 'freeze rejects a confirmation recorded after the freeze time', threw);
    const frozen = bench.freezeBenchmark(dir, { frozenAt: '2026-10-14T03:00:00Z' });
    ok(frozen.positives.length === direct.length && frozen.hidden.length === Math.floor(direct.length / 2), 'freeze records every direct pair and hides half');
    ok(frozen.corpusFingerprint === text.loadCorpus(ROOT).fingerprint && /^[a-f0-9]{64}$/.test(frozen.generatorSourceSha256AtFreeze), 'benchmark carries the corpus fingerprint and generator source hash');
    const loaded = bench.loadBenchmark(dir);
    ok(/^[a-f0-9]{64}$/.test(loaded.sha256) && loaded.benchmark.negatives.length === 2, 'loadBenchmark returns the file hash and content');
  }

  // --------------------------------------------------------------- evaluate ---
  {
    const record = { candidates: [
      { pairKey: 'a|b', benchmarkRole: 'hidden-positive', routes: { lexical: { score: 0.9 }, 'citation-overlap': null, 'citation-path': null, 'shared-object': null, semantic: 'not-run' } },
      { pairKey: 'c|d', benchmarkRole: 'negative-control', routes: { lexical: { score: 0.8 }, 'citation-overlap': { score: 1 }, 'citation-path': null, 'shared-object': null, semantic: 'not-run' } },
      { pairKey: 'e|f', benchmarkRole: null, routes: { lexical: { score: 0.7 }, 'citation-overlap': null, 'citation-path': null, 'shared-object': null, semantic: 'not-run' } }
    ] };
    const benchmark = { hidden: [['a', 'b'], ['x', 'y']], negatives: [{ pair: ['c', 'd'] }] };
    const ev = disc.evaluateRun(record, benchmark);
    ok(ev.union.recoveryAt[25].hits === 1 && ev.union.recoveryAt[25].fraction === 0.5, 'union recovery counts hidden positives in the top 25');
    ok(ev.union.hiddenRanks['a|b'] === 1 && ev.union.hiddenRanks['x|y'] === 'absent', 'hidden ranks list rank or absent');
    ok(ev.union.negativesAt[25] === 1, 'negative controls inside the cutoff are counted');
    ok(ev.perRoute['citation-overlap'].ranked === 1 && ev.perRoute['citation-overlap'].hiddenRanks['a|b'] === 'absent', 'per-route ranking only counts pairs with signal on that route');
    ok(ev.reviewerEffort === null && typeof ev.controlsCaveat === 'string' && ev.controlsCaveat.length > 50, 'reviewer effort is left for a person and the controls caveat is recorded');
  }
  {
    const dir = tmpCorpus(['pulsar-theorem', 'quasar-extension', 'random-other']);
    fs.writeFileSync(path.join(dir, 'papers', 'pulsar-theorem', 'meta.json'), JSON.stringify({ slug: 'pulsar-theorem', title: 'The Pulsar Theorem Of Everything', abstract: '', keywords: [], relatedWorks: [] }));
    fs.writeFileSync(path.join(dir, 'papers', 'quasar-extension', 'body.md'), 'This extends The Pulsar Theorem of Everything (release pulsar-theorem).');
    fs.writeFileSync(path.join(dir, 'papers', 'random-other', 'body.md'), 'Mentions pulsar-theorems-plural and pulsar theorem without the slug form.');
    const corpus = text.loadCorpus(dir);
    const audit = disc.leakageAudit(corpus, [['pulsar-theorem', 'quasar-extension'], ['pulsar-theorem', 'random-other']]);
    ok(audit.hiddenWithExplicitMention === 1 && audit.pairs[0].explicitMention && audit.pairs[0].mentionKinds['quasar-extension->pulsar-theorem'].includes('title') && audit.pairs[0].mentionKinds['quasar-extension->pulsar-theorem'].includes('slug'), 'leakage audit detects an explicit counterpart mention by title and slug');
    ok(!audit.pairs[1].explicitMention, 'leakage audit passes a pair with no explicit mention');
  }
  {
    const stale = { corpusFingerprint: '0'.repeat(64), hidden: [], negatives: [], positives: [] };
    let threw = null;
    try { disc.evaluateDiscovery(ROOT, { topK: 10, benchmark: stale }); } catch (e) { threw = e.message; }
    ok(threw && /fingerprint/.test(threw), 'evaluate refuses a benchmark frozen on a different corpus', threw);
    if (fs.existsSync(path.join(ROOT, 'data', 'atlas-discovery', 'BENCHMARK.json'))) {
      const { benchmark } = bench.loadBenchmark(ROOT);
      const record = disc.evaluateDiscovery(ROOT, { topK: 100, benchmark });
      const hiddenKeys = benchmark.hidden.map(p => text.pairKey(...p));
      ok(record.mode === 'evaluate' && record.evaluation && record.benchmark && record.benchmark.hiddenCount === hiddenKeys.length, 'evaluate records benchmark provenance');
      ok(record.evaluation.leakageAudit && record.evaluation.leakageAudit.hiddenCount === hiddenKeys.length && record.evaluation.unionWithoutExplicitMention, 'evaluate records the leakage audit and the recovery restricted to non-leaking pairs');
      const pathInput = disc.routeCitationPath(disc.loadGraph(ROOT, text.loadCorpus(ROOT).papers), new Set(hiddenKeys));
      ok(hiddenKeys.every(k => !pathInput.has(k) || pathInput.get(k).evidence.intermediaries.every(mid => !k.split('|').includes(mid))), 'a hidden positive reached by the citation-path route is reached only through a third release');
      const fullInput = disc.routeCitationPath(disc.loadGraph(ROOT, text.loadCorpus(ROOT).papers), new Set());
      ok(hiddenKeys.every(k => !fullInput.has(k)), 'with no exclusions, recorded direct pairs are never emitted by the citation-path route');
      ok(record.candidates.filter(c => c.benchmarkRole === 'hidden-positive').length === Object.values(record.evaluation.union.hiddenRanks).filter(r => r !== 'absent').length, 'hidden positives present in candidates match ranked hidden positives');
    } else {
      console.log('skip    live benchmark checks (BENCHMARK.json not yet frozen)');
    }
  }

  // ------------------------------------------------------- drafts and intake ---
  {
    const dir = tmpRepo();
    const record = disc.runDiscovery(dir, { topK: 40 });
    const runRel = 'data/atlas-discovery/runs/test-run.json';
    fs.writeFileSync(path.join(dir, runRel), JSON.stringify(record, null, 2) + '\n');
    const candidate = record.candidates.find(c => c.existingAdjacency.length === 0) || record.candidates[0];
    const draft = disc.draftProposal({ root: dir, runPathArg: runRel, pairKey: candidate.pairKey });
    ok(draft.recordType === disc.DRAFT_RECORD_TYPE && !('proposalId' in draft) && !('submittedAt' in draft.proposalTemplate) && !('currentState' in draft.proposalTemplate),
      'a draft has no proposal identity, submission time or review state');
    ok(draft.runRecord.sha256 === text.sha256(fs.readFileSync(path.join(dir, runRel), 'utf8')), 'a draft binds the run record it came from');
    ok(draft.proposalTemplate.submitter.actorType === 'agent' && draft.proposalTemplate.submitter.humanContributors.length === 0, 'draft names no human');
    const draftRel = 'data/atlas-discovery/drafts/test-draft.json';
    fs.mkdirSync(path.join(dir, 'data', 'atlas-discovery', 'drafts'), { recursive: true });
    fs.writeFileSync(path.join(dir, draftRel), JSON.stringify(draft, null, 2) + '\n');
    const policy = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'ATLAS_PROPOSAL_POLICY.json'), 'utf8'));
    const graph = disc.loadGraph(dir, text.loadCorpus(dir).papers);
    const proposal = disc.intakeDraft({ root: dir, draftPathArg: draftRel, submittedAt: '2026-10-14T12:00:00Z' });
    ok(validateProposal(proposal, { policy, graph, root: dir }).length === 0 && proposal.proposalId === expectedProposalId(proposal), 'intake produces a proposal that passes the live validator with a content-derived identity');
    ok(proposal.currentState === 'awaiting-review' && proposal.decisionReceipts.length === 0 && proposal.submittedAt === '2026-10-14T12:00:00Z', 'intake starts the proposal clock at the stated submission time');
    let threw = null;
    try { disc.intakeDraft({ root: dir, draftPathArg: draftRel, submittedAt: 'nonsense' }); } catch (e) { threw = e.message; }
    ok(threw && /submittedAt/.test(threw), 'intake refuses an invalid submission time', threw);
    // tampered run record: draft intake must refuse
    fs.appendFileSync(path.join(dir, runRel), '\n');
    threw = null;
    try { disc.intakeDraft({ root: dir, draftPathArg: draftRel, submittedAt: '2026-10-14T12:00:00Z' }); } catch (e) { threw = e.message; }
    ok(threw && /changed/.test(threw), 'intake refuses a draft whose run record changed', threw);
    fs.writeFileSync(path.join(dir, runRel), JSON.stringify(record, null, 2) + '\n');
    // run record outside the runs directory, wrong version, stale fingerprint
    const elsewhere = path.join(os.tmpdir(), `fabricated-${Date.now()}.json`);
    fs.writeFileSync(elsewhere, JSON.stringify(record));
    threw = null;
    try { disc.draftProposal({ root: dir, runPathArg: elsewhere, pairKey: candidate.pairKey }); } catch (e) { threw = e.message; }
    ok(threw && /refusing/.test(threw), 'draft refuses a run record outside the runs directory', threw);
    const wrongVersion = { ...record, generatorVersion: '0.0.0' };
    fs.writeFileSync(path.join(dir, 'data', 'atlas-discovery', 'runs', 'wrong.json'), JSON.stringify(wrongVersion));
    threw = null;
    try { disc.draftProposal({ root: dir, runPathArg: 'data/atlas-discovery/runs/wrong.json', pairKey: candidate.pairKey }); } catch (e) { threw = e.message; }
    ok(threw && /generatorVersion/.test(threw), 'draft refuses a run record from another generator version', threw);
    const staleRun = { ...record, corpusFingerprint: '1'.repeat(64) };
    fs.writeFileSync(path.join(dir, 'data', 'atlas-discovery', 'runs', 'stale.json'), JSON.stringify(staleRun));
    threw = null;
    try { disc.draftProposal({ root: dir, runPathArg: 'data/atlas-discovery/runs/stale.json', pairKey: candidate.pairKey }); } catch (e) { threw = e.message; }
    ok(threw && /corpusFingerprint/.test(threw), 'draft refuses a run record from another corpus', threw);
    threw = null;
    try { disc.draftProposal({ root: dir, runPathArg: runRel, pairKey: 'nope|nothing' }); } catch (e) { threw = e.message; }
    ok(threw && /not a candidate/.test(threw), 'draft refuses a pair absent from the run record', threw);
    // negative-control gate for pairs and groups
    const benchmark = { schemaVersion: '1.0', corpusFingerprint: record.corpusFingerprint, hidden: [], positives: [], negatives: [{ pair: candidate.pair, reason: 'test' }] };
    fs.writeFileSync(path.join(dir, 'data', 'atlas-discovery', 'BENCHMARK.json'), JSON.stringify(benchmark));
    threw = null;
    try { disc.draftProposal({ root: dir, runPathArg: runRel, pairKey: candidate.pairKey }); } catch (e) { threw = e.message; }
    ok(threw && /negative control/.test(threw), 'draft refuses a negative-control pair without --allow-negative', threw);
    const allowed = disc.draftProposal({ root: dir, runPathArg: runRel, pairKey: candidate.pairKey, allowNegative: true });
    ok(allowed.proposalTemplate.riskFlags.includes('benchmark-negative-control'), 'an allowed negative draft is flagged');
    const third = record.candidates.find(c => c.pair.includes(candidate.pair[0]) && !c.pair.includes(candidate.pair[1]));
    const groupSlugs = [...candidate.pair, third.pair.find(s => s !== candidate.pair[0])];
    threw = null;
    try { disc.draftGroupProposal({ root: dir, runPathArg: runRel, slugs: groupSlugs }); } catch (e) { threw = e.message; }
    ok(threw && /negative-control/.test(threw), 'group draft applies the negative-control gate to every member pair', threw);
    fs.unlinkSync(path.join(dir, 'data', 'atlas-discovery', 'BENCHMARK.json'));
    const group = disc.draftGroupProposal({ root: dir, runPathArg: runRel, slugs: groupSlugs });
    ok(group.proposalTemplate.kind === 'relationship-candidate' && group.proposalTemplate.atlasAnchors.length === 3, 'group draft anchors every member as a relationship candidate');
    ok(!/lineage|programme|cluster/i.test(group.proposalTemplate.expectedInformationGain) && /retrieval observation/.test(group.proposalTemplate.whyNow), 'group draft makes no programme, lineage or cluster claim');
    fs.writeFileSync(path.join(dir, 'data', 'atlas-discovery', 'drafts', 'group.json'), JSON.stringify(group, null, 2) + '\n');
    const groupProposal = disc.intakeDraft({ root: dir, draftPathArg: 'data/atlas-discovery/drafts/group.json', submittedAt: '2026-10-14T12:00:00Z' });
    ok(validateProposal(groupProposal, { policy, graph, root: dir }).length === 0, 'group draft passes intake validation');
    threw = null;
    try { disc.draftGroupProposal({ root: dir, runPathArg: runRel, slugs: groupSlugs.slice(0, 2) }); } catch (e) { threw = e.message; }
    ok(threw && /at least three/.test(threw), 'group draft needs three members');
  }

  // ------------------------------------------------------- write-path gate ---
  {
    const files = ['atlas-discovery.js', 'atlas-benchmark.js', 'atlas-text.js', 'atlas-negatives.js', 'atlas-claude-batch.js', 'atlas-burden.js', 'atlas-objects.js'];
    const source = files.map(f => fs.readFileSync(path.join(ROOT, 'tools', f), 'utf8')).join('\n');
    const writes = source.match(/writeFileSync\([^;]*/g) || [];
    ok(writes.length > 0 && !/RELATIONSHIP_REGISTRY|METHOD_REGISTRY|atlas-proposals|papers/.test(writes.join('\n')), 'generator sources never write to the registry, method registry, proposals or papers', writes.join(' | '));
    ok(!/require\(['"]\.\/build['"]\)/.test(source), 'generator does not import the site build');
  }
  // ------------------------------------------------ batch client (fake API) ---
  const claude = require('./atlas-claude-batch');
  {
    const calls = [];
    const fakeFetch = async (url, init = {}) => {
      calls.push({ url, method: init.method || 'GET' });
      if (url.endsWith('/v1/messages/batches') && init.method === 'POST') {
        const body = JSON.parse(init.body);
        return { ok: true, status: 200, json: async () => ({ id: 'msgbatch_test', processing_status: 'in_progress', created_at: 't0', request_counts: { processing: body.requests.length } }) };
      }
      if (url.endsWith('/v1/messages/batches/msgbatch_test')) {
        const n = calls.filter(c => c.url.endsWith('/msgbatch_test')).length;
        return { ok: true, status: 200, json: async () => (n < 2 ? { id: 'msgbatch_test', processing_status: 'in_progress' } : { id: 'msgbatch_test', processing_status: 'ended', ended_at: 't1', results_url: 'https://api.anthropic.com/results', request_counts: { succeeded: 2, errored: 0 } }) };
      }
      if (url.endsWith('/results')) {
        return { ok: true, status: 200, text: async () => [
          JSON.stringify({ custom_id: 'a', result: { type: 'succeeded', message: { model: 'claude-opus-5-5', stop_reason: 'end_turn', content: [{ type: 'text', text: '{"verdict":"accept"}' }], usage: { input_tokens: 1 } } } }),
          JSON.stringify({ custom_id: 'b', result: { type: 'errored', error: { type: 'x' } } })
        ].join('\n') };
      }
      return { ok: false, status: 404, text: async () => 'nope' };
    };
    const requests = [claude.structuredRequest('a', { user: 'hi', schema: { type: 'object' } }), claude.structuredRequest('b', { user: 'hi', schema: { type: 'object' } })];
    ok(requests[0].params.model === 'claude-opus-5-5' && requests[0].params.output_config.format.type === 'json_schema' && requests[0].params.output_config.effort === 'high', 'structured requests target Opus 5.5 with a json_schema format and explicit effort');
    const run = await claude.runBatch(requests, { apiKey: 'k', fetchImpl: fakeFetch, pollMs: 1, sleep: async () => {} });
    ok(run.batchId === 'msgbatch_test' && run.byId.size === 2 && run.requestSha256ById.get('a').length === 64, 'runBatch creates, polls to ended, fetches results and hashes each request');
    ok(claude.parseStructuredResult(run.byId.get('a')).ok && claude.parseStructuredResult(run.byId.get('a')).value.verdict === 'accept', 'structured results parse to JSON');
    ok(!claude.parseStructuredResult(run.byId.get('b')).ok && /errored/.test(claude.parseStructuredResult(run.byId.get('b')).reason), 'errored results are reported, not parsed');
    ok(!claude.parseStructuredResult({ result: { type: 'succeeded', message: { stop_reason: 'refusal', content: [] } } }).ok, 'refusals are reported as failures');
    let threw = null;
    try { await claude.createBatch([], { apiKey: '', fetchImpl: fakeFetch }); } catch (e) { threw = e.message; }
    ok(threw && /ANTHROPIC_API_KEY/.test(threw), 'batch creation fails loudly without a key');
  }

  // ---------------------------------------------------------- burden design ---
  const burden = require('./atlas-burden');
  {
    const w = burden.wilson(8, 10);
    ok(w.estimate === 0.8 && w.low > 0.4 && w.high < 1 && burden.wilson(0, 0).estimate === null, 'Wilson interval behaves');
    const record = disc.runDiscovery(ROOT, { topK: 60 });
    const benchmark = bench.loadBenchmark(ROOT).benchmark;
    const d1 = burden.designSample({ record, runSha256: 'r'.repeat(64), benchmark, perStratum: 4 });
    const d2 = burden.designSample({ record, runSha256: 'r'.repeat(64), benchmark, perStratum: 4 });
    ok(JSON.stringify(d1.items) === JSON.stringify(d2.items), 'sample design is deterministic for a run hash');
    ok(d1.items.filter(i => i.role === 'calibration-positive').length === benchmark.positives.length && d1.items.filter(i => i.role === 'calibration-negative').length === benchmark.negatives.length, 'all recorded pairs and controls enter as calibration items');
    ok(d1.strataSummary.every(s => s.sampled <= 4 && s.sampled <= s.population), 'per-stratum sampling respects the cap and population');
    const negKeys = new Set(benchmark.negatives.map(n => text.pairKey(...n.pair)));
    ok(d1.items.filter(i => i.role === 'sample').every(i => !negKeys.has(i.pairKey)), 'controls are never drawn into the sample');
    const roles = d1.items.map(i => i.role);
    ok(roles.slice(0, 8).some(r => r !== roles[0]) || roles.length < 8, 'blind order interleaves roles');
    const corpus = text.loadCorpus(ROOT);
    const requests = burden.buildRequests(ROOT, d1.items.slice(0, 3), corpus);
    burden.assertBlind(requests);
    ok(requests.every(r => /RELEASE A/.test(r.params.messages[0].content) && !/stratum|calibration|benchmark/i.test(r.params.system)), 'labeller requests carry the two excerpts and no design information');
    let threw = null;
    try { burden.assertBlind([{ custom_id: 'calibration-positive-1', params: requests[0].params }]); } catch (e) { threw = e.message; }
    ok(threw && /revealing/.test(threw), 'a revealing custom id is refused');
    const labels = new Map(d1.items.map(i => [i.customId, { verdict: i.role === 'calibration-negative' ? 'reject' : 'accept', confidence: 'high', sharedObject: null, basis: 'test' }]));
    const summary = burden.summarise(d1.items, labels, d1.strataSummary);
    ok(summary.calibration.sensitivityOnRecordedPairs.estimate === 1 && summary.calibration.specificityOnNegativeControls.estimate === 1, 'calibration sensitivity and specificity are computed from the labels');
    ok(summary.projectedAcceptsAcrossCandidates.population === d1.strataSummary.reduce((a, s) => a + s.population, 0), 'projection covers every sampled stratum');
  }

  // ---------------------------------------------------- symbolic-object route ---
  const objectsTool = require('./atlas-objects');
  {
    ok(disc.normalizeObjectName('The Lewis–Perry–Straub Determinant') === 'lewis perry straub determinant' && disc.normalizeObjectName('Theorem') === null && disc.normalizeObjectName('ab') === null, 'object names normalise and generic names are dropped');
    const objects = { corpusFingerprint: 'x', releases: {
      a: { objects: [{ label: 'LPS determinant a_{d,e}', canonicalName: 'lewis-perry-straub determinant', kind: 'invariant', role: 'uses', aliases: ['a_{d,e}'] }, { label: 'Main theorem', canonicalName: 'theorem', kind: 'theorem', role: 'proves', aliases: [] }], externalResults: [{ name: 'Furter Theorem B', canonicalName: 'furter theorem b', source: 'Furter' }] },
      b: { objects: [{ label: 'the Lewis-Perry-Straub determinant', canonicalName: 'Lewis Perry Straub determinant', kind: 'invariant', role: 'extends', aliases: [] }], externalResults: [{ name: 'Theorem B of Furter', canonicalName: 'furter theorem b', source: 'Furter' }] },
      c: { objects: [{ label: 'x', canonicalName: 'theorem', kind: 'theorem', role: 'proves', aliases: [] }], externalResults: [] }
    } };
    const route = disc.routeSymbolicObject(objects, ['a', 'b', 'c']);
    ok(route.get('a|b') && route.get('a|b').score === 2 && route.get('a|b').evidence.sharedObjects[0].name === 'lewis perry straub determinant' && route.get('a|b').evidence.sharedExternalResults[0] === 'furter theorem b', 'symbolic-object route matches canonical names across spellings and shared external results');
    ok(!route.has('a|c') && !route.has('b|c'), 'generic object names never create a match');
    ok(disc.rivalExplanation({ routes: { 'citation-overlap': null, 'citation-path': null, 'shared-object': null, 'symbolic-object': route.get('a|b'), lexical: null, semantic: 'not-run' }, existingAdjacency: [] }).ruleId === 'standard-named-object', 'symbolic-only candidates get the model-extraction rival');
    ok(disc.loadObjectsForCorpus(ROOT, 'f'.repeat(64)) === null, 'no extraction file means the route is not run');
    const dir = tmpRepo();
    fs.mkdirSync(path.join(dir, 'data', 'atlas-discovery', 'objects'), { recursive: true });
    const fp = text.loadCorpus(dir).fingerprint;
    const live = { recordType: 'evidence-atlas-discovery-object-extraction', corpusFingerprint: fp, dryRun: false, extractor: { model: 'claude-opus-5-5' }, batch: { id: 'msgbatch_x' }, extractedAt: '2026-10-14T00:00:00Z', releases: { 'efx-nine-chores': { objects: [{ label: 'EFX', canonicalName: 'envy-freeness up to any chore', kind: 'definition', role: 'proves', aliases: [] }], externalResults: [] }, 'pmms-three-agents-eight-goods': { objects: [{ label: 'EFX', canonicalName: 'envy freeness up to any chore', kind: 'definition', role: 'uses', aliases: [] }], externalResults: [] } } };
    fs.writeFileSync(path.join(dir, 'data', 'atlas-discovery', 'objects', `${fp}.json`), JSON.stringify(live));
    const withObjects = disc.runDiscovery(dir, { topK: 10 });
    ok(withObjects.routesRun.includes('symbolic-object') && withObjects.objectExtraction && withObjects.objectExtraction.batchId === 'msgbatch_x' && /^[a-f0-9]{64}$/.test(withObjects.objectExtraction.sha256), 'an extraction for the live corpus turns the route on and is recorded with provenance');
    const hit = withObjects.candidates.find(c => c.pairKey === 'efx-nine-chores|pmms-three-agents-eight-goods');
    ok(hit && hit.routes['symbolic-object'] && hit.routes['symbolic-object'].evidence.sharedObjects[0].name === 'envy freeness up to any chore', 'the live run surfaces the shared extracted object');
    const dry = { ...live, dryRun: true };
    fs.writeFileSync(path.join(dir, 'data', 'atlas-discovery', 'objects', `${fp}.json`), JSON.stringify(dry));
    ok(disc.loadObjectsForCorpus(dir, fp) === null, 'a dry-run extraction never feeds the route');
    const reqs = objectsTool.buildRequests(ROOT, text.loadCorpus(ROOT)).slice(0, 2);
    ok(reqs.length === 2 && reqs[0].params.output_config.format.schema.required.includes('objects') && reqs[0].params.messages[0].content.length <= objectsTool.BODY_CLIP_CHARS + 2000, 'extraction requests carry the schema and a clipped body');
  }

}

main().then(() => {
  console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}).catch(error => { console.error(error); process.exit(1); });
