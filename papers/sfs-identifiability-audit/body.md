## Summary

**The problem.** A site-frequency spectrum (SFS) is a compact histogram of genetic variation in a sample of genomes. Population geneticists use it to reconstruct how population size has changed through time, and those reconstructions feed narratives about ancient bottlenecks and expansions.

**What limits it.** Even if its expected entries were known perfectly, the spectrum would reveal only finitely many exponential averages of population history. A fitted demographic curve can contain much more detail than those averages, but that extra detail comes from the chosen model or regularisation, not from the finite expected spectrum alone.

**The question asked.** This corrected release asks a target-specific question: can the spectrum determine mean population size inside a fixed **calendar-time** window? Under the paper's neutral one-population coalescent model and declared broad positive history class, it cannot. Calendar time must be recomputed separately for every candidate history; a fixed interval in transformed coalescent time is not a fixed historical interval.

**The explicit example.** The paper supplies two strictly positive histories with exactly the same finite expected spectrum. For the same dimensionless illustrative calendar windows, their target ratios are approximately 0.441 and 1.794. One represents a depression relative to the reference window; the other represents an expansion. The expected spectrum alone therefore cannot license either directional narrative.

**What is new, and what is not.** A priority audit found that the underlying non-identifiability mechanism is already in the literature (see *Priority correction* below). The release contributes a target-specific sharp-window formalisation, a bounded proof, an exact opposite-target witness and a folded-spectrum statement.

**Status.** An anonymous, unrefereed candidate with producer-side replay; no unaffiliated reproduction, formal verification, specialist acceptance or editorial peer review.

## Summary for specialists

Under the stated neutral, panmictic Kingman and infinite-sites assumptions, the expected unfolded SFS for a finite sample is an invertible linear transform of finitely many coalescence moments. Those moments are Laplace coordinates of the transformed population-size history at the lineage rates.

The central theorem considers a fixed calendar window, maps its endpoints back through each history's inverse coalescent-time transformation, and asks whether the corresponding mean—or a ratio of two distinct window means—is constant on every expected-SFS fibre. Over an admissible class containing an `L-infinity` neighbourhood of a positive constant history, with fixed scale and a common known tail, the answer is no for every finite sample size.

The folded-SFS theorem: in the exact unnormalised expected spectrum, folding retains precisely the even coalescence moments, so for essentially bounded weights on the declared finite horizon the identified linear functionals are exactly the span of the corresponding even exponential kernels.

This is an exact expected-summary result. It does not say that every restricted parametric demographic family is unidentifiable, or that two histories with the same expected SFS have the same linked-sequence law.

## Technical account

**Why the calendar window escapes.** At the constant history, the derivative of a sharp calendar-window mean has a step-function weight. The expected SFS observes only a finite span of continuous exponential kernels. Projecting that step weight away from the observed span produces a target-changing, observation-null direction. A separate composition lemma controls the history-dependent inverse map, including windows that begin at calendar time zero.

### An explicit opposite-target collision

For three sampled haplotypes, the package uses

$$
g(\tau)=4e^{-\tau}-15e^{-2\tau}+12e^{-3\tau},
$$

whose Laplace transform vanishes at both relevant lineage rates. The histories

$$
h_\pm(\tau)=1\pm\frac45g(\tau)
$$

are strictly positive and have exactly the same expected unfolded SFS—and therefore the same folded SFS. Yet their ratios for claim window `[0.3, 0.6]` and reference window `[0, 0.1]` are 0.4411819836 and 1.7935760644.

The construction uses dimensionless illustrative windows. It is not a rescaling of the proposed 813–930 ka human bottleneck and is not an estimate of human population history.

### What folding retains

Conventional folding discards the ancestral-versus-derived orientation of each variant. In the exact unnormalised expected spectrum, the paper proves that folding retains precisely the even coalescence moments. For essentially bounded weights on the declared finite horizon, the identified linear functionals are therefore exactly the span of the corresponding even exponential kernels.

An exact five-haplotype direction changes the unfolded expected spectrum while leaving the folded expected spectrum unchanged. This is a structural identification statement, not a claim that finite data can estimate every retained coordinate stably.

### Exact fibres and first-order information are different

The paper also develops a first-order information calculation for a declared fixed-covariance Gaussian tangent experiment. It shows that known linear compression cannot increase regular target information. This local quadratic result is useful for designing augmentations, but it is not promoted to an exact nonlinear identification theorem.

Joint spectra, linkage-aware summaries, ancient DNA, fossils or other external measurements may restore a contrast destroyed by a marginal SFS. Whether they do so is target- and model-specific. The current package contains no reconstructible joint-SFS numerical example and makes no numerical joint-information claim.

## Evidence, assurance and limitations

The tagged package passes:

- 120 deterministic tests under ordinary Python;
- exception-based replay under optimized Python;
- exact calendar-collision and folded-rank receipt checks;
- 11 hostile mutation or negative controls plus one clean comparison;
- two same-producer expected-SFS forward routes;
- a 72-file SHA-256 inventory;
- fresh-extraction replay from the immutable commit; and
- two consecutive byte-identical PDF builds, followed by PDF structural and every-page visual inspection.

