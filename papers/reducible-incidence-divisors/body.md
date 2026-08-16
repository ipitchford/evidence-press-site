## Summary

When does a naturally defined geometric object break into pieces? This paper answers that question exactly, for a family of hypersurfaces that arise when you track where two polynomials share a root.

The answer has a classical elegance. The hypersurfaces in the family are indexed by linear functionals, and the paper shows that a divisor in the family is reducible — breaks into components — precisely when its functional lies on a specific ruled surface: the tangent developable of the rational normal curve, the sweep of all tangent lines to the most fundamental curve in projective geometry. On that surface, the divisor splits into two or three identifiable pieces; off it, the divisor stays whole.

The second half of the manuscript is a process of elimination aimed at one of algebra's oldest questions, the Jacobian conjecture. It shows that a large family of candidate geometric stages are never ordinary affine space — each is blocked by a precisely computed defect — and, assuming a result from a companion release, isolates exactly one slice as the only stage in the paper's positive two-factor binary-form architecture that can host the kind of polynomial map the conjecture is about. Everything else *inside that architecture* is screened out.

In July 2026 several counterexample constructions were announced externally. The specific resultant–factor construction discussed in this release is understood to use the surviving slice, but the release does not prove that coordinate identification. Its theorem says something narrower and architecture-relative: among the untrimmed positive-degree binary-form spaces, product–resultant map and normalized linear two-factor slices defined in the paper, the surviving slice is the only affine-space case. Later weighted-lift and tangent-sweep families described by Gallagher and Gao are not classified by this theorem, so no obstruction to those families is claimed.

## Summary for specialists

For consecutive degrees $(m, m+1)$ with $m \geq 2$, the manuscript classifies reducibility in the marked-common-root incidence system: $D_\ell = \{\ell(P^2 A'B') = 0\}$ is reducible precisely when $[\ell]$ lies on the tangent developable of the rational normal curve of evaluation functionals. Rank-one functionals give three reduced components, first-jet functionals two; genuine two-point secants and higher catalecticant ranks give irreducible divisors.

For the associated slices, the results are: $X_\ell^{m,m+1} \not\cong \mathbb{A}^{2m+1}$ for all $m \geq 2$ and nonzero $\ell$, with precise defects — Grothendieck class $\mathbb{L}^{2m+1} - \mathbb{L}^{2m}$ in the rank-one case, diagnostic Hodge coefficients $-2$ and $-1$ for rank-two secants and first-jets. Non-adjacent degrees ($|r-s| \geq 2$) yield non-contractible slices via finite cyclic actions. Conditionally on the upstream cubic classification from the companion exotic-spheres release, the tangent nonosculating linear–quadratic slice is the *unique* positive-bidegree affine source permitting a nonzero constant Jacobian determinant within the paper's untrimmed, normalized two-factor binary-form architecture.

That surviving slice is affine three-space and has been interpreted as the source of the particular resultant–factor construction described by NASQRET, discussed by Speyer et al. and digested by Tao. The release does not establish the counterexample, and the counterexample does not depend on it. A rigorous proof of the proposed coordinate equivalence is not part of the release. Nor does the isolation theorem range over Gallagher's later weighted-lift families or Gao's tangent-sweep construction; those sources are now listed explicitly so that architectural uniqueness is not confused with global uniqueness among counterexamples.

The proofs are conventional algebraic geometry — catalecticant stratification, rational normal curves, Hodge–Deligne polynomials, cyclic group actions — with deterministic SymPy audits of selected consequences rather than a certificate architecture. The conditional isolation theorem should be read with its hypothesis in full view: the upstream classification it leans on is itself an unrefereed candidate.

## Technical summary

The proofs are conventional algebraic geometry throughout — this is the trilogy's least computational instalment. The classification theorem works in the linear system $\{\ell(P^2 A'B') = 0\}$ on the space of marked factorisations of binary forms of consecutive degrees: the functionals $\ell$ are stratified by catalecticant rank, the rational normal curve of evaluation functionals and its tangent developable are identified inside the dual space, and reducibility of $D_\ell$ is shown to occur exactly on that developable, with component counts (three for rank-one, two for first-jet, one otherwise) read off from the stratification. The non-isomorphism results compute exact classes in the Grothendieck ring — the rank-one defect is $\mathbb{L}^{2m+1} - \mathbb{L}^{2m}$ — and expand Hodge–Deligne polynomials whose coefficients at diagnostic positions ($-2$ for rank-two secants, $-1$ for first-jets) are incompatible with affine space. Non-adjacent degree pairs ($|r-s| \geq 2$) are handled separately: finite cyclic group actions on the slices obstruct contractibility, which is weaker than the motivic defect but suffices for non-isomorphism.

