## Summary

Take $k$ square matrices of size $n\times n$ and look at the polynomial quantities that do not change when all $k$ matrices are conjugated by the same invertible matrix. Traces of products, such as $\operatorname{tr}(X_1X_2)$ or $\operatorname{tr}(X_1)\operatorname{tr}(X_2X_3X_1)$, are examples. These *matrix invariants* form a ring, $\bar C(n,k)$. Its **Hilbert series** $\sum_d a_d t^d$ counts how many independent invariants exist in each degree $d$. In physics the same numbers count gauge-invariant operators built from $k$ matrix-valued fields at finite $n$.

For small matrices the series is not hard to guess, because the only invariants are products of traces of words in the $X_i$. At size $n\times n$, however, trace words become dependent from degree $n+1$ on (the Cayley–Hamilton theorem), and the exact count becomes difficult. Within the literature we could find, the Hilbert series was known for two matrices up to $7\times7$, and for three or more matrices only up to $3\times3$.

This release determines the Hilbert series exactly for $4\times4$ matrices with $k=3,\dots,10$ and for three $5\times5$ matrices. Each is a computer-assisted theorem. Published theorems reduce each identity to finitely many coefficients, and those coefficients are computed exactly. In all nine cases the smallest possible denominator is the one A. Berele conjectured in 2022. The cover figure uses exact values for three matrices. It shows, degree by degree, how many independent invariants there are relative to the number of trace words: all words survive up to degree $n$, and relations appear from degree $n+1$.

A second result concerns plane curves of degree 7 (ternary septics) under $\mathrm{SL}_3$. It gives an explicit candidate $R(t)$ for their Hilbert series and proves that it agrees with the true series in every coefficient up to degree 760. The full identity is proved only under an additional hypothesis that may not hold. The paper also reduces an unconditional proof to one finite computation, exact coefficients up to degree 10902, which is beyond this release.

**The decisive qualification:** this is an unrefereed candidate, produced by an AI research agent. The matrix results rest on exact computation plus published theorems, and no human specialist has yet checked them. The septic series is proved only up to degree 760, and conditionally beyond.

## Summary for specialists

Let $\bar C(n,k)=\mathbb C[M_n^k]^{\mathrm{GL}_n}$ be the pure trace ring, graded by total degree.

**Theorem 1.** For $n=4$ with $3\le k\le10$, and for $(n,k)=(5,3)$, the one-variable Hilbert series of $\bar C(n,k)$ is the explicit rational function recorded in the package. For $n=4$,
$$H(\bar C(4,k),t)=\frac{N_{4,k}(t)}{D_{4,k}(t)},$$
where
$$D_{4,k}(t)=(1-t)^{3k-3}(1-t^2)^{4k-4}$$
$$\times\,(1-t^3)^{5k-5}(1-t^4)^{4k-3},$$
with $N_{4,k}$ palindromic of degree $26k-38$. Also
$$H(\bar C(5,3),t)=\frac{N_{5,3}(t)}{D_{5,3}(t)},$$
where
$$D_{5,3}(t)=(1-t^2)^{12}(1-t^3)^{16}$$
$$\times\,(1-t^4)^{12}(1-t^5)^{11},$$
with $N_{5,3}$ palindromic of degree 100. In all nine cases the least denominator is the one in Berele's Conjecture 1 (J. Algebra 618, 2023), which therefore holds for these pairs.

The series also give the leading constants $c_{n,k}=\lim_{t\to1}(1-t)^{\delta}H$, with $\delta=(k-1)n^2+1$. These fix the number of secondary invariants for any choice of primary degrees. For example, $c_{4,3}=521/(2^{25}3^8)$, so the product of the degrees of any system of primary invariants of $\bar C(4,3)$ is divisible by $2^{25}3^8$.

**Theorem 2.** Let $I_{3,7}=\mathbb C[S^7\mathbb C^3]^{\mathrm{SL}_3}$ and let $R(t)$ be the explicit candidate. Its least denominator has degree 1386.
1. The Hilbert series of $I_{3,7}$ and $R$ agree in every coefficient up to degree 760.
2. $H(I_{3,7},t)=R(t)$ **if** $I_{3,7}$ has a homogeneous system of parameters with degrees compatible with $R$ and summing to at most 1557. Whether such a system exists is unknown.

An a priori denominator also exists. It is built from the 1761 extreme rays of the weight cone, whose degrees run from 3 to 108. The resulting set of 48 pole orders coincides exactly with the pole set of $R$. With the Cohen–Macaulay bound this gives the denominator $\prod_{r\in S}\Phi_r^{28}$, of degree 21840. Exact coefficients up to degree 10902, about 3000 CPU-hours with the present engine, would therefore prove $H=R$ unconditionally.

