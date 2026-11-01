## Summary

**The everyday picture.** Many precision experiments read a tiny change $\theta$ in a light beam, such as a phase shift or a change in squeezing, by measuring the beam's field quadratures with *homodyne detection*. If the same state can be prepared $m$ times, one can measure each copy separately or first combine the copies in an interferometer and then measure.

**The question.** Quantum theory allows the information in independent copies to add up exactly. Laboratories, however, often restrict themselves to *Gaussian measurements*: beam splitters and phase shifters, auxiliary vacuum or squeezed light, and homodyne detectors. Navarro, Morelli, Sanz and Mehboudi showed that, with this restriction, measuring the copies jointly can beat measuring them one by one. Their scheme adds the copies coherently so that the changing mean ends up in a single *bright* output, while the other *dark* outputs keep only the changing noise. They left open whether this is the best Gaussian scheme for a finite number of copies.

**What was found.** For every smooth family of *pure single-mode* Gaussian states and every $m$, nothing does better. No Gaussian measurement on the $m$ copies, however entangling and even with extra auxiliary light, gives more Fisher information than gathering the signal into the bright output, measuring it at one well chosen angle, and measuring every dark output along a fixed axis. The best value is a short formula with one angle to optimise.

**Three consequences.** The same proof gives the exact optimum when the measurement may use only limited squeezing. It shows that the total shortfall from the quantum limit never exceeds the variance information of a single copy, however many copies are used. And it says exactly when joint measurement helps: when the mean and the noise ellipse change in misaligned directions.

**How sure we are.** Every result has a written proof, and numerical checks test the formulas and their normalisations. The interferometer itself is due to the earlier paper; the new part is the proof that nothing beats it at finite $m$. This is an anonymous, AI-assisted, unrefereed candidate whose review was internal, not peer review.

## Summary for specialists

Convention: $[q,p]=i$, covariance $\sigma$ equal to twice the ordinary covariance (vacuum $\sigma=I$). After a fixed symplectic normalisation at the operating point, a pure single-mode family has
$$
\sigma=I_2,\qquad \sigma'=\lambda\,\mathrm{diag}(1,-1),\qquad d'=(a,b),\qquad \lambda\ge0 .
$$
Write $D=a^2+b^2$, $c=\lambda^2/2$ and $Q=2D+c$ for the one-copy quantum Fisher information. A *Gaussian measurement* consists of Gaussian ancillas, a fixed Gaussian unitary, homodyne detection of any subset of outputs and classical post-processing (no feed-forward).

| Result | Status |
|---|---|
| $F_m^G=(m-1)\tfrac{\lambda^2}{2}+\max_\phi\{2m(a\cos\phi+b\sin\phi)^2+\tfrac{\lambda^2}{2}\cos^22\phi\}$, attained by the concentration interferometer, a homodyne at $\phi$ on the bright output and $q$-homodynes on the dark outputs (Theorem 1, Lemmas 2–3) | proof |
| Pure general-dyne seeds with $e^{-R}I\le M\le e^{R}I$, $\beta=\tanh(R/2)$: $F_{m,R}=mD+\tfrac{m\lambda^2}{4}(1+\beta^2)+\max_{x^2+y^2\le\beta^2}\{m(a^2-b^2)x+2mab\,y-cy^2\}$ (Theorem 2) | proof |
| $\Delta_m=mQ-F_m^G=\min_\phi\{2mD\sin^2(\phi-\delta)+c\sin^22\phi\}$ is nondecreasing, $0\le\Delta_m\le c\sin^22\delta\le\lambda^2/2$, $\Delta_m\to2\lambda^2a^2b^2/D^2$; $\Delta_m=0$ iff $\lambda ab=0$ (Corollary 1) | proof |
| For $m\ge2$: $F_m^G>mF_1^G\iff\det[w,Aw]\ne0\iff\lambda ab\ne0$, with gain at least $(m-1)c\sin^22\phi_*$ (Proposition 1) | proof |
| Coherent squeezing $\lambda=2$, $d'=(\alpha,-\alpha)$, $A=m\alpha^2$: $F_m^G=2m+2A+A^2/2$ for $A\le2$ and $2m+4A-2$ for $A\ge2$; exact table for $\alpha=1/2$ (Section 4.5) | proof; exact values |

## Technical account

**From any measurement to a matrix.** Mixed ancillas can be purified, pure ancillas are vacuum after a Gaussian unitary, and undetected outputs can be detected and the result discarded. So it suffices to consider homodyne detection of a complete set of commuting quadratures $U^{\mathsf T}R$ on the copies plus vacuum ancillas, with $U^{\mathsf T}U=I$ and $U^{\mathsf T}\Omega U=0$ (Lemma 2). Its Fisher information is $F(K)=2\tilde v^{\mathsf T}K\tilde v+\tfrac12\operatorname{Tr}[(K\tilde H)^2]$ with $K=UU^{\mathsf T}$.

