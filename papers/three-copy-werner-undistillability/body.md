## Summary

This page explains, in order: what entanglement distillation is, why Werner states are the test case, what was already known for one and two copies, what this release proves for three copies, and what has and has not been checked.

**What distillation is.** Entangled pairs of quantum systems, shared between two laboratories, are a quantum resource. Real entangled pairs are noisy. *Distillation* is the process of taking many noisy pairs and, using only local operations and ordinary communication, turning them into fewer, nearly perfect ones. A puzzling feature of quantum theory is that some states are entangled and yet cannot be distilled at all: the entanglement exists but is locked away. Entanglement and *extractable* entanglement are different questions.

**Why Werner states.** Werner states are a one-parameter family of highly symmetric states, $\rho(3,\alpha)=(I+\alpha F)/(9+3\alpha)$ for two three-level systems (qutrits), where $F$ swaps the two systems and $-1\le\alpha\le1$. The boundary state studied here cannot be distilled from a single copy. The finite-copy question is whether holding several copies at once can unlock distillable entanglement that one copy does not give. Recent preprints from July 2026 report the sharp answer for two copies.

**What was found.** For three copies, the answer is a sharp threshold at $\alpha=-1/2$. Below that value, three copies can be distilled; at or above it, they cannot. The hard part is the boundary state $\rho=(2I-F)/15$, at $\alpha=-1/2$. Showing that three copies of it are undistillable means proving that a certain quadratic expression is never negative for *any* complex $27\times27$ matrix of rank at most two, with no simplifying assumptions. The release does this with an exact rational certificate: 716 positive semidefinite multipliers that add up, with valid linear identities, to the expression exactly.

**What it does not settle.** The result covers exactly three copies in local dimension three. It does not settle what happens with four or arbitrarily many copies, and it does not resolve the general question of undistillable entanglement with a negative partial transpose.

**Status.** A computer-assisted mathematical candidate: an unrefereed candidate publication, not journal peer review. The exact certificate is replayed from a clean extraction and was checked again by a supplied alternative audit, whose authorship and human specialist credentials are not authenticated. No proof-assistant formalisation exists.

## Summary for specialists

For $\rho=(2I-F)/15$ on $\mathbb C^3\otimes\mathbb C^3$, version 1.1.0-candidate proves (Theorem 1)

$$
\langle\psi|(\rho^\Gamma)^{\otimes3}|\psi\rangle\ge0\qquad\text{for every }\operatorname{SR}(\psi)\le2.
$$

Equivalently, for every complex $27\times27$ matrix $C$ of rank at most two,

$$
q_3(C)=\|C\|_F^2-\frac12\sum_i\|\operatorname{Tr}_iC\|_F^2+\frac14\sum_{i<j}\|\operatorname{Tr}_{ij}C\|_F^2-\frac18|\operatorname{Tr}C|^2\ge0.
$$

The partial traces contract corresponding row and column indices of $C$; they are not partial traces of $CC^*$. There is no normality, Hermitian or common-plane support assumption. In the physical family $\rho(3,\alpha)=(I+\alpha F)/(9+3\alpha)$, $-1\le\alpha\le1$, the corollary gives three-copy distillability exactly when $\alpha<-1/2$.

| Result | Where | Status |
|---|---|---|
| Physical lifting: the expectation equals $8q_3(C)/3375$, and every rank-at-most-two input factors through a $27\times2$ isometry | Lemma 2 | proof |
| Three matched moment operators with bosonic supports, conditional contrasts and common-marginal equalities | Lemma 3 | proof |
| Whole-replica partial transposes and a coupled quartic Gram map are positive on every physical tuple | Lemma 4 | proof |
| Symmetry averaging keeps every complex input; complete rational source space of dimension $577+1220+577=2374$ | Lemma 5 | proof with exact finite checks |
| $c=\sum_{t=1}^{716}\ell_t+E^T\lambda$ exactly on all 2,374 coordinates | Proposition 6 | exact rational certificate |
| Three-copy distillable iff $\alpha<-1/2$ | Corollary 7 | proof |
| Sharp boundary and rank restriction: two rank-two zero examples, and $q_3(I_3\otimes E_{00}\otimes E_{00})=-3/8$ at rank three | Example 8 | exact calculation |

## Technical account

