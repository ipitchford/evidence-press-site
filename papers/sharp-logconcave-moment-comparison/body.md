## Summary

Two distributions compete to set the sharp limits on the size of fluctuations: a symmetric Laplace distribution, and an exponential distribution shifted so that its mean is zero. This mathematical candidate determines which one wins when all distributions are centred, log-concave and compared at the same variance.

A moment measures size by raising the absolute value to a power and averaging. Changing that power changes how strongly large deviations count. Below power two, the question is how small this measure can be; above two, it is how large it can be. The sharp answer switches from the symmetric distribution to the shifted exponential at a single power near **1.682457208**. At the switching point both families attain the bound. At power two there is no competition: the normalisation makes every admissible distribution equal.

The predicted switch comes from Melbourne, Roysdon, Tang and Tkocz. This candidate supplies a proof of the remaining real-exponent optimisation and classifies equality. It also gives a qualitative consequence: after fixing variance, nearly optimal distributions approach the appropriate equality set. It does not give an explicit formula for how close they must be.

## Summary for specialists

Let $X$ be a nondegenerate, mean-zero real random variable with a log-concave density. Write $\|X\|_p=(\mathbb E|X|^p)^{1/p}$, and let $E,E'$ be independent standard exponentials. Define

$$
A(p)=\frac{\Gamma(p+1)^{1/p}}{\sqrt2},
$$

$$
B(p)=(\mathbb E|E-1|^p)^{1/p}.
$$

There is a unique $p^*\in(1,2)$ with $A(p^*)=B(p^*)$, and the exact rational bracket is

$$
1.682457208<p^*<1.682457209.
$$

| Exponent | Sharp comparison | Equality, up to scaling and reflection |
|---|---|---|
| $1<p<p^*$ | $\lVert X\rVert_p\ge A(p)\lVert X\rVert_2$ | Laplace law $E-E'$ |
| $p=p^*$ | Both lower constants agree | Exactly the Laplace and centred-exponential families |
| $p^*<p<2$ | $\lVert X\rVert_p\ge B(p)\lVert X\rVert_2$ | Centred exponential $E-1$ |
| $p=2$ | Identity | Every admissible law |
| $p>2$ | $\lVert X\rVert_p\le B(p)\lVert X\rVert_2$ | Centred exponential $E-1$ |

For each fixed $p>1$, $p\ne2$, a vanishing logarithmic deficit forces variance-one laws towards the equality set in total variation and every finite Wasserstein distance. The conclusion is uniform over compact exponent sets contained in one of $(1,p^*)$, $(p^*,2)$ or $(2,\infty)$. The fixed-exponent statement includes $p=p^*$, with both families allowed. No explicit deficit-to-distance rate, or uniform assertion across the transitions, is supplied.

## Technical account

Eitan's established real-exponent reduction restricts the optimisation to the following family, with $0\le s\le1$:

