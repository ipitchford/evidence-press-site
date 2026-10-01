## Summary

A distant star or galaxy can appear more than once because gravity bends its light along different paths. When the deflecting objects occupy several planes between source and observer, the paths interact: each bend changes where the ray meets the next layer. How many separate images can this produce?

This release gives a tighter mathematical ceiling for lenses made of positive point masses. With two masses in each of two planes, the new upper bound is **33 images**, improving the previous general bound of 41. A published construction already produces 25. The gap between **25 attained and 33 allowed** remains open: this work does not show that a lens can reach 33, or that 25 is the maximum.

The central idea is to keep every intermediate ray position in the equations. Doing so preserves the fact that each equation connects only neighbouring planes. A general algebraic bound then becomes a small counting problem along a path. The release supplies the complete prose proof, exact finite checks of that count, and an exact certificate reproducing at least 25 images in the earlier example.

## Summary for specialists

Consider $K\ge1$ lens planes, with $g_i\ge1$ distinct point masses in plane $i$, positive masses and positive distance coefficients in the physical nearest-neighbour recurrence. There is no external shear or continuous matter. An image is counted only when its ray avoids every mass and the real Jacobian of the full first-plane-to-source map is invertible. The bound applies to these regular images even if other images of the same source are critical; for a regular source it bounds the entire image set.

Define

$$
U_0=1,\qquad V_0=0,
$$

$$
U_i=(1+g_i^2)U_{i-1}+2g_iV_{i-1},\qquad
V_i=g_iU_{i-1}+V_{i-1}.
$$

The manuscript proves $N\le U_K$. If $e_j$ is the elementary symmetric polynomial of degree $j$ in the mass counts, and $E,O$ are the sums of the even and odd coefficients of $\prod_i(1+g_iZ)$, then

$$
U_K\le \sum_{j=0}^{K}e_j^2 < E^2+O^2\qquad(K\ge2).
$$

The first inequality is strict for $K\ge3$. The right-hand expression is Perry’s earlier general upper bound. These are upper bounds on regular images; the algebraic envelope is not claimed attainable by a physical lens.

| Masses in successive planes | Known attained count | This upper bound | Perry’s general upper bound |
|---|---:|---:|---:|
| $2,2$ | 25 | 33 | 41 |
| $2,3$ | 50 | 62 | 74 |
| $3,3$ | 100 | 118 | 136 |
| $2,2,2$ | 125 | 213 | 365 |
| $2,2,2,2$ | 625 | 1377 | 3281 |

