# AGENTS.md — institutional contract for Productivity Protocols

Read this file before changing the repository. It defines the assurance boundary,
not merely the house style.

## Mission

Help a company with little agent experience identify one suitable knowledge-work
task, trial agent use safely, and decide from retained evidence whether a bounded
protocol adds value over the same agent without that protocol.

Productivity Protocols is the practice arm of an evidence–decision–practice
stack:

- **Evidence Press** publishes research claims with their evidence.
- **Policy Identification Observatory** audits what observations identify.
- **Productivity Protocols** publishes inspectable methods and context-bound
  evidence about using agents to complete work.

## Non-negotiable invariants

1. **A protocol is a work contract, not a prompt.** Every protocol instantiates
   the Verified Agent Work kernel and states its task, boundary, permissions,
   checkpoints, tests, failures and evidence status.
2. **The business decision comes first.** The novice-facing path begins with the
   workflow, owner, affected people, data and success criterion. YAML, Agent
   Skills and adapters are implementation details.
3. **Two ladders remain separate.** Protocol assurance describes packaging and
   checking. Productivity evidence describes measured benefit or harm. Neither
   is a proxy for the other.
4. **Evidence is version- and context-bound.** A result for protocol `0.1.0`, a
   named model and a registered task set does not transfer automatically to a
   revised protocol, another model, another company or another task.
5. **Negative results are durable.** `NO_CLEAR_GAIN` and
   `HARM_OR_REGRESSION_FOUND` records are preserved with their raw evidence and
   cannot be hidden by releasing a new version.
6. **No novelty by relabelling.** Agent Skills, Agent Spec, BPMN, evaluation
   frameworks and AI-governance standards are prior art. The candidate's
   contribution is the novice-company adoption and evidence lifecycle; do not
   call the workflow syntax new, first or unique.
7. **Least privilege and local data by default.** The public interface never
   uploads task material. Trials start read-only, prohibit consequential external
   actions and record data destination, retention, human approval and rollback.
8. **People are not test fixtures.** A company trial identifies affected people,
   secures appropriate participation and review, records attrition and help
   requests, and does not infer human productivity from model-only tests.
9. **Receipts state what ran.** Hashes, manifests, replay and deterministic tests
   establish provenance or structural conformance. They do not establish safety,
   usefulness, independent reproduction, correctness or compliance.
10. **Builds are deterministic and publishable state is clean.** Build inputs are
    local and pinned. Release tooling must reject a dirty production source and
    must compare candidate, public ledger and post-deploy readback.

## Standing constraints for this candidate

This institution is integrated into the Evidence Press host repository. Work may
edit and test a dedicated candidate branch, but until the maintainer explicitly
authorises a release it must not:

- publish, deploy or run `wrangler`;
- create a remote, push or change DNS;
- contact companies, workers or other external parties;
- merge to the deployment branch or alter the currently published Evidence Press
  site;
- claim company impact, productivity improvement, certification or regulatory
  compliance.

The substantive review was isolated in a history-preserving subtree checkout and
then selectively integrated into this host branch, retaining the house shell,
media and pack-specific scripts. See [`docs/PROVENANCE.md`](docs/PROVENANCE.md).

## Evidence lifecycle

```text
workflow need
  -> suitability and governance screen
  -> protocol specification and skill pack
  -> structural, mutation and security checks
  -> model/task benchmark (optional; context-bound)
  -> formative human usability study
  -> preregistered company comparison
  -> adopt, redesign or stop
  -> 30/90-day follow-up
  -> revision or deprecation
```

The primary impact estimand is the incremental effect of **protocol-guided agent
use versus the same agent without the protocol**. Manual work is an important
secondary comparator. Completion, quality, material error, human effort, elapsed
time, rework, cost, cognitive burden, help requests, adoption and safety remain
separate outcomes unless a decision-specific weighting is declared in advance.

## Repository map

| Path | Contract |
|---|---|
| `company-pilot/` | No-install formative route plus facilitator-run feasibility forms and analysis contract. |
| `kernel/` | Platform-neutral Verified Agent Work kernel. |
| `protocols/<id>/` | Versioned protocol, Agent Skill, adapters, tests and evidence. |
| `schema/` | Machine-readable contracts for packs, receipts, registry and pilots. |
| `status/` | Separate assurance and productivity-evidence ladders. |
| `tools/` | Validators, mutation/security checks, evaluation and release controls. |
| `assets/` | Same-origin, offline-capable site assets. |
| `review/` | Role-separated adversarial model-review records and responses. |
| `docs/` | Prior-art, impact, governance, provenance and assessment records. |
| `dist/` | Generated local candidate; never source evidence by itself. |

## Completion discipline

Before a candidate can be called ready for an external pilot:

1. all schemas, registered tests, hostile controls and link checks pass;
2. deliberately bad fixtures make every load-bearing validator fail;
3. the build repeats byte-identically from the same committed source;
4. protocol pages and downloads agree on id, version, status and hash;
5. keyboard, mobile, reduced-motion, print and automated accessibility checks
   pass, with manual limits recorded;
6. a fresh adversarial reviewer finds no unresolved critical defect;
7. every benefit statement matches a version-bound evidence record; and
8. human/company impact remains `NO_IMPACT_EVIDENCE` until actual participants
   supply analyzable observations under an appropriate design.

Run the repository verification command documented in `README.md`. A green local
pipeline is a candidate-readiness result, not a publication or impact result.
