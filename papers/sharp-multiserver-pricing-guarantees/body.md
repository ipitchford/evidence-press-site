## Summary

A service with several servers, such as a charging station, a clinic or a cloud platform, charges customers and pays a cost for every customer it holds. It could change its price with every change in occupancy. Or it could keep one simple fixed price, and stop admitting customers once a capacity is reached. How much does the simple rule lose?

Bergquist and Elmachtoub (2026) published worst-case guarantees for one particular rule of this kind. They offer customers at the same rate that an optimal dynamic policy would accept them, and then cap the system. They conjectured that their guarantees cannot be improved. This paper proves that for every number of servers and every capacity. It also finds the load at which congestion is worst, and the exact curve that trades revenue against congestion.

**Worked example.** With $C=5$ servers and total capacity $N=7$, the rule keeps at least $81.85\%$ of optimal revenue and raises mean occupancy by at most a factor $1.01003$. Neither number can be improved. They do not arise together: the congestion figure occurs at a load of about $2.59$, and the revenue figure as the load approaches $5$.

**What this does not say.** These results describe this specific construction, not the best fixed price. How well the best fixed price and capacity can do remains open.

## Summary for specialists

Write $B_{C,N}$ for blocking and $m_{C,N}$ for mean occupancy in the M/M/C/N queue, $f_{C,N}(x)=m_{C,N}(x)/x$, and $g_{C,N}=\max_{0\le x\le C}f_{C,N}(x)$. The existing bounds are $G^{\mathrm{stat}}_C/G^*\ge 1-B_{C,C}(C)$, $R^{\mathrm{stat}}_N/R^*\ge 1-B_{C,N}(C)$ and $L^{\mathrm{stat}}_N/L^*\le g_{C,N}$.

- **Theorem 2.1.** All three constants are sharp for every $C\ge1$ and $N\ge C$, even for uniform valuations. By Proposition 3.4, the optimal throughput in the suggested linear-demand family is an analytic, strictly increasing bijection onto $(0,C)$.
- **Theorem 2.2.** For $d=N-C\ge1$, $f_{C,C+d}$ has a unique positive critical point. With $H_C=1/B_{C,C}(C)$, the quartic $Q_C(d)=d^4+(4H_C-6)d^3-7d^2+\{12C-4H_C(1+3C)\}d-12C^2$ has one positive root $d_{\mathrm{crit}}(C)$. The maximiser lies strictly below $C$ exactly when $d<d_{\mathrm{crit}}(C)$, and $d_{\mathrm{crit}}(C)/\sqrt C\to 1.7882539728\ldots$
- **Corollary 4.1.** The worst revenue and congestion ratios can be approached together exactly when $d\ge d_{\mathrm{crit}}(C)$.
- **Theorem 4.3.** The load-dependent bounds are tight at every load, which gives the exact frontier $\Phi_N(\rho)=\max_{x_\rho\le x\le C}f_{C,N}(x)$.
- **Theorem 6.1.** If $d_C/\sqrt C\to c$, then $\sqrt C(g_{C,N_C}-1)\to K_c(\beta_*(c))$ and $(C-x_C)/\sqrt C\to\beta_*(c)$, with $\beta_*(c)=0$ exactly when $c\ge c_*$. Corollary 6.2 gives the first-order bicriteria curve.
- **Theorem 7.1.** Explicit finite-parameter bounds on the profit deficit.
- **Theorem 8.1.** The companion sojourn-time constants are sharp, and both are approached together at every capacity.

## Technical account

**Sharpness.** The linear-demand family has a no-wait optimum, because waiting has a negative net value when valuations stay below $1+1/C$. Balance equations turn the problem into a concave programme in stationary probabilities. This is a quadratic specialisation of the method of Balseiro, Ma and Zhang. Its optimum varies analytically with the demand scale, and throughput sweeps out all of $(0,C)$. Because mean occupancy under the optimum equals throughput, the congestion ratio at any load is exactly $f_{C,N}$, so every interior value of the scalar maximisation is realised by a real instance.

**The transition.** Coefficient-ratio monotonicity gives $f$ a single peak; this shape is already available from Karp, Vishnyakova and Zhang (2025), and our argument adds only uniqueness of the critical point. Evaluating the derivative at $x=C$ gives $f'_{C,C+d}(C)=Q_C(d)/\{12C^2(H_C+d)^2\}$. Descartes' rule then gives one positive root.

**The frontier.** Valuations concentrated near one price make the optimal dynamic policy an Erlang loss system. There mean occupancy equals throughput and revenue is nearly exact, so both load-dependent inequalities are tight at once. This also gives a second, shorter proof of the sharpness constants.

