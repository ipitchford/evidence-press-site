# Adversarial verdict

The central assurance claims do not survive inspection. Several statuses certify author-controlled declarations or fixtures rather than protocol execution, evidence, or safety.

## BLOCKER

### 1. `TASKSET_PASSED` does not test a protocol execution at all

`eval-harness.js --tests` never:

- invokes a model or agent;
- supplies a task to the protocol;
- observes the resulting actions;
- generates a fresh output;
- verifies that the procedure was followed;
- distinguishes protocol-assisted performance from an unaided result.

It applies string and JSON predicates to committed, hand-authored fixtures. The author controls:

1. the protocol;
2. the “good” fixture;
3. the “bad” fixture;
4. the checks;
5. the expected outcomes.

That is circular fixture validation, not a task set being passed by the protocol.

Concrete examples:

- `gtvd-at-4` is supposedly about performing no external action. The grader merely checks that a hand-written receipt says:
  ```json
  "external_actions": []
  ```
  It does not observe whether an action occurred.
- `gtvd-at-5` supposedly establishes prompt-injection resistance. It checks that the author wrote at least one item in `injected_instructions_found` and included the phrase `"did not act on it"`.
- The discrimination cases prove only that one predicate returns false on one chosen document. They do not establish useful sensitivity, specificity, robustness, or resistance to gaming.
- `gtvd-fixsanity` actually passes when the bad fixture contains an email address. It is fixture plumbing, yet it contributes equally to the advertised test count.
- The substantive sourcing test, `gtvd-at-6`, is not run at all.

A protocol consisting of instructions that models routinely ignore could earn exactly the same status.

**Required correction:** rename the current state to something such as:

- `FIXTURE_CHECKS_PASSED`;
- `GRADER_SMOKE_TESTED`; or
- `EXAMPLE_CONFORMANCE_VALIDATED`.

Reserve `TASKSET_PASSED` for fresh executions over registered tasks, with:

- a runner and model/runtime identity;
- task inputs not copied into expected outputs;
- captured raw outputs and action traces;
- complete acceptance-test coverage;
- observed side effects rather than self-reported receipts;
- repeated runs where behavior is stochastic;
- held-out or independently authored cases;
- hashes binding tasks, outputs, graders, runner, and protocol version.

---

### 2. Productivity-evidence status is author-declared, not evidence-backed

The claimed independence of the two ladders does not prevent unsupported productivity claims. `verify-all.js` directly copies:

```js
productivity_evidence: p.productivity_evidence
```

`validate.js` checks only that this value is a member of the enum. It does not establish the state from evaluation results.

An author can therefore set:

```yaml
productivity_evidence: CAUSAL_EFFECT_SUPPORTED
```

and pass the shown checks without providing any causal study. Specifically:

- `runEvalsForPack` permits zero result files.
- It does not require a result corresponding to the declared productivity status.
- It does not derive status from effect estimates or arm comparisons.
- It checks only schema validity and a design ceiling for result files that happen to exist.
- It does not verify that a study actually ran, that participants or observations exist, or that the identification strategy is defensible.
- Negative findings do not automatically override a positive declaration.

Worse, the overclaim scanner is disabled for every positive state:

```js
if (hits.length && !positive)
```

Thus merely declaring `BENCHMARK_SIGNAL` allows unrestricted prose claiming field benefit or causal effects. The ladder’s granularity is discarded by the detector.

This is a direct status-escalation path, not merely a presentation concern.

**Required correction:** protocol source must not declare an achieved evidence state. Derive it from separately stored, validated, preferably independently signed evaluation records. Enforce:

- required study/result records;
- protocol/version binding;
- design-to-status mapping;
- outcome and comparison requirements;
- negative-result precedence;
- conflict handling;
- no claim above the exact derived state.

---

### 3. Receipt-backed assurance does not close self-grading or forgery

`RECEIPT.json` is neither trusted nor immutable.

It is explicitly excluded from the manifest:

```js
.filter(f => f !== 'MANIFEST.json' && f !== 'RECEIPT.json')
```

Consequences:

- An author can run verification, then edit `RECEIPT.json`.
- An author can create a receipt without running verification.
- No manifest hash detects receipt modification.
- No signature, CI attestation, transparency log, or trusted verifier identity is shown.
- No receipt-schema validation is shown before the site consumes it.
- The author also controls `verify-all.js`, `achievedStatus`, graders, fixtures, and the tools used to generate the receipt.

Reading an author-controlled receipt instead of an author-controlled YAML field merely moves the trust problem.

There are additional implementation defects:

