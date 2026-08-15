# Evidence Atlas: implementation and research roadmap

Status: source-driven implementation with calibrated projections
Adopted: 15 August 2026  
Public page: <https://evidencepress.org/atlas/>  
Machine graph: <https://evidencepress.org/api/research-graph.json>

## Purpose

The Evidence Atlas makes relationships among Evidence Press outputs visible and
inspectable without turning layout, similarity or catalogue membership into a
truth claim. It has two jobs:

1. reduce the cost of discovering existing releases, dependencies, methods and
   research programmes;
2. create a controlled route through which people or agents may nominate
   previously unrecorded relationships for review.

The first implementation performs the first job. The proposal schema prepares
for the second but publishes no speculative edges.

## Implemented architecture

```text
papers/*/meta.json -----------------------+
data/METHOD_REGISTRY.json ----------------+--> tools/research-graph.js
data/RELATIONSHIP_REGISTRY.json ----------+          |
                                                     +--> /api/research-graph.json
                                                     +--> /api/v1/research-graph.json
                                                     +--> /atlas/index.json
                                                     +--> /atlas/ HTML/SVG/table
```

The build creates release, method, broad-cluster and evidence-backed-lineage
nodes. Accepted edges currently come from:

- method-registry release assignments;
- method-cluster membership;
- evidence-backed lineage membership;
- structured internal parent links;
- internal Evidence Press citations in `relatedWorks`.

Every edge includes a content-derived identifier, predicate, knowledge status,
construction route, recorded basis, inference limit and source references.
Release statements have SHA-256 fingerprints. The page and API use the same
in-memory graph object.

## Relationship states

The graph keeps three states separate:

- `asserted`: explicitly recorded in a named source field;
- `computed`: emitted by a deterministic structural rule but not asserted as a
  scholarly relationship;
- `proposed`: nominated by a person or agent and awaiting or retaining a review
  decision.

Only asserted and explicitly published computed edges may appear in the main
`edges` array. Proposed edges live under `proposalRegister.relations`. Promotion
is additive and requires a resolvable basis. Rejected and superseded proposals
should remain available once the proposal layer is activated.

## Current user interface

- Direct-links view (the initial projection): releases and accepted
  release-to-release citations, extensions and reuse only.
- Research-structure view: releases, broad clusters, cluster seeds, lineages,
  parents and internal citations.
- Method view: releases and registered reusable methods.
- All-accepted view: every accepted node and edge.
- A visible composition statement, per-method prevalence and a deterministic
  missingness panel. Public copy renders `asserted` as `source-declared`; the
  canonical machine field is unchanged.
- Search, keyboard-selectable nodes, inspectable connections and shareable URL
  state.
- Equal-sized release nodes and stable deterministic geometry.
- A complete server-rendered relationship table as the nonvisual and no-script
  representation.

The geometry never encodes correctness, novelty, priority, review, influence or
impact.

## Next-step register

The authoritative machine-readable roadmap is
[`data/ATLAS_ROADMAP.json`](../data/ATLAS_ROADMAP.json), published at
<https://evidencepress.org/api/atlas-roadmap.json>. It records dependencies,
acceptance criteria, stop conditions, review triggers and an append-only review
log. The initial priority order is:

1. **Proposal intake and review receipts.** Implement a fail-closed route for
   people and agents to nominate relationships without writing to the accepted
   graph. Retain rejected and superseded decisions.
2. **Projection and taxonomy calibration — complete.** The direct-inter-release
   view is the initial projection; the interface exposes composition, method
   prevalence, cluster seeds, missingness and the reciprocal eligibility rule
   for evidence-backed lineages.
3. **Bounded discovery pilot.** After proposal intake exists, compare separately
   visible citation, symbolic, shared-object and semantic-retrieval routes on a
   frozen hidden-link benchmark with negative controls.
4. **Proposal-review workbench.** Make evidence, rival explanations, review
   provenance and decision history accessible without visually collapsing
   proposals into accepted edges.
5. **Agent query surfaces.** Add filtered neighbourhood or dependency queries
   only when a demonstrated task is materially cheaper than retrieving the
   complete graph.
6. **Renderer scale review.** Retain the dependency-free SVG until measured
   accessibility, interaction or performance evidence justifies a change; the
   current reassessment threshold is roughly 250 visible nodes.
