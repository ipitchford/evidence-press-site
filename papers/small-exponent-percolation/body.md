## Summary

This page explains, in order: what the percolation model is, why its threshold is close to one, what this candidate proves about the first correction, how the proof works, and what has and has not been checked.

**The model.** Place a point at every integer along a line, and independently connect pairs with a probability that decreases with distance. How many neighbours, on average, are needed before an infinite connected cluster can appear? That critical average is the *critical mean degree*, written $p_c$. Here the connection probability falls off like a power of the distance, $C\lvert x-y\rvert^{-1-\sigma}$; the smaller the *tail exponent* $\sigma$, the more common very long connections become.

**Why the answer is close to one.** A standard first approximation treats the growing cluster as a family tree in which every vertex found is new. In such a branching process, an infinite family appears as soon as each member has more than one child on average, so the branching prediction is $p_c=1$. When the distance penalty becomes very weak, the critical mean degree approaches one. Recent work on explicit threshold bounds raised this limit for the undirected model; the question here is how far above one the true threshold sits.

**What was found.** This candidate identifies the first correction above one: the probability that two independent steps drawn from the connection kernel return to their starting point. Immediate returns do not discover new vertices. The proof makes that familiar obstruction quantitative in a fixed one-dimensional, small-exponent limit. As $\sigma$ tends to zero, the excess $p_c-1$ behaves like $\tfrac{\pi^2}{12}\sigma^2$, with an error of order $\sigma^3$.

**Beyond the pure power law.** The same argument gives a reusable criterion for other kernels. Adding extra local connection weight changes the coefficient explicitly, even when the far tail is unchanged, and mixing several nearby tail exponents replaces it by a coefficient depending on their average.

**Reading the banner:** the highlighted out-and-back route returns to an already discovered vertex; the quieter arcs represent other possible connections, not a sampled cluster. The formulas show the leading threshold correction and how an added nearest-neighbour weight changes its coefficient. No curve or critical threshold has been fitted to simulations.

**Status.** An anonymous, AI-assisted, unrefereed analytic written-proof candidate. The constants in the error term are not evaluated, so this is an asymptotic statement, not a numerical threshold estimate at any specified exponent.

## Summary for specialists

For independent undirected bonds on $\mathbb Z$ with exact opening probability $C|x-y|^{-1-\sigma}$, put $Z_\sigma=\zeta(1+\sigma)$ and $D_\sigma(x)=|x|^{-1-\sigma}/(2Z_\sigma)$ for $x\ne0$, with $D_\sigma(0)=0$. The normalized parameter $p=2Z_\sigma C$ is expected degree. The written proof gives constants $K,\sigma_0>0$ such that, for every real $0<\sigma<\sigma_0$,

$$
\left|p_c-1-\frac{\zeta(2+2\sigma)}{2\zeta(1+\sigma)^2}\right|\le K\sigma^3.
$$

Consequently $(p_c-1)/\sigma^2\to\pi^2/12$. In the original bond-amplitude parameter, $C_c-(2Z_\sigma)^{-1}=\pi^2\sigma^3/24+O(\sigma^4)$. The correction term $\zeta(2+2\sigma)/(2\zeta(1+\sigma)^2)$ is exactly the two-step return weight $D_\sigma^{*2}(0)=\sum_x D_\sigma(x)^2$ (Theorem 1.1).

Section 7 proves a sufficient criterion for even kernels with maximum weight $O(\epsilon)$, $J_{2,3}=O(\epsilon^2)$ and $J_{3,2}=O(\epsilon^3)$, together with full stated structural and admissibility assumptions. It applies to arbitrary nonnegative summable additions of uniformly bounded total mass and to probability mixtures of exponent ratios in a fixed compact positive interval.

| Result | Statement | Status |
|---|---|---|
| Theorem 1.1 | $p_c=1+\zeta(2+2\sigma)/(2\zeta(1+\sigma)^2)+O(\sigma^3)$, uniformly for small real $\sigma>0$ | written proof |
| Proposition 3.1 | Nonbacktracking lower bound $p_c\ge p_{\mathrm{NB}}=1+S_2+O(\sigma^3)$ | written proof |
| Proposition 5.1 | Uniform subcritical bound on the first lace coefficient, $0\le\pi^{(1)}_p\le(2p-p^2)S_2+K_2\sigma^3$ | written proof |
| Theorem 7.1 | Two-scale kernel criterion: $p_c(D_\epsilon)=1+\sum_xD_\epsilon(x)^2+O(\epsilon^3)$ under the stated hypotheses | written proof |
| Theorem 7.2 | Nonnegative summable additions of bounded total mass; nearest-neighbour weight $\lambda$ gives coefficient $\pi^2/12+\lambda+\lambda^2/2$ | written proof |
| Theorem 7.3 | Compact exponent mixtures: coefficient $\frac{\pi^2}{12}(\int c\,\nu(\mathrm dc))^2$ | written proof |

## Technical account

**Lower bound: walks that never step straight back.** The lower bound uses a nonbacktracking exploration: it removes the immediate return along the edge just traversed. Every self-avoiding path is nonbacktracking, so bounding the total weight of nonbacktracking walks bounds the chance of long open paths. This gives an explicit equation whose root $p_{\mathrm{NB}}$ lies below $p_c$ and equals $1+S_2+O(\sigma^3)$, where $S_2$ is the two-step return weight.

