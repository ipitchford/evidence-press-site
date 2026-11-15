## Summary

**In one sentence.** A conjecture about the cost operators of quantum optimal transport is proved, a new retraction shows that noncommuting measurements never help to approximate block-shaped costs, and the best approximation errors are computed exactly, together with a sharp rule for when the centred transport cost stays nonnegative.

**The classical starting point.** Optimal transport asks for the cheapest way to move one distribution of mass onto another. Moving one unit of mass from position $x$ to position $y$ typically costs $|x-y|^p$. The exponent $p$ sets what "cheap" means: with $p=1$ the cost is the distance moved; with $p=2$ it is the squared distance, which punishes long moves more.

**The quantum version.** In the theory of De Palma and Trevisan, transport between two quantum states is carried out by a quantum channel, and a *cost operator* plays the role of $|x-y|^p$. For a measurable quantity (an observable) $A$, the cost operator

$$G_p(A)=|A\otimes I-I\otimes A^T|^p$$

charges $|x-y|^p$ when $A$ is measured at both ends of the transport plan. Two quantum surprises follow. A state can have a positive cost of transport to itself, so the self-costs are subtracted, giving the *centred cost*. And the centred cost is guaranteed to be nonnegative only for quadratic costs ($p=2$).

**The question.** Bunth, Pitrik, Titkos and Virosztek collected the finite sums of such cost operators, built from observables with finitely many outcomes, into a cone $\mathcal C_p$ for each exponent, and conjectured that the cones grow with $p$ (their Conjecture 9). If they do, every cost with $p\le2$ is secretly a sum of quadratic costs, its centred cost is nonnegative, and their $p$-Wasserstein divergence is well defined for all $p\le2$.

**What is new here.**

| Result | In plain terms | Where |
|---|---|---|
| The conjecture holds | $\mathcal C_p\subseteq\mathcal C_q$ whenever $p\le q$; an $n$-level cost needs at most $n(n-1)/2$ costs of functions of the same observable | Theorem 2.1 |
| A contractive retraction | Any cost can be replaced by one built only from the given measurement blocks, never further from a block-shaped target and never leaving the cone: noncommuting observables never help | Theorems 2.2, 6.1 |
| Exact errors | The simplest limiting cost is at distance exactly $1/(1+2^{\max(p,1)})$ from all costs with exponent $p$; every three-level cost has an exact formula | Theorems 7.2, 8.2 |
| A sharp sign rule | For one observable with at least three outcomes, the centred cost is nonnegative for all pairs of states exactly when $p\le2$ | Theorem 5.2 |

**A concrete example.** Take two perpendicular pure states and the limiting cost that charges one unit for moving between them. In dimension at least three, no cost operator with exponent $p\le1$ comes closer than one third in operator norm. With exponent two the best error is one fifth, with exponent three one ninth and with exponent four one seventeenth. These are also the smallest uniform errors in transport values between pure states, and no combination of noncommuting observables does better.

**The classical ingredients, credited.** The proof of the conjecture rests on two facts about the real line: the "snowflake" metric $|x-y|^{p/q}$ embeds exactly in $L_q$ (Mendel and Naor), and a finite set needs only finitely many coordinates (a compression due to Ball, as recorded by Deza and Laurent). The quantum step is a short use of spectral calculus. The retraction and the exact constants are the main new contributions.

**How the retraction works.** Measure the given observable in one representative state of each block, independently for each block. This produces a random "block observable", and the expected cost of that random observable equals the retracted cost exactly. Averaging cannot increase the operator-norm distance to a block-shaped target, so a best approximation can always be taken block-shaped, and the quantum problem becomes a finite classical one.

**Limits.** Exponent monotonicity concerns observables with finitely many outcomes, as in the conjecture. For four or more levels the paper proves a lower bound (the polygon bound); it is exact for three levels, can be strict when $p>1$ (an explicit counterexample, Proposition 7.6), and is only conjectured to be exact when $p\le1$. The results are for bounded observables; position and momentum are not covered. Whether sums of several noncommuting costs keep the centred cost nonnegative when $p>2$ is open. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks, not peer review.

## Summary for specialists

Write $\Delta_A=A\otimes I-I\otimes A^T$ on $\mathcal H\otimes\overline{\mathcal H}$, $G_p(A)=|\Delta_A|^p$, and let $\mathcal C_p(\mathcal H)$ be the finite sums of $G_p(A_k)$ with $A_k$ selfadjoint of finite spectrum; $\mathcal C_\infty$ is the limiting cone of Bunth, Pitrik, Titkos and Virosztek (BPTV). Put $r=\max\{p,1\}$.

