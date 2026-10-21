## Summary

This page explains, in order: what a "center" of a network is and why people want to find it by looking only nearby, the question Guillaume Ducoffe asked about median graphs, what this release found, what that means for local certificates, and what has and has not been checked.

**The setting.** In a network, the *eccentricity* of a point is its distance to the farthest other point; a *center* is a point where that worst-case distance is as small as possible. A natural way to search for a center is local: start somewhere, look at the points within some fixed distance, and move if one of them is strictly better. If nothing nearby is better, one would like to conclude that the current point is already a center. Whether that conclusion is safe depends on how far one has to look. *Median graphs* are a well-studied family of networks (grids, trees and hypercubes are examples) in which any three points have a single "median" point lying on shortest routes between each pair. Their complexity is measured by *cube dimension*: the dimension of the largest hypercube they contain.

**What was asked.** In the Oberwolfach report *Radius functions in median graphs* (Open Problem 2), Ducoffe asked whether there is an absolute constant $c>0$ such that, in every median graph of cube dimension $d$, looking within distance $cd$ always suffices: any point that is best within that radius is a global best. The question is posed for a general class of weighted "radius functions", of which ordinary eccentricity is the simplest case.

**What was found.** The answer is no, and by a wide margin. For every odd $d\ge3$ the release constructs an explicit median graph of cube dimension $d$ with a point that is not a center, yet has no strictly better point within distance $2F_d-2$, where $F_d$ is the $d$-th Fibonacci number. The first strict improvement is at distance exactly $2F_d-1$ (3, 9, 25, 67, 177, 465 for $d=3,5,\ldots,13$). This works for ordinary eccentricity, with no weights. Combined with a known theorem of Alon and Vũ on large integer weights for threshold functions, the same transfer gives distances of size $d^{d/2}2^{-(2+o(1))d}$ in every sufficiently large dimension, which is larger than any fixed-base exponential $C^d$.

**What it means.** Inspecting a neighbourhood whose radius grows linearly with cube dimension, polynomially, or even like any fixed $C^d$, does not certify that a point is a center. The obstruction comes from integer arithmetic: distances to the corners of a grid encode strict inequalities, and the smallest integer solutions of those inequalities can be enormous. The result concerns certificates that demand an immediate strict decrease. It is not a lower bound on the running time of center-finding algorithms, and it is compatible with the known quasilinear-time algorithm for eccentricities on median graphs.

**Status.** An unrefereed candidate. The Fibonacci family has a self-contained written proof; the stronger all-dimensions bound imports the Alon–Vũ theorem, which is prior work. A standard-library checker replays finite instances. There is no unaffiliated specialist review, journal peer review, formal verification, independent rerun or established priority.

## Summary for specialists

For a nonnegative profile $\pi$ on a graph $G$, the radius function is $r_\pi(v)=\max_{u:\pi(u)>0}\pi(u)d_G(u,v)$; ordinary eccentricity is the case $\pi\equiv1$. For a vertex $o$ that is not a global minimizer of $f$, write $\rho_f(o)=\min\{d_G(o,x):f(x)<f(o)\}$ for the first strict-improvement distance. Ducoffe asked whether every median graph of cube dimension $d$ has all radius functions $G^{cd}$-unimodal.

