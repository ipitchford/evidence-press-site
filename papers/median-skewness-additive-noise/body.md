## Summary

**In one sentence.** Skewness measured tail by tail does not survive addition, even for the best-behaved distributions.

**The question.** One precise way to say that a distribution is "skewed to the right" compares its two tails at equal distances from the median. At every distance, the chance of landing that far above the median should be at least the chance of landing that far below. Tim Hunter (*Statistical Papers*, 2026) studied this definition, which goes back to an identity of van Zwet, and called such laws **right van Zwet skewed**. He proved that the median of a sum of such variables is at least the sum of their medians, and conjectured that adding independent, well-behaved (log-concave) right-skewed variables keeps the sum right-skewed.

**Why it matters.** If skewness of this kind survived addition, one could reason about the skew of totals (costs, delays, a measurement plus noise) from the skew of their parts. The paper shows that one cannot, and determines how completely the property fails.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| A two-line counterexample | Add uniform noise on $[-1,1]$ to a triangular variable on $[0,1]$. The sum has median $1/3$; at distance $2/3$ the left tail is heavier (by $1/162$), at distance $3/2$ the right tail is heavier (by $1/1296$). For this input, skewness survives uniform noise exactly up to half-width $(3-\sqrt3)/4\approx0.317$ | Propositions 2.1, 2.2 |
| Only a constant "noise" is safe | For every genuinely random noise, however heavy-tailed, some smooth, strongly log-concave, right-skewed input loses both skew directions once the noise is added | Theorem 4.1 |
| One input that fails for every sum | One fixed smooth input breaks under every positive weighted sum of two or more independent copies of itself, and under Gaussian noise of any size, so the conjecture fails even when nothing symmetric is added | Theorem 5.1, Corollary 5.2 |
| A test of symmetry | A distribution with a positive continuous density is symmetric exactly when all its uniform smoothings lean one way. This gives a sample-based certificate that the tails swap dominance, with a guaranteed error rate | Theorem 3.1, Corollary 7.1 |
| Hunter's simulated cases, proved | Every gamma law, every beta law with $b\ge a\ge1$ and the Lévy law are right van Zwet. The beta case is essentially contained in an earlier analysis of Pearson laws by Sato (1995) | Proposition 6.2 |
| Limits and mixtures | The weak closure of the class is identified exactly; mixtures with a common median keep a shared direction and can lose both when components lean opposite ways | Appendix |

**Limits.** The counterexamples concern the exact definition; in the Gaussian-noise result the tail reversals are far out and tiny. No positive preservation result is proved. This is an unrefereed candidate; its assurance is internal AI-assisted review, a proof audit and exact and diagnostic computation only.

## Summary for specialists

Let $F$ have median $m$ and tail imbalance $D_F(t)=F(m-t)+F(m+t)-1$, $t>0$. The law is right van Zwet if $D_F\le0$ and left van Zwet if $D_F\ge0$. Let $U_r$ be uniform on $[-r,r]$ and $\mathcal X$ the right van Zwet laws with a positive, real-analytic, strongly log-concave density, strictly right at every quantile pair.

- **Propositions 2.1 and 2.2** *(proof)*: for $X\sim\mathrm{Beta}(1,2)$, $X+U_1$ has median $1/3$, $D(2/3)=1/162$ and $D(3/2)=-1/1296$; $X+U_r$ is right van Zwet exactly for $r\le(3-\sqrt3)/4$.
- **Theorem 3.1** *(proof)*: for $V$ with a positive continuous density, $V$ is symmetric iff each $V+U_r$ is right or left van Zwet, iff the slopes $g_r'(m(r))$ of the smoothed densities at their medians share one sign; if $V$ is asymmetric, an open interval of widths shows both signs of $D$.
- **Theorem 4.1** *(proof)*: a noise law $K$, with no moment assumption, keeps every $X\in\mathcal X$ right or left van Zwet iff $K$ is a point mass.
- **Theorem 5.1 and Corollary 5.2** *(proof)*: one $X\in\mathcal X$ such that $\sum_j a_jX_j+W$ ($a_j>0$, $W$ symmetric with all exponential moments, $n\ge2$ or $W$ nondegenerate) has $D$ of both signs at arbitrarily large distances; in particular $X+\sigma Z$ for every $\sigma>0$ and $X_1+X_2$.
- **Proposition 6.2** *(proof)*: gamma laws, $\mathrm{Beta}(a,b)$ with $b\ge a\ge1$ and inverse-gamma laws (the Lévy law included) are right van Zwet; $\log G$ is left van Zwet for gamma $G$.
- **Corollary 7.1** *(proof)*: a confidence band from the Dvoretzky–Kiefer–Wolfowitz inequality with Massart's constant (via Reeve's proof for arbitrary $F$) certifies opposite tail imbalances with size at most $\alpha$, and is consistent on fixed nested grids.

