# Local-agent adapter — spreadsheet quality audit

For a model-neutral or self-hosted runner (a local LLM behind a small harness).

## Minimal integration

1. Load `SKILL.md`'s body as the system/instruction context.
2. Provide the user's table (and any context) as the user turn.
3. Enforce the boundary in your harness, not just in the prompt: mount the supplied
   table read-only, allow writes only to an outputs directory, and expose no network
   tool. The protocol assumes least privilege; a local runner should make that
   structural rather than trusting the model to comply. Mounting the source
   read-only is what actually guarantees `source_modified: false`.
4. Capture the three outputs (audit, limitations, receipt).

## Minimum-model edition

The method degrades gracefully. A smaller model may need the audit issued one pass
at a time — formulas, then units, then blanks, then totals, then outliers — rather
than all at once; the copy-and-run prompt in `../generic-chat/prompt.md` works well
split into per-pass turns. Assurance drops (less reliable self-checking), but the
structure — a location and a severity per finding, nothing invented, consistent rows
left unflagged, embedded instructions flagged not followed — still holds, and that
structure is what the method exists to impose.

## What this adapter does not do

It does not change the contract. If your runner adds tools (a formula evaluator, a
CSV reader), declare them in a fork of `protocol.yaml` with their permissions and
degradation notes; do not smuggle capability in through the adapter.
