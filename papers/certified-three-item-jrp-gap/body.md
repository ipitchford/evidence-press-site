## Summary

**The problem.** Many businesses restock several products together because they share a fixed cost: one supplier order, one inbound truck, one receiving slot or one machine setup. Deciding how often to restock each product, so that the shared events and the holding costs together are as cheap as possible, is the *joint replenishment problem*. Planners and software often use a shortcut: they price the shared event as if it happened only as often as the fastest-moving product needs it. That shortcut is a *relaxation*: it gives a lower bound on cost that is easy to compute, but it can be too optimistic.

**What was asked.** An earlier, unrefereed Evidence Press release studied two products and reported that the shortcut is never more than about 11% optimistic (an interval with upper endpoint near 1.111889). The natural next question was whether that number survives when a third product can line up with either of the other two.

**What was found.** It does not. For one fully specified three-product instance, the shortcut reports a normalised cost of about 4.033, while the true best periodic plan costs about 4.632. Their ratio is

$$
1.1487291464748205845\ldots.
$$

So the shortcut is 14.8729% optimistic relative to its own value on this synthetic instance, and the new three-item lower bound is 3.3132% above the two-item upper endpoint. A monotonicity lemma carries the bound to every fixed number of products of at least three. The two-item interval therefore cannot supply the answer for many products, subject to this candidate's proof and replay boundary.

**What this is not.** The gap is a statement about a model, not a saving. No company result, service improvement or avoided loss has been measured.

> **Status:** anonymous, unrefereed successor candidate. Producer-side exact replay passes. No unaffiliated rerun, independently authored implementation, proof-assistant formalisation, specialist review, editorial peer review, operational validation, or field impact is claimed.

## Summary for specialists

The setting is common-origin fixed-interval policies in the continuous-time three-item joint replenishment problem (JRP) under rational item-specific frequency caps. The exact objective combines a common replenishment-event cost, item-specific ordering costs and deterministic holding costs. The standard relaxation replaces the true density of the union of order epochs by the largest individual frequency.

For the bundled rational instance the package certifies

$$
L=\frac{12099233027737989052666993}{3000320647128487500000000},\qquad
C^*=\frac{50387704513257323196307343}{10877191205396850000000000},
$$

with the optimum at primitive multipliers `(3, 3, 2)` and scale `92726/168045`, so that

$$
\Gamma_{3,\square}\ \ge\ \frac{C^*}{L}=\frac{7732648297718008589674913778809}{6731480890380196637385597557508}=1.1487291464748205845\ldots .
$$

| Result | Status |
|---|---|
| Candidate exact three-item independent-cap oracle: exact three-regime decomposition, finite primitive-triple closure, global pair and triple tail certificates, and a totality proposition | prose proof + producer-side exact replay |
| Headline gap witness above, 3.3132% above the unrefereed two-item upper endpoint | certified (producer side) |
| Fixed-item monotonicity: the lower bound holds for every fixed item count $n\ge 3$ | prose proof |
| Relaxation-analysis barrier: no universal inequality comparing exact cost directly with the max-frequency relaxation can use a factor below the certified ratio | consequence of the witness |
| Simple audit witness with exact ratio `9586/8355` at `(3, 2, 2)` | certified (producer side) |
| Two certified inner holding-cost boxes from sixteen exact vertex certificates | certified (producer side) |
| Broader resource-constrained (arbitrary coupled-resource) interpretation | conditional on the unrefereed parent cap-reduction result |
| Exact three-item cap constant; exact unrestricted multi-item gap | open |

## Technical account

**Three ways to coordinate.** Three items can coordinate in only three structural ways: all periods are commensurable, exactly one pair is commensurable, or all pairs are incommensurable. The oracle solves the boundary regimes exactly, enumerates a finite set of primitive fully coordinated calendars, and proves that every omitted calendar is more expensive than the incumbent.

**The certificate for the headline witness.** For the strongest rational witness, the optimum uses period multipliers `(3, 3, 2)` and scale `92726/168045`. The certificate enumerates 49,981 primitive triples. The smallest closing cutoff is 21. Exact integer and rational comparisons, not floating-point optimisation, establish the winner and the strict tail margin.

