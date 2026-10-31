## Summary

**The setting.** Many reactions in living cells happen inside compartments that grow and divide. A standard mathematical model, set out by Anderson, Howells and Rojas La Luz in 2026, puts the same random chemistry in every compartment and lets a compartment divide at a rate proportional to the amount of one chosen molecule inside it. At each division the contents are shared between two daughters by a fixed rule.

**What "explosion" means here.** A random model of this kind *explodes* if infinitely many events (reactions or divisions) happen before some finite time. After that the model stops making sense. Explosion is a mathematical breakdown, not a chemical detonation or a prediction about real cells. A good model should not explode, so it matters which modelling choices can cause it.

**The question.** The source paper conjectured that a chemistry which does not explode on its own will not explode inside dividing compartments either. It singled out *inflow* reactions, in which molecules appear from nothing, as the main danger, because their total rate grows with the number of compartments, and it suggested that without inflows no such feedback can occur. An earlier preprint by Yoo already found a counterexample that uses inflow and compartment fusion. This release asks the narrower question: does removing every inflow reaction, and all fusion, make the conjecture safe?

**What was found.** No. Take a substrate S that makes more of itself and an inhibitor I that holds it in check. In a single compartment the inhibitor wins and the system is well behaved. Now let compartments divide so that all of the substrate stays in one daughter, while each inhibitor molecule may leave with the other daughter. Division keeps throwing inhibitor away, and the substrate can then outgrow it and explode. In a three-molecule example the paper proves that explosion happens with probability at least one half, and computes the probability as 0.7975 to four decimal places.

**The thresholds.** The paper finds the exact boundary between explosion and safety for two kinds of inhibitor. If the inhibitor multiplies by converting substrate, explosion is possible exactly when d + λ·E[log Q] < b, where b and d are the growth rates of substrate and inhibitor, λ sets how often compartments divide and Q is the chance that an inhibitor molecule is kept. If the inhibitor works as a catalyst and does not multiply, the condition involves only the average of Q. On both boundaries the model is safe.

**What compartments add.** Throwing inhibitor away all at once at division is not the same as removing it molecule by molecule with an ordinary chemical reaction at the same average rate. For the multiplying inhibitor, division causes explosion over a strictly larger range of rates. For the catalytic inhibitor the two give the same threshold.

**How sure we are.** The theorems have written proofs; computer checks confirm the algebra and the example probability. This is an anonymous, AI-assisted, unrefereed candidate. Its review was internal, not peer review. The mathematical building blocks are classical and are cited; the new part is the chemical construction and its exact classification.

## Summary for specialists

Compartments run a two-species stochastic mass-action chemistry with no empty source complex, and there is no inflow, exit or coagulation. A compartment with $s$ substrate molecules divides at rate $\lambda s$; the substrate-keeping kernel sends every $S$ to one daughter and, given a fresh $Q\in[0,1]$ at each division, each $I$ independently with probability $Q$. Initial $s_0\ge2$; $\mathbb E\log Q\in[-\infty,0]$ with $\log 0=-\infty$.

| Result | Status |
|---|---|
| Conversion inhibition $2S\to3S$ ($bs(s-1)$), $S\to S+I$ ($cs$), $S+I\to2I$ ($dsi$), $d>b$: nonexplosive alone; explodes with positive probability iff $d+\lambda\,\mathbb E\log Q<b$; nonexplosive at equality; always explosive if $\mathbb P(Q=0)>0$ (Theorems 3.1, 5.1) | proof |
| Exact conditional law: $\mathbb P(T<\infty\mid\mathcal E)=\mathbb P(\sum_j\mathrm{Bernoulli}(e^{-b\tau_j})<s_0-1)$ over the conversion times $\tau_j$ of the marked inhibitor environment (Theorem 3.1(f)) | proof |
| Almost surely on explosion: $(T-t)S(t)\to1/b$ and $C(t)/\log\frac1{T-t}\to\lambda/b$ (Theorem 3.3) | proof |
| Catalytic inhibition $I+2S\to I+S$ ($dis(s-1)$): explodes iff $b\lambda(1-\mathbb EQ)>dc$; equality nonexplosive; $\mathbb P(T<\infty\mid I)=1-(1-1/(bD_\infty))^{s_0-1}$ (Theorems 4.1, 5.2) | proof |
| With well-mixed degradation $S+I\to S$ ($\delta si$): threshold $d-\delta+\lambda\,\mathbb E\log Q<b$. Matching the mean removal rate, degradation alone gives the strictly smaller region $\lambda(1-\mathbb EQ)>d-b$; for catalysis the thresholds coincide (Theorem 6.1, Corollary 6.2, Proposition 6.3) | proof |
| Explosion probability monotone in retention and division rate, and tending to $0$ at both thresholds; persists under bounded substrate leakage (conversion) (Propositions 6.4, 6.5) | proof |
| $b=c=1$, $d=2$, $\lambda=3$, $Q\equiv0$, $(S,I)=(3,0)$: $\mathbb P(T<\infty)\ge1/2$ (Theorem 3.2) and $\mathbb P(T<\infty)\in[0.79744,0.79751]$ (Section 7.1) | proof; computation with rigorous truncation and rounding control |

## Technical account

**One change of clock.** Run time at speed $S$: $du=S\,dt$. In this operational clock every inhibitor rate loses its dependence on the substrate, so the inhibitor becomes an autonomous environment: a branching (conversion) or immigration (catalysis) process thinned by divisions that arrive at constant rate $\lambda$. The substrate excess $Z=S-1$ is a Yule process of rate $b$ that loses one molecule at each conversion event (conversion), or a linear birth–death process with death rate $dI(u)$ (catalysis). Explosion is exactly survival of $Z$ with exponential growth, because then $\int du/S<\infty$.