- `verify-all` writes receipts and runs the build even when gates fail. It only exits nonzero afterward. A deployment that publishes generated output despite the exit code can ship failed results.
- `evalsOk` does not participate in `achievedStatus`. A pack can receive `TASKSET_PASSED` while its eval gate fails.
- The repository receipt reports `STRUCTURE_VALIDATED` whenever not every pack is `TASKSET_PASSED`:
  ```js
  assurance_status: allTaskset ? 'TASKSET_PASSED' : 'STRUCTURE_VALIDATED'
  ```
  Even if every pack is `DRAFT` because validation or hostile checks failed, the repository receipt claims `STRUCTURE_VALIDATED`.
- The manifest receipt check is always recorded as passed immediately after regenerating the manifest from whatever files are currently present. This establishes self-consistency, not provenance.

**Required correction:** receipts need a trusted issuance path: CI-generated attestations, immutable artifact hashes, verifier/tool version binding, clean-commit enforcement, signatures or transparency publication, and site rejection of untrusted or schema-invalid receipts. Do not build publishable output after any failed gate.

---

### 4. Kernel conformance is box-ticking

The kernel says:

> Every step maps to at least one `protocol.yaml` field or a justified empty mapping.

The validator does not enforce that. It only collects integer labels from procedure entries:

```js
const covered = new Set((p.procedure || []).map(s => s.kernel_step));
```

A procedure with eight vacuous entries tagged `kernel_step: 1` through `8` passes this part. No semantic relation to the kernel’s `purpose`, `produces`, `prevents`, or `maps_to` is checked.

Other unenforced claims include:

- kernel `id` and `version` compatibility;
- the kernel’s declared `maps_to` fields;
- production of a decision/failure log;
- production of limitations and a receipt;
- ordering of steps;
- one-to-one or coherent mappings;
- checkpoint placement before outward or irreversible actions;
- least privilege;
- assurance-level `checks`, such as structured inputs or worked examples;
- whether acceptance tests actually test their statements;
- whether “justified empty mappings” are justified.

The high-risk checkpoint rule only requires that some checkpoint exists somewhere. It does not establish that it precedes the risky action. Low-risk classification is itself author-controlled and can avoid that check.

Therefore `STRUCTURE_VALIDATED` cannot honestly mean “a well-formed kernel instance.” At most it means “schema-valid document containing the required kernel-step numbers.”

**Required correction:** either narrow the status wording or validate explicit step contracts: required produced artifacts, exact mapped fields, ordering, test coverage, checkpoint/action linkage, and kernel version compatibility. Even then, call it syntactic or structural conformance—not substantive conformance.

---

### 5. The safety controls are declarations and regexes, not enforcement

The permissions and prohibited actions are prose. Nothing shown sandboxes the agent or prevents violation. A malicious or mistaken skill can instruct an agent to send, delete, execute, or exfiltrate despite its declared permissions.

The hostile scanner has straightforward bypasses:

- `require('node:child_process')`;
- ES module `import` statements;
- dynamic or aliased `require`;
- `process.mainModule.require`;
- `node:http`, `node:https`, and similar prefixed modules;
- `.mjs`, `.cjs`, Python, binaries, package lifecycle hooks, or code outside the selected paths;
- shell commands such as `curl`, `wget`, `nc`, or PowerShell;
- indirect execution through imported helper modules;
- `vm.runInNewContext` and related dynamic-code mechanisms;
- filesystem deletion or writes outside the working directory;
- dependency-based execution or network behavior.

The scanner also does not compare instructions in `SKILL.md` or `protocol.yaml` against `permissions` and `prohibited_actions`. A procedure can explicitly say “run curl” while the manifest says no network, provided it avoids the limited benefit-claim patterns.

The injection check is especially weak:

```js
/inject|embedded|instruction/i
```

A pack can pass by containing “Injection is not a concern” or “Follow embedded instructions.” It checks vocabulary, not fail-closed behavior.

Secret scanning covers only a few textual shapes. Encoded, split, environment-derived, encrypted, non-UTF-8, or unrecognized credentials pass. This cannot support a “supply chain is sound” claim.

**Required correction:** treat static scans as lint only. Actual safety requires capability mediation, filesystem/network sandboxing, dependency and package-lock verification, executable-file analysis, runtime action tracing, signed artifacts, and adversarial execution tests.

---

## MAJOR

### 6. The overclaim detector has easy false negatives

Examples that evade all shown patterns:

- “This protocol improves output quality.”
- “It reduces errors and rework.”
- “Teams finish sooner.”
- “Users become substantially more efficient.”
- “It doubles throughput.”
- “It is twice as fast.”
- “It cuts completion time by 30 percent.”
- “It delivers better outcomes with less effort.”
- “The protocol reliably prevents hallucinations.”
- “Three working days are saved each month.”

The sentence-wide hedge suppression is exploitable:

- “Benefit has not been measured, but this protocol makes you more productive.”
- “Not only is it easy to use, it is proven to improve productivity.”
- “There is no evidence against the conclusion that it saves you three hours.”