$$
Z_s=s(E-1)-(1-s)(E'-1).
$$

Reflection reduces the parameter interval to $[0,1/2]$. The manuscript gives a self-contained, equality-sensitive treatment using crossing arguments and a Chebyshev system. It does not claim that the reduction or equality-sensitive reasoning originated here.

The remaining objective is the logarithm of $\|Z_s\|_p/\|Z_s\|_2$. A single numerical grid would not settle its extrema: derivatives vanish at the parameter endpoints, every objective value is zero at $p=2$, and the preferred endpoint changes at $p^*$. The proof therefore separates bulk rectangles, endpoint neighbourhoods and a strip around two. Arb ball arithmetic encloses the relevant values or derivatives on entire rational boxes. An analytic estimate covers every real $p\ge7$, completing the unbounded range without extrapolating a finite scan.

Strict inequalities exclude other extremisers. Separately, uniform exponential tails, compactness and continuity of moments turn equality classification into qualitative distributional stability. This is different from the explicit quadratic gaps for the reduced parameter $s$: neither supplies a quantitative distributional rate.

For a concrete normalisation check, $\mathbb E(E-1)^4=9$, so $\mathbb EX^4\le9(\mathbb EX^2)^2$. This fourth-moment case was already known from Eitan. The contribution is not a new kurtosis bound; it is completion across the remaining real exponents and the transition classification.

## Evidence, assurance and limitations

This is an unrefereed, AI-assisted mathematical candidate. Its evidence combines written analytic arguments with production ball-arithmetic enclosures. Those enclosures support the encoded inequalities on their declared domains; they do not independently verify the reduction, the compactness proof or every manuscript statement.

The revised package separates exact exported interval endpoints from rounded diagnostic summaries. Historical samples, timings and development checks are not fresh production replay. The final replay receipt and environment record must be inspected for the actual tested version. Internal AI scrutiny is not external specialist endorsement, unaffiliated reproduction, journal peer review or proof-assistant verification.

The result requires centring and log-concavity. It does not solve the general two-exponent moment problem, prove irrationality of $p^*$, or give a quantitative distributional stability estimate. The versioned research package is available from [Zenodo](https://zenodo.org/records/23405173) and the [GitHub candidate release](https://github.com/ipitchford/sharp-logconcave-moment-comparison/releases/tag/v1.0.0-candidate).

## Relationship to earlier work

[MRTT, §3.1](https://arxiv.org/html/2505.00944v2) posed this variance-normalised question and predicted the change of extremiser numerically. Their earlier sharp lower comparison covers $-1<p\le1$. [Eitan](https://arxiv.org/abs/2110.14382) provides the real-exponent reduction, equality information and the even higher-moment variance comparison. The candidate completes the remaining reduced optimisation; a bounded literature search does not establish unconditional priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probability and convex-geometry researchers | Sharp constants and complete equality cases for centred log-concave laws | Inspect both the reduction and the computed regional bounds |
| Computer-assisted proof developers | A worked example of endpoint analysis and exact regime stitching | Arithmetic correctness does not validate the mathematical encoding |
| Researchers studying near-extremisers | A qualitative compactness route to distributional convergence | No computable stability rate is provided |

## Why the problem matters

Variance describes only one aspect of a distribution. Sharp comparisons tell us what other moments can and cannot do under a structural assumption. Identifying the equality cases explains why the bounds have their particular form—and why a symmetric distribution need not always be the extremal one.

## How to inspect or reproduce the recorded checks

Begin with the manuscript's theorem statements, assumptions and regional assembly. Then follow the package's `AI_INDEX.md`, `CLAIMS.json`, environment record and replay instructions. The proof-critical groups are bulk B1–B4 and crossing X, local L1–L3, strip S1–S2, and the large-exponent estimate. Each group has a script and corresponding certificate directory.

Run replay into a fresh output directory and compare exact bounds, coverage and acceptance—not rounded decimal displays or timings. A complete reproduction also needs scrutiny of the written arguments linking these checks to arbitrary centred log-concave laws. Download the [versioned archive](https://github.com/ipitchford/sharp-logconcave-moment-comparison/releases/download/v1.0.0-candidate/sharp-logconcave-moment-comparison-v1.0.0-candidate.zip) or [standalone paper](https://github.com/ipitchford/sharp-logconcave-moment-comparison/releases/download/v1.0.0-candidate/paper.pdf).

## The most valuable next projects

The most useful next steps are an unaffiliated production replay with a source-to-claim audit, explicit quantitative distributional stability estimates, and progress on the general two-exponent problem. None is supplied by publishing this candidate.

## What is in the evidence package

The published package contains a standalone manuscript, four detailed analytic/computational supplements, production code and certificates, exact-export regression checks, a bounded prior-art account, structured claims and assurance limits, licence information and a machine-readable research index. The [versioned research index](https://github.com/ipitchford/sharp-logconcave-moment-comparison/blob/v1.0.0-candidate/AI_INDEX.md) explains the evidence and replay routes. Archive identity and producer replay are distinct from independent validation of the mathematical argument.
