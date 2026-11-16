## Summary

**In one sentence.** Plain graphs, in which every edge counts the same, break the square-root Cheeger inequality conjectured by Houdré and Tetali by a factor that grows like the logarithm of the degree, and no network can do worse than that, up to fixed constants.

**The everyday problem.** A random walk on a network mixes quickly unless some region of the network is hard to leave. Cheeger's inequality turns this into a guarantee: one number that can be computed from the network, the *spectral gap*, certifies how easy the hardest region is to leave. The guarantee loses a square, and that loss really happens, for example on a long cycle.

**The conjecture.** Houdré and Tetali proposed a sharper way to measure the boundary of a region. Instead of adding up the escape probabilities of its states, add up their *square roots*. A boundary spread thinly over many states then counts for more than the same flow squeezed through a few. They asked whether the spectral gap controls this "square-root boundary" with no loss at all, that is, up to an absolute constant. Their own bound had a factor of one over the smallest transition probability, and they asked how that factor really behaves.

**What was known.** Morris and Peres showed that the inequality holds up to a logarithmic factor. Lau and Tjowasi built weighted examples (a cycle in which the walker jumps further with smaller probability) showing that the logarithm is needed, proved the analogous inequality for exponents above one half, and asked whether a *plain* graph, where the walker simply moves to a random neighbour, can also break the conjecture.

**What is new.**

| What | In plain terms | Where |
|---|---|---|
| Plain graphs break it | Explicit "circulant" graphs (vertices on a ring, every vertex looking the same) break the square-root inequality by a factor that grows like the logarithm of the degree | Theorem 1.1 |
| Why cutting through a cluster does not help | A comparison theorem: in a network built from tight clusters, a cut through a cluster is never much cheaper than a cut along the clusters, because the cluster's internal edges charge for it | Theorem 4.1 |
| That is the worst case | For every reversible random walk, the loss at the square-root exponent is at most four plus the logarithm of one over the smallest transition probability; this answers Houdré and Tetali's question about their own factor | Theorem 1.2 |
| One formula for every exponent | Between vertex expansion and conductance, the worst loss for maximum degree $\Delta$ is pinned down, up to fixed constants, by a single integral | Theorem 1.3 |

**The concrete objects.** The graphs are rings of $n$ neighbourhoods (cliques), with more wires between nearby neighbourhoods than distant ones: about $M/r^3$ wires at distance $r$. The graph $G_n$ has $n^4+n$ vertices and degree below $4n^3$.

**Why a logarithm.** Inside half of the ring, a vertex at depth $t$ leaves in one step with probability about $1/t^2$. Its square root is $1/t$, and adding $1/t$ over all depths gives a logarithm. With ordinary conductance the sum of $1/t^2$ converges instead, which is why Cheeger's inequality itself survives.

**Limits.** The effect is real but numerically mild: for the explicit graphs, a computed upper estimate of the ratio is 0.50 at 260 vertices, 1.00 at about $1.7\times10^{7}$ vertices and only about 1.55 at about $1.1\times10^{12}$ vertices. The constants are explicit but far from sharp: the proven lower constant $10^{-8}$ (one in a hundred million) is far below the upper constant $12$, and the exact constants and the extremal graphs are open. The lower bounds use a weighted estimate of Lau and Tjowasi, restated with an explicit constant and checked by computer for small cycles; the paper does not give a self-contained proof of it. This is an unrefereed candidate; its assurance is internal AI-assisted review and computational checks, not peer review.

## Summary for specialists

For a reversible chain $P$ with stationary distribution $\pi$, spectral gap $\lambda_2$ of $I-P$ and $0\le p\le1$,

$$\varphi_p(S)=\frac{\sum_{v\in S}\pi(v)P(v,S^c)^p}{\pi(S)},$$

$$\varphi_p=\min_{0<\pi(S)\le1/2}\varphi_p(S),$$

with $0^0=0$. So $\varphi_1$ is the conductance, $\varphi_0$ the inner vertex expansion and $\varphi_{1/2}=h_2^+$ in Houdré–Tetali notation. Write $\kappa$ for the smallest positive off-diagonal transition probability and

$$\Psi_p(x)=\int_1^x t^{-2p}\,dt,$$

so $\Psi_0(\Delta)=\Delta-1$, $\Psi_{1/2}(\Delta)=\log\Delta$ and $\Psi_1(\Delta)=1-1/\Delta$.

- **Theorem 1.1** *(proof)*: for every even $n\ge4$ there is a connected simple circulant graph $G_n$ on $n^4+n$ vertices with degree $3n^3+2\le D_n<4n^3$ and

$$\frac{L(n)}{35\,n}\le\varphi_{1/2}(G_n)\le\frac{4.02\,H_{n/2}}{n},$$

