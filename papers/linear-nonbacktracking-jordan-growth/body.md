## Summary

A walk on a network is non-backtracking if it never immediately reverses its
last edge. The matrix counting these walks can have Jordan blocks: chains of
generalized eigenvectors that are invisible in a list of eigenvalues alone.
How large can those blocks become?

This unrefereed candidate supplies a constructive answer: their largest possible
size grows linearly with the number of graph vertices. The result persists under
one fixed maximum-degree bound. It concerns extremal **counting** matrices, not
typical networks or normalized random-walk transition matrices.

## Summary for specialists

Let $f(n)$ be the maximum complex Jordan-block size of $B_G$ over finite simple
undirected $n$-vertex graphs without degree-one vertices, with
$(B_G)_{(u,v),(x,y)}=1$ exactly when $v=x$ and $u\ne y$. For every $n\ge3$,

$$
\max\left\{1,\left\lfloor\frac{n-1}{131072}\right\rfloor-3\right\}
\le f(n)\le2n.
$$

Thus $f(n)=\Theta(n)$. If maximum degree is at most $393217$, the lower bound
is still $\max\{1,\lfloor n/12714016\rfloor\}$. Long blocks occur at
$\lambda=\pm512i$. Lower-bound graphs are connected and have minimum degree two.
The constants are not claimed optimal. This addresses AIM Problem 1.3(1), not its
separate Alon–Boppana question in part (2).

## Technical account

The upper bound uses the quadratic non-backtracking determinant identity and a
contraction argument excluding nontrivial unit-modulus Jordan blocks. For the
lower bound, a banded nilpotent matrix yields a quadratic pencil whose value at
$2i$ has a one-dimensional kernel. A separate determinant-valuation argument
forces growing algebraic multiplicity. Nilpotence at one point alone would not
justify that conclusion.

A four-dimensional rational representation of $\sqrt3$, followed by a fixed
integer scaling, produces integer adjacency weights and prescribed degree
action. Signed fibers and zero-valued vertices realize both actions in a simple
unweighted graph. An incidence intertwiner preserves the chain away from
$\pm1$. Padding on zero-valued vertices reaches every larger order; private
zero vertices give the fixed maximum-degree strengthening.

## Evidence, assurance and limitations

The arbitrary-parameter theorem rests on the written proof. Exact code checks
finite pencils, three fully enumerated small graph embeddings, published
defective examples, padding and deliberately corrupted inputs. New normal and
optimized replays cover even $r=4$ through $12$; a separate historical pencil
receipt reaches $r=20$. These are producer-side controls, not universal proof
certificates or independent reproduction.

The first full shared-zero graph already has **34,314,518,528 edges**. It is
represented by an edge-generating rule, not materialized. Internal AI editorial
review and the supplied review are not authenticated external specialist review.
Formal verification, exhaustive novelty and historical priority remain open.
No application benefit, typical-network frequency or optimal constant is claimed.

## Relationship to earlier work

Glover and Kempton supply the standard reduced-matrix framework. Heysse,
Lorenzen and Reinhart provide defective examples and chain-preserving graph
constructions: preserving a fixed chain is not itself a length amplifier.
Takata and colleagues construct high-order exceptional points for linear
Hamiltonians. The present graph-constrained quadratic pencil needs its own
valuation and realization argument. These distinctions identify the mechanism
being offered, not a certified historical first.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Spectral graph theorists | Inspect a proposed resolution of the Jordan-growth question. | The argument remains unrefereed and constants are not claimed optimal. |
| Matrix and pencil researchers | Reuse the valuation and signed-fiber construction. | Preserve dimensions, degree constraints and chain-transfer assumptions. |
| Research agents and tool builders | Replay exact finite controls and trace dependencies. | A passing implementation is not independent theorem validation. |

## Why the problem matters

Undirected adjacency matrices are symmetric and diagonalizable, but counting
non-backtracking matrices need not be. The candidate shows that graph structure
does not impose a universal small bound on their Jordan complexity. Even bounded
maximum degree does not recover the regular-graph bound of two. This is a
structural conclusion, not a measured improvement to network algorithms.

## How to inspect or reproduce the recorded checks

Download the versioned evidence ZIP, inspect its manifest, and follow its README.
With the pinned SymPy and optional performance backend installed, run
`python verify_research.py --max-r 12` and
`python -O verify_research.py --max-r 12`. Both should report
`PASS_PRODUCER_EXACT_CHECKS`. Start with the manuscript's dimension table and
source note before interpreting the nullity receipts. Do not enumerate the
enormous full-family graph.

## The most valuable next projects

The first priority is unaffiliated reconstruction of the all-parameter proof,
especially the valuation and degree-action embedding. Further work could reduce
the constants, determine exact extremal sizes, or find the smallest degree bound
supporting linear growth. Wider prior-art reconciliation and formalization are
separate assurance projects. None is supplied by publishing this release.

## What is in the evidence package

The package contains the eight-page PDF and Markdown proof, exact construction
and verification code, structured claims, a dated AIM source bridge, bounded
prior-art audit, review response, historical and new receipts, a complete
manifest, provenance and component licences. Original prose and data are CC0;
original code is MIT. Third-party source documents and supplied review files are
referenced or hashed, not silently relicensed. The archive, public repository
and replay routes are linked in the standard resource panel.
