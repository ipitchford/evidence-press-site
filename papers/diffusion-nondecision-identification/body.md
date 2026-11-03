## Summary

*How to read this page.* The Summary is in plain English and is enough for most readers. Specialists can jump to the exact statement in the next section, and the Technical account explains how the proofs work. Evidence, limitations and the route to rerun the checks follow.

**The setting.** In a two-choice task, researchers record which button was pressed and how long it took. The *diffusion model* is the standard account of such data. It treats a decision as noisy evidence that wanders, with an average drift, from a starting point until it reaches one of two boundaries, one for each response. Wide boundaries mean caution; a strong drift means easy evidence; a starting point nearer one boundary means a bias towards that response.

**Decision and nondecision time.** The time the evidence takes to reach a boundary is the *decision time*. Everything else (seeing the stimulus, preparing and making the movement) is lumped into the *nondecision time*. The observed response time is the sum of the two.

**Why separate them.** The two parts mean different things about the mind. A slower group or condition might be deciding more slowly, or perceiving and moving more slowly, and many studies draw their conclusions from exactly this split.

**What D\*M does, and what it assumed.** Most fitting methods assume a shape for the nondecision time, often a fixed delay plus a uniform spread. The D\*M method of Verdonck and Tuerlinckx (2016), available in the DstarM software, avoids any such assumption. If every condition and response shares the same unknown delay distribution, suitable cross-combinations of the observed distributions cancel it out, leaving only the decision model. But do the remaining equations pin down the decision process uniquely? Their Appendix A assumes so, as a uniqueness (injectivity) premise, without saying when it holds.

**The answer.** This paper settles the question for the diffusion model with fixed boundaries, drift and starting point in each condition, and one nondecision distribution independent of the decision and shared by all conditions and responses. Everything, including the whole nondecision distribution, is determined by the data *if and only if* the response-time distributions for each response are not all identical (Theorem 1). These are the distributions of times given the response, with the response proportions removed.

**What this means for experimental design.**

1. One condition with a biased starting point (for example from unequal base rates or payoffs) is enough.
2. Two unbiased conditions are enough if they differ in boundary separation (caution) or in drift strength, provided they share the nondecision distribution.
3. The common design never works: an unbiased start, one boundary setting, and two stimuli with drifts $+v$ and $-v$, equally strong evidence in opposite directions. All four response-time distributions are then identical.

**A concrete example.** Take one unbiased condition. In *story 1* each boundary sits at distance $h=0.6$ from the start, the dimensionless drift is $c=vh=0.5$, and every response includes a fixed 0.25 s delay. *Story 2* halves the distance ($h=0.3$), doubles the drift so that $c$ is unchanged, and adds a particular random extra delay to the 0.25 s.

| Quantity | Story 1 | Story 2 |
|:---|---:|---:|
| Distance to each boundary, $h$ | 0.600 | 0.300 |
| Probability of the upper response | 0.731 | 0.731 |
| Mean decision time | 0.333 s | 0.083 s |
| Mean nondecision time | 0.250 s | 0.500 s |
| Mean response time | 0.583 s | 0.583 s |

The two stories disagree fourfold about how long deciding takes, yet they predict *exactly* the same joint distribution of responses and response times, not just the same means. No number of trials from this condition can tell them apart. (With unit diffusion coefficient and time in seconds, $h$ is measured in $\sqrt{\mathrm{s}}$, not seconds; $h=0.6$ corresponds to a boundary separation $a=0.12$ in the Ratcliff convention.)

**Warnings.**

- *Identification can be very weak.* Two unbiased conditions whose response log-odds differ by $2\varepsilon$ need more than $1/(4\varepsilon^2)$ trials per condition before any method can reliably tell a large boundary from a small one (Theorem 4).
- *A wide delay spread defeats uniform estimation,* even in designs far from the failing ones (Proposition 1).
- *Response-specific delays.* If motor time differs between the two responses, for example between hands, no single condition ever suffices, biased or not (Proposition 2).
- *The sharing assumption is fragile.* Changing stimulus strength is known from Piéron's law to change sensory latency, and speed–accuracy instructions may change motor readiness. Both can change the nondecision time that Design rule 2 needs to be shared.
- *Misreading variability.* Trial-to-trial variability in drift or starting point makes errors slower or faster than correct responses, and a fixed-parameter fit can mistake this for a biased start.