**Where the witness came from.** The witness comes from an exact five-policy equalisation family. Four neighbouring calendars tie on an explicit rational surface; the selected rational point lies strictly on the `(3, 3, 2)` side. A stationary calculation inside that family guided the selection but is not presented as the exact three-item constant.

**What the relaxation can and cannot prove.** The lower bound also limits what can be proved using this relaxation alone: no universal inequality comparing exact cost directly with the max-frequency relaxation can use a factor below the certified ratio. Better algorithms may still use stronger lower bounds or different analyses.

A simpler witness gives the exact ratio `9586/8355` at `(3, 2, 2)`. It is retained as a transparent audit case.

### Why the exact policy differs

The relaxed solution uses frequencies

$$
\left(\frac{56015}{92726},\ \frac{153463}{200000},\ 1\right).
$$

The exact coordinated solution uses

$$
\left(\frac{56015}{92726},\ \frac{56015}{92726},\ \frac{168045}{185452}\right).
$$

The exact policy slows the second and third streams so that their events can realize a better joint calendar. Four neighbouring calendars are extremely close in cost. Sixteen additional exact certificates prove two conservative inner boxes under simultaneous relative holding-cost perturbation only: the headline witness has a relative radius of about `9.64e-11`, while the slightly weaker v0.2 witness has a radius of about `1.22e-6`. The five near-tied calendars are frozen as synthetic regression fixtures. A fitted logistics instance must regenerate and verifier-check its own candidate set; the radius contrast is a warning against blind execution of one nominal winner.

## Evidence, assurance and limitations

- **Producer-side checker.** The same-producer solver-independent checker recomputes the relaxation, boundary values, primitive-triple set, fixed-pattern costs, tail inequalities, and gap. Version 0.3.1 also rebuilds the active-envelope analysis, complete regression portfolio documents, sixteen robustness vertices, and two holding-box certificates. It rejects inconsistent redundant exact values, floating-point instance literals, incomplete pair partitions, false proof-bound flags, inconsistent tail or boundary data, resource-intensive expression forms, package-escape paths, and structural mutations.
- **Not independent.** The checker was nevertheless written in the same workflow and shares parsing and exact-algebra utilities. Its success is producer-side consistency evidence, not independent reproduction. The general finite-generator and tail proof also remain prose mathematics supported by exact tests rather than a proof assistant.
- **Conditional scope.** The arbitrary-resource interpretation remains conditional on the unrefereed parent cap-reduction result. The two-item comparison point is itself a producer-side, unrefereed result.
- **Model, not operations.** The 14.8729% difference is lower-bound optimism on a synthetic, normalised instance, not a measured saving, forecast or service improvement.
- **What the package does not establish.** The exact three-item constant, the unrestricted multi-item constant, independent reproduction, formal verification, external specialist or editorial peer review, operational savings, service improvement, adoption, or causal field impact.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Inventory and logistics planners | A triplet stress test for three SKUs that genuinely share an ordering, inbound-transport, receiving or changeover event: is the max-frequency lower bound materially optimistic, and does exact coordination change the accepted deterministic periodic plan? | The oracle is not a dispatch engine; a fitted instance must regenerate and verifier-check its own candidate set |
| ERP, APS, optimisation and replenishment software teams | Exact regression fixtures: a system claiming a lower cost under the identical model has either changed the semantics or failed the benchmark | The five bundled policies per witness are synthetic fixtures and must not be transferred |
| Operations-research theorists | A certified lower bound on the multi-item relaxation gap and a barrier for rounding analyses measured only against the max-frequency relaxation | Candidate result; the exact constants remain open |

### A logistics use that respects the evidence

The oracle can serve as a triplet stress test for three SKUs that genuinely share a fixed event. It can answer three useful questions:

1. Is the max-frequency lower bound materially optimistic for this calibrated triplet?
2. Does exact coordination change the accepted deterministic periodic plan?
3. Which instance-specific, verifier-checked near-optimal calendars should be passed to a richer simulation?

It can also serve as an exact regression fixture for ERP, APS, optimisation, and replenishment software. A system claiming a lower cost under the identical model has either changed the semantics or failed the benchmark.

The oracle is not a complete logistics controller. Minimum order quantities, pack sizes, container fill, nonlinear transport tariffs, stochastic demand, non-zero lead time, service levels, shelf life, supplier calendars, and pointwise dock capacity need an additional operational model. Case and algorithmic research shows why these layers matter; none of it validates this candidate's field performance.

