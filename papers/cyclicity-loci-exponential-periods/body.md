## Summary

**The setting.** Many quantities in mathematics and physics are written as integrals of an exponential, $\int a(x)\,e^{\Phi(x)}\,dx$, where the exponent $\Phi$ is a polynomial whose coefficients are parameters. Such integrals, called exponential periods, often satisfy differential equations in those parameters. The reason is algebraic: if you keep differentiating the integrand with respect to a parameter, the results eventually become linearly dependent, and that dependence relation is the differential equation.

**The question.** This release asks a more specific question: when does one chosen starting integrand, or **seed**, stop generating the full available differential system? At most parameter values a seed and its derivatives span everything; at special values they span less, and the differential equation the seed satisfies drops in order.

**What the candidate does.** It turns repeated parameter differentiation into a finite exact matrix. Its minors locate the parameter values where the seed loses rank. This is useful because the same ambient system may still possess some other cyclic generator: the paper is diagnosing the behaviour of a specified amplitude, not declaring the whole differential module defective.

**What was found.** For a depressed quartic phase, the calculation gives every possible rank and separates two kinds of failure. The even family has a lower-rank span that persists under the relevant connection. A second component is generally only a pointwise failure of one derivative frame.

For an odd quintic phase, the package exposes the full matrix, exact reduction witnesses, determinant and every size-three minor. Together with the rank argument, this yields rank-one, rank-two, rank-three and rank-four regions. The identities are computer-assisted but finite and inspectable.

The release also uses a Chebyshev family as a stringent all-degree test. Its exponential integral and modified-Bessel equation are known from prior work and are not claimed as discoveries here.

> **Status:** anonymous, unrefereed candidate. Producer-side replay and targeted failure controls pass. Independent reproduction, proof-assistant formalization, specialist review, analytic contour validation, peer review, and novelty or priority determination have not occurred.

## Summary for specialists

Let

$$
A=k[\theta_1,\ldots,\theta_N]_g,
\qquad
\mathcal H_\Phi=A[x]\big/\{q_x+\Phi_xq:q\in A[x]\},
$$

with $k$ of characteristic zero and the leading coefficient of $\Phi_x$ invertible in $A$. The candidate proves that $\mathcal H_\Phi$ has a monomial normal form of rank $\deg_x\Phi-1$ and behaves correctly under the stated base changes.

For a parameter derivation $V$ and fixed seed $[a]$, the iterates

$$
[a],\ \nabla_V[a],\ \nabla_V^2[a],\ldots
$$

form a finite Krylov matrix. Its determinantal ideals define the scheme-theoretic fibre-rank loci on the recorded open parameter scheme. Persistence is a stronger condition: along an integral component tangent to $V$, the lower-rank Krylov span must be locally free and invariant under $\nabla_V$.

For

$$
\phi=x^4+ax^2+bx,\qquad \Phi=s\phi,\qquad s\ne0,
$$

the fixed-seed determinant is

$$
\Delta_4=\frac{b}{64s}\left(s(8a^3+27b^2)-6a\right).
$$

The candidate gives complete ranks one through three. The component $b=0$ is persistent for the scale direction; the other determinant component is generally pointwise.

For $\phi=x^5+ax^3+bx$, put $C=a^2-5b$. The finite certificate gives

$$
\Delta_5=-\frac{64}{9765625s^2}C^2P(a,b,s),
$$

where

$$
\begin{aligned}
P={}&81a^6bs^2-684a^4b^2s^2+240a^3\\
&+1840a^2b^3s^2-600ab-1600b^4s^2.
\end{aligned}
$$

The reported ranks are one at the monomial origin, two on $C=0$ away from the origin, three on $P=0$ off $C=0$, and four elsewhere.

| Result | Status in the paper |
|---|---|
| Localized monomial normal form and base change (Theorem 2.1, Proposition 2.2); well-defined Gauss–Manin directions; determinantal fibre-rank loci; persistence definition; tangent pullback; adjugate, corank and height-one divisibility results; depressed-quartic rank strata (Theorem 6.1); power and Chebyshev benchmark relations | proved algebraically |
| Full odd-quintic matrix, reduction witnesses, determinant, complete size-three minor table and rank stratification (Theorem 8.1) | computer-assisted theorem |
| Scalar differential equations for periods | analytic implication, under stated contour hypotheses |

## Technical account

