## Summary

This page explains, in order: the geometric question the paper answers, why it is connected to the Jacobian conjecture, what was proved, what is only conditional, and how the claims have and have not been checked.

**The question.** When does a naturally defined geometric object break into pieces? The paper answers that question exactly for a family of hypersurfaces that arise when you track where two polynomials share a root. Mathematicians call such a hypersurface *reducible* when it splits into two or more separate components.

**What was found.** The answer has a classical elegance. The hypersurfaces in the family are indexed by linear functionals, and the paper shows that a divisor in the family is reducible — breaks into components — precisely when its functional lies on a specific ruled surface: the tangent developable of the rational normal curve, the sweep of all tangent lines to the most fundamental curve in projective geometry. On that surface, the divisor splits into two or three identifiable pieces; off it, the divisor stays whole.

**Why it connects to the Jacobian conjecture.** The Jacobian conjecture, one of algebra's oldest open questions, concerns polynomial maps whose Jacobian determinant is a nonzero constant (sometimes called Keller maps). The second half of the manuscript is a process of elimination: it asks which "stages" built from factorising binary forms could be ordinary affine space and so host such a map. It shows that a large family of candidate stages are never ordinary affine space — each is blocked by a precisely computed defect — and, assuming a result from a companion release, isolates exactly one slice as the only stage in the paper's positive two-factor binary-form architecture that can host the kind of polynomial map the conjecture is about. Everything else *inside that architecture* is screened out.

**How this relates to the 2026 counterexample announcements.** In July 2026 several counterexample constructions were announced externally. The specific resultant–factor construction discussed in this release is understood to use the surviving slice, but the release does not prove that coordinate identification. Its theorem says something narrower and architecture-relative: among the untrimmed positive-degree binary-form spaces, product–resultant map and normalized linear two-factor slices defined in the paper, the surviving slice is the only affine-space case. Later weighted-lift and tangent-sweep families described by Gallagher and Gao are not classified by this theorem, so no obstruction to those families is claimed.

**Status.** An unrefereed candidate mathematical manuscript (version 1.0.1, 28 July 2026), written by AI models under human research direction. The proofs are ordinary written proofs, backed by deterministic exact audits of selected consequences and a model-led cross-audit. There has been no independent expert human review, peer review, proof-assistant formalisation or literature-wide novelty determination.

## Summary for specialists

For consecutive degrees $(m, m+1)$ with $m \geq 2$, the manuscript classifies reducibility in the marked-common-root incidence system: $D_\ell = \{\ell(P^2 A'B') = 0\}$ is reducible precisely when $[\ell]$ lies on the tangent developable of the rational normal curve of evaluation functionals (Theorem 1.1). Rank-one functionals give three reduced components, first-jet functionals two; genuine two-point secants and higher catalecticant ranks give irreducible divisors.

For the associated slices $X_\ell^{r,s}=\{(A,B)\in V_r\times V_s:\operatorname{Res}(A,B)=1,\ \ell(AB)=1\}$, the results are: $X_\ell^{m,m+1} \not\cong \mathbb{A}^{2m+1}$ for all $m \geq 2$ and nonzero $\ell$, with precise defects — Grothendieck class $\mathbb{L}^{2m+1} - \mathbb{L}^{2m}$ in the rank-one case, diagnostic Hodge coefficients $-2$ and $-1$ for rank-two secants and first-jets (Theorem 1.2). Non-adjacent degrees ($\lvert r-s\rvert \geq 2$) yield non-contractible slices via finite cyclic actions (Proposition 2.1). Conditionally on the upstream cubic classification from the foundational degree-difference release, the tangent nonosculating linear–quadratic slice is the *unique* positive-bidegree affine source permitting a nonzero constant Jacobian determinant within the paper's untrimmed, normalized two-factor binary-form architecture (Theorem 1.3).

