# Atlas discovery pilot: adversarial review and disposition, 14 October 2026

Scope: the bounded relationship-discovery pilot built on branch
`atlas/discovery-pilot` (design record `docs/ATLAS_DISCOVERY_PILOT.md`).

Reviewer: OpenAI `gpt-5.6-sol` over the Responses API, framed to refute,
supplied with the full branch diff (excluding the 2 MB run records), the
design records, `AGENTS.md`, the proposal schema and validator, the frozen
benchmark and the head of the evaluation record. The reviewer could not run
code; every finding was labelled a hypothesis with a static reproduction. The
Codex CLI was unavailable (usage limit). Each finding was verified against the
branch by the producer before action. The reviewer's verdict on the submitted
state was "do not merge".

Claim ceiling: this is a cross-model producer-side review of tooling. It is
not scientific assurance of any release, and it does not make any candidate
pair a relationship.

## Dispositions

| # | Severity | Finding (abridged) | Verified | Action |
|---|---|---|---|---|
| 1 | FATAL | `--out` accepted any path, so a run could be written into `data/atlas-proposals/`, `dist/` or `papers/`. | Yes | Every write now passes `confinePath`: real path must be under `data/atlas-discovery/` or entirely outside the repository; symlinks back into the repository are refused. Tested for proposals, dist, papers, data and a symlink. |
| 2 | FATAL | The benchmark imported the generator wholesale, so defects could self-confirm; "frozen independently" was unsupported. | Yes | `tools/atlas-benchmark.js` no longer imports the generator. It extracts positives from the site's graph builder itself; a test cross-checks the two extractions. Negative-control proposal moved to `tools/atlas-negatives.js`, documented as generator-assisted and never called by the freeze. |
| 3 | FATAL | The committed evaluation record contained genre keywords the current code excludes, so it was produced by older code while claiming the same version. | Yes (the review bundle mixed a pre-fix record with post-fix code; the committed record was equally stale) | Generator version bumped to 0.2.0; every run record, benchmark and draft carries a SHA-256 over the generator source files; benchmark re-frozen; run and evaluation regenerated. |
| 4 | MAJOR | `confirmedAt` (18:00Z) postdated `frozenAt` (13:40Z); provenance was reconstructed. | Yes; the 18:00Z value was an entry error by the producer | `confirmedAt` corrected to 13:39:00Z with a note stating it is recorded to the minute from the transcript and that the earlier value was an error. The freeze now refuses a confirmation time after the freeze time (tested). Benchmark re-frozen after the correction. |
| 5 | MAJOR | Controls were selected to have no citation, keyword, path or adjacency signal, so they are handicapped on the union ordering; union `negativesAt` is not a burden estimate. | Yes | `controlsCaveat` added to every evaluation record; design record and roadmap entry state that the controls bound lexical and semantic burden only and that burden among unlabelled candidates needs blinded labelling, which the pilot does not provide. Controls were not re-sampled because that needs a maintainer. |
| 6 | MAJOR | Hiding an edge leaves explicit counterpart mentions in bodies, so recovery may be label leakage. | Yes: 7 of 16 hidden pairs name their counterpart | Leakage audit added (slug as whole word, title, short title, DOI, release URL). Evaluation now reports recovery restricted to non-leaking pairs. On the 9 clean pairs the union recovers 5 at rank 25 and 8 at rank 100. Claim ceiling updated. |
| 7 | MAJOR | `citation-path` is undirected co-neighbourhood, not "both cite a third release". | Yes | Route documented and evidenced as `undirected-distance-two`; rival text and design record corrected. Directed patterns deferred. |
| 8 | MAJOR | Semantic route not reproducible: cache keyed by clipped text only, entries untrusted, determinism test did not cover it. | Yes | Cache key is full-text hash plus clipping policy; entries validated for model, text hash, clipping policy and finite numbers (tested, including a corrupted entry); run record carries `semanticProvenance` with a hash over all vectors and a `determinism` statement excluding the semantic route unless that hash matches. |
| 9 | MAJOR | `draft` trusted any run JSON, allowed path traversal, never validated the output. | Yes | Run path confined to `runs/`; record type, generator version, source hash, corpus fingerprint and candidate presence checked; live direct-edge status rechecked; `intake` validates against the schema field list and the live validator and refuses on any error (tested for traversal, version, fingerprint, tampering, bad time). |
| 10 | MAJOR | Group drafts bypassed the negative-control gate and inferred programmes or lineages from similarity. | Yes | Gate applied to every unrecorded member pair (tested). Group drafts are `relationship-candidate` records asking which member pairs share a formal object; all programme, lineage, cluster and edge-creation language removed (tested by regex). |
| 11 | MAJOR | Drafts carried a submission time and review state, conflating the discovery and intake clocks. | Yes | Drafts are a separate record type with no identity, submission time or state. `intake --submitted-at` starts the proposal clock and computes the identity. Tested. |
| 12 | MINOR | Top-K was applied before excluding recorded pairs, so routes ranked fewer than K eligible pairs. | Yes (84 and 85 of 100) | Lexical and semantic top-K are taken over eligible pairs; the run record states so; tested. |
| 13 | MINOR | URL normalisation too weak for "exact overlap". | Yes | Scheme normalised to https, www stripped, fragment dropped, query parameters sorted, arXiv version suffix removed; non-http schemes ignored; fixtures added. |

Checks the reviewer reported as holding: default paths do not touch the
registries or papers; pair-draft fields satisfy the schema; the roadmap
validator change strengthens the intake dependency; non-semantic ordering has
explicit tie-breakers.

## What the review did not cover

- It could not run the test suite; the producer ran it (100 checks pass).
- It did not read the 2 MB run records in full.
- It did not assess any candidate pair's scientific merit, and nothing here
  does.

## Candidate reading

The producer agent also read seventeen candidate pairs against the pilot's
cheap falsifier. Those readings are deliberately not recorded in the
repository and no draft was taken into the proposal register, because the
agent that ran the generator must not review its own candidates into the
register. Reading time and count are recorded in the run record's
`reviewerEffort` field without verdicts. Maintainer intake of the seven
drafts under `data/atlas-discovery/drafts/` is the next action.
