## Summary

**What a finite element is.** Engineers simulate how air, water, oil or blood flows by cutting the region into many small cells, often tetrahedra (triangular pyramids), and approximating the flow inside each cell by a polynomial. The recipe for one cell is called a **finite element**. It has two parts: a space of polynomials, and a list of numbers, the **degrees of freedom**, that pin down one polynomial in that space. Neighbouring cells share the numbers on their common face, and that sharing glues the pieces into a single approximation of the whole flow.

**Stokes flow and why moments help.** Slow, sticky flows, such as blood in small vessels, lubricants or flow through porous rock, are described by the **Stokes equations**, which link the fluid's velocity to its pressure. A velocity–pressure pair of elements must be *stable*: the velocity space must be rich enough to "see" every discrete pressure, or the computed pressure can oscillate wildly. A neat way to guarantee this is to use **moments** as degrees of freedom: averages of the velocity against polynomials on each face of the tetrahedron and inside it. These moments are exactly the quantities that appear when the pressure equation is integrated by parts, so stability comes almost for free. Elements of this kind are called *nonconforming*, because neighbouring pieces need not join continuously; they only have to agree on average.

**Why the polynomial degree matters.** The moments only work if, on each cell, they determine exactly one function from the chosen polynomial space. Higher-degree polynomials make such a space easier to find, but they also cost more: more quadrature points, denser matrices and longer solves. So the useful question is the *smallest* degree that works for a given order of accuracy.

**What Balazi, Allaire, Jolivet and Omnes asked.** In a 2025 paper in *Numerical Methods for Partial Differential Equations*, Balazi, Allaire, Jolivet and Omnes built tetrahedral Stokes elements of second and third order this way. For a fourth-order element they needed 15 extra polynomials of degree five. They tested millions of random choices and found none, and they left open whether any choice exists.

**What this release finds.**

- **No set of degree-five polynomials works.** The obstacle is not a bad choice: on every degree-five polynomial, the 50 moments of the fourth-order element satisfy one hidden linear relation, so they can never be independent. A short symmetry argument exposes it.
- **One degree-six polynomial repairs it.** The product of the six differences of the tetrahedron's barycentric coordinates breaks the relation. Adding it gives a 50-function fourth-order element that does not depend on how the vertices are numbered.
- **The exact rule for every order.** For every order, the paper finds exactly which polynomials the moments cannot see: always seven, each with an explicit formula. It follows that degree $n+2$ falls short by exactly $(n-1)(n-2)/2$ moment directions, so it works only for the two lowest orders, while degree $n+3$ always works.
- **Fewest extra functions, symmetric elements.** It counts the smallest number of top-degree functions any such element needs and proves that symmetric elements achieving it exist for every order; they are written out for the fourth-and-higher cases $n=4,5$, and one explicit family is checked up to $n=8$.
- **Triangles are different.** On triangles the same count never falls short, which explains why two-dimensional constructions extend to every order.
- **It runs.** A numerical Stokes test with the new fourth-order element shows error rates consistent with fourth-order convergence. The computed stability (inf-sup) values, 0.40 down to 0.37 on four meshes, are consistent with the mesh-independent bound that the proof provides; the numbers themselves do not prove mesh independence.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Results are labelled proof, exact computation, numerical or conjecture. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

**Setting.** On a tetrahedron $K$ with barycentric coordinates $\lambda_0,\dots,\lambda_3$, fix $n\ge1$ and let $\mathcal M_n$ collect the normalised face moments against $\mathbb P_n(F_i)$, $i=0,\dots,3$, and the cell moments against $\mathbb P_{n-1}(K)$, so $N_n=4\binom{n+2}{2}+\binom{n+2}{3}$ moments. A shape space $V_n(K)$ with $\mathbb P_{n+1}(K)\subset V_n(K)$, $\dim V_n(K)=N_n$ and $\mathcal M_n|_{V_n}$ bijective gives an inf-sup stable nonconforming Stokes element of order $n+1$ with discontinuous $\mathbb P_n$ pressure (Balazi, Allaire, Jolivet and Omnes, BAJO).