**Many servers.** On the square-root scale the stationary law converges to a truncated-normal and truncated-exponential density, which is in Whitt (2004). The new content is the interchange of limit and maximisation for the maximal ratio.

**Sojourn time.** The sojourn bound needs no maximisation, because mean sojourn time rises with load. Its worst case is therefore always at critical load, and the revenue and sojourn constants never conflict.

## Evidence, assurance and limitations

All main results have written proofs. Four scripts check them: 620 exact endpoint identities, 62 exact factorisations, 300 exact sojourn identities, finite congestion optimisations, Bellman residuals and integral checks. These are finite checks, not proofs. Replay from fresh copies, with and without `-O`, reproduced the shipped JSON, CSV and PNG files byte for byte, and three corruption controls are detected.

Limits a reader should keep in mind:

- **Construction, not best policy.** The results concern the specified throughput-matched construction. The best static policy stays open. Indeed, the large-demand instances admit a much better static rate than the one the construction uses.
- **$t^*$ is a proof device.** Anyone who knows the demand curve well enough to compute it would simply optimise the price, as Bergquist and Elmachtoub stress.
- **The occupancy ratio can hide a queue.** With $C=100$ and $N=120$, the worst ratio is only $1.033$, but the mean queue at critical load is about $6.3$, against none under the no-wait optimum.
- **Worst instances are special.** They need a valuation margin below $1/C$, and very large potential demand near full utilisation.
- **Close antecedents.** The frontier and sojourn proofs are elementary. The ingredients of the frontier appear in the proofs of Bergquist and Elmachtoub and in earlier work, and the sojourn result is offered as a completion.
- **Model scope.** Exponential service, no abandonment, no strategic delay, no networks.

This is an unrefereed candidate. Review was internal and AI-assisted. There has been no human specialist review, independent reproduction or proof-assistant formalisation. The comparison with earlier work describes the sources we checked and is not a priority claim.

## Relationship to earlier work

The bounds and the conjecture are from Bergquist and Elmachtoub (2026, Section 4, p. 14). Daley, van Leeuwaarden and Nazarathy (2015, equation 2.17) already give the first limit of Corollary 6.2.

Pacheco (1994) studies the curvature of the blocking probability. For one server his threshold is the same number as ours, three waiting places, through the exact identity $B''=Q_1(d)/\{6(d+2)^3\}$ at critical load. The coincidence does not persist: with $C=2$ and $d=3$, the second derivative of blocking at critical load is positive while $Q_2(3)=-60$. His work concerns blocking, not the ratio $f_{C,N}$, and it contains neither the general $Q_C$ nor any pricing statement.

For pure loss systems with no congestion cost, Elmachtoub and Shi study the best static policy directly and give tight results for other rates and instance classes. Dupont et al. (2026) study parking prices for electric-vehicle charging, computationally and without worst-case guarantees.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Revenue-management and queueing researchers | A closed question, and exact worst-case instances to test new policies against | Sharpness is for this construction only |
| Operators of capacity-limited services | A clear view of when simple prices lose most, and of how much waiting room matters | $t^*$ is not something an operator can compute; the ratio can hide queues |
| Students of Erlang and finite-buffer systems | A worked example of an exact finite-system threshold with a square-root limit | Finite checks are not proofs |

## Why the problem matters

Simple fixed prices are easy to run and easy to trust, so it matters how much they give up. A worst-case bound answers that only if we know how tight it is. Knowing that these bounds are exact separates what the construction really loses from what a loose proof might have lost. It also moves attention to the question that remains: the best fixed price, chosen with its capacity.

## How to inspect or reproduce the recorded checks

Download the archive, work in a copy, install the pinned packages from `requirements.txt`, and run from `code/`, with and without `-O`:

```bash
python3 -I -B verify_queueing.py
python3 -I -B reviewer_validation.py
python3 -I -B verify_sojourn.py
python3 -I -B verify_frontier.py
```

Each script takes seconds, and exits non-zero if a check fails. `verify_queueing.py` also redraws the figures beside itself.

## The most valuable next projects

Specialist checking of Theorems 2.1, 2.2 and 6.1 would add more than further internal review. The main research question is the best jointly chosen static price and capacity against a congestion cost. Other directions are worst-case guarantees over typical rather than extreme instances, an occupancy measure that does not hide queues, and scales other than $c\sqrt C$ waiting places.

## What is in the evidence package

The archive contains the paper (PDF and Markdown source), bibliography, four check scripts with retained JSON and CSV output, the three figures, the prior-art record, `CLAIMS.json` with each result's hypotheses, `AI_INDEX.md`, `RESEARCH_GATES.json` and SHA-256 sums.
