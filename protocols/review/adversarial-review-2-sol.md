# Verdict

**Claim 1 is only partially true.** The offline rename/cap and failed-build behavior are genuinely implemented. However, the new live assurance rung and productivity backing remain author-asserted in crucial places. The implementation still self-grades the facts that matter most.

**Claim 2 is not established by the supplied code or artifacts.** The reported numbers may be genuine, and retaining the negative result is commendable, but `TASKSET_PASSED` is granted from an unverified JSON boolean. The comparison also lacks enough controls and provenance to support the stronger interpretation that the protocol itself lowered quality.

## BLOCKER

### 1. `TASKSET_PASSED` is still self-attested, now through a live-result JSON field

`liveAssurance()` grants the rung from:

```js
if (d.taskset_passed === true) {
  anyPass = true;
  ...
}
```

It does **not** derive that boolean from:

- the `agent_with_protocol` arm;
- `acceptance_pass_rate`;
- per-task acceptance outcomes;
- captured raw outputs;
- grader execution;
- task count;
- the current pack ID or version;
- recomputed task/output hashes.

Consequently, a schema-valid result containing `"taskset_passed": true` earns `TASKSET_PASSED`, even if the underlying outputs are absent, stale, unrelated, or failed. This is structurally the same trust defect as the original blocker, one layer removed.

The function comment claims:

> “agent_with_protocol arm passed acceptance on a named model”

but the code never checks that proposition.

The ladder additionally requires hashes binding the task, output, grader, runner, and protocol version. The shown result has task/output hash strings but no grader hash, runner hash, or protocol artifact hash, and `liveAssurance()` verifies none of them.

**Required fix:** derive `taskset_passed` inside the trusted verifier from per-task records and fresh grader results; bind and recompute all artifacts; require `protocol_id` and `protocol_version` to match the current pack; reject rather than ignore malformed purported live results.

---

### 2. Cross-model reproduction can be fabricated by one result’s metadata

This code:

```js
(d.runner.models || []).forEach(m => models.add(m));
...
models.size >= 2 ? 'CROSS_MODEL_REPRODUCED' : 'TASKSET_PASSED'
```

allows one JSON result to list two model names and receive `CROSS_MODEL_REPRODUCED`. It does not require:

- two distinct runs;
- outputs attributable to each model;
- each model independently passing;
- materially consistent outcomes;
- distinct runtimes or implementations.

That directly contradicts the ladder’s “live runs (>= 2 models, consistent)” gate.

This is a dormant blocker for the next rung even though the flagship currently lists only one model.

---

### 3. “Positive productivity states require measured evidence” is syntactic, not evidentiary

The backing condition defines “measured” as:

```js
const measured = d =>
  (d.arms || []).some(a =>
    Object.values(a.metrics || {}).some(v => v !== null));
```

Thus any single non-null value—including `safety_events: 0`—makes the result measured. The validator then trusts the author-supplied:

```js
d.implied_evidence_status
d.design
```

It does not derive an effect, require a comparator, establish direction, check sample size, check uncertainty, or verify that the metric supports the claimed benefit.

A hand-authored result with an eligible design, one non-null metric, and a positive `implied_evidence_status` can unlock a positive state. Even if another harness schema-validates the document, the substantive conclusion remains self-declared.

The remediation therefore closes “positive status with no result file,” but not “positive status without measured support for the claimed effect.”

**Required fix:** compute implied status from validated arm outcomes and design properties; enforce minimum observations and required metrics per status; do not accept `implied_evidence_status` as authoritative input.

## MAJOR

### 4. The acceptance bar grants `TASKSET_PASSED` too cheaply

The flagship simultaneously reports:

- acceptance pass rate: `1.00`;
- quality: `0.824`;
- accuracy: `0.60`;
- worse quality and accuracy than the control.

That demonstrates that “task set passed” can mean little more than completion plus basic safety/conformance. This is not necessarily wrong for a narrowly scoped conformance rung, but the current name is broader than the bar.

The ladder carefully separates assurance from productivity, which helps, but users can still reasonably read `TASKSET_PASSED` as satisfactory task performance. A run with 40% apparent accuracy failures receiving the badge is strong evidence that the name continues to borrow credibility.

A more honest name would be something like:

- `LIVE_ACCEPTANCE_CONFORMANCE_VALIDATED`, or
- `LIVE_OUTPUTS_PASSED_MINIMUM_GATES`.

At minimum, the badge should display the actual acceptance dimensions and explicitly state that quality and accuracy may be poor.

---

### 5. The with/without comparison does not isolate the protocol’s effect

The finding may be real for the exact prompts used, but the causal interpretation is under-controlled. The supplied materials do not establish:

- paired or randomized task execution;
- equal token/output budgets;
- equal system prompts and context;
- equal sampling parameters;
- run order or contamination controls;
- a pre-registered rubric;
- per-task judge scores;
- judge prompt and judge outputs;
- repeated generations;
- uncertainty or significance;
- that both arms received equally clear format constraints.

Most importantly, FINDINGS says the protocol arm was made to emit a full contract, step log, limitations, and receipt on Quick-appropriate tasks. If the protocol includes a proportionality rule that should select a lighter procedure, forcing the heavyweight edition tests a **misapplication or one edition**, not the protocol’s overall effect.

This sentence overreaches:

> “This is the proportionality principle, measured.”

The evaluation appears to measure the cost of applying excessive ceremony to concise tasks. It does not show that the protocol correctly operationalizes proportionality, nor that a properly selected Quick implementation has the same regression.

A fairer conclusion is:

> “The evaluated verbatim/full-transcript implementation performed worse on these five concise tasks.”

---

