## Summary

**Selfish routing and the price of anarchy.** Transport planners model a road network by assuming that every traveller takes a route that is cheapest for them, given what everyone else does. No one can save time by switching. This is a **Wardrop equilibrium**, named after the engineer who proposed it in 1952. It describes selfish routing: each driver minimises their own travel time, not the total. The **price of anarchy** is the ratio of total travel time at equilibrium to the smallest total time a central planner could achieve. A value of 1.05 means selfish routing wastes 5%.

**Why planners watch these curves as demand grows.** As traffic grows, total travel time and the price of anarchy change, and from time to time a new route becomes worth using. Earlier work found that the price of anarchy often peaks or kinks near such moments. Planners and researchers therefore read the shape of these curves to see when the network changes its behaviour, for example where an extra road or a toll would matter.

**What Cominetti, Dose and Scarsini asked.** In a 2024 paper (Transportation Research Part B; arXiv:2305.03459), Cominetti, Dose and Scarsini proved that these curves are smooth while the set of cheapest routes stays fixed, if every road's delay rises strictly with traffic. They also proved that when a new route switches on, the slope of total travel time can only move in one direction. They left two questions open.

1. The standard delay formula used in practice, the BPR formula, is flat when a road is empty. Do traffic flows still change smoothly with demand when that happens?
2. For BPR and other convex delay formulas, must the slope of total travel time and of the price of anarchy *jump* when a new route switches on?

**What this release finds.**

- **Question 1: yes, away from zero demand.** While the set of cheapest routes is fixed, the traffic on every road changes smoothly with demand, on any network and with BPR delays. At zero demand a general version fails; whether it fails for BPR delays there is open.
- **Question 2: no.** A network of five roads with the ordinary quartic BPR formula has a new route that switches on with **no visible kink**: total travel time and the price of anarchy keep four continuous derivatives. The trick, shown in the banner, is two groups of parallel roads ("banks") whose delay curves touch very closely at the switching point, so the new route becomes attractive extremely slowly.
- **Five roads is the minimum** for networks in which every road uses the same BPR exponent, and bigger networks can hide the switch to any finite number of derivatives.
- **The slope never jumps the wrong way.** For BPR delays, even with zero free-flow times, the slope moves only in the direction the earlier paper predicted.
- **Hidden switches are exceptional.** For almost every choice of the roads' free-flow times, the slope does jump at ordinary (nondegenerate) switching points. Smooth switches need exact tuning.

**What it means for practice.** When a switch is hidden, the new route carries a trickle of traffic far below what an assignment program at ordinary accuracy can resolve: after 10% more demand it carries about 0.01% of the travellers who could use it. A kink in total travel time is therefore not a reliable sign that the route pattern has changed. Individual link flows reveal the change earlier. An exploratory test on the Sioux Falls benchmark network found only ordinary switches with clear kinks, so hidden switches may be rare in real networks; one test network cannot say how rare.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Results are labelled proof, exact computation, numerical, exploratory or open. There has been no external peer review, independent reproduction or formal verification.

## Summary for specialists

**Setting** (Cominetti, Dose and Scarsini, CDS, arXiv:2305.03459v2 numbering). Static multi-commodity nonatomic routing with separable nondecreasing link costs and demands $\mu(t)=tr$. Total equilibrium cost $E(t)$, optimum cost $S(t)$ and price of anarchy $P=E/S$. A *breakpoint* is a demand at which the set of cheapest routes (the regime) changes; it is *nested* when one regime contains the other.

**Question 1** (after CDS Remark 3.5): does CDS Theorem 3.2 extend to costs with zero derivative only at the origin? **Theorem 3.1 (proof).** If every link cost is $C^1$ with $c_e'(z)>0$ for $z>0$, then along any $C^1$ demand path the equilibrium link flows are $C^1$ on every open interval with a constant regime, and so is $E$; $S$ and $P$ are $C^1$ too when every $zc_e(z)$ is strictly convex, as for BPR costs. Zero-slope links may form cycles, free-flow times and demands may vanish, route sets may be restricted and exponents may differ. The one-sided extension at $t_0=0$ fails in general (Proposition 3.3, oscillating costs); the BPR endpoint case is open.

**Question 2** (before CDS Example 4.9): is the slope change strict for convex or BPR costs, as CDS Theorem 4.4(ii) shows for affine costs? **No.**

