## Summary

**In one sentence.** The greedy rule that every linear-algebra library uses to pick a few "measurement points" out of thousands, column-pivoted QR, can lose against the best possible choice by a factor of about $e^{C\sqrt k}$ with an exact constant $C$, and never by the $2^k$ that the textbook guarantee allowed.

**The everyday problem.** Many simulations and data methods keep only a few measurement points out of thousands. Suppose you have $k$ important patterns, for example the main modes of a fluid flow sampled at $N$ grid points, and you want to read just $k$ of the $N$ values and still reconstruct the rest. The standard way to pick the points is a greedy rule built into every linear-algebra library, *column-pivoted QR*: repeatedly pick the point that the points already chosen explain least. This is, for example, how the interpolation points of the discrete empirical interpolation method (DEIM) are often chosen.

**How quality is measured.** One number, $\gamma$, measures a choice of points: the factor by which reconstruction from the chosen points can be worse than the best possible reconstruction from the same patterns. Good choices with modest $\gamma$ always exist. The question is how bad the greedy choice can be.

**What was known.** A textbook guarantee (Drmač and Gugercin) only said that $\gamma$ grows at most like $2^k$, which is astronomically large already at $k=100$ (about $10^{30}$). A list of open problems from a Simons workshop (Amsel et al., Problem 4.3, posed by Damle and Kressner) asked whether the greedy rule does as well as the best choices, up to a polynomial factor. Chen, Liu, He and Dong answered first, and negatively: their examples grow faster than any polynomial, and their construction already gives growth of order $e^{c\sqrt k}$ with a small constant $c$. Damle showed that a modified greedy rule (Bischof–Stewart pivoting) does meet the existence scale.

**What is new.**

| What | In plain terms | Where |
|---|---|---|
| An upper bound below $2^k$ | The greedy rule is never worse than $e^{C\sqrt k}$ times the existence scale. The constant $C$ depends on how evenly the energy is spread over the points (the *coherence* $H$): $C=2$ when all points carry equal energy, and $C\approx2.25$ when no point carries more than twice the average | Theorem 2.3 |
| The constant is the right one | Examples come arbitrarily close to the bound, so $C$ cannot be lowered | Theorem 2.3 |
| No assumption needed | Coherence can never exceed $N/k$, so the bound holds for every input | Corollary 2.6 |
| The law in $N$ and $k$ | In terms of $N$ and $k$ alone, the worst case is $e^{\Theta(\sqrt{k\log N})}$ once $N$ is a bit larger than $k^2$, with the exact constant when $N$ is much larger than any power of $k$ | Theorem 2.7, Corollary 2.8 |
| A free check afterwards | The pivots that the factorisation already computes give a bound on $\gamma$, with an optimal constant | Theorem 7.1 |

**What it means at practical sizes.** At $k=100$ the new bound allows about $10^{9}$ to $10^{10}$ where the textbook bound allowed about $10^{30}$. It is smaller than the textbook bound from $k=13$ onwards when all points carry equal energy, and from $k=15$ when no point carries more than twice the average.

**Limits.** The results are about exact arithmetic and about worst cases; typical inputs behave far better, and floating-point behaviour is not analysed. "Sharp" means the leading term of the exponent: upper and lower bounds still differ by a factor polynomial in $k$, and the limits are approached slowly. The worst examples need $N$ of order $k^3$; what happens when $N$ is a fixed multiple of $k$ is open. At exactly equal energies ($H=1$) the matching examples rely on a stated tie-breaking rule (smallest label first). This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks, not peer review.

## Summary for specialists

Let $Q\in\mathbb C^{N\times k}$ with $Q^*Q=I_k$. Exact QRCP on $Q^*$ selects rows $I$, with any tie-breaking (a *legal selection*), and

$$\gamma(Q,I)=\|Q(I,:)^{-1}\|_2 .$$

The coherence is

$$\mu(Q)=\frac Nk\max_j\|Q(j,:)\|_2^2\in[1,N/k].$$

For $H\ge1$ let $\rho\ge1$ solve $\rho-\log\rho=1+\log H$ and put

$$C(H)=\sqrt\rho+\frac1{\sqrt\rho},$$

so $C(1)=2$, $C(2)\approx2.2476$ and $C(H)^2/\log H\to1$.

- **Theorem 2.3** *(proof)*: if $\mu(Q)\le H$, every legal selection satisfies

