## Summary

**The question.** A polynomial can share a root with one derivative without anything unusual happening. The Casas–Alvero conjecture asks what happens when a polynomial shares a root with **every** proper derivative — the first, the second, and so on up to the last nonconstant one. In characteristic zero (for example over the rational or complex numbers), the conjectured answer is that this can only happen in the obvious way: all the roots are the same, so the polynomial is a power of a single linear factor.

**What this release does.** It studies degree twenty and asks how *sparse* a counterexample could be — how few nonzero terms it could have. After a specific normalisation (moving the root of the nineteenth derivative to zero), it rules out every possible counterexample with seven or fewer nonzero terms. Any nontrivial degree-twenty counterexample would therefore need **at least eight terms**, including the leading term.

**What it does not do.** The full degree-twenty conjecture is not settled, and the general conjecture is not touched. Denser polynomials remain possible counterexamples as far as this paper is concerned, and the bound is not claimed to be sharp.

**Status.** An anonymous, AI-assisted, unrefereed candidate: a written proof supported by exact finite computations that can be rerun. It has had internal editorial review only; there is no journal peer review, specialist examination or formal verification.

## Summary for specialists

Let $f$ be a nontrivial characteristic-zero Casas–Alvero polynomial of degree twenty. Translate the root of $f^{(19)}$ to zero and make $f$ monic. Writing
$$
f(X)=X^{20}+\sum_{j\in S}c_jX^{20-j},\qquad c_j\ne0,
$$
the candidate theorem (Theorem 1) gives $1+\lvert S\rvert\ge8$. Here $S\subseteq\{2,\ldots,19\}$ consists of deficiency indices, not exponents. An arbitrary translation need not preserve the bound.

Published arithmetic restrictions leave fourteen exact seven-term supports. The complete characteristic-seventeen classification leaves nineteen compatible support/seed cases, and every one is excluded. Coefficients may be nonzero while reducing to zero, and arbitrary finite ramification is allowed.

| Result | Role |
|---|---|
| Theorem 1 (eight-term bound) | Main result; uses Appendix A for six or fewer terms and the complete fourteen-support cover for seven terms |
| Theorem 2 (uniform obstruction with unit coefficient $a_{16}$) | Excludes a degree-twenty residue stratum at the prime seventeen, uniformly in coefficient choices within that stratum (not across degrees) |
| Lemma 3 (unit-Jacobian precision) | Transfers finite precision to arbitrarily ramified candidates |
| Lemma 4 (separated-cluster collapse) | Collapses a separated cluster of $m$ roots exactly, given all derivative witnesses through $m-1$ and the residue-field Casas–Alvero property in degree $m$; applied with $m=4$ in residue characteristic seventeen |
| Appendix A | The earlier exclusion of six or fewer terms, retained in full, including a characteristic-thirteen calculation for the last six-term family |

## Technical account

**From all supports to fourteen.** The proof combines exact finite calculations with arguments about actual roots. With a nonzero linear coefficient forced by the mean-root restriction, there are $\binom{17}{5}=6188$ candidate seven-term supports. Singleton visibility tests at the primes $2,3,5,7,11,13,17,19$ leave 586; the two-visible-coefficient test leaves 348; and the Castryck–Laterveer–Ounaïes determinant condition modulo 19 leaves fourteen. The final fourteen-support enumeration is reproduced independently and does not require an extra support filter present in historical code.

**From fourteen supports to nothing.** The important step is not merely finding no solutions in a finite field: a hypothetical characteristic-zero solution must be shown to enter one of the checked cases. A nonempty special fibre is not itself evidence of a counterexample, and a search for lifts in an unramified ring need not cover all candidates. The proofs instead control every actual common-root witness through valuations, multiplicities and exact integer identities, and no exact coefficient is inferred to vanish merely because its residue vanishes.

**Three reusable mechanisms.**

- *A uniform second-jet obstruction (Theorem 2).* In one residue stratum, a common derivative root is forced to equal a repeated root, and their next nonzero jets are incompatible. This works while allowing all intermediate coefficient positions to be active.
- *A quadratic obstruction.* A shared second-order calculation excludes two quadratic-coefficient families by a nonsquare discriminant, with the precision justified by a unit Jacobian (Lemma 3).
- *A separated-cluster collapse (Lemma 4).* If a separated cluster of $m$ roots contains a common witness for every Hasse derivative of orders one through $m-1$, and the degree-$m$ Casas–Alvero property holds over the residue-field closure, then the roots in that cluster coincide exactly. Otherwise, rescaling their largest internal separation gives a forbidden nontrivial degree-$m$ polynomial. The paper applies this with four roots in residue characteristic seventeen, after which a simple-root lift has a nonzero residual. Its application depends on the complete valuation and occupancy analysis; the existence of a cluster alone would not suffice.