### 6. The live run’s provenance is not independently auditable from the supplied implementation

The result says `o4-mini` generated outputs and `gpt-5.2` judged them blindly, but those facts are metadata from the same result file. The supplied code does not authenticate provider responses or reconstruct the judge process.

The raw JSONL, task set, runner implementation, grader implementation, rubric, and judge transcript are referenced but not supplied here. Therefore the following cannot be checked:

- whether outputs were fresh;
- whether both arms used the same tasks;
- whether the judge was actually blind;
- whether metrics were computed from those outputs;
- whether hashes correspond to the referenced files;
- whether cherry-picking occurred.

This does not prove fabrication. It means the “honest and not gamed” claim is **unverified**, while the assurance code treats it as established.

---

### 7. The receipt-trust limitation is candid generally, but omits the decisive live-evidence gap

`KNOWN-LIMITATIONS.md` honestly admits author-controlled tools, unsigned receipts, and lack of tamper-proofing. That part survives.

But it frames rerunning `verify-all` as reproducibility. For the live rung, rerunning `verify-all` does not rerun the model or judge; it rereads the committed JSON and trusts `taskset_passed`. It therefore reproduces the **assertion**, not the experiment.

The limitation should explicitly say:

- live status is currently based on an unsigned result document;
- `taskset_passed` is not independently recomputed;
- model and judge identities are not authenticated;
- declared hashes are not recomputed by `liveAssurance`;
- replaying `verify-all` does not replay the live evaluation.

Without that disclosure, the trust gap is only partially scoped.

---

### 8. The negation/meta guard remains broadly bypassable

Clause splitting is an improvement, but `HEDGE` suppresses the entire remaining clause whenever it finds a marker. Concrete evasions include:

```text
There is no evidence required because this protocol reduces errors.
```

```text
The criterion is simple: the protocol improves quality.
```

```text
We test whether it reduces errors and it improves output quality.
```

```text
It does not merely document the work and reduces rework.
```

A colon, conjunction, or causal phrase is enough to keep the hedge and live claim in one parser-defined clause.

The meta markers are especially broad:

```js
whether
criterion
threshold
hypothes
prohibited
comparison arm
```

They are not tied syntactically to the matched claim. Any occurrence can exempt an otherwise affirmative claim.

Coverage is also path-based. Library-authored benefit claims can evade scanning by appearing in other Markdown, site content, status prose, findings, or an unrecognized adapter path.

This scanner is genuinely hardened relative to the earlier version, but it remains a heuristic lint and cannot support a strong “overclaim closed” claim.

---

### 9. The security scanner remains easy to evade despite genuine hardening

The added patterns are useful, but straightforward gaps remain:

```js
import('node:child_process')              // dynamic import
import 'node:net'                         // side-effect import; no "from"
require /* comment */ ('child_process')   // formatting bypass
module.createRequire(...)(name)
globalThis['fetch'](...)
```

Non-JavaScript execution routes such as Python `subprocess`, `os.system`, Ruby process execution, package-manager scripts, Makefiles, HTML, YAML hooks, binaries, and extensionless executable files are not meaningfully covered.

The injection check remains declaration-based:

```js
/instruction/i
kind === 'boundary'
/inject|embedded|instruction/i
```

It verifies vocabulary and the existence of a boundary-labelled test, not that the test executes the protocol against hostile content or rejects compliance.

This is not a blocker only because the code and limitations now accurately call it an allow-by-default lint rather than a sandbox.

## MINOR

### 10. `verify-all.js` contains a stale and materially false header comment

The header says:

> “Offline gates can reach TASKSET_PASSED”

The implementation correctly caps offline execution at `EXAMPLE_CONFORMANCE_VALIDATED`. The later comment is correct. This should be fixed because it describes the central assurance boundary.

---

### 11. FINDINGS reports “grounding” not represented in the shown machine-result metrics

FINDINGS reports:

> Grounding: 1.00 / 1.00

The shown result schema instance has no grounding metric. Perhaps grounding is derived elsewhere, but that derivation is not visible or bound here. Machine-readable findings should include the metric or identify the source and calculation.

---

### 12. “Quality/cost regression” should be phrased descriptively, not inferentially

With five tasks and one judge, the observed means are lower quality and roughly 3.25× estimated cost. Calling this `NO_CLEAR_GAIN` is conservative and fair. Calling it an established protocol-level regression without uncertainty is stronger than the design supports.

Prefer:

> “In this five-task run, the protocol arm received a lower mean judge score and had approximately 3.25× estimated cost.”

## Remediations that do survive review

- **Rename and offline ceiling:** genuinely implemented. Offline checks now cap at `EXAMPLE_CONFORMANCE_VALIDATED`.
- **`evalsOk` included in the example gate:** implemented.
- **Build skipped after any failed gate:** implemented in `verify-all.js`.
- **Repository assurance is the minimum pack assurance:** implemented.
- **Negative findings block positive declared states:** implemented for recognized result files.
- **Scanner hardening:** real, though incomplete and correctly characterized as lint.
- **Receipt trust gap:** candidly acknowledged at the general author/CI level, but incompletely scoped for live-run verification.
- **Retaining `NO_CLEAR_GAIN`:** good practice. The label itself is appropriately conservative.

## Bottom line

The remediation fixed the original **offline relabelling defect**, but it did not yet create a trusted live-assurance path. `TASKSET_PASSED` is presently awarded from a schema-valid, author-controlled boolean rather than recomputed evidence. That remains a blocker.

The negative result is plausible and commendably retained, but the strongest defensible conclusion is limited to the observed implementation and task set. The supplied code cannot establish that the run was fresh and blind, and the comparison does not isolate the protocol from an intentionally heavyweight application of it.
