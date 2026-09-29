## Summary

Error-correcting codes work by keeping valid messages far apart. Their **minimum distance** is the smallest number of symbol changes separating two different valid messages. The larger this distance, the more room there is to detect or correct errors.

Symmetry can make a code easier to describe and construct. But some algebraic symmetries also force a weakness: a nonzero valid message confined to relatively few coordinates. This candidate identifies a whole family of such short-support messages and turns that structure into an upper bound on distance.

Its broader conclusion is about a specified growing family of codes. With the alphabet and number of coordinate blocks fixed, **free modular group-algebra codes can retain a positive information rate while their relative minimum distance tends to zero**. Here “free” is a technical property of the underlying module. It does not mean all symmetric codes, or all codes constructed with group actions.

## Summary for specialists

Let $n=2^r$, $r\ge2$, and let $A$ be an XOR-circulant matrix over a finite field of characteristic two. Write $e$ for the dimension, over $\mathbb F_2$, of the span of its coefficients. If $e\le r$, then the graph code

$$C(A)=\{(u,uA)\},$$

where $u$ ranges over $\mathbb F_q^n$, has a subcode of dimension at least $n/4$, supported on at most $n$ of the code's $2n$ coordinates. Consequently its generalized Hamming weights satisfy

$$d_j(C(A))\le \frac{3n}{4}+j,$$

for $1\le j\le n/4$.

The minimum-distance bound also has a sharper Griesmer form, given in the paper. At $n=8$, the displayed bound yields $d\le7$, and the Li–Wang example attains seven. Over $\mathbb F_{16}$, a Cauchy construction instead attains nine; its coefficient-span dimension is four, outside the hypothesis $e\le3$.

For every $n=2^r\ge8$, branch number at least $n$ therefore requires an alphabet of size at least $2n$ in characteristic two, and the Cauchy construction achieves branch number $n+1$ over that alphabet. This is a sharp alphabet threshold within the stated matrix family.

## Technical account

The finite argument exposes a small-support subcode. The general argument concentrates sums of coefficients into one fibre of a quotient of an elementary abelian group. Lifting that concentrated word back to the original code gives a word with controlled Hamming weight.

For vector-valued coefficients on $\mathbb F_p^r$, with nonzero total and coefficient-span dimension $e$, a rank-$t$ concentration exists under the sufficient condition

$$r\ge \kappa_p(e)\,p^{t-1}+t-1,$$

where $\kappa_p(e)=ep(p-1)/2$.

The code application requires a group quotient $G\twoheadrightarrow C_p^r$ and nonzero augmentation image $\varepsilon(C)$. Its distance bound is

$$d(C)\le |G|p^{-t}\,d(\varepsilon(C)),$$

where $t=T_p(r,m\ell)$ and $q=p^m$.

For fixed field, fixed number $\ell$ of coordinate blocks and positive fixed free rank, this yields relative distance $O(1/r)$. Systematic generators permit an improved concentration parameter. The manuscript gives the exact definitions, reconstruction and boundary cases.

## Evidence, assurance and limitations

