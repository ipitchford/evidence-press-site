## Summary

Quantum measurements can be complementary in a precise sense: knowing the
outcome in one measurement basis leaves every outcome in another equally
likely. Such bases are called mutually unbiased. In six dimensions, three
mutually unbiased bases are known, but whether a fourth can exist remains open.

This candidate rules out one whole route to a fourth basis: the specified
two-parameter Szöllősi family of complex Hadamard matrices. It includes the
family's boundary and degenerate cases, not just sampled parameter values.
It does **not** settle the full six-dimensional problem.

The method separates finding possible solutions from checking them. A numerical
program proposes small regions containing candidate vectors. A separately
implemented checker must prove that those regions cover every relevant vector
and that they cannot form the two additional bases required for a quartet.

## Summary for specialists

The target is the closed two-circulant family
$S=\begin{pmatrix}A&B\\B^*&-A^*\end{pmatrix}$, with the specified unimodular
circulant blocks and Hadamard constraint. The claimed theorem excludes an MUB
quadruplet containing the standard basis and the columns of $S/\sqrt6$ for
every parameter in that family, including repeated-root boundaries.

This is Conjecture 3 in the programme of Matolcsi, Matszangosz, Varga and Weiner.
Their separate algebraic Conjecture 2 remains necessary for the proposed route
to the unrestricted three-basis maximum. A Fourier-family replay in the package
re-establishes the known Jaming–Matolcsi–Móra–Szöllősi–Weiner exclusion; it is
not presented as a new theorem.

## Technical account

After phase normalization, a vector unbiased to the standard basis has five
free phases. For each parameter cell, the generator proposes phase-space
boxes, called hulls, covering possible vectors unbiased to the Hadamard basis.
The checker uses outward-rounded interval arithmetic, modulus and mean-value
tests, and a parametric Krawczyk test to verify coverage.

A quartet would require twelve vectors forming two orthonormal six-element
bases. Verified separation prevents two of those vectors sharing a hull.
Possible orthogonality and unbiasedness relations therefore define a necessary
graph configuration: two six-cliques with all required cross-relations. Its
absence excludes the quartet. Extra possible edges make this test harder, not
easier. A hull need not contain exactly one isolated root.

The parameter cover distinguishes half-open ownership cells from their closed
interval enclosures. A boundary point has one canonical owner; the proof follows
that owner through subdivision. Merely showing that a discarded closed cell
touches the boundary would not establish a gap in coverage.

## Evidence, assurance and limitations

The certificate inputs comprise 14,658 Szöllősi and 1,935 Fourier parameter
certificates. These are certificate counts, not counts of distinct roots.
The revised driver binds replay receipts to the actual hulls, family, table,
checker and runtime, and rejects stale caches. The package also retains the
review findings, negative controls and the precise trusted-computing boundary.

Fresh local replay passed both complete covers. Of the Szöllősi boxes, 14,583
passed directly and 75 required fresh parameter subdivision: 38 to level 10,
29 to level 11 and 8 to level 12. No required box remained unchecked. The
versioned replay receipt binds the exact source, data, binary and environment;
historical success records were not imported into this run.

This is an unrefereed candidate. Implementation separation from the generator
does not establish unaffiliated reproduction or human peer review. The argument
is not formalized end to end in a proof assistant. Its larger-family extensions
remain research directions, not checked consequences.

## Relationship to earlier work

The broad discretisation strategy descends from the 2009 Fourier exclusion.
The contribution claimed here is the uniform exclusion for the specified
Szöllősi family and an inspectable hull-and-checker implementation. A recent
correction to an earlier exclusion argument makes it important to distinguish
a claimed theorem from a valid proof; it does not show that the theorem itself
is false. The source audit records that history without asserting exhaustive
novelty or priority clearance.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical quantum-information researchers | Inspect an explicit exclusion target in the dimension-six programme. | The unrestricted MUB problem remains open. |
| Computer-assisted-proof researchers | Reuse the separation of hull generation, interval coverage and graph obstruction. | Audit the family-to-checker semantic bridge. |
| Researchers studying degenerate solution sets | Examine a method that need not isolate every root. | Larger algebraic families require new encodings and branch coverage. |

## Why the problem matters

Dimension six is the first dimension that is not a prime power. It is a central
test case for understanding how arithmetic constrains complementary quantum
measurements. Excluding one continuous family reduces the available routes;
it does not yet deliver a new device or an experimentally validated advantage.

## How to inspect or reproduce the recorded checks

Start with `AI_INDEX.md` and `CERTIFICATE_INTERFACE.md`. Build the kernel, run
the normal and optimized regression tests, then execute `chk/full_replay.py`
with a new output directory. Preserve both complete-cover summaries and their
bound environment records. Graph checks alone are insufficient: phase-space
coverage is the computationally expensive obligation.

## What would improve assurance next

An unaffiliated full replay and a separate audit of the parameter-ownership,
interval-arithmetic and graph arguments would strengthen assurance. A
proof-assistant implementation is a further possibility, not something this
release supplies. Extending the method to larger families requires new verified
encodings and coverage of algebraic branches; it is not merely a data swap.

## What is in the evidence package

The manuscript and editable source; the hull proposals and unit-circle table;
the interval/graph checker; clean-replay orchestration; exact symmetry scripts;
boundary, stale-cache and mixed-term regressions; source comparisons; review
dispositions; provenance and licence boundaries; and an AI index for reuse.
