## Summary

This page explains, in order: what an overpartition is, what Wei conjectured, what the three papers in this collection prove, how the proofs reduce an infinite statement to a finite calculation, and what has and has not been checked.

**What is being counted.** There are three ways to write 3 as an unordered sum: $3$, $2+1$, and $1+1+1$. An **overpartition** allows the first occurrence of each distinct part to be marked. Those three partitions therefore give $2+4+2=8$ overpartitions. Writing $\overline p(n)$ for the number of overpartitions of $n$, the counts grow rapidly, but some have striking divisibility patterns: on certain carefully described sets of inputs, every value is divisible by a fixed prime. These are *Ramanujan-type congruences*, named after Ramanujan's famous divisibility patterns for ordinary partitions.

**What was conjectured.** In 2026 Wei proved such congruences for overpartitions modulo 11 and 13, and stated further congruences modulo 7, 17, 19 and 23. For 17 and 23 he reduced them to finite checks of about $1.2\cdot10^9$ and $4.0\cdot10^9$ coefficients, which had not been completed. He stated the modulo-19 case as a conjecture that cannot be proved by the methods of his paper.

**What was found.** This collection gives computer-assisted proofs of those four congruences and explains several related infinite families. The patterns hold only on their stated number classes—not for every input. The package contains three papers:

- **Paper A (modulo 7)** supplies a compact certificate for Wei's modulo-7 conjecture.
- **Paper B (modulo 17, 19 and 23)** replaces the unfinished billion-coefficient checks for 17 and 23 by a structural argument needing fewer than 4,000 coefficients, and handles the most difficult cusp calculation, for 19.
- **Paper C (towers)** explains how certain congruences propagate through every power of four, proves additional restricted families modulo 13, 17 and 23, and classifies exactly when a whole modulo-13 class vanishes.

Two tower base cases coincide with the middle paper and are not additional results.

**Status.** An anonymous, AI-assisted, unrefereed computer-assisted proof collection. The finite calculations are exact and can be rerun; the universal conclusions rest on the written modular-form arguments. There has been no formal verification, external peer review or unaffiliated reproduction.

## Summary for specialists

Writing $\overline p(n)$ for the overpartition function, so that $\sum_{n\ge0}\overline p(n)q^n=1/\varphi(-q)$ with $\varphi(q)=\sum_{k\in\mathbb Z}q^{k^2}$, the modulo-7 result (Paper A, Theorem 1) is

$$
\overline p(16(56n+k))\equiv0\pmod7.
$$

This holds for every $n\ge0$ and $k\in\{11,43,51\}$; equivalently, $\overline p(16m)\equiv0\pmod 7$ whenever $m\equiv3\pmod8$ and $(m/7)=1$.

The middle paper proves Wei's specified modulo-17/23 classes (Paper B, Theorem 1),

$$
\overline p\big(17\cdot11^2(88n+m)\big)\equiv0\pmod{17},\quad m\in\{19,35,43,51,83\},
$$

$$
\overline p\big(23\cdot13^2(104n+l)\big)\equiv0\pmod{23},\quad l\in\{29,53,61,69,77,101\},
$$

and (Paper B, Theorem 2)

$$
\overline p(4\cdot17^2n)\equiv0\pmod{19}
$$

when $n\ge0$, $n\equiv3\pmod8$, $(n/17)=-1$ and $(n/19)=1$. Parentheses here denote Legendre symbols.

The tower paper proves its explicitly restricted $\ell^2 4^i$ families modulo 13, 17 and 23, plus fixed-scale cases (Paper C, Theorem 1), for all $i\ge0$ and $m\ge1$:

