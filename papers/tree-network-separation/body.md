## Summary

An evolutionary tree describes lineages that branch. A network also allows a lineage to have two possible parents. Could that extra connection disappear completely from the probabilities of the genetic patterns we observe?

For the four-leaf network studied here, the candidate gives a sharp obstruction. Arrange its four-state pattern probabilities into a matrix by placing two taxa on each side. Whichever of the three splits you choose, that matrix has rank at least **10**. A mixture of **two trees sharing one topology** has rank at most **8** on its shared internal split. Their complete probability distributions therefore cannot be equal.

The result applies to positive, invertible Markov transition matrices and a genuine mixture of the two parental routes. It permits much more variation along edges than a single shared GTR rate matrix. A second argument handles triangular cycles under the narrower homogeneous stationary reversible model.

These are exact distribution statements. They do not promise that a short genetic sequence will reveal a reticulation reliably.

## Summary for specialists

For a single-reticulation four-cycle with one observed attachment at each cycle vertex, write the deconvolved core as

$$C_{ijkl}=p_iS_{ij}T_{ik}\bigl(\gamma U_{jl}+(1-\gamma)V_{kl}\bigr),$$

where $p_i>0$, $0<\gamma<1$, and $S,T,U,V$ are positive invertible row-stochastic $d\times d$ matrices. Invertible pendant channels preserve the flattening ranks. The two displayed splits have rank $d^2$, while the third satisfies the sharp lower bound

$$\operatorname{rank}\operatorname{Flat}_{il\mid jk}(C)\geq\frac{d(d+1)}2.$$

Equality is attained when $S=T$, $U=V$ and $\gamma=1/2$. For $d=4$, the ranks are $16,16,\geq10$. A mixture of at most $\lfloor d/2\rfloor$ general Markov trees on any one common topology is excluded, because its shared-split rank is at most the number of classes times $d$. The common topology may be chosen freely; mixtures of different tree topologies are outside this corollary.

For a triangle evolving under one shared irreducible reversible generator at stationarity, with positive finite cycle lengths and an interior inheritance weight, the candidate excludes exact equality with any homogeneous stationary reversible tree when $d\geq3$, and also for binary chains with nonuniform stationary frequencies. The competing tree may choose its own generator and stationary frequencies. This covers four-state GTR. Marginalization extends the corresponding conclusions to single-reticulation networks with the required number of observable cycle attachments.

## Technical account

### Why the rank threshold detects an extra history

A tree's internal split separates its leaf groups through only $d$ hidden states. Its flattening therefore factors through a $d$-dimensional space. Adding $m$ tree classes on that same topology can raise the rank to at most $md$.

The four-cycle escapes that bound on every possible quartet split. Two flattenings factor into invertible matrices, so their rank is $d^2$. For the crossed split, an invertible change of coordinates exposes a diagonal subspace together with successive off-diagonal contributions of dimensions $d-1,d-2,\ldots,1$. Their total is $d(d+1)/2$. A symmetric family attains this bound, establishing sharpness.

The drawing above compares one four-state network with two trees of the same topology. Its **10 versus 8** labels are theorem bounds, not fitted ranks from an empirical dataset.

### Why triangles need a different argument

With a shared irreducible reversible generator at stationarity, a pair of leaves whose route avoids the reticulation identifies that generator up to time scaling. The remaining pair distributions mix two possible path lengths. If the generator has two distinct decay rates, strict concavity of a logarithmic mixture prevents those pairs from behaving like single tree paths simultaneously.

If all nonzero decay rates coincide, the model is equal-input (F81 for four states). Pair moments alone then leave less information, but a centered third moment separates the triangle from a tree. The paper keeps this case explicit rather than assuming a generic spectrum.

### From exact separation to a conservative statistical test

Fix $1\leq m\leq\lfloor d/2\rfloor$. For each quartet split, sum the squares of the singular values beyond the tree-mixture rank limit $md$, take the square root, then take the smallest of the three answers. Call this residual $R_m(P)$. It is a computable lower bound on distance from the distribution $P$ to the closure of the fixed-topology tree-mixture class. The sharp rank theorem makes it strictly positive at every network parameter point covered by the result. The residual is also 1-Lipschitz in the Euclidean distance between pattern-probability vectors.

This gives a conservative test under independent, identically distributed sampling. With $n$ sites, $K=d^4$ possible patterns and desired significance level $\alpha$, reject the tree-mixture model when

$$R_m(\widehat P)>\sqrt{\frac{K\log(2K/\alpha)}{2n}}.$$

A coordinatewise Hoeffding bound controls the false-positive probability by $\alpha$. At each fixed covered network distribution the test is consistent as $n$ grows. This does not establish useful power for realistic sequence lengths, or a positive separation margin uniform over parameters approaching model boundaries. The triangle analysis also gives pointwise positive distance from the relevant tree-model closure; the displayed singular-value test is the four-cycle construction.

## Evidence, assurance and limitations

