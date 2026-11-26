## Summary

**In one sentence.** Counts of commuting shuffles sorted by how many groups they leave fail to be log-concave in every rank, but in the fixed-group regime only at two groups; this release proves that, gives the exact limiting worst and best values elsewhere, and shows that the frequency of failures is well defined.

**The object.** Take a few shuffles (permutations) of $n$ cards that all commute with one another: doing them in any order gives the same result. Together they split the cards into groups, called *joint orbits*, that the shuffles never mix. Count the families of $\ell$ such shuffles that split the cards into exactly $k$ groups, and call the count $A(\ell,n,k)$. For a single shuffle ($\ell=1$) the groups are its cycles, and the counts are the classical Stirling numbers. The same counts describe coverings of an $\ell$-dimensional torus and, for two shuffles, the coefficients of the d'Arcais polynomials behind powers of the partition generating function.

**The question.** Stirling numbers rise and then fall smoothly: they are *log-concave*, meaning each one squared is at least the product of its two neighbours. Abdesselam conjectured the same for every number of shuffles $\ell$ and every $n$. Early in 2026 Starr showed that for two shuffles it fails at two groups for some huge $n$, though it holds at every fixed larger number of groups once $n$ is large, and he called the case of three or more shuffles the most important open problem. Charlton, Heim and Stumpenhusen then found the first failure for two shuffles, $n=65\,214\,507\,758\,400$, and proved that failures make up at least $2.47\times10^{-16}$ and at most $6.8\times10^{-4}$ of all $n$, provided their frequency is well defined; whether it is remained open.

**What is new.** Two groups is the only place it breaks, and with three shuffles the first certified break is a 54-digit number.

| Result | In plain terms | Where |
|---|---|---|
| Failure in every rank | For every number of shuffles $\ell\ge2$, log-concavity fails at two groups: the ratio tends to zero along $n=m!$ and falls below any $\varepsilon>0$ on a set of $n$ of positive density. For three or more shuffles this is, as far as the literature checked shows, the first disproof of Abdesselam's conjecture | Theorem 2.3 |
| Only at two groups | At every fixed number of groups $k\ge3$ log-concavity holds once $n$ is large | Theorem 2.4 |
| Exact worst and best values | At fixed $k\ge3$ the limiting worst and best values of the log-concavity ratio are products over primes. For three shuffles and three groups the worst value is about 2.52, where the elementary argument gives only the bound 1.10; for two shuffles the formula reproduces Starr's | Theorem 2.5, Table 2 |
| The frequency of failures exists | The ratio has a continuous limiting distribution, so the proportion of $n$ at which two-group log-concavity fails exists and lies strictly between 0 and 1 in every rank. This is new also for two shuffles | Theorem 2.8 |
| Explicit certified failures | A 54-digit $n$ (about $1.45\times10^{53}$) for three commuting shuffles and an 845-digit $n$ for four, certified by rigorous interval arithmetic | Proposition 2.9 |
| An explicit error bound | An asymptotic formula for $A(\ell,n,k)$ whose error is explicit and uniform in the prime factorisation of $n$, with a growing range of group counts where log-concavity holds | Theorems 2.2 and 2.6, Corollary 2.7 |

**Why two groups are special.** One group means the shuffles act transitively, and that count carries the factor $\sigma(n)/n$, the sum of the divisors of $n$ divided by $n$. This factor is large when $n$ has many small prime factors, as factorials do. Counts with two or more groups average over all ways of splitting the cards and keep only bounded arithmetic factors. The two-group ratio has the one-group count in its denominator, so it collapses exactly when $\sigma(n)/n$ is large. The set of failures is therefore a close cousin of the *abundant numbers*, whose divisors add up to more than twice the number, and the existence of its density follows from the same classical tool, the Erdős–Wintner theorem.

**Limits.** Only a fixed number of groups is covered. Abdesselam treated the typical group counts; the range in between is open beyond $k$ up to about $\log n/\log\log n$. The qualitative leading asymptotic for three or more shuffles follows the classical Ingham–Halberstam method, as Starr noted for two shuffles, and the density result applies the classical Erdős–Wintner theorem. The explicit failures are not claimed to be the smallest, and failures with three or four shuffles are astronomically rare. The values in the table of limits are numerical evaluations; the certificates are rigorous interval computations. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks only.

## Summary for specialists

Let $A(\ell,n,k)$ count ordered $\ell$-tuples of pairwise commuting permutations of $[n]$ with $k$ joint orbits, $L=\ell-1$, and $R_{\ell,k}(n)=A(\ell,n,k)^2/(A(\ell,n,k-1)A(\ell,n,k+1))$. Abdesselam's conjecture is $R_{\ell,k}(n)\ge1$ for $2\le k\le n-1$. Starr's $\alpha(n,k)=k!A(2,n,k)/n!$ has ratio $\frac{k}{k+1}R_{2,k}(n)$ (Remark 2.1).

