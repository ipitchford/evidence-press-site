# Security — spreadsheet-quality-audit

This pack inherits the library policy in [`../../SECURITY.md`](../../SECURITY.md).
Pack-specific points:

- **Read-only by default.** Declared permissions are `read` (supplied table) and
  `write` (its own three outputs). No network, no execute. The manifest's
  `network_required` is `false`.
- **The source is never modified.** `prohibited_actions` forbids modifying,
  correcting, or reformatting the supplied spreadsheet; the write scope is limited to
  the outputs, and the receipt carries `source_modified: false`. The failure fixture
  (`tests/fixtures/bad-receipt.json`) represents a run that edits the sheet and takes
  an external action, and the discrimination tests confirm the graders reject it.
- **Injection is a first-class threat.** A spreadsheet routinely carries free text in
  cells, notes, and formulas, some of which reads as an instruction. The stop
  conditions and acceptance test `sqa-at-5` require that such text is flagged as a
  finding and not acted on. The worked example embeds one in cell E4, and a
  discrimination test proves the graders reject a run that follows it.
- **No invented or over-flagged findings.** `prohibited_actions` forbids inventing a
  finding or flagging a row that is internally consistent; test `sqa-at-6` and the
  required location-and-severity per finding exist to catch it.
- **No consequential actions.** `prohibited_actions` forbids send/spend/publish/
  delete. The failure fixture represents a run that violates this, and the
  discrimination tests confirm the graders reject it.
- **No secrets, no telemetry.** The pack ships no keys and makes no calls.

Report issues via the parent repository's security process. A confirmed serious
issue withdraws the pack from the registry before diagnosis.
