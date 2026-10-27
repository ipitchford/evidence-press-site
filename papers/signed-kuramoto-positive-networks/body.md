## Summary

**The setting.** Think of a network of identical oscillators: metronomes on a shared table, or generators on a grid, each nudging its neighbours. In the *Kuramoto model* every link pulls two oscillators' phases towards each other (attractive, or *positive*, coupling) or pushes them apart (repulsive, or *negative*, coupling). A resting state, or *equilibrium*, is an arrangement of phases where all the nudges cancel. A resting state is *stable* if small disturbances stay small.

**Finding 1: repulsion can be built from attraction.** Take any network whose links have strength $+1$ or $-1$. Replace each oscillator by a ring of six groups of copies, offset by $60^\circ$ from one group to the next. A positive link becomes a matching between groups with the same offset. A negative link becomes a matching between groups whose offsets differ by $180^\circ$, where a pull acts exactly like a push. The result is a larger network with only positive links, and the original network lives inside it exactly. Every resting state near any given one, and whether it is stable, carries over unchanged.

**Finding 2: stable resting states can form a cone.** On a network where everything repels, balanced arrangements of six oscillators (three pointing one way, three the other, and everything nearby) are stable. Near one special arrangement they form a *cone over a torus*, not a smooth surface. Finding 1 turns this into a network of 324 oscillators with only attractive links, in which a whole continuum of stable resting states has a genuine corner.

**What this says about Sclosa's conjecture.** In 2023 D. Sclosa conjectured that the equilibria of any such network form "a finite union of closed manifolds": finitely many tidy, smooth, closed pieces. Exactly which readings are settled:

- **Refuted**, already for six fully connected oscillators: the published wording (closed pieces, finitely or even countably many); pieces allowed to cross themselves (*immersed* compact pieces); and pieces that are only closed inside the equilibrium set or inside the set of stable equilibria.
- **True** for every network: the literal wording of the first arXiv version, "a finite union of manifolds" without the word "closed". This follows from a standard theorem that real algebraic sets split into finitely many smooth pieces. The version allowing pieces with edges or corners is also true.

**Caveat.** Everything here happens at an exact symmetric resonance: identical oscillators, unit link strengths and exactly balanced splits. A generic small change of the strengths destroys these singular shapes. Nothing here is a statement about real power grids.

**Status.** An anonymous, AI-assisted, unrefereed candidate. Every result has a written proof, and key spectra are certified in exact integer arithmetic. There has been no external peer review or independent reproduction.

## Summary for specialists

Homogeneous Kuramoto flow on a simple graph $G$: $\dot\theta_u=\sum_{v\sim u}\sin(\theta_v-\theta_u)$, the negative gradient of $E_G=\sum_{uv}[1-\cos(\theta_v-\theta_u)]$. For a signed simple graph $H$ ($\sigma_{ij}=\pm1$, maximum degree $\Delta$) and $r\ge1$, the lift $G(H,r)$ has vertices $(i,a,k)$, $a\in\mathbb Z_6$, $k\le r$; each $(i,a,k)$ is joined to every $(i,a\pm1,l)$, and a base edge joins $(i,a,k)$ to $(j,a+d_{ij},k)$ with $d=0$ for positive and $d=3$ for negative edges. $G_{m,r}=G(K_m^-,r)$.

| Result | Statement | Status |
|---|---|---|
| Theorem 1 | For $r>4\Delta$, $F(\phi)_{i,a,k}=\phi_i+a\pi/3$ is an invariant torus carrying the signed flow exactly; $F$ maps equilibrium germs onto equilibrium germs, identifies Lyapunov-stable sets, and adds only eigenvalues $\le-(r/2-2\Delta)$ | proof |
| Theorem 2 | $G_{6,9}$ (324 vertices, 3726 edges, 23-regular): $(\mathcal E_G,\theta^\star)\cong(\mathbb R\times C(S^1\times S^1),0)$, all nearby equilibria stable; neither $\mathcal E_G$ nor the stable set $\mathcal S_G$ is a countable union of closed embedded or of immersed compact manifolds | proof + exact spectrum |
| Theorem 3 | On $K_n$: a finite or countable closed cover, or a countable immersed compact cover, exists iff $n$ is odd or $n\le4$ | proof |
| Proposition 11 | For $K_m^-$ the threshold improves to $r>2(m-2)$, with normal bound $-(r/2-m+2)$ | proof |
| Corollary 13 | $m=2k+4$, $r>2(m-2)$: stable germ $\mathbb R\times C(S^k\times S^k)$ on $G_{m,r}$, no countable closed or immersed compact cover | proof |
| Corollary 14 | $G_{4,5}$ (120 vertices): stable clopen set of three 2-tori meeting cleanly along aligned circles | proof + spectra |
| Corollary 15 | Odd $m$: $F(B_m)$ is a stable smooth $(m-2)$-manifold, a union of components | proof |
| Remark 12 | Cone point of $G_{6,r}$: unstable for $r\le7$, degenerate for $r=8$ (open), stable for $r\ge9$ | proof; $r=8$ open |

