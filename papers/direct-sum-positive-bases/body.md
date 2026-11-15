## Summary

**In one sentence.** Among positive bases built from simplices in complementary subspaces, the best ones for derivative-free search put regular simplices at right angles to each other, and these perpendicular arrangements also cannot be improved by any small change of the directions, which proves a sphere-covering conjecture of Böröczky and Wintsche in local form.

**The everyday problem.** Some optimisation methods cannot use derivatives. A *direct-search* method tries a few fixed directions from the current point and moves if one of them helps. This only works if, whatever the downhill direction is, one of the trial directions points roughly the same way. The **cosine measure** scores a set of unit directions by its worst case: the cosine of the largest angle between any direction in space and the nearest trial direction. Bigger is better. In the standard worst-case analysis, the number of steps direct search needs grows like one over the square of the cosine measure.

**The same thing in geometry.** Put equal circular caps on a sphere, centred at the trial directions. The cosine measure tells you how small the caps can be while still covering the whole sphere. So asking for the best set of $s$ directions is asking for the best covering of the sphere by $s$ equal caps. For few caps, Böröczky and Wintsche conjectured in 2003 what the best coverings look like: split the $n$ dimensions into nearly equal groups and put a regular simplex (a triangle, a tetrahedron, and so on) in each group, with the groups at right angles to each other.

**The question.** A *positive basis* is a set of directions from which every vector can be built with nonnegative weights, with no direction redundant. Hare, Jarry-Bolduc and Planiden (2023) studied positive bases made of simplices in complementary subspaces that need not be perpendicular, and asked whether the best ones must be perpendicular. They proved it in three dimensions with five directions, and they found the best perpendicular arrangement in general.

**What is new here.**

| Question | Result | Where |
|---|---|---|
| Must the best structured bases be perpendicular? | Yes, for every dimension and size: the cosine measure is at most $1/\sqrt{r_1^2+\cdots+r_k^2}$ for subspaces of dimensions $r_1,\dots,r_k$, with equality only for perpendicular regular simplices | Theorem 3.1, Corollary 3.2 |
| How robust is the optimum? | Near-optimal arrangements are nearly perpendicular and nearly regular, with an exact rate that changes at size $s=\lceil 3n/2\rceil$ | Theorem 5.2, Proposition 5.3, Theorem 6.1 |
| Can anything nearby do better? | No: perpendicular regular simplices are strict local optima among **all** configurations of the same size, even ones outside the structured class | Theorem 7.1, Corollary 7.2 |
| What does that say about coverings? | The conjectured best coverings by few caps are at least locally best, in every dimension | Corollary 7.2 |
| Shifted blocks | The bound extends when each shift lies in the convex hull of the earlier directions; an explicit four-dimensional example shows this condition can fail | Section 8 |

**A concrete example.** In four dimensions with six directions, two perpendicular triangles give cosine measure $1/\sqrt8\approx0.354$, the best possible in the class. A regular tetrahedron with a perpendicular pair of opposite directions gives only $1/\sqrt{10}\approx0.316$, yet it is **also** a local optimum: no small change improves it. A local search can get stuck there.

**The key idea.** Pick a random corner of the *polar* polytope (the region of points whose inner product with every direction is at most one), choosing one corner for each simplex independently. Its average squared distance from the centre is at least $r_1^2+\cdots+r_k^2$, and the farthest corner, which determines the cosine measure, is at least as far as the average. The random-corner device appears in public figures by Jarry-Bolduc and Krishan Lal for triangles and pairs, and the paper credits it to them.

**Limits.** The global question, over all positive bases or all coverings, stays open for sizes $n+3$ to $2n-2$. The local result does not say how large the neighbourhood is, and the constants are not optimal. The shifted-block extension needs the convex-hull condition. This is an unrefereed candidate; its assurance is internal AI-assisted review and floating-point computational checks, not peer review.

## Summary for specialists

Let $D$ be a set of $s$ unit vectors in $\mathbb R^n$ and $\mathrm{cm}(D)=\min_{\|u\|=1}\max_{d\in D}\langle u,d\rangle$. A direct sum of type $(r_1,\dots,r_k)$, with $\sum_j r_j=n$ and $s=n+k$, is a union of minimal positive bases of algebraically complementary subspaces $L_j$ of dimensions $r_j$; these form the class $\Omega_{n,s}$ of Hare, Jarry-Bolduc and Planiden (all critical vectors zero). Put $S=\sum_j r_j^2$.

