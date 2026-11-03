## Summary

**In one sentence.** For any count of independent yes/no events with unequal chances, no outcome is more likely than under the Poisson law with the same mean by more than the factor mean ÷ variance.

**The setting.** Many counts add up independent yes/no events whose chances differ: adverse events among patients, defaults in a loan book, faults in a network, rare variants in a sample. Such a count has a *Poisson-binomial* law. Its exact law is awkward, so in practice it is replaced by the Poisson law with the same mean — the Poisson shortcut.

**Why the kind of error matters.** The classical error bounds for the shortcut are *additive*: the probabilities differ by at most a small amount. That says little about a rare outcome whose probability is itself tiny. A *multiplicative* bound is stronger: if no single outcome can be more than $C$ times as likely as Poisson says, then no event of any kind — however rare — can be more than $C$ times as likely either.

**What was known.** In 2020 Dümbgen and Wellner proved that $C = 1/(1-p_{\max})$ works, where $p_{\max}$ is the largest single chance. That is poor when one unit is very likely to occur, even if all the others are tiny. They conjectured that the right factor is mean ÷ variance, which averages over all the chances, and they proved it when the mean is at most 1.

**What is proved.** The conjecture holds in general. For every such count $X$ with mean $\lambda$ and variance $v$, and every number of events $k$,

$$v\,\mathbb P(X=k)\le\lambda\,e^{-\lambda}\frac{\lambda^k}{k!},$$

so every outcome and every event is at most $\lambda/v$ times as likely as under the Poisson law. The banner shows this for five events with chances 0.9, 0.6, 0.5, 0.3 and 0.2: every bar of the exact law lies below the Poisson probabilities scaled up by $\lambda/v\approx2.63$.

**An example.** Take one unit with chance 0.99 and 9,999 units with chance 0.01. The earlier bound allows a factor of 100. The new bound gives $\lambda/v=1.02$. The actual worst factor, computed numerically, is about 1.0099.

**How sure we are.** Every result has a written proof in a 12-page paper. Two independently written scripts check the identities behind the proof exactly, and test the main inequality on many examples. The bound is not the last word on its size: for many comparable chances the true worst factor appears to be closer to $\sqrt{\lambda/v}$, which is left open.

**Where to go next.** Specialists can continue to the summary below; the technical account explains how the proof works; the evidence section says what was checked and what was not.

## Summary for specialists

Setting: $X=N+\sum_iB_i$ with independent $N\sim\mathrm{Poi}(a)$, $a\ge0$, and $B_i\sim\mathrm{Bern}(p_i)$, finite or countable; $\lambda=a+\sum_ip_i$, $v=a+\sum_ip_i(1-p_i)>0$, $\Delta=1-v/\lambda$; $\pi_\lambda(k)=e^{-\lambda}\lambda^k/k!$ and $\rho=\sup_k\mathbb P(X=k)/\pi_\lambda(k)$.

- **Theorem 1.1 (main result):** $v\,\mathbb P(X=k)\le\lambda\,\pi_\lambda(k)$ for all $k$. Hence $\rho\le\lambda/v=(1-\Delta)^{-1}$, $\mathbb P(X\in A)\le(\lambda/v)\,\mathbb P(\mathrm{Poi}(\lambda)\in A)$ for every $A$, and $D_\infty(\mathcal L(X)\,\|\,\mathrm{Poi}(\lambda))\le\log(\lambda/v)$; strict for finite non-Poisson families. This is the Dümbgen–Wellner conjecture, new for $\lambda>1$ (for $\lambda\le1$ they proved the stronger $\log\rho\le\Delta$; the binomial case is due to Dümbgen, Samworth and Wellner) *(proof)*
- **Theorems 5.1 and 5.2 (two monotone flows):** $v(t)\,\mathbb P(X_t=k)$ is nondecreasing along the logistic flow $p_i(t)=p_ie^{-t}/(1-p_i+p_ie^{-t})$ with Poisson immigration keeping the mean fixed, and along the classical thinning semigroup $p_i(t)=p_ie^{-t}$, $a(t)=\lambda-e^{-t}\sum_ip_i$; strictly increasing for finite non-Poisson families. The second gives a second proof of Theorem 1.1 *(proof)*
- **Proposition 2.4 (certificates):** the second differences of the reverse ratio $u_k=b_{k-1}/b_k$, the forward Stein kernel $\tau_k$ and the forward ratio $F_k=(k+1)b_{k+1}/b_k$, multiplied by $b_{k-1}b_kb_{k+1}$, are explicit sums of nonnegative $3\times3$ Toeplitz minors of deletion laws *(proof; exact checks)*
- **Corollary 7.1 (sampling):** in rejective (conditional Poisson) sampling, $k\mapsto\mathbb E[\sum_ic_iB_i\mid\sum_iB_i=k]$ is concave when the weights are ordered like the $p_i$ *(proof)*
- **Proposition 8.1 (sharpness bracket):** the best constant at fixed $\Delta$ satisfies $\max\{e^\Delta,(1-\Delta)^{-1/2}\}\le C(\Delta)\le(1-\Delta)^{-1}$; the bound $\rho\le e^\Delta$, valid for $\lambda\le1$, fails in general (already for $\mathrm{Bin}(2,p)$ with $p>\log2$) *(proof)*
- **Proposition 8.2 (no ultra-log-concave extension):** $\mathrm{Poi}(1)$ conditioned on $\{0,1,2,3\}$ is ultra-log-concave yet $v\,\mathbb P(X=3)/(\lambda\pi_\lambda(3))\approx1.00237>1$ *(proof with a rational certificate; exact check)*

