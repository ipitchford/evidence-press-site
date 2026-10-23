## Summary

**What PageRank and backtracking are.** PageRank ranks the vertices of a network — web pages, people, proteins — by how often a random walker visits them. The walker follows edges and, now and then, restarts from a fresh vertex. A walker with one step of memory can also be told how much to favour *backtracking*: stepping straight back along the edge it has just used. A single weight $\mu$ controls this. At $\mu=0$ backtracking is forbidden (non-backtracking PageRank, $\pi_0$); at $\mu=1$ a step back counts like any other (ordinary PageRank, $\pi_1$); and as $\mu\to\infty$ the walker simply bounces on one edge ($\pi_\infty$).

**What was conjectured, and why it mattered.** Glover, Jones, Kempton and Oveson (2026) conjectured that, as $\mu$ is turned up, every vertex score moves in one direction only. That would give a cheap shortcut. The non-backtracking score $\pi_0$ needs a calculation on every directed edge, but $\pi_1$ is ordinary PageRank and $\pi_\infty$ has a one-line formula. If every score were monotone, comparing $\pi_1$ with $\pi_\infty$ would tell an analyst on which side of $\pi_1$ the expensive score $\pi_0$ lies.

**What was found.** The conjecture is false. Take the five-vertex *house graph* — a square with a triangular roof — with uniform restart, and let the walker follow an edge half the time (damping $\varepsilon=1/2$). The roof vertex has the three exact scores

$$
\pi_0(\text{roof})=\frac{638}{3615},\qquad \pi_1(\text{roof})=\frac{22}{125},\qquad \pi_\infty(\text{roof})=\frac{8}{45}.
$$

Both endpoints are larger than the middle value: the roof's score dips and then recovers as backtracking increases. A monotone score would put the endpoints on opposite sides of $\pi_1$, so the shortcut points the wrong way here. Among graphs without dead ends, five vertices is the smallest size at which this happens, for every damping value; with dead ends allowed, a four-vertex graph already fails at small and large damping values, and even a five-vertex tree can fail. An exact census finds the same failure in most graphs with seven vertices. The conjecture's second clause, about the spread of scores, fails too, and so does a second conjecture about heavy-tailed degrees.

**Why it matters to users.** On standard test networks, between a tenth and two fifths of vertices are nonmonotone, but the dips are small and rankings barely change. The practical lesson is specific: ordinary and infinite-backtracking scores alone cannot tell you which side the non-backtracking score lies on. The paper gives cheap tests that catch many, but not all, of the failures.

**How sure we are.** Each result carries one of three labels: *proved* (a complete written proof), *certified* (an exhaustive exact computation) or *numerical* (floating-point evidence only). The house certificate is three exact fractions that anyone can recompute.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Internal checking was AI-assisted adversarial review, not peer review or independent reproduction.

## Summary for specialists

The model is the edge-lift (first-order memory) PageRank of the source. On a finite connected simple graph with $P=A_GD_G^{-1}$, restart vector $v$ and damping $0<\varepsilon<1$, the walk on directed edges continues from $(i,j)$ to $(j,k)$ with weight $1+(\mu-1)\mathbf 1_{\{k=i\}}$, normalised by $d_j-1+\mu$; vertex scores are tail sums of the edge PageRank. The endpoints are
$$
\pi_1=(1-\varepsilon)(I-\varepsilon P)^{-1}v,\qquad \pi_\infty=\frac{v+\varepsilon Pv}{1+\varepsilon}.
$$
Conjecture 3.1 of the source asserts that every coordinate $(\pi_\mu)_i$ is monotone in $\mu$ *and* that the spread $\max_i\pi_\mu(i)-\min_i\pi_\mu(i)$ is nondecreasing in $\mu$. Conjecture 3.2 asserts that regularly varying degrees force a scale-free $\pi_\infty$.