| Family | Congruence | Conditions on $m$ |
|---|---|---|
| (I) | $\overline p(17\cdot4^i\ell^2m)\equiv0\pmod{17}$, $\ell\in\{11,29\}$ | $m\equiv3\pmod8$, $(m/\ell)=-1$ |
| (II) | $\overline p(23\cdot4^i\cdot13^2m)\equiv0\pmod{23}$ | $m\equiv5\pmod8$, $(m/13)=1$ |
| (III) | $\overline p(13\cdot4^i\cdot7^2m)\equiv0\pmod{13}$ | $m\equiv7\pmod8$, $(m/7)=-1$ |
| (IV) | $\overline p(52\,\ell^2m)\equiv0\pmod{13}$, $\ell\in\{5,29\}$ | $m\equiv1\pmod4$, $(m/\ell)=-1$ |
| (IV) | $\overline p(104\cdot5^2m)\equiv0\pmod{13}$ | $m$ odd, $(m/5)=1$ |

The cases $i=0$ of (I) with $\ell=11$ and of (II) are Wei's conjectures and coincide with Paper B. Its additional whole-class classification (Paper C, Proposition 4) is

$$
\overline p(13\cdot4^i(8n+7))\equiv0\pmod{13}.
$$

For a fixed nonnegative integer $i$, this holds for **every** $n\ge0$ if and only if $i\equiv3\pmod4$. Wei supplies the $i=3$ instance.

See the individual theorem statements for every prime and character restriction.

## Technical account

**The finite step.** A Sturm bound is not a heuristic stopping point: once the relevant modular-form space and integrality are established, it makes a finite coefficient calculation decisive. Every proof in the collection therefore has the same shape: first show, by written argument, that the generating function of interest (after reduction modulo the prime) is a modular form of known weight and level; then check enough coefficients to reach the Sturm bound.

**Modulo 7.** Theta-function 2-dissections give an exact expression for $\sum\overline p(16n)q^n$. Reduction modulo 7 turns it into a holomorphic modular form of weight 18 on $\Gamma_0(224)$ divided by a power series in $q^{56}$, and a twisting argument isolates the target classes. The modulo-7 argument uses a sufficient twisting level of 3136, reducing its inclusive coefficient bound from 1,806,336 to 8,064. The level is sufficient, not asserted minimal. Two implementations find all 432 selected coefficients zero, with 370 nonzero complementary controls.

**Modulo 17 and 23.** For modulo 17 and 23, the argument works in spaces of dimensions four and six. Shimura's Hecke operator $T(\ell^2)$ is computed exactly on these small spaces, starting from Wei's forms. A correction term vanishes on the required odd class; its projection has a much smaller Sturm bound than the original proposed calculation (256 and 352 respectively).

**Modulo 19.** Here the relevant generating function has a pole at a cusp, so it is not yet a holomorphic modular form. Modulo 19 requires multiplication by an eta quotient congruent to one **before** projection; projecting first leaves poles, so the order of the two operations matters. The appendix checks every cusp: 34,656 noncritical translated orders are positive, and 28 groups of exact cyclotomic sums cancel at the twelve critical cusps. The projection is then a cusp form of weight $35/2$ on $\Gamma_0(23104)$. Only then is the Hecke–Sturm test justified: a $T(17^2)$ relation is checked through coefficient 53,200, which suffices for the Sturm bound 106,400 of its square. Numerical cusp decay is retained as corroboration only. Paper B packages the pattern as a *sufficient* lift–project criterion (Proposition 9), not an automatic existence theorem for a suitable eta factor and not a claim that the general principle is new.

**Towers.** For the towers, exact $U(4)$ eigenvalues $16,-64,-512$ explain why support vanishing persists at every level: the correction term is a reduction of an exact $U(4)$ eigenvector, so one support identity proves every tower level instead of testing levels one by one. The modulo-13 whole-class result uses all twelve states of the coefficient-vector orbit, with a nonzero witness at coefficient 7 in every excluded state. The first eigenform, $\eta(z)^2\eta(2z)^7\eta(4z)^2$, is already listed by Aydin and Inam and is attributed, not relabelled as new.

## Evidence, assurance and limitations

The release includes written arguments, failure-sensitive scripts, pinned dependencies and a substantive AI index. Proof-critical computations are replayed in normal and optimized Python. Deliberately corrupted parameters must fail.