**Verdict on Conjecture 1.3 (Sclosa, SIAM J. Appl. Dyn. Syst. 22(4), 2023).** False for the version-of-record wording ("a finite union of closed manifolds") and for its countable, immersed and relatively closed strengthenings. True for the literal arXiv v1 wording ("a finite union of manifolds"), by stratification of compact real algebraic sets, and for compact manifolds with boundary or corners, by triangulation.

## Technical account

**Invariance (Section 2.1).** On $F(\mathbb T^n)$ the two ring neighbours of $(i,a,k)$ sit at offsets $\pm\pi/3$, so their sine contributions cancel. A cross neighbour contributes $\sin(\phi_j-\phi_i+d_{ij}\pi/3)=\sigma_{ij}\sin(\phi_j-\phi_i)$. The lifted vector field is therefore $B$ times the signed field at every point of the torus, not only at equilibria. This step is of the same type as coupled-cell invariance results (Stewart–Golubitsky–Pivato and successors), and is not claimed as new.

**The normal bound and coercivity (Sections 2.2–2.4).** On the torus, the ring Jacobian has kernel exactly the tangent space and is $\preceq-r/2$ on the normal space $N$; the cross part has norm at most $2\Delta$. So the normal Hessian of the energy is $\succeq(r/2-2\Delta)$ at *every* point of the torus. Lemma 4 turns this into an energy inequality $E_G(F(\phi)+z)\ge E_G(F(\phi))+\tfrac{\mu}{4}\|z\|^2$ and a radial inequality, uniformly in $\phi$, with no nondegeneracy assumed along the torus. The radial inequality forces every nearby equilibrium onto the torus (germ transfer). The energy inequality, together with the Absil–Kurdyka theorem (an equilibrium of an analytic gradient flow is Lyapunov stable iff it is a local minimum), transfers stability even at degenerate points.

**The cone (Section 3).** At $\theta^\star=(0,0,0,\pi,\pi,\pi)$ on $K_6$, write the balance condition $Z=\sum e^{\mathrm i\theta_j}=0$ in coordinates splitting the two antipodal groups. The Morse lemma reduces it to $\|u\|=\|v\|$ in $\mathbb R^{p-1}\times\mathbb R^{q-1}$, giving $\mathbb R\times C(S^{p-2}\times S^{q-2})$. This cone is classical polygon-space geometry; the paper gives a self-contained derivation and does not claim it as new. For $p,q\ge3$ the regular part is connected near the vertex.

**The cover obstructions (Lemmas 8–9).** If a space has an open set whose regular part is a connected $d$-manifold, dense near a non-manifold point, then by Baire's theorem and invariance of dimension and domain, any countable cover by closed manifolds would need one piece to contain the whole neighbourhood, a contradiction. Lemma 9 extends this to immersed compact pieces. Both lemmas apply to the equilibrium set and to the stable set, because near $\theta^\star$ the two coincide.

**What changed in the final round.** A proof audit and an automated correctness review found that Corollary 13 had the wrong sphere exponent, that Lemma 9's dimension step misapplied invariance of domain, that Corollary 14 used Lemma 7 outside its stated range, and that Proposition 11(c) imported the wrong constant. All four were corrected, and a fresh-context check confirmed the corrections. Smaller gaps (weighted coercivity, clopen arguments) were also closed.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/signed-kuramoto-positive-networks.txt) is available for reading.

