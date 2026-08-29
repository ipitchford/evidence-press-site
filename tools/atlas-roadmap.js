#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function loadAtlasRoadmap(root) {
  return {
    roadmap: JSON.parse(fs.readFileSync(path.join(root, 'data', 'ATLAS_ROADMAP.json'), 'utf8')),
    schema: JSON.parse(fs.readFileSync(path.join(root, 'schemas', 'atlas-roadmap.schema.json'), 'utf8'))
  };
}

function duplicates(values) {
  const seen = new Set();
  return values.filter(value => seen.has(value) || !seen.add(value));
}

function computeAtlasBaseline(graph, proposalRegister, methodIds = []) {
  const methodNodes = new Map((graph.nodes || [])
    .filter(node => node.type === 'method')
    .map(node => [node.id.replace(/^method:/, ''), node]));
  const relationshipComposition = {
    usesMethodCount: graph.stats['uses-methodEdgeCount'],
    clusterMembershipCount: graph.stats['member-of-clusterEdgeCount'],
    lineageMembershipCount: graph.stats['member-of-lineageEdgeCount'],
    directInterReleaseCount: graph.stats.directInterReleaseEdgeCount,
    defaultProgrammeViewCount: graph.stats['member-of-clusterEdgeCount'] +
      graph.stats['member-of-lineageEdgeCount'] + graph.stats.directInterReleaseEdgeCount
  };
  return {
    releaseCount: graph.stats.releaseCount,
    methodCount: graph.stats.methodCount,
    clusterCount: graph.stats.clusterCount,
    lineageCount: graph.stats.lineageCount,
    acceptedRelationshipCount: graph.stats.edgeCount,
    publishedProposalCount: proposalRegister.stats.total,
    relationshipComposition,
    methodPrevalenceChecks: methodIds.map(methodId => ({
      methodId,
      releaseAssignmentCount: methodNodes.get(methodId)?.releaseAssignmentCount ?? null
    }))
  };
}

function validateAtlasRoadmap(roadmap, { graph = null, proposalRegister = null } = {}) {
  const errors = [];
  const steps = Array.isArray(roadmap.nextSteps) ? roadmap.nextSteps : [];
  const stepIds = steps.map(step => step.id);
  const stepIdSet = new Set(stepIds);
  for (const id of duplicates(stepIds)) errors.push(`nextSteps duplicates id ${id}`);

  const priorities = steps.map(step => step.priority);
  for (const priority of duplicates(priorities)) errors.push(`nextSteps duplicates priority ${priority}`);
  for (let index = 1; index < priorities.length; index++) {
    if (priorities[index] <= priorities[index - 1]) {
      errors.push('nextSteps must be ordered by strictly increasing priority');
      break;
    }
  }

  for (const step of steps) {
    for (const dependency of step.dependencies || []) {
      if (!stepIdSet.has(dependency)) errors.push(`${step.id} has unresolved dependency ${dependency}`);
      if (dependency === step.id) errors.push(`${step.id} depends on itself`);
    }
    if (step.state === 'blocked' && !(step.dependencies || []).length) {
      errors.push(`${step.id} is blocked but declares no dependency`);
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const byId = new Map(steps.map(step => [step.id, step]));
  function visit(id) {
    if (visiting.has(id)) { errors.push(`nextSteps dependency cycle reaches ${id}`); return; }
    if (visited.has(id) || !byId.has(id)) return;
    visiting.add(id);
    for (const dependency of byId.get(id).dependencies || []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of stepIds) visit(id);

  const reviews = Array.isArray(roadmap.reviewLog) ? roadmap.reviewLog : [];
  for (const id of duplicates(reviews.map(review => review.reviewId))) errors.push(`reviewLog duplicates reviewId ${id}`);
  for (let index = 1; index < reviews.length; index++) {
    if (reviews[index].reviewedAt < reviews[index - 1].reviewedAt) {
      errors.push('reviewLog must be chronological and append-only');
      break;
    }
  }
  if (reviews.length && reviews[reviews.length - 1].reviewedAt > roadmap.updated) {
    errors.push('updated must be no earlier than the latest review');
  }
  if (roadmap.reviewPolicy && roadmap.reviewPolicy.nextScheduledReview < roadmap.updated) {
    errors.push('nextScheduledReview must not predate updated');
  }

  const intake = byId.get('atlas-step-proposal-intake');
  const discovery = byId.get('atlas-step-discovery-pilot');
  if (!intake || intake.priority !== 1) errors.push('proposal intake must remain the first roadmap step until completed or superseded');
  if (!discovery || !(discovery.dependencies || []).includes('atlas-step-proposal-intake')) {
    errors.push('discovery pilot must depend on proposal intake');
  }
  if (intake && intake.state === 'complete' && roadmap.currentBaseline.publishedProposalCount < 1) {
    errors.push('completed proposal intake requires at least one published proposal in the current baseline');
  }
  if (discovery && discovery.state === 'ready' && (!intake || intake.state !== 'complete')) {
    errors.push('discovery pilot cannot be ready before proposal intake is complete');
  }
  if (graph && proposalRegister) {
    const recorded = roadmap.currentBaseline;
    const methodIds = (recorded.methodPrevalenceChecks || []).map(item => item.methodId);
    const derived = computeAtlasBaseline(graph, proposalRegister, methodIds);
    for (const field of ['releaseCount', 'methodCount', 'clusterCount', 'lineageCount', 'acceptedRelationshipCount', 'publishedProposalCount']) {
      if (recorded[field] !== derived[field]) errors.push(`currentBaseline.${field} is stale: recorded ${recorded[field]}, derived ${derived[field]}`);
    }
    for (const [field, value] of Object.entries(derived.relationshipComposition)) {
      if (recorded.relationshipComposition[field] !== value) {
        errors.push(`currentBaseline.relationshipComposition.${field} is stale: recorded ${recorded.relationshipComposition[field]}, derived ${value}`);
      }
    }
    derived.methodPrevalenceChecks.forEach((item, index) => {
      if (item.releaseAssignmentCount === null) errors.push(`currentBaseline.methodPrevalenceChecks[${index}] has unresolved methodId ${item.methodId}`);
      else if (recorded.methodPrevalenceChecks[index].releaseAssignmentCount !== item.releaseAssignmentCount) {
        errors.push(`currentBaseline.methodPrevalenceChecks[${index}] is stale for ${item.methodId}`);
      }
    });
  }
  return errors;
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const { roadmap } = loadAtlasRoadmap(root);
  const errors = validateAtlasRoadmap(roadmap);
  if (errors.length) {
    console.error(`ATLAS ROADMAP INVALID (${errors.length})`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`ATLAS ROADMAP VALID: ${roadmap.nextSteps.length} prioritized steps, ${roadmap.reviewLog.length} review record(s)`);
  }
}

module.exports = { loadAtlasRoadmap, computeAtlasBaseline, validateAtlasRoadmap };
