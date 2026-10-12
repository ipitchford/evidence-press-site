## Summary

On 17 September 2023 Wales lowered the default speed limit on restricted roads from 30 mph to 20 mph. A provisional Welsh Government release later reported that casualties on roads recorded as 20 or 30 mph were 28% lower in the first four full quarters afterwards than in the four quarters before.

Evidence Press audited the claim that the policy caused that fall and published the evidence package on 11 August 2026, without a paper. This release is the paper. It sets out the question, the argument, the diagnostics and the limits in one place. It adds no new data analysis and leaves the original package unchanged.

The short answer: the 28% is a correct description of one version of the published figures, but those figures cannot say how much the policy changed casualties on the roads whose limit actually changed. They cannot even say whether it lowered or raised them. That is a statement about the evidence, not a verdict that the policy failed or worked.

## Summary for specialists

Two quantities are kept apart. The **descriptive statistic** is the percentage change in police-recorded casualties on all roads recorded as 20 or 30 mph, 2023 Q4–2024 Q3 against 2022 Q4–2023 Q3. The registered **causal estimand** is

$$\theta = 100\times\frac{Y_{\mathcal A}(1)-Y_{\mathcal A}(0)}{Y_{\mathcal A}(0)},$$

where $\mathcal A$ is the set of segments whose limit changed from 30 to 20 mph on 17 September 2023 and $Y_{\mathcal A}(1)$, $Y_{\mathcal A}(0)$ are their first-year casualty counts with and without the policy.

The provisional figure reconstructs to 2,402 and 1,725 casualties, an exact change of $-33850/1201$ per cent (about $-28.18\%$). Later frozen vintages give about $-26.10\%$ (StatsWales) and $-24.18\%$ (DfT collision rows).

**Proposition.** With observations $(B,P)=(2402,1725)$, three hypothetical worlds share the decomposition $2000+402$ and $1000+725$ but set the unobserved no-policy count $P^0_{\mathcal A}$ to 2,000, 1,000 or 500. They imply $\theta=-50\%$, $0\%$ and $+100\%$. Within the frozen corpus and admitted model class, $\theta$ and its sign are not identified, and no empirical bound is registered.

## Technical account

The published series is defined by the speed limit recorded for each collision across all roads. The estimand is defined by policy-induced change on particular segments. The two differ: the aggregate includes roads already at 20 mph and roads kept at 30 mph as exceptions, and the corpus contains no historical map linking collision locations to treatment.

Even observing the affected/other split would not be enough. In the witness all three worlds share that split; only the counterfactual $P^0_{\mathcal A}$ moves, and it never enters the observation map $\Phi(w)=(B_{\mathcal A}+B_{\mathcal O},\,P^1_{\mathcal A}+P_{\mathcal O})$. The values are counterexamples, not estimates or interval endpoints.

The baseline bin 2022 Q4–2023 Q3 also contains the 14 post-implementation days from 17 to 30 September 2023, so it is not wholly untreated.

## Evidence, assurance and limitations

The manuscript draws every number from the frozen records of the evidence package: 25 registered sources, 17 exact rational calculations, a machine-checked witness and registered assumptions, rivals and missing bridges. The package's checks were rerun by the producer on 12 October 2026 from a clean clone of its `v1.0.0` tag; all passed and the regenerated snapshot matched the published package byte for byte.

Diagnostics do not restore identification. In the DfT route Wales fell about 24.2% against England's 3.8% in the first year, but in the preceding window Wales rose 5.6% while England fell 3.6%. The differential also varies with outcome scope. About 120 collisions on 20/30 mph roads in late 2023 needed manual speed-limit correction, and no traffic data exist by speed-limit class.

Reviews are internal: four read-only rounds by one external model on the package, and one adversarial review of this manuscript by a second vendor's model, with 13 findings fixed and 8 rejected on recorded evidence. The package's round-four review report recommends READY while its review-history field records REVISION_REQUESTED; the manuscript states the discrepancy without resolving it. No independent rerun, specialist review or editorial peer review has been established.

## Relationship to earlier work

This manuscript accompanies the [August evidence package](https://evidencepress.org/releases/wales-20mph-casualty-attribution/) and reports its records; it is not independent confirmation of them. Three earlier working papers already gave Wales–England difference-in-differences evaluations; their estimates rest on comparison-group restrictions this audit neither adopts nor tests. A later independent study by Jiawei Xu (replication materials, Zenodo, September 2026) examines vulnerable road users with English local authorities as comparators. It answers a different question with an added identifying restriction, so the present result neither supports nor contradicts it.

## Who should care, and why

| Audience | Potential use | Required caution |
|:--|:--|:--|
| Welsh and local policymakers | Separate a reported trend from the evidence needed to attribute it | Non-identification is not evidence of zero effect |
| Road-safety statisticians | Prioritise a historical segment map linked to collision locations | More aggregate quarters alone leave the gap |
| Causal-inference researchers | Test comparison designs and restrictions against an explicit witness | The witness is specific to this corpus and estimand |
| Journalists | Report the 28% as a vintage-specific description | Later vintages differ; none is a causal estimate |

## Why the problem matters

Before-and-after figures are often the first numbers a public sees after a policy change. Stating exactly what such a figure can and cannot show keeps a description from being read as a measured effect, in either direction.

## How to inspect or reproduce the recorded checks

Read the manuscript's Appendix A. In a clone of the evidence-package repository at tag `v1.0.0`, run `uv sync`, then `pio validate`, `pio check-citations`, `pio replay`, `python tools/build_wales_20mph_tables.py check`, the test suite in ordinary and optimized modes, and `pio lifecycle`. The rerun logs and the review exchange are in this release's archive.

## The most valuable next projects

Freeze a historical map of which road segments changed, kept 30 mph or later reverted, and link collision locations to it. Specify a comparison design with several pre-period diagnostics and explicit anticipation and interference assumptions. Ask an unaffiliated specialist to reimplement the vintage ladder and witness.

## What is in the evidence package

This release: the 16-page manuscript PDF and source, the figure script, the adversarial review request, response and dispositions, the 12 October rerun logs, a claim record, AI index, provenance, licences and a checksum manifest. The scientific records, frozen sources and derived tables remain in the [August evidence package](https://doi.org/10.5281/zenodo.21894035).
