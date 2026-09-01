## Summary

Take a closed hyperbolic surface and cut it along enough disjoint curves to
leave a connected sphere with holes. A fixed normal cover then arranges copies
of this cut-open surface like the vertices of a nonabelian free group.

This anonymous, unrefereed candidate argues that the cover is always
uniformised by an infinitely generated Fuchsian group of the first kind. Its
critical exponent is below $1$ for every marked compact-base metric. When all
cut curves are pinched to a common small length $\ell$, the exponent approaches
$1$ from below with

$$
1-\delta(\Gamma_\ell)=O_g(\ell).
$$

It therefore assumes infinitely many values inside one all-Fuchsian
quasiconformal deformation family.

The historical boundary matters. Astala and Zinsmeister (1995) appear already
to answer the existential AIM question under a broad quasi-Fuchsian
group-deformation reading. The present claim is an all-Fuchsian strengthening
and a direct solution candidate only under the reduced surface-based reading.
It is not presented as the first solution.

## Why the problem matters

The critical exponent measures exponential orbit growth. For finitely
generated Fuchsian groups it is closely tied to the geometry of the limit set,
but infinitely generated first-kind groups can have the entire boundary circle
as limit set while still having exponent below $1$.

AIM Problem 4.3 asks whether the exponent can vary within one reduced
quasiconformal Teichmuller space. An all-Fuchsian answer is especially sharp:
the variation occurs while every group continues to preserve a hyperbolic
plane, rather than by moving into three-dimensional quasi-Fuchsian geometry.

## The exact theorem candidate

For every integer $g\ge 2$, choose a geometric symplectic basis
$(a_i,b_i)$ of a closed genus-$g$ surface so that the $b_i$ form a disjoint
cut system. Define

$$
q:\pi_1(S_g)\longrightarrow F_g,
\qquad q(a_i)=x_i,\quad q(b_i)=1,
\qquad K=\ker q.
$$

For a marked closed hyperbolic metric $m$, let $\rho_m$ be its Fuchsian
holonomy and set $\Gamma_m=\rho_m(K)$. The candidate theorem states:

- every $\Gamma_m$ is infinitely generated and of the first kind;
- the marked covers give points in one reduced surface-based space
  $T_{qc}^{\mathrm{red}}(X_0)$ and, by reflected sphere extensions, in the
  all-Fuchsian locus of the AIM group space $T_{qc}(\Gamma_0)$;
- $\delta(\Gamma_m)<1$ for every marked compact-base metric;
- along simultaneous pinching of all $b_i$ to length $\ell$, for sufficiently
  small $\ell$,

$$
\frac12<\delta(\Gamma_\ell)<1,
\qquad 1-\delta(\Gamma_\ell)=O_g(\ell),
\qquad \delta(\Gamma_\ell)\to1.
$$

No monotonicity, exact exponent formula, global identification of deformation
spaces, injective parametrisation, or arbitrary quasi-Fuchsian theorem is
claimed. The value $\ell=0$ is a boundary degeneration, not a point of the
family.

## How the construction works

The epimorphism $q$ makes the cover regular with deck group $F_g$. A nontrivial
normal subgroup of the cocompact surface lattice has the full boundary circle
as limit set, so $\Gamma_m$ is of the first kind. If it were finitely
generated, absence of parabolics would make it convex cocompact; a full limit
set would then force a compact infinite-sheeted cover, a contradiction.

Marked quasiconformal maps between compact base surfaces lift equivariantly to
the fixed kernel. Reflection extends the lifted disk maps to sphere maps, which
places the resulting group points in the all-Fuchsian locus of the AIM space.
Marked Möbius equivalence preserves the critical exponent.

Dougall and Sharp's normal-subgroup theorem applies because the ambient
surface group is convex cocompact, the subgroup is normal, and the quotient
$F_g$ is nonamenable. It gives the strict inequality
$\delta(\Gamma_m)<1$ at every compact-base metric.

## The fixed-width pinching calculation

After cutting along the $b_i$, copies of one compact cell are indexed by
$F_g$. A collar about a cut curve of length $\ell$ has half-width tending to
infinity as $\ell\to0$. On the $2g$ half-collars adjacent to one selected cell,
use a function that rises linearly from $0$ to $1$ across width exactly $1$ and
then remains $1$ on the rest of that cell.

The total Dirichlet energy is

$$
E_\ell=2g\,\ell\sinh(1),
$$

while the plateau area is at least

$$
D_\ell=4\pi(g-1)-2g\,\ell\sinh(1).
$$

