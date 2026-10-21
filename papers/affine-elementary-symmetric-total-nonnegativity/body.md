## Summary

**Positive values versus positive coefficients.** A polynomial can be nonnegative at every positive input and still contain negative coefficients. For example, $(x_1-x_2)^2=x_1^2-2x_1x_2+x_2^2$ is never negative, yet its mixed coefficient is $-2$. In algebraic combinatorics the stronger property — every individual monomial coefficient is nonnegative — usually signals that something is being *counted*, and it is much harder to prove.

**The objects.** The *elementary symmetric polynomials* $e_k$ add up all products of $k$ distinct variables: for three variables, $e_2=x_1x_2+x_1x_3+x_2x_3$. Placing such a sequence along the diagonals of an infinite upper-triangular array gives a *Toeplitz matrix*, and its *minors* are the determinants of its finite square sub-arrays. For the plain sequence $e_k$, every minor is a classical skew Schur function and has nonnegative coefficients. A question recorded at an American Institute of Mathematics total-positivity workshop asks what happens when each term is first multiplied by an affine factor in its index $k$.

**What was found.** This release supplies a proof candidate for a stronger statement: multiplying the elementary symmetric sequence by one affine factor, $b_k=(1+kt)e_k(X)$, leaves every Toeplitz minor with nonnegative monomial coefficients. There is no cutoff on alphabet size or minor order, and selected rows and columns may have gaps. A two-parameter version, $(uk+v)e_k(X)$, follows, including the endpoint $v=0$.

**The idea in words.** The affine factor can be produced by a simple matrix: the diagonal matrix of variables times the identity plus $t$ times the all-ones matrix. Classical representation theory then expresses each coefficient as a squared length of a vector, which cannot be negative. The key extra step separates the powers of $t$ into perpendicular layers, so the argument controls each coefficient individually rather than only the value of the polynomial.

**Status.** The proof is unrefereed, and historical priority remains uncertain. It treats one affine factor only, not the broader multiple-factor conjecture. Finite exact checks accompany it as diagnostics, not as a substitute for the universal argument.

## Summary for specialists

For a finite alphabet $X$, set $b_k=(1+kt)e_k(X)$ for $k\geq0$ and $b_k=0$ otherwise, with $e_0=1$. The manuscript proves that every finite minor of $(b_{j-i})_{i,j\geq0}$ belongs to $\mathbb N[t,X]$, where zero is allowed (Theorem 1). Homogenization gives the same conclusion in $\mathbb N[u,v,X]$ for $(uk+v)e_k(X)$, including $v=0$ (Corollary 2); this includes the original $(k+a)e_k$ affine family, coefficientwise in $a$. Arbitrary increasing nonnegative row and column index sets, including gaps and structural zero minors, are included. The countably infinite alphabet version follows coefficient by coefficient.

This is the single-factor case of the affine-product programme, not a solution of its multiple-factor or general Hadamard branches. The separate general Hadamard, factorial-Hadamard and nonlinear log-concavity branches of the AIM record are not settled.

The central coefficient formula (4.5) is, for $\lambda\vdash d$, a weak composition $\alpha$ and a word $a$ of content $\alpha$,

$$
[t^kX^\alpha]\phi_t(s_\lambda)=\frac{d!}{f^\lambda\alpha!}\|P_\lambda w_{a,k}\|^2\geq0,
$$

where $\phi_t(e_k)=(1+kt)e_k(X)$, $P_\lambda$ is the central character projection and $w_{a,k}$ is the degree-$k$ layer of a marked tensor.

## Technical account

**Rank-one realization.** The matrix $D_X(I+tJ)$ realizes the multiplier: each principal minor of size $k$ is $(1+kt)$ times the corresponding squarefree monomial, because $J_k$ has eigenvalues $k,0,\ldots,0$. Summing principal minors gives

$$
\det(I+zM)=\sum_{k=0}^N(1+kt)e_k(X)z^k,\qquad M=D_X(I_N+tJ_N),
$$

so the specialization $\phi_t$ is evaluation of symmetric functions on the eigenvalues of $M$, as a polynomial identity requiring no diagonalizability.

**Coefficients as immanants (Lemma 3).** Frobenius characters then turn Schur coefficients into repeated-index immanants: $[X^\alpha]s_\lambda(D_XB)=\operatorname{Imm}_\lambda(B[\alpha])/\alpha!$, where $B[\alpha]$ repeats rows and columns according to $\alpha$.

