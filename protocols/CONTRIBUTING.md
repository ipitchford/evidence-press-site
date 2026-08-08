# Contributing a protocol

A protocol is a work contract, not a prompt. Contributing one means shipping a
complete, testable pack — see [`GOVERNANCE.md`](GOVERNANCE.md) for the full bar.
This file is the practical checklist.

## Start from a real friction

Propose a protocol only for a **repeatable improvement to work people already
need to do** — not a spectacular one-off demo. The best candidates are
high-frequency, low-to-moderate-risk tasks that are easy to evaluate. If you
cannot describe the friction in one sentence and name who has it, it is not ready.

Before implementation, add a bounded prior-art/source map explaining what the
proposal inherits and what it changes. For a proposed company trial, also name
the workflow owner, affected people, data destination/retention, decision right,
rollback and incident contact.

## Scaffold

Copy the structure of an existing pack (`goal-to-verified-deliverable` is the
reference):

```
protocols/<your-id>/
├── README.md            # human-facing: the ten questions (see below)
├── SKILL.md             # agent-facing execution, Agent Skills format
├── protocol.yaml        # the machine-readable contract
├── CHANGELOG.md
├── SECURITY.md
├── LICENSE
├── references/          # docs the skill can pull in
├── assets/              # templates
├── scripts/             # dependency-free helpers (optional)
├── examples/            # at least one worked input + output
├── tests/               # positive + failure/boundary cases
├── evals/               # task set, expected properties, graders
├── adapters/{codex,claude,generic-chat,local-agent}/
├── MANIFEST.json        # generated
└── RECEIPT.json         # generated
```

## The README answers ten questions

1. What problem does this solve? 2. Who is it for? 3. What does success look
like? 4. What does the agent receive? 5. What can it change? 6. Where must a
person approve? 7. How long and how much does it normally cost? 8. What has
actually been tested? 9. What can go wrong? 10. How is it installed or used
without installation?

## Fill in `protocol.yaml`

Every field in [`schema/protocol.schema.json`](schema/protocol.schema.json) that
the schema marks required. In particular: `do_not_use_when` (a protocol with no
non-uses is under-specified), `prohibited_actions` (explicit, not inferred),
`human_checkpoints` before any consequential action, and both status values set
**honestly** — a new protocol is `DRAFT` / `NO_IMPACT_EVIDENCE`.

## Tests are mandatory

At least one positive test and one failure/boundary test under `tests/`. If the
protocol reads external or supplied content, include a prompt-injection test. A
pack with no failure test cannot pass example conformance or any live-task rung.
Deliberately bad fixtures must demonstrate that the load-bearing grader actually
fails.

## Design evaluation before collecting outcomes

For a company comparison, state the primary estimand as protocol-guided use minus
the same agent without the protocol. Treat manual work as a secondary comparator;
keep quality, material errors, human effort, elapsed time, rework, cost, burden,
help requests, adoption and safety separate. Record task allocation/order,
missingness, attrition and uncertainty. A formative usability study is not an
impact study, and a model-only benchmark is not human productivity evidence.

## Verify before you claim

```bash
node tools/verify-all.js
```

Set the protocol's `assurance_status` only to the rung the receipt justifies. Do
not write a benefit claim the `productivity_evidence` value does not license —
the overclaim check will fail the build.

## Licence

Prose and templates under CC0-1.0; scripts under Apache-2.0. By contributing you
agree to release under these terms.
