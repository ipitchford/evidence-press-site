## What this is

Evidence Press publishes what research has discovered, with the evidence attached. Productivity Protocols publishes something adjacent: bounded methods for using AI agents, plus the records needed to find out whether those methods are usable and worthwhile in a named setting.

The contribution is not a new workflow language. It is an open adoption-and-evidence path for companies with little agent experience: one routine workflow, a governance screen, a no-install formative work contract, a stage-appropriate evaluation, and a recorded decision to continue one stage, revise, or stop. The later feasibility machinery needs a facilitator comfortable with Node and structured files, but no agent integration.

## Closest current links to operational productivity

Two logistics releases are the catalogue's nearest bridge from exact research to operational productivity. They produce inspectable decision objects for planning problems, but neither has yet been tested in an operating supply chain or shown to save time, labour, or money.

> ### [Certified commitment horizons](/releases/certified-commitment-horizons/)
>
> ![Video thumbnail: How far can a plan safely hold?](/assets/video-thumbs/certified-commitment-horizons.jpg "Video briefing — certified commitment horizons")
>
> This candidate asks how much a demand forecast can change before the near-term part of a dynamic lot-sizing plan must change. Its exact-rational certificates can identify a defensible window in which a committed prefix remains stable, potentially avoiding unnecessary replanning. The result is model-specific; its UCI example uses reconstructed forecast vintages and stylised costs, not field outcomes.
>
> [**Watch the video briefing →**](https://youtu.be/G4ehJ81pl6g)

> ### [Exact two-item joint replenishment](/releases/certified-two-item-jrp/)
>
> ![Video thumbnail: Two items. One exact gap.](/assets/video-thumbs/certified-two-item-jrp.jpg "Video briefing — exact two-item joint replenishment")
>
> This candidate turns a two-item replenishment problem with shared ordering costs and resource constraints into finitely checkable exact objects. It also certifies the sharp worst-case gap for a standard two-item independent-frequency-cap relaxation, helping quantify the price of a simpler policy. The unrestricted multi-item problem remains open, and no operational saving or implementation benefit has been demonstrated.
>
> [**Watch the video briefing →**](https://youtu.be/n9SbpLgjOY4)

These are **decision-relevant operations results, not productivity impact evidence**. The next evidential step is prospective comparison using genuine forecasts and costs, recording whether the certificates change accepted plans and whether avoided loss or bounded regret exceeds the full human, compute, implementation, and assurance cost.

## What the existing tests actually show

Three version 0.1.0 predecessor protocols have **model-output benchmarks**. They compare an agent with and without the protocol on small registered task sets. All three record `NO_CLEAR_GAIN`; the heavier methods often cost more tokens or model time without improving judged output. The changed 0.1.1 packs do not inherit those badges and remain unmeasured until retested.

No person completed a work item in those benchmarks. Human effort, time to accepted work, rework, cognitive burden, support labour, tool cost in company use, adoption, and organisational outcomes were not measured. On human or company productivity, the honest result is **no evidence in either direction**.

## Start with the evidence stage

| Stage | Starting condition | What it may answer | It must not justify |
|---|---|---|---|
| **Formative usability** | 1–5 consenting participants | Can people understand, operate, review, and safely stop the method? | A productivity effect or adoption based on one |
| **Feasibility** | At least six participants and a frozen task bank | Can allocation, measurement, support, cost capture, and retention work? | A powered benefit claim; effects remain exploratory |
| **Controlled evaluation** | A justified sample and independently reviewed design | Is there a context-bound incremental signal versus the same agent without the protocol? | Transfer to other companies, tasks, models, or risks |
| **Organisational follow-up** | Governed ordinary use after a separate deployment decision | Do use, burden, costs, errors, and outcomes persist here? | Causal attribution unless the identification design supports it |

Protocol exposure teaches a structure that people may not be able to unlearn. The included three-period crossover is therefore a **feasibility rehearsal only**. A future controlled evaluation should use randomized parallel agent-only and protocol-guided groups, with manual work as a secondary operational baseline.

## A protocol is a work contract, not a prompt

A prompt is a suggestion. A protocol states the whole contract: the task and evidence boundary, what the agent may read or change, where a person must approve, how outputs are checked, what counts as failure, and when to stop. It ships as an open [Agent Skill](https://agentskills.io/specification) that can be inspected without installation.

## Two independent measures, never merged

- **Protocol assurance** asks whether the pack is well formed and whether its declared checks pass. It does not establish human benefit or safe use in every setting.
- **Work evidence** asks what was measured: agent-output benchmark, controlled-user signal, organisational field association, or an identified effect. Setting and identification are recorded separately.

![The two status ladders — protocol assurance and work evidence — shown side by side and never merged](/assets/art/protocols-ladders.svg "Two independent measures, kept apart. Engineering checks cannot borrow the credibility of human-impact evidence, and an observed benefit cannot excuse a poorly bounded protocol.")

## Use the company route

The starter kit provides the suitability screen, worker information, frozen plan, task bank, allocation, observation and follow-up records, quality rubric, incident card, semantic validator, and synthetic mutation controls. It keeps missing work items and negative findings instead of deleting them.

[**Open the staged company starter →**](/protocols/start/)

## Inspect the protocol library

The registry retains eight candidate methods. Each page exposes the contract, version, permissions, tests, historical evaluation record, machine-readable representation, and deterministic archive. `Document to action plan` is the recommended low-risk usability entry point; it is not a proven productivity intervention.

[**Browse all eight protocols →**](/protocols/)

The prose is dedicated to the public domain and reusable code is openly licensed. Build and hash checks establish inspectability and replay within their declared boundary; they do not establish independent review, field readiness, or company impact.
