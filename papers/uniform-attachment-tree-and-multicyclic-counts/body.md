## Summary

**In one sentence.** In a network that grows by random attachment, counts of tree-shaped patterns behave like averages and forget the early network, while counts of patterns with two or more cycles are fixed by the first few nodes and keep that memory for ever; this candidate proves both halves of that picture, which were conjectured by Björklund, Holmgren, Janson and Lo.

**The setting.** A network grows one node at a time. Each newcomer sends $m$ links to earlier nodes, each chosen uniformly at random (repeats allowed). This is the *uniform attachment* model, also called the uniform random recursive dag; with $m=1$ it is the classical random recursive tree. A common way to describe such networks is to count small patterns (*motifs*) in them: paths, stars, triangles, or pairs of cycles joined together.

**What was known.** Björklund, Holmgren, Janson and Lo (Combinatorics, Probability and Computing, 2025; BHJL below) found the sizes of these counts. Tree patterns occur about $n$ times in a network of $n$ nodes; patterns with one cycle occur a polylogarithmic number of times; and patterns with two or more cycles occur about $(\log n)^t$ times, where $t$ counts the nodes in the trees that dangle from the pattern's cycles. They left two conjectures:

- **Conjecture 3.8.** The count of every tree with at least two edges varies by about $\sqrt n$ (its variance is of exact order $n$). They proved this for stars.
- **Conjecture 3.14.** For a pattern with two or more cycles, the count divided by $(\log n)^t$ settles down to a constant times the eventual number of copies of its *cyclic core* (what is left after repeatedly removing dangling nodes). They proved this for $t=1$.

**What is new.** Both conjectures are proved, and the paper goes further. The four main results come first; the supporting results are listed after them.

| Main result | In plain terms | Where |
|---|---|---|
| Linear variance for trees | Every tree count with at least two edges, and every mixture of different tree counts, varies on the scale $\sqrt n$. This proves Conjecture 3.8 | Theorem 1.3 |
| Constants and a joint bell curve | The average numbers and the variances and covariances are explicit polynomials in $m$; the tree counts are jointly normal in the limit with a nonsingular covariance, and the limit forgets the early network | Theorem 1.4 |
| Multicyclic counts | Count $/(\log n)^t$ converges to a hook-length constant times the number of core copies. This proves Conjecture 3.14. Every simple core has a positive chance never to appear | Theorem 1.5 |
| The next layer of error | The error in the multicyclic law is of order $(\log n)^{t-1/2}$ and is normal with a *random* variance set by where the core copies sit: copies that share a node fluctuate more than separate ones | Theorem 1.6 |

At $m=2$ the variance constants of the two-edge path, the three-edge path and the three-leaf star are $12$, $1688$ and $888$.

**Supporting results.** A chi-square statistic for tree counts (Corollary 4.4); exact average counts at finite sizes (Remark 4.5); a law for trees hanging from a fixed node, with a bell-curve refinement (Theorems 5.1 and 6.6); moment bounds; and the tree results for the simple graph obtained by merging repeated links (Section 7). The univariate normal-approximation rate of order $n^{-1/2}$ for a single tree count is BHJL's Theorem 3.7, which applies once the variance bound is known (Corollary 4.2); it is inherited, not new.

**Idea of the proofs.** For trees, look at the part of the count that depends jointly on one link choice at each of several late nodes. That part only sees the shape the chosen links form, so different trees cannot cancel each other, and these parts add up to a variance of order $n$. For patterns with cycles, the newest dangling node is always a leaf, which gives an exact average growth rate and a martingale; because there are only finitely many core copies, summing over them gives the limit.

**Limits.** Patterns and $m$ are fixed. There is no rate for the joint normal limit. Patterns with exactly one cycle, preferential attachment and sampling without repeats are not treated. The multicyclic limit is approached slowly: the relative error is of order $1/\sqrt{\log n}$, still about $0.3$ at $100{,}000$ nodes. Centring tree counts at $n$ times the limiting constant is noticeably biased at realistic sizes (for the three-edge path at $1{,}000$ nodes the shift is about $1.11$ standard deviations), so the package provides exact finite-size averages. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks only.

## Summary for specialists

Let $G_n^m$ be the uniform attachment graph: vertex $j\ge2$ has $m$ slots with independent endpoints $\xi_{j,a}$ uniform on $\{1,\dots,j-1\}$, parallel edges kept. For a fixed connected loopless (multi)graph $H$ let $W_H(n)$ count non-induced copies.

- **Theorem 1.3** *(proof)*: for pairwise nonisomorphic trees $T_1,\dots,T_q$ with at least two edges and reals $c_h$ not all zero, with $e$ the largest edge count among the $T_h$ with $c_h\ne0$ and $H$ such a tree,

$$\operatorname{Var}\Big(\sum_h c_hW_{T_h}(n)\Big)\ge\frac{c_H^2\,n}{96\cdot4^e\,e!}$$

  for all large $n$, and the variance is $O(n)$.

