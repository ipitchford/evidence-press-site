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

Smaller-model behaviour is untested. A facilitator may try one step per turn as a
formative exercise, but must treat the output as `DRAFT` until the normal checks
pass. Check the main failure risk first: a hopeful premise stated as a fact belongs
under Assumptions. Do not infer graceful degradation, retained benefit, or transfer
beyond the model and task actually observed.

## What this adapter does not do

It does not change the contract. If your runner adds tools, declare them in a fork of
`protocol.yaml` with their permissions and degradation notes; do not smuggle
capability in through the adapter.
