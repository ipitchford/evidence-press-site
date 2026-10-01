## Summary

In a simple mathematical model of a neural network, a group of active neurons can settle into a stable pattern. A natural conjecture said that such a group must be a **clique**: every neuron in the group points to every other, with a further condition on the inactive neurons outside it. Geneson’s six-neuron counterexample showed that the conjecture was false. The remaining small question was sharp: could five neurons already break the rule?

This release answers **no**, under the model’s stated legal-parameter and nondegeneracy assumptions. Six is minimal. The proof covers every directed graph on five or fewer vertices and the whole allowed parameter region—not just a grid of simulated networks.

The candidate also gives exact rational parameters for the known six-neuron graph, describes its complete full-support stability region, and constructs larger examples on 6, 11, 16, … neurons. These larger examples use different parameters at different sizes. Their stability margin shrinks; the result is not a claim of uniform robustness.

## Summary for specialists

For a nondegenerate combinatorial threshold-linear network (CTLN) with uniform positive drive and legal weights

$$
\delta>0,\qquad 0<\varepsilon<\frac{\delta}{1+\delta},
$$

the minimum size of a stable nonclique fixed-point support is **six**. Stable supports of size at most five are exactly target-free cliques in this setting. The lower-bound certificate covers **9,846 isomorphism classes**, accounting for **1,052,741 labelled loopless digraphs** of orders one through five.

The upper witness is **Geneson’s existing graph**, reconstructed exactly at $\varepsilon=1/12$, $\delta=11/120$. The graph itself is not a new contribution. For every integer $r\ge0$, the candidate gives a globally nondegenerate stable nonclique full support on $5r+6$ vertices at

$$
D=30r+31,\qquad \varepsilon=\frac1{2D+1},\qquad
\delta=\frac{D+2}{D(2D+1)}.
$$

No construction at every integer size, common parameter pair for all sizes, or uniform positive decay margin is asserted.

## Technical account

### Convert stability into exact polynomial obstructions

Let $N_{ij}=1$ when the directed edge from neuron $j$ to neuron $i$ is **missing**, with zero diagonal. Define

$$
K=I+\beta N+tJ,\qquad
\beta=1+\frac\delta\varepsilon,\qquad t=\frac{1-\varepsilon}{\varepsilon}.
$$

The active Jacobian is $-\varepsilon K$. Positive fixed-point coordinates and eigenvalues of $K$ with positive real parts are separate requirements. Writing $u=\beta-2$ and $v=ut-1$ turns the entire legal parameter region into $u>0,v>0$.

For each small graph, the checker reconstructs determinant, Cramer and characteristic polynomials and verifies an obstruction on this whole quadrant. Some cases fail positivity; others fail necessary stability conditions. The final exceptional quintics are eliminated by an explicit square identity and coefficient bounds. The manuscript explains the reductions and the certificate inventory; finite numerical scans do not supply the lower bound.

### Grow the seed without hiding its weak direction

The larger family is a nonuniform clique expansion of the six-neuron seed, with component sizes $(1,3r+1,2r+1,1,1,1)$. It uses established composite-graph and simply-added-split ideas from Curto, Geneson and Morrison. The new certificate concerns this particular expansion, its five-class weighted quotient, and explicit parameters. The quotient is **not an ordinary five-neuron CTLN**, so it does not contradict the lower bound.

Positive-coefficient polynomials prove quotient stability for all $r\ge0$. A parity argument establishes global nondegeneracy. Meanwhile, $5r+1$ transverse eigenvalues of the physical Jacobian are

$$
-\varepsilon_r=-\frac1{60r+63}.
$$

They approach zero. The parameter schedule is a sufficient construction, not an optimal or necessary one.

### Locate the seed’s stable region

For the six-neuron seed, the candidate gives the exact full-support phase region

$$
0<u<u_\star,\qquad t>\max\{1/u,T(u)\},
$$

where $u_\star$ is a specified sextic root in $(0.166355027849,0.166355027850)$ and $T(u)$ is the unique positive root of the displayed quartic Hurwitz determinant. The package gives exact root isolators. This classifies full-support stability; it does not assert global nondegeneracy at every point or establish a nonlinear Hopf bifurcation.

## Evidence, assurance and limitations