| Result | Statement | Proof basis |
|---|---|---|
| Theorem (§2) | For every odd $d\ge3$, an explicit finite median graph $H_d$ of cube dimension exactly $d$ has a noncentral vertex $o$ with $\rho_{e_d}(o)=2F_d-1$ for ordinary eccentricity $e_d$ | Self-contained |
| Lemma (§2.1) | For the alternating AND/OR sign system, the minimum $\ell_1$-norm of an integer strict separator is $L_n=2F_{n+1}-1$, attained by $z^*=(F_1,F_2,\ldots,F_n,-F_{n-1})$ | Self-contained |
| Transfer proposition (§3) | For any strictly separable $S\subseteq\{-1,1\}^d$, the minimum integer separation norm $\lambda(S)$ is realized exactly as $\rho$ for a 0–1 corner profile on a grid, and for ordinary eccentricity on a finite median graph of cube dimension $d$ | Self-contained |
| Corollary (§3) | For every sufficiently large $d$, there is a median graph and noncentral vertex with $\rho_e(o)\ge d^{d/2}2^{-(2+o(1))d}$ | Uses [AV97, Theorem 3.3.1 and its proof] |
| Proposition (§4) | Every strictly feasible sign system has an integer separator with $\lVert z\rVert_\infty\le d^{d/2}$ and $\lVert z\rVert_1\le d^{d/2+1}$ | Cramer's rule and Hadamard's inequality |
| Extremal scale (§4) | In the 0–1 corner-profile model on integer grids, the largest first-improvement distance has logarithm $(1/2+o(1))d\log_2 d$ | Corollary plus Proposition; upper bound restricted to this model |

The explicit Fibonacci construction already rules out every polynomial locality bound; the Alon–Vũ corollary rules out every bound $C^d$ with fixed $C$. The upper bound is restricted to the corner-profile model and is not asserted for all median graphs.

## Technical account

**Corners encode inequalities.** On the grid $\{-N,\ldots,N\}^d$ (a Cartesian product of paths, hence median, with cube dimension exactly $d$), graph distance is $\ell_1$-distance, and the distance from $x$ to the corner $Ns$ is $dN-s\cdot x$. With profile value 1 on a set of corners $\{Ns: s\in S\}$, the radius function is $r_\pi(x)=dN-\min_{s\in S}s\cdot x$. So a vertex $x$ strictly improves on the origin exactly when $s\cdot x>0$ for every selected $s$, and the nearest improvement is the integer strict separator of smallest $\ell_1$-norm.

**A Fibonacci separator.** Define Boolean functions by alternating AND (even steps) and OR (odd steps), for example $f_6(u)=u_6\wedge(u_5\vee(u_4\wedge(u_3\vee(u_2\wedge u_1))))$, and attach signs $s(u)=(2f_n(u)-1)(2u_1-1,\ldots,2u_n-1,1)$. Because all scores are integers, any integer separator must give positive inputs score at least 1 and negative inputs score at most $-1$. Comparing carefully chosen pairs of inputs, with the outer coordinates set to neutral values, forces $a_i\ge1+\sum_{j\le i-2}a_j$, hence $a_i\ge F_i$, and one further negative input bounds the constant term. This gives $\lVert z\rVert_1\ge2F_{n+1}-1$. The vector $z^*$ attains it, because the weighted sum $\sum F_ju_j$ reproduces the AND/OR recursion as a threshold test. With $d=n+1$ and $N=F_n$, the origin's first strict improvement on the grid is at distance exactly $2F_d-1$.

**From radius functions to ordinary eccentricity.** Attach a pendant path of length $K=2dN$ at each selected corner. Attaching leaves preserves the median property, pendant edges lie in no cycle, so cube dimension stays $d$. The far endpoints of the paths dominate all other vertices, so on the grid the eccentricity equals $K+r_\pi$, and every added vertex is farther than $2F_d-1$ from the origin. The construction does not depend on the particular Boolean function, which is the transfer proposition.

**The all-dimensions bound.** Alon and Vũ proved that for every sufficiently large $d$ there is a strict odd homogeneous threshold function every integer representation of which has some weight at least $d^{d/2}2^{-(2+o(1))d}$. Its sign system has minimum integer separation norm at least that large, and the transfer proposition converts it into a median graph. The existence of these large-weight functions is the cited theorem, not a new result of this release; Håstad had established the corresponding leading exponent along powers of two.

**Why strict decrease matters.** In the smallest ordinary-eccentricity graph, the base vertices $(0,0,0)\to(1,0,-1)\to(1,1,-1)$ have eccentricities $9,9,8$, with moves of lengths 2 and 1. An equal-value move can therefore enable a later strict decrease. The explicit graph has order $(2F_{d-1}+1)^d+2^{d-1}(2dF_{d-1})$, so cube dimension, not graph order, is the asymptotic parameter.

