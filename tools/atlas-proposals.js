#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PROPOSAL_PREFIX = 'ep-proposal:sha256:';
const RECEIPT_PREFIX = 'ep-proposal-receipt:sha256:';
const REGISTER_PREFIX = 'ep-proposal-register:sha256:';
const TERMINAL_STATES = new Set(['rejected', 'merged', 'superseded', 'completed', 'withdrawn', 'expired']);
const TRANSITIONS = {
  'awaiting-review': new Set(['accepted-for-investigation', 'deferred', 'rejected', 'merged', 'superseded', 'withdrawn', 'expired']),
  'deferred': new Set(['awaiting-review', 'accepted-for-investigation', 'rejected', 'merged', 'superseded', 'withdrawn', 'expired']),
  'accepted-for-investigation': new Set(['deferred', 'rejected', 'merged', 'superseded', 'completed', 'withdrawn'])
};

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

function hashIdentity(prefix, value) {
  return prefix + crypto.createHash('sha256').update(canonicalJson(value)).digest('hex');
}

function proposalIdentity(proposal) {
  return {
    schemaVersion: proposal.schemaVersion,
    recordType: proposal.recordType,
    kind: proposal.kind,
    title: proposal.title,
    question: proposal.question,
    summary: proposal.summary,
    whyNow: proposal.whyNow,
    submittedAt: proposal.submittedAt,
    expiresAt: proposal.expiresAt,
    submitter: proposal.submitter,
    atlasAnchors: proposal.atlasAnchors,
    sourceRefs: proposal.sourceRefs,
    priorArtStatus: proposal.priorArtStatus,
    assessments: proposal.assessments,
    cheapFalsifier: proposal.cheapFalsifier,
    expectedInformationGain: proposal.expectedInformationGain,
    resourceEstimate: proposal.resourceEstimate,
    riskFlags: proposal.riskFlags
  };
}

function receiptIdentity(proposalId, receipt) {
  return {
    proposalId,
    sequence: receipt.sequence,
    decidedAt: receipt.decidedAt,
    fromState: receipt.fromState,
    toState: receipt.toState,
    reviewer: receipt.reviewer,
    basis: receipt.basis,
    evidenceRefs: receipt.evidenceRefs,
    inferenceLimit: receipt.inferenceLimit,
    predecessorReceiptId: receipt.predecessorReceiptId
  };
}

function expectedProposalId(proposal) {
  return hashIdentity(PROPOSAL_PREFIX, proposalIdentity(proposal));
}

function expectedReceiptId(proposalId, receipt) {
  return hashIdentity(RECEIPT_PREFIX, receiptIdentity(proposalId, receipt));
}

function duplicates(values) {
  const seen = new Set();
  return values.filter(value => seen.has(value) || !seen.add(value));
}

function rejectUnknown(errors, label, value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  for (const key of Object.keys(value)) if (!allowed.has(key)) errors.push(`${label}: unknown field ${key}`);
}

function validDateTime(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) && Number.isFinite(Date.parse(value));
}

function validRef(value, root) {
  if (typeof value !== 'string' || !value.trim()) return false;
  if (/^https:\/\//.test(value)) return true;
  if (/^(?:data|docs|papers|pages|schemas)\//.test(value) && !value.includes('..')) {
    return fs.existsSync(path.join(root, value));
  }
  return false;
}

function validatePolicy(policy) {
  const errors = [];
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) return ['proposal policy must be an object'];
  if (policy.schemaVersion !== '1.0') errors.push('proposal policy schemaVersion must be 1.0');
  if (policy.recordType !== 'evidence-atlas-proposal-policy') errors.push('proposal policy recordType is invalid');
  for (const field of ['claimCeiling', 'idAlgorithm', 'acceptedGraphBoundary']) {
    if (typeof policy[field] !== 'string' || !policy[field].trim()) errors.push(`proposal policy ${field} is required`);
  }
  for (const field of ['proposalKinds', 'reviewStates', 'assessmentStates', 'resourceClasses']) {
    if (!Array.isArray(policy[field]) || !policy[field].length) errors.push(`proposal policy ${field} must be non-empty`);
    else for (const value of duplicates(policy[field])) errors.push(`proposal policy ${field} duplicates ${value}`);
  }
  if ((policy.reviewStates || []).includes('accepted-as-asserted')) {
    errors.push('proposal policy may not contain accepted-as-asserted; accepted graph promotion is a separate reviewed record');
  }
  const intakeRoutes = Array.isArray(policy.intakeRoutes) ? policy.intakeRoutes : [];
  if (!intakeRoutes.length) errors.push('proposal policy intakeRoutes must be non-empty');
  for (const id of duplicates(intakeRoutes.map(route => route && route.id))) errors.push(`proposal policy duplicates intake route ${id}`);
  for (const route of intakeRoutes) {
    if (!route || typeof route.id !== 'string' || typeof route.url !== 'string' || typeof route.trustBoundary !== 'string') {
      errors.push('proposal policy intake route requires id, url and trustBoundary');
    }
  }
  const routeById = new Map(intakeRoutes.map(route => [route && route.id, route]));
  if (!routeById.has('github-issue-form')) errors.push('proposal policy must retain the GitHub issue intake route');
  const emailRoute = routeById.get('agentmail-email');
  if (!emailRoute || !/^mailto:[^?\s]+@[^?\s]+/.test(emailRoute.url || '')) {
    errors.push('proposal policy must provide a valid AgentMail email intake route');
  }
  return errors;
}

