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
const mathObjectsDoc = read('api/math-objects.json');
const mathObjectSchema = read('api/schemas/math-object.schema.json');
const citationsDoc = read('api/citations.json');
const articlesDoc = read('api/articles.json');
const articleSchema = read('api/schemas/article.schema.json');
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
check('every release hero art URL is bound to the exact committed SVG bytes',
  papersDoc.papers.every(paper => {
    const artFile = path.join(ROOT, 'assets', 'art', `${paper.slug}.svg`);
    if (!fs.existsSync(artFile)) return paper.coverArtUrl === null;
    const version = crypto.createHash('sha256').update(fs.readFileSync(artFile)).digest('hex').slice(0, 10);
    const expectedPath = `/assets/art/${paper.slug}.svg?v=${version}`;
    const releaseHtml = fs.readFileSync(path.join(DIST, 'releases', paper.slug, 'index.html'), 'utf8');
    return paper.coverArtUrl === `https://evidencepress.org${expectedPath}` &&
      releaseHtml.includes(`<img src="${expectedPath}" alt="" loading="eager">`);
  }));
const s6Art = fs.readFileSync(path.join(ROOT, 'assets', 'art', 's6-extension-results-candidate.svg'), 'utf8');
const s6ClaimBand = s6Art.match(/<rect id="s6-claim-band"[^>]*>/)?.[0];
const s6ClaimText = s6Art.match(/<text id="s6-claim-band-text"[^>]*>/)?.[0];
const svgNumberAttribute = (element, name) => Number(element?.match(new RegExp(`\\s${name}="([0-9.]+)"`))?.[1]);
const s6ClaimBandWidth = svgNumberAttribute(s6ClaimBand, 'width');
const s6ClaimTextLength = svgNumberAttribute(s6ClaimText, 'textLength');
check('S6 hero claim text stays inside its surrounding panel',
  Number.isFinite(s6ClaimBandWidth) && Number.isFinite(s6ClaimTextLength) && s6ClaimTextLength <= s6ClaimBandWidth - 40,
  `panel width=${s6ClaimBandWidth || 'missing'} text length=${s6ClaimTextLength || 'missing'}`);

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

const mathObjectErrors = [];
for (const [index, object] of mathObjectsDoc.objects.entries())
  validate(object, mathObjectSchema, mathObjectSchema, `math-objects.json.objects[${index}]`, mathObjectErrors);
check('every searchable mathematical object validates against its public schema',
  mathObjectErrors.length === 0, mathObjectErrors.slice(0, 12).join('\n  '));
check('mathematical-object count and stable IDs are internally consistent',
  mathObjectsDoc.count === mathObjectsDoc.objects.length &&
  new Set(mathObjectsDoc.objects.map(object => object.id)).size === mathObjectsDoc.objects.length);
check('every mathematical object resolves to a release and preserves its DOI and status',
  mathObjectsDoc.objects.every(object => {
    const paper = papersDoc.papers.find(candidate => candidate.slug === object.releaseSlug);
    return paper && paper.doi === object.releaseDoi && paper.status === object.releaseStatus &&
      paper.mathObjects.some(candidate => `ep-math:${paper.slug}:${candidate.id}` === object.id);
  }));
