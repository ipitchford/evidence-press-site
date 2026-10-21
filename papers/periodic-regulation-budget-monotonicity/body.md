## Summary

**What periodic regulation is.** Many control problems have the same shape. Mosquito larvae emerge with the rainy season and a larviciding team kills a fixed share of whatever is in the water. Crop pests are sprayed, a seasonally replenished pool of susceptible children is vaccinated, a fish stock is harvested in proportion to its size, or a pollutant is cleared from a lake. In each case a *stock* is refilled by a seasonal inflow, shrinks by natural decay, and is reduced by control *effort* that removes a fixed fraction of what is present. The effort can be spread out over time or delivered as short pulses, such as a spraying round or a vaccination campaign. With a fixed yearly amount of effort, the planner wants the smallest seasonally weighted average stock.

**What Gavish and Katriel conjectured.** In 2025–26 Nir Gavish and Guy Katriel worked out what the best plans look like in this model. The best plan exists and is unique. It may leave some seasons untreated, and it may include pulses. They then asked what happens when the budget grows. They conjectured that a bigger yearly budget never makes it optimal to do *less* at any time of year. This is not obvious. Effort early in the year lowers the stock later, so with more to spend an optimiser could, in principle, take effort away from one season and spend it in another.

**What was found.** The conjecture is true in the form the authors describe in words. In their model, when the yearly budget rises, the optimal effort in every part of the year stays the same or grows. Treated seasons are nested: a season treated at the smaller budget is still treated at the larger one. No pulse ever gets smaller, and the optimal stock falls at every time of year. In practice, **an optimal plan can be built step by step**. Commit the best plan for today's budget; if the budget later rises, the new best plan is the old one plus an addition, and nothing already scheduled needs to be cancelled.

**When it fails.** The guarantee belongs to the model, and the paper maps where it stops:

