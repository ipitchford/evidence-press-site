## Summary

**What these schemes are for.** Many models in atmospheric chemistry, ocean ecology and biochemistry track quantities that can never be negative: concentrations, biomass, population fractions. Such models are usually *stiff*: some reactions are thousands of times faster than others, so simple numerical methods need tiny time steps. Modified Patankar–Runge–Kutta (MPRK) schemes are time-stepping methods designed for exactly this situation. They keep every quantity positive and conserve total mass for *any* step size, which is why modellers use them with large steps.

**What was conjectured.** A large step raises a natural worry: does the computed solution still end up at the right steady state? In 2024 Izgin, Kopecz, Meister and Schilling showed that some MPRK schemes with *negative* coefficients can fail, and conjectured that schemes whose underlying coefficients are all *nonnegative* always succeed — from every starting point and with every step size.

**What was found.** The natural reading of that conjecture is false. The scheme MPRK22(4/7) has only positive coefficients (4/7, 1/8 and 7/8). Apply it with step size 1 to the simplest possible linear reaction, two species exchanging mass at rates 9990 and 10, and start with the mass split evenly. The true steady state gives the first species 0.1% of the mass. The computed solution never gets there: it jumps for ever between two wrong states, about (0.49, 0.51) and (0.0000001, 0.9999999). Positivity and mass are preserved exactly, so the usual sanity checks do not notice anything wrong.

**Why it matters to users.** The true steady state is still the scheme's only steady state, and it is locally stable — yet only about 11% of evenly spread starting splits reach it. Every failure found combines a lopsided equilibrium (one species holding about 1% or less of its partner's share) with a step far longer than the fastest time scale; both are routine in stiff kinetics and biogeochemistry. In tests, adaptive error control rejected the cycle steps at ordinary tolerances, so the main risks are fixed large steps (for example in operator-split models), very loose tolerances and steady-state solvers that take huge pseudo-time steps. The paper also proves that two common members of the family, MPRK22(1/2) and MPRK22(1), always converge for two species, and recommends $\alpha=1$.

**Status.** An anonymous, AI-assisted, unrefereed candidate. The key computations are certified in exact arithmetic and can be rerun; there has been no external peer review or independent reproduction.

## Summary for specialists

Write MPRK22$(\alpha)$ for the second-order MPRK scheme with $a_{21}=\alpha$, $b_1=1-\tfrac{1}{2\alpha}$, $b_2=\tfrac{1}{2\alpha}$, which has a nonnegative tableau for $\alpha\ge 1/2$. The paper formalises the conjecture as *global linear stability*: for every positive conservative linear system $y'=Ay$, every $\Delta t>0$ and every positive $y^0$ with the right linear invariants, the steady state $y^*$ is a stable fixed point and $y^n\to y^*$ (Definition 1, Conjecture 2). The source states the conjecture in words; this formal reading is the paper's.

**Counterexample (Theorem 5, certified).** For MPRK22$(4/7)$ with $\Delta t=1$ and
$$
A=\begin{pmatrix}-9990&10\\ 9990&-10\end{pmatrix},\qquad y^0=(1/2,1/2),
$$
the iterates converge to an attracting positive two-cycle, approximately $(0.4935,\,0.5065)$ and $(1.08\cdot10^{-7},\,0.99999989)$. The steady state $y^*=(10^{-3},\,1-10^{-3})$ is the unique positive fixed point on the unit-mass simplex, with multiplier $-349959993/400110007$, so it is locally asymptotically stable.

**Further results.**

| Result | Status |
|---|---|
| Complete phase portrait of the counterexample: the steady state attracts exactly the first components in $(s_L,s_H)$, of length $\approx 0.10805$; $\{s_L,s_H\}$ is a repelling two-cycle (Theorem 6) | certified + proof |
| Two-cycles for every $\alpha\in(1/2,\,1/\varphi)$, $1/\varphi=(\sqrt5-1)/2$, at small $p$ and large $K=\lvert\lambda\rvert\Delta t$ (Theorem 9) | proof |
| Explicit region $\alpha\in[0.53,0.56]$, $p\in[10^{-4},10^{-3}]$, $K\in[10^4,10^6]$ with two-cycles; attracting cycles for all $K\ge10^4$ at nine $(\alpha,p)$ pairs (Theorems 10–11) | certified |
| Attracting two-cycle for the chain A ⇌ B ⇌ C and for the third-order MPRK43II$(37/50)$ (Theorems 12–13) | certified |
| No spurious positive fixed points for $1/2\le\alpha\le1$ in any dimension; global convergence for two species at $\alpha=1/2$ and $\alpha=1$ (Proposition 14, Theorems 15–16) | proof |
| Refined conjecture: for two species, global stability iff $\alpha=1/2$ or $\alpha\ge1/\varphi$; MPRK22(1) globally stable in all dimensions (Conjecture 17) | open |

## Technical account

**Reduction to one dimension.** For two species, mass conservation reduces the scheme to a scalar map $F$ on $(0,1)$ acting on the first component. Writing the system as $K A_p$ with equilibrium fraction $p$, the map depends on $\alpha$, $p$ and $\kappa=1/K$, and extends continuously to $\kappa=0$, the limit of infinitely large steps. The steady state is the unique fixed point $p$, and its local multiplier is the familiar stability function $R(-K)$.

**Mechanism (heuristic, Section 3 of the paper).** When $p$ is small and the step is long, the first stage lands almost on the steady state and the Patankar weights act like a ratchet. A *crushing step*: a species far above its equilibrium share gets a large weight, and the linear solve overshoots far below equilibrium, to order $p^{r+1}$ with $r=1/\alpha$. A *return step*: now far below equilibrium, the species gets a tiny weight that switches off its destruction term, and it is thrown back to a macroscopic value. The competing terms have ratio of order $p^{r(r-1)-1}$, so the ratchet works when $r(r-1)>1$, that is $\alpha<1/\varphi$; this is where the golden-ratio threshold comes from. The symmetric test system behind the conjecture ($p=1/2$, moderate step) lacks both ingredients, which explains — without proving that they are necessary — why the failure was not seen there.

