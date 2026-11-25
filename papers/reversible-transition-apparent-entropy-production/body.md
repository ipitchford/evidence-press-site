## Summary

**In one sentence.** A widely proposed way of estimating how much heat a periodically driven microscopic system dissipates, from the waiting times between the jumps an experiment can see, can overstate the true value without limit: in a simple model with zero net current and fixed dissipation, the estimate exceeds the truth by a certified factor of more than 145.

**The everyday problem.** Small driven systems, such as molecular motors, ion channels and colloidal beads in moving laser traps, turn part of the energy they receive into heat. The rate at which they do so is their **entropy production**, a basic measure of how far they are from equilibrium. Experiments usually see only a few of the system's transitions, for example a bead hopping between two wells, together with the times at which they occur. Physicists therefore derive *lower bounds* on dissipation from waiting-time statistics: if the record looks different when played backwards, the system must be dissipating at least a computable amount.

**What was known.** Many experiments are driven by a repeating rhythm, such as an oscillating field or trap. For this setting Harunari, Fiore and Barato (*Physical Review E*, 2024) proposed a practical estimator, here called $S_1$: run the experiment once with the rhythm and once with the rhythm reversed, compare the two histograms of waiting times between visible jumps, and never record the phase of the rhythm. They proved that $S_1$ minus a correction $X$ is a valid lower bound, found that $S_1$ alone stayed below the true value in their example, and asked whether it always does. The earlier Evidence Press release [Counterexamples to a conjectured waiting-time bound on entropy production in periodically driven Markov networks](/releases/waiting-time-entropy-bound-counterexamples/) refuted a related forward-only conjecture and gave uncertified numerical evidence on this question in one special case. That release listed estimators using the reversed experiment as unaffected; this remains true of the phase-resolved estimator and of the corrected inequality, which stays valid, but not of the uncorrected estimate.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| No lower bound | In a three-state model whose currents all average to zero, with fixed entropy production $4\pi/5$ (about 2.5), the uncorrected estimate grows in proportion to the speed of one reversible transition | Theorem 1 |
| Certified sizes | Exact rational arithmetic proves more than 31 times the true value at one speed; a certified lag-bin bound gives more than 145 times. The smallest certified violation is at about 375 reporter events per period | Theorem 1, Proposition 2 |
| Robustness | Recording every microscopic jump does not help; a small constant force does not help either. Under that force the model numerically pumps a net current, and the overshoot persists (ratio 1.10 to 1.53 in the table) | Section 4, Corollary 3 |
| Sharp correction | For any driven network, using blocks of $m$ consecutive waits, the overshoot is at most $X/m$, where $X$ needs only the phase histogram of each kind of event; the correction cannot be made smaller | Theorems 5 and 7 |
| A safety criterion | If events sample the phase symmetrically ($X=0$), the uncorrected estimate is safe | Corollary 6 |
| How many waits are needed | In the example, the block estimate is worked out in every regime, with a transition near $R^{2/3}$ waits | Section 6 |

**The idea.** A fast transition that runs at the same rate in both directions produces no entropy. Its speed, however, varies with the phase of the drive, so it "reports" which part of the cycle the system is in. Reversing the drive changes which speeds a typical wait samples, even though the average number of events is identical. A single wait therefore sees a mixture of exponential waiting times, the two experiments mix them differently, and the estimator multiplies that small difference by a large number of events.

**Limits.** This is a model calculation, not a claim about a particular experiment. The overshoot per event is small (under 0.008 nats per event even at the largest speed certified) and needs a reporter several hundred times faster than the drive. The scaling table and the sharpness statement are proved for the example only. Whether the uncorrected estimate can overshoot in Harunari, Fiore and Barato's own pump model remains open, and finite-sample estimation is not analysed. **Practical advice:** do not report the uncorrected estimate as a bound unless the visible events sample the phase symmetrically; use the block estimate minus $X/m$, or the phase-resolved estimator. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks.

## Summary for specialists

A continuous-time Markov jump process on a finite graph has rates $k_{xy}(s)$ periodic in the phase $s$; the backward experiment uses $k_{xy}(-s)$. Visible events are a reversal-closed set of directed edges (marks). $S_1$ is the estimator of Harunari, Fiore and Barato (HFB, their Eq. (14)), built from phase-blind densities of the next mark and waiting time; $\sigma_{\cal L}\le\sigma$ is the phase-resolved rate (their Eq. (24)); $X$ is their correction (their Eq. (25)).

