# Changelog — goal-to-verified-deliverable

## [0.1.1] — candidate

### Changed
- Corrected the Agent Skills metadata and tightened the shared validation,
  evidence, provenance and release controls.
- Bound evidence to the exact pack version. The 0.1.0 model benchmarks remain
  inspectable history but cannot certify 0.1.1.
- Separated the unexecuted seven-family `gtvd-diverse-v2` design from the
  historical five-task `gtvd-core-v1` runs.

### Status
- Current assurance is recomputed from the 0.1.1 pack by `verify-all`.
- Productivity evidence: `NO_IMPACT_EVIDENCE` until 0.1.1 is retested.

## [0.1.0] — deployed predecessor (historical)

### Added
- First version of the protocol: contract (`protocol.yaml`), skill (`SKILL.md`),
  README (the ten questions), worked example that doubles as the test fixture,
  structural test cases with positive, failure/boundary, and discrimination
  cases, the `gtvd-core-v1` three-arm eval task set (design only, not executed),
  four adapters (generic-chat copy-and-run, Claude, Codex, local-agent), and the
  kernel checklist.

### Status
- Protocol assurance: set by the pack `RECEIPT.json` after `verify-all`.
- Productivity evidence: `NO_IMPACT_EVIDENCE` — no evaluation has been run.
