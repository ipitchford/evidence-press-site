## Plain-English summary

Governments, scientists and managers routinely make decisions from compact summaries: an economy-wide production relation, catch per unit effort, or a basic reproduction number. Those summaries can be measured correctly and still fail to determine the quantity or response needed for a decision. Measuring the summary more precisely cannot recover information that aggregation discarded.

The problem becomes concrete in a fishery. Commercial catch per unit effort can equal 100 when abundance is 100 and catchability is 1, or when abundance is 20 and catchability is 5. If both states remain credible, the index alone cannot tell a manager which abundance is present. The manager needs an independent anchor or a defensible restriction on catchability.

Economics and epidemiology expose different versions of the same information problem. Individually rational consumers do not automatically behave in aggregate like one representative person. A basic reproduction number can determine the threshold under uniform immunisation while failing to determine it under targeted allocation. The three cases are purposive illustrations, not a claim that their mechanisms are identical.

The unifying diagnostic is simple. Name the underlying state, the reported aggregate, the target and the intervention. Then search for two admissible worlds with the same aggregate and different target values. If such a collision exists, the target cannot be recovered from the aggregate alone.

The proposed repair is an **aggregation licence**: a bounded, versioned and revocable statement that one compression is adequate for one target, population, intervention family, loss and time horizon. It tells readers what the aggregate may support, what additional state is needed, and which changes make the permission expire.

## The central claim or finding

The central claim answers one question: can the desired answer be computed from the aggregate alone? Let $x\in\mathcal X$ be an admissible microstate, $A(x)\in\mathcal Z$ a reported aggregate and $T(x)\in\mathcal Y$ the target. An exact set-theoretic rule $g:A(\mathcal X)\to\mathcal Y$ on the reached image satisfying

$$
T(x)=g(A(x))
$$

for every admissible state exists if and only if the target is constant on each fibre of the aggregation map:

$$
A(x)=A(x')\quad\Longrightarrow\quad T(x)=T(x').
$$

For data $D$, the compatible target set at aggregate value $z$ is

$$
\mathcal T(z;D)=\{T(x):x\in\Theta(D),\,A(x)=z\}.
$$

All local quantities require a non-empty reached fibre. Its diameter $\Delta_A(z;D)$ diagnoses exact local identification, but the revised licence asks **four licence questions**. Local point identification asks whether this observed target set is a singleton; exact global set-theoretic factorisation asks whether every reached fibre is target-constant. Minimax prediction uses the smallest worst-case radius around a point prediction. Decision adequacy uses the smallest worst-case regret over available actions and distinguishes the best aggregate-only regret $R_A$ from the regret $R(a_g)$ of the registered rule actually deployed. Equal diameters can have unequal minimax radii, and non-zero target ambiguity can still give zero decision regret when every compatible state selects the same action.

The factorisation result is elementary and is not claimed as new. Bare existence of $g$ is not operational sufficiency: measurability, stability or continuity, computability, membership in the registered model class, and finite-sample learnability or generalisation are separate gates. The bounded contribution is a cross-domain, versioned reporting and assurance wrapper combining collision certificates, the four licence questions, operational gates, target-preserving augmentation, held-out intervention tests and expiry conditions.

## How the result works

The synthesis separates three mechanisms because each failure calls for different evidence and a different repair.

**Closure and representation failure.** Individual laws may not preserve their form after aggregation. The Sonnenschein–Mantel–Debreu results show, within their qualified pure-exchange domains, that individual utility maximisation alone places weak restrictions on aggregate excess-demand shape. That does not ban representative agents. It means their forecasting, policy, incidence and welfare authority must come from additional restrictions or validation. Production aggregation is a separate formal problem: stringent aggregation conditions and accounting identities make ordinary Cobb–Douglas fit insufficient as independent evidence of a stable physical technology.

**Inverse-identification failure.** Under the basic CPUE equation (I=qN), abundance (N) and effective catchability (q) can offset one another. The executable toy pairs ((N,q)=(100,1)) and ((20,5)) yield the same index. Rose and Kulka’s northern-cod evidence shows why the mechanism matters: selected local density and catch success remained high as the stock and occupied area declined.

**Intervention-sufficiency failure.** The basic reproduction number is the spectral radius of a next-generation operator. Under uniform independent perfect immunisation, the whole fixed operator is multiplied by (1-v), so (1-1/R_0) remains exact even with heterogeneous mixing. That is a positive control. Under a type-1-first allocation, the package’s two equal-(R_0) toy operators reach local control at total coverage 60% and one third. The aggregate is sufficient for the uniform target and insufficient for the targeted target.

The cases are purposively selected illustrations, not a representative survey of aggregation problems. Economics supplies closure/representation failure, fisheries inverse identification, and epidemiology intervention-path insufficiency with a sharp positive control.