| Result | Status |
|---|---|
| $D_\ell$ reducible iff $[\ell]\in\tau(\nu_{2m+1})$; three, two or one components by type (Theorem 1.1) | proof |
| $X_\ell^{m,m+1}\not\simeq\mathbb A^{2m+1}$ for every $m\ge2$ and nonzero $\ell$, with exact low-rank Hodge defects (Theorem 1.2) | proof |
| $X_\ell^{r,s}(\mathbb C)$ not contractible when $\lvert r-s\rvert\ge2$ (Proposition 2.1) | proof |
| Tangent nonosculating $(1,2)$ slice and its swapped form are the unique affine-space sources in the architecture carrying a nonzero constant Jacobian determinant (Theorem 1.3) | conditional on the pinned upstream cubic classification |

That surviving slice is affine three-space and has been interpreted as the source of the particular resultant–factor construction described by NASQRET, discussed by Speyer et al. and digested by Tao. The release does not establish the counterexample, and the counterexample does not depend on it. A rigorous proof of the proposed coordinate equivalence is not part of the release. Nor does the isolation theorem range over Gallagher's later weighted-lift families or Gao's tangent-sweep construction; those sources are now listed explicitly so that architectural uniqueness is not confused with global uniqueness among counterexamples.

Here "two-factor architecture" means exactly the untrimmed positive-degree binary-form spaces, product–resultant map and normalized linear slices defined in the paper. It does not classify trimmed, nonlinear, quotient, multifactor, degree-zero or positive-characteristic variants.

## Technical account

The proofs are conventional algebraic geometry throughout — this is the trilogy's least computational instalment — with deterministic SymPy audits of selected consequences rather than a certificate architecture.

**Reducibility classification.** The classification theorem works in the linear system $\{\ell(P^2 A'B') = 0\}$ on the space of marked factorisations of binary forms of consecutive degrees: the functionals $\ell$ are stratified by catalecticant rank, the rational normal curve of evaluation functionals and its tangent developable are identified inside the dual space, and reducibility of $D_\ell$ is shown to occur exactly on that developable, with component counts (three for rank-one, two for first-jet, one otherwise) read off from the stratification. Outside the secant variety, an elementary overlap lemma for two Hankel windows forces irreducibility.

**Non-isomorphism with affine space.** The non-isomorphism results compute exact classes in the Grothendieck ring — the rank-one defect is $\mathbb{L}^{2m+1} - \mathbb{L}^{2m}$ — and expand Hodge–Deligne polynomials whose coefficients at diagnostic positions ($-2$ for rank-two secants, $-1$ for first-jets) are incompatible with affine space. Non-adjacent degree pairs ($\lvert r-s\rvert \geq 2$) are handled separately: finite cyclic group actions on the slices obstruct contractibility, which is weaker than the motivic defect but suffices for non-isomorphism.

**Isolation.** The isolation theorem stacks these exclusions: given the upstream cubic classification (a result of the foundational degree-difference release, itself unverified), every positive-bidegree slice except the tangent nonosculating linear–quadratic one is eliminated as a source for maps with nonzero constant Jacobian determinant. When $r=s$, relative scaling gives positive-dimensional fibres, so that case cannot yield a Keller map. The surviving slice is the affine three-space the July 2026 resultant–factor counterexample is understood to inhabit, so the theorem reads as an isolation of that counterexample within the family rather than a search for a hypothetical one.

## Evidence, assurance and limitations

The release keeps four kinds of assurance separate, and none should be substituted for another.