| Result | Status |
|---|---|
| Three links: strictly convex polynomial costs, and mixed BPR exponents (contraction), with $E,P\in C^4\setminus C^5$ (§5.1) | proof; exact |
| Five links, common quartic BPR, genuine expansion: $E(t)=E_0(t)-\tfrac{84672}{78125}(t-1)_+^5+O\big((t-1)_+^6\big)$, so $E,P\in C^4\setminus C^5$, $E'(1)=164/5$ (§5.2) | proof; exact |
| $m+2$ links: $E,P\in C^{2m-2}\setminus C^{2m-1}$ for every $p>1$ (Theorem 5.3) | proof |
| Five links minimal with a common exponent, expansions and contractions (Theorem 6.1, App. B) | proof; finite enumeration as a check |
| Mixed exponents: contractions need three links; expansions four or five | proof; open |
| Weak comparison: CDS Theorem 4.4(i) holds for BPR costs at expansions and contractions, zero free-flow allowed (Theorem 4.1, Corollary 4.2) | proof |
| Strict jumps for almost every free-flow vector at nondegenerate nested breakpoints (Theorem 4.5) | proof |
| Optimum-side transition at $t=1/\gamma$: $S\in C^{2m-1}\setminus C^{2m}$, and the same for $P$ when $E$ is $C^{2m}$ there, checked exactly in the quartic example (Theorem 7.4); the size of the jump, about $+89.7$, is numerical | proof; exact interval check; numerical value |
| Kinks return under perturbation with size $\lvert\varepsilon\rvert^{2-2/m}$; transverse demand directions give $C^1\setminus C^2$ (§7) | proof |
| Hidden activation below assignment tolerance; link flows reveal it earlier (§8) | numerical |
| Sioux Falls: link activations along a demand scaling are transverse with visible kinks (§8.5) | exploratory |

Scope of the minimality theorem: costs $a_e+b_ez^p$ with $a_e,b_e>0$ and one common $p>1$, every simple path available, proportional positive demands and nested breakpoints.

## Technical account

**Two banks and a connector.** Commodity A travels $s\to v$ and B travels $u\to v$, each with demand $4t$. Bank $F$ has direct links $2+z^4$ and $\tfrac83+z^4/243$; bank $G$ has shared links $\tfrac32+z^4/162$ and $\tfrac74+z^4/4$; the connector $h:s\to u$ costs $1+z^4$. With bank delays $F(T)$ and $G(T)$ at bank load $T$, the connector route is cheapest when the route gap
$$
\Delta(t)=F(4t)-G(4t)-1
$$
is positive. At $T=4$ the two curves agree in value, slope and curvature, so $\Delta(t)=\tfrac{336}{625}(t-1)^3+O((t-1)^4)$. Each link in a bank supplies one free coefficient: $m+1$ bank links can make $m-1$ derivatives agree.

**Why the orders add.** The connector flow is about $\Delta/L_0$, of order $m$ (here $x\approx\tfrac{84}{125}(t-1)^3$). To first order the change in total cost is the flow moved times the rate at which the gap opens, $E-E_0\approx-t\,\Delta'(t)\,x$, of order $(m-1)+m=2m-1$. With $m=3$ the difference is of order $(t-1)^5$. In potential terms, the Beckmann potential changes by $-\Delta^2/(2L_0)$, of order $2m$, and $E=tV'$ loses one order.

**Question 1.** The fixed-regime proof replaces the nondegeneracy assumptions of classical sensitivity analysis by a uniform bound for weighted least-squares problems (Stewart; Forsgren), which survives links with zero slope at zero load even when those links form cycles. The price-of-anarchy part uses a Danskin envelope argument valid for zero demands and restricted routes.

**Slope comparison and genericity.** One-sided slopes of $E$ are given by a quadratic minimisation over the regime's route-load cone (the method of CDS Section 5). A positive annihilator replaces strict positivity of slopes and free-flow costs, giving the weak inequalities for BPR costs. Equality is a tangency; Sard's theorem in the chart of free-flow costs shows tangencies are a null set at nondegenerate breakpoints.

**What is classical.** Wardrop equilibrium, the Beckmann potential, the envelope theorem, Sard's theorem and weighted least-squares bounds are standard. Loss of strict complementarity in parametric optimisation generically produces a kink (Jongen, Jonker and Twilt), which agrees with the genericity theorem. The new content is the two answers, the minimal five-link construction and its minimality proof, the weak comparison for BPR costs and the genericity statement at breakpoints.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/wardrop-smooth-route-regimes.txt) is available for reading.

- **Proofs.** Every theorem has a complete written proof in the 51-page manuscript; the general statements do not depend on computation. No proof assistant was used.
- **Exact computation.** Rational-arithmetic checks of the small examples, the five-link series constants, contact and transversality identities, the weighted basis, the multi-contact reconstruction and a finite enumeration supporting the minimality theorem. These confirm constants and instances, not the general theorems.
- **Numerical and exploratory results.** The practice section uses 50–60-digit computations with the physical costs, checked against the exact series. The Sioux Falls scan is exploratory: one test network, one artificial demand path, path-based solver at relative gap $10^{-12}$.
- **Replay.** `verify_all.py` copies the package, reruns every program and compares every generated record byte for byte. A clean full replay of the final package was run in a separate copy before release; the released scripts and outputs were bound to it by SHA-256, and checks affected by publication changes were rerun.
- **Review.** Internal AI-assisted review in several roles, an AI-assisted adversarial review by a different model (OpenAI gpt-5.6-sol) and a verification re-review. This is not peer review, independent reproduction or formal verification.
- **Limitations.** Deterministic static user equilibrium only (under logit stochastic equilibrium every route is used and there are no breakpoints). The minimality theorem holds only in the stated class. The two-bank count of matching derivatives is specific to that architecture. Genericity covers nondegenerate breakpoints only. The zero-demand BPR case is open.

