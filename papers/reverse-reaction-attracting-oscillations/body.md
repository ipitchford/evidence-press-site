## Summary

Adding a reverse reaction can do more than perturb a chemical model. In the explicit three-species network studied here, it changes global convergence into oscillatory behaviour. The full network crosses a nondegenerate supercritical Hopf bifurcation and therefore has a nearby attracting periodic orbit. After one reverse reaction is deleted, every positive trajectory converges to the unique positive equilibrium for every positive choice of the retained rates.

This supplies counterexamples to three **general** isolated-intermediate reduction conjectures. It does not contradict the restricted theorem proved in the source paper and does not answer its motivating dual-phosphorylation question.

## Summary for specialists

The main trimolecular witness has three species and six reactions with positive integer rates. At its positive equilibrium, exact factorisation of the characteristic polynomial and an exact first-Lyapunov-coefficient calculation establish a transverse supercritical Hopf bifurcation. The deleted network admits a scalar reduction and a global convergence argument covering all positive retained parameters.

A separate one-parameter family writes the closed Hopf locus explicitly. Its first Lyapunov coefficient has a denominator positive on the whole parameter range and a numerator polynomial with exactly one positive root. Thus the Hopf bifurcation changes from subcritical to supercritical across one isolated degenerate value. Only vanishing of the cubic coefficient is established there; no second Lyapunov coefficient or Bautin classification is claimed.

## Technical account

The full-network certificate has three distinct jobs:

1. identify a positive equilibrium and factor the Jacobian polynomial there;
2. show a simple conjugate pair crosses the imaginary axis transversely;
3. determine criticality through the exact first Lyapunov coefficient.

Those local calculations are not used to infer the deleted system's global behaviour. The deleted network is analysed separately: it has a unique positive equilibrium and the planar reduction excludes recurrent alternatives, yielding convergence for every positive retained rate choice.

This separation matters. A multiple root in a scalar expression would not by itself prove a Hopf bifurcation in the original dynamics, and local stability at one parameter would not establish global convergence across all positive parameters.

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

## How to inspect the result

Read the global deleted-network theorem and the explicit Hopf witness as separate arguments. Then run the repository replay from the versioned archive and compare its exact outputs with the claim map. The [AI index](https://github.com/ipitchford/reverse-reaction-attracting-oscillations/blob/v1.0.0/AI_INDEX.md) points agents to the theorem, certificates and limitations; the [replay guide](https://github.com/ipitchford/reverse-reaction-attracting-oscillations/blob/v1.0.0/REPLAY.md) states the finite scope of the executable checks.

## The most valuable next projects

The highest-value assurance task is an unaffiliated reconstruction of both the Hopf calculation and the all-parameter global argument. Mathematically, the isolated zero of the cubic coefficient is the clearest extension target. Reaction-count minimality and the source paper's motivating dual-phosphorylation question require separate work rather than extrapolation from this example.

## What is in the evidence package

Version 1.0.0 contains the complete manuscript, TeX and Markdown sources, exact certificates, replay code, claim and provenance maps, literature audit, licences and a noncircular manifest. GitHub and Zenodo preserve the frozen archive and paper. That establishes availability and byte identity, not scientific correctness, external peer review or independent reproduction.
