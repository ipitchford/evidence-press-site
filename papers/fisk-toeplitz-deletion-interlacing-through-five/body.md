## Summary

Steve Fisk asked whether a polynomial transformation built from $3\times3$
Toeplitz minors always keeps all of its roots real and negative. The complete
question remains open.

This anonymous, unrefereed candidate proves a finite part. Start with at most
five positive numbers. Build the transformed polynomial from their rectangular
Schur polynomials. It has only simple negative roots. Remove any one of the
input numbers, and the smaller polynomial's roots sit strictly between the
roots of the larger one.

The finite cutoff matters. The paper proves the statement through five positive
entries. It does not prove the all-degree conjecture and does not cover inputs
on the zero boundary.

## The central theorem

For a positive alphabet $\rho=(\rho_1,\ldots,\rho_n)$, repetitions allowed,
define

$$
F_\rho(t)=\sum_{k=0}^{n}s_{(3^k)}(\rho)t^k,
$$

where $s_{(3^k)}$ is the Schur polynomial indexed by the $3\times k$
rectangle.

The candidate theorem has two parts.

1. For $0\leq n\leq5$, $F_\rho$ has exactly $n$ simple negative roots.
2. For $2\leq n\leq5$, deleting any chosen entry of $\rho$ gives a polynomial
   that strictly interlaces $F_\rho$. The larger polynomial supplies the two
   outer roots.

Because Schur polynomials are symmetric, an arbitrary chosen deletion can be
written as $\rho=(X,y)$, with $y$ the deleted entry. The proof therefore needs
one deletion calculation, not five separately labelled cases.

## How the mechanism works

Put $f=F_{(X,y)}$ and $g=F_X$. Their signed Bezoutian gives a real symmetric
matrix $B(f,g)$. Under the convention fixed in the paper, strict interlacing is
equivalent to positive definiteness of this matrix once the degrees and leading
signs are accounted for.

Sylvester's criterion reduces positive definiteness to positivity of every
leading principal minor. The package expands each required minor as a
polynomial in the positive alphabet entries. If every coefficient is positive,
then the minor is strictly positive throughout the positive orthant.

For two, three and four entries, the package recomputes the minors directly.
For five entries, Singular emits complete exponent-coefficient streams. The
five streams contain respectively

$$
15,\quad 771,\quad 8{,}790,\quad 29{,}460,\quad 22{,}156
$$

positive terms, for a total of $61{,}192$. No sampled evaluation substitutes
for those coefficient lists.

## What was checked and replayed

- A fresh run regenerates every degree-five stream and byte-compares the
  deterministic sources, logs, compressed terms and certificate index.
- A standard-library verifier checks hashes, coefficient signs, declared
  counts and order-specific modular evaluations.
- Degrees two through four are recomputed directly with exact symbolic
  arithmetic.
- Fixed Schur and Vandermonde spot checks audit the semantic bridge into the
  encoded polynomial family.
- One mutation makes a coefficient negative; another keeps it positive but
  changes its value. Both must fail.
- A fresh-archive route rejects unsafe or unexpected inventory and repeats the
  mathematical replay after extraction.
- Public GitHub Actions passes the same release contract on a clean runner.
- Independent downloads from GitHub and Zenodo reproduce the frozen archive,
  PDF and checksum hashes exactly.

The supplied Major Revision review was answered point by point. A
producer-coordinated five-role internal review and one exact-byte confirmation
ended at `PASS_WITH_NOTES`, with no residual or new P0/P1 findings. Those are
internal editorial controls, not external peer review.

## Where it stops and what remains open

- Fisk's all-degree $3\times3$ Toeplitz-minor conjecture remains open.
- Degree six is certified only for the first three leading Bezout minors.
- Positive coefficient expansions are a sufficient route; their failure at a
  later degree would not by itself refute the parent conjecture.
- Zero entries, degree drops, multiple roots and the limiting arguments needed
  on the closed boundary are not claimed.
- The exhaustive small grid and seeded higher-degree search found no
  counterexample, but are reconnaissance rather than theorem evidence.
- No unaffiliated rerun, independent reimplementation, formal proof, external
  specialist review or journal peer review has occurred.
- The targeted literature and GitHub search does not establish novelty,
  historical priority or the absence of differently phrased work.

## Who should care, and why

Researchers in real-rooted polynomials and total positivity get a concrete
finite theorem and an executable all-degree bottleneck. Symmetric-function
researchers get complete rectangular-Schur coefficient data rather than only
numeric root plots. Computer-assisted mathematics reviewers get a small
example in which the generator, verifier, semantic bridge, hostile mutations,
archive inventory and public readback can be inspected separately.

The result is also a useful handoff for anyone exploring characteristic-
polynomial, matching-polynomial, network or total-positivity representations:
such a representation could replace the rapidly growing coefficient expansion
with a structural all-degree theorem.

## Where to inspect and replay

Begin with the five-page PDF for the theorem and proof. In the archive,
`certificates/degree5/` contains the complete term streams, generated Singular
inputs, raw logs and verification receipt. `replay.py` is the main fresh
reproduction route; `CLAIM_LEDGER.json` keeps the finite theorem, searches,
failed routes and open parent conjecture separate.

Run `./replay.sh` from a tagged checkout with the versions listed in
`ENVIRONMENT.txt`. The GitHub Actions run is the public clean-checkout replay.
`SHA256SUMS` binds the release archive and PDF, and the Zenodo DOI distributes
the same bytes.

## Next research directions

The nearest exact target is to finish orders four through six of the degree-six
Bezout calculation, preferably with an independently authored streaming
implementation. A positive result should be mined for a recurrence, network or
sum-of-products structure rather than treated as a reason to extrapolate.

In parallel, the sign convention and classical Bezout interlacing bridge should
be reconstructed by an unaffiliated specialist and formalized independently.
The universal problem should be reopened only with an all-degree proof, an exact
positive rational counterexample, or a structural representation carrying a
proved real-zero theorem.

## Paper, archive, and package map

- **Paper:** the five-page PDF contains the finite theorem, proof bridge,
  certificate statement, assurance boundary and bibliography.
- **Archive:** the ZIP contains source, exact degree-five streams, raw logs,
  verifiers, receipts, failed routes, reviews, licenses and a complete manifest.
- **Repository:** the annotated `v0.3.0-candidate` tag fixes the green release
  source and public replay workflow.
- **Zenodo:** DOI `10.5281/zenodo.22233444` archives the same ZIP, PDF and
  checksum sidecar as GitHub.
- **Identity:** the candidate archive SHA-256 is
  `477118af1798d25dc0c8d0be264c5a8f8703852ccc1ed117a2e4d5a2a3e4e078`.
- **Licensing:** original prose, data, certificates and review records are CC0
  1.0; original code is MIT; cited third-party works retain their own terms.
