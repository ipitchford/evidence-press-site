#!/usr/bin/env node
'use strict';
/*
 * Conformance and consistency tests for the built site.
 *
 * Three jobs:
 *   1. Validate dist/api/papers.json against the published dist/api/schema.json,
 *      using a small validator covering the subset of JSON Schema the site
 *      actually uses. A schema nobody checks is documentation, not a contract.
 *   2. Cross-check the surfaces that enumerate releases — catalogue API, JSON
 *      Feed, RSS, sitemap, publication ledger and the files on disk — against
 *      each other. Disagreement between them is the failure mode that matters
 *      for a publication record, and it is invisible in any single file.
 *   3. Validate the operating contract, method registry, abductive ledger and
 *      prospective work ledger against their public schemas and require exact
 *      source-to-public parity.
 *
 * Run after `node build.js`. Exit 0 = pass. No dependencies.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { loadArtifacts, loadPaperMetadata } = require('./operating-model');

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
const operatingArtifacts = loadArtifacts(ROOT);
const sourcePapers = loadPaperMetadata(ROOT);
const atlasRoadmap = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'ATLAS_ROADMAP.json'), 'utf8'));
const atlasRoadmapSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'schemas', 'atlas-roadmap.schema.json'), 'utf8'));

/* ----------------------------------------- high-level layout contracts */
const homeHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const siteCss = fs.readFileSync(path.join(DIST, 'assets', 'style.css'), 'utf8');
const atlasCss = fs.readFileSync(path.join(DIST, 'assets', 'atlas.css'), 'utf8');
const siteCssVersion = crypto.createHash('sha256').update(siteCss).digest('hex').slice(0, 10);
const atlasCssVersion = crypto.createHash('sha256').update(atlasCss).digest('hex').slice(0, 10);
const atlasHtml = fs.readFileSync(path.join(DIST, 'atlas', 'index.html'), 'utf8');
check('homepage uses a content-addressed shared stylesheet filename',
  fs.existsSync(path.join(DIST, 'assets', `style-${siteCssVersion}.css`)) &&
  homeHtml.includes(`/assets/style-${siteCssVersion}.css`));
check('Atlas uses a content-addressed page stylesheet filename',
  fs.existsSync(path.join(DIST, 'assets', `atlas-${atlasCssVersion}.css`)) &&
  atlasHtml.includes(`/assets/atlas-${atlasCssVersion}.css`));
check('homepage keeps four compact programme signposts',
  (homeHtml.match(/class="programme-card"/g) || []).length === 4 &&
  /@media\s*\(min-width:\s*1040px\)\s*\{\s*\.programme-cards\s*\{\s*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/.test(siteCss));
check('Atlas explanatory prose aligns with the page wrapper',
  /\.atlas-prose\s*\{[^}]*max-width:\s*none;[^}]*margin:\s*2\.6rem\s+0\s+0;/.test(atlasCss));

/* ------------------------------------------------------- mini JSON Schema */
/* Covers exactly the keywords the published schema uses. Anything unknown is
   reported rather than ignored, so the validator cannot silently pass a
   constraint it does not understand. */
const KNOWN = new Set(['$schema', '$id', 'title', 'description', 'type', 'required',
  'properties', 'additionalProperties', 'items', 'enum', 'const', 'pattern', 'format',
  'minItems', 'minLength', 'minimum', '$ref', '$defs', 'oneOf']);

const FORMATS = {
  date: v => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + 'T12:00:00Z')),
  'date-time': v => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(v) && !Number.isNaN(Date.parse(v)),
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

  if (node.oneOf) {
    const alternatives = node.oneOf.map((alternative, index) => {
      const alternativeErrors = [];
      validate(value, alternative, root, `${pathStr}<oneOf:${index}>`, alternativeErrors);
      return alternativeErrors;
    });
    const matches = alternatives.filter(item => item.length === 0).length;
    if (matches !== 1) errors.push(`${pathStr}: expected exactly one oneOf branch, matched ${matches}`);
  }

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

const refErrors = [];
const visitedSchemaNodes = new Set();
(function walkRefs(node, location) {
  if (!node || typeof node !== 'object' || visitedSchemaNodes.has(node)) return;
  visitedSchemaNodes.add(node);
  if (typeof node.$ref === 'string') {
    let target;
    try { target = resolveRef(node.$ref, schema); } catch { target = undefined; }
    if (!target) refErrors.push(`${location}: unresolved ${node.$ref}`);
    else walkRefs(target, `${location} -> ${node.$ref}`);
  }
  for (const [key, value] of Object.entries(node)) {
    if (key !== '$ref') walkRefs(value, `${location}.${key}`);
  }
})(schema, 'schema');
check('every embedded public-schema reference resolves', refErrors.length === 0, refErrors.join('\n  '));

