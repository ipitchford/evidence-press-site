## Summary

**In one sentence.** A family of dependence structures proposed as the exact answer to a question behind a standard forecast score is never exactly optimal away from the classical case, although computations suggest it misses the optimum by only a few parts per million.

**The everyday problem.** When two quantities are forecast together, say the wind at two nearby sites, getting each one's range of outcomes right still leaves open how the two move together. A standard way to score such forecasts (the **energy score**) and to compare two distributions (the **energy distance**) rests on one number: how far apart, on average, two independent draws are, with the distance raised to a power $\beta$ between 0 and 2. Fix both marginal distributions, let only the dependence vary, and ask how large this number can be. The answer is a *dependence uncertainty bound*: the most that the choice of dependence alone can move the score. After rescaling, the marginals are uniform and the dependence is a **copula**.

**What was known.** At $\beta=1$ the answer is a beautiful object. Take points uniformly on a sphere and look at their shadow on a plane: by Archimedes' hat-box theorem the shadows on both axes are uniform, so this **disc copula** has the right marginals, and Bernard and Müller proved that it is optimal. For other powers, Bernard, Müller and Oesting introduced the **$L_p$-spherical copulas**, which bend the disc towards a diamond ($p=1$) or a square ($p=\infty$), and conjectured from computer experiments that the member with $p=3-\beta$ is optimal ([arXiv:2206.10180v1](https://arxiv.org/abs/2206.10180v1), Section 3.2, Conjecture 9).

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The conjecture fails | For every power $\beta\ne1$, a tiny change of the conjectured copula that keeps both marginals uniform increases the score | Theorem 1 |
| No member is ever optimal | Not just $p=3-\beta$: no member of the family, for any $p$ from 1 to $\infty$, is optimal, except the disc copula at $\beta=1$ | Theorem 1 |
| How big the failure is | Even the best member for each $\beta$ falls short by an amount of order $\beta(2-\beta)(\beta-1)^2$; the constants are not computed | Theorem 2 |
| An exact certificate | Integer and rational arithmetic certifies a concrete better copula at $\beta=3/2$ | Appendix B |
| The loss is tiny (numerical) | An explicit copula beats the conjectured member by between about two in ten million and three in a hundred thousand of the optimal value | Section 7 |

**The idea.** If a copula is optimal, moving a little mass in a plus–minus–minus–plus pattern on a small rectangle, which keeps both marginals, cannot help. That forces a smoothness property on the copula's density, seen through a Fourier-type inversion of the distance kernel. The conjectured densities have a small kink where they cross the coordinate axes, so they fail the test. Separate arguments handle the remaining members: the disc copula, even $p$, the diamond and the uniform square.

**Limits.** The true optimal copula for $\beta\ne1$ is still unknown; it exists and is unique, but is not identified. The constants in the size estimate are not computed. The numerical shortfall values are floating-point estimates on discretised copulas, not certified bounds. Only two dimensions are treated. **Practical reading:** the $L_p$-spherical copulas remain an excellent approximation for dependence uncertainty bounds; they are simply not the exact answer. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks.

## Summary for specialists

Work on the centred square $Q=[-1,1]^2$. Let $\mathcal C$ be the probability measures on $Q$ with both marginals uniform, and for $0<\beta<2$ put

$$J_\beta(\mu)=\iint|z-w|^\beta\,d\mu(z)\,d\mu(w),$$

