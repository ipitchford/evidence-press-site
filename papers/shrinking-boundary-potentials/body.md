## Summary

**In one sentence.** When a hard wall is coated with a very thin, strong film, the film usually vanishes in the limit and the wall stays hard; exactly tuned films turn it into a Robin wall set by the curvature; and the limit is uniform precisely when the film cannot hold a particle on its own.

**The picture.** A particle, or a wave, is held inside a region by a hard wall: its wave function must vanish at the wall. Now coat the inside of the wall with a very thin film that attracts or repels the particle strongly. Make the film thinner and thinner while keeping its strength at the critical size (of order one over the square of its width), so that the film never becomes negligible for trivial reasons. What kind of wall does the particle see in the limit? Limits of this kind are how physicists justify idealised boundary conditions and thin-layer models of coatings and surface potentials.

**What decides it.** One number from a one-dimensional problem across the film. Solve the zero-energy equation across the film, starting from zero at the wall. Beyond the film the solution is a straight line.

- **Usually the line is tilted.** Then the film is invisible in the limit: the wall stays a hard (Dirichlet) wall.
- **Exceptionally the line is flat.** The film is then exactly tuned, or *resonant*, and the wall becomes a Robin wall whose strength is half the sum of the principal curvatures of the wall. The curvature enters because a thin layer next to a curved wall has slightly more or less volume than a flat one.

**What was known.** Lotoreichik and Post (Revista Matemática Iberoamericana) proved the resonant Robin limit (their Theorem A). For non-resonant films they proved the hard-wall limit only when the attractive part of the film is small (their Theorem B), and conjectured that every non-resonant film gives the hard-wall limit. Golovaty treated a closely related two-sided problem in the plane, as a statement about eigenvalues and eigenfunctions.

**What is new.**

| What | In plain terms | Where |
|---|---|---|
| The conjecture is true | Every non-resonant film gives the hard-wall limit, however attractive it is | Proposition 4.1 |
| When the limit is uniform | The limit holds uniformly (in operator norm) exactly when the film cannot bind a particle on its own | Theorem 2.2 |
| Sharp error rates | In the uniform case the error is of order $\sqrt\varepsilon$ at resonance, $\varepsilon$ otherwise, and $\varepsilon^{3/2}$ in an exceptional class; none of these can be improved | Theorem 2.2 |
| How far the film moves the wall | Off resonance the film acts like moving the hard wall outward by $\varepsilon c_V$, where the length $c_V$ is minus the film's scattering length; each eigenvalue moves accordingly | Theorem 7.1, Corollary 7.2 |
| Films that can bind | Surface states sweep through every energy, so the uniform error stays as large as it can possibly be, although each fixed state still converges | Section 9 |
| Films that vary along the wall | The same classification, as long as the film is never resonant | Theorems 10.1, 10.3 |

The resonant Robin limit itself is Lotoreichik and Post's Theorem A; it is recovered here under weaker hypotheses (bounded measurable profiles, walls with several components).

**A concrete case.** Take a square well of depth $k^2$ and width $\ell$, measured in units of the film thickness.

| Well | Limit wall | Uniform? | Error |
|---|---|---|---|
| $k\ell=1$ | hard | yes | of order $\varepsilon$ |
| $k\ell=\pi/2$ | Robin | yes | of order $\sqrt\varepsilon$ |
| $k\ell=\pi$ | hard | no | largest possible (lim sup) |
| $k\ell=3\pi/2$ | Robin | no | largest possible (lim sup) |

**Idea of the proof.** For the limits, explicit approximate solutions are built from the exact zero-energy solution across the film; a general fact about self-adjoint operators then gives convergence without needing any uniform lower bound, which is what earlier methods lacked. Uniform convergence comes from an energy (coercivity) estimate on the film when the film cannot bind. When it can, surface states that oscillate along the wall cross every energy, and uniformity fails.

**Limits.** The constants depend on the film and are not uniform as a film approaches resonance. At resonance the order of the error is known but not its exact leading constant. When the film can bind, only the limit superior of the error is determined. Films that are resonant on part of the wall are excluded. The results are for bounded smooth regions in two or more dimensions. This is an unrefereed candidate: its assurance is internal AI-assisted review plus symbolic and numerical checks, not peer review, and no proof assistant was used.

