## Summary

**In one sentence.** Two definitions of positive dependence that a published conjecture said were the same are different in every direction, and when two ranks come from a cluster of interchangeable units their rank correlations obey exact lower limits.

**The everyday problem.** Statisticians describe how two quantities move together (losses on two loans, rainfall at two sites) with a *copula*: the joint behaviour of their ranks, free of the units each quantity is measured in. Two ideas of "positive dependence" are in play. **Quadrant dependence** says that jointly low values are at least as likely as they would be under independence, at every pair of thresholds. The newer **positive measure inducing** (PMI) property, introduced by Fuchs and Tschimpke, works rectangle by rectangle: it compares the probability on the main-diagonal side of the unit square with the probability on the opposite side.

**Why it matters.** PMI forces an ordering of popular rank correlations. For example, 3 times Gini's gamma is at least 2 times Spearman's rho ($3\gamma\ge2\rho$), and Fuchs and Tschimpke built statistical tests on such inequalities. They conjectured that for Archimedean copulas, the workhorse family in finance, insurance and hydrology, PMI is the same as quadrant dependence, and likewise for the negative versions. If that were true, failing their test would rule out every positively dependent Archimedean model. Graham (2026) gave one counterexample, a quadrant dependent Archimedean copula that is not PMI, and left the other three directions open.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| All four directions fail | Simple smooth Archimedean examples, as close to independence as you like, separate the two properties each way, with explicit parameters (one in a thousand and one in a hundred million). One is quadrant dependent yet reverses the rank inequality, so a violation of $3\gamma\ge2\rho$ does not rule out every quadrant dependent Archimedean model. The examples extend to any finite number of exchangeable variables | Theorem 3.1 |
| No finite test battery | Comparing rank correlations detects PMI for exchangeable copulas, but only with infinitely many comparisons | Theorem 4.1, Corollary 4.2 |
| Shared frailty | When a common random rate drives both variables, two frailty levels always give PMI; three (rates 1, 2 and 200) can break it, even with a density that is totally positive of every order | Proposition 5.1, Corollary 5.2 |
| Clusters of interchangeable units | If the two ranks come from a group of $n$ interchangeable units (members of a household, loans in a pool), $3\gamma-2s\rho$ has an exact lower limit for every slope $-n/2\le s\le1$. For three units, Gini's gamma is never below $-4/9$ and $3\gamma-2\rho$ never below $-23/54$, compared with $-1$ with no constraint | Theorem 6.1, Corollary 6.2 |
| Gini correlation matrices | The same construction settles the smallest common Gini correlation in any number of variables, a question Koike and Hofert left open. For three variables it is $-4/9$; their Gaussian example reaches about $-0.379$ and the general correlation bound is $-1/2$ | Theorem 7.1 |

**The idea of the proofs.** Nudge the independence copula by a small polynomial and track two signs: one for the cumulative comparison that defines quadrant dependence, and one for the local reflected comparison that defines PMI. The two signs can be chosen independently, which gives all four separations. For clusters, write each rank as a sign and a size (a representation due to Ansari, Rockel and Steinmaßl). With an odd number of units the signs cannot all cancel, and that leftover sign costs a fixed amount of correlation.

**Limits.** The counterexamples are tiny effects: $3\gamma-2\rho$ is about two parts in ten billion for the family that includes the quadrant dependent example, and about three in a hundred thousand for the other family. They settle the logical question and say nothing about the power of real tests. All results are population statements. This is an unrefereed candidate; its assurance is internal AI-assisted review, a proof audit and exact computational checks only.

## Summary for specialists

Let $C$ be a bivariate copula, $\Pi$ the independence copula, $\rho$ Spearman's rho, $\gamma$ Gini's gamma and $D_s=3\gamma-2s\rho$. PQD means $C\ge\Pi$; PMI means the Fuchs–Tschimpke reflected measure $\eta_C$ on $(0,1/2)^2$ is nonnegative. An $n$-extendible pair is the first two coordinates of an exchangeable vector of $n$ uniform ranks, and $d_n(s)$ is the minimum of $D_s$ over such pairs.

