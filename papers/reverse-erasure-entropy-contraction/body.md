## Summary

**In one sentence.** How much "surprise" can survive one step of a noisy reset depends, in the worst case, only on the probability of the rarest symbol, and this settles a 2025 conjecture about random walks on complete bipartite graphs.

**The setting.** Think of a noisy channel that sometimes erases the symbol you send. Suppose it keeps each symbol with probability $\alpha$ and otherwise outputs a blank. Run it backwards, in the Bayesian sense: a visible symbol passes through unchanged, and each blank is replaced with a fresh random draw from a fixed prior $\rho$. So $\alpha$ sets how often the input is visible; it does not appear in the rule itself. This *reverse-erasure* step appears whenever part of a system is reset at random: a lazy random walk, a sampler that resamples a block of variables, or one half of an erasure channel.

**The question.** Relative entropy measures how far a distribution is from equilibrium: how much "surprise" or information it still carries. Any noisy step shrinks it. The *contraction coefficient* $\eta$ is the largest fraction that can survive one step, over all starting distributions. Computing it normally means optimising over every possible input.

**The surprising answer.** For reverse erasure, $\eta$ depends on the prior only through its smallest probability $q$. The priors $(0.1, 0.2, 0.7)$ and $(0.1, 0.9)$ give exactly the same coefficient at every $\alpha$. Up to a sharp threshold there is an exact formula,

$$
\eta=\frac{\log(1/q)}{\log\bigl(1/(\alpha q)\bigr)}\qquad\text{for }\alpha\le q^{q/(1-q)},
$$

and the worst start is to put all the mass on a rarest symbol. With $q=0.1$ and $\alpha=1/2$, both priors above keep at most $\log 10/\log 20\approx0.769$ of their relative entropy. Above the threshold the worst inputs spread out into smooth "tilted" distributions; the paper describes them exactly but gives no closed formula there.

**The application.** Take the complete bipartite graph $K_{n,n}$: two groups of $n$ vertices, every vertex joined to every vertex on the other side. A walker stays put half the time, and otherwise jumps to a random vertex on the other side. Caputo, Chen, Gu and Polyanskiy (Electronic Journal of Probability, 2025) conjectured that one step of this walk keeps at most the fraction $\log n/(2\log 2n)$ of relative entropy, with single vertices as the only worst starts, and checked it by computer for $n=3$. One step of this walk is exactly two reverse-erasure steps with $\alpha=1/2$ and a uniform prior on each side, so $q=1/n$, and the formula above proves the conjecture for every $n$.

**A worked example: $K_{3,3}$.** Start at one vertex $x$. Equilibrium is uniform on the six vertices, so the starting relative entropy is $\log 6$. After one step the walker is at $x$ with probability $1/2$ and at each of the three opposite vertices with probability $1/6$, so the relative entropy is $\tfrac12\log3$. The ratio is $\log3/(2\log6)\approx0.3066$: the conjectured value, and now proved to be the worst case.

**Beyond the conjecture.** The same idea handles any laziness, all matrix powers, stars and multipartite graphs: each reduces exactly to a chain with at most two states per block, a computation with two to four states instead of $n$. In those cases the final values are computed numerically. The lazy star, left as a numerical observation by Jadhav (2026), is settled in closed form.

## Summary for specialists

Reverse-erasure kernel on $[n]\cup\{e\}$: $R(i)=\delta_i$, $R(e)=\rho$, with fixed reference $m_{\rho,\alpha}=(\alpha\rho,1-\alpha)$, so $m_{\rho,\alpha}R=\rho$. Let $\eta(\rho,\alpha)=\sup_\nu D(\nu R\|\rho)/D(\nu\|m_{\rho,\alpha})$ and $q=\min_i\rho_i$.

