# Assurance levels

The kernel runs at three levels. The level is set by the **risk of the work**,
not by the ambition of the protocol or the capability of the model. A protocol
declares its level in `protocol.yaml` (`assurance_level:`), and the validator
checks that the declared level's required steps are actually present.

The point of levels is proportion. Importing the full rigour of an
institutional audit into a note-taking task does not make the task safer; it
makes the protocol unproductive, which is its own failure. The levels let the
same eight-step method scale down without abandoning its principles.

---

## Quick protocol

**Intended use:** low-risk personal work where a mistake is cheap and easily
reversed — drafting, reformatting, first-pass extraction, personal knowledge
work.

**Required kernel steps:** 1 (deliverable), 2 (boundary), 3 (permissions),
7 (validate), 8 (deliver + receipt). Steps 4–6 are folded into a lightweight
pass rather than run in full.

**Assurance provided:** the output was checked against a stated standard, the
agent operated inside a declared boundary, and any change was previewed before
it happened. This is a checklist, not an audit.

**What it does not provide:** no independent review, no persistent audit log, no
guarantee against a subtle error that a second reader would have caught.

---

## Verified skill

**Intended use:** a repeatable professional workflow that others will run, where
correctness matters and the same procedure is worth packaging and testing.

**Required kernel steps:** all eight, in full. Inputs are structured,
permissions are declared and least-privilege, acceptance tests are named and
runnable, at least one worked example ships with the pack, and every run
produces a receipt.

**Assurance provided:** the protocol has passed its own registered test cases
(positive and failure), its permissions and external calls have been inspected,
and a third party can rebuild and re-run it from the receipt.

**What it does not provide:** it does not by itself establish that the workflow
*improves* outcomes — that is the productivity-evidence ladder — and it does not
separate the doer from the checker.

---

## Institutional workflow

**Intended use:** work that takes external actions or informs consequential
decisions — anything that sends, spends, publishes, alters official records, or
feeds a decision a person would be accountable for.

**Required kernel steps:** all eight, under four additional conditions:

- **Persistent state.** The run's inputs, decisions, and checkpoints survive the
  session, so the work can be resumed, inspected, and replayed.
- **Role separation.** The agent that produces the work is not the sole judge of
  it. The checker in step 7 is independent of the doer in step 6 — a different
  model, a different pass with no stake in passing, or a human reviewer.
- **Adversarial review.** Before release, a fresh reviewer is tasked to *refute*
  the result, not to confirm it. Findings are treated as hypotheses and verified,
  not accepted on sight.
- **Replayable audit log.** A clean checkout can reproduce the run and its
  receipt, so the assurance does not rest on trust in a single session.

**Assurance provided:** consequential actions passed a human checkpoint, the
result survived an independent adversarial pass, and the whole run is
reconstructable by someone who was not there.

**What it does not provide:** no assurance level removes the need for the
step-4 human approvals on the actions that matter. Institutional is the level
that makes those approvals unavoidable, not optional.

---

## Choosing a level

Pick the level from the *worst plausible outcome* of the work, not the average
case. If a protocol usually produces harmless notes but can, on a bad input,
draft an email that gets sent, it is not a Quick protocol — it is at least
Verified with a hard human checkpoint before send, and Institutional if the send
is automated. When in doubt, choose the higher level; the cost of over-assurance
is wasted effort, and the cost of under-assurance is the failure the kernel
exists to prevent.
