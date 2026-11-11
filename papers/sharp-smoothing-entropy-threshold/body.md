## Summary

**In one sentence.** Mix two noisy copies of a symmetric signal that is very close to Gaussian: the entropy of the blend is a concave function of the mixing weight exactly when the signal carries at most four sevenths of the variance, and this release proves the endpoint, four sevenths itself; with three or more copies, concavity over all weightings fails at every signal fraction.

**The question.** Take two independent random quantities with the same symmetric distribution, add them with a slider $t$ that decides how much each contributes (weights $\sqrt t$ and $\sqrt{1-t}$), and add ordinary Gaussian noise. Entropy measures how unpredictable the total is. As the slider moves from one end to the other, does the entropy follow a curve that only bends downwards, with no dip in the middle? That property is *concavity*. The answer depends on one number, the **signal fraction** $q$: the share of the total variance that comes from the two inputs rather than from the noise. In a communication reading, two users send signals with received powers $qt$ and $q(1-t)$ through noise of power $1-q$, and concavity says that their total rate is a concave function of how the power is split.

**What was known.** Without noise, Ball, Nayar and Tkocz conjectured concavity for log-concave inputs (2016). Luo (2026) disproved this: for symmetric inputs arbitrarily close to the Gaussian, concavity fails whenever $q>4/7$. Schubr (2026) proved that near the Gaussian it holds for $q<1/2$, and the earlier Evidence Press release [*The critical signal fraction for local entropy concavity*](/releases/entropy-concavity-four-sevenths/) proved it for every $q<4/7$. That release left $q=4/7$ as its first open problem.

**What was found.** This release extends that one and settles the endpoint. Near the Gaussian, two-copy entropy is concave for every $q\le4/7$, with one neighbourhood that serves the whole range (Theorem C). So the set of signal fractions with local concavity is exactly $(0,4/7]$: a total signal-to-noise ratio of $q/(1-q)=4/3$. The tool behind it is a sharp inequality about how Gaussian smoothing acts on bounded functions (Theorem A). With three or more copies, concavity on the whole range of weights fails at every signal fraction (Theorem E and Corollary E′).

**Results at a glance.** "Yes" means there is a fixed neighbourhood of the Gaussian in which every symmetric input gives a concave entropy; "no" means that arbitrarily close to the Gaussian some symmetric input breaks concavity.

| Copies | Signal fraction $q$ | Concave near the Gaussian? | Where it is proved |
|---|---|---|---|
| two | below $1/2$ | yes | Schubr (2026); re-proved here (Theorem C) |
| two | from $1/2$ to just below $4/7$ | yes | the earlier Evidence Press release; re-proved here (Theorem C) |
| two | exactly $4/7$ | **yes** | **new (Theorem C)** |
| two | above $4/7$, up to $1$ | no | Luo (2026); his proof is written out as Theorem D |
| three or more | up to $4/7$ | no; the failures found occur when one copy carries almost all the weight | **new (Theorem E)** |
| three or more | above $4/7$, up to $1$ | no | Luo's theorem applied to two of the copies (Corollary E′) |

**How large the effects are.** Tiny. "Very close to Gaussian" is meant literally: the neighbourhood proved here lets the input density differ from the Gaussian density by a factor of at most $1\pm10^{-8}$. On the other side, the largest computed entropy change that signals a failure is about $6\times10^{-8}$ nats, and near four sevenths the changes are far below what double-precision arithmetic resolves. No sampled data or engineering measurement could detect either side of the threshold. The interest is structural, not design guidance about signal-to-noise ratios.

**Symmetry matters.** For inputs that are not symmetric, concavity fails near the Gaussian at every signal fraction (Luo 2026). Everything said here about four sevenths concerns symmetric inputs.

## Summary for specialists

Let $X,Y$ be i.i.d. with even density $f=\varphi(1+g)$, mean 0 and variance 1, $G$ standard Gaussian, and $F_{q,f}(t)=h\big(\sqrt{qt}\,X+\sqrt{q(1-t)}\,Y+\sqrt{1-q}\,G\big)$. Call $g$ *admissible* if it is real, even and bounded with $\int g\varphi=\int x^2g\varphi=0$, and let $\mathcal C$ be the set of $q\in(0,1]$ for which some $\delta>0$ makes $F_{q,\varphi(1+g)}$ concave for every admissible $g$ with $\|g\|_\infty\le\delta$. Write $T_\rho$ for the Ornstein–Uhlenbeck operator, $N$ for the number operator, $\lambda_r=r/(1+\sqrt{1-r^2})$, $a_r=(1-r^2)^{-1/2}$, $\tau_r(s)=\frac{1-a_r(1-s)}{1+a_r(1-s)}$ and $b(r)=\sqrt{2r(1+r)}-r$.

