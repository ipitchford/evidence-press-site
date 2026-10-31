## Summary

**The everyday picture.** Many stars have a companion, and some of these pairs are *wide binaries*: two stars hundreds to thousands of times farther apart than the Earth is from the Sun. One orbit takes thousands of years, so no one can watch it. Yet the shape of the orbit, its *eccentricity* $e$ (0 for a circle, close to 1 for a long thin ellipse), records how the pair formed and what has happened to it since.

**What can be measured.** The Gaia satellite gives a snapshot of each pair: the line joining the two stars on the sky (the *projected separation*) and the direction in which one star moves relative to the other (the *projected relative velocity*). The angle $\Gamma$ between these two directions depends on the orbit's shape. A single angle says little about one pair, but the spread of angles over many pairs says a lot about the population. Astronomers have used this idea since 1998, with computer simulations.

**The question.** In 2022 Hwang, Ting and Zakamska asked whether this works in principle: could two *different* populations of orbit shapes produce exactly the same spread of angles? If so, the angles could never tell them apart.

**What was found.** Under the standard idealisation (each pair caught at a random moment of its orbit and seen from a random direction):

1. **There is a short exact formula** for how likely each angle is, for an orbit of any eccentricity. Until now this was computed by simulation.
2. **The spread of angles determines the spread of eccentricities completely.** Different populations never give the same angle distribution, and there is an explicit recipe for going back.
3. **Fine detail is nearly invisible.** The recipe is unstable: populations that differ in fine structure can give almost identical angles. Broad features, such as averages, are recovered reliably.
4. **Useful averages need no recipe at all.** For example, the average squared eccentricity equals an average of simple functions of the angle. The same idea gives quick estimates of the commonly fitted "power-law index".
5. **Some selections are safe.** The paper identifies which common ways of choosing stars keep these results exact.

**How sure we are.** Every result has a written proof, and simulations of Kepler orbits check the formulas. No real star catalogue is analysed. This is an anonymous, AI-assisted, unrefereed candidate whose review was internal, not peer review.

## Summary for specialists

Model: conditional on $e\in[0,1)$, mean anomaly uniform on $[0,2\pi)$; orbital frame Haar-distributed on $SO(3)$, independent of phase; $\Gamma\in[0,\pi]$ is the angle between error-free sky projections of relative position and velocity. Write $c=|\cos\gamma|$ and $j=\sqrt{1-e^2}$. Any phase density with $\rho_e(E)+\rho_e(\pi-E)=1/\pi$ gives the same law.

| Result | Status |
|---|---|
| $p(\gamma\mid e)=\dfrac{\operatorname{acosh}(1/e)-\mathbf 1_{\{c>e\}}\operatorname{acosh}(c/e)}{\pi\sin^2\gamma}$; circular case $-\log c/(\pi\sin^2\gamma)$ (Theorem 3.1) | proof |
| Mixtures over any Borel law $F$ are classical Abel transforms; the angle law determines $F$, atoms included, by an explicit inverse (Theorem 4.1) | proof |
| $f(e)=(\alpha+1)e^\alpha$ gives $p_\alpha(\gamma)=\dfrac{B(\frac{\alpha+1}{2},\frac12)}{2\pi}\dfrac{1-c^{\alpha+1}}{\sin^2\gamma}$; a flat angle law forces $f(e)=2e$ (Section 5) | proof |
| $\mathbb E\,j=\tfrac\pi2\,\mathbb E\sin^3\Gamma$; every real-order moment $\mathbb E\,j^s$ has an explicit bounded observable (Theorem 6.1) | proof |
| $\mathbb E\,e^2=\tfrac12+\mathbb E\cos2\Gamma-\tfrac12\mathbb E\cos4\Gamma$, and $\mathbb E\,e^4$ likewise (Corollary 7.1); at most one symmetric unbiased single-angle observable per target (Theorem 6.2) | proof |
| Power-law index estimators with Fisher information; efficiency at least 0.9595 on a 501-point grid (Section 7.2, Table 1) | formulas proved; numbers by quadrature |
| Thermal at each semimajor axis and total mass $\Rightarrow$ flat angles under any selection that ignores sky position angles (Proposition 8.1) | proof |
| Binning by projected separation: exact under $dN/da\propto a^{-1}$, otherwise an explicit $\rho^{\beta-1}$ reweighting (Proposition 8.2, Table 2) | proof; simulated |
| Inverse continuous in the weak topology, discontinuous in total variation (Propositions 9.2, 9.1) | proof |
| Grid maximum-likelihood fit: step-CDF errors 0.103, 0.061, 0.036 at $N=2{,}000$, $20{,}000$, $100{,}000$ | demonstration only |

