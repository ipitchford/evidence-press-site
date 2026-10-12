## Summary

There are three partitions of 3: $3$, $2+1$, and $1+1+1$. An **overpartition** lets the first occurrence of each distinct part be marked, giving $2+4+2=8$ possibilities. Now use two colours: one colour accepts every part size, while the other accepts only multiples of a positive parameter $\ell$. We count pairs with a prescribed combined total.

This two-paper collection gives exact certificates for four divisibility patterns and explains when whole families of counts vanish modulo 8 or 16. The distinction matters: checking many large counts reveals a pattern, but a proof must cover every permitted input.

The strongest classification here is simple: every count at $4n+3$ is divisible by 8 **if and only if** $\ell$ leaves remainder 0 or 1 modulo 4. The banner shows these four parameter classes, including the failure witnesses for the other two.

## Summary for specialists

Define $\overline p_\ell(n)$ by

$$\sum_{n\ge0}\overline p_\ell(n)q^n=\frac{1}{\varphi(-q)\varphi(-q^\ell)}.$$

Equivalently, this is $f_2f_{2\ell}/(f_1^2f_\ell^2)$, where $f_k=\prod_{j\ge1}(1-q^{kj})$.

This is a product for two colours, not the ratio defining regular overpartitions. The certificate paper proves, for every $n\ge0$,

$$\overline p_8(32n+28)\equiv0\pmod{32},$$

$$\overline p_6(24n+17)\equiv0\pmod{64},$$

$$\overline p_6(24n+23)\equiv0\pmod{64},$$

$$\overline p_9(36n+33)\equiv0\pmod{128}.$$

The family paper proves the exact modulo-eight criterion above. It also proves a support theorem: if $\ell=d^2$ or $2d^2$, and $N>0$ is representable by neither $X^2+Y^2$ nor $X^2+2Y^2$ with integer coordinates (zero allowed), then $\overline p_\ell(N)\equiv0\pmod{16}$.

A broader **sufficient**, not necessary, condition is obtained for the dyadic family: if $\ell=2^a u$, where $a\ge0$ and $u\equiv1\pmod8$ is odd, then

$$\overline p_\ell\bigl(2^\alpha(8n+7)\bigr)\equiv0\pmod{16}.$$

This holds for all $\alpha,n\ge0$.

## Technical account

The four fixed certificates multiply the generating series by explicit eta quotients, verify integral cusp orders and characters, and apply the appropriate coefficient-extraction operator. The complete Sturm bounds are 288, 528, 528 and 540, inclusive: 1,888 extracted coefficients in total. The largest selected underlying coefficient index is 19,440; the direct overpartition expansion reaches argument 19,473.

The modulo-eight theorem comes from a reciprocal-theta expansion and residue support. Necessity is proved uniformly: for $\ell\equiv3\pmod4$, the value at $N=\ell$ is 2 modulo 8; for $\ell\equiv2\pmod4$, the value at $N=\ell+1$ is 4 modulo 8.

Modulo 16, only terms through cubic degree survive the reciprocal expansion. Quadratic support lies in explicit binary forms, and the cubic terms are controlled by parity. This gives both the square/twice-square nonrepresentation theorem and the larger odd-part condition for the dyadic progression.

These two extensions must not be conflated. Although $17\equiv1\pmod8$, the full nonrepresentation theorem cannot simply be enlarged to parameter 17: $21$ is represented by neither form, yet $\overline p_{17}(21)=9932\equiv12\pmod{16}$. Likewise, $\overline p_9(15)=1552\equiv16\pmod{32}$ prevents doubling the uniform dyadic modulus.

## Evidence, assurance and limitations

The package includes the written proofs, exact arithmetic code, a claim map, an AI index, a dated source/contribution audit and an objection-response record. All four fixed certificates pass the FLINT checker and a separate standard-library reconstruction. Both normal and optimized Python runs pass; deliberately invalid residues, moduli, levels and missing eta indices are rejected.

The family checker corroborates 60,000 modulo-eight instances, 60 excluded-parameter witnesses, 274,780 dyadic instances and 10,416 support instances. These are finite checks, not substitutes for the universal arguments.

This is an **unrefereed candidate collection**. Implementation diversity and targeted AI-assisted review remain internal checking. No formal verification, unaffiliated reproduction, external peer review or demonstrated applied impact is claimed. The extensions strengthen the result structurally; they do not justify an automatic four-star rating.

## Relationship to earlier work

Bharadwaj, Sujatha and Chandankumar supply the source statements and conjectures. Their Theorem 4.4, equation (4.51), already states a family containing the first fixed congruence; that statement also appears in their later conjecture list. The inspected argument does not explicitly derive the full stated family. This collection supplies a separate complete certificate, **not new-statement priority**, and does not claim to invalidate their entire proof.

Known cases are credited: Keister, Sellers and Vary's Theorem 9 supplies $\ell=1$ modulo 8, while Hirschhorn and Sellers' ordinary overpartition congruence implies every case $4\mid\ell$ by convolution. Eta-quotient/Sturm certificates and reciprocal-theta parity are established methods. The contribution lies in the precise certificates, classification and support statements—not a new general technique.

No matching full proof of the remaining exact conclusions was located in the bounded source search. This is not a global priority guarantee.

## Who should care, and why

Partition theorists can inspect the specified congruences and parameter dependence. Modular-form researchers can reuse the explicit finite certificate data. Research-software authors can examine how mathematical side conditions and failure-sensitive tests combine. None of those uses establishes practical or economic impact.

## Why the problem matters

Large counting sequences sometimes obey unexpectedly simple remainder rules. The value here is turning scattered examples into exact structural statements: a full parameter classification in one case, and a clearly delimited sufficient family in another.

## How to inspect or reproduce the recorded checks

Download the versioned archive and start with `AI_INDEX.md`. With Python 3.13 and the pinned dependency installed, run `python check_package.py`, `python verify.py`, and `python negative_controls.py`. Repeat the last two with `PYTHONOPTIMIZE=1`. The standard-library certificate reconstruction does not use FLINT; the family tests do.

Read both manuscripts alongside the code. In particular, inspect the bridge from eta data to holomorphy and finite closure, and distinguish the two different modulo-sixteen theorems.

## The most valuable next projects

An independently coordinated reproduction would improve assurance. A mathematical follow-up could seek a necessary condition for the larger dyadic family; the present result establishes sufficiency only. Any stronger modulus or extension of full binary-form support must confront the explicit counterexamples already included.

## What is in the evidence package

Two revised papers and LaTeX sources, a combined nine-page PDF, exact checkers and negative controls, a claim map and AI index, dated research-gate and source records, a review-response matrix, pinned dependencies, licences and a checksum manifest. Private review correspondence and third-party PDFs are excluded.
