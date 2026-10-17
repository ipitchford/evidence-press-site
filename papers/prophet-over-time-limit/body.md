## Summary

Suppose you have one resource to rent out over a season. An offer arrives each day. You know the distribution of offers, but not the future. You can accept today's price for one day and reconsider tomorrow, or commit for the rest of the season. A prophet sees every offer in advance. How close can an online decision maker get to the prophet's expected earnings?

For independent offers from the same known distribution, this candidate proves that the hardest-distribution ratio approaches a limit as the season becomes longer. Explicit mathematical witnesses give

$$
0.60922\leq\gamma^*\leq0.609816<1/\varphi,
\qquad \varphi=(1+\sqrt5)/2.
$$

That is **60.922% to 60.9816%**, below the inverse golden ratio of about 61.8034%. It is a certified interval, not an exact constant. The expectation is over random offers; this is not a guarantee on every realised sequence or a practical rental recommendation.

The candidate also shows that deterministic threshold schedules can approach this limiting guarantee arbitrarily closely. It does not identify one bounded schedule that attains the limit. When the offer distribution has atoms—repeated values with positive probability—implementing quantile thresholds can still require randomised tie-breaking.

## Summary for specialists

Let $X_1,\ldots,X_n$ be iid nonnegative draws from a known law $F$ with $0<\mathbb E_F X<\infty$. A lease lasting $t$ periods earns $tX_i$ and makes the resource unavailable during those periods. Write $G_n(F)$ for the optimal online expected reward and $B_n(F)$ for the prophet benchmark. The paper proves existence of

$$
\gamma^*=\lim_{n\to\infty}\gamma_n,
\qquad \gamma_n=\inf_F G_n(F)/B_n(F).
$$

The limit has equivalent continuum profile and cumulative-coverage minimax formulations. A survival-weighted averaging construction dominates finite mixtures of threshold schedules, yielding deterministic near-optimality after equal-mesh approximation. This is a specialised use of concavity and occupancy/survival weighting, not a new general purification principle.

A 64-threshold policy witness gives the lower bound; a 40-level value profile with a constant tail and an 80,000-step supersolution certificate gives the upper bound. Separately, a 30-level zero-bulk instance at $n=10^6$ certifies $G_n(F)/B_n(F)\leq0.6123450$. That finite instance is neither the asymptotic upper witness nor an estimate of the limit.

## Technical account

### From discrete rental decisions to quantile coverage

The inherited optimal-online recurrence is

$$
G_0=0,\qquad G_m=\mathbb E\max\{mX,\ X+G_{m-1}\}.
$$

The two options are a commitment for all remaining periods and a one-period rental followed by optimal continuation. The prophet benchmark is

$$
B_n=\sum_{t=1}^n\mathbb E\max\{X_1,\ldots,X_t\}.
$$

Tail quantiles turn rewards into integrals against cumulative coverage. In the continuum, a bounded nonnegative threshold schedule $a(t)$ has survival probability

$$
\pi_a(t)=\exp\!\left(-\int_0^t a(u)\,du\right)
$$

and coverage

$$
W^a(x)=\int_0^1\pi_a(t)(1-t)\min\{x,a(t)\}\,dt.
$$

The corresponding prophet coverage is $P(x)=1-(1-e^{-x})/x$. Compactification and minimax identify the limiting game; analytic transfers in both directions connect that game to finite horizons. These written arguments, rather than numerical convergence plots, establish existence of the limit.

### Why mixtures do not improve the supremum

For a finite mixture of schedules with weights $\mu_k$, define

$$
p(t)=\sum_k\mu_k\pi_{a_k}(t),\qquad
b(t)=\frac{\sum_k\mu_k\pi_{a_k}(t)a_k(t)}{p(t)}.
$$

Then $p=\pi_b$. Concavity of $z\mapsto\min\{x,z\}$ implies $W^b(x)\geq\sum_k\mu_kW^{a_k}(x)$ for every $x$. Approximation by equal-mesh schedules gives the same supremum. For each positive error tolerance, a schedule works for all sufficiently large horizons uniformly over admissible laws. The proof does not make the required horizon practically small or establish a bounded optimiser attaining the supremum.

