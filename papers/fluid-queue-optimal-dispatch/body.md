## Summary

**The problem.** A dispatcher sends each arriving job to one of two identical servers. It can see each job's size and how much work is already waiting at each server. Which rule keeps the total waiting time lowest? The obvious answer, "always join the shorter queue", ignores job sizes. With sizes known, no simple optimal rule is known, even for the simplest random arrivals.

**What was conjectured.** In 2026 Xie, Hyytiä and Righter studied a smoother *fluid* version of the problem. A large backlog drains steadily, and incoming work arrives as a continuous stream of small pieces of different sizes. They showed that shorter jobs should go to the shorter queue and computed optimal paths numerically. They then conjectured that along every optimal path the relative imbalance between the two queues keeps growing until one queue empties.

**What was found.** The paper solves the two-server fluid problem exactly. This holds for every job-size distribution except a single fixed size, and for every load below capacity. The optimal rule fits in one sentence. Jobs smaller than a cutoff go to the shorter queue and larger jobs go to the longer one. The cutoff depends only on how unequal the queues are, and it rises as they drift apart. Once one queue is empty, it is fed exactly enough small jobs to keep it busy (at lower loads it simply takes all the work). This proves the conjecture as it was posed, for sizes with a density, and extends it to every distribution except fixed sizes, where it fails. In the worked example (job sizes 1/2 and 3/2, load 3/4, both queues starting with 1/2 unit of work), the optimal cost is $33/28$. Balanced routing costs $3/2$, so the optimum saves about 21%.

**Why it matters.** Deliberately unbalancing queues sounds wrong but is what the exact solution does. The paper gives the exact formula, a heavy-traffic limit that links it to the best known policy for the real, random system, and practical approximations. It also tests the rule in simulations of the random two-server queue. There, the rule used directly works very well when job sizes vary a lot but fails at high load when they vary little. A stabilised version repairs this. No policy is best in every case.

**Status.** An anonymous, AI-assisted, unrefereed candidate. The theorems have written proofs, and the exact computations can be rerun. The simulations are numerical evidence only. There has been no external peer review or independent reproduction.

## Summary for specialists

Two FCFS servers of rate $1/2$ receive fluid at job rate $\rho\in(0,1)$ with a mean-one size law $S$ that is not a point mass. The cost is the total waiting time of arriving work while a backlog $(u_1,u_2)$ drains. Write $x=u_1+u_2$, $y=|u_1-u_2|$, $z=y/x$, $r=\rho/(1-\rho)$ and $D(h)=\mathbb E|S-h|$.

**Exact solution (Lemma 2 and Theorem 3, proof).** A scalar profile $B$ with $B'=-1/(rD^2)$ and its imbalance map $Z(h)=h/(D(h)B(h))$ give, for $x>y$, the value
$$
V(x,y)=\frac r2\bigl(x^2-kx\bigr)-\frac{y^2}{2h},\qquad h=Z^{-1}(y/x),\quad k=x/B(h).
$$
$V$ is the minimum over *all* admissible controls, including idling and history-dependent ones. The feedback policy sends sizes below $h$ to the shorter queue. On the axis it keeps the empty queue at work rate exactly $1/2$ when $\rho>1/2$. The optimal labelled workload path is unique, except that a tied start has exactly two mirror-image optimal paths; there the closed-loop feedback needs a selection convention (which queue to fill first).

**The conjecture (Theorem 4, proof).** Along every optimal path $z$ is nondecreasing, and strictly increasing while both queues are positive and unequal. The source writes the conjecture as $\hat y'\ge0$ with $'=d/dx$. Read literally, that inequality is false for every nondegenerate law, because $x$ decreases in time. The paper proves the source's verbal, forward-time statement. The proof covers sizes with a density, as the source assumes, and every nondegenerate law. For deterministic sizes some optimal paths decrease the imbalance.

**Further results.**

