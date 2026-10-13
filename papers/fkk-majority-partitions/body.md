## Summary

Take a network, keep its points, and exchange links for non-links. The result is its **complement**. A conjecture asks whether the original network or its complement must satisfy a particular spectral lower bound—a precise restriction on how weakly connected its regions can be.

This candidate proves the sharp bound whenever the points can be divided into two groups so that every point connects to more than half of the opposite group. It identifies exactly when equality occurs: one universal point joined to two equally sized complete groups. When both parts of the majority partition contain several points, the paper supplies a positive margin above the threshold.

The next step allows unequal positive weights. An explicit infinite family cannot pass any majority or minority partition test, yet it has a short weighted certificate. This shows that the weighted criterion covers a genuinely larger class. The work also gives an exact rule for attaching a new point by a single link.

The general conjecture remains open. The package offers proved sufficient conditions, examples that separate the conditions, and exact finite checks.

## Summary for specialists

For a connected graph $H$ on $n$ vertices, let $\lambda_2(H)$ be the second eigenvalue of its normalized Laplacian. A bipartition $S\sqcup T$ satisfying

$$\begin{aligned}d_T(u)&>|T|/2 &&(u\in S),\\ d_S(v)&>|S|/2 &&(v\in T).\end{aligned}$$

implies $\lambda_2(H)\ge2/(n-1)$. Equality is equivalent to $H\cong K_1\vee(K_m+K_m)$ with $n=2m+1$. For order $n\ge5$, applying this to $G$ or $\overline G$ settles the Faught–Kempton–Knudson bound for every graph admitting a strict majority or strict minority partition, including all disconnected cases.

Let $M$ consist of missing cross pairs, let $m_u=d_M(u)$, and put

$$\begin{aligned}a_u&=(n-2)(|\operatorname{opp}(u)|-1)\\&\quad -(n-3)m_u,\\ C&=\operatorname{diag}(a)-(n-1)A_M.\end{aligned}$$

The condition $C\succeq0$ is equivalent to feasibility of $Cz\ge0$, $z\ge\mathbf1$. It is sufficient for the same normalized-Laplacian bound. Positive residuals give a quantitative improvement, as stated in the paper. This matrix equivalence is classical; the graph-specific contribution is the partition identity that produces $C$.

For each $k\ge4$, form $H_k$ from $K_{k,k}$ by removing $k-2$ edges at one vertex. Neither $H_k$ nor its complement has a strict majority partition, but the weighted criterion applies. Its elementary exact gap is

$$\lambda_2(H_k)=1-\frac{\sqrt{k-2}}{k}.$$

The family's role is to separate certificate classes. Its spectrum is not presented as a previously inaccessible calculation.

## Technical account

The proof compares edge energy with degree-weighted variance. After choosing an ordinary mean-zero representative, a partition identity expresses their threshold difference as squares, internal edge energies, and diagonal terms. The strict-majority hypothesis makes every retained term nonnegative. Simultaneous vanishing leaves precisely the hub-and-two-cliques equality graph.

The weighted extension controls missing cross pairs with unequal endpoint weights. Changing signs on one side turns the resulting matrix into one with nonpositive off-diagonal entries. Classical positive scaling gives the linear feasibility test, including singular components.

The banner shows the smallest separating example, $H_4$. Its distinguished vertex has only two of four possible cross-neighbours, so the natural cut is not a strict majority cut. In fact no other majority cut exists either. On the graph of its two missing edges, the integer scaling $z=9$ at their common endpoint and $z=5$ at the two other endpoints gives residual $2$ at all three vertices. Set $z=1$ elsewhere; those residuals are $18$. Thus a directly checkable weighted witness succeeds.

For the pendant reduction, attach one new vertex only to $u$ of a connected $N$-vertex graph $H$. If $W$ is its volume and $c(g)$ its degree-weighted mean, the new graph clears $2/N$ exactly when

$$NE_H(g)-2V_H(g)\ge q(g_u-c(g))^2,$$

where

$$q=\frac{4(N-1)W}{(N-2)W+2(N-1)},$$

