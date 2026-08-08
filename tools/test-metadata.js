#!/usr/bin/env node
'use strict';
/*
 * Conformance and consistency tests for the built site.
 *
 * Two jobs:
 *   1. Validate dist/api/papers.json against the published dist/api/schema.json,
 *      using a small validator covering the subset of JSON Schema the site
 *      actually uses. A schema nobody checks is documentation, not a contract.
 *   2. Cross-check the surfaces that enumerate releases — catalogue API, JSON
 *      Feed, RSS, sitemap, publication ledger and the files on disk — against
 *      each other. Disagreement between them is the failure mode that matters
 *      for a publication record, and it is invisible in any single file.
 *
 * Run after `node build.js`. Exit 0 = pass. No dependencies.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

let failures = 0;
function check(label, condition, detail) {
  if (condition) {
    console.log(`ok      ${label}`);
  } else {
    failures++;
    console.log(`FAIL    ${label}`);
    if (detail) console.log(`  ${detail}`);
  }
}

if (!fs.existsSync(path.join(DIST, 'api', 'papers.json'))) {
  console.error('dist/ is not built. Run `node build.js` first.');
  process.exit(1);
}

const read = rel => JSON.parse(fs.readFileSync(path.join(DIST, rel), 'utf8'));
const papersDoc = read('api/papers.json');
const schema = read('api/schema.json');

/* ------------------------------------------------------- mini JSON Schema */
/* Covers exactly the keywords the published schema uses. Anything unknown is
   reported rather than ignored, so the validator cannot silently pass a
   constraint it does not understand. */
const KNOWN = new Set(['$schema', '$id', 'title', 'description', 'type', 'required',
  'properties', 'additionalProperties', 'items', 'enum', 'const', 'pattern', 'format',
  'minItems', 'minLength', 'minimum', '$ref', '$defs']);

const FORMATS = {
  date: v => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + 'T12:00:00Z')),
  uri: v => { try { new URL(v); return true; } catch { return false; } }
};

function resolveRef(ref, root) {
  return ref.replace(/^#\//, '').split('/').reduce((acc, part) => acc[part], root);
}

function validate(value, node, root, pathStr, errors) {
  if (!node || typeof node !== 'object') return;

  for (const key of Object.keys(node)) {
    if (!KNOWN.has(key)) errors.push(`${pathStr}: schema uses unsupported keyword "${key}" — this validator would not enforce it`);
  }

  if (node.$ref) return validate(value, resolveRef(node.$ref, root), root, pathStr, errors);

  const types = node.type ? [].concat(node.type) : null;
  if (types) {
    const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    const ok = types.some(t => t === actual || (t === 'integer' && Number.isInteger(value)));
    if (!ok) { errors.push(`${pathStr}: expected ${types.join('|')}, got ${actual}`); return; }
  }
  if (value === null || value === undefined) return;

  if (node.enum && !node.enum.includes(value)) errors.push(`${pathStr}: ${JSON.stringify(value)} is not one of ${node.enum.join(', ')}`);
  if (node.const !== undefined && value !== node.const) errors.push(`${pathStr}: expected const ${node.const}`);
  if (node.pattern && typeof value === 'string' && !new RegExp(node.pattern).test(value))
    errors.push(`${pathStr}: ${JSON.stringify(value)} does not match ${node.pattern}`);
  if (node.format && typeof value === 'string' && FORMATS[node.format] && !FORMATS[node.format](value))
    errors.push(`${pathStr}: ${JSON.stringify(value)} is not a valid ${node.format}`);
  if (node.minLength != null && typeof value === 'string' && value.length < node.minLength)
    errors.push(`${pathStr}: shorter than minLength ${node.minLength}`);
  if (node.minimum != null && typeof value === 'number' && value < node.minimum)
    errors.push(`${pathStr}: below minimum ${node.minimum}`);

  if (Array.isArray(value)) {
    if (node.minItems != null && value.length < node.minItems)
      errors.push(`${pathStr}: fewer than minItems ${node.minItems}`);
    if (node.items) value.forEach((v, i) => validate(v, node.items, root, `${pathStr}[${i}]`, errors));
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const req of node.required || [])
      if (!(req in value)) errors.push(`${pathStr}: missing required property "${req}"`);
    for (const [key, v] of Object.entries(value)) {
      const sub = (node.properties || {})[key];
      if (sub) validate(v, sub, root, `${pathStr}.${key}`, errors);
      else if (node.additionalProperties === false)
        errors.push(`${pathStr}: unexpected property "${key}" (additionalProperties is false)`);
    }
  }
}

const errors = [];
validate(papersDoc, schema, schema, 'papers.json', errors);
check('catalogue validates against its own published JSON Schema',
  errors.length === 0, errors.slice(0, 12).join('\n  '));

/* ------------------------------------------------ cross-surface agreement */
const releasesOnDisk = fs.readdirSync(path.join(DIST, 'releases'))
  .filter(d => fs.existsSync(path.join(DIST, 'releases', d, 'index.html'))).sort();
