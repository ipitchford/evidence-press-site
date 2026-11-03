## Summary

**In one sentence.** A classical inequality about how far symmetric matrices can fail to commute holds with constant 1, but its simplest machine-checkable proof needs a larger constant — 9/8 for 3 × 3 matrices and up to 3 in general — and this paper computes that constant exactly in every case.

**The DDVV inequality.** Take $m$ real symmetric $n\times n$ matrices $B_1,\dots,B_m$. Their commutators $[B_p,B_q]=B_pB_q-B_qB_p$ measure how far each pair is from commuting. The DDVV inequality says that the total squared size of all the commutators never exceeds the square of the total squared size of the matrices:

$$\sum_{p,q}\|[B_p,B_q]\|_F^2\;\le\;\Big(\sum_p\|B_p\|_F^2\Big)^2 .$$

It began in 1999 as a conjecture by De Smet, Dillen, Verstraelen and Vrancken about the curvature of submanifolds — the matrices are the shape operators of a surface or higher-dimensional submanifold, and the commutators measure its normal curvature. Lu and, independently, Ge and Tang proved it. The constant 1 cannot be improved.

**What a sum-of-squares certificate is.** If the gap between the two sides can be written as a sum of squared expressions, the gap is obviously never negative, and a computer can confirm the identity line by line. Such a *sum-of-squares (SOS) certificate* is the most checkable kind of proof for a polynomial inequality, and finding one is a standard semidefinite-programming task. But "never negative" and "sum of squares" are not the same thing: Hilbert showed in 1888 that some nonnegative polynomials are not sums of squares.

**The question.** Ge, Li and Zhou asked whether the DDVV inequality, and its relatives for other matrix types, has a sum-of-squares proof using squares of quadratic expressions in the matrix entries — the natural kind, since both sides are of degree four. Because adding slack to the right-hand side only helps, the useful version asks: what is the least constant $\sigma(n,m)$ for which $\sigma\cdot(\sum_p\|B_p\|_F^2)^2$ minus the commutator sum *is* such a sum of squares?

**What is proved.** For real symmetric matrices:

- the true constant 1 already has a quadratic SOS proof exactly when $n=2$ or $m=2$;
- otherwise it does not, and the least constant is an explicit fraction in $n$ and $m$: **9/8 for 3 × 3 matrices**, whatever the number of matrices, then rising with $n$ and $m$;
- the least constant never exceeds **3** and approaches 3 only when both the matrix size and the number of matrices grow. So a quadratic SOS proof always exists at constant 3, and it loses at most a factor three against the truth.

For Hermitian matrices (complex matrices equal to their conjugate transpose), where the true constant is 4/3 once there are at least three matrices, the least constant $\sigma_H(n,m)$ is also computed exactly: the simplest proof reaches the true constant only for $2\times2$ matrices, for two matrices (where the true constant is 1), or for three matrices of size at most 7, and its supremum is **4**. The banner plots the real symmetric thresholds for three matrices, four matrices and many matrices against the matrix size.

**How sure we are.** Every result has a written proof in a 27-page paper. A one-command suite in exact arithmetic replays the identities, checks the coefficient formulas against independently built projections, and regenerates three independent finite certificates byte for byte. Only quadratic certificates are classified; certificates of higher degree are an open question.

**Where to go next.** Specialists can continue to the summary below; the technical account explains how the proof works; the evidence section says what was checked and what was not.

## Summary for specialists

Setting: $F_c=c\,(\sum_p\|B_p\|_F^2)^2-\sum_{p,q}\|[B_p,B_q]\|_F^2$ (ordered pairs, Frobenius norm) on $m$-tuples of real symmetric or Hermitian $n\times n$ matrices, $n,m\ge2$; "SOS" means a sum of squares of real quadratic forms in the independent real coordinates. $\sigma(n,m)$ and $\sigma_H(n,m)$ are the least such $c$. Write $w_1=m(n+12)-6(n+4)$ and $w_2=(m-2)(n-3)-4$.

| $n$ | $m=2$ | $m=3$ | $m=4$ | $m=5$ | $m\to\infty$ |
|---|---|---|---|---|---|
| 2 | 1 | 1 | 1 | 1 | 1 |
| 3 | 1 | 9/8 | 9/8 | 9/8 | 9/8 |
| 4 | 1 | 16/13 | 36/29 | 96/77 | 24/19 |
| 5 | 1 | 260/203 | 75/56 | 50/37 | 25/18 |
| 6 | 1 | 21/16 | 27/19 | 36/25 | 3/2 |
| 8 | 1 | 80/59 | 48/31 | 128/81 | 32/19 |

*Real symmetric thresholds $\sigma(n,m)$ from Table 1 of the paper; the true DDVV constant is 1 throughout. The last column is the limit $3n^2/(n^2+7n-6)$.*

