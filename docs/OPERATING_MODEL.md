# Evidence Press operating model

Version: 1.0  
Adopted: 10 August 2026  
Status: prospective institutional contract and defeasible working explanation

This document is the canonical human-readable operating doctrine for Evidence
Press. The machine-enforced policy is in
[`data/OPERATING_MODEL.json`](../data/OPERATING_MODEL.json); reusable methods are
in [`data/METHOD_REGISTRY.json`](../data/METHOD_REGISTRY.json); the evidential
case and its rivals are in [`data/IBE_LEDGER.json`](../data/IBE_LEDGER.json).
Prospective intake, attempt, resource and clock observations are retained in
[`data/WORK_LEDGER.json`](../data/WORK_LEDGER.json).

## Purpose

Evidence Press tests whether research and policy analysis can be accelerated by
turning claims into open, modular, machine-readable and adversarially checkable
evidence objects; automating repeatable checks; preserving negative, partial and
stopped results; and concentrating human judgment on semantic validity, causal
assumptions, values, rights, accountability and authorisation.

The objective is not to remove humans. It is to shorten serial epistemic queues,
move repeatable checks off the critical path, and make the remaining judgment
explicit and accountable.

## Claim ceiling

The catalogue demonstrates the ability to publish selected research candidates
openly, with stable identifiers, structured metadata and producer-side replay.
It does not by itself establish:

- faster scientific discovery rather than faster packaging;
- correctness, novelty, priority or journal-equivalent assurance;
- lower total human and computational cost at matched assurance;
- better or faster policy decisions;
- organisational productivity, adoption or social impact.

Those propositions are hypotheses. They may be supported, weakened or falsified
only within an explicit scope. A DOI, hash, manifest, green CI run, internal
replay, model agreement, media asset or large release count cannot promote them.

### Adoption baseline

At source commit `6585348a0aa4c7a89ee0dafcaf29ca719cae56fd`, the catalogue
contained 21 releases dated 28 July to 9 August 2026: 19 unrefereed candidates
and two unrefereed preprints. All reported internal replay; none reported
editorial peer review, independent reproduction or end-to-end formal
verification. This is a frozen baseline observation, not a permanent statement
about the catalogue.

## Best current explanation

The best current explanation is conjunctive:

- genuine automation of packaging, structured release and producer replay;
- a plausible but untested discovery-gain mechanism in bounded, exact and
  certificate-friendly domains;
- strong selection into digitally specified and machine-checkable tasks;
- intensive human orchestration and agent or compute use;
- publication at an earlier assurance endpoint, with external assurance moved
  into a later track;
- survivor-selection and denominator effects, plus correlated reuse within
  genuine research lineages.

This explanation is adopted as a live operating hypothesis, not established as
a comparative or causal effect. The IBE ledger retains the strongest alternatives and
the observations that would count against each component.

## Three maxims

1. **Accelerate what can be checked.** Prefer compact evidence objects and
   fail-closed verifiers, while auditing the source-to-encoding bridge.
2. **Stop what cannot be identified.** Test whether evidence can distinguish
   the target mechanism before estimating it; publish the boundary and missing
   measurement when it cannot.
3. **Publish the handoff, not merely the conclusion.** Ship certificates,
   counterexamples, obstructions, bounds, stop receipts, dependencies and
   executable open problems so another person or agent can continue.

## Reusable operating repertoire

The catalogue audit identifies 13 reusable methods. They are registered with
applicability conditions, failure modes, aims and representative releases in
`METHOD_REGISTRY.json`; registry inclusion shows a reusable pattern, not a
validated acceleration effect.

- **Build and checking:** certificate-first proof-carrying research; structural
  compression; exact regime stitching; adversarial scientific controls;
  explicit research-lineage reuse; productive failure and stop receipts.
- **Evidence and decisions:** identification before estimation; partial
  identification and robust decisions; counterexample- and proxy-first
  analysis; certified decision margins.
- **Assurance and translation:** assurance as a vector; agent-readable research
  objects; staged adoption and impact evaluation.

The default project design should select the smallest combination that produces
a bounded decision object. Methods must not be counted as gains merely because
they were used; effect evidence is recorded separately in the work and IBE
ledgers.

## The four clocks

Never collapse these into one speed measure:

1. **Discovery clock:** intake to a bounded substantive result.
2. **Assurance clock:** result to a declared, independently evidenced assurance
   state.
3. **Publication clock:** frozen claim to a complete, open, archived package.
4. **Translation clock:** assured artefact to policy, operational use or other
   adoption.

Shortening one clock does not prove that another has shortened. In particular,
claim-lock-to-publication is a publication estimand; intake-to-result at a
matched assurance boundary is a research estimand.

## Project selection

Prefer work with both decision leverage and an inspectable output. Promising
outputs include:

- a certificate or small verifier;
- a sharp or conservative bound;
- an identified set or infeasibility witness;
- a counterexample or obstruction;
- a stability or decision margin;
- a stop receipt and discriminating measurement requirement;
- a reusable structural reduction or normal form;
- an executable open problem with an explicit dependency boundary.

Lower expected acceleration where the load-bearing work is wet-lab, field,
proprietary-data, stakeholder-dependent, ethically contested or primarily
semantic. Such work may still matter, but the operating model must not pretend
that mechanical verification resolves its human or institutional gates.

## Release contract

Every non-legacy release must declare an `operatingModel` record containing:

- a stable `workId`, one or more reciprocal work-ledger `attemptIds`, and the
  science, policy or productivity aims to which the record applies;
- one or more artifact roles distinguishing research outputs, evidence
  assessments, method demonstrations and communications;
