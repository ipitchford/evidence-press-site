## Summary

**The question.** Living and driven systems, such as a molecular motor, a beating cilium or a chemical clock, constantly use energy to stay out of equilibrium. How much they use, their *dissipation*, is hard to measure directly. So experimenters often look instead for a fingerprint of irreversibility in a few recorded signals: if a film of the system played backwards would look statistically different, the system must be dissipating. The simplest such fingerprint is a *time-asymmetric correlation*: signal 1 tends to follow signal 2 more than the other way round, which shows circulation in the measured plane.

**The shortcut.** Correlations are easy to estimate; full trajectory statistics are not. A popular shortcut therefore treats the measured correlations as if they came from the simplest random process with those correlations, a Gaussian process, and reports that process's dissipation. For Gaussian systems this is exact. In 2021, Seara, Machta and Murrell wrote in *Nature Communications* that for nonlinear systems this Gaussian number is a **lower bound** on the true dissipation. If so, any correlation measurement would certify a guaranteed minimum energy cost.

**What was found.** That lower-bound statement is false. The paper builds simple, fully observed Markov models that all have **exactly the same correlations at every time lag**, yet dissipate at any rate at all:

- a family of four-state jump processes, whose dissipation takes every positive value;
- a family of two-dimensional diffusions with the same linear drift as the Gaussian comparator but state-dependent noise, whose dissipation takes every value between 0 and the Gaussian value.

The Gaussian value for these correlations is exactly $1/3$. At one parameter choice the true value is $\log(5/2)/4\approx0.229$, so the Gaussian number is already 45.5% too high, and it can be too high by any factor.

**Why it happens.** Picture a system that is idle almost all of the time and occasionally bursts into fast circulation around a driven cycle (the banner shows this network). Make the bursts rarer by a factor $\varepsilon$ and the signal during a burst larger by $\varepsilon^{-1/2}$. The correlations do not change, because they average squared amplitudes weighted by how often each state is occupied. But the dissipation is paid only while the cycle turns, so it falls by the factor $\varepsilon$. A Gaussian with the same correlations has no idle periods: it circulates all the time, and dissipates at the full rate.

**What still works.** Information beyond the correlations rescues inference. A published fourth-order bound by Raux, Maier and Seifert recovers up to 93.5% of the true value on the example. A known range for the signals, or a model constraint, also helps.

**Status.** An anonymous, AI-assisted, unrefereed candidate, checked by internal AI-assisted review only, not by peer review or independent reproduction.

## Summary for specialists

Let $X_t$ be a centred two-dimensional observable of a stationary process with covariance $C(t)=\mathbb E[X_tX_0^{\mathsf T}]$. The Gaussian spectral value $\mathcal G[C]$ is the entropy-production rate of the stationary Gaussian process with covariance $C$ (Seara et al. 2021, Eq. (3)). Fix

$$
C(t)=e^{Ft}\Sigma,\qquad F=\begin{pmatrix}-4&-1\\1&-5\end{pmatrix},\qquad \Sigma=\tfrac13\begin{pmatrix}2&1\\1&2\end{pmatrix},\qquad \mathcal G[C]=\tfrac13 .
$$

| Result | Status |
|---|---|
| Four-state chains $Q_{\varepsilon,\kappa}$, $0<\varepsilon\le1/2$, $1\le\kappa<3$, all have covariance $C(t)$, escape rates below four, uniform mixing and an injective readout; $\sigma(\varepsilon,\kappa)=\varepsilon\log\frac{6-\kappa}{3-\kappa}$ covers $(0,\infty)$ (Theorem 1) | proved; exact rational checks |
| $\mathcal G[C]=1/3$, so $\mathcal G$ is not a lower bound; the overestimate factor is unbounded; also for bounded readouts (amplitude then varies), finite sampling intervals and continuous smoothed records (Sections 3, 8) | proved |
| Planar diffusions $\mathrm dX=FX\,\mathrm dt+\sqrt{2D(X)}\,\mathrm dW$ with $D(x)=d(y(x))\Sigma$ have covariance $C(t)$ and rates filling $(0,1/3]$ (Theorem 2) | proved; symbolic Fokker–Planck check |
| Student-type member: $\sigma_\alpha=\alpha/[3(\alpha+1)]$ (Proposition 3); in the radial class $\sigma\ge\mathcal G[C]\,\mathbb E d/\sup d$ (Eq. 25) | proved |
| Reversible gating preserves any centred covariance and multiplies $\sigma$ by $\varepsilon$ (Theorem 4, Corollary 5) | proved |
| The Raux–Maier–Seifert bound recovers $6/[7\log(5/2)]\approx0.935$ of $\sigma$ as $t\downarrow0$ at $\kappa=1$ (Section 6.1) | proved |
| A naive kurtosis-discounted bound $\sigma\ge\mathcal G[C]\cdot8/\mathbb E|W|^4$ fails (Section 6) | numerical search |
| Diffusions with constant noise matrix | open |

The Gaussian formula itself, and the numerical estimates of Seara et al., are not disputed. Only the unrestricted lower-bound statement fails.

## Technical account

