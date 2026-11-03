## Summary

**In one sentence.** When the possible pairings between two equal groups come in $k$ colours, there is always a complete pairing whose colour counts are within $17k$ in total of their fair shares, however large the groups are; the previous guarantee grew like $k^2$.

**The problem.** Suppose $n$ workers are to be paired with $n$ tasks, one task each, and every possible pairing has one of $k$ colours: a category such as type of work, site or shift. In graph language this is a perfect matching of the complete bipartite graph $K_{n,n}$. A representative pairing would use each colour in proportion to how often it occurs among all pairings. A random pairing does this on average, but its colour counts fluctuate by amounts of order $\sqrt n$. The question is whether some pairing is off by an amount that depends only on the number of colours $k$, and not on $n$. More generally, each edge can carry a vector label (a colour is a coordinate unit vector), and the target can be any *fractional* pairing, a doubly stochastic matrix that says how much weight each edge should get.

**What was known.** Pardey and Rautenbach showed that exact balance can fail and conjectured an $O(k^2)$ bound for colour-balanced complete graphs. Hollom gave the first bound independent of $n$, of order $4^{k^2}$. In 2026 Hogan, Scott and Tsarev proved $O(k^2)$, and reduced all their applications (spanning forests, Hamilton cycles, hypergraph matchings and more) to that one matching bound.

**What is new.** The paper proves a linear bound: for labels in the unit ball of any $k$-dimensional norm and any fractional target, some perfect matching is within $17k$ of the target. For arbitrary targets this order cannot be improved in the worst case over norms, because a simple example in $\ell_1$ forces an error of exactly $k/2$. For the uniform target of the colour-balancing problem, Hogan, Scott and Tsarev's lower bound is about $\sqrt{k/2}$, so there the truth lies between $\sqrt{k/2}$ and $17k$, and their square-root conjecture stays open.

**The key idea.** Rounding starts from a fractional solution with as few fractional edges as possible. Those edges form a few paths, on which the weights alternate between $\alpha_j$ and $1-\alpha_j$. Earlier work split each path separately, paying $O(k)$ cuts on each of $O(k)$ paths. This paper lays all the paths end to end on one line and cuts them all at once, using a splitting lemma in the Hobby–Rice and necklace-splitting tradition that allows a *different* fraction on each piece: $d$ signed measures on $q$ pieces need only $q-1+2d$ switches in total, instead of about $2qd$.

**Consequences.** Every quadratic bound of Hogan, Scott and Tsarev becomes linear in $k$: colour-balanced perfect matchings of complete graphs ($17k+2\sqrt k$), spanning forests ($O(\Delta k)$), Hamilton cycles ($O(k)$) and complete $s$-partite hypergraph matchings ($17(s-1)k$). The same lemma improves a school-assignment rounding with group-fairness guarantees (Santhini, Munagala, Nasre and Sankar, FORC 2025): an assignment that gives every demographic group at least its optimal utility exists with total capacity violation at most $8g-1$ for $g$ groups, instead of $O(g^2)$.

**How sure we are.** Every result has a written proof. A standard-library script makes 2,374,625 exact checks of the finite bookkeeping in the proofs; it does not check the Hobby–Rice theorem, the limiting argument or any statement for all $n$ and $k$, which rest on the proofs. The proofs show that good pairings exist; they do not give an efficient way to find them. Review was internal and AI-assisted; this is not peer review.

## Summary for specialists

Notation: $h:E(K_{n,n})\to X$ with $\|h(e)\|\le1$ in a $k$-dimensional real normed space $X$; $h(S)=\sum_{e\in S}h(e)$; $x$ a fractional perfect matching (doubly stochastic matrix); discrepancy $\|h(M)-\sum_ex_eh(e)\|$.

| Result (setting) | Bound here | Before |
|---|---|---|
| Theorem 1 ($K_{n,n}$, any target, any norm) | $17k$ | $O(k^2)$; order $k$ sharp for arbitrary targets |
| Corollary 7 (colour-balanced $K_{2kt}$) | $17k+2\sqrt k$ | $O(k^2)$ |
| Proposition 8 (partwise embeddings) | $17\Delta rk$ | $O(\Delta rk^2)$ |
| Corollary 10 (spanning forests; Hamilton cycles) | $O(\Delta k)$; $O(k)$ | $O(\Delta k^2)$; $O(k^2)$ |
| Corollary 11 ($s$-partite hypergraphs) | $17(s-1)k$ | $O_s(k^2)$ |
| Corollary 12 (school assignment, $g$ groups) | violation $\le 8g-1$ | $O(g^2)$ |

