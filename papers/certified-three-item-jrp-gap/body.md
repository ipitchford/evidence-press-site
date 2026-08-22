## Plain-English summary

When three products share a supplier order, inbound shipment, receiving slot, or setup event, a common shortcut prices that shared event using only the fastest replenishment stream. This candidate gives an exact warning about that shortcut.

For one fully specified rational three-item instance, the relaxed model reports an exact normalized value of approximately 4.033. The true periodic optimum is approximately 4.632. Their ratio is

$$
1.1487291464748205845\ldots.
$$

That is a model gap, not a saving. It says the relaxation is 14.8729% optimistic relative to its own denominator on this synthetic instance. No company result, service improvement, or avoided loss has been measured.

The mathematical significance is sharper. The unrefereed producer-side Evidence Press predecessor reported a narrow two-item interval with upper endpoint near 1.111889. The new candidate three-item lower bound is 3.3132% above that endpoint. A monotonicity lemma propagates it to every fixed item count of at least three. The two-item interval therefore cannot supply the unrestricted multi-item answer, subject to this candidate’s proof and replay boundary.

> **Status:** anonymous, unrefereed successor candidate. Producer-side exact replay passes. No unaffiliated rerun, independently authored implementation, proof-assistant formalisation, specialist review, editorial peer review, operational validation, or field impact is claimed.

## What the certificate proves

The exact continuous-time objective combines a common replenishment-event cost, item-specific ordering costs, and deterministic holding costs. The standard relaxation replaces the true density of the union of order epochs by the largest individual frequency.

Three items can coordinate in only three structural ways: all periods are commensurable, exactly one pair is commensurable, or all pairs are incommensurable. The oracle solves the boundary regimes exactly, enumerates a finite set of primitive fully coordinated calendars, and proves that every omitted calendar is more expensive than the incumbent.

For the strongest rational witness, the optimum uses period multipliers `(3, 3, 2)` and scale `92726/168045`. The certificate enumerates 49,981 primitive triples. The smallest closing cutoff is 21. Exact integer and rational comparisons—not floating-point optimisation—establish the winner and the strict tail margin.

The witness comes from an exact five-policy equalisation family. Four neighbouring calendars tie on an explicit rational surface; the selected rational point lies strictly on the `(3, 3, 2)` side. A stationary calculation inside that family guided the selection but is not presented as the exact three-item constant.

The lower bound also limits what can be proved using this relaxation alone: no universal inequality comparing exact cost directly with the max-frequency relaxation can use a factor below the certified ratio. Better algorithms may still use stronger lower bounds or different analyses.

A simpler witness gives the exact ratio `9586/8355` at `(3, 2, 2)`. It is retained as a transparent audit case.

## Why the exact policy differs

The relaxed solution uses frequencies

$$
\left(\frac{56015}{92726},\ \frac{153463}{200000},\ 1\right).
$$

The exact coordinated solution uses

$$
\left(\frac{56015}{92726},\ \frac{56015}{92726},\ \frac{168045}{185452}\right).
$$

The exact policy slows the second and third streams so that their events can realize a better joint calendar. Four neighbouring calendars are extremely close in cost. Sixteen additional exact certificates prove two conservative inner boxes under simultaneous relative holding-cost perturbation only: the headline witness has a relative radius of about `9.64e-11`, while the slightly weaker v0.2 witness has a radius of about `1.22e-6`. The five near-tied calendars are frozen as synthetic regression fixtures. A fitted logistics instance must regenerate and verifier-check its own candidate set; the radius contrast is a warning against blind execution of one nominal winner.

## A logistics use that respects the evidence

The oracle can serve as a triplet stress test for three SKUs that genuinely share a fixed event. It can answer three useful questions:

1. Is the max-frequency lower bound materially optimistic for this calibrated triplet?
2. Does exact coordination change the accepted deterministic periodic plan?
3. Which instance-specific, verifier-checked near-optimal calendars should be passed to a richer simulation?

It can also serve as an exact regression fixture for ERP, APS, optimisation, and replenishment software. A system claiming a lower cost under the identical model has either changed the semantics or failed the benchmark.

The oracle is not a complete logistics controller. Minimum order quantities, pack sizes, container fill, nonlinear transport tariffs, stochastic demand, non-zero lead time, service levels, shelf life, supplier calendars, and pointwise dock capacity need an additional operational model. Case and algorithmic research shows why these layers matter; none of it validates this candidate’s field performance.

## Evaluation gates

The release supplies a staged protocol:

1. validate that the three products share a meaningful incremental event;
2. reconcile order, receipt, inventory, service, expedite, and cost data;
3. run the exact stress test on every eligible triplet, retaining null findings;
4. add uncertainty and omitted constraints in simulation or a digital twin;
5. run a shadow schedule and review exceptions with planners;
6. pilot only under a preregistered concurrent comparison with service stop rules;
7. scale only if service remains acceptable and total net value is positive.

Outcomes include total landed cost, inventory, fill rate, stockouts, expedites, transport utilization, dock peaks, overtime, planner effort, and implementation cost. Before/after company observations without a defensible counterfactual remain associations, not causal effects.

## Assurance boundary

The same-producer solver-independent checker recomputes the relaxation, boundary values, primitive-triple set, fixed-pattern costs, tail inequalities, and gap. Version 0.3.1 also rebuilds the active-envelope analysis, complete regression portfolio documents, sixteen robustness vertices, and two holding-box certificates. It rejects inconsistent redundant exact values, floating-point instance literals, incomplete pair partitions, false proof-bound flags, inconsistent tail or boundary data, resource-intensive expression forms, package-escape paths, and structural mutations.

The checker was nevertheless written in the same workflow and shares parsing and exact-algebra utilities. Its success is producer-side consistency evidence, not independent reproduction. The general finite-generator and tail proof also remain prose mathematics supported by exact tests rather than a proof assistant.

## What remains open

- the exact three-item cap constant;
- the exact unrestricted multi-item gap;
- a universal three-item upper certificate;
- direct arbitrary coupled-resource input in the executable oracle;
- unaffiliated rerun, reimplementation, formalisation, and specialist review;
- a representative distribution of gaps in real logistics triplets;
- preregistered evidence that exact certification changes plans or creates net operational value.

## Release boundary

This is an additive successor and does not alter the immutable two-item release. The immutable [GitHub prerelease](https://github.com/ipitchford/certified-three-item-jrp-gap/releases/tag/v0.3.1-candidate) and published [Zenodo version DOI 10.5281/zenodo.22057665](https://doi.org/10.5281/zenodo.22057665) expose six byte-identical assets under unauthenticated public readback. The canonical Evidence Press HTML, machine record, media, graph and protocol surfaces also passed exact post-deploy readback after bounded cache convergence. These checks establish identity and availability, not mathematical correctness, independent assurance, operational validation, savings, or field impact.