| Result | Status |
|---|---|
| House roof: $\pi_\mu(4)=N_\varepsilon(s)/(15D_\varepsilon(s))$ with explicit cubics in $s=(1-\varepsilon)\mu$ (Theorem 3.1) | proved |
| Roof monotone iff $\varepsilon\le\varepsilon_c\approx0.2406813$; otherwise exactly one strict minimum, at $\mu=1$ iff $\varepsilon=4/9$ (Theorem 4.1); failure already on $\mu\in[0,1]$ at $\varepsilon=1/3$ (Corollary 4.2) | proved |
| Endpoint shortcut wrong at the roof iff $\varepsilon>\varepsilon_0\approx0.3291038$, including $\varepsilon=17/20$ (Proposition 4.3) | proved |
| Minimum degree $\ge2$: order five is minimal for *every* $\varepsilon$ — the house for $\varepsilon>\varepsilon_c$, the gem for $\varepsilon\le1/3$ (Proposition 5.1, Theorem 5.2) | proved |
| Leaves allowed: the four-vertex paw fails iff $\varepsilon\in(0,\varepsilon_1)\cup(\varepsilon_2,1)$, $\varepsilon_1\approx0.0783$, $\varepsilon_2\approx0.4355$; orders $\le3$ are $\mu$-invariant (Proposition 5.3) | proved |
| Leaves allowed: the smallest order is four for $\varepsilon<\varepsilon_1$ or $\varepsilon>\varepsilon_2$ and five on $[\varepsilon_1,\varepsilon_2]$ (Corollary 5.4) | proved |
| A five-vertex tree has a leaf that is nonmonotone inside $\mu\in(0,1)$ at $\varepsilon=1/2$ (Proposition 5.5) | certified (exact) |
| Covers lift failures to every order $5k$, with one fifth of vertices nonmonotone (Lemma 5.6, Corollary 5.7) | proved |
| Census of all 995 connected graphs on 2–7 vertices at $\varepsilon\in\{1/10,1/4,1/3,1/2,17/20\}$: 675 of 853 seven-vertex graphs (353 of 507 with minimum degree $\ge2$) have a nonmonotone coordinate for some listed $\varepsilon$ | certified |
| Small-damping two-step criterion (Theorem 6.1); exact slope $d\pi_\mu/d\mu$ at $\mu=1$ (Proposition 6.2) and three sufficient endpoint tests (Corollary 6.3) | proved |
| Spread clause fails as printed and when reversed (Proposition 8.1), and the spread can increase even when the maximising and minimising vertices are unique for every $\mu$ (Proposition 8.2) | proved; exact certificates |
| $\pi_\mu$ independent of $\mu$ iff $\pi_1=\pi_\infty$ iff $P^2v=v$ (Theorem 9.1) | proved |
| Conjecture 3.2 fails for every tail index $\alpha>1$ (Theorem 11.2) | proved |
| 10–41% of vertices nonmonotone on standard networks; small excursions; stable rankings (Section 10) | numerical |

## Technical account

**The three-number certificate.** For the house graph (vertices $0,\dots,4$, edges $01,03,04,12,14,23$, roof $4$) the symmetry $0\leftrightarrow1$, $2\leftrightarrow3$ reduces the 12-state edge system to six orbit unknowns. Cramer's rule gives the roof score as a ratio of cubics; at $\varepsilon=1/2$,
$$
\pi_\mu(4)=\frac{2(12\mu^3+115\mu^2+346\mu+319)}{15(9\mu^3+87\mu^2+263\mu+241)}.
$$
Substituting $\mu=0$, $1$ and the limit $\mu\to\infty$ gives $638/3615$, $22/125$ and $8/45$, so $\pi_0(4)-\pi_1(4)=44/90375>0$ and $\pi_\infty(4)-\pi_1(4)=2/1125>0$.

