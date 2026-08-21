#!/usr/bin/env node
'use strict';

/*
 * Source-driven research graph for the Evidence Atlas.
 *
 * The graph serialises relationships already asserted in Evidence Press
 * metadata. It does not infer scholarly relationships from geometry, keywords
 * or text similarity. Future computed and proposed relations remain explicitly
 * typed and are never promoted by this module.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NODE_ID_RE = /^(release|method|cluster|lineage):[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KNOWLEDGE_STATUSES = new Set(['asserted', 'computed', 'proposed']);
const CONSTRUCTIONS = new Set(['generated-from-source-record', 'registered-directly']);
const TYPE_ORDER = new Map([['release', 0], ['lineage', 1], ['cluster', 2], ['method', 3]]);

const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const edgeId = edge => `edge:${sha256([
  edge.source, edge.predicate, edge.target, edge.knowledgeStatus, edge.basis
].join('\u001f')).slice(0, 20)}`;
const releaseId = slug => `release:${slug}`;
const methodId = id => `method:${id}`;
const clusterId = id => `cluster:${id}`;
const lineageId = id => `lineage:${id}`;

function readJson(root, rel) {
  try { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
  catch (error) { throw new Error(`${rel}: cannot read valid JSON: ${error.message}`); }
}

function loadRelationshipArtifacts(root) {
  const paths = {
    registry: 'data/RELATIONSHIP_REGISTRY.json',
    schema: 'schemas/research-graph.schema.json',
    registrySchema: 'schemas/relationship-registry.schema.json'
  };
  for (const rel of Object.values(paths)) {
    if (!fs.existsSync(path.join(root, rel))) throw new Error(`${rel}: required Evidence Atlas artifact is missing`);
  }
  return {
    registry: readJson(root, paths.registry),
    schema: readJson(root, paths.schema),
    registrySchema: readJson(root, paths.registrySchema),
    paths
  };
}

function validateRelationshipRegistry(registry) {
  const errors = [];
  const add = message => errors.push(message);
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) return ['relationship registry must be an object'];
  if (registry.schemaVersion !== '1.0') add('schemaVersion must equal 1.0');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(registry.updated || ''))) add('updated must be an ISO date');
  for (const field of ['status', 'claimCeiling']) if (!String(registry[field] || '').trim()) add(`${field} must be non-empty`);
  const statuses = registry.knowledgeStatuses || {};
  for (const status of KNOWLEDGE_STATUSES) if (!String(statuses[status] || '').trim()) add(`knowledgeStatuses.${status} must be non-empty`);
  if (!Array.isArray(registry.predicates) || !registry.predicates.length) add('predicates must be a non-empty array');
  else {
    const ids = new Set();
    registry.predicates.forEach((predicate, index) => {
      if (!ID_RE.test(String(predicate.id || ''))) add(`predicates[${index}].id is invalid`);
      if (ids.has(predicate.id)) add(`predicates[${index}].id duplicates ${predicate.id}`);
      ids.add(predicate.id);
      for (const field of ['label', 'inverseLabel', 'meaning', 'inferenceLimit'])
        if (!String(predicate[field] || '').trim()) add(`predicates[${index}].${field} must be non-empty`);
      if (typeof predicate.directed !== 'boolean') add(`predicates[${index}].directed must be boolean`);
    });
  }
  for (const field of ['assertedRelations', 'computedRelations', 'proposedRelations'])
    if (!Array.isArray(registry[field])) add(`${field} must be an array`);
  if (!registry.proposalPolicy || !String(registry.proposalPolicy.publicationRule || '').trim()) add('proposalPolicy.publicationRule must be non-empty');
  if (!registry.updatePolicy || !Array.isArray(registry.updatePolicy.rules) || !registry.updatePolicy.rules.length) add('updatePolicy.rules must be non-empty');
  if (!Array.isArray(registry.changeLog) || !registry.changeLog.length) add('changeLog must be non-empty');
  return errors;
}

function internalReleaseSlug(rawUrl, baseUrl) {
  try {
    const url = new URL(rawUrl, baseUrl);
    const canonical = new URL(baseUrl);
    const allowedHosts = new Set([canonical.hostname, 'evidence-press.pages.dev']);
    if (!allowedHosts.has(url.hostname)) return null;
    const match = url.pathname.match(/^\/releases\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
    return match ? match[1] : null;
  } catch { return null; }
}

function buildResearchGraph({ papers, methodRegistry, relationshipRegistry, baseUrl, sourceCommit = null, sourceDate = null }) {
  const base = String(baseUrl).replace(/\/$/, '');
  const predicateById = new Map(relationshipRegistry.predicates.map(item => [item.id, item]));
  const paperBySlug = new Map(papers.map(paper => [paper.slug, paper]));
  const nodes = [];
  const edges = [];
  const proposals = [];
  const methodAssignmentCounts = new Map(methodRegistry.methods.map(method => [method.id, 0]));
  for (const assignments of Object.values(methodRegistry.releaseAssignments)) {
    for (const method of assignments) methodAssignmentCounts.set(method, (methodAssignmentCounts.get(method) || 0) + 1);
  }

  for (const paper of papers) {
    const statement = String(paper.oneLine || paper.abstract || paper.title);
    nodes.push({
      id: releaseId(paper.slug),
      type: 'release',
      label: paper.shortTitle || paper.title,
      fullTitle: paper.title,
      description: statement,
      statementFingerprint: `sha256:${sha256(statement)}`,
      url: `${base}/releases/${paper.slug}/`,
      datePublished: paper.datePublished,
      dateModified: paper.dateModified || paper.datePublished,
      status: paper.status || 'unrefereed-candidate',
      doi: paper.doi,
      keywords: paper.keywords || [],
      sourceRefs: [`${base}/releases/${paper.slug}/paper.json`]
    });
  }

  for (const method of methodRegistry.methods) {
    const releaseAssignmentCount = methodAssignmentCounts.get(method.id) || 0;
    nodes.push({
      id: methodId(method.id), type: 'method', label: method.name,
      publicLabel: method.id === 'research-lineage-reuse' ? 'Lineage-aware reuse practice' : method.name,
      description: method.definition, mechanism: method.mechanism,
      aims: method.aims || [], failureModes: method.failureModes || [],
      releaseAssignmentCount,
      releaseAssignmentDenominator: papers.length,
      umbrellaMethod: papers.length > 0 && releaseAssignmentCount / papers.length >= 0.5,
      url: `${base}/atlas/?node=${encodeURIComponent(methodId(method.id))}`,
      sourceRefs: [`${base}/api/method-registry.json#/methods/${methodRegistry.methods.indexOf(method)}`]
    });
  }

  const clusterSuccessorById = new Map(methodRegistry.methodClusters
    .filter(cluster => cluster.supersedes)
    .map(cluster => [cluster.supersedes, cluster.id]));
  for (const cluster of methodRegistry.methodClusters) {
    nodes.push({
      id: clusterId(cluster.id), type: 'cluster', label: cluster.name,
      description: cluster.sharedBoundary, sharedBoundary: cluster.sharedBoundary,
      memberCount: cluster.members.length,
      scopeStatus: cluster.members.length === 1 ? 'cluster-seed' : 'broad-cluster',
      active: !clusterSuccessorById.has(cluster.id),
      effectiveDate: cluster.effectiveDate || null,
      supersedes: cluster.supersedes ? clusterId(cluster.supersedes) : null,
      supersededBy: clusterSuccessorById.has(cluster.id) ? clusterId(clusterSuccessorById.get(cluster.id)) : null,
      url: `${base}/atlas/?node=${encodeURIComponent(clusterId(cluster.id))}`,
      sourceRefs: [`${base}/api/method-registry.json#/methodClusters/${methodRegistry.methodClusters.indexOf(cluster)}`]
    });
  }

  for (const lineage of methodRegistry.lineages) {
    nodes.push({
      id: lineageId(lineage.id), type: 'lineage', label: lineage.name,
      description: lineage.basis, basis: lineage.basis,
      sharedBoundary: lineage.sharedBoundary, rootReleaseSlug: lineage.rootReleaseSlug,
      memberCount: lineage.members.length,
      url: `${base}/atlas/?node=${encodeURIComponent(lineageId(lineage.id))}`,
      sourceRefs: [`${base}/api/method-registry.json#/lineages/${methodRegistry.lineages.indexOf(lineage)}`]
    });
  }

  function addEdge(raw, destination = edges) {
    const predicate = predicateById.get(raw.predicate);
    const edge = {
      source: raw.source,
      target: raw.target,
      predicate: raw.predicate,
      knowledgeStatus: raw.knowledgeStatus,
      construction: raw.construction,
      basis: raw.basis,
      inferenceLimit: raw.inferenceLimit || (predicate && predicate.inferenceLimit) || relationshipRegistry.claimCeiling,
      sourceRefs: raw.sourceRefs
    };
    edge.id = edgeId(edge);
    destination.push(edge);
  }

  for (const [slug, assignments] of Object.entries(methodRegistry.releaseAssignments)) {
    for (const method of assignments) addEdge({
      source: releaseId(slug), target: methodId(method), predicate: 'uses-method',
      knowledgeStatus: 'asserted', construction: 'generated-from-source-record',
      basis: `The method registry assigns ${slug} to ${method}.`,
      sourceRefs: [`${base}/api/method-registry.json#/releaseAssignments/${slug}`]
    });
  }

  methodRegistry.methodClusters.forEach((cluster, clusterIndex) => {
    cluster.members.forEach(slug => addEdge({
      source: releaseId(slug), target: clusterId(cluster.id), predicate: 'member-of-cluster',
      knowledgeStatus: 'asserted', construction: 'generated-from-source-record',
      basis: cluster.supersedes
        ? `The method registry lists ${slug} in the dated successor cluster ${cluster.name}, which supersedes ${cluster.supersedes}.`
        : clusterSuccessorById.has(cluster.id)
          ? `The method registry retains ${slug} in the historical cluster ${cluster.name}, superseded by ${clusterSuccessorById.get(cluster.id)}.`
          : `The method registry lists ${slug} as a member of ${cluster.name}.`,
      inferenceLimit: cluster.sharedBoundary,
      sourceRefs: [`${base}/api/method-registry.json#/methodClusters/${clusterIndex}`]
    }));
  });

  methodRegistry.lineages.forEach((lineage, lineageIndex) => {
    lineage.members.forEach(slug => addEdge({
      source: releaseId(slug), target: lineageId(lineage.id), predicate: 'member-of-lineage',
      knowledgeStatus: 'asserted', construction: 'generated-from-source-record',
      basis: lineage.basis,
      inferenceLimit: lineage.sharedBoundary,
      sourceRefs: [`${base}/api/method-registry.json#/lineages/${lineageIndex}`]
    }));
  });

  for (const paper of papers) {
    const parents = paper.operatingModel && Array.isArray(paper.operatingModel.parentLinks)
      ? paper.operatingModel.parentLinks : [];
    parents.forEach((parent, index) => {
      if (!parent.legacyReleaseSlug) return;
      addEdge({
        source: releaseId(paper.slug), target: releaseId(parent.legacyReleaseSlug),
        predicate: parent.relation, knowledgeStatus: 'asserted',
        construction: 'generated-from-source-record', basis: parent.inheritedClaim,
        inferenceLimit: parent.inheritedAssuranceCeiling,
        sourceRefs: [`${base}/releases/${paper.slug}/paper.json#/operatingModel/parentLinks/${index}`]
      });
    });

    (paper.relatedWorks || []).forEach((work, index) => {
      const targetSlug = internalReleaseSlug(work.url, base);
      if (!targetSlug || !paperBySlug.has(targetSlug)) return;
      addEdge({
        source: releaseId(paper.slug), target: releaseId(targetSlug),
        predicate: 'cites-related-release', knowledgeStatus: 'asserted',
        construction: 'generated-from-source-record', basis: work.citation,
        sourceRefs: [`${base}/releases/${paper.slug}/paper.json#/relatedWorks/${index}`]
      });
    });
  }

  const relationSets = [
    ['assertedRelations', 'asserted', edges],
    ['computedRelations', 'computed', edges],
    ['proposedRelations', 'proposed', proposals]
  ];
  for (const [field, knowledgeStatus, destination] of relationSets) {
    for (const relation of relationshipRegistry[field] || []) addEdge({
      ...relation,
      knowledgeStatus,
      construction: 'registered-directly',
      sourceRefs: [
        `${base}/api/relationship-registry.json#/${field}/${(relationshipRegistry[field] || []).indexOf(relation)}`,
        ...(relation.evidenceRefs || [])
      ]
    }, destination);
  }

  nodes.sort((left, right) => (TYPE_ORDER.get(left.type) - TYPE_ORDER.get(right.type)) || left.id.localeCompare(right.id));
  edges.sort((left, right) => left.predicate.localeCompare(right.predicate) || left.source.localeCompare(right.source) || left.target.localeCompare(right.target));
  proposals.sort((left, right) => left.predicate.localeCompare(right.predicate) || left.source.localeCompare(right.source) || left.target.localeCompare(right.target));

  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const directInterReleaseEdges = edges.filter(edge =>
    nodeById.get(edge.source)?.type === 'release' && nodeById.get(edge.target)?.type === 'release');
  const directReleaseIds = new Set(directInterReleaseEdges.flatMap(edge => [edge.source, edge.target]));
  for (const node of nodes) {
    if (node.type === 'release') {
      node.directInterReleaseDegree = directInterReleaseEdges.filter(edge => edge.source === node.id || edge.target === node.id).length;
    }
  }
  const lineageRootWithoutSuccessorCount = methodRegistry.lineages.filter(lineage =>
    lineage.members.length === 1 && lineage.members[0] === lineage.rootReleaseSlug).length;

  const stats = {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    proposedEdgeCount: proposals.length,
    releaseCount: nodes.filter(node => node.type === 'release').length,
    methodCount: nodes.filter(node => node.type === 'method').length,
    clusterCount: nodes.filter(node => node.type === 'cluster').length,
    lineageCount: nodes.filter(node => node.type === 'lineage').length,
    assertedEdgeCount: edges.filter(edge => edge.knowledgeStatus === 'asserted').length,
    computedEdgeCount: edges.filter(edge => edge.knowledgeStatus === 'computed').length,
    directInterReleaseEdgeCount: directInterReleaseEdges.length,
    releasesWithoutDirectInterReleaseEdgeCount: nodes.filter(node => node.type === 'release' && !directReleaseIds.has(node.id)).length,
    singleReleaseMethodCount: nodes.filter(node => node.type === 'method' && node.releaseAssignmentCount === 1).length,
    clusterSeedCount: nodes.filter(node => node.type === 'cluster' && node.scopeStatus === 'cluster-seed').length,
    lineageRootWithoutSuccessorCount,
    unsearchedAreaRegisterCount: 0
  };
  for (const predicate of relationshipRegistry.predicates) {
    stats[`${predicate.id}EdgeCount`] = edges.filter(edge => edge.predicate === predicate.id).length;
  }

  const identityPayload = JSON.stringify({
    predicates: relationshipRegistry.predicates,
    nodes: nodes.map(node => ({ ...node, url: new URL(node.url).pathname + new URL(node.url).search })),
    edges,
    proposals
  });
  return {
    schemaVersion: '1.0',
    graphId: `ep-graph:sha256:${sha256(identityPayload)}`,
    title: 'Evidence Atlas research graph',
    description: 'A source-driven graph of Evidence Press releases, reusable methods, broad clusters, evidence-backed lineages, declared dependencies and internal citations.',
    claimCeiling: relationshipRegistry.claimCeiling,
    generatedFrom: {
      sourceCommit,
      sourceDate,
      artifacts: [
        'papers/*/meta.json',
        'data/METHOD_REGISTRY.json',
        'data/RELATIONSHIP_REGISTRY.json'
      ]
    },
    stats,
    predicates: relationshipRegistry.predicates,
    nodes,
    edges,
    proposalRegister: {
      count: proposals.length,
      publicationRule: relationshipRegistry.proposalPolicy.publicationRule,
      relations: proposals
    }
  };
}

