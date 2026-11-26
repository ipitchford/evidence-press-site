## Summary

**In one sentence.** For a random walk that prefers distant nodes, this release finds exactly how close a network of $n$ nodes can come to making the walk swing back and forth like a pendulum (the gap is $4/\sqrt{3n}$ to first order), and what every network that gets that close looks like.

**The everyday picture.** Take any connected network and imagine a walker that jumps from node to node, preferring nodes that are far away: the chance of jumping to a node is proportional to its distance. In some networks this walker ends up bouncing back and forth between two distant regions, almost like a pendulum. One number measures how close it comes to perfect back-and-forth: the largest eigenvalue of the *normalised distance Laplacian*. It always lies between 1 and 2, can come close to 2, but never reaches it. The question is: over all networks with $n$ nodes, how close to 2 can it get, and which networks get closest? The distance from 2 is called the *deficit*.

**What was known.** Reinhart introduced the matrix (*Special Matrices*, 2021). She computed the best networks with up to ten nodes and conjectured that the winners are two complete clusters ("cliques") joined by a path, with the value tending to 2. Johnston and Tait (*Linear Algebra and its Applications*, 2024) proved that the value does tend to 2. Their results put the smallest deficit somewhere between about $1/n$ and about $2.83/\sqrt n$ (the second from a construction with two cliques and a path, constant $2\sqrt2$). They proved that $1/\sqrt n$ is the right order under extra assumptions on the eigenvector, and asked for the true order of the gap.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The sharp gap | The smallest deficit over networks with $n$ nodes is $4/\sqrt{3n}$ to first order, about $2.31/\sqrt n$, with no extra assumptions | Theorem 1 |
| The best networks | Every network that gets this close looks, at large scale, like a path of length about $\sqrt{3n}$ with half of the nodes packed into a nearly complete cluster at each end | Theorem 1(a)–(c) |
| Why it beats the earlier construction | Along the path, the walker's "pendulum" eigenvector falls linearly from one end to the other; in the earlier $2\sqrt2\approx2.83$ construction it was zero there | Section 6 |
| Other settings | The same answer, with sharp constants, when distance is raised to any fixed power, for trees (constant $4\sqrt{2/3}\approx3.27$), and for networks that avoid a fixed sub-pattern containing a cycle | Theorem 2, Corollary 8 |
| New computer evidence | Among all trees with 6 to 20 nodes, the best tree is always two stars whose centres are joined by a path. The paper states this for every size as a conjecture | Section 11, Conjecture 12 |

**The best networks: two dense ends, a path of length $\sqrt{3n}$.** Figure 1 of the paper shows the trade-off. With a joining path of $s\sqrt n$ edges, the scaled deficit is about $2/s$ from pairs of nodes inside the two dense ends (which prefer a long path) plus $2s/3$ from pairs between the path and the ends (which prefer a short one). The total

$$\frac2s+\frac{2s}{3}$$

is smallest at $s=\sqrt3\approx1.73$, where it equals $4/\sqrt3\approx2.31$.

**Idea of the proof.** Look at the eigenvector at its highest and lowest nodes. Because the walk almost flips the eigenvector's sign, the jump probabilities from these two nodes can share very little, and that forces almost all nodes to crowd near one of them. (The inequality used here is the classical Doeblin–Dobrushin bound; what is new is applying it to these two rows.) Then each node on a shortest path between the two crowds has to pay a definite price, whatever value the eigenvector takes there, and balancing that price against the cost inside the crowds gives the constant.

**Limits.** The result is first order. Networks that differ from "two cliques and a path" by a small fraction of edges score the same to this order, so Reinhart's exact conjecture stays open. The second-order term is only observed numerically: about $4.26/n$ at a million nodes for the best clique–path–clique network, and still drifting. The tree statement is a conjecture backed by computation up to 20 nodes. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks only.

