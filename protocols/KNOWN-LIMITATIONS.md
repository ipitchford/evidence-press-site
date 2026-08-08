# Known limitations

This library is about stating plainly what has and has not been established. That
discipline applies to the library itself. A fresh role-separated adversarial model review
(recorded in [`review/`](review/)) found several places where the tooling claimed
more than it delivered. Some of those were fixed; the rest are stated here rather
than hidden. Read this before trusting any status badge.

## What the offline toolchain does and does not establish

The gates in this repository run offline, dependency-free, with **no model
execution**. They can honestly reach `EXAMPLE_CONFORMANCE_VALIDATED` and no
higher.

| The gate checks | It does NOT check |
|---|---|
| The contract is schema-valid and its kernel steps are mapped | That a model actually follows the procedure |
| The shipped worked examples satisfy the acceptance tests under deterministic graders | That a fresh run over a new task would satisfy them |
| Deliberately-bad fixtures are rejected by the graders (discrimination) | Sensitivity, specificity, or robustness of the graders in general |
| The static scanner finds no recognised unsafe pattern | That the pack is safe to run |
| A positive benefit state is backed by a measured eval result | That the evaluation was well-designed or the effect is real |

**`EXAMPLE_CONFORMANCE_VALIDATED` means the pack's own examples conform to its own
tests.** It is not evidence that the protocol works when a model runs it. That is
`TASKSET_PASSED`, which requires a recorded live run — now produced by
`tools/run-eval.js` (three packs now retain one or more predecessor runs). Do not
read the offline status as operational performance.

## Assurance is reproducible, not tamper-proof

The site reads a pack's status from its `RECEIPT.json`, not from an author-editable
field, and the build refuses a receipt that is schema-invalid, is for the wrong
pack, or records a failed gate. But the receipt is still produced by
author-controlled tools on an author-controlled machine. Its real guarantee is
**reproducibility**: anyone can re-run `node tools/verify-all.js` on a clean
checkout and get the same receipt, so a status that the gates do not support is
*detectable by re-running*. It is **not** proof against a determined forger who
edits the receipt and the tools together.

Receipt bytes record the reviewed Node compatibility range (`>=18`), rather than
the volatile patch version of the producing runtime. Exact runner versions remain
visible in CI/build logs; this keeps the receipt reproducible across supported
Node releases without pretending that the log and artifact are the same record.

Turning "reproducible" into "trusted" requires infrastructure this candidate does
not yet have: CI-issued receipts, artifact signing or a transparency log,
authenticated provider transcripts, and a verifier identity distinct from the
author. The current controls do require clean inputs for new v2 evaluations and
reject dirty production release provenance; they do not make the author-controlled
receipt an independent attestation.

### The live-evaluation rung specifically

`TASKSET_PASSED` is **recomputed** by the verifier from the committed raw outputs:
the deterministic acceptance graders re-run against them, bound by SHA-256 to the
task set and the outputs file and to the protocol id + version. A fabricated
`taskset_passed` field, a tampered outputs file, or a result for the wrong
pack/version is rejected, not trusted. But this reproduces only the *deterministic
acceptance*. It does **not**:

- re-run the model or the judge — re-running `verify-all` rereads the committed
  outputs; it does not regenerate them, so it replays the *acceptance
  computation*, not the *experiment*;
- authenticate that the recorded runner/judge models actually produced those
  outputs, or that the judge was blind;
- gate on the blind-judge quality/grounding scores — those are advisory only.

So the live rung means precisely: *these committed outputs pass the deterministic
acceptance gates, reproducibly.* It does not by itself prove the run was fresh,
blind, or un-cherry-picked. CI-issued live runs with authenticated provider
transcripts would close that gap; not done.

`CROSS_MODEL_REPRODUCED` additionally requires separate recorded runs on the same
task set, distinct named models and the same implied evidence outcome. It remains
same-team cross-model consistency, not independent reproduction: model identities
are self-reported and the task selection, graders and recording path are shared.

## The security scan is a lint, not a sandbox

