## Summary

Fragmentation can prevent a rapidly growing stochastic system from accumulating infinitely many events in finite time—but only if it is strong enough in the right asymptotic sense.

This paper gives a complete phase diagram for a population of noninteracting compartments containing substrate and a finite conserved number of catalysts. It proves the critical equality case of the source conjecture, extends the model to substantially broader splitting rules, and shows why the full descendant population must be controlled rather than only a selected active lineage.

## What “explosion” means here

Explosion is a technical path property: infinitely many model events occur before a finite physical time. It is not a chemical detonation, a large concentration, or an empirical safety claim. A conservative process has an infinite lifetime almost surely.

Each compartment can produce substrate and fragment into two daughters. Catalysts are redistributed but neither created nor destroyed. Although a marked catalyst lineage captures the superlinear growth mechanism, catalyst-free daughters continue to generate events. A population-level theorem therefore needs to control those passive descendants too.

## Main classification

For production rate
$$
b+\alpha e(s)_m
$$
and fragmentation rate $\kappa s^\gamma$, with integer $m\ge2$, the exact classification is:

| Parameter region | Every finite initial state containing a catalyst |
|---|---|
| $\gamma>m-1$ | conservative |
| $\gamma=m-1$ and $\alpha\le\kappa\log(1/p)$ | conservative |
| $\gamma=m-1$ and $\alpha>\kappa\log(1/p)$ | explodes almost surely |
| $0\le\gamma<m-1$ | explodes almost surely |

Here $p$ is the retained substrate fraction in the daughter containing a single catalyst. Catalyst-free finite states are conservative in every region.

At $m=2$, $\gamma=1$, $b=\kappa=1$ and $\alpha=\log(1/p)$, the theorem proves the critical nonexplosion conjecture identified in the source paper.

## Why the proof is not just a one-dimensional calculation

The proof first establishes localised continuous-time Lyapunov criteria for conservativity and almost-sure explosion. It then analyses a one-catalyst marked lineage. That scalar process reveals the correct boundary, but it is not the complete model: every split also creates a passive population whose later events contribute to the lifetime.

A separate finite-event estimate controls that passive population. Induction on the conserved catalyst count then transfers the one-lineage classification to the full compartment population. This is the step that prevents a scalar projection from being mistaken for a population proof.

## Extensions in the revised result

The same population argument survives several changes to the local model:

- real production exponents rather than only falling factorials;
- lower-order polynomial perturbations;
- a second-order logarithmic boundary, including equality;
- splitting laws specified through conditional first and second moments;
- fresh random retained fractions $Q\in(0,1]$ at successive fragmentations.

In the random-retention extension, the critical coefficient is
$$
\kappa\,\mathbb E[-\log Q],
$$
under one finite inverse moment and uniform conditional moment bounds. An explicit uniform-retention example shows that two distributions with the same mean retention can lie on different sides of the phase boundary. The relevant quantity is the logarithmic loss, not the mean alone.

Every explosive regime also has a uniform exponential bound on the remaining lifetime when the total catalyst count is bounded.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/compartment-fragmentation-phase-classification.txt) is available for reading.

The package replays selected drift identities and random-retention examples using exact arithmetic. Ordinary and optimized Python executions produce the same semantic receipt, and four deliberately corrupted cases must fail. These tests support the algebra and the examples. They do not prove the asymptotic stochastic theorems; those conclusions rest on the written arguments.

The result assumes noninteracting compartments, fresh parent-state Markov splitting, finite conserved catalyst count, no coagulation, no common environment and the stated dispersion and moment conditions. It does not classify systems outside those hypotheses or make an empirical claim about a chemical experiment.

Internal AI-assisted review is not external human peer review, independent reproduction or proof-assistant formalisation.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Stochastic-process researchers | Inspect a sharp critical classification and population reduction | Check every kernel and moment hypothesis |
| Reaction-network researchers | Resolve the stated compartment-model conjecture | Explosion is a path property, not physical detonation |
| Applied modellers | See why mean retention and a single active lineage can mislead | No empirical calibration is supplied |

## How to inspect the result

Start with the model statement and the phase table. Next inspect the two localised Lyapunov lemmas, the passive-population estimate and the induction on catalyst count. Only then move to the critical logarithmic and random-retention extensions. The repository README runs both replay modes and the negative controls.

## The most valuable next projects

The clearest next tests are to relax independence between compartments, add a precisely specified common environment, or determine which parts of the reduction survive coagulation. Those would be new models rather than consequences already proved here.

## What is in the evidence package

The standalone paper, exact replay code and receipts, claims and assurance records, citation audit, novelty scope, environment instructions, mutation controls and agent-readable index are linked through the repository and the frozen archival deposit.
