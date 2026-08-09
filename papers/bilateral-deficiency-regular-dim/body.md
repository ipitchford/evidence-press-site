## Summary

The earlier [TxGraffiti Conjecture 15/3 release](https://evidencepress.org/releases/txgraffiti-c3-resolution/) presented a connected cubic graph with independent domination number 16 and minimum maximal matching number 15. This child candidate asks what structural quantity measures that one-unit gap and how far the phenomenon extends.

Its answer is **bilateral deficiency**, an optimization parameter for Boolean formulas. A partial assignment is allowed to leave a variable undecided only when both signs of that variable still occur in the surviving clauses. The parameter balances the number of surviving clauses against the number of undecided variables.

The candidate proves that this residual-SAT quantity exactly measures the gap

\[
i(G)-\mu^*(G)
\]

for finite simple regular graphs **equipped with a dominating induced matching**. It constructs connected cubic-DIM families whose gap grows linearly and proves that order 50 is minimum inside that cubic-DIM class. It does not claim that 50 is minimum among all cubic graphs.

> **Status: anonymous, unrefereed candidate.** Producer-side replay passes, and Lean checks identified finite certificates and a finite terminal table. No journal submission, external specialist review, unaffiliated rerun or independent reimplementation has occurred. The universal mathematical theory is not fully formalized.

This release is a new immutable child, archived under [doi:10.5281/zenodo.21857209](https://doi.org/10.5281/zenodo.21857209). It does not modify the [parent archive at doi:10.5281/zenodo.21852504](https://doi.org/10.5281/zenodo.21852504).

## Summary for specialists

For an indexed CNF formula \(F\), let \(T_F(\alpha)\) be the surviving indexed clauses under a partial assignment \(\alpha\), and let \(U(\alpha)\) be its unassigned variables. The assignment is bilateral when every variable in \(U(\alpha)\) occurs in both signs in the residual formula. The proposed parameter is

\[
\beta(F)=\min_{\alpha\text{ bilateral}}
\bigl(|T_F(\alpha)|-|U(\alpha)|\bigr).
\]

The candidate gives this definition an intrinsic bipolar-residual interpretation and proves a size-preserving bijection between bilateral assignments and independent dominating sets of the associated formula graph. In particular,

\[
i(G(F))=|V(F)|+\beta(F),
\]

with the corresponding complete solution-polynomial identity. The paper develops additivity, width lifting, replication, MaxSAT recovery, separations from familiar deficiency notions, the width-two identity, fixed-uniform-width complexity, and a bounded-treewidth route.

For a finite simple \(d\)-regular graph supplied with a dominating induced matching, the coordinatisation yields

\[
i(G)-\mu^*(G)=\beta(F_M).
\]

A constructive replacement argument proves

\[
i(G)\le \mu^*(G)+
\left\lfloor\frac{2(d-1)}{d2^d}\mu^*(G)\right\rfloor.
\]

At \(d=3\), this becomes \(i(G)\le\mu^*(G)+\lfloor\mu^*(G)/6\rfloor\). A connected edge-cover amplifier maps every connected cubic skeleton \(R\) to an exact signed-occurrence \((3,2,2)\) formula satisfying

\[
\beta(A(R))=\rho(R)=|V(R)|-\nu(R).
\]

The transferred O--West equality family gives asymptotic gap density \(1/72\), sharp only within this amplifier construction. The imported 20-clause bound of Zhang, Peitl and Szeider, together with the exact incidence counts, yields minimum order 50 among finite simple cubic graphs admitting a dominating induced matching and satisfying \(i(G)>\mu^*(G)\).

## Technical and assurance summary

The universal results rest on the manuscript's written proofs and three typed external dependencies. The finite package adds multiple, deliberately separated checks:

- 25 tests under ordinary Python and 25 under optimized Python;
- a warnings-enabled exact C++ implementation and four algebraic benchmark packages;
- three named threshold CNFs with four native LRAT derivations and three direct Lean LRAT paths;
- a parser-independent Lean decision proof of the enforcer's exact four-row terminal signature over all \(3^8=6{,}561\) partial assignments;
- a standard-library clean-room reconstruction of the 731-variable, 9,256-clause threshold encoding, plus a seven-formula semantic corpus and mutation rejection; and
- a 1,171,146,459-byte lossless Zstandard transport of the optional 5,793,599,477-byte connected-switch LRAT proof object, with SHA-256 recorded for both the transport and recovered stream.

These checks establish the recorded finite propositions and implementation behaviour at their declared interfaces. They do not fully formalize the bilateral-deficiency theory, the general amplifier, the formula-to-CNF compiler, the imported theorems, or every file-to-proposition bridge. The clean-room encoder is implementation-separated inside the producer workflow; it is not an unaffiliated reproduction.

## What the result does not establish

- It does not show that order 50 is minimum among all cubic graphs; the theorem is restricted to cubic graphs admitting a dominating induced matching.
- It does not determine the exact cubic-DIM extremal constants.
- It does not classify all order-50 cubic-DIM extremisers.
- It does not settle the sign problem on proper simple exact signed-occurrence \((3,2,2)\)-CNF.
- It does not establish global novelty or priority; the prior-art search is bounded, and the closest cost decomposition is credited to Chlebik and Chlebikova.
- It does not supply an unaffiliated rerun, an independent reimplementation, complete proof-assistant formalization, external specialist review, journal submission or editorial peer review.

## Relationship to the parent release

The parent release supplies the motivating 50-vertex cubic graph and its certificate-backed invariant values. This child develops a broader residual-SAT parameter, a formula-graph bijection, algebraic and complexity results, the regular-DIM coordinate, connected amplification and the DIM-qualified minimum-order theorem.

The distinction is archival as well as mathematical. The [parent Evidence Press page](https://evidencepress.org/releases/txgraffiti-c3-resolution/) and [parent DOI record](https://doi.org/10.5281/zenodo.21852504) remain unchanged. Any later review, formalization, correction or independent reproduction should likewise be published as a separately identified related record rather than silently changing this candidate.

## Who should care, and why

| Likely audience | What should interest them | Highest-value next check or use |
|---|---|---|
| SAT and deficiency researchers | A residual optimization domain distinct from ordinary and maximum deficiency, together with algebraic operations and a width-sensitive complexity boundary. | Audit the closest-prior-art boundary and resolve the exact signed-occurrence \((3,2,2)\) sign problem. |
| Graph theorists | An exact gap coordinate and replacement bound for regular graphs supplied with a DIM, plus connected cubic constructions. | Reconstruct the coordinatisation and classify the order-50 cubic-DIM extremisers. |
| Proof-certificate and formal-methods researchers | Native and Lean LRAT paths, a finite Lean terminal theorem, and explicitly exposed translation boundaries. | Formalize the universal bijection and independently validate the formula-to-CNF bridge. |
| Reproducible-mathematics auditors | A layered core/extended artifact, fresh-extraction transcript, hashes, mutation control and machine-readable claims. | Rerun the immutable package unaffiliated with the producer workflow and publish exact objections or receipts. |

## How to reproduce the core checks

The compact package, manuscript, supplement, checksums and producer-side fresh-extraction transcript are attached to the [v1.0.1-candidate GitHub release](https://github.com/ipitchford/bilateral-deficiency/releases/tag/v1.0.1-candidate). Verify the release checksums, extract the core ZIP into a new directory, and begin with:

```sh
python3 -m unittest discover -v
python3 -O -m unittest discover -v

c++ -std=c++17 -O2 -Wall -Wextra -pedantic bd_exact.cpp -o bd_exact
./bd_exact instances/txgraffiti_15_20.cnf

make -C third_party/drat-trim lrat-check drat-trim
python3 verify_positive_base_proof.py --receipt receipts/positive-base-proof-verification.json
python3 verify_enforcer_composition_proof.py --receipt receipts/enforcer-composition-proof-verification.json
python3 verify_threshold_encoding_cleanroom.py \
  instances/txgraffiti_15_20.cnf \
  proof/positive-base-beta-le-0.cnf \
  proof/positive-base-encoding-map.json \
  --receipt receipts/threshold-encoding-cleanroom-validation.json
lean --run lean_terminal_signature.lean
```

The [tagged CI run](https://github.com/ipitchford/bilateral-deficiency/actions/runs/31297291063) passed the declared compact workflow. It is producer-side replay infrastructure, not evidence of independent mathematical verification.

## The most valuable next projects

1. Determine the exact cubic-DIM extremal constants \(C_3^{\mathrm{DIM}}\) and \(\lambda_3^{\mathrm{DIM}}\).
2. Resolve the proper simple exact signed-occurrence \((3,2,2)\)-CNF sign problem.
3. Classify all order-50 cubic-DIM extremisers and test uniqueness of the motivating graph inside that class.
4. Search for smaller counterexamples outside the DIM class.
5. Improve the amplifier itself: changing only the cubic skeleton cannot improve the construction-specific \(1/72\) density.
6. Independently reconstruct the mathematical proof and encoding bridge, extend the prior-art audit, and formalize the universal core in a proof assistant.

## What is in the evidence package

- the 22-page manuscript and 8-page reproducibility supplement;
- exact residual, graph, exhaustive and structural implementations;
- generated formulas, witnesses, threshold encodings and compact LRAT certificates;
- native checker sources and direct Lean wrappers;
- the hard-coded Lean terminal-signature theorem;
- the clean-room threshold-encoding validator and semantic corpus;
- typed dependency, claim, assurance, provenance, environment and integrity records;
- package-wide and release-asset SHA-256 inventories;
- a fresh-extraction replay transcript; and
- a separately archived lossless Zstandard transport of the optional 5.79 GB LRAT proof, together with recovery instructions, its manifest, and both transport and recovered-object hashes.

The downloadable package retains its split licence: original prose, data and figures are CC BY 4.0; original code is MIT; third-party material retains its upstream terms. The Evidence Press page and machine-readable site records use the site's CC0 terms and do not override the package licences. Scholarly attribution is Anonymous; Ian Pitchford acts only as maintainer and publisher.
