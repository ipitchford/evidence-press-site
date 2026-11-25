## Summary

**In one sentence.** If you paint coins or dice with colours, roll them all and count how many different colours show up, the count is most unpredictable when one colour is shared by every coin, not when the colours are spread evenly: this candidate proves that exactly for coins and large palettes, and shows that unbalanced "hub" designs beat every evenly spread design for dice of every size.

**The puzzle.** Take $n$ colours and $m$ dice, each with $r$ faces. Paint each die's faces with $r$ different colours; a colour may be reused on other dice. Roll everything and let $X$ be the number of different colours showing. How should the dice be painted so that $X$ is as hard to predict as possible, in the sense of largest Shannon entropy $H(X)=-\sum_k \Pr(X=k)\log \Pr(X=k)$? Christos Pelekis posed this question in 2019. It belongs to the maximum-entropy tradition (find the most uncertain variable in a constrained family) and is a clean test of how the shape of the dependence between random events affects a random count. For coins ($r=2$) a painting is just a multigraph: colours are vertices and each coin is an edge between its two colours.

**Two strategies pull against each other.** Spreading the colours evenly makes every colour behave alike, which looks fair. Putting one colour on many dice makes that colour almost certain to appear, so the uncertainty is carried by the other colours, which can then behave like nearly independent fair coin flips. Pelekis showed that no design has variance above a quarter per colour, which is exactly what independent fair flips give, and concentration wins.

**What was known.** Pelekis proved that the entropy is at most about half the logarithm of $n$. He conjectured that the colours should be spread as evenly as possible over the dice, that the cycle is optimal for coins and the "circular" design (each die covers $r$ consecutive colours around a circle) is optimal for dice, and, as his Conjecture 4.1, that the circular design reaches entropy at least $\tfrac12\log_2(n/r)$ minus a constant. Research records of the trureturing project refuted the even-spread and circular conjectures at one small size each by exact computation, and proposed, without proof, the answer for three colours.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| Fair coins, exactly | For every large enough palette and any number of coins $m\ge n$, the unique best design puts one shared colour on every coin and pairs it once with each other colour. Up to three leftover coins repeat three different pairs; four or more leftover coins should all repeat the same pair | Theorem A, Section 9 |
| The threshold | The palette size from which this holds is not explicit. It is at least ten: with nine colours and eleven coins the rule fails, by an exactly certified margin | Section 9 |
| Three colours | Solved for every number of coins, which proves the candidate proposed by trureturing | Section 9 |
| Hub designs for dice | For any number of faces, designs in which a few shared colours sit on every die beat every evenly spread design once $n$ is large, by at least $\tfrac12\log 1.5$ nats. So the even-spread, cycle and circular conjectures fail for every die size, not just at small cases. Exact checks confirm this for 2- to 8-sided dice from small sizes up to 120 colours | Theorem B, Section 7 |
| Conjecture 4.1 | Proved, with a constant that does not depend on the die size | Corollary 1.1 |
| The engine | A precise bell-curve law for each individual value of the count, for a general sampling model, with all errors measured by the expected number of collisions | Theorem C |

**The idea.** Hidden inside the random rolls are many independent fair "switches", each of which adds a new colour or not with probability one half. Enough of them give the bell-curve shape, and their number is tied to how often two dice land on the same colour. For coins, an exact formula for the variance lost relative to $n/4$ forces a star, and a direct comparison of designs with two shared colours decides where the leftover coins go.

**Limits.** The coin theorem holds for all sufficiently large palettes, but the threshold is not explicit: only "at least ten" is known. For dice with three or more faces the hub designs beat evenly spread ones, but the true optimum is not identified. For a fixed die size, Conjecture 4.1 also follows from a short argument; the contribution there is the uniform constant and the precise local theory. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks only.

## Summary for specialists

Let $P=(p_{iv})$ be an $n\times n$ doubly stochastic matrix, draw $Y_i$ independently from row $i$, and let $X=|\{Y_1,\dots,Y_n\}|$, $\sigma^2=\operatorname{Var}X$, $d_i=1-\sum_v p_{iv}^2$ and $S=\sum_i d_i$, twice the expected number of colliding pairs. Regular designs with $m=n$ are the case where every row of $P$ is uniform on an edge.