check('DOI citation plan contains only canonical, unique Cites relationships',
  citationsDoc.relationType === 'Cites' && citationsDoc.count === citationsDoc.citations.length &&
  new Set(citationsDoc.citations.map(item => `${item.citingDoi.toLowerCase()}|${item.citedDoi.toLowerCase()}`)).size === citationsDoc.citations.length &&
  citationsDoc.citations.every(item => item.relationType === 'Cites' && /^10\.\d{4,9}\//.test(item.citingDoi) && /^10\.\d{4,9}\//.test(item.citedDoi)));

const articleErrors = [];
for (const [index, article] of articlesDoc.articles.entries())
  validate(article, articleSchema, articleSchema, `articles.json.articles[${index}]`, articleErrors);
check('every article validates against the separate public article schema',
  articleErrors.length === 0, articleErrors.slice(0, 12).join('\n  '));
check('article schema is an exact source-to-public copy',
  JSON.stringify(articleSchema) === JSON.stringify(JSON.parse(fs.readFileSync(path.join(ROOT, 'schemas', 'article.schema.json'), 'utf8'))));

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
const publicAtlasProposals = read('api/atlas-proposals.json');
check('Atlas roadmap baseline matches the published source graph',
  publicAtlasRoadmap.currentBaseline.releaseCount === publicResearchGraph.stats.releaseCount &&
  publicAtlasRoadmap.currentBaseline.methodCount === publicResearchGraph.stats.methodCount &&
  publicAtlasRoadmap.currentBaseline.clusterCount === publicResearchGraph.stats.clusterCount &&
  publicAtlasRoadmap.currentBaseline.lineageCount === publicResearchGraph.stats.lineageCount &&
  publicAtlasRoadmap.currentBaseline.acceptedRelationshipCount === publicResearchGraph.stats.edgeCount &&
  publicAtlasRoadmap.currentBaseline.publishedProposalCount === publicAtlasProposals.stats.total);
const predicateCounts = new Map();
for (const edge of publicResearchGraph.edges) predicateCounts.set(edge.predicate, (predicateCounts.get(edge.predicate) || 0) + 1);
const composition = publicAtlasRoadmap.currentBaseline.relationshipComposition;
const directPredicates = ['extends-result', 'reuses-method', 'cites-related-release'];
const directInterReleaseCount = directPredicates.reduce((total, predicate) => total + (predicateCounts.get(predicate) || 0), 0);
check('Atlas roadmap relationship composition matches the published graph',
  composition.usesMethodCount === (predicateCounts.get('uses-method') || 0) &&
  composition.clusterMembershipCount === (predicateCounts.get('member-of-cluster') || 0) &&
  composition.lineageMembershipCount === (predicateCounts.get('member-of-lineage') || 0) &&
  composition.directInterReleaseCount === directInterReleaseCount &&
  composition.defaultProgrammeViewCount === composition.clusterMembershipCount + composition.lineageMembershipCount + directInterReleaseCount);
const methodAssignmentCounts = new Map();
for (const methods of Object.values(operatingArtifacts.registry.releaseAssignments)) {
  for (const methodId of methods) methodAssignmentCounts.set(methodId, (methodAssignmentCounts.get(methodId) || 0) + 1);
}
check('Atlas roadmap method-prevalence observations match the source registry',
  publicAtlasRoadmap.currentBaseline.methodPrevalenceChecks.every(item =>
    methodAssignmentCounts.get(item.methodId) === item.releaseAssignmentCount));
check('Atlas page links its machine-readable roadmap and schema',
  atlasHtml.includes('/api/atlas-roadmap.json') && atlasHtml.includes('/api/schemas/atlas-roadmap.schema.json'));
check('Atlas page surfaces working-taxonomy and reciprocal-lineage limits',
  atlasHtml.includes('working taxonomy') && atlasHtml.includes('A parent link alone is not lineage membership'));
check('Atlas defaults to a first-class direct-links projection',
  atlasHtml.includes('data-atlas-mode="direct" aria-pressed="true">Direct links</button>') &&
  atlasHtml.includes('data-atlas-mode="structure" aria-pressed="false">Research structure</button>'));
check('Atlas keeps agent proposals in a visibly quarantined projection',
  atlasHtml.includes('data-atlas-mode="proposals" aria-pressed="false">Agent proposals (4)</button>') &&
  atlasHtml.includes('Quarantined research proposal register (4)') &&
  atlasHtml.includes('These are suggestions, not accepted relationships or endorsed research priorities.'));
check('Atlas proposal projection has a mobile-fit viewport',
  fs.readFileSync(path.join(DIST, 'assets/js/atlas.js'), 'utf8').includes("state.mode === 'proposals' ? '290 155 620 372'") &&
  fs.readFileSync(path.join(DIST, 'assets/atlas.css'), 'utf8').includes('#atlas-graph[data-atlas-mode="proposals"] { min-width: 0; }'));
check('Atlas proposal API is distinct from the accepted graph',
  publicAtlasProposals.stats.total === 4 && publicResearchGraph.stats.proposedEdgeCount === 0 &&
  publicAtlasProposals.proposals.every(proposal =>
    !publicResearchGraph.edges.some(edge => edge.id === proposal.proposalId)));
check('Atlas publishes GitHub and no-GitHub intake routes',
  atlasHtml.includes('GitHub sign-in required') && atlasHtml.includes('no GitHub account required') &&
  publicAtlasProposals.policy.intakeRoutes.some(route => route.id === 'agentmail-email'));
check('Atlas discloses exact relationship composition above the instrument',
  atlasHtml.includes('261 recorded relationships:') && atlasHtml.includes('10 direct · 15 lineage · 39 cluster · 197 method'));
check('Atlas uses reader-facing source-declared status without changing the machine enum',
  atlasHtml.includes('source-declared') && publicResearchGraph.edges.every(edge => edge.knowledgeStatus === 'asserted'));
check('Atlas publishes deterministic missingness and its non-inference boundary',
  atlasHtml.includes('Registry missingness') &&
  atlasHtml.includes('No edge means that no relationship is currently accepted in the registry; it does not establish that no relationship exists.'));

const releaseOperatingSchema = read('api/schemas/release-operating-model.schema.json');
check('prospective release schema is an exact source-to-public copy',
  sameJson(releaseOperatingSchema, operatingArtifacts.schemas.release));
check('v1 prospective release schema matches the unversioned alias',
  sameJson(read('api/v1/schemas/release-operating-model.schema.json'), releaseOperatingSchema));
check('public v1 keeps operatingModel optional for legacy records',
  schema.$defs.paper.properties.operatingModel && !schema.$defs.paper.required.includes('operatingModel'));
check('additive papers schema version is 1.5', papersDoc.schemaVersion === '1.5');
for (const [name, sourcePath] of [
  ['page-structure-policy.json', 'data/PAGE_STRUCTURE_POLICY.json'],
  ['presentation-events.json', 'data/PRESENTATION_EVENTS.json'],
  ['audio-provenance-status.json', 'data/AUDIO_PROVENANCE_STATUS.json']
]) {
  const source = JSON.parse(fs.readFileSync(path.join(ROOT, sourcePath), 'utf8'));
  const publicRecord = read(`api/${name}`);
  check(`${name} is an exact source-to-public copy`, sameJson(publicRecord, source));
  check(`v1/${name} matches the unversioned alias`, sameJson(read(`api/v1/${name}`), publicRecord));
}
check('every release exposes complete and material correction views without history loss',
  papersDoc.papers.every(paper => {
    const indexes = paper.publicCorrectionIndexes == null
      ? paper.corrections.map((_, index) => index)
      : paper.publicCorrectionIndexes;
    return sameJson(paper.publicCorrections, indexes.map(index => paper.corrections[index]));
  }));
check('all releases declare page maturity and structure provenance',
  papersDoc.papers.every(paper =>
    paper.pageStructureVersion && paper.pageStructureVariant &&
    Array.isArray(paper.pageStructureWaivers) && paper.recordMaturity && paper.metadataProvenance));

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
const releasesWithoutCurrentBriefing = papersDoc.papers
  .filter(paper => !paper.media.some(item => ['audio', 'video'].includes(item.type) && !item.superseded))
  .map(paper => paper.slug);
check('every release has a current audio or video briefing',
  same(releasesWithoutCurrentBriefing, []),
  `missing: ${releasesWithoutCurrentBriefing.join(', ')}`);
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

const articleUrls = articlesDoc.articles.map(article => article.url).sort();
const articleFeed = read('articles/feed.json');
const articleFeedUrls = articleFeed.items.map(item => item.url).sort();
const articleRss = fs.readFileSync(path.join(DIST, 'articles', 'feed.xml'), 'utf8');
check('article count matches the distinct communication-layer records',
  articlesDoc.count === articlesDoc.articles.length && articlesDoc.count >= 1);
check('article JSON Feed exactly matches the article API', same(articleFeedUrls, articleUrls));
check('article RSS lists every article', articleUrls.every(url => articleRss.includes(url)));
check('sitemap lists every article canonical URL', articleUrls.every(url => sitemap.includes(`<loc>${url}</loc>`)));
check('every article canonical URL publishes an article.json record matching the API',
  articlesDoc.articles.every(article => {
    const rel = new URL(article.url).pathname.replace(/^\//, '');
    const record = read(path.join(rel, 'article.json'));
    return sameJson(record, article);
  }));
check('article records expose GitHub browser editing without attributing the repository owner',
  articlesDoc.articles.every(article =>
    article.editUrl.startsWith('https://github.com/ipitchford/evidence-press-site/edit/main/') &&
    article.metadataEditUrl.startsWith('https://github.com/ipitchford/evidence-press-site/edit/main/') &&
    article.byline === 'Evidence Press'));

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
check('release references use a formal ordered References section and citation metadata',
  papersDoc.papers.every(paper => {
    const html = fs.readFileSync(path.join(DIST, 'releases', paper.slug, 'index.html'), 'utf8');
    const metaCount = (html.match(/<meta name="citation_reference"/g) || []).length;
    if (!paper.relatedWorks.length) return metaCount === 0;
    return html.includes('<section class="related" aria-labelledby="references"><h2 id="references">References</h2><ol>') &&
      !html.includes('id="sources-and-related-work"') && metaCount === paper.relatedWorks.length;
  }));

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
check('versioned mathematical-object API exactly matches the unversioned alias',
  sameJson(read('api/v1/math-objects.json'), mathObjectsDoc));
check('versioned mathematical-object schema exactly matches the unversioned alias',
  sameJson(read('api/v1/schemas/math-object.schema.json'), mathObjectSchema));
check('versioned DOI citation plan exactly matches the unversioned alias',
  sameJson(read('api/v1/citations.json'), citationsDoc));
check('versioned papers schema exactly matches the unversioned alias',
  sameJson(read('api/v1/schema.json'), schema));
check('versioned articles API exactly matches the unversioned alias',
  sameJson(read('api/v1/articles.json'), articlesDoc));
check('versioned article schema exactly matches the unversioned alias',
  sameJson(read('api/v1/schemas/article.schema.json'), articleSchema));
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
  !franklHtml.includes('Replaced the original macOS Daniel narration') &&
  frankl.corrections.some(item => item.summary.includes('Replaced the original macOS Daniel narration')) &&
  frankl.publicCorrections.length === 0 &&
  (franklHtml.match(/<audio\b/g) || []).length === 1,
  `audioUrl=${frankl && frankl.audioUrl} sha256=${franklAudioHash}`);
const franklVideo = frankl && frankl.media.find(item => item.type === 'video');
check('Frankl video is API-visible, privacy-enhanced and evidence-calibrated',
  franklVideo && franklVideo.url === 'https://youtu.be/-3yX-m73yKs' &&
  franklVideo.description.includes('not additional mathematical evidence') &&
  (franklHtml.match(/<iframe\b/g) || []).length === 1 &&
  franklHtml.includes('src="https://www.youtube-nocookie.com/embed/-3yX-m73yKs?rel=0"') &&
  franklHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/-3yX-m73yKs/hqdefault.jpg"'),
  `video=${franklVideo && franklVideo.url}`);

const furterR3 = papersDoc.papers.find(p => p.slug === 'furter-r3-through-299');
const furterR3Video = furterR3 && furterR3.media.find(item => item.type === 'video');
const furterR3Html = fs.readFileSync(path.join(DIST, 'releases', 'furter-r3-through-299', 'index.html'), 'utf8');
check('Furter R(3) video is API-visible, privacy-enhanced and evidence-calibrated',
  furterR3Video && furterR3Video.url === 'https://youtu.be/AJhfMzSglR4' &&
  furterR3Video.description.includes('not additional mathematical evidence') &&
  (furterR3Html.match(/<iframe\b/g) || []).length === 1 &&
  furterR3Html.includes('src="https://www.youtube-nocookie.com/embed/AJhfMzSglR4?rel=0"') &&
  furterR3Html.includes('"thumbnailUrl": "https://i.ytimg.com/vi/AJhfMzSglR4/hqdefault.jpg"'),
  `video=${furterR3Video && furterR3Video.url}`);

const txgraffiti = papersDoc.papers.find(p => p.slug === 'txgraffiti-c3-resolution');
const txgraffitiVideo = txgraffiti && txgraffiti.media.find(item => item.type === 'video' && !item.superseded);
const txgraffitiHtml = fs.readFileSync(path.join(DIST, 'releases', 'txgraffiti-c3-resolution', 'index.html'), 'utf8');
check('TxGraffiti video is API-visible, privacy-enhanced and evidence-calibrated',
  txgraffitiVideo && txgraffitiVideo.url === 'https://youtu.be/VgOeBSDjOZU' &&
  txgraffitiVideo.description.includes('not additional mathematical evidence') &&
  (txgraffitiHtml.match(/<iframe\b/g) || []).length === 1 &&
  txgraffitiHtml.includes('src="https://www.youtube-nocookie.com/embed/VgOeBSDjOZU?rel=0"') &&
  txgraffitiHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/VgOeBSDjOZU/hqdefault.jpg"'),
  `video=${txgraffitiVideo && txgraffitiVideo.url}`);

const borderedJacobian = papersDoc.papers.find(p => p.slug === 'bordered-jacobian-foundations');
const borderedJacobianVideo = borderedJacobian && borderedJacobian.media
  .find(item => item.type === 'video' && !item.superseded);
const borderedJacobianHtml = fs.readFileSync(
  path.join(DIST, 'releases', 'bordered-jacobian-foundations', 'index.html'), 'utf8');
check('bordered-Jacobian video is API-visible, privacy-enhanced and evidence-calibrated',
  borderedJacobianVideo && borderedJacobianVideo.url === 'https://youtu.be/0rthBUyVsJY' &&
  borderedJacobianVideo.description.includes('not additional mathematical evidence') &&
  (borderedJacobianHtml.match(/<iframe\b/g) || []).length === 1 &&
  borderedJacobianHtml.includes('src="https://www.youtube-nocookie.com/embed/0rthBUyVsJY?rel=0"') &&
  borderedJacobianHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/0rthBUyVsJY/hqdefault.jpg"'),
  `video=${borderedJacobianVideo && borderedJacobianVideo.url}`);

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

const cyclicityAtlas = papersDoc.papers.find(p => p.slug === 'cyclicity-support-fusion-atlas');
const cyclicityAtlasMeta = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'papers', 'cyclicity-support-fusion-atlas', 'meta.json'), 'utf8'));
const cyclicityAtlasAudioFile = path.join(ROOT, 'assets', 'audio', 'cyclicity-support-fusion-atlas.mp3');
const cyclicityAtlasTranscriptFile = path.join(ROOT, 'assets', 'audio', 'cyclicity-support-fusion-atlas.txt');
const cyclicityAtlasReceiptFile = path.join(ROOT, 'assets', 'audio', 'cyclicity-support-fusion-atlas.provenance.json');
const cyclicityAtlasAudio = fs.readFileSync(cyclicityAtlasAudioFile);
const cyclicityAtlasTranscript = fs.readFileSync(cyclicityAtlasTranscriptFile, 'utf8');
const cyclicityAtlasReceipt = JSON.parse(fs.readFileSync(cyclicityAtlasReceiptFile, 'utf8'));
const cyclicityAtlasAudioHash = crypto.createHash('sha256').update(cyclicityAtlasAudio).digest('hex');
const cyclicityAtlasAudioVersion = cyclicityAtlasAudioHash.slice(0, 10);
const cyclicityAtlasHtml = fs.readFileSync(path.join(
  DIST, 'releases', 'cyclicity-support-fusion-atlas', 'index.html'), 'utf8');
