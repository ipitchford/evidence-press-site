## Summary

This page explains, in order: what windowed Shannon reconstruction is for, what its shape parameter does, what Kircheis, Potts and Tasche conjectured, what this release found, what that means in practice, and what has and has not been checked.

**What the method is for.** Many instruments record a continuous signal only at regularly spaced moments: an audio converter, a sensor, an MRI scanner collecting frequency data. Software then has to rebuild the signal between the samples. Shannon's sampling theorem says this is possible exactly when the signal contains no frequencies above a limit (it is *bandlimited*) and the samples are close enough together: add up copies of the wave-shaped function $\operatorname{sinc}$, one centred on each sample. In practice that sum is unusable as it stands, because the copies die away so slowly that far too many samples would be needed for good accuracy. The standard remedy is to use only the $2m$ samples nearest the point of interest and to multiply each sinc copy by a smooth *window* that fades to zero at distance $m$. The same windows are the interpolation kernels inside nonuniform fast Fourier transforms (NFFT), which are used, for example, to turn non-Cartesian MRI measurements and radio-telescope data into images (a step called *gridding*).

**What the shape parameter does.** Two windows dominate practice and theory: the *sinh-type* window and the *continuous Kaiser–Bessel* (cKB) window. Each has one tuning knob, the shape parameter $\beta$, which controls how quickly the window tapers. Accuracy also depends on *oversampling*: how much faster than strictly necessary the signal was sampled. Write $\delta<\pi$ for the signal's bandwidth on the sampling scale, so that the oversampling factor is $\sigma=\pi/\delta$, and $d=\pi-\delta$ for the spare room, the *guard band*. With twofold oversampling, $d=\pi/2$. The error falls roughly like $e^{-dm}$ as more samples are used, but only if $\beta$ is chosen well.

**What was conjectured.** Kircheis, Potts and Tasche, who developed the error theory of these windows in a series of papers from 2022 onwards, proved explicit error bounds with $\beta=dm$ and conjectured (BIT Numerical Mathematics, 2025) that this choice gives the fastest possible exponential decay of the error. Their numerical evidence came from one test signal and small $m$.

**What was found.** For the worst-case error over all signals of unit energy, the conjecture is true, and the exact law behind it is now known. Up to a polynomial factor in $m$, the error behaves like
$$
E \approx \exp\Big(-\beta+\sqrt{\max(\beta^2-d^2m^2,\,0)}\Big)
$$
for both windows and every $\beta$. Below $\beta=dm$ only the first term acts, so under-tuning loses accuracy linearly in the shortfall. Above $dm$ the square root switches on, so over-tuning loses accuracy like a square root of the excess, which is far steeper close to the optimum. The rate $e^{-dm}$ is reached if and only if $\beta/m\to d$. Three further findings sharpen the picture:

- *Exact optimality at a fixed $m$ fails.* For each finite number of samples, slightly different shapes beat $\beta=dm$: for sinh, $\sqrt{d^2m^2-1}$ is eventually better; for cKB, certified computations find better shapes a little above $dm$. The gains are modest: 0.1 to 6 per cent for sinh, and 4 to 24 per cent for cKB at $8\le m\le 32$.
- *A general error estimate needed correcting, but the published bounds hold.* A general error estimate in these papers (Theorem 3.2 of the 2022 paper, relied on in 2024, and Theorem 2.1 of the 2025 paper) leaves out *aliased* frequency bands, the copies of the signal's spectrum that sampling folds back. An explicit example, certified in exact rational arithmetic, violates it by a factor of about 3,500. This is a gap in one step of the proofs, not a new phenomenon: retaining aliases is classical. The release proves a corrected, alias-inclusive bound for a narrower class of windows that contains both sinh and cKB, and shows that the explicit error bounds published in the 2025 paper for the two windows are nevertheless true.
- *The windows are not the last word.* The best possible linear method using the same $2m$ samples has a strictly faster exponential rate, $2\log\cot(\delta/4)$ instead of $d$ (about 1.76 instead of 1.57 at twofold oversampling). Windowed sinc is simple and fast, but it leaves accuracy on the table.