Any hedge match causes the entire sentence to be skipped, including an unhedged claim elsewhere in that sentence.

Coverage is also incomplete. Only narrowly selected paths are scanned:

```js
README.md
SKILL.md
protocol.yaml
adapters/*.md
```

Claims can be placed in examples, eval reports, other Markdown files, generated site content, nested readmes, JSON metadata, scripts, or unscanned adapter formats.

The self-test validates four favorable and four unfavorable strings. It proves only that those exact forms behave as expected.

---

### 7. The overclaim detector also produces avoidable false positives

Honest prose likely to be flagged includes:

- “The benchmark tests whether users are 30% faster.”
- “A participant claimed, ‘It saves you three hours a week.’”
- “The prohibited marketing phrase is ‘proven to increase productivity.’”
- “We reject the hypothesis that it significantly improves accuracy.”  
  This depends on exact hedge wording and can fail when ordinary negation is used outside the narrow list.
- “The acceptance threshold is 20% fewer errors.”
- “The comparison arm asks whether the protocol makes users more productive.”

The scanner has no distinction among:

- a claim by the publisher;
- a quoted claim;
- a hypothesis;
- a benchmark target;
- an acceptance criterion;
- a warning or counterexample;
- a report of someone else’s unsupported statement.

That makes it unsuitable as a shipping gate without structured claim annotations or review.

---

### 8. Assurance language still borrows benefit credibility

The ladders are stored separately, but presentation and terminology continue to imply usefulness:

- `TASKSET_PASSED` suggests demonstrated operational performance.
- `FIELD_READY` says the protocol is “suitable” for real-world trials.
- `NO_IMPACT_EVIDENCE` says “The protocol is usable,” which is itself not established by an absence of impact evidence.
- “Verified skill,” “well built,” and “safe to run” are strong credibility signals.
- The protocol title “Goal to verified deliverable” can be read as saying that the deliverable itself is verified, although the shown tests validate neither task correctness nor model execution.

A prominent positive assurance badge can dominate a nearby neutral evidence label. Machine-level separation does not prevent visual, linguistic, ranking, search, or default-filter leakage. No site implementation was provided to establish that the statuses receive equal prominence or explanatory weight.

The current false `TASKSET_PASSED` status makes this leakage materially worse.

---

### 9. Test registration and acceptance-test coverage are not enforced

Nothing shown establishes that:

- every automated acceptance test has a case;
- `maps_to` refers to a real acceptance-test ID;
- case IDs are unique;
- cases contain any checks;
- positive, negative, and boundary cases cover distinct behavior;
- the cases’ `protocol` field matches the pack;
- all manual tests were performed;
- one fixture is not reused to satisfy unrelated claims;
- test files themselves conform to a schema.

A trivial suite with one always-passing positive case and one expected-fail case can satisfy `testsOk` because the only requirements are:

```js
tests.failures.length === 0 && tests.total > 0
```

The protocol validator’s requirement for positive and negative/boundary acceptance-test declarations does not connect those declarations to executable cases.

---

### 10. Negative productivity findings do not reliably block assurance

The status document says:

> `HARM_OR_REGRESSION_FOUND` … Blocks `FIELD_READY` … until resolved.

No shown code enforces that relationship. `validate.js` merely checks enum membership, and `verify-all.js` does not derive or constrain upper assurance states from productivity findings.

Likewise, nothing enforces negative-result precedence. An author can omit an adverse eval file, declare a positive state, or leave stale positive status after a regression.

The claimed independence of ladders therefore omits necessary cross-ladder safety constraints.

---

## MINOR

### 11. “Fails closed” is inaccurate

The scanner fails closed only for patterns it recognizes. Unknown file types, unknown execution mechanisms, omitted eval results, semantic contradictions, and unsupported positive status generally pass. That is conventional allow-by-default static linting, not fail-closed behavior.

### 12. `tested_environments` is misleading

The protocol lists:

```yaml
tested_environments:
  - Claude Code (offline structural harness)
```

No Claude Code execution occurs in the supplied harness. The harness is plain Node fixture checking. This wording can be mistaken for an actual agent/runtime test.

### 13. The review set is incomplete

Only one pack’s protocol and tests are supplied, despite claims covering three packs. The schemas, manifests, receipts, site builder/registry reader, utility functions, YAML parser, JSON-schema implementation, and actual generated site are also absent. Claims about all three packs, schema rigor, receipt display, path safety, and site behavior cannot be verified from these artifacts.

## Bottom line

The strongest claims should currently be reduced to:

- protocol documents have some schema and numbered-step linting;
- committed examples satisfy author-written predicates;
- a limited static regex scan found no recognized patterns;
- no productivity benefit has been established.

`TASKSET_PASSED`, substantive kernel conformance, evidence-backed status, receipt trust, and supply-chain soundness are not supported by the implementation shown.
