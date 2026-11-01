## Summary

**The question.** An infection spreads through a network of contacts (people, farms, computers) but is not quite strong enough to persist. How quickly does it die out, and does the shape of the network matter, or only the reproduction number $R_0$? This release answers both parts for the most widely used deterministic model of network epidemics.

**The model.** In SIS (susceptible, infectious, susceptible again) an infected node recovers and can be infected again, as with many bacterial infections or computer malware. The N-intertwined mean-field approximation (NIMFA) gives each node $i$ an infection level $x_i(t)$ between 0 and 1, driven by its infected neighbours, and $y(t)$ is the average over nodes. Time is measured in mean recovery times: with weekly recovery, 52 time units is a year. The tipping point is $R_0=1$, the largest eigenvalue of the scaled contact matrix.

**What was conjectured.** In 2024 Persoons, Sensi, Prasse and Van Mieghem ran extensive simulations and conjectured a universal speed limit: at or below the tipping point, whatever the network and starting state, $y(t)\le1/(1+t)$. A matching limit was conjectured above the tipping point, for settling down to the endemic level from above. Their appendix sketched an argument for the first statement but left two inequalities unproved.

**What was found.**

1. **Both conjectures are true** (Theorems 3 and 4). At or below $R_0=1$, an epidemic never fades more slowly than $1/(1+t)$, on any network. The proof follows one "entropy-like" average, built from the classical Volterra-type function $h(s)=-s-\log(1-s)$, which can only fall at a controlled rate.
2. **The limit covers more settings.** The same argument works for networks that change over time, nodes that recover at different speeds and, after a natural reweighting, one-way contacts. Because the deterministic model over-estimates the exact random model on average, the limit also holds for the *expected* prevalence of the stochastic SIS model when all nodes recover at the same rate.
3. **Exactly at the tipping point, shape matters a lot.** Regular networks, where every node has the same number of contacts, sit exactly on the limit. Otherwise the average eventually behaves like $\kappa(G)/t$, where $\kappa(G)\le1$ is computed from the network's leading eigenvector and equals 1 only for regular networks. On standard synthetic networks of 1,000 nodes, $\kappa$ is about 0.9 for small-world and random networks and about 0.04 for spatial and scale-free ones. So the same $R_0=1$ epidemic takes about 920 recovery times to fall below 0.1% on a small-world network, but about 40 on a spatial (random geometric) one.
4. **A small $\kappa$ is not good news.** It means infection has concentrated in a small, well-connected core: the *average* falls quickly while hubs stay infected. A single node can carry a multiple of $1/t$ that grows like $n^{1/3}$ with network size $n$.
5. **The motivating question.** The 2024 paper used these limits to decide when a slowly changing contact network can be treated as frozen ("timescale separation"). The release makes those bounds unconditional for every $R_0$, and shows with high-precision numerics that one growth estimate in that paper is not a valid general bound away from $R_0$ close to 1.

**How sure we are.** Every result has a written proof, and the conjectures' proofs were re-derived by several AI reviewers who tried and failed to break them. Four scripts re-derive the algebra exactly and test every theorem numerically, with negative controls that must fail. This is an anonymous, AI-assisted, unrefereed candidate; its review was internal, not peer review. The sharpness results concern the deterministic mean-field model on synthetic networks, not a particular real epidemic.

## Summary for specialists

NIMFA: $\dot x_i=-\delta_ix_i+(1-x_i)(Bx)_i$ on $[0,1]^n$ with $B\ge0$, $y=\frac1n\sum_ix_i$, $R_0=\rho(B)$ for $\delta=1$. Conjectures 1 and 2 are eqs. (9)–(10) of Persoons et al. (Phys. Rev. E 109, 034308, 2024).

