## Summary

Positive polynomial coefficients do not guarantee the ordering that one might expect in a formula built from them. This candidate gives an exact counterexample to one half of a conjecture about **cyclotomic generating functions**—a family that appears in combinatorial counting, algebra and probability.

The conjecture compares two sorted lists of positive integers used to describe a polynomial. It predicts that the numerator list wins whether we add the smallest entries or the largest. Here every polynomial coefficient is strictly positive, but the largest **5,591** numerator entries lose to the corresponding denominator entries. Every smallest-entry comparison still holds for this example.

## Summary for specialists

Set $X=18350$, let $N$ be the product of the primes at most $X$, and put $D=\varphi(N)$ and $K=D^2N^D$. Split the divisors of $N$ by the sign of $\mu(N/d)$ into $A_0$ and $B_0$, then append $K$ twos to $A_0$ and $K$ ones to $B_0$.

The resulting equal-length lists represent

$$f(q)=(1+q)^K\Phi_N(q).$$

Every coefficient is a strictly positive integer, yet $U_A(5591)<U_B(5591)$, where $U_V(r)$ sums the largest $r$ entries. This refutes the suffix assertion—and hence the conjunction—in Billey–Swanson Conjecture 33. It does **not** settle the universal lower-prefix assertion.

## Technical account

For a list $V$, its hinge at threshold $t$ is $h_V(t)=\sum_{v\in V}(v-t)_+$. At $t=N/X$, Möbius inversion gives

$$h_{A_0}(t)-h_{B_0}(t)=N m_1(X).$$

The smoothed Möbius sum $m_1(18350)$ is negative. There are 5,591 denominator entries above the threshold but only 5,570 numerator entries. Equal counts are not needed: the denominator count gives equality in the hinge-to-suffix bound, while an inequality suffices on the numerator side.

The positivity multiplier adds only ones and twos, all below $t$. It therefore leaves the negative hinge unchanged. A binomial/hypergeometric coupling estimate and a lower bound on conjugate root pairs establish positivity for **all** coefficients; the polynomial is never expanded.

The general proposition exposes the reusable mechanism: a polynomial strictly positive on the nonnegative real axis can acquire positive coefficients under sufficiently large powers of $1+q$, while a negative parameter hinge above 2 survives.

Two remarks locate the failure more precisely. Cancelling one common 1 and one common 2 produces disjoint parameter supports without changing the selected suffix. In the original padded presentation, direct estimates prove every lower-prefix inequality.

## Evidence, assurance and limitations

The finite certificate uses integer and rational arithmetic. Its normalised suffix defect is approximately $-2.2401856719\times10^{-6}$; exact directed bounds, not that decimal, determine the sign. Two differently implemented programs regenerate and check the arithmetic, and eight deliberately corrupted certificates must fail in both normal and optimized Python.

The analytic positivity proof and the interpretation of the certificate remain written mathematical arguments. The supplied model-assisted review is not authenticated external peer review. No end-to-end formal verification or unaffiliated reproduction is established.

The witness is exceptionally large but finitely specified. No smallest example, optimal exponent, absolute priority or broader classification is claimed.

## Relationship to earlier work

Billey and Swanson supplied the conjecture. Positivity multiplication is established mathematics, including its cyclotomic application by Gatzweiler, Levicán-Santibáñez and Yoshida. Daval recorded the negative arithmetic endpoint. The candidate contribution is the connection between that signed divisor tail and a parameter-order counterexample—not rediscovery of either ingredient.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Algebraic combinatorialists | Correct the proposed necessary conditions for cyclotomic generating functions | The universal prefix assertion remains open here |
| Researchers studying positive polynomials | Reuse the distinction between coefficient smoothing and parameter tails | The positivity principle itself is classical |
| Certificate and verification developers | Replay a small exact computation attached to a huge symbolic object | Arithmetic replay does not prove the analytic bridge |

## Why the problem matters

Necessary conditions help rule out impossible generating functions without expanding them. This example shows that strict coefficient positivity alone cannot justify the proposed upper-tail test. It also explains why simply making coefficients more positive cannot rescue that test: the relevant tail does not change.

## How to inspect or reproduce the recorded checks

Download the versioned evidence ZIP from the linked GitHub release or Zenodo record. Start with `AI_INDEX.md` and `claims.md`, then run:

```sh
python3 code/check_package.py
python3 -O code/check_package.py
```

The programs need Python 3.11 or later and its standard library only. `paper.tex` builds with two pdfLaTeX passes. The verification document explains which conclusions require reading the proof rather than executing code.

## The most valuable next projects

Find a substantially smaller witness; determine which useful parameter conditions survive positivity multiplication; or address the universal lower-prefix assertion separately. These are research directions, not conclusions of this release.

## What is in the evidence package

The seven-page paper and source, unchanged exact arithmetic certificate, strengthened trial verifier, corruption controls, claim map, AI index, source audit, review response, licensing map and hash manifest. The public package is a research handoff, not a claim of journal acceptance.
