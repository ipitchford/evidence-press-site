# Evidence Atlas: bounded relationship-discovery pilot

Status: design adopted 14 October 2026; implemented the same day; revised after an adversarial review (see `audits/2026-10-14-atlas-discovery-adversarial-review.md`)
Roadmap item: `atlas-step-discovery-pilot` in `data/ATLAS_ROADMAP.json`
Parent design: [`EVIDENCE_ATLAS.md`](EVIDENCE_ATLAS.md), Stage 2

## Purpose

The accepted Atlas graph records only declared relationships. On 14 October
2026 it held 151 releases, 50 direct inter-release edges and 107 releases with
no direct link at all. A cheap lexical scan recovered 31 of the 32 recorded
direct pairs inside the top 100 of 11,325 candidate pairs and ranked several
obvious programme-mates that no metadata connects. The pilot tests whether a
small set of transparent retrieval routes can nominate such hidden connections
at a tolerable false-proposal burden.

The pilot is a proposal generator. It has no write path to
`data/RELATIONSHIP_REGISTRY.json`, to any `papers/*/meta.json`, or to the
accepted edge array. A candidate becomes a proposal only when a person writes
it into `data/atlas-proposals/` through the normal publication gate, and a
proposal becomes an accepted edge only through additive review as the Atlas
policy already requires.

## Components

| Path | Role |
|---|---|
| `tools/atlas-benchmark.js` | Freezes the benchmark from the accepted graph and a human-confirmed negative-control list. Does not import the generator; it extracts positives itself from the site's graph builder, and a test cross-checks the two extractions. |
| `tools/atlas-negatives.js` | Generator-assisted helper that proposes negative-control candidates for a maintainer to confirm. Never called by the freeze. |
| `tools/atlas-discovery.js` | Generator with `run`, `evaluate`, `draft` and `intake` subcommands. Dependency-free CommonJS. Every write is confined to `data/atlas-discovery/` (or a directory outside the repository for tests); any other repository path, including through a symlink, is refused. |
| `tools/test-atlas-discovery.js` | Deterministic gates listed below. |
| `data/atlas-discovery/BENCHMARK.json` | Frozen corpus fingerprint, positive pairs, hidden subset, negative controls, freeze provenance. |
| `data/atlas-discovery/runs/<date>-<corpus-hash>.json` | One run record per corpus state. Repository-only; not built into `dist/`. |
| `data/atlas-discovery/drafts/` | Drafts written by `draft`: generator output with no proposal identity, submission time or review state. `intake` turns one into a validated proposal under `drafts/intake/`. Not loaded by the build. |

Run records and drafts stay out of the public site because a candidate pair is
not a proposal and must not be mistaken for a relationship claim.

## Corpus freeze

A corpus fingerprint is the SHA-256 of the sorted list of
`<slug>:<sha256(meta.json)>:<sha256(body.md)>` lines. Every benchmark, run
record and draft carries the fingerprint it was produced from, together with
the generator version and a SHA-256 over the generator source files, so a
record produced by older code is detectable. `evaluate` refuses a benchmark
whose fingerprint differs from the live corpus; `draft` and `intake` refuse a
run record or draft whose fingerprint, generator version or source hash
differs from the live state.

## Routes

Each route produces its own score and its own evidence for a release pair.
No route is combined into a single credibility number.

1. `citation-overlap`: external references shared by two releases' `relatedWorks`
   lists after URL and DOI normalisation, reusing `normalizeDoiReference` from
   `tools/research-graph.js`. Score is the count of shared references; evidence
   is the shared references.