- **Theorem C** *(proof)*: with absolute constants, $cS\le\sigma^2\le S/2$, $\max_k\Pr(X=k)\le C(1+S)^{-1/2}$ and $H(X)=\tfrac12\log(1+S)+O(1)$; for $S\ge2$ the local error $\sup_k|\sigma\Pr(X=k)-\phi((k-\mu)/\sigma)|$ is at most $C/\sqrt S$, which is best possible; every fixed order of the lattice Edgeworth expansion holds; uniformly in $P$,
$$\begin{aligned}H(X)&=\tfrac12\log(2\pi e\sigma^2)\\&\quad-\frac{\kappa_3^2}{12\sigma^6}+O(S^{-2});\end{aligned}$$
and a saddlepoint formula holds in a window of width proportional to $S$. The central limit theorem in this setting is due to D'yakonova and Mikhailov.
- **Corollary 1.1** *(proof)*: every $r$-uniform, $r$-regular design has $H_2(X)=\tfrac12\log_2 n+O(1)$ with an absolute constant, which gives Pelekis's Conjecture 4.1.
- **Theorem A, Theorems 9.1 and 9.3** *(proof)*: there is an absolute $n_0$ such that for $n\ge n_0$ and $m\ge n$ the unique maximiser among loopless multigraphs is the star with $t=m-n+1$ extra edges, on $t$ distinct spokes if $t\le3$ and on one spoke if $t\ge4$. For fixed $t$, $H=\tfrac12\log\big(2\pi e((n-1)/4-f(t))\big)+O_t(n^{-2})$ with $f(t)=\min\{t/16,\tfrac14(1-2^{-t})^2\}$. The proof gives no value for $n_0$; $n_0\ge10$ by an exact certificate.
- **Theorem B, Theorem 7.3 and Corollary 7.4** *(proof)*: for every $r\ge2$ and $m=n$ an explicit hub design has entropy at least that of every evenly spread design plus $\tfrac12\log1.5-o(1)$ nats, so Pelekis's Conjecture 1.3 and cycle and circular maximality fail for every $r$ and all large $n$; for $r=2$ Conjecture 1.3 also fails for every $m\ge n$. For $2\le r\le8$ this is certified for every $n$ from $6,10,16,20,26,31,38$ (respectively) up to $120$.
- **Theorem 6.2** *(proof)*: the eventual entropy maximisers among regular designs of ranks two and three, separated by the entropy correction of Theorem C.

**Known and new.** The central limit theorem is D'yakonova and Mikhailov's; Hwang and Janson proved the optimal local rate when all particles share one law; Edgeworth expansions were known for equiprobable or conditionally independent allocations; Barbour, Braunsteins and Ross gave Stein-method local limit theorems for other occupancy statistics; the squared-skewness entropy correction is classical for independent sums. New here, within a literature search of limited scope: local, higher-order and entropy statements uniform over all doubly stochastic matrices, down to nearly deterministic rows; the exact coin optimum for large palettes; and the infinite-family refutations of the even-spread and circular conjectures for every die size.

## Technical account

**Switches (Section 3).** Each row draws two labels from its own law and is marked with a small fixed probability. A marked row with two different labels becomes an *active pair* and picks one of them with a fresh fair coin; every other row simply takes its first label, so each row's draw still has the right law. An active pair is a *switch* when it is disjoint from all other active pairs and exactly one of its labels is already taken by an unmarked row. Conditioning on everything except the switch coins gives $X=X_0+\mathrm{Bin}(K,\tfrac12)$, where $K$ is the number of switches. Lemma 3.1 shows $\mathbb E K\ge a_0S$ and $\operatorname{Var}K\le72S$, and Lemma 3.2 shows that $K<a_0S/2$ has probability at most $e^{-b_0S}$. This gives the variance lower bound, the maximum-atom bound and Corollary 1.1.

**Cumulants (Section 4).** A hard-core polymer representation of the generating function of the number of repeated selections $n-X$ bounds every cumulant by a constant multiple of $S$ (Lemma 4.1). Fourier inversion with the switch bound for the characteristic function away from zero gives the lattice Edgeworth expansion (Lemma 4.2), and from it the local limit theorem.

**Entropy (Section 5).** Expanding $-\sum_k p_k\log p_k$ around the Edgeworth density gives the Gaussian value minus $\kappa_3^2/(12\sigma^6)$, with error $O(S^{-2})$ (Theorem 5.1). This is precise enough to separate competing regular designs (Theorem 6.2).

**Hub designs (Section 7).** In the hub design $\mathcal H_{n,r,s}$, $c=r-s$ shared hub colours sit on every die, and the other colours come in blocks of $s$ leaves, each block carried by $s$ copies of one die. Blocks are independent, and the variance per colour is
$$\begin{aligned}V(s,r)&=q(1-q)\\&\quad+(s-1)q^2(\tau^s-1),\end{aligned}$$
with $q=(1-1/r)^s$ and $\tau=(1-2/r)/(1-1/r)^2$. Lemma 7.2 shows $V(s,r)\ge1.5\,V_{\max}(r)$ for some $s$, where $V_{\max}(r)$ is the largest variance per colour of a regular design: exactly for $r\le199$, analytically beyond. The entropy limit theorem of Gavalakis and Kontoyiannis then turns the variance gap into the entropy gap $\tfrac12\log1.5$.

