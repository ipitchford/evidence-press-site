## Summary

**In one sentence.** For a particle in the plane with relativistic kinetic energy and a homogeneous polynomial potential of degree at least three, this candidate proves that a second conserved quantity exists only for the two symmetric kinds of potential: a power of one coordinate, $c\,q_1^k$, and a radial power, $c\,(q_1^2+q_2^2)^{k/2}$.

**The everyday question.** Think of a particle sliding on a flat table under a force field. The field is described by a potential $V(q_1,q_2)$, and the total energy is the kinetic energy plus $V$. The motion is called **integrable** when, besides the energy, a second quantity is conserved. Integrable motion is regular and predictable; without a second conserved quantity the motion can be chaotic. For potentials that are **homogeneous polynomials** (every term has the same degree $k$, as in $x^3$, $x^4-y^4$ or $(x^2+y^2)^2$), classical mechanics knows many integrable cases: potentials depending on one coordinate, radial potentials, separable ones such as $x^k+y^k$, and several sporadic families. Now replace the classical kinetic energy $\tfrac12|p|^2$ by Einstein's relativistic one, $\sqrt{1+|p|^2}$ (unit mass, unit speed of light):
$$H=\sqrt{1+p_1^2+p_2^2}+V(q_1,q_2).$$
Which potentials are still integrable?

**What was known.** Przybylska, Szumiński and Maciejewski (*Chaos*, 2023) found that relativity is "destructive": almost all classical integrable cases lose integrability, and in their examples only potentials depending on one coordinate, or radial ones, survived. They proved a strong necessary condition for rational first integrals, used it with the classical lists to settle degrees three to five, proved the separable families non-integrable in every degree, and conjectured that generic potentials are all non-integrable, while calling a general conjecture premature. Maciejewski and Przybylska (2005) had given the relation between the eigenvalues at the special straight-line directions of a potential, and the multiplicity counts used here for complex potentials.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The real classification | For every degree $k\ge3$, a real potential has a second conserved quantity exactly when, after turning the axes, $V=c\,q_1^k$ or ($k$ even) $V=c\,(q_1^2+q_2^2)^{k/2}$. New for $k\ge6$; for $k=3,4,5$ the 2023 paper reached it by another route | Theorem A |
| A local version | A potential of any other form already fails near two explicit complex orbits | Theorem 6.1 |
| Rigidity at eigenvalue zero | If the sideways stiffness along a special direction vanishes, the potential must be a pure power of one coordinate; classically this is false ($x^k+y^k$ is integrable) | Theorem 4.1 |
| Complex coefficients | A complex potential with a non-isotropic linear factor, and no isotropic factor of multiplicity exactly $k/2$, is integrable only if it is a power of one linear form; so generic potentials are never integrable | Theorem B, Corollary C |

**What the survivors have in common.** Each has a continuous symmetry: $c\,q_1^k$ does not change when you slide along $q_2$, and the radial power does not change when you rotate. The conserved quantity is the matching momentum $p_2$ or the angular momentum $q_1p_2-q_2p_1$, and relativity does not disturb either.

**The idea.** Find the direction where $|V|$ is largest on the unit circle. Straight-line motions along it exist, and the small motions across them are governed by one number $\lambda$, which must be $0$ or $1$ there. If $\lambda=0$, the first term of $V$ that depends on the sideways coordinate would make the "go once around a loop" maps of nearby orbits fail to commute, because two periods on the curve $\psi^2=a^2x^{2k}-1$ are independent. Integrability forbids this, so $V=c\,x^k$. The case $\lambda=1$ is the same argument in polar coordinates and gives the radial power. In classical mechanics the corresponding second period collapses, which is why $x^k+y^k$ survives classically but not relativistically.

**Limits.** "Integrable" here means a second conserved quantity that is meromorphic on the complex phase space; smooth conserved quantities on a restricted real region or on one energy level are not excluded, and chaos is not proved. Degrees one and two, non-homogeneous potentials and three or more degrees of freedom are not covered. Two complex families are left undecided in general. This is an unrefereed candidate; its assurance is internal AI-assisted review, two proof audits and symbolic checks.

## Summary for specialists

Work on $M=\{(q,p,u)\in\mathbb C^5:u^2-p_1^2-p_2^2=1,\ u\ne0\}$ with $H=u+V(q)$, and call $H$ integrable if it has a meromorphic first integral on $M$ independent of $H$. For a non-isotropic proper Darboux direction $d$ ($\nabla V(d)=\gamma d$, $\gamma\ne0$, $d\cdot d=1$), $\lambda$ is the eigenvalue of $\gamma^{-1}V''(d)$ on the orthogonal line.

