## Summary

Plane polynomial automorphisms can be grouped by the degree sequence of the elementary maps used to construct them. The Polydegree Conjecture asks when one such group lies in the closure of another. This anonymous, unrefereed candidate presents the full column indexed by $e=4$:

$$
\mathcal G_{(d+4)}\subseteq\overline{\mathcal G_{(d,5)}}
\qquad\text{for every integer }d\ge2.
$$

The argument joins four regimes. Lewis, Perry and Straub already proved the containment for $2\le d<20$. One congruence class has an exact solution. A complete ledger of 14,985 outward-rounded FLINT/Arb calculations covers the remaining finite interval. An explicit analytic certificate, based on a four-mode Fourier limit and quantitative Newton--Kantorovich bounds, covers every later degree.

The public bundle also contains two separable companions. A Lean development verifies a universal bordered-Jacobian identity over arbitrary commutative rings. A short geometric paper proves an unconditional norm lemma and finite-pencil equivalence, then a boundary-norm transfer theorem conditional on a stated geometric package.

> **Candidate status:** Anonymous · unrefereed · theoretical and computer-assisted proof · producer replay and scoped Lean checking passed · independent reconstruction, external specialist review and editorial peer review not assessed.

This is not a proof of Furter's R(3), monotone Polydegree rigidity, the two-dimensional Jacobian conjecture, or the quartic Hessian conjecture.

## Summary for specialists

For $e=4$, the Lewis--Perry--Straub specialization criterion reduces the containment to a common zero of $g_{d,4},g_{d+1,4},g_{d+2,4}$ at which an anchored $3\times3$ Jacobian minor and $g_{d+3,4}$ are nonzero. A weighted-Euler identity identifies their determinant condition with this smooth-zero formulation.

Write $d=4m+r$. After exact factorial normalization and the scaling $(x_1,x_2,x_3,x_4)=(X_1/m,X_2/m,X_3/m,1)$, the relevant coefficient rows converge to four explicit Fourier-exponential functions. Explicit phase choices give transverse common zeros in residues $r=0,2,3$; $r=1$ has an exact solution. Exact rational head and tail estimates, with 256-bit Arb used only for cancellation-sensitive Fourier constants, verify the Newton, nonvanishing and Jacobian-transport inequalities uniformly for $m\ge5000$. The finite bridge checks $5\le m<5000$ in the three non-exact residues, exactly $3(5000-5)=14{,}985$ cases.

The result uses the published range $2\le d<20$, so there is no gap between the inherited and new regimes.

## How the all-degree certificate works

The normalized coefficient of a monomial $X_1^{a_1}X_2^{a_2}X_3^{a_3}$ has an exact product formula. Its limit is selected by a fourth-root-of-unity filter. With $\rho^4=-5$, the limiting functions are

$$
H_q(X)=\frac14\sum_{j=0}^3 i^{-qj}
\exp\!\left(\rho^3i^jX_1+\rho^2i^{2j}X_2+\rho i^{3j}X_3\right).
$$

Fourier inversion produces explicit points where three consecutive rows vanish and the fourth does not. The derivative relation

$$
\frac{\partial H_q}{\partial X_s}=\rho^{4-s}H_{q-s}
$$

makes the limiting Jacobian diagonal after row normalization. This supplies both invertibility and a quantitative margin.

For $m\ge5000$, the manuscript expands the exact finite-to-limit product through first order, bounds the degree-at-most-50 head by rational arithmetic, and controls the tail uniformly. The resulting defect envelopes worsen monotonically at the threshold, so checking the endpoint proves every larger $m$. For $5\le m<5000$, exact Gaussian-rational locators and outward-rounded complex balls certify the same acceptance predicates one case at a time.

The finite producer ledger and its optimized replay are byte-identical. A separate auditor checks order, range, case count, source hashes, interval endpoints and the terminal inequalities. Three deliberate byte mutations—one in the P7a ledger, one in the Lean source and one in the boundary theorem—are all rejected.

## The two companion results

The formal companion concerns multiplication of binary forms. If $M$ is its rectangular coefficient Jacobian and $\kappa$ is the relative-scaling kernel vector, Lean verifies every signed maximal minor and the determinant formed by adjoining any border row. The final theorems hold over an arbitrary commutative ring, including zero divisors and the cases where either degree is zero. Cancellation is performed only in a universal polynomial domain, followed by explicit specialization. The pinned Lean 4.32.1 / Mathlib v4.32.1 build has no warnings or unproved placeholders.

The boundary companion begins with a cover-degree-free field-norm lemma. It proves that an apparently unbounded family of homogeneous graph obstructions is equivalent to checking whether a two-dimensional polynomial pencil contains one of finitely many monomials $1,s,\ldots,s^\kappa$. This gives a conditional boundary-norm transfer theorem and a six-sheet application. Its hypotheses are substantive geometric obligations; they are not asserted for every Keller map. The example $A=1$, $B=s$ shows that the pencil condition is necessary for this method.

## Evidence, assurance and limitations

The release has eight distinct assurance dimensions. Availability and internal replay pass. Formal verification is partial at bundle level because it applies to the identified Lean determinant theorems, not to the analytic Polydegree proof or the boundary geometry. Independent rerun, independent reimplementation, external specialist review and editorial peer review are not assessed. Environment reproducibility is partial: dependencies, toolchains, manifests and CI are pinned, but no independently recreated container or functional package definition is supplied.

The final internal review used five roles—Editor-in-Chief, methodology, domain, applications and Devil's Advocate—and accepted the repaired frozen candidate. These reports are internal AI quality-control records, not external human review.

