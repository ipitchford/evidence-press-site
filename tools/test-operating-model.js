#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { clone, collectErrors, loadArtifacts, loadPaperMetadata } = require('./operating-model');
const publicationIntegrity = require('./check-publication-integrity');

const root = path.join(__dirname, '..');
const sourceArtifacts = loadArtifacts(root);
const sourcePapers = loadPaperMetadata(root);
let failures = 0;

function check(label, condition, detail = '') {
  if (condition) console.log(`ok      ${label}`);
  else {
    failures++;
    console.log(`FAIL    ${label}`);
    if (detail) console.log(`  ${detail}`);
  }
}

function errorsFor(mutator) {
  const artifacts = clone(sourceArtifacts);
  const papers = clone(sourcePapers);
  mutator({ artifacts, papers });
  return collectErrors({ root, papers, artifacts });
}

function attemptFor(slug, workId = `ep-work:${slug}`) {
  return {
    attemptId: `ep-attempt:${slug}`,
    workId,
    cohort: 'prospective',
    registeredAt: '2026-08-10T09:00:00Z',
    aims: ['science'],
    question: 'Can the synthetic validator fixture reach its declared decision object?',
    selectionBasis: 'Adversarial test coverage for the prospective authoring contract.',
    taskClass: 'synthetic-validator-fixture',
    status: 'release-candidate',
    statusAt: '2026-08-10T10:00:00Z',
    resultClass: 'partial',
    statusHistory: [
      {
        at: '2026-08-10T09:00:00Z',
        status: 'active',
        resultClass: 'pending',
        reason: 'Registered before synthetic work began.',
        evidenceRefs: []
      },
      {
        at: '2026-08-10T10:00:00Z',
        status: 'release-candidate',
        resultClass: 'partial',
        reason: 'Synthetic fixture is ready for validator evaluation.',
        evidenceRefs: []
      }
    ],
    decisionObjectTarget: 'A structurally valid prospective release receipt.',
    comparisonPlan: {
      status: 'planned',
      comparator: 'The same fixture without the operating-model contract.',
      estimand: 'Difference in malformed-record detection before build output.',
      matchedAssuranceEndpoint: 'Identical hostile mutation suite.',
      reason: 'This is a structural test comparison, not an acceleration estimate.'
    },
    measurement: {
      status: 'not-recorded',
      missingnessReason: 'Synthetic fixture; no workflow effect measurement was performed.',
      milestones: [],
      activeHumanMinutes: null,
      computeMinutes: null,
      computeCost: null,
      agentRuns: null,
      reworkMinutes: null,
      correctionCount: null
    },
    assuranceEndpoint: {
      status: 'not-recorded',
      assessedAt: null,
      dimensions: [],
      claimCeiling: null,
      evidenceRefs: [],
      missingnessReason: 'Synthetic fixture; no research assurance endpoint exists.'
    },
    releaseSlug: slug,
    stopReason: null,
    corrections: [],
    revisions: []
  };
}

function recordFor(slug, workId = `ep-work:${slug}`) {
  return {
    slug,
    operatingModel: {
      version: '1.0',
      workId,
      attemptIds: [`ep-attempt:${slug}`],
      aims: ['science'],
      artifactRoles: ['method-demonstration'],
      lineageId: null,
      accelerationPrimitives: ['certificate-first'],
      decisionObject: {
        type: 'certificate',
        description: 'A synthetic certificate used only by the hostile test.',
        scope: 'The synthetic operating-model validator fixture.'
      },
      bottleneckTargeted: ['assurance'],
      semanticBridge: {
        state: 'explicit',
        description: 'The fixture states its artificial source-to-encoding map.',
        remainingRisks: ['This is a validator fixture, not research evidence.']
      },
      humanJudgmentGates: ['Decide whether the synthetic fixture is suitable for the test.'],
      parentLinks: [],
      assuranceTarget: {
        dimensions: ['independentRerun', 'semanticValidation'],
        nextAction: 'Run the synthetic checker from an unaffiliated implementation.',
        claimCeiling: 'Structural fixture only.'
      },
      impactClaims: [
        {
          id: 'science-no-impact',
          aim: 'science',
          outcome: 'Matched-assurance research-cycle acceleration',
          setting: 'Synthetic validator fixture',
          status: 'NO_IMPACT_EVIDENCE',
          designClass: 'none',
          comparator: 'Not measured.',
          estimand: 'Not estimated.',
          evidenceRefs: [],
          registeredDesignRef: null,
          independentAssessment: null
        }
      ],
      ibeHypotheses: ['research-cycle-acceleration']
    }
  };
}

function addFuture(artifacts, papers, record = recordFor('future-test-release'), attempt = null) {
  papers.push(record);
  artifacts.registry.releaseAssignments[record.slug] = [...record.operatingModel.accelerationPrimitives];
  artifacts.registry.methodClusters.find(cluster => cluster.id === 'grand-problem-salvage').members.push(record.slug);
  artifacts.workLedger.attempts.push(attempt || attemptFor(record.slug, record.operatingModel.workId));
  return record;
}

function measuredAttemptFor(slug, status = 'release-candidate') {
  const attempt = attemptFor(slug);
  attempt.status = status;
  attempt.statusAt = '2026-08-10T11:00:00Z';
  attempt.statusHistory[1] = {
    at: attempt.statusAt,
    status,
    resultClass: 'partial',
    reason: 'Synthetic measured fixture reached its declared status.',
    evidenceRefs: []
  };
  attempt.measurement = {
    status: 'measured-complete', missingnessReason: null,
    milestones: [
      { event: 'work-opened', at: '2026-08-10T09:00:00Z', basis: 'Synthetic intake receipt.' },
      { event: 'result-ready', at: '2026-08-10T09:30:00Z', basis: 'Synthetic result receipt.' },
      { event: 'claim-locked', at: '2026-08-10T10:00:00Z', basis: 'Synthetic claim-lock receipt.' },
      { event: 'assurance-endpoint-reached', at: '2026-08-10T10:30:00Z', basis: 'Synthetic assurance receipt.' }
    ],
    activeHumanMinutes: 20, computeMinutes: 10, computeCost: { amount: 1, currency: 'GBP' },
    agentRuns: 1, reworkMinutes: 0, correctionCount: 0
  };
  if (status === 'published') attempt.measurement.milestones.push(
    { event: 'public-release', at: '2026-08-10T11:00:00Z', basis: 'Synthetic public readback.' });
  return attempt;
}