- **Theorem 1** *(proof; exact certificate)*: three states $0,+,-$, unit period, $\theta=2\pi t$, $h=4/5$, slow rates $a/2$ and $b$ with $a,b=2\pi(1\pm h\sin2\theta)$, and a reporter $+\leftrightarrow-$ at rate $Rq$, $q=1+\tfrac{16}{17}\cos\theta$. Every edge current averages to zero, both experiments have activity $R/2$, $\sigma=4\pi/5$, and
$$S_1\ \ge\ R\Big[\tfrac{17}{600}-\tfrac{2C}{R}\Big]_+^2,$$
with $C=\tfrac{18\pi}5+\tfrac{32\pi}{17}$. At $R=10^5$, $S_1>78$ and $S_1/\sigma>31$.
- **Proposition 2** *(exact certificates)*: weighted lag-bin bounds give $S_1>366.44$ at $R=10^5$, so $S_1/\sigma>145$; a validated Fourier–Taylor enclosure gives $S_1>2.7469$ at $R=750$ (about 375 reporter events per period).
- **Corollary 3** *(proof)*: under a constant cycle affinity $f$ on the reporter, $S_1(f)>\sigma(f)$ for $|f|<f_0$ at any $R\ge5400$, and $S_1(f)>30\,\sigma(f)$ at $R=10^5$. The nonzero net current for $f\ne0$ is numerical.
- **Theorem 4** *(proof)*: $S_1/R\to\tfrac12 \mathrm{D}(g_\mathrm{F}\|g_\mathrm{B})$, the relative entropy of two mixtures of exponentials (slope $0.00407$ numerically). Recording all six directed jumps leaves $S_1>78$ at $R=10^5$.
- **Theorem 5** *(proof, every finite network)*: for the block estimator $S_m$ of $m$ consecutive waits,
$$0\le S_m\le\sigma_{\cal L}+X/m\le\sigma+X/m .$$
At $m=1$ this is HFB's Eq. (26).
- **Corollary 6** *(proof)*: $S_1-\sigma\le X$; if the event-sampled phase-and-mark law is reversal symmetric, $X=0$ and $S_m\le\sigma$ for every $m$.
- **Theorem 7** *(proof, example)*: with $m=2k$, $R^{2/3}\ll k\ll R$, $mS_m/X\to1$, so no universal coefficient below one works.

**Known and new.** HFB proved $\sigma\ge S_1-X$ and reported numerics in which $S_1$ stayed below $\sigma$; the earlier Evidence Press release gave an uncertified overshoot of about 10% in a time-symmetric protocol. The analytic counterexample, its certificates, the block extension, the safety criterion, the sharpness and the scaling picture are new here.

## Technical account

**Why the estimate reduces to one bit (Section 3).** The twin symmetry $+\leftrightarrow-$ makes the two-by-two kernel of next mark given current mark depend only on whether the direction repeats or alternates, so $S_1$ is $K_\mathrm{F}$ times the relative entropy of (repeat or alternate, waiting time) between the two experiments. Testing whether the next reporter event beats an independent exponential deadline of rate $R$ and applying Pinsker's inequality gives $S_1\ge2K_\mathrm{F}(M_\mathrm{F}-M_\mathrm{B})^2$.

**Freezing the race.** Right after a reporter jump the system sits in a twin; freezing the phase and forbidding slow exits changes the race probability by at most $C/R$. The frozen probabilities differ only through the second harmonic of $(1+q)^{-1}$, which a Poisson-kernel expansion evaluates exactly:
$$M_\mathrm{B}^\infty-M_\mathrm{F}^\infty=\tfrac{17}{600}.$$

**Certificates (Appendix C).** `verify_certificate.py` evaluates Theorem 1 at $R=10^5$ with $\pi<22/7$ in exact rationals. `verify_lag_bins_exact.py` uses nine waiting-time bins with weights and the variational bound
$$\begin{aligned}K\,D(P\|Q)\ &\ge\ K\,\mathbb E_P\log w\\&\quad-K\,\mathbb E_Q(w-1),\end{aligned}$$
with error terms bounded in `lag_bins_proof.md`. `verify_moderate_speed.py` encloses the race at $R=750$ and $1000$ with integer interval arithmetic.

**Blocks (Section 5).** Keeping the phase of the first event, the block likelihood ratio telescopes into $m$ kernel terms, each contributing $\sigma_{\cal L}/K_\mathrm{F}$, plus one boundary term, which is $X/K_\mathrm{F}$. Discarding the phase and applying data processing gives Theorem 5. In the example $X/R=(1-\sqrt{17}/5)/2\approx0.088$, while $S_1/R\to0.0041$: the uncorrected estimate uses only a few per cent of the room the correction allows, which is still enough to exceed $\sigma$ without bound.