7. **Outcome evaluation.** Prospectively test whether the Atlas reduces
   rediscovery, replay or reconstruction effort. Traffic, graph size, internal
   reuse and proposal volume are not evidence of research acceleration.

The highest-priority next action is therefore proposal intake, validation and
append-only review receipts. Relationship discovery must not run as a publishing
route until that boundary is working.

The initial external model comment supplied by the maintainer reconciled all
175 accepted edges and prompted the calibration task. A later same-system Sol
review recommended making the five direct inter-release links first-class and
displaying the composition beside the headline statistics. The current
interface implements that recommendation without treating either review as
independent scientific assurance. Two broad methods occur on 20 and 18 of the
28 releases, so prevalence is now shown rather than left implicit. The earlier
comment also queried a Polydegree lineage. It is not currently eligible: a
non-root lineage member must declare both a reciprocal `lineageId` and an
evidential parent link, and the proposed successor has only the latter.

## Deterministic gates

`node tools/test-research-graph.js` verifies:

- every source release, method, cluster and lineage is represented;
- all edge endpoints and predicates resolve;
- all edges carry provenance, basis and inference limits;
- edge identities change when their meaning changes;
- proposed edges cannot enter the accepted array;
- corrupted endpoints and silent edge mutations are rejected.

The normal composite build, internal-link gate, publication-preservation gate,
byte-identical rebuild and accessibility workflow also cover the atlas.

## Stage 2: relationship-discovery research

Candidate generation should remain a separate, reproducible job. A feasible
pipeline is:

1. freeze the release corpus and extract exact statements, definitions,
   dependencies, citations, keywords and method assignments;
2. generate candidate pairs through several independently visible routes:
   exact reference overlap, shared formal objects, citation paths, symbolic
   normalization and semantic retrieval;
3. record route-specific evidence rather than one opaque similarity score;
4. ask a critic to state the strongest alternative explanation, such as common
   vocabulary without common mechanism;
5. emit a proposed relationship with evidence references, scope and an
   inference limit;
6. review against the connected primary artefacts;
7. accept, reject or supersede additively.

Useful discovery predicates may include `shares-lemma`, `possible-antecedent`,
`shares-unresolved-assumption`, `can-reuse-verifier`, `contradicts`,
`repairs`, and `blocks-same-strategy`. These are candidates for future review,
not predicates in the current accepted vocabulary.

Evaluation should freeze known links, hide a subset, measure recovery and false
proposal burden, and include negative controls made from lexically similar but
substantively unrelated releases. A useful discovery system must improve
research navigation without silently manufacturing dependencies or priority
claims.

## Interoperability and optional tools

The native JSON remains intentionally small. Future exports can map relationship
semantics to [CiTO](https://www.sparontologies.net/ontologies/cito), provenance
to [PROV-O](https://www.w3.org/TR/prov-o/), and packaged research objects to
[RO-Crate](https://www.researchobject.org/ro-crate/specification.html).

The current dependency-free SVG is appropriate at catalogue scale. If the
accepted graph grows beyond roughly 250 visible nodes, repeated browser testing
should compare it with [Cytoscape.js](https://js.cytoscape.org/) or
[Sigma.js](https://www.sigmajs.org/docs/) plus Graphology. An optional export
for [Gephi Lite](https://gephi.org/lite/) could support exploratory analysis.
No renderer change should alter graph semantics or become a prerequisite for
machine access.

## Maintenance rule

Normal release publication updates the atlas automatically through canonical
metadata and method-registry changes. A new relationship type requires a new
predicate entry, inference limit, schema-valid source and regression test.
Never edit generated `dist/` files, infer lineage from topical similarity, or
move a proposed edge into the accepted graph merely because it looks plausible
in the visualization.

## Periodic review

Review the Atlas whenever the maintainer asks, and at least monthly while it is
active. Also review after five added releases, the first submitted proposal, a
material objection or correction, or a renderer threshold event. The next
scheduled review is 15 September 2026 unless an earlier trigger occurs.

Each review should rebuild the graph; compare release, method, cluster, lineage,
accepted-edge and proposal counts; recheck source resolution; sample accepted
edges across predicates; inspect every proposal state; examine new external
citations, objections and reproductions; and assess accessibility, performance
and agent retrieval cost. Append the result to the roadmap's `reviewLog` with
one exact next action, reviewer identity as reported, and a provenance note. Do
not rewrite an earlier review.