for every $g$. Completing the square in the pendant coordinate proves the equivalence. Complete bipartite bases with both parts at least two satisfy the strict bound; arbitrary joins need not.

## Evidence, assurance and limitations

The universal claims rest on the written proofs. The computational supplement uses integer matrices and fraction-free elimination to check every unlabeled graph of orders five through nine: 288,248 graphs in total. Both the Nordhaus–Gaddum bound and the diameter-at-most-two statement pass, with the recorded equality classifications. A separate exact audit checks 72,677 archived ten-vertex candidates and their complements; it verifies that list without certifying how the list was originally selected.

The archive records normal and optimized Python runs, tests of the arithmetic kernel, deliberately invalid inputs, graph-stream hashes and the nauty dependency. Enumeration completeness relies on nauty. Historical floating-point searches at orders ten and eleven are not used as exact exclusions.

All checking and model review occurred within a coordinated producer workflow. No unaffiliated reproduction, formal verification, external specialist review or editorial peer review is established. The bounded prior-art search does not prove global originality. No general lower bound beyond the stated structural classes is claimed.

## Relationship to earlier work

Faught, Kempton and Knudson posed the normalized-Laplacian Nordhaus–Gaddum problem. Kim and Madras developed structural and diameter-based estimates. The present sharp partition theorem and its quantitative form are compared against their stated bounds in the manuscript.

Scaled diagonal dominance, positive scaling of symmetric matrices with nonpositive off-diagonal entries, and Schur complements are established tools. The source comparison credits these methods and isolates the graph-specific identity, sufficient conditions and certificate-class separation. The paper also keeps combinatorial-Laplacian results of Einollahzadeh and Karkhaneei distinct from normalized-Laplacian claims.

## Who should care, and why

| Audience | Potential use | Required caution |
|:--|:--|:--|
| Spectral graph theorists | Inspect a sharp partition criterion and exact equality mechanism | The general complementary-pair conjecture is unresolved |
| Researchers developing certificates | Test a short integer scaling before computing a full spectrum | A sufficient certificate may fail on a graph that satisfies the bound |
| Specialists in matrix inequalities | Trace the graph-specific reduction to classical scaling theory | The classical matrix equivalence itself is not claimed as new |
| Computational mathematicians | Reproduce exact finite threshold tests and negative controls | nauty supplies enumeration completeness; internal checks are not independent reproduction |

## Why the problem matters

Complementation turns sparse connections into dense ones, but normalization changes with every vertex degree. This makes it difficult to transfer a familiar combinatorial-Laplacian argument directly. A structural condition with an exact equality case exposes where the sharp constant comes from. A weighted extension then shows how local counting can be relaxed while retaining a short certificate.

## How to inspect or reproduce the recorded checks

Begin with the paper and `STATUS.md`, then read `CLAIMS.json` and `COMPUTATIONAL_ASSURANCE.md`. The repository README lists the complete commands and environment requirements. With Python, SymPy and nauty available, run the arithmetic self-tests, the independent review checks and the weighted-certificate verifier in both ordinary and optimized Python. Reproduce the full order-nine enumeration with `verification/exact_small_graphs.py --geng /path/to/geng --max-n 9`, saving the output separately from the shipped receipts.

The archive manifest identifies the shipped files. Stream hashes, counts and equality classifications make the finite replay inspectable; neither a matching hash nor a passed finite enumeration establishes the universal theorem.

## The most valuable next projects

Find structural conditions that force a positive scaling witness, or construct graphs for which no partition admits one. Compare the certificate's quantitative margin with the true gap across families with controlled degree imbalance. Seek a proof addressing the remaining complementary pairs while preserving the exact hypotheses of the sharp bound. An unaffiliated check of the written arguments and complete finite replay would strengthen assurance.

## What is in the evidence package

The package contains the manuscript PDF and accessible source, exact claims, proof-review responses, prior-art comparisons, integer verification programs, weighted witnesses, finite-enumeration receipts, retained ten-vertex input data, environment details, licences, provenance and checksum manifests. `AI_INDEX.md` provides a machine-oriented route through the claims, dependencies, evidence and unresolved boundaries.
