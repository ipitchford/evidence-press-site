#!/usr/bin/env node
'use strict';

/*
 * Positive, boundary, and known-bad controls for the company feasibility kit.
 * All generated outcomes are fictional. No model, network, or company data are
 * used, and nothing in this file is impact evidence. Apache-2.0.
 */
const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const U = require('./lib/util');
const { randomize } = require('./pilot-randomize');
const {
  validatePlan,
  validateTaskBank,
  validateAssignment,
  validateObservations,
  validateFollowUp,
  validateBundle,
  tCritical95,
  selectedSecondRatingWorkItemIds,
  derivedAcceptedOutput,
  sha256Object
} = require('./pilot-validate');
const { summarize } = require('./pilot-summary');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  PASS ' + name);
  } catch (e) {
    console.error('  FAIL ' + name + ': ' + e.message);
    process.exitCode = 1;
  }
}

function absolute(rel) {
  return path.join(U.ROOT, rel);
}

function read(rel) {
  return JSON.parse(fs.readFileSync(absolute(rel), 'utf8'));
}

function fileSha256(rel) {
  return crypto.createHash('sha256').update(fs.readFileSync(absolute(rel))).digest('hex');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const RUN_READY_TASK_BANK = 'company-pilot/fixtures/run-ready-control/task-bank.json';

function readyPlan() {
  const plan = read('company-pilot/templates/pilot-plan.template.json');
  plan.pilot_id = 'run-ready-validation-control';
  plan.status = 'ready';
  plan.trial.seed_source = 'password_manager_random';
  plan.workflow.name = 'Redacted weekly notes to draft action plan';
  plan.workflow.description = 'A repeatable read-only extraction of source-linked actions from non-sensitive weekly notes.';
  plan.workflow.workflow_owner_role = 'operations manager';
  plan.workflow.affected_people_groups = ['participating operations staff'];
  plan.workflow.current_manual_process = 'An operations worker reads the notes, drafts an action list, and a manager checks every source link.';
  plan.readiness.assessed_by_role = 'independent pilot reviewer';
  plan.governance.executive_sponsor_role = 'validation-control sponsor';
  plan.governance.pilot_owner_role = 'validation-control pilot owner';
  plan.governance.workflow_owner_role = 'operations manager';
  plan.governance.data_owner_role = 'test data custodian';
  plan.governance.affected_people_representative_role = 'participating worker representative';
  plan.worker_protections.consultation_note = 'The validation-control worker representative reviewed the fictional design.';
  plan.worker_protections.consent_record_destination = 'restricted validation-control consent register';
  plan.data_governance.destination = 'restricted pilot validation-control folder';
  plan.data_governance.data_owner_role = 'test data custodian';
  plan.trial.agent_model_identifier = 'test-model-fixed-version';
  plan.trial.agent_configuration_path = 'company-pilot/fixtures/run-ready-control/agent-configuration.json';
  plan.trial.agent_configuration_sha256 = fileSha256(plan.trial.agent_configuration_path);
  plan.trial.bare_agent_prompt_path = 'company-pilot/fixtures/run-ready-control/bare-agent-prompt.txt';
  plan.trial.bare_agent_prompt_sha256 = fileSha256(plan.trial.bare_agent_prompt_path);
  plan.trial.task_bank_path = RUN_READY_TASK_BANK;
  plan.trial.task_bank_sha256 = fileSha256(RUN_READY_TASK_BANK);
  plan.trial.sample_size.calculation_note = 'Validation-control feasibility rationale: one balanced six-worker block tests recruitment, completion, variance capture and interval reporting, not a confirmatory effect.';
  plan.trial.preregistration_path = 'company-pilot/fixtures/run-ready-control/analysis-plan.md';
  plan.trial.preregistration_sha256 = fileSha256(plan.trial.preregistration_path);
  plan.incident_and_rollback.incident_contact_channel = 'internal validation-control incident queue';
  plan.readiness.overall_decision = 'GO';
  plan.readiness.rationale = 'Fictional validation control: all machine-checkable prerequisites are represented as complete.';
  for (const check of plan.readiness.checks) {
    check.result = 'PASS';
    check.evidence = 'Fictional validation-control evidence for validator discrimination.';
  }
  for (const approval of plan.approvals) {
    approval.status = 'approved';
    approval.date = '2026-09-01';
  }
  return plan;
}

function taskBankFor(plan) {
  return read(plan.trial.task_bank_path);
}

function assignmentFor(boundPlan) {
  const input = read('company-pilot/templates/randomization-input.template.json');
  input.pilot_id = boundPlan.pilot_id;
  input.seed_source = boundPlan.trial.seed_source;
  return randomize(
    input,
    boundPlan,
    taskBankFor(boundPlan),
    fileSha256(boundPlan.trial.task_bank_path)
  );
}

function ratingFor(arm, raterId) {
  const components = {
    manual: [21, 21, 16, 12, 12],
    agent_without_protocol: [22, 22, 17, 13, 12],
    agent_with_protocol: [23, 23, 18, 13, 13]
  }[arm].slice();
  if (raterId === 'R002') components[4] -= 1;
  const names = [
    'actionable_completeness',
    'source_traceability',
    'faithful_type_and_certainty',
    'owner_and_deadline_accuracy',
    'limitations_and_injection_handling'
  ];
  const componentScores = Object.fromEntries(names.map((name, index) => [name, components[index]]));
  return {
    rater_id: raterId,
    component_scores: componentScores,
    total_score: components.reduce((sum, value) => sum + value, 0)
  };
}

function applyFrozenSecondRatings(roster, plan) {
  for (const row of roster) row.quality_ratings = row.quality_ratings.filter(rating => rating.rater_id !== 'R002');
  const selected = selectedSecondRatingWorkItemIds(roster, plan);
  for (const row of roster) {
    if (selected.has(row.work_item_id)) row.quality_ratings.push(ratingFor(row.arm, 'R002'));
  }
}

function observationsFor(a, boundPlan) {
  const participantStatus = a.assignments.map(row => ({
    participant_id: row.participant_id,
    sequence_id: row.sequence_id,
    consent_confirmed: true,
    started: true,
    final_status: 'completed',
    periods_completed: 3,
    reason_category: 'none',
    retain_pre_withdrawal_data_authorized: true
  }));
  const roster = [];
  a.assignments.forEach((worker, workerIndex) => {
    worker.planned_work_items.forEach((planned, taskIndex) => {
      const base = {
        manual: { effort: 40, elapsed: 50, rework: 2, burden: 5, adopt: false, help: 1, support: 0, approval: 8, cost: 0 },
        agent_without_protocol: { effort: 29, elapsed: 24, rework: 1, burden: 4, adopt: true, help: 1, support: 3, approval: 7, cost: 0.04 },
        agent_with_protocol: { effort: 24, elapsed: 27, rework: 1, burden: 3, adopt: true, help: 0, support: 2, approval: 5, cost: 0.05 }
      }[planned.arm];
      const ratings = [ratingFor(planned.arm, 'R001')];
      roster.push({
        participant_id: worker.participant_id,
        work_item_id: planned.work_item_id,
        sequence_id: worker.sequence_id,
        period: planned.period,
        arm: planned.arm,
        task_block_id: planned.task_block_id,
        task_id: planned.task_id,
        status: 'completed',
        intercurrent_event: 'none',
        missing_reason: 'not_missing',
        human_effort_min: base.effort + workerIndex + (taskIndex % 2),
        elapsed_time_min: base.elapsed + workerIndex + (taskIndex % 2),
        rework_count: base.rework,
        quality_ratings: ratings,
        material_error_count: 0,
        cognitive_burden_1_to_7: base.burden,
        would_adopt: base.adopt,
        help_request_count: base.help,
        facilitator_support_min: base.support,
        approver_checker_min: base.approval,
        model_tool_cost_usd: base.cost,
        safety_events: [],
        contamination_detected: false,
        protocol_adherence: planned.arm === 'agent_with_protocol' ? 'full' : 'not_applicable'
      });
    });
  });
  applyFrozenSecondRatings(roster, boundPlan);
  return {
    schema_version: '2.0',
    pilot_id: a.pilot_id,
    study_stage: 'feasibility',
    plan_sha256: sha256Object(boundPlan),
    assignment_sha256: sha256Object(a),
    task_bank_sha256: a.task_bank_sha256,
    synthetic_example: true,
    recorded_through: '2026-10-15',
    participant_status: participantStatus,
    work_item_roster: roster
  };
}

function followUpFor(a, boundPlan, boundObservations) {
  const records = [];
  for (const worker of a.assignments) {
    for (const day of [30, 90]) {
      records.push({
        participant_id: worker.participant_id,
        day,
        due_date: day === 30 ? '2026-11-14' : '2027-01-13',
        status: 'completed',
        completed_date: day === 30 ? '2026-11-14' : '2027-01-13',
        workflow_still_in_use: true,
        protocol_use_frequency: day === 30 ? 'weekly' : 'monthly',
        would_adopt: true,
        help_request_count: 0,
        facilitator_support_min: 0,
        cognitive_burden_1_to_7: 3,
        material_error_count: 0,
        safety_event_count: 0,
        local_changes: 'No local change in this fictional validation control.',
        reasons_for_non_use: null
      });
    }
  }
  return {
    schema_version: '2.0',
    pilot_id: a.pilot_id,
    study_stage: 'feasibility',
    plan_sha256: sha256Object(boundPlan),
    assignment_sha256: sha256Object(a),
    observations_sha256: sha256Object(boundObservations),
    synthetic_example: true,
    records
  };
}

function clearObservedOutcomes(row) {
  for (const field of [
    'human_effort_min', 'elapsed_time_min', 'rework_count', 'material_error_count',
    'cognitive_burden_1_to_7', 'would_adopt', 'help_request_count',
    'facilitator_support_min', 'approver_checker_min', 'model_tool_cost_usd',
    'contamination_detected', 'protocol_adherence'
  ]) row[field] = null;
  row.quality_ratings = [];
  row.safety_events = [];
}

function mutate(kind, bases) {
  if (kind === 'allow_sensitive_data') {
    const x = clone(bases.plan);
    x.data_governance.sensitive_or_special_category_data_allowed = true;
    return { errors: validatePlan(x), value: x };
  }
  if (kind === 'remove_manual_comparator') {
    const x = clone(bases.plan);
    x.trial.arms = ['agent_without_protocol', 'agent_without_protocol', 'agent_with_protocol'];
    return { errors: validatePlan(x), value: x };
  }
  if (kind === 'disable_voluntary_consent') {
    const x = clone(bases.plan);
    x.worker_protections.voluntary_informed_consent = false;
    return { errors: validatePlan(x), value: x };
  }
  if (kind === 'declare_go_with_unknown_checks') {
    const x = read('company-pilot/templates/pilot-plan.template.json');
    x.readiness.overall_decision = 'GO';
    return { errors: validatePlan(x), value: x };
  }
  if (kind === 'change_study_stage_to_controlled') {
    const x = clone(bases.plan);
    x.study_stage = 'controlled';
    return { errors: validatePlan(x), value: x };
  }
  if (kind === 'tamper_task_input_hash') {
    const x = clone(bases.taskBank);
    x.blocks[0].tasks[0].input_sha256 = 'f'.repeat(64);
    return { errors: validateTaskBank(x), value: x };
  }
  if (kind === 'put_everyone_in_MAP') {
    const x = clone(bases.assignment);
    x.assignments.forEach(row => {
      row.sequence_id = 'MAP';
      row.period_1 = 'manual';
      row.period_2 = 'agent_without_protocol';
      row.period_3 = 'agent_with_protocol';
    });
    return { errors: validateAssignment(x, bases.plan, bases.taskBank), value: x };
  }
  if (kind === 'substitute_first_participant') {
    const x = clone(bases.assignment);
    x.assignments[0].participant_id = 'P999';
    return { errors: validateAssignment(x, bases.plan, bases.taskBank), value: x };
  }
  if (kind === 'repeat_first_task_block') {
    const x = clone(bases.assignment);
    x.assignments[0].period_1_task_block_id = x.assignments[0].period_2_task_block_id;
    return { errors: validateAssignment(x, bases.plan, bases.taskBank), value: x };
  }
  if (kind === 'change_first_observation_arm') {
    const x = clone(bases.observations);
    x.work_item_roster[0].arm = x.work_item_roster[0].arm === 'manual' ? 'agent_without_protocol' : 'manual';
    return { errors: validateObservations(x, bases.plan, bases.assignment, bases.taskBank), value: x };
  }
  if (kind === 'mark_randomized_participant_excluded_before_randomization') {
    const x = clone(bases.observations);
    x.participant_status[0].final_status = 'excluded_before_randomization';
    return { errors: validateObservations(x, bases.plan, bases.assignment, bases.taskBank), value: x };
  }
  if (kind === 'remove_planned_roster_item') {
    const x = clone(bases.observations);
    x.work_item_roster.shift();
    return { errors: validateObservations(x, bases.plan, bases.assignment, bases.taskBank), value: x };
  }
  if (kind === 'break_rating_total') {
    const x = clone(bases.observations);
    x.work_item_roster[0].quality_ratings[0].total_score += 1;
    return { errors: validateObservations(x, bases.plan, bases.assignment, bases.taskBank), value: x };
  }
  if (kind === 'remove_second_ratings') {
    const x = clone(bases.observations);
    x.work_item_roster.forEach(row => { row.quality_ratings = row.quality_ratings.slice(0, 1); });
    return { errors: validateObservations(x, bases.plan, bases.assignment, bases.taskBank), value: x };
  }
  if (kind === 'cluster_second_ratings_in_protocol_arm') {
    const x = clone(bases.observations);
    x.work_item_roster.forEach(row => { row.quality_ratings = row.quality_ratings.slice(0, 1); });
    const required = selectedSecondRatingWorkItemIds(x.work_item_roster, bases.plan).size;
    x.work_item_roster
      .filter(row => row.arm === 'agent_with_protocol')
      .slice(0, required)
      .forEach(row => row.quality_ratings.push(ratingFor(row.arm, 'R002')));
    return { errors: validateObservations(x, bases.plan, bases.assignment, bases.taskBank), value: x };
  }
  if (kind === 'set_negative_model_cost') {
    const x = clone(bases.observations);
    x.work_item_roster[0].model_tool_cost_usd = -0.01;
    return { errors: validateObservations(x, bases.plan, bases.assignment, bases.taskBank), value: x };
  }
  if (kind === 'remove_first_participant_day90') {
    const x = clone(bases.followUp);
    const id = bases.assignment.assignments[0].participant_id;
    x.records = x.records.filter(row => !(row.participant_id === id && row.day === 90));
    return { errors: validateFollowUp(x, bases.plan, bases.assignment, bases.observations), value: x };
  }
  if (kind === 'move_day30_completion_to_2099') {
    const x = clone(bases.followUp);
    x.records.find(row => row.day === 30).completed_date = '2099-01-01';
    return { errors: validateFollowUp(x, bases.plan, bases.assignment, bases.observations), value: x };
  }
  throw new Error('unknown known-bad mutation: ' + kind);
}

console.log('# company pilot tests (fictional controls; no model and no impact evidence)');

const plan = readyPlan();
const taskBank = taskBankFor(plan);
const assignment = assignmentFor(plan);
const observations = observationsFor(assignment, plan);
const followUp = followUpFor(assignment, plan, observations);
const bases = { plan, taskBank, assignment, observations, followUp };

test('all pilot schemas and JSON templates parse', () => {
  const files = [
    ...fs.readdirSync(absolute('schema')).filter(name => name.startsWith('pilot-')).map(name => 'schema/' + name),
    ...fs.readdirSync(absolute('company-pilot/templates')).filter(name => name.endsWith('.json')).map(name => 'company-pilot/templates/' + name),
    RUN_READY_TASK_BANK
  ];
  files.forEach(read);
});

test('fail-closed draft plan validates but is not run-ready', () => {
  const draft = read('company-pilot/templates/pilot-plan.template.json');
  assert.deepStrictEqual(validatePlan(draft), []);
  assert(validatePlan(draft, { runReady: true }).some(error => error.includes('run-ready gate failed')));
});

test('status toggles cannot bypass placeholders or the synthetic task bank', () => {
  const unsafe = read('company-pilot/templates/pilot-plan.template.json');
  unsafe.status = 'ready';
  unsafe.trial.seed_source = 'password_manager_random';
  unsafe.readiness.overall_decision = 'GO';
  unsafe.readiness.checks.forEach(check => { check.result = 'PASS'; });
  unsafe.approvals.forEach(approval => { approval.status = 'approved'; approval.date = '2026-09-01'; });
  const errors = validatePlan(unsafe, { runReady: true });
  assert(errors.some(error => error.includes('placeholder')));
  assert(errors.some(error => error.includes('synthetic task bank')));
});

test('feasibility-only ready plan, frozen task bank and balanced allocation pass', () => {
  assert.deepStrictEqual(validateBundle({ plan, taskBank, assignment }, { runReady: true }), []);
  assert.strictEqual(plan.study_stage, 'feasibility');
  assert.strictEqual(plan.trial.sample_size.powered_for_confirmatory_effect, false);
});

test('Student-t 95% critical values remain finite-df correct beyond df 30', () => {
  assert.strictEqual(tCritical95(30), 2.042);
  assert(Math.abs(tCritical95(31) - 2.039513) < 0.000003);
  assert(Math.abs(tCritical95(60) - 2.000298) < 0.000003);
  assert(Math.abs(tCritical95(120) - 1.979930) < 0.000003);
  assert(tCritical95(31) < tCritical95(30));
  assert(tCritical95(120) > 1.959963984540054);

  const boundary = clone(plan);
  boundary.trial.sample_size.target_randomized_workers = 36;
  boundary.trial.sample_size.expected_attrition_fraction = 0.1;
  boundary.trial.sample_size.minimum_complete_pairs_target = 32;
  const requiredHalfWidth = tCritical95(31)
    * boundary.trial.sample_size.paired_sd_assumption_min / Math.sqrt(32);
  boundary.trial.sample_size.target_ci_half_width_min = requiredHalfWidth - 0.0001;
  assert(validatePlan(boundary).some(error => error.includes('more optimistic')));
  boundary.trial.sample_size.target_ci_half_width_min = requiredHalfWidth;
  assert.deepStrictEqual(validatePlan(boundary), []);
});

test('randomization is deterministic, task-balanced and omits the private seed', () => {
  const again = assignmentFor(plan);
  assert.deepStrictEqual(assignment, again);
  assert.strictEqual('seed' in assignment, false);
  assert.strictEqual(assignment.task_bank_sha256, plan.trial.task_bank_sha256);
  assert.strictEqual(new Set(assignment.assignments.flatMap(row => row.planned_work_items.map(item => item.work_item_id))).size, 36);
  for (const arm of ['manual', 'agent_without_protocol', 'agent_with_protocol']) {
    const counts = Object.fromEntries(taskBank.blocks.map(block => [block.block_id, 0]));
    assignment.assignments.forEach(row => row.planned_work_items
      .filter(item => item.arm === arm && item.task_id.endsWith('1') || item.arm === arm && item.task_id.endsWith('3') || item.arm === arm && item.task_id.endsWith('5'))
      .forEach(item => { counts[item.task_block_id]++; }));
    assert.strictEqual(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)), 0);
  }
});