check('cyclicity fusion atlas binds the combined amplitude/Laurent successor and Anonymous scholarship',
  cyclicityAtlas && cyclicityAtlas.version === '0.7.0-candidate' &&
  cyclicityAtlas.doi === '10.5281/zenodo.22049564' &&
  cyclicityAtlas.conceptDoi === '10.5281/zenodo.22036029' &&
  same(cyclicityAtlas.authors, ['Anonymous']) &&
  cyclicityAtlas.status === 'unrefereed-candidate' &&
  cyclicityAtlas.pdfUrl.includes('/releases/download/v0.7.0-candidate/') &&
  cyclicityAtlas.keyResults.some(item => item.includes('every polynomial amplitude') && item.includes('rank zero')) &&
  cyclicityAtlas.keyResults.some(item => item.includes('specified zero-cycle')) &&
  cyclicityAtlas.keyResults.some(item => item.includes('persistent endpoint moments')) &&
  cyclicityAtlas.keyResults.some(item => item.includes('no finite all-Laurent')) &&
  cyclicityAtlas.assurance.find(item => item.dimension === 'formalVerification').state === 'partial' &&
  cyclicityAtlas.assurance.find(item => item.dimension === 'independentRerun').state === 'not-assessed' &&
  cyclicityAtlas.assurance.find(item => item.dimension === 'specialistReview').state === 'not-assessed' &&
  cyclicityAtlas.corrections.some(item => item.scope === 'claim' && item.fixedIn === '0.6.0-candidate') &&
  cyclicityAtlas.corrections.some(item => item.scope === 'claim' && item.fixedIn === '0.7.0-candidate') &&
  cyclicityAtlasHtml.includes('From inverse support to moment channels') &&
  cyclicityAtlasHtml.includes('The polynomial-amplitude support theorem') &&
  cyclicityAtlasHtml.includes('Why there is no finite all-Laurent atlas'),
  `version=${cyclicityAtlas && cyclicityAtlas.version}`);
