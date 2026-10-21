## Summary

This page explains, in order: what a chemical reaction network model is, what question about simplifying such models was posed, what this release found, why it matters, and what has and has not been checked.

**What the models are.** Chemists and systems biologists often describe a mixture as a list of reactions, such as "X and Z combine to form Y" and "Y falls apart again". Under the standard *mass-action* rule, each reaction runs at a speed proportional to the concentrations of what it consumes, and the whole list becomes a set of differential equations for how the concentrations change over time. A central question about such a model is whether it settles down to one steady state or can sustain *oscillations*: concentrations that rise and fall for ever in a repeating cycle.

**What was conjectured.** Many networks contain a short-lived *intermediate*: a species Y that is formed from some reactants, can fall back into them, and can go on to products. Simplifying a model by deleting the step in which the intermediate falls back is a natural move. Feliu and Kaihnsa proved that, under extra hypotheses, this deletion keeps the network's ability to oscillate through a *Hopf bifurcation* (the standard way in which a steady state loses stability and a small cycle is born). They conjectured more generally that deleting that reverse step never destroys this capacity.

**What was found.** In general it can. The release gives an explicit three-species network with six reactions. With the reverse reaction present, the network crosses a nondegenerate supercritical Hopf bifurcation and therefore has a nearby attracting periodic orbit: it genuinely oscillates. After that one reverse reaction is deleted, every positive trajectory converges to the unique positive equilibrium for every positive choice of the retained rates, so no choice of rates can make the simplified network oscillate. Adding a reverse reaction can therefore do more than perturb a chemical model: here it changes global convergence into oscillatory behaviour.

This supplies counterexamples to three **general** isolated-intermediate reduction conjectures. It does not contradict the restricted theorem proved in the source paper and does not answer its motivating dual-phosphorylation question.

**Status.** An unrefereed AI-assisted research candidate. The finite symbolic identities are checked in exact arithmetic and replay from the frozen archive; the global convergence theorem is a written proof. There has been no external peer review, proof-assistant formalisation or independent reproduction.

## Summary for specialists

The main witness has three species and six reactions with positive integer rates; a separate trimolecular six-reaction witness, in which every source complex has size at most three, is also given. At the positive equilibrium of the integer witness, exact factorisation of the characteristic polynomial and an exact first-Lyapunov-coefficient calculation establish a transverse supercritical Hopf bifurcation. The deleted network admits a scalar reduction and a global convergence argument covering all positive retained parameters. The example refutes Conjectures 3.1, 3.2 and 3.3 of Feliu and Kaihnsa in their general isolated-intermediate formulation.

| Result | Status |
|---|---|
| Integer witness: characteristic polynomial $(\lambda+22)(\lambda^2+2)$ at the Hopf point, crossing derivative $-85/81$, first Lyapunov coefficient $-394783\sqrt2/803682$ under an explicit normalisation (Theorem 1) | proof + exact replay |
| A transverse crossing also occurs when only the reverse rate is varied | proof + exact replay |
| After deletion, every positive rate choice gives a unique globally asymptotically stable positive equilibrium with three real negative eigenvalues (Theorem 2) | written proof |
| Exact spectral criterion for the Hopf crossing in a one-parameter family (Proposition 4) | proof |
| Criticality along a closed Hopf locus: subcritical below an isolated degenerate value, supercritical above it (Theorem 5) | proof + exact identity |
| Trimolecular six-reaction witness; nonempty terminal-complex variant; two-species boundary results | proof |

A separate one-parameter family writes the closed Hopf locus explicitly. Its first Lyapunov coefficient has a denominator positive on the whole parameter range and a numerator polynomial with exactly one positive root. Thus the Hopf bifurcation changes from subcritical to supercritical across one isolated degenerate value. Only vanishing of the cubic coefficient is established there; no second Lyapunov coefficient or Bautin classification is claimed.

## Technical account

The full-network certificate has three distinct jobs:

1. identify a positive equilibrium and factor the Jacobian polynomial there;
2. show a simple conjugate pair crosses the imaginary axis transversely;
3. determine criticality through the exact first Lyapunov coefficient.

