## Summary

**What restart strategies are for.** Many questions about random systems are questions about rare events: will a queue overflow, will an insurer's reserve be exhausted, will a learning agent ever reach a distant reward? Simulating such events directly is wasteful, because almost every run drifts away from the target and fails. Rare-event simulation and the exploration methods used in model-free simulation and reinforcement learning therefore try to spend simulated time where success is still possible. A particularly simple idea is **restart**: whenever a run falls below a floor, discard it and start again from a better place.

**What a quasi-stationary distribution is.** The natural "better place" is drawn from the process's **quasi-stationary distribution** (QSD) on the interval between the floor $0$ and the target $L$. It is the pattern the process settles into if one looks only at the occasions on which it has survived inside the interval for a long time, much as a population that keeps losing members can still have a stable age profile among those alive. In practice the QSD is approximated by particle methods of Fleming–Viot type, which replace each particle that leaves the interval by a copy of a surviving one.

**What Garcia and colleagues showed and conjectured.** Garcia, Bermolen, Jonckheere and Shneer (*Stochastic Systems*, 2026) studied exactly this scheme for processes that drift downwards. They proved that the time to reach $L$ under idealised QSD restart is exactly exponentially distributed, and that its rate is governed by one number: the exponential moment $M_L(\lambda_*)$ of the QSD, where $\lambda_*$ is the Cramér root that controls how rare the target is. They conjectured that this moment grows like $e^{(\lambda_*-\eta)L}$, where $\eta$ minimises the cumulant of the process, and remarked that this is *exactly* what happens for Brownian motion.

**What was found.**

- **The growth rate is right, the constant is not one.** For Lévy processes with a Gaussian component and jumps of either sign, the moment is computed exactly: $M_L(\lambda_*)\sim C_*\,e^{(\lambda_*-\eta)L}$ with an explicit constant $C_*$. The conjecture therefore holds on the logarithmic scale and up to constants, but the natural "ratio one, as for Brownian motion" reading fails. In the source's own example $C_*=0.85014864899\ldots$, certified by interval arithmetic.
- **Why.** The QSD (after an exponential change of measure) is a smooth sine-shaped bulk with two very thin **boundary layers** at the floor and at the target. The constant is a ratio of a right-layer quantity to a left-layer quantity. Brownian motion has no such layers, which is why it gives exactly one.
- **The sign of the error is predictable.** $C_*<1$ whenever all the jumps point downwards, and $C_*>1$ whenever they all point upwards.
- **Restart saturates at a definite budget.** The success rate is $r_L\sim R_*e^{-\eta L}$ with an explicit constant $R_*$. Success probability grows in proportion to the simulation budget $B$ only while $B$ is at most of order $e^{\eta L}$; after that, extra budget buys almost nothing. The restart theorem of the source paper stated its linear regime for all $B=o(e^{\lambda_*L})$, a much wider range; an exact Brownian example shows that range is too wide, and the corrected range is $B=O(e^{\eta L})$.

**Practical guidance.** To reach the target with probability $p$, idealised QSD restart needs a budget of about $-\log(1-p)\,e^{\eta L}/R_*$, and the curve $1-\exp(-R_*Be^{-\eta L})$ is accurate at every budget in relative terms. Restart is exponentially better than independent runs from the start, which need time of order $L\,e^{\lambda_*L}$, but it is in effect a one-level splitting method: well-designed multilevel splitting, adaptive multilevel splitting or Fleming–Viot schemes with moving levels can do exponentially better again. Its appeal is simplicity when no model of the system is available.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Every theorem has a written proof; the source-model constant is certified by interval arithmetic; the remaining computations are labelled numerical or exploratory. The restart results assume exact, free draws from the QSD and continuous monitoring. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

