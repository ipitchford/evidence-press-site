## Summary

**In one sentence.** A sum of matrices can be bigger than the sum of their absolute values; for the Schatten $p$-norms with $1<p<2$ this release finds the exact worst case whenever there are at least as many matrices as their size, gives a new bound for any number of matrices (for two matrices at $p=3/2$, at most $6.48\%$ extra instead of $12.25\%$), and certifies in exact arithmetic that rank-one examples cannot settle the two-matrix problem.

**The everyday fact, and how it breaks.** For ordinary numbers, $|a+b|\le|a|+|b|$: the size of a sum is never more than the sum of the sizes. A matrix $A$ also has a natural absolute value, $|A|=(A^*A)^{1/2}$, which is what remains of $A$ once its rotation part is removed. For matrices the rule can fail. The sum $A+B$ can be *larger* than $|A|+|B|$, even when size is measured by a norm. The question is how much larger, at worst. The answer is a constant $c$, and the problem is to find the smallest $c$ that always works.

**How size is measured.** The Schatten $p$-norms are the standard family of matrix sizes: $p=1$ is the trace norm (the sum of the singular values), $p=2$ is the Frobenius norm (the square root of the sum of squared entries) and $p=\infty$ is the operator norm. For $m$ matrices of size $n\times n$, the question is the smallest constant $c_p(m,n)$ with

$$\Bigl\|\sum_{k=1}^m A_k\Bigr\|_p\le c_p(m,n)\,\Bigl\|\sum_{k=1}^m |A_k|\Bigr\|_p ,$$

and $c_p(m)$ is the same constant with no limit on the size $n$.

**Who asked, and what was known.** Eun-Young Lee (2010 and 2012) showed that $c=\sqrt m$ always works and asked for the best constant for two matrices; this is now called *Lee's problem*. Lin and Zhang (2022) solved it for $p=2$. Tang and Zhang extended the question to $m$ matrices, proved the bound $m^{(p-1)/(2p)}$ and conjectured a formula; T. Zhang introduced the version with the size $n$ fixed. Qiu (August 2026) proved the formula for every $p\ge2$. Below $p=2$ the formula fails: Zeng, Liu and Ratnavelu, Pang, and Qiu gave counterexamples, all built from rank-one matrices. The October 2026 survey of Bourin and Zhang lists the range $1<p<2$ as open.

**What is new here** (always $1<p<2$).

| Result | In plain terms | Where |
|---|---|---|
| The square case | When there are at least as many matrices as their size ($m\ge n$), the best constant is an explicit one-variable maximum $D_{p,n}$. It depends only on the rank of $\sum|A_k|$, every extreme case is described, and when $m<n$ the best constant is strictly smaller. Example: $D_{3/2,2}=1.0364143573\ldots$ | Theorem 2.1, Theorem 5.2 |
| Rank one solved | For rank-one matrices, the building blocks of every known counterexample, the best constant is $D_{p,\min(m,n)}$ in every dimension | Corollary 2.2 |
| A new general bound | The best constant changes log-convexly with $1/p$, so the known answers at $p=1$ and $p=2$ squeeze it in between: $c_p(m)\le\bigl((1+\sqrt m)/2\bigr)^{1-1/p}$, better than the previous $m^{(p-1)/(2p)}$ for every $m\ge2$. For two matrices at $p=3/2$ the upper bound falls from $1.1225$ to $1.0648$; the true value is at least $1.0364$ | Theorem 2.3, Corollary 2.4 |
| Rank one is not the whole story | For two $3\times3$ matrices with exact rational entries, a computer-assisted proof shows that the best rank-one value $D_{p,2}$ is beaten at nine exponents between $11/10$ and $17/10$. At $p=3/2$ the certified ratio is at least $1.036425091174$, against $D_{3/2,2}\le1.036414357334$ | Proposition 2.5 |

