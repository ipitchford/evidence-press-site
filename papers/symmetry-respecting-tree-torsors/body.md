## Summary

A spanning tree connects every vertex of a graph without forming a cycle. The critical group has exactly as many elements as the graph has spanning trees. Can those group elements move one tree to any other in a way that respects every graph symmetry?

This candidate gives an exact existence test and counts the compatible actions. Its strongest family result covers any number of internally separate paths between two terminals: for a simple graph with at least three paths, the answer is yes precisely when the lengths are all different and at least one is even.

Replacing each edge by two edges can change the answer from no to yes. The topology and abstract symmetry group can remain the same. That is a structural consequence of the proof, not a pattern extrapolated from the examples.

## Summary for specialists

For a finite abelian $\Gamma$-module $A$ and prescribed $\Gamma$-set $X$ of the same cardinality, admissible affine torsor classes lie in the restriction kernels $K_H$ where $X^H$ is nonempty and outside them where $X^H$ is empty. The positive marks must equal $|A^H|$. Inclusion–exclusion counts simultaneous feasibility, and orbit matching constructs each compatible action.

For simple $B(\ell_1,\ldots,\ell_k)$, $k\ge3$, the full-automorphism torsor exists exactly when lengths are distinct and at least one is even. With distinct lengths and $e$ even paths, the number of equivariant torsor classes is zero for $e=0$, one for $e=1$, and $2^{e-1}-1$ for $e\ge2$. The paper also counts actual action maps and gives an orientation-independent cactus construction.

## Technical account

Choosing a base tree converts a compatible torsor into an affine action described by a cocycle. A subgroup fixes either no points or a coset of its fixed subgroup in $A$. All subgroup marks, rather than only elementwise characters, identify a finite group set. These classical tools yield the simultaneous criterion.

For the parallel-path family, cut–flow relations retain the natural critical-group action. Equal-length path swaps fix a positive number of trees strictly smaller than the number of fixed group elements, excluding a torsor. Distinct lengths leave only terminal reversal, acting by inversion. Its affine fixed-point equation is controlled by the quotient $A/2A$.

Uniform even subdivision of a distinct-length family gives $2^{k-1}-1$ torsor classes. At every cycle rank at least two, this supplies positive and negative homeomorphic planar graphs, of arbitrarily large girth, with symmetry group $C_2$. The positive class is not minor-closed.

## Evidence, assurance and limitations

The universal claims rest on written proofs. Producer checks cover all 31 connected simple graphs through five vertices, 19 direct action-count comparisons, 12 original theta instances, and 123 additional graph-level tree/Laplacian calculations. Deliberate corruption is rejected. The added lattice route is implementation diversity within the same workflow, not independent reproduction.

The supplied review reported targeted separately written checks, but its separate verification code was not available for inspection here. Internal editorial role review is not external specialist refereeing. Formal verification, historical priority and external validation remain unestablished.

The result addresses explicitly defined minimum equivariance. It does not supply a uniquely preferred action, a minor-consistent algorithm, or an efficient general decision procedure. The example showing failure of separate restriction conditions is an abstract module/set example, not a demonstrated graph example.

## Relationship to earlier work

Finite decidability is immediate by enumerating normalized bijections; it is not the advance claimed here. Affine torsors, cohomology and subgroup marks are classical, and the source catalogue already asserted the affine reduction, fixed-point obstruction and unicyclic construction.

Chan–Church–Grochow directly distinguish torsors from canonical bijections and study planar ribbon root independence. Wagner's linear permutation-representation obstruction is not a test of all affine twists. Bernardi, rotor-routing and recent regular-matroid consistency results retain additional structure; regular-orthogonal-matroid results change the spanning objects and Jacobian. The present classification and subdivision consequences concern a different, explicitly stated scope.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraic graph theorists | A full parallel-path classification and quantified non-uniqueness | Historical priority remains open |
| Torsor and chip-firing researchers | Separate abstract-graph symmetry from ribbon and consistency questions | No minor-consistent construction is supplied |
| Computational group theorists | Implement and compare restriction-kernel feasibility backends | No general runtime gain has been measured |

## Why the problem matters

Equal cardinalities do not guarantee a symmetry-compatible algebraic action. The classification identifies when that compatibility fails, and shows why a graph's topology or abstract symmetry group alone cannot decide it. Exact class counts also distinguish existence from uniqueness.

## How to inspect or reproduce the recorded checks

Download and extract the release ZIP, install the pinned SymPy dependency, and run:

```sh
python3 -m pip install -r requirements.txt
python3 verify_bundle.py --replay
```

The harness checks hashes, recomputes finite outputs, tests deliberate corruption, verifies that assertion-dependent scripts refuse optimized Python, and runs the new explicit-check implementation under optimization. Read the proof separately, especially the induced cut–flow action and repeated-path determinant.

## The most valuable next projects

Find an actual graph exhibiting a pure simultaneous obstruction, implement the full integer-linear restriction backend, and test structural extensions beyond parallel-path and cactus families. External scrutiny of the proof and prior-art boundary would add more assurance than repeated producer agreement.

## What is in the evidence package

The archive contains the nine-page paper and sources, accessible Markdown, exact code and results, claim index, source and review-response records, internal editorial reports, pinned dependency, CI workflow and hash manifest. The original review ZIP remains preserved separately. Third-party review and catalogue text are not silently relicensed in the public archive.
