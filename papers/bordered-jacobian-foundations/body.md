## Summary

Multiplying two binary forms forgets one degree of freedom. If the first factor is multiplied by a scalar and the second by its inverse, their product does not change. The candidate identifies this lost relative-scaling direction and claims that it controls **every** way of adding one final row to the multiplication Jacobian.

Let $A$ and $B$ have degrees $r$ and $s$. Write $M$ for the coefficient Jacobian of $(A,B)\mapsto AB$, and put

$$
\kappa=(a_0,\ldots,a_r,-b_0,\ldots,-b_s).
$$

For every border row $v$, the central candidate identity is

$$
\det\!\begin{pmatrix}M\\v\end{pmatrix}
=(-1)^{s(r+1)+1}\operatorname{Res}(A,B)\langle v,\kappa\rangle.
$$

It is stated as an identity over the integers for all $r,s\geq1$, including $r=s$. Equivalently, every signed maximal minor of $M$ is one coordinate of $\kappa$ multiplied by the resultant and an explicit global sign.

> **Status:** anonymous, unrefereed candidate. Producer-side exact replay passes. The all-degree identity rests on the manuscript proof. Independent reproduction, complete formal verification and editorial peer review have not occurred.

## Why the formula matters

The formula turns a family of large determinants into one geometric pairing. In exterior-algebra language, the top exterior power of the multiplication differential is the resultant times contraction along the lost scaling direction.

If $g$ is bihomogeneous of weight $(p,q)$, adjoining its derivative gives

$$
\det D(m,g)=(-1)^{s(r+1)+1}(p-q)g\operatorname{Res}(A,B).
$$

Taking $g=\operatorname{Res}$ recovers the earlier degree-difference identity

$$
\det D\Phi_{r,s}
=(-1)^{s(r+1)}(r-s)\operatorname{Res}(A,B)^2.
$$

This makes the factor $r-s$ conceptually visible: it is the scaling weight seen when the derivative of the resultant is paired with $\kappa$.

The same principle gives three further consequences. It identifies precisely when the map is etale on the coprime locus in characteristic $p$; it shows that a scalar depending only on the product cannot complete the missing direction; and it explains the equal-degree case. At $r=s$, the bordered identity itself remains nonzero in general—only the Euler weight used for the resultant vanishes.

## What is classical, and what is offered here

The resultant as the determinant of a suitable Koszul-complex strand is classical. The candidate expressly does **not** claim that principle as new. Its bounded contribution claim concerns the explicit bordered coordinate identity, both sign laws, uniform treatment of equal degrees, and the derivation of the degree-difference and characteristic consequences from one contraction formula.

The recorded audit inspected four central classical sources at full text: Chardin and three papers of Jouanolou. It identified several genuine antecedents—divisibility of maximal minors by the resultant, bordered determinant calculations and gradient identities—but did not locate the exact candidate formula in that bounded corpus. Non-location is not proof of novelty or priority.

## Verification and evidence

The executable suite uses exact arithmetic only. One path uses SymPy symbolic Berkowitz determinants. A separately written path uses FLINT integer-polynomial arithmetic and fraction-free Bareiss elimination. They agree coefficient by coefficient in the shared small-degree range.

The deep tier reports 93 passing checks. It covers the full determinant identity through $r+s\leq8$ with spot checks at $(4,5)$, $(5,5)$ and $(5,6)$; the maximal-minor identity, including equal degrees, through $r+s\leq7$; symbolic-root product formulas; a gap-Vandermonde lemma; base-point signs through $r,s\leq40$; characteristic-$p$ examples; contraction cases; and five negative controls.

The publication workflow reran the suite in a fresh pinned environment. The default tier passed 58 checks normally and under `python -O`; the deep tier passed 93. The negative controls detected a perturbed Jacobian, wrong sign, wrong resultant power, flipped kernel vector and transposed-bidegree confusion.

These checks are finite and producer-side. The two backends share a specification and workflow. Their agreement reduces implementation risk but is not independent reproduction, and finite bidegrees cannot prove an all-degree quantifier.

## Formalisation boundary

Mathlib already contains machine-checked resultant constructions and a universal monic factorisation ring whose Jacobian is the Sylvester matrix and which is etale on the coprime locus. Those are related ingredients, not a formal proof of this release.

The manuscript lists the remaining bridge: formalise the rectangular multiplication differential and its kernel, prove the signed maximal-minor identity, and derive the Euler contraction with the exact coefficient order. Until those steps are completed, the release's formal-verification status is partial rather than passed.

## What the result does not establish

- Passing checks do not prove the all-degree theorem or its semantic correspondence to every intended geometric object.
- The two computational backends are not unaffiliated implementations.
- A cross-model adversarial review is not independent external verification.
- The developmental review concerned v0.2 text without the complete v0.3 evidence package.
- Existing Mathlib ingredients do not make the bordered identity formally verified.
- The bounded literature audit does not establish novelty, priority or absence of equivalent formulations.
- The infinitesimal explanation does not by itself prove the global affine-space geometry discussed in the surrounding Jacobian-conjecture work.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Resultant and elimination theorists | Compare an explicit signed bordered identity with classical Koszul and Macaulay determinant formalisms. | Determine whether the coordinate formula exists under another convention or language. |
| Algebraic geometers studying factorisation spaces | Use the scaling-kernel viewpoint to organise etaleness, normalisers and equal-degree degeneration. | Downstream torsor and affine-slice claims require separate review. |
| Formalisation researchers | Turn a short list of bridge lemmas into a complete Lean statement connected to existing Mathlib components. | The current blueprint is not a completed formal proof. |
| Computer-algebra developers | Reimplement the determinant and minor checks in an independent exact stack. | Do not treat the two packaged backends as independent reproduction. |
| AI research agents | Discover exact formulas, hypotheses, hashes, evidence layers and open objections in machine-readable form. | Preserve the candidate status and every negative assurance field. |

## The most valuable next projects

1. Independently reconstruct the proof and audit both sign chains, especially the four boundary-column deletions.
2. Reimplement the finite identities in a separate exact CAS without consulting the production code beyond the public statement.
3. Formalise the bordered identity and corollaries in Lean, reporting every imported theorem and axiom.
4. Search more widely for equivalent formulas in subresultant theory, determinants of complexes, theses and non-English literature.
5. Re-audit the downstream degree-difference, torsor, divisor-class and affine-slice results using the new foundations identity.

## What is in the evidence package

- The 12-page manuscript in PDF and TeX.
- The exact SymPy/FLINT verification suite and pinned requirements.
- Deep and default receipts, plus a fresh publication-gate replay record.
- Five deliberate mathematical failure controls.
- Human- and machine-readable claim maps.
- Citation, novelty, assurance, provenance and quality-gate records.
- A SHA-256 manifest covering all frozen files.
- The producer-workflow adversarial review, developmental review and response.

All original non-code contents are dedicated to the public domain under CC0 1.0; original code is MIT. The immutable archive is available from [GitHub](https://github.com/ipitchford/bordered-jacobian-foundations/releases/tag/v0.3-candidate) and [Zenodo](https://zenodo.org/records/21855302).