The isolation theorem stacks these exclusions: given the upstream cubic classification (a result of the companion exotic-spheres release, itself unverified), every positive-bidegree slice except the tangent nonosculating linear–quadratic one is eliminated as a source for maps with nonzero constant Jacobian determinant. That surviving slice is the affine three-space the July 2026 resultant–factor counterexample is understood to inhabit, so the theorem reads as an isolation of that counterexample within the family rather than a search for a hypothetical one. Deterministic SymPy audits (`verify_paper.py`, `verify_rank_two.py`) check selected numerical consequences — component counts and defect coefficients in low degree — but the theorems themselves are prose proofs, and the release's internal review disposition ("minor revision for candidate publication") is recorded in the repository.

## Who should care, and why

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Classical projective geometers | The reducibility locus is exactly the tangent developable of the rational normal curve — a nineteenth-century object reappearing as the answer to a naturally posed modern question. | Verify the classification with classical tools (catalecticants, secant varieties); check whether fragments already exist in the apolarity literature. |
| Affine and motivic geometers | Uniform non-isomorphism with affine space across a whole family, with exact defect classes (L^{2m+1} − L^{2m}) and diagnostic Hodge coefficients (−2, −1). | Re-derive the defect computations; test the cyclic-action obstruction for non-adjacent degrees against other contractibility criteria. |
| Jacobian conjecture researchers | A conditional isolation theorem: within the defined two-factor slice family, exactly one slice can carry nonzero-constant-Jacobian behaviour. | Test the proposed coordinate link to the resultant–factor construction; compare, without presuming equivalence, the distinct Gallagher and Gao families; scrutinise the conditional hypothesis inherited from the companion release. |
| Representation theorists and apolarity specialists | Component counts (three, two, one) stratified exactly by catalecticant rank and jet type. | Explain the stratification conceptually; connect it to known secant-variety and apolarity stratifications. |

## The most valuable next projects

The surviving slice is no longer an open target to be filled or emptied: a counterexample to the Jacobian conjecture was announced externally in July 2026, and it is understood to live exactly there. The sharpest work is now to pin down and independently check the structure around it.

### 1. Test the proposed resultant–factor equivalence

The connection between the tangent nonosculating linear–quadratic slice and the 2026 resultant–factor construction is an interpretation, not yet a proof, and is not a premise of the isolation theorem itself. Establishing or refuting the proposed coordinate equivalence would determine whether the theorem explains that particular construction. The comparison must keep Gallagher's weighted-lift and Gao's tangent-sweep families separate unless an explicit map between architectures is supplied.

### 2. Independently verify the classification

The central theorem lives in well-mapped territory: rational normal curves, their tangent developables, catalecticant stratifications. A specialist can likely confirm, refute, or antedate the tangent-developable classification with classical methods in days. Any of the three outcomes is decisive for the release.

### 3. Discharge the conditional hypothesis

The isolation theorem is conditional on the cubic classification from the companion exotic-spheres release, which is itself unrefereed. Verifying that upstream classification (or reproving the isolation theorem without it) would convert a conditional statement into an unconditional structural result.

### 4. Establish novelty against the classical literature

Fragments of the reducibility classification may already exist in the nineteenth- and twentieth-century work on binary forms, apolarity, catalecticants, secant varieties, and tangent developables. A literature-wide priority determination — absent from the release by its own account — is needed before any part of the classification can be called new.

## Specialist audience candidates

The natural specialist readers are projective and affine algebraic geometers working on secant varieties, catalecticants, and the geometry of rational normal curves; motivic-obstruction specialists; and Jacobian-conjecture researchers following structured screening programmes. This identifies intellectual proximity, not a prediction of endorsement.

The strongest pitch to them is:

> A natural incidence family turns reducible exactly on the tangent developable of the rational normal curve — and the same analysis conditionally isolates the unique affine-space stage for constant-Jacobian behaviour inside one precisely defined two-factor binary-form architecture.

## The screening programme

Across this trilogy of releases, the strategy is consistent: rather than attacking the Jacobian conjecture head-on, map the geography of factorisation-space slices and eliminate, with exact obstructions, every stage inside the declared binary-form architecture where a Keller map cannot live. This release performs that bounded elimination step. What remains is one specific slice; its proposed relation to the particular resultant–factor construction is an open coordinate-comparison problem.

The programme's strongest defensible contribution is structural rather than global: it classifies and conditionally isolates what can happen inside one natural factorisation-space mechanism. It does not say that all counterexample mechanisms reduce to that architecture, and the later Gallagher and Gao families make that boundary especially important. Whether the particular resultant–factor construction is the surviving slice remains an explicit coordinate-comparison problem; whether the theorem is novel remains unverified against the literature.

## What is in the evidence package

The deposit contains the manuscript (PDF and TeX), deterministic audit scripts (`verify_paper.py`, `verify_rank_two.py`), a claim-to-evidence map (`AI_INDEX.md`/`.json`), assurance-boundary documents (`STATUS.md`, `ASSURANCE.md`), SHA-256 manifests, and immutable source snapshots, archived on Zenodo as v1.0-candidate with a v1.0.1 revision (same-day metadata and attribution fixes).
