## Summary

The permanent of a matrix resembles the determinant, but every term is added with a plus sign. That small change makes permanents much harder to control. This paper proves a sharp inequality for two ways of combining positive-semidefinite matrices when their rank is at most three and their size is five.

For a matrix $C$, let $C\circ C$ mean that every entry is squared. The candidate proves

$$
\operatorname{per}(C\circ C)\le \frac{13}{48}\operatorname{per}(C)^2
$$

for every real $5\times5$ correlation matrix of rank at most three. The coefficient cannot be reduced. Equality has one precise shape: after simultaneously reordering rows and columns and switching matching signs, the matrix separates into a two-point all-ones block and a three-point equiangular block.

The same constant also controls two different positive-semidefinite matrices $A$ and $B$:

$$
\operatorname{per}(A\circ B)\le \frac{13}{48}\operatorname{per}(A)\operatorname{per}(B).
$$

That mixed statement, including all equality cases, is an analytic consequence added during review. The result is restricted to real matrices of order five and rank at most three. It does not settle the unrestricted Chollet conjecture.

**Where it comes from.** Zeng, Liu and Ratnavelu proposed the coefficient $13/48$ and the extremal matrix while proving rank-two and structured rank-three cases; this candidate supplies a checked global proof for the whole rank-at-most-three class in order five.

**Status.** An unrefereed, AI-assisted exact computer-assisted proof. It has been internally replayed and scrutinised, but not externally peer reviewed or proof-assistant formalised.

## Summary for specialists

Let $C$ be a real correlation matrix in $\mathbb R^{5\times5}$ with $\operatorname{rank}C\le3$. Then

$$
48\operatorname{per}(C\circ C)\le13\operatorname{per}(C)^2.
$$

Write $E_3$ for the $3\times3$ correlation matrix with off-diagonal entries $-1/2$. Equality holds exactly at signed simultaneous permutations of

$$
C_\star=J_2\oplus E_3.
$$

Here $\operatorname{per}(C_\star)=3$ and $\operatorname{per}(C_\star\circ C_\star)=39/16$, so the ratio is exactly $13/48$.

Consequently, for real positive-semidefinite $5\times5$ matrices $A,B$ of rank at most three,

$$
\operatorname{per}(A\circ B)\le\frac{13}{48}\operatorname{per}(A)\operatorname{per}(B).
$$

When both diagonals are positive, equality holds exactly when their diagonal normalisations have one common $2+3$ block partition and each is an independent diagonal sign switching of the corresponding copy of $C_\star$. A zero diagonal entry in either positive-semidefinite matrix gives a zero row and hence degenerate equality.

## Technical account

The proof represents a rank-three correlation matrix as the Gram matrix of five unit vectors in $\mathbb R^3$. After expanding the permanent difference, symmetry reduces the target polynomial to three covariant sectors: scalar, vector and traceless-tensor. The published certificate supplies positive-definite rational Gram matrices of dimensions 52, 96 and 140 for the resulting sums of squares.

The exact checker reconstructs those covariants and expands the full 120-permutation identity. What remains is an explicit sum of monomial multiples of $4\times4$ Gram minors. Those minors vanish whenever the Gram matrix has rank at most three. Rational factorisations and strict diagonal dominance certify the three positive-definite blocks without floating-point tolerances.

Equality is not inferred from a numerical optimiser. Four exact scalar consequences of the sum-of-squares identity force the block decomposition and the equiangular triple. The mixed theorem then follows from Cauchy–Schwarz applied to permutation monomials, followed by the sharp self-product theorem. Its equality analysis tracks when both Cauchy–Schwarz and the self-product bounds are tight.

## Evidence, assurance and limitations

The package contains the paper, explicit rational certificate, standard-library checker, corruption tests, a separate exact implementation of the decisive calculations, and a regression check for the mixed equality classification. Ordinary and optimised Python executions passed on the frozen archive. Three proof-relevant mutations—one positivity entry, one global identity coefficient and one equality identity—were all rejected.

These checks establish the supplied finite algebraic identities and rational positivity claims. They do not regenerate the certificate: the original generator, solver transcript and rational-repair trace are unavailable. The written Gram reduction and equality deductions still require mathematical inspection. The finite mixed regression supports the analytic argument but is not its proof.

This is an unrefereed, AI-assisted mathematical candidate. It has received internal AI-assisted mathematical and adversarial scrutiny, including a separate implementation of the decisive exact calculations. It has not received external specialist review, journal peer review or proof-assistant formalisation. The literature search was bounded rather than exhaustive.

## Relationship to earlier work

[Zeng, Liu and Ratnavelu](https://doi.org/10.20944/preprints202608.1240.v1) proposed the coefficient and extremal witness while proving rank-two and structured rank-three cases. The present contribution is a checked global proof for all real order-five correlation matrices of rank at most three, the complete equality classification, and the sharp mixed extension.

[Li, Zhao and Luo](https://www.preprints.org/manuscript/202608.2196) study the broader Chollet programme through order six using a different border-induction route. The methods for symmetry-adapted sums of squares and rational reconstruction draw on work by Gatermann–Parrilo and Peyrl–Parrilo. A bounded source audit does not establish unconditional historical priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Matrix-analysis researchers | A sharp rank-constrained permanent inequality and equality classification | The result is real, order five and rank at most three |
| Computer-assisted proof developers | A compact exact checker for a large symmetry-reduced rational certificate | Checking a certificate is not regenerating it or formalising the prose reduction |
| Researchers extending Chollet-type inequalities | A complete low-rank benchmark and a sharp two-matrix consequence | The rank-four diagnostic shows that this coefficient cannot simply be carried to higher rank |

## Why the problem matters

Permanent inequalities sit at the intersection of matrix analysis, probability and combinatorics, but their all-positive expansion removes many determinant techniques. A sharp theorem with classified equality cases does more than establish an upper bound: it reveals the exact geometry that makes the bound tight and supplies a reliable benchmark for any proposed higher-rank or complex extension.

## How to inspect or reproduce the recorded checks

Read the theorem statements and the Gram reduction in the paper first. Then use `AI_INDEX.md` to locate the three covariant bases, the sum-of-squares certificate, the rank-three ideal terms and the equality certificate. From a fresh extraction, run:

```bash
python3 -B verify.py --report verification_report.json
python3 -B test_mutations.py
python3 -B verify_mixed_extension.py
PYTHONDONTWRITEBYTECODE=1 python3 -O -B verify.py --report verification_report_optimized.json
PYTHONDONTWRITEBYTECODE=1 python3 -O -B test_mutations.py
PYTHONDONTWRITEBYTECODE=1 python3 -O -B verify_mixed_extension.py
```

The proof-critical checks use exact integer and rational arithmetic. Compare the reported identities and rejection outcomes, not elapsed time. The [versioned GitHub release](https://github.com/ipitchford/sharp-rank-three-chollet-order-five/releases/tag/v1.0.0) and [Zenodo record](https://zenodo.org/records/23474553) carry the same frozen archive, paper and checksum manifest.

## The most valuable next projects

The strongest next assurance step is an unaffiliated specialist audit of the written reduction and equality argument. On the research side, useful targets are a reproducible reconstruction of the certificate-generation pipeline, proof-assistant formalisation of the semantic bridge, and a genuinely new rank-four inequality rather than an unsupported reuse of the rank-three coefficient.

## What is in the evidence package

The release includes the standalone paper and source, three covariant basis files, the rational sum-of-squares and equality certificates, rank-relation generators, exact verification and mutation scripts, the mixed-extension regression, recorded producer replays, structured claims, source and citation audits, licensing, provenance, assurance limits and an AI-readable index.
