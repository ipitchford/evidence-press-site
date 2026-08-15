# AGENTS.md — Evidence Press operating contract

Read this file before changing any part of the repository. It is an assurance
boundary, not a style guide.

## Mandatory context

For Evidence Press strategy, research selection, release authoring, catalogue
design, policy analysis, productivity claims, or assurance work, read in order:

1. [`docs/OPERATING_MODEL.md`](docs/OPERATING_MODEL.md) — canonical doctrine;
2. [`data/OPERATING_MODEL.json`](data/OPERATING_MODEL.json) — enforceable policy;
3. [`data/METHOD_REGISTRY.json`](data/METHOD_REGISTRY.json) — reusable methods;
4. [`data/IBE_LEDGER.json`](data/IBE_LEDGER.json) — live rival explanations,
   predictions, falsifiers, and observations.
5. [`data/WORK_LEDGER.json`](data/WORK_LEDGER.json) — prospective attempts,
   clocks, resources, comparisons, assurance endpoints, and explicit missingness.

Changes under `protocols/` must also follow [`protocols/AGENTS.md`](protocols/AGENTS.md).
If the two files overlap, preserve the stricter evidence boundary.

## Mission

Evidence Press tests whether research and policy analysis can be accelerated by
turning claims into open, modular, machine-readable, adversarially checkable
evidence objects; automating repeatable checks; preserving negative, partial and
stopped results; and concentrating human judgment on semantic validity, causal
assumptions, values, rights, accountability, and authorisation.

The current evidence establishes open candidate publication and producer-side
replay. It does not establish faster scientific discovery, journal-equivalent
assurance at lower total cost, improved policy decisions, or organisational
productivity. Treat those as defeasible hypotheses recorded in the IBE ledger.

## Three maxims

1. Accelerate what can be checked.
2. Stop what cannot be identified.
3. Publish the handoff, not merely the conclusion.

## Non-negotiable invariants

1. Target serial epistemic queues, duplicated checking, and closed
   dissemination. Do not frame human judgment itself as the problem.
2. Keep discovery, assurance, publication, and translation or adoption as
   separate clocks.
3. Keep availability, internal replay, independent rerun, independent
   reimplementation, formal verification, specialist review, editorial peer
   review, semantic validation, novelty assessment, priority assessment, and
   real-world impact separate.
4. Audit the semantic bridge between a substantive claim and its formal
   encoding. A checked certificate establishes only the encoded proposition.
5. Put identification before estimation; audit proxies against the outcome that
   matters; preserve non-identification, infeasibility, counterexamples, failed
   pilots, and stop receipts.
6. A child release can depend on a parent, but it is not independent
   confirmation of that parent.
7. DOI issuance, hashes, metadata, CI, internal replay, throughput, and media do
   not establish correctness, novelty, policy value, or productivity impact.
8. Do not reconstruct historical operating metadata that was not recorded.
   Legacy releases are explicitly grandfathered; the richer contract is
   prospective and fail-closed for new slugs.
9. Update the IBE ledger when new evidence materially strengthens or weakens a
   hypothesis. Do not silently turn a working explanation into institutional
   fact.
10. Never weaken a gate to make a candidate pass. Record the missing evidence or
    stop condition instead.
11. Register every prospective attempt at intake, including later null,
    stopped, failed, abandoned, superseded, and unreleased work. Never estimate
    throughput from the release catalogue alone.
12. Scope impact claims separately to science, policy, and productivity. A
    promoted status requires an appropriate design, resolvable evidence,
    measured assurance endpoint, and an independent dated review.
13. Keep artifact role separate from intended aim. Do not count a communication
    or method demonstration as a new research result merely because it serves a
    scientific, policy, or productivity aim.

## Required checks

Run these before calling an operating-model change ready:

```bash
node tools/test-operating-model.js
node tools/check-operating-model.js
node tools/make-thumb.js --check
REQUIRE_COMMITTED_MANIFESTS=1 ./protocols/deploy/integrate.sh
node protocols/tools/check-release-integrity.js
node tools/test-render.js
node tools/test-metadata.js
node tools/check-links.js
node tools/check-published.js
```

Every release must have a reproducible 2560x1440 YouTube thumbnail below 2 MB.
Generate it during authoring with `node tools/make-thumb.js <slug>`. Keep the
committed copy under `thumbs/`, mirror the exact bytes to `/Users/admin/thumbs`
on the maintainer Mac, and use the generator's deterministic background-palette
rotation. A bespoke slug specification may refine the claim-specific layout;
absence of one is not permission to omit the thumbnail.

The checks establish structural conformance and producer-side replay only. They
do not establish that the operating model improves science, policy, or
productivity.

## Publication boundary

Editing and testing a local branch does not authorise push, pull request, merge,
release, deployment, outreach, or changes to immutable research deposits. Use
the guarded publication workflow only when the user explicitly authorises
publication.