**Credit.** The question, the two-cliques-and-a-path (barbell) construction and the conditional order are due to Johnston and Tait; the matrix, the conjecture and the table of best networks up to ten nodes are due to Reinhart.

## Summary for specialists

Let $G$ be connected of order $n$, $\mathcal D$ its distance matrix, $T$ the diagonal of transmissions and $P=T^{-1}\mathcal D$. Reinhart's normalised distance Laplacian is $L=I-T^{-1/2}\mathcal DT^{-1/2}$, with spectral radius $\rho(G)=1-\lambda_{\min}(P)\in(1,2)$ and deficit $\varepsilon(G)=2-\rho(G)$. Let $M_n=\max\rho$ over connected graphs of order $n$.

- **Theorem 1** *(proof)*: $\lim_{n\to\infty}\sqrt n\,(2-M_n)=4/\sqrt3$. Any sequence with $\sqrt n\,\varepsilon(G_n)\to4/\sqrt3$ has $\operatorname{diam}(G_n)=(\sqrt3+o(1))\sqrt n$, two disjoint sets of $(1/2+o(1))n$ vertices with induced edge density tending to one, and measured Gromov–Hausdorff limit $[0,1]$ with measure $\tfrac12\delta_0+\tfrac12\delta_1$ (distances scaled by the diameter).
- **Theorem 2** *(proof)*: for weights $d^\alpha$ with fixed $\alpha>0$ and $h_n=n^{1/(1+\alpha)}$, $\lim h_n^\alpha\min\varepsilon=K_{\alpha,b}=\min_{s>0}(2bs^{-\alpha}+C_\alpha s)$, where $C_\alpha=4\int_0^1\frac{z^\alpha(1-z)^\alpha}{z^\alpha+(1-z)^\alpha}\,dz$ and $b=1$ (all graphs), $1+(2^\alpha-1)/\kappa$ ($K_{\kappa+1}$-free graphs) or $2^\alpha$ (trees). At $\alpha=1$: $C_1=2/3$, $s_*=\sqrt{3b}$, $K_{1,b}=4\sqrt{b/3}$; so $4/\sqrt3$ for all graphs and $4\sqrt{2/3}$ for trees. Near-extremal graphs have a shortest path of length $(s_*+o(1))h_n$ with two halves near its ends.
- **Corollaries 8, 9, 11 and Theorem 10** *(proof)*: graphs excluding a fixed $F$ with a cycle ($\kappa=\chi(F)-1$); the limiting profile of the extremal eigenvector and $\sum_{k=2}^{n-1}(1-\lambda_k)^2\to0$; regularly varying weights; bounded weights, with the contrast factor given by Birkhoff's bound.
- **Section 11** *(computation)*: clique–path–clique graphs attain the minimum deficit among all connected graphs of order 4 to 9 (reproducing Reinhart's Table 2.1 for these orders); two stars whose centres are joined by a path attain it among all trees of order 6 to 20 (**Conjecture 12** for all $n$).

**Known and new.** Johnston and Tait proved $c/n\le\min\varepsilon\le(2\sqrt2+o(1))/\sqrt n$, the order $n^{-1/2}$ under any one of three eigenvector conditions (their Theorem 4.7), and asked for the order of magnitude. Theorem 1 answers this with the sharp constant and no condition. The row-overlap inequality $\sum_x\min(W_{ix},W_{jx})\le\varepsilon\max(t_i,t_j)$ is the Doeblin–Dobrushin ergodicity-coefficient bound (credited via Gaubert–Qu); the novelty is its use at the two extremes of the extremal eigenvector. The analogous problem for the ordinary random walk was solved by Aksoy, Chung, Tait and Tobin with a different operator, power of $n$ and proof.

## Technical account

**Lower bound.** Normalise an extremal eigenvector $y$ so that $\max y=y_i=1$ and $\min y=y_j=\mu\ge-1$. The eigen-equations at $i$ and $j$ give $\sum_xW_{ix}(1+y_x)=\varepsilon t_i$ and $\sum_xW_{jx}(1-y_x)\le2\varepsilon t_j$, hence little overlap between the two rows (Lemma 3). A coarse lemma (Lemma 4) shows that the separation $r=d(i,j)$ is of order $h_n$. Proposition 5 then works through four claims: all but $o(n)$ vertices lie in two small balls around $i$ and $j$ (Claim 1); on the resulting cores $A$ and $B$, $y$ is uniformly close to $+1$ and $-1$ (Claim 2); the denominator of the Rayleigh quotient is asymptotically determined by the pairs between the cores (Claim 3); and the energy contains three disjoint pieces that can be bounded separately (Claim 4). Pairs inside the cores cost at least $b$ per pair at the scale used. A vertex on a shortest $i$–$j$ path pays, whatever value $\omega$ the eigenvector takes there, at least the minimum of the quadratic $pa(1+\omega)^2+qc(1-\omega)^2$, which is $4pqac/(pa+qc)$, where $p,q$ are the core fractions and $a,c$ are the scaled distance powers to the two cores. Summing along the path and using symmetry under $z\leftrightarrow1-z$ gives

$$\liminf h_n^\alpha\varepsilon\ \ge\ b\,\frac{p^2+q^2}{pq}\,s^{-\alpha}+2I_\alpha(p)\,s$$

$$\ge\ 2bs^{-\alpha}+C_\alpha s\ \ge\ K_{\alpha,b},$$

with equality only at $p=q=1/2$ and $s=s_*$.

**Construction.** Two balanced blocks (cliques, complete $\kappa$-partite graphs or stars) joined at one vertex each by a path with $r\approx s_*h_n$ edges, with trial vector $+1$ and $-1$ on the blocks and $y=\frac{(1-z)^\alpha-z^\alpha}{(1-z)^\alpha+z^\alpha}$ on the path (linear, $1-2z$, at $\alpha=1$), give $h_n^\alpha\varepsilon\le2b(h/r)^\alpha+C_\alpha r/h+o(1)$ (Proposition 6).

**Stability.** Equality forces each inequality in the lower bound to be tight to first order: the path length tends to $s_*h_n$, branches off the path are short, the cores have mean $d^\alpha\to b$, and for all graphs this means density tending to one (Proposition 7). Measured Gromov–Hausdorff convergence follows because the path is metrically visible while carrying a vanishing fraction of the vertices.

**Large-order numerics.** On the equitable quotient, the best family members found give $\sqrt n\,\varepsilon=2.305138$ (cliques) and $3.257465$ (stars) at $n=10^6$, with path lengths $r/\sqrt n=1.7290$ and $2.4460$ approaching $\sqrt3$ and $\sqrt6$. These are deficits of explicit graphs, so they are upper bounds for the minimum.

## Evidence, assurance and limitations


- **Proofs.** Every theorem and corollary has a written proof in the 16-page paper, which opens with a plain introduction (the question, what was known, what is new, what is not settled, the idea of the proof and a roadmap) and ends with open problems and an AI-use statement. No proof assistant was used.
- **Computer checks.** `code/verify.py` checks exact characteristic polynomials of small paths, the exact integer trial quotients of both constructions up to $n=10^8$ ($2.308974\ldots$ and $3.265133\ldots$ against the limits $2.309401\ldots$ and $3.265986\ldots$), full spectra at $n=211$ for powers $0.5$, $1$, $2$ and $3$, two slowly varying weights, and the bounded-weight inequality on 180 weight matrices. `code/finite_search.py` runs the exhaustive searches (nauty `geng` and `gentreeg`) and the large-order family optima, with a self-test of the quotient against full matrices. Two further scripts recompute the trial quotients and the bounded-weight inequality (every weight pattern in $\{1,3\}$ for 4, 5 and 6 vertices) by separate code. Floating-point eigenvalues are used for the searches, with a declared tolerance of $10^{-10}$; none of the computations is used in a proof.
- **Tests that can fail.** No script uses `assert`; each exits with an error on any failed check, also in Python's optimised mode. Changing one exact check in `verify.py` makes it fail, as required.
- **Replay.** All scripts were rerun from fresh copies before release in optimised mode. The three quick scripts reproduced their recorded outputs byte for byte; the exhaustive search reproduced its recorded results under the declared comparison policy. GitHub CI reruns the quick scripts on Linux and repeats the failure test.
- **Review.** Five internal reviewer roles (editor, methodology, spectral and extremal graph theory, a reader from outside the field, and devil's advocate) were run as one combined Claude pass. They found no mathematical error; their main requests concerned context and readability, attribution of the classical inequality, and a precise statement of what the first-order result does not settle. One revision round rewrote the introduction and the core of the lower bound and added the exhaustive computations and the tree conjecture. A verification re-review with a line-by-line proof audit of the rewritten text left no open correctness issue. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** First order only; Reinhart's exact conjecture, the second-order term and the tree conjecture remain open; attributions rest on a literature search of limited scope (MathSciNet and zbMATH were not searched). This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in spectral and extremal graph theory | The sharp first-order answer to Johnston and Tait's question, the shape of every near-optimal graph, and a method (row overlap at the eigenvector extremes, then a path-cost balance) that extends to distance powers and restricted classes | First order only; it does not settle which graph is exactly optimal at a given size |
| People working on Reinhart's conjecture | A precise statement of what the conjecture must still decide (second-order behaviour), numerical second-order data to a million vertices, and exhaustive tree data with a new conjecture | The second-order values are numerical upper bounds, not proved |
| Researchers on Markov chains and mixing | A worked example where the Dobrushin coefficient bound, applied to chosen rows, determines an extremal constant | The bound itself is classical |
| Research agents | Machine-readable claims, an agent index and replayable scripts with a failure test | The scripts accompany written proofs; they do not replace them |

## Why the problem matters

Distance matrices are among the oldest objects connecting graphs and linear algebra, and Reinhart's normalised version turns them into a random walk with a clear meaning. Johnston and Tait showed that the extreme of its spectrum tends to 2 but left even the order of the gap open. Knowing the exact constant, and that every near-optimal graph has the same two-ends-and-a-path shape, narrows Reinhart's conjecture to a question about the next term.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with CPython 3.12 and the packages in `requirements.txt` (`numpy==2.3.5`, `scipy==1.17.0`, `sympy==1.14.0`; `matplotlib==3.10.8` for the figure; nauty for the search):

```sh
shasum -a 256 -c MANIFEST.sha256
cd code
python3 -I -B -O verify.py > v.txt && cmp v.txt ../results/verify.txt
python3 -I -B -O independent_trial_quotient.py > q.txt && cmp q.txt ../results/independent_trial_quotient.txt
python3 -I -B -O independent_bounded_kernel.py > k.txt && cmp k.txt ../results/independent_bounded_kernel.txt
python3 -I -B -O finite_search.py --tree-max 20 --output fs.json > fs.txt
python3 -I ../.github/ci/compare_finite_search.py fs.json ../results/finite_search.json
```

The first three take seconds; the search takes about ten minutes on one core. `ENVIRONMENT.txt` records the software used and the comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide Reinhart's conjecture: is the maximiser at every order a clique–path–clique graph?
2. Prove a lower bound at order $1/n$, which would separate these graphs from their small perturbations; numerically the coefficient is about $4.26$ at a million vertices.
3. Prove the tree conjecture: two stars joined by a path for every number of vertices.
4. Find how the minimum deficit behaves when the distance power tends to zero or infinity with $n$.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex`, the figure and the PDF); the scripts `code/verify.py`, `code/finite_search.py`, `code/independent_trial_quotient.py`, `code/independent_bounded_kernel.py` and `code/figure.py` with recorded outputs in `results/` and pinned packages in `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
