## Summary

**In one sentence.** A 1986 conjecture said that a certain matrix built from permanents never has an eigenvalue larger than the permanent itself; this candidate shows that, for $n\times n$ matrices, the worst violation grows like $\tfrac12\log n$ over the real numbers and like $\log n$ over the complex numbers, and that it already happens at the smallest possible ranks.

**The problem.** The *permanent* of a square matrix is the determinant's sign-free cousin: add up the products of the entries along every permutation, with no minus signs. Take a positive semidefinite matrix $A$ of order $n$, that is, a table of inner products $a_{ij}=v_i^*v_j$ of $n$ vectors. From the permanents of its minors build the companion matrix

$$F_A=\bigl(a_{ij}\,\mathrm{per}\,A(i,j)\bigr)_{i,j=1}^n,$$

where $A(i,j)$ deletes row $i$ and column $j$. Expanding the permanent along a row shows that every row of $F_A$ adds up to $\mathrm{per}\,A$, so the permanent is always one of its eigenvalues. In 1986 Bapat and Sunder conjectured that it is always the **largest** one. Write

$$B(A)=\frac{\lambda_{\max}(F_A)}{\mathrm{per}\,A}\ \ge 1,$$

so the conjecture says $B(A)=1$.

**Why it matters.** The question belongs to a family of "permanent conjectures" that grew out of Lieb's 1966 work on permanents, several of which have recently fallen. It also has a physical meaning. When photons pass through an interferometer, the probability that all of them bunch into a few chosen output modes is a permanent. Making the photons slightly distinguishable, by small time delays, can raise that probability exactly when an eigenvalue of the relevant $F$ exceeds the permanent. So $B$ measures how much time delays can enhance bunching in principle.

