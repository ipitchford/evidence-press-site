## Summary

**The everyday picture.** Put two copies of the same small system, one hotter and one cooler, in contact with the same cold surroundings, a *bath*. Each copy relaxes towards equilibrium. You would expect the hotter copy to stay farther from equilibrium at every later moment. Sometimes it does not: the two relaxation curves cross, and the copy that started hotter arrives closer to equilibrium first. In models with random jumps between energy levels (Markov dynamics) this is called the *Markovian Mpemba effect*, after the old observation that hot water can sometimes freeze faster than cold.

**The question.** When can such crossings be ruled out at every time at once, without solving the dynamics? Most earlier results look only at very late times, where one slowest decay mode dominates. A guarantee that holds at *all* times is stronger, and harder to obtain.

**What was found.** A simple sufficient test. Think of an observable as a list of numbers, one per energy level, read from lowest to highest. Call it *increasing on average* if the running averages of that list never go down. If the dynamics, and its time reverse, always turn increasing-on-average observables into increasing-on-average observables, then two cooling copies stay in their natural order at every time. That holds for the excess free energy (relative entropy) and for a family of other distances, and also when several such dynamics are applied one after another.

**Which baths pass.** For a standard model, energy levels coupled to a bath of oscillators (bosons) with a common coupling strength, the test passes for every set of levels and every bath temperature *exactly* when the bath's emission strength, as a function of the energy gap, bends downwards (is concave). Ohmic baths with a high enough cutoff, Drude–Lorentz baths and sub-Ohmic baths pass on explicit ranges. Super-Ohmic baths, such as three-dimensional phonons, do not, and for one of them an actual crossing is certified.

**Where it stops.** Total variation distance is not covered: an exact five-state example passes the test yet shows a brief total-variation reversal. And for every number of levels from four up there are systems with an anomaly that no smaller piece of the system shows, so checking small subsystems cannot replace a global argument.

**How sure we are.** The theorems have written proofs; the examples are certified by exact rational or interval arithmetic. This is an anonymous, AI-assisted, unrefereed candidate whose review was internal, not peer review. An earlier paper by Avitan, Factor and Gelbwaser-Klimovsky already excluded the late-time (slow-mode) version of the effect for Ohmic and sub-Ohmic baths, so that physical message is not new here; the new parts are the all-time statement, its exact boundary and the certified limits.

## Summary for specialists

Levels $E_1<\dots<E_N$, bath inverse temperature $\beta_b$, Gibbs preparations $p_\beta$, and the cone
$$
\mathcal C=\Big\{b\in\mathbb R^N:\ b_j-\tfrac{1}{j-1}\textstyle\sum_{i<j}b_i\ge0,\ j=2,\dots,N\Big\}
$$
of observables with nondecreasing arithmetic prefix means. Physical rates on the complete graph: $G_{ij}=J(|E_i-E_j|)\,[n_b+\mathbf 1_{E_i>E_j}]$ with Bose factor $n_b$ and spontaneous jump weight $J$.

| Result | Status |
|---|---|
| If $K\mathcal C\subseteq\mathcal C$ and $K^*\mathcal C\subseteq\mathcal C$ ($K^*$ the $\pi$-adjoint), then for cooling $\partial_\beta D_f(p^K_\beta\Vert\pi)\le0$ whenever $f'$ is increasing and concave (both KL orientations, squared Hellinger, Rényi $0<\alpha\le2$); heating with $f'$ increasing convex; common schedules of noncommuting reversible stages (Theorem 2, Corollary 3) | proof |
| $e^{tG}$ preserves $\mathcal C$ for every spectrum of width $\le D$ and every $\beta_b>0$ iff $J$ is concave on $[0,D]$; necessity needs all $N$ and arbitrarily cold baths jointly (Theorem 4, Lemma 5) | proof |
| $d^s$: $0\le s\le1$; $d^se^{-d/\omega_c}$: $0<s\le1$ and $D\le(s+\sqrt s)\,\omega_c$; Drude–Lorentz: $D\le\sqrt3\,\omega_c$; Gaussian: $D\le\sqrt{3/2}\,\omega_c$; super-Ohmic never (Proposition 6, Corollary 7) | proof |
| $J=d^3$, $E=(0,1,2,3)$, $e^{-\beta_b}=2/3$: cone failure and forward-KL crossing of two cooling preparations in $t\in(1/5,3/10)$ (Proposition 8) | exact certificate; crossing time numerical |
| Five-state cone-preserving reversible generator: heating TV crossings in $(10.46,10.47)$ and $(10.47,10.48)$ (Proposition 9, Table 4) | exact certificate |
| Every $N\ge4$: a finite-bath $N$-state generator with slow-mode inversion and TV crossing while every proper induced subsystem excludes slow-mode inversion; $q_0(N)$ existential (Theorem 10); certified $N=4$ instance at $q=1/1000$ (Remark 11) | proof; exact certificate |

## Technical account

