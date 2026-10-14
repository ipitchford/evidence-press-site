## Summary

Knowing what every bank owes in total is not the same as knowing who owes whom. After a specified shock, different exposure networks with the same accounting totals can leave outside creditors with different losses. A disclosure is useful here if it narrows that range.

Two reports can be useful together even when neither offers any guaranteed improvement alone. The simplest example does not need a complicated cascade. Let three nonnegative shares add to one. The loss depends on the first share, but the allowed reports reveal only the other two. Either report can be zero while the first share still ranges from zero to one. Both reports together determine it exactly.

This is a statement about **worst-case uncertainty and a specified report menu**. A particular nonzero report can already narrow the range. And if a direct report of the first share is allowed, one report is enough. The paper makes these distinctions explicit in synthetic financial-network models and gives exact certificates for an affine class.

## Summary for specialists

The feasible set consists of nonnegative liability matrices with declared row and column totals, structural zeros and bounds. Under proportional Eisenberg–Noe clearing with positive outside liabilities, a fixed shock defines a continuous scalar outside-creditor loss. For a selected set of affine reports, residual width is the largest loss difference between two feasible networks giving the same reports; bounded errors replace equality by an indistinguishability inequality.

The revision separates two mechanisms. A layered family has product-form loss and high-order complementarity, with explicit magnitude, prior and error dependence. A one-interbank-layer construction instead reduces to a simplex and an affine target, demonstrating that coupled accounting constraints and a restricted menu suffice without nonlinear loss. For a general affine target on that simplex, standard LP duality characterises the residual range, exact identification and no guaranteed gain.

## Technical account

### What the reports identify

For a compact feasible set $\mathcal F$, loss $\ell$ and selected report map $Q_S$, the worst-case residual width is

$$
R(S)=\max\{\ell(L)-\ell(M):L,M\in\mathcal F,\ Q_S(L)=Q_S(M)\}.
$$

The formula asks whether two different losses remain observationally indistinguishable. It is a scalar specialisation of classical diameter-of-information reasoning, not a new principle of information theory. The half-width gives the minimax error of a midpoint estimate on a known fibre.

### A one-layer example: the menu is part of the problem

Take $m+1$ sources and sinks connected by a doubly stochastic exposure matrix. After the designated source is shocked, its allocation row $t=(t_0,\ldots,t_m)$ lies in the full simplex, and the loss is $\ell=b_s+t_0$, with $b_s>0$. Every simplex row extends to a feasible exposure matrix. The permitted unit-cost reports are $t_1,\ldots,t_m$, excluding $t_0$.

Every proper subset has worst-case residual width one: set the reported coordinates to zero, and two feasible allocations still differ by one in $t_0$. The full menu identifies the loss. The unresolved width divided by the shock is $1/(1+b_s)$, approaching one as $b_s$ decreases to zero. If the menu includes $t_0$, that single report identifies the target. This is one interbank layer, not a claim that only one layer of banks can default.

The cover depicts the $m=2$ simplex. Its highlighted edges are the fibres at report value zero, and the shared vertex is the fibre when both reports are zero. These are exact geometric objects in the synthetic example, not observations of a banking system.

### An exact affine certificate

Let $t\ge0$, $\mathbf1^\top t=1$, loss $b+c^\top t$ and report vector $At$. Write $\operatorname{osc}(v)=\max_i v_i-\min_i v_i$. Then

$$
\begin{aligned}
R(A,c)&=\min_\lambda\operatorname{osc}(c-A^\top\lambda)\\
&=2\min_{\lambda,\alpha}\|c-A^\top\lambda-\alpha\mathbf1\|_\infty.
\end{aligned}
$$

The primal certificate is an indistinguishable pair of feasible allocations. The dual certificate bounds the remaining variation after subtracting a linear combination of reports. Their equality follows from finite LP strong duality. In particular:

- Exact identification holds precisely when $c$ is in the span of the constant vector and the report rows.
- There is no guaranteed gain precisely when the convex hulls of report columns at the largest and smallest target coefficients intersect.
- For coordinate reports, the width at a realised observation is the unreported mass times the oscillation of the unreported target coefficients.

With coordinatewise report error bounds $\eta_q\ge0$, the exact extension is

$$
R_\eta(A,c)=\min_\lambda\left[\operatorname{osc}(c-A^\top\lambda)+2\sum_q\eta_q|\lambda_q|\right].
$$

This characterises the width for a chosen affine menu. It does not make cheapest-subset selection over an arbitrary menu polynomial-time, nor make generic cyclic clearing affine.

### Priors and noise change the answer

For the layered family, let $a=(1+\beta)^{1-m}$ and $\kappa_j=\mathbb E|2t_j-1|\in[0,1]$ under independent switch priors. The expected width of a proper subset is $a\prod_{j\in S}\kappa_j$; the full menu has width zero. The expected gain is submodular exactly when, for every distinct $i,j$,

$$
\left(\prod_{k\notin\{i,j\}}\kappa_k\right)(1-\kappa_i-\kappa_j)\ge0.
$$

For $m\ge2$, positive moments reduce this to the pair-sum test; any zero moment makes the criterion hold. Cancelling a possibly zero prefactor would give the wrong boundary. For $m=1$, submodularity is vacuous. The prior weights which report values occur; the width still ranges over the full accounting-feasible fibre, not a posterior credible set.