**Setting** (Garcia et al., arXiv:2503.03565v3; journal DOI 10.1287/stsy.2025.0108). $X$ is a real Lévy process with Gaussian coefficient $\sigma>0$, cumulant $\psi(s)=\log\mathbb E e^{sX_1}$ finite on $[0,s_{\max})$, an interior Cramér root $\psi(\lambda_*)=0$, and $\eta\in(0,\lambda_*)$ with $\psi'(\eta)=0$; put $\kappa_\infty=-\psi(\eta)$ and $v=\psi''(\eta)$. Let $\nu_L$ be the QSD of $X$ killed on leaving $(0,L)$ and $M_L(\theta)=\int e^{\theta y}\nu_L(dy)$. Write $\phi_\pm$, $m_\pm$, $V_\pm$ for the ladder-height exponents, means and renewal functions of the Esscher-centred process $Y$, and $K_\ell(b)=\pi^2m_+/(2b\phi_+(b))$, $K_r(b)=\pi^2m_-/(2b\phi_-(b))$.

**Theorem 2.2 (proof).**
$$
\lim_{L\to\infty}M_L(\theta)=\frac{K_\ell(\eta-\theta)}{K_\ell(\eta)}\ (\theta<\eta),\qquad
\lim_{L\to\infty}\frac{M_L(\eta)}{L^2}=\frac1{K_\ell(\eta)},\qquad
\lim_{L\to\infty}e^{-(\theta-\eta)L}M_L(\theta)=\frac{K_r(\theta-\eta)}{K_\ell(\eta)}\ (\theta>\eta).
$$
In particular $M_L(\lambda_*)\sim C_*e^{(\lambda_*-\eta)L}$ with $C_*=G_+(\lambda_*-\eta)/G_-(\eta)$, a ratio of transforms of the stationary overshoot laws.

**Further results.**

| Result | Status |
|---|---|
| Endpoint masses of the centred QSD: $L^2A_L(-b)\to K_\ell(b)$, $L^2e^{-bL}A_L(b)\to K_r(b)$ for every $b>0$ (Theorem 2.3) | proof |
| Restart rate $r_L\sim R_*e^{-\eta L}$, $R_*=(m_-/m_+)\phi_+(\eta)^2$; $\sup_B\lvert p_L^{\mathrm R}(B)/(1-e^{-R_*Be^{-\eta L}})-1\rvert\le\lvert a_L-1\rvert\to0$; failure probability not uniformly approximated (Theorem 2.6) | proof |
| The source's display (17) holds along $B_L$ iff $B_L=O(e^{\eta L})$; its ratio tends to $0$ if $B_Le^{-\eta L}\to\infty$ (Corollary 2.7) | proof |
| $C_*=1$ for Brownian motion; $C_*=\eta^2v/(2\kappa_\infty)<1$ spectrally negative with jumps; $C_*>1$ spectrally positive with jumps (Proposition 2.9) | proof |
| Source model $\psi(s)=-s+s^2/2-3s/(1+s)+2s/(4-s)$: $C_*\in[0.85014864899051539225,\,0.85014864899051539226]$, $R_*=0.906104425680\ldots$ | certified |
| Spectrally negative, $\sigma\ge0$, under a scale-function positivity condition (Q): same conclusions with $C_*=\eta^2\psi''(\eta)/(2\kappa_\infty)\le1$, $R_*=\eta^2\psi''(\eta)/2$ (Theorem 8.1, Corollary 8.2) | proof; (Q) checked numerically for compound-Poisson-plus-drift |
| Source model: $L^2\alpha_L=(\pi^2v/2)\,(L/(L+\delta))^2+O(L^{-2})$, $\delta=\delta_++\delta_-$; $C_L/C_*$, $R_L/R_*=1+g/L+O(L^{-2})$, $g=\tfrac{\pi^2}{2}(\delta_--\delta_+)=0.4974$ (Theorems 9.1, 9.2) | proof, given standard QSD-density regularity |
| The same first-order formulas for the whole class (Conjecture 9.9) | exploratory |

