## Summary

England has seen a striking shift from owner occupation to private renting, especially among younger and middle-aged households. One influential explanation is that rising wealth at the top increased demand for housing as an asset: better-resourced buyers accumulated property, while households further down the distribution found ownership harder to reach.

That explanation may be true in part. The available aggregate data cannot tell us how much.

This paper reconstructs the public evidence and then asks a stricter question: do the observed tenure shares, house prices, rents, mortgage rates, housing supply, and dwelling stocks distinguish wealthy-investor pressure from other plausible mechanisms? In the registered synthetic design, they do not: combinations of the other mechanisms (credit, interest rates, supply, demographics, landlord tax, middle-resource loss) together with constructed rivals such as institutional entry can reproduce the investor mechanism's predicted signature.

The result is deliberately neither "wealthy investors caused the shift" nor "wealthy investors had no effect." It is that the public aggregate series usually brought into this debate do not identify the effect. The project therefore stopped before fitting a structural model that would have produced a precise-looking but non-unique historical attribution.

This matters for public debate because a tenure share is a stock, while the proposed mechanism concerns flows: who bought which property, what its previous and subsequent use was, whether the buyer was a landlord, what resources the buyer had before purchase, and where the funds came from. Near-mirror changes in owner occupation and private renting do not, by themselves, reveal those transactions.

> **Status:** public discussion preprint v1.0.0 — anonymous, unrefereed, and not independently reproduced. The broad investor-pressure mechanism is prior art; the contribution is the identification audit.

## What the public data show

For English households whose household reference person was aged 25 to 44, the reconstructed owner share fell from 60.5270% in 2008-09 to 48.5783% in 2018-19, a decline of 11.9487 percentage points. Private renting rose from 22.1325% to 34.4594%, an increase of 12.3269 points. The social-renter residual changed comparatively little.

Other official series document rising house prices and stock rents, changes in relative prices, a recovering net housing-supply rate, and changing quoted mortgage costs over the registered windows. These are real and important accounting facts. They constrain any serious model of the period.

| Registered fact | Reproduced accounting result | Interpretation ceiling |
|---|---|---|
| England house-price index | 63.3 (January 2008) to 82.0 (December 2019); +29.5419% | Unadjusted all-property index; not a landlord-specific price |
| Stock-rent segments | IPHRP +12.6554% (2008–2014); PIPR +11.9390% (2015–2019) | Separate method segments; no level splice |
| Normalised price/stock-rent index | +9.3346% over January 2015–December 2019 | A relative index, not a rental yield |
| Net additions | 0.8119% (2008–09) to 1.0233% (2018–19) of start-of-year dwelling stock | Includes vacant dwellings; not the household denominator used for tenure |
| Quoted mortgage-cost spread | Buy-to-let minus owner spread 2.01 to 0.51 points over 96 common months; mean 1.2573 | UK quoted offers, not realised England borrower costs |

They do not reveal the gross transactions behind the net tenure stocks. A home moving out of owner occupation might have been bought by an existing cash landlord, a company, an institutional vehicle, a newly leveraged small landlord, or an owner occupier whose circumstances later changed. A property appearing in rental listings does not directly reveal the purchaser's wealth rank or the origin of the purchase funds. Different mechanisms can also operate simultaneously.

## Summary for specialists

The paper converts an initially planned structural extension of Stevenson's 2019 MPhil work into a prospective identification audit. Its residual contribution is not a new claim that inequality can affect homeownership or house prices; that broad mechanism already has close theoretical and empirical neighbours. The contribution is a design-conditioned discriminator test, an explicit stopping rule, a conditional sharp-set framework, and a value-of-information criterion for new measurements.

IDENT-0 tests whether the focal response to an aggregate top-resource forcing variable can be separated from admitted credit, supply, demographic, tax, and alternative-resource responses under the registered observation map. The focal response lies in the rival-and-nuisance span. The authoritative decision is therefore `FAIL-IDENT-0`, and the planned unique structural attribution is stopped.

That is stronger than saying a regression may be endogenous, but weaker than claiming that no conceivable design could ever identify the mechanism. The conclusion is conditional on the registered observables and admitted response class. New data or externally justified restrictions could change the column space. They must be justified independently of the desired conclusion.

The accompanying partial-identification machinery is intentionally conditional. It can compute a sharp set once source-backed response bounds are supplied; it does not turn synthetic loadings into an empirical interval for England. The current release consequently reports no causal coefficient, historical contribution share, or empirical England sharp interval.

## Technical account: how the audit works

**Stocks do not determine gross flows.** Write $O_t$, $L_t$ and $S_t$ for owner-occupied, privately let and social or other housing-use stocks. Ignoring construction, demolition, vacancy and reclassification for a moment,

$$
L_t-L_{t-1}=F_t^{O\to L}-F_t^{L\to O}.
$$

For every $k_t\ge0$, the pair $(F_t^{O\to L}+k_t,\ F_t^{L\to O}+k_t)$ gives the same stock path, and landlord-to-landlord sales change turnover without changing the stock at all. Even a correctly classified owner-to-landlord purchase does not reveal the purchaser's resources or how the purchase was financed. The focal primitive $z_T$ is therefore a latent aggregate increment to top non-housing resources, not a wealth share, measured saving or a housing capital gain.

**A fail-fast design gate.** A local response map sends seven maintained mechanism amplitudes (top resources, middle resources, credit, planning or supply, landlord tax, interest rates and demographics) to 57 registered target moments. The coefficients are synthetic design inputs, not empirical elasticities. The gate was frozen to return only `FAIL-IDENT-0` or `CONTINUE-TO-FULL-GATE`; it had no path to declare final identification.

