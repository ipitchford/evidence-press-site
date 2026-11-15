## Summary

**In one sentence.** When a statistical test has to guard against a growing grid of Gaussian null hypotheses, insisting that its e-values be *exactly* calibrated can destroy their power once the grid is fine enough, while ordinary e-values keep theirs; this paper gives the exact phase diagram.

**What an e-value is.** An e-value is a number that measures evidence against a hypothesis. It works like the payoff of a fair bet against the hypothesis: if the hypothesis is true, the payoff's average is at most one, so a large payoff is unlikely and counts as evidence. Payoffs from independent experiments can be multiplied. The quality of an e-value is measured by how fast evidence grows when the hypothesis is false: its expected logarithm, called the *growth rate* or *e-power*, in nats.

**Exact e-values.** Sometimes one asks for more: an e-value whose average is *exactly* one under every hypothesis in the null family, not merely at most one. Such exact e-values waste no evidence and are the counterpart of exactly calibrated p-values. Two facts were known. If the null family is a fixed finite list, exactness costs nothing in the long run (He and Cheng, 2026). If the null family is the whole continuum of Gaussian means, exactness costs everything: no exact e-value has any power (Zhang, Ramdas and Wang, 2024).

**The question.** What happens in between, when the null family is a grid of Gaussian means whose size grows with the amount of data? The paper answers this exactly, in two regimes.

**What is new here.**

| Regime | Result | Where |
|---|---|---|
| Very finely spaced null means | The exact growth rate per unit of information is an explicit function $F(c)$ that falls from $1/2$ to $0$ as the number of null means rises to about $t^2/2$, where $t^2/2$ is the information available. Ordinary e-values keep the full rate $1/2$. At the edge, exact evidence still grows, but only like $\sqrt t$ | Theorem 2 |
| Means spaced at the statistical resolution $1/n$ across a fixed interval $[b-w,b+w]$ | Exact e-values have zero growth rate if and only if $w\ge(2/s)\log\cosh(bs/2)$, where $s/n$ is the spacing, although ordinary e-values keep the rate $(b-w)^2/2$ | Theorem 3, Corollary 4 |
| Every finite problem | A computable kernel quantity pins down the best exact e-power to within $\log(2m+1)$ | Theorem 14 |
| Exact *and* pivotal e-values | Bounded by the exact rate along these growing families, although each fixed finite subfamily gives the full rate: the two limits do not commute | Corollary 5 |
| A small relaxation | Allowing each null average to fall short of one by a small amount restores the ordinary rate | Proposition 6 |

**A concrete example.** Take a true mean of 0, null means around 1, and grid spacing $1/n$. An interval of null means of half-width about $0.240$ around 1 is already enough to make exact e-values useless, while ordinary e-values still grow at about $0.289$ per observation. With $n=6400$ observations and $1281$ null means from $0.9$ to $1.1$, the best ordinary e-value gathers $2592$ nats of evidence on average; the best exact one gathers between $1121$ and $1128$ nats.

**Why.** An ordinary e-value only has to beat *mixtures* of the null distributions, their convex hull. An exact one must cope with every *signed* combination of them, their linear span. Differences of nearby bell curves build polynomial shapes (Hermite polynomials, and Stieltjes–Wigert polynomials when the spacing is of order $1/n$), so the span gets very close to the alternative, and the evidence that an exact e-value can collect shrinks accordingly.

**The cost is a cost of exact equality.** Allowing each null average to fall short of one by $1-e^{-2m\epsilon(t-m\epsilon)}$ restores the ordinary rate (Proposition 6). Anyone who can accept a slight shortfall need not pay this price.

**Limits.** The results cover Gaussian location families with known variance only. The paper studies exactness without pivotality: below the threshold, the rate of exact *and* pivotal e-values is bounded, not determined. The spacing conditions for very finely spaced means are sufficient, not shown to be necessary. The critical window is treated only for very finely spaced means. Above the threshold, exponential smallness is proved only for an auxiliary moment problem; for grids the paper proves loss of the leading rate. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks, not peer review.

