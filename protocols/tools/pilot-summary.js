#!/usr/bin/env node
'use strict';

/*
 * Dependency-free feasibility summary. Work items are averaged within worker
 * and arm before paired descriptive contrasts. This crossover cannot identify
 * a controlled impact effect because protocol learning is irreversible.
 * Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const U = require('./lib/util');
const {
  validateBundle,
  ARMS,
  SEQUENCES,
  tCritical95,
  derivedQualityScore,
  derivedAcceptedOutput
} = require('./pilot-validate');

const METRICS = [
  'human_effort_min',
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
  'safety_event_count',
  'accepted_output'
];
const DIRECTIONS = {
  human_effort_min: 'lower_is_better',
  elapsed_time_min: 'lower_is_better',
  rework_count: 'lower_is_better',
  quality_score: 'higher_is_better',
  material_error_count: 'lower_is_better',
  cognitive_burden_1_to_7: 'lower_is_better',
  would_adopt: 'higher_is_better',
  help_request_count: 'lower_is_better',
  facilitator_support_min: 'lower_is_better',
  approver_checker_min: 'lower_is_better',
  total_human_resource_min: 'lower_is_better',
  model_tool_cost_usd: 'lower_is_better',
  safety_event_count: 'lower_is_better',
  accepted_output: 'higher_is_better'
};
function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function round(value) {
  return value == null || !Number.isFinite(value) ? null : Number(value.toFixed(6));
}

function mean(values) {
  const observed = values.filter(value => value != null && Number.isFinite(value));
  return observed.length ? observed.reduce((a, b) => a + b, 0) / observed.length : null;
}

function median(values) {
  const s = values.filter(value => value != null && Number.isFinite(value)).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function sd(values) {
  const observed = values.filter(value => value != null && Number.isFinite(value));
  if (observed.length < 2) return null;
  const m = mean(observed);
  return Math.sqrt(observed.reduce((sum, x) => sum + (x - m) ** 2, 0) / (observed.length - 1));
}

function ci95(values) {
  const observed = values.filter(value => value != null && Number.isFinite(value));
  if (observed.length < 2) return null;
  const m = mean(observed);
  const standardError = sd(observed) / Math.sqrt(observed.length);
  const df = observed.length - 1;
  const critical = tCritical95(df);
  return [round(m - critical * standardError), round(m + critical * standardError)];
}

function quantiles(values) {
  const observed = values.filter(value => value != null && Number.isFinite(value));
  if (!observed.length) return { min: null, median: null, max: null };
  return { min: round(Math.min(...observed)), median: round(median(observed)), max: round(Math.max(...observed)) };
}

function valueFor(row, metric, plan) {
  if (metric === 'quality_score') return derivedQualityScore(row);
  if (metric === 'safety_event_count') return row.status === 'planned' ? null : row.safety_events.length;
  if (metric === 'accepted_output') {
    const accepted = derivedAcceptedOutput(row, plan);
    return accepted === null ? null : (accepted ? 1 : 0);
  }
  if (metric === 'would_adopt') return row.would_adopt == null ? null : (row.would_adopt ? 1 : 0);
  if (metric === 'total_human_resource_min') {
    const values = [row.human_effort_min, row.facilitator_support_min, row.approver_checker_min];
    return values.some(value => value == null) ? null : values.reduce((a, b) => a + b, 0);
  }
  return row[metric];
}

function workerArmMeans(rows, plan) {
  const buckets = new Map();
  for (const row of rows) {
    const key = row.participant_id + '\0' + row.arm;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(row);
  }
  const result = new Map();
  for (const [key, bucket] of buckets) {
    const values = Object.fromEntries(METRICS.map(metric => [
      metric,
      mean(bucket.map(row => valueFor(row, metric, plan)))
    ]));
    values._all_planned_complete = Object.fromEntries(METRICS.map(metric => [
      metric,
      bucket.length > 0 && bucket.every(row => row.status === 'completed' && valueFor(row, metric, plan) != null)
    ]));
    result.set(key, values);
  }
  return result;
}

function armSummary(rows, arm, workerMeans) {
  const armRows = rows.filter(row => row.arm === arm);
  const workerIds = [...new Set(armRows.map(row => row.participant_id))];
  const metrics = {};
  for (const metric of METRICS) {
    const values = workerIds
      .map(id => workerMeans.get(id + '\0' + arm))
      .filter(Boolean)
      .map(worker => worker[metric])
      .filter(value => value != null);
    metrics[metric] = {
      n_workers_observed: values.length,
      mean_of_worker_means: round(mean(values)),
      distribution_of_worker_means: quantiles(values),
      direction: DIRECTIONS[metric],
      derived: ['quality_score', 'total_human_resource_min', 'accepted_output'].includes(metric)
    };
  }
  return {
    n_planned_work_items: armRows.length,
    n_completed_work_items: armRows.filter(row => row.status === 'completed').length,
    completed_fraction: round(armRows.length ? armRows.filter(row => row.status === 'completed').length / armRows.length : null),
    n_workers: workerIds.length,
    metrics
  };
}

function pairedContrast(assignment, workerMeans, armA, armB, metric) {
  const differences = [];
  const missing = [];
  for (const assignmentRow of assignment.assignments) {
    const left = workerMeans.get(assignmentRow.participant_id + '\0' + armA);
    const right = workerMeans.get(assignmentRow.participant_id + '\0' + armB);
    if (!left || !right
        || !left._all_planned_complete[metric] || !right._all_planned_complete[metric]
        || left[metric] == null || right[metric] == null) missing.push(assignmentRow.participant_id);
    else differences.push(left[metric] - right[metric]);
  }
  return {
    metric,
    contrast: armA + '_minus_' + armB,
    direction: DIRECTIONS[metric],
    n_assigned: assignment.assignments.length,
    n_pairs: differences.length,
    missing_pairs: missing.length,
    complete_pair_rule: 'all planned work items in both contrasted arms must be completed with the metric observed',
    mean_difference: round(mean(differences)),
    median_difference: round(median(differences)),
    ci_95_for_mean_difference: ci95(differences),
    ci_method: 'paired t interval on observed worker-level arm means; feasibility-descriptive and unadjusted',
    difference_distribution: quantiles(differences)
  };
}

function statusCounts(values) {
  const out = {};
  for (const value of values) out[value] = (out[value] || 0) + 1;
  return out;
}

function attritionSummary(observations, assignment, primaryContrast) {
  const statuses = observations.participant_status;
  const bySequence = {};
  for (const seq of Object.keys(SEQUENCES)) {
    const rows = statuses.filter(x => x.sequence_id === seq);
    bySequence[seq] = {
      assigned: assignment.assignments.filter(x => x.sequence_id === seq).length,
      started: rows.filter(x => x.started).length,
      final_status: statusCounts(rows.map(x => x.final_status))
    };
  }
  return {
    assigned: assignment.assignments.length,
    started: statuses.filter(x => x.started).length,
    final_status: statusCounts(statuses.map(x => x.final_status)),
    reason_category: statusCounts(statuses.map(x => x.reason_category)),
    complete_primary_pairs: primaryContrast.n_pairs,
    missing_primary_pairs: primaryContrast.missing_pairs,
    by_sequence: bySequence
  };
}

function followUpSummary(followUp) {
  if (!followUp) return null;
  const out = {};
  for (const day of [30, 90]) {
    const rows = followUp.records.filter(x => x.day === day);
    const completed = rows.filter(x => x.status === 'completed');
    out['day_' + day] = {
      expected: rows.length,
      status: statusCounts(rows.map(x => x.status)),
      completion_rate: round(rows.length ? completed.length / rows.length : null),
      completed_means: {
        workflow_still_in_use_rate: round(mean(completed.map(x => x.workflow_still_in_use ? 1 : 0))),
        would_adopt_rate: round(mean(completed.map(x => x.would_adopt ? 1 : 0))),
        help_request_count: round(mean(completed.map(x => x.help_request_count))),
        facilitator_support_min: round(mean(completed.map(x => x.facilitator_support_min))),
        cognitive_burden_1_to_7: round(mean(completed.map(x => x.cognitive_burden_1_to_7))),
        material_error_count: round(mean(completed.map(x => x.material_error_count))),
        safety_event_count: round(mean(completed.map(x => x.safety_event_count)))
      }
    };
  }
  return out;
}

function iccA1(rows, raterIds) {
  const paired = rows
    .map(row => {
      const byRater = new Map(row.quality_ratings.map(rating => [rating.rater_id, rating.total_score]));
      return raterIds.every(id => byRater.has(id)) ? raterIds.map(id => byRater.get(id)) : null;
    })
    .filter(Boolean);
  const n = paired.length;
  const k = raterIds.length;
  if (n < 2 || k < 2) return { method: 'ICC_A_1_absolute_agreement', n_double_rated: n, estimate: null };
  const rowMeans = paired.map(row => mean(row));
  const colMeans = raterIds.map((_, j) => mean(paired.map(row => row[j])));
  const grand = mean(paired.flat());
  const msRows = k * rowMeans.reduce((sum, value) => sum + (value - grand) ** 2, 0) / (n - 1);
  const msCols = n * colMeans.reduce((sum, value) => sum + (value - grand) ** 2, 0) / (k - 1);
  let residual = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < k; j++) residual += (paired[i][j] - rowMeans[i] - colMeans[j] + grand) ** 2;
  }
  const msError = residual / ((n - 1) * (k - 1));
  const denominator = msRows + (k - 1) * msError + k * (msCols - msError) / n;
  return {
    method: 'ICC_A_1_absolute_agreement',
    rater_ids: raterIds,
    n_double_rated: n,
    estimate: round(denominator === 0 ? null : (msRows - msError) / denominator)
  };
}

function observedResource(rows, valueForRow) {
  const values = rows.map(valueForRow).filter(value => value != null && Number.isFinite(value));
  return {
    n_roster_rows: rows.length,
    n_observed: values.length,
    coverage_fraction: round(rows.length ? values.length / rows.length : null),
    sum_observed: round(values.reduce((sum, value) => sum + value, 0))
  };
}

function feasibilityIndicators(plan, observations) {
  const rows = observations.work_item_roster;
  const completed = rows.filter(row => row.status === 'completed');
  const secondRated = completed.filter(row => row.quality_ratings.length >= 2).length;
  const severe = rows.reduce((count, row) => count + row.safety_events.filter(event => event.severity === 'severe').length, 0);
  const measuredCost = completed.filter(row => row.model_tool_cost_usd != null).length;
  return {
    study_stage: 'feasibility',
    effect_gate_or_scale_recommendation: 'not_computed',
    roster: {
      planned: rows.length,
      completed: completed.length,
      status: statusCounts(rows.map(row => row.status)),
      missing_reason: statusCounts(rows.filter(row => row.status !== 'completed').map(row => row.missing_reason)),
      intercurrent_event: statusCounts(rows.map(row => row.intercurrent_event))
    },
    measurement_process: {
      completed_fraction: round(rows.length ? completed.length / rows.length : null),
      second_rating_fraction_planned: plan.outcomes.quality_measurement.second_rating_fraction,
      second_rating_fraction_observed: round(completed.length ? secondRated / completed.length : null),
      completed_model_tool_cost_fraction_observed: round(completed.length ? measuredCost / completed.length : null)
    },
    protocol_process: {
      protocol_completed_items: completed.filter(row => row.arm === 'agent_with_protocol').length,
      adherence: statusCounts(completed.filter(row => row.arm === 'agent_with_protocol').map(row => row.protocol_adherence)),
      contamination_events: rows.filter(row => row.contamination_detected === true).length
    },
    support_resource: {
      scope: 'all roster rows with recorded values, including started, stopped and missing items',
      participant_effort_min: observedResource(rows, row => row.human_effort_min),
      facilitator_support_min: observedResource(rows, row => row.facilitator_support_min),
      approver_checker_min: observedResource(rows, row => row.approver_checker_min),
      total_human_resource_min: observedResource(rows, row => {
        const fields = [row.human_effort_min, row.facilitator_support_min, row.approver_checker_min];
        return fields.some(value => value == null) ? null : fields.reduce((sum, value) => sum + value, 0);
      }),
      model_tool_cost_usd: observedResource(rows, row => row.model_tool_cost_usd),
      help_request_count: observedResource(rows, row => row.help_request_count)
    },
    rating_reliability: iccA1(completed, plan.outcomes.quality_measurement.rater_ids),
    safety_process: {
      safety_events: rows.reduce((count, row) => count + row.safety_events.length, 0),
      severe_safety_events: severe,
      safety_stops: rows.filter(row => row.status === 'stopped_for_safety').length
    }
  };
}

function summarize(bundle) {
  const rows = bundle.observations.work_item_roster;
  const workerMeans = workerArmMeans(rows, bundle.plan);
  const protocolVsAgent = METRICS.map(metric => pairedContrast(
    bundle.assignment,
    workerMeans,
    'agent_with_protocol',
    'agent_without_protocol',
    metric
  ));
  const protocolVsManual = METRICS.map(metric => pairedContrast(
    bundle.assignment,
    workerMeans,
    'agent_with_protocol',
    'manual',
    metric
  ));
  const primary = protocolVsAgent.find(x => x.metric === 'human_effort_min');
  const limitations = [
    'This randomized crossover is feasibility-only and does not identify a controlled impact effect.',
    'Learning the protocol is irreversible, so later agent-only periods can remain contaminated despite counterbalancing and washout.',
    'A future controlled impact evaluation requires parallel randomization between agent-only and protocol arms; manual work remains secondary.',
    'Paired estimates use observed worker pairs and can be biased when attrition or missingness is informative.',
    'Intervals are unadjusted paired t intervals and may be unstable in a small or skewed feasibility sample.',
    'Adoption and burden are self-reported; rare or absent safety events do not demonstrate safety.'
  ];
  if (bundle.observations.synthetic_example) limitations.unshift('SYNTHETIC EXAMPLE: all values are fictional and are not evidence.');
  return {
    schema_version: '2.0',
    pilot_id: bundle.plan.pilot_id,
    study_stage: 'feasibility',
    recorded_through: bundle.observations.recorded_through,
    synthetic_example: bundle.observations.synthetic_example,
    claim_status: bundle.observations.synthetic_example
      ? 'SYNTHETIC_EXAMPLE_NOT_EVIDENCE'
      : 'FEASIBILITY_CROSSOVER_DESCRIPTIVE_NOT_CONTROLLED_EFFECT',
    primary_descriptive_estimand: {
      metric: 'human_effort_min',
      contrast: 'agent_with_protocol_minus_agent_without_protocol',
      population: 'randomized workers with every planned primary item completed and human effort observed in both contrasted arms',
      controlled_effect_interpretation_allowed: false,
      estimate: primary
    },
    secondary_manual_comparator: {
      contrast: 'agent_with_protocol_minus_manual',
      role: 'secondary descriptive comparator',
      estimates: protocolVsManual
    },
    descriptive_vector: {
      protocol_vs_agent_only: protocolVsAgent,
      protocol_vs_manual: protocolVsManual
    },
    arm_summaries: Object.fromEntries(ARMS.map(arm => [arm, armSummary(rows, arm, workerMeans)])),
    attrition: attritionSummary(bundle.observations, bundle.assignment, primary),
    follow_up: followUpSummary(bundle.followUp),
    feasibility_indicators: feasibilityIndicators(bundle.plan, bundle.observations),
    limitations
  };
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (['--plan', '--task-bank', '--assignment', '--observations', '--follow-up'].includes(a)) {
      if (!argv[i + 1]) throw new Error(a + ' requires a file path');
      out[a.slice(2).replace('-', '')] = argv[++i];
    } else throw new Error('unknown argument: ' + a);
  }
  for (const required of ['plan', 'assignment', 'observations']) {
    if (!out[required]) throw new Error('--' + required + ' FILE is required');
  }
  return out;
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const plan = readJSON(args.plan);
    const taskBankPath = args.taskbank || path.join(U.ROOT, plan.trial.task_bank_path);
    const bundle = {
      plan,
      taskBank: readJSON(taskBankPath),
      assignment: readJSON(args.assignment),
      observations: readJSON(args.observations),
      followUp: args.followup ? readJSON(args.followup) : null
    };
    const errors = validateBundle(bundle);
    if (errors.length) {
      console.error('pilot summary: input validation failed');
      errors.forEach(error => console.error('  - ' + error));
      process.exit(1);
    }
    process.stdout.write(JSON.stringify(summarize(bundle), null, 2) + '\n');
  } catch (e) {
    console.error('pilot summary: ERROR: ' + e.message);
    process.exit(2);
  }
}

if (require.main === module) main();
module.exports = { summarize, pairedContrast, ci95, iccA1 };