The mathematical claim rests on written arguments. Exact symbolic identities and rational examples check formulas, sharpness witnesses and boundary behavior; finite tests do not establish the universal theorem by sampling. Coordinated agent audits provide internal checking, not authenticated external specialist review or independent reproduction.

Positive invertible cycle matrices and an interior inheritance weight are essential to the stated four-cycle result. The triangle argument needs stationarity, one shared irreducible reversible generator, positive finite cycle lengths and an interior inheritance weight. The symmetric binary model has an explicit mimic and is not covered by the all-parameter triangle separation result.

The candidate does not identify every network topology, reticulation direction or numerical parameter. It does not classify independently chosen reversible generators on triangle edges, multiple-reticulation histories, rate-mixture models or coalescent models. The network is itself a mixture of its two displayed trees, so the same-topology restriction on the mixture comparison is essential. The conservative test above provides a finite-sample significance bound and pointwise consistency, not a practical or parameter-uniform power guarantee. No priority claim follows from this release.

## Relationship to earlier work

The motivating work of Brits, Holtgrefe, van Iersel and Martin treats tree-network distinguishability and full identifiability under specified group-based models and identifies GTR as a broader question. This candidate fixes its model conventions explicitly and studies exact tree-network intersections. It does not claim to settle every interpretation of the broader GTR identifiability problem.

Triangle distinguishability in the four-state Jukes–Cantor special case is already known: see [Englander and colleagues, Proposition 2.26](https://doi.org/10.1101/2025.04.18.649493), and [Currie and colleagues, Theorem 3.1 and Appendix A](https://arxiv.org/abs/2606.26673v1). The reversible-chain argument here must be read as an extension in model scope, not discovery of that special case.

The use of flattenings, low-rank tree constraints and the $md$ mixture bound also belongs to earlier algebraic phylogenetics. [Sullivant's graphical-model treatment](https://arxiv.org/abs/2507.23056v2) gives universal edge-cut upper bounds and generic lower bounds. Generic statements permit exceptional parameter values; the result here controls every point satisfying its positivity and invertibility assumptions. A [July 2025 announcement, slide 23](https://cdn.imsi.institute/videos/59496/IKcB160s62/slides.pdf), attributes further generic rank bounds to Casanellas, Fernández-Sánchez, Gross, Hollering and Sullivant. The full announced manuscript was not located in the bounded literature audit, so its unpublished claims were not assessed.

Singular-value residuals are established tools in phylogenetic testing, including [Long and Kubatko's rank-condition tests](https://doi.org/10.3389/fgene.2021.664357). Here the sharp universal rank theorem supplies a pointwise positive residual against the specified mixture class; the statistical calibration uses a standard concentration inequality. The manuscript's theorem-level comparison distinguishes these inherited tools from the precise claims examined here.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Mathematical phylogeneticists | A sharp rank obstruction and explicit separation arguments to inspect or extend | The assumptions differ between four-cycles and triangles |
| Researchers comparing evolutionary models | A test of whether specified histories can agree exactly before estimating their parameters | Exact distinguishability is not finite-sample reliability |
| Algebraic statistics researchers | An attainable crossed-flattening bound and a limit on fixed-topology mixtures | Different-topology mixtures require another argument |

## Why the problem matters

If two model classes can produce exactly the same distribution, more observations alone cannot distinguish those particular histories. Establishing that their positive parameter spaces are disjoint removes that exact ambiguity within a specified model. It still leaves the statistical questions of sampling noise, model misspecification and how close the distributions may lie.

## How to inspect or reproduce the recorded checks

Start with the manuscript's definitions and theorem statements, then inspect the proofs of the displayed and crossed flattening bounds. For the triangle result, check both the multiple-decay-rate and F81 cases. The evidence package includes runnable exact checks, their retained receipts and the scope of the internal audits.

Run the package's documented replay command from a fresh extraction. Compare the output with the recorded receipt and examine the deliberately altered inputs used as negative controls. Passing those checks supports formula and implementation consistency; the written reduction from an evolutionary model to the tensor remains a separate object of review.

The portable Python replay needs no shared queue; optional queue notes in the frozen archive describe an earlier authoring setup.

## The most valuable next projects

1. Seek unaffiliated checking of the sharp rank proof and its precise network-model interpretation.
2. Determine the largest number of tree classes on one common topology that the network can exclude; different-topology comparisons need restrictions because the network already mixes its displayed trees.
3. Study edge-specific reversible generators on triangle networks, where the shared-generator logarithm argument no longer applies.
4. Study the power and numerical stability of rank-based detection at realistic sequence lengths, beyond the conservative significance bound.

## What is in the evidence package

The package supplies the mathematical paper and source, explicit claims and assumptions, exact symbolic and rational checks, reproducibility instructions, retained audit and negative-control evidence, a source-to-claim citation audit, and provenance and licensing records. Public archive identities and assurance states are recorded alongside the release so readers can inspect the exact version being discussed.
