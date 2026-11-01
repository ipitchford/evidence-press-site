## Summary

**In one sentence.** A statistics method that is valid if you look once silently fails if you keep checking it as data arrive.

**The setting.** A confidence interval comes with a promise, such as "this interval contains the true value 95% of the time". For most methods the promise holds only if you look at the data once, at a sample size fixed in advance. In practice data often arrive over time, and people recompute the interval as they go: a clinical monitor, an online experiment, a sensor stream. Methods built for repeated checking are called *confidence sequences*. Their promise is stronger: with probability at least 95%, the interval contains the truth at every sample size at once.

**The method in question.** *Universal inference* (Wasserman, Ramdas and Balakrishnan, 2020) is a popular recipe that gives a valid single-look interval in almost any statistical model, including awkward ones where textbook methods fail. You split one sample into two halves, fit the model on one half, and use the other half to test candidate parameter values. In 2023 Pace, Salvan and Sartori asked what happens if that interval is simply recomputed every time a new pair of observations arrives. They conjectured that it keeps a long-run guarantee: from some point on, the interval would contain the truth for ever with probability at least 95%.

**What was found.** It does not. If you keep checking for ever, the interval is certain to exclude the true value again and again, so the long-run guarantee is zero, in any model. Changing the split, or averaging over several splits, does not fix this. Raising the threshold slowly as data accumulate does fix it, and that repair cannot be improved in its growth rate. A second, cruder repair works in every model.

**How much it matters.** The failure is slow, which is why simulations did not reveal it. The chance of staying correct throughout shrinks only like a small power of how long you keep monitoring:

| Nominal level | Error after a last look 100× later than the first | 10,000× | 1,000,000× | Error first exceeds nominal at about |
|---|---|---|---|---|
| 80% | 19.8% | 34.0% | 45.6% | 105× |
| 95% | 2.7% | 5.1% | 7.4% | 10⁴× (10^3.9) |
| 99% | 0.24% | 0.46% | 0.69% | 10⁹× (10^8.8, extrapolated) |

So the problem is serious for loose levels and very long monitoring, and mild for 95–99% intervals over horizons shorter than about a thousand to ten thousand times the first look. A handful of interim looks costs much less than continuous monitoring.

**How sure we are.** Every result has a written proof, and six scripts check the constants, expansions and tables, including deliberately planted errors that each run must catch. The severity numbers are numerical, with stated error estimates. This is an anonymous, AI-assisted, unrefereed candidate; its review was internal, not peer review.

## Summary for specialists

Two independent i.i.d. streams (validation $X_i$, training $Y_i$) from $p_\theta$, observed in pairs; $E_n(\vartheta)=\prod_{i\le n}p_{\hat\theta_n}(X_i)/p_\vartheta(X_i)$ with $\hat\theta_n$ fitted on $Y_1,\dots,Y_n$; split-naive sets $C_n=\{\vartheta:\log E_n(\vartheta)<\log(1/\varepsilon)\}$ (Pace et al., 2023, eq. (6)). Asymptotic persistence is $\lim_n P_\theta(\theta\in C_m\ \forall m\ge n)$.

- **Refutation:** for any permutation-symmetric training estimator, asymptotic persistence is $0$ whenever $\limsup_n P_\theta(\theta\notin C_n)>0$ (Proposition 0) *(proof; Hewitt–Savage)*
- **Gaussian rate:** $Q_n=\log E_n(\theta)=(S_nT_n-T_n^2/2)/n$ exactly, and $\limsup_n Q_n/\log\log n=(\sqrt5-1)/2$ a.s.; $\bigcap_{m\ge n}C_m=\varnothing$ a.s. (Theorem 1) *(proof)*
- **Universality:** under (R1)–(R3), $\limsup\log E_n(\theta_0)/\log\log n=\tfrac{\sqrt5-1}{2}\mu_{\max}(H^{-1}J)$; under the information identity $J=H$ the constant is $(\sqrt5-1)/2$ in every fixed dimension (Theorem 2) *(proof)*
- **Splits:** validation-to-training ratio $r$ gives $c(r)=(\sqrt{r^2+4r}-r)/2\in(0,1)$ (Theorem 3) *(proof)*
- **Cross-fitting:** fixed $K$ folds give $c(1/(K-1))$ for weighted power means with $p>0$, $1/K$ for equal-weight geometric, $p<0$ and minimum aggregation; bounds for every symmetric e-merging function (Theorem 4) *(proof)*
- **Repair:** for any $g$ valid for a scalar Gaussian walk, $b(n)=\lambda_1g(n)^2/n$ with $\lambda_1=(\sqrt5-1)/4$ gives a $(1-\alpha)$ confidence sequence (Theorem 5); thresholds $\lambda_1\{2\log\log n+\kappa\log\log\log n+O(1)\}$ are achievable iff $\kappa>3$ (Theorem 6); a checkpoint repair is valid in every model (Proposition 5A) *(proofs)*
- **Severity:** $\lim_{n_0}P(\max_{n_0\le n\le Rn_0}Q_n\ge c)=P(\sup_{0\le t\le\log R}\mathbf X(t)^\top A\mathbf X(t)\ge c)$ for a stationary two-dimensional OU process (Proposition 7) *(proof)*; failure exponents $0.0421, 0.0150, 0.0054, 0.0005$ at $\varepsilon=0.20,0.10,0.05,0.01$ *(numerical)*

