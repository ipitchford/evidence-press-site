## Summary

> **External development, 12 September 2026:** an [unrefereed preprint by liqsweep](https://github.com/blueberryvertigo/polynomial-composition-rigidity/blob/b17b6b9f7440b12fd85df2c2db9c98209ecc174d/proof.pdf) proposes a general proof of polynomial-composition rigidity. The external candidate proposes a general proof of R(m,n), including the original R(3) target. It does not supply this release's uniform deck-norm irreducibility or global contour, cycle, Stokes and period estimates; the standalone geometric and quartic results retain their original scope. [Internal source review and scope audit](https://github.com/ipitchford/evidence-press-site/blob/main/docs/RIGIDITY_EXTERNAL_REVIEW_2026-09-12.md) are not unaffiliated verification. Original archives and release-time audio/video are unchanged.

This page explains, in order: what the original target was, the two methods that survived, how each works, what they do and do not say about Furter's problem, how the checks were done and how to replay them, and what would most usefully come next.

This paper does not solve Furter's $R(3)$ conjecture. It reports a productive failure.

The original target was Furter's $R(3)$ conjecture, then an open problem about three consecutive coefficients of a generating function and the ideal they generate. The project did not solve that problem. Instead, it isolated two pieces of mathematics that no longer depend on the unfinished global argument and may be useful elsewhere.

The first is a geometric separation principle. Very roughly, an irreducible polynomial seen on the base of a map can certify that a collection of zeros upstairs is really one indivisible algebraic point. If two rational functions have pole orders differing by exactly one, that indivisibility leaves no room for them to share a zero. On an elliptic double cover, a second group-law test prevents the zero set from colliding with its mirror image under the deck involution.

The second is an exact calculation at a quartic transition, the kind of local model that appears when several saddle points coalesce. After reducing polynomial amplitudes in a twisted de Rham quotient, three natural classes lose rank on the aligned transition curve. The determinant, rank strata, and first correction are all computed exactly.

These are proved statements. Their role in Furter's family is more limited. At each fixed index, the geometric method applies if an explicit deck norm is irreducible. The release checks that irreducibility exactly for $3\le n\le40$. That finite range is evidence, not an all-index theorem. Uniform irreducibility and the global contour and period estimates are not supplied here. The external candidate offers a different route to $R(3)$; it does not establish those method-specific obligations.

## Summary for specialists

The first result is a divisor-theoretic criterion: coefficient-one pushforward to a prime divisor of degree $h$ forces an effective degree-$h$ divisor upstairs to be one reduced closed point. Exact pole orders $hO$ and $(h+1)O$ then exclude adjacent common zeros; on an elliptic double cover, the condition $hS\ne O$ separately excludes intersection with the deck transform. The coefficient-one hypothesis, not bare norm irreducibility, is essential.

The second result is an exact calculation in the twisted polynomial de Rham quotient for $\Psi(W)=W^4-\tfrac32KW^2+bW$. The classes $[1],[\Psi],[\Psi^2]$ have determinant $\tfrac{9b}{64}(-3K^3+K+3b^2)$. On the aligned transition curve the span has rank two away from the origin and rank one at the origin, with cancellation of the first moving-alignment correction. This local algebra does not supply the missing contour-uniform global asymptotics.

The manuscript's own claim-status table (Table 1) reads:

| Status | Claims |
|---|---|
| Established | Theorems 3.2 and 6.2, Corollary 3.4, Lemma 4.1, and Propositions 4.2, 4.3, 5.1 and 6.3, including the family-specific pole/norm identities and the precise rank-one point |
| Established conditional implication | Theorem 4.4: for each fixed Furter index $n$, irreducibility of the exact degree-$(n-1)$ deck norm implies the two required divisor-disjointness statements |
| Open | Uniform irreducibility of those norms, the remaining global contour/period bounds, and Furter's $R(3)$ conjecture itself |

## Technical account

The two methods can be read independently. The first (Section 3 of the manuscript) is pure divisor geometry; the second (Sections 5–6) is exact algebra in a twisted de Rham quotient.

### The first method: irreducibility becomes separation

Suppose a map sends an effective divisor $Z$ of degree $h$ on a smooth projective curve to the zero divisor of one irreducible polynomial of degree $h$, with coefficient one. Proper pushforward counts both multiplicity and residue-field degree. Because every contribution is a positive integer, the coefficient-one hypothesis forces a rigid conclusion: $Z$ consists of one reduced closed point of degree $h$.

That observation becomes useful when two rational functions $f$ and $g$ have exact pole divisors

$$
(f)_\infty=hO,\qquad (g)_\infty=(h+1)O.
$$

If $f$ and $g$ shared a zero, the one closed point making up $(f)_0$ would have to lie inside $(g)_0$. Only one degree of zero divisor would remain. Dividing $g$ by $f$ would then produce a function with divisor $R-O$, where $R$ has degree one. On any curve with $|O|=\{O\}$, this forces $R=O$, contradicting the fact that $O$ is the pole. The zero sets are therefore disjoint.

The important lesson is that irreducibility alone is not enough. The full divisor pushforward, including coefficient one, does the work. A repeated norm divisor such as $e(H)_0$ would not imply the same reduced-point conclusion.

![A prime divisor on the base lifting to one reduced closed point on a double cover, with adjacent and deck-transformed zeros kept disjoint.](/assets/figures/irreducible-pushforward-method.svg "The separation mechanism: coefficient-one prime pushforward fixes the zero divisor upstairs; the pole gap and elliptic deck test then provide two distinct disjointness conclusions.")

#### The elliptic deck test

On an elliptic curve, a degree-two deck involution has the form

$$
\sigma(Q)=S-Q.
$$

If the prime zero divisor $Z$ met its deck image $\sigma Z$, the two prime divisors would coincide. But the elliptic sum of the points in $Z$ is $O$, while the sum in $\sigma Z$ is $hS$. Equality would force $hS=O$. Consequently, $hS\ne O$ excludes the collision; if $S$ is nontorsion, the exclusion holds for every $h$.

This separates two mechanisms that are easy to conflate. The pushforward argument says that the zeros form one reduced algebraic orbit. The one-degree pole gap excludes an adjacent zero divisor, while the elliptic group law excludes its deck image.

### The second method: an exact quartic rank collapse

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

Proposition 6.3 proves this cancellation only through the displayed order; no term-by-term all-orders statement is proved.

This gives an algebraic explanation for a degeneracy that might otherwise look like a numerical coincidence. It does not, by itself, justify moving the original integration contour or prove an asymptotic estimate that is uniform across Stokes transitions. Those analytic tasks remain separate.

![A quartic phase beside the aligned transition curve, where three twisted de Rham classes collapse to rank two and then rank one at the origin.](/assets/figures/quartic-transition-rank-collapse.svg "The constrained quartic transition: the exact determinant vanishes on the aligned curve, giving rank two away from the origin and rank one at the origin.")

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
| Uniform norm irreducibility and global analytic control | Not established by this release or the external argument |
| Original $R(3)$ target | External candidate answer identified on 12 September 2026; unaffiliated verification not established |

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

## Evidence, assurance and limitations

The paper-level identities replay exactly under normal Python and optimized Python with SymPy 1.14.0. The optional Furter audit is self-contained and verifies the deck-norm irreducibility computations for $3\le n\le40$; the auxiliary deck diagnostic stops at $n=20$.

The frozen release also passed a 22-file SHA-256 manifest, fresh extraction from the tagged Git commit, complete replay from that extraction, LaTeX and PDF structural checks, citation closure, privacy scanning, and a seven-mode publication-integrity audit. The GitHub and Zenodo assets were downloaded publicly and are byte-identical to the frozen local release.

These checks establish internal consistency and reproducibility of the specified algebraic and finite computations. They are not independent reproduction, proof-assistant verification, expert acceptance, editorial acceptance, or peer review. Agreement among AI-assisted audits does not change that assurance boundary.

The internal review consisted of three internal adversarial mathematical audits, followed by a separate publication-integrity and privacy audit. The manuscript lists its main limitations as:

1. the all-index irreducibility premise for the Furter deck norms is open;
2. the paper does not reproduce every projective normalization and boundary reduction needed to deduce the original ideal-membership statement;
3. the quartic computation is formal and algebraic, not a contour-uniform asymptotic theorem;
4. the literature audit is a documented scoping search, not an exhaustive proof of novelty; and
5. the separate audits are internal AI-assisted proof checks, not external peer review.

Within the source project, separately checked reductions identify the fixed-index disjointness statements as sufficient for the remaining aligned generic incidence, but this methods paper does not reproduce that reduction chain and does not present the implication as a proof of $R(3)$ (Remark 4.6). Finite computations, deterministic replay, hashes, and agreement among AI-assisted audits certify reproducibility of specified checks. They do not convert an open all-index statement into a theorem.

## How to inspect or reproduce the recorded checks

From the source archive attached to the GitHub release (or the Zenodo record), the proof-level identities run under normal and optimized Python:

```bash
./repro/replay.sh
./repro/replay.sh --with-bounded-furter   # optional finite Furter deck-norm audit
```

The replay uses `uv` with `sympy==1.14.0`. Checks raise explicit exceptions and do not rely on Python assertions, so optimized mode cannot silently remove them. Set `AUDIT_STOP` to change the finite irreducibility endpoint; the default is 40, and the accompanying deck diagnostic remains fixed through $n=20$. No finite endpoint is represented as an all-index theorem.

The verifier `repro/verify_methods.py` reconstructs the elliptic cubic, its discriminant, the rational two-torsion point and the division-polynomial certificate, and the quartic blow-up, moment-transform determinant and rank identities in exact rational arithmetic; it derives the first correction from the phase rather than hard-coding it. Start reading with `AI_INDEX.md`, the claim and reuse map, and `ASSURANCE.md`; then Theorem 3.2, Corollary 3.4 and Theorem 6.2 in the manuscript.

## The most valuable next projects

1. **Uniform deck-norm irreducibility.** Prove, or refute, irreducibility of the Furter deck norms for every $n\ge3$ by a structural argument; a longer table of successful cases does not suffice.
2. **The global analytic theorem.** The manuscript (Section 7) states what a genuine large-$N$ theorem would additionally need: Stokes-compatible continuation of the principal and local rapid-decay cycles along the transition curve; a quantitative lower bound for $\max(\lvert Z_0\rvert,\lvert Z_1\rvert)$, including equal-critical-value fibres and projective boundary charts; a uniform contour deformation and tail estimate whose error is smaller than that bound; and compatible estimates in the adjoining double-saddle charts.
3. **Higher-order cancellation.** Extend the first-order cancellation of Proposition 6.3, which exact finite-$N$ observability identities motivate but do not prove.
4. **Independent checking.** Reimplement the identities independently and formalise the algebraic arguments in a proof assistant.
5. **Reuse elsewhere.** Test the prime-pushforward criterion on other finite maps, norm divisors and one-degree pole gaps.

## What is in the evidence package

The public release contains the 14-page anonymous methods preprint and source, an accessible Markdown reading copy, the standalone exact verifier, the bounded Furter audit, a dated prior-art scoping report, a claim-and-reuse index for research agents, a CC0 licence, assurance and publication-integrity reports, and a SHA-256 manifest.

The source archive is tied to Git commit `8645f34bea51be9c91ea02c3b5c967c98bc269ea` and release tag `v1.0.0-preprint`. The version DOI is `10.5281/zenodo.21745937`; the concept DOI for all versions is `10.5281/zenodo.21745936`.
