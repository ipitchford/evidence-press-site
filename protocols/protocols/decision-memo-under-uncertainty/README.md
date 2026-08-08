# Decision memo under uncertainty

**Turn a decision question into a memo that separates the sourced facts from the
labelled assumptions, sets out the options and their sensitivities, and marks which
actions are reversible.**

| | |
|---|---|
| Protocol id | `decision-memo-under-uncertainty` |
| Version | `0.1.0` |
| Kernel | Verified Agent Work `0.1.0` |
| Assurance level | Verified |
| Risk class | Moderate |
| Privacy class | Internal |
| Protocol assurance | see the pack's `RECEIPT.json` |
| Productivity evidence | `NO_IMPACT_EVIDENCE` (benefit not yet measured) |
| Licence | CC0-1.0 (prose) · Apache-2.0 (code) |

## 1. What problem does this solve?

A decision memo can read with total confidence while quietly resting on a premise
nobody has checked. It blends measured fact with hopeful assumption in one voice,
lists options without saying what each depends on, and treats a one-way door as
though it were a revolving one. This protocol produces a memo in which the facts are
sourced, the assumptions are labelled as assumptions, each option sits beside the
facts and assumptions it depends on, and the reversible actions are marked apart
from the irreversible ones. The decision-maker sees what is known versus what is
assumed.

## 2. Who is it for?

Anyone who must turn a pile of materials into a decision memo someone else will act
on: analysts and decision-support staff, individual knowledge workers weighing an
option, and teams that want a shared, inspectable way to do it.

## 3. What does a successful result look like?

Three things handed back together: the **memo** — with five sections, Facts
(sourced), Assumptions (labelled), Options, Sensitivities, and Reversibility — a
**limitations** section, and a compact **receipt**. Every fact carries a source;
every assumption is labelled; each option is tied to what it depends on; the
irreversible actions are marked as such.

## 4. What information does the agent receive?

The decision question you ask and the materials you supply. Nothing else — the memo
reasons only from the materials you give it, and the question is context, not
evidence.

## 5. What can the agent change?

Only its three outputs, written to the working area. It reads your question and
materials and writes the memo, limitations, and receipt. It touches nothing else,
takes no external action, and does not choose or execute any option.

## 6. Where must a person approve?

Before the memo is used to commit to an irreversible option. The memo is decision
support, not the decision; a person should confirm the facts, the assumptions, and
the reversibility judgement before a costly or hard-to-reverse option is chosen.

## 7. How long and how much does it normally cost?

The fact-versus-assumption pass takes a few minutes of model time on top of an
ordinary write-up; the memo itself dominates cost and depends on the number and
length of the materials. The protocol adds a small fixed overhead in exchange for a
memo whose facts and assumptions are held apart. This describes the mechanism, not a
measured saving — see the honesty note below.

## 8. What has actually been tested?

The pack ships positive, failure, and prompt-injection **structural tests** whose
graders run against the worked example, checked mechanically and reproducibly. The
graders confirm that the memo has all five sections, that every fact carries a
source and every assumption is labelled, that no external or irreversible action is
taken, and that an instruction embedded in a source is flagged rather than followed.
What has **not** been done: a live comparison establishing that the protocol changes
how real decisions turn out. That is why `productivity_evidence` is
`NO_IMPACT_EVIDENCE`.

## 9. What can go wrong?

An assumption can be dressed as a fact, hiding the premise the decision really rests
on (mitigated by the fact-versus-assumption guide and tests `dmu-at-2` and
`dmu-at-6`); a fact can be invented or misattributed (mitigated by the evidence rule
and test `dmu-at-2`); an option's key sensitivity can be omitted (mitigated by the
Sensitivities section and test `dmu-at-1`); an irreversible action can be marked
reversible (mitigated by the Reversibility section and the human checkpoint); and an
instruction hidden in the materials can be followed (mitigated by the injection stop
condition and test `dmu-at-5`). Full list in [`protocol.yaml`](protocol.yaml) under
`failure_modes`.

## 10. How is it installed or used?

Three editions:

- **Copy-and-run** — no install. Paste [`adapters/generic-chat/prompt.md`](adapters/generic-chat/prompt.md)
  into any capable chat agent with your question and materials.
- **Downloadable skill** — install [`SKILL.md`](SKILL.md) and this directory into a
  skills-compatible environment (Claude, Codex). See [`adapters/claude/`](adapters/claude/)
  and [`adapters/codex/`](adapters/codex/).
- **Local agent** — see [`adapters/local-agent/`](adapters/local-agent/) for a
  minimal, model-neutral runner.

## Honesty note

This README states how the protocol *works*, not that it *helps*. Any claim that it
improves your decisions would require an evaluation this pack has not yet run. Until
then, the honest statement is: benefit not measured.