- **Theorem 3.1** *(proof)*: $\mathrm{cm}(D)\le S^{-1/2}$, with equality if and only if the $L_j$ are mutually orthogonal and each block is a regular simplex.
- **Corollary 3.2** *(proof)*: with $n=ak+b$, $0\le b<k$, the maximum over $\Omega_{n,s}$ is $S_*^{-1/2}$, where $S_*=(k-b)a^2+b(a+1)^2$, attained exactly by balanced orthogonal regular simplices. **Corollary 3.3** reduces both questions of Hare, Jarry-Bolduc and Planiden to whether optimal positive bases have zero critical vectors.
- **Proposition 4.1, Theorem 5.2, Proposition 5.3**: the loss $\mathrm{cm}(D)^{-2}-S$ splits exactly into nonnegative parts that control the barycentric weights and cross-block angles linearly and the simplex shapes with a square-root rate.
- **Theorem 6.1** *(proof)*: the optimal local stability exponent in $\Omega_{n,s}$ ($n\ge2$) is $1$ if $s\ge\lceil 3n/2\rceil$ and $1/2$ otherwise; the threshold is where every balanced block has dimension at most two.
- **Theorem 7.1** *(proof)*: for an orthogonal union of regular unit simplices $D^*$ there are $\varepsilon,c>0$ with $\mathrm{cm}(D)^{-2}\ge S+c\,\varrho(D)^2$ for every $s$-tuple of unit vectors within distance $\varepsilon$ of the rotation orbit. **Corollary 7.2**: local optimality among all positive bases, positive spanning sets and point configurations of size $s$; the configurations of Böröczky–Wintsche Conjecture 1.3 are strict local optima for every $d\ge1$; unbalanced orthogonal unions are local but not global maxima.
- **Theorem 8.2, Corollary 8.3** *(proof)*: for shifts $c_j$ in the convex hull of the preceding vectors, $\mathrm{cm}(D)^{-2}\ge r_1^2+\sum_{j\ge2} r_j^2/(1-\|c_j\|^2)$. Section 8.1 gives a positive basis of $\mathbb R^4$ with $\mathrm{cm}^{-2}=27$ for which every two-block decomposition violates the hull condition.

## Technical account

**The polar polytope.** For a positive spanning set $D$, the polar $P(D)=\{x:\langle x,d\rangle\le1\ \forall d\in D\}$ is a bounded polytope and $\mathrm{cm}(D)$ is one over its largest vertex norm (Hare and Sun, Theorem 3.2). For a direct sum, Lemma 2.1 shows that $P(D)$ is a product of simplices: a vertex chooses one element $i_j$ of each block, and there are $\prod_j(r_j+1)$ vertices.

**The averaging argument.** Choose one element $I_j$ of each block independently, with probability equal to its barycentric weight $\alpha_{j,i}$, the coefficient of the unique positive dependence of that block. The resulting random vertex $V$ has mean zero, and $\mathbb E\|V\|^2=\sum_{j,i}\alpha_{j,i}\|v_{j,i}\|^2$, where $v_{j,i}$ are the dual vectors of the block. Cauchy–Schwarz bounds each term below by $(1-\alpha_{j,i})^2/\alpha_{j,i}$, and since the weights of a block sum to one, the total is at least $\sum_j r_j^2$. The largest vertex norm is at least the root mean square, which proves Theorem 3.1. Equality forces equal weights, dual vectors parallel to the directions, and hence orthogonal subspaces and regular simplices.

**Rigidity and the threshold.** With the weighted second-moment matrix $C=\sum_{j,i}\alpha_{j,i}d_{j,i}d_{j,i}^T$, the random vertex has covariance $C^{-1}$, and the loss $\mathrm{cm}(D)^{-2}-S$ splits exactly into three nonnegative parts (Proposition 4.1). These control the weights and the cross-block angles linearly (Theorem 5.2) and the simplex shapes with a square-root rate (Proposition 5.3). The bound $\mathrm{cm}(D)\le(\mathrm{tr}\,C^{-1})^{-1/2}$ costs one matrix inversion and can reject a poor configuration, though in experiments it sees only 2% to 9% of the loss. Explicit families show the rates are sharp: a tetrahedron family with parameter $\epsilon$ has loss $54\epsilon^2/(1-9\epsilon^2)$ while its Gram matrix moves by $2\epsilon$, so blocks of dimension three or more force the square-root rate. Two lines at correlation $\rho$ have $R^2=2/(1-|\rho|)$, which is linear. Theorem 6.1 follows: the exponent is $1$ exactly when every balanced block is a line or a triangle, which happens when $s\ge\lceil 3n/2\rceil$.

