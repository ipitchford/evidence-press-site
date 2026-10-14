#!/usr/bin/env node
'use strict';

// Model-assisted formal-object extraction for the Evidence Atlas discovery
// pilot. Design record: docs/ATLAS_DISCOVERY_PILOT.md, route 6.
//
// A Claude batch reads each release once and lists the named formal objects
// it proves, uses, defines, extends or leaves open, plus named external
// results it depends on. The output is a quarantined, model-generated
// metadata layer under data/atlas-discovery/objects/, keyed by corpus
// fingerprint. The generator's symbolic-object route reads that file and
// nothing else; papers/*/meta.json is never written. Extracted names are
// inspectable evidence, not declared metadata and not relationships.

const fs = require('fs');
const path = require('path');
const text = require('./atlas-text');
const disc = require('./atlas-discovery');
const batch = require('./atlas-claude-batch');

const OBJECTS_DIR = 'data/atlas-discovery/objects';
const TOOL_VERSION = '0.1.0';
const BODY_CLIP_CHARS = 24000;
const KINDS = ['theorem', 'conjecture', 'definition', 'construction', 'invariant', 'bound', 'algorithm', 'model', 'dataset', 'problem', 'method', 'identity'];
const ROLES = ['proves', 'uses', 'defines', 'extends', 'refutes', 'open'];
const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['objects', 'externalResults'],
  properties: {
    objects: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'canonicalName', 'kind', 'role', 'aliases'],
        properties: {
          label: { type: 'string' },
          canonicalName: { type: 'string' },
          kind: { type: 'string', enum: KINDS },
          role: { type: 'string', enum: ROLES },
          aliases: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    externalResults: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'canonicalName', 'source'],
        properties: { name: { type: 'string' }, canonicalName: { type: 'string' }, source: { type: 'string' } }
      }
    }
  }
};
const SYSTEM = [
  'You extract the specific named formal objects from one research release.',
  'List each distinct mathematical or empirical object the release proves, uses, defines, extends, refutes or leaves open: named theorems, conjectures, definitions, constructions, invariants, bounds, algorithms, models, datasets, problem instances or identities.',
  'For each give: label (as the release names it), canonicalName (a short, notation-free, lower-case name that another author would use for the same object, for example "lewis-perry-straub determinant", "pairwise maximin share", "furter rigidity conjecture"), kind, role, and aliases (other names or standard symbols for the same object, as plain words).',
  'Separately list named external results the release depends on (externalResults), each with the author or source as the release gives it.',
  'Be specific: "theorem", "lemma", "main result", "the bound" alone are not objects. Omit generic method words (SAT, interval arithmetic, Lean) unless the release treats a specific named tool or certificate as an object.',
  'Use only the supplied text. Aim for 5 to 25 objects. Answer with the JSON object only.'
].join(' ');

function buildRequests(root, corpus) {
  return corpus.slugs.map(slug => {
    const meta = corpus.papers.find(p => p.slug === slug);
    const body = fs.readFileSync(path.join(root, 'papers', slug, 'body.md'), 'utf8').slice(0, BODY_CLIP_CHARS);
    const user = [`TITLE: ${meta.title}`, `ABSTRACT: ${meta.abstract || ''}`, `KEYWORDS: ${(meta.keywords || []).join('; ')}`, '', 'BODY:', body].join('\n');
    return batch.structuredRequest(slug, { system: SYSTEM, user, schema: SCHEMA, effort: 'high', maxTokens: 6000 });
  });
}

async function extractObjects(root, { apiKey = process.env.ANTHROPIC_API_KEY, fetchImpl, dryRun = false, batchId = null, pollMs, sleep, onPoll } = {}) {
  const corpus = text.loadCorpus(root);
  const requests = buildRequests(root, corpus);
  const base = {
    schemaVersion: '1.0',
    recordType: 'evidence-atlas-discovery-object-extraction',
    toolVersion: TOOL_VERSION,
    corpusFingerprint: corpus.fingerprint,
    releaseCount: corpus.slugs.length,
    extractor: { model: batch.DEFAULT_MODEL, vendor: 'Anthropic', effort: 'high', bodyClipChars: BODY_CLIP_CHARS, outputSchema: SCHEMA, system: SYSTEM },
    claimCeiling: 'Model-extracted object names for retrieval. They are not declared metadata, not verified, and not relationships; two releases naming the same canonical object is a retrieval signal for maintainer review.'
  };
  if (dryRun) return { ...base, extractedAt: null, dryRun: true, releases: Object.fromEntries(requests.map(r => [r.custom_id, { requestSha256: batch.sha256(r.params), objects: null, externalResults: null }])), failures: [] };
  const run = batchId
    ? await batch.resumeBatch(batchId, requests, { apiKey, fetchImpl, pollMs, sleep, onPoll })
    : await batch.runBatch(requests, { apiKey, fetchImpl, pollMs, sleep, onPoll });
  const releases = {};
  const failures = [];
  for (const slug of corpus.slugs) {
    const parsed = batch.parseStructuredResult(run.byId.get(slug));
    if (parsed.ok) releases[slug] = { requestSha256: run.requestSha256ById.get(slug), objects: parsed.value.objects, externalResults: parsed.value.externalResults };
    else { releases[slug] = { requestSha256: run.requestSha256ById.get(slug), objects: null, externalResults: null }; failures.push({ slug, reason: parsed.reason }); }
  }
  return { ...base, extractedAt: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), dryRun: false, batch: { id: run.batchId, createdAt: run.createdAt, endedAt: run.endedAt, requestCounts: run.requestCounts }, releases, failures };
}

async function main() {
  const args = disc.parseArgs(process.argv.slice(2));
  const root = path.join(__dirname, '..');
  if (args._[0] !== 'extract') throw new Error('usage: atlas-objects.js extract [--dry-run] [--batch-id ID] [--out DIR]');
  const result = await extractObjects(root, { dryRun: Boolean(args['dry-run']), batchId: args['batch-id'] || null, onPoll: b => console.error(`batch ${b.id}: ${b.processing_status} ${JSON.stringify(b.request_counts || {})}`) });
  const file = disc.writeConfined(root, args.out || OBJECTS_DIR, `${result.corpusFingerprint}${result.dryRun ? '-dry-run' : ''}.json`, result);
  const counts = Object.values(result.releases).map(r => (r.objects || []).length);
  console.log(`wrote ${path.relative(root, file)}: ${counts.filter(Boolean).length}/${counts.length} releases with objects, ${counts.reduce((a, b) => a + b, 0)} objects, ${result.failures.length} failures`);
}

module.exports = { OBJECTS_DIR, TOOL_VERSION, BODY_CLIP_CHARS, KINDS, ROLES, SCHEMA, SYSTEM, buildRequests, extractObjects };

if (require.main === module) main().catch(error => { console.error(error.message); process.exit(1); });
