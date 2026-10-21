## Summary

**The setting.** Many optimisation problems minimise a sum of three convex pieces, two of which may be awkward (non-smooth) and one smooth. Davis–Yin three-operator splitting handles such sums by treating each piece separately at every step: two proximal evaluations and one gradient evaluation, instead of one hard joint solve. Users rely on worst-case guarantees that say how far, after a given number of steps, the method's averaged output can be from a reference solution.

**Three questions behind any guarantee.** An algorithmic guarantee has at least three distinct questions behind it: is the inequality valid, is its constant best possible, and can any finite instance attain equality?

**What was found.** For the averaged primal–dual comparison gap of Davis–Yin three-operator splitting, this paper answers all three across the open unrelaxed step range. The best constant has a simple denominator, $K+1-\theta$ after $K$ steps, where $\theta$ is the normalised step size; it resolves a tightness conjecture of Nguyen et al. (arXiv:2506.23475) at $\theta=1$. Equality can happen after one step, but never after two or more: the worst case is approached only in a limit. The paper also determines the exact critical-endpoint supremum while preserving an unresolved endpoint-attainment question.

**Status.** Unrefereed, AI-assisted research. The proofs have received internal model audits and exact arithmetic checks, which are not external peer review or a formal proof certificate.

## The quantity being bounded

Davis–Yin splitting separates two proximal evaluations and one smooth gradient evaluation for a convex objective $f+g+h$. After $K$ steps, the paper studies the averaged comparison gap
$$
G_K(x,u)=\mathcal L(\bar x,u)-\mathcal L(x,\bar u)
$$
against an arbitrary admissible comparison pair $(x,u)$.

That qualification is important. The gap is not automatically nonnegative for each fixed pair, and it is not the same thing as objective error, a maximised duality gap or a last-iterate residual.

## Summary for specialists: exact result

Let $\theta=\alpha L\in(0,2)$ and define
$$
D=\lVert x_0-x\rVert^2+\alpha^2\lVert u_0-u\rVert^2,
\qquad
R_0=\lVert x_0-x+\alpha(u_0-u)\rVert^2.
$$
Then
$$
G_K(x,u)\le
\frac{R_0}{2\alpha(K+1-\theta)}
\le
\frac{D}{\alpha(K+1-\theta)}.
$$

Both coefficients are exact suprema. A two-dimensional family of finite, nonnegative convex functions approaches them, even while retaining a unique primal minimiser and a primal–dual saddle pair.

At $\theta=1$, this proves the tightness conjecture attached to the source bound. The contribution is not merely a new proof of that upper bound: it gives the complete $K+1-\theta$ formula, the sharpness construction and the attainment classification.

## Technical account

After normalising the step size, the proof writes the difference between the observed gap and the candidate constant as an exact sum of nonpositive terms:

- convexity slacks for the two nonsmooth functions;
- two smooth-interpolation deficits;
- variance terms for subgradients and gradients;
- a final completed square.

The coefficient $K+1-\theta$ is the coefficient left when that final square is completed. This identity both proves the bound and records every condition required for equality.

## Sharpness is not the same as attainment

For $K=1$, equality can occur. For every $K\ge2$ and $0<\theta<2$, no finite-dimensional instance with positive denominator attains either supremum.

The approaching family becomes increasingly extreme, so the best constant is forced by a limit that is absent from the finite admissible class. This is why reporting only a numerical near-extremiser would miss a central structural result.

## The critical endpoint

At $\alpha L=2$ and $K\ge2$, the same architecture yields the exact bounds
$$
G_K(x,u)\le
\frac{R_0}{2\alpha(K-1)}
\le
\frac{D}{\alpha(K-1)}.
$$

Both constants are exact suprema. If $f$ is strictly convex, neither positive-denominator bound is attained. General attainment at this endpoint remains unresolved and is deliberately not promoted to a theorem.

Smooth, strongly convex approximations preserve the suprema, but not with a common positive lower bound on their conditioning parameters.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/davis-yin-gap-sharpness.txt) is available for reading.

Exact rational replay checks representative trajectories, constants and the endpoint formulas. Ordinary and optimized Python executions have matching semantic receipts, while deliberate trajectory and constant corruptions are rejected in both modes. These checks support the formulas; the written slack identity establishes the universal bound.

The sharpness statement ranges over arbitrary admissible comparison pairs. It does not establish sharpness when the comparison pair must be a saddle pair. It is not a last-iterate result, an objective-error rate, a convergence theorem at the critical endpoint or a lower bound for other algorithms.

Internal AI-assisted review is not external human peer review, independent reproduction or proof-assistant formalisation.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Convex-optimisation researchers | Use the exact constant and non-attainment classification | Preserve the comparison-pair quantifier |
| Performance-estimation researchers | Inspect an analytic certificate and low-dimensional limiting family | The endpoint attainment problem remains open |
| Algorithm designers | Understand how step size changes a finite-horizon guarantee | No cross-algorithm complexity lower bound is claimed |

## Why the problem matters

A worst-case bound is most useful when it is known to be the best possible: then it describes exactly what the method can guarantee, rather than what one proof technique happens to deliver. This result pins down the exact finite-horizon constant across the whole unrelaxed step range, shows how the step size enters it, and shows that after two or more steps the best constant is forced by a limit, so a numerical near-extremiser alone would miss the structure.

## How to inspect or reproduce the recorded checks

First verify the algorithmic ordering and the definition of $G_K$. Then check the normalisation and the exact slack identity term by term. The sharpness family should be read together with the equality conditions, because the same construction explains both optimality and non-attainment. The repository README runs the exact replay and both negative controls:

```sh
python3 -B code/replay.py
```

The wrapper verifies actual optimization flags, compares semantic receipts, and requires deliberate trajectory and constant corruptions to raise `VerificationError` in ordinary and optimized modes. Start reading with `paper.pdf`; `CLAIMS.md` maps each claim to its evidence.

## The most valuable next projects

The cleanest open question is unrestricted attainment at $\alpha L=2$. A separate project could ask whether the same coefficient is sharp under saddle-pair comparisons, but that would require a new construction rather than a reinterpretation of this theorem.

## What is in the evidence package

The standalone paper, exact replay code and receipts, claims and assurance records, citation audit, novelty scope, environment instructions, mutation controls and agent-readable index are linked through the repository and the frozen archival deposit.
