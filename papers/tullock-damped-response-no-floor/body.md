## Summary

**The setting.** In a *Tullock contest*, also called a lottery contest, each participant chooses how much effort to spend and wins a prize with probability equal to its share of total effort. Effort is costly, and costs differ between participants. Research races, lobbying, crowdsourcing contests and proof-of-work mining are often modelled this way. The equilibrium of such a contest frequently has the most expensive participants spending nothing at all.

**The question.** Does simple learning reach that equilibrium? Suppose every player, round after round, moves a fixed fraction of the way from its current effort towards its best reply to the others' current efforts. This is *damped best response*. Without damping, best replies can cycle forever. Elkind, Ghosh and Goldberg (2024) proved that damped best responses converge, but only if every player is forced to keep at least some positive minimum effort. That rule changes the game, because it stops expensive players from dropping out, and the authors asked whether it is needed.

**What was found.** It is not needed. With no minimum effort, damped best responses converge to the unique equilibrium, including equilibria in which some players withdraw completely, for small enough constant steps and for any step sequence that shrinks slowly enough to keep moving.

**Why it works.** The only danger is the point where everyone's effort is zero, where the payoff is undefined. The proof shows the process never gets close to it in the way that matters: **each player's rivals, taken together, never stop competing**. If the others' total effort became tiny, the leading player's best reply would also be small, so it would ease off and the others would catch up. An individual player can fade to zero; the group of its rivals cannot. Once this is established, a classical argument finishes the proof.

**What else is shown.** The paper gives an explicit time after which rival efforts stay safely positive, shows that with steps $1/(k+2)$ the distance from equilibrium, measured by total unilateral regret, falls like $1/k$, and shows that this rate is exact whenever some player strictly withdraws. It extends the result to contests where effort enters through a concave impact function, and shows that any step size guaranteed to work must shrink as the number of players grows.

**Status.** An anonymous, AI-assisted, unrefereed candidate, checked by internal AI-assisted review only, not by peer review or independent reproduction. The step size that the theorem certifies is far too small to use as a practical rule.

## Summary for specialists

Players $i=1,\dots,n$ choose $x_i\ge0$ with payoff $x_i/S-c_i(x_i)$, $S=\sum_jx_j$, $s_i=S-x_i$; each $c_i$ is finite, convex and strictly increasing with $c_i(0)=0$ (nonsmooth allowed), normalised so $\min_ic_i(1)=1$. The update is $x^{k+1}=(1-\alpha_k)x^k+\alpha_kb(x^k)$ with $0<\alpha_k\le1/2$, from any finite start with at least two positive coordinates; $V$ is the Nikaido–Isoda gap (total unilateral regret).

| Result | Status |
|---|---|
| Convergence to the unique equilibrium for constant $\alpha\le\alpha_*=2\delta^3/(n^3(n-1)^2)$, with $V$ decaying geometrically, and for every $\alpha_k\to0$ with $\sum\alpha_k=\infty$ (no square summability) (Theorem 1) | proved |
| Persistence: eventually $x\in[0,1]^n$ and $s_i\ge\delta=\mu/(373248M^3)$, $M=\max_ic'_{i,+}(1)$, $\mu=\min_ic_i(r)/r$, from every $k$ with $\sum_{j<k}\alpha_j\ge\Lambda$ (explicit) (Lemmas 3–4, Proposition 5) | proved |
| Harmonic steps: $V=O(1/k)$, $\|x-x^*\|=O(k^{-1/2})$; $V=\Theta(1/k)$ if some player with $c'_{i,+}(0)s_i^*>1$ starts positive (Theorem 1(3), Proposition 10) | proved |
| Uniqueness and $V(x)\ge\delta^4\|x-x^*\|^2/(4n^6)$ on the persistence region (Lemma 9) | proved |
| Concave unbounded impact functions $f_i$ (including $x^r$, $0<r\le1$) with damping on $y_i=f_i(x_i)$ (Corollary 11) | proved |
| Local thresholds $\alpha<4/n$ ($n$ identical linear players) and $\alpha<8ab/(a+b)^2$ (two players) (Proposition 12) | proved |
| All-active linear duopoly has $V$ of order $k^{-2}$ under harmonic steps | numerical |
| Step guarantee of order $1/n$ with polynomial cost dependence; player-specific speeds; noisy responses | open |

The payoff is a Cournot firm's profit under inverse demand $1/Q$, so the theorem equally covers simultaneous partial adjustment in unit-elastic Cournot oligopoly.

## Technical account

**Total effort cannot stay small.** If $S\le1/(9M)$, each best response satisfies $b_i(s_i)\ge2s_i$, because the marginal reward at $2s_i$ is $1/(9s_i)\ge M$. Summing gives $S^{k+1}\ge(1+\alpha_k)S^k$, so total effort climbs above $\ell=1/(18M)$ and stays there.

