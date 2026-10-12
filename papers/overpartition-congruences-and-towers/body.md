## Summary

There are three ways to write 3 as an unordered sum: $3$, $2+1$, and $1+1+1$. An **overpartition** allows the first occurrence of each distinct part to be marked. Those three partitions therefore give $2+4+2=8$ overpartitions.

The counts grow rapidly, but some have striking divisibility patterns. This collection gives computer-assisted proofs of four congruences proposed by Wei and explains several related infinite families. The patterns hold only on their stated number classes—not for every input.

The package contains three papers. The modulo-7 note supplies a compact certificate; the modulo-17/19/23 paper handles the most difficult cusp calculation; the tower paper explains propagation through powers of four. Two tower base cases coincide with the middle paper and are not additional results.

## Summary for specialists

Writing $\overline p(n)$ for the overpartition function, the modulo-7 result is

$$\overline p(16(56n+k))\equiv0\pmod7.$$

This holds for every $n\ge0$ and $k\in\{11,43,51\}$.

The middle paper proves Wei's specified modulo-17/23 classes and

$$\overline p(4\cdot17^2n)\equiv0\pmod{19}$$

when $n\ge0$, $n\equiv3\pmod8$, $(n/17)=-1$ and $(n/19)=1$. Parentheses here denote Legendre symbols.

The tower paper proves its explicitly restricted $\ell^2 4^i$ families modulo 13, 17 and 23, plus fixed-scale cases. Its additional whole-class classification is

$$\overline p(13\cdot4^i(8n+7))\equiv0\pmod{13}.$$

For a fixed nonnegative integer $i$, this holds for **every** $n\ge0$ if and only if $i\equiv3\pmod4$.

See the individual theorem statements for every prime and character restriction.

## Technical account

A Sturm bound is not a heuristic stopping point: once the relevant modular-form space and integrality are established, it makes a finite coefficient calculation decisive. The modulo-7 argument uses a sufficient twisting level of 3136, reducing its inclusive coefficient bound from 1,806,336 to 8,064. Two implementations find all 432 selected coefficients zero, with 370 nonzero complementary controls.

For modulo 17 and 23, the argument works in spaces of dimensions four and six. A correction term vanishes on the required odd class; its projection has a much smaller Sturm bound than the original proposed calculation.

Modulo 19 requires multiplication by an eta quotient congruent to one **before** projection. The appendix checks every cusp: 34,656 noncritical translated orders are positive, and 28 groups of exact cyclotomic sums cancel at the twelve critical cusps. Only then is the Hecke–Sturm test justified.

For the towers, exact $U(4)$ eigenvalues $16,-64,-512$ explain why support vanishing persists at every level. The modulo-13 whole-class result uses all twelve states of the coefficient-vector orbit, with a nonzero witness at coefficient 7 in every excluded state.

## Evidence, assurance and limitations

The release includes written arguments, failure-sensitive scripts, pinned dependencies and a substantive AI index. Proof-critical computations are replayed in normal and optimized Python. Deliberately corrupted parameters must fail.

This is an **unrefereed computer-assisted proof collection**. The universal conclusions depend on the written modularity and cusp arguments, not finite numerical agreement alone. Implementation diversity and AI-assisted adversarial review remain within a coordinated workflow. No formal verification, unaffiliated reproduction or external peer review is established. In particular, the symbolic cusp engine was inspected and replayed, not independently reimplemented from scratch.

The supplied review judged the work a specialised contribution. The revisions improve its clarity and certificates; they do not establish broad impact or a four-star research outcome.

## Relationship to earlier work

Wei supplies the conjectures and the starting modulo-17/23 forms. Ryan and collaborators already established square-prime, Legendre-restricted families, so square-prime shape alone is not new. The comparison concerns the actual primes, coprimality and extra number-class restrictions. Aydin and Inam already list one auxiliary eta eigenform. These dependencies are credited in the manuscripts and source audit.

The literature search found no matching proof of the remaining exact conclusions in the consulted sources. That is a bounded assessment, not a priority guarantee.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Partition theorists | Inspect specific conjecture resolutions and related families | Preserve all residue and character hypotheses. |
| Modular-form researchers | Reuse the explicit lift/projection and support calculations | The sufficient criteria do not guarantee a suitable lift exists generally. |
| Research-software authors | Study fail-sensitive finite proof interfaces | Green software tests are not the entire mathematical proof. |

## Why the problem matters

The interesting feature is that a very large counting problem can have a small structural explanation. These papers make that explanation inspectable: a justified coefficient bound, an exact cusp cancellation, or an eigenvector identity. No direct engineering, policy or economic application is demonstrated.

## How to inspect or reproduce the recorded checks

Download the versioned archive, read `AI_INDEX.md` and install `requirements.txt` with Python 3.13. Run `python verify.py all`, repeat with `PYTHONOPTIMIZE=1`, and run `python negative_controls.py`. Select `mod7`, `mod17-19-23` or `towers` instead of `all` to inspect one paper. The root claim map points to the relevant theorem and evidence.

The discovery scan and numerical cusp plots are not substitutes for these exact checks. The current replay intentionally excludes historical exploratory scans that are not needed by the proof.

## The most valuable next projects

An independently written symbolic cusp-expansion engine would address the most concentrated implementation risk. A mathematical follow-up could establish broader conditions guaranteeing a useful lift before projection. Further prime families require their own complete arguments and prior-art checks; a longer numerical list would not settle that question.

## What is in the evidence package

Three revised PDFs and their LaTeX sources; a combined reading PDF; exact arithmetic code; a root claim map and AI index; review-response and source-comparison records; pinned environment, licence map and checksum manifest. Private review correspondence and obsolete working notes are excluded.