**The four-state family.** State 0 is idle; states 1, 2, 3 form a driven three-cycle with clockwise rate $a=2-\kappa/3$ and anticlockwise rate $b=1-\kappa/3$. Active states return to 0 at rate $\kappa$, and state 0 leaves to each at rate $c=\kappa\varepsilon/[3(1-\varepsilon)]$, so the stationary law is $(1-\varepsilon,\varepsilon/3,\varepsilon/3,\varepsilon/3)$. The readout sends state 0 to the origin and the active states to points of size $\varepsilon^{-1/2}$. The closure identity $QX=XF^{\mathsf T}$ gives $\mathbb E[X_t\mid Z_0]=e^{Ft}X_0$, hence $C(t)=e^{Ft}\Sigma$ for every parameter pair. The gate transitions satisfy detailed balance and dissipate nothing; each cycle edge carries net current $\varepsilon/3$ with affinity $\log(a/b)$, giving Eq. (8).

**The Gaussian value.** $F$ is stable and $D=-\tfrac12(F\Sigma+\Sigma F^{\mathsf T})=\tfrac92\Sigma$, so the covariance-matched Ornstein–Uhlenbeck process has isotropic damping $9/2$ and rotation frequency $\omega_0=\sqrt3/2$ in whitened coordinates, and its entropy rate is $2\omega_0^2/\gamma=1/3$.

**Diffusions.** Keep the drift $FX$ and let the noise depend on the whitened radius through $y=m\,x^{\mathsf T}\Sigma^{-1}x/2$. A radial stationary law with survival function $S(y)=(1+y)^{-c}e^{-\lambda y}$ makes the covariance exactly $\Sigma$, and the entropy rate becomes $\tfrac13\mathbb E[Yh(Y)]$; the identity $1-3\sigma=c\int_0^\infty yS/(1+y)^2\,\mathrm dy$ shows $\sigma\le1/3$ with equality only at $c=0$. Weak dissipation again comes from rare large excursions, now carried by heavy-tailed, strongly heterogeneous noise.

**Where the published argument breaks.** The supporting argument in the preprint appendix applies data processing to phase-randomised surrogates. Random phases keep every second-order statistic but do not produce a Gaussian, and the data-processing inequality compares two laws transformed by the same map, not a law with its covariance-matched Gaussian. The counterexamples settle the question independently of this diagnosis.

**New and known.** Moments not determining relative entropy (Nishiyama and Sason), rare oscillatory sectors (Shiraishi 2026), resetting and Pearson diffusions are known ingredients. The paper's contribution is using them to hold one nonzero asymmetric covariance fixed while dissipation varies, and the explicit correction of the unrestricted statement.

## Evidence, assurance and limitations

- **Proofs.** Every theorem and proposition has a written proof. Diffusion well-posedness uses standard results (Khasminskii 2012).
- **Exact and symbolic checks.** Exact rational checks of stationarity, closure, characteristic polynomials and currents for 16 parameter pairs, a separate implementation, standard-library fingerprints, and a symbolic Fokker–Planck residual of 0 for the diffusions.
- **Replay and controls.** A replay driver reruns all eight scripts from a clean copy, compares every record and checks the headline values; it passes in normal and optimised mode, locally and in CI. Fourteen corruptions are rejected, among them a changed cycle rate, a Gaussian value of 1/4, rescaled diffusion noise and a diffusion rate above 1/3.
- **Review.** A five-perspective internal review, two adversarial correctness audits by a different model, a targeted proof audit and a re-review. No main claim failed; corrections included the noise-ratio figure, a full proof of the upper end of $(0,1/3]$, a separate well-posedness proof and a precise diffusion entropy definition. This is **not** peer review, independent reproduction or formal verification.
- **Limits.** At fixed covariance, weak dissipation needs growing signal amplitudes or heavy-tailed noise, and energies or affinities diverge in the limits. Short records may never see the rare excursions. Diffusions with constant noise are open. The literature search was bounded, and no priority is claimed.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Experimentalists inferring dissipation from correlations | Do not read the Gaussian number as a guaranteed minimum; report a fourth-order diagnostic alongside it | The Gaussian value is still exact for Gaussian systems and may be a good approximation near linear behaviour |
| Stochastic thermodynamics | A clean, fully observed counterexample and a mechanism (rare active bursts) that any covariance-only bound must face | The examples need growing amplitudes or heavy tails |
| Time-series and information theory | Second-order statistics cannot bound a divergence between two non-Gaussian laws | Surrogate methods remain useful tests; the claim is about bounds |

## Why the problem matters

Covariance-based estimates are attractive because they need little data. If they also gave a guaranteed lower bound, any measured circulation would certify a minimum energy budget. This result shows that no such guarantee follows from correlations alone, and points to the extra information, higher-order statistics, observation ranges or model structure, that a reliable bound must use.

## How to inspect or reproduce the recorded checks

1. Read Theorem 1 and Section 3: the covariance identity and the value $1/3$ can be checked by hand.
2. Download the archive from the DOI or the GitHub release, install the pinned `requirements.txt` (NumPy, SciPy, SymPy) and run `python3 -B replay_all.py` (about 1.5 minutes) and `python3 -B negative_controls.py`.
3. Appendix A of the paper maps each computational claim to its script.

## The most valuable next projects

1. Decide whether a diffusion with constant noise and nonlinear drift can reproduce the covariance with dissipation below $1/3$.
2. Find a correct lower bound using the covariance together with kurtosis or a known signal range; the simplest kurtosis-discounted form is false.
3. Quantify how long a record must be before covariance-based estimates see the rare excursions, for practical estimators.

## What is in the evidence package

The 16-page paper (PDF and LaTeX) and its figure. Exact, symbolic and numerical Python checks for the four-state family, the diffusions and the kurtosis probe, with their result records. A replay driver with claim checks, negative controls and CI. Dated prior-art and proof-review notes from development. Records of status, assurance, claims, review dispositions, provenance and citation checks, and SHA-256 sums for every file.
