# Local-agent adapter — document to action plan

For a model-neutral or self-hosted runner (a local LLM behind a small harness).

## Minimal integration

1. Load `SKILL.md`'s body as the system/instruction context.
2. Provide the user's documents (and any focus) as the user turn.
3. Enforce the boundary in your harness, not just in the prompt: mount the supplied
   documents read-only, allow writes only to an outputs directory, and expose no
   network tool. The protocol assumes least privilege; a local runner should make
   that structural rather than trusting the model to comply.
4. Capture the four outputs (action plan, open questions, limitations, receipt).

## Minimum-model edition

The method degrades gracefully. A smaller model may need the extraction issued one
pass at a time — decisions, then obligations, then deadlines, then uncertainties,
then next actions — rather than all at once; the copy-and-run prompt in
`../generic-chat/prompt.md` works well split into per-pass turns. Assurance drops
(less reliable self-checking), but the structure — source location per item, nothing
invented, embedded instructions flagged not followed — still holds, and that
structure is what the method exists to impose.

## What this adapter does not do

It does not change the contract. If your runner adds tools, declare them in a fork
of `protocol.yaml` with their permissions and degradation notes; do not smuggle
capability in through the adapter.
