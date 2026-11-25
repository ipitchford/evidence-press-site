## Summary

**In one sentence.** For tables of inner products of vectors in a space of fixed dimension, every non-trivial symmetry block of the permanent is, on average, smaller than the permanent once the table is large enough, and for complex vectors the worst block, the standard one, averages only about $(d-1)\log n/n$ times the permanent.

**The problem.** The *permanent* of a square matrix is the determinant without minus signs: add up the products of the entries along every permutation. Take $n$ vectors $v_1,\dots,v_n$ and the table $A=(v_i^*v_j)$ of their inner products, a positive semidefinite *Gram matrix*. The permutations of the $n$ vectors break into symmetry types, one for each way of drawing a Young diagram $\lambda$ with $n$ boxes. Each type has a positive semidefinite matrix block $B_\lambda(A)$ of size $f^\lambda$, and the all-symmetric type gives exactly $\mathrm{per}\,A$. Two averages measure each block against the permanent:

$$m_1=\frac{\mathrm{Tr}\,B_\lambda}{f^\lambda\,\mathrm{per}\,A},$$

$$m_2=\frac{\mathrm{Tr}\,B_\lambda^2}{f^\lambda\,(\mathrm{per}\,A)^2}.$$

So $m_1$ is the average eigenvalue of the block relative to the permanent, and $m_2$ the mean square. Lieb's permanental dominance conjecture (1966), restricted to these ordinary blocks (the immanants), says $m_1\le1$; Lavi's quadratic conjecture (2026) says $m_2\le1$.

**Why it matters.** A stronger guess, "permanent on top", said that the permanent beats every single eigenvalue of every block. It is false, and single eigenvalues can exceed the permanent by a factor of about $\log n$. The averaged inequalities are what may survive. Lavi's version would also imply Chollet's permanent inequality. In optics, Gram matrices of rank $d$ describe photons with $d$ internal modes, and the blocks measure symmetry sectors of the photons.

**What was known.** Lieb's version holds for up to 15 vectors (Pate through order 13; Li for the remaining shapes at orders 14 and 15), and Lavi's up to 5 (Lavi). Pate (1999, Theorem 2) proved Lieb's version for an infinite family of shapes that contains every diagram with at most three rows; since blocks with more than $d$ rows vanish when the vectors span $d$ dimensions, Lieb's version therefore holds for every $n$ at rank at most three. Pate's Theorem 4 gives eventual dominance for the shapes $(n+s,n^k)$, and Li proves it for every fixed tail once the first row is long. For real vectors in a plane both inequalities hold for every $n$, by the rank-two permanent-on-top theorem.

**What is new.** Fix the dimension $d$ of the vectors (the Gram rank) and let $n$ grow.

| Result | In plain terms | Where |
|---|---|---|
| Fixed rank | Both averages tend to zero, uniformly over every non-trivial symmetry type and every input of rank at most $d$. So both inequalities hold at each fixed rank once $n$ is large enough; how large is not computed | Theorem 1.1(1) |
| The worst type | Eventually the standard type, with one box moved to the second row. For complex vectors its averages are asymptotic to $(d-1)\log n/n$ and $(d-1)(\log n)^2/n$; for real vectors with $d\ge3$ the orders are the same, with constants known up to a factor; for real vectors in a plane both are of order $1/n$ | Theorem 1.1(2)–(3) |
| Growing rank | Both averages still tend to zero when $d\log n$ is much smaller than $\sqrt n$; the first does whenever $d\log n$ is much smaller than $n$ | Theorem 1.2 |
| Every size | For the standard type alone, explicit bounds hold for every $n$ and $d$; its first average tends to zero exactly when $d/n\to0$, and Lavi's inequality holds for it whenever $6\sqrt{\mathrm e\,nd}\,(\log n+5)\le n$, for example for $d=2$ from $n=48{,}836$ on | Theorem 1.3 |

**Credit.** Rank at most three, and every rank-four shape except those with four rows, fourth row at least 3 and second row longer than the third, are Pate's (1999, Theorem 2). So for Lieb's version the new cases begin at rank four, with exactly those shapes, and continue at every higher rank; for Lavi's version the result is new at every complex rank $d\ge2$ and real rank $d\ge3$. The eigenvalue bound of Lemma 2.4 is derived from Anari, Gurvits, Oveis Gharan and Saberi. The sharp growth of the Bapat–Sunder ratio comes from the [earlier Evidence Press release](/releases/bapat-sunder-eigenvalue-ratio-growth/) ([DOI 10.5281/zenodo.24509057](https://doi.org/10.5281/zenodo.24509057)), on which this paper builds. The trace constant $d-1$ and the growth bounds are this paper's.

