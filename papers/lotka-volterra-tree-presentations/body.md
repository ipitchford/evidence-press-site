## Summary

**What Lotka–Volterra systems are.** A Lotka–Volterra system is an equation for quantities that grow or shrink at a rate set by the others: predators and prey, competing species, or the concentrations in a chemical reaction. Each variable changes at a rate equal to itself times a weighted sum of all the variables, $\dot x_i = x_i\,(Ax)_i$, where the *interaction matrix* $A$ says who affects whom. The same equations appear in physics and mathematics as *integrable systems*: special cases with enough hidden conserved quantities that their motion is unusually orderly and can be described exactly.

**Invariant planes, or linear Darboux polynomials.** Every Lotka–Volterra system has some built-in invariant planes: a population that starts at zero stays at zero, so each plane $x_i=0$ is never crossed. Some systems have extra ones, made of combinations of the variables such as $x_1-2x_2$. A combination $P$ like this is called a *linear Darboux polynomial*: its rate of change is $P$ times something, so the plane $P=0$ is invariant. These extra planes matter for three reasons. Products of them give **conserved quantities**, which is how the systems below were shown to be (super)integrable. They survive **Kahan's discretisation**, a widely used numerical method, so the computer simulation keeps the same structure. And they decide which **changes of coordinates** keep the equation in Lotka–Volterra form: the new coordinates must themselves be invariant planes.

**Tree systems and van der Kamp's conjecture.** Quispel, Tapley, McLaren and van der Kamp (2023–2024) built a family of Lotka–Volterra systems from any tree on $n$ points, with $3n-2$ parameters and one extra invariant plane for each edge of the tree. If you rewrite such a system in new coordinates, the extra planes are still there, but their pattern changes: the "support" picture can become a *hypergraph*, with groups of three or more variables, instead of a tree. In a 2026 paper (Journal of Dynamics and Differential Equations; arXiv:2411.18264), van der Kamp counted these pictures for all trees with fewer than nine points and stated Conjecture 12: **nonisomorphic trees are not equivalent**. In other words, for generic parameter values, systems built on two genuinely different trees are never the same equation in disguise.

**What this release finds.**

- **The conjecture is proved, in a stronger form.** A generic system built on one tree is never related by a linear change of variables to *any* system, generic or not, built on a different tree. Genericity is needed on one side only.
- **The exact list of invariant planes.** A tree system on $n$ variables has exactly $2n-1$ invariant planes through the origin (the $n$ coordinates and one per edge) if and only if one explicit polynomial in its parameters is nonzero. Where exactly one factor of that polynomial vanishes, the paper says what changes: an edge plane disappears or an extra plane appears.
- **Where the statement stops.** Extending it from generic to *all* parameter values fails: the families of two different trees can share a whole hyperplane of special systems. This does not contradict van der Kamp's conjecture, which concerns generic parameters.
- **Every coordinate system that keeps the form.** These correspond one-to-one to the spanning trees of a related graph, the *cone* over the tree (the tree plus one extra point joined to every vertex). The banner shows this for a three-point path, which has five invariant planes and eight coordinate choices.
- **Counting the distinct pictures.** The paper identifies when two coordinate choices give the same picture, reduces the count to rooted forests on the inner points of the tree, and gives closed formulas for paths and for caterpillars (trees whose inner points form a path). For paths the count is $(F_{2n-2}+F_{n-1})/2$, with $F_k$ the Fibonacci numbers: $1, 2, 5, 12, 30, 76, \dots$
- **A recognition test.** Given any quadratic system, one can decide whether it is a generic tree system in disguise, and find the tree, by computing its invariant planes and checking how they depend on each other.

**Practical notes.** Kahan's discretisation keeps all $2n-1$ planes in every coordinate system, so numerical simulations of these systems inherit the same structure. In population and chemical models the variables must stay positive, and the only coordinate changes that preserve positivity are rescalings and relabellings. Among all the presentations above, only the original tree picture qualifies; the hypergraph pictures need negative combinations.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Results are labelled proof, exact computation, exploratory or open. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

