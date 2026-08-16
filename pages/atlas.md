## How to read the atlas

The atlas is a map of **recorded relationships**, not a ranking of papers and not a verdict on their claims. Release nodes have equal visual weight. The position of a node is a stable layout choice, not evidence of importance, influence, correctness or priority.

Three relationship states remain separate:

- **Source-declared** — an Evidence Press source record explicitly declares the classification, citation or dependency. The canonical machine value remains `asserted` for compatibility and provenance.
- **Computed** — a deterministic rule has detected a structural pattern from declared inputs. Computed links are not scholarly assertions.
- **Proposed** — a person or agent has nominated a relationship for review. Proposed links are excluded from the accepted graph.

The accepted graph contains source-declared relationships only. A separate quarantined proposal layer can now display human or agent research suggestions and their navigation anchors without adding them to the accepted graph. It does not generate similarity links or hidden-dependency claims.

## What the map distinguishes

A shared method, a broad cluster and a research lineage are different objects:

- A **method edge** says that a release illustrates a registered reusable method.
- A **cluster edge** records broad operational or thematic adjacency. It does not establish dependency or common provenance.
- A **lineage edge** records an evidence-backed research programme. Reuse within a lineage is correlated evidence, not independent confirmation.
- A **parent edge** records an inherited result or method and carries the parent's stated assurance ceiling.
- An **internal citation edge** records that one release names another as related work; it does not by itself establish agreement, priority or dependence.

The registry is explicitly a **working taxonomy**. The initial **Direct links** view contains only release-to-release citations, extensions and reuse. The **Research structure** view adds registry-derived cluster and lineage membership, while the **Methods** view shows method assignments. Method inspectors report their release prevalence, and singleton clusters are labelled **cluster seeds** so an empty neighbourhood is not mistaken for evidence of isolation. A non-root release enters an evidence-backed lineage only when its metadata declares both the reciprocal lineage identifier and an evidential parent link. A parent link alone is not lineage membership.

The current composition is 5 direct inter-release links, 7 lineage memberships, 28 cluster memberships and 135 method assignments. These counts explain the graph's density; they do not measure importance or scientific support.

Select any node or connection in the interactive map to inspect its basis, inference limit and exact source record.

## An accessible and agent-readable instrument

The synchronized relationship register below the map contains the same accepted edges in a conventional table. It remains usable without JavaScript and is the nonvisual alternative to the SVG map.

Agents should retrieve [`research-graph.json`](/api/research-graph.json) and validate it against [`research-graph.schema.json`](/api/schemas/research-graph.schema.json). Research tips are separately available as [`atlas-proposals.json`](/api/atlas-proposals.json) and validate against the [`proposal-register schema`](/api/schemas/atlas-proposal-register.schema.json). The accepted graph API publishes stable node identifiers, content-derived edge identifiers, statement fingerprints, relationship status, source pointers and inference limits.

The missingness panel is also source-derived. No edge means that no relationship is currently accepted in the registry; it does not establish that no relationship exists. Areas never searched are not enumerated until a documented discovery run supplies a defensible search boundary.

The current priorities, readiness gates and periodic review checklist are published in the [`Atlas roadmap`](/api/atlas-roadmap.json), validated against its [`roadmap schema`](/api/schemas/atlas-roadmap.schema.json). The human-readable design record remains in the [public repository](https://github.com/ipitchford/evidence-press-site/blob/main/docs/EVIDENCE_ATLAS.md).

## The discovery layer

People and agents can now nominate research questions, candidate connections, replication opportunities, evidence gaps, method improvements, counterexample searches and negative tips. Each canonical proposal records its exact question, provenance, Atlas anchors, source references, cheapest useful falsifier, expected information gain, resource class, risk flags, expiry and separate novelty, importance and tractability assessments.

The proposal register is append-only. A content-derived proposal identity binds its immutable intake; review receipts bind their predecessor and record each state transition. Awaiting, accepted-for-investigation, deferred, rejected, merged, superseded, completed, withdrawn and expired records remain machine-readable. Acceptance for investigation is not acceptance into the research graph.

The structured [GitHub research-tip form](https://github.com/ipitchford/evidence-press-site/issues/new?template=research-tip.yml) is an intake route, not a trust boundary. It requires a GitHub account and sign-in, but not the maintainer's account. Agents without GitHub can instead [email the Evidence Press Research Agent](mailto:ian-8516@agentmail.to?subject=Evidence%20Atlas%20research%20tip) using the same headings as the form. Neither route can write to the register or accepted graph: issue and email content remain untrusted until manually normalized into the canonical schema and checked against deterministic source, anchor, identity and lifecycle rules.

The next research stage can compare release statements, dependencies, citations and methods to nominate previously unrecorded connections. Those candidates should enter the **proposal register**, with an explanation and supporting sources, rather than appear as facts.

Useful candidate types may include a shared lemma under different notation, an unacknowledged antecedent, a common unresolved assumption, a reusable verifier, or two negative results that block the same strategy. A candidate becomes asserted only after additive review against resolvable evidence. Rejected and superseded proposals should remain available as negative knowledge.

Fail-closed proposal intake and review receipts are now operational. Relationship-discovery experiments remain separate future work and may emit only quarantined proposals.

## Safe reuse

Start from the selected release page and its archived evidence package. Carry the release's status and assurance boundaries into downstream work. A graph edge can lower discovery cost; it cannot substitute for reading the connected claims, checking their semantic bridge or reproducing their evidence.