- **Theorem 1.4** *(proof)*: $\mathbb E W_T(n)=\mu_T(m)n+O((1+\log n)^{|V(T)|})$ and $n^{-1}\operatorname{Cov}(W_T,W_S)\to\nu_{T,S}(m)$, with $\mu_T,\nu_{T,S}$ rational polynomials in $m$ given by finite formulas; $\Sigma=(\nu_{T_i,T_j})$ is positive definite and the centred, $\sqrt n$-scaled counts converge to $\mathcal N_q(0,\Sigma)$, mixing.
- **Theorem 1.5** *(proof)*: for a feasible multicyclic $H$ with 2-core $C$ and $t$ pendant vertices,

$$\frac{W_H(n)}{(\log n)^t}\to c_{H,m}W_C(\infty)$$

  almost surely and in every $L^p$, where

$$c_{H,m}=\frac{a_C}{a_H}\,\frac{m^t}{\prod_{v\notin C}h_v},$$

  $a$ denotes automorphism counts and $h_v$ is the size of the pendant subtree rooted at $v$. $W_C(\infty)$ has all moments and unbounded support; if $C$ is simple, $0<\mathbb P(W_C(\infty)=0)<1$.
- **Theorem 1.6** *(proof)*: for $t\ge1$, with an explicit $V_H\ge0$ determined by the positions of the core copies, write $D_n=W_H(n)-c_{H,m}W_C(\infty)(\log n)^t$. Then

$$\frac{D_n}{(\log n)^{t-1/2}}\to\sqrt{V_H}\,Z$$

  stably, with $Z$ standard normal and independent of the graph process. So the almost-sure error exponent $t-1/2+\varepsilon$ cannot be lowered to $t-1/2$ (Corollary 6.8).
- **Constants** *(exact computation)*: for the 3-vertex path, 4-vertex path and 3-leaf star, the covariance matrix at $m=2$ is

$$\Sigma=\begin{pmatrix}12&128&96\\128&1688&1168\\96&1168&888\end{pmatrix},$$

  with $\det\Sigma=215808$; in general $\det\Sigma(m)=m^8(m+1)(m^4+17m^3+24m^2+15m+3)$.

**Known and new.** BHJL proved the orders of magnitude, Conjecture 3.8 for stars, Conjecture 3.14 for $t=1$ (constant $rm$), the bounded mean of leaf-free counts and a zero count for one example; they asked whether every simple core is absent with positive probability, and listed explicit constants and multivariate normal approximation as further directions. Items they proved are reproved here only to keep the arguments self-contained. For $m=1$ asymptotic normality may well be accessible through fringe-tree theory (Holmgren and Janson), so nothing new is claimed about normality for $m=1$; the linear variance for every signed combination, the positive definiteness of $\Sigma$ and the explicit constants appear to be new. The univariate $O(n^{-1/2})$ Wasserstein rate is BHJL's Theorem 3.7.

## Technical account

**Top-order projection.** The variance of a function of independent slot choices splits into orthogonal Hoeffding (Efron–Stein) pieces indexed by sets of slots. BHJL's bound for stars used the first-order pieces, which can cancel in a signed combination. Section 3 uses the opposite end: for one slot at each of $e$ distinct late vertices, the piece indexed by exactly those slots ignores every smaller tree and every copy using other slots, and only records whether the $e$ selected edges form a tree of a given shape. Rooting at a vertex of degree at least two makes this piece of order one on events of total probability of order $n^{1-e}$, and there are of order $n^e$ such slot sets.

**Constants and the joint limit.** Section 2 expresses $\mu_T$ and $\nu_{T,S}$ through nested sums over the possible arrival orders of a tree's vertices, giving finite formulas and a subset recurrence; the covariance accounts both for copies that share edges (positively correlated) and for copies that compete for the same slot (negatively correlated), and the single-edge positive and negative overlap terms cancel exactly ($4m-4m$), which is why one edge has a deterministic count. Section 4 proves the joint limit by Janson's method of cumulants, with Section 3 making the limit nonsingular, and upgrades it to mixing convergence; the chi-square corollary follows.

**Pendant forests.** Order the pendant vertices by arrival. The newest one is a leaf, so when vertex $n$ arrives the expected increase of the forest count is exactly $m/(n-1)$ times a sum of counts of smaller forests. Summing this drift and controlling the martingale part gives the fixed-root law with the hook-length constant (Theorem 5.1); embeddings whose labels do not increase away from the core lose a logarithmic factor. Since the core has finitely many copies, summing over them gives Theorem 1.5, and a path seed gives the zero atom for simple cores (Theorem 5.10).

**Boundary scale.** Section 6 writes the count of a forest hanging from fixed roots as its mean plus a linear functional of the edges arriving at the roots, up to an error of smaller order (Proposition 6.4). That functional is a sum of independent terms, so it is asymptotically normal (Theorem 6.6). Summing over the finitely many core copies, whose positions are random but fixed early in the process, gives the stable mixed-normal limit (Theorem 6.7), with $V_H$ larger when core copies share vertices.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/uniform-attachment-tree-and-multicyclic-counts.txt) is available for reading.

