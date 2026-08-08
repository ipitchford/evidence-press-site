# Local-agent adapter — evidence-backed brief

For a model-neutral or self-hosted runner (a local LLM behind a small harness).

## Minimal integration

1. Load `SKILL.md`'s body as the system/instruction context, and
   `references/claim-typing.md` alongside it if the model needs the typing rubric
   spelled out.
2. Provide the user's question and sources as the user turn, keeping them clearly
   separated so the model does not confuse a source with the instruction.
3. Enforce the boundary in your harness, not just in the prompt: mount the sources
   read-only, allow writes only to an outputs directory, and expose no network
   tool. A source that carries an embedded instruction should be structurally
   unable to cause an action, so that flagging it is the only path.
4. Capture the four outputs (brief, uncertainties, limitations, receipt).

## Minimum-model edition

The method degrades gracefully. A smaller model may need the steps issued one at a
time rather than all at once; the copy-and-run prompt in `../generic-chat/prompt.md`
works well split into per-step turns. A weaker model is most likely to slip on claim
typing — stating an estimate or an opinion as a fact — so score the type column
first when checking its output. Assurance drops, but the structure — sources only,
every claim typed and sourced, contrary evidence surfaced, receipt at the end —
still holds, and that structure is what the method exists to impose.

## What this adapter does not do

It does not change the contract. If your runner adds tools, declare them in a fork
of `protocol.yaml` with their permissions and degradation notes; do not smuggle
capability in through the adapter.