These tools are classical; the proposed contribution is the complete degree-twenty exclusion and its specific local arguments, not the introduction of reduction modulo a prime, Hensel lifting or Newton polygons. Uniformity of one coefficient-stratum theorem does not mean uniformity across degrees.

**A worked example.** The seven-term support $S=\{2,4,10,17,18,19\}$ would allow powers $20,18,16,10,3,2,1$. It has three compatible seed cases before an exact-zero restriction. The proof covers all three; it does not select only coefficients with nonzero residues. The cover graphic shows the term-count boundary schematically, not a numerical root plot.

## Evidence, assurance and limitations

- **What is checked.** The package contains the written proof, all required finite inputs and checkers, and a complete support-to-proof map. The revised primary runner executes sixteen checks in normal and optimized Python, including the previously omitted census of 1,216 row-8 assignments. Its thirty-two executions pass locally. The inherited runner passes twenty-seven checks with optional SymPy installed, or twenty-six with that named omission explicitly recorded. Deliberately corrupted domains, support inventories and arithmetic claims are rejected.
- **What the checks mean.** These are producer-side checks. A successful replay establishes the specified arithmetic claims and does not replace the mathematical coverage and lifting arguments; a file hash proves that bytes were preserved, not that a theorem is true.
- **Review.** Internal editorial roles, reported external review activity, exact hashes and a DOI do not establish formal verification or journal peer review. The latest supplied review's linked audit ZIP was unavailable at intake, so its reported reproduction is not silently promoted to authenticated external assurance.
- **Scope.** The theorem does not establish sharpness or an eight-term counterexample, and it does not settle the other dense strata, the unrestricted degree-twenty conjecture or arbitrary degree. Partial supplementary results (a marked-resultant factorization and 79 of 240 row-9 systems) remain partial at their original scopes; the theorem does not need them and does not claim completion of all 240 systems.

## Relationship to earlier work

Castryck, Laterveer and Ounaïes supply the mean-root and missing-index determinant restrictions. De Frutos Marín supplies older sparse-support criteria; their combination with the published restrictions already gives a weaker five-term bound, which is not claimed as new. Massri's degree-twenty result concerns three recycled roots, which is a different invariant. Marashdeh provides related support reductions. Ghosh's March 2026 preprint claims the full conjecture; this paper does not use it as a premise. An objection to a positive-characteristic auxiliary claim does not itself refute a characteristic-zero conclusion.

The bounded comparison found no exact predecessor for the eight-term theorem. Equivalence with some reported systems and an unavailable thesis remain unresolved, so unconditional priority is not claimed.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraists studying Casas–Alvero | Inspect a complete sparsity-class exclusion | The unrestricted degree-twenty problem remains outside this result |
| Computer-algebra researchers | Reproduce the finite identities and support cover | The encoded calculation needs its written mathematical transfer |
| Researchers using valuations | Examine the separated-cluster and precision arguments | Retain every witness and residue-field hypothesis |
| Formalization researchers | Identify bounded components for certified checking | The current package is not a proof-assistant formalization |

## Why the problem matters

A sparsity theorem restricts the shape of any possible counterexample and supplies concrete local obstructions that another argument may reuse — for instance, the separated-cluster argument shows one way to use a good small degree inside a bad larger degree. It is useful only if the exclusions cover the entire stated class. Fourteen supports and nineteen cases are bookkeeping counts, not a percentage of progress toward the full conjecture.

## How to inspect or reproduce the recorded checks

Extract the versioned archive and use Python 3.10 or later. The primary runner needs only the standard library; the inherited runner also needs a C++ compiler, with SymPy optional for one historical cross-check.

```sh
python3 -B replay.py --integrity-only
python3 -B replay_new.py --output ../new-replay
python3 -B replay.py --output ../inherited-replay
python3 -B test_publication.py
```

Read the actual omission list and scope in each receipt. The optional large historical census is not a dependency of the eight-term theorem. For reading, start with `REVIEW_GUIDE.md`, then the final assembly audit of all fourteen supports and nineteen cases.

## The most valuable next projects

1. **Specialist examination** of the normalization and ramification arguments, alongside a separately implemented replay of their finite inputs.
2. **Further strata.** Determine which additional degree-twenty strata can be excluded while allowing arbitrary ramification. Extending the theorem would require new obstructions for denser centered supports; the current eight-term bound gives no guarantee that those cases are tractable.
3. **Reuse of the cluster lemma.** Test further applications of the separated-cluster lemma with every derivative-witness hypothesis retained.

## What is in the evidence package

Start with `AI_INDEX.md` and the numbered statements in `PAPER.pdf`. The structural map identifies the main theorem, uniform stratum obstruction, precision lemma and cluster lemma. `research/next-stage/coverage/` routes every support/seed case. `new-results/check_row8_seven_term.py` checks the complete small census. The package also includes source files, certificates, current replay logs, internal editorial records and a revision response. Historical work, including the superseded earlier seven-term paper, remains labelled separately from the current candidate.
