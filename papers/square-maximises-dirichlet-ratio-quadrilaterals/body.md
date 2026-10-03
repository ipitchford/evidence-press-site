## Summary

Strike a drum and you hear a fundamental tone and, above it, overtones. For a drumhead of a given shape, the first two
eigenvalues $\lambda_1<\lambda_2$ of the Dirichlet Laplacian measure the squared frequencies of its lowest two tones. Their
ratio $\lambda_2/\lambda_1$ does not depend on the drum's size, only on its shape. A classical question asks how large this
ratio can be.

Among all planar shapes the answer is known: the disk, with ratio about $2.539$ (Ashbaugh and Benguria, 1992). For triangles
it is the equilateral triangle, with ratio $7/3$ (completed in 2022). For shapes with exactly $k$ straight sides, it has been
conjectured that the regular $k$-gon is best. This release proves the case $k=4$:

**Among all quadrilaterals, the square has the largest ratio, exactly $5/2$, and no other quadrilateral reaches it.** This holds
for convex quadrilaterals and for the dented four-sided shapes called darts.

For the square, the second tone is $\sqrt{5/2}\approx1.58$ times the first, a little more than a musical fifth. Squash,
stretch, skew or dent the square and the two lowest tones move closer together in this sense.

The proof is computer-assisted. Two short analytic arguments dispose of nearly degenerate shapes. The remaining shapes are split
into hundreds of thousands of small families. For each family a certificate proves the inequality for every shape in it, using
rigorous interval ("ball") arithmetic. Every certificate was replayed by a checker that fails closed, and the whole frozen
archive was replayed again from a fresh copy. The result is an unrefereed candidate: it has not been independently reproduced,
formally verified or peer reviewed.

## Summary for specialists

Let $Q\subset\mathbb R^2$ be a simple quadrilateral: a bounded open set enclosed by a closed four-sided polygon without
self-intersections, all of whose interior angles differ from $\pi$. Let $\lambda_1(Q)<\lambda_2(Q)$ be its first two Dirichlet
eigenvalues and $\xi(Q)=\lambda_2(Q)/\lambda_1(Q)$.

**Theorem 1.** $\xi(Q)\le 5/2$ for every simple quadrilateral $Q$, convex or not, with equality if and only if $Q$ is a square.

This is the case $k=4$ of the polygonal Payne–Pólya–Weinberger conjecture. Siudeja stated it (preprint 2007, published 2010,
Conjecture 1.2), and so did Antunes and Freitas (2008), on numerical evidence. The case $k=3$, with the equilateral triangle and
$\xi=7/3$, is due to Siudeja (2010, acute triangles) and to Arbon, Mannan, Psenka and Ragavan (2022, all triangles). Among all
planar domains the disk is extremal, with $\xi=j_{1,1}^2/j_{0,1}^2\approx2.5387$ (Ashbaugh–Benguria).

For quadrilaterals, Arbon (2022) stated strict local maximality of the square in an explicit small neighbourhood. The paper
identifies two gaps in that argument; the local statement is recovered here as Theorem 2.

## Technical account

**Parametrisation and reductions.** Convex quadrilaterals are parametrised up to similarity by $p=(a,b,c,d)\in\mathbb R^4$, following
Endo and Osting; $p=0$ is the square.
- Lemma A disposes of near-triangles. If one vertex nearly lies on the segment joining its neighbours, the quadrilateral is close to
  a triangle, and $\xi\le\frac73(1+\eta)^2<5/2$.
- Lemma B disposes of thin convex domains, using inscribed rectangles: $\xi\le 64s^2+16/9<5/2$ when width/diameter $s\le1/10$.

**The local step (Theorem 2).** Near the square, $\lambda_2$ is a double eigenvalue that splits.
- The proof transports square eigenfunctions to $Q_p$.
- It forms a $3\times3$ Rayleigh–Ritz pencil, together with a Kato–Temple lower bound for $\lambda_1$.
- It proves $\xi<5/2$ through an inertia criterion: a Schur complement must have a negative eigenvalue.
- All of these quantities are expanded as multivariate Taylor models with rigorous remainders. Exact first-order identities
  (Lemma 3.2 and Corollary 3.3, by symbolic computation) justify every deleted coefficient.
- The cover consists of 960 boxes of directions, which certify every $p$ with $0<\lvert p\rvert_\infty\le1/20$.