- Envelope: under a quadratic-form condition, $H_w=\sum_iw_ih(x_i)/\sum_iw_i$ with $h(s)=-s-\log(1-s)$ obeys a scalar Riccati comparison $\dot z=(r-d)z-rz^2$, and Jensen's inequality gives $y_w\le h^{-1}(H_w)\le z$; the condition holds for symmetric, temporal, heterogeneous-recovery and Perron-weighted directed systems (Theorem 1, Corollary 2) *(proof)*
- Conjecture 1: for symmetric $B$ with $\rho\le1$, $y(t)\le(1-\rho)/(e^{(1-\rho)t}-\rho)\le1/(1+t)$ for every initial state (Theorem 3) *(proof)*
- Conjecture 2, sharpened: above threshold on a connected graph with $p\le x(0)\le u$, $0\le y(t)-\bar p\le(1-\bar p)/(1+t)$, with an exponential form (Theorem 4) *(proof)*
- Sharpness: attained by regular graphs; the subcritical exponent $1-\rho$ is exact for every connected graph (Propositions 5–6) *(proof)*
- Critical constant: at $\rho(\Delta^{-1}B)=1$, $t\,x_i(t)\to v_i/\sum_ju_j\delta_jv_j^2$ for every node and nonzero initial state (directed, heterogeneous recovery); for symmetric unit-recovery $B$, $t\,y(t)\to\kappa(G)=\frac{(\frac1n\sum v_j)(\frac1n\sum v_j^2)}{\frac1n\sum v_j^3}\le1$ with equality iff regular, and $r\,T(r)\to\kappa(G)$ (Theorem 7, Corollary 8) *(proof)*
- Nodes: $x_i(t)\le\sqrt{n/(t(1+t))}$; the worst asymptotic node constant has order exactly $n^{1/3}$ (Proposition 9) *(proof)*
- Stronger statements fail: the unweighted average on directed graphs (an explicit two-node example with $\ddot y(0)=97/32$) and the arithmetic-mean parameter (Proposition 10) *(proof)*
- SIR/SIRS infectious fractions and the expected prevalence of the exact Markovian SIS process with a common curing rate obey the envelopes (Propositions 11–12; the stochastic step is Simon and Kiss 2018) *(proof)*
- Timescale separation: mixed initial states never converge more slowly than both extremes; unconditional transition-time bounds for all $R_0$, exact on regular graphs (Proposition 13, Theorem 14) *(proof)*; the growth formula (eq. 20) of Persoons et al. under-estimates growth times within its hypotheses at $R_0=2,3,5$ (Table 3) *(numerical, two solvers, not interval-certified)*

## Technical account

**From a Lyapunov function to a rate.** The function $h(s)=-s-\log(1-s)$ is the classical Volterra (Goh, Korobeinikov) function $\sigma-1-\log\sigma$ written in the susceptible fraction $\sigma=1-s$. Along NIMFA, $\frac{d}{dt}h(x_i)=-\delta_i\frac{x_i^2}{1-x_i}+x_i(Bx)_i$. A weighted sum turns the second term into the quadratic form $x^{\mathsf T}WBx$, which condition (D) bounds by $r\sum_iw_ix_i^2$; the remaining term is a convex function $\Phi_{r,d}$ of $h(x_i)$, so Jensen's inequality gives $\dot H_w\le-\Phi_{r,d}(H_w)$. Comparison with the scalar Riccati equation, and Jensen again for the increasing convex $h$, give the envelope. The key point is that $\Phi_{r,d}$ stays convex even when the infection rate exceeds the recovery rate, so one argument covers the regimes below, at and above threshold. At $R_0=1$ the familiar linear (copositive) Lyapunov functions degenerate; the nonlinear $h$ does not.

**Weights.** For symmetric $B$ the quadratic form is the Rayleigh quotient. For directed networks a diagonal matrix $W=\operatorname{diag}(u_i/v_i)$ built from the left and right Perron vectors makes $WB+B^{\mathsf T}W$ satisfy the same inequality (Lemma 2), the classical diagonal stability of Metzler matrices used for SIS by Khanafer, Başar and Gharesifard (2016). Without weights the plain average can break the bound (Proposition 10).

**Why shape matters at the threshold.** At $R_0=1$ the Jacobian at 0 has a simple zero eigenvalue with Perron eigenvector $v$, and the dynamics reduce to $\dot c=-\sigma c^2+O(c^3)$ along $v$: the standard centre-manifold mechanism (Carr 1981), giving $1/t$ decay with constant set by $\sum v_j^3$. Theorem 7 makes this global, with explicit node-wise limits for every nonzero initial state and for directed and heterogeneous recovery. The population constant $\kappa(G)$ is small when the Perron vector is localised on a few nodes, as on Barabási–Albert and random geometric graphs; Chebyshev's sum inequality gives $\kappa\le1$, with equality only for constant $v$, that is, regular graphs.

