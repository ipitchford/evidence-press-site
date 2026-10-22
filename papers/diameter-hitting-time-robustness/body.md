## Summary

**What a robust random walk is.** A *random walk* on a network moves, at every step, to a neighbour chosen at random. Algorithms use such walks to explore networks, sample data and estimate quantities, and a basic measure of their speed is the *hitting time*: the expected number of steps needed to reach a target. Real implementations never use exactly the intended probabilities. Suppose an adversary may change every transition probability by a small relative amount, a factor between $1-\varepsilon$ and $1+\varepsilon$. The walk is *robust* if no such adversary can make it much slower to reach its targets. The largest safe $\varepsilon$ is called the *hitting-time robustness*.

**What was conjectured.** In *Markov chain robustness* (ITCS 2026), David Zuckerman proved several lower bounds on this robustness and stated Conjecture 1.16: "The hitting time robustness is $\Omega(1/\Delta)$, where $\Delta$ denotes the diameter." The diameter is the largest number of steps between any two points. The intuition is natural: if every point is close to every target, a small bias has little room to do damage. Zuckerman had proved the statement for trees.

**What was found.** The conjecture is false, even for networks in which every point has exactly three neighbours. The reason is that being *close* is not the same as being *easy to reach*. A network can have short routes that the walk almost never uses. Between two uses, the walk makes a long excursion through the bulk of the network, and a small bias pointing away from the target keeps adding up during that excursion. The target's long-run share of visits collapses, and a classical identity (Kac's formula) turns a tiny share into a very long hitting time.

- **Three neighbours per point.** An explicit family of cubic graphs has diameter growing only logarithmically with size. A fixed bias whose size times the diameter tends to zero still slows the worst-case hitting time by an unbounded factor. The paper proves that every effective resistance in these graphs is at most 684, which pins the normal hitting time to the order of the number of points.
- **Diameter exactly three.** A second family of regular graphs has diameter three. Here the paper also bounds the mixing time, so a theorem of Zuckerman also gives a lower bound: the safe $\varepsilon$ lies between constant multiples of $N^{-1/2}$ and $N^{-1/4}$ for $N$ points. The two exponents do not match.
- **At practical size.** On one member with 5,995 points, where $\varepsilon\cdot\Delta = 0.74$, an exact computation shows a 5.80-fold slowdown. These diameter-three graphs have many neighbours per point; the three-neighbour family shows the effect too, but its proved bounds only bite at astronomically large sizes.

**Why it matters.** If implementation errors can push a walk consistently in one direction, a small diameter gives no protection. What matters is how rarely the walk uses its short routes. Symmetric (reversible) errors of order $1/\Delta$ remain harmless, and an averaged diagnostic such as Kemeny's constant can look unchanged while worst-case hitting times grow many times over.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Every theorem has a written proof; computations are labelled exact or numerical. It was checked by AI-assisted adversarial review, not external peer review, independent reproduction or formal verification.

## Summary for specialists

**Setting.** $P$ is simple random walk on a connected graph $G$ with diameter $\Delta$. A standard $\varepsilon$-adversary may use any stochastic matrices $P_t$ with $(1-\varepsilon)P\le P_t\le(1+\varepsilon)P$ entrywise, chosen adaptively; $t^+_{\mathrm{hit}}(\varepsilon)$ is the robust maximum hitting time and $\rho_{\mathrm{hit}}(G;C)=\sup\{\varepsilon: t^+_{\mathrm{hit}}(\varepsilon)\le C\,t_{\mathrm{hit}}(P)\}$ (Zuckerman, Definitions 1.8–1.9). Conjecture 1.16 asserts constants $c,C$ with $t^+_{\mathrm{hit}}(\min\{c/\Delta,1/2\})\le C\,t_{\mathrm{hit}}$ for every connected $G$. To refute it, it suffices to give one fixed admissible matrix $P'$ per instance with $\varepsilon\Delta\to0$ and $t_{\mathrm{hit}}(P')/t_{\mathrm{hit}}(P)\to\infty$; all perturbations here are of that kind, time-independent and with the same support as $P$.

**Main results.**

