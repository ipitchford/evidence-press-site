## Summary

This page explains, in order: what problem this release addresses, what it found, how the mathematics works, what has and has not been checked, and how to inspect the package.

**The problem.** Evolutionary family trees can reveal a combined signal of how lineages appear and disappear without uniquely revealing the two historical rates behind that signal. Many different speciation-and-extinction histories can therefore fit the same reconstructed tree. Existing tools respond by constructing or sampling alternative histories that all fit; they explore the set of possibilities, but a finite collection of examples cannot say where its edges are.

**What was done.** This candidate turns that ambiguity into a bounded decision problem. Once a pulled speciation signal and explicit restrictions are fixed, it represents every compatible history by a cumulative-loss measure. In that coordinate, the set of histories has enough order and convex structure to calculate exact extremes rather than merely search for examples.

**What the tools answer.** The resulting tools answer questions such as: What is the largest or smallest compatible speciation rate at a given time? Which interval constraints are mutually inconsistent? Does a proposed history retain positive survival? What is the smallest turnover cap that makes all constraints feasible?

**A warning about simulation.** The paper also proves a warning about simulation. A finite random cloud of plausible trajectories is not a certificate of a sharp endpoint. For a transparent sampler, the probability of getting close to an endpoint can deteriorate factorially as the discretisation dimension grows.

**What the example shows.** The public mammal curve in the package illustrates deterministic sensitivity only. It does not turn the conditional mathematics into a biological estimate.

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

| Result in the manuscript | What it gives |
|---|---|
| Theorem 1 (smooth affine-fibre representation) | A bijection between differentiable histories with pulled rate $\lambda_p$ and functions $A$ with $0\le A(0)<1$, $A'\ge0$, $A<F$ |
| Proposition 2 and Theorem 3 | Survival events as atoms of the measure; the descendant-count law stays zero-inflated geometric, and finite events change $u$ but not the conditional positive-count law |
| Theorem 4 (finite-event congruence at fixed stem age) | Histories sharing $\lambda_p$ have the same complete fixed-stem reconstructed-tree law under stem-survival and fixed-tip-count conditioning |
| Theorem 6 and Corollary 7 | Sharp pointwise bounds for every finite cap $c$, with three regimes $c<1$, $c=1$, $c>1$ |
| Theorem 8 and Corollaries 9–11 | Least and greatest feasible trajectories, violating-pair certificates, the positive-survival test, the minimum compatible cap and extrema of order-monotone targets |
| Theorem 12 (factorial endpoint-sampling law) | The exact chance that a matched uniform sampler gets within a tolerance of the sharp endpoint |

## Technical account

**A coordinate that makes the problem linear.** With $u$ the probability that a lineage leaves a sampled descendant, differentiating $A=F(1-u)$ gives $A'=\mu uF\ge0$, so cumulative loss can only grow. The barrier $A<F$ is the same as $u>0$. At each age
$$
\frac{1}{\lambda(\tau)}=\frac{1}{\lambda_p(\tau)}-\frac{A(\tau)}{\lambda_p(\tau)F(\tau)},
$$
so reciprocal speciation is affine in the measure $\nu$ whose cumulative function is $A$. The set of admissible measures is convex and closed under pointwise meet and join of cumulative functions; it is not a cone, because positive scaling can cross the barrier. Larger cumulative loss means larger $\lambda$, smaller $u$ and smaller $1/\lambda$.

**Events as atoms.** An atom at age zero represents incomplete sampling; an interior atom of mass $m=(1-s_a)q(a-)$ represents independent deterministic survival with probability $s_a$, which multiplies $u$ by $s_a$. Such an atom is not a value of the continuous ratio $\mu/\lambda$. Because an event multiplies $u$ without changing $a=1/F$, the descendant-count generating function keeps its zero-inflated geometric form across every event, and the fixed-stem reconstructed-tree density depends on the history only through $\lambda_p$ and $F$ (Theorem 4). Remark 5 limits this to fixed stem age with stem-survival and observed-tip-count conditioning.