| Result | Status |
|---|---|
| Heavy traffic: $(1-\rho)V\to\bar P x^2$ uniformly, with $\bar P<1/2$ the fraction of jobs, largest first, carrying half the work ($\Pr(S\ge m)$ at the work median $m$ for continuous laws). The optimal-to-balanced ratio $2\bar P$ equals the CARD-to-least-work-left factor of Xie, Grosof and Scully, a comparison that assumes $\mathbb E S^2<\infty$ (Theorem 10) | proof; stochastic link heuristic |
| The source's printed Proposition 3 (most work left) has an extra factor $2\rho$ in its axis term. Correcting it gives 1.10851 instead of 1.19401 for exponential sizes, and removes a factor 2 from the source's heavy-traffic limit (Section 8) | exact + numerical check |
| No straight-to-origin segment and no balanced dwelling is ever optimal for nondegenerate laws; the size-blind equivalence of the source's Proposition 5 needs $\rho\ge1/2$ (Sections 7–8) | proof |
| Finite size laws: piecewise-quadratic value with an exact rational recurrence and Hamiltonian certificate (Theorem 11) | proof + exact |
| Convex-order brackets and a bin policy with certified regret; Wasserstein-Lipschitz value (Proposition 12, Theorem 14); exact rational enclosure for Pareto shape 1.5 (width $7.0\cdot10^{-4}$) and 1.01 | proof + exact |
| Routing on noisy estimates $\hat S$ has optimal value $V_{\mathbb E[S\mid\hat S]}$, with loss at most $2C_\rho x^2\,\mathbb E|S-\hat S|$; uninformative estimates fall back to the deterministic controller (Proposition 15) | proof |
| Seeded simulation of the stochastic two-server queue against JSW, SITA, Dice and CARD | numerical evidence only |

## Technical account

**How the formula is found (heuristic, Section 3).** The source reduces the two-server problem to a one-dimensional variational problem. Its Lagrangian does not depend on the total backlog $x$, so the Beltrami identity gives a conserved quantity: $yD(h)/h=k$ along an optimal path. Integrating gives $x=kB(h)$, and the value follows. The paper says plainly that this step is short. The economic reading is a break-even size. Sending a job of size $s$ to the shorter queue saves waiting cost in proportion to $y$, but it removes $2s$ units of imbalance, whose shadow price is $k/D(h)$. The cutoff is the size at which the two balance.

**Where the work lies (Sections 5–6).** The candidate must be proved optimal against every admissible control, not only smooth threshold paths. The verification argument handles idling, reflection at an empty queue, the kink of $V$ on the diagonal, atoms in the size law, unbounded support and the infinite horizon. The analytic core is the inequality $Z(h)>r(2m(h)-1)$ (Lemma 2), where $m(h)$ is the work carried by jobs smaller than $h$. It says the slope produced by the optimal cutoff is smaller than the current imbalance, which is why $z$ grows. Identifying *every* optimal control, as the conjecture's quantifier requires, gives uniqueness of the path.

**Fluid versus stochastic (Section 11).** In the fluid model the short queue, once empty, is loaded at exactly its capacity. In the random system it is then critically loaded and idles intermittently, and the rule has no absolute scale to stop the long queue growing. The stabilised rule FLUID-S adds a safety band and a small surplus rate. This is the safety-stock idea from fluid control.

**What is new, and what is classical.** Size-interval routing, join-the-shortest-workload, Dice and CARD are known policies. Verification theorems, state constraints, convex order and the mean-absolute-deviation transform are standard tools, all cited. Within the bounded literature search recorded in the package, no earlier exact solution of this two-server fluid problem or proof of the conjecture was found. That search does not prove priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/fluid-queue-optimal-dispatch.txt) is available for reading.

