## Plain-English summary

Wales changed the default speed limit on restricted roads from 30 mph to 20
mph on 17 September 2023. A provisional Welsh Government release later
reported that casualties on roads recorded as 20 or 30 mph were 28% lower in
the first four complete quarters after implementation than in the preceding
four-quarter window.

That decline is reproducible as a description of one published data vintage.
The provisional totals are 2,402 casualties before and 1,725 after, an exact
change of about -28.18%. But the comparison does not identify the policy's
causal effect on the roads whose speed limit actually changed.

The reason is simple but consequential. The published 20/30 mph series is a
changing mixture of affected roads, pre-existing 20 mph roads, retained 30 mph
exceptions and later reversions. The frozen evidence does not supply a
versioned historical map showing which road segments were treated, and it does
not reveal what casualties would have occurred on those affected roads without
the policy.

This candidate makes the limit exact. It constructs three hypothetical worlds
with the same observed aggregate totals but affected-road causal effects of
-50%, 0% and +100%. None of those worlds is asserted to be true. Together they
show that, within the registered aggregate evidence and admitted rival class,
neither the point value nor even the sign of the effect is identified.

The result therefore does not say that the policy worked, failed or had no
effect. It says that the positive 28% attribution remains unsupported by this
evidence and that a defensible causal estimate requires different measurement
or independently justified restrictions.

## The central claim or finding

The registered target is the percentage causal effect of the default-speed-
limit change on the total number of police-recorded casualties on Welsh road
segments whose restricted-road limit actually changed from 30 mph to 20 mph,
for 2023 Q4 through 2024 Q3, relative to the same segments' no-policy casualty
count over that period.

The candidate finding is narrower than a policy-effect estimate:

> For the frozen aggregate official corpus and declared rival set, the
> affected-road causal estimand is not point-identified, its sign is not
> identified, and no finite identified interval is claimed.

This is a corpus-specific constructive non-identification result. It is not a
claim that no future design could identify the effect. A historical treatment
map, linked collision locations, a defensible counterfactual design or
externally justified bounds could change the evidence state.

The descriptive and causal quantities must remain separate:

| Quantity | Population | Contrast | What it can support |
|---|---|---|---|
| Provisional 28% figure | All casualties on roads recorded as 20 or 30 mph | Four complete post-policy quarters versus the preceding four-quarter bin | A vintage-specific before/after description |
| Registered estimand | Casualties on road segments whose limit actually changed | Policy outcome versus the same segments' no-policy outcome | A causal effect, if treatment membership and the counterfactual are identified |

The baseline bin for the descriptive comparison is also not wholly untreated:
2023 Q3 contains the 14 calendar days from implementation on 17 September to
quarter end.

## How the result works

The audit first preserves the source-vintage ladder instead of selecting the
number most favourable to one interpretation:

| Frozen route | Baseline | Post | Approximate change | Evidential role |
|---|---:|---:|---:|---|
| Provisional Welsh Government graphic | 2,402 | 1,725 | -28.18% | Reproduces the reported first-year headline |
| Current StatsWales extract | 2,402 | 1,775 | -26.10% | Shows revision across official vintages |
| Current DfT collision-row route | 2,395 | 1,816 | -24.18% | Unreconciled diagnostic, not independent replication |

Those figures describe aggregate changes. They do not reveal affected-road
membership or the missing no-policy outcome.

The constructive witness then fixes one hypothetical observed decomposition in
all three worlds. The aggregate baseline is 2,000 casualties on affected roads
plus 402 elsewhere, giving 2,402. The observed policy-period aggregate is 1,000
on affected roads plus 725 elsewhere, giving 1,725. Only the unobserved
affected-road no-policy outcome changes:

| Hypothetical world | Observed affected-road policy outcome | Unobserved no-policy outcome | Implied causal effect |
|---|---:|---:|---:|
| Negative-effect world | 1,000 | 2,000 | -50% |
| Zero-effect world | 1,000 | 1,000 | 0% |
| Positive-effect world | 1,000 | 500 | +100% |

Every world is compatible with the same hypothetical observed aggregate
decomposition. The observation map is therefore non-injective: different
causal signs map to identical observables. The three values are counterexamples,
not estimates, confidence limits or endpoints of an identified interval.

