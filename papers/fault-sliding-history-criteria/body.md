## Summary

**The everyday picture.** Pumping fluid into rock along a fault raises the pore pressure, weakens the fault's frictional grip and can make it slip slowly, without an earthquake. In the simplest models the slipping patch grows as an expanding circular crack centred on the well, and while injection continues every point of that patch slides forward. When the operator turns the rate down, or stops, the pressure near the well falls first. At some moment part of the fault can no longer keep sliding forward; after that the slip becomes a pulse travelling round a stuck interior. Crack-based rules of thumb, for example for the largest size a slow-slip event can reach, are valid only up to that moment.

**The question.** For a given injection schedule, when does the fault first stop sliding forward everywhere, and where? Answering it normally means computing the slip rate at every point of the patch at every time.

**What was found.** One number decides. Watch the slip rate at the injection point, the centre of the patch, over time. For a schedule that rises and then falls, the whole patch is sliding forward at a given instant exactly when the centre is. For schedules with any number of rises, falls and abrupt steps, provided injection starts gently enough, the whole patch has kept sliding forward over a period exactly when the centre has. Under these conditions the first place to stop is always the centre.

**What follows.** Abrupt cuts are almost never tolerated: with realistic well sizes, a sudden reduction of more than roughly a tenth of a per cent ends full sliding at once. After shut-in there is an explicit deadline by which full sliding must have ended. And, for a point source, no gradual linear reduction of the rate can halve it without loss of full sliding.

**How sure we are.** The theorems have written proofs, and ten scripts check the formulas, thresholds and examples numerically. This is an anonymous, AI-assisted, unrefereed candidate; its review was internal, not peer review. The model is idealised (constant friction, no fracture energy, zero Poisson ratio), and the results say nothing about what the fault does after it first stops sliding forward everywhere, or about earthquake hazard.

## Summary for specialists

Circular rupture with zero Poisson ratio, constant friction $f$, zero fracture energy and strength excess $\tau_{\rm d}=f\sigma'_0-\tau_0>0$ (Sáez, Lecampion, Bhattacharya and Viesca 2022), with a point source or a fixed Gaussian source of width parameter $\varepsilon$, injection rate $q\ge0$ and stress-injection parameter $\Theta=\tau_{\rm d}/(fc_pq_0)$. The crack radius solves $f\mathcal A p_\varepsilon(R(t),t)=\tau_{\rm d}$. With the velocity kernel $K_R(r,u)$ built from Dawson's integral, the centre margin is
$$
\mathcal C_\varepsilon(t)=\int_{[0,t]}K_{R(t)}(0,t-s+\varepsilon)\,dq(s).
$$

The results, with their status:

- $u\mapsto K_R(r,u)/K_R(0,u)$ is strictly increasing for $0<r<R$ (Lemma 2); the pairwise radial order fails (Section 9.4) *(proof)*
- Single-peaked $q$, point source, Gaussian source or positive Gaussian mixture: $V(r,t)\ge0$ for all $0\le r<R(t)$ iff $\mathcal C_\varepsilon(t)\ge0$ (Theorem 1, Proposition 3.3); trajectory form from the start of slip (Corollary 3.1) *(proof)*
- Piecewise-$C^1$ $q$ with a positive or nondecreasing start (point source; downward jumps end full sliding at once) or with nonnegative latent forcing and transverse nucleation (Gaussian source, jumps of both signs): full sliding on an interval iff the centre history is nonnegative there; the radius then exists and increases; first loss is at the centre (Theorems A, B, G; Proposition 4.1) *(proof)*
- Abrupt drop after a constant stage $T$, Gaussian source: tolerated iff $j/q_0\le K_R(0,T+\varepsilon)/K_R(0,\varepsilon)<\sqrt{\varepsilon/(T+\varepsilon)}$ (equation 26) *(proof)*
- Inner limit $\Theta\to0$: $v_\infty(r,\cdot)=\Lambda_r*v_\infty(0,\cdot)$, a first-passage delay of the centre history (Theorem 3) *(proof)*
- Two-term margin $A_*\mathcal Hq(t)-(2\alpha/R)q(t-)$ with remainder $\le(16c_D\alpha^2/3R^3)\int(t-s)\,|dq|$ (Proposition 7.3) *(proof; constants $s_*\le0.6424$, $c_D\le0.4115$ numerically verified)*
- No crack after $t_s+fc_p\mathcal V/\tau_{\rm d}-\varepsilon$ following shut-in at $t_s$; full sliding lost before (Proposition 8.2) *(proof)*
- Point source, linear taper of depth $d$ over $L$ after a stage $T$: inner-limit threshold $d_\infty=\tfrac12\sqrt{L/(T+L)}<\tfrac12$, strictly smaller at every finite radius (Corollary 8.4) *(proof)*
- Finite-radius taper thresholds and the leading-order formula (54) *(numerical estimate; approximation)*

