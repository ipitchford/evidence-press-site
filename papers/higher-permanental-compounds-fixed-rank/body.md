## Summary

**The problem.** The *permanent* of a square matrix is the determinant without minus signs. Take n vectors and the
table A of their inner products (a positive semidefinite "Gram" matrix). Split the n indices into a group of k and the
rest. The *k-th permanental compound* C_k(A) is a large matrix, with one row and one column for each choice of the
group, whose entries multiply the permanent of a k-by-k block of A by the permanent of the complementary block. Every
row of C_k(A) adds up to the permanent, so the permanent is always one of its eigenvalues.

**Why anyone cares.** In 1986 Bapat and Sunder conjectured that, for k = 1, the permanent is the *largest* eigenvalue.
In 2008 Pate extended this to every k, and also stated that tests with 0/1 vectors never beat the permanent. These are
weak forms of the permanent-on-top conjecture (which is false) in a family of permanent inequalities going back to
Lieb's work of 1966. The same matrices describe photons that are partly distinguishable, for example by polarisation,
travelling through an interferometer.

**What was known.** Counterexamples exist (Drury; Tran; Chalmers). The earlier release
[Sharp logarithmic growth of the Bapat–Sunder eigenvalue ratio](/releases/bapat-sunder-eigenvalue-ratio-growth/)
showed that for k = 1 the worst ratio is about ½ log n over the reals and log n over the complex numbers, and that
Pate's 0/1 statement fails for every k ≥ 2, using block constructions in dimension 3k. Its Open Problem 3 asked for
the true growth when k ≥ 2 and the dimension of the vectors is fixed.

**What is new.** Fix the dimension of the vectors: at least three for real vectors, at least two for complex ones.

1. **Fixed k.** For each fixed k ≥ 2 the largest eigenvalue of C_k(A) can exceed the permanent by a factor of order
   (log n)^k, and the best 0/1 test by a factor of order (log n)^(k−1), and by no more. For complex vectors in two
   dimensions the eigenvalue factor is (log n)^k exactly at leading order.
2. **Slowly growing k.** If k grows but much more slowly than n, the k-th root of the factor is about log(n/k).
3. **k a fixed fraction p of n.** The factor grows exponentially, and the paper finds the exact base for every
   dimension: e/2 ≈ 1.359 at p = ½ in general, but for real three-dimensional vectors the base is flat at
   e²/6 ≈ 1.2315 for every p between ⅓ and ⅔.
4. **Smallest cases.** Real dimension three and complex dimension two are the smallest in which any violation
   happens. An exactly checked real example with 152 vectors breaks Pate's 0/1 statement for k = 2.
5. **More.** Exact rates for splits into any fixed number of groups, and growth of individual symmetry blocks of the
   Schur power.

**The worst case for the k-th compound grows like (log n)^k, answering the earlier release's open problem.**

## Summary for specialists

Let A = (v_i^* v_j) for unit vectors v_1, …, v_n in K^d (K = R or C), C_k(A)_{I,J} = per A[I,J] · per A[I^c,J^c] for
k-subsets I, J, and R(X) = max over nonempty E of 1_E^* X 1_E / |E|. Put S_{n,k} = sup λ_max(C_k(A))/per A and
I_{n,k} = sup R(C_k(A))/per A, with d ≥ 3 if K = R and d ≥ 2 if K = C.

- **Theorem 1.1(i).** For each fixed k ≥ 2, S_{n,k} = Θ((log n)^k) and I_{n,k} = Θ((log n)^(k−1)). At complex rank two,
  S_{n,k} ~ (log n)^k for every fixed k and I_{n,2} ~ log n.
- **Theorem 1.1(ii).** If k → ∞ and k = o(n), then S_{n,k}^(1/k) and I_{n,k}^(1/(k−1)) are both asymptotic to log(n/k).
- **Theorem 1.1(iii).** If k/n → p ∈ (0, 1), then n^(−1) log S_{n,k} and n^(−1) log I_{n,k} converge to
  inf_{t>0} {G(t) − p log t} − H(p), where H is the binary entropy, G(t) = F(t) = t log(1/t)/(1 − t) for complex d ≥ 2
  and real d ≥ 4, and G = J_3 (an explicit potential) at real rank three. The bases at p = ½ are e/2 and e²/6; at real
  rank three the base equals e²/6 for every p ∈ [⅓, ⅔] and is strictly below the higher-rank base at every p. The same
  holds with tr C_k(A) in place of λ_max.
