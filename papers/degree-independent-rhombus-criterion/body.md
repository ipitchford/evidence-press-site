## Summary

Rhombus inequalities compare four neighbouring coefficients in a triangular
array. A theorem of Petter Brändén says that, for a positive homogeneous
polynomial in three variables, sufficiently strong rhombus inequalities force
real stability. His published sufficient factor grows with the degree.

This anonymous, unrefereed candidate argues that the fixed factor $3$ works in
every degree. It also shows why the higher-dimensional part of the problem
cannot be answered by simply reusing the same words: three natural extensions
lead to three different boundaries, and one meaningful normalized formulation
remains open in four, five and six variables.

## Why the problem matters

Real-stable polynomials connect complex zero geometry to combinatorics,
probability and discrete convexity. A degree-independent local criterion would
turn a growing global stability test into a uniform family of small coefficient
comparisons.

The dimensional boundary matters just as much. “Rhombus log-concavity” has a
canonical triangular meaning in three variables, but no single automatic
meaning in higher dimension. A useful answer must state which extension is
being tested before claiming either success or impossibility.

## The exact theorem and higher-dimensional boundary

Let

$$
P(x,y,z)=\sum_{\alpha_1+\alpha_2+\alpha_3=d} a_\alpha
x^{\alpha_1}y^{\alpha_2}z^{\alpha_3}, \qquad a_\alpha>0.
$$

The central candidate theorem says: if every elementary hive-rhombus quotient,
with Brändén's numerator and denominator orientation, is at least $3$, then
$P$ is real-stable. The number $3$ is independent of $d$ and is not claimed to
be optimal.

The paper then separates three higher-dimensional readings.

1. **Coordinate-face control.** For every $m\ge 4$ and every prescribed finite
   factor $q$, there is a positive homogeneous quadratic whose coordinate-face
   rhombus quotients are all at least $q$ but which is not stable.
2. **Uniform strict exchange.** One precisely defined symmetrized
   one-exchange multiplicative margin greater than $1$ is inconsistent on
   positive full-support quadratics once four distinct indices occur.
3. **Normalized $M$-concavity.** This formulation is meaningful, but finite
   positive families converging to the known Fano obstruction rule out an
   unrestricted theorem from seven variables onward.

The normalized cases $m=4,5,6$ are not classified here.

## How the proof works

The ternary proof writes the logarithm of each coefficient as a fixed quadratic
baseline plus an ordinary hive. The baseline absorbs exactly one unit across
each elementary rhombus, while the residual hive extends to a concave function
on the simplex.

To compare neighbouring coefficient rows of the univariate slice
$P(1,1,z)$, products are separated by the parity of two indices. Each parity
class has an injective midpoint parametrization, so no degree-sized
multiplicity factor is introduced. The remaining penalties form two convergent
theta-type sums. At $q=3$ their elementary bounds fit strictly under the
coefficients in one quarter of a square:

$$
C_0(3)<\frac14, \qquad C_1(3)<\frac12.
$$

This yields Hutchinson's strict coefficient inequality for every interior row.
The published Brändén slice-and-boundary argument then converts the univariate
real-rootedness statement into ternary real stability.

The higher-dimensional statements use different mechanisms: a small-eigenvalue
quadratic family defeats coordinate-face control; the three pairings of four
indices contradict a strict uniform exchange margin; and a finite-positive
limit transfers the prior-art Fano non-stability obstruction to the normalized
setting from seven variables onward.

## What was checked and replayed

The release package performs deterministic producer-side checks rather than
claiming that finite computation proves the universal theorem.

- Python in normal and optimized modes replays the midpoint identities,
  theta bounds, exact rational counterexample instances, Fano distance checks
  and semantic mutations.
- C++ exactly enumerates 880 declared $M$-convex supports before running a
  bounded long-double grid scan. `NO WITNESS` from that scan is explicitly
  non-probative.
- Digest-pinned, network-disabled containers rebuild the 12-page PDF and
  reproduce exact fresh Python, PDF and architecture-specific C++ bytes.
- Concordance checks bind load-bearing statements across TeX, Markdown, DOCX
  and PDF. Inventory tests reject an extra file, a corrupted byte, an altered
  receipt and an altered generated artifact.
- Public GitHub Actions replayed the frozen commit successfully, and the ZIP,
  PDF and checksum sidecar downloaded from GitHub and Zenodo match local bytes.

## Evidence and assurance boundary

The written manuscript is the evidence for the universal mathematical claims.
The finite programs audit identities, indexing, representative exact instances
and bounded searches. They do not replace the proof.

The supplied review was actioned point by point. A producer-coordinated
five-role review and bounded confirmation reached `PASS_WITH_NOTES`. Those are
internal editorial records, not authenticated unaffiliated specialist review.
Public availability, deterministic replay, independent rerun, independent
reimplementation, formal verification, specialist review, editorial peer
review, novelty and priority remain distinct assurance dimensions.

## Limitations and what remains open

- The normalized $M$-concavity cases with four, five and six variables remain
  open.
- The constant $3$ is sufficient in the candidate proof but is not claimed
  optimal.
- The three higher-dimensional formulations do not exhaust every possible
  quantitative stability condition.
- The Fano non-stability obstruction is prior work; the release's scoped step
  is the finite-positive family and limit corollary.
- No authenticated unaffiliated reconstruction, proof-assistant formalization,
  external specialist review, journal peer review or historical-priority
  adjudication is attached.
- A bounded novelty search cannot establish that the result is new or first.

## Who should care

The release is aimed at researchers in stable and Lorentzian polynomials,
matroid half-plane properties, hives, tropical and discrete convexity, and
negative-dependence theory. It may also be useful to reviewers interested in a
compact example of how one ambiguous higher-dimensional question can be split
into separately falsifiable formulations.

## Where to inspect and replay

Start with the PDF for the complete arguments. In the archive,
`SOURCE_BRIDGE.md` maps every imported theorem to its exact use,
`CLAIMS.json` separates the five claim types, and `OPEN_PROBLEMS.md` gives an
executable handoff for the unresolved normalized dimensions. Run `run_all.sh`
from the repository root with Docker to reproduce the digest-pinned build and
stored receipts.

The GitHub Actions run linked in the assurance panel is the public clean-checkout
replay. `MANIFEST.sha256` is the complete 59-file package inventory, while the
release-level `SHA256SUMS` binds the downloadable ZIP and PDF.

## Next work

The first mathematical priority is an unaffiliated reconstruction of the parity
pairing and stability bridge. In parallel, the normalized $m=4,5,6$ cases can be
attacked through the support enumeration and coefficient-search interfaces in
`OPEN_PROBLEMS.md`. A proof-assistant development should separate the elementary
theta estimates from the imported stability-preserving steps, making the source
bridge mechanically explicit.

## Paper, archive, and package map

- **Paper:** the canonical 12-page PDF contains the complete proofs and
  bibliography.
- **Archive:** the ZIP contains source, accessible derivatives, structured
  claims, source maps, review records, verification programs, receipts,
  licenses and the complete manifest.
- **Repository:** the annotated tag fixes the reviewed source and public CI
  workflow.
- **Zenodo:** the version DOI archives the same ZIP, PDF and checksum sidecar.
- **Licensing:** original prose and data are CC0-1.0; original code, tests and
  workflows are MIT; third-party works are cited but not redistributed.
