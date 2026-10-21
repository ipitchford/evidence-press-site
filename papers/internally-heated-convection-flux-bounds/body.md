## Summary

**The setting.** Mantles and other planetary interiors are heated from within by radioactive decay, and their viscosity is so large that the Prandtl number is effectively infinite. The idealized model is a layer of fluid heated uniformly throughout, held between a cold floor and a cold ceiling, in the limit of infinite Prandtl number. Without flow, half the heat leaves through each plate. Convection breaks this symmetry: warm fluid rises, so more heat leaves through the top and less through the floor.

**The question.** How little heat can still escape through the cold floor as the heating grows stronger? Write $F_B$ for the fraction of the heat leaving through the base and $R$ for the flux Rayleigh number, which measures the strength of internal heating. The best earlier guarantees that hold for every flow allowed $F_B$ to fall as fast as $R^{-2/3}$ between rigid plates and $R^{-40/29}$ between stress-free plates. The problem is listed as item 3, heat transport in mantle-type convection, of *Open problems in geology suited to frontier AI*.

**What was found.** This candidate supplies stronger mathematical lower bounds on that bottom heat loss. With rigid, no-slip plates the guaranteed fraction scales as $(R\log R)^{-1/3}$; with stress-free plates it scales as $R^{-1/2}$. The horizontal periods are held fixed. The result concerns classical solutions, not arbitrary turbulent weak solutions or every physical mantle model.

**How to read the result.** The central advance is analytical. The flow calculations illustrate the gap between the bound and computed solutions—over the computed ranges, published time-dependent simulations and the computed steady rolls both give roughly $F_B\approx 1.3R^{-0.09}$, far above the bound—and they do not prove that the bound can be attained. Decimal prefactors are estimates, not certified numerical bounds.

**Status.** An anonymous, AI-assisted, unrefereed written mathematical candidate. A supplied review has been actioned and the supporting checks replayed internally; there is no formal or independently authenticated verification.

## Summary for specialists

For uniform internal heating in a horizontally periodic slab in dimension two or three, with $T=0$ on both plates and infinite Prandtl number, the candidate derives (Theorem 2.1)

$$
\liminf_{\tau\to\infty}\frac1\tau\int_0^\tau F_B(t)\,dt
\geq \mathcal B\!\left[\tfrac12 R\mathcal T\,\Phi\right],
$$

where $\mathcal T$ is the long-time maximum temperature and $\Phi$ the wall function of the Stokes kernel. The functional is

$$
\mathcal B[m]=\frac{\int_0^1 z\, e^{-\int_0^z m(s)\,ds}\,dz}{\int_0^1 e^{-\int_0^z m(s)\,ds}\,dz}.
$$

The near-wall estimates yield orders $(\Lambda\log\Lambda)^{-1/3}$ for no-slip plates and $\Lambda^{-1/2}$ for stress-free plates, with $\Lambda=R\mathcal T/2$ and the stated large-$\Lambda$ thresholds. A drift-independent eventual temperature ceiling (Theorem 2.3) depends on the enlarged horizontal-cell volume and eliminates $\mathcal T$ (Corollary 2.4). This produces the advertised orders at **fixed horizontal periods**, not uniformly over arbitrary joint large-domain limits.

| Result | Status in the paper |
|---|---|
| Theorem 2.1: inequality for $F_B$; exponents $1/3$ (up to a logarithm) and $1/2$ | Proved; constants given by explicit formulas in two slab-correction norms proved finite |
| Numerical values of the slab-correction norms and prefactors | Estimated with sensitivity checks and sampled Carlson majorants, without uniform error enclosures |
| Proposition 2.2: exact large-$\Lambda$ asymptotics of the bound functional | Proved; the stress-free prefactor uses a computed constant |
| Theorem 2.3 and Corollary 2.4: temperature ceiling and bounds in terms of $R$ alone | Proved, with explicit constants |
| Simulations and steady rolls | Two-dimensional computations; no claim of attainment, global optimality or asymptotic exponents |
| Profile hypothesis of Chen et al. (2024) | Unproved; one finite-window profile violates the triangle off-grid, not a stationary counterexample |

## Technical account

**Step 1: the minimum principle.** Nonnegative temperature gives $J(z)\le m(z)\Theta(z)$, where $J$ is the averaged convective flux, $\Theta$ the averaged temperature and $m$ a bound on the vertical speed at height $z$. This inequality is linear in the temperature. The heat balance becomes a differential inequality for $\Theta$. Multiplication by an integrating factor and the two zero boundary values give the ratio-of-integrals lower bound. The energy identities of the background method are not used.

**Step 2: the near-wall speed.** The admissible $m$ comes from the Stokes response. The horizontal kernel has zero integral, permitting subtraction of the temperature midrange and a factor of one half. For no-slip walls, the wall function behaves as $z^2\log(1/z)$; its integral creates the cube-root logarithmic scale. Stress-free walls instead give a linear wall function and a square-root scale.

**Step 3: the temperature ceiling.** The bound still involves the long-time maximum temperature $\mathcal T$. For every incompressible flow, Theorem 2.3 bounds it by

