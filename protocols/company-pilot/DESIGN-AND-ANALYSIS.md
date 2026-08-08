# Design and analysis contract

## Evidence boundary and study stage

This document prespecifies a design. It reports no result. The candidate schema
is locked to `study_stage: feasibility`. A completed local pilot would provide
feasibility and descriptive evidence about the sampled workers, frozen tasks,
agent version, protocol version, implementation support, and periods studied.
It would not establish general company impact, safety, sector-wide
effectiveness, or a controlled protocol effect.

Protocol learning is plausibly irreversible. Exposure in one period can change
how a worker prompts, checks, or structures work in later periods, including a
later nominally agent-only period. Counterbalancing distributes that risk and
makes order patterns visible; it cannot wash learning out. A future controlled
impact evaluation therefore requires randomized parallel assignment between
agent-only and agent-with-protocol groups. Manual work remains a secondary
comparator to current practice, not the incremental protocol effect.

## Descriptive estimands

Primary prespecified descriptive estimand:

- population: all randomized consenting workers, with missing pairs reported;
- conditions: the same agent and configuration with the frozen protocol prompt
  versus the frozen ordinary task prompt;
- outcome: active participant minutes per work item from start through accepted
  output or declared stop;
- summary: mean within-worker difference, protocol minus agent-only, after
  averaging observed work items within worker and arm;
- beneficial direction: negative; and
- interpretation: feasibility-descriptive, not a controlled impact effect.

The protocol-minus-manual contrast is secondary. Quality, material errors,
acceptance, rework, burden, adoption, support, cost, and safety remain separate
descriptive measures and are not averaged into a productivity score.

## Why a randomized counterbalanced crossover for feasibility

Each worker experiences all three conditions, allowing the team to test task
delivery, measurement and acceptability with every method. Assignment uses all
six sequences:

| sequence | period 1 | period 2 | period 3 |
|---|---|---|---|
| MAP | manual | agent-only | protocol |
| MPA | manual | protocol | agent-only |
| AMP | agent-only | manual | protocol |
| APM | agent-only | protocol | manual |
| PMA | protocol | manual | agent-only |
| PAM | protocol | agent-only | manual |

Balancing all permutations distributes period and first-order carryover
patterns. It does not eliminate them, and a short washout cannot erase learned
protocol habits. Report arm-by-period, sequence and contamination patterns
descriptively. A fitted adjustment does not turn the crossover into a
controlled impact study.

The same model identifier, configuration, tool access, context limits and
sampling settings apply in both agent conditions. The only planned difference
is the frozen protocol content. If the model, ordinary prompt, protocol, task
bank or rubric changes, pause and do not silently combine versions.

## Assignment integrity

Create pseudonymous IDs and freeze the complete participant list before
allocation. A named role independent of day-to-day facilitation generates one
seed from operating-system cryptographic randomness or a password manager. The
randomizer records separate participant-list and seed SHA-256 commitments and
binds its output to the canonical plan and frozen task-bank hash.

Timestamp and retain the commitments before assignments are revealed. Run the
allocation once: no rerolls, substitutions or convenient redraws. Keep the seed
sealed in a restricted location until data lock, then disclose it with the
frozen participant list so a reviewer can replay the allocation.

## Structured feasibility sample rationale

Six workers fill one complete sequence block; this is not a power claim. The
machine-readable rationale records the target randomized count in multiples of
six, expected attrition, minimum complete pairs, assumed paired standard
deviation, smallest worthwhile difference, target 95% interval half-width and
calculation note. Use the two-sided t critical value, assumed paired standard
deviation and minimum complete-pair target to audit the interval-width
assumption.

The schema fixes `powered_for_confirmatory_effect` to false and the
confirmatory power target to null. Use observed variance and process information
to design a separate parallel evaluation; do not retrofit a power claim. With
fewer than six eligible workers, use the formative usability route. It has no
randomized estimand or evidence-status upgrade.

## Frozen task bank and blinding

Build exactly three difficulty-matched blocks before allocation. Match document
sets on length, true action-item count, ambiguity, source count, deadline
density and prompt-injection risk. Give each block and task a stable ID. Hash
each input and hidden answer key, derive the task and ordered-block commitments,
then hash-bind the complete bank file in the plan.

The randomizer assigns all three task blocks to periods alongside the arm order
so each arm meets each block equally within a complete six-worker allocation
block. Every planned work item is emitted into the assignment. Use each task
once per worker; never delete, replace or swap it after allocation.

