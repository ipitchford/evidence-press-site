# Changelog — repetitive-workflow-capture

## [0.1.1] — candidate

### Changed
- Corrected the Agent Skills metadata and tightened the shared validation,
  evidence, provenance and release controls.
- Bound evidence to the exact pack version. Historical result records, where
  present, remain inspectable but cannot certify 0.1.1.

### Status
- Current assurance is recomputed from the 0.1.1 pack by `verify-all`.
- Productivity evidence: `NO_IMPACT_EVIDENCE`.

## [0.1.0] — deployed predecessor (historical)

### Added
- First version of the protocol: contract (`protocol.yaml`), skill (`SKILL.md`),
  README (the ten questions), worked example that doubles as the test fixture
  (a weekly-report routine with an embedded instruction, captured into a draft
  candidate), structural test cases with positive, failure/boundary, and
  discrimination cases, the `rwc-core-v1` three-arm eval task set (design only,
  not executed), four adapters (generic-chat copy-and-run, Claude, Codex,
  local-agent), the capture checklist, and the candidate-contract and receipt
  templates.

### Status
- Protocol assurance: set by the pack `RECEIPT.json` after `verify-all`.
- Productivity evidence: `NO_IMPACT_EVIDENCE` — no evaluation has been run. The
  candidate this protocol produces is likewise an unvalidated draft.