| Result | Status |
|---|---|
| $\eta(\rho,\alpha)=\eta((q,1-q),\alpha)$ for every full-support $\rho$ and every $\alpha\in(0,1)$, with an exact one-variable criterion (Theorem 2.3, Proposition 2.4) | **New** in the bounded search; proof |
| $\eta=\log(1/q)/\log(1/(\alpha q))$ for $\alpha\le\alpha_c(q)=q^{q/(1-q)}$, attained only at a rarest point input; threshold sharp (Theorem 2.5) | Upper bound is Gao's weighted mean inequality (credited); sharpness and general-prior form new |
| Local coefficient $\alpha$; above $\alpha_c$ the extremisers are full-support exponential tilts (Proposition 2.6, Theorem 2.7) | New; no closed form |
| Half-lazy $K_{m,n}$: $\eta_{\mathrm{KL}}=\log M/(2\log 2M)$, $M=\max(m,n)$, only point extremisers for $M\ge3$; rank-one weights; lazy star (Theorem 6.1, Corollary 6.2) | Conjecture of Caputo–Chen–Gu–Polyanskiy; **proof new** |
| Block-reset chains collapse to at most two states per block (Theorem 7.4 and corollaries) | Reduction proved; values numerical |
| One-way agreement-distillation rate $\log(1/\alpha)/\log(1/(\alpha q))$ below $\alpha_c$ (Corollary 8.1) | Uniform binary case known (Zhao); general prior new |

For a half-lazy rank-one bipartite reset chain with conditional laws $\mu,\nu$ the coefficient is $\log(1/q)/(2\log(2/q))$ with $q=\min(\min\mu,\min\nu)$; since $1/2\le\alpha_c(q)$ for every $q\le1/2$, the walk always lies in the closed-form regime. The local quadratic ($\chi^2$) coefficient is $1/4$ throughout, and the spectral gap is $1/2$, so the result concerns which inputs are worst, not mixing speed.

## Technical account

**Duality and one large coordinate.** Entropy duality turns $\eta\le c$ into a family of inequalities for positive vectors (Lemma 3.1). A maximising dual vector lies on the boundary of a simplex face and, by a convexity argument on fixed arithmetic and geometric means, has at most one coordinate different from the rest (Lemmas 3.2–3.3). Moving that coordinate to an atom of smallest mass only makes the inequality harder, so the whole problem reduces to the two-point prior $(q,1-q)$ and to a scalar test $H_{q,\alpha,p}(r)\le1$.

**The closed form.** With $p=1/c$ and $\alpha=q^{p-1}$, the scalar condition is exactly the weighted mean inequality $A^p\ge q^{p-1}\mathbb E_\rho z^p+(1-q^{p-1})G^p$ for $p\ge1/(1-q)$, proved by Gao (2003, 2009). The paper gives a self-contained derivation and credits Gao. Sharpness comes from a second-order expansion at the point input, which also gives the threshold $q^{q/(1-q)}$.

**The bipartite theorem.** A half-lazy rank-one bipartite reset chain decomposes into two reverse-erasure steps at $\alpha=1/2$, one per side, joined by a two-part bookkeeping identity (Section 6). For $K_{n,n}$ both conditional priors are uniform with $q=1/n$, which gives $\log n/(2\log 2n)$ and the equality cases.

**Block-reset chains.** Any chain that keeps a block with some probability and otherwise redraws from a rank-one law can be collapsed, block by block, to at most two states (the rarest state and the rest) without changing $\eta$ (Section 7). Laziness, powers, stars and complete multipartite graphs are special cases; their small collapsed chains are evaluated numerically.

**Classical and new.** Gao's mean inequality, the uniform binary coefficient (Nair and Wang; Zhao), entropy duality, tensorisation and the strong-data-processing link to agreement distillation are known and credited. The new content, within a bounded literature search, is the reduction to the smallest atom at every $\alpha$, the general-prior closed form with its sharp threshold, the all-$n$ proof of the conjecture and its weighted and block-reset extensions.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/reverse-erasure-entropy-contraction.txt) is available for reading.