The licence then seeks the least-cost additional state, within a declared family of possible additions, that reduces minimax prediction radius or decision regret below tolerance: distributional moments or networks in economics; occupied area, fixed-domain density and fleet choice in fisheries; group structure, operator entries and allocation path in epidemiology.

One **fully specified synthetic workflow demonstration** was sealed before its first recorded run. Its internal `registeredAt` value and over-strong purpose wording are documented in a machine-readable correction record; preserved filesystem chronology, the named SHA-256 sidecar and the receipt support only the narrower producer-side pre-execution claim. CPUE 100 with error 5 and catchability in $[0.8,1.2]$ yields an abundance interval of about $[79.17,131.25]$: prediction radius 26.04 and an action-threshold crossing, so it fails. The sole declared independent-survey augmentation narrows the interval to $[95,105]$: radius 5 and zero regret, so it passes. A held-out catchability shock to 1.35 makes the CPUE and survey intervals disjoint and triggers revocation. A separately labelled post-review sensitivity receipt varies catchability support, both observation errors, prediction tolerance, action threshold, asymmetric losses and survey cost and reports phase changes. This is not operational validation, empirical calibration, a stock-assessment method or external preregistration; “least cost” applies only within the declared option family and cost order.

## What is classical, and what is offered here

The fibre-factorisation principle is elementary. The SMD results, exact aggregation conditions, production-aggregation debate, CPUE hyperstability and next-generation-operator literature are established work. The numerical examples are toy demonstrations derived from the three supplied dossiers.

Offered here is a cross-domain taxonomy and reporting protocol:

1. declare microstate, compression, target and intervention;
2. register the admissible set, loss, tolerance and qualitative blockers;
3. search for same-aggregate, different-target collision worlds;
4. separately report the four licence questions and the applicable operational regularity gates;
5. select the smallest justified augmentation within a declared family of options and cost order;
6. test held-out interventions or regimes;
7. publish monitoring, expiry and revocation conditions.

Direct neighbours are now compared explicitly: Blackwell’s comparison of experiments, Le Cam’s approximate sufficiency, Doob–Dynkin measurable factorisation, approximate state abstraction, causal abstraction and aggregation, decision-focused learning, task- and decision-sufficient data, minimax regret, model cards, datasheets and SACM. Abel and colleagues already bound loss from approximate state abstraction; Poli and colleagues optimise abstractions for downstream decisions; Ye and colleagues provide hardness, stable-compression and generalisation results for decision-sufficient representations. Méloux and colleagues provide a current multi-metric causal-abstraction benchmark. The narrow contribution claim is the cross-domain, versioned reporting and assurance wrapper; exhaustive novelty and priority are not established.

## Evidence and audit trail

The intake consisted of three Notion HTML exports and two diagrams, with SHA-256 hashes recorded in the source inventory. The connected Notion workspace was read directly to confirm the current economics, fisheries and herd-immunity pages and their source relations. Retained local Hermes artefacts supplied the original SMD and herd computation scripts, CPUE calculation receipts, source manifests, diagrams and selected primary-paper text.

This paper does not treat the source packages’ internal PASS states as fresh independent evidence. It rebuilt standard-library Python certificates that:

- accepts a finite positive-control fibre on which the target is constant;
- detects the same-total-income economics collision;
- detects the CPUE-to-abundance collision;
- verifies both herd operators have (R_0=2.5);
- verifies both have the 60% uniform threshold;
- detects their 60% versus one-third targeted-threshold collision;
- rejects a deliberately mutated false rule;
- distinguishes a locally identified observed fibre from a globally invalid factorisation;
- shows equal-diameter sets with unequal minimax radii and non-zero ambiguity with zero action regret;
- replays the frozen synthetic CPUE FAIL/PASS/REVOKE sequence;
- rejects a deliberately wrong-domain citation route from the epidemiology claim to fisheries source S12;
- rejects author and DOI mutations of corrected source S06;
- replays the post-review seven-axis synthetic sensitivity and phase analysis;
- checks manuscript, site, claim-ledger and metadata terminology parity.

The final test count and environment matrix are recorded in `REPLAY_RECEIPT.md`. Sixteen bounded claims are indexed in `CLAIMS.json`; 37 sources, inspection roles, structured bibliographic fingerprints, version status and correction/retraction fields are in the source records. Semantic routing and identity checks detect specified mismatches but do not prove that a source entails a prose claim.

These are producer-side derivations, source checks and structural tests. They are not independent reproduction, formal verification, field-specialist review or editorial peer review.

## What the result does not establish

- It does not show that aggregation is generally invalid.
- It does not show that every representative-agent model fails, every equilibrium is unstable or every production function is an accounting artefact.
- It does not estimate northern-cod abundance, a causal share for the collapse or bias in every fishery.
- It does not provide vaccination advice, estimate a population threshold or recommend infection-induced immunity.
- It does not show that the proposed aggregation licence improves modelling, policy or productivity in practice.
- It is unrefereed and does not establish novelty, priority, independent reproduction, field-specialist acceptance or peer review.
- `NO IMPACT EVIDENCE`: no comparison estimates effects on modelling, review, policy or outcomes.
- A small target diameter is only as credible as the admissible state set, metric and identifying assumptions used to obtain it.

