## Summary

This paper does not solve Furter's $R(3)$ conjecture. It reports a productive failure.

The original target was Furter's $R(3)$ conjecture, an open problem about three consecutive coefficients of a generating function and the ideal they generate. The project did not solve that problem. Instead, it isolated two pieces of mathematics that no longer depend on the unfinished global argument and may be useful elsewhere.

The first is a geometric separation principle. Very roughly, an irreducible polynomial seen on the base of a map can certify that a collection of zeros upstairs is really one indivisible algebraic point. If two rational functions have pole orders differing by exactly one, that indivisibility leaves no room for them to share a zero. On an elliptic double cover, a second group-law test prevents the zero set from colliding with its mirror image under the deck involution.

The second is an exact calculation at a quartic transition, the kind of local model that appears when several saddle points coalesce. After reducing polynomial amplitudes in a twisted de Rham quotient, three natural classes lose rank on the aligned transition curve. The determinant, rank strata, and first correction are all computed exactly.

These are proved statements. Their role in Furter's family is more limited. At each fixed index, the geometric method applies if an explicit deck norm is irreducible. The release checks that irreducibility exactly for $3\le n\le40$. That finite range is evidence, not an all-index theorem. Uniform irreducibility, the global contour and period estimates, and Furter's $R(3)$ conjecture remain open.

## The first method: irreducibility becomes separation

Suppose a map sends an effective divisor $Z$ of degree $h$ on a smooth projective curve to the zero divisor of one irreducible polynomial of degree $h$, with coefficient one. Proper pushforward counts both multiplicity and residue-field degree. Because every contribution is a positive integer, the coefficient-one hypothesis forces a rigid conclusion: $Z$ consists of one reduced closed point of degree $h$.

That observation becomes useful when two rational functions $f$ and $g$ have exact pole divisors

$$
(f)_\infty=hO,\qquad (g)_\infty=(h+1)O.
$$

If $f$ and $g$ shared a zero, the one closed point making up $(f)_0$ would have to lie inside $(g)_0$. Only one degree of zero divisor would remain. Dividing $g$ by $f$ would then produce a function with divisor $R-O$, where $R$ has degree one. On any curve with $|O|=\{O\}$, this forces $R=O$, contradicting the fact that $O$ is the pole. The zero sets are therefore disjoint.

The important lesson is that irreducibility alone is not enough. The full divisor pushforward, including coefficient one, does the work. A repeated norm divisor such as $e(H)_0$ would not imply the same reduced-point conclusion.

### The elliptic deck test

On an elliptic curve, a degree-two deck involution has the form

$$
\sigma(Q)=S-Q.
$$

If the prime zero divisor $Z$ met its deck image $\sigma Z$, the two prime divisors would coincide. But the elliptic sum of the points in $Z$ is $O$, while the sum in $\sigma Z$ is $hS$. Equality would force $hS=O$. Consequently, $hS\ne O$ excludes the collision; if $S$ is nontorsion, the exclusion holds for every $h$.

This separates two mechanisms that are easy to conflate. The pushforward argument says that the zeros form one reduced algebraic orbit. The one-degree pole gap excludes an adjacent zero divisor, while the elliptic group law excludes its deck image.

## The second method: an exact quartic rank collapse

The local phase is

$$
\Psi(W)=W^4-\frac32KW^2+bW.
$$

In the twisted polynomial de Rham quotient, integration by parts reduces every polynomial amplitude to the basis $[1],[W],[W^2]$. Expressing $1,\Psi,\Psi^2$ in that basis gives the exact coordinate determinant

$$
\det[1,\Psi,\Psi^2]
=\frac{9b}{64}\bigl(-3K^3+K+3b^2\bigr).
$$

On the limiting aligned transition curve, the factor in parentheses vanishes, so the three classes cannot remain independent. The paper proves more than the vanishing:

- for $K\ne0$, the span has rank exactly two;
- at $(K,b)=(0,0)$, the rank drops to one; and
- the first correction caused by the moving alignment also cancels.

This gives an algebraic explanation for a degeneracy that might otherwise look like a numerical coincidence. It does not, by itself, justify moving the original integration contour or prove an asymptotic estimate that is uniform across Stokes transitions. Those analytic tasks remain separate.

## What this says about Furter's R(3)

Furter's problem asks whether, for every integer $s\ge1$,

$$
a_3^s\in(u_s,u_{s+1},u_{s+2})
\subset\mathbb{Q}[a_1,a_2,a_3],
$$

where $u_r$ is a coefficient extracted from a cubic generating function.