**What it means in practice.** Choose $\beta\approx dm$, and if unsure, err low. Certified computations at twofold oversampling with $8\le m\le 32$ show that raising $\beta$ one unit above $dm$ multiplies the worst-case error by 10 to 670 for sinh and 3 to 220 for cKB, while lowering it by one unit costs only a factor of 2.1 to 3.1. If the bandwidth is uncertain, choose $\beta$ for the largest plausible bandwidth, which errs on the safe side.

**Status.** An anonymous, AI-assisted, unrefereed candidate. The theorems have written proofs; the finite-$m$ tables are rigorous interval-arithmetic computations. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

Setting: $f\in PW_\delta$ (spectrum in $[-\delta,\delta]$, $0<\delta<\pi$), integer samples, $(R_{\varphi,m}f)(t)=\sum_{k}f(k)\,\operatorname{sinc}(t-k)\,\varphi(t-k)$ with $\varphi$ supported on $[-m,m]$; $d=\pi-\delta$. The windows are $\varphi_{\sinh}(x)=\sinh\!\big(\beta\sqrt{1-x^2/m^2}\big)/\sinh\beta$ and $\varphi_{\mathrm{cKB}}(x)=\big(I_0(\beta\sqrt{1-x^2/m^2})-1\big)/\big(I_0(\beta)-1\big)$. $E_{W,m}(\beta)$ is the norm of $f\mapsto f-R_{\varphi,m}f$ from the $L^2$ unit ball of $PW_\delta$ to $L^\infty(\mathbb R)$. The conjectures (KPT25, arXiv:2407.16401v2, Conjectures 4.3 and 5.4) are quoted verbatim in Section 1.2 of the paper and admit three readings: worst case, per signal, finite $m$.

| Result | Status |
|---|---|
| $\log E_{W,m}(\beta)=-\beta+\sqrt{(\beta^2-d^2m^2)_+}+O_\delta(\log m)$ uniformly in $\beta>0$, with polynomial powers $(3,2)$ for sinh and $(8,3)$ for cKB; optimal exponent $d$, attained iff $\beta_m/m\to d$ (Theorem 2.1, Corollaries 2.2–2.4). Worst-case reading settled | proof |
| Sinh, $0<\beta\le dm$: $E\asymp m^{-1/2}\beta/(m\sinh\beta)$, explicit upper constant for all $m\ge2$ (Theorem 2.5) | proof |
| Same law for each $f$ with $\hat f$ of bounded variation and $\operatorname{ess\,inf}|\hat f|>0$ on $[-\delta,\delta]$, including the KPT test signal; residual-set $\liminf$ version in general (Theorem 2.6, Corollary 2.7) | proof |
| Leading constants in the sub-, critical and fixed super-critical regimes; cKB constant $\tfrac2\pi\sqrt{b\tan(\delta/2)}$ at $\beta=bm$; second-order sinh law, $\sqrt{d^2m^2-1}$ beats $dm$ eventually; family minima (Theorems 8.1, 9.1, 10.1, Proposition 8.4, Corollaries 8.2, 9.5). Finite-$m$ reading false | proof |
| KPT25v2 Theorem 2.1 omits aliased bands $j\ne0$: exact-rational counterexample, violation factor in $[3496.97,3497.01]$; with the normalisation displayed, KPT22 Theorem 3.2 by $>1.96\times10^5$ (Proposition A.1) | proof; exact certificate |
| Alias-inclusive replacement for even, continuous, $[0,1]$-valued $\varphi$, nonincreasing on $[0,\infty)$, with $\varphi,\hat\varphi\in L^1$ (narrower than the source class); explicit bounds; KPT25v2 (4.6) and (5.7) hold for all admissible $m,\delta$ (Theorems 4.1, 4.4, 2.8) | proof |
| Optimal pointwise linear recovery from the same $2m$ samples: $\limsup_m e^*_m(t)^{1/m}=\tan^2(\delta/4)$, exponent $2\log\cot(\delta/4)>d$ in the $\limsup$ sense (Theorem 2.9); whether the root converges is open | proof |
| Sup-over-phase enclosures for $m\le32$, $\delta/\pi\in\{\tfrac14,\tfrac12,\tfrac34\}$; tuning penalties; improving shapes with certified gains over $dm$ (not certified optima); $\sqrt{d^2m^2-1}$ versus $dm$ to $m=64$ (Section 12) | certified (ball arithmetic) |
| Two-term cKB law with relative oscillation $m^{-1/4}$ (Conjecture 9.7); onset law $(\log m)^2/(8dm)$ for the best cKB shape | conjecture; heuristic |

