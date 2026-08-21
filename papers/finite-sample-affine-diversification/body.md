## Plain-English summary

One reconstructed family tree can be compatible with many different histories
of speciation and extinction. The earlier affine-diversification release showed
how to describe and bound those histories when the pulled diversification
signal is treated as fixed.

This successor adds the missing finite-sample step. Under one exact fixed-stem,
stem-survival, homogeneous time-varying model, it builds a confidence set for
the pulled scale $F$ from the observed number of tips and unordered node ages.
It then propagates every signal in that set through the affine fibre and reports
one of three conclusions for a registered target:

1. **certified incompatible** for every signal in the confidence set;
2. **compatible throughout the band**; or
3. **unresolved** because the decision changes across the band.

The paper also preserves a bounded comparison with CRABS. Finite CRABS clouds
missed sharp endpoints in every returned primary case, but exact certification
changed only 13.854% of the registered decision statuses. That is below the
preregistered 20% H4 gate, so the broad-utility claim failed.

> **Status:** anonymous, unrefereed theorem-and-method candidate published with
> notes. Producer-side replay passes locally and on public Linux CI. No
> unaffiliated reproduction, external specialist review, proof-assistant
> formalisation, editorial peer review, empirical validation, or broad CRABS
> utility is claimed.

## The statistical object

Let $T$ be the fixed stem age. Write the pulled scale as

$$
F(\tau)=\exp\!\left\{\int_0^\tau \lambda_p(s)\,\mathrm ds\right\},
\qquad F(0)=1.
$$

Conditional on the stem lineage leaving sampled descendants, the tip count
$N$ has a geometric law with parameter

$$
p=\frac{1}{F(T)}.
$$

Conditional on $N$, the $N-1$ unordered internal node ages have a known
distribution whose cumulative probability is a monotone transformation of
$F$. These two facts separate the finite-sample problem into two exact pieces:

- invert the geometric count tails to obtain an interval for $F(T)$; and
- use a Dvoretzky--Kiefer--Wolfowitz--Massart band for the transformed node-age
  distribution.

The candidate combines the two pieces by Bonferroni propagation. Under the
declared fixed-stem law, the resulting set contains the full pulled-scale
trajectory with at least the stated nominal probability.

This guarantee is conditional and model-specific. It is not a confidence set
for an estimated topology, uncertain node dates, a smoothed derivative, a
lineage-dependent process, or a misspecified biological model.

## From a signal band to an identified set

For a fixed signal $F$, the compatible homogeneous histories are represented
by a nondecreasing cumulative-loss coordinate $A$ below the survival barrier:

$$
0\le A(0)<1,
\qquad A'\ge0,
\qquad A<F.
$$

The corresponding rates are

