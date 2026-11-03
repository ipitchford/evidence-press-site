## Summary

*How to read this page.* The Summary is in plain English and is enough for most readers. Specialists can go straight to the exact statements in the next section; the Technical account explains how the proofs work. Evidence, limits, credit and the route to rerun the checks follow.

**The question.** People learn from one another in two broad ways. Sometimes a single long encounter, an apprenticeship or a season spent with an expert, passes on many things at once. Sometimes knowledge travels piece by piece, a technique here and a word there, through many brief contacts. Does it matter which way a population learns, if every individual piece of knowledge (a *trait*) is passed on at the same average rate either way?

**What is held fixed.** The paper works in a standard mathematical model of how a population accumulates cultural traits (Wakano, Ohtsuki, Kobayashi and Baake, 2026). Individuals invent new traits, learn from one another and die, and a death erases everything that individual knew. At each learning encounter every trait the teacher knows is copied independently with probability $b$, and encounters happen $1/b$ times as often. So the rate at which any single trait is passed on never changes; only how *bundled* the learning is changes. At $b=1$ each encounter passes on everything; at small $b$ each trait travels through its own encounters.

**The answer: same averages, different risks.**

- *Averages do not change.* The expected number of traits a group holds, and the expected number known to exactly $k$ people, are the same at every degree of bundling.
- *Variability rises with bundling.* Traits that travel through the same encounters share their fortunes: they spread together, and they are lost together when their few carriers die. Across the possible histories of a population, the trait count becomes more spread out around the same average. The mathematical name for "more spread out with the same mean" is *convex order*, and every trait count of this kind increases in convex order as $b$ increases.
- *So risk rises.* Bundled learning makes the expected shortfall below any target larger and makes losing everything more likely.

The same holds when forgetting comes in bundles too. With one extra assumption (new traits arrive in Poisson numbers) it also holds for the discrete-generation model in which Wakano and Aoki (PNAS, 2024) posed this as an open question.

![Two timelines of three individuals. Left, bundled copying (b = 1): few encounters, each copying every trait, so two traits travel through the same encounters. Right, partial copying (b = 1/4): four times as many encounters, each copying a trait with probability 1/4, so the two traits mostly travel through different encounters. A cross marks a death, which removes every trait at that individual under both arrangements.](/assets/figures/bundled-cultural-transmission-risk-schematic.png "Figure 1 of the paper. The mechanism: under bundled copying two traits share their encounters and their fate; under partial copying they mostly travel separately.")

**How big is the effect?** It depends on whether learning outpaces loss. Below the critical learning rate, where the repertoire stays small, bundling changes the variance by at most about a quarter (the ratio of variances stays above about 0.75). Above it the effect is dramatic and grows with population size. At the setting of the source simulations (100 individuals, learning rate 1.3 times the death rate), copying 93% of a teacher's traits per encounter, instead of all of them, already leaves only a third of the whole-repertoire variance.

![Four panels, one for each learning rate relative to the death rate (0.7, 1, 1.3 and 2), showing the variance at partial copying divided by the variance at whole-repertoire copying against the copying probability b, for populations of 10 to 150. Below the critical rate the curves stay above about 0.75; above it they collapse towards zero as the population grows, with most of the change close to b = 1.](/assets/figures/bundled-cultural-transmission-risk-variance.png "Figure 2 of the paper. Variance at partial copying relative to whole-repertoire copying, V_N(b)/V_N(1). Every curve has the same expected repertoire at every b.")

**A two-person example.** With two individuals ($u=1$, $\beta=2$, $\mu=1/2$) the expected repertoire is $3/2$ at every $b$, while its variance rises from $53/20$ (independent clocks, $b\to0$) through $11/4$ and $23/8$ to $13/4$ at $b=1$.

**What it does not say.** This is a neutral, idealised model with no data. The chance of falling below one particular threshold is *not* always higher with bundling (an exact example is in Section 4.4 of the paper); what is ordered is the expected shortfall, which weighs how far the count falls. Complete loss of every trait is extremely rare in large populations. And because averages are unchanged, a model fitted to average trait frequencies cannot reveal how bundled learning is.

## Summary for specialists

