## Summary

Even perfect knowledge of DNA-pattern probabilities need not reveal whether an evolutionary history was a tree or a network. This candidate constructs a network with two reticulations—two places where a lineage has a choice of parental path—and an ordinary three-leaf tree that give exactly the same observations.

The equality holds for all 64 patterns, not merely for a summary statistic or a close numerical fit. Every edge in the main example follows continuous-time K2P mutation with transitions favoured over transversions. The rate ratio may differ between edges. Requiring both models to share one prescribed ratio changes the answer: this particular coincidence becomes impossible.

## Summary for specialists

In the uniform-root displayed-tree mixture model, the reduced trinet L2-1 has internal graph $K_{2,3}$ and an exact star-tree coincidence strictly inside $\Theta_{\mathrm{tb}}$. L2-0 and L2-2 also admit exact coincidences on the larger stochastic region $\Theta_0$, but their certified network edges are not continuous-time embeddable.

Anchoring at one leaf gives an all-level sufficient separation criterion. Among reduced level-three trinets, 30 of 83 are anchored; each remaining shape has a verified deletion route to a regular level-two seed. Fourteen have a route to L2-1 and therefore inherit a transition-biased coincidence. A written implicit-function argument extends examples to every $n\ge3$ and $k\ge2$.

## Technical account

Deleting one incoming edge at each of two reticulations gives four displayed trees. Their probabilities are mixed with weights determined by the network; their edge parameters are not freely chosen as four unrelated models.

The proof uses nine nonconstant Fourier-coordinate values. Three binomials test star-tree membership, provided the reconstructed tree parameters also satisfy the required inequalities. A second calculation sums internal states directly in probability space and compares every entry. For the principal example,

$$
p_{AAA}=\frac{1414811}{60825600},\qquad
p_{ACG}=\frac{693553}{60825600}.
$$

These values agree on the network and tree, as do the other 62 entries. The exact residual Jacobian has rank three at each seed. Locally, the coincidence locus has dimension 17 inside a 20-dimensional network parameter space: it is not isolated, but has zero ambient volume. Its image nevertheless contains an open part of the six-dimensional tree model.

For one prescribed common rate ratio $\kappa>1$, strict convexity forces all displayed-tree pair-path products to agree. The L2-1 path equations would then require an interior edge parameter to satisfy $u_3^2=1$, a contradiction. This does not settle the case of two different globally constant ratios.

## Evidence, assurance and limitations

Three rational-network certificates, exact probability comparison, nonzero Jacobian minors and graph witnesses support the finite claims. The revised verifier rejects altered parameters, invalid probabilities or weights, and an inappropriate continuous-time claim. Normal and optimized Python runs retain these checks.

The supplied review was actioned, but its external identity is not authenticated. Current replays are internal, not unaffiliated reproduction. No proof-assistant verification or empirical sequence study is claimed. Universal anchoring and propagation rely on the written arguments.

The 1,614 level-four shapes form an insertion-generated sample, not an exhaustive classification. Historical completion percentages are finite-search hit rates, not probabilities of exact coincidence for a random full network. Earlier unvalidated numerical hits are not used as certificates.

## Relationship to earlier work

Brits and colleagues' version-three paper proves all-level separation under JC and leaves the corresponding higher-level K2P question open. Earlier mixture-mimicry results and failures of individual invariants provide context, but do not themselves give this network-constrained, fully admissible equality.

The earlier Evidence Press release [When a network cannot look like a tree](/releases/tree-network-separation/) has different hypotheses: a single reticulation cycle, and a shared generator for its triangle result. The present two-reticulation, edge-specific construction does not contradict it.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical phylogenetics | A concrete boundary for extending JC separation arguments | Preserve model and rate assumptions |
| Inference-method developers | An exact non-identification test fixture | Exact equality is not a statement about prevalence or finite-sample power |
| Algebraic statisticians | Regular intersection points and a structural classification | Positive Fourier parameters need not define stochastic matrices |

## Why the problem matters

More data can reduce sampling error, but cannot distinguish models that predict exactly the same distribution. This example identifies where extra assumptions, different observations or a narrower model class are needed before inference can be uniquely justified.

## How to inspect or reproduce the recorded checks

Download the linked package, install its pinned Python dependencies in an isolated environment and run:

```sh
python code/verify_release.py --out /tmp/k2p-normal-new
python -O code/verify_release.py --out /tmp/k2p-optimized-new
```

Choose new output directories. Receipts include all 64 probabilities, exact minors, class-isomorphism mappings and deletion routes. The command checks the separately generated graph inventory against the submitted inventory; it does not rerun the original expensive rooted enumeration. The source and audit provenance explain that distinction.

## The most valuable next projects

Determine whether L2-0 or L2-2 can coincide under continuous-time constraints; decide whether anchoring is necessary beyond level three; and investigate cases where the network and tree have different globally constant rate ratios. Each is an open problem, not an implied extension of the certificate.

## What is in the evidence package

The manuscript and PDF give definitions and proofs. `AI_INDEX.md` provides an agent entry point; `CLAIMS.json` and `STATUS.json` separate proved, finite-checked and exploratory statements. Exact certificates, graph data, a fail-closed verifier, review dispositions, source comparisons and a hash manifest make the candidate inspectable and reusable.
