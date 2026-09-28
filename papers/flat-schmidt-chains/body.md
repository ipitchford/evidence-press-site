## Summary

Can two quantum chains agree in every two-site and three-site energy measurement, yet differ when the chain becomes long? This candidate gives an exact family where they do.

The **spectral gap** is the energy needed to leave the ground-state space. A uniformly gapped chain retains a positive threshold as its length grows. A gapless chain can have excitations at progressively smaller energies. Here the familiar short-chain spectra, the pair's entanglement probabilities and even the number of ground states at every length all agree—but they do not determine which behaviour occurs.

The paper also proposes a complete classification within a precise class of interactions. Its dividing condition is geometric: how the two support planes of a forbidden neighbouring-pair state meet, and whether an extremal overlap can propagate along the chain.

The banner compares the common three-site energy levels with the family’s long-chain behaviour. The teal curve is a **proved lower bound**, not a plot of the actual gap. The gold endpoint has a different, length-dependent exact formula.

## Summary for specialists

Let $H_N=\sum_{i=1}^{N-1}|\psi\rangle\langle\psi|_{i,i+1}$ on an open chain, with no boundary penalties, $N\ge2$, and finite local dimension $d\ge2$. The normalised forbidden vector has Schmidt probabilities $(1/2,1/2,0,\ldots)$. Local projector rank is one; Schmidt rank is two.

The candidate theorem says the chain is gapless precisely when, up to phase,

$$\psi=(u\otimes w-w\otimes v)/\sqrt2,$$

where $u,v,w$ are unit vectors and $w\perp u,v$. Every such balanced-marker interaction has the exact gap

$$\gamma_N=1-\cos(\pi/N).$$

All other interactions in this class are uniformly gapped. If the two Schmidt supports intersect in the line $\mathbb Cw$, let $t<1$ be the nontrivial principal-angle cosine and $\tau=2|\langle w,w|\psi\rangle|^2$. For $\tau>0$,

$$\gamma_N\ge\frac{3\tau(2-t)(1-t)}{1024}>0.$$

Coincident supports are gapless; disjoint supports have the positive bound $1-\|\Pi_L\Pi_R\|$.

## Technical account

The complete qutrit short-spectrum fibre has the on-site-unitary normal form

$$\psi_\theta=(\cos\theta\,|00\rangle+\sin\theta\,|01\rangle-|12\rangle)/\sqrt2,$$

with $0\le\theta\le\pi/2$. Before the endpoint, $\gamma_N\ge\cos^2\theta/6$. At the endpoint, the balanced-marker formula applies. Throughout the family, the two-site spectrum is $0^{(8)},1$, the three-site spectrum is $0^{(21)},1/2,1^{(4)},3/2$, and the ground-space dimension is $F_{2N+2}$, using $F_0=0,F_1=1$.

Four overlapping sites supply information absent from those spectral lists. A range-Gram decomposition establishes the finite-size inequality used in the fibre bound. One negative direction of the Gram difference lies in the kernel of the concatenated range map; the argument does **not** claim positivity of the whole matrix. The revised appendix gives a basis construction covering the full parameter interval, including both endpoints.

For the general classification, a quantitative obstruction to simultaneous overlap saturation separates the gapped case from compatible marker propagation. The open-boundary argument connects local windows to the full Hamiltonian. Complementary dimer, rank-one perturbation and opposing-bias results retain their own hypotheses; the opposing-bias result is an exponential **upper** bound, not a matching asymptotic estimate.

## Evidence, assurance and limitations

The archive includes analytic proofs, seven exact full-four-site positivity certificates, 43 exact test groups, 146 full-Hamiltonian numerical cases and 24 complex relative-form checks. All five historical checking programs were replayed. Separately supplied referee code also passed its full-Gram and numerical checks. These are finite producer-side checks, not a proof of every parameter and length or an authenticated independent reproduction.

The supplied review exposed a real software boundary: generic symbolic ranks can hide exceptional parameter values. The executable classifier now accepts only parameter-free exact inputs and rejects free symbols. Tests cover the reviewer's gapless and gapped specializations; a deliberately broken classifier must fail, both normally and with Python assertions disabled.

The manuscript remains unrefereed and unformalised. This is not a classification of unequal Schmidt probabilities, arbitrary rank-two projectors, periodic chains or infinite-volume GNS gaps. Equality of the stated short-chain spectra does not imply equality of full spectra at larger lengths.

## Relationship to earlier work

Bravyi–Gosset's qubit classification is an explicit predecessor. The ground-space recurrence appears in Movassagh and collaborators' earlier work; the unbiased one-particle hopping gap is also present in the Motzkin-chain literature. The revision supplies precise locators for both. Those ingredients alone are not the proposed novelty.

The contribution offered for scrutiny is the complete flat-Schmidt-rank-two dichotomy, its quantitative saturation argument, and persistence of the gap distinction across the complete specified short-spectrum fibre. The bounded source search does not establish historical priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical physicists | Audit or reuse a geometric criterion for an open-chain gap | Retain flat Schmidt data, projector normalisation and the boundary convention |
| Quantum-model researchers | Test what short-chain spectral summaries can identify | The result is not an experimental protocol or a general phase classification |
| Verification researchers | Challenge exact certificates, parameter-domain checks and proof-to-code correspondence | Finite replay does not establish the universal analytic argument |

## Why the problem matters

Small systems are easier to calculate than long chains. Agreement on small-system energy spectra can therefore look more informative than it is. This family isolates the missing information exactly: identical short spectral lists and ground-state counts coexist with different long-chain gaps. It also identifies a geometric mechanism that separates the two behaviours within the stated class.

## How to inspect or reproduce the recorded checks

Start with the linked repository's `AI_INDEX.md`, `STATUS.md` and `ASSURANCE.md`. Install `requirements-recorded.txt` in Python 3.13 and check the manifest before running programs that regenerate reports:

```sh
python code/verify_manifest.py
sh reproduce.sh
python code/publication_controls.py
python -OO code/publication_controls.py
```

Use a fresh extraction. The final release receipt binds the archive and exact-commit Linux CI. Numerical diagnostics are distinct from exact certificates, and both are distinct from the written universal proof. The classifier requires exact constant entries; specialise symbolic parameters first.

## The most valuable next projects

An unaffiliated audit of the saturation inequality, the normal-form completeness argument and the full range-Gram basis would most improve assurance. A separately implemented exact classifier would challenge more than a replay of the same code. Unequal Schmidt probabilities and different boundary conditions are separate research questions, not included extensions.

## What is in the evidence package

| Item | Purpose |
|---|---|
| Manuscript PDF, TeX and Markdown | Quantified statements, proofs, appendix and references |
| Exact certificates, classifier and diagnostics | Finite checks with explicit input and output scope |
| AI index, assurance and source audit | Dependencies, antecedents, exclusions and safe reuse |
| Revision response, replay receipt and manifests | Review actions, execution evidence and immutable file identity |

Original prose and data are CC0-1.0; original code is MIT. Preserved third-party material retains its own rights.