2. `citation-path`: two releases at undirected graph distance two over the
   accepted direct inter-release edges, ignoring predicate and direction. The
   evidence records `pathType: undirected-distance-two` and the
   intermediaries; the score is their count. Directed patterns (both cite,
   one extends the other's parent) are not distinguished in this pilot. During
   evaluation, hidden benchmark edges are removed from this route's input.
3. `shared-object`: overlap of normalised `keywords` and, where present,
   `mathObjects` identifiers. Declared metadata only; nothing is mined from
   prose. Keywords that label status, genre or production method rather than
   an object (for example `unrefereed candidate`, `computer-assisted
   mathematics`) are excluded by an explicit, tested stop-list. Score is the
   overlap count; evidence lists the shared terms.
4. `lexical`: TF-IDF cosine over `abstract` plus `body.md` with display
   mathematics stripped, inline mathematics stripped, tokens of four or more
   letters, document frequency at least two. Score is the cosine; evidence is
   the ten terms with the largest product contribution. The top `K` is taken
   over eligible pairs only, so a recorded direct pair never consumes a slot.
5. `semantic`: cosine over OpenAI `text-embedding-3-small` vectors of the same
   text clipped to 24,000 characters, enabled only by `--semantic`. Vectors are
   cached outside the repository keyed by model, full-text hash and clipping
   policy; a cached entry is used only if its model, text hash, clipping policy
   and finite numeric contents validate. The run record stores the model, the
   clipping policy and a SHA-256 over all vectors (`semanticProvenance`), and
   states that the route is reproducible only while that hash matches. Top
   `K` is over eligible pairs. If the flag is set and no credential is
   available the run fails; the route is never silently dropped.

Symbolic normalisation is excluded from this pilot. Only 11 of 151 releases
declare `mathObjects`, so there is no reliable formal-object layer to
normalise. The exclusion is recorded here and in the run record's
`routesNotRun` field.

## Candidate assembly

A pair enters the candidate list when any route places it inside that route's
top `K` (default 100) or, for count-based routes, gives a score of at least
one. Pairs that already have a direct inter-release edge are excluded. Each
candidate records:

- the two release identifiers;
- every route's score and evidence, with `null` for a route that gave no
  signal and `not-run` for a disabled route;
- `existingAdjacency`: shared registered cluster or lineage memberships, if
  any, because such pairs carry less new information;
- `rivalExplanation`: the strongest non-relationship explanation, generated
  by a fixed rule table keyed to the evidence pattern and labelled
  `rule-generated`. The rule table is part of the generator and is tested.
- `inferenceLimit`: a fixed statement that a candidate is a retrieval result,
  not a relationship, novelty, priority or dependency claim.

Candidates are ordered by the number of routes giving signal, then by lexical
score, then by slug pair. The ordering is a review aid and is labelled as such.

## Benchmark

`tools/atlas-benchmark.js freeze` imports only the site's graph builder and the
shared text utilities, never the generator. It writes `BENCHMARK.json`
containing:

- `corpusFingerprint`;
- `positives`: every unordered release pair joined by at least one direct
  inter-release edge in the accepted graph at freeze time;
- `hidden`: a deterministic half of the positives, selected by sorting the
  pairs by the SHA-256 of `<fingerprint>:<pairKey>` and taking the first half;
- `negatives`: pairs supplied in a maintainer-confirmed list file.
  `tools/atlas-negatives.js` proposes candidates for that list (high lexical
  similarity, no shared reference, no shared keyword, no shared cluster or
  lineage), but a human confirms each pair before `freeze` accepts it. The
  confirmation time must precede the freeze time; `freeze` refuses otherwise.
  The confirmation is recorded in `freezeProvenance`.

Controls chosen this way carry at most lexical and semantic signal. They
therefore bound the false-proposal burden of those two routes only, and sit
low on the union ordering by construction. The evaluation record says so in
`controlsCaveat`; burden among emitted candidates needs blinded labelling of a
sample, which this pilot does not provide.

The generator reads the benchmark only inside `evaluate`, and only to remove
hidden edges from the `citation-path` input and to score the output. The
benchmark file hash is recorded in the run record.

## Evaluation

`evaluate` reports, per route and for the union ordering:

- recovery of hidden positives at ranks 25, 50 and 100, and the rank of every
  hidden positive (or `absent`);
- the number of negative controls inside ranks 25, 50 and 100, as the
  false-proposal burden proxy;
- the number of candidates emitted.

- a leakage audit: for every hidden pair, whether either member's abstract or
  body names the counterpart explicitly (slug as a whole word, title, short
  title, DOI or release URL). Hiding an edge does not hide such mentions, so
  recovery of a leaking pair may be retrieval of redundant metadata rather
  than discovery under missingness. Recovery is therefore also reported
  restricted to non-leaking hidden pairs (`unionWithoutExplicitMention`).

The run record also carries `reviewerEffort`, a field left `null` by the
generator for a person to fill with time spent and candidates read. The
quantities are never combined into a single score.

## Drafts and intake

Drafting and intake are separate steps with separate clocks. `draft --run
<record under runs/> --pair <slugA>,<slugB>` (or `--group <slugs>`) writes a
draft to `data/atlas-discovery/drafts/`. A draft binds the run record it came
from (path and SHA-256), the generator version and source hash, and a
`proposalTemplate`; it has no proposal identity, no submission time and no
review state. `draft` refuses a run record outside `runs/`, from another
generator version or source, or from another corpus; a pair that is not a
candidate, already has a direct edge, or is a benchmark negative control
(unless `--allow-negative`); and a group containing a negative-control pair.
Group drafts anchor every member but make no programme, lineage or cluster
claim: they ask which member pairs share a formal object.

`intake --draft <file> --submitted-at <ISO UTC>` turns a draft into a full
proposal at the stated submission time, computes the content-derived
identity, and validates it against the schema's field list and the live
proposal validator. It refuses an invalid time, a draft whose run record is
missing or changed, or a stale generator or corpus. It writes under
`drafts/intake/`, never into `data/atlas-proposals/`. The resulting proposal
template has:

- `kind` `relationship-candidate`;
- `submitter.actorType` `agent`, naming the generator, its version, the run
  file and the corpus fingerprint in `provenanceNote`;
- `atlasAnchors`: both release nodes, with the route evidence as the basis;
- `sourceRefs`: both release URLs and the run record path;
- `priorArtStatus` `not-started`; all three assessments `unassessed`;
- `cheapFalsifier`: read the two technical accounts and check whether the
  shared terms or references name the same mathematical object or the same
  dependency;
- `riskFlags` including `route-derived-candidate` and `rival-explanation-untested`;
- at intake, `currentState` `awaiting-review`, no receipts, and `proposalId`
  computed with `expectedProposalId` from `tools/atlas-proposals.js`.

An intake proposal enters the live register only when a maintainer moves it
into `data/atlas-proposals/` and publishes through the normal gate. The
generator and the agent that runs it do not review their own candidates into
the register.

## Deterministic gates

`node tools/test-atlas-discovery.js` verifies:

- two runs on the same corpus produce byte-identical records once the
  `generatedAt` field is removed (non-semantic routes; the semantic route is
  covered by its provenance hash);
- every output path is confined: a repository path outside
  `data/atlas-discovery/`, or a symlink resolving back into the repository, is
  refused;
- the benchmark module does not import the generator, and its independent
  positive extraction agrees with the generator's direct pairs;
- the freeze refuses a confirmation time after the freeze time;
- lexical and semantic top-K are taken over eligible pairs only;
- the leakage audit detects explicit counterpart mentions;
- a draft has no identity, submission time or review state; intake produces a
  proposal that passes the live validator; drafts refuse run records outside
  `runs/`, from another generator version or corpus, or whose bytes changed;
- group drafts apply the negative-control gate to every member pair and make
  no programme, lineage or cluster claim;
- the benchmark fingerprint matches the live corpus, and `evaluate` rejects a
  stale benchmark;
- hidden positives are absent from the `citation-path` input during evaluation
  and every hidden positive appears in the positives list;
- every candidate carries every route field, `existingAdjacency`,
  `rivalExplanation` and `inferenceLimit`;
- every rule in the rival-explanation table is reachable by at least one
  synthetic evidence pattern;
- an intake proposal validates with `validateProposal` against the live
  policy and graph;
- the generator source contains no write to `RELATIONSHIP_REGISTRY.json`,
  `METHOD_REGISTRY.json`, `papers/` or `data/atlas-proposals/`;
- a negative-control pair is never written as a draft without an explicit
  `--allow-negative` flag, which exists only for testing the gate.

The existing `test-research-graph.js` invariants continue to reject proposed
edges in the accepted array.

## Stop conditions, carried from the roadmap

- Stop if the benchmark cannot be frozen independently of the generator.
- Stop if candidate generation cannot be isolated from accepted graph
  production.
- Stop or narrow the route if review burden outweighs useful recoveries.

## What the pilot does not establish

Recovery of hidden recorded links shows that a route can find links of the
kind already recorded, and only for pairs the leakage audit does not flag.
At the first evaluation (14 October 2026) 7 of 16 hidden pairs named their
counterpart explicitly; on the 9 that did not, the union ordering recovered 5
at rank 25, 7 at rank 50 and 8 at rank 100. The pilot does not show that a
route finds links of other kinds, that a surfaced pair is a real dependency,
that the negative controls bound burden among unlabelled candidates, or that
the Atlas reduces research cost. Those remain hypotheses in the IBE ledger
under `open-evidence-reuse`.
