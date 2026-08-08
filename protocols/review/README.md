# Adversarial review and response

A fresh role-separated adversarial model reviewer (Sol / `gpt-5.6-sol`), framed
to **refute**, reviewed the v0.1.0 candidate. This was not external or institutional
independence. The full review is in
[`adversarial-review-sol.md`](adversarial-review-sol.md). Every finding was
verified against the actual code before any change — a refute-framed review is a
set of hypotheses, not verdicts. This file records the verdict and action for
each.

The review was decisive and largely correct. Its central point — that several
statuses certified author declarations or fixtures rather than protocol
execution — was right, and the most important change below (the rename of
`TASKSET_PASSED`) follows directly from it.

## Blockers

| # | Finding | Verdict | Action |
|---|---|---|---|
| 1 | `TASKSET_PASSED` tests no execution — it is circular fixture validation | **Confirmed** | Renamed the offline rung to `EXAMPLE_CONFORMANCE_VALIDATED`; redefined `TASKSET_PASSED` to require a recorded live run. Updated ladder, three schema enums, `verify-all` (offline now caps at the new rung), harness labels, and all prose. |
| 2 | Productivity status is author-declared; enum-only; overclaim scanner disabled for positive states | **Confirmed** | `validate.js` now requires a *measured* eval result (design ceiling ≥ state) to back any positive productivity state; negative results take precedence. Overclaim detector no longer disables on positive states — it gates on `CAUSAL_EFFECT_SUPPORTED`. Barrier proven to fire. |
| 3 | Receipt not trusted/immutable; build runs on failed gates; `evalsOk` absent from status; repo status wrong | **Confirmed (bugs) + partly scope** | Build now refuses a schema-invalid / wrong-subject / failed-gate receipt and is skipped entirely when any gate fails. `evalsOk` folded into achieved status. Repo status is now the minimum across packs. True tamper-proofing (CI signing) documented as not-yet-done in `KNOWN-LIMITATIONS.md`. |
| 4 | Kernel conformance is box-ticking; `STRUCTURE_VALIDATED` overclaims | **Confirmed** | Added kernel-version match and maps_to-population checks. Reworded `STRUCTURE_VALIDATED` and the schema description to "structural, not semantic" conformance. Full semantic conformance is stated as unverifiable offline. |
| 5 | Safety = declarations + regex, not enforcement; scanner bypasses; weak injection check; shallow secrets | **Confirmed** | Scanner extended: `node:` prefix, ES `import`, dynamic require, `vm`, `process.mainModule`, shell commands (curl/wget/nc…). Injection check now requires a prohibited-action + a boundary test + a stop condition, not just vocabulary. Reframed as lint, not sandbox; runtime enforcement documented as the runtime's job. |

## Major

| # | Finding | Verdict | Action |
|---|---|---|---|
| 6 | Overclaim false negatives; sentence-wide hedge exploitable | **Confirmed** | Broadened claim patterns (reduces errors, finish sooner, more efficient, prevents hallucinations, better outcomes, cuts time, spelled-out percentages…). Hedge handling is now **clause-level**, so a leading hedge cannot excuse a trailing claim. Self-test extended with the clause-evasion case. |
| 7 | Overclaim false positives on honest meta-prose | **Confirmed** | Added meta-context hedge markers (whether / threshold / criterion / hypothesis / prohibited / comparison arm). The detector immediately caught two *real* inherited overclaims ("reduces error") in the sibling packs, which were reworded. Residual quoted-claim FP documented. |
| 8 | Assurance language still borrows benefit credibility | **Confirmed (wording)** | Folded into the #1 rename. Reworded `NO_IMPACT_EVIDENCE` (no longer asserts "usable"), `FIELD_READY`, and the offline harness labels. |
| 9 | Test registration / coverage not enforced | **Confirmed** | `validate.js` now checks: cases exist, `maps_to` references a real acceptance test, ids are unique, cases have checks and known fixtures, the `protocol` field matches, and every *automated* acceptance test has a case. |
| 10 | Negative findings do not block assurance in code | **Confirmed** | `validate.js` now enforces negative-result precedence and blocks `FIELD_READY` under `HARM_OR_REGRESSION_FOUND`. |

## Minor