## Summary for specialists

Let $\gamma=N(0,1)$, $Q_t=N(-t,1)$ and $\mathcal P_{m,\epsilon}=\{N(j\epsilon,1):|j|\le m\}$. Let $G_{m,\epsilon}(t)$ be the supremum of $E_{Q_t}\log X$ over $X\ge0$ with $E_PX=1$ for every $P\in\mathcal P_{m,\epsilon}$ (exact), and $J_{m,\epsilon}(t)$ the same with $E_PX\le1$ (valid). For $n$ observations, $t=b\sqrt n$ and $\epsilon=\delta_n\sqrt n$.

- **Proposition 1** *(proof)*: $G$ is the minimum of $D(Q_t\Vert R\gamma)$ over the probability densities $R\gamma$ in the linear span of the nulls (bounded $X$ suffice); for $t>m\epsilon$, $J$ is the minimum over the convex hull and equals $(t-m\epsilon)^2/2$.
- **Theorem 2** *(proof)*: if $\epsilon t\to0$ and $m/t^2\to c$, then $G/t^2\to F(c)$, with $F(c)=\tfrac12\sqrt{1-4c}-c\log\frac{1+\sqrt{1-4c}}{1-\sqrt{1-4c}}$ for $0<c<1/4$, $F(0)=1/2$ and $F=0$ for $c\ge1/4$ (the Hermite exterior action). In the critical window $m=t^2/4+at+o(t)$ with $\epsilon t^{5/2}\to0$, $G/\sqrt t\to\Psi(a)=\frac{2\sqrt2}{3}E[(Z-2a)_+^{3/2}]$, and $\Psi(0)\approx0.405$.
- **Theorem 3** *(proof)*: if $\epsilon t\to\kappa\in(0,\infty)$ and $m/t^2\to c$, then $G/t^2\to F(c,\kappa)$, an explicit Stieltjes–Wigert exterior action that is positive exactly when $c<c^*(\kappa)=2\log\cosh(\kappa/2)/\kappa^2$; $F(c,\kappa)\to F(c)$ and $c^*\to1/4$ as $\kappa\to0$.
- **Corollary 4** *(proof)*: for nulls $N(b+js/n,1)^{\otimes n}$, $|j|\le m_n$, $m_ns/n\to w\in[0,b)$, against $N(0,1)^{\otimes n}$: $J_n/n\to(b-w)^2/2$ and $G_n/n\to b^2F(w/(sb^2),bs)$, which is zero if and only if $w\ge w^*(s)=(2/s)\log\cosh(bs/2)$; always $w^*(s)<b$.
- **Corollary 5** *(proof)*: the exact-and-pivotal optimum is at most $G_n$, so its rate is at most $b^2F$ and zero for $w\ge w^*$; for every fixed finite set of null means in $[b-w,b+w]$ the exact-pivotal rate is at least $(b-w)^2/2$, by He and Cheng's Theorem 2.2.
- **Proposition 6** *(proof)*: with constraints $1-\delta\le E_PX\le1$ and $\delta\ge1-e^{-2m\epsilon(t-m\epsilon)}$, the optimum equals $J$.
- **Theorem 14** *(proof)*: for all $m,\epsilon,t$, $\max\{0,\Gamma\}\le G\le\Gamma+\log(2m+1)$, where $\Gamma=t^2/2-E\log K^*_{m,\epsilon}(Z-t)$ and $K^*$ is the sum of the Christoffel functions of two spaces of exponential sums.

## Technical account

**Duality: span versus hull.** Write the null likelihood ratios as $e_j(y)=e^{j\epsilon y-j^2\epsilon^2/2}$. By finite-dimensional entropy duality (Borwein and Lewis), the exact optimum is the Kullback–Leibler distance from $Q_t$ to the nonnegative, normalised members $R$ of the span of the $e_j$, which may carry negative coefficients. The valid optimum is the reverse information projection onto the convex hull, the general characterisation of log-optimal e-variables (Grünwald, de Heide and Koolen; Lardy, Grünwald and Harremoës; Larsson, Ramdas and Ruf). Signed combinations of nearby Gaussians reproduce difference quotients, so the span is far richer than the hull even when all nulls are close in total variation.

