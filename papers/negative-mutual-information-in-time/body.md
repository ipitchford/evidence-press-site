## Summary

**In one sentence.** A proposed quantum "mutual information in time" between the input and the output of a process can be negative only if the input has at least three levels, the output at least two, and the starting state is not pure; one explicit three-level-in, two-level-out process reaches all three limits at once.

**The question.** For two quantum systems at the same moment, quantum mutual information measures how much they share, and it is never negative. Physicists have proposed an analogue for *one* system at *two* times: before and after a process (a quantum channel). There is no ordinary joint quantum state for two times, so the proposal uses a *pseudo-density matrix*, also called a state over time. Unlike an ordinary quantum state it can have negative eigenvalues, so it also needs an entropy that accepts negative eigenvalues, $S(X)=-\operatorname{Tr}X\log|X|$. Fullwood and Parzygnat defined the resulting mutual information and conjectured that it is never negative either. A mutual information that can go negative would be hard to read as "shared information".

**What was known.** Fullwood and Yang proved the conjecture whenever the input is a qubit, in a preprint. The Omega Institute then published an explicit counterexample in five dimensions, so the conjecture is false in general; their dossier listed the smallest failing input dimension as open. This release is therefore not the first counterexample.

**What is new.**

| What | In plain terms | Where |
|---|---|---|
| The exact threshold | A failure needs at least 3 input levels, at least 2 output levels and a starting state of rank at least 2 (not pure) | Corollaries 4.2 and 5.2 |
| A smallest example | One explicit process with 3 levels in and 2 out, on a rank-two state, has mutual information about $-0.00139$ nats, certified exactly by root isolation and interval arithmetic | Theorem 5.1 |
| The mechanism | For a rank-two state, the channel must keep quantum coherence between the occupied levels and an empty one; without that coherence the quantity is provably never negative | Lemma 2.1, Proposition 2.2, Corollary 3.3 |
| An exactly solvable family | A "coherent" version of the textbook erasure channel has an explicit spectrum and is negative on an exactly known interval of its parameter | Theorems 4.1 and 4.3 |
| Opposite signs from the same visible action | Two processes that act identically on everything the system actually occupies can give opposite signs | Proposition 7.1 |

**A check you can do by hand.** In the erasure family at the parameter value $t=5/21$, the sign of the mutual information comes down to comparing two whole numbers:

$$2573571875<8707129344,$$

that is, $5^5\cdot7^7<2^{14}\cdot3^{12}$. The mutual information there is $\tfrac1{42}\log$ of their ratio, about $-0.029$ nats.

**Limits.** The results concern one specific proposal: the anticommutator state over time with the entropy $-\operatorname{Tr}X\log|X|$. The qubit-input lower bound, and so the "at least three input levels" part of the threshold, comes from a preprint. Whether the quantity is unbounded below, and its most negative value for three-level systems, are open; the paper reports numerical evidence only. No operational meaning for the negative values, and no replacement measure, is offered. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks, not peer review.

## Summary for specialists

A channel $\mathcal E:M_d\to M_m$ and a state $\rho$ define the input-first Jamiołkowski matrix and the anticommutator state over time

$$\mathcal J[\mathcal E]=\sum_{i,j}|i\rangle\langle j|\otimes\mathcal E(|j\rangle\langle i|),$$

$$\mathcal R(\mathcal E,\rho)=\tfrac12\{\rho\otimes\mathbf 1_m,\mathcal J[\mathcal E]\},$$

a Hermitian unit-trace matrix with marginals $\rho$ and $\mathcal E(\rho)$. With $S(X)=-\sum_\lambda\lambda\log|\lambda|$ (nats), the mutual information in time is

$$I(\mathcal E,\rho)=S(\rho)+S(\mathcal E(\rho))$$
$$\qquad-S(\mathcal R(\mathcal E,\rho)).$$

