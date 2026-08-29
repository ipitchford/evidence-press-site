#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  loadRelationshipArtifacts,
  buildResearchGraph,
  validateResearchGraph,
  validateRelationshipRegistry,
  buildReleaseIdentityIndex,
  internalReleaseSlug,
  normalizeDoiReference,
  edgeId
} = require('./research-graph');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://evidencepress.org';
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'METHOD_REGISTRY.json'), 'utf8'));
const relationshipArtifacts = loadRelationshipArtifacts(ROOT);
const registryErrors = validateRelationshipRegistry(relationshipArtifacts.registry);
const papers = fs.readdirSync(path.join(ROOT, 'papers'))
  .filter(slug => fs.existsSync(path.join(ROOT, 'papers', slug, 'meta.json')))
  .map(slug => ({ slug, ...JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', slug, 'meta.json'), 'utf8')) }));
const doiFixture = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', 'research-graph', 'internal-doi-relations.json'), 'utf8'));
const releaseIdentityIndex = buildReleaseIdentityIndex(papers);
const expectedCitationCount = papers.reduce((count, paper) => count + (paper.relatedWorks || []).filter(work => {
  const slug = internalReleaseSlug(work.url, BASE, releaseIdentityIndex);
  return slug && slug !== paper.slug && papers.some(candidate => candidate.slug === slug);
}).length, 0);
const expectedParentCount = papers.reduce((count, paper) => count +
  (((paper.operatingModel || {}).parentLinks || []).filter(parent => parent.legacyReleaseSlug).length), 0);

let failures = 0;
function ok(condition, label, detail = '') {
  if (condition) console.log(`ok      ${label}`);
  else { failures++; console.log(`FAIL    ${label}${detail ? ` — ${detail}` : ''}`); }
}

const graph = buildResearchGraph({
  papers,
  methodRegistry: registry,
  relationshipRegistry: relationshipArtifacts.registry,
  baseUrl: BASE,
  sourceCommit: '0'.repeat(40),
  sourceDate: '2026-08-15T12:00:00Z'
});
const errors = validateResearchGraph(graph, { relationshipRegistry: relationshipArtifacts.registry });
ok(registryErrors.length === 0, 'relationship registry passes its policy validator', registryErrors.join('; '));
const ambiguousRegistry = JSON.parse(JSON.stringify(relationshipArtifacts.registry));
ambiguousRegistry.predicates.push({ ...ambiguousRegistry.predicates[0] });
ok(validateRelationshipRegistry(ambiguousRegistry).some(error => error.includes('duplicates')),
  'negative control rejects a duplicate predicate identity');
ok(errors.length === 0, 'generated graph passes structural and referential validation', errors.join('; '));
ok(graph.stats.releaseCount === papers.length, 'every release is represented exactly once');
ok(graph.stats.methodCount === registry.methods.length, 'every registered method is represented');
ok(graph.stats.clusterCount === registry.methodClusters.length, 'every broad cluster is represented');
ok(graph.stats.lineageCount === registry.lineages.length, 'every evidence-backed lineage is represented');
ok(graph.stats['uses-methodEdgeCount'] === Object.values(registry.releaseAssignments).flat().length,
  'every method assignment becomes one edge');
ok(graph.stats.directInterReleaseEdgeCount === expectedCitationCount + expectedParentCount,
  'direct inter-release projection is derived from every resolvable citation and parent record');
ok(doiFixture.every(expected => graph.edges.some(edge =>
  edge.source === `release:${expected.source}` &&
  edge.target === `release:${expected.target}` &&
  edge.predicate === 'cites-related-release' &&
  edge.sourceRefs.some(ref => ref.endsWith(`/relatedWorks/${expected.relatedWorkIndex}`)))),
  'regression fixture preserves every exact DOI-backed inter-release citation');
ok(doiFixture.every(expected => normalizeDoiReference(`https://doi.org/${expected.doi}`) === expected.doi),
  'DOI fixture normalization is exact and case-stable');
ok(internalReleaseSlug('https://doi.org/10.5281/zenodo.21647645-extra', BASE, releaseIdentityIndex) === null,
  'hostile near-match DOI does not resolve to an internal release');
ok(graph.stats.edgeCount === graph.stats['uses-methodEdgeCount'] + graph.stats['member-of-clusterEdgeCount'] +
  graph.stats['member-of-lineageEdgeCount'] + graph.stats.directInterReleaseEdgeCount,
  'relationship composition reconciles exactly with the accepted edge total');
ok(registry.methods.every(method => graph.nodes.find(node => node.id === `method:${method.id}`).releaseAssignmentCount ===
  Object.values(registry.releaseAssignments).filter(assignments => assignments.includes(method.id)).length),
  'method nodes expose registry-derived prevalence without frozen corpus totals');
ok(graph.nodes.find(node => node.id === 'method:research-lineage-reuse').publicLabel === 'Lineage-aware reuse practice',
  'public method terminology distinguishes reuse practice from evidence-backed lineage');
ok(graph.nodes.filter(node => node.type === 'method' && node.umbrellaMethod).every(node =>
  node.releaseAssignmentCount / node.releaseAssignmentDenominator >= 0.5),
  'umbrella-method labels follow the documented majority threshold');
ok(graph.stats.clusterSeedCount === graph.nodes.filter(node => node.scopeStatus === 'cluster-seed').length,
  'singleton cluster seeds are explicitly and consistently labelled');
ok(graph.stats.releasesWithoutDirectInterReleaseEdgeCount === graph.nodes.filter(node =>
  node.type === 'release' && node.directInterReleaseDegree === 0).length,
  'direct-link missingness reconciles with release node degrees');
ok(graph.stats.proposedEdgeCount === 0 && graph.proposalRegister.relations.length === 0,
  'first release publishes no speculative relationships');
ok(graph.edges.every(edge => edge.knowledgeStatus !== 'proposed'),
  'accepted edge array excludes proposals');
ok(graph.edges.every(edge => edge.sourceRefs.length && edge.basis && edge.inferenceLimit),
  'every accepted edge exposes basis, source and inference limit');
ok(graph.nodes.filter(node => node.type === 'release').every(node => /^sha256:[0-9a-f]{64}$/.test(node.statementFingerprint)),
  'every release statement has a content fingerprint');
ok(graph.edges.every(edge => edge.id === edgeId(edge)), 'every edge id is content-derived');

const corrupt = JSON.parse(JSON.stringify(graph));
corrupt.edges[0].target = 'release:not-a-real-release';
ok(validateResearchGraph(corrupt).some(error => error.includes('does not resolve')),
  'negative control rejects an unresolved endpoint');
const promoted = JSON.parse(JSON.stringify(graph));
promoted.edges[0].knowledgeStatus = 'proposed';
promoted.edges[0].id = edgeId(promoted.edges[0]);
ok(validateResearchGraph(promoted).some(error => error.includes('must not appear')),
  'negative control rejects a proposed edge in the accepted graph');
const unhashed = JSON.parse(JSON.stringify(graph));
unhashed.edges[0].basis += ' silently changed';
ok(validateResearchGraph(unhashed).some(error => error.includes('content-derived identity')),
  'negative control rejects an edge changed without a new identity');
const staleMissingness = JSON.parse(JSON.stringify(graph));
staleMissingness.stats.releasesWithoutDirectInterReleaseEdgeCount++;
ok(validateResearchGraph(staleMissingness).some(error => error.includes('does not match release node degrees')),
  'negative control rejects stale direct-link missingness');
const falseUmbrella = JSON.parse(JSON.stringify(graph));
falseUmbrella.nodes.find(node => node.type === 'method').umbrellaMethod =
  !falseUmbrella.nodes.find(node => node.type === 'method').umbrellaMethod;
ok(validateResearchGraph(falseUmbrella).some(error => error.includes('umbrellaMethod does not match')),
  'negative control rejects a false umbrella-method label');
const inventedSearchCoverage = JSON.parse(JSON.stringify(graph));
inventedSearchCoverage.stats.unsearchedAreaRegisterCount = 1;
ok(validateResearchGraph(inventedSearchCoverage).some(error => error.includes('bounded search-area register')),
  'negative control rejects invented hidden-relationship search coverage');

if (process.argv.includes('--built')) {
  const dist = path.join(ROOT, 'dist');
  const publicGraph = JSON.parse(fs.readFileSync(path.join(dist, 'api', 'research-graph.json'), 'utf8'));
  const versionedGraph = JSON.parse(fs.readFileSync(path.join(dist, 'api', 'v1', 'research-graph.json'), 'utf8'));
  const atlasGraph = JSON.parse(fs.readFileSync(path.join(dist, 'atlas', 'index.json'), 'utf8'));
  const publicRegistry = JSON.parse(fs.readFileSync(path.join(dist, 'api', 'relationship-registry.json'), 'utf8'));
  const versionedRegistry = JSON.parse(fs.readFileSync(path.join(dist, 'api', 'v1', 'relationship-registry.json'), 'utf8'));
  const publicSchema = JSON.parse(fs.readFileSync(path.join(dist, 'api', 'schemas', 'research-graph.schema.json'), 'utf8'));
  const versionedSchema = JSON.parse(fs.readFileSync(path.join(dist, 'api', 'v1', 'schemas', 'research-graph.schema.json'), 'utf8'));
  const publicRegistrySchema = JSON.parse(fs.readFileSync(path.join(dist, 'api', 'schemas', 'relationship-registry.schema.json'), 'utf8'));
  const versionedRegistrySchema = JSON.parse(fs.readFileSync(path.join(dist, 'api', 'v1', 'schemas', 'relationship-registry.schema.json'), 'utf8'));
  const atlasHtml = fs.readFileSync(path.join(dist, 'atlas', 'index.html'), 'utf8');
  const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  ok(validateResearchGraph(publicGraph, { relationshipRegistry: relationshipArtifacts.registry }).length === 0,
    'built public graph passes the same validator');
  ok(same(publicGraph, versionedGraph), 'versioned graph API matches its unversioned alias');
  ok(same(publicGraph, atlasGraph), 'atlas JSON matches the graph API exactly');
  ok(same(publicRegistry, relationshipArtifacts.registry), 'public relationship registry is an exact source copy');
  ok(same(publicRegistry, versionedRegistry), 'versioned relationship registry matches its unversioned alias');
  ok(same(publicSchema, relationshipArtifacts.schema), 'public research-graph schema is an exact source copy');
  ok(same(publicSchema, versionedSchema), 'versioned research-graph schema matches its unversioned alias');
  ok(same(publicRegistrySchema, relationshipArtifacts.registrySchema), 'public relationship-registry schema is an exact source copy');
  ok(same(publicRegistrySchema, versionedRegistrySchema), 'versioned relationship-registry schema matches its unversioned alias');
  ok((atlasHtml.match(/data-atlas-edge-row=/g) || []).length === publicGraph.edges.length,
    'server-rendered relationship register contains every accepted edge');
  ok(atlasHtml.includes('/assets/js/atlas.js?v=') && /\/assets\/atlas-[a-f0-9]{10}\.css/.test(atlasHtml),
    'atlas page loads versioned graph script and content-addressed stylesheet');
}

console.log(failures === 0 ? '\nALL RESEARCH GRAPH TESTS PASSED' : `\n${failures} RESEARCH GRAPH TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