**Theorem 2.1 (proof).** For every $n\ge1$: $\mathcal M_n$ is injective on $\mathbb P_{n+1}$; its kernel on $\mathbb P_{n+2}$ is exactly seven-dimensional, spanned by four vertex ridges $\lambda_i J^{(1,1)}_{n+1}(2\lambda_i-1)$ and three pair ridges $J_{n+2}(2(\lambda_0+\lambda_j)-1)$; the deficit is $c_n=N_n-\operatorname{rank}=(n-1)(n-2)/2$; and $\mathcal M_n$ is surjective on $\mathbb P_{n+3}$. Hence the minimum degree of a single-cell polynomial space satisfying the conditions is $n+2$ for $n=1,2$ and $n+3$ for $n\ge3$. Remark 3.2 of BAJO sharpens from "at most $n\le5$" to "exactly $n\le2$".

| Result | Status |
|---|---|
| Kernel on $\mathbb P_{n+2}$ is 7-dimensional with an explicit ridge basis; deficit $(n-1)(n-2)/2$; surjective on $\mathbb P_{n+3}$; minimum degree $n+2$ ($n\le2$) or $n+3$ ($n\ge3$) (Theorem 2.1) | proof; exact rank checks $n\le6$ |
| BAJO quintic question for $n=3$: the alternating face functional $\mathcal A$ vanishes on $\mathbb P_5$ and $\mathcal A(\Delta_4)=1/34650$, $\Delta_4=\prod_{i<j}(\lambda_j-\lambda_i)$ (Proposition 3.2) | proof; exact |
| At least $(n-1)(n-2)/2$ directions outside $\mathbb P_{n+2}$ are needed (Corollary 5.2); vertex-invariant elements attaining this exist for every $n$ (Theorem 5.4) | proof |
| The missing directions form $\mathrm{sgn}\otimes\mathrm{Sym}^{n-3}(\mathrm{std})$ of $S_4$ (Proposition 5.5) | exact symbolic computation |
| Lean enrichment $\Delta_4\mathbb P_{n-3}$ works for $n=3,\dots,8$; explicit $n=4$ and $n=5$ elements | exact computation |
| The same lean enrichment for all $n$ (Conjecture 5.6) | conjecture |
| Explicit 50-dimensional fourth-order element $V_3^*$ with one sextic, minimal in degree and in number of sextic directions (Corollary 5.8); 14-monomial basis (Proposition 5.9) | proof; exact |
| $d$-simplex kernel dimension $\sum_{r=1}^{\min(d,n+2)}\binom dr$ and a closed-form deficit, zero exactly when $d=2$ or $n\le2$ (Theorem 6.1, Proposition 6.2); triangles never need an extra degree (Corollary 6.3) | proof |
| Degree $n+3$ suffices for $d=4$ ($n\le5$), $d=5$ ($n\le4$), $d=6$ ($n=3$) | exact computation (full rank modulo a prime) |
| Degree $n+3$ suffices (so is sharp) on every $d$-simplex, $d\ge4$ (Conjecture 6.4) | conjecture |
| Stokes test with $V_3^*$: observed rates about 3.9 (broken $H^1$ velocity), 4.9 ($L^2$ velocity), 4.0 (pressure); rates consistent with fourth order; computed discrete inf-sup values 0.40, 0.38, 0.37, 0.37 for $N=1,\dots,4$ | numerical |

Scope: degree optimality is relative to these moments, single-cell polynomial spaces and reproduction of $\mathbb P_{n+1}$. Nothing is claimed about split-cell, nonpolynomial or virtual element spaces, or about all fourth-order Stokes elements.

## Technical account

