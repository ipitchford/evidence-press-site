# The foundry — intake and lifecycle (operational)

This directory operationalises the governance model in
[`../GOVERNANCE.md`](../GOVERNANCE.md): how a proposed protocol gets in, and how a
retired one gets out. It is deliberately lightweight — a proposal template, an
automated intake gate, and a deprecation record — not a heavyweight process.

## Proposing a protocol

1. Open a proposal using [`PROPOSAL_TEMPLATE.md`](PROPOSAL_TEMPLATE.md). A proposal
   is for a **real, repeated friction**, not a clever prompt.
2. Build the pack (copy an existing pack; see [`../CONTRIBUTING.md`](../CONTRIBUTING.md)).
3. Run the **intake gate** locally:
   ```bash
   node tools/submit-check.js <your-pack-id>
   ```
   It prints `GO` only when the pack is a well-formed kernel instance, its tests
   pass (positive + failure/boundary + discrimination), and the security lint is
   clean. A submission CI job runs the same check.
4. Pass the review gates in `GOVERNANCE.md` (structure → example conformance →
   live task set → cross-model → security → field). Each gate is recorded in the
   receipt; assurance is only ever raised to what the receipt justifies.

Negative results are welcome. A protocol that is measured and shows
`NO_CLEAR_GAIN` is published, not rejected.

## Deprecating a protocol

When a protocol is superseded, fails a retest trigger, or has a confirmed serious
issue:

```bash
node tools/deprecate.js <pack-id> "why it is being deprecated"
```

This sets the pack's source `assurance_status` to `DEPRECATED`, removes its
`RECEIPT.json` so the site shows the terminal state, and writes a dated record
under [`deprecations/`](deprecations/). The pack is **kept** — deprecation is a
marking and a withdrawal from active recommendation, never a deletion. `verify-all`
honours the terminal status and will not un-deprecate a pack by re-running the
gates.

A confirmed **security** vulnerability withdraws the pack from the registry first
(deprecate immediately), and the diagnosis follows.

## Files here

- `PROPOSAL_TEMPLATE.md` — the submission form.
- `deprecations/` — one dated record per deprecated protocol.
- (CI intake lives in [`../ci/`](../ci/).)