$$\frac78\,\frac{H_{n/2}}{n^2}\le\lambda_2(G_n)\le13.3\,\frac{H_{n/2}}{n^2},$$

  where $L(n)\ge0.42\log n$. Hence $\varphi_{1/2}^2/\lambda_2\ge9\cdot10^{-6}\log n$, and the ratio is of order $\log n$, $\log D_n$ and $\log|V(G_n)|$. This answers the question of Lau and Tjowasi.
- **Theorem 4.1** *(proof)*: for a graph partitioned into cliques joined by regular bipartite graphs, every cut is at most an explicit factor cheaper than the best cut made of whole cliques; no expansion of the bipartite graphs is needed.
- **Theorem 1.2** *(proof)*: every irreducible reversible chain satisfies, for $0\le p\le1$,

$$\varphi_p^2\le4\bigl(1+(1-p)^2\,\Psi_p(1/\kappa)\bigr)\lambda_2 .$$

  At $p=1/2$ this reads $\varphi_{1/2}^2\le(4+\log(1/\kappa))\lambda_2$, replacing Houdré and Tetali's factor $2/\kappa$; for $p>1/2$ it gives $4p^2/(2p-1)$; and a level set of the positive part of a second eigenfunction attains it.
- **Theorem 1.3** *(proof)*: for every $0\le p\le1$ and real $\Delta\ge2$, the largest $\varphi_p^2/\lambda_2$ over circulants, over simple graphs, and over reversible chains with $\kappa\ge1/\Delta$ all lie in

$$\bigl[\,10^{-8}\,\Psi_p(\Delta),\ 12\,\Psi_p(\Delta)\,\bigr].$$

  The constants do not depend on $p$, so the law also describes the crossover on the scale $|1-2p|\log\Delta\asymp1$.

**Known and new.** The logarithmic upper bound for regular graphs (Morris, recorded by Houdré and Tetali; Lau–Tjowasi without laziness; an exercise in Lau's book manuscript) and the spectral sweep method (Lau–Tjowasi) were known. Houdré and Tetali already used a cycle of cliques as an example, and Lau–Tjowasi's Remark 6 gives the holding mechanism behind the polynomial loss below one half. The new parts are the simple circulant counterexamples, the comparison theorem, the lower bounds uniform in the exponent, and the chain-level upper bound with optimal dependence on $\kappa$; the paper's Table 1 sets this out regime by regime.

## Technical account

**From weights to plain edges.** In the Lau–Tjowasi cycle the walker jumps distance $r$ with probability proportional to $r^{-3}$. A simple random walk cannot have uneven transition probabilities, so each of the $n$ states becomes a clique on $M$ vertices and each weight becomes an integer number of edges between cliques, arranged as a regular bipartite graph. The clique edges play the role of holding probability. With cliques of size $n^3+1$ the vertex group $\mathbb Z_n\times\mathbb Z_{n^3+1}$ is cyclic, so the graphs are circulants and their spectra can be computed exactly by Fourier analysis.

**Why splitting a clique does not pay.** A cut that splits a clique pays for the clique's internal edges that cross it. Theorem 4.1 rounds any cut to a union of whole cliques and shows that the rounding raises $\varphi_p$ by at most a bounded factor, using only the regularity of the bipartite graphs between cliques. The weighted lower bound of Lau and Tjowasi then transfers to the simple graph.

**The upper bound.** The proof of Theorem 1.2 sweeps through the level sets of the positive part of a second eigenfunction, as in Lau and Tjowasi, but accounts for the finite increments between consecutive levels: each state has escape probability either zero or at least $\kappa$. Summing the square roots over the levels gives $\log(1/\kappa)$ at $p=1/2$, and the integral $\Psi_p(1/\kappa)$ in general.

**Matching lower bounds for every exponent.** Section 6 proves the lower half of Theorem 1.3 in three ranges: an elementary family of two cliques for $p\le3/8$; the critical circulants, with $n$ chosen as a function of $\Delta$ and $p$, together with Jensen's inequality, for $p\ge1/2$; and enlarged cliques relative to the cross-clique degrees for $3/8\le p\le1/2$, where the extra clique edges act as holding probability (the mechanism of Lau–Tjowasi's Remark 6, realised inside a simple graph) with constants uniform as $p\to1/2$.

**Consequences.** Laziness leaves the ratio at $p=1/2$ unchanged, so the logarithm in the Morris–Peres bound cannot be removed even for lazy walks on vertex-transitive simple graphs. The sweep guarantee of Theorem 1.2 is optimal, up to constants, for any method whose certificate is $\lambda_2$ alone. A connected simple graph on $N$ vertices with $\varphi_{1/2}^2\ge\gamma\lambda_2\log N$ must have maximum degree at least $e^{-4}N^{\gamma}$, so some polynomial growth of the degree is necessary for a loss logarithmic in the number of vertices.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/houdre-tetali-degree-law.txt) is available for reading.