**Coins (Section 9).** For a multigraph, a colour of degree $d$ is missed with probability $2^{-d}$, colours that share no coin are missed independently, and adjacent colours are never both missed. This gives an exact formula for the variance deficit relative to $(n-1)/4$. Comparing the Gaussian entropy bound with the star's entropy shows that a near-optimal graph has a small deficit, which leaves room for only a bounded number of non-leaf colours and identifies the star for each fixed surplus $t$ (Theorem 9.1). Proposition 9.2 compares graphs with two hubs exactly, through the law of the leaf split, and shows that hanging every leaf on one hub is best; Theorem 9.3 combines the two for all $m\ge n$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/dice-colouring-entropy-hub-designs.txt) is available for reading.

- **Proofs.** The 19-page paper opens with a plain introduction (the question, what was known, the main results, the relation to the occupancy literature and a roadmap) and gives written proofs of every theorem, including the two classical inequalities it uses. No proof assistant was used.
- **Checks.** Eight standard-library Python scripts check identities, constants and small cases: the switch construction and variance identities on 9,635 rational matrices; the polymer identity; the entropy correction against exact entropies (the squared-skewness coefficient comes out near $1/12$); all 3-regular designs up to eight vertices; every coin design for $n\le5$, $m\le n+2$, and star rankings up to $n=500$ with outward-rounded intervals; the two-hub comparison; the nine-colour exception; and the hub-design certificates for 2- to 8-sided dice up to 120 colours, in exact rational arithmetic with 60-digit logarithms.
- **Tests that can fail.** No script uses `assert`; every check raises explicitly, so the scripts behave identically in Python's optimised mode. Inverting the polymer identity or the two-hub comparison makes the scripts fail.
- **Replay.** All eight scripts were rerun from a fresh copy before release in optimised mode, and every output matched the recorded log byte for byte. GitHub CI reruns them on Linux, compares under a declared policy (every word, integer and count exact; printed decimals within a small relative tolerance) and runs the failure test; on Linux the logs also matched exactly.
- **Review.** A five-role internal Claude review, with methodology (a line-by-line proof audit) and devil's advocate as separate reviewers and editor, domain and perspective in one combined pass, then the lead's own proof audit. The revision reframed the Conjecture 4.1 claim, stated the consequences for Pelekis's other conjectures, credited trureturing for the earlier small counterexamples and the three-colour proposal and D'yakonova and Mikhailov for the central limit theorem, added the hub designs, replaced bare assertions and rebuilt the introduction for non-specialists. A re-review and proof audit of every new or rewritten proof found no open correctness issue. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The palette threshold is not explicit (only "at least ten"); the optimum for dice with three or more faces is not identified; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in probabilistic combinatorics | The exact coin optimum, the hub constructions and the deficit identity as tools for other extremal entropy problems | The palette threshold is not explicit |
| Researchers on occupancy and allocation schemes | A local limit theorem, Edgeworth expansions and an entropy correction uniform over all doubly stochastic sampling laws | Constants are absolute but not numerically explicit |
| Information theorists | A worked case where maximum entropy prefers concentrated, unbalanced dependence over symmetric spreading | For dice with three or more faces only a lower bound on the optimum is given |
| Research agents | Machine-readable claims, an agent index and replayable checks | The scripts check small cases; the proofs carry the general claims |

## Why the problem matters

Counts of distinct values (occupied cells, colours seen, species observed) appear throughout probability, statistics and computer science, and their fluctuations depend on how the underlying choices are coupled. Pelekis's puzzle isolates that dependence in its simplest form. The answer, that concentrating one colour beats spreading colours evenly, overturns the natural symmetric guess, and the limit theorem behind it gives sharp control of such counts for any doubly stochastic sampling law, including nearly deterministic ones.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.10 or later and no extra packages, from the package root:

```sh
python3 -O checks/check_threshold.py
python3 -O checks/check_twohubs.py
python3 -O checks/check_hubs.py 120
```

Each ends with `PASS` and a count of explicit checks (6, 1,810 and 3,984). The hub certificates take about half a minute, `check_rank3.py` about fifteen seconds and the others a few seconds each. `README.md` lists every command and its expected count, `checks/*.log` records the output, and `ENVIRONMENT.txt` and `ci/compare_logs.py` state the comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Make the palette threshold explicit, through explicit constants in the entropy expansion of sums of mostly fair coin flips and a pruned search; ten is the current lower limit.
2. Identify the optimal designs for dice with three or more faces: do hub designs attain the best variance per colour?
3. Find the sharp constant in $\sigma^2\ge cS$ over all doubly stochastic matrices.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the eight check scripts in `checks/` with their recorded logs; `ci/compare_logs.py`; `requirements.txt` (no third-party dependencies); `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
