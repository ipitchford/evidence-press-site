## Summary

This page explains, in order: what total positivity is and why checking it is expensive, the question posed as AIM Problem 1.65, the condition and threshold this release proves, why the threshold cannot be lowered, and what has and has not been checked.

**The setting.** A matrix is *totally positive* when every square submatrix, of every size, has a positive determinant (these determinants are called *minors*). The property is strong and global: an $n\times n$ matrix has a very large number of minors, and the big ones are the costly ones. A natural hope is that information from small pieces could force the global property, so that one only needs to inspect small minors.

**What was asked.** AIM Problem 1.65 (catalogued as AIM-LINEAR_ALGEBRA-0017) asks, in effect, for a condition of this kind: suppose all minors up to some order are positive; what extra condition on those small minors forces every larger minor to be positive too? The problem reports that a sufficient condition was obtained earlier at a workshop, but does not display it. The question permits choosing a quantitative condition, and this release answers that choose-a-condition formulation.

**What was found.** This candidate gives a quantitative answer: certain ratios of small minors must exceed a precise threshold, $4\cos^2\frac{\pi}{n-k+2}$, which depends on the matrix size $n$ and the order $k$ of the minors used. It also constructs counterexamples showing why that threshold cannot be lowered: for any smaller threshold there is a matrix that passes the test, has every proper minor positive, and still has a negative full determinant. If one wants a single threshold that works for every matrix size, the best possible value is exactly 4.

**What it means.** The answer is sharp: it identifies precisely how strong this particular local condition must be, rather than only providing a convenient sufficient bound. It does not claim that the condition is necessary for total positivity, that it minimizes arithmetic operations, or that it is the same as the undisplayed workshop condition.

**Status.** The result is a complete written proof candidate for an explicitly specified condition. It remains unrefereed, and identity with an earlier, undisplayed workshop condition is not claimed. Exact finite diagnostics and symbolic checks are replayable; there is no formal verification, unaffiliated specialist review, independent implementation of the whole theorem or absolute priority clearance.

## Summary for specialists

For a real $n\times n$ matrix and $1\le k<n$, assume all minors of orders at most $k$ are positive. For each pair of increasing $(k+1)$-element index sets, write $I=P\cup\{i,i'\}$, $J=Q\cup\{j,j'\}$, with $P,Q$ the first $k-1$ indices and $i<i'$, $j<j'$. Impose

$$
R=\frac{\Delta(Pi,Qj)\Delta(Pi',Qj')}{\Delta(Pi,Qj')\Delta(Pi',Qj)}.
$$

The required bound is

$$
R>4\cos^2\frac{\pi}{n-k+2}.
$$

The expression uses only $k$-minors, although their union occupies a $(k+1)$-square submatrix; there is one inequality for each pair of index sets, and no full-compound positivity is assumed. The candidate proves total positivity and sharpness for this normalized family. Every smaller threshold admits a matrix with every proper minor positive and negative full determinant. For each fixed $k$, the optimal dimension-independent threshold is 4.

| Result (paper section) | Statement |
|---|---|
| Theorem (§1) | With $c_m=4\cos^2\frac{\pi}{m+1}$, the smallest sufficient threshold for fixed $n,k$ is $\lambda_{n,k}=c_{n-k+1}=4\cos^2\frac{\pi}{n-k+2}$ |
| Sufficiency (§2) | $A\in TP_{k-1}$ satisfying $\mathcal L_k(\lambda_{n,k})$ is strictly totally positive |
| Bordering lemma (§3) | Scale-separated bordering $A_t$ of a matrix $B$ has $\det A_t[I,J]\sim e^{d-1}t^{\sum I^*+\sum J^*}\det B[I^*,J^*]$, so for large $t$ all proper minors are positive and the full determinant is negative |
| Simultaneous ratio transfer (§4) | A negative-determinant, positive-proper-minor example for $(r,k-1,q)$ lifts to one for $(r+1,k,q)$ |
| Sharp seeds (§5) | For $m\ge3$ and $q<c_m$, a perturbed tridiagonal matrix gives a seed satisfying $\mathcal L_1(q)$ with negative determinant |
| Optimality (§6) | Sharpness for every $q<c_{n-k+1}$; the dimension-independent optimum is 4 |
| Nonvacuity and stability (§7) | $A_{ij}=t^{ij}$ with $t>\max(36,2(n!-1))$ satisfies the condition; a relative-error margin $c_{n-k+1}((1+\epsilon)/(1-\epsilon))^2$ suffices for minor data known within relative error $\epsilon<1$ |

For $n\le k$, testing positivity of all minors through order $n$ already gives total positivity; no ratio condition is needed.

## Technical account