Model: $N$ sites with reset rates $u_i$, innovation rates $\mu_i$ (unique traits) and directed potential encounters at rate $a_{ji}/b$; at each encounter every donor trait is copied independently with probability $b$, so the effective per-trait rate $a_{ji}$ (Wakano et al.'s $s$; our $\beta$ in the homogeneous case) is fixed. $b=0$ is the independent-clock limit. Counts $N_{\mathcal S,b}$ are numbers of traits whose carrier set lies in a family $\mathcal S$: the repertoire $C_A$ of a group $A$, the popularity counts $P_k$ and $P_{\ge k}$.

| Result | Content | Status |
|---|---|---|
| Theorem 1 | Given the potential-encounter and reset history $(G_b,D)$, counts for disjoint families are independent Poisson with mean $M_{\mathcal S,b}=\mathbb E[R_{\mathcal S}\mid G_b,D]$; $\mathbb EN_{\mathcal S,b}$ does not depend on $b$ | Proof |
| Theorem 2 | For $0\le b_1\le b_2\le1$: $M_{\mathcal S,b_1}\le_{\rm cx}M_{\mathcal S,b_2}$ and $N_{\mathcal S,b_1}\le_{\rm cx}N_{\mathcal S,b_2}$ for every family, stationary or from an empty start | Proof |
| Corollaries 1–2 | Variance, $\mathbb E(q-N)_+$, $\mathbb E(N-q)_+$ and $\mathbb P(N=0)$ nondecreasing in $b$; covariance matrix of disjoint counts nondecreasing in the positive-semidefinite order | Proof |
| Proposition 1 | $\operatorname{Var}C_{A,b}$ (equivalently $\mathbb P(C_{A,b}=0)$) is strictly increasing iff some site with $\mu_j>0$ has a directed path of length $\ge1$ into $A$; otherwise the law does not depend on $b$ | Proof |
| Section 4.4 | $\mathbb P(C\le q)$ is not ordered: exact $N=2$ counterexample | Exact computation |
| Theorem 3 | Bundled forgetting (loss events at rate $u_i/d$ deleting each trait with probability $d$): ordered in $b$ and $d$ separately; Poisson at $b=d=0$ | Proof |
| Theorem 4 | Wakano–Aoki discrete Versions with Poisson innovation: $C^{(2)}_A\le_{\rm cx}C^{(1)}_A\le_{\rm cx}C^{(3)}_A$, equal means, for every age/carrier count; strictness in Appendix E | Proof; fails for Version 2 without Poisson innovation |
| Section 7 | $V_N(b)/V_N(1)$ for $\beta/u\in\{0.7,1,1.3,2\}$, $N\le150$; at $N=100$, $\beta=1.3$: $V(13/14)/V(1)=0.336$ | Numerical (exact linear systems in floating point) |
| Corollary 3 | Whole-population complete-loss rate increases and mean nonempty episode decreases with $b$ | Proof |
| Corollary 4 | $(\mathbb EP_1,\mathbb EP_2,\operatorname{Var}C_{V,b})$ identify $(\eta,\tau,b)$; the expected spectrum alone carries no information about $b$ | Proof |

## Technical account

**Conditionally Poisson counts (Section 3).** Fix the history of potential encounters and resets. Each innovation independently marks every potential arrow with a Bernoulli($b$) success, and its carrier set at the observation time is a function of its own marks. By the Poisson marking theorem, counts of innovations whose carrier sets fall in disjoint families are independent Poisson variables whose means are the integrated landing probabilities. At $b=1$ this is the mixed-Poisson ancestry formula of Wakano et al. (2026, equation 15).

**The ordering (Section 4.2).** Couple all values of $b$ on one space: draw the successful-arrow graph $H$ at the effective rates, then add independent extra arrows to form the potential graphs $G_2$ (at $b_2$) and $G_1\supseteq G_2$ (at $b_1<b_2$), with one reset history. Then $H\to(G_2,D)\to(G_1,D)$ is a Markov chain, so $M_{b_1}=\mathbb E[M_{b_2}\mid G_1,D]$: observing more frequent, less informative encounters is observing the fully informative ones through extra noise. Conditional Jensen gives the intensity ordering, and convexity of $x\mapsto\mathbb E\phi(\mathrm{Poisson}(x))$ (the scalar case of Błaszczyszyn and Yogeshwaran, 2009, Proposition 3.6) lifts it to counts.

**Strictness (Section 4.3, Appendix D).** If an inventing site reaches $A$ by a directed path, an explicit positive-probability history leaves the success of that path's encounters genuinely uncertain given the coarser history, so the conditional variance in Jensen is positive. Otherwise no trait can reach $A$ through learning and $b$ has no effect.

**Shape of the variance (Section 4.5).** The Poisson isometry and Mehler's thinning formula give $V(b)=V(0)+\sum_{k\ge1}a_kb^k$ with $a_k\ge0$, so $V$ is increasing and convex with the chord bound $V(b)\le(1-b)V(0)+bV(1)$. When high-order terms dominate, the increase concentrates near $b=1$, as Section 7 finds.

**Extensions.** Bundled forgetting adds independent marks on loss events and uses the same two-channel coupling (Theorem 3). In the discrete model the information traits share is nested: nothing (Version 2), the potential-model assignment (Version 1), the successful links (Version 3); the intensities form a reverse martingale (Theorem 4). Exact second moments come from a finite linear system for two independent thinnings of one history (Section 9), solved in a subtraction-free covariance form for large $N$.

**Classical and new.** Poisson marking, conditional Jensen ("information garbling"), the Cox-process lifting of convex order, Mehler's formula, renewal identities and paired-genealogy variance computations are established tools, credited where used. The model-specific content is the conditional Poisson representation for these genealogies, the ordering for every carrier-pattern count, the exact strictness criterion, the bundled-forgetting and discrete-version extensions, and the computations.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/bundled-cultural-transmission-risk.txt) is available for reading.

- **Proofs.** Written out in the 20-page paper; not machine-verified.
- **Computer checks.** Independent representations are made to agree: a forward moment closure on carrier-set counts matches the backward pair system in exact rational arithmetic (homogeneous $N=3,4$, a heterogeneous directed network, a directed chain); an independently written backward implementation; an exact grid for bundled forgetting; exact rational chains for the discrete versions; and a forward simulation tracking actual trait identities through 100,000 regenerative cycles at each of four values of $b$. In total 87 + 50 + 146 + 68 + 9 explicit checks plus the discrete chains; they are finite checks of the mathematics, not observations of people.
- **Replay.** The exact checks were rerun from a clean copy of the frozen archive with Python `-I -B` and with `-O` (CPython 3.11.14, NumPy 2.3.5, SciPy 1.17.0, SymPy 1.14.0, Matplotlib 3.10.8); every check passed and every recorded value matched the shipped results. The scripts use no `assert` and exit with status 1 on any failure. GitHub CI on Linux reruns them in both modes. The 26-minute large-population study was not rerun at release.
- **Numerical values.** Section 7's effect sizes are floating-point solutions of exact linear systems with residual checks and cross-checks, not interval certificates.
- **Scope.** Neutral traits, independent given the shared history; no prerequisites, memory limits or contact rates that respond to culture. The threshold probability $\mathbb P(C\le q)$ is not ordered. Complete loss is extremely rare in large populations ($3.2\times10^{-10}$ at $N=100$, $\beta=1.3$). Estimating bundling from variance needs replicated, independently evolving populations and assumes whole-site deaths. The discrete-model result assumes Poisson innovation; the full text of Kobayashi et al. (2018) was not obtained, so that model is taken from Wakano and Aoki's description.
- **No data.** The model is not fitted to any population and does not explain any specific historical or archaeological loss.
- **Review.** Internal AI-assisted review only: five reviewer roles, an adversarial review by a second model, one revision round with extensions (bundled forgetting, the discrete versions, the strictness criterion and the scaling study), re-review, and a proof audit and second-model audit of the new proofs. None of this is human peer review, independent reproduction or formal verification.
- **Prior art.** A bounded literature, corpus and GitHub search found no earlier proof of these orderings; this does not certify priority.

## Relationship to earlier work

- **Wakano, Ohtsuki, Kobayashi and Baake** ([2026](https://doi.org/10.1016/j.tpb.2025.12.003)) set up the continuous-time model, gave the mixed-Poisson formula at $b=1$, and explored the matched-rate comparison by simulation (their Section 4 and Figure 16). This paper proves what those simulations suggested.
- **Wakano and Aoki** ([2024](https://doi.org/10.1073/pnas.2322880121), §§1.6.1–1.6.2) remarked, without proof, that shared cultural parents should make counts fluctuate more and that package transmission may increase the variance of the cultural spectrum, and listed distributions beyond means as unresolved. Theorem 4 and Corollary 2 give these remarks a rigorous form.
- **Baumdicker and Pfaffelhuber** ([2014](https://doi.org/10.1214/EJP.v19-2642), Remark 2.4) observed, for genes moving between bacteria, that transferring or losing several genes in one event preserves first moments but changes second moments. That is the same phenomenon in another field; the present paper supplies a full distributional ordering for cultural accumulation.
- **Błaszczyszyn and Yogeshwaran** ([2009](https://doi.org/10.1239/aap/1253281057)) proved the convex ordering of Cox processes used in the Poisson step.
- In population genetics, recombination plays the role of partial copying: linked sites share one genealogy and the number of segregating sites has excess variance (Watterson, 1975), which recombination reduces at fixed mean (Hudson, 1983).

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Cultural-evolution modellers | Fits of expected trait-frequency spectra cannot reveal how bundled learning is; bundling changes the risk of loss, not average diversity | Neutral idealised model; matched per-trait rates are a normalisation, not a description of time or attention |
| Archaeologists and anthropologists discussing cultural loss | A precise statement that apprenticeship-style (bundled) transmission makes extreme histories, including total loss, more likely at the same average | No data; does not explain any specific loss; threshold probabilities are not ordered |
| Population geneticists and microbial genomicists | The linkage/recombination and multi-gene-transfer analogues in exact convex-order form | The gene-transfer coalescent itself is not formalised here |
| Probabilists | A clean worked case of information garbling and Cox-process ordering with an exact strictness criterion | The tools are standard; the content is model-specific |
| Research agents | Claim map, agent index and replayable exact checks | Checks corroborate; results rest on the written proofs |

## Why the problem matters

Arguments about cultural loss, from the Tasmanian case to "evolution in leaps", turn on how likely a population is to lose what it knows. Models that track only how fast each trait is passed on implicitly treat traits as travelling separately. This paper shows exactly what that assumption hides: at the same average, bundled learning links the fates of different traits, so the range of possible histories widens and the worst outcomes become more likely. It also answers, in the setting where it can be answered exactly, a distributional question that Wakano and Aoki left open.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
PY="uv run --with numpy==2.3.5 --with scipy==1.17.0 --with matplotlib==3.10.8 --with sympy python3 -I -B"
$PY code/run_checks.py --reuse-forward results/verification.json --out rerun/checks   # exact checks, seconds
$PY agent_math/pair_ancestry.py --out rerun/pair
$PY code/forward_closure_check.py --out rerun/fc                                   # about a minute
$PY code/partial_forgetting_check.py --out rerun/pf
$PY code/discrete/exact_versions.py 3 2 4/5 1/2
$PY code/run_checks.py                                                             # adds the 400,000-cycle simulation, about 40 s
```

Each certificate script ends with a line such as `all 146 checks passed` and exits with status 1 otherwise, also under `python -O`. The README lists the longer computations (the scaling study takes about 26 minutes), `AI_INDEX.md` gives a machine-oriented claim map, and `development_notes/novelty_note.md` records the prior-art search.

## The most valuable next projects

1. A large-population theory of the boundary layer near $b=1$, where most of the variance change happens.
2. Statistics computable from a single population, such as co-carriage of pairs of traits, that identify bundling.
3. The discrete model with non-Poisson innovation, where Version 2's position can change.
4. Traits with prerequisites or limited memory, where bundling might protect a dependent cluster.
5. Formalising the gene-transfer analogue in the infinitely-many-genes coalescent.

## What is in the evidence package

The 20-page paper (PDF and its pandoc Markdown source) with two figures; the code: exact rational checks, two independent backward implementations, a forward moment closure, the bundled-forgetting grid, a forward simulation, the large-population scaling study, the discrete-version chains and the figure scripts, with every machine-readable result; working notes including the prior-art audit and sceptical checks; an agent index and research-gate record. Licences (text, figures and data CC0-1.0; code MIT), citation metadata, CI and SHA-256 sums for every file. This is an unrefereed candidate, released for scrutiny.
