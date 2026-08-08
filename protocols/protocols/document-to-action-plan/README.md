# Document to action plan

**Pull the decisions, obligations, deadlines, open questions, and next actions out
of a set of documents — each traceable to where it appears.**

| | |
|---|---|
| Protocol id | `document-to-action-plan` |
| Version | `0.1.0` |
| Kernel | Verified Agent Work `0.1.0` |
| Assurance level | Verified |
| Risk class | Low |
| Privacy class | Internal |
| Protocol assurance | see the pack's `RECEIPT.json` |
| Productivity evidence | `NO_IMPACT_EVIDENCE` (benefit not yet measured) |
| Licence | CC0-1.0 (prose) · Apache-2.0 (code) |

## 1. What problem does this solve?

A thread, a set of minutes, or a stack of briefs hides the things you actually
have to act on — a decision buried in paragraph four, an obligation with a
deadline, an unanswered question — among the discussion around them. This protocol
extracts that actionable content into a structured plan and ties every item back
to where it appears in the source, so the plan can be checked against the
documents rather than trusted.

## 2. Who is it for?

Anyone turning correspondence or notes into a checkable list: individuals triaging
a long thread, and teams that want a shared, source-traceable extract of what a set
of documents commits them to.

## 3. What does a successful result look like?

Four things handed back together: the **action plan** (a table of items typed as
decision, obligation, deadline, or action, each with an owner, a deadline, a source
location, and a confidence), the **open questions**, an honest **limitations**
section, and a compact **receipt**. Every item traces to a document; nothing is
invented.

## 4. What information does the agent receive?

The documents you supply, plus an optional focus that steers what to prioritise.
Nothing else — it works only from what you provide, and the focus never becomes a
source of facts.

## 5. What can the agent change?

Only its four outputs, written to the working area. It reads your documents and
writes the action plan, open questions, limitations, and receipt. It does not touch
anything else, and it takes no action on the documents' behalf.

## 6. Where must a person approve?

Nothing is required at this risk level. One checkpoint is offered: before the plan
is used to commit a named owner to an obligation or deadline, since turning a
recorded item into a real commitment is a person's decision.

## 7. How long and how much does it normally cost?

The extraction is a single read-and-structure pass over the documents; cost scales
with how much text there is. The protocol adds a fixed overhead — the contract, the
per-class passes, the checks — in exchange for a traceable plan. This describes the
mechanism; it is not a measured saving, and the pack does not claim one.

## 8. What has actually been tested?

The pack ships positive, failure, and prompt-injection **structural tests** whose
graders run against the worked example, checked mechanically and reproducibly.
What has **not** been done: a live comparison of real work with and without the
protocol. That is why `productivity_evidence` is `NO_IMPACT_EVIDENCE`. The pack
does not claim a benefit it has not measured.

## 9. What can go wrong?

An item can be invented with no source (mitigated by requiring a source location
per row and test `dtap-at-6`); an instruction hidden in a document can be followed
(mitigated by the injection stop condition and test `dtap-at-5`); a tentative
remark can be recorded as a firm decision (mitigated by faithful typing and a
confidence column); and the focus can be mistaken for a fact source (mitigated by
the evidence boundary). Full list in [`protocol.yaml`](protocol.yaml) under
`failure_modes`.

## 10. How is it installed or used?

Three editions:

- **Copy-and-run** — no install. Paste [`adapters/generic-chat/prompt.md`](adapters/generic-chat/prompt.md)
  into any capable chat agent with your documents.
- **Downloadable skill** — install [`SKILL.md`](SKILL.md) and this directory into a
  skills-compatible environment (Claude, Codex). See [`adapters/claude/`](adapters/claude/)
  and [`adapters/codex/`](adapters/codex/).
- **Local agent** — see [`adapters/local-agent/`](adapters/local-agent/) for a
  minimal, model-neutral runner.

## Honesty note

This README states how the protocol *works*, not that it *helps*. Any claim that it
improves your work would require an evaluation this pack has not yet run. Until
then, the honest statement is: benefit not measured.
