## Summary in plain English

If adding two matrices hardly reduces their combined size, what can happen when three matrices are added together? Can their total cancellation still be large even though each pair appears nearly additive?

The Schatten–Hlawka problem asks how large a multiplier is needed to control three-way cancellation using the three pairwise cancellations. The multiplier must work for matrices of every size. This note studies what happens as the norm approaches the trace norm, where no finite universal multiplier works.

Using a known two-by-two construction, the paper proves a quantitative obstruction: any valid multiplier must grow at least as fast as a particular reciprocal logarithmic scale. It also determines the best asymptotic choice of parameter within that construction and explains why its exact cancellation amplitude is preferable to other fixed amplitudes.

This is an AI-assisted, unrefereed mathematical candidate. Its result is a **lower bound on the multiplier required**, not an upper bound that guarantees safety for arbitrary matrices. The underlying matrix construction is inherited; the contribution is its endpoint analysis.

## Summary for specialists

Let $C_p$ be the least dimension-independent constant bounding the triple triangle deficit by $C_p$ times the sum of the three pair deficits in Schatten $p$-norm. With $\varepsilon=p-1\downarrow0$, the paper proves

$$
\liminf_{\varepsilon\downarrow0}\varepsilon\log(1/\varepsilon)C_{1+\varepsilon}\ge\frac23.
$$

For Esa's rank-one projector family, let $R_p(t)$ denote its deficit ratio. Its best ratio is

$$
M_p=\sup_{0<t\le1}R_p(t).
$$

Writing $L=\log(1/\varepsilon)$,

$$
M_{1+\varepsilon}^{-1}=\frac32\varepsilon L+K\varepsilon+O(\varepsilon^2L^2),
\qquad K=3+\frac32\log(4/3)-\log2.
$$

Every maximizing parameter satisfies

$$
t_\varepsilon=\frac34\varepsilon-\frac38\varepsilon^2L+O(\varepsilon^2).
$$

The statement is uniform over all maximizers, without asserting uniqueness. A compact-scale loss formula and a fixed-amplitude comparison supplement this result. Neither identifies the unrestricted sharp constant $C_p$.

## Technical account

### A small example exposes a dimension-independent obstruction

The matrices are two rank-one projectors with equal diagonal entries and opposite off-diagonal entries, together with a negative diagonal matrix. For $a=1-t$, the projectors are

$$
X_t=\begin{pmatrix}a&\sqrt{at}\\\sqrt{at}&t\end{pmatrix},\qquad
Y_t=\begin{pmatrix}a&-\sqrt{at}\\-\sqrt{at}&t\end{pmatrix},
$$

and $Z_t=\operatorname{diag}(0,-2t)$. Each projector has norm one. Their off-diagonal entries cancel, and $Z_t$ removes the remaining second diagonal entry. The triple deficit is exactly $4t$.

At the trace endpoint, the pair-deficit sum is $8t^2+O(t^3)$. Thus the three-way deficit is much larger than the pairwise total as $t$ becomes small. This construction and endpoint obstruction are due to Esa; the paper analyzes how the ratio changes when the exponent moves above one.

### Two small effects compete

Changing the exponent to $1+\varepsilon$ adds a pair-deficit term of order $\varepsilon t\log(1/t)$. The reciprocal ratio therefore balances a contribution proportional to $t$ against one proportional to $\varepsilon\log(1/t)$.

At any fixed scale $t=c\varepsilon$, the leading normalized ratio is the same. The next coefficient distinguishes the choices and selects $c=3/4$. Crucially, the paper does not assume that every optimum lies on such a scale. It first controls a differentiated remainder, rules out competing endpoint regimes, and proves that every global maximizer within the family has $t$ comparable to $\varepsilon$.

For scales in a fixed compact positive interval, the leading reciprocal loss relative to the family optimum is

$$
\frac32\varepsilon(x-1-\log x),\qquad x=\frac{4c}{3}.
$$

This nonnegative expression explains the cost of choosing a different linear scale. It is not a general classification of near-optimal arbitrary triples.