| Result | Status |
|---|---|
| $3m$-regular graphs $G_m$ of diameter exactly three on $N=(2m+1)(m+1)$ vertices, $m\ge54$: $N-1\le t_{\mathrm{hit}}\le 9N$, and a fixed perturbation with $\varepsilon\sim1/b$ gives $t_{\mathrm{hit}}(P')/t_{\mathrm{hit}}(P)\ge b^2/27-o(1)$ when $m=b^4$ (Theorem 2.1, Corollary 2.2) | proof |
| $t_{\mathrm{mix}}(G_m)\le 50(m+1)$ by a Doeblin argument; hence $\Omega(1/m)\le\rho_{\mathrm{hit}}(G_m;C)\le O_C(m^{-1/2})$, i.e. between $\Omega(N^{-1/2})$ and $O_C(N^{-1/4})$, for $C$ at least Zuckerman's constant (Proposition 2.6, Corollary 2.7) | proof; bracket not matching |
| Cubic graphs $J_b$ on $N_b=(2b^2+1)(2b^4+1)-1\sim4b^6$ vertices, diameter $\le12\log_2b+O(1)$: every effective resistance is at most $R_\star=684$ (Theorem 3.2) | proof |
| Consequently $t_{\mathrm{hit}}(J_b)=\Theta(N_b)$, a fixed perturbation of size $1/b$ amplifies $t_{\mathrm{hit}}$ by $\Omega(b)$, and $\rho_{\mathrm{hit}}(J_b;C)=O_C(N_b^{-1/3})$ with no logarithmic factor; $\Omega(N_b^{-1})$ from Zuckerman's Proposition 2.12 | proof |
| Diameter two without regularity: $\rho_{\mathrm{hit}}\to0$ (Appendix A) | proof |
| Fixed reversible perturbations with $\varepsilon\le c/\Delta$, $c<1$, change $t_{\mathrm{hit}}$ by at most $2e^{2c/(1-c)}/(1-\varepsilon)$; with the source's reduction this recovers Zuckerman's tree theorem (Proposition 5.1, Remark 5.2) | proof; no novelty claimed |
| Small instances: $G_{54}$ ×5.80 at $\varepsilon\Delta=0.74$, $G_{81}$ ×8.77, $G_{96}$ ×6.41 (exact); $J_2$ ×8.56 (exact) and $J_3$ ×40.1 (double precision), both with $\varepsilon\Delta>1$ (Section 4) | computation |
| Sharp scales; whether $\rho_{\mathrm{hit}}=\Omega(1/(\Delta+\sqrt{t_{\mathrm{mix}}}))$ in general (Questions 6.1–6.2) | open |

**Relation to the source's theorems.** Zuckerman proves $\rho_{\mathrm{hit}}=\Omega(1/t_{\mathrm{hit}})$, $\Omega(1/t_{\mathrm{mix}})$ for every graph, $\Omega(1/\Delta)$ for trees and $\Theta(1/\log n)$ for constant-degree expanders. Nothing here contradicts the mixing-time bound; what fails is the proposed improvement from $t_{\mathrm{mix}}$ to the much smaller $\Delta$. For $G_m$, $\Delta=3$ while $t_{\mathrm{mix}}\asymp m\asymp N^{1/2}$.

## Technical account

**One pattern for every lower bound.** (1) *Bias*: tilt transitions along a cyclic part of the graph, away from a target region, by factors $1\pm\eta$, keeping row sums equal to one and every multiplier in $[1-\varepsilon,1+\varepsilon]$. (2) *Depletion*: show that the stationary law $\pi'$ of the fixed perturbed chain gives some target $v$ very small mass. (3) *Kac*: $1/\pi'(v)=\mathbb E_vT_v^+$ and first-step conditioning give $t_{\mathrm{hit}}(P')\ge1/\pi'(v)-1$. Upper bounds on the unperturbed $t_{\mathrm{hit}}$ come from the commute-time identity $H(u,v)+H(v,u)=2|E|R_{\mathrm{eff}}(u,v)$ and Thomson's principle.

**The diameter-three family.** Take $n=2m+1$ cliques $K_0,\dots,K_{n-1}$ of size $m$ in a ring, consecutive cliques completely joined, and a portal $h_i$ joined to all of $K_i$, with the portals forming a clique. Every vertex has degree $3m$ and any two vertices are within three steps through the portals. Interclique moves away from $K_0$ get factor $1+\eta$ and moves towards it $1-\eta$; portal edges are untouched. Eliminating the portals reduces stationarity to a three-term recurrence with explicit rational roots, and a vertex of $K_0$ ends with mass at most $3b^2/(Nm)$. The walk enters the portal clique only about once every $3m$ steps, so the ring bias has time to act.

**The cubic family.** $J_b$ takes $2b^2+1$ binary trees ("clouds"), each with $b^4$ leaves, and joins corresponding leaves of consecutive clouds into cycles of length $2b^2+1$; a separate portal tree attached at the cloud roots, completed to degree three by a matching, gives short but rarely used routes and logarithmic diameter. The bias acts on the horizontal leaf cycles. An exact time change runs the biased horizontal motion on an independent "leaf clock", so a one-dimensional Poisson-equation bound controls the time spent in the target region whatever the entry point. The new ingredient is the uniform resistance bound: explicit multi-scale unit flows spread current over a window of clouds that doubles every two tree levels while climbing the trees, and Minkowski's inequality combines the step energies into $R_{\mathrm{eff}}\le4(6+3\sqrt2+1.77+\sqrt{9/8})^2<684$. The true maxima are far smaller, 1.8133 on $J_2$ (exact value, rounded) and 1.989 on $J_3$ (numerical).

**Why the perturbations must be nonreversible.** For a reversible fixed perturbation the ratio of stationary laws changes by at most $q_\varepsilon=(1+\varepsilon)/(1-\varepsilon)$ per edge, hence by $q_\varepsilon^\Delta$ overall, and conductance comparison bounds the amplification. Both constructions are nonreversible: unchanged symmetric edges would force equal stationary masses that the biased edges contradict.

**Other averages of hitting times.** On $J_2$ and $J_3$ the mean of $H(u,v)$ over uniform ordered pairs grows by factors 2.87 and 8.60, so the damage is not confined to one pair. Kemeny's constant changes by factors 0.957 and 0.927: it slightly decreases, because it weights each target by its own stationary mass and the depleted targets carry almost none.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/diameter-hitting-time-robustness.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a complete written proof, uniform in the parameters. Heuristic remarks are labelled as heuristics.
- **Checks.** Seven scripts check the constructions on small full graphs (degrees, diameter, stochasticity, relative bounds, both stationary balances, killed-core systems, the injection identity), the theorem-parameter algebra, the explicit resistance flow on $J_2$ and its constants, the ingredients of the mixing bound, and the finite-size table. Exact checks use rational arithmetic (python-flint for $J_2$ and $G_m$); the $J_3$ and mixing numerics are double precision. Every check is explicit and stays active under `python -O`. Finite checks supplement the proofs and are never used to extrapolate.
- **Replay.** `verify_all.py` reproduced the reference JSON byte for byte in a separate clean replay of the final package; the released code and results are bound to that replay by hash.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review of the first version (OpenAI gpt-5.6-sol), a verification re-review, and two AI-assisted adversarial audits of the revised proofs by different models (Anthropic Claude Opus 5.5 and OpenAI gpt-6-astra) that independently implemented the resistance flows, the regular-family recurrence and the leaf clock and found no critical or major error. A rating-free summary of the objections and responses is in the package. This is not peer review, and the recomputations are not independent reproduction.
- **Limitations.** The cubic family has logarithmic diameter, and its proved amplification first exceeds 1 only at about $5\times10^{17}$ vertices; the constant-diameter family has growing degree (162 to 288 in the table), whereas Zuckerman thinks of the maximum degree as small or constant. The perturbations are nonreversible and aimed at a target. The robustness lower bounds hold only for $C$ at least the absolute constant implicit in Zuckerman's theorems. No sharp scale or positive replacement for the diameter is proved, and nothing follows about typical or empirical networks. A bounded literature search found no earlier cubic or fixed-diameter counterexample; that does not establish priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on Markov chain robustness and biased random walks | A refutation of Conjecture 1.16 with explicit families, a proved two-sided bracket for one of them, and open sharp-scale questions | The bracket for $G_m$ is not matching; $t_{\mathrm{mix}}(J_b)$ is not bounded |
| Designers of random-walk algorithms | Directional (nonreversible) error, such as systematic rounding bias, can defeat small diameter; accuracy of order $1/t_{\mathrm{mix}}$ always suffices by Zuckerman's theorem, and symmetric errors of order $1/\Delta$ are harmless | The constructions are worst-case and targeted; random errors were not studied |
| People monitoring stochastic systems | Stationary-weighted averages such as Kemeny's constant can miss large worst-case slowdowns | Shown on two small cubic instances; whether such averages are robust at scale $1/\Delta$ is open |
| Research agents | A small, deterministic, byte-reproducible verification suite with labelled exact and numerical outputs | Byte identity shows integrity, not that the scripts encode the theorems; read the proofs |

## Why the problem matters

Robustness to small modelling and implementation errors decides whether guarantees proved for an ideal random walk carry over to the one actually run. Zuckerman's conjecture proposed a simple, checkable parameter, the diameter, as the guide. This paper shows that the guide can fail badly, explains the mechanism (rarely used short routes), and narrows the search for the right parameter towards how often the walk actually uses its short routes, measured in these examples by the mixing time.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3, `python-flint` and `numpy`:

```sh
shasum -a 256 -c SHA256SUMS
python3 -B -O code/verify_all.py OUTDIR   # every check, about 80 seconds
diff -r OUTDIR results                    # byte-identical reference output
```

Start reading with Section 1.1 of the paper (the question in plain terms) and Section 2 (the self-contained diameter-three warm-up); `AI_INDEX.md` maps every result to its evidence.

## The most valuable next projects

1. Find the sharp robustness scales: is $\rho_{\mathrm{hit}}(G_m;C)=\Theta(m^{-1/2})$ and $\rho_{\mathrm{hit}}(J_b;C)=\Theta(b^{-2})$?
2. Bound the mixing time of the cubic family $J_b$ (expected of order $b^4$ up to logarithms).
3. Decide whether $\rho_{\mathrm{hit}}=\Omega(1/(\Delta+\sqrt{t_{\mathrm{mix}}}))$ for every connected graph, or find the right replacement for the diameter.
4. Study robustness under random rather than adversarial $\varepsilon$-perturbations, and of stationary-weighted hitting-time averages.

## What is in the evidence package

The manuscript (PDF and LaTeX sources), the seven verification scripts with `verify_all.py`, the reference JSON results, figure sources, a rating-free review summary, claim, status, assurance and provenance records, the dated prior-art record, an agent index, licences (CC0-1.0 for prose and data, MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
