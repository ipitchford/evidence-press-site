## Summary

Join two junctions by three separate paths. Does the algebraic record of all proper colourings have a positive expansion in elementary symmetric functions? This candidate proves that it does whenever the shortest path has three edges. The other two paths can be arbitrarily long.

This extends the known shortest-path-one and shortest-path-two cases. It does **not** settle all theta graphs. Its proof adapts an existing composition method and controls the total cost when several negative terms are grouped together.

## Summary for specialists

For every pair of integers $a\ge b\ge3$, the chromatic symmetric function $X_{\theta_{ab3}}$ is $e$-positive. The graph has $a+b+2$ vertices. Starting from Chen–He–Wang’s Theorem 3.1, the proof classifies negative composition coefficients and regroups them by partial prefix reversal, retaining their weights.

For nonempty target groups with first part at least two, the revision proves the sharp equality classification: $c_J=0$ exactly when $m=4$, $r=0$, $L=1$, the gap vector is $(0,2,2)$ and the crossing part $J_k=2$. This describes this regrouping, not every zero coefficient after collecting by partitions.

## Technical account

The inherited expansion has the form $X=\sum_I D_Iw_Ie_I$. Compositions with the same multiset of parts represent the same elementary symmetric function. A negative term can therefore move to a rearranged composition without changing $X$.

The reversal map can have collisions. For $(a,b)=(4,3)$, the sources $(2,2,5)$ and $(2,5,2)$ both map to $(5,2,2)$. Their weighted contributions are $-8$ each; the target contributes $60$. The full group is $60-8-8=44$, not merely a pairwise comparison.

A gap vector decomposes each target’s available positive contribution. Consecutive suffix lengths differ by at least two. The coefficient estimates allow a positive deficit only at suffix length two or three, so at most one gap can be in deficit. The remaining target contribution covers it. Tracking equality yields the sharp zero-group classification; $(4,2,2,2)$ gives $24-24=0$.

## Evidence, assurance and limitations

The universal claim rests on a written proof. Internal exact tests through 24 vertices cover 81 graphs, 971,165 contributing compositions and 170,224 groups. Nine small graph-level calculations agree with the composition expansion. Targeted regression tests cover the repaired preimage statement, weighted collisions, the equality criterion and deliberately corrupted fixtures, including optimized Python.

These checks are not formal verification, external peer review or unaffiliated reproduction. The supplied review led to a local statement repair: a prefix that maps to a target need not be the actual crossing prefix if it is palindromic. The corrected window-indexed description retains every negative preimage without duplicates.

Unsupported exploratory suffix-dominance and transport counts have been removed from the research claims. The paper establishes no result for shortest path at least four.

## Relationship to earlier work

Chen, He and Wang already provide the general theta expansion and use partial reversals with full-fibre accounting for clocks. The new work is the next parameter family and its specific sharp accounting, not the invention of those methods. Composition coefficients may differ pointwise between valid expansions because their partition-level sums agree.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Algebraic combinatorialists | Inspect the next infinite theta family | General theta positivity is not proved |
| Researchers using weighted regrouping | Reuse the one-deficit accounting pattern | Its graph-specific cost bounds must be re-established |
| Verification developers | Compare exact graph and composition implementations | Finite replay is not a universal proof |

## Why the problem matters

Positivity can reveal structure that is invisible in an alternating algebraic formula. Theta graphs are a simple family outside the usual unit-interval setting. Settling a complete shortest-path layer provides a concrete test of how far composition methods can go.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md` in the repository, then read the manuscript’s input identity and the preimage and gap-accounting sections. With Python 3, run `code/verify_all.py 24`, `code/lemma6_check.py 24`, `code/verify_csf.py code`, and `code/review_regressions.py`. The latter should also pass under `python3 -O`; deliberately corrupted fixtures must fail.

## The most valuable next projects

An unaffiliated check of the written inequalities would improve assurance. For extension, test whether a different regrouping controls the longer coefficient windows when the shortest path is four. A second application of the one-deficit pattern would establish more about its transferability than larger finite tests alone.

## What is in the evidence package

The revised manuscript, exact Python checkers, review-response matrix, claim map, source audit, environment information, replay records and substantive AI index. The original inputs are preserved privately; the published revision distinguishes retained evidence from withdrawn exploratory claims.
