# Company feasibility pilot: from documents to a checkable action plan

This field kit is for a company with little or no experience using AI agents.
Its formative route uses editable templates and requires no installation. The
randomized feasibility route requires a facilitator/operator with Node 18 or
later and competence editing structured JSON files, but requires no API,
plugin, or agent integration. Both routes address one bounded use case: turning
non-sensitive business documents into a source-traceable action plan with the
existing document-to-action-plan protocol.

It is a feasibility kit, not a controlled impact evaluation or rollout
recommendation. It contains no measured company result and establishes no
benefit, safety, return on investment, or general applicability. Its
machine-readable study stage is locked to `feasibility`; `formative` and
`controlled` require different designs and artifacts.

## The question this pilot can describe

The primary question is deliberately specific:

> In this feasibility sample, for the same worker, frozen task blocks, agent,
> and agent configuration, what observed difference in active human minutes
> accompanies protocol use rather than an ordinary task prompt?

This crossover cannot identify a controlled protocol impact. Learning the
protocol is not reversible: a worker exposed to it may carry that knowledge
into a later agent-only period. Counterbalancing helps diagnose period and
order patterns but cannot remove that contamination. A future controlled impact
evaluation must randomize workers in parallel between agent-only and protocol
arms. Manual work remains a secondary comparator to current practice.

The manual arm is a secondary comparator. It shows how both agent conditions
relate to current practice, but it does not isolate the protocol contribution.
Quality, material errors, rework, cognitive burden, adoption, help requests,
facilitator time, and safety remain separate measures. They are never hidden
inside one productivity score.

## Stop before starting if

- the documents contain personal, special-category, legally privileged,
  safety-critical, or commercially sensitive data;
- an output will decide employment, credit, health, legal rights, safety, or
  another high-impact matter;
- the agent must send, publish, edit a live system, or take an external action;
- workers cannot freely decline or withdraw without penalty;
- the workflow owner, data destination, retention date, decision rights,
  rollback route, or incident contact is unknown;
- comparable work cannot be scheduled across all three conditions; or
- a blinded quality rubric cannot be applied.

Use the readiness gate in templates/pilot-plan.template.json. A FAIL or UNKNOWN
means HOLD, not “proceed carefully.”

## If fewer than six workers are eligible

Do not force an under-sized randomized comparison or assign everyone the same
order. Use templates/formative-usability-route.md instead. That route helps a
micro-firm test comprehension, support needs, data boundaries, and incident
handling with one to five volunteers and synthetic material. It produces no
randomized effect estimate, productivity claim, or evidence-status upgrade, and
must not be passed to the summary tool.

## A starter journey

1. Choose one recurring, low-stakes, read-only workflow. Meeting notes,
   non-sensitive project updates, or redacted internal briefs are suitable
   candidates. Start with synthetic documents where possible.
2. Name the workflow owner, affected people, data owner, output approver,
   rollback owner, and incident contact. Write down who may start, pause, stop,
   approve outputs, and approve any future scale-up.
3. Decide whether to work self-guided or invite an optional trusted adviser,
   such as an accountant, bookkeeper, trade-body adviser, or IT support person.
   The kit does not endorse any adviser. They do not make participant or
   scale-up decisions. Record every help request and every active support minute
   so facilitated adoption cost is visible.
4. Give workers templates/worker-information-and-consent.md. Keep identifiable
   consent records separate from pseudonymous pilot outcomes. Participation is
   voluntary and must not feed performance management or employment decisions.
   Keep eligibility decisions and people not randomized in a separate,
   restricted screening log; they must never appear in `participant_status`.
5. Complete the pilot plan. Freeze the agent model/configuration, ordinary
   prompt, protocol prompt, quality rubric and acceptance threshold, second-
   rating plan, task-matching rules, feasibility sample rationale, attrition
   plan, and analysis before enrolment. Build the three matched task blocks in
   `task-bank.template.json`; bind every task input and hidden answer key by
   SHA-256, then bind the complete task-bank file in the plan.
6. Enrol with pseudonymous IDs and freeze the complete participant list. A named
   seed custodian, role-separated from recruitment and outcome review, generates one private seed using operating-system or
   password-manager randomness, records the participant-list and seed
   commitments before assignments are revealed, and runs the randomizer once.
   Rerolls are prohibited. Keep the seed sealed until data lock, then disclose
   it with the frozen list for replay. Randomly assign workers to the six
   counterbalanced sequences; do not choose the order that looks convenient.
7. Run three periods. Each worker uses manual work, the same agent without the
   protocol, and the same agent with the protocol in their assigned order and
   on their assigned task block. Use each frozen task once per worker. Do not
   swap, reuse, or silently replace a task after assignment.