- **Theorem 2.2** *(proof)*: for fixed $\ell\ge2$, $k\ge2$, $A(\ell,n,k)=\frac{n!}{k!}\beta_{\ell,k}n^{kL-1}\bigl[\mathcal S_{\ell,k}(n)+O((1+\log n)^k/n)\bigr]$ with $\beta_{\ell,k}=\Gamma(L)^k/\Gamma(kL)$ and a singular series $1\le\mathcal S_{\ell,k}(n)\le C_{\ell,k}$; the constant is uniform in the factorisation of $n$.
- **Theorem 2.3** *(proof)*: $R_{\ell,2}(m!)\to0$; for every $\varepsilon>0$ some $Q$ has $R_{\ell,2}(n)<\varepsilon$ on all large multiples of $Q$.
- **Theorem 2.4** *(proof)*: $\liminf_n R_{\ell,k}(n)>1$ for fixed $k\ge3$, with uniform elementary bounds ($>1.10$ at $k=3$ for $\ell\ge3$).
- **Theorem 2.5** *(proof)*: $\liminf/\limsup R_{\ell,k}(n)=G_{L,k}\prod_p\inf/\sup_{v\ge0}K_{p,k}(v)$ with explicit local factors; at $\ell=2$ this is Starr's Corollary 2.4 times $(k+1)/k$.
- **Theorem 2.6, Corollary 2.7** *(proof)*: an explicit $E_{\ell,r}(n)$ bounds the relative error; $64kE_{\ell,k+1}(n)\le1$ implies $R_{\ell,k}(n)\ge e^{1/(8k)}$; strict log-concavity holds for $3\le k\le c\log n/\log\log n$ when $c<1/\ell$.
- **Theorem 2.8** *(proof)*: for fixed $\ell,k$ the values $R_{\ell,k}(n)$ have a continuous limiting distribution; at $k=2$, $\delta_{\ell,2}(t)>0$ for $t>0$ and $0<\delta_{\ell,2}(1)<1$.
- **Proposition 2.9** *(interval certificate)*: $R_{3,2}(n_3)<0.9926$ for $n_3=2^9\,3^5\,5^3\,7^2\,11^2\,13^2\prod_{17\le p\le109}p\approx1.45\times10^{53}$, and $R_{4,2}(n_4)<0.99961$ for an explicit $n_4\approx2.8\times10^{844}$; neither is claimed minimal.
- **Section 9.4** *(proof)*: in every rank the reduced polynomial $P_{\ell,n}(X)/X$ has a root in the open right half-plane for a set of $n$ of positive lower density, extending the rank-two result of Charlton, Heim, Neuhauser, Stumpenhusen and Tröger.

**Known and new.** The rank-two cases of Theorems 2.3 and 2.4 and the rank-two value of Theorem 2.5 are Starr's. The leading term follows the route of Ramanujan, Ingham and Halberstam for additive convolutions of divisor sums, used by Lemke Oliver, Shrestha and Thorne and, at rank two, by Starr; in Ramanujan-expansion form the case $k=2$ has a predecessor in Theorem 10 of Gadiyar, Murty and Padma. The distributional result applies the Erdős–Wintner theorem exactly as for $\varphi(n)/n$ and $\sigma(n)/n$; no new probabilistic input is claimed. The new parts are the higher-rank statements, the explicit uniform error term, the local-factor inequalities, the existence of the density in every rank, and the certificates.

## Technical account

**Exponential formula.** Commuting $\ell$-tuples are homomorphisms $\mathbb Z^\ell\to\mathfrak S_n$, so by the Bryan–Fulman exponential formula $A(\ell,n,k)=\frac{n!}{k!}\,b_\ell^{*_A k}(n)$, a $k$-fold additive convolution of $b_\ell(n)=B_\ell(n)/n$, where $B_\ell(n)$ counts subgroups of index $n$ in $\mathbb Z^\ell$. Dividing by $n^{\ell-1}$ gives $b_\ell(n)=n^{\ell-2}g_\ell(n)$ with $g_\ell=\mathbf 1*_D h_\ell$ and $h_\ell=\mathrm{id}^{-1}*_D\cdots*_D\mathrm{id}^{-(\ell-1)}$.

**Lattice estimate.** Expanding each $g_\ell$ turns the convolution into weighted lattice points in a simplex with divisibility conditions $d_i\mid n_i$. A monotone-sum argument counts them with an error bounded by an absolute constant times $n^{s-2}$, independent of the moduli (Lemmas 3.1 and 3.2). Summing over the $d_i$ gives the singular series

$$\begin{aligned}\mathcal S_{\ell,k}(n)={}&\sum_{\gcd(d_1,\dots,d_k)\mid n}\frac{\gcd(d_1,\dots,d_k)}{d_1\cdots d_k}\\ &\times\prod_{i}h_\ell(d_i),\end{aligned}$$

which factors as $\zeta(2)^k\cdots\zeta(\ell)^k\prod_pL_{p,k}(v_p(n))$, each local factor a finite sum of geometric series.