## Technical account

**Why the profile appears.** Write $g=\widehat{\operatorname{sinc}\cdot\varphi}$. The error is produced by *aliases*: shifted by multiples of $2\pi$, $g$ leaks into the signal band, and every leak comes from a frequency $|\tau|\ge d$ (Lemma 3.1 gives the exact alias identity $A(t,\omega)=1-\sum_j H(\omega+2\pi j)e^{2\pi i jt}$). The transform of either window behaves like $e^{-\beta+\sqrt{\beta^2-m^2\tau^2}}$ for $|\tau|<\beta/m$ (a hyperbolic, exponentially large region) and is oscillatory of size $e^{-\beta}$ beyond $\beta/m$. If $\beta\le dm$, every alias lies in the oscillatory region and the error is of size $e^{-\beta}$, so increasing $\beta$ helps. If $\beta>dm$, the first alias reaches into the hyperbolic region at $|\tau|=d$, where the transform is $e^{-\beta+\sqrt{\beta^2-d^2m^2}}$, so increasing $\beta$ further hurts. The proofs make this picture exact and uniform in $\beta$.

**Lower bounds.** Averaging the squared error over the evaluation phase $t$ (Parseval in $t$) gives $E^2\ge\frac1{2\pi}\int_{-\delta}^{\delta}\big(|1-H_0|^2+\sum_{j\ne0}|H_j|^2\big)\,d\omega$, so a single alias already bounds the error from below. Section 5 extracts matching lower bounds from one well-chosen alias in each regime, including the transition $\beta\approx dm$ and the extremes $\beta\to0$ and $\beta\gg m^2$.

**The alias gap.** The general estimate in the source bounds the error by the central band alone, $|1-H_0|$, plus a truncation term. The alias identity shows that $\sum_{j\ne0}|H_j|$ is missing. Appendix A builds a continuous, even, monotone window with $H(0)=1$, so that the central defect is tiny, while the phase-$\tfrac12$ sample sum has a substantial alias defect; the comparison is certified in exact rational interval arithmetic. The corrected Theorem 4.1 bounds the error by $|1-H_0|+\sum_{j\ne0}|H_j|$, and the explicit window bounds of Theorem 4.4 then imply the source's published inequalities (4.6) and (5.7), so those survive.

**Optimal recovery.** Splitting into even and odd parts reduces pointwise linear recovery from the $2m$ samples to weighted polynomial approximation on the interval $[\cos\delta,1]$ of a function with a singularity at $-1$. Bernstein's theorem then gives the ellipse parameter $\cot^2(\delta/4)$, hence the root-$\limsup$ rate $\tan^2(\delta/4)$.

