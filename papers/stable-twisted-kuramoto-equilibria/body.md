## Summary

**In one sentence.** Identical oscillators scattered at random over a flat torus, in any fixed dimension, still hold stable "twisted" patterns in which the phase winds a whole number of times across the space, near every winding up to a growing limit.

**The model.** The Kuramoto model is the standard mathematical picture of synchronisation, used for fireflies, pendulum clocks, power-grid generators and neurons. Each oscillator has a phase, a position on a circle, and keeps nudging it towards the phases of its neighbours. Here $n$ identical oscillators are placed at independent uniformly random points of a flat torus: a square, cube or higher-dimensional box whose opposite faces are glued together. Two oscillators interact if they are closer than a small radius $\varepsilon$, with a weight that may depend on their separation.

**The question.** Full agreement (synchrony) is one stable outcome. Another is a *twisted state*: walking across the torus, the phase turns steadily round the circle a whole number of times, like a spiral wave frozen in place. On a regular grid such patterns are exact by symmetry. With random positions every oscillator feels a small unbalanced pull, so it was unclear whether an exact stable twisted pattern survives. In 2025 Cirelli, Groisman, Huang and Vivas proved that the dynamics follows the heat equation over any fixed time window and conjectured that stable twisted equilibria exist near every twist.

**What is proved.** Write $\delta=\sqrt{\log n/(n\varepsilon^{d+2})}$; in words, $\delta$ is the relative size of the random sampling noise in the interaction network at the interaction scale. If $\varepsilon\to0$ while $n\varepsilon^{d+2}/\log n\to\infty$, then with high probability, for every integer twist $k\in\mathbb Z^d$ with $|k|\le c/(\varepsilon+\delta)$, there is an asymptotically stable equilibrium whose phase is within $C|k|\delta$ of the perfect pattern $k\cdot x$ at every oscillator (Theorem 2.1). This proves the conjecture for every coupling in their class whose strength grows no faster than one over the distance, including the plain "connect if close" network and every bounded coupling, and it covers all twists in every direction, not only those along a coordinate axis. Many such stable patterns coexist: the paper constructs at least $c(\varepsilon+\delta)^{-d}$ distinct ones.

**How sure we are.** Every result has a written informal proof, checked by internal AI-assisted review and proof audits. The computations are an exact check of a classical special case and six small numerical illustrations; they are not proofs.

The banner above shows a real computed example: 4,096 random points on the two-dimensional torus, coloured by their equilibrium phase, which winds once from left to right (=(1,0)$, radius /bin/zsh.6$); the largest correction away from the perfect pattern is 0.27 radians. It is a finite illustration outside the theorem's asymptotic regime.

## Summary for specialists

$X_1,\dots,X_n$ iid uniform on $\mathbb T^d=(\mathbb R/2\pi\mathbb Z)^d$; weights $w_{ij}=K(z_{ij}/\varepsilon_n)$ with $z_{ij}$ the shortest displacement; $K$ measurable, even, $\operatorname{supp}K\subseteq\overline B_1$, $K>0$ a.e. on some $B_r$, $W_1=\operatorname{ess\,sup}|z|K(z)<\infty$; degree-normalised Kuramoto dynamics as in Cirelli–Groisman–Huang–Vivas (CGHV); $\delta_n=(\log n/(n\varepsilon_n^{d+2}))^{1/2}$.

