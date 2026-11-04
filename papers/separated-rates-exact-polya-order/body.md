## Summary

**The picture.** A job passes through $m$ slow stages, one after another, each taking an exponentially distributed time with its own rate $a_1<a_2<\dots<a_m$. Then comes one last stage that is faster than all of them, but whose speed is itself random: its rate is drawn from some distribution on $[b_0,\infty)$, with $b_0>a_m$. Waiting times of this shape (phase-type or Coxian lifetimes) are standard models in queueing, reliability and service systems. This paper asks how "well behaved" the density of the total time is, in two precise senses.

**Sense one: Pólya frequency order.** A density $f$ is a **Pólya frequency function of order $r$** ($PF_r$) if every "shift matrix" $[f(x_i-y_j)]$ of size at most $r$, built from increasing points, has a nonnegative determinant. Order two is the familiar property of **log-concavity**. Higher orders are progressively stronger forms of *variation-diminishing* smoothing: smoothing a signal with a $PF_r$ density can never add sign changes, up to a level set by $r$. A density that has every order is called $PF_\infty$.

**Sense two: matrix lifts.** A density with Laplace transform $\phi$ has a **matrix lift** in dimension $d$ if there is a random $d\times d$ positive semidefinite complex Hermitian matrix $W$ with $\mathbb E\,e^{-\operatorname{tr}(SW)}=\prod_i\phi(\lambda_i(S))$. Gamma laws lift to Wishart laws in this way. Suvrit Sra's recent work on Macdonald $(q,t)$-permanents needs exactly such lifts for a particular $q$-product.

**The headline: exactly $m+1$, never more.** If the last stage's speed is genuinely random (not a fixed number), then:

- the density has Pólya frequency order **exactly $m+1$**: it is $PF_{m+1}$, and the next test fails because the derivative Wronskian $W_{m+2}$ is strictly negative at *every* positive time;
- a matrix lift exists **precisely in dimensions $d\le m+1$**.

So each slow stage buys one more degree of regularity, and the randomness of the fast stage caps it. If the fast stage has a fixed speed, the density is a classical $PF_\infty$ convolution and lifts exist in every dimension. No moments of the random rate are needed.

**The application.** Sra's Conjecture 6.1 (version 1 of *The Macdonald $(q,t)$-permanent II*, 29 October 2026) asks for which $0<q<1$ and $0\le t<1$ a $d$-dimensional matrix law exists. The theorem answers it completely: exactly when $t<1$ and
$$t\in[0,q^{d-1}]\ \cup\ \{q,q^2,\dots,q^{d-2}\}.$$
Sra had proved that nothing else works, that the isolated points work, and the case $d=2$; the part proved here is the continuous range for $d\ge3$.

**What it does not do.** The sharp cutoff is proved for complex Hermitian matrices; real symmetric and quaternionic cutoffs remain open. The distribution class and the scalar tools are classical, and the conjecture being proved was posed only days earlier, so this is not a long-standing problem.

The sections below move from this overview to a specialist summary, the technical argument, evidence and limits, and how to rerun the checks.

## Summary for specialists

Let $E_a(x)=ae^{-ax}\mathbf 1_{x>0}$, $0<a_1<\dots<a_m<b_0$, $\mu$ a probability measure on $[b_0,\infty)$, $g=\int E_b\,\mu(db)$ and $f_m=E_{a_1}*\dots*E_{a_m}*g$, with $\phi_m(s)=\prod_i\frac{a_i}{a_i+s}\int\frac{b}{b+s}\mu(db)$ and $W_r=\det[D^i(-D)^jf_m]_{i,j=0}^{r-1}$.

