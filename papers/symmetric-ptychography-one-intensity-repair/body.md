## Summary

**The setting.** Ptychography is a way of imaging very small objects, from integrated circuits to biological cells. A known illumination, the **probe** (a beam of light, X-rays or electrons), is scanned across the object, and at each position a detector records how strongly the beam is scattered in each direction. The detector sees only intensities, not the phases of the waves, so the image has to be recovered mathematically: this is *phase retrieval*. With many overlapping positions there is usually enough information to do it, up to one unavoidable overall phase.

**The problem.** After a Fourier transform, the recorded data become a grid of numbers, each one an "object number" multiplied by a "probe number" $p_r(q)$. Wherever a probe number is zero, the matching piece of information about the object is simply lost. Symmetric probes always have such zeros. Every **real, mirror-symmetric** probe, which includes the Gaussian beams used in many experiments, has zeros arranged in a cross on this grid. The *Phasebook* survey of open problems (Allain et al. 2025, Section 8.1) asks what recovery guarantees remain when the probe has zeros like these.

**What the paper shows.** It answers precise versions of that question in an idealised model: a finite grid that wraps around (cyclic), every scan position and every frequency recorded, and the probe known exactly.

- **Only twins are confused.** For a real-even probe whose zeros are exactly the forced cross, two objects give the same data only if they form a **twin pair**: an object concentrated on two opposite pixels, and a copy with the phases on those two pixels conjugated (mirrored). The same can happen with two opposite frequencies of the object's Fourier transform. Nothing worse, and no mixture of the two kinds, can occur (Theorem 9.3).
- **One extra measurement removes every twin.** Add a single coherent intensity $|g^*x|^2$: in practice one extra exposure under a structured illumination $g$, reading only the central far-field pixel. If $g$ "sees" each of the possible twin directions, every object becomes uniquely determined, even if the competitors are allowed to be blurred, mixed-state (positive-semidefinite) objects (Theorem 9.5). A gently graded, tilted beam works in every even grid size (Proposition 9.6).
- **Gaussian beams qualify, with exact boundaries.** Gaussian probes have exactly the cross pattern at all but finitely many widths. For grid sizes $n=6$ to $16$ a certified computation locates every exceptional width: the pattern holds below a first width $t^*(n)$, with $t^*(6)=2^{-1/2}$ and $t^*(n)\approx0.74$–$0.84$ for $8\le n\le16$ (Theorem 9.2).
- **A practical warning.** A defocused beam (a quadratic chirp) is the optimal repair for individual twin pairs when $n\equiv2\pmod 4$, but repairs nothing at all when $n$ is divisible by $4$, which includes the common power-of-two grids (Proposition 9.7).

The paper also treats a related family of probes with a single line of zeros, where it gives exact stability constants after one added measurement and an optimal choice of that measurement, and short three-site probes, where a two-pixel reading repairs every signal without zero entries.

**Prior work, credited.** A public AI-assisted manuscript, *VESPER–QUORUM* (version 6.0.0, 3 October 2026), already contains the single-line block and fibre classification, the obstruction mechanism and the positive-semidefinite reconstruction algorithm; those are credited, not claimed. It does not add measurements and does not cover the cross pattern of real-even probes. The cone-angle method and positive-semidefinite iteration used here are also credited to it; it states that the identity was already used in an earlier manuscript of the same credited author.

**What it does not do.** The extra measurement changes the experiment: this is a repair, not recovery from the original data alone. The model is one-dimensional and cyclic with an exactly known probe; it is not blind ptychography and does not model detector noise. The Gaussian result is an exact-arithmetic statement: at small widths the relevant probe numbers are tiny (about $4\times10^{-14}$ at $n=10$, $t=1/n$), so recovery can be numerically fragile. For real-even probes the stability constant is only qualitative; the explicit values at $n=6$ are uncertified numerical evidence. All numerical tests use synthetic data.

The sections below move from this overview to a specialist summary, the technical argument, the evidence and its limits, and how to rerun the checks.

## Summary for specialists

Indices in $\mathbb Z_n$, $n=2N\ge6$; known probe $w$; complete cyclic data $Y_w(x)_{s,k}=|n^{-1/2}\sum_j x_j\overline{w_{j-s}}\,\omega^{-kj}|^2$. Lemma 2.1: $(F_sF_kY_w)_{q,r}=(F d_r(x))_q\,p_r(q)$ with correlation diagonals $d_r(x)_j=x_j\overline{x_{j+r}}$ and multipliers $p_r(q)=(F a_r(w))_{-q}$, $a_r(w)_j=\overline{w_j}w_{j+r}$. Added datum $J_g(x)=|g^*x|^2=n\,|(F(\overline g\odot x))_0|^2$.

