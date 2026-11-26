## Summary

**The everyday picture.** Take a long chain of quantum particles in its lowest-energy state and cut it in half. Each
half is entangled with the other, so on its own it is not in its own lowest-energy state: it holds some extra energy.
Clever operations on that half alone can pull most of the extra energy out as useful work, but not all of it. The part
that can never be pulled out is called the *bound energy*. It measures how much energy entanglement locks away.

**What was known.** In 2023 Mula and colleagues computed the bound energy for the simplest critical chain, electrons
hopping freely between neighbouring sites. They found that it scales like the square of the entanglement entropy
divided by the length of the chain, with a specific number in front, and they conjectured the same law for critical
chains in general. Later work saw the law in other chains and one exception, but no form of the conjecture had been
proved.

**What is new.**

1. **The law is proved, with its exact coefficient.** For a broad model of critical systems (boundary conformal field
   theory) and directly for two lattice chains, the hopping chain and the critical Ising chain, the bound energy is
   (3v / 2πc) × S² / L, where S is the entanglement entropy, L the length of the half, v the speed of excitations and
   c the central charge. The number in front is therefore not universal: at equal speed the Ising chain gives twice
   the hopping value.
2. **The broadest form of the conjecture is false.** A whole family of chains share exactly the same critical ground
   state, yet their bound energies scale with different powers of the length. The rule: the bound energy is set by
   the flattest gapless point of the cut-off half's own energy band. The familiar law holds exactly when the band
   crosses the Fermi level with nonzero speed and touches zero nowhere else.
3. **What you are allowed to do matters.** In one simple chain, allowing any operation, only operations that conserve
   the number of particles, or only single-particle rotations leaves three different amounts of locked energy, each
   with a different power of the length. The first gap is already large at small sizes: the number-conserving
   remainder is at least about 20 times the unrestricted one at 16 sites and about 1,360 times at 4,096 sites.

**Same quantum state, different locked-in energy: the cut-off half's own energy bands decide.**

## Summary for specialists

Let ρ_L be the reduced state of the left half (length L) of the ground state of a chain of N = 2L sites, H_L the block
Hamiltonian with the terms crossing the cut removed, and Q_L the bound (residual) energy: the passive energy of ρ_L
under H_L above the block ground energy, minimised over all unitaries on the block. Q_L^ch and Q_L^G are the minima
over particle-number-conserving unitaries and over number-conserving one-body rotations. S_L is the entanglement
entropy.

- **Rank matching (Lemma 1).** Under stated hypotheses, Q_L equals to leading order the energy of the block's thermal
  state whose entropy equals S_L.
- **Conformal law (Theorems 3–4, Corollary 5).** For a regulated boundary conformal field theory,
  Q_L ~ 3v S_L² / (2π c L), whatever boundary condition the entanglement cut carries. In rational CFTs the next term is
  fixed by the boundary entropy of the physical termination, and the passive state converges to the strip's thermal
  state in relative entropy.
- **One ground state, many Hamiltonians (Theorem 6, Corollaries 7–8).** For every sign-preserving polynomial f, the
  free-fermion chain with one-particle Hamiltonian f(T) has the hopping chain's ground state, S_L = (1/6) log L + O(1),
  and Q_L ~ D(m, A) S_L^(m+1) / L^m, where m is the largest order of a zero of the dispersion. For f(x) = x^z with odd
  z, D_1 = 3/π and D_3 = 11.2023…. The ratio L Q_L / S_L² has a positive finite limit if and only if f′(0) ≠ 0 and f has
  no other zero on [−2, 2]; the limit is then 3v/(2π) with v = 2|f′(0)|.
- **Critical Ising chain (Corollary 9).** N Q_I / S_I² → 12/π, against 6/π for unit hopping (slopes 6/π and 3/π in
  units of L); both chains have v = 2, with c = 1/2 and c = 1.
- **Crossover (Theorem 10).** A linear term added to a flat dispersion restores the S²/L law through an explicit
  crossover function.
- **Control classes (Theorems 11 and 13, Corollaries 12 and 14).** One-body rotations can leave strictly more energy
  than general unitaries (limiting ratio about 2.148 for the cubic chain); charge conservation costs nothing at leading
  order for f(x) = x^z; in the range-three chain f(x) = x(x − 3/2)², Q_L, Q_L^ch and Q_L^G are of orders
  (log L)³/L², (log L)/L and (log L)²/L.