**What was known.** Drury (2018) found a complex counterexample of order eight. Chalmers (2026) found a real one, an integer Gram matrix of rank four and order 32, and asked for the smallest rank and order of a real counterexample. A 2026 preprint by liqsweep showed that real matrices of rank at most two satisfy the conjecture. Nobody knew how large $B$ can get.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| Growth rate | The worst value of $B$ over $n\times n$ correlation matrices is about $\tfrac12\log n$ over the reals and $\log n$ over the complex numbers. The upper bounds are explicit, $\tfrac12\log n+\tfrac52$ and $\log n+5$; the lower bounds match up to an error of order $\log\log n$ | Theorem 1.1 |
| Smallest ranks | Real matrices of rank three and complex matrices of rank two already reach these values. So three is the smallest real rank at which the conjecture fails, which answers Chalmers's question; the rank-two theorem it relies on is proved in full in the appendix | Corollary 1.2, Appendix A |
| A small checkable example | A real counterexample of rank three and order 27 with integer vectors (the previous real example had order 32), with $B>1.0036$, checked in exact arithmetic | Section 8.1 |
| Higher compounds | For the higher "permanental compounds" $C_k$, Pate (2008, Theorem 7) stated an inequality for 0/1 test vectors for every order $k$. It is true for $k=1$ (Pate's Corollary 3) but fails by an unbounded amount for every $k\ge2$; an explicit 0/1 vector for $k=2$ gives the ratio $1.1508$ | Corollary 7.1, Section 8.3 |

**Credit.** Once one knows that $F_A$ satisfies the inequality on 0/1 vectors, a general inequality of Lev (2015) already gives $B(A)=O(\log n)$, with a large constant; the paper says so. New here are the sharp constants, the matching construction, the minimal ranks, the order-27 witness and the higher-compound result.

**Concrete numbers.** Exactly certified lower bounds: the order-27 real example has $B>1.0036$; circle examples give $B>1.32$ (real, rank three) and $B>2.64$ (complex, rank two) at order 378, and $B>2.17$ and $B>4.34$ at order 10710.

**Idea of the proof.** For the upper bound, test $F_A$ only on 0/1 vectors: there Lieb's 1966 theorem on block permanents shows that the permanent wins. An arbitrary vector is then rebuilt from 0/1 layers, at a cost of about $\tfrac14\log n$ (doubled for real and quadrupled for complex vectors). For the lower bound, write the permanent as the size (a Gaussian norm) of a polynomial that is a product of linear forms, and place the polynomial's roots on concentric circles whose sizes grow geometrically: every circle adds the same amount to the eigenvalue, while the polynomial's size stays close to one.

**Limits.** Only the first-order constants are sharp: the error is $O(\log\log n)$, and whether it is $O(1)$ is open. The smallest real **order** of a counterexample is unknown (at most 27). The real rank-two exclusion is due to an unrefereed 2026 preprint, reproved in full in the appendix. The optical statement concerns relative enhancement under an idealised Gaussian-delay model, not an experiment. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computation only.

## Summary for specialists

Let $\mathbb K\in\{\mathbb R,\mathbb C\}$ and let $b_{\mathbb K}(n)$ be the supremum of $B(A)$ over correlation matrices of order $n$ over $\mathbb K$ (diagonal scaling leaves $B$ unchanged). Logarithms are natural.

- **Theorem 1.1** *(proof)*: there is an absolute constant $C_0$ such that, for all large $n$,

$$\tfrac12\log n-C_0\log\log n\le b_{\mathbb R}(n),$$

$$b_{\mathbb R}(n)\le\tfrac12\log n+\tfrac52,$$

$$\log n-C_0\log\log n\le b_{\mathbb C}(n),$$

$$b_{\mathbb C}(n)\le\log n+5,$$

  and the lower bounds are attained by real correlation matrices of rank three and complex ones of rank two. So $b_{\mathbb R}(n)\sim\tfrac12\log n$ and $b_{\mathbb C}(n)\sim\log n$.
- **Corollary 1.2** *(proof)*: the smallest rank with $B(A)>1$ is three over $\mathbb R$ and two over $\mathbb C$. Real rank at most two gives $B=1$ by liqsweep's theorem, reproved in Appendix A; complex rank one gives $F_A=(\mathrm{per}\,A/n)\mathbf 1\mathbf 1^{\mathsf T}$.
- **Lemma 2.1 and Proposition 2.4** *(proof)*: with $R(G)=\max_E \mathbf 1_E^*G\mathbf 1_E/|E|$ and $d_m=\sum_{j\le m}(\sqrt j-\sqrt{j-1})^2<\tfrac54+\tfrac14\log m$, every positive semidefinite $G$ has $\lambda_{\max}(G)\le4d_mR(G)$, and $\le2d_mR(G)$ if $G$ is real. Lemma 2.3 gives $R(F_A)=\mathrm{per}\,A$, hence $B(A)\le4d_n$ and, for real $A$, $B(A)\le2d_n$. Remark 6.1: the constants 2 and 4 are asymptotically optimal even for permanental matrices.
- **Corollary 7.1** *(proof)*: for each fixed $k\ge2$ there are real correlation matrices $D$ of order $kn$ and rank $3k$ with

$$R(C_k(D))\ge c_k(\log n)^{k-1}\,\mathrm{per}\,D,$$

  so Pate's Theorem 7 fails for every $k\ge2$; for $k=1$ it is Pate's Corollary 3 (Lemma 2.3).
- **Section 9** *(proof, under the Pioge–Novo–Cerf Gaussian-delay model)*: in real orthogonal interferometers with real overlaps, the normalised curvature of the bunching probability into three output modes is unbounded, and three designated modes is the minimum at which time delays can enhance bunching.

**Known and new.** Bapat and Sunder posed the question (their Conjecture 3) and proved the stronger Schur-power statement for $n\le3$; Pate proved it for entrywise nonnegative $A$ and proved the 0/1 inequality for $k=1$. Drury gave the first counterexample (complex, rank two); Chalmers the first real one (rank four, order 32); liqsweep the real rank-two theorem. Lev's Theorem 2 with the 0/1 bound already gives $O(\log n)$ (Remark 2.5). Lieb's theorem is used as stated and proved by Djoković (1969). New here, within a literature search of limited scope: the sharp constants $\tfrac12$ and $1$, the matching low-rank construction, the minimal real rank, the order-27 witness, the failure of Pate's Theorem 7 for $k\ge2$, and the optimality of the layer-cake constants.

## Technical account

**Upper bound.** Lieb's theorem on block permanents says that $t\mapsto\mathrm{per}\,A(t)$, where the principal block indexed by $E$ is multiplied by $t$, is a polynomial of degree at most $|E|$ with nonnegative coefficients. Differentiating at $t=1$ shows that $\mathbf 1_E^*F_A\mathbf 1_E\le|E|\,\mathrm{per}\,A$ for every nonempty $E$ (Lemma 2.3). A nonnegative vector $y$ with decreasing entries is a sum of layers $(y_j-y_{j+1})\mathbf 1_{E_j}$, and summation by parts with Cauchy–Schwarz turns the 0/1 bound into $\lambda_{\max}\le 2d_m R$ for real vectors; splitting a complex vector into four nonnegative parts gives the factor 4. Since $d_n\approx\tfrac14\log n$, the upper bounds follow.

**Polynomial representation.** For $A=(v_i^*v_j)$ put $\ell_i(z)=v_i^{\mathsf T}z$. In the Gaussian (factorial) inner product the Wick formula gives

$$\mathrm{per}\,A=\|P\|^2,\qquad P=\prod_i\ell_i,$$

and $x^*F_Ax=\sum_p\|Q_p\|^2$, where $Q_p=\sum_ix_iv_{ip}\prod_{j\ne i}\ell_j$ (Lemma 3.1). So $F_A\succeq0$, and $B(A)$ is a ratio of polynomial norms.

**Low-rank realisation.** Given nonzero roots $c_1,\dots,c_S$ and $M>S$, Lemma 4.1 builds a real Gram matrix of rank three (from $M$ equatorial unit vectors and $S$ vectors lifted by the $c_j$) and a complex one of rank two, both of order $M+S$, such that

$$B(A)\ \ge\ \frac{M}{M+S}\cdot\frac{\bigl|\sum_j x_j/c_j\bigr|^2}{\Delta\,\sum_j|x_j|^2},$$

where $\Delta$ is an exact norm of the polynomial $\prod_j(1+w/c_j)$ (with an auxiliary variable in the real case) and is at most its squared factorial norm.

**Concentric circles.** Put $k$ roots equally spaced on a circle of radius $\sqrt{ak}$. With the test vector $x_j=\mathrm{Re}(1/c_j)$ (real) or $x_j=1/\overline{c_j}$ (complex), each circle contributes $1/(2a)$ or $1/a$ to the quotient, whatever its size. One circle costs the factor $1-w^k/(ak)^{k/2}$, whose squared norm $1+k!/(ak)^k$ is close to one when $a>1/e$. With circle sizes growing geometrically, $k_{s+1}=\lceil rk_s\rceil$, an entropy estimate keeps the cross terms small whenever $1+\log a$ exceeds an explicit function $h(r)$ (Lemma 5.1), so $L$ circles give a quotient of $L/(2a)$ or $L/a$ at norm close to one. Section 6 takes $r=1+\delta$ with $\delta=(\log n)^{-1/2}$ and $a$ just above $e^{h(r)-1}$. Then $a\log r\to1$, while the number of circles that fit into order $n$ satisfies $L\log r\ge\log n-O(\log\log n)$. So $L/(2a)$ and $L/a$ are $\tfrac12\log n$ and $\log n$ up to $O(\log\log n)$, which are the lower bounds of Theorem 1.1.

**Higher compounds and block sums.** Block sums do not amplify the ratio, $B(A\oplus A')=\max\{B(A),B(A')\}$ (Remark 6.2). For $C_k$, taking $k$ copies of a real rank-three example and the $k$-subsets that pick one index from each block multiplies the gains, which gives the $(\log n)^{k-1}$ growth of Corollary 7.1.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/bapat-sunder-eigenvalue-ratio-growth.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 14-page paper, which opens with a plain introduction (the question, why it matters, what was known, the results, a roadmap) and ends with open problems, the real rank-two theorem in an appendix, and an AI-use statement. No proof assistant was used.
- **Order-27 witness, two ways.** `code/certificate.dat` holds 27 integer vectors in $\mathbb Z^3$ and an integer test vector. `certificate_order27.py` computes $\mathrm{per}\,A$ and $x^{\mathsf T}F_Ax$ exactly through the norm identities of Lemma 3.1 and certifies $1.00039<x^{\mathsf T}F_Ax/(\mathrm{per}\,A\,|x|^2)<1.00040$. `independent_order27.py` uses a different method (Kronecker packing of polynomials into big integers), forms the whole matrix $F_A$, checks that it is symmetric with every row sum equal to $\mathrm{per}\,A$, matches direct permutation sums on the first seven prefixes, and evaluates a stored integer eigenvector exactly, which certifies $B(A)>1.0036$.
- **Circle examples.** `shell_certificate.py` evaluates the exact norms $\Delta$ of Lemma 4.1 in rational arithmetic and certifies $B>1.321302$ and $B>2.173910$ (real rank three) and $B>2.645706$ and $B>4.348254$ (complex rank two) at orders 378 and 10710.
- **Second compound.** `indicator_certificate.py` counts the 0/1 support of the test vector for $C_2$ of a rank-six real matrix of order 21420 in two independent ways and certifies a binary Rayleigh ratio above $1.15084$.
- **Tests that can fail.** All arithmetic is exact (integers and fractions, Python standard library only). No check uses `assert`, so the scripts behave identically in Python's optimised mode. Changing one entry of the order-27 test vector makes both order-27 scripts fail; raising one enclosure of the circle examples by $10^{-6}$ makes that script fail.
- **Replay.** Every script was rerun from fresh copies before release under Python 3.12, normally and in optimised mode; every recorded output was reproduced byte for byte. GitHub CI reruns the scripts on Linux as a blocking job, compares the outputs byte for byte and runs the three failure tests.
- **Review.** Five internal reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as one combined Claude pass, followed by the lead's own proof audit and the exact-arithmetic certificates with a clean replay. The revision credited Lev's inequality with the $O(\log n)$ order, rewrote the rank-two appendix step by step, rebuilt the introduction for non-specialists, and added the explicit upper constants, the complex finite examples and the certified order-27 eigenvalue bound. The Bapat–Sunder and Pate papers were read in full, and the correction of Pate is scoped to his Theorem 7 for $k\ge2$. A verification re-review and proof audit of all new and rewritten proofs found two must-fix items (a misprinted rescaling identity and the attribution of the first rank-two counterexample to Drury), both applied. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** First-order constants only, with an $O(\log\log n)$ gap; the minimal real order is open (at most 27); the real rank-two exclusion rests on an unrefereed preprint, reproved in the appendix; the optics is a statement about an idealised model. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on permanent inequalities | The exact growth rate of the Bapat–Sunder ratio, the minimal ranks, an order-27 integer counterexample, and the failure of Pate's 0/1 inequality for higher compounds | Leading constants only; the minimal real order and the second-order term are open |
| Quantum-optics theorists studying photon bunching | How large time-delay enhancement of multimode bunching can be in principle, and the minimum of three designated modes for real interferometers | Worst-case mathematical bounds under an idealised Gaussian-delay model, not experimental predictions |
| Matrix analysts | A layer-cake inequality with optimal constants and a low-rank Gram construction for prescribed polynomial roots | The constants are asymptotically optimal, not optimal at every size |
| Research agents | Machine-readable claims, an agent index and exact replayable certificates with failure tests | The certificates cover the finite examples; the proofs carry the asymptotic theorems |