**Conversion: scheduled removals.** Conditionally on the conversion times, the surviving Yule families stay geometric, and each removal extinguishes a family with probability $e^{-b\tau_j}$. This gives the Poisson-binomial law, positive survival iff $\sum_je^{-b\tau_j}<\infty$ (a criterion of Leskelä, Robert and Simatos), and a Gamma-mixture limit. Thinned inhibitor branching grows at rate $d+\lambda\,\mathbb E\log Q$ (the classical log-criterion for branching with disasters). Below $b$ the sum converges; at or above $b$ a single successful inhibitor family, found by an ergodic argument, forces the substrate to die.

**Catalysis: Kendall's formula.** The inhibitor regenerates at zero with exponential moments, its long-run mean is $c/(\lambda(1-\mathbb EQ))$, and Kendall's birth–death formula gives the explosion law. At the boundary the regeneration increments form a centred random walk with positive variance, which drives the survival probability to zero.

**Why the logarithm.** Division removes a random fraction of a self-reproducing population at once, and for a multiplicative process the average of the logarithm of the factor matters, not the average factor. That is the purely compartmental effect, measured exactly by comparison with a well-mixed degradation reaction.

**Classical and new.** Branching with catastrophes, Yule processes with scheduled removals, linear birth–death processes in varying environments, regeneration and random time changes are classical and cited at the point of use. The candidate contribution is the chemical construction within the framework of the source paper, its exact reduction to these objects, and the sharp classification within the two families, with the comparisons and the enclosure.

## Evidence, assurance and limitations

- **Proofs.** Every theorem, proposition and lemma has a written proof in the 24-page manuscript.
- **Exact checks.** A standard-library program makes 4,311 exact rational comparisons: generators in physical and operational time, allocation normalisation and conservation, factorial moments, the branching generating-function equation, 100 scheduled-removal distributions by two independent methods and the constants of the $1/2$ bound. Four built-in corruptions must be rejected.
- **Enclosure.** A deterministic computation bounds the example probability from both sides through monotone comparisons, uniformisation with a Poisson tail bound, dyadic time steps and decimal evaluation of every exponential; its rounding argument is written out but not machine-checked. A Monte Carlo estimator with a proved truncation bound and two separate direct simulations agree.
- **Review.** Internal AI-assisted review in five roles plus an outside-model adversarial review led to one revision with six extensions. A re-review and proof audit found seven repairable defects, all fixed; four further targeted audits checked the repairs and the enclosure rounding argument until no open correctness issue remained. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The division rule keeps all substrate together (a bounded leak is allowed for the explosive direction); kernels that split every molecule independently are not covered. The isolated conversion chemistry is nonexplosive only for $d\ge b$, so its stability depends on an inhibitory reaction; chemistries with a linear Lyapunov function cannot be destabilised this way. The prior-art search was bounded, and Yoo's full preprint could not be inspected.

## Relationship to earlier work

A companion Evidence Press release, [Critical nonexplosion and phase transitions in finite-catalyst compartment systems](/releases/compartment-fragmentation-phase-classification/), studies the opposite question from the same source paper: when division *prevents* explosion by diluting the growing species. Here division *causes* explosion by exporting the inhibiting species. In both, a logarithmic retention loss sets a critical boundary.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Reaction-network theorists | A concrete inflow-free, fusion-free counterexample and the mechanism behind it | Restricted to substrate-keeping kernels; the conjecture for molecule-blind kernels is open |
| Probabilists | A worked example where log-mean and mean retention separate, with exact conditional laws | The probabilistic components are classical |
| Modellers of dividing cells | A warning that separate checks of the chemistry and of the division rule do not guarantee a well-defined model | Explosion is an idealisation signal, not a biological prediction |
| Research agents | Machine-readable claims, an agent index, exact checks and negative controls | Finite checks do not prove the infinite-time theorems |

## Why the problem matters

Compartment models are used to study chemistry in growing and dividing cells. Before trusting one, a modeller needs to know that it has a well-defined history for all time. The source paper's heuristic located the danger in inflow reactions. This release shows that a different and simpler mechanism, selective export of an inhibitor, is enough, and that its effect depends on whether the exported molecule reproduces. That tells modellers which division rules and which kinds of stability need separate checking.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.11 or later:

```sh
shasum -a 256 -c SHA256SUMS
python3 run_checks.py              # exact checks, standard library
pip install numpy==2.3.5
python3 run_checks.py --full       # estimator and full enclosure (about two minutes)
python3 negative_controls.py       # every corruption must be rejected
```

The checks contain no `assert` statements, so `python3 -O` gives identical results. `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Decide whether a nonexplosive chemistry can explode under division kernels that split every molecule independently, with no inflow and no fusion.
2. Find a general criterion, for arbitrary chemistries with substrate-keeping kernels, comparing bulk export with well-mixed removal.
3. Give a numerical tail bound that makes the catalytic explosion formula computable with certified error.
4. Determine how fast the explosion probability vanishes at the thresholds.

## What is in the evidence package

The package contains the manuscript (PDF and LaTeX source) with its figure script, the exact checks, the estimator and the enclosure code with their retained outputs, a replay runner and semantic negative controls. The records include the revision response, a rating-free review summary, a prior-art summary, a citation audit, claim, status, assurance and provenance records, and an agent index. Licences are CC0-1.0 for text and data and MIT for code, and SHA-256 manifests are included. The same files are in the GitHub release and the Zenodo record.
