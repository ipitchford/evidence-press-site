## Summary

Plane polynomial automorphisms can be sorted by the degree sequence of the elementary maps used to build them. The Polydegree Conjecture asks when one such family lies in the closure of another. A long-standing column of that problem asks whether

$$
\mathcal G_{(d+3)}\subseteq\overline{\mathcal G_{(d,4)}}
$$

holds for every integer $d\ge2$.

This anonymous, unrefereed candidate proves that full $e=3$ column. It first turns the Lewis--Perry--Straub determinant criterion into a local geometric question: find one smooth common zero of two coefficient polynomials where the next coefficient does not vanish. A Fourier-exponential limit supplies transverse model zeros for the two nontrivial residue classes. Quantitative Newton--Kantorovich bounds then carry those zeros to all sufficiently large degrees, while exact finite-field and interval certificates close the remaining ranges.

The archived finite bridge contains 97,033 ordered FLINT/Arb cases with no failure. A separate exact-rational envelope handles every later degree. The package includes the formulas, normative checker specification, locators, complete case rows, receipts, source code, manifests and review dispositions needed to inspect that claim.

> **Candidate status:** anonymous · unrefereed · producer-side theoretical and computer-assisted proof · no unaffiliated full Arb rerun, separately authored checker, proof-assistant formalisation, external specialist review or editorial peer review.

## Summary for specialists

Lewis, Perry and Straub give a sufficient criterion for
$\mathcal G_{(d+e)}\subseteq\overline{\mathcal G_{(d,e+1)}}$ using the coefficient polynomials $g_{n,e}$ and an auxiliary determinant $a_{d,e}$. The candidate proves

$$
a_{d,e}=(-1)^e\det D(g_{d,e},\ldots,g_{d+e-1,e})
$$

and an integral weighted-Euler syzygy which, on
$V(g_{d,e},\ldots,g_{d+e-2,e})$, factors this determinant through a single affine Jacobian minor and $g_{d+e-1,e}$. The criterion is therefore equivalent to a smooth point of codimension $e-1$ off the next hypersurface. The corresponding Hensel certificate uses an $(e-1)\times(e-1)$ minor and needs no exclusion of primes dividing $d+e-1$.

For $e=3$, write $d=3m+r$. The $r=1$ class has the exact special point $(0,0,1)$. In the other two classes, factorially normalised coefficient polynomials converge in $C^1$ on compact subsets of $\mathbf C^2$ to explicit root-of-unity Fourier sums

$$
H_q(\mathbf X)=\frac13\sum_{j=0}^2\omega^{-qj}
\exp\!\left(\rho^2\omega^jX_1+\rho\omega^{2j}X_2\right),
\qquad \rho^3=-4.
$$

A discrete-Fourier concentration constructs transverse zeros of the relevant pairs. An exact-rational $C^1$ defect envelope, a stated complex sup norm, and a quantitative Newton--Kantorovich argument give persistence for $m\ge48{,}550$. The intermediate range $33\le m<48{,}550$ in residues $0$ and $2$, except the already covered pair $(33,0)$, is certified case by case with outward-rounded complex balls. Exact finite-field checks cover $2\le d\le100$.

## Technical summary

The proof is a gap-free stitch of four regimes.

| Regime | Mathematical mechanism | Public evidence |
|---|---|---|
| $2\le d\le100$ | Smaller Hensel certificates over finite fields | Exact integer and finite-field verifier; primes at most 41 |
| $d\equiv1\pmod3$ | Exact special point $(0,0,1)$ | Symbolic substitution and diagonal Jacobian minor |
| $r\in\{0,2\}$, $33\le m<48{,}550$ | Quantitative root persistence at Gaussian-rational locators | 97,033 ordered FLINT/Arb rows, terminal receipt, no failures |
| $r\in\{0,2\}$, $m\ge48{,}550$ | Uniform coefficient-defect envelope and Newton--Kantorovich theorem | Exact-rational endpoint bound $0.0029969535913992734<0.003$ and monotonicity proof |

The normative certificate specification binds each printed mathematical predicate to the implementation. It defines the non-zero row scaling, exact coefficient table, complex sup norm, induced row-sum matrix norm, Gaussian-rational locators, cutoff and tail majorants, residual and inverse bounds, Neumann correction, Newton radius, third-row non-vanishing and transported Jacobian margin. Acceptance is fail-closed and does not depend on Python `assert`.