- **Main theorem:** if $\varepsilon_n\to0$ and $n\varepsilon_n^{d+2}/\log n\to\infty$, then w.h.p. and a.s. eventually, for all $k\in\mathbb Z^d$ with $|k|\le c_A/(\varepsilon_n+\delta_n)$ there is an asymptotically stable equilibrium $\theta^{(k)}_i=k\cdot X_i+u^{(k)}_i$ with mean-zero $u^{(k)}$, $\|u^{(k)}\|_\infty\le C_A|k|\delta_n$ and cohesive edge lifts $\le\pi/4$ (Theorem 2.1) *(proof)*
- **Relation to the conjecture:** proves CGHV's conjecture for every kernel in their class with $|z|K$ bounded (hard radius, bounded kernels, $|z|^{-\alpha}$ for $0<\alpha\le1$), for all $k\in\mathbb Z^d$, with sup-norm closeness, and without radial symmetry or positivity on all of $B_1$ (Remark 2.2) *(proof)*
- **Multiplicity:** at least $c(\varepsilon_n+\delta_n)^{-d}$ distinct stable constructed rotation orbits; with $\varepsilon=(\log n/n)^{1/(d+4)}$ this is of order $(n/\log n)^{d/(d+4)}$ (Corollary 2.3) *(proof; lower bound)*
- **Inverse estimate:** $\|L_a^{-1}f\|_\infty\le C\|f\|_\infty$ on mean-zero functions, uniformly over all conductance fields $a$ dominating a bounded backbone $\lambda\min\{w,1\}$, with no upper bound on $a$ (Proposition 3.2) *(proof: Nash and Poincaré, first backbone jump, spectral gap)*
- **Basin and all times:** a basin of fixed size with uniform weighted $L^2$ decay (Proposition 5.1); for bounded radial kernels the heat approximation holds uniformly over $t\ge0$ for each fixed smooth lift (Theorem 5.2) *(proofs)*
- **Nonuniform sampling:** for smooth positive densities $\rho$ and bounded kernels, stable equilibria within $C[\varepsilon^2(|k|+|k|^3)+|k|\delta]$ of weighted harmonic lifts $\operatorname{div}(\rho^2M_K\nabla\phi_k)=0$ (Theorem 6.1) *(proof)*

## Technical account

**From a template to an equilibrium.** The perfect pattern $k\cdot x$ is not an equilibrium on random points: each oscillator feels a residual force. The proof treats the equilibrium equation as a nonlinear Poisson problem for a mean-zero correction $u$. Bernstein's inequality bounds the residual by $C|k|\delta$ in sup norm, simultaneously over all admissible twists; the bound $\sup|z|K<\infty$ is exactly what keeps each summand of order $|k|\varepsilon$ even for singular kernels.

**The key estimate.** Solving for $u$ needs the inverse of a graph Laplacian whose conductances depend on the unknown solution. Proposition 3.2 shows that this inverse is bounded in sup norm uniformly over every conductance field lying above a fixed bounded backbone. The classical route (Nash inequality, spectral gap, mixing in time of order one) gives such a bound for one graph; the new element is uniformity over all solution-dependent fields with no upper bound, obtained by marking only the jumps of the bounded backbone. That is what admits singular kernels.

**Closing the loop.** Replacing the sine by a convex extension makes the equilibrium problem the minimisation of a strictly convex energy on the mean-zero hyperplane. The Green bound shows the minimiser's edge lifts stay below $\pi/4$, where the extension agrees with the sine, so the minimiser is an exact Kuramoto equilibrium; positive cosine conductances give stability modulo rotation. Coordinate loops telescope to $2\pi k_\ell$, so different $k$ give genuinely different states.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/stable-twisted-kuramoto-equilibria.txt) is available for reading.

- **Proofs.** Every theorem, proposition, lemma and corollary has a written informal proof in the 20-page manuscript, with a one-page roadmap after Theorem 2.1.
- **Exact check.** `verify_fingerprints.py` checks, in exact quadratic-number-field arithmetic with the standard library only, that the twisted-state Hessian spectra of the cycles $C_5$, $C_8$ and $C_{12}$ match the classical Fourier formulas. This is a sanity check of a known special case.
- **Numerical illustrations.** `computations.py` regenerates six seeded random examples in dimensions 1 to 3 with full solver records; all graphs are connected and the normalised residuals are between about $2\times10^{-16}$ and $2\times10^{-13}$. The examples lie outside the theorem's regime (their largest edge lifts, 0.86 to 1.50 radians, exceed the $\pi/4$ used in the proof) and do not certify the constants.
- **Replay.** All scripts were rerun under `-I -B` and `-I -B -O` from fresh copies of the package: the exact receipt matched byte for byte and the numerical record agreed to within $3\times10^{-13}$ outside timing and version fields. Copies with the check helper deliberately inverted failed.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a separate model and a clean replay led to one revision round, which extended the main theorem from bounded to singular kernels. A proof audit and a separate-model audit of the new proofs, and a re-review, found no open correctness issue. A rating-free summary is in the package.
- **Limitations.** Kernels with $|z|K$ unbounded, including bare integrable kernels, are not covered; Section 8 explains the obstruction. The weaker connectivity regime $n\varepsilon^d\sim\log n$ is open. Constants are not explicit. The all-time heat limit and the nonuniform-sampling result are proved for bounded kernels only. The result concerns identical oscillators; it does not classify all equilibria. The literature search was dated and bounded.