## Technical account

**Phase becomes a spherical coordinate.** In the orbital plane, the intrinsic angle $\theta$ between $\boldsymbol r$ and $\boldsymbol v$ satisfies $\cot\theta=q\sin E$ with $q=e/j$ and $E$ the eccentric anomaly. Pairing $E$ with $\pi-E$ turns the Kepler phase measure into the law of $\sin E$ under a *uniform* $E$, which is why uniform mean anomaly and uniform eccentric anomaly give the same angle law. Averaging the projection over the Haar-random orientation and the phase in closed form yields the inverse-hyperbolic-cosine kernel, with an equivalent nonnegative form $p(\gamma\mid e)=\frac{1}{\pi\sin^2\gamma}\int_{\max(e,c)}^1\frac{dt}{\sqrt{t^2-e^2}}$.

**The Abel bridge.** That integral representation shows that $\pi\sin^2\gamma\,p_F(\gamma)$, as a function of $c$, is an integral of $A_F(t)=\int_0^t (t^2-e^2)^{-1/2}dF(e)$, which is a classical Abel transform of $F$. Abel inversion recovers $F$, including atoms, after choosing a canonical representative of the angle density. The stability analysis follows the same route: the Abel operator smooths, so total-variation differences in $F$ can shrink to nothing in the angle law (an explicit sequence decays roughly like $1/n$ numerically), while weak convergence is preserved.

**Moments without inversion.** Integrating the kernel against $\sin^k\gamma$ and Fourier modes gives beta-function identities that turn moments of circularity $j$ and even moments of $e$ into means of bounded angle functions. Because the kernel family is complete, each such target has at most one symmetric unbiased observable, so these are *the* direct estimators, with explicit variance bounds.

**Selection.** Proposition 8.1 uses the microcanonical characterisation of the thermal law (Jeans 1919): at fixed semimajor axis and mass, a thermal population is uniform on the energy shell, and any selection that ignores sky position angles leaves the angle law flat. This proves and delimits a numerical finding of Hwang et al. Proposition 8.2 computes how a projected-separation bin reweights the population; under a log-uniform semimajor-axis law the weight is constant.

