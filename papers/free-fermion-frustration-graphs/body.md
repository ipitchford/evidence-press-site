## Summary

Some interacting quantum-spin systems have a surprisingly simple energy spectrum: every energy can be obtained by adding or subtracting a short list of basic energies. A graph records which terms in the Hamiltonian anticommute. Can that graph tell us exactly when this simplification survives **every choice of coupling strengths**?

This candidate gives an exact answer for faithful Pauli realisations: the graph must contain neither an induced claw nor an induced even cycle. Earlier work established that this condition is sufficient; the paper supplies the converse under the stated representation assumption. Outside this class, couplings that yield a free whole spectrum lie in a proper algebraic exceptional set.

There is a second, different kind of simplification. The full system can split into invariant blocks, each with a free spectrum. The paper gives explicit formulas for two periodic spin chains and checks 107 graph examples exactly. A larger set of numerical examples remains open to proof.

## Summary for specialists

For $H=\sum_j b_jh_j$ with Hermitian involutions that pairwise commute or anticommute, let $G$ be the frustration graph. Under a faithful Pauli realisation—equivalently, linearly independent Pauli symplectic vectors—the full spectrum is free at every $b\in\mathbb R^{V(G)}$ if and only if $G$ is even-hole- and claw-free. For other graphs the free locus is proper real algebraic, hence has empty interior and measure zero.

For claw-free graphs, the sector analysis separates ordinary freeness **F**, complete proportional occupation of the prescribed polynomial modes **W**, and power-of-two replication **Z**. Central cycle coefficients plus an exact characteristic-polynomial identity give all-coupling fixed-block certificates. The periodic Fendley chains at $N=8,9$ each have four such blocks. W is hereditary; strict Z-heredity is not proved.

## Technical account

The original even-hole, claw-free theorem supplies sufficiency. The faithful converse combines explicit claw and even-hole obstructions with induced-subgraph restriction and closure. A separate cumulant/Newton-identity argument makes the free locus algebraic. These are written arguments, not extrapolations from the finite census.

The sector certificate has a stricter obligation than locating possible eigenvalues. For a coefficient-label class $\mathcal C$ it checks

$$\begin{aligned}
&\prod_{\sigma\in\mathcal C}\det(x-\rho_\sigma(H))\\
&\qquad=F_{\lambda_{\mathcal C}}(x)^{m_{\mathcal C}}.
\end{aligned}$$

The identity fixes **which energies occur and how often**. An annihilating polynomial by itself only restricts possible energies. The revised three-mode proposition supplies a missing occupation argument: a trace projector at an independent-set witness gives every allowed parity pattern; spectral continuity and polynomial continuation extend the resulting identity to all couplings under the proposition's hypotheses.

![Exact three-mode parity witness: couplings 1, 2, 4 give positive-parity energies minus 5, minus 3, 1 and 7; the opposite parity gives minus 7, minus 1, 3 and 5. Each occurs twice when the irreducible dimension is eight.](/assets/art/free-fermion-frustration-graphs-parity.svg)

*An exact witness for the repaired argument, not a generic energy plot. The displayed occupation count assumes irreducible dimension eight; the proposition gives multiplicity $d/4$ more generally. It requires connectedness, claw-freeness, independence number three, central cycle coefficients and a central top charge.*

For the periodic nine-spin chain, define the products

$$\beta_a=b_ab_{a+3}b_{a+6}.$$

Its four fixed blocks each contain 16 copies of the eight sign sums of three modes. Their squared modes solve the following equation for each pair of signs:

$$\begin{aligned}
y^3-e_1y^2+e_2y\qquad&\\
-(\beta_0+\tau_1\beta_1+\tau_2\beta_2)^2&=0.
\end{aligned}$$

Here $e_1=\sum_jb_j^2$ and $e_2$ sums $b_i^2b_j^2$ over pairs at cyclic distance at least three. At uniform couplings the fixed blocks merge into coefficient sectors of dimensions 128 and 384. The latter is not an ordinary free multiset. Thus “four free blocks at every coupling” must not be compressed into “every coefficient sector is free at every coupling”.