## Technical account

**Why the statistic escapes.** In the Gaussian case with the training mean as estimator, the log split likelihood ratio at the truth is the quadratic form $(S_n,T_n)A(S_n,T_n)^\top/n$ with $A=\begin{pmatrix}0&1/2\\1/2&-1/2\end{pmatrix}$, whose eigenvalues are $\lambda_1=(\sqrt5-1)/4$ and $\lambda_2=-(\sqrt5+1)/4$. At each fixed $n$, $E_n=e^{Q_n}$ is an e-value, so Markov's inequality gives single-look validity. As a process, though, $Q_n$ is a quadratic form in a two-dimensional random walk scaled by $1/n$; by the law of the iterated logarithm it returns to heights of order $2\lambda_1\log\log n$ for ever. A fixed threshold $\log(1/\varepsilon)$ cannot contain it. A general version (Lemma 1: the vector LIL applied to continuous 2-homogeneous functionals) gives the rate in regular models after a Taylor expansion of the training estimator and the validation log-likelihood.

**Why the zero is model-free.** Permuting the first $k$ pairs of observations leaves every later $E_n$ unchanged when the training estimator is symmetric, so the event "the set excludes the truth infinitely often" is exchangeable. By the Hewitt–Savage zero–one law it has probability 0 or 1, and reverse Fatou with a non-vanishing single-time error forces 1.

**Repairs.** The failure is in the threshold, not the statistic. Rotating $(S_n,T_n)$ into the eigenbasis of $A$ gives $Q_n\le\lambda_1W_n^2/n$ for a scalar standard walk $W$, so any boundary valid for $W$ (Robbins's normal mixture, or the stitched boundary of Howard et al., 2021) transfers to the split statistic. The Kolmogorov–Erdős–Feller integral test, carried through this reduction, shows that the second-order coefficient $3$ cannot be lowered: the negative-eigenvalue walk cannot rescue a threshold with $\kappa\le3$. For irregular models, Proposition 5A spends the error budget across checkpoints by Markov's inequality and a union bound; it is dominated by the Ramdas–Wang time-mixture e-process.

**Severity.** Under Brownian scaling, $Q$ at time $e^t$ is an exact quadratic functional of a stationary Ornstein–Uhlenbeck process, so finite-horizon uncoverage depends only on the horizon ratio $R$. The survival probability of the OU process in the region $\{x^\top Ax<c\}$ decays like $R^{-\mu(c)}$, where $\mu(c)$ is the principal Dirichlet eigenvalue of the OU generator; $\mu$ is small and falls steeply with $\varepsilon$, which is why the excess error grows so slowly.

**Classical and new.** The law of the iterated logarithm (Hartman and Wintner, 1941; Strassen, 1964), the Hewitt–Savage zero–one law, Ville's inequality, Robbins's normal mixtures, stitching, the Kolmogorov–Erdős–Feller test and Vovk–Wang e-merging are classical; Ramdas and Wang (2025, Section 7.7) remarked without proof that split likelihood-ratio e-variables are not e-processes. Within a bounded search, the new elements are the refutation of the conjecture, the constants $(\sqrt5-1)/2$, $c(r)$ and $1/K$ with the aggregation classification, the transfer of the sharp threshold to this statistic, and the severity calculation.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/split-likelihood-persistence.txt) is available for reading.

