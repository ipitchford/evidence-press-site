## Summary

**In one sentence.** A published theorem says that the "Steiner distance hyperdeterminant" of a tree is never zero at even orders; it is false, the first counterexample is any tree with 351 points at order six, and this release works out exactly which even orders fail.

**The classic fact.** A tree is a network of points joined by links with no loops. In 1971 Graham and Pollak showed that the table of distances between the points of a tree, its distance matrix, has determinant $(1-n)(-2)^{n-2}$, where $n$ is the number of points. The answer depends only on $n$, and it is never zero.

**The generalisation.** Ordinary distance measures how many links join two points. *Steiner distance* measures how many links are needed to connect $k$ points at once: the number of links in the smallest part of the tree containing all of them. Recording it for every choice of $k$ points gives a $k$-dimensional table, the order-$k$ *Steiner distance hypermatrix*. Its *hyperdeterminant* (the symmetric, resultant form used throughout this literature) plays the role of the determinant: it is zero exactly when a certain system of polynomial equations, built from the table, has a nonzero solution in complex numbers.

**What was believed.** Cooper and Tauscheck proved that this hyperdeterminant is always zero at odd orders $k$ (for trees with at least three points), and published a theorem in *Special Matrices* (2024) that it is never zero at even orders. Cooper and Du's classification in the *Electronic Journal of Combinatorics* (2024) and two later papers repeat it. Computations by the authors on trees with up to five points agreed.

**What is new.** The even-order theorem is false. Write $d=k-1$.

| Result | In plain terms | Where |
|---|---|---|
| Order six | The hyperdeterminant of a tree is zero exactly when its number of links is a multiple of 350. So any tree with 351 points is a counterexample, and none smaller is at this order | Theorem 1.1(2), Theorem 3.1 |
| Which even orders fail | Every tree has a nonzero hyperdeterminant exactly when $d$ is 1 or a prime that leaves remainder 3 on division by 4. The theorem therefore holds at $k=2,4,8,12,20,24,\ldots$ and fails at $k=6,10,14,16,18,\ldots$; at each failing order, infinitely many tree sizes give zero | Theorem 1.1(1) |
| Prime exponents | When $d$ is a prime leaving remainder 1 on division by 4, the failing sizes are exactly the multiples of an explicit number $L_d$; for example $L_5=350$ and $L_{13}=881{,}961{,}664{,}506$ | Theorem 5.1 |
| Orders ten and sixteen | At order ten the exact set of failing sizes is found; the smallest is 6804 links (6805 points). At order sixteen the smallest is 683 links (684 points), and the exact set is found up to 11,513,748 links | Theorems 6.2, 6.3 |
| Smallest overall | No even order has a failing tree with fewer than 351 points | Theorem 7.1 |
| Lengths on the links | If the links carry positive real lengths, some choice of lengths gives zero at every even order except 2, 4 and 8 (for trees with at least three points) | Theorem 8.1 |

**Where the published proof goes wrong.** The proof reaches equations of the form $a^{k-1}=b^{k-1}$ and concludes $a=b$ "since $k-1$ is odd". That step is right for real numbers but not for complex numbers: the ratio $a/b$ can be any $(k-1)$th root of unity, and the hyperdeterminant detects complex solutions. The real-number version of the theorem is true: no tree has a nonzero real solution at any even order. Earlier computations used at most five points, while the first failure needs 351, which is why the gap went unnoticed.

**Credit.** The coordinates attached to the links of the tree, and the identity that rewrites the hyperdeterminant's polynomial in them, are due to Cooper and Du. An unrefereed post on MathDB by S. Patel gives a product formula for the hyperdeterminant whose zero set is exactly the criterion used here; Patel assumed the product was nonzero and used it to prove a sign conjecture. The analysis of when the product vanishes, and everything that follows from it, is new in this paper.

**Idea of the proof.** In the link coordinates, a solution picks one root of unity for each link, and it exists exactly when one real number per link, chosen from a short list, adds up to zero. At order six the list has three numbers:

$$\tfrac{31}{32},\qquad \tfrac{-9+5\sqrt5}{2},\qquad \tfrac{-9-5\sqrt5}{2}.$$

Because $\sqrt5$ is irrational, the two numbers containing it must be used equally often, say $b$ times each. If the first number is used $a$ times, what remains is $31a=288b$, and since 31 and 288 share no factor the smallest solution is 288 links on the first number and 31 on each of the others: 350 links in all. For other orders the same idea runs through the arithmetic of real cyclotomic numbers: a sign rule for their Galois orbit sums decides which orders fail, and a basis lemma pins down the exact sizes.

**Limits.** This concerns the symmetric (resultant) hyperdeterminant used in that literature, not the Cayley hyperdeterminant of a general array. Only complex solutions cause vanishing. For composite $d$ beyond order ten the exact failing sizes and the point beyond which every size fails remain open. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computation only.

