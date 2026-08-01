## Summary

England has seen a striking shift from owner occupation to private renting, especially among younger and middle-aged households. One influential explanation is that rising wealth at the top increased demand for housing as an asset: better-resourced buyers accumulated property, while households further down the distribution found ownership harder to reach.

That explanation may be true in part. The available aggregate data cannot tell us how much.

This paper reconstructs the public evidence and then asks a stricter question: do the observed tenure shares, house prices, rents, mortgage rates, housing supply, and dwelling stocks distinguish wealthy-investor pressure from other plausible mechanisms? In the registered design, they do not. Credit conditions, housing supply, demographics, tax changes, middle-resource losses, institutional entry, and combinations of these mechanisms can produce the same observed pattern.

The result is deliberately neither "wealthy investors caused the shift" nor "wealthy investors had no effect." It is that the public aggregate series usually brought into this debate do not identify the effect. The project therefore stopped before fitting a structural model that would have produced a precise-looking but non-unique historical attribution.

This matters for public debate because a tenure share is a stock, while the proposed mechanism concerns flows: who bought which property, what its previous and subsequent use was, whether the buyer was a landlord, what resources the buyer had before purchase, and where the funds came from. Near-mirror changes in owner occupation and private renting do not, by themselves, reveal those transactions.

## What the public data show

For English households whose household reference person was aged 25 to 44, the reconstructed owner share fell from 60.5270% in 2008-09 to 48.5783% in 2018-19, a decline of 11.9487 percentage points. Private renting rose from 22.1325% to 34.4594%, an increase of 12.3269 points. The social-renter residual changed comparatively little.

Other official series document rising house prices and stock rents, changes in relative prices, a recovering net housing-supply rate, and changing quoted mortgage costs over the registered windows. These are real and important accounting facts. They constrain any serious model of the period.

They do not reveal the gross transactions behind the net tenure stocks. A home moving out of owner occupation might have been bought by an existing cash landlord, a company, an institutional vehicle, a newly leveraged small landlord, or an owner occupier whose circumstances later changed. A property appearing in rental listings does not directly reveal the purchaser's wealth rank or the origin of the purchase funds. Different mechanisms can also operate simultaneously.

## Summary for specialists

The paper converts an initially planned structural extension of Stevenson's 2019 MPhil work into a prospective identification audit. Its residual contribution is not a new claim that inequality can affect homeownership or house prices; that broad mechanism already has close theoretical and empirical neighbours. The contribution is a design-conditioned discriminator test, an explicit stopping rule, a conditional sharp-set framework, and a value-of-information criterion for new measurements.

IDENT-0 tests whether the focal response to an aggregate top-resource forcing variable can be separated from admitted credit, supply, demographic, tax, and alternative-resource responses under the registered observation map. The focal response lies in the rival-and-nuisance span. The authoritative decision is therefore `FAIL-IDENT-0`, and the planned unique structural attribution is stopped.

That is stronger than saying a regression may be endogenous, but weaker than claiming that no conceivable design could ever identify the mechanism. The conclusion is conditional on the registered observables and admitted response class. New data or externally justified restrictions could change the column space. They must be justified independently of the desired conclusion.

The accompanying partial-identification machinery is intentionally conditional. It can compute a sharp set once source-backed response bounds are supplied; it does not turn synthetic loadings into an empirical interval for England. The current release consequently reports no causal coefficient, historical contribution share, or empirical England sharp interval.

## Why this changes the debate

Housing arguments often move too quickly from three sound observations to an unsupported attribution:

1. owner occupation fell;
2. private renting rose by a similar amount;
3. wealth became more concentrated.

The first two statements describe tenure stocks. The third describes a distribution. None directly observes the property-use conversions, purchaser identities, or funding origins required to connect them causally.

This does not make the proposed mechanism implausible. It changes the burden of proof. A commentator may present wealthy-investor pressure as a hypothesis supported by theory and circumstantial evidence. They should not present the aggregate paths as measuring its historical contribution. Conversely, a failed aggregate identification design cannot be used to claim that the contribution was zero.

