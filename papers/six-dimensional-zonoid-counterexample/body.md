## The result

The cross-polytope does not maximize the zonoid enclosure factor among all origin-symmetric convex bodies. This candidate gives a concrete counterexample in six dimensions:

\[
K=\operatorname{conv}\{\pm4e_1,\ldots,\pm4e_6,\pm(1,1,1,1,2,2)\},
\qquad \lambda(K)=\frac{122}{65}=\frac{15}{8}+\frac1{520}.
\]

Here \(\lambda(K)\) is the smallest factor \(t\) for which some zonoid lies between \(K\) and \(tK\). A zonoid is a Hausdorff limit of Minkowski sums of segments. The benchmark \(\lambda(C_6)=15/8\) is the value recorded in Schneider’s AIM question. The strict gap is small but exact; no floating-point tolerance enters the final certificate checks.

## Why the finite witness covers every zonoid

The lower witness supplies 64 rational signed-sum identities. Negation covers the remaining sign choices. These identities imply a support inequality for every generator direction, not just a sampled list. Summing over generators proves it for zonotopes; continuity of support functions extends it to every centered zonoid. Symmetrization preserves the required enclosure, so allowing translated zonoids does not evade the bound.

The matching upper witness contains 53 rational generators and a \(7\times53\) coefficient matrix. Exact vertex representations prove the inner inclusion. Exact support checks at every facet prove the outer inclusion. A second enumeration describes the polar as a clipped cube: 54 retained cube vertices plus 16 new edge intersections give 70 polar vertices, or 35 antipodal facet pairs.

## Evidence and replay

The linked paper contains the full argument and the nonzero lower weights. The evidence archive includes both rational certificates, standard-library Python checkers, historical discovery records and the review-response record.

```sh
python3 replay_review.py
python3 -O replay_review.py
python3 verify_polar.py
```

The replay rejects eight corrupted lower witnesses and eight corrupted upper witnesses, including surplus and missing coordinates. The polar checker verifies all 70 upper-support equalities. These rejection controls test the checkers; they are not substitutes for the written proof or external validation.

## What changed after review

The supplied review recommended minor revisions without identifying a fatal proof defect. This release adds explicit dimension checks, four corresponding rejection tests, a corrected accessible manuscript, related-work distinctions, the numerator calculation and the polar-body explanation. The supplied review’s separately linked audit ZIP was unavailable here, so its reported arithmetic checks are not counted as inspected independent reproduction.

## Scope and limitations

This is an unrefereed computer-assisted candidate. Producer replay and five internal model-assisted editorial reports do not constitute unaffiliated specialist review, independent reproduction or formal verification. A bounded search for the final object found no matching earlier example, but does not clear historical priority.

The result does not identify the largest factor in dimension six, the smallest counterexample dimension, a unique enclosure or the minimum possible generator count. It provides no measured application benefit or research-speed comparison.

## Context and next checks

Schneider’s support-function arguments are antecedents of the method. Henk, Linke and Wills study enclosures of a fixed cross-polytope; Siegel studies finite approximation of bodies already known to be zonoids. Neither formulation should be conflated with maximizing the enclosure factor over arbitrary symmetric bodies.

The next useful assurance steps are unaffiliated scrutiny of the universal support-function argument, independent reconstruction of the rational certificates and a broader contribution-specific priority assessment. Historical research-goal metrics are separately labelled in the archive. The publication attempt below measures only its prospectively registered assurance-and-publication scope.
