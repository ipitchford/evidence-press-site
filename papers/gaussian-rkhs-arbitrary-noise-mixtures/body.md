## Summary

**The everyday problem.** To learn how a random system evolves from data, kernel methods such as kernel extended
dynamic mode decomposition (kernel EDMD) average smooth "test functions" over one random step of the system. The
analysis is cleanest when this averaging keeps every test function inside the same space of smooth functions; the
most common choice is the space built from a Gaussian kernel of width P. If the averaging leaves that space, the
learned operator is not even well defined on it, and published error bounds that assume it stays inside do not apply.

**What was known.** An earlier Evidence Press release,
[When Gaussian kernel spaces are invariant under stochastic dynamics](/releases/gaussian-rkhs-stochastic-invariance/),
found the exact condition for linear systems. It also showed that a "map plus noise" step, X' = F(x) + Z, keeps the
space only if F is affine (a straight-line map plus a shift), but only for noise whose characteristic function is not
too small. It left two questions open: can that condition on the noise be dropped, and can any transition whose
randomness depends on the state keep the space?

**What is new.** This release answers both.

1. **No noise rescues nonlinear drift.** For every noise distribution, including noise whose frequency content is cut
   off entirely, the map F must be affine, and the size (operator norm) of the averaging operator has an exact formula.
2. **The reason is sharp.** The argument works for any target space whose functions grow, in the complex direction,
   more slowly than every exponential of an exponential. For every faster growth rate there is a space in which a
   wavy map x + c·sin x works.
3. **State-dependent mixtures can pass, exactly.** A mixture of Gaussian branches whose mixing probabilities ("gates")
   depend on the state keeps the space exactly when each gate, continued into the complex plane, grows no faster than
   an explicit Gaussian. With branch variance q: a bump-shaped gate e^(−αx²) works exactly when α ≤ 8q/(1+4q); a
   probit gate Φ(βx) works exactly when β² ≤ 16q/(1+4q); a logistic gate never works, because its complex
   continuation has poles. Wider kernels need wider (gentler) gates.
4. **A by-product for operator theory.** The same argument settles a several-variable case of a "no cancellation"
   question for sums of weighted composition operators on Fock spaces.

**Probit gates can pass; logistic gates never can.** For example, a bump gate of steepness α = 1 needs branch variance
at least q = 1/4.

## Summary for specialists