## Why the problem matters

Permanents count things that determinants cannot: perfect matchings, and the amplitudes of identical bosons. Inequalities that compare a permanent with other quantities built from the same matrix were long believed to hold, and a series of them have now been disproved. Knowing that the Bapat–Sunder violation grows only logarithmically, with sharp constants, and that it needs rank three over the reals, turns a yes-or-no counterexample story into a measured one, and in optics it bounds how much partial distinguishability can raise the chance that photons bunch.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with any CPython 3.12 or later (no packages needed):

```sh
shasum -a 256 -c MANIFEST.sha256
P="python3 -O -I -B"
$P code/certificate_order27.py
$P code/independent_order27.py
$P code/shell_certificate.py
$P code/indicator_certificate.py
```

Each script runs in seconds; compare its output with the file of the same name in `results/`, which it should match byte for byte. `ENVIRONMENT.txt` records the software used and the comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide whether $b_{\mathbb R}(n)=\tfrac12\log n+O(1)$, closing the $\log\log n$ gap.
2. Find the smallest order of a real counterexample, now known to be at most 27.
3. Decide whether the $(\log n)^{k-1}$ growth for the compounds $C_k$ is optimal, and which other blocks of the Schur power matrix can exceed the permanent for real matrices.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the order-27 data file and the four certificate scripts in `code/`, with their recorded outputs in `results/`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