- **Lemma 2.1, Proposition 2.2** *(proof)*: for diagonal $\rho$ the $(i,j)$ block of $\mathcal R$ is $\tfrac{\rho_i+\rho_j}2\,\mathcal E(|j\rangle\langle i|)$. If the channel has no cross-coherence between $\operatorname{supp}\rho$ and its complement, then $\mathcal R$ is unitarily equivalent to the state over time of the restricted channel plus zeros, and $I$ is unchanged by the restriction.
- **Propositions 3.1, 3.2 and Corollary 3.3** *(proof)*: $I\ge0$ for qubit inputs (Fullwood–Yang, Theorem 4.1, a preprint), for $m=1$, and for every pure input (new proof from Fullwood–Yang Lemma 4.4(iv)). Hence a rank-two violation must be a coherent completion of a qubit-input channel.
- **Theorem 4.1, Corollary 4.2** *(proof)*: for the coherent erasure family $\mathcal E_t$ on a qutrit with $\rho=\operatorname{diag}(0,\tfrac12,\tfrac12)$, the spectrum of $\mathcal R$ is explicit and

$$42\,I(5/21)=\log\frac{2573571875}{8707129344}<0.$$

  So the smallest input dimension with a violation, over all outputs, is three, and the smallest rank is two.
- **Theorem 4.3** *(proof)*: $I(t)$ is strictly convex on $(0,1)$ with $I(0)=0$ and $I(1)=\log2$, negative exactly for

$$0<t<\tau=\frac{\sqrt{33}-1}{16}\approx0.2965,$$

  with minimum about $-0.0591$ nats at $t_*\approx0.1122$.
- **Theorem 5.1, Corollary 5.2** *(certified computation and proof)*: an explicit rational channel $\mathcal F:M_3\to M_2$ with $\rho_{\mathcal F}=\operatorname{diag}(0,\tfrac1{47},\tfrac{46}{47})$ has

$$I(\mathcal F,\rho_{\mathcal F})\in[-0.00139052762357144,$$
$$\quad-0.00139052762357143],$$

  so $(d,m,\operatorname{rank})=(3,2,2)$ are all minimal and attained together.
- **Proposition 6.1** *(proof)*: violations persist for full-rank states and channels with positive-definite Choi matrix.
- **Proposition 7.1** *(proof)*: the incoherent completion of the same erasure channel gives $I=t\log2>0$, while the coherent one is negative for $t<\tau$.

## Technical account

**Why the block form matters.** Multiplying $\mathcal J[\mathcal E]$ by $\rho\otimes\mathbf 1$ on the left and right weights block $(i,j)$ by $\rho_i$ and $\rho_j$. Blocks with both indices outside the support vanish, so the only way the unoccupied levels enter is through the *cross blocks*, the images of $|j\rangle\langle i|$ with one index inside the support and one outside. If those vanish, the problem reduces to the restricted channel; for a rank-two state that is a qubit-input channel, where Fullwood and Yang's theorem gives $I\ge0$.

**The erasure family.** On the occupied pair of levels, $\mathcal E_t$ acts as a qubit erasure channel: with probability $1-t$ the state is replaced by the flag $|0\rangle$. The Kraus operators are chosen so that the erasure is *coherent*: they also map the empty level $|0\rangle$ into the occupied pair, which produces nonzero cross blocks. The resulting state over time has eigenvalues $0$ (twice), $t/2$ (three times), $(1-t)/2$ (twice) and $\lambda_\pm=(-t\pm\sqrt{t^2-t+1})/4$, one of them negative. At $t=5/21$ the square root is rational ($19/21$), so every term of $I$ is a rational multiple of a logarithm of a rational number, and the sign reduces to the integer comparison above.

**The qutrit-to-qubit witness.** Theorem 5.1 uses a channel given by its images of matrix units with small rational entries. Complete positivity follows from leading principal minors of the Choi matrix. Apart from one zero, the eigenvalues of the state over time are roots of an integer quadratic and an integer cubic. The verifier isolates every root in a rational interval of width below $10^{-45}$ and evaluates the entropies in 60-digit interval arithmetic with outward rounding, so the sign is certified, not estimated. The violation is about forty times smaller than the family's minimum.