**Two groups against one.** Since $A(\ell,n,1)=(n-1)!\,B_\ell(n)$ carries the unbounded factor $\sigma(n)/n$, while $\mathcal S_{\ell,2}$ and $\mathcal S_{\ell,3}$ are bounded, $R_{\ell,2}(n)$ is a bounded quantity divided by a factor that is unbounded along highly divisible $n$. For $k\ge3$ all three factors are bounded and the gamma factor $G_{L,k}>1$ wins.

**Densities and certificates.** $\log R_{\ell,k}(n)$ is, up to $o(1)$, a constant plus an additive function of $n$ with small prime increments, so the Erdős–Wintner theorem gives the limit law. The certificate combines the exact local factors for primes below $10^5$, computed as rationals and multiplied in 60-digit interval arithmetic, with the explicit error bound of Theorem 2.6.

## Evidence, assurance and limitations

- **Proofs.** Every result has a written proof in the 20-page paper, which opens with a plain introduction (the question, what was known, what is new, why two orbits are exceptional, methods and a roadmap) and ends with checks, scope, open problems and an AI-use statement. No proof assistant was used.
- **Computations.** `code/verify.py` checks the coefficient formula against brute-force enumeration of commuting tuples for $n\le5$ and up to four permutations, the convolution identities exactly through $n=40$, every rational constant used in the proofs, the asymptotic formula against exact counts up to $n=1000$ (relative error below 1.2% there) and the thresholds of the finite criterion. `code/extensions.py` evaluates the table of limit values and runs the interval certificates for two, three and four shuffles, including a check that the known first failure for two shuffles is confirmed.
- **Tests that can fail.** No script uses `assert`; each exits with an error on any failed check, also in Python's optimised mode. Altering the constant 2401/1800 makes `verify.py` fail, and tightening the certificate threshold makes `extensions.py` fail.
- **Replay.** Both scripts were rerun from fresh copies before release, in optimised mode and normally; every output matched the recorded files apart from the recorded run time. GitHub CI reruns them on Linux, compares the outputs under a declared policy and repeats both failure tests.
- **Review.** A panel of five Claude reviewers (editor, methodology, domain, perspective and devil's advocate) found no mathematical error; their main requests concerned positioning, a buried headline, readability and the weak explicit bound. One revision round rewrote the introduction and added two extensions: the exact limit values and the certified failures for three and four shuffles. A re-review and a proof audit of every new or rewritten proof followed, including an independent exact recheck of the rank-three certificate; no correctness issue remained open. No second-model review took place for this release. A public review summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Fixed numbers of groups only; the growing range beyond about $\log n/\log\log n$ is open; monotonicity of the local factors is observed, not proved; whether the limit laws are singular is undecided; the certified failures are not claimed to be the smallest; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Combinatorialists working on d'Arcais and Nekrasov–Okounkov polynomials | The complete fixed-orbit picture in every rank: where log-concavity fails, the exact limit values, and certified counterexamples to test against | Fixed numbers of orbits only |
| Number theorists | A uniform asymptotic for additive convolutions of divisor-type functions with explicit constants, and an Erdős–Wintner application to a combinatorial ratio | The leading term itself follows a classical route |
| Researchers on random commuting permutations and torus coverings | The lower edge of the orbit-count distribution, including its arithmetic fluctuations | Compatible with, and not replacing, results at typical orbit counts |
| Research agents | Machine-readable claims, an agent index and two replayable scripts with failure tests | The scripts accompany written proofs; they do not replace them |

## Why the problem matters

Log-concavity is the simplest shape property of a sequence: it rules out several peaks and usually signals deeper structure. Abdesselam's conjecture asked whether the shape of the Stirling numbers survives when one shuffle becomes several commuting ones. The answer in the fixed-group regime is now complete in every rank: it survives everywhere except at two groups, where arithmetic of $n$ breaks it on a set of well-defined positive density.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with CPython 3.12 and `mpmath==1.3.0`:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B -O code/verify.py --output v.json
python3 -I .github/ci/compare_json.py v.json results/verification.json
python3 -I -B -O code/extensions.py --output e.json
python3 -I .github/ci/compare_json.py e.json results/extensions.json
```

The whole replay takes about three minutes. `ENVIRONMENT.txt` records the software used and the comparison policy (run time ignored; exact values identical; high-precision decimals to ten significant digits). `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## Related releases

None in the Evidence Press corpus: no earlier release treats commuting permutations, d'Arcais polynomials or the Erdős–Wintner theorem.

## The most valuable next projects

1. Treat the range between about $\log n/\log\log n$ groups and the typical group counts for three or more shuffles, where saddle-point or large-deviation methods seem better suited.
2. Prove that the local factors are monotone in the prime exponent, which would give the extremal constants in closed form.
3. Find the smallest failure for three shuffles and estimate the density of failures numerically.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the scripts `code/verify.py` and `code/extensions.py` with their recorded outputs in `results/` and the pinned package in `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
