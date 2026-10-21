## Summary

This page explains, in order: where the polynomials studied here come from, what an earlier candidate conjectured about them, the two theorems this release proves, what they mean and what they depend on, and what has and has not been checked.

**The setting.** Take a polynomial that starts with $t$, such as $H(t)=t+at^2+xt^3+yt^4$, and ask for its inverse function: the power series $H^{-1}$ that undoes it. The coefficients of that inverse are themselves polynomials $g_n(a,x,y)$ in the three parameters. These coefficient polynomials matter in the study of plane polynomial automorphisms: a criterion of Lewis, Perry and Straub decides containments between "polydegree strata" by asking whether certain of these coefficients can vanish together at a suitable, well-behaved point.

**What was conjectured.** That criterion only needs one good point. An earlier smooth-point candidate in the same programme (its Conjecture 7.4) proposed something much stronger: that every common zero of two consecutive coefficients, in the natural affine chart $a=1$, is simple; that their number is exactly $\lfloor d(d+1)/6\rfloor$; and that two further quantities (the Jacobian and the next coefficient) never vanish there. It checked this through $d=20$ and checked a key boundary ingredient, coprimality of adjacent boundary factors, through $d=200$, but left the uniform statement open.

**What was found.** Two neighbouring polynomials can each have well-behaved roots without their roots fitting together in any useful order. This candidate proves the stronger statement for the boundary factors $P_d$ of this family: for every $d\ge2$ the roots of $P_d$ and $P_{d+1}$ are simple, positive and strictly alternate, and the first root belongs to the even-indexed polynomial. That ordering rules out shared boundary roots. Combined with an explicitly cited external rigidity theorem (called R3 below), it gives a precise structural description of every corresponding affine intersection: all points are simple, their number is known exactly, and two important quantities never vanish there. Together these resolve the earlier Conjecture 7.4, conditionally on R3.

**What it means.** Existence of one useful point leaves open what happens at all the other points. The result supplies that missing information for this family: every affine common point is a valid smooth specialization, not only one of them. It does not give explicit coordinates of those points, their fields of definition, or any new proof of the length-two polydegree closure result already covered by earlier work.

**Status.** An unrefereed candidate. AI tools assisted proof development, symbolic auditing, source comparison and drafting under human direction. The boundary theorem has a uniform written proof that does not use R3; the affine theorem depends on R3 from a public research manuscript. Exact symbolic and finite checks are replayable. There is no unaffiliated specialist review, independent reproduction, formal verification or exhaustive priority clearance.

## Summary for specialists

Write $H(t)=t+at^2+xt^3+yt^4$ and $H^{-1}(w)=w+\sum_{n\ge1}g_n(a,x,y)w^{n+1}$. The $g_n$ are weighted homogeneous of degree $n$ for weights $(1,2,3)$ on $(a,x,y)$. Let $G_n(X,Y)=g_n(1,X,Y)$, $I_d=(G_d,G_{d+1})$, $J_d=\det\partial(G_d,G_{d+1})/\partial(X,Y)$, and let $P_n$ be the univariate factor of the boundary specialization $g_n(0,X,Y)$, so that on $XY\ne0$, $B_n(X,Y)=X^AY^\epsilon P_n(Y^2/X^3)$ with $\epsilon=n\bmod2$ and $A=(n-3\epsilon)/2$.

| Result | Statement | Dependence |
|---|---|---|
| Theorem 1 (boundary interlacing) | For every $d\ge2$, the nonconstant polynomials among $P_d,P_{d+1}$ have simple positive roots; when both are nonconstant their roots strictly alternate, with the first root belonging to the even-indexed polynomial. Hence $\gcd_{\mathbb Q[z]}(P_d,P_{d+1})=1$, and up to constants $\gcd_{\mathbb Q[X,Y]}(B_d,B_{d+1})$ is $X$ if $d\equiv1\pmod3$ and $1$ otherwise | Independent of composition rigidity |
| (R3), external | $g_d(p)=g_{d+1}(p)=g_{d+2}(p)=0\Rightarrow p=0$ for $d\ge2$ | Consequence of liqsweep's pinned Corollary 5.1 with $m=3$, $n=d-1$ |
| Theorem 2 (structural affine classification) | For every $d\ge2$, $\mathbb Q[X,Y]/I_d$ is finite étale of degree $N_d=\lfloor d(d+1)/6\rfloor$; $J_d$ and $G_{d+2}$ are units; over $\mathbb C$ the cone $V(g_d,g_{d+1})$ is smooth of dimension one away from the origin | Uses R3, Theorem 1 and credited differential identities |

