## Summary

How much information can a mathematical summary safely discard? A Betti poset keeps the part of a monomial ideal's divisibility structure that supports its algebraic resolution. A conjecture proposed that this smaller structure also determines its Stanley projective dimension, an invariant defined by decomposing monomials into simple pieces.

This candidate gives two ideals with the same Betti poset but different Stanley projective dimensions: **three and two**. Each has six minimal generators. Their full least-common-multiple lattices differ by just one element, invisible to the Betti poset but consequential for Stanley decompositions.

Six generators is the smallest possible threshold: the accompanying finite census checks the ideal assertion across all 7,443 five-atom lcm-lattices, complementing earlier results for smaller ideals and for quotients. The revision also puts the separation inside one polynomial ring, using an explicit squarefree ideal and a single-variable colon operation.

The result refutes the **ideal part of Katthän's Betti-poset conjecture**. It does not refute Stanley's inequality for monomial ideals. The separate conjecture for quotient rings remains open; both quotients in this example have Stanley projective dimension five.

*Banner: exact cover diagrams of the 60-element and 59-element lcm-lattices. The filled nodes are their common 56-element Betti poset, counting the bottom. Deleting the amber element with atom set 23456 leaves this poset unchanged but lowers the ideal's Stanley projective dimension. Positions are schematic; nodes and order relations are computed from the displayed finite lattices.*

## Summary for specialists

Over any field $K$, consider

$$
I=(x_1x_2^2,x_2x_3^2,x_3x_1^2,x_4^2,x_5^2,x_1x_2x_3x_4x_5)
\subset K[x_1,\ldots,x_5]
$$

and

$$
\begin{aligned}
J=(&y_2^2y_3^2y_6y_7,\ y_5y_7^2,\ y_1y_2y_3y_4y_5,\\
&y_1^2y_3^2,\ y_4y_6^2,\ y_1y_2^3)
\subset K[y_1,\ldots,y_7].
\end{aligned}
$$

With the manuscript's explicit correspondence of the six generators,

$$
\mathcal B(I)\cong\mathcal B(J),\qquad
\operatorname{spdim}I=3,\quad\operatorname{spdim}J=2.
$$

The Stanley depths are respectively two and five. Because the ambient rings have different numbers of variables, the relevant invariant comparison is $\operatorname{spdim}M=n-\operatorname{sdepth}M$, not equality of the raw depths. The quotient total Betti numbers are $(1,6,15,20,12,2)$ in both cases; multigraded data agree under the stated abstract lattice correspondence, not as degrees in one original polynomial ring.

The complete five-atom census has 1,485 Betti-poset isomorphism classes. The ideal Stanley projective dimension is constant within each class: 1,358 lattices have value one and 6,085 have value two. Together with the established smaller-generator results, this gives the six-generator minimality statement.

## Technical account

### An element that homology does not see

Encode a lattice element by the set of generator indices below it. The first lattice is the Boolean lattice on six atoms with the four sets $1245,1256,2456,12456$ removed. The second additionally removes $23456$:

$$
|L_I|=60,\qquad L_J=L_I\setminus\{23456\},\qquad |L_J|=59.
$$

The deleted element is meet-irreducible and absent from the Betti poset. Integral crosscut homology checks show that the relevant groups are torsion-free, so the equality of Betti posets does not depend on the field. The common poset contains 56 elements under the convention that includes the bottom.

Betti data and Stanley decompositions answer different questions. The first record homological information. The second require a disjoint partition of a characteristic poset into intervals with sufficiently many free coordinates. Preserving the former does not preserve the latter.

### Positive witnesses and the nine-point obstruction

The characteristic posets contain 188 points for $I$ and 671 for $J$. Explicit decompositions into 32 and 79 Stanley spaces establish depths at least two and five. A nine-monomial obstruction excludes depth three for $I$; the revised argument explicitly rules out the coincident-interval case identified in the supplied review. Separate finite exact-cover checks test the obstruction and the upper threshold for $J$.

This is a combination of written arguments, inspectable finite witnesses and exhaustive decisions. Agreement between implementations is useful producer-side evidence, not proof-assistant formalisation or unaffiliated reproduction. The nine-point obstruction is inclusion-minimal where each one-point deletion is checked; no minimum-cardinality claim follows from that.

### A squarefree colon example in one ring

In $T=K[z_1,\ldots,z_{14}]$, the revision constructs a six-generator squarefree ideal $H$ for which the colon ideal $(H:z_{14})$ has the same Betti poset, while

$$
\operatorname{sdepth}_T H=11,
\qquad\operatorname{sdepth}_T(H:z_{14})=12.
$$

Equivalently, the ideal Stanley projective dimensions are three and two. Only one generator contains $z_{14}$; taking the colon removes that variable from that generator. The construction labels the union of the meet-irreducibles needed by the two lattices, so it retains the information required after deletion. It is an explicit instance of the published squarefree-colon formulation, not a new general coordinatisation theorem. Fourteen variables is not claimed minimal.

