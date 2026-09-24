## Summary

In a directed network, each point sends arrows to some others: follower relations, say, or who-beats-whom in a tournament. Paul Seymour conjectured in 1990 that every such network, if no two points point at each other, has a point that reaches at least as many new points in two steps as it does in one. This is the *second neighbourhood conjecture*. It is one of the best-known open problems about directed graphs. It is proved for tournaments, where every pair is connected, and for networks where every point has at most seven outgoing arrows, although the seven case is claimed only in a recent unrefereed preprint.

This release studies the densest case that remains open: networks with exactly $2\delta+3$ points, where $\delta$ is the smallest number of outgoing arrows. It does not settle that case. It proves strong restrictions on what a counterexample would have to look like, and uses them to make a large computer search feasible. The search rules out a counterexample with 17 points, so any counterexample must have at least 18. A separate part of the paper shows that a natural route to a general proof cannot work. That route extends the classical tournament proof by weighting points with a probability distribution. The same examples show that a stronger conjecture, attributed to DeVos in a 2006 survey, is false as printed there.

**The decisive qualification:** Seymour's conjecture remains open, and so does the case $n = 2\delta+3$. This is an unrefereed candidate, checked by the producing workflow, not by independent mathematicians.

## Summary for specialists

Let $D$ be an oriented graph with $n$ vertices and minimum out-degree $\delta$. Let $N^{++}(v)$ be the set of vertices at directed distance exactly two from $v$. A counterexample is an oriented graph in which $|N^{++}(v)| < |N^+(v)|$ for every vertex. Brukhman (2026) excluded counterexamples with $n \le 2\delta+2$. For a counterexample with $n = 2\delta+3$ the release proves the following:

- there are at least four *perfect* vertices, that is, vertices of out-degree $\delta$ adjacent to every other vertex (Theorem 4.3);
- every vertex has at least $\max\{1, \lceil(\delta-10)/27.5\rceil\}$ in-neighbours of out-degree $\delta$ when $\delta \ge 3$ (Theorems 5.2 and 5.5);
- at least $n/4$ vertices have out-degree $\delta$ (Theorem 6.1).

Using these as constraints, a cube-and-conquer SAT computation excludes $(n,\delta) = (17,7)$. With Kaneko–Locke ($\delta \le 6$) and Brukhman, every counterexample therefore has at least 18 vertices, without relying on the $\delta = 7$ preprint (Theorem 7.1). Certified small cases add that at $n = 2\delta+3$ some vertex of out-degree $\delta$ is Seymour for $\delta \le 5$. For $\delta \le 4$ this already follows from Bai, Li and Park, so the new case is $\delta = 5$.

The negative results are these:

- For $k \ge 2$ and $t \ge 1$, the oriented graph $D_{k,t}$ has a unique losing density, and its average surplus $\sum_v p(v)(|N^{++}(v)|-d(v))$ equals $(3-t)/(2k+1)$. For $k \ge 3$ its directed girth is $2k-1$ (Proposition 8.4).
- Out-regular graphs of arbitrarily large degree exist in which every losing density is supported on non-Seymour vertices (Proposition 8.5).
- DeVos's Conjecture 6.28, as printed in Sullivan's survey, is therefore false, at every directed girth (Corollary 8.6). Explicit counterexamples on 6 and 8 vertices also refute the three sign variants of the statement, and the 8-vertex one also refutes the weaker reading that imposes the second condition only on the support. The survey's separate remark about averaging over *arbitrary* distributions is equivalent to Seymour's conjecture and is not refuted.
- Lemma 3.1 of Glover's unrefereed claimed proof (arXiv:2501.00614v14) is false as literally stated (Section 9).

## Technical account

The structural results rest on Brukhman's fixed-target double count, sharpened into an exact identity. For every oriented graph,
$$k - \mathcal D = B + n(2\delta+3-n),$$
where $k$ counts vertices $x$ with $q(x) = 0$, $\mathcal D \ge 0$ is a sum of local capacity defects, and $B = \sum_v (d(v)-1-|N^{++}(v)|)$ is non-negative in a counterexample. At $n = 2\delta+3$ this becomes $k = B + \mathcal D$: each perfect vertex costs exactly one unit of slack. Deleting an odd set of vertices lowers the order to $2\delta'+2$, where Brukhman's count applies. A new odd-set deletion identity (Lemma 5.1) transports that count back to $2\delta+3$. A source-restricted version of it, a lemma on non-adjacent targets (Lemma 5.4) and a three-way charging argument give the linear in-neighbour bound.

The 18-vertex bound is a computation. The constraints C1–C6, C8 and C9 encode the proved necessary conditions and symmetry reductions, alongside the non-Seymour condition. Two split variables per vertex of one group give an exact partition into 379 cubes. CaDiCaL refuted each cube with an LRAT proof, and every proof is retained.

The negative results are exact. In $D_{k,t}$, summing the losing inequalities over the cycle forces the added vertices to carry zero weight, and oddness forces uniformity on the cycle. The surplus is then negative once $t \ge 4$. Because DeVos's pointwise condition implies the averaged one, the same graphs refute the conjecture as printed. For the 8-vertex example the argument is short: the graph is Eulerian, so every losing inequality is an equality. That forces a weight of $1/8$ on one vertex, where the second condition then fails. The classical inputs are Fisher's losing-density argument, Brukhman's count, the product constructions of Guo–Kang–Zwaneveld and the equivalences of Seacrest and Lim. They are credited in the paper's Table 1. Correctness, novelty and priority are recorded separately.

