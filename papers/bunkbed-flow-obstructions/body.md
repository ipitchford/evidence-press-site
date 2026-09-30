## Summary

Imagine two identical networks, one above the other, with a link joining each vertex to its twin. If some links are randomly available, is a destination on your own layer always easier to reach than its twin on the other layer?

The original bunkbed conjecture said yes. Earlier researchers disproved it. This candidate asks what happens in a broader probability model, where a parameter called the **cluster weight** changes how strongly disconnected components are favoured.

The result singles out one exceptional value: **two**. In a specified window from about **0.7874 to 2.764**, it is the only cluster weight for which the inequality holds for every finite simple graph. Every other weight in that window has a counterexample, whatever common edge probability between zero and one is prescribed. The counterexample graph can change with both parameters.

## Summary for specialists

Let $\mathcal U_p$ contain those $q>0$ for which the homogeneous random-cluster bunkbed inequality holds on every finite simple base graph. The candidate establishes

$$\mathcal U_p\cap[\alpha,691/250]=\{2\}\qquad(0<p<1),$$

where $\alpha$ is the unique real root of $q^5-7q^4+19q^3-28q^2+26q-10$.

Its general transfer theorem converts a negative flow-polynomial value $F_\Gamma(q)<0$ for a connected loopless Eulerian multigraph and real $q>1$ into a finite connected simple **full**, homogeneous bunkbed counterexample at every prescribed interior $p$. The auxiliary multigraph is not the final counterexample.

## Technical account

The central link is an exact identity between a signed connectivity numerator and the flow polynomial of a cyclic word's transition graph. Long uniform fans turn that algebraic obstruction into a graph construction. Exact pendant integration then removes the conditioning on designated posts while retaining one common edge probability.

Different spectral regimes require different arguments. Thickened triangles handle $1<q<2$. An analytic complete-bipartite family and an overlapping exact circulant certificate handle $2<q\le2.764$. Below one, a second spectral limit yields polynomial positivity certificates. At $q=1$, a separate Jordan-mode calculation handles the eigenvalue collision. The positive result at $q=2$ is Häggström's prior theorem.

For a concrete size reference, at $q=0.9$ and $p=1/2$ the supplied base graph has 3,427 vertices and 3,555 edges; its full bunkbed has 6,854 vertices and 10,537 edges. The much larger $q=2.1$ construction is certified through analytic bounds and a generator, not by enumerating its full random-cluster state space.

## Evidence, assurance and limitations

The package separates written universal proofs from exact finite reconstruction and from model-assisted review. It includes deliberately corrupted inputs that the verifier must reject. A small standard-library checker certifies the cleared below-one identity on 234 integer points: explicit degree bounds make this an exact polynomial identity test, not numerical sampling.

The work remains an unrefereed candidate. Producer-coordinated implementation diversity is not authenticated independent reproduction, external human peer review or proof-assistant verification. The full parameter classification remains open, including integer $q\ge3$. Neither endpoint is advertised as a global transition. Minimal pendant counts apply only to the stated fixed-core construction.

## Relationship to earlier work

Hollom supplied hypergraph counterexamples; Gladkov, Pak and Zimin disproved ordinary bunkbed percolation. Ayyer, Linusson and Ravichandran report counterexamples for $0.56<q<1.43$, with discussion of full and unweighted extensions. Thus the new lower endpoint is **not** a numerical improvement over that earlier range. Its role is a direct all-$p$ component of the present construction.

The stronger structural contribution is the flow-polynomial transfer and the conclusions that two is the least universally valid cluster weight greater than one, and that universal validity is not upward closed. A version-specific objection to ALR's attachment lemma is documented separately; it does not refute their headline theorem.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Probabilists | A mechanism for constructing homogeneous random-cluster counterexamples | Audit the finite-to-asymptotic and conditioned-to-full bridges. |
| Graph-polynomial researchers | A use for negative Eulerian flow-polynomial evaluations | Auxiliary graph size is not final bunkbed size. |
| Certificate and verification researchers | Exact arithmetic, reconstruction and negative-test examples | Finite checks do not formalise the universal argument. |

## Why the problem matters

A symmetry-based intuition can hold at one parameter yet fail arbitrarily close to it. This work proposes an explanation through algebraic graph invariants, rather than a list of unrelated counterexamples. It is a result in mathematical probability, not an experimentally validated network-design rule.

## How to inspect or reproduce the recorded checks

Start with the repository's **AI_INDEX.md**, then the scientific paper and response to review. With Python, SymPy 1.14.0 and a C++17 compiler installed, run:

```sh
python3 code/check_below_identity.py
python3 -O code/check_below_identity.py --negative-control
python3 -O code/verify_release.py
```

The full verifier reconstructs the larger graph polynomials and core cubics. Its optional `--quick` mode checks stored large objects instead; the resulting assurance is narrower. Receipts identify that distinction explicitly.

## What is in the evidence package

The archive contains the manuscript and source, claim ledger, exact polynomial data, graph specifications and edge lists, verification code, negative controls, review response, provenance and licence map. The AI index maps each main claim to its argument, executable checks and limitations. Audio and graphics explain the work; they are not additional mathematical evidence.

## Next steps

An independent audit should first examine the real-parameter identity, spectral limits and exact post amplification, then replay the finite certificates. Wider parameter intervals and smaller witnesses are separate research questions: the current construction does not settle integer cluster weights at least three or globally minimise graph size.