**Confluent nulls and Hermite polynomials.** As $\epsilon\to0$ the span becomes $e^{-y^2/2}$ times polynomials of degree $2m$, so the problem reduces to an auxiliary *moment calibration* problem, which matches the first $2m$ derivatives of the null expectation. Its optimum is governed by the Christoffel function of the Gaussian weight. The threshold $t=2\sqrt m$ is the edge of the zero distribution of the Hermite polynomial $H_m$ (the Mhaskar–Rakhmanov–Saff number), and $F$ is the classical exterior action of Plancherel–Rotach asymptotics (Szegő; Saff and Totik; Levin and Lubinsky). Lower bounds come from the Christoffel kernel; upper bounds come from explicit feasible densities built from Hermite polynomials, including a squared Hermite truncation with a positive floor above the threshold. A finite comparison theorem (Theorem 15) transfers them to grids when $\epsilon\sqrt{m+1}\le1/8$.

**Spacing of order 1/t and Stieltjes–Wigert polynomials.** When $\epsilon t$ stays positive, the substitution $x=e^{\epsilon y}$ turns the span into polynomials under a log-normal weight, whose orthogonal polynomials are the Stieltjes–Wigert polynomials. The paper derives their recurrence coefficients, an exact formula for the Christoffel function of the exponential span (Lemma 17), the limiting band of their zeros and the kernel outside the band, and integrates the result into the exterior action $F(c,\kappa)$. The threshold becomes the left edge of the zero distribution.

**Kernel certificate.** Every feasible density is $f^2+g^2$ with $f,g$ in two exponential spans, so it is bounded pointwise by $K^*$; conversely $K^*/(2m+1)$ is feasible. This gives Theorem 14 for every spacing, and the numbers in the worked examples.

**Two worked examples (Section 12).** With $n=1000$, $b=1$ and $201$ null means from $0.9999$ to $1.0001$, the valid optimum is $499.900005$ nats and the exact optimum lies in $[183.93,184.19]$ nats, against the leading prediction $t^2F(0.1)\approx180.95$. With $n=6400$ and $1281$ null means from $0.9$ to $1.1$ (so $t=80$, $\kappa=1$, $c=0.1$), the valid optimum is $2592$ nats and the exact optimum lies in $[1121.40,1127.99]$ nats; that is, $G/t^2\in[0.1752,0.1763]$ against the limit $F(0.1,1)\approx0.1746$. These are ordinary floating-point and mpmath evaluations of proved inequalities, not interval certificates.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/exact-calibration-gaussian-null-families.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 31-page paper. The paper opens with a plain introduction, a table of results and a roadmap, and its final section lists what is not proved. No proof assistant was used.
- **Computational checks.** Four Python scripts check the statements numerically. `verify_and_plot.py` checks the phase function, the critical constant $\Psi(0)=2^{5/4}\Gamma(5/4)/(3\sqrt\pi)\approx0.40543$, 15 kernel brackets and the finite-grid example, and draws Figure 1. `check_finite_grid.py` reproduces the $n=1000$ comparison bracket. `spacing_phase_checks.py` (about 6 minutes) checks the Stieltjes–Wigert recurrence against the moment problem, the kernel formula against a direct Gram computation, the agreement of two formulas for $F(c,\kappa)$, the threshold, the $\kappa\to0$ limit and the certificate brackets. `plot_phase_diagram.py` draws Figure 2. These are numerical sanity checks, not proof certificates.
- **Tests that can fail.** Every check raises an error rather than using `assert`, so the checks stay active under Python's optimised mode. Changing the closed form of the critical constant, or one Stieltjes–Wigert recurrence coefficient, makes the scripts fail under `python -O`, as they must.
- **Replay.** All four scripts were rerun from fresh copies before release, normally and under `python -O`, with pinned numpy, scipy, matplotlib and mpmath; every recorded output was reproduced byte for byte. GitHub CI reruns the quick checks and both negative controls on Linux, and the 6-minute suite as a non-blocking job.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay found no mathematical error and led to one revision round. It rewrote the introduction, positioned the work against Zhang, Ramdas and Wang and against He and Cheng from their papers, credited the classical orthogonal-polynomial results, and added the spacing-$1/n$ phase diagram, the fixed-interval corollary, the kernel certificate, the pivotal corollary and the approximate-exactness proposition. A re-review, a proof audit with independent high-precision recomputation, and a second-model audit of the new proofs found minor items only, which were fixed. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Unit-variance Gaussian location families only. Spacing conditions for confluent nulls are sufficient, not shown necessary; the critical window for $\kappa>0$ and the regime $\epsilon t\to\infty$ are not treated. Exponential vanishing above the threshold is proved for the moment problem only. The exact-and-pivotal rate below the threshold is not determined, and the smallest tolerance that restores the valid rate is not known. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Statisticians designing e-values for composite nulls with a nuisance parameter | See when demanding exact calibration over a fine grid of null values destroys power, and compute the loss for Gaussian location problems | Gaussian means with known variance only; a small shortfall from exactness removes the cost |
| Researchers on exact and pivotal e-values | The order-of-limits contrast with He and Cheng's fixed-family result, and an explicit interpolation to the continuum case of Zhang, Ramdas and Wang | Below the threshold the exact-pivotal rate is only bounded |
| Orthogonal-polynomial and random-matrix researchers | A statistical problem whose answer is a Christoffel-function exterior action, Hermite in one limit and Stieltjes–Wigert at fixed spacing ratio | The asymptotic tools are classical; the new content is the identification and the finite bounds |
| Research agents | Machine-readable claims, an agent index and replayable scripts | The scripts are numerical checks, not proof certificates |