- **Proofs.** Every proposition, lemma and theorem has a written proof in the 15-page manuscript. Proposition 0, Lemma 1 and Theorem 6 are purely analytic.
- **Computational checks.** Six scripts check the exact symbolic identities and eigenvalues (Theorems 1, 3 and 4 and the sandwich constant); the quadratic expansion of Theorem 2 on Poisson and Bernoulli streams up to $n=10^8$; seeded exact Monte Carlo of Pace et al.'s Gaussian experiment (all 16 published percentages agree within Monte Carlo error) and their Poisson example; an OU spectral and survival-curve solver with Richardson extrapolation, finer-mesh, time-step and direct checks; exact simulation of finitely many looks; and validity and widths of seven interval constructions. Every tabulated number in the manuscript is inserted from the result files by a script. Checks raise errors rather than using `assert`, so they stay active under Python's `-O` flag.
- **Negative controls.** Each run must detect planted falsehoods: a wrong constant, an oracle statistic, a non-dominating direction, the split-naive excess, a wrong Fisher information and the single-look Markov bound.
- **Replay.** All six scripts were rerun under `-I -B -O` from a fresh copy of the release package; every output matched the shipped one exactly apart from the run-environment block, and the manuscript regenerated byte for byte.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review and a proof audit by a separate model, a separate proof audit and a clean replay led to one revision round; a re-review found all correctness items resolved. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** Theorem 6 is specific to the Gaussian scheme. The continuum (OU) numbers are numerical with empirical error estimates, and the 99% crossing horizon is an extrapolation. The calibrated thresholds assume the Gaussian scheme and a large first look. Rate constants for irregular models, growing-$K$ or re-randomised cross-fitting and a plug-in repair for composite likelihoods remain open. Pace et al.'s Poisson table could not be reproduced; the same discrepancy appears in their non-split mixture row, and its source is unresolved. Fixed-sample universal inference, the running-MLE construction and mixture confidence sequences are not affected.

## Relationship to earlier work

Wasserman, Ramdas and Balakrishnan (2020) introduced universal inference and noted that sequential use requires updating in a particular way, the running-MLE construction, which remains valid. Pace and Salvan (2020) and Pace, Salvan and Sartori (2023) developed likelihood-based confidence sequences; the latter posed the conjecture refuted here and observed mild anti-conservativeness at nominal 80% in simulation, which Section 7 now explains quantitatively. Ramdas and Wang (2025) remarked that split likelihood-ratio e-variables are not e-processes and gave the time-mixture construction that dominates the checkpoint repair. The finite-looks analysis is the counterpart, for this statistic, of the classical group-sequential results of Armitage, McPherson and Rowe (1969) and Pocock (1977). Fixed-sample properties of the split likelihood-ratio test are studied by Tse and Davison (2022), Strieder and Drton (2022) and Dunn et al. (2023).

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Applied statisticians and trialists using universal inference | Do not recompute a fixed-threshold split interval under continuous monitoring; use the repaired threshold, the checkpoint repair or a pooled anytime-valid method | Severity is mild at 95–99% over short horizons; check the tables for the planned horizon |
| Methodologists in anytime-valid inference | Exact constants for split statistics, an aggregation classification and a sharp threshold transfer | Gaussian sharpness only; irregular-model constants open |
| Developers of sequential-testing software | Calibrated thresholds for a fixed horizon (Section 7.3) and an efficiency comparison (Section 8) | Calibration assumes the Gaussian scheme and a large first look |
| Research agents | Machine-readable claims, an agent index and replayable seeded checks with negative controls | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

Universal inference is attractive precisely because it works where classical methods break down, and confidence sequences are attractive because people do look at data repeatedly. Combining the two naively looks harmless and passes moderate simulations. This paper shows the combination has no long-run guarantee at all, quantifies exactly how fast it degrades, and gives repairs, so users can decide whether their monitoring horizon is short enough to ignore the problem or long enough to need a repair.

## Where to inspect the package and reproduce the checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.12:

```sh
shasum -a 256 -c SHA256SUMS
python3 -m venv env && env/bin/pip install -r requirements.txt   # numpy 2.1.3, scipy 1.14.1, sympy 1.13.3, mpmath 1.3.0
PY=env/bin/python bash quick_checks.sh    # exact algebra, universality, looks and mixture controls (under 2 minutes)
PY=env/bin/python bash build.sh           # every script and the manuscript tables (about 40 CPU-minutes)
```

`VERIFICATION.md` maps each claim to its script, and `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Exact rate constants for irregular models, for which universal inference was designed.
2. Growing-$K$ and re-randomised cross-fitting, where Proposition 0 may not apply.
3. A plug-in sandwich repair for composite likelihoods.
4. Certified (interval-arithmetic) bounds for the OU failure exponents and calibrated thresholds.
5. A reconciliation of the Poisson discrepancy with the original authors' code.