**Why the quintics must fail ($n=3$).** Let $\varepsilon_i=(-1)^i\Delta_3^{(i)}$ be the signed Vandermonde of the three coordinates other than $\lambda_i$, and define the alternating face functional $\mathcal A(v)=\sum_{i=0}^3 |F_i|^{-1}\int_{F_i}v\,\varepsilon_i\,ds$. Each $\varepsilon_i$ is a cubic face test, so for $n=3$ $\mathcal A$ is a combination of the 50 moments. Permuting the vertices multiplies $\mathcal A$ by the sign of the permutation, so $\mathcal A$ sees only the alternating part of $v$; every alternating polynomial is divisible by the sextic $\Delta_4$, so a quintic has none, and $\mathcal A$ vanishes on $\mathbb P_5$. On $\Delta_4$ itself an Andreief-identity computation gives $\mathcal A(\Delta_4)=1/34650\ne0$. So the 50 moments have rank at most 49 on $\mathbb P_5$, whatever 15 quintics are chosen, and one sextic, $\Delta_4$, supplies the missing direction.

**Seven invisible polynomials for every order.** Zero face and cell moments translate into conditions on derivatives along the simplex. A classical simplex Jacobi operator (the zero-parameter case of Aktaş and Xu) reduces these conditions to a compatibility system whose solutions have only seven coefficient patterns: four *vertex ridges*, each a Jacobi polynomial in one coordinate $\lambda_i$, and three *pair ridges*, each a Legendre polynomial in $\lambda_0+\lambda_j$. Counting dimensions, $\dim\mathbb P_{n+2}-7=\binom{n+5}{3}-7$ falls short of $N_n$ by $(n-1)(n-2)/2$.

**Minimal and symmetric repairs.** Any admissible space needs at least $(n-1)(n-2)/2$ directions outside $\mathbb P_{n+2}$. A canonical complement chosen orthogonally to the ridges under a vertex-invariant energy form gives elements that do not depend on vertex numbering, so neighbouring cells need no degree-of-freedom transformations. For $n=4$ three degree-7 functions $\lambda_i\Delta_4$ suffice; the pattern $\Delta_4\mathbb P_{n-3}$ is checked exactly up to $n=8$.

**Triangles and higher dimensions.** On a $d$-simplex the kernel dimension is $\sum_{r=1}^{\min(d,n+2)}\binom dr$, and the deficit vanishes exactly when $d=2$ or $n\le2$. This explains why the triangular constructions of Matthies and Tobiska extend to all orders while the tetrahedral template of BAJO stops at third order.

**What is classical.** Moment degrees of freedom, Crouzeix–Raviart-type nonconforming elements, the Fortin-operator route to inf-sup stability and Jacobi polynomials on simplices are standard. The Fortin and error estimates apply the established framework. The new content is the kernel theorem, the sharp degree, the obstruction and its sextic repair, the minimal enrichment count with symmetric elements, the dimension analysis and the explicit fourth-order element.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/tetrahedral-moment-stokes-elements.txt) is available for reading.

- **Proofs.** Every theorem and proposition labelled proof has a complete written proof in the 17-page manuscript; the general statements do not depend on computation. No proof assistant was used.
- **Exact computation.** Rational-arithmetic rank computations for $n=1,\dots,6$, the ridge basis, $\mathcal A(\Delta_4)=1/34650$, the Gram matrix, the 14-monomial basis and its determinant, the lean elements for $n=3,\dots,8$ and the representation identity; ranks for $d=4,5,6$ are certified modulo a prime (full rank modulo a prime implies full rank over the rationals). A separately written check reconstructs the main ranks, ridges and $1/34650$ with its own polynomial code. These confirm instances, not the general theorems.
- **Numerical results.** The Stokes test uses floating point on Kuhn meshes of the unit cube with a manufactured solution; outputs are rounded to four significant digits. Conditioning figures are numerical. Mesh independence of the inf-sup constant comes from the Fortin argument (proof); the computed values on four meshes are consistent with it but are not evidence of it.
- **Conjectures.** The explicit lean enrichment $\Delta_4\mathbb P_{n-3}$ for all $n$ (existence of lean symmetric elements is proved), and sufficiency of degree $n+3$ on every simplex of dimension four or more (proved in three dimensions; checked only in listed cases), are conjectures.
- **Replay.** `code/verify_all.py` regenerates every certificate in a temporary directory and compares it byte for byte with the shipped file and `SHA256SUMS`. A clean full replay of the final package was run in a separate copy before release; the released scripts and outputs were bound to it by SHA-256, and checks affected by publication changes were rerun.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review by a different model (OpenAI gpt-5.6-sol) and a verification re-review. This is not peer review, independent reproduction or formal verification.
- **Limitations.** No pointwise divergence-free or pressure-robustness claim; no $p$-uniform stability, curved elements, discrete Korn inequality or solver-speed comparison. The numerical test covers one manufactured solution on one mesh family.