## Summary for specialists

Within condition $j$, $X_j(t)=z_j+v_jt+W(t)$ on $(0,A_j)$ with unit diffusion coefficient, exit time $T_j$ and response $J_j\in\{-,+\}$. One observes $(J_j,R_j)$ with $R_j=T_j+N_j$, where $N_j\sim G$ is independent of $(T_j,J_j)$ and $G$ is common to all conditions and responses, with no density, moment, support or family assumption. In a centred condition write $h=A/2$ and $c=vh$; the decision-time transform is

$$
D_{h,c}(s)=\frac{\cosh c}{\cosh\sqrt{c^2+2h^2s}}.
$$

**Theorem 1.** The following are equivalent: (1) $\theta=((A_j,z_j,v_j)_j,G)$ is globally identifiable; (2) some $z_j\ne A_j/2$, or all starts are centred and at least two pairs $(A_j,|v_j|)$ differ; (3) the conditional laws $\mathcal L(R_j\mid J_j=r)$ over all $j$ and $r$ are not all identical. When they fail, every point has a continuum of observationally equivalent points with arbitrarily small decision-time scale.

| Result | Content |
|---|---|
| Lemma 1 | One noncentral condition identifies $A,z,v,G$ by explicit inversion of $F_+/F_-$ |
| Lemma 2 | Ratio injectivity: centred conditions with different $(h,\lvert c\rvert)$ identify the scales |
| Lemma 3 | For $0<b<h$: $D_{h,c}=D_{b,c}\cdot\mathbb E[e^{-sZ}]$ for some $Z\ge0$ |
| Theorem 2 | Identified set $(0,b_{\max}]$ with bounds (24)–(25) |
| Corollary 1 | Lower-tail condition (27) restores identification in one centred condition |
| Corollary 2 | Constant-boundary case of the Fudenberg et al. (2020) conjecture |
| Theorem 3 | No uniformly consistent estimator over the identifiable class |
| Proposition 1 | Unbounded delay spread prevents uniform recovery inside class (27) |
| Theorem 4 | Fewer than $1/(4\varepsilon^2)$ trials per condition: error probability $\ge1/4$ |
| Proposition 2 | Response-specific delays: one condition never suffices |
| Remark 3 | Start-perturbation analogue of Theorem 4: a conjecture, not proved |

**Theorem 2 and Corollary 1.** In the exceptional case, with $L$ the common observed transform, a candidate half-width $b$ is feasible exactly when $g_b=L/D_{b,c}$ is completely monotone; the feasible set is $(0,b_{\max}]$, each feasible $b$ fixes a unique delay law, and with $d_0=\operatorname{ess\,inf}R$,

$$
h\le b_{\max}\le\beta(s)=\frac{\log(2\cosh c)-\log L(s)-d_0s}{\sqrt{2s}}\quad\text{for every }s>0.
\tag{25}
$$

If admissible delays satisfy $-\log\mathbb E[e^{-s(N-d_0)}]=o(\sqrt s)$ (atoms at the minimum, shifted uniform, gamma and lognormal laws), then $h=b_{\max}=\lim\beta(s)$ and one centred condition identifies $h$, $c$ and $G$. In the worked example $\beta(s)$ decreases to 0.6, so $b_{\max}=h$.

**Corollary 2.** For an unbiased constant boundary $b$, one choice problem (or several with equal $|\delta_k|$) is not identified among all delay laws, but is within class (27); two problems with $|\delta_k|\ne|\delta_l|$ identify $b$, every $\delta_k$ and $G$.

**Theorem 4.** With two centred conditions with drifts $c$ and $c+\varepsilon$ and $n$ trials each, every estimator satisfies $\max_iP_i(|\widehat A-A_i|\ge\tfrac23(h-b))\ge(1-\varepsilon\sqrt n)/2$, so at least $1/4$ when $n\varepsilon^2\le1/4$. No matching upper rate is claimed.

## Technical account

