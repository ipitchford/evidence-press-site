## Summary

**In one sentence.** Under the standard random-voter model, an election outcome with more voting paradoxes can be far more likely than one with fewer: on 78 candidates, an outcome with three more rock-paper-scissors loops is over 100,000 times as likely.

**The setting.** Suppose many voters each rank the same candidates, every ranking equally likely and every voter independent. This *impartial culture* is the standard yardstick of voting theory: it is the model under which the classical paradoxes of voting are counted and against which voting rules are stress-tested. For each pair of candidates, draw an arrow from the head-to-head majority winner to the loser. The result is a **tournament**. A **cyclic triple** is a loop of three arrows, A beats B, B beats C and C beats A: an instance of Condorcet's paradox.

**The question.** Harrison-Trainor (*Mathematical Social Sciences*, 2022) conjectured that, with many voters, an outcome with fewer cyclic triples is always more likely than one with more. He computed the probabilities exactly for three and four candidates and numerically for five, and the conjecture held.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| The conjecture is false | Some outcomes with more loops are exponentially more likely | Theorem 4.3 |
| A checked example | On 78 candidates, three extra loops and more than $10^5$ times as likely; also when outcomes are counted up to relabelling (ratio above 3.3) | Proposition 5.1, Corollary 5.2 |
| Small cases (estimates) | No reversal with seven or fewer candidates; reversals with 13 (by about 1%) and 14 (by a factor of about 2.7) | Section 5.2 |
| The surviving half | Fully ordered (loop-free) outcomes are exactly the most likely ones, for every number of candidates | Theorem 6.1 |
| What win totals reveal | Outside the Bradley–Terry model, outcomes with the same win totals differ in likelihood by factors exponential in the number of pairs, and a calibrated test detects this from one round robin | Theorem 7.1, Section 8 |
| One game per pair | Not enough for the worst-case Bradley–Terry–Luce test of Makur and Singh at constant separation; whether a constant number of games per pair suffices is open | Proposition 9.1 |

**Why the conjecture fails.** Split the candidates into ordered groups ("blocks"): everyone in a stronger block beats everyone in a weaker one, and inside a block everyone wins half their games. To produce such an outcome, the candidates' hidden strengths must separate the blocks, which is cheap, while every pair inside a block must be almost tied, which costs about a factor of two per pair. Loops also live inside blocks. Pairs grow like the square of the block size and loops like its cube, so a pattern of blocks can have more loops yet fewer almost-tied pairs. On 14 candidates, for example, the pattern $(1,1,1,9,1,1)$ has two more loops than $(7,7)$ but is estimated to be about 2.7 times as likely.

**Credit.** The conjecture is Harrison-Trainor's. The Gaussian many-voter limit is due to Harrison-Trainor and to Hązła, Mossel, Ross and Zheng. The qualitative characterisation of models whose win totals determine probabilities is due to Lauritzen and to Iyer. The masking construction behind the replication result is due to Rastogi, Balakrishnan, Shah and Singh, and the replication question to Makur and Singh.

**Limits.** Impartial culture is a mathematical null model, not a description of real elections. All election results are in the limit of many voters, with no finite electorate size given, and the tournaments involved are individually very improbable. The smallest counterexample is not determined: it is certified at 78 candidates and lies between 8 and 13 on the numerical evidence. The Part II results hold for a fixed model, and the tests have modest power at the sizes of real leagues. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks.

## Summary for specialists

Let $p(T)$ be the limit, as the number of voters $N\to\infty$ through odd values with $n$ fixed, of the probability that the majority tournament is the labelled tournament $T$. With outdegrees $d_v$, Harrison-Trainor's linearity is $\operatorname{lin}(T)=\sum_v d_v^2$, and the number of cyclic triples is

$$c(T)=\binom n3-\tfrac12\operatorname{lin}(T)+\tfrac12\binom n2 .$$

His conjecture (Conjecture 6.3 of the arXiv version) says $\operatorname{lin}(T)>\operatorname{lin}(U)$ implies $p(T)>p(U)$.

