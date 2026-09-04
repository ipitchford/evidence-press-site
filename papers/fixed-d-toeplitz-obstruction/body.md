## Summary

The category $\mathbf{FI}_d$ records injections of finite sets together with a
choice of one of $d$ colors for every newly added point. A natural subcategory
consists of modules that can be described using generators and relations whose
object degrees have a common finite bound—even when there are infinitely many
of them.

For ordinary $\mathbf{FI}=\mathbf{FI}_1$, that subcategory is abelian: kernels
and cokernels stay inside it. An AIM problem asks whether the same is true for
other combinatorial categories and records the expectation that it is probably
false for $\mathbf{FI}_d$ when $d>1$.

This anonymous, unrefereed candidate proves the expected negative answer over
every characteristic-zero field, for every fixed finite $d\geq2$. It builds one
morphism between well-presented modules whose ambient kernel is not presented
in finite degree. A separate Yoneda argument proves that the subcategory cannot
repair the failure by choosing some different kernel object.

The mechanism has a compact picture:

$$
\text{two colors}
\longrightarrow \text{Toeplitz blocks}
\longrightarrow \text{unbounded first syzygies}
\longrightarrow \text{no internal kernel}.
$$

## Summary for specialists

Let $k$ be a field of characteristic zero and fix finite $d\geq2$. Write
$\mathcal A_d$ for the full subcategory of $\mathbf{FI}_d$-modules presented in
finite degree. The theorem candidate constructs a morphism

$$
\pi:F\longrightarrow Q
$$

with $F,Q\in\mathcal A_d$ that has no kernel in $\mathcal A_d$.

For the principal free module $M(m)$, exact symmetric-group coinvariants give

$$
\Phi(M(m))\cong R(-m),\qquad R=k[x_1,\ldots,x_d].
$$

The paper also proves the relative-free extension
$\Phi(M(W))\cong R(-m)\otimes_k W_{\mathfrak S_m}$. Thus any finite-degree
presentation forces $\operatorname{Tor}_1^R(k,\Phi(V))$ to be supported in a
bounded set of internal degrees.

Using colors one and two, the $r$th block specializes to

$$
A_r:R(-1)^{r+1}\longrightarrow R^r,
\qquad (A_rw)_i=x_1w_i+x_2w_{i+1}.
$$

Its first-syzygy module has rank one, generated up to a unit by

$$
\bigl((-x_2)^r,\ x_1(-x_2)^{r-1},\ \ldots,\ x_1^r\bigr),
$$

in internal degree $r+1$. The direct sum of all block images therefore has
first Tor in arbitrarily high degrees. This excludes the ambient kernel from
$\mathcal A_d$. Principal representables detect pointwise nonzero elements;
Yoneda makes any putative internal kernel ambient-monic, while every finite
block factors through it. The putative kernel is forced to equal the excluded
ambient one.

## Technical account

For a color $c$, precomposition by the one-point colored morphism gives
$\alpha_c:M(1)\to M(0)$. Under $\Phi$, this becomes multiplication by $x_c$.
Form the bidiagonal natural transformation

$$
D_r=
\begin{pmatrix}
\alpha_1&\alpha_2&0&\cdots&0\\
0&\alpha_1&\alpha_2&\ddots&\vdots\\
\vdots&\ddots&\ddots&\ddots&0\\
0&\cdots&0&\alpha_1&\alpha_2
\end{pmatrix}
:M(1)^{r+1}\to M(0)^r.
$$

Set $D=\bigoplus_{r\geq1}D_r$, with source $E$ free in degree one and target
$F$ free in degree zero. Let $K=\operatorname{im}D$ and $Q=\operatorname{coker}D$.
Then $Q$ has degree-zero generators and degree-one relations, so both $F$ and
$Q$ lie in $\mathcal A_d$. The ambient kernel of $F\to Q$ is $K$, generated in
degree at most one.

