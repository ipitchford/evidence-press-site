## Plain-English summary

Imagine a process that moves among ordered states while respecting the order:
starting higher should never make its future distribution stochastically lower.
If the process also runs the same way in equilibrium forwards and backwards, it
is natural to guess that the lowest and highest starting states are always the
furthest apart.

This anonymous, unrefereed candidate shows that the guess is false in general.
The example has four states arranged as a diamond: `00` at the bottom, `11` at
the top, and the incomparable middle states `10` and `01`. A random-scan
single-site heat-bath update uses Gibbs weights

$$
(1,\tfrac12,2,1).
$$

The resulting chain is irreducible, aperiodic, reversible and monotone. At
every positive integer time, however, the middle pair is further apart in
total variation than the bottom and top. The ratio is always exactly `4/3`.

Four states are also minimal: with a unique bottom and top, every poset on at
most three states is a chain, and monotonicity forces the extremal pair to
realise the row diameter.

## Exact result

In state order `(00,10,01,11)`, the heat-bath kernel is

$$
P=\begin{pmatrix}
1/2&1/6&1/3&0\\
1/3&1/3&0&1/3\\
1/6&0&2/3&1/6\\
0&1/6&1/3&1/2
\end{pmatrix},
$$

with stationary distribution `(2,1,4,2)/9` and spectrum
`1,1/2,1/2,0`. For every integer $t\ge1$,

$$
d_{\mathrm{TV}}\!\left(P^t(10,\cdot),P^t(01,\cdot)\right)
=\frac23\left(\frac12\right)^{t-1},
$$

whereas

$$
d_{\mathrm{TV}}\!\left(P^t(00,\cdot),P^t(11,\cdot)\right)
=\left(\frac12\right)^t.
$$

Each of the four adjacent pairs also has distance $(1/2)^t$. The incomparable
pair is therefore the unique maximiser at every positive time.

## Why the mechanism works

For the endpoint-symmetric family of weights `(1,b,c,1)`, put

$$
p=\frac{b}{1+b},\qquad r=\frac{c}{1+c},\qquad
B=\frac{p+r}{2},\qquad A=1-B,
$$

and $R=\max(p,r)$. Under the attractive condition $bc\le1$, the candidate
derives three exact distance modes:

$$
\text{extremal}=A^t,\qquad
\text{incomparable}=RB^{t-1},\qquad
\text{adjacent}=\frac{A^t+B^t}{2}.
$$

For `(b,c)=(1/2,2)`, both eigenmodes have base `1/2`, while the incomparable
mode starts at `2/3`. Its fixed leading advantage produces the all-time `4/3`
gap. Other parameters can switch maximiser: the package includes an exact
example where the middle pair leads through time 32 and the extrema lead from
time 33.

## What this does not settle

The AIM page places two questions close together. One asks about zero-field
ferromagnetic Ising Glauber dynamics on every graph. The next, more general
clause asks about any monotone reversible chain. This candidate negates the
general clause only.

The four-state example has opposing site-dependent external fields. It is not
a zero-field Ising example, and it says nothing decisive about all zero-field
graphs. It also does not answer AIM diagnostics 1.6(2) or 1.6(3).

## The bounded zero-field residue

The archive contains a separate exact screen over every connected labelled
simple graph with two through four vertices, five temperatures
`1, 3/2, 2, 3, 10`, and times one through six. The canonical receipt covers:

- 43 graphs;
- 215 graph-temperature trajectories;
- 1,290 kernel powers; and
- 140,340 unordered row-pair comparisons.

The extremal pair attained every tested diameter. That result is useful as a
regression fixture and a record of where no small counterexample was found. It
is finite evidence only, not an all-graph theorem and not evidence that the
zero-field statement is true.

## Evidence and assurance boundary

The public source package supplies the six-page proof, accessible Markdown,
exact rational verifiers, a separately structured producer cross-check, seven
semantic negative controls, deterministic PDF rebuilding, a complete SHA-256
manifest, source-correspondence and novelty reports, and producer-organised
five-role review with exact-byte confirmation.