check('cyclicity fusion atlas audio is version-bound and provenance-complete',
  cyclicityAtlas && cyclicityAtlasMeta.audioVoiceLabel === 'OpenAI API synthetic voice (fable)' &&
  cyclicityAtlasMeta.audioContentVersioned === true &&
  cyclicityAtlas.audioUrl === `https://evidencepress.org/assets/audio/cyclicity-support-fusion-atlas.mp3?v=${cyclicityAtlasAudioVersion}` &&
  cyclicityAtlasTranscript === `${cyclicityAtlasMeta.narration.trim()}\n` &&
  cyclicityAtlasReceipt.provider === 'openai' && cyclicityAtlasReceipt.model === 'gpt-4o-mini-tts' &&
  cyclicityAtlasReceipt.voice === 'fable' && cyclicityAtlasReceipt.audioSha256 === cyclicityAtlasAudioHash &&
  cyclicityAtlasReceipt.audioBytes === cyclicityAtlasAudio.length &&
  (cyclicityAtlasHtml.match(/<audio\b/g) || []).length === 1,
  `audioUrl=${cyclicityAtlas && cyclicityAtlas.audioUrl} sha256=${cyclicityAtlasAudioHash}`);

const cyclicityAtlasVideo = cyclicityAtlas && cyclicityAtlas.media.find(item => item.type === 'video');
check('cyclicity fusion atlas video is API-visible, privacy-enhanced and evidence-calibrated',
  cyclicityAtlasVideo && cyclicityAtlasVideo.url === 'https://youtu.be/FXZpYP9KJ9I' &&
  cyclicityAtlasVideo.name === 'The Fingerprint Coordinate System' &&
  cyclicityAtlasVideo.description.includes('communication aid') &&
  cyclicityAtlasVideo.description.includes('not additional scientific or mathematical evidence') &&
  (cyclicityAtlasHtml.match(/<iframe\b/g) || []).length === 1 &&
  cyclicityAtlasHtml.includes('src="https://www.youtube-nocookie.com/embed/FXZpYP9KJ9I?rel=0"') &&
  cyclicityAtlasHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/FXZpYP9KJ9I/hqdefault.jpg"'),
  `video=${cyclicityAtlasVideo && cyclicityAtlasVideo.url}`);

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
const sfsAudio = sfsAudit && sfsAudit.media.find(item => item.type === 'audio');
const sfsVideo = sfsAudit && sfsAudit.media.find(item => item.type === 'video');
check('SFS correction binds v0.3.3, Anonymous scholarship and additive history',
  sfsAudit && sfsAudit.version === '0.3.3-candidate' &&
  sfsAudit.doi === '10.5281/zenodo.22029532' &&
  same(sfsAudit.authors, ['Anonymous']) &&
  sfsAudit.corrections.length === 6 &&
  sfsAudit.provenance.humanRole.includes('not scholarly authorship'),
  `version=${sfsAudit && sfsAudit.version} doi=${sfsAudit && sfsAudit.doi}`);
