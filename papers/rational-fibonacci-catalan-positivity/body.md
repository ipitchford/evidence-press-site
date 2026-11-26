## Summary

**In one sentence.** A family of polynomials built from Fibonacci numbers, the rational Fibonacci–Catalan polynomials, was observed six years ago to have only nonnegative coefficients in every computed case; this release proves it for every pair of indices, finds the exact leftover denominator in all other cases, classifies the analogous products for reflection groups, and proves the companion unimodality conjecture whenever the smaller index is at most seven.

**The objects.** Many counting formulas are ratios of products of whole numbers: the binomial coefficient "$m+n$ choose $n$", or the Catalan numbers that count staircase paths. Take such a formula and replace each whole number $j$ by the Fibonacci number $F_j$ (1, 1, 2, 3, 5, 8, 13, …). Then replace each resulting number $u$ by the polynomial

$$[u]_q = 1 + q + q^2 + \cdots + q^{u-1},$$

which has $u$ terms and is called a *$q$-integer*. Starting from the binomial coefficient gives the *$q$-Fibonomial coefficients* $P_{m,n}(q)$; dividing by one more $q$-integer gives the *rational Fibonacci–Catalan functions* $C_{m,n}(q)$ of Bergeron, Ceballos and Küstner. For example,

$$\begin{aligned}C_{4,3}(q) = {}&1+q+2q^2+2q^3+3q^4\\ &+2q^5+3q^6+2q^7\\ &+2q^8+q^9+q^{10}.\end{aligned}$$

**Why it matters.** When a formula like this turns out to be a polynomial whose coefficients are all nonnegative, mathematicians expect it to count something, sorted by the power of $q$. Bergeron, Ceballos and Küstner (2020) saw nonnegative coefficients in every case they computed, with both indices up to 15, wrote that they had neither a proof nor a combinatorial model, and asked what the coefficients count. They also conjectured that the $q$-Fibonomial coefficients are *unimodal*: their coefficients rise and then fall.

**What was known.** $C_{m,n}$ is a polynomial when $\gcd(m,n)\le 2$, a result of S. X. Li. Unimodality would imply the nonnegativity (observed by F. Aliniaeifard and proved in writing by Connelly, Ito, Martinez, Shevchenko and Yang), and Connelly et al. proved unimodality when the smaller index is at most three. A general algebraic criterion of Gatzweiler, Levicán-Santibáñez and Yoshida gives nonnegativity when the two indices are far apart, $m\ge 2n-3$ for larger $n$, which leaves about half of all pairs open.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| Positivity | $C_{m,n}$ has nonnegative coefficients for every pair with $\gcd(m,n)\le 2$. For every pair, the part that fails to cancel is exactly the $q$-integer of $F_{\gcd(m,n)}$, and the rest counts the dimensions of a graded algebra (a weighted complete intersection) | Theorem 3.1 |
| An explicit formula | The algebra can be written down. For example $C_{10,4}=[89]_q\bigl([72]_{q^2}[77]_{q^3}+q^{231}[48]_{q^3}\bigr)$, which is visibly positive | Example 3.3 |
| Lucas sequences | The same holds when Fibonacci numbers are replaced by other sequences of the same type with coprime positive parameters, such as the Pell numbers | Corollary 4.1 |
| Reflection groups | For the analogous product attached to any finite reflection group, the shifts that give a polynomial are listed exactly, and every one of these polynomials is positive. Every Fuss–Catalan case is positive. The list corrects a condition suggested in the 2020 paper for types $B$ and $D$: for $B_3$ with shift 3 the product is $[21]_q$ | Theorem 5.1, Corollary 5.2 |
| Unimodality | $P_{m,n}$ is unimodal whenever the smaller index is at most seven (previously three), on a set of pairs of density about 0.408, and, with strict increase to the middle, for each fixed smaller index once the larger one is large enough | Theorems 6.1, 7.1, 8.1, 9.1 |

