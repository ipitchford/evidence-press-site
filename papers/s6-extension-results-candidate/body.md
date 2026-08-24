## Summary

This release explores what can be learned from a manuscript that claims to put a complex structure on the smooth six-sphere, $S^6$. It does **not** independently prove that the proposed complex threefold exists, is smooth, or has $S^6$ as its underlying smooth manifold.

The useful outcome is a map with four clearly marked kinds of statement:

- **A — exact arithmetic or symbolic:** finite identities replayed by the supplied programs;
- **P — proved under stated hypotheses:** written arguments that do not assume the whole $S^6$ construction;
- **C — conditional extension:** conclusions that depend on the source construction or its local calculations;
- **O — open:** work that remains to be done.

The headline conditional calculation is

$$
h^{1,1}(X)=2,\qquad h^{1,2}(X)=1,
$$

together with proposed tangent-cohomology dimensions $h^q(X,T_X)=(1,1,1,0)$ and a smooth one-dimensional local deformation space. The sharpest standalone target is different: a conductor–adjoint nonvanishing criterion that isolates one precise point of tension between the source manuscript and a corrected published argument about compact complex threefolds.

> **Candidate status:** Anonymous · unrefereed · exact arithmetic and symbolic replay passed · written theorem layer broader than computation · global source construction unverified · independent reconstruction, formal verification, external specialist review and editorial peer review not assessed.

## What the strongest-directions programme achieved

The original research map froze two layers of the proposed construction and varied a third. It gave three directions highest priority.

| Original goal | Outcome | Current gate |
|---|---|---|
| Complete the missing Hodge-number calculation | A logarithmic direct-image and residue argument gives $h^{1,2}=1$, hence $h^{1,1}=2$, under the source and local-model dependencies. | Conditional proof candidate |
| Decide whether twist and period parameters give inequivalent complex structures | The period constant $c_0$ is proposed to parametrize a smooth one-dimensional Kuranishi germ locally. Global equivalence of $c_0$ values and of the $p=\pm1$ twist triples remains open. | Partial conditional result; global problem open |
| Study adapted balanced, strongly Gauduchon, pluriclosed/SKT or canonical Hermitian metrics | Not undertaken in the completed package. | Open |

The work also opened four productive side areas—twist arithmetic, rank-four triangle monodromy, cohomology at a nonnormal fibre, and exceptional algebraic fibres. These contain most of the source-independent exact computation.

## Precise claims for specialists

The source proposes a holomorphic map

$$
f:X\longrightarrow \mathbf P^1
$$

whose general fibre is a complex two-torus and which has three special fibres. One is a reduced nonnormal normal-crossing toric fibre; the other two are multiple fibres of multiplicities three and four with bielliptic reductions. Three integers $(\ell_0,\ell_1,\ell_2)$ control the gluing.

Assuming that construction and the stated local calculations, the extension notes derive

$$
h^{1,1}=2,\qquad h^{1,2}=1,
$$

from logarithmic direct-image splittings, elementary modifications, Kodaira–Spencer maps and residue ranks. The expected Hodge values in the source are used only as a consistency check: the extension argument takes the local splittings and maps as inputs and reaches $(2,1)$ at the end. That avoids circular use of the expected answer, but it does not remove the source and local-model dependencies.

A parallel calculation proposes

$$
h^q(X,T_X)=(1,1,1,0)
$$

and argues that varying the additive period constant $c_0$ supplies a nonzero Kodaira–Spencer class spanning $H^1(X,T_X)$. The resulting Kuranishi germ is claimed to be smooth and one-dimensional. This is local deformation theory. It does not classify when two different $c_0$ values—or two different twist triples—give globally equivalent complex manifolds.

## Technical mechanism: conductor–adjoint nonvanishing

Let $f:X\to C$ be a proper flat map from a smooth complex threefold to a smooth curve. Let $S=f^{-1}(c)$ be a reduced normal-crossing fibre with normalization $\nu:\widetilde S\to S$, and for a line bundle $L$ put

$$
A_L=L^{-1}|_S\otimes\omega_S.
$$

The standalone candidate theorem says that if

$$
H^0(\widetilde S,\nu^*A_L)\neq0,
$$

then multiplication by the fibre differential injects this space into

$$
H^0(S,\Omega_X^1|_S\otimes A_L).
$$

Duality and top-degree base change then force

$$
H^2(S,(T_X\otimes L)|_S)\neq0,
\qquad
(R^2f_*(T_X\otimes L))_c\neq0.
$$

The mechanism is local: for the normal-crossing equations $x$, $xy$ and $xyz$, the restricted fibre differential lies in the conductor ideal. The $xy$ and $xyz$ memberships are replayed exactly in Singular.