## Summary for specialists

Let $\Omega\subset\mathbb R^d$, $d\ge2$, be a bounded $C^\infty$ domain with boundary $\Sigma$, inward distance $r$, and $K$ the sum of the principal curvatures. Let $V\in L^\infty(0,\infty)$ be real with support in $[0,\ell]$, and put

$$A_\varepsilon=-\Delta+\varepsilon^{-2}V(r/\varepsilon)$$

with Dirichlet condition on $\Sigma$. The transverse operator is

$$h_V=-\frac{d^2}{dt^2}+V,\qquad y(0)=0,$$

on the half-line. The zero-energy solution with $y(0)=0$, $y'(0)=1$ is affine beyond $\ell$, $y=\beta_Vt+\gamma_V$. The profile is resonant if $\beta_V=0$. Otherwise $\psi=y/\beta_V$ equals $t+c_V$ beyond $\ell$, which defines the affine offset $c_V$. Let $A_*$ be the Dirichlet Laplacian $A_D$ (non-resonant) or the Robin Laplacian $A_R$ with condition

$$\partial_\nu u+\tfrac K2u=0$$

(resonant), and let $B_z f$ be the inward normal derivative on $\Sigma$ of $(A_D-z)^{-1}f$.

- **Theorem 2.2(i)** *(proof)*: for every such $V$, $A_\varepsilon\to A_*$ in strong resolvent sense. For non-resonant $V$ this is the conjecture stated after Lotoreichik–Post's Theorem B (Proposition 4.1). For resonant $V$ it is their Theorem A, recovered for bounded measurable profiles and disconnected boundaries (Proposition 5.1).
- **Theorem 2.2(ii)** *(proof)*: $A_\varepsilon\to A_*$ in norm resolvent sense if and only if $h_V\ge0$. Then the error $\|(A_\varepsilon-z)^{-1}-(A_*-z)^{-1}\|$ is $\Theta(\sqrt\varepsilon)$ at resonance, $\Theta(\varepsilon)$ if $c_V\ne0$, and $\Theta(\varepsilon^{3/2})$ if $c_V=0\ne V$.
- **Theorem 7.1** *(proof)*: if $h_V\ge0$ and $V$ is non-resonant, then in operator norm

$$(A_\varepsilon-z)^{-1}-(A_D-z)^{-1}$$

$$=\varepsilon c_V\,B_{\bar z}^{*}B_z+o(\varepsilon).$$

- **Corollary 7.2** *(proof)*: each simple Dirichlet eigenvalue $\lambda$ with normalised eigenfunction $e$ moves to

$$\lambda-\varepsilon c_V\!\int_\Sigma|\partial_\nu e|^2+o(\varepsilon),$$

  and a multiple eigenvalue splits according to the Gram matrix of the normal derivatives.
- **Theorem 2.2(iii)** *(proof)*: if $h_V$ has a negative eigenvalue, every fixed ordered eigenvalue of $A_\varepsilon$ tends to $-\infty$, every real $E$ is an eigenvalue along a sequence $\varepsilon_j\to0$, and, writing $R_\varepsilon=(A_\varepsilon-z)^{-1}$ and $R_*=(A_*-z)^{-1}$,

$$\limsup_{\varepsilon\to0}\|R_\varepsilon-R_*\|=\frac1{|\operatorname{Im}z|}.$$

- **Corollary 2.3** *(proof)*: every profile with $\operatorname{ess\,sup}(-t^2V)<\tfrac14$, which includes every profile allowed in Lotoreichik–Post's Theorem B, has $h_V\ge0$ and is non-resonant, so their strong limit upgrades to norm convergence with a sharp rate.
- **Theorems 10.1 and 10.3** *(proof)*: for smooth profiles $V(s,t)$ that are non-resonant at every boundary point, the strong limit is Dirichlet, and norm convergence holds if and only if every $h_{V(s,\cdot)}\ge0$, with first-order term weighted by $c_{V(s,\cdot)}$.

