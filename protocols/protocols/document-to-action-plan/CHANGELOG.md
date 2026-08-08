# Changelog — document-to-action-plan

## [0.1.1] — candidate

### Changed
- Corrected the Agent Skills metadata and tightened the shared validation,
  evidence, provenance and release controls.
- Bound evidence to the exact pack version. The 0.1.0 model benchmark remains
  inspectable history but cannot certify 0.1.1.

### Status
- Current assurance is recomputed from the 0.1.1 pack by `verify-all`.
- Productivity evidence: `NO_IMPACT_EVIDENCE` until 0.1.1 is retested.

## [0.1.0] — deployed predecessor (historical)

### Added
- First version of the protocol: contract (`protocol.yaml`), skill (`SKILL.md`),
  README (the ten questions), worked example that doubles as the test fixture
  (a minutes excerpt and an email thread with an embedded instruction), structural
  test cases with positive, failure/boundary, and discrimination cases, the
  `dtap-core-v1` three-arm eval task set (design only, not executed), four adapters
  (generic-chat copy-and-run, Claude, Codex, local-agent), the extraction
  checklist, and the action-plan and receipt templates.

### Status
- Protocol assurance: set by the pack `RECEIPT.json` after `verify-all`.
- Productivity evidence: `NO_IMPACT_EVIDENCE` — no evaluation has been run.
