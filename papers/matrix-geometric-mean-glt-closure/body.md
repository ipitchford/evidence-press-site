## Summary

**In one sentence.** Two pairs of large matrices that look identical to the standard spectral theory can have geometric means with different eigenvalue distributions, so a published claim that "the symbol of the mean is the mean of the symbols" is false in general; this paper shows exactly why, and says when the shortcut is safe.

**The setting.** For two positive numbers $a$ and $b$, the geometric mean $\sqrt{ab}$ is their "multiplicative midpoint". Positive definite matrices have a matching midpoint, the matrix geometric mean $A\#B$. It is used to average covariance matrices (for example in brain–computer interfaces), to average structured matrices, as a building block in preconditioning, and in quantum information, where its trace is the Matsumoto fidelity of two quantum states. For invertible matrices it behaves well: small changes in $A$ and $B$ make small changes in $A\#B$. At the boundary, where the matrices become singular (rank deficient), it can jump. That jump was known from small examples; nobody had described all the values it can jump to.

**What is proved first.** The paper gives an exact test for every value the mean can approach near a singular pair $(A,B)$. A matrix $X$ is such a limit exactly when $X$ is positive semidefinite, the block matrix $\left(\begin{smallmatrix}A&X\\X&B\end{smallmatrix}\right)$ is positive semidefinite, and that block matrix has rank at most $N$, the size of the matrices. In the simplest case, two matrices that both approach the projection $\operatorname{diag}(1,0)$ can have means approaching $c(t)\operatorname{diag}(1,0)$ for any $c(t)=2/\sqrt{4+t^2}$ between $0$ and $1$: the answer is decided by a tiny coupling between the part that survives and the part that vanishes.

**Why this matters for large structured matrices.** Discretising a differential equation on finer and finer grids produces *generalized locally Toeplitz* (GLT) sequences: matrices of growing size whose eigenvalue histograms are described by a function called the *symbol*. GLT theory is a calculus: the symbol of a sum or product is the sum or product of the symbols. A 2025 theorem in *Linear Algebra and its Applications* (Ilyas, Khan, Loi and Serra-Capizzano), and a conjecture in the same article, said that the same holds for the geometric mean even when the symbols vanish on a region. It does not. The tiny coupling above is invisible to symbols, so the paper builds two bounded positive definite matrix sequences that both have symbol $1$ on half the interval and $0$ on the other half, whose geometric means have symbol $\tfrac45$ on that half instead of $1$. Alternating the coupling with the matrix size gives means with no eigenvalue distribution at all.

**The repair.** The symbol formula is safe when the two symbols never vanish together on a region of positive size, or when they never overlap. In every case the regularised mean of the symbols is an upper envelope: the eigenvalues of the means can lose mass relative to it but never gain it. For bounded scalar symbols that depend only on position, these two safe cases are exactly the dividing line: outside them a counterexample always exists.

**How sure we are.** Every result has a written proof. A standard-library script makes 1,030 exact checks in rational and complex-rational arithmetic of the formulas and the finite building blocks of the constructions; it checks identities, not the limits and "for all" statements, which rest on the proofs. Review was internal and AI-assisted; this is not peer review.

## Summary for specialists

Notation: $A\#B=A^{1/2}(A^{-1/2}BA^{-1/2})^{1/2}A^{1/2}$ for HPD $A,B$; $M(A,B,X)=\left(\begin{smallmatrix}A&X\\X&B\end{smallmatrix}\right)$; $\kappa\#\xi$ the regularised (shift-to-zero) mean of the symbols.

| Result | Statement in brief | Relation to earlier work |
|---|---|---|
| Theorem 1 | Limits of $A_j\#B_j$ with HPD $A_j\to A$, $B_j\to B$ are exactly the $X\succeq0$ with $M(A,B,X)\succeq0$ and $\operatorname{rank}M(A,B,X)\le N$ | A dilation description with an auxiliary contraction follows from Jones (2026); the explicit elimination is new as far as we found |
| Corollaries 2–3 | Equal inputs: limits $0\preceq X\preceq A$ with $\operatorname{rank}(A-X)\le\dim\ker A$; exact interval of limiting Matsumoto fidelities | Lower endpoint and the case $q\ge r$ are in Jones; necessity and the full set are new |
| Section 6 | Bounded HPD scalar GLT inputs with equal symbols whose means have symbol $\tfrac45a$ instead of $a$, or no distribution | Refutes arXiv:2505.03256 Theorem 4 and Conjecture 1 (quoted); published Theorem 3 and Conjecture 1 per an AI-assisted reading |
| Theorem 4 | Any sequence of contractions can be hidden behind two fixed input symbols | New as far as we found |
| Theorem 5, Corollary 6 | Closure if $\kappa+\xi\succ0$ a.e., for every Kubo–Ando mean | Standard identity and GLT transfer |
| Theorem 7, Corollary 8 | Spectral law of $A_n\#B_n$ stochastically dominated by that of $\kappa\#\xi$; closure if $\kappa\#\xi=0$ a.e. | Sequence-level form of a classical order bound |
| Theorem 9, Corollary 10 | Bounded Riemann-integrable scalar symbols of $x$: closure for all HPD realisations $\iff$ $\lvert\{\kappa+\xi=0\}\rvert=0$ or $\lvert\{\kappa\xi>0\}\rvert=0$ | New |
| Appendix A | Sharp spectral envelope of means near projections of any rank density | New as far as we found |

