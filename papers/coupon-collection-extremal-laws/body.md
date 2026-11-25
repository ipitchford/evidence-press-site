## Summary

**In one sentence.** When boxes of coupons are filled in groups, how slow can a fair filling scheme make it to complete a set, and how fast can any scheme make it? This release answers both questions exactly in the main cases, and shows that a fair scheme with large boxes can never cost even one extra box on average.

**The everyday problem.** Collect a full set of $n$ different coupons (stickers, trading cards, fragments of a DNA library) when each box contains a group of $s$ of them. The classical one-coupon-per-box version needs about $n(1+\tfrac12+\cdots+\tfrac1n)$ boxes. With groups, whoever fills the boxes decides how the groups overlap. How fast can a full set be completed? And how slow can it be made while staying **fair**, meaning every coupon is equally common?

**Why it matters.** The same question appears in other settings:

- promotions that want slow but fair completion;
- sequencing and DNA-storage coverage, where reads arrive in groups;
- probabilistic quorum systems, where clients contact random groups of servers that must overlap;
- replica placement across machines that may fail.

**What was known.**

- Grunbaum and Yaakobi conjectured that drawing uniformly from all possible groups (the **full model**) is the slowest fair rule.
- In 2026 Barak-Pelleg and Berend disproved this with the seven-point Fano plane. They asked how slow a fair rule can be, and how large the excess over the full model can get.
- On the fast side, Fang and Chang (2014) solved the case where boxes hold half the coupons, and conjectured that splitting the coupons into equal disjoint groups is always fastest when $s$ divides $n$.

**What is new.** Write $r=n-s$ for the number of coupons a box leaves out.

| Result | In plain terms | Where |
|---|---|---|
| Designs are the slowest fair rules | When the left-out coupons can form a Steiner 2-design, sampling it is the slowest fair rule after every number of boxes, and only the design does this. Seven coupons in boxes of four: $47/12$ boxes on average, against $257/68$ for the full model | Theorem 3.1 |
| Every population size, in every critical window | With $\lambda$ the expected number of coupons still missing after $k$ boxes, the slowest fair mean is $k+\min(1,\lambda)$, against $k+1-e^{-\lambda}$ for the full model (up to terms that vanish as $n$ grows) | Theorem 4.1 |
| Never even one box slower | No fair rule is more than $1/e+0.42/\ln(n/r)$ boxes slower on average than the full model. That is less than one box whenever boxes hold at least half the coupons, and it tends to $1/e\approx0.37$ when boxes hold almost everything; the limit is reached | Theorem 5.4 |
| Small cases, exactly | An exhaustive exact search (up to 2,505,121 fair rules for one pair $(n,s)$): the Fano plane is the slowest fair rule at Barak-Pelleg and Berend's own example, and six coupons in boxes of three is the smallest case where the full model is not slowest | Proposition 6.1 |
| The fastest rules | If $s$ divides $n$, equal disjoint groups are uniquely fastest, with $(n/s)\,H(n/s)$ boxes on average; this proves the Fang–Chang conjecture. If $n-s$ divides $n$, the exact minimum is $1+n/s$ | Theorems 7.3 and 7.5 |

When boxes hold at least half the coupons, no fair scheme can make collectors wait even one extra box on average.

![Limiting probability of being unfinished after k boxes, as a function of λ: the slowest fair rule follows min(1, λ), the full model follows 1 − e^(−λ), and the gap peaks at 1/e when λ = 1.](/assets/figures/coupon-collection-extremal-laws-critical-window.png "Figure 1 of the paper. The chance of still being unfinished after k boxes, in the limit, as a function of λ. Every fair rule leaves the same expected number of coupons missing; the slowest rule makes them appear one at a time (upper curve, min(1, λ)), while the full model lets them form a Poisson number (lower curve, 1 − e^(−λ)). The vertical gap is also the limiting difference in mean collection time; it peaks at 1/e when λ = 1.")

**The idea.** Every fair rule leaves the same expected number of coupons missing. Slow rules make the missing coupons come one at a time, which designs and projective geometry do; fast rules make them disappear in clumps, which partitions do. The slow side uses the first two moments of the number missing. The fast side runs each box type on its own Poisson clock and applies a Hölder-type product inequality.

**Credit.** Barak-Pelleg and Berend's star mechanism already reaches the maximum $k+1$ in its own windows ($\lambda>1$); the new parts are the matching bound, every $\lambda$ (including $\lambda<1$), every $n$ and the $1/e$ peak. The $h=1$ product bound is Pelekis, Ramon and Wang's Theorem 2.6 after Poissonisation, an instance of Finner's generalized Hölder inequality. Berend and Sher introduced the complementary-decomposition law and computed its mean.

**Limits.**

- The critical-window result is asymptotic and converges slowly: at $n=1600$ the full model is still 0.03 boxes above its limit. The construction is existential.
- The exact slowest rule without a design is known only for small $n$.
- Whether the excess can grow without limit for very small boxes is open.
- The fastest rule is open when neither $s$ nor $n-s$ divides $n$.
- This is an unrefereed candidate. Its assurance is internal AI-assisted review plus exact computer checks.

