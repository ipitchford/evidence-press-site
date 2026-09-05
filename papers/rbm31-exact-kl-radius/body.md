## Summary

Three yes-or-no variables can exhibit a pattern that a mixture of two independent models cannot capture perfectly. How large can the unavoidable approximation error be? This computer-assisted proof candidate gives an exact answer, approximately **0.831 bits**, and identifies the two worst cases: uniform even and odd parity.

The constant was conjectured previously. This release contributes a proposed complete proof, exact certificates and a program that turns a supplied rational target into a certified feasible approximation. It remains an anonymous, AI-assisted, unrefereed candidate.

## Summary for specialists

Let $\mathcal M_{3,2}$ be the closed model of two Bernoulli-product components on three bits, equivalently $\overline{\mathrm{RBM}(3,1)}$. With natural logarithms, the candidate theorem is

$$
\max_{p\in\Delta_7}\min_{q\in\mathcal M_{3,2}}D(p\Vert q)
=c=-\frac34\log(2\sqrt3-3).
$$

Only the two uniform parity targets maximize this quantity; each has four translated nearest distributions. For general product mixtures the elementary conditioning consequence is

$$
R(n,k)\le c\qquad(n\ge3,\ k\ge2^{n-2}).
$$

The higher-dimensional statement is an **upper bound**, not a sharp-radius or maximizer classification. General product mixtures must not be identified with larger RBMs.

## Technical account

The proof has three connected mechanisms. A positive two-product mixture satisfies log-supermodular inequalities after coordinate relabelling. Three exact positive multipliers certify the parity lower bound inside all relevant cones, including the boundary by a stated limit argument.

For the upper bound, reversing a local binary channel removes a positive target entry while never decreasing the distance to the model. Repetition leaves a zero-distance case or one of six support orbits. The remaining weights are arbitrary real numbers: they are not discretized.

A finite cover then assigns one feasible model distribution to each simplex. The checker verifies its divergence at every vertex. Convexity in the target carries the bound to every point of that simplex. Strict convexity and the equality condition for data processing identify the only maximizers.

The constructive program follows the same channel and subdivision choices and returns exact mixture parameters. It is a feasible-witness tool, not a general maximum-likelihood solver. Conditioning on the other coordinates transfers the guarantee to the stated all-$n$ component budget.

## Evidence, assurance and limitations

The package contains an 11-page paper, aligned Markdown, six exact certificate files, a standalone standard-library checker and an exact query interface. Its 52 roots lead to 16,600 leaves at maximum depth 20. The 93,792 vertex conditions include 552 parity equality incidences; all others are strictly certified.

Normal and optimized Python runs, fresh extraction, semantic rejection controls, query examples and PDF inspection are producer-side evidence. The checker was implemented separately from discovery within that workflow. The supplied review and the five-role internal editorial gate are not authenticated external specialist review. No independent-person reproduction, formal verification, journal peer review, exhaustive novelty or priority claim is supplied.

All five internal roles recommend Accept with no Critical or Major findings. Read the [editorial decision and review limits](https://github.com/ipitchford/rbm31-exact-kl-radius/blob/v0.1.0-candidate/editorial/DECISION.md) and the [response to their nonblocking notes](https://github.com/ipitchford/rbm31-exact-kl-radius/blob/v0.1.0-candidate/editorial/RESPONSE.md). The exact frozen review ZIP remains a separate release asset.

The four-star stretch produced an executable interface and an infinite-family consequence. These demonstrate scoped reuse, not a substantiated four-star rating or measured impact.

## Relationship to earlier work

Montúfar's 2018 review, Section 9 item 10, records the proposed constant and asks for maximizers; it does not explicitly identify parity there. Allman and collaborators' nonnegative-rank-two and boundary work supplies important context. The neighboring Seigal–Montúfar result concerns a different model.

Alexandr and Hoşten use strict convexity on logarithmic Voronoi polytopes for linear and toric models. Here the simplices carry common feasible witnesses for a nonconvex mixture model; those witnesses need not remain optimal across their cells. The conditioning mechanism is the classical disjoint-support mixture principle of Montúfar, Rauh and Ay. The new numerical consequence depends on the candidate three-bit theorem.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraic statisticians | Inspect a sharp small latent-class approximation problem and its equality cases. | The analytic bridges remain open to unaffiliated review. |
| Information geometers | Compare common-witness covers with projection-cell methods. | A cover cell is not claimed to be a logarithmic Voronoi cell. |
| Verification and tool builders | Reuse a rational target interface and transparent exact certificate. | Passing a checker is not a proof-assistant theorem. |
| Interested readers | See why a finite certificate can cover a continuous problem. | The result is model-specific, not a general claim about AI models. |

## Why the problem matters

Small models provide places to understand approximation error exactly. The challenge here is to exclude every more difficult target, not just to fit the parity example well. The channel reduction and continuous-cover argument make that global step inspectable. The larger-model consequence gives a concrete transfer target while leaving its sharpness open.

## How to inspect or reproduce the recorded checks

Download the [complete versioned ZIP](https://github.com/ipitchford/rbm31-exact-kl-radius/releases/download/v0.1.0-candidate/rbm31-exact-kl-radius-0.1.0-candidate.zip), verify its [SHA-256 sidecar](https://github.com/ipitchford/rbm31-exact-kl-radius/releases/download/v0.1.0-candidate/SHA256SUMS.txt), extract it and run:

```sh
python3 build_release.py --check
python3 verify.py
python3 test_verify.py
python3 test_witness.py
```

Python 3.10 or newer is sufficient; no third-party package is needed. Repeat with `python3 -O` to confirm that proof rejection does not depend on removable assertions. Expected: all six covers pass, 13 verifier tests pass and five constructive test groups pass.

The worked target is available through `python3 witness.py 3/16 1/16 0 1/4 0 1/4 3/16 1/16`. Its exact trace ends at parity and leaf `0:00000000`. Output coordinate arrays are explicitly least-significant-bit first. See the environment note for optional discovery and PDF rebuilding.

## The most valuable next projects

First reconstruct the analytic-to-code interface without importing the producer implementation. Then seek a smaller certificate or formalize the exact checker and its analytic bridges. Higher-dimensional sharpness at the stated component budget is a substantive mathematical follow-up, not a claim already proved here.

## What is in the evidence package

The PDF and Markdown give the proof and attribution; the six JSON trees and verifier carry the finite lemma; the query program and worked example expose constructive use. Tests, replay receipts, references, claim index, review response, internal editorial records, environment notes, licences and a complete manifest explain exactly what can be checked and what remains unassessed. GitHub and Zenodo supply the versioned public artefacts linked alongside this page.