- **Cross mask (Proposition 9.1).** Every real-even probe has $p_r(q)=0$ when $(q=N,\ r\text{ odd})$ or $(r=N,\ q\text{ odd})$; generically, and for the circular-distance Gaussian $w_j=t^{\operatorname{dist}(j,0)^2}$ at all but finitely many $t\in(0,1)$ including all $t\le1/n$, these are the only zeros.
- **Fibres (Theorem 9.3).** Under the exact cross mask, $\ker\mathcal A_w\cap\operatorname{Herm}(n)=\mathcal K_T+\mathcal K_F$ (time- and Fourier-antipodal blocks $D_t$, $B_t$); every rank-two kernel difference is a multiple of one $D_t$ or one $B_t$, so fibres have at most two global-phase classes, the nontrivial ones being $x=ae_t+be_{t+N}$ or $Fx=ae_t+be_{t+N}$ with $\operatorname{Im}(a\bar b)\ne0$. A zero row of $xx^*-yy^*$ excludes mixed low-rank terms.
- **Repair (Theorem 9.5).** $(Y_w,J_g)$ is injective modulo phase iff $g^*D_tg\ne0$ and $g^*B_tg\ne0$ for all $t$; then strict rank-one PSD completeness holds, because an anticommuting involution ($M$ or $MT$) makes every kernel spectrum symmetric and the inertia criterion (Carmeli et al. 2014; Baldwin et al. 2016) applies. Proposition 9.6: $g_j\propto\rho^je^{\pi ij/n}$ satisfies this for every even $n$, with block gains $\ge1/(\sqrt2n^2)$ at $\rho=1-1/n$. Proposition 9.7: the Chu chirp gives all block gains $\sqrt2/n$ for $N$ odd and all zero for $N$ even.
- **Certified widths (Theorem 9.2).** $|E_n|=3,6,11,15,23,31$ exceptional widths for $n=6,\dots,16$; $t^*(6)=2^{-1/2}$, $t^*(8)\approx0.7374$, $t^*(16)\approx0.8447$.
- **Single line (Section 8).** For conjugate-symmetric probes with one forced line: exact squared gaps $c$ (paired) and $\tfrac14\bigl(1+b+c-\sqrt{(1+b+c)^2-8c}\bigr)$ (PSD) in the orthogonalised metric $\Phi_g$ (Theorem 8.18), one vector simultaneously optimal at fixed energy $0<E\le\sqrt2$ (Theorem 8.19), and a direct reconstruction with one real unknown and sharp scalar conditioning (Theorem 8.11). Block structure credited to VESPER–QUORUM; so is the cone-angle method.
- **Three-site probes (Sections 3–7).** Exact nonvanishing fibres, the two-pixel repair $|x_0+e^{i\pi/n}x_1|^2$ with maximin phase, and $\sigma_{\min}\ge4\mu/\sqrt{5n^2-4n}$ for the parity system, of optimal order.

## Technical account

**From intensities to correlations (Section 2).** Fourier-transforming the intensity array in both scan position and frequency turns it into the products $(Fd_r(x))_q\,p_r(q)$. Every zero multiplier erases one linear observation of the object's correlation diagonals; the lifted problem is to identify $xx^*$ from the observed linear functionals.

**Why real-even probes give a cross (Section 9.1).** Conjugate reflection symmetry kills odd lags at the Nyquist frequency, as in Lemma 2.2; reality makes $a_N(w)$ $N$-periodic, which kills odd frequencies at lag $N$. For the circular Gaussian each multiplier is a polynomial in $t$ with cyclotomic coefficients; its lowest-order term comes from the midpoint of the shortest arc and vanishes exactly at the forced indices, so all other multipliers are nonzero polynomials with finitely many roots.

**Classification (Section 9.3).** The erased line $q=N$ contributes the Fourier-antipodal blocks $B_t$; the line $r=N$ contributes purely imaginary time-antipodal blocks $D_t$. For a nonvanishing signal the short-probe theorem (Theorem 3.1, stated under multiplier hypotheses only) applies directly. If the signal has a zero coordinate, the corresponding row of the difference vanishes, which forces every Fourier-block coefficient at odd lags to vanish, so the difference lies in $\mathcal K_T$ and has rank two only as one $D_t$. Two-coordinate conjugate phase retrieval then gives the twin pairs.

