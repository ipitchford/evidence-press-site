## Summary

**In one sentence.** The best way to spend a budget of paired comparisons under the Bradley–Terry model can use a set of pairs that contains a loop of four with no shortcut, and its proportions can be irrational numbers; this disproves a 2025 conjecture.

**The setting.** Many rankings are built from head-to-head comparisons: sports and chess ratings, sensory and preference tests, teachers comparing two pieces of work at a time (comparative judgement), and votes between two answers from language models. The Bradley–Terry model gives each alternative $i$ a strength $a_i>0$ and says that $i$ beats $j$ with probability $a_i/(a_i+a_j)$. An experimenter with a fixed budget must decide how much of it goes to each pair. A *design* assigns each pair a share $w_{ij}\ge0$ of the budget; a *locally D-optimal* design, for a guessed strength vector, makes the joint estimate of all strengths as precise as possible (it maximises the determinant of the Fisher information).

**What "chordal" means.** The pairs a design actually uses form a graph on the alternatives. The graph is *chordal* if every cycle of four or more alternatives has a *chord*, a used pair joining two non-neighbouring members of the cycle: a shortcut across the loop. For chordal graphs, problems of this kind usually have exact rational answers.

**What was conjectured.** Röttger, Kahle and Schwabe (*Journal of Statistical Theory and Practice*, 2025) recast optimal Bradley–Terry designs as an electrical-network problem, proved rational formulae for optimal designs whose graph is chordal, and conjectured, from simulations, that the graph of a D-optimal design is always chordal (their Conjecture 12).

**What is now shown.** The conjecture is false. With fourteen alternatives, six weak (strength 71), one of strength 73, one of strength 4260 and six strong (strength 4380), the unique optimal design uses 54 of the 91 possible pairs. Those pairs contain a four-cycle with no chord: a weak alternative, the 73 alternative, a strong alternative and the 4260 alternative (the banner draws the exact graph). Every weight in the design is an irrational number of the form $r+s\sqrt N$. All 91 optimality conditions are checked in exact arithmetic. The effect is not an accident of tied strengths: it persists for nearby strengths, for every number of alternatives from fourteen up, and for an explicit example with all fourteen strengths different.

**What was already known.** The electrical-network formulation and the optimality conditions are Röttger, Kahle and Schwabe's, and closely related work of Röttger, Engelke and Zwiernik (2023) already had non-chordal solutions for general data, where the "costs" of pairs are unrestricted. The question was whether the special costs that the Bradley–Terry model produces rule them out. They do not.

**What survives, and what it means in practice.** Some structure is forced: a loop of four or more can never form a separate block of the comparison graph, and two small five-alternative graphs can never be optimal. The result is about exact optimal structure and formulae, not efficiency: in the example a design restricted to a chordal graph reaches about 99.85% of the optimal efficiency (numerically), while comparing all pairs equally reaches about 64.5%. The example needs widely spread strengths, about 0.98 win probability between the extremes, and its optimality margins are thin, which is why simulations missed it.

## Summary for specialists

Write $\lambda_{ij}=a_ia_j/(a_i+a_j)^2$, $c_{ij}=1/\lambda_{ij}$ and $R_{ij}(q)$ for effective resistance under conductances $q\ge0$. By Lemma 2.1, $q$ certifies the unique D-optimal design $w_{ij}=c_{ij}q_{ij}/(n-1)$ if and only if $R_{ij}(q)\le c_{ij}$ for all pairs, with equality where $q_{ij}>0$.

