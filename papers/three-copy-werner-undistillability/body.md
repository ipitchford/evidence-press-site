## Summary

Entanglement can exist without being accessible through a chosen distillation protocol. This candidate addresses a precise finite-copy question: can three copies of a boundary Werner state, with three levels on each side, yield distillable entanglement?

The claimed answer is no. An exact certificate covers every allowed complex rank-two test. Together with a short parameter argument, it places the three-copy threshold at $\alpha=-1/2$: distillation is possible strictly below that value and impossible at or above it. This does not settle what happens with arbitrarily many copies.

## Summary for specialists

For $\rho=(2I-F)/15$ on $\mathbb C^3\otimes\mathbb C^3$, version 1.1.0-candidate proves

$$
\langle\psi|(\rho^\Gamma)^{\otimes3}|\psi\rangle\ge0\qquad\text{for every }\operatorname{SR}(\psi)\le2.
$$

Equivalently, for every complex $27\times27$ matrix $C$ of rank at most two,

$$
q_3(C)=\|C\|_F^2-\frac12\sum_i\|\operatorname{Tr}_iC\|_F^2+\frac14\sum_{i<j}\|\operatorname{Tr}_{ij}C\|_F^2-\frac18|\operatorname{Tr}C|^2\ge0.
$$

There is no normality, Hermitian or common-plane support assumption. In the physical family $\rho(3,\alpha)=(I+\alpha F)/(9+3\alpha)$, $-1\le\alpha\le1$, the corollary gives three-copy distillability exactly when $\alpha<-1/2$.

## Technical account

The written proof first identifies the physical expectation as $8q_3(C)/3375$. A rank-two parametrisation then expresses the problem in invariant coordinates. Exact local moment matrices are positive semidefinite on every feasible input. The final certificate combines 716 PSD multipliers with selected linear identities to recover the objective exactly.

All 2,374 residual coordinates vanish. The proof needs exact positivity and the final identity, rather than the historical optimisation run that discovered the multipliers. The revised manuscript therefore moves an optional relative correction estimate into a clearly separate historical note.

For the parameter corollary, product contractions reduce the boundary statement to one and two copies. Convex interpolation then covers parameters from $-1/2$ to zero; nonnegative parameters have positive partial transpose. Below $-1/2$, an explicit Schmidt-rank-two vector gives a negative expectation. Two rank-two zero examples and a rank-three negative example make the boundary tangible.

## Evidence, assurance and limitations

The package includes a readable paper, complete exact inputs, a portable verifier, pinned dependencies, a supplied alternative audit, and a point-by-point referee response. The frozen release is checked from clean extraction in ordinary and optimized Python. Deliberate errors target Gram positivity, the objective and the coupled cross-term factor; successful file hashes alone cannot make those tests pass.

The supplied audit checks positivity with exact congruence witnesses and an alternative arithmetic route, but retains the author's foundation and coordinate definitions. Its authorship and human specialist credentials are not authenticated. The release therefore remains an unrefereed candidate, with no claim of independent reproduction, journal acceptance or formal verification.

The scope is exactly three copies in dimension three. Neither a general NPT bound-entanglement theorem nor an arbitrary-copy result follows. The old discovery-system correction bound is not part of the portable replay claim.

## Relationship to earlier work

Partial-trace reductions and semidefinite methods are established tools. The July 2026 two-copy papers address a different tensor-power quantifier, while the cited three-copy work treats specified sectors and formulations. The contribution claimed here is the unrestricted complex rank-two qutrit endpoint backed by the final exact certificate. The manuscript provides version-specific comparisons; the bounded literature search does not establish exhaustive priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Quantum-information researchers | Inspect a finite-copy threshold and its unrestricted rank-two encoding. | Three-copy non-distillability is not all-copy non-distillability. |
| Exact optimisation and verification researchers | Reuse small Gram witnesses, exact coordinates and semantic failure controls. | A correct arithmetic checker still depends on the written encoding bridge. |
| Interested non-specialists | See why entanglement and extractable entanglement are different questions. | Candidate publication is not established scientific consensus. |

## Why the problem matters

The distinction between entanglement and distillable entanglement is central to understanding quantum resources. A finite-copy result narrows what a fixed experiment can achieve and tests the methods needed for harder copy numbers. It does not by itself yield a quantum device, a measured practical advantage or a solution to the unrestricted problem.

## How to inspect or reproduce the recorded checks

Download the versioned ZIP from the release, extract it into a new directory, and follow `README.md`. The tested environment is Python 3.13 with the pinned packages in `certificate/requirements.txt`. Run `python -B -s verify_package.py`, then `python -B -s certificate/verify.py --output /absolute/new-directory --phase all`.

The output directory must be empty or absent. A successful complete run writes `COMPLETE_PORTABLE_EXACT_CERTIFICATE_PASS` after checking the full identity. Repeat with `python -O`, then run `check_controls.py` against each corresponding replay directory. `check_review_congruences.py` rechecks the supplied positivity witnesses without importing the certificate implementation. The GitHub workflow gives the complete command sequence.

## The most valuable next projects

1. Replay the exact package in an unaffiliated environment and retain the full receipt.
2. Independently derive the physical encoding, invariant dimensions and module basis.
3. Formalise the written-to-computational bridge in a proof assistant.
4. Investigate higher dimensions or copy numbers as new problems, without carrying over this certificate's conclusion.

## Who might contribute

Quantum-information specialists can examine the distillability criterion; representation theorists can inspect the invariant basis; exact-arithmetic and formal-methods researchers can test the verification boundary. These are proposed tasks, not endorsements or invitations sent to named researchers.

## What is in the evidence package

| File or directory | Purpose |
|---|---|
| `paper.pdf`, `paper.tex`, `paper.md` | Scientific statement, proof chain, corollary, examples and bibliography. |
| `certificate/` | All 716 final multipliers, exact coordinate data and portable verifier. |
| `check_controls.py`, `check_review_congruences.py` | Semantic error detection and exact supplied-witness rechecking. |
| `reviews/`, `RESPONSE_TO_REFEREE.md` | Original supplied report and audit, with explicit revision dispositions. |
| `HISTORICAL_CONSTRUCTION.md` | Optional construction narrative outside final replay coverage. |
| `AI_INDEX.md`, `CLAIMS.json`, `MANIFEST.sha256` | Agent-readable navigation, scope and file identities. |
| `LICENSES.md`, `PROVENANCE.md` | Component reuse terms and attribution limits. |

The versioned GitHub and Zenodo assets also include a verification report and checksums. Availability records identify published bytes; they are separate from mathematical assurance.
