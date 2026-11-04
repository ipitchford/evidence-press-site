## Summary

**The setting.** When a team of robots, drones or sensors tracks a shared state (where everyone is, how fast they move), the textbook tool is the Kalman filter. A central Kalman filter keeps one large covariance matrix: a table saying how uncertain every quantity is and how the errors of different units are linked. Keeping that table up to date means sending a lot of data around the network.

**The shortcut.** The *isolated Kalman filter* (IsoKF) of Jung, Luft and Weiss (*Autonomous Robots*, 2025) saves communication. When a measurement involves only a few units (the *participants*), only those units do a proper update. Their links to everyone else are not recomputed; they are rescaled by a simple correction factor. The authors conjectured that, whenever the system is observable and controllable, the covariance this filter reports settles to a finite, unique, stable steady state, just as it does for the ordinary Kalman filter.

**The answer: no.** The paper gives a small, fully explicit counterexample.

- **Three units, pair-sum measurements.** Three scalar states are measured in pairs through the sums $x_1+x_2$, $x_2+x_3$ and $x_3+x_1$. One round of these measurements determines the whole state, the system is controllable through its process noise, and every local matrix the filter uses stays positive definite.
- **Reported variances explode.** With dynamics that triple each state per step ($A=3I$), the smallest reported variance after $k$ rounds is proved to be at least $\tfrac54(\tfrac95)^k-\tfrac14$, which grows without bound.
- **The ordinary filter is fine.** The centralised Kalman filter on the same system keeps every variance at most $3/4$.
- **Mild instability is enough.** Computer-assisted proofs show that a large starting uncertainty diverges for growth factors $a^2$ anywhere in $(1,1.38]$ once it enters a certified region, and that it does enter from the prior $10^{12}I$ at eight listed values of $a^2$, down to $1+10^{-8}$.
- **No single steady state.** At $a^2=21/20$ the prior $I$ provably settles while the prior $10^{12}I$ provably diverges, so there is no globally attracting steady covariance.

**What actually goes wrong.** In high-precision tests of the divergent cases the *actual* error of the IsoKF estimate stays bounded. What fails is the reported uncertainty: it becomes grossly pessimistic (by a factor of up to about $10^{190}$ in the strongest case) and stops meaning anything as an error measure. That still matters in practice: a covariance that is wildly too large defeats outlier gating, fusion with other sources and consistency checks.

![Two panels for the three-node pair-sum system with growth factor a² = 21/20, over 300 epochs. Left, on a logarithmic scale: the largest reported IsoKF variance. Starting from the identity it settles near 1.7; starting from 10¹² times the identity, and from 10⁴ times the identity, it climbs steadily, reaching about 10¹⁷; the centralised Kalman filter stays below 1. Right, on a linear scale: the largest variance of the actual estimation error for the same three starts, which stays below 0.8 in all cases.](/assets/figures/isolated-kalman-covariance-divergence-coexistence.png "Figure 1 of the paper. Same system, two starting points: one settles, one explodes. (a) Largest reported IsoKF variance at a² = 21/20 (P₀ = I settles, proved; P₀ = 10¹²I grows like 1.05ᵏ, proved; P₀ = 10⁴I grows, numerical only; dotted: centralised filter). (b) Largest variance of the actual error of the IsoKF estimate (numerical): below 0.8 in all three cases.")

**Where it is safe.** Stable dynamics can never diverge (proved). Relative measurements between units, combined with a directly observed anchor, keep the variances bounded (proved). The counterexample relies on pair-*sum* channels, not plain differences. Separately, the paper classifies exactly when every local update is well defined: whenever distinct participant groups share at most one unit.

The sections below move from this overview to a specialist summary, the technical argument, evidence and limits, and how to rerun the checks.

## Summary for specialists

