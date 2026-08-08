## In one minute

This release presents a candidate counterexample to the TxGraffiti Conjecture 15/3. It gives a connected cubic graph (G) on 50 vertices for which

\[
\mu^*(G)=15<16=i(G),
\]

where \(\mu^*(G)\) is the minimum cardinality of a maximal matching and \(i(G)\) is the independent domination number. Under the stated interpretation, the proposed inequality fails.

The package also develops an exact formula-graph identity in terms of bilateral deficiency and a conditional order threshold for the narrower class of cubic graphs with a dominating induced matching.

> **Status: unrefereed candidate.** The exact release has not been independently rerun, independently reimplemented, formally verified, or conventionally peer reviewed. Producer-side replay, repository CI and a pinned core-container replay pass, but these are not independent theorem verification.

## What is actually archived

The [Zenodo version record](https://doi.org/10.5281/zenodo.21852504) contains the exact 501,300-byte release ZIP, identified locally by SHA-256 `94518c6473420d7c048d2381f15aa31f50f802554381883f7be88ad7eb5b331e`. The [GitHub repository](https://github.com/ipitchford/txgraffiti-conjecture3-resolution) provides the navigable source tree and the [v4.0.0-rc1 release](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/releases/tag/v4.0.0-rc1) provides the manuscript, evidence supplement, archive and sidecar hash.

Start with:

- [bounded status and core hashes](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/blob/v4.0.0-rc1/STATUS.md);
- [candidate manuscript PDF](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/releases/download/v4.0.0-rc1/MANUSCRIPT.pdf);
- [evidence supplement PDF](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/releases/download/v4.0.0-rc1/EVIDENCE_SUPPLEMENT.pdf);
- [AI navigation index](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/blob/v4.0.0-rc1/AI_INDEX.md);
- [assurance record](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/blob/v4.0.0-rc1/ASSURANCE.json);
- [replay workflow](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/blob/main/REPLAY_CONTAINER_2026-08-08.md).

## How to check it

The lowest-cost audit is to download the archive, verify its SHA-256 sidecar, extract it, and run `./run_core_verification.sh`. The repository workflow also runs the manifest and metadata gates, the core replay, and the optimized replay. The pinned core container has been built and replayed by the publisher; the optional MILP audit is not part of the theorem-critical gate because its lockfile pins Linux x86_64 wheels and the publisher host is Apple silicon.

The assurance boundary matters. A passing deterministic checker establishes what that checker establishes about the supplied object. It does not by itself establish that the graph-to-claim semantic bridge is correct, that the external conditional input is sound, that the graph is globally minimal, or that the result is novel.

## Scope and attribution

The graph itself is a public predecessor object, and the release makes no claim of first discovery or secured priority. The release contributors’ work is distinguished in `PROVENANCE.md` between pre-existing construction, AI-assisted synthesis, programmatic verification and editorial integration. The supplied package’s licence terms are retained: original prose, data and illustrations are CC BY 4.0; original source code is MIT; third-party and source-derived material is excluded as described in `LICENSE.md`.

The most useful next work is an exact-v4 independent rerun, a fresh implementation of the graph checks, a specialist audit of the bilateral-deficiency identity and conditional threshold, and a broad prior-art search. A future correction or superseding release should receive its own version DOI and should not silently rewrite this candidate record.