- **Sharpness** *(Proposition 2, Remark 13)*: with $n=k$, diagonal labels $e_i$ and target $x=(I+Q)/2$ for a cyclic derangement $Q$, every perfect matching has $\ell_1$-discrepancy exactly $k/2$; the same example gives $\sqrt k/2$ in $\ell_2^k$ and $1/2$ in $\ell_\infty^k$, and a Hadamard labelling gives $\sqrt k/2$ in $\ell_\infty^k$ for $k$ a power of two. Whether order $k$ is needed in $\ell_2$ or $\ell_\infty$ is open.
- **Uniform target** *(Section 1.2)*: Hogan, Scott and Tsarev's Theorem 5.1 gives $\sqrt{k/2}$ for infinitely many $k$; their Conjecture 6.1 ($O(\sqrt k)$) is not settled, and the sparse-support reduction alone cannot distinguish the uniform target from arbitrary ones.
- **Lemma 5** *(simultaneous purification)*: for $d$ finite atomless signed measures $\rho$ on consecutive pieces $I_1,\dots,I_q$ and any $\alpha\in[0,1]^q$ there is a finite union of intervals $A$ with $\rho(A)=\sum_j\alpha_j\rho(I_j)$ and at most $q-1+2d$ switches; $q=1$ recovers the $2d$ endpoint count in the proof of Hogan, Scott and Tsarev's Theorem 2.3.

## Technical account

**Sparse support.** Among fractional perfect matchings with the same label sum as $x$, take one with the fewest fractional edges. Perturbing along an even cycle space of dimension $\beta$ preserves the label sum in a $k$-dimensional space, so the fractional edges have cycle rank $\beta\le k$, the standard extreme-point count of iterative rounding.

**From cycles to alternating paths.** At each vertex of degree above two in the fractional graph, one incident edge is nominated and the others deleted; the deleted set has $O(k)$ edges by a degree-excess count, and what remains is a forest of paths on which weights alternate between $\alpha_j$ and $1-\alpha_j$.

**Joint rounding.** Each path is laid on its own unit interval, the intervals are placed end to end, and the label sums of odd and even edges become $k$ signed measures. Lemma 5 with $d=k$ chooses one set $A$ with at most $q-1+2k$ switches that reproduces $\sum_j\alpha_j(\text{odd labels on path }j)+(1-\alpha_j)(\text{even labels})$ exactly; edges cut by a switch are deleted (Lemma 6, Figure 1 of the paper). The rounded paths form a matching, which is completed to a perfect matching; each deleted edge and each completing edge changes the label sum by at most one in norm, and counting them gives an error at most $|D|+p+2|Y|\le 17k-11$.

**The splitting lemma.** Lemma 5 follows the Stromquist–Woodall halving-and-closure template: a midpoint construction (Lemma 4) built from the Hobby–Rice theorem bisects any two finite unions of intervals with a bounded switch increase; binary expansions of the fractions are realised digit by digit; a compactness argument passes to general fractions, with switches that merge or reach an endpoint handled explicitly. The new content is the statement carried through the recursion, a different fraction on each of $q$ pieces at total cost $q-1+2d$.

**School assignment.** In the FORC 2025 model, after their preprocessing (capacity cost at most $4g+g$) there are at most $g$ fractional paths, each with its own fraction $z_C$, and the groups' utilities are $g$ measures. Their proof rounds each path separately with a common-fraction lemma, at cost $O(g)$ per path. Applying Lemma 5 to all paths at once with $d=g$ keeps every group's utility at least its optimum and adds at most $3g-1$ to the total capacity violation, giving $8g-1$. Only existence is proved; their $n^{O(g)}$-time algorithm is not matched.

**Classical and new.** The sparse-support reduction, the Hobby–Rice theorem, necklace and consensus splitting with a common fraction, and the downstream reductions of Hogan, Scott and Tsarev (who note that any improvement of their matching bound transfers to all their results) are earlier work and are credited. Within a bounded literature search, no earlier linear bound for the matching problem and no earlier statement of the unequal-fraction splitting lemma were found.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/vector-matching-linear-discrepancy.txt) is available for reading.