### What the arithmetic certifies

Arb ball arithmetic encloses numerical error for the explicit policy and profile witnesses. Between-grid and endpoint arguments are part of the bound, rather than an inference from sampled values alone. The upper certificate includes $V(0)\leq1.217051$ and prophet benchmark at least $1.9957696$, supporting the stated ratio bound. The exact replay targets and inputs must be read with their source-level mathematical interpretation.

## Evidence, assurance and limits

Replay from a clean extraction of the final archive passed in normal and optimised Python modes, together with rejection of five excessively strong target bounds. The tagged repository also passed its numerical-certificate CI. These are producer-side checks, not independent reproduction.

The evidence has two distinct parts: written universal arguments for the limiting theorem and deterministic near-optimality, and computer-assisted enclosures for specified numerical witnesses. Neither substitutes for development-independent mathematical scrutiny. This is an AI-assisted, unrefereed candidate, not formal verification or independent reproduction.

The exact constant remains unknown. Attainment by one bounded schedule is not proved. Atom ties may require randomisation. The coarse finite-transfer estimate for the asymptotic upper witness becomes useful only at an enormous horizon, so it is not a practical finite-horizon performance estimate. Correlated arrivals, unknown distributions and real-world rental outcomes are outside the stated model.

## Relation to prior work

Abels, Pitschmann and Schmand introduced the over-time model and supplied the online recurrence and an inverse-golden-ratio upper bound. Perez-Salazar and Verdugo developed quantile strategies and an exact finite-horizon convex characterisation. This candidate builds on those foundations, establishes the limiting characterisation and supplies explicit witnesses strictly below the earlier inverse-golden-ratio benchmark. Fan's minimax theorem, layer-cake representations and survival-weighted concavity are established ingredients. The public source audit should be consulted for theorem-level applicability and the limits of the bounded literature search; no blanket priority claim is intended.

This is a different problem from selecting at most a fixed number of offers: here the duration of a commitment changes how many future offers can be considered.

## Who should care, and why?

| Reader | Useful part | Boundary |
| --- | --- | --- |
| Online-algorithm researchers | A limiting game and deterministic near-optimal threshold schedules | No attained bounded optimiser or exact constant |
| Computer-assisted proof developers | Explicit policy/profile witnesses with enclosed arithmetic and rejection controls | Replay checks the encoding and supplied witnesses, not every written argument |
| Researchers studying commitment | A precise model in which accepting an offer occupies future periods | No empirical rental-market or deployment claim |

## Why the problem matters

Commitment changes the value of waiting. A good offer today may occupy the resource when a better offer arrives tomorrow. The limiting ratio separates this loss from the incidental length of a finite season, while the two-sided witnesses show that the familiar inverse-golden-ratio benchmark is not the exact answer in this model.

## How to inspect or replay

Read the manuscript's definitions and limiting theorem before interpreting a number. Then inspect the analytic transfer and survival-weighted domination arguments. For numerical bounds, use the package's pinned environment and replay instructions, checking the policy/profile witness separately from the million-period finite example. Compare both normal and optimised runs, and retain the excessive-target failures as controls. The [versioned evidence package](https://github.com/ipitchford/prophet-over-time-limit/releases/tag/v0.1.0-candidate) includes the exact archive and checksum manifest; start with its AI index and replay guide.

## Most valuable next projects

1. Tighten the two-sided interval while retaining analytic between-grid and endpoint control.
2. Determine whether a suitably specified threshold class attains the limiting value, or explain non-attainment.
3. Derive useful finite-horizon convergence bounds rather than relying on the deliberately coarse transfer estimate.
4. Independently check the analytic proof and reimplement the numerical certificate path.

## What is in the package?

The versioned package contains the integrated manuscript, numerical witnesses, Arb-based certifiers, regression and negative controls, replay receipts, source audit, licence map and machine-readable claims. This page and its synthetic audio explain the research; they are not additional scientific evidence.
