## Summary

Take some of the integers from 1 to 37 and colour each chosen number red or
blue. A set is called four-term-AP Ramsey if every such colouring contains four
equally spaced chosen numbers of one colour.

Ronald Graham exhibited a 27-number set with this property. This anonymous,
unrefereed computer-assisted candidate proves that no set of 26 numbers inside
the same interval can work. In symbols,

$$
v_{2,4}([37])=27.
$$

The diameter limit is essential. This finite theorem does not determine the
minimum over all finite integer sets, usually written $W^*(4)$, and it does not
answer the two asymptotic questions in AIM Problem 1.9.

## Summary for specialists

For $S\subseteq[37]$, let $H_4(S)$ be the 4-uniform hypergraph whose edges are
the nonconstant four-term arithmetic progressions contained in $S$. The release
establishes that the least $|S|$ for which $H_4(S)$ fails Property B is 27.

The lower certificate is a 1,579-variable, 5,761-clause CNF. Sinz counters
enforce $|S|=26$; indicator variables encode the 210 four-term progressions in
$[37]$; and 2,012 audited colouring cuts impose necessary conditions on any
non-2-colourable selected set. A retained DRAT refutation proves the resulting
formula unsatisfiable. The upper certificate directly encodes the 98
progressions in Graham's 27-point set as a 27-variable, 196-clause
2-colourability instance and supplies a separate DRAT refutation.

Every cut and every clause is semantically reconstructed before proof checking.
The release also checks 28 explicit positive colourings, exhausts a small
512-subset oracle, recomputes a distinct 21,329-candidate replacement
neighbourhood, and requires fifteen hostile mutations to fail closed.

## Technical account

For a finite integer set $X$, write $\mathrm{AP}_4(X)$ for the hypergraph with
edges

$$
\{a,a+d,a+2d,a+3d\}\subseteq X,\qquad d>0.
$$

The set $X$ is four-term-AP Ramsey when every map $X\to\{0,1\}$ is constant on
at least one edge. Define

$$
v_{2,4}([N])=\min\{|X|:X\subseteq\{1,\ldots,N\}\text{ is four-term-AP Ramsey}\}.
$$

For the lower bound, one Boolean variable $y_i$ records whether $i\in[37]$ is
selected, and sequential counters require exactly 26 selected points. For each
four-term progression $e$, a variable $z_e$ is constrained by

$$
z_e\longleftrightarrow\bigwedge_{i\in e}y_i.
$$

Given a complete red-blue colouring $c$ of $[37]$, let $M(c)$ be its set of
monochromatic progressions. Any Ramsey set selected from $[37]$ must contain at
least one edge of $M(c)$, because a colouring of the selected set extends to the
whole interval. The clause

$$
\bigvee_{e\in M(c)}z_e
$$

is therefore necessary for every candidate. Crucially, even a subset of valid
colouring cuts remains a sound necessary-condition system: if that system is
unsatisfiable, no 26-point Ramsey set exists. The released 2,012-cut master
formula is unsatisfiable by its checked DRAT proof.

For the upper bound, the displayed set

$$
\{1,4,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,30,31,34,37\}
$$

has 98 four-term progressions. Its direct 196-clause colourability CNF has a
separate checked DRAT refutation, so the set is Ramsey. Monotonicity rules out
all smaller subsets once exact size 26 has been excluded, proving the equality.

If a 26-point Ramsey set had primitive affine diameter at most 36, translation
and division by the gcd of its differences would place an equivalent set in
$[37]$. This gives the title's equivalent formulation.

## Evidence, assurance and limitations

The mathematical bridge is written in the seven-page paper. The package then
checks the exact finite objects: all AP edges, counters, indicator equivalences,
colouring cuts, two DRAT proofs, explicit satisfying colourings, the small
oracle and the replacement neighbourhood. Ordinary and optimized Python modes
must agree. Negative controls alter targets, clauses, cuts, hashes, proofs,
witnesses, manifests and generated data, and all fifteen are required to fail.