**Classical and new.** The conjectures are due to Persoons et al. (2024). The function $h$, separable Lyapunov functions for monotone systems (Dirr et al. 2015), diagonal weights (Rantzer 2015; Khanafer et al. 2016), comparison for cooperative systems (Smith 2008), exponential decay below threshold (Mei et al. 2017) and the centre-manifold mechanism are known. Within a bounded search, the new elements are the Jensen step that gives a quantitative Riccati rate valid at the critical point, the proofs of both conjectures and their extensions, the global critical constant with its characterisation, the $n^{1/3}$ node order, the unconditional transition-time bounds, and the numerical failures of eq. (20).

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/nimfa-sis-decay-envelopes.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 19-page manuscript.
- **Computational checks.** `exact_checks.py` re-derives every algebraic identity used in a proof with SymPy (37 checks; 4 negative controls evaluated at exact rational points). `numerical_checks.py` tests every theorem on random weighted graphs below, at and above threshold, including temporal, heterogeneous-recovery, directed and disconnected cases (23 checks; 9 negative controls, false statements that must be observed to fail). `illustrations.py` computes Tables 1, 1b and 2 and Figure 1 and fails if any rigorous bound it evaluates is violated; `eq20_check.py` computes Table 3 with two solvers and fails if they disagree. No script uses `assert`, so all checks stay active under Python's `-O` flag, and a fault-injection switch confirms that a flipped check makes the run fail.
- **Replay.** From a fresh extraction of the frozen archive, all four scripts were rerun with `-I -O -B` and every regenerated output matched the retained one; GitHub CI repeats the two fast checkers on Linux.
- **Review.** Internal AI-assisted review in five roles, an adversarial review and an audit of new proofs by a separate model, a separate proof audit and a clean replay led to one revision round and a re-review; no reviewer or audit found a critical issue. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The results concern the deterministic NIMFA model, which is least accurate near the threshold; for the stochastic model they give an upper bound only, with a common recovery rate. The numerical examples use synthetic networks with fixed seeds, and $\kappa$ depends on network size and seed (Table 1b). The eq. (20) failures are high-precision numerical findings, not interval-certified. Open: a sharp growth bound on heterogeneous graphs, the uniform-in-time node-wise order, and how $\kappa$ scales with network size.

## Relationship to earlier work

Lajmanovich and Yorke (1976) introduced the deterministic network SIS model and proved global convergence; Van Mieghem, Omic and Kooij (2009) developed it as NIMFA, and Fall et al. (2007), Khanafer, Başar and Gharesifard (2016) and Mei et al. (2017) studied stability and exponential decay below threshold. Prasse and Van Mieghem (2020) gave near-threshold approximations of the time-dependent solution, and Van Mieghem (2012) the epidemic phase transition, where the cubic Perron sum also appears. Persoons, Sensi, Prasse and Van Mieghem (2024) posed the two conjectures for their study of timescale separation; their October 2026 follow-up on temporal clique graphs does not mention them in its abstract. Shuai and van den Driessche (2013), Dirr et al. (2015) and Rantzer (2015) supply the Lyapunov and diagonal-stability background; Goltsev et al. (2012) and Pastor-Satorras and Castellano (2016) explain eigenvector localisation; Cator and Van Mieghem (2014) and Simon and Kiss (2018) connect the mean-field model with the exact stochastic process.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Network-epidemic modellers | A proved, network-independent speed limit for die-out at or below $R_0=1$, and $\kappa(G)$ as a one-number summary of how shape changes decay at the threshold | Deterministic mean-field model; stochastic transfer is an upper bound only |
| Public-health and control analysts | The decay at $R_0=1$ can differ more than twentyfold between network types with the same $R_0$; a fast-falling average can hide a persistent core | Synthetic networks only; no real contact network is analysed |
| Researchers on temporal networks | Unconditional transition-time bounds for treating a slowly changing network as frozen | The rigorous growth bound is conservative on strongly heterogeneous graphs |
| Dynamical-systems theorists | A Jensen-based route from a separable Lyapunov function to a sharp rate at a critical point | Bounded literature search |
| Research agents | Machine-readable claims, an agent index and replayable checks with fault injection | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

How fast an infection fades near its tipping point decides how long control measures must be kept in place and whether a changing contact pattern can be modelled as a fixed one. A universal limit that does not depend on the network gives modellers a guarantee they do not have to simulate. The critical constant shows where that guarantee is tight and where it is far from tight, and warns that a quickly falling average can coexist with a stubborn infected core.

## Where to inspect the package and reproduce the checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.11:

```sh
shasum -a 256 -c SHA256SUMS
python3 -m pip install -r requirements.txt          # numpy 2.3.5, scipy 1.17.0, sympy 1.14.0, networkx 3.4.2, matplotlib 3.10.8, mpmath 1.3.0
python3 -I -B tools/replay_compare.py . --quick      # exact and numerical checkers with fault injection, under -O (under a minute)
python3 -I -B tools/replay_compare.py .              # all four scripts, including Tables 1-3 and Figure 1 (about 8 minutes)
```

`VERIFICATION.md` maps each script to the result it checks and states what it does not establish, and `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Prove a sharp growth bound on heterogeneous graphs, for example that growth from a small uniform start takes at most $(1-r)/r$ recovery times.
2. Determine the node-wise constant uniformly in time and initial state (between $n^{1/3}$ and $n^{1/2}$).
3. Find how $\kappa$ scales with network size for random graph families, and compute it for real contact networks.
4. Certify the eq. (20) counterexamples with interval integration.
5. Extend the envelope to the stochastic SIS process with node-dependent recovery rates.