In terms of the three forms of the conjecture of Mula et al.: "all critical states" is false; "critical states
described by a conformal field theory" is proved for regulated CFT spectra and for the open hopping and critical Ising
chains, and remains open for interacting lattice chains; the slope 6/π holds for unit hopping only, the general slope
being 3v/(πc) in units of N.

## Technical account

**The isentropic rule.** The passive state reorders the block's Schmidt probabilities onto its energy levels, most
probable state on the ground state. The rank-matching lemma shows that, to leading order, this leaves the energy of
the block's own thermal state at the temperature where its entropy equals S_L. Every proof reduces to two tasks:
counting how many block levels lie below a given energy, and showing that rare, improbable Schmidt ranks contribute
nothing at leading order.

**Conformal model.** In a regulated boundary CFT both spectra have Cardy-type level counts, so the count of levels up to
dimension H grows like exp(2√(K H)). Only the physical strip's constant K_p enters the coefficient, which gives
3v/(2πc) for a vacuum-dominated CFT; the entanglement boundary condition affects S_L but not the relation between Q_L
and S_L.

**Lattice chains.** For the free-fermion family the ground state, and hence every Schmidt probability, is the same for
all sign-preserving f. What changes is the block's own one-particle spectrum, the compression of f(T) to the half. Near
a zero of order m the levels are spaced like (k/L)^m, so the level count, and with it the bound energy, picks up the
power S^(m+1)/L^m. The entanglement side uses one external input, the boundary Rényi asymptotics of the open hopping
chain (Fagotti and Calabrese, resting on Deift, Its and Krasovsky). The Ising chain follows through its exact relation
to free fermions.

**Restricted controls.** Number-conserving operations must leave the forced particles and holes in each charge sector
in place; when one side of the Fermi level is much softer than the other (a one-sided touching in the range-three
chain), that forced cost changes the power of L. One-body rotations pair single-particle occupations with
single-particle energies, which is the quantity Mula et al. computed; for unit hopping it agrees with the unrestricted
optimum at leading order.

**Known and new.** The conjecture and the free-fermion formula are due to Mula et al. Mitra and Srivastava observed the
law beyond conformal symmetry in a long-range Kitaev chain and a clear deviation only for all-to-all pairing. Hartmann,
Kavanagh and Vandoren showed that odd Lifshitz dispersions share the hopping chain's ground-state entanglement. New here
are the proofs, the exact coefficients, the dispersion rule with its if-and-only-if condition, the crossover and the
separation of control classes.

## Evidence, assurance and limitations

- **Written proofs.** All theorems rest on written proofs in the paper (20 pages).
- **Computational checks.** Ten scripts reproduce every number in Sections 3–8: complete Fock-space orderings and
  direct many-body checks for small chains, an interval-arithmetic certificate of an ordering inversion at five sites,
  Ising spin and Majorana calculations, exact Ising boundary-character counts, the crossover quadrature, a check of the
  pressure constants and quoted coefficients, and a finite-size table up to L = 4,096. They check finite-size values,
  constants and identities; they do not certify the asymptotic theorems.
- **Slow convergence.** All coefficients are limits as L grows, and some are approached only logarithmically. For the
  cubic chain at L = 4,096, L³Q_L/S_L⁴ is 36.3 against the limit 11.2, and the one-body penalty Q_L^G/Q_L is 1.096
  against its limit 2.148. The charge-conservation separation in the range-three chain, by contrast, is visible at once.
- **Assurance.** Internal AI-assisted review only: a Claude review panel (editor, domain, perspective and devil's
  advocate roles), a methodology review with a line-by-line proof audit and independent code, a clean replay, one
  revision round with extensions, and a re-review with a proof audit of the new proofs. No mathematical error was
  found; remaining minor items were applied before release. No Astra or Codex second-model review took place. This is
  not peer review, independent reproduction or formal verification.
- **Scope.** Free-fermion lattice chains and an idealised conformal model only; interacting chains such as the
  Heisenberg chain remain open. The lattice proofs use one known external input (boundary Rényi asymptotics of the open
  hopping chain). The optimal operations are idealised, with no limit on circuit depth, locality or duration.