- **Mathematical argument.** The paper's prose proofs are the primary evidence for the reducibility locus, the component counts, the Hodge–Deligne obstruction for every adjacent degree and the Euler-characteristic obstruction for non-adjacent degrees.
- **Exact computational audit.** `verify_paper.py` checks the coprime-locus class identity over a range of degrees, the diagnostic Hodge-coefficient bookkeeping, the first-jet determinant, seven exhaustive finite Hankel-overlap tests and complete point-count censuses for 8,653 projective functionals. `verify_rank_two.py` checks exact sign-normalised coefficient grids for $m=2,3$ and found zero counterexamples there. Both run normally and under `python -O` with fixed outputs; a deliberately false class identity must fail, and a positive $m=1,q=3$ ablation must attain the affine-space point count, so the census is not hard-wired to exclusion.
- **Model-led audit.** An archived adversarial audit of the preceding draft reported no fatal mathematical error and required major exposition revisions; the release's internal review disposition ("minor revision for candidate publication") is recorded in the repository. This is cross-model scrutiny, not independently reproducible external review.
- **Integrity and provenance.** A SHA-256 manifest binds every payload file and is checked before and after replay; a hash-bound 41-reply public comment snapshot supports the antecedent credits to Skooi, Mondal and others.

**Limitations.**

- The final isolation claim is conditional on the complete cubic classification in the unrefereed candidate `ipitchford/degree-difference-affine-slices` (fixed commit `38bb6c2054fd1e231233ee9c1bbd8ebf7b666685`). A separate cancellation corollary depends on the unrefereed `exotic-affine-spheres-quadratic-cubic` candidate and is not used in the isolation proof. The release does not convert either upstream candidate into a peer-reviewed or formally verified theorem.
- The code checks encoded symbolic identities, exhaustive small finite-field implications, point-count censuses and bounded rational rank-two predictions. It does not formalise the finite incidence morphism, the complex irreducibility argument, mixed Hodge theory or the cited secant-variety theorem. Nothing about the complex theorem should be inferred from the finite-field censuses alone.
- Not established: independent expert human review or journal peer review; proof-assistant formalisation; a literature-wide novelty or priority determination; bit-for-bit PDF reproducibility across TeX distributions; a positive-characteristic analogue of the classification.
- The connection to the 2026 resultant–factor construction is an interpretation, not a proved coordinate equivalence, and the theorem does not range over the Gallagher or Gao families.

## Who should care, and why

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Classical projective geometers | The reducibility locus is exactly the tangent developable of the rational normal curve — a nineteenth-century object reappearing as the answer to a naturally posed modern question. | Verify the classification with classical tools (catalecticants, secant varieties); check whether fragments already exist in the apolarity literature. |
| Affine and motivic geometers | Uniform non-isomorphism with affine space across a whole family, with exact defect classes ($\mathbb{L}^{2m+1} - \mathbb{L}^{2m}$) and diagnostic Hodge coefficients (−2, −1). | Re-derive the defect computations; test the cyclic-action obstruction for non-adjacent degrees against other contractibility criteria. |
| Jacobian conjecture researchers | A conditional isolation theorem: within the defined two-factor slice family, exactly one slice can carry nonzero-constant-Jacobian behaviour. | Test the proposed coordinate link to the resultant–factor construction; compare, without presuming equivalence, the distinct Gallagher and Gao families; scrutinise the conditional hypothesis inherited from the companion release. |
| Representation theorists and apolarity specialists | Component counts (three, two, one) stratified exactly by catalecticant rank and jet type. | Explain the stratification conceptually; connect it to known secant-variety and apolarity stratifications. |

The natural specialist readers are projective and affine algebraic geometers working on secant varieties, catalecticants, and the geometry of rational normal curves; motivic-obstruction specialists; and Jacobian-conjecture researchers following structured screening programmes. This identifies intellectual proximity, not a prediction of endorsement. The strongest pitch to them is:

> A natural incidence family turns reducible exactly on the tangent developable of the rational normal curve — and the same analysis conditionally isolates the unique affine-space stage for constant-Jacobian behaviour inside one precisely defined two-factor binary-form architecture.

## Why the problem matters

Across this trilogy of releases, the strategy is consistent: rather than attacking the Jacobian conjecture head-on, map the geography of factorisation-space slices and eliminate, with exact obstructions, every stage inside the declared binary-form architecture where a Keller map cannot live. This release performs that bounded elimination step. What remains is one specific slice; its proposed relation to the particular resultant–factor construction is an open coordinate-comparison problem.

