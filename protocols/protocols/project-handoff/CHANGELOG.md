# Changelog — project-handoff

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
  (a set of search-reindex working notes and a handover message with an embedded
  instruction), structural test cases with positive, failure/boundary, and
  discrimination cases, the `ph-core-v1` three-arm eval task set (design only, not
  executed), four adapters (generic-chat copy-and-run, Claude, Codex, local-agent),
  the handoff checklist, and the handoff and receipt templates.

### Status
- Protocol assurance: set by the pack `RECEIPT.json` after `verify-all`.
- Productivity evidence: `NO_IMPACT_EVIDENCE` — no evaluation has been run.