check('SFS corrected audio and Open Graph card are content-versioned',
  sfsAudit &&
  sfsAudit.audioUrl === `https://evidencepress.org/assets/audio/sfs-identifiability-audit.mp3?v=${sfsAudioVersion}` &&
  sfsAudit.imageUrl === `https://evidencepress.org/assets/og/sfs-identifiability-audit.png?v=${sfsOgVersion}` &&
  sfsHtml.includes(`property="og:image" content="https://evidencepress.org/assets/og/sfs-identifiability-audit.png?v=${sfsOgVersion}"`),
  `audio=${sfsAudit && sfsAudit.audioUrl} image=${sfsAudit && sfsAudit.imageUrl}`);
check('SFS current video is API-visible, privacy-enhanced and evidence-calibrated',
  sfsAudio && sfsAudio.url === 'https://evidencepress.org/assets/audio/sfs-identifiability-audit.mp3' &&
  sfsVideo && sfsVideo.url === 'https://youtu.be/5_cYy6CoGas' &&
  sfsVideo.name === 'The Mathematical Collision of Genetic History' &&
  sfsVideo.description.includes('communication aid') &&
  sfsVideo.description.includes('not additional scientific evidence') &&
  (sfsHtml.match(/<iframe\b/g) || []).length === 1 &&
  sfsHtml.includes('src="https://www.youtube-nocookie.com/embed/5_cYy6CoGas?rel=0"') &&
  sfsHtml.includes('"thumbnailUrl": "https://i.ytimg.com/vi/5_cYy6CoGas/hqdefault.jpg"') &&
  !sfsHtml.includes('iBTcQ1Qjl_g') && !sfsHtml.includes('QgBD6f_EGDo'),
  `media=${JSON.stringify(sfsAudit && sfsAudit.media)}`);
