## Summary

**In one sentence.** If $n$ numbers add up to zero and are not all zero, at least $2\binom{n-2}{k-1}$ of the ways to pick $k$ of them give a nonzero sum, and only the pattern $(1,-1,0,\dots,0)$ achieves this; the same circle of ideas gives the exact minimum Rényi entropy of a random subset sum and a sharp tail bound from $n=4k$.

**The everyday question.** Take a list of $n$ numbers, pick $k$ of them at random without replacement, and add them up. How concentrated, or predictable, can that random sum be? Unlike a sum of independent terms, a fixed-size sample has rigid dependence: the numbers left behind always add up to the total minus the sum drawn. The paper asks the question in three classical ways.

1. **How often can the sum be exactly zero?** This is the *zero atom*.
2. **How small can its entropy be?** Entropy measures how predictable the whole distribution is.
3. **How rarely can it be nonnegative?** This is the *sign* question behind a famous conjecture.

**Why it matters.** Each form has a history. The first is a question about the *Johnson graph*, whose vertices are the $k$-element subsets of an $n$-element set, a standard object in combinatorics and coding theory. A zero-sum list of numbers is exactly an eigenfunction ("vibration mode") of that graph in its first nontrivial eigenspace, and the subsets with nonzero sum are its support, or footprint. In 2018 Mogilnykh, Vorob'ev and Valyuzhenich conjectured the smallest possible footprint after checking every $n\le600$ by computer. The second form was posed in 2026 by Ai, Kuželka and Pelekis as an entropy version of the Manickam–Miklós–Singhi problem; they could not solve the resulting optimisation and suggested an answer from numerical experiments. The third is the Manickam–Miklós–Singhi (MMS) conjecture of 1988: if $n\ge4k$ numbers sum to zero, at least a fraction $k/n$ of the $k$-subsets have a nonnegative sum. It is known only for $n\ge10^{46}k$.

**What is new here.**

| Question | Result | Where |
|---|---|---|
| Zero atom | At least $2\binom{n-2}{k-1}$ nonzero sums for $k\ge5$, $n\ge2k+1$, attained only by $(1,-1,0,\dots,0)$: the 2018 conjecture, now proved, with an exact formula and all extremal lists for every $n$ and $k$ | Theorem 1.1 |
| A missed case | At $n=5$, $k=2$ the list $(1,1,-1,-1,0)$ is a second extremal list, missing from the 2018 classification and a 2021 survey | Theorem 1.1 |
| Entropy | The minimum Rényi entropy for every order: one outlier is optimal, except when exactly half the numbers are drawn, where two outliers win above an explicit order $\alpha_k$ | Theorems 1.2, 1.3 |
| A clean threshold | The Bernoulli lower bound suggested by numerical evidence holds for every population exactly for orders $\alpha\le2$ | Corollary 1.4 |
| Sign | For two-valued lists, the fraction of nonnegative sums is at least $k/n$ for all $n\ge4k$ (previously $n\ge8k$) | Theorem 1.5 |
| Consequence | The Aydinian–Blinovsky conjecture, that two-valued lists are the worst case, would imply MMS in full | Corollary 7.2 |
| Groups | Exact answers over any Abelian group; elements of order two change the answer at half-sampling | Theorem 1.6 |

**A small example.** Take $n=11$ and $k=5$, so there are $462$ ways to pick five numbers. For the list $(1,-1,0,\dots,0)$ a pick has a nonzero sum exactly when it contains one of the first two entries but not both, which happens for $2\binom{9}{4}=252$ picks. No other zero-sum list of eleven numbers does better.

**The key idea.** One principle runs through the paper: lists with only two distinct values are the hardest case, and for those the sum is governed by a hypergeometric count, the number of "marked" items in the sample. For the zero atom and the whole distribution this reduction is proved; for the sign it is the Aydinian–Blinovsky conjecture. The new ingredients are a sharp estimate of the hypergeometric atom at an integer mean, a chain comparing the balanced hypergeometric laws at half-sampling in the majorization order, and, for the tail, a 2026 lemma of Ai, Karagiannis, Kuželka and Pelekis.

**Limits.** This does not prove the MMS conjecture: the tail theorem covers two-valued lists, and below $n=4k$ a single outlier is not always the worst case. The zero-sum theorem is for real numbers; it fails over $\mathbb Z_2$, $\mathbb Z_3$ and $\mathbb Z_5$. Only the first eigenspace of the Johnson graph is treated. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact finite computer checks.

## Summary for specialists

Let $x\in\mathbb R^n$, $S$ uniform on $k$-subsets, $X=\sum_{i\in S}x_i$, $r=\min(k,n-k)$. Write $\mathrm{Hyp}(n,i,k)$ for the hypergeometric law, $\mathrm{Ber}(p)=(1-p,p)$, and at $n=2k$ let $U=(\tfrac12,\tfrac12)$ and $Q_k$ be the law of two outliers, with central atom $q_k=k/(2k-1)$.