- **Theorem A** *(proof)*: for $0<r<s<1$ and every bounded $g$, $\|T_{\sqrt s}g\|_2^2\le C\,\|g\|_\infty^{2-E}\,\|T_{\sqrt r}g\|_2^{E}$ with $E(r,s)=2\log\tau_r(s)/\log\lambda_r$; $E$ decreases from 2 to 0, $E\ge1$ iff $s\le b(r)$, the exponent is optimal, and at $s=b(r)$ the linear inequality holds with a gain $\big(1+\log(\|g\|_\infty/\|T_{\sqrt r}g\|_2)\big)^{-1/4}$. **Theorem B** is a weighted form at $s=b(r)$.
- **Theorem C** *(proof)*: there is $\delta_*>0$ such that for every $q\in(0,4/7]$, every admissible $g$ with $\|g\|_\infty\le\delta_*$ and every $t\in[0,1]$, $F''(t)\le-\tfrac1{16}\big\|N\big(T_{\sqrt{qt}}g+T_{\sqrt{q(1-t)}}g\big)\big\|_2^2$; $\delta_*=10^{-8}$ is admissible (Proposition 6.6).
- **Theorem D** *(Luo's theorem and Luo's proof, written out)*: for $q\in(4/7,1]$ there are arbitrarily small smooth admissible $g$ with $\varphi(1+g)$ strongly log-concave and $F(t_0)>F(\tfrac12)$ for some $t_0$.
- **Corollary** *(proof)*: $\mathcal C=(0,4/7]$, in the relative supremum norm and in every relative $C^m_b$ norm; this also answers Luo's Problem 10.2 negatively for every $q\le4/7$.
- **Theorem E** *(proof)*: for $k\ge3$ copies and every $q\in(0,1)$ there are smooth admissible $g$ of arbitrarily small supremum, with $\varphi(1+g)$ strongly log-concave, for which $F$ is strictly convex on the segment $(\varepsilon+\tau,\varepsilon-\tau,1-2\varepsilon,0,\dots)$, $|\tau|\le\varepsilon$, for all small $\varepsilon$. For every admissible $g$ with $\|g\|_\infty\le\frac1{12}$ the second derivative along that segment tends to $-4\hat h_4\mathcal K_4(h)$, $h=T_{\sqrt q}g$, as $\varepsilon\to0$.
- **Corollary E′** *(proof)*: for every $k\ge3$ no $q\in(0,1]$ gives local concavity on the whole simplex.
- **Proposition F**: the best constant in Theorem A at $s=b(r)$ is not one; for small $r$ it exceeds $1.48$ *(computed with $\pm1$ sign-polynomial test functions)*.

## Technical account

**Why four sevenths.** The output density is $\varphi(1+L_t+M_t)$ with $L_t$ linear and $M_t$ quadratic in $g$, and to leading order the entropy is $h(\varphi)-\frac12\|L_t+M_t\|_2^2$. The linear term multiplies the degree-$n$ Hermite coefficient by $q^{n/2}(t^{n/2}+(1-t)^{n/2})$, a convex function of $t$, so it pushes towards concavity; at the even blend it sees $g$ smoothed at level $r=q/2$. The quadratic term can push the other way and sees $g$ smoothed at level $s=q$. Concavity near the Gaussian therefore needs an inequality of Theorem A's form with $r=q/2$, $s=q$ and exponent at least one, that is $q\le b(q/2)$, which is exactly $q\le4/7$. For square-integrable $g$ the best available exponent would stop at $q\le1/2$; boundedness is what moves the threshold out to $4/7$, because bounded functions cannot concentrate on one Hermite degree.

