## Summary

Imagine two clouds of probability mass. The full $p$-Wasserstein distance asks for the least transport cost needed to rearrange one cloud into the other. Sliced Wasserstein distance first projects both clouds onto every line, solves the simpler one-dimensional transport problems, and averages those answers over direction.

Full closeness always implies sliced closeness. The difficult question is the reverse: can all the one-dimensional views be close while a small amount of mass travels far enough to keep the full transport cost large?

This candidate proves a uniform reverse implication when the transport power $p>1$ is fixed and noninteger. It works on the entire critical moment ball: each distribution needs only a bounded moment of the same order $p$ as the transport cost. There is no compact-support, density, common-tail, fixed-target or higher-moment assumption.

The word noninteger is essential. Earlier counterexamples show that the corresponding uniform statement fails at integer powers. The present result addresses the complementary case. It does not say that a finite list of views determines an arbitrary distribution, and it does not turn the theorem into a calibrated numerical algorithm.

## Summary for specialists

Let $d\ge2$, let $p>1$ be noninteger, fix $R>0$, and write

$$
\mathcal M_{p,R}=\left\{\mu:\int |x|^p\,\mathrm d\mu(x)\le R^p\right\}.
$$

If $\operatorname{SW}_p$ is the $L^p$ average over directions of the projected one-dimensional $W_p$ distances, the candidate proves

$$
W_p(\mu,\nu)\le C_{d,p}R^{1-\alpha_{d,p}}
\operatorname{SW}_p(\mu,\nu)^{\alpha_{d,p}},
\qquad
\alpha_{d,p}=\frac{1}{p(p+d+2)},
$$

for every $\mu,\nu\in\mathcal M_{p,R}$. The exponent is explicit but not claimed sharp, and $C_{d,p}$ is neither evaluated nor controlled uniformly as $p$ approaches an integer.

Combining this positive theorem with Letrouit and Mérigot's integer-power counterexamples gives the critical-moment classification: for $d\ge2$, $p\ge1$ and $R>0$, sliced and full $p$-Wasserstein distance are uniformly equivalent on $\mathcal M_{p,R}$ exactly when $p$ is not an integer. In dimension one the two metrics agree for every $p\ge1$.

For a weighted direction law $Q=\sum_i w_i\delta_{\theta_i}$ with $w_i\ge0$ and $\sum_iw_i=1$, put

