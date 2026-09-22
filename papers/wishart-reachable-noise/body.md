## Summary
Covariance models describe how many fluctuating quantities move together. In an infinite-dimensional model, an apparently reasonable stochastic equation may have no solution in the desired space. This candidate identifies the geometry controlling existence for a class of operator-valued Wishart processes: where the noise can travel under the drift.

Even noise entering through one direction can spread through infinitely many directions. The paper proposes a complete criterion for deterministic initial covariance, while keeping a necessary Gaussian path-continuity condition explicit.

## Summary for specialists
Let $S(t)$ be a strongly continuous semigroup on a real separable Hilbert space, $Q$ a bounded positive operator, and $x$ a positive trace-class initial covariance. Define $K=\overline{\operatorname{span}}\{S(t)^*\sqrt QH:t\ge0\}$.

For $0<m=\dim K<\infty$, put $k=\operatorname{rank}(P_{K^\perp}xP_{K^\perp})$. The candidate criterion requires $k<\infty$ and
$$
(\alpha\in\mathbb N_0\ \text{and}\ \operatorname{rank}x\le\alpha)\quad\text{or}\quad\alpha\ge m+k-1.
$$
If $\dim K=\infty$, the zero process is available at $\alpha=0,x=0$. Otherwise existence requires a positive integer $\alpha\ge\operatorname{rank}x$ and a continuous Hilbert-space version of the associated Gaussian Ornstein–Uhlenbeck convolution. For $Q=0$, the solution is deterministic for every real parameter. The stated solution law is unique.

## Technical account
A finite-rank transform argument avoids importing an infinite-dimensional determinant formula under a disputed smoothing hypothesis. A singular-scale noncentral Wishart reduction subtracts the rank of initial covariance outside the scale range from the degree parameter. Reachable-subspace geometry then provides the necessary restrictions.

For infinite reachable dimension, the rank argument uses compression dimension $n+2$ at integer parameter $n$. Dimension $n+1$ would land on an unrestricted boundary and would not justify that inference. A separate Gram-path lifting lemma transfers trace-norm continuity to Gaussian factors. Gaussian factors and an independent residual finite-dimensional Wishart diffusion provide the matching constructions.

The manuscript credits the positive-scale distribution theorem, central singular-scale classification, Kalman/Gramian method and older integer Gaussian partition formulas. Its operator-order proposition concerns the exact printed sufficiency implication in Cox–Cuchiero–Khedher's Theorem 2.1; it does not reject all results of that paper. The cover schematically shows an evolving family of directions, not a numerical simulation.

## Evidence, assurance and limitations
The 13-page manuscript supplies the proposed proof. The exact checker verifies finite block-transform identities, Schur factorization and a controllability Gramian, with three corrupted-formula controls and a dimension-boundary safeguard. Normal and optimized Python agree. These checks do not certify the infinite-dimensional analysis.

This is an unrefereed candidate. Internal model-mediated editorial review and a local rerun of a supplied checker do not establish independent reproduction, external specialist review, journal peer review or formal verification. The dated literature comparison found no full earlier criterion, but historical priority remains unestablished.

The full existence classification concerns deterministic initial covariance. The injective-noise noninteger obstruction extends to random initial data by conditioning. No general random-initial existence theorem, strong-solution theorem, pathwise uniqueness, or pricing-performance benefit is claimed.

## Who should care, and why
| Audience | Potential use | Required qualification |
|---|---|---|
| Stochastic analysts | Inspect a proposed resolution of noninteger and degenerate-noise existence questions | The general-semigroup argument needs unaffiliated specialist review |
| Covariance-model researchers | Check drift reachability and initial outside rank before using a model | Gaussian continuity remains a separate analytic requirement |
| Probability theorists | Examine the arbitrary-real-degree singular-scale reduction | Established positive-scale and Gaussian partition results remain prior work |

## Why the problem matters
Admissibility precedes approximation or calibration: a model must exist in its declared state space before those tasks make mathematical sense. The candidate replaces instantaneous noise rank with the subspace reached over time and shows how initial covariance outside that subspace shifts the parameter threshold. This clarifies model construction without establishing downstream empirical gains.

## How to inspect or reproduce the recorded checks
Extract the versioned archive, install its pinned requirements, and run:
```sh
python3 -m pip install -r requirements.txt
python3 verify_identities.py > /tmp/wishart-replay.json
python3 -O verify_identities.py > /tmp/wishart-optimized.json
cmp identity-results.json /tmp/wishart-replay.json
cmp identity-results.json /tmp/wishart-optimized.json
shasum -a 256 -c MANIFEST.sha256
```
Read the complete proof and cited finite-dimensional theorems separately. The archive also records the supplied review response and the previously corrected dimension-boundary error.

## The most valuable next projects
Obtain unaffiliated specialist scrutiny of the continuity and stochastic construction arguments. Develop convenient Gaussian continuity criteria for useful semigroup classes. Extend full existence to random initial laws using measurable solution kernels, with the additional work stated explicitly.

## What is in the evidence package
The package contains PDF, TeX and Markdown manuscripts; the exact verifier and expected output; claim, source, environment and licence records; internal editorial reports; review responses; and a complete manifest. Original prose and data use CC0; original code uses MIT. Cited papers and supplied third-party review files are not relicensed or redistributed.