In the authoritative run, the maintained seven-column matrix was full rank at all 64 design points and at each of three step sizes, and the known-negative collinearity controls behaved as registered. But three of four deliberately constructed omitted mechanisms (social comparison, institutional entry, rental segmentation and planning restriction) induced a $z_{\text{top}}$ profile that excluded zero, and three required observation bridges were not implemented. The gate failed, so the precomputed workload of 6,573 fits and 210,336 optimiser starts was not run. The four rivals are stress constructions; the 3/4 proportion is not a population false-positive rate.

**Why no discriminator exists.** Write a local linear response as $y=f\beta+N\gamma$, with $f$ the focal response and $N$ the nuisance and rival responses. A vector $d$ with $d^\top N=0$ and $d^\top f=1$ exists if and only if $f\notin\operatorname{col}(N)$ (Proposition 1). In the design-geometry certificate, the maintained 57-by-7 matrix has rank seven, but after appending the four rival columns the 57-by-11 matrix has rank nine. Projecting the focal column onto the ten other columns leaves relative residuals of $1.46097\times10^{-14}$ in public units and $2.32265\times10^{-14}$ after synthetic scaling, far below the registered $2\times10^{-10}$ tolerance. The decision is `STOP-UNIQUE+GO-PARTIAL-ID-THEORY`.

**Sharp sets, conditionally.** With externally justified bounds $\ell\le\gamma\le u$, the sharp conditional focal set

$$
B(y)=\{\beta:\exists\gamma:\ y=f\beta+N\gamma,\ \ell\le\gamma\le u\}
$$

is an interval whose endpoints solve two linear programs. No source-backed response set exists for England, so no empirical interval is calculated.

**What a new measurement must do.** Let $C=\{c:Nc=f\}$. Appending one measurement with focal response $a_f$ and nuisance row $a_N^\top$ identifies a new focal direction if and only if $a_f\notin\{a_N^\top c: c\in C\}$ (Proposition 2). One well-oriented scalar measurement can be enough, while arbitrarily many measurements that satisfy the same nuisance representation cannot help. Another tenure-stock year is unlikely to break the equivalence; the most valuable design jointly links pre-determined non-housing resources to purchaser identity, property-use transition and financing.

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

## Evidence, assurance and limitations

The release passed 135 tests under normal Python and the same suite under optimized Python, an optimized scientific-gate self-check, 43 registered public-data checks, hash verification, deterministic replay, negative and sign-reversing controls, PDF structural checks, and privacy scans. The GitHub and Zenodo release assets were read back publicly and are byte-identical.

The seven official source objects matched their prospectively frozen SHA-256 digests. The public-accounting layer was run against the official HTTPS locations and then replayed offline from the immutable raw files; the raw files, derived tables and figure files were byte-identical across the two runs. A matching digest establishes byte identity with the registered source object, not survey validity, measurement accuracy or a causal interpretation.

Those checks establish internal consistency and reproducibility of the shipped accounting and design audit. They are not independent replication, peer review, formal verification, or expert acceptance. The response design is synthetic rather than an estimated model of England, and the broad investor-pressure mechanism is prior art.

The paper names four limitations that set its claim ceiling:

- the public tenure path contains point estimates without the survey-design covariance needed for combined-age inference, so no confidence intervals are attached to the 25–44 shares;
- the design responses and adversarial rivals are synthetic: they test a planned model, not England;
- the novelty search is bounded and cannot prove global priority; and
- the analysis does not estimate a causal or structural historical contribution.

The EHS endpoints and the 2015–2019 price/stock-rent endpoint had been viewed during feasibility work, so their calculation is a reproduction of previously observed accounting facts, not an untouched directional test.

## How to inspect or reproduce the recorded checks

The frozen public inputs and allow-listed results needed by the paper and tests are committed in the release. From the repository root:

```bash
uv sync --extra dev --no-editable
PYTHONPATH=src uv run pytest
PYTHONPATH=src uv run python -O -m pytest
PYTHONPATH=src uv run python -O -m housing_pressure.ident0.selfcheck
```

To regenerate the IDENT-0 audit, the public accounting layer and the design-geometry certificate into new result directories:

```bash
PYTHONPATH=src uv run housing-ident0 --config configs/ident0.json --output-dir results/ident0/<new-run-id>
PYTHONPATH=src uv run housing-gatea --config configs/gatea_public.json --output-dir results/gatea/<new-run-id>
PYTHONPATH=src uv run housing-partialid --output-dir results/partialid/<new-run-id>
```

The IDENT-0 command can issue `FAIL-IDENT-0` or `CONTINUE-TO-FULL-GATE` but never `PASS-IDENT-0`; the partial-identification command can emit only `STOP-UNIQUE+GO-PARTIAL-ID-THEORY`, never an empirical England bound. Scientific gates use explicit exceptions rather than Python `assert`, so they stay active under `python -O`. The authoritative runs and their report hashes are listed in the repository README and in the paper's reproducibility section; `ASSURANCE.md` states the verification boundary.

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

## What is in the evidence package

The public release contains the 30-page anonymous preprint and source, Python code with a pinned environment, the 135-test suite, frozen IDENT-0 and public Gate A reports, a deterministic offline replay, conditional partial-identification tools, seven official-source objects with receipts and Open Government Licence attribution, derived tables and figures, SHA-256 manifests, an assurance statement, and a publication-integrity report.

It does not redistribute the supplied Stevenson thesis, safeguarded or proprietary microdata, address-level records, cached literature PDFs, private Git history, personal commit metadata, or local-path manifests.
