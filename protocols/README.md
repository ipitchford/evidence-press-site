# Productivity Protocols

**Open, tested workflows for getting useful work done with AI agents.**

This is the third component of the Evidence Press system. Evidence Press
publishes *what has been discovered*; the Policy Identification Observatory
audits *what the evidence permits us to conclude*; Productivity Protocols
publishes *how people can reliably use agents to complete useful work* — as
methods, not papers.

A protocol here is not a prompt. It is a complete work contract: what task it
addresses, when to use it and when not to, what it needs, what it promises, what
it may access or change, where a person must approve, how it is checked, what
counts as failure, what evidence supports its usefulness, and which models and
environments it has actually been tested on.

> Anyone should be able to download a method for using an agent, see exactly what
> it does, know what access it requires, inspect how it has been tested,
> reproduce the evaluation, and discover honestly whether it improved the work.

## What's in the library

Each protocol lives in `protocols/<id>/` and ships three ways to use it:

1. **Copy-and-run edition** — a plain-language prompt and checklist, no install,
   works with any capable chat agent and uploaded files. This is the
   accessibility baseline. (`adapters/generic-chat/`)
2. **Downloadable skill edition** — an [Agent Skills](https://agentskills.io/specification)
   pack (`SKILL.md` + templates + examples + tests), installable in
   skills-compatible environments.
3. **Connected workflow edition** — an optional version using MCP connections for
   files, calendars, project systems, etc. External writes default to
   preview-and-approve. (`adapters/`)

The eight protocols (assurance / evidence as measured):

| Protocol | What it does | Assurance | Evidence |
|---|---|---|---|
| [`goal-to-verified-deliverable`](protocols/goal-to-verified-deliverable/) | Turns an unclear task into an explicit output, plan, checkpoints, and acceptance tests. | CROSS_MODEL_REPRODUCED | NO_CLEAR_GAIN |
| [`document-to-action-plan`](protocols/document-to-action-plan/) | Extracts decisions, obligations, deadlines, uncertainties, and next actions from documents. | TASKSET_PASSED | NO_CLEAR_GAIN |
| [`evidence-backed-brief`](protocols/evidence-backed-brief/) | A concise briefing with claim types, sources, uncertainties, and contrary evidence. | TASKSET_PASSED | NO_CLEAR_GAIN |
| [`project-handoff`](protocols/project-handoff/) | Durable state so another person or agent can continue a project. | EXAMPLE_CONFORMANCE_VALIDATED | not measured |
| [`spreadsheet-quality-audit`](protocols/spreadsheet-quality-audit/) | Audits a table for formula errors, unit mismatches, missing data, inconsistencies. | EXAMPLE_CONFORMANCE_VALIDATED | not measured |
| [`decision-memo-under-uncertainty`](protocols/decision-memo-under-uncertainty/) | Separates facts, assumptions, options, sensitivities, and reversible actions. | EXAMPLE_CONFORMANCE_VALIDATED | not measured |
| [`adversarial-output-review`](protocols/adversarial-output-review/) | A refute-framed challenge to a draft: findings by severity, each falsifiable. | EXAMPLE_CONFORMANCE_VALIDATED | not measured |
| [`repetitive-workflow-capture`](protocols/repetitive-workflow-capture/) | Turns a described repeated process into a candidate protocol draft. | EXAMPLE_CONFORMANCE_VALIDATED | not measured |

Note the honesty: the three protocols that have been **evaluated live** all carry
`NO_CLEAR_GAIN` — measured, no worthwhile benefit yet on their task sets and
models. That is a published result, not a hidden one; see each pack's `evals/`.

## Every protocol carries two status values

- **Protocol assurance** — is it well built and safe? `DRAFT →
  STRUCTURE_VALIDATED → EXAMPLE_CONFORMANCE_VALIDATED → TASKSET_PASSED →
  CROSS_MODEL_REPRODUCED → SECURITY_REVIEWED → FIELD_READY`. The offline
  toolchain earns at most `EXAMPLE_CONFORMANCE_VALIDATED` — it checks the pack's
  own worked examples against deterministic graders; it runs no model.
  `TASKSET_PASSED` and above require recorded live runs.
- **Productivity evidence** — does it help, and how do we know? `NO_IMPACT_EVIDENCE
  → BENCHMARK_SIGNAL → CONTROLLED_USER_SIGNAL → FIELD_SIGNAL →
  CAUSAL_EFFECT_SUPPORTED`, with `NO_CLEAR_GAIN` and `HARM_OR_REGRESSION_FOUND`
  as honest findings.

These are never merged into one badge. A protocol can be flawlessly engineered
and still make you slower. See [`status/ladders.md`](status/ladders.md).

## Build and verify locally

The subsystem is dependency-free and self-contained. From this directory:

```bash
node tools/verify-all.js      # validate → tests → evals → hostile → build → receipt
node build-protocols.js       # just build the static candidate into ./dist
```

`tools/verify-all.js` runs every gate and regenerates `RECEIPT.json`. The build
derives its timestamp from the git commit, not the clock, so a clean checkout
reproduces the output byte-for-byte. Nothing here writes to the parent site's
`dist/`.

## Layout

```
protocols/
├── AGENTS.md          # the institutional contract (read first)
├── GOVERNANCE.md      # foundry lifecycle, review gates, deprecation
├── SECURITY.md        # skill supply-chain policy
├── kernel/            # Verified Agent Work kernel + assurance levels
├── schema/            # JSON Schemas (protocol, manifest, receipt, eval, registry)
├── status/            # the two status ladders
├── protocols/<id>/    # one protocol pack each
├── tools/             # validate, eval-harness, hostile-tests, registry, receipt
├── build-protocols.js # static-site builder → ./dist
└── RECEIPT.json       # repository replay receipt
```

## Licensing

Dual, for maximum diffusion: **CC0-1.0** for protocol prose, templates, and web
copy; **Apache-2.0** for scripts, validators, and reusable software. See
[`LICENSE`](LICENSE).

## Status

This is an early candidate (`v0.1.0`, kernel `v0.1.0`). It is a **local,
reviewable build** — not deployed, not published, and it does not alter the live
Evidence Press site. See [`AGENTS.md`](AGENTS.md) for the standing constraints.

It has been through one independent adversarial review; the findings and the
point-by-point response are in [`review/`](review/), and
[`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md) states plainly what the offline
gates do and do not establish. In particular: the offline toolchain reaches at
most `EXAMPLE_CONFORMANCE_VALIDATED` (it checks the shipped examples, runs no
model), and every protocol ships at `NO_IMPACT_EVIDENCE` — benefit not measured.