In short, using the R3 consequence of liqsweep's pinned Corollary 5.1, the algebra

$$
\mathbb Q[X,Y]/(G_d,G_{d+1})
$$

is finite étale of degree $\lfloor d(d+1)/6\rfloor$. This classifies reducedness, geometric cardinality and nonvanishing—not explicit coordinates or residue fields. The degree counts geometric points, not necessarily rational points. For $d=2$ the unique affine point is $(X,Y)=(2,5)$, with $J_2=1$ and $G_4=14$.

## Technical account

**Boundary factors as convolutions of Jacobi polynomials.** Both parity pairings are represented through a common Jacobi-polynomial factor under multiplicative finite free convolution $T_qp=p\boxtimes_Mq$. Classical theory says this operation preserves real-rootedness when $q$ has nonnegative roots. A degree-preserving openness argument (Lemma 3) upgrades this to strictness: when $q$ has degree $M$ and strictly positive roots, $T_q$ is an invertible diagonal map, so it preserves simple real-rootedness and hence strict interlacing, including its orientation. Proposition 6 identifies the reversed boundary factors $R_MP_{2m}$, $R_MP_{2m+1}$ and $R_MP_{2m-1}$, after the rescaling $u=-4s/27$, as convolutions of explicit differential transforms of a Gauss polynomial $p={}_2F_1(-M,-L;\beta;u)$ with simple negative roots. The proof handles the three residue classes $\delta\in\{0,1,2\}$ and the zeros introduced by common-degree reversal.

**Even–odd pairs.** Differential transforms give one pairing directly. At the roots of $\mathcal A=(L-\theta)p$, the Gauss differential equation makes $\mathcal B/p$ an explicit ratio with positive coefficients, so $\mathcal B$ changes sign between consecutive roots of $\mathcal A$, giving strict interlacing, which Lemma 3 transfers to the boundary pair.

**Odd–even pairs.** For the other pairing, $\mathcal E_h$ and $\mathcal Q$ strictly interlace for large $h$. A positive symbolic determinant (Lemma 7, with the explicit coefficients in the appendix) shows the two can never share a nonpositive root, so as $h$ decreases to $H-2$ the roots cannot cross and the ordering persists. The small cases $d=2,3,4$ are checked directly from $P_2=P_3=-1$, $P_4=3$, $P_5=7$.

**From the boundary to the affine count.** For the affine conclusion, the credited quasismoothness and raising identities combine with external R3 to establish transversality. At a nonzero common zero of $g_d,g_{d+1}$, R3 gives $g_{d+2}\ne0$, individual quasismoothness gives $dg_d\ne0$, and the raising identity $Dg_n=(n+2)g_{n+1}+2(n+1)ag_n$ makes the two gradients independent. So every affine point is isolated and reduced, and the Jacobian and $G_{d+2}$ are units. The Hilbert series of the weighted complete intersection then counts the reduced points: its leading coefficient is $d(d+1)/6$. Theorem 1 shows there are no boundary torus solutions, so the only possible extra contribution is the weight-three $y$-axis orbit, present exactly when $d\equiv1\pmod3$, which contributes $1/3$; subtracting it gives the floor formula. At $d=4$, the calculation is $20/6=3+1/3$: three affine geometric points and the exceptional boundary orbit.

## Evidence, assurance and limitations

