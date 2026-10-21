## Summary

**The setting.** Some hosts can become dormant following contact with a virus. Contact-mediated dormancy changes both the immediate effect of viral contact and the subsequent supply of susceptible hosts. Blath and Tóbiás (2026) proposed a deterministic model with one host that cannot go dormant and a competing host that can, and conjectured (their Conjecture 4.1(C)(iii)) that stable resident endemic states plus mutual invasion (each host can invade the other's established population) imply stable, attracting coexistence.

**What was found.** When two hosts compete in the presence of a virus, allowing one host to become dormant can change the long-term dynamics. This paper gives exact parameters for which the usual coexistence picture fails: each host can invade the other's resident state, but the unique coexistence equilibrium is unstable.

For almost every strictly positive initial state, the solution does **not** approach any equilibrium. Separately, a certified local bifurcation produces small attracting periodic orbits. These are different conclusions: the paper does not identify the eventual behaviour of almost every trajectory. The result concerns deterministic long-time behaviour; it does not contradict the source's proved stochastic invasion results.

**Status.** A written-proof candidate with exact symbolic and outward-rounded interval certificates; not externally peer reviewed or formally verified.

## Summary for specialists

In the six-dimensional Blath–Tóbiás model, an explicit admissible family indexed by $C\ge 1/2$ has the fixed coexistence state $(1,10/3,20,196,4/3,5)$. Its Jacobian has exactly two eigenvalues in the open right half-plane. The resident equilibria are stable in their resident subsystems and invasible. Every nonnegative equilibrium is hyperbolic; boundedness and the stable-manifold theorem give a measure-zero union of equilibrium basins in the positive orthant. This refutes the specified convergence assertion in Conjecture 4.1(C)(iii).

At $C=1/2$, with the remaining rates fixed and only dormancy probability $q$ varied, exact elimination and outward-rounded interval arithmetic certify a supercritical Hopf point near $q_H=0.9769161486$. Stable small cycles exist for $q>q_H$ sufficiently close to the threshold.

## Technical account

The counterexample is constructed backwards from a rational positive equilibrium. Equilibrium elimination fixes the viral coordinate and reduces the host balance to two linear equations. The resulting characteristic polynomial has a uniform Hurwitz-sign certificate across the entire half-line $C\ge1/2$, rather than a finite numerical scan.

Resident invasion is checked through **Schur complements** of the relevant linearised blocks. Their signs determine invasibility, but their numerical values are not eigenvalue growth rates. The Hopf calculation is separate: a degree-seventeen polynomial isolates the threshold, the remaining quartic factor is stable, the eigenvalue crossing is transverse, and the first Lyapunov coefficient is negative in the stated normalisation.

The cover is a schematic local Hopf diagram, not numerical continuation data. It depicts only the near-threshold branch established by the theorem.

## Evidence, assurance and limitations

The manuscript supplies the analytic global boundedness and stable-manifold arguments. Exact symbolic and integer-interval programs check the finite algebra and local Hopf conditions. Finite computations do not formally verify the written global argument. Supplied and fresh internal checks are not unaffiliated reproduction or external human peer review.

The result does not establish global persistence, global attraction to a periodic orbit, an explicit finite continuation interval, or periodic behaviour at $q=0.98$. It does not contradict the source's distinct stochastic invasion results or its one-host questions. Biological interpretation remains conditional on the model.

## Relationship to earlier work

The target is the specified two-host convergence assertion of Blath and Tóbiás, not the entire source paper. The local Hopf certificate strengthens the counterexample by proving that attracting oscillations actually occur nearby, while retaining a clear boundary between local bifurcation and global dynamics.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Mathematical biologists | Test whether invasion conditions imply convergence | They need not; this is a particular deterministic model |
| Dynamical-systems researchers | Reuse the exact family and certified Hopf calculation | Global attractor classification remains open |
| Computational researchers | Replay symbolic and interval certificates | Program agreement is not proof-assistant verification |

## Why the problem matters

Invasion and steady coexistence answer different questions. Showing that both species can enter does not establish that their eventual interaction settles down. An exact counterexample identifies the missing dynamical inference without relying on a long simulation.

## How to inspect or reproduce the recorded checks

Start with the package's README, AI index and replay instructions. Check the model equations and rational equilibrium first, then the family Hurwitz certificate and resident invasion calculation. Finally inspect the Hopf polynomial and integer-interval output. The manuscript explains which steps are analytic proofs and which are mechanically replayed identities.

With Python 3.10+, Node.js 18+ and the versions in `requirements.txt`:

```sh
python3 -m pip install -r requirements.txt
python3 -B run_checks.py
python3 -B -O run_checks.py
python3 -B negative_controls.py
python3 -B -O negative_controls.py
```

The main runner executes seven programs and regenerates the three certificate JSON files plus `reproduction/` logs; run it in a disposable copy when preserving deposit bytes. Semantic controls mutate isolated temporary copies only. Successful execution is not a formal proof of the complete paper: the all-parameter inference, dynamical theorem application and measure-zero argument also require the written proof.

## The most valuable next projects

Determine the global attracting sets of the counterexample family, certify a quantitative neighbourhood of the Hopf branch, or identify additional assumptions that recover a valid convergence theorem. Each would go beyond the local cycle existence proved here.

## What is in the evidence package

A self-contained manuscript and PDF, exact parameter specifications, symbolic and interval certificates, replay programs, environmental information, claim-to-evidence navigation, and a substantive account of the resolved objections and remaining scope limits.
