## Summary

**The setting.** Interpretability research tries to explain what the parts of a neural network are doing — for example, by giving a neuron a label such as "this unit fires when the input satisfies assignment X". An informal research essay, Cammarata's *Neural Networks Are Already Clean*, argues that a network's native neurons are often legible building blocks of this kind. A label can be good evidence, but it answers some questions better than others.

**The question.** A useful label for a neuron is not a complete explanation of what a model can do. A label may correctly rank the examples that activate a unit, yet a simple on/off version may discard information needed for the final answer — or for predicting what happens after an input changes. This study asks what *additional* uses one published neuron interpretation actually supports.

**What was studied.** One published transformer trained by Palumbo and colleagues to solve small Boolean satisfiability problems (five variables, ten two-literal clauses: "2-SAT"), together with their published labels for its units.

**What was found.** Its assignment labels work well as rankings. The limitations appear when those rankings become fixed thresholds, compressed reports or answers to new edit questions. These are different tests, and passing one does not imply passing the others. In particular, an exact example shows that two inputs can look identical to the published report — and even have the same truth table — while a specified edit to one clause gives them different outcomes, so clause-level information is missing from that report.

**What it does not show.** This is a case study of a single checkpoint. It is compatible with both the "already clean" account and superposition accounts, and it is not a verdict on either.

**Status.** An anonymous, AI-assisted, unrefereed candidate with producer-side replay; it has not been externally peer reviewed, independently reproduced or formally verified.

## Summary for specialists

The audit retains all 17 source-nominated singleton labels, representing 16 distinct assignments, on a protected 7252-formula bank. Assignment-macro AUROC is 0.991394, while the frozen threshold-fidelity and combined criteria fail. Retrospective analysis identifies a numerical-rank 34 effective post-ReLU state — not an exact algebraic rank certificate — and distinguishes coordinate matching from multivariate prediction and final-readout accounting.

A response-blind fresh bank contains 4096 formulas, balanced between SAT and UNSAT, with ten distinct clauses and historical clause-multiset exclusions. The same checkpoint answers 4087/4096 correctly; assignment-macro AUROC is 0.997477. Unit 81 illustrates the distinction: AUROC 0.991974 accompanies 88/125 positive detections at threshold 0.5. These are different denominators and endpoints, not contradictory results.

| Question | Finding and scope |
|---|---|
| Do the published singleton labels rank cases? | Yes on the protected bank: all three pre-specified ranking gates pass (assignment-macro AUROC 0.991; unit range 0.961–1.000) |
| Do they give faithful events at the source threshold 0.5? | No under the frozen criteria: a threshold-specificity guard fails for two units and is shared with the fidelity criterion; four units also fail at least one positive fidelity cell |
| Is the effective final-MLP state assignment-aligned? | The 34 source-nominated units of the nominal 512 form the bank-effective numerical-rank-34 state; native matching exceeds 63 fixed full-space rotations and positive mixtures, while a 34-component NMF slightly improves matching (0.986 versus 0.984) and recovers 32 native axes |
| How does the readout use the state? | Every live report unit has a positive SAT-minus-UNSAT coefficient; the readout sums graded positive SAT evidence. Fixed-readout threshold substitution gives 98.15% task accuracy; separately fitted state-only truth classifiers give 99.12% from bits and 99.64% from continuous values |
| Does the report determine clause-edit outcomes? | No: an exact collision shows that neither the bit report nor the complete current truth table determines every Boolean-enumerated clause-replacement outcome |

## Technical account

**Three levels of claim.** The paper separates *legibility* (does a unit respond in accordance with a proposed label?), *operational sufficiency* (does the resulting report retain enough information, under a declared decoder and context, to answer a new question?) and *causal mechanism* (does an intervention follow the natural computational route?). A result at one level does not settle the others.

**The four tests.** The source interpretation associates units with assignments satisfying the input formula. The audit asks separately whether activations rank that semantic property, whether a fixed threshold recovers it, how the observed live coordinates account for the readout, and whether a report predicts a specified replacement of a clause.

**Why assignment-shaped units are plausible.** Five-variable SAT can be written as an OR over 32 assignments, each satisfying a conjunction of clause-absence conditions. A graded nonnegative code related to those assignments, followed by a positive readout, is therefore compatible with the task's logical structure and the source's weighted-count interpretation. The paper treats this as an explanatory alternative, not an identified training cause.

