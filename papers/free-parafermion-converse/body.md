## Summary

A model can have many interacting terms yet a surprisingly simple spectrum. In a free-parafermion spectrum, every eigenvalue comes from one short list of modes, combined with roots of unity. The hard question is not whether a few eigenvalues fit this pattern, but whether the **whole spectrum, with its multiplicities**, does.

This candidate gives an exact graph criterion under explicit algebraic assumptions, for every local order $N\ge3$. Earlier work supplied a class of graphs that guarantees free spectra. The new claim is a converse: in the canonical model considered here, no other graph works generically. Exceptional choices of coupling constants can still work.

The distinction between the whole spectrum and separate symmetry sectors is essential. Several individually simple sectors need not combine into a single free spectrum.

## Summary for specialists

Let $q=e^{2\pi i/N}$, with $N\ge3$, and let the independent generators of the universal Weyl graph algebra satisfy $u_i^N=1$ and $u_i u_j=q^{B_{ij}}u_j u_i$, where $B_{ij}\in\{0,1,-1\}$. For $H=\sum_i b_i u_i$ with independent complex couplings, canonical full-spectrum freeness is equivalent to the oriented graph being an oriented indifference graph. It is enough that freeness hold Zariski-generically, on a real open set, or on a real positive-measure set; in that graph class it holds at every complex coupling.

The formulation requires one global occupation-mode list and canonical algebraic multiplicities. Outside the class, the free-coupling locus is a proper complex algebraic set; its real part has measure zero. The paper also proves cubic-time recognition of switching into this graph class and transfers the converse to physical Weyl labels when their label map is injective over $\mathbb Z_N$.

## Technical account

The free pattern has the form

$$E_{x_1,\ldots,x_\alpha}=\sum_{j=1}^{\alpha}q^{x_j}\varepsilon_j,$$

where each occupation index runs from $0$ to $N-1$,

with the specified canonical replication. Here $n$ counts Hamiltonian terms, $N$ is their order, and $\alpha$ is the graph independence number. None of these is interchangeable with the number of physical qudits.

The proof first makes the free locus algebraic and shows that the property passes to induced subgraphs. It then excludes two obstructions:

- **A fork:** for three terms with a common source or sink, the relevant mode invariant is $E_3=\kappa_N b_1^N b_2^N b_3^N$, with $\kappa_N\ne0$ for $N\ge3$. The fork is free exactly when $b_1b_2b_3=0$. At order four, $\kappa_4=-6/691$.
- **A directed cycle:** the central-sector splitting argument gives at least $N^{\lfloor n/2\rfloor}+N-1$ distinct eigenvalues generically, exceeding the free bound $N^{\lfloor n/2\rfloor}$.

![A same-direction fork and a directed cycle obstruct generic canonical freeness. The cycle has at least N minus one more distinct eigenvalues than the free bound.](/assets/art/free-parafermion-converse-obstructions.svg)

*Two ways the global pattern fails. These are schematic graph obstructions, not sampled spectra. Forks include both common-source and common-sink orientations; the displayed example is a common source.*

For even $N$, the ordered central product on an odd cycle needs a phase correction: its $N$th power is $-1$, not $1$. At $N=4$, multiplying by $e^{\pi i/4}$ restores fourth power one. The revision makes this convention explicit. Composite orders are handled without treating a matrix over $\mathbb Z_N$ as though it were over a field.

The remaining graph argument identifies exactly the oriented indifference graphs. Sufficiency uses the earlier theorem on its stated real, nonzero-coupling domain; canonical multiplicities and algebraic closedness then justify the extension to complex and vanishing couplings.

## Evidence, assurance and limitations

The archive contains complete written arguments and finite checks, not a formal proof-assistant development. Publication replay passed the exhaustive graph census, exact cyclotomic checks, separate finite-field matrices, physical-label examples and preserved reviewer implementations. The supplied v1 checker also passed 400 held-out switching cases on seven to ten vertices. Those extra cases are not a census beyond six terms.