### Evaluation gates

The release supplies a staged protocol (`LOGISTICS_DEPLOYMENT_PROTOCOL.md`):

1. validate that the three products share a meaningful incremental event;
2. reconcile order, receipt, inventory, service, expedite, and cost data;
3. run the exact stress test on every eligible triplet, retaining null findings;
4. add uncertainty and omitted constraints in simulation or a digital twin;
5. run a shadow schedule and review exceptions with planners;
6. pilot only under a preregistered concurrent comparison with service stop rules;
7. scale only if service remains acceptable and total net value is positive.

Outcomes include total landed cost, inventory, fill rate, stockouts, expedites, transport utilization, dock peaks, overtime, planner effort, and implementation cost. Before/after company observations without a defensible counterfactual remain associations, not causal effects.

## Why the problem matters

Joint replenishment couples otherwise familiar inventory cycles through a common setup or ordering event, and the max-frequency relaxation is the standard convex relaxation of that coupling. The third stream creates a qualitatively new coordination geometry: it can align with either of two others. The exact policy deliberately slows one capped stream until it aligns with another, and the relaxation prices the shared event too optimistically because it does not account for the arithmetic structure needed to realize those frequencies simultaneously. The witness is therefore a barrier to universal rounding analyses measured only against this relaxation, for every fixed item count of at least three.

## How to inspect or reproduce the recorded checks

Python 3.10+ and SymPy 1.14.0 are required. From the GitHub release or the Zenodo archive:

```bash
python3 -m pip install -e .
./scripts/reproduce.sh
PYTHONOPTIMIZE=2 ./scripts/reproduce.sh   # optimized replay
```

The script rebuilds all three point certificates, the sixteen robustness-vertex certificates, two holding-box reports, active-family analysis, and exhaustive policy portfolios; verifies them with the same-producer solver-independent checker; and runs the 21-test deterministic suite. Start reading with the integrated paper and `docs/three_item_oracle_note.md` for the derivation; `CLAIMS.json` and `ASSURANCE.md` record each claim's evidence boundary.

## The most valuable next projects

1. Determine the exact three-item cap constant, and a universal three-item upper certificate.
2. Determine the exact unrestricted multi-item gap.
3. Extend the executable oracle to direct arbitrary coupled-resource input.
4. Obtain an unaffiliated rerun, an independent reimplementation, a formalisation and specialist review.
5. Measure a representative distribution of gaps in real logistics triplets.
6. Gather preregistered evidence on whether exact certification changes plans or creates net operational value.

## What is in the evidence package

- `paper/three_item_jrp_gap_and_logistics.md`: the integrated research paper (the Markdown source is the accessible text route; the PDF is not tagged for accessibility).
- `docs/three_item_oracle_note.md`: detailed mathematical derivation.
- `src/jrp3/oracle.py` and `src/jrp3/verify.py`: the certificate-producing oracle and the solver-independent checker.
- `analysis/`: exact equalisation formulas, the bounded stationary guide, and regression portfolios for both strong witnesses.
- `certificates/`: exact witness, vertex, holding-box and verification JSON.
- `CLAIMS.json`, `ASSURANCE.md`, `SOURCES.md`, `INTAKE_AUDIT.md`, `LOGISTICS_DEPLOYMENT_PROTOCOL.md` and `reviews/`: claim boundaries, assurance matrix, source audit, deployment protocol and frozen review records.

### Release boundary

This is an additive successor and does not alter the immutable two-item release. The immutable [GitHub prerelease](https://github.com/ipitchford/certified-three-item-jrp-gap/releases/tag/v0.3.1-candidate) and published [Zenodo version DOI 10.5281/zenodo.22057665](https://doi.org/10.5281/zenodo.22057665) expose six byte-identical assets under unauthenticated public readback. The canonical Evidence Press HTML, machine record, media, graph and protocol surfaces also passed exact post-deploy readback after bounded cache convergence. These checks establish identity and availability, not mathematical correctness, independent assurance, operational validation, savings, or field impact. Corrections and objections are routed through the public [repository issue tracker](https://github.com/ipitchford/certified-three-item-jrp-gap/issues) and preserved as additive successors.
