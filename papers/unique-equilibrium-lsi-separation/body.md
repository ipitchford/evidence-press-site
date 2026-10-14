## Summary

Can a many-particle system and its mean-field description have different best entropy-dissipation constants even when there is only one equilibrium? This candidate gives a fixed, smooth model where the answer is yes.

The particles live on a circle and interact through a repulsive cosine potential. The uniform distribution is the unique free-energy minimizer. Yet a perturbation that singles out one particle keeps the ordinary particle log–Sobolev constant at most one, for every particle count. The optimal nonlinear constant for the mean-field equation is strictly larger than one.

The distinction is between **which disturbances each variational problem must control**, not between two simulated relaxation curves. The particle problem permits a disturbance of one tagged coordinate. The mean-field problem concerns an entire probability density and includes an interaction penalty. A global proof shows that this penalty creates a strict gap; a calculation near equilibrium alone would not suffice.

The revised manuscript gives an explicit, conservative positive margin, an exact family of nonlinear upper bounds and a clarification of what the example does—and does not—imply for inequalities with an additive error. It remains an unrefereed written-proof candidate. Neither optimal constant is determined exactly.

*Banner: the highlighted coordinate carries a tagged relative-density perturbation. Its one-coordinate marginal is exactly uniform, even though the particles need not be independent. On the mean-field side, the first Fourier mode incurs an interaction penalty, while the remaining nonconstant modes have squared frequencies at least four. These are ingredients of the global proof, not a claim that a linearized calculation alone proves the gap.*

## Summary for specialists

On the circle $E=\mathbb R/(2\pi\mathbb Z)$ with probability Haar measure, fix any $a>0$ and set

$$
V=0,\qquad W(\theta,\phi)=a\bigl(\cos(\theta-\phi)-1\bigr).
$$

For a probability density $\rho$, write $m(\rho)=\int(\cos\theta,\sin\theta)\rho$ and $r=|m|$. The free-energy excess above its unique minimum is

$$
G(\rho)=\mathcal H(\rho)+\frac a2r^2,
\qquad \mathcal H(\rho)=\int\rho\log\rho.
$$

The nonlinear constant is $\lambda_{\mathrm{MF}}=\inf_{\rho\ne1}\mathcal I_{\mathrm{MF}}(\rho)/(2G(\rho))$, with the finite-dissipation class $\sqrt\rho\in H^1(E)$. Zeros in a density are not excluded. For the Gibbs law $\pi_N\propto e^{-H_N}\omega^{\otimes N}$, where $H_N=(2N)^{-1}\sum_{i,j}W(\theta_i,\theta_j)$, the ordinary particle constant is

$$
\lambda_N=\inf_{\nu\ne\pi_N}
\frac{I(\nu\mid\pi_N)}{2\operatorname{Ent}(\nu\mid\pi_N)}.
$$

This infimum is **unrestricted**: particle perturbations need not be permutation symmetric. The candidate proves, for every fixed $a>0$,

$$
\lambda_N\leq1<\lambda_{\mathrm{MF}}
\leq\min\{1+a/2,4\},\qquad N\geq1.
$$

Thus $\limsup_{N\to\infty}\lambda_N<\lambda_{\mathrm{MF}}$ without needing to establish a particle limit. On the unit torus, all constants are multiplied by $4\pi^2$; the separation is unchanged.

## Technical account

### A microscopic test survives every particle count

Simultaneous rotation leaves the Gibbs law invariant, so every one-coordinate marginal is exactly Haar measure. Lift the circle perturbation to the full system as the relative density

$$
g_\varepsilon(\boldsymbol\theta)=1+\varepsilon\cos\theta_1,
\qquad d\nu_\varepsilon=g_\varepsilon\,d\pi_N.
$$

Entropy and relative Fisher information reduce exactly to the corresponding circle integrals. The interaction terms cancel in the relative logarithmic derivative: this is not an assumption of particle independence. Their quotient approaches one as $\varepsilon\to0$, giving $\lambda_N\leq1$ for every $N$.

The same elementary lifting argument works for any coordinate block in a Riemannian product equipped with the ordinary product-gradient Fisher information: the full law's log–Sobolev constant cannot exceed that of a block marginal. Different weighted gradient structures require a fresh argument.

### Why a pointwise inequality is not enough

Let $I_0=4\int|\partial_\theta\sqrt\rho|^2$ and $b_\rho=m(\rho)\cdot\partial_\theta(\cos\theta,\sin\theta)$. The exact deficit identity is

$$
\mathcal I_{\mathrm{MF}}-2G
=(I_0-2\mathcal H)+ar^2+a^2\int\rho b_\rho^2.
$$

All three terms are nonnegative, using the classical sharp circle inequality. But being positive at each nonuniform density would not exclude a sequence whose quotient tends to one.

The global argument supplies that missing step. A Fisher-information bound makes any such sequence compact. Equality rigidity forces its limiting density to be uniform. Near uniformity, almost attaining the circle bound requires concentration in the first Fourier mode. The interaction penalty simultaneously forces that same first mode to disappear—a contradiction. This treats all admissible densities, not a finite Fourier trial family.

### A quantitative margin and a finite-amplitude improvement

The revision makes the gap explicit. With

$$
\eta=\min\left\{\frac1{10},\frac{a}{8(a+2)}\right\},
\qquad
\delta(a)=\min\left\{1,\frac{a}{8+2a},
\frac{\eta^2}{432\pi^2(1+a)^2}\right\},
$$

the candidate proves $\lambda_{\mathrm{MF}}\geq1+\delta(a)$. This deliberately conservative expression is positive for every fixed $a>0$; its deterioration at large $a$ is not evidence that the true constant deteriorates similarly.

