## Summary

Flip some fair coins and give each coin a weight, with the squared weights adding up to one. Add the weights of the
coins that land heads and subtract the weights of those that land tails. The result is a random number centred at
zero with spread (standard deviation) one. Mathematicians call it a **Rademacher sum**.

How much of this number, on average, sticks out more than one unit from zero? In 2024 Aryeh Kontorovich asked a
question on MathOverflow about comparing the size of a sum of independent symmetric random variables with the size of
its pieces. George Lowther showed that it comes down to this: is the average overshoot beyond one, written
E(|S| − 1)₊, always at most (√2 − 1)/2 ≈ 0.207, the value for two equal coins? Lowther proved a weaker form, with the
constant 2.187 where 2 was hoped for, and the sharp bound stayed open.

**Two equal coins are the worst case: the average overshoot beyond one standard deviation is at most 0.207.**

- **The sharp stop-loss bound.** For every threshold t from 1/√2 to 1.005, the average overshoot E(|S| − t)₊ is at
  most (√2 − t)/2, with equality only for two equal weights, and with a quadratic stability estimate. At t = 1 this
  is Lowther's bound.
- **The constant two.** Kontorovich's comparison holds with the sharp constant 2, also for vectors in any Hilbert
  space whose distribution is unchanged by sign flips, with linear stability.
- **Product distributions.** The constant in Kontorovich's lower bound for the total variation distance between
  product measures improves from 0.1798 to (1 − e^(−1/2))/2 ≈ 0.1967.
- **Three equal coins.** An inequality of Fang and Huang for three-coin extremes holds without their cap on the
  weights, again with stability.
- **Sets on the cube near density one quarter (unconditional).** Near density 1/4 the best sets are two-coordinate
  faces with a small "Gaussian cap" added, and the maximal first-level weight rises by about 2h² log(1/h) at density
  1/4 ± h.
- **Finer structure — conditional on Yu's unrefereed preprint.** Assuming a theorem of Lei Yu from an unrefereed
  preprint (arXiv:2504.02593, version 2, September 2026), the paper gives an exact formula near density 1/4, the
  next-order terms, and a striking detail: above density 1/4 the extra points are split about 98 to 2 between two
  neighbouring faces. The ratio comes from the equation m = tanh(2m) of the Curie–Weiss–Potts model of magnetism. The
  same holds near density 1/8, after extending a 2026 inequality of Fang and Huang to all weights. These results are
  only as secure as Yu's theorem.

**A comparison you can check.** At t = 1 the average overshoot is 0 for one coin, (√2 − 1)/2 ≈ 0.207 for two equal
coins, (√3 − 1)/4 ≈ 0.183 for three equal coins and about 0.167 for the Gaussian limit. Two equal coins give the
largest overshoot for every threshold between about 0.586 and 1.096; the theorem proves this on [0.707, 1.005].

## Summary for specialists

Theorem 3.1: for unit a and t ∈ [1/√2, 201/200], E(|S_a| − t)₊ ≤ (√2 − t)/2, with equality only on the two-equal-weight
vectors, and at t = 1 a deficit of at least dist(a, E₂)²/1000. Proposition 3.3: the pair is not optimal outside
[2 − √2, 2√2 − √3] (Conjecture 10.1 asks for this whole interval). Corollary 4.1 gives E min(|S_a|, 1) ≥ 1/2, hence the
comparison E f((ΣX_i²)^½) ≤ 2 E f(|ΣX_i|) for nondecreasing f with f(0) = 0 and f(t)/t nonincreasing; Corollary 4.3 gives
inf E min(|S_a|, t) = t/2 for 0 < t ≤ 201/200; Theorem 4.4 extends the comparison to Hilbert space and Theorem 5.1 adds
linear stability with explicit constants (Remark 5.2). Corollary 4.5 improves Kontorovich's tensorization constant.
Theorem 6.1 removes the cap from Fang and Huang's Lemma 2.4. On the cube, with b_A = E[ε1_A] and W the dimension-free
maximal first-level weight, Proposition 7.1 and Theorem 7.2 give W(1/4 ± h) = 2 min(1/4, 1/4 ± h)² + (2 + o(1)) h² log(1/h)
unconditionally.

**Conditional on Yu's unrefereed preprint.** Using Yu's Theorem 5 (arXiv:2504.02593v2), Corollary 7.3 and Theorem 7.4
give an exact three-parameter formula, nonattainment in finite dimension and the expansion through the h² term, with
the split λ* = 0.97875…; Theorem 8.1 is a transfer principle from stable stop-loss inequalities with k equal extremal
weights to density 2^(−k), applied for k = 2, 3 (Corollary 8.2), and Remark 8.3 shows numerically that it cannot apply
for k = 5, 6.

## Technical account

