## Summary

This page explains, in order: what pass-and-swap queues are for, what Dorsman and Gardner conjectured about them, what this release found (counterexamples, an exact rule for rings, and a positive theorem), and what has and has not been checked.

**What these queues model.** Many service systems have to match jobs with resources that can handle them: computing tasks with servers that hold the right data, patients with compatible donors, riders with drivers. Queueing theory tries to predict how such systems behave in the long run: how long queues get, and how often each kind of job is being served. Usually that long-run behaviour has no simple formula. An important exception is a family called *order-independent queues*, where the long-run probabilities have a *product form*: one simple factor for each position in the queue, multiplied together. Product forms are valuable because they make exact performance calculations possible.

**What a pass-and-swap queue is.** Comte and Dorsman (2021) added a twist that keeps the product form. Jobs belong to classes, and a *swapping graph* says which jobs may trade places. When a job finishes service it does not simply leave. It looks back down the queue, takes the place of the first job it may swap with, and that job does the same in turn. The last job in this chain is the one that leaves.

**Why limit the swaps.** Dorsman and Gardner (2024) asked what happens if each service completion may trigger at most $w$ swaps. The motivation is redundancy scheduling, where copies of a job are sent to several servers and the spare copies are cancelled once one finishes. The long-run behaviour of such systems is unknown when servers pick jobs in random order, and that random order can be written as a pass-and-swap queue with a random cap. Fixed caps are the first step.

**What they conjectured.** The order of the jobs in the system turns the swapping graph into a directed graph (each edge points from the earlier job to the later one). Dorsman and Gardner proved that the simple product form applies whenever this directed graph has no chain longer than $w$ edges, because then the cap never interrupts a swap. They conjectured that, whenever the swapping graph can be coloured with $w+1$ colours, arrangements with longer chains are only ever visited finitely often. If true, the simple formula would always describe the long run.

**What was found.** The conjecture is false for every cap $w \ge 2$. The smallest example is five jobs in a ring, each allowed to swap with its two neighbours, with a cap of two swaps. There are 180 arrangements, each containing a chain of three edges, that the system can never leave once it enters, and that it keeps revisiting. More generally, for $n$ jobs in a ring the system has such a trap **exactly when $n$ leaves remainder 1 on division by $2w$** (for $w=2$: rings of 5, 9, 13, … jobs), provided every position in the queues receives some service. Rings are not the only problem: two odd rings joined by a path also fail, and a complete computer census of all connected networks with up to seven jobs finds 1,355 failing combinations of network and cap.

**Where the conjecture does hold.** None of the failures has a *bipartite* swapping graph, one whose jobs split into two groups with swaps allowed only across groups. The release proves that the conjecture is true for bipartite swapping graphs when the cap is odd (including the simplest cap, $w=1$) and every position is served. Exact computation on every bipartite network with up to nine jobs finds no exception for even caps either, so that case is stated as a new conjecture.

**What happens inside the trap.** When all jobs are served at the same rate, the long-run behaviour inside the trap still has an explicit simple formula. When service rates vary from job to job within a queue, the natural repair, rescaling the original product-form weights by one constant for each arrangement, provably does not work, although on the smallest example the error is small. The practical lesson is that a capped system can lock in a long chain of incompatible jobs, and which long-run behaviour you see can depend on how the system started.

**Status.** An anonymous, AI-assisted, unrefereed candidate. The theorems have complete written proofs; every finite count is checked by exact programs that can be rerun. There has been no external peer review or independent reproduction.

## Summary for specialists

Setting: a closed tandem of two pass-and-swap queues with $n$ jobs, one per class (Proposition 6.2 reduces several jobs per class to this case), a simple swapping graph $G$ and the same cap $w$ in both queues. Reading the upper queue head to tail and then the lower queue tail to head gives the global word; orienting each edge of $G$ from earlier to later gives the acyclic placement orientation $A$. Its height $h(A)$ is the number of edges in a longest directed path. Dorsman and Gardner proved product form on each low orientation ($h(A)\le w$, their Theorem 7) and conjectured (Conjecture 1, Section 5.2.2) that, if $G$ is $(w+1)$-partite, equivalently $\chi(G)\le w+1$, every state of height greater than $w$ is transient. "(PR)" below means every position of every queue is served at a positive rate.

