## Summary

Arrange every nonzero element of a finite field around a circle. Multiply each pair of neighbours and add the same fixed element. Can every resulting value be primitive—a value whose powers visit all the nonzero elements?

Sun conjectured that the answer was always yes when the field has more than seven elements. This candidate finds exactly one exception: arithmetic modulo eleven, with the fixed element equal to two. It combines a short obstruction with earlier large-field theory and exact finite computation to give the corrected classification.

## Summary for specialists

Let $G_{q,a}$ have vertex set $\mathbb F_q^\times$ and edges $xy$ for distinct vertices satisfying $a+xy\in\operatorname{Prim}(\mathbb F_q)$. The claimed computer-assisted theorem is

For $q>7$,

$$\begin{gathered}G_{q,a}\text{ is Hamiltonian}\\\Longleftrightarrow\\(q,a)\ne(11,2).\end{gathered}$$

Luo–She supplies $a=0$ and all $q>18\,888\,871$. An exact sieved criterion leaves 510 field orders, the largest 92,821. The remaining positive cases require 3,472,147 verified cycles and 84,645,360,506 cyclic edge occurrences. These are repeated edge checks, not that many distinct graph edges.

## Technical account

The exception can be understood without a computer. The primitive residues modulo eleven are $2,6,7,8$. For $a=2$, both vertices 2 and 9 have exactly the neighbours 3 and 8. Every Hamilton cycle would have to use all four of their incident edges. Those edges already close the four-cycle $2,3,9,8,2$, leaving the other six vertices outside.

For the positive result, a classical primitive-element sieve bounds the number of allowed ordered pairs between arbitrary vertex sets. Applying it to an independent set paired with itself improves the independence estimate. A small-component argument bounds connectivity, and the Chvátal–Erdős theorem connects the two estimates to Hamiltonicity.

The revised manuscript also isolates a reusable sufficient condition. If a loop-augmented adjacency count obeys

$$E(X,Y)\ge t\bigl(|X||Y|-M\sqrt{|X||Y|}\bigr),$$

and the original minimum degree is at least $d$, then deleting at most $r$ vertices and edges of deletion degree at most $h$ preserves Hamiltonicity whenever at least three vertices remain and

$$d+1-r-h\ge2M+\frac{2h+1}{t}.$$

This is a corollary of the same established strategy, not a sharp threshold or a claim of a new general Hamiltonicity theory.

## Evidence, assurance and limitations

The package separates written arguments, inherited theorems, exact residual enumeration and regenerated cycle witnesses. The search is heuristic; the checker deterministically tests the field representation, vertex permutation, cyclic edges and complete parameter coverage. Search failure is not used to prove the exceptional case.

Full historical witness streams are not stored. Reproduction regenerates them and checks them; validating a receipt is not the same task. The supplied reviewer freshly reran both residual routes and 332 fields. Publication-stage execution has its own source-bound receipts. These remain coordinated internal checks, not unaffiliated reproduction, formal verification or journal peer review.

The supplied referee’s central prospective assessment was 2★ overall, with a borderline 3★ interpretation possible and rigour assessed at 3★. The extension and stronger replay do not establish 4★ significance. These are provisional judgements, not REF decisions.

## Relationship to earlier work

The graph model, character estimate, large-field theorem and zero-parameter construction are inherited from Luo–She. The sieve has established antecedents in Cohen–Prešern and Cohen–Huczynska. The candidate contributes the exception, corrected finite classification, refined independence bound and computational closure.

This is distinct from the [Sun–Hou primitive-sum release](/releases/sun-hou-primitive-sum-circle/): that problem uses every field element and adjacent sums, not shifted products on the nonzero elements.

## Who should care, and why

Finite-field combinatorialists get a precise correction and finite closure of the circular-permutation conjecture. The infinite branches are imported; their hypotheses still need inspection.

Graph theorists get a sufficient discrepancy-and-degree deletion criterion, not an optimal resilience bound.

Computational researchers and agents get a generator/checker separation with explicit field validation. Full replay regenerates a large witness stream.

## Why the problem matters

An eventual-existence theorem cannot identify the exceptional small cases. Here, a ten-vertex obstruction changes the original universal statement. The value is a precise completed classification with inspectable computational obligations, rather than a numerical trend or a search that merely failed to find a counterexample.

## How to inspect or reproduce the recorded checks

Download the versioned package and begin with `AI_INDEX.md`, `ASSURANCE.md` and `REPLAY_RECEIPT.md`. Install the pinned dependencies and run `python3 code/replay.py --out ../new-replay --workers 4`. The directory must be new. The driver derives the residual set twice and regenerates every required cycle, recording both subprocess statuses. Run `code/controls.py` normally and with Python optimization to test rejection of corrupted inputs.

## The most valuable next projects

An independently written verifier and a complete unaffiliated replay would strengthen assurance. Mathematically, a direct construction or a sharper structural account of exceptional shifted-product graphs would add more than another large run of the same computation. The deletion bound’s sharpness is open here.

## What is in the evidence package

The manuscript and source; exact claim and dependency maps; two residual calculations; cycle generator and strict verifier; pinned environment; per-field replay receipts and field moduli; negative controls; review dispositions; and a complete byte manifest. The public package excludes private review material and third-party source copies rather than relicensing them.