- **The failing step** *(source comparison)*: in the attacked proof, $(A_NB_N^2A_N)^{1/4}\to P_N$ while $A_N\#B_N\to\tfrac45P_N$; the a.c.s. identification of the two limits is where the argument breaks.
- **Structure** *(Remark 6.2)*: a $2\times2$ block counterexample built from constant-symbol block Toeplitz terms refutes the block conjecture natively; whether purely scalar Toeplitz-algebra sequences can fail is open (Remark 6.1).
- **Quantum corollary** *(Corollary 3, Remark 4.1)*: two full-rank qubit states, arbitrarily close to the same pure state, can have any Matsumoto fidelity in $(0,1]$, while their Uhlmann fidelity tends to $1$.

> **When is the symbol formula safe?**
>
> - *Safe:* $\kappa+\xi\succ0$ almost everywhere (Theorem 5); for scalar symbols, no common zero set of positive measure (isolated zeros, such as $\theta=0$ for a Laplacian, are harmless); the same holds for every Kubo–Ando mean.
> - *Safe:* $\kappa\#\xi=0$ almost everywhere (Corollary 8): essentially disjoint supports; the means are then zero-distributed.
> - *Always true:* the eigenvalues of the means never exceed what $\kappa\#\xi$ predicts, in the sense of stochastic domination (Theorem 7).
> - *Unsafe* (proved for bounded Riemann-integrable scalar symbols of $x$; open in general): a common zero region of positive measure together with a common support of positive measure. Couplings of size $O(1/N)$ between range and kernel, comparable to discretisation error, then decide the output, and no test on the symbols alone can certify the formula.

## Technical account

**The rank criterion.** Ando and Pusz–Woronowicz characterised $A\#B$ as the largest Hermitian $X$ with $M(A,B,X)\succeq0$. Theorem 1 says that the boundary limits are exactly the positive semidefinite points of this feasible set whose block matrix has rank at most $N$; every limit therefore lies below the regularised mean, which is the top of the set. Necessity follows because $M(A_j,B_j,A_j\#B_j)$ has rank exactly $N$ and rank is lower semicontinuous. Sufficiency uses a simultaneous congruence that splits the space into the common kernel of $A$ and $B$ and its complement, then an explicit family of positive definite pairs whose means converge at rate $O(\delta)$ (Section 3.3). An equivalent form: $X=A^{1/2}WB^{1/2}$ for some unitary $W$ with $X\succeq0$.

**The two-dimensional engine.** With $A_e=\operatorname{diag}(1,e^2)$ and $B_{e,t}=\left(\begin{smallmatrix}1&te\\te&(1+t^2)e^2\end{smallmatrix}\right)$, $A_e\#B_{e,t}=(4+t^2)^{-1/2}\left(\begin{smallmatrix}2&te\\te&(2+t^2)e^2\end{smallmatrix}\right)\to c(t)\operatorname{diag}(1,0)$ with $c(t)=2/\sqrt{4+t^2}$; at $t=3/2$, $c=\tfrac45$. Repeating these blocks along the diagonal with $e_N=1/N$ gives HPD sequences within $O(1/N)$ in norm of the same diagonal sampling, hence with the same GLT symbol $a=\mathbf 1_{(0,1/2]}$, whose means converge in norm to $\tfrac45$ times that sampling. This mechanism is classical (an example is attributed to Bhatia); its use against GLT closure is the point.

**Positive results.** When $\kappa+\xi\succ0$, normalising by $(A_n+B_n)^{-1/2}$ reduces every Kubo–Ando mean to a continuous function of one Hermitian GLT sequence, so the GLT calculus applies (Theorem 5, Corollary 6). Theorem 7 shifts both inputs by $\varepsilon I$, applies Theorem 5 to the shifted means, uses Loewner and Weyl monotonicity and the portmanteau theorem on closed sets, and lets $\varepsilon\to0$: every subsequential spectral limit is stochastically dominated by the law of $\kappa\#\xi$. Theorem 9 builds, from any common zero region meeting a common support, paired blocks that couple the two regions at scale $1/n$, and counts indices through weak convergence of the empirical joint law of $(\kappa(x_j),\xi(x_j))$.

**Classical and new.** The boundary discontinuity, Ando's maximal characterisation, the envelope $X\preceq A\#B$ and the sum normalisation are earlier work. Jones (2026) already gives the envelope, attainability by dilation into the common kernel and, with compactness, a description of the limits with an auxiliary contraction; the paper credits this and claims only the explicit elimination and its consequences for Theorem 1. Within a bounded literature search, the GLT counterexamples, Theorems 4, 7 and 9 and Appendix A were not found elsewhere. A public AI-generated review (Pith, August 2026) had questioned the same proof step without a counterexample.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/matrix-geometric-mean-glt-closure.txt) is available for reading.

