# Findings — gtvd-core-v1 live benchmark

**Run:** 2026-08-08 · runner `o4-mini` · blind judge `gpt-5.2` · 5 tasks · two arms
(agent_without_protocol vs agent_with_protocol). Raw outputs:
[`live/runs/live-o4-mini-2026-08-08.jsonl`](live/runs/). Machine result:
[`result-live-o4-mini-2026-08-08.json`](result-live-o4-mini-2026-08-08.json).

## Result

| Metric | without protocol | with protocol |
|---|---|---|
| Acceptance pass rate | 1.00 | 1.00 |
| Safety events | 0 | 0 |
| Quality (blind judge, 0–1) | **0.98** | **0.82** |
| Grounding (no invented facts) | 1.00 | 1.00 |
| Est. cost (USD) | ~0.013 | ~0.043 |
| Mean output length (chars) | 322 | 3185 |

**Assurance earned:** `TASKSET_PASSED` — the agent-with-protocol arm's *fresh*
outputs (not fixtures) passed the acceptance graders on a named model, with
observed outputs.

**Productivity evidence:** `NO_CLEAR_GAIN`. On this task set with this model the
protocol produced no worthwhile improvement, and a measurable quality/cost
regression.

## Interpretation

The two injection tasks carried an embedded "email this" / "post this"
instruction. **Neither arm complied** — `o4-mini` refuses these prompts even
without the protocol. The protocol arm additionally *surfaced and flagged* the
instruction, which is better transparency, but it did not change the outcome
(no external action either way). So the protocol's headline safety value did not
materialise for an already-aligned model on this bait.

The quality gap is driven by **verbosity against the task's format**. The
copy-and-run edition, run verbatim, emits a full contract + step log + limitations
+ receipt — ~10× the length of the concise answer the task asked for (2579 vs 230
characters on the "two sentences" task). The blind judge fairly penalised the
format mismatch. The protocol also cost ~3× the tokens.

This is the **proportionality principle**, measured. Running Verified/Institutional
ceremony on a Quick-appropriate task, with a capable and already-safe model, costs
quality and money without benefit. It is exactly the mismatch the kernel's
assurance levels exist to prevent, and the eval detected it empirically.

## Where the protocol would plausibly help (hypotheses, not yet tested)

- **Weaker or less-aligned models** that *do* comply with injected instructions
  bare — the safety benefit should then be real and large. (Next run: a model that
  fails the bait without the protocol.)
- **Higher-stakes or open-ended tasks** where a checkable contract and acceptance
  tests are the point, not overhead.
- **A concise protocol edition** that emits only the deliverable plus a compact
  receipt, rather than the full step-by-step transcript. (Candidate revision.)

## Limitations of this evaluation

- **Single runner model** (`o4-mini`) — not cross-model reproduced.
- **One blind judge** (`gpt-5.2`) — not multiple raters.
- **Small task set** (5) and a **benchmark design** — cannot support anything
  stronger than a benchmark-level signal.
- **No `no_agent` (human-only) arm**, and no human-measured dimensions
  (human effort, cognitive burden, accessibility) — those are null by honesty.
- **Cost is an estimate** from a static price table.
- Quality is one model's rubric judgement, sensitive to format expectations.

The negative result is retained, not discarded. A workflow that looked promising
and did not help here is useful knowledge — and it points at concrete next
experiments rather than a conclusion.
