## Summary

A space-filling arrangement of convex cells can be more complicated than a proposed universal bound allows. This candidate gives an explicit repeating arrangement whose *harmonic degree* is a little over four. The proposed upper bound in three dimensions was four.

The result rests on a geometric construction, not just a plausible set of counts. Rational coordinates, supporting planes and matching cell boundaries make the example inspectable. It also has a weighted-Delaunay realization and a corresponding power diagram, or Laguerre mosaic. These are weighted constructions; the paper does not claim an ordinary unweighted Voronoi counterexample.

## Summary for specialists

The normal periodic convex face-to-face three-mosaic has densities $(V,C,I)=(373,432,3276)$, where $I$ counts vertex–cell incidences. Thus

$$
\bar n=\frac{3276}{373},\qquad \bar v=\frac{91}{12},\qquad
\bar h=\frac{I}{V+C}=\frac{468}{115}=4+\frac8{115}>4.
$$

A finite strictly regular Schlegel template implants into the Freudenthal triangulation. An explicit rational change of metric and weights gives a periodic weighted-Delaunay realization; its Laguerre dual exchanges $V$ and $C$ without changing $\bar h$.

Written extensions show that both mean-degree coordinates are separately unbounded in every dimension at least three, and that every $\bar h\in(3,16)$ occurs in dimension three, periodically when rational. The periodic regular-class comparison identifies the closure of its harmonic degrees with finite asymptotic limits of $f_{03}/(f_0+f_3)$ for convex four-polytopes. It also supplies $\bar h\ge3$ in that restricted class.

## Technical account

Start with a rational neighborly cubical four-polytope. Two stackings create a tetrahedral facet that serves as a port for a Schlegel projection. The resulting tetrahedral subdivision has 66 vertices, 72 cells and 546 vertex–cell incidences. Only four vertices lie on its unchanged outer tetrahedron.

Insert six affine copies into the six Freudenthal tetrahedra of each unit cube. The density count is

$$
V=1+6(66-4)=373,\qquad C=6\cdot72=432,\qquad I=6\cdot546=3276.
$$

The vertex count is not $6\cdot66$: shared boundary vertices must be identified. This is the crucial passage from a finite patch to an infinite periodic mosaic.

Strict regularity is checked through a rational quadratic lattice lifting and the finite set of macro-face types. The shipped weighted payload lists 373 sites and 432 cell orbits. The global convexity argument in the paper explains why the finite checks suffice for this construction.

For the converse asymptotic comparison, a periodic lifting is restricted to a large cube and capped above. The revised boundary lemma counts clipped cells, new vertices, the six vertical facets and the top facet. Their contribution to vertices, facets and incidences is $O(R^2)$, while interior counts scale as $R^3$. This is a regular-class argument, not a converse for arbitrary non-liftable mosaics.

## Evidence, assurance and limitations

The exact rational verifier checks supporting planes, the full face lattice, stacking, projection, matching faces and volume. The weighted script is a checked constructor; a separate read-only checker compares the supplied weighted payload with exact reconstruction and refuses changes to weights, translations or cell references. That checker shares implementation code and is not an independent lower-hull verifier.

Fresh archive replay passed. Across the shared package, two positive controls passed, nine corrupted certificates were rejected, and five scripts refused optimized Python because their original checks use assertions. These are bounded producer-side tests, not exhaustive adversarial coverage.

The supplied review has been addressed, but external referee identity and independence are not authenticated. Infinite tilings, interval filling and asymptotic comparison retain written proof dependencies. There is no proof-assistant verification or unaffiliated reproduction.

The full set of achievable mean degrees remains unclassified. Sixteen is not claimed to be a maximum. The lower bound for the periodic regular class is not a proof of the general strict lower bound for every convex mosaic. No claim about the frequency of these structures in geology is made.

## Relationship to earlier work

Domokos and Lángi proposed the harmonic-degree band. Joswig and Ziegler supplied the neighborly cubical constructions; Ziegler's earlier account already describes Schlegel insertion into tilings and high mean degrees. Projected products provide the high-complexity input approaching sixteen. Rybnikov gives relevant lifting and weighted-diagram background.

The contribution is the explicit application to the later band, rational periodic weighted realization and the stated refinements—not the invention of those older techniques. The manuscript includes an input/modification/conclusion table. The source audit is bounded and does not certify priority.

## Who should care, and why

| Audience | Potential use | Boundary |
|---|---|---|
| Discrete geometers | A concrete counterexample and regular-class asymptotic comparison | The unrestricted range is still open |
| Computational geometers | Exact rational sites, weights and finite test data | Weighted diagrams, not ordinary Voronoi cells |
| Researchers modelling fragmentation | A test of which assumptions a universal claim needs | No physical typicality or empirical validation |

## Why the problem matters

A bound suggested by many familiar examples can fail on a carefully constructed geometry. The counterexample distinguishes an apparent regularity of common models from a universal mathematical constraint. It also connects the remaining regular-class question to a precise four-polytope complexity problem.

## How to inspect or reproduce the recorded checks

Download the shared archive, verify `MANIFEST.sha256`, install the pinned SymPy dependency in an isolated Python environment, and run from a disposable extracted copy:

```sh
python code/reproduce.py
```

This regenerates certificates and runtime reports. To check the weighted payload without replacing it, run `python code/check_weighted_certificate.py`. Python optimization is intentionally rejected, not silently accepted with checks disabled. The companion abrasion stages run as part of the same package but do not provide independent confirmation of this paper.

## The most valuable next projects

Audit the weighted construction with an independently implemented lower-hull checker; determine the unrestricted harmonic-degree range; and investigate which stronger geometric or statistical assumptions recover useful bounds for natural fragmentation models.

## What is in the evidence package

Two separately identified manuscripts share the computational archive. This paper has its own PDF, citation file and DOI. `AI_INDEX.md`, `CLAIMS.json`, source and review-response records, rational certificates, replay code, negative controls and a complete manifest support reuse. The [abrasion companion](/releases/centroidal-equilibrium-creation/) addresses a different mathematical question and has its own assurance boundary.
