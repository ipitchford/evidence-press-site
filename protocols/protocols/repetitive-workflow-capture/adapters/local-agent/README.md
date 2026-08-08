# Local-agent adapter — repetitive workflow capture

For a model-neutral or self-hosted runner (a local LLM behind a small harness).

## Minimal integration

1. Load `SKILL.md`'s body as the system/instruction context.
2. Provide the user's process description (and any focus) as the user turn.
3. Enforce the boundary in your harness, not just in the prompt: mount the supplied
   description read-only, allow writes only to an outputs directory, and expose no
   network tool. The protocol assumes least privilege; a local runner should make
   that structural rather than trusting the model to comply.
4. Capture the five outputs (candidate contract, README skeleton, what-to-test,
   limitations, receipt).

## Minimum-model edition

Smaller-model behaviour is untested. A facilitator may try one capture pass per
turn — segment the described steps, draft the contract, draft the README, then
propose tests — as a formative exercise. Keep the candidate labelled `DRAFT` and
check traceability, invention and embedded-instruction handling explicitly; do not
infer graceful degradation or retained benefit.

## What this adapter does not do

It does not change the contract. If your runner adds tools, declare them in a fork
of `protocol.yaml` with their permissions and degradation notes; do not smuggle
capability in through the adapter. And it does not promote the candidate: the
output is a draft for the foundry, not a validated protocol to run.