**Reduction to a matrix inequality.** The written proof first identifies the physical expectation as $8q_3(C)/3375$. A rank-two parametrisation, using a $27\times2$ isometry and an auxiliary qubit, writes $q_3(C)$ as the expectation of a swap-type operator on two unit vectors, and then expresses the problem in invariant coordinates.

**Positivity constraints.** Three matched moment operators built from those vectors satisfy exact equalities and are positive under every partial transpose used, and under a coupled quartic Gram map. Exact local moment matrices are therefore positive semidefinite on every feasible input. Averaging over local unitaries, site permutations and complex conjugation preserves every constraint while reducing all coordinates to a complete rational basis; this step does not assume that $C$ was real.

**The certificate.** The final certificate combines 716 PSD multipliers (652 source and 64 coupled) with 272 selected linear identities to recover the objective exactly. All 2,374 residual coordinates vanish. Positivity is checked in exact integer arithmetic through characteristic-polynomial signs, with no floating tolerances. The proof needs exact positivity and the final identity, rather than the historical optimisation run that discovered the multipliers. The revised manuscript therefore moves an optional relative correction estimate into a clearly separate historical note.

**The parameter corollary.** Product contractions reduce the boundary statement to one and two copies. Convex interpolation then covers parameters from $-1/2$ to zero; nonnegative parameters have positive partial transpose. Below $-1/2$, an explicit Schmidt-rank-two vector gives a negative expectation, $2+4\alpha<0$. Two rank-two zero examples and a rank-three negative example make the boundary tangible. The supplied referee audit proposed this corollary; the manuscript checks its normalisation and rank-preserving contractions explicitly.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/three-copy-werner-undistillability.txt) is available for reading.

- **Package and replay.** The package includes a readable paper, complete exact inputs, a portable verifier, pinned dependencies, a supplied alternative audit, and a point-by-point referee response. The frozen release is checked from clean extraction in ordinary and optimized Python.
- **Negative controls.** Deliberate errors target Gram positivity, the objective and the coupled cross-term factor; successful file hashes alone cannot make those tests pass.
- **Supplied audit.** The supplied audit checks positivity with exact congruence witnesses and an alternative arithmetic route, but retains the author's foundation and coordinate definitions. Its authorship and human specialist credentials are not authenticated. The release therefore remains an unrefereed candidate, with no claim of independent reproduction, journal acceptance or formal verification.
- **Scope.** The scope is exactly three copies in dimension three. Neither a general NPT bound-entanglement theorem nor an arbitrary-copy result follows. The old discovery-system correction bound is not part of the portable replay claim.

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

Download the versioned ZIP from the release, extract it into a new directory, and follow `README.md`. The README asks for Python 3.11 or later on Linux or macOS; the tested environment is Python 3.13 with the pinned packages in `certificate/requirements.txt`. Reserve one CPU thread and about 2.5 GB of RAM. First run `python -B -s verify_package.py`, then, with new empty output directories:

```sh
python -B -s /absolute/package/certificate/verify.py --output /absolute/new-normal --phase all --max-seconds 1200
python -O -B -s /absolute/package/certificate/verify.py --output /absolute/new-optimized --phase all --max-seconds 1200
python -B -s /absolute/package/check_controls.py --replay /absolute/new-normal
python -O -B -s /absolute/package/check_controls.py --replay /absolute/new-optimized
python -B -s /absolute/package/check_review_congruences.py
```

A successful complete run writes `COMPLETE_PORTABLE_EXACT_CERTIFICATE_PASS` after checking all 716 PSD multipliers and a zero exact residual in all 2,374 coordinates. A small residual, partial receipts or a resumed run is not a fresh independent replay. The original endpoint replay took about 139 seconds; runtime depends on the host. `check_review_congruences.py` rechecks the supplied positivity witnesses without importing the certificate implementation. The GitHub workflow gives the complete command sequence.

To read the mathematics, start with the Statement and Section 1 of the paper (the reduction to $q_3$), then Section 5 for the certificate identity and Section 7 for the parameter threshold. `AI_INDEX.md` maps each claim to its evidence.

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

The versioned GitHub and Zenodo assets also include a verification report and checksums. Availability records identify published bytes; they are separate from mathematical assurance. Original prose and data are CC0 and original code is MIT; supplied review files retain their own terms.
