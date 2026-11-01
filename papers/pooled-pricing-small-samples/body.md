## Summary

**The setting.** A seller has data on a small number of past customers: what each was willing to pay, and some characteristic such as region or age. It can post **one price for everyone**, chosen to maximise revenue on the whole sample (*pooled* empirical revenue maximisation), or **split customers into markets** by the characteristic and choose a revenue-maximising price for each market from that market's data (*segmented* pricing).

**The intuition being tested.** Splitting leaves fewer observations per market, so its prices are noisier. Xie, Zhu and Shishkin (*Theoretical Economics*, 2025) showed that segmented pricing indeed learns more slowly, and asked an open question: is there a range of small sample sizes on which pooled pricing is guaranteed to win, for every demand model satisfying their standard smoothness conditions?

**What was found.** No such guarantee follows from those conditions. For any number of markets and any range of sample sizes, there is a smooth, regular demand model under which segmented pricing earns strictly more, on average, at every sample size in the range. Two such models together defeat pooled pricing at every sample size.

**Why it happens.** Imagine many ordinary customers with low valuations and a rare group willing to pay much more. When the sample happens to contain one of the rare customers, the pooled price can lock onto that single high valuation, and most ordinary customers stop buying. Segmentation keeps that observation out of the ordinary market's price. The paper tunes how rare the high group is so that this protection outweighs every cost of splitting the data.

**How big is the effect?** In the provable examples, tiny: the parameters are extreme. A simulation at moderate parameters, which is evidence rather than proof, shows segmented pricing winning at every sample size from 3 to 40 in eight of nine settings, by up to about ten per cent of revenue.

**Status.** An anonymous, AI-assisted, unrefereed candidate, checked by internal AI-assisted review only, not by peer review or independent reproduction. It says nothing about consumer welfare or whether price discrimination is desirable.

## Summary for specialists

