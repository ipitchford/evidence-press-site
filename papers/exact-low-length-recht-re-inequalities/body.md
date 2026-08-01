## Summary

This paper asks a basic question behind many machine-learning algorithms: is it better to shuffle a dataset and use each example once, or keep sampling examples at random? It gives the first exact account of where a leading mathematical justification for reshuffling works, where it fails, and where it recovers. It also finds something more surprising: the usual theoretical measure can say reshuffling is worse even when it actually reduces error. The proof is computer-assisted, exact, and fully replayable.

## Summary for specialists

What makes this paper interesting is that it draws an exact boundary around a natural matrix inequality motivated by random reshuffling: the four-factor case always holds, the five-factor lower bound fails only at the endpoint $n=5$ and is restored from $n=6$, and six factors already yield new infinite families. The proof is backed by replayable exact certificates, while the same example reveals an important optimisation subtlety: reshuffling can worsen the norm of the expected iterate while improving expected squared error and objective value.

## Technical summary

The Recht–Ré inequality asks whether sampling matrix-valued updates without replacement is always at least as contractive as sampling them independently with replacement. For positive semidefinite matrices $A_1, \ldots, A_n$, it compares

$$
\frac{1}{\binom{n}{m}} \sum_{\substack{i_1, \ldots, i_m \\ \text{distinct}}} A_{i_1} \cdots A_{i_m}
$$

with the corresponding with-replacement average,

$$
\left(\frac{1}{n} \sum_{i=1}^n A_i\right)^m.
$$

Full random reshuffling is the special case $m = n$. The scalar analogy suggests that the without-replacement expression should have the smaller operator norm. Matrices make the problem difficult because multiplication order matters, and products of positive semidefinite matrices can have negative eigenvalues. A proof must therefore control both ends of the spectrum.

The manuscript settles the first previously unresolved product lengths:

- **Four factors:** the two-sided inequality holds for every $n \geq 4$.
- **Five factors:** the upper spectral bound holds for every $n \geq 5$, but the lower bound fails at $n = 5$. An exact rational counterexample gives an eigenvalue $-285/2$, beyond the permitted $-120$. The lower bound is restored for every $n \geq 6$, so this threshold is sharp.
- **Six factors:** the upper bound is proved when $7 \mid n$, the lower bound when $8 \mid n$, and hence the complete norm inequality whenever $56 \mid n$. The remaining six-factor cases are still open.

The proof is computer-assisted but exact. It converts the matrix problem into positivity questions for noncommutative polynomials, exploits permutation symmetry to reduce their size, and supplies rational identities and positive-semidefinite certificates that can be replayed without floating-point tolerances. The accompanying package also checks the orbit classifications and representation maps through a structurally separate executable route.

There is also an important optimisation lesson. On the same rational quadratic example, reshuffling produces a larger norm of the expected iterate than independent sampling, yet a smaller expected squared error and average objective value. The Recht–Ré norm comparison therefore measures one form of bias, but it is not a universal measure of algorithmic performance.

## Who should care, and why

