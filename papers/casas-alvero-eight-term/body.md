## Summary
A polynomial can share a root with one derivative without anything unusual happening. The Casas–Alvero conjecture asks what happens when it shares a root with **every** proper derivative. In characteristic zero, the conjectured answer is that all its roots must be the same.

This candidate studies degree twenty and rules out counterexamples with seven or fewer nonzero terms after a specific centering. Any nontrivial counterexample would need **at least eight terms**, including the leading term. The full degree-twenty conjecture is not settled.

## Summary for specialists
Let $f$ be a nontrivial characteristic-zero Casas–Alvero polynomial of degree twenty. Translate the root of $f^{(19)}$ to zero and make $f$ monic. Writing
$$f(X)=X^{20}+\sum_{j\in S}c_jX^{20-j},\qquad c_j\ne0,$$
the candidate theorem gives $1+|S|\ge8$. Here $S\subseteq\{2,\ldots,19\}$ consists of deficiency indices, not exponents. An arbitrary translation need not preserve the bound.

Published arithmetic restrictions leave fourteen exact seven-term supports. The complete characteristic-seventeen classification leaves nineteen compatible support/seed cases, and every one is excluded. Coefficients may be nonzero while reducing to zero, and arbitrary finite ramification is allowed.

## Technical account
The proof combines exact finite calculations with arguments about actual roots. The important step is not merely finding no solutions in a finite field: a hypothetical characteristic-zero solution must be shown to enter one of the checked cases.

One reusable argument concerns a separated cluster of $m$ roots. If the cluster contains a common witness for every Hasse derivative of orders one through $m-1$, and the degree-$m$ Casas–Alvero property holds over the residue-field closure, then the roots in that cluster coincide exactly. Otherwise, rescaling their largest internal separation gives a forbidden nontrivial degree-$m$ polynomial. The paper applies this with four roots in residue characteristic seventeen.

Other cases use an incompatible second jet or a quadratic obstruction. A unit-Jacobian precision lemma justifies the transfer to ramified candidates. These tools are classical; the proposed contribution is the complete degree-twenty exclusion and its specific local arguments. Uniformity of one coefficient-stratum theorem does not mean uniformity across degrees.

For example, the seven-term support $S=\{2,4,10,17,18,19\}$ would allow powers $20,18,16,10,3,2,1$. It has three compatible seed cases before an exact-zero restriction. The proof covers all three; it does not select only coefficients with nonzero residues. The cover graphic shows the term-count boundary schematically, not a numerical root plot.

## Evidence, assurance and limitations
The package contains the written proof, all required finite inputs and checkers, and a complete support-to-proof map. The revised primary runner executes sixteen checks in normal and optimized Python, including the previously omitted census of 1,216 row-8 assignments. Its thirty-two executions pass locally. The inherited runner passes twenty-seven checks with optional SymPy installed, or twenty-six with that named omission explicitly recorded. Deliberately corrupted domains, support inventories and arithmetic claims are rejected.

These are producer-side checks. Internal editorial roles, reported external review activity, exact hashes and a DOI do not establish formal verification or journal peer review. The latest supplied review's linked audit ZIP was unavailable at intake, so its reported reproduction is not silently promoted to authenticated external assurance. The theorem does not establish sharpness or an eight-term counterexample.

## Relationship to earlier work
Castryck, Laterveer and Ounaïes supply the mean-root and missing-index determinant restrictions. De Frutos Marín supplies older sparse-support criteria. Massri's degree-twenty result concerns three recycled roots, which is a different invariant. Marashdeh provides related support reductions. Ghosh's March 2026 preprint claims the full conjecture; this paper does not use it as a premise. An objection to a positive-characteristic auxiliary claim does not itself refute a characteristic-zero conclusion.

The bounded comparison found no exact predecessor for the eight-term theorem. Equivalence with some reported systems and an unavailable thesis remain unresolved, so unconditional priority is not claimed.

## Who should care, and why
| Audience | Potential use | Required caution |
|---|---|---|
| Algebraists studying Casas–Alvero | Inspect a complete sparsity-class exclusion | The unrestricted degree-twenty problem remains outside this result |
| Computer-algebra researchers | Reproduce the finite identities and support cover | The encoded calculation needs its written mathematical transfer |
| Researchers using valuations | Examine the separated-cluster and precision arguments | Retain every witness and residue-field hypothesis |
| Formalization researchers | Identify bounded components for certified checking | The current package is not a proof-assistant formalization |

## Why the problem matters
A sparsity theorem restricts the shape of any possible counterexample and supplies concrete local obstructions that another argument may reuse. It is useful only if the exclusions cover the entire stated class. Fourteen supports and nineteen cases are bookkeeping counts, not a percentage of progress toward the full conjecture.

## How to inspect or reproduce the recorded checks
Extract the versioned archive and use Python 3.10 or later. The primary runner needs only the standard library; the inherited runner also needs a C++ compiler, with SymPy optional for one historical cross-check.
```sh
python3 -B replay.py --integrity-only
python3 -B replay_new.py --output ../new-replay
python3 -B replay.py --output ../inherited-replay
python3 -B test_publication.py
```
Read the actual omission list and scope in each receipt. The optional large historical census is not a dependency of the eight-term theorem.

## What is in the evidence package
Start with `AI_INDEX.md` and the numbered statements in `PAPER.pdf`. The structural map identifies the main theorem, uniform stratum obstruction, precision lemma and cluster lemma. `research/next-stage/coverage/` routes every support/seed case. `new-results/check_row8_seven_term.py` checks the complete small census. The package also includes source files, certificates, current replay logs, internal editorial records and a revision response. Historical work remains labelled separately from the current candidate.

## What would improve the result next
The immediate task is specialist examination of the normalization and ramification arguments, alongside a separately implemented replay of their finite inputs. Extending the theorem would then require new obstructions for denser centered supports; the current eight-term bound gives no guarantee that those cases are tractable.
