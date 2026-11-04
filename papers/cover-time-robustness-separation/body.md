## Summary

**The setting.** Picture a walker exploring a network: at each step it moves to a neighbour chosen uniformly at random. Two classic numbers measure how long exploration takes. The **hitting time** is how long, in the worst case, the walker needs to reach one particular vertex. The **cover time** is how long it needs to visit every vertex at least once. Covering is, roughly, a long sequence of hitting problems, so the two are closely linked.

**The question.** In *Markov Chain Robustness* (ITCS 2026), David Zuckerman asked how fragile these numbers are. Suppose an adversary may nudge every transition probability by a small relative amount: each probability $p$ may become anything between $(1-\varepsilon)p$ and $(1+\varepsilon)p$, the adversary choosing freely at every step with knowledge of the whole past. How large can $\varepsilon$ be before the expected time grows by more than a fixed factor $C$, say doubles? Call that largest $\varepsilon$ the *tolerance*. Zuckerman conjectured (his Conjecture 1.17) that the tolerance for hitting time and the tolerance for cover time always agree up to a constant factor.

**The answer: no.** The paper builds graphs on which covering is robust while hitting is fragile.

- **The graph.** Take a complete graph (every vertex joined to every other) on a huge number $N$ of vertices, give each vertex its own private leaf, and attach one extra path of length $L$ to one vertex. The theorem takes $N=2^{2^L}$.
- **Why hitting is fragile.** The hardest target is the far end of the path. A small, consistent push away from it compounds over the $L$ steps of the path, so the hitting-time tolerance shrinks like $1/L$.
- **Why covering is robust.** Covering is dominated by collecting all $N$ private leaves, a coupon-collector task that costs far more than reaching the path's end. An adversary can only inflate that collection cost by the bounded factor $(1-\varepsilon)^{-2}$, so the cover-time tolerance stays a fixed positive number.
- **The numbers.** Before the expected time doubles ($C=2$), covering tolerates $\varepsilon\approx0.293$ however long the path, while hitting tolerates only about $0.628/L$. The ratio of the two tolerances grows like $\log\log|V|$, so no constant can link them.

**What it does not do.** The graphs have vertices of enormous degree; whether the conjecture holds for graphs of bounded degree (which the source paper mentions having in mind) is open. The graphs are astronomically large: this is a theorem about limits, not about networks of practical size. The stronger adversary that may move an $\varepsilon$ fraction of probability anywhere is not analysed for cover time, and the converse comparison and the largest possible separation are open. The small computer checks support the formulas but do not prove the asymptotic statements.