- **Theorem 1.1 (real symmetric):** $\sigma(n,m)=1$ iff $\min(n,m)=2$. For $n,m\ge3$, $\sigma=3n^2(m-1)/(mn^2+7mn-6m-12n+12)$ if $w_1\ge0$; $4n(n+8)/((n+2)(3n+14))$ if $m=3$ and $n\in\{5,6\}$; and $4(m-1)(n+2)/(mn+7m+2n-2)$ otherwise. The regimes cover all $n,m\ge3$ and agree where they meet *(proof; algebra checked exactly)*
- **Corollary 1.3:** the sharp defect $F_1$ is SOS iff $\min(n,m)=2$, and for $n,m\ge3$ it is nonnegative but not a sum of squares of polynomials of any degree; $\sigma(3,m)=9/8$ for all $m\ge3$; $\sigma$ is nondecreasing in $n$ and $m$; $\sup\sigma=3$, not attained; for fixed $m$ the limits in $n$ are $8/5,2,16/7$ for $m=3,4,5$ and $3(m-1)/m$ for $m\ge6$ *(proof)*
- **Theorem 1.2 (Hermitian):** $\sigma_H(n,2)=1$; $\sigma_H=4/3$ iff $n=2$ ($m\ge3$) or $m=3$, $3\le n\le7$; otherwise one of three explicit branches (H2–H4, separated by $w_2$ and the wall $m=2n+4$); $\sup\sigma_H=4$, not attained, and $\sigma_H\ge\sigma$. Relative to the sharp constants both families lose at most a factor three *(proof; exact symbolic checks and an exact linear programme over the cone for $3\le n,m\le40$)*
- **Sections 7–8:** the skew-Hermitian threshold equals $\sigma_H$; restriction bounds for complex symmetric, general real and general complex tuples; $\sigma$ and $\sigma_H$ are the exact values of the degree-four moment relaxation, with explicit optimal pseudo-moments; no identity in unnormalised traces works for all $n$ (Proposition 8.1) *(proof)*
- **Section 9 (independent finite certificates):** a zero-set obstruction at $(n,m)=(3,3)$ (120 equality tuples, evaluation determinant nonzero mod 1009) and exact positive semidefinite moment matrices at $(3,3)$ and $(4,3)$ with $L(F_c)=c-9/8$ and $c-16/13$ *(exact certificates, regenerated byte-identically)*

Not claimed: thresholds for multiplier (higher-degree) certificates — $\sigma_1(3,3)$ is open — or for real skew-symmetric, general real or complex, quaternionic and Clifford-subspace families; nonnegativity at the sharp constants (prior theorems); the $m=2$ real symmetric SOS statement (asserted earlier by Zhu and Nie).

## Technical account

**Symmetry reduces every certificate to ten squares.** $F_c$ is invariant under simultaneous orthogonal conjugation $B_p\mapsto QB_pQ^T$ and under orthogonal mixing of the $m$ matrices. If $F_c$ has any quadratic SOS certificate, averaging its Gram matrix over this symmetry group gives an invariant one. For $n,m\ge3$ the relevant space of quadratic forms splits into ten pieces (eight when $n=3$) that are irreducible and pairwise inequivalent under $\mathrm O(n)\times\mathrm O(m)$ (Lemma 3.1), so an invariant certificate is a nonnegative combination of at most ten explicit "generator" squares $f_1,\dots,f_{10}$ (Lemma 3.2, the invariant SOS cone). For Hermitian tuples the same holds with $\mathrm{PU}(n)$, transposition and $\mathrm O(m)$ (Lemma 6.1).

**Four invariants.** Every invariant quartic is a combination of $s=(\sum_p\|B_p\|^2)^2$, $g=\sum_{p,q}\langle B_p,B_q\rangle^2$, $h=\|\sum_pB_p^2\|^2$ and $j=\sum_{p,q}\mathrm{tr}(B_pB_qB_pB_q)$; the commutator sum is $2h-2j$, so $F_c=cs-2h+2j$. Each generator $f_i$ is computed in these coordinates (Lemma 4.2). Deciding whether $F_c$ is SOS becomes a small linear feasibility problem: is $(c,0,-2,2)$ in the cone spanned by ten explicit vectors?

**Matching certificates.** For each regime the paper gives an explicit nonnegative combination of generators equal to $F_c$ at $c=\sigma(n,m)$ (the primal identity, an SOS proof) and an explicit linear functional $L$ on $\mathrm{span}\{s,g,h,j\}$ that is nonnegative on all ten generators but has $L(F_c)<0$ for every $c<\sigma(n,m)$ (the dual certificate, showing nothing smaller works). Their agreement pins down the threshold; the regime boundaries are where the optimal set of active generators changes. Because every averaged square lies in the generator cone, the same functionals are optimal pseudo-moments, so the thresholds equal the values of the degree-four moment relaxation.

**What the numbers mean.** At $c=1$ a nonnegative quartic exists that no quadratic certificate can certify once $n,m\ge3$ — an explicit instance of Hilbert's phenomenon arising from geometry. The extra slack needed is modest for small matrices (9/8 for $3\times3$) and bounded overall (at most a factor three), and it requires both the matrix size and the number of matrices to grow before it approaches that factor: for fixed $m$ it stays below $3(m-1)/m$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/ddvv-sum-of-squares-thresholds.txt) is available for reading.