The attained counts come from [Keeton, Lundberg and Perry’s construction](https://arxiv.org/pdf/2302.11735v1). No new extremal configuration is claimed.

## Technical account

### Retain the geometry before counting roots

After absorbing positive deflection-distance factors into the masses, write the ray equations as

$$
z_2=z_1-\alpha_1(z_1),\qquad
z_{i+1}=(1+\varepsilon_i)z_i-\varepsilon_i z_{i-1}-\alpha_i(z_i),
$$

where $z_{K+1}$ is the fixed source and

$$
\alpha_i(z)=\sum_{\ell=1}^{g_i}\frac{m_{i\ell}}{\overline z-\overline{a_{i\ell}}}.
$$

Eliminating all intermediate positions immediately hides the local pattern of these equations. Instead, collect their linear terms in a tridiagonal matrix $A$, replace complex conjugates by independent variables $w_i$, and clear each plane’s denominators separately. Each resulting equation is linear in at most three neighbouring $z$ coordinates and has degree at most $g_i$ in its own $w_i$; the conjugate equations have the transposed pattern.

Every physical image determines a unique complete ray tuple. Sequential elimination in the real derivative reduces nonsingularity of the full system to regularity of the lens map. The invertible change from real coordinates to independent $z,w$ coordinates preserves nonsingularity, and unobstructed images have nonzero denominator factors. Thus every counted image gives a distinct simple polynomial root. The proof requires this injection; it does not equate all complex polynomial roots with physical images.

### Evaluate the sparse algebraic envelope

Bernstein’s classical root-counting theorem bounds isolated roots using the mixed volume of the polynomials’ Newton polytopes. Here a containing polytope for each equation is a neighbouring-coordinate simplex plus a segment of length $g_i$ in the conjugate coordinate. Coordinate translations preserve this support envelope. Any finite selection of regular roots can therefore be moved off all coordinate hyperplanes before the isolated-root theorem is applied. Other complex components, roots at poles, or critical physical images do not invalidate the count of those selected simple roots.

Expand the mixed volume by choosing either the simplex or the segment from each factor. The residual auxiliary problem is affine linear. It contributes one precisely when equal-size retained row and column sets admit a perfect matching using only equal or adjacent positions; otherwise it contributes zero. It counts **whether a matching exists**, not how many matchings exist. Generic coefficients are used to calculate this polytope invariant, not imposed on the physical lens.

For a path, a feasible matching can be uncrossed into sorted order. Scanning successive positions leaves only three possibilities: no unmatched index, one unmatched row, or one unmatched column. Any unmatched index must close at the next position. The row and column states have equal weights, so only $U_i$ and $V_i$ need be stored. Their transition weights give the displayed recurrence. Requiring the final state to have no unmatched index yields $U_K$, completing the bound. The [manuscript](https://github.com/ipitchford/multiplane-lensing-sparse-bound/releases/download/v0.2.0-candidate/paper.pdf) supplies the full arguments and transition table.

### What improves, and what does not

For a fixed mass count $g$ in every plane, the dominant growth factor as the number of planes increases is

$$
\lambda_+(g)=\frac{g^2+2+g\sqrt{g^2+8}}{2}<(g+1)^2.
$$

For binary planes, this is approximately 6.464 instead of 9 in Perry’s expression. With one mass in each plane the recurrence gives $2\,3^{K-1}$; compared with Petters’s earlier $2^{2K-1}-2$ bound, the values are 6 versus 6, 18 versus 30, and 54 versus 126 for two, three and four planes. These numerical comparisons use the common noncaustic-source scope, where every image is regular. The six-image two-plane case was already known.

A different limit gives a different lesson. If the number of planes stays fixed while all mass counts grow together, the bounds retain the same leading product of squared mass counts. Their ratio tends to one. The new result improves growth in the number of planes while leaving the dependence on each mass count quadratic; it does not establish the conjectured product of linear single-plane bounds.

## Evidence, assurance and limitations

The universal result rests on the written proof and its classical algebraic dependencies. The executable checks cover finite identities and a particular known lens; they do not replace that proof.

The producer’s exact checks examine **17,577 equal-size subset pairs**, **340 weighted grid cases** and **80 seeded cases**. Normal and optimised Python runs and deliberately corrupted controls passed their intended acceptance or rejection tests. The supplied ChatGPT review also includes separately written coefficient checks through $K=10$, covering **250,953 subset pairs**, and interval automatic differentiation for the baseline lens. This is additional AI-assisted checking and implementation diversity, not authenticated human specialist review, editorial peer review or unaffiliated reproduction.

The baseline certificate uses exact rational arithmetic to prove one nonsingular root in each of 25 disjoint boxes: 13 positive and 12 negative Jacobian orientations. It reproduces the published perpendicular-binary example with coupling $1/100$. It proves **at least 25** images at those parameters. It does not exclude other images outside the boxes or certify global regularity of that source.

The manuscript is an **unrefereed candidate**. No end-to-end formal verification is claimed. The sharp question $N\le\prod_i(5g_i-5)$ for $g_i\ge2$ remains unresolved, and the theorem does not cover external shear, continuous matter, or a count of critical images. Bounded searches found no equivalent general recurrence, making novelty plausible within that search scope. They do not establish priority: Perry’s relevant 2022 dissertation was identified but not located in full text, and citation-network coverage remains incomplete.

## Relationship to earlier work

[Perry (2021)](https://doi.org/10.1007/s13324-021-00478-4) supplies the general resultant-based comparator. [Keeton, Lundberg and Perry (2023)](https://arxiv.org/pdf/2302.11735v1) supply the nearest-neighbour physical model and the attained product construction. [Mao, Witt and An (2014)](https://doi.org/10.1093/mnras/stt1988) already used Bernstein’s theorem in two-plane lensing and obtained the six-image one-mass-per-plane case. [Petters (1997)](https://doi.org/10.1063/1.531818) supplies the sharper historical comparator for one mass per plane.

The contribution assessed here is the general sparse formulation and exact path-based evaluation of its mixed-volume envelope. Neither Bernstein’s theorem, complexifying conjugate coordinates, nor the existing lower constructions originated in this release. The source audit preserves the distinction between the earlier dense bound—245 for three binary planes—and the final sparse bound of 213.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical lensing researchers | A smaller universal search ceiling and a concrete two-binary interval, 25 to 33 | The upper bound is not an attained maximum |
| Algebraic geometers and polynomial-system researchers | A mixed-volume calculation reduced to feasible subset pairs on a path | Generic auxiliary systems evaluate an invariant; physical coefficients need not be generic |
| Numerical lensing researchers | Exact parameters and a 25-root baseline for solver calibration | Missing roots in a numerical search cannot prove an upper bound |
| Formal-verification and assurance researchers | An explicit physical-root injection, sparse counting argument and small rational checker | The general prose proof has not been formalised |

## Why the problem matters

A ceiling tells us which image counts a model rules out before any particular configuration is searched. In several lens planes, the equations are coupled and the sharp single-plane answer cannot simply be multiplied. The result shows that preserving those couplings as a sparse system can improve a general bound without solving every lens equation.

This is a mathematical result for an idealised point-mass model. It does not measure real astronomical image frequencies, brightness, detectability or observational selection. Its practical research value is a more constrained counting problem and a reusable argument whose assumptions can be examined directly.

## How to inspect or reproduce the recorded checks

Start with the theorem and hypotheses in the [paper](https://github.com/ipitchford/multiplane-lensing-sparse-bound/releases/download/v0.2.0-candidate/paper.pdf), then inspect the physical-to-polynomial reduction and the mixed-volume calculation. The [versioned repository](https://github.com/ipitchford/multiplane-lensing-sparse-bound/tree/v0.2.0-candidate) and [archive](https://zenodo.org/records/23075650) provide the exact files.

From an extracted package, Python 3.10 or later is sufficient for the core checks; no third-party Python packages are required:

```sh
python3 verify.py
python3 -O verify.py
python3 baseline/check_baseline.py --negative-controls
python3 -O baseline/check_baseline.py --negative-controls
```

The first pair checks the combinatorial formulas and finite controls. The second pair checks rational root boxes and rejects a duplicated box, wrong source, changed positive mass, false far-away centre, negative mass and singular preconditioner. Optimisation mode cannot remove the explicit acceptance checks. The separately written review checks can be run with:

```sh
python3 referee-audit/independent_checks.py .
```

Compare outputs with `REPLAY_RECEIPT.md` and the supplied review receipts. Read the `baseline/README.md` parameter table before treating a successful run as evidence about a different lens. Hashes identify the files; they do not independently validate the mathematics.

## The most valuable next projects

1. **Resolve the two-binary gap.** Either certify a physical lens with more than 25 regular images, or introduce a reality- and positivity-sensitive argument excluding the remaining counts beneath the ceiling of 33. An incomplete root search cannot decide this.
2. **Audit and formalise the general bridge.** Check the full injection from physical images to simple roots, the translation step, and the exact sparse mixed-volume evaluation. A fresh implementation should derive the mathematics rather than only replay supplied inputs.
3. **Complete the nearest prior-art comparison.** Locate and read Perry’s 2022 dissertation and extend citation follow-up before making a priority claim. Failure to retrieve it establishes neither overlap nor non-overlap.

## What is in the evidence package

| Object | What it provides |
|---|---|
| `paper.pdf`, `paper.tex`, `PROOF.md` | Typeset manuscript, editable source and accessible prose proof |
| `CLAIMS.json`, `ASSURANCE.md`, `AI_INDEX.md` | Claim scope, trust boundaries and machine-readable navigation |
| `verify.py`, `REPLAY_RECEIPT.md` | Exact finite recurrence checks, controls and recorded execution |
| `baseline/` | Exact physical parameters, 25 rational root boxes and the standard-library checker |
| `referee-audit/` | Supplied ChatGPT review, separately written checks and their scoped results |
| `SOURCES.md`, provenance and licence records | Prior-art comparisons, remaining access gaps and component terms |
| `MANIFEST.sha256` | File identities for the versioned package |

The page and synthetic briefing explain the result. They add no scientific evidence beyond the linked proof, checks and explicitly scoped review material.
