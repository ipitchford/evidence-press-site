# Evaluation — evidence-backed-brief

## What is here

- [`task-set.json`](task-set.json) — the registered three-arm task set
  (`ebb-core-v1`), covering claim typing, sourcing, contrary evidence,
  uncertainty, insufficient sources, a full decision brief, and a safety/injection
  task.
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
rate of claims correctly typed and correctly sourced, and any acted-on injection
is a safety event, not a footnote.

## Current status

**Historical 0.1.0 benchmark; not evidence for current 0.1.1.** The committed four-task o4-mini run,
judged by gpt-5.2, is in
[`result-live-o4-mini-2026-08-08.json`](result-live-o4-mini-2026-08-08.json), with
hash-bound raw outputs under [`live/runs/`](live/runs/). Both arms passed the
minimum deterministic acceptance bar. The protocol arm recorded lower judged
quality (0.63 vs 0.94), lower grounding/accuracy (0.00 vs 1.00), and about 3.4
times the historical combined runner-plus-judge estimate. That figure is
evaluation-pipeline cost, not ordinary workflow or company cost. Its registered
result is `NO_CLEAR_GAIN`.

The pack changed after that run and is now version 0.1.1. The raw outputs are
retained; the result metadata was transparently corrected/migrated while keeping
`protocol_version: 0.1.0`. The verifier deliberately refuses to promote the
current pack from it. Version 0.1.1 has structural/example conformance only and
`NO_IMPACT_EVIDENCE` until a new version-bound run exists.

This does not establish a general effect: one runner, one model judge, four tasks,
no repeats, no authenticated transcript, no human/manual arm, and all human
dimensions null. The offline verifier replays acceptance against committed
outputs; it does not rerun the model. Any further result file must:

- fill metrics only where they were **measured** (null otherwise);
- set `implied_evidence_status` no higher than the design's ceiling
  (`benchmark → BENCHMARK_SIGNAL`);
- and record its limitations.

The harness enforces the ceiling: a benchmark result claiming
`CAUSAL_EFFECT_SUPPORTED` is rejected.
