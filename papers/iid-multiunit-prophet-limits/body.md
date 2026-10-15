## Summary

You see a sequence of offers one at a time. You know how the offers are distributed, but not which values will arrive. You may accept at most a fixed number, and rejected offers cannot be recovered. How well can you do compared with someone who sees the entire sequence before choosing?

That all-seeing comparison is the **prophet**. For two choices, for example, the prophet takes the two largest offers; the online decision maker must decide without knowing what comes next. Both are compared by their expected total reward, not by who wins on a particular sequence.

This candidate proves that the worst-case ratio between the optimal online reward and the prophet's reward approaches a limit for every fixed selection budget. It also characterises that limit through a continuous-time selection game. For two choices, explicit certified witnesses locate the limit between **83.695% and 83.730%**. The sharper certified upper endpoint is 83.72914%.

The assumptions matter: observations are independent draws from the same **known** distribution, values are nonnegative, and the mean is finite and positive. The number of allowed choices stays fixed while the number of observations grows. These are mathematical guarantees in that model, not measured results for hiring, purchasing or trading.

## Summary for specialists

For $n\ge k$, let $\mathrm{DP}_{n,k}(F)$ be the optimal expected reward from at most $k$ irrevocable online selections. Let $\mathrm{PR}_{n,k}(F)$ be the expected sum of the $k$ largest of $n$ iid draws from $F$. Define

$$\gamma_{n,k}=\inf_F\frac{\mathrm{DP}_{n,k}(F)}{\mathrm{PR}_{n,k}(F)}.$$

The infimum ranges over laws on $[0,\infty)$ with finite positive mean. The optimal policy knows $F$, and the worst-case law may change with $n$. The theorem states that, for each fixed positive integer $k$,

$$\gamma_k^*=\lim_{n\to\infty}\gamma_{n,k}$$

exists. With $P_k(x)=\mathbb E\min\{\mathrm{Pois}(x),k\}$, its two game representations are

$$\begin{aligned}
\gamma_k^*&=\inf_v\frac{V_k^v(0)}{\int v\,dP_k}\\
&=\max_{W\in\mathcal C_k}\inf_{x>0}\frac{W(x)}{P_k(x)}.
\end{aligned}$$

Here $v$ ranges over nonzero, nonnegative, nonincreasing step profiles with bounded support and finite height. The $V_j^v$ solve the terminal-value equations described below. The set $\mathcal C_k$ is the pointwise closure of the convex hull of cumulative payoffs from bounded equal-mesh quantile-threshold policies. Attainment is in this closed payoff class, not an assertion that a bounded policy or worst-case profile attains the optimum.

For $k=2$, the supplied computer-assisted certificates give

$$0.83695\le\gamma_2^*\le0.8372914<0.83730.$$

The broader headline interval $[0.83695,0.83730]$ is a convenient outward rounding. Neither endpoint is claimed to be the exact constant.

## Technical account

### From quantiles to a limiting game

A threshold policy compares each observation's tail quantile with a threshold depending on time and how many selections remain. Quantile coordinates permit the same construction to be interpreted for different known laws. Fresh randomisation inside atoms makes the quantile representation admissible when the law is discrete.

After scaling tail quantiles by the horizon, the limiting state records the number of unused selections. A policy's cumulative coverage is

$$W^a(x)=\int_0^1\sum_{j=1}^k\pi_j^a(t)\min\{x,a_j(t)\}\,dt,$$

where $\pi_j^a(t)$ is the probability of having $j$ slots remaining. A layer-cake identity turns inequalities between cumulative coverage and $P_k$ into reward guarantees for all admissible nonincreasing value profiles.

For a fixed profile, put $\Psi_v(z)=\int(v(s)-z)^+\,ds$. The optimal continuum values satisfy

$$\begin{aligned}
(V_j^v)'(t)&=-\Psi_v(V_j^v(t)-V_{j-1}^v(t)),\\
V_j^v(1)&=0,\qquad V_0^v=0.
\end{aligned}$$

