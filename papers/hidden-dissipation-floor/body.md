## Summary

A system can look identical when its visible history is played forwards or backwards, yet every compatible hidden mechanism may have to dissipate energy. The question is whether adding ever more hidden states can make that cost approach zero.

For a precise class of two-state observations, this candidate gives a complete answer. Zero minimum cost is possible exactly when **both complete waiting-time laws are positive mixtures of exponential distributions**. In that case a finite reversible model already suffices. Otherwise no growing sequence of compatible finite architectures can approach zero cost.

The classification is the main result. A worked example also gives a certified numerical floor, and a second example shows why checking the variance alone can miss the obstruction.

## Summary for specialists

Let $P$ be a finite-realizable stationary ergodic two-label alternating-renewal law, observed deterministically from a finite irreducible CTMC. Use ordinary time reversal with even microscopic variables and
$$
\sigma(Q)=\sum_{i<j}(\pi_iQ_{ij}-\pi_jQ_{ji})
\log\frac{\pi_iQ_{ij}}{\pi_jQ_{ji}}.
$$

Writing $V_\infty(P)$ for the infimum over **all** compatible finite architectures, Theorem 9 of the revised paper states
$$
V_\infty(P)=0
\iff
\text{both complete dwell laws are hyperexponential}
\iff
\text{a finite reversible exact realization exists}.
$$

For the ring target $P_{1/20}$, the fixed-window certificate at $t=3/10$ proves
$$
V_\infty(P_{1/20})>0.017568198744.
$$

The ring competitor gives the separate upper bound $(19/20)\log 20\approx2.84595$. The numerical gap is not an error bar: neither the lower certificate nor the competitor is known to be optimal.

## Technical account

**Why the bound survives hidden complexity.** Compare a candidate generator $Q$ with its additive reversibilization $R=(Q+Q^\dagger)/2$. The stationary distribution and exit rates agree. The relative entropy of path laws on a window of length $T$ is at most $T\sigma(Q)/4$.

Conditional on the present microscopic state, reversible past and future persistence events are independent with the same probability. Mixing over that state gives nonnegative covariance. A target with negative covariance stays separated from every reversible comparison, regardless of hidden dimension.

For fixed windows, let $H(t)$ be the probability of uninterrupted residence in the visible block throughout a stationary interval of length $t$, and $p$ its stationary mass. With $a=H(t)/p$, $b=H(2t)/p$ and $b<a^2$,
$$
\sigma(Q)\geq\frac{2p}{t}I(a,b),
$$
where $I$ is the mutual information of the two Bernoulli persistence tests. Equal endpoint labels are not a substitute for uninterrupted residence.

**What the classification adds.** If a sequence of exact realizations had vanishing dissipation, its reversible comparisons would have persistence functions converging to the target. Positive spectral mixtures survive this limit. Finite realizability of the fixed target then forces the limiting mixture to have finite support. A reversible reset construction proves the converse. Hyperexponential marginals do not imply the same conclusion for arbitrary nonrenewal processes.

**Beyond a variance test.** The package supplies a four-state realization with
$$
f_B(t)=\frac{81}{160}e^{-3t/4}
-\frac{49}{160}e^{-7t/4}
+\frac{1}{200}e^{-t/100}.
$$
Its squared coefficient of variation is $324697/112903>1$, so the elementary equilibrium variance condition does not exclude it. Its negative exponential residue does. The classification therefore establishes positive minimum cost without assigning its value.

A further corollary tolerates a simultaneous error box: if $p\geq p_0>0$, $a\geq a_0\geq0$ and $b\leq b_1$ with $\eta=a_0^2-b_1>0$, then the fixed-window floor is $16p_0\eta^2/t$.

## Evidence, assurance and limitations

The proofs are analytic. Exact rational code encloses the fixed-window certificate between **0.017568198744 and 0.017568198745**, checks the original exponential-clock certificate, and verifies the additional example and error-box substitution. The upper endpoint encloses the certificate, not the physical optimum.

Thirteen symbolic identities, 180 random-chain diagnostics, 1,000 information-projection diagnostics and 32 ring-family cases supply additional internal checks. Six invalid-input or false-bound controls and explicit one-way-edge/equilibrium controls address implementation failures. Verification remains active under Python's optimised mode.

The supplied model review and separately written audit informed revision; the fixed-window suggestion is credited to that audit. These checks are not external human peer review, unaffiliated reproduction or proof-assistant verification. The result remains an **unrefereed candidate**.

The theorem assumes stationarity, finite-realizable exact observations, deterministic labels and even-variable reversal. It does not establish experimental confidence intervals, sample complexity, odd-variable extensions or the optimal positive dissipation. A valid error box must be justified separately, including temporal dependence and any data-adaptive choice of window.

## Relationship to earlier work

The equilibrium exponential-mixture restriction is established prior work, explicitly derived by Skinner and Dunkel and linked there to Tu's earlier switching analysis. Ehrich and Nitzan, Ghosal and Bisker study hidden-model fitting and entropy-production bounds from observed statistics.

The additional claim here is the **zero-cost closure statement under unbounded hidden dimension and rates**, together with an explicit dimension-independent separation certificate. The paper addresses the zero-limit question posed for Aznagulov's exact target, without relying on that preprint's compactification claims. It does not settle the separate question of positive-infimum attainment or claim universal superiority over existing estimators.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Stochastic thermodynamics researchers | Test whether unknown hidden architecture can remove an inferred dissipation floor. | Match the reversal convention and complete observation law. |
| Hidden-process and probability researchers | Reuse the closure argument linking reversible spectral mixtures to finite realizability. | Renewal independence is needed for sufficiency. |
| Experimental inference researchers | Develop robust bounded-observable dissipation tests. | The error-box corollary is not a statistical confidence procedure. |

## Why the problem matters

Excluding equilibrium separately for every small hidden model is weaker than ruling out an increasingly complex sequence whose cost tends to zero. The classification closes that logical gap for the stated process class. It explains when ignorance of microscopic architecture is—and is not—an escape from a positive thermodynamic conclusion.

## How to inspect or reproduce the recorded checks

Start with the [paper](https://github.com/ipitchford/hidden-dissipation-floor/releases/download/v1.1.0-candidate/paper.pdf) and [AI index](https://github.com/ipitchford/hidden-dissipation-floor/blob/v1.1.0-candidate/AI_INDEX.md). From the released archive:

~~~sh
python3 evidence/verify_exact.py
python3 evidence/verify_extensions.py
~~~

Those two checks need only Python's standard library. For the full read-only replay, install the pinned optional dependencies in an isolated environment, then run:

~~~sh
python3 evidence/replay.py
~~~

The wrapper checks hashes, executes in a temporary copy, and tests normal and optimised Python modes. Arithmetic replay does not establish the analytic proof's adequacy.

## The most valuable next projects

Determine the best attainable positive cost and whether a finite optimizer exists; construct dependence-aware confidence sets for the observable test; and seek unaffiliated review or formalization of the closure argument. These are separate projects, not missing claims silently assumed by this release.

## What is in the evidence package

The revised twelve-page paper and LaTeX source, exact and diagnostic checkers, recorded results, read-only replay wrapper, AI index, complete review-response matrix, dated prior-art and limitation records, provenance, component licences and SHA-256 manifest. The supplied private referee archive is not redistributed under an assumed licence.

