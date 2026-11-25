## Summary

**In one sentence.** Among trees with a given number of points and a given diameter, this candidate determines exactly how far the largest possible total distance must fall below its obvious ceiling, to second order: the shortfall is about $0.4775\,(dn)^{3/2}$, a constant that Cambie had confined to a window between $0.4714$ and $0.4833$.

**The everyday question.** Take a network shaped like a tree (no loops) with $n$ points, and add up the distances between every pair of points. Divided by the number of pairs, this is the average distance. The total is the **Wiener index**: the chemist Harry Wiener introduced it in 1947 to predict the boiling points of paraffins, and it is now a standard measure of how spread out a network is. Suppose you are told the **diameter** $d$, the longest distance in the tree. How spread out can the tree be? No distance can exceed $d$, so the average is below $d$. The question is how far below it must fall.

**What was known.** Plesník, who found the *smallest* total for given $n$ and $d$, remarked that upper bounds seem much more difficult; the maximum has since been called Plesník's problem. For trees, the largest total $M_d(n)$ lies just below $(d/2-\varepsilon/4)\,n^2$, where $\varepsilon$ is $0$ or $1$ by the parity of $d$. Exact answers existed only for diameters up to four (and partly five and six) and for trees that are almost a single path. In 2020 Stijn Cambie showed that the shortfall grows like $(dn)^{3/2}$ and pinned its coefficient between $\sqrt2/3\approx0.4714$ and $29/60\approx0.4833$, a gap of about 2.5 percent, taking limits in a fixed order. The exact value was open.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The exact coefficient | Whenever $d$ grows but stays small compared with $n$, the shortfall is $\kappa\,(dn)^{3/2}$ to leading order, with $\kappa=\sqrt{(175-\sqrt7)/756}\approx0.4775$. No order of limits is imposed | Theorem 1.1 |
| Every fixed diameter | The next two terms, with rational constants computed from the electrical resistance of small trees; for example $M_8(n)=4n^2-\sqrt{70}\,n^{3/2}-n+O(\sqrt n)$ | Theorem 1.2, Table 2 |
| Rigid shapes | For large $n$ every best tree is built from a finite catalogue of branch shapes, so the exact maximum can in principle be computed very fast (the algorithm is proved to exist, not implemented) | Theorem 4.1, Corollary 4.2 |
| Diameter five | A complete formula, with every best tree, for every $n\ge6$ | Theorem 8.1 |
| Where rigidity begins | Exact computations up to 3000 vertices show where the predicted catalogue actually takes over for diameters 6 to 11 | Section 4 |

**The shape of the best trees.** Each branch splits into two equal halves, again and again, and each new split comes when only a quarter as much height remains as at the split before.

**The idea.** The shortfall is a sum, over branches, of a "depth cost" and the squares of subtree sizes. Treat the leaves as an electric current flowing out from the centre: the squared sizes are the energy of that current. For large diameter the problem becomes continuous (mass flowing down, splitting for free) and is solved by one polynomial whose splitting excess is a sum of two squares. Equality holds only for equal halves at the right height, which forces the factor $1/4$.

**Limits.** The results concern trees only: for general graphs the answer differs when $d$ is odd, and for even $d$ it agrees only if a question of Cambie has a positive answer. "Exact" means the leading coefficient; smaller terms in that regime are open, as is the regime where $d$ is a fixed fraction of $n$. The thresholds in the fixed-diameter and shape theorems are effective but not computed, and the fast algorithm is not implemented. This is an unrefereed candidate; its assurance is internal AI-assisted review, an exact symbolic certificate of the key inequalities and exact computations.

## Summary for specialists

Write $d=2r+\varepsilon$, $\varepsilon\in\{0,1\}$, $h=r-1$, $z=1+\varepsilon$ and $\Delta_d(n)=(d/2-\varepsilon/4)n^2-M_d(n)$. For a stem $H$ (a branch without its vertices at depth $r$) let $A(H)$ be its depth cost and $R(H)$ the effective resistance from the centre to its tips; $c_h=\min AR$ over proper stems of height $h$, and $\beta_h$ is the best tie-breaker among minimisers.

