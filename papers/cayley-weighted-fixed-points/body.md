## Summary

**The objects.** A *Cayley permutation* is a word of positive whole numbers whose letters use an unbroken set of labels starting at one: $1,2,\ldots,k$ for some $k$, each at least once. Equivalently, it records a ranking with ties — an ordered way of splitting positions into groups. The classical counts used here come from the literature on such preferential arrangements. Cerbai, Claesson, Ernst and Golab (CCEG) studied them in a paper on pattern-avoiding Cayley permutations and left an identity as Conjecture 7.4.

**A small example.** The words **11, 12 and 21** all use an unbroken set of labels starting at one. They are the three Cayley words of length two. Mark a position when its value matches its position number, and give that match its position as a weight. The three words contribute **1, 3 and 0**, totalling **4**.

Adding every letter instead gives **8**. Divide by the word length, two, and the answer is again four. Half the number of primitive Cayley words of length three is also four; "primitive" means adjacent letters differ.

**What was found.** This candidate proves the equality at **every positive length**, resolving CCEG Conjecture 7.4. The main observation is symmetry: every position sees the same distribution of labels. The scalar counting formulas were known; the contribution is the explicit fixed-point interpretation.

**Status.** An anonymous, AI-assisted, unrefereed written-proof candidate with internal exact checks. No external peer review, formal verification or unaffiliated reproduction has been established, and no broad impact is claimed: this is a focused clarification in combinatorics.

## Summary for specialists

For $n\ge1$, let $\mathrm{Cay}[n]$ be the surjective words onto some initial interval $[k]$, and let $\mathrm{Prim}[n]$ be the nonempty such words with unequal adjacent letters. Then

$$
\begin{aligned}\frac{\lvert\mathrm{Prim}[n+1]\rvert}{2}&=\frac1n\sum_{w\in\mathrm{Cay}[n]}\sum_i w_i\\&=\sum_{w\in\mathrm{Cay}[n]}\sum_{i:w_i=i}i.\end{aligned}
$$

This is Theorem 1 of the paper (CCEG Conjecture 7.4, stated there with $\lvert\mathrm{Prim}'[n]\rvert=\lvert\mathrm{Prim}[n+1]\rvert$). The common value equals $\tfrac12\sum_{w\in\mathrm{Cay}[n]}(\max w+1)$; for $n=1,\ldots,7$ it is

$$
1,\ 4,\ 22,\ 154,\ 1306,\ 12994,\ 148282.
$$

For exactly $k$ labels and arbitrary real weights $a_i$, the weighted fixed-point total is $(k-1)!{n\brace k}\sum_{j=1}^k a_j$. This refinement is an immediate consequence of classical conditional rank symmetry, not a separate major novelty claim.

## Technical account

The proof works in the language of ordered set partitions: a Cayley word $w$ with $k$ labels is the ordered partition $(B_1,\ldots,B_k)$ of $[n]$ with $B_j=\{i: w_i=j\}$. Write $S_1$ for the total letter sum, $S_2$ for the weighted fixed-point sum and $K=\sum_w (k(w)+1)$. Three short lemmas then give $\tfrac12\lvert\mathrm{Prim}[n+1]\rvert=K/2=S_1/n=S_2$.

**Relabelling (Lemma 4): why fixed points reduce to letter sums.** Interchanging two positions preserves the set of unrestricted Cayley words. Thus the number with value $j$ at position $i$ is independent of $i$. Summing the diagonal counts with weights $j$ recovers the one-position rank sum, which is the total letter sum divided by $n$. **Equal marginals suffice; independence is neither needed nor asserted.** Arbitrary position permutations need not preserve primitivity, so they are applied only to unrestricted words.

**Reversal (Lemma 3) and the primitive count.** Reversing ordered blocks sends each label $j$ to $k+1-j$, so paired letter sums total $n(k+1)$, giving $2S_1=nK$. An elementary recurrence counts primitive words on $r$ labels as $r!{m-1\brace r-1}$ at length $m$, so $\lvert\mathrm{Prim}[n+1]\rvert=K$. Combining these establishes the three-way identity without a species-theoretic dependency.

**Marked cuts (Lemma 2).** The familiar marked cut has $k+1$ positions, including both ends. It counts pairs of ordered partitions on complementary subsets. It does **not** provide the separate direct bijection from primitive words sought in the source paper.

## Evidence, assurance and limitations

- **Proof and checks.** The universal claim rests on the written proof. Exact checks enumerate directly through $n=7$ and use ordered-partition insertion through length eight, including all 545,835 words at that length and every fixed-alphabet stratum. Independent count formulas agree through $n=30$; that is not enumeration of all words to length 30. Four deliberately false expectations are rejected under normal and optimized Python.
- **Assurance.** This remains an unrefereed candidate. Internal review and alternative checking code do not establish external peer review, formal verification or unaffiliated reproduction.
- **Scope.** The main identity excludes $n=0$: there the middle term is undefined and the empty fixed-point sum is zero, whereas $\lvert\mathrm{Prim}[1]\rvert/2=1/2$. No broad applied impact or major new counting framework is claimed.

## Relationship to earlier work

Cerbai, Claesson, Ernst and Golab posed the exact identity in Section 7. Sloane and Wieder had already derived the rank marginal and common scalar enumerator; Ahlbach, Usatine and Pippenger describe the one-bar construction. The revised paper credits both. The scalar values are known OEIS enumerators (A083385, A083410, A005649), not new sequences. The source search found no earlier explicit proof of the weighted fixed-point interpretation, but that bounded finding does not establish priority. Counting fixed-point-free Cayley words is a different question.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Enumerative combinatorialists | A short proof of the stated conjecture and its fixed-alphabet refinement | Scalar formulas and cut construction are inherited |
| Researchers working with exchangeable structures | A transparent example of converting weighted diagonal events into marginal counts | Position symmetry must actually hold in the proposed class |
| Readers checking AI-assisted research | Small proofs, exact code and explicit review dispositions | Internal verification is not external assurance |

## Why the problem matters

The note explains why three apparently different counts coincide. Its value is a focused clarification in combinatorics, not evidence of a general scientific breakthrough. A short proof can be useful without its conjecture label implying exceptional significance.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md`, then the theorem and elementary recurrence in `paper.tex`. Run:

```sh
python3 code/cayley_check.py
python3 code/refinement_check.py
python3 code/refinement_check.py --controls
PYTHONOPTIMIZE=1 python3 code/refinement_check.py
```

`REPLAY_RECEIPT.md` separates finite ranges from the universal argument; `MANIFEST.json` binds the shipped files. At length eight the recorded values are $\lvert\mathrm{Cay}[8]\rvert=545835$, $S_1=15266192$ and $S_2=1908274$.

## The most valuable next projects

1. Check the historical positioning against further primary sources.
2. Investigate the distinct primitive-species bijection question.
3. Any extension to restricted word classes must first establish the required position symmetry; pattern restrictions can destroy it.

More terms of the existing sequence alone would not increase this note's significance.

## What is in the evidence package

The revised manuscript and PDF, exact checkers with failure controls, structured claims, source audit, full review-response table, environment record, component licences, manifest and substantive AI index. Historical inputs and full supplied review remain preserved separately; public assurance is stated at the level the evidence supports.
