# Changelog — Productivity Protocols

All notable changes to the subsystem. Protocol packs keep their own changelogs;
this file tracks the institution (kernel, schema, ladders, tooling, governance).

The format is loosely [Keep a Changelog]; versions are semantic.

## [0.2.0-candidate.1] — 2026-08-08

### Changed

- Reviewed the committed predecessor in a standalone subtree-history checkout,
  then selectively integrated the evidence, security and company-study repairs
  into the Evidence Press host while retaining its deployed house shell, media
  and pack-specific scripts.
- Reframed the entry product from an expert-facing registry to one supported,
  low-consequence company trial around `document-to-action-plan`.
- Added a readiness/governance screen and a registered three-arm comparison:
  manual work, the same agent without the protocol, and the same agent with it.
- Defined the primary estimand as the incremental protocol effect (agent with
  protocol minus the same agent without it), with manual work as a secondary
  comparator and human effort/error/rework/adoption outcomes kept separate.
- Added a bounded prior-art record. Agent Skills and Oracle Agent Spec are
  explicitly treated as prior art; no new workflow-language or priority claim is
  made.
- Added NIST/UK/NCSC governance crosswalk material with an explicit
  non-certification and non-compliance boundary.
- Reworked the static candidate for novice business language, local-only data,
  CSP-compatible external assets, responsive use and a visible evidence spine.
- Added candidate/public ledger and post-deploy integrity controls. Deployment
  remains prohibited for this candidate.

### Evidence boundary

- The predecessor `0.1.0` model benchmarks remain in the record: the three live
  evaluated protocols showed `NO_CLEAR_GAIN`; five had no impact measurement.
- All changed distributable packs are now `0.1.1`. The verifier refuses to carry
  the 0.1.0 run rungs or evidence onto changed bytes, so every current pack is
  capped at example conformance with `NO_IMPACT_EVIDENCE` until retested.
- No company or human participant has tested this candidate. Company impact is
  therefore `NO_IMPACT_EVIDENCE`, irrespective of passing structural tests.

## [0.1.0] — 2026-08-08 (historical deployed predecessor)

First complete Goal-1 candidate. It began as a local candidate and was later
merged and deployed at `/protocols/`. Candidate-time entries below are retained
as chronology; they are not a current deployment statement.

### Added
- Verified Agent Work kernel `v0.1.0` (`kernel/`): eight-step method, three
  assurance levels, machine-readable `kernel.yaml`.
- Protocol contract schema and four supporting schemas (`schema/`).
- Two independent status ladders — protocol assurance and productivity evidence
  (`status/`).
- Institutional contract (`AGENTS.md`), governance/foundry model
  (`GOVERNANCE.md`), supply-chain security policy (`SECURITY.md`), contribution
  guide, dual licence.
- Three protocol packs: `goal-to-verified-deliverable`,
  `document-to-action-plan`, `evidence-backed-brief`.
- Tooling: `validate.js`, `eval-harness.js`, `hostile-tests.js`, `registry.js`,
  `make-receipt.js`, `verify-all.js`, and the `build-protocols.js` static-site
  builder with commit-derived, hash-pinned, byte-identical output.
- Machine-readable endpoints: `protocols.json` registry, schemas, `feed.json`,
  `feed.xml`, `llms.txt`, `llms-full.txt`, `sitemap.xml`.
- Repository replay receipt (`RECEIPT.json`) reproducible from a clean checkout.

### Adversarial-review remediation (pre-release, same version)
Acting on a fresh role-separated refute-framed model review ([`review/`](review/)), after
verifying each finding against the code:
- **Renamed the offline assurance rung** to `EXAMPLE_CONFORMANCE_VALIDATED` and
  redefined `TASKSET_PASSED` to require a recorded live run. The offline toolchain
  no longer claims a live-run status it cannot earn.
- **Evidence-backing is enforced:** a positive `productivity_evidence` state now
  requires a measured eval result (design ceiling ≥ state); negative results take
  precedence. Closes the "declare a benefit for free" path.
- **Overclaim detector hardened:** clause-level hedging, broadened patterns,
  meta-context guards; scoped and documented as a heuristic backstop.
