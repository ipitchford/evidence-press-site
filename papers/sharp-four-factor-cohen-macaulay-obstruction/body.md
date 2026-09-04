## Summary

An AIM problem asks whether a Cohen–Macaulay union of Schubert varieties must
be able to deform to an irreducible variety. This anonymous, unrefereed
candidate gives a sharp negative answer for coordinate surfaces in products of
projective lines.

Represent a union by a graph $G$. An edge $ij$ selects the surface on which
the $i$th and $j$th coordinates can vary and all other coordinates are fixed.
The candidate proves:

- the union is Cohen–Macaulay exactly when the active graph is connected;
- it deforms inside the same product to a geometrically integral surface
  exactly when the graph is complete multipartite.

These two conditions first separate for the path

$$
1\mathbin{-}2\mathbin{-}3\mathbin{-}4.
$$

Its three edges give three Schubert surfaces in $(\mathbf P^1)^4$. Their union
is reduced, pure and Cohen–Macaulay, but has no integral deformation of the
stated kind. Four active factors and three components are both minimal.

## Summary for specialists

Fix $0=[1:0]$ in each factor of
$P_n=(\mathbf P^1_k)^n$, where $k$ is algebraically closed. For a nonempty
simple graph $G$, let

$$
Y_G=\bigcup_{ij\in E(G)}X_{\{i,j\}},
$$

where $X_{\{i,j\}}$ is the coordinate Schubert surface on which precisely
coordinates $i$ and $j$ vary. Connectivity is evaluated on the active
vertices; inactive factors become matroid loops.

The theorem candidate states that $Y_G$ is Cohen–Macaulay if and only if $G$
is connected, while $Y_G$ has an embedded flat projective deformation with
geometrically integral generic fibre if and only if $G$ is complete
multipartite. Both statements are characteristic-free.

For $G=P_4$ with edge set $\{12,23,34\}$, basis exchange fails between
$B_1=\{1,2\}$ and $B_2=\{3,4\}$. The absent replacements $\{1,3\}$ and
$\{1,4\}$ obstruct an integral generic fibre. Connected graphs on at most
three active vertices, and connected graphs with fewer than three edges, are
complete multipartite, proving both minimality statements.

## Technical account

Give the $i$th factor coordinates $[x_i:y_i]$, with $y_i=0$ at the fixed
Schubert point. The Cox ring is

$$
S=k[x_1,y_1,\ldots,x_n,y_n],
$$

and the union has ideal

$$
I(Y_G)=I_GS+(y_\ell:\ell\text{ inactive}),
$$

where $I_G$ is the Stanley–Reisner ideal of the graph viewed as a pure
one-dimensional simplicial complex. Thus the Cox quotient is a polynomial
extension of the graph face ring. Reisner's criterion then says that it is
Cohen–Macaulay exactly when the active graph is connected. The paper spells
out the affine-chart Laurent-extension step connecting the Cox computation to
the projective scheme.

The dimension-indexed multidegrees of $Y_G$ are exactly

$$
\operatorname{MSupp}(Y_G)=\{e_i+e_j:ij\in E(G)\}.
$$

Multidegrees remain constant in an embedded flat projective family. The
multidegree support of an integral multiprojective variety is a discrete
algebraic polymatroid. Because every displayed vector is zero-one of weight
two, the support must be the basis set of a rank-two matroid. After loops are
deleted, the graph of two-element bases of a rank-two matroid is exactly a
complete multipartite graph: its parts are the parallel classes.

The converse is constructive. For the parts $C_1,\ldots,C_r$ of a complete
multipartite graph, choose pairwise nonproportional vectors in $k^2$ and use
the corresponding linear forms to map $\mathbf A^2$ into $(\mathbf P^1)^n$.
Cross-part projections are birational and same-part projections have dimension
at most one, so the closure is an integral multiplicity-free surface with
precisely the desired multidegrees. Brion's multiplicity-free degeneration
theorem, in the explicit scheme-theoretic form also supplied by
Caminata–Cid-Ruiz–Conca, degenerates it to the exact reduced coordinate union.

For the sharp path, the Cox ideal is

$$
(y_3,y_4)\cap(y_1,y_4)\cap(y_1,y_2)
=(y_1y_3,y_1y_4,y_2y_4).
$$

Its generators are the maximal minors of an explicit $3\times2$
Hilbert–Burch matrix. The quotient has depth and dimension six, supplying a
second exact check of Cohen–Macaulayness in the minimal example.

## Evidence, assurance and limitations

The mathematical proof is carried by the seven-page manuscript. The immutable
package adds an exact finite certificate for the four-factor ideal,
Hilbert–Burch minors, basis-exchange failure and all smaller graph cases.
Python replays the certificate in ordinary and optimized modes and must reject
three deliberate corruptions. Macaulay2 separately recomputes the ideal,
dimension, depth and projective dimension.

The tagged GitHub prerelease and Zenodo record expose byte-identical copies of
the PDF, complete ZIP and checksum sidecar. Public GitHub Actions checks the
manifest, both Python versions, hostile controls, durable Macaulay2 record and
the full ordered PDF prose stream. The release workstation additionally ran a
fresh Macaulay2 replay and exact byte-for-byte PDF-text comparison.

