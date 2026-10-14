#!/usr/bin/env node
'use strict';

// Proposes negative-control candidates for the discovery benchmark. This is a
// GENERATOR-ASSISTED aid: it uses the generator's routes to find lexically
// similar pairs that carry no declared signal. The benchmark freeze
// (tools/atlas-benchmark.js) never calls this module and never imports the
// generator; a maintainer must confirm every pair before it is frozen.
// Controls chosen this way bound burden on the lexical and semantic routes
// only; the evaluation record says so explicitly.

const path = require('path');
const text = require('./atlas-text');
const disc = require('./atlas-discovery');

function proposeNegatives(root, { count = 12, lexicalTopK = 150 } = {}) {
  const corpus = text.loadCorpus(root);
  const graph = disc.loadGraph(root, corpus.papers);
  const direct = disc.directPairs(graph);
  const adjacencyMap = disc.adjacency(graph);
  const overlap = disc.routeCitationOverlap(corpus.papers, disc.identityIndex(corpus.papers));
  const paths = disc.routeCitationPath(graph, new Set());
  const shared = disc.routeSharedObject(corpus.papers);
  const lexical = disc.routeLexical(corpus.texts, lexicalTopK, new Set(direct.keys()));
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
      reasons: ['no shared external reference', 'no shared keyword or mathObject', 'no shared citation intermediary', 'no shared cluster or lineage', 'no direct edge'],
      selectionLimit: 'lexically similar by construction; informative for lexical and semantic burden only'
    });
    if (out.length >= count) break;
  }
  return out;
}

function main() {
  const countArg = process.argv.slice(2).find(a => a.startsWith('--count='));
  const count = Number((countArg || '--count=12').split('=')[1]);
  console.log(JSON.stringify(proposeNegatives(path.join(__dirname, '..'), { count }), null, 2));
}

module.exports = { proposeNegatives };

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exit(1); }
}