$$
\mathcal T\le\mathcal T_{\max}=1+\frac{e}{2\pi^2}\max\{2,\ \ln(2^{d+1}\lvert\tilde\Omega\rvert)\},
$$

where $\tilde\Omega$ is the enlarged horizontal cell. This removes the solution-dependent parameter at fixed periods.

The revised stress-free proof removes the low-frequency cusp before applying the radial Sobolev estimate. The exact functional asymptotics concern the lower-bound functional, **not optimality among solutions of the PDE**. The banner's arrows are a heat-flow schematic, not a computed velocity field; its exponent comparison refers to fixed-domain large-$R$ orders.

## Evidence, assurance and limitations

The supplied review has been actioned. Sampled Carlson maxima and plotted prefactors are labelled estimates, not continuum upper enclosures. All eight saved snapshots now have 384 horizontal coordinates matching their padded physical fields, with the original 256 coordinates retained separately; temperature and velocity arrays are unchanged.

One finite-window no-slip profile at $R=10^6$ passes the old grid test but exceeds the Chen triangle near the upper wall. Its boundary-slope ratio is approximately **1.000119051132**. The revised code checks slopes and off-grid extrema of the spectral interpolant. This cooling-window effect does not refute the stationary or infinite-time hypothesis.

The supporting suite passes 194 checks in normal and optimized Python. Profile controls and a corrupted-snapshot rejection check supplement kernel, Stokes-map and small steady/DNS comparisons. These are internal checks, partly on stored data. They are not a fresh integration of all runs, formal verification, unaffiliated reproduction or authenticated external peer review.

The stored trajectories are finite-window illustrations: spatial resolution and heat-budget closure do not establish temporal or statistical convergence. Step changes restart with SBDF1. Roll scans establish best-found values and non-detection within their sampled ranges, not branch disappearance, global optimality or asymptotic exclusion. No rigorous numerical prefactor, logarithm removal, finite-Prandtl theorem or saturating solution is claimed.

## Relationship to earlier work

Arslan and Rojas obtained earlier unconditional leading orders $R^{-2/3}$ and $R^{-40/29}$. The present claim improves these powers under the fixed-domain assumptions. Chen and colleagues already obtained a related one-third rate conditional on a temperature-profile hypothesis; this is not the first appearance of that exponent.

Minimum principles, logarithmic Stokes estimates and drift-independent temperature bounds have precedents. The proposed contribution is their assembly into this internally heated bottom-flux bound. Sondak and colleagues and Wen and colleagues also constrain the novelty of the roll calculations: competing optima and three-tenths scaling are established antecedents. The source search is bounded, not a priority certificate.

## Who should care, and why

| Audience | Potential use | Boundary |
| --- | --- | --- |
| PDE and heat-transport researchers | A pointwise comparison route to stronger flux bounds | Classical infinite-Prandtl, fixed-period setting |
| Convection modellers | A lower-bound benchmark and inspectable finite-window data | No empirical mantle prediction or convergence guarantee |
| Numerical analysts | A concrete case where grid sampling misses a boundary violation | Spectral diagnostics are not validated continuum enclosures |

## Why the problem matters

Internally generated heat is important in planetary interiors. The idealized model asks a narrower but useful question: what restrictions follow from the equations before choosing a particular flow? A stronger lower bound rules out more extreme concentration of heat loss through the top. Translating it to physical predictions requires assumptions absent here, including finite-Prandtl effects and realistic geometry and material properties.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md`, `REVIEW_RESPONSE_V21.md`, the manuscript's Theorem 2.1 and temperature ceiling, and `REPLAY_ENVIRONMENT.json`. Verify the release checksums and internal manifest. In an isolated environment matching the recorded replay dependencies, run:

```sh
python code/test_publication.py
```

That command runs the arithmetic/profile checks in both normal and optimized Python and verifies rejection of a malformed snapshot. The broader `reproduce.sh` regenerates derived checks, tables, figures and the manuscript. Neither command promises a fresh replay of every simulation and parameter sweep; those separate scripts and their stored inputs are mapped in `DEPENDENCIES.md`. Section 2.5 of the manuscript sorts every result by whether it is proved or computed.

## The most valuable next projects

1. **Independent scrutiny** of the Stokes-kernel and temperature-ceiling arguments is the first priority.
2. **A validated uniform numerical prefactor** would turn estimated plots into certified numerical evaluations.
3. **Longer windows and time-step sensitivity** would strengthen empirical claims if those are pursued.
4. **Continuation of roll extrema** would be more informative than asserting disappearance from isolated scans.
5. **Attainment and logarithm removal** remain separate research problems.

## What is in the evidence package

The versioned package contains the 25-page manuscript and LaTeX/Markdown sources, supporting scripts, stored simulation and roll data, all eight repaired snapshots, current replay logs, input hashes, revision response, source-comparison records, licences and an AI index. Original prose and data are CC0; original code is MIT; the citation style retains its upstream licence. Media explains the result and supplies no additional scientific evidence.