**Known and new.** Hunter gave the definition in this form, the median inequality, a counterexample with a discontinuous density and two-point noise, the log-concave conjecture and the closure questions. The derivative of the smoothed location path and the forward symmetry remark are in Tan, Wang and Zhou and in Thompson, Forbes, MacEachern and Peruggia; the converse, the two-sign conclusion, the noise classification, the single universal input, the certificate and the family proofs are new, with the beta case credited to Sato.

## Technical account

Uniform smoothing turns the median into Huber's robust location. Write $J(x)=\int_{m_0}^x(F(v)-1/2)\,dv$, the centred integrated distribution function. At each height $z$, the two solutions $\ell<m_0<u$ of $J(x)=z$ give the median $(u+\ell)/2$ of the smoothing with width $(u-\ell)/2$, so following the level sets of $J$ follows the Huber location path as the width grows. The slopes of $J$ at the two matched points must balance exactly when, and only when, the law is symmetric; otherwise some width shows both signs of the tail imbalance.

For the noise classification, asymmetric noise is first made smooth by a small Gaussian convolution and Theorem 3.1 applies directly; symmetric noise is handled by a strongly log-concave symmetric base, and in both cases a tiny smooth perturbation transfers the two-sign behaviour to a strictly right-skewed input in $\mathcal X$. Theorem 5.1 builds one even analytic perturbation whose effect dominates far in the tails under every self-sum and every symmetric noise with exponential moments. The family results verify a sign condition on $\log f(m+t)-\log f(m-t)$ (Lemma 6.1).

## Evidence, assurance and limitations

- **Proofs.** Every result has a written proof in the 15-page paper, which opens with a context-first introduction and ends with limits, open problems and an AI-use statement. No proof assistant was used.
- **Computations.** `code/check_hunter.py` (standard library) checks the counterexample, the $0.317$ threshold and the atomic example in exact rational arithmetic. `code/check_families.py` (mpmath) gives 40-digit numerical diagnostics for the gamma, beta and Lévy section; these are checks, not proofs. `code/huber_certificate.py` (NumPy and SciPy) runs the sample procedure on deterministic controls.
- **Tests that can fail.** No script relies on `assert`; each stops with an error on any failed check, also in Python's optimised mode. Changing $1/162$ to $1/161$ makes `check_hunter.py` fail.
- **Replay.** All three scripts were rerun from fresh copies before release and reproduced the recorded outputs; GitHub CI reruns them on Linux and compares the outputs under a declared policy.
- **Review.** A combined five-perspective Claude review panel, one revision round, a verification re-review with a proof audit, and the lead's proof audit. No Astra/Codex review ran for this release. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The counterexamples concern the exact definition; in the Gaussian-noise result the tail reversals are far out and tiny, invisible in samples of moderate size. No positive result is proved: which inputs keep this skewness under all Gaussian noise is open, as is whether one input can fail for every symmetric noise and whether beta laws with $a<b<1$ are right-skewed. The certificate has a controlled error rate, but its power has not been compared with established symmetry tests. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Statisticians reasoning about skewed totals | Tail-based right skewness of the parts gives no guarantee about the sum, even for log-concave parts | The failures can be too small to see in moderate samples |
| Researchers on robust location and symmetry tests | A characterisation of symmetry through uniform smoothings and a distribution-free two-sign certificate | No power comparison with established symmetry tests |
| Probabilists studying skewness orders | Exact counterexamples, a noise classification and proofs for gamma, beta and Lévy laws | Beta laws with $a<b<1$ remain open |
| Research agents | Machine-readable claims, an agent index and replayable checks with a failure test | The programs accompany written proofs; they do not replace them |

## Why the problem matters

Median-centred skewness is attractive because it needs no moments and is read directly from quantiles. Knowing whether it survives addition decides whether it can be used to reason about totals and noisy measurements. The answer here is a sharp no, together with a new way to detect asymmetry by smoothing.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root:

```sh
python3 -I -B -O code/check_hunter.py
pip install -r requirements.txt
python3 -I -B -O code/check_families.py
python3 -I -B code/huber_certificate.py
```

Each takes a few seconds. `results/check_hunter.txt` must match byte for byte; in the other two outputs text and integers must match and decimals may differ within absolute $10^{-6}$. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Characterise the inputs that keep right van Zwet skewness under all Gaussian noise.
2. Decide whether one input can fail for every nonconstant symmetric noise, and whether beta laws with $a<b<1$ are right van Zwet.
3. Compare the power of the uniform-smoothing certificate with established tests of symmetry.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex`, the 15-page PDF and `figures/tail-imbalance.pdf`); `code/check_hunter.py`, `code/check_families.py`, `code/huber_certificate.py` and `code/plot_tails.py` with recorded outputs in `results/` and `requirements.txt`; `refs.bib` from Crossref, arXiv and repository records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