**Proof of Theorem A.** For the level $r$ there is one harmonic oscillator whose eigenfunctions $h_k$ diagonalise $g\mapsto\|T_{\sqrt r}g\|_2^2$, with eigenvalues proportional to $\lambda_r^k$ (Luo's oscillator basis). The coefficient $c_k$ of a bounded $g$ on $h_k$ is controlled in two ways, by $k^{1/4}\|g\|_\infty$ and by $\lambda_r^{-k/2}\|T_{\sqrt r}g\|_2$, and an exact formula gives $\|T_{\sqrt s}h_k\|_2\lesssim k^{-1/4}\tau_r(s)^{k/2}$. Summing over $k$ with the first bound for large $k$ and the second for small $k$ is Hölder interpolation in the oscillator's time variable; at the critical level the two geometric rates match, and the oscillator functions themselves show the exponent cannot be improved.

**Why the endpoint was hard before.** The earlier release adapted Luo's Gaussian-kernel comparison to bounded functions with a weight that consumed a strict margin, and differentiated $M_t$ by a Cauchy estimate on a disc whose radius vanishes at $q=4/7$. Here two short coefficient estimates for $M_t$, valid for all $t\in[0,1]$, and Theorem B replace both, so no margin is needed and one radius serves every $q\le4/7$. The assembly follows Schubr's entropy–energy scheme.

**Three copies.** With three copies one can hold a heavy copy fixed and move weight between two light ones. The linear curvature in that direction is tiny, while the heavy copy acts as non-Gaussian noise; the entropy then depends on the light part through its fourth cumulant, a convex function of the split. Choosing the sign of the input's fourth cumulant against an explicit pairing breaks concavity at every $q\in(0,1)$. This is the mechanism Madiman, Nayar and Tkocz found for many summands without noise; its criterion is Abu-Ajamieh's endpoint sign condition, read at a face of the simplex where his restoring term is absent.

**Classical and new.** Inherited and cited: Luo's critical level, oscillator basis and Theorem D; Schubr's scheme for Section 6; the obstruction of Madiman, Nayar and Tkocz; Abu-Ajamieh's sign condition. New within the priority search reported in the paper (Appendix C): the supremum-norm inequality at the critical level and the sharp exponent for all pairs (Theorems A and B), membership of $4/7$ with one radius (Theorem C), and three summands with noise and the face limit (Theorem E), whose new range is $q\le4/7$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/sharp-smoothing-entropy-threshold.txt) is available for reading.

- **Proofs.** Every theorem has a written analytic proof in the 51-page paper. Appendix B lists the analytic steps that no computation can test, as the place for a checking reader to start. No proof assistant was used.
- **Computational checks.** Eleven check scripts test every ingredient and each final statement: closed forms against direct quadrature or 50 to 90-digit Hermite series; the explicit radius $10^{-8}$ and every rounded constant in its proof; Theorem A on 278 bounded test functions at each of 11 pairs of levels and on 759 more, with gradient ascent, at $(2/7,4/7)$ (largest ratio $1.000$); the entropy curvature at $q=4/7$ in 192 cases; Luo's construction above $4/7$; and the three-copy face limit, stable under a refinement of all numerical parameters. Each script exits with an error if any check fails, including under Python's optimised mode.
- **A test that can fail.** A positive control computes the midpoint curvature with exact 90-digit inputs on Luo's test functions: it is clearly negative at $q=4/7$ (at or below $-0.93$ in normalised units, for levels up to 80) and it turns positive at $q=0.8$ (all levels tested) and at $q=0.7$ (levels 40, 50 and 80), where concavity must fail.
- **Replay.** `run_all.sh` was rerun from two fresh copies of the package, normally and with `PYTHONOPTIMIZE=1`; every JSON output, log and figure was byte-identical to the shipped files. GitHub CI reruns every script on Linux.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round with extensions (Corollary E′, the $C^m_b$ robustness of the threshold, the positive control, the noise-stability baseline, the best-constant remark); a re-review, a proof audit and a second adversarial audit found no error in any theorem. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The results are local and the effects minute. They concern symmetric inputs only. The proved radius is $10^{-8}$; a larger indicative value from truncated sums ($1.5\times10^{-3}$) is not certified. The three-copy failures lie within a distance of a face of the weight simplex that shrinks with the size of the perturbation; concavity on a fixed interior region, and for inputs matching the Gaussian fourth moment, is open. Theorem D is Luo's. The computations are finite-precision diagnostics, not interval certificates, and no computation is part of a proof. The four 2026 sources the paper builds on are themselves unrefereed.

## Relationship to earlier work

This release extends the Evidence Press release [*The critical signal fraction for local entropy concavity*](/releases/entropy-concavity-four-sevenths/) (3 November 2026), which proved $(0,4/7)\subseteq\mathcal C$ with a radius that shrinks to zero at $4/7$, showed that its smoothing inequality fails beyond the critical level, and listed $q=4/7$ and three or more copies as open problems. This release answers both: $4/7\in\mathcal C$ with one radius for the whole range, and for three or more copies there is no signal fraction with local concavity on the whole simplex. It re-proves the earlier range by a shorter route, without the earlier release's weighted kernel comparison or complex-disc estimates.

Ball, Nayar and Tkocz (2016) posed the conjecture; Eskenazis and Gavalakis (2024) proved it for Gaussian mixtures. Luo (2026) refuted it, found the critical level $b(r)$ in the square-integrable setting and posed Problems 10.1 and 10.2. Schubr (2026) proved local concavity below one half by the scheme reused in Section 6. Madiman, Nayar and Tkocz (2020) found the fourth-cumulant obstruction behind Theorem E, and Abu-Ajamieh (2026) the endpoint identity whose sign condition is its criterion.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on entropy inequalities | The exact local threshold for two copies, the negative answer for three, and the mechanism on both sides | Local results; interior concavity for three copies and the global problem remain open |
| Analysts of Gaussian smoothing and noise stability | A sharp exponent for comparing the noise stability of a bounded function at two correlations, with the critical case and its logarithmic gain | The best constant is not known; higher dimensions are only sketched |
| Information theorists | An exact signal-to-noise ratio, $4/3$, for when near-Gaussian symmetric inputs keep the sum-rate of a two-user Gaussian channel concave in the power split | Effects are minute; this is a structural statement, not design guidance |
| Research agents | Machine-readable claims, an agent index, and scripts that rerun in a few minutes and compare outputs byte for byte | The computations corroborate; the theorems rest on the written proofs |

## Why the problem matters

Entropy along weighted sums sits behind the entropy power inequality and the entropic central limit theorem, and concavity in the weights is a natural strengthening that turned out to be false. Once Luo refuted the clean conjecture, the useful question became where exactly it survives. For two copies near the Gaussian this release gives the complete answer, closes the endpoint left by the earlier release, and identifies the governing object: a sharp smoothing inequality for bounded functions, whose critical level produces $4/7$. For three or more copies it shows that the answer is different in kind, which redirects the question to interior regions of the weight simplex.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root, with [uv](https://docs.astral.sh/uv/):

```sh
shasum -a 256 -c MANIFEST.sha256
PYTHONDONTWRITEBYTECODE=1 uv run --no-project --python 3.13 --with numpy==2.5.3 --with scipy==1.18.1 \
    --with mpmath==1.4.1 --with matplotlib==3.11.2 sh run_all.sh fresh_output
```

Each script prints `ALL OK` only if every check passes, and the run ends with `ALL REPRODUCED` when every regenerated JSON file is identical to the shipped one (on other platforms or library versions last digits can differ). Section 8 and Appendix A of the paper say what each script tests and what it cannot show. `AI_INDEX.md` maps each claim to its proof and scripts, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Three copies away from the faces: is there, for fixed $\eta>0$ and some $q$, a neighbourhood of the Gaussian in which concavity holds on $\{\min_it_i\ge\eta\}$? And do inputs that match the Gaussian fourth moment fail too?
2. The global problem: which $q\le4/7$, if any, give concavity for every symmetric log-concave input (Luo's Problem 10.1)?
3. The best constant in Theorem A at the critical level: is it bounded as $r\to0$, and is the exponent $\frac14$ of the logarithmic gain optimal?
4. Higher dimensions: does the linear inequality hold at the critical level for $d\ge2$, and is $(0,4/7]$ the $d$-dimensional local-concavity set?
5. The true size of the neighbourhood: certify a radius larger than $10^{-8}$, for example with interval arithmetic on the level sums.

## What is in the evidence package

The paper (PDF and Markdown source) with its three figures; eleven check scripts plus a comparison script and a figure script in `code/`; the outputs of one complete run in `results/`; `run_all.sh`, which reruns everything into a fresh directory and compares the outputs; `ENVIRONMENT.txt` with the software versions; `REPLAY_RECEIPT.md`; `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and `MANIFEST.sha256`.
