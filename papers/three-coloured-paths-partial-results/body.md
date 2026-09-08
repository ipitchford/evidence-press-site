## Summary

If a graph needs six colours on its vertices, must every three-colouring of its
edges contain a one-colour path with three edges? This release does not settle
that question. It supplies partial theorems, checked finite exclusions and
explicit examples showing why several proposed shortcuts fail.

The strongest written result handles a mixed class built from two collections
of small cliques and one collection of stars. Its five-colouring theorem works
at every order, under those precise hypotheses.

## Summary for specialists

TCP-MIXED-001: let $G=A\cup B\cup F$ be finite and simple, where every component
of $A$ and $B$ is a clique of order at most three and $F$ is a star forest.
Covering edges may overlap. Then $\chi(G)\le5$. Overlap is used in the local
replacement proof; the theorem does not allow arbitrary star/triangle mixtures
in all three covers.

For three edge-disjoint triangle factors, $\alpha(G)\ge n/3-1$ also implies
five-colourability. Separately, a critical counterexample of order fourteen is
excluded. The lower bound of fifteen vertices additionally assumes completeness
of an external critical-graph catalogue through thirteen. At fifteen vertices,
only component deficits zero and one are closed; edge counts 41, 42 and 43 remain.

Here the forbidden path is an ordinary subgraph on four distinct vertices,
not necessarily induced. The parent AIM-COMBINATORICS-0050 remains unresolved.

## Technical account

The mixed theorem turns the two clique covers into a bipartite incidence
multigraph. A minimal obstruction would have degree-five leaves. A local
four-clique replacement and the classical degree-choosability theorem force
their incidence graph to be a forest. Its incidence count contradicts the
number of star leaves.

The finite branches combine structural normalization, enumeration-coverage
checks and saved vertex-colouring witnesses. A partial-Latin-square repair
formulation gives a small-defect theorem, but retained counterexamples show
that an arbitrary starting colouring need not admit the proposed repair.

## Evidence, assurance and limitations

The package contains the full written notes, canonical claims, source
dependencies, portable replay and stopped-search records. Sixteen selected
checks and clean-extraction/hostile controls passed internally. Five
producer-coordinated editorial roles accepted the bounded release with minor
notes; this is not external specialist review or journal peer review.

Catalogue completeness was not regenerated. A timeout is not an exhaustion
certificate. No formal verification, historical priority or comparative research
acceleration is established. The supplied review's separate audit JSON was not
attached, so its reported checks do not promote an external assurance field.

## Relationship to earlier work

Garrison identifies the exceptional three-colour path case. Aharoni and
collaborators study the triangle-factor question and the known four-colouring
bound for three star forests. The release's possible originality concerns its
particular mixed theorem, reductions and obstruction objects, not those
antecedent formulations. Contribution-specific precedence remains open.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Graph-colouring researchers | Audit a reusable mixed-cover theorem and finite restrictions. | Preserve cover hypotheses and external dependencies. |
| Computational researchers | Reuse coverage checks and explicit repair obstructions. | Internal replay is not independent reconstruction. |
| Research-method researchers | Inspect failed routes and measured scoped checks. | No matched acceleration comparator exists. |

## Why the problem matters

Chromatic Ramsey questions ask how much vertex-colouring complexity forces
patterns in edge-colourings. Useful partial structure can narrow the problem
and prevent repeated false proof strategies without resolving the universal
question. No practical impact is claimed here.

## How to inspect or reproduce the recorded checks

Download the archive and read `CLAIM_RECORDS.md` before the historical notes.
With Python 3.11 or later, run `replay.py --bundle-root /path/to/bundle
--output-dir /path/to/fresh-output`. The output must be outside the bundle and
not already exist. The wrapper checks hashes and recreates the historical
layout in a copy; it does not edit the frozen evidence. Optimized Python is
rejected. `test_replay.py` exercises relocation and selected hostile inputs.

## The most valuable next projects

Independently scrutinize the mixed theorem's local lift and incidence count;
reconstruct finite normalization coverage; assess contribution-specific prior
art; and investigate an existential repair argument that survives the retained
fixed-start counterexamples. These are future projects, not claims of closure.

## What is in the evidence package

A consolidated PDF and accessible Markdown, all 21 original mathematical notes,
canonical claim/dependency records, code, finite certificates, CNF checkpoints,
replay receipts, internal editorial reports, licence map and file manifest.
Externally owned papers, catalogue data and upstream binaries are omitted from
the public successor with source links, hashes and reasons. The original private
review archive remains unchanged. GitHub and Zenodo identify the exact public
candidate version.