Put $I_r=\operatorname{im}A_r$. Coprimality of $x_1$ and $x_2$ turns the row
relations $x_1w_i+x_2w_{i+1}=0$ into a divisibility induction, proving the
rank-one kernel formula. Hence

$$
0\longrightarrow R(-(r+1))\longrightarrow R(-1)^{r+1}
\longrightarrow I_r\longrightarrow0
$$

is minimal and $\operatorname{Tor}_1^R(k,I_r)\cong k(-(r+1))$. Since $d$ is
fixed and finite, the finite-rank Koszul resolution of $k$ commutes with direct
sums, giving

$$
\operatorname{Tor}_1^R(k,\Phi(K))
\cong\bigoplus_{r\geq1} k(-(r+1)).
$$

That is incompatible with a finite-degree presentation of $K$.

The categorical finish is essential. If $L\to F$ were a kernel internal to
$\mathcal A_d$, maps from the representables $M(n)$ would show that $L\to F$ is
pointwise injective, so $L\subseteq K$. Each finite block $K_r$ is finitely
generated and, by local noetherianity, lies in $\mathcal A_d$; kernel
universality forces every $K_r$ into $L$. Therefore $K\subseteq L$, a
contradiction.

## Evidence and assurance

The mathematical proof is carried by the seven-page manuscript. The package
adds two exact but producer-controlled implementations: Python checks the
displayed Toeplitz identity through $r=128$, and Singular computes the syzygy
module independently through $r=16$. A second Python program enumerates 45
small orbit cases and 1,899 transition cases to test the
$\mathbf{FI}_d$-to-polynomial encoding.

Normal and optimized Python runs execute the same explicit conditions—no
verifier uses an `assert` that optimization could erase. Hostile controls alter
sign, column order, degree shift, or color. The replay harness also rejects a
known Singular hazard: an error diagnostic accompanied by exit status zero.

The final PDF was built twice to identical bytes, checked for citation-key
equality, embedded subset fonts, extractable markers, a clean TeX log, no
JavaScript or encryption, and inspected across all seven rendered pages. The
53-file manifest, public Ubuntu CI, GitHub release and Zenodo record expose the
same release object.

The supplied review required a direct comparison with the closest published
antecedent, corrected attribution, disaggregated assurance, assigned human
publication accountability, and a portable build route. All were actioned;
one bounded confirmation found no new critical issue. The supplied review's
identity and independence are not authenticated, so it is not counted as
external specialist review or an independent rerun.

## Limitations and assurance boundary

Characteristic zero is load-bearing: coinvariants under finite symmetric
groups are exact there. The paper makes no positive-characteristic conclusion.
The example uses infinitely many free summands of uniformly bounded object
degree; it does not give a finitely generated counterexample and does not
conflict with local noetherianity.

Python and Singular check formulas and finite encodings, not the universal
proof. Both remain within one producer-coordinated workflow. Independent
reconstruction, formal verification, authenticated specialist review and
journal peer review are not assessed. Linux CI demonstrates portability but
the toolchain is not hermetic or fully version-locked, so environment
reproducibility is partial.

A bounded literature search found no exact fixed-finite-$d$ Toeplitz proof, but
that is not a novelty or priority determination. The release makes no claim to
being first or previously unknown.

## Relationship to earlier work

Ramos develops the $\mathbf{FI}_d$ framework and the exact characteristic-zero
specialization used here, building on Sam and Snowden's Gröbner-category and
local-noetherianity theory. Ramos separately proves that finite-degree-presented
$\mathbf{FI}_G$-modules form an abelian category. Gan and Li prove positive
results for suitable finite product categories and explicitly leave the
$\mathbf{FI}_d$ case outside their method.