$$\gamma(Q,I)\le\sqrt{e(N-k+1)}\;e^{C(H)\sqrt k}.$$

  The worst case $G_k(H)$ of $\gamma/\sqrt{N-k+1}$ satisfies $\log G_k(H)=(C(H)+o(1))\sqrt k$. For $H>1$ the matching examples are real, have fewer than $3k^3$ rows and unique pivots; at $H=1$ they use the smallest-label tie rule.
- **Corollary 2.6** *(proof)*: for every orthonormal input, $\gamma\le\sqrt{e(N-k+1)}\,e^{C(N/k)\sqrt k}$, and

$$C(H)^2\le\log H+\log(1+\log H)+5 .$$

- **Theorem 2.7 and Corollary 2.8** *(proof)*: let $\Gamma_k(N)$ be the worst case at exactly $N$ rows, with no coherence assumption. Then $\log\Gamma_k(N)=\Theta\bigl(\sqrt{k\log(N/k)}\bigr)$ once $N\ge k^{2+\varepsilon}$ and $\log N=o(k)$, and

$$\log\Gamma_k(N)=(1+o(1))\sqrt{k\log N}$$

  when $\log N/\log k\to\infty$. At $N=k^\alpha$ the normalised exponent lies between $\sqrt{\alpha-2}$ and $\sqrt{\alpha-1}$.
- **Theorem 7.1 and Proposition 7.2** *(proof)*: with $d_1\ge\dots\ge d_k$ the diagonal of the triangular factor and $L=\log(d_1^2/d_k^2)$,

$$\gamma\le\frac{\sqrt e}{d_k}\,e^{\sqrt{(k-1)L}},$$

  and the coefficient one in the exponent is optimal.

**Known and new.** The existence scale and Problem 4.3 are recorded by Amsel et al.; the $2^k$ bound is Drmač–Gugercin's Theorem 2.1; the pivot floor of Lemma 3.1 is Engler's; the matching examples build on Kahan's triangular matrix. Chen, Liu, He and Dong gave the first, negative answer to Problem 4.3, and their Lemma 24 already gives growth $e^{c\sqrt k}$ for every $c<\tfrac12\sqrt{\log H}$ (about $0.42$ at $H=2$, against $C(2)\approx2.25$). The new parts are the matching universal upper bound, the exact constant $C(H)$, the endpoint $H=1$, the coherence-free law and the a posteriori bound. The determinant estimate of Lemma 3.3 is classical; the paper gives its own short proof and claims no novelty for it.

## Technical account

**What greedy pivoting guarantees.** The classical analysis uses the greedy inequalities one matrix entry at a time, and Kahan's matrix shows that inequalities of that type alone allow exponential growth. Lemma 3.1 extracts more: every selected column has bounded energy on *every* trailing block of coordinates, simultaneously, and orthonormality imposes a floor on the pivots, $d_i^2\ge(k-i+1)/(N-i+1)$.

**The upper bound.** A diagonal change of scale turns these constraints into a bound on the Frobenius norm of a triangular matrix with unit diagonal (Lemma 3.2). The scale is chosen to grow quickly while the pivots are large and slowly once they approach the floor. A determinant argument then bounds the inverse of the triangular matrix (Lemma 3.3), and optimising the shape of the scale gives the constant $C(H)$ (Section 4).

**The matching examples.** A generalised Kahan matrix whose diagonal follows the same two-part profile, first steep and then along the floor, forms the selected block (Section 5). It is completed to an orthonormal matrix by many extra columns built from Hadamard matrices, each too small to be picked, so the greedy rule selects exactly the intended rows. At $H=1$, where all row energies are equal, the completion uses a local inverse-function argument and, in Appendix A, an explicit four-wise independent sign design of polynomial size.

**The law in $N$ and $k$.** Coherence is at most $N/k$, so the upper bound applies to every input. A family of generalised Kahan blocks with unique pivots gives the matching lower bound $\log\Gamma_k(N)\ge\sqrt{kL}-L-\log k-3$ with $L=\log(N/(66k^2))$, which yields the law above.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/column-pivoted-qr-orthonormal-worst-case.txt) is available for reading.

