## Summary

A symmetric unimodal distribution has a central peak and does not rise again as one moves away from its center. Free additive convolution describes the sum of freely independent quantities, a form of independence used in operator algebras and random-matrix limits. Does free addition preserve this shape?

This unrefereed candidate gives an affirmative written proof for all symmetric unimodal probability measures. It allows unbounded support, an unbounded central density and a central atom. A separate corollary, under extra density regularity, gives a continuous output with a unique central maximum. The paper and checks are open for scrutiny; publication and internal model review are not external mathematical acceptance.

## Summary for specialists

If $\mu$ and $\nu$ are symmetric unimodal Borel probabilities on $\mathbb R$, then $\mu\boxplus\nu$ is symmetric unimodal, with symmetry centers adding. Here unimodality is the standard weak notion. No support, moment or smoothness assumption is imposed.

For centered inputs with bounded locally Hölder-continuous densities, the output has a bounded globally continuous density $f$, analytic on its positivity interval $(-A,A)$, and strictly decreasing in the order sense on $[0,A)$. The bound is $\|f\|_\infty\leq\min(\|p_\mu\|_\infty,\|p_\nu\|_\infty)$. This does not assert global smoothness at finite support edges or $f'(x)<0$ at every positive point.

## Technical account

Centered symmetric unimodal laws are mixtures of centered uniforms, including the zero-radius point mass. The argument proves, for finite uniform mixtures and $z=x+iy$ in the first quadrant, the stronger transform inequality

$$\operatorname{Im}\frac1{G_\mu'(z)}+2y\operatorname{Re}\frac1{G_\mu(z)}\leq0.$$

The main reduction fixes a complex transform moment but allows total mass to vary. A supporting linear functional and a cubic contact-polynomial argument force an extremizer to use at most two radii, one at an endpoint. The central-atom-plus-uniform case is handled analytically. Removing the other endpoint at infinity retains the possible escaping term $-i\gamma$; its sign is favorable, not silently discarded.

Established subordination identities transfer this inequality to free addition. Cauchy smoothing, fixed-mode weak closure and the published weak-continuity theorem remove the finite-mixture restriction. The regularity appendix separately rules out density jumps before using analyticity to exclude plateaus. The candidate contribution is this analytic mechanism, not the imported subordination theory.

## Evidence, assurance and limitations

The evidence package contains the complete paper, LaTeX and accessible source, historical versions, a claim map, dependency audit, pinned symbolic environment, replay and corruption tests, and internal editorial disposition. Nine exact symbolic identities support selected algebraic steps. They do not certify analytic inequalities, compactness, duality or the whole theorem.

The supplied review recommended minor revisions. The publication repair corrects a disk-set display and improves notation, reading order and reproducibility. Producer-coordinated AI editorial reports are not unaffiliated specialist review. No external reproduction, formal verification, exhaustive novelty clearance, historical priority or practical impact has been established.

## Relationship to earlier work

The symmetric closure question appears in the AIM Free Analysis problem list and as Hasebe–Ueda's Conjecture 3.5. Their Theorem 3.6 handles a semicircular input. The present candidate treats two arbitrary symmetric unimodal inputs. It does not resolve the separate question of free strong unimodality against arbitrary nonsymmetric unimodal laws. Its regularity corollary makes the AIM problem's informal smooth-density language precise without claiming smoothness across support edges.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Free-probability researchers | Audit a general shape-preservation argument and its transform inequality. | The whole proof remains unrefereed. |
| Analysts studying moment problems | Examine the endpoint-contact reduction and cutoff limit. | The proof uses this specific transform curve and homogeneity. |
| Random-matrix researchers | Consider shape restrictions for applicable limiting spectral laws. | Finite matrices, rates and empirical spectra are not covered automatically. |
| Research agents | Reuse explicit claims, dependencies and fail-closed algebra checks. | Internal replay is not independent validation. |

## Why the problem matters

Shape preservation is more demanding than existence of a convolution or smoothness almost everywhere. It rules out secondary peaks for the whole admissible input class. A correct general proof would replace a special-family result with a structural closure principle. This candidate offers an inspectable route to that conclusion, not a measured application or an official research-quality rating.

## How to inspect or reproduce the recorded checks

Download the exact versioned archive, verify its SHA-256 manifest, and follow README.md. With Python 3.13.5, SymPy 1.14.0 and mpmath 1.3.0, run `check_proof_identities.py` normally and with `python -O`, then `test_negative_controls.py`. Expect nine identities in each positive run and six rejected corruption/mode cases. The manuscript explains the proof steps outside this computational scope.

## The most valuable next projects

An unaffiliated reader can check the continuous-moment duality, endpoint zero count and escaping-mass limit. A separate implementation can reconstruct the algebra from the written formulas. Proof-assistant formalization and a broader priority audit would address different outstanding assurance dimensions. Extending to nonsymmetric inputs would be new work and cannot be inferred by analogy.

## What is in the evidence package

The canonical paper includes the complete regularity appendix. Historical drafts remain labeled and are not separate results. The repository also supplies structured claims, source and licence maps, a response to the supplied review, internal editorial records, a pinned environment, symbolic code and mutation tests, replay receipts and complete manifests. GitHub and the exact-version Zenodo archive carry the same declared release assets. Art, thumbnail and narrated briefing are communication aids, not additional mathematical evidence.
