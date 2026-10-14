## Summary

How long must a local random sampler run before it largely forgets where it started? In a ferromagnetic spin system, neighbouring binary variables favour agreement. Each sampling step selects one vertex uniformly at random and redraws its value from the distribution conditional on all the others. Strong dependence, highly connected vertices and extremely rare configurations can make a general mixing guarantee difficult.

This candidate proves a near-linear worst-start bound throughout the range **strictly below the stated field threshold**. For a graph with $n$ vertices, the bound grows as $n\log^2(2n)$ at fixed accuracy. It permits arbitrary finite degrees and heterogeneous parameters within the stated envelope, without a uniform lower bound on individual stationary probabilities. The theorem counts **single-site updates**, not sweeps or measured computing time.

The proof separates a difficult system into a part whose rare deviations can be controlled and a residual part to which an existing entropy theorem applies. It then compares that auxiliary calculation back to the **original, unmodified sampler**. The result does not require running a new sampler that freezes vertices in practice.

The manuscript is an unrefereed written-proof candidate. Finite diagnostic checks support selected identities and bounds, not the theorem for all graphs or the analytic results imported from earlier work.

*Banner: gold vertices indicate a deterministic set selected for large degree or bias. After burn-in, their deviations from spin one are rare. Pinning them is an analytical comparison: the original chain still updates every vertex. The graph is schematic; the three error terms come from the proof, not simulation data.*

## Summary for specialists

Fix a positive envelope $(\beta,\gamma,\lambda)$ with

$$
\beta\leq1<\gamma,\qquad \beta\gamma>1,\qquad
\lambda<\lambda_c(\beta,\gamma)
=\left(\frac\gamma\beta\right)^{\sqrt{\beta\gamma}/(\sqrt{\beta\gamma}-1)}.
$$

On any finite simple undirected graph with $n\geq2$, the individual finite positive parameters must satisfy

$$
0<\lambda_v<\lambda,\qquad 0<\beta_e\leq\beta,\qquad
\gamma_e\geq\gamma,\qquad 1<\beta_e\gamma_e\leq\beta\gamma.
$$

The law on $\{0,1\}^V$ is

$$
\mu(x)\propto
\prod_{v:x_v=0}\lambda_v
\prod_{\{u,v\}\in E:x_u=x_v=0}\beta_{uv}
\prod_{\{u,v\}\in E:x_u=x_v=1}\gamma_{uv}.
$$

For uniform random-scan single-site heatbath dynamics, the candidate theorem gives

$$
t_{\mathrm{mix}}(\varepsilon)
\leq\left\lceil K(\beta,\gamma,\lambda)\,
n\log^2(2n)\log(1/\varepsilon)\right\rceil,
\qquad 0<\varepsilon\leq\tfrac12.
$$

The constant is independent of the graph, degrees, admissible individual parameters and initial state. It is **not** uniform as the fixed envelope approaches its threshold. The endpoint $\lambda=\lambda_c$, the sharper $O(n\log n)$ rate and other scan rules are not established here. A conditional update may itself require work proportional to the vertex degree.

A concrete envelope is $(\beta,\gamma,\lambda)=(1,2,3)$. Here $\lambda_0=\sqrt2\approx1.414$ is the earlier near-linear field bound, while $\lambda_c\approx10.661$. The field cap $3$ lies beyond the former but strictly below the latter. This is an example of the covered parameter range, not a numerical estimate of the theorem's mixing constant.

## Technical account

### Make the covariance estimate integrable

In the analytic argument, an occupied coordinate means **original spin zero**. A common scalar tilt $s\in(0,1]$ multiplies all zero-spin fugacities by $s$. Mixed pinnings preserve the envelope. The manuscript combines Feng–Guo–Yang's established influence bound and computation-tree representation with a small-field estimate to obtain

$$
\operatorname{Cov}(X)\preceq(1+As)\operatorname{Diag}(\mathbb E X),
$$