**Coefficients as squared norms.** Gram vectors with one extra marked coordinate, $v_i(z)=q_i+zq_0$, have Gram matrix $I+z^2J$ and give orthogonal tensor layers; their projections produce a nonnegative squared norm for each coefficient separately. The layers $W_k$ (basis tensors with exactly $k$ occurrences of $q_0$) are mutually orthogonal and preserved by the projection, so cross terms between different powers of $t$ vanish. Projection entries are rational, giving an exact rational sum-of-squares certificate; the coefficients are also integers, hence nonnegative integers.

**From Schur functions to every minor.** The Littlewood–Richardson rule passes from straight to skew shapes. An explicit reverse-and-transpose indexing formula identifies every feasible Toeplitz minor with a skew Schur specialization; infeasible index sets give zero. Polynomial homogenization supplies the two-parameter endpoint without division by zero.

These are classical representation-theoretic tools assembled for the affine realization. A supplementary tensor-trace proof makes the sufficient positive-semidefinite coefficient-matrix hypothesis explicit: if $B(t)=\sum_jt^jB_j$ has positive-semidefinite coefficient matrices, every coefficient of $s_\lambda(D_XB(t))$ is nonnegative. It is not independent external validation.

**Why the monomial basis matters.** Coefficientwise Schur positivity is false already at order three: the paper's identity (7.1) gives $\phi_t(s_{(3)})$ a coefficient $-1$ on $t^2s_{(1,1,1)}$. This is the minor with rows $(0,1,2)$ and columns $(1,2,3)$; its ordinary coefficient of $x_1x_2x_3$, in contrast, is $1+3t+6t^2+6t^3$.

## Evidence, assurance and limitations

The archive contains the full written argument and finite exact diagnostics: 87 Schur polynomials, 4,725 coefficient comparisons, 209 character orthogonality pairs, 29 projected norms, 68 arbitrary-index minors and 36 direct affine order-two checks. The 87 Schur-determinant polynomials cover all partitions of degrees 1–6 with alphabet sizes 1–3. Negative controls reject tempting but invalid positivity shortcuts: the false Schur-positivity strengthening, a pointwise-positive but coefficientwise-negative polynomial and a corrupted Gram pencil. The uniform theorem rests on the proof, not on those finite counts; no numerical eigensolver or finite-to-infinite extrapolation enters the proof.

The supplied AI-assisted review and five publisher-coordinated model roles informed internal scrutiny. They do not establish unaffiliated reproduction, formal verification, authenticated human specialist review or journal peer review. The supplied review's separately implemented audit was reported but its sandbox archive was not available here as a public evidence object. No historical-priority or impact claim is made. Coefficientwise Schur positivity is explicitly false already for a displayed order-three minor.

## Relationship to earlier work

The AIM workshop report records the affine question on printed page 2. Sokal's numbered slide 11 places it inside the broader affine-product conjecture, and slide 12 credits Richard Stanley's Schur-specialisation strategy. Huber and Maassen provide the classical Gram-immanant projection framework. Carvalho and Freitas supply a close positive-direction tensor antecedent. The manuscript does not claim to have invented these methods or excluded an earlier equivalent theorem. The bounded search did not verify an earlier statement of this complete affine coefficientwise theorem; that does not establish priority or rule out a direct consequence of older literature.

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

```sh
shasum -a 256 -c MANIFEST.sha256
python3 verify.py
python3 package.py
```

The checker overwrites only `REPLAY_RECEIPT.json`, which is why the manifest should be checked first. To read the proof, start with Section 2 of the paper (the rank-one realization) and Section 4 (every coefficient is a squared norm); Section 5 handles skew shapes and arbitrary minors.

## The most valuable next projects

Unaffiliated readers can audit the repeated-content normalization and arbitrary-minor bridge, independently reconstruct the diagnostics, or formalize the representation-theoretic argument. A specialist priority search should test for older equivalent consequences. Multiple affine factors and a direct combinatorial coefficient interpretation are separate research targets, not results of this release.

## What is in the evidence package

The package includes the six-page PDF, accessible manuscript source, proof audit, self-contained novelty and citation records, claims index, review response and internal editorial reports, exact Python checker, environment guidance, complete manifest and CC0/MIT component licences. GitHub and the version DOI identify the same release assets; publication and communication media add availability, not mathematical validation.
