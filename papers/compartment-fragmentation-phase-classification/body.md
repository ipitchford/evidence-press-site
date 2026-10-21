## Summary

**The setting.** Picture a population of separate compartments, each holding some substrate molecules and a few catalysts. Catalysts speed up substrate production, and the more substrate a compartment holds, the faster it grows. Left alone, such self-reinforcing growth can run away. Compartments also split in two, and splitting dilutes their contents. The question is which force wins.

**What "explosion" means here.** In this mathematics, a model *explodes* when infinitely many events—productions and splittings—happen before a finite time, so the ordinary step-by-step description of the system breaks down. It is not a chemical detonation, a large concentration, or an empirical safety claim. A *conservative* process, by contrast, has an infinite lifetime almost surely.

**What was found.** Fragmentation can prevent a rapidly growing stochastic system from accumulating infinitely many events in finite time—but only if it is strong enough in the right asymptotic sense. This paper gives a complete phase diagram for a population of noninteracting compartments containing substrate and a finite conserved number of catalysts. It proves the critical equality case of the source conjecture (Conjecture 3.14 of Anderson, Howells and Rojas La Luz, 2026), extends the model to substantially broader splitting rules, and shows why the full descendant population must be controlled rather than only a selected active lineage. One practical lesson: two splitting rules that keep the same *average* share of substrate can still fall on opposite sides of the boundary.

**Status.** Unrefereed, AI-assisted research. The arguments have received separate internal model audits; these are not external peer review, independent reproduction or a formal proof certificate.

## Summary for specialists

Each compartment can produce substrate and fragment into two daughters. Catalysts are redistributed but neither created nor destroyed. For production rate
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

**Extensions in the revised result.** The same population argument survives several changes to the local model:

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

## Technical account

**Why the proof is not just a one-dimensional calculation.** Although a marked catalyst lineage captures the superlinear growth mechanism, catalyst-free daughters continue to generate events. A population-level theorem therefore needs to control those passive descendants too.

The proof first establishes localised continuous-time Lyapunov criteria for conservativity and almost-sure explosion. It then analyses a one-catalyst marked lineage. That scalar process reveals the correct boundary, but it is not the complete model: every split also creates a passive population whose later events contribute to the lifetime.

A separate finite-event estimate controls that passive population. Induction on the conserved catalyst count then transfers the one-lineage classification to the full compartment population. This is the step that prevents a scalar projection from being mistaken for a population proof.

**What is inherited.** The paper is explicit about its debts. The source paper's Remark 3.13 already proves positive recurrence of the single-catalyst projection at the critical coefficient, and its proof of Proposition 3.12 uses an active/passive finite-event argument; the present work applies a marked, localised version of that argument to the one-catalyst base case. The scalar Lyapunov and Lamperti mechanisms are classical; their application to the complete compartment population is made explicit. No new universal scalar criterion is claimed.

## Evidence, assurance and limitations

The package replays selected drift identities and random-retention examples using exact arithmetic. Ordinary and optimized Python executions produce the same semantic receipt, and four deliberately corrupted cases must fail. These tests support the algebra and the examples. They do not prove the asymptotic stochastic theorems; those conclusions rest on the written arguments.

The result assumes noninteracting compartments, fresh parent-state Markov splitting, finite conserved catalyst count, no coagulation, no common environment and the stated dispersion and moment conditions. It does not classify systems outside those hypotheses or make an empirical claim about a chemical experiment.

Internal AI-assisted review is not external human peer review, independent reproduction or proof-assistant formalisation. Statements about prior work are bounded by the documented source access and search of 19 October 2026.

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/compartment-fragmentation-phase-classification.txt) is available for reading.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Stochastic-process researchers | Inspect a sharp critical classification and population reduction | Check every kernel and moment hypothesis |
| Reaction-network researchers | Resolve the stated compartment-model conjecture | Explosion is a path property, not physical detonation |
| Applied modellers | See why mean retention and a single active lineage can mislead | No empirical calibration is supplied |

## Why the problem matters

Content-dependent fragmentation can compete with the explosive growth of a chemical reaction network, and the competition happens at two levels. Within one compartment, a split acts as a sudden loss of substrate. In the population as a whole, the same split creates a new compartment whose later events still count towards the explosion time. A conservative one-lineage projection therefore does not, by itself, establish conservativity of the population. Settling the critical case and making the population step explicit closes a stated conjecture and shows modellers which quantity—the logarithmic loss at splitting—actually decides the outcome.

## How to inspect or reproduce the recorded checks

Start with the model statement and the phase table. Next inspect the two localised Lyapunov lemmas, the passive-population estimate and the induction on catalyst count. Only then move to the critical logarithmic and random-retention extensions. A reader interested only in the source conjecture may stop after the section proving the basic phase diagram.

To replay the finite checks from the repository or archive:

```sh
python3 -B code/replay.py
```

The wrapper runs both ordinary and optimized Python, verifies their optimization flags, compares semantic receipts, and requires four deliberate negative controls to raise `VerificationError` in both modes. `CLAIMS.md` gives the exact claim-to-evidence boundaries and `AI_INDEX.md` the agent-oriented navigation and non-claims.

## The most valuable next projects

The clearest next tests are to relax independence between compartments, add a precisely specified common environment, or determine which parts of the reduction survive coagulation. Those would be new models rather than consequences already proved here.

## What is in the evidence package

The standalone paper, exact replay code and receipts, claims and assurance records, citation audit, novelty scope, environment instructions, mutation controls and agent-readable index are linked through the repository and the frozen archival deposit.