$$
\rho=1-A(0),
\qquad
\lambda=\frac{\lambda_pF}{F-A},
\qquad
\mu=\frac{A'}{F-A}.
$$

This coordinate turns many restrictions and targets into affine or monotone
questions in $A$. For each admissible signal in the confidence set, the code
computes the conditional affine fibre and the sharp target range. The union of
those fibres contains the true conditional identified set whenever the signal
set contains the true $F$.

The decision rule deliberately avoids a plug-in yes/no answer:

| Status | Meaning |
|---|---|
| Certified incompatible | The registered restriction fails for every signal and history in the confidence-containing set. |
| Compatible throughout | At least one compatible history exists for every signal in the band. |
| Unresolved | Some signals permit the restriction and others do not. More information or a stronger justified restriction is needed. |

The third state is substantive. It prevents an answer based on one estimated
curve from being reported as robust when nearby signals reverse it.

## Frozen synthetic decision

The worked example is synthetic; it is not a fit to an empirical clade. The
observed tree has 22 tips. At the 95% joint nominal level, the count component
alone gives

$$
F(T)\in[5.31,1749.48].
$$

After the node-age band and affine constraints are propagated:

- a registered turnover cap of 0.70 is **certified incompatible** under the
  stated normalized deterministic-diversity constraint; and
- a separate interior target that is compatible on the plug-in signal becomes
  **unresolved** over the full confidence set.

The second result is the main practical warning. Plug-in compatibility can be
an artefact of ignoring uncertainty in the signal that defines the fibre.

## Sanity-check coverage

The frozen 20,000-replicate simulation reports:

| Component | Observed coverage |
|---|---:|
| Exact count interval | 98.685% |
| Conditional node-age band | 98.035% |
| Joint components | 96.755% |
| Stated nominal joint lower bound | 95.000% |

This simulation checks the implementation in one declared setting. It does
not create the coverage theorem; the analytic count inversion, DKW--Massart
bound and Bonferroni argument do that work.

## What the CRABS benchmark found

The separate comparison was prospectively frozen before its high-cost Stage 2
cells were evaluated. It contained 1,100 registered cells and preserved every
result or structural-censor status in a sealed ledger.

The revised H2 accounting separates returned clouds from structural censors:

- all 240 returned primary rejection clouds missed at least one sharp endpoint
  beyond the frozen tolerance; and
- 60 additional primary cells were structurally censored and are not described
  as returned-cloud endpoint misses.

That supports a narrow conclusion: a finite random cloud is not an extremum
certificate in the registered benchmark.

The preregistered H4 gate asked a different question: how often does exact
certification change a decision status? Across 3,840 clustered queries, 532
statuses changed:

$$
\frac{532}{3840}=0.138541\ldots=13.854\%.
$$

The threshold was 20%, so **H4 failed**. Of the changes, 502 withdrew a prior
call to unresolved and 30 moved a below-threshold call to above-threshold. The
package reports the full transition and stratum tables rather than treating
the clustered queries as independent replicates.

Accordingly, this release does not claim that the affine method is a must-have
or essential complement to CRABS, a replacement for CRABS, or broadly superior.
It supports the narrower conclusion that finite random clouds are not extremum
certificates in this registered benchmark, while the measured decision impact
fell short of its preregistered target.

These two findings are compatible. CRABS clouds can miss mathematical
endpoints, while exact endpoint recovery changes fewer registered decisions
than the broad-utility hypothesis predicted.

## Why the failed gate matters

The release began with an ambition to become an essential complement to
CRABS. The evidence does not support that language. The failed H4 gate is
therefore a load-bearing negative result, not a footnote.

The candidate may support more targeted future work:

- identifying regimes where a cloud is especially likely to miss a
  decision-relevant boundary;
- replacing broad pooled utility claims with registered transition-specific
  targets; and
- using exact certification when the cost of a false compatibility or
  incompatibility call is high.

It does not establish general superiority, replacement value, broad community
acceptance, or that every CRABS analysis needs an affine certificate.

## Evidence and replay boundary

The release package contains:

- a 23-page PDF and accessible Markdown companion;
- exact count inversion, DKW propagation and affine decision code;
- 21 deterministic tests under ordinary and optimized Python;
- 720 endpoint comparisons across 180 feasible cases using a separately
  structured linear-programming oracle;
- a 160,000-replicate branching-process simulation;
- five semantic negative controls, all detected;
- the frozen 20,000-replicate signal-band sanity check;
- the complete 1,100-cell CRABS comparison and a 1,900-entry sealed result
  manifest;
- exact H2/H4 summaries and transition tables;
- source, citation, licence, provenance, status and assurance records;
- a 5,033-entry successor release manifest; and
- public GitHub Actions replay, including a pinned Linux-container job.

The quick successor gate is:

```bash
PYTHONPATH=. python3 verification/verify_route_a_candidate.py
```

It verifies the protected historical receipts, the sealed Stage 2 ledger, the
successor manifest, schemas, DOI identity, fixed results, figure alt text, PDF,
component licensing, publication boundary, and ordinary and optimized tests.

These are producer-side checks. A passing manifest establishes byte identity;
a passing program establishes the encoded checks. Neither establishes that
the probability model, scientific interpretation, or source-to-code bridge is
correct.

## What is not established

- No unaffiliated stochastic-process or phylogenetics specialist has reviewed
  the fixed-stem conditioning, count law, node-age factorization or coverage
  proof.
- No unaffiliated group has rerun the immutable package or written an
  independent implementation.
- No proof assistant has checked the theorem chain.
- The confidence set does not cover topology estimation, node dating,
  smoothing, model selection, derivative recovery or misspecification.
- The one-dimensional fibre excludes lineage-, state-, trait-, clade- and
  diversity-dependent processes.
- Fossil preservation, observation and taxonomic-scale uncertainty are not
  modeled.
- The worked finite-sample decision is synthetic and is not empirical
  validation.
- The recognition search is structured but not exhaustive; novelty and
  priority remain partial or unassessed.
- Independent rights review is absent beyond the component-level licence map.
- The failed H4 gate does not support broad CRABS utility.

## Relationship to the predecessor

The [0.2.1 affine-diversification release](https://evidencepress.org/releases/affine-diversification-fibres/)
established the conditional affine cumulative-loss representation, sharp
fixed-signal target bounds, finite infeasibility certificates and an exact
endpoint-sampling diagnostic.

This successor adds:

1. an exact finite-sample fixed-stem confidence set for the pulled scale;
2. propagation of signal uncertainty through the affine fibre;
3. three-valued robust decisions;
4. the complete frozen affine--CRABS comparison; and
5. a corrected interpretation that preserves the failed H4 gate.

The old release and DOI remain immutable. Reuse of its framework is not
independent confirmation, and the successor does not retroactively add
finite-sample coverage to the earlier archived object.

## Who should read what

| Reader | Start here | Principal caution |
|---|---|---|
| Reconstructed-process theorists | Fixed-stem count and node-age theorems | Conditioning and topology marginalisation still need external specialist review. |
| Partial-identification researchers | Affine fibre and confidence-containing union | Sharpness is conditional on the declared signal and model class. |
| Phylogenetic-method developers | H2/H4 benchmark and transition tables | The registered grid is bounded, clustered and not a field-wide performance estimate. |
| Empirical macroevolution researchers | Synthetic decision and limitations | No topology, dating, fossil-observation or misspecification coverage is supplied. |
| Reproducers | `README.md`, `ENVIRONMENT.txt`, `REPLAY_RECEIPT.md` and verifier | Public CI is producer-controlled, not independent reproduction. |
| AI research agents | `AI_INDEX.json`, `STATUS.json`, `ASSURANCE.json` and `CLAIM_EVIDENCE.json` | Preserve the failed H4 gate and every conditional-model exclusion. |

## The most valuable next projects

1. Commission a focused external process-theory review of the fixed-stem law
   and simultaneous-coverage argument.
2. Build an independently authored implementation in another language or
   statistical stack and compare normalized outputs from the immutable tag.
3. Extend the observation boundary to topology, dating, smoothing and
   misspecification without differentiating an unsupported confidence band.
4. Add a fossil preservation and observation model before making empirical
   claims involving fossil restrictions.
5. Design a new preregistered comparison around specific decision transitions
   or high-cost regimes instead of reviving the failed broad H4 claim.
6. Develop crown-conditioned, random-origin and heterogeneous-process
   counterparts as separate, newly reviewed research objects.

## What is in the public package

- The exact tagged source archive and DOI-bearing 23-page PDF.
- `RELEASE_MANIFEST.sha256` with 5,033 sealed release paths.
- `SHA256SUMS` for the public GitHub and Zenodo assets.
- Machine-readable status, assurance, claims, sources, provenance, licences,
  environment and AI index.
- The complete frozen CRABS ledger, receipts and derived H2/H4 tables.
- The Stage 3-prime review and Stage 4.5 integrity report.

The scholarly creator is **Anonymous**. Ian Pitchford is the repository
maintainer and publisher, not the scholarly author. Original prose, figures,
structured records and project-created data are dedicated under CC0 1.0;
original code is MIT-licensed; third-party exceptions retain the terms in the
component licence map.

The immutable candidate is available from the
[GitHub prerelease](https://github.com/ipitchford/affine-diversification-fibres/releases/tag/v0.3.0-candidate-r2).
The archival version is [Zenodo record 22041054](https://zenodo.org/records/22041054),
DOI [10.5281/zenodo.22041054](https://doi.org/10.5281/zenodo.22041054).
