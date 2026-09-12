## Summary

If half the cards in a shuffle are chosen less often than the other half, what remains of the initial order just as the deck approaches randomness? This unrefereed candidate gives an exact limiting answer for the whole permutation, not merely a lower bound from one statistic. Two counts—fixed cards in the slow and fast classes—capture the remaining discrepancy asymptotically.

It also describes how the answer changes as the bias disappears. The transition occurs when the bias is of order one over the logarithm of the deck size. The proof is written mathematics; finite computer checks corroborate particular identities, not the infinite-size theorem.

## Summary for specialists

Let $N=2n$, with two classes of size $n$. Independently sample two labels with probabilities $b/N$ in the slow class and $(2-b)/N$ in the fast class, then transpose them; repeated samples give the identity. Start from the identity permutation. At $t_N(s)=\lfloor N(\log N+s)/(2b)\rfloor$, the candidate proves stationary-$L^2$ approximation of the full density by the normalized tilt $(1+r_A)^{F_A}(1+r_B)^{F_B}$.

For fixed $0<b<1$, $(r_A,r_B)=(e^{-s},0)$. For $b_N\to1$ with $(1-b_N)\log N\to\lambda\in[0,\infty]$, the pair is $(e^{-s},e^{-s-2\lambda})$, with the second coordinate zero at infinity. Consequently the limiting full total-variation distance is

$$
\left\|\operatorname{Pois}\!\left(\frac{1+r_A}{2}\right)\otimes\operatorname{Pois}\!\left(\frac{1+r_B}{2}\right)-\operatorname{Pois}(1/2)^{\otimes2}\right\|_{\rm TV}.
$$

Convergence is locally uniform in $s$. No uniform statement as $b\downarrow0$, unequal-class theorem or arbitrary-weight extension is claimed.

## Technical account

The proof has three distinct steps. First, a trace comparison between several tracked labels and independent single-label walks gives all fixed-degree mixed factorial moments. Collision terms are bounded in operator norm, avoiding a multiplying factor from the rapidly growing state space.

Second, the full squared density norm is computed through the representation spectrum. The fixed-bias proof imports explicitly identified bulk estimates from Nestoridi–Yan. A separate uniform estimate handles vanishing bias; fixed-parameter constants are not silently made uniform. Stable Littlewood–Richardson identities identify the bounded-degree contribution, and direct suppression handles the infinite crossover endpoint.

Third, the fixed-point tilt has the same limiting squared norm as the complete shuffle density. Positivity of its factorial expansion and Cauchy–Schwarz force their $L^2$ distance to vanish. This last step is the bridge from observables to the whole law: Poisson count limits alone would not suffice.

## Evidence, assurance and limitations

The package contains a complete written candidate proof, exact finite checks, numerical diagnostics, source locators and an internal editorial response. Fresh ordinary and optimized Python runs pass 112 exact coloured-moment checks; deliberately corrupted self-loop probabilities are rejected. A supplied spectral checker was inspected and rerun, passing 104 trace comparisons and 358 stable restriction identities within its stated finite scope.

Internal AI review and supplied review reports do not establish unaffiliated specialist validation or external journal peer review. Formal verification and historical priority are not established. Finite-size permutations can retain information beyond the two counts; the theorem is asymptotic. The model uses label weights, two equal classes, independent sampling with replacement and the stated discrete clock.

## Relationship to earlier work

The earlier Evidence Press counterexample ruled out a proposed total-fixed-point profile using a slow-class event. This successor claims the replacement full-law profile and its crossover, rather than reclassifying the earlier lower bound as a full solution. The parent remains an immutable, separately scoped research object.

Nestoridi–Yan provide the model spectrum and fixed-bias bulk input. Teyssier's uniform-shuffle theorem is recovered at the zero-crossover endpoint. His 2026 conjugacy-invariant framework explains a related finite-level character mechanism but does not directly identify this noncentral coloured density. Jain–Sawhney's planted fixed-set approximation motivates an alternate route, not a dependency of the final argument. These comparisons are bounded source positioning, not priority clearance.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mixing-time researchers | Inspect an exact profile and a vanishing-bias scale. | Check the full-norm argument and pinned source dependencies. |
| Representation theorists | Reuse the bounded-degree restriction calculation. | Equal-class and fixed-degree assumptions matter. |
| Research agents | Replay finite checks and follow the claim/source map. | Replay and DOI availability do not certify the theorem. |
| Interested readers | See why counting all fixed cards can hide class information. | The asymptotic conclusion is not exact finite-deck sufficiency. |

## Why the problem matters

Cutoff locates the rapid transition to randomness; a profile identifies its shape. Biased sampling introduces a second question: how small must the bias become before the uniform answer returns? This candidate links that scale to an explicit two-coordinate limiting law and makes the claimed residual information precise. No practical shuffling standard, security guarantee or measured research-productivity benefit follows from it.

## How to inspect or reproduce the recorded checks

Download and extract the versioned ZIP. First run `python3 code/package.py --verify`, then `python3 code/independent_check.py` and its `python3 -O` variant. Each ordinary run should report PASS and 112 coloured-moment checks. The `--negative-control` variant must fail with an incorrect-self-loop message. These exact checks use only the Python standard library; the README gives separate pinned numerical and PDF-build instructions.

## The most valuable next projects

- Extend the density argument to unequal or additional sampling classes, with new spectral-tail control.
- Investigate bias tending to zero, which lies outside the current uniform estimates.
- Quantify finite-size errors in conditional sufficiency instead of treating the limiting statement as a finite certificate.
- Test whether the positive-expansion and norm-matching argument applies to other noncentral walks.

## What is in the evidence package

The versioned archive includes the formatted paper and Markdown/TeX source, claim index, current disposition, preserved historical audits, source-number crosswalk, replay instructions and receipts, original code, internal editorial reports, complete file manifest and component licences. Original prose/data use CC0 and original code uses MIT. Third-party source texts and unlicensed supplied-review files are not silently redistributed. GitHub and Zenodo carry byte-matched release assets.
