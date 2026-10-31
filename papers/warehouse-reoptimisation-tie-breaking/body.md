## Summary

**The everyday picture.** In many warehouses a picker pushes a cart with a few bins along the shelves; each customer order goes into one bin, and new orders keep arriving while the picker is out. A natural control rule is to *reoptimise*: whenever the list of known orders changes, compute the fastest way to finish everything currently on it, start that plan, and discard the rest of the plan when new orders arrive. Lorenz, Otto and Gendreau (Networks, 2025) studied this rule in three cart models and conjectured that it is at least safe when orders are rare.

**The example that drives the paper.** Five orders are waiting at the same shelf and the cart has two bins. Any fastest plan needs three trips. The plan (1, 2, 2) takes one order first and then two full cartloads; the plan (2, 2, 1) takes two full cartloads first and the single order last. If nothing else arrived, both would finish at exactly the same moment, so a solver may return either. But orders do arrive during the first trip, and the rest of the plan is thrown away and recomputed. The choice made at this tie decides what the picker faces next, and the next time, and so on.

**What was found.** The tie decides whether the warehouse keeps up. A picker who always takes the remainder first falls further and further behind once demand passes about 76% of what the cart can carry with two bins, about 49% with eight bins, and about 37% (the fraction 1/e) for very large carts. A picker who always fills the cart first keeps up all the way to full capacity. Every other way of breaking the tie lies between these two. The gap survives positive picking times and two distinct shelf locations, and a simple principled rule, breaking ties by the total time at which orders are completed, picks the safe option. Separately, the paper proves the Lorenz–Otto–Gendreau conjecture for all three of their cart models: when orders arrive rarely enough, reoptimisation never builds up a growing backlog, whatever tie rule the solver uses.

**How sure we are.** Every theorem has a written proof; fourteen scripts check the formulas, thresholds and examples with exact or high-precision arithmetic and seeded synthetic simulations. This is an anonymous, AI-assisted, unrefereed candidate; its review was internal, not peer review. The tie result is proved for identical orders at one shelf in the non-interventionist manual-cart model, with two extensions; no warehouse operating data were used, and the safe-at-low-load condition is deliberately cautious.

## Summary for specialists

Cart models Pcart-N (non-interventionist manual cart), Pcart and Robot of Lorenz, Otto and Gendreau (2025); one picker, cart capacity $c$, tour time $b$, Poisson arrivals of rate $\lambda$ and $\rho=\lambda b$ arrivals per tour. Reoptimisation follows a makespan-optimal completion plan of all known orders and replans at every change.

- Clearance certificate respecting batch commitments: each arrival can be appended to the current feasible plan at extra cost at most the solo append charge $B(O)$, namely $M(O)$ for pushcarts and $\min\{u,D+m(O)\}$ for Robot (Proposition 1) *(proof)*
- Low-rate conjecture: if $\lambda\mathbb E B<1$ then the backlog is $O(\log n)$ almost surely and the makespan ratio is $1+O(\log n/n)$, for every exact implementation whatever its tie rule; $\lambda u<1$ suffices for arbitrary order contents; explicit finite-horizon completion, backlog and delay bounds (Theorems 2–5, Corollary 6) *(proof; condition conservative)*
- One shelf, Pcart-N: remainder first (RF) gives $H_{k+1}=(H_k+\lceil A_k/c\rceil-1)^+$ with $A_k\sim\operatorname{Pois}(\rho)$, positive recurrent iff $\mathbb E\lceil\operatorname{Pois}(\rho)/c\rceil<1$, null recurrent at equality; full first (FF) is Bailey's bulk queue, stable for $\rho<c$; RF and FF bracket every exact tie rule (Propositions 7–8, Theorem 9) *(proof)*
- RF makespan ratio $\to\max\{1,G_c\}/\max\{1,\rho/c\}$ almost surely at every load; always below 2, supremum 2 (Theorems 9, 13; Lemma 12 offline benchmark) *(proof)*
- $\rho_c=c/e+\log(2\pi c)/(2e)+\log(e-1)/e+O((\log c)^2/c)$; $\rho_2\approx1.5237$ (76%), $\rho_8\approx3.9361$ (49%) (Theorem 11) *(proof; rational root brackets for $c\le128$)*
- Total-completion-time tie-breaking selects FF when picking time is zero (Proposition 14) *(proof)*
- Positive picking: separation at every $c\ge2$, unique sharp threshold at $c=2$; two shelf locations: makespan loss at least $1.1069639886$ in an explicit instance (Theorems 15–17) *(proof)*

