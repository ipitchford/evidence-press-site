# Productivity Protocols

**Trial one useful AI workflow. Keep the evidence.**

Productivity Protocols is a local-data-first evaluation kit for a company that is
curious about AI agents but does not yet know where to begin. Its formative route
needs no installation; the feasibility route needs a facilitator comfortable with
Node 18+ and structured JSON, but neither requires agent-system integration. It helps a small
team pick one bounded, low-risk workflow, learn whether people can use it, and
advance only as far as the evidence permits: **continue, revise, or stop**.

The first trial is **Document to action plan**: turn supplied meeting notes,
email threads, or a brief into a source-linked list of decisions, obligations,
deadlines, open questions, and next actions. It reads supplied material and
produces draft outputs; it does not send messages, change source files, assign
people, or make decisions for them.

> This candidate does not claim that protocols improve productivity. Its three
> predecessor 0.1.0 model evaluations found **no clear gain**, and no company field
> trial has yet established human or business benefit. The point of this release
> is to make that next test bounded, useful, and auditable.

## Start here: choose the evidence stage

The formative branch needs no installation. The feasibility tools require Node
16+ and structured-file competence from a facilitator, but not API, plugin or
agent-runtime integration. Choose the branch from the consenting participants
and comparable work items genuinely available:

| Stage | Minimum starting condition | What it can answer | What it cannot justify |
|---|---|---|---|
| **Formative usability** | 1–5 participants | Can people understand, operate, and safely stop the method? | An effect estimate or adoption based on productivity |
| **Feasibility** | At least six participants and enough frozen tasks to exercise allocation and measurement | Can recruitment, task assignment, measurement, support, and retention work? | A powered productivity claim; any effect estimate is exploratory |
| **Controlled evaluation** | A justified sample, frozen analysis, independent methodological review, and a randomized parallel agent-only versus protocol-guided design | A context-bound, uncertainty-qualified incremental signal | General company impact or transfer to other workflows |
| **Organisational follow-up** | Governed ordinary use after a separately justified deployment decision | Whether use, burden, costs, errors, and outcomes persist in that setting | Causal attribution unless the identification design supports it |

Protocol exposure teaches a way of structuring work that participants may not
be able to unlearn. For that reason the included three-period crossover is
limited to **feasibility mechanics**. A future controlled evaluation should use
randomized parallel agent-only and protocol-guided groups, with the manual
process retained as a secondary operational baseline.

For the recommended first contact, use the formative route:

1. Read the one-page suitability and data checks in [`company-pilot/`](company-pilot/).
2. Choose one representative, non-sensitive source document and remove personal
   or confidential information that the approved AI service should not receive.
3. Ask participants to follow the bounded protocol while an observer records
   comprehension problems, help requests, burden, errors, and safety incidents.
4. Do not calculate or present a productivity effect from this walkthrough.
5. Hold a stage review: continue to a separately prepared feasibility study,
   revise the workflow and retest usability, or stop.

The first route is deliberately **formative**, not a scientific efficacy claim.
It can reveal usability problems and unsafe assumptions. It cannot establish a
promising productivity signal, justify adoption from an estimated effect, or
establish a causal effect.

## What a protocol is

A protocol is more than a prompt. It is a bounded work contract containing:

- when the method is and is not suitable;
- required inputs and the permitted evidence boundary;
- least-privilege access and prohibited actions;
- human approval points, stop conditions, and failure modes;
- explicit outputs and acceptance tests;
- a receipt that records what was checked; and
- separate status for engineering assurance and productivity evidence.

The YAML format is not claimed as a new workflow language. It is a compact
project-level representation layered on existing ideas including Agent Skills,
workflow standards, evaluation practice, and AI risk management. The bounded
contribution being tested is the **company adoption-and-evidence loop** around a
protocol. See [`docs/ORIGINALITY-AND-PRIOR-ART.md`](docs/ORIGINALITY-AND-PRIOR-ART.md).

## The evidence spine

The project never compresses all confidence into one badge:

| Question | Recorded as | What it does **not** establish |
|---|---|---|
| Is the pack well formed and does it pass its declared checks? | Protocol assurance | Human benefit or safe use in every setting |
| Did the method improve the tested outcome? | Productivity evidence | General business impact beyond that test |
| Could novice participants complete the trial safely and understand the result? | Pilot record | A causal or population-wide productivity effect |
| Is there enough local evidence to continue? | Continue / revise / stop decision | Endorsement by Evidence Press or a regulator |

Protocol assurance runs from `DRAFT` through `FIELD_READY`. Productivity evidence
runs separately from `NO_IMPACT_EVIDENCE`, and may record `NO_CLEAR_GAIN` or
`HARM_OR_REGRESSION_FOUND` as first-class outcomes. Full definitions are in
[`status/ladders.md`](status/ladders.md).