## Technical account

**Moving to the Poisson law.** The proof never locates the outcome where the ratio is largest. Instead it moves the law continuously to $\mathrm{Poi}(\lambda)$ and shows that each $v\,\mathbb P(X=k)$ can only increase on the way. Along the logistic flow every odds ratio $p_i/(1-p_i)$ decays like $e^{-t}$ and a Poisson component keeps the mean equal to $\lambda$. This choice closes the mass equation: each $b_k(t)$ depends only on its neighbour $b_{k-1}$ and on $v$:

$$
\begin{aligned}
\frac{d}{dt}(v\,b_k)&=b_k\Big[2M+v(\lambda-k)\\
&\qquad+v^2\Big(\frac{b_{k-1}}{b_k}-1\Big)\Big],
\end{aligned}
$$

where $M=\sum_ip_i^2(1-p_i)$.

**Reducing to a convexity statement.** Up to a factor $v$ the bracket equals $h(k)+2M/v$ for a sequence $h$ that is convex, orthogonal to constants and to $X-\lambda$, and satisfies $\mathbb E[(X-\lambda)^2h(X)]=2M$. A discrete reverse moment inequality (Lemma 3.2), proved with a convex-tilting lemma that is a special case of a covariance inequality of Bonnefont, Hillion and Saumard, shows that such an $h$ has $\min h\ge-\mathbb E[(X-\lambda)^2h(X)]/v=-2M/v$ whenever the law has a convex nonnegative Stein kernel. So the bracket is nonnegative.

**The certificates.** Convexity of the reverse ratio and of the Stein kernel is proved by explicit identities: each second difference, times $b_{k-1}b_kb_{k+1}$, is a sum of $3\times3$ Toeplitz minors of the masses with one or two units deleted, weighted by nonnegative coefficients such as $p_i^2(1-p_i)$ or $w_iw_j(p_i-p_j)^2$. Those minors are nonnegative by total nonnegativity of Bernoulli convolutions (Lemma 2.1). The identities come from two deletion identities for elementary symmetric functions (Section 6). Reverse-ratio convexity was known from Hillion and Johnson; the forward-ratio certificate is new and drives the thinning-semigroup proof (Theorem 5.2), where the evolution involves both neighbours.

**What the bound does and does not say.** The bound is uniform over all outcomes and events. It is not sharp for large means: the bracket in Proposition 8.1 leaves a gap between $(1-\Delta)^{-1/2}$ and $(1-\Delta)^{-1}$, and numerical scans suggest $\rho\le C_0\sqrt{\lambda/v}$ for an absolute constant (open question). It controls one direction only: no multiplicative lower bound is possible. For one-sided tails, Hoeffding's comparison with the binomial law can be better, and for total variation distance the bound of Barbour and Hall is better than the one this result implies.

