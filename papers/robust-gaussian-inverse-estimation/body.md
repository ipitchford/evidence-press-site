## Summary

This page explains, in order: what an inverse problem is and why attacks on it matter, what was proposed earlier, what this release proves, what it means for training with added noise, and what has and has not been checked.

**The problem.** Many measurement systems do not record the thing of interest directly. A scanner, camera or sensor array records a mixed or compressed version of it, plus noise, and software must reconstruct the original. This is an *inverse problem*. A reconstruction rule can work well on typical data yet do badly when each measurement is nudged by a small, deliberately chosen perturbation. *Robust* estimation asks for rules whose worst-case error under such nudges stays small. Here every measured sample gets its own perturbation budget: a samplewise norm-bounded attack.

**What was proposed.** Krainovic, Soltanolkotabi and Heckel (NeurIPS 2023) studied this question when the signal and noise are Gaussian. They proposed a simple rule: split the measurement operator into independent directions (its singular directions) and give each direction its own reconstruction gain, all tuned through a single number (a dual parameter). They conjectured that this spectral rule is asymptotically the best linear reconstruction (their Conjecture 3.3), and they studied *jittering*, that is, training a reconstructor while adding random noise to its inputs, as a route to robustness.

**What was found.** Robust reconstruction should pay attention to the spectrum of the measurement operator. This candidate proves that the proposed spectral linear estimator is asymptotically optimal among linear estimators for normalized robust risk, and gives a uniform finite-dimensional **additive** regret bound, valid for every forward operator, aspect ratio, noise level and positive attack radius.

The same estimator can be implemented at population level by training with anisotropic Gaussian input jitter (noise of different sizes in different directions) when the minimizing dual parameter is positive. One common isotropic jitter level is generally too restrictive: under positive-noise active-estimation hypotheses, it matches the robust rule exactly only when the positive singular spectrum is flat. An exact two-band example certifies a strict gap otherwise.

**What it means.** If noise is added during training to make a linear reconstructor robust, that noise should be shaped to the measurement operator; one noise level for every direction is generally not enough when the operator treats directions unequally. This is a statement about population (infinite-data) least-squares training of linear estimators in a Gaussian model. It says nothing about finite datasets, nonlinear estimators such as neural networks, risk ratios or measured performance on real data.

**Status.** An anonymous, AI-assisted, unrefereed candidate. The theorems rest on written analytic proofs; the replay checks finite cases and an exact rational certificate. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

After diagonalising the forward operator, the linear robust-risk problem separates through a scalar dual parameter. The proposed spectral rule chooses one coefficient per singular direction. The paper bounds its excess normalized robust risk uniformly in finite dimension and proves convergence to the optimal linear robust risk.

Concretely (Theorem 1), write $E$ for the signal energy, $d$ for the signal dimension, and

$$
\mathcal R_\varepsilon(H)=\mathbb E\Big[\max_{\|e\|\le\varepsilon}\|H(Ax+z+e)-x\|^2\Big],
$$

so that the adversarial maximum sits inside the expectation. With

$$
\eta_d=\frac{2^{7/4}}{3^{3/4}}d^{-1/4}+\sqrt2\,d^{-1/2},
$$

the selected spectral estimator $H_*$ satisfies

$$
0\le\mathcal R_\varepsilon(H_*)-\inf_H\mathcal R_\varepsilon(H)\le E\min\{1,\eta_d\},
$$

the infimum being over all linear estimators. So the regret divided by $E$ tends to zero as $d\to\infty$, for arbitrary sequences of operators, dimensions, noise levels and positive radii. Neither the rate exponent nor the leading constant is asserted to be optimal.

For a positive minimizing dual parameter, the optimal coefficients coincide with population least-squares coefficients after adding independent Gaussian input noise with direction-dependent variances. Equality with isotropic jitter imposes an algebraic compatibility condition across active positive singular directions. Under the stated positive-noise assumptions that condition is equivalent to a flat positive spectrum.

## Technical account

Three distinctions carry most of the theorem's meaning.

First, the comparison class is linear estimators. No assertion is made about minimax optimality among all measurable or nonlinear rules.

Second, the finite theorem controls an additive difference in normalized robust risk. It does not provide a uniform risk ratio. A ratio can be unstable when the comparator risk is small even while an additive bound is informative.

Third, the jitter identity is a population normal-equation result. It specifies a covariance that makes the population least-squares solution equal the robust spectral estimator. It is not a finite-sample learning theorem.

