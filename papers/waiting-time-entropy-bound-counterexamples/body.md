## Summary

**What entropy production is.** Small systems in a warm, wet environment never sit still. A molecular motor such as kinesin steps along a filament, a protein switches between shapes, a colloidal bead jiggles in a laser trap. When such a system is *driven*, by fuel molecules or by a trap that moves, it turns some of the energy it receives into heat. The rate at which it does so, measured in units of Boltzmann's constant per unit time, is its **entropy production**. It is zero exactly when the system is at equilibrium, and it sets a thermodynamic price on everything the system does: a motor that runs faster or more precisely must dissipate more.

**Why people estimate it from waiting times.** In single-molecule experiments one usually sees only a few of the system's transitions, for example a bead jumping between two positions or a fluorescence signal switching between two levels, while most of the internal states stay hidden. Over the last decade physicists have developed rigorous ways to put a *lower bound* on entropy production from what can be seen: the visible jumps and the **waiting times** between them. If the waiting times look different when the film is run backwards, the system must be dissipating at least a certain amount.

**What Maier and colleagues conjectured.** Many experiments are driven by a repeating rhythm: a trap that oscillates, a periodically switched field, or a biological oscillation. For such periodic driving, Maier, Degünther, van der Meer and Seifert (*Journal of Statistical Physics*, 2024) proved a bound that compares the ordinary experiment with a second experiment in which the rhythm runs backwards. That second experiment is often impossible, for instance when the rhythm is a natural one. They therefore proposed a more convenient statistic that uses only the ordinary experiment and does not even need to know the phase of the drive. After testing more than 100,000 random networks, they conjectured that it, too, never exceeds the true entropy production.

**What was found.** The conjecture is false.

- **Dissipation where there is none.** In a network of three states with one visible edge, raise and lower two hidden energy barriers out of step. Every rate equals its reverse at every instant, so the system stays in equilibrium and produces no entropy. But a trajectory going one way crosses the hidden barriers in the order in which they open, and the opposite journey sees them in the opposite order. The waiting times therefore differ in the two directions, and the statistic reports dissipation. The proof is analytic. The effect is small, about $10^{-5}$ per unit time.
- **The failure reaches the models that were tested.** Maier and colleagues tested a class in which the drive changes state energies but not the barrier prefactors. In that class **weak driving is provably safe**. Slow, strong driving is not: for one switching protocol, interval arithmetic certifies that the statistic is **more than 31% above** the true entropy production, and smooth protocols overstate it by up to about a factor of two in numerical examples.
- **How bad it can get.** For a given network and fastest rate, the overstatement can grow at most like the logarithm of one over the slowest rate, and a family of pulsed protocols with zero dissipation shows that this growth really occurs.
- **What remains safe.** Estimators that use the reversed-protocol experiment, an estimator of Maier et al. based on transition pairs, the corrected periodic inequality of Harunari, Fiore and Barato, and the standard steady-state waiting-time bounds are all unaffected.

**Practical consequence.** Do not report the forward-only, phase-averaged waiting-time statistic as a lower bound on dissipation. If the protocol can be run backwards, use a reversed-protocol estimator.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Every theorem has a written proof; one fixed-prefactor violation is certified by interval arithmetic; the remaining magnitudes are labelled numerical or exploratory. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

**Setting** (Maier et al., arXiv:2406.12657v1; journal Eqs. (17)–(18)). A continuous-time Markov jump process on a finite graph has periodic rates $k_{ij}(t)$ with period $P$; a set $\mathcal E$ of directed transitions, closed under reversal, is observed. Let $\psi_{IJ}(\tau\mid s)$ be the density that the next observed event is $J$ at lag $\tau$ after event $I$ at phase $s$, and $\Psi_{IJ}$ its phase average weighted by the rate of $I$. With $r_I$ the mean rate of $I$ and $\bar I$ the reverse of $I$, the forward-only statistic is
$$
\mathcal S=\sum_{I,J\in\mathcal E}\int_0^\infty r_I\Psi_{IJ}(\tau)\,\log\frac{r_I\Psi_{IJ}(\tau)}{r_{\bar J}\Psi_{\bar J\bar I}(\tau)}\,d\tau ,
$$
and the conjecture asserts $\mathcal S\le\sigma$, the mean entropy production in the periodic state.

**Theorem 3.1 (proof; exact sign certificate).** For every $\varepsilon\in(0,1)$ and $\omega>0$, the triangle with $k_{12}=k_{21}=1$, $k_{23}=k_{32}=1+\varepsilon\cos\omega t$, $k_{13}=k_{31}=1+\varepsilon\sin\omega t$, observed on $1\leftrightarrow2$ only, has $\sigma=0$ and $\mathcal S>0$. The repeat densities $F=\Psi_{++}$ and $G=\Psi_{--}$ satisfy
$$
F(\tau)-G(\tau)=\frac{\varepsilon^2\omega}{6}\,\tau^3+O(\tau^4).
$$
At $\varepsilon=1/2$, $\omega=1$: $\mathcal S\approx1.1346\times10^{-5}$ per unit time (numerical, two resolutions).