The uniform conclusions rest on written proofs. Exact symbolic checks verify three determinant identities and positivity certificates (with symbolic $M,h$, checking positive coefficients after substituting $M=v+1$, $h=w+1$). Finite checks cover 96 coefficient identifications, adjacent root diagnostics through $d=60$, and affine lengths and units through $d=10$. A reversed-order control detects the orientation error that alternation alone would miss.

The affine theorem explicitly imports R3 from a public research manuscript: source parameters $m=3,n=d-1$ give the required block $g_d,g_{d+1},g_{d+2}$. That source is not represented as a journal-refereed result. The Hilbert-series calculation does not remove this dependence, because reducedness was established using R3. The boundary theorem survives independently of that input. The results are in characteristic zero; no characteristic-$p$ extension or rigidity-free proof of the affine theorem is claimed.

Status is unrefereed candidate. Producer-coordinated AI editorial review and local replay are recorded; unaffiliated specialist review, independent reproduction, formal verification and exhaustive priority clearance are not established. A supplied AI-assisted review was actioned in the review response; the earlier internal proof review and addendum concern a private predecessor, not this successor. Media communicate the result and add no mathematical evidence.

## Relationship to earlier work

Perry and Lewis–Perry–Straub supply the lower-degree hypergeometric precedent and existential coefficient criterion; the use of hypergeometric relations to prove coprimality is not new here. Furter developed the composition-rigidity framework, and Edo and van den Essen related inverse-coefficient rigidity to the Strong Factorial Conjecture. The earlier smooth-point and structural candidates supply the motivating conjecture and differential identities. The full-$e=3$ candidate constructs a suitable point for containment; it does not provide this uniform boundary comparison or classification of every affine solution. Work from the same programme is not independent corroboration.

The proposed contribution is the parameter-specific adjacent quartic comparison and its structural affine synthesis, not the invention of convolution, a new proof of universal rigidity, or completion of a higher-degree orbit-classification programme. The comparison with inspected sources is bounded, not an exhaustive priority claim.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Polynomial-inversion researchers | Uniform adjacent-root structure and boundary coprimality | Check the common-factor and degree-drop arguments. |
| Algebraic geometers | Exact reduced geometric intersection count | The affine conclusion depends on external R3. |
| Symbolic-computation researchers | Small exact identities and rejection controls | Finite replay is not a universal proof. |

## Why the problem matters

Existence of a useful specialization leaves open what happens at all the other points. The structural result supplies that missing information for this family. Its potential significance is within mathematics; practical applications or broad influence have not been demonstrated.

## How to inspect or reproduce the recorded checks

Read the manuscript's two main theorems, then the claim and source records. With Python and the pinned SymPy dependency (1.14.0) installed, run `python3 run_checks.py` and `python3 -O run_checks.py`. Run `python3 verify_manifest.py` to check file identity. Checks require no network; dependency installation does.

The scripts divide the work as follows: `verify_uniform.py` checks the 96 coefficient identities and the three symbolic determinant and positivity identities; `audit.py` covers the raising identities and root-isolation diagnostics through $d=60$; `check_geometry.py` checks quotient lengths and units for $d=2,\ldots,10$, together with wrong-identity, reversed-order and zero-root controls. The package records exact ranges and the difference between symbolic identities, finite diagnostics and prose arguments. The PDF can be rebuilt with `python3 build.py` and an installed TeX distribution.

## The most valuable next projects

The most useful assurance step is independent scrutiny of the strict-convolution and no-collision arguments, together with the exact R3 specialization. Separate research targets include arithmetic descriptions of the affine points and higher-degree analogues. Neither follows merely by repeating the finite checks at larger indices.

## What is in the evidence package

The archive contains the paper and editable sources, an accessible text rendering, exact scripts and semantic negative controls, claim/dependency records, the response to the supplied review, internal editorial reports, licences, replay records and checksums. GitHub and Zenodo identify the same immutable release bytes. Publication makes those objects inspectable; it does not upgrade their mathematical assurance.
