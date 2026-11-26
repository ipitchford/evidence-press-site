## Summary

This release is a follow-up to the earlier Evidence Press release [Complete monotonicity of Tsallis entropy under heat flow: a sharp order classification](/releases/tsallis-heat-order-classification/) (doi:10.5281/zenodo.24001602), which settled the same questions for Tsallis entropy. Read that release first for the Tsallis side of the picture; this one does the Rényi side.

Take a random quantity and keep adding independent Gaussian noise. Its probability density spreads out, following
the heat equation, and its entropy (a measure of uncertainty) rises, but ever more slowly. In calculus terms the
first time derivative of entropy is positive and the second is negative. For Shannon entropy the third and fourth
derivatives also alternate in sign for every starting density, and it was conjectured that the pattern continues for
ever: entropy would then be **completely monotone** in time. Gu and Sellke disproved this at the fifth derivative.

Rényi entropy of order α is a family of uncertainty measures that contains Shannon entropy (order 1), collision
entropy (order 2, the log of the chance that two independent draws coincide) and min-entropy (order ∞). Wu, Yu and
Guo asked two questions about it. Which orders keep every sign? And, for each derivative, which orders keep that sign?

**No order of Rényi entropy keeps every sign, and for most orders the first derivative that fails is now known.**

1. **No order survives.** For every order α in (0, ∞] some derivative has the wrong sign. A single smooth density on
   the line does this for all orders at once, at one time. For orders bounded away from zero the density can even be
   strongly log-concave.
2. **Collision entropy fails at the fourth derivative.** At order 2 the first three signs hold for every input, and
   the fourth fails for an explicit Gaussian-modulated density: at variance time 1/32 its fourth derivative lies
   between 0.0249 and 0.025, where it should be negative. In dimension 4 and above the third sign already fails.
3. **Order by order.** From the sixth derivative on, every order fails. The third sign fails for every order up to
   0.377 and above 2; the fourth fails for every order up to 0.849; the fifth fails outside (1.19, 1.75).
4. **The first failing derivative.** Combined with the positive results of Wu, Yu and Guo, the first derivative that
   fails is 2 above order 3; 3 for orders up to 0.377 and between 2 and 3; 4 from about 0.389 to 0.849 and at order 2;
   and 5 near Shannon entropy (from 0.93 to 1.19 and from 1.75 to 1.76). Order 2 is the largest order whose third
   derivative has a universal sign.
5. **Integral entropies.** Among entropies of the form ∫Φ(p), only the quadratic ones keep every sign. This recovers
   the universal part of the Tsallis result.

## Summary for specialists

Write S_k for the set of orders α ∈ (0, ∞] such that (−1)^(k−1) ∂_t^k h_α(p_t) ≥ 0 for every input on the line and
every t > 0. Theorem A (Theorems 4.1 and 4.4): ∩_k S_k = ∅; for each m one smooth positive density violates some sign
of degree at least m at t = 1 for every α, strongly log-concave on [α₀, ∞], in every dimension. Theorem B
(Theorem 5.1): at α = 2, the sign holds exactly for k ∈ {1, 2, 3}; the third sign fails in dimension d ≥ 4.
Theorem C (Theorem 6.1): S_k = ∅ for k ≥ 6, S_5 ⊆ (1.19, 1.75), S_4 ⊆ (0.849, 2), S_3 ⊆ (0.377, 2], S_2 = (0, 3].
Theorem D (Corollary 6.2) is the first-failing-degree map above, with max S_3 = 2. Theorem E (Theorem 7.1): for
continuous Φ with |Φ(y)| ≤ Cy^η near 0, ∫Φ(p_t) has completely monotone decrease along every one-dimensional heat
flow from a bounded compactly supported density exactly when Φ(y) = Ay² + By with A ≥ 0.

**Table 1.** Status of the k-th sign on the line. "holds" in plain type: Wu, Yu and Guo (and Cheng and Geng at order 1); **bold**: proved in this release; ?: open.

| Orders α | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 | k ≥ 6 |
|---|---|---|---|---|---|---|
| (0, 0.377] | holds | holds | **fails** | **fails** | **fails** | **fails** |
| (0.377, β₀) | holds | holds | ? | **fails** | **fails** | **fails** |
| [β₀, 0.849] | holds | holds | holds | **fails** | **fails** | **fails** |
| (0.849, 0.93) | holds | holds | holds | ? | **fails** | **fails** |
| [0.93, 1.19] | holds | holds | holds | holds | **fails**† | **fails** |
| (1.19, 1.75) | holds | holds | holds | holds | ? | **fails** |
| [1.75, 1.76] | holds | holds | holds | holds | **fails** | **fails** |
| (1.76, 2) | holds | holds | ? | ? | **fails** | **fails** |
| 2 | holds | holds | **holds** | **fails** | **fails** | **fails** |
| (2, 3] | holds | holds | **fails** | **fails** | **fails** | **fails** |
| (3, ∞] | holds | fails‡ | fails | fails | fails | fails |

