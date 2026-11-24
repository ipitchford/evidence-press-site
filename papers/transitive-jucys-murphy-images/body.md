## Summary

**In one sentence.** Campion Loth and Rattan asked which part of the centre of the symmetric group algebra is produced by *transitive* (connected) Jucys–Murphy evaluations; this candidate shows that over the complex numbers it is all of it, and that over a general coefficient ring it is all of it exactly when $(n-1)!$ is invertible, with polynomials of degree $2n-2$ and no less.

**The setting.** The symmetric group $\mathfrak S_n$ is the group of all shuffles (permutations) of $n$ objects. Its group algebra contains formal combinations of shuffles, and its *centre* consists of the combinations that do not depend on how the objects are labelled. A basis of the centre is given by the class sums $K_\lambda$: add up all the shuffles of one cycle type $\lambda$. The *Jucys–Murphy elements* are particular sums of swaps (transpositions),

$$J_i=(1\,i)+(2\,i)+\cdots+(i-1\;i).$$

A classical theorem of Jucys and of Murphy says that plugging them into symmetric polynomials gives exactly the centre, even with integer coefficients. Expanding such a polynomial produces sums of products of swaps, and the number of times a shuffle appears counts its factorisations into swaps of a prescribed kind. These counts are Hurwitz-type numbers, which also count branched covers of the sphere.

**Transitivity.** In geometry one often wants only connected covers. On the algebra side this means keeping only the products whose swaps link all $n$ objects together: the *transitive* products. Keeping only those in the expansion of $f(J_1,\ldots,J_n)$ gives the *transitive image* $T_n(f)$. Goulden and Jackson showed that transitive powers are still central, and Campion Loth and Rattan showed the same for every symmetric function $f$. They then asked (their Question 12) which part of the centre these connected versions produce. The answer is not obvious, because $T_n$ is linear but not multiplicative: throwing away the disconnected products might lose information.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| All of it | Over the complex numbers every central element is the transitive image of a single symmetric function, so the answer to Question 12 is the whole centre | Theorem 3.2 |
| The arithmetic condition | Over a general commutative ring, transitive images fill the centre exactly when $(n-1)!$ can be divided by. Otherwise even products of transitive images fall short: for each prime $p\le n-1$ the class of a single $p$-cycle stays out of reach modulo $p$ | Theorems 3.2 and 6.2 |
| Optimal degree | Degree $2n-2$ is enough, and it is the minimum: a connected product of swaps that returns every object to its start needs at least $2n-2$ swaps | Theorem 4.1 |
| Ordinary and connected together | The pairs (ordinary evaluation, transitive image) that occur are exactly the pairs of central elements whose coefficients at the $n$-cycles agree | Theorem 5.1 |
| Over the integers | An orbit-counting bound makes every coefficient divisible by $z_\lambda/h_\lambda$. An exact computation shows that this bound describes the integral image exactly for $n\le 5$ and $n=7$, but not for $n=6$, where one extra parity condition appears and the image has index 2 in the lattice the bound allows | Proposition 6.1, Theorem 6.3 |

**A small example.** For $n=3$, with columns $K_{111}, K_{21}, K_3$, the three transitive images built in the paper are the rows of

$$\begin{pmatrix}2&0&0\\-3&-1&0\\1&1&1\end{pmatrix}.$$

The 2 in the corner is the obstruction: $(3-1)!=2$, so over a ring in which 2 cannot be divided by, no transitive image has identity coefficient 1. Over the rationals the matrix is invertible, and every central element is reached.

**The idea.** An inclusion–exclusion (Möbius) formula over the ways to split the $n$ objects into groups writes the transitive image as an alternating sum of ordinary evaluations on the groups. Multiplying by the sum of all shuffles inside the groups turns each Jucys–Murphy element into a plain number, its rank inside its group, so suitable polynomials can read off the group sizes, and a triangular system is inverted.

**Limits.** The paper answers Question 12 as posed. The description over the integers is complete only for $n\le 7$, by exact computation, and the $n=6$ parity condition has no conceptual explanation yet. Closed forms for transitive images of the classical bases (Question 13 of Campion Loth and Rattan) are not addressed. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computation only.

## Summary for specialists

$R$ is a commutative ring with identity, $\Lambda_R$ the symmetric functions over $R$, $E_n(f)=f(J_1,\ldots,J_n,0,\ldots)$ the ordinary evaluation and $T_n(f)$ the transitive image (Definition 2.2: keep the words whose transpositions connect $[n]$). For $\lambda\vdash n$, $z_\lambda=\prod_i i^{m_i}m_i!$ and $h_\lambda=\gcd\{i\,m_i: m_i>0\}$.

