## Summary

Take several correlated bell-shaped random quantities, each with the same variance. On each trial, keep the one whose absolute value is smallest. How should their correlations be arranged to make that minimum small on average?

A natural candidate places the underlying directions at equal angles in a plane. It is called the cosine configuration. A planar comparison alone leaves an important escape route: perhaps moving the directions out of the plane improves the answer.

This paper closes that **local** escape route. For every number of coordinates $n\ge3$ and every moment order $p>1$, sufficiently small changes cannot improve the cosine configuration, even when they increase the covariance rank. After changes that merely rotate the whole arrangement are removed, the increase has a positive quadratic lower bound.

That is not a global solution. A distant configuration might still do better. Indeed, for four coordinates the paper also identifies independence as a different strict local minimum whose value is higher. Local optimisation can therefore stop at the wrong answer.

## Summary for specialists

For a correlation matrix $C$, define $F_p(C)=\mathbb E\min_i|G_i|^p$, where $G\sim N(0,C)$. Let $V$ have rows $v_i=(\cos(i\pi/n),\sin(i\pi/n))$, and write $C_{\rm cos}=VV^{\mathsf T}$.

The principal theorem states that $C_{\rm cos}$ is a strict local minimum in the full correlation domain for every fixed $n\ge3$ and $p>1$, modulo row signs and permutations. The proof works with unit-row factors in an ambient dimension $d\ge2$ and includes directions normal to the original plane.

Writing $\alpha=\pi/n$, the second-order Taylor coefficient splits as

$$
\begin{aligned}
Q(a,B)&=H_{n,p}\sum_i(a_{i+1}-a_i)^2\\
&\quad+K_{n,p}\operatorname{tr}\!\left[B^{\mathsf T}(2\cos\alpha I-A_n)B\right],
\end{aligned}
$$

where $H_{n,p},K_{n,p}>0$ are explicit in the paper. The signed-cycle matrix $A_n$ has positive consecutive edges and a negative wraparound edge. Its top eigenspace is precisely the span of the cosine and sine vectors. Thus the only zero modes are ambient rotations.

For sufficiently small orbit distance, the objective grows by at least a positive constant times squared distance from the orthogonal orbit. The neighbourhood radius is existential, depends on the fixed parameters, and is not certified numerically. The displayed $Q$ is the Taylor coefficient; the Hessian is twice this form.

## Technical account

The proof separates three contributions. Changing the planar angles changes the gaps between consecutive unoriented lines; differentiation of the exact gap integral gives a cycle-Laplacian quadratic form. Tilting the vectors out of the plane changes the integrand inside each winning region. It also moves the boundaries where two coordinates exchange which absolute value is smallest. These moving-interface terms are essential: ignoring them gives the wrong normal quadratic form.

The bulk and interface terms combine into a shifted signed-cycle matrix. Anti-periodic Fourier modes identify its eigenvalues explicitly. The two zero normal modes correspond to rotating the base plane, not to improving the objective. Every transverse mode has positive cost.

For $1<p<2$, ordinary second derivatives contain an integrable singularity at a zero Gaussian coordinate. The argument treats this bulk singularity separately from the active interfaces and proves continuity of the Hessian. The same reasoning does **not** establish the range $p\le1$. Continuity of positive-semidefinite square roots then transfers the result from nearby unit-vector factors to nearby correlation matrices, including rank increases.

For the original four-coordinate second-moment case, the normal coefficient simplifies to $(2-\sqrt2)/\pi$ on the complement of the cosine plane. Supporting results include a sharp planar-triple-plus-independent-coordinate comparison and an elementary independent-noise lower bound. The latter excludes a specified interior region from possible counterexamples; it does not cover the whole domain.

## Evidence, assurance and limitations

The all-$n$ theorem is an analytic argument, not the output of an exhaustive computation. Exact finite algebra checks selected four-cycle identities. Floating-point comparisons and saved optimisation endpoints support numerical consistency only. They do not prove global optimality, a uniform Taylor remainder, or historical priority.