`hostile-tests.js` is allow-by-default static analysis. It fails closed only on
patterns it recognises. It does **not** sandbox the filesystem or network,
mediate capabilities, verify dependencies, analyse binaries or non-JS scripts, or
run the code. A pack can still instruct an agent to do harm; the declared
`permissions` and `prohibited_actions` are a contract, and enforcing that contract
is the **runtime's** responsibility (the local-agent adapter documents mounting
inputs read-only and withholding a network tool). Known scanner gaps: encoded or
split secrets, credentials pulled from the environment at runtime, execution via
imported helper modules, and any language or mechanism outside the scanned set.

## The overclaim detector is a heuristic backstop

It flags strong, quantified benefit-claim shapes in library-authored prose
(README, SKILL, protocol.yaml, adapters) and gates them on
`CAUSAL_EFFECT_SUPPORTED`. It has a self-test that locks in known good/bad cases.
Residual gaps:

- **False negatives.** Soft or novel phrasings ("a smoother experience") are not
  caught. The structural control — a positive evidence state requires a backing
  eval result — is what actually prevents unearned benefit *status*; the detector
  only polices prose.
- **False positives.** A quoted third-party claim in library prose ("a participant
  said, 'it saved me hours'") may be flagged, because the detector cannot tell a
  publisher's claim from a quotation. Paraphrase such quotes or move them to
  example content, which is out of scope for the scan (example content carries
  domain claims, not claims about the protocol).

## Kernel conformance is structural, not semantic

`STRUCTURE_VALIDATED` means the contract is schema-valid, the kernel version
matches, each required step's mapped fields are populated, the acceptance tests
include a positive and a failure/boundary case, and the test cases cover the
automated acceptance tests. It does **not** verify that a step's action actually
achieves the kernel step's purpose, that checkpoints truly precede every
irreversible action, or that the acceptance tests test what their statements say.
A validator cannot confirm semantic fidelity; only review and live runs can.

## Evaluation

Three protocols retain **version 0.1.0 predecessor** live model/task evaluations, all with the
registered result `NO_CLEAR_GAIN`:

- `goal-to-verified-deliverable`: three five-task runs across two named runner
  models and two editions; the protocol arm did not improve net measured outcomes
  and cost more;
- `document-to-action-plan`: one four-task run; higher deterministic completion,
  slightly lower judged quality, and about 3.4 times the estimated cost; and
- `evidence-backed-brief`: one four-task run; lower judged quality/grounding and
  about 3.4 times the estimated cost.

The current distributable packs are 0.1.1. Their bytes differ, so the verifier
does not use these predecessor results to raise current assurance or evidence;
all 0.1.1 packs return to example conformance and `NO_IMPACT_EVIDENCE` until
retested. Historical raw model outputs and negative findings remain visible. The
result JSON metadata was transparently migrated to the corrected evidence-profile
shape and to record the unrun human arm as `n: 0`; it still identifies the
evaluated protocol as 0.1.0 and is not evidence for 0.1.1.

These evaluations share serious limits: development-team provenance, tiny curated
task sets, self-reported runner identity, one model judge per run, no repeated
generations, no authenticated provider transcript, no `no_agent` (human) arm,
and human dimensions left null. `goal-to-verified-deliverable` meets the project's
same-task/same-outcome cross-model rule, but that is not independent reproduction.
Quality remains sensitive to rubric and output verbosity. A benchmark cannot
support `CONTROLLED_USER_SIGNAL` or any company-impact claim; those require real,
consenting participants and an appropriate design.

The historical result field `cost_usd` combined the estimated runner-call and
model-judge costs. It is evaluation-pipeline cost, not the ordinary cost of using
the workflow, and longer outputs also increased judging cost. The published
ratios therefore cannot be interpreted as company operating-cost ratios. Future
v2 runs record operational runner cost and evaluation/judge cost separately.

## Scope of the review

The adversarial review saw the kernel, both ladders, the validator, the harness,
the hostile detectors, `verify-all`, and one full protocol pack — not every file.
Its findings about unshown code were treated as hypotheses and checked against the
actual implementation before any change. The review record and a point-by-point
response are in [`review/`](review/).
