## Plain-English summary

A model can produce one stable answer for two very different reasons. The observations may genuinely distinguish it from every relevant alternative. Or the calculation may contain a rule that chooses one answer from several observationally compatible possibilities. That rule might be a prior, a constraint, a penalty, a calibration target, a coordinate convention or an algorithmic tie-breaker.

This synthesis compares that distinction across four fields: age–period–cohort analysis, epidemic severity and ascertainment, sign-restricted structural vector autoregressions, and aerosol forcing versus climate sensitivity. The mathematical mechanisms are not identical. The first three contain exact invariances in the simplified observation maps analysed. The climate case is a weak or practical ridge within a model and observation regime, not a universal exact symmetry.

The practical output is a **Selector Ledger**. It asks analysts to record what the observations identify, what remains unresolved, which rules narrow that uncertainty, where those rules came from, and which conclusions survive other defensible choices. The point is not to prohibit priors, regularisation, restrictions or calibration. It is to stop their contribution being silently attributed to the data.

> **Candidate status:** anonymous author(s) · unrefereed candidate · producer-side checks passed · no unaffiliated rerun, independent reimplementation, formal verification, external field-specialist review or editorial peer review.

## The central claim or finding

Let \(\theta\) denote a structural state and let \(P_\theta\) be the distribution of observations under a fixed model and observation regime. Full-parameter identification requires the forward map

$$
\theta \longmapsto P_\theta
$$

