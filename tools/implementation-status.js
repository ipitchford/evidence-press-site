#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const INITIATIVE_IDS = new Set([
  'claim-level-assurance-loop',
  'structured-assurance-tasks',
  'agent-query-mcp',
  'stable-claim-identity-and-nonclaims',
  'scholarly-graph-interop',
  'append-only-verification-history',
  'sync-diffs-and-events'
]);

function loadImplementationStatus(root) {
  return {
    status: JSON.parse(fs.readFileSync(path.join(root, 'data', 'IMPLEMENTATION_STATUS.json'), 'utf8')),
    schema: JSON.parse(fs.readFileSync(path.join(root, 'schemas', 'implementation-status.schema.json'), 'utf8'))
  };
}

function validateImplementationStatus(status, { root = null } = {}) {
  const errors = [];
  if (!status || status.schemaVersion !== '1.0' || status.recordType !== 'implementation-status') {
    return ['implementation status has the wrong schema version or record type'];
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(status.updated || ''))) errors.push('updated must be an ISO date');
  const initiatives = Array.isArray(status.initiatives) ? status.initiatives : [];
  const ids = new Set(initiatives.map(item => item.id));
  for (const id of INITIATIVE_IDS) if (!ids.has(id)) errors.push(`initiative ${id} is missing`);
  if (ids.size !== initiatives.length || initiatives.length !== INITIATIVE_IDS.size) errors.push('initiative ids must contain exactly the seven registered initiatives');
  for (const item of initiatives) {
    if (item.cashCost !== 'zero-required') errors.push(`${item.id}: cashCost must be zero-required`);
    if (!Array.isArray(item.implemented) || !item.implemented.length) errors.push(`${item.id}: implemented must be non-empty`);
    if (item.state === 'deferred' && item.operation !== 'not-operational') errors.push(`${item.id}: deferred work must not be described as operational`);
    if (root) for (const ref of item.sourceRefs || []) {
      const local = ref.replace(/\/$/, '');
      if (!fs.existsSync(path.join(root, local))) errors.push(`${item.id}: sourceRef does not resolve: ${ref}`);
    }
  }
  return errors;
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const { status } = loadImplementationStatus(root);
  const errors = validateImplementationStatus(status, { root });
  if (errors.length) {
    console.error(`IMPLEMENTATION STATUS INVALID (${errors.length})`);
    errors.forEach(error => console.error(`  - ${error}`));
    process.exitCode = 1;
  } else console.log(`IMPLEMENTATION STATUS VALID: ${status.initiatives.length} initiatives, all zero-required cash cost`);
}

module.exports = { INITIATIVE_IDS, loadImplementationStatus, validateImplementationStatus };
