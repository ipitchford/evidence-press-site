## Summary

Losing the links between predictor and response observations can make regression coefficients ambiguous even when both distributions are known exactly. This candidate gives a small example where every predictor is necessary, yet two coefficient vectors produce the same response law and are not related by signs or permutations.

For independent Gamma predictors with known shapes, it also describes every such ambiguity. The answer is always a finite set, and a precise condition on subset sums of the shapes restores identification. These are population statements, not guarantees for estimates from finite samples.

## Summary for specialists

Fix independent $G_i\sim\mathrm{Gamma}(\alpha_i,1)$ with known $\alpha_i>0$ and $X_i=(G_i-\alpha_i)/\sqrt{\alpha_i}$. Put $a_i=\beta_i/\sqrt{\alpha_i}$. Equality of response laws is equivalent to equality of the positive atomic measure

$$\mu_\beta=\sum_{i:a_i\ne0}\alpha_i\delta_{a_i}.$$

Every coefficient fiber is a finite allocation of predictor labels to the observed signed scales, with prescribed total shapes. Minimality relative to the given dictionary is exactly full support. Uniform identification up to signed permutations for minimal vectors holds if and only if equal subset sums have equal constituent shape multisets; under that condition, fibers are precisely equal-shape permutation orbits.

Cumulants of orders $2,\ldots,2d+1$ determine the law and its fiber. A fixed-dictionary reflection construction proves that the highest consecutive order is optimal in the worst case over dictionaries with signed coefficients. It does not claim optimality for every dictionary or modulo signs.

## Technical account

The centered Gamma transform has a rational logarithmic derivative. A nonzero effective scale produces a pole, and its residue records the sum of shapes at that scale. Positive shapes prevent cancellation, including when coefficients have mixed signs. For noninteger shapes the proof uses this rational derivative, not an assertion that the transform itself is meromorphic.

The concrete dictionary is $(1,1,2)$, with coefficient vectors $(1,1,2\sqrt2)$ and $(2,2,\sqrt2)$. Their aggregate measures are both $2\delta_1+2\delta_2$, while their squared coefficient multisets differ. Full support makes both representations minimal relative to this dictionary.

Multiplying each atom's weight by its squared scale turns normalized cumulants into consecutive moments of a positive measure with at most $d$ atoms. Classical Vandermonde and Prony arguments recover that measure. The lower bound uses exact Lagrange interpolation to cancel every intervening odd cumulant for a response and its reflection.

## Evidence, assurance and limitations

The written proofs carry the universal claims. Producer replay checks 2,055 scale vectors, exact polynomial identities for dimensions 1 through 20, and four deliberately incorrect variants. Normal and optimized Python agree after fresh extraction. Internal editorial review is model-mediated; it is not unaffiliated specialist or journal peer review.

The package establishes neither a finite-sample estimator nor a numerical conditioning bound. Shapes and independence are assumed known. The general question for arbitrary independent non-Gaussian predictors remains open here. Historical novelty is uncertain, and no proof-assistant formalization is supplied.

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

Before estimating a parameter, one must know whether the observations determine it. Minimality removes unused predictors but can leave multiple ways to allocate indistinguishable distributional contributions. An explicit solution set makes that remaining uncertainty visible.

## How to inspect or reproduce the recorded checks

Download the versioned evidence archive and extract it. Run `python3 verify_manifest.py`, then `python3 -S reproduce.py` and `python3 -O -S reproduce.py`. Both replay outputs should match `evidence/replay.json`. Python 3.10 or later and its standard library suffice. The README gives the separate LaTeX build route.

## The most valuable next projects

- Audit the complete proofs and rebuild the allocation checker independently.
- Study estimation and numerical stability near colliding effective scales.
- Determine which other convolution relations admit a similarly complete classification.
- Search more broadly for earlier equivalent allocation or sharpness results.

## Who might contribute

Expertise in probability transforms, statistical identification, finite moment problems and exact subset-sum algorithms would help test the boundaries. No contributor or cited author endorsement is implied.

## What is in the evidence package

The archive contains the PDF, LaTeX and readable Markdown; original Python checks; recorded replay outputs; structured claims; provenance and licence records; a response to the supplied review; internal editorial reports; and a complete checksum manifest. GitHub provides the versioned source and prerelease; Zenodo preserves the exact release assets.
