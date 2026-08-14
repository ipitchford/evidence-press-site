## Plain-English summary

Furter's $R(3)$ asks whether a long run of cancellations in a composition of two polynomials forces both polynomials to be trivial. The universal conjecture asks this for every starting index and remains open.

This anonymous, unrefereed candidate proves the first 299 instances:

$$
R(3,n)\qquad(1\le n\le299).
$$

The proof is exact and computer assisted. Each instance is converted into a question about three explicit inverse-series coefficient polynomials. The package finds one finite field in which their only affine common zero is the origin, using the same prime across every patch of the projective calculation. A classical properness argument then transfers that empty special fibre to characteristic zero.

The result also gives Furter's corresponding length-two Polydegree closure equality for $(4,k)$ and $(k,4)$ for every $2\le k\le300$. It does not prove the general Polydegree Conjecture, the unrestricted Strong Factorial Conjecture or universal $R(3)$.

> **Candidate status:** exact finite theorem · anonymous · unrefereed · producer-side replay · no independent reconstruction, formal verification, external specialist review or editorial peer review.

## The central claim or finding

Let $g_{k,3}\in\mathbf Z[x_1,x_2,x_3]$ be the coefficient of $X^{k+1}$ in the compositional inverse of

$$
X(1+x_1X+x_2X^2+x_3X^3).
$$

The exact algebraic statement proved by the package is

$$
\sqrt{(g_{d,3},g_{d+1,3},g_{d+2,3})\mathbf Q[x_1,x_2,x_3]}
=(x_1,x_2,x_3)
\qquad(2\le d\le300).
$$

Furter's index is $n=d-1$, so this is precisely $R(3,n)$ for $1\le n\le299$. Furter's Theorem B and symmetry lemma then give the length-two Polydegree closure equality for $(4,k)$ and $(k,4)$ for $2\le k\le300$.

The Strong Factorial consequence is narrower: Edo and van den Essen identify $R(3)$ with the Strong Factorial assertion for a particular three-variable family. This finite theorem therefore proves only the corresponding starting exponents through 299 in that restricted family, not the unrestricted Strong Factorial Conjecture.

## How the result works

The quotient is graded by weights $(1,2,3)$ on $(x_1,x_2,x_3)$. If the three consecutive weighted-homogeneous generators have no point in weighted projective space over a field, their only affine common zero is the origin.

For each $d$, the computation reduces the integral coefficient polynomials modulo a selected prime $p$ and certifies emptiness on all three strata of a weighted-projective cover at that same prime. The same-prime condition matters: patchwise certificates assembled from different primes would not define one empty proper special fibre.

The coverage has two finite lanes:

| Range | Certificate architecture | Recorded scale |
|---|---|---|
| $2\le d\le49$ | complete modular colength map over all primes at most 997 | 8,064 exact degree-prime rows; 6,931 GOOD and 1,133 BAD |
| $50\le d\le300$ | deterministic prime scan with unit-ideal checks on three projective strata | 251 degrees; 2,854 attempts; 251 selected GOOD primes; largest selected prime 127 |

The proper weighted-projective zero scheme is considered over $\mathbf Z_{(p)}$. An empty special fibre has empty closed image at the closed point; therefore the generic fibre is empty. No probabilistic inference, density heuristic or mixed-prime gluing enters this transfer.

The package also proves a structural negative result. For every prime $p\ge7$, put $K_p=\lfloor(p+2)/4\rfloor$. If

$$
n\equiv-k\pmod p,\qquad 2\le k\le K_p,
$$

then $g_{n,3}$ is the zero polynomial modulo $p$. These periodic zero bands force infinitely many BAD windows for each fixed $p$, so a universal proof by one fixed GOOD prime is impossible. A finite-prime product automaton remains a live possibility.

## What is classical, and what is offered here

Furter defined $R(m,n)$, proved the equivalence of its one-map and two-map forms, and connected rigidity to length-two Polydegree closure equalities. Lewis, Perry and Straub developed the inverse-coefficient framework and verified the stronger relevant condition for $d<50$. The good-special-fibre transfer is a classical properness argument; the complete-intersection and socle tools are standard commutative algebra.

The offered contribution is the exact extension of the radical statement through $d=300$, together with the complete certificate and replay chain. It also includes the proved fixed-prime zero band, exact rational Euler-socle certificates through $d=12$, normalized-resultant data through $d=25$, calibrated negative recurrence screens and the executable Universal $R(3)$ Challenge.

The dated, formula-first public-record search found no published extension of the finite $R(3)$ window beyond the LPS range. That is a bounded publication finding, not an absolute priority ruling or a substitute for specialist literature review.

## Evidence and audit trail

The frozen Stage 0 archive contains 125 manifest entries. Its SHA-256 is

```text
4538ce575a9dc2cbb6b6b4fcd097e1858a4c9a0578e1e101ead5f2f34c7110a9
```

