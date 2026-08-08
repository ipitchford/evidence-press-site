# Changelog — spreadsheet-quality-audit

## [0.1.0] — unreleased (local candidate)

### Added
- First version of the protocol: contract (`protocol.yaml`), skill (`SKILL.md`),
  README (the ten questions), worked example that doubles as the test fixture (a
  sales table with a seeded total/row inconsistency, a formula error, a unit
  mismatch, a missing cell, a suspicious value, and an embedded instruction in a
  cell), structural test cases with positive, failure/boundary, and discrimination
  cases, the `sqa-core-v1` three-arm eval task set (design only, not executed), four
  adapters (generic-chat copy-and-run, Claude, Codex, local-agent), the audit
  checklist, and the audit and receipt templates.

### Status
- Protocol assurance: set by the pack `RECEIPT.json` after `verify-all`.
- Productivity evidence: `NO_IMPACT_EVIDENCE` — no evaluation has been run.