- **Proofs.** Every theorem and proposition has a written proof, with longer arguments in the appendices.
- **Exact and floating-point checks.** `verify_all.py` writes 13 deterministic JSON files. The exact sections use only rational arithmetic: the finite-support certificate, the running example, the uniform bracket, the Pareto enclosures, the deterministic cases and the comparison with the source's Proposition 3. Floating-point sections cover quadrature on six law families, the heavy-traffic table, a Wasserstein comparison and an independent dynamic-programming cross-check that does not use the value formula (relative error at most $3.1\cdot10^{-5}$). The output was byte-identical in a clean replay and again on the frozen release archive under `python -O`.
- **Negative controls.** Tampered exact values, a wrong sign in $D$, a wrong terminal cutoff, a flipped conjecture check, a biased dynamic-programming check and degenerate or wrong-load inputs are all rejected.
- **Simulation.** Four size laws (exponential, the two-point example, a hyperexponential with squared coefficient of variation 10, and a bounded Pareto law), loads 0.5, 0.75 and 0.9, 20 replications of $10^6$ arrivals, common random numbers and tuning on separate seeds. Used directly, the fluid rule has 0.31–0.60 of join-the-shortest-workload's mean wait for the two highly variable laws. It is 4.3 times worse for exponential sizes at load 0.9 and appears unstable for two-point sizes there. FLUID-S is best or tied in six of twelve cells, tuned Dice in five, and CARD is close behind. **No policy dominates, and these results prove nothing.**
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial audit by a different model, a re-review of the revision and a second adversarial audit of the revised text, whose findings (a tie-break convention, the moment assumption for the CARD comparison, the justification of one Pareto enclosure and some overstated summaries) were corrected before release. A rating-free summary of the objections and their resolution is in the package. This is not peer review, and the recomputations are not independent reproduction.
- **Limitations.** The model has exactly two identical servers, exact sizes known at dispatch, known law and load, FCFS queues and the transient cost of draining a backlog. The passage from the fluid limit to the random system is heuristic. The floating-point quadrature is tested only on the stated domain, narrower than the theorems cover; for Pareto shape 1.01 and very concentrated laws only the balanced state is tested, and the code stops with an error, rather than returning a value, at some interior states. No proof assistant was used. The source's wording was quoted from arXiv v1; the published version prints the same Proposition 3.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Designers of size-aware load balancers | A simple, explicit rule (small jobs to the shorter queue, with a cutoff that rises with imbalance) and evidence that a safety band is needed in practice | The exact optimality is for the fluid model; deliberate imbalance raises the delay of large jobs |
| Queueing and control researchers | A closed-form, globally verified fluid solution, a corrected heavy-traffic constant and a precise link to CARD | The stochastic correspondence is heuristic; asymptotic optimality of FLUID-S is open |
| Researchers in rigorous numerics and research agents | Exact rational controllers and certificates, deterministic outputs and negative controls, reusable as templates | Byte identity shows integrity, not that the code encodes the mathematics; check against the proofs |

## Why the problem matters

Dispatching decides response times in server farms, cloud schedulers and call centres. Size information is increasingly available, through predictions or job metadata, but how best to use it together with queue lengths is unresolved for the random system. A fluid model gives the shape of a good rule and a benchmark. Before this work its optimal paths were known only numerically, and the structural conjecture was open. An exact solution makes the trade-off visible: imbalance is worth paying for because it lets small jobs avoid waiting behind large ones.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12 or later and the pinned packages in `requirements.txt`:

```sh
python3 -B -O -I code/verify_all.py OUT     # about 1 minute; 13 JSON files
python3 -B -I tools/compare_results.py results OUT --bytes
python3 -B -O negative_controls.py          # the checks reject wrong inputs
python3 -B -I code/simulate.py OUT --quick  # 10-second smoke test
shasum -a 256 -c SHA256SUMS
```

The full simulation (`code/simulate.py OUT`) takes about 50 CPU-minutes. Start reading with the policy box in Section 1, the heuristic derivation in Section 3 and the running example. `AI_INDEX.md` maps every result to its proof location, code and output file.

## The most valuable next projects

1. Have a queueing or control specialist check the verification argument of Section 5 and the uniqueness argument of Section 6.
2. Prove that a stabilised fluid rule such as FLUID-S is asymptotically optimal in the stochastic system, at fluid scale or in heavy traffic.
3. Extend the solution to more than two servers or to heterogeneous rates, where the scalar reduction is lost.
4. Make the fluid-to-stochastic link behind the CARD comparison rigorous.

## What is in the evidence package

The manuscript (PDF and LaTeX source), the exact rational solver, the quadrature solver, the independent dynamic-programming check, the verifier and its 13 recorded outputs, the seeded simulation with its output and table generator, the figures, semantic negative controls, a result comparator, a rating-free review summary, the dated prior-art record, claim, status, assurance and provenance records, an agent index, licences (CC0-1.0 for text and data, MIT for code) and SHA-256 manifests. The same files are in the GitHub release and the Zenodo record.