const syntheticPaper = JSON.parse(JSON.stringify(papersDoc.papers[0]));
syntheticPaper.slug = 'synthetic-prospective-schema-test';
syntheticPaper.url = 'https://evidencepress.org/releases/synthetic-prospective-schema-test/';
syntheticPaper.operatingModel = {
  version: '1.0',
  workId: 'ep-work:synthetic-prospective-schema-test',
  attemptIds: ['ep-attempt:synthetic-prospective-schema-test'],
  aims: ['science'],
  artifactRoles: ['method-demonstration'],
  lineageId: null,
  accelerationPrimitives: ['certificate-first'],
  decisionObject: { type: 'certificate', description: 'Synthetic schema fixture.', scope: 'Public-schema closure test only.' },
  bottleneckTargeted: ['assurance'],
  semanticBridge: { state: 'explicit', description: 'Synthetic source-to-schema mapping.', remainingRisks: ['No research claim is tested.'] },
  humanJudgmentGates: ['Decide whether the fixture covers the authored schema.'],
  parentLinks: [],
  assuranceTarget: { dimensions: ['semanticValidation'], nextAction: 'Run the schema validator.', claimCeiling: 'Structural fixture only.' },
  impactClaims: [{
    id: 'science-no-impact', aim: 'science', outcome: 'Research-cycle acceleration', setting: 'Synthetic fixture',
    status: 'NO_IMPACT_EVIDENCE', designClass: 'none', comparator: 'Not measured.', estimand: 'Not estimated.',
    evidenceRefs: [], registeredDesignRef: null, independentAssessment: null
  }]
};
const syntheticErrors = [];
validate(syntheticPaper, schema.$defs.paper, schema, 'syntheticPaper', syntheticErrors);
check('synthetic prospective paper validates through the generated public schema',
  syntheticErrors.length === 0, syntheticErrors.slice(0, 12).join('\n  '));

/* ---------------------------------------- operating contracts and parity */
const governance = [
  ['operating-model.json', 'operating-model.schema.json', operatingArtifacts.contract, operatingArtifacts.schemas.contract],
  ['method-registry.json', 'method-registry.schema.json', operatingArtifacts.registry, operatingArtifacts.schemas.registry],
  ['ibe-ledger.json', 'ibe-ledger.schema.json', operatingArtifacts.ledger, operatingArtifacts.schemas.ledger],
  ['work-ledger.json', 'work-ledger.schema.json', operatingArtifacts.workLedger, operatingArtifacts.schemas.workLedger],
  ['atlas-roadmap.json', 'atlas-roadmap.schema.json', atlasRoadmap, atlasRoadmapSchema]
];
const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);
for (const [dataName, schemaName, sourceData, sourceSchema] of governance) {
  const publicData = read(`api/${dataName}`);
  const publicSchema = read(`api/schemas/${schemaName}`);
  const governanceErrors = [];
  validate(publicData, publicSchema, publicSchema, dataName, governanceErrors);
  check(`${dataName} validates against its published schema`, governanceErrors.length === 0,
    governanceErrors.slice(0, 12).join('\n  '));
  check(`${dataName} is an exact source-to-public copy`, sameJson(publicData, sourceData));
  check(`${schemaName} is an exact source-to-public copy`, sameJson(publicSchema, sourceSchema));
  check(`v1/${dataName} matches the unversioned alias`, sameJson(read(`api/v1/${dataName}`), publicData));
  check(`v1/schemas/${schemaName} matches the unversioned alias`,
    sameJson(read(`api/v1/schemas/${schemaName}`), publicSchema));
}

const publicAtlasRoadmap = read('api/atlas-roadmap.json');
const publicResearchGraph = read('api/research-graph.json');
check('Atlas roadmap baseline matches the published source graph',
  publicAtlasRoadmap.currentBaseline.releaseCount === publicResearchGraph.stats.releaseCount &&
  publicAtlasRoadmap.currentBaseline.methodCount === publicResearchGraph.stats.methodCount &&
  publicAtlasRoadmap.currentBaseline.clusterCount === publicResearchGraph.stats.clusterCount &&
  publicAtlasRoadmap.currentBaseline.lineageCount === publicResearchGraph.stats.lineageCount &&
  publicAtlasRoadmap.currentBaseline.acceptedRelationshipCount === publicResearchGraph.stats.edgeCount &&
  publicAtlasRoadmap.currentBaseline.publishedProposalCount === publicResearchGraph.stats.proposedEdgeCount);