The closest published antecedent is Di, Li and Liang, *Journal of Algebra* 666
(2025), Example 3.6. It already uses a countable direct sum to combine bounded
generator degree with unbounded relation degree under a sum norm. Its category
has countably many object coordinates and prime-indexed supports. This
candidate instead fixes finite $d$, uses two colors, obtains explicit
finite-variable Toeplitz matrices from exact symmetric-group coinvariants, and
closes the internal-kernel question with Yoneda. The contribution is this
fixed-$d$ realization and proof, not priority for the broad mechanism.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Representation-stability researchers | A direct answer to the fixed-$d$ characteristic-zero coherence question | Positive characteristic remains open |
| Category theorists | A concrete example where representables expose failure of an internal kernel | Ambient non-closure alone would not suffice without the Yoneda step |
| Commutative algebraists | A transparent direct sum of minimal Toeplitz resolutions with unbounded first Tor | The polynomial functor is used only as a one-way obstruction |
| Computational reviewers | Small exact Python and Singular checks with hostile controls | Both implementations are producer-controlled |
| Formalizers | A short dependency chain from coinvariants to Tor and Yoneda | Cited structural results and infinite direct sums must be formalized carefully |
| Interested readers | A vivid example of uniformly simple pieces producing a globally unbounded obstruction | Candidate publication is not field consensus |

## Why the problem matters

Representation stability works by organizing sequences of symmetric-group
representations as modules over combinatorial categories. Good finiteness
properties make kernels and cokernels controllable, allowing homological
arguments to stay inside a manageable class.

This example pinpoints a boundary. Fixed-$d$ local noetherianity controls each
finitely generated block, yet presentation in finite degree permits countably
many bounded-degree summands. The Toeplitz family makes the hidden relation
degree grow with the block index. It shows that local control and
degree-wise coherence are genuinely different phenomena and supplies a simple
test pattern for other categories with polynomial specializations.

## How to inspect or reproduce the checks

Use immutable tag `v0.1.0-candidate` or version DOI
`10.5281/zenodo.22306413`, not moving `main`.

```sh
python3 replay.py
```

For component diagnosis:

```sh
python3 verification/verify_toeplitz.py --max-r 128
python3 -O verification/verify_toeplitz.py --max-r 128
Singular -q verification/verify_toeplitz.sing
python3 verification/verify_fid_coinvariants.py --max-n 5 --max-d 3
python3 -O verification/verify_fid_coinvariants.py --max-n 5 --max-d 3
python3 -m unittest discover -s tests -v
```

The composite command also rebuilds and preflights the manuscript and verifies
the manifest. A successful run checks package integrity and encoded exact
consequences; it does not independently prove the universal theorem.

## The most valuable next projects

1. Reconstruct the coinvariant, Tor and internal-kernel arguments under
   authenticated unaffiliated specialist review.
2. Determine whether another exact functor or modular method yields a
   positive-characteristic obstruction.
3. Formalize the proof, including the infinite direct-sum and Yoneda steps, in
   a proof assistant.
4. Classify useful subclasses of finite-degree-presented $\mathbf{FI}_d$-
   modules that remain closed under kernels and cokernels.
5. Conduct a broader specialist novelty and priority assessment centered on
   the relation between this construction and Di--Li--Liang Example 3.6.

## What is in the evidence package

The ZIP contains the DOI-bearing PDF and LaTeX source, accessible Markdown,
claim and assurance maps, Python and Singular checks, hostile controls, replay
tests and receipts, source/citation/novelty audits, the full supplied review and
response, producer-coordinated internal reports, one bounded confirmation,
environment and licence declarations, and a complete deterministic manifest.

The frozen PDF has SHA-256
`21deed75f975e38a6b6cd87fcd1a59d90bf40a4d9674761ce938d15ff9a0e0fa`.
The frozen ZIP has SHA-256
`e915cebd8219cd9b04e6a603b142153b113c82c8675fa54f0962b26e9fac414b`.
The version DOI is the citation target. Any mathematical correction should be
released as a versioned successor rather than silently replacing this record.
