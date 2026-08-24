## Summary

This release supplies one explicit connected cubic graph $G$ on 48 vertices for which

$$
\mu^*(G)=15<16=i(G).
$$

Here $\mu^*(G)$ is the minimum size of a maximal matching and $i(G)$ is the minimum size of an independent dominating set. The strict inequality makes this graph a counterexample to the proposed bound $i(G)\leq\mu^*(G)$ for regular graphs.

The earlier public Evidence Press candidate used 50 vertices. This child release lowers the known candidate-order upper bound to 48. It does **not** prove that 48 is the smallest possible order or that this graph is the only example at that order.

> **Candidate status:** Anonymous · unrefereed · explicit finite graph theorem · bundled deterministic replay passed · independent reconstruction, external specialist review, formal verification and editorial peer review not assessed.

## Exact result for specialists

The canonical graph is finite, simple, connected and cubic, with 48 vertices and 72 edges. The package gives a 15-edge maximal matching. Conversely, every maximal matching in a cubic graph edge-dominates the graph, and one matching edge is incident with at most five distinct edges. Therefore every maximal matching in this graph has at least

$$
\left\lceil\frac{72}{5}\right\rceil=15
$$

edges, proving $\mu^*(G)=15$.

An explicit independent dominating set has 16 vertices. A separate compressed proof tree excludes every independent dominating set of size at most 15, proving $i(G)=16$. Thus a cubic counterexample exists at order 48 and the minimum counterexample order is at most 48.

## How the certificate works

The checker stores a selected independent set $S$ and the vertices dominated by it. At each branch it chooses an undominated witness $w$. Every independent dominating extension must select a legal vertex in the closed neighbourhood $N[w]$, so the checker reconstructs and explores every candidate in $N[w]\setminus N[S]$.

A bound leaf is accepted only when the number of already selected vertices plus $\lceil r/4\rceil$ is greater than 15, where $r$ is the number of undominated vertices. The factor four is valid because a vertex in a cubic graph has a closed neighbourhood of size four. The canonical tree contains 437,188 nodes, 201,592 branches and 235,596 bound leaves.

The certificate stores branch witnesses rather than trusting stored candidate lists. The C++ generator is then rebuilt from source and must reproduce the normalized gzip certificate byte for byte. This separation is useful, but both programs remain products of one coordinated workflow.

## Evidence, replay and assurance boundary

The release cross-checks the JSON, edge-list and graph6 encodings; verifies the explicit matching and independent dominating set; reads the proof tree under ordinary and optimized Python; regenerates the certificate; and rejects eight targeted corruptions, including a bad leaf, invalid branch witness, truncation, trailing data, malformed header, duplicate edge and damaged explicit witnesses.

The final archive passes from a clean extraction. GitHub Actions repeats the workflow under Python 3.11 and 3.13. The GitHub prerelease and Zenodo record carry byte-identical copies of the source ZIP, two PDFs, review bundle and checksum ledger.

These checks establish availability, integrity and producer-side replay of the encoded finite claim. They do not establish an unaffiliated rerun, an independently authored implementation, end-to-end formal verification, external specialist review or journal peer review. The five-role reports are internal model-mediated quality control over a frozen archive, not independent human review.

## What is inherited and what is new

The public parent release presents a 50-vertex cubic counterexample and leaves the unrestricted search below 50 open. The present release supplies a different 48-vertex object, so it is a substantive child result rather than a correction or new version of the parent.

The new contribution is the smaller graph, its witnesses, its 437,188-node exclusion certificate and the resulting order-48 upper bound. The child does not retract the parent, and it does not inherit the parent's separate formula-graph identity or conditional threshold theorem for cubic graphs with a dominating induced matching. The 48-vertex graph lies in the non-DIM stratum recorded by the package.

Shared problem framing, provenance and certificate architecture make this a genuine research lineage. They also mean that the parent and child are not independent checks of one another.

## What the result does not establish

- It does not exclude counterexamples on fewer than 48 vertices.
- It does not prove global minimality at order 48 or uniqueness at that order.
- It does not establish first discovery, absolute novelty or secured priority.
- It does not make the checker independent merely because the generator is separately compiled.
- It does not turn internal model-mediated review, CI, hashes, DOI publication or public availability into independent mathematical reproduction.
- It does not claim formal verification, external specialist review, editorial peer review or scientific impact.

## Who should care, and why

| Reader | Potential use | Principal caution |
|---|---|---|
| Graph theorists | Inspect a smaller explicit counterexample and test the independent-domination exclusion argument. | The result is an unrefereed candidate and global minimality remains open. |
| Exact-computation researchers | Study a compact finite theorem object with a regenerated proof tree and semantic mutation controls. | The implementations share producer-side lineage. |
| TxGraffiti users | Update the public candidate-order upper bound from 50 to 48. | The child is separate from the parent's restricted-class theorem. |
| Formalization researchers | Use the graph, witnesses and tree grammar as a bounded target for proof-assistant work. | No formalization is included in this release. |
| General readers | See how one explicit object plus an exhaustive exclusion certificate can refute a universal inequality. | A public counterexample candidate is not peer-reviewed consensus. |

## How to inspect and reproduce the recorded checks

Download the immutable [v0.1.0 candidate release](https://github.com/ipitchford/txgraffiti-order48-successor/releases/tag/v0.1.0-candidate) or the [DOI archive](https://doi.org/10.5281/zenodo.22083656), then verify `SHA256SUMS.txt`.

After extracting the candidate ZIP, run:

```sh
./run_core_verification.sh
```

The command requires Python 3.11 or later, a C++20 compiler and `gzip`; no third-party Python package is theorem-critical. It checks all three graph encodings, both explicit witnesses, the proof tree in normal and optimized modes, byte-identical regeneration, eight negative controls, machine-readable claim boundaries and the internal manifest.

An independent mathematical audit should reconstruct the graph definitions, the $72/5$ matching lower bound, the branch exhaustiveness and the bound-leaf argument before relying on the supplied implementation.

## The most valuable next projects

1. Run the exact tagged package unaffiliated and publish a byte-bound replay receipt.
2. Write a separate checker from the certificate grammar and compare its verdict on the canonical tree and hostile mutations.
3. Commission a graph-theory specialist review of the matching proof, independent-domination search semantics and source-to-encoding bridge.
4. Perform an independently specified exhaustive or certified search below order 48.
5. Search broader graph databases and literature for equivalent objects while retaining the current no-priority ceiling.

## What is in the public package

The repository contains the canonical graph in three encodings, explicit matching and independent-dominating witnesses, compressed proof tree, checker, generator, eight mutation controls, manuscript, evidence supplement, machine-readable claims and assurance, provenance and literature records, internal review reports, licences, deterministic manifest, archive builder and CI workflow.

GitHub and Zenodo carry the exact candidate ZIP, manuscript PDF, evidence-supplement PDF, frozen internal-review bundle and checksum ledger. Original prose, structured claims and original data are CC0-1.0; original code is MIT; preserved source inputs retain their existing terms. Evidence Press art, Open Graph media, transcript, audio and thumbnail are communication aids rather than additional mathematical evidence.