**Why the roof dips.** The derivative of the roof score has the sign of a quartic $R_\varepsilon(s)$ whose three leading coefficients are positive and whose constant term $A(\varepsilon)$ changes sign once, at $\varepsilon_c$. Descartes' rule of signs then gives exactly one turning point. For small damping, the paper expands PageRank by walk length: the first dependence on $\mu$ appears in two-step walks, through a sum of Möbius terms in $\mu$ whose monotonicity is set by the sign of $\sigma_j=d_j/d_k-h_j$, with $h_j=\sum_{l\sim j}1/d_l$. When the neighbours of a vertex disagree in sign, the two-step profile can rise and fall; this is the gem mechanism. Both neighbours of the house roof have $\sigma=1/6>0$, so the roof's dip is a third-order effect, which is why it needs damping above $\varepsilon_c$.

**Cheap tests.** At ordinary PageRank,
$$
\left.\frac{d\pi_\mu}{d\mu}\right|_{\mu=1}=\varepsilon^2(I-\varepsilon P)^{-1}\bigl[h\circ D_G^{-1}\pi_1-PD_G^{-1}P\pi_1\bigr],\qquad h=P\mathbf 1,
$$
which costs two $n\times n$ solves. Any one of three conditions proves that $\pi_\mu(i)$ is nonmonotone: (T1) $\pi_0(i)$ and $\pi_\infty(i)$ lie strictly on the same side of $\pi_1(i)$; (T2) the slope at $\mu=1$ points away from $\pi_\infty(i)$; (T3) the slope at $\mu=1$ has the opposite sign to $\pi_1(i)-\pi_0(i)$, in which case the failure occurs on $[0,1]$. On the minimum-degree-two census graphs at $\varepsilon=1/2$ these tests detect 285 of the 478 nonmonotone vertices and, as they must, never fire on a monotone one.

**The census.** For each connected graph on at most seven vertices and each listed damping value, every score is computed exactly as a rational function of $\mu$ by interpolation of polynomials of degree at most $2m$, confirmed at two further points. A coordinate is nonmonotone exactly when $N_i'\,\mathrm{Den}-N_i\,\mathrm{Den}'$ has a root of odd multiplicity on the open range; this is decided from the odd-multiplicity part of a squarefree decomposition by exact Sturm root counts, with roots at $\mu=0$ and $\mu=1$ divided out first and no floating-point step. The root counter is regression-tested on known root sets. A root-counting error in an earlier draft affected only the counts on $(0,1)$ and was corrected before release; at order seven the graphs with a coordinate nonmonotone on $(0,1)$ number 50, 68, 75, 85 and 44 (minimum degree two) and 113, 141, 156, 172 and 89 (all connected) at $\varepsilon=1/10,1/4,1/3,1/2,17/20$. The census establishes nothing between the five listed damping values.

**Degree tails.** Large degree does not force a large $\pi_\infty$ score when neighbours also have large degree — the mechanism of Henning, van der Hofstad and Litvak. Chains of cliques with sizes chosen for tail index $\alpha>1$ have regularly varying degrees, yet every normalised score $n\pi_\infty(i)$ stays below $4/3$.

**What is new, and what is classical.** The cover-lifting lemma (Lemma 5.6) is an instance of PageRank invariance under graph fibrations (Boldi, Lonati, Santini and Vigna), and sufficiency of regularity for invariance goes back to Arrigo, Higham and Noferini and to the source. The counterexamples, the house and paw classifications, the tree and unique-extremes examples, the census, the slope formula and tests, the converse of the invariance theorem and the tail refutation for every $\alpha>1$ were not found within the paper's literature search; that search does not establish priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/pagerank-backtracking-nonmonotone.txt) is available for reading.

