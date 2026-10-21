## Summary

A detector may record only a fraction of the jumps of a random process. Even when the average detected count is finite, its long-run uncertainty can be enormous. This paper identifies an exact boundary for a broad class of infinite birth–death chains: one cumulative edge-energy series determines whether the stationary variance has a finite growth rate.

Finite energy also gives a Brownian functional limit. But a Brownian limit is not a promise that variances behave well for every starting distribution. A worked counterexample separates these two conclusions. The paper further handles several detectors, including correlated detection decisions at the same jump.

**Status.** An anonymous research candidate. The infinite-state conclusions are written analytic proofs; exact finite checks test identities and normalisations. It is unrefereed and internally assessed, with no proof-assistant verification or unaffiliated replication.

## Summary for specialists

Let $c_k=\pi_k\lambda_k$ be the edge conductance of a nonexplosive, irreducible, positive recurrent continuous-time birth–death chain. Upward and downward retentions have probabilities $a_k,b_k$, with $0<r=\sum_k c_k(a_k+b_k)<\infty$. Put $\delta_k=(a_k-b_k)/2$, let $v$ be the symmetrised retained intensity, and define $H_k=\sum_{i\le k}\pi_i(v_i-r)$.

The extended stationary variance rate is

$$
\sigma^2=r-2\sum_k c_k\delta_k^2+2\sum_k\frac{H_k^2}{c_k}.
$$

It is finite exactly when the last series is finite. In that case the centred count has a functional central limit theorem from every fixed initial probability law. Convergence of variance is established under stationarity and under initial laws with bounded density relative to $\pi$, not for arbitrary initial laws.

## Technical account

The proof decomposes the count into a symmetric edge contribution and a directional endpoint correction. Detailed balance turns the ordered pair-of-jumps calculation into the covariance kernel of the symmetrised intensity. An $L^1$ resolvent argument identifies its integrated value with the cumulative edge energy. A forward–backward martingale estimate controls an unbounded corrector by its gradient energy rather than by an unnecessary square-integrability assumption on the corrector itself.

The joint-count extension permits dependence between coordinates of a mark at the same jump, while marks at distinct jumps remain conditionally independent given the chain path. Its covariance matrix contains a shared-chain energy term and a simultaneous-mark term. Consequently, identical detectors and conditionally independent detectors can have the same marginal retention probabilities but different cross-covariances.

## Evidence, assurance and limitations

The infinite-state conclusions are analytic theorems in the manuscript. Exact finite-generator, renewal, arithmetic and joint-mark checks test identities and normalisations; they are not a proof-assistant verification or an unaffiliated replication of the analytic argument. The candidate is unrefereed and internally assessed.

Finite retained intensity is required, but finite mean raw activity and square-integrable retained intensity are not. Divergent edge energy establishes divergent stationary variance per unit time; it does not rule out every possible weak limit or alternative scaling. The result concerns a line-shaped birth–death graph, not arbitrary networks.

## Relationship to earlier work

Daley, Nazarathy and Wang supply the finite-state thinned-count setting. Chojecki's 2011 theorem is an important close antecedent: it uses a cumulative-square criterion for a discrete-time state observable. General jump-count functional limits and reversible additive-functional methods are also established. The manuscript distinguishes those results from its continuous-time marked-count theorem under the stated weaker integrability conditions and its explicit variance alternative.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Queueing and probability researchers | Determine long-run uncertainty of partially observed events | Verify the chain and finite retained-rate assumptions |
| Observation-model designers | Compare directional thinning and joint detectors | Marginal retention does not determine joint covariance |
| Applied modellers | Avoid equating a Gaussian limit with convergence of variance | The initial distribution can destroy finite moments |

## Why the problem matters

A mean count can look ordinary while its uncertainty is pathological. A sharp criterion tells the modeller exactly which infinite tail must be controlled, and why finite-state truncations alone cannot settle the question.

## How to inspect or reproduce the recorded checks

Read the notation guide and main theorem first, then follow the energy, count-variance and corrector lemmas. The package README and AI index map each claim to its proof and replay files. Reproduce the finite-generator and renewal identities, inspect the infinite-state examples analytically, and run the joint-mark covariance checks separately. Finite tests support the formulas but do not replace the infinite-state proof. With Python 3.10 or later (standard library only):

```sh
python3 -B reproduce_checks.py --record-dir /tmp/counts-normal-new
python3 -B -O reproduce_checks.py --record-dir /tmp/counts-optimized-new
```

Choose new output directory names; the runner refuses an existing destination. It checks exact finite generators, renewal formulas and example arithmetic, joint covariance identities, and semantic corruption controls. `expected_verification.json` is a baseline generated by the reconstructed scalar checker, not an independent or historically recovered proof certificate.

## The most valuable next projects

Develop certified tail bounds for usable finite truncations, characterise non-Gaussian scaling when the energy diverges, or investigate which parts of the explicit criterion survive on graphs with branches. Each requires new arguments beyond the published theorem.

## What is in the evidence package

A self-contained manuscript and PDF, exact finite-state and example calculations, joint-mark checks, replay instructions and environment information, a claim-to-evidence index, and a source comparison preserving the boundary between established methods and the candidate's contribution.