**Known and new.** Lotoreichik and Post proved Theorem A (resonant, smooth profiles, connected boundary) and Theorem B (non-resonant under a Hardy-type smallness condition), stated the conjecture, showed that form methods need a uniform $H^1$ bound, and built a disk counterexample to norm convergence at resonance with a negative transverse eigenvalue; the scaled trial function behind Section 9 appears in their Appendix A. Golovaty studied the two-sided planar problem spectrally and observed eigenvalues tending to $-\infty$ and accumulating at every real number; the boundary-layer correctors follow his matched expansions. Golovaty and Hryniv proved norm convergence on the line. The half-line theorem of Šeba and the point-interaction literature are described only as Lotoreichik and Post recall them. The graph-approximation lemma is the standard sufficiency half of the strong-graph-limit criterion. New here: the unrestricted non-resonant limit, the norm criterion with sharp rates, the first-order term and eigenvalue formula (whose Robin counterpart is due to Belgacem, BelHadjAli, BenAmor and Thabet), the bound-state limit superior on every smooth domain and for non-resonant profiles, and the varying-profile classification.

## Technical account

**Strong limits without a lower bound.** Lemma 3.1 is the sufficiency half of the graph criterion: if every vector in the graph of the limit operator is approximated by graph vectors of $A_\varepsilon$, the resolvents converge strongly. Its point is what it does not need, namely any lower bound uniform in $\varepsilon$; attractive films send the bottom of the spectrum to $-\infty$, which is why form methods required a smallness condition. The approximating vectors multiply eigenfunction combinations of the limit operator by the exact zero-energy solution of the transverse problem, rescaled to the film (Sections 4 and 5).

**Uniform convergence when the film cannot bind.** If $h_V\ge0$, the quadratic form of the film controls a weighted energy uniformly in $\varepsilon$ (Lemma 6.1). An energy estimate and duality give the rate $\varepsilon$ off resonance (Proposition 6.2); at resonance a two-scale description of the layer gives $\sqrt\varepsilon$ and its sharpness (Propositions 6.4 and 6.5).

**The first-order term.** A corrector together with a compactness argument identifies the leading term $\varepsilon c_VB_{\bar z}^*B_z$ (Theorem 7.1). The control comes from the compact boundary operator $B_z$ rather than from $H^2$ bounds, because the normal derivative of a resolvent has only half a derivative of regularity. To first order this is the variation of the Dirichlet resolvent under moving the wall outward by $\varepsilon c_V$, and min–max gives the eigenvalue shifts (Corollary 7.2). When $c_V=0$ an explicit multiplier gives the order $\varepsilon^{3/2}$ with an exact coefficient (Theorem 8.1); Example 8.2 is a nonzero profile with $c_V=0$, $h_V\ge0$ and coefficient $1/2310$.

**When the film can bind.** Trial functions that oscillate along the wall show that each fixed eigenvalue escapes to $-\infty$ (Proposition 9.1). Continuity of the eigenvalues in $\varepsilon$ then forces every real energy to be crossed along a sequence of scales, and a Cayley-transform identity (Lemma 9.2) converts these crossings into the maximal resolvent defect $1/|\operatorname{Im}z|$.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/shrinking-boundary-potentials.txt) is available for reading.