**Equivalent readings.** The inequality bounds the Rényi divergence of order infinity from the Poisson law. It applies to every count whose generating polynomial has only real zeros (Pitman), to the number of points of a determinantal point process in a set (Hough, Krishnapur, Peres and Virág), and to the particle number of grand-canonical free fermions.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/poisson-binomial-density-ratio.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 12-page paper, including total nonnegativity of the minors (Lemma 2.1), a Stein identity (Lemma 2.3), the tilting and reverse moment lemmas with explicit hypotheses and an exact remainder, the countable case by truncation, and strictness through the Cauchy–Binet formula.
- **Exact checks.** `verify_results.py` makes 104,534 checks in exact rational arithmetic, with 60-digit decimals for transcendental quantities: the deletion identities, the three certificates and the size-bias formula for Poisson parameters 0, 1/5 and 7/3, the adjacent and two-ratio inequalities, both flow equations, the Poisson minor formula, the main inequality and monotonicity along both flows on a time grid, Propositions 8.1–8.2 and the worked example. The independently written `check_stein_certificates.py` makes 4,405 exact checks of the identities and certificates on 108 distribution instances. These test the statements on examples; the universal statements rest on the proofs.
- **Numerical exploration.** `sharpness_scan.py` scans 20,000 random parameter vectors and binomial families in double precision; it supports the open square-root question and computes the worked example. It is not part of any proof.
- **Controls and replay.** Both exact checkers record each check through an explicit test function, compute their status from the failure count, exit non-zero on any failure (also under Python's `-O` flag), and contain deliberately wrong negative controls that must be detected. Rerun from a fresh copy before release and again from the frozen archive, under normal and optimized Python, all outputs were byte-identical to the shipped ones.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review and proof audit by a separate model, a separate proof audit and a clean replay led to one revision round, which added the thinning-semigroup theorem, the forward-ratio certificate, the sharpness bracket and the ultra-log-concave counterexample; a re-review found no open correctness issue. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The factor $\lambda/v$ is not sharp for large means, and its true order is open. The bound concerns single outcomes and arbitrary events, not one-sided tails or total variation, where classical results are better. The literature search was dated and bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Statisticians and risk analysts approximating counts of rare independent events | A guarantee, computed from the mean and variance alone, that no outcome or event is more likely than the Poisson calculation by more than $\lambda/v$ | Not sharp for large means; one-sided tails and total variation have better classical bounds |
| Probabilists working on Poisson approximation and log-concavity | A proof of the Dümbgen–Wellner conjecture, two monotone flows and explicit Toeplitz-minor certificates | Does not extend to ultra-log-concave laws; the best constant is only bracketed |
| Survey statisticians using conditional Poisson sampling | Concavity of ordered conditional inclusion means in the sample size | Requires weights ordered like the inclusion probabilities |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

The Poisson shortcut is used wherever rare independent events are counted, from pharmacovigilance and credit risk to reliability and genetics. A multiplicative guarantee is the one that protects rare-event calculations, and the earlier guarantee depended on the single largest chance, so one near-certain unit could make it useless. Replacing it by mean ÷ variance, a quantity computed from two numbers, settles a conjecture posed in 2020 and gives a bound that is close to 1 whenever the variance is close to the mean.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root, with Python 3 (standard library only):

```sh
shasum -a 256 -c MANIFEST.sha256
cd checks
python3 -I -B verify_results.py            # add -O for the optimized replay
python3 -I -B check_stein_certificates.py
python3 -I -B sharpness_scan.py
```

Compare each output with `checks/results/normal/` and `checks/results/optimized/`; the whole run takes seconds. `AI_INDEX.md` maps each result to its section and evidence, `VERIFICATION.md` says what each script does and does not establish, and `REVIEW_SUMMARY.md` lists the objections raised in review and how each was handled.

## The most valuable next projects

1. Prove or refute $\rho\le C_0\sqrt{\lambda/v}$ for an absolute constant $C_0$, and identify the best two-parameter bound $\sup\{\rho:\mathbb EX=\lambda,\ \operatorname{Var}X=v\}$.
2. Determine the best constant $C(\Delta)$ at fixed $\Delta$, closing the bracket of Proposition 8.1.
3. Identify which classes of counts beyond sums of independent Bernoulli variables satisfy the variance bound, given that it fails for ultra-log-concave laws (Proposition 8.2).

## What is in the evidence package

The paper (PDF and LaTeX source); the bibliography built from Crossref records; `verify_results.py`, `check_stein_certificates.py` and `sharpness_scan.py` with their retained outputs in normal and optimized mode; a rating-free summary of the internal review (`REVIEW_SUMMARY.md`); `VERIFICATION.md`, `AI_INDEX.md`, `RESEARCH_GATES.json`, `REPLAY_RECEIPT.md`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text and data are CC0-1.0; code is MIT. This remains an unrefereed candidate.