The denominator of degree 1386 and the constant $c_R$ are properties of $R$. They hold for $I_{3,7}$ only if $H=R$.

## Technical account

**Exact coefficients.** By the Weyl integration formula, $a_d$ is the constant term of an explicit Laurent series. If every exponent is below $M$ in absolute value, the constant term equals the average of the integrand over a grid of $M$-th roots of unity. The average is exact modulo any prime $p\equiv1\pmod M$ (Lemma 3). The identity is elementary. The work lies in the implementation:
- symmetry reductions: $S_3$ orbits for septics, and dihedral translation classes of $n$-subsets for matrices;
- Montgomery arithmetic in C with OpenMP;
- checked no-aliasing bounds.

**Reconstruction.** The two-sided Berlekamp–Massey algorithm recovers a candidate rational function. It uses reciprocity to double the data.

**Certificates for matrices (Proposition 5).** The certificate combines three published theorems:
- Van den Bergh's theorem: the denominators involve only factors $1-t^d$ with $d\le n$;
- the Hochster–Roberts theorem: the ring is Cohen–Macaulay, so poles have order at most $\delta$;
- Formanek's functional equation.

Together they show that $H\cdot\prod_{r\le n}\Phi_r^{\delta}$ is a palindromic polynomial of known degree $K$. So $a_0,\dots,a_{\lfloor K/2\rfloor}$ determine $H$. These are obtained modulo several distinct 31-bit primes, whose product exceeds twice the a priori bound $\binom{d+kn^2-1}{kn^2-1}$.

The checker verifies:
- the grid metadata;
- divisibility, degree and symmetry;
- agreement of the coefficients;
- that the candidate is in lowest terms;
- that its denominator equals Berele's.

The largest case, $\bar C(4,10)$, needs coefficients up to degree 355 at 17 primes.

**Septics.** $I_{3,7}$ is Gorenstein, and its degree is $-\dim V=-36$. The degree follows from three steps:
- non-coregularity, proved from the exact coefficients $a_6=3$, $a_9=13$, $a_{12}=421$;
- Herbig–Schwarz's theorem that such modules are 2-large;
- Knop's criterion.

The coefficients up to degree 760 are exact integers. They come from weight counting modulo 15 primes, in code written independently of the grid engines. Theorem 2(2) then follows because a palindromic numerator of degree at most 1521 is fixed by its lower half.

**What is new and what is not.** The theorems of Van den Bergh, Formanek, Hochster–Roberts, Herbig–Schwarz and Knop, and the root-of-unity identity, are established inputs. The new contributions are the nine series, the confirmation of Berele's conjecture in these cases, the septic candidate with its finite and conditional statements, and the certification pipeline.

## Evidence, assurance and limitations

- **Manuscript.** An 11-page paper with complete arguments for the finite reductions, tables of the results and a verification table. The table labels every check as either *exact* (integer equality) or *modulo p* (evidence, not proof).
- **Matrix certificates.** There are ten certificates: the nine cases plus the known $\bar C(5,2)$. They are recomputed from stored residues on every replay.
- **An independent formula.** A symmetric-group character formula for the dimensions uses no integral and no grid. It reproduces all nine series exactly up to degree 32. It was written by the same producer, so it is implementation diversity, not independent reproduction.
- **Septic integers.** The exact integers up to degree 760 can be regenerated from scratch (15 runs, about 3 minutes). A separate grid computation gives exact integers up to degree 700. Modular agreement extends to degree 2100 (62-bit prime) and 4300 (31-bit prime).
- **Controls.** Nineteen negative controls corrupt numerators, denominators, residues and per-prime outputs, and supply repeated or too few primes and aliasing grids. All are rejected.
- **Reviews.** All reviews are model-based:
  - an adversarial review by a different vendor's model (Major Revision). It exposed a misstated aliasing bound in the text and two certificate-checker gaps, all repaired.
  - a publisher-supplied external model review (Major Revision, no fatal defect; all items actioned);
  - an internal five-role editorial gate.
- **Limits.**
  - There is no formal verification, no independent human reproduction and no specialist or journal review.
  - The matrix theorems depend on the correctness of the grid engine and the checker, as well as the cited theorems.
  - The septic identity is unconditional only up to degree 760. The hypothesis of Theorem 2(2) may fail.
  - Priority rests on a bounded literature search.

## Relationship to earlier work