- **Proofs.** Every theorem has a written proof in the 21-page paper. The paper opens with a plain introduction (the problem in words, what was known, what is new, methods, limitations and a plan) and ends with a discussion of open problems and an AI-use statement. No proof assistant was used.
- **Computational checks.** `check_identities.py` verifies with exact symbolic algebra the residual and commutator identities used in the proofs, the explicit zero-offset profile of Example 8.2 with its coefficient $1/2310$, the signs of $c_V$ for square wells and barriers, and the Cayley identity on nine random finite matrices. `check_transparent_identity.py` re-derives the zero-offset identities. `check_disk_residual.py` follows one explicit graph-corrector example on the disk. `check_eigenvalue_shift.py` computes the lowest radial eigenvalue of the unit disk with the well $k=\ell=1$ exactly from Bessel functions to 40 digits: the slope $(\lambda_\varepsilon-j_{0,1}^2)/\varepsilon$ approaches the predicted value $-2j_{0,1}^2c_V\approx-6.44719$, reaching $-6.4445$ at $\varepsilon=2^{-11}$, and the error halves when $\varepsilon$ halves. These scripts check identities and examples; they do not prove the operator estimates.
- **Tests that can fail.** No check uses `assert`, so the scripts behave identically under Python's optimised mode. Changing $1/2310$ to $1/2311$ makes `check_identities.py` exit with failure.
- **Replay.** All four scripts were rerun from fresh copies before release under Python 3.12 with pinned libraries, also under optimised mode; every output matched the recorded logs apart from version lines, and the eigenvalue record was byte-identical. GitHub CI reruns the four scripts on Linux under `-O` and compares them with the recorded logs as a blocking job, under a declared policy: text and exact values identical, decimal numbers within a relative tolerance of $10^{-9}$.
- **Review.** Five internal AI-assisted reviewer roles, run as Claude subagents, and a clean replay found no mathematical error. The revision round stated precisely what Lotoreichik–Post and Golovaty had proved, credited the standard graph criterion, rewrote the introduction for non-specialists, made the scripts robust under optimised mode, and added the eigenvalue formula and the norm classification for films that vary along the wall. A re-review and a proof audit of the new proofs, also run as Claude subagents, found no error. The planned adversarial review by a second AI model did not run because of a usage limit. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** Constants are not uniform near resonance; the exact leading constant at resonance is open; in the bound-state case only the limit superior of the error is determined; films resonant on part of the wall are excluded; bounded smooth domains in dimension at least two only. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Mathematical physicists modelling coatings, thin layers or surface potentials | An exact test for when a thin layer may be replaced by an effective boundary condition uniformly, with sharp error rates | Constants are not uniform near resonance |
| Spectral analysts | The first-order wall-shift formula for eigenvalues and resolvents, and the maximal defect in the bound-state case | Only the limit superior is determined when the film can bind |
| Numerical analysts simulating thin layers | Which limit to expect, how fast, and why uniform convergence fails for binding films | Nearly resonant layers need finer models |
| Research agents | Machine-readable claims, an agent index and replayable checks with a negative control | The checks are finite; the proofs carry the general statements |

## Why the problem matters

Effective boundary conditions are everywhere in physics and engineering: a thin coating, an oxide layer or a short-range surface force is replaced by a condition at the wall. Such a replacement is only trustworthy if the thin-layer model really converges to it, and only useful in practice if the convergence is uniform, so that energies and eigenvalues converge too. This work says exactly when that happens for the critical scaling, how fast, and what the first correction is: a shift of the wall by a length that can be read off from the film's scattering length.

## Related Evidence Press releases

No earlier Evidence Press release studies resolvent convergence, scaled boundary potentials or Robin limits.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/), from the package root:

```sh
shasum -a 256 -c MANIFEST.sha256
UV="uv run --python 3.12 --with numpy==2.3.5 \
  --with scipy==1.17.0 --with sympy==1.14.0 \
  --with mpmath==1.3.0"
$UV python -O -I -B code/check_identities.py
$UV python -O -I -B code/check_transparent_identity.py
$UV python -O -I -B code/check_disk_residual.py
$UV python -O -I -B code/check_eigenvalue_shift.py
```

Together the scripts take well under a minute. `ENVIRONMENT.txt` lists the software used and the cross-platform comparison policy. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Find the exact leading constant of the error at resonance, which needs a two-scale limit operator.
2. Describe the crossover between the hard-wall and Robin limits uniformly as a film approaches resonance, presumably through Robin conditions with coefficient $K/2-1/(\varepsilon c_V)$.
3. Decide whether the error can be small along some sequences of scales when the film can bind, and describe the surface states at negative energies.
4. Treat films resonant on part of the wall, two-sided interfaces in every dimension, and couplings that also depend on $\varepsilon$.

## What is in the evidence package

The paper (LaTeX source and PDF); `code/check_identities.py`, `code/check_transparent_identity.py`, `code/check_disk_residual.py` and `code/check_eigenvalue_shift.py` with their recorded outputs in `logs/`; `requirements.txt`; `refs.bib` from Crossref records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
