## Summary

A comparison can hold from every viewing direction and still fail for a cost that depends on both coordinates. This candidate gives an exact example: one centred Gaussian distribution and a mixture of three centred Gaussian components.

Every one-dimensional projection is ordered in the required convex order. Nevertheless, a specified convex function has a **larger** expectation under the target than under the mixture. The proof also gives a positive definite version, so the failure survives beyond distributions supported on lines.

Convex order compares distributions by asking how they behave under every convex cost. Projecting onto a line simplifies the question, but removes information about how coordinates act together. Here **all** such projected comparisons pass—not merely a large collection of sampled directions. A joint cost detects what those comparisons miss.

The three-component mixture places probability on a horizontal line and the two diagonals. Its scales make the directional comparisons work. A small shift in a piecewise-linear cost exposes a different allocation of probability between regions of the plane. This is a mathematical limit on an inference, not an empirical claim about forecasting or financial performance.

## Summary for specialists

Let $X$ have covariance $\operatorname{diag}(1/3,1/9)$ and mean zero. Let $Y$ be the centred Gaussian mixture with weights $(3/4,1/8,1/8)$ and covariance factors

$
v_0=(4/9,0)^\top,\qquad v_1=(4/3,4/3)^\top,\qquad v_2=(4/3,-4/3)^\top,
$

so each component covariance is $v_i v_i^\top$. Then $u^\top X\leq_{\mathrm{cx}}u^\top Y$ for every real direction $u$, but $X\not\leq_{\mathrm{cx}}Y$. The witness

$
\phi(x,y)=\max\{|x|+|y|-1/24,\;2|y|\}
$

satisfies

$
\mathbb E\phi(X)-\mathbb E\phi(Y)>\frac{37}{18432}>0.
$

Adding $10^{-8}I$ to all four covariance matrices preserves every projected comparison and leaves a witness gap greater than $16213/11520000$. All resulting covariance matrices are positive definite.

## Technical account

The scalar Gaussian-mixture criterion reduces every projected comparison to

$
\sqrt{3a^2+b^2}\leq |a|+\max\{|a|,|b|\}.
$

The cases $|a|\geq|b|$ and $|b|\geq|a|$ prove this inequality exhaustively. Equality directions guide the construction.

Write $\phi_t(x,y)=\max\{|x|+|y|-t,2|y|\}$. At zero threshold, the expectations agree. Initially the target expectation decreases at rate $2/3$, while the mixture expectation decreases at rate $3/4$. A bounded half-normal density controls the second-order remainder. This yields the rational gap above without certified numerical integration.

Proposition 3 extends the mechanism to positive weights $p,q,r$ summing to one with $p>2/3$, using the specified reciprocal-weight component scales. It is a sufficient counterexample family, not a classification of all weights.

## Evidence, assurance and limitations

The revised package includes the written all-directions argument, exact algebraic checks and two separately written numerical diagnostics. Normal and optimised Python runs pass; deliberate wrong-weight and exaggerated-gap inputs are rejected. Numerical quadrature reports a gap near 0.00333, but that number is not a certified error interval or a practical effect size.

The supplied model-assisted review has an itemised response. The manuscript distinguishes projected order, full centred order and the stronger sufficient Gaussian-block condition. The final journal body of Jourdain and Pagès was not inspected; the comparison is explicitly tied to its inspected arXiv version.

## Relationship to earlier work

The distinction between projected and joint convex order is classical: see Koshevoy and Mosler, and Pinelis’s explicit finite-support example. The contribution here is the specified **three-centred-Gaussian construction**, not the discovery of that general distinction.

Guéant’s Theorem 4 establishes projection sufficiency for two centred Gaussian components, including singular covariances. The present example answers the larger-mixture question negatively at three components. Minimality is relative to that external theorem. The package does not classify all mixtures, claim failure for every three-component mixture, or establish absolute priority.

This is an **unrefereed candidate**. Internal replay, archive availability and numerical agreement are separate from external peer review, formal verification and independent reproduction; none of those latter assurances is claimed.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probability and stochastic-order researchers | An exact boundary for Gaussian-mixture projection criteria | The claim concerns this construction, not all three-component mixtures |
| Researchers using projected convex-order comparisons | A test case for an inference from scalar to joint costs | No empirical performance or practical effect size is established |
| Verification and formalisation researchers | A short analytic argument with rational inputs and corruption controls | Numerical replay does not prove a continuum of directions |

## Why the problem matters

Two components and three components behave differently. The result identifies a concrete point where projection-based comparison stops being a sufficient guarantee for all joint convex costs. That structural boundary is the contribution; no measured downstream impact is claimed.

## How to inspect or reproduce the recorded checks

Read Theorem 1, the common-noise corollary and Proposition 3. With the package's pinned NumPy and SciPy dependencies, run `python code/run_checks.py` and `python -O code/run_checks.py`. The entry point checks exact identities, runs both diagnostics and rejects two deliberately corrupted inputs. Inspect `VERIFICATION.md` for the precise finite scope and the distinction between numerical agreement and the written proof.

## The most valuable next projects

An external audit of the scalar criterion and expectation-gap estimate would address assurance directly. Characterising which other component geometries make projections sufficient is a separate research problem, not a result already established here. A certified numerical integrator could bound diagnostic error, but is unnecessary for the analytic rational lower bound.

## What is in the evidence package

Start with [the machine-readable research index](https://github.com/ipitchford/three-gaussian-projection-counterexample/blob/v1.1.0-candidate/AI_INDEX.md), then follow the claim map, manuscript and verification instructions. The package records exact inputs, limitations, source comparisons and the review response. Original prose and data are CC0; original code is MIT.