Sufficiency combines the classical Katkova–Vishnyakova determinant theorem with Sylvester’s bordered-minor identity. The scalar theorem says that a positive-entry $m$-square matrix $B$ has positive determinant if every adjacent $2\times2$ cross-ratio exceeds $c_m$. Given any larger square submatrix $M$, border its leading $(k-1)$-square block $H$ with each remaining row and column; the resulting $k$-minors form a positive matrix whose adjacent ratios are exactly the tested ratios $R$. The scalar theorem makes its determinant positive, and Sylvester's identity, $\det B=(\det H)^{m-1}\det M$, transfers positivity to $\det M$.

The new proof task is to transfer sharpness through every local test at once, not merely through one selected Schur complement.

The construction adds a row and column of ones and a scale-separated perturbation of the remaining block. For every selected minor, one cofactor becomes the unique dominant term. Its coefficient is a smaller minor of the starting matrix. The leading row and column factors cancel in each local ratio. Finitely many strict margins then allow one finite scale preserving every required inequality simultaneously. Repeated lifts choose a finite matrix at each stage before proceeding to the next, so no interchange of limits is needed.

Small positive perturbations of tridiagonal matrices supply sharp starting examples. The limiting tridiagonal matrix with diagonal $a$ and off-diagonals 1 has eigenvalues $a+2\cos\frac{j\pi}{m+1}$, exactly one of which is negative when $2\cos(\pi/m)<a<2\cos(\pi/(m+1))$. Repeated finite lifts reach arbitrary matrix size and minor order. A generalized Vandermonde family establishes nonvacuity analytically. A separate relative-error bound concerns already certified minor data, not numerical conditioning of computing those minors.

## Evidence, assurance and limitations

The package contains a five-page manuscript, source, exact rational diagnostics, symbolic leading-coefficient checks and a correction regression. Ten general examples, 53 symbolic identities and five invalid-certificate controls passed normal and optimized producer replay. The negative controls reject equality at the strict threshold, zero and negative entries, duplicate rows, and a positive full determinant. The reviewer’s explicit matrix was checked separately: all 69 minors are positive, while a local ratio of $9/5$ distinguishes the size-adaptive condition from the stronger common threshold of 2.

Five differentiated internal AI reviewers recommended acceptance with no blocking findings. This is not unaffiliated specialist refereeing. Finite checks do not prove the arbitrary-dimensional theorem, and publication does not establish historical priority or practical computational speed. The sharpness assertion concerns the explicitly normalized condition, not an unspecified condition with an arbitrarily rescaled parameter.

## Relationship to earlier work

The scalar threshold and Sylvester’s identity are established inputs. Exterior bordering in Fallat–Johnson–Sokal provides relevant context, but retaining a bad matrix as a proper submatrix cannot yield a parent with every proper minor positive. Here the starting matrix appears through a Schur complement, while the full ratio family transfers simultaneously. Full compound matrices cannot be treated as automatically totally positive (compare Fallat–Gupta–Johnson).

Gasca–Mühlbach’s earlier generalized Schur-complement tests remain relevant to priority: only the abstract was inspected in this audit. AIM Problem 1.65 reports an earlier sufficient condition without displaying it, so equivalence with that condition is unresolved.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Matrix theorists | Inspect a sharp lower-order minor criterion and reusable lifting construction. | The proof awaits unaffiliated scrutiny. |
| Exact-computation researchers | Reconstruct and test the simultaneous constraints. | Finite replay is not an all-dimensional certificate. |
| Numerical analysts | Explore certified uncertainty bounds on minor data. | No conditioning or faster algorithm is established. |

## Why the problem matters

The question connects local determinant information with a global sign property. Sharpness identifies precisely how strong this particular local condition must be, rather than only providing a convenient sufficient bound.

## How to inspect or reproduce the recorded checks

Download the versioned ZIP or check out the release tag. Install Python 3 and the pinned `sympy==1.14.0` dependency. Run `python3 verify_manifest.py`, `python3 verify_general.py` and `python3 verify_review.py`; each should report a pass. The README includes the older supporting diagnostics (`pilot.py`, `lift.py`) and optimized-mode replay commands. For the mathematics, read Sections 2–6 of the paper (or `SOLUTION.md`); the checks support implementation correctness and detect finite errors, but are not the proof.

## The most valuable next projects

- Independently reconstruct the all-minors asymptotic argument and simultaneous ratio transfer.
- Reimplement the finite checks directly from the mathematical definitions.
- Obtain the earlier workshop formula and complete the comparison with Schur-complement literature.
- Study economical sufficient subfamilies or numerically stable certification, without assuming this criterion is algorithmically optimal.

## What is in the evidence package

The release provides PDF and Markdown/TeX source, structured claims, exact code and results, replay and review records, component licences, a SHA-256 manifest, the frozen internal-review target and matching GitHub/Zenodo assets. Historical notes remain explicitly subordinate to the consolidated solution.
