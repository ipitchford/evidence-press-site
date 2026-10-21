## Summary

**The question.** How long does a constrained random shuffle take to forget where it started? This is the *mixing time* of the shuffle: the number of steps after which the current state is close to a perfectly random one, whatever the starting point. People who sample random structures by running a Markov chain need it, because it tells them how long to run the chain.

**The objects.** A Dyck path is a sequence of $n$ up-steps and $n$ down-steps that never goes below ground level and finishes back on the ground. Such paths are counted by the Catalan numbers and turn up throughout combinatorics. In the shuffle studied here, each step picks two positions independently and uniformly at random and swaps the two letters. If the swap would push the path below ground, nothing happens. Rejected proposals still count as steps. The question is listed as AIM-PROBABILITY-0039, "Random transpositions on Dyck paths".

**What was found.** This unrefereed proof candidate gives matching upper and lower orders: for a path of length $2n$, the worst-start mixing time is $\Theta(n\log n)$. Cohen, Tetali and Yeliussizov discuss this chain and an earlier $O(n^2\log n)$ bound. The matching lower bound comes from the path that climbs all the way up and then all the way down: from there, at least $(n/2)\log n-O(n)$ steps are needed before the shuffle is close to random.

**How to read the result.** The proof is analytic and is meant to hold at every size. The accompanying finite computations are checks, not a substitute for an argument valid at every size. The upper constant is unspecified. The result counts proposals of the shuffle. It is not a running-time bound for a program, a burn-in prescription or a claim to the fastest Dyck sampler.

**Status.** An anonymous, AI-assisted, unrefereed candidate. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

Let $K$ choose an ordered pair $(i,j)$ independently uniformly from $[2n]^2$, transpose the corresponding letters when the resulting word is Dyck, and hold otherwise. Its stationary law $\pi$ is uniform on the $C_n$ Dyck words. Every distinct legal exchange has probability $1/(2n^2)$, and $K$ is at least $1/2$-lazy. The candidate (Theorem 1) establishes an absolute $A<\infty$ such that, for every $n\ge 2$ and $f\ge 0$,

$$
\operatorname{Ent}_\pi(Kf)\leq\left(1-\frac{1}{24An}\right)\operatorname{Ent}_\pi(f).
$$

Consequently $t_{\mathrm{mix}}(1/4)=\Theta(n\log n)$, with lower bound $(n/2)\log n-O(n)$. The constant $A$ is universal, not fitted to finite computations. No cutoff or sharp leading upper constant is asserted.

| Result | Where in the paper |
|---|---|
| One-step entropy contraction of order $1/n$ and $t_{\mathrm{mix}}(1/4)=\Theta(n\log n)$ in the original proposal clock | Theorem 1 |
| Conditional entropy at a cut height bounded by matroid deletion and addition fibres larger than $n/3$ | Lemma 2 |
| Uniform classical log-Sobolev inequality for the one-dimensional height channel at central cuts | Lemma 3 |
| Two-cut entropy factorization via Brascamp–Lieb/entropy duality | Section 5 |
| Constant-factor return to $K$ through a retained-fibre heat bath | Section 6 |
| Lower bound $(n/2)\log n-O(n)$ from the highest path by midpoint-height drift | Section 7 |

## Technical account

**Two cuts.** Condition on the heights at two separated path positions, after $s=\lfloor 2n/3\rfloor$ and $2n-s$ letters. Each conditioned half is a uniform basis of a truncated prefix matroid. The established matroid deletion-entropy inequality of Cryan, Guo and Mousa then controls the remaining conditional entropy using global deletion and addition fibres larger than $n/3$.

**The height channel.** The information shared by the two heights is controlled separately. Exact ballot formulas give a one-dimensional height channel. A uniform classical log-Sobolev bound follows from discrete Hardy estimates, including the bottom, intermediate and rare upper-tail regimes; a spectral-gap bound alone is insufficient. Discrete hypercontractivity across the changing height marginals then yields a two-cut entropy inequality through the established Brascamp–Lieb/entropy duality of Carlen and Cordero-Erausquin. The resulting bound holds for arbitrary full-path densities, including rare-event densities.

These height-channel positions are spatial indices within one path, not steps of the mixing walk.

**Return to the original chain.** A retained-fibre heat bath $P_3$, which resamples a deletion or addition fibre only when its size exceeds $n/3$, satisfies $K\le P_3\le 6K$ off the diagonal. Because $K$ is at least $1/2$-lazy, this gives the exact stochastic decomposition $K=\tfrac16P_3+\tfrac56R$ in the original discrete clock. This returns the result to the original proposal clock at constant cost.

