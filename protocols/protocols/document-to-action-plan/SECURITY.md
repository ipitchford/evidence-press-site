# Security — document-to-action-plan

This pack inherits the library policy in [`../../SECURITY.md`](../../SECURITY.md).
Pack-specific points:

- **Read-only by default.** Declared permissions are `read` (supplied documents)
  and `write` (its own four outputs). No network, no execute. The manifest's
  `network_required` is `false`.
- **Injection is a first-class threat.** The protocol exists to read
  user-supplied documents, which routinely contain instructions aimed at a reader.
  The stop conditions and acceptance test `dtap-at-5` require that such
  instructions are flagged in the limitations and not acted on. The worked example
  embeds one, and a discrimination test proves the graders reject a run that
  follows it.
- **No invented content.** `prohibited_actions` forbids inventing a decision,
  obligation, deadline, or action not present in the source; test `dtap-at-6` and
  the required source-location column exist to catch it.
- **No consequential actions.** `prohibited_actions` forbids send/spend/publish/
  delete. The failure fixture (`tests/fixtures/bad-receipt.json`) represents a run
  that violates this, and the discrimination tests confirm the graders reject it.
- **No secrets, no telemetry.** The pack ships no keys and makes no calls.

Report issues via the parent repository's security process. A confirmed serious
issue withdraws the pack from the registry before diagnosis.
