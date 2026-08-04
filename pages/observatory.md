Policy debates often fail before estimation begins. Analysts may confuse stocks with flows, treat a proxy as though it directly measured a mechanism, omit rival explanations, fit parameters that the observations cannot separate, or report a point estimate where the evidence permits only a range. More data and more computation do not repair those defects automatically.

The **Policy Identification Observatory** is being built to find them systematically.

It uses persistent artificial intelligence agents, explicit research protocols, formal and computational methods, and adversarial reimplementation to audit consequential policy claims. Its purpose is not to automate political judgement. It is to improve the evidential map on which judgement operates.

A completed audit should tell decision-makers:

- what the public evidence directly establishes;
- which conclusions depend on additional assumptions;
- which rival mechanisms remain observationally compatible with the evidence;
- whether the focal effect is point identified, partially identified, or unidentified;
- which policy choices remain robust across the surviving models; and
- what new measurement, linkage, experiment, or institutional record would most improve the decision.

The unit of work is therefore not commentary. It is a versioned research case with a claim, an evidence boundary, a mathematical result, an assurance status, and a replay path.

> **Current status, 2 August 2026:** the foundational build is complete. It establishes the operating protocol, machine-readable case structure, validation and replay machinery, synthetic test cases, and reusable agent workflows. The next goal will run a complete audit on a live policy claim and test the institution outside its founding exemplar.

## The founding example

The Observatory grew out of [*Stocks Are Not Flows: An Identification Audit of Investor Pressure and Tenure Change in England*](/releases/stocks-are-not-flows/).

That project began as a planned structural extension of an economic model. Before fitting the model, the research agents asked whether the available aggregate observations could distinguish the proposed investor-pressure mechanism from plausible alternatives. Under the registered observation map, they could not. Credit conditions, housing supply, demographics, tax changes, alternative resource losses, institutional entry, and combinations of these mechanisms could generate the same observed pattern.

The project therefore stopped before producing a unique historical attribution. It preserved the public accounting results, proved a design-conditioned non-identification result, supplied conditional partial-identification tools, and identified the joint transaction record that would add the most useful discriminating information.

![Left panel: one observed series with four different mechanism curves passing exactly through the same records. Right panel: three axes showing a point-identified estimate, a bracketed partially identified interval, and a wholly unidentified parameter.](/assets/art/observatory-identification.svg "The defect the Observatory looks for. When several mechanisms reproduce the same records exactly, the evidence cannot choose between them, and the honest output is a bounded set rather than a point estimate.")

That outcome suggested a broader institution. Many policy disputes need the same sequence: define the claim, inspect the measurement, construct the rival mechanisms, test identification, bound what remains, and redesign the evidence before producing an answer.

## The question the Observatory asks

For each case, the Observatory begins with one exact public claim and one decision that the claim may affect. It then asks:

1. **What is the estimand?** What quantity, effect, population, geography, period, unit, and comparison does the claim concern?
2. **What is actually observed?** Which records are direct measurements, which are constructed variables, and which are proxies?
3. **What accounting must hold?** How do stocks, entries, exits, durations, transfers, and residuals relate?
4. **Which mechanisms could produce the observations?** What is the strongest plausible rival-mechanism class supported by the inspected corpus?
5. **Can the observations distinguish the focal mechanism?** Does the design identify the target locally or globally, or do observationally equivalent countermodels remain?
6. **What is the strongest bounded conclusion?** Is the sign known? Is the magnitude bounded? Is the result sensitive to one assumption or corpus choice?
7. **Which actions survive the uncertainty?** Are any options dominated, robust, or low-regret across the admissible model set?
8. **What additional information would matter?** Which new field, linkage, comparison, intervention, or experiment would create a genuinely discriminating direction?

The intended analytical path is:

```text
public claim
    → exact estimand and decision
    → frozen evidence boundary
    → measurement and accounting model
    → focal and rival mechanisms
    → identification or identified set
    → robust decisions
    → value of additional information
```

## How a case runs

![A flow diagram of nine stages in three rows: claim registration, corpus freeze and measurement audit; rival mechanisms, identification gate and bounded inference; sensitivity and decision analysis, adversarial verification, and release and persistence. Below are the publication-ready, blocked and rejected terminal-status families.](/assets/art/observatory-pipeline.png "Nine stages, three phases. Evidence work precedes inference; inference precedes any decision claim; and nothing is released without an adversarial pass and a registered terminal status.")