The finite receipt is required to contain exactly
$2(48{,}550-33)-1=97{,}033$ cases in the prescribed order, no failures and the terminal `CERTIFIED` state. Embedded SHA-256 digests bind it to the checker, locator sequence and complete row file. The eventual receipt is produced from exact rational arithmetic. A fresh producer replay under pinned `python-flint` is recorded separately from the historical archive receipt.

The incoming final review classified the paper as minor revisions. The release incorporates its requested normative formula-to-checker bridge, explicit complex norm, fuller $C^1$ derivative derivation, printed tail ratios, regime window, row-scaling explanation, exact case count, claim-to-evidence map and calibrated assurance language. No fatal or major mathematical defect was reported.

## What is classical, and what is offered here

The Polydegree Conjecture, coefficient polynomials and sufficient specialisation criterion come from Lewis, Perry and Straub. Edo's theorem supplies the congruence class $d\equiv1\pmod3$, and Perry's dissertation is a direct antecedent to the computational programme. A preceding Evidence Press candidate established the Jacobian--Euler interpretation and smaller Hensel certificate while leaving the full $e=3$ column open.

This candidate's main increment is the all-degree closure: the explicit Fourier limit, transverse limiting zeros, quantitative persistence argument, exact eventual threshold and complete finite bridge, combined with the inherited smooth-point reduction in one proof. Its fixed-$e$ continuation is a research programme and conjecture, not a theorem of this release.

The documented public-record search, frozen on 12 August 2026, found no earlier published proof of the full $e=3$ column. Under the project's published-record novelty criterion, an earlier published antecedent would falsify that novelty statement. The search is dated and bounded; it is not a specialist priority adjudication.

## What the result does not establish

- It does not prove the full Polydegree Conjecture or the general fixed-$e$ extension.
- It does not show that the supplied checker is independently implemented or that the proof has been independently reconstructed.
- It does not establish formal verification, external specialist review, editorial peer review or venue acceptance.
- It does not turn cross-model producer review, exact replay, CI, hashes, GitHub, Zenodo or Evidence Press publication into independent mathematical assurance.
- It does not establish research-workflow acceleration or impact; no prospective matched comparator or complete research clock was recorded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Polynomial-automorphism researchers | Inspect a claimed resolution of the full $e=3$ containment column and reuse the smooth-point formulation. | The full conjecture and fixed-$e$ programme remain open. |
| Algebraic geometers | Study the weighted-Jacobian factorisation and local smoothness bridge. | The Lewis--Perry--Straub translation and analytic bridge still merit independent reconstruction. |
| Analysts and special-functions researchers | Examine an explicit Fourier-exponential limit with quantitative $C^1$ persistence. | The eventual constants and norm translations are producer-authored and computer assisted. |
| Computer-assisted mathematics researchers | Audit a proof object that joins exact, interval and analytic regimes through one normative specification. | Replay establishes the encoded predicates and byte integrity, not an unaffiliated proof. |
| Interested non-specialists | See how a theorem can combine geometry, asymptotics and exhaustive certified computation. | Candidate publication is not peer-reviewed consensus. |

## The most valuable next projects

1. Independently reconstruct the coefficient normalisation, Fourier limit, Newton--Kantorovich bounds and Lewis--Perry--Straub implication from the definitions.
2. Implement the finite and eventual checkers independently and rerun the immutable public locator sequence without producer intermediates.
3. Obtain specialist reviews in polynomial automorphisms, algebraic geometry, asymptotic analysis and interval certification, retaining any corrections publicly.
4. Formalise the Jacobian--Euler factorisation and the analytic persistence theorem over an explicit trusted base.
5. Investigate the fixed-$e$ extension only after the $e=3$ result survives independent review; keep failures and changed thresholds visible.

## Specialist audience candidates

Direct specialist audiences include researchers in polynomial automorphism groups, affine algebraic geometry, multivariate Hensel lifting, special-function asymptotics, validated numerics and computer-assisted proof. The most informative review would combine structural checking of the Polydegree criterion with a separately authored interval implementation; either alone leaves a distinct bridge untested.

## What is in the evidence package

The public package contains the 13-page manuscript PDF and accessible Markdown source; the normative certificate specification; exact finite-field, symbolic and rational verification programs; the pinned FLINT/Arb checker; 97,033 complete case rows and their exact Gaussian-rational locators; finite and eventual terminal receipts; replay instructions and receipt; machine-readable claims, status and assurance records; review and revision dispositions; literature-search records; licences; provenance; CI; and SHA-256 manifests.

The Evidence Press page, cover image, Open Graph card, transcript and synthetic-voice audio briefing are communication surfaces. They are not additional mathematical evidence.
