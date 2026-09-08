## Summary

Can unequal card-selection probabilities preserve the abrupt transition from an ordered deck to a random permutation? This candidate gives a proof that they do when every probability remains between fixed positive multiples of $1/n$. Each step draws two labels independently and swaps them; drawing the same label twice does nothing.

The result permits arbitrarily many probability classes. The mixing time has order $n\log n$, while the transition window has upper bound $O(n\log\log n)$. That window is a vanishing fraction of the mixing time. The result does not identify the exact transition location or an optimal window, and remains an unrefereed proof candidate.

## Summary for specialists

For any triangular array of probability vectors satisfying $c/n\le p_i^{(n)}\le C/n$, with fixed $0<c\le C<\infty$, the independent-pair transposition walk on $S_n$ has worst-start total-variation cutoff. Uniformly over such arrays, for fixed $0<\epsilon<1/2$,

$$t_P(\epsilon)=\Theta_{c,C,\epsilon}(n\log n).$$

The window from precision $1-\epsilon$ to precision $\epsilon$ has upper bound

$$O_{c,C,\epsilon}(n\log\log n).$$

An unordered distinct transposition has mass $2p_ip_j$ and the identity has mass $q=\sum_i p_i^2$. The theorem concerns only the product-weight branch of AIM-PROBABILITY-0050.

## Technical account

The key reference object is the uniform transposition square-gradient form $\Gamma_0$. Conjugation merely permutes its transposition directions, so Jensen's inequality gives $\Gamma_0T_\nu\le T_\nu\Gamma_0$ for any increment law $\nu$. Comparing the weighted form on both sides yields

$$\Gamma H_t\le (C/c)^2 H_t\Gamma.$$

Crucially, the constant is paid once for the entire time-$t$ law, not once per jump. A variance interpolation identity then supplies the local variance estimate needed by the information-differential method.

Modified logarithmic Sobolev comparison gives an $O(n\log n)$ upper bound. Untouched labels supply a matching lower order; the proof retains the positive covariance caused by their shared swap edge. Entropy and varentropy inequalities shrink the continuous-time transition to an $O(n\log\log n)$ window.

Hermon–Peres averaging transfers the window to two-consecutive-step averages. Since $q$ is only of order $1/n$, fixed laziness cannot be assumed. A separate binomial smoothing estimate shows successive discrete laws are $o(1)$ apart near the mixing scale and removes the averaging.

## Evidence, assurance and limitations

The written argument and its stated literature inputs support the theorem. Exact rational diagnostics on $S_2$ through $S_5$ check normalization, conjugation, a tagged-label projection, gradient inequalities and binomial identities. They include 3,648 gradient point checks and five deliberately invalid constructions that must be rejected, in normal and optimized Python. None of these finite tests certifies the asymptotic statement.

Five producer-coordinated editorial roles reviewed one frozen package. These are internal model-assisted reports, not unaffiliated specialist review or formal verification. Historical priority remains unconfirmed. The original Gao–Quastel full text was not retrieved; its normalized log-Sobolev input was corroborated in the inspected Pedrotti–Salez account.

Excluded conclusions include an explicit cutoff location, optimal window, limiting profile and the general nonproduct edge-weight problem.

## Relationship to earlier work

Nestoridi–Yan obtain a sharper location and order-$n$ window for two equally sized weight classes. This candidate trades that sharpness for arbitrary bounded vectors. Pedrotti–Salez supply the entropy method and, in their later work, general subcommutation machinery. The candidate contribution is the reference-form comparison and its application with a discrete-time bridge, not invention of the broader method.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probability researchers | Inspect a comparison route for inhomogeneous shuffles. | Check the full proof and literature independently. |
| Sampling researchers | Understand qualitative mixing robustness under bounded selection bias. | The theorem is not an exact operational stopping rule. |
| Research agents | Reuse the proof decomposition and exact diagnostic controls. | Preserve the all-$n$ versus finite-test distinction. |

## Why the problem matters

Unequal selection rates destroy a symmetry available to the usual uniform shuffle. A reference-gradient comparison can retain enough structure to prove an abrupt transition without solving the full spectrum. That is a methodological possibility, not evidence of a measured computational speedup or a theorem about arbitrary perturbations.

## How to inspect or reproduce the recorded checks

Download and extract the versioned source ZIP. In its `research` directory, run `python3 verify.py` and `python3 -O verify.py`. Both outputs should match `verification.json`, including all five expected rejection controls. The checker uses only the standard library; the release records the tested local interpreter and separate Linux CI. Verify file hashes against `MANIFEST.sha256` before replay.

Read Sections 3–6 of the paper for the all-time comparison, entropy step and removal of averaging. A successful replay does not replace those arguments.

## The most valuable next projects

1. Obtain unaffiliated scrutiny of the complete probability argument and contribution-specific novelty.
2. Determine a cutoff location for general bounded arrays and improve the window bound.
3. Fix normalization and periodicity conventions before extending the argument to nonproduct rates.

## Who might contribute

Specialists in mixing times, entropy methods and interchange processes can assess the proof and its relationship to existing cutoff criteria. Independent software checks would add a different, finite assurance dimension.

## What is in the evidence package

The package contains the six-page PDF, TeX and accessible Markdown, exact checker and output, machine-readable claims, citation audit, review response, internal editorial reports, manifest and component licences. GitHub provides versioned source and CI; Zenodo supplies the archived version identity. Original prose and data are CC0-1.0, original code is MIT, and cited third-party works retain their own rights.