The PDF was rebuilt with readable tables and publication-scale figures. The scholarly creator is Anonymous. Research-direction, repository and publication roles remain available in machine-readable provenance. The active release metadata contains no personal-channel video.

These checks establish bounded producer-side internal consistency, replay and artifact identity. They do not establish theorem truth, unaffiliated reproduction, independent reimplementation, formal verification, specialist acceptance, editorial peer review, bibliographic priority or scientific impact.

### What the result does not establish

The result does not establish equality of complete linked-sequence laws, history-dependent count covariances or higher moments. It does not reanalyse human genomic data, validate an empirical error model, reconstruct a joint-SFS example or adjudicate the proposed ancient human bottleneck.

Restricted demographic families may be identifiable when their assumptions are accepted and the sample size is sufficient. This theorem instead concerns a broad positive class and asks which target is licensed by the finite exact expected summary itself.

## Priority correction

The formula-first priority audit materially narrows the originality claim. Myers, Fefferman and Patterson (2008) already distinguish calendar and genetic time, construct positive calendar-time histories with the same allelic spectrum, describe invisible bottlenecks and expansions, and interpret the observation as projections onto exponential kernels. Bhaskar and Song (2014) provide the finite Laplace coordinates, the bridge to the expected SFS, scale equivalence, restricted-family identifiability and folded parity.

The release therefore does **not** claim to discover demographic non-identifiability, the calendar/genetic-time mechanism, exponential projection structure or finite-Laplace observation. Its defensible object is a target-specific sharp-window formalisation, a bounded proof with explicit function-class conditions, an exact opposite-target witness, an integrated folded-functional statement and a fail-closed assurance package.

The audit is targeted and non-systematic. It does not establish absolute priority for that assembled formulation.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Population geneticists reading SFS-based demographic reconstructions | A concrete reason to ask which calendar-time feature of a fitted curve is licensed by the spectrum and which by the model or regularisation | The theorem concerns a broad positive class; restricted families may be identifiable when their assumptions are accepted |
| Developers of demographic-inference methods | The first-order information calculation and the folded-functional statement help in designing which augmentation (joint spectra, linkage, ancient DNA, external data) should remove which target-changing direction | No joint-SFS numerical example or joint-information claim is supplied |
| Theorists of identifiability | A bounded proof with explicit function-class conditions and an exact positive witness | The underlying mechanism is prior work (Myers, Fefferman and Patterson 2008; Bhaskar and Song 2014) |

## Why the problem matters

Claims about severe ancient population events, such as the proposed 813–930 ka human bottleneck, are calendar-time statements. If two strictly positive histories share an exact expected spectrum while one shows a depression and the other an expansion in the same window, then the direction of such a narrative cannot come from the expected spectrum alone. It has to be carried by the model class, by regularisation, or by additional data. The release does not adjudicate the bottleneck; it states which target the finite exact summary can and cannot license.

## How to inspect or reproduce the recorded checks

Read `manuscript/what_finite_expected_spectrum_can_identify.pdf` (or its accessible Markdown source), then `CLAIMS.json` for claim boundaries and evidence links. To replay:

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.lock
python3 -m pip install -e .
python3 examples/run_all.py
PYTHONPATH=src python3 -m pytest -q
PYTHONPATH=src python3 -O examples/run_all.py
python3 -O tools/check_receipt.py
tools/build_manuscript.sh
python3 tools/package_manifest.py
```

`REPLAY_RECEIPT.md` records the environment and the result of each gate.

## The most valuable next projects

The highest-priority next steps are an unaffiliated clean-archive rerun, a genuinely independent implementation, verified population-genetics and functional-analysis reviews, proof-assistant formalisation and a systematic citation-graph priority audit.

Empirically, a useful study would prospectively freeze one primary calendar-time target, use common processed data, estimate genomic-block covariance and predeclare which linked or external augmentation is expected to eliminate which target-changing direction. A severe-event narrative should survive only if its conclusion remains stable over the resulting shared compatibility set.

## What is in the evidence package

- `manuscript/what_finite_expected_spectrum_can_identify.pdf` and `.md`: the publication PDF and its accessible source.
- `CLAIMS.json`: claim boundaries and evidence links.
- `CITATION_AUDIT.md`, `PRIORITY_TARGET.yaml` and `PRIORITY_SEARCH.md`: primary-source bridge verification and the formula-first priority audit.
- `reviews/` with `RESPONSE_TO_REVIEW_2026-08-20.md` and `RESPONSE_TO_REVIEW.md`: frozen reviews and their disposition.
- `ASSURANCE.md`, `STATUS.md`, `PROVENANCE.md` and `CORRECTIONS.md`: status and lineage.
- Source code, examples, tests, figures, `REPLAY_RECEIPT.md` and the SHA-256 inventory.

## Additive correction history

The v0.2.0 and v0.2.1 GitHub tags, DOI records and historical correction evidence remain immutable. Version 0.3.3 is an additive successor. It replaces the active page's old theorem-and-audit synthesis with the evidence actually shipped in the current package, corrects the priority boundary, applies Anonymous scholarly authorship, repairs the PDF presentation and removes the personal-channel video links from current release metadata.
