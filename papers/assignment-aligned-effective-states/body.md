## Summary

A useful label for a neuron is not a complete explanation of what a model can do. A label may correctly rank the examples that activate a unit, yet a simple on/off version may discard information needed for the final answer—or for predicting what happens after an input changes.

This study revisits one published transformer trained to solve small Boolean satisfiability problems. Its assignment labels work well as rankings. The limitations appear when those rankings become fixed thresholds, compressed reports or answers to new edit questions. These are different tests, and passing one does not imply passing the others.

## Summary for specialists

The audit retains all 17 source-nominated singleton labels, representing 16 distinct assignments, on a protected 7252-formula bank. Assignment-macro AUROC is 0.991394, while the frozen threshold-fidelity and combined criteria fail. Retrospective analysis identifies a numerical-rank 34 effective post-ReLU state—not an exact algebraic rank certificate—and distinguishes coordinate matching from multivariate prediction and final-readout accounting.

A response-blind fresh bank contains 4096 formulas, balanced between SAT and UNSAT, with ten distinct clauses and historical clause-multiset exclusions. The same checkpoint answers 4087/4096 correctly; assignment-macro AUROC is 0.997477. Unit 81 illustrates the distinction: AUROC 0.991974 accompanies 88/125 positive detections at threshold 0.5. These are different denominators and endpoints, not contradictory results.

## Technical account

The source interpretation associates units with assignments satisfying the input formula. The audit asks separately whether activations rank that semantic property, whether a fixed threshold recovers it, how the observed live coordinates account for the readout, and whether a report predicts a specified replacement of a clause.

On the original bank, nested two-class truth classifiers have reconstructed native-argmax agreement of 7205/7252 from standardised threshold bits and 7221/7252 from standardised continuous state. This retrospective agreement is derived from complete classifier error sets and actual native outputs. It is not a recovered logit model or a classifier evaluated on the fresh bank.

The edit obstruction is exact but narrowly targeted: two formulas can share the relevant current report and truth table while a specified clause replacement produces different Boolean-enumerated outcomes. Clause-level information is missing. This does not prove that every richer neural report fails, or establish a full-bank error floor for native model responses.

## Evidence, assurance and limitations

This is one checkpoint. The fresh bank extends the input-distribution check, not the checkpoint population. It is balanced and history-excluded, not a natural-prevalence IID sample or proof of absence from unknown training data. Native forward measurements, Boolean enumeration, fitted classifiers and recorded historical calculations have separately declared scopes.

The public replay contains 18 stages. Five additional historical stages in the private 23-stage replay are excluded from redistribution because of licensing boundaries; they must not be advertised as publicly executable. Producer-side replay and internal AI-assisted review do not establish external peer review, independent reproduction, formal verification or a general verdict about Already Clean and superposition accounts.

## Relationship to earlier work

Palumbo and colleagues supplied the model, labels and qualitative interpretation. This release adds protected quantitative tests, explicit endpoint distinctions and further checks. The source already permits distribution-dependent approximation errors. The audit therefore refines its evidential scope rather than replacing it with a binary success-or-failure verdict.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Interpretability researchers | Separate ranking, threshold fidelity and intervention claims | One checkpoint does not establish universality |
| Model auditors | Ask what a compressed report actually supports | Semantic labels are not native response measurements |
| Reproducibility researchers | Inspect frozen inputs, native arrays and replay boundaries | Public and private historical scope differ |

## Why the problem matters

Interpretations increasingly guide decisions about model behaviour. An attractive semantic label is useful evidence, but its usefulness depends on the question asked. A method that ranks examples accurately may still be unsuitable for a threshold decision or an edit prediction. Recording those distinctions makes limitations actionable.

## How to inspect or reproduce the recorded checks

Start with the manuscript, AI index and public replay instructions in the evidence package. Check the exact input and checkpoint identities before running the declared 18-stage public route. Native replay requires three separately retrieved, hash-pinned upstream source files; the package does not redistribute them or silently download them during replay. Inspect the fresh-bank freeze, exclusions and native-forward receipts separately from historical classifier agreement. Repeated receipt comparison is not new training or independent checkpoint replication.

## The most valuable next projects

Apply the frozen audit to independently trained checkpoints, with seeds, widths and regularisation contrasts specified before inspecting results. Compare native-axis ranking with multivariate recoverability and measured intervention fidelity; width alone does not discriminate broad theories. A second-host replay would test portability without being confused with a new scientific result.

Short training pilots did not meet the competence criterion and therefore provide no evidence about representational mechanisms.

## What is in the evidence package

The package contains the version 4.8 manuscript, public claim and provenance records, licensed replay inputs and scripts, and the fresh-bank audit. It keeps historical supporting material and redistribution exclusions explicit. Prepared media explains the study and supplies no additional scientific evidence.

Original prose and data are released under CC0; original code is MIT-licensed. Retained upstream material keeps its own terms. These licences do not place the entire archive under CC0. Consult the package rights inventory and external-dependency instructions before reuse.