uniformly under the required tilts and pinnings, with $A$ depending only on the envelope. The excess over one vanishes linearly in $s$, making the scalar stability integral equal to $A$. A constant covariance bound alone would not make that integral finite.

The matrix conversion tracks incoming influences as column sums and uses a similarity argument for eigenvalues. It does not assume that similarity preserves the Euclidean operator norm.

### Trim for analysis, not for the algorithm

Write the logistic interaction and bias as

$$
J_e=\log(\beta_e\gamma_e),\qquad
\theta_v=-\log\lambda_v-\sum_{e\ni v}\log\beta_e.
$$

The proof chooses a deterministic set $T$ containing vertices with degree above $D\log(Hn)$ or bias above $B\log(Hn)$. Two coupon-collector windows ensure that all vertices have had the required update opportunities. The selected update uniforms are independent **conditional on the site schedule**; the evolving neighbouring spins need not be independent.

After that burn-in, each vertex of $T$ has probability at most $\delta=(Hn)^{-10}$ of being zero, uniformly over later times and starting configurations. Conditioning these vertices to one produces a residual law with polynomially controlled conditional marginals. That lower bound is asserted only for the residual law, not the original system.

Miao–Yin's existing scalar-field log–Sobolev criterion then bounds the residual mixing time. The original clock is retained: choosing one of the pinned vertices becomes a self-loop in the auxiliary chain. If $m$ vertices remain, its kernel is

$$
Q=\frac mn P_U+\left(1-\frac mn\right)I.
$$

There is no substitution of an expected number of active updates for a random one. Empty and one-vertex residual systems are handled separately.

### Compare back, with every error accounted for

Couple the original and auxiliary chains over a finite horizon. The total-variation error is bounded by three contributions: residual mixing, an original-chain trajectory leaving the pinned region, and the stationary cost of conditioning. For the paper's choices this gives

$$
d(2L+t_*)\leq\frac1{16}+(t_*+2)n(Hn)^{-10}.
$$

The parameter-only constants are fixed in an order that makes the comparison non-circular. Repetition of a constant-accuracy contraction then gives the logarithmic dependence on $1/\varepsilon$.

### What the relaxation corollary adds

The same scalar covariance estimate already implies

$$
\operatorname{gap}(P)^{-1}\leq n(1+\kappa)e^A,
\qquad \kappa=\max\{1,\lambda\},
$$

for the original, untrimmed chain, by Miao–Yin's gap comparison. This is a useful linear relaxation bound and a direct application of an imported result. It does not replace the worst-start proof: a generic gap-to-mixing estimate can retain a harmful dependence on the smallest stationary mass.

## Evidence, assurance and limitations

The claim rests on a written analytic argument and named results from Feng–Guo–Yang and Miao–Yin. Two distinct finite-checking records accompany the publication:

- The **public original checker** verifies **22,323 exact rational equalities** across five small graph models and **459 mixed-pinning/scalar-tilt laws**. It checks conditional laws, stationarity, detailed balance, retained kernels with the original clock and Dirichlet scaling, including all-pinned and one-retained-coordinate cases. **Seven semantic negative controls** reject deliberately false formulas in both normal and optimized Python execution. The star and two-spin obstruction identities are checked separately.
- The **supplied reviewer audit** was replayed internally in normal and optimization-safe execution. It enumerates **75 heterogeneous models**, **855 pinned scalar covariance tests** and **7,440 initial-state/schedule pairs**, across graphs with two to six vertices. These are finite-state computations in IEEE double precision, not Monte Carlo or exact-arithmetic certificates. A false-assertion negative control was rejected. Its source remains private because redistribution rights were not established; the public package records its results and limitations, not that private code.

The audit does not compute the unknown uniform source constant or the final mixing constant. It does not establish the theorem on arbitrary graphs, unbounded degrees or all allowed parameters. Internal analytic checking and a supplied referee-style report are not unaffiliated reproduction, external human peer review or proof-assistant verification.

The revision also explains why two tempting shortcuts fail. Even two independent rare spins can have a diverging inverse ordinary log–Sobolev constant while still mixing uniformly quickly. A star example violates degree-uniform relative marginal stability in the occupied-zero orientation. These examples rule out particular direct applications, not all possible entropy arguments or alternative orientations.