check('Atlas page links its machine-readable roadmap and schema',
  atlasHtml.includes('/api/atlas-roadmap.json') && atlasHtml.includes('/api/schemas/atlas-roadmap.schema.json'));

const releaseOperatingSchema = read('api/schemas/release-operating-model.schema.json');
check('prospective release schema is an exact source-to-public copy',
  sameJson(releaseOperatingSchema, operatingArtifacts.schemas.release));
check('v1 prospective release schema matches the unversioned alias',
  sameJson(read('api/v1/schemas/release-operating-model.schema.json'), releaseOperatingSchema));
check('public v1 keeps operatingModel optional for legacy records',
  schema.$defs.paper.properties.operatingModel && !schema.$defs.paper.required.includes('operatingModel'));
check('additive papers schema version is 1.3', papersDoc.schemaVersion === '1.3');

/* ------------------------------------------------ cross-surface agreement */
const releasesOnDisk = fs.readdirSync(path.join(DIST, 'releases'))
  .filter(d => fs.existsSync(path.join(DIST, 'releases', d, 'index.html'))).sort();
const apiSlugs = papersDoc.papers.map(p => p.slug).sort();
const deterministicPaperOrder = [...papersDoc.papers]
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.slug.localeCompare(b.slug))
  .map(p => p.slug);