with $|\cdot|$ the Euclidean norm. Let $\mu_p$ ($1\le p\le\infty$) be the centred $L_p$-spherical copula (Bernard, Müller and Oesting's "circular" version), $\mu_2$ the disc copula, $M_\beta=\max_{\mathcal C}J_\beta$ and $S_\beta=\max_pJ_\beta(\mu_p)$.

- **Theorem 1** *(proof)*: $\mu_p$ maximises $J_\beta$ over $\mathcal C$ if and only if $(p,\beta)=(2,1)$. For $\beta\ne1$ a smooth marginal-preserving perturbation supported near $(0,1/2)$ strictly increases $J_\beta(\mu_{3-\beta})$.
- **Theorem 2** *(proof)*: there are constants $0<c<C<\infty$ with
$$c\,\beta(2-\beta)(\beta-1)^2\le M_\beta-S_\beta,$$
$$M_\beta-S_\beta\le C\,\beta(2-\beta)(\beta-1)^2,$$
and $(M_\beta-S_\beta)/\beta$ and $(M_\beta-S_\beta)/(2-\beta)$ have positive finite limits at $0$ and $2$ (Propositions 17 and 18). The constants are not computed.
- **Lemma 3 and Theorem 4** *(proof)*: on an open set where an optimal law has density bounded below, its mixed derivative $\partial_x\partial_y$ is a smooth function. Lemma 3 is an elliptic inversion for compactly supported distributions whose mixed potential is smooth.
- **Propositions 5–10** *(proof)*: the axis cusp of $\mu_p$ for non-even $p$; the disc copula only at $\beta=1$; even $p\ge4$; the independence copula; the diamond.
- **Proposition 11** *(proof)*: the maximiser $\nu_\beta$ exists and is unique.
- **Appendix A, Theorem 19** *(proof)*: an explicit high-frequency oscillating variation with its first-order gain.
- **Appendix B** *(exact certificate)*: at $\beta=p=3/2$ the four-corner contrast $\mathcal D$ satisfies
$$\frac{15382}{10^9}\le\frac{\mathcal D}{4^{3/4}}\le\frac{305131}{10^9},$$
so an explicit four-rectangle perturbation improves $J_{3/2}(\mu_{3/2})$ by more than $1.3\times10^{-12}$. This certifies one perturbation, not the gap.

**Known and new.** Bernard and Müller's theorem settles $\beta=1$, and Bernard, Müller and Oesting's family and conjecture come from their numerical optimisers. The disproof for every $\beta\ne1$, the classification of the whole family, the order of the gap, the regularity principle and the certificate are new here, within a literature search of limited scope.

## Technical account

**The local test (Sections 3–4).** If $\nu$ is optimal and $h$ is a signed perturbation with zero marginals supported where $\nu$ has density bounded below, first-order optimality gives $\int U_\nu\,h=0$, where $U_\nu$ is the potential of $\nu$. Plus–minus–minus–plus perturbations on small rectangles therefore force $\partial_x\partial_yU_\nu=0$ there. The Riesz kernel $|z|^\beta$ has Fourier symbol proportional to $|\xi|^{-2-\beta}$, and Lemma 3 inverts the mixed derivative up to a smoothing error, so the mixed derivative of the density is smooth on that set (Theorem 4).

**The axis cusp.** For non-even $p$ the mixed derivative of the density of $\mu_p$ behaves on the line $y=1/2$ like a positive multiple of $\operatorname{sgn}(x)|x|^{p-1}$, which is not smooth across the axis unless $p$ is even, so Theorem 4 rules $\mu_p$ out (Proposition 5). On the conjectured curve $p=3-\beta$ lies in $(1,3)$, whose only even integer is $p=2$, that is $\beta=1$. Even $p$, the disc copula away from $\beta=1$, the independence copula and the diamond need separate arguments (Propositions 6–10).

**The size of the gap (Section 6).** Near $\beta=1$, a comparison with the disc copula gives the upper bound, and two test perturbations, together with the $p$-derivative of the family (Lemma 14), give the matching lower bound of order $(\beta-1)^2$ (Proposition 15). At the endpoints every copula has the same score ($J_0\equiv1$ and $J_2\equiv4/3$ on the centred square), which produces the factor $\beta(2-\beta)$; Propositions 17 and 18 identify the limits.

**The certificate (Appendix B).** With $u=|Z-z|^2/4\in[0,1]$, the Taylor polynomial of degree 200 of $(1-v)^{3/4}$ brackets $u^{3/4}$ with signed coefficients. The even moments of $\mu_{3/2}$ are explicit gamma ratios from a Dirichlet law, and the gamma constants are enclosed by alternating Taylor sums. All comparisons are exact fractions.

**The numerical profile (Section 7).** Divide $Q$ into $n\times n$ cells and spread mass uniformly in each. Copulas of this kind form a transport polytope on which $J_\beta$ is a concave quadratic. The Frank–Wolfe algorithm with exact line search gives an explicit copula (a lower bound for $M_\beta$, up to rounding) and a duality gap (an upper bound within the grid), at $n=64,128,256$ and seven powers.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/lp-spherical-copula-gini-conjecture.txt) is available for reading.

