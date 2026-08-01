## Summary

Take two polynomials. You can multiply them together, and you can also compute their *resultant* — a single number that vanishes exactly when they share a root. Now regard the pair of operations as one combined map: feed in two polynomials, get out their product and their resultant.

This paper proves that the Jacobian determinant of that combined map — the quantity measuring how the map stretches volume — has a strikingly simple exact form: up to sign, it is the *difference of the two degrees* multiplied by the *square of the resultant*. Nothing else survives. The paper calls this the degree-difference principle, and it has an immediate consequence: the map is volume-degenerate exactly where the two polynomials share a root, or where their degrees are equal.

From this starting point the manuscript develops the geometry of "slices" of the space of polynomial factorisations — the natural stages on which questions like the century-old Jacobian conjecture play out. It classifies the simplest slices completely, writes down explicit coordinates for the polynomial maps they carry, and identifies obstructions that rule out overly simple behaviour in higher degrees.

## Summary for specialists

For binary forms $A$ of degree $r$ and $B$ of degree $s$, consider the multiplication–resultant map $\Phi_{r,s}(A,B) = (AB, \mathrm{Res}(A,B))$. The central identity is

$$
\det D\Phi_{r,s} = (-1)^{s(r+1)} (r-s) \, \mathrm{Res}(A,B)^2 .
$$

Around this the manuscript establishes torsor and divisor-class statements for the factorisation spaces, a classification of normalised linear–quadratic slices, explicit coordinates for tangent nonosculating slices and their induced Keller maps, a characterisation of fibres and image, and Euler-characteristic obstructions in higher-degree cases.

The verification boundary is drawn precisely, and specialists should note it: a SymPy script (with deliberate negative controls) confirms the determinant identity for all bidegrees $r+s \leq 4$ and base-point signs through degree eight, but the general-degree argument and the structural proofs are *not* machine-checked. The natural first question for a referee — does this identity already exist in the resultant literature in some guise? — is also the release's own first suggested follow-up.

## Technical summary

Fix bidegrees $(r, s)$ with $r \neq s$ and work over a field of characteristic zero. On the affine space of coefficient pairs, $\Phi_{r,s}(A,B) = (AB, \mathrm{Res}(A,B))$ is a polynomial map from a $(r+1)+(s+1)$-dimensional space to a $(r+s+1)+1$-dimensional one, so the source and target dimensions agree and the Jacobian determinant is a single polynomial in the coefficients. The degree-difference principle identifies it exactly: $(-1)^{s(r+1)}(r-s)\,\mathrm{Res}(A,B)^2$. Two structural consequences follow immediately. The branch locus is precisely the resultant hypersurface (pairs with a common root), independent of everything else; and in the equal-degree case $r = s$ the map is everywhere degenerate — the geometric reason the paper's slice constructions always break degree symmetry.

From the identity, the manuscript builds the affine-slice theory used across the project: torsor descriptions of the fibres over the complement of the branch locus, divisor-class computations for the factorisation spaces, a complete classification of normalised linear–quadratic slices, explicit coordinates for the tangent nonosculating slices (where induced Keller maps live), a characterisation of fibres and image, and Euler-characteristic obstructions for higher-degree slices.

The verification boundary is stated with unusual precision. The shipped SymPy checker validates the determinant identity for every bidegree with $r+s \leq 4$ via explicit Sylvester-matrix computation, and base-point sign conventions through degree eight, with deliberate negative controls confirming the tests can fail. The all-degree identity, and all of the structural theory (torsor, divisor-class, orbit classification), rest on the manuscript's prose proofs alone.

## Who should care, and why

| Likely audience | What should interest them | What they could do with it |
|---|---|---|
| Classical algebraic geometers (resultants, elimination theory) | A closed-form Jacobian for the multiplication–resultant map — elementary to state, and either known in disguise or a genuinely missing classical identity. | Settle the priority question against the resultant literature; supply a conceptual proof (the shipped verification is low-degree only). |
| Affine algebraic geometers | The slice classifications feed directly into the project's exotic-sphere identification and isolation theorems. | Audit the torsor and divisor-class arguments — the unchecked half of the release — before the downstream results are taken further. |
| Jacobian conjecture researchers | Explicit coordinates for slices carrying Keller maps, inside a framework built to screen where constant-Jacobian behaviour can occur. | Test the framework against known Keller-map families; probe whether the screening logic survives scrutiny. |
| Symbolic computation researchers | A worked example of drawing an exact machine-checked boundary inside a prose manuscript, with negative controls. | Extend the checker to higher bidegrees; automate general-degree identity verification, which is within reach of current systems. |

## The most valuable next projects

### 1. Settle the priority question

An identity this clean — the Jacobian of (product, resultant) equalling $\pm(r-s)\mathrm{Res}^2$ — sits in territory mined since the nineteenth century. The single most useful contribution a specialist could make is bibliographic: either locate the identity in the classical or modern literature, which would recalibrate the whole release, or confirm its absence, which would establish a small but permanent result.

### 2. Review the structural half

The torsor, divisor-class, and orbit-classification arguments are deliberately outside the symbolic checker's scope. They are also what the two companion releases build on. Expert review of these sections is therefore leveraged three ways: it tests this manuscript, and it underwrites — or undermines — the exotic-sphere and isolation claims downstream.

### 3. Mechanise the general identity

Proving the determinant identity for all bidegrees in a computer algebra system (or a proof assistant) is a well-scoped project: the Sylvester structure is explicit, the answer is known, and success would convert the release's central claim from "checked through bidegree 4" to "proved".

## Specialist audience candidates

The natural specialist readers are algebraic geometers working on resultants and elimination theory, the affine-geometry community whose slice questions the framework serves, and Jacobian-conjecture researchers interested in structured families of Keller maps. This identifies intellectual proximity, not a prediction of endorsement.

The strongest pitch to them is:

> One exact identity — the Jacobian of the multiplication–resultant map is the degree difference times the resultant squared — and a complete low-degree slice theory built on it, with the machine-checked boundary drawn honestly.

## Where this sits in the project

This is the foundational release of a trilogy on binary-form factorisation spaces. The companion releases build on the slices classified here: one identifies a specific slice as an exotic affine three-sphere and obstructs quadratic–cubic slices from being affine space; the other classifies reducible incidence divisors and proves conditional isolation statements aimed at Jacobian-conjecture screening.

## What is in the evidence package

The deposit contains the manuscript (PDF and TeX), the verification script `verify_degree_difference_affine_slices.py` with negative controls, a claim-level evidence map (`AI_INDEX.md`), assurance and provenance documentation (`STATUS.md`, `ASSURANCE.md`, `PROVENANCE.md`, `SOURCES.md`), and SHA-256 manifests, archived on Zenodo and Software Heritage.
