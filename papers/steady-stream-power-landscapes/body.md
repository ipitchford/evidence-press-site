## Summary

Rain follows the shape of a landscape, but the resulting water flow also changes that shape through erosion. A steady model must therefore solve for elevation and drainage together. This candidate gives a constructive answer near the diffusion-dominated state, including a local uniqueness result on genuinely nonradial domains.

The main paper also develops a radial theory for all positive parameters. The separate [companion note](https://github.com/ipitchford/steady-stream-power-landscapes/releases/download/v1.3.0-candidate/companion.pdf) supplies exact wet–dry benchmarks and examines a constrained channel equation. These are distinct mathematical models, with distinct conclusions.

## Summary for specialists

For the steady stream-power system

$$-D\Delta z+Ka^m|\nabla z|^n=U,\qquad \operatorname{div}q=\rho,$$

write $a=b|\nabla z|$ and $q=-b\nabla z$. Positive Hölder rainfall and uplift admit small-$K$ steady states on bounded smooth domains with zero elevation on the entire boundary, for all $m,n>0$.

With constant $D,U,\rho>0$, $m+n\geq1$, and a strict growth margin $\operatorname{Lip}(\nabla z_0)<U/D$ for the torsion landscape, the nearby branch is unique within the specified elevation ball and bounded continuous nonnegative multiplier class. This is stronger than existence but has additional hypotheses. Every ellipsoid in dimension at least two meets the geometric margin; the theorem does not provide a uniform threshold over aspect ratios.

On balls, the paper gives radial steady states for all positive parameters and monotone radial evolution with exponential contraction when $n\geq1$. The summit threshold is $m/n=1$; the total-volume threshold in dimension $d$ is $m/n=d+1$. The companion's compatibility obstruction is conditional on its stated regular evolution class.

## Technical account

The substitution removes division by a vanishing slope. For prescribed elevation, its characteristic reconstruction is classical: Richter's 1981 work already covers the underlying positive-source sufficiency principle. The candidate contribution lies in the nonlinear coupling and its quantitative consequences.

The local construction replaces elevation-dependent damping with the constant $U/D$. It solves a nonlinear multiplier fixed point along uphill trajectories, then a Dirichlet Poisson problem for the elevation. Multiplier regularity controls the change in trajectories; the outer map contracts in the $C^1$ norm. A residual corollary and an inexact-iteration corollary distinguish the exact construction from a finite implementation.

For the ellipse $x^2/4+y^2<1$, the normalized torsion margin is exactly $1/5$. Saved polynomial approximations have exact-rational global residual and positivity bounds. The calculations do not instantiate the domain-dependent constants or prove that the illustrated $K=0.2$ lies within the contraction interval.

## Evidence, assurance and limitations

The evidence consists of written proofs, exact symbolic identities, radial and channel quadratures, nonradial refinement tests, exact-rational polynomial bounds and corrupted-input controls. The release records normal and optimized replay with pinned dependencies. The supplied audit also reported a cross-version replay; its provenance does not establish authenticated unaffiliated reproduction.

The audit's bounded revisions were addressed in a [comment-by-comment response](https://github.com/ipitchford/steady-stream-power-landscapes/blob/v1.3.0-candidate/REVIEW_RESPONSE.md). AI-assisted review is not human specialist acceptance. REF assessments in the supplied review are prospective opinions, not official ratings, and are not publication badges.

No result here establishes arbitrary-erosion nonradial existence, general nonradial dynamics, empirical terrain prediction, or general wet–dry well-posedness. The channel obstruction does not exclude weak initial layers or settle the strictly positive infinite-support conjecture.

## Relationship to earlier work

Richter supplies the coefficient-reconstruction ancestry. Anand and colleagues already analyze one-dimensional landscape profiles and vanishing diffusion. Litwin and colleagues supply related all-exponent scaling and physical-model distinctions. The manuscripts state these overlaps rather than presenting the underlying characteristic method or dimensional balances as new.

The Binard–Degond–Noble three-field system and the Díaz channel formulation are separate objects. The companion's exact examples and corrections do not transfer into a general theorem for either system.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Nonlinear PDE researchers | Examine a transport–Poisson contraction that avoids a derivative-loss difficulty | Uniqueness is local and confined to the stated multiplier class |
| Landscape-model developers | Use exact response formulas and conservative polynomial residual bounds as benchmarks | Numerical residuals are not error enclosures or field validation |
| Free-boundary researchers | Test constraint preservation against a concrete derivative identity | Initial-time assumptions are stronger than positive-time regularity |

## Why the problem matters

A model that treats drainage as a function of terrain still needs to explain whether the two can be solved consistently. Existence answers whether a steady state is available; uniqueness asks whether nearby alternatives remain possible; a constructive proof identifies the mechanism behind that answer. Keeping these questions separate makes both numerical interpretation and mathematical extension more reliable.

## How to inspect or reproduce the recorded checks

Start with the manuscript's regime table and the archive's `AI_INDEX.md` and `ASSURANCE.md`. Verify `MANIFEST.sha256` before replay, install the pinned dependencies in an isolated environment, then run `python code/run_checks.py` and `python -O code/run_checks.py`. The runner uses disposable copies and checks corrupted inputs as well as accepted examples.

`code/verify_global_bounds.py` treats saved decimal coefficients as exact rational numbers. Its whole-square coefficient bounds also hold on the contained ellipse. This finite polynomial statement is separate from the analytical existence and uniqueness proofs.

## The most valuable next projects

A useful next step is to instantiate the Poisson constants, invariant radius and numerical errors for one nonradial domain, producing a certified admissible parameter interval. Broader forcing, continuation outside the perturbative neighborhood, or a nonradial stability theorem would address substantive limitations. The companion needs a precise weak formulation and an existence or robust nonexistence result beyond its conditional class.

## What is in the evidence package

The [versioned archive](https://github.com/ipitchford/steady-stream-power-landscapes/releases/tag/v1.3.0-candidate) contains both PDFs and editable sources, accessible Markdown, a claim ledger, sources and attribution audit, review response, replay scripts, frozen ellipse coefficients, test results, provenance and licences. The [Zenodo record](https://zenodo.org/records/23178664) preserves the same release assets. Original prose and data are CC0-1.0; original code is MIT. Cited third-party papers are linked rather than redistributed.