**Lower bound.** Start from the highest path, all up-steps followed by all down-steps. Under an unconstrained transposition the expected midpoint height shrinks by the factor $1-1/n$, and rejection can only raise it. A martingale estimate, an exact stationary moment of the midpoint height and Chebyshev's inequality supply the matching lower order.

## Evidence, assurance and limitations

The package contains a standalone paper, accessible proof, expanded route notes, seven finite producer replay stages and twelve release negative controls built from deliberately corrupted inputs. Bounded computations check kernels, labelled-fibre embeddings, height identities, drift and moments. They do not certify the all-size Hardy inequality or the universal theorem. Numerical Hardy values and optimization outputs are exploratory evidence, not uniform proof certificates.

The load-bearing external inputs are the matroid deletion-entropy theorem and the one-dimensional entropy Hardy criterion; the two-cut embedding, height-channel reduction, tail estimates, entropy duality specialization and original-clock comparison are supplied in the manuscript. Earlier midpoint-profile and threshold-$n/2$ absorption conjectures are not premises of this proof; the notes preserve those earlier failed routes.

The supplied review was actioned, and the release records its internal editorial process. Producer-coordinated AI review is not external peer review, independent reproduction or formal verification. The literature search is bounded; novelty and priority remain unestablished. No fastest general Dyck sampler, arbitrary Catalan-chain result or measured computational speed-up is claimed.

## Relationship to earlier work

Cohen, Tetali and Yeliussizov provide the lattice-path matroid context. Cryan, Guo and Mousa supply the deletion-entropy input; Barthe and Roberto provide the entropy Hardy framework. Carlen and Cordero-Erausquin establish the generic entropy duality used here.

The general down-up theorem of Anari and colleagues uses a different kernel: its legal exchange probability depends on the number of completions of a deletion core. The Burnside sampler studied by Feng and Paguyo is different again. Neither result is silently transferred to this rejection walk. The candidate's claimed contribution is the Dyck-specific two-cut construction and its constant-cost return to the original chain.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Probability researchers | Inspect a two-cut entropy route for constrained sampling. | Check the all-size inequalities, not just finite replay. |
| Algorithm researchers | Compare distinct update kernels and proposal clocks. | Mixing steps are not implementation time or sampler optimality. |
| Research-tool builders | Reuse exact finite checks and preserved failed routes. | Internal implementation diversity is not independent validation. |
| Interested readers | See how local constraints affect random shuffling. | This remains an unrefereed candidate. |

## Why the problem matters

The constraint is simple, but rejecting invalid moves changes the dynamics. Determining the correct mixing order tests whether a convenient alternative sampling rule actually describes the original process. The proof also offers an inspectable example of combining local conditional-entropy estimates with control of the information left in a coarse observation.

## How to inspect or reproduce the recorded checks

Download the versioned evidence ZIP and extract it into a fresh directory. With Python 3.10 or later, run:

```sh
python3 full_replay.py
python3 release_checks.py
```

The standard library suffices. Expected results are `PASS_FINITE_REPLAY` and `PASS_NEGATIVE_CONTROLS`. Optimized Python execution is rejected because assertions are part of the finite checks. Replay verifies the manifest before regenerating some runtime-bearing receipts. Read the analytic proof separately: start with Theorem 1 and Sections 2–6 of the paper, then `FULL_SOLUTION.md`, `STATUS.md` and `ASSURANCE.md`.

## The most valuable next projects

1. Obtain unaffiliated specialist scrutiny of the uniform Hardy estimates and changing-marginal norm composition.
2. Reconstruct the labelled-fibre embedding and comparison independently.
3. Make the upper constant explicit before studying sharp asymptotics or cutoff.
4. Test extensions as new claims, without assuming every Catalan model inherits the same entropy structure.

## Who might contribute

Expertise in logarithmic Sobolev inequalities, matroid sampling and discrete functional inequalities would be especially useful. These are suggested areas of scrutiny, not claims of endorsement or an outreach programme.

## What is in the evidence package

The PDF, TeX, bibliography and accessible proof state the current candidate. The code and JSON records expose finite corroboration and historical obstructions. Status, claims, provenance, licences, review responses and manifests distinguish what is asserted from what was checked. Historical notes retain their original arguments behind explicit status banners. Original prose and data are CC0-1.0 and original code is MIT; third-party materials keep their upstream terms. The immutable GitHub release and Zenodo record identify the archived version.
