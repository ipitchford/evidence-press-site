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

}

main().then(() => {
  console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}).catch(error => { console.error(error); process.exit(1); });