**What is new, and what is classical.** Spurious period-two orbits of numerical methods are classical for nonlinear differential equations (Iserles; Hairer, Iserles and Sanz-Serna; Humphries; Stuart and Humphries). Known failures of MPRK-type schemes involved negative coefficients and spurious fixed points. Here the differential equation is linear, the tableau is positive, the physical fixed point is unique and locally stable, and the failure is an attracting cycle produced by the Patankar weights. Within the dated search recorded in the package, no earlier statement of this mechanism or refutation was found; that search does not prove priority.

**How the certificates work.** Each certified theorem is checked by a short standalone Python program using outward-rounded rational interval arithmetic. For Theorem 5 the program finds two rational intervals, $L$ near $10^{-7}$ and $H$ near $0.49$, shows that $F$ maps each strictly into the other and bounds $\lvert (F^2)'\rvert<24/25$ on both, so $F^2$ is a contraction there and $1/2\in H$ converges to the cycle. Written proofs carry everything that is not a finite inequality.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/mprk-nonnegative-two-cycles.txt) is available for reading.

- **Proofs.** Lemma 3, Theorem 9, Proposition 14 and Theorems 15–16 are written proofs; Theorems 6 and 10 combine argument and certificate.
- **Certificates.** Seven verifiers (C1–C7) write JSON certificates that record the hashes of their own source and libraries. No floating-point value enters a decision, and acceptance tests stay active under `python -O`. All seven regenerate byte for byte; this was checked in a separate clean replay and again on the frozen archive before release.
- **Negative controls.** The trapping test holds at the counterexample and fails for the symmetric system and for $\alpha=1/2$, $2/3$ and $1$; tampered certificates and libraries are detected; the verifiers stop on a wrong problem and on the misprint $a_{31}=113/222$ that internal review found and corrected.
- **Review.** Internal AI-assisted review in several roles, a verification re-review with independent recomputation in different software, and an adversarial review by a different AI model. A rating-free summary of the objections and their resolution is in the package. This is not peer review, and the recomputations are not independent reproduction.
- **Limitations.** The refuted statement is the paper's formalisation of a conjecture stated in words. The verifiers are not proof-assistant proofs; Python execution and the written reduction of each scheme to the evaluated map are in the trust boundary. Closed-form parameter thresholds, a sharp failure region, three-species global convergence for $\alpha=1/2$ and the refined conjecture remain open. Nonlinear systems, the phase diagram and random-network frequencies are exploratory floating-point results.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Users of positivity-preserving integrators | Positivity, mass conservation and local stability do not guarantee arrival at the correct steady state. The paper recommends $\alpha=1$ for MPRK22, avoiding $1/2<\alpha<0.62$ when large fixed steps are possible, and monitoring sign alternation of $y^{n+1}-y^n$ or the embedded error estimate | All failures found combine asymmetric equilibria with long steps, but necessity is not proved; nonlinear systems were tested only numerically |
| Numerical analysts working on MPRK stability | A concrete, certified counterexample and a refined conjecture with partial proofs | The counterexample refutes the formalised universal statement, not every possible restricted reading |
| Researchers in rigorous numerics and research agents | Small exact-arithmetic verifiers with byte-identical certificates and negative controls, reusable as templates | Byte identity shows integrity, not that the code encodes the mathematics; check the written reductions |

## Why the problem matters

Global behaviour is what a modeller relies on when taking large steps towards a steady state, for example in pseudo-transient continuation or in ecosystem models whose step is set by ocean transport. Local stability theory, which was already available, only covers starting points near the steady state. This result shows that for MPRK schemes the gap between local and global behaviour is real even with positive coefficients, identifies where it opens up, and proves that two widely used members are safe for two species.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.10 or later and no third-party packages:

```sh
python3 -S -O verify_all.py --skip-slow   # C1, C2, C3, C5, C7 in seconds
python3 -S -O verify_all.py               # all seven, about 15 minutes
python3 -S -B negative_controls.py        # the checks reject wrong inputs
shasum -a 256 -c MANIFEST.sha256
```

`verify_all.py` copies the verifiers to a temporary directory, regenerates every certificate and compares it byte for byte with `certificates/`. Start reading with Section 2 of the paper (the scalar map) and Theorem 5; `AI_INDEX.md` maps every theorem to its evidence.

## The most valuable next projects

1. Replay C1 and C2 in an independent interval library (Arb, MPFI or a proof assistant) and check the reduction of MPRK22 to the scalar map.
2. Settle Conjecture 17(a): two-species global convergence of MPRK22$(\alpha)$ for $\alpha\in[1/\varphi,1)$ and $\alpha>1$.
3. Prove or refute global convergence of MPRK22(1) in three or more dimensions.
4. Find closed-form thresholds $p_0(\alpha)$, $K_0(\alpha)$, and test whether other nonnegative-tableau schemes (SSP-MPRK, MPDeC) admit attracting cycles on asymmetric stiff systems.

## What is in the evidence package

The manuscript (PDF, LaTeX source and an accessible text version), the seven verifiers with their exact-arithmetic library and archived certificates, the replay script and negative controls, the floating-point exploratory scripts and outputs, the original target statement, the dated prior-art search, a rating-free review summary, claim, status, assurance and provenance records, an agent index, licences (CC0-1.0 for prose and data, MIT for code) and SHA-256 manifests. The same files are in the GitHub release and the Zenodo record.