The scholarly creator is Anonymous. Ian Pitchford maintains and publishes the repository and release infrastructure; that operational role is not scholarly authorship. Original prose and structured claims are CC0-1.0, original code and tests are MIT, and third-party and supplied review material retain their existing rights.

## Relationship to earlier work

The synthesis uses SMD as a bounded closure and representation result, not a universal theorem about macroeconomics. It treats aggregate production as a separate case and retains both Shaikh’s accounting-identity critique and Solow’s immediate response. It uses Rose and Kulka as the principal empirical case for spatial hyperstability while preserving multi-causal collapse language. It follows Delmas, Dronnier and Zitt in treating uniform vaccination as scalar operator scaling and uses the supplied equal-(R_0) matrices only to demonstrate targeted-path insufficiency.

The closest neighbours include Zhu and colleagues on different micro-realisations of macro-interventions, Abel and colleagues on approximate state abstraction, Poli and colleagues on decision-focused abstraction, Ye and colleagues on decision-sufficient representations, and Taraldsen on measurable Doob–Dynkin factorisation. Méloux and colleagues supply a current abstraction-validation benchmark. Model cards, datasheets and SACM precede the documentation and assurance aspects. This paper adds a cross-domain, aggregation-specific versioned reporting and assurance wrapper, not a replacement theorem, learning algorithm or benchmark.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Economists and macro modellers | Separate forecast, intervention, incidence and welfare authority; test distributional or network augmentations. | A richer model is not automatically identified or true. |
| Fisheries scientists and managers | Treat spatial support, fleet choice and catchability as part of the abundance observation process. | The northern-cod case is strong but not a universal causal estimate. |
| Epidemiological modellers | State the operator, immunity path and allocation rule instead of transporting one scalar threshold. | Toy operators are not empirical policy advice. |
| Policy analysts | Ask for collision worlds and decision regret before accepting point answers from aggregate dashboards. | Overly broad admissible sets can make every decision look impossible. |
| Research agents and tool builders | Encode licences, collision certificates and expiry rules as machine-readable claim controls. | Structural conformance does not establish scientific truth or impact. |
| Interested non-specialists | Distinguish a measured aggregate from the target someone wants it to represent. | A failed target map does not mean the aggregate itself is fake or useless. |

## How to reproduce the recorded checks

The recorded environment is Python 3.14.6 with no third-party certificate dependencies. Other Python versions are not claimed as tested by this package.

```bash
python3 code/aggregation_certificates.py --output results/certificate_receipt.json
python3 code/synthetic_cpue_licence.py --protocol protocols/synthetic_cpue_licence.json --output results/synthetic_cpue_licence_receipt.json
python3 code/synthetic_cpue_sensitivity.py --protocol protocols/synthetic_cpue_licence.json --output results/synthetic_cpue_sensitivity_receipt.json
python3 -m unittest discover -s tests -v
python3 -O -m unittest discover -s tests -v
```

Expected counts and results are frozen in `REPLAY_RECEIPT.md`; the receipts report three rejected false factorisations, a zero-diameter uniform-vaccination positive control, the synthetic `FAIL`/`PASS`/`REVOKE` sequence and post-review sensitivity phase changes.

Run `python3 verify_package.py` after manifest generation to check required files, JSON structure, claim support references, prohibited private paths and SHA-256 inventory.

## The most valuable next projects

1. Obtain economics, fisheries and mathematical-epidemiology specialist reviews of the field mappings and claim boundaries.
2. Formalise the aggregation-licence schema and a fail-closed claim-to-support validator.
3. Build benchmark suites containing known collisions and known exact aggregates.
4. Compare possible augmentations by decision-regret reduction, measurement cost and monitoring burden.
5. Pre-register held-out intervention tests rather than relying on held-out dates from the same regime.
6. Evaluate whether the protocol reduces unsupported claims without rejecting useful low-dimensional models.

## What is in the public package

The [public repository](https://github.com/ipitchford/aggregation-without-sufficiency) and [versioned release](https://github.com/ipitchford/aggregation-without-sufficiency/releases/tag/v0.4.0-preprint) contain the main synthesis, three technical dossiers, site-ready body and metadata, a 16-claim ledger and 37-source identity-audited register, standard-library collision, frozen-licence and sensitivity code, mutation and parity tests, generated receipts, provenance, assurance and the rendered PDF. The archive identity is DOI [10.5281/zenodo.21913278](https://doi.org/10.5281/zenodo.21913278). Exact asset hashes are published with the release and checked across the local package, GitHub and Zenodo.