test('post-allocation plan mutation breaks every downstream binding', () => {
  const changed = clone(plan);
  changed.analysis.smallest_worthwhile_improvement_min += 1;
  assert(validateAssignment(assignment, changed, taskBank).some(error => error.includes('plan_sha256')));
  assert(validateObservations(observations, changed, assignment, taskBank).some(error => error.includes('plan_sha256')));
  assert(validateFollowUp(followUp, changed, assignment, observations).some(error => error.includes('plan_sha256')));
});

test('complete fictional roster and explicit day-30/day-90 follow-up validate', () => {
  assert.deepStrictEqual(validateBundle({ plan, taskBank, assignment, observations, followUp }), []);
  assert.strictEqual(observations.work_item_roster.length, 36);
});

test('nullable missing outcomes remain in the roster and validate explicitly', () => {
  const partial = clone(observations);
  const missing = partial.work_item_roster[0];
  missing.status = 'missing';
  missing.intercurrent_event = 'technical_failure';
  missing.missing_reason = 'technical';
  clearObservedOutcomes(missing);
  applyFrozenSecondRatings(partial.work_item_roster, plan);
  const status = partial.participant_status.find(row => row.participant_id === missing.participant_id);
  status.final_status = 'active';
  status.periods_completed = 2;
  status.reason_category = 'technical';
  assert.deepStrictEqual(validateObservations(partial, plan, assignment, taskBank), []);
  assert.strictEqual(partial.work_item_roster.length, observations.work_item_roster.length);
  assert.strictEqual(derivedAcceptedOutput(missing, plan), null);
});