- **Proofs.** Every theorem has a written proof in the 15-page paper. The paper opens with a plain introduction (the problem, the conjecture and what was known, the results, a heuristic for the logarithm, a known-versus-new table and a roadmap) and ends with consequences, what is not shown, a reproducibility note and an AI-use statement. No proof assistant was used.
- **Dependence on a source.** The lower bounds rest on Lemma 2.1, an explicit form of the weighted estimate in Section 4.1 of Lau and Tjowasi's paper. The paper does not give a self-contained proof; a rearrangement argument for cuts of the cycle that are not intervals would be needed. The underlying inequality was checked by computer for every set at every even cycle length up to sixteen.
- **Computational checks.** `checks/verify_construction.py` checks the generators, simplicity, cyclicity, degrees and full spectra of $G_n$ for small $n$ and exact quotient fingerprints (1080 checks). `checks/audit_transfer.py` checks every admissible cut of 280 small clique-fibre graphs against Theorem 4.1 (677,296 cuts), computing cut costs directly from adjacency masks. `checks/check_constants.py` checks the scalar constants and parameter choices, Theorem 1.2 by brute force on random reversible chains, and the table of $G_n$ up to $n=1024$ (553,742 checks). These are finite checks with stated floating-point tolerances; the unrestricted statements rest on the proofs.
- **Tests that can fail.** No check uses `assert`, so the scripts behave identically under Python's optimised mode. Multiplying the transfer bound by 50, or tightening the Lau–Tjowasi check above its margin, makes the corresponding script exit with failure.
- **Replay.** All scripts (the three checks also under optimised mode) were rerun from fresh copies before release under Python 3.12 with pinned libraries; every output matched the recorded file apart from timestamps and timings. GitHub CI reruns the three checks on Linux under `-O` and compares the outputs with the recorded files (integers, strings and structure exactly; floating-point values within a declared relative tolerance of $10^{-9}$), with both negative controls, as a blocking job.
- **Review.** Five internal AI-assisted reviewer roles and a clean replay found no mathematical error. The revision round corrected one degree estimate, made the weighted estimate explicit, fixed credit to Lau–Tjowasi, Houdré–Tetali and Morris–Peres, added missing references and a new introduction, replaced an `assert`-based checker, and added Theorem 1.2 and the consequences. A re-review and a proof audit of the new proofs by two further AI verification passes followed. An adversarial review by a second AI model was cut short by a usage limit and found no defect before it stopped. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Constants explicit but far from sharp; extremal graphs and the leading constant at $p=1/2$ open; no law in the number of vertices for every vertex count; lower bounds rely on the Lau–Tjowasi estimate. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in spectral graph theory and Markov-chain mixing | The worst-case loss, up to constants, when the spectral gap certifies the square-root and other Houdré–Tetali boundary measures, with explicit graphs that attain it | Constants are small; the effect is numerically mild |
| Graph partitioning | The sweep cut of Theorem 1.2 comes with a guarantee that is optimal relative to $\lambda_2$ alone | Worst-case statements; nothing is claimed about graphs met in practice |
| Readers of Lau and Tjowasi | An answer to their simple-random-walk question and a comparison theorem for clique substitution | The lower bounds use their weighted estimate |
| Research agents | Machine-readable claims, an agent index and replayable checks with negative controls | The checks are finite and floating-point; the proofs carry the general statements |

## Why the problem matters

Cheeger's inequality is one of the main tools for proving that random walks mix fast and for finding bottlenecks in networks. The Houdré–Tetali functionals measure boundaries more finely than conductance, and an inequality without loss for the square-root functional would have strengthened Cheeger's inequality wherever a bottleneck is spread over many states. This release shows exactly how much is lost: a logarithm of the degree, attained by plain graphs, and no more.

## Related Evidence Press releases

No earlier Evidence Press release studies Cheeger-type inequalities, Houdré–Tetali functionals or isoperimetric constants of Markov chains.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/), from the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
UV="uv run --python 3.12 --with numpy==2.3.5 \
  --with sympy==1.14.0 --with matplotlib==3.10.8"
$UV python -O -I -B checks/verify_construction.py \
  --output-dir logs
$UV python -O -I -B checks/audit_transfer.py \
  > logs/transfer_checks.json
$UV python -O -I -B checks/check_constants.py
```

Each script takes a few seconds. `ENVIRONMENT.txt` lists the software used and the cross-platform tolerance policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find the leading constant of the worst loss at the square-root exponent, divided by the logarithm of the degree.
2. Give a self-contained proof of the weighted base estimate, which needs a rearrangement argument for cuts that are not intervals.
3. Close the gap between the lower constant $10^{-8}$ and the upper constant $12$ for every exponent.
4. Classify the extremal graphs, and determine the worst loss as a function of the number of vertices.

## What is in the evidence package

The paper (LaTeX source and PDF) and its figure; `checks/verify_construction.py`, `checks/audit_transfer.py` and `checks/check_constants.py` with their recorded outputs in `logs/`; `checks/plot_phase.py`; `requirements.txt`; `refs.bib` from Crossref, DataCite and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow and SHA-256 sums.