**Local optimality.** Near $D^*$ the polar keeps its combinatorial type, so $\mathrm{cm}(D)^{-2}$ is the maximum of smooth functions $f_\sigma$, one for each vertex $\sigma$. Their gradients average to zero (Lemma 7.5), so first order gives nothing. The proof shows that the averaged second variation is positive definite on the critical subspace, modulo rotations. Inside $\Omega$ this follows from the defect identities. The directions that leave $\Omega$ are handled by a symmetry reduction (Schur's lemma for the product of symmetric groups) to one explicit coupling family with a closed form (Lemma 7.9). A minimax second-order lemma (Lemma 7.11) then gives quadratic growth. For type $(7,2)$ the unrestricted average of the second variations is indefinite (Remark 7.10), so the restriction to the critical subspace is essential.

**Shifted blocks.** If a block is translated by a vector $c$ in the convex hull of the earlier directions, a modified random vector still lies in the polar and gains the factor $1/(1-\|c\|^2)$ (Theorem 8.2). The four-dimensional example of Section 8.1 shows that this hull condition is a real restriction of the method: its value $\mathrm{cm}^{-2}=27$ is far above $10$, yet no decomposition satisfies the condition.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/direct-sum-positive-bases.txt) is available for reading.

- **Proofs.** Every result has a complete written proof in the 22-page paper; the proofs are analytic and no step is computational. The paper opens with a plain introduction, a table of what was known, a list of what is new and a roadmap. No proof assistant was used.
- **Computational checks.** One script, `verification/verify_geometry.py` (NumPy and mpmath, fixed seed), makes 6301 explicit floating-point checks. It covers the vertex formula and the exact identities on 312 configurations in twelve block types up to dimension eight, with the largest residual below $10^{-13}$. It enumerates every polar vertex independently for 72 small configurations, and checks the sharpness families and the four-dimensional example ($R^2=27$, nine vertices). It compares the Section 7 formulas with 40-digit finite differences and checks positive definiteness on the critical subspace for twelve types. Floating-point checks can expose errors in formulas or code; they do not prove universal statements.
- **Tests that can fail.** Every check is explicit and sets a nonzero exit status, so the checks stay active under Python's optimised mode. Changing one coefficient in the Lemma 7.9 check makes the script fail under `python -O`, as it must.
- **Replay.** The script was rerun from fresh copies before release, normally and under `python -O`; with the pinned packages the output matched the shipped file byte for byte. GitHub CI reruns it, the figure script and the negative control on Linux, where low-order digits differ but every check passes.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay led to one revision round. It rewrote the introduction for non-specialists, fixed credit and positioning, corrected one false side remark, rewrote the verification script and added the local optimality theorem. A re-review, a proof audit and a second-model audit found minor items only, which were fixed. Before release, every use of the Böröczky–Wintsche chapter was checked against the chapter itself, and the citation for coverings by $n+2$ caps was made precise (their Theorem 1.4). A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The global question is open for $n+3\le s\le 2n-2$. The neighbourhood in Theorem 7.1 is not quantified, and the constants are not optimal. The shifted-block extension needs the hull condition. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Designers of derivative-free methods | Poll directions: perpendicular regular simplices are optimal among direct sums, and a cheap certificate rejects poor ones | Global optimality over all positive bases is not proved |
| Discrete geometers | A local form of the Böröczky–Wintsche covering conjecture in every dimension | Local only; the neighbourhood size is unknown |
| Researchers on positive bases | Answers the orthogonality question of Hare, Jarry-Bolduc and Planiden and reduces their remaining question to critical vectors | Shifted bases are covered only under the hull condition |
| Research agents | Machine-readable claims, an agent index and a five-second check script | The checks are floating-point and supplement the written proofs |

## Why the problem matters

Direct search is used wherever derivatives are unavailable or unreliable, for example when the function is the output of a simulation, and its guarantees scale with the cosine measure of its poll set. The best poll sets are the best coverings of the sphere by equal caps, a classical problem that has been settled for only a few sizes. This release settles the structured version of the question completely and shows that the conjectured answer to the general question cannot be improved locally. It also shows that unbalanced arrangements are local traps.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, at the package root (Python 3.12 with the pinned packages in `requirements.txt`):

```sh
shasum -a 256 -c SHA256SUMS
python3 -m pip install -r requirements.txt
python3 -O -I -B verification/verify_geometry.py --out /tmp/dsp
cmp /tmp/dsp/geometry_verification.json verification/output/geometry_verification.json
```

`ENVIRONMENT.txt` lists the software used. `AI_INDEX.md` maps each claim to its proof and checks, `PRIOR_ART.md` and `RESEARCH_GATES.json` give the prior-work boundary, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide whether optimal positive bases of sizes $n+3$ to $2n-2$ have zero critical vectors; with Corollary 3.3 this would settle both questions of Hare, Jarry-Bolduc and Planiden.
2. Quantify the neighbourhood in Theorem 7.1, or prove global optimality for one new size.
3. Remove the convex-hull condition for shifted blocks, or find a positive basis that beats the bound without it.
4. Find optimal stability constants and two-sided certificates for the cosine measure.

## What is in the evidence package

The paper (LaTeX source and PDF, with Figure 1); `verification/verify_geometry.py` and its recorded output; `verification/plot_stability.py` and the figure files; `requirements.txt`; `PRIOR_ART.md`, `target.yaml` and `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, figure and data, MIT for code), the CI workflow and SHA-256 sums.