test('one missing planned primary task removes that worker from the complete-pair count', () => {
  const partial = clone(observations);
  const missing = partial.work_item_roster.find(row => row.arm === 'agent_with_protocol');
  missing.status = 'missing';
  missing.intercurrent_event = 'technical_failure';
  missing.missing_reason = 'technical';
  clearObservedOutcomes(missing);
  applyFrozenSecondRatings(partial.work_item_roster, plan);
  const status = partial.participant_status.find(row => row.participant_id === missing.participant_id);
  status.final_status = 'active';
  status.periods_completed = 2;
  status.reason_category = 'technical';
  assert.deepStrictEqual(validateObservations(partial, plan, assignment, taskBank), []);
  const result = summarize({ plan, taskBank, assignment, observations: partial, followUp: null });
  assert.strictEqual(result.primary_descriptive_estimand.estimate.n_pairs, 5);
  assert.strictEqual(result.attrition.complete_primary_pairs, 5);
  assert.strictEqual(result.attrition.missing_primary_pairs, 1);
});

test('quality and acceptance are mechanically derived, not supplied outcomes', () => {
  const row = observations.work_item_roster[0];
  assert.strictEqual('quality_score' in row, false);
  assert.strictEqual('accepted_output' in row, false);
  assert.strictEqual(derivedAcceptedOutput(row, plan), true);
  const failed = clone(row);
  failed.material_error_count = 1;
  assert.strictEqual(derivedAcceptedOutput(failed, plan), false);
});