**How it works, without the formulas.** Each matrix is split into a rotation and its absolute value, and the absolute value into two square roots. The sum then becomes a product of two block matrices: one is controlled by the trace of $\sum|A_k|$, the other by $\sum|A_k|$ itself. Hölder's inequality with the right pair of exponents bounds the product, and the bound depends only on the eigenvalues of $\sum|A_k|$. Making it as large as possible is a question about two Rényi entropies of those eigenvalues, and the answer is "one large eigenvalue, the rest equal". This extends T. Zhang's argument for $p=2$; the examples that show the bound is attained are Pang's, with one parameter re-tuned.

**Credit.** T. Zhang (the method at $p=2$), Pang (the examples), Zeng, Liu and Ratnavelu (the $p=3/2$ two-matrix value and the same factorisation for rank-one matrices), Harremoës and Sakai–Iwata (the eigenvalue shape), Qiu ($p\ge2$ and the first numerical higher-rank example, at $p=6/5$) and Li (transfer to concave functions).

**Limits.** The exact constant for two matrices of arbitrary size, Lee's original problem, is still open for $1<p<2$, as is the case $m<n$. The new upper bound is not sharp. The gap between general and rank-one matrices is tiny (from about $3.6\times10^{-5}$ down to $2\times10^{-7}$) and may vanish for $p$ near $2$; the certificate covers nine specific exponents, not an interval. This is an unrefereed candidate, checked only by internal AI-assisted review.

## Summary for specialists

Throughout $1<p<2$, $q=p/(2-p)$ (so $1/p=1/2+1/(2q)$), $D_{p,1}=1$, and for $d\ge2$, with $a=d-1$,
$$D_{p,d}=\max_{x\ge1}\frac{\sqrt{x+a}\,(x^q+a)^{1/(2q)}}{(x^p+a)^{1/p}}.$$

- **Theorem 2.1** *(proof)*: $\|\sum A_k\|_p\le D_{p,r}\|B\|_p\le D_{p,n}\|B\|_p$ with $B=\sum|A_k|$ and $r=\operatorname{rank}B$; $c_p(m,n)=D_{p,n}$ for $m\ge n$ and $c_p(m,n)<D_{p,n}$ for $m<n$. Against T. Zhang's $\min(m,n)^{(p-1)/(2p)}$ the gain tends to $2^{-1/p}$; for example $D_{3/2,10}=1.16995\ldots$ against $10^{1/6}=1.46780\ldots$.
- **Theorem 5.2 and Corollary 5.3** *(proof)*: in an extremal family every nonzero summand has rank one and the summands form a weighted frame of a special shape; Corollary 2.2 gives $D_{p,\min(m,n)}$ for rank-one summands in every dimension.
- **Lemma 3.1** *(proof)*: the maximum of $S_1^{1/2}S_q^{1/(2q)}/S_p^{1/p}$ over the simplex is attained only at permutations of $(x_{p,d},1,\ldots,1)/(x_{p,d}+d-1)$; the shape is a special case of Harremoës and Sakai–Iwata, proved here with uniqueness.
- **Theorem 2.3 and Corollary 2.4** *(proof)*: $1/p\mapsto\log c_p(m,n)$ and $1/p\mapsto\log c_p(m)$ are convex, via a variational formula and the three-lines theorem; hence $D_{p,m}\le c_p(m)\le((1+\sqrt m)/2)^{1-1/p}$, with ratio tending to $2^{(2-p)/p}$ as $m\to\infty$ (against $2^{1/p}$ for the Tang–Zhang bound). For Lee's problem, $1.036425\le c_{3/2}(2)\le1.0647523$.
- **Proposition 2.5** *(computer-assisted proof)*: $c_p(2,3)>D_{p,2}$, hence $c_p(2)>D_{p,2}$, for $p$ equal to $11/10$, $6/5$, $5/4$, $13/10$, $4/3$, $7/5$, $3/2$, $8/5$ and $17/10$, extending Qiu's numerical example at $p=6/5$. At $p=2$ there is no such gap.
- **Proposition 6.2** *(proof)*: $D_{p,d}\sim2^{-1/p}(d-1)^{(p-1)/(2p)}$ as $d\to\infty$, with slow convergence (Remark 6.3); $D_{p,d}\to1$ as $p\to1$ and $D_{p,d}\to\sqrt{(1+\sqrt d)/2}$ as $p\to2$.
- **Corollary 9.1** *(proof)*: a sharp concave-function version, through Li's transfer theorem.