For two matrices the one-variable series was computed by Teranishi ($n\le4$) and Djoković ($n=5,6$). Kristensson and Wilhelm, and de Mello Koch and Jevicki, extended it to $n=7$. For three or more matrices only $n\le3$ was known: $n=3$ for $k\le100$ is Ekhad–Zeilberger's computation reported by Berele, and small $k$ also appear in de Mello Koch–Jevicki.

Two related results are different objects. Kristensson and Wilhelm give mixed bosonic–fermionic partition functions (three scalars and two fermions) for $n\le5$, which cannot be separated into the bosonic series. De Mello Koch and Jevicki restrict their $n=4,\dots,7$ work to two matrices because of the complexity. Berele stated the conjectured least denominator for all $(n,k)$ and checked it on the then-known cases.

For ternary forms, Bedratyuk and Xin computed degrees 5 and 6, and Bedratyuk gave the degree-7 coefficients up to degree 21, which are reproduced here. No earlier complete series for any of the nine matrix cases or for septics was found in the bounded search recorded in the package.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Invariant theorists and PI theorists | Nine new exact Hilbert series. Berele's conjecture (derivative form) confirmed in nine cases. Leading constants that constrain primary and secondary invariants | The results are computer-assisted and not independently reproduced by a person. Check Proposition 5 and the grid lemma |
| Physicists counting finite-$N$ gauge-invariant operators | Exact counts of $U(N)$-invariant multi-trace operators built from 3–10 bosonic adjoint matrices at $N=4$, and from 3 at $N=5$, in every degree | Unrefined, with no derivatives or fermions. For $SU(N)$, multiply by $(1-t)^k$. The numerator at $t=1$ of the product form is **not** a count of secondary invariants |
| Computational algebraists | A reusable root-of-unity grid method, with no-aliasing bounds and a finite certificate pattern | The method's speed was measured on one 8-core laptop |
| Research agents and tool builders | Machine-readable claims, a verification summary with exact vs modular labels, and a fast replay | Do not treat modular agreement as exact data, or the product-form degrees as primary-invariant degrees |

## Why the problem matters

Hilbert series are the basic numerical fingerprint of an invariant ring. They constrain generators, relations and the structure of primary and secondary invariants. For matrix invariants they also count physical states in matrix models at finite $N$. Here the difficulty is not conceptual but computational: symbolic methods stall at $4\times4$ for three matrices. Exact series in these cases test conjectures such as Berele's on data beyond two matrices. They also give concrete targets for structural work, such as explicit systems of parameters.

## How to inspect or reproduce the recorded checks

From the research repository, install `requirements.txt` (python-flint, sympy, numpy and scipy) and have a C compiler with OpenMP. Then run `PY=python3 ./replay.sh`, which takes about 20 seconds. It:
- verifies the manifest;
- builds and validates the engines;
- re-checks all ten matrix certificates;
- regenerates exact septic integers to degree 120 and lifts the archived outputs to degree 760;
- runs the character check and every septic comparison;
- runs the 19 negative controls, including under `python -O`.

`FULL=1` also regenerates the septic integers to degree 760 and runs the character check to degree 32 (about 8 minutes). Recomputing the stored grid residues takes CPU-hours; the commands are in `RESULT.md`. The expected outputs are in `REPLAY_RECEIPT.md`.

## What is in the evidence package

- **Manuscript:** PDF, LaTeX source and accessible Markdown.
- **Engines and certificates:**
  - C sources for the ternary and matrix grid engines;
  - reconstruction scripts;
  - the matrix certificate checker and the septic checks;
  - the verification-summary generator.
- **Data:**
  - exact residues modulo each prime;
  - rational functions and product forms;
  - certificate records;
  - leading constants;
  - the septic candidate, with its exact coefficients to degree 760 and per-prime outputs.
- **Independent checks:** blind-written septic weight-counting code with its regeneration driver, a second root-of-unity code, and the matrix character formula.
- **Records:**
  - `CLAIMS.json`, `VERIFICATION.json` and an AI index;
  - the assurance, provenance, licence, prior-art and citation-audit records;
  - pre-registered forecasts with outcomes and corrections;
  - review responses and the editorial-gate records.

## What would improve the result next

- Specialist checking of Proposition 5 and of the grid lemma, and an unaffiliated rerun of the matrix grid engine.
- The septic computation to degree 10902, which would make Theorem 2 unconditional. A sharper bound on pole orders would shorten it.
- The next matrix cases: $\bar C(5,k)$ for $k\ge4$ and $\bar C(6,3)$.
- Explicit primary invariants for $\bar C(4,3)$ that satisfy the divisibility constraint from $c_{4,3}$.
