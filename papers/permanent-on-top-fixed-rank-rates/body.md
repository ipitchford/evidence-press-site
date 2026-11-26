## Summary

**The objects.** The *permanent* of a square matrix is the determinant without minus signs. Take n vectors and the
table A of their inner products (a positive semidefinite "Gram" matrix). A much larger companion matrix built from A,
the *Schur power* Π(A), has one row and one column for each of the n! orderings of the vectors, and it always has the
permanent of A as one of its eigenvalues. The *permanent-on-top* conjecture, posed by Soules in 1966, said that the
permanent is the largest eigenvalue. That would have implied a whole family of permanent inequalities. Shchesnovich
showed in 2016 that the conjecture is false, which left a quantitative question: by how much can it fail?

**Why it matters.** The size of the failure, the ratio ‖Π(A)‖/per A, matters in three places.

1. It bounds how badly the whole family of permanent inequalities can fail, since each of them tests Π(A) against
   special vectors.
2. It appears in the theory of approximating permanents: Anari, Gurvits, Oveis Gharan and Saberi proved the ratio is
   at most e^{(1+γ)n} (γ ≈ 0.577 is Euler's constant) and asked for the best constant.
3. In photonics, when photons carry partly different polarisations, the chance that all of them leave an
   interferometer through a few chosen ports can be higher than for identical photons ("anomalous bunching"). The same
   ratio limits how much higher.

**What was known.** There were finite counterexamples (Shchesnovich; Drury; Tran). Exponential growth of the ratio was
known only when the rank (the dimension of the vectors) grows with n (Anari et al.). In optics, Seron, Novo and Cerf
found an enhancement that grows linearly with the number of photons and asked whether faster growth is possible. The
companion release [Sharp logarithmic growth of the Bapat–Sunder eigenvalue ratio](/releases/bapat-sunder-eigenvalue-ratio-growth/)
settled the first permanental compound, where the growth is only logarithmic.

**What is new.** Fix the dimension d of the vectors and let n grow.

1. **An exact exponential base at every fixed rank.** The worst ratio grows like a fixed base to the power n. The base
   is e/2 ≈ 1.36 per index for complex vectors in dimension two and e²/6 ≈ 1.23 for real vectors in dimension three,
   and it rises towards e^γ ≈ 1.78 as d grows. Exact formulas hold for every d.
2. **The general constant.** Over all matrices, the best constant in ‖Π(A)‖ ≤ (c*)^n per A is at least e^γ (before,
   only c* > 1 was known; the upper bound e^{1+γ} is Anari et al.'s). When the rank grows more slowly than √n, e^γ is
   the exact rate.
3. **Permanental compounds.** Compounds built from an even split of the indices have the same bases, so an inequality
   stated by Pate in 2008 fails exponentially.
4. **Optics.** In the standard lossless model, two output ports and ordinary polarisation already give exponential
   enhancement with sharp base e/2 per photon. With the six standard polarisations (H, V, D, A, R, L) the model
   enhancement is 62731/28800 ≈ 2.18 at twelve photons and exceeds 24,000 at sixty photons.

**Six polarisations, twelve photons: more than twice as likely to bunch as identical photons** (in the model).

## Summary for specialists

Let A = (v_i^* v_j) for unit vectors v_1, …, v_n in K^d (K = R or C), Π(A)_{σ,τ} = ∏_i a_{σ(i),τ(i)}, and
S_{K,d}(n) = sup ‖Π(A)‖/per A. Write g_C(d) = e^{H_{d−1}}/d and g_R(d) = (2/d) exp{ψ(d/2) − ψ(1)} (d ≥ 2), g_R(1) = 1.

- **Theorem 1.1.** lim_n S_{K,d}(n)^{1/n} = g_K(d) for every fixed d, also with Gram rank exactly d. Thus g_R(2) = 1,
  g_R(3) = e²/6, g_C(2) = g_R(4) = e/2; in general g_R(2t) = g_C(t), and both sequences increase strictly to e^γ.
- **Theorem 1.2.** (a) ‖Π(A)‖ ≤ C(n+d²−1, n) g_K(d)^n per A for every positive semidefinite A of rank at most d.
  (b) e^γ ≤ c* ≤ e^{1+γ}, also for real matrices. (c) If d(n) → ∞ with d(n) = o(√n), the supremum of the n-th root
  of the ratio tends to e^γ.
- **Theorem 5.1.** For balanced permanental compounds with t parts the sharp base is g_C(min(d, t)) or
  g_R(min(d, 2t)), also for the best 0/1 test; for t = 2 the 0/1 inequality of Pate (Theorem 7 there) fails with
  base e/2 at every complex rank d ≥ 2.
- **Corollary 6.1.** The multimode bunching ratio max_S per(A∘S)/per A with internal dimension t has the same sharp
  bases; S = conj(A) attains g_K(d) when t ≥ d.
- **Theorem A.1.** The full base is attained only by configurations whose directions equidistribute; a bounded number
  of directions gives a strictly smaller base.

## Technical account

**Idea of the proof.** The top eigenvalue of Π(A) is rewritten as the size of an averaged quantum state built from the
vectors, and the permanent as the best overlap with a "pure" product state. At fixed dimension both are within
factors polynomial in n of one product of quadratic forms, maximised over mixed states for the eigenvalue and over
pure states for the permanent; the mixed side uses the postselection technique of Christandl, König and Renner. A
random rounding argument bounds the mixed–pure gap, and evenly spread vectors show that the bound is attained.

**What is known and what is new.** The complex value of the mixed–pure gap and its sharpness in fixed dimension are
due to Yuan and Parrilo, whose sharpness argument rests on polarisation constants determined by Pappas and Révész.
The comparison of the permanent with the pure product is standard. New here are: the identification of the
permanent-on-top ratio with the mixed–pure gap; the real constant g_R, which tests real data against complex pure
states and is half of Yuan and Parrilo's real constant; the rank-constrained versions; the fixed-rank rates; the lower
bound c* ≥ e^γ and the exact rate for slowly growing rank; and the consequences for compounds, optics and rigidity.

**Explicit designs (Section 7).** Repeating the four tetrahedral polarisations gives exact ratios 7/9, 377/405 and
102469/74115 ≈ 1.38 at four, eight and twelve photons, with limit (27/16)^{1/4} ≈ 1.14 per photon. The six standard
polarisations give 14/15, 62731/28800 ≈ 2.18 and 64385639/10348800 ≈ 6.22 at six, twelve and eighteen photons, with
limit √(3/2) ≈ 1.22 per photon; convergence is slow (the per-photon root is still about 1.18 at sixty photons).

## Evidence, assurance and limitations

- **Written proofs.** All theorems rest on written proofs in the paper.
- **Computational checks.** `code/verify_exp_rates.py` runs 28 checks: the constants to 30 digits and their
  monotonicity; the bound of Theorem 1.2(a) on 36 random configurations; Shchesnovich's order-five example; the
  tetrahedral and octahedral closed forms against Ryser's formula; every quoted ratio and probability in exact rational
  arithmetic; and the incidence identity behind Theorem 5.1. These finite calculations test constants, closed forms and
  identities; they do not certify the asymptotic theorems. Changing the exact tetrahedral ratio in a copy makes the
  program fail.
- **Assurance.** Internal AI-assisted review only: a combined five-perspective Claude review (with a line-by-line check
  of every proof), clean replays, one revision round with extensions, a re-review and a proof audit of all new and
  rewritten proofs. No critical issue remained; one understated theorem was strengthened and minor items were applied
  before release. No Astra or Codex second-model review took place. This is not peer review, independent reproduction
  or formal verification.
- **Scope.** The rates are asymptotic: the rank is fixed while n grows. Whether c* equals e^γ at full rank is open.
  The optical numbers are exact predictions of the standard lossless model of partial distinguishability, not
  experiments; the absolute probabilities are small (about 3×10⁻⁵ at twelve photons), and source and detector
  efficiencies are not modelled.
- **Status.** Unrefereed research candidate.

## Relationship to earlier work

This release is a companion to
[Sharp logarithmic growth of the Bapat–Sunder eigenvalue ratio](/releases/bapat-sunder-eigenvalue-ratio-growth/)
(DOI [10.5281/zenodo.24509057](https://doi.org/10.5281/zenodo.24509057)). That release treats the first permanental
compound, where the worst ratio grows like log n, and compounds of fixed order k ≥ 2, where Pate's 0/1 inequality fails
by at least a power of log n. This release treats the whole Schur power and compounds split evenly, where the growth is
exponential. It reuses the companion's layer-cake lemma and its proof that real rank-two matrices never violate the
conjecture. The companion release is unchanged.

A second related release, [Asymptotic permanental dominance at fixed Gram rank](/releases/asymptotic-permanental-dominance-fixed-rank/)
(DOI [10.5281/zenodo.24536861](https://doi.org/10.5281/zenodo.24536861)), works in the same fixed-rank setting from the
other side: it shows that Lieb's and Lavi's permanent inequalities hold eventually at every fixed rank, because every
non-trivial symmetry block of the Schur power averages below the permanent once the matrix is large. The present
release shows that the single largest eigenvalue of the whole Schur power still exceeds the permanent by an exponential
factor. That release is also unchanged.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on permanent inequalities | The exact exponential size of the permanent-on-top failure at each fixed rank, and for balanced compounds | Asymptotic rates; finite orders need separate bounds |
| Researchers on approximating permanents | A lower bound e^γ for the best constant of Anari et al., and the exact rate for rank o(√n) | Whether c* = e^γ at full rank is open |
| Quantum-optics groups studying partial distinguishability | The sharp growth rate of anomalous bunching, and explicit polarisation designs with exact predicted enhancements | Model predictions with small absolute probabilities; no experiment |
| Quantum-information theorists | A link between permanents and mixed-versus-pure product optimisation via postselection | Credited components (Yuan–Parrilo, Christandl–König–Renner) |

## Why the problem matters

The permanent-on-top conjecture sat at the centre of a family of permanent inequalities going back to Lieb's work in
1966. Once it was known to be false, the useful question became how far it fails, because that size controls the whole
family, the constants in permanent approximation, and the bunching advantage available from partly distinguishable
photons. This release answers that question exactly at every fixed rank.

## How to inspect or reproduce the recorded checks

Download the archive from Zenodo (DOI [10.5281/zenodo.24550760](https://doi.org/10.5281/zenodo.24550760)) or the
[GitHub release](https://github.com/ipitchford/permanent-on-top-fixed-rank-rates/releases/tag/v0.1.0-candidate).
From the package root, with uv:

```sh
uv run --python 3.12 --with numpy==2.3.5 --with mpmath==1.3.0 python3 -I -B -O code/verify_exp_rates.py --output results/verification.json
```

It takes about 70 seconds. Expected: 28 PASS lines and "ALL CHECKS PASSED". GitHub CI on Linux reruns the program,
compares the output with the shipped result under a declared tolerance for floating-point fields (documented in
`ENVIRONMENT.txt`) and runs a negative control. This is a replay by the producer, not an independent reproduction.

## The most valuable next projects

1. Decide whether c* = e^γ for matrices of unrestricted rank, for example by bounding the Schur power with the convex
   estimator of Anari and Ebrahimnejad.
2. Find the rate for unbalanced compounds, between the polylogarithmic growth at fixed order and the balanced
   exponential base.
3. Determine the best per-photon base for designs with few polarisation states.
4. Give explicit lower bounds at moderate orders, and the least order at which a real rank-three Hadamard square
   exceeds its permanent.

## What is in the evidence package

| File | What it is |
|---|---|
| `manuscript.pdf` | The paper (14 pages); source `manuscript.tex` |
| `code/verify_exp_rates.py` | The 28 checks |
| `results/verification.json` | Recorded output |
| `README.md`, `AI_INDEX.md` | Plain-English overview; machine-oriented map of claims and evidence |
| `REVIEW_SUMMARY.md`, `RESEARCH_GATES.json` | Internal review summary; prior-art and limitation record |
| `REPLAY_RECEIPT.md`, `ENVIRONMENT.txt`, `.github/workflows/replay.yml` | Replay record, environment and CI |
| `refs.bib`, `CITATION.cff`, `LICENSE.md`, `MANIFEST.sha256` | Bibliography, citation, licences (text CC0-1.0, code MIT), hashes |
