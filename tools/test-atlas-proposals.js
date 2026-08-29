#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  loadRelationshipArtifacts,
  buildResearchGraph
} = require('./research-graph');
const {
  expectedProposalId,
  expectedReceiptId,
  loadAtlasProposals,
  validateProposal,
  validateRegister
} = require('./atlas-proposals');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://evidencepress.org';
const methodRegistry = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'METHOD_REGISTRY.json'), 'utf8'));
const relationshipRegistry = loadRelationshipArtifacts(ROOT).registry;
const papers = fs.readdirSync(path.join(ROOT, 'papers'))
  .filter(slug => fs.existsSync(path.join(ROOT, 'papers', slug, 'meta.json')))
  .map(slug => ({ slug, ...JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', slug, 'meta.json'), 'utf8')) }));
const graph = buildResearchGraph({
  papers, methodRegistry, relationshipRegistry, baseUrl: BASE,
  sourceCommit: '0'.repeat(40), sourceDate: '2026-08-15T12:00:00Z'
});

let failures = 0;
function ok(condition, label, detail = '') {
  if (condition) console.log(`ok      ${label}`);
  else { failures++; console.log(`FAIL    ${label}${detail ? ` — ${detail}` : ''}`); }
}

const loaded = loadAtlasProposals(ROOT, graph);
ok(loaded.errors.length === 0, 'canonical proposal files pass semantic validation', loaded.errors.join('; '));
ok(loaded.register && validateRegister(loaded.register).length === 0,
  'assembled proposal register has a content-derived identity');
const proposalSourceCount = fs.readdirSync(path.join(ROOT, 'data', 'atlas-proposals'))
  .filter(name => name.endsWith('.json')).length;
ok(loaded.proposals.length === proposalSourceCount && loaded.register.stats.total === proposalSourceCount,
  'every quarantined research-proposal source file is counted exactly once');
ok(loaded.register.stats.byState['awaiting-review'] === 1 &&
  loaded.register.stats.byState.deferred === 1 &&
  loaded.register.stats.byState.merged === 2 &&
  loaded.proposals.reduce((sum, proposal) => sum + proposal.decisionReceipts.length, 0) === 3,
  'review receipts expose one retained question, one deferral and two merged tips');
const originalDecisionProposal = loaded.proposals.find(proposal =>
  proposal.title === 'Decision sufficiency on observation fibres');
ok(originalDecisionProposal.currentState === 'deferred' &&
  originalDecisionProposal.decisionReceipts.length === 1 &&
  originalDecisionProposal.decisionReceipts[0].fromState === 'awaiting-review',
  'antecedent warning defers the original programme through an append-only receipt');
const retainedQuestion = loaded.proposals.find(proposal =>
  proposal.title === 'Is the Recht-Re metric reversal a target-sufficiency failure?');
ok(retainedQuestion.currentState === 'awaiting-review' && retainedQuestion.decisionReceipts.length === 0,
  'unresolved Recht-Re comparison remains quarantined without a review decision');
ok(loaded.proposals.every(proposal =>
  !graph.edges.some(edge => edge.id === proposal.proposalId) &&
  !graph.nodes.some(node => node.id === proposal.proposalId)),
  'proposal identities are absent from the accepted graph');
ok([91, 92, 93].every(number => loaded.proposals.some(proposal =>
  proposal.submitter.contactUrl === `https://github.com/ipitchford/evidence-press-site/issues/${number}` &&
  proposal.sourceRefs.includes(`https://github.com/ipitchford/evidence-press-site/issues/${number}`))),
  'all three GitHub intake records retain their public issue provenance');
ok(loaded.policy.intakeRoutes.some(route => route.id === 'github-issue-form') &&
  loaded.policy.intakeRoutes.some(route => route.id === 'agentmail-email' && route.url.startsWith('mailto:')),
  'proposal policy supports GitHub and no-GitHub email intake routes');

const policy = loaded.policy;
const canonical = retainedQuestion;
function errorsFor(mutator, rehash = false) {
  const proposal = JSON.parse(JSON.stringify(canonical));
  mutator(proposal);
  if (rehash) proposal.proposalId = expectedProposalId(proposal);
  return validateProposal(proposal, { policy, graph, root: ROOT });
}

ok(errorsFor(proposal => { proposal.question += ' Mutated without a new identity.'; })
  .some(error => error.includes('proposalId does not match')),
  'negative control rejects silent mutation of immutable proposal content');
ok(errorsFor(proposal => { proposal.atlasAnchors[0].nodeId = 'method:not-real'; }, true)
  .some(error => error.includes('unresolved Atlas anchor')),
  'negative control rejects an unresolved Atlas anchor');
ok(errorsFor(proposal => { proposal.acceptedEdgeId = 'edge:forbidden'; }, true)
  .some(error => error.includes('unknown field acceptedEdgeId')),
  'negative control rejects a self-promoting accepted-edge field');
ok(errorsFor(proposal => { proposal.sourceRefs = ['data/not-a-real-file.json']; }, true)
  .some(error => error.includes('unresolved or unsafe sourceRef')),
  'negative control rejects an unresolved evidence reference');

const reviewed = JSON.parse(JSON.stringify(canonical));
const receipt = {
  receiptId: '',
  sequence: 1,
  decidedAt: '2026-08-16T12:00:00Z',
  fromState: 'awaiting-review',
  toState: 'accepted-for-investigation',
  reviewer: {
    actorType: 'human',
    displayName: 'Synthetic test reviewer',
    provenanceNote: 'Hostile-control fixture; not a real review.'
  },
  basis: 'Synthetic fixture demonstrates a valid append-only state transition.',
  evidenceRefs: ['docs/EVIDENCE_ATLAS.md'],
  inferenceLimit: 'The fixture tests lifecycle mechanics and makes no substantive research judgement.',
  predecessorReceiptId: null
};
receipt.receiptId = expectedReceiptId(reviewed.proposalId, receipt);
reviewed.decisionReceipts.push(receipt);
reviewed.currentState = 'accepted-for-investigation';
ok(validateProposal(reviewed, { policy, graph, root: ROOT }).length === 0,
  'valid review receipt advances state without changing proposal identity');
const brokenChain = JSON.parse(JSON.stringify(reviewed));
brokenChain.decisionReceipts[0].fromState = 'deferred';
brokenChain.decisionReceipts[0].receiptId = expectedReceiptId(brokenChain.proposalId, brokenChain.decisionReceipts[0]);
ok(validateProposal(brokenChain, { policy, graph, root: ROOT }).some(error => error.includes('does not continue state')),
  'negative control rejects a receipt that rewrites predecessor state');
const promotedState = JSON.parse(JSON.stringify(canonical));
promotedState.currentState = 'accepted-as-asserted';
ok(validateProposal(promotedState, { policy, graph, root: ROOT }).some(error => error.includes('unknown currentState')),
  'negative control rejects direct promotion to accepted relationship status');

if (process.argv.includes('--built')) {
  const publicRegister = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'atlas-proposals.json'), 'utf8'));
  const versionedRegister = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'v1', 'atlas-proposals.json'), 'utf8'));
  const publicSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'schemas', 'atlas-proposal-register.schema.json'), 'utf8'));
  const versionedSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'v1', 'schemas', 'atlas-proposal-register.schema.json'), 'utf8'));
  const publicProposalSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'schemas', 'atlas-proposal.schema.json'), 'utf8'));
  const versionedProposalSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'v1', 'schemas', 'atlas-proposal.schema.json'), 'utf8'));
  const atlasHtml = fs.readFileSync(path.join(ROOT, 'dist', 'atlas', 'index.html'), 'utf8');
  ok(JSON.stringify(publicRegister) === JSON.stringify(loaded.register),
    'public proposal register is the exact validated source aggregation');
  ok(JSON.stringify(publicRegister) === JSON.stringify(versionedRegister),
    'versioned proposal register matches its unversioned alias');
  ok(JSON.stringify(publicSchema) === JSON.stringify(versionedSchema) &&
    JSON.stringify(publicProposalSchema) === JSON.stringify(versionedProposalSchema),
    'proposal schemas have exact versioned aliases');
  ok((atlasHtml.match(/data-atlas-proposal-row=/g) || []).length === publicRegister.proposals.length,
    'server-rendered proposal register contains every proposal');
  ok(atlasHtml.includes('data-atlas-mode="proposals"') && atlasHtml.includes('/api/atlas-proposals.json'),
    'Atlas exposes the quarantined proposal projection and machine endpoint');
  const atlasScript = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'atlas.js'), 'utf8');
  ok(atlasScript.includes('proposalRows.forEach(function (row) {') &&
    atlasScript.includes('row.hidden = !textMatch;') &&
    !atlasScript.includes("var modeMatch = state.mode === 'proposals';"),
    'proposal register remains populated independently of the selected graph view');
  ok(atlasHtml.includes('email the Evidence Press Research Agent') &&
    atlasHtml.includes('no GitHub account required') && atlasHtml.includes('mailto:ian-8516@agentmail.to'),
    'Atlas exposes a no-GitHub intake route without weakening quarantine');
}

console.log(failures ? `\n${failures} ATLAS PROPOSAL TEST(S) FAILED` : '\nALL ATLAS PROPOSAL TESTS PASSED');
process.exitCode = failures ? 1 : 0;
