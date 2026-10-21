## Summary

This page explains, in order: what a theta graph and e-positivity are, which case was open, what this candidate proves, how the proof controls the negative terms, and where the result stops.

**The setting.** A *theta graph* is made by joining two junction vertices with three separate paths, like the Greek letter θ. For any graph one can record all of its proper colourings, ways of colouring the vertices so that neighbours differ, in a single algebraic object called Stanley's *chromatic symmetric function*. A graph is called *e-positive* when this object can be written as a sum of the basic "elementary" symmetric functions with no negative coefficients. That kind of positivity often signals hidden structure, and it is the subject of the well-known Stanley–Stembridge conjecture, now proved by Hikita.

**What was conjectured.** D. G. L. Wang conjectured that every theta graph is e-positive. The case where the shortest of the three paths has one edge (cycle-chords) and the case where it has two edges (clocks) were already known.

**What was found.** This candidate proves the next case: whenever the shortest path has three edges, the graph is e-positive, however long the other two paths are. Together with the known cases, every theta graph whose shortest path has at most three edges is e-positive. The proof starts from an existing formula of Chen, He and Wang that contains some negative terms, and shows that each negative term can be moved onto a positive term representing the same symmetric function without the total ever going below zero, even when several negative terms land on the same positive one.

**What it means.** One more infinite layer of the theta-graph conjecture is settled, using an adaptation of existing methods rather than a new starting formula. It does **not** settle all theta graphs: shortest path four or more remains open.

**Status.** An unrefereed written-proof candidate. Exact computer checks through 24 vertices support the formulas and accounting, but the universal claim rests on the written proof; there is no formal verification or external peer review.

## Summary for specialists

For every pair of integers $a\ge b\ge3$, the chromatic symmetric function $X_{\theta_{ab3}}$ is $e$-positive (Theorem 1). The graph has $a+b+2$ vertices. Starting from Chen–He–Wang’s Theorem 3.1, the proof classifies negative composition coefficients and regroups them by partial prefix reversal, retaining their weights.

For nonempty target groups with first part at least two, the revision proves the sharp equality classification: $c_J=0$ exactly when $m=4$, $r=0$, $L=1$, the gap vector is $(0,2,2)$ and the crossing part $J_k=2$. This describes this regrouping, not every zero coefficient after collecting by partitions.

| Step | Statement in the paper | Basis |
|---|---|---|
| Input | $X_{\theta_{ab3}}=\sum_I D_Iw_Ie_I$ with $D_I=\Theta^+_I(2)+\Theta^+_I(3)-\Theta^+_I(B)-\Theta^+_I(B-1)+\Delta_I(B)$, $B=b+2$ | Chen–He–Wang Theorem 3.1, specialised to $c=3$ |
| Closed forms | Prefix-sum formula and closed forms for $D_I$ (Lemmas 1–2) | written proof |
| Negative set | $D_I<0$ exactly in three explicit cases N1–N3, and $D_I\ge-6$ (Lemma 3) | written proof |
| Preimages | Window-indexed description of all negative preimages of a target (Lemma 4) | written proof, repaired in v1.1 |
| Groups with $h_1=1$ | Target not negative and $c_J\ge0$ (Lemma 5) | written proof |
| Groups with $h_1\ge2$ | At most one gap has a positive deficit (Lemma 6); $D_J>0$ and $c_J\ge0$ (Lemma 7) | written proof |
| Equality | Sharp zero-group classification (Proposition 1) | written proof |
| Theorem 1 | $\theta_{ab3}$ is $e$-positive for all $a\ge b\ge3$; hence every $\theta_{abc}$ with $c\le3$ | Lemmas 1–7 plus prior $c=1$, $c=2$ results |

## Technical account

The inherited expansion has the form $X=\sum_I D_Iw_Ie_I$. Compositions with the same multiset of parts represent the same elementary symmetric function. A negative term can therefore move to a rearranged composition without changing $X$.

**The four steps.** The paper's argument runs in order. (1) The cited expansion gives an explicit prefix-sum formula with closed forms; no involution needs to be removed. (2) The negative set $N=\{I: D_I<0\}$ is described exactly, and no coefficient is below $-6$. (3) Each $H\in N$ is sent to a composition $\psi_3(H)$ with the same multiset of parts by reversing a prefix; the regrouping is valid provided no target itself lies in $N$, and injectivity is not required. (4) The full weighted group sum at each target is shown to be nonnegative, using a gap vector of the target and a per-gap comparison of cost against gain.

The reversal map can have collisions. For $(a,b)=(4,3)$, the sources $(2,2,5)$ and $(2,5,2)$ both map to $(5,2,2)$. Their weighted contributions are $-8$ each; the target contributes $60$. The full group is $60-8-8=44$, not merely a pairwise comparison.

A gap vector decomposes each target’s available positive contribution. Consecutive suffix lengths differ by at least two. The coefficient estimates allow a positive deficit only at suffix length two or three, so at most one gap can be in deficit. The remaining target contribution covers it. Tracking equality yields the sharp zero-group classification; $(4,2,2,2)$ gives $24-24=0$.

**Why shortest path four is different.** The general expansion for any $c$ is already in Chen, He and Wang's Theorem 3.1, so a larger-$c$ proof would need control of full weighted preimages, not a new starting expansion. The paper also shows that a negative coefficient need not come from a single long part: for $\theta_{422}$ and $I=(2,2,3)$ the coefficient is $-2$ although every part is smaller than $a=4$. The one-deficit mechanism proved here is specific to the stated coefficient bounds.

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
