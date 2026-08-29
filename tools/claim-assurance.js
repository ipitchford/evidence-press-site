#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CLAIM_ID_RE = /^ep-claim:sha256:[0-9a-f]{64}$/;
const TASK_ID_RE = /^ep-task:[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*:v[1-9][0-9]*$/;
const PROFILE_ID_RE = /^ep-profile:[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*:v[1-9][0-9]*$/;
const RECEIPT_ID_RE = /^ep-receipt:[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*:v[1-9][0-9]*$/;
const EVENT_ID_RE = /^ep-event:[a-z0-9]+(?:-[a-z0-9]+)*:[0-9]{4}$/;
const SHA_RE = /^sha256:[0-9a-f]{64}$/;
const VERSION_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const OBLIGATION_IDS = new Set([
  'lower-bound', 'reduction', 'cnf', 'certificate', 'checker', 'semantic-bridge'
]);

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');

function claimIdentityPayload(claim) {
  return {
    claimKey: claim.claimKey,
    claimVersion: claim.claimVersion,
    releaseSlug: claim.release && claim.release.slug,
    releaseVersion: claim.release && claim.release.version,
    naturalLanguage: claim.statement && claim.statement.naturalLanguage,
    latex: claim.statement && claim.statement.latex
  };
}

function expectedClaimId(claim) {
  return `ep-claim:sha256:${sha256(canonical(claimIdentityPayload(claim)))}`;
}

function expectedStatementFingerprint(claim) {
  return `sha256:${sha256(`${claim.statement.naturalLanguage}\n${claim.statement.latex}`)}`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readJsonl(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map((line, index) => {
    try { return JSON.parse(line); }
    catch (error) { throw new Error(`${file}:${index + 1}: invalid JSON: ${error.message}`); }
  });
}

function loadClaimAssurance(root) {
  const base = path.join(root, 'data', 'claim-assurance');
  const slugs = fs.readdirSync(base).filter(slug => fs.statSync(path.join(base, slug)).isDirectory()).sort();
  const bundles = slugs.map(slug => {
    const dir = path.join(base, slug);
    return {
      slug,
      claim: readJson(path.join(dir, 'claim.json')),
      tasks: readJson(path.join(dir, 'tasks.json')),
      profiles: readJson(path.join(dir, 'replay-profiles.json')),
      receipts: readJson(path.join(dir, 'receipts.json')),
      events: readJsonl(path.join(dir, 'events.jsonl')),
      paths: {
        claim: `data/claim-assurance/${slug}/claim.json`,
        tasks: `data/claim-assurance/${slug}/tasks.json`,
        profiles: `data/claim-assurance/${slug}/replay-profiles.json`,
        receipts: `data/claim-assurance/${slug}/receipts.json`,
        events: `data/claim-assurance/${slug}/events.jsonl`
      }
    };
  });
  return { base, bundles };
}

function nonEmpty(errors, where, value) {
  if (typeof value !== 'string' || !value.trim()) errors.push(`${where} must be a non-empty string`);
}

function validateClaimBundle(bundle, { root, papers = [] } = {}) {
  const errors = [];
  const claim = bundle.claim;
  const tasks = Array.isArray(bundle.tasks) ? bundle.tasks : [];
  const profiles = Array.isArray(bundle.profiles) ? bundle.profiles : [];
  const receipts = Array.isArray(bundle.receipts) ? bundle.receipts : [];
  const events = Array.isArray(bundle.events) ? bundle.events : [];
  const add = message => errors.push(`${bundle.slug}: ${message}`);

  if (!claim || typeof claim !== 'object' || Array.isArray(claim)) return [`${bundle.slug}: claim must be an object`];
  if (claim.schemaVersion !== '1.0' || claim.recordType !== 'claim') add('claim version or recordType is invalid');
  if (!CLAIM_ID_RE.test(String(claim.claimId || ''))) add('claimId is invalid');
  else if (claim.claimId !== expectedClaimId(claim)) add('claimId does not match the content-derived claim identity');
  if (!VERSION_RE.test(String(claim.claimVersion || ''))) add('claimVersion must be semantic version text');
  if (!claim.statement || typeof claim.statement !== 'object') add('statement is required');
  else {
    for (const field of ['short', 'naturalLanguage', 'latex']) nonEmpty(errors, `${bundle.slug}: statement.${field}`, claim.statement[field]);
    if (claim.statementFingerprint !== expectedStatementFingerprint(claim)) add('statementFingerprint does not match the exact statement');
  }
  if (!Array.isArray(claim.nonClaims) || !claim.nonClaims.length) add('nonClaims must be non-empty');
  if (!Array.isArray(claim.obligations) || claim.obligations.length !== OBLIGATION_IDS.size) add('all six assurance obligations must be present exactly once');
  else {
    const ids = new Set(claim.obligations.map(item => item.id));
    for (const id of OBLIGATION_IDS) if (!ids.has(id)) add(`obligation ${id} is missing`);
    if (ids.size !== claim.obligations.length) add('obligation ids must be unique');
    for (const obligation of claim.obligations) {
      if (!Array.isArray(obligation.evidenceRefs) || !obligation.evidenceRefs.length) add(`obligation ${obligation.id} has no evidenceRefs`);
      nonEmpty(errors, `${bundle.slug}: obligation ${obligation.id}.claimCeiling`, obligation.claimCeiling);
    }
  }
  const requiredStatuses = ['database', 'authorClaimed', 'formalVerification', 'independentReproduction', 'humanReview', 'novelty', 'systemAssessment', 'assessedAt'];
  if (!claim.statuses) add('separate status fields are required');
  else for (const field of requiredStatuses) nonEmpty(errors, `${bundle.slug}: statuses.${field}`, claim.statuses[field]);
  if (claim.statuses && claim.statuses.independentReproduction !== 'none-reported') add('pilot may not promote independent reproduction without a qualifying receipt');
  if (!Array.isArray(claim.artifacts) || !claim.artifacts.length) add('claim artifacts must be non-empty');
  const artifactByPath = new Map();
  for (const artifact of claim.artifacts || []) {
    if (artifactByPath.has(artifact.path)) add(`artifact path duplicates ${artifact.path}`);
    artifactByPath.set(artifact.path, artifact);
    if (!SHA_RE.test(String(artifact.sha256 || ''))) add(`artifact ${artifact.path} has invalid SHA-256`);
  }

  const paper = papers.find(item => item.slug === claim.release.slug);
  if (!paper) add(`release ${claim.release.slug} does not resolve`);
  else {
    if (paper.version !== claim.release.version) add('claim release version does not match source metadata');
    if (paper.doi !== claim.release.doi) add('claim DOI does not match source metadata');
    const binding = paper.claimAssurance;
    if (!binding) add('release metadata has no claimAssurance binding');
    else {
      if (binding.claimKey !== claim.claimKey) add('release claimAssurance.claimKey does not match');
      const mathIds = new Set((paper.mathObjects || []).map(item => item.id));
      for (const id of binding.mathObjectIds || []) if (!mathIds.has(id)) add(`bound mathematical object does not resolve: ${id}`);
      const taskKeys = new Set(tasks.map(item => item.taskKey));
      for (const item of binding.openProblemBindings || []) {
        if (!Number.isInteger(item.openProblemIndex) || !paper.openProblems || !paper.openProblems[item.openProblemIndex]) add(`open-problem binding index is invalid: ${item.openProblemIndex}`);
        for (const key of item.taskKeys || []) if (!taskKeys.has(key)) add(`open-problem binding task does not resolve: ${key}`);
      }
    }
  }

  const taskById = new Map();
  const taskByKey = new Map();
  for (const task of tasks) {
    if (!TASK_ID_RE.test(String(task.taskId || ''))) add(`taskId is invalid: ${task.taskId}`);
    if (taskById.has(task.taskId)) add(`taskId duplicates ${task.taskId}`);
    if (taskByKey.has(task.taskKey)) add(`taskKey duplicates ${task.taskKey}`);
    taskById.set(task.taskId, task); taskByKey.set(task.taskKey, task);
    if (task.schemaVersion !== '1.0' || task.recordType !== 'assurance-task') add(`${task.taskId}: wrong task schema version or recordType`);
    if (task.claimId !== claim.claimId || task.claimVersion !== claim.claimVersion) add(`${task.taskId}: wrong claim identity or version`);
    if (!Array.isArray(task.obligationIds) || !task.obligationIds.length || task.obligationIds.some(id => !OBLIGATION_IDS.has(id))) add(`${task.taskId}: invalid assurance obligations`);
    if (!task.budget || task.budget.cashCost !== 'zero-required' || task.budget.networkPolicy !== 'forbidden') add(`${task.taskId}: task must be bounded to zero required cash cost and offline execution`);
    if (!task.independence || task.independence.disclosureRequired !== true) add(`${task.taskId}: independence disclosure is required`);
  }
  for (const task of tasks) for (const dependency of task.dependencies || []) if (!taskById.has(dependency)) add(`${task.taskId}: unresolved dependency ${dependency}`);
  const visiting = new Set(); const visited = new Set();
  function visitTask(id) {
    if (visiting.has(id)) { add(`task dependency cycle reaches ${id}`); return; }
    if (visited.has(id) || !taskById.has(id)) return;
    visiting.add(id);
    for (const dependency of taskById.get(id).dependencies || []) visitTask(dependency);
    visiting.delete(id); visited.add(id);
  }
  for (const id of taskById.keys()) visitTask(id);

  const profileById = new Map();
  for (const profile of profiles) {
    if (!PROFILE_ID_RE.test(String(profile.profileId || ''))) add(`profileId is invalid: ${profile.profileId}`);
    if (profileById.has(profile.profileId)) add(`profileId duplicates ${profile.profileId}`);
    profileById.set(profile.profileId, profile);
    if (profile.schemaVersion !== '1.0' || profile.recordType !== 'replay-profile') add(`${profile.profileId}: wrong profile schema version or recordType`);
    if (profile.claimId !== claim.claimId || profile.claimVersion !== claim.claimVersion) add(`${profile.profileId}: wrong claim identity or version`);
    if (!profile.resources || profile.resources.cashCost !== 'zero-required' || profile.resources.networkPolicy !== 'forbidden') add(`${profile.profileId}: replay profile must require no cash and no network`);
    if (!Array.isArray(profile.commands) || !profile.commands.length || profile.commands.some(command => !Array.isArray(command.argv) || !command.argv.length)) add(`${profile.profileId}: commands must be non-empty argv arrays`);
    for (const taskId of profile.taskIds || []) if (!taskById.has(taskId)) add(`${profile.profileId}: unresolved task ${taskId}`);
  }
  for (const task of tasks) for (const profileId of task.replayProfileIds || []) if (!profileById.has(profileId)) add(`${task.taskId}: unresolved replay profile ${profileId}`);

  const receiptById = new Map();
  for (const receipt of receipts) {
    if (!RECEIPT_ID_RE.test(String(receipt.receiptId || ''))) add(`receiptId is invalid: ${receipt.receiptId}`);
    if (receiptById.has(receipt.receiptId)) add(`receiptId duplicates ${receipt.receiptId}`);
    receiptById.set(receipt.receiptId, receipt);
    if (receipt.schemaVersion !== '1.0' || receipt.recordType !== 'assurance-receipt') add(`${receipt.receiptId}: wrong receipt schema version or recordType`);
    if (receipt.claimId !== claim.claimId || receipt.claimVersion !== claim.claimVersion) add(`${receipt.receiptId}: wrong claim identity or version`);
    const task = taskById.get(receipt.taskId);
    const profile = profileById.get(receipt.profileId);
    if (!task) add(`${receipt.receiptId}: unresolved task ${receipt.taskId}`);
    else if (receipt.taskVersion !== task.taskVersion) add(`${receipt.receiptId}: wrong task version`);
    if (!profile) add(`${receipt.receiptId}: unresolved profile ${receipt.profileId}`);
    else if (receipt.profileVersion !== profile.profileVersion) add(`${receipt.receiptId}: wrong profile version`);
    if (!receipt.independenceDisclosure || typeof receipt.independenceDisclosure !== 'object') add(`${receipt.receiptId}: missing independence disclosure`);
    else {
      const status = receipt.independenceDisclosure.status;
      const relation = receipt.actor && receipt.actor.relationshipToClaimProducer;
      const independentRelation = relation === 'unaffiliated' || relation === 'commissioned-independent';
      if (status === 'independent' && (!independentRelation || !receipt.independenceDisclosure.publicEvidenceUrl)) add(`${receipt.receiptId}: false independence claim`);
      if (status === 'not-independent' && independentRelation) add(`${receipt.receiptId}: independence disclosure conflicts with actor relationship`);
      nonEmpty(errors, `${bundle.slug}: ${receipt.receiptId}.independenceDisclosure.basis`, receipt.independenceDisclosure.basis);
    }
    if (!receipt.subject || receipt.subject.releaseVersion !== claim.release.version) add(`${receipt.receiptId}: wrong release version`);
    for (const binding of (receipt.subject && receipt.subject.artifactBindings) || []) {
      const artifact = artifactByPath.get(binding.path);
      if (!artifact) add(`${receipt.receiptId}: receipt artifact does not resolve: ${binding.path}`);
      else if (binding.sha256 !== artifact.sha256) add(`${receipt.receiptId}: altered hash for ${binding.path}`);
    }
    if (!receipt.outcome || !Array.isArray(receipt.outcome.claimsNotEstablished) || !receipt.outcome.claimsNotEstablished.length) add(`${receipt.receiptId}: outcome must preserve non-established claims`);
  }

  const eventById = new Map();
  let previous = null;
  events.forEach((event, index) => {
    const expectedSequence = index + 1;
    if (!EVENT_ID_RE.test(String(event.eventId || ''))) add(`eventId is invalid: ${event.eventId}`);
    if (eventById.has(event.eventId)) add(`eventId duplicates ${event.eventId}`);
    eventById.set(event.eventId, event);
    if (event.schemaVersion !== '1.0' || event.recordType !== 'assurance-event') add(`${event.eventId}: wrong event schema version or recordType`);
    if (event.sequence !== expectedSequence) add(`${event.eventId}: event sequence must be contiguous`);
    if (event.previousEventId !== previous) add(`${event.eventId}: previousEventId breaks the append-only chain`);
    if (event.claimId !== claim.claimId || event.claimVersion !== claim.claimVersion) add(`${event.eventId}: wrong claim identity or version`);
    for (const id of event.taskIds || []) if (!taskById.has(id)) add(`${event.eventId}: unresolved task ${id}`);
    for (const id of event.receiptIds || []) if (!receiptById.has(id)) add(`${event.eventId}: unresolved receipt ${id}`);
    previous = event.eventId;
  });

  if (root) {
    for (const rel of Object.values(bundle.paths)) if (!fs.existsSync(path.join(root, rel))) add(`source path missing: ${rel}`);
  }
  return errors;
}

function buildClaimAssuranceRegister(loaded, { root, papers = [] } = {}) {
  const errors = [];
  for (const bundle of loaded.bundles) errors.push(...validateClaimBundle(bundle, { root, papers }));
  const claims = loaded.bundles.map(bundle => bundle.claim);
  const tasks = loaded.bundles.flatMap(bundle => bundle.tasks);
  const profiles = loaded.bundles.flatMap(bundle => bundle.profiles);
  const receipts = loaded.bundles.flatMap(bundle => bundle.receipts);
  const events = loaded.bundles.flatMap(bundle => bundle.events);
  const registerPayload = { claims, tasks, profiles, receipts, events };
  return {
    errors,
    register: {
      schemaVersion: '1.0',
      recordType: 'claim-assurance-register',
      registerId: `ep-claim-assurance:sha256:${sha256(canonical(registerPayload))}`,
      claimCeiling: 'These records expose authored claims, scoped evidence, replay tasks and producer or external receipts without upgrading correctness, novelty, independence, formal verification or review beyond the evidence explicitly recorded.',
      counts: { claims: claims.length, tasks: tasks.length, replayProfiles: profiles.length, receipts: receipts.length, events: events.length },
      claims, tasks, replayProfiles: profiles, receipts, events
    }
  };
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const papers = fs.readdirSync(path.join(root, 'papers'))
    .filter(slug => fs.existsSync(path.join(root, 'papers', slug, 'meta.json')))
    .map(slug => ({ slug, ...readJson(path.join(root, 'papers', slug, 'meta.json')) }));
  const result = buildClaimAssuranceRegister(loadClaimAssurance(root), { root, papers });
  if (result.errors.length) {
    console.error(`CLAIM ASSURANCE INVALID (${result.errors.length})`);
    for (const error of result.errors) console.error(`  - ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`CLAIM ASSURANCE VALID: ${result.register.counts.claims} claim, ${result.register.counts.tasks} tasks, ${result.register.counts.receipts} receipt, ${result.register.counts.events} events`);
  }
}

module.exports = {
  canonical,
  sha256,
  expectedClaimId,
  expectedStatementFingerprint,
  loadClaimAssurance,
  validateClaimBundle,
  buildClaimAssuranceRegister
};