8. Create the complete observation roster from the assignment before work
   begins. Update `templates/work-item-record.md` immediately after every item,
   including missing, stopped, and withdrawn items. A blinded rater applies the
   frozen rubric without seeing the arm. The validator reproduces the frozen
   SHA-256 selection within each arm-by-task-block stratum for second ratings;
   do not choose the subset after seeing quality.
9. Keep every randomized worker in `participant_status`, including withdrawals
   and missing outcomes. Never delete an inconvenient randomized row. Do not
   add people screened out before randomization; the separate screening log is
   not an outcome dataset and is never passed to these tools.
10. Validate and summarize. The summary reports complete-pair descriptive
    estimates, uncertainty, missing pairs, attrition, process indicators,
    participant/facilitator/approver minutes, and measured model/tool cost. It
    computes no scale-up or effect gate and is not an impact certificate.
11. Freeze the primary-observation close date as the follow-up anchor. Derive
    due dates as anchor plus 30 and 90 days and use the frozen completion
    windows. Record missed and withdrawn rows explicitly. A missing response is
    feasibility data, not a reason to remove the person.
12. A human group reviews recruitment, completion, measurement, adherence,
    support, rating reliability, and safety-process feasibility. It may stop or
    revise the feasibility work, or plan a separate controlled parallel
    evaluation. Scale-up is never automatic and outcome direction in this
    crossover is not a controlled effect estimate.

## Feasibility facilitator commands

These commands are not part of the no-install formative route. The feasibility
facilitator needs Node 18 or later and must be comfortable editing and checking
structured JSON files. No model API or agent integration is required. Run from
the repository root.

Create an allocation after replacing the private seed and participant IDs:

    node tools/pilot-randomize.js \
      --plan PATH/frozen-plan.json \
      --input company-pilot/templates/randomization-input.template.json \
      --out company-pilot/working-assignment.json

The public input is an example only. Replace example_only with os_csprng or
password_manager_random and use a newly generated private seed. The tool refuses
to overwrite an existing allocation. Store the seed separately, retain the
participant-list and seed SHA-256 commitments, prohibit rerolls, and do not put
names or email addresses in either file. company-pilot/.gitignore excludes the
normal working allocation, consent, outcome, incident, follow-up, and summary
locations from version control.

Validate a draft plan:

    node tools/pilot-validate.js \
      --plan company-pilot/templates/pilot-plan.template.json

Apply the actual run gate:

    node tools/pilot-validate.js \
      --plan PATH/plan.json \
      --assignment PATH/assignment.json \
      --run-ready

Validate collected data and follow-up:

    node tools/pilot-validate.js \
      --plan PATH/plan.json \
      --assignment PATH/assignment.json \
      --observations PATH/observations.json \
      --follow-up PATH/follow-up.json

Print a deterministic JSON summary:

    node tools/pilot-summary.js \
      --plan PATH/plan.json \
      --assignment PATH/assignment.json \
      --observations PATH/observations.json \
      --follow-up PATH/follow-up.json

Run the kit’s positive and known-bad controls:

    node tools/pilot-tests.js

## What the tools do not do

They do not call a model, upload data, provide legal or employment advice,
replace ethics or worker consultation, determine a sufficient sample size,
adjust the final analysis for period and sequence, or establish impact. The
dependency-free summary is an audit-friendly first view; DESIGN-AND-ANALYSIS.md
defines the stronger final analysis and its limitations.

## Files

- DESIGN-AND-ANALYSIS.md — evidence boundary, descriptive estimands,
  counterbalancing, measurement, missingness, uncertainty, and follow-up.
- templates/pilot-plan.template.json — fail-closed governance and analysis plan.
- templates/task-bank.template.json — synthetic example of the frozen task,
  input, answer-key, block, and file-hash contract.
- templates/observation-dataset.template.json — complete planned-roster shape
  with nullable outcomes and explicit missingness.
- templates/formative-usability-route.md — explicitly non-comparative route for
  a micro-firm with fewer than six eligible workers.
- templates/formative-observation-and-failure-recognition-sheet.md — simple
  observer record plus a fixed synthetic bad output for checking comprehension,
  permission boundaries, support needs, and stop-route recognition without a
  participant score.
- templates/screening-log-boundary.md — separation between pre-randomization
  screening and randomized outcomes.
- templates/worker-information-and-consent.md — worker-facing information.
- templates/quality-rubric.md — blinded quality and material-error scoring.
- templates/work-item-record.md — operational capture for every work item.
- templates/facilitator-guide.md — optional support boundary and time capture.
- templates/incident-and-rollback-card.md — one-page stop and recovery route.
- fixtures/known-bad/ — mutations that the tests require the validator to reject.
- ../schema/pilot-*.schema.json — machine-readable structural contracts.
- ../tools/pilot-*.js — dependency-free randomize, validate, summarize, and test.
