# Company impact and evaluation protocol

## Decision and estimand

The first supported decision is deliberately small:

> Should this company continue to the next evidence stage, revise the method, or
> stop testing protocol-guided use of `document-to-action-plan` for this named,
> low-consequence workflow?

For the included feasibility crossover, the primary quantity is a **descriptive
within-worker contrast** between protocol-guided agent use and the same agent
without the protocol. Carryover prevents a causal interpretation. A future,
separately reviewed parallel B–C study may target the within-context incremental
effect. Manual work is a secondary comparator that anchors absolute cost and quality.

No result transfers automatically to a different workflow, organisation, model,
protocol version or risk setting.

## Eligibility gate

A workflow enters a trial only when it is:

- repeated often enough to observe more than a one-off anecdote;
- read-only and reversible during the trial;
- grounded in materials the company may lawfully and appropriately process;
- assessable against a pre-written quality/error rubric;
- owned by a named person with authority to stop the trial;
- reviewable by a person who understands the underlying work; and
- low consequence if an output is wrong, delayed or discarded.

Exclude decisions or actions in medical, legal, financial, employment,
safeguarding, safety-critical or regulated-record settings unless a later,
domain-specific protocol and governance review authorises them. Do not use live
customer, employee or commercially sensitive data in a first trial.

## Comparator logic

| Arm | Condition | Purpose |
|---|---|---|
| A | Existing/manual workflow | Absolute baseline. |
| B | Same agent and interface, ordinary user instruction | Isolates what the agent already provides. |
| C | Same agent and interface, protocol-guided instruction | Estimates the protocol's incremental contribution. |

Hold model, product, settings, source-material class and output constraints
constant between B and C. Record deviations. Do not select only favourable
outputs or tasks after seeing results.

The included three-period crossover exists only to test **feasibility mechanics**:
allocation, logging, measurement, support and retention. Protocol exposure can
teach a durable way of structuring work, so a short washout cannot reliably
restore an agent-only condition. A controlled productivity evaluation should
therefore randomize participants in parallel between B and C, block or stratify
the frozen task bank before allocation, and retain A as a secondary operational
baseline. Any departure requires an independently reviewed carryover model and
sensitivity plan before enrolment.

## Outcomes kept separate

- completion to the registered acceptance standard;
- blind or rubric-based quality;
- material errors, omissions and unsupported statements;
- active human minutes and interventions;
- elapsed time to accepted output;
- correction/rework minutes and number of cycles;
- model/tool cost and output length;
- cognitive burden and clarity of permissions;
- help requests, abandonment and protocol-compliance burden;
- unintended external actions, privacy/security incidents and near misses;
- stated adoption intent immediately, then observed use at 30 and 90 days.

The primary outcome and smallest worthwhile effect must be chosen before data are
examined. A time saving cannot rescue a material error or unacceptable safety
event. Do not collapse the vector into a single productivity score unless the
company declares the decision weights in advance.

## Study stages

1. **Formative usability.** Observe whether representative novice users can pass
   the readiness screen, understand the data/permission boundary, complete the
   trial and recognise a deliberately bad output. This identifies design defects;
   it is not an impact estimate. The starter includes a fixed synthetic bad
   output and an unsummed observation sheet so every volunteer encounters the
   same permission/failure-recognition rehearsal.
2. **Feasibility pilot.** Test recruitment, task matching, logging, rubric use,
   attrition and measurement burden. Treat effect estimates as exploratory.
3. **Controlled comparison.** Freeze the protocol, task bank, rubric and analysis
   plan; justify sample size for the parallel B–C estimand, clustering and all
   guardrails; blind assessors where feasible; report confidence intervals,
   participant flow, missingness sensitivity and every exclusion.
4. **Sustained-use follow-up.** At 30 and 90 days, record actual use, drift,
   incidents, workarounds, support and whether the workflow was abandoned.

## Analysis and reporting

- For the feasibility crossover, report B–C results as descriptive and
  exploratory only. For a future controlled parallel design, report the
  preregistered between-group B–C estimate with uncertainty for the primary
  outcome and every safety/error guardrail.
- Report A separately; do not confuse agent benefit (A–B) with protocol benefit
  (B–C).
- Preserve task-level results, missingness, attrition, order and learning effects.
- Calibrate any model grader against blinded human ratings before relying on it.
- Retain negative, null and harmful findings in the public record.
- State protocol version, model/product version, dates, company context and
  transferability limits.

## Evidence-state mapping

| Evidence | Maximum defensible statement |
|---|---|
| Structural and mutation tests | The pack and checks are mechanically inspectable. |
| Model/task benchmark | A result occurred on the registered models and tasks. |
| Formative usability | Named users could or could not operate the trial; no effect claim. |
| Confirmatory controlled-user comparison with defensible identification | A context-bound user signal with uncertainty; attribution depends on the design. |
| Organisational observation | A field signal; not necessarily causal. |
| Confirmatory randomized or defensible quasi-experimental design | A context-bound attributable effect may be supported after independent review. |

The current candidate has predecessor model benchmarks but no human/company
observations. Company impact therefore remains `NO_IMPACT_EVIDENCE`. Its
positive-promotion gate is disabled: no evaluation record in this version can
automatically issue `BENCHMARK_SIGNAL`, `CONTROLLED_USER_SIGNAL`, `FIELD_SIGNAL`,
or `CAUSAL_EFFECT_SUPPORTED`.

## Evidence profile, not a single design label

Every future result must record four separate dimensions:

- **setting:** benchmark, controlled user, or organisational field;
- **study stage:** development, formative, feasibility, or confirmatory;
- **identification:** descriptive, randomized, quasi-experimental, or
  observational; and
- **review status:** internal, independently reviewed, or independently
  replicated.

These fields describe the study; they do not grant a claim. Promotion additionally
requires a reviewed artifact binding the protocol and task versions, participant
flow, analysis, uncertainty, missingness, every guardrail, and the exact transfer
boundary.