These checks do not prove the cited geometric theorems, independently validate
their application, or replace the written argument. Python and Macaulay2 are
producer-controlled. The supplied review, five internal role reports and one
confirmation are producer-coordinated editorial evidence, not authenticated
external specialist review or journal peer review.

The full AIM problem remains open outside coordinate surface unions in
$(\mathbf P^1)^n$. No higher-dimensional classification or result for arbitrary
flag varieties is claimed. A targeted search found no exact collision, but
novelty remains candidate-only and historical priority is unestablished.

## Relationship to earlier work

Ardila and Boocher study closures of linear spaces in products of projective
lines, with matroid-controlled multidegrees and Cohen–Macaulay initial ideals.
Their dimension-two construction supplies the closest realization precedent.
Their convention is complementary: codimension-indexed bases of rank $n-2$
become the rank-two bases used here after taking complements, or equivalently
duals.

Castillo, Cid-Ruiz, Li, Montaño and Zhang prove the general polymatroidality of
multidegree support and give a twelve-factor Cohen–Macaulay support that is not
a polymatroid. Brion supplies the multiplicity-free degeneration theorem, and
Caminata, Cid-Ruiz and Conca give the explicit reduced coordinate-prime form
used in the proof. Reisner supplies the graph face-ring criterion.

The candidate contribution is the exact rank-two specialization: connectivity
and complete multipartiteness become the competing graph conditions, the
four-vertex path is the first obstruction, and both factor and component
minimality are proved. This positioning narrows the originality claim; it does
not establish priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraic geometers | A complete coordinate-surface answer and a small obstruction to a natural converse | The full AIM classification remains open |
| Commutative algebraists | A transparent Stanley–Reisner and Hilbert–Burch model | Cox-ring and projective-scheme Cohen–Macaulayness are connected through an explicit chart argument |
| Matroid theorists | A sharp rank-two meeting point between basis support and multipartite graphs | Multidegree support is necessary; the converse also needs an integral realization and degeneration theorem |
| Computational reviewers | Small Python and Macaulay2 checks with hostile controls | Both implementations remain producer-controlled |
| Formalizers | A compact chain from graph topology to projective degeneration | Imported geometric theorems and convention changes must be formalized explicitly |
| Interested readers | A four-vertex example showing why one good singularity property need not force deformability | Candidate publication is not field consensus |

## Why the problem matters

Degeneration is a central way to replace a difficult variety by a combinatorial
union while preserving enough information to compute. Brion's theorem says
that a multiplicity-free integral variety can degenerate to a reduced
Cohen–Macaulay Schubert union. The AIM question asks how much of that implication
can be reversed.

The surface classification identifies the missing condition exactly in one
natural testbed. Connectivity controls local algebra, while matroid basis
exchange controls which multidegree supports can belong to an integral generic
fibre. The four-vertex path is connected but violates the second condition.
That separation turns a broad deformation question into a small reusable
obstruction and identifies where higher-dimensional work must go beyond graph
connectivity.

## How to inspect or reproduce the recorded checks

Use immutable tag `v0.1.0-candidate` or version DOI
`10.5281/zenodo.22304827`, not moving `main`.

```sh
python3 verify_bundle.py
```

For component diagnosis:

```sh
python3 verify.py certificate.json
python3 -O verify.py certificate.json
python3 test_verify.py
M2 --script verify.m2
```

The composite command also checks complete manifest coverage and exact local
agreement between the PDF's extracted text and `paper.txt`. The public Linux
workflow uses `check_pdf_text_portable.py` because Poppler versions can change
reading order inside displayed formulas; it still compares the complete
ordered prose-token stream.

A successful run checks package integrity and the encoded finite consequences.
It does not independently prove the universal graph classification or cited
geometric bridge.

## The most valuable next projects

1. Reconstruct the Cox-ring, multidegree and degeneration arguments under
   authenticated unaffiliated algebraic-geometry review.
2. Formalize the coordinate-surface classification and the rank-two matroid
   equivalence in a proof assistant.
3. Classify coordinate Schubert unions of dimension at least three, where
   higher-dimensional Cohen–Macaulay complexes and polymatroids replace graphs.
4. Test analogous sufficiency criteria in flag varieties beyond products of
   projective lines.
5. Conduct a broader specialist novelty and priority review, including
   institutional mathematical databases.

## What is in the evidence package

The ZIP contains the DOI-bearing PDF and source, aligned Markdown, exact
certificate, Python and Macaulay2 replay, hostile controls, source and citation
audits, bounded novelty report, public response matrix, internal editorial
reports, licences, environment declaration and complete manifest. The private
supplied review is deliberately excluded because redistribution rights were not
established; its SHA-256 and an original response matrix are public.

The frozen ZIP is 395,619 bytes with SHA-256
`07d8c1e2f51a229a8cb52869ed4048e529a196824a078f4d4e253f832ef90108`.
The version DOI is the citation target. Any mathematical correction should be
released as a versioned successor rather than silently replacing this
candidate.
