# Security — goal-to-verified-deliverable

This pack inherits the library policy in [`../../SECURITY.md`](../../SECURITY.md).
Pack-specific points:

- **Read-only by default.** Declared permissions are `read` (supplied inputs) and
  `write` (its own four outputs). No network, no execute. The manifest's
  `network_required` is `false`.
- **Injection is a first-class threat.** The protocol operates on user-supplied
  materials, which may contain embedded instructions. The stop conditions and
  acceptance test `gtvd-at-5` require that such instructions are flagged and not
  acted on. The worked example and a discrimination test exercise this directly.
- **No consequential actions.** `prohibited_actions` forbids send/spend/publish/
  delete. The failure fixture (`tests/fixtures/bad-receipt.json`) represents a run
  that violates this, and the discrimination tests confirm the graders reject it.
- **No secrets, no telemetry.** The pack ships no keys and makes no calls.

Report issues via the parent repository's security process. A confirmed serious
issue withdraws the pack from the registry before diagnosis.
