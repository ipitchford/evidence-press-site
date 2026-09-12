## Summary

Two alternating forms can constrain a whole family of subspaces. This paper
asks whether that family is smooth everywhere, or whether some choices are
singular. The candidate gives an exact answer using the standard building
blocks of the pair of forms: the Jordan pencil blocks must all have dimension
two. Kronecker blocks impose no additional restriction.

This is a proof candidate for the smoothness question, not a solution of the
entire orbit-classification programme. The proposed criterion and the
single-block singularity were known ingredients. External validation and
historical priority remain unestablished.

## Summary for specialists

Let $A,B$ be alternating forms on a finite-dimensional complex space $V$,
and let $r$ be the maximum pencil rank. Put $d=\dim V-r/2$.
Inside $\operatorname{Gr}(d,V)$, take the reduced variety

$$X=\{L:A|_L=B|_L=0\}_{\mathrm{red}}.$$

The candidate proves that $X$ is smooth if and only if every Jordan pencil
block has dimension two, with arbitrary Kronecker blocks. In that case

$$X\simeq\prod_\lambda\operatorname{LG}(m_\lambda,2m_\lambda),$$

where $m_\lambda$ counts dimension-two pencil blocks at the eigenvalue.
Its dimension is $\sum_\lambda m_\lambda(m_\lambda+1)/2$.
For real pencils the corresponding criterion is semisimplicity after removal
of the core, both for algebraic smoothness and for the entire real locus to
be an embedded smooth manifold.

## Technical account

The standard core reduction removes Kronecker contributions without changing
the reduced parameter variety. Choosing a nondegenerate combination
$\omega=B+\tau A$ leaves both original generators recoverable. The equation
$A(u,v)=\omega(Pu,v)$ turns simultaneous isotropy into invariance under a
self-adjoint recursion operator $P$.

Semisimplicity gives the product of ordinary Lagrangian Grassmannians. For a
longer block, an explicit quotient basis yields the local chart

$$\mathbb A^{n-2}\times\{a^n+cz=0\},$$

where $n\ge2$ and the surface lies in $\mathbb A^3$ with coordinates $a,c,z$.

Polynomial division and regular inverse maps establish this as a chart of
the reduced variety. At its origin the tangent dimension exceeds the local
dimension. Crucially, an involution separating this block from the rest makes
the bad block a factor of a fixed locus. Fixed loci of involutions on smooth
varieties are smooth in characteristic zero, producing the contradiction.
The argument does not identify every mixed-block ambient singularity with
the displayed surface.

## Evidence, assurance and limitations

The paper contains a universal written proof. Exact symbolic replay covers
seven block lengths and 28 reconstructed invariant Lagrangians. Three
semantic corruptions test the verifier's rejection behaviour. Normal and
optimized Python and both traceback-colour settings are checked. These
finite producer checks supplement the proof; they do not establish it for
all dimensions.

Internal model-assisted editorial review is separate from unaffiliated
specialist review, independent reproduction and formal verification. None
of those stronger dimensions is established. The result concerns the
reduced variety, not the original incidence scheme, and does not classify
all orbits or the full mixed-block singular locus.
Nor does fixed-pencil smoothness imply smooth dependence on a varying pencil
or supply an involutive distribution or integrable foliation.

## Relationship to earlier work

Bolsinov and coauthors posed the broader smoothness and orbit questions.
Kozlov developed the structural reductions and proposed the exact criterion.
The one-block model belongs to classical affine-Schubert geometry, including
the Kleinian singularities studied by Malkin, Ostrik and Vybornov. The candidate
supplies an explicit coordinate calculation and a fixed-locus argument for
arbitrary pencils. Pappas--Zhou's broader affine-Schubert theorem requires an
absolutely special vertex; no automatic mixed-pencil identification is used.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraic geometers | A short obstruction and an explicit reduced chart. | The mixed singular locus and incidence schemes remain separate. |
| Integrable-systems researchers | A sharp linear parameter-space criterion. | It does not imply nonlinear or global integrability. |
| Research agents and reviewers | Portable proof, claim index and exact replay. | Producer checks are not independent validation. |

## Why the problem matters

A smooth parameter space can be studied with local manifold tools throughout.
The criterion pinpoints exactly which part of a pencil prevents that approach.
Repeated eigenvalues alone are harmless; nontrivial Jordan chains are the
obstruction. This makes the distinction structural rather than a collection
of low-dimensional examples.

## How to inspect or reproduce the recorded checks

Read the manuscript's Sections 2--5, then follow README.md in the archive.
Install the pinned requirements and run `python3 verify.py`, its `-O`
variant, and the negative-control commands. Expected output reports all
seven sizes, 28 reconstructions and rejection of three corruptions. The
manifest and replay receipt identify the exact package and tested environment.

## The most valuable next projects

External proof scrutiny is the first assurance step. Mathematically, the
next questions are the full mixed-block singular locus, incidence-scheme
reducedness, and the separate orbit-classification programme. None is counted
as a completed consequence of this paper.

## What is in the evidence package

The package contains the PDF and LaTeX source, an accessible proof note,
claim index, prior-work comparison, review-response matrix, verification and
packaging code, pinned dependencies, measured replay receipt, digest-bound
PDF inspection record and SHA-256 manifest. Original prose is CC0 and
original code is MIT; cited papers and supplied third-party reviews are not
relicensed or bundled.
