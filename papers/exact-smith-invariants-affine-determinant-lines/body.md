## Summary

This page explains, in order: what information is lost when a polynomial is written as a product of factors, how this candidate measures that loss exactly, what is classical and what is offered as new, and what has and has not been checked.

**The problem.** When a polynomial is presented as a product, multiplying the factors together loses information. The most obvious loss is scale: multiply one factor by a number and compensate by dividing another factor by the same number, and the product stays fixed.

The [parent paper](https://evidencepress.org/releases/bordered-jacobian-foundations/) treated two factors. There is then one lost scaling direction, and a single degree difference measures whether one extra normalising coordinate restores it. This child candidate studies any number of factors. The one degree difference becomes an integer matrix of scaling weights, and its Smith normal form records the exact finite ambiguity that remains.

![Visual abstract: factor multiplication loses relative scaling directions; pairwise resultants and a character matrix restore them, and the Smith invariants record the residual finite group.](/assets/figures/exact-smith-invariants-visual-abstract.png?v=501c6541)

**Why anyone should care.** The wider programme studies factorisation maps as a possible source of polynomial maps with nonzero constant Jacobian determinant (Keller maps), the objects of the Jacobian conjecture. Knowing exactly where such a map loses rank, and exactly which finite ambiguity is left after normalising, is the local bookkeeping any such construction needs. It is also a self-contained calculation in elimination theory and integer lattice arithmetic.

**What was found.** The candidate separates three layers:

1. **Differential geometry:** the product of all pairwise resultants records where multiplication loses more rank than scaling alone explains.
2. **Integer arithmetic:** the character matrix records how chosen resultant coordinates see the missing scaling torus.
3. **Global geometry:** after the torus has been normalised, labelled partitions of the product's roots account for the remaining generic covering degree.

The arithmetic layer carries the main new claim: the leftover finite ambiguity is always cyclic once common factors of the degrees are removed, and its size can be computed prime by prime from a one-line presentation.

> **Status:** anonymous, unrefereed candidate. Producer-side exact replay and public checksum readback pass. The universal theorems rest on the written proofs. No independent reproduction, proof-assistant formalization, external specialist review, editorial peer review, or absolute priority determination has occurred.

## Summary for specialists

For positive degrees $\mathbf d$, put $g=\gcd_i d_i$ and $\mathbf e=\mathbf d/g$. Pairwise resultants of labelled binary-form factors have characters $\chi_{ij}=[e_j\varepsilon_i+e_i\varepsilon_j]$ in $M=\mathbb Z^k/\mathbb Z\mathbf1$; let $h(\mathbf e)$ be the positive gcd of the maximal minors of the matrix with these rows.

| Result in the manuscript | Statement |
|---|---|
| Theorem 4.1 (affine Plücker lift) | Every maximal minor of $Dm_{\mathbf d}$ equals $\varepsilon_{\mathbf d}\Delta_{\mathbf d}\det K_I$, an identity over $\mathbb Z$ compatible with arbitrary base change |
| Corollaries 5.1–5.2 (multi-border contraction, character determinant) | Bordering by $k-1$ normalisers contracts this tensor with the vertical torus Jacobian; for semi-invariants it becomes $\pm\Delta_{\mathbf d}\det(W)\prod_a g_a$ |
| Theorem 7.1 (exact local Smith presentation) | For $k\ge3$ and each prime $p$, with $p\nmid e_a$, the cokernel localised at $p$ is $\mathbb Z_{(p)}$ modulo $\bigl(e_a-\sum_{i\ne a}e_i,\ 2e_ie_j:i<j,\ i,j\ne a\bigr)$ |
| Theorems 7.3–7.4 (closed global index, spanning trees) | A symmetric formula for $h(\mathbf e)$ computable with $O(k^2)$ integer gcd operations; spanning-tree minors already generate the full maximal-minor gcd |
| Corollary 7.5 (complete Smith form) | For $k\ge3$ the character matrix for the original degrees has Smith form $\operatorname{diag}(g,\ldots,g,gh(\mathbf e))$, with $k-2$ copies of $g$ |
| Theorem 8.1 (finite normalised factorisation cover) | For a square full-rank semi-invariant character matrix $W$ over an algebraically closed field, the normalised map is finite locally free over a dense open, of generic degree $\lvert\det W\rvert D!/\prod_i d_i!$ |

The square multiplication Jacobian, multifactor scalar resultant, signed incidence support, arithmetic-matroid multiplicity and labelled root-partition count are classical inputs. The candidate increment is the exact local/global calculation for the cross-weighted diagonal-quotient character list, its factorisation interpretation and the explicit integral affine Plücker lift.

## Technical account

### The central determinant-line statement

Let $A_i$ be binary forms of positive degrees $d_i$, let $D=\sum_i d_i$, and consider

$$
m_{\mathbf d}(A_1,\ldots,A_k)=\prod_{i=1}^k A_i.
$$

The source has $k-1$ more dimensions than the target. On the pairwise-coprime locus, those missing directions are precisely the relative scalings

$$
(\lambda_1,\ldots,\lambda_k),\qquad \prod_i\lambda_i=1.
$$

Write $K$ for a matrix of infinitesimal scaling directions and

$$
\Delta_{\mathbf d}=\prod_{i<j}\operatorname{Res}(A_i,A_j).
$$

The candidate's affine all-factor theorem says that every maximal minor of $Dm_{\mathbf d}$ is, up to one explicit orientation, $\Delta_{\mathbf d}$ times the complementary Pluecker coordinate of $K$. In exterior-algebra language, the entire top determinant line factors into

$$
\boxed{\text{pairwise collision divisor}}
\quad\times\quad
\boxed{\text{lost scaling determinant line}}.
$$

Adding $k-1$ normalising functions $g_1,\ldots,g_{k-1}$ and applying Cauchy--Binet gives

$$
\det D(m_{\mathbf d},g_1,\ldots,g_{k-1})
=\pm\Delta_{\mathbf d}\det(\delta_b g_a),
$$

where the $\delta_b$ generate the scaling torus. If the $g_a$ are semi-invariants with integer character matrix $W$, this becomes

$$
\det D(m_{\mathbf d},g_1,\ldots,g_{k-1})
=\pm\Delta_{\mathbf d}\det(W)\prod_a g_a.
$$

For two factors, $W$ is a $1\times1$ matrix. Its sole entry is the old degree difference. The parent theorem is therefore the rank-one case of the character-matrix formula.

### The arithmetic heart: exact Smith data

Each pairwise resultant is a regular unit on the pairwise-coprime open set. Its scaling character gives one column in a complete-edge integer matrix. The resulting lattice controls which combinations of resultants can fix the scaling torus and which finite diagonalizable group remains.

Put $g=\gcd(d_1,\ldots,d_k)$ and write $d_i=ge_i$ with primitive degree vector $e$. If $h(e)$ is the top determinantal divisor of the primitive complete-edge character matrix, the candidate proves the global Smith form

$$
\operatorname{SNF}=\operatorname{diag}(g,\ldots,g,gh(e)).
$$

The nontrivial assertion is that the primitive cokernel is cyclic. More strongly, for every prime $p$, choose an index $a$ for which $p\nmid e_a$. Over $\mathbb Z_{(p)}$, the cokernel has the one-generator presentation

$$
\mathbb Z_{(p)}\Big/
\left(e_a-\sum_{i\ne a}e_i,\ \{2e_i e_j:i<j,\ i,j\ne a\}\right).
$$

This determines the exact $p$-adic valuation of $h(e)$, not only which primes can occur. It also recovers the parity rule at $p=2$, gives the full bad-characteristic support, and identifies the residual group scheme by Cartier duality.

The same arithmetic can be computed from spanning-tree minors alone. That bridges the result to signed-incidence and arithmetic-matroid methods while keeping the cross-weighted quotient specific to this factorisation problem.

### Geometry of the normalized charts

On the squarefree locus, the projective factorisation space is a finite etale cover of coefficient space: a point amounts to partitioning the $D$ distinct roots into labelled blocks of sizes $d_1,\ldots,d_k$. Its degree is

$$
\nu=\frac{D!}{\prod_i d_i!}.
$$

A square character normalisation with matrix $W$ adds a torus isogeny. The candidate proves, after the required generic shrinking, a finite-locally-free degree

$$
|\det W|\,\nu.
$$

In positive characteristic, the Smith invariant factors of $W$ split this into separable and inseparable degrees. For the complete system of resultant units, the canonical residual group is the diagonalizable group dual to the lattice cokernel.

This does **not** automatically produce a Keller map on affine space. Constant Jacobian is only the local differential condition. A factorisation slice must additionally be an affine space and have the required global non-proper or multiple-fibre behaviour. That affine-slice recognition problem remains the central geometric bottleneck.

## What is classical, and what is offered here

The renewed antecedent audit materially narrowed the contribution boundary. Classical and prior results already include:

- square or monic polynomial-multiplication Jacobians equal to Sylvester resultants;
- monic multi-factor coprimality and corank criteria;
- determinant products arising from polynomial Chinese-remainder maps;
- signed-incidence and frame-matroid determinant support; and
- arithmetic-matroid multiplicities as gcds of basis determinants.

The candidate does not relabel those ingredients as new. Its bounded contribution claim concerns the explicit integral **non-monic affine complementary-minor tensor**, its multi-border and orientation package, and especially the exact **cross-weighted complete-edge Smith calculation**: primitive cyclicity, the local one-generator presentation, exact valuations, spanning-tree gcd equality, scaled Smith form, and the resultant-relative group-scheme interpretation. The normalized covering degree is presented as a synthesis of classical root partitions and torus-isogeny degree.

No bounded search can establish global priority. The package records the search boundary and names the closest exact and partial antecedents.

## Evidence, assurance and limitations

### Evidence and audit trail

The deterministic package contains a 35-page manuscript, generated TeX, 28 checked references, seven registered claims, a 96-artifact manifest, three inherited verification tiers, a new local-Smith tier, review records, and exact environment receipts.

The full replay reports:

- **129,352 positive checks** across determinant, graph, Smith, valuation, local-presentation, and geometry fixtures;
- **18 deliberate negative controls**, all detected;
- ordinary and optimized Python runs with matching canonical receipts;
- exact SymPy and FLINT backends for the determinant identities;
- exhaustive graph and Smith enumerations within declared bounds;
- adversarial out-of-bound fixtures and all-pivot local checks; and
- a deterministic 118-entry ZIP whose fresh extraction passed the manifest, claims, replay, receipt comparison, and manuscript build.

Finite checks cannot prove the universal theorems. Multiple implementations created inside one coordinated workflow are not unaffiliated reproductions. The proof, geometry, arithmetic-priority, citation, originality, and reproducibility reviews are producer-workflow records, not external peer review.

### What the result does not establish

- It does not classify arbitrary polynomial normalisers; the canonical statement is about regular units generated by pairwise resultants on the fixed coprime open set.
- It does not show that every character-lattice basis can be represented by polynomial monomials with nonnegative exponents.
- It does not prove global finite-flatness without the stated squarefree and generic-shrinking hypotheses.
- It does not identify affine-space slices or classify factorisation-derived Keller maps.
- It does not settle the two-dimensional Jacobian conjecture or the four-dimensional Hessian frontier.
- It does not supply independent reproduction, formal verification, external specialist review, journal submission, editorial peer review, or secured novelty priority.

## Relationship to the parent release

![Research lineage: the immutable two-factor bordered-Jacobian parent leads to the present all-factor determinant-line and exact Smith child; publication mechanics do not increase assurance.](/assets/figures/exact-smith-invariants-research-lineage.png)

The [original parent paper on Evidence Press](https://evidencepress.org/releases/bordered-jacobian-foundations/) and its immutable [Zenodo archive, doi:10.5281/zenodo.21855302](https://doi.org/10.5281/zenodo.21855302), remain unchanged. They establish the two-factor bordered identity and degree-difference contraction.

This child generalises the scaling kernel from one dimension to $k-1$, the scalar weight from one degree difference to an integer character matrix, and the rank-one residual arithmetic to a Smith-normal-form calculation. It is a separate publication with its own [GitHub prerelease](https://github.com/ipitchford/exact-smith-invariants-affine-determinant-lines/releases/tag/v0.1.0-candidate) and [Zenodo DOI](https://doi.org/10.5281/zenodo.21861347). It is not a correction to the parent and does not retrospectively change the parent's assurance state.

## Why the problem matters

The parent release showed, for two factors, that one degree difference measures whether a single normalising coordinate restores the lost scaling direction. With more factors, the lost directions form a torus of dimension $k-1$, and the question becomes arithmetic: which combinations of resultants can fix that torus, and what finite group is left over. This candidate answers that question exactly for the complete system of pairwise resultant units, rather than only identifying which primes can occur.

The answer matters mainly as a clean separation of layers. Local determinant control can make a normalised factorisation chart étale away from the collision divisor, but it does not make a slice an affine space or give the global fibre behaviour a Keller map needs. The manuscript's most credible programme-level target is a classification of factorisation-derived étale charts and the isolation, if true, of exceptional affine-space slices; a four-dimensional Hessian application remains a conditional long-range problem, not a consequence suggested by the present proof alone.

## Who should care, and why

| Audience | What may be useful | Highest-value next check |
|---|---|---|
| Elimination theorists | An explicit affine determinant-line lift of classical monic Jacobian-resultant identities. | Reconstruct the induction and orientation independently, and search determinant-complex literature for an equivalent tensor formula. |
| Arithmetic matroid and signed-graph researchers | A complete cross-weighted character list whose primitive cokernel is cyclic, with exact local valuations. | Recast the local presentation in arithmetic-matroid or matroid-over-$\mathbb Z$ language and test its functorial limits. |
| Algebraic geometers | A canonical unit-character residual group and a finite-locally-free normalized factorisation chart. | Audit the fpqc descent and distinguish branch-labelled, unlabelled, polynomial, and Laurent normalisations. |
| Jacobian and Keller-map researchers | A clean separation between local determinant control and the rare affine-slice problem. | Classify affine-space slices rather than treating etaleness alone as a Keller construction. |
| Formal methods researchers | Integral polynomial identities, finite graph classifications, local module elimination, and explicit base-change statements. | Formalize the determinant-line theorem and local Smith presentation with a recorded axiom footprint. |
| Reproducibility auditors | A deterministic archive, exact receipts, negative controls, fresh extraction, and public cross-channel hashes. | Rerun or reimplement the immutable package unaffiliated with the producer workflow and publish the receipt or objection. |

## How to inspect or reproduce the recorded checks

To inspect the argument, start with the manuscript's Theorem 4.1 and Section 7 (Theorems 7.1–7.4 and Corollary 7.5); Section 9 summarises the exact computational evidence and Section 10 states the contribution boundary and limitations.

Download the release ZIP and checksum ledger from [GitHub](https://github.com/ipitchford/exact-smith-invariants-affine-determinant-lines/releases/tag/v0.1.0-candidate) or [Zenodo](https://zenodo.org/records/21861347). After verifying `SHA256SUMS`, extract into a fresh directory and follow the archive's `README.md`. The recorded full entry point is:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 verification/run_all.py --root . --mode both
```

The package also exposes separate manifest, claim-registry, receipt-comparison, archive-build, and fresh-extraction interfaces. Use Python 3.13 with the recorded SymPy, python-flint, and jsonschema versions for same-environment replay. A successful rerun supports package integrity and implementation behaviour; it does not by itself independently prove the general theorems.

## The most valuable next projects

1. Complete an unaffiliated proof reconstruction and exact reimplementation.
2. Formalize the determinant-line and local Smith theorems.
3. Classify all regular-unit and polynomial normalisers.
4. Recognize or obstruct affine-space slices using affine geometry, not determinant calculus alone.
5. Test whether the known three-dimensional factorisation mechanism is unique within a carefully stated architecture.
6. Prove a construction or no-go theorem for the four-dimensional Hessian frontier only after the slice and symplectic constraints are made explicit.

## What is in the public package

- the 35-page manuscript, Markdown source, generated TeX, and bibliography;
- the deterministic release ZIP and complete SHA-256 ledger;
- exact SymPy, FLINT, graph, Smith, valuation, and geometry verification scripts;
- ordinary and optimized receipts plus deliberate negative controls;
- manifest, claims, status, assurance, provenance, environment, and licensing records;
- antecedent, citation, originality, proof, arithmetic, geometry, and reproducibility audits;
- a hardened fresh-extraction verifier and its external receipt;
- the visual abstract, lineage graphic, and plain-English audio summary with transcript.

Original non-code content is dedicated to the public domain under CC0 1.0; original code is MIT. Scholarly attribution is Anonymous. Operational maintenance and publication roles are recorded in the machine-readable provenance. The audio voice is AI-generated and is not mathematical evidence.