check('SFS public assurance does not promote same-producer diversity to independent reimplementation',
  sfsAudit && sfsAudit.assurance.find(item => item.dimension === 'independentReimplementation').state === 'not-assessed' &&
  sfsAudit.verification.independentlyReproduced === false &&
  sfsHtml.includes('same-producer expected-SFS forward routes') &&
  sfsHtml.includes('does not adjudicate the proposed ancient human bottleneck'),
  'expected not-assessed independent reimplementation and exact expected-summary boundary');
check('SFS narration transcript exactly matches the corrected metadata source',
  fs.readFileSync(path.join(ROOT, 'assets', 'audio', 'sfs-identifiability-audit.txt'), 'utf8').trim() === sfsMeta.narration.trim() &&
  sfsMeta.narration.split(/\s+/).length >= 160 && sfsMeta.narration.split(/\s+/).length <= 300,
  `words=${sfsMeta.narration.split(/\s+/).length}`);
check('SFS scholarly JSON-LD represents Anonymous and excludes the maintainer as author',
  sfsHtml.includes('"author": [') && sfsHtml.includes('"@type": "Organization"') &&
  sfsHtml.includes('"name": "Anonymous"') &&
  !sfsHtml.includes('"name": "Ian Pitchford"'),
  'expected Anonymous creator and no maintainer scholarly author');

const rechtRe = papersDoc.papers.find(p => p.slug === 'exact-low-length-recht-re-inequalities');
const rechtReMeta = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'papers', 'exact-low-length-recht-re-inequalities', 'meta.json'), 'utf8'));
const rechtReHtml = fs.readFileSync(
  path.join(DIST, 'releases', 'exact-low-length-recht-re-inequalities', 'index.html'), 'utf8');
const rechtReAudioFile = path.join(ROOT, 'assets', 'audio', 'exact-low-length-recht-re-inequalities.mp3');
const rechtReOgFile = path.join(ROOT, 'assets', 'og', 'exact-low-length-recht-re-inequalities.png');
const rechtReAudioVersion = crypto.createHash('sha256').update(fs.readFileSync(rechtReAudioFile)).digest('hex').slice(0, 10);
const rechtReOgVersion = crypto.createHash('sha256').update(fs.readFileSync(rechtReOgFile)).digest('hex').slice(0, 10);
check('Recht–Ré successor binds both current manuscripts and the additive public identity',
  rechtRe && rechtRe.version === '1.1.1-candidate' &&
  rechtRe.doi === '10.5281/zenodo.22037371' &&
  rechtRe.conceptDoi === '10.5281/zenodo.21709238' &&
  rechtRe.pdfUrl.endsWith('/exact-low-length-recht-re-inequalities-v1.1.1-candidate.pdf') &&
  rechtRe.altPdfUrl.endsWith('/metric-aware-sampling-dynamics-v1.1.1-candidate.pdf') &&
  rechtRe.altPdfLabel === 'Read the dynamics paper (PDF)' &&
  rechtReHtml.includes('Read the dynamics paper (PDF)'),
  `version=${rechtRe && rechtRe.version} doi=${rechtRe && rechtRe.doi}`);
check('Recht–Ré ordered-product definition is machine-bound to the corrected formula',
  rechtRe && rechtRe.orderedProductAverage &&
  rechtRe.orderedProductAverage.indexing === 'ordered-distinct-tuples' &&
  rechtRe.orderedProductAverage.termCount === '(n)_m' &&
  rechtRe.orderedProductAverage.normalizationDenominator === '(n)_m' &&
  rechtReHtml.includes('\\frac{1}{(n)_m}') &&
  !rechtReHtml.includes('\\frac{1}{\\binom{n}{m}}') &&
  rechtRe.corrections.some(c => c.date === '2026-08-20' && c.scope === 'presentation'),
  `definition=${JSON.stringify(rechtRe && rechtRe.orderedProductAverage)}`);