The programme's strongest defensible contribution is structural rather than global: it classifies and conditionally isolates what can happen inside one natural factorisation-space mechanism. It does not say that all counterexample mechanisms reduce to that architecture, and the later Gallagher and Gao families make that boundary especially important. Whether the particular resultant–factor construction is the surviving slice remains an explicit coordinate-comparison problem; whether the theorem is novel remains unverified against the literature. Independently of the Jacobian conjecture, the reducibility classification is a self-contained statement in classical projective geometry.

## How to inspect or reproduce the recorded checks

Start with the paper (Theorems 1.1–1.3), then `AI_INDEX.md`, which maps each claim to its primary evidence, its computational support and its boundary; `STATUS.md` and `ASSURANCE.md` state the assurance boundary. The recorded replay used Python 3.14.4, SymPy 1.14.0 and NumPy 2.3.5 on macOS arm64 (a Python 3.13.5/Linux run is also recorded). From the GitHub repository or the Zenodo archive:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements-release.txt
make PYTHON=.venv/bin/python \
  CFFCONVERT=.venv/bin/cffconvert release-replay
```

The `release-replay` target checks the manifested inventory before and after execution, runs both verifiers normally and under `python -O`, regenerates the ledgers under `build/` and compares them byte for byte with the release copies, requires the negative control to fail and the $m=1$ ablation to pass, and validates the citation snapshot. The recorded conclusion and full terminal record are in `REPLAY_RECEIPT.md` and `replay_output.txt`. `make pdf` rebuilds the PDF; byte-for-byte identity across TeX distributions is not claimed.

## The most valuable next projects

The surviving slice is no longer an open target to be filled or emptied: a counterexample to the Jacobian conjecture was announced externally in July 2026, and it is understood to live exactly there. The sharpest work is now to pin down and independently check the structure around it.

### 1. Test the proposed resultant–factor equivalence

The connection between the tangent nonosculating linear–quadratic slice and the 2026 resultant–factor construction is an interpretation, not yet a proof, and is not a premise of the isolation theorem itself. Establishing or refuting the proposed coordinate equivalence would determine whether the theorem explains that particular construction. The comparison must keep Gallagher's weighted-lift and Gao's tangent-sweep families separate unless an explicit map between architectures is supplied.

### 2. Independently verify the classification

The central theorem lives in well-mapped territory: rational normal curves, their tangent developables, catalecticant stratifications. A specialist can likely confirm, refute, or antedate the tangent-developable classification with classical methods in days. Any of the three outcomes is decisive for the release.

### 3. Discharge the conditional hypothesis

The isolation theorem is conditional on the cubic classification from the foundational degree-difference release, which is itself unrefereed. Verifying that upstream classification (or reproving the isolation theorem without it) would convert a conditional statement into an unconditional structural result.

### 4. Establish novelty against the classical literature

Fragments of the reducibility classification may already exist in the nineteenth- and twentieth-century work on binary forms, apolarity, catalecticants, secant varieties, and tangent developables. A literature-wide priority determination — absent from the release by its own account — is needed before any part of the classification can be called new.

## What is in the evidence package

The deposit contains the manuscript (PDF and TeX), deterministic audit scripts (`verify_paper.py`, `verify_rank_two.py`) with their fixed transcripts and regenerated ledgers, the archived audit of the prior draft and the low-catalecticant proof supplement, a claim-to-evidence map (`AI_INDEX.md`/`.json`), assurance-boundary documents (`STATUS.md`, `ASSURANCE.md`), provenance and source-credit records (`PROVENANCE.md`, `SOURCES.md`) with the hash-bound comment snapshot and citation checker, replay receipts, SHA-256 manifests, and immutable source snapshots, archived on Zenodo as v1.0-candidate with a v1.0.1 revision (same-day metadata and attribution fixes). Version 1.0.1 strengthens antecedent credit and citation robustness without changing a theorem statement or proof conclusion.
