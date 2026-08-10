#!/usr/bin/env node
'use strict';

const path = require('path');
const { loadArtifacts, loadPaperMetadata, validateAll } = require('./operating-model');

const root = path.join(__dirname, '..');
try {
  const papers = loadPaperMetadata(root);
  const artifacts = loadArtifacts(root);
  validateAll({ root, papers, artifacts });
  console.log('OPERATING MODEL CONTRACT PASSED');
  console.log(`  releases: ${papers.length}`);
  console.log(`  methods: ${artifacts.registry.methods.length}`);
  console.log(`  method clusters: ${artifacts.registry.methodClusters.length}`);
  console.log(`  evidence-backed lineages: ${artifacts.registry.lineages.length}`);
  console.log(`  abductive hypotheses: ${artifacts.ledger.hypotheses.length}`);
  console.log(`  prospective attempts: ${artifacts.workLedger.attempts.length}`);
  console.log(`  prospective release records: ${papers.filter(p => p.operatingModel).length}`);
  console.log('  boundary: structural conformance only; no acceleration or impact claim established');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
