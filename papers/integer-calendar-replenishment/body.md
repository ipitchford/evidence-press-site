## Summary

Picture a depot that restocks cash machines, fuel tanks or vending machines along a branching road network. Each client holds enough stock for a fixed number of days, its **turnover time**, so it must be visited at least once in every window of that many days. Each day a vehicle leaves the depot, serves that day's clients and returns. Serving clients on the same road on the same day saves travel. But an early visit resets the client's clock, and its next deadline then arrives sooner too. The question is how close a feasible calendar can come to the lowest possible long-run average cost.

In 2022, Bosman and co-authors introduced this problem. They gave calendars that cost at most **twice** the best possible on tree-shaped networks, and asked whether the factor two could be improved. This release shows that it can:

- **The main result.** Give every client an internal clock taken from one shared ladder of periods (each period is a power of two times a common base), choose the base well, and round each clock's *event times*, not its period, up to whole days. No deadline is ever missed, clients that share a road stay synchronised, and the long-run cost is at most **1/ln 2 ≈ 1.44** times the best possible. The calendar is computed quickly and exactly.
- **The guarantee is exact for short calendars.** The calendar repeats within the longest deadline. For every calendar with that property, 1.44 is exactly the worst case.
- **The price of constant gaps.** The catch is that a client may be visited with gaps such as 2, 1, 2, 1 days. If every client must instead keep a constant gap, with the gaps dividing one another (as in Bosman et al.'s calendars), the best possible factor is **about 1.60**. That is still better than two.
- **When the simple lower bound is exact.** The paper gives exact rules for when the standard lower bound on cost can be attained, and solves the smallest case where it cannot.

Here is a small example. Two clients sit on one road, with deadlines of 2 and 3 days. Visiting both every second day costs 3 per day. The integer calendar visits the near client on days 2, 3, 5, 6, … and the far client every third day. It costs 8/3 per day, which is the best possible.

These are mathematical guarantees about worst cases. All test instances are synthetic, and nothing here estimates operational savings.

## Summary for specialists

Clients $i$ have integer turnovers $\tau_i$, and a schedule serves $S_t$ on day $t$ with every gap at most $\tau_i$. The daily cost $f$ is normalised, monotone and submodular; for rooted trees, $f_T(S)=\sum_e 2c_e\,\mathbf 1\{S\cap D(e)\neq\varnothing\}$. $\operatorname{OPT}$ is the infimum over all repeating feasible schedules. With greedy weights $a_i=f(N_i)-f(N_{i-1})$ in turnover order, $L_f=\sum_ia_i/\tau_i\le\operatorname{OPT}$.

- **Theorem 1.** For $1\le\alpha<2$ let $p_i=\alpha2^{\lfloor\log_2(\tau_i/\alpha)\rfloor}$ and serve $i$ on the days $\lceil kp_i\rceil$. The calendars are feasible and nested, the daily sets are prefixes, and $C(\alpha)=\sum_ia_i\min\{1,1/p_i\}$. A log-uniform phase gives $\mathbb E\,C=W_1+(L_f-W_1)/\ln2$. An exact $O(n\log n)$ breakpoint sweep finds a phase at least this good, with cycle $P\le\tau_{\max}$. On trees this improves the factor 2 of Bosman et al. against the same optimum (Corollary 1).
- **Theorem 7 and Corollary 2.** On stars with turnovers $M,\dots,2M-1$, every $P$-periodic schedule with $P\le\tau_{\max}$ costs at least 1, while $\operatorname{OPT}=H_{2M-1}-H_{M-1}\to\ln2$. Hence $\sup\operatorname{OPT}_{\text{short}}/\operatorname{OPT}=1/\ln2$. With an $\varepsilon$-trunk, the full algorithm, branch refinement included, is tight on trees.
- **Theorem 9.** A divisor chain $1=c_0\mid c_1\mid\cdots$, continued by doubling, serves $i$ every $c(\tau_i)$ days. A distribution $\pi$ over chains gives a deterministic constant-gap algorithm with factor $\rho(\pi)=\sup_q\mathbb E_\pi[q/c(q)]$. The chain mixtures give $12/7$, $48/29$ and $\le1.60139$. An explicit 17-leaf star shows that every assignment of pairwise-dividing constant gaps costs at least $1.60010\cdot\operatorname{OPT}$. So $1.60010\le\rho_H\le1.60139$.
- **Theorems 2–5.** Two nested edges with gaps $a\le b=ma+r$ and costs $u,v$ have optimum $u/a+v/b+\min\{(a-r)u/(ab),\,rv/(mab)\}$. $L_T$ is attained iff $q_e\mid q_g$ for positive-cost ancestor pairs. For coverage costs, the condition is $\operatorname{lcm}\{q_A:A\ni i\}\le\tau_i$ for every client. Two-edge penalties pool into a polynomial-size LP lower bound.
- **Theorem 8.** On the witness stars, the best cost with global cycle budget $B$ is $g(B/M)$ up to $1/M$, where $g(h)=h^{-1}\int_1^2\lceil h/x\rceil\,dx$.

## Technical account

**Rounding events, not periods.** Classical inventory theory picks real periods from one power-of-two ladder with a random logarithmic offset (Roundy; Teo and Bertsimas). That costs a factor $1/\ln2$ in expectation, because $\mathbb E[1/p_i]=1/(\tau_i\ln2)$. The difficulty here is integrality under *hard maximum gaps*. Rounding a period up can break the deadline; rounding it down breaks nesting with other clients. Rounding each event time $kp_i$ up to an integer day avoids both problems. Every gap is $\lfloor p_i\rfloor$ or $\lceil p_i\rceil\le\tau_i$. Each event of a longer clock is also an event of every shorter clock, so after identical rounding the service days remain nested. Nesting makes every day's set a prefix of the clients in turnover order, and the submodular cost then telescopes exactly into the greedy weights.

**Exact phase choice.** The cost (9) is piecewise $1/\alpha$ between breakpoints $r(q)=q/2^{\lfloor\log_2q\rfloor}$. It is nonincreasing on each piece, and its left limit at 2 equals its value at 1. One sorted sweep therefore finds the optimal phase in exact rational arithmetic. That sweep coincides with the Han–Tyan harmonic specialisation known in real-time scheduling, which the paper credits.

**Why 1/ln 2 is exact for short cycles.** On the octave stars $M,\dots,2M-1$, a cycle of length $P\le2M-1$ must serve every leaf at least $\lceil P/q\rceil$ times. Counting gives at least $P$ services per cycle, so the cost is at least 1. The independent optimum tends to $\ln2$. The same family is the classical worst case for single-integer reduction in pinwheel scheduling, where it gives the density threshold $\ln2$.

**Constant gaps.** Chain calendars are exactly the nested constant-gap calendars, which is the shape of Bosman et al.'s output. For $q$ beyond the largest chain top, $q/c(q)=2^{\{\log_2q-\log_2t\}}$. The expected ratio is then increasing between logarithmic breakpoints, so its supremum is a finite maximum of left limits (Lemma 4). All bounds are recomputed in exact rationals. The lower bound enumerates all 15,374 divisor chains with elements up to 511. The gap between about 1.60 and 1.44 is a price of integrality: a real ladder can slide continuously, but below its top an integer ladder must use divisors.

**What is known and what is new.** The power-of-two rounding, the logarithmic shift, the greedy submodular weights, the breakpoint sweep and the constant $1/\ln2$ are classical. The octave witness family is classical in pinwheel scheduling, and rounding real periods to integer days has close precedent in real-period pinwheel work. The new content is their combination into integer-day calendars with a guarantee against the unrestricted optimum, the exact short-cycle price and tightness, the constant-gap bracket, and the structural criteria.

## Evidence, assurance and limitations

- **Proofs:** every theorem has a written proof in the manuscript.
- **Exact certificates:** there are 192 small-tree optima, 4 broom optima and 100 coverage-cost optima. Each carries an attaining cycle and integer potentials, so no solver has to be trusted. The constant-gap bounds are recomputed in exact rational arithmetic. A separate checker tests 4,680 turnover tuples and 14,040 submodular cost tables against the calendar formulas.
- **Replay:** every verifier was run from a fresh extraction of the frozen archive, in normal and optimised Python. Every computation was regenerated into a separate directory, with identical optima and counts. Thirteen semantic negative controls corrupt an optimum, a potential, a cycle or a coverage record; each must be rejected, and all are. GitHub CI repeats the exact checks on Linux.
- **Review:** internal and AI-assisted only. It comprised a five-role first round, an outside-model adversarial review, a clean replay, a re-review and two proof audits of the new results. No reviewer found an error in any theorem. There has been no external peer review, no independent reproduction and no formal verification.
- **Priority:** not claimed. A 2025 DTU MSc thesis titled *Approximation Algorithms for Replenishment Problems with Fixed Turnover Times* could not be obtained. Han and Lin's distance-constrained scheduling papers could not be read in full.
- **Scope:** deterministic deadlines and long-run average cost. The model has no capacity, holding cost, stochastic demand or peak-day objective. All instances are synthetic.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Approximation-algorithms and scheduling researchers | An improved, tight-for-short-cycles guarantee for fixed-turnover replenishment, and a constant-gap bracket | Hardness on trees, general constant gaps and longer cycles remain open |
| Operations researchers in inventory routing | A simple, exact construction of feasible integer calendars for submodular costs | Average cost only; nested calendars put every client on one peak day |
| Logistics planners (cash, fuel, vending, maintenance) | A worst-case benchmark of at most 44% above optimal routing cost, and a clear trade-off between short global cycles and constant per-client gaps | Synthetic tests only; no capacity, demand uncertainty or weekly calendars |
| Research agents | Machine-readable claims, exact certificates and replayable verifiers | The finite checks confirm bounds and examples, not the universal theorems |

## Why the problem matters

Recurring service with hard deadlines appears in cash replenishment, fuel delivery, maintenance and patrolling. Average visit frequencies alone do not give a feasible schedule, and synchronising clients that share a road is where the savings lie. Bosman et al.'s factor two was the best known guarantee on trees. Routes through deadline aggregation give factor 2 in general, and 1.574 only on depth-two trees, and only in pseudo-polynomial time. This release lowers the guarantee to 1/ln 2 in polynomial time. It shows exactly what a short global cycle costs, and it separates the price of insisting on constant per-client gaps.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3:

```sh
shasum -a 256 -c SHA256SUMS
python3 -B -I -S -O verification/verify_exact_certificates.py --report /tmp/tree.json      # 192 tree optima
python3 -B -I -S -O verification/verify_constant_gap_chains.py --report /tmp/chains.json   # 12/7, 48/29, 1.60010–1.60139
python3 -B -I verification/negative_controls.py --workdir /tmp/negctl                      # 13 corruptions must fail
python3 -B verification/run_verification.py      # full sequence (needs NumPy and SciPy)
```

To see the key example by hand, take a path with edges of length 1 and 2 and deadlines 2 and 3. The round-trip weights are 2 and 4. At phase $3/2$ the clocks are $3/2$ and $3$, so the near client is served on days $\lceil 3k/2\rceil=2,3,5,6,\dots$ and the far client on days $3,6,\dots$. Over three days the costs are $0,2,6$, an average of $8/3$. The two-edge formula gives the same value as a lower bound. `AI_INDEX.md` maps every result to its evidence.

## The most valuable next projects

1. Obtain the 2025 DTU thesis, or an account of its results, to settle priority.
2. Decide the complexity of the tree problem; Bosman et al. conjecture that it is hard.
3. Find whether constant-gap policies whose gaps need not divide one another can reach $1/\ln2$, and pin down $\rho_H$ between $1.60010$ and $1.60139$.
4. Use longer, structured cycles on trees with shared trunks to beat $1/\ln2$, and control the peak day.

## What is in the evidence package

The package contains:
- the 26-page manuscript (PDF, Markdown and LaTeX), its figures and supplementary derivation notes;
- the exact-arithmetic calendar implementation, the independent checkers and the certificate generators;
- the standard-library verifiers, all certificates and data, the negative controls and the CI workflow;
- the rating-free review summary, the dated novelty reports and the priority addendum;
- the claim, status, assurance, provenance and research-gate records, and the citation audit;
- an agent index, licences (CC0-1.0 for text and data, MIT for code) and SHA-256 sums.
