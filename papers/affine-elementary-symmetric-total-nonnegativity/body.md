## Summary

A polynomial can be nonnegative at every positive input and still contain negative coefficients. This release supplies a proof candidate for a stronger statement: multiplying the elementary symmetric sequence by one affine factor leaves every Toeplitz minor with nonnegative monomial coefficients. There is no cutoff on alphabet size or minor order. The proof is unrefereed, and historical priority remains uncertain.

## Summary for specialists

For a finite alphabet $X$, set $b_k=(1+kt)e_k(X)$ for $k\geq0$ and $b_k=0$ otherwise, with $e_0=1$. The manuscript proves that every finite minor of $(b_{j-i})_{i,j\geq0}$ belongs to $\mathbb N[t,X]$, where zero is allowed. Homogenization gives the same conclusion in $\mathbb N[u,v,X]$ for $(uk+v)e_k(X)$, including $v=0$. Arbitrary increasing nonnegative row and column index sets, including gaps and structural zero minors, are included.

This is the single-factor case of the affine-product programme, not a solution of its multiple-factor or general Hadamard branches.

## Technical account

The matrix $D_X(I+tJ)$ realizes the multiplier: each principal minor of size $k$ is $(1+kt)$ times the corresponding squarefree monomial. Frobenius characters then turn Schur coefficients into repeated-index immanants. Gram vectors with one extra marked coordinate give orthogonal tensor layers; their projections produce a nonnegative squared norm for each coefficient separately.

The Littlewood–Richardson rule passes from straight to skew shapes. An explicit reverse-and-transpose indexing formula identifies every feasible Toeplitz minor with a skew Schur specialization; infeasible index sets give zero. Polynomial homogenization supplies the two-parameter endpoint without division by zero.

These are classical representation-theoretic tools assembled for the affine realization. A supplementary tensor-trace proof makes the sufficient positive-semidefinite coefficient-matrix hypothesis explicit. It is not independent external validation.

## Evidence, assurance and limitations

The archive contains the full written argument and finite exact diagnostics: 87 Schur polynomials, 4,725 coefficient comparisons, 209 character orthogonality pairs, 29 projected norms, 68 arbitrary-index minors and 36 direct affine order-two checks. Negative controls reject tempting but invalid positivity shortcuts. The uniform theorem rests on the proof, not on those finite counts.

The supplied AI-assisted review and five publisher-coordinated model roles informed internal scrutiny. They do not establish unaffiliated reproduction, formal verification, authenticated human specialist review or journal peer review. The supplied review's separately implemented audit was reported but its sandbox archive was not available here as a public evidence object. No historical-priority or impact claim is made. Coefficientwise Schur positivity is explicitly false already for a displayed order-three minor.

## Relationship to earlier work

The AIM workshop report records the affine question on printed page 2. Sokal's numbered slide 11 places it inside the broader affine-product conjecture, and slide 12 credits Richard Stanley's Schur-specialisation strategy. Huber and Maassen provide the classical Gram-immanant projection framework. Carvalho and Freitas supply a close positive-direction tensor antecedent. The manuscript does not claim to have invented these methods or excluded an earlier equivalent theorem.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraic combinatorics researchers | Inspect an all-order affine specialization and explicit coefficient formula. | One factor only; novelty is unresolved. |
| Matrix-positivity researchers | Reuse the graded Gram or coefficient-matrix argument. | Pointwise positivity is not coefficientwise positivity. |
| Verification developers | Reconstruct a compact exact diagnostic suite. | Finite agreement does not formalize the theorem. |

## Why the problem matters

The question asks whether familiar numerical positivity survives at the level of every symbolic coefficient. A uniform argument can explain infinitely many determinants that direct enumeration cannot cover. Its demonstrated significance is mathematical and specialist; practical adoption or research acceleration has not been measured.

## How to inspect or reproduce the recorded checks

Download the versioned archive or clone the tagged repository. Verify `MANIFEST.sha256` before replay, install the pinned SymPy 1.14.0 dependency, and run `python3 verify.py`. The receipt records the Python version. Mathematical counts should agree; elapsed time and Python version may differ. `python3 package.py` performs fresh-extraction replay and confirms that optimization mode is refused. No historical machine path or remote solver is required.

## The most valuable next projects

Unaffiliated readers can audit the repeated-content normalization and arbitrary-minor bridge, independently reconstruct the diagnostics, or formalize the representation-theoretic argument. A specialist priority search should test for older equivalent consequences. Multiple affine factors and a direct combinatorial coefficient interpretation are separate research targets, not results of this release.

## What is in the evidence package

The package includes the six-page PDF, accessible manuscript source, proof audit, self-contained novelty and citation records, claims index, review response and internal editorial reports, exact Python checker, environment guidance, complete manifest and CC0/MIT component licences. GitHub and the version DOI identify the same release assets; publication and communication media add availability, not mathematical validation.