- **Status.** Unrefereed research candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Quantum thermodynamics researchers | Exact laws for the work that entanglement makes unavailable to any operation on a block, and how conservation laws change it | Idealised unlimited coherent control; asymptotic in L |
| Many-body and conformal field theorists | A proved link between entanglement spectrum and block energy spectrum through an isentropic rule; a test of which data fix the bound energy | Regulated CFT spectra are a model of the reduced state; interacting lattice chains open |
| Cold-atom and quantum-simulation theorists | Which quantity applies when particle number is conserved, and when conservation changes the scaling | Free-fermion chains only; some constants converge slowly at accessible sizes |

## Why the problem matters

The bound energy ties together two descriptions of the same block: its entanglement spectrum and its physical energy
spectrum. It has been proposed as a thermodynamic probe of criticality. The results show what such a probe actually
measures: not criticality of the ground state as such, but the low-energy level density of the isolated block at the
temperature fixed by its entanglement, and the constraints placed on the operations.

## How to inspect or reproduce the recorded checks

Download the archive from Zenodo (DOI [10.5281/zenodo.24553557](https://doi.org/10.5281/zenodo.24553557)) or the
[GitHub release](https://github.com/ipitchford/critical-chain-bound-energy/releases/tag/v0.1.0-candidate). From the
package root, in a copy (the scripts rewrite `results/` and `figures/`):

```sh
export OPENBLAS_NUM_THREADS=1 MPLBACKEND=Agg
U="uv run --python 3.12 --with numpy==2.3.5 --with scipy==1.17.0 --with mpmath==1.3.0 --with matplotlib==3.10.8 python3 -I -B -O"
$U code/check_passive_fermi.py > results/passive_fermi.csv
$U code/general_dispersion_check.py > results/general_dispersion.csv
$U code/finite_size.py > results/finite_size.csv
```

`README.md` lists all ten commands. Every script stops with "CHECK FAILED" and exit status 1 if a check fails, also under
`python -O`; the whole set takes about a minute. GitHub CI on Linux reruns them, compares the exact certificate and
integer counts byte for byte and the floating-point outputs within declared relative tolerances (1e-6; 1e-3 for the finite-size table, documented in
`ENVIRONMENT.txt`), and runs a negative control. This is a replay by the producer, not an independent reproduction.

## The most valuable next projects

1. Prove the conformal law for an interacting lattice chain such as the Heisenberg chain. This needs control of the
   number of block levels up to conformal dimensions of order (log L)² and of the rare Schmidt ranks.
2. Realise a lattice termination with a different boundary condition at the cut and test the boundary correction
   beyond the continuum model.
3. Compute the corrections that govern the slow convergence in the finite-size table.
4. Find the bound energy when the allowed operations have limited depth or locality, connecting these limits to
   protocols that can be carried out.

## What is in the evidence package

| File | What it is |
|---|---|
| `manuscript.pdf` | The paper (20 pages); source `manuscript.tex`, figures in `figures/` |
| `code/check_passive_fermi.py`, `code/check_asymmetric_touch.py` | Small-chain Fock-space and many-body checks; the range-three chain under three control classes |
| `code/certify_five_sites.py` | Interval-arithmetic certificate at five sites |
| `code/check_boundary_characters.py`, `code/reproduce_ising.py`, `code/ising_mesoscopic.py` | Ising boundary counts and Ising spin and Majorana calculations |
| `code/crossover.py`, `code/dispersion.py` | Crossover quadrature and the two figures |
| `code/general_dispersion_check.py`, `code/finite_size.py` | Pressure constants and quoted coefficients; finite-size table to L = 4,096 |
| `results/`, `tools/compare_results.py` | Recorded outputs; comparator with the declared tolerance |
| `README.md`, `AI_INDEX.md` | Plain-English overview; machine-oriented map of claims and evidence |
| `REVIEW_SUMMARY.md`, `RESEARCH_GATES.json` | Internal review summary; prior-art and limitation record |
| `REPLAY_RECEIPT.md`, `ENVIRONMENT.txt`, `.github/workflows/replay.yml` | Replay record, environment and CI |
| `refs.bib`, `CITATION.cff`, `LICENSE.md`, `MANIFEST.sha256` | Bibliography, citation, licences (text CC0-1.0, code MIT), hashes |
