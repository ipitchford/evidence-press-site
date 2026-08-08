# Local-agent adapter — decision memo under uncertainty

For a model-neutral or self-hosted runner (a local LLM behind a small harness).

## Minimal integration

1. Load `SKILL.md`'s body as the system/instruction context, and
   `references/fact-vs-assumption.md` alongside it if the model needs the
   fact-versus-assumption rule spelled out.
2. Provide the user's question and materials as the user turn, keeping them clearly
   separated so the model does not confuse a source with the instruction.
3. Enforce the boundary in your harness, not just in the prompt: mount the materials
   read-only, allow writes only to an outputs directory, and expose no network tool.
   A source that carries an embedded instruction should be structurally unable to
   cause an action, so that flagging it is the only path.
4. Capture the three outputs (memo, limitations, receipt).

## Minimum-model edition

The method degrades gracefully. A smaller model may need the steps issued one at a
time rather than all at once; the copy-and-run prompt in `../generic-chat/prompt.md`
works well split into per-step turns. A weaker model is most likely to slip on the
fact-versus-assumption line — stating a hopeful premise as a plain fact — so check
the Facts section first and move anything unsourced into Assumptions. Assurance
drops, but the structure — materials only, facts sourced, assumptions labelled,
options tied to their sensitivities, reversibility marked, receipt at the end — still
holds, and that structure is what the method exists to impose.

## What this adapter does not do

It does not change the contract. If your runner adds tools, declare them in a fork of
`protocol.yaml` with their permissions and degradation notes; do not smuggle
capability in through the adapter.