**Classical and new.** Angle-based inference (Tokovinin 1998 onward), the intrinsic-angle density (Hwang et al. 2022, equations 11–16), Abel inversion and the thermal law are established and credited. Within a bounded search, the new elements are the closed-form projected likelihood, the measure-level inverse answering Appendix B, the dual observables and Fourier eccentricity moments, and the two selection results.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/wide-binary-angle-inversion.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 21-page manuscript; the original proof notes for Theorems 3.1 and 4.1 are in the package.
- **Checks.** One validation script tests the normalisation of the likelihood by quadrature at 8 eccentricities (largest error $3.5\times10^{-14}$) and the moment identities (largest error $2.7\times10^{-14}$); end-to-end inversion from the angle density back to the eccentricity law, for an atomic law and three power laws; $5\times400{,}000$ independent Kepler simulations against the formula, with chi-square and Kolmogorov–Smirnov tests at a family-wise level of 0.001, plus phase controls (uniform eccentric anomaly must agree; uniform true anomaly must be rejected); the selection results, on two million simulated binaries with realistic separation bins; and the power-law estimators' spread across 400 replicate samples.
- **Negative controls and replay.** Six deliberately corrupted ingredients (kernel, two observables, inclination law, phase law, inverse constant) must each be caught, and are. The full suite was replayed from a clean copy in normal and optimised Python with byte-identical results.
- **Review.** Internal AI-assisted review in five roles plus an adversarial correctness review by a different model led to one revision, which added the selection results, the dual observables, the eccentricity-moment formulas, the power-law estimators and the weak-continuity result. A proof audit and a re-review followed; their findings were repaired. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** Ideal model only: uniform mean anomaly is not uniform true anomaly, and selection by projected separation, proper-motion significance or quality cuts can change the phase and orientation laws outside the cases of Section 8. Measurement errors are not modelled, and chance alignments with uniform angles look like a thermal component. No observational catalogue is analysed. The grid fit's consistency, the observed $1/n$ decay, minimax rates and semiparametric efficiency are not proved. Numerical tolerances are floating-point, not interval certificates. The prior-art search was bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Wide-binary and Gaia astronomers | An exact likelihood to replace simulation grids, direct moment estimators and a check on which sample selections are safe | Real data need an astrometric-error and selection model; no catalogue is analysed here |
| Star-formation and dynamics theorists | A precise statement of what angle data can and cannot recover about eccentricity distributions | Fine structure is not stably recoverable; compare broad summaries |
| Statisticians of inverse problems | A new exactly solvable Abel-type projection problem, with dual observables and a weak/total-variation stability contrast | Rates and estimator consistency remain open |
| Research agents | Machine-readable claims, an agent index, a tested Python library and negative controls | The checks are numerical; the theorems rest on the written proofs |

## Why the problem matters

Eccentricity distributions of wide binaries are evidence about how binaries form, how they are disturbed by passing stars and the Galactic tide, and even about tests of gravity at low accelerations. Gaia has made samples of a million pairs available, so the bottleneck is the statistical link between what is measured and what is wanted. An exact likelihood removes simulation noise from that link, the uniqueness theorem says the link is not ambiguous in principle, and the stability result says how much detail it can honestly carry.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.11 and the pinned packages:

```sh
shasum -a 256 -c SHA256SUMS
pip install -r requirements.txt
python -O quick_checks.py --out /tmp/quick          # about 30 seconds
python -O negative_controls.py --out /tmp/nc        # about a minute
python -O validate_and_plot.py --n-per-e 400000 --out /tmp/full   # about 5 minutes
```

Each command raises an error if any check fails, and none overwrites the shipped results. `AI_INDEX.md` maps each result to its evidence, and `wide_binary_angles.py` exposes the likelihood, observables and estimators for reuse.

## The most valuable next projects

1. Fit a Gaia wide-binary sample with the exact likelihood plus an explicit vector proper-motion error model and selection model, and compare with simulation-grid fits.
2. Prove the observed $1/n$ decay of the total-variation example, or a minimax rate for estimating the eccentricity law from angles.
3. Find a closed joint law for the angle and the normalised projected speed.
4. Establish consistency of the grid maximum-likelihood fit, and semiparametric efficiency of the moment estimators.

## What is in the evidence package

The package contains:
- the manuscript (PDF and LaTeX source);
- the Python library, the full validation script with its recorded results and four figures, a fast check script and the negative-control script, with a CI workflow;
- the original proof notes and target definition of 28 October 2026, as a development record;
- the bounded novelty report with its 31 October addendum, sources and citation-audit records;
- a rating-free review summary and verification record;
- claim, status, assurance and provenance records, and an agent index.

Licences are CC0-1.0 for text and data and MIT for code, and SHA-256 manifests are included. The same files are in the GitHub release and the Zenodo record.
