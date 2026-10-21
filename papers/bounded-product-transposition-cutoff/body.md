## Summary

**The shuffle.** Take a deck of $n$ cards. At each step pick two cards at random and swap them; if the same card is picked twice, do nothing. When every card is equally likely to be picked, this is the classical *random transposition shuffle*. It is a standard model for how quickly a random process forgets where it started, studied in probability, card shuffling and the mathematics of sampling.

**Cutoff.** Many such shuffles show *cutoff*: for a long time the deck stays far from random, and then, within a comparatively short stretch of steps, it becomes almost perfectly random. The interesting questions are when that transition happens and how short the transition window is.

**The question.** Can unequal card-selection probabilities preserve the abrupt transition from an ordered deck to a random permutation? Suppose each card has its own probability of being picked, and two labels are drawn independently from those probabilities. A problem from an American Institute of Mathematics workshop on Markov chain mixing times asks about such biased shuffles. Earlier work handled two equally sized classes of cards; the general case allows every card a different weight.

**What was found.** This candidate gives a proof that they do when every probability remains between fixed positive multiples of $1/n$. Each step draws two labels independently and swaps them; drawing the same label twice does nothing. The result permits arbitrarily many probability classes. The mixing time has order $n\log n$, while the transition window has upper bound $O(n\log\log n)$. That window is a vanishing fraction of the mixing time. These are asymptotic orders, not a formula telling you exactly how many swaps to perform.

**How, in words.** The proof compares the biased shuffle with the uniform one through a "gradient" that measures how much a function changes under one swap. Because the uniform reference is unchanged by relabelling, the comparison costs a fixed factor once over the whole run, not once per step. Entropy estimates then squeeze the transition into the narrow window, and a smoothing argument transfers the result back to ordinary one-step-at-a-time shuffling.

**Status.** The result does not identify the exact transition location or an optimal window, and remains an unrefereed proof candidate. Finite exact checks accompany the written proof but do not certify the asymptotic theorem.

## Summary for specialists

For any triangular array of probability vectors satisfying $c/n\le p_i^{(n)}\le C/n$, with fixed $0<c\le C<\infty$, the independent-pair transposition walk on $S_n$ has worst-start total-variation cutoff. Uniformly over such arrays, for fixed $0<\epsilon<1/2$,

$$
t_P(\epsilon)=\Theta_{c,C,\epsilon}(n\log n).
$$

The window from precision $1-\epsilon$ to precision $\epsilon$ has upper bound

$$
O_{c,C,\epsilon}(n\log\log n).
$$

This is Theorem 1 of the paper. An unordered distinct transposition has mass $2p_ip_j$ and the identity has mass $q=\sum_i p_i^2$. No restriction on the number of weight classes or convergence of their empirical distribution is imposed. Here cutoff means $t_P(\epsilon)/t_P(1-\epsilon)\to1$ for every fixed $0<\epsilon<1/2$, with $t_P(\eta)$ the first discrete time at which the worst-start total-variation distance is at most $\eta$. Finitely many small $n$ are immaterial; $1+\log\log(n+2)$ can replace $\log\log n$ in nonasymptotic notation. The theorem concerns only the product-weight branch of AIM-PROBABILITY-0050.

## Technical account

**All-time gradient comparison (Lemma 1).** The key reference object is the uniform transposition square-gradient form $\Gamma_0$. Identity moves contribute nothing, so pointwise $c^2\Gamma_0 f\le\Gamma f\le C^2\Gamma_0 f$. Conjugation merely permutes its transposition directions, so Jensen's inequality gives $\Gamma_0T_\nu\le T_\nu\Gamma_0$ for any increment law $\nu$. Comparing the weighted form on both sides yields

$$
\Gamma H_t\le (C/c)^2 H_t\Gamma.
$$

Crucially, the constant is paid once for the entire time-$t$ law, not once per jump. A variance interpolation identity then supplies the local variance estimate needed by the information-differential method:

$$
\operatorname{Var}_{H_t(x,\cdot)}(g)\le2Kt\,H_t(\Gamma g)(x),\qquad K=C^2/c^2.
$$

