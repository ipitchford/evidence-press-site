## Summary

Can two parameter regimes that admit several positive biochemical equilibria be joined continuously without losing that property? For a particular two-layer phosphorylation cascade with a shared phosphatase, this candidate's answer is yes—when reaction rates and conserved total concentrations may both vary.

Earlier work found two disconnected pieces in auxiliary steady-state coordinates. The new argument shows that their physical parameter images overlap, then handles the remaining degenerate cases. The result concerns equilibrium existence. It does not establish several stable equilibria or describe the time evolution of a cell.

## Summary for specialists

Let $\Omega\subset\mathbb R_{>0}^{12}\times\mathbb R_{>0}^{4}$ consist of rates and totals for which the specified mass-action network has at least two distinct positive equilibria. The written candidate theorem states that $\Omega$ is path connected, including parameters possessing degenerate equilibria. It contradicts Conjecture 4.3 of Kaihnsa and Wang, arXiv:2607.25456v1, while preserving their upper bound of two components.

## Technical account

The complete positive incidence parametrization uses ten inverse concentrations and six positive flux variables. The critical sign polynomial is bilinear in two coordinates:

$$g=A_{13}m_1m_3+A_1m_1+A_3m_3+A_0,$$

with the last three coefficients strictly positive. Its negative set has two path-connected components. An exact rational fibre contains negative-critical steady states in both components, so their physical images intersect. The implicit function theorem makes the overlap open in the full physical parameter space.

The degree criterion supplies a nonpositive-critical steady state above every multistationary parameter. At a zero of $g$, increasing $m_3$ gives

$$g(m+t e_3)=-t\frac{A_0+A_1m_1}{m_3}<0.$$

This holds for every $t>0$.

Holding flux coordinates fixed and projecting this ray gives a path to the overlapping negative-image union. Every point along the path is controlled by the written argument; numerical sampling is not the interval certificate.

## Evidence, assurance and limitations

The package contains the full paper, rational witness, complete polynomial coefficients and two exact algebraic checkers. Producer replay runs ordinary and optimized Python and rejects altered mathematical inputs. A separately supplied review checker also passed locally; its external independence was not authenticated. Five producer-coordinated internal editorial roles assess the package.

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

Topology adds information beyond whether multistationarity is possible. A connected region permits continuous parameter variation between any two qualifying regimes while preserving the existence of multiple equilibria. Determining that topology requires analysing the physical parameter map; a connected projection or disconnected parametrization alone cannot settle it.

## How to inspect or reproduce the recorded checks

Download the exact-version archive, inspect the manifest and follow its README to install the pinned SymPy and mpmath requirements in an external virtual environment. Run `python -I verify.py` from the extracted package. Expected output is `PASS` with ordinary/optimized replay and three rejected semantic mutations. Read the paper's degree-theorem hypotheses and global attachment proof separately.

## The most valuable next projects

1. Independently reconstruct the mass-action and determinant calculations with a different implementation.
2. Assess the written global proof and its source correspondence through unaffiliated specialist review.
3. Investigate fixed-rate slices, stable-equilibrium regions and higher-layer cascades as separate questions.

## Who might contribute

Reaction-network theorists can assess the degree argument and network correspondence. Real algebraic geometers can investigate the projection fibres and extensions. Dynamical-systems specialists can study stability without conflating it with the theorem's equilibrium count.

## What is in the evidence package

The immutable candidate package contains a PDF and LaTeX manuscript, accessible text, exact rational data, checkers, pinned requirements, machine-readable claims, review-response records, internal editorial reports and a complete hash manifest. GitHub and Zenodo provide the versioned assets. Original prose and data are CC0; original code is MIT. Supplied third-party review files and source-paper snapshots are not redistributed.