function validateProposal(proposal, { policy, graph, root }) {
  const errors = [];
  const label = proposal && proposal.proposalId ? proposal.proposalId : 'proposal';
  if (!proposal || typeof proposal !== 'object' || Array.isArray(proposal)) return ['proposal must be an object'];
  rejectUnknown(errors, label, proposal, new Set([
    'schemaVersion', 'recordType', 'proposalId', 'kind', 'title', 'question', 'summary', 'whyNow',
    'submittedAt', 'expiresAt', 'submitter', 'atlasAnchors', 'sourceRefs', 'priorArtStatus',
    'assessments', 'cheapFalsifier', 'expectedInformationGain', 'resourceEstimate', 'riskFlags',
    'currentState', 'decisionReceipts'
  ]));
  if (proposal.schemaVersion !== '1.0') errors.push(`${label}: schemaVersion must be 1.0`);
  if (proposal.recordType !== 'evidence-atlas-research-proposal') errors.push(`${label}: recordType is invalid`);
  if (!policy.proposalKinds.includes(proposal.kind)) errors.push(`${label}: unknown kind ${proposal.kind}`);
  for (const field of ['title', 'question', 'summary', 'whyNow', 'cheapFalsifier', 'expectedInformationGain']) {
    if (typeof proposal[field] !== 'string' || proposal[field].trim().length < 8) errors.push(`${label}: ${field} is missing or too short`);
  }
  if (!validDateTime(proposal.submittedAt)) errors.push(`${label}: submittedAt must be an ISO UTC date-time`);
  if (!validDateTime(proposal.expiresAt)) errors.push(`${label}: expiresAt must be an ISO UTC date-time`);
  if (validDateTime(proposal.submittedAt) && validDateTime(proposal.expiresAt) && proposal.expiresAt <= proposal.submittedAt) {
    errors.push(`${label}: expiresAt must follow submittedAt`);
  }
  if (!proposal.submitter || !['human', 'agent', 'human-agent-collaboration'].includes(proposal.submitter.actorType)) {
    errors.push(`${label}: submitter actorType is invalid`);
  } else {
    rejectUnknown(errors, `${label}: submitter`, proposal.submitter,
      new Set(['actorType', 'displayName', 'humanContributors', 'agentContributors', 'contactUrl']));
    if (!proposal.submitter.displayName) errors.push(`${label}: submitter displayName is required`);
    const humans = proposal.submitter.humanContributors || [];
    const agents = proposal.submitter.agentContributors || [];
    if (proposal.submitter.actorType === 'human' && !humans.length) errors.push(`${label}: human submission needs a human contributor`);
    if (proposal.submitter.actorType === 'agent' && !agents.length) errors.push(`${label}: agent submission needs an agent contributor`);
    if (proposal.submitter.actorType === 'human-agent-collaboration' && (!humans.length || !agents.length)) {
      errors.push(`${label}: collaborative submission needs both human and agent contributors`);
    }
    for (const [index, agent] of agents.entries()) {
      rejectUnknown(errors, `${label}: agent contributor ${index + 1}`, agent,
        new Set(['system', 'model', 'role', 'runRecordUrl', 'provenanceNote']));
      for (const field of ['system', 'model', 'role', 'provenanceNote']) {
        if (!agent || typeof agent[field] !== 'string' || !agent[field].trim()) errors.push(`${label}: agent contributor ${index + 1} needs ${field}`);
      }
      if (agent.runRecordUrl !== null && !validRef(agent.runRecordUrl, root)) errors.push(`${label}: agent contributor ${index + 1} has an invalid runRecordUrl`);
    }
  }
  const nodeIds = new Set((graph.nodes || []).map(node => node.id));
  if (!Array.isArray(proposal.atlasAnchors) || !proposal.atlasAnchors.length) errors.push(`${label}: atlasAnchors must be non-empty`);
  for (const anchor of proposal.atlasAnchors || []) {
    rejectUnknown(errors, `${label}: anchor`, anchor, new Set(['nodeId', 'basis']));
    if (!nodeIds.has(anchor.nodeId)) errors.push(`${label}: unresolved Atlas anchor ${anchor.nodeId}`);
    if (!anchor.basis || anchor.basis.length < 8) errors.push(`${label}: anchor ${anchor.nodeId} lacks a basis`);
  }
  for (const nodeId of duplicates((proposal.atlasAnchors || []).map(anchor => anchor.nodeId))) errors.push(`${label}: duplicate Atlas anchor ${nodeId}`);
  if (!Array.isArray(proposal.sourceRefs) || !proposal.sourceRefs.length) errors.push(`${label}: sourceRefs must be non-empty`);
  for (const ref of proposal.sourceRefs || []) if (!validRef(ref, root)) errors.push(`${label}: unresolved or unsafe sourceRef ${ref}`);
  if (!['not-started', 'bounded-search', 'audited'].includes(proposal.priorArtStatus)) errors.push(`${label}: priorArtStatus is invalid`);
  for (const dimension of ['novelty', 'importance', 'tractability']) {
    const value = proposal.assessments && proposal.assessments[dimension];
    if (!policy.assessmentStates.includes(value)) errors.push(`${label}: ${dimension} assessment is invalid`);
  }
  rejectUnknown(errors, `${label}: assessments`, proposal.assessments,
    new Set(['novelty', 'importance', 'tractability']));
  rejectUnknown(errors, `${label}: resourceEstimate`, proposal.resourceEstimate,
    new Set(['class', 'basis']));
  if (!proposal.resourceEstimate || !policy.resourceClasses.includes(proposal.resourceEstimate.class) || !proposal.resourceEstimate.basis) {
    errors.push(`${label}: resourceEstimate is invalid`);
  }
  if (!Array.isArray(proposal.riskFlags) || !proposal.riskFlags.length) errors.push(`${label}: riskFlags must be non-empty`);
  for (const flag of duplicates(proposal.riskFlags || [])) errors.push(`${label}: duplicate risk flag ${flag}`);
  if (!policy.reviewStates.includes(proposal.currentState)) errors.push(`${label}: unknown currentState ${proposal.currentState}`);
  if (proposal.proposalId !== expectedProposalId(proposal)) errors.push(`${label}: proposalId does not match its immutable content`);

  let expectedState = 'awaiting-review';
  let predecessor = null;
  const receipts = Array.isArray(proposal.decisionReceipts) ? proposal.decisionReceipts : [];
  if (!Array.isArray(proposal.decisionReceipts)) errors.push(`${label}: decisionReceipts must be an array`);
  for (const [index, receipt] of receipts.entries()) {
    const sequence = index + 1;
    rejectUnknown(errors, `${label}: receipt ${sequence}`, receipt, new Set([
      'receiptId', 'sequence', 'decidedAt', 'fromState', 'toState', 'reviewer', 'basis',
      'evidenceRefs', 'inferenceLimit', 'predecessorReceiptId'
    ]));
    rejectUnknown(errors, `${label}: receipt ${sequence} reviewer`, receipt.reviewer,
      new Set(['actorType', 'displayName', 'provenanceNote']));
    if (receipt.sequence !== sequence) errors.push(`${label}: receipt ${sequence} has non-contiguous sequence`);
    if (receipt.fromState !== expectedState) errors.push(`${label}: receipt ${sequence} does not continue state ${expectedState}`);
    if (receipt.predecessorReceiptId !== predecessor) errors.push(`${label}: receipt ${sequence} has the wrong predecessor`);
    if (!validDateTime(receipt.decidedAt)) errors.push(`${label}: receipt ${sequence} has an invalid decidedAt`);
    if (!policy.reviewStates.includes(receipt.toState)) errors.push(`${label}: receipt ${sequence} has unknown toState ${receipt.toState}`);
    if (TERMINAL_STATES.has(receipt.fromState)) errors.push(`${label}: receipt ${sequence} attempts to leave terminal state ${receipt.fromState}`);
    const allowed = TRANSITIONS[receipt.fromState];
    if (!allowed || !allowed.has(receipt.toState)) errors.push(`${label}: receipt ${sequence} has forbidden transition ${receipt.fromState} -> ${receipt.toState}`);
    if (!receipt.reviewer || !receipt.reviewer.displayName || !receipt.reviewer.provenanceNote) errors.push(`${label}: receipt ${sequence} lacks reviewer provenance`);
    if (!receipt.basis || receipt.basis.length < 20) errors.push(`${label}: receipt ${sequence} lacks a decision basis`);
    if (!receipt.inferenceLimit || receipt.inferenceLimit.length < 20) errors.push(`${label}: receipt ${sequence} lacks an inference limit`);
    if (!Array.isArray(receipt.evidenceRefs) || !receipt.evidenceRefs.length) errors.push(`${label}: receipt ${sequence} needs evidenceRefs`);
    for (const ref of receipt.evidenceRefs || []) if (!validRef(ref, root)) errors.push(`${label}: receipt ${sequence} has unresolved evidenceRef ${ref}`);
    if (receipt.receiptId !== expectedReceiptId(proposal.proposalId, receipt)) errors.push(`${label}: receipt ${sequence} ID does not match its content`);
    expectedState = receipt.toState;
    predecessor = receipt.receiptId;
  }
  if (proposal.currentState !== expectedState) errors.push(`${label}: currentState does not match the receipt chain (${expectedState})`);
  return errors;
}

