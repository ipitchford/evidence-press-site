## Summary

**In one sentence.** For every preorder that contains no "crown", the counting polynomial of its preorder polytope comes from a flag sphere, which settles that case of a 2026 conjecture of Athanasiadis and Chapoton; the release also explains the polynomial's gamma-coefficients as counts of matchable pairs, a formula that Y. Zhong found independently at the same time, and proves two Ehrhart identities from the same paper.

**The objects.** A *preorder* is a way of ranking a finite set of things in which ties are allowed: some items sit below others, some are level with each other, and some are not compared at all. In 2026 Athanasiadis and Chapoton attached a geometric object, the *preorder polytope*, to every preorder. Its whole-number points are the ways of putting non-negative whole-number loads on the items so that no group of items that is closed downwards carries more in total than the number of items in it. Count these points by how many loads are nonzero, and you get a polynomial $H_\tau(t)$.

**A small example.** For a chain of three items, $1<2<3$, there is one point with no nonzero load, six with one, six with two and one with three, so $H_\tau=1+6t+6t^2+t^3$. This can be rewritten as $(1+t)^3+3t(1+t)$. The coefficients $1$ and $3$ in such a rewriting are called the *gamma-coefficients*. Here the $3$ counts the three ways to pick one item and one item strictly above it.

**What was conjectured, and why it matters.** Athanasiadis and Chapoton conjectured that $H_\tau$ always looks like the polynomial that counts faces of a sphere: symmetric, rising then falling, with non-negative gamma-coefficients, and realised by a simplicial polytope, even a *flag* one (a sphere in which any set of vertices that is not a face already contains two vertices that are not joined by an edge). Gal conjectured that flag spheres always have non-negative gamma-coefficients, so natural families that are both gamma-positive and realised by flag spheres are valued test cases. They also conjectured several Ehrhart identities, which link integer points of the polytope to chains in a poset and to descents of words.

**What was known.** Chapoton had posed the question for arbors (preorders shaped like rooted trees). Athanasiadis proved the support-polynomial conjectures for chains of blocks (compositions). Further special cases were done for octopus arbors, grids and combs, and zig-zags. Dai, Hou, Liu, Thawinrak and Wang proved the symmetry $H_\tau=H_{\tau^*}$ (Conjecture 5.4), Luo proved the ordinal-sum product formula (Conjecture 6.3), and Patel found an eight-element example showing that real-rootedness (Conjecture 5.3) is false.

**Concurrent work.** On 12 November 2026 Y. Zhong (arXiv:2611.16858) posted a proof of gamma-positivity for every preorder. It uses the same two ingredients as this paper and reaches the same coefficients. The two proofs were found independently; the paper credits Zhong and gives a dictionary between the two descriptions. This release does not claim priority for gamma-positivity.

**What is new here.**