| Stage | Central question | Required public object |
|---|---|---|
| **1. Claim registration** | What exactly was asserted, by whom, when, and for which decision? | Original wording, source, estimand, population, period, units, comparison and decision context |
| **2. Corpus freeze** | Which evidence was inspected, and what was excluded? | Search date, source ledger, inclusion and exclusion rules, frozen or receipted source objects |
| **3. Measurement and accounting audit** | What do the data observe, and how do the quantities relate? | Measurement ontology, stock-flow or state-transition equations, unit reconciliation, missingness and linkage audit |
| **4. Rival-mechanism construction** | What else could generate the same pattern? | Source-backed rival ledger, causal or structural pathways, nuisance responses and semantic coverage statement |
| **5. Identification gate** | Can the focal contribution be separated from the rivals? | Rank, null-space, observability, causal-equivalence, optimisation, symbolic, or countermodel analysis as appropriate |
| **6. Bounded inference** | What is the strongest conclusion the design warrants? | Point estimate only when identified; otherwise sharp or conservative bounds, sign result, infeasibility result, or explicit ambiguity |
| **7. Sensitivity and decision analysis** | Which conclusions and choices survive plausible changes? | Assumption sweeps, corpus-boundary tests, specification checks, robust-policy set and value-of-information analysis |
| **8. Adversarial verification** | Can a fresh agent break the result or reproduce it independently? | Review ledger, counterexample search, mutation tests, fresh implementation where feasible, resolved and unresolved findings |
| **9. Release and persistence** | Can another researcher inspect, replay, correct, or continue the work? | Paper or technical report, code, evidence package, claim-to-evidence index, assurance statement, manifest and machine-readable receipt |

A case does not have to produce a positive causal estimate to succeed. It may end with a publication-ready non-identification result, an identified interval, a robust-decision map, a minimum-data theorem, or a documented stop. The Observatory treats these as scientific outputs rather than failed attempts.

Its terminal statuses are explicit:

```text
PUBLICATION_READY
PUBLICATION_READY_NONIDENTIFICATION
PUBLICATION_READY_PARTIAL_IDENTIFICATION
BLOCKED_MISSING_DATA
BLOCKED_SEMANTIC_UNCERTAINTY
REJECTED_NO_NOVEL_RESULT
REJECTED_INSUFFICIENT_RIGOUR
```

These labels prevent a polished narrative from concealing an unresolved scientific defect.

## What makes the institution agent-native

Calling a project agent-native should mean more than using an artificial intelligence system to draft prose or run code. The research process itself must exploit capabilities that persistent agents make possible.

### Persistent research state

Ordinary AI conversations are ephemeral. The Observatory treats research as durable state. Each case records the exact claim, corpus boundary, source provenance, assumptions, transformations, failed approaches, test results, review findings, unresolved questions, and current assurance status in a versioned repository.

A new agent should be able to continue from inspected objects rather than reconstructing the project from a narrative summary. Long-running goals or equivalent persistent execution can pursue a case until it reaches a registered success condition, a genuine blocker, or a resource ceiling. Scheduled agents can maintain the candidate queue, refresh source registries, or revisit cases when new evidence appears.

### Adversarial production

The agent that constructs an analysis does not certify itself. A fresh review agent begins from the registered claim and evidence boundary, reconstructs the load-bearing steps, searches for omitted mechanisms and sign-reversing countermodels, and tries to make the result fail.

Where possible, the review should use fresh downloads, separate code, a clean worktree, a new context, and a different model family. These measures reduce shared-context and implementation dependence. They do not guarantee full epistemic independence, and the assurance statement must not pretend that they do.

The most valuable review is often semantic rather than computational: did the formal object really represent the public claim, and did the rival class cover the mechanisms that matter?

### Reproducible evidence

Each release should include, where lawful and technically possible:

- frozen inputs or source receipts;
- a corpus manifest and source ledger;
- exact transformations and unit conventions;
- pinned software environments;
- deterministic replay commands;
- tests, negative controls and deliberately mutated cases;
- hashes for the released artefacts;
- a claim-to-evidence index;
- an assurance statement that draws the claim ceiling; and
- a machine-readable receipt recording the terminal status.

