#!/usr/bin/env node
'use strict';

/*
 * Validate the novice-company pilot kit. JSON Schemas provide structural
 * validation; this file enforces relational invariants that the repository's
 * intentionally small JSON Schema implementation cannot express.
 *
 * No network calls and no third-party dependencies. Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { validate } = require('./lib/jsonschema');
const U = require('./lib/util');

const ARMS = ['manual', 'agent_without_protocol', 'agent_with_protocol'];
const READINESS_IDS = [
  'workflow_repeated_and_comparable',
  'low_stakes_read_only',
  'quality_rubric_available',
  'enough_work_for_three_periods',
  'same_agent_configuration',
  'worker_time_and_consent',
  'data_non_sensitive',
  'owner_and_incident_cover',
  'rollback_tested',
  'pilot_capacity'
];
const OUTCOME_IDS = [
  'elapsed_time_min',
  'rework_count',
  'quality_score',
  'material_error_count',
  'cognitive_burden_1_to_7',
  'would_adopt',
  'help_request_count',
  'facilitator_support_min',
  'approver_checker_min',
  'total_human_resource_min',
  'model_tool_cost_usd',
  'safety_event_count'
];
const APPROVAL_ROLES = [
  'workflow_owner',
  'affected_people_representative',
  'data_owner',
  'safety_reviewer'
];
const SEQUENCES = {
  MAP: ['manual', 'agent_without_protocol', 'agent_with_protocol'],
  MPA: ['manual', 'agent_with_protocol', 'agent_without_protocol'],
  AMP: ['agent_without_protocol', 'manual', 'agent_with_protocol'],
  APM: ['agent_without_protocol', 'agent_with_protocol', 'manual'],
  PMA: ['agent_with_protocol', 'manual', 'agent_without_protocol'],
  PAM: ['agent_with_protocol', 'agent_without_protocol', 'manual']
};
const T95 = [
  null,
  12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262,
  2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101,
  2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052,
  2.048, 2.045, 2.042
];
const NORMAL_975 = 1.959963984540054;

function tCritical95(df) {
  if (!Number.isInteger(df) || df < 1) return null;
  if (df <= 30) return T95[df];
  // Cornish-Fisher expansion of the Student-t 0.975 quantile through
  // O(df^-3). At df 31 it is within 0.000002 of the tabulated value and
  // retains the finite-df correction while converging to the normal quantile.
  const z = NORMAL_975;
  return z
    + (z ** 3 + z) / (4 * df)
    + (5 * z ** 5 + 16 * z ** 3 + 3 * z) / (96 * df ** 2)
    + (3 * z ** 7 + 19 * z ** 5 + 17 * z ** 3 - 15 * z) / (384 * df ** 3);
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function schema(name) {
  return readJSON(path.join(U.ROOT, 'schema', name));
}

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function sameSet(actual, expected) {
  const a = sortedUnique(actual);
  const b = sortedUnique(expected);
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function duplicates(values) {
  const seen = new Set();
  const found = new Set();
  for (const v of values) {
    if (seen.has(v)) found.add(v);
    seen.add(v);
  }
  return [...found].sort();
}

function addSchemaErrors(errors, label, schemaName, data) {
  for (const e of validate(schema(schemaName), data)) {
    errors.push(label + e.path + ': ' + e.msg);
  }
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  }
  return JSON.stringify(value);
}

function sha256Object(value) {
  return crypto.createHash('sha256').update(canonical(value)).digest('hex');
}

function sha256Text(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function selectedSecondRatingWorkItemIds(rows, plan) {
  const selected = new Set();
  const strata = new Map();
  for (const row of rows.filter(item => item.status === 'completed')) {
    const key = row.arm + '\0' + row.task_block_id;
    if (!strata.has(key)) strata.set(key, []);
    strata.get(key).push(row);
  }
  const planHash = sha256Object(plan);
  for (const stratumRows of strata.values()) {
    const ranked = [...stratumRows].sort((a, b) => {
      const ah = sha256Text('pilot-second-rating-v1\0' + planHash + '\0' + a.work_item_id);
      const bh = sha256Text('pilot-second-rating-v1\0' + planHash + '\0' + b.work_item_id);
      return ah.localeCompare(bh) || a.work_item_id.localeCompare(b.work_item_id);
    });
    const n = Math.ceil(ranked.length * plan.outcomes.quality_measurement.second_rating_fraction);
    ranked.slice(0, n).forEach(row => selected.add(row.work_item_id));
  }
  return selected;
}

function validateTaskBank(taskBank) {
  const errors = [];
  addSchemaErrors(errors, 'task_bank', 'pilot-task-bank.schema.json', taskBank);
  if (errors.length) return errors;
  const blockIds = taskBank.blocks.map(x => x.block_id);
  if (duplicates(blockIds).length) errors.push('task_bank.blocks has duplicate block ids: ' + duplicates(blockIds).join(', '));
  const taskIds = [];
  const inputHashes = [];
  for (const block of taskBank.blocks) {
    const taskHashes = [];
    for (const task of block.tasks) {
      taskIds.push(task.task_id);
      inputHashes.push(task.input_sha256);
      const expectedTaskHash = crypto.createHash('sha256')
        .update(task.task_id + '\0' + task.input_sha256 + '\0' + task.answer_key_sha256)
        .digest('hex');
      if (task.task_sha256 !== expectedTaskHash) {
        errors.push('task_bank.' + task.task_id + ': task_sha256 does not bind task id, input hash and answer-key hash');
      }
      taskHashes.push(task.task_sha256);
    }
    const expectedBlockHash = crypto.createHash('sha256')
      .update(block.block_id + '\0' + taskHashes.join('\0'))
      .digest('hex');
    if (block.block_sha256 !== expectedBlockHash) {
      errors.push('task_bank.' + block.block_id + ': block_sha256 does not bind its ordered task hashes');
    }
  }
  if (duplicates(taskIds).length) errors.push('task_bank has duplicate task ids: ' + duplicates(taskIds).join(', '));
  if (duplicates(inputHashes).length) errors.push('task_bank reuses an input hash across planned tasks');
  return errors;
}

function boundFile(rel, expectedHash, label, errors) {
  if (placeholder(rel) || path.isAbsolute(rel) || rel.includes('\\') || path.posix.normalize(rel) !== rel || rel.split('/').includes('..')) {
    errors.push('plan.' + label + ': path must be a concrete safe repository-relative path');
    return null;
  }
  const full = path.resolve(U.ROOT, ...rel.split('/'));
  if (!full.startsWith(U.ROOT + path.sep)) {
    errors.push('plan.' + label + ': path escapes the repository');
    return null;
  }
  let stat;
  try { stat = fs.lstatSync(full); } catch {
    errors.push('plan.' + label + ': artifact is missing at ' + rel);
    return null;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    errors.push('plan.' + label + ': artifact must be a regular non-symlink file');
    return null;
  }
  if (sha256File(full) !== expectedHash) errors.push('plan.' + label + ': SHA-256 does not match the frozen artifact');
  return full;
}

function readBoundJSON(rel, expectedHash, label, errors) {
  const full = boundFile(rel, expectedHash, label, errors);
  if (!full) return null;
  try { return readJSON(full); } catch (e) {
    errors.push('plan.' + label + ': invalid JSON: ' + e.message);
    return null;
  }
}

function placeholder(value) {
  return typeof value !== 'string' || !value.trim() ||
    /(replace(?:[-_\s]+)with|placeholder|record concrete evidence here|describe who|example only)/i.test(value);
}

function validateBoundArtifact(rel, expected, label, errors) {
  if (placeholder(rel)) {
    errors.push(`run-ready gate failed: ${label} path is still a placeholder`);
    return;
  }
  if (path.isAbsolute(rel) || rel.includes('\\') || path.posix.normalize(rel) !== rel || rel.split('/').includes('..')) {
    errors.push(`run-ready gate failed: ${label} path must be a safe repository-relative path`);
    return;
  }
  const full = path.resolve(U.ROOT, ...rel.split('/'));
  if (!full.startsWith(U.ROOT + path.sep)) {
    errors.push(`run-ready gate failed: ${label} path escapes the repository`);
    return;
  }
  let stat;
  try { stat = fs.lstatSync(full); } catch {
    errors.push(`run-ready gate failed: ${label} artifact is missing at ${rel}`);
    return;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    errors.push(`run-ready gate failed: ${label} artifact must be a regular non-symlink file`);
    return;
  }
  if (sha256File(full) !== expected) errors.push(`run-ready gate failed: ${label} SHA-256 does not match its frozen artifact`);
}

function validatePlan(plan, options = {}) {
  const errors = [];
  addSchemaErrors(errors, 'plan', 'pilot-plan.schema.json', plan);
  if (errors.length) return errors;

  const readinessIds = plan.readiness.checks.map(x => x.id);
  if (!sameSet(readinessIds, READINESS_IDS) || duplicates(readinessIds).length) {
    errors.push('plan.readiness.checks must contain each required readiness id exactly once');
  }
  if (plan.readiness.checks.some(x => x.blocking !== true)) {
    errors.push('plan.readiness.checks: every listed readiness check is blocking for this low-risk starter pilot');
  }
  const allReady = plan.readiness.checks.every(x => x.result === 'PASS');
  if (plan.readiness.overall_decision === 'GO' && !allReady) {
    errors.push('plan.readiness: GO is invalid while any readiness check is FAIL or UNKNOWN');
  }
  if (plan.status === 'ready' && plan.readiness.overall_decision !== 'GO') {
    errors.push('plan.status: ready requires readiness.overall_decision GO');
  }

  if (!sameSet(plan.trial.arms, ARMS) || duplicates(plan.trial.arms).length) {
    errors.push('plan.trial.arms must contain manual, agent_without_protocol and agent_with_protocol exactly once');
  }
  const outcomeIds = plan.outcomes.secondary_and_guardrail.map(x => x.metric);
  if (!sameSet(outcomeIds, OUTCOME_IDS) || duplicates(outcomeIds).length) {
    errors.push('plan.outcomes.secondary_and_guardrail must contain every required metric exactly once');
  }
  if (duplicates(plan.outcomes.quality_measurement.rater_ids).length) {
    errors.push('plan.outcomes.quality_measurement.rater_ids must be distinct');
  }
  if (!(plan.outcomes.quality_measurement.second_rating_fraction > 0)) {
    errors.push('plan.outcomes.quality_measurement.second_rating_fraction must be greater than zero');
  }
  const feasibilityDimensions = [
    'recruitment_and_retention',
    'task_completion',
    'measurement_completeness',
    'protocol_adherence',
    'support_resource',
    'rating_reliability',
    'safety_process'
  ];
  if (!sameSet(plan.decision_rule.feasibility_review_dimensions, feasibilityDimensions)
      || duplicates(plan.decision_rule.feasibility_review_dimensions).length) {
    errors.push('plan.decision_rule.feasibility_review_dimensions must contain every feasibility process dimension exactly once');
  }
  const sample = plan.trial.sample_size;
  if (sample.target_randomized_workers % sample.sequence_block_size !== 0) {
    errors.push('plan.trial.sample_size.target_randomized_workers must be a multiple of the six-sequence block size');
  }
  if (sample.minimum_complete_pairs_target > sample.target_randomized_workers) {
    errors.push('plan.trial.sample_size.minimum_complete_pairs_target exceeds target randomized workers');
  }
  const expectedCompleters = Math.floor(sample.target_randomized_workers * (1 - sample.expected_attrition_fraction));
  if (sample.minimum_complete_pairs_target > expectedCompleters) {
    errors.push('plan.trial.sample_size.minimum_complete_pairs_target is inconsistent with target and expected attrition');
  }
  const df = sample.minimum_complete_pairs_target - 1;
  const critical = tCritical95(df);
  const impliedHalfWidth = sample.minimum_complete_pairs_target > 1
    ? critical * sample.paired_sd_assumption_min / Math.sqrt(sample.minimum_complete_pairs_target)
    : Infinity;
  if (sample.target_ci_half_width_min + 1e-12 < impliedHalfWidth) {
    errors.push('plan.trial.sample_size.target_ci_half_width_min is more optimistic than its paired-SD and complete-pair assumptions');
  }
  if (sample.smallest_worthwhile_difference_min !== plan.analysis.smallest_worthwhile_improvement_min) {
    errors.push('plan.trial.sample_size.smallest_worthwhile_difference_min must match analysis.smallest_worthwhile_improvement_min');
  }
  const approvalRoles = plan.approvals.map(x => x.role);
  if (!sameSet(approvalRoles, APPROVAL_ROLES) || duplicates(approvalRoles).length) {
    errors.push('plan.approvals must contain each required approval role exactly once');
  }
  const approvalsComplete = plan.approvals.every(x => x.status === 'approved' && x.date !== null);
  if (plan.readiness.overall_decision === 'GO' && !approvalsComplete) {
    errors.push('plan.approvals: GO requires all four approvals with dates');
  }
  if (plan.follow_up.day_30.target_day !== 30 || plan.follow_up.day_90.target_day !== 90) {
    errors.push('plan.follow_up: day_30.target_day must be 30 and day_90.target_day must be 90');
  }
  if (plan.worker_protections.consultation_status === 'not_applicable_with_reason'
      && !String(plan.worker_protections.consultation_note || '').trim()) {
    errors.push('plan.worker_protections.consultation_note is required when consultation is not applicable');
  }
  if (plan.facilitation.mode === 'self_guided' && plan.facilitation.facilitator_role !== null) {
    errors.push('plan.facilitation.facilitator_role must be null for self_guided mode');
  }
  if (plan.facilitation.mode === 'optional_trusted_adviser'
      && !String(plan.facilitation.facilitator_role || '').trim()) {
    errors.push('plan.facilitation.facilitator_role is required for optional_trusted_adviser mode');
  }

  const taskBank = readBoundJSON(plan.trial.task_bank_path, plan.trial.task_bank_sha256, 'trial.task_bank', errors);
  if (taskBank) {
    errors.push(...validateTaskBank(taskBank));
    if (taskBank.pilot_id !== plan.pilot_id) errors.push('plan.trial.task_bank: pilot_id does not match the plan');
    if (taskBank.study_stage !== plan.study_stage) errors.push('plan.trial.task_bank: study_stage does not match the plan');
    if (taskBank.blocks.some(block => block.tasks.length !== plan.trial.tasks_per_arm_per_worker)) {
      errors.push('plan.trial.task_bank: every block must contain tasks_per_arm_per_worker tasks');
    }
  }
  boundFile(
    plan.outcomes.quality_measurement.rubric_path,
    plan.outcomes.quality_measurement.rubric_sha256,
    'outcomes.quality_measurement.rubric',
    errors
  );

  const promptPath = path.join(
    U.ROOT,
    'protocols',
    'document-to-action-plan',
    'adapters',
    'generic-chat',
    'prompt.md'
  );
  if (!fs.existsSync(promptPath)) {
    errors.push('plan.protocol: repository copy-and-run prompt is missing');
  } else if (plan.protocol.protocol_prompt_sha256 !== sha256File(promptPath)) {
    errors.push('plan.protocol.protocol_prompt_sha256 does not match the current copy-and-run prompt');
  }

  if (options.runReady) {
    if (plan.status !== 'ready' || plan.readiness.overall_decision !== 'GO' || !allReady || !approvalsComplete) {
      errors.push('run-ready gate failed: plan must be ready, GO, all checks PASS, and all approvals approved');
    }
    if (plan.trial.seed_source === 'example_only') {
      errors.push('run-ready gate failed: seed_source example_only must be replaced by OS or password-manager randomness');
    }
    const concrete = [
      ['pilot_id', plan.pilot_id],
      ['workflow.name', plan.workflow.name],
      ['workflow.description', plan.workflow.description],
      ['workflow.workflow_owner_role', plan.workflow.workflow_owner_role],
      ['workflow.current_manual_process', plan.workflow.current_manual_process],
      ['readiness.assessed_by_role', plan.readiness.assessed_by_role],
      ['data_governance.destination', plan.data_governance.destination],
      ['data_governance.data_owner_role', plan.data_governance.data_owner_role],
      ['trial.allocation_generated_by_role', plan.trial.allocation_generated_by_role],
      ['trial.agent_model_identifier', plan.trial.agent_model_identifier],
      ['trial.sample_size.calculation_note', plan.trial.sample_size.calculation_note],
      ['trial.task_equivalence_method', plan.trial.task_equivalence_method],
      ['incident_and_rollback.incident_contact_channel', plan.incident_and_rollback.incident_contact_channel]
    ];
    for (const [label, value] of concrete) {
      if (placeholder(value)) errors.push(`run-ready gate failed: ${label} is still a placeholder`);
    }
    if (plan.workflow.affected_people_groups.some(placeholder)) {
      errors.push('run-ready gate failed: workflow.affected_people_groups contains a placeholder');
    }
    if (plan.readiness.checks.some(check => placeholder(check.evidence))) {
      errors.push('run-ready gate failed: readiness evidence contains a placeholder');
    }
    if (!(plan.analysis.smallest_worthwhile_improvement_min > 0)) {
      errors.push('run-ready gate failed: smallest worthwhile improvement must be greater than zero');
    }
    validateBoundArtifact(plan.trial.agent_configuration_path, plan.trial.agent_configuration_sha256, 'agent configuration', errors);
    validateBoundArtifact(plan.trial.bare_agent_prompt_path, plan.trial.bare_agent_prompt_sha256, 'bare-agent prompt', errors);
    validateBoundArtifact(plan.trial.preregistration_path, plan.trial.preregistration_sha256, 'analysis preregistration', errors);
    if (taskBank && taskBank.synthetic_example) {
      errors.push('run-ready gate failed: synthetic task bank must be replaced by a frozen non-synthetic task bank');
    }
  }
  return errors;
}

function validateAssignment(assignment, plan, taskBank) {
  const errors = [];
  addSchemaErrors(errors, 'assignment', 'pilot-assignment.schema.json', assignment);
  if (errors.length) return errors;

  const sequenceIds = assignment.sequences.map(x => x.id);
  if (!sameSet(sequenceIds, Object.keys(SEQUENCES)) || duplicates(sequenceIds).length) {
    errors.push('assignment.sequences must contain all six sequence ids exactly once');
  }
  for (const seq of assignment.sequences) {
    if (SEQUENCES[seq.id] && JSON.stringify(seq.arms) !== JSON.stringify(SEQUENCES[seq.id])) {
      errors.push('assignment.sequences.' + seq.id + ' has the wrong arm order');
    }
  }

  const ids = assignment.assignments.map(x => x.participant_id);
  if (duplicates(ids).length) errors.push('assignment.assignments has duplicate participant ids: ' + duplicates(ids).join(', '));
  const participantListHash = sha256Text([...ids].sort().join('\n'));
  if (assignment.participant_list_sha256 !== participantListHash) {
    errors.push('assignment.participant_list_sha256 does not bind the complete sorted assigned participant list');
  }
  const counts = Object.fromEntries(Object.keys(SEQUENCES).map(k => [k, 0]));
  const allWorkItemIds = [];
  const armBlockCounts = new Map();
  const bankBlocks = new Map();
  if (taskBank) taskBank.blocks.forEach(block => bankBlocks.set(block.block_id, block));
  for (const a of assignment.assignments) {
    counts[a.sequence_id] = (counts[a.sequence_id] || 0) + 1;
    const expected = SEQUENCES[a.sequence_id];
    const actual = [a.period_1, a.period_2, a.period_3];
    if (expected && JSON.stringify(actual) !== JSON.stringify(expected)) {
      errors.push('assignment.' + a.participant_id + ': periods do not match sequence ' + a.sequence_id);
    }
    const assignedBlocks = [
      a.period_1_task_block_id,
      a.period_2_task_block_id,
      a.period_3_task_block_id
    ];
    if (taskBank && (!sameSet(assignedBlocks, taskBank.blocks.map(x => x.block_id)) || duplicates(assignedBlocks).length)) {
      errors.push('assignment.' + a.participant_id + ': periods must contain each frozen task block exactly once');
    }
    const plannedIds = a.planned_work_items.map(x => x.work_item_id);
    if (duplicates(plannedIds).length) errors.push('assignment.' + a.participant_id + ': duplicate planned work-item ids');
    allWorkItemIds.push(...plannedIds);
    const expectedPlanned = [];
    for (let period = 1; period <= 3; period++) {
      const arm = a['period_' + period];
      const blockId = a['period_' + period + '_task_block_id'];
      const block = bankBlocks.get(blockId);
      armBlockCounts.set(arm + '\0' + blockId, (armBlockCounts.get(arm + '\0' + blockId) || 0) + 1);
      if (block) {
        for (const task of block.tasks) {
          expectedPlanned.push({
            work_item_id: 'W' + a.participant_id.slice(1) + '_P' + period + '_' + task.task_id,
            period,
            arm,
            task_block_id: blockId,
            task_id: task.task_id
          });
        }
      }
    }
    if (taskBank && canonical(a.planned_work_items) !== canonical(expectedPlanned)) {
      errors.push('assignment.' + a.participant_id + ': planned_work_items do not exactly bind randomized periods and frozen tasks');
    }
  }
  if (duplicates(allWorkItemIds).length) errors.push('assignment has duplicate planned work-item ids across participants');
  const spread = Math.max(...Object.values(counts)) - Math.min(...Object.values(counts));
  if (spread > 1) errors.push('assignment is not balanced across six sequences: ' + JSON.stringify(counts));
  if (taskBank) {
    for (const arm of ARMS) {
      const blockCounts = taskBank.blocks.map(block => armBlockCounts.get(arm + '\0' + block.block_id) || 0);
      if (Math.max(...blockCounts) - Math.min(...blockCounts) > 1) {
        errors.push('assignment task blocks are not balanced across arm ' + arm);
      }
    }
  }

  if (plan) {
    if (assignment.pilot_id !== plan.pilot_id) errors.push('assignment.pilot_id does not match plan.pilot_id');
    if (assignment.plan_sha256 !== sha256Object(plan)) errors.push('assignment.plan_sha256 does not bind the supplied frozen plan');
    if (assignment.seed_commitment_sha256 !== plan.trial.seed_commitment_sha256) {
      errors.push('assignment.seed_commitment_sha256 does not match plan.trial.seed_commitment_sha256');
    }
    if (assignment.assignments.length !== plan.trial.sample_size.target_randomized_workers) {
      errors.push('assignment.assignments count does not match plan.trial.sample_size.target_randomized_workers');
    }
    if (assignment.generated_by_role !== plan.trial.allocation_generated_by_role) {
      errors.push('assignment.generated_by_role does not match plan.trial.allocation_generated_by_role');
    }
    if (assignment.seed_source !== plan.trial.seed_source) {
      errors.push('assignment.seed_source does not match plan.trial.seed_source');
    }
    if (assignment.study_stage !== plan.study_stage) errors.push('assignment.study_stage does not match plan.study_stage');
    if (assignment.task_bank_path !== plan.trial.task_bank_path) errors.push('assignment.task_bank_path does not match plan.trial.task_bank_path');
    if (assignment.task_bank_sha256 !== plan.trial.task_bank_sha256) errors.push('assignment.task_bank_sha256 does not match plan.trial.task_bank_sha256');
  }
  if (taskBank) {
    if (assignment.task_bank_id !== taskBank.task_bank_id) errors.push('assignment.task_bank_id does not match supplied task bank');
  }
  return errors;
}

function derivedQualityScore(row) {
  if (!row.quality_ratings || !row.quality_ratings.length) return null;
  return row.quality_ratings.reduce((sum, rating) => sum + rating.total_score, 0) / row.quality_ratings.length;
}

function derivedAcceptedOutput(row, plan) {
  const quality = derivedQualityScore(row);
  if (row.status !== 'completed' || quality === null || row.material_error_count === null) return null;
  const q = plan.outcomes.quality_measurement;
  const severe = row.safety_events.some(event => event.severity === 'severe');
  return quality >= q.acceptance_threshold_score
    && row.material_error_count <= q.maximum_material_errors_for_acceptance
    && !(q.severe_safety_event_precludes_acceptance && severe);
}

function validateObservations(data, plan, assignment, taskBank) {
  const errors = [];
  addSchemaErrors(errors, 'observations', 'pilot-observations.schema.json', data);
  if (errors.length) return errors;
  if (plan && data.pilot_id !== plan.pilot_id) errors.push('observations.pilot_id does not match plan.pilot_id');
  if (plan && data.study_stage !== plan.study_stage) errors.push('observations.study_stage does not match plan.study_stage');
  if (plan && data.plan_sha256 !== sha256Object(plan)) errors.push('observations.plan_sha256 does not bind the supplied frozen plan');
  if (assignment && data.assignment_sha256 !== sha256Object(assignment)) errors.push('observations.assignment_sha256 does not bind the supplied assignment');
  if (assignment && data.task_bank_sha256 !== assignment.task_bank_sha256) errors.push('observations.task_bank_sha256 does not bind the assigned task bank');

  const statuses = new Map();
  const statusIds = data.participant_status.map(x => x.participant_id);
  if (duplicates(statusIds).length) errors.push('observations.participant_status has duplicate ids: ' + duplicates(statusIds).join(', '));
  data.participant_status.forEach(x => statuses.set(x.participant_id, x));

  const assigned = new Map();
  const planned = new Map();
  if (assignment) {
    for (const a of assignment.assignments) {
      assigned.set(a.participant_id, a);
      for (const item of a.planned_work_items) planned.set(item.work_item_id, { participant_id: a.participant_id, sequence_id: a.sequence_id, ...item });
    }
    if (!sameSet(statusIds, assignment.assignments.map(x => x.participant_id))) {
      errors.push('observations.participant_status must retain one row for every randomized participant, including attrition');
    }
  }

  const rows = data.work_item_roster;
  const workIds = rows.map(x => x.work_item_id);
  if (duplicates(workIds).length) errors.push('observations.work_item_roster has duplicate work_item_id values: ' + duplicates(workIds).join(', '));
  if (assignment && !sameSet(workIds, [...planned.keys()])) {
    errors.push('observations.work_item_roster must contain every planned randomized work item exactly once, including missing items');
  }

  const allowedRaters = new Set(plan ? plan.outcomes.quality_measurement.rater_ids : []);
  const rowsByParticipant = new Map();
  const completedRows = [];
  const requiredCompleted = [
    'human_effort_min',
    'elapsed_time_min',
    'rework_count',
    'material_error_count',
    'cognitive_burden_1_to_7',
    'would_adopt',
    'help_request_count',
    'facilitator_support_min',
    'approver_checker_min',
    'contamination_detected',
    'protocol_adherence'
  ];
  for (const row of rows) {
    if (!rowsByParticipant.has(row.participant_id)) rowsByParticipant.set(row.participant_id, []);
    rowsByParticipant.get(row.participant_id).push(row);
    const status = statuses.get(row.participant_id);
    if (!status) {
      errors.push('observations.' + row.work_item_id + ': participant is absent from participant_status');
      continue;
    }
    if (status.sequence_id !== row.sequence_id) errors.push('observations.' + row.work_item_id + ': sequence differs from participant_status');
    const expected = planned.get(row.work_item_id);
    if (assignment) {
      if (!expected) errors.push('observations.' + row.work_item_id + ': work item was not planned by randomization');
      else {
        for (const field of ['participant_id', 'sequence_id', 'period', 'arm', 'task_block_id', 'task_id']) {
          if (row[field] !== expected[field]) errors.push('observations.' + row.work_item_id + ': ' + field + ' differs from frozen assignment');
        }
      }
    }
    if (!status.retain_pre_withdrawal_data_authorized) {
      const retained = requiredCompleted.some(field => row[field] !== null)
        || row.quality_ratings.length > 0 || row.safety_events.length > 0;
      if (retained) errors.push('observations.' + row.work_item_id + ': outcome data retained without authorization');
    }
    if (row.status === 'completed') {
      completedRows.push(row);
      if (row.missing_reason !== 'not_missing') errors.push('observations.' + row.work_item_id + ': completed item must use missing_reason not_missing');
      for (const field of requiredCompleted) {
        if (row[field] === null) errors.push('observations.' + row.work_item_id + ': completed item is missing ' + field);
      }
      if (!row.quality_ratings.length) errors.push('observations.' + row.work_item_id + ': completed item requires at least one quality rating');
    } else if (row.missing_reason === 'not_missing') {
      errors.push('observations.' + row.work_item_id + ': non-completed item requires an explicit missing reason');
    }
    if (row.status === 'planned') {
      const retained = requiredCompleted.some(field => row[field] !== null)
        || row.quality_ratings.length > 0 || row.safety_events.length > 0;
      if (retained) errors.push('observations.' + row.work_item_id + ': planned item cannot contain observed outcomes');
    }
    const raterIds = row.quality_ratings.map(x => x.rater_id);
    if (duplicates(raterIds).length) errors.push('observations.' + row.work_item_id + ': duplicate rater id');
    for (const rating of row.quality_ratings) {
      if (plan && !allowedRaters.has(rating.rater_id)) errors.push('observations.' + row.work_item_id + ': unregistered rater id ' + rating.rater_id);
      const components = rating.component_scores;
      const total = Object.values(components).reduce((sum, value) => sum + value, 0);
      if (rating.total_score !== total) errors.push('observations.' + row.work_item_id + ': rating total_score does not equal component sum');
    }
    if (row.arm === 'agent_with_protocol' && row.status === 'completed'
        && ['not_applicable', null].includes(row.protocol_adherence)) {
      errors.push('observations.' + row.work_item_id + ': completed protocol arm must record adherence');
    }
    if (row.arm !== 'agent_with_protocol' && row.protocol_adherence !== null
        && row.protocol_adherence !== 'not_applicable') {
      errors.push('observations.' + row.work_item_id + ': protocol adherence is only applicable in the protocol arm');
    }
    if (row.safety_events.some(event => event.severity === 'severe' && event.stopped_work !== true)) {
      errors.push('observations.' + row.work_item_id + ': every severe safety event must stop work');
    }
  }

  if (plan && completedRows.length) {
    const selected = selectedSecondRatingWorkItemIds(completedRows, plan);
    const [primaryRater, secondRater] = plan.outcomes.quality_measurement.rater_ids;
    for (const row of completedRows) {
      const raterIds = row.quality_ratings.map(rating => rating.rater_id);
      if (!raterIds.includes(primaryRater)) {
        errors.push('observations.' + row.work_item_id + ': completed item is missing the frozen primary rater');
      }
      const hasSecond = raterIds.includes(secondRater);
      if (hasSecond !== selected.has(row.work_item_id)) {
        errors.push('observations.' + row.work_item_id + ': second rating does not follow the frozen arm-by-task-block selection');
      }
    }
  }

  for (const status of data.participant_status) {
    const participantRows = rowsByParticipant.get(status.participant_id) || [];
    const completePeriods = [1, 2, 3].filter(period => {
      const periodRows = participantRows.filter(row => row.period === period);
      return periodRows.length > 0 && periodRows.every(row => row.status === 'completed');
    }).length;
    if (completePeriods !== status.periods_completed) {
      errors.push('observations.' + status.participant_id + ': periods_completed is ' + status.periods_completed + ', mechanically derived ' + completePeriods);
    }
    if (status.final_status === 'completed') {
      if (completePeriods !== 3 || participantRows.some(row => row.status !== 'completed')) {
        errors.push('observations.' + status.participant_id + ': completed participant must complete every planned roster item');
      }
    }
    if (!status.started && participantRows.some(row => ['started', 'completed'].includes(row.status))) {
      errors.push('observations.' + status.participant_id + ': participant marked not started has started/completed roster items');
    }
  }
  return errors;
}

function validateFollowUp(data, plan, assignment, observations) {
  const errors = [];
  addSchemaErrors(errors, 'follow_up', 'pilot-follow-up.schema.json', data);
  if (errors.length) return errors;
  if (plan && data.pilot_id !== plan.pilot_id) errors.push('follow_up.pilot_id does not match plan.pilot_id');
  if (plan && data.study_stage !== plan.study_stage) errors.push('follow_up.study_stage does not match plan.study_stage');
  if (plan && data.plan_sha256 !== sha256Object(plan)) errors.push('follow_up.plan_sha256 does not bind the supplied frozen plan');
  if (assignment && data.assignment_sha256 !== sha256Object(assignment)) errors.push('follow_up.assignment_sha256 does not bind the supplied assignment');
  if (observations && data.observations_sha256 !== sha256Object(observations)) errors.push('follow_up.observations_sha256 does not bind the supplied observations');
  if (observations && data.synthetic_example !== observations.synthetic_example) {
    errors.push('follow_up.synthetic_example must match observations.synthetic_example');
  }
  if (plan && observations && plan.follow_up.anchor_date !== observations.recorded_through) {
    errors.push('follow_up: frozen anchor_date must equal observations.recorded_through');
  }

  const expectedIds = assignment
    ? assignment.assignments.map(x => x.participant_id)
    : observations ? observations.participant_status.map(x => x.participant_id) : [];
  const known = new Set(expectedIds);
  const keys = data.records.map(x => x.participant_id + '/' + x.day);
  if (duplicates(keys).length) errors.push('follow_up has duplicate participant/day records: ' + duplicates(keys).join(', '));
  for (const r of data.records) {
    if (known.size && !known.has(r.participant_id)) errors.push('follow_up.' + r.participant_id + '/' + r.day + ': participant is unknown');
    const measures = [
      r.workflow_still_in_use,
      r.protocol_use_frequency,
      r.would_adopt,
      r.help_request_count,
      r.facilitator_support_min,
      r.cognitive_burden_1_to_7,
      r.material_error_count,
      r.safety_event_count
    ];
    if (r.status === 'completed') {
      if (r.completed_date === null || measures.some(x => x === null)) {
        errors.push('follow_up.' + r.participant_id + '/' + r.day + ': completed record requires a date and all quantitative/categorical measures');
      }
    } else {
      if (r.completed_date !== null || measures.some(x => x !== null)) {
        errors.push('follow_up.' + r.participant_id + '/' + r.day + ': non-completed record must use null for date and measures');
      }
    }
    if (plan) {
      const followUpPlan = plan.follow_up['day_' + r.day];
      const anchorMs = Date.parse(plan.follow_up.anchor_date + 'T00:00:00Z');
      const dueMs = anchorMs + r.day * 86400000;
      const expectedDue = new Date(dueMs).toISOString().slice(0, 10);
      if (r.due_date !== expectedDue) {
        errors.push('follow_up.' + r.participant_id + '/' + r.day + ': due_date does not match the frozen anchor date');
      }
      if (r.status === 'completed') {
        const completedMs = Date.parse(r.completed_date + 'T00:00:00Z');
        const windowMs = followUpPlan.window_days * 86400000;
        if (completedMs < dueMs - windowMs || completedMs > dueMs + windowMs) {
          errors.push('follow_up.' + r.participant_id + '/' + r.day + ': completed_date is outside the frozen follow-up window');
        }
      }
    }
  }
  if (known.size) {
    for (const id of known) {
      for (const day of [30, 90]) {
        if (!keys.includes(id + '/' + day)) errors.push('follow_up.' + id + ': missing explicit day-' + day + ' record');
      }
    }
  }
  return errors;
}

function validateBundle(bundle, options = {}) {
  const errors = [];
  if (!bundle.plan) return ['plan is required'];
  errors.push(...validatePlan(bundle.plan, options));
  if (bundle.taskBank) {
    errors.push(...validateTaskBank(bundle.taskBank));
    const bindingErrors = [];
    const frozenTaskBank = readBoundJSON(
      bundle.plan.trial.task_bank_path,
      bundle.plan.trial.task_bank_sha256,
      'trial.task_bank',
      bindingErrors
    );
    if (frozenTaskBank && canonical(frozenTaskBank) !== canonical(bundle.taskBank)) {
      errors.push('supplied task bank does not match the hash-bound task-bank artifact in the plan');
    }
  }
  if ((bundle.assignment || bundle.observations || options.runReady) && !bundle.taskBank) {
    errors.push('frozen task bank is required with assignment, observations, or run-ready validation');
  }
  if (bundle.assignment) errors.push(...validateAssignment(bundle.assignment, bundle.plan, bundle.taskBank));
  else if (options.runReady) errors.push('run-ready gate failed: assignment file is required');
  if (options.runReady && bundle.assignment && bundle.assignment.seed_source === 'example_only') {
    errors.push('run-ready gate failed: example allocation cannot be used for a live pilot');
  }
  if (bundle.observations) errors.push(...validateObservations(bundle.observations, bundle.plan, bundle.assignment, bundle.taskBank));
  if (bundle.followUp) errors.push(...validateFollowUp(bundle.followUp, bundle.plan, bundle.assignment, bundle.observations));
  return errors;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--run-ready') out.runReady = true;
    else if (['--plan', '--task-bank', '--assignment', '--observations', '--follow-up'].includes(a)) {
      if (!argv[i + 1]) throw new Error(a + ' requires a file path');
      out[a.slice(2).replace('-', '')] = argv[++i];
    } else throw new Error('unknown argument: ' + a);
  }
  return out;
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
    if (!args.plan) throw new Error('usage: node tools/pilot-validate.js --plan FILE [--task-bank FILE] [--assignment FILE] [--observations FILE] [--follow-up FILE] [--run-ready]');
    const plan = readJSON(args.plan);
    const taskBankPath = args.taskbank || path.join(U.ROOT, plan.trial.task_bank_path);
    const bundle = {
      plan,
      taskBank: fs.existsSync(taskBankPath) ? readJSON(taskBankPath) : null,
      assignment: args.assignment ? readJSON(args.assignment) : null,
      observations: args.observations ? readJSON(args.observations) : null,
      followUp: args.followup ? readJSON(args.followup) : null
    };
    const errors = validateBundle(bundle, { runReady: Boolean(args.runReady) });
    if (errors.length) {
      console.error('pilot validation: FAIL (' + errors.length + ')');
      errors.forEach(e => console.error('  - ' + e));
      process.exit(1);
    }
    const fileCount = [args.plan, taskBankPath, args.assignment, args.observations, args.followup].filter(Boolean).length;
    console.log('pilot validation: PASS (' + fileCount + ' file(s))');
    console.log('  readiness: ' + bundle.plan.readiness.overall_decision + (args.runReady ? ' (run-ready gate applied)' : ''));
    console.log('  evidence boundary: validation checks structure and design; it does not establish impact');
  } catch (e) {
    console.error('pilot validation: ERROR: ' + e.message);
    process.exit(2);
  }
}

if (require.main === module) main();
module.exports = {
  ARMS,
  SEQUENCES,
  validatePlan,
  validateTaskBank,
  validateAssignment,
  validateObservations,
  validateFollowUp,
  validateBundle,
  tCritical95,
  selectedSecondRatingWorkItemIds,
  derivedQualityScore,
  derivedAcceptedOutput,
  sha256Object
};