An England comparison is retained only as adversarial pressure. In the current
DfT route, the Wales-versus-England descriptive differential changes sign
between the immediately preceding diagnostic window and the first-year window.
That does not rule out every conditional donor design, but it gives no basis for
assuming national parallel trends without additional work.

## What is classical, and what is offered here

The general principles are established: a before/after comparison is not a
causal effect; counterfactual outcomes are not observed; treatment
misclassification can break an observation map; and observationally equivalent
worlds can establish non-identification. This candidate does not present those
ideas as a new theorem.

Earlier working papers already offered Wales/England causal evaluations of the
default 20 mph policy, and both the posted-speed reclassification problem and
the value of combining 20 and 30 mph categories had already been discussed.
Their existence establishes prior art, not the correctness of their estimates
or assumptions.

Within the bounded search completed on 11 August 2026, the residual
contribution is a case-specific bridge:

1. exact reconstruction of the provisional first-year graphic and
   reconciliation with later frozen source vintages;
2. separation of the combined posted-speed proxy from the affected-road causal
   estimand; and
3. an explicit point-and-sign non-identification witness tied to the registered
   Wales claim, corpus and rival set.

The novelty assessment is `PARTLY_NOVEL`, not an exhaustive priority claim.
No exact Wales application of the registered witness was found within the
recorded searches, but subscription indexes, Welsh-language-only material,
some grey literature and a complete citation network were outside the boundary.

## Evidence and audit trail

The research repository registers 25 sources and three frozen search records.
It binds all 25 sources through 125 source references, checks 29 narrow frozen-
text anchors and replays 17 exact calculations. The non-circular scientific
review target contains 45 entries and has SHA-256
`8f4434763bd9c2970b140ac222dfec388a3f29b93a3f6eb5894b4130023cf135`.

The source set includes Welsh Government statistical releases, StatsWales
extracts, Department for Transport collision data, legislation and Office for
Statistics Regulation guidance. Source records retain version, retrieval,
coverage, transformation, licence, redistribution and limitation fields. The
case also preserves official-data measurement cautions, including unreported
incidents, speed-limit coding corrections, historical inconsistencies,
reporting-system changes and the absence of traffic exposure by speed-limit
class.

Successive read-only external-model adversarial reviews and their exact
transport receipts are retained rather than collapsed into one badge. They are
model-assisted continuity review inside a producer-coordinated workflow. They
are not unaffiliated empirical reproduction, reviewer-panel corroboration,
external human specialist review or editorial peer review.

The release gate additionally requires exact manifest coverage, ordinary and
optimized execution, hostile controls, clean-checkout replay, a retained
attestation and detached package verification. The authoritative public receipt
must state which of those checks passed for the released bytes. Hashes establish
byte identity and producer replay establishes declared transformations; neither
establishes source validity, causal truth, policy merit or real-world impact.

## What the result does not establish

- It does not establish that the policy caused the reported casualty decline.
- It does not establish that the effect was negative, zero, positive, 28% or
  any other magnitude.
- It does not turn the illustrative -50%, 0% and +100% worlds into estimates or
  bounds.
- It does not show that every possible future design is non-identified.
- It does not validate or refute earlier causal evaluations merely by citing
  them as prior art.
- It does not identify risk per journey, displacement or realised-speed effects;
  affected-road traffic exposure is absent.
- It does not establish welfare effects, distributional consequences,
  implementation quality or whether the policy should be retained, changed or
  reversed.
- It does not supply independent rerun, independent reimplementation, formal
  verification, human specialist review or editorial peer review.
- It does not show that Evidence Press makes policy assessment faster or
  better. That remains a separate comparative hypothesis requiring prospective
  measurement.

## Relationship to earlier work