function postPolicyAttemptFor(slug, status = 'published') {
  const attempt = attemptFor(slug);
  attempt.registeredAt = '2026-08-29T12:00:00Z';
  attempt.status = status;
  attempt.statusAt = status === 'published' ? '2026-08-29T14:00:00Z' : '2026-08-29T13:00:00Z';
  attempt.resultClass = 'partial';
  attempt.statusHistory = [
    {
      at: attempt.registeredAt, status: 'active', resultClass: 'pending',
      reason: 'Registered with a frozen prospective metric forecast.', evidenceRefs: []
    },
    {
      at: attempt.statusAt, status, resultClass: 'partial',
      reason: 'Synthetic post-policy fixture reached its declared status.', evidenceRefs: []
    }
  ];
  attempt.measurement = {
    status: 'measured-partial',
    missingnessReason: 'Active human time and optional token telemetry were not exposed by the synthetic runtime.',
    milestones: [
      { event: 'work-opened', at: attempt.registeredAt, basis: 'Synthetic prospective intake.' },
      ...(status === 'published' ? [{ event: 'public-release', at: attempt.statusAt, basis: 'Synthetic terminal readback.' }] : [])
    ],
    activeHumanMinutes: null,
    computeMinutes: status === 'published' ? 10 : null,
    computeCost: null,
    agentRuns: status === 'published' ? 2 : null,
    reworkMinutes: status === 'published' ? 5 : null,
    correctionCount: 0
  };
  attempt.metrics = {
    schemaVersion: '1.0',
    measurementScope: 'research-through-publication',
    scopeBoundary: 'Synthetic research intake through canonical release readback.',
    forecast: {
      frozenAt: attempt.registeredAt,
      procedureClass: 'synthetic-structural-research-release',
      targetOutcome: 'Obtain one bounded positive signal and publish its exact assurance boundary.',
      expectedActiveMinutes: 60,
      plausibleLowMinutes: 30,
      plausibleHighMinutes: 120,
      expectedUnattendedWaitMinutes: 20,
      referenceClass: {
        label: 'Synthetic structural-release fixtures', sampleSize: 0,
        basis: 'No measured predecessor exists; use the explicit Fermi decomposition as the prior.'
      },
      fermiComponents: [
        { component: 'falsification gates', count: 2, lowMinutesPerUnit: 5, centralMinutesPerUnit: 10, highMinutesPerUnit: 20, basis: 'Two bounded exact checks.' },
        { component: 'candidate architecture', count: 1, lowMinutesPerUnit: 10, centralMinutesPerUnit: 20, highMinutesPerUnit: 40, basis: 'One structurally distinct route.' },
        { component: 'publication and readback', count: 1, lowMinutesPerUnit: 10, centralMinutesPerUnit: 20, highMinutesPerUnit: 40, basis: 'One deterministic publication pass.' }
      ],
      probabilityPositiveSignal: 0.6,
      probabilityTargetClosure: 0.25,
      probabilityHorizonMinutes: 120,
      assumptions: ['The synthetic exact checker remains available.'],
      reforecastTriggers: ['The first falsification gate exposes a different target object.'],
      stopRule: 'Stop after the two registered gates if neither produces a positive signal.'
    },
    outcome: status === 'published' ? {
      measuredAt: attempt.statusAt,
      calendarElapsedMinutes: 120,
      activeAgentMinutes: 60,
      activeHumanMinutes: null,
      computeMinutes: 10,
      unattendedWaitMinutes: 20,
      blockedMinutes: 0,
      reworkMinutes: 5,
      agentRuns: 2,
      maxParallelAgents: 2,
      modelTurns: 6,
      deduplicatedModelTokens: null,
      uncachedInputTokens: null,
      researchCycles: { positive: 1, negative: 2, inconclusive: 0 },
      falsificationGatesRun: 2,
      candidateArchitecturesTested: 1,
      candidateArchitecturesRejected: 0,
      substantiveReviewRounds: 1,
      p0Findings: 0,
      p1Findings: 1,
      prepublicationClaimCorrections: 1,
      resultState: 'positive-signal',
      resultSummary: 'The bounded synthetic gate produced a positive signal without closing the target.',
      positiveSignalObserved: true,
      targetReached: false,
      forecastErrorMinutes: 0,
      forecastRatio: 1,
      withinForecastInterval: true,
      varianceReason: null,
      missingFields: [
        { field: 'activeHumanMinutes', reason: 'The synthetic fixture has no human-time instrument.' },
        { field: 'deduplicatedModelTokens', reason: 'The synthetic runtime exposes no fork-aware token counter.' },
        { field: 'uncachedInputTokens', reason: 'The synthetic runtime exposes no uncached-input counter.' }
      ]
    } : null
  };
  return attempt;
}

const validErrors = collectErrors({ root, papers: sourcePapers, artifacts: sourceArtifacts });
check('canonical doctrine, registries, ledgers and frozen baseline validate', validErrors.length === 0, validErrors.join('\n  '));

/* Exercise future render paths even though the frozen legacy baseline contains
   no prospective records by design. */
function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start === -1) throw new Error(`cannot find ${name} in build.js`);
  let cursor = source.indexOf('{', start);
  let depth = 0;
  for (; cursor < source.length; cursor++) {
    if (source[cursor] === '{') depth++;
    else if (source[cursor] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) throw new Error(`unbalanced ${name} in build.js`);
  return source.slice(start, cursor + 1);
}