**Transforms and cancellation.** Each observed defective transform is the delay transform times a decision transform, so the delay cancels from ratios: $F_+(s)/F_-(s)$ depends only on $(A,z,v)$. This is the transform form of the D\*M principle.

**A biased start (Lemma 1).** As $s\to\infty$, $\log(F_+/F_-)=(2z-A)\sqrt{2s}+vA+o(1)$, so the leading coefficients recover $2z-A$ and $vA$, and further terms recover the rest, by explicit formulae. Dividing an observed transform by the now-known decision transform gives the delay distribution itself. By analyticity (Remark 2), the transforms on any interval suffice, so identification does not formally depend on the fastest responses.

**Unbiased starts (Lemma 2).** A centred condition reveals $c$, half the log-odds of the upper response, but not $h$. Matching the coefficients of the large-$s$ expansion of $\log D_{h,c}$ across conditions shows that ratios fix every $h_j$, unless all $h_j$ and all $c_j^2$ coincide. One unbiased condition is therefore never enough.

**The equivalent stories (Lemma 3).** A centred decision time is a sum of infinitely many independent exponential stages (Ciesielski and Taylor, 1962; Kent, 1980). Shrinking the boundary removes part of every stage, and the removed parts form a genuine extra delay $Z$. For zero drift there is a one-line reason: to leave $(-h,h)$, Brownian motion must first leave $(-b,b)$ and then travel on. For nonzero drift the paper uses Brownian scaling and self-decomposability. So the injectivity premise of Verdonck and Tuerlinckx fails exactly on the exceptional set (Lemma 3) and holds everywhere else (Lemmas 1–2).

**Estimation limits.** Theorem 3 perturbs the starts of two equivalent centred stories, a classical pattern (Bahadur and Savage, 1956; Dufour, 1997; Pötscher, 2002). Proposition 1 couples $(A,z,v)=(1,1/4,0)$ and $(2,1/2,0)$ with delays uniform on $[0,M]$, at total variation at most $9/(16M)$. Theorem 4 uses a Girsanov change of measure to give $H^2\le\varepsilon^2/8$ per trial, whatever the boundary. Proposition 2 hides each triple's conditional decision-time laws inside the other's response-specific delays.

**Classical and new.** Laplace transforms, Brownian first-exit formulae, self-decomposability, Bernstein's theorem and two-point testing bounds are classical, and the necessity direction of Theorem 1 is the mechanism already named in Appendix A of Verdonck and Tuerlinckx (2016). New, as far as a bounded literature search found, are the explicit inversion of Lemma 1, the injectivity argument of Lemma 2, the exact classification, the complete identified set of Theorem 2 with the attained bound (25), Theorem 4, Propositions 1–2, Corollary 2 and the design consequences. A bounded search cannot establish priority. The paper also corrects one practical reading: the equal-distribution case is not merely theoretical, as van den Bergh et al. (2019) suggested, because the standard $\pm v$ design falls exactly into it, and a check on unnormalised densities would wrongly suggest identification.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/diffusion-nondecision-identification.txt) is available for reading.

