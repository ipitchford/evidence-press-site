## Summary

**In one sentence.** A conjectured limit on how strongly a driven Markov ring can oscillate holds for every choice of rates when the ring has three states or an even number of states, and fails for every odd ring with five or more states.

**The setting.** Many small systems in biology and chemistry hop at random around a loop of states: an enzyme cycling through its shapes, a molecular motor stepping along a filament, a biochemical clock. Such a system is described by a table of hopping rates, the *rate matrix*. Its eigenvalues are the system's characteristic modes. The real part of an eigenvalue says how fast a disturbance dies away, the *relaxation*; a nonzero imaginary part says that it rings, or *oscillates*, as it dies away. Oscillation needs a sustained push around the loop. That push is measured by the *cycle affinity* $F$, the logarithm of the ratio between the product of rates going round one way and the product going round the other. A system at equilibrium has $F=0$ and cannot oscillate at all.

**The conjecture.** For ordinary random walks in discrete time, the exact set of all possible eigenvalues of an $n$-state chain has been known since the 1940s and 1950s. It is the **Karpelevich region** $\Omega_n$, a star-shaped part of the unit disc whose boundary is made of curved arcs. In 2025 Xu, Kolchinsky, Delvenne and Ito proposed a neat extension to driven systems in continuous time. Rescale each eigenvalue by the fastest escape rate, and stretch its imaginary part by a factor set by the affinity. Then, they conjectured, the result always lands inside $\Omega_n$. If true, this would tell experimenters exactly which combinations of decay and oscillation a given driving force allows, and conversely how large a driving force a measured spectrum implies.

**What came before.** An [earlier Evidence Press release](/releases/affinity-karpelevich-threshold/), *How fast can a driven Markov network oscillate?*, showed on 27 October 2026 that the conjecture fails for general networks with four or more states. Its counterexamples need several loops of different strength, so they cannot happen on a single ring, which is where the conjecture's authors had tested it. That release left the single-ring case open as its Open problem 8.1. This release answers it.

**What is proved.** On a ring of $n\ge3$ states, at any fixed positive driving force, the conjectured containment holds for all rates exactly when $n=3$ or $n$ is even. For every odd ring with five or more states it fails, at every driving strength. The positive half follows quickly from known results. The failure is new. Its cause is pairs of states that are tightly linked to each other but only weakly linked to their neighbours ("dimers"). They create very fast modes, with rescaled eigenvalues near $-1$, whose oscillation grows too steeply as the driving increases.

**A concrete example.** Take five states in a ring. Let the clockwise rates be $1,3,2,2,3$ and the anticlockwise rates $3,1,2,2,1$. Every state then leaves at total rate 4, and the driving force is $F=\log3$. One eigenvalue of this ring, after the conjectured rescaling, sits at $z\approx-0.842+0.389\,\mathrm i$, just outside $\Omega_5$ (the banner shows it). A single inequality between fractions proves this. Similar rings with rates 1, 2 and 3 fail in seven and nine states.

**What it means in practice.** The modes that break the rule are the fastest ones, and they oscillate only weakly. If the conjectured region were used to infer the driving force from the five-state spectrum, it would demand $F\approx1.57$ instead of the true $\log3\approx1.10$, an overestimate of about 43%. The bounds that *have* been proved, an ellipse and a family of winding triangles, stay valid and give a correct lower estimate.

## Summary for specialists

Ring $C_n$, $n\ge3$, row generator $Q_{i,i+1}=k_i^+$, $Q_{i,i-1}=k_i^-$; $r=\max_i(k_i^++k_i^-)$, $F=|\log\prod_ik_i^+/k_i^-|$, $\beta=\tanh(F/2n)$, and for $F>0$

$$
z_Q(\lambda)=1+\frac{\operatorname{Re}\lambda}{r}+\mathrm i\,\frac{\operatorname{Im}\lambda}{r\beta}.
$$

The question is whether $z_Q(\lambda)\in\Omega_n$ for every eigenvalue: the conjecture of Xu et al. (2025, Supplement equation S3) restricted to rings.

| Result | Status and source |
|---|---|
| Holds for all rates: even $n$, every $F>0$ | Proved; immediate from the affinity–winding triangles of Kolchinsky, Ohga and Ito (2026, preprint) |
| Holds for all rates: $n=3$ | Proved; Theorem 4.1 of the earlier release, repeated for rings |
| **Fails: every odd $n\ge5$, every $F>0$** | **Proved (Theorem 1, §6)**; uses only classical facts about $\Omega_n$ |
| **Fails on an explicit rational family with $F\to0$** | **Proved (Theorem 3)** |
| **Integer witnesses: rates in $\{1,2,3\}$, $F=\log3$, $n=5,7,9$** | **Exact certificates (Proposition 6)** |
| **Local slope near $-1$** (below) | **Proved (Proposition 7)**; upper bound from the winding theorem |