**Finite normal form.** Because the leading coefficient of $\Phi_x$ is a unit, the operator $D_\Phi(q)=q_x+\Phi_xq$ raises degree by exactly $\deg_x\Phi-1$. Any polynomial amplitude can therefore be reduced, by repeatedly cancelling its leading term, to a unique remainder of degree below $r=\deg_x\Phi-1$ (Theorem 2.1). The quotient is free with basis $[1],[x],\ldots,[x^{r-1}]$, so every amplitude becomes a column of $r$ coordinates.

**The Krylov matrix.** A parameter derivation acts on classes by $\nabla_V[a]=[V(a)+V(\Phi)a]$. Applying it repeatedly to the seed and recording the coordinates of each result gives the square fixed-seed cyclicity matrix. Its size-$j$ minors generate ideals whose zero sets are the loci where the seed's rank falls below $j$. The paper records the open set on which denominators and the leading coefficient are inverted, because careless denominator clearing can add or remove components.

**Persistent versus pointwise defects.** A determinant zero says only that one derivative frame is degenerate at that point. A defect is persistent when the lower-rank span is locally free along a component and closed under the connection. The paper also shows why the tangent field matters: for $\Phi=sx^3+ax$ restricted to $a=s$, differentiating by $\partial_s$ and then substituting gives determinant $-1/3$, whereas the correct tangent field $V=\partial_s+\partial_a$ gives determinant $2/3$ and a different second-order relation.

**Multiplicity from corank.** If a matrix has corank $c$ at the generic point of a smooth irreducible divisor $C=0$, then $C^c$ divides its determinant (Proposition 5.3). For the quintic component $C=a^2-5b$ the generic rank is two in ambient rank four, which explains the square $C^2$ in $\Delta_5$ independently of the final factorization.

**Implementation.** The software reduces amplitudes modulo $D_\Phi(q)=q_x+\Phi_xq$ using exact SymPy arithmetic. The primary implementation uses a leading-term recurrence. A second packaged implementation solves the same reductions by coefficient matching. Because both were developed in the same workflow and share SymPy, their agreement is algorithmic diversity, not independent reproduction.

The odd-quintic certificate stores four polynomials $q_j$ and their reduced remainders $r_j$ so that

$$
\phi^j=q_j'+(s\phi)'q_j+r_j,\qquad j=0,1,2,3.
$$

A small checker recomputes those four identities, the full matrix, determinant, all sixteen size-three minors, divisibility by $C$, and a rational rank-three witness. Mutation controls change four load-bearing coefficients or factors; negative controls reject invalid phases and directions; a temporary manifest corruption must also be detected.

The scalar period equations are conditional analytic consequences. They apply along a local integral curve of the chosen parameter derivation and require the stated horizontal-cycle, differentiation-under-the-integral and integration-by-parts hypotheses. The release does not construct rapid-decay cycles or Stokes data.

## Evidence, assurance and limitations

**What was checked.**

| Layer | Method | Frozen result |
|---|---|---|
| Primary exact verifier | Leading-term normal-form implementation | 129/129 checks in ordinary Python |
| Optimized replay | Same verifier under `python -O` | 129/129 checks |
| Algorithmically distinct reducer | Coefficient-matching implementation | 17/17 checks |
| Quintic proof certificate | Separate JSON certificate and small checker | 47/47 checks |
| Mutation and negative controls | Four formula mutants, four invalid inputs and manifest corruption | 9/9 controls detected or rejected |

An author-run Wolfram Language 15.0.1 cross-CAS record reproduces the quartic and quintic matrices, both determinant factorizations, all sixteen quintic size-three minors and the symbolic Chebyshev residual. This is an author-run spot check, not independent-person assurance.

**What the result does not establish.**

- It does not establish that the candidate claims are mathematically correct through independent verification or peer review.
- It does not give a general multivariate Picard–Fuchs or Feynman-integral algorithm.
- It does not construct global contour bases, rapid-decay cycles or Stokes matrices.
- It does not claim discovery of the Chebyshev exponential integral, its total-derivative proof or its modified-Bessel equation.
- It does not establish novelty or priority for the quartic or odd-quintic formulas; the scoped search recorded only non-location.
- It does not provide a fully pinned container, Nix or Guix environment for every computational layer.

