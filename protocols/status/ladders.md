# Two ladders, never one badge

A protocol carries two status values that must not be merged. The first asks
**what was checked, and what bounded readiness those checks support**. The second asks whether it
**actually improves the work**. These are different questions with different
evidence, and a single "quality" badge that tried to answer both would lie about
at least one of them.

- **[Protocol assurance](./protocol-assurance.json)** — structure, testing,
  recorded review and bounded trial readiness. `DRAFT → STRUCTURE_VALIDATED → EXAMPLE_CONFORMANCE_VALIDATED →
  TASKSET_PASSED → CROSS_MODEL_REPRODUCED → SECURITY_REVIEWED → FIELD_READY`,
  with `DEPRECATED` off to the side. The rung names are deliberately literal:
  `EXAMPLE_CONFORMANCE_VALIDATED` means the pack's own shipped examples pass its
  graders offline; `TASKSET_PASSED` means a model actually ran the protocol over
  fresh tasks. They are not the same, so they are not named the same.
- **[Productivity evidence](./productivity-evidence.json)** — measured benefit.
  `NO_IMPACT_EVIDENCE → BENCHMARK_SIGNAL → CONTROLLED_USER_SIGNAL → FIELD_SIGNAL
  → CAUSAL_EFFECT_SUPPORTED`, with `NO_CLEAR_GAIN` and `HARM_OR_REGRESSION_FOUND`
  as findings.

## Why they are independent

The two failures they guard against are unrelated:

- A protocol can execute **flawlessly and still waste your time.** It passes
  every test, leaks nothing, runs on any model — and takes twice as long as
  doing the task by hand. High assurance, no benefit.
- A protocol can be **genuinely useful but poorly packaged.** The method saves
  an hour a day, but it has no failure tests and its permissions are undeclared.
  Real benefit, low assurance.

Collapsing the ladders would let a well-engineered but useless protocol borrow
credibility from its engineering, and a useful but rough protocol be dismissed
for its packaging. Keeping them apart makes each claim carry its own evidence.

## The cross-product is real

Every cell below is a state a protocol can actually be in. The registry shows
both values; the site shows both badges.

| | NO_IMPACT_EVIDENCE | BENCHMARK_SIGNAL | FIELD_SIGNAL | NO_CLEAR_GAIN | HARM_FOUND |
|---|---|---|---|---|---|
| **DRAFT** | new idea | — | — | — | — |
| **EXAMPLE_CONFORMANCE_VALIDATED** | examples pass, benefit unknown | + helps on benchmark | — | examples pass but no gain | — |
| **SECURITY_REVIEWED** | reviewed, benefit unknown | reviewed + benchmark gain | reviewed + field gain | reviewed but no gain | withdrawn pending fix |
| **FIELD_READY** | ready to trial, benefit unmeasured | ready + benchmark gain | ready + field gain | ready but honestly no gain | blocked → not field-ready |

Two cells deserve emphasis:

- **FIELD_READY + NO_CLEAR_GAIN** is a legitimate, published state. The protocol
  met the declared checks for a bounded trial; we measured it; it did not help.
  That is useful
  knowledge, especially when the workflow looked promising. We keep it.
- **HARM_OR_REGRESSION_FOUND** caps the assurance ladder below FIELD_READY. A
  protocol that made things worse cannot be "ready for bounded trials" no matter
  how clean its code is, until the harm is understood and resolved.

## How a protocol moves up each ladder

Assurance advances through the verification gates recorded in the receipt:
`validate` (→ STRUCTURE_VALIDATED) → offline example `tests` + `evals`
(→ EXAMPLE_CONFORMANCE_VALIDATED) → live runs over the task set
(→ TASKSET_PASSED) → a second model on the same task set with the same evidence
outcome (→ CROSS_MODEL_REPRODUCED) → `hostile` +
human review (→ SECURITY_REVIEWED) → accessibility editions (→ FIELD_READY). Each
gate is a check a third party can re-run. The offline toolchain in this
repository stops at EXAMPLE_CONFORMANCE_VALIDATED by design; it runs no model, so
it cannot honestly claim a live-run rung.

`CROSS_MODEL_REPRODUCED` is deliberately narrower than independent reproduction:
the same team, task set, graders and recording path may have produced both runs.
It records cross-model consistency only. It does not authenticate the model
identity or establish that an independent party reproduced the experiment.

Evidence advances only through evaluation. Candidate v0.2 cannot automatically
issue any positive state: promotion requires a separate, independently reviewed,
hash-bound study artifact and is deliberately not implemented here. Evaluation
records keep four dimensions separate: **setting** (benchmark, controlled user,
or organisational field), **study stage** (development, formative, feasibility,
or confirmatory), **identification** (descriptive, randomized,
quasi-experimental, or observational), and **review status**. A field setting is
not automatically causal, and a randomized controlled-user study does not
automatically transfer to ordinary organisational use.

The harness still enforces ceilings as a rejection control. A benchmark profile
can never support more than `BENCHMARK_SIGNAL`; a formative or feasibility
profile cannot support a positive productivity state; and an attributable state
would require confirmatory stage, defensible identification, and independent
review. Passing a ceiling is necessary, never sufficient.

## The rule for claims

A protocol page, README, or registry entry may state a benefit **only up to its
`productivity_evidence` value.** "This protocol improves X" requires at least a
signal state with an evaluation behind it. Below that, the honest statement is
"benefit not yet measured." This rule is enforced by the overclaim check in the
hostile-test suite: prose that asserts a gain the evidence status does not
license is a failing defect, not a stylistic quibble.
