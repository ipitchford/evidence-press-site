## Plain-English summary

Imagine sorting polynomial transformations of the plane by the sequence of
degrees used to build them. The Polydegree Conjecture asks when one such family
can occur as a limiting case of another. Earlier work turned many of these
geometric questions into an explicit search for numbers that make several
polynomials zero while keeping another polynomial and a determinant non-zero.

This candidate explains what that apparently extra determinant means. It is,
up to sign, the **Jacobian determinant** of the coefficient polynomials already
in the problem. A Jacobian detects whether equations meet cleanly at a point.
The old algebraic test can therefore be read as a much more familiar geometric
request: find one smooth point of an intersection that does not lie on the
next forbidden hypersurface.

That change of viewpoint also makes the computer certificate smaller. Instead
of evaluating a separate determinant formula, a search over a finite field can
look for a simple common zero and check that the next coefficient is non-zero.
Hensel lifting then carries the point to characteristic zero.

The paper proves this reformulation and several supporting theorems. It also
reports exact calculations in the first substantial three-variable family.
Those calculations succeed for every index from 2 through 20, but they are
finite evidence, not a proof for every index.

> **Candidate status:** anonymous · unrefereed · exact producer replay passed ·
> no independent reproduction, proof-assistant formalisation, external
> specialist review, or editorial peer review.

## The central claim or finding

Lewis, Perry and Straub define coefficient polynomials $g_{n,e}$, matrix
entries $\alpha_{i,j,e}$, and an auxiliary determinant $a_{d,e}$. The key
identity is

$$
\alpha_{i,j,e}=-\frac{\partial g_{j+1,e}}{\partial x_{i+1}},
\qquad
a_{d,e}=(-1)^e\det D(g_{d,e},\ldots,g_{d+e-1,e}).
$$

Thus the determinant is not independent machinery. It is the Jacobian of the
coefficient map already being studied.

Weighted homogeneity then gives an exact integral syzygy. On the partial zero
locus, that identity reduces the full determinant test to two local
conditions: the next coefficient must be non-zero, and the smaller affine
Jacobian minor must be non-zero. In the chart $x_1=1$, this says precisely that
the point is smooth and avoids the next coefficient hypersurface.

The resulting finite-field criterion is sharper than the legacy modular test.
A simple common zero with non-zero next coefficient lifts to the required
characteristic-zero point even if the chosen prime divides the scalar that
appears in the Euler identity. The residue-field determinant may then vanish,
but its value at the exact $p$-adic lift is still non-zero.

## How the result works

There are four linked arguments.

First, a coefficient reindexing turns every entry of the auxiliary matrix into
a partial derivative. Taking determinants gives the Jacobian identity.

Second, the coefficient polynomials carry natural weights. Expanding their
weighted Euler identities along the first column produces an integral relation
between the full determinant, the next coefficient, the affine Jacobian minor,
and the equations that already vanish. Because the relation is integral, it
can be reduced modulo primes without first dividing by a potentially vanishing
integer.

Third, multivariate Hensel lifting starts from a simple finite-field zero and
produces an exact point over the $p$-adic integers. Localisation, faithful base
change, and the weak Nullstellensatz then transfer existence to the complex
numbers. The archive retains the case $d=8$, $p=5$ as a regression example:
the refactored criterion works although the old demand that the full
determinant be a unit modulo $p$ does not.

Fourth, a separate geometric bridge works on a smooth complete-intersection
curve. If the next equation cuts out a non-empty reduced affine zero divisor
and the final coefficient avoids its support, at least one point supplies the
required Jacobian certificate. The closed-point statement is made over a
perfect ground field before base change, which avoids assigning a spurious
degree to a point over an algebraically closed field.

For $e=3$, exact rational and Singular calculations find

$$
\dim_{\mathbf Q}\frac{\mathbf Q[X,Y]}{(G_d,G_{d+1})}
=\left\lfloor\frac{d(d+1)}6\right\rfloor
$$

for $2\le d\le20$, with the Jacobian and $G_{d+2}$ invertible in every
coordinate algebra. A separate hypergeometric argument proves that every
individual one-variable boundary factor has simple positive roots, hence is
squarefree, for all indices.

## What is classical, and what is offered here

The underlying Polydegree containment criterion, its coefficient polynomials,
and the algorithmic programme belong to Lewis, Perry and Straub. Perry's
thesis developed the computational direction for the case later indexed as
$e=3$. Lewis--Perry--Straub also record an existing infinite family in that
column, attributed to Edo. None of those results is claimed here as new.

The candidate contribution is the derivative--Jacobian interpretation, the
integral weighted-Euler reduction, the smaller Hensel certificate, the
curve-theoretic bridge, and the uniform squarefreeness theorem for each
individual boundary factor. The exact affine and adjacent-coprimality sweeps
are supporting finite evidence.

A bounded literature search did not locate the same Jacobian packaging, but
that is not a priority certificate. Original-author feedback, specialist
database searches, and external review could change the historical
assessment.

## Evidence and audit trail

The immutable package contains a 17-page paper, accessible Markdown and LaTeX,
the bibliography and source records, exact evidence, review records, and a
SHA-256 manifest covering 142 durable files.

