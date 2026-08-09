## Summary

This candidate constructs a family of Markov chains on binary strings and
then follows the construction all the way from its stationary law to its
full-word spectrum and a sharp asymptotic transition.

The count of ones has a beta-binomial stationary distribution. Its complete
eigenbasis is the two-parameter Hahn family. That count chain has only
$N+1$ states, however, while the labelled binary-word chain has $2^N$ states.
The paper proves that the larger chain splits into intrinsic degree layers:
degree $\ell$ has eigenvalue

$$
\lambda_\ell=\mathbb E[(U-V)^\ell]
$$

with multiplicity $\binom N\ell$. Here $U$ and $V$ are beta variables whose
parameters come directly from the stabiliser--cycle construction.

The main asymptotic theorem asks what those exponentially many modes do to a
specific mixing observable. For fixed
$\alpha,\beta>0$ and $0<c<\min(\alpha,\beta)$, define

$$
\delta=\min\{2c,\alpha+\beta-2c\}.
$$

The stationary-weighted average of the conditional point-start chi-square
distances has a sharp transition at

$$
\frac{\log 2}{2\delta}\frac{N}{\log N}.
$$

Below that constant the average diverges; above it the average goes to zero.
The result is a theorem for the explicitly defined stationary-average trace
observable. It is **not a worst-case**, typical-start, fixed-start,
stationary-mixture, or total-variation cutoff theorem, and it says nothing at
the exact critical constant.

> **Candidate status:** anonymous · unrefereed candidate · producer replay passed ·
> independent reproduction, formal verification, external specialist review,
> and editorial peer review not assessed · no parent release.

## From counts to labelled words

The construction begins with a random permutation whose cycles receive new
binary labels. The two source-colour blocks use different Ewens parameters,
and detailed balance constrains the cycle-colouring probabilities. A unique
source-blind specialization produces the full two-parameter Hahn family on the
count process.

Counts alone hide most of the state space. The paper therefore introduces a
latent-beta update on each coordinate and filters polynomial functions by
their square-free degree. The degree layers are mutually orthogonal and
self-adjoint. This yields the complete word-chain characteristic polynomial,
including the correct aggregation rule when distinct degrees happen to have
the same numerical eigenvalue.

The count and word chains share the same absolute spectral radius, but they do
not share spectral multiplicities or mixing profiles. That distinction is
precisely why the full-word mixing theorem is not a routine corollary of the
count spectrum.

## Why the transition occurs on the N/log N scale

Write $q_\ell=\mathbb E|U-V|^\ell$. The paper evaluates the positive and
negative endpoints separately and proves

$$
q_\ell=A_+\ell^{-2c}
      +A_-\ell^{-(\alpha+\beta-2c)}
      +o\!\left(\ell^{-2c}+\ell^{-(\alpha+\beta-2c)}\right),
$$

with explicit positive constants. If the two exponents coincide, the
constants add; there is no logarithmic correction. Even eigenvalues equal
these absolute moments, which avoids cancellation in the lower bound.

The exact stationary-average identity is

$$
\mathcal A_N(t)
=\operatorname{tr}(K^{2t})-1
=\sum_{\ell=1}^{N}\binom N\ell\lambda_\ell^{2t}.
$$

Above the threshold, a sublinear $N^\gamma$ split controls all small and
intermediate degrees, while the remaining binomial mass is defeated by the
power-law decay. Below the threshold, one central even degree already
diverges. Parity and integer-time rounding contribute only lower-order terms.

For the canonical chain the constant becomes

$$
\frac{(\alpha+\beta)\log 2}{4\alpha\beta}.
$$

At $\alpha=\beta=1$ this is $(\log 2)/2$, recovering the classical constant.

## What is classical and what is candidate-new

Diaconis, Lin and Ram already establish the classical trace formula, binomial
multiplicities, polynomial eigenvalue decay, the $N/\log N$ mechanism, and
stronger classical point-start results. The Schur--Weyl decomposition they use
is an operator-independent framework and is not claimed here as new.

Relative to the cited public corpus, the plausible increment is the
asymmetric stabiliser--Ewens construction, the two-endpoint parameter
calculation, and the resulting three-parameter stationary-average theorem.
The paper also separates the broad algorithmic construction from the narrower
fixed-weight twisted-Burnside formalism.

This is a bounded candidate-new claim, not a priority certificate. A directly
relevant manuscript attributed to Chenyang Zhong was cited as in preparation
and could not be examined. Public release does not resolve that uncertainty.

## What the executable evidence checks

The isolated mixing verifier passes under ordinary and optimised Python. Each
positive run reports **3,177 explicit predicates**. Each control run reports
**107 predicates across ten controls**. The package checks:

- three exact routes to the eigenvalue formula;
- two algebraically distinct bounded word-kernel constructions;
- direct equality between conditional chi-square, matrix trace, and the
  spectral sum for small exact cases;
- the absolute-radius identity and positive even moments;
- endpoint regimes with either endpoint dominant and with equal exponents;
- finite diagnostics below and above the predicted threshold; and
- cause-specific mutations, invalid parameters, and manifested-input
  corruption.

A checksum-bound foundational evidence snapshot preserves the earlier
full-word producer replay and its own ordinary, optimised, and negative-control
receipts. It is supporting material inside this release, not a parent output.

These calculations are producer-side falsification support. They test formula
translation, signs, normalization, exact finite kernels, and verifier failure
behaviour. They do not prove the endpoint asymptotic, establish independence,
or upgrade the assurance of the written theorem.

## What is not established

- No unaffiliated rerun or independent implementation has been reported.
- No theorem has been formalized in a proof assistant.
- No external Markov-chain specialist or journal referee has assessed the
  paper.
- No absolute novelty or priority conclusion is claimed.
- No fixed-start, typical-start, worst-case, or total-variation cutoff follows
  from the stationary-average result.
- No conclusion is claimed at the critical transition constant.
- Boundary parameter values can lose irreducibility or aperiodicity and are
  outside the open-region theorem.

## What would most improve the result

The highest-value next step is an independent mathematical reconstruction,
not a larger producer-side finite grid. A specialist should rebuild the latent
beta diagonalisation, endpoint asymptotic, and $N^\gamma$ trace split from the
statement alone. Further work could determine the critical-point behaviour,
seek typical-start or worst-case analogues, analyse the boundary regimes, and
formalize the main proof.

## Package and reuse

The public repository contains the 21-page PDF, LaTeX source, exact
verifiers, frozen receipts, review records, claim registry, deterministic
release tooling, visual abstract, Open Graph card, plain-English transcript,
and AI-generated audio. The tagged archive and Zenodo deposit are designed to
carry byte-identical release assets with a shared SHA-256 ledger.

Original non-code material is dedicated under CC0 1.0 to the extent the
repository maintainer holds the relevant rights; original code is MIT. The
audio and images explain the work but are not evidence.