- **Proofs.** Every theorem, lemma and corollary has a written proof in the 18-page manuscript.
- **Exact computation.** `verify_attractive_embedding.py` verifies a complete integer eigenbasis of twice the Jacobian at the cone point of $G_{6,r}$: for $r=9$, 319 negative and 5 zero eigenvalues; for $r=8$, seven zeros; for $r=7$, the eigenvalue $+\tfrac12$ twice. No floating-point eigensolver is used.
- **Floating-point corroboration.** `kuramoto_checks.py` checks Theorem 1 on ten random signed graphs at 296 equilibria (Morse indices 0–5), the repulsive lifts for $m=4,5,6,8$, and the 36-vertex weighted variant.
- **Negative controls.** Nine corruptions are rejected: a tampered certificate, two verifier code bugs, a tampered edge list, a wrong edge rule, two false spectral claims, the old (incorrect) exponent of Corollary 13, and a one-byte change to the manuscript.
- **Review.** Internal AI-assisted review in five roles, two automated correctness reviews, a targeted proof audit, a verification re-review and a fresh-context check of the final corrections. This is not peer review, and different AI roles are not independent reviewers.
- **Limitations.** Exact resonances only, not robust to generic perturbation. The threshold $r=9$ is sufficient, not shown sharp; $r=8$ is open. The polygon cone and the invariance step are not new. Priority against coupled-cell, graph-covering and signed-lift literature rests on a bounded search.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Synchronisation and network-dynamics researchers | A tool for turning signed-network questions into questions about purely attractive networks, with stability and degeneracy preserved | Exact unit weights and phase offsets; the invariance step itself is of known coupled-cell type |
| Algebraic and topological geometers of equilibrium sets | A precise answer to which "union of manifolds" statements hold for Kuramoto equilibria | The literal arXiv v1 statement is true; only the closed and immersed readings fail |
| Numerical algebraic geometers | A stable non-manifold component as a test case for witness sets and numerical irreducible decomposition | Singular only at exact resonance |
| Stability analysts | A worked example where the linearisation is singular but stability follows from an energy inequality | Lyapunov, not asymptotic, stability of individual equilibria |

## Why the problem matters

Equilibrium sets of gradient systems decide how linearised stability tests, equilibrium counts and numerical solvers behave. A common hope is that the states a physical network actually settles into are tidy, and that singular continua are always unstable. For attractive Kuramoto networks this hope fails: singular continua can be stable. The realisation theorem also gives a general route from signed to unsigned networks, so constructions that are easy with repulsion can be imported into the attractive setting with exact control of germs and stability.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12 and the pinned packages:

```sh
shasum -a 256 -c SHA256SUMS
python -m pip install -r requirements.txt                 # numpy, scipy, matplotlib
python -B -I code/reproduce.py --out /tmp/skpn-out --pdf   # about 30 s; byte comparison
python -B -O negative_controls.py                         # under a minute
```

The scripts in `code/` use `assert`, so run them without `-O`. Start reading with Section 1 of the manuscript (the picture, Table 1 of readings and the main theorems), then Lemma 4 and Section 3. `AI_INDEX.md` maps each result to its proof location and script.

## The most valuable next projects

1. Decide stability of the cone point of $G_{6,8}$, where the normal Hessian is degenerate.
2. Find the smallest positive unweighted graph with a stable non-manifold continuum.
3. Decide whether $K_{3,3}$ or another small non-complete graph already violates the closed reading.
4. Search the coupled-cell, graph-covering and signed-lift literatures exhaustively for the realisation theorem.
5. Extend the realisation to the Kuramoto–Sakaguchi model and study robustness under perturbation.

## What is in the evidence package

The 18-page manuscript (PDF and LaTeX), the exact eigenbasis certificate, floating-point checks and the edge list of $G_{6,9}$, the construction figure and its script, a reproduction driver, semantic negative controls, the public revision response and final-fixes check, a rating-free review summary, the dated prior-art and limitation record, claim, status, assurance and provenance records, a citation audit, an agent index, CI, licences (CC0-1.0 for text, MIT for code) and a SHA-256 manifest. The same files are in the GitHub release and the Zenodo record.