**Why random sampling misses violations.** Fullwood and Parzygnat sampled random processes and found none. In the package's reproducible experiment, 4000 random rank-two qutrit processes gave no negative value either. Violations need a rank-deficient input together with coherence into the unoccupied level, a small region that generic sampling rarely reaches.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/negative-mutual-information-in-time.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 11-page paper. The paper opens with a plain introduction (the question, what was known, what is new and a roadmap) and ends with consequences, numerical observations, open questions and an AI-use statement. No proof assistant was used.
- **Exact checks.** `verification/verify_qutrit.py` builds every state over time directly from its definition and checks, in exact arithmetic: the characteristic polynomials of the erasure family at $t=5/21$, $7/40$ and $11/96$; the integer certificate; the second-derivative formula and its rational lower bound; the closed form of $\tau$; the witness channel, its Choi matrix and an outward-rounded enclosure of its mutual information; the constants of Proposition 6.1; and the support-restriction identities of Proposition 7.1.
- **Tests that can fail.** No check uses `assert`, so the verifier behaves identically under Python's optimised mode. Changing the certificate's numerator from $5^5\cdot7^7$ to $5^6\cdot7^7$, or the stated interval's upper end, makes it exit with failure.
- **Replay.** The verifier (normal and optimised mode), the numerics and the figure script were rerun from fresh copies before release under Python 3.12 with pinned libraries; every output was byte-identical to the recorded file. GitHub CI reruns the verifier under `-O` and compares its output byte for byte, with both negative controls, as a blocking job; the numerics are compared within a declared tolerance in a separate, non-blocking job.
- **Numerical observations.** Section 8 reports searches over qutrit processes that reach about $-0.0591$ nats and nothing lower, and tensor powers of the extremal process that become more negative ($-0.059$, $-0.119$, $-0.180$ for one, two and three copies). These are observations, not theorems.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay found no mathematical error. The revision round added the qutrit-to-qubit witness (removing a false remark that such searches found nothing), the block lemma and coherence criterion, the related work of Wu, Parzygnat, Vedral and Fullwood, a new introduction for non-specialists and a verifier that cannot pass silently. A re-review, a proof audit and a second-model audit of the new proofs followed. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** One specific state over time and entropy; the dimension threshold relies on a preprint; unboundedness below and the qutrit minimum are open; not the first counterexample. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on states over time and temporal quantum correlations | The exact smallest counterexamples and the coherence criterion as tests for proposed definitions | The results concern one proposal; no replacement measure is offered |
| Authors of numerical searches | Benchmarks: a certified qutrit-to-qubit value and an exactly solvable family | Searches have not found anything below about $-0.0591$ for qutrits, but that is not a proof |
| Readers of Fullwood and Yang | A simple, physically motivated example of the kind their Section 6 asked for | Their qubit-input theorem is still a preprint |
| Research agents | Machine-readable claims, an agent index and a replayable exact verifier | The numerics are descriptive and not part of any proof |

## Why the problem matters

Mutual information is one of the main ways to say how strongly two things are correlated. Extending it to correlations across time, within one quantum system, would give a common language for spatial and temporal quantum correlations. Non-negativity is the property that lets mutual information be read as an amount of shared information. Knowing exactly where the proposed temporal version loses it, and why, tells researchers what any repaired definition must handle: coherence between occupied and unoccupied levels.

## Related Evidence Press releases

No earlier Evidence Press release studies pseudo-density matrices or states over time. Two releases share some vocabulary but address different problems: *Sharp qutrit discrimination and unavoidable correlation overcounting for complementary measurements* concerns measurements on a qutrit, and *Entropy contraction on complete bipartite graphs via reverse erasure* concerns classical erasure channels. Neither result is used here.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/):

```sh
shasum -a 256 -c MANIFEST.sha256
uv run --no-project --python 3.12 \
  --with sympy==1.14.0 --with mpmath==1.3.0 \
  python -I -B -O verification/verify_qutrit.py > v.json
cmp v.json verification/verification.json
uv run --no-project --python 3.12 \
  --with numpy==2.3.5 --with scipy==1.17.0 \
  python -I -B verification/numerics.py > n.json
```

The verifier takes a few seconds and the numerics about a minute. `ENVIRONMENT.txt` lists the software used. `AI_INDEX.md` maps each claim to its proof and checks, `PRIOR_ART.md` and `RESEARCH_GATES.json` record the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide whether the mutual information in time is unbounded below in finite dimensions; the tensor-power numerics suggest it is.
2. Find the minimum over all qutrit processes, and the minimum for qutrit-to-qubit processes.
3. Turn the cross-block condition of Lemma 2.1 into a necessary and sufficient criterion for a violation.
4. Determine which other states over time, or other entropies, keep the quantity non-negative.

## What is in the evidence package

The paper (LaTeX source and PDF) and its figure; `verification/verify_qutrit.py` with `verification/verification.json`; `verification/numerics.py` with `verification/numerics.json`; `verification/make_figure.py`; `requirements.txt`; `PRIOR_ART.md`; `target.yaml`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and SHA-256 sums.