**The disk.** The matrix $B=2K-I$ is symmetric, satisfies $B^2\le I$ and anticommutes with the symplectic form, so $B=\left(\begin{smallmatrix}X&Y\\Y&-X\end{smallmatrix}\right)$ with $X^2+Y^2\le I$. The Fisher information depends on $B$ only through $x=e^{\mathsf T}Xe$ and $y=e^{\mathsf T}Ye$ along the symmetric copy direction $e$, plus traces that are bounded using $X^2+Y^2\le I$ and the ancilla projection. This gives $F\le mD+mc+m(a^2-b^2)x+2mab\,y-cy^2$ with $x^2+y^2\le1$ (Lemma 3). No commutativity of $X$ and $Y$ is needed.

**Sharpness.** The rank-one choice $X=I+(x-1)ee^{\mathsf T}$, $Y=y\,ee^{\mathsf T}$ makes every inequality an equality. It is exactly the concentration interferometer followed by homodyne detection, and its Fisher information is computed directly from the Gaussian outcome law. The squeezing cap replaces the unit disk by a disk of radius $\beta$; the corollary on the quantum limit and the strictness criterion follow from the closed form.

**Classical and new.** Gaussian-measurement Fisher information, pure-seed reduction and the symplectic contraction picture of pure covariance matrices are standard tools, cited where used. The new elements, within a bounded search, are the finite-copy upper bound with its ancilla reduction, the seed-squeezing-capped optimum, the exact quantum-limit shortfall and the invariant strictness criterion.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/finite-copy-gaussian-metrology.txt) is available for reading.

- **Proofs.** Every lemma, theorem, corollary and proposition has a written proof in the 9-page manuscript.
- **Checks.** One verification script tests:
  - 4,800 random pure measurement seeds, built independently of the proof's parameterisation;
  - 3,000 random ancilla-assisted homodyne measurements, with Fisher information computed directly from the outcome law;
  - local maximisation over measurement seeds;
  - attainment through an explicitly constructed interferometer;
  - the squeezing-capped optimum (bound, attainment, purity and spectrum of the constructed seed);
  - the quantum Fisher information formula, by a Fock-space computation;
  - the exact rational example table, and deterministic degenerate cases;
  - four wrong closed forms, each of which must be rejected.

  It passes in normal and optimised Python, and its results reproduce byte for byte from the frozen archive.
- **Review.** Internal AI-assisted review in five roles plus an outside-model correctness review led to one revision. That revision proved the measurement-class reduction with ancillas and added two extensions (the squeezing cap and the quantum-limit shortfall). A verification re-review and a targeted proof audit followed; the editor fixed their wording findings. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** Pure single-mode models only; mixed states and general multimode tangents are open. Adaptive (feed-forward) Gaussian strategies are excluded. The squeezing cap is stated in normalised coordinates, not as a laboratory energy budget. Losses and detector inefficiency are not modelled. The prior-art search was bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Quantum-optics experimentalists | A proof that the simple concentration-plus-homodyne scheme is already optimal among Gaussian measurements, and an exact count of what joint measurement gains | Ideal optics; losses and mode mismatch are not included |
| Quantum metrology theorists | An exact finite-copy benchmark, an exact quantum-limit shortfall and a reusable disk argument | Pure single-mode models and fixed measurements only |
| Statisticians of optimal design | A clean example where the optimal joint design is rank-one and copy-symmetric | Local Fisher information at a known operating point |
| Research agents | Machine-readable claims, an agent index, verification code and negative controls | The checks are finite; the theorems rest on the written proofs |

## Why the problem matters

Superadditivity of Gaussian Fisher information shows that the measurement toolbox, not only the state, limits precision. Knowing the exact finite-copy optimum tells an experimenter whether a more elaborate collective measurement could ever help: for pure single-mode probes it cannot. It also shows how much of the quantum limit stays out of reach with Gaussian tools, a bounded total amount.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with [uv](https://docs.astral.sh/uv/):

```sh
shasum -a 256 -c SHA256SUMS
uv sync --frozen
OPENBLAS_NUM_THREADS=1 uv run --frozen python -B verification/verify_all.py
OPENBLAS_NUM_THREADS=1 uv run --frozen python -O -B verification/verify_all.py
```

Each run takes about two minutes on one core and prints PASS or FAIL for each check group. `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Find the exact finite-copy optimum for mixed single-mode Gaussian states.
2. Extend the result to multimode tangents, starting with equal squeezing rates.
3. Decide whether adaptive (feed-forward) Gaussian strategies can beat the bound.
4. Include detector inefficiency, or a squeezing budget for ancilla-assisted schemes.

## What is in the evidence package

The package contains:
- the manuscript (PDF and LaTeX source);
- the verification script with its retained results, and a CI workflow that replays it in both Python modes;
- the original research note of 28 October 2026, as a development record;
- the revision response and a rating-free review summary;
- prior-art, sources and citation-audit records;
- claim, status, assurance and provenance records, and an agent index.

Licences are CC0-1.0 for text and data and MIT for code, and SHA-256 manifests are included. The same files are in the GitHub release and the Zenodo record.
