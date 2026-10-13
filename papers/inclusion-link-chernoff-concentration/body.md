## Summary

When a random sample contains dependent choices, a large total can be much more likely than an independent model suggests. Concentration inequalities quantify that risk. This candidate identifies a condition on the dependence remaining after some elements are known to be present, and derives an exponential bound on additive totals.

The original result concerns samples of a fixed size. A proposed extension lets the size vary and makes the upper-tail bound depend on the total's expected value. Its proof reuses the original inclusion-conditioned distributions, rather than assuming that the required spectral bound survives every change of probability weights.

This is an unrefereed analytic candidate. The revised proof and finite diagnostics have been checked internally. It does not establish a matrix inequality, concentration for arbitrary Lipschitz functions, or the other branches of the motivating open question.

The banner plots the proposed upper bound at covariance parameter $\alpha=2$, for illustrative means $m=4$ and $m=20$. At an excess of 12, those bounds are approximately 0.1054 and 0.3247, rounded upwards. These are evaluations of a bound, not observed probabilities or a claim that either bound is attained.

## Summary for specialists

Let $\mu$ be a probability law on subsets of a finite set. For every feasible inclusion face $A$, condition on $A\subseteq S$, remove $A$, and write $p^A$ and $C_A$ for the remaining inclusion marginals and covariance matrix. Coordinates with zero marginal are omitted when an inverse is taken.

The proposed variable-rank extension assumes the following bound at every feasible inclusion face, for a common $\alpha\geq1$:

$$
C_A\preceq\alpha D_{p^A}.
$$

For $0\leq g_i\leq1$, put $H=\sum_{i\in S}g_i$ and $m=\mathbb E H$. The candidate upper-tail inequality is

$$
\Pr(H-m\geq x)\leq\exp\!\left(-\frac{x^2}{2\alpha(m+x)}\right),\qquad x>0.
$$

More precisely, for $\alpha>1$ the proposed moment-generating-function comparison is

$$
\log\mathbb E e^{tH}\leq-\frac{m}{\alpha-1}\log\!\left(\alpha-(\alpha-1)e^t\right).
$$

Its domain is $0\leq t<\log(\alpha/(\alpha-1))$. This is a negative-binomial MGF comparison, not a claim that $H$ has that distribution. At $\alpha=1$ the comparison becomes $m(e^t-1)$ for every $t\geq0$, the Poisson form. If $m=0$, nonnegativity gives $H=0$ almost surely.

The original theorem starts instead with a law on $d$-element sets, $d\geq2$. If every inclusion-link walk of residual rank $r\geq2$ satisfies $\lambda_2(P_A)\leq\eta/r$ for a common $\eta>0$, then

$$
\begin{aligned}
&\Pr\!\left(\left|d^{-1}H-\mathbb E(d^{-1}H)\right|>\varepsilon\right)\\
&\qquad\leq2\exp\!\left(-\frac{\varepsilon^2d}{4(1+\eta)}\right).
\end{aligned}
$$

That walk assumption implies the covariance hypothesis with $\alpha=1+\eta$. Under the covariance hypothesis, conditioning on another feasible inclusion face preserves the results. For fixed residual rank $r$, a lower-tail bound follows by applying the upper-tail result to $1-g$, with complementary mean $r-m$. No variable-rank lower-tail theorem is claimed.

## Technical account

An exponential tilt makes large values of $H$ more likely. Directly demanding that the tilted distribution satisfy the original spectral assumption would add an unwanted hypothesis. The proof introduces an intermediate random set to avoid that step.

Draw $S$ from the tilted law proportional to $e^{tH(S)}\mu(S)$. Independently retain each selected element $i$ with probability $1-e^{-tg_i}$, obtaining a face $A$. Conditional on that face, the remainder $S\setminus A$ has exactly the original, untilted inclusion-link law $\mu_A$. This identity is the bridge between the tilted variance needed for a Chernoff argument and the covariance bounds actually assumed.

A birth–death chain on retained faces controls the variation of the conditional means. Its spectral-gap estimate is a specialization of an existing local matrix criterion, not a new general field-dynamics theorem. The manuscript supplies the finite-dimensional derivation and then integrates a variance inequality.