- **Theorem 1.1** *(proof)*: the minimum support $m(n,k)$ of a nonzero $f$ in the first nontrivial eigenspace of $J(n,k)$ equals $2\binom{n-2}{r-1}$ except: $2$ if $r=1$; $2\binom{n-2}{r-2}$ if $n=2r\ge4$; and $6,39,110$ at $(n,r)=(6,2),(9,3),(10,4)$. All minimisers are listed. In particular $m(n,k)=2\binom{n-2}{k-1}$ for $k\ge5$, $n\ge2k+1$, uniquely at $D=(1,-1,0,\dots,0)$: [MVV, Conjecture 1].
- **Theorem 1.2** *(proof)*: for nonconstant $x$, the mass vector of $X$ is majorized by $\mathrm{Ber}(k/n)$ if $n\ne2k$, and by $U$ or $Q_k$ if $n=2k\ge4$; $U$ and $Q_k$ are incomparable.
- **Theorem 1.3** *(proof)*: $\min H_\alpha(X)=H_\alpha(\mathrm{Ber}(k/n))$ for $n\ne2k$ and $\min\{1,H_\alpha(Q_k)\}$ at $n=2k\ge4$. The crossover $\alpha_k$ solves $\tfrac12(\tfrac{2k}{2k-1})^{\alpha}+(\tfrac{k-1}{2k-1})^{\alpha}=1$; $\alpha_2=2$, $\alpha_k$ increases, and $\alpha_k=(2k-\tfrac12)\ln2+O(1/k)$. Every minimiser is two-valued, with multiplicities $\{1,n-1\}$ or $\{2,n-2\}$.
- **Corollary 1.4**: $H_\alpha(X)\ge H_\alpha(\mathrm{Ber}(k/n))$ universally iff $0<\alpha\le2$. At $n=4$, $k=2$, the list $(1,1,0,0)$ has power sum $11/36>1/4$ at $\alpha=3$.
- **Theorem 1.5** *(proof)*: for $n\ge4k$ and $1\le i\le n-1$, $\Pr(\mathrm{Hyp}(n,i,k)\ge ik/n)\ge k/n$, with equality at $i=1$, and only there when $n>4k$. Ai–Pelekis had $n\ge8k$. **Corollary 7.2**: Aydinian–Blinovsky implies MMS for $n\ge4k$.
- **Theorem 1.6** *(proof)*: over a nontrivial Abelian group, a degree-one function on the slice that is not identically zero is nonzero on a proportion at least $r/n$ ($n\ne2k$), $(k-1)/(2k-1)$ ($n=2k\ge4$), and these are attained. The binary case is due to Dumer and Kapralova.

## Technical account

**Zero sums.** Mogilnykh, Vorob'ev and Valyuzhenich showed that a minimiser either has three distinct values, which costs too much (Lemma 2.1), or is a coordinate difference or a two-valued vector. A two-valued zero-sum vector with values in proportion $i:(n-i)$ has zero sum on a $k$-subset exactly when the subset meets the first class in $ik/n$ points, so its support is $\binom nk$ times one minus a hypergeometric atom at the mean. They compared this with $2\binom{n-2}{k-1}$ by computer for $n\le600$. Lemma 2.2 proves the comparison for every $k\ge5$: the hypergeometric atom at an integer mean $j=ik/n$ is strictly below the proportion

$$T(n,k)=1-\frac{2k(n-k)}{n(n-1)},$$

which is the zero proportion of $D$. Section 3 settles the remaining small parameters, including the extra minimiser at $(5,2)$, which is three-valued and so absent from the earlier two-class description.

**The whole law.** Lemma 4.1 (Ai–Kuželka–Pelekis, Lemma 3) pushes any population towards a two-valued one without leaving the majorization order, so the law of $X$ is dominated by some $\mathrm{Hyp}(n,i,k)$. Away from half-sampling no hypergeometric atom exceeds $(n-k)/n$, the largest atom of the single-outlier law (Lemma 4.2). At $n=2k$ the balanced laws $\mathrm{Hyp}(2k,t,k)$ are symmetric, and Theorem 4.3 shows that, within each parity class of $t$, they form a chain in the majorization order ending at $U$ (odd $t$) or $Q_k$ (even $t$). Schur-concavity of Rényi entropy then gives Theorem 1.3, and the crossover between $H_\alpha(U)=1$ and $H_\alpha(Q_k)$ is the order $\alpha_k$.

**Tails.** For two-valued lists the sign question becomes $\Pr(\mathrm{Hyp}(n,i,k)\ge ik/n)$. Means $\mu\le1$ are handled directly, and there $i=1$ gives exactly $k/n$. For a non-integer mean above $1$, Theorem 3(1) of Ai, Karagiannis, Kuželka and Pelekis, a consequence of their lemma for laws with increasing failure rate, gives a tail of at least $1/4$, which is at least $k/n$ when $n\ge4k$. At an integer mean, the cell-count ratios from the zero-atom analysis show that the atom at the mean exceeds the one below it, and the same lemma again gives at least $1/4$. Exact computation for $k\le40$, $4k\le n\le10k$ ($930{,}660$ cases) agrees, with minimum ratio $5/4$ for $i\ge2$. Below $4k$ a single outlier fails for some $n$, up to $n/k=10/3$ for $k\le40$.