Training pairs $(X_i,Y_i)$, $i\le n$, and a test buyer are i.i.d. on $[0,1]^2$; the buyer purchases at price $p$ if $Y\ge p$. Pooled ERM posts one empirical-revenue maximiser; $K$-market ERM uses the equal-length covariate partition, applies ERM in each nonempty bin and gives empty bins the pooled price (the completion used in the source's two-sample discussion). $\Delta_n=\mathbb E[K\text{-market revenue}]-\mathbb E[\text{pooled revenue}]$.

| Result | Status |
|---|---|
| For every $K\ge2$, $N\ge2$, one atomless law satisfying the source's Assumption 2 has $\Delta_n\ge7qa/512>0$ for $2\le n\le N$, with $a=1/(256N^4)$, $q=a/(128N)$ (Theorem 1) | proved; exact certificates |
| For each $K$, two fixed laws in one regularity class, and every more permissive class, give $\max\{\Delta_n(P),\Delta_n(Q)\}>0$ for all $n\ge2$; for $K=2$, $N_*=916{,}723{,}536$ is explicit (Corollary 4) | proved |
| Assumption 2 holds clause by clause; constants are extreme (for $N=K=2$, curvature constant about $1.2\times10^{-7}$) (Section 2.7) | proved |
| Moderate parameters ($a\in\{0.01,0.05,0.2\}$, $q\in\{0.005,0.02,0.05\}$, $n=3,\dots,40$): segmented ERM wins in eight of nine settings at every $n$ ($z>4$) | numerical (unsmoothed model) |
| Dominance window when moderate constants are fixed in advance; other empty-market conventions | open |

## Technical account

**Two segments.** Low buyers follow $L_a(y)=(1+a)y/(a+y)$, a truncated Lomax law with revenue $r_a(p)=ap(1-p)/(a+p)$; high buyers follow $H(y)=(y+y^2)/2$. The high segment has covariate probability $q$.

**Low-market ERM is good.** With $m$ low observations, the ERM price lies between $M/m$ and the maximum $M$; a stochastic-dominance argument via Bernoulli's inequality shows $\mathbb Er_a(p_L)/a\ge\tfrac12-ma\{\ell(a)+\tfrac12\}$.

**One high observation is bad for pooling.** If a high value $V$ exceeds $n$ times the largest low value, pooled ERM posts $V$, and the low market then earns at most $(1-V)a$, which averages $\tfrac5{12}a$. So one high observation costs the low market about $a/12$ of revenue relative to segmentation.

**Assembling.** The event "exactly one high observation" has probability about $nq/2$ and gains at least $a/32$; two or more high observations have probability at most $n^2q^2/2$; with one bin's worth of data the two rules coincide exactly. Tiny middle bins make the construction work for every $K$, and a smooth cutoff in the covariate changes $\Delta_n$ by at most $qa/512$ in total variation. For the fixed class, a second law with oracle gain $G_2>1.658\times10^{-4}$ wins for large $n$ by the Dvoretzky–Kiefer–Wolfowitz inequality.

**New and known.** The distribution family, the order-statistic comparison, binomial and total-variation bounds and DKW are classical. The two-sample reversal at $n=2$ is due to the source, building on Babaioff, Gonczarowski, Mansour and Moran (2018). The contribution is the simultaneous finite-window construction for every $K$ and its fixed-class consequence.

## Evidence, assurance and limitations

- **Proofs.** Written proofs of Theorem 1 and Corollary 4, with a table checking each clause of the source's Assumption 2.
- **Exact certificates.** A standard-library program verifies every arithmetic margin, the parameter table, the oracle-gain bound and $N_*$ in exact rational arithmetic; checks raise errors rather than use `assert`.
- **Simulation.** A fixed-seed Monte Carlo study (200,000 paired replications per point) of the unsmoothed model; it is evidence about moderate parameters, not a proof.
- **Replay and controls.** A replay driver reruns both programs from a clean copy and checks headline values in normal and optimised mode, locally and in CI; nine corruptions (for example $N_*$ one too small, an over-claimed oracle gain, a too-wide smoothing band) are rejected.
- **Review.** Five internal reviewer perspectives, an adversarial review by a different model and a verification pass with proof audit by a third model. No correctness error was found; the revision added the general-$K$ theorem, the explicit threshold, the assumption table and the simulation. This is **not** peer review, independent reproduction or formal verification.
- **Limits.** Extreme constants and tiny provable gains; dependence on the pooled-price completion of empty markets; an existential regularity class; bounded literature search with no priority claim.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Economists studying data-driven price discrimination | Small samples alone do not justify uniform pricing under standard regularity | The fixed-moderate-constants question is open |
| Learning-to-price and revenue-management researchers | A clean mechanism (rare segment, one outlier) for negative transfer from pooling | ERM is not robust to single outliers; other estimators may behave differently |
| Practitioners | A reason to check for rare high-value segments before pooling | No market data or calibration; not advice for any particular market |

## Why the problem matters

Whether to personalise prices is often argued on statistical grounds: with little data, segmentation is said to overfit. This result shows that, without further assumptions, the statistical argument does not guarantee that pooling is safer at small samples, and identifies the mechanism that a better guarantee must rule out.

## How to inspect or reproduce the recorded checks

1. Read Lemma 3 and Section 2.5: one high observation and the event decomposition carry the argument.
2. Download the archive from the DOI or the GitHub release and run `python3 -B replay_all.py` (about two minutes; the certificate program needs only the standard library, the simulation pinned NumPy) and `python3 -B negative_controls.py`.
3. Appendix A of the paper maps each computational claim to the programs.

## The most valuable next projects

1. Decide whether pooled ERM dominates on some small window when the covariate density and revenue curvature are bounded below by moderate constants fixed in advance.
2. Certify a moderate-parameter counterexample rigorously at small $n$, for example by interval computation.
3. Replace the pooled-price completion of empty markets by other conventions and determine when the reversal survives.

## What is in the evidence package

The 12-page paper (PDF and Markdown source); the exact certificate program and its record; the simulation program and record; a replay driver with claim checks, negative controls and CI; dated prior-art notes and the formal target record; records of status, assurance, claims, review dispositions, provenance and citation checks; SHA-256 sums for every file.
