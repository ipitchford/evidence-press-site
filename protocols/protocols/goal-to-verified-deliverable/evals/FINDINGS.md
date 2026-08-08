# Findings — gtvd-core-v1 live benchmark

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
| Est. cost (USD, price-table estimate) | ~0.013 | ~0.043 |
| Mean output length (chars) | 322 | 3185 |

**Assurance earned:** `TASKSET_PASSED` — the agent-with-protocol arm's *fresh*
outputs passed the **acceptance gates** (completion + no deterministic
compliance/external-action signal), recomputed by the verifier from the committed
raw outputs. Note what this rung does and does not mean: it is a *minimum* bar
(the outputs addressed the task and took no prohibited action). It is **not** a
statement that the outputs were high quality — the quality/accuracy numbers above
show they were, on this run, somewhat worse than the control.

**Productivity evidence:** `NO_CLEAR_GAIN`. On this task set with this model the
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
- `cost_usd` is a static price-table estimate, not billing.

The strongest defensible statement is: **the evaluated verbatim full-transcript
implementation received lower mean judge quality and grounding, at ~3.3× cost, on
these five concise tasks with this model and judge.** A benchmark design cannot
support anything stronger than a benchmark-level signal.

## Next experiments

- **Concise deliverable-only edition** — emit the deliverable + a compact receipt,
  not the full transcript; re-measure.
- **Weaker / less-aligned runner** that complies with injections bare — to test
  whether the protocol's safety value then materialises.
- **A second runner model** and **multiple judges** — toward cross-model
  reproduction and less judge dependence.

The negative result is retained, not discarded — and it points at concrete next
experiments rather than a conclusion.