**Idea of the proof.** Each block is bounded by a simpler *ordered-partition* matrix, whose entries are products of permanents of submatrices, and whose trace is estimated by averaging over random Gaussian directions. A new strict inequality for logarithms of sums of exponential random variables (Lemma 3.1) shows that, whenever two rows of the Young diagram are long, the dimension $f^\lambda$ grows exponentially faster than this bound, so the averages vanish. Diagrams with one dominant row are handled by counting. The standard type is pinned down with a self-contained sharp first-trace constant (Proposition 4.3) and the sharp Bapat–Sunder growth.

**Limits.** "Large enough" is not computed, so no new case of a fixed size is proved. Only the symmetric-group (immanant) form of Lieb's conjecture is treated, not the subgroup form. Real-vector constants are known only up to a factor, and the growing-rank ranges are not known to be sharp. Lavi's identity gives an eventual Chollet inequality for pairs of rank at most $d$, but direct estimates (Ma) are much stronger, so the paper does not count it as a contribution. This is an unrefereed candidate; its assurance is internal AI-assisted review and finite computational checks only.

## Summary for specialists

Let $\mathbb K\in\{\mathbb R,\mathbb C\}$ and let $M_j^{\mathbb K}(n,d)$ be the supremum of $m_j(\lambda,A)$ over $\lambda\vdash n$, $\lambda\ne(n)$, and correlation matrices $A$ of order $n$ over $\mathbb K$ of rank at most $d$ (diagonal rescaling leaves both moments unchanged). Logarithms are natural.

- **Theorem 1.1** *(proof)*: for fixed $d\ge2$, $M_1^{\mathbb K}(n,d)\to0$ and $M_2^{\mathbb K}(n,d)\to0$; shapes with $n-\lambda_1\ge2$ give $o(1/n)$ uniformly. For large $n$ the supremum is attained at the standard shape $(n-1,1)$, and

$$M_1^{\mathbb C}(n,d)\sim(d-1)\frac{\log n}{n},$$

$$M_2^{\mathbb C}(n,d)\sim(d-1)\frac{(\log n)^2}{n}.$$

  Over $\mathbb R$ with $d\ge3$ the ratios to these scales lie eventually in $[\tfrac12-o(1),\,d-1+o(1)]$ and $[\tfrac14-o(1),\,d-1+o(1)]$. Over $\mathbb R$ with $d=2$ the supremum of each standard moment lies in $[1/(n-1),\,3/(n-1)]$ for every $n\ge2$. The threshold $n_0(d)$ is not determined.
- **Theorem 1.2** *(proof)*: if $d\log n=o(\sqrt n)$ then $M_2^{\mathbb K}(n,d)\to0$; if $d\log n=o(n)$ then $M_1^{\mathbb K}(n,d)\to0$.
- **Theorem 1.3** *(proof)*: for $n\ge2$ and $1\le d\le n$, every Gram matrix of rank at most $d$ with positive diagonal has

$$m_1\bigl((n-1,1),A\bigr)\le\frac{6\sqrt{\mathrm e\,nd}-1}{n-1},$$

  with the analogous bound $(6\sqrt{\mathrm e\,nd}\,(\log n+5)-1)/(n-1)$ for $m_2$, and a real correlation matrix of rank $d$ gives $m_1=m_2=(d-1)/(n-1)$.
- **Lemma 3.1** *(proof)*: a strict merge inequality for $\mathbb E\log$ of positive combinations of independent mean-one exponential variables, reducing to $x\coth x<\tfrac32\log(2\cosh(2x/3))$ on $(0,\infty)$.
- **Lemma 4.1, Corollary 4.2, Proposition 4.3** *(proof)*: Gaussian-average bounds on $\mathrm{Tr}\,C_\alpha(A)/\mathrm{per}\,A$ for ordered-partition matrices, with the refined factor $1/D_{n,d}$, and the sharp first-trace constant $d-1$.