- **Theorem 2.1** *(proof)*: for $0<p<q<\infty$ and $A$ with $n$ distinct eigenvalues, $G_p(A)=\sum_{k\le m}G_q(B_k)$ with $m\le\binom n2$ and each $B_k$ a real function of $A$. Hence $\mathcal C_p\subseteq\mathcal C_q$ for $0<p\le q\le\infty$ (BPTV Conjecture 9), and Corollary 4.3 completes the hierarchy.
- **Theorems 2.2 and 6.1** *(proof)*: for spectral blocks $P_1,\dots,P_n$ the map $T_P$ is positive, operator-norm contracting and idempotent, fixes every block target $D_P(a)$ and maps $\mathcal C_p$ onto $\{D_P(d):d\in\mathcal L_p^n\}$, where $\mathcal L_p^n$ is the cone of arrays $(|b_i-b_j|^p)$. Hence the operator-norm distance from $D_P(a)$ to $\mathcal C_p$ is the $\ell_\infty$ distance from $a$ to $\mathcal L_p^n$, attained by block observables. Propositions 6.3 and 6.4 give the same errors for pure-state transport values and, in finite dimension, for every unitarily invariant norm.
- **Theorem 7.2** *(proof)*: for three eigenvalues with gaps $a,b$ and $q>r$, the distance from $G_q(A)$ to $\mathcal C_p$ is the unique root $\delta$ of $(a^q+\delta)^{1/r}+(b^q+\delta)^{1/r}=((a+b)^q-\delta)^{1/r}$; for $q\le r$, $G_q(A)\in\mathcal C_p$.
- **Propositions 7.5, 7.6 and Conjecture 7.7**: a polygon lower bound for any number of levels, exact for three; strict for the spectrum $0,1,9,10$ with $p=3$, $q=6$ (bound about $6300.58$, best single function about $9224.3$); conjectured exact for $p\le1$.
- **Theorems 8.1, 8.2 and Corollary 8.3** *(proof)*: $\mathcal C_\infty(\mathbb C^d)$ is the set of separable positive operators that annihilate the vectorised identity and are invariant under the adjoint map; for $\dim\mathcal H\ge3$ and $u\perp v$, the distance from $E_{uv}$ to $\mathcal C_p$ is $1/(1+2^r)$; for $d\ge3$ the worst trace-one element of $\mathcal C_\infty$ is at distance $1/(2(1+2^r))$.
- **Proposition 9.1 and Proposition 10.1** *(proof)*: the extreme rays of every cone are classified; for $0<p<2$ a single-observable cost with $n$ eigenvalues needs exactly $n-1$ quadratic costs.
- **Theorem 5.2 and Corollary 5.3** *(proof)*: for $A$ with $n$ distinct eigenvalues, $S_{G_p(A)}\ge0$ on all states, equivalently on pure states, equivalently $G_p(A)\in\mathcal C_2$, holds exactly when $p\le2$ or $n\le2$. For $0<p<2$ and $C\in\mathcal C_p$, the divergence obeys

$$d_C(\rho,\omega)\le 2^{2/r-1}\bigl(d_C(\rho,\tau)+d_C(\tau,\omega)\bigr),$$

with a constant that cannot be lowered, already on $\mathbb C^2$ with pure states.

## Technical account

**From the line to spectral blocks.** If $A=\sum_i\lambda_iP_i$, then $G_p(A)=\sum_{i,j}|\lambda_i-\lambda_j|^pP_i\otimes P_j^T$. So $G_p(A)$ lies in $\mathcal C_q$ as soon as the array $(|\lambda_i-\lambda_j|^p)$ is a finite sum of arrays $(|b_i-b_j|^q)$. For $p<q$ this is the statement that the snowflake $|x-y|^{p/q}$ of a finite subset of the line embeds in $\ell_q$ with exponent $q$. A Fourier integral (Lemma 3.1) gives an exact embedding in $L_q$, and Carathéodory's theorem on a compact parameter set gives at most $\binom n2$ coordinates.

**The retraction.** Choose a unit vector $e_i$ in each block and set $T_P(C)=\sum_{i\ne j}c_{ij}\,P_i\otimes P_j^T$ with $c_{ij}$ the product-vector entry of $C$ at $e_i\otimes\bar e_j$. Each coefficient has modulus at most $\|C\|$ and the projections are orthogonal, so $T_P$ is contracting. For a finite-spectrum $B$, drawing independent eigenvalues $b_i$ of $B$ with the probabilities given by $e_i$ shows that $T_P(G_p(B))$ is the expected cost of the random block observable $\sum_ib_iP_i$, so it lies in $\{D_P(d):d\in\mathcal L_p^n\}$.

**Exact constants.** Product-vector entries of every element of $\mathcal C_p$ satisfy a triangle inequality with exponent $1/r$ (Lemma 7.1). For the edge $E_{uv}$ a third orthogonal vector forces $(1-\varepsilon)^{1/r}\le2\varepsilon^{1/r}$ for any approximation with error $\varepsilon$, which gives the lower bound $1/(1+2^r)$. It is attained by $G_p(\delta^{1/p}(P_u-P_v))$ when $p\ge1$ and by $\tfrac13G_p(P_u)+\tfrac13G_p(P_v)$ when $p\le1$.

