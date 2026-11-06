## Summary

A transport plan is a rule for pairing two distributions. Adding entropy makes the pairing more diffuse, which often makes transport calculations easier. The question here is not how much the transport cost changes, but how far the **whole joint distribution** moves.

This candidate studies Gaussian distributions, including ones confined to lines or lower-dimensional spaces. The central geometric feature is the angle between their supports. Nearly perpendicular directions interact weakly: a small entropy penalty can still cause a substantial change in the pairing.

The paper derives the exact small-entropy coefficient for arbitrary finite ranks, finds its sharp support-dependent maximum, and proves that bounded total variance alone does not guarantee uniform convergence. It then supplies an explicit uniform error bound when positive covariance eigenvalues and positive support cosines stay away from zero.

**What is not new here.** The full-rank coefficient, its sharp dimension-only bound and equality case already appear in public MathDB proofs. They are credited and retained as a benchmark, not presented as a new conjecture resolution.

## Summary for specialists

The objective is squared Euclidean cost plus $2\varepsilon\operatorname{KL}$ relative to the product marginals. Let $D_\varepsilon=W_2^2(\pi_\varepsilon,\pi_0)$ on the product space, where $\pi_0$ is the entropy-selected Gaussian limit.

In orthonormal marginal support coordinates, write $K=E^TF$ and $B_s^{1/2}K^TA_s^{1/2}=USV^T$. For positive interaction rank $r$,

$$D_\varepsilon=\varepsilon\operatorname{tr}(J^{-1}S^{-1})+O(\varepsilon^2),$$

where

$$J=V^TA_s^{-1}V+U^TB_s^{-1}U.$$

The fixed-support sharp upper bound is $\frac12\sum_{j=1}^r\kappa_j^{-1}$, where the $\kappa_j$ are positive principal cosines. Identity covariances on the two supports attain it, even when the supports differ. Exactly zero interaction gives zero distance for every positive regularisation level.

If the support covariance spectra lie in $[m,M]$ and all positive cosines are at least $c_0>0$, the paper gives an explicit quadratic remainder uniform over that class. Its $c_0^{-2}$ dependence is necessary in order, although the general numerical constants are not claimed optimal.

## Technical account

The proof isolates covariance created perpendicular to the limiting joint support. That kernel contribution supplies the first-order squared distance; the positive compressed covariance contributes only at second order. This avoids differentiating a matrix square root at a zero eigenvalue.

The simplest example makes the geometry visible. Take unit-variance Gaussian distributions on two lines with positive cosine $c$. Set $u=\varepsilon/c$ and $\rho=2/(\sqrt{4+u^2}+u)$. Then

$$D_\varepsilon=4-2\sqrt{2+2\rho}.$$

Thus the relevant scale is entropy **relative to the interaction**, not entropy alone. At $u=1$, the distance squared is $4-2\sqrt{1+\sqrt5}$, approximately $0.402$. At exactly $c=0$, the selected limiting plan changes: both plans are independent and their distance is zero. The formula for $c>0$ must not be evaluated as though the reference plan stayed fixed at orthogonality.

An explicit moving two-dimensional family keeps both covariances positive definite and their traces bounded while producing this positive limiting error. It does not contradict fixed-pair convergence: the covariance pair changes alongside the entropy parameter.

## Evidence, assurance and limitations

The universal statements rest on written proofs. Numerical scripts test formula consistency and deliberately corrupted cases; their outputs are floating-point diagnostics, not interval certificates or formal proofs. Review is internal and AI-assisted, not external peer review or independent human reproduction.

The results require finite-dimensional Gaussian marginals and product-reference entropy. They do not establish an equivalent non-Gaussian result, empirical covariance estimation guarantees, an optimal tuning rule, or convergence of an iterative Sinkhorn solver. Uniform error control requires the stated spectral and positive-angle gaps.

## Relationship to earlier work

Gaussian entropic optimisers and spectral shrinkage are inherited from earlier work, including Mallasto, Gerolin and Minh and Yun. Public MathDB submissions already derive the full-rank sharp coefficient. The candidate contribution is the singular-support geometry, its sharp extrema, the moving-family obstruction, and explicit angle-conditioned uniform control. A bounded source comparison found no exact predecessor for those residual statements; that is not a guarantee of global originality.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Optimal transport researchers | Separate pointwise and uniform plan convergence near singular supports | Gaussian, finite-dimensional setting |
| Researchers using low-rank Gaussian models | Identify support-angle degeneracy as an error-control parameter | Not a statistical estimation guarantee |
| Numerical analysts | Use an explicit conservative regularisation envelope | Constants are sufficient, not tuned or optimal |

## Why the problem matters

Two distributions can each look well scaled on their own supports yet interact only weakly. Covariance magnitude alone therefore misses a geometric source of sensitivity. The theorem identifies what additional gap restores uniform control, rather than promising that an entropy parameter is universally small enough.

## How to inspect or reproduce the recorded checks

Start with the manuscript's support-coordinate definitions and the rank-one example. The evidence package contains the numerical checker, explicit guard tests, environment information and replay instructions. Use a fresh output directory and the documented normal and optimized Python commands. Use the exact tagged version and record your own commands and results; published CI is separate operational evidence. A successful finite test is not the proof of the theorem.

## The most valuable next projects

1. Determine optimal numerical constants for the angle-conditioned remainder.
2. Separate covariance-estimation uncertainty from regularisation error in low-rank applications.
3. Identify additional hypotheses permitting analogous non-Gaussian statements.

## What is in the evidence package

The stand-alone manuscript, source, claims map, attributed prior-work comparison, explicit numerical checks and negative controls, component licences, limitations and replay information. The full-rank predecessor is credited; no private editorial assessments are distributed.
