## Summary

**The shapes involved.** A *zonotope* is the shape you get by adding line segments together: one segment gives a segment, two give a parallelogram, three in the plane give a hexagon, and so on. A *zonoid* is any shape that can be approximated as closely as you like by zonotopes. Zonoids are a well-behaved family in convex geometry, so a standard question is how well an arbitrary symmetric convex shape can be squeezed between itself and an enlarged copy using a zonoid in between.

**The question.** For a symmetric convex body $K$, measure the difficulty by the smallest enlargement factor $t$ such that some zonoid fits between $K$ and $tK$. Rolf Schneider asked, in an American Institute of Mathematics problem list, whether the *cross-polytope* (the higher-dimensional octahedron, with one pair of vertices on each coordinate axis) is the hardest case — whether it has the largest such factor in its dimension. In six dimensions its factor is $15/8$.

**What was found.** No. Take the six-dimensional cross-polytope with its vertices four units out along each axis, and add one extra pair of opposite vertices, at $(1,1,1,1,2,2)$ and its negative. The resulting fourteen-vertex body has enclosure factor exactly $122/65$, which is larger than $15/8$ by $1/520$. The gap is small, but it is exact: both the lower bound and the matching upper bound are proved with rational-number certificates, and no floating-point tolerance enters the final checks.

**How it is proved, in one paragraph.** The lower bound must hold for *every* possible zonoid, not just the ones a computer tried. The paper reduces this to 64 finite signed-sum identities that imply an inequality in every direction, and then extends it to all zonoids by a continuity argument. The upper bound is an explicit zonotope with 53 generating segments that fits between $K$ and $(122/65)K$. Floating-point optimisation was used only to discover these witnesses.

**Status.** An unrefereed, computer-assisted, AI-assisted candidate. Producer replay and internal model-assisted editorial review are not formal verification, independent reproduction or specialist peer review, and no historical priority claim is made.

## Summary for specialists

The cross-polytope does not maximize the zonoid enclosure factor among all origin-symmetric convex bodies. This candidate gives a concrete counterexample in six dimensions:

$$
\begin{aligned}
K&=\operatorname{conv}\{\pm v_1,\ldots,\pm v_7\},\\
v_j&=4e_j\quad(1\le j\le6),\\
v_7&=(1,1,1,1,2,2),\\
\lambda(K)&=\frac{122}{65}=\frac{15}{8}+\frac1{520}.
\end{aligned}
$$

Here $\lambda(K)=\inf\{t\ge1:K\subseteq Z\subseteq tK\text{ for some zonoid }Z\}$ is the smallest factor $t$ for which some zonoid lies between $K$ and $tK$. A zonoid is a Hausdorff limit of Minkowski sums of segments. The benchmark $\lambda(C_6)=15/8$ is the value recorded in Schneider's AIM question, which gives $\lambda(C_n)=L_n:=2^{1-n}n\binom{n-1}{\lfloor(n-1)/2\rfloor}$ for $C_n=\operatorname{conv}\{\pm e_1,\ldots,\pm e_n\}$. The paper's normalization and quantifiers are those of the original question, not a volume ratio or a fixed-generator surrogate. The strict gap is small but exact; no floating-point tolerance enters the final certificate checks.

This is Theorem 1 of the paper. The body is full dimensional (it contains $4C_6$) and has seven antipodal vertex pairs: coordinate functionals expose the coordinate vertices, and the all-ones functional exposes $v_7$. The strict lower witness alone refutes maximality; the matching enclosure also determines $\lambda(K)$ exactly.

## Technical account: why the finite witness covers every zonoid

**The lower-bound lemma (Lemma 2).** Write $h_A(u)=\sup_{x\in A}u\cdot x$. For $K=\operatorname{conv}\{\pm v_1,\ldots,\pm v_s\}$, suppose vectors $y_j,f_i$ and weights $b_i\ge0$ satisfy, for every sign vector $\sigma\in\{-1,1\}^s$,

$$
\sum_j\sigma_jy_j=\sum_i b_i c_{\sigma i} f_i,\qquad \lvert c_{\sigma i}\rvert\le1.
$$

If $D=\sum_i b_i h_K(f_i)>0$, then $\lambda(K)\ge \sum_j y_j\cdot v_j/D$. Maximizing over $\sigma$ gives the generator-direction inequality $\sum_j\lvert y_j\cdot r\rvert\le\sum_i b_i\lvert f_i\cdot r\rvert$ for every $r$. Summing over generators proves the corresponding support inequality for zonotopes; continuity of support functions under Hausdorff convergence extends it to every centered zonoid. Symmetrization, $(Z+(-Z))/2$, preserves the required enclosure, so allowing translated zonoids does not evade the bound.

**The witness.** The lower witness supplies 64 rational signed-sum identities, one for each sign choice with $\sigma_1=1$; negation covers the remaining sign choices. The identities, rather than a finite scan of generator directions, establish the universal quantifier. The seven vectors $14560y_j$ have integer entries (the paper displays them as a matrix), the nonzero weights $B_i=14560b_i$ are listed in Appendix A with $h_K(f_i)=4$ and $\sum_iB_i=3640$, so $D=1$, and direct substitution gives

