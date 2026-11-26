## Summary

**The problem.** On 25 November 2026 Venkatesa Chandrasekaran posted a proposal for a quantum theory of gravity
built on light cones (arXiv:2611.34924). It uses a *gravitational clock*: how long light takes, along a light cone, to
reach a given area. The clock is used to carve out a finite set of quantum states for a region of spacetime, a causal
diamond, and from that set the proposal obtains the region's entropy. This only works if the clock is a genuine
quantum observable, a self-adjoint operator whose spectrum can be cut off at a given time.

**Why it is delicate.** The clock is the exponential of a squared quantum field, integrated over an interval with sharp
ends. Expressions of that kind are exactly where the infinities of quantum field theory appear. Helfer showed in the
1990s that quadratic Hamiltonians of free quantum fields can fail to be operators, fail to be bounded below, and
generate evolutions that cannot be implemented on the usual state space. Energy inequalities are known to need smooth
averaging, and Bak and colleagues showed that vacuum fluctuations of gravity add to the focusing of light.

**What is new.** In the one sector where everything can be computed, small gravitational waves on a round light cone,
quantised in a natural Fock realisation compatible with the proposal's short-distance behaviour, the three standard
ways of defining the clock each fail, for different reasons:

1. **Weyl ordering** (the proposal's own choice) gives a clock whose zero-point value grows like the square of the
   number of modes kept; without a cut-off it is infinite on every state.
2. **Normal ordering** removes that growth but leaves a ground value that falls without bound, and the result is not an
   operator on states with finitely many gravitons.
3. **Wick ordering of the whole exponential**, the most favourable choice, gives a positive clock with exactly the
   right vacuum reading, 0.9 in units where the classical value is 1 − ε with ε = 0.1. Even so it defines no operator:
   the quadratic form is not closable, and every closable form below it is zero. States arbitrarily close to any given
   state read almost zero.

The paper also finds the exact constants in the state counting the proposal uses, and shows that the cost function
used for that counting is unbounded below on Fock space. Four separate mechanisms are identified: local roughness of
the field, the sharp ends of the clock's window, a pinned amplitude at the cap of the cone, and the growth in the
number of angular modes.

**Three ways to define the gravitational clock; none gives an operator, in the sector where everything can be
computed.**

## Summary for specialists

Setting: the source's past light cone, generators from a cap at v = ε to the corner at v = 1; the focusing integral
Ξ is quadratic in the shear and the clock is u = ∫_ε^1 e^{Ξ(v)} dv. In the linearised radiative sector about a round
cone each generator carries a chiral boson on an interval. With K radial modes, ε = 0.1 and s_p = 1 unless stated:

- **Theorem A (every Gaussian state).** Every Gaussian measure obeying the uncertainty relation, in particular the
  Wigner measure of every quasi-free state, gives probability one to shear configurations on which Ξ is infinite on
  every subinterval. Without a regulator the Weyl-ordered focusing form is +∞ on every state whose smeared focusing
  fields have second moments (Proposition 5.1).
- **Theorem B (Weyl ordering).** The lowest eigenvalue of the Weyl-ordered focusing operator on [a, b] is
  π² ln(b/a) K² / (2 s_p (1 − ε)²) · (1 + O(K^{−1/4})); on the whole generator the K² coefficient is 14.03 at ε = 0.1.
- **Theorem C (normal ordering).** The ground value on the whole generator lies between −C₁K − C₂ ln K and −cK; the
  normal-ordered form is not an operator on finite-particle vectors, and for large K no finite-particle vector lies in
  the form domain of the exponential of the total focusing operator.
- **Proposition 6.5 (smooth windows).** Smoothing the window removes the end-point pair kernel but not the pinned cap
  amplitude: the smoothed pair kernel is still not Hilbert–Schmidt.
- **Theorem D (Wick ordering, central result).** The Wick-ordered clock form is positive with vacuum value 1 − ε, is not
  closable, and every closable form below it is zero.
- **Theorems E and F (cap cost).** The one-particle counting function is N(E) = (1 − ε³) E³ / (1152 π⁷) + O(E^{5/2}),
  and the number of occupation-number configurations of cost at most Q* obeys
  log D = (4/3) [(1 − ε³)/(5760 π³)]^{1/4} (s Q*)^{3/4} (1 + o(1)); the coefficient is 0.0648 at ε = 0.1. These depend
  only on the classical cost and the symplectic form.
- **Theorem G (angular obstruction).** Summed over tensor harmonics the normal-ordered cap cost is unbounded below on
  Fock space, at least a multiple of J⁴ at angular cutoff J, and at every sufficiently large fixed radial cutoff the
  Bogoliubov transformation that diagonalises it is not unitarily implementable. With all radial modes this is open.
- **Proposition 10.1 (joint limit).** If K²/s_p → λ the classical clock reading tends to (ε^{−d} − ε)/(d + 1); at
  λ = 0.1 this is 2.74 times the classical value, against the end-point factor 4.07.

So the three natural prescriptions fail to provide the clock the construction requires, with the domain and properties
it uses. This is not a claim that no clock can exist, and it does not show that the full non-linear theory fails.

## Technical account

**The model.** The source's symplectic form gives, on each generator, a commutator [x(v), x(v′)] = iπ sgn(v − v′)/s_p
for the shear variable, so the shear is a chiral boson on [ε, 1] with sine modes. The focusing integral becomes a
quadratic expression Σ (A_nm a†_n a_m + B_nm a_n a_m + h.c.) in the mode operators. Everything turns on two kernels:
A, the number-conserving part, and B, the pair-creation part.

**Where each ordering breaks.** Weyl ordering keeps the zero-point term ½ Tr A, which grows like K². Normal ordering
removes it, but the sharp ends of the window make B decay too slowly to be Hilbert–Schmidt, so the normal-ordered
ground value is of order −K (Theorem C(iii) bounds it from both sides) and the form is not an operator on any domain
containing the vacuum. This is the phenomenon Helfer identified for quadratic Hamiltonians of linear fields
(Helfer 1996, 1999), here with explicit rates. Wick ordering the whole exponential gives e^X Γ(1 + A) e^{X†}, which is
manifestly positive with no zero-point constant; but the same non-Hilbert–Schmidt pair kernel lets one build a null
sequence of two-particle vectors along which the form stays bounded away from zero, which is what non-closability
means. The positive form therefore belongs to no operator.

**Four mechanisms.** Local roughness (A, B) comes from the canonical commutator at short distance and holds in every
representation. The sharp window ends drive C and D. Smoothing the window removes those ends, but the amplitude pinned
at the cap still leaves a non-Hilbert–Schmidt pair kernel (Proposition 6.5). The angular sum drives Theorem G.

**Known and new.** The mechanisms behind Theorems C and G are Helfer's (1996, 1999) and Torre and Varadarajan's
(1999); they are credited in the paper, which supplies the constants in this setting. Freidel and Kirklin (2026)
define composite observables on a null ray by covariant normal ordering; if their dressing time and vacuum are
identified with those of this model, their prescription applied to e^Ξ is the Wick-ordered clock of Theorem D, but the
paper does not show that this identification holds. New here are the four theorems on the three orderings in the
source's setting, the exact counting constants, the angular obstruction and the separation of mechanisms.

## Evidence, assurance and limitations

- **Written proofs.** All theorems and propositions rest on written proofs in the paper (51 pages).
- **Computational checks.** One script per group of results computes the constants and finite-K values (for example
  the Weyl coefficient 14.03, the Wick vacuum reading 0.9 = 1 − ε to twelve digits, the Weyl-law constant
  (1 − ε³)/(1152 π⁷), the log D coefficient 0.0648, the joint-limit ratio 2.74). Every check exits with status 1 on
  failure, also under `python -O`. The computations test constants and finite truncations; they do not certify the
  theorems.
- **Assurance.** A Claude review panel and proof audit, one revision round, and a Claude re-review, plus one
  AI-assisted cross-model review with Astra (gpt-6.2-astra) whose points were checked against the proofs and applied.
  No mathematical error was found. This is not peer review, independent reproduction or formal verification.
- **Scope.** Linearised sector only, in one natural realisation compatible with the proposal's short-distance
  behaviour; the proposal itself allows other Gaussian widths and does not force this choice. Theorems A and B (without
  a regulator) and the counting constants do not depend on the choice. The results do not show that the full
  non-linear construction fails, and not every self-adjoint realisation is excluded.
- **Open.** Theorem G holds at fixed radial cutoff; with all radial modes non-implementability is supported
  numerically but not proved.
- **Status.** Unrefereed research candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers building quantum gravity on null surfaces | A checklist of ultraviolet obstructions any clock or state-counting construction must overcome, with explicit rates | Linearised sector, one natural realisation; does not show the full construction fails |
| Mathematical physicists working on quadratic forms and Bogoliubov transformations | Explicit non-closable positive forms and non-implementable diagonalisations in a geometric setting | Constants are for this model; continuum Theorem G open |
| Readers of the null-cone proposal | Which step of the clock and counting argument needs repair, and why | Unrefereed candidate posted one day after the proposal |

## Why the problem matters

Counting states of a region of spacetime is one route to explaining black-hole and diamond entropy from first
principles. The null-cone proposal makes that count depend on two spectral objects, a clock and a cost. If either is
not an operator, the count is not yet defined. The results locate the difficulty precisely: not in the classical
geometry but in the short-distance behaviour of the quantised shear, through four separable mechanisms, each of which a
completion of the construction has to address.

## How to inspect or reproduce the recorded checks

Download the archive from Zenodo (DOI [10.5281/zenodo.24563185](https://doi.org/10.5281/zenodo.24563185)) or the
[GitHub release](https://github.com/ipitchford/null-cone-clock-uv-obstructions/releases/tag/v0.1.0-candidate). From the
package root, in a copy (the scripts rewrite `logs/` and the figure):

```sh
U="uv run --python 3.13 --with numpy==2.5.3 --with scipy==1.18.1 --with matplotlib==3.11.2"
$U python3 -O test_all.py         # 16 checks, about 30 seconds
$U python3 -O check_revision.py   # 15 checks, about a minute
$U bash run_all.sh --full         # every log and the figure, about 10-20 minutes
```

Every check stops with "FAIL" and exit status 1 if it fails, also under `python -O`. GitHub CI on Linux reruns the two
fast suites, compares `logs/revision.json` within a declared relative tolerance of 1e-6 (documented in
`ENVIRONMENT.txt`), and runs a negative control. This is a replay by the producer, not an independent reproduction.

## The most valuable next projects

1. Prove non-implementability in Theorem G with all radial modes kept, or find the representation in which the cap
   cost is implementable.
2. Determine the vacuum that Freidel and Kirklin's covariant normal ordering selects on the segment [ε, 1] in this
   model, and whether Theorem D applies to it.
3. Find a renormalised clock, or a different window, that is a self-adjoint operator and still selects a
   finite-dimensional diamond space.
4. Test whether any of the four mechanisms survives in the non-linear theory, starting from the conditional extension
   in Section 8.

## What is in the evidence package

| File | What it is |
|---|---|
| `uv-obstructions.pdf` | The paper (51 pages); source `uv-obstructions.tex`, Markdown `uv-obstructions.md`, Figure 2 in `figure.pdf` |
| `modes.py`, `qcost.py`, `fock.py` | Mode functions and kernels; cap cost and frequency solver; truncated Fock space and the Wick-ordered clock |
| `check_kernels.py` … `check_sensitivity.py` | One script per group of results (Appendix D) |
| `check_revision.py`, `test_all.py` | Theorem C(iii), Propositions 6.5 and 10.1 and convergence diagnostics; 16 automated checks |
| `run_all.sh`, `logs/` | Regenerates every log and the figure; recorded outputs |
| `README.md`, `AI_INDEX.md` | Plain-English overview; machine-oriented map of claims and evidence |
| `REVIEW_SUMMARY.md`, `RESEARCH_GATES.json` | Internal review summary; prior-art and limitation record |
| `REPLAY_RECEIPT.md`, `ENVIRONMENT.txt`, `.github/workflows/replay.yml`, `tools/compare_json.py` | Replay record, environment, CI and comparator |
| `refs.bib`, `CITATION.cff`, `LICENSE.md`, `MANIFEST.sha256` | Bibliography, citation, licences (text CC0-1.0, code MIT), hashes |