The package combines written reductions with exact, standard-library Python calculations. The finite checker reconstructs polynomials by signed-permutation determinant expansions rather than trusting the generator’s Newton-identity output. The supplied regression suite compares three arithmetic routes and requires nine corrupted certificates to fail. Shared low-level utilities remain part of the trust boundary.

The supplied AI-generated review contains separately written audit programs covering the finite enumeration, family, phase and appendix identities. Its recorded input hash matches the submitted archive. This is useful implementation diversity, **not authenticated human specialist review or unaffiliated reproduction**. The revision response records every review point, including the stronger prior-art comparison and shrinking-margin qualification.

This remains an **unrefereed candidate**. No end-to-end proof-assistant verification, exhaustive novelty guarantee, biological validation, global convergence theorem or classification of all larger CTLNs is claimed. Positive drive, legal weights and the stated nondegeneracy boundary matter.

## Relationship to earlier work

[Geneson’s six-neuron counterexample](https://arxiv.org/abs/2607.21396v1) supplies the sharp upper witness. [Curto, Geneson and Morrison’s stable-fixed-point paper](https://arxiv.org/html/1909.02947v3) supplies earlier small-support results and composite-graph machinery; Section 2.2 and Lemma 2.6 address simply-added splits and inherited eigenvalues, while Section 5 treats composite graphs. Their [2019 fixed-point paper](https://doi.org/10.1162/neco_a_01151) supplies the broader competitive-network framework.

The contribution assessed here is the exact exclusion through five over the full legal domain, together with the stated family and seed-phase certificates. Clique expansion and inherited transverse eigenvalues are not presented as new general principles. The source audit is bounded and cannot settle exhaustive priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical neuroscientists | Identify the first support size where stable activity can escape the clique rule | This is a particular idealised model, not measured biology |
| Dynamical-systems researchers | Inspect an exact phase region and size-dependent expansion | Existence does not imply uniform robustness or global convergence |
| Computer-assisted-proof researchers | Reconstruct an all-parameter certificate and finite graph cover | The semantic reduction and shared implementation remain trust boundaries |

## Why the problem matters

A small counterexample overturns a rule; a sharp minimum explains where that rule stops working. Knowing that every smaller support obeys the clique classification restricts the search for exceptional stable patterns and gives a precise boundary for graph-based reasoning about these networks.

The connection to neuroscience is through an idealised mathematical model. Nothing here measures neural tissue or shows that biological networks realise these parameter choices.

## How to inspect or reproduce the recorded checks

Start with the [manuscript](https://github.com/ipitchford/ctln-six-is-minimal/releases/download/v1.1.0-candidate/paper.pdf), then the [AI index and versioned source](https://github.com/ipitchford/ctln-six-is-minimal/tree/v1.1.0-candidate) and [Zenodo archive](https://zenodo.org/records/23089682).

Python 3.9 or later, standard library only:

```sh
python3 code/verify_all.py --regenerate --read-only
```

The command runs in a temporary copy, regenerates the finite certificates, checks the family and phase results, runs mutation regressions, and requires byte-identical mathematical certificate output. It leaves the downloaded release unchanged. Assertions must be enabled: `python3 -O` is intentionally rejected. Compare the output with `REPLAY_RECEIPT.md`; a replay is not a formal proof of the prose reductions.

## The most valuable next projects

1. **Independent reconstruction.** Rebuild the all-parameter exclusions and check the dynamical interpretation without importing the supplied utilities.
2. **Common-parameter families.** Determine whether unbounded stable nonclique supports can be obtained at one fixed legal parameter pair. The present schedule does not answer this.
3. **Robustness and expansion conditions.** Characterise which multiplicity choices preserve stability and whether a uniformly positive physical stability margin is possible.

## What is in the evidence package

| Object | Purpose |
|---|---|
| `paper/` | Typeset manuscript and editable proof source |
| `certificates/` | Finite graph obstructions, all-size polynomials and seed-phase data |
| `code/` | Standard-library exact generators, checkers and negative controls |
| `AI_INDEX.md`, `CLAIMS.md`, `ASSURANCE.md` | Claim-level navigation and trust boundaries |
| `REPLAY_RECEIPT.md`, `verification/` | Recorded execution and its scope |
| `SOURCES.md`, `REVISION_RESPONSE.md` | Antecedents and review dispositions |
| `MANIFEST.sha256`, licence and provenance files | File identities, reuse terms and attribution |

The banner and synthetic audio explain the result. They do not add scientific evidence.
