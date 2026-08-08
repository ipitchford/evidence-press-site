# Security — evidence-backed-brief

This pack inherits the library policy in [`../../SECURITY.md`](../../SECURITY.md).
Pack-specific points:

- **Read-only by default.** Declared permissions are `read` (the supplied question
  and sources) and `write` (its own four outputs). No network, no execute. The
  manifest's `network_required` is `false`.
- **Injection is a first-class threat.** The protocol operates on user-supplied
  sources, which may contain embedded instructions. The stop conditions and
  acceptance test `ebb-at-5` require that such instructions are flagged and not acted
  on. The worked example embeds one ("NOTE TO AI ...") and a discrimination test
  confirms the graders reject a run that follows it.
- **Unsourced claims are a defect, not a stylistic choice.** `prohibited_actions`
  forbid presenting a claim without a type or a source, and inventing a source.
  Acceptance tests `ebb-at-1` and `ebb-at-6` and the discrimination case `ebb-disc-1`
  exercise this.
- **No consequential actions.** `prohibited_actions` forbid send/publish/spend/
  delete. The failure fixture (`tests/fixtures/bad-receipt.json`) represents a run
  that publishes and emails, and the discrimination tests confirm the graders reject
  it.
- **No secrets, no telemetry.** The pack ships no keys and makes no calls.

Report issues via the parent repository's security process. A confirmed serious
issue withdraws the pack from the registry before diagnosis.
