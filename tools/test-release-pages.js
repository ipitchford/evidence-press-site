#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAPERS = path.join(ROOT, 'papers');
const policy = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'PAGE_STRUCTURE_POLICY.json'), 'utf8'));
const presentation = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'PRESENTATION_EVENTS.json'), 'utf8'));
const errors = [];
const reports = [];
const paperRecords = new Map();

const headingId = value => value.toLowerCase().replace(/\$[^$]*\$/g, '')
  .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || 'section';
const headingText = body => body.split(/\r?\n/)
  .map(line => line.match(/^(#{1,4})\s+(.+)$/))
  .filter(Boolean)
  .map(match => ({ level: match[1].length, text: match[2].trim(), id: headingId(match[2]) }));
const normalizedHeadingText = value => value.normalize('NFKC')
  .replace(/[’‘]/g, "'")
  .toLowerCase()
  .replace(/'/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const isAgeDirectedExplainerHeading = value => {
  const normalized = normalizedHeadingText(value);
  const namesYoungChild = /\b(?:five|5) year old\b/.test(normalized);
  const explanationLabel = /\b(?:explain|explainer|explanation|summary|version|account|guide|picture)\b/.test(normalized);
  return /\beli\s*5\b/.test(normalized)
    || /\bexplain(?: it)? like (?:i am|im|a) (?:five|5)\b/.test(normalized)
    || (namesYoungChild && explanationLabel);
};

if (typeof policy.ageDirectedExplanationRule !== 'string' || !policy.ageDirectedExplanationRule.trim())
  errors.push('page-structure policy is missing ageDirectedExplanationRule');

for (const heading of [
  'Explain it like I’m five',
  "Explain it like I'm 5",
  'ELI5',
  'ELI-5 summary',
  'The five-year-old picture',
  'Explanation for a 5-year-old'
]) {
  if (!isAgeDirectedExplainerHeading(heading))
    errors.push(`age-directed heading hostile control was not rejected: "${heading}"`);
}

for (const heading of ['Plain-English summary', 'Why the problem matters', 'Five-year stability horizon']) {
  if (isAgeDirectedExplainerHeading(heading))
    errors.push(`ordinary reader heading was incorrectly rejected: "${heading}"`);
}

const functions = {
  summary: /summary|everyday terms|plain[- ]english/i,
  preciseClaim: /specialist|central (claim|finding)|exact (result|classification|statement|gap)|theorem|classification/i,
  technicalAccount: /technical|mechanism|how .*works|idea|calculation|dynamics|transition|fixed-seed|arithmetic heart/i,
  evidenceBoundary: /evidence|audit|checked|replay|assurance|verification/i,
  limitations: /limit|does not establish|not established|not checked|remains open|assurance boundary|where it stops/i,
  audience: /who should|audience|who .*care/i,
  inspectReplay: /reproduce|inspect|replay|where to inspect/i,
  nextWork: /next|follow-up|improve/i,
  packageMap: /package|archive and parent|paper, archive/i
};

for (const directory of fs.readdirSync(PAPERS).sort()) {
  const metaPath = path.join(PAPERS, directory, 'meta.json');
  const bodyPath = path.join(PAPERS, directory, 'body.md');
  if (!fs.existsSync(metaPath) || !fs.existsSync(bodyPath)) continue;
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const body = fs.readFileSync(bodyPath, 'utf8');
  const slug = meta.slug || directory;
  const headings = headingText(body);
  const names = new Map();
  paperRecords.set(slug, meta);

  for (const heading of headings) {
    if (heading.level === 1) errors.push(`${slug}: body.md contains page-level H1 "${heading.text}"`);
    if (policy.rendererOwnedHeadings.some(value => value.toLowerCase() === heading.text.toLowerCase()))
      errors.push(`${slug}: body.md authors renderer-owned heading "${heading.text}"`);
    if (isAgeDirectedExplainerHeading(heading.text))
      errors.push(`${slug}: body.md contains prohibited age-directed explainer heading "${heading.text}"`);
    if (names.has(heading.id)) errors.push(`${slug}: duplicate body heading id "${heading.id}"`);
    names.set(heading.id, true);
  }

  if (/\bIan Pitchford\b/i.test(body) && !(meta.pageStructureWaivers || []).includes('historical-personal-attribution-in-body'))
    errors.push(`${slug}: reader body contains routine personal operational attribution`);
  if (/\bIan Pitchford\b/i.test(meta.narration || '') && !(meta.pageStructureWaivers || []).includes('historical-personal-attribution-in-narration'))
    errors.push(`${slug}: narration contains a personal maintainer, publisher or research-director name`);

  for (const field of ['pageStructureVersion', 'pageStructureVariant', 'recordMaturity', 'metadataProvenance']) {
    if (typeof meta[field] !== 'string' || !meta[field].trim()) errors.push(`${slug}: missing ${field}`);
  }
  if (!Array.isArray(meta.pageStructureWaivers)) errors.push(`${slug}: pageStructureWaivers must be an array`);
  if (!policy.supportedVariants.includes(meta.pageStructureVariant))
    errors.push(`${slug}: unsupported pageStructureVariant "${meta.pageStructureVariant}"`);

  const corrections = meta.corrections || [];
  const publicIndexes = meta.publicCorrectionIndexes == null
    ? corrections.map((_, index) => index)
    : meta.publicCorrectionIndexes;
  for (const index of publicIndexes) {
    const correction = corrections[index];
    if (!correction) {
      errors.push(`${slug}: public correction index ${index} is out of range`);
      continue;
    }
    const text = `${correction.summary || ''} ${correction.detail || ''}`;
    const routine = correction.scope === 'presentation'
      && /audio|video|voice|thumbnail|open graph|hero art|cache|standfirst|briefing|media/i.test(text);
    const materialDisplay = /formula|equation|denominator|normalis|numerical statement|factor of/i.test(text);
    if (routine && !materialDisplay)
      errors.push(`${slug}: routine presentation correction ${index} remains in the public correction panel`);
  }

  if (meta.pageStructureVersion === policy.currentVersion) {
    const headingCorpus = headings.map(item => item.text).join('\n');
    const missing = Object.entries(functions)
      .filter(([, pattern]) => !pattern.test(headingCorpus))
      .map(([name]) => name);
    if (missing.length && !(meta.pageStructureWaivers || []).includes('tailored-reader-function-headings'))
      errors.push(`${slug}: current reader-first record is missing functions: ${missing.join(', ')}`);
  } else {
    const headingCorpus = headings.map(item => item.text).join('\n');
    const missing = Object.entries(functions).filter(([, pattern]) => !pattern.test(headingCorpus)).map(([name]) => name);
    if (missing.length) reports.push(`${slug}: grandfathered reader-function report: ${missing.join(', ')}`);
  }
}

const eventIds = new Set();
const allowedEventTypes = new Set(['audio', 'video', 'art', 'media', 'copy', 'deployment', 'document-presentation']);
for (const [index, event] of (presentation.events || []).entries()) {
  const at = `presentation event ${index}`;
  if (!event.eventId || eventIds.has(event.eventId)) errors.push(`${at}: missing or duplicate eventId`);
  eventIds.add(event.eventId);
  if (!paperRecords.has(event.slug)) errors.push(`${at}: unknown release slug "${event.slug}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.occurredAt || '')) errors.push(`${at}: occurredAt is not an ISO date`);
  if (!allowedEventTypes.has(event.eventType)) errors.push(`${at}: unsupported eventType "${event.eventType}"`);
  if (event.researchClaimChanged !== false || event.researchArchiveChanged !== false)
    errors.push(`${at}: presentation ledger cannot carry research changes`);
  if (event.artifact && event.artifact.replacesUrl != null) {
    if (event.eventType !== 'video') errors.push(`${at}: replacesUrl is supported only for video events`);
    for (const field of ['replacesUrl', 'url']) {
      try {
        const url = new URL(event.artifact[field]);
        if (url.protocol !== 'https:') errors.push(`${at}: artifact.${field} must use https`);
      } catch {
        errors.push(`${at}: artifact.${field} must be an absolute URL`);
      }
    }
    if (event.artifact.replacesUrl === event.artifact.url)
      errors.push(`${at}: replacesUrl must differ from the replacement url`);
  }
  if (event.sourceCorrectionIndex != null) {
    const source = paperRecords.get(event.slug);
    if (!source || !(source.corrections || [])[event.sourceCorrectionIndex])
      errors.push(`${at}: sourceCorrectionIndex does not identify the preserved historical entry`);
  }
}

if (errors.length) {
  console.error(`Release-page policy failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Release-page policy passed for ${paperRecords.size} releases and ${eventIds.size} presentation events.`);
if (process.argv.includes('--report')) {
  for (const report of reports) console.log(`  - ${report}`);
}