The [research repository](https://github.com/ipitchford/modular-code-obstructions) supplies the manuscript, a substantive [AI index](https://github.com/ipitchford/modular-code-obstructions/blob/main/AI_INDEX.md), claims, source comparisons and deterministic replay instructions. The [versioned release](https://github.com/ipitchford/modular-code-obstructions/releases/tag/v2.1-candidate) adds the frozen archive, PDF, TeX, replay receipt and checksums.

Checks include all **2,097,152** augmentation-one order-eight kernels over the eight-element field, smaller-field exhaustive cases, parity-check minors, Cauchy positive controls and **30** concentration certificates. Deliberately corrupted certificates must be rejected. The added revision checks run both normally and with Python optimisation enabled; the assertion-dependent main runner explicitly refuses optimised execution.

A producer rerun of the supplied referee implementation also enumerates all **16,777,216** words of the finite Li–Wang code and checks its weight enumerator through the MacWilliams identity. This provides implementation diversity, but the supplied audit's external independence has not been authenticated.

These computations support finite instances and implementation behaviour. The universal results depend on the written arguments, not on extrapolating from the enumeration.

### Scope and limitations

This is an **unrefereed candidate**, not a proof-assistant-verified result. Producer replay, a supplied review, an archive and a DOI are distinct from unaffiliated reproduction or external peer review.

The nonzero-augmentation hypothesis matters. Nonfree augmentation-zero codes can evade the obstruction; a group acting freely on coordinates does not establish that the code is a free module. No unrestricted claim about all error-correcting codes or absolutely maximally entangled states follows. The odd-prime existence theorem is not a general efficient construction algorithm.

The examples also need care: an earlier free-code example in the package has minimum distance one and illustrates freeness only. The revised coupled example illustrates the theorem's bounds, not a newly certified optimal code. The [review response](https://github.com/ipitchford/modular-code-obstructions/blob/main/REVISION_RESPONSE_V21.md) records these distinctions.

## Relationship to earlier work

Charpin previously proved asymptotic badness for scalar binary H-codes. That special case is an antecedent, not a discovery of this release. The proposed extensions use vector-valued coefficients, work in every prime characteristic, and give module-level distance bounds with explicit hypotheses.

The finite example attaining distance seven is also inherited: it comes from Li and Wang's diffusion-matrix construction. The revision shows that a classical Cauchy construction makes the characteristic-two alphabet threshold sharp. It does not claim to invent Cauchy matrices or settle every larger-order attainment question.

The historical comparison is bounded. Older nonbinary H-code work has not been cleared sufficiently to support an exhaustive priority claim. The [source audit](https://github.com/ipitchford/modular-code-obstructions/blob/main/SOURCES.md) separates primary-source checks from leads whose full text was not obtained.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Coding theorists | Rule out large relative distance in specified modular families | Preserve freeness, fixed-index and augmentation hypotheses |
| Diffusion-matrix researchers | Use the finite rank obstruction and alphabet threshold | This is not a new construction or cryptographic attack |
| Verification researchers | Challenge exact certificates and proof-to-code correspondence | Finite replay is not proof of the universal argument |

## Why the problem matters

For code design, an obstruction can rule out a promising-looking family before substantial search or optimisation. The value here is conditional and specific: it identifies algebraic assumptions under which large relative distance cannot survive, even when the rate remains positive. It does not measure practical decoder performance or establish a new cryptographic attack.

## How to inspect or reproduce the recorded checks

Read `AI_INDEX.md` and `ASSURANCE.md` in a fresh archive extraction. Use Python 3.13, the pinned NumPy requirement and a C++17 compiler, then run:

```sh
python -m pip install -r requirements.txt
python -B reproduce.py --regenerate --out-dir ../modular-replay
```

The output directory must not already exist. The runner checks the complete manifest, compiles the exact checker, regenerates the certificates, exercises explicit optimised controls and writes logs and a receipt outside the immutable package. The release receipt also binds exact-commit Linux CI. Neither successful execution nor matching hashes replaces reading the universal proofs.

## The most valuable next projects

An unaffiliated audit of the analytic proofs and a fuller comparison with older nonbinary H-code work would most improve assurance. Sharper general concentration thresholds and constructions outside the obstruction's hypotheses are further research directions, not unfinished prerequisites concealed by this release.

## What is in the evidence package

| Item | Purpose |
|---|---|
| PDF, TeX and Markdown manuscript | Exact hypotheses, proofs, examples and references |
| Checkers and concentration certificates | Reproducible finite tests and rejection controls |
| AI index, claims and source audit | Scope, dependencies, antecedents and limitations |
| Revision response and provenance | Review actions, source hashes and contribution boundaries |
| Replay receipt and manifests | Execution evidence and exact file identities |

Original prose and data are CC0-1.0; original code is MIT. Media explain the result and supply no additional mathematical evidence.