| Result | Status |
|---|---|
| For every $w\ge2$ the balanced states of $C_{2w+1}$ form a closed class of height $w+1$, for every admissible rate function; under (PR) it is a single recurrent class with $(2w+2)!/(w!)^2$ states. Conjecture 1 is false for every $w\ge2$ (Theorem 4.1, Corollary 4.2) | proof |
| Cycles under (PR): $C_n$ has a recurrent class of height greater than $w$ if and only if $n\equiv 1 \pmod{2w}$, and it is then unique. For $w\ge2$ (where every cycle satisfies the colouring hypothesis) the conjecture fails on $C_n$ exactly when $n\equiv1\pmod{2w}$; $C_9$ at $w=2$ refutes the repair "odd girth larger than $2w+1$" (Theorem 5.2) | proof |
| Two odd cycles $C_{2a+1}$, $C_{2b+1}$ joined by a path of length $L$ violate the conjecture at $w=a+b+L+1$ (Theorem 6.1) | proof |
| All connected graphs with at most 7 vertices: 1,355 violating (graph, cap) pairs, none bipartite, none at $w=1$ (Table 3) | exact census |
| Bipartite $G$, odd $w$, (PR): every state of height greater than $w$ is transient (Theorem 7.1). No violation on connected bipartite graphs with at most 9 vertices for any cap, or at most 7 under head-only service; the even-cap case is Conjecture 7.2 | proof; exact census; open |
| Homogeneous rates on the balanced class: the law is uniform in the global word and binomial in the split, and satisfies the source's partial-balance equations (Theorem 8.2, Proposition 8.3) | proof |
| Additive per-job rates, every $w\ge2$: original product weights times one constant per orientation are stationary on the balanced class if and only if rates are constant within each queue (Theorem 8.4). Other closed forms are not excluded | proof |

The two tools behind the proofs are a binding-move lemma (Lemma 3.3), which lists exactly which orientation changes one capped service can cause and, under (PR), reduces recurrence to a finite digraph on acyclic orientations (Corollary 3.4), and the identification of capped service with Schützenberger promotion on linear extensions, truncated at the $w$-th comparable pair (Proposition 3.5).

## Technical account

**The first example.** Take $G=C_5$, $w=2$, upper queue $(0,1,2,4,3)$. The orientation has source $0$, sink $3$ and source–sink paths $0\to1\to2\to3$ and $0\to4\to3$ of lengths 3 and 2. Serving job $0$: it replaces $1$, then $1$ replaces $2$; the cap stops the chain and job $2$ departs, although it could have swapped with $3$. Exactly one edge, $\{2,3\}$, reverses. The sink moves from $3$ to $2$, and the path lengths are again $\{2,3\}$. Enumerating all $6!=720$ states gives ten closed classes of 48 low states, one closed class of 180 states of height 3, and 60 transient states.

**Why the cap changes orientations only in a controlled way.** Without a cap the placement orientation never changes. With a cap, a service *binds* when the swap chain would need more than $w$ replacements. Lemma 3.3 shows that a binding service ejects the $w$-th displaced job $x$, which then has depth at least $w$, and reverses exactly the edges from $x$ to its out-neighbours left behind in the upper queue (dually for the lower queue). Under (PR) every such move is realised, and all states with one orientation communicate (Lemma 3.2), so recurrence becomes a question about a finite digraph $\Gamma_w$ on acyclic orientations.

**Cycles.** An acyclic orientation of $C_n$ splits into maximal directed runs. Lemma 5.1 shows that a binding move reverses a single edge of a run of length at least $w+1$. Reversing an end edge passes one unit of length to the neighbouring run; reversing an inner edge splits the run into three. Theorem 5.2's proof splits long runs and transports excess around the cycle until it either disappears or is stuck in the pattern of one run of length $w+1$ and $2r-1$ runs of length $w$. That pattern fits on the cycle only when $n = 2rw+1$. The pattern is closed under all moves, and $\gcd(2w,\,2rw+1)=1$ makes the $2n$ orientations of the pattern a single class.

**Bipartite graphs with odd caps.** With parts $X$ and $Y$, call an edge good if it points from $X$ to $Y$. Sinking a vertex of $Y$ whose depth is at least $w$, or raising a vertex of $X$ with at least $w$ edges above it, strictly increases the number of good edges. Theorem 7.1 shows that such an improving move is always available from a high orientation. If none existed, a longest path $z_0\to\cdots\to z_h$ would have exactly $h=w+1$ edges with $z_w\in X$ and $z_1\in Y$. But $z_1$ and $z_w$ are $w-1$ steps apart, an even number when $w$ is odd, so they lie in the same part. A finite chain of improving moves therefore reaches a low orientation, and low orientations have no way out (Corollary 3.4(ii)). The argument stops for even $w$ at configurations where every longest path has exactly $w+1$ edges.

**What is classical.** Order-independent queues and their product forms (Berezner, Kriel and Krzesinski; Krzesinski), pass-and-swap queues and orientation invariance (Comte and Dorsman), the bounded-swap model, the product form on low orientations and the conjecture itself (Dorsman and Gardner), the colouring and longest-path duality (Gallai, Hasse, Roy, Vitaver), and promotion on linear extensions (Schützenberger; Stanley; Ayyer, Klee and Schilling) are all credited. The binding-move lemma, the truncated-promotion identification, the counterexample families, the cycle classification, the census, the bipartite theorem and the stationary-law results are claimed as new within a bounded literature search, which does not establish historical priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/pass-and-swap-bounded-swaps.txt) is available for reading.

