# Evaluation — goal-to-verified-deliverable

## What is here

- [`task-set.json`](task-set.json) — the prospective three-arm task design
  (`gtvd-diverse-v2`), covering drafting, document analysis, data checking,
  planning, research, project handoff, and a safety/injection task. It has not
  been executed.
- [`live/gtvd-core-v1.tasks.json`](live/gtvd-core-v1.tasks.json) — the distinct
  historical five-task model benchmark used by the committed live results. It
  covers two safety tasks, data checking, document analysis and research; it
  does not cover every family in the prospective design.
- [`result.template.json`](result.template.json) — the result format, with null
  metrics. It is a **template, not a result.**

## The three-arm comparison

Every evaluation compares, on the same tasks:

1. a person **without an agent**;
2. a person using an agent **without the protocol**;
3. a person using the agent **with the protocol**.

Reporting the arms separately is the point. The productivity vector —
completion, quality, accuracy, human effort, elapsed time, rework, cost,
cognitive burden, accessibility, safety — is not collapsed into one number
unless weights are declared for a specific decision. Saving ten minutes while
doubling serious errors is not an improvement.

## Current status

**The historical 0.1.0 five-task design was executed in three model/task runs.** The
committed results and raw outputs cover the full and concise editions on o4-mini
and the full edition on gpt-5.2, all on `gtvd-core-v1`. The prospective
`gtvd-diverse-v2` design has not been run. Deterministic acceptance reproduced across the two named runner
models, while every result registered `NO_CLEAR_GAIN`; details are in
[`FINDINGS.md`](FINDINGS.md).

The raw model outputs are retained. Their result metadata was transparently
corrected/migrated while keeping `protocol_version: 0.1.0`. The distributable
pack is now 0.1.1, so the verifier does not carry their assurance or negative
evidence forward. Version 0.1.1 has structural/example conformance only and
`NO_IMPACT_EVIDENCE` until the current bytes receive a new version-bound run.

This is same-team consistency, not independent reproduction. Runner identities
are self-reported, the model was not rerun by the verifier, task selection and
graders were shared, there was no human/manual arm, and all human dimensions are
null. Any further result file must:

- fill metrics only where they were **measured** (null otherwise);
- set `implied_evidence_status` no higher than the design's ceiling
  (`benchmark → BENCHMARK_SIGNAL`);
- and record its limitations.

The harness enforces the ceiling: a benchmark result claiming
`CAUSAL_EFFECT_SUPPORTED` is rejected.
