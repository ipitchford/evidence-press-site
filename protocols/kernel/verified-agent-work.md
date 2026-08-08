# The Verified Agent Work kernel

**Version 0.1.0 · status: DRAFT**

Every protocol in this library instantiates one method. That method is the
kernel. A protocol is not a clever prompt; it is a work contract that names its
deliverable, its boundaries, its permissions, its checks, and its evidence. The
kernel is the shared skeleton those contracts hang on, so that a reader who has
understood one protocol has already understood the shape of all of them.

The kernel is deliberately small — eight steps — and each step names the
**failure it exists to prevent**. A step you cannot connect to a concrete
failure mode is ceremony, and ceremony is the thing this library is built to
avoid. If a proposed addition to the kernel does not close a failure that has
actually been observed, it does not belong in the kernel; it belongs, at most,
in a single protocol that needs it.

---

## The eight steps

### 1. Define the deliverable

State, in one sentence, the artefact the work must produce and the standard it
must meet. Not the topic, not the activity — the *thing handed back*, and how
you will know it is good enough.

- **Produces:** a deliverable statement and an explicit acceptance standard.
- **Prevents:** work that is busy but never *done* — the open-ended session that
  drifts because "improve the analysis" has no finish line. Without a named
  deliverable there is nothing for step 7 to validate against.

### 2. Define the input and evidence boundary

Enumerate exactly what the agent may read and rely on, and mark everything else
out of bounds. Distinguish **inputs** (the material to work on) from **evidence**
(what may be used to justify claims). State whether outside knowledge is
permitted and, if so, how it must be marked.

- **Produces:** an input manifest and an evidence rule.
- **Prevents:** fabricated support and scope creep. An agent with no declared
  evidence boundary will reach for whatever is plausible; a briefing that cites
  "studies show" with no traceable source is the boundary failing silently.

### 3. Declare permissions and prohibited actions

List what the agent may access or change, and — separately and explicitly — what
it must never do. Permissions are least-privilege by default: an action is
forbidden unless it is named. Prohibited actions are stated even when they seem
obvious, because "obvious" is not machine-readable.

- **Produces:** a permission set and a prohibited-action list.
- **Prevents:** unintended side effects — the "summarise my inbox" task that
  sends a reply, the "check this cart" task that completes a purchase. The cost
  of an undeclared permission is paid once, in the wrong direction, and is often
  irreversible.

### 4. Identify risks and human approval points

Name the ways this work can go wrong and the specific points where a person must
approve before the agent proceeds. Approval points are placed *before*
irreversible or outward-facing actions, never after.

- **Produces:** a risk list and a set of human checkpoints tied to specific
  steps.
- **Prevents:** silent commitment of consequential actions. The failure this
  closes is the agent that was *capable* of pausing for approval but was never
  told where the cliff edges were.

### 5. Decompose the work into verifiable checkpoints

Break the work into steps small enough that each one can be checked when it
completes, not only at the end. A checkpoint that cannot be verified is not a
checkpoint; it is a hope.

- **Produces:** an ordered procedure where each step has a check.
- **Prevents:** end-of-run surprise — the failure discovered only after all the
  work is built on top of it, when it is expensive to unwind. Early checks make
  errors cheap.

### 6. Execute while retaining material decisions and failures

Do the work, and as you go, keep the decisions that were not obvious and the
attempts that failed. Retention is not a transcript of everything; it is the
subset a reviewer would need to understand *why the output is what it is* and a
future run would need to avoid the same dead ends.

- **Produces:** a decision-and-failure log that feeds the receipt.
- **Prevents:** unauditable output and repeated mistakes. Work with no retained
  reasoning cannot be reviewed, only re-trusted; and a failure that was not
  written down is a failure that will be paid for again.

### 7. Validate the result against explicit acceptance tests

Check the deliverable against the acceptance standard from step 1 and the tests
the protocol declares. Validation is adversarial by intent: the question is not
"does this look right" but "what would make this wrong, and is that present?"
If a stop condition is triggered, stop and surface it rather than proceeding.

- **Produces:** a pass/fail record against named tests, and any triggered stop
  conditions.
- **Prevents:** confident delivery of wrong work. The failure here is the
  plausible-but-false result that passes because the only judge was the author,
  who is rationalising toward "done."

### 8. Produce the deliverable, limitations, and a compact receipt

Hand back three things, not one: the deliverable, an honest statement of what it
does **not** cover or has **not** verified, and a compact receipt recording the
version, inputs, checks run, and evidence status. The receipt is what lets a
third party trust the work without repeating it — and lets *them* repeat it if
they choose.

- **Produces:** deliverable + limitations + `RECEIPT.json`.
- **Prevents:** overclaim and non-reproducibility. A result with no stated
  limitations invites use beyond its warrant; a result with no receipt cannot be
  independently checked, so its assurance rests entirely on trust in the author.

---

## The kernel is proportional

The eight steps are constant; the **weight** applied to each is not. Producing
meeting notes should not carry the machinery of a publication-grade audit. The
kernel therefore runs at three levels of assurance, defined in
[`assurance-levels.md`](./assurance-levels.md):

| Level | Intended use | What the kernel requires |
|---|---|---|
| **Quick** | Low-risk personal work | Steps 1–3 and 7–8 as a lightweight checklist; preview before any change; basic output validation. |
| **Verified** | Repeatable professional workflow | All eight steps, with structured inputs, declared permissions, named acceptance tests, worked examples, and a receipt. |
| **Institutional** | External actions or consequential decisions | All eight steps under persistent state, role separation between doer and checker, adversarial review, and a replayable audit log. |

Choosing a level is itself a step-4 decision: the level is set by the *risk* of
the work, not by the ambition of the protocol.

---

## What the kernel is not

- **It is not a guarantee of benefit.** A protocol can execute all eight steps
  flawlessly and still make its user slower. Whether a protocol *helps* is a
  separate question, answered by evidence, not by conformance. That is why this
  library keeps two independent status ladders — protocol assurance and
  productivity evidence — and never collapses them into one badge. See
  [`../status/ladders.md`](../status/ladders.md).

- **It is not a substitute for judgement.** The kernel makes the shape of the
  work inspectable; it does not decide whether the work should be done. Steps 3
  and 4 route the consequential decisions to a person on purpose.

- **It is not model-specific.** The kernel is platform-neutral. A protocol
  written against it should run, at reduced assurance, on any capable agent, and
  its adapters carry only the product-specific detail.

---

## Mapping to the protocol contract

The kernel steps correspond one-to-one to fields in `protocol.yaml` (see
[`../schema/protocol.schema.json`](../schema/protocol.schema.json)), so that a
machine can check a protocol *is* an instance of the kernel:

| Kernel step | `protocol.yaml` fields |
|---|---|
| 1 Deliverable | `expected_outputs`, `acceptance_tests` |
| 2 Input & evidence boundary | `required_inputs`, `evidence_status` (of inputs) |
| 3 Permissions & prohibitions | `permissions`, `prohibited_actions`, `required_capabilities`, `optional_tools` |
| 4 Risks & approval | `risk_class`, `human_checkpoints`, `failure_modes` |
| 5 Verifiable checkpoints | `procedure` |
| 6 Execute & retain | `procedure` step outputs → the run's decision log |
| 7 Validate | `acceptance_tests`, `stop_conditions` |
| 8 Deliver + receipt | `expected_outputs` + `RECEIPT.json` |

A protocol that leaves a kernel-mapped field empty is not wrong by definition,
but it must say why. The validator treats an unexplained empty mapping as a
structural defect.
