## Summary

This page explains, in order: the puzzle Sun posed, the single exception found, how the exception and the general answer are proved, what the evidence does and does not establish, and how to rerun the computations.

**The question.** Take a finite field, a finite number system in which one can add, subtract, multiply and divide, and arrange all of its nonzero elements around a circle. Multiply each pair of neighbours and add the same fixed element. Can the circle always be arranged so that every resulting value is *primitive*, meaning that its powers run through every nonzero element of the field? In graph language, this asks whether a certain graph on the nonzero field elements has a *Hamilton cycle*: a closed tour visiting every vertex exactly once.

**What was conjectured.** Sun conjectured (Conjecture 3.8, dated 17 September 2013) that the answer is always yes once the field has more than seven elements. Luo and She later proved this for all very large fields (more than 18,888,871 elements) and for the case where the fixed element is zero, leaving a large but finite range open.

**What was found.** The conjecture is false in exactly one case: arithmetic modulo eleven, with the fixed element equal to two. There the ten nonzero elements cannot be arranged as required, and the reason is a short hand proof, not a failed computer search. Every other case is positive. A refined counting argument shrinks the open range from about 1.2 million field sizes to 510, and a computer then builds and checks an explicit arrangement for every remaining parameter.

**What it means.** Sun's universal statement needs one correction, and with that correction the question is completely settled. The revision also extracts a reusable test that guarantees a tour survives the deletion of some vertices and edges.

**Status.** An unrefereed, computer-assisted candidate. The checks are coordinated internal checks, not unaffiliated reproduction, formal verification or journal peer review.

## Summary for specialists

Let $G_{q,a}$ have vertex set $\mathbb F_q^\times$ and edges $xy$ for distinct vertices satisfying $a+xy\in\operatorname{Prim}(\mathbb F_q)$. A circular permutation of $\mathbb F_q^\times$ with every $a+a_ia_{i+1}$ primitive is exactly a Hamilton cycle of $G_{q,a}$. The claimed computer-assisted theorem (Theorem 2) is

For $q>7$,

$$
\begin{gathered}G_{q,a}\text{ is Hamiltonian}\\\Longleftrightarrow\\(q,a)\ne(11,2).\end{gathered}
$$

Luo–She supplies $a=0$ and all $q>18\,888\,871$. An exact sieved criterion leaves 510 field orders, the largest 92,821. The remaining positive cases require 3,472,147 verified cycles and 84,645,360,506 cyclic edge occurrences. These are repeated edge checks, not that many distinct graph edges.

| Result | Basis |
|---|---|
| Theorem 2: for prime powers $q>7$, $G_{q,a}$ is Hamiltonian iff $(q,a)\ne(11,2)$ | combination of the rows below |
| Proposition 3: $G_{11,2}$ is not Hamiltonian | written proof (forced four-cycle); exhaustive check for $q=11,13$ |
| Lemma 5: sieved lower bound for the number of pairs $(x,y)\in X\times Y$ with $a+xy$ primitive | written proof, classical sieve |
| Theorem 6: if $\varphi(n)-1-M\ge M+c$, then $G_{q,a}$ is Hamiltonian for $a\ne0$ | written proof via Chvátal–Erdős |
| Theorem 6 covers all $8\le q\le18\,888\,871$ except 510 fields ($471$ prime, $39$ extension) | two exact implementations over $1\,205\,121$ prime powers |
| Every nonzero $a$ in the 510 fields except $(11,2)$ has a Hamilton cycle | regenerated witnesses, deterministic checker |
| Theorem 7: sufficient vertex-and-edge deletion criterion | written proof; corollary of the same strategy |
| $a=0$ for $q>4$, and all $a$ for $q>18\,888\,871$ | imported, Luo–She Theorem 1.2 |

## Technical account

The exception can be understood without a computer. The primitive residues modulo eleven are $2,6,7,8$. For $a=2$, both vertices 2 and 9 have exactly the neighbours 3 and 8. Every Hamilton cycle would have to use all four of their incident edges. Those edges already close the four-cycle $2,3,9,8,2$, leaving the other six vertices outside.

For the positive result, a classical primitive-element sieve bounds the number of allowed ordered pairs between arbitrary vertex sets. Applying it to an independent set paired with itself improves the independence estimate. A small-component argument bounds connectivity, and the Chvátal–Erdős theorem connects the two estimates to Hamiltonicity.

**Why the sieve helps.** Theorem 6 checks two estimates against each other. Every vertex has degree at least $\varphi(q-1)-2$. A maximum independent set $I$ satisfies $E(I,I)\le|I|$, because only diagonal pairs can contribute, so the sieve bound gives $\alpha\le M+c$; a smallest component left by a minimum vertex cut has at most $M$ vertices, so the connectivity is at least $\varphi(n)-1-M$. The hypothesis of Theorem 6 makes the connectivity bound at least the independence bound, so the Chvátal–Erdős theorem applies. Using $I\times I$ directly, rather than splitting $I$, is what improves the earlier constant: the seed's bound is $2B+1$ with $B=W(q-1)\sqrt q$, and its splitting argument would give $2M+1$ (Remark 8). Together with the sieve, this lowers the largest unresolved $q$ from $18\,888\,871$ to $92\,821$.

**How the finite range is closed.** Exact computations test Theorem 6 for the remaining $1\,205\,121$ prime powers $8\le q\le18\,888\,871$, over products of subsets of the prime divisors of $q-1$. One route lists the $2\,693$ fields that fail the seed criterion and then sieves them; a separate route applies the criterion directly to every prime power in range. Both leave the same 510 fields. For those, a randomised search proposes cycles and a separate checker, using different polynomial arithmetic, confirms the characteristic, field size, permutation and every primitive adjacency. For extension fields it also proves that the supplied modulus is irreducible, by checking that $X$ has exact multiplicative order $q-1$. The exact required coverage is $\sum_{q\in R}(q-1)-1=3\,472\,147$ cycles and $\sum_{q\in R}(q-1)^2-10=84\,645\,360\,506$ cyclic edge occurrences; the subtractions remove the exceptional ten-vertex graph.

The revised manuscript also isolates a reusable sufficient condition. If a loop-augmented adjacency count obeys

$$
E(X,Y)\ge t\bigl(|X||Y|-M\sqrt{|X||Y|}\bigr),
$$

and the original minimum degree is at least $d$, then deleting at most $r$ vertices and edges of deletion degree at most $h$ preserves Hamiltonicity whenever at least three vertices remain and

$$
d+1-r-h\ge2M+\frac{2h+1}{t}.
$$

This is a corollary of the same established strategy, not a sharp threshold or a claim of a new general Hamiltonicity theory.

## Evidence, assurance and limitations

The package separates written arguments, inherited theorems, exact residual enumeration and regenerated cycle witnesses. The search is heuristic; the checker deterministically tests the field representation, vertex permutation, cyclic edges and complete parameter coverage. Search failure is not used to prove the exceptional case.

Full historical witness streams are not stored. Reproduction regenerates them and checks them; validating a receipt is not the same task. The supplied reviewer freshly reran both residual routes and 332 fields. Publication-stage execution has its own source-bound receipts. These remain coordinated internal checks, not unaffiliated reproduction, formal verification or journal peer review.

The extension and stronger replay support the stated finite classification and computational closure. They do not by themselves establish broader mathematical significance or downstream impact.

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