**From a derivative to a cone.** For a fixed operator $K$, the preparation-temperature derivative of an $f$-divergence is a covariance,
$$
\partial_\beta D_f(p^K_\beta\Vert\pi)=-\operatorname{Cov}_{p_\beta}\!\big(E,\;K^*f'(Kr_\beta)\big),
$$
where $r_\beta=p_\beta/\pi$ is the likelihood ratio. For cooling, $r_\beta$ lies in $\mathcal C$; $K$ keeps it there; an increasing concave $f'$ keeps $\mathcal C$ invariant (a closure property of this particular cone); and $K^*$ keeps it there again. Lemma 1 shows that the energy covariance of any vector in $\mathcal C$ under a Gibbs law is nonnegative, which fixes the sign. The relative-entropy case of the covariance identity is due to Ohga, Hayakawa and Ito; what is used here is the cone's closure under increasing concave maps.

**Why concavity.** Splitting $G$ into a symmetric thermal part and a downward emission part, and writing $G$ in orthogonal contrast coordinates adapted to $\mathcal C$, cone preservation becomes a Metzler condition on a reduced matrix $H$. Every off-diagonal entry is a comparison of increments $J(z+\Delta)-J(z)$, which are nonincreasing exactly when $J$ is concave (Lemma 5). For necessity, $M$ levels clustered near one energy and a cold enough bath isolate one increment comparison with an explicit $M$.

**Boundary examples.** The super-Ohmic crossing uses exact rational generators, stochastic uniformisation with a rational tail bound, and rational enclosures of the relative entropy. The total-variation example is a five-state reversible chain whose reduced matrix is Metzler, while the total-variation indicator leaves $\mathcal C$. The hierarchy construction places a slow state and an absorbing ground so that every retained-state subsystem has strictly positive slow prefix margins, while the full system's margin changes sign.

**Classical and new.** Increasing-in-mean inequalities, stochastic orders, stochastic monotonicity and invariant cones are classical tools, cited where used. The new elements, within a bounded search, are the all-time two-adjoint criterion for this divergence family, the exact concavity characterisation for the bosonic class, the standard-bath thresholds and the certified boundary examples.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/thermal-ordering-concave-baths.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 27-page manuscript, with the matrix derivations in Appendix C.
- **Exact checks.** Eight standard-library checkers verify, in rational or outward-rounded interval arithmetic, the cone formulas over 96 rational models, finite operator products including noncommuting three-stage schedules, all 8,086 proper subsystems of the hierarchy for $N=4,\dots,12$, the bath thresholds, and the three certified examples. A separately implemented floating-point audit and a separate interval certificate for the total-variation example agree. Five semantic negative controls confirm that the checkers reject a concave weight in place of $d^3$, swapped preparations, a convex test weight, a far-perturbed model and a certificate time outside the reversal window.
- **Review.** Internal AI-assisted review in five roles plus an outside-model audit led to one revision with four extensions (bath classification, super-Ohmic crossing, certificate table, four-level instance). A verification re-review, a targeted proof audit and a final outside-model audit followed; the editor fixed their findings directly. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The physical class assumes a complete transition graph and a common coupling, so the harmonic ladder and birth–death chains are not covered. The test is sufficient, not necessary, for the absence of crossings. Total-variation order for the concave class is open. The finite-bath threshold in the hierarchy theorem is existential, and the construction needs extreme scales. The prior-art search was bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Theorists of anomalous relaxation | An all-time criterion to apply before computing spectra; an exact physical class and certified counterexamples at its edge | Complete graph and common coupling only; sufficient, not necessary |
| Open-quantum-system modellers | A quick check of whether a bath spectral density can produce Mpemba-type crossings in population dynamics | Translate the spectral density into the jump weight first (Section 4.5) |
| Experimentalists seeking Mpemba effects | Concave baths in this class cannot show them in the covered distances; look to super-Ohmic baths or other graphs | Certified examples are model calculations, not experimental proposals |
| Probabilists | A stochastic-order argument for divergence monotonicity along Markov semigroups | Total variation is genuinely excluded |
| Research agents | Machine-readable claims, an agent index, exact certificates and negative controls | The checks are finite; the all-$N$ theorems rest on the written proofs |

## Why the problem matters

Anomalous relaxation is now measured in colloids, granular gases and quantum simulators, and theory is often asked whether a given system *could* show it. Spectral criteria answer only for late times and need the dynamics diagonalised. A structural test that guarantees order at every time, and an exact statement of which common bath models satisfy it, lets a modeller rule the effect out quickly, and shows where to look when it should appear.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.11 or later:

```sh
shasum -a 256 -c SHA256SUMS
python3 run_checks.py --output /tmp/thermal-replay   # eight exact checks, standard library
python3 negative_controls.py                         # every corruption must be rejected
```

Assertions are part of the checks, so do not use `-O`. `README.md` lists the optional floating-point audit (`--independent`, NumPy and SciPy pinned in `uv.lock`), and `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Decide whether total-variation order holds for every concave bosonic weight at finite bath temperature.
2. Extend the concavity criterion to sparse graphs such as the harmonic ladder and birth–death chains, or to non-uniform couplings.
3. Determine the maximal Rényi orders covered for cooling and heating.
4. Give an explicit finite-bath threshold $q_0(N)$ for the hierarchy construction.
5. Find a physically realistic super-Ohmic system in which the certified crossing mechanism could be observed.

## What is in the evidence package

The package contains the manuscript (PDF and LaTeX source) with its figure scripts and data, the eight exact checkers with their retained outputs and reproduction runner, the separately implemented audit scripts, the development proof notes, and the semantic negative controls. The records include the revision response, the final editor fixes, a rating-free review summary, a prior-art summary, a citation audit, claim, status, assurance and provenance records, and an agent index. Licences are CC0-1.0 for text and data and MIT for code, and SHA-256 manifests are included. The same files are in the GitHub release and the Zenodo record.
