## Summary

**What compartmental spreading models are.** Many things spread from person to person: infections, rumours, opinions, new products and habits. A compartmental model splits a population into a few groups, such as "unaware", "heard it once", "actively spreading" and "lost interest", and tracks what fraction of people is in each group as they meet and move between groups. The SIR model of epidemics (susceptible, infectious, recovered) is the best-known example. At the end of an SIR outbreak the number of active spreaders falls by a fixed fraction every day. That is **exponential fade-out**, and it is what modellers usually assume when they project how fast an outbreak or a rumour will die away.

**What Chan, Crommelin and Mandjes conjectured.** In a 2025 paper (arXiv:2511.02437), Chan, Crommelin and Mandjes studied a broad class of such models. They drew two diagrams for each model: a *transition graph* showing who can move to which group, and a *dependency graph* showing whose presence each group needs in order to empty. They proved that when these graphs have no loops (or almost none), every group that empties does so fast enough for its total activity to be finite. They conjectured more: that it always empties *exponentially*.

**This conjecture had already been refuted.** An earlier Evidence Press release, [Algebraic extinction in acyclic compartment models](/releases/algebraic-extinction-compartments/) (20 October 2026), gave a four-group model whose spreaders fade like $18/t^2$, a power of time rather than an exponential. That release also proved that four groups are needed and gave a spectral test for when decay is exponential. In its example the dependency graph contains a loop, as the conjecture's "nearly acyclic" wording allows. This release is a successor to that one and builds on it.

**What this release adds.**

- **Both graphs without loops, and an exact solution.** A four-group "staged rumour" model (unaware, primed, spreading, stifler) in which *both* graphs have no loops still fades slowly. Its whole trajectory is written down exactly, and the active fraction decays like $x(t)\sim\sqrt{3/8}\,t^{-3/2}$.
- **Why it happens.** The outbreak ends exactly at the tipping point where each spreader replaces itself: the effective reproduction number $R_{\mathrm{eff}}$ tends to $1$. In SIR the endgame overshoots, $R_{\mathrm{eff}}$ ends below one and decay is exponential. The graphs cannot see this balance, because it is about rates, not about which contacts are possible.
- **A classic model does the same.** A version of the well-known two-step contagion (SWIR) model of Janssen, Müller and Stenull (2004), without direct infection and with recovery written as in the source paper, belongs to the conjectured class and also gives a $t^{-3/2}$ tail at a tricritical-type point. That model and its exponent come from the earlier physics literature; the new step is checking that it meets the conjecture's conditions.
- **Limits on how slow.** With four groups, nothing fades more slowly than $t^{-3/2}$; three groups always fade exponentially (as the earlier release also showed). Larger chains fade like $t^{-1-1/m}$, slower than the earlier release's family at each even size.
- **Slow tails are fragile.** In models driven by one active group, slow fade-out needs finely tuned starting points: almost every starting point gives exponential decay. A small perturbation restores exponential decay at a rate predicted by a general slowing law.
- **No peak first.** In the chain, SWIR and hierarchy families studied, a slow tail never follows an outbreak peak: activity falls from the start.
- **A repair.** Simple conditions that can be checked from which coefficients are non-zero (support-checkable) or from the rates themselves rule the mechanism out and guarantee exponential decay.

**What it means for epidemiology.** Slow, power-law fade-out is the deterministic signature of an endgame poised at $R_{\mathrm{eff}}=1$. It is a warning that extrapolating a declining curve to an elimination date can be wrong near that threshold. But it needs tuning, and real populations are finite: an exploratory simulation suggests that a finite population of size $N$ dies out after a time of order $1.5\,N^{0.42}$, 6 to 36 times earlier, in the range simulated, than the time at which the deterministic model predicts fewer than one active spreader. The models are deterministic and no data are analysed.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Results are labelled proof, exact computation, numerical, exploratory or open. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