test('summary is descriptive feasibility output with visible total resource and cost', () => {
  const result = summarize({ plan, taskBank, assignment, observations, followUp });
  assert.strictEqual(result.claim_status, 'SYNTHETIC_EXAMPLE_NOT_EVIDENCE');
  assert.strictEqual(result.primary_descriptive_estimand.controlled_effect_interpretation_allowed, false);
  assert.strictEqual(result.primary_descriptive_estimand.estimate.n_pairs, 6);
  assert.strictEqual(result.attrition.assigned, 6);
  assert(result.descriptive_vector.protocol_vs_agent_only.some(row => row.metric === 'total_human_resource_min'));
  assert(result.descriptive_vector.protocol_vs_agent_only.some(row => row.metric === 'model_tool_cost_usd'));
  assert.strictEqual(result.follow_up.day_30.expected, 6);
  assert.strictEqual(result.feasibility_indicators.effect_gate_or_scale_recommendation, 'not_computed');
  assert(result.feasibility_indicators.support_resource.total_human_resource_min.sum_observed > 0);
  assert(result.feasibility_indicators.support_resource.model_tool_cost_usd.sum_observed > 0);
  assert.strictEqual(result.feasibility_indicators.support_resource.participant_effort_min.n_observed, 36);
  assert.strictEqual(result.feasibility_indicators.support_resource.participant_effort_min.coverage_fraction, 1);
  assert.strictEqual('decision_signals' in result, false);
});

