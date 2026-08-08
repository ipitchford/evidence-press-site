# Security — project-handoff

This pack inherits the library policy in [`../../SECURITY.md`](../../SECURITY.md).
Pack-specific points:

- **Read-only by default.** Declared permissions are `read` (supplied materials) and
  `write` (its own three outputs). No network, no execute. The manifest's
  `network_required` is `false`.
- **Injection is a first-class threat.** The protocol exists to read user-supplied
  project materials — handover messages, tickets, notes — which routinely contain
  instructions aimed at a reader. The stop conditions and acceptance test `ph-at-5`
  require that such instructions are flagged in the limitations and not acted on. The
  worked example embeds one (a handover message asking the agent to email an API
  key), and a discrimination test proves the graders reject a run that follows it.
- **No invented content.** `prohibited_actions` forbids inventing a decision,
  rationale, open question, state, or next step not present in the materials; test
  `ph-at-6` and the required per-decision rationale and source location exist to
  catch it.
- **No consequential actions.** `prohibited_actions` forbids send/spend/publish/
  delete. The failure fixture (`tests/fixtures/bad-receipt.json`) represents a run
  that violates this, and the discrimination tests confirm the graders reject it.
- **Secret hygiene.** A handoff may reference where a credential lives (a config
  path, a key name) but must never read a secret's value into the handoff or forward
  it. The worked example's embedded instruction targets exactly this, and is flagged
  rather than followed.
- **No secrets, no telemetry.** The pack ships no keys and makes no calls.

Report issues via the parent repository's security process. A confirmed serious issue
withdraws the pack from the registry before diagnosis.