**Setting** (Chan, Crommelin and Mandjes, arXiv:2511.02437v1). Conservative quadratic models $\dot y_j=\sum_{i,k}\beta^j_{ik}y_iy_k-y_j\sum_{l,k}\beta^l_{jk}y_k$ with transition graph and dependency graph (donor to catalyst of its outflow). Conjecture 1 (p. 25): under (G1) acyclic transitions and (G2) the dependency-cycle condition, every vanishing compartment decays exponentially. Already refuted in the parent release (doi:[10.5281/zenodo.23501636](https://doi.org/10.5281/zenodo.23501636)).

**Theorem 3.1 (proof; exact).** The model $\dot s=-2sx$, $\dot w=2sx-wx$, $\dot x=(w-r)x$, $\dot r=rx$ has acyclic transition graph $S\to W\to X\to R$ and acyclic dependency graph. With $\vartheta(t)=(16+\tfrac23t)^{-1/2}$, $\zeta=1+\vartheta$ and data $(\tfrac{25}{48},\tfrac5{24},\tfrac1{240},\tfrac4{15})$,
$$
s=\frac{\zeta^2}{3},\quad w=\frac{\zeta(3-2\zeta)}{3},\quad x=\frac{\vartheta^3}{3\zeta},\quad r=\frac1{3\zeta},\qquad x(t)\sim\sqrt{3/8}\;t^{-3/2},\quad \int_0^\infty x\,dt=\log\tfrac54 .
$$
Here $R_{\mathrm{eff}}=w/r\to1$ with $1-R_{\mathrm{eff}}\sim 9/(2t)$.

| Result | Relation to parent | Status |
|---|---|---|
| No-direct-infection SWIR/GEP submodel admits a tricritical-type triple zero, tail $(\sqrt3/8)\,t^{-3/2}$ (§3.4) | new check of a known model | proof; exact |
| Same model, data $(\tfrac{50}{81},\tfrac{25}{162},\tfrac{11}{3240},\tfrac9{40})$: $x\sim4t^{-2}$, codimension one (§3.3) | new | proof; exact |
| Three compartments never suffice (Theorem 4.1) | same statement as parent Theorem 5 | proof |
| Tails $t^{-1-1/m}$ for every even $m$, both graphs acyclic (Theorem 5.1) | slower at each even $N$ than parent's $t^{-m/(m-1)}$ | proof; exact $m\le20$ |
| Any $N=4$ model with interior data: exponential, $\sim Ct^{-2}$ or $\sim Ct^{-3/2}$ (Theorem 5.7) | new | proof; numerical examples |
| Complete classification of the four-state chain (Theorem 6.1) | different model from parent's | proof |
| Algebraic extinction on a Lebesgue-null set of data for $\dot y=xHy$; codimensions 1 and 2 in the chain (Theorem 6.2) | new | proof; exact |
| Order-$k$ zero: perturbed rate $\propto\lvert\varepsilon\rvert^{(k-1)/k}$, endpoint shift $\propto\lvert\varepsilon\rvert^{1/k}$ (Theorem 6.3) | new | proof; numerical |
| No outbreak peak before an algebraic tail in the chain, SWIR and hierarchy (Proposition 6.5) | new | proof; exact |
| Log-rate $=s(J)$ of the limiting Metzler block (Theorem 7.1) | same statement as parent Theorem 7, Corollary 8 | proof |
| Support- and rate-checkable conditions for exponential decay (Corollaries 7.3–7.4) | new | proof |
| Finite populations: median extinction $\approx1.48\,N^{0.42}$ (§8) | new | exploratory |

## Technical account

**Exposure clock.** Writing $\tau(t)=\int_0^t x$ turns the catalysed conversions into linear equations in $\tau$, so $s,w,r$ are explicit exponential polynomials in $\tau$ and $x$ is a function $\Phi(\tau)$. The limit $\tau_\infty=\int_0^\infty x$ is a zero of $\Phi$. A simple zero gives exponential decay; a zero of order $k$ gives $\dot\tau\sim a_k(\tau_\infty-\tau)^k$ and hence $x\sim C\,t^{-k/(k-1)}$. The base chain is derived by forcing a triple root of the exposure cubic: this fixes the data and gives $\dot\vartheta=-\vartheta^3/3$.

**Why the graphs miss it.** In the chain the move $W\to X$ is catalysed by its own destination $X$. This autocatalytic inflow does not appear in the dependency graph, but at the end it exactly balances removal ($R_{\mathrm{eff}}\to1$). The limiting Metzler block then has spectral abscissa $0$, where the spectral test of Theorem 7.1 (also in the parent) is silent; the support-checkable condition of Corollary 7.3 excludes exactly this autocatalysis, given the source's identifiability condition (its Corollary 1) for the labels.

**What is classical.** The exposure clock goes back to Kermack and McKendrick; the exponent $3/2$ is the mean-field tricritical exponent of generalised epidemic processes; Metzler and Perron–Frobenius tools are textbook. The novelty, within a bounded search recorded in `RESEARCH_GATES.json`, is the explicit both-graphs-acyclic trajectory, the slowest-tail bound at four compartments, the genericity and slowing law, the no-peak results and the checkable repairs. No historical priority is claimed.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/acyclic-spreading-algebraic-extinction.txt) is available for reading.

- **Proofs.** Every theorem has a complete written proof in the manuscript; the general statements do not depend on any computation. No proof assistant was used.
- **Exact computation.** Exact rational checks of the hierarchy for $m=2,4,\dots,20$; symbolic checks of the derivation, the $R_{\mathrm{eff}}$ identity, the SWIR example, the codimension Jacobians and the monotonicity identities. These verify instances, not the general theorems.
- **Numerical and exploratory results.** 60-digit checks of the slowing law; numerical integration of the original equations; the two-vanishing-state examples of Remark 5.8 are numerical only; the finite-population result is an exploratory simulation with fixed seeds.
- **Replay and negative controls.** `verify_all.py` reruns every script in a temporary copy and compares all twelve outputs byte for byte. Clean full replays of the final package were run in two separate copies before release; the released scripts and outputs were bound to them by SHA-256. `negative_controls.py` checks exactly that corrupted rates, starting values, trajectory, graphs or tail constants are rejected.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review by a different model (OpenAI gpt-5.6-sol) and a verification re-review. A rating-free summary of objections and responses is in the package. This is not peer review, independent reproduction or formal verification.
- **Limitations.** Deterministic model class; no data. The critical starting points are tuned. Genericity is proved only for models driven by one active group. The theorems do not cover finite or stochastic populations. A 2026 dissertation by the source's first author could not be accessed and may contain a later version of the conjecture.

## Relationship to earlier work

This release is a **successor** to [Algebraic extinction in acyclic compartment models](/releases/algebraic-extinction-compartments/) (Evidence Press, 20 October 2026, doi:[10.5281/zenodo.23501636](https://doi.org/10.5281/zenodo.23501636)), which first refuted the conjecture. The paper's Section 9 states the overlap item by item:

| Topic | Earlier release | This release |
|---|---|---|
| Counterexample | $18/t^2$; dependency graph has a cycle; explicit in internal time | $t^{-3/2}$; both graphs acyclic; explicit in real time |
| Minimum size | four compartments needed | same statement, different proof; no added content |
| Slow family | exponents $(N-2)/(N-3)$ at every $N$ | exponents $(N-1)/(N-2)$ at even $N$, both graphs acyclic |
| Classification | its own four-state model | the four-state chain with arbitrary rates |
| Spectral test | limiting-Jacobian log-rate theorem | same statement; no novelty claimed |
| Slowest four-state tail, genericity, slowing law, no-peak, checkable conditions, finite populations | — | new here |

The SWIR-type example is credited to Janssen, Müller and Stenull (2004) and Choi, Lee and Kahng (2017); this paper only checks that its no-direct-infection submodel satisfies the source's conditions and does not identify it with the tricritical point those authors analysed. This release depends on, and is not independent confirmation of, the earlier one.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Epidemic and rumour modellers | A clear mechanism for slow fade-out ($R_{\mathrm{eff}}\to1$) and checkable conditions that rule it out | Tuned deterministic examples; not a forecast or a fitted model |
| Researchers on network contagion and tricritical points | An exact, explicit both-graphs-acyclic trajectory and a no-peak result for SWIR-type dynamics | The SWIR-type submodel is a check of a known model, not a new physical result |
| Mathematicians working on positive systems and reaction networks | Slowest-tail bound at four compartments, genericity, a slowing law and a siphon problem | Genericity is proved only in the single-catalyst class |
| Readers of Chan, Crommelin and Mandjes | What survives of their conjecture and a repaired statement | The conjecture was first refuted by the earlier release |

## Why the problem matters

Whether a disappearing group fades exponentially or like a power of time changes how long it stays relevant: how long a rumour keeps circulating, or how long the last cases of an outbreak linger. Exponential fade-out is the default assumption behind elimination forecasts. This work explains exactly when that assumption fails in a broad class of models, shows that the failure needs fine tuning, and gives conditions that can be checked in advance.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.13 and NumPy, SciPy, SymPy, mpmath and Matplotlib:

```sh
python3 -B -O negative_controls.py         # standard library: exact controls, corruptions rejected
python3 -B verify_all.py                   # rerun every check; compare all outputs byte for byte (about 90 s)
python3 -B verify_all.py --skip-simulation # without the stochastic simulation
shasum -a 256 -c SHA256SUMS
```

Start with Section 1 of the paper (the problem, the $R_{\mathrm{eff}}$ picture and what was already known), then Section 3 (the counterexample, derived) and Section 9 (relation to the earlier release). `README.md` and `evidence/target.yaml` map every claim to its status, and `AI_INDEX.md` maps results to evidence.

## The most valuable next projects

1. A stochastic theory of the near-critical endgame in finite populations, explaining the simulated $N^{0.42}$ extinction time.
2. The slowest tail for five or more compartments outside the single-catalyst class, and genericity there.
3. Whether any model in the class has a slow tail after a genuine outbreak peak.
4. A siphon (reaction-network) formulation of the support-checkable condition.

## What is in the evidence package

The manuscript (PDF and LaTeX source), the check scripts with their committed deterministic outputs and figures, the exploratory simulation, the replay script and negative controls, the machine-readable target (`evidence/target.yaml`), a rating-free review summary, claim, status, assurance and provenance records, a dated prior-art and limitation record (`RESEARCH_GATES.json`), an agent index, licences (CC0-1.0 for prose and data, MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
