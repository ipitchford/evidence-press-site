## Summary

Can changing the local field around each spin restore a conservation law that the interaction seems to forbid? Trying a few fields cannot answer that question: there are infinitely many choices, and the field can differ at every site.

This candidate removes all those field choices from a finite set of equations. If an obstruction remains, **no allowed field can restore the specified local conservation laws**. The sharpest application gives a simple dividing line for the spin-1 bilinear–biquadratic chain. Three lines in its two-parameter plane admit a conserved three-site current at zero field; elsewhere the obstruction survives every on-site field choice.

“Local” matters here. The theorem concerns sums of operators supported on short consecutive stretches, not every operator that could commute with a finite Hamiltonian. It does not prove chaos or thermalisation.

The banner depicts the three parameter lines, with both signs included. Its field arrows are schematic: the theorem allows general Hermitian on-site matrices, not only magnetic fields along the illustrated directions.

## Summary for specialists

Let $H_N=\sum_i h_{i,i+1}+\sum_i f_i$ on a periodic chain with $N\ge6$. The fixed nearest-neighbour interaction $h$ is Hermitian, swap-symmetric, has zero one-site partial traces and satisfies the manuscript's leading-rigidity hypotheses. Full traceless interaction rank is sufficient. Every $f_i$ may be an arbitrary Hermitian on-site matrix, without a norm bound.

Define $C=[h_{12},h_{23}]$ and

$$\Delta=(\pi_1\pi_3)[h_{12}+h_{23},C].$$

The quotient removes swap-odd two-site corrections and uniform field variables. Its nonzero residual excludes conserved quantities of exact contiguous range $3\le k\le\lfloor N/2\rfloor$, for **every** such chain and field configuration. A zero residual is equivalent only to a three-site quantity whose commutator has range at most two: almost-conservation is a support condition, not a small-norm estimate or general integrability.

For spin 1, put

$$B=S_x\otimes S_x+S_y\otimes S_y+S_z\otimes S_z,$$

$$h(u,v)=uB+v(B^2-4I/3).$$

Then

$$\Delta(h)=u(u-v)(u+v)W,$$

$$\|W\|_F^2=40.$$

For nonzero $h$, some field configuration admits a charge in the stated higher-range class **if and only if** $u=0$, $u=v$ or $u=-v$. Zero fields suffice on those lines; this does not classify all fields on them. Off the lines, the commutant within range at most $\lfloor N/2\rfloor$ consists of identity, energy and uniform total-spin generators commuting with every field.

## Technical account

The key operation is averaging the **local equations**, not averaging a conserved operator under a Hamiltonian whose fields break symmetry. Translation averaging and reversal reduce a qutrit calculation to 36 real correction/field variables. If the interaction has an irreducible compact-group symmetry with multiplicity-free tensor square, group averaging eliminates both correction and field variables while leaving $\Delta$ unchanged.

The local test becomes an all-range exclusion through Hokkyo's reduction theorem. The manuscript proves its interaction hypotheses at full rank and supplies exact pair-kernel certificates for the two rank-deficient BLBQ lines that full-rank reasoning would miss.

A useful example is the AKLT interaction $(u,v)=(1,1/3)$. The earlier middle-trace obstruction is zero, but

$$\|\Delta\|_F^2=40(1-1/9)^2=2560/81>0.$$

The stronger test therefore detects an interaction that the cheaper projection cannot. Two explicit non-isotropic diagonal examples similarly lie on the older test's blind hypersurfaces but have nonzero quotient certificates. Generic statements concern specified algebraic subsets, not a classification of every exceptional interaction.

## Evidence, assurance and limitations

The package contains written universal proofs, exact symbolic identities, nonzero modular minors with complementary kernel arguments, and eight runnable finite suites. A separate integer implementation checks the isotropic calculation without importing the symbolic code. This is implementation diversity within the producer workflow, not unaffiliated reproduction.

The publication revision adds portable rational witnesses. A dual functional annihilates the field/correction matrix but evaluates to one on the obstruction; a consistency vector solves the reduced equations. A small checker verifies either by exact multiplication. These witnesses establish finite linear identities, not all the hypotheses or the complete proof.

The supplied review prompted clearer predecessor comparisons, line terminology, author metadata and witness output. It is not authenticated external peer review. The manuscript is unrefereed and unformalised. No result here excludes quasilocal tails, charges beyond the range bound, or approximate low-energy integrability. It does not establish thermalisation, ETH or spectral chaos.

## Relationship to earlier work

The zero-field BLBQ classification is established background, including work by Park–Lee and Hokkyo–Yamaguchi–Chiba. The latter also treats uniform uniaxial anisotropic fields and other symmetry-restricted models. Shiraishi–Yamaguchi's isotropic dichotomy already constrains corrections using symmetry.

The additional question here is whether **arbitrary, independently chosen on-site matrices** can evade the interaction-level obstruction. The affine-equation averaging argument addresses that field quantifier. Hokkyo's all-range reduction remains an explicit dependency, not a theorem newly proved by the software.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical physicists | Test a proposed local conservation law or audit the uniform-field exclusion argument | Check leading rigidity and the exact range convention |
| Quantum-model builders | Determine whether on-site field engineering can evade a specified interaction obstruction | Absence of these charges is not an experimental prediction of thermalisation |
| Computer-algebra and verification researchers | Reuse finite rational quotient witnesses and exact rank certificates | Matrix construction and the semantic bridge remain trusted components |

## Why the problem matters

Conservation laws can strongly constrain a quantum system. A failed search for one is weak evidence: a different field or a less obvious shorter-range correction might restore it. A field-uniform obstruction replaces that open-ended search by a finite, inspectable mathematical condition within an explicit domain.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md`, the theorem statements and `ASSURANCE.md` in the linked repository. Check the archive manifest **before** replay: some tests regenerate timing-bearing reports. Install the pinned SymPy dependency, then run:

```sh
python -B verify.py
python certify_field_uniform.py evidence/AKLT_input.json --witness result.json
python portable_witness.py result.json evidence/AKLT_input.json
python -OO -B publication_controls.py
```

The eight-suite local run took about 31 seconds in the recorded environment; this is not a cross-machine benchmark. The final release receipt binds clean-extraction replay and Linux CI to the immutable archive. Assertion-based legacy suites refuse optimized Python so that dropped assertions cannot generate a false pass.

## The most valuable next projects

An unaffiliated audit of the affine averaging and imported reduction hypotheses would most improve assurance. A separately written quotient constructor would test the semantic encoding more strongly than replaying the same module. Mathematically, multiplicity-bearing representations and further deficient interactions are natural extensions—but none is included in this classification.

## What is in the evidence package

| Item | Purpose |
|---|---|
| Manuscript PDF and TeX | Definitions, quantified theorems, arguments and genuine references |
| Exact algebra and certificate data | Isotropic factorisation, pair kernels and blind-family witnesses |
| Certifier and portable-witness checker | Recomputable decisions and separately checkable finite identities |
| AI index, claim ledger and source audit | Scope, dependencies, antecedents and safe reuse |
| Revision response, replay receipt and checksums | Review actions, exact-version execution and byte identity |

Original prose and data are CC0-1.0; original code is MIT. Preserved third-party records retain their own terms.