The bounded source audit found no earlier all-degree effective $e=4$ theorem. That supports describing the result as plausibly highly original and significant within its narrow area if it survives specialist scrutiny. It does not establish priority and does not support “first” or “world-leading.”

## What is classical and what is offered here

Lewis, Perry and Straub supply the coefficient polynomials, specialization implication and the full-containment range $2\le d<20$. Perry's dissertation is a direct computational antecedent, but its wider degree range concerns a weaker nonempty-intersection statement. Furter's fixed-multidegree geometry is close structural context.

The candidate increment is the gap-free all-degree $e=4$ continuation: explicit Fourier zeros, an effective uniform threshold and a complete finite bridge. The earlier anonymous full-$e=3$ Evidence Press candidate is research lineage and a methodological predecessor, not a published theorem imported into this proof.

The formal companion's contribution is the end-to-end arbitrary-ring Lean object and specialization architecture; it does not claim the classical adjugate/resultant ingredients as new. The boundary paper's defensible increment is the finite-pencil transfer mechanism, not a new global classification of plane Keller maps.

## What the result does not establish

- It does not prove Furter's R(3) or a monotone implication from one Polydegree column to every later column.
- It does not solve or materially reduce the two-dimensional Jacobian conjecture or the quartic Hessian conjecture.
- It does not show that every polynomial Keller map satisfies the boundary package used by the conditional transfer theorem.
- It does not make the analytic Polydegree proof or boundary geometry formally verified merely because the companion determinant identity is in Lean.
- It does not turn internal replay, CI, hashes, DOI publication or AI editorial review into independent mathematical reproduction.
- It does not establish absolute novelty, priority, journal acceptance or consensus.

## Who should care, and why

| Reader | Potential use | Principal caution |
|---|---|---|
| Polynomial-automorphism researchers | Inspect a claimed completion of the full $e=4$ containment column and test the effective Fourier construction. | The theorem is an unrefereed candidate requiring specialist reconstruction. |
| Validated-numerics researchers | Audit a finite/infinite proof stitch with exact locators, outward-rounded intervals and a rational eventual envelope. | The checkers share producer-side lineage. |
| Formalization researchers | Reuse or extend the arbitrary-ring bordered-Jacobian development. | Its passed formal scope is narrower than the three-paper bundle. |
| Algebraic geometers | Study the smooth-zero reduction and finite-pencil boundary transfer. | The boundary theorem is conditional on explicit geometric hypotheses. |
| General readers | See how published input, exact algebra, interval computation and asymptotic analysis can cover an infinite parameter range. | Public release is not peer-reviewed consensus. |

## Why this result matters

The central advance is not simply a larger calculation. The proof converts a qualitative limiting picture into an effective theorem with an explicit threshold. That separates the infinite problem into a finite, auditable ledger and a uniform analytic tail. If specialists validate the argument, the result would close a complete Polydegree column beyond the previously published finite range and offer a reusable model for other fixed columns.

The companions matter for different reasons. The Lean theorem isolates one structural determinant identity over its natural arbitrary-ring base, while the boundary paper compresses infinitely many graph degrees to a finite pencil test when the required geometry is available. Neither companion broadens the headline claim beyond its stated hypotheses.

## How to inspect and reproduce the recorded checks

Start with the immutable [v0.1.0 candidate release](https://github.com/ipitchford/full-e4-polydegree-column/releases/tag/v0.1.0-candidate) or [DOI archive](https://doi.org/10.5281/zenodo.22072044), and verify `SHA256SUMS`. The repository's `REPRODUCIBILITY.md` gives the exact order.

The short path is to run the structural package verifier, P7a release verifier under ordinary and optimized Python, boundary verifier under both modes, and the semantic negative controls. Then enter `formal/BorderedJacobianUniversal`, fetch the pinned Lean dependencies and run the formal release verifier. GitHub Actions records successful Python 3.12 and 3.14 jobs plus the Lean build and axiom audit.

Replaying these programs tests the supplied encoded predicates and byte bindings. An independent mathematical check should instead reconstruct the coefficient normalization, Fourier zeros, tail estimates, Newton constants and Lewis--Perry--Straub implication before consulting the implementation.

## The most valuable next projects

1. Independently reconstruct the analytic and Polydegree bridges from the definitions and the cited published criterion.
2. Implement the finite and eventual certificates in a separate interval stack and compare all 14,985 cases.
3. Formalize the smooth-zero reduction and quantitative persistence theorem, connecting them to the existing Lean companion.
4. Obtain external specialist reports in polynomial automorphisms, asymptotic analysis, validated numerics, formalization and boundary geometry, preserving objections and corrections publicly.
5. Investigate $e=5$ without extrapolating an all-$e$ or monotone rigidity theorem from the $e=3$ and $e=4$ cases.

## What is in the public package

The public repository contains the 14-page main paper, 5-page Lean companion and 6-page boundary companion, with accessible Markdown; the exact normalization and eventual programs; both 17 MB finite ledgers; locators and receipts; the complete Lean source and concordance; boundary verification; three semantic mutation controls; internal review records; claim, source, priority, licence, provenance and assurance files; CI; and a 104-file SHA-256 manifest.

GitHub and Zenodo carry byte-identical copies of the source ZIP, three PDFs and checksum ledger. Original prose, data and internal review records are dedicated under CC0 1.0; original non-Lean code is MIT; the Lean subtree retains Apache-2.0. The Evidence Press art, Open Graph card, transcript, audio and thumbnail are communication aids, not additional mathematical evidence.