The numerical tools handle four-row frames. The revised elementary evaluator explicitly refuses certain valid near-singular or duplicated-line inputs rather than allowing nonfinite values to pass a tolerance check. The intrinsic-volume evaluator provides a separate numerical route, but neither implementation supplies rigorous error enclosures across the full domain.

All 200 saved optimisation records are retained, including 22 unsuccessful exits in the four-dimensional batch. Endpoint labels indicate objective-value proximity, not certified geometric basins. Re-evaluating saved endpoints is not regenerating the original optimisation trajectories. The present replay uses a documented newer numerical environment, not the exact original dependency versions.

This is an anonymous, AI-assisted, unrefereed candidate. Producer-side checking is distinct from unaffiliated reproduction, proof-assistant verification and external peer review; those forms of assurance are not established here.

## Relationship to earlier work

Kunisky's cosine law, moment values and stochastic conjecture are antecedents. The contribution here is the explicit full transverse second variation and local stability for every $n\ge3$, $p>1$. Long's intrinsic-volume identity supplies a known ingredient of the geometric evaluator; it is not presented as a new general identity.

The related preliminary cyclemath manuscript concerns convex hulls of entire great subspheres, rather than the finite signed-vertex hulls used here. Its conditional volume comparison does not settle the Gaussian-minimum conjecture. The bounded literature comparison found no exact antecedent for the central local theorem, but it does not establish first-ever priority.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Gaussian comparison researchers | A transverse stability theorem for the conjectured cosine minimiser | Local stability does not rule out distant competitors |
| Convex and spectral geometers | An explicit signed-cycle decomposition of a moving-interface variation | The singularity analysis is part of the proof, not optional bookkeeping |
| Researchers designing global certificates | Local structure and an interior exclusion bound that can guide a domain partition | No explicit local radius or complete certified cover is supplied |
| Scientific-computing researchers | Two evaluators, saved endpoints and fail-closed regression tests | Floating-point agreement and successful optimisation are not proof |

## Why the problem matters

Dependence can dramatically change the smallest of several random magnitudes even when every marginal distribution is fixed. Understanding the extremal correlation geometry asks more than evaluating a plausible symmetric example. The rank-two candidate lies on the boundary of the correlation domain, so a serious stability test must examine directions that leave that boundary.

The theorem supplies that test for an infinite family of dimensions and moments. The nonglobal minimum at independence also explains why searching numerically for a minimum can be misleading, and why the remaining global comparison needs a genuinely nonlocal argument.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md`, the paper and `CLAIMS.md` in the linked source release. Run `python3 -B reproduce.py NEW_OUTPUT_DIRECTORY` in the documented environment to obtain fresh receipts and logs. `ENVIRONMENT.md` records the version boundary; `REPLAY_RECEIPT.md` describes the observed repair replay. The numerical audit checks every expected saved batch and start identifier, rejects nonfinite values before comparison, and runs its guards in ordinary and optimised Python. The final clean-package replay passed these checks separately from development repair.

Read the analytic regularity and signed-cycle sections separately from the finite computations. To challenge the main theorem, inspect the moving-interface coefficient, the $1<p<2$ domination argument and the passage from the rotation orbit to the full correlation domain. To assess global progress, examine the unresolved rank-three and rank-four inequalities rather than the optimiser's endpoint counts.

## The most valuable next projects

1. Obtain an explicit, useful local neighbourhood radius that can participate in a rigorous global cover.
2. Control the coupled rank-three face-selection and rank-four angle inequalities outside the proved exclusion region.
3. Treat the zero-hyperplane singularities for $0<p\le1$ without substituting those values into an argument proved only for $p>1$.
4. Implement independently checked outward-rounded evaluation for the remaining global comparison, preserving singular cases and failed searches.

## What is in the evidence package

The release contains a stand-alone manuscript and source, the local-variation derivation, two four-row evaluators, the original saved search data, revised validation and negative-control tests, execution records, a bounded prior-art comparison and an agent-readable index. Exact algebra, floating-point diagnostics and the written universal proof have separate roles. No private review record is required to understand the mathematical argument.