## Relationship to earlier work

**Balazi, Allaire, Jolivet and Omnes (2025)** posed the quintic question for the fourth-order element (Appendix A of the open version) and observed in Remark 3.2 that their approach could work at most for $n\le5$; this paper answers the question in the negative and sharpens the remark to $n\le2$. **Ye and Zhang (2021)** prove injectivity of the same face and cell data on $\mathbb P_{n+1}$; a finite element also needs surjectivity onto all moment data, which is what is determined here. **Chen, Hu and Zhang (2023)** analyse low-order tetrahedral face-moment kernels; their cubic and quartic vertex polynomials are proportional to the vertex ridges. **Bohne, Ciarlet and Sauter (2026)** prove an obstruction for a different moment pattern (facet tests one degree below the shape functions); both results show that three dimensions are more rigid than two. Split-cell conforming elements (Scott–Vogelius; Guzmán–Neilan) and nonconforming virtual elements reach every order by other means; the degree bounds here say nothing about them.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Finite element developers | A ready fourth-order tetrahedral Stokes element with one sextic, a recipe for a well-conditioned basis, quadrature degrees and a rule for the minimal degree at every order | Implementation advice is producer-side; no solver-speed comparison with split-mesh or virtual elements |
| Numerical analysts | An exact description of what face-and-cell moments cannot see, and a closed form in every dimension | Sharp degree beyond three dimensions is conjectural except for checked cases |
| Readers of Balazi et al. (2025) | A definitive answer to the quintic question and a symmetric replacement | Optimality is relative to single-cell polynomial spaces with these moments |
| Algebraic combinatorics readers | A small representation-theoretic identity behind the missing directions | Established by an exact generating-function computation, not a conceptual proof |

## Why the problem matters

Higher-order elements reach a given accuracy with far fewer unknowns, but only if a stable element exists at the target order and its polynomial degree is not needlessly high. A random search that finds nothing cannot tell whether to keep searching. This work replaces the search by an exact count: it says when the natural degree fails, by how much, why, and what the cheapest repair is, for every order.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12 or later (exact checks need the standard library and SymPy; the numerical test also needs NumPy and SciPy):

```sh
shasum -a 256 -c SHA256SUMS
python3 code/verify_all.py --skip-numerical   # exact certificates, about 1 minute
python3 code/verify_all.py                    # everything, about 5 minutes and 7 GB RAM
```

Start with Section 1 of the paper (the question quoted and the answer in words), Section 3 (the short symmetry proof for fourth order) and Section 5.5 (the 50-dimensional element). `README.md` maps each result to its evidence label and `CLAIMS.json` lists the claims with their status.

## The most valuable next projects

1. Prove that $\Delta_4\mathbb P_{n-3}$ is a valid lean enrichment for every $n$ (Conjecture 5.6).
2. Prove that degree $n+3$ suffices on every $d$-simplex with $d\ge4$ (Conjecture 6.4).
3. Study other moment patterns, such as facet tests one degree below the shape functions.
4. Establish discrete Korn inequalities and pressure-robust reconstructions for this family, and $p$-robust constants.
5. Compare the fourth-order element with split-mesh conforming and virtual elements in a dedicated performance study.

## What is in the evidence package

The manuscript (PDF and LaTeX source), the exact verifiers and the numerical Stokes code with their deterministic certificates, an independent reconstruction check, the replay driver, claim, status, assurance and provenance records, a dated prior-art and limitation record (`RESEARCH_GATES.json`), an agent index, licences (CC0-1.0 for prose and data, MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