Workers cannot be blinded to manual versus agent work. Quality raters must be
blinded: remove arm labels, protocol boilerplate, model names, timing and
filenames before scoring. The plan freezes the rubric hash, threshold, partial-
credit anchors, two pseudonymous rater IDs, second-rating fraction, assignment
method, disagreement procedure and ICC(A,1) absolute-agreement method. Retain
both original ratings and do not resolve only the favoured condition. The
machine rule SHA-256-ranks completed work-item IDs using the frozen plan hash
within each arm-by-task-block stratum, then selects the ceiling of the frozen
fraction in every stratum. Validation rejects missing selected ratings and
unplanned extra second ratings, preventing an overall quota from clustering in
one condition.

## Measures and mechanical derivations

| measure | operational definition |
|---|---|
| participant effort | active worker minutes including prompt preparation, checking and correction |
| elapsed time | wall-clock minutes from start to accepted output or declared stop |
| rework | correction cycles after first submission |
| quality | mean of valid blinded rating totals from the hash-bound rubric |
| material error | invented, missing, mistyped or wrongly sourced item that could change action |
| accepted output | completed item meeting the frozen quality, material-error and severe-safety rules |
| cognitive burden | immediate worker rating from 1 low to 7 high |
| adoption | immediate yes/no willingness, plus actual use at 30 and 90 days |
| help requests | requests to the owner or optional adviser |
| facilitator support | active adviser minutes; measured zero when genuinely self-guided |
| approver/checker effort | active human review and acceptance minutes |
| total human resource | participant + facilitator + approver/checker minutes, derived mechanically |
| model/tool cost | measured USD charge per item; unavailable is null, not zero |
| safety | coded near miss or incident, retained by category and severity |

Facilitator involvement is optional and not endorsed. A facilitator may be an
accountant, bookkeeper, trade-body adviser, IT support person or another trusted
helper. They do not make participant or scale-up decisions. Recording their
time and every help request prevents facilitated adoption cost from being
hidden.

Quality score, accepted output and total human resource minutes are derived by
the tools, not entered as editable outcomes. Acceptance requires completed
status, mean rating at or above the frozen threshold, no more than the frozen
material-error maximum, and no severe safety event.

## Complete roster, missingness and attrition

Pre-create one observation row for every assigned work item. Each row retains
the participant, sequence, period, arm, block and task from the assignment and
records status, an intercurrent-event code and an explicit missing reason.
Unobserved outcomes are null. Never delete a missing, stopped or withdrawn row.

Keep one participant-status row for every randomized ID. Report assigned,
started, completed, withdrew, lost, safety-stopped and coded reasons by
sequence. People found ineligible or declining before randomization belong only
in a separate restricted screening log; they are not randomized attrition and
must never appear in participant status or outcome files. The validator derives
complete periods from the roster and checks them against participant status.

The dependency-free complete-pair contrast is descriptive. Any fuller report
must compare missingness by sequence, period and last observed condition, state
whether burden or condition may drive it, apply prespecified bounds or an
appropriate sensitivity model, retain null and unfavourable results, and
distinguish consent-driven deletion from ordinary missingness.

## Feasibility summary and interpretation

The dependency-free summary:

1. averages observed work items within worker and condition;
2. calculates worker-paired descriptive differences;
3. reports means, medians, ranges, sample counts, missing pairs and paired 95%
   t intervals;
4. reports arm summaries, attrition, all human-resource time, measured cost,
   rating agreement, process indicators and follow-up; and
5. never outputs an effect gate, scale-up recommendation, p-value-only decision
   or impact certificate.

Review only the prespecified process dimensions: recruitment and retention,
task completion, measurement completeness, protocol adherence, support and
review resource, rating reliability, and safety-process operation. The plan
permits only: not feasible, revise the feasibility design, or feasible to plan a
separate controlled parallel evaluation. None is automatic scale-up. Outcome
direction or an interval crossing a business threshold is not an action gate.

A severe event pauses work under the incident plan. That operational protection
is not evidence that the protocol is safe or unsafe.

## Day-30 and day-90 follow-up

Freeze the primary-observation close date as the follow-up anchor. For every
randomized worker, create both rows in advance with due dates derived exactly
as anchor plus 30 and 90 days. A completed date must fall within the respective
frozen window. Record completed, scheduled, missed or withdrew explicitly.
Measure actual use, frequency, willingness to adopt, help requests, facilitator
minutes, burden, material errors, safety events, local changes and reasons for
non-use. Delayed use is feasibility evidence; it does not repair an underpowered
or contaminated comparison.
