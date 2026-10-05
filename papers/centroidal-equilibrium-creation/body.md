## Summary

Smoothing a convex object need not reduce the number of ways it can balance. This candidate constructs a smooth body whose total number of centroidal equilibria rises from 22 to 26 under inward mean-curvature flow.

Two pairs appear at opposite points: each contains one minimum and one saddle. The proof uses a genuine forward-time flow of a globally convex body. It is not a local sketch presented as a whole object, or a numerical animation treated as proof.

The stochastic question is different. The original published conjecture concerns an expected count. A separate exact probability example shows that zero means and covariance alone do not determine the sign of the expected count change. It does not identify a physically sampled ensemble of rocks.

## Summary for specialists

On $S^2$, with $\varepsilon=1/100$, take

$$
s_\mu(x,y,z)=1+\varepsilon\left(\frac{y^2}{2}+\frac{x^3z}{6}-2xy^2z+\mu xz\right).
$$

For $|\mu|\le1$, both principal curvature radii are at least $9/10$. Central symmetry fixes the homogeneous centroid. For every sufficiently small $\mu>0$, inward mean-curvature flow creates two antipodal minimum–saddle pairs at

$$
t_*(\mu)=\frac{10201}{29799}\mu+O(\mu^2),\qquad N:22\longrightarrow26.
$$

Mean curvature is the **sum** $\kappa_1+\kappa_2$. Using its average doubles the time scale. The same mechanism works for $a+b(\kappa_1+\kappa_2)+c\kappa_1\kappa_2$ with $a,b,c\ge0$ and $b+c>0$. Endpoint counts persist on an open set of asymmetric initial bodies.

## Technical account

The support-function tensor $Q=\nabla^2_{S^2}s+sI$ is uniformly positive definite. This both certifies convexity and identifies a strictly parabolic forward equation. A common-time local existence and dependence lemma supplies a fixed interval for nearby initial data. The birth calculation uses an implicit-function argument along those forward solutions; it does not run a parabolic equation backwards.

An exact polynomial calculation at the limiting parameter $\mu=0$ determines the birth direction. Rational Sturm isolation and explicit treatment of exceptional coordinate charts enumerate all other critical points. Morse persistence then excludes unseen changes elsewhere for small parameter and short time.

Before the births there are 6 minima, 6 maxima and 10 saddles. Afterwards there are 8 minima, 6 maxima and 12 saddles. Both satisfy the sphere's index identity $S+U-H=2$.

The probability correction is separate. For equal positive coefficients, use the four outcomes

| Probability | $A$ | $B$ | $A^2+AB$ |
|---|---:|---:|---:|
| $9/20$ | $1$ | $-2$ | $-1$ |
| $9/20$ | $-1$ | $2$ | $-1$ |
| $1/20$ | $1$ | $18$ | $19$ |
| $1/20$ | $-1$ | $-18$ | $19$ |

Here $EA=EB=EAB=0$, yet $E\operatorname{sgn}(A^2+AB)=-4/5$. With the stated jump convention $\Delta N=-2\operatorname{sgn}(A^2+AB)$, the expected jump is $8/5>0$. A positive mean of an expression does not force a positive mean of its sign. The paper supplies an exact probability criterion and stronger sufficient symmetry conditions.

## Evidence, assurance and limitations

Exact SymPy and rational calculations check the support-function identities, local flow derivatives, critical quartic, root isolation and probability arithmetic. The finite checks do not formalize parabolic existence, parameter dependence or Morse persistence. Those remain written arguments.

The review's requested proof expansion is incorporated, and fresh archive replay passed. The supplied review is not authenticated external peer review; current checks are internal. There is no proof-assistant verification, unaffiliated reproduction or empirical abrasion study.

“Sufficiently small” is an analytic quantifier, not a certified numerical parameter interval. No numerical value is supplied as a simulation-ready threshold. The open-set conclusion concerns fixed endpoint counts, not identical bifurcation times for asymmetric bodies.

The four-outcome law does not refute Domokos's separate Assumption 2-A, nor every stronger stochastic model. Measures supported on the constructed open set give an expected-count increase, but no claim identifies those measures with natural rock populations.

## Relationship to earlier work

Domokos already discusses deterministic critical-point creation on surfaces, and Damon provides earlier local Morse-theoretic heat-equation background. The distinction here is the explicit globally convex centroidal construction, full count and actual nonlinear forward flow, together with a separate exact correction to a moment inference.

Huisken supplies convex-flow background. Huang's closed-manifold local theory and linear estimates support the expanded local-dependence argument. The paper states precisely what it derives rather than attributing its entire result to those sources.

## Who should care, and why

| Audience | Potential use | Boundary |
|---|---|---|
| Geometric analysts | A controlled forward-flow equilibrium-creation example | Local time and sufficiently small parameter |
| Abrasion modellers | A diagnostic for monotonicity assumptions | No assertion of physical prevalence |
| Probabilists | An exact moment-to-sign counterexample and replacement criterion | A random-jet law is not a complete physical process |

## Why the problem matters

Surface smoothing, equilibrium counts and expected stochastic behaviour are different observables. A reliable monotonicity claim must specify which one it describes and which distributional assumptions it uses. This construction makes two failure mechanisms explicit without conflating them.

## How to inspect or reproduce the recorded checks

Verify the shared archive's manifest, install the pinned dependency in an isolated Python environment, and run:

```sh
python code/reproduce.py
```

Use a disposable extracted copy because the command regenerates reports. The abrasion stage can also be run as `python code/verify_abrasion.py`. It checks finite identities and counts, not a discretized flow. Optimized Python is refused because it disables assertion checks.

## The most valuable next projects

Derive a certified numerical parameter interval, reproduce the flow with independently validated numerics, and specify physical sampling laws before asking whether expected counts decrease in a realistic abrasion ensemble. None is implied by the current finite certificate.

## What is in the evidence package

This paper has its own PDF, citation file and DOI. The shared archive contains its exact symbolic verifier and reports, the source and review-response records, `AI_INDEX.md`, claim maps and a hash manifest. The [mosaic companion](/releases/rational-laguerre-mosaics/) is a separate research output; its computations are not evidence for the abrasion theorem.
