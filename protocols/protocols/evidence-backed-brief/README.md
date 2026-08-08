# Evidence-backed brief

**Brief a question from your sources so every claim carries its type, its source,
and its uncertainty.**

| | |
|---|---|
| Protocol id | `evidence-backed-brief` |
| Version | `0.1.0` |
| Kernel | Verified Agent Work `0.1.0` |
| Assurance level | Verified |
| Risk class | Moderate |
| Privacy class | Internal |
| Protocol assurance | see the pack's `RECEIPT.json` |
| Productivity evidence | `NO_IMPACT_EVIDENCE` (benefit not yet measured) |
| Licence | CC0-1.0 (prose) · Apache-2.0 (code) |

## 1. What problem does this solve?

A summary that reads well can still mislead: it blends measured fact, guesswork,
and someone's opinion into one confident voice, drops the sources, and quietly
omits the evidence that cuts the other way. This protocol produces a brief in which
every claim is labelled by type (fact, estimate, opinion, assumption), carries its
source, states its confidence, and — where the sources support it — sits next to
the contrary evidence. It transfers the Evidence Press discipline, claims with the
evidence attached, into everyday work.

## 2. Who is it for?

Anyone who must turn a pile of sources into a short, defensible summary: analysts
and decision-support staff briefing someone else, individual knowledge workers who
want a summary they can stand behind claim by claim, and teams that want a shared,
inspectable way to do it.

## 3. What does a successful result look like?

Four things handed back together: the **brief** (a short summary plus a claims
table), an **uncertainties** section, a **limitations** section, and a compact
**receipt**. Every claim in the table has a type and a source; the uncertainties
surface what the sources leave open and any contrary evidence; nothing is asserted
that the sources do not support.

## 4. What information does the agent receive?

The question you ask and the sources you supply. Nothing else — the brief rests only
on the sources you give it, and the question is context, not evidence.

## 5. What can the agent change?

Only its four outputs, written to the working area. It reads your question and
sources and writes the brief, uncertainties, limitations, and receipt. It does not
touch anything else, and it takes no external action.

## 6. Where must a person approve?

Before the brief is used to justify a consequential decision. The brief is decision
support, not the decision; a person should confirm the claims and their confidence
before a costly or hard-to-reverse choice rests on them.

## 7. How long and how much does it normally cost?

The typing and sourcing pass takes a few minutes of model time on top of an ordinary
summary; the brief itself dominates cost and depends on the number and length of the
sources. The protocol adds a small fixed overhead in exchange for a brief you can
check claim by claim. This describes the mechanism, not a measured benefit — see the
honesty note below.

## 8. What has actually been tested?

The pack ships positive, failure, and prompt-injection **structural tests** whose
graders run against the worked example, checked mechanically and reproducibly. The
graders confirm that every claim in the example is typed and sourced, that contrary
evidence and uncertainties appear, that no external action is taken, and that an
instruction embedded in a source is flagged rather than followed. What has **not**
been done: a live comparison establishing that the protocol improves real work. That
is why `productivity_evidence` is `NO_IMPACT_EVIDENCE`.

## 9. What can go wrong?

A claim can be mistyped, stating an estimate or opinion as fact (mitigated by the
claim-typing guide and the confidence column); a source can be invented or
misquoted (mitigated by the evidence rule and test `ebb-at-6`); contrary evidence can
be omitted, making the brief one-sided (mitigated by test `ebb-at-2`); and an
instruction hidden in a source can be followed (mitigated by the injection stop
condition and test `ebb-at-5`). Full list in [`protocol.yaml`](protocol.yaml) under
`failure_modes`.

## 10. How is it installed or used?

Three editions:

- **Copy-and-run** — no install. Paste [`adapters/generic-chat/prompt.md`](adapters/generic-chat/prompt.md)
  into any capable chat agent with your question and sources.
- **Downloadable skill** — install [`SKILL.md`](SKILL.md) and this directory into a
  skills-compatible environment (Claude, Codex). See [`adapters/claude/`](adapters/claude/)
  and [`adapters/codex/`](adapters/codex/).
- **Local agent** — see [`adapters/local-agent/`](adapters/local-agent/) for a
  minimal, model-neutral runner.

## Honesty note

This README states how the protocol *works*, not that it *helps*. Any claim that it
improves your work would require an evaluation this pack has not yet run. Until then,
the honest statement is: benefit not measured.