**Readout accounting.** On the original bank, nested two-class truth classifiers have reconstructed native-argmax agreement of 7205/7252 from standardised threshold bits and 7221/7252 from standardised continuous state. This retrospective agreement is derived from complete classifier error sets and actual native outputs. It is not a recovered logit model or a classifier evaluated on the fresh bank.

**The edit obstruction.** It is exact but narrowly targeted: two formulas can share the relevant current report and truth table while a specified clause replacement produces different Boolean-enumerated outcomes. Clause-level information is missing. This does not prove that every richer neural report fails, or establish a full-bank error floor for native model responses.

## Evidence, assurance and limitations

- **One checkpoint.** The fresh bank extends the input-distribution check, not the checkpoint population. It is balanced and history-excluded, not a natural-prevalence IID sample or proof of absence from unknown training data. Native forward measurements, Boolean enumeration, fitted classifiers and recorded historical calculations have separately declared scopes.
- **Protected versus retrospective.** "Protected" means the finite inputs, selection rule, primary criteria and analysis code were fixed internally before checkpoint responses were generated; this is chronology evidence, not external preregistration. Many full-layer and geometry analyses were designed after the protected result was opened and do not acquire protected status.
- **Replay scope.** The public replay contains 18 stages. Five additional historical stages in the private 23-stage replay are excluded from redistribution because of licensing boundaries; they must not be advertised as publicly executable.
- **Review.** Producer-side replay and internal AI-assisted review do not establish external peer review, independent reproduction, formal verification or a general verdict about Already Clean and superposition accounts.

## Relationship to earlier work

Palumbo and colleagues supplied the model, labels and qualitative interpretation. This release adds protected quantitative tests, explicit endpoint distinctions and further checks. The source already permits distribution-dependent approximation errors. The audit therefore refines its evidential scope rather than replacing it with a binary success-or-failure verdict. It does not attempt a census of clean neurons or adjudicate whether recursive generalisation explains most polysemanticity.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Interpretability researchers | Separate ranking, threshold fidelity and intervention claims | One checkpoint does not establish universality |
| Model auditors | Ask what a compressed report actually supports | Semantic labels are not native response measurements |
| Reproducibility researchers | Inspect frozen inputs, native arrays and replay boundaries | Public and private historical scope differ |

## Why the problem matters

Interpretations increasingly guide decisions about model behaviour. An attractive semantic label is useful evidence, but its usefulness depends on the question asked. A method that ranks examples accurately may still be unsuitable for a threshold decision or an edit prediction. Recording those distinctions makes limitations actionable.

## How to inspect or reproduce the recorded checks

Start with the manuscript (`paper.pdf`, then `supplement.pdf`), the AI index and the public replay instructions in the evidence package. Check the exact input and checkpoint identities before running the declared 18-stage public route. Native replay requires three separately retrieved, hash-pinned upstream source files; the package does not redistribute them or silently download them during replay. Install the three environments in `environments/`, retrieve the external sources explicitly, then run the replay into a new directory outside the extracted archive:

```sh
python setup_external.py --output /absolute/external/sources
python reproduce.py --output /absolute/new/output \
  --upstream-directory /absolute/external/sources \
  --analysis-python /absolute/analysis/python \
  --scientific-python /absolute/scientific/python \
  --native-python /absolute/native/python
```

Read the resulting receipt for actual success; a configured target is not a result. Inspect the fresh-bank freeze, exclusions and native-forward receipts separately from historical classifier agreement. Repeated receipt comparison is not new training or independent checkpoint replication.

## The most valuable next projects

1. **Other checkpoints.** Apply the frozen audit to independently trained checkpoints, with seeds, widths and regularisation contrasts specified before inspecting results.
2. **Beyond coordinate matching.** Compare native-axis ranking with multivariate recoverability and measured intervention fidelity; width alone does not discriminate broad theories.
3. **Portability.** A second-host replay would test portability without being confused with a new scientific result.

Short training pilots did not meet the competence criterion and therefore provide no evidence about representational mechanisms.

## What is in the evidence package

The package contains the version 4.8 manuscript and supplement, public claim and provenance records, licensed replay inputs and scripts, and the fresh-bank audit. It keeps historical supporting material and redistribution exclusions explicit. Prepared media explains the study and supplies no additional scientific evidence.

Original prose and data are released under CC0; original code is MIT-licensed. Retained upstream material keeps its own terms. These licences do not place the entire archive under CC0. Consult the package rights inventory and external-dependency instructions before reuse.
