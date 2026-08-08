# Changelog — Productivity Protocols

All notable changes to the subsystem. Protocol packs keep their own changelogs;
this file tracks the institution (kernel, schema, ladders, tooling, governance).

The format is loosely [Keep a Changelog]; versions are semantic.

## [0.1.0] — unreleased (local candidate)

First complete Goal-1 candidate. Local and reviewable only — not deployed, not
published, no remote, and the live Evidence Press build is untouched.

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
Acting on an independent refute-framed review ([`review/`](review/)), after
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

### Constraints
- Standing constraints recorded in `AGENTS.md`: no publish/deploy/push/remote/
  external contact; no changes to the live site outside `protocols/`. (The live
  eval calls the OpenAI API — the model calls the user explicitly requested — and
  writes only inside `protocols/`; nothing was published or deployed.)