β₀ ≈ 0.389 is the lower end of Wu, Yu and Guo's third-sign range. †At order 1 this is Gu and Sellke's theorem.
‡From Sun for finite orders; at order ∞ it is proved here; the failures at higher derivatives in that row follow by
descent.

## Technical account

**Idea of the proof.** Start on a circle, where a density made of two Fourier modes lets every derivative be computed as a series; two
coefficients of that series show the sign pattern breaking. A transfer argument moves the circle example to the line.
For individual orders and derivatives, a "valley" density (ε + 2 − 2cos x)^θ, which almost vanishes at one point,
reduces each sign question to a polynomial in α. Exact rational and interval-arithmetic certificates, supplied with
the paper, check the finite computations.

**Related work.** Wu, Yu and Guo's paper on the complete monotonicity of Rényi entropy (IEEE Transactions on Information
Theory, 2025); Gu and Sellke's counterexample to the Gaussian completely monotone conjecture; Zou, Fan, Gao and
Wang's log-concave and hexagonal counterexamples; Sun on Tsallis entropy power along heat flow; Wu and Yu on Rényi
entropy power and Rényi–Fisher information; Cheng and Geng on higher-order derivatives in Costa's entropy power
inequality; and Widder's Laplace transform for Bernstein's theorem.

**Credits.** The questions, Theorem 1 (the positive ranges) and Proposition 1 (descent) are due to Wu, Yu and Guo; the
fifth-derivative Shannon counterexample to Gu and Sellke; strongly log-concave Shannon counterexamples to Zou, Fan,
Gao and Wang; the second-derivative failure above order 3 to Sun; the third and fourth Shannon signs and the
conjecture to Cheng and Geng.

## Evidence, assurance and limitations

- The failures at Shannon entropy (order 1) are inherited from Gu and Sellke and from Zou, Fan, Gao and Wang.
- The first failing derivative is not yet determined on four short stretches of orders: (0.377, 0.389),
  (0.849, 0.93), (1.19, 1.75) and (1.76, 2).
- The single density that defeats every order is shown to exist; it is not written down explicitly.
- The computer certificates check finite computations; the transfers to the line and to higher dimensions rest on
  written proofs.
- This is an unrefereed candidate. Its assurance is internal AI-assisted review (a five-perspective Claude review
  panel, a source audit, one revision round with an extension, a re-review and a proof audit of the new and rewritten
  proofs) plus clean replays of every program. No Astra or Codex review took place, and it is not peer review,
  independent reproduction or formal verification.

## Who should care, and why

Information theorists, probabilists and analysts who work with entropy inequalities under Gaussian noise, and anyone
curious about how uncertainty grows as noise is added. The first sections need no specialist background; the
specialist and technical layers follow, clearly marked.

## Why the problem matters

- **A map of what is universal.** Sign rules for entropy derivatives are tools: they give inequalities that hold for
  every input, such as the concavity behind Costa's entropy power inequality. Knowing exactly which signs are
  universal, order by order, tells researchers which inequalities they can rely on and which they cannot.
- **The Tsallis comparison.** An earlier Evidence Press release,
  [Complete monotonicity of Tsallis entropy under heat flow](/releases/tsallis-heat-order-classification/), showed that
  for Tsallis entropy exactly one order, two, keeps every sign. Rényi entropy is a logarithm of the same quantity,
  and the logarithm removes that exception.

## How to inspect or reproduce the recorded checks

Nine Python programs accompany the paper, and every check raises an error on failure, even with Python's assertions
disabled. Six exact certificates use only the standard library: `check_spectrum.py` (the two circle coefficients),
`check_alpha2.py` (the fourth derivative at order 2), `check_dimension.py` (the third sign in dimension 4),
`check_valley.py` (the valley rows at derivatives 3 to 6, with controls that must not certify), and
`check_uniform.py` and `check_high_fifth.py` (interval certificates for the sixth derivative on all orders up to 3 and
the fifth derivative above 1.75, built on `fourier_jet.py`). Two optional programs use sympy and mpmath:
`valley_thresholds.py` explores the limits of the valley family (evidence only) and `crosscheck_valley_direct.py`
checks nine signs directly. Everything runs in about half a minute; replay commands, a declared comparison policy and
a negative control are in the repository.

## The most valuable next projects

- Decide the fifth derivative on orders between 1.19 and 1.75.
- Close the other three gaps in the first-failing-derivative map.
- Write down one explicit density that defeats every order.
- Find a structural reason for the thresholds rather than witness families.

## What is in the evidence package

- The paper (PDF and LaTeX source), with a statement on the use of AI before the references.
- `code/` and `results/`: the nine programs and their outputs.
- `README.md` (plain-English overview and replay commands), `AI_INDEX.md` (claims, evidence and limits),
  `RESEARCH_GATES.json` (prior-art and limitation record), `REVIEW_SUMMARY.md`, `REPLAY_RECEIPT.md`,
  `ENVIRONMENT.txt`, `refs.bib`, `CITATION.cff`, `LICENSE.md` and `MANIFEST.sha256`.