- **Theorem 1.1** *(proof)*: there are absolute $C_1,C_2$ such that for every $h\ge1$ and $n\ge C_1h$,
$$\begin{aligned}\big|\Delta_d(n)-2\sqrt{c_h}\,n^{3/2}\big|&\le C_2\,nh^2,\\ \big|2\sqrt{c_h}-K(h+\tfrac12)^{3/2}\big|&\le0.49,\end{aligned}$$
with $K=\sqrt8\,\kappa\approx1.35050$. Hence $\Delta_d(n)/(dn)^{3/2}\to\kappa=\sqrt{(175-\sqrt7)/756}$ whenever $d\to\infty$ and $d/n\to0$. Cambie's bracket was $[\sqrt2/3,\,29/60]$ in iterated limits.
- **Theorem 1.2** *(proof)*: for fixed $d\ge4$,
$$\begin{aligned}M_d(n)&=\big(r+\tfrac\varepsilon4\big)n^2-2\sqrt{c_h}\,n^{3/2}\\&\quad-(zr+\beta_h)\,n+O_d(\sqrt n),\end{aligned}$$
with $(c_h,\beta_h)$ equal to $(1,1)$, $(6,-1)$, $(35/2,-3)$, $(77/2,-8)$, $(72,-15)$, $(120,-21)$, $(186,-31)$ and $(273,-43)$ for $h=1,\dots,8$. This recovers the Mukwembi–Vetrík expansion at $d=6$ and gives $M_8(n)=4n^2-\sqrt{70}\,n^{3/2}-n+O(\sqrt n)$.
- **Theorem 4.1 and Corollary 4.2** *(proof)*: for large $n$ every branch of every maximiser has one of finitely many optimal stems, with size and leaf counts determined up to bounded errors; for each fixed $d$, $M_d(n)$ is computable exactly in time polynomial in $\log n$ (via fixed-dimension integer programming; not implemented). For fixed radius $q\ge2$ the maximisers among trees of radius $q$ are, for large $n$, the diameter-$2q$ maximisers.
- **Theorem 8.1** *(proof, exhaustive check)*: an explicit formula for $M_5(n)$ and all maximisers for every $n\ge6$; at $n=54$ the maximiser is unique and $M_5(54)=5530$.
- **Where rigidity begins** *(exact computation)*: for $6\le d\le11$ and $n\le3000$, at $d=6,7$ every maximiser uses optimal stems only (every $n\ge10$); for $d=8,9,10,11$ the last orders at which some maximiser uses a non-optimal stem are $597$, $1034$, $288$ and $289$. At $d=8$ there are $348$ orders $n\le596$ with no all-optimal maximiser; $n=249$, with $M_8(249)=215016$, is one of them.

**Known and new.** Cambie found the $(dn)^{3/2}$ scale and the bracket, built lower constructions from branches forking in two at geometrically spaced heights (ratio about $0.38$), and proved that every leaf of a maximiser lies at full depth; that lemma is used here. Exact results for $d\le4$ and $d\ge n-3$ are due to Wang and Guo and to Wagner, and sharp bounds for $d\le6$ to Mukwembi and Vetrík. New here, within a literature search of limited scope: the constant $\kappa$ in the joint regime, the fixed-diameter expansions for $d\ge7$, the rigidity theorem and the complete diameter-five answer.

## Technical account

**The distance identity (Section 2).** Cutting an edge separates $b$ vertices from $n-b$, and the edge lies on $b(n-b)$ paths. Summing over edges gives, exactly,
$$\begin{aligned}\Big(r+\frac\varepsilon4\Big)n^2-W(T)&=zrn+\delta^2\\&\quad+\sum_{\text{branches}}Q_n,\end{aligned}$$
where a branch with stem $H$ and size $b$ costs $Q_n=nA+\sum_{v\in H}b_v^2+(b-s)$. Routing $b$ leaves through a fixed stem costs at least $Rb^2$ (minimum energy), and optimising the number and size of branches turns $nA+Rb^2$ into $2\sqrt{AR}\,n^{3/2}$.

**Fixed diameter (Section 3).** A construction from optimal stems keeps the total excess over the ideal cost at order $\sqrt n$, whereas any branch whose stem is not optimal costs order $n$ extra. So large maximisers use only optimal stems, and summing their exact costs gives the expansion, with the tie-breaker $\beta_h$ in the $n$ term.

**The calibration (Section 5).** For large height, give a stem a root mass $x$ and read each edge as an interval of remaining height $\tau$ with cost $\int(\tau+m^2)\,d\tau$. The function $g(\tau,x)=\tau^2/2+\tau x^2-x^4/7$ satisfies
$$\begin{aligned}&g(\tau,y)+g(\tau,z)-g(\tau,y+z)\\&\quad=\tfrac12(\tau-2yz)^2+\tfrac47\,yz(y-z)^2,\end{aligned}$$
so a split is free only when the halves are equal and $\tau=x^2/2$. After a modification at large mass this becomes a function $V$ that is subadditive in the mass, bounded below by $Kx\tau^{3/2}$ and dominated by the running cost; integrating along any stem gives the lower bound, and rounded dyadic constructions give the matching upper bound (Theorem 5.1). Every constant and inequality in this section has an exact symbolic certificate.