**The sign of the centred cost.** On pure states the centred cost of one observable is an energy-distance-type quadratic form in the measurement probabilities, so it is nonnegative exactly when the array $(|\lambda_i-\lambda_j|^p)$ has negative type, which for three or more distinct values happens exactly when $p\le2$ (Schoenberg). For $p>2$ an explicit pair of states gives a negative value.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/quantum-transport-cost-cones.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 18-page paper. The paper opens with a plain introduction, a table of what was known and a roadmap, and ends with open problems. No proof assistant was used.
- **Computational checks.** `verify_transport.py` checks, on random finite-dimensional instances with complex bases and noncommuting observables: the spectral identities and conventions; the sampling identity, contraction and idempotence of the retraction; the unitarily invariant reduction with a Monte Carlo check; the explicit approximants and errors of the three-level formula and the edge distance; a random local search over sums of three noncommuting observables that never beats the edge bound; the pure-state identity and negative witnesses of the sign theorem and the sharp constant; the Fourier constant; the quadratic Gram ranks; and the polygon computations (400 random instances, 200 cut-cone linear programmes) and the numbers of the counterexample. These are checks of the proofs, not substitutes for them.
- **Tests that can fail.** The script uses no `assert`, so its checks stay active under Python's optimised mode; with `--negative-control` it perturbs the edge constant and fails under `python -O`, as it must.
- **Replay.** The script was rerun from fresh copies before release, normally and under `python -O`, with pinned numpy and scipy; the recorded output was reproduced byte for byte. GitHub CI reruns it under `-O` with the negative control as a blocking job, and in normal mode as a non-blocking job.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review by a second AI model and a clean replay found no mathematical error and led to one revision round. It added a plain introduction and a table of known results, fuller attribution, the sign dichotomy, the sharp relaxed triangle constant, the pure-state and unitarily invariant versions and the polygon bound. A re-review, proof audits and a second-model audit of the new proofs followed; the audit refuted a stronger conjecture for $p>1$, which became Proposition 7.6 with a written proof. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Monotonicity is proved for observables with finitely many outcomes; the results are for bounded observables. For four or more levels only the polygon lower bound is proved, and its exactness for $p\le1$ is a conjecture. The sign of the centred cost for several noncommuting costs with $p>2$ is open. Attributions rest on a bounded literature search. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in quantum optimal transport | The cone inclusions show when a quantum $p$-Wasserstein divergence is well defined; the sign rule shows which single-observable costs keep the centred cost nonnegative | Finitely many outcomes for the inclusions; bounded observables |
| Researchers computing quantum transport costs | The retraction turns best approximation of block-shaped cost operators into a finite classical problem with exact answers in key cases | For four or more levels only a lower bound is proved |
| Metric-embedding specialists | A quantum application of snowflake embeddings and of the cut and $\ell_p$ distance cones | The classical facts used are known and credited |
| Research agents | Machine-readable claims, an agent index, a prior-art record and a replayable script | The script checks the proofs; it is not part of them |

## Why the problem matters

Quantum optimal transport gives ways to compare quantum states by the cost of turning one into another. The channel-based theory of De Palma and Trevisan has a well-understood quadratic case, but extending it to other exponents needs to know which costs keep the centred cost nonnegative. The conjecture of Bunth, Pitrik, Titkos and Virosztek was the natural route; this paper settles it, explains exactly how well other costs can be imitated, and draws the exact line at $p=2$ for single observables.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from a directory outside the package (Python 3.12 with the pinned packages in `requirements.txt`; about 80 seconds):

```sh
V=/absolute/path/to/package/verification
shasum -a 256 -c MANIFEST.sha256          # at the package root
python3 -m pip install numpy==2.3.5 scipy==1.17.0
python3 -O -I -B "$V/verify_transport.py" --output /tmp/qtc.json
python3 -O -I -B "$V/verify_transport.py" --negative-control --output /tmp/neg.json   # must fail
```

`ENVIRONMENT.txt` lists the software used. `AI_INDEX.md` maps each claim to its proof and checks, `PRIOR_ART.md` records what was known for each result, `RESEARCH_GATES.json` gives the prior-work boundary, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Prove or refute Conjecture 7.7: is the polygon bound exact for every number of levels when $p\le1$, and what replaces it when $p>1$?
2. For $p>2$, decide which sums of several noncommuting costs keep the centred cost nonnegative.
3. Find the least number of exponent-$q$ observables needed in Theorem 2.1 for general $p<q$.
4. Extend the inclusions and the sign results to unbounded observables such as position, with finite moments.

## What is in the evidence package

The paper (LaTeX source and PDF); `verification/verify_transport.py` and its recorded output; `requirements.txt`; `PRIOR_ART.md`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflows and SHA-256 sums.
