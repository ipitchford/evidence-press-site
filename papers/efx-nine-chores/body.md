## Summary

Sharing chores is harder than dividing nine jobs into three equal piles. A task one person dislikes may barely trouble another. This candidate establishes a precise guarantee: with three people and nine indivisible chores, some complete division always satisfies **envy-freeness up to any chore**, or EFX, when each person's costs add across chores.

The test uses each person's own assessments. Remove any one chore from your bundle; what remains must cost you no more than either other bundle. “Any” includes a chore that costs you nothing. This is stronger than being able to remove one conveniently chosen, especially unpleasant task. It does not promise equal workloads, truthful reporting or an optimal total cost.

## Summary for specialists

For three agents and nine chores, every matrix of nonnegative additive real costs admits a complete labelled allocation, with empty bundles allowed, satisfying

$$c_i(A_i\setminus\{g\})\le c_i(A_j)\quad(i\ne j,\ g\in A_i).$$

The deletion quantifier includes zero-cost chores. The proof uses ordinary eight-chore EFX existence, shared-cheapest insertion, a general minimum-lowering lemma, and an exact refutation over an unbounded 21-variable real domain. It assumes neither integral costs, common rankings nor an exogenous numerical ceiling.

## Technical account

Failure of an allocation is a strict linear inequality. Since there are finitely many allocations, a hypothetical counterexample can be perturbed to positive, rowwise-distinct costs without losing all its failure witnesses. If two agents share a cheapest chore, delete that chore, apply the eight-chore theorem and insert it using the cited matching argument.

Otherwise the three cheapest chores are distinct. Lowering one global minimum per row to zero leaves the owner's maximum deletion residual unchanged and can only lower comparison-bundle totals. Consequently any EFX allocation after lowering would already have been EFX before lowering. Relabelling and row scaling give the canonical domain.

Of the $3^9=19,683$ complete assignments, 18,150 have three nonempty bundles and contribute explicit failure clauses. A written positive-residual argument handles the other 1,533. The input audit reconstructs every retained failure literal, including 34,776 zero-deletion positions. Rational weighted sums establish arithmetic contradictions; reverse unit propagation combines them into an empty clause.

The supplementary integer representative bound of 2,566 per nonzero entry is based on classical determinant methods. It is **not** the search domain of the main theorem and is not needed for the refutation.

## Evidence, assurance and limitations

The evidence includes 370,780 checked arithmetic axioms and 172,146 Boolean deductions, plus the written semantic reduction. Fresh internal replay checks the original formula, its affine atoms, the logical trace and every admitted arithmetic axiom. Negative controls reject wrong signs, invalid multipliers, assumption injection and circular reasoning.

“Separate checker” means software separate from the producer. It does not mean an unaffiliated reproduction or an independently implemented second verifier. The supplied review recommended minor revisions; its authorship and independence are not established. The written proof, parser, verifier implementation and runtime remain trusted. There is no end-to-end formal proof or journal peer review.

## Relationship to earlier work

Zhang's version 2 establishes the eight-chore case in Theorem 1.2 and identifies nine chores as the next case in Section 6. Kobayashi, Mahara and Sakamoto supply the shared-cheapest insertion fact (full-preprint Lemma 4.2). The extension claimed here is the nine-chore result with its inspectable exact evidence—not the invention of EFX, minimum-bundle reasoning or computational fair division.

Counterexamples for four or more agents do not settle this three-agent question. Computational EFX results for goods are useful methodological comparators, but their deletion comparisons differ from those for chores.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Fair-division researchers | A bounded extension of the additive-chore existence frontier | Unrefereed; unrestricted chore counts remain open here |
| Verification researchers | A fully inspectable arithmetic/Boolean certificate with a separate semantic bridge | Exact replay is not formal verification of the whole argument |
| Designers of small allocation tools | A rational-input finder that returns explicit fairness comparisons | Additive cost elicitation and incentives are not validated |

## Why the problem matters

An existence theorem rules out the possibility that some allowed preferences defeat every allocation. That is different from demonstrating a few successful examples. The fixed nine-chore case is small enough to support exhaustive allocation finding, while its real-valued preference space is infinite. The proof bridges those two facts without discretising the original costs.

## How to inspect or reproduce the recorded checks

Start with the research repository's **AI_INDEX.md** and the complete release ZIP. The index identifies the exact SMT input, capture records, selected arithmetic multipliers and Boolean trace. Run the three-stage command in the paper with a fresh output directory; Python's standard library suffices. On macOS the unsupported address-space cap is explicitly not enforced.

Do not mistake the receipt binder for a replay: it checks consistency among existing receipts but executes no proof steps. For a quick practical check, run `python3 src/solve_efx9.py examples/costs9.json --out allocation.json`. The returned example has bundle sizes five, two and two and supplies all 18 original deletion comparisons. Equal numbers of chores are not required.

## What is in the evidence package

The scientific manuscript and editable sources; original exact proof objects and historical receipts; revised portable orchestration; allocation finder and worked example; adversarial controls; source-comparison and review-response records; component licence map; versioned manifests; and an agent-readable evidence index. Large proof streams are included in the downloadable archive. The banner illustrates the paper's worked example; audio is a communication aid, not additional evidence.