**Groups.** Over an Abelian group, two-valued functions reduce to the parity of a hypergeometric count, governed by binary Krawtchouk polynomials. The extremum $|K_k(i)|\le|K_k(1)|$ (or $|K_k(2)|$ at $n=2k$) is Corollary 10 of Dumer and Kapralova (2013). At half-sampling, an element of order two lets a two-point law $\mathrm{Ber}(q_k)$ appear, which changes the entropy minimum.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/subset-sum-support-entropy-tails.txt) is available for reading.

- **Proofs.** Every result has a complete written proof in the 19-page paper; no step of any proof is computational. The paper opens with a plain introduction, a list of what is new and what is not, and a roadmap. No proof assistant was used.
- **Exact checks.** Five standard-library Python scripts use only integers and exact fractions, each in seconds. They check the support formula and all minimisers on every zero-sum vector with entries in $\{-2,\dots,2\}$ for $n\le10$, give a complete certificate for $n\le7$, check hypergeometric atoms to $n=60$, the parity chain for $2k\le200$, the entropy statements on small populations, Lemma 2.2 for $n\le300$ ($24{,}758$ cases), the tail theorem on $930{,}660$ cases and the counterexamples over $\mathbb Z_2$, $\mathbb Z_3$ and $\mathbb Z_5$ ($224<252$, $414<420$, $210<252$). These supplement the proofs and do not replace them.
- **Tests that can fail.** Every check raises an error with a nonzero exit status, so the checks stay active under Python's optimised mode. Weakening the support check makes `verify.py` fail under `python -O`, as it must.
- **Replay.** All five scripts were rerun from fresh copies before release, normally and under `python -O`; every output matched the shipped files. GitHub CI reruns them and the negative control on every push.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round. It rewrote the introduction for non-specialists, filled six short proof steps, added the counterexamples over finite groups, and added the tail theorem from $n=4k$ and a small-ball inequality. A re-review, a proof audit and a second-model audit found two wrong sentences, whose conclusions were unaffected, and some attribution and scope points; all were corrected. Before release the attribution of the Krawtchouk bound was checked against the Dumer–Kapralova article (its Corollary 10), and the sentence on Levin's ordering against his preprint and technical report. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** MMS itself is not proved; the tail problem for $2k<n<4k$, the zero-sum problem over finite groups, higher Johnson eigenspaces and polynomial distance on slices for degree two or more are open. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Combinatorialists and coding theorists | Exact minimum supports for the first Johnson eigenspace and exact distance for degree-one functions on Boolean slices over any Abelian group | First eigenspace and degree one only |
| Probabilists | Sharp entropy, small-ball and tail bounds for sums sampled without replacement | The tail bound is for two-valued lists and $n\ge4k$ |
| Researchers on the MMS conjecture | A precise statement of what remains: the Aydinian–Blinovsky reduction | MMS is not proved here |
| Research agents | Machine-readable claims, an agent index and five fast exact checks | The checks supplement the written proofs |

## Why the problem matters

Fixed-size samples appear wherever a committee, a test set or a portfolio is chosen without replacement. The three questions here ask how badly concentrated such a sum can be, and each turns out to have a single extremal shape: one outlier, except at exact half-sampling, where two outliers can win. The release proves a conjecture that had been supported only by computation up to $n=600$, solves an entropy optimisation left open this year, and narrows the MMS problem to a single clean conjecture about two-valued lists.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root (standard-library Python 3.10 or later; the scripts write their outputs to the working directory, so run them in a copy):

```sh
shasum -a 256 -c SHA256SUMS
mkdir /tmp/sss && cp *.py /tmp/sss/ && cd /tmp/sss
python3 -O -I -B verify_extensions.py --output verification_extensions.json
cmp verification_extensions.json <package>/verification_extensions.json
```

`ENVIRONMENT.txt` lists the commands for all five scripts. `AI_INDEX.md` maps each claim to its proof and checks, `claim_ledger.md` gives the prior-work boundary of each claim, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Determine the exact range of $n/k$ below $4$ in which a single outlier minimises the hypergeometric tail.
2. Prove or refute the Aydinian–Blinovsky reduction; with Theorem 1.5 it would settle MMS for $n\ge4k$.
3. Find the minimum support of zero-sum lists over $\mathbb Z_q$.
4. Extend the support formula to higher eigenspaces of the Johnson graph, or to the Grassmann graph.

## What is in the evidence package

The paper (LaTeX source and PDF); five Python scripts (`verify.py`, `verify_independent.py`, `verify_small_complete.py`, `verify_extensions.py`, `fingerprints.py`) with their recorded outputs; `claim_ledger.md` and `PRIOR_ART.md`; `refs.bib` from Crossref, DataCite and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and SHA-256 sums.
