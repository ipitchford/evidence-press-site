## Summary

**The setting.** Take any graph: points (vertices) joined by links (edges). Call a set of vertices **dependent** if it contains both ends of at least one edge. For each size $k$, let $d_k$ count the dependent $k$-vertex sets. Small sets are rarely dependent, large sets almost always are, so the counts start at zero, grow, and eventually shrink again simply because there are few very large sets.

**Two kinds of smoothness.** A sequence is **log-concave** if $d_k^2\ge d_{k-1}d_{k+1}$ for every $k$: informally, it rises and then falls with no second hump, and the ratio from one term to the next never increases. A sequence is **ultra log-concave** if it stays log-concave after dividing each term by the binomial coefficient $\binom nk$, the number of all $k$-sets. Dividing out the binomial coefficient removes the obvious "there are more medium-sized sets" effect, so ultra log-concavity is a strictly stronger statement. For a probability distribution it says the distribution is at least as concentrated as a binomial one, the count of heads in independent coin tosses.

**A tiny example.** Take two separate edges $ab$ and $cd$ on $n=4$ vertices. The dependent sets are those containing $\{a,b\}$ or $\{c,d\}$, so $(d_0,\dots,d_4)=(0,0,2,4,1)$. Dividing by $\binom4k$ gives $(0,0,\tfrac13,1,1)$, and the ultra log-concave inequalities hold: for instance $1^2\ge\tfrac13\cdot1$.

**What was known and what was conjectured.** Horrocks (2002) proved that $d_k$ is log-concave for every graph. Xie and Xu (*Electronic Journal of Combinatorics*, 2026) conjectured the ultra log-concave form, their **Conjecture 4.1**, and proved it only for two special classes of graphs.

**What this paper proves.**

- **Conjecture 4.1 holds for every graph**, in a stronger weighted form. Vertices may carry arbitrary nonnegative weights, and single vertices (loops) may also make a set dependent.
- **It cannot be pushed to triples.** If dependence is triggered by three-element sets, the property can fail: a five-element family with counts $(0,1,4,10,5,1)$ gives $96<120$ where the inequality needs $\ge$.
- **A broader conjecture, partly.** Xie and Xu's Conjecture 4.4, about structures called 2-matroids, is proved for rank at most four or at most seven elements. The general case stays **open**.
- **A usable consequence.** If independent coin flips decide which vertices are selected, and you condition on the selection containing an edge, the number $K$ selected has variance at most $m(1-m/n)$, where $m$ is its mean.

**What it does not do.** It does not prove real-rootedness of the dependence polynomial or negative correlation, which are different and stronger properties, and it does not settle Conjecture 4.4 in general.

The sections below move from this overview to a specialist summary, the technical argument, evidence and limits, and how to rerun the checks.

## Summary for specialists

Let $\mathcal U\subseteq2^V$, $|V|=n$, be increasing with minimal members of size at most two (the dependent sets of a graph with loops). For weights $w_v\ge0$ put $A_k=\sum_{S\in\mathcal U,|S|=k}\prod_{v\in S}w_v$.

- **Theorem 1.1.** $k(n-k)A_k^2\ge(k+1)(n-k+1)A_{k-1}A_{k+1}$ for $1\le k\le n-1$. With $w\equiv1$ this is Xie–Xu Conjecture 4.1 for $d_k(G)$; normalisation always uses the ambient $n$.
- **Theorem 1.2.** With $b_k$ the number of $k$-sets $S$ such that both $S$ and $V\setminus S$ lie in $\mathcal U$, the sequence $b_k/\binom nk$ is symmetric and unimodal: $kb_k\ge(n-k+1)b_{k-1}$ for $k\le\lfloor n/2\rfloor$. This strengthens Horrocks's 2000 unimodality theorem for doubly dependent sets.
- **Section 6.** A weighted form of Xie–Xu Conjecture 4.4 for additive 2-matroids of rank at most four or on at most seven elements; the first three inequalities hold in any rank. An explicit eight-element obstruction marks where the method stops.
- **Section 5.** Witness size three fails (also for two disjoint triples with weights $(1,M,M,3,3,3)$, exactly when $M\ge44$; six is the minimum ground set for a uniform-triple counterexample). Ultra log-concavity of noncover-complex face numbers, and $\operatorname{Var}K\le m(1-m/n)$ for conditioned Bernoulli occupancy.

## Technical account

**Shadow comparisons (Section 2).** An elementary rank comparison for downsets and a new marked-downset comparison (Lemma 2.2), derived from Katona's intersection-shadow theorem in the form stated by Frankl.

**Critical elements (Section 3).** A boundary identity relates consecutive two-colouring counts to counts of *critical* elements, those whose removal makes a dependent set independent. Double counting critical elements with the marked-downset lemma gives the normalised inequality of Theorem 1.2. The pair structure of witnesses is what makes this count work: adding an element creates a witness only through a single marked neighbour or a loop.

