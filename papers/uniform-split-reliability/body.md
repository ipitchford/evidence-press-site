## Summary

Imagine a network whose links can fail independently. Here success does not mean keeping everyone connected. It means leaving **exactly two connected groups**, with a designated terminal in each group and no stranded third group.

For a fixed number of vertices and edges, can one network maximise that success probability whatever the common link-survival probability is? This candidate settles the existence question outside two edge counts. Trees have a uniformly best design; a substantial intermediate range has none; sufficiently dense networks have an explicit best design. “None” means that no single graph wins at every probability—not that a best graph fails to exist at a chosen probability.

The two remaining boundary counts are settled by exact finite certificates for every order from 7 to 51. Their all-order resolution remains conditional. The paper also separates probability ranges in the remaining inequality rather than presenting partial analytic control as a complete solution.

## Summary for specialists

Let $H$ be a connected simple graph on $n\ge7$ vertices with $m$ edges and distinct terminals $s,t$. Edges survive independently with common probability $p$. A uniformly most split reliable graph maximises $\operatorname{SR}_{s,t}(H;p)$ over the fixed-$n,m$ class simultaneously for every $p\in[0,1]$.

The classification is:

| Edge count | Existence of a uniform maximiser |
| --- | --- |
| $m=n-1$ | Yes: a path with its ends as terminals, from earlier work. |
| $n\le m\le\binom n2-n-1$ | No. |
| $m\in\{\binom n2-n,\binom n2-n+1\}$ | Conditional in general; certified for $7\le n\le51$. |
| $\binom n2-n+2\le m\le\binom n2$ | Yes: the specified balloon construction. |

Consequently, for $7\le n\le51$, existence is equivalent to $m=n-1$ or $m\ge\binom n2-n$. This classifies **existence**, not every terminal-labelled optimiser or all equality cases.

## Technical account

The organising identity expresses split reliability as a difference of ordinary all-terminal reliabilities:

$$\operatorname{SR}_{s,t}(H;p)=\operatorname{Rel}(H/st;p)-\operatorname{Rel}(H;p).$$

Identifying the terminals turns precisely the successful two-component configurations into connected configurations. Parallel edges must be retained. The loop created when $st$ is an edge can be discarded in the probability identity, but not silently dropped from the fixed-edge-count generating polynomial: its factor is $1+x$. This distinction matters to a coefficient checker.

At small $p$, the leading split coefficient is a spanning-tree count of the terminal-identified graph. Near $p=1$, local optimality forces a different structural requirement. In the intermediate density range, explicit competitors make those endpoint requirements incompatible. In the dense range, suitable all-terminal extremal comparisons support the same balloon design.

The two boundary counts reduce to an inequality for clique-plus-cone graphs. Writing $C_N(s)$ for a clique on $N-1$ vertices with a new vertex joined to $s$ clique vertices, $q=1-p$ and $h=N-2-\varepsilon$, the sufficient comparison is

$$\begin{aligned}(1-q^{d+1})\operatorname{Rel}(C_N(h-d);p)\\ {}\ge p\operatorname{Rel}(C_N(h);p).\end{aligned}$$

for $\varepsilon\in\{0,1\}$ and $1\le d\le N-5-\varepsilon$. Exact coefficient certificates cover $7\le N\le50$, corresponding to release orders through $n=51$. These finite certificates are not an all-order proof.

The revised manuscript adds an analytic comparison at every order: for $N\ge7$, $3\le s<h\le N-1$ and $d=h-s$, the cone inequality holds for $1/2\le p\le1$. In the boundary range above it also holds on an explicit positive interval next to zero:

$$0\le p\le1-R^{-1/L},$$

where

$$R=\frac{(d+1)(h-d)}h\left(\frac{N-1}{N}\right)^d>1$$

and

$$L=\binom{N-1}{2}-1-\varepsilon.$$