## Relationship to earlier work

Cirelli, Groisman, Huang and Vivas (SIAM Journal on Applied Mathematics, 2025) proved the compact-time heat-equation limit under the same scaling and stated the conjecture settled here for coordinate twists. De Vita, Fernández Bonder and Groisman (2025) proved twisted local minima on the circle, but in the regime $n\varepsilon^2\to0$, which is disjoint from this one, so in dimension one the present result is complementary. Twisted states on rings and on Cayley and random graphs go back to Wiley, Strogatz and Girvan (2006) and Medvedev and Tang (2015). The analytic ingredients follow Diaconis and Saloff-Coste's Nash-inequality method and graph Laplacian regularity on random clouds (Calder, García Trillos and Lewicka); De Vita, Groisman and Huang's synchronisation result on the sphere shows the contrast with the torus.

On Evidence Press, [Signed Kuramoto networks inside positive ones](/releases/signed-kuramoto-positive-networks/) uses the same Kuramoto model for a different problem: it realises networks with negative couplings inside networks with only positive couplings and studies their equilibrium sets. It involves no random geometry or twisted states.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on synchronisation in spatial networks (oscillator arrays, sensor and clock networks) | A guarantee that winding patterns are stable on randomly sampled geometry, and how many coexist | Identical oscillators; sufficiently dense graphs; constants not explicit |
| Probabilists and analysts working on random geometric graphs and graph Laplacians | A sup-norm inverse estimate uniform over solution-dependent conductances, usable for other nonlinear problems on point clouds | Proved for the torus under $n\varepsilon^{d+2}/\log n\to\infty$ |
| People studying XY-type models and phase fields on point clouds | Many stable winding sectors of the cosine energy, with their energies to leading order | Lower bound on the number of states, not a classification |
| Research agents | Machine-readable claims, an agent index and replayable checks | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

Whether patterned states survive disorder is a basic question about synchronisation in real, irregular networks. Twisted states are the simplest patterns that topology allows, and they are known to trap the dynamics away from synchrony. Showing that they persist, stably and in large numbers, on randomly sampled geometry in every dimension turns a symmetry-based picture into a statement that holds for disordered systems.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -m venv env && env/bin/pip install -r requirements.txt   # numpy 2.3.5, scipy 1.17.0, matplotlib 3.10.8
env/bin/python -I -O verify_fingerprints.py         # exact check; rewrites exact_fingerprints.json identically
env/bin/python -I -O notes/verify_mmpp.py           # supplementary note's exact certificate (unrelated to the theorem)
MPLCONFIGDIR=/tmp/mpl env/bin/python -I -O computations.py   # six numerical examples, a few seconds
```

The scripts write their outputs next to themselves, so run them in a copy. `AI_INDEX.md` maps each claim to its location in the paper and its evidence, and `review/REVIEW_SUMMARY.md` lists the objections raised in review and how each was handled.

## The most valuable next projects

1. Extend the theorem to kernels with $|z|K$ unbounded, such as $|z|^{-\alpha}$ with $1<\alpha<d$, perhaps by truncation with a worse rate.
2. Decide whether the connectivity regime $n\varepsilon^d/\log n\to\infty$ suffices.
3. Make the constants explicit and compare them with simulations in the theorem's regime.
4. Extend the all-time heat limit and the nonuniform result to singular kernels, and treat heterogeneous intrinsic frequencies or other closed manifolds.

## What is in the evidence package

The paper (PDF and LaTeX source) with its figure; `verify_fingerprints.py` with its exact receipt; `computations.py` with the numerical records; verification and claim records; preserved development drafts (`originals/`); two unrelated supplementary research notes kept for provenance (`notes/mmpp.md`, `notes/split_ci.md`); a rating-free review summary (`review/`); the bibliography as BibTeX from the Crossref and arXiv records; `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text and figures are CC0-1.0; code is MIT. This is an unrefereed candidate.
