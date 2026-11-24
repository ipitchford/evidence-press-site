## Summary

**In one sentence.** A 2009 conjecture said that, in every network, the number of dominating sets of each size rises to a single peak and then falls; this candidate gives two explicit networks with 317,440 nodes in which the count dips and rises again, proved by an exact integer calculation, and pins down how many neighbours per node are needed to force a single peak in the middle.

**The problem.** A *dominating set* in a network is a set of nodes such that every node is either in the set or directly linked to a node in it. Think of placing guards, transmitters or monitors so that every site is covered. Writing $d_k$ for the number of dominating sets with $k$ nodes, in a network with $n$ nodes, gives a sequence $d_0,d_1,\dots,d_n$; these are the coefficients of the *domination polynomial*. For every network anyone had checked, the sequence rises to one peak and then falls: it is *unimodal*. Alikhani and Peng conjectured in 2009 that this is always so. Shape questions of this kind are basic for graph polynomials and remain open for many of them.

**What was known.** Adding a node to a dominating set keeps it dominating, and this shows that the sequence rises at least up to half the number of nodes, so any dip must happen in the upper half. The conjecture was proved for paths, cycles, complete multipartite graphs, powers of paths and cycles, threshold graphs, large graphs with a node joined to all others, and graphs in which every node has at least $2\log_2 n$ neighbours. Recent papers found trees where the stronger property of log-concavity fails, but unimodality itself was still listed as open.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The conjecture is false | Two explicit connected networks with 317,440 nodes, one *split* (a clique plus an independent set) and one *bipartite*, have more dominating sets of size 160,080 than of size 160,320, and more of size 160,560 than of size 160,320. An exact integer computation proves it | Theorem 1.1 |
| Many peaks | The same idea gives networks whose counts have many separate peaks, growing like $\sqrt n/\log n$; an explicit example with four peaks has 4,857,004,032 nodes | Theorem 1.2 |
| The most common size can be far from the average | Beaton and Brown asked whether the most common size of a dominating set always sits next to the average size. In the explicit split network the average is about 160,323, yet no size within 88 of it is the most common one; in other, astronomically large networks the gap is a fixed fraction of the number of nodes | Theorem 1.3 |
| High minimum degree is not enough | Counterexamples exist even when every node has about $\tfrac12\log_2 n$ neighbours | Theorem 1.4(i) |
| A degree condition that works | If every node has at least $\log_2 n+\log_2\log_2 n+1$ neighbours, the sequence is unimodal with its peak exactly at the middle. This halves the previous requirement, and for the peak to sit exactly at the middle it cannot be improved by more than a constant | Theorem 1.4(ii)–(iii) |
| Slow sampling | The simplest random sampler of dominating sets, which adds or removes one node at a time, can take exponentially long on these networks | Proposition 6.3 |

**Concrete numbers.** Write $H=2^{314880}$, the number of members of each of the two large families in the explicit networks. The certificate shows that, in millionths of $H$, the three counts lie in the intervals 1556–1615 (size 160,080), 1482–1541 (size 160,320) and 1565–1624 (size 160,560). The middle interval lies wholly below both of the others, so the middle count is the smallest of the three.

**The idea.** Build a network with two large families of dominating sets that have *exactly* the same number of members but different typical sizes, while all other dominating sets are negligible in number. The size of a dominating set chosen at random then has two humps, and the count dips between them. Bhattacharyya and Kahn used the same principle in 2013 for independent sets, the packing counterpart of this covering problem. The new work is making it exact under the covering rule of domination, where every node must be covered, and certifying the finite example in exact arithmetic.

**Limits.** The explicit example is large and has not been minimised. The fixed-fraction gap between the most common and the average size is proved only for astronomically large networks, with a constant of order $10^{-25}$; the explicit gap of more than 88 is for the 317,440-node network. The least number of neighbours per node that forces unimodality is still open: it lies between about $\tfrac12\log_2 n$ and $\log_2 n+\log_2\log_2 n+1$. The sharp result concerns where the peak sits, not unimodality itself. The question for trees remains open. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computation only.

## Summary for specialists