- **Corollary 1.2.** At complex rank one and real rank at most two, λ_max(C_k(A)) = R(C_k(A)) = per A for all n and k.
  At real rank three and complex rank two both ratios are unbounded for every fixed k ≥ 2. A real rank-three matrix of
  order 152 has 0/1 ratio greater than 1.0049 for k = 2, certified in exact arithmetic.
- **Theorems 9.1 and 10.1.** Exact exponential bases for ordered partitions into any fixed number of parts; lower
  bounds for individual blocks of the Schur power.

## Technical account

**Upper bounds.** The permanent and the quadratic forms of C_k(A) are squared norms of products of the linear forms
z ↦ v_i^T z. Averaging that product over a random complex shift bounds the trace of C_k(A) for all k at once, at a
cost of exactly e^(nF(t)) (Theorem 3.1). A separate inequality bounds every 0/1 test of C_k(A) by the trace of
C_(k−1)(A) (Lemma 4.1), which turns trace bounds into 0/1 bounds one level down; this is why the 0/1 exponent is one
less than the eigenvalue exponent. The layer-cake lemma of the earlier release converts 0/1 bounds back into
eigenvalue bounds.

**Lower bounds.** Placing the roots of a suitable polynomial on concentric circles, as in the earlier release, gives
the matching (log n)^k and (log n)^(k−1) growth; evenly spread directions give the exponential rates for proportional k.

**The real rank-three plateau.** At real rank three the paper writes down an explicit "dual measure" on the sphere. It
gives a matching upper bound and explains why the base stays at e²/6 across the whole range ⅓ ≤ p ≤ ⅔.

**Known and new.** The refutation of Pate's 0/1 statement for every k ≥ 2 was first given in the earlier release, at
real rank 3k and with a 0/1 witness of order 21 420. New here are the growth rates in all regimes, the minimal ranks,
and much smaller witnesses: orders 152, 378 and 10 710 with 0/1 ratios above 1.0049, 1.0224 and 2.354. The order-27
real rank-three matrix of the earlier release also violates Pate's spectral conjecture for k = 2, with
λ_max(C_2)/per A > 1.11.

## Evidence, assurance and limitations

- **Written proofs.** All theorems rest on written proofs in the paper (23 pages).
- **Exact certificates.** Six scripts use only exact rational or integer arithmetic: the witnesses of orders 152, 378,
  10 710 and 27, exact checks of the trace bound and the 0/1-to-trace inequality on small frames, and the
  multiplicities behind the Schur-power block theorem.
- **Numerical checks.** Three scripts check the real rank-three dual measure to about 40 digits, several geometric
  lemmas with a fixed random seed, and the tabulated bases behind Figure 1. They test identities and constants; they
  do not certify the asymptotic theorems.
- **Assurance.** Internal AI-assisted review only: a two-part, five-role Claude review panel with a line-by-line proof
  audit, a clean replay, one revision round with extensions, and a verification re-review with a proof audit of all
  new and rewritten proofs. No correctness error was found; minor items were applied before release. No Astra or
  Codex second-model review took place. This is not peer review, independent reproduction or formal verification.
- **Scope.** Fixed-k constants are exact only for complex two-dimensional vectors. At real rank three the eigenvalue
  constant for k = 2 lies between ½ and 2, and the best 0/1 constants are open. All growth statements are asymptotic
  in n.
- **Status.** Unrefereed research candidate.

## Relationship to earlier work

