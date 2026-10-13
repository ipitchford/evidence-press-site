## Summary

An average repayment date does not tell you how much public debt will be exposed to higher interest rates next year. Two debt portfolios can have the same size and average maturity but very different repayment schedules.

Consider £100 billion of fixed-rate debt. In one portfolio, everything matures in four years. In another, £50 billion matures immediately and £50 billion in eight years. Both have an average maturity of four years. Yet a permanent one-percentage-point rise in refinancing rates adds nothing to the first portfolio's first-year interest bill and £0.5 billion to the second's, under the paper's like-for-like refinancing model.

This candidate asks what published debt statistics actually establish. Instead of guessing the missing repayment schedule, it computes the smallest and largest costs among every schedule consistent with the stated information. It then asks which additional disclosures would narrow that interval.

The result is a methods application, not a forecast of the UK or US public finances. It supplies checkable bounds for an explicitly defined debt ledger—and shows where a mathematical calculation must stop because its accounting inputs are incomplete.

## Summary for specialists

For nonnegative maturity measures $\mu_c$ and declared piecewise-affine exposure kernels $g_c$, the objective is

$$J(\mu)=\sum_c\int g_c(t)\,d\mu_c(t).$$

Published totals, maturity moments, bucket amounts and linear couplings constrain the feasible set. A breakpoint reduction gives an exact finite linear programme on the declared daily grid. Rational primal and dual witnesses certify its sharp endpoints. Identification means that the objective is constant over the entire feasible set—not merely over the support of the realised portfolio.

The package contains 4,540 original endpoint certificates and 36 additional certificates for a specified recursive annual-financing convention. Annual amounts and first moments identify the stated annual cost windows when the kernel is affine within each reporting cell. This does not automatically extend to arbitrary subannual horizons, changing bill rollover schedules or complete central-bank accounting.

## Technical account

### What additional information buys

For a one-year common-rate shock, it matters how much debt reprices within the year and when within that year it reprices. If those amounts and their first moments are fixed, the relevant linear exposure is fixed too. With rounded information, an interval remains.

In the gross UK demonstration, adding the mean maturity of debt due within a year, reported to the day, reduces the first-year interval width to about £0.007 billion. That number is conditional on the supplied ledger, disclosed amounts and model conventions. It is not an error bar on a national forecast.

The disclosure comparisons also distinguish a single number from a vector of numbers. A reporting package can include several component-specific quantities; the paper records both its scalar count and its incremental linear rank. Comparing packages of different sizes does not establish which is cheapest to collect.

### Holdings are not a funding account

The Bank of England's records for **7 October 2026** report an APF loan of £521.819 billion and gilt holdings of about £488.149 billion at initial purchase proceeds. Initial purchase proceeds measure historical purchase cost after the relevant holdings are removed; they are not the current loan balance.

These dated observations are usable in mid-October. The limitation is **missing matched information**, not that October is unfinished. Net financing exposure also depends on loan principal, interest-bearing cash and their paths. Subtracting the two headline stocks does not supply that information.

The February 2026 annual accounts allow a separate historical reconciliation. Their cash-flow statement closes exactly at the reported precision. Holding the reported loan principal and cash balance fixed gives a direct annual net-financing sensitivity of roughly £5.315 billion for a one-percentage-point rate increase. This is a dated, frozen-balance calculation—not an October estimate, a whole-public-sector exposure measure or a prediction of future costs.

The package retains the earlier `consolidated` code labels for reproducibility. Their calculations are explicitly **synthetic IPP-funded allocation and runoff scenarios**. Exact certificates for those scenarios do not establish that the assumed funding path describes the APF. The comparison with the OBR ready reckoner remains unbridged and is not presented as validation.

### Financing convention matters

The original financing extension applied interest to first-round costs only. The revision labels it a first-pass approximation and adds a genuinely recursive annual convention:

$$B_k=(1+y)B_{k-1}+(1+y/2)C_k.$$

Starting from $B_0=0$, each year's first-round cost $C_k$ is booked at the midpoint, while previously accumulated debt earns a full year's simple interest at rate $y$. This remains linear in the underlying ledger and admits the same certificate machinery. It is exact for that convention, not for continuous-time compounding.

## Evidence, assurance and limitations