## Available protocols

The registry retains eight candidate packs. **Document to action plan** is the
only recommended first company trial; the others remain inspectable research
and development candidates.

| Protocol | Intended job | Current evidence |
|---|---|---|
| [`document-to-action-plan`](protocols/document-to-action-plan/) | Extract source-linked actions and commitments from supplied documents | 0.1.1: example conformance, `NO_IMPACT_EVIDENCE`; 0.1.0 negative benchmark retained |
| [`goal-to-verified-deliverable`](protocols/goal-to-verified-deliverable/) | Turn an unclear task into a checked deliverable | 0.1.1: example conformance, `NO_IMPACT_EVIDENCE`; 0.1.0 cross-model negative history retained |
| [`evidence-backed-brief`](protocols/evidence-backed-brief/) | Draft a claim-typed, source-linked brief | 0.1.1: example conformance, `NO_IMPACT_EVIDENCE`; 0.1.0 negative benchmark retained |
| [`project-handoff`](protocols/project-handoff/) | Preserve enough state for another worker to continue | Example conformance only |
| [`spreadsheet-quality-audit`](protocols/spreadsheet-quality-audit/) | Check a table for common quality failures | Example conformance only |
| [`decision-memo-under-uncertainty`](protocols/decision-memo-under-uncertainty/) | Separate facts, assumptions, options, and sensitivities | Example conformance only |
| [`adversarial-output-review`](protocols/adversarial-output-review/) | Challenge a draft with falsifiable findings | Example conformance only |
| [`repetitive-workflow-capture`](protocols/repetitive-workflow-capture/) | Convert a repeated process into a candidate protocol | Example conformance only |

## Three ways to inspect or use a pack

1. **No-install formative edition** — plain-language instructions and a checklist for a
   permitted chat agent (`adapters/generic-chat/`).
2. **Agent Skills edition** — `SKILL.md`, templates, examples, and tests for a
   skills-compatible environment. The static candidate uses a deterministic
   `.tar`, rather than the brief's suggested `.zip`, so archive order, timestamps,
   bytes and hash can be reproduced with the dependency-free builder.
3. **Adapter notes** — product and local-agent guidance, not an implemented
   plugin/MCP connection. Connected execution remains deferred. Any future external
   write should require preview and approval.

## Verify the candidate locally

The repository is dependency-free and requires Node.js 18 or later:

```bash
npm run verify
npm run build
```

The verification pipeline validates schemas and pack structure, runs example
graders and hostile fixtures, checks the publication ledger, builds the static
site, and emits a local receipt. It does **not** run an AI model, reproduce the
historical live evaluations, prove security, or establish productivity impact.
Generated receipts describe the checkout that produced them and are not signed
third-party attestations.

## Repository map

```text
company-pilot/        no-install formative route plus facilitator-run feasibility kit
protocols/            eight versioned protocol packs
schema/               machine-readable protocol, evidence, pilot, and ledger contracts
status/               separate assurance and productivity-evidence ladders
docs/                 provenance, prior art, impact design, and governance crosswalk
tools/                validators, mutation tests, builders, and release-integrity gates
review/               preserved historical and current adversarial reviews
dist/                 generated candidate site (ignored by Git)
```

## Governance, privacy, and release status

- Start with non-sensitive material. The local site sends no data anywhere, but
  any AI service used in a trial has its own data-handling terms.
- A participant may decline or withdraw; worker monitoring and covert evaluation
  are outside scope. Report aggregated results where possible.
- Stop on a privacy incident, unexplained external action, material fabrication,
  or a participant-safety concern.
- The public `0.1.0` pages and this `0.2.0-candidate.1` source have separate
  evidence and release identities. Building the repository does not deploy it;
  the guarded composite release path and exact public readback remain separate
  maintainer decisions.

This is `0.2.0-candidate.1`, suitable for local inspection and formative novice
usability testing after the named facilitator checks. It is not field-ready, is
not independently validated, and carries no claim of realised company impact.
See [`GOVERNANCE.md`](GOVERNANCE.md), [`SECURITY.md`](SECURITY.md),
[`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md), and
[`docs/IMPACT-AND-EVALUATION.md`](docs/IMPACT-AND-EVALUATION.md).

## Licence and provenance

Protocol prose, templates, and web copy are released under CC0-1.0; scripts and
reusable software are Apache-2.0. The review history records the predecessor,
the standalone audit workspace and this selectively integrated host candidate.
See [`LICENSE`](LICENSE) and [`docs/PROVENANCE.md`](docs/PROVENANCE.md).