## Relationship to earlier work

**Cominetti, Dose and Scarsini (2024)** posed both questions; this paper follows their arXiv v2 numbering and restates the results it uses. Their Remark 4.6 noted that their Theorem 4.4(i) would extend to BPR costs given an answer to Question 1; Corollary 4.2 supplies that extension, by a route that does not go through Question 1.

**Wang, Shao and Wu (2026, arXiv:2610.16185)** prove, for continuous nondecreasing costs, that the Beckmann value function is $C^1$ on the open positive demand cone, and deduce that total cost and the price of anarchy are $C^1$ inside every region of demand space with a fixed positive-flow support, with no condition on cost slopes. That overlaps this paper's conclusion that $E$ and $P$ are $C^1$ within a regime. Their cellwise result for link costs and loads assumes that every cost has positive slope everywhere or is constant, which excludes BPR costs with zero slope at zero load; so it does not give $C^1$ **link flows** for BPR costs, the main conclusion of Theorem 3.1. Their results are also stated on full-dimensional interiors of demand regions, so they do not cover demand paths that slide along the boundary between regions, or vanishing demands. Their measure-zero result concerns where in demand space the price of anarchy fails to be differentiable; the genericity theorem here concerns the size of the slope jump at a breakpoint, for almost every free-flow vector. They also use Sioux Falls as an illustration.

**D'Ambrosio (2026, arXiv:2609.26179)** gives a quartic BPR network whose price of anarchy has an interior local maximum while the active network is constant: a statement about the shape of the curve, not slope equality at breakpoints. Classical sensitivity analysis (Hall; Dafermos and Nagurney; Tobin and Friesz; Patriksson; Lu) gives directional derivatives under strict monotonicity or nondegeneracy, which the degenerate zero-slope case of Question 1 does not satisfy.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Traffic-assignment practitioners | Do not read route changes off kinks in total travel time; monitor link flows and commodity costs, and estimate contact order from a few assignments | The hidden example is tuned; the Sioux Falls test found only visible kinks |
| Researchers on the price of anarchy | Complete answers to the CDS questions, a minimal example and a genericity theorem | Minimality only in the common-exponent class; mixed-exponent expansions open |
| Sensitivity-analysis and optimisation researchers | A $C^1$ result for equilibria with degenerate zero-slope links via weighted least-squares bounds | Interior demands only; endpoint BPR case open |
| Readers of Wang, Shao and Wu (2026) | Where the two works overlap and differ | Overlap on $C^1$ totals is genuine |

## Why the problem matters

Demand curves of total travel time and the price of anarchy are used to study when congestion makes selfish routing costly and when network changes pay off. If route-set changes always left a kink, the curves would be a reliable map of the network's regimes. This work shows that they need not, explains exactly why, bounds how small a network can hide a change, and shows that exact hiding is exceptional, so that the practical risk is near-invisible changes rather than perfectly invisible ones.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.11 or later (exact checks need the standard library and SymPy; numerical checks also need mpmath, NumPy, SciPy and Matplotlib):

```sh
shasum -a 256 -c SHA256SUMS
python3 tools/fetch_siouxfalls.py   # fetch the Sioux Falls test files and check their SHA-256
python3 verify_all.py --quick       # skips the two slow numerical programs
python3 verify_all.py               # every check, about 5 minutes
```

Start with Section 1 of the paper (both questions quoted, the answers and the two-bank idea), then Section 5.2 (the five-link example) and Section 8 (practice). `README.md` maps each result to its status and `evidence/claim_ledger.json` lists every claim with its hypotheses and evidence.

## The most valuable next projects

1. Does CDS Theorem 3.2 extend to BPR costs at zero demand?
2. Is strictness generic at degenerate nested breakpoints, where the smaller regime contains an unloaded link?
3. Do four links suffice for a smooth expansion when BPR exponents differ between links?
4. How smooth can non-nested breakpoints be?
5. How often do near-tangent activations occur in calibrated networks, and how small are their kinks?

## What is in the evidence package

The manuscript (PDF and LaTeX source with its generated bibliography), the exact and numerical check programs with their committed outputs, figures, a claim ledger, the replay script, a script that fetches and hash-checks the third-party Sioux Falls data, claim, status, assurance and provenance records, a dated prior-art and limitation record (`RESEARCH_GATES.json`), an agent index, licences (CC0-1.0 for prose and original data, MIT for code; the Sioux Falls data are not redistributed) and SHA-256 sums. The same files are in the GitHub release and the Zenodo record.