$G$ is a finite simple graph on $n$ vertices; $d_k(G)$ counts dominating sets of size $k$, $D_G(z)=\sum_k d_k z^k$, and $\mathrm{avd}(G)=D_G'(1)/D_G(1)$. A global mode is an index of a largest coefficient; a peak region is a maximal run of indices forming a local maximum, separated from the next by a strictly lower coefficient.

- **Theorem 1.1** *(exact certificate)*: there are a connected split graph $G$ and a connected bipartite graph $B$, each on $317\,440$ vertices, with

$$d_{160080}>d_{160320}<d_{160560}.$$

  Every vertex in one independent part of each graph has degree three, and $B$ has maximum degree $120$.
- **Theorem 1.2** *(proof)*: along infinite sequences of orders $n$, connected split and bipartite graphs have at least $c\sqrt n/\log n$ peak regions; the bipartite examples have maximum degree $O(\log n)$. Explicitly, four peak regions occur on $4\,857\,004\,032$ vertices.
- **Theorem 1.3** *(proof; (b) certified)*: (a) for infinitely many $n$ there are connected split and bipartite graphs in which every global mode $j$ satisfies $|j-\mathrm{avd}(G)|\ge cn$; (b) for the split graph of Theorem 1.1,

$$160323.034984\le\mathrm{avd}(G),$$

$$\mathrm{avd}(G)\le160323.034985,$$

  and no $k$ with $160217\le k\le160412$ is a global mode, so every global mode differs from $\mathrm{avd}(G)$ by more than $88$.
- **Theorem 1.4** *(proof)*: (i) nonunimodal connected split and bipartite graphs exist with $\delta(G)/\log_2|V(G)|\to\tfrac12$. (ii) Every graph with

$$\sum_{v}(\deg v+2)\,2^{-\deg v-1}\le1$$

  is unimodal with a global mode at $\lceil n/2\rceil$; in particular this holds when $n\ge4$ and

$$\delta(G)\ge\log_2 n+\log_2\log_2 n+1.$$

  (iii) With $L=\log_2 n$, the least degree $c(n)$ forcing a unimodal sequence with a global mode at $\lceil n/2\rceil$ satisfies, for even $n\ge2^{20}$,

$$L+\log_2 L-3\le c(n),$$

$$c(n)\le L+\log_2 L+2,$$

  and, for odd $n\ge2^{40}$,

$$L+\log_2 L-4\le c(n),$$

$$c(n)\le L+\log_2 L+2.$$

- **Proposition 6.3** *(proof)*: single-site Glauber dynamics on the dominating sets of the graphs of Section 6 mixes in time $e^{\Omega(n)}$.

**Known and new.** Beaton and Brown proved the rising half ($d_k\le d_{k+1}$ for $k<n/2$), unimodality for paths, cycles and complete multipartite graphs, and unimodality with the mode at $\lceil n/2\rceil$ for $\delta\ge2\log_2 n$, and asked how far the mode can be from $\mathrm{avd}$. Burcroff and O'Brien, Galvin and Zhang, Omar and Zhang proved further classes; Omar gave $\delta\ge\log_2(n(n+2))-2$ and the union bound used in Section 8. Beaton and Schoonhoven, and Du, Heilman and Panova, found trees without log-concavity. Bhattacharyya and Kahn disproved the analogous conjecture for independent sets of bipartite graphs with two competing families, and remarked that many local maxima are possible. New here, within a literature search of limited scope: the counterexamples, the quantitative many-peak and mode–average results, the logarithmic-degree counterexamples, the repair bound giving the weighted criterion, and the matching lower bound for a central mode.

## Technical account

**The construction.** Fix $m\ge2$ and $s\ge1$. Block $i$ (indices modulo $m$) has $s$ *singletons* and $s$ disjoint *triples*. For every triple $Y$ in block $i$, every singleton $u$ in block $i$ or $i+1$ and every two-element $Q\subset Y$, add a *clause* vertex adjacent to $u$ and $Q$. With $h=ms$ and $P=6ms^2$ there are $P$ clauses and $N=P+4h$ vertices. $B_{m,s}$ has only these edges; the split graph $G_{m,s}$ also joins all variable vertices into a clique. For a selection $S$ of variable vertices let $F(S)$ count the clauses with no neighbour in $S$; in the split graph

