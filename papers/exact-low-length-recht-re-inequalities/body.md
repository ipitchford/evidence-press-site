## Summary

This release connects a pure matrix-inequality classification to a broader lesson for stochastic optimisation: a statement that one sampler is “better” is incomplete until it identifies the metric, randomness protocol, instance class, stepsize and time horizon.

The first manuscript settles the Recht–Ré inequality through five factors and proves exact six-factor divisibility families. The second develops the five-factor counterexample into a metric-aware theory of repeated random-reshuffling dynamics. On the certified rational family, the norm of the expected iterate and expected quadratic risk can rank the same sampling schemes in opposite orders.

This is an additive successor. The immutable v1.0.0-candidate paper and DOI remain available; v1.1.1 adds a second manuscript, repaired and extended verifier coverage, exact phase diagrams and a stronger claim-to-evidence map.

## Summary for specialists

The original Evidence Press summary displayed the wrong denominator for its ordered distinct-product average. For positive semidefinite matrices $A_1,\ldots,A_n$, the normalized without-replacement expression is

$$
{{orderedDistinctAverageFormula}}
$$

The sum runs over ordered distinct tuples, so it contains
$(n)_m=n(n-1)\cdots(n-m+1)=m!\binom{n}{m}$ terms. The previous display used $\binom{n}{m}$, the number of unordered subsets, and was too large by a factor of $m!$. The manuscripts and computational certificates used the correct falling-factorial normalization; this is a correction to the former web summary, not to the theorem or archived predecessor PDF.

## Two manuscripts, one research programme

| Manuscript | Question | Scope of the answer |
|---|---|---|
| *Exact Low-Length Recht–Ré Inequalities* | When does the proposed noncommutative arithmetic–geometric mean comparison hold? | Complete candidate status through five factors; balanced six-factor families. |
| *Which Sampling Scheme Is Better? Metric-Dependent Rankings in Random Reshuffling Dynamics* | Which operator functional and sampling protocol actually determine “better” in the De Sa family? | Exact mean, Gram, replica and single-shuffle comparisons with explicit quantifiers. |

The first paper supplies the exact endpoint witness. The second owns the multi-epoch, stepsize, replica, single-shuffle, perturbation and simplex-family extensions. The sidebar provides separate links to both current PDFs.

## Exact low-length classification

- **Four factors:** the two-sided inequality holds for every $n\geq4$.
- **Five factors:** the upper bound holds for every $n\geq5$. The lower bound fails at $n=5$ and is restored for every $n\geq6$, making the threshold sharp.
- **Six factors:** the upper bound holds when $7\mid n$, the lower bound when $8\mid n$, and the complete two-sided inequality when $56\mid n$. The remaining cases are open.

The proof route combines noncommutative sum-of-squares identities, permutation symmetry, exact rational positivity, a balanced-seed continuation theorem and full-matrix FLINT characteristic-polynomial certificates.

## Why “better” needs a metric

For a random block product $Z$, the mean propagator and Gram channel are different objects:

$$
R_s=\mathbb E_s Z,
\qquad
\Phi_s(H)=\mathbb E_s[Z^T HZ].
$$

The first controls the mean iterate. The second transports a quadratic risk. With fresh independent blocks,

$$
\mathbb E x_K=R_s^Kx_0,
\qquad
\mathbb E(x_K^THx_K)=x_0^T\Phi_s^K(H)x_0.
$$

Single shuffle is different again: one random permutation is drawn and its product is reused, producing the group twirl of a deterministic matrix power rather than an iterate of the fresh Gram channel. Averaging independent replicas introduces a bias–variance interpolation. Function-class convergence rates answer another question with different quantifiers.

These distinctions resolve the apparent paradox in the endpoint witness: reshuffling has the larger norm of the expected iterate, yet the smaller expected squared error and average quadratic objective.

## Exact dynamics results

The second manuscript proves the following on its declared regular-simplex and endpoint families.