Nodes with block-diagonal $A$, $Q$; an observation with participant set $U$ updates the participant block jointly, $C=B-BH_U^{\mathsf T}S^{-1}H_UB$ with $B=P[U,U]$, and rescales every participant–nonparticipant cross-covariance by the marginal ratio $D_i=C_{ii}B_{ii}^{-1}$ (published eqs. (47)–(50); the paper's (2.1)–(2.3) and Table 2). Results at a glance:

| Result | Statement in brief | Status |
|---|---|---|
| Prop. 3.1 | Schur-stable $A$: reported marginals bounded for every schedule; divergence needs instability | Proof |
| Thm. 4.1 | $A=3I$ triangle of pair sums: $\min_iP_{ii}\ge\frac54(\frac95)^k-\frac14$; central KF $\le3/4$ | Proof (+ exact check of 4 epochs) |
| Thm. 5.1, Cor. 5.3 | Any connected non-bipartite pair-sum graph diverges if $a^2\ge\rho(M)$ ($2+\sqrt5$ for the triangle); extra attenuation or deletion does not help | Proof |
| Thm. 6.2 | Triangle, $Q=R=I$, $a^2\in(1,1.38]$: invariant escape region, growth exactly at rate $a^2$ | Computer-assisted |
| Cor. 6.3 | Prior $10^{12}I$ enters that region at 8 listed $a^2$ from $1+10^{-8}$ to $1.38$ | Computer-assisted |
| Thm. 6.4, Cor. 6.5 | $a^2=21/20$: $P_0=I$ converges, $P_0=10^{12}I$ diverges; no globally attracting steady covariance | Computer-assisted |
| Finding 7.1 | Actual error covariance of the IsoKF estimate stays bounded while the reported one diverges | Numerical (80 digits) |
| Finding 7.2 | Divergence threshold from $P_0=I$ near $a^2\approx1.1225$; deletion variant close to $2+\sqrt5$ | Numerical |
| Thm. 8.1 | Local blocks always stay positive definite iff distinct participant sets share at most one node | Proof (+ exact witness) |
| Prop. 9.1 | Anchored full-coordinate relative measurements give bounded marginals | Proof |

The counterexample is inside the conjecture's stated scope: the journal explicitly admits unstable dynamics, and the dissertation's extra positive-semidefiniteness clause holds throughout.

## Technical account

**The recurrence (Section 2).** The object studied is the mathematical recurrence of the published update equations, with the correction factor read as the marginal ratio applied to the marginal prior. For linear time-invariant models the buffered implementation equals the dense array, so the analysis applies to the algorithm as specified; the `ikf_lib` software was inspected but not run.

**The counterexample (Section 4).** Write $p_i=P_{ii}$ and $c_{ij}=-P_{ij}$. Lemma 4.2 shows that the sign cone $0\le c_{ij}<\min(p_i,p_j)$ is invariant under prediction and every pair-sum update. Inside the cone, Lemma 4.3 gives a harmonic-mean lower bound for each updated marginal, $p'\ge pq/(p+q)$. Following one epoch through the three updates, after prediction gives every marginal at least $t=9m_k+1$, yields $m_{k+1}\ge(9m_k+1)/5$ and by induction the bound $\frac54(\frac95)^k-\frac14$. The centralised filter is bounded by the information form, $P^{\rm KF}\preceq(H^{\mathsf T}H)^{-1}$.

**Graphs (Section 5).** For any connected non-bipartite graph of pair-sum observations, the same cone and harmonic bounds give a linear comparison system whose Perron root $\rho$ sets the threshold: all marginals diverge when $a^2\ge\rho$. Multiplying the correction by any further attenuation factor, including deleting cross-covariances outright, preserves the argument.

**Mild instability (Section 6).** In terms of six *deficits* $e_{ij}=p_i-c_{ij}$ the update depends on the marginals only through ratios such as $e/p$, so for large marginals the deficits evolve almost autonomously. Certificate C1 covers $a^2\in[1,1.38]$ by 190 intervals and checks, in outward-rounded interval arithmetic, that an explicit box is invariant and forces growth at the open-loop rate. C2 simulates the recursion from $10^{12}I$ in interval arithmetic until it enters that box. C3 encloses the trajectory from $P_0=I$ at $a^2=21/20$ in a box on which the epoch map is a contraction, giving a bounded fixed point.

**Well-posedness and a safe regime (Sections 8–9).** If two participant groups share two nodes, an explicit prior makes the second update's block indefinite; with overlaps of at most one node, a Schur-complement argument keeps every block positive definite. With an anchor observed directly, relative measurements propagate a bound outwards from the anchor in a finite number of steps.

## Evidence, assurance and limitations

- **Proofs.** Proposition 3.1, Theorems 4.1, 5.1 and 8.1 and Proposition 9.1 have written analytic proofs.
- **Computer-assisted.** Theorems 6.2 and 6.4 and Corollaries 6.3 and 6.5 rest on interval-arithmetic certificates (mpmath 1.3.0, outward rounding) that check the finite hypotheses of written arguments. They assume mpmath's interval arithmetic is correctly rounded; they are not formal proofs.
- **Exact checks.** Rational arithmetic checks four complete epochs of Theorem 4.1 (240 checks), the schedule matrix and its characteristic polynomial $\lambda(\lambda^2-4\lambda-1)$, the participant-family and singularity witnesses, and the anchored identity.
- **Numerical findings.** The bounded actual error and the divergence thresholds are numerical evidence only.
- **Replay.** All eleven scripts were rerun from fresh copies with and without Python `-O`; every JSON and CSV output reproduced byte for byte. Checks are explicit tests, not `assert`, and a deliberately corrupted determinant is rejected under `-O`. GitHub CI reruns the exact checks and certificates on Linux.
- **Limits.** Entry is certified only at eight values of $a^2$; nothing is proved for $a^2\in(1.38,2+\sqrt5)$. Uniqueness for stable dynamics and the case $a=1$ remain open. The counterexample uses pair-sum measurements, not differences. No failure of the `ikf_lib` software is claimed. The literature search was bounded (1–4 November 2026) and the full text of Luft et al. (2018) was not available. Review was internal and AI-assisted only.

## Who should care, and why

- **Developers of decentralised multi-robot or sensor-network estimators** that use isolated or partial-update Kalman filtering: observability and controllability alone do not guarantee bounded reported covariances; the paper gives a concrete test case and a safe regime (anchored full-coordinate measurements).
- **Estimation and control theorists**: a clean, checkable example of how a consistent-looking local correction rule can break Riccati-type convergence, with a sharp contrast to deletion of cross-covariances.
- **Users of reported covariances for gating and fusion**: a covariance can be wildly wrong while the estimate itself remains reasonable, so consistency checks need care.

## Why the problem matters

Decentralised estimation is a standard building block for teams of robots and sensor networks, where bandwidth is scarce. Covariances are not decoration: they decide how much a new measurement is trusted, whether an outlier is rejected and how estimates from different sources are fused. A convergence guarantee would let designers rely on the reported uncertainty; the counterexample shows that, for this filter, that reliance needs extra conditions.

## Related reading on Evidence Press

[*When canonical covariance localisation fails*](https://evidencepress.org/releases/canonical-covariance-localisation-failure/) studies a different Kalman-filtering approximation, covariance localisation in ensemble filters, where a proposed simplification also fails to deliver what was hoped. It is thematic related reading, not a confirmation of this result.

## How to inspect or reproduce the recorded checks

From the unpacked archive (Python 3.10 or later, [uv](https://docs.astral.sh/uv/)); every script needs a new `--out` directory:

```sh
uv run python3 -I -B scripts/verify_pairwise_divergence.py --out /tmp/isokf/pairwise
uv run python3 -I -B scripts/verify_exact.py --out /tmp/isokf/exact
uv run python3 -I -B scripts/verify_anchored_identity.py --out /tmp/isokf/anchored
sh scripts/run_ext.sh /tmp/isokf/ext ""      # certificates C1-C3 and numerical findings, about 15 s; or "-O"
```

Outputs are compared with `results/normal/` and `results/O/`, which they match byte for byte.

## The most valuable next projects

1. Certify entry into the escape region for every $a^2\in(1,1.38]$, and prove anything for $a^2\in(1.38,2+\sqrt5)$.
2. Prove that the actual estimation error stays bounded, or find a case where it does not.
3. Settle uniqueness of the steady state for Schur-stable dynamics and the case $a=1$.
4. Test the compiled `ikf_lib` software, other graphs, noise ratios $Q\ne R$ and finite-precision behaviour.

## What is in the evidence package

The archive contains the LaTeX manuscript and PDF, the bibliography generated from saved Crossref and arXiv records, the exact rational verifiers, interval certificates C1–C3, the numerical scripts, their outputs in normal and `-O` mode, both figures, a claim-by-claim verification ledger, a rating-free summary of the internal review, an AI index, research-gate records, CI configuration and SHA-256 sums. Text and data are CC0-1.0 and code is MIT. This is an unrefereed candidate.