**One scalar is enough (Sections 9.3–9.4).** A missed block would leave a rank-two kernel matrix with one positive and one negative eigenvalue, invisible to $J_g$ unless $g^*D_tg$ or $g^*B_tg$ is nonzero; conversely, symmetric kernel spectra mean that any kernel matrix with at most one negative eigenvalue is such a block, so detecting every block excludes all PSD competitors at once. The twisted geometric vector is evaluated in closed form by geometric sums in both domains.

**Certified widths (Section 9.2).** `gauss_exceptional_widths.py` builds every multiplier polynomial exactly in $\mathbb Z[\omega]$, removes the powers of $t$ and $1-t$, encloses the coefficients with 320-bit outward-rounded interval arithmetic and isolates every root in $(0,1)$ by bisection with derivative exclusion, failing on any unresolved interval; enclosures are sorted by exact endpoints and checked disjoint.

## Evidence, assurance and limitations

- **Proofs.** All theorems have written proofs; Theorem 9.2 is a computer-assisted proof using exact and interval arithmetic.
- **Supplementary checks.** `reproduce.py`: 162 short-probe and exact-doublet configurations, 17 completion and 12 perturbation-bound cases, 480 synthetic noisy reconstructions, and the figures. `global_recovery.py`: 280 lifted signal pairs, 350 parity references, 210 direct reconstructions, 210 PSD competitor checks and six convex reconstructions. `real_probe_checks.py`: 18 Gaussian probes, 228 cross-mask doublets, the kernel of the actual $n^2\times n^2$ lifted map for $n=6,8,10,12$, and chirp gains for $n=6$ to $24$.
- **Uncertified evidence.** `cross_gap_bound.py` computes the $n=6$ cross-mask stability values in floating point; only its interval check that the probe multiplier exceeds $0.0223$ at $t=3/5$ is rigorous.
- **Replay.** All five programs were rerun from fresh copies with and without Python `-O`; checks are explicit tests, not `assert`, and a deliberately corrupted formula is rejected under `-O`. GitHub CI reruns them.
- **Limits.** Idealised one-dimensional cyclic model, exactly known probe, complete data; the added measurement changes the data model; circular-distance Gaussian convention only; qualitative stability for the cross mask; synthetic data; bounded prior-art searches (1 and 4 November 2026). Review was internal and AI-assisted only.

## Who should care, and why

- **Phase-retrieval and ptychography theorists**: an exhaustive description of what symmetric probes cannot see, and a necessary-and-sufficient one-measurement repair.
- **People designing probes and reference measurements in coherent imaging**: symmetric probes leave only twin ambiguities, one designed coherent reading removes them, and the common defocus choice fails on power-of-two grids.
- **Readers of the Phasebook survey**: precise finite answers to part of its Section 8.1 question, with the credited overlap with VESPER–QUORUM made explicit.

## Why the problem matters

Real, symmetric beams are the default in practice, and their forced zeros mean that standard injectivity guarantees do not apply. Knowing exactly which objects become indistinguishable, and how little extra data restores uniqueness, turns a vague worry about "twin images" into a precise design rule for an added measurement.

## How to inspect or reproduce the recorded checks

From the unpacked archive (Python 3.12), on a copy because the programs rewrite `results/`:

```sh
cp -R symmetric_ptychography /tmp/sp && cd /tmp/sp
uv run --no-project --with-requirements requirements.txt python3 -I -B reproduce.py --output results
uv run --no-project --with-requirements requirements.txt python3 -I -B global_recovery.py
uv run --no-project --with-requirements requirements.txt python3 -I -B real_probe_checks.py
uv run --no-project --with-requirements requirements.txt python3 -I -B gauss_exceptional_widths.py
uv run --no-project --with-requirements requirements.txt python3 -I -B cross_gap_bound.py
```

The five programs take about 30 seconds in total. Add `-O` to confirm the checks still run. JSON outputs reproduce exactly apart from wall-clock timing fields.

## The most valuable next projects

1. A certified, quantitative stability constant for the real-even cross mask, first for $n=6$ and $8$, then for general $n$.
2. Sharp gap formulas and an optimal added vector for the cross mask, extending Section 8.8.
3. Exceptional widths for larger $n$ and for periodised sampled Gaussians.
4. Two-dimensional and non-cyclic versions.

## What is in the evidence package

The archive contains the manuscript (LaTeX source and PDF), the five verification and certificate programs with their JSON outputs and figures, the dated novelty report and frozen target, the bibliography with the Crossref and arXiv records it was generated from, an AI index, research-gate records, CI configuration and SHA-256 sums. Text and data are CC0-1.0 and code is MIT. This remains an unrefereed candidate.