- It **survives** limits on how much can be done at once (caps on a round's size or on the treatment rate).
- It **can fail** when effort is cheaper, or works better, in some seasons than in others. Then extra budget can make it optimal to shrink one round. Seasonal efficacy is mathematically the same as a seasonal price.
- With fixed treatment dates, it **can fail** when the cost of the stock is not proportional to its size.
- If the budget counts **doses** (the amount removed) rather than the share removed, the problem becomes a different, linear one. With fixed dates and one best date, the best plan below an eradication threshold is a single campaign on that date.

**The vaccination conjecture.** In a companion paper on vaccination against diseases with seasonal transmission, Gavish and Katriel conjectured that the optimal vaccination rate rises at every moment as the vaccine supply grows (their Conjecture 8). This follows from the main result. It holds as a statement about the whole vaccination schedule, and pointwise except at a narrow, precisely described set of exceptional points where the formula for the rate is itself ambiguous.

**Practical guidance.** Fix the unit of the budget first: shares removed (log-kill units, like fishing mortality) and doses lead to very different recommendations. Then check whether prices or efficacy vary with the season; if they do, the step-by-step property may fail, and the paper gives a check for plans with fixed dates.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Every theorem has a written proof; the identities, worked examples and counterexamples are checked in exact arithmetic and can be rerun. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

**Model** (Gavish and Katriel, *Applied Mathematics & Optimization* 93, 2026). On a period $T$ the state solves $S'=c(t)-[\delta+\eta(t)]S$ with inflow $c\ge0$, decay rate $\delta>0$ and effort density $\eta\ge0$. Effort may be any nonnegative periodic Borel measure $\mu$; a pulse of size $u$ multiplies the state by $e^{-u}$. The cost is $F_{c,w}(\mu)=\int_0^T w(t)S_\mu(t)\,dt$ for a seasonal weight $w\ge0$, and the budget is $\mu(\mathbb T_T)=M$.

**Theorem 1.1 (proved).** Let $c,w\in L^1$ be nonnegative and nonzero, with $c>0$ a.e. or $w>0$ a.e. (the source's uniqueness assumption). For every $M\ge0$ the unique minimiser $\mu_M$ satisfies
$$
0\le M_1\le M_2\ \Longrightarrow\ \mu_{M_1}(E)\le\mu_{M_2}(E)\quad\text{for every Borel set }E.
$$
No continuity or boundedness of $c$ or $w$ is needed, and atoms are allowed. **Corollary 1.2:** supports are nested, every atom is nondecreasing, the cumulative-profile derivatives are ordered wherever both exist, $\|\mu_{M_2}-\mu_{M_1}\|_{\mathrm{TV}}=M_2-M_1$, and the optimal state is nonincreasing in $M$ at every time.

This is the measure-order (weak) form of Gavish–Katriel Conjecture 1, which is what its first formulation and its prose assert. The strict inequality in the source's display is **false in general**. By the source's own small-budget result the optimal supports shrink to measure zero, so for small budgets both optimal measures vanish on a common interval.

**Further results.**

| Result | Status |
|---|---|
| Finite-date core: optimal pulses on finitely many permitted dates are nondecreasing in the budget (Theorem 4.7) | proof; identities certified on 241 exact instances |
| Without uniqueness, one ordered selection of minimisers exists; arbitrary selections need not be ordered (Theorem 6.1) | proof |
| Two-date rule $u_1^*(M)=\min\{M,\max\{0,\tfrac12(M+\kappa)\}\}$, $\kappa=\log\frac{d_1b_2}{d_2b_1}$; marginal shares; seasonal natural removal (Section 7) | proof; worked example certified |
| Unequal prices or seasonal efficacy can reverse the order: $du_2^*/dB=-1/28$ in an explicit two-date model; for two dates, monotonicity in every positive model holds iff the prices are equal; one continuous price reverses the order among all measures (Propositions 8.1–8.3) | proof + exact certificate |
| Price band: for finitely many dates, $\max p/\min p<1/(1-\gamma^2)$ suffices (Theorem 8.5) | proof; algebra certified |
| Dose budgets, finitely many dates: the problem is linear; with a unique best date the optimum below an eradication threshold is one campaign there, the infimum is not attained above it, and with constant weight every schedule ties (Theorem 9.1) | proof; identities certified |
| Pulse caps and treatment-rate caps preserve the order (Theorems 10.1–10.2) | proof |
| Convex costs of post-treatment levels, finitely many dates: an elasticity criterion checked at the optimum; a quadratic cost gives $du_2/dM=-5/18$ (Theorem 11.1, Proposition 11.2) | proof; counterexample certified |
| Vaccination Conjecture 8: measure order always; pointwise for the source's density formula except where it is undefined or uses a discontinuous derivative representative (Theorem 12.1) | proof |
| A sufficient condition on a nonconstant continuous price for all measures; continuous-time dose budgets; nonlinear or multi-compartment dynamics | open |

## Technical account

**A two-date example shows the mechanism.** Suppose treatment is allowed only on two dates a year. Let $x_1,x_2$ be the levels just after each treatment, $a_i\in(0,1)$ the fraction surviving natural decay until the next date, $b_i>0$ the inflow arriving in between, and $d_i>0$ the weighted cost of one unit present just after date $i$. The optimal pulses are $u_1^*=\min\{M,\max\{0,\tfrac12(M+\kappa)\}\}$ and $u_2^*=M-u_1^*$. Take decay $\delta=2$ per year, dates at the start and middle of the year, emergence three times higher in the first half, and constant weight. Then $\kappa=-\log 3$. Everything goes into the mid-season round until the budget reaches $\log 3\approx1.10$ log-kill units. After that, each extra unit is split equally. Raising the budget from 1 to 2 grows the mid-season round from 1 to 1.55 and adds a pre-season round of 0.45. Nothing is cancelled.

**Why pulses, not just levels, are monotone.** Writing the problem in the post-treatment levels $x_i$ makes it separable: the budget becomes $\sum_i\log(a_i+b_i/x_i)$ and the cost is linear in $x$. Standard monotone comparative statics (Topkis; Milgrom and Shannon) then gives monotone *levels*. A pulse, however, is a difference of logarithms of consecutive levels, $u_{i+1}=\log\frac{a_ix_i+b_i}{x_{i+1}}$, and differences of monotone sequences need not be monotone. The new step is an exact identity (Lemma 4.5): each level's elasticity with respect to the budget penalty lies strictly between $\tfrac12$ and $1$. That fixes the sign of every pulse's response on each candidate support. A continuation argument then carries the order across changes of support (Theorem 4.7).

**From finitely many dates to all effort measures.** Theorem 1.1 follows by restricting to finer and finer grids. A quantisation shows that grid optima converge weakly to the measure optimum, and the order passes to the limit on every Borel set. Without the uniqueness hypothesis the same construction yields one ordered family of minimisers (Theorem 6.1).

**Why prices break it.** With a price $p(t)$ the budget $\int p\,d\mu$ is no longer the sum of the logarithmic terms above. The extra weight can make one date's pulse an *inferior input*: extra budget raises the other date's pulse so much that this one falls. Proposition 8.1 gives exact numbers: prices $(5/2,1)$, $a_i=\tfrac12$, $b_i=1$, $d=(13/6,1/6)$, and at $B_0=\tfrac72\log\tfrac32$ the second pulse has derivative $-1/28$ along the optimal path.

**What is new, and what is classical.** Existence, uniqueness and the density formulas are Gavish and Katriel's; the lattice argument for monotone levels is classical. The measure-order theorem, the elasticity identity, the price, cap, dose and elasticity results and the proof of Conjecture 8 were not found in the dated, bounded search recorded in the package; that search does not establish priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/periodic-regulation-budget-monotonicity.txt) is available for reading.

- **Proofs.** Every theorem and proposition has a complete written proof in the 24-page manuscript. No proof assistant was used.
- **Exact checks.** 241 exact rational instances of the core sign identities; the three-date shares; the brackets, derivatives and integer certificate of Propositions 8.1–8.3; the symbolic identities of Theorem 8.5; Theorem 9.1 on 42 random rational models; Proposition 11.2; the worked example. These verify instances and identities, not the general theorems.
- **Exploratory numerics.** Floating-point runs for caps and prices (40 capped models and 40 in-band price models, all monotone; 11 of 40 two-date models with price ratios 2–6 show a decreasing pulse) and a numerical consistency suite. These are evidence only.
- **Replay.** `verify_all.py` regenerates all six committed outputs byte for byte in about 16 seconds. A clean replay in a separate copy reproduced every output byte-identically, and the frozen archive was replayed again before release. Semantic negative controls show that the checks reject the unequal-price branch, a perturbed path and a tampered certificate.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review by a different model (OpenAI gpt-5.6-sol) with a second targeted audit, and a verification re-review that recomputed key values. One false side remark (in Theorem 9.1) and several scope overstatements were found and corrected. A rating-free summary is in the package. This is not peer review, independent reproduction or formal verification.
- **Limitations.** The result is mathematical. It assumes a scalar, linear, first-order response, a linear state cost, exponential pulses and a budget in log-kill units, so it is not an empirical claim about any intervention. The price-band, elasticity and dose results are proved only for finitely many treatment dates. The wording of Conjecture 1 was checked against arXiv v2, not the journal version of record.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Planners of vector control, pest management, pulse vaccination or proportional harvesting | When a fixed yearly effort budget is revised upwards, the optimal plan in this model is the old plan plus an addition, so scheduled rounds need not be cancelled | Holds only when the budget counts shares removed and effort costs and works the same in every season; dose budgets and seasonal prices behave differently |
| Control theorists and applied mathematicians | A proof of the measure-order conjecture for measure-valued periodic controls, a sharp map of its limits, and an elasticity mechanism that goes beyond lattice arguments | Several extensions are finite-date only; the continuous-price and nonlinear cases are open |
| Mathematical epidemiologists | Gavish–Katriel Conjecture 8 on seasonal vaccination is settled in measure form, and pointwise outside a precisely stated set | The model is the disease-free linearisation used by the source; it is not a full epidemic model |

## Why the problem matters

Budgets for seasonal control are usually set in advance and then revised. If a larger budget could make it optimal to cancel a round already planned, staged commitments such as procurement, staff rotas and campaign dates would be fragile. This result shows that, in the basic model, they are not. It also shows exactly which modelling choices break the property: seasonal prices or efficacy, nonlinear costs and dose-counted budgets. A modeller can therefore tell when incremental planning is safe and when it needs checking.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.10 or later and NumPy, SciPy, SymPy and Matplotlib:

```sh
python3 -B -O verify_all.py          # all six outputs, byte for byte, about 16 s
python3 -B -O negative_controls.py   # the checks reject wrong inputs and tampering
shasum -a 256 -c SHA256SUMS
```

Start reading with Section 1 of the paper (the problem in words, the verbatim conjecture and the two-date example), then Lemma 4.5 and Theorem 4.7. `AI_INDEX.md` maps every result to its evidence, and `VERIFICATION.md` states what each check does and does not establish.

## The most valuable next projects

1. Have a specialist in periodic or impulsive optimal control check the finite-date comparison (Theorem 4.7) and the passage to all measures (Section 5).
2. Find a sufficient condition on a nonconstant continuous price under which the measure order holds among all effort measures.
3. Settle dose budgets in continuous time, where the finite linear-programming picture may change.
4. Test whether the elasticity mechanism extends to nonlinear or multi-compartment dynamics, such as the full seasonal epidemic model.

## What is in the evidence package

The manuscript (PDF and LaTeX source), a long-form derivation of the continuous-price counterexample, the check scripts with their committed deterministic outputs, the figure and its data, the replay script and negative controls, the frozen claim and dated literature search, a rating-free review summary, claim, status, assurance and provenance records, an agent index, licences (CC0-1.0 for prose and data, MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