For $n=2m+1$ the local slope $S_n(F)=\limsup y/(1+x)$ of images $z=x+\mathrm iy\to-1$ satisfies

$$
\frac{\tanh(F/2m)}{\tanh(F/2n)}\cot\frac{\pi}{2m}\le S_n(F)\le\cot\frac{\pi}{2n}.
$$

Each constructed counterexample has an open neighbourhood of counterexamples in the space of positive ring rates. Rational-rate counterexamples at a prescribed affinity exist exactly when $e^{F}$ is rational (Corollary 5).

## Technical account

**Positive cases.** The affinity–winding theorem confines each nonreal eigenvalue's image to the triangle with vertices $-1$, $1$ and $e^{2\pi\mathrm i\omega/n}$ for some winding number $\omega$. When $n$ is even, all three vertices are $n$th roots of unity, so the triangle lies in the regular $n$-gon, and every point of that polygon is an eigenvalue of a stochastic circulant. For $n=3$ a short trace argument does the same job.

**Why odd rings fail.** Squaring a stochastic matrix keeps it stochastic, so $z\in\Omega_n$ implies $z^2\in\Omega_n$. Applying the classical sector bound of Dmitriev and Dynkin to $z^2$ gives a simple necessary test (Lemma 2). For $n=2m+1$ the construction pairs the states into $m$ strongly bound dimers plus one transient state, joined by weak links of size $\varepsilon$ whose bias carries the affinity. To first order the dimers act like an antiperiodic $m$-site ring that carries the whole affinity. But the conjecture normalises the affinity per $n=2m+1$ steps, not per $m$. Near $-1$ the resulting eigenvalues therefore rise more steeply than Karpelevich's boundary allows there, by the factor $\tanh(F/2m)/\tanh(F/2n)>1$, which approaches $n/m\approx2$ at weak driving.

**Two proofs of failure.** Section 5 proves an explicit quantitative version with rational parameters, using a contour argument for the effective matrix and uniform control of the remaining spectrum. Section 6 proves failure at every prescribed affinity, using Ito's form of the Karpelevich boundary arc ending at $-1$, $z(z^2-1+t)^m=t^m$.

**Classical and new.** The Karpelevich region, its sector bound and boundary arcs, the antiperiodic-shift spectrum and the perturbation tools are classical. The even case is an immediate corollary of the winding theorem, and the three-state case was proved in the earlier release. The new content, within a bounded literature search, is the odd-ring construction at every positive affinity, its explicit rational version, the integer witnesses, the slope estimate near $-1$, and the resulting classification.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/markov-ring-karpelevich-parity.txt) is available for reading.

- **Proofs.** Every theorem, lemma, corollary and proposition has a written proof in the 22-page manuscript.
- **Exact certificates.** Standard-library Python with integer and rational arithmetic only. One program certifies the five-state example through equations (6)–(14) with a Sturm sequence. Another certifies the five-, seven- and nine-state witnesses with Rouché enclosures; for $n=5$ this is an independent second method. A third audits the effective matrix and the affinity identity on 44 rational cases. The certificates corroborate; the universal theorems rest on the proofs.
- **Negative controls.** The witness checker rejects the true witnesses when the affinity is mis-stated as $\log 9$. It also rejects rings with $n=3,4,6$ and a permuted five-state ring, and a control script checks that each rejection happens at the expected stage.
- **Replay.** A driver regenerates every certificate into a new directory and compares it byte for byte with the shipped files. It was rerun from a fresh copy of the package with and without Python's `-O` flag, and every output matched. Every check raises an error rather than using `assert`. The numerical illustrations were rerun with NumPy 2.3.5 and reproduced exactly.
- **Numerical sections.** The sampling table explaining why random searches missed the violations, and the 43% inference example, are floating-point illustrations with a fixed seed, not certificates.
- **Dependence on a preprint.** The even-ring half, and the upper bound in Proposition 7, use a theorem of Kolchinsky, Ohga and Ito (2026) that is still a preprint. Its statement was checked against its use here; its proof was not audited. The odd-ring failure does not depend on it.
- **Review.** Internal AI-assisted review only: five reviewer roles, an adversarial review and a later audit by a different model, a re-review of the revision and a proof audit of the new material. No reviewer found a correctness error in the main theorems. A rating-free summary of the objections and how each was resolved is in the package. None of this is human peer review, independent reproduction or formal verification.
- **What is not resolved.** The exact attainable spectral region at fixed affinity, the largest possible violation and the exact local slope $S_n(F)$ are open. The counterexamples need weak links, so small-affinity examples are not uniformly elliptic. The literature search was dated and bounded, with no author enquiry.