## Technical account

**Why a tie becomes a queue.** In the one-shelf model every makespan-optimal plan for $q$ waiting orders uses $\lceil q/c\rceil$ trips, so its first batch can be anything from the remainder $f(q)=1+(q-1)\bmod c$ up to $\min(c,q)$. Under remainder first, the number of trips still needed after each batch moves by $\lceil A/c\rceil-1$, where $A$ is the number of orders that arrived during the trip. Rounding up makes this increment positive more often than the load alone suggests, and that is what produces a threshold strictly below capacity. Under full first the leftover queue is Bailey's bulk-service chain $L_{k+1}=(L_k+A_k-c)^+$, which is stable up to $\rho=c$. A pathwise coupling on a common probability space shows that every exact tie rule lies between the two.

**The threshold and its limit.** The critical load solves $\mathbb E\lceil\operatorname{Pois}(\rho)/c\rceil=1$. A positive-term series characterisation gives exact rational brackets, and a Stirling-type expansion shows $\rho_c/c\to1/e$ with a logarithmic correction. Beyond the threshold the drift can be exponentially small in $c$, so for large carts the instability can be invisible over a working shift; the paper is explicit that the $1/e$ statement is a long-run limit.

**The conjecture.** The proof does not try to describe the full physical-state process. Instead, the incumbent plan plus the new order served on its own is always feasible, so the reoptimised plan is never longer than that. The remaining work is then dominated by a single-server queue whose service times are the solo append charges, which gives stability when $\lambda\mathbb E B<1$ by two strong laws, and explicit bounds under bounded charges. This is the feasibility-implies-stability principle of receding-horizon control, applied with care to the batch commitments of each cart model.

**Classical and new.** Lindley and bulk-service recursions, Foster's criterion and insertion-cost queue bounds are classical and credited. The source paper itself remarks that ties can matter in a deterministic example. Within a bounded search, the new elements are the commitment-respecting proof of the published conjecture with explicit bounds, the exact tie-rule envelope with its rounded-Poisson threshold, all-load makespan ratio and factor-two boundary, and the positive-picking and two-location robustness results.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/warehouse-reoptimisation-tie-breaking.txt) is available for reading.

- **Proofs.** Every theorem, proposition, lemma and corollary has a written proof in the 35-page manuscript, with expanded proof notes in the package.
- **Computational checks.** Fourteen scripts check the clearance certificate against a physical-state model on a finite weighted graph (48,912 value comparisons), the RF and FF recursions (164,000 cases), the offline benchmark against all ordered partitions and an all-subset dynamic programme, exact rational root brackets for $c=2,\dots,128$, 60- and 90-digit recomputations, exact corrector identities for the $c=2$ picking threshold, static optimality in the two-location example, and seeded synthetic simulations. The checks are two-sided and discriminating (a misstated threshold, a swapped policy or a wrong closed form fails), and they all run with Python's `-O` flag, so none relies on assertions.
- **Two derivations.** The paper consolidates two independently developed attempts; a dedicated script recomputes every constant that both derived, at 60 digits, and the merge notes record each reconciliation.
- **Review.** Internal AI-assisted review in five roles, an adversarial proof review and an audit of the new proofs by a separate model, and a clean replay of both source bundles led to one revision; a re-review found no scientific issue and its minor items were applied. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The tie result is proved for identical orders at one shelf in Pcart-N, with positive-picking and two-location extensions; interventionist replanning (Pcart, Robot) and general multi-aisle layouts are open, as is the recurrence class at the $c=2$ picking threshold. The low-rate condition is conservative: it certifies no more than serving orders one at a time. Simulations are synthetic and there is no evidence on which tie rules deployed solvers use.

