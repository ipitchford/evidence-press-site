## Summary

Adding Gaussian noise smooths a probability distribution. Entropy measures aspects of that change, but a familiar increase in entropy does not guarantee a neat pattern in every higher derivative.

This AI-assisted, unrefereed candidate classifies a strong requirement for Tsallis entropy: successive time derivatives must alternate in sign, for every input distribution in the stated class. Among positive entropy orders, **only order two survives universally**. At every other order there are counterexamples—even among smooth, strictly positive, strictly log-concave densities with Gaussian tails.

The construction depends on the entropy order and derivative being tested. The paper does not exhibit one distribution that defeats every order simultaneously.

## Summary for specialists

For $P_t=e^{t\Delta/2}$ and Tsallis entropy $S_\alpha$, the universal inequalities
$$
(-1)^{k-1}\frac{d^k}{dt^k}S_\alpha(P_t f)\geq0,\qquad k\geq1,
$$
hold at the quadratic order $\alpha=2$. For each fixed $\alpha>0$, $\alpha\notin\{1,2\}$, an explicit family $f_{\alpha,m}$ violates the signed derivative of order $m$ for every sufficiently large $m$. The input density varies with $m$. Previously proved Shannon counterexamples supply $\alpha=1$.

A separate finite witness uses $\alpha=3/2$, derivative order $13$ and heat time $1/50$. That explicit density is not claimed log-concave, and thirteen is not claimed to be the least possible failing order.

## Technical account

Two frequencies make the obstruction visible. Repeated differentiation amplifies a selected spectral level; an order-dependent choice of the second amplitude makes its leading coefficient negative. Gaussian localization turns the periodic calculation into a probability density on the real line. The additional Tsallis power factor requires its own error control.

This extends, rather than replaces, the periodic and Gaussian construction of Zou, Fan, Gao and Wang. Quadratic positivity follows from a nonnegative Fourier mixture of decaying exponentials. It is inherited mathematics, not a new discovery here.

The finite example replaces an unspecified large derivative threshold with exact rational estimates and a written analytic transfer. An elementary scaling corollary lets readers set the variance to one or move the failure to any prescribed positive time. A single dilation does not allow both quantities to be chosen independently.

## Evidence, assurance and limitations

The paper contains complete mathematical arguments and a rational certificate. The executable checker verifies bounded arithmetic comparisons, not the universal theorem or the Fourier, convolution and Cauchy arguments.

The repaired implementation uses explicit failure guards. Normal and optimized Python runs agree; eleven deliberately corrupted cases fail at their intended checks in both modes. These are internal producer checks, not external reproduction or proof-assistant verification. No external human peer review is claimed.

The asymptotic construction is pointwise in the entropy order. It supplies neither a sharp first failing derivative nor a uniform threshold near the exceptional orders. The explicit finite witness and the log-concave family have different scope.

## Relationship to earlier work

Wu, Yu and Guo formulated the relevant Tsallis question. Gu and Sellke's earlier Shannon counterexamples already undermine the joint interval conjecture by continuity near order one. This release therefore does not claim the first refutation of that joint assertion.

Its contribution is the pointwise positive-order classification, with the additional Tsallis calculation built on the cited spectral/localization method. A bounded primary-source and archive search found no equivalent full classification; it does not guarantee exhaustive priority.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Information theorists | Know exactly which positive Tsallis order supports the universal hierarchy | Low-order positivity can remain true when the hierarchy fails |
| Analysts studying heat flow | Reuse the explicit sign-producing construction and error decomposition | The method is substantially inherited and carefully attributed |
| Researchers building symbolic certificates | Inspect a rational witness and fail-closed guard tests | Finite arithmetic does not verify the analytic transfer |

## Why the problem matters

A handful of successful derivative inequalities can suggest a universal pattern. This classification shows where that extrapolation fails. It separates an exceptional structural identity at order two from behavior that can look orderly at low derivative orders but eventually breaks the full hierarchy.

## How to inspect or reproduce the recorded checks

Begin with the manuscript's witness map, then Theorems 1–2 for the classification and Theorem 7 with Appendix A for the finite example. The package's VERIFICATION.md gives commands for checks/tsallis_order13_certificate.py and checks/test_guards.py in normal and optimized Python. Every run requires a fresh output filename.

The source and proof must be read together: a passing executable is evidence for the stated rational comparisons only.

## The most valuable next projects

Quantify the first failing derivative as the entropy order approaches two, or produce a practical finite log-concave witness with fully explicit parameters. Either would add information not supplied by the present asymptotic classification. These are open tasks, not promised consequences.

## What is in the evidence package

The package contains the typeset paper, readable Markdown, LaTeX source, bibliography, guarded certificate and negative controls, source-to-claim audit, substantive response to review, limitations and agent reading index. Original prose is CC0; original code is MIT.