**Setting** (van der Kamp, arXiv:2411.18264v4 numbering). For a tree $T$ on $V=\{1,\dots,n\}$, the family $L_T$ consists of matrices with $A_{jj}=a_j$ and $A_{ij}=b_{v\to j}$, where $v$ is the neighbour of $j$ on the path to $i$; equivalently, column $j$ is constant on each branch of $T-j$. Put $d_{v\to j}=b_{v\to j}-a_j$ and
$$
\Delta_T=\prod_{j}\prod_{v\in N(j)}d_{v\to j}\;\times\;\prod_j\prod_{\{u,v\}\subseteq N(j)}(d_{u\to j}-d_{v\to j})(d_{u\to j}+d_{v\to j}),
$$
with generic set $U_T=\{\Delta_T\neq0\}$. Two systems are *linearly conjugate* if $z=Bx$ carries one to the other. Conjecture 12 of the source: "Nonisomorphic trees are not LV-equivalent", under the source's convention that statements hold for generic parameter values.

| Result | Status |
|---|---|
| On $U_T$ the homogeneous linear Darboux rays are exactly $[x_i]$ and $[Q_{uv}]$, $Q_{uv}=d_{v\to u}x_u-d_{u\to v}x_v$ ($2n-1$ rays); this description fails at every point with $\Delta_T=0$ (Theorem 2.3) | proof |
| Description of the complete list where exactly one factor of $\Delta_T$ vanishes (Proposition 2.5); points where several factors vanish are not classified | proof; open |
| One-sided rigidity: if a system in $U_T$ is linearly conjugate to a system in $L_{T'}$, with arbitrary parameters, then $T\cong T'$ (Theorem 3.6); hence Conjecture 12 in the generic reading and the stronger one-sided reading (Corollary 3.7) | proof |
| The all-parameter extension fails: $L_T\cap L_{T-uj+uv}$ is the hyperplane $b_{u\to j}=b_{v\to j}$; explicit $4\times4$ matrix in $L_{P_4}\cap L_{K_{1,3}}$ (Proposition 3.8) | proof |
| The normalised family is the space of quadratic logarithmic vector fields of the graphic arrangement of $\mathrm{Cone}(T)$, of dimension $2n-1$ (Proposition 3.2) | proof |
| LV-preserving coordinate systems $\leftrightarrow$ spanning trees $S$ of $\mathrm{Cone}(T)$, $\det(I+L_T)$ of them; supports are the fundamental paths $\pi_S(a,b)$ (Theorem 4.2) | proof |
| Isomorphic support hypergraphs $\leftrightarrow$ orbits of $\mathrm{Aut}\,M(\mathrm{Cone}\,T)\cong(C_2)^{\text{leaves}}\rtimes\mathrm{Aut}(T)$; reduction to $\mathrm{Aut}(H,\lambda)$-orbits of decorated rooted forests of the internal-vertex tree $H$ (Theorems 5.2, 6.3) | proof |
| $q(P_n)=(F_{2n-2}+F_{n-1})/2$ (Theorem 7.1); a Burnside formula for every caterpillar (Theorem 7.2) | proof |
| Recognition: a quadratic system is conjugate to a $U_T$-system iff its linear Darboux rays are $2n-1$ in number with matroid $\cong M(\mathrm{Cone}\,T)$ (Theorem 8.1) | proof |
| Kahan maps: every ray of $\mathcal D_T$ is a discrete Darboux polynomial in every presentation (Proposition 8.3); a constant linear growth rate $b$ is covered with the modifications of Remark 2.6 | proof |
| Counts for all 94 trees with $n\le9$ (cone bases) and all 200 with $n\le10$ (core forests); per-tree multisets equal the source's Table 7 for $n\le8$ | exact computation |
| Van der Kamp's 13-parameter system (34): at five sample points its 9 rays do not form a tree-cone matroid | exploratory |

## Technical account

**A three-variable example.** For the path $1-2-3$ with $a_j=0$ and $(b_{2\to1},b_{1\to2},b_{3\to2},b_{2\to3})=(1,2,3,4)$, the system is $\dot x_1=x_1(2x_2+4x_3)$, $\dot x_2=x_2(x_1+4x_3)$, $\dot x_3=x_3(x_1+3x_2)$. Direct differentiation gives $\tfrac{d}{dt}(x_1-2x_2)=4x_3(x_1-2x_2)$ and $\tfrac{d}{dt}(3x_2-4x_3)=x_1(3x_2-4x_3)$, so there are five invariant planes, as the banner shows. In the coordinates $z=(x_1,\;x_1-2x_2,\;3x_2-4x_3)$ the system is again Lotka–Volterra, and the old coordinates $x_2,x_3$ have supports $\{1,2\}$ and $\{1,2,3\}$: a hypergraph, for the same equation.

**Why $\Delta_T$ is exactly right.** The Darboux condition for a linear form reduces to linear equations on its coefficients (the source's Lemma 2, homogeneous case). Each factor of $\Delta_T$ blocks one way of getting an extra ray: nonzero differences keep both coefficients of each edge polynomial; distinct differences at a vertex exclude supports that skip that vertex; non-opposite differences exclude supports containing a three-vertex path. Conversely, making any one factor vanish produces a missing, infinite or extra ray, which is why the condition is necessary as well as sufficient.

**From planes to a graph.** After a diagonal rescaling the $2n-1$ forms become $y_v$ and $y_u-y_v$, the columns of an oriented incidence matrix of $\mathrm{Cone}(T)$ with apex $0$. Linear dependencies among the rays are therefore cycles of the cone, and its three-element circuits (triangles $0uv$) correspond to the edges of $T$; their intersection graph is the line graph of $T$, which determines $T$ by Whitney's theorem.

**Why one side suffices.** If a generic $T$-system is conjugate to a system in $L_{T'}$ with arbitrary parameters, the coordinates of the second system pull back to a basis of the cone matroid. The defining equations of $L_{T'}$ say that, for each edge of $T'$, the cofactors of its two coordinates differ by a combination of those two coordinates; Lemma 3.5 shows that this forces the two corresponding rays into a common triangle. Independence of the basis makes the resulting map from edges of $T'$ to non-basis rays injective, so the supports of the second system are exactly the edges of $T'$, and the tree is recovered.

**Coordinate systems and counting.** By the coordinate criterion, LV-preserving changes of variables pick $n$ independent rays, that is, a spanning tree $S$ of the cone; each remaining ray is a signed sum along its fundamental path in $S$. Two choices give isomorphic hypergraphs exactly when they are related by a matroid automorphism, generated by swapping a leaf's spoke with its edge and by automorphisms of $T$. Quotienting by the leaf swaps reduces the problem to decorated rooted forests on the inner tree, counted by the matrix-forest theorem and Burnside's lemma.

**What is classical.** Darboux theory of Lotka–Volterra systems, Kahan's method, Whitney's line-graph and 2-isomorphism theorems, tree recovery from a cone matroid (Proudfoot–Ramos), spanning-tree counts of cones (Reiner–Smith) and the matrix-forest theorem are standard and cited. The existence of the edge polynomials and the superintegrability of tree systems are due to Quispel, Tapley, McLaren and van der Kamp. The new content is the completeness of the list with its sharp genericity condition, the one-sided rigidity theorem resolving Conjecture 12, the classification and counting of all presentations, the recognition test and the consequences listed above.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/lotka-volterra-tree-presentations.txt) is available for reading.

- **Proofs.** Every theorem has a complete written proof in the manuscript, valid for all finite trees; the general statements do not depend on computation. No proof assistant was used.
- **Exact computation.** Exact rational and integer arithmetic (Python with SymPy): Darboux supports at exact generic points and all cone bases for every tree with $n\le9$; a direct check of hypergraph isomorphism under all $n!$ permutations for $n\le6$; a separate core-forest enumeration for all trees with $n\le10$; and checks of each new statement for small trees, including the one-sided rigidity theorem, the exceptional strata, the intersecting families and the caterpillar formula. These confirm instances, not the general theorems.
- **Exploratory.** The recognition test applied to van der Kamp's 13-parameter system at five sample points only.
- **Replay.** `verify_all.py` reruns every program and compares every saved output byte for byte (about 25 seconds). A clean full replay of the final package was run in a separate copy before release; the released scripts and outputs were bound to it by SHA-256, and the checks affected by publication changes were rerun.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review by a different model (OpenAI gpt-5.6-sol) and a verification re-review. This is not peer review, independent reproduction or formal verification.
- **Limitations.** Linear changes of variables only; homogeneous systems and constant linear growth terms. Points where two or more factors of $\Delta_T$ vanish are not classified. The identification of the counts with the source's equivalence classes relies on the source's stated procedure and is proved only in that reading.

## Relationship to earlier work

**Van der Kamp (2026)** introduced support hypergraphs for Lotka–Volterra systems with linear Darboux polynomials, defined LV-equivalence, computed the classes for trees with fewer than nine vertices (his Table 7) and posed Conjecture 12. This paper quotes his definitions and procedure, proves the conjecture under his generic convention and in a one-sided strengthening, and reproduces his counts for $n\le8$. It notes that, at $n=6$, the source's Table 7 and its Appendix Figure 15 differ for one tree; the computation here agrees with Table 7.

**Quispel, Tapley, McLaren and van der Kamp (2023), and van der Kamp, Quispel and McLaren (2024)** constructed the tree families, proved that the edge polynomials exist and that the resulting integrals make the systems superintegrable for generic parameters. The completeness of the linear Darboux list with an exact genericity condition was not found stated there. **Van der Kamp, McLachlan, McLaren and Quispel (2024)** studied measure preservation and integrals of the Kahan maps of tree systems; Proposition 8.3 here transfers every coordinate presentation to those maps.

**Celledoni et al. (2019)** state that Kahan's method preserves affine Darboux polynomials. **Proudfoot and Ramos (2019)** and **Reiner and Smith (2024)** supply the cone-over-a-tree facts used. **Evripidou, Kassotakis and Vanhaecke (2022)** classify skew-symmetric Lotka–Volterra systems up to linear isomorphism, a different class: LV-preserving changes need not preserve skew-symmetry. The path counts coincide with OEIS A051450 (positive rational knots); no bijection is claimed.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on integrable Lotka–Volterra systems | A proof of Conjecture 12, the complete Darboux list and a recognition test for disguised tree systems | Generic parameters on at least one side; special parameter values behave differently |
| Geometric numerical integration | Every presentation of a tree system's Kahan map keeps all $2n-1$ discrete Darboux polynomials | Completeness of the Darboux list for Kahan maps is open |
| Population and reaction-network modellers | Within positivity-preserving changes, the tree picture is the only one | Linear changes only; quasi-monomial equivalence is open |
| Combinatorialists | Cone matroids of trees, their automorphisms and rooted-forest counts | Formulas beyond caterpillars are open |

## Why the problem matters

Equations from different research groups and applications are often written in different variables, and it can be hard to tell whether two of them are really the same. For tree systems the extra invariant planes are the natural fingerprint, but they change their pattern under a change of variables, so van der Kamp's tables listed many different-looking pictures. This work shows that, for generic parameters, the underlying tree is nevertheless a true invariant, explains exactly which parameter values are generic, and turns the catalogue of pictures into a classification with a recognition test.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3 and SymPy:

```sh
shasum -a 256 -c SHA256SUMS
python3 verify_all.py      # reruns every check and compares outputs byte for byte, about 25 seconds
```

Start with Section 1 of the paper (the three-variable example and the quoted conjecture), then Theorem 2.3 (the complete list) and Section 3 (rigidity and the conjecture). `README.md` maps each result to its status, and `CLAIMS.json` lists the claims with their labels.

## The most valuable next projects

1. Classify the invariant planes where two or more factors of $\Delta_T$ vanish, and decide when special systems of different tree families can be conjugate.
2. Prove that the general class attached to each support hypergraph consists only of tree presentations, making the identification with van der Kamp's counts a theorem for all $n$.
3. Find formulas for the number of distinct pictures beyond caterpillars, and the trees that maximise it.
4. Decide whether tree rigidity holds under quasi-monomial changes of variables.
5. Decide whether Kahan maps of tree systems have further linear discrete Darboux polynomials.

## What is in the evidence package

The manuscript (PDF and LaTeX source), four exact verification programs with their committed deterministic outputs, the replay script, claim, status, assurance and provenance records, a dated prior-art and limitation record (`RESEARCH_GATES.json`), an agent index, licences (CC0-1.0 for prose and original data, MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