- **Scanner hardened:** `node:` modules, ES `import`, dynamic require, `vm`,
  shell commands; stronger injection requirement; reframed as lint, not sandbox.
- **verify-all fixed:** `evals` folded into achieved status; build refused on any
  failed gate; repo status is the minimum across packs; build rejects a
  schema-invalid / wrong-subject / failed-gate receipt.
- **Test registration enforced;** kernel version + maps_to population checked;
  honest rewording of `STRUCTURE_VALIDATED`, `NO_IMPACT_EVIDENCE`,
  `tested_environments`, and "fails closed".
- Added [`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md) stating what the offline
  gates do and do not establish, and the residual gaps left open by design.

### Live evaluation
- Added a real live-eval runner (`tools/run-eval.js` + `tools/lib/model.js`,
  dev-only, network-using, kept OUT of every pack) that runs a two-arm benchmark
  (agent-with-protocol vs bare) over concrete tasks, grading completion and
  compliance deterministically (with a negation guard) and quality/grounding/
  injection-following with a blind judge model.
- Ran it on `goal-to-verified-deliverable` (runner `o4-mini`, blind judge
  `gpt-5.2`, 5 tasks). Fresh outputs passed the acceptance tests → the pack earned
  **`TASKSET_PASSED`** (assurance now computed from the live result, not declared).
  Measured productivity: **`NO_CLEAR_GAIN`** — both arms safe and complete; the
  protocol lowered concise-deliverable quality (0.82 vs 0.98) at ~3× cost. Honest
  negative result, retained. See the pack's `evals/FINDINGS.md`.
- `verify-all` now raises a pack to `TASKSET_PASSED` (or `CROSS_MODEL_REPRODUCED`
  with ≥2 models) only from a schema-valid live result whose with-protocol arm
  passed acceptance; the eval-result schema gained a provenance/runner block.

### Expansion + second review (2026-08-08, same candidate)
- Grew from 3 to **8 protocols**: added project-handoff, spreadsheet-quality-audit,
  decision-memo-under-uncertainty, adversarial-output-review, repetitive-workflow-capture.
- **Second role-separated adversarial model review (Sol)** — its central hit (live
  `TASKSET_PASSED` still self-attested) fixed: `liveAssurance` now RECOMPUTES
  acceptance from the committed raw outputs (`tools/lib/graders.js`), binds by
  SHA-256 to task-set/outputs/pack/version, and rejects tampering; cross-model
  needs ≥2 separate passing runs; positive states need a recomputed with>without
  improvement; overclaim + security scanners further hardened; a factual error in
  FINDINGS corrected (accuracy 0.80/0.60); live-run trust scoped in KNOWN-LIMITATIONS.
- **Live evaluations:** document-to-action-plan and evidence-backed-brief earned
  `TASKSET_PASSED`; goal-to-verified-deliverable earned `CROSS_MODEL_REPRODUCED`
  (o4-mini + gpt-5.2). All three measured protocols: `NO_CLEAR_GAIN` (retained). A
  concise deliverable-only edition recovered most of the quality and halved cost —
  still no gain. Harness hardened: retry/backoff, multiple judges, shared graders.
- **Foundry operations:** `tools/submit-check.js` (intake gate), `tools/deprecate.js`
  (drill-exercised end-to-end), `foundry/` (proposal template + process). **CI +
  attestation:** `ci/verify-protocols.yml` (template) + `tools/attest.js` (signable
  digest over all receipts) — the reproducible→trusted path, authored not activated.
- **Accessibility:** minimum-model + French editions (flagship), a print stylesheet,
  `ACCESSIBILITY.md`. **Deploy integration** authored non-destructively (`deploy/`),
  verified into a temp mount, and NOT run. Clean-checkout replay proven; both themes
  visually QA'd.

### Candidate-time constraints (later superseded)
- The initial standing constraints prohibited publish/deploy/push/remote/external
  contact. Subsequent explicit maintainer instructions superseded the publication
  constraint, and the `0.1.0` subtree was merged and deployed. The live evals used
  model API calls and wrote their outputs into the protocol subtree.