function loadAtlasProposals(root, graph) {
  const policyPath = path.join(root, 'data', 'ATLAS_PROPOSAL_POLICY.json');
  const proposalDir = path.join(root, 'data', 'atlas-proposals');
  const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  const files = fs.existsSync(proposalDir)
    ? fs.readdirSync(proposalDir).filter(name => name.endsWith('.json')).sort()
    : [];
  const proposals = files.map(name => JSON.parse(fs.readFileSync(path.join(proposalDir, name), 'utf8')));
  const errors = validatePolicy(policy);
  for (const proposal of proposals) errors.push(...validateProposal(proposal, { policy, graph, root }));
  for (const id of duplicates(proposals.map(proposal => proposal.proposalId))) errors.push(`proposal register duplicates ${id}`);
  const acceptedIds = new Set([...(graph.nodes || []).map(node => node.id), ...(graph.edges || []).map(edge => edge.id)]);
  for (const proposal of proposals) if (acceptedIds.has(proposal.proposalId)) errors.push(`${proposal.proposalId}: proposal identity leaked into accepted graph`);
  if (errors.length) return { policy, proposals, files, errors, register: null };

  const byState = Object.fromEntries(policy.reviewStates.map(state => [state, 0]));
  const byKind = Object.fromEntries(policy.proposalKinds.map(kind => [kind, 0]));
  for (const proposal of proposals) { byState[proposal.currentState]++; byKind[proposal.kind]++; }
  const body = {
    schemaVersion: '1.0',
    recordType: 'evidence-atlas-proposal-register',
    generatedFrom: ['data/ATLAS_PROPOSAL_POLICY.json', ...files.map(name => `data/atlas-proposals/${name}`)],
    claimCeiling: policy.claimCeiling,
    acceptedGraphBoundary: policy.acceptedGraphBoundary,
    policy,
    stats: { total: proposals.length, byState, byKind },
    proposals
  };
  const register = { ...body, registerId: hashIdentity(REGISTER_PREFIX, body) };
  return { policy, proposals, files, errors: [], register };
}

