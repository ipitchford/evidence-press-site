## How to read the atlas

The atlas is a map of **recorded relationships**, not a ranking of papers and not a verdict on their claims. Release nodes have equal visual weight. The position of a node is a stable layout choice, not evidence of importance, influence, correctness or priority.

Three relationship states remain separate:

- **Asserted** — an Evidence Press source record explicitly declares the classification, citation or dependency.
- **Computed** — a deterministic rule has detected a structural pattern from declared inputs. Computed links are not scholarly assertions.
- **Proposed** — a person or agent has nominated a relationship for review. Proposed links are excluded from the accepted graph.

This first version contains asserted relationships only. It does not generate similarity links or hidden-dependency claims.

## What the map distinguishes

A shared method, a broad cluster and a research lineage are different objects:

- A **method edge** says that a release illustrates a registered reusable method.
- A **cluster edge** records broad operational or thematic adjacency. It does not establish dependency or common provenance.
- A **lineage edge** records an evidence-backed research programme. Reuse within a lineage is correlated evidence, not independent confirmation.
- A **parent edge** records an inherited result or method and carries the parent's stated assurance ceiling.
- An **internal citation edge** records that one release names another as related work; it does not by itself establish agreement, priority or dependence.

The registry is explicitly a **working taxonomy**. The default Programme view excludes method-assignment edges, but it still mixes registry-derived cluster and lineage membership with direct inter-release citations, extensions and reuse; the status line and relationship register give the exact composition. A non-root release enters an evidence-backed lineage only when its metadata declares both the reciprocal lineage identifier and an evidential parent link. A parent link alone is not lineage membership.

Select any node or connection in the interactive map to inspect its basis, inference limit and exact source record.

## An accessible and agent-readable instrument

The synchronized relationship register below the map contains the same accepted edges in a conventional table. It remains usable without JavaScript and is the nonvisual alternative to the SVG map.

Agents should retrieve [`research-graph.json`](/api/research-graph.json) and validate it against [`research-graph.schema.json`](/api/schemas/research-graph.schema.json). The API publishes stable node identifiers, content-derived edge identifiers, statement fingerprints, relationship status, source pointers and inference limits.

The current priorities, readiness gates and periodic review checklist are published in the [`Atlas roadmap`](/api/atlas-roadmap.json), validated against its [`roadmap schema`](/api/schemas/atlas-roadmap.schema.json). The human-readable design record remains in the [public repository](https://github.com/ipitchford/evidence-press-site/blob/main/docs/EVIDENCE_ATLAS.md).

## The discovery layer

The next research stage can compare release statements, dependencies, citations and methods to nominate previously unrecorded connections. Those candidates should enter the **proposal register**, with an explanation and supporting sources, rather than appear as facts.

Useful candidate types may include a shared lemma under different notation, an unacknowledged antecedent, a common unresolved assumption, a reusable verifier, or two negative results that block the same strategy. A candidate becomes asserted only after additive review against resolvable evidence. Rejected and superseded proposals should remain available as negative knowledge.

The next implementation step is a fail-closed proposal-intake and review-receipt layer. Relationship-discovery experiments should follow only after proposals can be retained, rejected, superseded and audited without entering the accepted graph.

## Safe reuse

Start from the selected release page and its archived evidence package. Carry the release's status and assurance boundaries into downstream work. A graph edge can lower discovery cost; it cannot substitute for reading the connected claims, checking their semantic bridge or reproducing their evidence.