const apiSlugs = papersDoc.papers.map(p => p.slug).sort();
const feed = read('feed.json');
const feedSlugs = feed.items.map(i => (String(i.url).match(/\/releases\/([^/]+)\//) || [])[1]).filter(Boolean).sort();
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const sitemapSlugs = [...sitemap.matchAll(/\/releases\/([^/<]+)\//g)].map(m => m[1]).sort();
const rss = fs.readFileSync(path.join(DIST, 'feed.xml'), 'utf8');
const rssSlugs = [...rss.matchAll(/\/releases\/([^/<]+)\//g)].map(m => m[1]);
const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'PUBLISHED.json'), 'utf8'));
const ledgerSlugs = ledger.releases.map(r => r.slug).sort();

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
check('declared count matches the number of records', papersDoc.count === papersDoc.papers.length,
  `count=${papersDoc.count} records=${papersDoc.papers.length}`);
check('catalogue matches the release pages on disk', same(apiSlugs, releasesOnDisk),
  `api=${apiSlugs.length} disk=${releasesOnDisk.length}`);
check('JSON Feed matches the catalogue', same(feedSlugs, apiSlugs),
  `feed=${feedSlugs.join(',')}`);
check('sitemap matches the catalogue', same([...new Set(sitemapSlugs)].sort(), apiSlugs));
check('RSS lists every release', apiSlugs.every(s => rssSlugs.includes(s)));
check('every ledger release is still published', ledgerSlugs.every(s => releasesOnDisk.includes(s)),
  `missing: ${ledgerSlugs.filter(s => !releasesOnDisk.includes(s)).join(', ')}`);

/* --------------------------------------- per-release representation set */
const REPRESENTATIONS = ['paper.json', 'index.md', 'cite.bib', 'ro-crate-metadata.json', 'linkset.json'];
const missing = [];
for (const slug of releasesOnDisk)
  for (const file of REPRESENTATIONS)
    if (!fs.existsSync(path.join(DIST, 'releases', slug, file))) missing.push(`${slug}/${file}`);
check('every release ships every machine representation', missing.length === 0, missing.join(', '));

/* ----------------------------------- assurance and verification agreement */
const drift = [];
for (const p of papersDoc.papers) {
  const state = key => (p.assurance.find(a => a.dimension === key) || {}).state;
  const expected = {
    peerReviewed: state('editorialPeerReview') === 'passed',
    independentlyReproduced: state('independentReimplementation') === 'passed' || state('independentRerun') === 'passed',
    formallyVerified: state('formalVerification') === 'passed',
    internallyReplayed: state('internalReplay') === 'passed'
  };
  for (const [key, want] of Object.entries(expected))
    if (p.verification[key] !== want) drift.push(`${p.slug}.${key}: booleans say ${p.verification[key]}, matrix says ${want}`);
}
check('verification booleans agree with the assurance matrix', drift.length === 0, drift.join('\n  '));

/* A release must never claim an assurance level the site cannot evidence. */
const overclaims = papersDoc.papers.filter(p =>
  p.verification.peerReviewed || p.verification.independentlyReproduced || p.verification.formallyVerified)
  .filter(p => !(p.reviews || []).length);
check('no release claims external assurance without an attached review record',
  overclaims.length === 0, overclaims.map(p => p.slug).join(', '));

/* ------------------------------------------------------- no junk published */
/* Operating-system metadata is invisible locally but publicly served once
   deployed, and it differs between machines, which breaks byte-identical
   rebuilds of a tagged release. Found live on 2026-08-06 by rebuilding a
   clean clone of the tag and diffing against the deployed output. */
const JUNK_RE = /^(\.DS_Store|\._.*|Thumbs\.db|desktop\.ini|\.localized)$/i;
const junk = [];
(function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(full);
    else if (JUNK_RE.test(entry.name)) junk.push(path.relative(DIST, full));
  }
})(DIST);
check('no operating-system metadata files in the published output',
  junk.length === 0, junk.join(', '));

/* -------------------------------------------------- versioned API parity */
const v1 = read('api/v1/papers.json');
check('versioned API serves the same releases as the unversioned alias',
  same(v1.papers.map(p => p.slug).sort(), apiSlugs));
check('build identity is published', (() => {
  const b = read('api/build.json');
  return !!(b.schemaVersion && b.softwareVersion);
})());

/* ---------------------------------------- programme visual hierarchy */
const imageSources = rel => [...fs.readFileSync(path.join(DIST, rel), 'utf8')
  .matchAll(/<img\s+[^>]*src="([^"]+)"[^>]*>/g)].map(match => match[1]);
const productivityImages = imageSources('productivity/index.html');
const starterImages = imageSources('protocols/start/index.html');
check('Productivity keeps one explanatory in-page image',
  productivityImages.length === 1 && productivityImages[0] === '/assets/art/protocols-ladders.svg',
  `images=${productivityImages.join(',') || 'none'}`);
check('company starter owns the staged-learning cover',
  starterImages.length === 1 && starterImages[0] === '/assets/art/productivity.svg',
  `images=${starterImages.join(',') || 'none'}`);

console.log(failures === 0
  ? '\nALL METADATA TESTS PASSED'
  : `\n${failures} METADATA TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
