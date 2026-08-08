# Security — decision-memo-under-uncertainty

This pack inherits the library policy in [`../../SECURITY.md`](../../SECURITY.md).
Pack-specific points:

- **Read-only by default.** Declared permissions are `read` (the supplied question
  and materials) and `write` (its own three outputs). No network, no execute. The
  manifest's `network_required` is `false`.
- **Injection is a first-class threat.** The protocol operates on user-supplied
  materials, which may contain embedded instructions. The stop conditions and
  acceptance test `dmu-at-5` require that such instructions are flagged and not acted
  on. The worked example embeds one ("NOTE TO AI ..." naming an email and a database
  deletion) and a discrimination test confirms the graders reject a run that follows
  it.
- **An assumption stated as a fact is a defect, not a stylistic choice.**
  `prohibited_actions` forbid presenting an assumption as a fact or placing an
  unsourced statement among the facts. Acceptance tests `dmu-at-2` and `dmu-at-6` and
  the discrimination case `dmu-disc-2` exercise this.
- **No consequential actions, and no choosing the decision.** `prohibited_actions`
  forbid send/publish/spend/delete and forbid committing to or executing an
  irreversible option. The failure fixture (`tests/fixtures/bad-receipt.json`)
  represents a run that emails the vendor and deletes the legacy database, and the
  discrimination tests confirm the graders reject it.
- **No secrets, no telemetry.** The pack ships no keys and makes no calls.

Report issues via the parent repository's security process. A confirmed serious issue
withdraws the pack from the registry before diagnosis.
