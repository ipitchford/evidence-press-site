#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  loadClaimAssurance,
  validateClaimBundle,
  buildClaimAssuranceRegister
} = require('./claim-assurance');

const ROOT = path.join(__dirname, '..');
const papers = fs.readdirSync(path.join(ROOT, 'papers'))
  .filter(slug => fs.existsSync(path.join(ROOT, 'papers', slug, 'meta.json')))
  .map(slug => ({ slug, ...JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', slug, 'meta.json'), 'utf8')) }));
const loaded = loadClaimAssurance(ROOT);
const canonical = loaded.bundles[0];
const deep = value => JSON.parse(JSON.stringify(value));
let failures = 0;
function ok(condition, label, detail = '') {
  if (condition) console.log(`ok      ${label}`);
  else { failures++; console.log(`FAIL    ${label}${detail ? ` — ${detail}` : ''}`); }
}
function mutated(mutator) {
  const bundle = deep(canonical);
  mutator(bundle);
  return validateClaimBundle(bundle, { root: ROOT, papers });
}

const result = buildClaimAssuranceRegister(loaded, { root: ROOT, papers });
ok(result.errors.length === 0, 'canonical claim-assurance bundle validates', result.errors.join('; '));
ok(result.register.counts.claims === 1 && result.register.counts.tasks === 5 &&
  result.register.counts.replayProfiles === 2 && result.register.counts.receipts === 1 &&
  result.register.counts.events === 3,
  'vertical slice contains the exact bounded claim, task, profile, receipt and event counts');
ok(mutated(bundle => { bundle.tasks[0].claimVersion = '2.0.0'; })
  .some(error => error.includes('wrong claim identity or version')),
  'hostile control rejects a task bound to the wrong claim version');
ok(mutated(bundle => { bundle.receipts[0].subject.releaseVersion = 'wrong-release'; })
  .some(error => error.includes('wrong release version')),
  'hostile control rejects a receipt bound to the wrong release version');
ok(mutated(bundle => { bundle.receipts[0].subject.artifactBindings[0].sha256 = `sha256:${'0'.repeat(64)}`; })
  .some(error => error.includes('altered hash')),
  'hostile control rejects an altered receipt artifact hash');
ok(mutated(bundle => { delete bundle.receipts[0].independenceDisclosure; })
  .some(error => error.includes('missing independence disclosure')),
  'hostile control rejects a receipt with no independence disclosure');
ok(mutated(bundle => { bundle.tasks[0].dependencies = ['ep-task:z20-equals-6:not-real:v1']; })
  .some(error => error.includes('unresolved dependency')),
  'hostile control rejects an invalid task dependency');
ok(mutated(bundle => {
  bundle.receipts[0].independenceDisclosure.status = 'independent';
  bundle.receipts[0].actor.relationshipToClaimProducer = 'claim-producer-workflow';
}).some(error => error.includes('false independence claim')),
  'hostile control rejects producer evidence represented as independent');
ok(mutated(bundle => { bundle.claim.statement.naturalLanguage += ' Silent expansion.'; })
  .some(error => error.includes('content-derived claim identity') || error.includes('statementFingerprint')),
  'hostile control rejects silent claim-statement expansion');

if (process.argv.includes('--built')) {
  const sameFile = (left, right) => fs.readFileSync(left, 'utf8') === fs.readFileSync(right, 'utf8');
  const publicClaims = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'claims.json'), 'utf8'));
  const versionedClaims = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'v1', 'claims.json'), 'utf8'));
  const publicTasks = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'assurance-tasks.json'), 'utf8'));
  const publicReceipts = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'assurance-receipts.json'), 'utf8'));
  const paper = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'releases', 'z20-equals-6', 'paper.json'), 'utf8'));
  const mathObjects = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'math-objects.json'), 'utf8'));
  const object = mathObjects.objects.find(item => item.id === 'ep-math:z20-equals-6:cochromatic-number-20');
  ok(JSON.stringify(publicClaims) === JSON.stringify(versionedClaims),
    'versioned claims endpoint exactly matches its stable alias');
  ok(publicClaims.claims[0].claimId === canonical.claim.claimId && publicTasks.tasks.length === 5 && publicReceipts.receipts.length === 1,
    'public claim, task and receipt registers preserve the validated source records');
  ok(paper.claimAssurance.claimId === canonical.claim.claimId && paper.claimAssurance.openProblemTasks.length === 3,
    'z(20) release record links exact claim tasks to existing open problems');
  ok(object.claimId === canonical.claim.claimId && object.claimUrl === paper.claimAssurance.apiUrl && object.assuranceTaskIds.length === 5,
    'existing mathematical-object record links to the claim and bounded tasks');
  ok(sameFile(path.join(ROOT, 'dist', 'api', 'assurance-events.jsonl'), path.join(ROOT, 'dist', 'api', 'v1', 'assurance-events.jsonl')),
    'versioned append-only event stream exactly matches its stable alias');
  ok(sameFile(path.join(ROOT, 'dist', 'api', 'claims', 'z20-equals-6-main.json'), path.join(ROOT, 'dist', 'api', 'v1', 'claims', 'z20-equals-6-main.json')),
    'individual content-addressed claim surface has an exact versioned alias');
  ok(sameFile(path.join(ROOT, 'dist', 'api', 'claims', 'z20-equals-6-main', 'events.jsonl'), path.join(ROOT, 'data', 'claim-assurance', 'z20-equals-6', 'events.jsonl')),
    'individual public event stream is the exact canonical JSONL source');
  for (const name of ['claim.schema.json', 'assurance-task.schema.json', 'replay-profile.schema.json', 'assurance-receipt.schema.json', 'assurance-event.schema.json']) {
    ok(sameFile(path.join(ROOT, 'dist', 'api', 'schemas', name), path.join(ROOT, 'dist', 'api', 'v1', 'schemas', name)),
      `${name} has an exact versioned alias`);
  }
}

console.log(failures ? `\n${failures} CLAIM ASSURANCE TEST(S) FAILED` : '\nALL CLAIM ASSURANCE TESTS PASSED');
process.exitCode = failures ? 1 : 0;
