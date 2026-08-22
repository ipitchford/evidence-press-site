## Summary

Suppose a warehouse replenishes two items on fixed repeating schedules. Ordering either item has its own cost, but every occasion on which the warehouse places an order also carries a shared cost: administration, dispatch, receiving, a production changeover, or another setup that is paid once no matter whether one item or both are included.

The schedules can therefore save money by meeting. If item 1 is ordered every 6 days and item 2 every 10 days, then over 30 days the first schedule has five order times and the second has three. One time is shared, so there are seven distinct order occasions rather than eight. The shared cost is paid seven times.

That simple example contains the mathematical difficulty. Whether two periodic schedules meet is controlled by the arithmetic of their periods. A tiny change from 10 days to an incommensurable period can remove all exact coincidences after time zero. The cost is therefore not a smooth function of the period ratio, even though the holding and item-specific ordering costs are smooth.

The problem studied here also allows average-rate resource restrictions. A row such as

$$
\frac{\alpha_1}{T_1}+\frac{\alpha_2}{T_2}\leq\beta
$$

can represent a limit on ordering effort, receiving capacity, or another resource consumed in proportion to order frequency. The model is deterministic and stationary: it asks for the best two repeating periods $T_1,T_2>0$ under any finite collection of such nonnegative restrictions.

## Turning each coordination pattern into a simple calculation

When the period ratio is rational, write

$$
\frac{T_2}{T_1}=\frac pq
$$

in lowest terms and set $T_1=qt$, $T_2=pt$. The integers $p$ and $q$ specify the coordination pattern; the single positive number $t$ sets its scale.

The two order lattices then have union density

$$
\frac{p+q-1}{pqt}.
$$

The subtraction of one is the saving from the common order that occurs once every $pqt$ time units. For the 6-day/10-day example, $p=5$, $q=3$, and $t=2$, giving $7/30$ distinct order occasions per day.

After substituting a fixed pair $(p,q)$, every cost term collapses to

$$
g_{pq}(t)=\frac{A_{pq}}{t}+B_{pq}t,
$$

where $A_{pq}$ collects setup costs and $B_{pq}$ collects holding costs. The resource rows impose only a lower bound $t\geq t_{pq}^{\min}$. Thus the best scale for a chosen coordination pattern is explicit: use the unconstrained balance $\sqrt{A_{pq}/B_{pq}}$ unless the resource floor forces a larger value.

This removes the continuous optimisation difficulty. What remains is an infinite discrete question: how can one know that no unexamined coprime pair $(p,q)$ is better?

## Why the exact search eventually stops

Imagine first that the two schedules never meet. Charging the common setup cost separately to each item gives a smooth **desynchronised benchmark**, denoted $M_R$. It is not the answer to the original problem; it is the cost approached when coordination becomes vanishingly rare.

The resource constraints matter when bounding this benchmark. Ignoring them can make the lower bound much too small. The result instead keeps them through nonnegative Lagrange multipliers, producing a checked value $L(\lambda)\leq M_R$ that reflects the actual feasible region.

Now enumerate all coprime pairs with $p+q\leq S$. Every omitted rational pattern—and every irrational ratio—has cost at least

$$
\sqrt{\frac{S}{S+1}}\,M_R.
$$

The factor on the right increases towards one as $S$ grows. This is the **resource-aware tail**: it raises a floor under everything not yet searched.

The other half of the argument shows that the true optimum is strictly below $M_R$ whenever the shared setup cost $K_0$ is positive. Even if the unique minimiser defining $M_R$ has an irrational ratio, one-sided continued-fraction approximations create rational schedules whose smooth cost disturbance is of order $q^{-2}$ while the new shared-order saving is of order $q^{-1}$. For a sufficiently good approximation, the saving wins.

There is therefore a synchronised candidate of cost $C<M_R$. Eventually

$$
\sqrt{\frac{S}{S+1}}\,M_R>C,
$$

so no omitted ratio can improve on the incumbent. At that point the enumeration stops with an exact certificate of optimality.

This is a termination theorem, not an efficiency theorem. It guarantees a finite stopping point for every instance in the stated two-item model, but the required cutoff may be very large and no polynomial running-time bound is claimed.

## Summary for specialists

The candidate reduces each primitive coordination pattern to a one-variable convex objective, combines a resource-aware desynchronised lower bound with a strict rational-synchronisation improvement, and obtains a finite exact stopping certificate. Its second theorem gives the exact independent-cap relaxation gap as the isolated quartic root reported below, with a matching lower family and a four-policy coefficientwise upper envelope.

## What the relaxation is relaxing

Approximation algorithms often start from a convex problem that is easier than the true scheduling problem. Write $f_i=1/T_i$ for order frequency. The true objective includes the density of the union of the two order lattices:

$$
K_0\,\operatorname{dens}(T_1,T_2)
+\sum_{i=1}^2\left(K_if_i+\frac{H_i}{f_i}\right).
$$

The standard relaxation replaces the union density by

$$
\max\{f_1,f_2\}.
$$

This imagines the best possible alignment: every order of the slower item is treated as though it could be nested inside the faster schedule. That is sometimes attainable, but the arithmetic of the two periods can prevent it. The relaxed optimum is consequently an optimistic lower bound on the true optimum.

The ratio

$$
\frac{\text{true optimum}}{\text{relaxed optimum}}
$$

