## Summary

A small probabilistic neural network can have more adjustable parameters than the distribution it is trying to fit and still miss some distributions. This candidate identifies eight of the sixteen patterns on four binary variables that a classical restricted Boltzmann machine with three hidden units cannot approximate arbitrarily well.

The obstacle is structural, not a failed training run. If the model puts substantial probability on each of the eight chosen patterns, it must leave some probability outside them. A finite certificate and a written argument make this restriction apply even to limiting distributions reached with unbounded parameters.

The work also constructs a strictly positive excluded distribution. Its certified separation is tiny and is not an estimate of practical training loss. The result is an unrefereed candidate, supported by exact producer checks and internal AI review.

## Summary for specialists

Let $\mathcal R$ be the visible closure of classical real binary $\operatorname{RBM}(4,3)$ and let
$$
S=\{0000,0001,0010,0100,0111,1001,1010,1100\}.
$$
The candidate theorem states that every $p\in\mathcal R$ satisfies
$$
p(S^c)\geq \left(\frac{\min_{x\in S}p(x)}{8}\right)^4.
$$
Consequently every law whose support is exactly $S$ is excluded. For the uniform law $q$ on $S$, the total-variation distance from the model is at least $2^{-25}$. If $u$ is uniform on all sixteen states and $q^+=(1-2^{-25})q+2^{-25}u$, the strictly positive law $q^+$ has distance at least $2^{-26}$.

A separate proposition represents arbitrary weights on the eight even-parity vertices together with $0001$. At least four hidden units are therefore necessary for universality on four visible bits, but four-hidden sufficiency is not proved.

## Technical account

Each joint visible/hidden state has an augmented sufficient-statistic vector containing a constant, four visible coordinates, three hidden coordinates and twelve interactions. Equality of nonnegative integer sums of these vectors produces an exact identity between products of normalized joint probabilities. The constant coordinate guarantees equal degrees, so normalization cancels.

For each selected visible state, choose a hidden state carrying at least one eighth of its visible mass. The certificate covers every such choice: 42 base identities generate 12,096 directly checked transformed identities. After hidden normalization, 4,648 partial assignments cover all 2,097,152 selectors. Two exact coverage implementations agree.

In the selected identity, some factors must lie outside $S$. If their total multiplicity is $o$ and the common degree is $D$, the check establishes $D/o\leq4$. The maximum degree is seven, not four. Bounding the products gives the leakage inequality; continuity extends it to the entire visible closure.

The parity-plus-one result uses a different mechanism: ten exposed joint states with a full-rank interpolation matrix. This permits arbitrary logarithmic masses, not merely the projected support.

## Evidence, assurance and limitations

The package contains the written proof, all 42 printable certificate rows, machine data, standard-library checkers, exact rational controls, normal/optimized replay, adversarial mutations, immutable-receipt tests and a complete current manifest.

These checks are producer-coordinated. Five model-based publication roles provide internal editorial review, not external peer review. A supplied AI review reports a full, unnormalized reconstruction, but its linked audit ZIP was not retrieved by this publication workflow; that report does not become an independently retrieved reproduction receipt.

The source-to-computation bridge remains a written mathematical argument, not a proof-assistant theorem. The broader support scan contains infeasibility reports and timeouts and is not a certified classification. No smallest excluded support, exact hidden-unit threshold, sharp approximation radius or historical priority is claimed.

## Relationship to earlier work

The AIM workshop summary poses the fixed $(4,3)$ question, discusses a parity-plus-one investigation, and records a broader eight-vertex proof outline. This candidate provides a counterexample to the broad assertion suggested by that outline; it does not overturn a completed established theorem.

Seigal and Montúfar's smaller-model work already uses real polynomial inequalities to describe representable distributions. The new claimed contribution is this specific four-visible obstruction. Supermodular rank, generic complex Hadamard rank and universality with a growing number of hidden units address different constraints and do not supply fixed-size real universality here.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Algebraic statisticians | A concrete inequality and excluded support for a small latent-variable model. | The full real-model geometry is not classified. |
| Machine-learning theorists | A counterexample to reasoning from parameter count alone. | No typical-data or large practical error claim. |
| Verification researchers | A compact integer object with an exhaustive selector cover. | Check the written semantic bridge as well as the code. |
| Interested readers | A precise example of structural limits in a small neural model. | Candidate publication is not independent acceptance. |

## Why the problem matters

Universal approximation asks whether an architecture can approach every target distribution, not whether optimization usually succeeds. An explicit obstruction answers that question for a fixed architecture and identifies the mechanism forcing failure. The contrasting nine-point representability result shows why counting supported patterns is also insufficient.

The result is a bounded theoretical advance. Its eventual influence on other architectures or practical learning requires separate work and evidence.

## How to inspect or reproduce the recorded checks

Download the versioned archive or check out the immutable candidate tag. Python 3.10 or newer is enough for the exact checks; no solver is needed. From the package root, run the main verifier on certificate.json, the auxiliary verifier, then test_release.py and the package inventory check as documented in README.md.

The expected main receipt records 42 identities, 12,096 transforms and complete coverage of 2,097,152 normalized selectors. The regression suite must reject corrupted inputs in normal and optimized modes, leave package bytes unchanged, and refuse existing output paths. Fresh receipts go to stdout unless an explicitly new output path is requested.

## The most valuable next projects

First, reproduce the certificate and analytic bridge in an unaffiliated implementation with a public receipt. Specialist assessment should also examine the AIM source correspondence and bounded priority claim. Further mathematical questions include the exact hidden-unit threshold, smaller excluded supports, sharper distances and extensions of the leakage method.

## What is in the evidence package

The linked GitHub release and Zenodo deposit carry the current PDF, Markdown proof, printable appendix, JSON certificate, verifiers, regression tests, manifest, claim index, source audit, licences and internal editorial records. Earlier discovery outputs and research metrics remain explicitly historical. The release page separately exposes the prospectively scoped assurance/publication forecast and measured outcome.

Audio and artwork explain the result; they are not additional mathematical evidence.