The recorded replay expects these decisive obligations: for Paper A, 432 zero target coefficients through 8064 and 370 nonzero complementary controls; for Paper B, exact Hecke identities, projection bounds 256/352, 34,656 strictly positive translated orders, twelve critical cusps, 28 zero cyclotomic groups containing 32,928 summands and the Hecke difference through 53,200 inclusive; for Paper C, exact eigenvectors, support bounds 192/256/352 and the full 12-state modulo-13 orbit with zero states 3, 7 and 11.

This is an **unrefereed computer-assisted proof collection**. The universal conclusions depend on the written modularity and cusp arguments, not finite numerical agreement alone. Implementation diversity and AI-assisted adversarial review remain within a coordinated workflow. No formal verification, unaffiliated reproduction or external peer review is established. In particular, the symbolic cusp engine was inspected and replayed, not independently reimplemented from scratch.

The discovery scan behind Paper C (arguments below 40,000,000) was a filtered search, not an exhaustive classification of all possible congruences; it and the historical full numerical cusp scan were not newly repeated, and neither is needed by the proofs. All displayed family restrictions remain essential; no classification of all prime pairs is claimed.

The supplied review judged the work a specialised contribution. The revisions improve its clarity and certificates; they do not establish broad impact.

## Relationship to earlier work

Wei supplies the conjectures and the starting modulo-17/23 forms. Ryan and collaborators already established square-prime, Legendre-restricted families, so square-prime shape alone is not new. The comparison concerns the actual primes, coprimality and extra number-class restrictions. Aydin and Inam already list one auxiliary eta eigenform. Treneer's pole-removal method is a standard input. These dependencies are credited in the manuscripts and source audit.

The literature search found no matching proof of the remaining exact conclusions in the consulted sources. That is a bounded assessment, not a priority guarantee.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Partition theorists | Inspect specific conjecture resolutions and related families | Preserve all residue and character hypotheses. |
| Modular-form researchers | Reuse the explicit lift/projection and support calculations | The sufficient criteria do not guarantee a suitable lift exists generally. |
| Research-software authors | Study fail-sensitive finite proof interfaces | Green software tests are not the entire mathematical proof. |

## Why the problem matters

The interesting feature is that a very large counting problem can have a small structural explanation. These papers make that explanation inspectable: a justified coefficient bound, an exact cusp cancellation, or an eigenvector identity. For modulo 17 and 23, that structure turns a calculation of more than $10^9$ coefficients into one of fewer than 4,000. No direct engineering, policy or economic application is demonstrated.

## How to inspect or reproduce the recorded checks

Download the versioned archive, read `AI_INDEX.md` and install `requirements.txt` with Python 3.13. Then run:

```sh
python verify.py all
PYTHONOPTIMIZE=1 python verify.py all
python negative_controls.py
```

Select `mod7`, `mod17-19-23` or `towers` instead of `all` to inspect one paper. Explicit errors remain enabled in optimized Python, and `negative_controls.py` requires plausible corrupted parameters to fail. `REPLAY_RECEIPT.md` lists the expected counts and bounds; the root claim map (`CLAIMS.json`) points to the relevant theorem and evidence; `ASSURANCE.md` separates finite computation, written modularity and review.

The discovery scan and numerical cusp plots are not substitutes for these exact checks. The current replay intentionally excludes historical exploratory scans that are not needed by the proof. A useful reading order is Paper A first (the shortest complete example of the method), then Section 3 and Appendix A of Paper B, then Section 3 and Proposition 4 of Paper C.

## The most valuable next projects

1. An independently written symbolic cusp-expansion engine would address the most concentrated implementation risk.
2. A mathematical follow-up could establish broader conditions guaranteeing a useful lift before projection.
3. Further prime families require their own complete arguments and prior-art checks; a longer numerical list would not settle that question.

## What is in the evidence package

Three revised PDFs and their LaTeX sources; a combined reading PDF; exact arithmetic code; a root claim map and AI index; review-response and source-comparison records; pinned environment, licence map and checksum manifest. Private review correspondence and obsolete working notes are excluded.
