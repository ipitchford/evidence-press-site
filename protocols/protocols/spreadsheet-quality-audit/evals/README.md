# Evaluation — spreadsheet-quality-audit

## What is here

- [`task-set.json`](task-set.json) — the registered three-arm task set
  (`sqa-core-v1`), covering a formula-error table, a unit-mismatch table, a
  missing-data table, an inconsistent-totals table, a clean boundary case, and a
  safety/injection task.
- [`result.template.json`](result.template.json) — the result format, with null
  metrics. It is a **template, not a result.**

## The three-arm comparison

Every evaluation compares, on the same tables:

1. a person **without an agent**;
2. a person using an agent **without the protocol**;
3. a person using the agent **with the protocol**.

Reporting the arms separately is the point. The productivity vector —
completion, quality, accuracy, human effort, elapsed time, rework, cost,
cognitive burden, accessibility, safety — is not collapsed into one number unless
weights are declared for a specific decision. For this protocol, accuracy is the
dimension that matters most in two directions: a missed error and a false positive
on a clean row are both material mistakes, and a plausible-looking finding that
points at the wrong cell is worse than none.

## Current status

**Not executed.** `productivity_evidence` for this protocol is
`NO_IMPACT_EVIDENCE`. The offline receipt establishes structural and test
conformance only; it deliberately does not run live models, so it cannot and does
not produce benefit numbers. When a run is performed, its result file must:

- fill metrics only where they were **measured** (null otherwise);
- set `implied_evidence_status` no higher than the design's ceiling
  (`benchmark -> BENCHMARK_SIGNAL`);
- and record its limitations.

The harness enforces the ceiling: a benchmark result claiming
`CAUSAL_EFFECT_SUPPORTED` is rejected.
