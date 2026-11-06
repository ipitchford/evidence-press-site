## Summary

A total can conceal the behaviour of its parts. A polynomial may have coefficients that rise to the middle and then fall, while the different symmetry types contributing to those coefficients behave differently.

This candidate proves that this concealment does not occur for the **inverse Z-polynomial of a matroid**. A matroid describes independence: for example, which sets of vectors are linearly independent, without requiring coordinates. If a finite group acts on it, the polynomial's coefficients can remember that action. The result says that **each irreducible symmetry type separately** has multiplicities that rise towards the middle and then fall symmetrically.

The advance is a representation-valued lift of an already-public scalar proof, not a new proof of the underlying positivity theorem. The paper is an unrefereed, AI-assisted candidate with internal checking, not external peer review or formal verification.

## Summary for specialists

Let $M$ be a finite loopless rank-$r$ matroid with a finite group $W$ acting by automorphisms. For $r\ge2$, let $T=\operatorname{Tr}M$ be its rank-$(r-1)$ truncation and put $A(t)=Q_M^W(t)+tQ_T^W(t)$. In the complex representation ring $R(W)$,

$$
(1-t)Y_M^W(t)=A(t)-t^{r+1}A(t^{-1}).
$$

Writing $q_i=[t^i]Q$ and $y_i=[t^i]Y$, coefficient comparison gives

$$
y_i^W(M)-y_{i-1}^W(M)=q_i^W(M)+q_{i-1}^W(T)\in R(W)_+,
\qquad 0\le i\le\lfloor r/2\rfloor.
$$

Together with palindromicity, this proves equivariant unimodality. Ranks zero and one are handled separately. Loop deletion extends the assertion to arbitrary matroids under the paper's explicit ranked-flat-lattice convention. The conclusion addresses Gao–Li–Xie's Conjecture 1.2 under these normalisations, not their strong equivariant log-concavity conjecture.

## Technical account

Truncation lowers the maximum rank by one without changing the ground set or its group action. Most lower intervals in the flat lattice therefore remain unchanged. The proof writes characteristic-polynomial and inverse Kazhdan–Lusztig identities for both the original matroid and its truncation, then cancels the common-flat terms.

The important bookkeeping is equivariant: stabilisers, induced representations and virtual Möbius representations must survive the cancellation. Taking dimensions first would lose the information needed for the theorem. Existing equivariant inverse Kazhdan–Lusztig positivity then shows that each first difference is an actual representation.

For a concrete example, exchange the two elements of the rank-two Boolean matroid. Write $\mathbf1$ for the trivial representation and $\varepsilon$ for the sign representation. Then

$$Y(t)=\varepsilon+(\mathbf1+\varepsilon)t+\varepsilon t^2.$$

The trivial multiplicities are $(0,1,0)$; the sign multiplicities are $(1,1,1)$. Each sequence is symmetric and unimodal. Their dimensions add to $(1,2,1)$. Character values at a nonidentity group element can nevertheless be negative: effectiveness is a statement about irreducible multiplicities, not pointwise character inequalities.

The same coefficient identity supplies symmetric strings, an equality criterion and an abstract commuting $\mathfrak{sl}_2$ action. These are immediate consequences. The action depends on choices and is not a canonical geometric or Hodge–Riemann construction.

## Evidence, assurance and limitations

The universal assertion rests on the written representation-ring proof and the cited established positivity theorem of Braden, Huh, Matherne, Proudfoot and Wang. Supplementary exact calculations cover eleven specified matroids with a $C_2$ action, evaluating the identity and the selected involution. They do not compute every irreducible of every full automorphism group, and they cannot prove a universal theorem.

The checker retains original matroid ranks rather than replacing them by chain lengths in a fixed-flat subposet. Its targeted controls test corrupted recurrence, truncation and degree data, invalid action invariance, and invalid or negative symmetry multiplicities. Producer-side replay and internal AI-assisted review remain distinct from unaffiliated reproduction, external specialist review and proof-assistant verification.

No strong equivariant log-concavity, strongly induced log-concavity, canonical multiplication-compatible action or polarising form is established. A bounded source search found no earlier general equivariant proof; this is not an exhaustive priority guarantee.

## Relationship to earlier work

The Rethlas manuscript already proves the ordinary truncation identity and scalar unimodality, and explicitly raises the equivariant analogue. This release credits that mechanism. Its contribution is to carry the argument through the representation ring without discarding stabilisers or induction.

Proudfoot supplies the equivariant incidence-algebra framework. Gao, Li and Xie supply the inverse Z-polynomial and the target conjecture. Braden and collaborators supply the deep positivity input. The paper's source comparison also distinguishes inverse or dual Z-functions from the different dual Chow polynomial.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraic combinatorialists | Use an explicit formula for irreducible multiplicity increments. | Follow the stated conventions and inherited positivity theorem. |
| Representation theorists | Inspect symmetric strings and equality cases without losing the group action. | The constructed action is abstract and noncanonical. |
| Computational researchers | Reproduce small character examples and test equivariant bookkeeping. | Finite examples are not a substitute for the general proof. |

## Why the problem matters

Symmetry-sensitive inequalities distinguish structural information from numerical totals. Here a scalar pattern is lifted to every irreducible component, with a formula explaining exactly what is added at each degree. That formula is more informative than an unexplained shape constraint, while leaving the deeper geometric questions visibly open.

## How to inspect or reproduce the recorded checks

Start with the manuscript's conventions and main theorem, then follow the two auxiliary identities and the common-flat cancellation. The small two-element example provides a short check of signs and induction before the general argument.

The repository README and AI index describe the exact finite-check commands and retained verification records. Replay the shipped examples and negative controls in the documented environment. Compare the resulting character data with the defining formulas, not only a success message. A successful replay checks that bounded computation; it does not certify the external positivity theorem, novelty or the whole proof.

## The most valuable next projects

The most useful immediate step is unaffiliated specialist checking of the equivariant lift and its conventions. A deeper project is to identify a canonical geometric model whose operators realise the symmetric strings, rather than choosing an abstract representation with the right character. Strong equivariant log-concavity is a separate target: effective first differences do not imply the required tensor-product inequalities.

## What is in the evidence package

The package contains the self-contained research note and bibliography, exact finite-example code and recorded outputs, targeted checker controls, claim and source maps, a bounded novelty account, an AI-readable navigation index and integrity information. The manuscript identifies its external mathematical dependencies explicitly; the finite examples supplement rather than replace those arguments.