For heterogeneous errors, put $\delta_j=\min(4\eta_j,2)$ and $D=\max_j\delta_j$. The full-menu layered width is $aF(\delta)/2$, where

$$
F(\delta)=\begin{cases}1-\prod_j(1-\delta_j),&D\le1,\\D,&D\ge1.\end{cases}
$$

The expressions agree at $D=1$. Every proper subset retains worst-case width $a$; if any error bound reaches one half, so does the full menu. The small-error product formula must not be extrapolated beyond its stated regime.

## Evidence, assurance and limitations

The evidence consists of explicit constructions, analytic proofs and finite certificate/checking procedures. A fresh producer-side run retained all 44 entries in the declared synthetic study: 29 completed their width stages, 14 remained unresolved and one was a separate zero-shock case. Completing the declared run does not mean that every width was resolved. Of the 29 completed width stages, 28 certified positive initial width; the other returned a solver-relative zero-width result.

Across 1,878 retained queries, 657 returned rational witnesses that passed exact checking, 1,207 returned solver-only `UNSAT` answers and 14 returned `UNKNOWN`. Checked witnesses establish their encoded feasibility claims and, where applicable, lower bounds. The `UNSAT` answers supply solver-relative upper or negative results, not independently checked unsatisfiability proof objects. `UNKNOWN` supplies neither identification nor infeasibility. These are finite, model-specific outcomes, not estimates of prevalence in real financial networks.

The frozen archive passed all 13 declared internal gate commands in a clean extraction, including normal and optimised Python checks of finite extensions, retained-study witnesses, aggregation, manuscript consistency and manifest integrity, alongside applicable negative controls. This checks the retained evidence; it does not rerun all original solver searches or establish unaffiliated reproduction. The PDF, ZIP and checksum manifest were fully downloaded from both GitHub and Zenodo and matched the frozen local bytes.

These models are synthetic and static, with proportional clearing and declared accounting constraints. They do not validate actual-bank reporting, welfare effects, behavioural responses, fire sales or a regulatory intervention. The allowed menu and cost convention are load-bearing assumptions, not administrative details.

Retained model-assisted checks are producer-side assurance. They do not establish unaffiliated reproduction, formal proof-assistant verification, external specialist endorsement or editorial peer review. A checked finite encoding establishes only its encoded proposition. Unknown solver outcomes must remain unknown; failure to find a witness is not proof of identification or infeasibility.

## Relationship to earlier work

All-or-nothing informational complementarity is classical; the XOR example of Chen and Waggoner is an explicit antecedent. Loss conservation in financial networks underlies the loss–shock bound. The affine formulas specialise standard linear-programming duality. The contribution sought here is the quantitative accounting-fibre classification and its inspectable certificates, not invention of these general principles.

The paper consolidates necessary framework from a local companion research note rather than treating that unpublished note as an independently validated predecessor. The menu restriction is also the strongest limitation on a broad interpretation: a deliberately chosen menu can create complementarity that disappears when a more direct report is admitted.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in financial networks | Separate loss uncertainty from network reconstruction and compare reporting objectives. | The feasible set, shock and clearing mechanism are assumptions, not fitted bank data. |
| Optimisation and information researchers | Use primal/dual width certificates and exact identification tests for affine simplex models. | General nonlinear clearing and menu selection are separate problems. |
| Readers evaluating disclosure proposals | Ask which target, admissible reports, costs and noise model make a claimed improvement meaningful. | The paper supplies diagnostic questions, not a validated regulatory recommendation. |

## Why the problem matters

A report can fail to distinguish the most consequential alternatives even while revealing an exposure exactly. Conversely, reports can become useful only in combination. Quantifying the remaining target range makes those possibilities inspectable and prevents an attractive disclosure rule from silently changing its objective or feasible set.

## How to inspect or reproduce the recorded checks

Begin with the definitions and the one-layer construction, then verify the affine primal and dual certificates against the stated simplex and report matrix. Read the corrected prior criterion with its zero cases and the complete noise range before specialising either formula.

The retained study records are under `results/fresh-full/`, with the aggregate in `results/fresh-study-aggregation.json`. Follow the [version-bound replay instructions](https://github.com/ipitchford/complementary-disclosures/blob/v2.0.0-candidate/REPLAY.md) and compare exact witnesses with their reported bounds. Run `code/verify_assurance.py --results results/fresh-full` in normal and optimised Python; omitting `--results` checks no retained study records. These checks must be distinguished from rerunning the complete solver experiment. Where selection is attempted, its target is half the initial upper bracket, not half an unknown exact width. The retained execution record and manifest delimit what was checked; the existence of code or a DOI is not that evidence.

## The most valuable next projects

1. Obtain an unaffiliated reconstruction of the examples and affine certificates, with scrutiny of the accounting-to-simplex bridge.
2. Study economically justified report menus and costs, comparing direct target reports, aggregates and individual exposures under the same objective.
3. Extend the diagnostic beyond the affine class while retaining rigorous unresolved outcomes and a credible computational boundary.
4. Specify a data and decision model before testing whether any reporting rule improves an actual institutional outcome.

## What is in the evidence package

The frozen candidate brings together the self-contained manuscript, construction and certificate code, historical and fresh computational status records, separate generation and portable replay environment information, replay instructions and a machine-readable claim index. The archive manifest binds its inventory; the public GitHub and Zenodo assets passed full-download byte parity. Media explain the results; they add no scientific evidence.
