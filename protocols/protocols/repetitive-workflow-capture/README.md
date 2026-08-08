# Repetitive workflow capture

**Turn a description of a repeated manual process into a candidate protocol — a
draft contract, a ten-question README skeleton, and a list of what to test. A
starting point for the foundry, not a finished or validated protocol.**

| | |
|---|---|
| Protocol id | `repetitive-workflow-capture` |
| Version | `0.1.1` |
| Kernel | Verified Agent Work `0.1.0` |
| Assurance level | Verified |
| Risk class | Low |
| Privacy class | Internal |
| Protocol assurance | see the pack's `RECEIPT.json` |
| Productivity evidence | `NO_IMPACT_EVIDENCE` (benefit not yet measured) |
| Licence | CC0-1.0 (prose) · Apache-2.0 (code) |

## 1. What problem does this solve?

Most useful protocols begin as something a person already does by hand every week
and describes in passing — "first I export the numbers, then I write the summary,
then I post the link." Getting from that description to a contract the foundry can
specify, test, and evaluate is manual work, and it is easy to skip the parts that
make a protocol trustworthy: the permission boundary, the prohibited actions, the
acceptance tests. This protocol reads the described process and drafts those parts
into a candidate, tracing every proposed step back to the description so the draft
can be checked against what was actually said.

## 2. Who is it for?

Anyone with a routine to capture: individuals who repeat a manual process and want
it drafted into a candidate without writing the contract by hand, and protocol
authors who want a described workflow turned into a first-pass skeleton to refine.

## 3. What does a successful result look like?

Five things handed back together: the **candidate contract** (a draft naming the
deliverable, inputs, permissions, prohibited actions, steps, and acceptance
tests), the **candidate README skeleton** (the ten questions, with honest
placeholders), the **what-to-test** list (at least one positive and one
failure/boundary test), an honest **limitations** section, and a compact
**receipt**. Every proposed step traces to the description; nothing is invented;
the candidate is labelled a draft.

## 4. What information does the agent receive?

The process description you supply, plus an optional focus that steers what to
emphasise. Nothing else — it works only from what you provide, and the focus never
becomes a source of steps.

## 5. What can the agent change?

Only its five outputs, written to the working area. It reads your description and
writes the candidate contract, README skeleton, what-to-test list, limitations,
and receipt. It touches nothing else, and it performs none of the actions the
described process mentions.

## 6. Where must a person approve?

Nothing is required at this risk level. One checkpoint is offered: before the
candidate is adopted as a real protocol or any of its steps is run, since
promoting a draft into a protocol that is specified, tested, and run is a person's
decision and belongs to the foundry's later gates.

## 7. How long and how much does it normally cost?

The capture is a read-and-draft pass over the description; cost scales with how
much there is to read. The protocol adds a fixed overhead — the contract, the
per-pass checks, the traceability — in exchange for a draft candidate. This
describes the mechanism; it is not a measured saving, and the pack does not claim
one.

## 8. What has actually been tested?

The pack ships positive, failure, and prompt-injection **structural tests** whose
graders run against the worked example, checked mechanically and reproducibly.
What has **not** been done: a live comparison of authoring a candidate with and
without the protocol. That is why `productivity_evidence` is `NO_IMPACT_EVIDENCE`.
The pack does not claim a benefit it has not measured — and, by design, neither
may the candidate it produces.

## 9. What can go wrong?

A step can be invented with no source (mitigated by requiring each proposed step to
trace to a described step and test `rwc-at-6`); an instruction hidden in the
description can be followed (mitigated by the injection stop condition and test
`rwc-at-5`); the candidate can be presented as validated when it is a draft
(mitigated by the maturity prohibition, the required draft label, and test
`rwc-at-4`); and the focus can be mistaken for a source of steps (mitigated by the
evidence boundary). Full list in [`protocol.yaml`](protocol.yaml) under
`failure_modes`.

## 10. How is it installed or used?

Three editions:

- **Copy-and-run** — no install. Paste [`adapters/generic-chat/prompt.md`](adapters/generic-chat/prompt.md)
  into any capable chat agent with your process description.
- **Downloadable skill** — install [`SKILL.md`](SKILL.md) and this directory into a
  skills-compatible environment (Claude, Codex). See [`adapters/claude/`](adapters/claude/)
  and [`adapters/codex/`](adapters/codex/).
- **Local agent** — see [`adapters/local-agent/`](adapters/local-agent/) for a
  minimal, model-neutral runner.

## Honesty note

This README states how the protocol *works*, not that it *helps*. Any claim that it
improves your authoring would require an evaluation this pack has not yet run. And
the candidate it produces is a draft: it has not been validated, tested, or shown
to help, and the protocol is built to stop it being presented as though it had.
Until an evaluation says otherwise, the honest statement is: benefit not measured.
