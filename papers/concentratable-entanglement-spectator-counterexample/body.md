## Summary

A useful entanglement test must distinguish quantum correlations from ordinary uncertainty. This candidate identifies a simple way a proposed upper bound can confuse the two. Start with an entangled pair of qubits, then place an unrelated mixed qubit beside it. The entanglement measure stays at one quarter, but the proposed upper-bound statistic falls to three sixteenths. A number below the quantity it is meant to bound cannot be a universal upper bound.

The extra qubit changes which measurement outcomes are counted. The underlying test counts a nonzero even number of antisymmetric outcomes. An antisymmetric spectator outcome changes an otherwise counted event from even to odd and removes it from the statistic. The candidate gives exact proofs of this mechanism, extends the failure beyond an unrelated spectator, and identifies corrections that really are upper bounds.

The wider scope matters. Counterexamples survive ordinary white noise and can also be genuinely entangled across all three parties. A separate measurement criterion can certify failure without assuming that the experimental state has the ideal product form. The release is an unrefereed mathematical candidate, with its proof and finite arithmetic checks supplied for inspection.

## Summary for specialists

For an $n$-qubit density operator define

$$F_n(\rho)=2^{-n}\sum_{A\subseteq[n]}\operatorname{tr}(\rho_A^2).$$

$$U_n(\rho)=\frac{1+\operatorname{tr}(\rho^2)}2-F_n(\rho).$$

Pure-state total concentratable entanglement is $\mathcal C_n=1-F_n$. Let $\mathcal C_n^\cup$ and $\mathcal C_n^\cap$ denote its convex and concave ensemble roofs. For $\rho=|\Phi^+\rangle\langle\Phi^+|\otimes I_2/2$, both roofs equal $1/4$, while $U_3=3/16$. The convex-roof inequality holds for one and two qubits, so three is the minimal counterexample size.

For $\rho_q=[q|\Phi^+\rangle\langle\Phi^+|+(1-q)I_4/4]\otimes I_2/2$, the exact convex roof is $\max(0,3q-1)^2/16$ and $U_3=(9+3q^2)/64$. Failure occurs for $(12+\sqrt{309})/33<q\leq1$; the states are full rank when $q<1$. A separate rank-two genuinely tripartite-entangled family has explicit optimal ensembles for both roofs. One member has convex roof $13/64$, concave roof $9/32$ and statistic $11/64$.

The least constant independent of $n$ in $\mathcal C_n^{\cup,\cap}\leq U_n+c(1-\operatorname{tr}\rho^2)$ is $c=1/2$. For the concave roof at each fixed $n$, the sharp coefficient is $1/2-2^{-n}$. Fixed-size convex-roof optimality is established here only for $n=1,2$, where the coefficient is zero.

## Technical account

The elementary spectator proof uses support, not numerical roof minimisation. Every vector in an ensemble of a pure core tensored with a mixed single qubit has that same core. Appending a pure single qubit leaves pure-state total CE unchanged, so every ensemble average is identical. Subsystem purities factor across tensor products, giving the statistic exactly.

This invariance extends to the convex roof of an arbitrary mixed core. Measuring the spectator in a rank-one basis produces pure conditional core states. Convexity of purity shows that their average CE cannot exceed the original pure-state CE; applying this argument to every ensemble proves the required discard inequality. Product ensembles give the reverse inequality. The concave roof does not share this mixed-core invariance: even a maximally mixed two-qubit state has an entangled Bell-basis decomposition.

The repair follows from an exact variance identity. For any pure ensemble, its mean CE equals $1-F_n(\rho)$ minus the average Hilbert–Schmidt variance of all reduced states. Keeping only the full-system variance yields the fixed-size coefficient. Mixtures of opposite-phase GHZ states attain it for the concave roof. Increasing numbers of Bell pairs with a mixed spectator force the dimension-independent coefficient towards $1/2$ for both roofs.

The globally depolarised example uses Wootters' established concurrence formula and equal-concurrence decomposition: two-qubit convex-roof CE is one quarter of squared concurrence. These classical ingredients are not claimed as new. The genuinely tripartite-entangled construction instead analyses every vector in a two-dimensional support. A convex quadratic in the support weight gives the lower roof by Jensen's inequality and the upper roof by its endpoint chord.

For an arbitrary three-qubit state $R$, let $f=\langle\Phi^+|R_{AB}|\Phi^+\rangle$. The sufficient operational criterion

$$\frac{[\max(0,2f-1)]^2}{4}>U_3(R)$$

certifies a failure of the proposed bound without a product-state or noise-model assumption. With noisy measurements, substitute a simultaneous lower confidence bound for $f$ and an upper confidence bound for $U_3$. The identical-copy assumption remains necessary for interpreting the SWAP statistic as written.