- **Proofs.** Every theorem has a written proof in the 18-page paper. The paper opens with a plain introduction (the problem, what was known, what is new, what is not claimed and a roadmap) and ends with practical guidance, the computational checks, open problems and an AI-use statement. No proof assistant was used.
- **Computational checks.** `code/verify.py` runs six suites: exact rational identities for Kahan cores; 25 orthonormal inputs checked against the inequalities of the paper; eleven completed examples at $k=16$ to $128$, factorised by two independent QRCP implementations; the large-rank core sums up to $k=10^6$ against 80-digit values; the endpoint construction at $k=4$; and the finite-field design for $k=4$ and $8$. `code/check_extensions.py` works in 50-digit arithmetic: it checks $C(H)$ against a direct minimisation, the bound on $C(H)^2$, the comparison table with the textbook bound, the Kahan family for $k=6$ to $16$ with exact QRCP, and the inequality behind the lower bound in $N$ and $k$ on 779 grid points. These are finite checks; the unrestricted statements rest on the proofs.
- **Tests that can fail.** No check uses `assert`, so the scripts behave identically under Python's optimised mode. Changing one constant in the grid inequality from 3 to 1 makes `check_extensions.py` exit with failure, and `verify.py` rebuilds a small candidate that failed its intended pivot order in an earlier run and requires both QRCP implementations to reject it.
- **Replay.** All scripts (the three checks also under optimised mode) were rerun from fresh copies before release under Python 3.12 with pinned libraries; every output matched the recorded file apart from timestamps and timings. GitHub CI reruns the three checks on Linux under `-O` and compares the outputs with the recorded files as a blocking job, under a declared policy: exact files identical apart from an interpreter-version field, floating-point fields within a relative tolerance of $10^{-9}$, and rounding diagnostics below the scripts' own thresholds.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay found no mathematical error. The revision round stated the credit to Chen et al. quantitatively, added credit to Engler, Kahan and Count ex Machina, corrected a theorem number, rewrote the introduction for non-specialists, and added the coherence-free bound, the law in $N$ and $k$ and the 50-digit checks. A re-review and a proof audit of the new proofs by Claude verification passes followed and found no error; a planned second-model audit of the new proofs was not run because that model's usage limit had been reached. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Exact arithmetic and worst cases only; floating-point QRCP, pivoting with a tolerance and perturbed data are not analysed. Sharpness is on the logarithmic scale, with a factor polynomial in $k$ remaining. The worst examples need $N$ of order $k^3$; the regime $N=O(k)$ is open. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Model-reduction practitioners using DEIM or Q-DEIM | A worst-case guarantee of about $e^{C\sqrt k}$ instead of $2^k$ for points picked by column-pivoted QR, and a free bound from the computed pivots | Worst cases are rare, structured inputs; exact arithmetic |
| Numerical analysts | The exact exponent of the worst case, a reusable upper-bound technique, and the open problem at a fixed aspect ratio | Sharp only on the logarithmic scale |
| Users of subset selection and rank-revealing factorisations | Evidence for when to switch to a rule with a polynomial guarantee, such as strong rank-revealing QR or Bischof–Stewart pivoting | The bound concerns orthonormal inputs |
| Research agents | Machine-readable claims, an agent index and replayable checks with negative controls | The checks are finite; the proofs carry the general statements |

**Practical advice from the paper.** Computing $\gamma$ after the selection is cheap. If it is large, switch to a rule with a polynomial guarantee.

## Why the problem matters

Column-pivoted QR is the default way to choose interpolation points, sensors and representative columns, because it is fast and available everywhere. Its only general guarantee was exponential, far from what is observed. Knowing the true worst case, with its constant, tells practitioners how much the cheap rule can cost in the worst case and makes clear that the gap to the best choices is real but far smaller than the textbook bound suggested.

## Related Evidence Press releases

No earlier Evidence Press release studies QR pivoting, DEIM, rank-revealing factorisations or Kahan matrices.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/), from the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
UV="uv run --python 3.12 --with numpy==2.3.5 \
  --with scipy==1.17.0 --with sympy==1.14.0 \
  --with mpmath==1.3.0"
$UV python -O -I -B code/verify.py \
  --output results/verification.json
$UV python -O -I -B code/check_extensions.py \
  --output results/extensions.json
$UV python -O -I -B code/fingerprints.py \
  --output results/fingerprints.json
```

Each script takes a few seconds. `ENVIRONMENT.txt` lists the software used and the cross-platform comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Determine the worst case when $N$ is a fixed multiple of $k$; even whether it grows like $e^{c\sqrt k}$ is unknown.
2. Find the polynomial factor that remains between the upper and lower bounds at fixed coherence.
3. Close the window between $\sqrt{\alpha-2}$ and $\sqrt{\alpha-1}$ at $N=k^\alpha$.
4. Extend the analysis to floating-point QRCP and to approximate pivoting, and decide which other pivot rules give constraints strong enough for the same argument.

## What is in the evidence package

The paper (LaTeX source and PDF) and its figure with plot data; `code/verify.py`, `code/check_extensions.py` and `code/fingerprints.py` with their recorded outputs in `results/`, including the record of the initial failed run; `code/make_figure.py`; `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and SHA-256 sums.