## Technical account

**Why the centre.** The pressure field remembers the injection history, but not evenly. A recent cut in the rate is felt strongly near the source and only weakly and later farther out, while older increases have spread over the whole crack. In the critically stressed limit this is exact: the slip rate at radius $r$ is the centre slip rate with every rate change delayed by a random diffusive travel time, the first time a one-dimensional diffusion covers the distance $r\sin\theta$ with $\theta$ uniform on $(0,\pi/2)$ (Theorem 3). A delayed average of a history that has stayed nonnegative stays nonnegative.

**Finite radius.** No such probabilistic picture is available at finite radius. Instead, Lemma 2 shows that, relative to the centre, every other radius gives more weight to old increments than to young ones. The proof writes the kernel as a Laplace transform of a random variable that can be coupled to its centre counterpart and reduces the claim to a single sign change of a density difference, a variation-diminishing argument. The same family is not totally positive in radius and age, yet the centre is extremal.

**Histories with many peaks.** Appendix B turns the age order into a positive causal transfer along any nondecreasing radius path: the velocity at an off-centre point or at the edge is a positive combination of present and past values of the centre margin. A first-zero argument then shows that the radius keeps growing while the centre history stays nonnegative, so the radius exists automatically (Proposition 4.1). For the Gaussian source, Appendix C continues the centre history through the unslipped interval before nucleation with a normalised kernel; that is where the latent-forcing condition enters.

**Classical and new.** The model, radius condition and circular inversion are from the literature cited above, and positivity of Volterra operators with log-convex kernels is classical background. Within a bounded search, the new elements are the centre-relative Dawson-kernel order and its exact finite-radius consequences, the instantaneous and historical criteria with automatic radius existence, the Gaussian-mixture extension and its failure for annular sources, and the quantitative schedule results.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/fault-sliding-history-criteria.txt) is available for reading.

- **Proofs.** Every theorem, proposition and corollary has a written proof in the 39-page manuscript, with the kernel properties in Appendix A, the historical criteria in Appendices B and C and the constants in Appendix D.
- **Numerical checks.** Ten scripts check the kernel against a 70-digit exact-moment expansion, the age order on a grid, two independent kernel implementations that agree on the taper roots to $3.5\times10^{-11}$, the moving-boundary derivative, the exterior mechanics, the two-term expansion and its remainder, the taper thresholds and drop tolerances, near-threshold multi-peak and stepped histories, and three counterexamples to stronger statements. Built-in negative controls must be detected, for example a wrong $1/R$ coefficient, a too-small remainder constant and the false pairwise radial order. All checks run with Python's `-O` flag, so none relies on assertions.
- **Review.** Internal AI-assisted review in five roles, an adversarial correctness review and a clean replay of the original scripts led to one revision with six extensions. A re-review and two rounds of targeted proof audit followed; the first found four scope defects, which were repaired, and the second found no fatal or major defect. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** The model has zero Poisson ratio, constant friction, zero fracture energy, a homogeneous layer and one-way coupling from pressure to slip. Point-source results are elastic statements away from the singular centre; the Gaussian-source results are the physically primary ones. Gaussian histories whose centre pressure falls before slip starts are open, and annular sources can violate the centre-first property. The constants $s_*$ and $c_D$ are numerically verified, not interval-certified. The dimensional example uses illustrative parameters. Nothing is claimed about the slip pulse after first loss or about seismic hazard.