- **Proofs.** Every theorem, corollary and proposition has a written proof in the 21-page manuscript, with appendices on the spectral envelope at projections and on the dilation view.
- **Exact checks.** `verify_exact.py` (Python standard library only) makes 1,030 exact checks in rational and Gaussian-rational arithmetic: formula (5.2) for many parameters; the Theorem 1 construction on complex, non-commuting data under fixed congruences; the role of each condition in Theorem 1; Corollaries 2–3; formula (7.4); the GLT assemblies for sizes 2 to 14; finite instances of a variant of the Theorem 9 construction (normalised trace $299/1280$ against the predicted $1/4$); and the block example. These test identities and finite assemblies; they do not test limits or quantifiers.
- **Controls and replay.** Every check raises on failure (no `assert`), so Python's `-O` flag does not disable it, and a built-in mutation test corrupts formula (5.2) and confirms that the verifier catches it. From a fresh copy of the package the verifier reproduced its retained output with and without `-O`, and the figure script reproduced both PNG figures byte for byte.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review and an audit of the new proofs by a separate model, a line-by-line proof audit and a clean replay led to one revision round, which added the one-sided envelope, the dichotomy, the block example and the safety box; a re-review found no open correctness issue. The revision record is in the package. None of this is peer review or independent reproduction.
- **Sources.** The arXiv version of the target article was read in full and is quoted; for the published version, short passages were verified verbatim and a separate AI-assisted reading confirmed that its Theorem 3 and Conjecture 1 admit the counterexamples. The 2017 monograph containing the original Conjecture 10.1 was not accessible, so its status is stated conditionally. Jones's preprint is self-hosted and not peer reviewed.
- **Limitations.** Necessity in the dichotomy is proved only for bounded Riemann-integrable scalar symbols depending on position; symbols depending on frequency and block symbols are open. The literature search was dated and bounded, with no author enquiry.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Numerical analysts using GLT theory for discretised PDEs and preconditioners | A precise rule for when the "mean of the symbols" shortcut is valid, and a warning that it can fail silently when coefficients vanish on a region | The dichotomy is exact only for bounded scalar symbols of position |
| Matrix analysts and operator theorists | A rank description of every boundary limit of the geometric mean, with the equal-input and fidelity consequences | The dilation form overlaps with Jones (2026) |
| Quantum-information researchers | Matsumoto fidelity is discontinuous near pure states, with the exact interval of possible limits | Uhlmann fidelity behaves continuously; robustness needs control of the smallest eigenvalues |
| Authors and readers of the 2025 GLT article | Explicit bounded counterexamples and the located failing step | The published-version check is an AI-assisted reading; no correspondence with the authors |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

GLT theory is popular because it turns hard spectral questions about huge matrices into questions about simple functions. That only works if every operation in the calculus is sound. The geometric mean is used in exactly the situations where symbols vanish, such as degenerate diffusion or masked operators, and the counterexamples show that there the calculus can give a confident wrong answer that no inspection of the symbols can detect. The paper replaces the false general rule with a correct one and a one-sided bound that always holds.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root, with Python 3.11 or later:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B verify_exact.py my_results.json        # about 2 s; standard library only
python3 -O -I -B verify_exact.py my_results_O.json   # same result: no assert statements
python3 -I -B verify_exact.py --self-test-mutation   # corrupts formula (5.2) and shows the failure is caught
```

`make_figures.py` redraws both figures with Matplotlib 3.10.8. `AI_INDEX.md` maps each result to its section and evidence, `CHANGES.md` records how each review item was handled, and `source_novelty_ledger.md` records the sources inspected and the dated searches.

## The most valuable next projects

1. Decide whether closure holds for scalar sequences built only from Toeplitz matrices, diagonal samplings and small terms, where the counterexamples' non-local coupling is unavailable.
2. Extend the dichotomy to symbols depending on frequency as well as position, and to block symbols.
3. Identify the extra asymptotic data, beyond the two symbols, that determine the output symbol, for example a contraction-valued field describing the coupling at scale $1/N$.
4. Characterise every limiting spectral law of $A_n\#B_n$ for given input symbols, extending Appendix A beyond projections.
5. Give rank-type descriptions of boundary limits for the harmonic mean, weighted means, other Kubo–Ando means and Karcher means, and a quantitative version of Theorem 1.

## What is in the evidence package

The paper (PDF and Markdown source) with Figures 1 and A.1 and the script that draws them; `verify_exact.py` with its retained output `verification_results.json`; the bibliography (`refs.bib`) with the Crossref and arXiv records it was copied from; the dated source and novelty ledger and novelty report; a revision record (`CHANGES.md`); `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text and figures are CC0-1.0; code is MIT. This remains an unrefereed candidate.