$$D_{G_{m,s}}(z)=\sum_{S}z^{|S|+F(S)}(1+z)^{P-F(S)}.$$

**Two phases.** Family $\mathcal A$ selects every singleton; family $\mathcal C$ gives every triple at least two selected vertices. Neither forces any clause, so both have exactly $H=2^{P+3h}$ members, and $|\mathcal A\cap\mathcal C|=H2^{-h}$. Their sizes are $h+\mathrm{Bin}(P+3h,\tfrac12)$ and a similar sum of independent pieces whose mean is larger by $h/4$; the standard deviations are of order $\sqrt m\,s$, much smaller than the gap of order $ms$. For $m=128$, $s=20$ the means are $160\,000$ and $160\,640$.

**The certificate.** A transfer matrix $T$ of size $(s+1)\times(s+1)$ satisfies $D_{G_{m,s}}(1)/H=\mathrm{tr}(T^m)$. Evaluating $T^{128}$ with outward rounding to multiples of $2^{-80}$ gives

$$\mathrm{tr}(T^{128})\le R,$$

$$2^{80}R=2465924464317133610055229,$$

so $R=2.03976\ldots$ and all dominating sets outside $\mathcal A\cup\mathcal C$ number at most $H(R-2+2^{-h})$. Grouping them by the clauses they leave free, no group puts more than a central binomial share of its mass on one size. This bounds every coefficient on either side of the pure-family count $p_k$, computed exactly with binomial recurrences. The upper bound passes to the bipartite graph because every dominating set of $B_{m,s}$ dominates $G_{m,s}$; for the lower bound, a union bound shows that at most a fraction $4h2^{-4s}$ of either family fails to dominate $B_{m,s}$, and this loss is included. Evaluating at the three indices, in integers, gives the intervals above.

**Average size and the mode.** Differentiating $T$ in a dual-number arithmetic with outward rounding brackets $\mathrm{avd}(G)$, and an exact scan shows that no index in $[160217,160412]$ beats the certified lower bound at $k=160560$.

**Many peaks and the linear gap.** Gluing gadgets of geometrically increasing size gives $K$ equal-sized families whose mean sizes form an arithmetic progression, hence $K$ peak regions (Section 5). For the linear gap, Section 6 uses a different local gadget on a symmetric sparse interaction graph, which gives two families with exactly equal counts and linearly separated sizes; the same bottleneck slows single-site Glauber dynamics.

**The degree criterion.** Let $A_k$ count pairs $(S,x)$ with $|S|=k$, $x\notin S$, $S\cup\{x\}$ dominating and $S$ not dominating. Counting one-vertex additions gives $(k+1)d_{k+1}=(n-k)d_k+A_k$. A repair bound on $A_k$ and the union bound $d_k\ge\binom nk-\sum_v\binom{n-b_v}{k}$, with $b_v=\deg v+1$, give the weighted criterion and its minimum-degree corollary. Section 9 builds circulant graphs whose closed neighbourhoods pairwise meet in at most two vertices, for which $A_k$ at the middle is large enough to make $d_{\lceil n/2\rceil}<d_{\lceil n/2\rceil+1}$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/domination-polynomial-unimodality-counterexamples.txt) is available for reading.