- **Proofs.** Every theorem and proposition has a written proof; some steps are exact polynomial identities over $\mathbb Q(\mu,\varepsilon)$ checked by the accompanying code. Graph-cover preservation, the period-class argument and the asymptotic statements are proved in prose.
- **Exact certificates.** One verifier, `verify_all.py`, checks the house identities and threshold brackets by exact signs, compares the house formula with 25 independent full-state rational solves and with two- and three-sheet covers, derives the path, paw, gem, diamond and all order-four responses symbolically with exact Sturm root counts, runs the census after root-counter regressions, checks the slope formula at 3985 vertices, and checks the tree, spread, unique-extremes spread, rank-reversal and clique-chain certificates. Its JSON output is deterministic, and a replay of the final package into a fresh directory reproduced the shipped `verification.json` and `census_full.json` byte for byte.
- **Numerical evidence.** The prevalence study on standard networks is floating-point only and is labelled as such throughout.
- **Review.** Internal AI-assisted review and an AI-assisted adversarial review. This is not peer review, and the producer-side recomputations are not independent reproduction.
- **Limitations.** The census is certified at five damping values only. No proof assistant was used; Python, python-flint and sympy execution are in the trust boundary. The journal version of the source was not accessible, so the conjecture wording was checked against arXiv v2 only. Conjecture 3.2 is informal, and the refuted statement is the paper's local-weak-convergence formalisation (the counterexample's bounded score law refutes any reading that requires unbounded scores). The transfer of degree tails to $\pi_\infty$ in the configuration model is stated as an open problem, not proved.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Network analysts using non-backtracking or node2vec-style PageRank | Do not infer the side of $\pi_0$ from $\pi_1$ and $\pi_\infty$; use the slope tests as a cheap partial check | The tests are sufficient, not necessary; they missed 193 of 478 nonmonotone census vertices |
| Researchers on PageRank and random walks with memory | Exact minimal counterexamples, a damping classification and an invariance characterisation to build on | The census covers five damping values; the configuration-model tail question is open |
| Authors of the source conjectures and their readers | A precise account of which clauses fail and under which formalisation | Journal wording was not checked; Conjecture 3.2 is refuted as formalised here |
| Researchers in exact computation and research agents | A small, deterministic exact census pipeline with labelled numerical side studies | Byte identity shows integrity, not that the code encodes the mathematics; check the written reductions |

## Why the problem matters

Non-backtracking walks avoid wasting steps on immediate returns (they mix faster, for example), and a return weight like $\mu$ plays the role of the return parameter in node2vec. But non-backtracking PageRank lives on the directed edges, so it is costlier than ordinary PageRank, while the bouncing limit $\pi_\infty$ is almost free. A monotone dependence on $\mu$ would have turned the two cheap scores into a bound on the expensive one. This release shows that such reasoning is unsafe even on five-vertex graphs, measures how often it fails, and supplies exact tools — a slope formula and endpoint tests — that recover part of what the shortcut promised.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.11 or later and `python-flint`, `sympy` and `networkx`:

```sh
python3 -B -O code/verify_all.py OUTDIR --jobs 4   # all exact certificates and the census, about a minute
python3 -B -O code/prevalence.py OUTDIR            # numerical prevalence study (needs numpy, scipy)
```

Compare the JSON in `OUTDIR` with `results/`; runs with `--jobs 1` and `--jobs 4` give byte-identical output. To check the headline by hand, solve the six orbit equations of the house graph (Section 3 of the paper) at $\varepsilon=1/2$ and $\mu=0,1$, and evaluate $\pi_\infty=(v+\varepsilon Pv)/(1+\varepsilon)$ at the roof.

## The most valuable next projects

1. Recompute the house certificate and the census at one damping value in independent exact software.
2. Classify the graphs, or vertices, whose coordinates are monotone for every damping value; trees are not such a class (Proposition 5.5).
3. Prove the configuration-model transfer of degree tails to $\pi_\infty$.
4. Extend the certified census to order eight and to the whole damping interval.
5. Find a structural condition under which the reversed spread clause holds — uniqueness of the extreme vertices is not enough (Proposition 8.2) — and study the node2vec in–out parameter, fixed at one here.

## What is in the evidence package

The manuscript (PDF and LaTeX source, with the house-response figure), the exact solver and root-isolation code, the census, symbolic and criteria checks, the master verifier `verify_all.py`, the numerical prevalence script and figure script, the exact results (`verification.json`, `census_full.json`) and the numerical results (`prevalence.json`), a README with reproduction instructions and limits, and licences (CC0-1.0 for text, MIT for code). The same files are in the GitHub release and the Zenodo record.