const feed = read('feed.json');
const feedSlugs = feed.items.map(i => (String(i.url).match(/\/releases\/([^/]+)\//) || [])[1]).filter(Boolean).sort();
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const sitemapSlugs = [...sitemap.matchAll(/\/releases\/([^/<]+)\//g)].map(m => m[1]).sort();
const rss = fs.readFileSync(path.join(DIST, 'feed.xml'), 'utf8');
const rssSlugs = [...rss.matchAll(/\/releases\/([^/<]+)\//g)].map(m => m[1]);
const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'PUBLISHED.json'), 'utf8'));
const ledgerSlugs = ledger.releases.map(r => r.slug).sort();
const assignedSlugs = Object.keys(operatingArtifacts.registry.releaseAssignments).sort();

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
check('declared count matches the number of records', papersDoc.count === papersDoc.papers.length,
  `count=${papersDoc.count} records=${papersDoc.papers.length}`);
check('catalogue ordering is deterministic for equal publication dates',
  same(papersDoc.papers.map(p => p.slug), deterministicPaperOrder));
check('catalogue matches the release pages on disk', same(apiSlugs, releasesOnDisk),
  `api=${apiSlugs.length} disk=${releasesOnDisk.length}`);
check('JSON Feed matches the catalogue', same(feedSlugs, apiSlugs),
  `feed=${feedSlugs.join(',')}`);
check('sitemap matches the catalogue', same([...new Set(sitemapSlugs)].sort(), apiSlugs));
check('RSS lists every release', apiSlugs.every(s => rssSlugs.includes(s)));
check('every ledger release is still published', ledgerSlugs.every(s => releasesOnDisk.includes(s)),
  `missing: ${ledgerSlugs.filter(s => !releasesOnDisk.includes(s)).join(', ')}`);
check('method registry assigns every release exactly once by slug', same(assignedSlugs, apiSlugs),
  `assigned=${assignedSlugs.length} api=${apiSlugs.length}`);

const sourceBySlug = new Map(sourcePapers.map(paper => [paper.slug, paper]));
const operatingDrift = [];
for (const paper of papersDoc.papers) {
  const authored = sourceBySlug.get(paper.slug);
  if (authored && authored.operatingModel) {
    if (!sameJson(paper.operatingModel, authored.operatingModel)) operatingDrift.push(`${paper.slug}: source and API differ`);
  } else if (Object.prototype.hasOwnProperty.call(paper, 'operatingModel')) {
    operatingDrift.push(`${paper.slug}: legacy API record invents operatingModel metadata`);
  }
}
check('per-release operating metadata is exact and never invented for legacy records',
  operatingDrift.length === 0, operatingDrift.join('\n  '));

const operatingPageFiles = ['operating-model/index.html', 'operating-model/index.md', 'operating-model/index.json'];
check('operating doctrine ships human, Markdown and machine representations',
  operatingPageFiles.every(rel => fs.existsSync(path.join(DIST, rel))),
  operatingPageFiles.filter(rel => !fs.existsSync(path.join(DIST, rel))).join(', '));

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
check('versioned papers API exactly matches the unversioned alias', sameJson(v1, papersDoc));
check('versioned papers schema exactly matches the unversioned alias',
  sameJson(read('api/v1/schema.json'), schema));
check('build identity is published', (() => {
  const b = read('api/build.json');
  return !!(b.schemaVersion && b.softwareVersion);
})());

const uniqueAnswer = papersDoc.papers.find(p => p.slug === 'unique-answer-not-identified');
const uniqueAnswerAudio = path.join(ROOT, 'assets', 'audio', 'unique-answer-not-identified.mp3');
const uniqueAnswerVersion = crypto.createHash('sha256').update(fs.readFileSync(uniqueAnswerAudio)).digest('hex').slice(0, 10);
const uniqueAnswerAudioUrl = `https://evidencepress.org/assets/audio/unique-answer-not-identified.mp3?v=${uniqueAnswerVersion}`;
const uniqueAnswerHtml = fs.readFileSync(path.join(DIST, 'releases', 'unique-answer-not-identified', 'index.html'), 'utf8');
check('corrected release audio is content-versioned without a duplicate player',
  uniqueAnswer && uniqueAnswer.audioUrl === uniqueAnswerAudioUrl &&
  (uniqueAnswerHtml.match(/<audio\b/g) || []).length === 1 &&
  uniqueAnswerHtml.includes(`<audio id="briefing-audio" preload="metadata" src="/assets/audio/unique-answer-not-identified.mp3?v=${uniqueAnswerVersion}"></audio>`) &&
  uniqueAnswerHtml.includes(`href="/assets/audio/unique-answer-not-identified.mp3?v=${uniqueAnswerVersion}"`) &&
  uniqueAnswer.media.some(item => item.type === 'audio' &&
    item.url === 'https://evidencepress.org/assets/audio/unique-answer-not-identified.mp3'),
  `audioUrl=${uniqueAnswer && uniqueAnswer.audioUrl} version=${uniqueAnswerVersion}`);
const uniqueAnswerVideo = uniqueAnswer && uniqueAnswer.media
  .find(item => item.type === 'video');
check('unique-answer video is API-visible, privacy-enhanced and claim-calibrated',
  uniqueAnswerVideo && uniqueAnswerVideo.url === 'https://youtu.be/l_r0fMvFbBQ' &&
  uniqueAnswerVideo.description.includes('not additional scientific or mathematical evidence') &&
  (uniqueAnswerHtml.match(/<iframe\b/g) || []).length === 1 &&
  uniqueAnswerHtml.includes('src="https://www.youtube-nocookie.com/embed/l_r0fMvFbBQ?rel=0"') &&
  uniqueAnswerHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/l_r0fMvFbBQ/hqdefault.jpg"'),
  `video=${uniqueAnswerVideo && uniqueAnswerVideo.url}`);

const frankl = papersDoc.papers.find(p => p.slug === 'frankl-concavity-obstruction');
const franklMeta = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'papers', 'frankl-concavity-obstruction', 'meta.json'), 'utf8'));
const franklAudioFile = path.join(ROOT, 'assets', 'audio', 'frankl-concavity-obstruction.mp3');
const franklTranscriptFile = path.join(ROOT, 'assets', 'audio', 'frankl-concavity-obstruction.txt');
const franklReceiptFile = path.join(ROOT, 'assets', 'audio', 'frankl-concavity-obstruction.provenance.json');
const franklAudio = fs.readFileSync(franklAudioFile);
const franklTranscript = fs.readFileSync(franklTranscriptFile, 'utf8');
const franklReceipt = JSON.parse(fs.readFileSync(franklReceiptFile, 'utf8'));
const franklAudioHash = crypto.createHash('sha256').update(franklAudio).digest('hex');
const franklVersion = franklAudioHash.slice(0, 10);
const franklHtml = fs.readFileSync(path.join(DIST, 'releases', 'frankl-concavity-obstruction', 'index.html'), 'utf8');
check('Frankl briefing uses the declared OpenAI British house voice with byte-bound provenance',
  frankl && franklMeta.audioVoiceLabel === 'OpenAI API synthetic voice (fable)' &&
  franklMeta.audioContentVersioned === true &&
  frankl.audioUrl === `https://evidencepress.org/assets/audio/frankl-concavity-obstruction.mp3?v=${franklVersion}` &&
  franklTranscript === `${franklMeta.narration.trim()}\n` &&
  franklReceipt.provider === 'openai' && franklReceipt.model === 'gpt-4o-mini-tts' &&
  franklReceipt.voice === 'fable' && franklReceipt.audioSha256 === franklAudioHash &&
  franklReceipt.audioBytes === franklAudio.length &&
  franklHtml.includes('Narrated summary · OpenAI API synthetic voice (fable)') &&
  franklHtml.includes('Replaced the original macOS Daniel narration') &&
  (franklHtml.match(/<audio\b/g) || []).length === 1,
  `audioUrl=${frankl && frankl.audioUrl} sha256=${franklAudioHash}`);

const walesAudit = papersDoc.papers.find(p => p.slug === 'wales-20mph-casualty-attribution');
const walesVideo = walesAudit && walesAudit.media.find(item => item.type === 'video');
const walesHtml = fs.readFileSync(path.join(DIST, 'releases', 'wales-20mph-casualty-attribution', 'index.html'), 'utf8');
check('Wales video is API-visible, privacy-enhanced and evidence-calibrated',
  walesVideo && walesVideo.url === 'https://youtu.be/a5bUnv22Sns' &&
  walesVideo.description.includes('not additional policy evidence') &&
  (walesHtml.match(/<iframe\b/g) || []).length === 1 &&
  walesHtml.includes('src="https://www.youtube-nocookie.com/embed/a5bUnv22Sns?rel=0"') &&
  walesHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/a5bUnv22Sns/hqdefault.jpg"'),
  `video=${walesVideo && walesVideo.url}`);

const fullE3 = papersDoc.papers.find(p => p.slug === 'full-e3-column-polydegree-conjecture');
const fullE3Video = fullE3 && fullE3.media.find(item => item.type === 'video');
const fullE3Html = fs.readFileSync(path.join(DIST, 'releases', 'full-e3-column-polydegree-conjecture', 'index.html'), 'utf8');
check('full e=3 video is API-visible, privacy-enhanced and evidence-calibrated',
  fullE3Video && fullE3Video.url === 'https://youtu.be/P3Ozi6Dp9hQ' &&
  fullE3Video.description.includes('not additional mathematical evidence') &&
  (fullE3Html.match(/<iframe\b/g) || []).length === 1 &&
  fullE3Html.includes('src="https://www.youtube-nocookie.com/embed/P3Ozi6Dp9hQ?rel=0"') &&
  fullE3Html.includes('"thumbnailUrl": "https://i.ytimg.com/vi/P3Ozi6Dp9hQ/hqdefault.jpg"'),
  `video=${fullE3Video && fullE3Video.url}`);

const bilateral = papersDoc.papers.find(p => p.slug === 'bilateral-deficiency-regular-dim');
const bilateralVideo = bilateral && bilateral.media.find(item => item.type === 'video');
const bilateralHtml = fs.readFileSync(path.join(DIST, 'releases', 'bilateral-deficiency-regular-dim', 'index.html'), 'utf8');
check('bilateral-deficiency video is API-visible, privacy-enhanced and evidence-calibrated',
  bilateralVideo && bilateralVideo.url === 'https://youtu.be/kPqHgEkKEY8' &&
  bilateralVideo.description.includes('not additional mathematical evidence') &&
  (bilateralHtml.match(/<iframe\b/g) || []).length === 1 &&
  bilateralHtml.includes('src="https://www.youtube-nocookie.com/embed/kPqHgEkKEY8?rel=0"') &&
  bilateralHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/kPqHgEkKEY8/hqdefault.jpg"'),
  `video=${bilateralVideo && bilateralVideo.url}`);

const cyclicityRootSpan = papersDoc.papers.find(p => p.slug === 'cyclicity-root-span-low-rank');
const cyclicityRootSpanVideo = cyclicityRootSpan && cyclicityRootSpan.media.find(item => item.type === 'video');
const cyclicityRootSpanHtml = fs.readFileSync(path.join(DIST, 'releases', 'cyclicity-root-span-low-rank', 'index.html'), 'utf8');
check('cyclicity-root-span video is API-visible, privacy-enhanced and evidence-calibrated',
  cyclicityRootSpanVideo && cyclicityRootSpanVideo.url === 'https://youtu.be/ZFPFIWHWihs' &&
  cyclicityRootSpanVideo.description.includes('not additional mathematical evidence') &&
  (cyclicityRootSpanHtml.match(/<iframe\b/g) || []).length === 1 &&
  cyclicityRootSpanHtml.includes('src="https://www.youtube-nocookie.com/embed/ZFPFIWHWihs?rel=0"') &&
  cyclicityRootSpanHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/ZFPFIWHWihs/hqdefault.jpg"'),
  `video=${cyclicityRootSpanVideo && cyclicityRootSpanVideo.url}`);

const exactSmith = papersDoc.papers.find(p => p.slug === 'exact-smith-invariants-affine-determinant-lines');
const exactSmithVideo = exactSmith && exactSmith.media.find(item => item.type === 'video');
const exactSmithHtml = fs.readFileSync(path.join(DIST, 'releases', 'exact-smith-invariants-affine-determinant-lines', 'index.html'), 'utf8');
check('exact-Smith video is API-visible, privacy-enhanced and evidence-calibrated',
  exactSmithVideo && exactSmithVideo.url === 'https://youtu.be/G16zwDUq2gs' &&
  exactSmithVideo.description.includes('not additional mathematical evidence') &&
  (exactSmithHtml.match(/<iframe\b/g) || []).length === 1 &&
  exactSmithHtml.includes('src="https://www.youtube-nocookie.com/embed/G16zwDUq2gs?rel=0"') &&
  exactSmithHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/G16zwDUq2gs/hqdefault.jpg"'),
  `video=${exactSmithVideo && exactSmithVideo.url}`);

const hahnEwens = papersDoc.papers.find(p => p.slug === 'hahn-ewens-mixing-theorem');
const hahnEwensVideo = hahnEwens && hahnEwens.media.find(item => item.type === 'video');
const hahnEwensHtml = fs.readFileSync(path.join(DIST, 'releases', 'hahn-ewens-mixing-theorem', 'index.html'), 'utf8');
check('Hahn--Ewens video is API-visible, privacy-enhanced and evidence-calibrated',
  hahnEwensVideo && hahnEwensVideo.url === 'https://youtu.be/J87UfVWyIhM' &&
  hahnEwensVideo.description.includes('not additional mathematical evidence') &&
  (hahnEwensHtml.match(/<iframe\b/g) || []).length === 1 &&
  hahnEwensHtml.includes('src="https://www.youtube-nocookie.com/embed/J87UfVWyIhM?rel=0"') &&
  hahnEwensHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/J87UfVWyIhM/hqdefault.jpg"'),
  `video=${hahnEwensVideo && hahnEwensVideo.url}`);

const smoothPoint = papersDoc.papers.find(p => p.slug === 'smooth-point-certificates-polydegree-containments');
const smoothPointVideo = smoothPoint && smoothPoint.media.find(item => item.type === 'video');
const smoothPointHtml = fs.readFileSync(path.join(DIST, 'releases', 'smooth-point-certificates-polydegree-containments', 'index.html'), 'utf8');
check('smooth-point video is API-visible, privacy-enhanced and evidence-calibrated',
  smoothPointVideo && smoothPointVideo.url === 'https://youtu.be/Ce24enjIdTQ' &&
  smoothPointVideo.description.includes('not additional mathematical evidence') &&
  (smoothPointHtml.match(/<iframe\b/g) || []).length === 1 &&
  smoothPointHtml.includes('src="https://www.youtube-nocookie.com/embed/Ce24enjIdTQ?rel=0"') &&
  smoothPointHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/Ce24enjIdTQ/hqdefault.jpg"'),
  `video=${smoothPointVideo && smoothPointVideo.url}`);

const cyclicityLoci = papersDoc.papers.find(p => p.slug === 'cyclicity-loci-exponential-periods');
const cyclicityLociVideo = cyclicityLoci && cyclicityLoci.media.find(item => item.type === 'video');
const cyclicityLociHtml = fs.readFileSync(path.join(DIST, 'releases', 'cyclicity-loci-exponential-periods', 'index.html'), 'utf8');
check('cyclicity-loci video is API-visible, privacy-enhanced and evidence-calibrated',
  cyclicityLociVideo && cyclicityLociVideo.url === 'https://youtu.be/NJkN1mfuhJ4' &&
  cyclicityLociVideo.description.includes('not additional mathematical evidence') &&
  (cyclicityLociHtml.match(/<iframe\b/g) || []).length === 1 &&
  cyclicityLociHtml.includes('src="https://www.youtube-nocookie.com/embed/NJkN1mfuhJ4?rel=0"') &&
  cyclicityLociHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/NJkN1mfuhJ4/hqdefault.jpg"'),
  `video=${cyclicityLociVideo && cyclicityLociVideo.url}`);

const sfsAudit = papersDoc.papers.find(p => p.slug === 'sfs-identifiability-audit');
const sfsMeta = JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', 'sfs-identifiability-audit', 'meta.json'), 'utf8'));
const sfsHtml = fs.readFileSync(path.join(DIST, 'releases', 'sfs-identifiability-audit', 'index.html'), 'utf8');
const sfsAudioFile = path.join(ROOT, 'assets', 'audio', 'sfs-identifiability-audit.mp3');
const sfsOgFile = path.join(ROOT, 'assets', 'og', 'sfs-identifiability-audit.png');
const sfsAudioVersion = crypto.createHash('sha256').update(fs.readFileSync(sfsAudioFile)).digest('hex').slice(0, 10);
const sfsOgVersion = crypto.createHash('sha256').update(fs.readFileSync(sfsOgFile)).digest('hex').slice(0, 10);
const sfsCurrentVideo = sfsAudit && sfsAudit.media.find(item => item.type === 'video' && !item.superseded);
const sfsHistoricalVideo = sfsAudit && sfsAudit.media.find(item => item.type === 'video' && item.superseded);
check('SFS correction binds the successor DOI, sole scholarly creator and explicit correction history',
  sfsAudit && sfsAudit.version === '0.2.1-candidate' &&
  sfsAudit.doi === '10.5281/zenodo.21907269' &&
  same(sfsAudit.authors, ['Ian Pitchford']) &&
  sfsAudit.corrections.length === 3 &&
  sfsAudit.provenance.disclosure.includes('not public external reviews'),
  `version=${sfsAudit && sfsAudit.version} doi=${sfsAudit && sfsAudit.doi}`);
check('SFS corrected audio and Open Graph card are content-versioned',
  sfsAudit &&
  sfsAudit.audioUrl === `https://evidencepress.org/assets/audio/sfs-identifiability-audit.mp3?v=${sfsAudioVersion}` &&
  sfsAudit.imageUrl === `https://evidencepress.org/assets/og/sfs-identifiability-audit.png?v=${sfsOgVersion}` &&
  sfsHtml.includes(`property="og:image" content="https://evidencepress.org/assets/og/sfs-identifiability-audit.png?v=${sfsOgVersion}"`),
  `audio=${sfsAudit && sfsAudit.audioUrl} image=${sfsAudit && sfsAudit.imageUrl}`);
check('SFS media embeds only the corrected briefing and preserves the old briefing as superseded history',
  sfsCurrentVideo && sfsCurrentVideo.url === 'https://youtu.be/iBTcQ1Qjl_g' &&
  sfsHistoricalVideo && sfsHistoricalVideo.url === 'https://youtu.be/QgBD6f_EGDo' &&
  (sfsHtml.match(/<iframe\b/g) || []).length === 1 &&
  sfsHtml.includes('src="https://www.youtube-nocookie.com/embed/iBTcQ1Qjl_g?rel=0"') &&
  !sfsHtml.includes('src="https://www.youtube-nocookie.com/embed/QgBD6f_EGDo?rel=0"') &&
  sfsHtml.includes('<strong>Superseded briefing:</strong>') &&
  sfsHtml.includes('https://youtu.be/QgBD6f_EGDo'),
  `current=${sfsCurrentVideo && sfsCurrentVideo.url} historical=${sfsHistoricalVideo && sfsHistoricalVideo.url}`);
check('SFS public assurance does not promote same-producer diversity to independent reimplementation',
  sfsAudit && sfsAudit.assurance.find(item => item.dimension === 'independentReimplementation').state === 'not-assessed' &&
  sfsAudit.verification.independentlyReproduced === false &&
  sfsHtml.includes('same-producer implementation-diversity check') &&
  sfsHtml.includes('Stage two was different: its error-model form and parameter ladder were informed by stage-one diagnostics'),
  'expected not-assessed independent reimplementation and explicit stage-two data-contact disclosure');
check('SFS narration transcript exactly matches the corrected metadata source',
  fs.readFileSync(path.join(ROOT, 'assets', 'audio', 'sfs-identifiability-audit.txt'), 'utf8').trim() === sfsMeta.narration.trim() &&
  sfsMeta.narration.split(/\s+/).length >= 160 && sfsMeta.narration.split(/\s+/).length <= 300,
  `words=${sfsMeta.narration.split(/\s+/).length}`);
check('SFS scholarly JSON-LD represents Ian Pitchford as a person',
  sfsHtml.includes('"author": [') && sfsHtml.includes('"@type": "Person"') &&
  !sfsHtml.includes('"name": "Agent collective"'),
  'expected Person creator and no agent scholarly author');

/* ---------------------------------------- programme visual hierarchy */
const imageSources = rel => [...fs.readFileSync(path.join(DIST, rel), 'utf8')
  .matchAll(/<img\s+[^>]*src="([^"]+)"[^>]*>/g)].map(match => match[1]);
const productivityImages = imageSources('productivity/index.html');
const starterImages = imageSources('protocols/start/index.html');
const expectedProductivityImages = [
  '/assets/video-thumbs/certified-commitment-horizons.jpg',
  '/assets/video-thumbs/certified-two-item-jrp.jpg',
  '/assets/art/protocols-ladders.svg'
];
check('Productivity keeps its intentional explanatory image set',
  same(productivityImages, expectedProductivityImages),
  `images=${productivityImages.join(',') || 'none'}`);
const productivityHtml = fs.readFileSync(path.join(DIST, 'productivity', 'index.html'), 'utf8');
check('Productivity highlights both logistics research releases',
  productivityHtml.includes('href="/releases/certified-commitment-horizons/"') &&
  productivityHtml.includes('href="/releases/certified-two-item-jrp/"'),
  'expected canonical links to both logistics releases');
check('Productivity maps the research, evidence and practice layers',
  productivityHtml.includes('class="productivity-map"') &&
  productivityHtml.includes('href="#research-exact-logistics-decisions"') &&
  productivityHtml.includes('href="#evidence-what-existing-tests-show"') &&
  productivityHtml.includes('href="#practice-a-protocol-is-a-work-contract"'),
  'expected an explicit three-layer programme map');
check('Productivity logistics highlights retain the field-impact boundary',
  productivityHtml.includes('decision-relevant operations results, not productivity impact evidence'),
  'expected explicit separation between decision relevance and measured impact');
check('Productivity logistics highlights bind each video to its matching thumbnail',
  productivityHtml.includes('src="/assets/video-thumbs/certified-commitment-horizons.jpg"') &&
  productivityHtml.includes('href="https://youtu.be/G4ehJ81pl6g"') &&
  productivityHtml.includes('src="/assets/video-thumbs/certified-two-item-jrp.jpg"') &&
  productivityHtml.includes('href="https://youtu.be/n9SbpLgjOY4"'),
  'expected both canonical thumbnail and video pairs');
check('Published Productivity thumbnails exactly match their reproducible sources',
  expectedProductivityImages.slice(0, 2).every(rel => {
    const filename = path.basename(rel);
    return fs.readFileSync(path.join(DIST, rel)).equals(fs.readFileSync(path.join(ROOT, 'thumbs', filename)));
  }),
  'expected byte-identical thumbs/ to dist/assets/video-thumbs/ copies');
const commitmentVideo = papersDoc.papers.find(p => p.slug === 'certified-commitment-horizons').media
  .find(item => item.type === 'video');
const jointVideo = papersDoc.papers.find(p => p.slug === 'certified-two-item-jrp').media
  .find(item => item.type === 'video');
check('Release APIs expose the two supplied YouTube videos',
  commitmentVideo && commitmentVideo.url === 'https://youtu.be/G4ehJ81pl6g' &&
  jointVideo && jointVideo.url === 'https://youtu.be/n9SbpLgjOY4',
  `commitment=${commitmentVideo && commitmentVideo.url} joint=${jointVideo && jointVideo.url}`);
check('company starter owns the staged-learning cover',
  starterImages.length === 1 && starterImages[0] === '/assets/art/productivity.svg',
  `images=${starterImages.join(',') || 'none'}`);

console.log(failures === 0
  ? '\nALL METADATA TESTS PASSED'
  : `\n${failures} METADATA TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
