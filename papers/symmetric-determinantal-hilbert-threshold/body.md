## Summary

How complicated is the series that counts a chosen symmetry type inside repeated tensor products? This candidate gives a single dividing line for complex orthogonal groups: every fixed nonzero genuine representation has an algebraic counting series in dimensions one, two and three, and none does in higher dimensions. All these series nevertheless satisfy linear differential equations with polynomial coefficients.

The consequence is stronger than an invariant-only result: changing the chosen genuine representation cannot restore algebraicity above dimension three. This is an unrefereed written classification candidate, assembled from explicitly attributed classical inputs. Historical priority is not established.

## Summary for specialists

Let $V=\mathbb C^m$ be the defining representation and let $W\ne0$ be a fixed finite-dimensional algebraic representation of $O(m,\mathbb C)$, with $m\ge1$. Put

$$P_W(t)=\sum_{N\ge0}b_W(N)t^N,$$

$$b_W(N)=\dim\operatorname{Hom}_{O(m)}(W,V^{\otimes N}).$$

The candidate proves that $P_W$ is D-finite for every $m$, and algebraic over $\mathbb C(t)$ if and only if $m\le3$. The quantifier includes reducible genuine representations, but excludes virtual subtraction and a representation varying with $N$.

For the symmetric determinantal quotient, put

$$S=\operatorname{Sym}(\operatorname{Sym}^2\mathbb C^\infty),$$

$$B_m=S/I_{m+1}.$$

The invariant specialization gives algebraicity of its **symmetric-sequence ordinary Hilbert series** exactly for $m\le3$ (including the trivial $m=0$ case). This is not a claim about the usual finite-variable commutative Hilbert series.

## Technical account

The low-dimensional side gives explicit formulas for all types of $O(1)$, $O(2)$ and $O(3)$. For $O(3)$, the half-line tensor-product recurrence must retain the exceptional boundary at spin zero; a parity projection then distinguishes the two extensions from $SO(3)$.

For the obstruction, character integration over the full compact orthogonal group isolates the two maximal trace points, $I$ and $-I$. If the central parity of $W$ is $\varepsilon$, the compatible coefficients satisfy

$$b_W(2n+\varepsilon)\sim K_W m^{2n}n^{-\alpha},$$

$$K_W=\dim(W)m^\varepsilon c_m,$$

$$\alpha=\frac{m(m-1)}4,$$

where

$$c_m=2^{1-m}(m/2)^\alpha\pi^{-m/2}\prod_{j=1}^m\Gamma(j/2).$$

The scalar constant is already supplied by Regev's work. The manuscript also derives the normalization directly and explains why the two maximal points add rather than cancel on the compatible parity. Integer exponents force logarithmic singularities after differentiation. Half-integer exponents force a leading amplitude incompatible with algebraicity above dimension three. Mixed central parity is handled by extraction. D-finiteness follows through finitely generated covariants, bounded row support and the Sam–Snowden theorem.

The genuine-representation qualification is substantive. In dimension four the trivial and determinant multiplicities are $(C_n^2+C_n)/2$ and $(C_n^2-C_n)/2$. Their virtual difference is $C_n$, so subtraction cancels the high-rank obstruction. This illustration is not advertised as a new Catalan identity.

## Evidence, assurance and limitations

The package contains a thirteen-page integrated manuscript, precise source comparison, response matrix, preserved substantive reviews and five confirmation reports. Internal editorial confirmation accepted the scoped candidate with attribution and priority qualifications; it does not constitute independent journal peer review or an externally certified star rating.

Producer replay compares 463 tableau shapes, checks 841 weight and 841 spin multiplicities, verifies parity and dimension identities, and rejects a deliberately corrupted hook divisor under normal and optimized Python. Fresh extraction and Linux CI validate the shipped finite diagnostics. They do not prove the universal theorem. No formal verification or independent reimplementation is claimed.

The theorem does not classify arbitrary modules over twisted commutative algebras, nonreduced thickenings, growing representation types or all virtual characters. D-finiteness alone supplies neither a useful differential-equation order nor an efficient coefficient algorithm.

## Relationship to earlier work

Regev (1981), Theorem 3.3 and Formula 4.5.1, already gives the scalar asymptotic including its constant. Almkvist, Dicks and Formanek (1985), Theorem 2.1, gives the relevant tensor-algebra character integral; their Example 5.10 gives the $SO(3)$ invariant radical whose even part is the orthogonal invariant series. The package records the published erratum. General fixed-type tensor asymptotics also have classical antecedents, including the Biane result discussed by Tate and Zelditch.

The presented contribution is the unified all-fixed-genuine-type orthogonal classification, with explicit low-dimensional formulas, parity treatment and the no-restoration consequence. It is not a claim to have originated the scalar asymptotic, the rank-three radical, character integration or the classical algebraicity obstruction. The supplied Regev and Almkvist–Dicks–Formanek papers were directly inspected. Cohen–Regev (1988) was unavailable and is explicitly marked uninspected; no claim about its detailed contents is made. The bounded comparison does not establish historical priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Representation theorists | Know when every fixed orthogonal type admits an algebraic ordinary series. | Fixed genuine type and characteristic zero are essential. |
| Invariant theorists | Transfer the invariant classification to symmetric determinantal series. | Distinguish symmetric-sequence series from finite-variable Hilbert series. |
| Symbolic-computation researchers | Choose D-finite rather than algebraic ansatzes above dimension three. | No effective differential-order or runtime guarantee is supplied. |

## Why the problem matters

Algebraic series form a much narrower class than D-finite series. A sharp classification explains why a successful radical formula in low dimension cannot simply be extended by choosing a different genuine symmetry type in higher dimension. It also identifies cancellation, rather than an improved invariant formula, as the issue when virtual representations are allowed. These are mathematical consequences, not measured practical or productivity benefits.

## How to inspect or reproduce the recorded checks

Download the versioned ZIP, compare its SHA-256 with `SHA256SUMS`, and extract it into a fresh directory. With Python 3.10 or later, run `python3 replay.py` and `python3 -O replay.py`. Both must report `PASS`; the receipt identifies the exact checks and their finite boundary. No third-party Python library is required. The manifest is checked before the diagnostics.

## The most valuable next projects

1. Obtain an unaffiliated proof audit concentrating on compact-group normalization, the singularity obstruction and finite generation of fixed covariants.
2. Determine explicit annihilating differential equations and useful order bounds for selected higher-dimensional types.
3. Classify virtual character combinations whose singularities cancel; the genuine theorem does not settle this problem.

## Who might contribute

Useful scrutiny would combine orthogonal representation theory, analytic combinatorics and twisted commutative algebra. Separate historical work could assess priority beyond the directly inspected antecedents. No endorsement by the cited authors is implied.

## What is in the evidence package

The immutable candidate release includes the PDF and Markdown manuscript, Python verifiers and semantic controls, complete manifest, replay receipt, claim index, source audit, review history, editorial decision, citation metadata and component licences. Original prose is CC0; original code is MIT. Supplied full third-party papers are not redistributed. Historical paths in preserved reports are provenance, not dependencies needed to run the package.