This release reuses the identification-before-estimation discipline illustrated
by [*Stocks Are Not Flows*](https://evidencepress.org/releases/stocks-are-not-flows/):
write the estimand, specify the observation map and admitted rivals, and stop a
point attribution when the evidence cannot distinguish it. Reusing that method
does not make this case independent confirmation of the earlier release.

Three APEP working papers located in the bounded novelty search had already
presented Wales/England difference-in-differences evaluations: *Slower Streets,
Safer Streets?*, *Does the Default Kill?*, and *The Speed Penalty*. This audit
does not adopt their estimates as true. It asks the separate question whether
the registered affected-road causal estimand is recovered from the frozen
aggregate evidence and unrestricted counterfactual class used here.

The [Office for Statistics Regulation's 20 mph guidance](https://osr.statisticsauthority.gov.uk/guidance/2026-what-to-look-out-for-20mph/)
is a close conceptual antecedent: it highlights reclassification, exposure,
reporting and causal-language cautions. The present candidate turns those
measurement concerns into a source-bound estimand distinction and constructive
non-identification witness; it does not convert regulatory guidance into an
empirical effect estimate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Welsh and local-government policymakers | Distinguish a reported trend from the evidence needed to attribute it, and identify the missing measurements that could change the decision state. | Non-identification is not evidence of zero effect and does not settle the policy's merits. |
| Road-safety statisticians and data custodians | Prioritise a versioned historical treatment, exception and reversion map linked to collision locations and exposure. | More aggregate quarters alone may leave the same observation-map failure intact. |
| Causal-inference and policy-evaluation researchers | Stress-test donor designs, treatment coding, interference and counterfactual restrictions before estimating a point effect. | The witness is conditional on the registered corpus and rival class, not a universal impossibility theorem. |
| Journalists and public commentators | Report the provisional 28% as a descriptive, vintage-specific comparison rather than a measured causal contribution. | Later source vintages differ, and none of the three aggregate routes identifies the affected-road effect. |
| Research agents and assurance engineers | Reuse the machine-readable estimand, rival, source, citation, calculation and review objects or challenge them with a new counterexample. | Structural conformance and model review do not substitute for human semantic judgment or unaffiliated reproduction. |

## How to reproduce the recorded checks

From the exact public research release, verify the published checksum ledger,
extract into a fresh directory and use the pinned offline environment. The
recorded lifecycle entry point is:

```sh
uv run --no-editable --offline --frozen --no-sync pio lifecycle \
  cases/wales-20mph-casualty-attribution \
  --schema-root schemas \
  --output OUTPUT_DIRECTORY
```

The expected lifecycle outputs include `MANIFEST.sha256`,
`lifecycle-summary.json` and `validation-receipt.json`. The package also
exposes the focused analysis check:

```sh
uv run --no-editable --offline --frozen --no-sync \
  python tools/build_wales_20mph_tables.py check
```

Use the release receipt, not this prose, for the exact commit, dependency lock,
command vector, output hashes and clean-checkout result. A successful rerun is
producer-workflow evidence unless performed and reported by an unaffiliated
party.

## The most valuable next projects

1. Freeze a versioned historical segment-level map of the roads that changed,
   remained exceptions or later reverted.
2. Link collision and casualty locations to that map under explicit coding and
   linkage-error rules.
3. Specify a defensible comparison design with multiple pre-period diagnostics,
   placebo dates and explicit interference and anticipation assumptions.
4. Measure affected-segment traffic, realised speeds, enforcement, weather,
   reporting changes and concurrent interventions where they bear on the
   target.
5. Register source-backed restrictions prospectively and compute an empirical
   identified set only if those restrictions support one; retain sign ambiguity
   or `NOT_BOUNDED` when they do not.
6. Independently reconstruct the source-vintage ladder and reimplement the
   observation-map witness without using the producer code or intermediates.
7. Compare this workflow with a matched conventional expert assessment at the
   same assurance endpoint, recording elapsed time, human effort, compute,
   rework and missed valid effects rather than inferring acceleration from
   publication speed.

## What is in the public package

The complete public package should contain the case records, frozen official
sources authorised for redistribution, source and citation manifests, exact
estimand, observations, assumptions, rivals, missingness, calculation and
identification records, derived tables, adversarial-review history, ordinary
and optimized test evidence, hostile controls, clean-checkout attestation,
final receipt, provenance, licences, environment lock, replay instructions and
detached verifier.

The GitHub prerelease and Zenodo record must distribute the same declared
release assets, with public readback hashes matching the local release ledger.
The Evidence Press page, art and any audio or video are communication surfaces,
not additional policy evidence.
