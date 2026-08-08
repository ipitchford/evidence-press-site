# Known limitations

This library is about stating plainly what has and has not been established. That
discipline applies to the library itself. An independent adversarial review
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
`tools/run-eval.js` (the flagship has one; the other two do not, so they stay at
the offline rung). Do not read the offline status as operational performance.

## Assurance is reproducible, not tamper-proof

The site reads a pack's status from its `RECEIPT.json`, not from an author-editable
field, and the build refuses a receipt that is schema-invalid, is for the wrong
pack, or records a failed gate. But the receipt is still produced by
author-controlled tools on an author-controlled machine. Its real guarantee is
**reproducibility**: anyone can re-run `node tools/verify-all.js` on a clean
checkout and get the same receipt, so a status that the gates do not support is
*detectable by re-running*. It is **not** proof against a determined forger who
edits the receipt and the tools together.

Turning "reproducible" into "trusted" requires infrastructure this candidate does
not yet have: CI-issued receipts, artifact signing or a transparency log,
clean-commit enforcement, and a verifier identity distinct from the author. That
is planned, not done.

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

One protocol has now been evaluated live; two have not.
`goal-to-verified-deliverable` was run through a two-arm benchmark (`o4-mini`
runner, `gpt-5.2` blind judge) and carries `NO_CLEAR_GAIN` — measured, no
worthwhile gain on that task set and model (a quality and cost regression; see its
`evals/FINDINGS.md`). The other two ship at `NO_IMPACT_EVIDENCE` — benefit not
measured.

The live benchmark's own limits are real and must be read with the result: a
single runner model (not cross-model reproduced), a single judge model (not
multiple raters), five tasks, no `no_agent` (human) arm, and human dimensions
(effort, cognitive burden, accessibility) left null because they need people.
Quality is one model's rubric judgement, sensitive to how verbose an output is
against the task's format. A benchmark design cannot support anything stronger
than a benchmark-level signal; `CONTROLLED_USER_SIGNAL` and above need real
participants, and the harness enforces that ceiling.

## Scope of the review

The adversarial review saw the kernel, both ladders, the validator, the harness,
the hostile detectors, `verify-all`, and one full protocol pack — not every file.
Its findings about unshown code were treated as hypotheses and checked against the
actual implementation before any change. The review record and a point-by-point
response are in [`review/`](review/).