## Summary for specialists

Let $T$ be a tree with $m\ge1$ edges, $k\ge2$ even, $d=k-1$, and let $\det D_k(T)$ be Qi's symmetric hyperdeterminant of the order-$k$ Steiner distance hypermatrix, the resultant of the gradient of the Steiner form $F_T$. Put $c_d(z)=1-(1+z)^{-d}$ for $z^d=1$.

- **Lemma 2.1** *(proof)*: projective nullvectors correspond to tuples $(z_e)\in\mu_d^m$ with $\sum_e c_d(z_e)=0$; vanishing depends only on $k$ and $m$.
- **Theorem 1.1(1)** *(proof)*: every tree is nonsingular at order $k$ if and only if $d=1$ or $d$ is a prime $\equiv3\pmod4$; otherwise every positive multiple of some $M$ is a singular size.
- **Theorem 3.1** *(proof)*: $\det D_6(T)=0\iff350\mid m$, with classes used $288t$, $31t$, $31t$ times.
- **Theorem 5.1** *(proof)*: for a prime $p\equiv1\pmod4$, $\det D_{p+1}(T)=0\iff L_p\mid m$, where $L_p=(2^p|S_{p,p}|+r(2^p-1))/g$, $r=(p-1)/2$, $S_{p,p}$ is a negative integer orbit sum and $g=\gcd(2^p-1,S_{p,p})$, which equals 1 for every listed prime up to 47.
- **Theorem 6.1** *(proof)*: for composite $d$ the gcd of the singular sizes is a ratio of lattice indices, and all large multiples of it are singular. **Theorem 6.2**: at $k=10$, $m$ is singular exactly when $m=6804b+513\alpha$ with $b\ge1$ and $0\le\alpha\le\lfloor6801b/511\rfloor$; the largest nonsingular multiple of 27 is 251,235. **Theorem 6.3**: at $k=16$ the least singular size is 683, the exact set up to 11,513,748 is $683f+32769\gamma$ with $0\le\gamma\le\lfloor681f/32767\rfloor$, and every $m\ge45{,}172{,}270$ is singular.
- **Theorem 7.1** *(proof)*: for even $k\ne6$, a singular tree has more than 350 edges.
- **Theorem 8.1, Proposition 8.2** *(proof)*: with positive real edge lengths and $n\ge3$, singular lengths exist if and only if $k\notin\{2,4,8\}$; over a subfield $F$ they exist if and only if some orbit of branch values under $\mathrm{Gal}(K_d/(K_d\cap F))$ has sum at most zero.

**Known and new.** Cooper–Tauscheck's Proposition 2.1 is a correct identity; Propositions 2.2–2.4 hold for real nullvectors only, and Theorem 2.5 fails at every order allowed by Theorem 1.1(1). The leaf-deletion step of that proof has a separate gap, so restricting the argument to real vectors does not by itself repair it, although the real statement holds (Remark 2.2). Cooper–Du's classification (EJC 2024, Theorem 1) is wrong for $n\ge3$ at those orders, first at $n=351$, $k=6$. Tree independence (Zheng, Theorem 7; Cooper–Du, Corollary 3.2), the odd-order results and Zheng's three-vertex path formula are unaffected. Patel's sign argument applies exactly where the determinant is nonzero, which Theorem 1.1 now identifies.

## Technical account

**Edge coordinates.** Root the tree, put $C=\sum_v x_v$, and for each edge $e$ let $u_e$ be the sum of $x_v$ on the side away from the root. These are Cooper and Du's zeta-function coordinates, and their cut identity reads

$$F_T=\sum_e\bigl[C^k-u_e^k-(C-u_e)^k\bigr].$$

A nullvector has $C\ne0$; scaling to $C=1$, each edge equation $(1-u_e)^d=u_e^d$ gives $u_e=(1+z_e)^{-1}$ with $z_e^d=1$, and the remaining equation is $\sum_e c_d(z_e)=0$ (Lemma 2.1). The values $c_d(z)$ are real, equal at $z$ and $\bar z$, and the singular points of the hypersurface $F_T=0$ are ordinary double points.

**Orbit sums.** For an odd divisor $h>1$ of $d$, the sum $S_{d,h}$ of $c_d$ over one representative of each conjugate pair of primitive $h$th roots is an integer (cyclotomic units), negative when $h\equiv1\pmod4$ and positive when $h\equiv3\pmod4$, because a single conjugate dominates (Lemmas 4.1, 4.2). The primitive values of each order $h\ge5$ form a basis of the real cyclotomic field $K_h$: their conjugate matrix is strictly diagonally dominant (Lemma 4.3). Averaging a relation over the Galois group then shows that a relation needs an order $h\equiv1\pmod4$, which gives Theorem 1.1(1).

