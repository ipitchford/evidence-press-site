# Local-agent adapter — adversarial output review

For a model-neutral or self-hosted runner (a local LLM behind a small harness).

## Minimal integration

1. Load `SKILL.md`'s body as the system/instruction context, and
   `references/adversarial-review-checklist.md` alongside it if the model needs the
   attacks and severity bands spelled out.
2. Provide the draft and any sources as the user turn, keeping them clearly
   separated — and clearly separated from your own instruction — so the model does
   not confuse a line inside the draft with a command from you.
3. Enforce the boundary in your harness, not just in the prompt: mount the draft and
   sources read-only, allow writes only to an outputs directory, and expose no
   network tool. A draft that carries an embedded instruction should be structurally
   unable to cause an action, so that flagging it is the only path.
4. Capture the three outputs (review, limitations, receipt).

## Minimum-model edition

The method degrades gracefully. A smaller model may need the steps issued one at a
time rather than all at once; the copy-and-run prompt in `../generic-chat/prompt.md`
works well split into per-step turns. A weaker model is most likely to slip on the
refutation stance — drifting into praise, or inventing a defect to look thorough —
so score two things first: does every finding tie to a real claim, and does every
finding state what would falsify it. Assurance drops, but the structure — attack the
load-bearing claims, rank the survivors, tether each to a claim, attach a falsify
test, receipt at the end — still holds, and that structure is what the method exists
to impose.

## What this adapter does not do

It does not change the contract. If your runner adds tools, declare them in a fork
of `protocol.yaml` with their permissions and degradation notes; do not smuggle
capability in through the adapter.