The terminal root receipt binds all 299 windows, the exact coverage partitions, source and runtime hashes, subordinate receipts, ordinary/optimized parity and negative controls. Its SHA-256 is

```text
889fcafed2a980b1d1ec5cbbf526f238321ddf27daef2a641dffcbb39cc26518
```

A separate fresh-extraction verifier unpacked the frozen ZIP, checked 125 manifest entries, ran the package replay and reproduced a PASS root. The public release also checks the machine-readable challenge against the same root and archive receipt.

The $d=50,\ldots,300$ lane replays through a second Singular wrapper and exact inventories, but it does not export portable sparse Nullstellensatz cofactors for all 251 new degrees. Singular remains inside that lane's trusted computing boundary. Producer-coordinated implementation diversity and cross-model review are not independent reproduction.

## What the result does not establish

- It does not prove $R(3,n)$ for any $n\ge300$ or provide monotonicity in $n$.
- It does not prove universal $R(3)$, the unrestricted Strong Factorial Conjecture or the general Polydegree Conjecture.
- It does not make the already published full $e=3$ Polydegree-column result new; this release's new headline is finite composition rigidity through $n=299$.
- It does not establish that the Singular computation has been independently reimplemented, or provide portable cofactors for every new degree.
- It does not establish proof-assistant formalisation, unaffiliated replay, external specialist review, editorial peer review or venue acceptance.
- It does not turn DOI issuance, hashes, CI, producer replay or multiple AI reviewers into theorem truth, independent assurance, absolute priority or demonstrated scientific acceleration.

## Relationship to earlier work

The LPS computation covered the relevant stronger condition for $d<50$. This release retains that earlier range and extends the radical-maximality conclusion to $d=300$ using a different large-range certificate architecture.

A separate Evidence Press candidate proves the full $e=3$ Polydegree containment column for every $d\ge2$ by a smooth-point, Fourier-limit and interval-arithmetic argument. The present finite rigidity theorem has a different main claim and proof object. Its Polydegree corollary is therefore a consequence worth recording, but not a novelty claim about that already completed column.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Polynomial-automorphism researchers | Inspect exact certificate coverage for 299 rigidity instances, including 251 windows beyond the $d<50$ benchmark. | Universal $R(3)$ remains open, and the dictionary still merits unaffiliated reconstruction. |
| Commutative algebra and algebraic geometry researchers | Examine the good-special-fibre, complete-intersection and Euler-socle architecture. | The largest finite lane retains a hashed Singular runtime rather than portable cofactors for every case. |
| Automatic-sequence and finite-field researchers | Attack the finite-prime product automaton suggested by the zero-band theorem. | Coefficient automaticity alone is not a GOOD-ideal certificate. |
| Computer-assisted mathematics researchers | Reuse the frozen receipts, controls, manifests and exact finite theorem benchmark. | Producer replay checks the encoded proposition; it is not independent mathematical reconstruction. |
| Research agents and tool builders | Consume the Universal $R(3)$ Challenge with explicit obligations and falsifiers. | Extending the table is useful but does not itself solve the all-degree problem. |
| Interested non-specialists | See how finite-field certificates and properness can prove a characteristic-zero theorem. | An unrefereed candidate is not peer-reviewed consensus. |

## How to reproduce the recorded checks

Download the tagged source or the Zenodo record, then run the fast public checks from the repository root:

```bash
./REPLAY.sh
```

This checks the public manifest, frozen evidence archive hash, terminal root receipt and Universal $R(3)$ Challenge under ordinary and optimized Python. To recompute the complete Stage 0 chain in the recorded environment, run:

```bash
FULL_EVIDENCE_REPLAY=1 ./REPLAY.sh
```

The full path requires the recorded Singular and Python dependencies and is substantially slower. The expected terminal marker is `R3_STAGE0_REPLAY_PASS`. A third party should publish its environment, logs and receipt rather than merely reporting that the command ran.

## The most valuable next projects

1. Independently reconstruct the Furter/LPS/properness bridge and the exact coverage partition from the definitions.
2. Reimplement the projective-stratum checker or export portable exact cofactors for every $50\le d\le300$ instance.
3. Prove or refute the canonical Euler-socle identities for all $d$, including the exceptional initial-state obstruction recorded in the challenge.
4. Build the finite-prime GOOD product automaton and search for either a universal cover or an explicit reachable all-BAD state.
5. Formalise the algebraic core and topological wrapper with an explicit statement-fidelity audit.
6. Obtain unaffiliated replay, external specialist review and editorial peer review, publishing corrections additively.

## What is in the public package

The DOI record contains the eight-page PDF, a tagged repository snapshot, the complete frozen Stage 0 ZIP, the fresh-extraction verification receipt, the public SHA-256 manifest and the machine-readable Universal $R(3)$ Challenge. The GitHub repository exposes the same research object with readable source, licences, provenance, novelty record, review records and fast and full replay entry points.

The Evidence Press cover, Open Graph image, transcript and synthetic-voice briefing are communication surfaces only. They add no mathematical evidence.
