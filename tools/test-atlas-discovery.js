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
}

main().then(() => {
  console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}).catch(error => { console.error(error); process.exit(1); });
