## Summary

How long does a constrained random shuffle take to forget its starting point?
A Dyck path goes up and down without crossing below ground, ending where it
started. Here a step of the shuffle picks two positions independently at
random and swaps them, unless that would make the path invalid.

This unrefereed proof candidate gives matching upper and lower orders:
for a path of length $2n$, the worst-start mixing time is $\Theta(n\log n)$.
The statement counts every proposal, including rejected ones. Its proof is
analytic; the accompanying finite computations are checks, not a substitute
for an argument valid at every size.

## Summary for specialists

Let $K$ choose an ordered pair $(i,j)$ independently uniformly from $[2n]^2$,
transpose the corresponding letters when the resulting word is Dyck, and hold
otherwise. Its stationary law $\pi$ is uniform on $C_n$ Dyck words. The candidate
establishes an absolute $A<\infty$ such that

$$\operatorname{Ent}_\pi(Kf)\leq\left(1-\frac{1}{24An}\right)\operatorname{Ent}_\pi(f).$$

Consequently $t_{\mathrm{mix}}(1/4)=\Theta(n\log n)$, with lower bound
$(n/2)\log n-O(n)$. No cutoff or sharp leading upper constant is asserted.

## Technical account

Condition on heights at two separated path positions. Each conditioned half
is a uniform basis of a truncated prefix matroid. The established matroid
deletion-entropy inequality controls the remaining conditional entropy using
global deletion and addition fibres larger than $n/3$.

The information shared by the two heights is controlled separately. Exact
ballot formulas give a one-dimensional height channel. A uniform classical
log-Sobolev bound follows from discrete Hardy estimates, including the bottom,
intermediate and rare upper-tail regimes. Discrete hypercontractivity across
the changing height marginals then yields a two-cut entropy inequality through
the established Brascamp–Lieb/entropy duality.

These height-channel positions are spatial indices within one path, not steps
of the mixing walk. Finally a retained-fibre heat bath satisfies an exact
constant-factor stochastic decomposition with $K$. This returns the result
to the original proposal clock. A midpoint-height drift argument supplies the
matching lower order.

## Evidence, assurance and limitations

The package contains a standalone paper, accessible proof, expanded route
notes, seven finite producer replay stages and deliberately corrupted-input
controls. Bounded computations check kernels, labelled-fibre embeddings,
height identities, drift and moments. They do not certify the all-size Hardy
inequality or the universal theorem.

The supplied review was actioned, and the release records its internal
editorial process. Producer-coordinated AI review is not external peer review,
independent reproduction or formal verification. The literature search is
bounded; novelty and priority remain unestablished. No fastest general Dyck
sampler, arbitrary Catalan-chain result or measured computational speed-up is
claimed.

## Relationship to earlier work

Cohen, Tetali and Yeliussizov provide the lattice-path matroid context.
Cryan, Guo and Mousa supply the deletion-entropy input; Barthe and Roberto
provide the entropy Hardy framework. Carlen and Cordero-Erausquin establish
the generic entropy duality used here.

The general down-up theorem of Anari and colleagues uses a different kernel:
its legal exchange probability depends on the number of completions of a
deletion core. The Burnside sampler studied by Feng and Paguyo is different
again. Neither result is silently transferred to this rejection walk. The
candidate's claimed contribution is the Dyck-specific two-cut construction
and its constant-cost return to the original chain.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Probability researchers | Inspect a two-cut entropy route for constrained sampling. | Check the all-size inequalities, not just finite replay. |
| Algorithm researchers | Compare distinct update kernels and proposal clocks. | Mixing steps are not implementation time or sampler optimality. |
| Research-tool builders | Reuse exact finite checks and preserved failed routes. | Internal implementation diversity is not independent validation. |
| Interested readers | See how local constraints affect random shuffling. | This remains an unrefereed candidate. |

## Why the problem matters

The constraint is simple, but rejecting invalid moves changes the dynamics.
Determining the correct mixing order tests whether a convenient alternative
sampling rule actually describes the original process. The proof also offers
an inspectable example of combining local conditional-entropy estimates with
control of the information left in a coarse observation.

## How to inspect or reproduce the recorded checks

Download the versioned evidence ZIP and extract it into a fresh directory.
With Python 3.10 or later, run:

```sh
python3 full_replay.py
python3 release_checks.py
```

The standard library suffices. Expected results are `PASS_FINITE_REPLAY` and
`PASS_NEGATIVE_CONTROLS`. Optimized Python execution is rejected because
assertions are part of the finite checks. Replay verifies the manifest before
regenerating some runtime-bearing receipts. Read the analytic proof separately.

## The most valuable next projects

1. Obtain unaffiliated specialist scrutiny of the uniform Hardy estimates and
   changing-marginal norm composition.
2. Reconstruct the labelled-fibre embedding and comparison independently.
3. Make the upper constant explicit before studying sharp asymptotics or cutoff.
4. Test extensions as new claims, without assuming every Catalan model inherits
   the same entropy structure.

## Who might contribute

Expertise in logarithmic Sobolev inequalities, matroid sampling and discrete
functional inequalities would be especially useful. These are suggested areas
of scrutiny, not claims of endorsement or an outreach programme.

## What is in the evidence package

The PDF, TeX, bibliography and accessible proof state the current candidate.
The code and JSON records expose finite corroboration and historical
obstructions. Status, claims, provenance, licences, review responses and
manifests distinguish what is asserted from what was checked. Historical notes
retain their original arguments behind explicit status banners. The immutable
GitHub release and Zenodo record identify the archived version.