**The global covers.** Away from the square, boxes of parameters are certified one by one.
- The upper bound for $\lambda_2$ is a Rayleigh–Ritz bound.
- The lower bound for $\lambda_1$ is a Lehmann–Goerisch inequality. It needs a vector field $w$ with $\operatorname{div}w=-u$ exactly.
- For the far region the test functions and $w$ are transported from the box centre. The test functions move by a piecewise-affine
  map and $w$ by a contravariant Piola transform, so every dependence on the parameters is explicit.
- In total: 8 216 certificates cover the shell $0.049<\lvert p\rvert_\infty\le0.225$. A further 31 426 certificates and 18 756
  exclusion leaves cover the rest of the convex region, except a band of elongated shapes.
- The band $1/10<$ width/diameter $\le2/5$ (Lemma $B'$) uses one-dimensional bounds instead: a Born–Oppenheimer lower bound for
  $\lambda_1$, certified by Sturm oscillation in ball arithmetic, and a weighted one-dimensional Ritz upper bound for $\lambda_2$.
  It takes 44 268 certificates.

**Darts (Theorem 5).** Non-convex quadrilaterals have one reflex vertex and are charted from it. The degenerate and unbounded parts
of this shape space are handled by analytic lemmas: shallow notches, thin wedges, flat hulls, collapsing collars and arbitrarily
long arms. These lemmas use Dirichlet–Neumann bracketing and one-dimensional bounds with exponential tails. Certified covers
handle the compact families, in charts uniform in the arm lengths, with finite-element, one-dimensional and inclusion
certificates (462 849 leaves in 14 logs). Supplement S gives the complete proofs and the exact accounting of the decomposition.

**Classical inputs and new contribution.** The method uses established tools: the Lehmann–Goerisch and Temple–Kato inequalities,
Haynsworth's inertia additivity, the Krahn–Szegő and Andrews–Clutterbuck bounds, Hersch's inequality, Liu's guaranteed
Crouzeix–Raviart bound and Allegretto–Piepenbrink. The new contributions are three:
- the global theorem;
- its decomposition and certificates;
- the identification of two gaps in the earlier local argument.

The bounded literature search did not find an earlier proof of the global statement. That is a statement about the search, not a
priority claim.

## Evidence, assurance and limitations

**Evidence.**
- The archive contains:
  - the paper, with soundness specifications of every certificate primitive (Appendix A), a dependency table (Appendix B) and an
    assurance record (Appendix C);
  - Supplement S;
  - every final certificate log, all verifier code, pins and manifests;
  - the replay receipts.
- Every cover was replayed exhaustively by its fail-closed verifier. Each result is bound to the SHA-256 of its log record and of
  the verifier sources.
- The archive's component files were then frozen, extracted into a new directory and replayed there, component by component
  (`REPLAY_RECEIPT.md`).
- Separately written programs, from the same producer workflow, re-check:
  - the coverage and every exclusion of the convex covers and of the band;
  - samples of the transported and band certificates (60 of 60 and 400 of 400 reproduced);
  - the published local-step records;
  - the dart decomposition, on 160 000 sampled darts;
  - the receipts of the dart replay, with an exact state machine that rejects every one of 27 forged variants.

**Review.**
- During development, every part was reviewed adversarially by a second AI model.
- An external referee report of 2 October 2026, supplied by the publisher, recommended major revisions. Every item was addressed;
  see `REFEREE_RESPONSE.md`.

**Limitations.**
- No unaffiliated party has rerun the archive.
- The dart certificates have no second, independently written implementation.
- Nothing is formally verified in a proof assistant.
- No specialist or journal has reviewed the work.
- The trusted base is the written arguments, the verifiers, and Arb/FLINT, Julia and Python.

## Relationship to earlier work

The triangle theorem (Siudeja; Arbon, Mannan, Psenka and Ragavan) is the case $k=3$, and Lemma A uses it. Ashbaugh and Benguria's
theorem gives the bound $2.539$ for all planar domains.

Arbon (2022) studied quadrilaterals near the square. Paper §1 shows by an exact calculation where its argument goes wrong. Its rule
for simultaneous moves of two vertices adds two separate first-order effects. For the trapezoid deformation the true first-order
term is $0$, but the rule gives about $-1.664$ per unit deformation.

Endo and Osting (2026) proved the Neumann analogue, for the first nonzero Neumann eigenvalue of convex quadrilaterals. The global
step here follows their parametrisation and their certified box-cover architecture. The Dirichlet ratio needs a sharp lower bound
on $\lambda_1$, which they did not need.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Spectral geometers and shape-optimisation researchers | A complete case of the polygonal ratio conjecture. A template for $k\ge5$ and for related extremal problems (gaps, other boundary conditions) | Unrefereed and computer-assisted. Check Supplement S and Appendix A before relying on specific lemmas |
| Validated-numerics and computer-assisted-proof researchers | Certified Lehmann–Goerisch bounds with transported fluxes, Taylor-model inertia criteria, Sturm-certified one-dimensional bounds, and an exact accounting of a non-compact shape space | The verifiers are trusted code. Only the convex covers and the band have separately written checks of samples |
| Research agents and tool builders | A machine-readable claims file, pinned replay drivers, hash-bound receipts and a receipt state machine with mutation tests | Producer replay is not independent reproduction. Preserve version, DOI and scope |
| Interested non-specialists | Why the square "sounds" the way it does, and how a proof can rest on very many rigorous computations | Do not treat a candidate as an established consensus result |

## Why the problem matters

Ratios of eigenvalues are among the oldest questions in spectral geometry. Payne, Pólya and Weinberger asked for the best bound in
1956, and Ashbaugh and Benguria answered them in 1991–92. The polygonal versions are harder: the admissible shapes form a
non-compact family with corners, and the extremal value is not attained by a smooth domain. The triangle case took about fifteen
years from conjecture to complete proof. Quadrilaterals are the first case in which the polygon can be non-convex. At the square the
second eigenvalue $\lambda_2=5\pi^2$ is double, which makes the analysis near the square delicate; that is exactly where the earlier
local argument went wrong.

## How to inspect or reproduce the recorded checks

Download the archive from the Zenodo record or the GitHub release and extract it.
- `./replay_archive.sh check` takes minutes. It verifies:
  - every file hash;
  - the published records of the local step;
  - the dart receipts, with the separately written state machine and its mutation test;
  - that the band verifier rejects corrupted logs.
- The full replays take from about 10 minutes (local step, band) to several hours (darts). They need:
  - Python 3.13 with python-flint 0.9.0, SciPy and scikit-fem 12.0.2;
  - Julia 1.12.7 with Arblib.jl 1.8.1.
- `AI_INDEX.md` maps every claim to its argument, data, verifier and check.

## The most valuable next projects

1. **An independent rerun and a second dart checker.** The archive and `replay_archive.sh` are designed for an unaffiliated rerun.
   The certificates for non-convex quadrilaterals have no second, independently written implementation. Appendix A and
   Supplement S specify what such a checker must establish.
2. **Formalising the certificate primitives.** Three primitives carry the convex proof: the Lehmann–Goerisch bound with a
   transported, divergence-matched flux; the Sturm cell rule; and the Taylor-model inertia criterion. A formal proof of these, with
   certificate checking, would move the result towards formal verification.
3. **Regular $k$-gons for $k\ge5$.** The same architecture of a local step, transported certificates, one-dimensional bands and
   analytic reductions is a natural route to the next cases of the polygonal conjecture. The parameter spaces are larger and the
   reflex cases more varied.
4. **Stability near the square.** The local certificate gives explicit negative bounds on $\det S$ and $\operatorname{tr}S$ for
   every direction. Turning these into a quantitative deficit estimate of the form $5/2-\xi(Q)\ge c\,\lvert p\rvert^2$ would
   sharpen the theorem.

## What is in the evidence package

- The paper (PDF and Markdown source, with appendices A–C) and Supplement S, with complete proofs for darts.
- The verifiers and final certificate logs for each component:
  - the local step (`local/`);
  - the shell and transport covers (`global2/`);
  - the band (`bandB/`);
  - the darts (`darts/`).
- Separately written checkers (`verify/`), and the records made while answering the referee (`referee_response/`).
- Replay receipts, the fresh-extraction replay records, manifests and the pinned environment.
- Machine-readable claims (`CLAIMS.json`), an AI index, the prior-art search, the citation audit, provenance and licences
  (CC0-1.0 for prose and data, MIT for code).
