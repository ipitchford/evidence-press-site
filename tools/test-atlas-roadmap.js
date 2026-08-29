#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { loadAtlasRoadmap, validateAtlasRoadmap } = require('./atlas-roadmap');
const { loadRelationshipArtifacts, buildResearchGraph } = require('./research-graph');
const { loadAtlasProposals } = require('./atlas-proposals');

const ROOT = path.join(__dirname, '..');
const { roadmap } = loadAtlasRoadmap(ROOT);
const methodRegistry = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'METHOD_REGISTRY.json'), 'utf8'));
const papers = fs.readdirSync(path.join(ROOT, 'papers'))
  .filter(slug => fs.existsSync(path.join(ROOT, 'papers', slug, 'meta.json')))
  .map(slug => ({ slug, ...JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', slug, 'meta.json'), 'utf8')) }));
const graph = buildResearchGraph({
  papers,
  methodRegistry,
  relationshipRegistry: loadRelationshipArtifacts(ROOT).registry,
  baseUrl: 'https://evidencepress.org',
  sourceCommit: '0'.repeat(40),
  sourceDate: '2026-08-29T00:00:00Z'
});
const proposalRegister = loadAtlasProposals(ROOT, graph).register;
const current = { graph, proposalRegister };
let failures = 0;
function ok(condition, label) {
  if (condition) console.log(`ok      ${label}`);
  else { failures++; console.log(`FAIL    ${label}`); }
}

ok(validateAtlasRoadmap(roadmap, current).length === 0,
  'canonical Atlas roadmap passes structural and live corpus-baseline validation');

const dangling = JSON.parse(JSON.stringify(roadmap));
dangling.nextSteps[1].dependencies = ['atlas-step-does-not-exist'];
ok(validateAtlasRoadmap(dangling).some(error => error.includes('unresolved dependency')),
  'negative control rejects a dangling roadmap dependency');

const cyclic = JSON.parse(JSON.stringify(roadmap));
cyclic.nextSteps[0].dependencies = ['atlas-step-discovery-pilot'];
ok(validateAtlasRoadmap(cyclic).some(error => error.includes('dependency cycle')),
  'negative control rejects a roadmap dependency cycle');

const duplicate = JSON.parse(JSON.stringify(roadmap));
duplicate.nextSteps[1].id = duplicate.nextSteps[0].id;
ok(validateAtlasRoadmap(duplicate).some(error => error.includes('duplicates id')),
  'negative control rejects duplicate roadmap step identities');

const reordered = JSON.parse(JSON.stringify(roadmap));
reordered.nextSteps[1].priority = 0;
ok(validateAtlasRoadmap(reordered).some(error => error.includes('strictly increasing priority')),
  'negative control rejects priority-order drift');

const staleProposalBaseline = JSON.parse(JSON.stringify(roadmap));
staleProposalBaseline.currentBaseline.publishedProposalCount = 0;
ok(validateAtlasRoadmap(staleProposalBaseline).some(error => error.includes('at least one published proposal')),
  'negative control rejects completed intake with a stale zero-proposal baseline');

const prematureDiscovery = JSON.parse(JSON.stringify(roadmap));
prematureDiscovery.nextSteps.find(step => step.id === 'atlas-step-proposal-intake').state = 'ready';
ok(validateAtlasRoadmap(prematureDiscovery).some(error => error.includes('cannot be ready')),
  'negative control rejects ready discovery before intake completion');

const staleRelationshipBaseline = JSON.parse(JSON.stringify(roadmap));
staleRelationshipBaseline.currentBaseline.acceptedRelationshipCount--;
ok(validateAtlasRoadmap(staleRelationshipBaseline, current).some(error => error.includes('acceptedRelationshipCount is stale')),
  'negative control rejects a relationship total stale against the generated graph');

const stalePrevalence = JSON.parse(JSON.stringify(roadmap));
stalePrevalence.currentBaseline.methodPrevalenceChecks[0].releaseAssignmentCount--;
ok(validateAtlasRoadmap(stalePrevalence, current).some(error => error.includes('is stale for')),
  'negative control rejects hard-coded method prevalence drift');

console.log(failures ? `\n${failures} ATLAS ROADMAP TEST(S) FAILED` : '\nALL ATLAS ROADMAP TESTS PASSED');
process.exitCode = failures ? 1 : 0;