- **Proofs.** The 17-page paper opens with a plain introduction (the problem, why it matters, what was known, what is new and a roadmap) and gives written proofs of every theorem; the merged appendix gives an explicit oscillating improvement. No proof assistant was used.
- **Exact check.** `certificate.py` uses only exact integer and rational arithmetic and proves the Appendix B enclosure in a few seconds.
- **Numerical checks.** `diagnostics.py` recomputes the certified contrast by an independent quadrature (about $1.4805\times10^{-4}$), the disc-copula value and slope at $\beta=1$, and the sign of the diamond bracket. `gap_profile.py` computes the Section 7 profile, `check_discretisation.py` checks its accuracy (for the disc copula the discretisation error falls as the cube of the cell size) and `make_table.py` rebuilds Table 2 from the stored results.
- **Tests that can fail.** No check uses `assert`; every check raises an error on failure, also in Python's optimised mode. Two negative controls (a moved evaluation point in the certificate and a shifted enclosure in the diagnostics) each make the check fail.
- **Replay.** The certificate, diagnostics, discretisation check and table were rerun from a fresh copy before release; all outputs matched the recorded ones. The long Frank–Wolfe runs were replayed by the lead at two powers with identical results. GitHub CI reruns the quick checks on Linux with exact comparison for the certificate and a declared tolerance for the diagnostics.
- **Review.** A combined internal Claude review panel and a separate methodology and proof audit, the lead's exact rational certificate replay, one revision round, then a re-review and a proof audit of the new proofs (Lemma 3, elliptic inversion). No Astra/Codex review took place. Every cited source was obtained and read; the conjecture is cited from the arXiv preprint. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The optimal copula for $\beta\ne1$ is unknown; the constants of Theorem 2 are not computed; the Section 7 gap profile (checkerboard copulas, Frank–Wolfe) is floating point and not certified, and its smallest margins are the least secure; only two dimensions are treated; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Statisticians using the energy score or energy distance | Bound how much the score can change when only the dependence between two variables is unknown; the $L_p$-spherical copulas are a good practical approximation | They are not the exact optimum, and the exact bound is unknown |
| Researchers on fixed-marginal optimisation | A local regularity principle and an axis-cusp test that may transfer to other problems | Proved here for the Riesz-type distance kernel in two dimensions |
| Authors of the conjecture and its users | The conjecture is settled for every power, with the size of the loss estimated | The size estimates are floating point |
| Research agents | Machine-readable claims, an agent index and a replayable exact certificate | The profile is not certified |

## Why the problem matters

Dependence uncertainty bounds tell a forecaster how much of a score is decided by the joint behaviour of the variables rather than by their individual distributions. The energy score is one of the standard ways to evaluate multivariate probabilistic forecasts, so its extreme values under fixed marginals are of practical interest. The result separates two questions that are easy to conflate: whether a proposed family is exactly optimal (it is not, except in the classical case) and whether it is good enough in practice (numerically, it is very close).

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12, from the package root:

```sh
uv run --python 3.12 python3 \
  -I -B -O code/certificate.py
uv run --python 3.12 \
  --with numpy==2.3.5 --with scipy==1.17.0 \
  python3 -I -B -O code/diagnostics.py
```

The certificate takes seconds and must print the enclosure exactly. `README.md` lists every script and the comparison policy, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Identify the optimal copula for $\beta\ne1$: does it have full support, a singular part or a boundary singularity like the $L_p$-spherical laws?
2. Compute certified two-sided bounds for the optimal value, turning the Section 7 profile into rigorous numbers.
3. Determine the constants of Theorem 2 and the slope of the best family parameter at $\beta=1$.
4. Extend the classification to dimension three and higher, where Bernard, Müller and Oesting also define the family.

## What is in the evidence package

The paper (`manuscript.pdf`, its LaTeX source `manuscript.tex`, and `figures/witness.pdf`); seven scripts in `code/` (the exact certificate, the diagnostics, the profile code, the discretisation check, the table builder and the figure script); the stored profiles at seven powers, the summary, the Table 2 source and the discretisation checks in `results/`; `requirements.txt`; `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
