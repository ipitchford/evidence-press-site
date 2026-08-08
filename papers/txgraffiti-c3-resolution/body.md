## Summary

The TxGraffiti Conjecture 15/3 proposes that, for a finite positive-degree regular graph, the independent domination number should not exceed the minimum cardinality of a maximal matching. This release presents a candidate counterexample: a connected cubic graph (G) on 50 vertices with

\[
\mu^*(G)=15<16=i(G),
\]

where \(\mu^*(G)\) is the minimum size of a maximal matching and \(i(G)\) is the independent domination number.

The package also develops an exact identity for a class of formula-incidence graphs, expressed through minimum bilateral deficiency, and a conditional order threshold for cubic graphs with a dominating induced matching. Those companion results explain why the counterexample has the structure it does; they do not turn the release into a global minimality or novelty claim.

> **Status: unrefereed candidate.** The theorem-critical deterministic checks pass in the recorded environment, from a clean extracted copy, in the pinned core container, and in GitHub Actions. The exact release has not been independently rerun, independently reimplemented, formally verified, or conventionally peer reviewed.

## Summary for specialists

The canonical object is a connected 3-regular graph with 50 vertices and 75 edges, supplied in JSON, graph6 and edge-list encodings. The release gives an explicit independent dominating set of size 16 and proves that no independent dominating set of size at most 15 exists. Its matching witness has size 15 and is maximal, producing the strict inequality.

The lower-bound side is checked in two complementary ways: a proof-tree certificate is checked from the raw graph, and an exhaustive enumeration uses the exact formula-graph identity. The identity relates independent domination to bilateral deficiency rather than to ordinary formula unsatisfiability, because mixed literal/clause independent sets must also be excluded. A conditional 20-clause input then yields a restricted order threshold for the dominating-induced-matching subclass.

The graph itself is a public predecessor object. This release integrates it with the corrected identity, the structural threshold statement, explicit assurance records, a pinned container definition and a reproducible evidence package; it does not claim first discovery or secured priority.

## Technical summary

The evidence package records the graph and all theorem-critical witnesses under SHA-256 hashes. The dependency-free core verifier checks cubicity, connectivity, the matching witness, the independent-dominating witness, and the certificate-derived lower bound. The compressed proof tree is checked from the supplied graph rather than trusted as a textual assertion. Normal and optimized replay both pass from a clean extracted copy.

The publisher also built the declared core container on Apple silicon and replayed the core checks. The repository workflow repeats the manifest, metadata, core and optimized checks on GitHub Actions. The optional mixed-integer audit is not part of the theorem-critical gate: its lockfile pins Linux x86_64 wheels, whereas the publisher host is Apple silicon.

The exact logical boundary is important. A successful checker establishes the properties encoded by that checker for the supplied object. It does not, by itself, prove the graph-to-CNF semantic bridge, validate the cited conditional 20-clause theorem, establish global order-50 minimality, establish uniqueness, or establish literature novelty.

## What the result does not establish

- It does not prove that 50 is the smallest order of a cubic or regular counterexample.
- It does not prove that the supplied graph is unique, canonical, or the first such object discovered.
- It does not establish secured theorem priority for the bilateral-deficiency identity.
- It does not provide an exact-release independent rerun or independent reimplementation.
- It does not provide an end-to-end proof-assistant formalization or conventional peer review.
- The restricted order threshold is conditional on the external 20-clause theorem named in `THEOREM_DEPENDENCY.md`.

## Who should care, and why

| Likely audience | What should interest them | Highest-value check or use |
|---|---|---|
| Graph theorists | A concrete cubic counterexample separating independent domination from minimum maximal matching. | Recompute the two graph invariants from the canonical edge list and inspect the witnesses. |
| Combinatorics researchers | The bilateral-deficiency identity and its formula-incidence graph construction. | Audit the mixed-set argument and search for a broader or earlier formulation. |
| SAT and proof-certificate researchers | A compact proof-tree certificate checked from the raw graph, with an exact enumeration route as a second check. | Replay the certificate and test the graph-to-certificate semantic bridge independently. |
| AI-assisted mathematics auditors | A machine-readable candidate with explicit provenance, assurance dimensions, replay commands and open objections. | Use `AI_INDEX.md`, `CLAIMS.json` and `ASSURANCE.json` to route an independent audit without treating the result as settled. |

## How to reproduce the core check

Download the [exact Zenodo archive](https://doi.org/10.5281/zenodo.21852504), verify the SHA-256 sidecar, and extract it into a fresh directory. The theorem-critical path is:

```sh
./run_core_verification.sh
```

The [GitHub Actions replay](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/actions/runs/31263798738) shows the same core and optimized checks from an extracted package. The [publisher container receipt](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/blob/main/REPLAY_CONTAINER_2026-08-08.md) records the base and image digests; it is a publisher-side replay, not an independent reproduction.

## The most valuable next projects

1. Re-run the exact v4 archive independently, beginning with the dependency-free verifier and proof-tree checker.
2. Implement the graph checks and bilateral-deficiency identity in a fresh language or codebase.
3. Audit the semantic bridge between the graph statement, formula-incidence construction and certificate.
4. Search books, theses, databases and adjacent terminology for prior appearances of the identity or inequality.
5. Determine whether any cubic or regular counterexample exists below order 50 and whether the supplied object is unique.
6. Formalize the exact identity and restricted threshold in a proof assistant.

## What is in the evidence package

- `MANUSCRIPT.pdf` and its TeX/source materials;
- `EVIDENCE_SUPPLEMENT.pdf` with the proof architecture and replay boundary;
- `counterexample.json`, `counterexample.g6` and `counterexample.edgelist`;
- explicit matching and independent-domination witnesses;
- `ids_le15.tree.gz` and the deterministic proof-tree checker;
- `CLAIMS.json`, `ASSURANCE.json`, `AI_INDEX.md`, `STATUS.md` and `PROVENANCE.md`;
- `MANIFEST.sha256`, the pinned `environment/Containerfile` and replay scripts;
- the supplied review, review response, sources and dependency records.

The package's licence terms are retained: original prose, data and illustrations are CC BY 4.0; original source code is MIT; third-party and source-derived material is excluded as described in `LICENSE.md`. Evidence Press page content and machine-readable records are public-domain site material; that site licence does not override the downloadable package's split terms.