**Further results.**

| Result | Status |
|---|---|
| Fixed prefactors ($\kappa_{ij}=1$, energies driven), amplitude $A\to0$: $\mathcal S=O(A^4)$, $\sigma\asymp A^2$, so $\mathcal S<\sigma$ (Theorem 4.1) | proof |
| Fixed prefactors, 128-piece switching protocol, $A=4$, $\omega=1/20$: $\mathcal S\ge0.0036867>\sigma=0.0027973$, ratio $\ge1.3179$ (Theorem 4.2) | certified (Arb, 160 bits) |
| Smooth fixed-prefactor counterexamples exist (Corollary 4.3); smooth circular protocols reach $\mathcal S/\sigma\approx2.03$ | proof; numerical |
| $\mathcal S=D(Q\Vert Q^R)-D(r\Vert\bar r)\ge0$ (Theorem 5.1) | proof |
| At equilibrium the reversed-protocol estimator is zero and $\mathcal S=D(Q\Vert\tilde Q)$ measures protocol asymmetry (Proposition 6.1) | proof |
| Time-symmetric driving: $\mathcal S=0$ at equilibrium (Corollary 6.3); with a cycle affinity a witness has $\mathcal S/\sigma\approx1.10$ (Section 6) | proof; numerical witness |
| One control knob: time-symmetric knob safe; asymmetric knob gives $F-G=-(a\varepsilon^3/40)\tau^5+O(\tau^6)$ (Proposition 6.4) | proof; exact |
| Zero oriented area of the hidden rates still gives $\mathcal S>0$ (Proposition 7.1) | proof; exact |
| Positive dissipation with $\mathcal S>\sigma>0$; the ratio is unbounded (Theorem 8.1) | proof; numerical window |
| $\mathcal S\le K[(m+1)\log(k_{\max}/k_{\min})+\log m!+m\,d]+R_{\max}$ for every network, hence growth at most like $\log(1/k_{\min})$ at fixed graph and $k_{\max}$ (Theorem 9.1) | proof |
| Pulse family with $\sigma=0$: $\liminf\mathcal S_\delta/\log(1/\delta)\ge\kappa\approx0.00525$ (Theorem 9.4) | proof; constant numerical |

## Technical account

**Reduction to two densities.** With only $1\leftrightarrow2$ observed and the uniform distribution stationary at every instant, the two directional event rates are equal ($r_+=r_-=1/3$) and the cross terms cancel, so $\mathcal S$ is a Jeffreys-type divergence between the two repeat densities $F$ and $G$. It vanishes only if $F=G$ for almost every lag.

