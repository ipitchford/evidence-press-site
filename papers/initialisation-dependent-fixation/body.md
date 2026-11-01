## Summary

**The setting.** Robot swarms often have to choose the best of several options, such as two possible nest sites, without a leader. In the *weighted voter model* each robot advertises its preferred option for a while and then copies the preference of a randomly chosen neighbour. Robots advertise better options for longer, so better options get copied more often. In the *noisy* version each robot measures quality with error, so the length of time it advertises is random.

**What was conjectured.** In 2025 Ganesh, Hauert and Valla asked: in a large swarm, what is the chance that a small group backing the better option eventually wins? Their Conjecture 2 gives a formula. The formula describes the other robots as they would look after the system had been running for a long time (*in equilibrium*). But the conjecture itself says that every robot starts with a *freshly measured* quality.

**What was found.** That difference matters, and the conjecture fails as stated. A snapshot of a long-running population over-represents slow robots, because a slow robot keeps its state for longer. This is the *inspection paradox*, the same effect that makes the bus you are waiting for seem late. A fresh swarm has no such bias, so at first its robots switch opinions faster than the formula assumes. Early switching is exactly when a small winning group is either lost or established. The result: whenever robots' advertising rates vary, the better option wins **more often** than the conjecture predicts. In one example the true chance is 0.784 rather than the predicted 0.757. With a single constant rate for the better option, it is 0.702 rather than 2/3.

**What is confirmed, and what is not.** The source's own simulations started in equilibrium, not fresh. For that start the conjectured formula is *exactly right* when the better option has a single advertising rate. When its rate also varies, the equilibrium answer is a different, simpler formula, $1-(\mathbb E T_B/\mathbb E T_A)^k$, and the conjecture again underestimates. The formula is exact only for a mixed start that neither the conjecture nor the simulations used.

**How big the error can be.** At most about 27.3 percentage points, and that extreme is approached but never reached. If the fastest and slowest rates differ by at most a factor of three, the error is provably below 8.27 points. A short "burn-in" period before the decision starts removes the effect, and the paper says how long is enough.

**Status.** An anonymous, AI-assisted, unrefereed candidate. The theorems have written proofs, and key values are certified by exact arithmetic. There has been no external peer review or independent reproduction.

## Summary for specialists

On $K_N$, a vertex with rate $R$ updates at rate $R$, copies a uniformly chosen other vertex's opinion, and redraws its rate from $F_A$ or $F$ according to the new opinion. $k$ vertices start with $A$ (rates $\sim\nu^A$), the rest with $B$ (rates $\sim\nu$). Assume separated supports: $0<a_-\le a_+<b_-\le b_+<\infty$, with $F_A$ on $[a_-,a_+]$ and $F$ on $[b_-,b_+]$. Let $\lambda=(\int r^{-1}F(dr))^{-1}$ and let $b_\nu(t)$ be the mean rate at time $t$ of the resident reset chain $\mathcal Lf(r)=r(\int f\,dF-f(r))$ started from $\nu$.

| Result | Statement | Status |
|---|---|---|
| Theorem 1 | For constant favourable rate $a$: $\lim_N\alpha_k=1-(1-c_\nu)^k$, with $c_\nu=\bigl[1+a\int_0^\infty e^{-\int_0^t(b_\nu-a)}dt\bigr]^{-1}$ | proof |
| Theorem 2 | If $F$ is not a point mass, $b_F(t)>\lambda$ for all $t$, so $c_F>1-a/\lambda$: Conjecture 2 (fresh start) fails | proof |
| Witness (33) | $a=1$, $F=\tfrac12(\delta_2+\delta_6)$: $c_F=0.702032053928212\ldots$ vs $2/3$ | exact rational certificate |
| Theorem 3, Prop. 5.1 | Sharp envelope at fixed harmonic mean; global supremum of the underestimate $\Delta(\xi_*)\in(0.27335543432151,\,0.27335543432152)$, not attained | proof + rational bracket |
| Section 5.4 | With $\bar b/b_0\le3$, the proved ceiling (43) is below $8.27$ points (tends to $8.27$ as $b_0/a\to1$) | proof + floating evaluation |
| Section 6 | Burn-in $\tau$: $0\le c_\tau-\gamma/\lambda\le LDe^{-b_0\tau}$; $k$-founder error at most $k(a/\lambda)^{k-1}LDe^{-b_0\tau}$ | proof |
| Theorem 4, Cor. 5 | General $F_A$: limit via backward equations of a multitype time-inhomogeneous branching process; fresh residents strictly help | proof |
| Theorem 6, Cor. 7 | Equilibrium start ($\nu=\mu$, $\nu^A=G_A$): $\lim\alpha_k=1-(\mathbb E T_B/\mathbb E T_A)^k$, strictly above $1-\pi^k$ unless $F_A$ is a point mass | proof + exact identity checks |

