## Summary

**In one sentence.** When a fractional plan for pairing workers with tasks is turned into a real assignment that never breaks any of $m$ hard budgets, the value lost need never exceed about $7m/3$ times the value of the single most valuable pairing, and exactly one such pairing when there is only one budget; the best general guarantee before was of order $m^2$.

**This is a follow-up.** It builds directly on the earlier Evidence Press release [Linear discrepancy for vector-labelled perfect matchings](/releases/vector-matching-linear-discrepancy/) (3 November 2026, DOI [10.5281/zenodo.23932844](https://doi.org/10.5281/zenodo.23932844)). It refines that release's splitting method and also improves that release's main bound, from $17k$ to $14k/3$. The earlier release is unchanged; the improvement is a new result recorded here.

**The problem.** A platform pairs workers with tasks, one task per worker and one worker per task. In mathematical terms this is a *matching* in a two-sided (bipartite) graph. Each possible pairing has a value, its *profit*, and also uses up shared resources: a subsidy, travel distance, overtime hours, or pairings of a protected type. Each of $m$ resources has a *strict budget*, a total that must never be exceeded. Finding the most valuable assignment within the budgets is hard even for one budget, because it contains the knapsack problem. The standard route is to solve an easier version, a linear programme, that allows fractional pairings ("60% of this worker on that task"), and then to *round* the fractional plan to a real one. Rounding can keep every budget only by giving up some value. This release is about how much.

**Why measure the loss in units of the top pairing, and what is the floor.** Write $W$ for the value of the single most valuable pairing. One pairing whose cost is slightly over its budget can be used fractionally but not at all in a real assignment, so a loss of about $W$ is unavoidable. Take $m$ such pairings, each with its own budget, and a loss of about $m\cdot W$ is unavoidable; this is the classic gap for $m$-dimensional knapsack. So the real question is whether matching costs more than knapsack, and by how much.

**What was known.** In 2014 Grandoni, Ravi, Singh and Zenklusen showed that a loss of order $m^2\cdot W$ always suffices, in any graph. For one budget, Berger, Bonifaci, Grandoni and Schäfer had shown a loss of $2W$. The earlier Evidence Press release introduced a splitting lemma which, applied to budgets on bipartite graphs, already gives a loss of roughly $9m\cdot W$ (Remark 6 of the paper). So the linear order in $m$ was already implicit there; what was missing was a good constant, an algorithm and matching examples.

**What is new here.**

| Result | In plain terms | Where |
|---|---|---|
| A sharper linear bound | Rounding loses at most $\tfrac{14m-5}{6}W\le\tfrac{7m}{3}W$ for $m\ge2$ budgets, and at most $W$ for one budget (previously $2W$); one pairing slightly over budget shows $W$ cannot be lowered | Theorem 1 |
| An algorithm | The rounding is deterministic and runs in polynomial time when $m$ is fixed; guessing the heaviest pairings turns it into an approximation scheme with running time $N^{O(m/\varepsilon)}$ | Section 5, Corollary 7 |
| Improvement of the earlier release | For vector labels on the edges of a complete bipartite graph, some perfect matching is within $\max\{3k+1,\tfrac{14k-5}{3}\}\le\tfrac{14k}{3}$ of any fractional target, instead of $17k$, and it can now be computed for fixed $k$ (answering that release's algorithmic question for piecewise-constant data) | Theorem 8 |
| Exact examples for fair representation | For the whole-number-quota version studied by Aharoni et al., connected examples lose exactly $m(1-1/\Delta)$ at maximum degree $\Delta$. A suggested loss of $m/2$ fails already for one quota at $\Delta=3$ (loss $2/3>1/2$), and for one quota the exact constant is $1-1/\Delta$ | Theorems 9–10 |

**How it works, without the formulas.** An optimal fractional plan is sparse: it has only a few *branch points* where several fractional pairings meet. Between them it consists of alternating paths. Lay all these paths end to end on a line, and cut them all with one pattern of at most $2m+1$ cuts, chosen so that every budget and an adjusted value are kept exactly. Each cut spoils at most half a pairing. The branch points are paid for in advance, by lowering the value of the pairings next to them before the cuts are chosen, so the same cuts also cover the repairs there. Finally, deleting pairings never raises a cost, so every budget stays strictly within its limit.

**Limits.** The results cover bipartite (two-sided) assignments only, with nonnegative upper budgets only: no lower quotas and no costs that can be negative. The constant $7/3$ is not known to be optimal; the floor is $1$ per budget, and closing that gap is open. The algorithm is polynomial only for a fixed number of budgets, and it is a theoretical guarantee, not a practical solver. The linear order in $m$ was already implicit in the earlier release; the advance is the constant, the algorithm and the exact examples. The computer checks test bookkeeping on finite cases and are supplementary to the written proofs; nothing was checked in a proof assistant.

## Summary for specialists

Let $G=(L\mathbin{\dot\cup}R,E)$ be bipartite with costs $a_i:E\to\mathbb R_{\ge0}$, budgets $b_i\ge0$ ($1\le i\le m$) and profits $w:E\to[0,W]$; LP and OPT are the fractional and integral budgeted optima, and $C_m$ is the least constant with $\mathrm{OPT}\ge\mathrm{LP}-C_mW$. Reference [3] below means the earlier release (DOI 10.5281/zenodo.23932844).

- **Theorem 1** *(proof)*: $C_1=1$ and $C_m\le(14m-5)/6\le7m/3$ for $m\ge2$; the matching is found deterministically in time $N^{O(m)}\operatorname{poly}(\mathrm{bits})$. Compare $(m+3)m^2/(m+1)$ in general graphs (Grandoni–Ravi–Singh–Zenklusen) and $(9m-4)$ from the method of [3] directly (Remark 6). The case $m=1$ uses the circular splitting theorem of Grandoni–Ravi–Singh–Zenklusen (Theorem 4.7, extending Stromquist–Woodall); the paper notes and repairs a slip in its printed proof.
- **Lemma 2** *(proof)*: $d$ integrable signed densities on an interval cut into $q$ pieces, with fraction $\alpha_j$ on piece $j$, are matched by one selector with at most $2d-1$ switches strictly inside pieces, independent of $q$. This is the argument of [3, Lemma 5] with junction switches uncharged.
- **Proposition 5** *(proof)*: the loss is at most $W\bigl(S/2+\sum_{v}(1-1/\delta_v)+c_0/2\bigr)$ with $S\le2m+1$ internal switches, summing over real branch vertices of degree $\delta_v$ in the fractional support; $c_0$ counts its cycle components.
- **Corollary 7** *(proof)*: a deterministic $(1-\varepsilon)$-approximation in time $N^{O(m/\varepsilon)}\operatorname{poly}(\mathrm{bits})$; by Doron-Arad–Kulik–Manurangsi the exponent cannot be improved much under ETH.
- **Theorem 8** *(proof)*: vector-labelled perfect matchings of $K_{n,n}$ within $\max\{3k+1,(14k-5)/3\}\le14k/3$ of any fractional perfect matching, polynomial for fixed $k$; [3, Corollary 7] becomes $14k/3+2\sqrt k$.
- **Theorems 9–10** *(proof)*: in problem (2) of the paper (Aharoni et al., Conjecture 1.15), $m\le c_*(m)\le C_m\le7m/3$ and $c_*(1)=1$ (an unattained supremum); the one-quota constant at degree $\Delta$ is $1-1/\Delta$, and connected examples with $m$ disjoint quotas have exact gap $m(1-1/\Delta)$.

## Technical account

**Sparse support.** After a perfect augmentation, an optimal extreme point has a fractional part $\Gamma$ whose cycle rank is at most $m$. Its branch vertices (degree at least three) cut $\Gamma$ into at most $3m$ chains, along which values alternate between $\alpha_j$ and $1-\alpha_j$.

**One selector for all chains.** Lemma 2, applied to the $m$ cost densities and a shifted profit density with signs given by edge parity, gives a selector that preserves every cost and the shifted profit exactly with at most $2m+1$ internal switches; switches at the junctions between chains are free. Lemma 3 shows that each internal switch spoils at most one edge and costs at most half a matched pair; Lemma 4 repairs the branch vertices, which may be covered twice or not at all, by deleting edges.

**Prepaying branch vertices.** Repair at a branch vertex of degree $\delta$ can cost up to $(\delta-1)/2$ pairs. Section 4.2 subtracts a vertex-dependent amount $\lambda_v=(\delta_v-2)/(2\delta_v)$ from the profit of incident edges before splitting, so the convex repair cost lies below its chord and the branch cost drops to $1-1/\delta_v$. With $\sum(\delta_v-2)=2(\beta-c)$ this gives (13) and hence $(14m-5)/6$.

**Algorithm.** For the piecewise-constant densities that arise, a feasible selector is found by enumerating $N^{O(m)}$ cut patterns (initial values and the cells holding at most $2m+1$ switches) and solving a rational linear system for each; Lemma 2 guarantees that one is feasible. For one budget, the two cells holding the ends of a single circular arc are enumerated. Fixed dimension is essential here: consensus halving with the number of measures as part of the input is PPA-complete (Filos-Ratsikas and Goldberg).

**Lower bounds.** The one-quota gadget $G_\Delta$ joins $\Delta$ copies of $K_{\Delta,\Delta}$, each missing one edge, by $\Delta-1$ bridges. A perfect matching cannot use a bridge, so it uses $\Delta^2$ constrained edges, one more than the quota $\Delta^2-1$; an explicit dual certificate shows that the uniform fractional matching is optimal, so the gap $1-1/\Delta$ is exact. A hub joins $m$ gadgets into one connected graph with gap $m(1-1/\Delta)$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/strict-budget-matching-linear-loss.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 17-page paper, which opens with a plain introduction, a table of known bounds, a four-step outline of the proof and a roadmap. No proof assistant was used. The proofs use the Borsuk–Ulam theorem and rational linear programming as standard foundations.
- **Exact certificates for the examples.** `verify_lower_bounds.py` builds the gadgets and checks edge counts, degrees, witnesses and every primal–dual equality in exact rational arithmetic for $\Delta=2,3,4,5$. For $\Delta=3$ it enumerates all 29,992 matchings, of which 64 are perfect, all using nine constrained edges against a quota of eight; for $\Delta=2$ it enumerates all 34 matchings. Connected examples are certified for $(m,\Delta)=(1,2),(2,3),(2,5),(3,4),(4,7)$, with gaps $1/2,4/3,8/5,9/4,24/7$; for instance $(m,\Delta)=(2,3)$ has 38 vertices, 55 edges, LP value $55/3$, integral optimum 17 and gap $4/3$.
- **Bookkeeping checks.** `check_chain_rounding.py` enumerates all switch patterns on chains and cycles of up to eight edges, all small branch-repair configurations and the pointwise inequalities used in Sections 4.2 and 6.
- **End-to-end test.** `check_end_to_end.py` runs the whole rounding on 300 random instances for each of $m=1,2,3$ budgets and each of $k=1,2,3$ label dimensions, and checks in exact arithmetic that the output is a matching, every budget holds, and Proposition 5, Theorem 1 (against a brute-force optimum) and Theorem 8 hold. All checks passed. The selectors found never needed more than $m+1$ (respectively $k+1$) internal switches, fewer than the proven $2m+1$; whether that can be proved is open.
- **A test that can fail.** In a copy of `verify_lower_bounds.py` the gadget kept its missing edge; under Python's optimised mode the script stopped with an error, as it must.
- **Replay.** Every checker was rerun from fresh copies of the package before release, normally and under `python -O`; all six certificate files matched the shipped files byte for byte. GitHub CI reruns all three checkers on Linux.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round. It repositioned the result against the earlier release and the 2014 bound, added Theorem 8 and the end-to-end test, and fixed several smaller points. A re-review and a second-model audit of the new proofs then found no failing result. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Bipartite graphs, nonnegative upper budgets and nonnegative profits only. The constant $7/3$ is not known to be optimal. The algorithm is polynomial only for fixed $m$ and is not a practical solver. The one-budget case relies on a published theorem whose printed proof has a small slip, which the paper repairs. This remains an unrefereed candidate, and attributions rest on a bounded literature search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in approximation algorithms and combinatorial optimisation | A linear additive loss with an explicit constant for strict-budget bipartite matching, and a deterministic scheme with exponent $O(m/\varepsilon)$ | Bipartite graphs and upper budgets only; $7/3$ may not be the right constant |
| People designing allocation and assignment with hard limits (subsidies, travel, group quotas) | A guarantee that rounding a fractional plan never breaks a budget and loses at most about $7m/3$ top pairings; explicit examples showing about $m$ is unavoidable | A theoretical guarantee for a fixed number of budgets, not a solver |
| Researchers on fair representation and colourful matchings | Exact integer-quota examples that refute the suggested loss $m/2$ for arbitrary edge sets, and the exact one-quota constant | The partition case with two classes and the exact value of $c_*(m)$ for $m\ge2$ remain open |
| Readers of the earlier vector-matching release | Its main bound improves from $17k$ to $14k/3$ and becomes computable for fixed $k$ | Consequences that use a random-partition step stay existential |
| Research agents | Machine-readable claims, an agent index and exact checks that rerun in about a minute | The checks test bookkeeping on finite cases; the theorems rest on the written proofs |

## Why the problem matters

Budgeted matching is a basic model for assignment under hard resource limits, and rounding a linear programme is how such problems are solved in theory and often in practice. The additive loss, measured in units of the largest single profit, is what decides whether such rounding gives an approximation scheme and how fast. Bringing the loss from order $m^2$ down to a small multiple of $m$, within a factor $7/3$ of the knapsack floor, shows that for bipartite graphs strict budgets cost hardly more than in knapsack itself.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root, with [uv](https://docs.astral.sh/uv/):

```sh
shasum -a 256 -c MANIFEST.sha256
uv run python3 -O -I -B checks/verify_lower_bounds.py        # under 1 s; writes certificates/ beside checks/
uv run python3 -O -I -B checks/check_chain_rounding.py --output /tmp/chain_check_results.json        # about 20 s
uv run --with numpy==2.3.5 --with scipy==1.16.3 python3 -O -I -B checks/check_end_to_end.py --trials 300 --output /tmp/end_to_end_results.json   # about 45 s
```

Compare each output with the file of the same name in `certificates/`; they are deterministic and identical with and without `-O`. Section 8 of the paper says what each checker tests. `AI_INDEX.md` maps each claim to its proof and checks, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. The constant: is the loss $m+O(1)$ top pairings, matching the knapsack floor? Experiments suggest the splitting lemma may need only $m+1$ internal cuts rather than $2m+1$.
2. Fair representation: is the exact constant $c_*(m)$ equal to $m$ for every $m$?
3. General graphs and matroid intersection: does a linear loss hold beyond bipartite graphs? And can lower quotas or exact counts be handled?

## What is in the evidence package

The paper (Markdown source, Pandoc LaTeX and PDF) with Figure 1; the three checkers in `checks/` and the figure script; all certificate files in `certificates/`; `target.yaml` with the claims, the relation to prior work and the excluded claims; `refs.bib` from Crossref and DataCite records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, figures and data, MIT for code), the CI workflow and SHA-256 manifests.
