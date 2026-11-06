## Summary

Many optimisation problems are easier to solve by alternating between two simpler calculations. Douglas–Rachford splitting is a widely studied way to do this. A proposed guarantee said that, under a condition called cocoercivity, the squared size of its updates should shrink at an inverse-square rate.

This candidate gives exact counterexamples. One uses a single real variable; another uses a two-dimensional rotation. Both satisfy the conjecture's stated assumptions. Across the whole stated class, the correct uniform worst-case squared-residual order is inverse-linear, not inverse-square.

**Read the cover as a worked example.** The gold path follows 80 updates of the paper's planar construction towards the central fixed point. At index 20, its squared residual is approximately 0.00305135—about 22% above the proposed upper bound of 0.0025. The path is drawn numerically from the stated matrix; the violation is proved exactly in the manuscript. The algorithm still converges. What fails is the promised bound.

**The practical distinction:** a residual measures how much an iteration changes, not how far its answer is from the optimum. This paper corrects a mathematical guarantee; it does not show that a practical solver is unreliable.

This is an **unrefereed, AI-assisted research candidate**. Its proofs and exact rational checks received internal checking, not external journal peer review or unaffiliated reproduction. No formal proof assistant was used. A bounded search located no earlier direct refutation but does not establish worldwide priority.

## Summary for specialists

Conjecture 3.5 of Abbaszadehpeivasti and Zamani, arXiv:2509.06676v2, assumes a convex subdifferential $A$, a $\beta$-cocoercive $B$, stepsize $0<\gamma<\beta$, and fixed relaxation $0<\lambda<2$. Its proposed squared fixed-point residual bound is false even with $A=0$ and unit relaxation.

For each fixed admissible parameter triple, the normalized worst-case squared update residual has order $\Theta(N^{-1})$. There are $N-1$ completed updates before residual evaluation at index $N$. The exact constant for the full nonlinear mixed class is not determined.

The scheduling results instead use $A=0$, the final **unrelaxed** residual after $m$ updates, and one real scalar multiplying the current residual. Their algorithm excludes anchoring, matrix updates, extra directions and alternative output rules. The unrestricted optimal scalar may exceed two. The conventional-interval corollary gives an exact, unattained infimum **only on the linear subclass**.

## Technical account

Cocoercivity controls a rotational component without removing it. That is weaker than requiring an operator to be a convex gradient. The planar witness exploits this difference; the scalar witness separately exposes an overrelaxation problem. Neither proves that a gradient assumption is sufficient to repair the residual claim.

The uniform exponent combines a standard averaged-operator upper estimate with a horizon-dependent planar lower construction. Each fixed rotational example can still converge geometrically: a worst-case family may change with the horizon without contradicting faster convergence of any one member.

For example, the rational unit-relaxation witness has squared residual about $0.00305135$ at index 20, exceeding the proposed $0.0025$. Rational identities and an elementary inequality establish the violation; the decimal is only an illustration.

The schedule formulas combine classical contraction polynomial theory, a known sharp proximal-point bound and published rotation-product algebra. The adaptive-policy formulation is a carefully credited synthesis. An elementary corollary then identifies the linear-class infimum for scalars in $(0,2)$, approached as constant scalars tend to two but not attained by an admissible policy. It supplies no matching nonlinear upper bound.

Exact hinge-and-rotation witnesses show why an elementary repair considered in this paper—taking the larger of two candidate envelopes—is still insufficient. The analytic nine-evaluation family explains an active-set mechanism; its small exact gap is not evidence of practical instability.

## Evidence, assurance and limitations

The package contains written mathematical arguments, rational witnesses, separately authored finite checkers, normal/optimized Python replay, semantic negative controls and source comparisons. A 24-case checker receipt includes targeted terminal-boundary and actual-vector coefficient failures. These tests establish bounded computational checks, not all universal claims.

The exact finite hinge instance, illustrative decimals and analytic perturbation argument have different roles. Internal implementation diversity is not independent reproduction; internal AI review is not external specialist or journal review.

The measured quantity is a **fixed-point residual**, not an objective gap or distance to a solution. Converting between these errors needs further assumptions. No practical runtime advantage, instability or failure of convergence is established.

## Relationship to earlier work

The paper corrects the specified conjecture, not all results of the originating work. Its separate objective-value acceleration conjectures remain unresolved. The inherited sharp proximal-point constant, contraction inequality and rotation product are explicitly credited.

The search found no earlier direct refutation within its documented scope. He and colleagues' related relaxation paper was accessible only through its abstract and record, so its exact overlap remains unknown. No historical-priority claim is made for the scheduling synthesis or elementary corollary.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in monotone splitting | Check which operator assumptions support a claimed residual rate | Cocoercivity does not imply gradient structure |
| Authors of rate-analysis or performance-estimation software | Use small rational witnesses as diagnostic examples | Finite replay is not a universal theorem check |
| Readers comparing adaptive iterations | See exactly which scalar-update class the barrier covers | Anchoring, inertia, other outputs and matrix steps are outside it |

## Why the problem matters

A convergence guarantee says what can be promised uniformly over a class. An overly optimistic guarantee can underestimate how many updates are needed. The difference here concerns the exponent, not merely a small constant. Correcting that claim is useful even though it does not assess typical practical solver behaviour.

## How to inspect or reproduce the recorded checks

Begin with the manuscript's two counterexamples, then the assumptions table and Theorems 4–6. For the finite checks, extract the evidence package and follow its README and VERIFICATION instructions. The standard-library replay entry points are:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B run_checks.py
PYTHONDONTWRITEBYTECODE=1 python3 -B -O run_checks.py
```

Retained checker-guard receipts distinguish expected scientific rejection from successful positive runs. Optional symbolic and exploratory numerical files have separate dependencies; rerunning an exploratory optimiser is not necessary to inspect the exact counterexamples.

## The most valuable next projects

- Determine the exact finite-horizon supremum for the full mixed class, not just its exponent.
- Resolve the nonlinear minimax problem when scalar steps must remain in $(0,2)$.
- Compare the unavailable scheduling source in full before strengthening any priority statement.
- Study the originating paper's objective-value conjectures under their own gradient assumptions; these counterexamples do not settle them.

## What is in the evidence package

The package includes the complete manuscript, exact-check source code and outputs, actual-vector series checks, guard-test receipts, claim and assurance records, bibliography/source comparisons and a rating-free revision response. The examples and source comparisons let another reader challenge or extend the result without relying on private editorial material. Media on this page explains the candidate and adds no scientific evidence.