**Why the densities differ.** Both densities are built from the *killed propagator* $U(s,\tau)$, which follows hidden excursions until the next observed jump: $\partial_\tau U=U\,L(s+\tau)$, where $L$ is the generator with the observed transitions removed. At each instant $L(s)$ is symmetric, but $L(s)$ and $L(s')$ do not commute, so the time-ordered product depends on the order in which the two hidden barriers are lowered. Expanding the chronological exponential, the first non-vanishing term in $F-G$ is a commutator; averaging over the phase leaves $\frac{\varepsilon^2\omega}{6}\tau^3$. The integral defining $\mathcal S$ converges because both densities decay exponentially. An exact rational Taylor recurrence through order 7, at $\varepsilon=1/4,1/2,3/4$, checks the coefficients, and an exact rational sign certificate gives $\mathcal S\ge10^{-20}/108000$.

**What the statistic actually measures.** Theorem 5.1 writes $\mathcal S$ as a relative entropy between the forward pair measure $Q$ and its relabelled reversal $Q^R$, minus a nonnegative rate term. When the system is at equilibrium, the reversed-protocol estimator of Maier et al. is exactly zero (Proposition 6.1), whereas $\mathcal S$ compares the forward experiment with a relabelling of itself and equals $D(Q\Vert\tilde Q)$, which can be positive. It therefore detects the time asymmetry of the protocol, not dissipation by the system. These zero-dissipation examples are stochastic pumps that do not pump: barrier-only driving cannot produce net cycle currents (the no-pumping theorem), yet it fools the forward-only statistic.

**The fixed-prefactor class.** Here the drive moves the state energies and the barrier prefactors stay fixed. A small-amplitude expansion gives $\sigma$ of order $A^2$ but $\mathcal S$ only of order $A^4$, so weak driving is safe. Slow, strong driving lets the hidden ordering effect overtake the true dissipation. The certificate for the switching protocol encloses every propagator in Arb balls, bounds $\mathcal S$ from below through a lag-binned data-processing inequality and computes $\sigma$ from an exact work formula. Continuity in the protocol then gives smooth counterexamples.

**What is new, and what is classical.** That coarse time-asymmetry statistics can signal broken detailed balance without dissipation, or mislead when states are lumped, is known (Martínez et al.; Hartich and Godec). The no-pumping theorem and geometric pumping are classical. The refutation of the Maier et al. conjecture, the certified violation in their own test class, the logarithmic error bound and its attainment were not found in the dated, bounded search summarised in the package's `RESEARCH_GATES.json`; that search does not establish priority. Gu (2026) disproves a different conjecture, an ordering between two steady-state bounds.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/waiting-time-entropy-bound-counterexamples.txt) is available for reading.

- **Proofs.** Every theorem and proposition has a complete written proof in the 21-page manuscript. No proof assistant was used.
- **Exact and certified checks.** Exact rational Taylor coefficients and a rational sign certificate for Theorem 3.1; exact Fourier recurrences for the single-knob and zero-area results; an Arb ball-arithmetic certificate at 160 bits for Theorem 4.2, with stationarity and mass checks. These verify instances and inequalities, not the general theorems.
- **Numerical and exploratory results.** Values of $\mathcal S$, the smooth fixed-prefactor ratios (Magnus stepping with Richardson extrapolation, cross-checked by DOP853), the positive-dissipation window and the pulse-family constant are deterministic floating-point computations with convergence evidence, not enclosures. The detectability study is an exploratory simulation.
- **Replay.** `verify_all.py` reruns every script in a temporary copy and compares each saved JSON output byte for byte (about 15–25 minutes on two cores). A separate clean replay of the full suite reproduced every output. The released code and results match that replay copy byte for byte, except five files that changed afterwards only in comments, docstrings and one output key name; the two affected fast checks and all exact and certified checks were rerun on the frozen archive before release, and semantic negative controls confirm that the checks reject wrong inputs.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review by a different model (OpenAI gpt-5.6-sol) and a verification re-review. A rating-free summary of objections and responses is in the package. This is not peer review, independent reproduction or formal verification.
- **Limitations.** The results are mathematical statements about model networks; no experimental claim is made. The zero-dissipation violation is tiny: in the finite-sample study the basic sinusoidal example needs several million observed events before its true value exceeds the estimator's bias, whereas a pulsed protocol is detectable at about $10^4$ events. Only Theorem 4.2 among the violations of the fixed-prefactor class is certified.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Experimentalists inferring dissipation from single-molecule or colloid data under periodic driving | Do not treat the forward-only, phase-averaged waiting-time statistic as a lower bound; use reversed-protocol estimators where the protocol can be reversed | In weak driving the statistic stays below the true value; the zero-dissipation errors shown here are small and need long records to detect |
| Theorists in stochastic thermodynamics | A refuted conjecture, a mechanism (non-commuting hidden generators), a nonnegativity identity and a logarithmic error bound | The bound in Theorem 9.1 is logarithmic only at fixed graph and fastest rate, and its constant is not shown to be sharp; a corrected forward-only bound remains open |
| Developers of thermodynamic-inference software and benchmarks | Small, exactly specified test networks on which a forward-only estimator must not be trusted | The certified case is a piecewise-constant switching protocol; smooth ratios are numerical |

## Why the problem matters

Inferring entropy production from partial observations is one of the main ways stochastic thermodynamics touches experiment: it bounds the efficiency of molecular motors, tests whether a biological process is driven, and checks models of active matter. A bound that needs only the forward experiment and no phase information would have been unusually practical. Showing that it fails, and where, prevents a spurious "arrow of time" from being reported as dissipation, and points practitioners to the estimators that remain valid.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.13 and NumPy, SciPy, Matplotlib and python-flint (pinned versions in `requirements.txt`):

```sh
python3 -B code/verify_exact.py          # exact Taylor coefficients and sign certificate (assertions on)
python3 -B -O code/e1_certificate.py     # interval-arithmetic certificate for Theorem 4.2
python3 -B verify_all.py --fast          # quick replay, skips four slow numerical jobs
python3 -B verify_all.py                 # full byte-for-byte replay, about 15-25 minutes
python3 -B -O negative_controls.py      # checks reject in-phase barriers, weak driving and tampering
shasum -a 256 -c SHA256SUMS
```

Start with Section 1 of the paper (the physical picture), then Section 3 (the exact counterexample) and Section 4 (the fixed-prefactor class). `AI_INDEX.md` maps every result to its evidence, and `verification.md` states what each check does and does not establish.

## The most valuable next projects

1. Have a specialist in stochastic thermodynamics check the reduction to the repeat densities (Section 3) and the certificate for Theorem 4.2.
2. Derive a slow-driving expansion of $\mathcal S/\sigma$ in the fixed-prefactor class that explains the threshold amplitude.
3. Find a corrected forward-only bound that uses phase-averaged data alone.
4. Classify the protocols with $\mathcal S=0$ beyond time-symmetric ones, and determine the sharp constant in the logarithmic bound.

## What is in the evidence package

The manuscript (PDF and LaTeX source with its number file), the figures, the check scripts with their committed deterministic outputs, the replay script, the claim-to-check ledger, a proof outline, the frozen target statement, a source manifest (third-party texts are not redistributed), two superseded working proof notes, a rating-free review summary, claim, status, assurance and provenance records, a dated prior-art and limitation record (`RESEARCH_GATES.json`), an agent index, licences (CC0-1.0 for prose and data, MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