- **Proofs.** Every result has a written informal proof in the 27-page manuscript; no proof assistant was used.
- **Numerical diagnostics.** Four scripts test the claims on finite samples. The random-sample suite has 101 gates, including 88,736 full-matrix bipartite inputs. The minimum-mass script reports which envelope comparisons are informative (143 of 256). The block-reset script runs 122 checks. These are evidence of correct implementation, not proofs.
- **Negative controls.** Ten deliberately false versions of the main claims are all detected, together with structured near-extremiser families; five more controls guard Section 7.
- **Replay.** Every script was rerun from a fresh copy of the package with Python's `-I -B` flags and again with `-O`. All results matched the recorded outputs exactly, apart from timing and version fields. The scripts collect failures explicitly instead of using `assert`, and they refuse to overwrite recorded outputs.
- **What is numerical.** Values for laziness other than $1/2$, for powers and for multipartite graphs, and the windows in which point inputs remain optimal there, are numerical estimates without certified error bounds.
- **What is not claimed.** No closed form above the threshold; no mixing-time improvement (the spectral gap is $1/2$); no statement for cross weights that are not rank one.
- **Review.** Internal AI-assisted review only: five reviewer roles, an adversarial review and a later audit by a different model, a proof audit of the new material and a re-review of the revision. They found no critical or major correctness gap; a sign slip with a correct conclusion was fixed. A rating-free summary of the objections and responses is in the package. None of this is human peer review, independent reproduction or formal verification.
- **Priority.** The literature search was dated and bounded, with no author enquiry. This is an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Probabilists studying entropy contraction and mixing of Markov chains | A proved closed form for the $K_{n,n}$ conjecture and a reduction of block-reset chains to two to four states | One-step, rank-one chains only; no mixing-time improvement |
| Information theorists working on strong data-processing inequalities | The reverse-erasure coefficient as an explicit function of the rarest probability, with its sharp threshold | No closed form above the threshold |
| Designers of samplers that reset blocks of variables (lazy walks, block resampling, down-up samplers) | Worst-case entropy retention from the smallest conditional probability instead of an $n$-symbol optimisation | Values outside the half-lazy case are numerical |
| Research agents | Machine-readable claims, an agent index and replayable scripts with negative controls | Scripts check finite cases; the theorems rest on the written proofs |

## Why the problem matters

Entropy contraction coefficients measure how quickly a noisy process forgets where it started, and they control mixing bounds, sampling algorithms and limits on communication through noisy channels. They are rarely computable exactly beyond small or highly symmetric cases. Caputo, Chen, Gu and Polyanskiy posed the $K_{n,n}$ question as a clean test of which inputs are worst for a full step of a chain, and could only settle $n=3$. The rarest-symbol principle explains why the answer has the form it does and turns a whole class of block-reset problems into small computations.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, unpack the package and run from a scratch directory, writing to new output folders:

```sh
shasum -a 256 -c MANIFEST.sha256
uv run --with numpy --with scipy --with mpmath python3 -I -B "$PKG/verification/validate_entropy.py"    --output-dir NEW/validate
uv run --with numpy --with scipy --with mpmath python3 -I -B "$PKG/verification/verify_minimum_mass.py" --output-dir NEW/minmass
uv run --with numpy --with scipy --with mpmath python3 -I -B "$PKG/verification/negative_controls.py"   --output-dir NEW/controls
uv run --with numpy --with scipy --with mpmath python3 -I -B "$PKG/verification/extension_checks.py"    --output-dir NEW/extension
uv run python3 -I -B "$PKG/prepare_fingerprints.py" --output-dir NEW/fingerprints
```

Each script exits 0 only if every gate passes; adding `-O` gives the same results. Runtimes are about 1, 1, 21 and 71 seconds. `requirements.txt` pins the library versions used for the recorded outputs. `AI_INDEX.md` maps each claim to its place in the paper and its evidence, `VERIFICATION.md` records what was checked, and `REVIEW_SUMMARY.md` lists the review objections and their resolutions.

## The most valuable next projects

1. Above the threshold: prove that the tangency equation has a unique solution, at least for two-symbol priors, and find how fast the coefficient leaves its point value just past the threshold.
2. Give an analytic phase diagram for laziness and matrix powers: where exactly point inputs stop being optimal.
3. Extend beyond rank one, for example with bounds in terms of the distance of the cross weights from rank one.
4. Compute the half-step and continuous-time constants of Caputo et al. for the same family, and the agreement-distillation rate above the threshold.
5. Have a specialist in strong data-processing inequalities check the reduction to the smallest atom.

## What is in the evidence package

The 27-page paper (PDF and LaTeX source, with Section 7 in its own file) and its figure script. Four verification scripts with recorded outputs in normal and `-O` modes, the outputs of the first version for comparison, and exact rational fingerprints of small kernels. The dated prior-art gate and source audit, an informal proof digest, preserved development notes, and a rating-free review summary. Registry records for every reference, build logs, an agent index, citation and deposit metadata, CI and SHA-256 sums.