- **Lemma 2.3** *(proof)*: for the Möbius values $\mu(\pi)=(-1)^{k-1}(k-1)!$ of a set partition with $k$ blocks, $T_n(f)=\sum_{\pi}\mu(\pi)\,f(J^\pi)$, where $J^\pi$ are the Jucys–Murphy elements of the Young subgroup $\mathfrak S_\pi$; so $T_n$ is well defined, $R$-linear and central over every $R$.
- **Theorem 3.2** *(proof)*: $T_n:\Lambda_R\to Z(R\mathfrak S_n)$ is onto if and only if $(n-1)!\in R^\times$; for every $R$ the identity coefficients of transitive images form exactly the ideal $(n-1)!\,R$.
- **Theorem 4.1** *(proof)*: if $(n-1)!\in R^\times$ and $R\ne0$, every central element is $T_n(f)$ with $\deg f\le 2n-2$, and $[1]\,T_n(f)=0$ whenever $\deg f<2n-2$.
- **Theorem 5.1** *(proof)*: if $(n-1)!\in R^\times$, the image of $f\mapsto(E_n(f),T_n(f))$ is the set of pairs of central elements with equal coefficient at an $n$-cycle.
- **Proposition 6.1, Theorem 6.2** *(proof)*: every product of transitive images has coefficient divisible by $z_\lambda/h_\lambda$ at $K_\lambda$; the unital algebra generated by $T_n(\Lambda_R)$ is the whole centre iff $(n-1)!\in R^\times$, and for each prime $p\le n-1$ its coefficients at the $p$-cycle class lie in $pR$.
- **Theorem 6.3** *(exact computation)*: let $L_n$ be the lattice of central elements whose $K_\lambda$-coefficient is divisible by $z_\lambda/h_\lambda$ for every $\lambda$. Then $T_n(\Lambda_{\mathbb Z})=L_n$ for $n\in\{1,2,3,4,5,7\}$; for $n=6$ the index is 2, cut out by

$$\frac{c_{411}}{4}+\frac{c_{222}}{8}+\frac{c_{21111}}{24}\equiv 0\pmod 2,$$

  so $24\,K_{21111}$ is not a transitive image; and $\mathbb Z\cdot1+T_n(\Lambda_{\mathbb Z})$ is closed under multiplication for every $n\le 7$.

**Known and new.** The integral Jucys–Murphy theorem is due to Jucys and to Murphy; the block identity behind the formula is Jucys's; centrality of transitive images is due to Goulden and Jackson (powers) and to Campion Loth and Rattan (all symmetric functions), with a conceptual proof of the former by Féray; inclusion–exclusion appears in Goulden and Jackson, and passing between all and connected objects by Möbius inversion is standard in Hurwitz theory. New here, within a literature search of limited scope: the answer to Question 12 and its arithmetic criterion, the optimal degree, the pair image, the classwise divisibility and unital criterion, and the integral image for $n\le7$.

## Technical account

**The Möbius formula.** Write $f$ as a combination of ordered monomials and expand each into words of transpositions. For a set partition $\pi$, the expansion of $f(J^\pi)$ consists exactly of the words whose orbit partition is finer than $\pi$. Summing over $\pi$ with the Möbius weights of the partition lattice leaves only the transitive words. The right-hand side is an evaluation of a polynomial at commuting elements, so the transitive image does not depend on how $f$ was written.

**Collapsing Jucys–Murphy elements.** Let $H_\pi$ be the sum of the elements of the Young subgroup $\mathfrak S_\pi$. Because $\prod_i(1+J^\pi_i)=H_\pi$ and $H_\pi v=\varepsilon(v)H_\pi$ for $v$ in the group algebra of $\mathfrak S_\pi$, multiplying by $H_\pi$ replaces each $J^\pi_i$ by the number of smaller letters in its block. Inside a block of size $b$ these numbers are $0,1,\ldots,b-1$, so a symmetric polynomial evaluated against $H_\pi$ sees only the block sizes.

**Surjectivity.** With Lagrange polynomials in marker variables, the paper builds for each partition type $\alpha$ a symmetric function $F_\alpha$ with $T_n(F_\alpha)=\mu_\alpha G_\alpha$, where $G_\alpha$ is the sum of $H_\pi$ over partitions of type $\alpha$ and $\mu_\alpha=(-1)^{\ell(\alpha)-1}(\ell(\alpha)-1)!$. The $G_\alpha$ are unitriangular against the class sums, and each $\mu_\alpha$ divides $(n-1)!$. The Lagrange denominators $j!\,(n-1-j)!$ are where invertibility of $(n-1)!$ enters.

**Necessity.** The identity coefficient of $T_n(e_\nu)$ counts transitive tuples of permutations with product 1. Simultaneous conjugation acts on them, and a stabilising permutation commutes with a transitive group, so it acts freely on the $n$ letters; every orbit therefore has size divisible by $(n-1)!$. The product $T_n(e_{n-1}e_{n-1})$ attains identity coefficient exactly $(n-1)!$.

