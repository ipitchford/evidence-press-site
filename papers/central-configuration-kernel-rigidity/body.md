## Summary

A central configuration is a gravitational arrangement with a special balance: every body's acceleration points towards the centre of mass, with the same proportionality factor. Finding all such shapes becomes difficult as the number of bodies grows.

This methods candidate studies a smaller reconstruction problem inside that search. Given a proposed space associated with a force matrix, find the best positive-semidefinite metric on it. Classical convexity tells us the answer is unique. But **unique reconstruction is not the same as a central configuration**.

The new seven-body examples make that distinction concrete. Across each of two whole parameter boxes, the optimum places all seven bodies on a line, yet its forces fail the central-configuration equations. Exact inequalities therefore reject every proposed complete force kernel in those boxes—not just the midpoint. The paper also gives quantitative reconstruction bounds and larger neighbourhoods excluding higher-dimensional configurations near specified lower-dimensional ones.

The result is a set of certifiable search tools. It is not a complete catalogue of planar eight-body or spatial seven-body configurations.

## Summary for specialists

For equal masses and central multiplier one, let $B=QQ^T$ be centered, $J=I-\mathbf1\mathbf1^T/n$, and $\Omega(B)=L(B)-J$, where the complete-graph Laplacian uses weights $r_{ij}^{-3}$. The normalized force equations are equivalent to $\Omega(B)Q=0$.

The classical fixed-support convex framework implies that the complete stress kernel determines a normalized central Gram matrix. The quantitative refinement offered here is

$$\|B-C\|_F\le K_{BC}\,\|P_B-P_C\|_{\rm op},$$

where

$$K_{BC}^2=\frac{D^5}{3}(W_BI_C+W_CI_B),$$

when all distances are at most $D$, with $I_B=\operatorname{tr}B$, $W_B=\|\Omega(B)\|_{\rm op}$ and $P_B$ the complete-kernel projector. No positivity of nonzero stress eigenvalues is assumed. Different projector ranks have distance one, so this is not small-distance control across kernel-dimension changes.

For spatial seven-body configurations, support dimensions $k=3,4,5$ give $20+15+6=41$ bounded charts, with at most nine outer variables. The singular branches are retained. Exact certificates exclude one eight-dimensional $k=4$ box and one five-dimensional $k=5$ box, each of half-width $2^{-34}$. Throughout both boxes, the unique closed-PSD optimizer has rank one and nonzero restricted slack; neither support is realizable as the specified complete kernel.

## Technical account

For a centered full-column-rank chart matrix $X$, write $v_{ij}=X_i-X_j$, set

$$U_X(A)=\sum_{i<j}(v_{ij}^TAv_{ij})^{-1/2},$$

and minimize

$$\phi_X(A)=U_X(A)+\tfrac12\operatorname{tr}(X^TXA)$$

over $A\succeq0$.

The objective is strictly convex on its collision-free domain. Its semidefinite-constrained dual has slack $S=X^TX-\sum u_{ij}^3v_{ij}v_{ij}^T$. A scalar factorization gives a nonnegative primal–dual gap and explicit reconstruction-error bounds. Cone optimality is classical; the contribution is the quantitative formulation and its executable certificates.

The singular-box certificate first minimizes a strictly convex ordered collinear problem. Its Hessian dominates the identity because the chart contains identity pivot rows. A gradient residual encloses the minimizer uniformly over the outer box. Exact interval positivity then proves positive slack on the complementary directions, promoting the collinear solution to the unique optimum over the **full PSD cone**. The basis-dependent restricted slack margin exceeds $1/64$; this is not a global physical-stress spectral gap. A separate nonzero-force bound certifies noncentrality.

Reconstruction alone still does not establish centrality or an exact complete kernel. Both must be checked explicitly. This is precisely the logical separation illustrated by the singular examples.

## Evidence, assurance and limitations

The current exact runner has twelve stages. Its corpus includes 54 isolated force roots, 54 metric reconstructions and parameter patches, 471 within-target/boundary orbit distinctions, 15 higher-rank exclusion regions, and the two whole singular boxes. These counts describe different certificate obligations; they are not counts of newly discovered configurations.