Why is this the first specialist target? Campana, Demailly and Peternell’s corrected treatment implies $c_3(X)\leq0$ in a remaining holomorphic algebraic-reduction case under $H^1(X;\mathbf Z)=H^2(X;\mathbf Z)=0$. The source manuscript claims a holomorphic algebraic reduction on $S^6$ with $c_3=2$. The source locates the proposed failure in a vanishing step involving $R^2f_*(T_X\otimes L)$ at the nonnormal fibre.

The conductor criterion makes that proposed mechanism finite enough to referee directly. A successful check would challenge one proof route under the stated hypotheses. It would not by itself establish the source construction or refute every route to the corrected conclusion.

## Exact twist arithmetic

Define

$$
p=12\ell_0-4\ell_1-3\ell_2,
$$

with $3\nmid\ell_1$ and $\ell_2$ odd. The attainable signed values of $p$ are exactly the integers coprime to $12$. For any such $p$, one can choose

$$
\ell_1\equiv-p\pmod3,\qquad \ell_2\equiv p\pmod4,
$$

and then $(p+4\ell_1+3\ell_2)/12$ is an integer choice of $\ell_0$. Every triple with fixed signed $p$ is obtained from one solution by adding

$$
u(1,0,4)+v(0,3,-4),\qquad u,v\in\mathbf Z.
$$

The relation matrix has Smith invariants $(1,|p|)$. These are exact integer statements independent of the geometric construction.

Conditional on the source topology theorems, the possible fundamental groups are $\mathbf Z/q$ for $\gcd(q,12)=1$, and the exact homotopy-sphere equations are $p=\pm1$. The associated groups $H_k(X;\mathbf Z)$ described in the source are **integral homology**, not the same cohomology groups; in particular, $H^1(X;\mathbf Z)$ is torsion-free.

The residue pair $(\ell_1\bmod3,\ell_2\bmod4)$ determines only $p\bmod12$. It does not force $|p|=1$ for a fixed full triple. This corrects an over-strong reading of a source remark.

## Triangle monodromy and period families

For integral rank-four representations of

$$
\Delta(p,q,\infty)=\langle x,y,z\mid x^p=y^q=xyz=1\rangle
$$

with a square-zero rank-two cusp logarithm, the cusp is classified up to integral conjugacy by a Smith pair $(d_1,d_2)$ with $d_1\mid d_2$. Rank-four finite local monodromy can have exact order only in

$$
\{1,2,3,4,5,6,8,10,12\}.
$$

After two scalar exclusions, the exact root certificate partitions 314 determinant-compatible ordered spectral pairs into 58 two-dimensional irreducible cases, 72 rigid irreducible cases and 184 irreducible-excluded cases.

For fixed rational spectra and cusp Smith form, the written classification is an arithmetic double-coset presentation with an equivalence decision and recursive enumeration. It is not a printed finite list of all integral matrices.

The notes also construct infinite scaled $(3,4,\infty)$ and unimodular $(12,12,\infty)$ integral families and solve their displayed period equations over the open base. In the nonsplit $(12,12,\infty)$ case, compactification remains an explicit unresolved obstruction. An integral monodromy triple is therefore not automatically a compact holomorphic family.

## Exceptional algebraic fibres

The source period equation for an integral two-form reduces to a five-tuple $(a,b,r,d,e)$. When $(d,e)\neq(0,0)$, the type-$(1,1)$ condition defines a graph in the free parameter $c_0$. When $d=e=0$, it becomes a torsion condition for a section on an associated elliptic surface.

Exact division-polynomial computation finds no smooth specialization of exact order two or three. The first smooth torsion specialization found has exact order four at

$$
t=\frac{32}{5}.
$$

The rank-two intersection-lattice discriminant is

$$
\Delta=24(ae-bd)-r^2.
$$

Its algebraic-dimension interpretation remains conditional on the source period and orientation conventions. There is no single fixed exceptional set until $c_0$ is chosen, because the graph branches move with that parameter.

## Extremal elliptic Jacobi lifts

Using the Miranda–Persson classification data, another note constructs Jacobi-type open-base complex-two-torus families from torsion sections on all sixteen extremal rational elliptic surfaces. The verifier checks fibre Euler totals, root ranks, Mordell–Weil orders, displayed Weierstrass models and sections, integral monodromy, invariant forms and cusp ranks.

The construction has rank-one semiabelic boundary behaviour at multiplicative cusps. A bounded-holomorphic-function argument obstructs twisting this particular construction globally into maximal rank-two cusp degenerations. That is a limitation of the proposed Jacobi route, not a classification of every possible compactification.

## What this release does not establish