- **Theorem 3.1** *(proof)*: for every $T$ on $n$ vertices, with $M_T$ the maximum of a concave function built from the arcs of $T$,
$$\log p(T)\le M_T,$$
$$\log p(T)\ge M_T-\tfrac{n-1}2\log(n+1).$$
- **Proposition 4.2** *(proof)*: for an ordered regular block tournament with a fixed number of blocks and $m$ internal pairs, $\log p(T)=-m\log2+O(n\log(n+1))$, while $\operatorname{lin}(T)$ loses $\tfrac1{12}\sum_j(b_j^3-b_j)$.
- **Theorem 4.3** *(proof)*: for odd $t$, blocks $(7t,7t)$ and $(t,9t,3t,t)$ give $c(B_t)-c(A_t)=3t^3$ and
$$\begin{aligned}\log\frac{p(B_t)}{p(A_t)}&=3(\log2)\,t^2\\&\quad+O(t\log(t+1)).\end{aligned}$$
- **Proposition 5.1** and **Corollary 5.2** *(exact certificate)*: blocks $(39,39)$ with a triangle-decomposed regular tournament in each, against circulant blocks $(7,7,49,5,5,5)$: $\operatorname{lin}$ $145275$ against $145269$, $c$ $4940$ against $4943$, and $p(B)/p(A)>10^5$ (rational lower bound about $1.104\times10^5$); $|\mathrm{Aut}(A)|=9$ and $|\mathrm{Aut}(B)|=300125$, so the isomorphism-class ratio exceeds $3.3$.
- **Theorem 6.1** *(proof)*: a compression strictly increases probability, so the transitive tournaments are exactly the maximisers, for every exchangeable latent-strength model with strictly increasing win probabilities.
- **Theorem 7.1** *(proof)*: for a latent-type kernel with values in $(0,1)$, either the model is uniform given the scores (the Bradley–Terry case, qualitatively due to Lauritzen and Iyer) or, with probability tending to one, $T$ has same-score neighbours $e^{\pm cn^2}$ times as probable.
- **Proposition 8.1, Corollary 8.2** *(proof)*: spectral and score-localised triangle tests are exactly calibrated given the scores and consistent against every fixed non-Bradley–Terry kernel.
- **Proposition 9.1** *(proof)*: with one observation per ordered pair, the Makur–Singh minimax error sum at separation $1/64$ is at least $1-\exp[-\binom n2/8]$; with one observation per unordered pair, testing against moderately stochastically transitive alternatives fails with error sum at least $1-\exp(-\lfloor n/3\rfloor^2/128)$ for $n\ge6$.

**Known and new.** Harrison-Trainor computed $p(T)$ for $n\le5$ and verified the conjecture there; Mossel showed the transitive probability is $\exp(-\Theta(n^{5/3}))$; in close elections every tournament is asymptotically equally likely (Hązła et al.). The counterexamples, the certificate, the compression theorem and the exponential gaps are new here. Makur and Singh's upper bound needs $k\ge\max\{2,c\,d_{\max}h\log n/\xi^4\}$ observations per ordered pair and they note it is unclear whether $k\ge2$ is necessary; this paper shows $k=1$ is impossible at constant separation, and whether a constant $k$ suffices remains open.

## Technical account

**Gaussian representation (Section 2).** As $N\to\infty$ the normalised pairwise margins converge to a Gaussian vector in which comparisons sharing a candidate have covariance $\pm1/3$ and disjoint comparisons are uncorrelated. Writing this vector through independent standard normal strengths $X_1,\dots,X_n$ plus independent pair noise, and conditioning on the strengths, gives $p(T)=\mathbb E\prod_{i\to j}\Phi(X_i-X_j)$: the Gaussian-prior marginal likelihood of the probit (Thurstone–Mosteller) paired-comparison model.

**Mode bound (Section 3).** The integrand's logarithm, minus $\|x\|^2/2$, is strictly concave; Taylor bounds at its maximiser sandwich the integral, which gives Theorem 3.1. For a regular tournament the maximiser is at the origin and every pair contributes $\log\Phi(0)=-\log2$.

**Blocks (Section 4).** Placing the blocks at well-separated strength levels makes all cross-block factors close to one at a cost of $O(n\log n)$, while each internal pair still costs about $\log 2$. The linearity of a block tournament depends only on $\sum_j b_j^3$. For $(7t,7t)$ and $(t,9t,3t,t)$ the internal pair counts are $49t^2-7t$ and $46t^2-7t$, while the cubic sums are $686t^3$ and $758t^3$: the second pattern has $3t^2$ fewer pairs to pay for but $3t^3$ more cyclic triples, which gives Theorem 4.3.

**Certificate (Section 5, Appendix A).** For $A$, a sharper concavity bound for $\log\Phi$ on the negative half-line and a tangent bound across blocks give an explicit upper bound on $p(A)$; for $B$, the lower bound of Theorem 3.1 at the block strengths

$$u=\tfrac1{100}(-275,-183,-4,164,219,298)$$

gives an explicit lower bound on $p(B)$. Every constant ($\pi$, $\Phi$, $e^{-h^2/2}$) is enclosed by rationals, and `certificate.py` evaluates the ratio of the bounds exactly. An exhaustive search counts the automorphisms of the 39-vertex blocks; the circulant blocks have exactly $b$ automorphisms each.

**Small cases (Section 5.2).** Each $p(T)$ is estimated by importance sampling from a Student-$t$ distribution centred at the maximiser with the inverse negative Hessian as scale: $2\times10^5$ samples per isomorphism type for $n\le7$, $4\times10^4$ per block pattern for $8\le n\le14$, and four independent runs of $10^6$ samples for the four pairs of Table 1. These are estimates with standard errors, not certificates.

