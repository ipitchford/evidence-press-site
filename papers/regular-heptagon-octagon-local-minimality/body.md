## Summary

Imagine a drum with seven straight sides. Keep its area fixed and move its corners a little. Does the perfectly regular shape have the lowest fundamental vibration frequency among its nearby competitors?

This candidate answers **yes for seven and eight sides**. It checks all genuine directions in which the shape can change—not just symmetric deformations. Moving, turning or rescaling the whole polygon is excluded from those shape directions.

“Nearby” is essential. The result does not compare the regular polygon with every possible polygon, and it does not supply a numerical radius within which the conclusion holds.

## Summary for specialists

For a polygon $P$, let $\Phi(P)=|P|\lambda_1(P)$, where $\lambda_1$ is the first Dirichlet Laplacian eigenvalue. For $n=7,8$, the regular $n$-gon is a strict local minimiser of $\Phi$ modulo similarities.

At unit circumradius, on the Euclidean orthogonal complement $E$ of the four infinitesimal similarities,

$$D^2\Phi(a)[v,v]\ge c_n\|v\|^2.$$

The constants are $c_7=3/5$ and $c_8=7/20$.

The reduced spaces have dimensions **10 and 12**. These are conservative certified constants, not claimed optimal eigenvalues of the Hessian.

## Technical account

The proof pulls the eigenvalue problem back to a fixed polygon and derives the shape Hessian. A finite-certificate transfer theorem then bounds the difference between that continuous Hessian and a computable trial-based form.

The useful cancellation occurs in an auxiliary response equation. A completion-of-the-square identity makes its residual loss quadratic. This does **not** make the entire Hessian error quadratic: ground-state approximation losses remain and account for about 99.8% and 99.9% of the reported error budgets.

The computer supplies conforming polynomial trial functions on meshes of 1,512 and 2,160 triangles. A separate checker reconstructs geometry, reference identities, scalar and flux continuity, residual integrals and positive-definiteness tests. It does not trust a sparse eigensolver's printed eigenvalues. Outward-rounded final lower endpoints exceed 0.64203079 and 0.38040253, leaving room for the simpler rational theorem constants.

## Evidence, assurance and limitations

Both canonical certificates replayed on macOS ARM64, supplementing the supplied Linux record. The package also contains an exact-integer final matrix check, 13,763 interval endpoint tests and seven deliberate mutations that must be rejected. Assertions are part of the checker contract: Python optimisation modes are explicitly rejected.

The supplied referee's separate quadrature diagnostic is useful cross-checking, not a second outward-rounded PDE certificate. Its noncertifying eigenvalue display required a documented SciPy substitution on macOS; the proof checker itself was unchanged.

This remains an **unrefereed candidate**. Producer-coordinated cross-platform replay is not independent institutional reproduction or formal verification. The written transfer theorem, conformity arguments and floating-point arithmetic assumptions remain explicit trust boundaries. Global optimality, other side counts and an explicit neighbourhood radius are not established.

## Relationship to earlier work

Bogosel and Bucur developed the polygonal volume Hessian and a validated-computation route, with certified local results for five and six sides. The present candidate targets the next two side counts with a different residual transfer estimate.

Bogosel's recent torsional-rigidity work is a close methodological antecedent, but concerns a different functional. The later all-sided local torsion result likewise does not settle this Dirichlet-eigenvalue question. Residual eigenvalue estimation and completion of the square are not claimed as new in isolation.

A fixed-trial comparison in the revised package isolates the benefit of cancellation. Discarding it still certifies positive bounds, about 0.4875 and 0.2764, but not the retained constants. This is a deliberately elementary comparator, not a benchmark against an optimised competing method.

## Who should care, and why

| Audience | Potential use | Boundary |
| --- | --- | --- |
| Spectral geometers | A candidate resolution of two full local polygon problems | Local does not mean global. |
| Verified-numerics researchers | A worked continuous-to-finite Hessian certificate | Audit the arithmetic and semantic bridge. |
| Shape-optimisation researchers | An explicit separation of response and ground-state errors | No engineering performance benefit is demonstrated. |

## Why the problem matters

Symmetry makes the regular polygon a plausible optimum, but that intuition is not a proof. Small asymmetrical movements must be controlled too. Here the contribution is a checkable route from approximate numerical functions to a statement about every sufficiently small genuine deformation.

## How to inspect or reproduce the recorded checks

Start with **AI_INDEX.md**, the manuscript's proof-to-checker table and **REVIEW_RESPONSE.md**. In an isolated Python environment, install the pinned requirements and run:

```sh
python -m pip install -r requirements.txt
OPENBLAS_NUM_THREADS=1 python run_checks.py
```

The runner verifies the package manifest, both certificates and the additional controls. `--proof-only` omits diagnostic tests. Do not use `-O` or `-OO`: rejection is intentional. Reproducing stored trials is the replay target; regenerating floating-point trial functions may yield different bytes and requires fresh certification.

## What is in the evidence package

The archive includes the scientific PDF and LaTeX, canonical trial arrays, exact reference data, producer and checker code, pinned dependencies, replay records, claim and assurance records, prior-art comparison, review response, licence map and a linked AI index. Original text and data are CC0; original code is MIT. Graphics and audio explain the result and add no mathematical evidence.

## Next steps

The highest-value independent check is to re-derive the continuous-to-finite transfer and inspect the interval arithmetic contract before replaying the arrays. Improving the dominant ground-state loss, bounding a neighbourhood radius and treating further side counts are separate research tasks.
