## Summary

Several famous problems about polynomial maps meet at a stubborn algebraic bottleneck. Furter's rigidity problem R(3), the Polydegree Conjecture, the Strong Factorial Conjecture, the two-dimensional Jacobian Conjecture and a quartic Hessian problem are connected by known implication routes, but this release does not claim to solve any of them.

Instead, this anonymous, unrefereed candidate makes one shared route smaller and more explicit. A complementary-minor duality turns a growing family of equations in the Lewis--Perry--Straub programme into a fixed-width adjacent-flag problem. For the first genuinely coupled case, $d=5$, the remaining geometry lives in four variables. Exact quartic calculations remove several special loci and distinguish two coefficient gauges that agree only after localization. A separate p-adic note gives certified prime-shift examples and isolates a valuation law that could turn finite evidence into an all-index argument.

The public object contains three manuscripts, exact code and data, ordinary and optimized replay receipts, a complete claim inventory, review and repair records, provenance and checksums.

> **Candidate status:** Anonymous · unrefereed · written structural arguments and exact finite evidence · repaired five-role internal review and bounded confirmation passed · no claim of R(3), the full Polydegree or Strong Factorial conjectures, JC2 or HC4 · no independent reconstruction, formal verification, external specialist review or editorial peer review.

## Summary for specialists

For the Lewis--Perry--Straub determinant $a_{d,e}$, the structural paper gives a complementary-minor congruence exchanging $(d,e)$ with $(e+1,d-1)$ modulo the relevant inverse-coefficient prefix. Together with rigidity duality and a chart-preserving translation field, the second radical-membership obstruction becomes a prefix-rank condition. Triangular inverse coordinates identify that condition with transversality of a fixed-width adjacent flag in $d-1$ variables.

For $d=5$, the target is quartic. The companion separates the centered staircase gauge

$$
(c_{n-4},c_{n-3},c_{n-2},c_{n-1})
$$

from the backward p-adic norm gauge

$$
(c_{n-6},c_{n-5},c_{n-4},c_{n-3}).
$$

Their transition determinant is

$$
\frac{x_4^2(5n+6)(5n+7)}{(n-2)(n-1)},
$$

so the two ideals are identified only on the chart where this determinant is a unit. The repaired release does not silently transport an unlocalized radical or saturation claim between them.

The p-adic addendum gives a certificate mechanism for two norm families. Twelve designated-prime instances through $n=57$ certify; at $n=15$ the designated reduction modulo $17$ has a quadratic gcd, while another prime certifies the characteristic-zero instance. A degeneration theorem explains the structural $p$-adic mass. The all-index slope-four polygon law and the reduced-gcd statement remain open.

## Technical mechanism: how the three pieces fit together

The structural manuscript removes inessential dimension growth. The quartic companion studies the surviving four-variable geometry and makes the gauge change explicit. The p-adic note supplies a possible arithmetic route for the hardest norm-coprimality step.

This is an emerging approach, not a completed implication chain. Adjacent-flag transversality can identify two bad loci; it does not by itself prove that either locus is empty. Likewise, a pure $x_4$ initial monomial proves zero-dimensionality in the tested chart, not saturation or radical membership. The uniform radical-membership bridge required by the LPS induction is still open.

## What is established in the candidate

- The structural paper supplies written determinant identities and fixed-width reductions, subject to ordinary expert checking.
- The companion supplies exact symbolic certificates for selected quartic identities, special-locus exclusions and the localized centered/backward gauge bridge.
- The p-adic paper proves its certificate and degeneration statements and records exact bounded prime-shift evidence.
- The release harness passes 20 named predicates under ordinary and optimized Python with matching output hashes.
- Five deliberately altered receipts and three fail-open p-adic sentinels are rejected.
- The exact package passed a five-role substantive review after repair and one bounded confirmation review with no P0 or P1 finding.

## Evidence and assurance

Availability and producer-side internal replay pass. Data and environment reproducibility are partial because versions, commands, sources and receipts are public but no unaffiliated cross-platform rebuild is reported. Semantic validation is partial: claims, proof locations, gates, non-claims and open obligations are indexed, but the universal written arguments still require mathematical reconstruction.

Independent rerun, independent reimplementation, proof-assistant formalization, external specialist review and editorial peer review are not assessed. A targeted antecedent search is recorded, but novelty and priority are not adjudicated.

The five internal review roles were Editor-in-Chief, methodology, domain, applications and Devil's Advocate. Those reports are producer-side quality control. Model agreement, hashes, CI, a DOI and Evidence Press publication do not turn them into independent mathematical review.

