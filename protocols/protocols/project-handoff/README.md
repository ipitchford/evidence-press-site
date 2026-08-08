# Project handoff

**Turn a half-finished project into durable state a successor can resume — the
decisions made and why, the open questions, the current state, and the exact next
steps — each traceable to where it appears in the materials.**

| | |
|---|---|
| Protocol id | `project-handoff` |
| Version | `0.1.0` |
| Kernel | Verified Agent Work `0.1.0` |
| Assurance level | Verified |
| Risk class | Low |
| Privacy class | Internal |
| Protocol assurance | see the pack's `RECEIPT.json` (written by `verify-all`) |
| Productivity evidence | `NO_IMPACT_EVIDENCE` (benefit not yet measured) |
| Licence | CC0-1.0 (prose) · Apache-2.0 (code) |

## 1. What problem does this solve?

A project handed over half-done loses the things that live only in the head of the
person who was doing it: why a path was chosen over the alternative, which question
is still unresolved, how far the work actually got, and what the very next step is.
This protocol pulls that state out of the project's own materials into a structured
handoff and ties every item back to where it appears, so the successor can check
the handoff against the materials rather than trust it.

## 2. Who is it for?

Anyone leaving part-done work for someone else, or inheriting it: an individual
stepping away before a project is finished, a successor picking it up, and teams
that want a shared, source-traceable record of where a project stands.

## 3. What does a successful result look like?

Three things handed back together: the **handoff** (decisions with their rationale,
the open questions, the current state, the next steps, and how to resume — each
traced to a source location), an honest **limitations** section, and a compact
**receipt**. Every item traces to the materials; nothing is invented.

## 4. What information does the agent receive?

The project materials you supply, plus an optional note on the current state that
steers what to prioritise. Nothing else — it works only from what you provide, and
the current-state note never becomes a source of decisions.

## 5. What can the agent change?

Only its three outputs, written to the working area. It reads your materials and
writes the handoff, the limitations, and the receipt. It does not touch anything
else, and it takes no action on the project's behalf.

## 6. Where must a person approve?

Nothing is required at this risk level. One checkpoint is offered: before the
handoff is used to act on a next step with an outward-facing or irreversible effect
— a deploy, a message, a key rotation — since performing that step is the
successor's decision, not the handoff's.

## 7. How long and how much does it normally cost?

The extraction is a single read-and-structure pass over the materials; cost scales
with how much there is to read. The protocol adds a fixed overhead — the contract,
the per-section passes, the checks — in exchange for a traceable handoff. This
describes the mechanism; it is not a measured saving, and the pack does not claim
one.

## 8. What has actually been tested?

The pack ships positive, failure, and prompt-injection **structural tests** whose
graders run against the worked example, checked mechanically and reproducibly.
What has **not** been done: a live comparison of real work with and without the
protocol. That is why `productivity_evidence` is `NO_IMPACT_EVIDENCE`. The pack
does not claim a benefit it has not measured.

## 9. What can go wrong?

A decision or next step can be invented with no source (mitigated by requiring a
rationale and a source location per decision, and test `ph-at-6`); an instruction
hidden in the materials can be followed (mitigated by the injection stop condition
and test `ph-at-5`); a rationale can be guessed rather than sourced (mitigated by
faithful sourcing, with "not recorded" where the materials give no reason); and a
stale state can be recorded as current (mitigated by the evidence boundary). Full
list in [`protocol.yaml`](protocol.yaml) under `failure_modes`.

## 10. How is it installed or used?

Three editions:

- **Copy-and-run** — no install. Paste [`adapters/generic-chat/prompt.md`](adapters/generic-chat/prompt.md)
  into any capable chat agent with your materials.
- **Downloadable skill** — install [`SKILL.md`](SKILL.md) and this directory into a
  skills-compatible environment (Claude, Codex). See [`adapters/claude/`](adapters/claude/)
  and [`adapters/codex/`](adapters/codex/).
- **Local agent** — see [`adapters/local-agent/`](adapters/local-agent/) for a
  minimal, model-neutral runner.

## Honesty note

This README states how the protocol *works*, not that it *helps*. Any claim that it
improves your work would require an evaluation this pack has not yet run. Until
then, the honest statement is: benefit not measured.