**Known and new.** Pate (1999): Theorem 2 for the shapes $(p,q^u,r^v,2^s,1^t)$ with $u\le2$, $v\le1$ (every shape with at most three rows), Theorem 3 for $n\le13$ with the remaining shapes at 14 and 15, which Li settles (Theorem 1.8), and Theorem 4 for the shapes $(n+s,n^k)$ at large $n$. Li's Theorem 1.3 fixes the tail and lengthens the first row at every rank. Lavi proved $m_2\le1$ for $n\le5$. Real rank two follows from the permanent-on-top theorem (liqsweep; complete proof in the Bapat–Sunder release, Appendix A). New here, within a literature search of limited scope: uniformity over all shapes at fixed rank, the quadratic inequality at complex $d\ge2$ and real $d\ge3$, the ordinary inequality for the rank-four shapes Pate does not cover and at every higher rank, the sharp constants, the growing-rank ranges and the explicit standard-shape bounds.

## Technical account

**Blocks and ordered-partition matrices.** The blocks $B_\lambda(A)=\sum_\sigma a_\sigma\rho_\lambda(\sigma^{-1})$ are positive semidefinite, vanish when $\lambda$ has more than $d$ rows, and have rank at most the number of semistandard tableaux of shape $\lambda$ with entries in $[d]$ (Lemma 2.1, via Schur–Weyl duality). By Young's rule their traces are dominated by the traces of ordered-partition matrices $C_\alpha(A)$ indexed by compositions $\alpha$, whose entries are products of permanents of principal submatrices (Lemma 2.2). Lieb's block inequality, as proved by Djoković, controls the one-dominant-row case (Theorem 2.3).

**Gaussian traces.** With $g$ a standard complex Gaussian vector in $\mathbb C^d$, the Wick formula gives

$$\mathbb E\prod_{i\in S}|v_i^*g|^2=\mathrm{per}\,A[S]$$

for every set $S$ of indices, and averaging over the direction of $g$ turns $\mathrm{Tr}\,C_\alpha(A)/\mathrm{per}\,A$ into an exponential-type average (Lemma 4.1). Conditioning on the overlap of $g$ with each $v_i$ gives the sharp first-trace constant $d-1$ (Proposition 4.3).

**Two long rows.** Since $m_2\le(\mathrm{Tr}\,C_\lambda/\mathrm{per}\,A)^2/f^\lambda$, it is enough to compare the trace bound with the dimension. When the row lengths of $\lambda$ are proportional to $n$ with proportions $p$, at least two of them positive, the hook formula gives $f^\lambda=e^{nH(p)+o(n)}$, and Lemma 4.1 bounds the exponential growth rate of $m_2$ by $2F_d(p^{3/2})$, which the strict merge inequality of Lemma 3.1 makes negative. A compactness argument over the row proportions then makes both moments decay exponentially, uniformly in the input; it does not produce an explicit threshold.

**One dominant row.** When $n-\lambda_1=k$ is fixed, Lieb's inequality and a multinomial count give $\mathrm{Tr}\,C_\lambda\le(d-1)^k\,\mathrm{Tr}\,C_k$, and with $f^\lambda\ge\tfrac12(n/k)^k$ this yields $m_2=O((\log n)^{2k}/n^k)$, which is $o(1/n)$ for $k\ge2$; when $k$ grows, both moments decay faster than every power of $n$ (Section 5).

**The standard shape.** Its moments are given exactly by the matrix $F_A=(a_{ij}\,\mathrm{per}\,A(i,j))$: $m_1=(\mathrm{Tr}\,F_A-\mathrm{per}\,A)/((n-1)\,\mathrm{per}\,A)$, and similarly for $m_2$ with squares. The upper constant $d-1$ comes from Proposition 4.3 together with the Bapat–Sunder bound $\lambda_{\max}(F_A)\le(\log n+5)\,\mathrm{per}\,A$; the lower bound places polynomial roots on geometrically growing concentric circles in $d-1$ orthogonal directions, as in the Bapat–Sunder release, and tests $F_A$ on the resulting vectors (Section 6). At real rank two a separate argument gives $\mathrm{Tr}\,F_A\le4\,\mathrm{per}\,A$, so both moments are of order $1/n$.