Lower transfer takes a fixed finite policy mixture back to finite horizons. Upper transfer constructs horizon-dependent finite-support laws from a fixed profile. Compactness and a minimax separation argument identify the two values. Separate estimates near zero and in the tail are essential: convergence on a finite numerical grid would not justify the worst-case limit.

### Two choices: two complementary certificates

| Witness | What is checked | Consequence |
|---|---|---|
| Mixture of 36 rational quantile policies, each with 64 time pieces | Ball-arithmetic coverage bounds, including between grid points, the origin and the tail | Lower bound $0.83695$ |
| A rational 41-atom layer measure defining a value profile | An upward-rounded ODE super-solution and a lower bound on the prophet benchmark | Upper bound $0.8372914$ |
| Barriers and quadrature for the earlier nonlinear system | A separate bound on its two-unit parameter sum | That particular asymptotic lower-bound value is strictly smaller than $\gamma_2^*$ |

For intuition, accepting a good offer uses up a slot that might otherwise go to a better later offer. The lower witness balances this trade-off through thresholds that depend on both time and remaining capacity. The upper witness instead supplies a difficult family of distributions against which even an optimal online policy loses a definite fraction of the prophet's reward.

The policy mixture is a useful certificate representation, not evidence that initial randomisation is intrinsically necessary. An occupancy-weighted average of thresholds preserves acceptance flows and dominates a finite mixture's cumulative coverage. This is a constructive use of established occupancy/flow ideas. It need not preserve the original time mesh, attain the closed-game optimum, or eliminate randomisation needed to handle atoms.

## Evidence, assurance and limitations

The general fixed-budget theorem rests on written analytic arguments. The numerical two-unit localisation rests on explicit witnesses checked with Arb ball arithmetic through python-flint, together with analytic transfer to finite horizons. Floating-point search discovers candidate witnesses; it is not itself the certificate. Internal AI-assisted scrutiny and producer replay are not external specialist review, unaffiliated reproduction or proof-assistant verification.

The limit theorem does **not** identify $\gamma_k^*$ with $\inf_n\gamma_{n,k}$. It gives neither exact constants nor a rate uniform in $k$, and it does not cover a budget growing with the horizon. No new numerical interval or nonlinear-system separation for $k\ge3$ follows merely by extending the analytic theorem.

The two-unit comparison shows that the specified earlier nonlinear-system value is not asymptotically tight. It does not invalidate that work's finite-horizon characterisation or lower-bound theorem. Nor does it determine whether the gap is caused by an entire dual restriction or by a particular construction within it.

