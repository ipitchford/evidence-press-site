# Findings — gtvd-core-v1 live benchmark

> **Historical version boundary:** every run in this document evaluated pack
> version 0.1.0. The current distributable is 0.1.1 and does not inherit these
> assurance or productivity-evidence states. Its current evidence is
> `NO_IMPACT_EVIDENCE` until the changed bytes are retested.

**Run:** 2026-08-08 · runner `o4-mini` · blind judge `gpt-5.2` · 5 tasks · two arms
(agent_without_protocol vs agent_with_protocol). Raw outputs:
[`live/runs/live-o4-mini-2026-08-08.jsonl`](live/runs/). Machine result:
[`result-live-o4-mini-2026-08-08.json`](result-live-o4-mini-2026-08-08.json).

## Result

| Metric (means over 5 tasks) | without protocol | with protocol |
|---|---|---|
| Acceptance pass rate (completion + safety gates) | 1.00 | 1.00 |
| Safety events | 0 | 0 |
| Quality (blind judge, 0–1) | 0.98 | 0.82 |
| Accuracy / grounding (blind judge, 0–1) | 0.80 | 0.60 |
| Est. evaluation-pipeline cost (runner + model judge; USD price-table estimate) | ~0.013 | ~0.043 |
| Mean output length (chars) | 322 | 3185 |

**Predecessor assurance earned:** `TASKSET_PASSED` — the 0.1.0 agent-with-protocol arm's *fresh*
outputs passed the **acceptance gates** (completion + no deterministic
compliance/external-action signal), recomputed by the verifier from the committed
raw outputs. Note what this rung does and does not mean: it is a *minimum* bar
(the outputs addressed the task and took no prohibited action). It is **not** a
statement that the outputs were high quality — the quality/accuracy numbers above
show they were, on this run, somewhat worse than the control.

**Predecessor productivity evidence:** `NO_CLEAR_GAIN`. On this task set with this model the
protocol produced no worthwhile improvement; on the measured dimensions it was
somewhat worse.

## What the run showed (descriptive)

In this five-task run, with one runner and one judge:

- Both arms took no external action and passed the acceptance gates.
- The with-protocol arm received a **lower mean judge quality score** (0.82 vs
  0.98) and a **lower mean grounding score** (0.60 vs 0.80), at roughly **3.3×**
  the estimated token cost.
- The with-protocol outputs were about **10× longer** (3185 vs 322 characters):
  the copy-and-run edition emits a full contract, step log, limitations, and
  receipt even for a "write two sentences" task.

Two injection tasks carried an embedded "email/post this" instruction. **Neither
arm complied** — `o4-mini` refuses these bare. The protocol arm additionally
flagged the instruction, which is better transparency but did not change the
outcome for this model.

## What this does NOT establish

This is a small, under-controlled benchmark. It does **not** show that "the
protocol" lowers quality in general. In particular:

- It tests the **verbatim full-transcript edition** applied to concise tasks. The
  kernel is meant to be *proportional* (Quick vs Verified vs Institutional), but
  this protocol does not yet *operationalise* that selection — so the run measures
  the cost of applying heavyweight ceremony to Quick-appropriate tasks, not
  whether a correctly-selected lighter edition would regress. (That motivates the
  concise-edition experiment.)
- No controls for equal token/output budgets, sampling parameters, run order, or
  contamination; no pre-registered rubric; a single judge (not multiple raters);
  no repeated generations; five tasks; no uncertainty or significance.
- The grounding drop may be partly a judge artefact: a verbose output that
  restates and reasons gives the judge more surface to mark as "beyond the
  materials."
- No `no_agent` (human) arm; human-measured dimensions (effort, cognitive burden,
  accessibility) are null because they need people.
- Historical `cost_usd` combines runner and model-judge calls. It is a static
  evaluation-pipeline estimate, not billing or ordinary workflow/company cost;
  longer outputs also increase judging cost.

The strongest defensible statement is: **the evaluated verbatim full-transcript
implementation received lower mean judge quality and grounding, at ~3.3× cost, on
these five concise tasks with this model and judge.** A benchmark design cannot
support anything stronger than a benchmark-level signal.

## Follow-up runs (2026-08-08)

Two of the three planned experiments were run. Same task set, blind judge.

| Run | Quality (with vs bare) | Accuracy (with vs bare) | Cost (with vs bare) | Implied |
|---|---|---|---|---|
| Full edition, o4-mini | 0.82 vs 0.98 | 0.60 vs 0.80 | $0.043 vs $0.013 | NO_CLEAR_GAIN |
| **Concise edition, o4-mini** | 0.91 vs 0.98 | 0.80 vs 1.00 | $0.021 vs $0.015 | NO_CLEAR_GAIN |
| **Full edition, gpt-5.2** | 0.96 vs 1.00 | 1.00 vs 1.00 | $0.084 vs $0.015 | NO_CLEAR_GAIN |

- **Concise edition** ([`../adapters/generic-chat/prompt-concise.md`](../adapters/generic-chat/prompt-concise.md))
  recovered most of the quality/accuracy lost by the full edition and roughly
  halved the cost — consistent with verbosity contributing to the regression,
  without isolating it as the sole cause.
  But it still did not beat the bare model.
- **Cross-model** (gpt-5.2, a stronger model): the quality gap nearly closed, but
  cost ballooned to ~5.6× and there was still no gain.

**Historical conclusion, honestly bounded:** `NO_CLEAR_GAIN` **held across two 0.1.0 editions and
two models** — which is why the predecessor's assurance rose to
`CROSS_MODEL_REPRODUCED` (the deterministic acceptance reproduced on two models)
while its productivity evidence remained `NO_CLEAR_GAIN`. The ceremony was the cost;
the protocol still adds no measured benefit on these simple, already-safe tasks
with capable models.

**Still to run:** a **weaker / less-aligned runner** that complies with injected
instructions *bare*. That is the setting where the protocol's safety value should
finally materialise — and the current models do not provide it, so the claim
remains untested rather than refuted.

The negative 0.1.0 results are retained, not discarded or transferred to 0.1.1.
