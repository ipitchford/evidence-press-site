'use strict';

// Shared corpus loading, fingerprinting and lexical utilities for the
// Evidence Atlas discovery pilot. Used by tools/atlas-discovery.js and
// tools/atlas-benchmark.js. Read-only with respect to the repository.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STOP = new Set(('the of and a to in is for that with as by on this we are be an it from or which not at ' +
  'can one all its each than into their these such has have was were also may then where when only both if so ' +
  'any no does been given two three first second there here they them our between over under more most some ' +
  'same other every very will would should could').split(' '));

function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function pairKey(a, b) { return [a, b].sort().join('|'); }

function corpusFingerprint(root, slugs) {
  const lines = [...slugs].sort().map(slug => {
    const dir = path.join(root, 'papers', slug);
    const meta = fs.readFileSync(path.join(dir, 'meta.json'));
    const body = fs.readFileSync(path.join(dir, 'body.md'));
    return `${slug}:${sha256(meta)}:${sha256(body)}`;
  });
  return sha256(lines.join('\n'));
}

function loadCorpus(root) {
  const papersDir = path.join(root, 'papers');
  const slugs = fs.readdirSync(papersDir)
    .filter(slug => fs.existsSync(path.join(papersDir, slug, 'meta.json')))
    .sort();
  const papers = [];
  const texts = new Map();
  for (const slug of slugs) {
    const bodyPath = path.join(papersDir, slug, 'body.md');
    if (!fs.existsSync(bodyPath)) throw new Error(`${slug}: body.md is missing; refusing to fingerprint a partial corpus`);
    const body = fs.readFileSync(bodyPath, 'utf8');
    if (!body.trim()) throw new Error(`${slug}: body.md is empty; refusing to fingerprint a partial corpus`);
    const meta = JSON.parse(fs.readFileSync(path.join(papersDir, slug, 'meta.json'), 'utf8'));
    papers.push({ slug, ...meta });
    texts.set(slug, `${meta.abstract || ''}\n${body}`);
  }
  return { papers, texts, slugs, fingerprint: corpusFingerprint(root, slugs) };
}

function tokenize(text) {
  const stripped = String(text)
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/\\\([\s\S]*?\\\)/g, ' ')
    .replace(/\\\[[\s\S]*?\\\]/g, ' ');
  const tokens = stripped.toLowerCase().match(/[a-z][a-z-]*[a-z]/g) || [];
  return tokens.filter(token => token.length >= 4 && !STOP.has(token));
}

function tfidfVectors(docs) {
  const counts = new Map();
  const df = new Map();
  for (const [slug, body] of docs) {
    const counter = new Map();
    for (const token of tokenize(body)) counter.set(token, (counter.get(token) || 0) + 1);
    counts.set(slug, counter);
    for (const term of counter.keys()) df.set(term, (df.get(term) || 0) + 1);
  }
  const n = docs.size;
  const vectors = new Map();
  for (const [slug, counter] of counts) {
    const raw = new Map();
    for (const [term, count] of counter) {
      const frequency = df.get(term);
      if (frequency < 2) continue;
      raw.set(term, (1 + Math.log(count)) * Math.log(n / frequency));
    }
    let norm = 0;
    for (const value of raw.values()) norm += value * value;
    norm = Math.sqrt(norm) || 1;
    const vector = new Map();
    for (const [term, value] of [...raw].sort((x, y) => (x[0] < y[0] ? -1 : 1))) vector.set(term, value / norm);
    vectors.set(slug, vector);
  }
  return { vectors, df };
}

function cosine(a, b) {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let sum = 0;
  for (const [term, value] of small) {
    const other = large.get(term);
    if (other) sum += value * other;
  }
  return sum;
}

function topContributingTerms(a, b, n = 10) {
  const terms = [];
  for (const [term, value] of a) {
    const other = b.get(term);
    if (other) terms.push({ term, contribution: value * other });
  }
  terms.sort((x, y) => y.contribution - x.contribution || (x.term < y.term ? -1 : 1));
  return terms.slice(0, n).map(({ term, contribution }) => ({ term, contribution: Number(contribution.toFixed(6)) }));
}

module.exports = { sha256, pairKey, corpusFingerprint, loadCorpus, tokenize, tfidfVectors, cosine, topContributingTerms, STOP };