**Sharpness (Section 6).** A burst of $2k$ fast waits measures both the instantaneous reporter rate and its slope, which together identify the phase; when $R^{2/3}\ll k\ll R$ the block divergence recovers all of $X/K_\mathrm{F}$. The exponent $2/3$ is the classical scale for detecting a ramp in a Poisson rate (Mora and Wingreen).

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/reversible-transition-apparent-entropy-production.txt) is available for reading.

- **Proofs.** The 20-page paper opens with a plain introduction (the problem, why it matters, what was known, what is new and a roadmap) and gives written proofs of every theorem, with the asymptotic proofs and the finite-rate certificates in three appendices. No proof assistant was used.
- **Exact checks.** `verify_certificate.py` (Theorem 1), `verify_lag_bins_exact.py` and `verify_moderate_speed.py` (Proposition 2) use only exact integer and rational arithmetic and prove the stated finite inequalities.
- **Numerical illustrations.** `verify_numerically.py` (entropy production, race probabilities, controls and the Theorem 4 slope), `verify_histogram.py` (binned bound, ratio 0.76 at $R=500$ and 1.15 at $R=750$), `verify_crossover.py` (Theorem 10) and `verify_pumped_current.py` (the Corollary 3 table) are floating-point computations with declared tolerances.
- **Tests that can fail.** No check uses `assert`; every check exits with an error on failure, also in Python's optimised mode. Three negative controls (a vacuous speed in Theorem 1's certificate, near-flat lag-bin weights, flat moderate-speed weights) each make the corresponding certificate fail.
- **Replay.** Every script was rerun from a fresh copy before release under Python's optimised mode; all outputs matched the recorded ones. GitHub CI reruns them on Linux with exact comparison for the certificates and a declared tolerance for the floating-point scripts.
- **Review.** A five-role internal Claude review panel (editor, domain, perspective, methodology and devil's advocate), the lead's exact rational certificates with negative controls and a clean replay, one revision round with extensions, then a re-review and proof audit of the new proofs. The audit corrected the threshold in Corollary 3 to $R\ge5400$, checked in exact arithmetic. No Astra/Codex review took place. Every cited source was obtained and read. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** A model calculation; the large ratios need a reporter several hundred times faster than the drive, and the overshoot per event is under 0.008 nats; the scaling table and sharpness are proved for the example only; the net current under a cycle affinity is numerical; finite-sample estimation is not analysed; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Experimenters inferring dissipation from waiting times | Do not report the phase-blind forward-versus-reversed estimate as a bound unless events sample the phase symmetrically; use $S_m-X/m$ or the phase-resolved estimator | Large overshoots need a fast reporter transition |
| Stochastic-thermodynamics theorists | A certified counterexample, a sharp block correction and a criterion for safety | Sharpness and scaling are proved for one model |
| Users of the earlier release | Its unaffected list holds for the phase-resolved estimator and the corrected inequality, not for the uncorrected estimate | The earlier release is unchanged |
| Research agents | Machine-readable claims, an agent index and replayable exact certificates | The floating-point scripts are illustrations |

## Why the problem matters

Thermodynamic inference from partial observations is how dissipation is estimated in single-molecule and colloid experiments, where most internal states are hidden. A lower bound that can overshoot would credit a system with dissipation it does not have. The example shows exactly what to watch for: a fast reversible transition whose rate depends on the phase of the drive. It also shows that zero net current, which was thought to make the estimate small, does not protect it.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12, from the `code/` folder:

```sh
uv run --python 3.12 python3 \
  -I -B -O verify_certificate.py
uv run --python 3.12 python3 \
  -I -B -O verify_lag_bins_exact.py
```

Each takes seconds and must print its section of `results/results.txt` exactly. `README.md` lists every script and the comparison policy, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide whether the uncorrected estimate can exceed the true dissipation in Harunari, Fiore and Barato's own three-state pump model.
2. Prove that the mean current is nonzero for small cycle affinities, turning the numerical observation behind Corollary 3 into a theorem.
3. Prove the $R^{2/3}$ phase-recovery scale for general smooth reporters, beyond the example.
4. Analyse finite-sample estimation of $S_m$ and $X$, and give conservative estimators with guarantees.

## What is in the evidence package

The paper (`manuscript.pdf`, its LaTeX source `manuscript.tex` with five `\input` files, `figure.pdf` and `figure.py`); seven scripts in `code/` (three exact certificates and four floating-point illustrations) with `lag_bins_proof.md` and a README; the recorded output `results/results.txt`; `requirements.txt`; `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