**A sibling release.** [*Small diameter does not control hitting-time robustness*](https://evidencepress.org/releases/diameter-hitting-time-robustness/) (DOI [10.5281/zenodo.23575572](https://doi.org/10.5281/zenodo.23575572)) answers a different question from the same source paper, Conjecture 1.16, about hitting-time robustness and graph diameter. It does not treat cover time and uses a different mechanism; the two releases are separate candidates, not confirmations of each other.

The sections below move from this overview to a specialist summary, the technical argument, evidence and limits, and how to rerun the checks.

## Summary for specialists

Nonlazy simple random walk $P$ on a connected simple graph; admissible adversary: at each time, conditional on the full history, any stochastic row with $(1-\varepsilon)P\le Q\le(1+\varepsilon)P$ entrywise. $t^+_R(\varepsilon)$ is the worst-case robust hitting or cover time and $\rho_R(G;C)=\sup\{\varepsilon: t^+_R(\varepsilon)\le C\,t_R\}$. Let $G_L$ be $K_N$ with a private leaf on each vertex and a pendant path of length $L$, with $N=2^{2^L}$, and $g(a)=(e^{2a}-1)/(2a)$.

- **Theorem 1.1.** For every fixed $C>1$: $L\rho_{\rm hit}(G_L;C)\to a_C$ where $g(a_C)=C$, and $\rho_{\rm cov}(G_L;C)\to\min\{1-C^{-1/2},1/3\}$. Hence $\rho_{\rm cov}/\rho_{\rm hit}=\Theta_C(\log\log|V|)$, for every fixed pair of budgets, contradicting Conjecture 1.17.
- **Profiles.** $t_{\rm hit}\sim N^2L$, $t_{\rm cov}\sim N^2\log N$; $t^+_{\rm hit}(a/L)/t_{\rm hit}\to g(a)$; $t^+_{\rm cov}(\varepsilon)/t_{\rm cov}\to(1-\varepsilon)^{-2}$ for $\varepsilon<1/3$ and $\to\infty$ for $\varepsilon>1/3$.
- **Consistency with Zuckerman's Theorem 1.15.** That theorem gives $\rho_{\rm cov}\gtrsim\rho_{\rm hit}$ when $t_{\rm cov}=\Theta(t_{\rm hit}\log n)$; here $t_{\rm cov}/(t_{\rm hit}\log|V|)\sim1/L\to0$, so the family lies outside its hypothesis and the separation runs in the direction it leaves open.
- **Theorem 1.2.** Uniformly on compact $\varepsilon$-intervals, $t^+_{\rm cov}/(N^2\log N)=a_\varepsilon+b_{L,\varepsilon}e^{-a_\varepsilon/b_{L,\varepsilon}}+O(1/\log N)$ with $a_\varepsilon=(1-\varepsilon)^{-2}$ and $b_{L,\varepsilon}=a_\varepsilon\sum_{j<L}r^j/\log N$, $r=(1+\varepsilon)/(1-\varepsilon)$. At $\varepsilon=1/3+z/L$ the multiplier tends to $9/4+\beta(z)e^{-(9/4)/\beta(z)}$, so the exact critical multiplier is $9/4+9/(8\log2)\approx3.873$. Corollary 9.2 gives tolerance expansions through order $1/L$ for every budget, with a $(\log\log L)/L$ correction at the crossover budget $C=9/4$.

## Technical account

**Bellman verification (Section 2).** For a target set $A$, any nonnegative $h$ vanishing on $A$ with $h(x)\ge1+\max_{q}\sum_y q(y)h(y)$ over the admissible row polytope bounds $\mathbb E\,T_A$ for every history-dependent adversary; a stationary policy attaining equality gives the matching lower bound. This is the standard robust dynamic-programming principle (Iyengar; Nilim and El Ghaoui), specialised to hitting times.

**The hard endpoint (Section 3).** With $r=(1+\varepsilon)/(1-\varepsilon)$, the worst endpoint value from the root is solved exactly as $A\,S_L(r)+2T_L(r)/(1-\varepsilon)$, where $S_L$ and $T_L$ are finite geometric sums. On the scale $\varepsilon=a/L$ this gives the averaged exponential $g(a)$, hence $L\rho_{\rm hit}\to a_C$ (Sections 7–8, with a commute-time bound for all other targets).

**Leaves and excursions (Sections 4–6).** Lemma 4.2 deletes excursions into the path from the walk on the base graph (clique plus leaves) at a controlled cost. Proposition 5.1 solves the robust time to hit a set of $k$ remaining leaves exactly, $[(N+1)^2-\varepsilon^2]/[k(1-\varepsilon)^2]-2\varepsilon/(1-\varepsilon)$, and summing over the coupon-collector phases gives the robust base cover time $N^2\log N/(1-\varepsilon)^2$. The path endpoint then adds a cost of order $N^2S_L(r)$, negligible against $N^2\log N$ while $r<2$, that is $\varepsilon<1/3$, because $\log N_L=2^L\log2$.

**Uniform response (Section 9).** The cover time is the maximum of the leaf-collection time (concentrated near $N^2\log N\cdot a_\varepsilon$) and the endpoint time (approximately exponential with mean $N^2\log N\cdot b$). A martingale stopped at the successful endpoint trial controls the positive part $\mathbb E(H-T)_+$ uniformly over adversaries, and one explicit policy attains both estimates at once, giving $a+be^{-a/b}$ without assuming independence.

## Evidence, assurance and limitations

- **Proofs.** All main claims have written analytic proofs; every upper bound allows arbitrary history-dependent adversaries.
- **Exact small checks.** `verify_markov.py` performs 63 exact rational checks (fixed-policy hitting times, endpoint Bellman solutions and remaining-leaf Bellman values, including exact maximisation of every Bellman row) and solves the adaptive cover problem on three small graphs at $\varepsilon=1/4$ (multipliers about 1.648, 1.973 and 1.681).
- **High-precision checks.** `verify_critical.py` computes 60 endpoint-survival probabilities at 80–128 digits in 12 critical-window cases; at the critical point the largest deviation from the limiting exponential falls from about 0.065 at $L=2$ to 0.0028 at $L=7$.
- **Replay.** All scripts were rerun from fresh copies with and without Python `-O`; checks are explicit tests, not `assert`, and a deliberately corrupted formula is rejected under `-O`. GitHub CI reruns them.
- **Limits.** Unbounded degree; astronomically large graphs; finite checks are supplementary and are not interval certificates; strong-adversary cover tolerance, bounded-degree and regular versions, the converse and the maximal separation are open. Prior-art searches were bounded (1 November 2026). Review was internal and AI-assisted only; this remains an unrefereed candidate.

## Who should care, and why

- **Theorists of random walks and Markov chains**: robustness of "reach one target" and "explore everything" must be assessed separately; one does not control the other even up to constants.
- **People designing robust exploration or robust Markov decision process benchmarks**: a worst-case model can rate coverage objectives as stable while single-target objectives on the same instance are fragile, so conclusions about one objective do not transfer to the other.
- **Readers of Zuckerman's paper**: an explicit answer to Conjecture 1.17, complementing the sibling release on Conjecture 1.16.

## Why the problem matters

Relative-error robustness asks whether a stochastic process's guarantees survive small systematic modelling errors or adversarial control. If hitting and cover robustness always agreed, one analysis would serve both. The separation shows that the answer depends on which objective is asked, and pins down exactly how far apart the two can be on one natural family.

## How to inspect or reproduce the recorded checks

From the unpacked archive (Python 3.12), on a copy because the scripts rewrite their JSON outputs:

```sh
cp -R markov_robustness /tmp/mr && cd /tmp/mr
uv run --no-project --with numpy==2.3.5 python3 -I -B verify_markov.py
uv run --no-project --with numpy==2.3.5 python3 -I -B verify_critical.py
uv run --no-project --with numpy==2.3.5 --with matplotlib==3.10.8 python3 -I -B plot_profiles.py
```

Each takes about a second. Add `-O` to confirm the checks still run. Exact and high-precision outputs reproduce identically; double-precision cover values may differ in the last digits across platforms.

## The most valuable next projects

1. Decide Conjecture 1.17 for graphs of bounded degree or regular graphs.
2. Prove or refute the converse: is cover robustness always at least a constant times hitting robustness?
3. Find the largest possible ratio $\rho_{\rm cov}/\rho_{\rm hit}$ on $n$-vertex graphs; this family gives $\Theta(\log\log n)$.
4. Determine the cover tolerance of this family under the strong adversary.

## What is in the evidence package

The archive contains the manuscript (Markdown source and PDF), Figure 1 and its plotting script, the two verification scripts with their JSON outputs, exact small-instance fingerprints, the dated novelty report and addendum with the frozen target, the bibliography with the Crossref, DataCite and arXiv records it was copied from, an AI index, research-gate records, the PDF build files, CI configuration and SHA-256 sums. Text and data are CC0-1.0 and code is MIT. This is an unrefereed candidate.
