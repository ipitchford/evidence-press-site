# Goal to verified deliverable

**Turn an unclear task into a checkable one, then deliver it with its evidence.**

| | |
|---|---|
| Protocol id | `goal-to-verified-deliverable` |
| Version | `0.1.1` |
| Kernel | Verified Agent Work `0.1.0` |
| Assurance level | Verified |
| Risk class | Low |
| Privacy class | Internal |
| Protocol assurance | current 0.1.1: see `RECEIPT.json`; predecessor 0.1.0 runs are retained history |
| Productivity evidence | `NO_IMPACT_EVIDENCE` for 0.1.1; predecessor findings in [evals/FINDINGS.md](evals/FINDINGS.md) |
| Licence | CC0-1.0 (prose) · Apache-2.0 (code) |

## 1. What problem does this solve?

Open-ended tasks handed to an agent — "look into this", "improve the analysis",
"help me with the report" — have no finish line, so the result is plausible but
unverifiable and often not what was wanted. This protocol converts the task into
an explicit deliverable with acceptance tests *before* work starts, so the output
can be checked, not just trusted.

## 2. Who is it for?

Anyone giving an agent an open-ended task: individual knowledge workers, teams
that want a shared and inspectable way to delegate to an agent, and authors
building a more specific protocol on top of the kernel.

## 3. What does a successful result look like?

Four things handed back together: the **deliverable**, the **contract** agreed
before execution, an honest **limitations** section, and a compact **receipt**.
The deliverable meets the acceptance standard stated in the contract, and every
acceptance test has an explicit pass or fail.

## 4. What information does the agent receive?

The task as you first state it, plus any materials and constraints you choose to
supply. Nothing else — it works only from what you provide.

## 5. What can the agent change?

Only its four outputs, written to the working area. It reads your supplied
inputs and writes the deliverable, contract, limitations, and receipt. It does
not touch anything else.

## 6. Where must a person approve?

Before execution, if the agreed deliverable has materially reshaped your original
task — you confirm the reframing is what you want. And, at institutional level,
before any acceptance test is treated as passed on the agent's judgement alone.

## 7. How long and how much does it normally cost?

The contract and tests take a few minutes of model time; the deliverable itself
dominates cost and depends on the task. The protocol adds a small fixed overhead
in exchange for a checkable result. (This is a description of the mechanism, not a
measured saving — see the honesty note below.)

## 8. What has actually been tested?

Two versions must be kept distinct. Offline, the current 0.1.1 pack ships positive, failure, and prompt-injection
**structural tests** whose graders run against the worked example, checked
mechanically and reproducibly. Historically, three 0.1.0 two-arm runs covered two named runner
models and two protocol editions on the same five-task set. Those committed
outputs passed the deterministic acceptance tests, earning
`CROSS_MODEL_REPRODUCED` for the predecessor under this project's ladder, but every run found
**no clear gain on the measured model-output dimensions** and higher combined runner-plus-judge evaluation
cost than the bare-agent arm. That is not an ordinary workflow or company cost.
They do not certify the changed 0.1.1 distributable; its current status is
example conformance with `NO_IMPACT_EVIDENCE` until retested.
This is same-team, self-recorded cross-model consistency—not independent
reproduction. See [evals/FINDINGS.md](evals/FINDINGS.md).

## 9. What can go wrong?

The contract can drift from your intent (mitigated by the reframing checkpoint);
acceptance tests can be written to pass trivially (mitigated by requiring a
failure/boundary test); outside facts can be smuggled in as if sourced (mitigated
by the evidence rule); and an instruction hidden in your materials can be followed
(mitigated by the injection stop condition and test `gtvd-at-5`). Full list in
[`protocol.yaml`](protocol.yaml) under `failure_modes`.

## 10. How is it installed or used?

Three editions:

- **Copy-and-run** — no install. Paste [`adapters/generic-chat/prompt.md`](adapters/generic-chat/prompt.md)
  into any capable chat agent with your task and materials.
- **Downloadable skill** — install [`SKILL.md`](SKILL.md) and this directory into a
  skills-compatible environment (Claude, Codex). See [`adapters/claude/`](adapters/claude/)
  and [`adapters/codex/`](adapters/codex/).
- **Local agent** — see [`adapters/local-agent/`](adapters/local-agent/) for a
  minimal, model-neutral runner.

## Honesty note

This README states how the protocol *works*. On whether it *helps*: the 0.1.0
predecessor was measured (see above), and on those task/model runs it did **not**
help — it cost quality and tokens. Those results remain published, not hidden.
Version 0.1.1 has not been measured. It may help weaker or less-aligned models,
higher-stakes tasks, or in a more concise edition; those are hypotheses for a
future version-bound run, not claims.
