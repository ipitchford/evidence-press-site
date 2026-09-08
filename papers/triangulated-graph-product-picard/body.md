## Summary

Take two networks, form a square for each pair of edges, and divide every square into two triangles. The resulting surface-like object carries a tropical version of a divisor class group: a way to classify integer configurations after identifying those related by allowed piecewise-linear changes.

This unrefereed candidate gives a uniform description of that group. The two original networks contribute their own classes; pairs of independent cycles contribute an additional free part. The answer works for every choice of square diagonals. Parallel edges require an explicit local convention, and the paper carefully distinguishes the discrete ridge group from the larger group with continuous Jacobian factors.

## Summary for specialists

Let $G,H$ be finite connected loopless multigraphs, each with at least one edge, with circuit ranks $g,h$. Give edges unit length and use the Cartwright–Lazar structure constants on any independently diagonally triangulated product $\Gamma$. Under the branch-local Cartier convention, the written proof gives

$$\operatorname{Pic}_r(\Gamma)\cong\mathbb Z^{2+gh}\oplus K(G)\oplus K(H),$$

and

$$\operatorname{Pic}(\Gamma)\cong J(G)\times J(H)\times\mathbb Z^{2+gh}.$$

Here $K$ denotes finite graph critical groups and $J$ denotes metric-graph Jacobian tori. The splittings are noncanonical. For simple factors, this proves Lazar's product formula; the multigraph extension uses branch germs, not restriction of global vertex potentials to stars.

## Technical account

Signed diagonal coefficients turn compatibility into two incidence equations. Decomposing each rational edge space into cuts and cycles eliminates the mixed cut–cycle blocks, leaving exactly the cut–cut and cycle–cycle blocks. Rooted path integration supplies integer lifts, so the argument does not confuse rational rank with integral solvability.

The principal diagonal lattice is primitive. Its quotient therefore contributes no new torsion. A separate integer argument identifies the factor kernel. Explicit diagonal flips preserve the signed data, intertwine principal divisors and commute even when squares share a boundary. For two cycles, the all-ones tensor can be a nonprimitive class: it is the greatest common divisor of the cycle lengths times a primitive generator.

The full Picard group is obtained through Cartwright's sheaf comparison. Its Jacobian torus is not the finite ridge Chern kernel. The general results rest on these written arguments, not extrapolation from the software.

## Evidence, assurance and limitations

The package contains the complete proof, exact-arithmetic diagnostic code, manifests, source attribution and a response to the supplied review. Producer checks exercise 27 product/triangulation cases, 682 local germ patterns, all 512 diagonals for the three-cycle product, 36 primitive cycle lifts, 12 individual flips and 66 commuting pairs. These overlapping test categories are not a count of distinct product complexes.

The publication workflow adds internal AI editorial review, fresh-extraction replay and fail-closed controls. These are not unaffiliated specialist acceptance, independent reimplementation or formal proof verification. Historical priority remains uncertain. The theorem excludes loops, disconnected factors and arbitrary edge lengths; point factors have a separate lower-dimensional answer. No practical performance or workflow-acceleration effect has been measured.

## Relationship to earlier work

Lazar's 2017 paper supplies the conjectural formula and the earlier factor-map and tree results. Cartwright supplies the tropical divisor framework, the ridge/full comparison and an earlier torus example. The torus group shape itself is not claimed as new.

An earlier UnsolvedMath catalogue record supplied the diagonal exact-sequence and incidence-primitivity reduction. The release archives that record with attribution and identifies its version limits and corrected claims. The present contribution is the uniform integral closure, explicit compatibility lattice and constructive refinements, not discovery of the conjectural formula or of cut–cycle linear algebra.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Tropical geometers and chip-firing researchers | Inspect a uniform integral product argument and ridge/full comparison. | The parallel-edge convention and cited sheaf inputs are essential. |
| Computational algebra researchers | Implement integral class normal forms and test triangulation transport. | The supplied code is diagnostic, not a general-purpose normal-form library. |
| Interested mathematical readers | See why rational dimensions do not determine an integer class group. | Finite checks support inspection, not universal proof certification. |

## Why the problem matters

The product question asks how divisor theory changes when graph factors form a two-dimensional complex. Recovering the entire integer group requires controlling torsion and local integrality, not just counting dimensions. The explicit lattice makes that distinction inspectable and offers a concrete starting point for further tropical product calculations.

## How to inspect or reproduce the recorded checks

Download the evidence ZIP or clone the research repository. With Python 3.10 or later, install the pinned SymPy dependency using `python3 -m pip install -r requirements.txt`, then run `python3 release_check.py` from the extracted directory. It checks file hashes, exhaustive diagnostic parity and optimization-mode rejection. Expected output ends in PASS.

Read Theorems 1–2 and Sections 2–6 for the universal proof. The verifier's success is not a substitute for inspecting those arguments. The environment is specified but not hermetically pinned.

## The most valuable next projects

1. Unaﬃliated scrutiny of branch-local Cartier lifting, the integer factor kernel and the full-Picard comparison.
2. An independently written normal-form implementation with documented basis conventions.
3. A specialist antecedent search for equivalent product formulas and integral lattice constructions.
4. Carefully formulated extensions to arbitrary metric lengths or other excluded graph classes.

## Who might contribute

Specialists in tropical divisor theory can assess the sheaf conventions; integer-lattice software authors can independently implement the quotient construction. Neither task should inherit correctness from producer replay alone.

## What is in the evidence package

The archive provides the PDF and Markdown proof, verifier and release checker, pinned dependency, exact receipt, claim index, audit, response matrix, source identity records and component licences. Original prose is CC0-1.0 and original code is MIT; the attributed catalogue record retains CC-BY-4.0. GitHub and Zenodo preserve the same release assets. Communication art and audio explain the result but are not additional mathematical evidence.