**Growing rank and every size.** Theorem 1.2 repeats these estimates with the dependence on $d$ kept explicit (Section 7). Theorem 1.3 uses $\mathrm{Tr}\,C_1/\mathrm{per}\,A\le3\log(\mathrm{per}(A+I)/\mathrm{per}\,A)\le6\sqrt{\mathrm e\,nd}$ (Section 8).

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/asymptotic-permanental-dominance-fixed-rank.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 17-page paper, which opens with a plain introduction (the two inequalities, why they matter, what was known with a status table, the results, the method and a roadmap) and ends with open problems and an AI-use statement. No proof assistant was used.
- **Finite checks.** `code/check_dominance.py` (Python standard library) checks the ingredients of the proofs on explicit examples. Part A is exact arithmetic: positivity, vanishing and trace identities of every block for $n\le6$ at ranks two and three, real and complex; the Young and Lieb trace bounds; the Plancherel identity; the real rank-two bound $\mathrm{Tr}\,F_A\le4\,\mathrm{per}\,A$ (largest ratio found 2.420276); the block example $J_a\oplus J_{n-a}$, whose standard moments both equal $1/(n-1)$; and the repeated orthonormal basis with $\mathrm{Tr}\,C_1=d\,\mathrm{per}\,A$. Part B is floating point with a stated tolerance: Lemma 3.1, the trace bounds of Section 4, the chain of Section 8 and the test-vector bound of Section 6 on small frames. The script checks ingredients; it is not part of any proof.
- **Tests that can fail.** The script never uses `assert`; it prints the failing check and exits with an error, also in Python's optimised mode. Changing the expected standard moment of $J_a\oplus J_{n-a}$ from $1/(n-1)$ to $1/n$ makes it fail.
- **Replay.** The script was rerun from fresh copies before release, normally and in optimised mode, under CPython 3.14.7 and 3.12.11; the output matched the recorded file byte for byte. GitHub CI reruns it on Linux, compares the exact part line by line and the floating-point values within a declared tolerance, and repeats the failure test.
- **Review.** Five internal reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as one combined Claude pass, alongside the lead's proof audit of every proof. The revision made the sharp constant self-contained (Proposition 4.3), corrected the attribution of the eigenvalue bound, stated that the threshold is not computed, rebuilt the introduction for non-specialists and added the explicit standard-shape bounds of Theorem 1.3. Pate (1999) was then read in full and the rank-three and rank-four attribution made direct. A verification re-review and proof audit of all new and rewritten proofs found two must-fix items (a wrong number in a worked example, whose conclusion still held, and a missing output file), both applied. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The threshold $n_0(d)$ is not computed, so no individual finite case is settled; immanant form only; real constants known up to a factor; growing-rank ranges not sharp. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on permanent and immanant inequalities | Uniform asymptotic bounds and sharp standard-block rates, which point any search for counterexamples to small orders or growing dimension | The threshold order is not computed; no individual finite case is settled |
| Quantum-optics theorists | Limits on non-bosonic symmetry sectors for photons with few internal modes | Asymptotic statements about an idealised model, not experimental predictions |
| Representation theorists and matrix analysts | A merge inequality for exponential sums and Gaussian trace bounds for ordered-partition matrices | Only irreducible characters of the symmetric group are treated |
| Research agents | Machine-readable claims, an agent index and a replayable check script with a failure test | The script checks ingredients; the proofs carry the theorems |

## Why the problem matters

Permanents count perfect matchings and give the amplitudes of identical bosons, and a long list of inequalities comparing them with related quantities has been proposed, several of which have now fallen. Knowing that, at any fixed dimension, every symmetry block eventually averages below the permanent, and by how much, turns an open conjecture into a quantitative statement about where counterexamples could still hide.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with any CPython 3.12 or later (no packages needed):

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B -O code/check_dominance.py > out.txt
python3 -I .github/ci/compare_output.py out.txt results/check_dominance.txt
```

The script runs in a few seconds and ends with `All checks passed.` `ENVIRONMENT.txt` records the software used and the comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Make the threshold $n_0(d)$ explicit; at rank four this would reduce Lieb's ordinary-immanant conjecture to finitely many orders.
2. Determine the real-rank constants; $(d-1)/2$ and $(d-1)/4$ are natural candidates.
3. Close the growing-rank gap between $d=o(n)$, which is necessary, and the sufficient conditions of Theorem 1.2, and extend the method to characters of subgroups.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the check script `code/check_dominance.py` and its recorded output in `results/`; `refs.bib` from Crossref, DataCite and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