**The joint limit (Section 6).** Combining Theorem 5.1 with uniform versions of the fixed-diameter bounds, in which the error is tracked in $h$, gives Theorem 1.1 with no order of limits.

**Constants and diameter five (Sections 7 and 8).** A recursion over small rooted trees computes $c_h$ and $\beta_h$ exactly. A tree of diameter five has two adjacent centres, each carrying stars attached at their own centres; optimising the split between the two sides and the number of stars on each, with star orders differing by at most one, gives the formula and every maximiser. Diameter four shows that the error term of Theorem 1.2 cannot be sharpened to a fixed multiple of $\sqrt n$ plus $o(\sqrt n)$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/wiener-index-trees-diameter-second-order.txt) is available for reading.

- **Proofs.** The 14-page paper opens with a plain introduction (the problem, what was known with Cambie's theorem displayed, the results, the idea of the proof and a roadmap) and gives written proofs of every theorem. No proof assistant was used.
- **Checks.** Ten Python scripts check the finite claims exactly: the coefficient table, with an independent recursion; the diameter-five formula against exhaustive enumeration of all trees of diameter five with up to 19 vertices; the order-249 example; the constructions of Theorem 5.1 up to $h=10^{18}$; an exact sympy certificate of every Section 5 constant and inequality; every other number quoted in the text; and the exact maxima for diameters 6 to 11 up to 3000 vertices.
- **Tests that can fail.** No script uses `assert`; every check raises explicitly, so the scripts behave identically in Python's optimised mode. Changing one expected value (5530 to 5531) makes the diameter-five check fail.
- **Replay.** All ten scripts were rerun from a fresh copy before release in optimised mode, including the 35-minute rigidity scan, and every output matched the recorded file byte for byte. GitHub CI reruns the nine fast scripts on Linux, compares under a declared policy (words, integers and fractions exact; printed decimals within $10^{-12}$) and runs the failure test.
- **Review.** A combined five-role internal Claude review panel (editor, methodology, domain, perspective and devil's advocate), an independent proof audit of Sections 5 and 6, the lead's brute-force checks, one revision round that added the exact certificate and the rigidity computations, then a re-review and a second proof audit of every rewritten proof. No error was found. No Astra/Codex review took place. Plesník's paper was read from a supplied copy. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Trees only; lower-order terms in the joint regime and the linear-diameter regime are open; thresholds are not computed and the algorithm is not implemented; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in extremal graph theory | The exact constant, the resistance formulation and the calibration as tools for related distance problems | Trees only; leading coefficient only in the joint regime |
| Chemical graph theorists | Exact coefficients for every fixed diameter and a complete answer for diameter five, as benchmarks for bounds on related distance indices | Exact values for most orders still need computation |
| Researchers on branched transport and optimal networks | A worked case where a polynomial calibration with a sum-of-squares excess forces dyadic splitting | Stability of the dyadic shape is not proved |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The scripts check finite claims; the proofs carry the asymptotics |

## Why the problem matters

The Wiener index is one of the most studied distance invariants in graph theory and chemistry, and asking how large it can be for a given diameter is the most basic extremal question about it. Cambie's work fixed the scale of the answer; this candidate fixes the constant, and explains it: the extremal trees are governed by an electrical energy and a self-similar halving pattern, which is the kind of structure that can transfer to other distance and transport problems.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12 and the pins in `requirements.txt`, from the package root:

```sh
python3 -O code/coefficients.py 8
python3 -O code/diameter5.py 54
python3 -O code/calibration_certificate.py
```

The first prints the constants of Table 2, the second prints `(5530, [(24, 3, 28, 4)])`, and the third ends with `ALL CHECKS PASSED`; each takes about a second. `README.md` lists every command, `results/` records every output, and `ENVIRONMENT.txt` and `ci/compare_outputs.py` state the comparison policy. The rigidity scan (`code/rigidity_onset.py`) takes about 35 minutes. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide Cambie's question: are the maximisers among graphs of even diameter trees for large $n$? A positive answer would give the constant for Plesník's problem itself.
2. Find the next term in the joint regime, and treat diameters that are a fixed fraction of the order.
3. Prove that the optimal stems converge to the dyadic pattern, using the sum-of-squares form of the splitting excess.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); ten scripts in `code/` with their recorded outputs in `results/`; `ci/compare_outputs.py`; `requirements.txt` (numpy, sympy and mpmath pinned); `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