The paper identifies, for each fixed Furter index, an explicit deck norm on an aligned elliptic curve. If that norm is irreducible, the first method supplies the needed adjacent and self-deck divisor disjointness conclusions at that index. The exact replay package verifies the norm's irreducibility from $n=3$ through $n=40$, with a separate deck diagnostic through $n=20$.

The missing word is **uniform**. A proof for every index needs an all-index irreducibility argument, not a longer table of successful cases. It also needs the remaining global contour, cycle, Stokes, and period estimates connecting the quartic local calculation to the original problem. Neither step is supplied here.

The correct status is therefore:

| Layer | Status |
|---|---|
| Prime-pushforward, adjacent-freeness, and elliptic deck-collision results | Proved |
| Quartic determinant, rank strata, and first-correction cancellation | Proved |
| Furter divisor separation at one fixed index | Conditional on that index's deck-norm irreducibility |
| Deck norms for $3\le n\le40$ | Exactly checked finite evidence |
| Uniform norm irreducibility, global analytic control, and $R(3)$ | Open |

## Why the methods may travel

The first method is a compact bridge between arithmetic information and geometry. Norm or elimination polynomials often appear when a divisor upstairs is viewed from a simpler base. When the pushforward is genuinely one irreducible prime with coefficient one, the argument can replace a complicated common-zero computation by a closed-point degree count. The additional pole-gap and deck-sum tests are modular: they may be reusable in other families of curves, covers, or parameterised rational functions.

The second method gives a disciplined way to diagnose dependence among amplitudes near a coalescing-saddle transition. Reducing first in the twisted de Rham quotient avoids confusing polynomial independence with independence of period classes. The exact determinant then identifies the rank-drop locus and distinguishes generic rank two from the more singular rank-one origin.

These tools sit at an intersection of algebraic geometry, elliptic curves, polynomial automorphisms, asymptotic analysis, Gauss-Manin systems, and Stokes phenomena. Their broader value will depend on whether researchers can recognise the same structural ingredients in other problems.

## Who should care, and why

| Likely audience | Why the result matters | Useful next action |
|---|---|---|
| Algebraic geometers | Coefficient-one prime pushforward turns an irreducible polynomial into a reduced closed point and a base-point-freeness conclusion. | Test the criterion on other finite maps, norm divisors, and one-degree pole gaps. |
| Researchers on polynomial automorphisms | The package isolates exact Furter-family geometry without claiming the parent conjecture. | Seek a structural all-index proof or counterexample for the deck norms. |
| Asymptotic analysts | The quartic calculation identifies an exact rank-collapse locus and a first-order cancellation. | Build the missing contour-uniform and Stokes-compatible analytic theorem. |
| Twisted de Rham and Gauss-Manin researchers | The computation distinguishes period-class dependence from ordinary polynomial dependence. | Look for an invariant or categorical interpretation of the determinant and rank strata. |
| Computer-assisted mathematics researchers | The release separates theorem replay, bounded evidence, and open global steps. | Reimplement the identities independently and formalise the algebraic arguments. |
| Research agents | The package is a reusable map of what survived an unsuccessful open-problem attack. | Reuse only the proved modules and preserve the conditional and open-status labels. |

## How it was checked

The paper-level identities replay exactly under normal Python and optimized Python with SymPy 1.14.0. The optional Furter audit is self-contained and verifies the deck-norm irreducibility computations for $3\le n\le40$; the auxiliary deck diagnostic stops at $n=20$.

The frozen release also passed a 22-file SHA-256 manifest, fresh extraction from the tagged Git commit, complete replay from that extraction, LaTeX and PDF structural checks, citation closure, privacy scanning, and a seven-mode publication-integrity audit. The GitHub and Zenodo assets were downloaded publicly and are byte-identical to the frozen local release.

These checks establish internal consistency and reproducibility of the specified algebraic and finite computations. They are not independent reproduction, proof-assistant verification, expert acceptance, editorial acceptance, or peer review. Agreement among AI-assisted audits does not change that assurance boundary.

## What is in the evidence package

The public release contains the 14-page anonymous methods preprint and source, an accessible Markdown reading copy, the standalone exact verifier, the bounded Furter audit, a dated prior-art scoping report, a claim-and-reuse index for research agents, a CC0 licence, assurance and publication-integrity reports, and a SHA-256 manifest.

The source archive is tied to Git commit `8645f34bea51be9c91ea02c3b5c967c98bc269ea` and release tag `v1.0.0-preprint`. The version DOI is `10.5281/zenodo.21745937`; the concept DOI for all versions is `10.5281/zenodo.21745936`.