For small $\ell$, the denominator stays bounded below and the Rayleigh
quotient is $O_g(\ell)$. Sullivan's bottom-of-spectrum formula then converts
this into $1-\delta=O_g(\ell)$. Combined with the strict inequality below one,
convergence rules out a finite set of exponent values.

## What was checked and replayed

The release package performs deterministic producer-side checks. It does not
claim that finite computation proves the universal theorem.

- Forty-two collar-model samples check the exact energy, plateau, Rayleigh and
  spectral-conversion formulas.
- Sixteen unit and hostile-mutation tests reject wrong collar counts,
  nonpositive lengths, genus one, amenable deck rank, extra collars and broken
  seam conditions, in normal and optimized Python modes.
- Source-parity checks bind theorem-critical statements across LaTeX,
  Markdown and the claim ledger.
- PDF gates check required reader text, raw-TeX leakage, qpdf structure and a
  complete normalized text digest.
- A 55-file manifest and an outer checksum bind the complete public archive;
  a clean extraction passes the full read-only replay.
- Public GitHub Actions rebuild the reader PDF from source before repeating the
  normal and optimized replay.

## Evidence and assurance boundary

The written manuscript is the evidence for the general mathematical claims.
The finite program checks explicit identities, implementation invariants and
representative samples; it does not replace the proof or verify the imported
theorems.

The supplied review was actioned point by point. Five producer-coordinated
editorial roles initially held the package for repair. After the deformation-
space bridge, closest-prior-work positioning, exact theorem-hypothesis maps,
portable build, accessibility language and release receipts were repaired, one
exact-archive domain confirmation returned `PASS_WITH_NOTES` at reported
confidence $0.94$.

Those are internal editorial records, not authenticated unaffiliated
specialist review. Public availability, deterministic replay, independent
rerun, independent reimplementation, formal verification, specialist review,
editorial peer review, novelty and historical priority remain distinct.

## Limitations and what remains open

- Under a broad group-deformation reading, the existential AIM question
  appears already affirmative through Astala and Zinsmeister's quasi-Fuchsian
  family.
- The exact all-Fuchsian construction may be specialist folklore or an
  unstated consequence of known results; the bounded search cannot establish
  novelty or priority.
- No monotonicity or exact formula for $\delta(\Gamma_\ell)$ is proved.
- The compact-base family is not claimed to embed injectively into the
  infinite-type Teichmuller space.
- The reflected extension supplies all-Fuchsian points; it does not prove a
  theorem for arbitrary quasi-Fuchsian deformations.
- No unaffiliated reconstruction, proof-assistant formalisation, authenticated
  external specialist review or journal peer review is attached.
- The PDF is untagged. This structured web page and `paper.md` provide text
  alternatives, but mathematical notation is linearised rather than encoded
  with full semantic accessibility.

## Who should care

The release is aimed at researchers in Fuchsian and Kleinian groups,
hyperbolic surfaces, regular covers, spectral geometry and infinite-type
Teichmuller theory. It may also be useful to reviewers studying how a short
bridge among classical theorems should expose its interpretation, dependency
and priority risks before candidate publication.

## Where to inspect and replay

Start with the PDF for the complete proof. In the archive, `CLAIM_SCOPE.md`
states the exact theorem and exclusions, `SOURCES.md` maps every imported
theorem to its use, `NOVELTY_REPORT.md` records the broad-reading precedent,
and `reviews/internal/` preserves the role-separated editorial trail. Run
`bash run_all.sh` from the repository root for the finite replay and package
gates.

The GitHub Actions run linked in the assurance panel is the public clean-
checkout reconstruction. `MANIFEST.sha256` inventories the 55 non-circular
payload files, while release-level `SHA256SUMS` binds the downloadable ZIP and
PDF.

## Next work

The highest-value next step is an unaffiliated mathematical reconstruction of
the reflected group-space bridge and the fixed-width Rayleigh argument. A
Fuchsian-group specialist should then assess the precise AIM interpretation
and closest prior art. Further mathematical work could seek monotonicity or a
sharper asymptotic for the exponent, while a formalisation should keep the
elementary collar calculation separate from the imported normal-subgroup and
spectrum theorems.

## Paper, archive, and package map

- **Paper:** the canonical 9-page PDF contains the complete argument,
  hypothesis maps, positioning and bibliography.
- **Archive:** the ZIP contains source, accessible text, structured claims,
  reviews, verification programs, receipts, licences and the complete
  manifest.
- **Repository:** the annotated candidate tag fixes the reviewed source and
  hosted replay workflow.
- **Zenodo:** the version DOI archives the same ZIP, PDF and checksum sidecar.
- **Licensing:** original prose and data are CC0-1.0; original code, tests and
  workflows are MIT; third-party sources and the bundled OFL font are credited
  but not relicensed.
