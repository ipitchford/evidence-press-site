## Summary

Robust reconstruction should pay attention to the spectrum of the measurement operator. This candidate gives a quantitative theorem for a spectral linear estimator in Gaussian inverse problems with samplewise norm-bounded attacks. It is asymptotically optimal among linear estimators for normalized robust risk and has a uniform finite-dimensional **additive** regret bound.

The same estimator can be implemented at population level by training with anisotropic Gaussian input jitter when the minimizing dual parameter is positive. One common isotropic jitter level is generally too restrictive: under positive-noise active-estimation hypotheses, it matches the robust rule exactly only when the positive singular spectrum is flat.

## Summary for specialists

After diagonalising the forward operator, the linear robust-risk problem separates through a scalar dual parameter. The proposed spectral rule chooses one coefficient per singular direction. The paper bounds its excess normalized robust risk uniformly in finite dimension and proves convergence to the optimal linear robust risk.

For a positive minimizing dual parameter, the optimal coefficients coincide with population least-squares coefficients after adding independent Gaussian input noise with direction-dependent variances. Equality with isotropic jitter imposes an algebraic compatibility condition across active positive singular directions. Under the stated positive-noise assumptions that condition is equivalent to a flat positive spectrum.

## Technical account

Three distinctions carry most of the theorem's meaning.

First, the comparison class is linear estimators. No assertion is made about minimax optimality among all measurable or nonlinear rules.

Second, the finite theorem controls an additive difference in normalized robust risk. It does not provide a uniform risk ratio. A ratio can be unstable when the comparator risk is small even while an additive bound is informative.

Third, the jitter identity is a population normal-equation result. It specifies a covariance that makes the population least-squares solution equal the robust spectral estimator. It is not a finite-sample learning theorem.

The exact two-band witness isolates the geometry cleanly. Distinct spectral bands require distinct jitter levels, and the rational certificate shows a strict gap from the best common isotropic level under the stated model.

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

## How to inspect the result

Start with the normalised-risk definition and the linear comparison class. Check the dual spectral rule and the hypotheses used to obtain a positive minimizing parameter. Then compare the anisotropic normal equations with the exact two-band certificate. The repository [AI index](https://github.com/ipitchford/robust-gaussian-inverse-estimation/blob/v1.0.0/AI_INDEX.md) maps claims to proof and code; the [replay guide](https://github.com/ipitchford/robust-gaussian-inverse-estimation/blob/v1.0.0/REPLAY.md) delimits the executable evidence.

## The most valuable next projects

The clearest extension is a finite-sample theorem showing when empirical jitter training approaches the population rule. An unaffiliated proof reconstruction should precede empirical promotion. Nonlinear comparators and non-Gaussian models are separate research programmes, not automatic consequences of this result.

## What is in the evidence package

Version 1.0.0 contains the complete manuscript, TeX and Markdown sources, exact and numerical checking code, claim and provenance maps, literature audit, licences and a noncircular manifest. GitHub and Zenodo preserve the frozen archive and paper. That establishes availability and byte identity, not external peer review, independent reproduction or empirical validity.