**Idea of the proof.** After cancelling, the quotient is a product of factors $(1-q^{e})/(1-q^{w})$, with "big" degrees $e$ on top and "small" degrees $w$ below. Such a product counts monomials in a quotient ring (a weighted complete intersection) when, for every group of small degrees, enough big degrees can be written as sums of them. Fibonacci numbers make this checkable. Divisibility of Fibonacci numbers follows divisibility of their indices, and a coin-problem bound shows that the big degrees are large enough to be such sums, uniformly, even when the two indices are close. For unimodality, as the larger index grows the coefficient profile approaches a smooth spline built from intervals of lengths $1,\varphi,\varphi^2,\ldots$ ($\varphi$ the golden ratio), and that spline is strictly peaked. Exact rational arithmetic with explicit error bounds turns this into a proof for widths five, six and seven.

**Limits.** The algebra gives a basis, but *not* a combinatorial interpretation on the path-domino tilings of the 2020 paper, so their open problem in its intended sense remains open. The full unimodality conjecture remains open. Widths five to seven and the exceptional reflection groups rely on exact, rerunnable computer certificates. Galois-twisted non-crystallographic cases and reducible groups are not treated. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact replays.

**Credit.** Polynomiality is due to S. X. Li; the link from unimodality to positivity to Aliniaeifard and Connelly et al.; the complete-intersection criterion and the widely separated case to Gatzweiler, Levicán-Santibáñez and Yoshida.

## Summary for specialists

Let $[u]_q=(1-q^u)/(1-q)$, $P_{m,n}=\prod_{j=1}^n[F_{m+j}]_q/[F_j]_q$, $C_{m,n}=P_{m,n}/[F_{m+n}]_q$ and $g=\gcd(m,n)$.

- **Theorem 3.1** *(proof)*: the reduced denominator of $C_{m,n}$ is $[F_g]_q$, and $[F_g]_qC_{m,n}=\prod_{i=m+1}^{m+n-1}(1-q^{F_i})/\prod_{j\le n,\,j\ne g}(1-q^{F_j})$ is the Hilbert series of an Artinian weighted complete intersection. Hence $C_{m,n}\in\mathbb Z_{\ge0}[q]$ iff $g\le2$.
- **Remark 3.2** *(proof)*: the separated-degree condition of Gatzweiler–Levicán-Santibáñez–Yoshida (GLY, Thm 3.9) applies exactly when $m\ge2n-3$ for $n\ge7$; Theorem 3.1 adds the range $n\le m\le2n-4$ and the exact denominator for every $g$.
- **Corollary 4.1** *(proof)*: for $U_{k+2}=sU_{k+1}+tU_k$ with coprime positive $s,t$, the reduced denominator is $[U_g]_q$ and the numerator is a complete-intersection Hilbert series.
- **Theorem 5.1**: for an irreducible finite Coxeter group with degrees $D$ and $H_{D,a}=\prod_{d\in D}[F_{a+d-1}]_q/[F_d]_q$ (untwisted), $H_{D,a}\in\mathbb Z[q]$ iff $H_{D,a}\in\mathbb Z_{\ge0}[q]$, and the admissible $a$ are: $\gcd(a,r+1)\le2$ in type $A_r$; $a$ odd in types $B_r$, $D_r$; $a\equiv\pm1\pmod k$ for $I_2(k)$; $\gcd(a,6)=1$ for $G_2,F_4,E_6,E_7$; $\gcd(a,30)=1$ for $E_8$; $a\equiv1,5,9\pmod{10}$ for $H_3$; $a\equiv1,11,19,29\pmod{30}$ for $H_4$. Proofs for $A$, $B$, $D$, $I_2$; exceptional rows by two independent exact certificates. **Corollary 5.2**: every Fuss shift $a=kh\pm1$ is admissible.
- **Theorem 6.1** *(proof)*: $P_{m,n}$ is unimodal when $\gcd(m,n)$, $\gcd(m-1,n)$, $\gcd(m,n-1)\le2$; density $\tfrac{13}{16}\prod_{p\text{ odd}}(1-3/p^2)\approx0.408$.
- **Theorem 7.1** *(proof)*: for each $n\ge4$ the coefficients increase strictly to the centre for $m\ge m_0(n)$ (not made effective in general).
- **Theorems 8.1 and 9.1**: unimodality whenever $\min(m,n)\le7$, strict to the centre for $4\le\min(m,n)\le7$ except $(4,4)$; width four by proof, widths five to seven by exact certificates.