A fresh extraction of the DOI-bearing ZIP passed all 18 release gates. The
tagged GitHub workflow passed on Python 3.11 and 3.13, each in normal and
optimized mode. GitHub and Zenodo copies of the PDF, ZIP and checksum ledger
match the reviewed local assets byte for byte.

These facts establish availability, integrity, producer-side replay and the
declared finite computations. They do **not** establish:

- independent rerun or independently authored reimplementation;
- proof-assistant formalisation;
- external Markov-chain specialist review;
- journal or comparable editorial peer review;
- exhaustive novelty or absolute priority; or
- resolution of the all-graph zero-field question.

The universal claims rest on the written proof. Successful code execution
checks its formulas and examples but cannot replace mathematical assessment of
its quantifiers.

## Relationship to earlier work

The source is AIM Problem 1.6(1). Nearby work studies censoring from extremal
configurations, comparison inequalities, two-component Gibbs samplers,
order-adapted metrics and coefficients of ergodicity. A formula-first search
found no matching four-state matrix, all-time distance sequences, `4/3` ratio
or family classification.

That search has a material gap. The closest 1992 coefficient-of-ergodicity
article by Pflug and Schachermayer was available only through its abstract,
bibliography and cited-by metadata, not full text. The elementary example may
also be known under different terminology or in informal circulation.
Accordingly, the release makes no claim to be new, first or historically
definitive.

## Who should care

| Reader | What is useful now | Principal caution |
|---|---|---|
| Markov-chain researchers | A minimal exact stress test for extremal-start intuition | Check the proof and prior art independently |
| Gibbs-sampler researchers | A complete two-spin family with explicit switch regimes | The permanent witness uses external fields |
| Software authors | A four-state regression fixture for row-diameter assumptions | Passing the fixture does not validate a general algorithm |
| Formalisers | A small rational kernel with short universal formulas | No proof-assistant development is supplied |
| Research-methods readers | A package that separates theorem, bounded screen, replay and review | Internal role separation is not external validation |

## How to inspect and reproduce it

Use tag `v0.2.0-candidate` or the Zenodo version DOI rather than the moving
`main` branch. Python 3.11 or later is sufficient for the exact verifiers:

```sh
python3 verify_two_spin_family.py
python3 -O verify_two_spin_family.py
python3 crosscheck_formulas.py
python3 -O crosscheck_formulas.py
python3 test_negative_controls.py
python3 -O test_negative_controls.py
python3 verify_zero_field_bounded.py
python3 -O verify_zero_field_bounded.py
./build_paper.sh
```

Then inspect `paper.md`, `CLAIMS.json`, `ASSURANCE.md`, `SOURCE_CORRESPONDENCE.md`
and `NOVELTY_REPORT.md`. The versioned manifest binds every release file.

## Most valuable next projects

1. **Zero-field theorem or counterexample.** Resolve the every-graph Ising
   question without extrapolating from the bounded four-vertex screen.
2. **Independent reconstruction.** Re-derive the kernel powers, family regimes
   and cardinality-minimality proof without importing the package formulas.
3. **Specialist prior-art audit.** Inspect the 1992 antecedent in full and
   search coefficient-of-ergodicity and binary Gibbs-sampler terminology.
4. **Formalisation.** Encode stochastic monotonicity, reversibility, row total
   variation and the three-state CDF argument in a proof assistant.
5. **Remaining AIM diagnostics.** Treat questions 1.6(2) and 1.6(3) as separate
   projects with their own quantifiers and assurance gates.

## What is in the public package

The immutable release includes the manuscript PDF and sources, accessible
Markdown, exact verifiers, mutation tests, claim and nonclaim registry,
environment record, replay receipt, operating-model and metrics records,
source and novelty audits, internal review reports, licensing files and a
complete checksum manifest. The
[v0.2.0 candidate release](https://github.com/ipitchford/extremes-do-not-always-maximise/releases/tag/v0.2.0-candidate)
and [version DOI](https://doi.org/10.5281/zenodo.22163995) are the pinned
inspection points.