The fifteen exclusion regions permit horizontal coordinate displacement $1/2048$ and transverse row norm $1/8$, with a separate graph-Laplacian margin $1/16$. Their interpretation around exact boundary roots uses inherited local-root certificates. Together with the external complete planar-seven classification, they give the stated seven-body no-flattening consequence. The eight-body collinear obstruction has a classical spectral antecedent; the explicit neighbourhood size is the quantitative addition.

A supplied alternative implementation used different interval arithmetic and positivity tests for selected cap and singular certificates and was replayed. Its provenance is not authenticated as unaffiliated reproduction or institutional review. The mathematical arguments and Python checkers remain unformalised.

There is no complete chart subdivision, global thickness constant, finiteness theorem for the target sets, exhaustive singular-branch treatment or measured solver speedup. The two target inventories remain certified lower bounds of twenty. Failure to certify a larger neighbourhood means only that the sufficient test was inconclusive.

## Relationship to earlier work

Yoccoz's affine reduction and Albouy's fixed-support formulation are decisive antecedents: strict convexity, unique ambient reconstruction and the qualitative rigidity mechanism are classical. Their ambient positive-distance domain is larger than the PSD metric cone; a stationary ambient metric need not describe a physical configuration. The paper's attribution was corrected after these sources were identified.

Chenciner reconstructs from a full force operator. Dias organizes actual stress-rank strata through a complete-kernel Grassmannian invariant. Moczurad–Zgliczyński supplies complete smaller classifications and the planar-seven boundary catalogue used here. These roles are distinct from the present quantitative bounds and whole-box certificates. A targeted source comparison found no exact antecedent for the entire remaining package, but does not establish historical priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Celestial mechanicians | Audit quantitative support reconstruction and dimensional-boundary exclusions | Keep fixed masses, normalization and completeness premises explicit |
| Validated-numerics researchers | Reuse a whole-parameter-box PSD optimality and rejection mechanism | The restricted slack margin depends on the chosen basis |
| Mathematical optimization researchers | Examine a singular optimum that does not satisfy the underlying force problem | KKT sufficiency is not a substitute for the outer equations |
| Computational proof researchers | Challenge the semantic bridge and exact arithmetic implementations | Producer replay is neither formal verification nor authenticated independence |

## Why the problem matters

Reducing a search is useful only if the reduced problem preserves every relevant case and rejects false solutions for a valid reason. Singular metrics are an important test: discarding them would lose possible exceptional stress ranks, while accepting every constrained optimum would admit noncentral shapes. The certificates show how to retain these cases and still make rigorous, bounded exclusions.

## How to inspect or reproduce the recorded checks

Start with the linked archive's `AI_INDEX.md`, claim ledger, current status and source audit. Use a fresh extraction and run:

```sh
python3 -S reproduce.py --output ../fresh_exact_replay
```

The current receipt must report all twelve exact stages; earlier eleven-stage receipts are historical. The singular verifier is also directly runnable:

```sh
python3 -S code/verify_singular_fibres.py --power 34 --output ../singular_replay.json
```

Its proof gates are explicit and optimized Python is deliberately rejected. The optional numerical diagnostics are not proof premises. Compare the manifest before interpreting results, and distinguish the finite certificate replay from the analytic arguments linking those certificates to the scientific claims.

## The most valuable next projects

The strongest practical next test is a complete smaller benchmark in the reduced coordinates, accounting for every subdivision leaf and comparing fairly with direct coordinates. A broader treatment of zero-slack singular fibres would address cases these positive-slack exclusions cannot reject. An explicit global spatial-seven thickness bound remains another separate challenge. None is needed to reinterpret the present two boxes as a global result.

## What is in the evidence package

| Item | Purpose |
|---|---|
| Manuscript and explicit proofs | Definitions, quantitative estimates, hypotheses and classical attribution |
| Root data, metric certificates and parameter boxes | Exact finite evidence with stated geometric meaning |
| Twelve-stage runner and rejection controls | Reproducible checks with an explicit implementation trust boundary |
| Source audit, assurance records and manifests | Antecedents, limits, provenance and exact file identity |

Original prose, diagrams and data use CC0-1.0; original code uses MIT. Third-party material retains its own terms. The briefing and art explain the research and are not additional scientific evidence.