**Rivals cannot stay small.** If $s_i\le\varepsilon=\mu\ell^2/16$, player $i$'s best response is at most $r=\ell/4$, so its own effort contracts towards $r$ while its rivals' effort shrinks at most by the factor $\prod(1-\alpha_j)$. Since $x_i=S-s_i\ge\ell-\varepsilon$, this product cannot fall below $\ell/2$, so every such episode ends, and later episodes start from at least $\varepsilon/2$. Hence $s_i\ge\varepsilon\ell/4=\delta$ permanently.

**Descent.** On $\Omega_\delta=\{x\in[0,1]^n:s_i\ge\delta\}$ the value function $v_i(s)=\max_z\{z/(z+s)-c_i(z)\}$ is $C^{1,1}$ even for nonsmooth costs, and Jensen's inequality bounds the cost of the convex combination. The contest-specific identity $\sum_i[c_i(b_i)-c_i(x_i)]-\sum_ih_i(s_i)e_i=-V-D$ with $D\ge0$ gives $V(x^+)\le(1-\alpha+C\alpha^2)V(x)$, $C=n^3(n-1)^2/(4\delta^3)$. Strong monotonicity of the pseudo-gradient on $\Omega_\delta$ gives uniqueness and the action error bound.

**New and known.** The relaxation method with a Nikaido–Isoda merit function (Uryasev–Rubinstein; Krawczyk–Uryasev; von Heusinger–Kanzow), the regret identity in continuous time (Elkind–Ghosh–Goldberg), uniqueness (Rosen; Szidarovszky–Okuguchi) and Cournot local stability (Theocharis; Fisher; Puu) are credited. The new ingredient is the persistence of rival totals with explicit constants and time; the extensions are short consequences. Workshop slides by one originating author state discrete convergence without displaying the floor, so no priority is claimed.

## Evidence, assurance and limitations

- **Proofs.** Every result has a written proof; the paper has a plain-language summary, an informal statement and a proof roadmap.
- **Checks.** A verification program checks three algebraic identities in 2,000 sampled exact-rational cases each, best responses against an independent optimiser, the one-step inequality and a sharper intermediate form in 3,000 cases, exact eigenvalues for $n=2,\dots,12$, and the persistence time, inactive-player rate and impact-function corollary along trajectories. Checks raise errors rather than use `assert`, so they bind under optimised Python.
- **Replay and controls.** A replay driver reruns the program from a clean copy, compares the record and checks headline values in normal and optimised mode, locally and in CI. Nine corruptions are rejected, among them a wrong regret identity, a wrong $\delta$, a threshold of $5/n$ and a wrong transformed cost.
- **Review.** Five internal reviewer perspectives, an adversarial review by a different model and a verification pass with proof audit by a third model. No main claim failed. The verification pass found a false "if and only if" at the threshold in Proposition 12 (stability at equality was asserted to fail, but at $n=8$, $\alpha=1/2$ the equilibrium is stable), which was corrected. This is **not** peer review, independent reproduction or formal verification.
- **Limits.** The certified step is about $4.8\times10^{-18}$ for two identical unit costs; all players must use the same step and compute exact best responses; starts with fewer than two positive efforts are excluded. The literature search was bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Contest and learning-in-games theorists | A floorless convergence theorem and a persistence argument for singular aggregative games | The step bound is qualitative; player-specific speeds remain open |
| Industrial organisation | Partial adjustment in unit-elastic Cournot oligopoly converges with exit, for small enough adjustment | Local thresholds show steps must shrink with the number of firms |
| Algorithm designers computing contest equilibria | A provably convergent simple scheme | Use the theorem for correctness, not for step tuning |

## Why the problem matters

Equilibrium predictions are credible when plausible behaviour leads to them. In contests, the interesting equilibria are often those where some players give up. A convergence theorem that forbids giving up cannot speak to them. This result removes that restriction and isolates the single fact, persistence of rival effort, that keeps the process away from the one singular point of the game.

## How to inspect or reproduce the recorded checks

1. Read Lemmas 3 and 4 (about one page): they contain the whole new argument.
2. Download the archive from the DOI or the GitHub release, install the pinned `requirements.txt` (NumPy, SciPy, Matplotlib) and run `python3 -B replay_all.py` and `python3 -B negative_controls.py` (each under a minute).
3. Section 12 of the paper maps each computational claim to the program.

## The most valuable next projects

1. Prove a uniform step guarantee of order $1/n$ with polynomial dependence on the cost parameters, matching the local thresholds.
2. Extend the theorem to player-specific adjustment speeds, the discrete analogue of the question left open by Elkind, Ghosh and Goldberg.
3. Add noise to best responses and prove almost-sure convergence using persistence plus stochastic approximation.

## What is in the evidence package

The 17-page paper (PDF and Markdown source) and its figure; the verification program with its result record and trajectories; a replay driver with claim checks, negative controls and CI; dated prior-art notes and the formal target record; records of status, assurance, claims, review dispositions, provenance and citation checks; SHA-256 sums for every file.