check('Recht–Ré audio and Open Graph card are content-versioned',
  rechtRe &&
  rechtRe.audioUrl === `https://evidencepress.org/assets/audio/exact-low-length-recht-re-inequalities.mp3?v=${rechtReAudioVersion}` &&
  rechtRe.imageUrl === `https://evidencepress.org/assets/og/exact-low-length-recht-re-inequalities.png?v=${rechtReOgVersion}` &&
  rechtReHtml.includes(`property="og:image" content="https://evidencepress.org/assets/og/exact-low-length-recht-re-inequalities.png?v=${rechtReOgVersion}"`),
  `audio=${rechtRe && rechtRe.audioUrl} image=${rechtRe && rechtRe.imageUrl}`);
const rechtReCurrentVideo = rechtRe && rechtRe.media.find(item => item.type === 'video' && !item.superseded);
const rechtReHistoricalVideo = rechtRe && rechtRe.media.find(item => item.type === 'video' && item.superseded === true);
check('Recht–Ré current media are provenance-bound and the old video remains historical',
  fs.readFileSync(path.join(ROOT, 'assets', 'audio', 'exact-low-length-recht-re-inequalities.txt'), 'utf8').trim() === rechtReMeta.narration.trim() &&
  rechtReMeta.narration.split(/\s+/).length >= 160 && rechtReMeta.narration.split(/\s+/).length <= 300 &&
  rechtReCurrentVideo && rechtReCurrentVideo.url === 'https://youtu.be/cqAHOnQwpFE' &&
  rechtReCurrentVideo.description.includes('not additional scientific or mathematical evidence') &&
  rechtReHistoricalVideo && rechtReHistoricalVideo.url === 'https://youtu.be/PXBlZLk753g' &&
  (rechtReHtml.match(/<iframe\b/g) || []).length === 2 &&
  rechtReHtml.includes('src="https://www.youtube-nocookie.com/embed/cqAHOnQwpFE?rel=0"') &&
  rechtReHtml.includes('src="https://www.youtube-nocookie.com/embed/PXBlZLk753g?rel=0"') &&
  rechtReHtml.includes('<strong>Watch this briefing</strong>') &&
  rechtReHtml.includes('Video briefing — The Metric Reversal: exact boundaries of the Recht–Ré inequality') &&
  rechtReHtml.includes('Superseded briefing:') &&
  rechtReHtml.includes('not the current release summary') &&
  rechtRe.corrections.some(c => c.date === '2026-08-22' && c.scope === 'presentation'),
  `words=${rechtReMeta.narration.split(/\s+/).length} current=${rechtReCurrentVideo && rechtReCurrentVideo.url}`);
check('Recht–Ré assurance preserves the internal-versus-independent boundary',
  rechtRe &&
  rechtRe.assurance.find(item => item.dimension === 'availability').state === 'passed' &&
  rechtRe.assurance.find(item => item.dimension === 'internalReplay').state === 'passed' &&
  rechtRe.assurance.find(item => item.dimension === 'independentRerun').state === 'not-assessed' &&
  rechtRe.assurance.find(item => item.dimension === 'independentReimplementation').state === 'not-assessed' &&
  rechtRe.verification.independentlyReproduced === false &&
  rechtRe.verification.peerReviewed === false,
  'expected public availability/internal replay without independent or editorial promotion');

const affineFinite = papersDoc.papers.find(p => p.slug === 'finite-sample-affine-diversification');
const affineFiniteMeta = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'papers', 'finite-sample-affine-diversification', 'meta.json'), 'utf8'));
const affineFiniteHtml = fs.readFileSync(path.join(
  DIST, 'releases', 'finite-sample-affine-diversification', 'index.html'), 'utf8');
const affineFiniteAudioFile = path.join(ROOT, 'assets', 'audio', 'finite-sample-affine-diversification.mp3');
const affineFiniteReceipt = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'assets', 'audio', 'finite-sample-affine-diversification.provenance.json'), 'utf8'));
const affineFiniteAudioHash = crypto.createHash('sha256').update(fs.readFileSync(affineFiniteAudioFile)).digest('hex');
check('finite-sample affine successor binds its immutable identity and Anonymous authorship',
  affineFinite && affineFinite.version === '0.3.0-candidate-r2' &&
  affineFinite.doi === '10.5281/zenodo.22041054' &&
  affineFinite.conceptDoi === '10.5281/zenodo.21851318' &&
  same(affineFinite.authors, ['Anonymous']) &&
  affineFinite.status === 'unrefereed-candidate' &&
  affineFinite.pdfUrl.includes('/releases/download/v0.3.0-candidate-r2/') &&
  affineFiniteHtml.includes('Finite-Sample Signal Uncertainty'),
  `version=${affineFinite && affineFinite.version} doi=${affineFinite && affineFinite.doi}`);
check('finite-sample affine successor publishes the failed H4 gate without broad-utility promotion',
  affineFinite &&
  affineFinite.keyResults.some(item => item.includes('532 of 3,840') && item.includes('H4 utility gate')) &&
  affineFinite.keyResults.some(item => item.includes('prohibits claims') && item.includes('must-have')) &&
  affineFiniteHtml.includes('13.854%') && affineFiniteHtml.includes('<strong>H4 failed</strong>') &&
  affineFiniteHtml.includes('does not claim that the affine method is a must-have') &&
  affineFiniteHtml.includes('measured decision impact') && affineFiniteHtml.includes('fell short of its preregistered target'),
  'expected exact failed-gate result and no must-have claim');