**Known and new.** The support criterion for weighted complete intersections is GLY's Proposition 3.3 (credited there to Pizzato, Sano and Tasin). The new ingredient is the Fibonacci conductor bound (Lemma 2.2) and the uniform count that verifies the criterion near the diagonal, where existing sufficient conditions do not apply; GLY anticipated that special properties of the degree lists could settle such cases (their Remark 3.12). The complete intersection does not answer Bergeron–Ceballos–Küstner's Open Problems 4.3 and 5.4 or Connelly et al.'s Problem 5.7 in their intended combinatorial sense (Remark 3.4).

## Technical account

**Support test.** Variables of degrees $w_j$ admit a regular sequence of degrees $e_i$ iff every set $J$ of variables has at least $|J|$ degrees $e_i$ in the semigroup $\langle w_j:j\in J\rangle$ (Lemma 2.1). Then the quotient $\prod(1-q^{e_i})/\prod(1-q^{w_j})$ is a Hilbert series and has nonnegative coefficients.

**Fibonacci conductor.** If $J$ has minimum $a$, maximum $b$ and gcd $d$, then every $F_s$ with $s\ge a+b-d+1$ and $F_d\mid F_s$ lies in $\langle F_j:j\in J\rangle$ (Lemma 2.2). The proof is a coin-problem bound with residues modulo the smallest scaled generator, plus the addition formula $F_{u+v}=F_uF_{v+1}+F_{u-1}F_v$.

**Main count.** For $J\subseteq\{1,\ldots,n\}\setminus\{g\}$ with $t$ elements and gcd $d$, the interval $[m+1,m+n-1]$ contains at least $t$ multiples of $d$; the removed index $g$ repairs the one case where it would contain one too few. Each chosen index is large enough for Lemma 2.2. Exactness of the denominator is a cyclotomic multiplicity count: every cyclotomic factor of $[F_g]_q$ survives exactly once.

**Reflection groups.** Polynomiality is a cyclotomic test on $\nu_k(a)$, periodic in $a$. Types $B$ and $D$ follow from a positive two-term recursion for $\prod[F_{2(s+j)}]_q/[F_{2j}]_q$; even shifts fail at $\Phi_3$. For the exceptional types the cyclotomic test runs over a full period and the support test uses exact Apéry sets; a second program checks the support test by a different two-generator algorithm.

**Unimodality.** Removing two unit weights and the two largest numerator factors leaves a complete intersection when three gcd conditions hold; multiplying back by $q$-integers preserves symmetric unimodality (Theorem 6.1). For fixed $n$, $T^{-u}\Delta^rp_{\lfloor Tx\rfloor}$ converges to $f^{(r)}$, where $f$ is the convolution of indicators of intervals of lengths $1,\varphi,\ldots,\varphi^{n-1}$; $f'>0$ before the centre and $f''<0$ at it (Theorem 7.1). Width four uses an explicit restricted-partition formula. For widths five to seven, Part A checks every $m$ below a threshold $M$ (50, 60, 70) exactly by residue polynomials, and Part B certifies the spline by Bernstein coefficients with a proved error bound; the margins exceed the error bounds by a factor of at least seven (Section 9).

## Evidence, assurance and limitations