## Relationship to earlier work

Lorenz, Otto and Gendreau (2025) introduced the three cart models, proved a general asymptotic factor-two upper bound for reoptimisation and stated the low-rate conjecture; they also noted that one of their deterministic examples depends on which tied plan is chosen. Corollary 6 proves the existence part of their conjecture, not the zero–one law or sharp threshold they also believed. Powell and Humblet (1986) analysed bulk-service queues under general control, where a high-backlog control eventually serves full batches; remainder first keeps underfilling at any queue length, so their conclusion does not cover it. Christou et al. (2026) require work-conserving schedules to fill a started batch, which excludes remainder first and is consistent with the full-first result here. Kumar and Seidman (1990) showed long ago that reasonable scheduling rules can be unstable below capacity; this paper gives an exact, quantitative instance created purely by tie-breaking among optimal plans.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Designers of warehouse control software | Check which tied plan the solver returns; prefer filling the cart first, or break ties by total completion time | Proved for one shelf with extensions, not for general layouts |
| Operations-research modellers | An exact example where snapshot optimality does not imply stability, with closed-form thresholds and makespan ratio | Long-run statements; drift can be tiny for large carts |
| Queueing theorists | A rounded-Poisson Lindley recursion with an explicit $1/e$ capacity limit, and a commitment-respecting stability certificate | Classical ingredients; the novelty is the identification |
| Authors of the source paper and related work | A proof of the low-rate conjecture for all three models, for every tie rule | Existence of a stable rate only; the condition is conservative |
| Research agents | Machine-readable claims, an agent index and replayable checks | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

Online order picking is a large share of warehouse operating cost, and controllers that replan continuously are common. It is tempting to assume that solving each snapshot to optimality is enough. This paper shows, in the simplest possible setting, that it is not: two plans that are equally good on paper lead to very different long-run behaviour, and for large carts the bad choice cuts the load the warehouse can sustain in the long run to well under half of capacity. It also confirms that reoptimisation is at least safe at light load, which the original authors had only conjectured.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.12:

```sh
shasum -a 256 -c SHA256SUMS
python3 -m pip install -r requirements.txt     # numpy 2.3.5, scipy 1.17.0, matplotlib 3.10.8
python3 -I -B tools/replay_compare.py .         # all fourteen checks with -O, compared with retained outputs
```

The full run takes about a minute on one core. `REPRODUCE.md` maps each script to the result it checks, and `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Decide whether interventionist replanning (Pcart and Robot) removes the remainder-first instability in the one-shelf model.
2. Find a throughput-safe tie rule for general multi-aisle layouts, where a larger first batch can mean a longer tour.
3. Determine the recurrence class at the sharp $c=2$ threshold with positive picking.
4. Sharpen the low-rate condition towards the true stability region of reoptimisation in each cart model.
5. Collect evidence on which tie rules deployed warehouse solvers actually use.

## What is in the evidence package

The package contains the manuscript (PDF, Markdown source and generated LaTeX with its build script), the bibliography with the Crossref and arXiv records behind every reference, the fourteen check scripts with their retained JSON and CSV outputs and figures, a one-command runner and a replay comparer, expanded proof notes, the two dated prior-art reports and the merge notes for the two derivations. The records include a claim ledger, a rating-free review summary, claim, status, assurance, provenance and prior-art records, and an agent index. Licences are CC0-1.0 for text and data and MIT for code, and SHA-256 manifests are included. The same files are in the GitHub release and the Zenodo record.