The quotients still have equal Stanley projective dimension five, hence Stanley depth nine in this common ring. Re-realising the same lattices does not produce a quotient-side counterexample.

## Evidence, assurance and limitations

The mathematical evidence consists of explicit generators, finite lattice and homology data, constructive decompositions, the repaired nine-point argument and the complete five-atom census. The public package distinguishes exact checking of this finite evidence from the structural theorems that connect the computations to monomial ideals.

The supplied review identified substantive issues in the original hand proof, quotient-realisation bookkeeping, solver handling of unresolved thresholds, and the printed decomposition. The revised package records their dispositions. Review text and coordinated replay are not relabelled as external human peer review. No unaffiliated reproduction or proof-assistant verification is established here.

The main limits are mathematical, not just procedural:

- This is the ideal assertion of Katthän's conjecture, not its quotient assertion.
- Both original ideals satisfy Stanley's inequality: their ordinary depths are one and three, below their Stanley depths two and five.
- The restricted stoss-complex route is not refuted by this pair; its required complete skeleton is absent.
- Six-generator searches are exploratory, not a complete census or a frequency estimate for counterexamples.
- A bounded prior-art search does not establish global priority.

## Relationship to earlier work

[Katthän's 2016 paper](https://doi.org/10.1007/s40598-016-0039-5) states the Betti-poset conjecture and explains how its ideal assertion would imply Stanley's inequality for ideals. This counterexample blocks that sufficient route; it does not decide the larger inequality. The squarefree colon formulation and the restricted alternative must be distinguished.

[Ichim, Katthän and Moyano-Fernández](https://doi.org/10.1016/j.jcta.2017.03.005) establish the lcm-lattice control and monotonicity used here. Their [earlier computational paper](https://doi.org/10.1080/10586458.2015.1005257) already contains the five-atom lattice count and the quotient result for at most five generators. The new census comparison concerns the ideal invariant within Betti-poset classes; the count 7,443 is not new.

The finite partition method comes from [Herzog, Vladoiu and Zheng](https://doi.org/10.1016/j.jalgebra.2008.01.006). The known counterexamples to Stanley's conjecture for quotients concern a different assertion and are not what is established by this release.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Commutative algebra researchers | A minimal-generator obstruction to recovering ideal Stanley projective dimension from a Betti poset. | The quotient assertion and Stanley's inequality for ideals remain open here. |
| Researchers studying monomial resolutions | A concrete distinction between homological information and interval-partition constraints. | Abstract lattice correspondence is not equality of multidegrees in different rings. |
| Computational algebra researchers | Small positive witnesses and a complete five-atom comparison for testing implementations. | Unresolved solver outcomes must remain unknown, not become exact values. |
| Independent checkers | A repaired local argument and explicit squarefree colon formulation. | Internal replay and the supplied review do not establish external assurance. |

## Why the problem matters

A useful invariant compresses information without discarding what a target question needs. Here a homologically meaningful compression loses exactly the kind of information needed by a different decomposition problem. The counterexample identifies that boundary in a finite, explicit form, rather than merely warning that the two theories might differ.

Minimality strengthens the example: no ideal with at most five minimal generators can exhibit this particular failure. It does not make six-variable or fourteen-variable ambient realisations minimal, nor does it settle adjacent conjectures.

## How to inspect or reproduce the recorded checks

Start with the matched generator order in the paper. Compute all 64 subset least common multiples for each six-generator ideal and compare their closure families. Then inspect integral homology and the map between their Betti posets. Check the positive partitions point by point before reading the nine-point obstruction and its no-merger repair.

For the minimality claim, distinguish completeness of the 7,443 lattice representatives from invariant computation and grouping into Betti-poset classes. Each is a separate obligation. Follow the final package's `README.md`, `REPLAY_RECEIPT.md` and `AI_INDEX.md` for exact commands, input hashes, normal and optimized execution, negative controls and scope. The narration and diagrams are explanations, not additional evidence.

## The most valuable next projects

1. Determine whether the quotient Stanley projective dimension is fixed by the Betti poset; this pair has equal quotient values and does not answer it.
2. Analyse the restricted stoss-complex formulation on its own hypotheses, without treating this counterexample as a witness to it.
3. Characterise which Betti-invisible lattice deletions can change the ideal invariant.
4. Reduce the ambient variable count in squarefree colon examples, with a separately proved minimality statement if possible.
5. Reproduce the finite census and the repaired proof outside the coordinated producer workflow.

## What is in the evidence package

The package contains the manuscript and source, exact generators and certificates, the five-atom census and comparison data, verification code and replay instructions, source comparisons and review dispositions, machine-readable claims, an agent-readable index and explicit licence and assurance records. Original prose and diagrams are CC0; original executable code is MIT. Third-party material retains its own terms.