The exact census covers **22,114 isomorphism classes**, representing **14,408,716 labelled orientations**, through six terms: **120** classes are free and **1,322** can be switched into the free class. Finite-field and bounded-order tests corroborate conventions and instances; they do not prove the universal complex-parameter theorem.

The received review is AI-assisted and its requested minor revisions are documented. Neither that report nor producer-side replay is unaffiliated reproduction, human peer review, an official research-quality rating or exhaustive novelty clearance.

The theorem does **not** cover arbitrary commutation phases, dependent Weyl labels, arbitrary central quotients, unequal sector weights, a different mode list in each sector, constrained coupling families, or adding $H^\dagger$ to $H$. These Hamiltonians can be non-Hermitian. Switching is a change of model, not an isospectral equivalence. The full exceptional free locus is classified only for the fork.

## Relation to earlier work

Mann, Elman, Wood and Chapman supplied the oriented-indifference sufficient construction. This paper claims necessity for a precise canonical whole-spectrum formulation, rather than replacing that construction. Baricz–Singh's zero-location theorem supports the cumulant argument; Rutter and colleagues' straight-enumeration result supports switching recognition.

Ruh and Elman's twin-collapse methods concern useful sector reductions and representation equivalences. A sector can admit effective modes that do not assemble into the global grid required here. Their qudit false-twin condition uses opposite external orientations; the fork obstruction here has same-direction external orientations. The results therefore do not contradict one another.

The related [free-fermion release](/releases/free-fermion-frustration-graphs/) concerns a different, order-two setting. Its graph criterion must not be transferred to $N\ge3$ by analogy.

## Who should care?

| Reader | What is reusable | Boundary to check first |
| --- | --- | --- |
| Mathematical physicist | An exact generic spectral criterion and explicit obstructions | Universal algebra, one global mode list and canonical multiplicities |
| Quantum-model builder | A physical-realisation test | Injectivity of the Weyl-label map; independent couplings |
| Graph-algorithm researcher | Cubic switching recogniser and finite catalogue | Switching changes the Hamiltonian |
| Verification researcher | Exact checks, corruption controls and AI index | Local replay is not a formal or unaffiliated proof |

## Why the problem matters

Recognising a free spectral pattern can turn an exponentially large eigenvalue problem into a much smaller mode problem. A sufficient criterion tells a researcher where that simplification is available. A converse also tells them when to stop searching for it under the chosen definition—and which assumptions must change before a sector-based or specially constrained model can escape the obstruction.

This is a mathematical design boundary, not evidence of faster quantum hardware, a laboratory result or an algorithmic speedup in every physical representation.

## How to inspect or reproduce

Start with the [AI index](https://github.com/ipitchford/free-parafermion-converse/blob/v1.0.1-candidate/AI_INDEX.md), then Theorem 1.2 and Sections 2–6 of the paper. Section 8 gives the physical applicability checklist. The [review response](https://github.com/ipitchford/free-parafermion-converse/blob/v1.0.1-candidate/REVISION_RESPONSE_V101.md) records each change.

From a clean archive extraction, install the pinned Python dependencies and a C++17 compiler, then run:

```sh
python -m pip install \
  -r requirements.txt
python src/check_hashes.py
python src/verify_all.py \
  --output-dir /tmp/pf-replay
python src/replay_reviewer.py \
  --output /tmp/pf-review.json
python src/publication_controls.py
```

The scientific checkers use assertions and deliberately reject Python's optimisation modes. The negative-control controller tests that refusal as well as corrupted graph data and a corrupted manifest. Archive-bound receipts and Linux CI are separate from the retained historical logs.

## Next research projects

The useful extensions are specific: phase-weighted graphs beyond $0,\pm1$; dependent-label quotients with extra central relations; exceptional coupling loci for nonfork obstructions; and separately specified sector-wise notions of freeness. Each changes a load-bearing hypothesis and needs its own statement and proof.

## What is in the package?

The release contains the PDF and TeX manuscript, a substantive AI index, exact graph data, reproducible Python/C++ checks, reviewer code and responses, replay receipts, citation audit, provenance and checksums. Original prose and data are dedicated under CC0-1.0; original code uses MIT. Preserved third-party material retains its own rights boundary.
