#!/usr/bin/env node
'use strict';

/*
 * Shared validator for the Evidence Press operating doctrine, method registry,
 * abductive ledger and prospective per-release operating-model records.
 *
 * This validator establishes shape, referential integrity and prospective
 * completeness. It does not establish that a method accelerates research, that
 * an abductive explanation is true, or that a release is correct or impactful.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const VERSION_RE = /^\d+\.\d+$/;
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const WORK_ID_RE = /^ep-work:[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ATTEMPT_ID_RE = /^ep-attempt:[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const FROZEN_BASELINE_COMMIT = '6585348a0aa4c7a89ee0dafcaf29ca719cae56fd';
const FROZEN_LEGACY_SHA256 = '3e3a4ff2435f9173434ce5ce28610fa2c725fbd9924351b55e7e3469bd6fd370';

const ARTIFACT_PATHS = Object.freeze({
  contract: 'data/OPERATING_MODEL.json',
  registry: 'data/METHOD_REGISTRY.json',
  ledger: 'data/IBE_LEDGER.json',
  workLedger: 'data/WORK_LEDGER.json',
  metricsPolicy: 'data/RESEARCH_METRICS_POLICY.json',
  doctrine: 'docs/OPERATING_MODEL.md',
  contractSchema: 'schemas/operating-model.schema.json',
  registrySchema: 'schemas/method-registry.schema.json',
  ledgerSchema: 'schemas/ibe-ledger.schema.json',
  workLedgerSchema: 'schemas/work-ledger.schema.json',
  metricsPolicySchema: 'schemas/research-metrics-policy.schema.json',
  releaseSchema: 'schemas/release-operating-model.schema.json'
});

const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
const clone = value => JSON.parse(JSON.stringify(value));

function readJson(root, rel) {
  const file = path.join(root, rel);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`${rel}: cannot read valid JSON: ${error.message}`);
  }
}

function loadArtifacts(root) {
  for (const rel of Object.values(ARTIFACT_PATHS)) {
    if (!fs.existsSync(path.join(root, rel))) throw new Error(`${rel}: required operating-model artifact is missing`);
  }
  return {
    contract: readJson(root, ARTIFACT_PATHS.contract),
    registry: readJson(root, ARTIFACT_PATHS.registry),
    ledger: readJson(root, ARTIFACT_PATHS.ledger),
    workLedger: readJson(root, ARTIFACT_PATHS.workLedger),
    metricsPolicy: readJson(root, ARTIFACT_PATHS.metricsPolicy),
    schemas: {
      contract: readJson(root, ARTIFACT_PATHS.contractSchema),
      registry: readJson(root, ARTIFACT_PATHS.registrySchema),
      ledger: readJson(root, ARTIFACT_PATHS.ledgerSchema),
      workLedger: readJson(root, ARTIFACT_PATHS.workLedgerSchema),
      metricsPolicy: readJson(root, ARTIFACT_PATHS.metricsPolicySchema),
      release: readJson(root, ARTIFACT_PATHS.releaseSchema)
    }
  };
}

function loadPaperMetadata(root) {
  const papersDir = path.join(root, 'papers');
  return fs.readdirSync(papersDir)
    .filter(entry => !entry.startsWith('_') && fs.existsSync(path.join(papersDir, entry, 'meta.json')))
    .map(entry => {
      const meta = readJson(root, `papers/${entry}/meta.json`);
      return { ...meta, slug: meta.slug || entry };
    });
}

function add(errors, where, message) {
  errors.push(`${where}: ${message}`);
}

function keys(errors, where, value, required, allowed = required) {
  if (!isObject(value)) {
    add(errors, where, 'must be an object');
    return false;
  }
  for (const key of required) if (!(key in value)) add(errors, where, `missing required property "${key}"`);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) add(errors, where, `unexpected property "${key}"`);
  return true;
}

function string(errors, where, value, pattern) {
  if (typeof value !== 'string' || !value.trim()) {
    add(errors, where, 'must be a non-empty string');
    return false;
  }
  if (pattern && !pattern.test(value)) {
    add(errors, where, `has invalid value ${JSON.stringify(value)}`);
    return false;
  }
  return true;
}

function date(errors, where, value) {
  if (!string(errors, where, value, DATE_RE)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    add(errors, where, `${JSON.stringify(value)} is not a real calendar date`);
    return false;
  }
  return true;
}

function dateTime(errors, where, value) {
  if (!string(errors, where, value, DATETIME_RE)) return false;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().replace('.000Z', 'Z') !== value.replace('.000Z', 'Z')) {
    add(errors, where, `${JSON.stringify(value)} is not a canonical UTC date-time`);
    return false;
  }
  return true;
}

function optionalString(errors, where, value) {
  if (value !== null) string(errors, where, value);
}

function url(errors, where, value) {
  if (!string(errors, where, value, /^https:\/\//)) return false;
  try { new URL(value); return true; }
  catch { add(errors, where, 'must be a valid HTTPS URL'); return false; }
}

function evidenceUrl(errors, where, value) {
  if (!url(errors, where, value)) return false;
  const hostname = new URL(value).hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.invalid') ||
      hostname.endsWith('.test') ||
      ['example.com', 'example.org', 'example.net'].includes(hostname)) {
    add(errors, where, 'must resolve to an actual evidence host, not a reserved example or local hostname');
    return false;
  }
  return true;
}

function urlArray(errors, where, value, { min = 0 } = {}) {
  if (!Array.isArray(value)) {
    add(errors, where, 'must be an array');
    return [];
  }
  if (value.length < min) add(errors, where, `must contain at least ${min} item${min === 1 ? '' : 's'}`);
  const seen = new Set();
  value.forEach((item, index) => {
    if (url(errors, `${where}[${index}]`, item) && seen.has(item)) add(errors, `${where}[${index}]`, `duplicates ${JSON.stringify(item)}`);
    seen.add(item);
  });
  return value;
}

function evidenceUrlArray(errors, where, value, { min = 0 } = {}) {
  if (!Array.isArray(value)) {
    add(errors, where, 'must be an array');
    return [];
  }
  if (value.length < min) add(errors, where, `must contain at least ${min} item${min === 1 ? '' : 's'}`);
  const seen = new Set();
  value.forEach((item, index) => {
    if (evidenceUrl(errors, `${where}[${index}]`, item) && seen.has(item)) add(errors, `${where}[${index}]`, `duplicates ${JSON.stringify(item)}`);
    seen.add(item);
  });
  return value;
}

const sameMembers = (left, right) => Array.isArray(left) && Array.isArray(right) &&
  left.length === right.length && [...left].sort().every((value, index) => value === [...right].sort()[index]);

function validateChange(errors, where, change) {
  if (!keys(errors, where, change, ['date', 'summary'])) return;
  date(errors, `${where}.date`, change.date);
  string(errors, `${where}.summary`, change.summary);
}

function stringArray(errors, where, value, { min = 1, allowed = null, pattern = null } = {}) {
  if (!Array.isArray(value)) {
    add(errors, where, 'must be an array');
    return [];
  }
  if (value.length < min) add(errors, where, `must contain at least ${min} item${min === 1 ? '' : 's'}`);
  const seen = new Set();
  value.forEach((item, index) => {
    if (!string(errors, `${where}[${index}]`, item, pattern)) return;
    if (seen.has(item)) add(errors, `${where}[${index}]`, `duplicates ${JSON.stringify(item)}`);
    seen.add(item);
    if (allowed && !allowed.includes(item)) add(errors, `${where}[${index}]`, `${JSON.stringify(item)} is not registered`);
  });
  return value;
}

function uniqueId(errors, where, value, seen) {
  if (!string(errors, where, value, ID_RE)) return;
  if (seen.has(value)) add(errors, where, `duplicates id ${JSON.stringify(value)}`);
  seen.add(value);
}

function validateContract(contract, paperSlugs, errors) {
  const required = ['schemaVersion', 'effectiveDate', 'status', 'doctrine', 'methodRegistry',
    'abductiveLedger', 'workLedger', 'maxims', 'clocks', 'claimCeiling', 'releasePolicy', 'updateRule'];
  if (!keys(errors, 'OPERATING_MODEL', contract, required)) return;
  string(errors, 'OPERATING_MODEL.schemaVersion', contract.schemaVersion, VERSION_RE);
  date(errors, 'OPERATING_MODEL.effectiveDate', contract.effectiveDate);
  string(errors, 'OPERATING_MODEL.status', contract.status);
  if (contract.doctrine !== ARTIFACT_PATHS.doctrine) add(errors, 'OPERATING_MODEL.doctrine', `must equal ${ARTIFACT_PATHS.doctrine}`);
  if (contract.methodRegistry !== ARTIFACT_PATHS.registry) add(errors, 'OPERATING_MODEL.methodRegistry', `must equal ${ARTIFACT_PATHS.registry}`);
  if (contract.abductiveLedger !== ARTIFACT_PATHS.ledger) add(errors, 'OPERATING_MODEL.abductiveLedger', `must equal ${ARTIFACT_PATHS.ledger}`);
  if (contract.workLedger !== ARTIFACT_PATHS.workLedger) add(errors, 'OPERATING_MODEL.workLedger', `must equal ${ARTIFACT_PATHS.workLedger}`);
  stringArray(errors, 'OPERATING_MODEL.maxims', contract.maxims, { min: 3 });
  const clocks = ['discovery', 'assurance', 'publication', 'translation'];
  const actualClocks = stringArray(errors, 'OPERATING_MODEL.clocks', contract.clocks, { min: 4, allowed: clocks });
  if (!sameMembers(actualClocks, clocks)) add(errors, 'OPERATING_MODEL.clocks', 'must declare the four distinct discovery, assurance, publication and translation clocks');
  string(errors, 'OPERATING_MODEL.claimCeiling', contract.claimCeiling);
  string(errors, 'OPERATING_MODEL.updateRule', contract.updateRule);

  const policyRequired = ['mode', 'baselineCommit', 'legacyReleaseSlugs', 'requiredFields',
    'aims', 'artifactRoles', 'bottleneckTypes', 'decisionObjectTypes', 'semanticBridgeStates', 'impactStatuses', 'impactDesignClasses',
    'assuranceDimensions'];
  if (!keys(errors, 'OPERATING_MODEL.releasePolicy', contract.releasePolicy, policyRequired)) return;
  if (contract.releasePolicy.mode !== 'prospective-required-with-frozen-legacy-baseline')
    add(errors, 'OPERATING_MODEL.releasePolicy.mode', 'must preserve the prospective frozen-baseline policy');
  string(errors, 'OPERATING_MODEL.releasePolicy.baselineCommit', contract.releasePolicy.baselineCommit, /^[0-9a-f]{40}$/);
  if (contract.releasePolicy.baselineCommit !== FROZEN_BASELINE_COMMIT)
    add(errors, 'OPERATING_MODEL.releasePolicy.baselineCommit', 'does not match the adopted baseline; changing it requires an explicit contract-version migration');
  const legacy = stringArray(errors, 'OPERATING_MODEL.releasePolicy.legacyReleaseSlugs', contract.releasePolicy.legacyReleaseSlugs, { min: 1, pattern: ID_RE });
  const legacyHash = crypto.createHash('sha256').update([...legacy].sort().join('\n')).digest('hex');
  if (legacyHash !== FROZEN_LEGACY_SHA256)
    add(errors, 'OPERATING_MODEL.releasePolicy.legacyReleaseSlugs', 'does not match the frozen adoption list; do not grandfather a new release to bypass prospective authoring');
  for (const slug of legacy) if (!paperSlugs.includes(slug)) add(errors, 'OPERATING_MODEL.releasePolicy.legacyReleaseSlugs', `unknown baseline slug ${JSON.stringify(slug)}`);
  const expectedFields = ['version', 'workId', 'attemptIds', 'aims', 'artifactRoles', 'lineageId', 'accelerationPrimitives', 'decisionObject',
    'bottleneckTargeted', 'semanticBridge', 'humanJudgmentGates', 'parentLinks',
    'assuranceTarget', 'impactClaims'];
  const actualFields = stringArray(errors, 'OPERATING_MODEL.releasePolicy.requiredFields', contract.releasePolicy.requiredFields, { min: expectedFields.length });
  for (const field of expectedFields) if (!actualFields.includes(field)) add(errors, 'OPERATING_MODEL.releasePolicy.requiredFields', `missing enforced field ${JSON.stringify(field)}`);
  stringArray(errors, 'OPERATING_MODEL.releasePolicy.aims', contract.releasePolicy.aims, { min: 3 });
  stringArray(errors, 'OPERATING_MODEL.releasePolicy.artifactRoles', contract.releasePolicy.artifactRoles, { min: 4 });
  stringArray(errors, 'OPERATING_MODEL.releasePolicy.bottleneckTypes', contract.releasePolicy.bottleneckTypes, { min: 4 });
  stringArray(errors, 'OPERATING_MODEL.releasePolicy.decisionObjectTypes', contract.releasePolicy.decisionObjectTypes, { min: 1 });
  stringArray(errors, 'OPERATING_MODEL.releasePolicy.semanticBridgeStates', contract.releasePolicy.semanticBridgeStates, { min: 3 });
  stringArray(errors, 'OPERATING_MODEL.releasePolicy.impactStatuses', contract.releasePolicy.impactStatuses, { min: 1 });
  stringArray(errors, 'OPERATING_MODEL.releasePolicy.impactDesignClasses', contract.releasePolicy.impactDesignClasses, { min: 7 });
  stringArray(errors, 'OPERATING_MODEL.releasePolicy.assuranceDimensions', contract.releasePolicy.assuranceDimensions, { min: 11 });
}

function nonNegativeInteger(errors, where, value, { min = 0, nullable = false } = {}) {
  if (nullable && value === null) return true;
  if (!Number.isInteger(value) || value < min) {
    add(errors, where, `must be ${nullable ? 'null or ' : ''}an integer at least ${min}`);
    return false;
  }
  return true;
}

function probability(errors, where, value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    add(errors, where, 'must be a finite number from 0 to 1');
    return false;
  }
  return true;
}

function validateMetricsPolicy(metricsPolicy, errors) {
  const required = ['schemaVersion', 'effectiveAt', 'status', 'claimCeiling', 'appliesTo', 'scopeTypes',
    'resultStates', 'minimumPublishableOutcomeFields', 'optionalTelemetryFields', 'definitions',
    'publicationRules', 'missingnessPolicy', 'changeLog'];
  if (!keys(errors, 'RESEARCH_METRICS_POLICY', metricsPolicy, required)) return;
  if (metricsPolicy.schemaVersion !== '1.0') add(errors, 'RESEARCH_METRICS_POLICY.schemaVersion', 'must equal "1.0"');
  dateTime(errors, 'RESEARCH_METRICS_POLICY.effectiveAt', metricsPolicy.effectiveAt);
  if (metricsPolicy.status !== 'prospective-required') add(errors, 'RESEARCH_METRICS_POLICY.status', 'must equal "prospective-required"');
  string(errors, 'RESEARCH_METRICS_POLICY.claimCeiling', metricsPolicy.claimCeiling);
  if (keys(errors, 'RESEARCH_METRICS_POLICY.appliesTo', metricsPolicy.appliesTo,
    ['attemptsRegisteredAtOrAfter', 'intakeRule', 'terminalRule', 'leftCensoringRule'])) {
    dateTime(errors, 'RESEARCH_METRICS_POLICY.appliesTo.attemptsRegisteredAtOrAfter', metricsPolicy.appliesTo.attemptsRegisteredAtOrAfter);
    if (metricsPolicy.appliesTo.attemptsRegisteredAtOrAfter !== metricsPolicy.effectiveAt)
      add(errors, 'RESEARCH_METRICS_POLICY.appliesTo.attemptsRegisteredAtOrAfter', 'must equal effectiveAt');
    for (const field of ['intakeRule', 'terminalRule', 'leftCensoringRule'])
      string(errors, `RESEARCH_METRICS_POLICY.appliesTo.${field}`, metricsPolicy.appliesTo[field]);
  }
  const expectedScopes = ['research-through-publication', 'research-only', 'assurance-through-publication', 'publication-only', 'communication-only'];
  const expectedResults = ['target-closed', 'positive-signal', 'partial', 'falsified', 'stopped', 'no-substantive-result', 'not-applicable'];
  const expectedOptional = ['activeHumanMinutes', 'computeMinutes', 'deduplicatedModelTokens', 'uncachedInputTokens'];
  const scopes = stringArray(errors, 'RESEARCH_METRICS_POLICY.scopeTypes', metricsPolicy.scopeTypes, { min: expectedScopes.length });
  const results = stringArray(errors, 'RESEARCH_METRICS_POLICY.resultStates', metricsPolicy.resultStates, { min: expectedResults.length });
  const optional = stringArray(errors, 'RESEARCH_METRICS_POLICY.optionalTelemetryFields', metricsPolicy.optionalTelemetryFields, { min: expectedOptional.length });
  if (!sameMembers(scopes, expectedScopes)) add(errors, 'RESEARCH_METRICS_POLICY.scopeTypes', 'must preserve the five registered scope types');
  if (!sameMembers(results, expectedResults)) add(errors, 'RESEARCH_METRICS_POLICY.resultStates', 'must preserve the seven registered result states');
  if (!sameMembers(optional, expectedOptional)) add(errors, 'RESEARCH_METRICS_POLICY.optionalTelemetryFields', 'must preserve the four optional telemetry fields');
  stringArray(errors, 'RESEARCH_METRICS_POLICY.minimumPublishableOutcomeFields', metricsPolicy.minimumPublishableOutcomeFields, { min: 20 });
  stringArray(errors, 'RESEARCH_METRICS_POLICY.publicationRules', metricsPolicy.publicationRules, { min: 5 });
  stringArray(errors, 'RESEARCH_METRICS_POLICY.missingnessPolicy', metricsPolicy.missingnessPolicy, { min: 4 });
  const definitionFields = ['calendarElapsedMinutes', 'activeAgentMinutes', 'activeHumanMinutes', 'computeMinutes',
    'unattendedWaitMinutes', 'blockedMinutes', 'reworkMinutes', 'researchCycle', 'falsificationGate',
    'candidateArchitecture', 'positiveSignal', 'targetReached', 'deduplicatedModelTokens', 'substantiveReviewRound', 'brierScore'];
  if (keys(errors, 'RESEARCH_METRICS_POLICY.definitions', metricsPolicy.definitions, definitionFields)) {
    for (const field of definitionFields) string(errors, `RESEARCH_METRICS_POLICY.definitions.${field}`, metricsPolicy.definitions[field]);
  }
  if (!Array.isArray(metricsPolicy.changeLog) || !metricsPolicy.changeLog.length)
    add(errors, 'RESEARCH_METRICS_POLICY.changeLog', 'must be a non-empty array');
  for (const [index, change] of (metricsPolicy.changeLog || []).entries())
    validateChange(errors, `RESEARCH_METRICS_POLICY.changeLog[${index}]`, change);
}

function validateResearchMetrics(errors, where, attempt, metricsPolicy) {
  const effectiveAt = metricsPolicy.effectiveAt;
  const requiredForAttempt = String(attempt.registeredAt) >= String(effectiveAt);
  const metrics = attempt.metrics;
  if (!metrics) {
    if (requiredForAttempt) add(errors, `${where}.metrics`, `is required for attempts registered on or after ${effectiveAt}`);
    return;
  }
  if (String(attempt.registeredAt) < String(effectiveAt)) {
    add(errors, `${where}.metrics`, 'must not reconstruct the richer metric receipt for a pre-policy attempt');
    return;
  }
  const required = ['schemaVersion', 'measurementScope', 'scopeBoundary', 'forecast', 'outcome'];
  if (!keys(errors, `${where}.metrics`, metrics, required)) return;
  if (metrics.schemaVersion !== metricsPolicy.schemaVersion) add(errors, `${where}.metrics.schemaVersion`, 'must match RESEARCH_METRICS_POLICY.schemaVersion');
  if (!metricsPolicy.scopeTypes.includes(metrics.measurementScope)) add(errors, `${where}.metrics.measurementScope`, 'is not registered by the metrics policy');
  string(errors, `${where}.metrics.scopeBoundary`, metrics.scopeBoundary);

  const forecastWhere = `${where}.metrics.forecast`;
  const forecastRequired = ['frozenAt', 'procedureClass', 'targetOutcome', 'expectedActiveMinutes', 'plausibleLowMinutes',
    'plausibleHighMinutes', 'expectedUnattendedWaitMinutes', 'referenceClass', 'fermiComponents',
    'probabilityPositiveSignal', 'probabilityTargetClosure', 'probabilityHorizonMinutes', 'assumptions',
    'reforecastTriggers', 'stopRule'];
  const forecast = metrics.forecast;
  if (!keys(errors, forecastWhere, forecast, forecastRequired)) return;
  dateTime(errors, `${forecastWhere}.frozenAt`, forecast.frozenAt);
  if (forecast.frozenAt !== attempt.registeredAt) add(errors, `${forecastWhere}.frozenAt`, 'must exactly equal registeredAt so the forecast is prospective');
  for (const field of ['procedureClass', 'targetOutcome', 'stopRule']) string(errors, `${forecastWhere}.${field}`, forecast[field]);
  nonNegativeInteger(errors, `${forecastWhere}.expectedActiveMinutes`, forecast.expectedActiveMinutes, { min: 1 });
  nonNegativeInteger(errors, `${forecastWhere}.plausibleLowMinutes`, forecast.plausibleLowMinutes);
  nonNegativeInteger(errors, `${forecastWhere}.plausibleHighMinutes`, forecast.plausibleHighMinutes, { min: 1 });
  nonNegativeInteger(errors, `${forecastWhere}.expectedUnattendedWaitMinutes`, forecast.expectedUnattendedWaitMinutes);
  nonNegativeInteger(errors, `${forecastWhere}.probabilityHorizonMinutes`, forecast.probabilityHorizonMinutes, { min: 1 });
  probability(errors, `${forecastWhere}.probabilityPositiveSignal`, forecast.probabilityPositiveSignal);
  probability(errors, `${forecastWhere}.probabilityTargetClosure`, forecast.probabilityTargetClosure);
  if (forecast.probabilityTargetClosure > forecast.probabilityPositiveSignal)
    add(errors, `${forecastWhere}.probabilityTargetClosure`, 'cannot exceed probabilityPositiveSignal');
  if (forecast.plausibleLowMinutes > forecast.expectedActiveMinutes || forecast.expectedActiveMinutes > forecast.plausibleHighMinutes)
    add(errors, forecastWhere, 'requires plausibleLowMinutes <= expectedActiveMinutes <= plausibleHighMinutes');
  stringArray(errors, `${forecastWhere}.assumptions`, forecast.assumptions, { min: 1 });
  stringArray(errors, `${forecastWhere}.reforecastTriggers`, forecast.reforecastTriggers, { min: 1 });
  if (keys(errors, `${forecastWhere}.referenceClass`, forecast.referenceClass, ['label', 'sampleSize', 'basis'])) {
    string(errors, `${forecastWhere}.referenceClass.label`, forecast.referenceClass.label);
    nonNegativeInteger(errors, `${forecastWhere}.referenceClass.sampleSize`, forecast.referenceClass.sampleSize);
    string(errors, `${forecastWhere}.referenceClass.basis`, forecast.referenceClass.basis);
  }
  if (!Array.isArray(forecast.fermiComponents) || !forecast.fermiComponents.length)
    add(errors, `${forecastWhere}.fermiComponents`, 'must contain at least one component');
  const fermiTotals = { low: 0, central: 0, high: 0 };
  for (const [index, component] of (forecast.fermiComponents || []).entries()) {
    const componentWhere = `${forecastWhere}.fermiComponents[${index}]`;
    const componentFields = ['component', 'count', 'lowMinutesPerUnit', 'centralMinutesPerUnit', 'highMinutesPerUnit', 'basis'];
    if (!keys(errors, componentWhere, component, componentFields)) continue;
    string(errors, `${componentWhere}.component`, component.component);
    string(errors, `${componentWhere}.basis`, component.basis);
    nonNegativeInteger(errors, `${componentWhere}.count`, component.count, { min: 1 });
    for (const field of ['lowMinutesPerUnit', 'centralMinutesPerUnit', 'highMinutesPerUnit'])
      nonNegativeInteger(errors, `${componentWhere}.${field}`, component[field]);
    if (component.lowMinutesPerUnit > component.centralMinutesPerUnit || component.centralMinutesPerUnit > component.highMinutesPerUnit)
      add(errors, componentWhere, 'requires lowMinutesPerUnit <= centralMinutesPerUnit <= highMinutesPerUnit');
    fermiTotals.low += component.count * component.lowMinutesPerUnit;
    fermiTotals.central += component.count * component.centralMinutesPerUnit;
    fermiTotals.high += component.count * component.highMinutesPerUnit;
  }
  if (fermiTotals.low !== forecast.plausibleLowMinutes) add(errors, `${forecastWhere}.plausibleLowMinutes`, `must equal Fermi component total ${fermiTotals.low}`);
  if (fermiTotals.central !== forecast.expectedActiveMinutes) add(errors, `${forecastWhere}.expectedActiveMinutes`, `must equal Fermi component total ${fermiTotals.central}`);
  if (fermiTotals.high !== forecast.plausibleHighMinutes) add(errors, `${forecastWhere}.plausibleHighMinutes`, `must equal Fermi component total ${fermiTotals.high}`);

  const terminalStatuses = new Set(['published', 'stopped', 'abandoned', 'superseded']);
  const outcome = metrics.outcome;
  if (outcome === null) {
    if (terminalStatuses.has(attempt.status)) add(errors, `${where}.metrics.outcome`, `is required when attempt status is ${attempt.status}`);
    return;
  }
  if (!terminalStatuses.has(attempt.status)) add(errors, `${where}.metrics.outcome`, 'may be frozen only at a terminal attempt status');
  const outcomeWhere = `${where}.metrics.outcome`;
  const outcomeFields = ['measuredAt', 'calendarElapsedMinutes', 'activeAgentMinutes', 'activeHumanMinutes', 'computeMinutes',
    'unattendedWaitMinutes', 'blockedMinutes', 'reworkMinutes', 'agentRuns', 'maxParallelAgents', 'modelTurns',
    'deduplicatedModelTokens', 'uncachedInputTokens', 'researchCycles', 'falsificationGatesRun',
    'candidateArchitecturesTested', 'candidateArchitecturesRejected', 'substantiveReviewRounds', 'p0Findings',
    'p1Findings', 'prepublicationClaimCorrections', 'resultState', 'resultSummary', 'positiveSignalObserved',
    'targetReached', 'forecastErrorMinutes', 'forecastRatio', 'withinForecastInterval', 'varianceReason', 'missingFields'];
  if (!keys(errors, outcomeWhere, outcome, outcomeFields)) return;
  dateTime(errors, `${outcomeWhere}.measuredAt`, outcome.measuredAt);
  if (outcome.measuredAt !== attempt.statusAt) add(errors, `${outcomeWhere}.measuredAt`, 'must equal the terminal statusAt receipt');
  const elapsed = Math.round((Date.parse(attempt.statusAt) - Date.parse(attempt.registeredAt)) / 60000);
  nonNegativeInteger(errors, `${outcomeWhere}.calendarElapsedMinutes`, outcome.calendarElapsedMinutes);
  if (outcome.calendarElapsedMinutes !== elapsed) add(errors, `${outcomeWhere}.calendarElapsedMinutes`, `must equal the rounded registeredAt-to-statusAt duration ${elapsed}`);
  for (const field of ['activeAgentMinutes', 'unattendedWaitMinutes', 'blockedMinutes', 'reworkMinutes',
    'falsificationGatesRun', 'candidateArchitecturesTested', 'candidateArchitecturesRejected',
    'substantiveReviewRounds', 'p0Findings', 'p1Findings', 'prepublicationClaimCorrections'])
    nonNegativeInteger(errors, `${outcomeWhere}.${field}`, outcome[field]);
  for (const field of ['agentRuns', 'maxParallelAgents', 'modelTurns'])
    nonNegativeInteger(errors, `${outcomeWhere}.${field}`, outcome[field], { min: 1 });
  for (const field of metricsPolicy.optionalTelemetryFields)
    nonNegativeInteger(errors, `${outcomeWhere}.${field}`, outcome[field], { nullable: true });
  if (outcome.maxParallelAgents > outcome.agentRuns) add(errors, `${outcomeWhere}.maxParallelAgents`, 'cannot exceed agentRuns');
  if (outcome.candidateArchitecturesRejected > outcome.candidateArchitecturesTested)
    add(errors, `${outcomeWhere}.candidateArchitecturesRejected`, 'cannot exceed candidateArchitecturesTested');
  if (keys(errors, `${outcomeWhere}.researchCycles`, outcome.researchCycles, ['positive', 'negative', 'inconclusive'])) {
    for (const field of ['positive', 'negative', 'inconclusive']) nonNegativeInteger(errors, `${outcomeWhere}.researchCycles.${field}`, outcome.researchCycles[field]);
  }
  if (!metricsPolicy.resultStates.includes(outcome.resultState)) add(errors, `${outcomeWhere}.resultState`, 'is not registered by the metrics policy');
  string(errors, `${outcomeWhere}.resultSummary`, outcome.resultSummary);
  if (outcome.positiveSignalObserved !== null && typeof outcome.positiveSignalObserved !== 'boolean')
    add(errors, `${outcomeWhere}.positiveSignalObserved`, 'must be boolean or null');
  if (typeof outcome.targetReached !== 'boolean') add(errors, `${outcomeWhere}.targetReached`, 'must be boolean');
  if (outcome.targetReached !== (outcome.resultState === 'target-closed'))
    add(errors, `${outcomeWhere}.targetReached`, 'must be true exactly when resultState is target-closed');
  if (outcome.resultState === 'positive-signal' && outcome.positiveSignalObserved !== true)
    add(errors, `${outcomeWhere}.positiveSignalObserved`, 'must be true when resultState is positive-signal');
  if (outcome.resultState === 'target-closed' && outcome.positiveSignalObserved !== true)
    add(errors, `${outcomeWhere}.positiveSignalObserved`, 'must be true when resultState is target-closed');
  const expectedError = outcome.activeAgentMinutes - forecast.expectedActiveMinutes;
  if (outcome.forecastErrorMinutes !== expectedError) add(errors, `${outcomeWhere}.forecastErrorMinutes`, `must equal activeAgentMinutes - expectedActiveMinutes (${expectedError})`);
  if (typeof outcome.forecastRatio !== 'number' || !Number.isFinite(outcome.forecastRatio) || outcome.forecastRatio < 0)
    add(errors, `${outcomeWhere}.forecastRatio`, 'must be a finite non-negative number');
  const expectedRatio = outcome.activeAgentMinutes / forecast.expectedActiveMinutes;
  if (Math.abs(outcome.forecastRatio - expectedRatio) > 0.005)
    add(errors, `${outcomeWhere}.forecastRatio`, `must equal activeAgentMinutes / expectedActiveMinutes (${expectedRatio.toFixed(4)}) within 0.005`);
  const expectedCoverage = outcome.activeAgentMinutes >= forecast.plausibleLowMinutes && outcome.activeAgentMinutes <= forecast.plausibleHighMinutes;
  if (outcome.withinForecastInterval !== expectedCoverage) add(errors, `${outcomeWhere}.withinForecastInterval`, `must be ${expectedCoverage}`);
  optionalString(errors, `${outcomeWhere}.varianceReason`, outcome.varianceReason);
  if (!expectedCoverage && !outcome.varianceReason) add(errors, `${outcomeWhere}.varianceReason`, 'is required when active work falls outside the frozen interval');

  if (!Array.isArray(outcome.missingFields)) add(errors, `${outcomeWhere}.missingFields`, 'must be an array');
  const missing = new Map();
  for (const [index, item] of (outcome.missingFields || []).entries()) {
    const missingWhere = `${outcomeWhere}.missingFields[${index}]`;
    if (!keys(errors, missingWhere, item, ['field', 'reason'])) continue;
    if (!metricsPolicy.optionalTelemetryFields.includes(item.field)) add(errors, `${missingWhere}.field`, 'is not optional telemetry');
    if (missing.has(item.field)) add(errors, `${missingWhere}.field`, `duplicates ${JSON.stringify(item.field)}`);
    missing.set(item.field, item.reason);
    string(errors, `${missingWhere}.reason`, item.reason);
  }
  for (const field of metricsPolicy.optionalTelemetryFields) {
    if (outcome[field] === null && !missing.has(field)) add(errors, `${outcomeWhere}.missingFields`, `must explain null ${field}`);
    if (outcome[field] !== null && missing.has(field)) add(errors, `${outcomeWhere}.missingFields`, `must not mark populated ${field} as missing`);
  }
  if (attempt.measurement.status === 'not-recorded') add(errors, `${where}.measurement.status`, 'cannot be not-recorded when a terminal research-metrics outcome exists');
  for (const field of ['activeHumanMinutes', 'computeMinutes', 'agentRuns', 'reworkMinutes']) {
    const correctionField = `measurement.${field} -> metrics.outcome.${field}`;
    const hasExactCorrection = (attempt.corrections || []).some(correction => correction.field === correctionField);
    if (attempt.measurement[field] !== outcome[field] && !hasExactCorrection) {
      add(errors, `${where}.measurement.${field}`, `must equal metrics.outcome.${field} unless an append-only correction names ${JSON.stringify(correctionField)}`);
    }
  }
}

function validateWorkLedger(ledger, paperSlugs, policy, metricsPolicy, errors) {
  const required = ['schemaVersion', 'effectiveDate', 'baselineCommit', 'policy', 'status', 'claimCeiling', 'requiredAtIntake',
    'workStatuses', 'measurementStatuses', 'cohorts', 'resultClasses', 'attempts', 'updatePolicy', 'changeLog'];
  if (!keys(errors, 'WORK_LEDGER', ledger, required)) return { attemptById: new Map(), attemptsByWorkId: new Map() };
  string(errors, 'WORK_LEDGER.schemaVersion', ledger.schemaVersion, VERSION_RE);
  date(errors, 'WORK_LEDGER.effectiveDate', ledger.effectiveDate);
  if (ledger.baselineCommit !== FROZEN_BASELINE_COMMIT) add(errors, 'WORK_LEDGER.baselineCommit', 'must match the frozen adoption commit');
  if (ledger.policy !== 'prospective-only-no-legacy-backfill') add(errors, 'WORK_LEDGER.policy', 'must preserve prospective-only measurement');
  if (ledger.status !== 'prospective-intake-ledger') add(errors, 'WORK_LEDGER.status', 'must equal "prospective-intake-ledger"');
  string(errors, 'WORK_LEDGER.claimCeiling', ledger.claimCeiling);
  const intakeFields = ['attemptId', 'workId', 'registeredAt', 'aims', 'question', 'selectionBasis', 'taskClass', 'decisionObjectTarget', 'comparisonPlan'];
  const actualIntake = stringArray(errors, 'WORK_LEDGER.requiredAtIntake', ledger.requiredAtIntake, { min: intakeFields.length });
  for (const field of intakeFields) if (!actualIntake.includes(field)) add(errors, 'WORK_LEDGER.requiredAtIntake', `missing intake field ${JSON.stringify(field)}`);
  const statuses = stringArray(errors, 'WORK_LEDGER.workStatuses', ledger.workStatuses, { min: 7, pattern: ID_RE });
  const measurementStatuses = stringArray(errors, 'WORK_LEDGER.measurementStatuses', ledger.measurementStatuses, { min: 3, pattern: ID_RE });
  const cohorts = stringArray(errors, 'WORK_LEDGER.cohorts', ledger.cohorts, { min: 2, pattern: ID_RE });
  const resultClasses = stringArray(errors, 'WORK_LEDGER.resultClasses', ledger.resultClasses, { min: 6, pattern: ID_RE });
  if (!Array.isArray(ledger.attempts)) add(errors, 'WORK_LEDGER.attempts', 'must be an array');

  const attemptById = new Map();
  const attemptsByWorkId = new Map();
  const terminalStatuses = new Set(['published', 'stopped', 'abandoned', 'superseded']);
  const terminalWithoutRelease = new Set(['stopped', 'abandoned', 'superseded']);
  const assuranceStates = ['passed', 'partial', 'failed', 'not-assessed', 'not-applicable'];
  const milestoneEvents = ['work-opened', 'result-ready', 'claim-locked', 'assurance-endpoint-reached', 'public-release', 'translation-use', 'work-stopped'];

  for (const [index, attempt] of (ledger.attempts || []).entries()) {
    const where = `WORK_LEDGER.attempts[${index}]`;
    const attemptRequired = ['attemptId', 'workId', 'cohort', 'registeredAt', 'aims', 'question', 'selectionBasis',
      'taskClass', 'status', 'statusAt', 'resultClass', 'statusHistory', 'decisionObjectTarget', 'comparisonPlan',
      'measurement', 'assuranceEndpoint', 'releaseSlug', 'stopReason', 'revisions'];
    attemptRequired.splice(attemptRequired.length - 1, 0, 'corrections');
    if (!keys(errors, where, attempt, attemptRequired, [...attemptRequired, 'metrics'])) continue;
    if (string(errors, `${where}.attemptId`, attempt.attemptId, ATTEMPT_ID_RE)) {
      if (attemptById.has(attempt.attemptId)) add(errors, `${where}.attemptId`, `duplicates ${JSON.stringify(attempt.attemptId)}`);
      attemptById.set(attempt.attemptId, attempt);
    }
    if (string(errors, `${where}.workId`, attempt.workId, WORK_ID_RE)) {
      if (!attemptsByWorkId.has(attempt.workId)) attemptsByWorkId.set(attempt.workId, []);
      attemptsByWorkId.get(attempt.workId).push(attempt);
    }
    if (!cohorts.includes(attempt.cohort)) add(errors, `${where}.cohort`, `${JSON.stringify(attempt.cohort)} is not registered`);
    dateTime(errors, `${where}.registeredAt`, attempt.registeredAt);
    if (attempt.cohort === 'prospective' && String(attempt.registeredAt).slice(0, 10) < ledger.effectiveDate)
      add(errors, `${where}.registeredAt`, 'a prospective attempt cannot predate ledger adoption; use left-censored-at-adoption without reconstruction');
    stringArray(errors, `${where}.aims`, attempt.aims, { min: 1, allowed: policy.aims || [] });
    for (const field of ['question', 'selectionBasis', 'taskClass', 'decisionObjectTarget']) string(errors, `${where}.${field}`, attempt[field]);
    if (!statuses.includes(attempt.status)) add(errors, `${where}.status`, `${JSON.stringify(attempt.status)} is not registered`);
    dateTime(errors, `${where}.statusAt`, attempt.statusAt);
    if (String(attempt.statusAt) < String(attempt.registeredAt)) add(errors, `${where}.statusAt`, 'must not precede registeredAt');
    if (!resultClasses.includes(attempt.resultClass)) add(errors, `${where}.resultClass`, `${JSON.stringify(attempt.resultClass)} is not registered`);
    if (attempt.status === 'active' && attempt.resultClass !== 'pending') add(errors, `${where}.resultClass`, 'active work must remain pending until a result-ready status is recorded');
    if (['result-ready', 'release-candidate'].includes(attempt.status) && attempt.resultClass === 'pending') add(errors, `${where}.resultClass`, `${attempt.status} work must declare a result class`);
    if (terminalStatuses.has(attempt.status) && attempt.resultClass === 'pending') add(errors, `${where}.resultClass`, 'a terminal work status cannot retain a pending result class');

    if (!Array.isArray(attempt.statusHistory) || !attempt.statusHistory.length) add(errors, `${where}.statusHistory`, 'must retain at least the intake event');
    let priorAt = '';
    for (const [eventIndex, event] of (attempt.statusHistory || []).entries()) {
      const eventWhere = `${where}.statusHistory[${eventIndex}]`;
      if (!keys(errors, eventWhere, event, ['at', 'status', 'resultClass', 'reason', 'evidenceRefs'])) continue;
      dateTime(errors, `${eventWhere}.at`, event.at);
      if (priorAt && event.at < priorAt) add(errors, `${eventWhere}.at`, 'precedes the prior status event');
      priorAt = event.at;
      if (!statuses.includes(event.status)) add(errors, `${eventWhere}.status`, `${JSON.stringify(event.status)} is not registered`);
      if (!resultClasses.includes(event.resultClass)) add(errors, `${eventWhere}.resultClass`, `${JSON.stringify(event.resultClass)} is not registered`);
      string(errors, `${eventWhere}.reason`, event.reason);
      urlArray(errors, `${eventWhere}.evidenceRefs`, event.evidenceRefs);
    }
    const firstEvent = (attempt.statusHistory || [])[0];
    const lastEvent = (attempt.statusHistory || [])[attempt.statusHistory.length - 1];
    if (firstEvent && firstEvent.at !== attempt.registeredAt) add(errors, `${where}.statusHistory[0].at`, 'must equal registeredAt');
    if (firstEvent && firstEvent.status !== 'active') add(errors, `${where}.statusHistory[0].status`, 'must start at active');
    if (lastEvent && (lastEvent.status !== attempt.status || lastEvent.resultClass !== attempt.resultClass || lastEvent.at !== attempt.statusAt))
      add(errors, `${where}.statusHistory`, 'last event must exactly match status, resultClass and statusAt');

    if (keys(errors, `${where}.comparisonPlan`, attempt.comparisonPlan,
      ['status', 'comparator', 'estimand', 'matchedAssuranceEndpoint', 'reason'])) {
      if (!['planned', 'not-applicable', 'not-recorded'].includes(attempt.comparisonPlan.status)) add(errors, `${where}.comparisonPlan.status`, 'is not registered');
      for (const field of ['comparator', 'estimand', 'matchedAssuranceEndpoint', 'reason']) string(errors, `${where}.comparisonPlan.${field}`, attempt.comparisonPlan[field]);
      if (attempt.comparisonPlan.status === 'planned' && /not (measured|recorded|applicable)/i.test(attempt.comparisonPlan.comparator))
        add(errors, `${where}.comparisonPlan.comparator`, 'a planned comparison must name an actual comparator');
    }

    if (keys(errors, `${where}.measurement`, attempt.measurement,
      ['status', 'missingnessReason', 'milestones', 'activeHumanMinutes', 'computeMinutes', 'computeCost', 'agentRuns', 'reworkMinutes', 'correctionCount'])) {
      const measurement = attempt.measurement;
      if (!measurementStatuses.includes(measurement.status)) add(errors, `${where}.measurement.status`, 'is not registered');
      optionalString(errors, `${where}.measurement.missingnessReason`, measurement.missingnessReason);
      if (!Array.isArray(measurement.milestones)) add(errors, `${where}.measurement.milestones`, 'must be an array');
      const seenEvents = new Set();
      let priorMilestone = '';
      for (const [milestoneIndex, milestone] of (measurement.milestones || []).entries()) {
        const milestoneWhere = `${where}.measurement.milestones[${milestoneIndex}]`;
        if (!keys(errors, milestoneWhere, milestone, ['event', 'at', 'basis'])) continue;
        if (!milestoneEvents.includes(milestone.event)) add(errors, `${milestoneWhere}.event`, 'is not registered');
        if (seenEvents.has(milestone.event)) add(errors, `${milestoneWhere}.event`, `duplicates ${JSON.stringify(milestone.event)}`);
        seenEvents.add(milestone.event);
        dateTime(errors, `${milestoneWhere}.at`, milestone.at);
        if (String(milestone.at) < String(attempt.registeredAt))
          add(errors, `${milestoneWhere}.at`, 'must not precede the prospective registration time');
        if (milestone.event !== 'translation-use' && String(milestone.at) > String(attempt.statusAt))
          add(errors, `${milestoneWhere}.at`, 'must not postdate the attempt status receipt');
        if (milestone.event === 'public-release' && attempt.status !== 'published')
          add(errors, `${milestoneWhere}.event`, 'can be recorded only on a published attempt');
        if (priorMilestone && milestone.at < priorMilestone) add(errors, `${milestoneWhere}.at`, 'precedes the prior milestone');
        priorMilestone = milestone.at;
        string(errors, `${milestoneWhere}.basis`, milestone.basis);
      }
      const numericFields = ['activeHumanMinutes', 'computeMinutes', 'agentRuns', 'reworkMinutes', 'correctionCount'];
      for (const field of numericFields) {
        const value = measurement[field];
        if (value !== null && (!Number.isInteger(value) || value < 0)) add(errors, `${where}.measurement.${field}`, 'must be a non-negative integer or null');
      }
      if (measurement.computeCost !== null) {
        if (keys(errors, `${where}.measurement.computeCost`, measurement.computeCost, ['amount', 'currency'])) {
          if (typeof measurement.computeCost.amount !== 'number' || measurement.computeCost.amount < 0) add(errors, `${where}.measurement.computeCost.amount`, 'must be a non-negative number');
          string(errors, `${where}.measurement.computeCost.currency`, measurement.computeCost.currency, /^[A-Z]{3}$/);
        }
      }
      const resourceValues = [...numericFields.map(field => measurement[field]), measurement.computeCost];
      if (measurement.status === 'not-recorded') {
        if (!measurement.missingnessReason) add(errors, `${where}.measurement.missingnessReason`, 'is required when measurements were not recorded');
        if (measurement.milestones.length || resourceValues.some(value => value !== null)) add(errors, `${where}.measurement`, 'not-recorded measurement must not contain reconstructed milestones or resource values');
      } else if (measurement.status === 'measured-complete') {
        if (measurement.missingnessReason !== null) add(errors, `${where}.measurement.missingnessReason`, 'must be null for complete measurement');
        if (!measurement.milestones.length || resourceValues.some(value => value === null)) add(errors, `${where}.measurement`, 'complete measurement requires milestones and every resource value');
        const requiredEvents = new Set(['work-opened']);
        if (['result-ready', 'release-candidate', 'published'].includes(attempt.status)) requiredEvents.add('result-ready');
        if (['release-candidate', 'published'].includes(attempt.status)) {
          requiredEvents.add('claim-locked');
          requiredEvents.add('assurance-endpoint-reached');
        }
        if (attempt.status === 'published') requiredEvents.add('public-release');
        if (['stopped', 'abandoned', 'superseded'].includes(attempt.status)) requiredEvents.add('work-stopped');
        for (const event of requiredEvents) if (!seenEvents.has(event)) add(errors, `${where}.measurement.milestones`, `complete ${attempt.status} measurement requires ${JSON.stringify(event)}`);
      } else if (!measurement.missingnessReason && (resourceValues.some(value => value === null) || !measurement.milestones.length)) {
        add(errors, `${where}.measurement.missingnessReason`, 'is required for each partial record with missing values');
      }
      if (attempt.cohort === 'left-censored-at-adoption' && measurement.status !== 'not-recorded')
        add(errors, `${where}.measurement.status`, 'left-censored work must keep pre-adoption clocks and resources not-recorded; open a prospective attempt for later work');
    }
    validateResearchMetrics(errors, where, attempt, metricsPolicy);

    if (keys(errors, `${where}.assuranceEndpoint`, attempt.assuranceEndpoint,
      ['status', 'assessedAt', 'dimensions', 'claimCeiling', 'evidenceRefs', 'missingnessReason'])) {
      const assurance = attempt.assuranceEndpoint;
      if (!measurementStatuses.includes(assurance.status)) add(errors, `${where}.assuranceEndpoint.status`, 'is not registered');
      if (assurance.assessedAt !== null) dateTime(errors, `${where}.assuranceEndpoint.assessedAt`, assurance.assessedAt);
      optionalString(errors, `${where}.assuranceEndpoint.claimCeiling`, assurance.claimCeiling);
      optionalString(errors, `${where}.assuranceEndpoint.missingnessReason`, assurance.missingnessReason);
      const assuranceEvidence = evidenceUrlArray(errors, `${where}.assuranceEndpoint.evidenceRefs`, assurance.evidenceRefs);
      if (!Array.isArray(assurance.dimensions)) add(errors, `${where}.assuranceEndpoint.dimensions`, 'must be an array');
      const seenDimensions = new Set();
      for (const [dimensionIndex, dimension] of (assurance.dimensions || []).entries()) {
        const dimensionWhere = `${where}.assuranceEndpoint.dimensions[${dimensionIndex}]`;
        if (!keys(errors, dimensionWhere, dimension, ['dimension', 'state', 'evidenceRefs'])) continue;
        if (!(policy.assuranceDimensions || []).includes(dimension.dimension)) add(errors, `${dimensionWhere}.dimension`, 'is not registered');
        if (seenDimensions.has(dimension.dimension)) add(errors, `${dimensionWhere}.dimension`, `duplicates ${JSON.stringify(dimension.dimension)}`);
        seenDimensions.add(dimension.dimension);
        if (!assuranceStates.includes(dimension.state)) add(errors, `${dimensionWhere}.state`, 'is not registered');
        const dimensionEvidence = evidenceUrlArray(errors, `${dimensionWhere}.evidenceRefs`, dimension.evidenceRefs);
        if (['passed', 'partial', 'failed'].includes(dimension.state) && !dimensionEvidence.length)
          add(errors, `${dimensionWhere}.evidenceRefs`, `${dimension.state} assurance requires evidence`);
      }
      if (assurance.status === 'not-recorded') {
        if (assurance.assessedAt !== null || assurance.claimCeiling !== null || assurance.dimensions.length || assurance.evidenceRefs.length || !assurance.missingnessReason)
          add(errors, `${where}.assuranceEndpoint`, 'not-recorded assurance must contain only an explicit missingness reason');
      } else {
        if (!assurance.assessedAt || !assurance.claimCeiling || !assurance.dimensions.length || !assuranceEvidence.length)
          add(errors, `${where}.assuranceEndpoint`, 'measured assurance requires an assessment time, dimensions, claim ceiling and evidence');
        if (assurance.assessedAt && String(assurance.assessedAt) < String(attempt.registeredAt))
          add(errors, `${where}.assuranceEndpoint.assessedAt`, 'must not precede the prospective registration time');
        if (assurance.status === 'measured-complete' && assurance.missingnessReason !== null) add(errors, `${where}.assuranceEndpoint.missingnessReason`, 'must be null for complete assurance measurement');
      }
      if (attempt.cohort === 'left-censored-at-adoption' && assurance.status !== 'not-recorded')
        add(errors, `${where}.assuranceEndpoint.status`, 'left-censored work must not reconstruct a pre-adoption assurance endpoint');
    }

    if (attempt.releaseSlug !== null) {
      string(errors, `${where}.releaseSlug`, attempt.releaseSlug, ID_RE);
      if (!paperSlugs.includes(attempt.releaseSlug)) add(errors, `${where}.releaseSlug`, `unknown release ${JSON.stringify(attempt.releaseSlug)}`);
      if ((policy.legacyReleaseSlugs || []).includes(attempt.releaseSlug)) add(errors, `${where}.releaseSlug`, 'must not backfill a frozen legacy release');
    }
    if (['release-candidate', 'published'].includes(attempt.status) && attempt.releaseSlug === null) add(errors, `${where}.releaseSlug`, `is required when status is ${attempt.status}`);
    if (terminalWithoutRelease.has(attempt.status) && attempt.releaseSlug !== null) add(errors, `${where}.releaseSlug`, `must be null when status is ${attempt.status}`);
    optionalString(errors, `${where}.stopReason`, attempt.stopReason);
    if (terminalWithoutRelease.has(attempt.status) && !attempt.stopReason) add(errors, `${where}.stopReason`, `is required when status is ${attempt.status}`);
    if (!terminalWithoutRelease.has(attempt.status) && attempt.stopReason !== null) add(errors, `${where}.stopReason`, `must be null when status is ${attempt.status}`);
    if (!Array.isArray(attempt.corrections)) add(errors, `${where}.corrections`, 'must be an array');
    let priorCorrection = '';
    for (const [correctionIndex, correction] of (attempt.corrections || []).entries()) {
      const correctionWhere = `${where}.corrections[${correctionIndex}]`;
      if (!keys(errors, correctionWhere, correction, ['at', 'field', 'reason', 'replacement', 'evidenceRefs'])) continue;
      dateTime(errors, `${correctionWhere}.at`, correction.at);
      if (priorCorrection && correction.at < priorCorrection) add(errors, `${correctionWhere}.at`, 'precedes the prior correction');
      priorCorrection = correction.at;
      for (const field of ['field', 'reason', 'replacement']) string(errors, `${correctionWhere}.${field}`, correction[field]);
      urlArray(errors, `${correctionWhere}.evidenceRefs`, correction.evidenceRefs);
    }
    if (attempt.measurement && attempt.measurement.correctionCount !== null &&
        attempt.measurement.correctionCount !== (attempt.corrections || []).length)
      add(errors, `${where}.measurement.correctionCount`, 'must equal the number of retained correction receipts');
    if (!Array.isArray(attempt.revisions)) add(errors, `${where}.revisions`, 'must be an array');
    for (const [revisionIndex, revision] of (attempt.revisions || []).entries()) validateChange(errors, `${where}.revisions[${revisionIndex}]`, revision);
  }

  if (keys(errors, 'WORK_LEDGER.updatePolicy', ledger.updatePolicy, ['cadence', 'rules'])) {
    string(errors, 'WORK_LEDGER.updatePolicy.cadence', ledger.updatePolicy.cadence);
    stringArray(errors, 'WORK_LEDGER.updatePolicy.rules', ledger.updatePolicy.rules, { min: 3 });
  }
  if (!Array.isArray(ledger.changeLog) || !ledger.changeLog.length) add(errors, 'WORK_LEDGER.changeLog', 'must be a non-empty array');
  for (const [index, change] of (ledger.changeLog || []).entries()) validateChange(errors, `WORK_LEDGER.changeLog[${index}]`, change);
  return { attemptById, attemptsByWorkId };
}

function validateRegistry(registry, paperSlugs, errors) {
  const required = ['schemaVersion', 'updated', 'status', 'claimCeiling', 'aims', 'methods', 'methodClusters',
    'lineages', 'releaseAssignments', 'updatePolicy', 'changeLog'];
  if (!keys(errors, 'METHOD_REGISTRY', registry, required)) return {
    methodIds: [], clusterIds: [], clusterMembership: new Map(), lineageIds: [], lineageMembership: new Map(), lineageById: new Map(), assignments: {}
  };
  string(errors, 'METHOD_REGISTRY.schemaVersion', registry.schemaVersion, VERSION_RE);
  date(errors, 'METHOD_REGISTRY.updated', registry.updated);
  string(errors, 'METHOD_REGISTRY.status', registry.status);
  string(errors, 'METHOD_REGISTRY.claimCeiling', registry.claimCeiling);
  const aims = stringArray(errors, 'METHOD_REGISTRY.aims', registry.aims, { min: 3 });

  if (!Array.isArray(registry.methods) || !registry.methods.length) add(errors, 'METHOD_REGISTRY.methods', 'must be a non-empty array');
  const methodIds = new Set();
  for (const [index, method] of (registry.methods || []).entries()) {
    const where = `METHOD_REGISTRY.methods[${index}]`;
    const requiredMethod = ['id', 'name', 'definition', 'mechanism', 'applicability',
      'failureModes', 'aims', 'representativeReleases'];
    const allowedMethod = [...requiredMethod, 'programmePaths'];
    if (!keys(errors, where, method, requiredMethod, allowedMethod)) continue;
    uniqueId(errors, `${where}.id`, method.id, methodIds);
    for (const field of ['name', 'definition', 'mechanism']) string(errors, `${where}.${field}`, method[field]);
    stringArray(errors, `${where}.applicability`, method.applicability, { min: 1 });
    stringArray(errors, `${where}.failureModes`, method.failureModes, { min: 2 });
    stringArray(errors, `${where}.aims`, method.aims, { min: 1, allowed: aims });
    const representatives = stringArray(errors, `${where}.representativeReleases`, method.representativeReleases, { min: 1, pattern: ID_RE });
    for (const slug of representatives) if (!paperSlugs.includes(slug)) add(errors, `${where}.representativeReleases`, `unknown release ${JSON.stringify(slug)}`);
    if (method.programmePaths != null) stringArray(errors, `${where}.programmePaths`, method.programmePaths, { min: 1 });
  }

  if (!Array.isArray(registry.methodClusters) || !registry.methodClusters.length) add(errors, 'METHOD_REGISTRY.methodClusters', 'must be a non-empty array');
  const clusterIds = new Set();
  const clusterById = new Map();
  const clusterMembership = new Map();
  for (const [index, cluster] of (registry.methodClusters || []).entries()) {
    const where = `METHOD_REGISTRY.methodClusters[${index}]`;
    if (!keys(errors, where, cluster, ['id', 'name', 'members', 'sharedBoundary'],
      ['id', 'name', 'members', 'sharedBoundary', 'supersedes', 'effectiveDate'])) continue;
    uniqueId(errors, `${where}.id`, cluster.id, clusterIds);
    string(errors, `${where}.name`, cluster.name);
    string(errors, `${where}.sharedBoundary`, cluster.sharedBoundary);
    const isSuccessor = cluster.supersedes != null || cluster.effectiveDate != null;
    if (isSuccessor) {
      if (cluster.supersedes == null) add(errors, `${where}.supersedes`, 'is required for a dated successor cluster');
      else string(errors, `${where}.supersedes`, cluster.supersedes, ID_RE);
      if (cluster.effectiveDate == null) add(errors, `${where}.effectiveDate`, 'is required for a successor cluster');
      else date(errors, `${where}.effectiveDate`, cluster.effectiveDate);
      if (cluster.supersedes === cluster.id) add(errors, `${where}.supersedes`, 'must refer to an earlier cluster, not itself');
      else if (cluster.supersedes != null && !clusterById.has(cluster.supersedes))
        add(errors, `${where}.supersedes`, `must resolve to an earlier cluster, got ${JSON.stringify(cluster.supersedes)}`);
    }
    const members = stringArray(errors, `${where}.members`, cluster.members, { min: 1, pattern: ID_RE });
    const superseded = clusterById.get(cluster.supersedes);
    if (superseded && !sameMembers(members, superseded.members)) {
      add(errors, `${where}.members`, `must exactly match superseded cluster ${JSON.stringify(cluster.supersedes)}`);
    }
    for (const slug of members) {
      if (!paperSlugs.includes(slug)) add(errors, `${where}.members`, `unknown release ${JSON.stringify(slug)}`);
      if (clusterMembership.has(slug) && cluster.supersedes !== clusterMembership.get(slug)) {
        add(errors, `${where}.members`, `${JSON.stringify(slug)} already belongs to active method cluster ${JSON.stringify(clusterMembership.get(slug))}; a duplicate requires an explicit successor of that cluster`);
      }
      clusterMembership.set(slug, cluster.id);
    }
    clusterById.set(cluster.id, cluster);
  }
  for (const slug of paperSlugs) if (!clusterMembership.has(slug)) add(errors, 'METHOD_REGISTRY.methodClusters', `release ${JSON.stringify(slug)} has no method cluster`);

  if (!Array.isArray(registry.lineages) || !registry.lineages.length) add(errors, 'METHOD_REGISTRY.lineages', 'must be a non-empty array');
  const lineageIds = new Set();
  const lineageMembership = new Map();
  const lineageById = new Map();
  for (const [index, lineage] of (registry.lineages || []).entries()) {
    const where = `METHOD_REGISTRY.lineages[${index}]`;
    if (!keys(errors, where, lineage, ['id', 'name', 'rootReleaseSlug', 'members', 'basis', 'sharedBoundary'])) continue;
    uniqueId(errors, `${where}.id`, lineage.id, lineageIds);
    lineageById.set(lineage.id, lineage);
    for (const field of ['name', 'basis', 'sharedBoundary']) string(errors, `${where}.${field}`, lineage[field]);
    string(errors, `${where}.rootReleaseSlug`, lineage.rootReleaseSlug, ID_RE);
    const members = stringArray(errors, `${where}.members`, lineage.members, { min: 1, pattern: ID_RE });
    if (members[0] !== lineage.rootReleaseSlug) add(errors, `${where}.rootReleaseSlug`, 'must equal the first lineage member; later members append after the root');
    for (const slug of members) {
      if (!paperSlugs.includes(slug)) add(errors, `${where}.members`, `unknown release ${JSON.stringify(slug)}`);
      if (lineageMembership.has(slug)) add(errors, `${where}.members`, `${JSON.stringify(slug)} already belongs to lineage ${JSON.stringify(lineageMembership.get(slug))}`);
      lineageMembership.set(slug, lineage.id);
    }
  }

  if (!isObject(registry.releaseAssignments)) add(errors, 'METHOD_REGISTRY.releaseAssignments', 'must be an object');
  const assignments = registry.releaseAssignments || {};
  for (const slug of paperSlugs) {
    if (!(slug in assignments)) add(errors, 'METHOD_REGISTRY.releaseAssignments', `missing release ${JSON.stringify(slug)}`);
  }
  for (const [slug, refs] of Object.entries(assignments)) {
    if (!paperSlugs.includes(slug)) add(errors, `METHOD_REGISTRY.releaseAssignments.${slug}`, 'does not resolve to a release');
    const values = stringArray(errors, `METHOD_REGISTRY.releaseAssignments.${slug}`, refs, { min: 1, pattern: ID_RE });
    for (const id of values) if (!methodIds.has(id)) add(errors, `METHOD_REGISTRY.releaseAssignments.${slug}`, `unknown method ${JSON.stringify(id)}`);
  }
  for (const [methodIndex, method] of (registry.methods || []).entries()) {
    for (const slug of method.representativeReleases || []) {
      if (!(assignments[slug] || []).includes(method.id)) add(errors,
        `METHOD_REGISTRY.methods[${methodIndex}].representativeReleases`,
        `${JSON.stringify(slug)} is representative of ${JSON.stringify(method.id)} but its release assignment omits that method`);
    }
  }
  if (keys(errors, 'METHOD_REGISTRY.updatePolicy', registry.updatePolicy, ['mode', 'rules'])) {
    if (registry.updatePolicy.mode !== 'append-only-semantic-history') add(errors, 'METHOD_REGISTRY.updatePolicy.mode', 'must preserve append-only semantic history');
    stringArray(errors, 'METHOD_REGISTRY.updatePolicy.rules', registry.updatePolicy.rules, { min: 3 });
  }
  if (!Array.isArray(registry.changeLog) || !registry.changeLog.length) add(errors, 'METHOD_REGISTRY.changeLog', 'must be a non-empty array');
  for (const [index, change] of (registry.changeLog || []).entries()) validateChange(errors, `METHOD_REGISTRY.changeLog[${index}]`, change);
  return {
    methodIds: [...methodIds], clusterIds: [...clusterIds], clusterMembership,
    lineageIds: [...lineageIds], lineageMembership, lineageById, assignments
  };
}

function validateLedger(ledger, policy, root, errors) {
  const required = ['schemaVersion', 'updated', 'status', 'focalExplanation', 'claimCeiling',
    'statusVocabulary', 'observations', 'hypotheses', 'updatePolicy', 'changeLog'];
  if (!keys(errors, 'IBE_LEDGER', ledger, required)) return { hypothesisIds: [], hypothesisById: new Map() };
  string(errors, 'IBE_LEDGER.schemaVersion', ledger.schemaVersion, VERSION_RE);
  date(errors, 'IBE_LEDGER.updated', ledger.updated);
  string(errors, 'IBE_LEDGER.status', ledger.status);
  string(errors, 'IBE_LEDGER.focalExplanation', ledger.focalExplanation);
  string(errors, 'IBE_LEDGER.claimCeiling', ledger.claimCeiling);
  if (!Array.isArray(ledger.statusVocabulary) || ledger.statusVocabulary.length < 3) add(errors, 'IBE_LEDGER.statusVocabulary', 'must contain at least three calibrated status definitions');
  const statusVocabulary = [];
  const statusIds = new Set();
  for (const [index, status] of (ledger.statusVocabulary || []).entries()) {
    const where = `IBE_LEDGER.statusVocabulary[${index}]`;
    if (!keys(errors, where, status, ['id', 'definition', 'entryCriteria', 'claimCeiling'])) continue;
    uniqueId(errors, `${where}.id`, status.id, statusIds);
    statusVocabulary.push(status.id);
    string(errors, `${where}.definition`, status.definition);
    stringArray(errors, `${where}.entryCriteria`, status.entryCriteria, { min: 1 });
    string(errors, `${where}.claimCeiling`, status.claimCeiling);
  }

  if (!Array.isArray(ledger.observations) || !ledger.observations.length) add(errors, 'IBE_LEDGER.observations', 'must be a non-empty array');
  const observationIds = new Set();
  const observationCapabilities = new Map();
  const allowedObservationCapabilities = ['context-limitation', 'mechanism', 'single-case-outcome', 'benchmark-outcome',
    'field-association', 'causal-identification', 'falsifier-test'];
  for (const [index, observation] of (ledger.observations || []).entries()) {
    const where = `IBE_LEDGER.observations[${index}]`;
    if (!keys(errors, where, observation, ['id', 'observedAt', 'statusCapabilities', 'source', 'statement', 'inferenceLimit'])) continue;
    uniqueId(errors, `${where}.id`, observation.id, observationIds);
    observationCapabilities.set(observation.id, new Set(stringArray(errors, `${where}.statusCapabilities`, observation.statusCapabilities,
      { min: 1, allowed: allowedObservationCapabilities })));
    date(errors, `${where}.observedAt`, observation.observedAt);
    for (const field of ['source', 'statement', 'inferenceLimit']) string(errors, `${where}.${field}`, observation[field]);
  }

  if (!Array.isArray(ledger.hypotheses) || !ledger.hypotheses.length) add(errors, 'IBE_LEDGER.hypotheses', 'must be a non-empty array');
  const hypothesisIds = new Set();
  const hypothesisById = new Map();
  const predictionIds = new Set();
  const referencedObservations = new Set();
  for (const [index, hypothesis] of (ledger.hypotheses || []).entries()) {
    const where = `IBE_LEDGER.hypotheses[${index}]`;
    const requiredHypothesis = ['id', 'hypothesis', 'scope', 'aims', 'epistemicStatus', 'statusEvidence', 'rivals',
      'supportingObservations', 'limitingObservations', 'predictions', 'potentialFalsifiers'];
    if (!keys(errors, where, hypothesis, requiredHypothesis)) continue;
    uniqueId(errors, `${where}.id`, hypothesis.id, hypothesisIds);
    hypothesisById.set(hypothesis.id, hypothesis);
    string(errors, `${where}.hypothesis`, hypothesis.hypothesis);
    string(errors, `${where}.scope`, hypothesis.scope);
    stringArray(errors, `${where}.aims`, hypothesis.aims, { min: 1, allowed: policy.aims || [] });
    if (!statusVocabulary.includes(hypothesis.epistemicStatus)) add(errors, `${where}.epistemicStatus`, `${JSON.stringify(hypothesis.epistemicStatus)} is not in statusVocabulary`);
    const statusEvidence = hypothesis.statusEvidence;
    const commonEvidenceFields = ['status', 'designClass', 'observationIds', 'evidenceRefs', 'comparator', 'estimand',
      'decisionRule', 'registeredDesignRef', 'independentReview'];
    const variantFields = {
      untested: ['reason', 'inferenceLimit'],
      'mechanism-supported': ['mechanism', 'inferenceLimit'],
      'single-case-supported': ['caseBoundary', 'inferenceLimit'],
      'benchmark-no-clear-gain': ['benchmarkBoundary', 'inferenceLimit'],
      'field-association': ['confoundingAndSelectionLimits', 'inferenceLimit'],
      'causal-effect-supported': ['identificationAssumptions', 'uncertaintyAndAttrition', 'inferenceLimit'],
      'falsified-within-scope': ['triggeredFalsifier', 'reopenConditions', 'inferenceLimit']
    };
    const evidenceFields = [...commonEvidenceFields, ...(variantFields[hypothesis.epistemicStatus] || [])];
    if (keys(errors, `${where}.statusEvidence`, statusEvidence, evidenceFields)) {
      if (statusEvidence.status !== hypothesis.epistemicStatus)
        add(errors, `${where}.statusEvidence.status`, 'must exactly match epistemicStatus');
      const statusObservationIds = stringArray(errors, `${where}.statusEvidence.observationIds`, statusEvidence.observationIds,
        { min: hypothesis.epistemicStatus === 'untested' ? 0 : 1, pattern: ID_RE });
      for (const id of statusObservationIds) {
        referencedObservations.add(id);
        if (!observationIds.has(id)) add(errors, `${where}.statusEvidence.observationIds`, `unknown observation ${JSON.stringify(id)}`);
      }
      const evidenceRefs = Array.isArray(statusEvidence.evidenceRefs) ? statusEvidence.evidenceRefs : [];
      if (!Array.isArray(statusEvidence.evidenceRefs)) add(errors, `${where}.statusEvidence.evidenceRefs`, 'must be an array');
      const evidenceRoles = new Set();
      const evidenceTargets = new Set();
      const evidenceKindsByTarget = new Map();
      for (const [evidenceIndex, evidence] of evidenceRefs.entries()) {
        const evidenceWhere = `${where}.statusEvidence.evidenceRefs[${evidenceIndex}]`;
        if (!keys(errors, evidenceWhere, evidence, ['kind', 'ref', 'role'])) continue;
        if (!['internal-artifact', 'public-url', 'registered-design', 'independent-review'].includes(evidence.kind))
          add(errors, `${evidenceWhere}.kind`, 'is not registered');
        if (!['benchmark-result', 'mechanism-evidence', 'outcome-evidence', 'field-record', 'design-registration', 'review', 'falsifier-result'].includes(evidence.role))
          add(errors, `${evidenceWhere}.role`, 'is not registered');
        string(errors, `${evidenceWhere}.ref`, evidence.ref);
        evidenceRoles.add(evidence.role);
        evidenceTargets.add(evidence.ref);
        if (!evidenceKindsByTarget.has(evidence.ref)) evidenceKindsByTarget.set(evidence.ref, new Set());
        evidenceKindsByTarget.get(evidence.ref).add(evidence.kind);
        if (evidence.kind === 'internal-artifact') {
          const resolved = path.resolve(root, evidence.ref);
          if (!resolved.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile())
            add(errors, `${evidenceWhere}.ref`, 'must resolve to a retained file inside this repository');
        } else evidenceUrl(errors, `${evidenceWhere}.ref`, evidence.ref);
      }
      if (hypothesis.epistemicStatus === 'untested') {
        if (statusEvidence.designClass !== 'none') add(errors, `${where}.statusEvidence.designClass`, 'untested status requires designClass "none"');
        for (const field of ['comparator', 'estimand', 'decisionRule', 'registeredDesignRef', 'independentReview'])
          if (statusEvidence[field] !== null) add(errors, `${where}.statusEvidence.${field}`, 'must be null while status is untested');
        if (evidenceRefs.length) add(errors, `${where}.statusEvidence.evidenceRefs`, 'untested status cannot carry qualifying effect evidence');
      } else {
        if (!evidenceRefs.length) add(errors, `${where}.statusEvidence.evidenceRefs`, `${hypothesis.epistemicStatus} requires qualifying evidence`);
        for (const field of ['decisionRule', 'inferenceLimit']) string(errors, `${where}.statusEvidence.${field}`, statusEvidence[field]);
      }
      const requiredCapability = {
        'mechanism-supported': 'mechanism',
        'single-case-supported': 'single-case-outcome',
        'benchmark-no-clear-gain': 'benchmark-outcome',
        'field-association': 'field-association',
        'causal-effect-supported': 'causal-identification',
        'falsified-within-scope': 'falsifier-test'
      }[hypothesis.epistemicStatus];
      if (requiredCapability && !statusObservationIds.some(id => (observationCapabilities.get(id) || new Set()).has(requiredCapability)))
        add(errors, `${where}.statusEvidence.observationIds`, `${hypothesis.epistemicStatus} requires a referenced observation classified for ${requiredCapability}`);
      const requireStringFields = fields => fields.forEach(field => string(errors, `${where}.statusEvidence.${field}`, statusEvidence[field]));
      if (hypothesis.epistemicStatus === 'mechanism-supported') {
        if (statusEvidence.designClass !== 'mechanism-observation') add(errors, `${where}.statusEvidence.designClass`, 'mechanism-supported requires mechanism-observation');
        if (statusEvidence.comparator !== null || statusEvidence.estimand !== null) add(errors, `${where}.statusEvidence`, 'mechanism support cannot imply a measured comparative effect');
        requireStringFields(['mechanism']);
        if (!evidenceRoles.has('mechanism-evidence')) add(errors, `${where}.statusEvidence.evidenceRefs`, 'mechanism support requires mechanism-evidence');
      }
      if (hypothesis.epistemicStatus === 'single-case-supported') {
        if (!['single-case', 'controlled-user-study', 'field-observational', 'quasi-experimental', 'randomized-comparison'].includes(statusEvidence.designClass))
          add(errors, `${where}.statusEvidence.designClass`, 'is not a qualifying single-case design');
        requireStringFields(['comparator', 'estimand', 'caseBoundary']);
        if (!evidenceRoles.has('outcome-evidence')) add(errors, `${where}.statusEvidence.evidenceRefs`, 'single-case support requires outcome-evidence');
      }
      if (hypothesis.epistemicStatus === 'benchmark-no-clear-gain') {
        if (statusEvidence.designClass !== 'model-benchmark') add(errors, `${where}.statusEvidence.designClass`, 'benchmark-no-clear-gain requires model-benchmark');
        requireStringFields(['comparator', 'estimand', 'benchmarkBoundary']);
        if (!evidenceRoles.has('benchmark-result')) add(errors, `${where}.statusEvidence.evidenceRefs`, 'benchmark-no-clear-gain requires a preserved benchmark result');
      }
      if (hypothesis.epistemicStatus === 'field-association') {
        if (statusEvidence.designClass !== 'field-observational') add(errors, `${where}.statusEvidence.designClass`, 'field-association requires field-observational');
        requireStringFields(['comparator', 'estimand', 'confoundingAndSelectionLimits']);
        if (!evidenceRoles.has('field-record')) add(errors, `${where}.statusEvidence.evidenceRefs`, 'field-association requires a field record');
      }
      if (hypothesis.epistemicStatus === 'causal-effect-supported') {
        if (!['quasi-experimental', 'randomized-comparison'].includes(statusEvidence.designClass))
          add(errors, `${where}.statusEvidence.designClass`, 'causal-effect-supported requires quasi-experimental or randomized-comparison');
        requireStringFields(['comparator', 'estimand', 'uncertaintyAndAttrition']);
        stringArray(errors, `${where}.statusEvidence.identificationAssumptions`, statusEvidence.identificationAssumptions, { min: 1 });
        if (!statusEvidence.registeredDesignRef) add(errors, `${where}.statusEvidence.registeredDesignRef`, 'causal support requires a registered design');
        if (!statusEvidence.independentReview) add(errors, `${where}.statusEvidence.independentReview`, 'causal support requires independent methodological review');
        for (const role of ['outcome-evidence', 'design-registration', 'review'])
          if (!evidenceRoles.has(role)) add(errors, `${where}.statusEvidence.evidenceRefs`, `causal support requires ${role}`);
      }
      if (hypothesis.epistemicStatus === 'falsified-within-scope') {
        if (!['model-benchmark', 'controlled-user-study', 'field-observational', 'quasi-experimental', 'randomized-comparison', 'falsifier-test'].includes(statusEvidence.designClass))
          add(errors, `${where}.statusEvidence.designClass`, 'is not a qualifying falsifier design');
        requireStringFields(['comparator', 'estimand', 'triggeredFalsifier', 'reopenConditions']);
        if (!evidenceRoles.has('falsifier-result')) add(errors, `${where}.statusEvidence.evidenceRefs`, 'falsified status requires a falsifier result');
      }
      if (statusEvidence.registeredDesignRef !== null) {
        evidenceUrl(errors, `${where}.statusEvidence.registeredDesignRef`, statusEvidence.registeredDesignRef);
        if (!evidenceTargets.has(statusEvidence.registeredDesignRef) ||
            !(evidenceKindsByTarget.get(statusEvidence.registeredDesignRef) || new Set()).has('registered-design'))
          add(errors, `${where}.statusEvidence.registeredDesignRef`, 'must be bound to a registered-design evidence reference');
      }
      if (statusEvidence.independentReview !== null) {
        const review = statusEvidence.independentReview;
        const reviewWhere = `${where}.statusEvidence.independentReview`;
        if (keys(errors, reviewWhere, review, ['actor', 'relationship', 'conflictStatement', 'date', 'evidenceRef', 'methodologicalScope', 'conclusion'])) {
          string(errors, `${reviewWhere}.actor`, review.actor);
          if (/evidence\s*press|producer|\b(?:co-)?author\b/i.test(review.actor)) add(errors, `${reviewWhere}.actor`, 'must name a reviewer independent of the producer or authors');
          if (!['unaffiliated', 'commissioned-independent', 'regulator', 'journal-peer-review'].includes(review.relationship)) add(errors, `${reviewWhere}.relationship`, 'is not registered');
          string(errors, `${reviewWhere}.conflictStatement`, review.conflictStatement);
          date(errors, `${reviewWhere}.date`, review.date);
          evidenceUrl(errors, `${reviewWhere}.evidenceRef`, review.evidenceRef);
          string(errors, `${reviewWhere}.methodologicalScope`, review.methodologicalScope);
          if (review.conclusion !== 'supports') add(errors, `${reviewWhere}.conclusion`, 'must support the epistemic status being published');
          if (!evidenceTargets.has(review.evidenceRef) ||
              !(evidenceKindsByTarget.get(review.evidenceRef) || new Set()).has('independent-review'))
            add(errors, `${reviewWhere}.evidenceRef`, 'must be bound to an independent-review evidence reference');
        }
      }
      for (const field of variantFields[hypothesis.epistemicStatus] || []) {
        if (field !== 'identificationAssumptions') string(errors, `${where}.statusEvidence.${field}`, statusEvidence[field]);
      }
    }
    stringArray(errors, `${where}.rivals`, hypothesis.rivals, { min: 2 });
    for (const field of ['supportingObservations', 'limitingObservations']) {
      const refs = stringArray(errors, `${where}.${field}`, hypothesis[field], { min: 0, pattern: ID_RE });
      for (const id of refs) {
        referencedObservations.add(id);
        if (!observationIds.has(id)) add(errors, `${where}.${field}`, `unknown observation ${JSON.stringify(id)}`);
      }
    }
    if (!Array.isArray(hypothesis.predictions) || !hypothesis.predictions.length) add(errors, `${where}.predictions`, 'must be a non-empty array');
    for (const [predictionIndex, prediction] of (hypothesis.predictions || []).entries()) {
      const predictionWhere = `${where}.predictions[${predictionIndex}]`;
      const predictionFields = ['id', 'statement', 'estimand', 'comparator', 'threshold', 'window', 'measurementPlan'];
      if (!keys(errors, predictionWhere, prediction, predictionFields)) continue;
      uniqueId(errors, `${predictionWhere}.id`, prediction.id, predictionIds);
      for (const field of predictionFields.slice(1)) string(errors, `${predictionWhere}.${field}`, prediction[field]);
    }
    stringArray(errors, `${where}.potentialFalsifiers`, hypothesis.potentialFalsifiers, { min: 2 });
  }
  for (const id of observationIds) if (!referencedObservations.has(id)) add(errors, 'IBE_LEDGER.observations', `observation ${JSON.stringify(id)} is not used by any hypothesis`);

  if (keys(errors, 'IBE_LEDGER.updatePolicy', ledger.updatePolicy, ['cadence', 'rules'])) {
    string(errors, 'IBE_LEDGER.updatePolicy.cadence', ledger.updatePolicy.cadence);
    stringArray(errors, 'IBE_LEDGER.updatePolicy.rules', ledger.updatePolicy.rules, { min: 2 });
  }
  if (!Array.isArray(ledger.changeLog) || !ledger.changeLog.length) add(errors, 'IBE_LEDGER.changeLog', 'must be a non-empty array');
  const revisionIds = new Set();
  let priorRevisionId = null;
  for (const [index, change] of (ledger.changeLog || []).entries()) {
    const where = `IBE_LEDGER.changeLog[${index}]`;
    const requiredChange = ['sequence', 'revisionId', 'previousRevisionId', 'recordedAt', 'changeType', 'scope', 'basisObservationIds', 'summary'];
    const allowedChange = [...requiredChange, 'hypothesisId', 'predictionId', 'fromStatus', 'toStatus'];
    if (!keys(errors, where, change, requiredChange, allowedChange)) continue;
    if (!Number.isInteger(change.sequence) || change.sequence !== index + 1) add(errors, `${where}.sequence`, `must equal ${index + 1}`);
    uniqueId(errors, `${where}.revisionId`, change.revisionId, revisionIds);
    if (change.previousRevisionId !== priorRevisionId) add(errors, `${where}.previousRevisionId`, `must equal ${JSON.stringify(priorRevisionId)}`);
    priorRevisionId = change.revisionId;
    date(errors, `${where}.recordedAt`, change.recordedAt);
    if (!['initialization', 'observation-added', 'status-changed', 'claim-revised', 'prediction-revised', 'falsifier-triggered', 'correction'].includes(change.changeType))
      add(errors, `${where}.changeType`, 'is not registered');
    if (!['ledger', 'hypothesis', 'observation', 'prediction'].includes(change.scope)) add(errors, `${where}.scope`, 'is not registered');
    const basis = stringArray(errors, `${where}.basisObservationIds`, change.basisObservationIds, { min: 0, pattern: ID_RE });
    for (const id of basis) if (!observationIds.has(id)) add(errors, `${where}.basisObservationIds`, `unknown observation ${JSON.stringify(id)}`);
    if (change.hypothesisId != null && !hypothesisIds.has(change.hypothesisId)) add(errors, `${where}.hypothesisId`, `unknown hypothesis ${JSON.stringify(change.hypothesisId)}`);
    if (change.predictionId != null && !predictionIds.has(change.predictionId)) add(errors, `${where}.predictionId`, `unknown prediction ${JSON.stringify(change.predictionId)}`);
    if (change.fromStatus != null && !statusVocabulary.includes(change.fromStatus)) add(errors, `${where}.fromStatus`, 'is not registered');
    if (change.toStatus != null && !statusVocabulary.includes(change.toStatus)) add(errors, `${where}.toStatus`, 'is not registered');
    if (change.changeType === 'status-changed') {
      for (const field of ['hypothesisId', 'fromStatus', 'toStatus']) if (!change[field]) add(errors, where, `status-changed revision requires ${field}`);
      if (!basis.length) add(errors, `${where}.basisObservationIds`, 'status-changed revision requires at least one observation');
      if (change.fromStatus === change.toStatus) add(errors, where, 'status transition must actually change status');
    }
    string(errors, `${where}.summary`, change.summary);
  }
  return { hypothesisIds: [...hypothesisIds], hypothesisById };
}

function validateReleaseRecord(meta, context, errors) {
  const { legacySlugs, methodIds, lineageIds, lineageMembership, lineageById, assignments, hypothesisIds, hypothesisById,
    attemptById, attemptsByWorkId, releaseSlugsByWorkId, policy } = context;
  const where = `papers/${meta.slug}.operatingModel`;
  const record = meta.operatingModel;
  if (!record) {
    if (!legacySlugs.includes(meta.slug)) add(errors, where, 'is required for every release outside the frozen legacy baseline');
    return;
  }

  const required = policy.requiredFields;
  const allowed = [...required, 'lineageId', 'ibeHypotheses'];
  if (!keys(errors, where, record, required, allowed)) return;
  if (record.version !== '1.0') add(errors, `${where}.version`, 'must equal "1.0"');
  string(errors, `${where}.workId`, record.workId, WORK_ID_RE);
  const attemptIds = stringArray(errors, `${where}.attemptIds`, record.attemptIds, { min: 1, pattern: ATTEMPT_ID_RE });
  const linkedAttempts = [];
  for (const id of attemptIds) {
    const attempt = attemptById.get(id);
    if (!attempt) add(errors, `${where}.attemptIds`, `unknown work-ledger attempt ${JSON.stringify(id)}`);
    else {
      linkedAttempts.push(attempt);
      if (attempt.workId !== record.workId) add(errors, `${where}.attemptIds`, `${JSON.stringify(id)} belongs to ${JSON.stringify(attempt.workId)}, not ${JSON.stringify(record.workId)}`);
      if (attempt.releaseSlug !== meta.slug) add(errors, `${where}.attemptIds`, `${JSON.stringify(id)} does not link back to release ${JSON.stringify(meta.slug)}`);
    }
  }
  const reciprocalIds = [];
  for (const attempt of (attemptsByWorkId.get(record.workId) || [])) if (attempt.releaseSlug === meta.slug) reciprocalIds.push(attempt.attemptId);
  if (!sameMembers(attemptIds, reciprocalIds)) add(errors, `${where}.attemptIds`, `must exactly reciprocate WORK_LEDGER release links (${reciprocalIds.join(', ')})`);
  const aims = stringArray(errors, `${where}.aims`, record.aims, { min: 1, allowed: policy.aims });
  stringArray(errors, `${where}.artifactRoles`, record.artifactRoles, { min: 1, allowed: policy.artifactRoles });
  for (const attempt of linkedAttempts) if (!sameMembers(attempt.aims, aims)) add(errors, `${where}.aims`, `does not match linked attempt ${JSON.stringify(attempt.attemptId)}`);
  const expectedLineageId = lineageMembership.get(meta.slug) || null;
  if (record.lineageId !== null && !lineageIds.includes(record.lineageId))
    add(errors, `${where}.lineageId`, `${JSON.stringify(record.lineageId)} is not a registered lineage`);
  if (record.lineageId !== expectedLineageId)
    add(errors, `${where}.lineageId`, `must exactly reciprocate registry lineage ${JSON.stringify(expectedLineageId)}`);
  const primitives = stringArray(errors, `${where}.accelerationPrimitives`, record.accelerationPrimitives, { min: 1, pattern: ID_RE });
  for (const id of primitives) if (!methodIds.includes(id)) add(errors, `${where}.accelerationPrimitives`, `unknown method ${JSON.stringify(id)}`);
  const registeredPrimitives = assignments[meta.slug] || [];
  if (primitives.length !== registeredPrimitives.length ||
      [...primitives].sort().some((id, index) => id !== [...registeredPrimitives].sort()[index])) {
    add(errors, `${where}.accelerationPrimitives`, `does not match METHOD_REGISTRY.releaseAssignments (${registeredPrimitives.join(', ')})`);
  }

  if (keys(errors, `${where}.decisionObject`, record.decisionObject, ['type', 'description', 'scope'])) {
    if (!policy.decisionObjectTypes.includes(record.decisionObject.type)) add(errors, `${where}.decisionObject.type`, `${JSON.stringify(record.decisionObject.type)} is not registered`);
    string(errors, `${where}.decisionObject.description`, record.decisionObject.description);
    string(errors, `${where}.decisionObject.scope`, record.decisionObject.scope);
  }
  stringArray(errors, `${where}.bottleneckTargeted`, record.bottleneckTargeted, { min: 1, allowed: policy.bottleneckTypes });
  if (keys(errors, `${where}.semanticBridge`, record.semanticBridge, ['state', 'description', 'remainingRisks'])) {
    if (!policy.semanticBridgeStates.includes(record.semanticBridge.state)) add(errors, `${where}.semanticBridge.state`, `${JSON.stringify(record.semanticBridge.state)} is not registered`);
    string(errors, `${where}.semanticBridge.description`, record.semanticBridge.description);
    stringArray(errors, `${where}.semanticBridge.remainingRisks`, record.semanticBridge.remainingRisks, { min: 0 });
  }
  stringArray(errors, `${where}.humanJudgmentGates`, record.humanJudgmentGates, { min: 1 });
  if (!Array.isArray(record.parentLinks)) add(errors, `${where}.parentLinks`, 'must be an array');
  const parentKeys = new Set();
  for (const [index, parent] of (record.parentLinks || []).entries()) {
    const parentWhere = `${where}.parentLinks[${index}]`;
    const parentRequired = ['relation', 'workId', 'legacyReleaseSlug', 'externalUrl', 'inheritedClaim', 'inheritedAssuranceCeiling'];
    if (!keys(errors, parentWhere, parent, parentRequired)) continue;
    if (!['depends-on-claim', 'extends-result', 'reuses-method', 'reuses-evidence', 'supersedes', 'other'].includes(parent.relation))
      add(errors, `${parentWhere}.relation`, 'is not registered');
    const targets = [parent.workId, parent.legacyReleaseSlug, parent.externalUrl].filter(value => value !== null);
    if (targets.length !== 1) add(errors, parentWhere, 'must identify exactly one workId, frozen legacy release or external URL');
    if (parent.workId !== null) {
      string(errors, `${parentWhere}.workId`, parent.workId, WORK_ID_RE);
      if (parent.workId === record.workId) add(errors, `${parentWhere}.workId`, 'must not refer to the current work');
      if (!attemptsByWorkId.has(parent.workId)) add(errors, `${parentWhere}.workId`, `does not resolve to a registered prospective work ${JSON.stringify(parent.workId)}`);
    }
    if (parent.legacyReleaseSlug !== null) {
      string(errors, `${parentWhere}.legacyReleaseSlug`, parent.legacyReleaseSlug, ID_RE);
      if (!legacySlugs.includes(parent.legacyReleaseSlug)) add(errors, `${parentWhere}.legacyReleaseSlug`, 'must resolve to the frozen legacy baseline');
    }
    if (parent.externalUrl !== null) url(errors, `${parentWhere}.externalUrl`, parent.externalUrl);
    const parentKey = targets[0];
    if (parentKeys.has(parentKey)) add(errors, parentWhere, `duplicates parent target ${JSON.stringify(parentKey)}`);
    parentKeys.add(parentKey);
    string(errors, `${parentWhere}.inheritedClaim`, parent.inheritedClaim);
    string(errors, `${parentWhere}.inheritedAssuranceCeiling`, parent.inheritedAssuranceCeiling);
  }
  if (record.lineageId != null) {
    const lineage = lineageById.get(record.lineageId);
    const memberIndex = lineage ? lineage.members.indexOf(meta.slug) : -1;
    if (lineage && meta.slug !== lineage.rootReleaseSlug) {
      const earlierMembers = new Set(lineage.members.slice(0, memberIndex));
      const hasEarlierParent = (record.parentLinks || []).some(parent => {
        if (parent.relation === 'other') return false;
        if (parent.legacyReleaseSlug !== null) return earlierMembers.has(parent.legacyReleaseSlug);
        if (parent.workId !== null) return (releaseSlugsByWorkId.get(parent.workId) || []).some(slug => earlierMembers.has(slug));
        return false;
      });
      if (!hasEarlierParent) add(errors, `${where}.parentLinks`, 'a non-root lineage member must identify an earlier member through a substantive parent relation');
    }
  }
  if (keys(errors, `${where}.assuranceTarget`, record.assuranceTarget, ['dimensions', 'nextAction', 'claimCeiling'])) {
    stringArray(errors, `${where}.assuranceTarget.dimensions`, record.assuranceTarget.dimensions, { min: 1, allowed: policy.assuranceDimensions });
    string(errors, `${where}.assuranceTarget.nextAction`, record.assuranceTarget.nextAction);
    string(errors, `${where}.assuranceTarget.claimCeiling`, record.assuranceTarget.claimCeiling);
  }

  if (!Array.isArray(record.impactClaims) || !record.impactClaims.length) add(errors, `${where}.impactClaims`, 'must contain at least one aim-scoped impact claim');
  const impactIds = new Set();
  const representedAims = new Set();
  const designRank = new Map((policy.impactDesignClasses || []).map((value, index) => [value, index]));
  const achievedAssurance = new Map();
  const assuranceEvidence = new Set();
  for (const attempt of linkedAttempts) for (const dimension of ((attempt.assuranceEndpoint || {}).dimensions || [])) {
    if (!achievedAssurance.has(dimension.dimension)) achievedAssurance.set(dimension.dimension, new Set());
    achievedAssurance.get(dimension.dimension).add(dimension.state);
    for (const ref of dimension.evidenceRefs || []) assuranceEvidence.add(ref);
  }
  for (const attempt of linkedAttempts) for (const ref of ((attempt.assuranceEndpoint || {}).evidenceRefs || [])) assuranceEvidence.add(ref);
  const hasAssurance = (dimension, states) => states.some(state => (achievedAssurance.get(dimension) || new Set()).has(state));
  for (const [index, claim] of (record.impactClaims || []).entries()) {
    const claimWhere = `${where}.impactClaims[${index}]`;
    const claimRequired = ['id', 'aim', 'outcome', 'setting', 'status', 'designClass', 'comparator', 'estimand',
      'evidenceRefs', 'registeredDesignRef', 'independentAssessment'];
    if (!keys(errors, claimWhere, claim, claimRequired)) continue;
    uniqueId(errors, `${claimWhere}.id`, claim.id, impactIds);
    if (!aims.includes(claim.aim)) add(errors, `${claimWhere}.aim`, `${JSON.stringify(claim.aim)} is not declared in this release's aims`);
    representedAims.add(claim.aim);
    for (const field of ['outcome', 'setting', 'comparator', 'estimand']) string(errors, `${claimWhere}.${field}`, claim[field]);
    if (!policy.impactStatuses.includes(claim.status)) add(errors, `${claimWhere}.status`, `${JSON.stringify(claim.status)} is not registered`);
    if (!policy.impactDesignClasses.includes(claim.designClass)) add(errors, `${claimWhere}.designClass`, `${JSON.stringify(claim.designClass)} is not registered`);
    const evidenceRefs = evidenceUrlArray(errors, `${claimWhere}.evidenceRefs`, claim.evidenceRefs);
    if (claim.registeredDesignRef !== null) evidenceUrl(errors, `${claimWhere}.registeredDesignRef`, claim.registeredDesignRef);
    if (claim.independentAssessment !== null) {
      if (keys(errors, `${claimWhere}.independentAssessment`, claim.independentAssessment,
        ['actor', 'relationship', 'conflictStatement', 'date', 'evidenceUrl', 'conclusion'])) {
        string(errors, `${claimWhere}.independentAssessment.actor`, claim.independentAssessment.actor);
        if (/evidence\s*press|producer|\b(?:co-)?author\b/i.test(claim.independentAssessment.actor))
          add(errors, `${claimWhere}.independentAssessment.actor`, 'must name a reviewer independent of the producer or authors');
        if (!['unaffiliated', 'commissioned-independent', 'regulator', 'journal-peer-review'].includes(claim.independentAssessment.relationship))
          add(errors, `${claimWhere}.independentAssessment.relationship`, 'is not a registered independence relationship');
        string(errors, `${claimWhere}.independentAssessment.conflictStatement`, claim.independentAssessment.conflictStatement);
        date(errors, `${claimWhere}.independentAssessment.date`, claim.independentAssessment.date);
        evidenceUrl(errors, `${claimWhere}.independentAssessment.evidenceUrl`, claim.independentAssessment.evidenceUrl);
        if (!['supports', 'mixed', 'challenges'].includes(claim.independentAssessment.conclusion)) add(errors, `${claimWhere}.independentAssessment.conclusion`, 'is not registered');
      }
    }
    if (claim.status === 'NO_IMPACT_EVIDENCE') {
      if (claim.designClass !== 'none' || evidenceRefs.length || claim.registeredDesignRef !== null || claim.independentAssessment !== null)
        add(errors, claimWhere, 'NO_IMPACT_EVIDENCE must not carry a design, evidence or assessment that implies an effect');
    } else {
      if (claim.designClass === 'none' || !evidenceRefs.length) add(errors, claimWhere, `${claim.status} requires a non-none design and resolvable evidence`);
      if (!claim.independentAssessment) add(errors, `${claimWhere}.independentAssessment`, `${claim.status} requires a dated independent promotion review`);
      if (claim.independentAssessment && claim.independentAssessment.conclusion !== 'supports')
        add(errors, `${claimWhere}.independentAssessment.conclusion`, `${claim.status} requires an assessment that supports the status being published`);
      if (!linkedAttempts.some(attempt => attempt.assuranceEndpoint && attempt.assuranceEndpoint.status !== 'not-recorded'))
        add(errors, claimWhere, `${claim.status} requires a measured assurance endpoint in a linked work-ledger attempt`);
      if (!hasAssurance('semanticValidation', ['passed', 'partial']))
        add(errors, claimWhere, `${claim.status} requires at least partial semantic validation of the outcome and setting`);
      if (!evidenceRefs.some(ref => assuranceEvidence.has(ref)))
        add(errors, `${claimWhere}.evidenceRefs`, `${claim.status} evidence must overlap the linked assurance endpoint evidence`);
      if (claim.registeredDesignRef !== null && !evidenceRefs.includes(claim.registeredDesignRef))
        add(errors, `${claimWhere}.registeredDesignRef`, 'must also appear in evidenceRefs so the design is bound to this promotion');
      if (claim.independentAssessment && !evidenceRefs.includes(claim.independentAssessment.evidenceUrl))
        add(errors, `${claimWhere}.independentAssessment.evidenceUrl`, 'must also appear in evidenceRefs so the review is bound to this promotion');
    }
    const rank = designRank.get(claim.designClass) ?? -1;
    if (claim.status === 'BENCHMARK_SIGNAL' && rank < designRank.get('model-benchmark')) add(errors, `${claimWhere}.designClass`, 'BENCHMARK_SIGNAL requires at least a model-benchmark design');
    if (claim.status === 'BENCHMARK_SIGNAL' && !hasAssurance('internalReplay', ['passed']))
      add(errors, claimWhere, 'BENCHMARK_SIGNAL requires passed internal replay of the benchmark evidence');
    if (claim.status === 'CONTROLLED_USER_SIGNAL' && !['controlled-user-study', 'quasi-experimental', 'randomized-comparison'].includes(claim.designClass))
      add(errors, `${claimWhere}.designClass`, 'CONTROLLED_USER_SIGNAL requires a controlled-user, quasi-experimental or randomized design');
    if (claim.status === 'FIELD_SIGNAL' && !['field-observational', 'quasi-experimental', 'randomized-comparison'].includes(claim.designClass))
      add(errors, `${claimWhere}.designClass`, 'FIELD_SIGNAL requires a field-observational, quasi-experimental or randomized design');
    if (['CONTROLLED_USER_SIGNAL', 'FIELD_SIGNAL'].includes(claim.status) && !hasAssurance('specialistReview', ['passed', 'partial']))
      add(errors, claimWhere, `${claim.status} requires at least partial specialist review`);
    if (['CONTROLLED_USER_SIGNAL', 'FIELD_SIGNAL', 'CAUSAL_EFFECT_SUPPORTED'].includes(claim.status) && claim.registeredDesignRef === null)
      add(errors, `${claimWhere}.registeredDesignRef`, `${claim.status} requires a registered design URL`);
    if (claim.status === 'CAUSAL_EFFECT_SUPPORTED') {
      if (!['quasi-experimental', 'randomized-comparison'].includes(claim.designClass)) add(errors, `${claimWhere}.designClass`, 'CAUSAL_EFFECT_SUPPORTED requires quasi-experimental or randomized comparison');
      if (!claim.independentAssessment || claim.independentAssessment.conclusion !== 'supports') add(errors, `${claimWhere}.independentAssessment`, 'CAUSAL_EFFECT_SUPPORTED requires an independent assessment concluding supports');
      if (!hasAssurance('semanticValidation', ['passed']) || !hasAssurance('specialistReview', ['passed']))
        add(errors, claimWhere, 'CAUSAL_EFFECT_SUPPORTED requires passed semantic validation and specialist review');
    }
    if (['NO_CLEAR_GAIN', 'HARM_OR_REGRESSION_FOUND'].includes(claim.status) && rank < designRank.get('model-benchmark'))
      add(errors, `${claimWhere}.designClass`, `${claim.status} requires at least a model-benchmark comparison, not a descriptive label`);
  }
  for (const aim of aims) if (!representedAims.has(aim)) add(errors, `${where}.impactClaims`, `missing an explicitly scoped claim for aim ${JSON.stringify(aim)}`);

  if (record.ibeHypotheses != null) {
    const refs = stringArray(errors, `${where}.ibeHypotheses`, record.ibeHypotheses, { min: 1, pattern: ID_RE });
    for (const id of refs) {
      if (!hypothesisIds.includes(id)) add(errors, `${where}.ibeHypotheses`, `unknown hypothesis ${JSON.stringify(id)}`);
      else if (!(hypothesisById.get(id).aims || []).some(aim => aims.includes(aim)))
        add(errors, `${where}.ibeHypotheses`, `hypothesis ${JSON.stringify(id)} has no aim in common with this release`);
    }
  }
}

function validateWorkGraph(papers, errors) {
  const byWorkId = new Map();
  for (const meta of papers) {
    const record = meta.operatingModel;
    if (!record || !record.workId) continue;
    if (!byWorkId.has(record.workId)) byWorkId.set(record.workId, []);
    byWorkId.get(record.workId).push(meta);
  }
  const visiting = new Set();
  const visited = new Set();
  function visit(workId, trail) {
    if (visiting.has(workId)) {
      add(errors, `work graph ${trail.join(' -> ')}`, `contains a parent cycle through ${workId}`);
      return;
    }
    if (visited.has(workId)) return;
    visiting.add(workId);
    const metas = byWorkId.get(workId) || [];
    const parents = new Set(metas.flatMap(meta => (meta.operatingModel.parentLinks || []).map(link => link.workId).filter(Boolean)));
    for (const parent of parents) {
      if (byWorkId.has(parent)) visit(parent, [...trail, parent]);
    }
    visiting.delete(workId);
    visited.add(workId);
  }
  for (const workId of byWorkId.keys()) visit(workId, [workId]);
}

function validateSchemaBindings(schemas, contract, metricsPolicy, errors) {
  const expected = {
    contract: { title: 'Evidence Press operating model contract', required: ['schemaVersion', 'effectiveDate', 'workLedger', 'releasePolicy'] },
    registry: { title: 'Evidence Press method registry', required: ['schemaVersion', 'methods', 'methodClusters', 'lineages', 'releaseAssignments', 'changeLog'] },
    ledger: { title: 'Evidence Press abductive ledger', required: ['schemaVersion', 'observations', 'hypotheses', 'updatePolicy'] },
    workLedger: { title: 'Evidence Press prospective work ledger', required: ['schemaVersion', 'attempts', 'updatePolicy', 'changeLog'] },
    release: { title: 'Evidence Press release operating-model record', required: (contract.releasePolicy || {}).requiredFields || [] }
  };
  for (const [key, binding] of Object.entries(expected)) {
    const schema = schemas[key];
    const where = `schemas.${key}`;
    if (!isObject(schema)) { add(errors, where, 'must be an object'); continue; }
    if (schema.title !== binding.title) add(errors, `${where}.title`, `must equal ${JSON.stringify(binding.title)}`);
    const required = schema.required || [];
    for (const field of binding.required) if (!required.includes(field)) add(errors, `${where}.required`, `does not enforce ${JSON.stringify(field)}`);
  }
  const release = schemas.release || {};
  const policy = (contract && contract.releasePolicy) || {};
  const bindings = [
    ['aims', release.properties?.aims?.items?.enum, policy.aims],
    ['artifactRoles', release.properties?.artifactRoles?.items?.enum, policy.artifactRoles],
    ['decisionObject.type', release.properties?.decisionObject?.properties?.type?.enum, policy.decisionObjectTypes],
    ['bottleneckTargeted', release.properties?.bottleneckTargeted?.items?.enum, policy.bottleneckTypes],
    ['semanticBridge.state', release.properties?.semanticBridge?.properties?.state?.enum, policy.semanticBridgeStates],
    ['assuranceTarget.dimensions', release.properties?.assuranceTarget?.properties?.dimensions?.items?.enum, policy.assuranceDimensions],
    ['impactClaims.aim', release.$defs?.impactClaim?.properties?.aim?.enum, policy.aims],
    ['impactClaims.status', release.$defs?.impactClaim?.properties?.status?.enum, policy.impactStatuses],
    ['impactClaims.designClass', release.$defs?.impactClaim?.properties?.designClass?.enum, policy.impactDesignClasses],
    ['ibeLedger.hypotheses.aims', schemas.ledger?.$defs?.hypothesis?.properties?.aims?.items?.enum, policy.aims],
    ['workLedger.assuranceEndpoint.dimensions', schemas.workLedger?.$defs?.assuranceDimension?.properties?.dimension?.enum, policy.assuranceDimensions]
  ];
  for (const [field, schemaValues, policyValues] of bindings) {
    if (!sameMembers(schemaValues, policyValues)) add(errors, `schemas.release.${field}`, 'enum does not match OPERATING_MODEL.releasePolicy');
  }
  const metricsBindings = [
    ['measurementScope', schemas.workLedger?.$defs?.researchMetrics?.properties?.measurementScope?.enum, metricsPolicy.scopeTypes],
    ['resultState', schemas.workLedger?.$defs?.researchMetricsOutcome?.properties?.resultState?.enum, metricsPolicy.resultStates],
    ['missingFields.field', schemas.workLedger?.$defs?.researchMetricsMissingField?.properties?.field?.enum, metricsPolicy.optionalTelemetryFields]
  ];
  for (const [field, schemaValues, policyValues] of metricsBindings) {
    if (!sameMembers(schemaValues, policyValues)) add(errors, `schemas.workLedger.${field}`, 'enum does not match RESEARCH_METRICS_POLICY');
  }
}

function collectErrors({ root, papers, artifacts }) {
  const errors = [];
  const loaded = artifacts || loadArtifacts(root);
  const metadata = papers || loadPaperMetadata(root);
  const paperSlugs = metadata.map(p => p.slug).sort();
  if (new Set(paperSlugs).size !== paperSlugs.length) add(errors, 'papers', 'contains duplicate slugs');

  validateContract(loaded.contract, paperSlugs, errors);
  validateMetricsPolicy(loaded.metricsPolicy, errors);
  const registryState = validateRegistry(loaded.registry, paperSlugs, errors);
  const ledgerState = validateLedger(loaded.ledger, loaded.contract.releasePolicy || {}, root, errors);
  const workLedgerState = validateWorkLedger(loaded.workLedger, paperSlugs, loaded.contract.releasePolicy || {}, loaded.metricsPolicy, errors);
  validateSchemaBindings(loaded.schemas, loaded.contract, loaded.metricsPolicy, errors);

  const policy = loaded.contract.releasePolicy || {};
  const releaseSlugsByWorkId = new Map();
  for (const meta of metadata) {
    const workId = meta.operatingModel && meta.operatingModel.workId;
    if (!workId) continue;
    if (!releaseSlugsByWorkId.has(workId)) releaseSlugsByWorkId.set(workId, []);
    releaseSlugsByWorkId.get(workId).push(meta.slug);
  }
  const context = {
    legacySlugs: policy.legacyReleaseSlugs || [],
    methodIds: registryState.methodIds,
    lineageIds: registryState.lineageIds,
    lineageMembership: registryState.lineageMembership,
    lineageById: registryState.lineageById,
    assignments: registryState.assignments,
    hypothesisIds: ledgerState.hypothesisIds,
    hypothesisById: ledgerState.hypothesisById,
    attemptById: workLedgerState.attemptById,
    attemptsByWorkId: workLedgerState.attemptsByWorkId,
    releaseSlugsByWorkId,
    policy
  };
  for (const meta of metadata) validateReleaseRecord(meta, context, errors);
  validateWorkGraph(metadata, errors);
  return errors;
}

function validateAll(options) {
  const errors = collectErrors(options);
  if (errors.length) {
    throw new Error(`operating-model validation failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n  - ${errors.join('\n  - ')}`);
  }
  return options.artifacts || loadArtifacts(options.root);
}

module.exports = {
  ARTIFACT_PATHS,
  clone,
  collectErrors,
  loadArtifacts,
  loadPaperMetadata,
  validateAll
};
