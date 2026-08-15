/* Evidence Atlas — accessible SVG projection of /api/research-graph.json */
(function () {
  'use strict';

  var svg = document.getElementById('atlas-graph');
  if (!svg) return;

  var inspector = document.getElementById('atlas-inspector');
  var search = document.getElementById('atlas-search');
  var status = document.getElementById('atlas-status');
  var reset = document.getElementById('atlas-reset');
  var modeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-atlas-mode]'));
  var tableRows = Array.prototype.slice.call(document.querySelectorAll('[data-atlas-edge-row]'));
  var NS = 'http://www.w3.org/2000/svg';
  var WIDTH = 1200;
  var HEIGHT = 720;
  var state = { graph: null, mode: 'direct', selectedNode: null, selectedEdge: null, query: '' };
  var modeTypes = {
    direct: ['release'],
    structure: ['release', 'cluster', 'lineage'],
    methods: ['release', 'method'],
    all: ['release', 'method', 'cluster', 'lineage']
  };
  var modePredicates = {
    direct: null,
    structure: ['member-of-cluster', 'member-of-lineage', 'extends-result', 'reuses-method', 'cites-related-release'],
    methods: ['uses-method'],
    all: null
  };

  function element(name, attrs, text) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    if (text != null) node.textContent = text;
    return node;
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function nodeCode(node, indexByType) {
    var prefix = { release: 'R', method: 'M', cluster: 'C', lineage: 'L' }[node.type] || '?';
    return prefix + String(indexByType[node.type].indexOf(node.id) + 1).padStart(2, '0');
  }

  function visibleGraph() {
    var types = modeTypes[state.mode];
    var predicates = modePredicates[state.mode];
    var nodes = state.graph.nodes.filter(function (node) { return types.indexOf(node.type) !== -1; });
    var ids = new Set(nodes.map(function (node) { return node.id; }));
    var edges = state.graph.edges.filter(function (edge) {
      return ids.has(edge.source) && ids.has(edge.target) && (!predicates || predicates.indexOf(edge.predicate) !== -1);
    });
    return { nodes: nodes, edges: edges };
  }

  function positions(nodes) {
    var positionsById = {};
    var releases = nodes.filter(function (node) { return node.type === 'release'; });
    var hubs = nodes.filter(function (node) { return node.type !== 'release'; });
    releases.forEach(function (node, index) {
      var angle = -Math.PI / 2 + (Math.PI * 2 * index / Math.max(1, releases.length));
      positionsById[node.id] = {
        x: WIDTH / 2 + Math.cos(angle) * 510,
        y: HEIGHT / 2 + Math.sin(angle) * 292
      };
    });
    hubs.forEach(function (node, index) {
      var angle = -Math.PI / 2 + (Math.PI * 2 * index / Math.max(1, hubs.length));
      var ring = hubs.length > 14 && index % 2 ? 145 : 235;
      positionsById[node.id] = {
        x: WIDTH / 2 + Math.cos(angle) * ring,
        y: HEIGHT / 2 + Math.sin(angle) * ring * .62
      };
    });
    return positionsById;
  }

  function shapeFor(node, x, y) {
    if (node.type === 'lineage') {
      return element('polygon', { class: 'node-shape', points: [x + ',' + (y - 17), (x + 17) + ',' + y, x + ',' + (y + 17), (x - 17) + ',' + y].join(' ') });
    }
    if (node.type === 'cluster') return element('rect', { class: 'node-shape', x: x - 18, y: y - 13, width: 36, height: 26, rx: 4 });
    if (node.type === 'method') {
      return element('polygon', { class: 'node-shape', points: [x + ',' + (y - 16), (x + 14) + ',' + (y - 8), (x + 14) + ',' + (y + 8), x + ',' + (y + 16), (x - 14) + ',' + (y + 8), (x - 14) + ',' + (y - 8)].join(' ') });
    }
    return element('circle', { class: 'node-shape', cx: x, cy: y, r: 14 });
  }

  function setUrl() {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    url.searchParams.set('view', state.mode);
    if (state.selectedNode) url.searchParams.set('node', state.selectedNode); else url.searchParams.delete('node');
    if (state.selectedEdge) url.searchParams.set('edge', state.selectedEdge); else url.searchParams.delete('edge');
    window.history.replaceState({}, '', url.pathname + '?' + url.searchParams.toString());
  }

  function relationLabel(edge) {
    var predicate = state.graph.predicates.find(function (item) { return item.id === edge.predicate; });
    return predicate ? predicate.label : edge.predicate;
  }

  function knowledgeStatusLabel(statusValue) {
    return statusValue === 'asserted' ? 'source-declared' : statusValue;
  }

  function nodeTypeLabel(node) {
    if (node.scopeStatus === 'cluster-seed') return 'cluster seed';
    return node.type;
  }

  function nodeLabel(node) {
    return node.publicLabel || node.label;
  }

  function renderInspectorNode(node) {
    var relations = state.graph.edges.filter(function (edge) { return edge.source === node.id || edge.target === node.id; });
    var links = relations.slice(0, 12).map(function (edge) {
      var otherId = edge.source === node.id ? edge.target : edge.source;
      var other = state.graph.nodes.find(function (item) { return item.id === otherId; });
      return '<button type="button" data-inspect-edge="' + esc(edge.id) + '">' +
        esc(relationLabel(edge)) + ' · ' + esc(other ? nodeLabel(other) : otherId) + '</button>';
    }).join('');
    inspector.innerHTML = '<p class="eyebrow">' + esc(nodeTypeLabel(node)) + ' · ' + esc(node.id) + '</p>' +
      '<h2>' + esc(nodeLabel(node)) + '</h2><p>' + esc(node.description) + '</p>' +
      (node.sharedBoundary ? '<p class="atlas-limit"><strong>Shared boundary.</strong> ' + esc(node.sharedBoundary) + '</p>' : '') +
      '<dl>' +
        (node.status ? '<dt>Status</dt><dd>' + esc(node.status) + '</dd>' : '') +
        (node.doi ? '<dt>DOI</dt><dd>' + esc(node.doi) + '</dd>' : '') +
        (node.releaseAssignmentCount != null ? '<dt>Prevalence</dt><dd>' + esc(node.releaseAssignmentCount) + ' of ' + esc(node.releaseAssignmentDenominator) + ' releases' + (node.umbrellaMethod ? ' · umbrella method' : '') + '</dd>' : '') +
        (node.scopeStatus ? '<dt>Scope</dt><dd>' + esc(node.scopeStatus.replace(/-/g, ' ')) + '</dd>' : '') +
        (node.directInterReleaseDegree != null ? '<dt>Direct links</dt><dd>' + esc(node.directInterReleaseDegree) + '</dd>' : '') +
        (node.statementFingerprint ? '<dt>Statement</dt><dd><code>' + esc(node.statementFingerprint) + '</code></dd>' : '') +
        '<dt>Connections</dt><dd>' + relations.length + '</dd>' +
      '</dl><p><a href="' + esc(node.url) + '">Open the source record →</a></p>' +
      '<div class="atlas-neighbours"><h3>Inspect connections</h3>' + (links || '<p>No accepted connection in this view.</p>') + '</div>';
    Array.prototype.slice.call(inspector.querySelectorAll('[data-inspect-edge]')).forEach(function (button) {
      button.addEventListener('click', function () { selectEdge(button.getAttribute('data-inspect-edge')); });
    });
  }

  function renderInspectorEdge(edge) {
    var sourceNode = state.graph.nodes.find(function (node) { return node.id === edge.source; });
    var targetNode = state.graph.nodes.find(function (node) { return node.id === edge.target; });
    var refs = edge.sourceRefs.map(function (ref) { return '<li><a href="' + esc(ref) + '">' + esc(ref) + '</a></li>'; }).join('');
    inspector.innerHTML = '<p class="eyebrow">' + esc(knowledgeStatusLabel(edge.knowledgeStatus)) + ' relationship · ' + esc(edge.id) + '</p>' +
      '<h2>' + esc(sourceNode ? nodeLabel(sourceNode) : edge.source) + ' <span aria-hidden="true">→</span> ' + esc(targetNode ? nodeLabel(targetNode) : edge.target) + '</h2>' +
      '<dl><dt>Relation</dt><dd>' + esc(relationLabel(edge)) + '</dd><dt>Construction</dt><dd>' + esc(edge.construction.replace(/-/g, ' ')) + '</dd></dl>' +
      '<p><strong>Recorded basis.</strong> ' + esc(edge.basis) + '</p>' +
      '<p class="atlas-limit"><strong>Inference limit.</strong> ' + esc(edge.inferenceLimit) + '</p>' +
      '<div class="atlas-neighbours"><h3>Exact source records</h3><ul>' + refs + '</ul>' +
      '<button type="button" data-inspect-node="' + esc(edge.source) + '">Inspect source node</button>' +
      '<button type="button" data-inspect-node="' + esc(edge.target) + '">Inspect target node</button></div>';
    Array.prototype.slice.call(inspector.querySelectorAll('[data-inspect-node]')).forEach(function (button) {
      button.addEventListener('click', function () { selectNode(button.getAttribute('data-inspect-node')); });
    });
  }

  function selectNode(id, updateUrl) {
    var node = state.graph.nodes.find(function (item) { return item.id === id; });
    if (!node) return;
    if (modeTypes[state.mode].indexOf(node.type) === -1) state.mode = node.type === 'method' ? 'methods' : 'structure';
    state.selectedNode = id;
    state.selectedEdge = null;
    render();
    renderInspectorNode(node);
    if (updateUrl !== false) setUrl();
  }

  function selectEdge(id, updateUrl) {
    var edge = state.graph.edges.find(function (item) { return item.id === id; });
    if (!edge) return;
    state.selectedEdge = id;
    state.selectedNode = null;
    render();
    renderInspectorEdge(edge);
    if (updateUrl !== false) setUrl();
  }

  function renderTable(visibleEdgeIds) {
    var q = state.query.toLowerCase().trim();
    tableRows.forEach(function (row) {
      var modeMatch = visibleEdgeIds.has(row.getAttribute('data-atlas-edge-row'));
      var textMatch = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
      row.hidden = !(modeMatch && textMatch);
    });
  }

  function render() {
    var current = visibleGraph();
    var coords = positions(current.nodes);
    var nodeById = new Map(current.nodes.map(function (node) { return [node.id, node]; }));
    var indexByType = {};
    Object.keys(modeTypes).forEach(function () {});
    ['release', 'method', 'cluster', 'lineage'].forEach(function (type) {
      indexByType[type] = state.graph.nodes.filter(function (node) { return node.type === type; }).map(function (node) { return node.id; });
    });
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(element('title', { id: 'atlas-svg-title' }, 'Evidence Atlas relationship map'));
    svg.appendChild(element('desc', { id: 'atlas-svg-desc' }, 'Interactive projection of accepted release, method, cluster and lineage relationships. Use the relationship register below for a complete nonvisual representation.'));
    var grid = element('g', { 'aria-hidden': 'true' });
    for (var x = 100; x < WIDTH; x += 100) grid.appendChild(element('line', { class: 'atlas-gridline', x1: x, y1: 0, x2: x, y2: HEIGHT }));
    for (var y = 60; y < HEIGHT; y += 60) grid.appendChild(element('line', { class: 'atlas-gridline', x1: 0, y1: y, x2: WIDTH, y2: y }));
    svg.appendChild(grid);

    var relatedIds = new Set();
    if (state.selectedNode) current.edges.forEach(function (edge) {
      if (edge.source === state.selectedNode || edge.target === state.selectedNode) {
        relatedIds.add(edge.id); relatedIds.add(edge.source); relatedIds.add(edge.target);
      }
    });
    if (state.selectedEdge) {
      var selected = current.edges.find(function (edge) { return edge.id === state.selectedEdge; });
      if (selected) { relatedIds.add(selected.id); relatedIds.add(selected.source); relatedIds.add(selected.target); }
    }

    var edgeLayer = element('g', { class: 'atlas-edges', 'aria-hidden': 'true' });
    current.edges.forEach(function (edge) {
      var a = coords[edge.source]; var b = coords[edge.target];
      if (!a || !b) return;
      var classes = ['atlas-edge'];
      if (relatedIds.size && !relatedIds.has(edge.id)) classes.push('is-dimmed');
      if (relatedIds.has(edge.id)) classes.push('is-related');
      if (state.selectedEdge === edge.id) classes.push('is-selected');
      var line = element('line', { class: classes.join(' '), 'data-predicate': edge.predicate, x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      edgeLayer.appendChild(line);
      var hit = element('line', { class: 'atlas-edge-hit', x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'data-edge-id': edge.id });
      hit.addEventListener('click', function () { selectEdge(edge.id); });
      edgeLayer.appendChild(hit);
    });
    svg.appendChild(edgeLayer);

    var query = state.query.toLowerCase().trim();
    var nodeLayer = element('g', { class: 'atlas-nodes' });
    current.nodes.forEach(function (node) {
      var point = coords[node.id];
      var matches = query && (nodeLabel(node) + ' ' + node.label + ' ' + node.description + ' ' + node.id).toLowerCase().indexOf(query) !== -1;
      var classes = ['atlas-node'];
      if (relatedIds.size && !relatedIds.has(node.id)) classes.push('is-dimmed');
      if (state.selectedNode === node.id || (state.selectedEdge && relatedIds.has(node.id))) classes.push('is-selected');
      if (matches) classes.push('is-match');
      var group = element('g', {
        class: classes.join(' '), transform: 'translate(0 0)', tabindex: '0', role: 'button',
        'data-type': node.type, 'data-scope-status': node.scopeStatus || '', 'data-node-id': node.id,
        'aria-label': nodeTypeLabel(node) + ': ' + nodeLabel(node) + '. Select to inspect.'
      });
      group.appendChild(element('title', {}, nodeLabel(node)));
      group.appendChild(shapeFor(node, point.x, point.y));
      group.appendChild(element('text', { class: 'node-code', x: point.x, y: point.y }, nodeCode(node, indexByType)));
      group.addEventListener('click', function () { selectNode(node.id); });
      group.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectNode(node.id); }
      });
      nodeLayer.appendChild(group);
    });
    svg.appendChild(nodeLayer);

    modeButtons.forEach(function (button) { button.setAttribute('aria-pressed', button.getAttribute('data-atlas-mode') === state.mode ? 'true' : 'false'); });
    var matchesCount = query ? current.nodes.filter(function (node) {
      return (nodeLabel(node) + ' ' + node.label + ' ' + node.description + ' ' + node.id).toLowerCase().indexOf(query) !== -1;
    }).length : 0;
    status.textContent = current.nodes.length + ' nodes and ' + current.edges.length + ' accepted relationships in this view' +
      (query ? '; ' + matchesCount + ' node' + (matchesCount === 1 ? '' : 's') + ' match “' + state.query.trim() + '”.' : '.');
    renderTable(new Set(current.edges.map(function (edge) { return edge.id; })));
  }

  function resetView() {
    state.selectedNode = null; state.selectedEdge = null; state.query = '';
    search.value = '';
    inspector.innerHTML = '<p class="eyebrow">How to use the instrument</p><h2>Select a node or connection</h2><p>Choose a coded node to inspect its full title and accepted relationships. Choose a line to see the exact recorded basis, inference limit and source pointer.</p><p class="atlas-limit"><strong>Boundary.</strong> Geometry is navigation, not evidence. Position and node size do not express correctness, novelty, priority or impact.</p>';
    render(); setUrl();
  }

  modeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (button.disabled) return;
      state.mode = button.getAttribute('data-atlas-mode');
      state.selectedNode = null; state.selectedEdge = null;
      render(); setUrl();
    });
  });
  search.addEventListener('input', function () { state.query = search.value; render(); });
  search.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' || !state.query.trim()) return;
    var visible = visibleGraph().nodes;
    var q = state.query.toLowerCase().trim();
    var match = visible.find(function (node) { return (nodeLabel(node) + ' ' + node.label + ' ' + node.description + ' ' + node.id).toLowerCase().indexOf(q) !== -1; });
    if (match) selectNode(match.id);
  });
  reset.addEventListener('click', resetView);

  fetch('/api/research-graph.json', { headers: { accept: 'application/json' } }).then(function (response) {
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.json();
  }).then(function (graph) {
    state.graph = graph;
    var params = new URL(window.location.href).searchParams;
    var requestedMode = params.get('view');
    if (requestedMode === 'programmes') requestedMode = 'structure';
    if (modeTypes[requestedMode]) state.mode = requestedMode;
    render();
    if (params.get('edge')) selectEdge(params.get('edge'), false);
    else if (params.get('node')) selectNode(params.get('node'), false);
  }).catch(function () {
    status.textContent = 'The interactive projection could not load. The complete relationship register below remains available.';
    inspector.innerHTML = '<p class="eyebrow">Interactive view unavailable</p><h2>Use the relationship register</h2><p>The server-rendered table below contains the accepted relationships and their source records.</p>';
  });
}());
