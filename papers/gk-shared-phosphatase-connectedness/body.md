## Summary

**The setting.** In a phosphorylation cascade, an enzyme adds a phosphate group to a protein, which then acts as the enzyme for the next layer, while a phosphatase removes the phosphate groups again. Depending on the reaction rates and on the total amounts of each chemical, such a network can have one positive equilibrium or several. The parameter choices that allow at least two distinct positive equilibria form the *multistationarity region*.

**The question.** Once that set is known, a natural next question is about its shape. Can any two parameter regimes that admit several positive equilibria be joined continuously without losing that property? Or does the set fall into separate pieces? For a two-layer Goldbeter–Koshland cascade in which both layers share the same phosphatase, Kaihnsa and Wang proved there are at most two pieces and conjectured that the region is disconnected (Conjecture 4.3 of their version 1).

**What was found.** This candidate's answer is that there is only one piece—when reaction rates and conserved total concentrations may both vary. Earlier work found two disconnected pieces in auxiliary steady-state coordinates. The new argument shows that their physical parameter images overlap: two exact rational equilibrium states, with the same reaction rates and conserved totals, lie in the two different auxiliary pieces. A further argument handles the remaining degenerate cases.

**What it does not say.** The result concerns equilibrium existence. It does not establish several stable equilibria or describe the time evolution of a cell. The witness uses mathematical parameter values whose physiological realism has not been assessed.

**Status.** An anonymous, AI-assisted, unrefereed candidate with a written proof and exact algebraic checks; no formal verification or authenticated external review.

## Summary for specialists

Let $\Omega\subset\mathbb R_{>0}^{12}\times\mathbb R_{>0}^{4}$ consist of rates and totals for which the specified mass-action network (network (34) of Kaihnsa and Wang, ten species, four conserved totals $H,E,S,T$) has at least two distinct positive equilibria. The written candidate theorem (Theorem 1.1) states that $\Omega$ is nonempty and path connected, including parameters possessing degenerate equilibria. It contradicts Conjecture 4.3 of Kaihnsa and Wang, arXiv:2607.25456v1, while preserving their upper bound of two components (their Theorem 4.2).

| Result | Status |
|---|---|
| The negative set of the critical polynomial $g$ in auxiliary coordinates has exactly two path-connected components, distinguished by the sign of $m_6-m_4$ (Lemma 4.1) | written proof |
| An exact rational fibre carries negative-critical steady states in both components, so the physical images overlap; the overlap contains an open subset of $\mathbb R^{16}$ (Proposition 5.1) | exact certificate + implicit function theorem |
| Every positive zero of $g$ joins the negative set along a coordinate ray (Lemma 4.1, equation (4.2)) | written proof |
| $\Omega$ is path connected (Theorem 1.1), via an elementary overlap-graph lemma (Lemma 4.3) and an established degree criterion | written proof |

## Technical account

**Coordinates.** The complete positive incidence parametrization uses ten inverse concentrations and six positive flux variables. The critical sign polynomial is bilinear in two coordinates:

$$
g=A_{13}m_1m_3+A_1m_1+A_3m_3+A_0,
$$

with the last three coefficients strictly positive. Its negative set has two path-connected components.

**Overlap.** An exact rational fibre contains negative-critical steady states in both components, so their physical images intersect. The implicit function theorem makes the overlap open in the full physical parameter space. A physical path may be concatenated at an overlap point without continuously following one chosen equilibrium lift; the two equilibrium lifts themselves remain in different auxiliary components.

**Degenerate parameters.** The degree criterion supplies a nonpositive-critical steady state above every multistationary parameter. At a zero of $g$, increasing $m_3$ gives

$$
g(m+t e_3)=-t\frac{A_0+A_1m_1}{m_3}<0.
$$

This holds for every $t>0$.

Holding flux coordinates fixed and projecting this ray gives a path to the overlapping negative-image union. Every point along the path is controlled by the written argument; numerical sampling is not the interval certificate.

