# Governance — the protocol foundry

This library is a **foundry**, not an uncurated marketplace. A clever prompt is
not enough to be published here. This document defines what a protocol must
contain, the gates it passes through, and how it is revised or retired.

## The lifecycle

```
workflow need
  → proposal            (a real, recurring friction someone actually has)
  → specification       (protocol.yaml against the schema + kernel)
  → skill implementation(SKILL.md + templates + scripts)
  → task tests          (synthetic positive/failure cases + at least one real task)
  → adversarial + security review
  → comparative evaluation (the three-arm design)
  → release             (status set no higher than the evidence justifies)
  → field reports       (measured, not testimonial)
  → revision or deprecation
```

## What a submission must contain

A protocol is not accepted merely because it contains a useful prompt. It must
ship:

- a precise **task definition** (`purpose`, `use_when`, `do_not_use_when`);
- at least one **positive test** and at least one **failure or boundary test**;
- **declared permissions** and an explicit **prohibited-actions** list;
- an **example input and output** (a worked example under `examples/`);
- **compatibility information** (`required_capabilities`, `tested_models`);
- a **licence** (CC0 for prose, Apache-2.0 for code);
- and a **claim no stronger than its evidence** — `productivity_evidence` set
  honestly, prose that does not exceed it.

A submission missing any of these is incomplete, not "draft-quality." The
validator and hostile-test suite mechanise most of these checks.

## Review gates

Each gate corresponds to a rung on the [protocol-assurance
ladder](status/protocol-assurance.json) and is recorded in the receipt.

| Gate | Advances to | Who/what |
|---|---|---|
| Structure | `STRUCTURE_VALIDATED` | `tools/validate.js` + manifest match |
| Example conformance (offline) | `EXAMPLE_CONFORMANCE_VALIDATED` | `tools/eval-harness.js --tests` — shipped examples pass their graders; no model runs |
| Live task set | `TASKSET_PASSED` | a recorded live run over the task set whose fresh outputs pass the acceptance tests |
| Cross-model | `CROSS_MODEL_REPRODUCED` | task set run under ≥2 models, consistent |
| Security | `SECURITY_REVIEWED` | `tools/hostile-tests.js` + a recorded human review |
| Field | `FIELD_READY` | all gates + copy-and-run edition + no open critical defect |

The evidence ladder does **not** advance through these gates. It advances only
through evaluation, and never past the ceiling its design allows (a benchmark can
support `BENCHMARK_SIGNAL`, no more).

## Separation of doer and checker

At the Institutional assurance level, the agent that produces a protocol's output
is not the sole judge of it. Adversarial review is framed to **refute**, not
confirm, and its findings are treated as hypotheses to verify against the current
state — not as verdicts to act on blindly. A clean adversarial pass is evidence,
not proof.

## Revision

Any change to `procedure`, `permissions`, or `acceptance_tests` bumps the
protocol's semantic version and re-opens the gates from `STRUCTURE_VALIDATED`.
`retest_triggers` in `protocol.yaml` list the external events (model
deprecation, tool API change) that invalidate the current verification and force
a re-run.

## Deprecation

A protocol moves to `DEPRECATED` when a maintainer decides it is superseded, a
security withdrawal is required, or a retest trigger fires and the protocol no
longer survives. Deprecated protocols are **kept**, marked, and withdrawn from
active recommendation — never silently deleted. A serious vulnerability triggers
immediate withdrawal from the registry ahead of the full deprecation record.

## Negative results

`NO_CLEAR_GAIN` and `HARM_OR_REGRESSION_FOUND` are published outcomes. A protocol
that was evaluated and did not help is more informative than one never measured,
particularly when the workflow looked intuitively promising. Removing negative
results would bias the whole library toward flattering conclusions — exactly the
failure the two-ladder design exists to prevent.