| Result | Status |
|---|---|
| $a=(71^{\times6},73,4260,4380^{\times6})$: unique optimum on 54 of 91 pairs, $(K_6\sqcup K_6)\vee\overline{K_2}$, induced $C_4$, weights in $\mathbb Q(\sqrt N)\setminus\mathbb Q$ | **Proposition 3.2 (exact certificate)**; disproves RKS 2025, Conjecture 12 |
| Weights along the branch are not rational functions of the strength ratio | **Proposition 3.3 (proof)** |
| Symmetric four-level family nonchordal iff $p>3+2\sqrt2$ per outer group, so $n=14$ minimal there; three-level family minimal at $n=17$ | **Theorems 3.4, 9.1 (proof)**; Proposition 5.1 (exact) |
| Open-set persistence, every $n\ge14$; quantitative persistence lemma; distinct integers $a^0_i(10^{17}+i)$, $n=14$, and $a_i(10^{14}+i)$, $n=18$ | **Lemmas 7.1, 7.2, 8.1; Propositions 6.1, 8.3 (proof and exact checks)** |
| No biconnected block is a cycle of length $\ge4$; supports on $\le4$ vertices and cactus supports chordal | **Theorem 10.1, Corollary 10.2 (proof)** |
| Each cut vertex joins exactly two blocks, weaker on one side and stronger on the other | **Proposition 10.3 (proof)** |
| House and $K_{2,3}$ not optimal on five alternatives | **Proposition 10.4 (proof)** |
| KRS 2021 Problem 15: yes for Bradley–Terry intensities, no for unrestricted intensities | **Corollary 10.2, Remark 10.5** |

The global minimum number of alternatives for a nonchordal optimum is open between 5 and 14.

## Technical account

**Quotient by symmetry.** With tied strengths inside each outer group, the optimal conductances are constant on each orbit of pair types, so the optimality system reduces to a few equations in a handful of unknowns. For the split-middle support (two outer cliques, both joined to two distinct middle vertices, no middle–middle pair) Contracting each outer group turns the network into a four-cycle, and Lemma 3.1 solves the reduced system in closed form: the resulting resistance $h$ involves $\sqrt{U^2-UV+V^2}$, which is not rational at the fourteen-alternative point, and that square root is where the surds come from.

**Exact certificate.** For the fourteen-alternative point the programs build the full $13\times13$ grounded Laplacian over $\mathbb Q(\sqrt N)$, invert it exactly, and check all 91 resistance conditions: 54 equalities on the support and 37 strict inequalities off it. Two separate implementations do this, one also checking 13 positive pivots and the inverse identity.

**Robustness.** Strict inequality on the omitted pairs makes the support stable: by the implicit function theorem the same support stays uniquely optimal on a neighbourhood of strengths (Lemma 7.1), and appending a sufficiently extreme alternative extends a strict certificate to $n+1$ (Lemma 7.2). Lemma 8.1 makes the neighbourhood explicit through spectral bounds on the grounded matrix, which is what certifies the distinct-integer example $a^0_i(10^{17}+i)$: the cost change is below the proved radius.

**Why cycles cannot stand alone.** For a cycle block, Theorem 10.1 first shows that the strengths must increase around such a cycle, then sets the Kalmanson resistance identity for cycles (Forcey and Scalzo, 2020) against a quadrangle inequality that holds for any costs $c_{ij}=h(|\beta_i-\beta_j|)$ with $h$ nondecreasing and convex in the log strengths; Bradley–Terry costs $c_{ij}=2+a_i/a_j+a_j/a_i$ are of this form. Arbitrary costs need not be, which is why Problem 15 has a negative answer for unrestricted intensities (Remark 10.5 gives a four-cycle example). In the counterexample the four-cycle is not a block: the many parallel routes through the two cliques carry the current that a middle shortcut would otherwise carry.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/bradley-terry-nonchordal-designs.txt) is available for reading.

- **Proofs.** Every general result (non-rationality, family thresholds, persistence and all larger dimensions, cycle-block exclusion, cut vertices, five-vertex exclusions) has a written proof in the 24-page manuscript.
- **Exact certificates.** Seven standard-library programs use exact rational or quadratic-field arithmetic, with no floating-point tolerance in any mathematical check. They certify the 14-, 17- and 18-alternative witnesses over all 91, 136 and 153 pairs, four further constructions, the constants and cost change for the distinct-strength example, and the $K_{2,3}$ identities; a seventh makes finite checks of the cycle identities, which support but do not replace the proof.
- **Negative controls.** Corrupting one constant in the 14-, 17-, 18-alternative and distinct-strength checkers makes each fail, also under Python's `-O` flag; every check is explicit rather than an `assert`.
- **Replay.** The runner executes every program normally and under `-O` (14 runs). It was rerun from a fresh copy of the approved package, after DOI insertion and from the frozen archive; logs matched apart from timings and the recorded manuscript hash. GitHub CI reruns it on Linux.
- **Numerical only.** The efficiency figures (0.9985 for the reoptimised chordal design, 0.645 for uniform all-pairs) and the searches that found no smaller example with 5–13 alternatives are numerical evidence, not part of any proof.
- **Scope.** Paired comparisons only; nothing is claimed for choice sets of three or more alternatives. The example needs a wide strength spread and has optimality margins of about $10^{-5}$.
- **Review.** Internal AI-assisted review only: five reviewer roles, an adversarial review by a second model, a proof audit, a second-model audit of the new proofs and a re-review found no correctness issue. A rating-free summary of the objections and their resolution is in the package. None of this is human peer review, independent reproduction or formal verification.
- **Priority.** A dated search on 3 November 2026 (citing works of both source papers, the web, arXiv, GitHub issues including the trureturing repository, and the Evidence Press corpus) found no earlier Bradley–Terry counterexample or solution of Problem 15. A bounded search is not a certificate of priority.