## Relationship to earlier work

This paper is the direct follow-up to [*How fast can a driven Markov network oscillate?*](/releases/affinity-karpelevich-threshold/) (Anonymous, 2026, [doi:10.5281/zenodo.23687327](https://doi.org/10.5281/zenodo.23687327)). That release refuted the affine Karpelevich conjecture for general networks with $n\ge4$ states, proved it for $n\le3$, and reported that a multistart search over four- and five-state rings found no violation. Here its Open problem 8.1 is settled: yes for even rings, no for odd rings with five or more states. Section 7.3 of the new paper offers a plausible reason the earlier search missed the violations. They concentrate on rings with nearly equal escape rates, and a few per cent of spread in those rates removes most of them. This is a partial explanation; that search's code is not archived.

The conjecture itself comes from Xu, Kolchinsky, Delvenne and Ito (2025). The valid bounds it would have refined are the affinity ellipse, conjectured by Uhl and Seifert (2019) and proved by Kolchinsky, Ohga and Ito (2026), and their affinity–winding triangles. These bounds, and the coherence bounds for slow oscillations of Barato and Seifert (2017) and Ohga, Ito and Kolchinsky (2023), are untouched. Verbeken and Ginis (2026) treat a different object with a similar name (one-way cycles with self-loops). Xu and Meng (2026) address a different localisation question.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Biophysicists and stochastic-thermodynamics researchers inferring driving forces from measured relaxation spectra | Do not use the affine Karpelevich region on odd rings; it can overstate the driving (by about 43% in the five-state example). The ellipse and winding bounds remain safe | Violations affect fast, weakly coherent modes and concentrate on rings with nearly equal escape rates |
| Matrix theorists working on stochastic spectra | A parity classification and an explicit dimer mechanism near the boundary point $-1$ | The exact ring region at fixed affinity is still unknown |
| Authors of the conjecture and of the winding theorem | A settled ring case and a quantitative slope estimate near $-1$ | The even case inherits the status of the winding preprint |
| Research agents | Machine-readable claims, an agent index and replayable exact certificates | Certificates check finite cases; the classification rests on the written proofs |

## Why the problem matters

Rate-matrix spectra are one of the few things experimenters can measure directly about small driven systems, through autocorrelations and relaxation after a perturbation. A correct map from driving force to allowed spectrum turns such measurements into a safe lower bound on the energy being spent. An incorrect one overstates it. The conjectured region was attractive because it was sharp and classical. This result shows exactly where it can and cannot be used on single loops, the most common model of a biochemical cycle.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B code/run_checks.py NEW_DIR        # exact certificates and negative controls, standard library, seconds
python3 -I -B -O code/run_checks.py NEW_DIR_O   # the same under -O; every check raises on failure
python3 -m venv env && env/bin/pip install -r requirements.txt   # numpy 2.3.5
env/bin/python -I -B code/numerics_illustrations.py NEW.json     # Sections 7.3-7.4, about 13 seconds
```

`run_checks.py` never writes into `certificates/`; it compares fresh outputs with them byte for byte. `AI_INDEX.md` maps each claim to its place in the paper and its evidence, `verification_ledger.md` says which evidence supports which claim, and `review/REVIEW_SUMMARY.md` lists the review objections and their resolutions.

## The most valuable next projects

1. Determine the exact attainable spectral region of rings at fixed affinity, or at least the exact local slope $S_n(F)$ near $-1$ and whether the dimer construction attains it.
2. Find the largest possible violation, and how it depends on a lower bound for every rate.
3. Have a specialist audit the affinity–winding preprint on which the even case depends, and check this paper's dimer argument.
4. Extend the classification beyond single rings, for example to rings with one extra chord, where new cycles change the normalisation.

## What is in the evidence package

The 22-page paper (PDF, Markdown source and the generated LaTeX) with two figures and their scripts. The exact certificate programs, negative controls, and the replay driver with its shipped outputs. The NumPy illustration script and its output. A verification ledger, an agent index, the dated literature audit and frozen claim, and a rating-free review summary. The bibliography, copied from registry records. Contribution and limitation records (`RESEARCH_GATES.json`), citation metadata, CI and SHA-256 sums for every file. The paper is an unrefereed candidate, released for scrutiny.
