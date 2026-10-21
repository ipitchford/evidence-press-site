## Summary

**What the object is.** The essential variety is a well-studied geometric shape made of three-by-three matrices, cut out by ten cubic equations; it is the algebraic setting behind five-point estimation in multiview geometry. Slice it by a generic projective three-plane and you get exactly ten points. Its **Hurwitz form** is a single polynomial that vanishes precisely when such a slice degenerates—when the slice stops being ten distinct reduced points, for example because two of them collide. That polynomial has degree 30 in the slice's coordinates and is far too large to write out monomial by monomial.

**What was found.** This unrefereed candidate gives a compact recipe for evaluating it exactly: build a ten-by-ten trace matrix from the slice, take its determinant, and multiply by the fourth power of one correcting determinant. The heart of the paper is a written proof that the apparent denominator in that recipe cancels globally, so the recipe really defines the intended polynomial everywhere, not just on a convenient chart. The same method treats the related variety of symmetric four-by-four matrices of rank at most two.

**Why it is useful.** A recently revised study of five-point estimation identifies a necessary degree-30 ill-posedness polynomial and notes that its explicit form was unavailable there. The present formula supplies an exact algebraic evaluation route after the appropriate Pluecker substitution. It does not establish practical speedups, better numerical conditioning or physical camera recovery.

**Status.** An anonymous, unrefereed mathematical candidate. Exact finite checks support the implementation; the all-frame theorem rests on the written proof, which has not been refereed, formally verified or priority-cleared.

## Summary for specialists

For a nine-by-four frame $B$, substitute the affine matrix $E=B(1,x,y,z)^T$ into the ten essential cubics. Split their coefficients between the ten degree-three monomials $c$ and the ten monomials $b$ of degree at most two, writing $f=Ac+Cb$. Set $D=\det A$. On $D\neq0$, reduction by these equations produces the rank-ten quotient algebra and its multiplication matrices $M_x,M_y,M_z$. With $T_{ij}=\operatorname{tr}\bigl(b_i(M)b_j(M)\bigr)$ the trace pairing in the ordered quadratic basis, the candidate formula is

$$
H(B)=D(B)^4\det T(B).
$$

The manuscript proves that $H$ extends to a homogeneous polynomial of frame degree 120, descending to the degree-30 Hurwitz form in Pluecker coordinates, up to a nonzero scalar; consequently $H(Bg)=\det(g)^{30}H(B)$ for $g\in GL_4$. It supplies an exact-division polynomial expression,

$$
H(B)=\frac{\det Q(B)}{D(B)^{26}},\qquad D^{26}\mid\det Q \text{ in } \mathbb{Q}[B],
$$

and a finite interpolation fallback at $D=0$. The output is a compact arithmetic formula, not an expanded monomial coefficient list.

## Technical account

The proof has four stages. First, the determinant D is identified with the Chow boundary: a zero detects intersection with the chosen plane at infinity. Second, the coefficient reduction gives a free algebra of rank ten uniformly over the open set D nonzero, not merely at sampled frames.

Third, along a generic point of the boundary, exactly one section point tends to infinity. The quadratic evaluation basis bounds the pole of the trace determinant by four. This is why the correcting factor is precisely D to the fourth power. Fourth, the resulting global polynomial has the required degree and generic simple vanishing, identifying the irreducible Hurwitz divisor.

For symmetric matrices, the manuscript specifies all ten upper-triangular coordinates, signed cofactor generators and the witness induced by the essential-to-symmetric linear identification. The rank-one singular locus has codimension three, satisfying the required generic-section condition.

## Evidence, assurance and limitations

The eight-page manuscript contains the universal argument. Exact producer controls test general linear covariance, a primitive-element comparison with basis correction, a tangency, a reduced section with a point at infinity, a misleading projection collision, Pluecker input validation and the polynomial quotient identity. A separate producer-constructed Singular Jacobian computation cross-checks tangency and reducedness.

A further control uses Jiang and Sturmfels's published symmetric example: the value vanishes at parameter 194 with trace rank nine, whereas parameter 195 gives a nonzero value and rank ten. This tests a published fixture, not the entire theorem.

The supplied review and publisher-coordinated model reviews are disclosed as internal assurance inputs. The supplied review's linked extra audit files were unavailable and are not claimed as archived independent reconstruction. No unaffiliated whole-proof acceptance, formal verification, historical-priority clearance or demonstrated practical improvement is asserted.

## Relationship to earlier work

Sturmfels's Hurwitz-form theorem provides the degree and divisor framework. Floystad, Kileel and Ottaviani provide the essential variety's Chow-form and symmetric-model setting. Classical trace discriminants and D'Andrea–Jeronimo rational trace formulas are antecedents, not inventions of this candidate.

Jiang and Sturmfels already computed a one-parameter degree-30 specialization in their 2021 Example 12. The present contribution sought is a reusable compact formula and its global cancellation proof, not the first specialized Hurwitz evaluation. Fan, Kileel and Kimia's May 2025 revision identifies a necessary degree-30 five-point ill-posedness polynomial and notes the explicit polynomial was unavailable in that treatment. This does not establish practical superiority of the present exact algorithm.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Computational algebraic geometers | Inspect or reuse a small trace-matrix representation of a large divisor. | The global proof remains unrefereed. |
| Multiview-geometry researchers | Study the algebraic degeneracy locus underlying five-point estimation. | No physical sufficiency, numerical stability or speedup is established. |
| Exact-computation developers | Independently reconstruct the finite algebra and boundary evaluator. | Finite agreement is not whole-proof validation. |

## Why the problem matters

A polynomial may have an unwieldy expanded expression but a short exact evaluation recipe. Here the key issue is not merely finding a determinant that works on a convenient chart: it is proving that the chart denominator cancels and that the formula represents the intended global geometric divisor. A successful compact representation makes further scrutiny and exact experimentation accessible without expanding every coefficient.

## How to inspect or reproduce the recorded checks

Download the immutable archive, verify MANIFEST.sha256, and install the pinned SymPy dependency. Run python3 verify.py and python3 -O verify.py for the Python-only suite. Add --full to either command when Singular is installed to include the separately constructed Jacobian checks.

The verifier works in a temporary copy and compares exact semantic outputs while allowing timings to differ. Both modes retain their checks, and an intentional failure confirms optimized mode cannot turn them off. No historical machine path, remote solver or generic expanded polynomial computation is required. PDF rebuilding separately needs Pandoc and pdfLaTeX.

## The most valuable next projects

The highest-value next step is unaffiliated scrutiny of the generic Chow-boundary valuation and divisor identification, together with an independently reconstructed exact implementation. A specialist prior-art search should test for equivalent earlier constructions. Numerically stable evaluation, practical estimator benchmarks and applications to real camera configurations are separate projects, not results already established here.

## What is in the evidence package

The package includes the PDF and accessible manuscript, formula and global evaluator, symmetric fixture, exact receipts, nonmutating verifier, source comparison, claims index, review response, internal editorial records, environment guidance and complete manifest. Original prose and data use CC0; original code uses MIT. GitHub and the version DOI identify the same release assets. Publication and communication media improve access, not mathematical assurance.