## Technical account

**Factorisation.** Write $A_k=U_kH_k$ with $H_k=|A_k|$ and form the $n\times mn$ block rows $X=[U_1H_1^{1/2}\ \cdots\ U_mH_m^{1/2}]$ and $Y=[H_1^{1/2}\ \cdots\ H_m^{1/2}]$. Then $XY^*=\sum A_k$, $YY^*=B$ and $\|X\|_2^2=\operatorname{Tr}B$. The Schatten–Hölder inequality with exponents $(2,2q)$ gives $\|\sum A_k\|_p\le(\operatorname{Tr}B)^{1/2}(\operatorname{Tr}B^q)^{1/(2q)}$, which depends only on the spectrum of $B$. Dividing by $\|B\|_p$ leaves the scalar problem of Lemma 3.1 on the simplex of rank $r$.

**Sharpness.** Pang's family of two Gram matrices of equiangular unit vectors, with the free parameter set to the maximiser $x_{p,n}$, attains $D_{p,n}$ with $m=n$ rank-one summands; extra summands may be zero, so $c_p(m,n)=D_{p,n}$ for all $m\ge n$.

**Equality and strictness.** Equality forces equality in the rectangular Hölder inequality (Lemma 5.1, proved by a pinching argument), full rank of $B$ and the optimal spectral shape; an isotropy argument for an indefinite form of signature $(1,n-1)$ then forces every summand to have rank one, so an extremal family needs at least $n$ nonzero summands. When $m<n$, the supremum is attained by compactness and cannot equal $D_{p,n}$, because $m$ summands are too few: $c_p(m,n)<D_{p,n}$.

**Interpolation.** Schatten duality turns $c_p(m,n)$ into a supremum of $|\operatorname{Tr}(R\sum_kU_kX_k)|$ over $R$ with $\|R\|_{p'}=1$, unitaries $U_k$ and positive $X_k$ summing to some $Z$ with $\|Z\|_p=1$. Complex powers of $R$ and $Z$ give a bounded analytic function on a strip whose boundary values are admissible at $p_0$ and $p_1$, so the three-lines theorem gives log-convexity; the endpoint values $c_1=1$ and $c_2(m)=\sqrt{(1+\sqrt m)/2}$ give Corollary 2.4.

**The certificate.** For each $p$ the script builds $A_k=O_kH_k$, with $O_k$ the Cayley transform of an exact rational skew-symmetric matrix (so $O_k$ is exactly orthogonal) and $H_k=C_k^{\mathsf T}C_k$ (so $|A_k|=H_k$ exactly). It isolates the eigenvalues of the exact rational Gram matrices with sympy to width $10^{-40}$, encloses $p$-th powers in mpmath interval arithmetic, and bounds $D_{p,2}$ from above through a certified sign change of the critical-point equation and 50 sub-intervals. A run passes only if the lower end of the quotient exceeds the upper end of $D_{p,2}$, and it also checks that the quotient stays below $D_{p,3}$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/schatten-sum-of-moduli-constants.txt) is available for reading.