- **Theorem 3.1** *(proof)*: PMI ⇒ PQD, NMI ⇒ NQD, NQD ⇒ NMI and PQD ⇒ PMI all fail for real-analytic Archimedean copulas with positive densities, arbitrarily close to independence in every $C^m$ norm, with explicit ranges $0<|\varepsilon|\le10^{-3}$ and $0<|\varepsilon|\le10^{-8}$; the examples are margins of exchangeable Archimedean copulas in every finite dimension. In the PQD example $D_1<0$.
- **Theorem 4.1 and Corollary 4.2** *(proof)*: the full family of Fuchs–Tschimpke comparisons holds iff the symmetrised reflected measure is nonnegative; for exchangeable $C$ this is PMI, and no finite subfamily characterises PMI.
- **Proposition 5.1 and Corollary 5.2** *(proof)*: shared-frailty copulas with at most two frailty values are PMI; three values (rates 1, 2, $m$) fail PMI for all large $m$, certified at $m=200$; a failing example can be MTP2 in every dimension and TP of every order.
- **Theorem 6.1 and Corollary 6.2** *(proof)*: for $-n/2\le s\le1$, $D_s$ ranges exactly over $[d_n(s),3-2s]$, with $d_n(s)=-(3-2s)/(n-1)$ for even $n$ and an explicit parity correction for odd $n$; $d_3(1)=-23/54$ and $\gamma\ge-4/9$ for $n=3$. Remark 6.4 gives a valid bound for $s<-n/2$.
- **Theorem 7.1** *(proof)*: the exact smallest common pairwise generalised Gini's gamma in every dimension.

**Known and new.** Fuchs and Tschimpke defined PMI, proved that it orders the concordance measures and stated the conjecture; Graham refuted PQD ⇒ PMI. The conditionally i.i.d. Gini representation is from Fuchs (2024), the sign–magnitude representation from Ansari, Rockel and Steinmaßl, the generalised Gini representation and compatibility bounds from Koike and Hofert, and the MTP2 criterion from Müller and Scarsini. The other three refutations, the explicit ranges, the comparison duality, the frailty threshold, the exchangeability limits and the Gini equicorrelation slice are new.

## Technical account

**Two independent signs.** For an Archimedean generator perturbed from the independence generator by a small polynomial term, the sign of $C-\Pi$ is governed by a cumulative integral of the perturbation, while the sign of the reflected measure is governed by a local folded density. Choosing the perturbation polynomial (for example $f_B(x)=x+x^2-2x^{100}$) lets the two signs be set independently, and elementary remainder bounds make the ranges explicit rather than "sufficiently small".

**Comparisons and frailty.** Writing the Fuchs–Tschimpke comparisons as integrals against the reflected measure shows that the whole family of comparisons is equivalent to positivity of its symmetrisation, which for exchangeable copulas is PMI itself; a finite subfamily cannot pin down a measure. For frailty mixtures, conditional independence writes the folded density as a sum over frailty values of products $d_i(u)d_i(v)$; with two values it reduces to one nonnegative product, while with three values (rates 1, 2 and $m$) a limit as $m$ grows gives a negative value, certified exactly at $m=200$ by rational bisection.

**Exchangeable ranks.** By Fuchs (2024) and the representation of Ansari, Rockel and Steinmaßl, $D_s$ for an $n$-extendible pair reduces to an extremal problem over the signs and sizes of $n$ exchangeable ranks. With $n$ even the signs can cancel exactly; with $n$ odd one sign is left over, which yields the parity correction and the values $-23/54$ and $-4/9$ for $n=3$. The same extremal laws give the smallest common generalised Gini correlation through the Koike–Hofert representation.

## Evidence, assurance and limitations