**Compression (Section 6).** For an arc $i\to j$, the compression replaces every path $j\to k\to i$ by $i\to k\to j$. Using only the ordering of the latent strengths, it strictly increases the probability whenever it changes the tournament, and repeated compressions end at a transitive tournament.

**Part II (Sections 7–9).** Outside the Bradley–Terry case, the two orientations of a triangle of given types have different probabilities on a set of positive measure, while reversing a cyclic triangle preserves the scores; packing $\Theta(n^2)$ edge-disjoint triangles gives the exponential gaps and the conditional tests. The replication result mixes over random perturbations whose average is exactly a Bradley–Terry law, so one observation per pair cannot distinguish them.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/majority-tournament-cyclic-reversal.txt) is available for reading.

- **Proofs.** The 19-page paper opens with a plain introduction (the question, why it matters, what was known, what is new, what is not claimed and a roadmap) and gives written proofs of every theorem in two parts, with the certificate arithmetic in an appendix. No proof assistant was used.
- **Exact checks.** `certificate.py` checks the 78- and 319-candidate examples in exact rational arithmetic, builds the triangle-decomposed 39-vertex blocks and counts automorphisms; `example78.py` lists both 78-candidate tournaments pair by pair and recounts all 76,076 triples; `check_compression.py` enumerates all 1,024 tournaments on five candidates; `check_cycles.py` checks exact calibration on all 33,864 labelled tournaments with three to six candidates.
- **Numerical checks.** `check_scan.py` and `check_spectral.py` check the Part II tests against direct evaluation and on positive controls; `power_study.py` reruns the seeded power study of Table 2; `small_reversals.py` is the Monte Carlo small-case study.
- **Tests that can fail.** No check uses `assert`; every check exits with an error on failure, also in Python's optimised mode. Raising the certificate threshold from $10^{10}$ to $10^{11}$ makes `certificate.py` fail.
- **Replay.** The certificate and every check script were rerun from a fresh copy before release; the certificate output, the 78-candidate table and the power table matched the recorded ones byte for byte. GitHub CI reruns them on Linux with the same comparison and the failure test, and reruns the Monte Carlo study with a declared tolerance.
- **Review.** Five internal Claude reviewer roles (editor, domain, perspective, methodology and devil's advocate) in two calls, the lead's replay of the rational certificate and every check script with explicit checks, one revision round with extensions, then a re-review and proof audit of the changed proofs, with the certificate constants recomputed independently. No error was found in a proved statement. No Astra/Codex review took place. Every cited source was obtained and read. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Impartial culture is a null model; the election results are many-voter limits with no finite electorate size; the small-case results for up to seven candidates and for 13 and 14 candidates are uncertified Monte Carlo estimates; the Part II results are pointwise in a fixed model, and the tests have little power for leagues of a few dozen teams; attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Social-choice researchers | Fewer cycles is not a reliable sign of a more likely outcome under impartial culture, while fully ordered outcomes are always the most likely | Many-voter limit of a null model; not real elections |
| Anyone who simulates or weights majority tournaments | Do not use the cycle count as a stand-in for probability | The certified example is large; the smallest counterexample is open |
| Analysts of round robins and pairwise judgements | An exactly calibrated test of the Bradley–Terry model from one round of games, and a reason to compare each pair more than once | Modest power for small leagues; fixed-model results |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The proofs carry the theorems; the small cases are estimates |

## Why the problem matters

The distribution of the majority tournament under impartial culture is the reference distribution for many questions in social choice, such as the chance of a Condorcet winner or of a transitive outcome, and it is the distribution sampled when majority graphs are generated for simulations. Knowing which individual outcomes are likely, and why, describes its shape beyond the classical summary statistics. The result also shows that "orderliness" in the sense of few cycles and "likelihood" come apart: probability is driven by how many pairs must be almost tied.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12, from the `code/` folder:

```sh
uv run --python 3.12 python3 \
  -I -B -O certificate.py
uv run --python 3.12 --with numpy==2.3.5 \
  --with scipy==1.17.0 python3 -E -s -B \
  power_study.py > p.csv
```

The certificate takes seconds and must print the five lines of `results/certificate.txt`; `p.csv` must equal `results/power.csv`. `README.md` lists every script and the comparison policy, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find the smallest number of candidates that admits a reversal; the evidence places it between 8 and 13, and a certificate at 13 or 14 candidates would need validated integration in that many dimensions.
2. Find a correct replacement for the conjecture: a combinatorial statistic that predicts $\log p(T)$ as well as the mode bound does.
3. Decide whether two, or any constant number of, observations per pair suffice for the Makur–Singh guarantee.
4. Give finite-sample power bounds for the triangle tests.

## What is in the evidence package

The paper (`majority.pdf` and its LaTeX source `majority.tex`); eleven scripts in `code/` (the exact certificate, the 78-candidate table, the exhaustive enumerations, the Part II tests and their checks, the power study and the Monte Carlo study); the recorded outputs in `results/`; `requirements.txt`; `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
