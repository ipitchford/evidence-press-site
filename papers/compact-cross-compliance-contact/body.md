## Summary

When elastic bodies touch, friction depends on the pressure between them—and that pressure is itself part of the unknown solution. This candidate identifies a three-dimensional setting where the resulting incremental contact problem has a solution without a small-friction restriction.

The condition is structural: two smooth, anchored bodies share a closed interface, and their elastic parameters satisfy **λ₊ + μ₊ = λ₋ + μ₋** there. The materials need not be identical. Matching cancels the leading normal–tangential coupling, while lower-order coupling may remain. The theorem exploits that weaker, compact coupling rather than assuming complete decoupling.

This is a written, unrefereed mathematical candidate. It does not settle general three-dimensional frictional contact or the continuous-time rate-and-state problem.

## Summary for specialists

Let the elastic form be symmetric and coercive and the joint normal/tangential trace map be surjective onto the stated endpoint trace spaces. The compact cross-compliance map is

\[
C_{nt}:H^{-1/2}(\Gamma;T\Gamma)\to H^{1/2}(\Gamma).
\]

Its compactness gives type-\((S)^+\) coercivity of the normal-reaction map and incremental Signorini–Coulomb existence (Theorem 4.1). The normal pressure is an unknown nonnegative reaction; the finite nonnegative friction coefficient belongs to \(W^{1,\infty}\).

For smooth bounded anchored isotropic bodies with a closed common interface, separated from the clamped boundaries, the principal cross symbol is proportional to

\[
c(x)\frac{i\xi^\sharp}{|\xi|^2},
\]

where

\[
c(x)=\frac{1}{2(\lambda_++\mu_+)}-\frac{1}{2(\lambda_-+\mu_-)}.
\]

Matching makes the cross block order at most −2 and hence compact between these endpoint spaces (Theorem 5.2). Strong solution compactness and reaction-space approximation convergence keep the elastic architecture fixed. The approximation result assumes exact frozen elastic response; it is not a convergence theorem for every contact solver.

Theorem 5.3 characterizes an **unrestricted dominated weak-product property** in this smooth class. Its converse is not a necessary condition for contact existence.

## Technical account

The proof separates normal reaction from displacement. For each admissible normal reaction, a strictly convex minimization problem gives a unique elastic response and a bounded tangential friction reaction. An endpoint measure lemma makes the dominated pairings precise, including weighted factorization where friction vanishes. It does not treat division by friction as a Sobolev multiplier.

Compact cross compliance controls the otherwise problematic weak-product term. Strong monotonicity in the frozen normal reaction then supplies the type-\((S)^+\) property. An established pseudomonotone variational-inequality theorem yields existence. The boundary-symbol calculation realizes the abstract compactness hypothesis in a concrete three-dimensional class.

A non-identical matched pair is \((\lambda_+,\mu_+)=(2,1)\), \((\lambda_-,\mu_-)=(1,2)\). Both sums equal three. Exact finite-layer calculations show that leading cancellation need not remove low-frequency coupling. The banner illustrates this distinction; it is not a computed deformation.

The second part concerns **prescribed-pressure** rate-and-state models. It gives implicit-step refinements, sufficient small-step uniqueness estimates, sharp constitutive monotonicity thresholds and explicit multiplicity examples. These are separate statements with separate hypotheses—not an extension of the unknown-pressure theorem to general rate-and-state dynamics.

## Evidence, assurance and limitations

The supplied review has been actioned: the smooth-profile class is explicit, the endpoint measure argument is expanded, contact-specific antecedents and boundary-calculus inputs are identified, the stability scope is fixed, and the incorrect Pipping DOI is corrected. Numerical curvature evaluations are distinguished from certified curvature bounds.

The frozen archive passes twelve supporting check groups in ordinary and optimized Python. Six deliberately corrupted-check invocations are rejected. These checks include exact identities and numerical illustrations; they do **not** formally verify the infinite-dimensional proofs. The older supplied reviewer code concerns v1 and is not independent confirmation of the new contact theorem. No authenticated external specialist review, unaffiliated reproduction or awarded research rating is claimed.

Contact edges, rough coefficients, general mismatched interfaces, evolving geometry and the full multidimensional continuous-time limit remain outside the result. Failure of a weak-product property does not prove that a nonlinear contact solution fails to exist. A stationary root need not be a global minimizer or a dynamically stable state.

## Relationship to earlier work

Earlier three-dimensional contact existence results include small-friction hypotheses; classical elastic similarity can produce exact half-space decoupling. Ballard and Iurlano establish arbitrary-friction results in two dimensions using a fine weak-product property. This candidate instead uses compact cross coupling in a specified smooth three-dimensional architecture. Classical symbol calculus and the normal-reaction framework are inputs, not discoveries claimed here.

Logarithmic implicit Euler and loss of convexity after state elimination also have prior literature. The manuscript's theorem-level comparison credits those precedents and distinguishes its proposed refinements. The bounded source check does not certify priority.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Contact analysts | A compact-cross-block route to incremental existence | Closed smooth matched interfaces and endpoint hypotheses matter |
| Numerical analysts | A reaction-space convergence target and test cases | Exact frozen response is assumed; solver consistency remains separate |
| Friction modellers | Explicit distinctions between coupled pressure, prescribed pressure and state updates | No empirical material validation or general dynamic well-posedness follows |

## Why the problem matters

Removing a small-friction bound without erasing the coupling changes which idealized elastic contact problems can be treated analytically. It also identifies precisely what the proof needs. This can guide subsequent analysis, but it is not a claim that a practical engineering model or simulation has been validated.

## How to inspect or reproduce the recorded checks

Download the versioned archive, verify `SHA256SUMS`, and start with `AI_INDEX.md`, `REVIEW_RESPONSE_V21.md` and the manuscript's Theorems 4.1, 5.2 and 5.3. In an isolated Python environment install the pinned requirements, then run:

```sh
python code/check_manifest.py
python code/verify.py --out /tmp/n
python -O code/verify.py --out /tmp/o
python code/test_negative.py
```

The programs require no network access after dependencies are installed. Read each check's scope: exact algebra, high-precision numerics, manifest verification and written proof are different assurance categories.

## The most valuable next projects

1. Independently audit the endpoint measure argument, normal-reaction coercivity and boundary-calculus interface.
2. Develop a concrete discretization with the consistency estimates needed beyond exact frozen elastic response.
3. Investigate contact edges or mismatched interfaces without assuming that failure of this proof mechanism implies nonexistence.

## What is in the evidence package

The package includes the 32-page manuscript and editable LaTeX, current review dispositions, historical response, source comparison, claim and falsifier ledgers, supporting code and results, pinned dependencies, AI index and complete file manifest. Original prose and data are CC0; original code is MIT. Third-party material retains its stated terms.