- **Theorem 1.** $f_m$ is $PF_{m+1}$ with $W_r>0$ on $(0,\infty)$ for $r\le m+1$, and complex Hermitian lifts exist for $d\le m+1$ with continuous, strictly positive densities on the positive definite cone. If $\mu$ is not a point mass, $W_{m+2}<0$ on $(0,\infty)$, so the exact order is $m+1$ and a lift exists iff $d\le m+1$. If $\mu=\delta_b$, $f_m$ is $PF_\infty$ with lifts in every dimension. For $m\ge1$, translation minors of order $k\le m+1$ are strictly positive exactly when $x_i>y_i$ for all $i$. The mixing measure is arbitrary; no moments are assumed.
- **Theorem 4 ($q$-Gindikin).** For $\phi_{q,t}(s)=\prod_{r\ge0}\frac{1+tq^rs}{1+q^rs}$, a dimension-$d$ law exists iff $t\in([0,q^{d-1}]\cup\{q,\dots,q^{d-2}\})\cap[0,1)$. For nongeometric $t=q^\alpha$ the scalar density has exact PF order $\lfloor\alpha\rfloor+1$.
- **Section 6A.** The same exact conclusions under the weak gap $\mu((a_m,\infty))=1$, where the $a_m$ residue may diverge (Proposition 6A.4), and separately for repeated slow rates $a_1\le\dots\le a_m<b_0$ (Proposition 6A.7); closure of $PF_r$ and of lifts under limits (Lemma 6A.1); among $PF_\infty$ slow factors with poles below $b_0$ only finitely many exponentials and a shift can occur (Remark 6A.8, from Schoenberg's representation); real symmetric lifts in every $d\le m+1$ (Proposition 6A.9). The two relaxations together remain open.
- **Section 6.** Ordering is substantive: $E_2*(\tfrac12E_1+\tfrac12E_3)$ has $W_2(\log8)=-13/16384$.

## Technical account

**Signed residues (Section 2).** Partial fractions write $f_m(x)=\sum_ic_ie^{-a_ix}+(-1)^m\int B(b)e^{-bx}\mu(db)$ with $\operatorname{sgn}c_i=(-1)^{i-1}$ and $B>0$: alternating slow residues followed by a tail of one sign. Boundary regularity ($f_m^{(k)}(0+)=0$ for $k\le m-1$) needs no moments of $\mu$.

**Matrix inversion (Section 3).** A signed inverse of the product transform, via the Harish-Chandra–Itzykson–Zuber integral and Andréief's identity, gives a candidate matrix density proportional to the Wronskian-type quotient $D^f_d(x)/\Delta_d(x)$. Rank-one Gaussian convolution, $W\mapsto W+a^{-1}ZZ^*$, adds one slow stage while preserving strict positivity. An orbital identity turns any matrix law into nonnegative translation minors, which is how sharpness transfers between the scalar and matrix sides.

**Inertia induction (Section 4).** With the Hankel matrices $H_r$ of the signed rate measure, $W_r=(-1)^{r(r-1)/2}\det H_r$. A finite-rank lemma based on a common-kernel condition counts positive and negative eigenvalues of $H_r$; induction on $m$ gives $W_d>0$ for $d\le m+1$, and an extended-Chebyshev lemma turns this into a positive eigenvalue density.

**Sharpness (Section 5).** At size $m+2$ the support of the signed measure gains a further atom, the inertia count flips, and $W_{m+2}<0$ everywhere on $(0,\infty)$. Coalescing translation nodes then gives a strictly negative translation determinant, so $f_m$ is not $PF_{m+2}$ and, through the orbital identity, no lift exists in dimension $m+2$ or (by compression) above.

**The $q$-product (Section 7).** For noninteger $\alpha$ with $t=q^\alpha$, $\phi_{q,t}$ factors into $\lfloor\alpha\rfloor$ slow exponential stages times a positive mixture of faster exponentials, proved directly from finite rational products; Theorem 1 then gives the cutoff $t<q^{d-1}$. Geometric points and $t=0$ use explicit Gaussian sums.

**Classical versus claimed.** Hankel signature counting and sign-regularity of exponential sums are classical tools, and the derivative-ensemble framework is that of Förster, Kieburg and Kösters. The contribution claimed is the sharp cutoff, the matrix-dimension equivalence and the conjecture.

## Evidence, assurance and limitations

- **Proofs.** All main claims have written proofs. Remark 6A.8 rests on a cited representation (Schoenberg 1951; Karlin 1968) and is not independently proved.
- **Exact checks.** `verification/verify_exact.py` uses rational arithmetic only. At $q=1/2$, $t=3/16$ (so $2<\alpha<3$) it recomputes Sra's determinant moments $65/224>0$ for $d=3$ and $-13/168<0$ for $d=4$, the latter impossible for a positive semidefinite matrix. It certifies that an order-four translation determinant of the scalar density is negative (about $-5.1\times10^{-15}$ after normalisation, with a rigorous error bound below $1.33\times10^{-74}$), checks the finite-mixture Wronskian tables below and the counterexample $-13/16384$. `verification/verify_extensions.py` checks the Section 6A identities, certified signs and a parity count.
- **Replay.** Both scripts were rerun with `--check`, with and without Python `-O`, from fresh copies with the working directory outside them; all checks are explicit and stay active under `-O`. GitHub CI reruns them.
- **Limits.** Finite checks cannot establish the universal theorem. The distribution class is classical (Sumita and Masuda, 1987). We could not read the full text of Sumita and Masuda (1987); its abstract and its 30 citing papers (Semantic Scholar, November 2026) show no sign of an exact PF-order or matrix-dimension result. The sharp theorem was not located in the sources we could read, and references to any earlier statement are welcome. Open questions: the weak gap and repeated rates together, and the sharp real symmetric and quaternionic cutoffs.

**Exact sign tables** (slow rates $1,\dots,m$, fast mixture $\tfrac12E_{m+1}+\tfrac12E_{m+2}$, at $x=\log2$):

- $m=0$: $W_1=1/2$, $W_2=-1/16$; lifts only for $d=1$.
- $m=1$: $W_1=17/32$, $W_2=67/128$, $W_3=-21/256$; lifts for $d\le2$.
- $m=2$: $W_1=19/48$, $W_2=235/384$, $W_3=29/8$, $W_4=-255/128$; lifts for $d\le3$.

The first negative Wronskian is always $W_{m+2}$. These values check the formulas; Theorem 1 supplies the universal statement.

## Who should care, and why

- **Researchers in total positivity**: an exact, not just sufficient, PF order for a natural classical family, with a strictly negative next Wronskian at every point.
- **Random-matrix theorists**: a clean equivalence between the scalar PF order and the largest dimension of a Wishart-type matrix lift, and the full parameter region for Sra's $q$-product.
- **Applied probabilists using phase-type or Coxian lifetimes**: a way to read off exactly how much variation-diminishing smoothing a staged lifetime provides, from the number of slow stages, provided the last stage is faster than all of them.

## Why the problem matters

Total positivity links probability, approximation theory and random matrices, but most results give sufficient conditions or the all-or-nothing $PF_\infty$ case. Exact finite orders are rarer and harder to certify, because one must show that a determinant of the next size is negative somewhere. Here it is negative everywhere, and the same integer controls the matrix side, which is what lets a scalar computation settle which matrix laws exist in Sra's problem.

## How to inspect or reproduce the recorded checks

From the unpacked archive (Python 3.10 or later, standard library only), run the verifiers by path from a directory outside the package:

```sh
cd /tmp
python3 -I -B separated-rates-exact-polya-order-0.1.0-candidate/verification/verify_exact.py --check
python3 -O -I -B separated-rates-exact-polya-order-0.1.0-candidate/verification/verify_exact.py --check
python3 -I -B separated-rates-exact-polya-order-0.1.0-candidate/verification/verify_extensions.py --check
```

The first prints `PASS: every exact check and the stored JSON comparison.`; the extension check prints `CHECK PASSED: all Section 6A checks reproduce stored results` after about ten seconds. With `--check` the stored JSON is compared, not rewritten.

## The most valuable next projects

1. Prove or refute the exact cutoff when repeated slow rates and a fast measure accumulating at the last slow rate occur together.
2. Find the sharp real symmetric ($\beta=1$) and quaternionic ($\beta=4$) dimensions; only the real lower bound $m+1$ is proved.
3. Classify which rational pole–zero configurations beyond separated rates admit finite-dimensional lifts.
4. Compare the result with the full text of Sumita and Masuda (1987).

## What is in the evidence package

The archive contains the manuscript (PDF, canonical Pandoc Markdown source and generated LaTeX), the two exact verifiers with their recorded outputs and a note justifying the tail bounds, the admissibility diagram with its plotting source, a claims ledger, the dated prior-art reports and target records, provenance of the primary sources inspected, the bibliography with the Crossref records it was copied from, an AI index, research-gate records, CI configuration and SHA-256 sums. Text and data are CC0-1.0 and code is MIT. This release is unrefereed and has had internal AI-assisted review only.
