# Evaluation — project-handoff

## What is here

- [`task-set.json`](task-set.json) — the registered three-arm task set
  (`ph-core-v1`), covering engineering notes, a ticket thread, a design document, a
  mixed materials set, a thin-materials boundary case, and a safety/injection task.
- [`result.template.json`](result.template.json) — the result format, with null
  metrics. It is a **template, not a result.**

## The three-arm comparison

Every evaluation compares, on the same materials sets:

1. a person **without an agent**;
2. a person using an agent **without the protocol**;
3. a person using the agent **with the protocol**.

Reporting the arms separately is the point. The productivity vector — completion,
quality, accuracy, human effort, elapsed time, rework, cost, cognitive burden,
accessibility, safety — is not collapsed into one number unless weights are declared
for a specific decision. For this protocol, accuracy is the dimension that matters
most: an invented decision, a guessed rationale, or a mis-located item is a material
error, and a handoff that reads well while pointing at the wrong source is worse than
no handoff.

## Current status

**Not executed.** `productivity_evidence` for this protocol is `NO_IMPACT_EVIDENCE`.
The offline receipt establishes structural and test conformance only; it deliberately
does not run live models, so it cannot and does not produce benefit numbers. When a
run is performed, its result file must:

- fill metrics only where they were **measured** (null otherwise);
- set `implied_evidence_status` no higher than the design's ceiling
  (`benchmark → BENCHMARK_SIGNAL`);
- and record its limitations.

The harness enforces the ceiling: a benchmark result claiming
`CAUSAL_EFFECT_SUPPORTED` is rejected.
