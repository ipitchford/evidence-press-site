## Summary

The Fano plane is a tiny geometry: seven points joined by seven three-point
lines. Yet its tensor spectrum is much richer than the eigenvalues of an
ordinary seven-by-seven matrix. The relevant characteristic polynomial has
degree 448.

This candidate gives that polynomial's complete factorization and nineteen
distinct eigenvalues. It also finds an unusual contrast: the real eigenvalue
two has no real eigenvector, while two complex eigenvalues have an entire
smooth curve of projective eigenvectors. The curve has degree eight and genus
three. Exact computation supports these claims, but the release remains
unrefereed; historical priority and unaffiliated validation are not established.

## Summary for specialists

Let the seven lines be $124,235,346,457,156,267,137$. Use the symmetric
order-three adjacency tensor with entries $1/2$ on permutations of each line,
so that $\mathcal A x^2=\lambda x^{[2]}$. The candidate factorization is

$$
\begin{aligned}
\phi_F(\lambda)={}&\lambda^{35}(\lambda-1)^{35}(\lambda-2)^{28}(\lambda-3)\\
&\cdot(\lambda^2-\lambda+1)^7(\lambda^2+2\lambda+6)^7(\lambda^2+\lambda+1)^{21}\\
&\cdot(\lambda^2+\lambda+2)^{52}(\lambda^3+2\lambda^2+2\lambda-2)^{21}\\
&\cdot(\lambda^4-\lambda^3-\lambda^2+\lambda+1)^{28}.
\end{aligned}
$$

The H-spectrum is $\{0,1,3,\theta\}$, where $\theta$ is the unique real root of
$\lambda^3+2\lambda^2+2\lambda-2$. At each root of $\lambda^2+\lambda+2$, the
saturated projective eigenscheme is a smooth geometrically irreducible curve
of degree eight and genus three, contained in $\sum_i x_i=0$.

## Technical account

The main compression is a standard Poisson product formula. It replaces one
large symbolic resultant by a recursion through induced hypergraphs, using
multiplication matrices of dimension at most 64. Modular evaluation and
interpolation produce residue polynomials; an a-priori root bound makes their
Chinese-remainder lift unique. The thirty-prime product has 930 bits, exceeding
twice the coefficient bound. The reused six-vertex polynomial satisfies its
own, smaller bound.

Explicit point, line, flag and anti-flag constructions give eigenvectors.
These prove existence, not completeness: the latter comes from the resultant.
A rational polynomial identity excludes real eigenvectors at two. For the
curve, a characteristic-zero saturation, Hilbert series, Jacobian calculation
and minimal resolution supply the smoothness and connectedness argument.
Smoothness plus geometric connectedness gives geometric irreducibility.

The cover illustrates the seven-point incidence structure and the nineteen
distinct roots in the complex plane. It does not depict multiplicity or serve
as a verification certificate.

## Evidence, assurance and limitations

Producer replay checks all 449 coefficients, all thirty saved residue
polynomials and every inductive lift bound. Fresh checks cover explicit
vectors, all 168 automorphisms, characteristic-zero curve geometry, the
no-real-vector identity, rational chart lengths and four Macaulay evaluations.
Normal and optimized Python runs agree; deliberately corrupted inputs are
rejected. Macaulay supplies a different determinant construction but shares
interpolation helpers with the Poisson implementation.

Routine replay does not freshly repeat the complete thirty-prime computation
or every finite number-field decomposition. Those original artifacts and
their source programs are preserved. CAS correctness and the translation from
incidence data to equations remain trust boundaries. Internal editorial
assessment is not unaffiliated specialist review, independent reproduction or
proof-assistant verification. No official research-quality star rating,
historical first-solution claim or measured impact is asserted.

## Relationship to earlier work

Cooper and Dutle established the normalization and Poisson approach; this is an
application, not a new resultant algorithm. Clark and Cooper's inspected
author version supplies leading Fano coefficients and the complete polynomial
for the two-line-deleted Rowling hypergraph. The latter is a regression
fixture, not a new result here. Our codegree-fourteen coefficient differs from
the inspected author-version table; no correction to an uninspected final
publisher PDF is claimed.

The problem appears in Cooper's October 2020 list. A recent paper's reference
to a 2022 Fano polynomial is a priority lead, not resolved by the historical
open label. The bounded literature and GitHub search found no matching full
factorization, but does not establish exhaustive novelty or priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Spectral hypergraph researchers | A compact exact example with nontrivial eigenschemes | Distinguish resultant multiplicity, scheme length and point count |
| Computer algebra researchers | A small reproducible benchmark across two resultant constructions | Shared utilities and producer coordination are not independence |
| Algebraic geometers | An explicit degree-eight, genus-three eigencurve | No identification with a classical curve is claimed |
| Interested readers | A concrete contrast between matrix and tensor eigenvectors | Candidate computation is not established consensus |

## Why the problem matters

Small symmetric examples make otherwise abstract tensor phenomena inspectable.
Here a finite spectral list coexists with a continuous family of eigenvectors,
and a real eigenvalue need not admit a real eigenvector. The potential value is
an exact test case and reusable evidence package—not a demonstrated practical
application or an advance in the general theory of tensor multiplicities.

## How to inspect or reproduce the recorded checks

Start with the archive README and assurance statement. Install Python 3.12 or
later, Singular 4.4.1 and the pinned Python dependencies, then run:

```sh
python package.py check
python verify.py
python -O verify.py
python test_negative.py
```

Expected status is PASS, with nonzero exit on failure. The README separately
documents the more expensive full-resultant route. The manifest checks file
identity; it does not validate the mathematics.

## The most valuable next projects

1. Reimplement and rerun the full resultant computation outside the producer
   workflow, including the source-to-equations bridge.
2. Audit the finite eigenscheme classifications and characteristic-zero curve
   proof with specialist algebraic-geometric scrutiny.
3. Seek a conceptual explanation of the exceptional exponent 52 and determine
   whether the curve has a recognized classical model.
4. Resolve the historical-priority leads through broader primary-source work.

## What is in the evidence package

The archive contains the PDF and accessible manuscript source, coefficient and
residue data, exact Python and Singular programs, characteristic-zero
certificates, replay receipts, semantic negative controls, source/novelty audit,
review responses, machine-readable claims, manifest and component licences.
Original prose/data are CC0 and executable code MIT. The scholarly creator is
Anonymous. Audio and imagery communicate the result; they add no mathematical
evidence.