Recovered or standard: the subcritical limit (Kyprianou and Palmowski's half-line Yaglom law), the sine law of the bulk, $\kappa_L=\kappa_\infty+\pi^2v/(2L^2)+o(L^{-2})$, a large-deviation principle with rate $\eta u$, and the critical window.

## Technical account

**Centring.** The Esscher transform with parameter $\eta$ turns $X$ into a process $Y$ with zero mean and variance rate $v$. Its QSD $\widetilde\nu_L$ on $(0,L)$ is related to $\nu_L$ by $\nu_L(dy)\propto e^{-\eta y}\widetilde\nu_L(dy)$, so $M_L(\theta)=A_L(\theta-\eta)/A_L(-\eta)$ with $A_L(s)=\int e^{sy}\widetilde\nu_L(dy)$. For $\theta>\eta$ the numerator is dominated by mass near the target and the denominator by mass near the floor: the whole question is how much centred-QSD mass sits within $O(1)$ of each end.

**Bulk and layers.** After diffusive rescaling the centred process is Brownian motion killed at $0$ and $1$, so $\widetilde\nu_L(L\,du)\Rightarrow\tfrac\pi2\sin(\pi u)\,du$; the bulk alone would give each end a mass of order $L^{-2}$ with a universal shape. Jumps change that shape in a layer of width $O(1)$. Theorem 2.3 identifies it exactly: $L^2$ times the centred QSD near the floor converges to $\tfrac{\pi^2m_+}{2}V_+(y)\,dy$, the renewal function of the **ascending** ladder process, and near the target to the **descending** ladder counterpart. The orientation is the delicate point: swapping the two ladders would give $C_*\approx1.2926$ in the source model, which the exact finite-$L$ solution excludes. The proof uses exact Dynkin-type identities for the killed process and a Wiener–Hopf cancellation, not the heuristic that the QSD density is harmonic for the dual process.

**From layers to restart.** The restart rate is $r_L=\kappa_Lq_L$, where $q_L$ is the probability that a QSD cycle exits upwards. A stopped exponential-martingale identity expresses $q_L$ through the same endpoint masses, giving $r_L\sim R_*e^{-\eta L}$. Because the success time is exactly exponential (source Lemma 6.2), the saturation curve $1-e^{-r_LB}$ follows, and the relative error bound holds at every budget. The source's proof of its restart theorem asserted that $q_LB\to0$ whenever $B$ grows more slowly than $e^{\lambda_*L}$; since $q_L$ is of order $e^{-\eta L}$, this step needs $B=o(e^{\eta L})$.

**What is new, and what is classical.** QSDs of Lévy processes on half-lines (Kyprianou and Palmowski), spectrally one-sided processes in intervals via scale functions (Bertoin; Lambert), existence and ergodicity on intervals (Kolb and Savov), Wiener–Hopf and Vigon's *équation amicale*, Cramér estimates and Fleming–Viot approximation are established tools. The exact two-ended endpoint asymptotics, the constants $C(\theta)$ and $R_*$, the sign theorem for $C_*-1$, the corrected budget range and the finite-$L$ corrections were not found in the dated, bounded search recorded in the package's `RESEARCH_GATES.json`; that search does not establish priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/levy-qsd-exponential-moments-restart.txt) is available for reading.