**What is classical.** Regularised Shannon sampling and the explicit upper bounds at $\beta=dm$ (Kircheis, Potts and Tasche, 2022–2025; Gaussian analogues by Qian, Creamer, Lin, Zhang and Chen), the windows and their NFFT use (Kaiser; Knab; Jackson et al.; Fessler and Sutton; Fourmont; Beatty et al.; Barnett et al.), phase averaging and alias identities, and Bernstein's theorem on analytic approximation are credited. The matching lower bounds, the two-sided law uniform in $\beta$, the per-signal law, the constants, the location of the alias omission with its counterexample and repair, the optimal-recovery comparison and the certified tables are claimed as new within a bounded literature search, which does not establish historical priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/sharp-shannon-window-law.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary listed above has a written proof in the manuscript; the exact-constant proofs are in Appendix D. No proof assistant was used.
- **Certified computation.** Sup-over-phase error enclosures use ball arithmetic (Arb, through python-flint) with a Taylor–Gram method, a Cauchy remainder and an explicit bound near the sinh branch point; ratios are quotients of enclosures. The counterexample uses exact rational interval arithmetic with the standard library only. Best shapes come from a scan and are not certified optima; only their gains over $dm$ are certified.
- **Replay.** `verify_all.py` reruns every script in a temporary directory and compares all 18 outputs byte for byte. This passed in a clean replay from a separate copy of the package and again on the release repository; the fast items and the negative controls were replayed on the frozen release archive and in continuous integration.
- **Negative controls.** Three semantic corruptions of the exact certificate (a sign error in the alias sum, a wrong bandwidth, a wrong value of $\pi$) are rejected, and tampered inputs, outputs and files are detected.
- **Review.** Internal AI-assisted review in several roles; a verification re-review that recomputed 30 certified table entries, the counterexample and the optimal-recovery values with its own engine; an adversarial review by a different AI model (OpenAI gpt-5.6-sol); and two targeted audits of the four proofs that the adversarial review had found incomplete. No mathematical error was found in the final version. The main objections (which reading of the conjecture was meant, four proofs that were outlines, a root-$\limsup$ described as a limit, a replacement theorem with stronger hypotheses than the original, scanned shapes described as optima) were resolved; a rating-free summary is in the package. This is not peer review, and the recomputations are not independent reproduction.
- **Limitations.** No rate is proved for the cKB constant, whose convergence is slow and oscillating; Conjecture 9.7 and the onset law are unproved. The thresholds in Theorem 2.1 and Corollary 8.2 are not effective for all $m$. The results assume exact, noiseless samples at a fixed bandwidth and say nothing about floating-point error, bandwidths that vary with $m$, nonuniform grids or the deconvolved NFFT error. Pinpoint references to the source use the numbering of arXiv:2407.16401v2.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Users of NFFT, gridding and windowed-sinc interpolation (MRI, radio astronomy, signal processing) | A proved reason to tie $\beta$ to $dm$, certified tuning penalties showing over-tuning is the costly mistake, and double-precision sizing advice | Results concern the reconstruction formula with exact samples; the deconvolved NFFT error and floating-point effects are not covered |
| Approximation and sampling theorists | A sharp two-sided law uniform in $\beta$, exact constants, an optimal-recovery comparison, and open problems (cKB rate, optimal windows) | The cKB constant has no proved rate; the per-signal law needs bounded variation |
| Authors and readers of the regularised-sampling literature | The location of the alias omission in the general estimate, a certified counterexample, a corrected bound, and confirmation that the published explicit window bounds hold | The corrected general bound covers a narrower window class than the original theorem |
| Research agents and verification practitioners | Deterministic certified tables with byte-identical replay and negative controls | Byte identity shows integrity, not that the code implements the definitions; the internal recomputation carries that weight |

## Why the problem matters

Windowed sinc kernels sit inside widely used software for imaging and signal processing, and their shape parameters are usually set by rules of thumb or empirical tuning. A proved, two-sided law tells practitioners which direction of error is cheap and which is expensive, and it turns the Kircheis–Potts–Tasche conjecture from numerical evidence into a theorem about the worst case. The release also shows how a general error estimate can lose a term without making its downstream explicit bounds false, which matters for anyone citing those bounds. Finally, the gap between the windows' rate $d$ and the optimal-recovery rate $2\log\cot(\delta/4)$ identifies how much accuracy is left on the table by convolution-type reconstruction.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.13 and the pins in `requirements.txt` (python-flint, mpmath, numpy, matplotlib):

```sh
python -B -O verify_all.py --skip-slow       # counterexample, consistency checks, tables, figures: under a minute
python -B -O verify_all.py --jobs 4          # all 18 outputs, including the certified tables
python -B -O negative_controls.py            # corrupted certificates and inputs are rejected
python3 -S -O -B correction_counterexample.py  # the exact counterexample, standard library only
```

To understand the mathematics, start with Section 1.3 of the paper ("the result in words") and Figure 1; practitioners can go straight to Section 13. `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Prove Conjecture 9.7, or at least an $O(m^{-1/4})$ rate for the cKB constant.
2. Decide whether $d$ is the best exponent among all windows supported on $[-m,m]$, and whether the optimal-recovery root converges.
3. Make the thresholds effective for all $m$ and find the exact polynomial order across the transition $\beta\approx dm$.
4. Extend the law to noisy samples, finite precision, bandwidths that vary with $m$, and the deconvolved NFFT error.

## What is in the evidence package

The 45-page manuscript (PDF and LaTeX source, generated tables and figures), the certified sup-norm engine and table driver, the exact rational counterexample, the optimal-recovery and cKB studies, consistency checks, JSON outputs that record the hashes of the scripts producing them, the one-command replay, semantic negative controls, a novelty statement and source map, a rating-free summary of the internal review, claim, status, assurance, provenance and replay records, an agent index, licences (CC0-1.0 for prose, manuscript and data; MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