The exact two-band witness isolates the geometry cleanly. Distinct spectral bands require distinct jitter levels, and the rational certificate shows a strict gap from the best common isotropic level under the stated model. In the paper's example (Proposition 7 and Corollary 8), the short analytic certificate gives a limiting gap greater than $0.141382$ at unit signal energy, and a true finite-dimensional gap greater than $0.007292$ at $d=20000$ and every larger multiple of five. More generally, Theorem 6 shows that fixed unequal spectral bands yield a strictly positive limiting true-risk gap.

The proof of the main theorem combines exact symmetry reduction (to diagonal estimators), gain clipping and a Gaussian quadratic-process estimate controlling the singular dual boundary. An invariant version of the dual-gap estimate allows arbitrary Gaussian residual covariance (Proposition 3). The explicit jitter covariance is equation (29), and Corollary 4 states the exact population implementation.

## Evidence, assurance and limitations

The frozen package contains finite numerical checks using exact Gaussian norm expectations and scalar optimisation, plus an exact rational certificate for the two-band gap. Normal and optimized-wrapper replay agree, with inherited optimization removed from checker subprocesses and their optimization levels recorded.

The asymptotic theorem and uniform bound depend on written analytic arguments. Replay checks finite premises and examples; it is not proof-assistant verification of the universal proof. The banner is a schematic spectrum-and-filter diagram, not measured risk data.

No finite-sample training, nonlinear optimality, empirical inverse-problem benchmark or risk-ratio conclusion is established. The isotropic boundary requires positive noise and active estimation; degenerate directions must not be folded into an unrestricted slogan.

## Relationship to earlier work

The source framework proposes a spectral estimator for distributionally robust Gaussian inverse problems. Classical spectral and Tikhonov regularisation supply the broader inverse-problem setting. This candidate seeks to add a quantitative additive-regret theorem, a precise population-jitter implementation and a sharp isotropic boundary with an exact separation witness.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Inverse-problem theorists | Inspect a robust linear spectral rule with a finite additive guarantee. | The guarantee is not multiplicative and does not cover nonlinear estimators. |
| Robust-learning researchers | Interpret anisotropic augmentation as a population implementation mechanism. | Finite-sample learning is not proved. |
| Practitioners choosing regularisation | See why equal regularisation across unequal spectral bands can be suboptimal. | The Gaussian model and adversarial geometry are assumptions, not validated application data. |

## Why the problem matters

Robustness to small, deliberate perturbations matters wherever reconstructions feed decisions, and adding noise during training is a common, cheap way to pursue it. The source paper offered a natural candidate rule and conjectured its optimality. This release supplies a quantitative proof in the linear Gaussian setting and states exactly when a single noise level is enough. That turns a qualitative recommendation, shape the jitter to the operator, into a precise condition, while keeping finite-sample and nonlinear training as separate questions.

## How to inspect or reproduce the recorded checks

Start with the normalised-risk definition and the linear comparison class. Check the dual spectral rule and the hypotheses used to obtain a positive minimizing parameter. Then compare the anisotropic normal equations with the exact two-band certificate. The repository [AI index](https://github.com/ipitchford/robust-gaussian-inverse-estimation/blob/v1.0.0/AI_INDEX.md) maps claims to proof and code; the [replay guide](https://github.com/ipitchford/robust-gaussian-inverse-estimation/blob/v1.0.0/REPLAY.md) delimits the executable evidence.

From the repository root, with Python 3.12 and the pinned `requirements.txt`:

```sh
python code/replay.py --output replay-output.json
python -O code/replay.py --output replay-output-wrapper-optimized.json
```

The output path must be new. The runner hashes both verifier sources, runs `code/inverse_risk_checks.py` (finite numerical checks using exact Gaussian norm expectations and scalar optimisation) and `code/analytic_isotropic_gap.py` (the exact rational two-band certificate) in fresh normal-mode subprocesses, and checks their results. The second command optimizes only the orchestration wrapper; its receipt records `verifier_subprocess_optimized: false`, so it is not evidence that the verifier subprocesses ran under `-O`. The replay validates finite instances and the exact two-band arithmetic; it does not execute the general uniform proof.

## The most valuable next projects

The clearest extension is a finite-sample theorem showing when empirical jitter training approaches the population rule. An unaffiliated proof reconstruction should precede empirical promotion. Nonlinear comparators and non-Gaussian models are separate research programmes, not automatic consequences of this result.

## What is in the evidence package

Version 1.0.0 contains the complete manuscript, TeX and Markdown sources, exact and numerical checking code, claim and provenance maps, literature audit, licences and a noncircular manifest. GitHub and Zenodo preserve the frozen archive and paper. That establishes availability and byte identity, not external peer review, independent reproduction or empirical validity.