- **Proofs.** Every theorem has a complete written proof in the manuscript. The proofs do not depend on any computation. Theorems 9.1 and 9.2 take a standard regularity property of the QSD density (F1) as given. No proof assistant was used.
- **Certified and exact checks.** An outward-rounded interval-arithmetic enclosure of $C_*$ and $R_*$ for the source model; exact rational lattice conjugacy checks; exact Brownian identities and the Brownian counterexample to the source's budget range. These verify instances, not the general theorems.
- **Numerical and exploratory results.** 70–85-digit evaluations of all constants, each by two independent formulas; an exact four-mode finite-interval solution of the source model for finite-$L$ tables; scale-function computations for spectrally negative models; second-order finite-$L$ constants; Conjecture 9.9. These are deterministic high-precision computations, not enclosures.
- **Replay.** `verify_all.py` reruns every script into a temporary folder and compares each data output byte for byte with the committed copy. A separate clean replay of the full suite reproduced every output; the released scripts and outputs were compared with that replay copy by hash, and only checks affected by changes were rerun before release.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review by a different model (OpenAI gpt-5.6-sol) and a verification re-review. A rating-free summary of objections and responses is in the package. This is not peer review, independent reproduction or formal verification.
- **Limitations.** The restart results assume exact, free, independent QSD draws and continuous monitoring of exits. Nothing is proved about Fleming–Viot or other approximate QSD sampling, restart overhead, discrete monitoring, random walks (which the source's theorem also covers) or two-sided pure-jump processes. Condition (Q) for compound-Poisson-plus-drift models is checked only numerically. No historical-priority claim is made.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Rare-event simulation practitioners | A budget rule, $B_p\approx-\log(1-p)\,e^{\eta L}/R_*$, and a clear point beyond which QSD restart stops paying; a reason to prefer multilevel splitting when the target is far | Idealised model: exact, free QSD draws and continuous monitoring; the cost of approximating the QSD is discussed only heuristically |
| Researchers on exploration in model-free simulation and reinforcement learning | A precise statement of how much restart from survivors can gain over independent runs, and where the gain stops | The theory concerns one-dimensional Lévy processes drifting away from a level, not general environments |
| Probabilists working on QSDs and fluctuation theory | Exact two-ended boundary-layer asymptotics, explicit constants through ladder exponents, and a sign theorem for jump asymmetry | Two-sided pure-jump processes and random walks are not covered; the general finite-$L$ conjecture is open |
| Readers of Garcia et al. (2026) | The conjecture's answer, the corrected budget range of their restart theorem and the faulty step in its proof | The exact restart law and the lower budget range of their theorem are unaffected |

## Why the problem matters

Restart from a quasi-stationary state is attractive because it needs no model of the system: one only has to keep the runs that survive and copy them when others fail. Knowing exactly how its success rate scales tells a practitioner how large a simulation budget is worth spending, when the method has saturated, and when a multilevel method is needed instead. The result also corrects a published theorem whose stated budget range was too wide, and it explains, through the boundary layers, why the elegant Brownian picture does not carry over unchanged to processes with jumps.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.13 and NumPy, SciPy, SymPy, mpmath and Matplotlib:

```sh
python3 -B e4_ratio_one.py --out /tmp/check          # interval enclosure of C* and R* in the source model
python3 -B double_exponential_prefactor.py --out /tmp/check   # standard library: two formulas for C*
python3 -B verify_all.py                             # rerun every check; compare outputs byte for byte
python3 -B verify_all.py --figures                   # also regenerate and compare the figures
shasum -a 256 -c SHA256SUMS
```

Start with Section 1 of the paper (the restart problem and the verdict on each reading of the conjecture), then Section 2 (main results) and Section 4 (the boundary layers). `README.md` and `target.yaml` map every claim to its status, and `AI_INDEX.md` maps results to evidence.

## The most valuable next projects

1. Have a specialist in Lévy fluctuation theory check the endpoint-mass theorem (Section 4), especially the orientation of the ladder processes, and the corrected budget range (Corollary 2.7).
2. Quantify implementable restart: Fleming–Viot approximation error, restart overhead and discrete monitoring.
3. Extend the moment theorem to two-sided pure-jump processes and to random walks.
4. Prove the general first-order finite-$L$ formula (Conjecture 9.9).

## What is in the evidence package

The manuscript (PDF and LaTeX source), the check scripts with their committed deterministic outputs and figures, the replay script, the machine-readable target statement (`target.yaml`), a rating-free review summary, claim, status, assurance and provenance records, a dated prior-art and limitation record (`RESEARCH_GATES.json`), an agent index, licences (CC0-1.0 for prose and data, MIT for code) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