The upper interval follows from clique cut bounds and cone connectivity events; the lower interval follows from spanning-tree bounds. These are **all-order, partial-probability** conclusions. They do not resolve the intervening interval or promote the finite full-interval theorem to all orders.

## Evidence, assurance and limitations

The package combines written universal arguments with exact finite computations. The analytic nonexistence and dense-existence proofs have a different scope from the finite boundary certificates. Agreement between implementations within the same production workflow is a useful error check, not unaffiliated reproduction.

This is an unrefereed, AI-assisted mathematical candidate. Internal assessment and producer-side replay do not establish external specialist review, editorial peer review or proof-assistant formal verification. The general two-boundary inequality and a complete description of all optimisers remain open. The independent, identical edge-survival model is an assumption, not a validated description of any particular physical network.

## Relationship to earlier work

Brown and Mol introduced split reliability in 2017. Brown and McMullin studied uniform optimisation in 2023, including the tree case. Romero's local-optimality analysis supplies the structural boundary against which uniform optimality is tested. Classical all-terminal reliability results and spanning-tree comparisons enter the reductions. The contribution here is the classification outside two edge counts, the explicit obstruction mechanism and the certified finite resolution of those boundary counts—not the introduction of split reliability or the tree optimiser.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Extremal graph theorists | An existence classification and explicit endpoint incompatibility. | The two general boundary counts remain conditional. |
| Reliability researchers | A bridge from two-component success to ordinary reliability polynomials. | Terminal identification preserves parallel-edge semantics; coefficient loops require care. |
| Exact-computation researchers | Integer certificates and distinct algorithms for cone comparisons. | Finite checking is not universal proof or independent reproduction. |
| Network designers | A precise warning that a design best at one survival rate need not be best at another. | This mathematical success criterion differs from ordinary connectivity and practical engineering objectives. |

## Why the problem matters

Uniform optimality asks for a design that survives uncertainty about the parameter itself. The classification shows when that demand is possible and when changing link reliability necessarily changes the design comparison. The identity and endpoint method also provide reusable ways to turn a global probability comparison into exact combinatorial questions.

## How to inspect or reproduce the recorded checks

Start with the archived README and replay receipt, which identify the commands, dependencies and exact scope of the completed checks. The manuscript gives the definitions and the proofs needed to interpret their outputs.

From a fresh extraction, run `bash verification/reproduce.sh /tmp/umsr-full-fresh`, choosing a new output directory. The `--quick` option checks only cone orders 7–10 and is not a replay of the full finite theorem. The full route covers orders 7–50 in normal and optimised Python, command-line failure controls, loop and zero-star checks, brute-force root-set checks and 5,422 supplied boundary-case graphs. It compiles the C implementation from source.

Inspect the split-polynomial checker against direct edge-subset enumeration before relying on larger graph scans. For the boundary comparison, distinguish the fast exact coefficient calculation from the slower orbit-subset implementation, and compare their overlapping range. Do not replace the integer certificate with a floating-point probability grid. A successful replay validates the recorded finite computation; it does not independently certify the written all-order arguments.

Historical logs and corpora are labelled separately from fresh receipts. Three large historical raw output files were absent from the supplied package; another historical output is omitted from the public export, while its source and input corpus remain available for regeneration. Historical summaries must not be presented as fresh replay of every enumeration. The base-case graph corpus is supplied evidence, not a new independent completeness certificate. See `REPLAY.md` for the exact boundary and regeneration instructions.

## The most valuable next projects

1. Resolve the remaining cone comparison for all orders and all probabilities, preserving the exact parameter range.
2. Characterise equality and all terminal-labelled uniform maximisers, not only existence.
3. Seek a shorter structural proof of the boundary inequality that explains the coefficient positivity rather than extending the computational cutoff alone.

## What is in the evidence package

The linked versioned repository and archive contain the self-contained manuscript, exact checking programs, reproducibility instructions and scoped verification records. The release page, briefing and graphics explain that package; they add no mathematical evidence. Cite the exact version when reporting a discrepancy or extending a claim.