- **Proofs.** Every theorem has a written proof in the 18-page paper, which opens with a plain introduction (the problem, what was known, the results, the idea and a roadmap) and ends with open problems, the scope of the claims and an AI-use statement. No proof assistant was used.
- **The certificate.** `verify_witness.py` computes the trace bound and the three coefficient intervals with Python integers only; it never builds the graph or the full polynomial. Its output is the table above.
- **The graph itself.** The bipartite example ships as a plain-text edge list of 921,600 edges. `graph_family.py` generates it from the construction (in the compressed form that the checker reads), and `check_graph.py` checks its hash, the bipartition into 10,240 and 307,200 vertices, the degrees from 3 to 120 and connectivity.
- **Small cases and identities.** `smallcheck.py` enumerates all $2^{20}$ vertex subsets of the smallest instance and compares every coefficient with the inclusion–exclusion formula. `check_criteria.py` tests the Section 8 bound on all 33,867 labelled graphs with at most six vertices (63 satisfy the weighted criterion) and the circulant parameters of Section 9. `check_extensions.py` compares the transfer identity and the mean with direct enumeration for four parameter pairs, certifies the average size and the excluded interval, and checks the explicit many-peak and sharp-threshold instances.
- **Tests that can fail.** No check uses `assert`, so the scripts behave identically in Python's optimised mode. Changing the middle index to one next to the left index, deleting one edge from the edge list, or changing an expected count makes the corresponding script fail.
- **Replay.** Every script was rerun from fresh copies before release under Python 3.12, normally and in optimised mode; every recorded text output was reproduced byte for byte. GitHub CI reruns the quick checks on Linux as a blocking job, compares the outputs byte for byte and runs the three failure tests; the slow extension check (12 to 25 minutes) runs as a separate, non-blocking job, with the interpreter-version field excluded and float summaries compared to a relative tolerance of $10^{-9}$.
- **Review.** Five internal Claude reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as two combined passes, and two reviewers recomputed the main certificate independently in exact arithmetic. The lead replayed every script from a clean copy byte for byte. The revision restricted "sharp" to the position of the peak, split the Beaton–Brown answer into an explicit finite part and an asymptotic part with a frankly stated constant, credited Bhattacharyya and Kahn, corrected an error term in Section 5, tested the transfer identity beyond the smallest case and rebuilt the introduction for non-specialists. A verification re-review and proof audit of the new proofs, with independent recomputations, found one mechanical problem in `check_extensions.py` (fixed and rerun) and minor wording items. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The explicit example is large and not minimised; the linear mode–average gap needs astronomically large graphs and a constant of order $10^{-25}$; the unimodality threshold lies between $\tfrac12$ and $1$ times $\log_2 n$; trees remain open. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on graph polynomials | Explicit certified counterexamples and a construction principle that may transfer to other covering-type polynomials | The examples are very large; trees and small graphs remain open |
| Combinatorialists working on unimodality and log-concavity | A quick degree criterion that certifies a unimodal sequence peaking at $\lceil n/2\rceil$, sharp for the position of the peak | The sharpness concerns the central mode, not unimodality |
| Researchers on sampling and counting | A natural local sampler of dominating sets that mixes exponentially slowly | Shown for specific constructed graphs |
| Research agents | Machine-readable claims, an agent index and exact replayable certificates with failure tests | The certificates cover the finite example; the proofs carry the asymptotic theorems |

## Why the problem matters

Counting the configurations of each size, independent sets, matchings, colourings or dominating sets, gives sequences whose shape reflects how the configurations are organised. Unimodality is the simplest shape statement, and for many graph polynomials it is conjectured but unproved. Showing that the domination sequence can have two humps, and explaining why through two competing families of exactly equal weight, turns an open question into a mechanism, and the matching degree threshold shows where that mechanism stops working.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with any CPython 3.12 or later (no packages needed):

```sh
shasum -a 256 -c MANIFEST.sha256
P="python3 -O -I -B"
$P code/verify_witness.py
$P code/graph_family.py --m 128 --s 20 --output data/bipartite-example.edgelist.gz
gunzip -c data/bipartite-example.edgelist.gz | cmp - data/bipartite-example.edgelist
$P code/check_graph.py
$P code/smallcheck.py
$P code/check_criteria.py
$P code/check_extensions.py --output /tmp/extensions.json
```

The generator writes the compressed edge list that `check_graph.py` reads, and `cmp` confirms that it matches the shipped text. Every other step takes seconds, except the last, which takes 12 to 25 minutes. Compare each output with the matching file in `results/`. `ENVIRONMENT.txt` records the software used and the comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find the least $\gamma$ such that minimum degree $(\gamma+o(1))\log_2 n$ forces unimodality; it lies between $\tfrac12$ and $1$.
2. Find much smaller counterexamples, and decide the question for trees.
3. Make the linear mode–average separation explicit with a reasonable constant, for example with an explicit expander.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex`, the PDF and its figure); the bipartite example as a plain-text edge list with metadata in `data/`; the certificate, graph, small-case, criterion and extension scripts and the generator in `code/`, with their recorded outputs in `results/`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and SHA-256 sums.
