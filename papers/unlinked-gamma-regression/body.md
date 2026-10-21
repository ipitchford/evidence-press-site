## Summary

This page explains, in order: what unlinked regression is, what was conjectured about it, the small example that breaks the conjecture, the exact rule that replaces it for Gamma predictors, how many summary statistics are needed, and what has and has not been checked.

**What unlinked regression is.** In ordinary regression each record pairs some predictor values with a response, and one fits coefficients that explain the response from the predictors. Sometimes the pairing is lost: the predictors and the responses are known separately, but the links between their observations are unavailable. One can still learn the *distribution* of the predictors and the *distribution* of the response. The basic question, before any estimation, is whether those two distributions determine the coefficients. If two different coefficient vectors produce exactly the same response distribution, no amount of unlinked data can tell them apart.

**What was conjectured.** Some ambiguity is unavoidable: swapping two identically distributed predictors, or flipping signs where the distribution allows it, changes nothing visible. Balabdaoui, Slawski and Steffani conjectured (in version 1 of their paper) that for independent, unit-variance predictors with at most one Gaussian component, and a *minimal* representation that uses no unnecessary predictors, signs and permutations are the only ambiguity.

**What was found.** This candidate gives a small example where every predictor is necessary, yet two coefficient vectors produce the same response law and are not related by signs or permutations. Take three centred Gamma predictors with shapes 1, 1 and 2. The sum of the first two and the third are identically distributed, so the response "first pair plus twice the third" has the same law as "twice the first pair plus the third". For independent Gamma predictors with known shapes, the release then describes every such ambiguity. The answer is always a finite set, and a precise condition on subset sums of the shapes restores identification: whenever two groups of predictors have the same total shape, they must consist of the same shapes. Finally, cumulants up to order $2d+1$, for $d$ predictors, determine everything, and that order cannot be lowered in the worst case.

**Status.** An unrefereed candidate, prepared with AI assistance. The universal claims rest on written proofs, supported by exact finite checks. These are population statements, not guarantees for estimates from finite samples. Historical priority is uncertain after bounded searches.

## Summary for specialists

Fix independent $G_i\sim\mathrm{Gamma}(\alpha_i,1)$ with known $\alpha_i>0$ and $X_i=(G_i-\alpha_i)/\sqrt{\alpha_i}$. Put $a_i=\beta_i/\sqrt{\alpha_i}$. Equality of response laws is equivalent to equality of the positive atomic measure

$$
\mu_\beta=\sum_{i:a_i\ne0}\alpha_i\delta_{a_i}.
$$

Every coefficient fiber is a finite allocation of predictor labels to the observed signed scales, with prescribed total shapes. Minimality relative to the given dictionary is exactly full support. Uniform identification up to signed permutations for minimal vectors holds if and only if equal subset sums have equal constituent shape multisets; under that condition, fibers are precisely equal-shape permutation orbits.

Cumulants of orders $2,\ldots,2d+1$ determine the law and its fiber. A fixed-dictionary reflection construction proves that the highest consecutive order is optimal in the worst case over dictionaries with signed coefficients. It does not claim optimality for every dictionary or modulo signs.

| Result | Where | Status |
|---|---|---|
| $Y_\beta\overset{d}{=}Y_\gamma$ iff $\mu_\beta=\mu_\gamma$ | Theorem 2.1 | proof |
| Every fiber is a finite allocation, $\lvert\mathcal B(\beta)\rvert\le(k+1)^d$; minimal iff every $\beta_i\ne0$ | Theorem 2.2 | proof |
| Dictionary $(1,1,2)$: $\mathcal B(\beta)=\{(1,1,2\sqrt2),(2,2,\sqrt2)\}$, both minimal, not signed permutations of each other | Section 3 | proof; exact check |
| Condition (SR) $\Leftrightarrow$ $\mathcal B(\beta)=H_\alpha\beta$ for all $\beta$ $\Leftrightarrow$ signed-permutation identification of minimal vectors | Theorem 4.1 | proof |
| Labeled uniqueness iff all labeled subset sums are distinct; identification for Lebesgue-almost every $\beta$ | Corollaries 4.2–4.3 | proof |
| Cumulants of orders $2,\ldots,2d+1$ determine the law; exact Prony reconstruction | Theorem 5.1, Section 5 | proof |
| $2d+1$ is the optimal uniform consecutive cutoff, with integer-shape examples | Theorem 5.2 | proof; identities checked for $d=1,\ldots,20$ |
| One Gaussian predictor: ambiguity only up to the Gaussian sign under (SR) | Proposition 6.1 | proof |
| Analytic convolution families with nonzero derivatives, including Poisson predictors | Theorem 6.2, Section 6 | proof |

## Technical account

**The invariant.** The centered Gamma transform has a rational logarithmic derivative. A nonzero effective scale produces a pole, and its residue records the sum of shapes at that scale. Positive shapes prevent cancellation, including when coefficients have mixed signs. For noninteger shapes the proof uses this rational derivative, not an assertion that the transform itself is meromorphic. The measure $\mu_\beta$ is closely related to the classical Thorin measure of a Gamma convolution; the release uses the signed scales directly so that centering and negative coefficients are covered.