**Upper bound: the lace expansion, used one-sidedly.** The upper bound uses the positive remainder after the first odd truncation of the percolation lace expansion. Uniform small-exponent Fourier estimates bound the relevant closed diagrams more sharply than their supremum norms: the spatial supremum of the key diagram is of order $\sigma$, while its closed value at the origin is of order $\sigma^2$, and keeping these apart turns the error terms into $O(\sigma^3)$ rather than $O(\sigma^2)$.

The deleted-bond restriction matters. Retaining it produces the subtractive two-step term; a generic triangle bound alone would lose the coefficient. The proof controls the first coefficient one-sidedly and uses positivity of the finite-order remainder. It does not require a matching expansion for every lace coefficient. The imported infrared theorem itself still relies on lace-expansion estimates; the saving is in the additional correction calculation.

**Extensions.** For a concrete extension, add weight $\lambda\ge0$ at distance one before normalizing the pure-power kernel. The coefficient of $s^2$ becomes

$$
\frac{\pi^2}{12}+\lambda+\frac{\lambda^2}{2}.
$$

Thus keeping the same far-tail exponent does not keep the correction unchanged. For mixtures $D_s=\int D^0_{cs}\,\nu(\mathrm dc)$ with $0<c_-\le c\le c_+<\infty$, the coefficient instead is $\frac{\pi^2}{12}(\int c\,\nu(\mathrm dc))^2$—the square of the mean exponent ratio, not its second moment.

## Evidence, assurance and limitations

This is an unrefereed analytic written-proof candidate. The supplied review has an itemised response, and the source applicability, diagram estimates and additional kernel families have been checked internally. Finite numerical or algebraic diagnostics check their declared identities and controls; they do not prove the infinite-volume threshold theorem. The recorded diagnostic run passes 26 exact algebraic checks and rejects 10 semantic negative controls, in both normal and optimized Python.

There is no end-to-end formal verification, external specialist endorsement or unaffiliated reproduction established. Neither a DOI nor media supplies that assurance. The constants $K$ and $\sigma_0$ are not numerically evaluated, so the expansion is not a certified approximation at a specified positive exponent. The result does not determine the cubic coefficient, cover oriented percolation, or replace the linear bond law by an exponential one. Signed additions, unbounded exponent ratios and useful numerical error constants remain outside the Section 7 statements, and small maximum kernel weight alone is not sufficient for the criterion.

The original submission archive omits four historically cached external-source files and its original packaging test suite; those historical records cannot be reconstructed, and current checks do not replace them.

## Relationship to earlier work

Amit's motivating paper gives explicit bounds through monotone paths. Earlier work of van der Hofstad and Sakai already identifies the two-step return correction in a spread-out regime. The present contribution is not discovery of that mechanism or a new lace expansion: it supplies uniform control in the small-exponent regime at fixed dimension one, plus the stated transferable criterion and examples. The infrared theorem and event decomposition are inherited from the cited primary sources with their hypotheses retained.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Probability researchers | A small-exponent critical-point expansion and reusable sufficient criterion | The analytic proof remains a candidate requiring specialist scrutiny. |
| Researchers studying long-range graphs | Separate tail shape from local-weight effects | Real networks may violate independence, dimension or the exact bond law. |
| Mathematical software and verification researchers | Check normalization, diagram identities and source assumptions | Finite diagnostics are not a threshold certificate. |

## Why the problem matters

The branching approximation discards repeated discoveries. Identifying its first error explains which part of the geometry survives when connections become extremely long range. The kernel extensions make that comparison more informative: local alterations can change the coefficient even when the broad tail exponent is unchanged. No empirical network application or measured downstream benefit is claimed.

## How to inspect or reproduce the recorded checks

Begin with `README.md` and `AI_INDEX.md` in the linked versioned repository. Read the model normalization and main theorem, then the nonbacktracking bound, imported infrared assumptions, deleted-bond argument and positive-remainder threshold step. Section 7 checks the additional kernels, including existence of an admissible percolating parameter.

The finite diagnostics use the Python standard library only:

```sh
python code/verify_math.py
python -O code/verify_math.py
```

They check finite normalization, the nonbacktracking algebraic identity, the deleted-bond subtraction, a quadratic inequality and the application coefficients, and they reject plausible corrupted constants such as conflating pointwise and convolution moments. Inspect their scope in `ASSURANCE.md`; do not substitute their successful execution for reading the analytic proof. `REVIEW_RESPONSE.md` identifies the supplied review's requests and their dispositions; the full supplied review is not redistributed.

## The most valuable next projects

1. The immediate assurance priority is an unaffiliated specialist audit of the source-to-model bridge and the uniform diagram estimates.
2. Further mathematical work could seek an explicit useful error constant and exponent range, or a third-order coefficient.
3. Other bond laws and oriented models need their own analysis rather than a change of notation.

## What is in the evidence package

The package includes the manuscript and LaTeX source, source and citation audits, the response to the supplied review, scoped verification material, an environment record and an agent-readable index. Original prose and diagrams are CC0; original code is MIT. The banner and synthetic audio explain the result but are not additional scientific evidence.
