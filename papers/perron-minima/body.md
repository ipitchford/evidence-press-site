## Summary

An optimisation routine can stop improving at a local minimum that is still worse than the best possible answer. This candidate identifies a structured matrix problem with **no such traps**, and shows how easily that property can disappear.

Each pair of matrix entries shares a fixed total. The total comes from one positive weight for each member of the pair; a bias redistributes it between the two directions. Under this **factorisation** assumption, every local minimum of the dominant eigenvalue is globally optimal. Every optimum corresponds to putting the members in a complete order and pushing each bias to its allowed limit.

Change one pair strength slightly so that it no longer fits the factorisation, and strict local minima can become traps. The distinction matters: a nearly correct structural assumption need not preserve the optimisation landscape, even when it still provides an approximation bound.

## Summary for specialists

For $n\ge2$, $m_i>0$, $\gamma_i\ge0$ and $0<t<1$, let

$$A_{ii}=\gamma_i,$$

$$A_{ij}=\sqrt{m_i m_j}(1+tS_{ij}),$$

where $S^\mathsf T=-S$ and $|S_{ij}|\le1$. Theorem 2.1 classifies every local minimum of $\rho(A)$ on this skew box as saturated and transitive. All $n!$ transitive orders are globally optimal and cospectral, with characteristic polynomial

$$\Phi(\lambda)=\frac{(1+t)P_-(\lambda)-(1-t)P_+(\lambda)}{2t},$$

where

$$P_\pm(\lambda)=\prod_i[\lambda-\gamma_i+(1\pm t)m_i].$$

The minimum Perron root is the unique root above $\max_i\gamma_i$. A fixed transitive order is a common optimiser across all admissible parameters. For a rectangular uncertainty box, its worst optimum is at $(m^+,\gamma^+,t^-)$. There exists a fixed robustly Schur-stable orientation exactly when $\max_i\gamma_i^+<1$ and the corner polynomial satisfies $\Phi(1)>0$.

## Technical account

The local argument uses left and right Perron vectors. At an unsaturated stationary edge, the relevant second derivative is negative. At a minimum, the resulting vector ratios force a strict order, hence saturation and transitivity. A determinant identity then gives the same polynomial for every transitive order. Compactness supplies a global minimiser, so the classification proves that all the listed local minima attain it.

For $n\ge4$ and positive general pair weights, Theorem 4.1 characterises factorisation through transitive-order cospectrality **for every nonnegative diagonal**. Four-point determinants expose the classical one-factor tetrad relations. Those algebraic relations are prior work; the claimed spectral equivalence is the contribution here.

![Twenty-four strict local minima split into two spectral levels after a one-percent change to one pair weight.](/assets/art/perron-minima-landscape.svg)

*The order-four example has zero diagonal, $t=1/2$, five pair weights equal to one and the remaining weight $b_{12}=1.01$. All 24 transitive vertices are strict local minima: 16 have Perron root approximately 2.668314818, while eight have approximately 2.668151280. The separation is magnified; this is not a plot of the full continuous landscape. The 16 higher vertices are therefore nonglobal. The lower eight are not asserted to be global by this example alone.*

Proposition 4.2 proves this phenomenon for arbitrarily small positive perturbations, not just the plotted example. At the same time, pair weights within a multiplicative factor $\kappa$ of a factorisation give a $\kappa^2$ approximation guarantee for transitive orders. A near-optimal objective and a trap-free landscape are different properties.

A separate tournament part gives a constructive spectral-deficit recovery bound at even order. Its six-vertex example returns four edge edits although a nearest extremiser is one edit away. The construction promises a bounded witness, not a nearest one; the tournament maximum must not be confused with a maximum over the continuous skew box.

## Evidence, assurance and limitations

The archive contains written proofs, exact polynomial and interval checks, symbolic identities, 40 semantic corruption controls, historical replay and supplied referee code. Publication testing found that the historical numerical manifest was too strict: all 30 seeded inputs matched and all optimisations succeeded, but only two complete numerical trial records matched byte-for-byte. The largest objective discrepancy was about $2.1\times10^{-14}$, even with pinned packages.

Version 1.0.1-candidate retains exact equality for exact results and adds a numerical contract: identical inputs, finite outputs, feasibility and explicit tolerances. Six corrupt numerical cases must be rejected. The raw differences remain in replay evidence. This repair does not turn numerical experiments into a proof of the general theorem.

The result is **unrefereed**. Supplied review documents and all current replays belong to the producer-side workflow; neither proves unaffiliated reproduction, formal verification or external specialist endorsement. The robust criterion concerns a fixed orientation and an unknown fixed matrix, not arbitrary switching products. No empirical application or exhaustive priority finding is claimed.

## Relationship to earlier work

Psarrakos and Tsatsomeros studied rank-one/skew perturbations and related tournament bounds. Kirkland studied arc reversals. Engel and Sergeev optimise over independent row permutations, a different admissible set. Drton, Sturmfels and Sullivant supply the classical tetrad algebra. The source audit separates these antecedents from the candidate's exact box classification, robustness consequences and spectral converse. The constructive tournament section also retains the earlier Evidence Press parity mechanism identified in the manuscript as EP26.

## Who should care, and why

| Audience | Potential use | Boundary |
| --- | --- | --- |
| Matrix optimisation researchers | A complete local-to-global classification and explicit obstruction | Requires the stated factorisation and bias range |
| Robust control researchers | A common-optimiser rule and exact worst-corner test | Fixed orientation; not switched-system stability |
| Spectral graph theorists | Constructive tournament recovery with a deficit bound | Even-order tournament domain; not nearest recovery |
| Verification researchers | Exact and numerical evidence with different replay contracts | Local replay is not independent proof validation |

## Why the problem matters

Structural assumptions can do more than simplify a formula: they can remove every suboptimal local minimum. This paper makes that benefit precise and supplies a matching warning. A small modelling departure may preserve a useful approximation ratio while destroying the guarantee that local improvement finds the optimum.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md`, `CLAIMS.json` and Theorem 2.1. Install the pinned `requirements.txt`, then run:

```sh
python -B replay.py --full --out ../replay
python -OO -B replay.py --full --out ../replay-optimized
```

The wrapper checks the manifest before and after replay. Exact reports regenerate in the package; operational logs and fresh historical reports go to the chosen output directory. Read `PUBLICATION_AUDIT.md` for the numerical contract, and the separately published archive-bound `REPLAY_RECEIPT.json` for the final local and CI evidence.

## The most valuable next projects

An unaffiliated proof audit and replay would improve assurance first. Substantive research targets include a fuller landscape classification beyond factorisation, sharp near-factorisation constants and improved constructive tournament recovery. Applications need their own model justification and validation; this release supplies no measured applied benefit.

## What is in the evidence package

The 15-page PDF, TeX and readable manuscript; exact, symbolic and numerical code; finite examples and controls; unchanged historical archives and supplied review; source and claim ledgers; an AI index; pinned requirements; licences and a complete checksum manifest. Original prose and data are CC0, original code MIT, with historical and third-party exceptions recorded separately.
