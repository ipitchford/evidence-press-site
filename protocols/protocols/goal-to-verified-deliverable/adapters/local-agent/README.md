# Local-agent adapter — goal to verified deliverable

For a model-neutral or self-hosted runner (a local LLM behind a small harness).

## Minimal integration

1. Load `SKILL.md`'s body as the system/instruction context.
2. Provide the user's task, materials, and constraints as the user turn.
3. Enforce the boundary in your harness, not just in the prompt: mount supplied
   inputs read-only, allow writes only to an outputs directory, and expose no
   network tool. The protocol assumes least privilege; a local runner should make
   that structural rather than trusting the model to comply.
4. Capture the four outputs (deliverable, contract, limitations, receipt).

## Minimum-model edition

The method degrades gracefully. A smaller model may need the steps issued one at
a time rather than all at once; the copy-and-run prompt in
`../generic-chat/prompt.md` works well split into per-step turns. Assurance drops
(less reliable self-checking), but the structure — contract first, tests before
execution, receipt at the end — still holds, and that structure is what the
method exists to impose.

## What this adapter does not do

It does not change the contract. If your runner adds tools, declare them in a
fork of `protocol.yaml` with their permissions and degradation notes; do not
smuggle capability in through the adapter.