check('finite-sample affine assurance remains producer-side and unrefereed',
  affineFinite &&
  affineFinite.assurance.find(item => item.dimension === 'availability').state === 'passed' &&
  affineFinite.assurance.find(item => item.dimension === 'internalReplay').state === 'passed' &&
  affineFinite.assurance.find(item => item.dimension === 'independentRerun').state === 'not-assessed' &&
  affineFinite.assurance.find(item => item.dimension === 'independentReimplementation').state === 'not-assessed' &&
  affineFinite.assurance.find(item => item.dimension === 'specialistReview').state === 'not-assessed' &&
  affineFinite.assurance.find(item => item.dimension === 'editorialPeerReview').state === 'not-assessed' &&
  affineFinite.verification.independentlyReproduced === false && affineFinite.verification.peerReviewed === false,
  'expected public availability/internal replay without external assurance');
check('finite-sample affine audio is transcript- and byte-bound',
  fs.readFileSync(path.join(ROOT, 'assets', 'audio', 'finite-sample-affine-diversification.txt'), 'utf8') ===
    `${affineFiniteMeta.narration.trim()}\n` &&
  affineFiniteReceipt.provider === 'openai' && affineFiniteReceipt.model === 'gpt-4o-mini-tts' &&
  affineFiniteReceipt.voice === 'fable' && affineFiniteReceipt.audioSha256 === affineFiniteAudioHash &&
  affineFiniteReceipt.audioBytes === fs.statSync(affineFiniteAudioFile).size &&
  (affineFiniteHtml.match(/<audio\b/g) || []).length === 1,
  `audioSha256=${affineFiniteAudioHash}`);

/* ---------------------------------------- programme visual hierarchy */
const imageSources = rel => [...fs.readFileSync(path.join(DIST, rel), 'utf8')
  .matchAll(/<img\s+[^>]*src="([^"]+)"[^>]*>/g)].map(match => match[1]);
const productivityImages = imageSources('productivity/index.html');
const starterImages = imageSources('protocols/start/index.html');
const expectedProductivityImages = [
  '/assets/video-thumbs/certified-commitment-horizons.jpg',
  '/assets/video-thumbs/certified-three-item-jrp-gap.jpg',
  '/assets/art/protocols-ladders.svg'
];
check('Productivity keeps its intentional explanatory image set',
  same(productivityImages, expectedProductivityImages),
  `images=${productivityImages.join(',') || 'none'}`);
const productivityHtml = fs.readFileSync(path.join(DIST, 'productivity', 'index.html'), 'utf8');
check('Productivity highlights both logistics research lineages',
  productivityHtml.includes('href="/releases/certified-commitment-horizons/"') &&
  productivityHtml.includes('href="/releases/certified-two-item-jrp/"') &&
  productivityHtml.includes('href="/releases/certified-three-item-jrp-gap/"'),
  'expected canonical links to the commitment release and both replenishment generations');
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
  productivityHtml.includes('href="https://youtu.be/ikaliZ25P8I"') &&
  productivityHtml.includes('src="/assets/video-thumbs/certified-three-item-jrp-gap.jpg"') &&
  productivityHtml.includes('href="https://youtu.be/3KLjS1eXaps"') &&
  productivityHtml.includes('href="https://youtu.be/n9SbpLgjOY4"'),
  'expected current thumbnail and video pairs plus the foundational two-item briefing');
check('Published Productivity thumbnails exactly match their reproducible sources',
  expectedProductivityImages.slice(0, 2).every(rel => {
    const filename = path.basename(rel);
    return fs.readFileSync(path.join(DIST, rel)).equals(fs.readFileSync(path.join(ROOT, 'thumbs', filename)));
  }),
  'expected byte-identical thumbs/ to dist/assets/video-thumbs/ copies');
const commitmentVideos = papersDoc.papers.find(p => p.slug === 'certified-commitment-horizons').media
  .filter(item => item.type === 'video');
const commitmentHtml = fs.readFileSync(
  path.join(DIST, 'releases', 'certified-commitment-horizons', 'index.html'), 'utf8');
const jointVideo = papersDoc.papers.find(p => p.slug === 'certified-two-item-jrp').media
  .find(item => item.type === 'video');
check('Release surfaces expose only the current commitment-horizons video',
  commitmentVideos.length === 1 &&
  commitmentVideos[0].url === 'https://youtu.be/ikaliZ25P8I' &&
  commitmentHtml.includes('ikaliZ25P8I') &&
  !commitmentHtml.includes('G4ehJ81pl6g') &&
  !commitmentHtml.includes('retained and explicitly labelled as historical presentation media') &&
  jointVideo && jointVideo.url === 'https://youtu.be/n9SbpLgjOY4',
  `commitment=${commitmentVideos.map(item => item.url).join(',') || 'none'} joint=${jointVideo && jointVideo.url}`);
check('company starter owns the staged-learning cover',
  starterImages.length === 1 && starterImages[0] === '/assets/art/productivity.svg',
  `images=${starterImages.join(',') || 'none'}`);

console.log(failures === 0
  ? '\nALL METADATA TESTS PASSED'
  : `\n${failures} METADATA TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