function validateRegister(register) {
  const errors = [];
  if (!register || register.recordType !== 'evidence-atlas-proposal-register') return ['proposal register recordType is invalid'];
  const { registerId, ...body } = register;
  if (registerId !== hashIdentity(REGISTER_PREFIX, body)) errors.push('proposal register identity does not match its content');
  if (register.stats.total !== register.proposals.length) errors.push('proposal register total does not match proposals length');
  return errors;
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const graphPath = path.join(root, 'dist', 'api', 'research-graph.json');
  if (!fs.existsSync(graphPath)) {
    console.error('Build the site first so Atlas anchors can be checked against dist/api/research-graph.json.');
    process.exitCode = 1;
  } else {
    const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    const result = loadAtlasProposals(root, graph);
    const errors = [...result.errors, ...(result.register ? validateRegister(result.register) : [])];
    if (errors.length) {
      console.error(`ATLAS PROPOSALS INVALID (${errors.length})`);
      for (const error of errors) console.error(`  - ${error}`);
      process.exitCode = 1;
    } else {
      console.log(`ATLAS PROPOSALS VALID: ${result.proposals.length} proposal(s), ${result.proposals.reduce((sum, proposal) => sum + proposal.decisionReceipts.length, 0)} review receipt(s)`);
    }
  }
}

module.exports = {
  PROPOSAL_PREFIX,
  RECEIPT_PREFIX,
  canonicalJson,
  expectedProposalId,
  expectedReceiptId,
  loadAtlasProposals,
  validatePolicy,
  validateProposal,
  validateRegister
};