Deterministic replay establishes that the released package reproduces its own stated computation. It does not establish independent replication, semantic correctness, causal validity, peer acceptance, or truth. Observatory releases use the [Evidence Press verification ladder](/about/#the-verification-ladder) to preserve those distinctions.

### Machine-readable research

The evidence boundary and conclusion should be usable by other agents without scraping prose. Claims, sources, assumptions, mechanisms, missingness, identification status, sensitivity results, review findings, open problems, and receipts therefore use documented schemas.

This allows another research system to do more than cite a conclusion. It can inspect the assurance status, identify the unresolved dependency, reproduce a calculation, challenge an excluded mechanism, or take up the most valuable next experiment. Evidence Press already exposes its releases through [machine-readable endpoints designed for research agents](/ai/); the Observatory extends the same principle into the research process itself.

### Cumulative correction

A persistent institution must remember errors as well as results. Failed approaches, rejected candidates, refutations, corpus revisions and corrected releases remain part of the record. Corrections change the status openly rather than silently rewriting history.

This creates institutional memory that does not depend on one person or one model retaining the details. It also gives future agents negative knowledge: which routes failed, why they failed, and which assumptions caused the failure.

## Designed to improve decisions

The Observatory does not treat causal estimation as the only useful endpoint. Policy decisions often must proceed while several mechanisms remain compatible with the evidence.

Suppose the current evidence leaves a set of admissible models. The Observatory can compare each policy across that set and report:

- options that are dominated under every surviving model;
- options that meet a declared minimum standard across all models;
- choices whose ranking depends on one visible assumption;
- choices with low maximum regret;
- thresholds at which the preferred decision changes; and
- new information most likely to alter the decision.

![A grid scoring four policy options against six models the evidence still admits. One option fails under every model, one passes under every model, one fails under a single model, and one is split evenly.](/assets/art/observatory-decision-map.svg "A robust-decision map. Uncertainty about mechanism does not always imply uncertainty about action: a dominated option can be ruled out, and a robust option defended, without ever identifying the effect.")

This is a decision map, not an automated policy verdict. Elected institutions, public bodies and affected communities must still set objectives, distributional weights, rights constraints, acceptable risks and political priorities. Agents can clarify the consequences of those choices. They cannot derive the values that authorise them.

## Division of responsibility

| Participants | Primary responsibilities |
|---|---|
| **Research agents** | Claim discovery, corpus inspection, formalisation, measurement audits, modelling, proof, computation, countermodel search, sensitivity analysis, drafting, replay and adversarial review |
| **Human stewards** | Public-purpose prioritisation, normative and legal boundaries, privacy decisions, contentious corpus exceptions, escalation of high-impact claims, publication approval and institutional accountability |
| **External researchers and agents** | Independent reproduction, refutation, prior-art discovery, semantic challenge, formal verification, data improvement and follow-up research |

The Observatory should automate work that benefits from breadth, persistence and exact replay. It should preserve explicit human authority where the task involves values, rights, sensitive data, legal responsibility, or publication on behalf of an institution.

## What the Observatory can publish

A mature programme should produce several kinds of output:

### Identification audits

These determine whether the registered observations can separate a focal mechanism from plausible rivals. A rigorous failure result can stop an unsupported structural attribution before it acquires false precision.

### Partial-identification results

When the evidence cannot support a single value, the audit should derive the strongest defensible set or bound and show which assumptions narrow it.

### Measurement and accounting audits

These reconcile units, populations, classifications, stocks, gross transitions, net transitions, durations and residuals. They can expose a policy argument that asks one dataset to measure an object it never observes.

### Robust-decision analyses

These identify policies that remain acceptable across the surviving model set and disclose the assumptions that change the ranking.

### Minimum-data and experiment designs

These identify the smallest new measurement or design change likely to distinguish the remaining mechanisms. The result may redirect data collection before an agency commits to an expensive linkage, survey or trial.

### Formal audits of rules and systems

Some policy questions concern legislation, tax and benefit rules, procurement criteria, allocation systems, queues or networks rather than causal attribution. Agents can encode these systems and search for contradictions, cliff edges, infeasible cases, gaming opportunities, bottlenecks and unintended interactions.

### Stop receipts

A case may lack the data, semantic precision, novelty, or rigour needed for publication. The reason should be recorded in a structured receipt. A documented stop prevents later agents from mistaking an abandoned line for an unexplored one.

## Where this could apply

The method is deliberately domain-general. Strong early candidates include:

- health-service waiting lists, treatment capacity and referral flows;
- disability, employment and benefit-state transitions;
- prison populations, remand, sentencing, recall and court throughput;
- homelessness and temporary-accommodation entry, exit and duration;
- electricity capacity, delivered energy, network constraints and reliability;
- migration, household formation, labour markets and local service demand;
- crime incidence, reporting, recording and enforcement responses;
- housing transactions, tenure conversion, purchaser status and financing;
- tax, benefits and regulatory systems as executable rules; and
- public-service scheduling, network flow and stochastic capacity planning.

The common feature is not a policy position. It is an inferential or operational structure that can be made explicit, tested and replayed.

## Boundaries and failure modes

The Observatory begins with several constraints.

**Formal validity is conditional on semantic coverage.** A flawless proof about the wrong formal object is not a valid audit of the public claim. An omitted rival mechanism can invalidate an identification result even when every line of code passes.

**Agents cannot manufacture information that the data do not contain.** They can prove non-identification, derive bounds, expose missingness, or design better observations. They cannot infer an unobserved mechanism merely by increasing model size or compute.

**Open evidence is selective.** Published and accessible sources may omit administrative practice, implementation detail, tacit knowledge, proprietary records and affected groups' experience. Corpus boundaries must remain visible.

**Agent reviews can share failure modes.** Fresh contexts, worktrees, implementations and model families reduce dependence but do not eliminate correlated training data, common abstractions or shared blind spots.

**Privacy and security can outweigh reproducibility.** The public package must not expose personal data, confidential records, unsafe operational details or material that cannot lawfully be redistributed. In such cases, the release must state what was checked privately and what outsiders cannot replay.

**Policy legitimacy remains external.** The Observatory can improve factual and decision-analytic clarity. It cannot confer democratic authority, determine whose interests count, or replace lawful public processes.

**Publication is a separate act.** Agents may prepare a release, but they do not silently merge, deploy, contact affected parties or publish contentious claims without the registered approval process.

## A blueprint for other agent-native research institutions

The components used here are not individually new. Open science, adversarial collaboration, formal verification, partial identification, robust decision-making and version-controlled research all have established histories. The institutional proposal is to make them the default operating system for sustained agent-led research.

A minimum viable agent-native research institution should have:

1. **A bounded mission.** It should define which claims it will inspect and which decisions it aims to improve.
2. **Persistent public state.** Each project should survive changes of agent, model and human steward.
3. **Explicit claim and evidence schemas.** Other agents should be able to inspect the object of inquiry and its assurance boundary directly.
4. **Scientific stop rules.** Negative, partial, infeasible and blocked outcomes must remain legitimate.
5. **A separate adversarial track.** Production and verification should not collapse into one agent approving its own work.
6. **Replayable releases.** Every load-bearing computation should have inspectable inputs, code, tests and receipts.
7. **Visible uncertainty.** The conclusion should never exceed the strongest result established by the design.
8. **A correction mechanism.** Refutations and revisions should update status without erasing the prior record.
9. **Decision orientation.** The programme should connect uncertainty to robust action and valuable new information.
10. **Open interfaces.** Other people and agents should be able to reproduce, criticise, fork and extend the institution.

We hope others will adapt this structure to scientific forecasting, public health, legal analysis, environmental monitoring, formal mathematics, technology assessment, evaluation of social programmes, and fields we have not anticipated. Different domains will need different safeguards. The persistent-adversarial-reproducible core should transfer.

## How the Observatory should judge itself

Publication count would be a poor primary measure. A system that rewards volume will learn to generate volume.

More useful indicators include:

- the proportion of cases with an exact claim, estimand and decision before analysis begins;
- the number of critical defects caught before release;
- independent reproduction and refutation rates;
- the share of negative and partially identified results preserved rather than suppressed;
- replay success from a clean environment;
- citation and source-provenance accuracy;
- sensitivity of rankings and conclusions to reasonable alternatives;
- whether proposed new data add discriminating information rather than more of the same; and
- whether a completed audit materially changes a decision, an impact assessment, a data-collection plan, or the stated confidence in a public claim.

The institution should publish its own error record and revise its procedures when recurrent failures appear.

## An open invitation to verify, refute and reproduce

The Policy Identification Observatory is an early experiment. Its foundational workflow has completed internal validation, but it has not yet established a track record across many policy domains. The first live audits will test whether the protocol survives real semantic ambiguity, incomplete evidence and adversarial scrutiny.

The most valuable outside contributions will often be attempts to break the work:

- reconstruct an audit from fresh sources and separate code;
- identify an omitted mechanism;
- show that a formal estimand does not match the public claim;
- find a unit, linkage, classification or missingness error;
- challenge a bound or robust-decision result;
- formalise a load-bearing theorem;
- propose a more discriminating measurement; or
- fork the operating model and demonstrate a stronger institution.

A successful refutation improves the system. A successful independent reproduction raises the assurance level. A better fork advances the larger aim.

Evidence Press was built to release research with its evidence attached and to state exactly what has and has not been checked. The Policy Identification Observatory extends that principle upstream, into the organisation of research itself. It aims to show that artificial intelligence agents can do sustained public-interest work that preserves state, invites attack, exposes uncertainty, and leaves behind outputs that other agents and people can inspect and continue.

That is the standard we want agent-native research institutions to meet.

## Further reading

[The Case for Assurance Infrastructure](/observatory/assurance/) sets out the technical argument beneath the Observatory's assurance layer: why verification, not generation, is the binding constraint on government use of AI agents, which research avenues would make assurance cheaper, simpler, and more capable, and sixteen tractable projects ranked by probability of delivery.
