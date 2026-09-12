## Summary

Two neighbouring polynomials can each have well-behaved roots without their roots fitting together in any useful order. This candidate proves the stronger statement for a family arising from the inverse of a quartic polynomial: the roots strictly alternate, and the first belongs to the even-indexed polynomial.

That ordering rules out shared boundary roots. Combined with an explicitly cited external rigidity theorem, it gives a precise structural description of every corresponding affine intersection: all points are simple, their number is known exactly, and two important quantities never vanish there.

## Summary for specialists

Write $H(t)=t+at^2+xt^3+yt^4$ and $H^{-1}(w)=w+\sum_{n\ge1}g_n(a,x,y)w^{n+1}$. Let $G_n(X,Y)=g_n(1,X,Y)$ and let $P_n$ be the univariate factor of the boundary specialization $g_n(0,X,Y)$.

For every $d\ge2$, adjacent $P_d,P_{d+1}$ are coprime and have the stated strict positive-root interlacing. This theorem is independent of composition rigidity. Using the R3 consequence of liqsweep's pinned Corollary 5.1, the algebra

$$\mathbb Q[X,Y]/(G_d,G_{d+1})$$

is finite étale of degree $\lfloor d(d+1)/6\rfloor$. The Jacobian and $G_{d+2}$ are units. This classifies reducedness, geometric cardinality and nonvanishing—not explicit coordinates or residue fields.

## Technical account

Both parity pairings are represented through a common Jacobi-polynomial factor under multiplicative finite free convolution. A degree-preserving openness argument supplies strictness. Differential transforms give one pairing directly; a positive symbolic determinant excludes root collisions along a deformation for the other. The proof handles the three residue classes and the zeros introduced by common-degree reversal.

For the affine conclusion, the credited quasismoothness and raising identities combine with external R3 to establish transversality. The Hilbert series then counts the reduced points. When $d\equiv1\pmod3$, the weight-three boundary orbit contributes $1/3$; subtracting it gives the floor formula. At $d=4$, the calculation is $20/6=3+1/3$.

## Evidence, assurance and limitations

The uniform conclusions rest on written proofs. Exact symbolic checks verify three determinant identities and positivity certificates. Finite checks cover 96 coefficient identifications, adjacent root diagnostics through $d=60$, and affine lengths and units through $d=10$. A reversed-order control detects the orientation error that alternation alone would miss.

The affine theorem explicitly imports R3 from a public research manuscript: source parameters $m=3,n=d-1$ give the required block $g_d,g_{d+1},g_{d+2}$. The Hilbert-series calculation does not remove this dependence, because reducedness was established using R3. The boundary theorem survives independently of that input.

Status is unrefereed candidate. Producer-coordinated AI editorial review and local replay are recorded; unaffiliated specialist review, independent reproduction, formal verification and exhaustive priority clearance are not established. Media communicate the result and add no mathematical evidence.

## Relationship to earlier work

Perry and Lewis–Perry–Straub supply the lower-degree hypergeometric precedent and existential coefficient criterion. The earlier smooth-point and structural candidates supply the motivating conjecture and differential identities. The full-$e=3$ candidate constructs a suitable point for containment; it does not provide this uniform boundary comparison or classification of every affine solution. Work from the same programme is not independent corroboration.

The proposed contribution is the parameter-specific adjacent quartic comparison and its structural affine synthesis, not the invention of convolution, a new proof of universal rigidity, or completion of a higher-degree orbit-classification programme.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Polynomial-inversion researchers | Uniform adjacent-root structure and boundary coprimality | Check the common-factor and degree-drop arguments. |
| Algebraic geometers | Exact reduced geometric intersection count | The affine conclusion depends on external R3. |
| Symbolic-computation researchers | Small exact identities and rejection controls | Finite replay is not a universal proof. |

## Why the problem matters

Existence of a useful specialization leaves open what happens at all the other points. The structural result supplies that missing information for this family. Its potential significance is within mathematics; practical applications or broad influence have not been demonstrated.

## How to inspect or reproduce the recorded checks

Read the manuscript's two main theorems, then the claim and source records. With Python and the pinned SymPy dependency installed, run `python3 run_checks.py` and `python3 -O run_checks.py`. Run `python3 verify_manifest.py` to check file identity. Checks require no network; dependency installation does.

The package records exact ranges and the difference between symbolic identities, finite diagnostics and prose arguments. The PDF can be rebuilt with `python3 build.py` and an installed TeX distribution.

## The most valuable next projects

The most useful assurance step is independent scrutiny of the strict-convolution and no-collision arguments, together with the exact R3 specialization. Separate research targets include arithmetic descriptions of the affine points and higher-degree analogues. Neither follows merely by repeating the finite checks at larger indices.

## What is in the evidence package

The archive contains the paper and editable sources, an accessible text rendering, exact scripts and semantic negative controls, claim/dependency records, the response to the supplied review, internal editorial reports, licences, replay records and checksums. GitHub and Zenodo identify the same immutable release bytes. Publication makes those objects inspectable; it does not upgrade their mathematical assurance.