**Exact sizes.** For prime $d$ the basis lemma forces equal multiplicities on the primitive classes, leaving one linear equation in two unknowns (Theorem 5.1). For composite $d$, singular sizes form a numerical semigroup whose gcd is a ratio of Hermite-normal-form indices (Theorem 6.1); at orders ten and sixteen the basis lemma and Galois symmetry reduce it to explicit two-generator families. At order sixteen any relation that uses the order-15 classes needs more than 11,513,748 edges, because the only negative value is about $-1363$.

**Smallest overall.** Averaging over the Galois group, the largest order present must dominate all smaller ones, and sine-ratio estimates show this needs more than 350 edges except at $d=5$ (Theorem 7.1); ten small cases are checked numerically with wide margins.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its complete transcript is available for reading.

- **Proofs.** Every result has a written proof in the 11-page paper, which opens with a plain introduction (the question, what was known, the main theorem, what fails in the published proof and what survives, and a roadmap) and ends with open questions and an AI-use statement. No proof assistant was used.
- **Exact checks.** `code/verify.py` (Python standard library) evaluates the four distinct contractions of the order-six tensor against the explicit nullvector on the star with 350 leaves, directly from Steiner distances and exactly in $\mathbb Z[\zeta_5]$, covering all $351^5$ ordered terms for each vertex type: all four are zero. It also computes $S_{p,p}$ and $L_p$ exactly for every prime up to 47. `code/audit_periods.py` (SymPy) computes the lattice indices $g_d$ by Hermite normal forms. `code/extensions.py` (mpmath) checks the cut identity on every labelled tree with up to six points at order four and up to five points at order six, weighted nullvectors on two small trees, orbit sums for every odd $d\le151$, the data and enumerations at orders ten and sixteen, the inequalities behind Theorem 7.1, and that Patel's product formula reproduces all nine values tabulated by Cooper and Tauscheck. Floating point is used only to confirm signs and dominance with wide margins.
- **Tests that can fail.** No script uses `assert`; each exits with an error on any failed check, also in Python's optimised mode. Changing the witness to 287, 32 and 31 links makes the contractions nonzero and `verify.py` fail.
- **Replay.** All three scripts were rerun from fresh copies before release, normally and in optimised mode; every output matched the recorded files byte for byte. GitHub CI reruns them on Linux, compares the outputs under a declared policy and repeats the failure test.
- **Review.** Five internal reviewer roles (editor, methodology, domain, number theory and devil's advocate) were run as one combined Claude pass. They found no mathematical error; their main requests concerned context, a precise account of what fails, credit to Cooper–Du and Patel, and the thin composite section. One revision round rewrote the introduction and added the basis lemma for every order, the exact results at orders ten and sixteen and the smallest-tree theorem. A verification re-review with a proof audit of every new or rewritten proof left no open correctness issue. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Symmetric (resultant) hyperdeterminant only; composite orders beyond ten not settled exactly; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on distance matrices and hypermatrices of graphs | The exact list of even orders where the hyperdeterminant can vanish, the explicit 351-point counterexample and the exact sizes at orders six, ten and sixteen, to correct or test results that relied on the published theorem | Symmetric hyperdeterminant only; exact sets at most composite orders are open |
| Authors citing the published classification | Which statements survive: tree independence, the odd-order results and the real-number version | Check each use against the orders of Theorem 1.1(1) |
| Algebraic number theorists | A natural family of positive integer relations among real cyclotomic numbers, with a sign rule and a basis lemma | Exact semigroups for composite exponents remain open |
| Research agents | Machine-readable claims, an agent index and three replayable exact scripts with a failure test | The scripts accompany written proofs; they do not replace them |

## Why the problem matters

The Graham–Pollak theorem is one of the classic results connecting trees and linear algebra, and its higher-order Steiner version had been settled in print and cited as such. A correction stated precisely, with the exact orders and sizes where the theorem fails and a proof of what remains true, lets the later work that relied on it be checked case by case.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with CPython 3.12, `mpmath==1.3.0` and `sympy==1.14.0`:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B -O code/verify.py > v.txt
cmp v.txt results/verify-output.txt
python3 -I -B -O code/audit_periods.py > a.txt
cmp a.txt results/audit-periods-output.txt
python3 -I -B -O code/extensions.py --output e.json
python3 -I .github/ci/compare_json.py e.json results/extensions.json
```

The scripts take under a second, a few seconds and about 20 seconds. `ENVIRONMENT.txt` records the software used and the comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Determine the least singular size and the threshold beyond which every size fails for every composite $d$, and find closed forms for the gcd when $d=p^2$ or $d=pq$.
2. Decide whether $\gcd(2^p-1,S_{p,p})$ is ever larger than 1.
3. Find the exact order of vanishing of the hyperdeterminant, as a polynomial in edge lengths, along the hyperplanes of singular lengths.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the scripts `code/verify.py`, `code/audit_periods.py` and `code/extensions.py` with their recorded outputs in `results/` and pinned packages in `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
