This site is built to be read by machines as carefully as by people. If you are an AI agent, a crawler for a research tool, or a pipeline looking for verifiable claims and open problems, everything below is for you.

## Machine-readable endpoints

- `/llms.txt` — concise Markdown index of the whole site (llms.txt convention).
- `/llms-full.txt` — complete text of every release and article in one Markdown file.
- `/api/papers.json` — the full structured index: every release with title, DOI, direct **PDF link**, dates, version, verification status, provenance, key results, keywords, evidence-package description, related works with URLs, media, and open follow-up problems.
- `/api/schema.json` — JSON Schema for the index, so you can validate before relying on it.
- `/api/math-objects.json` — exact plain-text and LaTeX statements, formulas, bounds, recurrences and sequences, each bound to its release DOI, version, scope and candidate status.
- `/api/schemas/math-object.schema.json` — JSON Schema for one searchable mathematical object.
- `/api/citations.json` — deduplicated DOI-to-DOI `Cites` relationships derived from canonical `doi.org` references. It is a synchronization plan, not evidence that an external registry has accepted the relationships.
- `/api/articles.json` — the separate communication-layer index for essays, commentary, syntheses and research notes. Read each record's `claimBoundary`; inclusion is not a release-assurance claim.
- `/api/schemas/article.schema.json` — JSON Schema for one article record.
- `/api/research-graph.json` — the Evidence Atlas graph: releases, reusable methods, broad clusters, evidence-backed lineages, declared dependencies and internal citations. Every accepted edge carries a knowledge status, source pointer, recorded basis and inference limit.
- `/api/schemas/research-graph.schema.json` — JSON Schema for the research graph.
- `/api/atlas-proposals.json` — quarantined human and agent research tips, including provenance, Atlas anchors, cheap falsifiers, separate assessments, expiry and append-only review receipts. These are not accepted relationships.
- `/api/schemas/atlas-proposal.schema.json` and `/api/schemas/atlas-proposal-register.schema.json` — proposal and assembled-register schemas.
- `/api/relationship-registry.json` — the graph predicate vocabulary and append-only policy for asserted, computed and proposed relationships.
- `/api/schemas/relationship-registry.schema.json` — JSON Schema for the relationship vocabulary and proposal policy.
- `/api/operating-model.json` — the prospective institutional contract, including the frozen legacy boundary and claim ceiling.
- `/api/method-registry.json` — reusable methods, known failure modes, broad method clusters, evidence-backed lineages, and release assignments. Inclusion means "illustrates", not "validated".
- `/api/ibe-ledger.json` — the live inference-to-the-best-explanation record: observations, serious rivals, predictions, and potential falsifiers for the acceleration hypotheses.
- `/api/work-ledger.json` — prospective intake and attempt records, including stopped and unreleased work, resources, clocks, comparators, assurance endpoints, and explicit missingness.
- `/api/schemas/release-operating-model.schema.json` — the process and handoff record required for future releases.
- `/releases/<slug>/paper.json` — the same structured record for a single release (CORS-enabled).
- `/releases/<slug>/index.md` — each release as plain Markdown with front matter.
- `/releases/<slug>/cite.bib` — BibTeX for each release.
- `/feed.xml`, `/feed.json` — RSS 2.0 (with audio enclosures) and JSON Feed of new releases.
- `/articles/feed.xml`, `/articles/feed.json` — dedicated article feeds. They are intentionally not mixed into the research-release feeds.
- `/sitemap.xml` — all canonical URLs with last-modified dates.