The integrated manuscript has undergone targeted internal AI-assisted re-review, with no remaining mandatory mathematical revision identified. Its clean frozen replay passed all 10 runs: four certifiers and the regression suite, each in normal and optimized (`-O`) Python modes. [Producer-operated Linux CI](https://github.com/ipitchford/iid-multiunit-prophet-limits/actions/runs/38799210335) also passed using Python 3.11 and python-flint 0.9.0. These are producer-side observations, not independent endorsement. Unknown distributions, dependence between observations, signed rewards and additional selection constraints require separate analysis. The bounded source comparison is not an exhaustive novelty or historical-priority finding. Public archive availability and byte identity have been checked separately from these scientific claims.

## Relationship to earlier work

Jiang, Ma and Zhang develop a finite-horizon occupancy/quantile linear-programming framework and numerical bounds, including a two-unit bracket at $n=1000$. A result at one finite horizon is not automatically a bound on the limiting worst-case ratio.

Brustle, Perez-Salazar and Verdugo, and Molina, Gast, Loiseau and Perchet, provide nonlinear-system constructions yielding asymptotic lower bounds. The distinction here is between a limiting value of a construction and existence and characterisation of the optimal worst-case limit itself.

Quantile minimax methods, Poisson approximations, dynamic programming and occupancy-weighted threshold recovery are established ingredients. The claimed contribution is their proof-level combination for the unrestricted fixed-$k$ iid worst-case limit, with both directions of transfer and explicit endpoint control, alongside the certified two-unit localisation. Recent single-threshold kernel results and fixed-distribution extreme-value asymptotics address different policy classes or orders of quantifiers. The dated source comparison explains those boundaries without claiming priority clearance.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Online-algorithm researchers | Use a limiting game to organise lower strategies and upper adversarial profiles. | Fixed budget, known iid law; no all-horizon-infimum equality. |
| Probability and optimal-stopping researchers | Inspect the link between finite observations, state-dependent controls and continuum values. | Endpoint transfer and attainment distinctions are part of the argument. |
| Computer-assisted-proof researchers | Reuse explicit witnesses, outward rounding and analytic between-grid bounds. | A successful program checks its encoded certificate, not every manuscript claim. |
| Applied decision researchers | Understand a precise benchmark for the cost of making irrevocable choices. | No empirical performance claim or validation for an estimated real-world law. |

## Why the problem matters

A larger stream of offers creates both opportunities and uncertainty. Establishing a limiting worst-case ratio makes the long-horizon benchmark mathematically well defined. The continuum characterisation then separates two tasks: designing strategies that guarantee a fraction of hindsight and constructing distributions showing that no strategy can exceed a fraction. The two-unit interval demonstrates how these opposing tasks can meet closely without claiming an exact closed-form answer.

## How to inspect or reproduce the recorded checks

Read the model and the fixed-$k$ limit proof first, especially the order of quantifiers, finite-horizon transfers and control near zero and infinity. Then inspect the two-unit witnesses separately. The certificate data include mix_fine.json, inst_do450.json and a tabulated deterministic policy; code includes cert_lower_mix.py, cert_upper2.py, certify_single.py, theta_cert.py and test_certifiers.py.

The [research repository](https://github.com/ipitchford/iid-multiunit-prophet-limits) provides the manuscript and checking materials. Use its pinned environment and replay instructions. The certificates use python-flint/Arb with explicit precision and outward bounds. Compare outputs with the stated inequalities, retain failures, and distinguish numerical exploration from certification. The [versioned release](https://github.com/ipitchford/iid-multiunit-prophet-limits/releases/tag/v0.1.0-candidate) and [Zenodo record](https://zenodo.org/records/23404235) provide the exact candidate. Frozen replay and full-download file-identity checks both passed; neither substitutes for scrutiny of the written proof.

An independently executed replay is a useful additional check, but unaffiliated reproduction and independent reimplementation are separate assurance claims.

## The most valuable next projects

First, seek development-independent scrutiny of the general limit proof and of the certificate-to-theorem connection. Mathematically, the all-horizon infimum question remains valuable: existence of the limit does not settle it. New explicit witnesses could narrow the two-unit interval or give certified bounds for larger fixed budgets. Attainment by a useful policy class and quantitative rates under growing budgets are distinct questions, not consequences already supplied here.

## What is in the evidence package

The integrated package brings together the analytic manuscript, two-unit witness data, certifiers, environment and replay records, source comparisons, and file manifests. The manuscript contains the full fixed-budget proof and two-unit arguments; readers do not need private research notes to follow them. Read the [versioned manuscript PDF](https://github.com/ipitchford/iid-multiunit-prophet-limits/releases/download/v0.1.0-candidate/paper.pdf) and obtain the complete package from the [GitHub release](https://github.com/ipitchford/iid-multiunit-prophet-limits/releases/tag/v0.1.0-candidate) or [Zenodo archive](https://zenodo.org/records/23404235).

The published archive DOI is [10.5281/zenodo.23404235](https://doi.org/10.5281/zenodo.23404235). Full downloads of the ZIP, manuscript PDF and SHA256SUMS from both providers matched the frozen hashes. The ZIP SHA-256 is `aaeccd251a733ccd3d710608f0e5869125ee3ed7ad2a9f2126f70bca79d508a7`. Pre-freeze assurance notes inside the archive retain their historical publication-pending wording; the provider checks reported here occurred later. Archive availability is separate from external peer review and from claims about scientific or practical impact.