## Relationship to earlier work

Sáez and Lecampion (2023) observed numerically that, at point-source shut-in, the injection point locks immediately and slip continues as a pulse; equation (27) reproduces that, and Theorem B makes centre-first loss exact for graded and multi-peak schedules within the stated startup classes. Proposition 8.2 agrees with post-injection arrest by Jacquey and Viesca (2023) and with the volume-bounded maximum size of Sáez et al. (2025), whose crack-like laws hold until the first loss identified here. The stress-injection parameter and the constant-rate asymptotics are those of Sáez et al. (2022), Bhattacharya and Viesca (2019) and Viesca (2025); the plane-strain constant-pressure case is not covered.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Numerical modellers of injection-induced slip | An exact benchmark for when and where a back front must first appear under stepped, tapered or cyclic schedules | Idealised circular model; first loss only |
| Analysts using crack-like volume or size laws | The time up to which those laws can apply for a given schedule | The laws' own assumptions still apply |
| Designers of injection protocols | Which reductions keep the whole patch sliding forward in the model: almost no abrupt cut, no point-source linear taper that halves the rate, and a deadline after shut-in | The quantity of interest for hazard is slip after first loss, which is not analysed |
| Applied mathematicians | A total-positivity-type argument for a moving-boundary Volterra problem in which the centre is extremal although the kernel family is not totally positive | Constants numerically verified, not interval-certified |
| Research agents | Machine-readable claims, an agent index, replayable scripts with negative controls | The numerical checks test examples; the theorems rest on the written proofs |

## Why the problem matters

Fluid injection for geothermal energy, waste-water disposal and carbon storage can reactivate faults, and slow slip can outrun the pressure front and trigger earthquakes. Many recent results describe the expanding crack that forms during injection. They stop being valid when the crack stops sliding forward everywhere, and until now that moment had to be found by computing the whole slip field. A one-number test tells a modeller exactly when the crack picture ends and gives practical bounds on how gently an operation must be wound down to delay it.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.12:

```sh
shasum -a 256 -c SHA256SUMS
python3 -m pip install -r requirements.txt     # numpy 2.3.5, scipy 1.17.0, matplotlib 3.10.8
python3 -I -B tools/replay_compare.py .         # all ten checks with -O, compared with retained outputs
```

The full run takes about three minutes on one core. `README.md` maps each script to the results it checks, and `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Decide whether the Gaussian historical criterion holds when the centre pressure falls before slip starts.
2. Analyse the free-boundary problem after first loss: existence and growth of the locked region and the slip pulse.
3. Characterise the source profiles for which the centre-relative age order holds, beyond Gaussian mixtures.
4. Extend the criterion to nonzero Poisson ratio, where the rupture is no longer circular.
5. Certify the constants and the finite-radius taper thresholds by interval arithmetic.

## What is in the evidence package

The package contains the manuscript (PDF and Markdown source with its bibliography and build script), the ten check scripts with their retained JSON outputs and figures, a one-command runner and a replay comparer, the Crossref and DataCite records behind every reference, the development proof notes and literature audits, and the frozen target statements. The records include the revision response, the final fixes, a rating-free review summary, a citation audit, claim, status, assurance, provenance and prior-art records, and an agent index. Licences are CC0-1.0 for text and data and MIT for code, and SHA-256 manifests are included. The same files are in the GitHub release and the Zenodo record.