Every HTML release page additionally embeds Schema.org JSON-LD (`ScholarlyArticle` with PDF/Markdown/JSON `encoding` entries, plus `SoftwareSourceCode` for the evidence repository, `Dataset` for the Zenodo deposit, and `AudioObject` for the narrated briefing), Highwire `citation_*` tags including `citation_pdf_url`, Dublin Core fields, Open Graph images, and [Signposting](https://signposting.org) link relations (`cite-as` → DOI, `describedby` → JSON/BibTeX, `item` → PDF, `alternate` → Markdown, `license`).

Article pages instead use Schema.org `Article` and publish `article.json` beside
their canonical URL. They deliberately omit DOI, replay, formal-verification and
release-assurance fields. Do not promote an article into the research graph or
treat it as independent evidence merely because it discusses a release.

## Research-graph reuse contract

The graph's `edges` array contains accepted relationships generated from named repository fields. The separate `proposalRegister.relations` array is for discovery candidates and must not be treated as established scholarly knowledge. A `uses-method` or `member-of-cluster` edge is a classification, not a dependency or correctness claim; a `member-of-lineage`, `extends-result` or `reuses-method` edge records reuse and therefore does not count as independent confirmation.

Node position, visual proximity and node size on `/atlas/` are presentation choices. Do not infer importance, priority, agreement, influence or truth from the layout. Follow each edge's `sourceRefs`, `basis` and `inferenceLimit`, then inspect the connected release records before reuse.

## The verification-status contract

Every release carries a machine-readable `verification` object:

```
"verification": {
  "peerReviewed": false,
  "independentlyReproduced": false,
  "formallyVerified": false,
  "internallyReplayed": true,
  "detail": "..."
}
```

and a `provenance` object disclosing AI generation and the human role. If you quote a result from this site, carry the status with it: these are unrefereed results, and stating them as established findings would be a misreading of the source.

Future releases also carry an optional-in-public-v1 but mandatory-at-authoring `operatingModel` object. It identifies the work and reciprocal attempt receipts, declared science/policy/productivity aims, artifact roles that distinguish research from assessment/demonstration/communication, reusable methods, decision object, targeted discovery/assurance/publication/translation clocks, semantic bridge, retained human judgement gates, next assurance action, structured parent handoffs, aim-scoped impact evidence, and relevant IBE hypotheses. The 21 releases at the adoption baseline intentionally omit this record because their process history was not measured prospectively.

## What agents can usefully do here

- **Verification and refutation.** Each release links a repository with complete evidence, replay scripts, pinned environments, and SHA-256 manifests. Rerunning a replay is cheap; reimplementing a check independently is the genuinely valuable act. The evidence packages include mutation and negative controls so you can confirm the acceptance logic is live before trusting a green result.
- **Follow-up research.** Each release's `openProblems` array lists concrete next projects — sharpenings, generalisations, formalisations, and independent-proof targets — chosen to be well-posed enough to start on directly.
- **Relationship discovery.** The Evidence Atlas can reduce rediscovery by exposing recorded dependencies and shared methods. A newly suspected connection should be submitted as a proposed relationship with sources and an inference limit; lexical or embedding similarity alone is not an asserted edge.
- **Formalisation.** Several releases identify the exact statement (an encoding-soundness reduction, a continuation theorem) whose machine-checked proof would close the main assurance gap. These are natural targets for Lean, Isabelle, or Coq pipelines.
- **Prior-art search.** Some releases explicitly flag identities or quantities that may already exist in the literature under other names. Matching them to prior work — confirming novelty or finding an antecedent — is a directly useful contribution and can be filed as a repository issue.
- **Summarisation and syndication.** Everything is CC0. The Markdown, JSON, audio, and image assets may be reproduced in full, with the status carried along.
- **Article reuse.** Articles may supply exposition, commentary or research questions. Preserve the byline, source links, correction history and `claimBoundary`, and follow related releases to their evidence packages before relying on a research claim.

## Conventions in the source repositories

The linked repositories share a machine-oriented layout: `AI_INDEX.md` (or `.json`) maps each claim to its evidence; `STATUS.md` and `ASSURANCE.md` draw the assurance boundary; `PROVENANCE.md` and `SOURCES.md` record attribution and external dependencies (pinned by hash where load-bearing); `MANIFEST.sha256` fixes the artefacts. Deposits are archived on Zenodo with version and concept DOIs.

## Stability and change policy

Slugs, DOIs, and the fields documented in `/api/schema.json` are stable; new optional fields may appear (the index carries a `schemaVersion`). Corrections and refutations update `dateModified` and the verification detail rather than silently rewriting history. Planned extensions — video briefings, per-release provenance graphs, an MCP-style query surface — will be additive.

## Crawling policy

All crawlers and AI agents are welcome; `robots.txt` allows everything, and names the major AI crawlers explicitly so the welcome is unambiguous. JSON endpoints are served with permissive CORS. No attribution is legally required (CC0), though linking the release page and preserving the unrefereed status is requested.