The realistic audience is narrower than "people interested in machine learning", but several specialist groups have a clear reason to pay attention.

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Random-reshuffling and stochastic-gradient researchers | The exact quadratic example separates three quantities that theory often treats as broadly aligned: reshuffling worsens the norm of the expected iterate while improving expected squared error and the objective value. | Determine when the traditional norm proxy agrees with actual optimisation performance; identify structural assumptions that prevent the reversal; use the rational example as an adversarial test for new convergence arguments. |
| Matrix-inequality and operator-theory researchers | A complete candidate classification for four and five factors, including the sharp failure and recovery at five factors, and a sharply defined six-factor frontier. | Close the six-factor nonmultiple cases; investigate whether the upper inequality holds more generally; classify lower-bound failures; replace parts of the computational certificate with a conceptual analytic proof. |
| Noncommutative polynomial and sums-of-squares researchers | The work builds on the noncommutative Positivstellensatz route used by Lai and Lim — who showed the unrestricted Recht–Ré conjecture fails at five matrices — but pushes it into exact rational certificates, symmetry blocks and parametric continuation. | Generalise the free-localiser and symmetry-reduction architecture to other noncommutative inequalities; automate the orbit and representation calculations; find smaller or more intelligible certificates. |
| Computer-assisted proof and formal-verification researchers | An unusually extensive exact replay, including mutation tests and a structurally separate semantic checker — yet still an internally checked candidate rather than an independently reproduced or formally verified proof. | Reimplement the computation independently; formalise the balanced-seed continuation theorem in Lean, Isabelle or Coq; verify the rational positivity certificates; test whether the claimed separation from the shared certificate schema is adequate. |
| Researchers designing data-ordering schemes | Current work increasingly treats data order as something to optimise rather than merely randomise — block reshuffling and paired reversal aim to improve constants and cancel order-dependent terms. | Run those schemes on the paper's exact counterexample; ask which orderings improve all three metrics; design theoretical measures that track objective reduction rather than only the expected update operator. |
| Randomised numerical linear algebra researchers | Recht and Ré originally connected the inequality to least-squares optimisation, stochastic gradient descent and the randomized Kaczmarz method. | Translate the low-length inequalities into short-horizon or block-iteration guarantees; test whether structured matrices arising in real linear systems avoid the pathological behaviour found in unrestricted positive-semidefinite examples. |
| AI-assisted mathematics and reproducibility researchers | A substantial case study in moving from numerical discovery to exact, executable evidence, while explicitly documenting the limits of that evidence. | Study independent agent reproduction, certificate exchange, semantic mutation testing, claim–evidence matrices, and the transition from an executable candidate proof to an accepted theorem. |

## The most valuable next projects

### 1. Characterise the metric reversal

This has the greatest potential significance for machine-learning theory. The important result is not simply that one inequality fails. It is that a familiar theoretical surrogate can rank two algorithms in the opposite order from expected error and objective value.

A useful follow-on theorem would identify conditions under which

$$
\|\mathbb{E}[x_1]\|, \quad \mathbb{E}\|x_1\|^2, \quad \mathbb{E}[f(x_1)]
$$

must agree in their comparison of sampling schemes, and conditions under which they may diverge. Candidates include commutativity, simultaneous diagonalisation, near-identity update matrices, bounded condition number and sufficiently small step size.

This would connect naturally with newer trajectory-level results. For example, Liu's 2026 analysis proves that random reshuffling dominates ordinary stochastic gradient descent under the smooth-convex assumptions studied there, despite the limitations of older matrix-product proxies. The two results point towards the same conclusion: the failure of the Recht–Ré route does not imply that reshuffling performs poorly; it shows that the route measures the wrong object in some regimes.

### 2. Finish the six-factor classification

This is the cleanest continuation as pure mathematics. The current arithmetic families suggest several possible outcomes: the two-sided result extends to every sufficiently large $n$; the upper and lower bounds have different thresholds; further exceptional congruence classes contain counterexamples; or the balanced-seed method suffices only after several additional seeds are proved. The existing exact machinery narrows this into a concrete certificate-search and structural-analysis problem rather than an open-ended conjecture.

### 3. Obtain an independent proof

This would produce the largest immediate increase in credibility. A convincing reproduction should avoid reusing the repository's orbit encoder, certificate schema or extraction code. The strongest outcome would combine an independent implementation, formal verification of the general continuation theorem, exact checking of the finite positivity certificates, and a human-readable account of why the certificate architecture works.

## Specialist audience candidates

The most natural specialist readers include researchers associated with the original Recht–Ré conjecture, the Lai–Lim counterexample and noncommutative sums-of-squares approach, and current work on random reshuffling and learned data ordering. That includes the authors of the relevant papers by Recht and Ré, Lai and Lim, Liu, and Nguyen, Phan and Kalagnanam. This identifies intellectual proximity, not a prediction that any individual will endorse the manuscript.

The strongest pitch to them is:

> This work does two things: it determines the first unresolved finite cases of the Recht–Ré inequality, and it gives an exact example showing that the inequality's preferred metric can disagree with actual error and objective performance.

That is more compelling to specialists than the general claim that the paper concerns shuffling.

## What is in the evidence package

The repository and Zenodo deposit ship exact rational sum-of-squares certificates, full-matrix positive-semidefiniteness certificates computed with FLINT characteristic polynomials, verification of all 2,312 six-factor coefficient identities, deterministic replay scripts with pinned dependencies, complete SHA-256 manifests, and mutation and negative controls that confirm the acceptance logic is live. Everything replays in exact arithmetic, without floating-point tolerances.
