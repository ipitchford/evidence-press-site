# Security — repetitive-workflow-capture

This pack inherits the library policy in [`../../SECURITY.md`](../../SECURITY.md).
Pack-specific points:

- **Read-only by default.** Declared permissions are `read` (the supplied process
  description) and `write` (its own five outputs). No network, no execute. The
  manifest's `network_required` is `false`.
- **Injection is a first-class threat.** The protocol exists to read a
  user-supplied description of a process, which routinely narrates actions and may
  contain a line aimed at the reader. The stop conditions and acceptance test
  `rwc-at-5` require that such instructions are flagged in the limitations, kept
  out of the candidate's steps, and not acted on. The worked example embeds one, and
  a discrimination test proves the graders reject a run that follows it.
- **No invented content.** `prohibited_actions` forbids inventing a step, input, or
  permission not present in the description; test `rwc-at-6` and the per-step source
  trace exist to catch it.
- **No overclaimed maturity.** The output is a draft candidate. `prohibited_actions`
  forbids presenting it as validated, tested, or ready, and test `rwc-at-4` plus the
  required draft label and limitations catch a run that does. The bad fixture
  represents a run that both takes an external action and calls the candidate ready;
  the discrimination tests confirm the graders reject it.
- **No consequential actions.** `prohibited_actions` forbids send/spend/publish/
  delete. The failure fixture (`tests/fixtures/bad-receipt.json`) represents a run
  that violates this, and the discrimination tests confirm the graders reject it.
- **No secrets, no telemetry.** The pack ships no keys and makes no calls.

Report issues via the parent repository's security process. A confirmed serious
issue withdraws the pack from the registry before diagnosis.