- **Proofs.** Theorems 3.1, 6.1, 7.1 and 8.1, Corollary 4.1 and the infinite families of Theorem 5.1 have written proofs in the 14-page paper, which opens with a plain introduction (the objects, why they matter, what was known, what is new and a roadmap) and ends with open problems and an AI-use statement. No proof assistant was used.
- **Exact certificates.** The exceptional rows of Theorem 5.1 and Theorem 9.1 depend on programs. All seven programs use only the Python standard library and exact integer or rational arithmetic. `verify_type_a.py` checks Theorem 3.1 on 104 pairs (the support test on 8695 subsets), Example 3.3 coefficient by coefficient and Corollary 4.1 on 60 pairs for four parameter choices; `verify_exceptional.py` and `verify_pairs.py` are two independent certificates for the exceptional types; `verify_classical.py` expands 187 classical and dihedral cases; `claims.py` checks the numerical statements; `width_cert.py` produces the certificates for widths four to seven; `replay.py` reruns everything and compares with the recorded outputs.
- **Tests that can fail.** No program uses `assert`; every check raises an error, also in Python's optimised mode. Corrupting the $H_3$ residues, or the positivity check, makes the program fail.
- **Replay.** All nine certificate runs were rerun from a fresh copy before release in optimised mode; every output matched the recorded files. GitHub CI reruns eight of them on Linux as a blocking check, repeats both failure tests, and runs the full replay including width seven as a separate check.
- **Review.** Five internal reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as one combined Claude pass, with every cited source read. They found no critical issue; their main requests concerned context, the exact boundary with the GLY criterion, credit, an overstated counting claim and certificates that relied on `assert`. One revision round rewrote the introduction, computed the GLY boundary exactly, demoted the counting description, and added exact certificates for widths six and seven and the Fuss–Catalan corollary. A verification re-review with a proof audit of every new or rewritten proof left no open correctness issue. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** No combinatorial model on the original tilings; the general unimodality conjecture is open; widths five to seven and the exceptional reflection groups rest on computer certificates; twisted and reducible reflection-group cases are not treated; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on $q$-analogues and Catalan combinatorics | The positivity theorem, the exact denominators and an explicit algebra whose dimensions are the coefficients, as a starting point for a combinatorial model | The algebra is not a tiling statistic; the 2020 open problem remains open in that sense |
| Researchers on cyclotomic generating functions and complete intersections | A worked family where the semigroup criterion can be verified uniformly, and a template for other divisibility sequences | The method needs strong divisibility and a growth bound |
| Coxeter–Catalan combinatorics | The exact table of admissible shifts for Fibonacci analogues, including the correction in types $B$ and $D$ | Untwisted products only; reducible groups not treated |
| Research agents | Machine-readable claims, an agent index and replayable exact certificates with failure tests | The certificates accompany written proofs; they do not replace them |

## Why the problem matters

Rational Catalan numbers and their $q$-analogues sit where lattice-path counting, reflection groups and representation theory meet. A positivity statement is usually the first step towards finding what such numbers count. Proving it for the Fibonacci version, with the exact denominators and an explicit algebra, turns an observation from computed tables into a theorem and narrows what a combinatorial model has to explain.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.9 or later (standard library only):

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B -O code/replay.py
```

Expected: nine PASS lines, then "All nine certificate programs completed." The run takes a few minutes, almost all in the width-seven certificate. `ENVIRONMENT.txt` records the reference environment, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find explicit regular sequences with explicit Gröbner bases for all pairs, or a weight-preserving statistic on the path-domino tilings, to answer the 2020 open problem in its intended sense.
2. Prove the unimodality conjecture for all pairs; an effective $m_0(n)$ would reduce each fixed width to a finite computation.
3. Classify polynomiality and positivity for the Galois-twisted non-crystallographic products and for reducible reflection groups.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the programs `code/verify_type_a.py`, `code/verify_exceptional.py`, `code/verify_pairs.py`, `code/verify_classical.py`, `code/claims.py`, `code/width_cert.py` and `code/replay.py` with their recorded outputs in `results/`; `ENVIRONMENT.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
