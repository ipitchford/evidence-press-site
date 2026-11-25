## Summary

**In one sentence.** How many resolved past cases does an aggregator need before it can combine several forecasters' probabilities as well as an ideal Bayesian? This release gives the exact answer, up to constants, for every level of dependence between the forecasters.

**The everyday problem.** Several forecasters each give a probability for the same yes/no event: rain tomorrow, a patient relapsing, an election. Each has seen different evidence and reports honestly. The best combination is the probability of the event given all the reports together (the **Bayesian aggregator**). But that depends on how the forecasters' evidence overlaps, which nobody knows in advance, so an aggregator has to learn it from a track record of past cases with known outcomes. How long must the track record be?

**Why it matters.** Resolved cases are scarce and slow to collect: elections, rare diseases and economic turning points produce only a few a year. If the record needed grows exponentially with the number of forecasters, one must assume structure, typically that their evidence is independent once the outcome is known, and one should know what that assumption buys and what breaking it costs.

**What was known.** Lin and Chen ([NeurIPS 2023](https://doi.org/10.52202/075280-1564)) set up the model: $n$ experts, each with at most $m$ possible signals, exact calibrated reports, and $T$ independent past cases. For accuracy $\varepsilon$ with confidence $1-\delta$ they showed that conditionally independent experts need between about $\log(1/\delta)/\varepsilon$ and $1/\varepsilon^2$ cases, and arbitrarily dependent experts between about $m^{n-2}/\varepsilon$ and $m^n/\varepsilon^2$. They conjectured that $1/\varepsilon$ is right, and their poster asked about the case in between. Under conditional independence the ideal combination is the classical **multiplicative pooling formula** (their Lemma 5.1, which they credit to Bordley).

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The exact rate at every level of dependence | With $\eta$ measuring how much the forecasters share beyond what each knows about the outcome, the excess error after $T$ cases is of order $\log(1/\delta)/T+\min(\eta,m^n/T)$ | Theorem 1 |
| Independent forecasters | About $\log(1/\delta)/\varepsilon$ cases are needed and suffice, whatever the number of forecasters | Corollary 2 |
| Anything goes | About $(m^n+\log(1/\delta))/\varepsilon$ cases; the earlier lower bound $m^{n-2}$ rises to $m^n$ | Corollary 2 |
| One method for all cases | Fit the pooling formula, fit a lookup table, keep whichever does better on held-out cases; no need to know $\eta$ | Section 3.4 |
| Hard cases invisible to every individual record | Every forecaster's own track record, the base rate and even the full pattern of reports are identical, yet the right combination differs | Section 4.2 |

**The idea.** With a short record, use the pooling formula and accept a bias of size about $\eta$; once the record is longer than about $m^n/\eta$ cases, the joint structure can be learned from a lookup table. Comparing the two on cases held back for testing picks the better one automatically.

**Honest framing.** For conditionally independent forecasters, standard localisation arguments from learning theory already gave the upper bound up to a factor $\log T$. The new parts there are removing that factor and proving matching lower bounds. The main new content is the dependence trade-off and the worst-case construction.

**Limits.** Reports are assumed to be exact, honest, calibrated probabilities; rounding to whole percentages is not covered. The bounds are worst case over all laws, so a particular group of forecasters may be much easier, and the constants are not optimised. With many outcomes a factor of about $k$ (the number of outcomes) remains open. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks.

## Summary for specialists

Each case has an outcome $Y\in\{0,1\}$ and signals $S_1,\dots,S_n$, each with at most $m$ values; expert $i$ reports $R_i=P(Y=1\mid S_i)$. Put $K=m^n$ and $h(r)=P(Y=1\mid R=r)$. The excess risk of a rule $f$ is $\mathbb E(f(R)-h(R))^2$. Dependence is the conditional total correlation

$$I(P)=\sum_y P(Y=y)\,D_y,$$

$$D_y=\mathrm{KL}\Big(P_{R\mid y}\,\Big\|\,\textstyle\bigotimes_i P_{R_i\mid y}\Big),$$

and $\mathcal P_\eta=\{I(P)\le\eta\}$. Let $r_T(\eta,\delta)$ be the minimax excess risk at confidence $1-\delta$.

- **Theorem 1** *(proof)*: for $n,m\ge2$, $T\ge1$, $0<\delta\le1/32$ and $0\le\eta\le\infty$, with
$$b_T=\min\Big\{1,\ \tfrac{\log(1/\delta)}{T}+\min\big(\eta,\tfrac{K}{T}\big)\Big\},$$
there is a universal $C$ with $2^{-17}b_T\le r_T(\eta,\delta)\le C\,b_T$. One learning rule attains the upper bound for every $\eta$, $m$ and $\delta$.
- **Corollary 2** *(proof)*: sample complexity of order $\log(1/\delta)/\varepsilon$ at $\eta=0$ and $(m^n+\log(1/\delta))/\varepsilon$ at $\eta=\infty$.
- **Lemma 4** *(proof)*: the best pooling-family rule has excess risk at most $I(P)/2$.
- **Lemma 5** *(proof)*: least squares over a pointwise-ordered one-parameter family has excess risk $O(\log(1/\delta)/T)$ with no $\log T$ factor.
- **Lemma 6** *(proof)*: the lookup table (histogram) has excess risk $O((K+\log(1/\delta))/T)$.
- **Proposition 7** *(proof)*: with the prior known, the rate is $\min\{1,\eta,(K+\log(1/\delta))/T\}$.
- **Proposition 8** *(proof)*: with unbounded alphabets the rate is $\min\{1,\eta+\log(1/\delta)/T\}$, so any fixed $\eta>0$ rules out uniform consistency.
- **Theorem 9, Propositions 10 and 11** *(proof)*: $k$ outcomes; under conditional independence the upper bound has order $(k^2+k\log(1/\delta))/T$ against a lower bound of order $(k+\log(1/\delta))/T$.

**Known and new.** The model, the earlier bounds, the confidence lower bound and partial $1/\varepsilon$ results in special cases (their Theorems 5.4, 5.5 and 7.1) are Lin and Chen's. Localisation (Bartlett, Bousquet and Mendelson; Koltchinskii) gives the independent upper bound up to $\log T$. The interpolation in $\eta$, the $m^n$ lower bound with every marginal law fixed, the log-free ordered least-squares bound and the known-prior and unbounded-alphabet rates are new here, within a literature search of limited scope.

## Technical account

**Pooling and its bias (Section 3.1).** Replacing each outcome-conditional law of the reports by the product of its marginals turns the Bayesian aggregator into a member of the offset family $f_b(r)=\operatorname{logistic}\big(b+\sum_i\operatorname{logit}r_i\big)$, the multiplicative pooling formula with a fitted prior correction. The chain rule and Pinsker's inequality bound the cost by $I(P)/2$ (Lemma 4).

**No logarithm (Section 3.2).** The rules $f_b$ are pointwise increasing in $b$. For an ordered chain the squared increments add up to at most the squared total, so an $\epsilon$-separated subset of a segment has at most $1+A^2/\epsilon^2$ members, with no $\log(1/\epsilon)$. Chaining with Bousquet's concentration inequality and peeling then give a $\log T$-free bound (Lemma 5).

**The lookup table and validation (Sections 3.3–3.4).** Agrawal's multinomial concentration bound gives the histogram rate (Lemma 6). The estimator splits the cases in half, fits both candidates on the first half and keeps the one with smaller squared error on the second; a Bernstein argument shows this loses only a constant factor and a confidence term.

**Lower bounds (Section 4).** The confidence term comes from two-point tests (Section 4.1). For the $m^n$ term, the alternatives start from a conditionally independent baseline on a dyadic grid and flip hidden signs on two-way interactions. Each alternative has the same prior, the same calibration curve for every expert and the same law of the whole report vector, so only the outcomes reveal the signs. In the smallest case ($m=n=2$) the reports are $31/64$ and $33/64$.

**Many outcomes (Section 6).** Pairwise pooling fits are combined by the least-squares coupling of Wu, Lin and Weng. A factor of order $k$ between upper and lower bounds remains; Section 6 compares the result with Lin and Chen's Theorem 6.1, which can be smaller for many outcomes at coarse accuracy.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/forecast-aggregation-sample-complexity.txt) is available for reading.

- **Proofs.** The 16-page paper opens with a plain introduction (the problem, why it matters, what was known with a table of rates, what is new, the relation to learning theory and a roadmap) and gives written proofs of every result. No proof assistant was used.
- **Exact checks.** `verify.py` checks the finite algebra of the constructions in exact rational arithmetic: the report grids for five choices of $(n,m)$, calibration, the unchanged prior and report law, the divergence and separation constants, the worked example, the Section 4.1 constants, the continuous construction, the coupling inequalities and the explicit lower constant (9075 checks).
- **Illustration.** `simulate.py` runs the estimator on two small laws. On a conditionally independent law with $n=3$ and $m=4$, $T$ times the mean excess risk stayed at about $0.4$ for $T$ from 250 to 4000. This is an illustration, not evidence for the theorems.
- **Tests that can fail.** No check uses `assert`; every check fails explicitly, also in Python's optimised mode. A negative control (one constant in the Section 4.1 check made too small) makes `verify.py` fail.
- **Replay.** Both scripts were rerun from a fresh copy before release; both outputs matched the recorded ones byte for byte. GitHub CI reruns them on Linux with exact comparison for the verification output and a declared tolerance for the simulation.
- **Review.** A combined five-role internal Claude review, the lead's exact checks with a negative control and a small simulation, one revision round, then a re-review and a proof audit of the new and rewritten proofs. No Astra/Codex review took place. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Exact, honest, calibrated reports; worst-case bounds with unoptimised constants; a factor of about $k$ open for many outcomes; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Forecasting platforms and ensemble builders | Know how many resolved cases are needed before anything beyond a pooling formula can be learned, and use held-out comparison to choose | Worst-case rates up to unstated constants; exact calibrated reports assumed |
| Learning theorists | A log-free bound for ordered families and calibrated lower-bound families that fix every marginal law | Binary outcomes for the sharp result; a factor $k$ open for many outcomes |
| Researchers on information aggregation | The cost of dependence measured by conditional total correlation, with matching bounds | Total correlation cannot be estimated from the reports alone |
| Research agents | Machine-readable claims, an agent index and exact checks | The scripts check finite algebra, not the theorems |

## Why the problem matters

Combining forecasts is routine on forecasting platforms, in model ensembles and in expert panels, and the usual default is to pool the forecasters' odds as if their evidence were independent. The result says exactly when that default is the best one can do with the data available, and when the record is long enough to learn more. It also shows that dependence between forecasters can be invisible in every individual track record, so a held-out comparison, rather than inspection of each forecaster, is what protects the user.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with any Python 3.10 or later, from the package root:

```sh
python3 -I -B -O code/verify.py \
  --output results/verification.json
python3 -I -B -O code/simulate.py \
  --output results/simulation.json
```

The first prints `9075 checks, 0 failures: PASS` in under a second. `README.md` lists the files and the comparison policy, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Close the gap between $k$ and $k^2$ for many outcomes, for example by a log-free analysis of the joint multinomial-logistic fit.
2. Rounded or noisy reports: how does the cost of pooling change when forecasts are rounded to a grid?
3. Extremised pooling, which fits a slope as well as an offset; the two-parameter family is no longer ordered.
4. The partial-evidence model of Babichenko and Garber, where the dependence can be bounded explicitly.

## What is in the evidence package

The paper (`manuscript.pdf` and its LaTeX source `manuscript.tex`); `code/verify.py` and `code/simulate.py` with their recorded outputs in `results/`; `requirements.txt` (standard library only); `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