- **Proofs.** Theorems 1.1 and 1.2, Corollary 1.3 and the consequences of Sections 7–8 have written proofs in the 27-page paper, including the cone lemmas, the coefficient formulas, the dual values for every regime (Appendices A and B) and the regime-exhaustion arguments.
- **Exact checks.** `run_checks.py` runs eight checkers in exact integer, rational and symbolic arithmetic (SymPy 1.14.0): the real and Hermitian primal identities and all dual values as identities in $n$ and $m$; the coefficient formulas at $n\le5$ against projections built independently from the Casimir operator; an exact linear programme over the Hermitian cone for $3\le n,m\le40$; a pure verifier of the shipped moment matrices (positive semidefinite, ranks 90 and 168, by exact elimination); full-coordinate expansions of the 9/8 identity at $(3,3)$ and $(3,4)$; and the zero-set certificate. It then regenerates the three certificate files and requires them to be byte-identical to the shipped ones. No floating-point computation is used as evidence.
- **Controls and replay.** Every checker raises an error on failure instead of using `assert`, so the suite stays active under Python's `-O` flag; deliberately tampered copies (one coefficient changed, one moment entry changed) were rejected. Rerun from a fresh copy before release under normal and optimized Python, every check passed and every regenerated certificate was byte-identical. GitHub CI reruns the suite on Linux.
- **What is not machine-checked.** Irreducibility and multiplicity-freeness of the decompositions are cited representation theory, with low-dimensional cases written out and dimensions and Casimir spectra checked exactly for $n\le5$; the infinite-domain sign analysis is a written argument whose factorisations are checked symbolically. The full-coordinate certificates cover $m=3$ and $m=4$ at small $n$ only.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a separate model and a clean replay led to one revision round, which added the Hermitian theorem, the moment-relaxation interpretation and the related literature; a re-review, an independent audit of the Hermitian proof and a second separate-model audit found no open correctness issue. A rating-free summary is in the package. None of this is human peer review, independent reproduction or proof-assistant formalisation.
- **Limitations.** Only degree-four (quadratic) certificates are classified. The literature search was dated and bounded; no earlier statement of either threshold was found. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| People proving matrix or polynomial inequalities with semidefinite-programming solvers | Exactly how much slack the simplest (degree-four) SOS certificate needs for commutator bounds, and exact benchmark instances with known optimal values | Only quadratic certificates; higher degrees may do better |
| Researchers on DDVV-type inequalities and submanifold geometry | A complete answer to the Ge–Li–Zhou question for real symmetric and Hermitian matrices | Other matrix types and Clifford families remain open |
| Real algebraic geometers | A natural family of nonnegative non-SOS quartics from geometry with exact thresholds and certificates | The non-SOS statement concerns $n,m\ge3$ |
| Research agents | Machine-readable claims, an agent index and a replayable exact suite | The checks complement the written proofs; they do not replace them |

## Why the problem matters

Sum-of-squares certificates are how computers prove polynomial inequalities, from control theory to quantum information. Knowing exactly when a classical inequality admits such a certificate — and how much slack it needs when it does not — tells practitioners what a solver can and cannot find, and gives exact test cases for semidefinite programming. The DDVV inequality is a natural test: it is sharp, geometrically meaningful and highly symmetric, and its SOS status was posed as an open question by the people who generalised it.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root, with Python 3.10 or later:

```sh
shasum -a 256 -c MANIFEST.sha256
uv run --with sympy==1.14.0 python3 -I -B run_checks.py OUTDIR
uv run --with sympy==1.14.0 python3 -I -B -O run_checks.py OUTDIR_O
```

Each run takes about a minute and writes only to its output directory; `OUTDIR/verification_summary.json` records the status of every check. `AI_INDEX.md` maps each result to its section and evidence, `CLAIMS.md` gives the status of every claim, `VERIFICATION.md` says what each script does and does not establish, and `review/REVIEW_SUMMARY.md` lists the objections raised in review and how each was handled.

## The most valuable next projects

1. Determine the multiplier threshold $\sigma_1(3,3)$, the least $c$ for which $(\sum_p\|B_p\|_F^2)\,F_c$ is a sum of squares; is it 1?
2. Decide whether some fixed certificate degree brings the threshold uniformly below 3 for all $n$ and $m$.
3. Compute the exact thresholds for real skew-symmetric, general real and complex matrices and the Clifford-subspace families of Ge, Li and Zhou.

## What is in the evidence package

The paper (PDF and LaTeX source) with its figure script; the bibliography copied from Crossref and arXiv records; `run_checks.py` and eight exact checkers with the three shipped certificate files and the logs of the final replay; `CLAIMS.md`, `VERIFICATION.md`, `AI_INDEX.md`, the bounded prior-art search, a rating-free internal review summary and independent algebra audit, the previous version, `RESEARCH_GATES.json`, `REPLAY_RECEIPT.md`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text and data are CC0-1.0; code is MIT. This remains an unrefereed candidate.