Producer-side checks link all 4,576 rational certificates to their reported results. The revised source audit matches the computationally relevant fields of all 105 UK gilts against the DMO's official export dated 12 October 2026. A separate evaluator checks instrument-level values but shares the modelling assumptions; it is implementation diversity, not independent reproduction.

The main limitations are substantive:

- The calculations hold starting amounts fixed, refinance like-for-like and omit behavioural responses and future deficit borrowing.
- UK bill timing is reconstructed. Some source values were parsed through floating-point representations before exact certification; rational arithmetic does not restore lost source precision.
- The synthetic APF funding scenarios do not establish actual consolidated fiscal exposure. Future matched loan, cash and other accounting paths remain needed.
- The rounding interval for the February frozen-balance calculation is not a confidence interval.
- The general moment and optimisation methods are established. The contribution is their inspectable debt-disclosure application; exhaustive novelty or priority is not established.

The release remains an unrefereed, AI-assisted candidate. Internal review, exact arithmetic and publication do not constitute external specialist review, formal verification or unaffiliated reproduction.

## Relationship to earlier work

Debt-management guidance already warns that average maturity can hide concentrated repayments. Moment bounds, partial identification and exact linear-programming verification are also established methods. This work combines them to expose the range of model costs compatible with specified debt disclosures, together with the information that would remove the ambiguity.

The conceptual link with Evidence Press's [Stocks Are Not Flows](/releases/stocks-are-not-flows/) is the need to identify an accounting quantity before estimating it. That is a thematic connection, not independent confirmation or an inherited proof.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Public-debt analysts | Test how much a summary table actually determines about a specified rate shock. | Audit the instrument perimeter, valuation definitions and accounting paths first. |
| Statistical publishers | Compare the residual ambiguity after adding proposed reporting fields. | Vectors have different collection costs; narrower model bounds alone do not justify a reporting mandate. |
| Optimisation and partial-identification researchers | Reuse breakpoint reductions, exact endpoint witnesses and disclosure diagnostics. | The formal programme can be correct while the substantive model is incomplete. |

## Why the problem matters

A precise-looking total can conceal a wide range of repayment schedules. Reporting an identified interval makes that ambiguity visible. It can also turn “we need more data” into a specific request: a within-year mean, an annual profile or a matched funding balance.

The practical value remains to be tested. This release does not show that a debt office changed its reporting, that a forecast improved or that a policy decision became better.

## How to inspect or reproduce the recorded checks

Start with the repository's [AI navigation index](https://github.com/ipitchford/debt-disclosure-bounds/blob/v1.1.0-candidate/AI_INDEX.md), then read the manuscript's setup and accounting reconciliation before interpreting any table. The command `python scripts/verify_certificates.py --frozen` checks all 4,576 certificates against the exact model snapshots in `results/exact-models.json.gz`, offline using Python's standard library. The full source-rebuild route additionally needs the official third-party inputs described in the package.

Some Bank of England originals are not redistributed. Their source URLs, hashes and retrieval instructions preserve the distinction between public model checking and source-data reconstruction. A successful certificate replay establishes the encoded optimisation result, not the economic adequacy of its assumptions.

For a short audit, compare the two £100 billion portfolios above, inspect the global identification criterion, then follow one result to its primal and dual witnesses. For the empirical bridge, inspect the 105-row DMO comparison and the February accounting equations separately.

## The most valuable next projects

1. Reconcile a complete, dated APF net-funding path, including principal, cash, accrued interest and indemnity flows, before computing an actual consolidated multi-year exposure.
2. Reproduce the source-to-ledger bridge outside the producer workflow, including the reconstructed bill schedule and the US instrument data.
3. Compare alternative disclosure packages at matched reporting cost, rather than treating a multi-field vector as one statistic.
4. Build a term-by-term bridge to a public fiscal ready reckoner with identical windows, shocks and liability definitions.

## What is in the evidence package

The package supplies the revised manuscript, claim and assurance records, an AI navigation index, exact endpoint certificates, result tables, model definitions, replay and negative-control code, source provenance and a review-response record. The synthetic funding scenarios are retained with explicit limitations so that their mathematical results remain inspectable without restoring the withdrawn institutional interpretation.
