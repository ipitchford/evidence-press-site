#!/usr/bin/env node
'use strict';

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

async function main() {
  // --- Task 1: atlas-text ---
  const text = require('./atlas-text');
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
    ok(toks.join(' ') === 'resultant resultant polynomial ab-cd',
      'tokenize strips maths, numbers, short and stop words and lowercases', toks.join(' '));
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
  // --- Task 2: routes and candidates ---
  const disc = require('./atlas-discovery');
  {
    const dir = tmpCorpus(['a', 'b', 'c', 'd']);
    const write = (slug, meta) => fs.writeFileSync(path.join(dir, 'papers', slug, 'meta.json'),
      JSON.stringify({ slug, title: slug, abstract: '', keywords: [], relatedWorks: [], doi: `10.5281/zenodo.${slug.charCodeAt(0)}`, ...meta }));
    write('a', { keywords: ['Fair Division', 'SAT'], relatedWorks: [{ citation: 'X', url: 'https://arxiv.org/abs/1' }, { citation: 'Y', url: 'https://doi.org/10.1000/Y' }] });
    write('b', { keywords: ['fair division'], relatedWorks: [{ citation: 'X', url: 'https://arxiv.org/abs/1/' }] });
    write('c', { relatedWorks: [{ citation: 'Y', url: 'doi:10.1000/y' }, { citation: 'Z', url: 'https://example.org/z' }] });
    write('d', { relatedWorks: [{ citation: 'internal', url: 'https://doi.org/10.5281/zenodo.97' }] });
    const corpus = text.loadCorpus(dir);
    const index = disc.identityIndex(corpus.papers);
    const overlap = disc.routeCitationOverlap(corpus.papers, index, 'https://evidencepress.org');
    ok(overlap.get('a|b') && overlap.get('a|b').score === 1 && overlap.get('a|b').evidence.sharedReferences[0] === 'https://arxiv.org/abs/1',
      'citation-overlap normalises URLs (trailing slash)', JSON.stringify(overlap.get('a|b')));
    ok(overlap.get('a|c') && overlap.get('a|c').score === 1 && overlap.get('a|c').evidence.sharedReferences[0] === 'doi:10.1000/y',
      'citation-overlap normalises DOIs across forms', JSON.stringify(overlap.get('a|c')));
    ok(!overlap.has('a|d'), 'internal release citations are excluded from citation-overlap');
    const shared = disc.routeSharedObject(corpus.papers);
    ok(shared.get('a|b') && shared.get('a|b').evidence.keywords.join() === 'fair division', 'shared-object normalises keyword case');
  }
  {
    const graph = { nodes: [], edges: [
      { source: 'release:a', target: 'release:c', predicate: 'cites-related-release' },
      { source: 'release:b', target: 'release:c', predicate: 'extends-result' },
      { source: 'release:d', target: 'release:a', predicate: 'cites-related-release' }
    ] };
    const paths = disc.routeCitationPath(graph, new Set());
    ok(paths.get('a|b') && paths.get('a|b').evidence.intermediaries.join() === 'c', 'citation-path finds a shared intermediary');
    ok(!paths.has('a|c'), 'citation-path does not emit directly linked pairs');
    const hidden = disc.routeCitationPath(graph, new Set(['a|c']));
    ok(!hidden.has('a|b'), 'hidden edges are removed from the citation-path input');
  }
  {
    const rule = c => disc.rivalExplanation(c).ruleId;
    const base = { routes: { 'citation-overlap': null, 'citation-path': null, 'shared-object': null, lexical: null, semantic: 'not-run' }, existingAdjacency: [] };
    ok(rule({ ...base, routes: { ...base.routes, lexical: { score: 0.3, evidence: { terms: [{ term: 'bound', contribution: 0.1 }] } } } }) === 'common-vocabulary',
      'lexical-only candidate gets the common-vocabulary rival');
    ok(rule({ ...base, routes: { ...base.routes, 'citation-overlap': { score: 1, evidence: { sharedReferences: ['x'] } } } }) === 'shared-background-citation',
      'overlap-only candidate gets the background-citation rival');
    ok(rule({ ...base, routes: { ...base.routes, 'citation-path': { score: 1, evidence: { intermediaries: ['c'] } } } }) === 'common-neighbour',
      'path-only candidate gets the common-neighbour rival');
    ok(rule({ ...base, routes: { ...base.routes, 'shared-object': { score: 1, evidence: { keywords: ['sat'], mathObjects: [] } } } }) === 'broad-keyword',
      'keyword-only candidate gets the broad-keyword rival');
    ok(rule({ ...base, existingAdjacency: [{ nodeId: 'cluster:x', predicate: 'member-of-cluster' }] }) === 'recorded-adjacency',
      'adjacency dominates the rival table');
    ok(rule({ ...base, routes: { ...base.routes, lexical: { score: 0.3, evidence: { terms: [] } }, 'citation-overlap': { score: 1, evidence: { sharedReferences: ['x'] } } } }) === 'field-convention',
      'multi-route candidate gets the field-convention rival');
    ok(disc.RIVAL_RULES.every(r => typeof r.id === 'string' && typeof r.when === 'function'), 'rival rule table is explicit');
    const reached = new Set();
    for (const rule of disc.RIVAL_RULES) {
      for (const sample of disc.RIVAL_RULE_SAMPLES) if (disc.rivalExplanation(sample).ruleId === rule.id) reached.add(rule.id);
    }
    ok(reached.size === disc.RIVAL_RULES.length, 'every rival rule is reachable by a synthetic evidence pattern', [...reached].join(','));
  }
  {
    const first = disc.runDiscovery(ROOT, { topK: 30 });
    const second = disc.runDiscovery(ROOT, { topK: 30 });
    const strip = record => JSON.stringify({ ...record, generatedAt: null });
    ok(strip(first) === strip(second), 'two runs on the same corpus are identical apart from generatedAt');
    ok(first.corpusFingerprint === text.loadCorpus(ROOT).fingerprint, 'run record carries the live corpus fingerprint');
    ok(first.routesNotRun.some(r => r.route === 'semantic') && first.routesNotRun.some(r => r.route === 'symbolic-normalisation'),
      'disabled and excluded routes are recorded, not dropped');
    const required = ['pair', 'pairKey', 'routes', 'routeSignalCount', 'existingAdjacency', 'rivalExplanation', 'inferenceLimit', 'benchmarkRole'];
    ok(first.candidates.every(c => required.every(k => k in c) && disc.ROUTES.every(r => r in c.routes)),
      'every candidate carries every route and required field');
    const direct = disc.directPairs(disc.loadGraph(ROOT, text.loadCorpus(ROOT).papers));
    ok(first.candidates.every(c => !direct.has(c.pairKey)), 'directly linked pairs are excluded in run mode');
    ok(first.candidates.length > 0 && first.candidates[0].routeSignalCount >= first.candidates[first.candidates.length - 1].routeSignalCount,
      'candidates are ordered by route signal count first');
  }

  // --- Task 3: semantic route ---
  {
    let threw = null;
    try { await disc.semanticRoute(ROOT, { apiKey: '', cacheDir: fs.mkdtempSync(path.join(os.tmpdir(), 'emb-')) }); } catch (error) { threw = error.message; }
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
    const failing = async () => ({ ok: false, status: 429, json: async () => ({}) });
    let threw = null;
    try { await disc.embedTexts(new Map([['delta', 'delta text']]), { apiKey: 'test', cacheDir, fetchImpl: failing }); } catch (error) { threw = error.message; }
    ok(threw && /429/.test(threw), 'embedding HTTP failures are raised, not swallowed', threw);
  }

  // --- Task 4: benchmark ---
  const bench = require('./atlas-benchmark');
  {
    const positives = [['a', 'b'], ['c', 'd'], ['e', 'f'], ['g', 'h'], ['i', 'j']];
    const h1 = bench.selectHidden(positives, 'f'.repeat(64));
    const h2 = bench.selectHidden(positives, 'f'.repeat(64));
    ok(h1.length === 2 && JSON.stringify(h1) === JSON.stringify(h2), 'hidden selection is deterministic and takes floor(n/2)');
    ok(h1.every(p => positives.some(q => q[0] === p[0] && q[1] === p[1])), 'hidden pairs are drawn from the positives');
  }
  {
    const proposals = bench.proposeNegatives(ROOT, { count: 5 });
    ok(proposals.length === 5 && proposals.every(p => p.pair.length === 2 && p.lexicalScore > 0 && p.reasons.length >= 3),
      'proposeNegatives returns lexically similar pairs with no declared signal');
  }
  {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bench-'));
    for (const rel of ['papers', 'schemas']) fs.symlinkSync(path.join(ROOT, rel), path.join(dir, rel));
    fs.mkdirSync(path.join(dir, 'data', 'atlas-discovery'), { recursive: true });
    for (const f of ['METHOD_REGISTRY.json', 'RELATIONSHIP_REGISTRY.json']) fs.copyFileSync(path.join(ROOT, 'data', f), path.join(dir, 'data', f));
    const direct = [...disc.directPairs(disc.loadGraph(ROOT, text.loadCorpus(ROOT).papers)).keys()];
    const [x, y] = direct[0].split('|');
    const controls = { confirmedBy: 'test', confirmedAt: '2026-10-14T00:00:00Z', pairs: [{ pair: [x, y], reason: 'deliberately a positive' }] };
    const controlsPath = path.join(dir, 'data', 'atlas-discovery', 'NEGATIVE_CONTROLS.json');
    fs.writeFileSync(controlsPath, JSON.stringify(controls));
    let threw = null;
    try { bench.freezeBenchmark(dir, { frozenAt: '2026-10-14T00:00:00Z' }); } catch (e) { threw = e.message; }
    ok(threw && /positive/.test(threw), 'freeze rejects a negative control that is a recorded positive', threw);
    const prop = bench.proposeNegatives(ROOT, { count: 2 });
    controls.pairs = prop.map(p => ({ pair: p.pair, reason: 'test' }));
    fs.writeFileSync(controlsPath, JSON.stringify(controls));
    const frozen = bench.freezeBenchmark(dir, { frozenAt: '2026-10-14T00:00:00Z' });
    ok(frozen.positives.length === direct.length && frozen.hidden.length === Math.floor(direct.length / 2), 'freeze records every direct pair and hides half');
    ok(frozen.corpusFingerprint === text.loadCorpus(ROOT).fingerprint, 'benchmark carries the corpus fingerprint');
    ok(fs.existsSync(path.join(dir, 'data', 'atlas-discovery', 'BENCHMARK.json')), 'freeze writes BENCHMARK.json');
    const loaded = bench.loadBenchmark(dir);
    ok(/^[a-f0-9]{64}$/.test(loaded.sha256) && loaded.benchmark.negatives.length === 2, 'loadBenchmark returns the file hash and content');
  }

  // --- Task 5: evaluate ---
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
    ok(ev.perRoute['citation-overlap'].ranked === 1 && ev.perRoute['citation-overlap'].hiddenRanks['a|b'] === 'absent',
      'per-route ranking only counts pairs with signal on that route');
    ok(ev.reviewerEffort === null, 'reviewer effort is left for a person');
  }
  {
    const stale = { corpusFingerprint: '0'.repeat(64), hidden: [], negatives: [], positives: [] };
    let threw = null;
    try { disc.evaluateDiscovery(ROOT, { topK: 10, benchmark: stale }); } catch (e) { threw = e.message; }
    ok(threw && /fingerprint/.test(threw), 'evaluate refuses a benchmark frozen on a different corpus', threw);
    const live = fs.existsSync(path.join(ROOT, 'data', 'atlas-discovery', 'BENCHMARK.json'));
    if (live) {
      const { benchmark } = bench.loadBenchmark(ROOT);
      const record = disc.evaluateDiscovery(ROOT, { topK: 100, benchmark });
      const hiddenKeys = benchmark.hidden.map(p => text.pairKey(...p));
      ok(record.mode === 'evaluate' && record.evaluation && record.benchmark && record.benchmark.hiddenCount === hiddenKeys.length,
        'evaluate records benchmark provenance');
      const pathInput = disc.routeCitationPath(disc.loadGraph(ROOT, text.loadCorpus(ROOT).papers), new Set(hiddenKeys));
      ok(hiddenKeys.every(k => !pathInput.has(k)), 'hidden positives never appear as citation-path output of their own edges');
      ok(record.candidates.filter(c => c.benchmarkRole === 'hidden-positive').length ===
        Object.values(record.evaluation.union.hiddenRanks).filter(r => r !== 'absent').length,
      'hidden positives present in candidates match ranked hidden positives');
    } else {
      console.log('skip    live benchmark checks (BENCHMARK.json not yet frozen)');
    }
  }

  // --- Task 6: draft ---
  {
    const { validateProposal, expectedProposalId } = require('./atlas-proposals');
    const corpus = text.loadCorpus(ROOT);
    const graph = disc.loadGraph(ROOT, corpus.papers);
    const policy = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'ATLAS_PROPOSAL_POLICY.json'), 'utf8'));
    const record = disc.runDiscovery(ROOT, { topK: 30 });
    const runPath = 'data/atlas-discovery/runs/test-run.json';
    fs.mkdirSync(path.join(ROOT, 'data', 'atlas-discovery', 'runs'), { recursive: true });
    fs.writeFileSync(path.join(ROOT, runPath), JSON.stringify(record));
    try {
      const candidate = record.candidates[0];
      const draft = disc.draftProposal({ root: ROOT, record, runPath, pairKey: candidate.pairKey, submittedAt: '2026-10-14T12:00:00Z' });
      const errors = validateProposal(draft, { policy, graph, root: ROOT });
      ok(errors.length === 0, 'draft validates with the live proposal validator', errors.join('; '));
      ok(draft.proposalId === expectedProposalId(draft), 'draft identity is content-derived');
      ok(draft.submitter.actorType === 'agent' && draft.submitter.humanContributors.length === 0, 'draft names no human');
      ok(draft.currentState === 'awaiting-review' && draft.decisionReceipts.length === 0, 'draft starts awaiting review with no receipts');
      const benchmark = { hidden: [], negatives: [{ pair: candidate.pair, reason: 'test' }], positives: [] };
      let threw = null;
      try { disc.draftProposal({ root: ROOT, record, runPath, pairKey: candidate.pairKey, submittedAt: '2026-10-14T12:00:00Z', benchmark }); } catch (e) { threw = e.message; }
      ok(threw && /negative control/.test(threw), 'draft refuses a negative-control pair without --allow-negative', threw);
      const allowed = disc.draftProposal({ root: ROOT, record, runPath, pairKey: candidate.pairKey, submittedAt: '2026-10-14T12:00:00Z', benchmark, allowNegative: true });
      ok(allowed.riskFlags.includes('benchmark-negative-control'), 'an allowed negative draft is flagged');
      let missing = null;
      try { disc.draftProposal({ root: ROOT, record, runPath, pairKey: 'nope|nothing', submittedAt: '2026-10-14T12:00:00Z' }); } catch (e) { missing = e.message; }
      ok(missing && /not a candidate/.test(missing), 'draft refuses a pair absent from the run record', missing);
    } finally { fs.unlinkSync(path.join(ROOT, runPath)); }
  }
  {
    const files = ['atlas-discovery.js', 'atlas-benchmark.js', 'atlas-text.js'];
    const source = files.map(f => fs.readFileSync(path.join(ROOT, 'tools', f), 'utf8')).join('\n');
    const writes = source.match(/writeFileSync\([^;]*/g) || [];
    ok(writes.length > 0 && !/RELATIONSHIP_REGISTRY|METHOD_REGISTRY|atlas-proposals|papers/.test(writes.join('\n')),
      'generator sources never write to the registry, method registry, proposals or papers', writes.join(' | '));
    ok(!/require\(['"]\.\/build['"]\)/.test(source), 'generator does not import the site build');
  }

}

main().then(() => {
  console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}).catch(error => { console.error(error); process.exit(1); });