**A side correction.** Remark 4.2 notes that the final display in the proof of Kaihnsa and Wang's Theorem 4.2 prints the threshold denominator $-A_3+A_{13}m_1$, whereas direct solution of the inequality gives $-A_{13}m_1-A_3$. This sign correction is separate from the connectedness result.

## Evidence, assurance and limitations

The package contains the full paper, rational witness, complete polynomial coefficients and two exact algebraic checkers. Producer replay runs ordinary and optimized Python and rejects altered mathematical inputs. A separately supplied review checker also passed locally; its external independence was not authenticated. Five producer-coordinated internal editorial roles assess the package.

Numerical exploration located a candidate fibre, after which the two relevant states were reconstructed rationally. Neither numerical search nor a claim about the exact number of other equilibria in that fibre is needed for the proof. The algebraic checks support the algebraic inputs; the global conclusion rests on the written proof and an established degree theorem.

This is an **unrefereed candidate**. These checks are not proof-assistant formal verification or external specialist review. No result is asserted for fixed-rate or fixed-total slices, stability regions, higher-layer cascades or physiologically plausible parameter ranges. Paths here are curves in parameter space, not trajectories of the biochemical system.

## Relationship to earlier work

Feliu and Wiuf already studied the shared-phosphatase cascade as motif (k), including multistationarity and scalar elimination. Conradi, Feliu, Mincheva and Wiuf supplied the degree criterion; Telek and Feliu developed the connectivity framework. Kaihnsa and Wang supplied the immediate auxiliary decomposition and full-space conjecture. The present contribution is the exact overlapping fibre and the completed global topological argument. Historical priority is not certified by the bounded literature search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Reaction-network researchers | Inspect a concrete failure of auxiliary separation to survive projection. | The theorem is for one specified network. |
| Algebraic and computational researchers | Reuse exact overlap and degenerate-attachment checks. | Finite algebraic checks do not replace the universal proof. |
| Mathematical biologists | Understand how multistationary regimes connect when rates and totals vary. | Multiple equilibria do not establish multiple stable equilibria or physiological realism. |

## Why the problem matters

Topology adds information beyond whether multistationarity is possible. A connected region permits continuous parameter variation between any two qualifying regimes while preserving the existence of multiple equilibria. Determining that topology requires analysing the physical parameter map; a connected projection or disconnected parametrization alone cannot settle it. This case shows concretely that two pieces in auxiliary coordinates need not stay separate once mapped to physical rates and totals.

## How to inspect or reproduce the recorded checks

Download the exact-version archive, inspect the manifest and follow its README to install the pinned SymPy and mpmath requirements in an external virtual environment:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -I verify.py
```

Create the environment outside the extracted package when verifying the complete manifest. Expected output is `PASS` with ordinary/optimized replay and three rejected semantic mutations. To check the witness by hand, Section 5 and Appendix B of the paper list the rates, both full steady states, their common totals and the determinant values. Read the paper's degree-theorem hypotheses and global attachment proof separately.

## The most valuable next projects

1. Independently reconstruct the mass-action and determinant calculations with a different implementation.
2. Assess the written global proof and its source correspondence through unaffiliated specialist review.
3. Investigate fixed-rate slices, stable-equilibrium regions and higher-layer cascades as separate questions.

## Who might contribute

Reaction-network theorists can assess the degree argument and network correspondence. Real algebraic geometers can investigate the projection fibres and extensions. Dynamical-systems specialists can study stability without conflating it with the theorem's equilibrium count.

## What is in the evidence package

The immutable candidate package contains a PDF and LaTeX manuscript, accessible text, exact rational data, checkers, pinned requirements, machine-readable claims, review-response records, internal editorial reports and a complete hash manifest. GitHub and Zenodo provide the versioned assets. Original prose and data are CC0; original code is MIT. Supplied third-party review files and source-paper snapshots are not redistributed.