- **Proofs.** Every theorem has a written proof in the 32-page paper. The paper opens with a plain introduction (the model, the two conjectures, why the tree case is hard, the main and supporting results, a table of what was known and what is new, proof ideas, related work, scope and a roadmap) and ends with open problems and an AI-use statement. No proof assistant was used.
- **Exact checks.** `reproduce.py` runs 29 exact checks: the symbolic means, variances and all six covariance entries for the three small trees, a second implementation of the constants by birth orders at $m=1,2,3$, the single-edge cancellation, the covariance determinant, complete enumeration of all graphs at $m=2$ for $n=3,\dots,6$, and rooted-forest and projection checks. `variance_constants.py` computes the constants in exact rational and symbolic arithmetic.
- **Numerical illustrations.** `core_mean.py` gives the mean eventual number of diamond cores (four nodes, five edges) at $m=2$ as about $9.3675$, with a control that reproduces $\zeta(2)$ to eight decimal places. `finite_n_bias.py` computes exact finite-size means and the centring error. `constants_montecarlo.py` counts patterns directly in simulated networks (fixed seeds) and extrapolates to $12.2$, $1698.5$ and $909.4$ against the exact $12$, $1688$ and $888$. `boundary_fluctuations.py` illustrates Theorem 1.6. These computations check formulas and conventions; the proofs carry the claims.
- **Tests that can fail.** No check uses `assert`, so the scripts behave identically under Python's optimised mode. Changing the expected determinant $215808$, or the $\zeta(2)$ control value, makes the script exit with failure.
- **Replay.** Every script was rerun from fresh copies before release under Python 3.12 with pinned libraries and optimised mode; every recorded output was reproduced byte for byte. GitHub CI reruns all scripts on Linux under `-O` as a blocking job and compares them with the recorded outputs under a declared policy: exact outputs must match exactly, and floating-point summaries within a relative tolerance of $10^{-6}$.
- **Review.** Five internal AI-assisted reviewer roles, run as Claude subagents, and a clean replay found no mathematical error or gap. The revision round marked the inherited rate as BHJL's, toned down overstated wording, mapped BHJL's open directions, stated what is and is not claimed for $m=1$, rewrote the introduction for non-specialists, made the scripts robust under optimised mode, and added Theorem 1.6, the chi-square corollary and the diamond example. A re-review and a proof audit of the new Section 6, also run as Claude subagents, found no gap. The planned adversarial review by a second AI model did not run because of a usage limit. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Fixed patterns and fixed $m$; no multivariate rate; unicyclic patterns, preferential attachment and sampling without replacement are not treated; slow convergence of the multicyclic law; finite-size centring bias for trees. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers who use motif counts to study growing networks | Exact variance and covariance constants and a chi-square statistic for tree patterns; a warning that multicyclic counts are fixed by the early network | Idealised model with fixed parameters; slow convergence at realistic sizes |
| Probabilists working on random recursive trees and dags | Two conjectures settled, a top-order projection argument for variance lower bounds, and a leaf-deletion martingale for pendant trees | Unicyclic constants and a multivariate rate remain open |
| Statisticians testing network models | Explicit limiting covariance at every $m$, and exact finite-size means for centring | Centring at the limiting mean is biased at realistic sizes |
| Research agents | Machine-readable claims, an agent index and replayable checks with negative controls | The checks are finite; the proofs carry the general statements |

## Why the problem matters

Counting small patterns is one of the most common ways to summarise and test models of growing networks, from citation graphs to software dependencies. Such tests need to know how much the counts fluctuate and whether their fluctuations look like a bell curve. This work answers that for the simplest growth model with random attachment: tree counts give clean, nondegenerate normal statistics, while counts of patterns with several cycles are dominated by the network's earliest history and should not be treated as normally distributed.

## Related Evidence Press releases

No earlier Evidence Press release studies uniform attachment, random recursive trees or dags, or subgraph counts.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/), from the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
U="uv run --python 3.12 --with sympy==1.14.0 \
  --with networkx==3.7 --with numpy==2.3.5 \
  --with scipy==1.17.0 python -O -I -B"
$U reproduce.py OUT
$U variance_constants.py
$U variance_constants.py --symbolic
for s in core_mean finite_n_bias \
  boundary_fluctuations constants_montecarlo; do
  $U reproducibility/$s.py OUT
done
```

Together the scripts take about a minute. `ENVIRONMENT.txt` lists the software used and the cross-platform comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find the leading constants for patterns with exactly one cycle, combining the pendant-forest method with the birth-time distribution of the cycle.
2. Prove a multivariate normal approximation for tree counts with an explicit rate; the explicit variance lower bound controls the smallest eigenvalue such a bound needs.
3. Determine the law of the eventual core count for a simple core, and which multigraph cores can be absent with positive probability.
4. Treat sampling without replacement, the merged simple graph for cyclic cores, preferential attachment, and growing $m$ or growing patterns.

## What is in the evidence package

The paper (LaTeX source in `manuscript.tex` and `sections/`, and the PDF); `reproduce.py`, `variance_constants.py` and the scripts in `reproducibility/` with their recorded outputs in `results/`; `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