- **Proofs.** Every theorem, lemma and proposition listed above has a complete written proof in the manuscript. No proof assistant was used.
- **Exact computation.** Fifteen standard-library Python verifiers use exact integer and rational arithmetic and write JSON certificates that record the hash of their own source. The census simulates every transition from every state rather than relying on Lemma 3.3. It also compares three independent descriptions (full state graph, simulated orientation digraph and the lemma) on every graph with at most six vertices.
- **Replay.** All 15 certificate runs, including the nine-vertex bipartite census (about 1.5 CPU hours), regenerate byte for byte, under `python -O` so that no check relies on `assert`. This was confirmed in a separate clean replay and, for the 14 shorter runs, again on the frozen release archive.
- **Negative controls.** The replay rejects an off-by-one cap and a wrong cycle rule, and detects a tampered certificate and a tampered file.
- **Review.** Internal AI-assisted review in several roles, a verification re-review that wrote its own simulation code, and an adversarial review by a different AI model. None found a mathematical error. Their objections, mostly about scope wording, quotation of the conjecture and over-broad summaries, were resolved; a rating-free summary is in the package. This is not peer review, and the recomputations are not independent reproduction.
- **Limitations.** The census and bipartite statements beyond the proved theorems hold only for the stated finite ranges. The even-cap bipartite case, general service-rate functions without (PR), a characterisation of all failing (graph, cap) pairs and a closed form for the heterogeneous stationary law remain open. Theorem 8.4 excludes one representation of the stationary law, not every closed form.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Queueing theorists working on product forms, redundancy and matching | The conjecture's intended corollary (every recurrent class carries a product-form law under the colouring condition) fails; the release gives exact failure classes, a cycle criterion and a provable bipartite regime | The positive theorem needs odd caps and positive service at every position; the random-cap question behind redundancy scheduling is not settled |
| Combinatorialists | Capped service is truncated promotion on linear extensions, moving between different posets; the binding moves are a new kind of reorientation of acyclic orientations | The connection explains familiar product factors but the results of fixed-poset promotion theory do not transfer directly |
| Modellers of service and matching systems | A warning that capped swapping can lock in long chains of incompatible jobs, so long-run behaviour may depend on the starting state | The examples are stylised closed tandems with one job per class; practical frequency is not measured |
| Research agents and verification practitioners | Small exact verifiers with byte-identical certificates, an explicit census method and negative controls | Byte identity shows integrity, not that the code implements the model; the cross-checks carry that weight |

## Why the problem matters

Product-form results are one of the few routes to exact performance formulas for systems that match jobs with compatible servers. Dorsman and Gardner's bounded-swap programme was designed as a step towards random order of service in redundancy systems, where the long-run behaviour is still unknown, and their conjecture would have guaranteed that every long-run regime is described by the familiar product form. This release shows that capped swapping genuinely changes the picture: classes that the uncapped theory never sees can be permanent. It also gives a precise rule for when that happens on rings and identifies a regime, bipartite swapping graphs with odd caps, where the original hope survives.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.9 or later and no third-party packages:

```sh
python3 -S -O -B verify_all.py --sums      # 14 runs and the hash check, about 6 minutes
python3 -S -O -B verify_all.py --long      # adds the nine-vertex bipartite census, about 1.5-2 CPU hours
python3 -S -O -B negative_controls.py      # the checks reject a wrong cap and a wrong cycle rule
```

`verify_all.py` copies the verifiers to a temporary directory, reruns each one and compares its certificate byte for byte with the shipped copy. To understand the mathematics, start with Section 1.4 (the five-cycle example) and Lemma 3.3 of the paper; `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Prove or refute Conjecture 7.2: bipartite swapping graphs with even caps.
2. Characterise all pairs $(G,w)$ with a recurrent class of excessive height; the cycle criterion and the two-cycle family suggest a rule in terms of closed walks and $w$.
3. Decide the conjecture when only the heads of the queues are served, without the positive-rates assumption.
4. Find the stationary law on the counterexample class under heterogeneous rates, and extend the analysis to the random, state-dependent caps that model random order of service.

## What is in the evidence package

The manuscript (PDF and LaTeX source, with TikZ figures), fifteen exact verifiers and their JSON certificates, the one-command replay script, semantic negative controls, a novelty statement and source map, a rating-free summary of the internal review, claim, status, assurance, provenance and replay records, an agent index, licences (CC0-1.0 for prose, manuscript and data; MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