This release answers Open Problem 3 of
[Sharp logarithmic growth of the Bapat–Sunder eigenvalue ratio](/releases/bapat-sunder-eigenvalue-ratio-growth/)
(DOI [10.5281/zenodo.24509057](https://doi.org/10.5281/zenodo.24509057)), which treats the first compound and first
showed that Pate's 0/1 statement fails for every k ≥ 2. It uses that release's layer-cake lemma, its concentric-circle
construction and its rank-two results, with exact pointers in the paper. A related release,
[Asymptotic permanental dominance at fixed Gram rank](/releases/asymptotic-permanental-dominance-fixed-rank/)
(DOI [10.5281/zenodo.24536861](https://doi.org/10.5281/zenodo.24536861)), studies the averaged inequalities of Lieb and
Lavi for the same symmetry blocks at fixed rank, and the companion release
[Sharp exponential rates for permanent-on-top and anomalous boson bunching at fixed rank](/releases/permanent-on-top-fixed-rank-rates/)
(DOI [10.5281/zenodo.24550760](https://doi.org/10.5281/zenodo.24550760)) finds the exponential bases of balanced compounds,
which coincide with Theorem 1.1(iii) here at p = ½. The earlier releases are unchanged.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on permanent inequalities | Exact growth of the Bapat–Sunder and Pate ratios for every k at fixed rank, and the minimal ranks | Asymptotic in n; most fixed-k constants known only up to a bounded factor |
| Researchers searching for counterexamples | Exact certificates of orders 152, 378, 10 710 and 27 as benchmarks | The least order of a real rank-three 0/1 witness for k = 2 is open |
| Boson-sampling and partial-distinguishability theorists | How far compound eigenvalues and 0/1 tests can exceed the permanent at a given number of internal modes | Mathematical statements about Gram matrices; no optical experiment |

## Why the problem matters

Bapat and Sunder's question and Pate's extension are among the simplest tests of whether the permanent dominates
related matrix functions, a theme that runs from Lieb's 1966 work to the permanent-on-top conjecture. Once
counterexamples were known, the useful question became how far the inequalities fail. This release answers that for
every k at fixed rank, and shows that the smallest dimensions that allow any failure already allow unbounded failure.

## How to inspect or reproduce the recorded checks

Download the archive from Zenodo (DOI [10.5281/zenodo.24551928](https://doi.org/10.5281/zenodo.24551928)) or the
[GitHub release](https://github.com/ipitchford/higher-permanental-compounds-fixed-rank/releases/tag/v0.1.0-candidate).
From the `code/` directory, with uv:

```sh
V="uv run --python 3.12 --with numpy==2.3.5 --with scipy==1.16.3 --with mpmath==1.3.0 --with matplotlib==3.10.7"
for s in compact_pair_certificate single_block_certificate shell_certificate second_compound_order27 \
         check_profile_finite check_multiplicities verify-rank-three check_geometry plot_profile; do
  $V python3 -I -B -O $s.py > /tmp/$s.out && cmp /tmp/$s.out ../results/$s.txt && echo "$s ok"
done
```

All nine scripts take about 30 seconds and exit with status 1 if a check fails, also under `python -O`. GitHub CI on
Linux reruns them, compares the six exact outputs byte for byte and the three floating-point outputs under a declared
tolerance (documented in `ENVIRONMENT.txt`), and runs a negative control. This is a replay by the producer, not an
independent reproduction.

## The most valuable next projects

1. Find the sharp fixed-k eigenvalue constant at real rank three (is the lower value ½ correct, as for k = 1?), and
   the best 0/1 constants at complex rank two for k ≥ 3.
2. Determine the second-order terms in the fixed-k growth.
3. Find the least order of a real rank-three matrix that breaks Pate's 0/1 statement for k = 2; it is at most 152.
4. Decide whether individual Schur-power blocks already grow like (log N)^k at real rank three.

## What is in the evidence package

| File | What it is |
|---|---|
| `manuscript.pdf` | The paper (23 pages); source `manuscript.tex`, figure `code/profile-figure.pdf` |
| `code/compact_pair_certificate.py`, `code/single_block_certificate.py`, `code/shell_certificate.py` | Exact 0/1 witnesses of orders 152, 378 and 10 710 |
| `code/second_compound_order27.py`, `code/order27_vectors.dat` | Exact order-27 spectral certificate for k = 2 |
| `code/check_profile_finite.py`, `code/check_multiplicities.py` | Exact checks on small frames; Schur-power multiplicities |
| `code/verify-rank-three.py`, `code/check_geometry.py`, `code/plot_profile.py` | Numerical checks and Figure 1 |
| `results/` | Recorded output of each script |
| `README.md`, `AI_INDEX.md` | Plain-English overview; machine-oriented map of claims and evidence |
| `REVIEW_SUMMARY.md`, `RESEARCH_GATES.json` | Internal review summary; prior-art and limitation record |
| `REPLAY_RECEIPT.md`, `ENVIRONMENT.txt`, `.github/workflows/replay.yml` | Replay record, environment and CI |
| `refs.bib`, `CITATION.cff`, `LICENSE.md`, `MANIFEST.sha256` | Bibliography, citation, licences (text CC0-1.0, code MIT), hashes |