**Verdict on Conjecture 2.** Refuted as stated (fresh start) whenever $F$ is non-degenerate. Confirmed under the equilibrium start for constant favourable rate (equation (7)). Refuted under the equilibrium start for non-degenerate $F_A$. Exact for equilibrium residents with fresh favourable founders (Lemma 7.3). The source's Theorem 5 (the stationary branching calculation) is untouched; what fails is identifying fresh finite populations with that stationary process.

## Technical account

**From the population to a branching process (Section 3).** Two ingredients. Lemma 3.1 gives a fixation bound valid from every configuration: with $\rho=a_+/b_-<1$, $\mathbb P(A\text{ fixes})\ge1-\rho^m$ from $m$ favourable vertices. This rests on separated supports. Lemmas 3.2–3.3 and Proposition 3.4 build the whole population from Poisson random measures (resident clocks, a birth measure and a favourable-update measure) and couple the multiset of favourable rates exactly with a time-inhomogeneous branching process on every finite window, by common thinning. The resident environment converges to $b_\nu(t)$ by a law of large numbers over independent "virtual residents". Proposition 3.6 joins the two: first $N\to\infty$ at fixed $T$, then $T\to\infty$.

**Why fresh starts help (Theorem 2).** The equilibrium rate law $\mu(dr)\propto r^{-1}F(dr)$ makes the reset chain reversible. With $\varphi(r)=r-\lambda$, $b_F(t)=\lambda+\lambda^{-1}\langle\varphi,P_t\varphi\rangle_\mu$, and the spectral theorem makes the second term strictly positive and completely monotone. This is the classical renewal monotonicity for decreasing-failure-rate laws (Brown, 1980); the model-specific step is turning it into a fixation inequality.

**Equilibrium start (Theorem 6).** With equilibrium residents the process is time-homogeneous, the type-$x$ extinction probability is $e(x)=x/(x+\lambda c^*)$, and averaging against the size-biased favourable law $G_A(dx)\propto x^{-1}F_A(dx)$ gives exactly $1/(\lambda m_A)$. Corollary 7 follows from a covariance inequality.

**What is new, and what is classical.** Time-inhomogeneous birth–death survival (Kendall, 1948), renewal monotonicity (Brown, 1980), branching approximations and common-thinning couplings are classical. That initial age structure affects fixation is known (Shpak, 2007; Jafarpour et al., 2023). New for this reset-and-copy model are the correct transient environment, the configuration-uniform bridge to complete-graph fixation, the sharp error envelope and the equilibrium-start identity. Theorem 6 is a short averaging calculation once written down and is not claimed as a new branching-process theorem.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/initialisation-dependent-fixation.txt) is available for reading.