**Idea of the proof.** Compare the overshoot function (|x| − 1)₊ with a parabola corrected by a cosine. The average of
the cosine part factorises over the coins, because the coins are independent, and that settles every case except the
one with two large weights. That last case is a direct calculation with four terms. Szarek's constant 1/√2 and
Haagerup's coefficient inequality enter the corollaries as the manuscript cites them.

**Related work.** Szarek's and Haagerup's sharp Khintchine constants; the robust Khintchine inequality of De,
Diakonikolas and Servedio and its explicit constant by Eskenazis, Nayar and Tkocz; Melbourne and Roberto's
quantitative cube slicing; Hollom and Portier's tight anti-concentration of Rademacher sums; Yu's stop-loss and
small-density results; and the minimum-average-distance results of Ahlswede and Katona, Althöfer and Sillke, Fu, Wei
and Yeung, and Fang and Huang. Kontorovich's MathOverflow question and Lowther's answer are cited as web pages.

**Credits.** The question and the total-variation application are due to Kontorovich; the reduction and the proposed
bound to Lowther; Yu's Theorem 5 is used for the finer cube results; Fang and Huang's capped three-weight lemma,
majorant and density-1/8 value are used and extended, as the paper states.

## Evidence, assurance and limitations

- The thresholds are proved only on [1/√2, 1.005]. The larger interval [2 − √2, 2√2 − √3], about [0.586, 1.096], is a
  conjecture supported by numerical evidence.
- The cube results are local: they hold at densities very close to 1/4 and 1/8, and the neighbourhoods are not
  explicit.
- The finer cube results (Corollary 7.3, Theorem 7.4, Theorem 8.1 and Corollary 8.2 at density 1/8) depend on Yu's
  unrefereed September 2026 preprint.
- The transfer method seems to work only for 2, 3 and perhaps 4 fixed coordinates; density 1/16 remains open.
- This is an unrefereed candidate. Its assurance is internal AI-assisted review (a five-role Claude review panel, a
  revision round with extensions, a verification re-review and a proof audit of the new and rewritten proofs) plus
  the computational checks. No Astra or Codex review took place, and it is not peer review, independent
  reproduction or formal verification.

## Who should care, and why

Probabilists and information theorists who compare sums of independent symmetric variables with their square
function, or who lower-bound the total variation distance between product distributions, can use the sharp
constant 2 and the improved constant 0.1967. Coding theorists studying codes with small average distance get the
local shape of optimal sets near densities 1/4 and 1/8.

## Why the problem matters

- **Comparing product distributions.** Kontorovich needed the inequality to bound how far apart two products of
  probability distributions are in terms of how far apart their pieces are (tensorization of the total variation
  distance). A sharper constant gives a sharper bound.
- **Stop-loss quantities.** Average overshoots beyond a threshold, called stop-loss transforms, are basic objects in
  probability and in insurance mathematics.
- **Codes on the cube.** The same inequality measures how lopsided a subset of the cube {−1, 1}ⁿ can be. This is the
  classical problem of Ahlswede and Katona: choose a set of binary words whose average distance from each other is as
  small as possible.

## How to inspect or reproduce the recorded checks

Four Python scripts accompany the paper, and each fails on any error even with Python's assertions disabled.
`verify.py` checks the stop-loss bound exactly at four thresholds and the three-coin bound for 1,000 integer weight
tuples, and encloses the clipped expectation for 923 tuples of vectors in the plane. `cube_census.py` checks all
65,536 subsets of the four-dimensional cube and computes the constants to 80 digits. `verify_asymptotic.py` gives a
floating-point illustration of the asymptotic constants (evidence, not proof). `check_extensions.py` evaluates the
proof margins, the interval endpoints, the constants, the evidence for the conjecture and the equal-weight envelope.
Replay commands, a declared comparison policy for the floating-point outputs and a negative control are in the
repository; the proofs do not depend on the scripts.

## The most valuable next projects

- Prove the bound on the whole interval [2 − √2, 2√2 − √3] (Conjecture 10.1).
- Settle density 1/16 by proving Fang and Huang's Conjecture 3.1 with stability.
- Prove the finer cube results without Yu's theorem, and make the neighbourhoods and constants effective.
- Show that every near-optimal set above density 1/4 splits its added mass close to 98 to 2.

## What is in the evidence package

- The paper (PDF and LaTeX source), with a statement on the use of AI before the references.
- `code/` and `results/`: the four scripts and their outputs.
- `README.md` (plain-English overview and replay commands), `AI_INDEX.md` (claims, evidence and limits),
  `RESEARCH_GATES.json` (prior-art and limitation record), `REVIEW_SUMMARY.md`, `REPLAY_RECEIPT.md`,
  `ENVIRONMENT.txt`, `refs.bib`, `CITATION.cff`, `LICENSE.md` and `MANIFEST.sha256`.
