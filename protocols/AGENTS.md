# AGENTS.md — the institutional contract for Productivity Protocols

This file is the permanent contract for any agent — or person — working inside
`protocols/`. It is not a style guide; it is the set of invariants that make this
library trustworthy. An agent that violates one of these has not "taken a
shortcut"; it has produced something the library cannot publish. Read this before
touching anything here.

## Mission

Turn effective ways of working with AI agents into **open, portable, evaluated
protocols** that anyone can inspect, download, adapt, and run — and honestly
discover whether they improved the work.

This is the practice arm of a three-part system:

- **Evidence Press** — what has been discovered, and what evidence supports it.
- **Policy Identification Observatory** — what the observations actually permit
  us to conclude.
- **Productivity Protocols** (here) — how people can reliably use agents to
  complete useful work.

We publish **methods, not papers**, reusing Evidence Press's publishing grammar:
plain-language and technical explanations side by side, attached evidence,
explicit assurance boundaries, open licences, and machine-readable endpoints.

## The invariants

1. **Every protocol is a kernel instance.** It instantiates the Verified Agent
   Work kernel ([`kernel/verified-agent-work.md`](kernel/verified-agent-work.md)).
   The validator checks the mapping. A "protocol" that is really just a prompt is
   rejected.

2. **Two ladders, never one badge.** Protocol assurance (is it well built and
   safe?) and productivity evidence (does it help?) are tracked separately and
   never merged. See [`status/ladders.md`](status/ladders.md).

3. **Claims never exceed evidence.** No page, README, or registry entry may state
   a benefit above the protocol's `productivity_evidence` value. "Improves X"
   requires an evaluation. Below that, the honest statement is "benefit not yet
   measured." The overclaim check enforces this.

4. **Least privilege by default.** An action the agent may take must be declared
   in `permissions`. Prohibited actions are listed explicitly, not inferred.
   External writes default to preview-then-approve.

5. **Skills are a software supply chain.** Every pack ships a MANIFEST with
   SHA-256 hashes and a RECEIPT. No hidden network calls, no bundled secrets, no
   credential collection. The static scanner is a lint, not a sandbox: it fails
   closed only on recognised patterns, and enforcing the permission contract at
   runtime is the runtime's job. See [`SECURITY.md`](SECURITY.md) and
   [`KNOWN-LIMITATIONS.md`](KNOWN-LIMITATIONS.md).

6. **Negative results are kept.** A protocol that shows `NO_CLEAR_GAIN` or
   `HARM_OR_REGRESSION_FOUND` is published, not deleted. A workflow that looked
   promising and did not help is valuable knowledge.

7. **Builds are reproducible.** The builder derives its timestamp from the commit,
   never the clock, and pins assets by hash, so a third party can rebuild a tag
   and compare byte-for-byte. Do not introduce clock- or network-dependent build
   inputs.

8. **The kernel stays platform-neutral.** Product-specific detail lives in
   `adapters/`, not in `protocol.yaml` or `SKILL.md`. A protocol should run, at
   reduced assurance, on any capable agent.

## Standing constraints for this candidate

Until the maintainer says otherwise, an agent working here must **not**:

- publish, deploy, or run `wrangler`;
- push, or create a remote repository;
- contact any external party;
- alter the live Evidence Press build (`build.js`, `pages/`, `dist/`, root
  config). This subsystem is self-contained in `protocols/` and emits only to
  `protocols/dist/`, which the main build never touches.

These constraints protect the live site while this section is a reviewable local
candidate. Lifting them is a maintainer decision, recorded in `CHANGELOG.md`.

## The lifecycle every protocol follows

```
workflow need → proposal → specification → skill implementation →
synthetic + real task tests → adversarial + security review →
comparative evaluation → release → field reports → revision or deprecation
```

Governance detail — what a submission must contain, how review gates work, how
deprecation happens — is in [`GOVERNANCE.md`](GOVERNANCE.md).

## Where things live

| Path | What |
|---|---|
| `kernel/` | The Verified Agent Work kernel and assurance levels. |
| `schema/` | JSON Schemas for protocol, manifest, receipt, eval-result, registry. |
| `status/` | The two status ladders. |
| `protocols/<id>/` | One protocol pack each. |
| `tools/` | validate, eval-harness, hostile-tests, registry, make-receipt. |
| `build-protocols.js` | Dependency-free static-site builder → `protocols/dist/`. |
| `review/` | Adversarial-review records. |
| `RECEIPT.json` | Repository-level replay receipt. |

## Verifying your work before you claim it is done

From `protocols/`, one command runs every gate and regenerates the receipt:

```
node tools/verify-all.js
```

It runs `validate` → `tests` → `evals` → `hostile` → `build` → `make-receipt`.
A protocol's assurance status may only be raised to the level the receipt
justifies. If the receipt does not show a gate passing, the status that gate
would grant may not be claimed.