Let $k_P(x,y)=\exp[-(x-y)^\top P^{-1}(x-y)]$, let $\mathcal H_P(\mathbb R^m)$ be its RKHS with global norms, and let $Tf(x)=\mathbb E[f(X')\mid X=x]$.

- **Theorem A (Theorem 2.1).** For every probability law of $Z$, $Tf(x)=\mathbb E f(F(x)+Z)$ maps $\mathcal H_P(\mathbb R^m)$ boundedly into $\mathcal H_R(\mathbb R^d)$ only if $F$ is injective and affine, $F(x)=Ax+b$ with $A$ of full column rank; the operator norm is given exactly. The noise enters only through a deterministic composition out of the stationary space with spectral measure $|\varphi_Z|^2\mu_P$ (Remark 2.2).
- **Theorem B (Theorem 3.1, Proposition 3.2, Corollary 3.3).** If the source is a stationary RKHS whose spectral measure dominates a multiple of Lebesgue measure near zero, and the target is a Hilbert space of entire functions in which $\log\lVert \mathrm{ev}_{x+iy}\rVert$ has zero exponential type in $y$, every bounded composition of this form has affine $F$. For every type $c>0$ there are a bandlimited source and a stationary target of that type admitting a bounded composition with a nonlinear map, so the zero-type condition cannot be relaxed.
- **Theorem C (Theorems 5.1 and 5.5).** A finite mixture $\sum_j p_j(x)\,N(Mx+b_j,Q_j)$, with pairwise distinct pairs $(Q_j,b_j)$ and Borel probabilities $p_j$, is bounded from $\mathcal H_P$ into $\mathcal H_R$ if and only if $M$ has full column rank and each $p_j$ extends to an entire function with $|p_j(x+iy)|\le C e^{2y^\top D_j y}$, where $D_j=R^{-1}-M^\top(P+4Q_j)^{-1}M$.
- **Gates (Corollaries 6.1 and 6.2).** In the scalar case $P=R=1$, $M=1$, with branch variance $q$: the bump gate $e^{-\alpha x^2}$ is admissible exactly when $\alpha\le 8q/(1+4q)$, boundary included ($q=1/12,\ 1/4,\ 3/4$ at $\alpha=1/2,\ 1,\ 3/2$); the probit gate $\Phi(\beta x)$ exactly when $\beta^2\le 16q/(1+4q)$; the logistic gate never.
- **Fock form (Corollary 5.3).** For $\mathcal A$ invertible and distinct $b_j$, a finite sum $\sum_j W_{\psi_j,\mathcal Az+b_j}$ of weighted composition operators maps $F^2_{\omega_1}(\mathbb C^d)$ boundedly into $F^2_{\omega_2}(\mathbb C^d)$ if and only if every summand is bounded.

## Technical account

**Idea of the proof.** Evaluating the averaged function at a complex point is represented by a family of
frequency-domain coefficients that depends analytically on the point. Near frequency zero every noise has
characteristic function close to one, so it can be divided out there. What remains is a family of exponentials that
must continue analytically; this forces F to be entire, and slow growth of its imaginary part forces it to be affine.
For mixtures, a fixed Gram matrix of Gaussian kernels shows that the branches cannot cancel each other's growth, so
each gate must satisfy the bound on its own.

**Noise with spectral zeros (Section 4).** For noise with characteristic function (1 − |ξ|)₊, which vanishes for
|ξ| ≥ 1, Theorem A still forces affine drift, yet every nonzero slope is allowed on H₁(R), and the squared norm equals
$1/|a|$ exactly when $|a|\le a_*\approx 4.54$. Noise with a frequency cut-off can thus admit arbitrarily expansive affine maps
while never admitting nonlinear drift.

**What is classical and what is new.** The norm formula in Theorem A follows from kernel domination and Bochner's
theorem. The multiplier criterion (Lemma 5.2) is the Gaussian form of a classical Fock-space criterion. The smoothing
spectrum (Appendix A) is a classical Gaussian integral-operator calculation. The noise in Theorem A is formal at the
operator level, so the new content of Theorems A and B is a cross-space composition rigidity theorem with no
regularity assumed on F and a sharp growth condition on the target. The analytic continuation device is a variant of
the feature-map argument of Ikeda, Ishikawa and Sawano. In one complex variable, the Fock no-cancellation statement
behind Theorem C, and much more, was obtained independently and at the same time by Cho, Choe, Koo and Tien and by Lin,
Lu, Yang and Zu; Corollary 5.3 settles the several-variable case with a common invertible linear part, which Cho et al.
note is open. The different-covariance classification (Theorem 5.5) involves distinct Gaussian integral operators
rather than weighted composition operators.

## Evidence, assurance and limitations

- **Written proofs.** All theorems rest on written proofs in the paper.
- **Computational checks.** `code/verify.py` runs 97 checks (spectral constants, tube norm, exact scalar thresholds,
  Gram identities against direct quadrature, triangular-noise norms, the warping identity and the smoothing
  formulas). `code/check_extensions.py` runs 63 checks, almost all in 50-digit arithmetic (the threshold a_*, growth
  bounds for the warping target, the probit bound and threshold, the logistic pole, the Fock Gram matrix in two
  variables, the threshold identities). These finite calculations test constants and implementations; they do not
  certify the analytic theorems. Changing the probit threshold from 4D to 2D in a copy makes six checks fail.
- **Assurance.** Internal AI-assisted review only: a five-perspective Claude review panel (with a methodology audit of
  every original proof), clean replays, one revision round with extensions, a re-review and a proof audit of all new
  and rewritten proofs. No major or critical issue remained; minor items were applied before release. No Astra or Codex
  second-model review took place. This is not peer review, independent reproduction or formal verification.
- **Scope.** All statements concern global RKHS norms. They do not rule out nonlinear prediction from finite data,
  bounded operators on other spaces, or error bounds in weaker norms. Recent stochastic kernel-EDMD error bounds by
  Hertel, Philipp, Schaller and Worthmann, for instance, use Sobolev spaces on bounded domains and include nonlinear
  examples.
- **Status.** Unrefereed research candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers analysing kernel EDMD and kernel Koopman methods | Tell which random transition models can keep a Gaussian kernel space invariant before applying invariance-based error bounds | Global RKHS norms only; says nothing about finite-data accuracy |
| Modellers using gated mixtures (mixtures of experts) with Gaussian kernels | Choose probit rather than logistic gates, and a kernel width that admits the gate steepness | Common linear part and fixed covariances only |
| Operator theorists working on Fock and Paley–Wiener spaces | A several-variable no-cancellation result and a sharp growth threshold for composition rigidity | One-variable case due concurrently to two other groups |
| Students of reproducing kernel spaces | Worked exact thresholds and an explicit phase diagram | Unrefereed candidate |

## Why the problem matters

Error analyses of kernel approximations of Koopman operators often assume that the kernel space is invariant under
the transition operator. Before such a bound can be applied to a model, one must know whether that assumption can
hold for the model at all. The answer here is sharp: additive noise never helps a nonlinear drift, while gated
Gaussian mixtures can qualify, and whether they do depends on the gate's behaviour off the real line.

This is a direct follow-up to
[When Gaussian kernel spaces are invariant under stochastic dynamics](/releases/gaussian-rkhs-stochastic-invariance/)
(DOI [10.5281/zenodo.24089772](https://doi.org/10.5281/zenodo.24089772)). That release listed as next projects (i)
whether any state-dependent non-Gaussian transition can be bounded and (ii) whether its lower bound on the noise's
characteristic function can be removed. Theorem A settles (ii) completely; Theorem C answers (i) in the affirmative and
classifies a natural family. The earlier release is unchanged.

## How to inspect or reproduce the recorded checks

Download the archive from Zenodo (DOI [10.5281/zenodo.24550034](https://doi.org/10.5281/zenodo.24550034)) or the
[GitHub release](https://github.com/ipitchford/gaussian-rkhs-arbitrary-noise-mixtures/releases/tag/v0.1.0-candidate).
From the package root, with uv:

```sh
uv run --python 3.12 --with numpy==2.3.5 --with scipy==1.17.0 --with sympy==1.14.0 python3 -I -B -O code/verify.py --output results/verification.json
uv run --python 3.12 --with numpy==2.3.5 --with sympy==1.14.0 --with mpmath==1.3.0 python3 -I -B -O code/check_extensions.py --output results/extensions.json
uv run --python 3.12 --with numpy==2.3.5 --with matplotlib==3.10.8 python3 -I -B code/make_figures.py
```

Each takes seconds. Expected: verify.py reports PASS with 97 checks and check_extensions.py reports 63 checks with
none failed. GitHub CI on Linux reruns all three, compares the outputs with the shipped results under a declared
tolerance (documented in `ENVIRONMENT.txt`) and runs the negative control. This is a replay by the producer, not an
independent reproduction.

## The most valuable next projects

1. Mixtures whose branches have different linear parts: branch features can coincide at complex states, so the
   uniform Gram bound fails and a different argument is needed.
2. State-dependent component covariances, infinitely many state-dependent components and state-dependent Lévy-type
   kernels.
3. General Markov transitions between Gaussian kernel spaces.
4. Whether the zero-type growth condition is also sharp for Gaussian (rather than bandlimited) sources.

## What is in the evidence package

| File | What it is |
|---|---|
| `manuscript.pdf` | The paper (21 pages); source `manuscript.tex` and `varying-covariances.tex` |
| `figures/phase-diagram.pdf`, `.png` | Figure 1: the exact admissible region for the bump gate |
| `code/verify.py`, `code/check_extensions.py`, `code/make_figures.py` | The checks and the figure script |
| `results/verification.json`, `results/extensions.json` | Recorded outputs (97 and 63 checks) |
| `README.md`, `AI_INDEX.md` | Plain-English overview; machine-oriented map of claims and evidence |
| `REVIEW_SUMMARY.md`, `RESEARCH_GATES.json` | Internal review summary; prior-art and limitation record |
| `REPLAY_RECEIPT.md`, `ENVIRONMENT.txt`, `.github/workflows/replay.yml` | Replay record, environment and CI |
| `refs.bib`, `CITATION.cff`, `LICENSE.md`, `MANIFEST.sha256` | Bibliography, citation, licences (text CC0-1.0, code MIT), hashes |