## What the release does not establish

- It does not prove the uniform quartic adjacent-flag or radical-membership statement.
- It does not prove Furter's R(3), the Polydegree Conjecture, the Strong Factorial Conjecture, the two-dimensional Jacobian Conjecture or the quartic Hessian conjecture in dimension four.
- It does not infer emptiness from transversality or saturation from zero-dimensionality.
- It does not treat the centered and backward coefficient gauges as globally identical.
- It does not turn bounded norm data into the all-index slope-four polygon law.
- It does not establish independent reproduction, formal verification, specialist acceptance, peer review, novelty, priority or research-workflow impact.

## Who should care, and why

| Reader | Potential use | Principal caution |
|---|---|---|
| Polynomial-automorphism researchers | Check the determinant duality and conversion of the LPS obstruction to a fixed-width adjacent flag. | The terminal radical membership remains open. |
| Commutative algebraists | Study the localized length-ten algebra, norm coprimality and possible initial-ideal or saturation route. | Zero-dimensionality is not the required saturation statement. |
| Arithmetic algebraists | Test the slope-four valuation law and reduced-gcd mechanism. | The prime-shift ledger is finite and has a designed exceptional case. |
| Computer-assisted mathematics researchers | Audit a mixed proof-and-computation package with explicit claim states and negative controls. | The implementations and reviews share producer lineage. |
| General readers | See how a large conjectural network can be compressed to smaller explicit obligations. | Greater tractability is not a breakthrough theorem. |

## Why this result matters

The main gain is compression. The unresolved membership problem initially grows with the parameter $e$; the duality and inverse-coordinate descent replace it with a fixed number of variables for each fixed $d$. At $d=5$, the search is no longer for a theorem in an expanding ambient space but for one uniform property of an explicit four-variable flag.

The gauge repair makes this route safer to reuse. It shows exactly when the quartic staircase computation and the p-adic norm computation describe the same localized object, and where residual charts must still be checked.

The p-adic observations offer a second compression. If the conjectural slope-four law can be proved from an integral presentation or Smith form of the observation block, much of the characteristic-zero norm problem would reduce to a finite-field coprimality question with identifiable exceptional primes. That is a concrete positive signal even before the final theorem is available.

## How to inspect the release

Start with the [structural paper](https://github.com/ipitchford/lps-structural-reductions/releases/download/v0.2.0-candidate/LPS-Structural-Reductions.pdf), then read `CLAIMS.json`, `DEPENDENCY_MAP.md` and the companion's centered/backward gauge section in the [complete GitHub release](https://github.com/ipitchford/lps-structural-reductions/releases/tag/v0.2.0-candidate). The [DOI archive](https://doi.org/10.5281/zenodo.22100350) preserves the same ZIP, three PDFs and manifest.

Run the release harness once normally and once with `python -O`, then run `verification/verify_replay_receipts.py`. This checks the ordered gate, source closure, matching outputs, manifest and semantic receipt mutations. Replaying the programs tests the encoded finite predicates. An independent mathematical review should reconstruct the determinant duality, flag descent, localized algebra and p-adic mass arguments from the definitions before relying on the implementation.

## The most valuable next projects

1. Prove the slope-four valuation law from an integral presentation or Smith form of the scaled observation block at $p=n+2$.
2. Prove reduced norm coprimality over $\mathbb F_p$, treating the $n=15$ designated-prime failure as a design constraint.
3. Obtain a parameter-uniform initial-ideal, elimination or saturation certificate for the quartic closure, including the residual charts excluded by the localized gauge bridge.
4. Attack adjacent-flag transversality directly without imposing the stronger global pair-quasismoothness statement.
5. Obtain unaffiliated specialist reconstruction and a separately authored implementation before promoting any broader conjectural claim.

## What is in the public package

The [versioned public bundle](https://github.com/ipitchford/lps-structural-reductions/releases/download/v0.2.0-candidate/lps-structural-reductions-v0.2.0-candidate.zip) contains a 10-page structural paper, 9-page computational companion and 4-page p-adic addendum in PDF, LaTeX and accessible Markdown; exact verification code and data; ordinary and optimized receipts; machine-readable claims; status, assurance, provenance, environment, licensing and citation records; substantive and confirmation review reports; the frozen `v0.1.0` lineage archive; and a complete SHA-256 manifest.

The Evidence Press art, Open Graph card, transcript, synthetic-voice audio and thumbnail are communication aids. They do not add mathematical evidence.