$$
\sum_{j=1}^7 y_j\cdot v_j=\frac{4(4\cdot1178+2\cdot1004)+8\cdot56}{14560}=\frac{122}{65}.
$$

**The matching enclosure.** The upper witness contains 53 rational generators $g_\ell$ and a $7\times53$ coefficient matrix $a_{j\ell}$ with $\lvert a_{j\ell}\rvert\le1$ and $v_j=\sum_\ell a_{j\ell}g_\ell$. Exact vertex representations therefore prove the inner inclusion $K\subseteq Z$. Exact support checks at every facet prove the outer inclusion $Z\subseteq(122/65)K$; the certificate has a zero residual error box. Facet enumeration examines all six-element subsets of the fourteen vertices, keeps the hyperplanes that define symmetric slabs containing every vertex, and removes duplicates by primitive integer normalization.

**Why there are 35 facet pairs.** A second enumeration describes the polar as a clipped cube,

$$
4K^\circ=[-1,1]^6\cap\{\lvert u_1+u_2+u_3+u_4+2u_5+2u_6\rvert\le4\}.
$$

The two cutting hyperplanes are parallel, so a new vertex lies on a cube edge: 54 retained cube vertices plus 16 new edge intersections give 70 polar vertices, or 35 antipodal facet pairs.

**How the witnesses were found.** Linear-programming enclosure models discovered them. An initial list of 3260 generator directions gave a restricted optimum above $15/8$, which was not a valid all-zonoid lower bound. Continuous separation then searched for violations of the generator-direction inequality and added missing directions; the final dual was symmetrized and reconstructed rationally. None of these numerical steps is required by the final lower verifier.

## Evidence and replay

The linked paper contains the full argument and the nonzero lower weights. The evidence archive includes both rational certificates, standard-library Python checkers, historical discovery records and the review-response record.

```sh
python3 replay_review.py
python3 -O replay_review.py
python3 verify_polar.py
```

The checkers use only the Python standard library (Python 3.10+ expected; locally tested on Python 3.14.7, with Linux CI as a separate environment check). The standalone lower checker returns numerator $122/65$, denominator $1$, benchmark $15/8$, margin $1/520$ and 64 verified sign identities in ordinary and optimized mode.

The replay rejects eight corrupted lower witnesses and eight corrupted upper witnesses, including surplus and missing coordinates. The polar checker verifies all 70 upper-support equalities. These rejection controls test the checkers; they are not substitutes for the written proof or external validation. Repeating discovery is optional and requires NumPy, SciPy and SymPy.

Start with the paper (PDF or Markdown): Lemma 2 is the bridge from finite identities to all zonoids, and the matching-enclosure section explains the facet checks.

## What changed after review

The supplied review recommended minor revisions without identifying a fatal proof defect. This release adds explicit dimension checks, four corresponding rejection tests, a corrected accessible manuscript, related-work distinctions, the numerator calculation and the polar-body explanation. The supplied review’s separately linked audit ZIP was unavailable here, so its reported arithmetic checks are not counted as inspected independent reproduction.

## Scope and limitations

This is an unrefereed computer-assisted candidate. Producer replay and five internal model-assisted editorial reports do not constitute unaffiliated specialist review, independent reproduction or formal verification. A bounded search for the final object found no matching earlier example, but does not clear historical priority.

The result does not identify the largest factor in dimension six, the smallest counterexample dimension, a unique enclosure or the minimum possible generator count. It provides no measured application benefit or research-speed comparison.

## Relationship to earlier work

Schneider’s support-function arguments are antecedents of the method. Henk, Linke and Wills study enclosures of a fixed cross-polytope; Siegel studies finite approximation of bodies already known to be zonoids. Neither formulation should be conflated with maximizing the enclosure factor over arbitrary symmetric bodies. The contribution claimed is the particular fourteen-vertex body and its matching rational certificates, not the general support-function method.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Convex geometers | An explicit test object for zonoid enclosure extremality | Not a classification of worst bodies |
| Optimization researchers | A rational dual witness with an all-direction interpretation | Discovery LP alone would not prove the lower bound |
| Proof-verification researchers | Small exact certificates and two facet checks | No proof-assistant formalization is supplied |

## Why the problem matters

An extremal question asks more than whether one symmetric example is difficult. A single exact counterexample can separate a plausible benchmark from the actual extremal value. Here the matching enclosure also determines the new body's factor, not merely a lower estimate.

## The most valuable next checks

The next useful assurance steps are unaffiliated scrutiny of the universal support-function argument, independent reconstruction of the rational certificates and a broader contribution-specific priority assessment. On the mathematics itself, the paper leaves open the largest factor in dimension six, the classification of extremizers and the smallest dimension admitting a counterexample. Historical research-goal metrics are separately labelled in the archive. The publication attempt below measures only its prospectively registered assurance-and-publication scope.

## What is in the evidence package

The PDF and accessible Markdown give the full proof; the two root JSON certificates contain the rational witnesses. The replay scripts check identities, containments and malformed-input rejection. The separate polar checker explains the facet count. The archive also includes internal editorial reports, the supplied-review response, a bounded final-object search log, component licences and historical discovery records clearly separated from the authoritative root result. Original prose and data are CC0-1.0 and original code is MIT.