| # | Finding | Verdict | Action |
|---|---|---|---|
| 11 | "Fails closed" is inaccurate | **Confirmed** | Reworded to "allow-by-default static lint; fails closed only on recognised patterns." |
| 12 | `tested_environments` misleading | **Confirmed** | Changed to "offline structural harness (Node; checks shipped examples, runs no model)" in all three packs. |
| 13 | Review set incomplete | **Acknowledged** | True — one pack + core tools were shared. Findings about unshown code were verified against the real files before acting; some (e.g. the schema's `minItems`/`required` rigour) were already present. |

## What was deliberately NOT "fixed"

Some findings describe limits inherent to a static, offline, single-author
candidate rather than bugs to patch: runtime capability mediation and sandboxing,
CI-issued and signed receipts, exhaustive secret detection, and true semantic
kernel conformance. Pretending to close these in code would be its own overclaim.
They are stated instead in [`../KNOWN-LIMITATIONS.md`](../KNOWN-LIMITATIONS.md) and
scoped as the path from this candidate to a trusted, deployed institution.

---

# Second review — after remediation + the live eval

Full text: [`adversarial-review-2-sol.md`](adversarial-review-2-sol.md). This review
judged the remediated code and the live-eval result. Its central hit was correct
and important: **the live `TASKSET_PASSED` was still self-attested** — granted from
a runner-written boolean, the original defect one layer removed. Every finding was
verified against the code before acting.

| # | Finding | Verdict | Action |
|---|---|---|---|
| B1 | `TASKSET_PASSED` granted from an author `taskset_passed` boolean | **Confirmed** | `liveAssurance` now **recomputes** acceptance from the committed raw outputs (deterministic graders in `tools/lib/graders.js`), binds the result by SHA-256 to the task set + outputs and to the pack id/version, and ignores the boolean. Tamper (wrong hash/version) → rejected. Proven. |
| B2 | `CROSS_MODEL_REPRODUCED` fakeable by one result listing two models | **Confirmed** | Now requires ≥2 **separate** recomputed-passing result files with ≥2 distinct models. |
| B3 | "Positive state needs measured evidence" was syntactic | **Confirmed (dormant)** | `validate.js` now requires the with-protocol arm to **actually improve** on the control (recomputed from arms, no safety regression), not a trusted `implied_evidence_status` + a lone non-null metric. |
| M4 | `TASKSET_PASSED` name broader than its bar | **Confirmed** | Ladder definition sharpened: it is a **minimum acceptance gate** (completion + no prohibited action), explicitly **not** a quality claim; the badge page shows it beside the (red) evidence status. |
| M5 | Comparison doesn't isolate the protocol; "proportionality measured" overreaches | **Confirmed** | `FINDINGS.md` reworded to the descriptive claim (the *verbatim full-transcript edition* scored lower on these five concise tasks), with the missing controls listed and the "proportionality proven" claim withdrawn. |
| M6/M7 | Live provenance not authenticated; verify-all reproduces the assertion, not the experiment | **Confirmed** | `KNOWN-LIMITATIONS.md` now scopes the live rung exactly: deterministic acceptance is reproduced from committed outputs; model/judge identity + blindness are self-reported; re-running does not replay the model. |
| M8 | Negation guard bypassable (`because`/colon/`and`) | **Confirmed** | Clause-splitting extended to those connectives; self-test extended with the evasions; all 8 packs still clean. |
| M9 | Scanner still evadable (`import()`, side-effect import, `createRequire`, `globalThis[...]`) | **Confirmed** | Patterns added; still, and now clearly, an allow-by-default lint. |
| M10 | Stale header comment ("offline gates can reach TASKSET_PASSED") | **Confirmed** | Corrected. |
| M11 | FINDINGS reported grounding 1.00/1.00 not in the machine result | **Confirmed — a real factual error** | Corrected to the true measured values: accuracy/grounding **0.80 (control) vs 0.60 (protocol)**. The protocol was worse on grounding too. |
| M12 | "Regression" stated more strongly than the design supports | **Confirmed** | Reworded to descriptive (lower mean scores at ~3.3× cost on this five-task run). |

Also added: CI-issued-receipt path (`ci/`) and `tools/attest.js` (a signable digest
over all receipts) — the infrastructure that turns *reproducible* into *trusted*,
authored but, honestly, not yet activated or signed.
