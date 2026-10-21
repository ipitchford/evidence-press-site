## Summary

**The setting.** Compartment models divide a population into states and track how the fractions in each state change as individuals interact and move between states. When a compartment empties, convergence to zero does not by itself say how long its remaining activity matters. Chan, Crommelin and Mandjes (arXiv:2511.02437v1, Conjecture 1) conjectured that, in a conservative quadratic interaction model, vanishing states decay exponentially when the transition graph is acyclic and each dependency cycle contains a vertex with a persistent dependency successor.

**What was found.** A population can disappear without doing so exponentially fast. The distinction matters: a power-law tail can remain appreciable far longer, even when its total future activity is finite.

This paper gives a minimal four-compartment counterexample to a proposed graph-based exponential-extinction rule. It then constructs slower families and explains the missing condition: the limiting interaction rates, not graph topology alone, determine whether every vanishing compartment has an exponential upper bound.

**Status.** An AI-assisted, unrefereed candidate. The general results rest on written analytic proofs; exact finite checks and corruption controls support the explicit constructions. There has been no external human peer review, independent external reproduction or proof-assistant formalisation.

## Summary for specialists

The conservative quadratic system
$$
\dot X=-XI,\quad \dot Y=-2YI,\quad
\dot I=(X-2Y)I,\quad \dot R=4YI
$$
with initial fractions $(2/9,2/9,1/18,1/2)$ meets the stated transition-acyclicity and dependency-cycle hypotheses, but
$$
I(t)\sim18t^{-2},\qquad \int_0^\infty I(t)\,dt=\log2.
$$
Four states are necessary. For every integer $m\ge2$, a corresponding $(m+2)$-state construction has exponent $m/(m-1)$. Under transition acyclicity, exponential extinction is equivalent to a negative spectral bound of the limiting transverse Jacobian. The aggregate vanishing mass has logarithmic rate equal to that bound.

## Technical account

The four-state example becomes transparent after using accumulated activity as a new clock. A first integral turns the disappearing component into a squared distance from a limiting root. That repeated root produces inverse-square decay rather than a fixed exponential rate.

Higher root multiplicity yields the family of exponents approaching one. Separate arguments establish minimum dimension, classify the three regimes of the four-state model, and prove the spectral repair. The logarithmic-rate statement concerns total vanishing mass: it does not assert the same rate for every coordinate or a pure-exponential asymptotic without prefactors.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/algebraic-extinction-compartments.txt) is available for reading.

Exact finite checks cover twenty-four family members and three regimes; deliberate errors test rejection. The analytic arguments, not the finite sample, support arbitrary $m$, minimality and the spectral theorem.

These constructions are existence results within a specified mathematical model. They do not show that algebraic extinction is generic, fit an observed epidemic, or make a policy forecast. Internal AI-assisted review and replay are not external human peer review, independent external reproduction or proof-assistant formalisation.

## Relationship to earlier work

The target is the exponential conclusion of the stated Chan–Crommelin–Mandjes conjecture, not the underlying integrability result. Algebraic decay, kinetic realisation, time changes and first integrals are established techniques. The candidate's contribution is the sharp graph-compatible counterexample and its structural and spectral consequences.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Dynamical-systems researchers | Inspect a sharp obstruction and its spectral repair | The criterion uses the limiting trajectory |
| Compartment-model researchers | Separate integrability from exponential extinction | Graph hypotheses must match the paper exactly |
| Applied modellers | Recognise a potential failure of exponential extrapolation | No empirical calibration is supplied |

## Why the problem matters

Finite total activity is weaker than rapid disappearance. A graph can certify that transitions have no cycle while failing to rule out cancellation of effective inflow and outflow at the limiting state.

## How to inspect or reproduce the recorded checks

Begin with the explicit four-state system and its time-change calculation. Then inspect the minimality argument, the full regime classification and the limiting matrix theorem. Follow the repository README for normal and optimised exact replay and the mutation controls; the supplied family plots illustrate the formulas, not observed data. With Python 3 (standard library only):

```sh
python3 -B test_verifier.py --output-dir /tmp/extinction-replay-new
```

Use a new output directory. The harness runs `verify.py` normally and with `-O`, checks that the child really used the requested optimization mode, and requires wrong normalization, a missing channel and a wrong removed-state flux to fail in both modes. Published example receipts are in `evidence/replay-20261020`.

## The most valuable next projects

Characterise how the slower regime changes under perturbations of initial fractions and rates, or extend the spectral criterion to precisely specified cyclic transition structures. Applications would require independent model validation rather than treating this counterexample as an epidemic prediction.

## What is in the evidence package

The standalone manuscript, explicit channel constructions, finite exact checks, corruption controls, figures, claim and assurance records, bounded prior-art account, environment instructions and agent-readable index are linked through the repository.