measures the price of the alignment information discarded by the relaxation. A ratio of one means that the optimistic schedule can really be achieved. A ratio of $1.1$ means that the true periodic problem may cost ten per cent more than the lower bound suggests.

## The exact two-item cap gap

For two items with independent frequency limits $f_i\leq\bar f_i$ and nonnegative real cost coefficients, the worst possible ratio is exactly

$$
\Gamma_{2,\mathrm{box}}=\gamma,
\qquad
1.111889593939396<\gamma<1.111889593940297,
$$

where $\gamma$ is the root in this interval of

$$
262\gamma^4-916\gamma^3+863\gamma^2+150\gamma-375=0.
$$

In plain terms, the standard relaxation can understate the optimal two-item cost by at most about **11.19 per cent**, and there are admissible real-coefficient instances that attain that limit.

The lower-bound example occurs near a normalised cap ratio

$$
x\approx0.7509471056068.
$$

At the sharp instance, three different coordination patterns—labelled $(1,1)$, $(1,2)$, and $(2,3)$—tie for the true optimum. The relaxation lies below all three by the factor $\gamma$. The meeting of three alternatives is what creates the extremal obstruction.

## Why four policies are enough for the upper bound

The matching upper proof begins by normalising any two-cap instance so that the relaxed optimum lies at frequencies $(x,1)$ with $0<x<1$. After this change of units, every instance is described by five nonnegative cost coordinates.

For each $x$, consider four feasible periodic choices:

- the nested ratio immediately to one side of $x$;
- the nested ratio immediately to the other side;
- their Farey mediant, which supplies an intermediate coordination pattern; and
- the policy that uses the two cap periods directly.

The proof constructs nonnegative weights for these policies whose weighted average cost is at most $\gamma$ times the relaxed cost in each of the five coordinates. Since the cheapest of four policies cannot cost more than their weighted average, at least one is always within the factor $\gamma$.

Near the worst point, on

$$
\frac{149}{200}\leq x\leq\frac{151}{200},
$$

the weights and all remaining slacks are controlled by exact symbolic identities. Outside that narrow interval, 212 rational cells cover every possible value of $x$ and verify the same coefficientwise inequality. The symbolic critical interval and the finite outer cover meet without leaving a numerical gap.

This explains the role of the computational work: it does not search experimentally for a large ratio. It checks a finite partition supporting a universal upper bound, while the extremal family supplies the matching lower bound.

## What the result means—and where it stops

The first theorem gives an exact benchmark method for stylised two-item planning problems with stationary costs and average-rate constraints. It can be used to test heuristics or to generate exact small-instance reference answers. The second theorem quantifies exactly how much information the standard independent-cap relaxation can lose in that same two-item setting.

The equality uses nonnegative **real** coefficients and permits zero item-specific setup costs. It does not assert the same attained value for a rational-data-only class or under a convention requiring every $K_i$ to be strictly positive.

Nor does the constant settle the unrestricted problem with three or more items. The cap-reduction argument makes $\gamma$ a rigorous lower bound for the wider multi-item relaxation gap, but it does not prove that two items are globally worst. Multi-item alignment, phases, fixed delivery calendars, pointwise capacity, uncertain demand, safety stock, lead times, routing, and multi-echelon effects remain outside the theorem.

The result is an unrefereed candidate computer-assisted result. Its exact arithmetic checks and fresh-extraction replay were performed within the producing workflow; independent mathematical reconstruction, formal proof-assistant verification, specialist review, peer review, and field validation have not yet occurred.

## Evidence and assurance boundary

The package records exact rational and radical witnesses, resource-dual and tail certificates, quartic isolation, the complete 212-cell upper certificate, semantic mutations, deterministic document builds and fresh-extraction producer replay. These checks are strong evidence for finite arithmetic, package identity and implementation consistency. They do not independently establish the analytic bridge, theorem completeness, operational relevance or novelty.

## Who should care, and why

| Reader | Start here | Principal caution |
|---|---|---|
| Inventory and scheduling researcher | The exact search and cap-gap sections | The model has two stationary items and average-rate constraints. |
| Approximation-algorithm researcher | “What the relaxation is relaxing” | The constant is not an unrestricted multi-item theorem. |
| Computational reviewer | The evidence package and manifest | Fresh extraction remains producer-side replay. |
| Practitioner | Everyday summary and practitioner brief | The result is a benchmark, not measured operational savings. |

## How to inspect and reproduce the recorded checks

Start from the [v1.2.0 candidate release](https://github.com/ipitchford/certified-two-item-jrp/releases/tag/v1.2.0-candidate) or the [DOI archive](https://doi.org/10.5281/zenodo.21855894). Verify the archive hashes before running the fail-closed command documented in the repository. Compare the reported witness, cell counts and mutation outcomes with the frozen receipt rather than treating a successful process exit alone as sufficient evidence.

## The most valuable next projects

The central mathematical question is whether the unrestricted multi-item gap equals the two-item constant. A complete independently implemented three-item oracle, an alignment-aware relaxation and calendar-phase or pointwise-capacity extensions would test that boundary. Any operational pilot should separately validate units, shared-event ownership, service constraints and field outcomes.

## What is in the public package

The archive contains two candidate theorem papers, a practitioner brief, source, the exact solver, four finite witnesses, tail and dual certificates, complete cap-gap certificates, tests, figures, manifests and producer review and replay records. Its historical scholarly creator and citation identity are preserved because they are part of the immutable DOI record; the current page does not silently rewrite that chain.