**Optimal degree.** Type selectors of degree at most $n-1$, built from the binomial power sums $\sum_i\binom{x_i}{s-1}$, recognise the type of a set partition; multiplying by $\sum_{k<n}e_k$, which evaluates to $H_\pi$, gives degree $2n-2$. For the lower bound, a transitive word with product 1 must join components at least $n-1$ times, each join lowers the number of cycles by one, and the cycle count returns to $n$, so the word has length at least $2n-2$.

**The integral image.** On each cycle-type class, $[\sigma]T_n(f)$ is a finite weighted sum of values $f(c)$ over content multisets $c$, by the central character formula on Young subgroups. The evaluation map from $\Lambda_{\mathbb Z}$ is a ring homomorphism into $\mathbb Z^M$, generated by $e_1,\ldots,e_{n-1}$. The verifier computes spans of products of generators by Hermite normal forms until they stabilise, which gives a $\mathbb Z$-basis of $T_n(\Lambda_{\mathbb Z})$ with no bound on degree, and compares it with $L_n$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/transitive-jucys-murphy-images.txt) is available for reading.

- **Proofs.** Sections 2–6 of the 10-page paper give written proofs, after a plain introduction (the objects, transitivity, the question, why it is natural, the results, the method, what is not done, and a roadmap). Theorem 6.3 is an exact computation. No proof assistant was used.
- **Exact checks.** One standard-library script, `verify_transitive.py`, checks the marker construction and the Möbius formula word by word for $n\le4$ (all 158 ordered monomials of length at most 4, and order independence), the type selectors on all 1818 pairs of partition types for $n\le9$, the class-level engine against direct word expansion for $n\le4$, the $n=3$ matrix, the optimal degree for $n\le7$, the pair rank $2p(n)-1$ for $n\le6$, and the integral image with its indices, the $n=6$ congruence and the unital closure for $n\le7$. All arithmetic is exact.
- **Tests that can fail.** No check uses `assert`, so the script behaves identically in Python's optimised mode, and the values stated in Theorem 6.3 are compared with the computation. Changing the stated index at $n=6$ from 2 to 1 makes the script fail.
- **Replay.** The script was rerun from fresh copies before release under Python 3.12, normally and in optimised mode, in about 20 seconds; its output matched the recorded file exactly apart from the interpreter version field. GitHub CI reruns it on Linux under the same comparison policy, with the failure test.
- **Review.** Five internal Claude reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as one combined pass. The revision restricted the paper to the present question, defined the transitive image carefully and proved its Möbius formula, added small missing justifications, cited the primary sources of the integral Jucys–Murphy theorem (Jucys and Murphy, both read in full), cited Féray, promoted the divisibility remark to a proposition, computed the integral image for $n\le7$ (which showed that the reviewers' suggested description fails at $n=6$) and rebuilt the introduction for non-specialists. A re-review and a line-by-line proof audit found every proof correct; the one major item, a missing comparison of computed and stated values in the verifier, was fixed and tested. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The integral image is determined only for $n\le7$ (an attempt at $n=8$ was not completed, and nothing is claimed for it); the $n=6$ parity condition is unexplained; closed forms for classical bases are not addressed. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Combinatorialists working with Hurwitz-type factorisation counts | Realise any central element by connected (transitive) factorisations, with explicit symmetric functions of minimal degree | Over the integers the image is known only for $n\le7$ |
| Researchers on symmetric-group centres and Jucys–Murphy elements | A complete answer to Question 12 and an arithmetic criterion for which coefficient rings allow it | The $n=6$ condition is computed, not explained |
| Research agents | Machine-readable claims, an agent index and one exact replayable verifier | The integral description is a computation for small $n$, not a general theorem |

## Why the problem matters

Hurwitz-type numbers count factorisations of permutations into transpositions, and in geometry the connected (transitive) counts are usually the ones of interest. Jucys–Murphy elements organise all such counts inside the centre of the symmetric group algebra. Knowing that the connected evaluations still reach every central element, exactly when $(n-1)!$ is invertible and with the least possible degree, tells researchers that nothing in the class algebra is lost by restricting to connected factorisations, and shows precisely what is lost over the integers.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.10 or later and no extra packages:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -O -I -B code/verify_transitive.py --output new-verification.json
```

Expect eight `PASS` lines and `ALL CHECKS PASSED` in about 20 seconds. Compare `new-verification.json` with `results/verification.json`: they must agree exactly apart from the top-level `python` field. `ENVIRONMENT.txt` records the software and the comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Describe the integral image $T_n(\Lambda_{\mathbb Z})$ for every $n$, and decide whether its index in $L_n$ is always a power of 2 and equal to 1 for odd $n$.
2. Explain the parity condition at $n=6$ conceptually.
3. Find closed forms for transitive images of the classical bases of symmetric functions (Question 13 of Campion Loth and Rattan).

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); `code/verify_transitive.py` and its recorded output `results/verification.json`; `requirements.txt` (no third-party dependencies); `refs.bib` from Crossref records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