- Fresh random reshuffling has a strictly smaller invariant Gram channel than with-replacement sampling for every positive epoch count on the certified five-factor family.
- At the rational endpoint, averaging independent trajectories has an exact crossover at $r_*=145/7$ on the all-ones direction.
- At stepsize $\eta=1$, single shuffle and fresh reshuffling agree at one epoch, while single shuffle is strictly Loewner-below fresh reshuffling for every $K\geq2$.
- The all-horizon single-shuffle ranking persists on one uniform open neighbourhood of $\eta=1$; the theorem asserts existence with exact margins, not a claimed maximal radius.
- At horizons $K=2$ and $K=3$, the single-shuffle versus fresh-reshuffling Gram ranking has exact isolated interior stepsize transitions near $0.815893501141$ and $0.788002536290$.
- Symmetric factor perturbations of operator norm at most $1/8192$ preserve the strong one-epoch reversal at the endpoint, subject to the stated update-factor admissibility condition.
- Exact rational reversal families hold for full reshuffling at $(n,k)=(5,5)$ for $\rho\in[19/20,1]$ and $(6,6)$ for $\rho\in[9/10,1]$, and for the six-step without-replacement prefix $(7,6)$ for $\rho\in[39/40,1]$. The last protocol is not a full epoch.

The arbitrary-objective problem remains open. The package does not claim that the full Choi/Gram difference is positive semidefinite or even block positive, and it does not promote an unsupported superoperator factorization.

## What the evidence package checks

The DOI-bound package contains both manuscripts and five exact evidence modules. Its release certificate binds both PDFs, the annotated Git tag, the complete Git tree, the deterministic archive and the clean replay receipt.

The acceptance chain includes exact stdlib and SymPy paths, a separately implemented internal semantic reconstruction, full coefficient comparisons for the six-factor characteristic polynomials, direct endpoint checks, spectral and resolvent reconstruction, bridge checks through $K_0=990$, strict tail inequalities, simplex recurrences, Bernstein positivity, ordinary and optimized Python runs, and targeted mutation controls. The final archive replayed in a fresh producer environment.

That is strong evidence of artifact identity and internal consistency. It is not an unaffiliated rerun, a clean-room reimplementation, formal proof-assistant verification, specialist acceptance or editorial peer review.

## Research significance and limits

The agenda-setting claim is methodological rather than universal: sampling theory should compare explicitly named operator functionals instead of treating expected iterate, expected error, objective value, replica risk and function-class rate as interchangeable.

The exact examples are family-specific and metric-specific. They do not contradict convergence-rate advantages for random reshuffling under broader smooth-convex assumptions, and they do not establish a universal advantage for fresh reshuffling or single shuffle. A bounded primary-source and formula-level search found no collision for the package's exact classifications and fingerprints, but search absence does not establish novelty or priority.

## Who should care, and why

| Reader | Start here | Principal caution |
|---|---|---|
| Optimisation researcher | “Why better needs a metric” and the dynamics results | Rankings are family-, metric-, protocol-, stepsize- and horizon-specific. |
| Matrix-inequality researcher | The low-length classification and first manuscript | The remaining six-factor cases are open. |
| Computational reviewer | The evidence package and replay commands | Producer replay is not an independent reconstruction. |
| General reader | Summary and the two-manuscript table | The result does not rank optimisation algorithms universally. |

## How to inspect and reproduce the recorded checks

Use the [versioned GitHub release](https://github.com/ipitchford/exact-low-length-recht-re-inequalities/releases/tag/v1.1.1-candidate) or the [DOI archive](https://doi.org/10.5281/zenodo.22037371), not an unpinned working tree. The repository's release certificate and manifest identify both manuscripts, exact modules and replay receipt. A successful replay establishes agreement with the supplied implementation and frozen inputs; it does not by itself validate the theorem-to-code correspondence.

## The most valuable next projects

The highest-value work is an unaffiliated reconstruction of the theorem-to-encoding bridge, followed by a clean-room implementation. Mathematically, the main open directions are the arbitrary-objective block-positivity problem, the remaining six-factor Recht–Ré cases and the possible all-length extension of the regular-simplex Gram comparison.

## What is in the public package

The public package contains both current PDFs, source, exact rational and FLINT certificates, independent internal verifier paths, mutation controls, ordinary and optimised replay receipts, manifests, a release certificate, communication media and the immutable predecessor links. The generated evidence and citation panels below provide the canonical URLs and current assurance status.
