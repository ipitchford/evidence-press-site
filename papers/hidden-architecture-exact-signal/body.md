## Summary

**The question.** Many single-molecule experiments record only a coarse signal: an ion channel is open or shut, a motor is bound or unbound. Behind the signal sits a hidden network of microscopic states whose size is unknown. That network dissipates energy (it produces entropy) to stay out of equilibrium, and experimenters would like to know at least how much. One common route is to fit the *smallest* hidden Markov model that reproduces the signal and report the least dissipation that model allows. That number is a valid lower bound only if the real mechanism is no larger than the fitted one.

**What was found.** Choosing the smallest model is not safe, even when the signal is known perfectly. The paper studies an exactly specified family of two-level signals. For every member of the family:
- three hidden states are the fewest that can produce the signal, and the cheapest three-state mechanism is a simple driven ring (the banner's left panel);
- a four-state mechanism produces **exactly the same signal** and dissipates **strictly less**.

At one benchmark value the paper writes the cheaper mechanisms down with exact fractions as rates. Their costs fall from 2.846 (any three-state model) to 2.773 and 2.766 with four states, and to 2.747 with five (the banner's right panel).

**A floor for any hidden size.** The paper also proves a lower bound that holds however many hidden states there are. It uses only three features of one observed block: how often it is entered, how long it lasts on average, and how likely it is to end almost immediately. The bound is the best possible from those three numbers. For the benchmark it is about 108 times the floor certified in an earlier Evidence Press release, [hidden-dissipation-floor](/releases/hidden-dissipation-floor/).

**Status.** This is an anonymous, AI-assisted, unrefereed candidate, checked by internal AI-assisted review only. The exact least cost with four states, and with any number of states, remains open.

## Summary for specialists

Let $P_q$ ($0<q<1$) be the stationary binary alternating-renewal law with A dwell $\mathrm{Exp}(1+q)$ and B dwell transform

$$
\hat f_q(z)=\frac{\tfrac{2q}{1+q}\,z+1+q+q^2}{z^2+2(1+q)z+1+q+q^2}.
$$

Let $V_n(P)$ be the least entropy-production rate over $n$-state continuous-time Markov chains whose deterministic A/B labelling reproduces the complete stationary observed law $P$, and $V_\infty=\inf_n V_n$.

| Result | Status |
|---|---|
| Three states are minimal and $V_3(P_q)=(1-q)\log(1/q)$, uniquely attained (up to B-state exchange) by the homogeneous driven ring; the bound extends to any number of A states with at most two B states (Theorem 1, Lemma 7). | proved |
| $V_4(P_q)<V_3(P_q)$ for every $0<q<1$, by an explicit law-preserving phase insertion; rational $q$ gives rational rates (Theorem 1). | proved |
| At $q=1/20$: rational four-state witnesses with $\sigma=2.7730766578\ldots$ and $2.7659977105\ldots$, and a rational five-state witness with $\sigma=2.7469854029\ldots$, versus $V_3=\tfrac{19}{20}\log20=2.8459456598\ldots$ (Theorem 1, Proposition 6). | exact certificates |
| For any finite chain and binary partition with entrance intensity $r$, mean complete B dwell $m$ and initial dwell density $f_0$, if $0<k=mf_0<1$ then $\sigma>4r\sqrt{1-k}\,\operatorname{artanh}\sqrt{1-k}$; no renewal assumption (Theorem 2). | proved |
| That bound is the exact infimum under fixed $(r,m,f_0)$, approached by three-state models and attained by none; for $k\ge1$ a reversible chain with at most three states attains zero (Theorem 5). | proved |
| $\tfrac23(1-q)\log(1/q)\le V_\infty(P_q)\le V_4(P_q)<V_3(P_q)$ (Corollary 4). | proved |
| $V_4(P_{1/20})\approx2.765996$; a fifth state lowers the cost further (Section 6). | numerical only |

## Technical account

**Why an extra state can help.** The signal fixes only the observed dwell law, a rational function of the Laplace variable. The entropy production depends on every individual microscopic probability current. Inserting a third B phase whose extra decay mode cancels exactly from the dwell transform leaves the observed law unchanged but adds freedom to redistribute currents more cheaply. The paper computes the first-order change in entropy per cycle under this insertion and shows it is strictly negative for every $q$, with explicit finite rational parameters (Appendix B).

**Why three states cannot do as well.** With one A state and two B phases, the dwell law pins the B subgenerator up to a two-parameter family. The paper parametrises that family completely and shows by a series inequality that the homogeneous driven ring minimises the cost. A reset-replacement lemma (Appendix A) extends the bound to any number of A states.

**The floor.** At stationary crossings the B block has an entrance distribution $\alpha$ and an exit distribution $\beta$. If immediate returns are suppressed ($mf_0<1$), these must differ, and their Bhattacharyya affinity is bounded away from one. A log-sum argument then forces entropy at the observed boundary regardless of hidden dimension (Lemma 3, Theorem 2).

**Relation to the closest sources.** Aznagulov (2026) proved that $V_n$ is attained at each fixed $n$ and raised profitable insertion only as a possible route; Ehrich (2021) asked how bounds change with hidden-state count. The earlier Evidence Press floor for this benchmark was $0.01757$; the new floor is $1.8973$.

## Evidence, assurance and limitations

- **Proofs.** Every theorem has a written proof in the manuscript.
- **Exact computation.** The four- and five-state witnesses are checked with exact rational arithmetic in the Python standard library: generator row sums, stationary balance, the dwell-transform identities and rational enclosures of every logarithm.
- **Replay and controls.** A replay driver reruns all eight certificates and checks from a clean copy and compares every record. Six corrupted certificates (a wrong rate in each generator, an overstated saving or understated cost) are each rejected.
- **Review.** Five simulated reviewer roles and an adversarial review by a different AI model found no mathematical error; one revision round added the improved four- and five-state certificates; a re-review, a targeted proof audit and a second different-model audit followed. This is internal AI-assisted checking, not peer review, independent reproduction or formal verification.
- **Limits.** No four-state or unrestricted optimum is claimed. The fixed-statistics sharpness sequences change the full dwell law, so they are not exact-law sequences for $P_q$. Estimating $f_0$ from real recordings runs into the missed-events problem; no statistical coverage or experimental calibration is given.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Single-molecule and ion-channel experimentalists | Avoid reporting the minimal-model dissipation as a guaranteed lower bound | The bracket is exact for one model family; real data need estimation of $f_0$ |
| Stochastic-thermodynamics theorists | A clean exact counterexample and a sharp three-statistic infimum | The exact $V_4$ and $V_\infty$ remain open |
| Hidden-Markov and phase-type specialists | Thermodynamic use of nonminimal representations | Nonminimal representations themselves are classical |

## Why the problem matters

Thermodynamic inference from coarse data underpins claims about how much energy molecular machines must use. If the inferred minimum depends on an arbitrary choice of model size, the reported bound can be too high. This paper isolates that effect exactly, and supplies a bound that does not depend on model size.

## How to inspect or reproduce the recorded checks

Download the archive from the DOI or GitHub release and run, with Python 3.11 or later and nothing else installed:

```bash
python3 -I -B replay_all.py
python3 -I -B negative_controls.py
```

The central certificate is `code/exact_certificate.py`; the improved and five-state witnesses are `extension/verify_improved.py` and `extension/verify_five.py`. `AI_INDEX.md` maps every claim to its proof location and check.

## The most valuable next projects

1. Certify the four-state minimum at $q=1/20$ (numerically about 2.765996).
2. Decide whether $V_\infty(P_q)$ is attained by any finite model under the fixed complete law, and find its value.
3. Turn the three-statistic floor into an estimator with statistical coverage for real dwell-time data.

## What is in the evidence package

- `paper/`: the 20-page manuscript (PDF and LaTeX) and figures.
- `code/`, `two_phase/`, `global_bound/`, `extension/`, `review/`: exact certificates and supporting checks.
- `results/`: certificate outputs and logs.
- `literature/`, `audit/`: bounded prior-art audit and claim map.
- `review/REVISION_RESPONSE.md`: public record of the internal review and responses.
- `replay_all.py`, `negative_controls.py`, CI, `SHA256SUMS`, and the records `CLAIMS.json`, `ASSURANCE.md`, `AI_INDEX.md`.