## Summary for specialists

Coupons are $[n]$; a sampling law is a distribution on packages, drawn independently, and $T$ is the number of draws until every coupon has appeared. On the slow side packages have size $s$, the omitted set $B$ has size $r=n-s$, $p=r/n$, and a law is **balanced** (fair) if every coupon is omitted with probability $p$. Fair mechanisms in the sense of Grunbaum and Yaakobi are uniform laws on regular families of distinct $s$-sets. Write $Z_j$ for the number of coupons missing after $j$ draws, so $\Pr(T>j)=\Pr(Z_j>0)$ and $\mathbb E Z_j=np^j$ for every balanced law.

- **Theorem 3.1** *(proof)*: with $u=r(r-1)/(n(n-1))$, every balanced law has, for every $j\ge1$,
$$\Pr(T>j)\le np^j-\frac{n(n-1)}{r}\,u^j,$$
with equality at any $j\ge2$ exactly when the omitted set is uniform on the blocks of an $S(2,r,n)$; that law has the largest mean among balanced laws and fair mechanisms. Theorem 3.4 extends this to partial coverage with $S(h+1,r,n)$ under $h$-set balance.
- **Theorem 4.1** *(proof)*: if $n\to\infty$ with $np^k\to\lambda\in(0,\infty)$ for fixed $k\ge2$, then $\max\mathbb E T=k+\min\{1,\lambda\}+o(1)$ over balanced laws and over fair mechanisms, while $\mathbb E T_{\rm full}=k+1-e^{-\lambda}+o(1)$. The construction uses thinned hyperplanes of $\mathrm{PG}(k,q)$ and a regularisation lemma (Lemma 4.3).
- **Theorem 5.4** *(proof)*: for all $1\le r<n$,
$$\mathbb E T-\mathbb E T_{\rm full}\le\frac1e+\frac{1-\gamma}{\ln(n/r)},$$
at most $0.978$ when $r\le n/2$; the limit $1/e$ is attained at $k=2$, $\lambda=1$.
- **Proposition 6.1** *(computer-assisted)*: for $n\le7$ and for $n=8$ with $s\in\{2,6\}$ the full model is the unique slowest fair mechanism except at $(6,3)$ (max $157/36$, the $2$-$(6,3,2)$ design), $(7,3)$ (max $163/30$, Fano planes and unions of two block-disjoint Fano planes) and $(7,4)$ (max $47/12$, Fano complements).
- **Theorems 7.2, 7.3 and 7.5** *(proof)*: with $x=n/s$, every law on packages of size at most $s$ has
$$\mathbb E T\ \ge\ \max\{xH_x,\ 1+x\},$$
with equality in the first exactly for uniform partitions when $s\mid n$ (also for the $h$-fold collection times), and in the second, among laws on packages of exactly $s$ coupons, exactly for uniform partitions of the omitted sets when $(n-s)\mid n$.

**Known and new.** The counterexample to the full-model conjecture, the star mechanism and the questions answered here are Barak-Pelleg and Berend's; the conjectures are Grunbaum and Yaakobi's and Fang and Chang's (recorded by Berend and Sher). The degree-two counting bound is classical, and the $h=1$ product bound is Pelekis–Ramon–Wang's Theorem 2.6 after Poissonisation. The design characterisation, the critical-window maximum for every $n$ and $\lambda$, the universal excess bound, the exact small-case maxima and the two exact minimum families are new here, within a literature search of limited scope.

## Technical account

**Slow side, finite size (Section 3).** For $0\le z\le r$, $\mathbf 1_{\{z>0\}}\le z-\tfrac2r\binom z2$, with equality only at $z\in\{0,1,r\}$. Taking expectations at $z=Z_j$ gives $np^j$ minus the pair term $\sum_{a<b}u_{ab}^j$, which convexity bounds below by $\binom n2u^j$. Equality forces every pair to be omitted with the same probability and any two supported omitted sets to meet in at most one point, which is a Steiner 2-design. Proposition 3.2 turns a small two-draw deficit into near-equal pair probabilities.

**Critical windows (Section 4).** The first moment gives $\Pr(T>k)\le\min\{1,np^k\}$. For the matching construction, the core of the population is identified with $\mathrm{PG}(k,q)$; each draw omits a random subset of a random hyperplane, of the size needed for balance. Any $k$ hyperplanes share a point, so the missing coupons appear one at a time with probability tending to $\min\{1,\lambda\}$. A smoothing, sampling and repair argument (Lemma 4.3) converts the balanced law into a fair mechanism.

**Excess bound (Section 5).** A hypergeometric generating-function inequality (Lemma 5.1) gives $\Pr(T_{\rm full}>j)\ge1-(1-p^j)^n$ (Proposition 5.2). The excess is then at most $\sum_j h(np^j)$ with $h(\mu)=\min\{1,\mu\}-1+e^{-\mu}$; the points $\ln(np^j)$ are spaced $\ln(n/r)$ apart, and a grid-sum lemma bounds the sum by $1/e$ plus $\int_0^\infty h(\mu)\,d\mu/\mu=1-\gamma$ divided by the spacing.