The practical lesson is constructive: public agencies and researchers should ask which additional measurement would create a genuinely new discriminating direction, rather than adding more variables that reproduce the same ambiguity.

## Who should care, and why

| Likely audience | Why the result matters | Useful next action |
|---|---|---|
| Housing and tax policymakers | Policies aimed at landlords, credit, supply, or wealth distribution rely on different causal stories. Aggregate tenure changes cannot choose between them. | Require mechanism-specific evidence and report attribution uncertainty explicitly in impact assessments. |
| Journalists and public commentators | Near-offsetting owner and renter shares make an intuitively powerful graphic, but they are not observed owner-to-landlord flows. | Separate documented accounting changes from causal interpretation; ask what purchaser and property-use data support the claimed channel. |
| Housing economists and macroeconomists | A well-fitting structural model can still be non-specific if omitted rivals generate aligned responses. | Run a prospective observation-map audit before estimation and retain null, sign-reversing, and set-valued outcomes. |
| Survey, land, mortgage, and tax data custodians | The missing object crosses institutional boundaries: transactions, property use, purchaser status, and pre-purchase resources. | Design privacy-preserving linkage with explicit error models and a pre-analysis value-of-information test. |
| Partial-identification researchers | The current boundary is a natural starting point for a transparent sharp set rather than a forced point estimate. | Supply defensible response ranges and propagate classification, linkage, and equilibrium uncertainty. |
| Reproducibility researchers | The package demonstrates a positive scientific use of a failed gate: it stops an underidentified fit while preserving accounting results and adversarial controls. | Reimplement the audit independently and test the semantic coverage of the response class, not only the code path. |

## The most valuable next projects

### 1. Measure the joint transaction object

The highest-value new record would jointly observe:

- the property's use before and after purchase;
- whether the purchaser was or became a landlord;
- the purchaser's non-housing resources before purchase; and
- the financing and legal form of the acquisition.

No single field is enough. Transaction-to-listing linkage can classify a useful property flow, but listing windows, platform coverage, delayed letting, company ownership, and refinancing create measurement error. Tax or mortgage linkage can add purchaser information, but anticipation, legal-form switching, and equilibrium spillovers still need to enter the response class.

### 2. Replace point attribution with empirical bounds

Once credible response ranges exist, the paper's sharp-set machinery can ask how wide the historically admissible contribution is. An informative result might be positive, near zero, negative under some admissible responses, or sign-ambiguous. All of those outcomes would be more honest than an unsupported singleton.

### 3. Independently reproduce the accounting and geometry

The current package deterministically replays its own transformations and synthetic design checks. Independent reproduction should begin from fresh official downloads, reconstruct the age-band tenure shares, and implement the focal-versus-rival geometry without reusing the repository's intermediate data or code. Survey-design information is also needed before attaching defensible uncertainty intervals to the combined 25-44 tenure shares.

## How it was checked

The release passed 135 tests under normal Python and the same suite under optimized Python, an optimized scientific-gate self-check, 43 registered public-data checks, hash verification, deterministic replay, negative and sign-reversing controls, PDF structural checks, and privacy scans. The GitHub and Zenodo release assets were read back publicly and are byte-identical.

Those checks establish internal consistency and reproducibility of the shipped accounting and design audit. They are not independent replication, peer review, formal verification, or expert acceptance. The response design is synthetic rather than an estimated model of England, and the broad investor-pressure mechanism is prior art.

## What is in the evidence package

The public release contains the 30-page anonymous preprint and source, Python code with a pinned environment, the 135-test suite, frozen IDENT-0 and public Gate A reports, a deterministic offline replay, conditional partial-identification tools, seven official-source objects with receipts and Open Government Licence attribution, derived tables and figures, SHA-256 manifests, an assurance statement, and a publication-integrity report.

It does not redistribute the supplied Stevenson thesis, safeguarded or proprietary microdata, address-level records, cached literature PDFs, private Git history, personal commit metadata, or local-path manifests.