The replacement standard-library verifier performs 10 symbolic gates and
checks all 51 frozen witnesses. It passes under ordinary Python and
`python -O`. Sixteen mutation or negative controls and one positive
bad-characteristic regression also pass in both modes. Exact geometry receipts
cover the affine family through $d=20$, boundary arithmetic through $d=200$,
and the wider ranges stated in the package.

Citation review covered all nine bibliography records and all 14 in-text
contexts. An originality screen sampled 40 of 132 body paragraphs across every
major section and found no close or verbatim match in the checked corpus.

These are checks made inside the producing workflow. They can expose broken
formulas, corrupted files, stale builds, and fail-open code paths. They do not
turn the paper into an independently reproduced or peer-reviewed result.

One upstream verifier defect is deliberately preserved in the record: a
proof-critical integrality guard used Python `assert`, which disappears under
optimized execution. The current witness data still pass, and the replacement
verifier uses explicit exceptions. This is a robustness risk in the old
checker, not evidence that a current certificate is false.

## What the result does not establish

- It does not prove the full Polydegree Conjecture or the Polydegree Ideal
  Conjecture.
- It does not prove the uniform $e=3$ affine statement for every $d$.
- It does not prove uniform coprimality of adjacent boundary factors; that
  property is checked exactly only through $d=200$.
- It does not establish absolute novelty or priority.
- It has not been independently reconstructed, formally verified, reviewed by
  an external specialist, or accepted by a journal.
- A public DOI, passing CI run, and matching hashes establish availability and
  integrity of the released bytes; they do not establish mathematical truth.

## Relationship to earlier work

Lewis, Perry and Straub supply the specialisation theorem to which the new
smooth-point certificate is applied. Their Theorem 4 is a sufficient
containment criterion; this candidate does not claim it is necessary. Perry's
dissertation is an antecedent for the $e=3$ computational programme, while Edo
and van den Essen provide the surrounding Strong Factorial context.

The boundary proof uses two results on finite free convolution by
Martínez-Finkelshtein, Morales and Perales. The repaired proof reflects one
Jacobi factor and invokes logarithmic-mesh preservation to obtain simple roots;
it does not rely on a stronger strict-preservation sentence that is false in
the generality printed elsewhere.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Polynomial-automorphism researchers | Replace an auxiliary determinant condition with a local smoothness problem. | The all-$d$ affine theorem remains open. |
| Algebraic geometers | Study explicit complete intersections through Jacobians, divisor support, and weighted identities. | The uniform radicality and disjointness claims are conjectural. |
| Arithmetic and computational algebra researchers | Search with a smaller modular certificate and use primes rejected by the legacy determinant-unit test. | Producer replay is not an unaffiliated reimplementation. |
| Special-functions researchers | Reuse the Jacobi and finite-free-convolution route to individual boundary squarefreeness. | Adjacent coprimality compares changing families and is still unproved. |
| Computer-assisted mathematics researchers | Inspect a package that distinguishes proof, finite computation, controls, and open claims. | Hashes and CI certify bytes and replay, not the theorem itself. |

## How to reproduce the recorded checks

Download the ZIP from the immutable GitHub prerelease or Zenodo and verify its
`MANIFEST.sha256`. The package `BUILD.md` gives the exact commands. The core
portable route is:

```sh
python3 -B scripts/verify_manifest.py --root "$PWD"
python3 -B -O scripts/verify_manifest.py --root "$PWD"
python3 -B scripts/validate_candidate.py --root "$PWD" --publication-ready
python3 -B -O scripts/validate_candidate.py --root "$PWD" --publication-ready
python3 -B scripts/verify_jacobian_refactor.py \
  --witness-data evidence/upstream/polydegree_e3_witnesses_50_100.json
python3 -B scripts/test_mutations.py \
  --witness-data evidence/upstream/polydegree_e3_witnesses_50_100.json
```

The exact affine and boundary regenerations additionally require SymPy 1.14.0
and Singular 4.4.1. A stronger independent check would reconstruct the
identities and geometry from the definitions without consulting the supplied
verifier outputs.

## The most valuable next projects

1. Prove or disprove uniform radicality and the predicted length of
   $(G_d,G_{d+1})$, with both $J_d$ and $G_{d+2}$ invertible.
2. Prove uniform adjacent boundary coprimality, or find the first
   counterexample across the changing hypergeometric families.
3. Exclude triple common zeros of $G_d,G_{d+1},G_{d+2}$ structurally rather
   than by extending a finite table.
4. Obtain an unaffiliated proof reconstruction, original-author feedback, and
   external algebraic-geometry or polynomial-automorphism review.
5. Formalise the derivative identities, Euler syzygy, and Hensel bridge in a
   proof assistant.

## What is in the public package

The public record contains the candidate paper in PDF, LaTeX, text, and
accessible Markdown; bilingual abstracts; the verified bibliography; frozen
finite-field witnesses; exact affine and boundary receipts; the uniform
boundary-squarefreeness proof and referee repair; the portable Jacobian
verifier; mutation controls; provenance, claim-status, citation, originality,
and assurance records; licensing information; CI configuration; build
instructions; and the complete manifest.

The explanatory cover, Open Graph card, transcript, audio briefing, and video
thumbnail belong to the Evidence Press presentation layer. They are not
mathematical evidence.