The argument is specific to a conjugation-invariant reference form on a group; it does not assert stability of cutoff under arbitrary bounded perturbations of arbitrary chains.

**Rough mixing bounds.** Modified logarithmic Sobolev comparison gives an $O(n\log n)$ upper bound: the weighted entropy production dominates $c^2$ times the uniform one, and the uniform shuffle has inverse modified log-Sobolev constant $O(n)$. Untouched labels supply a matching lower order; the proof retains the positive covariance caused by their shared swap edge. At $t_*=n\log n/(4C)$ the expected number of untouched labels is at least $\sqrt n$, so the walk still has many fixed points and is far from uniform.

**The entropy window.** Entropy and varentropy inequalities shrink the continuous-time transition to an $O(n\log\log n)$ window. A Lipschitz bound on $\log f_t$ of order $\log n$, the variance estimate above and a reverse entropy inequality give a differential inequality showing that at time $t_{\mathrm{ct}}(1-\epsilon)+n$ the entropy is at most of order $(\log n)^2$. The log-Sobolev decay then needs only a further $O_{c,C,\epsilon}(n\log\log n)$ time to make the entropy small, and Pinsker's inequality finishes.

**Removal of averaging.** Hermon–Peres averaging transfers the window to two-consecutive-step averages. Since $q$ is only of order $1/n$, fixed laziness cannot be assumed. A separate binomial smoothing estimate shows successive discrete laws are $o(1)$ apart near the mixing scale and removes the averaging: writing $P=qI+(1-q)R$, consecutive laws differ by $O([kq(1-q)]^{-1/2})$ in total variation.

## Evidence, assurance and limitations

The written argument and its stated literature inputs support the theorem. Exact rational diagnostics on $S_2$ through $S_5$ check normalization, conjugation, a tagged-label projection, gradient inequalities and binomial identities. They include 3,648 gradient point checks and five deliberately invalid constructions that must be rejected, in normal and optimized Python. None of these finite tests certifies the asymptotic statement.

Five producer-coordinated editorial roles reviewed one frozen package. These are internal model-assisted reports, not unaffiliated specialist review or formal verification. Historical priority remains unconfirmed. The original Gao–Quastel full text was not retrieved; its normalized log-Sobolev input was corroborated in the inspected Pedrotti–Salez account.

Excluded conclusions include an explicit cutoff location, optimal window, limiting profile and the general nonproduct edge-weight problem. The supplied review is retained privately because its redistribution rights were not established.

## Relationship to earlier work

Nestoridi–Yan obtain a sharper location and order-$n$ window for two equally sized weight classes. This candidate trades that sharpness for arbitrary bounded vectors. Their introduction explains the defect in the earlier strong-stationary-time argument of Bernstein–Bhatnagar–Pak, which this candidate does not use. Pedrotti–Salez supply the entropy method and, in their later work, general subcommutation machinery. The candidate contribution is the reference-form comparison and its application with a discrete-time bridge, not invention of the broader method. A bounded search did not locate the exact all-vector assertion, which does not certify priority.

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

```sh
shasum -a 256 -c MANIFEST.sha256
python3 verify.py
python3 -O verify.py
```

Read Sections 3–6 of the paper for the all-time comparison, entropy step and removal of averaging. A successful replay does not replace those arguments.

## The most valuable next projects

1. Obtain unaffiliated scrutiny of the complete probability argument and contribution-specific novelty.
2. Determine a cutoff location for general bounded arrays and improve the window bound.
3. Fix normalization and periodicity conventions before extending the argument to nonproduct rates.

## Who might contribute

Specialists in mixing times, entropy methods and interchange processes can assess the proof and its relationship to existing cutoff criteria. Independent software checks would add a different, finite assurance dimension.

## What is in the evidence package

The package contains the six-page PDF, TeX and accessible Markdown, exact checker and output, machine-readable claims, citation audit, review response, internal editorial reports, manifest and component licences. GitHub provides versioned source and CI; Zenodo supplies the archived version identity. Original prose and data are CC0-1.0, original code is MIT, and cited third-party works retain their own rights.