**Turnover caps.** In pulled-scale time $x=F(\tau)$, the turnover ratio $\varepsilon=\mu/\lambda$ is the slope of cumulative loss, and the surviving mass $q(x)=x-n(x)$ has slope $1-\varepsilon$. Imposing $0\le\varepsilon\le c$ and integrating from $x=1$ gives
$$
q(x)\le\rho+x-1,\qquad \inf q(x)=\max\{\rho+(1-c)(x-1),\,0\},
$$
and since $\lambda=\lambda_p x/q$ these become sharp speciation bounds. For $c<1$ the multiplicative width is at most $1/(1-c)$; at $c=1$ both endpoints are finite but the width $(\rho+x-1)/\rho$ has no uniform deep-time bound; for $c>1$ the speciation supremum is infinite at and beyond $x_{\mathrm{crit}}=1+\rho/(c-1)$.

**Finite constraints.** Interval statements $L_i\le n(x_i)\le U_i$ ask for a nondecreasing, $c$-Lipschitz function through given windows. Such a function exists if and only if $L_i\le U_j+c(x_i-x_j)_+$ for every $i,j$, and then the least and greatest solutions are
$$
\underline n(x)=\max_i\{L_i-c(x_i-x)_+\},\qquad \overline n(x)=\min_i\{U_i+c(x-x_i)_+\}.
$$
A violating pair is a complete finite certificate of infeasibility. The two envelopes describe the pointwise projection of the identified set: an arbitrary curve drawn between them need not satisfy the cross-time constraints.

**Why sampling misses endpoints.** For the matched sampler that draws each of $m$ interval turnovers uniformly on $(0,c)$, the chance of landing within $\eta$ of the maximal endpoint is $\frac{1}{m!}\left(\frac{\eta}{c\Delta}\right)^m$, the volume of a simplex in the unit cube. With eight intervals and relative tolerance $\eta/(c\Delta)=0.2$, a 95% hit probability requires 47,182,783,307 independent histories; with 16 intervals it requires about $9.56\times10^{24}$. This concerns the transparent matched sampler only. A direct run of CRABS was not available; actual samplers can concentrate differently, but no finite random sample proves an endpoint unless its proposal mechanism and coverage guarantee do so.

**The mammal illustration.** One extracted pulled-rate trajectory from the public data and code of Upham et al. (2021) is used, with $F$ held fixed. The source tree was sliced at 1 Ma, so the analysis origin contains $M_0=4{,}790$ lineages; this is not present-day mammal diversity. At actual age 58.5 Ma, under $c=0.5$ and no external constraint, $0.04388095\le\lambda\le0.08703484$, a factor of 1.98343. Treating the cross-bin value $D=44$ as a purely illustrative lower bound changes the interval to $0.04825254\le\lambda\le0.08703484$, a factor of 1.80374. Values $D=398$ and $D=577$ are incompatible with $c=0.5$ under the full deterministic and taxonomic mapping; their minimum compatible caps are 0.90704 and 0.93849. These numbers diagnose assumptions. They do not estimate mammalian turnover or validate a genus-to-species bridge.

**What is classical.** The integrating factor, pulled scale and zero-inflated geometric branching laws have reconstructed-process antecedents (Lambert and Stadler 2013; Höhna 2015; MacPherson et al. 2022), and partial identification, Lipschitz extension and infinite-dimensional linear programming are established literatures. The paper's narrower priority statement is that it found no prior work coupling this cumulative-loss measure fibre to the complete package of cap-regime bounds, finite certificates, barrier test, minimum-cap diagnostic and exact endpoint-sampling law; the search was targeted, not systematic.

## Evidence, assurance and limitations

- **Proofs.** Every theorem and corollary has a written proof in the manuscript. "Sharp" always means sharp over the stated conditional model class. No proof-assistant formalization is supplied.
- **Computational checks.** 17 deterministic unit tests; an independently written loop-based envelope implementation with 720 linear-programme endpoint checks across 180 random feasible cases; a direct 160,000-replicate birth-death simulation with two deterministic bottlenecks, checked against analytic survival and the conditional descendant-count law; and five deliberately broken or infeasible negative controls, all detected.
- **Replay.** The complete check suite passes under normal and optimized Python in disposable scratch copies, and in a clean container pinned to a Python 3.13.5 base-image digest. That recreation was performed by the release-preparing agent, so independent external reproduction remains unassessed. The separately written numerical checker was produced inside the same research workflow and is not an external reproduction.
- **What the checks mean.** They establish internal replay and independent numerical consistency. They do not constitute external mathematical review, biological validation or formal proof checking.