**The counterexample.** The concrete dictionary is $(1,1,2)$, with coefficient vectors $(1,1,2\sqrt2)$ and $(2,2,\sqrt2)$. Their aggregate measures are both $2\delta_1+2\delta_2$, while their squared coefficient multisets, $\{1,1,8\}$ and $\{4,4,2\}$, differ. Full support makes both representations minimal relative to this dictionary. The example contradicts the literal signed-permutation conclusion of the conjecture, not finite identifiability, which still holds.

**The arithmetic rule.** Condition (SR) says that equal subset sums of shapes must have equal shape multisets. Every dictionary with all shapes equal satisfies it, as does $(1,1,3)$. Pairwise distinct shapes are not enough: $(1,2,3)$ fails, because $1+2=3$. When (SR) fails, two disjoint groups with equal total shape but different shapes can trade scales, which builds two minimal vectors that are not signed permutations of each other.

**Finite cumulants.** Multiplying each atom's weight by its squared scale turns normalized cumulants into consecutive moments of a positive measure with at most $d$ atoms. Classical Vandermonde and Prony arguments recover that measure. For the counterexample, $(c_2,c_3,c_4,c_5)=(10,18,34,66)$ gives the Prony polynomial $z^2-3z+2$, with roots 1 and 2. The lower bound uses exact Lagrange interpolation to cancel every intervening odd cumulant for a response and its reflection. For $d=3$, shapes $(45,9,1)$ and $\beta=(3\sqrt5,-6,3)$ give a response whose cumulants agree with those of $-\beta$ up to order six and first differ at order seven.

## Evidence, assurance and limitations

- **Proofs and checks.** The written proofs carry the universal claims. Producer replay checks 2,055 scale vectors, exact polynomial identities for dimensions 1 through 20, and four deliberately incorrect variants (altered signs, shapes, the variance factor and the cumulant factorial). Normal and optimized Python agree after fresh extraction. The checks use rational arithmetic and the standard library; they are implementation evidence for bounded instances, not machine-checked universal mathematics.
- **Review.** Internal editorial review is model-mediated; it is not unaffiliated specialist or journal peer review. The cumulant lower-bound construction originated in a supplied review and was checked before inclusion; supplied review identities and processes have not been authenticated.
- **Limitations.** The package establishes neither a finite-sample estimator nor a numerical conditioning bound. Shapes and independence are assumed known. The general question for arbitrary independent non-Gaussian predictors remains open here, as do noisy-response deconvolution and efficient exact subset-sum algorithms. Historical novelty is uncertain, and no proof-assistant formalization is supplied. Environment reproducibility is partial: the Python checks are dependency-free, but no bit-identical TeX environment is guaranteed.

## Relationship to earlier work

The example addresses the signed-permutation conclusion of the version-1 conjecture of Balabdaoui, Slawski and Steffani. It does not refute finite identifiability. Their paper already recognizes Gamma convolution as an obstruction; this candidate shows explicitly how that obstruction survives fixed-dictionary minimality and classifies its allocations.

Thorin measures and Prony reconstruction are established tools. The recent unmatched-regression and deconvolution literature distinguishes coefficient estimation from recovery of the latent linear-predictor law. This classification describes a particular population ambiguity those formulations accommodate; their statistical rates are not automatically inherited.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probability and statistics researchers | Inspect an exact identification criterion and complete solution set. | Fixed known Gamma dictionary; unrefereed candidate. |
| Computational researchers | Test allocation and moment-reconstruction implementations. | Exact arithmetic does not provide conditioning or efficient subset-sum algorithms. |
| Users of unlinked data | Understand why recovering a distribution need not recover its coefficients. | This is not a validated applied estimator. |

## Why the problem matters

Before estimating a parameter, one must know whether the observations determine it. Minimality removes unused predictors but can leave multiple ways to allocate indistinguishable distributional contributions. An explicit solution set makes that remaining uncertainty visible. The subset-sum rule identifies in advance the shape dictionaries for which only equal-shape permutations remain.

## How to inspect or reproduce the recorded checks

Download the versioned evidence archive and extract it. With Python 3.10 or later and its standard library only:

```sh
python3 verify_manifest.py
python3 -S reproduce.py
python3 -O -S reproduce.py
```

Both replay outputs should match `evidence/replay.json`. The producer ran Python 3.14.7 on macOS, and CI tests Linux separately. The README gives the separate LaTeX build route.

To read the mathematics, start with Section 1 of the paper (the model) and the counterexample in Section 3, then Theorem 4.1 for the arithmetic rule and Section 5 for cumulants. `AI_INDEX.md` maps each claim to its evidence.

## The most valuable next projects

- Audit the complete proofs and rebuild the allocation checker independently.
- Study estimation and numerical stability near colliding effective scales.
- Determine which other convolution relations admit a similarly complete classification.
- Search more broadly for earlier equivalent allocation or sharpness results.

## Who might contribute

Expertise in probability transforms, statistical identification, finite moment problems and exact subset-sum algorithms would help test the boundaries. No contributor or cited author endorsement is implied.

## What is in the evidence package

The archive contains the PDF, LaTeX and readable Markdown; original Python checks; recorded replay outputs; structured claims; provenance and licence records; a response to the supplied review; internal editorial reports; and a complete checksum manifest. Original prose and data are CC0-1.0 and original code is MIT; supplied third-party review files are not redistributed. GitHub provides the versioned source and prerelease; Zenodo preserves the exact release assets.