- **Theorem A** *(proof)*: for $V\in\mathbb R[q_1,q_2]$ nonzero and homogeneous of degree $k\ge3$, meromorphic integrability on $M$, rational integrability, and "after a real rotation $V=c\,q_1^k$, or $k$ even and $V=c\,(q_1^2+q_2^2)^{k/2}$" are equivalent.
- **Proposition 3.1** *(proof)*: integrability near the homothetic curves $\Gamma_0,\Gamma_1$ forces
$$\lambda=(n+1)(kn+1),\quad n\in\mathbb Z,$$
so $\lambda\in\{0,1\}\cup[2k-1,\infty)$. This is weaker than Theorem 3 of the 2023 paper (an explicit sparse set, for rational integrals; for $k=3$ it begins $0,1,5,40,176,\dots$) but holds for meromorphic integrals.
- **Theorem 4.1** *(proof)*: $\lambda=0$ forces $V=a\,x^k$ in coordinates aligned with $d$. **Theorem 5.1** *(proof)*: $\lambda=1$ forces $k$ even and $V=c\,(q_1^2+q_2^2)^{k/2}$; this also follows from Proposition 1 of the 2023 paper with Combot's 2013 Theorem 1.
- **Theorem 6.1** *(proof)*: at a real maximiser of $|V|$ on the unit circle, $\lambda\le1$; a real $V$ not of the two forms is non-integrable near $\Gamma_0$ or near $\Gamma_1$.
- **Theorem B and Corollary C** *(proof)*: write $V=\ell_+^{\alpha}\ell_-^{\beta}U$ with $\ell_\pm=q_1\pm iq_2$ and $\delta=\deg U$. If $\delta>0$ and $\alpha,\beta\ne k/2$, then $H$ is integrable if and only if $\alpha=\beta=0$ and $V$ is a power of one non-isotropic linear form. With no isotropic factor, every nonradial potential with $k$ distinct non-isotropic proper Darboux directions is non-integrable.

**Known and new.** The question, the strong necessary condition, the degree three to five classification and the conjecture are due to Przybylska, Szumiński and Maciejewski (2023); the special-energy hypergeometric reductions to Szumiński and Przybylska (2025); the relation $\sum_i 1/(\lambda_i-1)=-1$ for generic potentials, its isotropic version and the multiplicity counts to Maciejewski and Przybylska (2005). The proof architecture follows Combot's classification of degree $-1$ potentials (2016): an extremal direction forcing a small eigenvalue, then rigidity at the small eigenvalues through higher variational equations. New here, within a literature search of limited scope: the classification for $k\ge6$, the uniform proof for all $k\ge3$, the zero-eigenvalue rigidity, Theorem B and Corollary C.

## Technical account

**Setting (Section 2).** Because $\sqrt{1+|p|^2}$ is multivalued over complex momenta, $u$ is kept as a coordinate and $M$ is connected, containing both sheets $u=\pm\sqrt{1+|p|^2}$. Along a Darboux direction there are homothetic solutions; on the energy level $H=s$ they trace the curve $\psi^2=(s-z)^2-1$ with $z=V(\varphi d)$. The tool is the theorem of Morales-Ruiz, Ramis and Simó on higher variational equations; Lemma 2.4 transfers it to jets of the normal holonomy on a transversal inside the energy surface, which must be virtually commutative for an integrable system.

**Spectral restriction (Section 3).** At energies $0$ and $1$ the normal variational equation pulls back to Riemann equations with explicit exponent differences. Kimura's classification of solvable Riemann equations (stated in Appendix A) leaves only $\lambda=(n+1)(kn+1)$.

**Eigenvalue zero (Section 4).** Put $d=(1,0)$ and let $m$ be the order of the first term of $V$ in the sideways coordinate $y$, so $3\le m\le k$. On $H=0$ the orbit is the hyperelliptic curve
$$\psi^2=a^2x^{2k}-1.$$
The holonomy around a loop is a shear whose coefficient is the period of $\mathrm dx/\psi$, and its first nonlinear term has coefficient proportional to the period of $x^{2k-m}\,\mathrm dx/\psi$. Two loop maps commute only if these periods are proportional on every loop, and a degree count (Lemma 4.2) shows they are not. So no transverse term exists and $V=a\,x^k$. Classically the power $x^{2k-m}$ becomes $x^{k-m}$, which for $m=k$ gives no new period (Remark 4.3).

**Eigenvalue one and the real theorem (Sections 5 and 6).** In polar coordinates the same mechanism forces the angular part to be constant. For real $V$, choose $\theta_0$ maximising $|f(\theta)|=|V(\cos\theta,\sin\theta)|$; then $\lambda=1+f''(\theta_0)/(kf(\theta_0))\le1$, so $\lambda\in\{0,1\}$ and one of the two rigidity theorems applies.