## Why the problem matters

Composite null hypotheses with a nuisance parameter are everywhere in testing, and e-values are increasingly used for them because evidence from independent experiments can be combined safely by multiplication. Exactness is attractive: it avoids wasted evidence and mirrors exact p-values. This paper shows that, for a nuisance parameter discretised at the natural statistical resolution, exactness can cost the whole growth rate even over a fixed, modest interval, and it gives the precise threshold. It also shows that the cost disappears as soon as a small shortfall is tolerated, which tells designers where the trade-off lies.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from a directory outside the package (Python 3.11 with the pinned packages in `verification/requirements.txt`):

```sh
V=/absolute/path/to/package/verification
shasum -a 256 -c MANIFEST.sha256          # at the package root
python3 -m pip install -r "$V/requirements.txt"
python3 -O -I -B "$V/checks/verify_and_plot.py" --no-plots --output /tmp/ecg
python3 -I -B "$V/grid/check_finite_grid.py"
python3 -O -I -B "$V/checks/spacing_phase_checks.py" --output /tmp/ecg/spacing_phase_results.json
```

`ENVIRONMENT.txt` lists the software used. `AI_INDEX.md` maps each claim to its proof and checks, `PRIOR_ART.md` and `RESEARCH_GATES.json` give the prior-work boundary, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Determine the exact-and-pivotal rate below the threshold, or show that it is strictly smaller than the exact rate.
2. Treat the critical window for spacing of order $1/n$, and the regime of coarser spacing.
3. Prove exponential vanishing above the threshold for grids, not only for the moment problem.
4. Extend the phase diagram to other exponential families, or to Gaussian families with unknown variance.
5. Find the smallest shortfall from exactness that restores the ordinary rate.

## What is in the evidence package

The paper (LaTeX source and PDF, with Figures 1 and 2); `verification/checks/verify_and_plot.py`, `verification/grid/check_finite_grid.py`, `verification/checks/spacing_phase_checks.py`, `verification/checks/plot_phase_diagram.py` and their recorded outputs; `verification/requirements.txt`; `PRIOR_ART.md` and `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, figures and data, MIT for code), the CI workflows and SHA-256 sums.