The cover is a schematic grid-and-pendant-path composition, not a full drawing of a high-dimensional example or numerical evidence.

## Evidence, assurance and limitations

The written proofs establish the proposed mathematical result. The exact checker audits eight finite Boolean instances (complete tables for even $n=2,4,\ldots,16$), excludes closer improving grid vertices in dimensions three and five, and checks all 20,825 distinct-vertex triples of the complete 51-vertex example. Normal and optimized Python runs include three negative controls, which corrupt a witness, a sign constraint and a claimed distance and require rejection. These finite checks support, but do not prove, the infinite-family claims, the determinant bound or the external threshold theorem.

This remains an unrefereed candidate. Producer replay and internal model-mediated editorial reports do not establish unaffiliated reproduction, journal peer review, formal verification or historical priority. A supplied separate checker was rerun locally, but its authorship and unaffiliated status are unverified. The supplied review prompted the Alon–Vũ strengthening and the explicit equal-value-move example.

Strict decrease matters: in the smallest example an equal-value move of length two permits a later improvement of length one. No running-time lower bound for arbitrary algorithms follows. Cube dimension is not graph order, and the constructed graphs can be large. The release does not classify all median graphs with $G^p$-unimodal radius functions or settle the separate weighted-center algorithm question.

## Relationship to earlier work

The question is Open Problem 2 in Ducoffe's Oberwolfach report (Report 8/2026), located via UnsolvedMath and checked in the primary report. Cube-free median graphs are already known to have $G^2$-unimodal radius functions (Chalopin–Chepoi–Dragan–Ducoffe–Vaxès, Corollary 6.3). Fibonacci growth for nested threshold functions is established prior machinery (Servedio), and the large-weight threshold functions are due to Alon and Vũ, building on Håstad. The proposed contribution is the exact realization of integer separation norm as graph improvement distance, its dimension-preserving conversion to ordinary eccentricity, and the resulting locality bounds. A bounded literature search, refreshed on 21 September 2026, found no prior source establishing this transfer; priority remains unestablished.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Graph theorists | Test radius-unimodality conjectures against explicit median graphs | General median-graph upper bounds remain open here |
| Threshold theorists | Translate integer-weight lower bounds into graph locality | The cited weight theorems are prior work |
| Algorithm researchers | Identify limits of immediate-descent certificates | Plateau moves and global algorithms remain available |

## Why the problem matters

A local optimality test is useful only when its inspection radius is justified. These examples show that the proposed radius cannot scale linearly with cube dimension, or even as any fixed-base exponential. The result clarifies what a local certificate can promise; it does not undermine established global eccentricity algorithms, such as the $O(m\log^4 m)$ all-eccentricities algorithm of Bergé, Ducoffe and Habib for $m$-vertex median graphs.

## How to inspect or reproduce the recorded checks

Download and extract the versioned evidence archive. With standard-library Python (3.10 or later; the producer tested 3.14.7), run:
```
python3 verify.py --output replay.json
python3 -O verify.py --output replay-optimized.json
```
Compare both outputs with `verification.json`, then check `MANIFEST.sha256`. Read Sections 2–4 for the universal proofs, and the primary Alon–Vũ source for the external theorem. Finite replay is not a substitute for those arguments.

## The most valuable next projects

Determine upper bounds for all median graphs, study plateau-permitting movement, and reduce graph order while retaining large strict-improvement distances. An unaffiliated proof review and separate reimplementation would strengthen assurance without changing the current status retrospectively.

## What is in the evidence package

The package includes PDF, Markdown and TeX manuscripts; the exact verifier and expected output; claim and source records; internal editorial reports; the response to the supplied review; licence boundaries; and a complete file manifest. Original prose and data use CC0, and original code uses MIT. Cited papers and supplied third-party review files are linked or described, not relicensed or redistributed.