**Conditioning and conversion (Section 4).** Fixing any coordinates keeps the family in the same class, and product weights cancel in complementary pairs, so the two-colouring property holds after any conditioning (the property called CAPU in the paper). The Kahn–Neiman theorem (2011, Theorem 1), quoted exactly with each hypothesis checked, turns the conditional antipodal-pairs property into ultra log-concavity of the weighted rank sequence.

**Why not Lorentzian polynomials.** Mason's conjecture for matroid independent sets was proved with completely log-concave and Lorentzian polynomials (Anari, Liu, Oveis Gharan and Vinzant; Brändén and Huh). That route needs M-convex support, and the natural homogenisation of the dependent-set polynomial fails this already for two disjoint edges.

## Evidence, assurance and limitations

- **Proofs.** All main claims have written proofs. Two external results are imported and stated: Katona's shadow theorem and the Kahn–Neiman criterion.
- **Exact finite checks.** `verify.py` uses integer arithmetic only. It checks every singleton-and-pair family on at most six labelled elements, each with three weight vectors (41,657 families, 124,971 weighted checks), the marked-downset lemma on every downset of at most five elements (258,132 comparisons), and the counterexamples.
- **Enumeration.** `supplement/check_six.cpp` checks the six-element 2-matroid lemma exhaustively: 2,653,437 combinations, 1,723,681 valid completions, minimum margin 0. It corroborates an analytic proof and is not a proof dependency.
- **Replay.** Both were rerun from fresh copies with and without Python `-O`; checks are explicit conditionals, not `assert`, and a deliberately wrong value fails under `-O`. GitHub CI reruns them.
- **Limits.** Finite checks cannot establish the universal theorem. The full text of Horrocks (2002) could not be obtained, so his proof technique was not compared; Xie and Xu cite it and still pose the ultra form as open. The prior-art search (2 and 4 November 2026; literature, GitHub and the Evidence Press corpus) was bounded and found no overlap. Review was internal and AI-assisted only; this is an unrefereed candidate.

## Who should care, and why

- **Combinatorialists working on log-concavity and unimodality**: a complete answer to a published conjecture, and a two-colouring theorem with its own interest for doubly dependent sets and noncover complexes.
- **Probabilists studying negative dependence**: a concrete class of conditioned product measures whose size is binomially concentrated, with an explicit variance bound, and exact examples showing where the class ends.
- **Anyone needing concentration for random sets forced to contain an edge**: the bound $\operatorname{Var}K\le m(1-m/n)$ holds for every graph and every choice of selection probabilities.

## Why the problem matters

Log-concavity results for combinatorial counts often hide structural information: Mason's conjecture for matroids took decades and new algebraic tools. Dependent sets of graphs are the simplest natural family outside the matroid world, and here the Lorentzian tools do not apply directly. The proof shows that a short combinatorial argument, built on a classical shadow theorem and an antipodal-pairs criterion, reaches the full ultra log-concave statement, and the counterexamples show the hypothesis on witness size is exactly right.

## How to inspect or reproduce the recorded checks

From the unpacked archive (Python 3.10 or later, standard library only; a C++17 compiler), on a copy because `verify.py` rewrites its JSON output:

```sh
cp -R dependence-ultra-log-concavity-0.1.0-candidate /tmp/ulc && cd /tmp
python3 -I -B ulc/verify.py       # status PASS; 41657 families, 124971 weighted checks, 258132 marked comparisons
python3 -O -I -B ulc/verify.py    # same under -O
c++ -O2 -std=c++17 -Wall -Wextra -pedantic ulc/supplement/check_six.cpp -o check_six && ./check_six
```

The C++ program prints `checked=2653437 valid=1723681 minmargin=0`. Each step takes a few seconds.

## The most valuable next projects

1. Prove the eight-element antipodal inequality needed for 2-matroids of rank five, or find a 2-matroid that violates Conjecture 4.4.
2. Compare the argument with Horrocks's 2002 proof of ordinary log-concavity.
3. Decide whether the dependence polynomial has stronger properties, such as real roots, for natural graph classes.
4. Identify which increasing families with triple witnesses remain ultra log-concave.

## What is in the evidence package

The archive contains the manuscript (PDF and LaTeX source), `verify.py` and its recorded output, the six-element C++ enumeration with its results, supplementary notes on the 2-matroid reduction, its analytic proof and the frontier obstruction, an independently reconstructed internal proof audit, the dated novelty report and claim records, a rating-free internal review summary, the bibliography with the Crossref and arXiv records it was copied from, an AI index, research-gate records, CI configuration and SHA-256 sums. Text and data are CC0-1.0 and code is MIT. This is an unrefereed candidate.