| Result | In plain terms | Where |
|---|---|---|
| Flag spheres for crown-free preorders (new) | If the preorder contains no crown (six or more items joined in a closed zig-zag), $H_\tau$ is the face-counting polynomial of a flag sphere. This covers all arbors (Chapoton's original setting), chains, width-two, series–parallel and interval orders, and every preorder with at most five tied groups | Theorem 5.6 |
| The crown obstruction (new) | For preorders with a crown, the two polytopes used here cannot give a flag sphere; the six-element crown is the smallest open case | Proposition 5.7 |
| Gamma-coefficients count matchable pairs | $\gamma_j$ counts ordered pairs of disjoint $j$-element sets that can be matched upwards; this proves gamma-positivity (concurrent with Zhong) | Theorem 3.4 |
| Two Ehrhart identities | Matrix Ehrhart–zeta duality (Conjecture 4.2) and double Ehrhart reciprocity (Conjecture 7.2) hold for every preorder; the descent formula (Conjecture 4.4) and a zeta value (equation (22) of Conjecture 4.9) follow | Sections 6–7 |
| Simplicial realisation | A simplicial polytope with the right face counts exists for every preorder (Conjecture 5.1(c)), with an explicit reflexive polytope | Propositions 4.2–4.3 |
| A status table | The current status of every conjecture and question in the originating paper, including results of others | Table 1 |

**Limits.** The flag result covers crown-free preorders only. Several of the Ehrhart proofs are short applications of standard tools (Postnikov's lattice-point formula, Ehrhart–Macdonald reciprocity, Athanasiadis's special-simplex theorem). The Gröbner-basis method behind the flag theorem adapts work of Ohsugi and Hibi and of Ohsugi and Tsuchiya; the new step is to pull a special simplex first. Magic positivity (Conjecture 4.8), Conjectures 6.2, 8.1 and 8.2 and the $q$-form of Conjecture 4.9 remain open. The computer checks are finite regression checks.

## Summary for specialists

Let $\tau$ be a preorder on $E$, $|E|=n$, $Q_\tau=\{x\in\mathbb R_{\ge0}^E: x(I)\le|I|$ for every order ideal $I\}$ and $H_\tau(t)=\sum_{x\in Q_\tau\cap\mathbb Z^E}t^{|\operatorname{supp}x|}$. A pair $(A,B)$ with $|A|=|B|$ is $\tau$-matchable if some bijection $\phi:A\to B$ has $a\le_\tau\phi(a)$; $m_j(\tau)$ counts matchable pairs with $A\cap B=\varnothing$, $|A|=j$, each pair once. A crown is $2k\ge6$ elements $s_1,\dots,s_k,t_1,\dots,t_k$ with $s_i\le_\tau t_j$ exactly when $j\in\{i-1,i\}$ (indices mod $k$). Conjecture numbers refer to Athanasiadis–Chapoton, arXiv:2605.26916v1.

- **Theorem 3.4** *(proof; concurrent with Zhong, arXiv:2611.16858)*: $H_\tau(t)=\sum_j m_j(\tau)\,t^j(1+t)^{n-2j}$ for every finite preorder. Hence Conjectures 5.1(a,b) and 5.2. Corollary 3.7 recovers $H_\tau=H_{\tau^*}$ (first proved by Dai et al.).
- **Theorem 5.6** *(proof)*: if $\tau$ is crown-free, $H_\tau$ is the $h$-polynomial of the boundary of an $n$-dimensional flag simplicial polytope (Conjecture 5.1(d) for this class). Crown-freeness is equivalent to the augmented relation graph $\widehat G_\tau$ being chordal bipartite (Lemma 5.1).
- **Proposition 5.7** *(proof)*: if $\tau$ contains a crown, neither the root polytope $B_\tau$ nor the reflexive polytope $K_\tau$ (both with Ehrhart numerator $H_\tau$) has a flag regular unimodular triangulation; non-regular triangulations do not help either.
- **Propositions 4.2–4.3** *(proof)*: $H_\tau$ is the $h$-polynomial of an $n$-dimensional simplicial polytope for every $\tau$ (Conjecture 5.1(c)); $K_\tau$ is reflexive with $h^*(K_\tau)=H_\tau$.
- **Corollary 6.2, Theorem 7.1** *(proof)*: matrix Ehrhart–zeta duality (Conjecture 4.2) and double Ehrhart reciprocity (Conjecture 7.2) for every preorder. **Corollaries 7.3–7.4**: the descent formula for $h^*(Q_\tau,t)$ (Conjecture 4.4) and $Z(P_\tau,-1)=(-1)^n\#\max(P_\tau)$ (equation (22) of Conjecture 4.9).

## Technical account

**Gamma-coefficients.** A theorem of Oh, used by Ohsugi and Tsuchiya, says that integer points of $Q_\tau$ with support $B$ correspond to sets $A$ with $(A,B)$ matchable. Transitivity lets a common element of $A\cap B$ be removed from a matching and reflexivity lets it be put back, so matchability depends only on $A\setminus B$ and $B\setminus A$ (Lemma 3.2). Each disjoint matchable pair of size $j$ therefore stands for $(1+t)^{n-2j}$ pairs, which is the formula. Appendix A gives a second proof through locally anti-blocking polytopes.

**Flag spheres.** Dai et al. identify $H_\tau$ with the Ehrhart numerator of a root polytope $B_\tau$, which contains a special simplex $D$ made of diagonal points. Crown-freeness of $\tau$ makes the incidence matrix of $\widehat G_\tau$ totally balanced, so by Hoffman–Kolen–Sakarovitch its rows and columns can be ordered to avoid a $2\times2$ pattern (a $\Gamma$-free ordering), with the universal row and column last. The resulting reverse lexicographic order, with the diagonal variables smallest, gives a squarefree quadratic Gröbner basis (Propositions 5.3–5.4). This idea adapts Ohsugi–Hibi (1999) and Ohsugi–Tsuchiya (2020, Theorem 2.6); the new point is the choice of order in which the special simplex is pulled first (Lemma 5.5). Sturmfels's correspondence then gives a flag regular unimodular triangulation in which every maximal simplex contains $D$, and Athanasiadis's lemma turns its link into the boundary complex of an $n$-dimensional simplicial polytope with $h$-polynomial $H_\tau$, which is flag.

**Crowns.** For a crown the edge polytope of the crown is a face of $B_\tau$ and of $K_\tau$, and its toric ideal needs a generator of degree three, so no flag regular unimodular triangulation exists (Proposition 5.7). For the six-element crown Macaulay2 confirms a minimal generator of degree three for both polytopes.

**Ehrhart identities.** Matrix duality is a weighted form of Postnikov's lattice-point formula for generalised permutohedra (Theorem 6.1). Double reciprocity is an interior-shift argument plus Ehrhart–Macdonald reciprocity (Theorem 7.1); the descent formula then follows by a remark of Athanasiadis and Chapoton, and the zeta value from the descent formula (Corollaries 7.3–7.4).

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/preorder-polytope-flag-spheres.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 18-page paper, which opens with a plain introduction, a status table and a roadmap. No proof assistant was used.
- **Exact computer checks.** All checks use exact integer or rational arithmetic and raise an error on failure. `verify_preorders.py` checks the gamma formula on all 355 labelled preorders on four elements and all smaller ones and on 24 seeded preorders at each size from 5 to 8, and the transitivity defect on all 4096 reflexive relations on four elements. `exact_checks.py` covers 689 small bipartite graphs (306 of them preorder graphs), 560 matrix-duality cases and 162 interior-point counts for double reciprocity; `fixed_support_check.py` checks the fixed-support count in 5054 cases; `polar_count_check.py` checks 380 Ehrhart values for 91 directed relations; `corollary_checks.py` checks the corollaries on all 390 preorders with at most four elements. The fingerprints include Patel's poset, $H=1+17t+106t^2+303t^3+427t^4+303t^5+106t^6+17t^7+t^8$ with $\gamma=(1,9,24,16,1)$.
- **Flag checks.** `check_flag.py` checks the crown lemma on all 512 height-two preorders with three bottom and three top elements (six of them crowns), and for 571 preorders (570 of them crown-free) checks the ordering, the facet count and the $h$-polynomial of the flag sphere against $H_\tau$. A Macaulay2 certificate confirms quadratic squarefree Gröbner bases for 461 crown-free preorders, and a second confirms the degree-three generator for the six-element crown.
- **A test that can fail.** In a copy of `verify_preorders.py` the pairs were allowed to overlap; under Python's optimised mode the script raised an error and exited, as it must.
- **Replay.** Every check was rerun from fresh copies of the package before release: the five Python programs normally and under `python -O`, the flag checks and both Macaulay2 scripts. All outputs matched the shipped results exactly. GitHub CI reruns the five Python programs on Linux.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round, which added the flag theorem, the crown obstruction and the status table, credited Zhong and earlier work, and repaired several proof steps; a re-review, a proof audit and a second-model audit found no failing result. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The flag result covers crown-free preorders only. The computer checks are finite regression checks of conventions and small cases; the proofs do not depend on them. Attributions rest on a bounded literature search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in algebraic and geometric combinatorics | Compute gamma-vectors of preorder polytopes directly from matchable pairs; use the crown test to decide when a flag sphere realisation is available | The flag result does not cover preorders with a crown |
| People working on Gal's conjecture and flag spheres | A large natural family of flag spheres with explicit gamma-vectors | The complex whose faces count the gamma-coefficients is not shown to be flag or balanced |
| Readers tracking the Athanasiadis–Chapoton programme | A current status table for every conjecture in the originating paper | Status reflects the literature known on 14 November 2026 |
| Research agents | Machine-readable claims, an agent index and exact checks that rerun in about a minute (flag checks about four minutes) | The checks test small cases; the theorems rest on the written proofs |

## Why the problem matters

Gamma-positivity and flagness are two of the strongest structural properties a face-counting polynomial can have, and Gal's conjecture links them. Preorder polytopes generalise arbor polytopes and, for chains and for a single block of tied items, recover the associahedra of types A and B, so they sit beside the cluster and noncrossing combinatorics that motivated Chapoton. Showing that a whole crown-free class is realised by flag spheres, and locating exactly where the method stops, turns a conjecture about one family into a clear next question: what happens at the six-element crown.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root, with [uv](https://docs.astral.sh/uv/):

```sh
shasum -a 256 -c MANIFEST.sha256
uv run --with numpy python3 -I -B code/run_checks.py /tmp/reproduction_summary.json
cd flag && python3 -I -B check_flag.py      # about 4 minutes; compare with results/flag_check_results.json
M2 --script gb_certificate.m2               # Macaulay2 1.26 with 4ti2: prints "M2 PASS cases: 461"
M2 --script crown_obstruction.m2
```

The runner copies the five programs to a temporary directory, runs each under `-I` and `-I -O` and compares the JSON output exactly with `results/`; it never writes into `results/`. Section 8 of the paper says what each program checks. `AI_INDEX.md` maps each claim to its proof and checks, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. The six-element crown: is its polynomial realised by a flag sphere through some other polytope or construction?
2. Can the matchings be chosen coherently so that the complex whose faces count the gamma-coefficients is flag, or balanced?
3. Magic positivity (Conjecture 4.8), Conjecture 6.2, the $q$-form of Conjecture 4.9, Question 4.6 and the $M$-triangle Conjectures 8.1–8.2.

## What is in the evidence package

The paper (LaTeX source and PDF); the exact Python checks in `code/` with the runner `run_checks.py`; the flag-sphere checks and Macaulay2 certificates in `flag/`; all saved outputs in `results/`; `target.yaml` with exact statements and fingerprints; `novelty_report.md` on prior and concurrent work; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and SHA-256 manifests.