Those local calculations are not used to infer the deleted system's global behaviour. The deleted network is analysed separately: it has a unique positive equilibrium and the planar reduction excludes recurrent alternatives, yielding convergence for every positive retained rate choice.

This separation matters. A multiple root in a scalar expression would not by itself prove a Hopf bifurcation in the original dynamics, and local stability at one parameter would not establish global convergence across all positive parameters.

**Why the reverse step matters here.** In the paper's interpretation, the return reaction from the intermediate is dynamically active: a nonlinear removal step together with a sufficient reverse flux produces the oscillatory instability, while after deletion a simple scalar identity for one species enforces convergence for every positive rate choice. The two-species boundary results show that three species are needed for a counterexample of this kind under the stated hypotheses.

## Evidence, assurance and limitations

The finite symbolic identities, polynomial signs and displayed witnesses replay from the frozen archive in normal and optimized-wrapper runs. The replay runner removes inherited optimization settings, records checker optimization levels and refuses nonzero checker levels. This protects assertion-bearing verification from an easy but subtle failure mode.

The global convergence theorem and the dimensional observations are written analytic arguments rather than machine-checked proofs. The explanatory banner is schematic and is not a numerical trajectory. No laboratory system is modelled or validated.

The strongest exclusions are substantive: the work does not classify the isolated degenerate Hopf value, certify orbit amplitudes, prove reaction-count minimality, or solve the motivating dual-phosphorylation problem. Bounded prior-art checking cannot establish absolute priority.

## Relationship to earlier work

Feliu and Kaihnsa prove a restricted absence-of-Hopf theorem and formulate the broader conjectures tested here. Banaji's work on creating oscillations by adding reversible reactions is a close methodological antecedent. Later bifurcation-inheritance results explain how local bifurcations can persist under network enlargement, but do not supply this deleted-network contrast.

The contribution sought here is the exact counterexample together with its unusually strong opposite-side theorem: the full network oscillates locally, while the deleted network converges globally for all positive retained rates.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Chemical-reaction-network theorists | Test reduction principles against an explicit small witness. | The source paper's restricted theorem remains intact. |
| Dynamical-systems researchers | Inspect an exact Hopf family with a classified cubic coefficient. | The isolated degenerate value is not classified. |
| Modellers using reaction deletion | See why a reverse arrow can change qualitative dynamics. | The construction is mathematical, not empirical biochemical validation. |

## Why the problem matters

Reduction principles are valuable because they let conclusions about oscillation be transferred between a network and a smaller one; the conjectures tested here were motivated by the dual-phosphorylation network. This example shows that the general form of one such reduction principle fails: dropping a single reverse step can turn an oscillating network into one that always settles down, whatever the rates. Any use of the reduction therefore needs the extra hypotheses of the restricted theorem, or a separate argument.

## How to inspect or reproduce the recorded checks

Read the global deleted-network theorem and the explicit Hopf witness as separate arguments. Then run the repository replay from the versioned archive and compare its exact outputs with the claim map:

```sh
python code/replay.py --output replay-output.json
```

The [AI index](https://github.com/ipitchford/reverse-reaction-attracting-oscillations/blob/v1.0.0/AI_INDEX.md) points agents to the theorem, certificates and limitations; the [replay guide](https://github.com/ipitchford/reverse-reaction-attracting-oscillations/blob/v1.0.0/REPLAY.md) states the finite scope of the executable checks.

## The most valuable next projects

The highest-value assurance task is an unaffiliated reconstruction of both the Hopf calculation and the all-parameter global argument. Mathematically, the isolated zero of the cubic coefficient is the clearest extension target. Reaction-count minimality and the source paper's motivating dual-phosphorylation question require separate work rather than extrapolation from this example.

## What is in the evidence package

Version 1.0.0 contains the complete manuscript, TeX and Markdown sources, exact certificates, replay code, claim and provenance maps, literature audit, licences and a noncircular manifest. Original prose, data and figures are CC0-1.0; original code is MIT licensed. GitHub and Zenodo preserve the frozen archive and paper. That establishes availability and byte identity, not scientific correctness, external peer review or independent reproduction.