**Complex coefficients (Section 7).** Lemma 7.1 relates each Darboux root to its eigenvalue, $g'(t_i)=(\lambda_i-1)h(t_i)$, computes the residue $\alpha/(k-2\alpha)$ at an isotropic root and bounds the number of non-isotropic Darboux directions. Summing residues gives
$$\sum_i\frac1{\lambda_i-1}=-\frac{k\delta}{(k-2\alpha)(k-2\beta)},$$
the version with isotropic factors of the Maciejewski–Przybylska relation. For a nonradial integrable $V$ no direction has $\lambda=1$ (Theorem 5.1). If none had $\lambda=0$, Proposition 3.1 would give $\lambda_i\ge2k-1$, so $0<S\le\delta/(2k-2)$ by the count of Lemma 7.1(f), and the formula above contradicts this whenever $\alpha,\beta\ne k/2$. So some direction has $\lambda=0$, and Theorem 4.1 makes $V$ a power of one linear form.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/relativistic-homogeneous-potentials-classification.txt) is available for reading.

- **Proofs.** The 16-page paper opens with a plain introduction (the problem, why it matters, what was known, what is new, the idea of the proof and a roadmap) and gives written proofs of every theorem; Kimura's theorem and the table it uses are stated in an appendix. No proof assistant was used.
- **Checks.** Two SymPy scripts check the algebra exactly: `verify_physics.py` checks the normal variational equation from the flow, the pullback, the exponent differences, the spectral lists for $k=3,4,5$, the flat specialisation of the 2025 reductions, the jet coefficient for symbolic order, the first transverse term and its force for $3\le m\le k\le8$, and the polar identities; `check_complex.py` checks the residue lemma and identity of Section 7 and compares residue sums with eigenvalues computed directly from the Hessian for ten example potentials.
- **Tests that can fail.** No script uses `assert`; every check raises explicitly, so the scripts behave identically in Python's optimised mode. Flipping the sign of the expected residue sum makes `check_complex.py` fail.
- **Replay.** Both scripts were rerun from fresh copies before release, with and without optimised mode, and every output matched the recorded file byte for byte. GitHub CI reruns both on Linux with an exact comparison and the failure test.
- **Review.** A combined five-role internal Claude review panel (editor, methodology, domain, perspective and devil's advocate), an independent proof audit, one revision round that added Theorem B, Corollary C, the local version and the complex-coefficient checks, then a re-review and a second proof audit of the new and rewritten proofs. No mathematical error was found. No Astra/Codex review took place. Every cited source was obtained and read. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Complex-meromorphic integrability only; degrees one and two, non-homogeneous potentials and three or more degrees of freedom are outside; isotropic monomials and the exact-half multiplicity case are undecided; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in Hamiltonian dynamics and integrability | A complete answer for planar homogeneous polynomial potentials with relativistic kinetic energy, and a zero-eigenvalue rigidity mechanism with no classical counterpart | Meromorphic integrals on the complex phase space; two degrees of freedom |
| Researchers on relativistic particle models | A one-line test: only the one-coordinate and radial powers can have a second conserved quantity | Smooth integrals on restricted regions are not excluded |
| Specialists in differential Galois methods | A worked case where independent periods on a hyperelliptic curve make holonomy jets non-commutative | The architecture follows Combot's degree $-1$ classification |
| Research agents | Machine-readable claims, an agent index and replayable symbolic checks | The scripts check algebra and examples; the proofs carry the theorems |

## Why the problem matters

Integrability separates motions that can be described by conserved quantities from motions that can be chaotic. The relativistic Hamiltonian studied here is the simplest model in which to ask how special relativity interacts with integrability. The 2023 paper showed by examples that relativity destroys almost all classical integrable cases; this candidate turns that observation into a theorem with a transparent physical meaning: only potentials with a continuous symmetry survive, because their conserved momentum does not depend on the form of the kinetic energy.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12 and `sympy==1.14.0`, from the package root:

```sh
python3 -O code/verify_physics.py
python3 -O code/check_complex.py
```

Each takes a few seconds and must print exactly the contents of `results/verify_physics.txt` and `results/check_complex.txt`; the second ends with the line confirming that the complex-coefficient checks passed. `README.md` explains the comparison policy, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide the two complex families: isotropic monomials $(q_1+iq_2)^{\alpha}(q_1-iq_2)^{\beta}$ with $\alpha\ne\beta$, and potentials with an isotropic factor of multiplicity exactly $k/2$.
2. Transfer the zero-eigenvalue rigidity to the curved-space and position-dependent-mass relativistic Hamiltonians of Szumiński and Przybylska.
3. Extend the argument to three or more degrees of freedom, where the transverse dynamics is higher-dimensional.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); two scripts in `code/` with their recorded outputs in `results/`; `requirements.txt` (SymPy pinned); `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