- **Proofs.** Every result except Proposition 2.5 has a written proof in the 16-page paper, which opens with a plain introduction, a table of what was known, all results stated in Section 2 and a roadmap. No proof assistant was used.
- **Computer-assisted proof.** `certify_rank_gap.py` proves Proposition 2.5 in exact rational and interval arithmetic, with the witnesses in `witnesses.json`. It trusts sympy's exact root isolation and mpmath's interval elementary functions. The certified excess over $D_{p,2}$ runs from $1.96\times10^{-7}$ at $p=17/10$ to about $3.6\times10^{-5}$.
- **Numerical checks.** `verify_schatten.py` runs 128 checks: the scalar constant and its log-convexity, the equality families, random and adversarially optimised families (for $m\ge n$ they approach $D_{p,n}$ but never exceed it), the exact $p=3/2$ value $((107+51\sqrt{17})/256)^{1/6}$, Qiu's $p=6/5$ example, the bounds table, the asymptotics and negative controls. These checks supplement the proofs and do not replace them. Numerically the rank gap is about $8\times10^{-10}$ at $p=1.8$ and was not detected at $p=1.9$; this is not certified.
- **A test that can fail.** When the $p=17/10$ witness is relabelled as $p=9/5$, the certificate prints `STATUS FAIL` and exits with an error under Python's optimised mode, as it must.
- **Replay.** The certificate, the checks and the figure script were rerun from fresh copies of the package before release, normally and under `python -O`; the certificate and check outputs and the figure image matched the shipped files byte for byte. GitHub CI reruns the certificate, the checks and the negative control on Linux.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round. It rewrote the introduction for non-specialists, credited Zhang's method and Pang's examples plainly, added the interpolation bound and the certified rank gap, and fixed smaller points. A re-review, a proof audit and a second-model audit of the new proofs then found no failing result. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** $1<p<2$ only. Lee's exact two-matrix constant, the exact $c_p(m)$ and the case $m<n$ remain open; the interpolation bound is not sharp; the rank gap is certified at nine exponents only. Several sources are recent preprints. This remains an unrefereed candidate, and attributions rest on a bounded literature search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in matrix analysis and operator theory | Exact Schatten-norm constants for the matrix triangle inequality with moduli when $m\ge n$, and the best known general bound for $1<p<2$ | Lee's two-matrix problem and the case $m<n$ remain open |
| Researchers working on Rényi entropies and spectral extremal problems | A matrix problem whose answer is exactly a two-entropy extremum, with uniqueness of the optimal shape | The reduction sees only the spectrum of $\sum|A_k|$ |
| People building computer-assisted proofs | A compact exact-arithmetic certificate (rational Cayley transforms, exact eigenvalue isolation, interval powers) that reruns in seconds | Trusts sympy and mpmath; nine exponents only |
| Research agents | Machine-readable claims, an agent index and checks that rerun in about a minute | The numerical checks supplement the proofs |

## Why the problem matters

The triangle inequality is the most used inequality in analysis, and the matrix modulus is the most natural matrix analogue of an absolute value. Knowing exactly how far the two fail to fit together, in the most commonly used family of matrix norms, is a basic question about matrix inequalities that had been settled only at $p=2$ and above. The answer here shows a clean structure in the square case and shows that the general case needs genuinely new ideas, because the rank-one examples that drove all earlier work are not optimal.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root, with [uv](https://docs.astral.sh/uv/) (use absolute paths to the scripts and run from a directory outside the package):

```sh
shasum -a 256 -c MANIFEST.sha256
uv run --no-project --python 3.12 --with numpy==2.3.5 --with scipy==1.17.0 --with sympy==1.14.0 --with mpmath==1.3.0 python3 -O -I -B verification/certify_rank_gap.py --out /tmp/cert     # about 10 s
uv run --no-project --python 3.12 --with numpy==2.3.5 --with scipy==1.17.0 --with sympy==1.14.0 --with mpmath==1.3.0 python3 -O -I -B verification/verify_schatten.py --out /tmp/checks   # about 45 s
```

Compare each output with the file of the same name in `verification/output/`. `AI_INDEX.md` maps each claim to its proof and checks, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Lee's problem for $1<p<2$: what is $c_p(2)$, and is it attained in some fixed dimension?
2. The case $m<n$: any exact answer must use how $\sum|A_k|$ is split into $m$ pieces, which the factorisation cannot see.
3. The rank gap: does $c_p(2)>D_{p,2}$ hold for every $1<p<2$, or is there a threshold below $2$ above which rank-one examples are optimal?

## What is in the evidence package

The paper (LaTeX source and PDF) with Figure 1; `verification/certify_rank_gap.py` with `witnesses.json`; `verification/verify_schatten.py`; the figure script and figure; the recorded outputs in `verification/output/`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, figures and data, MIT for code), the CI workflow and a SHA-256 manifest.