$$
S_Q(\mu,\nu)=\left(\sum_i w_i
W_p(P_{\theta_i\#}\mu,P_{\theta_i\#}\nu)^p\right)^{1/p}.
$$

If $\sigma$ is uniform surface measure and $\mathsf W_p(\sigma,Q)$ is Wasserstein distance between direction laws on the sphere, the paper also obtains

$$
W_p(\mu,\nu)\le C_{d,p}R^{1-\alpha_{d,p}}
\left[S_Q(\mu,\nu)+2R\mathsf W_p(\sigma,Q)\right]^{\alpha_{d,p}}.
$$

The angular-discrepancy term cannot simply be dropped: after any fixed finite direction set is chosen, distinct compactly supported measures can still have identical projections in all those directions.

## Technical account

The proof has four load-bearing stages.

First, it weights each nonzero point $x$ by $|x|^p$ and records it on a cylinder using logarithmic radius and direction:

$$
x\longmapsto (\log|x|,x/|x|).
$$

A cemetery-point coupling handles unequal weighted masses. A dominated spatial subcoupling and a residual-moment estimate then bound $W_p^p$ by a bounded-Lipschitz distance between the two lifted moment measures. This bridge is what retains tiny masses at arbitrarily large radii.

Second, projection becomes a convolution operator on the cylinder. Spherical harmonics diagonalise its angular part. The multipliers are the classical one-sided cosine multipliers

$$
\lambda_\ell(z)=
\frac{\Gamma(d/2)\Gamma(z+1)}
{2^{z+1}\Gamma((z-\ell+2)/2)\Gamma((z+\ell+d)/2)}.
$$

On the Mellin line $z=p+i\xi$, these multipliers have no zeros when $p$ is noninteger. At integer $p$, specified higher angular degrees do vanish. The multiplier formula and smooth inversion machinery are classical and are credited to Haberl and related transform literature; their existence is not offered as a new contribution.

Third, inversion is performed only after smoothing the entire bounded-Lipschitz test class. A classical positive spherical Jackson kernel, credited to Cao and Guo, reduces the angular variable to degree $O(\eta^{-1})$ while preserving the relevant norm and radial Lipschitz bounds. Compact-frequency smoothing in logarithmic radius permits division by the nonzero multipliers. Translation invariance keeps the constants uniform even when moment mass moves through arbitrarily many radial scales.

Finally, gamma-function estimates control the reciprocal multipliers on a zero-free strip. A shared inverse-kernel envelope and a spherical-harmonic dimension bound give test norms of order $\eta^{-(p+d+1)}$. Balancing approximation and projection errors yields the exponent $1/[p(p+d+2)]$. This rate improves the supplied version by using the established positive Jackson approximation; no optimality claim is made.

## Evidence, assurance and limitations

This is an unrefereed analytic written-proof candidate. The main evidence is the proof itself, not a numerical certificate. Internal mathematical review examined the transport bridge, transform normalization, complex continuation, uniform inversion and exponent bookkeeping. The accompanying standard-library diagnostics run under ordinary and optimized Python, with 320 finite checks and 20 deliberately corrupted controls rejected. Those computations inspect formulas and examples; they do not prove the unrestricted theorem.

No proof-assistant formalisation, unaffiliated rerun, external specialist review or journal editorial peer review is established. The prior-art search is bounded and cannot certify absolute priority. A DOI, manifest, passing diagnostic or successful rebuild supplies provenance or producer-side replay, not mathematical acceptance.

The result supplies no sharp exponent, calibrated value of $C_{d,p}$, uniform conditioning near integer powers, general theorem for other sliced discrepancies, or practical complexity guarantee. The finite-direction corollary requires nonnegative weights summing to one and a controlled direction-law discrepancy; a covering mesh does not justify arbitrary equal weights.

## Relationship to earlier work

Letrouit and Mérigot prove comparisons under a strictly higher moment and construct the integer critical-moment counterexamples. Their work poses the noninteger critical case resolved by this candidate; their paper also uses the standard sliced quantile embedding.

The one-sided spherical cosine multiplier and smooth inversion are classical. Haberl supplies the central transform formula; regular-variation and generalized Cramér–Wold literature already contains noninteger recovery and Mellin-cancellation mechanisms in different settings. Cao and Guo provide the classical positive Jackson approximation used to improve the rate. Han supplies the directional Lipschitz estimate behind the weighted finite-direction consequence.

The proposed residual contribution is therefore narrower than “inventing transform inversion”: it is the uniform two-measure estimate on the whole noncompact critical moment ball, together with the transport bridge and test-class approximation that make the classical machinery apply without a higher moment, common tail or fixed target.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Optimal-transport and metric-geometry researchers | A complete candidate answer to the noninteger critical-moment comparison question | The proof remains informal and unrefereed; constants are not calibrated. |
| Harmonic-analysis and tomography researchers | A log-radial cylinder formulation connecting projected transport to one-sided cosine multipliers | The transform machinery is classical; the claimed contribution is its uniform transport use. |
| Researchers using sliced transport computationally | A worst-case theorem separating angular coverage error from projected solver error | It is not a practical direction-count guarantee, and finite projections are not globally injective. |
| Formalisation and verification researchers | A modular chain of bridge, multiplier, approximation and optimization obligations | Finite diagnostics are not end-to-end formal verification. |

## Why the problem matters

Projection methods replace a difficult high-dimensional comparison by many simpler one-dimensional comparisons. The theorem identifies an exact mathematical boundary for one worst-case uniform guarantee: at the critical moment, noninteger and integer powers behave differently. It also explains why topological convergence toward one fixed measure is not enough—the moment ball is not compact in full Wasserstein distance, and both measures may move with mass escaping to distant scales.

This is a theoretical clarification. The package contains no empirical claim that the estimate improves a particular learning system, imaging pipeline or transport computation.

## How to inspect the paper and recorded checks

Start with the main theorem and the definition of the critical moment ball. Then audit the proof in this order: the weighted-cylinder transport bridge; the projected-test estimate; the multiplier formula and its nonvanishing line; uniform test approximation; the reciprocal-multiplier bounds; and the final exponent balance. Read the finite-direction corollary together with its noninjectivity example.

The linked repository's AI index maps claims to proof sections, source audits, limitations and checks. From a clean package extraction, run the documented standard-library diagnostics under both ordinary Python and optimized Python, then run the manifest checker. Inspect their stated scope: they test selected formulas, controls and package bytes, not the universal proof.

## The most valuable next projects

An unaffiliated specialist audit of the weighted-cylinder bridge and reciprocal-multiplier estimates is the immediate assurance priority. Mathematically, useful next targets are a sharper exponent, explicit constants, and a quantitative account of how conditioning deteriorates as $p$ approaches an integer. Any practical finite-direction method would also need evaluated spherical designs, solver error and constants rather than the present existence-scale bound.

Extensions to other projection geometries or sliced discrepancies require new arguments; they do not follow by changing notation.

## What is in the evidence package

The package contains the editable LaTeX manuscript and PDF, bibliography, theorem and claim maps, prior-art and citation records, review response and assurance records, standard-library diagnostics with negative controls, environment information, manifests and an agent-readable index. Original prose and diagrams are CC0; original code is MIT. Cover art and synthetic audio explain the result but are not additional mathematical evidence.