- **Proofs.** Every lemma, theorem, corollary and proposition has a written proof in the 25-page paper. Remark 3 is stated as a conjecture.
- **Numerical checks.** One script runs 25 checks: 23 deterministic and Monte Carlo checks, plus two reproducibility checks of the recovery study. For example, Lemma 1 inverts 150 random biased triples with maximum error $2.79\times10^{-9}$, and 200,000 simulated story-2 response times match the exact story-1 transform at six frequencies. Every failure exits with an error, also under Python's `-O` flag.
- **Replay.** `verify_and_simulate.py --reps 40` was rerun from a fresh copy of the package with Python `-I -B` and with `-O` (Python 3.12.11, NumPy 2.3.5, SciPy 1.17.0, Matplotlib 3.10.8). All 25 checks passed in both modes, and the raw results were identical to the shipped CSV on this machine. `summarise_simulation.py` reproduced the Monte Carlo summaries. GitHub CI on Linux passed the blocking checks job and the full study against the stored reference within $10^{-4}$. Results reproduce to a tolerance, not bit for bit across linear-algebra libraries.
- **Simulation.** 40 synthetic datasets for each of five scenarios, at 1,500 and 6,000 trials per condition. Strong contrasts recovered the boundary distance well for three delay shapes (RMSE 0.024–0.037 at 6,000 trials, true value 0.6); a weak contrast did not (RMSE 0.367); adding 0.04 s to one condition's delay gave errors that did not shrink with more trials. This is an illustration with one estimator on synthetic data, not a validated method.
- **Review.** Internal AI-assisted review only: five reviewer roles, a separate-model adversarial review, one revision round, a proof audit of every new or rewritten proof, a re-review and a second audit of the new proofs by the different model. No reviewer found a correctness error in the original proofs. One minor gap in a step of the new Theorem 4 proof was repaired, with the theorem and constants unchanged. None of this is human peer review, independent reproduction or formal verification.
- **What is not covered.** Across-trial variability in drift, start or nondecision time; collapsing boundaries; dependence between decision and nondecision time; contaminant responses; censoring. Response-specific delays across several conditions are open. There is no real data, and no comparison with the DstarM software.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Cognitive psychologists and neuroscientists fitting DstarM, HDDM/HSSM or fast-dm | Check whether a design can separate decision from nondecision time: add a biased condition, or two unbiased conditions differing in caution or strength, rather than relying on the $\pm v$ design | Fixed-parameter model only; shared delays are an assumption; weak contrasts need many trials |
| Methodologists and mathematical psychologists | An exact identification classification, identified set and sample-size lower bound | Theorem 4 is a lower bound only; Remark 3 is a conjecture |
| Economists using drift-diffusion choice models | Corollary 2 settles the constant-boundary case of the Fudenberg et al. conjecture; mean-difference identification across two menus | Time-varying boundaries remain open; mean-based routes need a finite mean delay |
| Research agents | Claim map, agent index and replayable checks | Checks corroborate; the classification rests on the written proofs |

## Why the problem matters

Diffusion-model fits are used to argue that groups or conditions differ in how they decide rather than in how fast they perceive or move. That argument is only as good as the split it rests on. Methods that leave the nondecision distribution free avoid an arbitrary shape assumption, but need the data to carry the information instead. This paper says exactly when they do, shows that one of the most common laboratory designs never does, and quantifies how weak the information can be near that design.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
uv run --python 3.12 --with numpy==2.3.5 --with scipy==1.17.0 --with matplotlib==3.10.8 \
  python3 -I -B code/verify_and_simulate.py --reps 40 --out NEW_DIR --figures NEW_FIGS
uv run --python 3.12 python3 -I -B code/summarise_simulation.py NEW_DIR/simulation_raw.csv \
  --out NEW_DIR/simulation_mc_uncertainty.json
```

The full run takes about 20 seconds; `--checks-only` skips the recovery study. Without `--out` the script writes to a new timestamped directory and leaves the shipped results untouched. A pinned `requirements.txt` can replace `uv`. `AI_INDEX.md` maps each claim to its proof and evidence, and `review/REVIEW_SUMMARY.md` lists the review objections and their resolution.

## The most valuable next projects

1. Extend the classification to the full Ratcliff model with across-trial variability in drift, start and nondecision time.
2. Decide whether two or more conditions sharing response-specific delays restore identification.
3. Find whether any estimator attains the $\varepsilon^{-2}$ rate of Theorem 4, and with what constant, on a compact class with bounded delay spread.
4. Prove the start-perturbation analogue of Theorem 4 (Remark 3).
5. Build a finite-sample test of complete monotonicity, turning Theorem 2 into a usable diagnostic.
6. Apply the design rules to public data and compare with the DstarM software.

## What is in the evidence package

The 25-page paper (PDF and Markdown source) with two figures. The verification and simulation script, the summary script, all check values and tolerances, raw results for all 400 synthetic datasets, summaries, the stored reference file and the run log. An agent index, the exact claim and dated literature audit, a rating-free review summary, and the bibliography from Crossref records. Licences (text, figures and data CC0-1.0; code MIT), citation metadata, CI and SHA-256 sums for every file. The paper is an unrefereed candidate, released for scrutiny.