- **Proofs.** Every theorem, proposition and lemma has a written proof in the 28-page manuscript.
- **Exact computation.** `certify_limits.py` encloses the constant-rate witness to 30 significant digits and the global supremum in rational arithmetic (standard library only). `stationary_identity_and_caps.py` certifies the Theorem 6 identity and the strict excess of Corollary 7 for the Table 1 example and three further laws. Small finite populations ($N\le5$) are solved exactly.
- **Numerical, not certified.** The multitype values (0.7842… in Table 1), the large-$N$ finite-population values (Tables 4 and 5) and the rate-cap table (Table 3) use floating-point solvers. The *direction* of each inequality is proved independently.
- **Negative controls.** Nine corruptions are rejected: tampered certificates, the conjectured $2/3$ claimed as the fresh-start limit, a widened supremum bracket, the conjectured value claimed under the equilibrium start, a tampered Theorem 6 receipt, the superseded "below 8 points" and "about 14 points" rate-cap claims, and a tampered table row.
- **Review.** Internal AI-assisted review in five roles plus a correctness review by an AI model from a different family; a verification re-review; a targeted proof audit, which reproduced Tables 4–5 with an independently written solver and checked Theorem 6 by Monte Carlo on a different law; and a second outside-model audit. Their findings (a measurability hypothesis in Lemma 3.2, non-explosion in Lemma 3.5, the class in Proposition 5.1, the $k$-founder burn-in bound, two overstated rate-cap figures and narrowed novelty claims) were fixed before release. This is not peer review, and the recomputations are not independent reproduction.
- **Limitations.** Complete graph only; exponential signalling periods; every favourable rate strictly below every resident rate. The source's Gamma-noise simulations have overlapping supports and lie outside this class, so the paper makes no prediction about them. Limits are as $N\to\infty$; no explicit finite-$N$ rate is proved. The prior-art search was bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Swarm-robotics designers | The stationary formula is conservative under fresh and equilibrium starts: real success chances are at least as high | Proved only for separated rate supports on a complete graph |
| Modellers who simulate collective decisions | Check whether a simulation starts fresh or in equilibrium; use the burn-in bound to test stationary theory | The burn-in bound in the worked example is for a single founder |
| Probabilists and population geneticists | A clean instance of initial-transient (inspection-paradox) bias in fixation, with a sharp envelope | Several ingredients are classical; novelty is model-specific |
| Simulation methodologists | A rare provable warm-up length (Section 6) | Applies to this model's renewal structure |

## Why the problem matters

Equilibrium approximations are routinely applied to systems that start fresh. When individuals hold their states for random lengths of time, an equilibrium snapshot is length-biased. A quantity that is decided early, like whether a small minority survives, can then differ at leading order from its stationary prediction. The same structure appears in mutant establishment in population genetics, epidemics on bursty networks, voter models with ageing and warm-up deletion in simulation output analysis. This paper gives an exact, fully worked example, and shows that the published conjecture conflated two different starting conditions.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive:

```sh
python3 -B -I negative_controls.py               # standard library; seconds
python3 -m pip install -r requirements.txt       # numpy, scipy
python3 -B -I evidence/run_checks.py             # replays all four scripts; a few minutes
shasum -a 256 -c SHA256SUMS
```

Start reading with Sections 1.2–1.4 of the manuscript (the mechanism, what the source simulated and the main results) and Table 1, which shows all four starting conditions for one example. `AI_INDEX.md` maps each result to its proof location and script.

## The most valuable next projects

1. Overlapping supports: find a substitute for Lemma 3.1 so the result covers noisy measurements of nearby qualities, including the source's Gamma-noise examples.
2. Extend the transient mechanism to sparse, regular or geometric graphs.
3. Solve the sharp envelope under a rate cap (an optimal-timing problem).
4. Prove an explicit finite-$N$ rate; the tables suggest $O(1/N)$.
5. Have a probabilist check the coupling construction of Section 3.

## What is in the evidence package

The manuscript (PDF, Pandoc Markdown source and generated LaTeX), the bibliography checked against Crossref, four verification scripts with their stored outputs, a replay driver, semantic negative controls, the figures and their script, development notes from the original research run, the revision response and final editor fixes, a rating-free review summary, the dated prior-art and limitation record, claim, status, assurance and provenance records, an agent index, licences (CC0-1.0 for text and data, MIT for code) and a SHA-256 manifest. The same files are in the GitHub release and the Zenodo record.