- It does not independently construct a compact complex threefold, prove its smoothness, or identify its underlying smooth manifold with $S^6$.
- It does not turn the conditional Hodge and Kuranishi arguments into externally reviewed theorems.
- It does not make a successful finite replay a check of the sheaf-theoretic proofs or the complete source-to-formula bridge.
- It does not classify global equivalence among $c_0$ values or among the infinitely many $p=\pm1$ twist triples.
- It does not solve the originally proposed Hermitian-metric programme.
- It does not infer compactification or polarizability from an integral monodromy triple.
- It does not establish novelty, priority, journal acceptance, consensus or scientific impact.

## Who should care, and why

| Reader | Potential use | Principal caution |
|---|---|---|
| Complex geometers | Audit a concrete Hodge/deformation package and a sharply isolated conductor criterion. | The global construction and dense local-model inputs are unverified. |
| Hodge and deformation theorists | Reconstruct the direct-image splittings, residue ranks and $c_0$ Kodaira–Spencer class. | The numerical answer is conditional and should not be inferred from source expectations. |
| Researchers studying hypothetical complex structures on $S^6$ | Compare the package with known Hodge restrictions and the CDP obstruction literature. | The release does not settle existence of a complex structure on $S^6$. |
| Arithmetic and representation theorists | Inspect Smith-form cusp data, finite spectra, root strata and double-coset classification. | The compact geometric realization of an arithmetic orbit is a separate problem. |
| Computer-assisted mathematics researchers | Reuse the claim ledger, mutation controls, fresh-extraction gate and layout regression. | The checkers cover encoded finite and symbolic predicates, not every written proof. |
| General readers | See how useful conditional mathematics can be separated from a disputed headline construction. | Public availability and replay are evidence states, not peer-reviewed truth. |

## Why the result matters

The package changes the next question from “do we believe the whole 108-page source?” to several smaller questions with different evidence needs. Exact twist and spectral claims can be rerun. The conductor criterion can receive a focused referee report. The Hodge and deformation arguments can be reconstructed map by map. The source construction can be audited separately.

That decomposition is scientifically useful even if the global claim later fails: the standalone conductor mechanism, arithmetic monodromy framework and finite classifications can be evaluated on their own hypotheses. If the source construction survives specialist scrutiny, the conditional Hodge and local-moduli calculations become immediately consequential. Neither possibility justifies skipping the unresolved gates.

## Evidence, replay and assurance boundary

Start with the immutable [v0.1.0 candidate release](https://github.com/ipitchford/s6-extension-results-candidate/releases/tag/v0.1.0-candidate) or [DOI archive](https://doi.org/10.5281/zenodo.22085272), then verify `SHA256SUMS`.

From the extracted package root, run:

```bash
python3 verification/verify_release.py
python3 -O verification/verify_release.py
python3 verification/verify_release.py --negative-controls
```

Singular is required for the conductor-ideal checks. The release also supplies a fresh-extraction verifier, manifest binding, TeX preflight and an executable PDF-layout check that keeps every text block inside a conservative right margin.

This route reproduces the encoded arithmetic, matrix, root-system, conductor-ideal and division-polynomial predicates. An independent mathematical audit should reconstruct the conductor map, logarithmic direct images, residue sequence, deformation obstruction and source construction from definitions before consulting the implementations.

## The most valuable next projects

1. Referee the standalone conductor–adjoint theorem against the exact $R^2f_*(T_X\otimes L)$ step in the corrected CDP argument.
2. Independently audit the source’s infinite toric quotient, gluing, compactification, smoothness, topology and $S^6$ recognition.
3. Reconstruct every elementary modification, Kodaira–Spencer vanishing order, residue map and branch-normal calculation in the Hodge and deformation proofs.
4. Determine the global equivalence relation on $c_0$ and on the affine lattices of $p=\pm1$ twist triples.
5. Carry out the balanced, strongly Gauduchon, pluriclosed/SKT and canonical Hermitian-metric programme.
6. Compute Bott–Chern and Aeppli cohomology along the proposed $c_0$ curve.
7. Complete the nonsplit $(12,12,\infty)$ compactification problem and identify which arithmetic monodromy orbits admit compact holomorphic or polarizable families.
8. Conduct a broad object-level prior-art and priority audit before using first-discovery language.

## What is in the public package

The public repository contains the nine-page synthesis in PDF and accessible Markdown; seven mathematical extension notes; eleven deterministic verification programs; exact claim, result, source, citation, licence, provenance and assurance ledgers; ordinary and optimized replay; four semantic mutation controls; fresh-extraction and PDF-layout checks; five internal journal-like review reports; the Claude Fable 5 observation record and response matrix; and a publication confirmation receipt.

GitHub and Zenodo carry byte-identical copies of the source ZIP, synthesis PDF, publication confirmation and checksum ledger. The exact external source PDF is identified by SHA-256 but is linked rather than redistributed. Original prose is released under CC0 1.0 and original code under MIT. The Evidence Press art, Open Graph card, transcript, audio and thumbnail are communication aids, not additional mathematical evidence.