## Evidence, assurance and limitations

The universal assertions rest on written arguments over all pure-state ensembles. Exact arithmetic checks support selected matrices, subsystem purities and measurement probabilities; finite computations alone do not prove a roof optimisation or a statement for every qubit count. The final archive's claim map and replay receipts identify that division of labour.

This is producer-coordinated, AI-assisted work. No unaffiliated rerun, independent reimplementation, end-to-end formal verification, external specialist review or editorial peer review is established. A bounded source search is not proof of historical priority. Publication and a DOI provide access and identity, not those stronger forms of assurance.

Total CE must not be confused with a measure of genuine multipartite entanglement. The first counterexample is biseparable; the separate genuinely tripartite-entangled construction closes that restriction. Nor is the concave roof an ordinary mixed-state entanglement monotone: a fully separable state can have entangled ensemble decompositions. The sharp concave-roof coefficient must not be transferred to the convex roof at fixed $n\geq3$.

## Relationship to earlier work

Foulds, Prove and Kendon formulate the proposed statistic and ensemble roofs. Their source also discusses possible underestimation on page 15 of arXiv:2112.04333v8. The present result supplies exact counterexamples and corrections; it does not claim the source overlooked every warning sign or that its separate lower bounds are refuted.

The pure-state CE framework originates with Beckey and colleagues (2021); Beckey, Pelegrí, Foulds and Pearson (2023) provide the mixed-state convex-roof antecedent. Schatzki and colleagues develop the hierarchy and discuss the measurable $1-F_n$ quantity in supplement XI. Vairogs, Hermes and Leditzky (2026), Theorem 3 and Appendix B, give the related concavity argument for CE assistance. The novelty boundary is the candidate's explicit failures and repair sharpness, not the discovery of purity convexity, the product rule or the existing $1-F_n$ estimate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Quantum-information theorists | Check the separation between the two roofs and sharpen fixed-size convex corrections. | Established concurrence and CE results are inherited; priority is not established. |
| Experimental entanglement researchers | Use the Bell-fidelity criterion to test whether an upper-bound interpretation fails for measured states. | Confidence bounds, calibration and identical-copy assumptions require explicit experimental treatment. |
| Scientific software authors | Add exact counterexamples to tests of mixed-state CE estimators. | A numerical statistic must not acquire a universal bound label from passing selected noise models. |
| Educators and proof-checker developers | Inspect a short support proof, exact roof optimisations and explicit variance accounting. | The released computations are internal checks, not a formalised proof. |

## Why the problem matters

An upper bound supports a different inference from an estimator: it must never fall below the target quantity anywhere in its declared domain. The spectator mechanism shows why a measurement probability that agrees on pure states can fail after mixing. The correction theorem supplies a controlled alternative and makes the cost of ignoring mixedness explicit. Its significance is confined to these mathematical guarantees; no improvement in laboratory performance or downstream use is measured here.

## How to inspect or reproduce the recorded checks

Begin with the manuscript definitions and the three-qubit purity table. Confirm that the sum includes the empty and full subsystems. Then inspect the support proof establishing both exact roofs before comparing them with $U_3$. For the extensions, inspect the discarded-qubit inequality, Wootters dependency, the genuinely entangled support minors, and the GHZ saturation example separately.

Download the frozen evidence archive from the release resources, verify its SHA-256 manifest and follow its README for exact replay commands and Python requirements. Run the archived verifier in its normal and optimised modes, then inspect the negative-control receipt. A clean local rerun checks the shipped arithmetic; a separately derived implementation is a stronger and distinct exercise. The archive's final receipts identify the actual executed scope and environment.

## The most valuable next projects

Determine the sharp convex-roof impurity coefficient at three qubits: this candidate leaves the interval $1/8\leq c_3^\cup\leq3/8$. A valid solution must optimise over all density matrices, not just the displayed families.

Develop experimentally efficient simultaneous confidence bounds for the fidelity-versus-SWAP certificate, including state drift and copy mismatch. The current theorem assumes the mathematical identical-copy model and does not validate a hardware implementation.

Independently inspect the exact roofs and support classification, or formalise the variance and support arguments. These tasks improve assurance of the stated results without requiring a larger counterexample search.

## What is in the evidence package

The final archive contains the mathematical manuscript and editable source, exact checking programs and their inputs, a claim-to-evidence index, dependency and source notes, replay and negative-control receipts, and integrity manifests. Read the README and AI index for the actual file map and command sequence. Explanatory graphics and synthetic audio on this page communicate the result; they are not additional scientific evidence.