function validateResearchGraph(graph, { relationshipRegistry = null } = {}) {
  const errors = [];
  const add = message => errors.push(message);
  if (!graph || typeof graph !== 'object' || Array.isArray(graph)) return ['graph must be an object'];
  if (graph.schemaVersion !== '1.0') add('schemaVersion must equal 1.0');
  if (!/^ep-graph:sha256:[0-9a-f]{64}$/.test(String(graph.graphId || ''))) add('graphId must be a content-derived SHA-256 identifier');
  for (const field of ['title', 'description', 'claimCeiling']) if (!String(graph[field] || '').trim()) add(`${field} must be non-empty`);
  if (!Array.isArray(graph.nodes)) add('nodes must be an array');
  if (!Array.isArray(graph.edges)) add('edges must be an array');
  if (!Array.isArray(graph.predicates)) add('predicates must be an array');
  if (errors.length) return errors;

  const nodeIds = new Set();
  for (const [index, node] of graph.nodes.entries()) {
    const where = `nodes[${index}]`;
    if (!NODE_ID_RE.test(String(node.id || ''))) add(`${where}.id is invalid`);
    if (nodeIds.has(node.id)) add(`${where}.id duplicates ${node.id}`);
    nodeIds.add(node.id);
    if (!TYPE_ORDER.has(node.type)) add(`${where}.type is invalid`);
    if (!String(node.label || '').trim()) add(`${where}.label must be non-empty`);
    if (!String(node.description || '').trim()) add(`${where}.description must be non-empty`);
    try { new URL(node.url); } catch { add(`${where}.url must be absolute`); }
    if (!Array.isArray(node.sourceRefs) || !node.sourceRefs.length) add(`${where}.sourceRefs must be non-empty`);
  }

  const predicateIds = new Set();
  for (const [index, predicate] of graph.predicates.entries()) {
    if (!ID_RE.test(String(predicate.id || ''))) add(`predicates[${index}].id is invalid`);
    if (predicateIds.has(predicate.id)) add(`predicates[${index}].id duplicates ${predicate.id}`);
    predicateIds.add(predicate.id);
    for (const field of ['label', 'inverseLabel', 'meaning', 'inferenceLimit'])
      if (!String(predicate[field] || '').trim()) add(`predicates[${index}].${field} must be non-empty`);
  }

  const edgeIds = new Set();
  const validateEdge = (edge, where, expectedStatus = null) => {
    if (!/^edge:[0-9a-f]{20}$/.test(String(edge.id || ''))) add(`${where}.id is invalid`);
    if (edgeIds.has(edge.id)) add(`${where}.id duplicates ${edge.id}`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.source)) add(`${where}.source does not resolve: ${edge.source}`);
    if (!nodeIds.has(edge.target)) add(`${where}.target does not resolve: ${edge.target}`);
    if (edge.source === edge.target) add(`${where} must not be a self-edge`);
    if (!predicateIds.has(edge.predicate)) add(`${where}.predicate is not registered: ${edge.predicate}`);
    if (!KNOWLEDGE_STATUSES.has(edge.knowledgeStatus)) add(`${where}.knowledgeStatus is invalid`);
    if (expectedStatus && edge.knowledgeStatus !== expectedStatus) add(`${where}.knowledgeStatus must equal ${expectedStatus}`);
    if (!CONSTRUCTIONS.has(edge.construction)) add(`${where}.construction is invalid`);
    for (const field of ['basis', 'inferenceLimit']) if (!String(edge[field] || '').trim()) add(`${where}.${field} must be non-empty`);
    if (!Array.isArray(edge.sourceRefs) || !edge.sourceRefs.length) add(`${where}.sourceRefs must be non-empty`);
    if (edge.id !== edgeId(edge)) add(`${where}.id does not match its content-derived identity`);
  };
  graph.edges.forEach((edge, index) => validateEdge(edge, `edges[${index}]`));
  if (!graph.proposalRegister || !Array.isArray(graph.proposalRegister.relations)) add('proposalRegister.relations must be an array');
  else {
    graph.proposalRegister.relations.forEach((edge, index) => validateEdge(edge, `proposalRegister.relations[${index}]`, 'proposed'));
    if (graph.proposalRegister.count !== graph.proposalRegister.relations.length) add('proposalRegister.count does not match relations length');
  }
  if (graph.edges.some(edge => edge.knowledgeStatus === 'proposed')) add('proposed relationships must not appear in the accepted edges array');
  if (graph.stats.nodeCount !== graph.nodes.length) add('stats.nodeCount does not match nodes length');
  if (graph.stats.edgeCount !== graph.edges.length) add('stats.edgeCount does not match edges length');
  if (graph.stats.proposedEdgeCount !== graph.proposalRegister.relations.length) add('stats.proposedEdgeCount does not match proposal register');
  const graphNodeById = new Map(graph.nodes.map(node => [node.id, node]));
  const graphDirectEdges = graph.edges.filter(edge =>
    graphNodeById.get(edge.source)?.type === 'release' && graphNodeById.get(edge.target)?.type === 'release');
  if (graph.stats.directInterReleaseEdgeCount !== graphDirectEdges.length) add('stats.directInterReleaseEdgeCount does not match release-to-release edges');
  const directDegree = id => graphDirectEdges.filter(edge => edge.source === id || edge.target === id).length;
  const releaseNodes = graph.nodes.filter(node => node.type === 'release');
  for (const node of releaseNodes) {
    if (node.directInterReleaseDegree !== directDegree(node.id)) add(`${node.id}.directInterReleaseDegree does not match accepted release-to-release edges`);
  }
  if (graph.stats.releasesWithoutDirectInterReleaseEdgeCount !== releaseNodes.filter(node => directDegree(node.id) === 0).length) {
    add('stats.releasesWithoutDirectInterReleaseEdgeCount does not match release node degrees');
  }
  const methodNodes = graph.nodes.filter(node => node.type === 'method');
  for (const node of methodNodes) {
    if (!Number.isInteger(node.releaseAssignmentCount) || !Number.isInteger(node.releaseAssignmentDenominator)) add(`${node.id} is missing integer prevalence fields`);
    else if (node.umbrellaMethod !== (node.releaseAssignmentDenominator > 0 && node.releaseAssignmentCount / node.releaseAssignmentDenominator >= 0.5)) {
      add(`${node.id}.umbrellaMethod does not match its prevalence`);
    }
  }
  if (graph.stats.singleReleaseMethodCount !== methodNodes.filter(node => node.releaseAssignmentCount === 1).length) {
    add('stats.singleReleaseMethodCount does not match method prevalence');
  }
  const clusterNodes = graph.nodes.filter(node => node.type === 'cluster');
  if (clusterNodes.some(node => node.scopeStatus !== (node.memberCount === 1 ? 'cluster-seed' : 'broad-cluster'))) {
    add('cluster scopeStatus does not match memberCount');
  }
  if (graph.stats.clusterSeedCount !== clusterNodes.filter(node => node.scopeStatus === 'cluster-seed').length) {
    add('stats.clusterSeedCount does not match cluster scope');
  }
  const lineageNodes = graph.nodes.filter(node => node.type === 'lineage');
  if (graph.stats.lineageRootWithoutSuccessorCount !== lineageNodes.filter(node => node.memberCount === 1).length) {
    add('stats.lineageRootWithoutSuccessorCount does not match lineage membership');
  }
  if (graph.stats.unsearchedAreaRegisterCount !== 0) add('stats.unsearchedAreaRegisterCount must remain zero until a bounded search-area register exists');
  if (relationshipRegistry && graph.claimCeiling !== relationshipRegistry.claimCeiling) add('graph claim ceiling does not match the relationship registry');
  return errors;
}

module.exports = {
  loadRelationshipArtifacts,
  validateRelationshipRegistry,
  buildResearchGraph,
  validateResearchGraph,
  internalReleaseSlug,
  edgeId
};