For the extension, counting all selected elements gives a differential inequality for the log MGF. Independent thinning with retention probabilities $g_i$ reduces bounded weights to this count case. The thinning calculation must retain its extra Bernoulli-variance diagonal term; conditional Jensen then transfers the MGF comparison back to $H$.

## Evidence, assurance and limitations

The central evidence is the written analytic argument. Finite diagnostic code checks thinning identities, MGF comparisons on small laws, and deliberately invalid variants. Such checks can expose mistakes; they do not prove the universal theorem or replace scrutiny of the derivation.

The supplied original audit was replayed on 205 finite laws, including an exact-rational Bochner identity. The public extension diagnostics check 100 further finite laws and 1,161 thinned inclusion links in normal and optimized Python, with two deliberately invalid controls. No external peer review, unaffiliated reproduction, proof-assistant verification or global priority finding is asserted.

The hypothesis concerns every feasible inclusion face, not merely the unconditioned covariance matrix. It may fail badly for a strongly correlated distribution. The result is scalar and additive: it does not automatically transfer to arbitrary functions on sets, matrix-valued observables, exclusion conditioning or a variable-rank lower tail. Nor does it resolve the separate TD-threshold question in the motivating source.

## Relationship to earlier work

The motivating problem is the scalar lifted-vertex, spectral-independence branch of Dikstein and Hopkins' high-dimensional-expansion concentration question. The auxiliary gap estimate is attributed to Chen and coauthors, Theorem 1.9 and Section 4.1, and the local matrix formulation of Göbel and coauthors, Theorem 1.2.

Kaufman, Kyng and Soldá already obtain scalar and matrix Chernoff bounds under one-sided $\ell_\infty$ independence. Consequently, inclusion-only conditioning is not itself new. Their absolute influence-row-sum hypothesis differs from the covariance-spectral hypothesis used here; a rigorous comparison of assumptions matters more than the shared name “Chernoff bound.”

The candidate's claimed contribution is the retained-face application to the specified scalar question and the proposed covariance-based mean-sensitive extension. The references and derivation must be inspected before judging originality or significance.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in high-dimensional expansion and dependent sampling | Test whether inclusion-link spectra provide a route to concentration for additive observables. | Check the bound at every feasible link and preserve the observable class. |
| Probabilists studying variable-size random sets | Examine a mean-sensitive upper-tail comparison under a covariance condition. | The extension is a candidate analytic result, not an automatic property of correlated sets. |
| Research agents and implementers | Reuse the thinning identity and the negative controls to audit related proofs. | Numerical examples neither establish universal validity nor certify new applications. |

## Why the problem matters

Dependence is not a single number: what remains after conditioning can be decisive. This work asks whether a particular local control can be converted into a global probability bound without imposing stability under extra fields.

The extension also changes the scale visible in the conclusion. When an additive count has a small expected value, a mean-sensitive bound can be more informative than a bound driven only by the sample size. Any improvement in an application still requires comparing the actual hypotheses and constants; no downstream algorithmic benefit has been measured here.

## How to inspect or reproduce the recorded checks

Read the theorem assumptions in `paper.tex` first, then Sections 6–7 for the proposed extension and attribution. Inspect `checks/extension_checks.py` before running it in a Python environment with NumPy. Run `python3 checks/extension_checks.py` and repeat with `python3 -O checks/extension_checks.py`; the explicit checks should remain active in both modes. Successful output reports `passed: true` and identifies its finite diagnostic scope.

The final package's environment and hash-backed receipts must identify the versions actually used. In particular, no finite test of small random laws discharges the requirement that an arbitrary application satisfy the covariance bound at every feasible link.

## The most valuable next projects

The most useful next step is to find a substantive dependent family where the covariance condition is verifiable and compare the resulting bound with existing one-sided influence bounds. The differential inequality and thinning argument also merit scrutiny outside this production process. A matrix extension would need a new argument. For variable-rank lower tails, the manuscript's empty/full example already shows that an additional assumption is necessary: covariance parameter one can coexist with a polynomial, rather than exponential, lower tail.

## What is in the evidence package

The linked package contains the eight-page manuscript and source, explicit claim boundaries, prior-art and citation records, review responses, diagnostic code, environment details, a file manifest and an AI-readable index. The supplied reviewer code is retained privately because no redistribution licence was supplied; the public diagnostic code is original and MIT licensed. The narration and figures explain the argument; they are not additional mathematical evidence.