## Evidence, assurance and limitations

- **Written proofs.** The universal theorems rest on the written proofs in the 20-page paper. Exact scripts check the underlying identities exhaustively on all 59,809 oriented graphs with at most 5 vertices, and on random samples. They cannot check statements that are only about counterexamples.
- **Theorem 7.1.** Its 379 LRAT proofs, and 25 small-case proofs, were accepted by two independently written checkers. One of them, `cake_lpr`, has a checking core that is formally verified in CakeML. The reduction from graph statement to CNF, including the theorems used as constraints, is justified in writing. It is tested against independently computed properties up to $(17,7)$, but it is not formally verified.
- **Negative controls.** Semantic negative controls show that every verifier rejects corrupted inputs, in both normal and optimised Python.
- **Replay.** A 42-step replay from a fresh extraction of the released archive passed. It regenerates every formula byte for byte, and it runs the negative controls from a read-only copy.
- **Review.** An internal five-role editorial review requested minor revisions. Four of them narrowed or credited claims, and all were made. The confirmation round was waived by the publisher.
- **Limits.** All of this is producer-side. There is no independent reproduction, specialist review or journal peer review, and no theorem is formalised in a proof assistant. Novelty rests on a bounded search: we found no earlier unconditional 18-vertex bound and no earlier refutation of DeVos's conjecture, but Sullivan's 2008 thesis was not consulted.

## Relationship to earlier work

This release starts where Brukhman's dense-case theorem stops. The counterexample-order bounds known before it were 17 unconditionally and 19 conditionally on the $\delta = 7$ preprint. If that preprint is confirmed, the 18-vertex bound is superseded as an order bound, but the (17,7) certificate and the structural results remain. Fisher's tournament proof averages over a losing density. Fisher himself remarked that one losing density on the directed 4-cycle fails the pointwise condition; here every losing density fails, and so does the averaged inequality, at any girth. Seacrest and Lim showed that related weighted strengthenings fail in other settings: arc-weighted tournaments, and a two-digraph generalisation. Havet and Thomassé had already shown that median orders fail for weighted digraphs; Proposition 8.2 is an unweighted instance at $n = 2\delta+3$. The failed local lemma at $\delta = 6$ (Proposition 8.1) sits beside Sadhukhan–Sandeep–Sen's radius-two local statement: radius one does not suffice.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on the second neighbourhood conjecture | Structural constraints at $n = 2\delta+3$; a certified 18-vertex bound; a list of shortcuts that are now known to fail, including DeVos's conjecture as printed | Nothing here proves the conjecture or the $2\delta+3$ case. Check the written proofs, especially Theorem 5.5, and the reading of DeVos's statement being refuted. |
| SAT and proof-checking researchers | An encoding with symmetry reductions, an exact cube partition, a stricter LRAT checker with 25 controls, and dual checking with `cake_lpr` | Only the checker core is verified. The encoding bridge is not. |
| Research agents and tool builders | The machine-readable claims, AI index, replay receipts and negative controls | Preserve the version, scope and non-claims recorded in `CLAIMS.json`. |
| Interested non-specialists | A worked example of how far careful computation can push a famous open problem, and where it stops | Candidate status is not established consensus. |

## Why the problem matters

The conjecture is a simple statement about local growth in directed networks. It would imply the case of the Caccetta–Häggkvist conjecture in which every in- and out-degree is at least $n/3$ (Sullivan's survey, §3), and it has resisted tournament-style proofs for three decades. Knowing which natural strengthenings are false, and how small a counterexample could be, narrows the space in which a proof, or a counterexample, has to be found.

## How to inspect or reproduce the recorded checks

From the research repository (Python 3.10+ with NumPy and SciPy), run `python scripts/exhaustive_identities.py 5`, then each verifier in `scripts/`, then `python scripts/negative_controls.py`. All exit non-zero on failure. For the SAT certificate, compile `frontier/lratcheck.c` and unpack the three proof archives from the release. Then run `python frontier/replay.py cert_d7_C1C2C3C4C5C6C8C9 6` and `python frontier/replay_small.py`. The encoding tests are `frontier/test_encoding.py`, `test_encoding_scaled.py` and `test_small_encoders.py`. The expected outputs are in `REPLAY_RECEIPT.md` and the receipts under `frontier/`. The pinned environment is in `ENVIRONMENT.txt`.

## What is in the evidence package

- **Manuscript:** the paper as PDF, LaTeX source and accessible Markdown.
- **Verifiers:** the exact scripts and negative controls, and the witness graphs.
- **SAT pipeline:** the encoder with its label map and tests, including a recorded positive control at $(17,7)$; four versions of the proof checker with their controls; the certification, replay, determinism and `cake_lpr` records; the 404 retained LRAT proofs, released as three archives with SHA-256 sums.
- **Records:** a machine-readable claim index and AI index; the assurance, provenance, licence and citation-audit records; the internal editorial-gate reports, decision and response matrix.

## What would improve the result next

- An independent rerun of the 379 retained LRAT refutations, and specialist checking of the written proofs of Theorems 4.3, 5.2 and 6.1, which the SAT reduction relies on.
- A machine-checked version of the reduction from the graph statement to the formula.
- The case $(19,8)$. The same encoding gives 631 cubes, some of them slow. If the $\delta = 7$ preprint is confirmed, excluding $(19,8)$ would give an order bound of 20.
- A pointwise bound on minimum-degree in-neighbours close to the average $\delta/4$.
