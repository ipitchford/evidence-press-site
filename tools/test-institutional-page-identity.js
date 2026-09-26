'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { checkHtmlIdentity, checkRecordIdentity } = require('./institutional-page-identity');
const root = path.resolve(__dirname, '..');
const cases = [
  ['/operating-model/', 'Evidence Press operating model', 'OPERATING_MODEL.json'],
  ['/research-metrics/', 'Evidence Press research metrics', 'RESEARCH_METRICS_POLICY.json']
];
let checks = 0;
for (const [pagePath, heading, recordFile] of cases) {
  const url = `https://evidencepress.org${pagePath}`;
  const html = `<link rel="canonical" href="${url}"><h1>${heading}</h1>`;
  const record = JSON.parse(fs.readFileSync(path.join(root, 'data', recordFile), 'utf8'));
  assert.equal(checkHtmlIdentity(pagePath, url, html), null); checks++;
  assert.equal(checkRecordIdentity(pagePath, record), null); checks++;
  assert.ok(checkHtmlIdentity(pagePath, url, html.replace(heading, 'Unrelated page'))); checks++;
  assert.ok(checkHtmlIdentity(pagePath, url, html.replace(url, 'https://example.com/'))); checks++;
  assert.ok(checkRecordIdentity(pagePath, { ...record, status: 'unsupported' })); checks++;
  assert.ok(checkRecordIdentity(pagePath, null)); checks++;
  const other = cases.find(item => item[0] !== pagePath);
  const otherRecord = JSON.parse(fs.readFileSync(path.join(root, 'data', other[2]), 'utf8'));
  assert.ok(checkRecordIdentity(pagePath, otherRecord)); checks++;
}
assert.ok(checkHtmlIdentity('/unknown/', 'https://evidencepress.org/unknown/', '')); checks++;
assert.ok(checkRecordIdentity('/unknown/', {})); checks++;
console.log(`institutional-page identity: ${checks} checks passed`);
