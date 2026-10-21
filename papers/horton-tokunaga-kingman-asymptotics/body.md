## Summary

This page explains, in order: how branching is measured, which two random-tree models are studied, what this release proves about each, how the proofs work, and what has and has not been checked.

**How branching is measured.** A tree’s number of leaves does not tell us how deeply its branches are nested. Horton–Strahler order measures that nesting: leaves start at one; joining equal orders raises the order by one, while joining unequal orders retains the larger value. A balanced four-leaf tree has order three; a four-leaf comb has order two. The same number appears in the study of river networks and, in the binary case, in the classical count of registers needed to evaluate an arithmetic expression.

**The two models and the open questions.** Kovchegov and Zaliapin's survey of the mathematical theory of Horton laws lists open problems about two random-tree models. In *critical Tokunaga trees*, a family of random trees indexed by a parameter $c>1$, the question (their Problem 3) is what the order looks like when the number of leaves is fixed exactly. In *Kingman's coalescent*, a model in which branches merge in pairs at random, the number of branches of each order was known to fall off at a geometric rate; the question (part of their Problem 9) is whether a stronger, exact geometric law holds.

**What was found.** For critical Tokunaga trees with exactly $n$ leaves, the expected order is the logarithm of $n$ (in a model-dependent base) plus a continuous correction that repeats with period one on the logarithmic scale (it is not asserted to be nonconstant), and the full distribution of the order around that value is described, including its fluctuations. For Kingman’s coalescent, the limiting branch frequencies have a positive geometric prefactor, not merely a known exponential rate: they behave like a constant times a power of $1/\rho$, with $\rho\approx3.04382786$ found numerically (this decimal is not interval-certified).

**Scope.** These are two model-specific theorems, not a claim that natural river networks obey either model.

**Status.** An anonymous, unrefereed candidate (version 1.1.0) with written proofs, revised after a supplied review. Finite exact checks and numerical diagnostics corroborate but do not establish the infinite claims; there is no external peer review, independent reproduction or proof-assistant verification.

## Summary for specialists

For every $c>1$, put $R=2c$. In the critical Tokunaga model, with leaves of order one, the candidate proves

$$
\begin{aligned}
\mathbb E[K\mid L=n]&=\log_R n\\
&\quad+D_c(\log_R n)+o(1),
\end{aligned}
$$

where $D_c$ is continuous and period one (Theorem 1). The centered conditional law converges in total variation along its actual logarithmic phases, with every fixed absolute moment (Corollary 6). No nonconstancy assertion is made for $D_c$. The boundary $c=1$ (perfect binary trees) is excluded.

For the deterministic limiting Kingman branch densities $\mathcal N_j$, it establishes

$$
\mathcal N_j\rho^j\longrightarrow H\in(0,\infty),\qquad 2\le\rho\le4.
$$

More precisely (Theorem 7), $\mathcal N_j/\mathcal N_{j+1}\to\rho$ and $\mathcal N_j\rho^j\to H$, with $H=\rho B_*/C_*$ for positive monotone limits $B_*$, $C_*$, and $\rho/3\le H\le\rho^2$. Floating-point diagnostics give $\rho\approx3.04382786$ and $H\approx3.09387432$; these decimals are not interval-certified, and the approximate value of $\rho$ is not new. The finite-tree size limit is taken first, at each fixed order; then $j$ tends to infinity. Arbitrary joint limits are not included, and no closed form for $\rho$ is claimed.

## Technical account

**Tokunaga trees.** With $R=2c$, the established inverse-pruning construction gives $X_{k+1}=2X_k+V_k$ for the leaf count $X_k$ of an order-$k$ tree, where $V_k$ is a sum of $2X_k-1$ independent geometric variables. The reduction matches leaf-count marginals to a Galton–Watson process with immigration. It does not identify the original tree filtration with that auxiliary Markov chain. A uniform lattice local limit theorem, supplemented by weighted point-probability bounds, makes conditioning on an exact leaf count legitimate. The logarithmic phase survives this conditioning.

**Kingman's coalescent.** The input is the deterministic branch-density/ODE representation established by Kovchegov and Zaliapin (2017), which already gives fixed-order convergence of normalized finite-tree counts; the new issue is the subsequent limit in branch order. Endpoint-normalized profiles produce a monotone integral limit. A separate fractional-linear comparison gives a supermultiplicative bound and controls the normalization. That second step is essential: convergent ratios alone do not rule out a vanishing geometric prefactor.

## Evidence, assurance and limitations

The universal conclusions rest on the written arguments. Symbolic identities and rational probabilities through 64 leaves provide finite checks. Numerical ODE calculations are diagnostics, not proof certificates or interval-certified decimals.

The supplied review exposed a roughly 0.245% drift in one original 60-order estimate despite passing finite inequalities. The revised code uses a stable residual and controlled integration window, reports quadrature warnings and errors, and separately checks agreement between 40- and 60-order runs. The analytic tail bound does not bound all ODE or roundoff errors.

The review has been actioned, but its external identity is unauthenticated. Internal checking, archived availability, formal verification and independent review remain separate assurance dimensions.

## Relationship to earlier work

The $c=2$ binary/Catalan case, including periodic register-function behavior, is classical. The manuscript translates leaf-versus-vertex and order-zero-versus-order-one conventions explicitly. Modern conditioned Galton–Watson results provide important context but use different model assumptions or observables.

The Kingman exponent and endpoint comparison also predate this work. The claimed advance is the positive geometric prefactor. The source audit is targeted, not an exhaustive guarantee of priority.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Probability researchers | Exact-conditioning and normalization arguments | Audit the analytic proofs, not just the scripts |
| Branching and algorithm researchers | Compare order conventions and fluctuation laws | The classical binary case is not a new result |
| Mathematical modelers | More precise predictions within specified random-tree models | No empirical calibration or model validation is supplied |

## Why the problem matters

A leading exponent leaves substantial information unresolved. It may not describe fluctuations at a fixed size, and it need not determine whether a rescaled quantity has a nonzero limit. This package addresses those two gaps in distinct settings.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md` and the manuscript. In an isolated Python environment, install `requirements.txt`, then run the exact checker normally and with `-O`. Run the numerical checker at 40 orders and at 60 orders with step 0.04, then compare their JSON records using `verify_stability.py`. Run `negative_controls.py` in both modes: all six deliberate errors must be rejected. Full commands are in the package README.

Successful replay checks the shipped diagnostics. It does not mechanically verify the local-limit theorem or the infinite ODE hierarchy.

## The most valuable next projects

Independent scrutiny of the Fourier bounds and positive-normalization argument is the first priority. Validated ODE enclosures could certify numerical constants. Joint finite-size/order limits and empirical model assessment are separate research questions, not missing conditions silently assumed here.

## What is in the evidence package

The archive includes manuscript source and PDF, an agent-readable index, review dispositions, source comparison, pinned dependencies, exact and numerical checkers, retained revised diagnostics, negative controls and a complete checksum manifest. The original supplied review audit is retained privately rather than relicensed as part of the research output.
