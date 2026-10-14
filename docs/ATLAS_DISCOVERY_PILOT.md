# Evidence Atlas: bounded relationship-discovery pilot

Status: design adopted 14 October 2026; implementation in progress
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
| `tools/atlas-benchmark.js` | Freezes the benchmark from the accepted graph and a human-confirmed negative-control list. Never called by the generator. |
| `tools/atlas-discovery.js` | Generator with `run`, `evaluate` and `draft` subcommands. Dependency-free CommonJS. |
| `tools/test-atlas-discovery.js` | Deterministic gates listed below. |
| `data/atlas-discovery/BENCHMARK.json` | Frozen corpus fingerprint, positive pairs, hidden subset, negative controls, freeze provenance. |
| `data/atlas-discovery/runs/<date>-<corpus-hash>.json` | One run record per corpus state. Repository-only; not built into `dist/`. |
| `data/atlas-discovery/drafts/` | Draft proposals written by `draft`. Not loaded by the build. |

Run records and drafts stay out of the public site because a candidate pair is
not a proposal and must not be mistaken for a relationship claim.

## Corpus freeze

A corpus fingerprint is the SHA-256 of the sorted list of
`<slug>:<sha256(meta.json)>:<sha256(body.md)>` lines. Every benchmark, run
record and draft carries the fingerprint it was produced from. `evaluate`
refuses a benchmark whose fingerprint differs from the live corpus.

## Routes

Each route produces its own score and its own evidence for a release pair.
No route is combined into a single credibility number.

1. `citation-overlap`: external references shared by two releases' `relatedWorks`
   lists after URL and DOI normalisation, reusing `normalizeDoiReference` from
   `tools/research-graph.js`. Score is the count of shared references; evidence
   is the shared references.
2. `citation-path`: two releases that both cite, extend or reuse a third
   release in the accepted graph (two-hop paths over direct inter-release
   edges). Score is the number of distinct intermediaries; evidence names them.
   During evaluation, hidden benchmark edges are removed from this route's
   input.
3. `shared-object`: overlap of normalised `keywords` and, where present,
   `mathObjects` identifiers. Declared metadata only; nothing is mined from
   prose. Score is the overlap count; evidence lists the shared terms.
4. `lexical`: TF-IDF cosine over `abstract` plus `body.md` with display
   mathematics stripped, inline mathematics stripped, tokens of four or more
   letters, document frequency at least two. Score is the cosine; evidence is
   the ten terms with the largest product contribution.
5. `semantic`: cosine over OpenAI `text-embedding-3-small` vectors of the same
   text, enabled only by `--semantic`. Vectors are cached outside the
   repository under the user cache directory keyed by model and text hash. The
   run record stores the model identifier and per-pair scores. If the flag is
   set and no credential is available the run fails; the route is never
   silently dropped.

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

`tools/atlas-benchmark.js freeze` writes `BENCHMARK.json` containing:

- `corpusFingerprint`;
- `positives`: every unordered release pair joined by at least one direct
  inter-release edge in the accepted graph at freeze time;
- `hidden`: a deterministic half of the positives, selected by sorting the
  pairs by the SHA-256 of `<fingerprint>:<pairKey>` and taking the first half;
- `negatives`: pairs supplied in a maintainer-confirmed list file. The script
  proposes candidates for that list with `propose-negatives` (high lexical
  similarity, no shared reference, no shared keyword, no shared cluster or
  lineage), but a human confirms each pair before `freeze` accepts it. The
  confirmation is recorded in `freezeProvenance`.

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

The run record also carries `reviewerEffort`, a field left `null` by the
generator for a person to fill with minutes spent and candidates read. The
three quantities are never combined into a single score.

## Draft proposals

`draft --run <file> --pair <slugA>,<slugB>` writes a schema-valid record of
kind `relationship-candidate` to `data/atlas-discovery/drafts/`:

- `submitter.actorType` `agent`, naming the generator, its version, the run
  file and the corpus fingerprint in `provenanceNote`;
- `atlasAnchors`: both release nodes, with the route evidence as the basis;
- `sourceRefs`: both release URLs and the run record path;
- `priorArtStatus` `not-started`; all three assessments `unassessed`;
- `cheapFalsifier`: read the two technical accounts and check whether the
  shared terms or references name the same mathematical object or the same
  dependency;
- `riskFlags` including `route-derived-candidate` and `rival-explanation-untested`;
- `currentState` `awaiting-review`, no receipts;
- `proposalId` computed with `expectedProposalId` from `tools/atlas-proposals.js`,
  so the draft validates with the existing proposal validator.

A draft enters the live register only when a maintainer moves it into
`data/atlas-proposals/` and publishes through the normal gate.

## Deterministic gates

`node tools/test-atlas-discovery.js` verifies:

- two runs on the same corpus produce byte-identical records once the
  `generatedAt` field is removed;
- the benchmark fingerprint matches the live corpus, and `evaluate` rejects a
  stale benchmark;
- hidden positives are absent from the `citation-path` input during evaluation
  and every hidden positive appears in the positives list;
- every candidate carries every route field, `existingAdjacency`,
  `rivalExplanation` and `inferenceLimit`;
- every rule in the rival-explanation table is reachable by at least one
  synthetic evidence pattern;
- a draft produced from a run validates with `validateProposal` against the
  live policy and graph;
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
kind already recorded. It does not show that a route finds links of other
kinds, that a surfaced pair is a real dependency, or that the Atlas reduces
research cost. Those remain hypotheses in the IBE ledger under
`open-evidence-reuse`.