## Relationship to earlier work

The Bradley–Terry model dates from Bradley and Terry (1952); locally D-optimal designs for it were studied by Graßhoff and Schwabe (2008). Kahle, Röttger and Schwabe (2021) analysed saturated optimal designs semialgebraically and posed Problem 15, on whether a four-cycle can ever be optimal on four alternatives. Röttger, Kahle and Schwabe (2025) introduced the graph-Laplacian formulation, proved rational formulae on chordal supports and stated the conjecture disproved here. The same log-determinant objective, with nondecomposable solutions for general data, appears in Röttger, Engelke and Zwiernik (2023); effective-resistance optimisation goes back to Ghosh, Boyd and Saberi (2008), and rational solutions on chordal graphs are familiar from Gaussian models (Lauritzen, Uhler and Zwiernik, 2019). The cycle resistance identity used in Theorem 10.1 is from Forcey and Scalzo (2020).

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers computing optimal paired-comparison designs (sensory testing, comparative judgement, rating systems) | Exact optimal designs need not be chordal or rational, so exact solvers must handle algebraic solutions and non-chordal supports | The efficiency loss from a chordal restriction is tiny in the example; this is about exactness, not practice |
| Algebraic statisticians | A counterexample, the correct reading of Problem 15, and structural results (cycle blocks, cut vertices) towards a replacement for chordality | The global minimum (5 to 14) and two five-vertex graphs remain open |
| Software authors | Test cases with exact certificates for optimal-design solvers | Thin margins: floating-point solvers may round to a nearby chordal design |
| Research agents | Machine-readable claims, an agent index and replayable exact certificates | Certificates are finite; the general theorems rest on the written proofs |

## Why the problem matters

Closed formulae for optimal designs are valuable: they explain the structure of good experiments and give exact answers without numerical optimisation. The chordality conjecture would have meant that the rational formulae of Röttger, Kahle and Schwabe cover every optimal Bradley–Terry design. The counterexample shows they cannot, and points to the structure that actually governs optimal supports.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B run_checks.py --out NEW_DIR   # 7 programs, each normally and under -O; standard library only
pdflatex manuscript.tex && pdflatex manuscript.tex   # rebuilds the paper
```

`AI_INDEX.md` maps each claim to its place in the paper and its evidence, `VERIFICATION.md` describes each program and what rests on written proofs, `PRIOR_ART.md` records the dated search, and `REVIEW_SUMMARY.md` lists the review objections and their resolution.

## The most valuable next projects

1. Find the smallest number of alternatives with a nonchordal optimum, now known to lie between 5 and 14, starting with the two unresolved five-vertex graphs.
2. Characterise which biconnected blocks can occur in optimal supports, the structural condition that should replace chordality.
3. Decide whether a cut vertex of a general optimal support must be extreme within its blocks, as it is for block graphs.
4. Extend the analysis to choice sets of three or more alternatives.

## What is in the evidence package

The 24-page paper (PDF and LaTeX source) with its support-graph figure and drawing script. Seven exact certificate programs, the runner and their recorded logs and verification record. Derivation notes for each construction and the original novelty record. A verification guide, an agent index, the dated prior-art record and a rating-free review summary. Crossref records for the bibliography, contribution and limitation records (`RESEARCH_GATES.json`), citation metadata, CI and SHA-256 sums for every file. The paper is an unrefereed candidate, released for scrutiny.
