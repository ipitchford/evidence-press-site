## Summary

Knowing exactly where equality occurs is not the same as knowing how sensitive it is. This candidate asks how quickly a particular mathematical gap opens when the distances in an equality example change slightly.

The examples are **complete split metrics**: points are divided into two parts, with distances one within the first part and across the split, and two within the second part. The paper determines the smallest and largest possible first-order rates of departure from equality. They are exact constants, supported by complete certificates—not the extremes of a random sample.

Four points provide a useful warning. At a particular three-armed star, changing the arm lengths opens the gap quadratically rather than linearly. The higher-cardinality linear conclusion cannot simply be extended downwards.

## Summary for specialists

Write $s=\operatorname{CS}(a,r)$ and $m=a+r$, with

$$p=\log_2\frac{r(a+1)}{a(r-1)}.$$

Let $\Delta_p(d)$ be the least eigenvalue of $-d^p$ restricted to $\mathbf1^\perp$. Normalise the mean cross-distance to one and put $h=\|d-s\|_\infty$.

At the binding pairs $(k,k)$, $(k,k+1)$ and $(k,k+2)$ with $m\ge6$, and at $(2,3)$, the candidate proves

$$A_{a,r}h-b_{a,r}h^2\le\Delta_p(d),$$

$$\Delta_p(d)\le U_{a,r}h+p(m-1)h^2,$$

on an explicit neighbourhood, with both first-order coefficients attained. Here

$$A_{a,r}=\frac{2pc_{a,r}}{ma(r-1)},$$

$$U_{a,r}=\frac{pr(3a-1)}{2m}.$$

The paper supplies all six small exceptional $c_{a,r}$ values and three stable formulas.

For $m\ge9$, the lower coefficient is $p_m(m+1)/(m(m-1))$ for odd $m$, $p_m/(m-2)$ for the even balanced split, and $p_m/m$ for the even adjacent split. These formulas use the normalisation and norm just specified.

## Technical account

The active triangle and Ptolemy inequalities become an exact linear cone. A direction satisfying those constraints is not merely a formal relaxation: adding a controlled inward term of order $t^2$ produces a genuine Ptolemaic curve.

The sharp cone optimisation is certified by **18 rational-function dual families** and **36 small rational certificates**. Nonnegative coefficients after a parameter shift establish the universal range; checking a few dimensions would not do that job. A written Schur-complement argument then supplies the spectral remainder bounds.

![Exact first-order rates for the seven-point split, and the different four-point quadratic regime.](/assets/art/ptolemaic-split-stability-rates.svg)

*For the seven-point split $\operatorname{CS}(3,4)$, $p=\log_2(16/9)$ and the limiting gap-to-perturbation ratio ranges from $2p/21$ to $16p/7$. The endpoints are attained. This is a diagram of exact first-order rates, not a plot of simulated finite perturbations. At four points, the displayed unequal-arm family has a quadratic leading term instead.*

The metric's own critical exponent satisfies, at a fixed covered split,

$$\wp(d)-p=\frac{m\Delta_p(d)}{r(a+1)\log 2}+O(h^2).$$

The matrix criterion for this endpoint and quantitative extension from strict negative type have earlier precedents. The proposed contribution is the exact split-specific directional calculation, not the discovery of spectral perturbation or strict descent.

## Evidence, assurance and limitations

The complete certificate tables, exact verifiers, numerical experiments and review response are in the archive. A separate supplied checker reconstructs the constraints without importing the author's geometry code; it passed locally. That is implementation diversity inside the publication workflow, **not unaffiliated reproduction**.

Review identified a real software defect: Python optimisation could remove proof-critical assertions. The corrected code uses explicit failures. Rehashed corrupt certificates are rejected in ordinary Python, `-O`, `-OO` and both optimisation environment modes. The original reviewer fault test also now fails safely.

The analytic arguments are not formally verified. Numerical trials use specified mixtures of two extremising directions, not arbitrary cone sampling. No external specialist endorsement, exhaustive priority finding, general four-point quadratic lower theorem or numerical global separated-class constant is claimed.

## Relationship to earlier work

The [earlier Evidence Press release](/releases/ptolemaic-negative-type/) concerns a sharp global threshold. This companion asks a different question: local sensitivity near the specified equality metrics. Its direct cone and spectral proof does not require the earlier universal theorem. Calling the local list globally complete, and interpreting collision limits, retains the companion and source premises.

Sánchez supplies a finite distance-matrix characterisation of the critical exponent. Li and Weston supply quantitative extension and strict descent. Ercan's inversion transport and the four-point threshold of Baker, Huh, Kummer and Lorscheid remain explicitly credited. Their gap conventions and theorem scopes must not be silently identified with those used here.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Metric geometers | Sharp local constants and feasible directions near split equality cases | Global completeness has separate dependencies |
| Spectral analysts | An explicit cone-to-eigenvalue sensitivity calculation | The expansion is local and at fixed cardinality |
| Certificate researchers | Finite symbolic witnesses for an infinite parameter family | A checked identity does not formalise the analytic bridge |

## Why the problem matters

An equality classification locates an extremum. A stability theorem quantifies how strongly nearby objects depart from it. Sharp rates distinguish directions that are almost insensitive from those that change much faster, and the four-point exception shows why that information cannot be inferred from equality alone.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md`, Theorem 2.1 and the dependency paragraph in the paper. Install the pinned `requirements.txt`, then run:

```sh
python -B replay.py --mode full --output ../replay
python -O -B replay.py --mode full --output ../replay-optimized
python -B code/test_verifier_modes.py --output ../mode-controls
```

Outputs stay outside the frozen package. Exact report bytes must match; floating-point numerical results are corroborative and may vary. Inspect `REPLAY_RECEIPT.md` for the separate reconstruction checker and the limits of each route.

## The most valuable next projects

The strongest next step is to isolate a reusable theorem joining an exact tangent cone, a simple spectral zero and nonlinear realisation, then test it on a genuinely different family. That generalisation is not part of this release. Other targets are a general four-point quadratic lower bound, the unresolved five-point global equality classification, and sharper uniform second-order estimates.

## What is in the evidence package

The archive contains the PDF, TeX and accessible manuscript; all small and universal certificates and expanded tables; pinned verification code; retained original audit and new repair receipts; a point-by-point response; source and dependency audits; an AI index and machine-readable claims; and the unchanged historical v0.2 supplement. Original prose and data are CC0, original code MIT, with third-party and historical exceptions recorded separately.