### Why cancel exactly?

Replace the last matrix by $\operatorname{diag}(0,-zt)$, keeping $z>0$ fixed. For every fixed $c>0$,

$$
\varepsilon\log(1/\varepsilon)R_{1+\varepsilon,z}(c\varepsilon)
\longrightarrow\frac{\min(z,2)}{1+z}.
$$

The limit increases up to $z=2$ and decreases afterwards. Exact cancellation is therefore best among these fixed amplitudes at the leading scale. Away from $z=2$, the triple deficit itself depends on the exponent; the proof retains that dependence rather than substituting its trace-endpoint value. Amplitudes that move with $\varepsilon$ are not covered.

## Evidence, assurance and limitations

The universal statements rest on written analytic proofs. Finite rational checks, singular-value comparisons and high-precision evaluations support the calculations but do not prove the asymptotics or exclude unsampled extrema. Near the endpoint, cancellation in the denominator makes precision particularly important; decimal calculations are not rigorous interval certificates.

Producer-side checking is not unaffiliated reproduction, external human refereeing or formal verification. The presence of a cited Lean development does not mean that the new theorems have been formalized or that its full dependency graph was independently checked here.

No matching upper bound for arbitrary triples is proved. The true universal constant could grow faster. The second coefficient and maximizing scale belong to the specified construction. The amplitude comparison fixes both amplitude and linear-scale parameter before taking the limit. A bounded source search found no earlier matching rate statement, but cannot guarantee absolute priority.

## Relationship to earlier work

Audenaert and Kittaneh posed the norm-deficit problem; its Hilbert benchmark is $C_2=1$. Colbrook supplied a distinct rectangular trace-endpoint obstruction. Esa's two-dimensional projector construction is the one used here, while Esa's interior-existence argument and large-exponent diagonal results address different questions.

The new contribution claimed is the joint endpoint rate, optimization throughout this inherited family, and the stated parameter refinements. It is not a new counterexample at the trace endpoint or a solution of the unrestricted sharp-constant problem. The source register provides pinned code locations and separates these claims explicitly.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Matrix-inequality researchers | A quantitative obstruction that any proposed universal upper bound must accommodate | Family sharpness is not unrestricted sharpness |
| Researchers studying endpoint asymptotics | An example where localization must precede expansion at an optimum | Fixed-parameter limits cannot be silently exchanged |
| Numerical linear algebra researchers | A small explicit stress test for cancellation-sensitive deficit formulas | Numerical agreement is not a certified error bound |

## Why the problem matters

Pairwise information need not control a combined interaction with a modest constant. Quantifying how that control deteriorates distinguishes a qualitative endpoint failure from a useful constraint on possible theorems near the endpoint. The result narrows what a successful universal inequality could look like without claiming to supply one.

## How to inspect or reproduce the recorded checks

Start with Section 2 of the paper for the matrices and exact singular values. Sections 3–4 derive the endpoint expansion; Section 5 explains why other parameter scales cannot improve the family optimum. Sections 5.1–6 contain the refinements and their quantifiers.

Read the package's verification record before running `checks/verify.py` and `checks/reviewer_check.py`. Compare each recorded check with the relevant claim. Rational instances, numerical formula comparisons and numerical stationary points have different evidential scopes; none replaces the written proof. The source register identifies which construction and results are inherited.

## The most valuable next projects

A matching dimension-independent upper rate would address the central unresolved question. A second direction is to analyze cancellation amplitudes that vary with the exponent, which requires new uniform estimates rather than substitution into a fixed-amplitude limit. Eventual uniqueness of the family maximizer is a more local question requiring additional derivative control; it is not part of the present theorem.

## What is in the evidence package

The package contains a self-contained manuscript, claim register, primary-source comparison, limitations and machine-readable reading guide, together with computational checks and their verification documentation. The argument does not depend on access to private reviews. Mathematical proof, finite checks, numerical diagnostics and historical search coverage remain distinct.
