## Summary

> **Post-publication scope clarification — 1 September 2026.** The first version of this page used “the quartic Hessian conjecture in dimension four” ambiguously and omitted Zixiang Ni's directly relevant preprint. The immutable v0.1.0 research package has not been changed. This page now distinguishes the degree-at-most-four theorem candidate from **full $HC_4$**, and identifies the release's actual ternary-quintic scope.

The Hessian Conjecture asks when a polynomial potential with constant non-zero Hessian determinant has a polynomial inverse gradient map. In four variables, this page uses **full $HC_4$** for the statement with no degree bound:

$$
\text{for every }f\in\mathbb C[x_1,x_2,x_3,x_4],\qquad
\det\operatorname{Hess}(f)\in\mathbb C^\times
\Longrightarrow \nabla f\in\operatorname{Aut}(\mathbb C^4).
$$

“Full” therefore means **all finite polynomial degrees in dimension four**. It does not mean only quartic polynomials.

| statement | quantifies over | present status recorded here |
|---|---|---|
| degree-at-most-four Hessian Conjecture in dimension four | $f\in\mathbb C[x_1,x_2,x_3,x_4]$ with $\deg f\leq4$ | [Ni's 2026 preprint](https://arxiv.org/abs/2608.14217) claims a proof; a producer-side claim-level audit found no gap in four load-bearing interfaces, but this remains unrefereed and has no unaffiliated specialist validation recorded here |
| full $HC_4$ | the same implication for arbitrary finite $\deg f$ | open on the assurance record used by this release; Ni explicitly leaves degree at least five outside his theorem |
| two-dimensional Jacobian Conjecture | every plane polynomial map with non-zero constant Jacobian | not solved here; full $HC_4$ would imply it through the standard cotangent-doubling reduction, but the degree-at-most-four case alone does not |

This release begins instead with a **ternary quintic** $h_5$. Its binary-decimic and repeated-conic calculations therefore belong to a degree-five branch of full $HC_4$: the first degree beyond Ni's stated theorem, not a competing treatment of the degree-at-most-four case.

This release does **not** solve full $HC_4$ or the two-dimensional Jacobian Conjecture. It makes one difficult degree-five normal-layer route substantially more explicit.

The work associates a binary polynomial of degree ten—a binary decimic—to the repeated-conic boundary. Exact certificates rule out the case where that decimic has exactly five distinct roots. On one of the two remaining residual orbits, the tangent orbit, all 31 equations defining the required multiplicity-six locus are proved to vanish. On the harder secant orbit, three exact rational colon identities expose structure without proving the full saturation.

The closing test then selects sixteen particularly sparse source directions by a rule fixed before their transfer was computed. All sixteen survive exact lifting and rational reconstruction. They form sixteen explicit rational relations in the fourth Macaulay block. That is a real positive signal—but it is a statement about the source kernel, not yet a solution of the fourth target equation.

> **Candidate status:** Anonymous · AI-assisted · unrefereed · exact computer-assisted structural results and bounded source-kernel theorem · internal editorial review and clean replay passed · no fourth-target membership, secant closure, full $HC_4$ or JC2 claim · Ni's degree-at-most-four result separately remains an unrefereed theorem candidate · no unaffiliated reconstruction, formal verification, external specialist review or peer review.

## Summary for specialists

Restrict the ternary quintic normal layer to the Veronese conic $q=xz-y^2=0$. The resulting binary decimic $f_{10}$ controls the repeated-factor boundary of

$$
\det\operatorname{Hess}(h_5)=q^4\ell.
$$

For exactly five projective support points, the seven multiplicity partitions of ten are exhausted by exact characteristic-zero radical and unit-ideal certificates, excluding every non-zero residual line. On the tangent residual-quadratic orbit, an exact $SL_2$ profile identifies the 31 minimal generators of the coincident-root locus $X_{(6,1,1,1,1)}$. Seven highest-weight radical containments plus stabiliser-span calculations yield

$$
N_6\subseteq\sqrt{I_{\mathrm{tan}}}.
$$

The secant orbit leaves one chart. With $I=(F_1,\ldots,F_{17})$ and

$$
M=f_9f_{10}(2f_9^2+5f_{10}g_0),
$$

the package gives exact rational quartics $h,h_2,h_3$ satisfying successive memberships

$$
h\in I:M,\qquad h_2\in(I,h):M,\qquad h_3\in(I,h,h_2):M.
$$

These are colon elements, not generators of the full colon or a proof that $I:M^\infty=(1)$.

For the degree-eight, character-two fourth source block, write the frozen matrix as $[B\mid C]$, with 85,688 rows and 36,587 selected pivot columns. The first sixteen free columns under the preregistered ordering by source support and global coordinate give $C_{16}$. Four shared LinBox solves over $\mathbb F_{173}$ produce a lift through $173^4$. Every one of the 585,392 coordinates reconstructs uniquely within the rational-reconstruction bound, and exact replay gives

$$
BT+C_{16}=0
$$

over $\mathbb Q$. A separate producer-coordinated implementation bypasses the CSR rows, rebuilds the generator–multiplier products, and expands all sixteen residual polynomials to zero.

## What changed

| part of the programme | exact contribution | still missing |
|---|---|---|
| five-support boundary | all seven exactly-five-root partitions excluded | six-or-more support and full double-conic packet |
| tangent residual orbit | all 31 multiplicity-six target generators vanish | transfer or separate proof on the secant orbit |
| secant chart | three successive rational localized-colon elements | full colon equality or saturation |
| fixed fourth target | congruence lift through $173^{96}$ | rational target identity |
| sixteen-column test | sixteen exact rational source syzygies | a gauge action that simplifies the inhomogeneous target |
| degree-five branch of full $HC_4$ | sharply smaller normal-layer frontier | polynomial-level and full-family closure |

## The technical mechanism: why the sixteen-column test matters

The fourth target had already lifted to very high $173$-adic precision, but rational reconstruction failed in the fixed gauge: 8,579 coordinates remained unresolved, and several preregistered recovery architectures failed their exact checks. Simply adding more digits had become a poor experiment.

The new test changes the question. It asks whether the source matrix contains rational directions along which the gauge may be moved. The sixteen columns were chosen only because they had minimum source support under a frozen ordering. Their successful exact reconstruction proves that a small rational kernel slice exists and can now be used in a targeted gauge-action calculation.

It does **not** prove that any linear combination of those directions makes the fourth target rationally reconstructible. That is the next experiment, not a corollary of this one.

## Package map: where to inspect and replay the evidence

The shortest route through the package is:

1. read `paper.pdf` for the mathematical statements and dependencies;
2. inspect `CLAIMS.json` for the seven claim units and their scope limits;
3. open the terminal 16-column receipt for the frozen selection, dimensions, timings, hashes and zero-mismatch counts;
4. run `python3 verify_package.py` for the fast manifest and status checks; and
5. with SageMath available, run `python3 verify_package.py --semantic-c16` to rebuild all sixteen rational polynomial identities.

The complete ZIP includes the positive certificates, failed and inconclusive routes, review reports, response matrix, environment record, source bridge, and research metrics. The direct-polynomial audit is implementation-diverse but producer-coordinated; it is not unaffiliated reproduction.

## Who should care, and why

| likely audience | what should interest them | useful next action |
|---|---|---|
| researchers on Hessian-nilpotent and Jacobian problems | a repeated-factor boundary split into exact support and residual-orbit statements | check the normal-layer reductions and attack the secant orbit |
| classical invariant theorists | explicit use of the binary-decimic multiplicity-six locus and its seven highest-weight families | reconstruct the radical containments or find a conceptual proof |
| computational algebra researchers | a large sparse exact system turned into a small rational kernel slice with fail-closed p-adic recovery | independently reimplement the C16 audit or improve the gauge objective |
| formalisation researchers | sharply indexed statements, exact certificates and explicit missing implications | formalise one support partition, the tangent stabiliser step, or the source-kernel identity |
| AI-assisted mathematics researchers | prospective selection, measured compute, preserved failures and explicit assurance boundaries | study or challenge the claim–evidence architecture |

## The most valuable next projects

### 1. The rational gauge-action test

Use the exact matrix $T$ with $BT+C_{16}=0$ to write the full sixteen-parameter action on the inhomogeneous fourth target. Derive a rational simplicity or height objective before optimization, then test whether some rational parameter choice yields an exactly reconstructible target representative. A negative result must be tied to a bounded objective class; a positive result must replay over $\mathbb Q$.

### 2. Close or falsify the secant saturation

The three colon elements show repeated structure but do not determine $I:M^\infty$. A direct saturation certificate, a finite module argument, or a structural countercomponent would be decisive. This remains the geometric bottleneck of the normal layer.

### 3. Reconstruct independently

The fastest assurance gain is an unaffiliated reconstruction of one load-bearing unit: the seven five-support branches, the seven tangent highest-weight families with stabiliser spans, or the sixteen direct polynomial syzygies. A separately authored implementation is more informative than another run of the supplied scripts.

## Limitations and claim boundary

The release proves bounded structural statements inside one pinned degree-five normal-layer programme. It does not prove that the secant residual orbit is contained in the multiplicity-six nullcone, that the fourth target belongs to the relevant ideal over $\mathbb Q$, that the displayed colon elements generate a colon or saturation, that the full family lifts from the normal layer, or that full $HC_4$ or JC2 is true. It also does not supply an independent review of Ni's degree-at-most-four theorem candidate.

Those missing implications are the difference between a promising structural release and a solution.
