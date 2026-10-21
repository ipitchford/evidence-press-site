## Summary

**The setting.** Multiply two polynomials and you get a third. Each coefficient of the product depends on the coefficients of the two factors, and the *Jacobian matrix* of this multiplication records how sensitive every product coefficient is to every input coefficient. That matrix is the basic tool for asking whether multiplication can be "undone" locally, which is central to the study of factorisation spaces and to the related geometry around the Jacobian conjecture.

**The lost direction.** Multiplying two binary forms (homogeneous polynomials in two variables) forgets one degree of freedom. If the first factor is multiplied by a scalar and the second by its inverse, their product does not change. The Jacobian therefore has one column more than it can control: it is one row short of being square.

**What is offered.** The candidate identifies this lost relative-scaling direction and claims that it controls **every** way of adding one final row to the multiplication Jacobian. Whatever row is added, the resulting determinant is the *resultant* of the two forms (the classical number that vanishes exactly when they share a factor) times a single pairing of the new row with the scaling direction, with an explicit sign. The identity holds over the integers, for all degrees, including the equal-degree case that earlier arguments treated as exceptional. As a consequence, an earlier Evidence Press identity behind the degree-difference principle now has a shorter integral proof that uses no irreducibility or factoriality arguments.

**Status.** An anonymous, unrefereed candidate. Producer-side exact replay passes. The all-degree identity rests on the manuscript proof. Independent reproduction, complete formal verification and editorial peer review have not occurred.