The tagged GitHub release and Zenodo record expose the same archive, PDF and
checksum sidecar. Public GitHub Actions reconstructs and checks the candidate
on a clean runner. These facts establish availability, package integrity and
producer-side replay; they do not constitute unaffiliated reconstruction,
formal verification of the source-to-CNF theorem, authenticated external
specialist review or editorial peer review.

The separate 21,329-candidate replacement-neighbourhood calculation is a
structural local search, not part of the proof of $v_{2,4}([37])=27$ and not a
classification of arbitrary 26-point sets. A targeted literature and GitHub
search found no exact prior statement of the bounded equality, but novelty and
historical priority remain only partially assessed.

## Who should care and why

Ramsey theorists get an exact finite boundary around the classical 27-point
construction and a sharply stated remaining global problem. SAT and automated
reasoning researchers get a compact proof-carrying benchmark in which semantic
translation, CNF proof checking and hostile controls can be audited separately.
Researchers studying sparse van der Waerden sets get a reusable normalized
search object rather than a numerical hunch about one construction.

The release may also be useful as a teaching example: the reason a finite list
of colouring cuts can prove a universal exclusion is short, while the scale of
the exhaustive search is handled by an independently checkable logical proof.

## Why the problem matters

Ordinary van der Waerden numbers ask how long an interval must be before every
two-colouring contains an arithmetic progression. The sparse version asks how
few carefully chosen integers can force the same phenomenon. That change from
interval length to set cardinality creates a difficult global search over both
the set and all of its colourings.

The equality here resolves the natural interval containing Graham's best-known
27-point construction. It narrows the route to $W^*(4)$: a smaller witness must
have primitive diameter greater than 36, while a global lower bound must control
all such larger diameters. The theorem does not supply that missing global
argument.

## How to inspect or reproduce the result

Read the PDF first for the definitions, soundness lemmas and theorem. In the
archive, `CLAIMS.json` fixes the claim ceiling, `certificate_N37_k26/` contains
the lower CNF, 2,012 colouring cuts and DRAT proof, and
`certificate_graham27/` contains the separate upper certificate.

Run `./scripts/bootstrap_tools.sh` followed by `./scripts/replay.sh` from the
tagged repository. The bootstrap builds the recorded upstream Kissat, CaDiCaL
and DRAT-trim commits. Replay reconstructs the formulas before solver calls,
checks both proofs, validates the positive colourings, runs the direct oracle,
recomputes the structural neighbourhood and exercises all negative controls.
The public GitHub Actions run is the clean-checkout reference. `SHA256SUMS`
binds the downloadable ZIP and PDF, and the Zenodo DOI archives the same bytes.

## Most valuable next projects

1. Build an unaffiliated source-to-CNF translator and reproduce both
   certificates in a materially separate software stack.
2. Formalize the exact-cardinality, edge-indicator and colouring-cut soundness
   lemmas, then connect the checked CNF theorem to a proof assistant.
3. Search for a certified 26-point witness at primitive diameter greater than
   36, with canonical affine normalization and symmetry breaking stated before
   the search.
4. Develop structural reductions that cover whole infinite diameter families,
   rather than only the declared replacement neighbourhood.
5. Expand the prior-art audit with specialist knowledge of older sparse van der
   Waerden and Property B computations.

## Paper, archive and package map

- **Paper:** the canonical seven-page PDF gives the full finite theorem and
  source-to-encoding argument.
- **Archive:** the ZIP contains both CNFs and DRAT proofs, audited cut data,
  verifiers, tests, hostile controls, receipts, review records and a complete
  manifest.
- **Repository:** the annotated `v0.1.0-candidate` tag fixes the reviewed source
  and public replay workflow.
- **Zenodo:** version DOI `10.5281/zenodo.22286322` preserves the same ZIP, PDF
  and checksum sidecar.
- **Identity:** the candidate archive SHA-256 is
  `b1da17612c97f3e932ba06a1e0e93696c6fa05cd5696400dc0ee11d545d8f1d8`.
- **Licensing:** original prose, metadata and data are CC0 1.0; original code is
  MIT; the supplied review is retained as `NOASSERTION` and is not relicensed.
