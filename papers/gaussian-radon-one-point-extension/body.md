## Summary in plain English

Divide the labels of random points into two groups and take each group's convex hull—the smallest convex shape containing it. How does the chance that those two shapes intersect change as the groups become more balanced?

For independent points from one nonsingular Gaussian distribution, this candidate proves log-concavity when there are **dimension plus three points**. Log-concavity implies a symmetric rise towards the centre, although a wider central plateau is not excluded. The result extends a published dimension-plus-two theorem by one point; it does not settle the general conjecture.

The key observation is simple to state: for every feasible labelled split in this setting, exactly two individual deletions preserve the intersection. The paper turns that count into a probability identity and an explicit inequality. This is an AI-assisted, unrefereed mathematical candidate based on a written proof.

## Summary for specialists

Let $n=d+3$, let $q_k(n,d)$ be the convex-hull intersection probability for one fixed labelled $k$-versus-$(n-k)$ split, and write $a_j=q_j(n-1,d)$, with zero endpoints. The paper proves

$$2q_k=k a_{k-1}+(n-k)a_k,$$

and

$$q_k^2-q_{k-1}q_{k+1}\ge\frac{(a_k-a_{k-1})^2}{4}.$$

The sampling law is common and nonsingular Gaussian. The exchangeable transfer requires positive-interior log-concavity of the **common deletion marginal**; it does not establish that property for arbitrary exchangeable samples. The quantitative lemma supplies exact slack and equality conditions, with strictness proved at specified near-boundary indices rather than every interior Gaussian index.

## Technical account

### Why two deletions are enough

The affine-dependence space has dimension two. A feasible sign cone is a pointed planar sector with exactly two boundary rays. In affine general position, each boundary ray corresponds to deleting one point. An infeasible split has no preserving deletion. Taking expectations gives the displayed recurrence.

The smaller-sample Gaussian theorem supplies the required log-concavity. Weighted adjacent averaging then gives the larger-sample conclusion. The exact slack separates the squared difference of adjacent entries from nonnegative inherited log-concavity slacks; this also identifies the local equality conditions.

### A four-point example without simulation

For four independent Gaussian points on a line, the fixed-split probabilities, including empty groups, are

$$ (q_0,q_1,q_2,q_3,q_4)=(0,1/2,2/3,1/2,0). $$

A singleton is internal in two of its four possible ranks. A two-versus-two split fails only in the two separated label orders out of six. These exact order counts explain the example without numerical sampling.

### Keep the two probability objects separate

The sequence above concerns a fixed labelled split. It is not the probability mass function of a uniformly chosen Radon-side size. Binomial weighting and normalization convert the recurrence into convolution with a fair Bernoulli law. Qualitative ultra-log-concavity preservation under that convolution is Liggett's established theorem, not a new general sequence result.

## Evidence, assurance and limitations

The universal statements rest on written arguments and the cited Gaussian base theorem. Packaging checks establish inspectable files, not theorem correctness. There is no numerical scientific replay, experimental dataset, proof-assistant verification, unaffiliated reproduction or external peer review claimed.

The result covers $n=d+3$. Cases $n\ge d+4$, arbitrary convex-body sampling and point-dependent Gaussian laws remain outside its conclusion. The argument does not rule out a wider central plateau or prove strictness at every interior index. Bounded source comparison is not an absolute priority guarantee.

## Relationship to earlier work

Chan and coauthors supply the published $d+2$ Gaussian theorem. White gives the affine-dependence description. Streltsova and Wagner record the aggregate arrangement relation, while Liggett's convolution theorem, also stated and proved by Gurvits, supplies the qualitative sequence background. The proposed contribution is the narrowly scoped Gaussian one-point application with a direct labelled deletion proof and explicit local slack. It is not a claim to invent arrangement identities or ultra-log-concavity convolution.

## Who should care and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Random-polytope researchers | A next-size Gaussian case and a transparent deletion mechanism | The nullity-two argument does not automatically iterate |
| Probabilistic combinatorialists | A conditional exchangeable transfer and exact slack identity | The deletion marginal must itself satisfy the hypothesis |
| Researchers testing conjectures | An exact four-point normalization example | A finite example is not evidence for larger-nullity cases |

## Why the problem matters

The question connects random geometry with the shape of probability sequences. A deletion relation explains how a more complicated configuration inherits structure from a simpler one, while exposing exactly where that inheritance stops.

## How to inspect the result

Read the definitions and main theorem first, then the planar sign-cone proof in Section 2. Section 3 separates the fixed-label and random-side normalizations. Section 4 gives the exact slack and conditional transfer; Section 5 is the complete line example. Check the inherited theorem against the published source version listed in SOURCE_AUDIT.md.

Compiling the supplied LaTeX recreates the presentation, not a machine verification of the proof. No numerical checker run is needed or offered as a substitute for reading the argument.

## Most valuable next projects

The main open step is higher affine-dependence dimension: determine which deletion or face-count identity could control samples with at least $d+4$ points. A separate question is whether Gaussian inputs force strict log-concavity at every interior index. Neither is settled here, and qualitative convolution alone does not resolve them.

## What is in the evidence package

The package contains the self-contained paper and LaTeX source, bibliography, claim and assurance registers, source-audit and provenance records, and a machine-readable research index. The mathematical argument does not depend on private reviews.