test('feasibility resource totals retain recorded effort on incomplete items', () => {
  const partial = clone(observations);
  const row = partial.work_item_roster[0];
  row.status = 'missing';
  row.intercurrent_event = 'workload_interrupt';
  row.missing_reason = 'workload';
  row.facilitator_support_min = 1000;
  row.approver_checker_min = null;
  applyFrozenSecondRatings(partial.work_item_roster, plan);
  const status = partial.participant_status.find(item => item.participant_id === row.participant_id);
  status.final_status = 'active';
  status.periods_completed = 2;
  status.reason_category = 'workload';
  assert.deepStrictEqual(validateObservations(partial, plan, assignment, taskBank), []);
  const result = summarize({ plan, taskBank, assignment, observations: partial, followUp: null });
  const resources = result.feasibility_indicators.support_resource;
  assert(resources.facilitator_support_min.sum_observed >= 1000);
  assert.strictEqual(resources.approver_checker_min.n_observed, 35);
  assert.strictEqual(resources.total_human_resource_min.n_observed, 35);
  assert(Math.abs(resources.approver_checker_min.coverage_fraction - 35 / 36) < 0.000001);
});

const badDir = absolute('company-pilot/fixtures/known-bad');
for (const file of fs.readdirSync(badDir).filter(name => name.endsWith('.json')).sort()) {
  test('reject known-bad control ' + file, () => {
    const spec = JSON.parse(fs.readFileSync(path.join(badDir, file), 'utf8'));
    const result = mutate(spec.mutation, bases);
    assert(result.errors.length > 0, 'validator accepted known-bad mutation');
    assert(result.errors.some(error => error.includes(spec.expected_error)), 'expected error not found: ' + result.errors.join(' | '));
  });
}

if (!process.exitCode) console.log('pilot tests: PASS (' + passed + ' checks)');