- **Proofs.** Every result has a written proof in the 14-page paper, which opens with a context-first introduction (the problem, why it matters, what was known, what is new, the scope and a roadmap) and ends with limits, open problems and an AI-use statement. No proof assistant was used.
- **Computations.** `verify.py` (standard library, exact rational arithmetic) checks every exact constant of the paper: the effect-size slopes and remainder constants, the three-rate frailty certificate, the closed forms of $d_n(s)$ for $n=2$ to $51$, $-23/54$, $-4/9$, attainment by direct integration in 56 cases, the Remark 6.4 bound and $J_k=1/k$. `check_grid.py` (NumPy and SciPy) solves 18 finite-grid linear programs that agree with the exchangeability theorem; it tests the mechanism and does not prove the theorem.
- **Tests that can fail.** Neither script relies on `assert`; each stops with a `FAILED` message and a nonzero exit, also in Python's optimised mode. Changing one exact constant makes `verify.py` fail.
- **Replay.** Both scripts were rerun from fresh copies before release in optimised mode and reproduced the recorded outputs; GitHub CI reruns them on Linux and compares the outputs under a declared policy.
- **Review.** A combined five-perspective Claude review panel, one merged revision round with an extension, and a verification re-review with a proof audit of every new or rewritten proof. The re-review found one major defect (a wrong constant in Remark 6.4), which was corrected and is now checked exactly; nine minor items were applied. No Astra/Codex review ran for this release. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The counterexamples are tiny effects and say nothing about the power of tests; all results are population statements, with no finite-sample test of the cluster limits; the full set of attainable rank correlations for clusters, and the full set of Gini correlation matrices, remain open; attributions rest on literature searches of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Statisticians and risk modellers using rank-correlation tests | A violation of $3\gamma\ge2\rho$ does not rule out every quadrant dependent Archimedean model | The counterexamples are tiny effects; no statement about test power |
| Researchers on dependence concepts and copulas | Four explicit separations, a comparison duality and a frailty threshold | Population statements only |
| Analysts of clustered data | Exact lower limits on Gini's gamma and Spearman's rho combinations for $n$ interchangeable units | Slopes $-n/2\le s\le1$ only; no finite-sample test |
| Research agents | Machine-readable claims, an agent index and exact replayable checks with a failure test | The programs accompany written proofs; they do not replace them |

## Why the problem matters

Rank-correlation inequalities are attractive tests because they need no model for the margins. Knowing exactly which dependence property they detect decides what a failed test rules out. Settling the Fuchs–Tschimpke conjecture in all four directions shows that the two notions of positive dependence must be tested separately, and the cluster limits give exact constraints that any model for exchangeable units must respect.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root:

```sh
python3 -I -B -O verify.py
pip install -r requirements.txt
python3 -I -B -O check_grid.py
```

`verify.py` needs only the standard library and takes under a second; `check_grid.py` needs NumPy and SciPy and takes about ten seconds. `results/verify.txt` must match byte for byte; in `results/check_grid.txt` text and integers must match and floating values may differ within absolute $10^{-9}$. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## Related releases

No earlier release treats quadrant dependence or PMI. Two other copula releases study extremal values of rank-based dependence measures: [Which Lₚ-spherical copulas maximise a generalised Gini mean difference?](/releases/lp-spherical-copula-gini-conjecture/), a generalised Gini question for a different copula family, and [The least functional dependence at negative footrule](/releases/chatterjee-footrule-lower-boundary/), on the region of Chatterjee's rank correlation and Spearman's footrule.

## The most valuable next projects

1. Determine the full attainable set of $(\rho,\gamma)$ for $n$ exchangeable ranks, including slopes $s<-n/2$ and $s>1$.
2. Describe the full generalised Gini compatibility sets beyond the equicorrelation slice.
3. Decide which standard Archimedean families (Clayton, Gumbel, Frank and others) are PMI, and study the power of tests based on $3\gamma-2\rho$.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the 14-page PDF); `verify.py` and `check_grid.py` with their recorded outputs in `results/` and `requirements.txt`; `refs.bib` from Crossref, arXiv and DataCite records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
