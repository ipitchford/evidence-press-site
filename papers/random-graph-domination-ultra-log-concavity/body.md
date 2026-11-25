## Summary

**In one sentence.** Almost every network has dominating-set counts that rise to one peak and fall with no second hump, which answers a question Cameron asked about all networks, and this release also finds the density of links at which that guarantee stops.

**The object.** In a network, a *dominating set* is a set of nodes such that every node is either in the set or linked to a node in it, like guards placed so that every site is watched. Counting the dominating sets of each size gives a sequence of numbers, the coefficients of the network's *domination polynomial*. A sequence is *log-concave* if each term squared is at least the product of its two neighbours. A log-concave sequence of positive numbers rises to one peak and then falls, with no second hump.

**The question.** Cameron checked every network with at most nine nodes in his 2019 thesis. Exactly one fails log-concavity: its counts begin 1, 7, 50, …, and they fail at the start because $7\times7<1\times50$. On this evidence he conjectured that almost all networks have log-concave counts. A stronger conjecture, that every domination polynomial has a single peak, is now known to be false for some huge networks: the Evidence Press release [*Domination polynomials with many peaks*](https://doi.org/10.5281/zenodo.24511988) builds connected networks on 317,440 nodes with two peaks. That release asks about the worst networks; this one asks about typical ones.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| Typical networks | In a random network where each link is present independently with probability $p$, the counts are log-concave with probability tending to one as the network grows, and so are the *proportions* of sets of each size that dominate (the stronger property called *ultra-log-concavity*). This holds whenever $p$ stays below $1-\varepsilon$ and $p(\log n)^2$ grows without bound, so for densities down to about $1/(\log n)^2$ | Theorem 2.1 |
| Almost all networks | Taking $p=1/2$, a uniformly random network, shows that almost all networks have this property, with nodes labelled or networks counted up to relabelling. This answers Cameron's question | Theorem 2.1, Corollary 2.2 |
| The right density scale | When $p(\log n)^2$ stays bounded, carefully tuned densities make log-concavity fail with an explicit probability. Whether it fails is decided by the number of smallest dominating sets, which behaves like a Poisson count: it fails when that count exceeds a threshold. One tuning gives probability exactly $1/2$ in the limit | Theorem 2.3 |
| A natural sparse density | For a fixed formula such as $p=1/(\log n)^2$, the probability of log-concavity does not settle: it is close to one for almost every $n$, but drops well below one for infinitely many $n$ | Theorem 2.5 |
| A consequence | The size of a randomly chosen dominating set (weighted by size in any of the natural ways) is at least as concentrated as a binomial count with the same average | Corollary 2.6 |

**Small networks agree.** At $p=1/2$, ultra-log-concavity fails for 636 of the 32,768 labelled networks on 6 nodes and for 11 of 20,000 sampled networks on 18 nodes, about 1 in 1,800. Nearly every failure sits at the second nonzero count, the same place where Cameron's nine-node example fails.

**Idea of the proof.** Almost everything is decided at the start of the sequence. The first nonzero count fluctuates like a Poisson variable, while the next counts are huge and predictable. The curvature of their average profile at the second nonzero count is of order $p(\log n)^2$, so when that quantity is large no plausible fluctuation of the first count can break the inequality there, and when it stays bounded the Poisson count can exceed the threshold with positive probability. Further up, averages and concentration do the work, and in the long upper range, where almost every set dominates, a deterministic counting inequality about overlapping neighbourhoods takes over.

**Limits.** The results are asymptotic: they hold as the network grows, with no explicit size beyond which they apply. Very dense networks ($p$ close to one) and sparser ones ($p(\log n)^2$ tending to zero) are not covered. Convergence at the boundary scale is slow. The finite computations illustrate the theorems; they are not proofs. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks only.

## Summary for specialists

Let $G\sim G(n,p)$, $L=\log n$, $X_k$ the number of dominating $k$-sets, $R_k=X_k/\binom nk$, $\gamma$ the domination number and $\delta$ the minimum degree. Ultra-log-concavity (ULC) means $R_k^2\ge R_{k-1}R_{k+1}$ for $1\le k<n$; it implies log-concavity (LC) of $(X_k)$.

- **Theorem 2.1** *(proof)*: if $p\le1-\varepsilon$ and $pL^2\to\infty$, then whp $D_G$ is ULC, strictly exactly for $\gamma\le k\le n-\delta$, and $X_k^2>X_{k-1}X_{k+1}$ for $\gamma<k<n$.
- **Corollary 2.2** *(proof)*: the proportion of isomorphism classes on $n$ vertices with a ULC domination polynomial tends to one.
- **Theorem 2.3** *(proof)*: for $\theta\in[0,\infty)$ and $\lambda>0$, with $r=\lfloor L^3/\theta\rfloor$ (or $\lfloor L^4\rfloor$ at $\theta=0$) and $p$ tuned so that $\mathbb E X_r=\lambda$, we have $pL^2\to\theta$ and $\mathbb P(\text{ULC}),\mathbb P(\text{LC})\to\mathbb P\{\mathrm{Pois}(\lambda)<\lambda e^\theta\}$ for $\theta>0$, or $\mathbb P\{\mathrm{Pois}(\lambda)\le\lambda\}$ for $\theta=0$; if $m=\lambda e^\theta\in\mathbb N$, other tunings give LC but not ULC with limit $e^{-\lambda}\lambda^m/m!$. At $\theta=0$, $\lambda=\log2$ the limit is $1/2$.
- **Theorem 2.5, Proposition 6.1** *(proof)*: for $p=\theta/L^2$, $\mathbb P(\text{ULC})\to1$ along a set of $n$ of natural density one; along infinitely many $n$ both probabilities tend to $\mathbb P\{\mathrm{Pois}(\lambda)<\lambda e^\theta\}$; hence $\limsup=1$ and $\liminf\le e^{-e^{-\theta}}$.
- **Corollary 2.6** *(proof)*: on the event of Theorem 2.1, the size $Y$ of a $z^{|S|}$-weighted random dominating set satisfies $\mathbb E[\Phi(Y)\mid G]\le\mathbb E\Phi(Z)$ for convex $\Phi$, with $Z\sim\mathrm{Bin}(n,\mathbb E(Y\mid G)/n)$.

**Known and new.** Beaton and Brown proved unimodality whp for fixed $p$ via minimum degree at least $2\log_2n$; Oboudi proved log-concavity of the average domination polynomial over all labelled graphs; Du, Heilman and Panova asked whether random graphs are log-concave. Second-moment bounds for counts with mean at least $e^{cL^2}$ are standard in the domination-number literature (Wieland–Godbole, Glebov–Liebenau–Szabó, Mitsche–Pérez-Giménez–Prałat); the new ingredient is an error term $e^{-\Omega(L^2)}/\mu_k$ that keeps the estimate useful when the mean is bounded. No earlier result on log-concavity of the domination polynomial of a single random graph was found.

## Technical account

**Means and the onset.** A fixed $k$-set dominates with probability $b_k=(1-q^k)^{n-k}$, $q=1-p$, so $\mu_k=\mathbb E X_k=\binom nk b_k$. Let $s$ be the first $k$ with $\mu_k\ge e^{-H}$. Then $s\sim L/a$ with $a=-\log q$, $nq^s\asymp L^2/a$, and $\mu_{s+1}\ge e^{cL^2}$ (Lemma 4.1).

**Second moment and Poisson law.** For $k$ near $L/a$, $\mathbb E[X_k(X_k-1)]/\mu_k^2\le1+L^{O(1)}n^{-1/2}+e^{-\Omega(L^2)}/\mu_k$ (Lemma 3.1). A monotone coupling and Ross's Theorem 4.14 then give $X_k\Rightarrow\mathrm{Pois}(\lambda)$ when $\mu_k\to\lambda$ (Corollary 3.2).

**The comparison that matters.** ULC at index $r+1$ reads $X_r\le T_r$, where $T_r=\mu_r e^{C_r}(1+o(1))$ and

$$C_r=2\log b_{r+1}-\log b_r-\log b_{r+2}$$

is the curvature of the mean profile. On the logarithmic range it is at least of order $a^2nq^k$, which at the onset is of order $pL^2$. If $pL^2\to\infty$ the threshold dwarfs any plausible $X_s$; if $pL^2\to\theta$ the threshold tends to $\lambda e^\theta$ while $X_r$ is asymptotically Poisson.

**Upper range.** Writing $c_k=1-R_k$ as the probability that a random $k$-set lies in some $B_v=[n]\setminus N[v]$, a Bonferroni argument with the exact hypergeometric identity gives

$$\begin{aligned}&c_{k-1}-2c_k+c_{k+1}\\&\quad\ge\ \Sigma_{k-1}\Big(\tfrac{d(d-1)}{n(n-1)}-(m-1)\rho^{k-1}\Big)\end{aligned}$$

(Lemma 5.1), which is positive once $k$ exceeds about $(1+\eta)L/a$; concavity of $R_k$ then gives ULC there.

**Natural densities.** For $p=\theta/L^2$, $\log\mu_{s(n)}$ decreases steadily in $n$ and jumps up by order $L^2$ each time $s$ increases, so a window of fixed width around $\log\mu_s=0$ occupies a vanishing proportion of $n$; along the $n$ where $\mu_s$ is near a fixed $\lambda$ the Poisson law applies (Theorem 2.5).

## Evidence, assurance and limitations

- **Proofs.** Every result has a written proof in the 14-page paper, which opens with a plain introduction (the question, why it is natural, what was known, what is new, the mechanism and a roadmap) and ends with finite computations, limitations, open problems and an AI-use statement. No proof assistant was used.
- **Computations.** `code/verify.py` (standard library) checks the mean formula exactly over all labelled graphs with up to 5 nodes and the upper-range inequality (Lemma 5.1) on every three-set family with up to 6 points. `code/audit_checks.py` recounts all graphs with up to 6 nodes, verifies 1904 instances of the hypergeometric identity exactly, and checks on which side of an integer the thresholds fall at $n=2^{128}$, $2^{512}$ and $2^{2048}$. `code/check_tuning.py` evaluates the tuned densities of Theorem 2.3. `code/finite_n.py` produces the table of failures for networks with up to 18 nodes (exhaustive up to 6, then 20,000 seeded samples per size). `code/natural_density.py` illustrates the slow convergence for $p=1/(\log n)^2$. These are finite checks and illustrations; they do not certify the limit theorems.
- **Tests that can fail.** No script uses `assert`; each exits with an error on any failed check, also in Python's optimised mode. Making the upper-range bound too strong makes `verify.py` fail, and a negative tolerance makes `check_tuning.py` fail.
- **Replay.** All five scripts were rerun from fresh copies before release in optimised mode, three of them also normally; every output matched the recorded files byte for byte. GitHub CI reruns them on Linux, compares the outputs under a declared policy and repeats both failure tests.
- **Review.** Five internal reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as one combined Claude pass. They found no mathematical error; their main requests concerned context, the framing of the boundary scale, credit for standard bounds, a missing 2026 citation and small-network evidence. One revision round rewrote the introduction and added the natural-density theorem, the unlabelled case, the table of small networks and the slow-convergence illustration. A verification re-review with a proof audit of every new or rewritten proof left no open correctness issue. No second-model review took place for this release. A public review summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Asymptotic only, with constants not made explicit; dense ($p\to1$) and sparser ($pL^2\to0$) regimes open; slow convergence at the boundary scale (the curvature is 0.58 at $\log n=100$ where the limit is 1); attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on graph polynomials | The answer to Cameron's question, the strict-inequality range, and the observation that failures concentrate at the second nonzero count | Asymptotic; very dense graphs are open |
| Researchers on random graphs | The Poisson mechanism at the boundary density and a second-moment bound that stays useful when the mean is bounded | Densities below about $1/(\log n)^2$ are not treated |
| Probabilists working on log-concavity and stochastic orders | A binomial convex-order bound for the size of a weighted random dominating set | Holds on the high-probability event of Theorem 2.1 |
| Research agents | Machine-readable claims, an agent index and five replayable scripts with failure tests | The scripts accompany written proofs; they do not replace them |

## Why the problem matters

Unimodality and log-concavity questions for graph polynomials are a long-running theme in combinatorics. For domination polynomials the all-graphs unimodality conjecture is now false, so the live questions are about typical graphs and special classes. This release settles the typical case in a strong form, and shows exactly where a guarantee that holds for every way of choosing the density stops.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with CPython 3.12, `mpmath==1.3.0` and `numpy==2.3.5`:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B -O code/verify.py > v.txt && cmp v.txt results/verify.stdout
python3 -I -B -O code/audit_checks.py > a.txt
python3 -I .github/ci/compare_tokens.py a.txt results/audit_checks.stdout
python3 -I -B -O code/check_tuning.py > t.txt
python3 -I .github/ci/compare_tokens.py t.txt results/check_tuning.stdout
python3 -I -B -O code/finite_n.py --output f.json > f.txt
cmp f.json results/finite-n.json && cmp f.txt results/finite-n.stdout
python3 -I -B -O code/natural_density.py --output d.json > d.txt
python3 -I .github/ci/compare_tokens.py d.json results/natural-density.json
```

The whole replay takes about two minutes. `ENVIRONMENT.txt` records the software used and the comparison policy (exact outputs byte for byte; printed high-precision values within one part in a million). `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## Related releases

- [*Domination polynomials with many peaks*](https://doi.org/10.5281/zenodo.24511988): the same polynomial, a different question. That release builds worst-case networks whose counts have two peaks; this one shows that typical networks have one.
- [*Ultra log-concavity for increasing families generated by singletons and pairs*](/releases/dependence-ultra-log-concavity/): ultra-log-concavity for increasing set families generated by pairs, a related notion in a different setting.

## The most valuable next projects

1. Extend Theorem 2.1 to every density with $p(\log n)^2\to\infty$, including $p\to1$, where the neighbourhood complements are small and the overlap argument needs new ideas.
2. Determine what happens for sparser densities, $p(\log n)^2\to0$, for example $p=n^{-c}$.
3. Decide whether the domination polynomial of a uniformly random network has only real roots with probability bounded away from zero.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the scripts `code/verify.py`, `code/audit_checks.py`, `code/check_tuning.py`, `code/finite_n.py` and `code/natural_density.py` with their recorded outputs in `results/` and pinned packages in `requirements.txt`; `refs.bib` from Crossref, DataCite and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
