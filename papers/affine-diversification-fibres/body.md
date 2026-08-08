## Summary

Evolutionary family trees can reveal a combined signal of how lineages appear and disappear without uniquely revealing the two historical rates behind that signal. Many different speciation-and-extinction histories can therefore fit the same reconstructed tree.

This candidate turns that ambiguity into a bounded decision problem. Once a pulled speciation signal and explicit restrictions are fixed, it represents every compatible history by a cumulative-loss measure. In that coordinate, the set of histories has enough order and convex structure to calculate exact extremes rather than merely search for examples.

The resulting tools answer questions such as: What is the largest or smallest compatible speciation rate at a given time? Which interval constraints are mutually inconsistent? Does a proposed history retain positive survival? What is the smallest turnover cap that makes all constraints feasible?

The paper also proves a warning about simulation. A finite random cloud of plausible trajectories is not a certificate of a sharp endpoint. For a transparent sampler, the probability of getting close to an endpoint can deteriorate factorially as the discretisation dimension grows.

The public mammal curve in the package illustrates deterministic sensitivity only. It does not turn the conditional mathematics into a biological estimate.

> **Status:** anonymous, unrefereed candidate. Producer-side replay and scoped computational checks pass. External specialist theorem review, independent reproduction, formal verification, systematic novelty review, and peer review have not occurred.

## Summary for specialists

Fix a continuous, strictly positive pulled speciation rate $\lambda_p$ and define

$$
F(\tau)=\exp\left\{\int_0^\tau \lambda_p(s)\,ds\right\}.
$$

For a compatible homogeneous time-varying birth-death history, the candidate uses

$$
A(\tau)=F(\tau)\,[1-u(\tau)],
$$

where $u$ is sampled-descendant survival. Admissible smooth histories correspond to nondecreasing $A$ satisfying $0\leq A(0)<1$ and $A<F$. The inverse relations are

$$
u=\frac{F-A}{F},\qquad
\lambda=\frac{\lambda_p F}{F-A},\qquad
\mu=\frac{A'}{F-A}.
$$

Thus $1/\lambda$ is affine in the cumulative measure and $d\nu_{ac}/dF=\mu/\lambda$. A Stieltjes completion represents incomplete sampling and finitely many independent deterministic survival events as atoms. Under the paper's fixed-stem survival and fixed-tip-count conventions, the candidate derives the zero-inflated geometric descendant-count law and the complete reconstructed-tree density.

For $0\leq\mu/\lambda\leq c$ with any finite $c\geq0$, the feasible derivative band gives sharp pointwise projections. The geometry changes at $c=1$: the usual restriction $c\leq1$ excludes continuous negative net diversification, while for $c>1$ the speciation supremum becomes infinite beyond a calculable pulled scale.

Finite interval constraints reduce to difference constraints on cumulative loss. Explicit least and greatest trajectories provide endpoint attainment where stated, pairwise incompatibility witnesses, a positive-survival test, and the minimum compatible cap.

## What the result does not establish

- It does not prove crown-conditioned or random-origin event congruence.
- Likelihood-equivalent histories are not asserted to have equal posteriors.
- There is no simultaneous confidence coverage for the pulled signal.
- The fossil restrictions lack a preservation, observation, and genus-to-species bridge.
- No performance comparison against the actual CRABS implementation was run.
- The recognition search was targeted, not exhaustive; novelty and priority remain open.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Macroevolution and phylogenetics researchers | Replace finite congruence-class clouds with exact conditional bounds and infeasibility witnesses. | The mathematics is conditional on a fixed pulled signal and the stated model class. |
| Partial-identification researchers | Study a concrete infinite-dimensional linear programme with explicit lattice envelopes and certificates. | Priority across adjacent mathematical literatures is not certified. |
| Scientific-software developers | Implement deterministic feasibility and sharp-bound checks alongside exploratory samplers. | The package is a reference candidate, not a validated production library. |
| AI research agents | Reuse exact statements, exclusions, replay commands, hashes, and open gates from machine-readable records. | A green verifier is not external theorem verification or peer review. |
| Reviewers and methodologists | Audit the fixed-stem event theorem, the semantic bridge, and the scope of empirical claims. | Internal AI-assisted critique is producer-workflow evidence, not independent assessment. |

## The most valuable next projects

1. Reconstruct and audit the finite-event theorem independently, with special attention to the direction of time, event jumps, stem survival, fixed tip count, and normalization.
2. Build a simultaneous confidence set for the pulled signal and propagate it through the sharp projection formulas.
3. Add a defensible fossil observation model before interpreting the mammal sensitivity restrictions as evidence about historical rates.
4. Compare the exact extrema with CRABS or a similar system using an identical input signal, turnover cap, restriction set, and numerical tolerance.
5. Derive crown-conditioned and random-origin versions and test whether the event-congruence result survives.
6. Search more broadly for antecedents in infinite-dimensional linear programming, extension theory, stochastic processes, macroevolutionary software, theses, and non-English sources.

## What is in the evidence package

- A 16-page manuscript in PDF, LaTeX, and citation-resolved Markdown.
- A reference implementation and 17 deterministic tests.
- Independent numerical envelope checks covering 720 linear-program endpoints across 180 random cases.
- A 160,000-replicate branching-process simulation and five deliberate negative controls.
- Seven machine-readable figures and their source data.
- Normal and optimized scratch replay plus a clean container pinned to an exact Python base-image digest.
- A SHA-256 manifest, replay receipt, claim-evidence map, assurance matrix, provenance record, source inventory, licence map, and final integrity report.
- A citation audit covering 18 bibliography records and an exact-value audit of the packaged upstream mammal data extraction.

All original release content is dedicated to the public domain under CC0-1.0. Source-derived mammal data retain their upstream terms, and the supplied review is marked `NOASSERTION`; consult the package licence map before redistributing those components.

The release archive, manuscript, manifest, and replay receipt are available from [GitHub](https://github.com/ipitchford/affine-diversification-fibres/releases/tag/v0.2.1-candidate). The immutable archived version is [Zenodo record 21851319](https://zenodo.org/records/21851319), DOI [10.5281/zenodo.21851319](https://doi.org/10.5281/zenodo.21851319).
