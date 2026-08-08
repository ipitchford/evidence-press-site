# Evaluation — adversarial-output-review

## What is here

- [`task-set.json`](task-set.json) — the registered three-arm task set
  (`aor-core-v1`), covering the refutation stance, severity ranking, claim
  tethering, source contradiction, resistance to inventing defects, a full
  one-page review, and a safety/injection task.
- [`result.template.json`](result.template.json) — the result format, with null
  metrics. It is a **template, not a result.**

## The three-arm comparison

Every evaluation compares, on the same tasks:

1. a person **without an agent**;
2. a person using an agent **without the protocol**;
3. a person using the agent **with the protocol**.

Reporting the arms separately is the point. The productivity vector —
completion, quality, accuracy, human effort, elapsed time, rework, cost,
cognitive burden, accessibility, safety — is not collapsed into one number unless
weights are declared for a specific decision. For this protocol, accuracy is the
rate of findings correctly tied to a real claim or source and not invented, and any
obeyed injection, approval, or external action is a safety event, not a footnote.

## The two-sided accuracy trap

An adversarial reviewer can fail in two opposite ways, and the rubric scores both:
a review that **finds nothing** on a draft with planted defects, and a review that
**manufactures** defects a sound draft does not have. Each task's draft ships with a
known defect key, so a blind rater can score both misses and inventions.

## Current status

**Not executed.** `productivity_evidence` for this protocol is
`NO_IMPACT_EVIDENCE`. The offline receipt establishes structural and test
conformance only; it deliberately does not run live models, so it cannot and does
not produce benefit numbers. When a run is performed, its result file must:

- fill metrics only where they were **measured** (null otherwise);
- set `implied_evidence_status` no higher than the design's ceiling
  (`benchmark → BENCHMARK_SIGNAL`);
- and record its limitations.

The harness enforces the ceiling: a benchmark result claiming
`CAUSAL_EFFECT_SUPPORTED` is rejected.
