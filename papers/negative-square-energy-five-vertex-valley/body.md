## Summary

Imagine adding every missing edge to a connected graph, one at a time, until
the graph is complete. At each step, measure the total squared size of the
negative adjacency eigenvalues. A natural conjecture says this sequence should
rise to one peak and then fall.

This anonymous, unrefereed candidate gives the smallest possible strict local
valley. On five vertices, one edge addition lowers the negative square energy
from $5$ to less than $3697/784$, and the next raises it back to $5$. No
connected graph on at most four vertices can do this.

The order quantifier is decisive. The result disproves the statement that
**every prescribed order** is peak-unimodal. It does not disprove the weaker
possibility that every starting graph has some favourable order, or that every
target graph can be reached along one. In fact, the same starting tree has an
exactly certified favourable order.

## Summary for specialists

For a finite simple graph $G$ with adjacency eigenvalues $\lambda_i$, let

$$
S^-(G)=\sum_{\lambda_i<0}\lambda_i^2.
$$

The candidate distinguishes three formulations: universal peak-unimodality for
every connected $G$ and every missing-edge order; existence of a favourable
order for each starting graph; and existence of a favourable tree order that
passes through each prescribed target graph. It refutes only the first.

With vertices $\{u,v,a,b,c\}$, take

$$
E(F_0)=\{ua,ub,uc,va,vb\},\qquad e_1=uv,\qquad e_2=vc.
$$

Then

$$
S^-(F_0)=5>S^-(F_0+e_1)<S^-(F_0+e_1+e_2)=5,
$$

and exact rational root bounds give
$S^-(F_0+e_1)<3697/784<5$. A structural case split excludes all connected
graphs through four vertices. Exhaustive exact enumeration finds $840$
labelled five-vertex ordered valleys in exactly nine orbits under simultaneous
vertex relabelling with the addition order retained.

## Technical account

The witness has a compact hand proof. The graph $F_0$ is bipartite with five
edges, so spectral symmetry and $\operatorname{tr}(A^2)=10$ give
$S^-(F_0)=5$. For $F_1=F_0+uv$,

$$
\det(xI-A(F_1))=x(x^4-6x^2-4x+2).
$$

Four exact sign evaluations isolate the two negative roots. Descartes' rule
shows there are no others, and their rational intervals prove the strict upper
bound $3697/784$. Adding $vc$ gives characteristic polynomial

$$
x^2(x-3)(x+1)(x+2),
$$

so the endpoint negative square energy is again $5$.

To put the valley at positive indices, start from the tree
$H=F_0-ub$ and add $ub,uv,vc$. Yet the same $H$ also has the favourable full
order

$$
ub,vc,uv,ab,ac,bc,
$$

whose energies follow

$$
4<5<6>5>S^-(J_4)>S^-(J_5)>4.
$$

The exact verifier certifies

$$
\frac{241}{50}<S^-(J_4)<\frac{483}{100},\qquad
\frac{1177}{250}<S^-(J_5)<\frac{471}{100}.
$$

That paired example is the cleanest explanation of the claim boundary: one bad
order refutes the universal statement, while one good order for the same tree
shows why the existential questions remain open.

## Evidence, assurance and limitations

The package includes the five-page manuscript and source, an accessible
Markdown rendering, exact Python/SymPy enumeration, a dependency-free
JavaScript witness checker, a producer-generated census record, four semantic
mutations, claim and source maps, novelty and citation audits, internal review
records, a response to the supplied full review, replay receipts, licences, and
a complete SHA-256 manifest.

Normal and optimized Python runs reproduce $728$ connected labelled
five-vertex graphs, $11{,}460$ ordered two-edge sequences, $840$ strict valleys,
and nine orbits. The JavaScript checker independently encodes the principal
witness within the same producer workflow. The four mutations corrupt the
labelled total, an orbit representative, a characteristic polynomial, and the
favourable edge order; all are rejected.

The supplied review reports a successful replay in a different Linux
environment and a separately written numerical enumerator reproducing the
headline counts. That is useful corroboration, but the reviewer identity,
environment receipt, and implementation were not authenticated here. The
release therefore does not upgrade unaffiliated rerun or independent
reimplementation from `not-assessed`.

The release also does not establish historical priority, proof-assistant
formalization, external specialist review, journal peer review, or either
favourable-order existential formulation. The finite census is separately
recomputable by exhaustive producer replay; its JSON record is not a standalone
completeness proof.

## Relationship to earlier work

Abiad and collaborators had already shown that adding one edge can decrease
negative square energy. Tang, Liu and Wang developed perturbation bounds for
positive and negative $p$-energies and found positive-energy monotonicity
counterexamples in a different range. The contribution here is the exact
decrease-then-increase valley, its vertex-minimality, and the complete
five-vertex classification.

The broader lower-bound conjecture for positive and negative square energy was
proved in a July 2026 preprint by Liu, Tang and Zhang. The five-vertex valley is
compatible with that theorem because its middle energy remains above $4$.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Spectral graph theorists | A minimal obstruction and complete five-vertex test bed for edge-addition questions | Check the order quantifier and do not infer an existential counterexample |
| Computational reviewers | Small exact instances, orbit representatives, rational intervals, and hostile mutations | Reimplement independently rather than importing the producer enumerator |
| Formalizers | A short witness proof and four-vertex case split | The exhaustive five-vertex classification still needs a formal enumeration bridge |
| Research agents | A worked example of source-quantifier repair and claim-level assurance | Producer replay and internal review are not external validation |
| Interested non-specialists | A concrete example showing that graph energy can dip and recover | Candidate publication is not field consensus or peer review |

## Why the problem matters

Unimodality is a strong global regularity claim: it says a statistic cannot
reverse direction twice along an edge-addition path. A minimal strict valley
pinpoints exactly where that regularity first fails and supplies a finite
laboratory for corrected conjectures. The paired bad and favourable orders also
show why quantifiers over construction paths are mathematically substantive,
not merely wording choices.

## How to inspect or reproduce the recorded checks

Use candidate tag `v0.2.0-candidate` or the Zenodo version DOI, not the moving
`main` branch. From a fresh extraction with Python 3.11 or later, SymPy 1.14.0,
and Node.js 20 or later, run:

```sh
python3 verify_exact_census.py
python3 -O verify_exact_census.py
node verify_witness.mjs
python3 tests/test_mutations.py
```

The expected markers are `PASS_EXACT_CENSUS`, `PASS_EXACT_WITNESS`, and
`PASS_MUTATION_CONTROLS`. Successful execution confirms the declared predicates
in the released code; it does not establish novelty, independence, or peer
review.

## The most valuable next projects

1. **Starting-graph existence.** Prove or refute that every connected graph has
   at least one peak-unimodal full missing-edge order.
2. **Target-passing existence.** Determine whether every target graph lies on a
   favourable full order beginning from one of its spanning trees.
3. **Independent exact reconstruction.** Reimplement the five-vertex census in
   SageMath, PARI/GP, or another materially separate stack.
4. **Formalization.** Formalize the witness, four-vertex minimality proof, and
   finite orbit classification in a proof assistant.
5. **Specialist priority audit.** Search discipline-specific indexes and
   differently phrased graph-energy literature for the exact valley and
   nine-orbit classification.

## What is in the evidence package

The immutable release includes the canonical PDF and LaTeX, abridged Markdown,
proof and claim maps, exact verifiers, generated census record, mutation tests,
source and literature receipts, internal and supplied-review response records,
research metrics, licences, replay receipt, and SHA-256 manifest. The version
DOI is the citation target; any correction should be a versioned successor, not
a silent edit.