- a required nullable `lineageId`: the exact registered lineage or programme-root
  assignment, or `null` when no such assignment exists;
- one or more registered `accelerationPrimitives`;
- a primary `decisionObject` and its bounded scope;
- the discovery, assurance, publication or translation bottleneck targeted;
- the semantic-bridge state, remaining risks and explanation;
- the human judgment gates that remain;
- structured parent links, if any, resolving to a prospective work, frozen
  legacy release or external URL and stating the inherited claim and assurance
  ceiling;
- a multidimensional next-assurance target and claim ceiling;
- one impact claim for every declared aim, each with an outcome, setting,
  comparator, estimand, design class, evidence references and independent
  promotion review. A no-evidence record is explicit and carries no design or
  effect evidence.

The linked work-ledger attempts are the denominator. They record selection,
terminal status, null or negative results, comparisons, milestones, active
human and compute resources, rework, corrections and the assurance endpoint.
Missing values require an explicit reason and cannot be reconstructed later.
One underlying `workId` may have more than one attempt or press artifact; those
records remain distinct through `attemptId`, release slug and artifact role.

The 21 releases present when this contract was adopted are enumerated as legacy
records in `data/OPERATING_MODEL.json`. They remain valid without retrospective
metadata. A new slug not on that immutable adoption list fails the build unless
its operating-model record is complete. Adding a slug to the legacy list is a
policy change requiring explicit review; it is not a routine way to make a
release pass.

## Assurance allocation

Discovery and checking may be parallelised, but external assurance is a distinct
track. Evidence Press should increasingly allocate effort to unaffiliated
reruns, independent reimplementations, specialist review and formalisation
instead of treating candidate count as the sole output.

The established public release matrix has eight object-level dimensions. A
prospective work receipt adds semantic validation, novelty assessment and
priority assessment as three separate targets, giving an 11-dimension workflow
endpoint. These surfaces answer different questions and are never combined into
a scalar badge: the release matrix describes the object now published, while a
dated work-ledger endpoint records the boundary reached by that attempt. Neither
surface may silently upgrade the other.

Human judgment remains mandatory where the decision concerns:

- whether the formal object represents the substantive claim;
- whether causal assumptions or measurement definitions are credible;
- whether values, distributional effects, rights and risks are acceptable;
- whether publication, policy or operational action is authorised.

## Negative and partial knowledge

Non-identification, failed feasibility, no clear gain, harm, infeasibility,
counterexamples and stalled parent targets are first-class outcomes when they
prevent false precision or duplicated work. They must remain visible through
later versions and cannot be erased by a positive successor.

A partial or negative output should state:

- the exact scope in which it applies;
- the route that was stopped;
- the evidence or theorem that justifies stopping;
- the observation or assumption that could reopen the route;
- the reusable methods, artefacts or obstructions left behind.

## Research lineage

Parent-child links reduce reconstruction cost but also create correlated risk.
Every child must identify inherited claims and assurance ceilings. Reuse is not
independence, and a lineage of internally consistent releases can share one
semantic or mathematical defect.

The method registry keeps broad `methodClusters` separate from evidence-backed
`lineages`. Clusters classify adjacent operations; they do not establish
dependency or shared provenance. Inclusion means that a release illustrates a
method; it does not imply that its theorem, novelty or impact has been
independently established.

Every lineage names one immutable `rootReleaseSlug`, which is also its first
member. A singleton lineage is only an explicit prospective programme root; it
does not demonstrate reuse, a speed gain or correlated confirmation. Later
members may be appended at the tail but prior members may not be deleted,
replaced or reordered. Every non-legacy release carries a required nullable
`lineageId`. A non-root member must reciprocate its registry assignment and link
to an earlier member through a structured evidential parent link that states the
inherited claim and assurance ceiling. Only the explicit root is exempt from
that parent-link requirement. The lineage name, basis, root and shared boundary
remain immutable; a semantic replacement receives a new identifier.

## Self-correction without a commissioned study

The IBE ledger is a live institutional record. Each hypothesis must contain:

- its present epistemic status and bounded scope;
- the strongest rival explanations;
- observations supporting and limiting it;
- distinctive predictions with an estimand, comparator, threshold, observation
  window and prospective measurement plan;
- potential falsifiers or weakening observations;
- a dated update rule.

The work ledger retains workflow receipts prospectively from intake, including
every attempt rather than only releases: stable attempt and work identifiers,
selection basis, active and terminal states, first substantive result, claim
lock, public release, active human time, compute, rework, corrections,
comparators and later assurance. Missing historical data must remain missing;
it must not be reconstructed from publication or commit dates.

## Predictions and failure conditions

The operating explanation predicts larger gains for modular, falsifiable,
digitally specified work with compact checkers; a smaller advantage for field,
laboratory, stakeholder and normative work; and a growing external-assurance
bottleneck as candidate production becomes cheaper.

The stronger acceleration thesis is weakened if, at matched scope and assurance:

- total human effort or elapsed time does not fall;
- correction or severe-error rates rise;
- independent maturation is not faster;
- genuine lineages do not reduce reconstruction cost;
- negative results do not prevent repeated dead ends;
- downstream policy or operational use remains unchanged;
- the apparent gain disappears after task selection, lineage-aware dependence
  adjustment and attempted-project denominators are included.

## Change control

This doctrine, its machine contract, method registry, IBE ledger and work ledger
are versioned together. Changes must preserve historical observations and add dated revisions
instead of silently rewriting the prior explanation. The validator and hostile
tests are part of the trusted operating boundary.

Passing those checks establishes structural conformance only. Whether the
operating model accelerates reliable science, policy or productivity remains a
separate evidential question.