**Exhaustive search (Section 6).** `fair_maxima.c` enumerates every family of distinct $s$-sets with equal point degrees and computes $\mathbb E T$ by the exact recursion over covered sets in double precision; the largest and second-largest values differ by more than $10^{-6}$ in every case (observed at least $6.1\times10^{-3}$), and `certify_fair_maxima.py` recomputes every maximiser in exact rational arithmetic and checks its structure.

**Fast side (Section 7).** Attach a rate-one Poisson process to the draws, so the counts of each package type are independent. The indicator that coupon $i$ has appeared depends only on counts of packages containing $i$, and each count enters at most $s$ indicators, so Finner's inequality gives $\Pr(\tau\le t)\le\prod_iG(td_i)^{1/s}$; log-concavity and Jensen's inequality bound this by $G(t/x)^x$, whose integral is $xH_x$. For the second bound, at most $n-s$ coupons are missing after any draw, which gives $\Pr(T>k)\ge((n-s)/n)^{k-1}$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/coupon-collection-extremal-laws.txt) is available for reading.

- **Proofs.** The 14-page paper opens with a plain introduction (the problem, what was known, what is new with a summary table, the main idea, related settings and a roadmap) and gives written proofs of every general result. No proof assistant was used.
- **Exact checks.** `verify_coverage.py` checks the finite statements in exact rational arithmetic: the seven-coupon example, 73,750 pointwise majorant and equality tests, the minimum bounds (14 divisible pairs, the $1+n/s$ family and 594 random competitor laws), Lemma 5.1 and Proposition 5.2 on small cases, the excess-bound series for $n\le100$ (4,950 cases) and the finite full-model values quoted in Section 4.
- **Exhaustive search.** `fair_maxima.c` with `certify_fair_maxima.py` covers every fair mechanism for the parameter pairs of Proposition 6.1, up to 2,505,121 per pair.
- **Tests that can fail.** No check uses `assert`; every check fails explicitly, also in Python's optimised mode. Changing $47/12$ to $47/13$, or $163/30$ to $163/31$, makes the scripts fail.
- **Replay.** The scripts were rerun from a fresh copy before release; every output and the figure matched the recorded ones byte for byte. GitHub CI reruns both checks on Linux with a declared comparison policy.
- **Review.** A combined five-role internal Claude review panel, one revision round, a re-review, a proof audit of the new proofs and a clean replay with negative controls. No Astra/Codex review took place. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Idealised independent draws; asymptotic critical windows with slow convergence and an existential construction; several finite cases open; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Designers of sampling, coverage and quorum schemes | Benchmark a proposed group-sampling design against the exact slowest and fastest laws, and against the bound $1/e+0.42/\ln(n/r)$ on how much slower than uniform sampling a fair design can be | Idealised independent draws with equal item frequencies; several finite cases open |
| Probabilists and combinatorialists | A design characterisation of extremal coverage, critical-window asymptotics for every population size, and exact small-case maxima | Asymptotic results with unquantified rates; the slow construction is existential |
| Researchers on coupon collection | Proofs of the Fang–Chang conjecture with uniqueness and of a second exact minimum family | The minimum is open when neither $s$ nor $n-s$ divides $n$ |
| Research agents | Machine-readable claims, an agent index and exact checks | The computations test finite cases, not the general theorems |

## Why the problem matters

Group sampling is everywhere: reads in a sequencing run, servers contacted by a client, packets in a promotion. Designers choose how the groups overlap, often by intuition. The results say how much that choice can matter for complete coverage. On the slow side, fairness alone already limits the damage to under one draw on average once each group covers at least half the population, and the worst designs are recognisable combinatorial objects. On the fast side, the best designs are partitions, now proved optimal and unique.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.12 or later and a C compiler:

```sh
python3 -I -B -O code/verify_coverage.py \
  --output results/verification.json
python3 -I -B -O code/certify_fair_maxima.py \
  --output results/fair_maxima.json
```

The first prints `ALL CHECKS PASSED` in about a second; the second takes about 40 seconds. `README.md` lists the files and the comparison policy, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. The exact slowest fair rule when no design exists, beyond the small cases searched: are pairwise balanced families always among the slowest?
2. Whether a fair rule can exceed the full model by an unbounded number of draws when boxes are small.
3. Quantitative rates and explicit fair mechanisms for the critical windows.
4. The fastest rule when neither $s$ nor $n-s$ divides $n$, starting from Berend and Sher's near-decomposition law.

## What is in the evidence package

The paper (`manuscript.pdf` and its LaTeX source `manuscript.tex`) with Figure 1 in `figures/`; `code/verify_coverage.py`, `code/fair_maxima.c`, `code/certify_fair_maxima.py` and `code/make_figure.py` with their recorded outputs in `results/`; `requirements.txt`; `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