A separate [Evidence Press child release](https://evidencepress.org/releases/exact-smith-invariants-affine-determinant-lines/) develops the all-factor determinant-line and exact character-lattice Smith theory; its immutable archive is [doi:10.5281/zenodo.21861347](https://doi.org/10.5281/zenodo.21861347). It is subsequent unrefereed work, not a correction to this release, and it does not alter or strengthen this release's recorded claims or assurance state.

## Summary for specialists

Let $A$ and $B$ have degrees $r$ and $s$. Write $M$ for the $(r+s+1)\times(r+s+2)$ coefficient Jacobian of $(A,B)\mapsto AB$, and put

$$
\kappa=(a_0,\ldots,a_r,-b_0,\ldots,-b_s),
$$

the infinitesimal relative-scaling direction $(A,B)\mapsto(\lambda A,\lambda^{-1}B)$, which spans $\ker dm$ on the coprime locus. For every border row $v$, the central candidate identity (Theorem 1.1, bordered Jacobian identity) is

$$
\det\!\begin{pmatrix}M\\v\end{pmatrix}
=(-1)^{s(r+1)+1}\operatorname{Res}(A,B)\langle v,\kappa\rangle .
$$

It is stated as an identity in $\mathbb{Z}[a,b,v]$ for all $r,s\geq1$, including $r=s$. Equivalently, every signed maximal minor of $M$ is one coordinate of $\kappa$ multiplied by the resultant and an explicit global sign, $(-1)^{r(s+1)}\operatorname{Res}\,\kappa_k$. In exterior-algebra language, the top exterior power of the multiplication differential is the resultant times contraction along the lost scaling direction.

**Contraction principle.** If $g$ is bihomogeneous of weight $(p,q)$, adjoining its derivative gives

$$
\det D(m,g)=(-1)^{s(r+1)+1}(p-q)g\operatorname{Res}(A,B).
$$

**Consequences stated in the manuscript.**

| Consequence | Statement |
|---|---|
| Integral degree-difference identity | Taking $g=\operatorname{Res}$ recovers $\det D\Phi_{r,s}=(-1)^{s(r+1)}(r-s)\operatorname{Res}(A,B)^2$ for $\Phi_{r,s}(A,B)=(AB,\operatorname{Res}(A,B))$, now over $\mathbb{Z}$ |
| Characteristic $p$ | $\Phi_{r,s}$ is étale on the coprime locus over a field of characteristic $p$ iff $p\nmid s-r$ (étale over $\mathbb{Z}[1/(s-r)]$) |
| Pullback obstruction | $g=h\circ m$ gives determinant zero: no function of the product can complete the chart |
| Equal degrees localised | At $r=s$ the bordered identity does not degenerate; only the Euler weight $s-r$ vanishes |
| Classification of normalisers | For $r\ne s$ in characteristic zero, $(m,g)$ is étale on the whole coprime locus iff $\delta g=c\operatorname{Res}^n$ for the scaling derivation $\delta$, some constant $c\ne0$ and $n\ge1$; in characteristic $p$ the same holds when $p\nmid n(s-r)$ |

## Technical account

**Why the formula matters.** The formula turns a family of large determinants into one geometric pairing. This makes the factor $r-s$ in the degree-difference identity conceptually visible: it is the scaling weight seen when the derivative of the resultant is paired with $\kappa$. The same principle identifies precisely when the map is étale on the coprime locus in characteristic $p$, shows that a scalar depending only on the product cannot complete the missing direction, and explains the equal-degree case. At $r=s$, the bordered identity itself remains nonzero in general—only the Euler weight used for the resultant vanishes.

**Proof idea.** By multilinearity in the border row, the bordered identity is equivalent to the signed maximal-minor identity, one column at a time. Both sides are integer polynomials, so it suffices to check them on the dense open set where the roots of $A$ and $B$ are all distinct. There the manuscript changes basis on the target by evaluating at the roots of $A$, the roots of $B$ and one auxiliary point $\tau$. In that basis the matrix is almost block-diagonal; splitting the auxiliary row and counting rows against columns kills all but one term. The surviving term is evaluated with a gap-Vandermonde lemma and the product formula for the resultant, and every $\tau$-dependent factor cancels. The proof uses no irreducibility or unique-factorisation input, computes every sign, and although it argues over $\mathbb{C}$ it delivers an integral identity valid after arbitrary base change.

**What changes relative to the July proof.** The July 2026 release proved the degree-difference identity through the irreducibility of the resultant hypersurface plus a weight argument, and a hand count of permutation inversions at a base point. Its machine ledger checked the base-point sign matrix and cubic-specific algebra, but not the determinant identity itself; this release's suite closes that gap and supersedes that ledger.

**What is classical, and what is offered here.** The resultant as the determinant of a suitable Koszul-complex strand is classical. The candidate expressly does **not** claim that principle as new. Its bounded contribution claim concerns the explicit bordered coordinate identity, both sign laws, uniform treatment of equal degrees, and the derivation of the degree-difference and characteristic consequences from one contraction formula.

The recorded audit inspected four central classical sources at full text: Chardin and three papers of Jouanolou. It identified several genuine antecedents—divisibility of maximal minors by the resultant, bordered determinant calculations and gradient identities—but did not locate the exact candidate formula in that bounded corpus. Non-location is not proof of novelty or priority.

## Evidence, assurance and limitations

**Verification.** The executable suite uses exact arithmetic only. One path uses SymPy symbolic Berkowitz determinants. A separately written path uses FLINT integer-polynomial arithmetic and fraction-free Bareiss elimination. They agree coefficient by coefficient in the shared small-degree range.

The deep tier reports 93 passing checks. It covers the full determinant identity through $r+s\leq8$ with spot checks at $(4,5)$, $(5,5)$ and $(5,6)$; the maximal-minor identity, including equal degrees, through $r+s\leq7$; symbolic-root product formulas; a gap-Vandermonde lemma; base-point signs through $r,s\leq40$; characteristic-$p$ examples; contraction cases; and five negative controls.

The publication workflow reran the suite in a fresh pinned environment. The default tier passed 58 checks normally and under `python -O`; the deep tier passed 93. The negative controls detected a perturbed Jacobian, wrong sign, wrong resultant power, flipped kernel vector and transposed-bidegree confusion.

These checks are finite and producer-side. The two backends share a specification and workflow. Their agreement reduces implementation risk but is not independent reproduction, and finite bidegrees cannot prove an all-degree quantifier.

**Formalisation boundary.** Mathlib already contains machine-checked resultant constructions and a universal monic factorisation ring whose Jacobian is the Sylvester matrix and which is étale on the coprime locus. Those are related ingredients, not a formal proof of this release.

The manuscript lists the remaining bridge: formalise the rectangular multiplication differential and its kernel, prove the signed maximal-minor identity, and derive the Euler contraction with the exact coefficient order. Until those steps are completed, the release's formal-verification status is partial rather than passed.

**Review.** Two reviews are on record—a cross-model adversarial review and an external developmental review—and both were actioned; the response is in the package.

**What the result does not establish.**

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

## Why the problem matters

This is a foundations release. The July 2026 release *The degree-difference principle and affine slices of binary-form factorisation spaces* ([doi:10.5281/zenodo.21647593](https://doi.org/10.5281/zenodo.21647593)) organised its geometry around one determinant identity whose original proof ran through two fragile steps and whose machine ledger did not check the identity itself. Replacing that foundation with a single integral identity about multiplication alone means later work on étaleness, normalisers and equal-degree degeneration can rest on one elementary statement with every sign computed, instead of on case-specific arguments.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python and the pinned `sympy` and `python-flint` packages:

```sh
python3 -m venv v && v/bin/pip install -r requirements.txt
v/bin/python verify_bordered_jacobian.py          # default tier, ~3 s, 58 checks
v/bin/python verify_bordered_jacobian.py --deep   # deep tier, ~7 min, 93 checks
```

The `Makefile` also provides `make verify`, `make deep` and `make receipt`. Compare the output with `verification_receipt_default.txt` and `verification_receipt_deep.txt`, and check file integrity against `SHA256SUMS`. Start reading with Theorem 1.1 and Section 3 of the manuscript (the proof); `CLAIMS.md` maps each claim to its evidence, and Section 6 maps each statement to its formalised Mathlib analogue and lists the missing lemmas.

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
