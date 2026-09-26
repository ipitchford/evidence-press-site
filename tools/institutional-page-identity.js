'use strict';

// Identity checks for pre-deploy discovery. Post-deploy checks still require
// exact candidate HTML and JSON bytes, not merely these structural markers.
const identities = {
  '/operating-model/': {
    heading: 'Evidence Press operating model',
    record: value => value.status === 'prospective-institutional-contract' &&
      /^[0-9a-f]{40}$/.test(String(value.releasePolicy?.baselineCommit || ''))
  },
  '/research-metrics/': {
    heading: 'Evidence Press research metrics',
    record: value => value.schemaVersion === '1.0' &&
      value.status === 'prospective-required' &&
      typeof value.effectiveAt === 'string' && Number.isFinite(Date.parse(value.effectiveAt)) &&
      value.appliesTo?.attemptsRegisteredAtOrAfter === value.effectiveAt &&
      Array.isArray(value.minimumPublishableOutcomeFields) &&
      value.minimumPublishableOutcomeFields.includes('calendarElapsedMinutes') &&
      value.minimumPublishableOutcomeFields.includes('targetReached')
  }
};

function checkHtmlIdentity(pagePath, pageUrl, html) {
  const identity = identities[pagePath];
  if (!identity) return 'unsupported institutional page';
  if (!html.includes(`<link rel="canonical" href="${pageUrl}">`) ||
      !html.includes(`<h1>${identity.heading}</h1>`)) {
    return `HTML lacks the canonical identity markers for ${pagePath}`;
  }
  return null;
}

function checkRecordIdentity(pagePath, value) {
  const identity = identities[pagePath];
  if (!identity) return 'unsupported institutional page';
  return value && typeof value === 'object' && !Array.isArray(value) && identity.record(value)
    ? null : `index.json is not the expected institutional record for ${pagePath}`;
}

module.exports = { checkHtmlIdentity, checkRecordIdentity };