- **Proofs.** Every lemma, theorem, proposition and corollary has a written proof in the 16-page manuscript.
- **Exact checks.** `check_lemmas.py` (Python standard library only, exact integer and rational arithmetic) makes 2,374,625 checks: the 64 local configurations of Lemma 4; 87,380 cut patterns for paths of up to eight edges in Lemma 6; 510 cases of the binary recursion of Lemma 5 and its switch budget; the lower-bound example in $\ell_1$, $\ell_2$ and $\ell_\infty$ for $k\le8$; the arithmetic of the constant for $k\le40$; and 335,922 choice patterns for the overload count of Corollary 12. These are finite bookkeeping checks, not checks of the theorems.
- **Controls and replay.** Every check raises on failure (no `assert`), so Python's `-O` flag does not disable it, and a built-in mutation test corrupts two cases and confirms that both are caught. From a fresh copy of the package the checker reproduced its retained output with and without `-O` in about three seconds, and the figure script reproduced the PNG figure byte for byte.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review and an audit by a separate model, a line-by-line proof audit and a clean replay led to one revision round, which added the school-assignment application, the sharpness discussion for other norms and the comparison with earlier splitting results; the audits' last findings (a compactness detail in Lemma 5 and an $\ell_\infty$ lower bound in Remark 13) were fixed, and a re-review found no open correctness issue. The revision record is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The proofs are existential; Lemma 5 is not constructive and no efficient algorithm is claimed. The constant $17$ is not optimised. For the uniform target the gap between $\sqrt{k/2}$ and $17k$ is open. The literature search was dated and bounded, with no subscription databases or author enquiry; specialists in necklace splitting should check whether Lemma 5 is known.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Combinatorialists working on colour-balanced and zero-sum structures | A linear bound and a transfer to forests, Hamilton cycles, factors and hypergraph matchings | The square-root conjecture for the uniform target remains open |
| Researchers in fair assignment and multi-criteria matching | A guarantee that a rounding with error linear in the number of criteria exists, for example school choice with group-fairness constraints | Existence only; no efficient algorithm and the constant is not optimised |
| Researchers in measure splitting and fair division | A splitting lemma with different fractions on different pieces at cost $q-1+2d$ | May be known in other language; specialist check invited |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks cover bookkeeping; the theorems rest on the written proofs |

## Why the problem matters

Many allocation problems want an assignment that is representative on several criteria at once: pairings spread fairly across categories, students spread across schools while every demographic group keeps its share of utility. Linear programming gives a fractional answer that is perfect on average; the question is how much must be given up to make it whole. An error that grows like the square of the number of criteria becomes large quickly; one that grows linearly keeps multi-criteria rounding practical in principle, and the order cannot be improved for arbitrary targets.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root, with Python 3.9 or later:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B check_lemmas.py my_results.json        # about 3 s; standard library only
python3 -O -I -B check_lemmas.py my_results_O.json   # same result: no assert statements
python3 -I -B check_lemmas.py --self-test-mutation   # corrupts two cases and shows both are caught
```

`make_figure.py` redraws Figure 1 with Matplotlib 3.10.8. `AI_INDEX.md` maps each result to its section and evidence, `CHANGES.md` records how each review item was handled, and `novelty_report.md` records the sources inspected and the dated searches.

## The most valuable next projects

1. Close the gap between $\sqrt{k/2}$ and $17k$ for the uniform target; a proof of the square-root conjecture must use the uniform target beyond the sparse-support reduction.
2. Decide whether colour-balanced complete graphs $K_{2kt}$ admit a perfect matching with imbalance bounded by an absolute constant.
3. Determine the arbitrary-target order in $\ell_2^k$ and $\ell_\infty^k$.
4. Lower the constant $17$; the deletion and completion counts are crude.
5. Find a polynomial-time version for fixed $k$, and decide whether Lemma 5 follows from classical results on principal representations or bang-bang controls with switch bounds.

## What is in the evidence package

The paper (PDF and Markdown source) with Figure 1 and the script that draws it; `check_lemmas.py` with its retained output `verification_results.json`; the bibliography (`refs.bib`) with the Crossref, DataCite and arXiv records it was copied from; the novelty report; a revision record (`CHANGES.md`); `AI_INDEX.md`, `RESEARCH_GATES.json`, citation metadata, the CI workflow and `MANIFEST.sha256`. Text and figures are CC0-1.0; code is MIT. This remains an unrefereed candidate.