### What the result does not establish

- It does not prove crown-conditioned or random-origin event congruence.
- Likelihood-equivalent histories are not asserted to have equal posteriors.
- There is no simultaneous confidence coverage for the pulled signal.
- The fossil restrictions lack a preservation, observation, and genus-to-species bridge.
- No performance comparison against the actual CRABS implementation was run.
- The recognition search was targeted, not exhaustive; novelty and priority remain open.

The contribution is exact conditional projection and certification, not a replacement for birth-death likelihoods, identifiable restricted models or fossilised birth-death inference. An incompatibility found with deterministic diversity constraints falsifies the cap and the bridge assumptions jointly, not the cap alone.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Macroevolution and phylogenetics researchers | Replace finite congruence-class clouds with exact conditional bounds and infeasibility witnesses. | The mathematics is conditional on a fixed pulled signal and the stated model class. |
| Partial-identification researchers | Study a concrete infinite-dimensional linear programme with explicit lattice envelopes and certificates. | Priority across adjacent mathematical literatures is not certified. |
| Scientific-software developers | Implement deterministic feasibility and sharp-bound checks alongside exploratory samplers. | The package is a reference candidate, not a validated production library. |
| AI research agents | Reuse exact statements, exclusions, replay commands, hashes, and open gates from machine-readable records. | A green verifier is not external theorem verification or peer review. |
| Reviewers and methodologists | Audit the fixed-stem event theorem, the semantic bridge, and the scope of empirical claims. | Internal AI-assisted critique is producer-workflow evidence, not independent assessment. |

## Why the problem matters

Louca and Pennell (2020) showed that extant timetrees are consistent with a myriad of diversification histories, so any statement about past speciation or extinction from such trees rests on extra restrictions. The paper's point is that, under explicit restrictions, a congruence class is a functional identified set, not a collection of curves returned by one sampler. Treating it that way lets an analyst report feasible trajectories, exact target endpoints, endpoint-attaining histories and short incompatibility certificates, and it makes visible the boundary at $c=1$ where allowing continuous decline destroys finite upper identification. Empirical use must keep three layers separate: fixed-signal geometry, statistical uncertainty and biological observation models.

## How to inspect or reproduce the recorded checks

From the root of the GitHub release archive or the Zenodo record:

```sh
make verify
make verify-package
docker build -f Containerfile -t affine-diversification-fibres:0.2.1 .
docker run --rm affine-diversification-fibres:0.2.1
```

`make verify` regenerates and checks results in a disposable scratch copy under normal and optimized Python. `make verify-package` checks the immutable package hashes and shipped evidence. `REPLAY_RECEIPT.json` records the producer-side replay. A successful replay establishes internal computational consistency only; it is not external theorem verification or peer review. To read the mathematics, start with Theorem 1 (the coordinate), then Theorems 6 and 8 (the bounds and certificates); `CLAIM_EVIDENCE.json` maps claims to evidence.

## The most valuable next projects

1. Reconstruct and audit the finite-event theorem independently, with special attention to the direction of time, event jumps, stem survival, fixed tip count, and normalization.
2. Build a simultaneous confidence set for the pulled signal and propagate it through the sharp projection formulas.
3. Add a defensible fossil observation model before interpreting the mammal sensitivity restrictions as evidence about historical rates.
4. Compare the exact extrema with CRABS or a similar system using an identical input signal, turnover cap, restriction set, and numerical tolerance.
5. Derive crown-conditioned and random-origin versions and test whether the event-congruence result survives.
6. Search more broadly for antecedents in infinite-dimensional linear programming, extension theory, stochastic processes, macroevolutionary software, theses, and non-English sources.

The paper also lists target-specific optimisation for peak timing and integrated extinction, and formalisation of Theorems 1, 6 and 8 in a proof assistant.

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