Agreement among exact computer-algebra paths does not replace specialist mathematical review, and the structural theorems have not been formalized in a proof assistant.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in Gauss–Manin systems and twisted de Rham theory | Inspect a fixed-seed, fibrewise determinantal formulation with explicit low-degree strata. | The structural proofs remain informal and unrefereed. |
| Computer-assisted mathematics researchers | Audit a finite odd-quintic reduction and minor certificate with deliberate fault controls. | Certificate replay proves correspondence to the packaged identities, not the graph from mathematics to truth. |
| Symbolic-computation developers | Reimplement the recurrence and coefficient-matching reductions in another CAS. | The two current paths share a producer workflow and SymPy. |
| AI research agents | Discover exact statements, hypotheses, check identifiers, hashes, provenance and unresolved assurance fields. | Preserve the candidate status and do not promote internal replay to independent verification. |
| Reviewers and special-functions researchers | Check the Chebyshev mapping, rank proof and prior-art boundary. | The Chebyshev integral and Bessel equation are anteceded and are benchmarks here. |

## Why the problem matters

Exact polynomial reduction, cyclic-vector theory and minimal differential-operator computation are established subjects, and the paper does not present a new general Picard–Fuchs algorithm. What it isolates is a finer question that those tools usually leave implicit: the rank seen by one *specified* amplitude. A module can have some cyclic vector even where a natural seed fails, so the order of the equation a particular integral satisfies can drop on special parameter loci without anything being wrong with the ambient system.

Knowing exactly where that happens, and whether the drop persists along a family or is a one-point accident of a derivative frame, matters whenever a computation follows a chosen integral through parameter space. The quartic and quintic cases give transparent exact examples; the Chebyshev benchmark shows the gap between ambient twisted rank $n-1$ and the rank two seen by one natural seed.

## How to inspect or reproduce the recorded checks

From the tagged GitHub release, with Python 3.11 or later and SymPy 1.14.0:

```bash
python3 -m pip install -r requirements.txt
bash repro/replay.sh            # all exact checks, the quintic certificate and the controls
bash repro/verify_manifest.sh   # verify the frozen SHA-256 hashes
bash examples/run_examples.sh   # command-line examples
```

The expected summaries are 129/129 exact checks (ordinary and optimized), 17/17 algorithmically distinct checks, a deterministic quintic certificate that matches the frozen JSON and Markdown, 47/47 quintic certificate checks and 9/9 mutation and negative controls. The live replay writes to a fresh `.replay/run.*` directory and leaves the frozen reports unchanged.

For reading, start with `MANUSCRIPT.md` (or `main.pdf`), then `CERTIFICATE_QUINTIC.md` for the human-readable quintic certificate and `data/quintic_certificate.json` for the machine-readable matrix, reductions and minors. Agents should begin with `STATUS.json` and `CLAIM_INDEX.json`, which map each load-bearing claim to a stable check identifier.

## The most valuable next projects

1. Reconstruct the quartic and odd-quintic rank proofs independently, starting from the public statements rather than the production reducers.
2. Reimplement the load-bearing reductions in SageMath with Singular, or another unaffiliated open-source CAS stack.
3. Formalize the localized normal-form, determinantal-locus, persistence and component-multiplicity results in a proof assistant.
4. Add a rigorous analytic layer: rapid-decay cycles, contour continuation, differentiation hypotheses and Stokes data.
5. Extend the fixed-seed construction to multivariate twisted complexes and relative or logarithmic amplitudes.
6. Search more broadly for equivalent quartic and odd-quintic formulas under other normalisations, moment determinants or Brieskorn-lattice terminology.

## What is in the evidence package

- A 24-page manuscript in PDF, generated TeX and canonical Markdown.
- The exact library and command-line interface with SymPy 1.14.0 pinned.
- 129 ordinary and 129 optimized exact checks.
- A 17-check coefficient-matching path packaged in the same producer workflow.
- A 47-check finite exact odd-quintic reduction certificate.
- Nine deliberate mutation, manifest-corruption and invalid-input controls.
- An author-run Wolfram Language cross-CAS input and transcript.
- Fresh-extraction replay under Python 3.12.11 and 3.13.5, plus a wheel and installed-CLI smoke test.
- A SHA-256 manifest, replay receipt, claim index, assurance vector, provenance record, citation receipt, licence map and final integrity report.
- A 14-reference source-identity and contextual-use audit, including direct PDF checks for the load-bearing Chebyshev antecedents.

All original release content is dedicated to the public domain under CC0-1.0. External articles and software retain their own rights and licences.

The immutable tagged package, paper and checksum are available from [GitHub](https://github.com/ipitchford/cyclicity-loci-exponential-periods/releases/tag/v0.2.1-candidate). The exact archived version is [Zenodo record 21853682](https://zenodo.org/records/21853682), DOI [10.5281/zenodo.21853682](https://doi.org/10.5281/zenodo.21853682).
