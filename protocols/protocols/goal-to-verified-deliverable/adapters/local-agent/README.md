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

Smaller-model behaviour is untested. A facilitator may try one step per turn as a
formative exercise, but must treat the output as `DRAFT` until the normal checks
pass. Check contract-first behaviour, predeclared tests and the receipt explicitly;
do not infer graceful degradation or retained benefit.

## What this adapter does not do

It does not change the contract. If your runner adds tools, declare them in a
fork of `protocol.yaml` with their permissions and degradation notes; do not
smuggle capability in through the adapter.