## Relationship to earlier work

[Feng, Guo and Yang, version 2](https://arxiv.org/abs/2604.00963v2), define the heterogeneous class and prove near-linear mixing below $\lambda_0=\sqrt{\gamma/\beta}$, together with polynomial mixing throughout the larger strict range $\lambda<\lambda_c$. Their influence and computation-tree results are essential inputs. This candidate addresses their stated full-range near-linear question with a squared logarithm.

[Miao and Yin, version 1](https://arxiv.org/abs/2609.21936v1), provide the scalar-field entropy and gap criteria. The candidate contribution is the pair of interfaces needed to use those tools here: an integrable covariance rate and a deterministic trimming/comparison argument that handles marginal and startup dependence. It is not a new general entropy theorem.

[Chen, Feng, Yin and Zhang, version 1](https://arxiv.org/abs/2203.07771v1), give a different entropy-boosting route. The manuscript identifies the relative-marginal-stability obstruction to applying that route directly in the chosen orientation. A targeted prior-art comparison is available in the package; it is not a global priority certificate.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Researchers in spin-system sampling | A worst-start bound across the specified heterogeneous field range. | Check every envelope inequality; the threshold is strict. |
| Markov-chain theorists | A concrete way to control rare adverse coordinates before applying an entropy theorem. | The original law need not have a uniform ordinary log–Sobolev constant. |
| Sampling-software developers | A theoretical guarantee for uniform random-scan heatbath updates in this class. | Update count is not wall-clock cost, and the bound's constant is not numerically calibrated. |
| Independent checkers | Explicit analytic interfaces and a small finite audit to scrutinize. | Finite replay is not a proof of the imported theorems or universal conclusion. |

## Why the problem matters

An asymptotic sampling bound is useful only if it covers the actual parameters and starting conditions. Requiring a good initial sample can move the hard part outside the theorem. Requiring every marginal probability to be moderately large can exclude otherwise tractable systems. The value of this candidate is a near-linear update bound without either restriction, inside an explicitly delimited class.

The result is theoretical. No claim is made that it improves a deployed sampler, reduces measured research cost or establishes the optimal mixing rate.

## How to inspect or reproduce the recorded checks

Start with the manuscript's parameter envelope, occupied-zero convention and single-site time normalization. Then inspect the exact imported statements and the small-field, startup and comparison lemmas. From the public package directory run:

```sh
python3 -B verify.py
python3 -B -O verify.py
```

Each successful run reports the exact comparisons and rejection of all seven deliberately false formulas. To inspect one explicit rejection, run `python3 -B verify.py --negative-control retained-clock-not-lazy`: the intended result is exit code 1. The public checker uses explicit exceptions, not assertions that vanish under optimization. Read `REPLAY_RECEIPT.md` for the separation between these exact identities and the privately retained floating-point reviewer audit.

The most important independent work is checking the universal source-to-proof interfaces, not merely rerunning the finite examples. Public package links and archive identities appear in the sidebar.

## The most valuable next projects

1. Determine whether the extra logarithm can be removed to reach $O(n\log n)$ within the same parameter class and clock.
2. Investigate the threshold endpoint separately; this proof's parameter-dependent constants do not settle it.
3. Make the constants explicit enough for informative numerical bounds and compare them with actual sampler performance without conflating updates and elapsed time.
4. Test whether the trimming comparison can help another model, first verifying its rare-deviation and residual-mixing hypotheses rather than transporting the conclusion by analogy.

## What is in the evidence package

The package provides the mathematical manuscript and source, `CLAIMS.json`, `ASSURANCE.md`, prior-art/source comparisons, the original exact checker `verify.py`, `REPLAY_RECEIPT.md`, environment and licence information, and `AI_INDEX.md` identifying the evidence and its limits. The supplied reviewer's private audit code is not redistributed. The banner and audio explain the result; they are not additional scientific evidence.