{
  const buildSource = fs.readFileSync(path.join(root, 'build.js'), 'utf8');
  const renderHarness = new Function('METHOD_BY_ID', 'IBE_BY_ID', 'WORK_ATTEMPT_BY_ID', 'BASE', 'esc', 'rounded', [
    extractFunction(buildSource, 'operatingModelHtml'),
    extractFunction(buildSource, 'operatingModelMarkdown'),
    'return { operatingModelHtml, operatingModelMarkdown };'
  ].join('\n'));
  const methodById = new Map(sourceArtifacts.registry.methods.map(method => [method.id, method]));
  const ibeById = new Map(sourceArtifacts.ledger.hypotheses.map(hypothesis => [hypothesis.id, hypothesis]));
  const attempt = attemptFor('future-test-release');
  const attemptById = new Map([[attempt.attemptId, attempt]]);
  const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rounded = (value, places = 2) => Math.round(value * (10 ** places)) / (10 ** places);
  const render = renderHarness(methodById, ibeById, attemptById, 'https://evidencepress.org', esc, rounded);
  const fixture = recordFor('future-test-release');
  const html = render.operatingModelHtml(fixture);
  const markdown = render.operatingModelMarkdown(fixture);
  check('prospective HTML renders receipt, method and scoped non-impact status',
    html.includes('ep-attempt:future-test-release') && html.includes('Certificate-first') && html.includes('NO_IMPACT_EVIDENCE'), html);
  check('prospective Markdown links method, IBE and work ledgers',
    markdown.includes('/api/method-registry.json') && markdown.includes('/api/ibe-ledger.json') && markdown.includes('/api/work-ledger.json'), markdown);
  const measuredAttempt = postPolicyAttemptFor('future-measured-render');
  const measuredRender = renderHarness(methodById, ibeById, new Map([[measuredAttempt.attemptId, measuredAttempt]]), 'https://evidencepress.org', esc, rounded);
  const measuredFixture = recordFor('future-measured-render');
  const measuredHtml = measuredRender.operatingModelHtml(measuredFixture);
  const measuredMarkdown = measuredRender.operatingModelMarkdown(measuredFixture);
  check('measured release HTML publishes Fermi forecast, cycles, result and calibration',
    measuredHtml.includes('Fermi active-time forecast') && measuredHtml.includes('Research search') &&
      measuredHtml.includes('positive-signal') && measuredHtml.includes('actual/forecast 1') &&
      measuredHtml.includes('target closure 0.0625'), measuredHtml);
  check('measured release Markdown publishes scope, probabilities and rejected-route counts',
    measuredMarkdown.includes('scope research-through-publication') && measuredMarkdown.includes('positive-signal/closure probabilities 0.6/0.25') &&
      measuredMarkdown.includes('architectures tested/rejected 1/0') &&
      measuredMarkdown.includes('positive-signal/target-closure Brier scores 0.16/0.0625'), measuredMarkdown);
  check('legacy release renderer emits no invented process section',
    render.operatingModelHtml({ slug: 'legacy' }) === '' && render.operatingModelMarkdown({ slug: 'legacy' }) === '');
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    papers.push({ slug: 'future-missing-record' });
    artifacts.registry.releaseAssignments['future-missing-record'] = ['certificate-first'];
    artifacts.registry.methodClusters[5].members.push('future-missing-record');
  });
  check('future release without operatingModel is rejected', errors.some(e => e.includes('is required for every release outside')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    papers.push({ slug: 'future-grandfather-bypass' });
    artifacts.contract.releasePolicy.legacyReleaseSlugs.push('future-grandfather-bypass');
    artifacts.registry.releaseAssignments['future-grandfather-bypass'] = ['certificate-first'];
    artifacts.registry.methodClusters[5].members.push('future-grandfather-bypass');
  });
  check('adding a future slug to the frozen legacy baseline is rejected',
    errors.some(e => e.includes('does not match the frozen adoption list')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => addFuture(artifacts, papers));
  check('complete prospective release and attempt receipts pass', errors.length === 0, errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-measured-release');
    addFuture(artifacts, papers, record, postPolicyAttemptFor(record.slug));
  });
  check('post-policy release with frozen Fermi forecast and terminal metrics passes', errors.length === 0, errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-missing-metrics');
    const attempt = attemptFor(record.slug);
    attempt.registeredAt = '2026-08-29T12:00:00Z';
    attempt.statusAt = '2026-08-29T13:00:00Z';
    attempt.statusHistory[0].at = attempt.registeredAt;
    attempt.statusHistory[1].at = attempt.statusAt;
    addFuture(artifacts, papers, record, attempt);
  });
  check('post-policy attempt without a research-metrics receipt is rejected',
    errors.some(e => e.includes('.metrics') && e.includes('is required for attempts registered')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-late-forecast');
    const attempt = postPolicyAttemptFor(record.slug);
    attempt.metrics.forecast.frozenAt = '2026-08-29T12:01:00Z';
    addFuture(artifacts, papers, record, attempt);
  });
  check('forecast frozen after registration is rejected',
    errors.some(e => e.includes('frozenAt') && e.includes('exactly equal registeredAt')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-fermi-drift');
    const attempt = postPolicyAttemptFor(record.slug);
    attempt.metrics.forecast.expectedActiveMinutes = 61;
    addFuture(artifacts, papers, record, attempt);
  });
  check('headline forecast that does not equal its Fermi components is rejected',
    errors.some(e => e.includes('expectedActiveMinutes') && e.includes('Fermi component total')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-terminal-without-outcome');
    const attempt = postPolicyAttemptFor(record.slug);
    attempt.metrics.outcome = null;
    addFuture(artifacts, papers, record, attempt);
  });
  check('terminal release without a metrics outcome is rejected',
    errors.some(e => e.includes('.metrics.outcome') && e.includes('is required when attempt status is published')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-unexplained-telemetry');
    const attempt = postPolicyAttemptFor(record.slug);
    attempt.metrics.outcome.missingFields = attempt.metrics.outcome.missingFields.filter(item => item.field !== 'deduplicatedModelTokens');
    addFuture(artifacts, papers, record, attempt);
  });
  check('null runtime telemetry without a field-specific reason is rejected',
    errors.some(e => e.includes('missingFields') && e.includes('deduplicatedModelTokens')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-calibration-drift');
    const attempt = postPolicyAttemptFor(record.slug);
    attempt.metrics.outcome.forecastRatio = 0.5;
    addFuture(artifacts, papers, record, attempt);
  });
  check('outcome calibration ratio that does not recompute is rejected',
    errors.some(e => e.includes('forecastRatio') && e.includes('activeAgentMinutes / expectedActiveMinutes')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => { artifacts.registry.methods[1].id = artifacts.registry.methods[0].id; });
  check('duplicate method id is rejected', errors.some(e => e.includes('duplicates id')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => {
    const successor = artifacts.registry.methodClusters.findLast(cluster => cluster.supersedes);
    delete successor.supersedes;
  });
  check('duplicate cluster membership requires an explicit successor chain',
    errors.some(e => e.includes('duplicate requires an explicit successor')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => {
    const successor = artifacts.registry.methodClusters.findLast(cluster => cluster.supersedes);
    successor.supersedes = 'missing-prior-cluster';
  });
  check('successor cluster must resolve to the active earlier cluster',
    errors.some(e => e.includes('must resolve to an earlier cluster')) &&
      errors.some(e => e.includes('duplicate requires an explicit successor')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => {
    const successor = artifacts.registry.methodClusters.findLast(cluster => cluster.supersedes);
    successor.members.push('finite-sample-affine-diversification');
  });
  check('successor cluster cannot silently change the superseded member set',
    errors.some(e => e.includes('must exactly match superseded cluster')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => { artifacts.registry.releaseAssignments['z20-equals-6'].push('not-a-method'); });
  check('dangling method assignment is rejected', errors.some(e => e.includes('unknown method')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => {
    artifacts.registry.releaseAssignments['affine-diversification-fibres'] =
      artifacts.registry.releaseAssignments['affine-diversification-fibres'].filter(id => id !== 'identification-gate');
  });
  check('representative release missing its method assignment is rejected',
    errors.some(e => e.includes('representative') && e.includes('omits')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-method-drift');
    addFuture(artifacts, papers, record);
    record.operatingModel.accelerationPrimitives = ['structural-compression'];
  });
  check('release methods that drift from the central registry are rejected',
    errors.some(e => e.includes('does not match METHOD_REGISTRY.releaseAssignments')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => { artifacts.ledger.hypotheses[0].rivals = []; });
  check('hypothesis without serious rivals is rejected', errors.some(e => e.includes('.rivals') && e.includes('at least 2')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => { delete artifacts.ledger.hypotheses[0].predictions[0].estimand; });
  check('prediction without an estimand is rejected', errors.some(e => e.includes('missing required property "estimand"')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => {
    const hypothesis = artifacts.ledger.hypotheses[0];
    hypothesis.epistemicStatus = 'causal-effect-supported';
    hypothesis.statusEvidence = {
      status: 'causal-effect-supported', designClass: 'randomized-comparison',
      observationIds: ['catalogue-baseline-throughput'],
      evidenceRefs: [
        { kind: 'public-url', ref: 'https://evidencepress.org/api/papers.json', role: 'outcome-evidence' },
        { kind: 'registered-design', ref: 'https://evidencepress.org/api/ibe-ledger.json#synthetic-design', role: 'design-registration' },
        { kind: 'independent-review', ref: 'https://evidencepress.org/api/ibe-ledger.json#synthetic-review', role: 'review' }
      ],
      comparator: 'Synthetic comparator.', estimand: 'Synthetic effect estimand.',
      decisionRule: 'Synthetic threshold met.',
      registeredDesignRef: 'https://evidencepress.org/api/ibe-ledger.json#synthetic-design',
      independentReview: {
        actor: 'Unaffiliated synthetic reviewer', relationship: 'unaffiliated',
        conflictStatement: 'No relationship to the fixture author.', date: '2026-08-10',
        evidenceRef: 'https://evidencepress.org/api/ibe-ledger.json#synthetic-review',
        methodologicalScope: 'Synthetic methodological review only.', conclusion: 'supports'
      },
      identificationAssumptions: ['Synthetic random assignment remained intact.'],
      uncertaintyAndAttrition: 'Synthetic interval and zero attrition recorded.',
      inferenceLimit: 'Synthetic fixture only.'
    };
    const previous = artifacts.ledger.changeLog.at(-1);
    artifacts.ledger.changeLog.push({
      sequence: previous.sequence + 1, revisionId: 'hostile-causal-promotion-2026-08-10',
      previousRevisionId: previous.revisionId, recordedAt: '2026-08-10',
      changeType: 'status-changed', scope: 'hypothesis', hypothesisId: hypothesis.id,
      fromStatus: 'untested', toStatus: 'causal-effect-supported',
      basisObservationIds: ['catalogue-baseline-throughput'],
      summary: 'Hostile promotion using an observation that cannot identify a causal effect.'
    });
  });
  check('causal IBE promotion needs a causally capable observation, not catalogue throughput',
    errors.some(e => e.includes('requires a referenced observation classified for causal-identification')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-semantic-drift');
    record.operatingModel.semanticBridge.state = 'verified';
    addFuture(artifacts, papers, record);
  });
  check('unknown semantic-bridge state is rejected', errors.some(e => e.includes('semanticBridge.state') && e.includes('not registered')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-bogus-impact');
    const claim = record.operatingModel.impactClaims[0];
    Object.assign(claim, {
      status: 'CAUSAL_EFFECT_SUPPORTED',
      designClass: 'quasi-experimental',
      evidenceRefs: ['https://example.org/self-authored-assertion'],
      registeredDesignRef: 'https://example.org/after-the-fact-plan',
      independentAssessment: {
        actor: 'Evidence Press authors',
        relationship: 'unaffiliated',
        conflictStatement: 'Self-described as independent.',
        date: '2026-08-10',
        evidenceUrl: 'https://example.org/self-authored-assertion',
        conclusion: 'supports'
      }
    });
    const attempt = attemptFor(record.slug);
    attempt.assuranceEndpoint = {
      status: 'measured-partial',
      assessedAt: '2026-08-10T10:00:00Z',
      dimensions: [{ dimension: 'semanticValidation', state: 'partial', evidenceRefs: [] }],
      claimCeiling: 'Synthetic internal assessment only.',
      evidenceRefs: [],
      missingnessReason: 'No independent methodological review.'
    };
    addFuture(artifacts, papers, record, attempt);
  });
  check('self-authored assertion cannot promote a causal impact claim',
    errors.some(e => e.includes('must name a reviewer independent')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-unknown-field');
    record.operatingModel.unexpectedClaim = 'silently ignored';
    addFuture(artifacts, papers, record);
  });
  check('unknown prospective field is rejected', errors.some(e => e.includes('unexpected property "unexpectedClaim"')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-dangling-parent');
    record.operatingModel.parentLinks.push({
      relation: 'extends-result', workId: 'ep-work:not-a-real-work', legacyReleaseSlug: null, externalUrl: null,
      inheritedClaim: 'A claim that cannot actually be found.', inheritedAssuranceCeiling: 'Unknown.'
    });
    addFuture(artifacts, papers, record);
  });
  check('dangling prospective parent is rejected', errors.some(e => e.includes('does not resolve to a registered prospective work')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const first = recordFor('future-cycle-one');
    const second = recordFor('future-cycle-two');
    first.operatingModel.parentLinks.push({
      relation: 'extends-result', workId: second.operatingModel.workId, legacyReleaseSlug: null, externalUrl: null,
      inheritedClaim: 'Synthetic second claim.', inheritedAssuranceCeiling: 'Structural fixture only.'
    });
    second.operatingModel.parentLinks.push({
      relation: 'extends-result', workId: first.operatingModel.workId, legacyReleaseSlug: null, externalUrl: null,
      inheritedClaim: 'Synthetic first claim.', inheritedAssuranceCeiling: 'Structural fixture only.'
    });
    addFuture(artifacts, papers, first);
    addFuture(artifacts, papers, second);
  });
  check('cyclic parent-work lineage is rejected', errors.some(e => e.includes('contains a parent cycle')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-missing-attempt');
    papers.push(record);
    artifacts.registry.releaseAssignments[record.slug] = ['certificate-first'];
    artifacts.registry.methodClusters[5].members.push(record.slug);
  });
  check('release without a reciprocal attempt receipt is rejected',
    errors.some(e => e.includes('unknown work-ledger attempt')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-reconstructed-clock');
    const attempt = attemptFor(record.slug);
    attempt.measurement.milestones.push({ event: 'work-opened', at: attempt.registeredAt, basis: 'Retrospectively guessed.' });
    addFuture(artifacts, papers, record, attempt);
  });
  check('not-recorded measurement cannot contain reconstructed clocks',
    errors.some(e => e.includes('must not contain reconstructed')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-pre-registration-clocks');
    const attempt = measuredAttemptFor(record.slug);
    for (const milestone of attempt.measurement.milestones) milestone.at = milestone.at.replace('2026-', '2025-');
    addFuture(artifacts, papers, record, attempt);
  });
  check('prospective clock receipts cannot predate intake registration',
    errors.some(e => e.includes('must not precede the prospective registration time')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-incomplete-published-clocks');
    const attempt = measuredAttemptFor(record.slug, 'published');
    attempt.measurement.milestones = attempt.measurement.milestones.slice(0, 1);
    addFuture(artifacts, papers, record, attempt);
  });
  check('measured-complete published work requires every publication-clock event',
    errors.some(e => e.includes('complete published measurement requires "public-release"')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-correction-count-drift');
    const attempt = measuredAttemptFor(record.slug);
    attempt.corrections.push({
      at: '2026-08-10T10:45:00Z', field: 'measurement.activeHumanMinutes',
      reason: 'Synthetic correction receipt.', replacement: '21', evidenceRefs: []
    });
    addFuture(artifacts, papers, record, attempt);
  });
  check('correction count must equal retained correction receipts',
    errors.some(e => e.includes('must equal the number of retained correction receipts')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-hidden-lineage');
    addFuture(artifacts, papers, record);
    artifacts.registry.lineages[0].members.push(record.slug);
  });
  check('registry lineage membership requires a reciprocal release lineage receipt',
    errors.some(e => e.includes('.lineageId') && e.includes('must exactly reciprocate registry lineage')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-lineage-child');
    record.operatingModel.lineageId = 'binary-form-programme';
    record.operatingModel.parentLinks.push({
      relation: 'extends-result', workId: null, legacyReleaseSlug: 'degree-difference-affine-slices', externalUrl: null,
      inheritedClaim: 'Synthetic child reuses only the declared bounded root object.',
      inheritedAssuranceCeiling: 'The parent remains an unrefereed internally replayed candidate.'
    });
    addFuture(artifacts, papers, record);
    artifacts.registry.lineages[0].members.push(record.slug);
  });
  check('append-only lineage child with reciprocal id and earlier evidential parent passes',
    errors.length === 0, errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts }) => {
    artifacts.registry.lineages[0].rootReleaseSlug = artifacts.registry.lineages[0].members[1];
  });
  check('lineage root must remain the first member',
    errors.some(e => e.includes('must equal the first lineage member')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-challenged-benchmark');
    const claim = record.operatingModel.impactClaims[0];
    const review = 'https://evidencepress.org/reviews/synthetic-benchmark/';
    const evidence = 'https://evidencepress.org/api/work-ledger.json';
    Object.assign(claim, {
      status: 'BENCHMARK_SIGNAL', designClass: 'model-benchmark', evidenceRefs: [evidence, review],
      independentAssessment: {
        actor: 'Unaffiliated synthetic reviewer', relationship: 'unaffiliated',
        conflictStatement: 'No relationship to the fixture author.', date: '2026-08-10',
        evidenceUrl: review, conclusion: 'challenges'
      }
    });
    const attempt = measuredAttemptFor(record.slug);
    attempt.assuranceEndpoint = {
      status: 'measured-partial', assessedAt: '2026-08-10T10:30:00Z',
      dimensions: [
        { dimension: 'semanticValidation', state: 'partial', evidenceRefs: [evidence] },
        { dimension: 'internalReplay', state: 'passed', evidenceRefs: [evidence] }
      ],
      claimCeiling: 'Synthetic benchmark only.', evidenceRefs: [evidence, review],
      missingnessReason: 'No specialist review.'
    };
    addFuture(artifacts, papers, record, attempt);
  });
  check('an adverse independent assessment cannot promote a benchmark signal',
    errors.some(e => e.includes('requires an assessment that supports')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-descriptive-harm');
    const claim = record.operatingModel.impactClaims[0];
    const review = 'https://evidencepress.org/reviews/synthetic-harm/';
    const evidence = 'https://evidencepress.org/api/work-ledger.json';
    Object.assign(claim, {
      status: 'HARM_OR_REGRESSION_FOUND', designClass: 'descriptive', evidenceRefs: [evidence, review],
      independentAssessment: {
        actor: 'Unaffiliated synthetic reviewer', relationship: 'unaffiliated',
        conflictStatement: 'No relationship to the fixture author.', date: '2026-08-10',
        evidenceUrl: review, conclusion: 'challenges'
      }
    });
    const attempt = measuredAttemptFor(record.slug);
    attempt.assuranceEndpoint = {
      status: 'measured-partial', assessedAt: '2026-08-10T10:30:00Z',
      dimensions: [{ dimension: 'semanticValidation', state: 'partial', evidenceRefs: [evidence] }],
      claimCeiling: 'Synthetic descriptive observation.', evidenceRefs: [evidence, review],
      missingnessReason: 'No controlled comparison.'
    };
    addFuture(artifacts, papers, record, attempt);
  });
  check('harm status needs supportive review and at least a benchmark comparison',
    errors.some(e => e.includes('requires an assessment that supports')) &&
      errors.some(e => e.includes('requires at least a model-benchmark comparison')), errors.join('\n  '));
}

{
  const errors = errorsFor(({ artifacts, papers }) => {
    const record = recordFor('future-unbound-causal-evidence');
    const claim = record.operatingModel.impactClaims[0];
    Object.assign(claim, {
      status: 'CAUSAL_EFFECT_SUPPORTED', designClass: 'randomized-comparison',
      evidenceRefs: ['https://review.test/assessment', 'https://design.test/registration'],
      registeredDesignRef: 'https://design.test/registration',
      independentAssessment: {
        actor: 'Unaffiliated synthetic reviewer', relationship: 'unaffiliated',
        conflictStatement: 'No relationship to the fixture author.', date: '2026-08-10',
        evidenceUrl: 'https://review.test/assessment', conclusion: 'supports'
      }
    });
    const attempt = measuredAttemptFor(record.slug);
    const assuranceRef = 'https://evidencepress.org/api/work-ledger.json';
    attempt.assuranceEndpoint = {
      status: 'measured-complete', assessedAt: '2026-08-10T10:30:00Z',
      dimensions: [
        { dimension: 'semanticValidation', state: 'passed', evidenceRefs: [assuranceRef] },
        { dimension: 'specialistReview', state: 'passed', evidenceRefs: [assuranceRef] }
      ],
      claimCeiling: 'Synthetic causal fixture.', evidenceRefs: [assuranceRef], missingnessReason: null
    };
    addFuture(artifacts, papers, record, attempt);
  });
  check('reserved or assurance-unbound URLs cannot promote a causal claim',
    errors.some(e => e.includes('reserved example or local hostname')) &&
      errors.some(e => e.includes('must overlap the linked assurance endpoint evidence')), errors.join('\n  '));
}

{
  const errors = errorsFor(() => {});
  check('legacy releases remain valid without invented process metadata', errors.length === 0, errors.join('\n  '));
}

{
  const stable = 'https://evidencepress.org/assets/audio/unique-answer-not-identified.mp3';
  const file = path.join(root, 'assets', 'audio', 'unique-answer-not-identified.mp3');
  const version = require('crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
  const versioned = `${stable}?v=${version}`;
  const successor = (live, candidate) => publicationIntegrity.isContentVersionedAssetSuccessor(live, candidate, file);
  check('published audio permits only an exact content-versioned successor',
    successor(stable, versioned) &&
      !successor(stable, `${stable}?v=0000000000`) &&
      !successor(stable, `${stable}?v=${version}&extra=1`) &&
      !successor(stable, `${versioned}#replacement`) &&
      !successor(stable, `https://evidencepress.org/assets/audio/other.mp3?v=${version}`) &&
      !successor(`https://example.org/assets/audio/unique-answer-not-identified.mp3`, `https://example.org/assets/audio/unique-answer-not-identified.mp3?v=${version}`) &&
      !successor(`${stable}?v=1111111111`, versioned),
    `versioned=${versioned}`);
}

{
  const slug = 'certified-three-item-jrp-gap';
  const meta = sourcePapers.find(paper => paper.slug === slug);
  const file = path.join(root, 'assets', 'audio', `${slug}.mp3`);
  const version = require('crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
  const candidateUrl = `https://evidencepress.org/assets/audio/${slug}.mp3?v=${version}`;
  const events = JSON.parse(fs.readFileSync(path.join(root, 'data', 'PRESENTATION_EVENTS.json'), 'utf8'));
  const accepted = publicationIntegrity.isRecordedAudioSuccessor(
    `https://evidencepress.org/assets/audio/${slug}.mp3?v=1111111111`,
    candidateUrl, slug, { events: [] }, events
  );
  const tampered = clone(events);
  tampered.events.find(event => event.eventId.endsWith('role-neutral-audio')).artifact.audioSha256 = '0'.repeat(64);
  check('already-versioned audio needs an append-only byte-bound presentation event',
    meta && accepted && !publicationIntegrity.isRecordedAudioSuccessor(
      `https://evidencepress.org/assets/audio/${slug}.mp3?v=1111111111`,
      candidateUrl, slug, { events: [] }, tampered
    ));
}

{
  const slug = 'certified-commitment-horizons';
  const retiredUrl = 'https://youtu.be/G4ehJ81pl6g';
  const replacementUrl = 'https://youtu.be/ikaliZ25P8I';
  const candidateMedia = [{ type: 'video', url: replacementUrl }];
  const event = {
    eventId: `presentation:${slug}:2026-08-26:youtube-ikaliZ25P8I`,
    slug,
    occurredAt: '2026-08-26',
    eventType: 'video',
    artifact: { provider: 'youtube', replacesUrl: retiredUrl, url: replacementUrl },
    researchClaimChanged: false,
    researchArchiveChanged: false
  };
  const candidateEvents = { events: [event] };
  const accepted = publicationIntegrity.isRecordedVideoReplacement(
    retiredUrl, candidateMedia, slug, { events: [] }, candidateEvents
  );
  const tampered = clone(candidateEvents);
  tampered.events[0].researchClaimChanged = true;
  check('published video removal needs an append-only exact replacement event',
    accepted &&
      !publicationIntegrity.isRecordedVideoReplacement(
        retiredUrl, candidateMedia, slug, candidateEvents, candidateEvents
      ) &&
      !publicationIntegrity.isRecordedVideoReplacement(
        'https://youtu.be/unrecorded', candidateMedia, slug, { events: [] }, candidateEvents
      ) &&
      !publicationIntegrity.isRecordedVideoReplacement(
        retiredUrl, [], slug, { events: [] }, candidateEvents
      ) &&
      !publicationIntegrity.isRecordedVideoReplacement(
        retiredUrl, candidateMedia, slug, { events: [] }, tampered
      ));
}

{
  publicationIntegrity.resetFailures();
  const live = recordFor('published-prospective');
  const candidate = clone(live);
  candidate.operatingModel.assuranceTarget.claimCeiling = 'Silently promoted.';
  publicationIntegrity.preserveReleaseOperatingModels([live], [candidate], new Set());
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published prospective receipt cannot be rewritten in place',
    preservationErrors.some(error => error.includes('changed its published prospective operatingModel')), preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const slug = 'corrected-successor';
  const live = {
    ...recordFor(slug), version: '1.0.0-candidate', doiUrl: 'https://doi.org/10.1/old',
    url: `https://evidencepress.org/releases/${slug}/`,
    releaseUrl: 'https://github.com/example/repo/releases/tag/v1.0.0',
    corrections: [{ date: '2026-08-10', scope: 'presentation', summary: 'Earlier correction.', detail: 'Preserved.', fixedIn: '1.0.0-candidate' }]
  };
  const candidate = clone(live);
  Object.assign(candidate, {
    version: '1.1.0-candidate', doiUrl: 'https://doi.org/10.1/new',
    releaseUrl: 'https://github.com/example/repo/releases/tag/v1.1.0'
  });
  candidate.corrections.push({
    date: '2026-08-20', scope: 'presentation', summary: 'Retired non-compliant media.',
    detail: 'The active release no longer links the withdrawn asset.', fixedIn: candidate.version
  });
  const liveAttempt = {
    attemptId: `ep-attempt:${slug}`, releaseSlug: slug,
    corrections: [{ at: '2026-08-10T00:00:00Z', field: 'old', reason: 'old', replacement: 'old', evidenceRefs: [] }],
    revisions: [{ date: '2026-08-10', summary: 'Earlier correction.' }]
  };
  const candidateAttempt = clone(liveAttempt);
  candidateAttempt.corrections.push({
    at: '2026-08-20T00:00:00Z', field: 'presentation and media', reason: 'Out of protocol.',
    replacement: 'Versioned compliant successor.',
    evidenceRefs: [candidate.doiUrl, candidate.releaseUrl, candidate.url]
  });
  candidateAttempt.revisions.push({ date: '2026-08-20', summary: 'Appended corrective successor.' });
  const liveWork = { attempts: [liveAttempt] };
  const candidateWork = { attempts: [candidateAttempt] };
  const authorised = publicationIntegrity.isCorrectionSuccessor(
    live, candidate, liveWork, candidateWork, 'presentation'
  );
  const missingEvidence = clone(candidateWork);
  missingEvidence.attempts[0].corrections.at(-1).evidenceRefs.pop();
  check('versioned correction successor requires preserved dual receipts and triple-bound evidence',
    authorised && !publicationIntegrity.isCorrectionSuccessor(
      live, candidate, liveWork, missingEvidence, 'presentation'
    ));

  candidate.operatingModel.assuranceTarget.claimCeiling = 'Corrected bounded claim.';
  publicationIntegrity.preserveReleaseOperatingModels(
    [live], [candidate], new Set(), authorised ? new Set([slug]) : new Set()
  );
  check('authorised corrective successor may revise its prospective release record',
    publicationIntegrity.listedFailures().length === 0,
    publicationIntegrity.listedFailures().join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const liveLog = [{ date: '2026-08-10', summary: 'Original published history.' }];
  const candidateLog = [{ date: '2026-08-10', summary: 'Rewritten history.' }];
  publicationIntegrity.preserveChangeLogPrefix('hostile ledger', liveLog, candidateLog);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published change-log history is prefix-immutable',
    preservationErrors.some(error => error.includes('changed or removed published changeLog')), preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  publicationIntegrity.preserveExactItems('hostile method',
    [{ id: 'certificate-first', mechanism: 'bounded check' }],
    [{ id: 'certificate-first', mechanism: 'guaranteed truth' }]);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published identified method semantics cannot drift',
    preservationErrors.some(error => error.includes('changed a published identified record')), preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  publicationIntegrity.preserveSchemaNode('hostile schema',
    { properties: { workId: { type: 'string' } } },
    { properties: { workId: { type: 'number' } } });
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published v1 schema field cannot be retyped',
    preservationErrors.some(error => error.includes('changed "string" to "number"')), preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = [{ id: 'programme', name: 'Programme', rootReleaseSlug: 'release-one', basis: 'Explicit dependency.', sharedBoundary: 'Bounded claim.', members: ['release-one'] }];
  const candidate = clone(live);
  candidate[0].members.push('release-two');
  publicationIntegrity.preserveLineages(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published lineage permits append-only programme extension', preservationErrors.length === 0, preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = [{ id: 'programme', name: 'Programme', rootReleaseSlug: 'release-one', basis: 'Explicit dependency.', sharedBoundary: 'Bounded claim.', members: ['release-one'] }];
  const candidate = clone(live);
  candidate[0].basis = 'Retrospectively broadened.';
  candidate[0].members = [];
  publicationIntegrity.preserveLineages(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published lineage identity and prior members remain immutable',
    preservationErrors.some(error => error.includes('immutable field basis')) &&
      preservationErrors.some(error => error.includes('changed or removed published member')),
    preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = clone(sourceArtifacts.workLedger);
  const candidate = clone(live);
  candidate.claimCeiling = 'Silently promoted to causal evidence.';
  candidate.changeLog.push({ date: '2026-08-10', summary: 'Unrelated appended note.' });
  publicationIntegrity.preserveWorkLedger(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published work-ledger claim ceiling cannot be rewritten',
    preservationErrors.some(error => error.includes('top-level field claimCeiling')), preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = clone(sourceArtifacts.workLedger);
  const attempt = attemptFor('published-clock');
  attempt.measurement.milestones = [{ event: 'work-opened', at: attempt.registeredAt, basis: 'Prospectively recorded.' }];
  live.attempts = [attempt];
  const candidate = clone(live);
  candidate.attempts[0].measurement.milestones[0].at = '2026-08-10T09:30:00Z';
  candidate.attempts[0].revisions.push({ date: '2026-08-10', summary: 'Tried to replace a published clock.' });
  publicationIntegrity.preserveWorkLedger(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published prospective milestone cannot be rewritten behind a generic revision',
    preservationErrors.some(error => error.includes('changed or removed published milestone')), preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = clone(sourceArtifacts.workLedger);
  const attempt = attemptFor('published-assurance');
  attempt.assuranceEndpoint = {
    status: 'measured-partial',
    assessedAt: '2026-08-10T10:00:00Z',
    dimensions: [{ dimension: 'semanticValidation', state: 'partial', evidenceRefs: ['https://example.org/first-assessment'] }],
    claimCeiling: 'Partial internal semantic assessment only.',
    evidenceRefs: ['https://example.org/first-assessment'],
    missingnessReason: 'No independent review.'
  };
  live.attempts = [attempt];
  const candidate = clone(live);
  candidate.attempts[0].assuranceEndpoint.dimensions[0].state = 'passed';
  candidate.attempts[0].assuranceEndpoint.evidenceRefs = [];
  candidate.attempts[0].revisions.push({ date: '2026-08-10', summary: 'Tried to replace a published assurance receipt.' });
  publicationIntegrity.preserveWorkLedger(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published assurance dimensions and evidence references cannot be rewritten',
    preservationErrors.some(error => error.includes('rewrote assurance dimension')) &&
      preservationErrors.some(error => error.includes('changed or removed published reference')),
    preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = clone(sourceArtifacts.workLedger);
  live.attempts = [measuredAttemptFor('published-correction')];
  const candidate = clone(live);
  candidate.attempts[0].corrections.push({
    at: '2026-08-10T11:00:00Z', field: 'measurement.note', reason: 'Clarify wording',
    replacement: 'Clarified without replacing the published receipt.', evidenceRefs: []
  });
  candidate.attempts[0].measurement.correctionCount = 1;
  candidate.attempts[0].revisions.push({ date: '2026-08-10', summary: 'Appended a correction without rewriting history.' });
  publicationIntegrity.preserveWorkLedger(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('append-only work-ledger correction and revision remain permitted',
    preservationErrors.length === 0, preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = clone(sourceArtifacts.workLedger);
  live.attempts = [postPolicyAttemptFor('published-metrics')];
  const candidate = clone(live);
  candidate.attempts[0].metrics.forecast.probabilityTargetClosure = 0.9;
  candidate.attempts[0].revisions.push({ date: '2026-08-28', summary: 'Tried to improve the forecast after observing the result.' });
  publicationIntegrity.preserveWorkLedger(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published research forecast cannot be rewritten after the outcome',
    preservationErrors.some(error => error.includes('rewrote frozen research-metrics forecast')), preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = clone(sourceArtifacts.workLedger);
  live.attempts = [attemptFor('pre-policy-metrics-backfill')];
  const candidate = clone(live);
  candidate.attempts[0].metrics = postPolicyAttemptFor('pre-policy-metrics-backfill').metrics;
  candidate.attempts[0].revisions.push({ date: '2026-08-28', summary: 'Tried to backfill a richer research-metrics receipt.' });
  publicationIntegrity.preserveWorkLedger(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('published pre-policy attempt cannot acquire reconstructed research metrics',
    preservationErrors.some(error => error.includes('retrospective research-metrics receipt')), preservationErrors.join('\n  '));
}

{
  publicationIntegrity.resetFailures();
  const live = clone(sourceArtifacts.workLedger);
  const active = postPolicyAttemptFor('terminal-outcome-append', 'release-candidate');
  live.attempts = [active];
  const candidate = clone(live);
  const terminal = postPolicyAttemptFor('terminal-outcome-append', 'published');
  candidate.attempts[0] = terminal;
  candidate.attempts[0].statusHistory = [...active.statusHistory, terminal.statusHistory.at(-1)];
  candidate.attempts[0].metrics.forecast = clone(active.metrics.forecast);
  candidate.attempts[0].revisions.push({ date: '2026-08-28', summary: 'Appended the terminal outcome after publication readback.' });
  publicationIntegrity.preserveWorkLedger(live, candidate);
  const preservationErrors = publicationIntegrity.listedFailures();
  check('null prospective outcome may be appended once at terminal status',
    preservationErrors.length === 0, preservationErrors.join('\n  '));
}

console.log(failures === 0
  ? '\nALL OPERATING MODEL TESTS PASSED'
  : `\n${failures} OPERATING MODEL TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
