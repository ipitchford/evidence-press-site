#!/usr/bin/env node
'use strict';

/*
 * Deterministic, balanced allocation across all six three-arm sequences.
 * Input contains pseudonymous ids and a private random seed. The output records
 * only the SHA-256 commitment to that seed, not the seed itself.
 *
 * No network calls and no third-party dependencies. Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const U = require('./lib/util');
const { SEQUENCES, validatePlan, validateTaskBank, sha256Object } = require('./pilot-validate');

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const BLOCK_PERMUTATIONS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0]
];
// Maps the six arm permutations to block permutations so each arm meets each
// block exactly twice within every complete six-worker allocation block.
const ORTHOGONAL_BLOCK_MAP = [0, 1, 5, 4, 3, 2];

function randomize(input, plan, taskBank, taskBankFileSha256) {
  if (!input || input.schema_version !== '2.0') throw new Error('input.schema_version must be 2.0');
  if (!plan) throw new Error('the frozen pilot plan is required');
  if (!taskBank) throw new Error('the frozen task bank is required');
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(input.pilot_id || '')) throw new Error('invalid pilot_id');
  if (plan.pilot_id !== input.pilot_id) throw new Error('plan.pilot_id does not match randomization input');
  if (taskBank.pilot_id !== input.pilot_id) throw new Error('task_bank.pilot_id does not match randomization input');
  const taskBankErrors = validateTaskBank(taskBank);
  if (taskBankErrors.length) throw new Error('task bank is invalid: ' + taskBankErrors.join('; '));
  if (taskBankFileSha256 !== plan.trial.task_bank_sha256) throw new Error('task-bank file SHA-256 does not match frozen plan');
  if (typeof input.seed !== 'string' || input.seed.length < 16) throw new Error('seed must be a private string of at least 16 characters');
  if (!['os_csprng', 'password_manager_random', 'example_only'].includes(input.seed_source)) throw new Error('invalid seed_source');
  if (typeof input.generated_by_role !== 'string' || input.generated_by_role.trim().length < 3) throw new Error('generated_by_role is required');
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  if (!iso.test(input.participant_list_frozen_at || '')) throw new Error('participant_list_frozen_at must be UTC ISO time');
  if (!iso.test(input.allocation_committed_at || '')) throw new Error('allocation_committed_at must be UTC ISO time');
  if (Date.parse(input.participant_list_frozen_at) > Date.parse(input.allocation_committed_at)) throw new Error('participant list must be frozen before allocation commitment');
  if (!Array.isArray(input.participants) || input.participants.length < 6) throw new Error('at least six pseudonymous participants are required');
  const dup = input.participants.filter((x, i, a) => a.indexOf(x) !== i);
  if (dup.length) throw new Error('duplicate participant id: ' + dup[0]);
  for (const id of input.participants) {
    if (!/^P[0-9A-Z_-]{2,31}$/.test(id)) throw new Error('invalid pseudonymous participant id: ' + id);
  }
  if (input.seed_source !== 'example_only') {
    const planErrors = validatePlan(plan, { runReady: true });
    if (planErrors.length) throw new Error('plan is not run-ready: ' + planErrors.join('; '));
  }

  const seedCommitment = sha256(input.seed);
  const ranked = [...input.participants].sort((a, b) => {
    const ah = sha256(input.seed + '\0' + a);
    const bh = sha256(input.seed + '\0' + b);
    return ah.localeCompare(bh) || a.localeCompare(b);
  });
  const sequenceIds = Object.keys(SEQUENCES);
  const offset = parseInt(sha256(input.seed + '\0sequence-offset').slice(0, 8), 16) % sequenceIds.length;
  const blockOffset = parseInt(sha256(input.seed + '\0block-offset').slice(0, 8), 16) % BLOCK_PERMUTATIONS.length;
  const blocks = taskBank.blocks;
  const assignments = ranked.map((participantId, i) => {
    const sequenceIndex = (i + offset) % sequenceIds.length;
    const sequenceId = sequenceIds[sequenceIndex];
    const arms = SEQUENCES[sequenceId];
    const labelPermutation = BLOCK_PERMUTATIONS[blockOffset];
    const blockOrder = BLOCK_PERMUTATIONS[ORTHOGONAL_BLOCK_MAP[sequenceIndex]]
      .map(index => blocks[labelPermutation[index]]);
    const plannedWorkItems = [];
    for (let period = 1; period <= 3; period++) {
      const block = blockOrder[period - 1];
      for (const task of block.tasks) {
        plannedWorkItems.push({
          work_item_id: 'W' + participantId.slice(1) + '_P' + period + '_' + task.task_id,
          period,
          arm: arms[period - 1],
          task_block_id: block.block_id,
          task_id: task.task_id
        });
      }
    }
    return {
      participant_id: participantId,
      sequence_id: sequenceId,
      period_1: arms[0],
      period_2: arms[1],
      period_3: arms[2],
      period_1_task_block_id: blockOrder[0].block_id,
      period_2_task_block_id: blockOrder[1].block_id,
      period_3_task_block_id: blockOrder[2].block_id,
      planned_work_items: plannedWorkItems
    };
  }).sort((a, b) => a.participant_id.localeCompare(b.participant_id));

  return {
    schema_version: '2.0',
    pilot_id: input.pilot_id,
    study_stage: 'feasibility',
    plan_sha256: sha256Object(plan),
    task_bank_id: taskBank.task_bank_id,
    task_bank_path: plan.trial.task_bank_path,
    task_bank_sha256: taskBankFileSha256,
    method: 'sha256_ranked_balanced_all_six_sequences',
    task_block_method: 'sha256_balanced_all_six_block_permutations',
    participant_list_sha256: sha256([...input.participants].sort().join('\n')),
    participant_list_frozen_at: input.participant_list_frozen_at,
    allocation_committed_at: input.allocation_committed_at,
    generated_by_role: input.generated_by_role,
    seed_source: input.seed_source,
    seed_commitment_sha256: seedCommitment,
    rerolls_permitted: false,
    seed_disclosure_rule: 'keep the seed sealed until data lock, then disclose it with the frozen participant list for replay',
    sequences: sequenceIds.map(id => ({ id, arms: SEQUENCES[id] })),
    assignments
  };
}

function parseArgs(argv) {
  if (!argv.length || argv.includes('--help')) return { help: true };
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--input') out.input = argv[++i];
    else if (argv[i] === '--plan') out.plan = argv[++i];
    else if (argv[i] === '--task-bank') out.taskBank = argv[++i];
    else if (argv[i] === '--out') out.out = argv[++i];
    else throw new Error('unknown argument: ' + argv[i]);
  }
  if (!out.input) throw new Error('--input FILE is required');
  if (!out.plan) throw new Error('--plan FILE is required');
  return out;
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log('usage: node tools/pilot-randomize.js --plan frozen-plan.json --input randomization-input.json [--task-bank frozen-task-bank.json] [--out assignment.json]');
      process.exit(0);
    }
    const plan = JSON.parse(fs.readFileSync(args.plan, 'utf8'));
    const taskBankPath = args.taskBank || path.join(U.ROOT, plan.trial.task_bank_path);
    const taskBankBytes = fs.readFileSync(taskBankPath);
    const result = randomize(
      JSON.parse(fs.readFileSync(args.input, 'utf8')),
      plan,
      JSON.parse(taskBankBytes.toString('utf8')),
      crypto.createHash('sha256').update(taskBankBytes).digest('hex')
    );
    const text = JSON.stringify(result, null, 2) + '\n';
    if (args.out) {
      fs.writeFileSync(args.out, text, { flag: 'wx' });
      console.log('wrote ' + args.out);
      console.log('seed commitment: ' + result.seed_commitment_sha256);
    } else {
      process.stdout.write(text);
    }
  } catch (e) {
    console.error('pilot randomization: ERROR: ' + e.message);
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { randomize, BLOCK_PERMUTATIONS, ORTHOGONAL_BLOCK_MAP };