to be injective. If distinct states satisfy \(P_\theta=P_{\theta'}\), repeated sampling from the same unchanged observation regime cannot distinguish them. A procedure can nevertheless return a unique point, distribution or narrower set by applying a **selector** to the observational equivalence class.

The paper’s central claim is semantic rather than theorem-new: a unique computational answer must not be described as observation-identified unless the relevant target is invariant across the admitted alternatives or the additional narrowing assumptions and evidence are named. In shorthand,

$$
\text{unique output}\;\not\Rightarrow\;\text{identified structural answer}.
$$

Conditional identification is treated as a separate maintained-assumptions axis. Exact nonidentification, set identification, weak identification and practical identification describe the geometry or information in the stated observation problem. Conditionality describes the restrictions, external evidence or model family under which any resulting claim holds; it is not a fifth geometric rung.

## How the result works

Each case is rewritten as an observation map, an unresolved direction, and a narrowing rule.

| Case | Information status in this synthesis | Typical selector | What remains defensible |
|---|---|---|---|
| Age–period–cohort | Exact null direction for linear drift | Generalised inverse or equality constraint | Curvature, deviations, identified combinations and assumption-indexed bounds |
| Epidemic severity/ascertainment | Exact product scaling in the toy map; richer models may have practical ridges | Severity, detection, delay and initial-condition priors | Observed trajectories, identified products and conclusions conditional on the observation model |
| Sign-restricted SVAR | Exact rotation invariance of the reduced form; structural responses are set-identified under signs | Rotation measure, prior and representative-draw rule | Reduced-form learning and the restriction-defined response set |
| Aerosol forcing/climate sensitivity | Weak or practical, model-conditional ridge | Calibration targets, parameter priors, ensemble filters and model weights | Multi-line constraints stated relative to the model family and evidence-dependence assessment |

The common diagnostic follows four tests. The **invariance test** asks whether the headline quantity changes while the observable law or accepted fit stays fixed. The **provenance test** traces every narrowing rule to focal observations, external evidence, substantive restrictions, convenience or decision preference. The **sensitivity test** varies defensible selectors directly. The **design test** checks whether a proposed new observation responds to the unresolved direction; a redundant observation is included as a negative control.

The Selector Ledger makes those questions machine-readable. It records the estimand, forward map, equivalence class or ridge, identified content, selector, empirical status of that selector, sensitivity obligation, rank-restoring observations and permitted reporting language.

## What is classical, and what is offered here

The underlying mathematics is established. Inverse-problem theory separates existence, uniqueness and stability. Econometrics distinguishes several meanings of identification and has mature literatures on partial identification, nonidentified Bayesian models and set-identified SVARs. APC aliasing, epidemic observation-process confounding, rotation uncertainty and aerosol–response compensation are all diagnosed inside their respective fields.

The identification ladder itself is therefore not claimed as a new contribution. The candidate increment is narrower:

- a deliberately heterogeneous four-case comparison that preserves the exact-versus-practical distinction;
- a cross-case taxonomy of five evidential upgrades: coordinate-to-cause, prior-to-data, restriction-to-discovery, calibration-to-validation and precision-to-identification;
- a Selector Ledger with a strict JSON Schema and four populated records;
- a four-test publication gate connecting diagnosis to sensitivity and observation design; and
- a coded 16-record audit instrument whose high, medium and low categories are published for challenge.

The bounded prior-art search did not locate this exact combination, but absence from that search cannot establish novelty or priority. Lewbel’s identification taxonomy, Fry and Pagan’s critique of sign-restricted SVARs, Knutti’s analysis of compensating climate-model fits, and other cited work substantially predate the synthesis.

## Evidence and audit trail

The public package is designed to bind the claims to inspectable materials. It contains the manuscript and accessible source, a SHA-256 source manifest for four privately retained frozen analyses, the literature matrix and search log, the coded audit CSV, the Selector Ledger and schema, deterministic toy calculations, negative controls, review reports, machine-readable claims and a complete manifest. The raw source exports are excluded because they contain private workspace identifiers and expired signed object-storage URLs; their hashes preserve the frozen-input boundary without republishing those bytes.

The audit uses maximum-variation selection, not probability sampling. It contains four records per field: foundational or applied examples, methodological criticism, and constructive remedies. The coding rubric distinguishes:

- **high risk**, where a headline or main table invites a substantive reading that the admitted observation map does not support and the selector boundary is not sufficiently carried into interpretation;
- **medium risk**, where the selector is disclosed but a representative or conditional result can still be read as more data-selected than it is; and
- **low risk**, where the equivalence, restriction or conditionality is explicit and the reporting object respects it.

One record is coded high: the centred intrinsic-estimator application in the supplement to Romero-Olóriz and colleagues. Five are medium and ten low. Those counts are properties of the purposive sample only. They are not prevalence estimates, field rankings or judgements of the papers as wholes.

The executable examples test four encoded propositions: an APC drift transformation, an epidemic product scaling, an orthogonal rotation, and the rank of a toy climate sensitivity matrix. Each has a cause-specific negative control. Normal and optimised Python runs, schema validation and manifest readback are producer-side falsification checks. They do not reproduce the cited empirical studies or establish that the simplified maps contain every scientifically relevant mechanism.

## What the result does not establish

- It does not prove a new identification theorem or establish priority for the generic observation-map framework.
- It does not say that the four empirical systems share one exact symmetry. The aerosol–climate case is deliberately weaker and model-conditional.
- It does not estimate how often applied research overstates identification, compare the quality of fields, or justify criticism of researchers as a class.
- It does not determine whether a substantive prior, restriction, calibration target or model family is true. That remains a scientific judgement requiring external evidence.
- It does not show that the Selector Ledger reduces errors, review time or policy mistakes in use.
- It has not been independently rerun, reimplemented, formally verified, reviewed by external specialists or conventionally peer reviewed.

The phrase “poor applied research” names a claim–evidence mismatch, not mathematical incompetence. A study can contain one selector-dependent interpretation while making valuable descriptive, predictive or design contributions elsewhere.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Applied researchers and reviewers | Separate observation-supported conclusions from prior-, restriction-, penalty- or calibration-supported conclusions before publication. | The ledger cannot decide whether a domain assumption is scientifically warranted. |
| Statisticians, econometricians and inverse-problem researchers | Translate mature identification ideas across field-specific vocabularies and expose selector sensitivity. | The four-case comparison is illustrative, not a systematic review or new theorem. |
| Research agents and tool builders | Check that abstracts, press copy and machine records preserve the same assumption and assurance boundary as the technical analysis. | Structural conformance and replay do not validate the semantic map or empirical model. |
| Policy and scientific decision-makers | Ask whether an action is robust across the supported set and whether new measurements would change the decision. | Nonidentification is not a zero effect, and point identification is not always necessary for a robust decision. |
| Interested non-specialists | Understand why stable software output can still depend on assumptions that the data do not test. | Candidate status is not expert consensus or a judgement that the cited studies are worthless. |

## How to reproduce the recorded checks

From a fresh checkout of the tagged research repository, run:

```sh
python3 -m pip install -r requirements-dev.txt
python3 reproducibility/verify_examples.py
python3 -O reproducibility/verify_examples.py
python3 -c 'import json, jsonschema; jsonschema.validate(json.load(open("reproducibility/selector-ledger.json")), json.load(open("reproducibility/selector-ledger.schema.json"))); print("PASS")'
shasum -a 256 -c MANIFEST.sha256
```

The expected result is a passing ordinary and optimised toy-check receipt, successful Selector Ledger schema validation and a complete SHA-256 readback. The repository README documents the exact environment and package boundary. These commands establish only that the archived bytes and encoded checks behave as recorded.

## The most valuable next projects

The highest-value next step is external semantic review, not a larger producer-side toy grid. One specialist from each field should assess whether the stated observation map, selector and restorative evidence accurately represent the domain literature. An unaffiliated researcher should also run the immutable package and report failed as well as successful checks.

A prospective study could then apply the Selector Ledger to analyses that did not shape it. Multiple coders should use the published rubric, disagreements should be retained, and the study should measure whether the ledger changes headline claims or observation designs. That would test usability and reliability; it would still require a separate design to estimate effects on research quality or decision outcomes.

Methodologically, useful extensions include tools that separate likelihood curvature from selector curvature, robust decision analyses over selector-indexed sets, and experiment-design procedures that target the unresolved singular direction. None should be described as automatic semantic validation.

## What is in the public package

The release contains the manuscript PDF and source, a source manifest for four privately retained frozen analyses, literature and search records, the 16-record audit and coding rubric, a four-record Selector Ledger with JSON Schema, standard-library Python checks and negative controls, replay receipts, claim and review records, licences and a complete checksum manifest. The raw source exports are not public. The exact candidate tarball, PDF and SHA256SUMS are published under the immutable GitHub tag and Zenodo DOI, and producer-side downloads from both hosts matched their recorded SHA-256 values. Availability therefore passes at the byte level; that does not establish an unaffiliated rerun or validate the scientific mappings. The Evidence Press page and audio are communication surfaces, not additional research evidence.