## Evidence, assurance and limits

The separately implemented exact checker passes all **107 graphs**, spanning **792 coefficient-label classes** and **1,404 central characters**. The slower original FLINT implementation has also been replayed on a bounded subset; its partial receipt is clearly labelled. The default replay includes exact identities, input-corruption controls and the hardened numerical checks under ordinary and optimized Python.

At the original sampled couplings, all 1,728 selected positives pass the revised Z test and all 1,201 selected negatives fail it; a fresh 64-graph sample also passes. These are floating-point checks. Of the 1,728 selected positives, **1,621 still lack an exact all-coupling certificate**. Archived census totals were recounted, not independently regenerated.

The manuscript and received model review were revised together, including the faulty Kramers counting argument and a superseded supergraph-search suggestion. This is producer-coordinated checking and implementation diversity, not external peer review, unaffiliated reproduction or formal proof. A DOI makes the package retrievable; it does not establish correctness or priority.

## Relationship to earlier work

Elman, Chapman and Flammia provide the sufficient graph condition. Chapman, Elman and Mann construct free-fermion ladder operators on specified symmetry sectors; the present coefficient-sector convention requires an explicit conditional bridge and does not automatically inherit that operator construction. Ruh and Elman's reductions and induced-subgraph heredity constrain the proposed extensions.

Recent work by Zheng, Pozsgay and Chen treats periodic chains at arbitrary length through transfer relations. The contribution here is the explicit central-character resolution and multiplicities at **two specified lengths**, not the first general periodic-chain solution. Models with special coupling relations or nonfaithful representations lie outside the faithful all-independent-coupling converse.

## Who should care?

| Reader | What this package offers |
| --- | --- |
| Mathematical physicists | A precise necessity statement complementing a known sufficient condition, with representation assumptions exposed. |
| Researchers in exactly solvable spin models | Two all-coupling periodic block formulas and examples beyond the simplest sufficient graph classes. |
| Computational algebra researchers | Complete-multiplicity certificates, two exact implementations and adversarial rejection tests. |
| Graph theorists | An inspectable census that separates certified examples, numerical candidates and structural conjectures. |

## Why this problem matters

An energy spectrum with a short mode description can replace exponentially many energy values with a much smaller object. Knowing when that compression is guaranteed helps distinguish robust structure from a coincidence at one parameter choice. The result is a tool for understanding solvability, not evidence of an immediate computational speedup in an application or a complete dynamical solution.

## How to inspect and reproduce

Start with the [AI index](https://github.com/ipitchford/free-fermion-frustration-graphs/blob/v1.0.0-candidate/AI_INDEX.md), then the claim map, manuscript and [revision response](https://github.com/ipitchford/free-fermion-frustration-graphs/blob/v1.0.0-candidate/review/REVISION_RESPONSE_V4.md). From a clean extraction of the versioned package:

```sh
python -m pip install -r requirements.txt
python -B replay.py --out /tmp/ffd-replay
python -O -B replay.py --out /tmp/ffd-optimized
```

The output folders must be new or empty and outside the package. The wrapper checks complete manifest coverage and hashes before and after replay. The optional `--full-flint` route runs the slower original implementation on all 107 graphs; it is not needed to run the complete default exact checker. See the replay receipt for executed scope and environment.

## Most valuable next projects

1. Independently reconstruct the faithful converse and the repaired parity-completeness proof, with special attention to representation and collision assumptions.
2. Extend exact certification to noncentral-coefficient examples among the 1,621 numerical candidates.
3. Determine whether strict Z-heredity holds; W-heredity does not settle its replication requirement.
4. Construct ladder operators for the new certified examples or find a structural criterion beyond the current three-mode case.

## What is in the package?

The PDF and TeX manuscript are accompanied by accessible text, the AI index, content-derived claim identifiers, source and citation audits, review dispositions, exact and numerical code, archived graph records, pinned dependencies, replay receipts and a complete checksum manifest. Original prose and data are CC0-1.0; original code is MIT, with received third-party material separately identified.