An exact upper-bound family comes from $\rho_\varepsilon=1+\varepsilon\cos\theta$. Writing $s=\sqrt{1-\varepsilon^2}$ gives

$$
Q_a(\varepsilon)=
\frac{1-s+(a/2+a^2/8)(1-s^2)}
{2\bigl(1-s+\log((1+s)/2)\bigr)+(a/4)(1-s^2)}.
$$

This is the quotient of a specified trial density, **not** the optimal nonlinear constant. Its negative second-order correction for $a>2$ improves the first-mode linearized bound. In particular, at $a=97/16$ and $\varepsilon=\sqrt3/2$, an exact rational bound on the logarithm proves $\lambda_{\mathrm{MF}}<4$. The linearized envelope at that coupling is four, so finite amplitude genuinely improves it. No extremizer theorem is claimed.

## Evidence, assurance and limitations

The universal separation rests on an analytic proof, including the weak-density interpretation, compactness argument and Fourier contradiction. The quantitative extensions are proved algebraically and analytically, not inferred from numerical minimization.

A supplied finite audit checks 30 circle densities, 120 density/parameter combinations for the dissipation identity, 28 positive-density heat identities and nine particle/parameter combinations with $N=1,2,3$. It includes concentrated and high-frequency densities and square roots with zeros. These are floating-point trapezoidal calculations, not interval certificates or a certified global optimization. The smallest sampled quotient is not a lower bound on the true infimum. The publication package records the exact replay and checking scope separately.

No external human peer review, unaffiliated reproduction or proof-assistant verification is established by the coordinated checking. The model has a unique free-energy minimizer; this does not identify either sharp constant, establish convergence of $\lambda_N$ or settle a variational problem restricted to symmetric particle perturbations.

For a defective inequality in the convention $I\geq2c\operatorname{Ent}-D_N$, a fixed tagged test forces a positive **order-one** defect when $c>1$. It does not force an order-$N$ defect and does **not** refute a proposed inequality allowing $D_N=o(N)$.

## Relationship to earlier work

The conjecture comparison is specifically to [Delgadino, Gvalani, Pavliotis and Smith, arXiv version 1](https://arxiv.org/abs/2112.06304v1). Its printed particle variational definition ranges over all particle probability laws. Common per-particle normalization factors cancel, and both of its constants differ from the manuscript's convention by the same factor of two. The candidate contradicts sharp equality in that unrestricted formulation, not an inferred claim about what the authors intended.

A full-text comparison with the corresponding 2023 journal publication was not available for this manuscript. The release therefore does not silently transfer the conjecture attribution to uninspected journal wording.

[Monmarché's 2026 version 2](https://arxiv.org/abs/2609.06574v2) distinguishes positivity implications from equality of optimal constants; the present result concerns the latter. [Monmarché's 2024 formulation](https://arxiv.org/abs/2409.17901v1), Section 1.4.5, also motivates the weaker allowance of a sublinear additive defect, which this example does not disprove. The [sharp circle inequality of Émery and Yukich](https://www.numdam.org/item/SPS_1987__21__173_0/) is a classical ingredient. The manuscript supplies the precise weak-class rigidity and global comparison needed here.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Researchers in mean-field limits | A fixed unique-minimizer example separating two optimal variational constants. | Distinguish unrestricted particle tests from symmetric ones and exact equality from positivity. |
| Functional-inequality researchers | A concrete combination of marginal lifting, circle rigidity and a global gap argument. | The explicit margin is conservative; the trial-density upper family is not an optimizer. |
| Researchers studying entropy decay | A warning that a macroscopic description need not retain microscopic worst-case disturbances. | No measured relaxation experiment or exact particle asymptotic is supplied. |
| Independent checkers | Complete definitions, analytic interfaces and reproducible finite sanity checks. | Finite quadrature cannot establish the universal infimum. |

## Why the problem matters

A mean-field description can correctly identify equilibrium while losing the disturbance that controls a worst-case particle inequality. The example isolates this distinction without relying on multiple minimizers, singular interactions or an interaction changed with particle count. It shows why matching equilibrium structure is not enough to identify a sharp entropy-dissipation constant.

This is a bounded theoretical correction, not evidence that mean-field models generally fail, that positivity transfer is false or that practical sampling has slowed down.

## How to inspect or reproduce the recorded checks

First check the definitions and normalization: circle length $2\pi$, probability Haar measure, inverse temperature one and the denominator $2\operatorname{Ent}$ or $2G$. Then follow the tagged-coordinate reduction and the proof that excludes every near-one nonlinear minimizing sequence. Inspect the explicit gap and harmonic quotient as separate refinements.

The evidence package's `README.md`, `REPLAY_RECEIPT.md` and `AI_INDEX.md` identify the shipped commands, exact inputs and limits. Numerical checks test selected identities and examples; they do not replace the analytic proof or the source-version comparison.

## The most valuable next projects

1. Determine the optimal nonlinear constant, rather than only improving a selected family of upper bounds.
2. Establish whether the particle constants converge and identify any limit, without replacing a limsup statement by an assumed limit.
3. Study symmetric-only particle perturbations as a genuinely different variational problem.
4. Determine the best additive-defect scale under a clearly stated inequality convention; the current tagged test supplies only an order-one obstruction.

## What is in the evidence package

The package contains the paper and source, machine-readable claims, source/version comparisons, review dispositions, verification material and replay instructions, an agent-readable index and explicit licence and assurance records. Banner and narration explain the claim; neither is additional scientific evidence.
