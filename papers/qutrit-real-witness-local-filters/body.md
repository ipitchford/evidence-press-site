## Summary

**In one sentence.** A real-number witness misses this entanglement, whatever local filter is applied: an explicit state of two three-level quantum systems is entangled and is detected by a complex witness, but no real witness detects it, even after each laboratory first applies any invertible local operation.

**The problem.** To show that two quantum particles are entangled, experimenters measure an *entanglement witness*: an observable whose average is never negative on unentangled (separable) states, so a negative reading proves entanglement. A witness is written as a table of numbers, a matrix in a chosen basis of each particle, and in general those numbers are complex. Real-number tables are simpler, and a natural hope is that nothing is lost by using only real ones, as long as each laboratory may first pick a good local basis or apply a *local filter*: an invertible local operation, carried out with some probability of success, that reshapes its particle's state.

**What was known.** Shen, Chen and Bian (Physical Review A, 2025, Conjecture 9) conjectured exactly this, in two strengths: (i) a local change of basis (a local unitary) always suffices; (ii) local filters always suffice. Part (i) implies part (ii). They proved part (i) for every state whose partial transpose has a negative eigenvalue, part (i) for two-qutrit states built from unextendible product bases, and part (ii) for all two-qutrit PPT entangled states of rank four. For a pair of qubits, and for a qubit with a qutrit, the conjecture holds automatically, because there every entangled state has a partial transpose with a negative eigenvalue. Without any change of basis, real witnesses can fail: Shen, Chen and Bian gave a simple two-qubit example.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| Both parts are false | An explicit full-rank two-qutrit state ($3\times3$) is detected by a complex witness, while every real witness after any invertible local filters, and every limit of such witnesses, has average above $8.5\times10^{-10}$ on it. The same holds for every state within Frobenius distance $8\times10^{-10}$ of it | Theorem 8 |
| The smallest case | Part (i) already fails for a qubit paired with a four-level system ($2\times4$, total dimension eight), the smallest size where it could fail. There, filters help but basis changes do not. Whether part (ii) also fails for $2\times4$ is open | Theorem 10 |
| A rule for every dimension | The conjecture holds exactly when every "corner" (exposed point) of the set of witnesses can be approximated by filtered real ones. When it fails, it fails for an open set of states | Theorem 6 |
| A test for a known family | A degree-nine polynomial decides which members of an exposed family of witnesses due to Ha and Kye have filtered real versions | Theorem 9 |
| The fix | One extra local qubit restores detection; a second copy of the state can serve as that qubit when filters are allowed | Section 8, Proposition 11 |

**Credit.** The witness and the separable state behind the counterexample are not new: both are due to Ha and Kye, who also proved that this witness is positive in the required sense and exposed. Ha and Kye observed that an exposed witness of this kind detects an open set of hard-to-detect states; this paper applies the same mechanism to the filtered real witnesses. New here are that observation's use against the filtered real class, the polynomial invariants that place a specific exposed witness outside that class, the criterion for every dimension, the $2\times4$ case and an exact finite certificate for the constants. Skowronek had shown that no *finite* family of positive maps combined with local filters detects all two-qutrit entanglement; the real witnesses form an infinite family, so his result does not settle the question.

**Idea of the proof.** Take a witness that touches the separable states at only one point, an *exposed* witness. If that witness is not a limit of filtered real ones, nudge the separable state it touches slightly towards entanglement: the result is detected by the witness but missed by every filtered real witness. To show that the chosen witness is not filtered real, the paper uses a polynomial built from the matrix that changes only by a positive factor under any local filter and is real for real matrices; for this witness its imaginary part is not zero.

**Limits.** The explicit state is extremely close to separable: the certified ball has radius $8\times10^{-10}$, and mixing in white noise makes it separable once the noise fraction passes about $1.6\times10^{-7}$. So this is a mathematical statement about which observables suffice, not an experimental proposal. Whether the stronger (filter) version also fails for a qubit paired with a four-level system is open. Experiments can still detect such states with several real measurement settings and classical post-processing; the result concerns a single witness matrix. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computer checks only.

## Summary for specialists

On $\mathbb C^m\otimes\mathbb C^n$ let $\mathcal B$ be the trace-one block-positive operators. An operator is *filtered real* if it equals $KSK^\dagger$ with $K=A\otimes B$, $A,B$ invertible, and $S$ real symmetric in the product basis; $\mathcal R$ is the closure of the filtered real members of $\mathcal B$ and $\mathcal R_{\mathrm U}$ the same with $A,B$ unitary. The filtered real witnesses are exactly Shen–Chen–Bian's $E^{\mathrm{SLOCC}}$, and the locally unitary real ones their $E^{\mathrm{LU}}$.

- **Theorem 6** *(proof)*: for fixed $m,n\ge2$, every entangled state is detected by $E^{\mathrm{SLOCC}}$ iff every extreme point of $\mathcal B$ lies in $\mathcal R$ iff every exposed point does; if not, the missed states include an open set of full-rank PPT states. The same holds for $E^{\mathrm{LU}}$ with $\mathcal R_{\mathrm U}$.
- **Theorem 8** *(proof, exact constants)*: with $W=T(3,1,4;-4-3i)$, five times the Choi matrix of the Ha–Kye map $\Phi_\theta(2)$ at $e^{i\theta}=(4+3i)/5$, the separable $D=T(48,48,24;(144+48i)/5)$ and $\varepsilon=1/160000$, the state

$$\rho_\varepsilon=\frac{D-\varepsilon I}{360-9\varepsilon}$$

  is full-rank and PPT with $\mathrm{tr}(W\rho_\varepsilon)=-8/19199997$; every element of $\mathcal R$ has expectation greater than $8.5\times10^{-10}$ on it, and the same holds on the Frobenius ball of radius $8\times10^{-10}$.
- **Lemma 7** *(proof)*: $\chi(X)=\mathrm{Im}\,\mathrm{tr}\,M(X)^3$, with $M(X)=C(X,\mathrm{adj}\,X)$ a partial contraction, satisfies $\chi(KXK^\dagger)=|\det K|^6\chi(X)$ and vanishes on $\mathcal R$; $\chi(W)\ne0$.
- **Theorem 9** *(proof)*: for the exposed Ha–Kye family $T(a,\beta,\gamma;u)$, membership in the closure of the filtered real matrices, a filtered real representative and a locally unitary real representative are each equivalent to $t=1$ or $\sin3\theta=0$, via a degree-nine invariant $\Pi$ with $\Pi(T)-\Pi(\bar T)=-6(\beta^3-\gamma^3)(u^3-\bar u^3)J$ and $J=-3a(p_\theta-1)^2\ne0$.
- **Theorem 10** *(proof)*: on $\mathbb C^2\otimes\mathbb C^4$ a congruence $F'$ of the exposed Ha–Kye witness at $(2,2,2,1)$ is filtered real and exposed but outside $\mathcal R_{\mathrm U}$, since $\mathrm{tr}([X,Y]^3)=-840i$ for its partial traces $X=\mathrm{tr}_A F'$ and $Y=\mathrm{tr}_A(F'^2)$. Total dimension eight is the minimum for a failure of part (i).
- **Proposition 11** *(proof)*: on two copies $\rho\otimes\rho$ with joint local operations some filtered real witness has negative expectation; the second copy acts only as a local ancilla through $\rho_A$.

**Known and new.** Shen, Chen and Bian proved part (i) for NPT states (Lemma 10(i)), for two-qutrit unextendible-product-basis states and part (ii) at rank four (Theorem 11), and gave the $4\times4$ Example 12. Ha and Kye supplied the positivity (2012, Theorem 2.2), exposedness (2013, Theorem 3.2), the separable operator $\varrho_0$ and the $2\times4$ map family (2016). Within a literature search of limited scope, the disproof, the criterion, the invariants $\chi$ and $\Pi$, the classification and the $2\times4$ local-unitary failure are new.

## Technical account

**Exposed witnesses decide the conjecture.** If a separable $D$ exposes $H\in\mathcal B$ and $H\notin\mathcal R$, compactness of $\mathcal R$ gives $g=\min_{\mathcal R}\mathrm{tr}(DV)>0$, and for small $\varepsilon$ the state $(D-\varepsilon I)/\mathrm{tr}(D-\varepsilon I)$ is negative on $H$ and positive on all of $\mathcal R$ (Lemma 4, the mechanism Ha and Kye noted for exposed indecomposable witnesses). Lemma 5 shows that such a $D$ and its partial transpose are positive definite, so the missed states are full-rank and PPT and form an open set. Conversely, if an extreme point lies outside $\mathcal R$, a farthest-point argument produces an exposed point outside $\mathcal R$; this proof is self-contained (Theorem 6).

**The witness is not filtered real.** Ha and Kye's map $\Phi_\theta(2)$ at $e^{i\theta}=(4+3i)/5$ has weights $(3/5,4/5,1/5)$, which satisfy both of their positivity conditions with equality; it is indecomposable and exposed. The partial contraction $C(X,Y)$ satisfies $M(KXK^\dagger)=|\det K|^2SM(X)S^{-1}$ for every local filter $K$, so $\chi$ is multiplied by a positive factor and vanishes on real and filtered real matrices (Lemma 7). For the witness, the three kets $|00\rangle,|11\rangle,|22\rangle$ carry a circulant block of $M(W)$ with forward entry $z=33024+17280i$ and reverse entry $\bar z/4$, so $\chi(W)=3(1-4^{-3})\,\mathrm{Im}(z^3)\ne0$: the cycle carries a complex phase and its two orientations have unequal weights.

**Explicit constants.** The separable $D$ is a sum of 28 product projectors on which $W$ vanishes; the resulting 168 linear conditions, with an exact Gram certificate (smallest Schur pivot $6849698078814/29474774167205$), show that, together with the cited block positivity, $D$ exposes $H$, and that for every block-positive $V$ the pairing $\mathrm{tr}(DV)$ controls the distance from $H$. Norm bounds on $H^\Gamma$, $(H^{-1})^\Gamma$ and $L(H)$ keep $\mathrm{Im}\,\mathrm{tr}\,L(V)^3$, and hence $\chi(V)$, away from zero within Frobenius distance $1/140$ of $H$, so every element of $\mathcal R$ is farther away and has $\mathrm{tr}(DV)>\alpha>6.5592\times10^{-6}>\varepsilon$. This gives the bound $8.5\times10^{-10}$ and the certified ball of radius $8\times10^{-10}$ (Section 6). Along the depolarising path the witness detects the state up to the noise fraction $\eta_*=\varepsilon/40=1/6400000$, about $1.6\times10^{-7}$, where the state becomes the separable $D/360$; beyond it the state is separable.

**Two by four.** Theorem 10 conjugates the exposed Ha–Kye map of $\mathbb C^2\otimes\mathbb C^4$ by the local filter $I_2\otimes(I_4+iE_{01})$. Under a local unitary the partial traces $X,Y$ are conjugated by the same unitary, so $\mathrm{tr}([X,Y]^3)$ is unchanged; for a real matrix it would vanish, but here it equals $-840i$.

**Ancillas, copies and dimension.** With $|\pm\rangle=(|0\rangle\pm i|1\rangle)/\sqrt2$ on an ancilla qubit, $P_+\otimes W+P_-\otimes\bar W$ is real and block-positive, the standard real representation of complex quantum theory with an extra qubit (McKague, Mosca and Gisin; Renou et al.). A fresh ancilla in a real state, rotated locally, restores detection within $E^{\mathrm{LU}}$; a second copy can play that role under filters (Proposition 11), and in a fixed basis finitely many copies suffice. Failures are dimension-specific: an embedded two-qutrit counterexample is detected by a locally unitary real witness once a local dimension is at least six.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/qutrit-real-witness-local-filters.txt) is available for reading.

- **Proofs.** Every result has a written proof in the 12-page paper, which opens with a plain introduction (the problem, why it matters, the conjecture with Shen–Chen–Bian's sets, what was known, what is new and a roadmap) and ends with scope, limitations, open problems and an AI-use statement. No proof assistant was used.
- **Exact checks.** `code/verify_witness.py` (SymPy) rebuilds the witness and the separable state from Ha and Kye's data, checks their positivity conditions, the spectra, the Gram certificate, the invariants, every constant of Section 6 including $8.5\times10^{-10}$ and $8\times10^{-10}$, the noise threshold and the exact state file: 120 exact checks. `code/verify_chirality.py` expands the degree-nine identity and `code/independent_tensor_check.py` confirms it independently by modular arithmetic. `code/verify_qubit_ququart.py` rebuilds the $2\times4$ map and checks $\mathrm{tr}([X,Y]^3)=-840i$ with a real control. `code/check_block_positivity.py` is a floating-point cross-check of the cited block-positivity theorems, not a proof.
- **Tests that can fail.** No program relies on `assert`; every check exits with an error, also in Python's optimised mode. Changing $\varepsilon$ from $1/160000$ to $1/100000$ makes `verify_witness.py` fail.
- **Replay.** The five programs were rerun from fresh copies before release, normally and in optimised mode, under CPython 3.12.11 with SymPy 1.14.0 and NumPy 2.3.5; every output matched the recorded files byte for byte. GitHub CI reruns them on Linux, compares exact outputs line by line and floating-point display values within a declared tolerance, and repeats the failure test.
- **Review.** Five internal reviewer roles (editor, methodology, domain, perspective and devil's advocate) were run as one combined Claude pass; the lead audited the proofs and replayed the programs. The revision cited Ha and Kye's positivity theorem and checked its conditions exactly, rebuilt the introduction for non-specialists, added definitions and a figure, rewrote the programs to check every constant, reframed the copies result as an ancilla statement, and added the criterion for every dimension and the $2\times4$ theorem. A verification re-review and proof audit of the new and rewritten proofs found no critical or major issue; the minor items were applied. No second-model review took place for this release. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The explicit state is far too close to separable for an experiment; block positivity rests on Ha and Kye's theorem with a floating-point cross-check; part (ii) for $2\times4$ is open. Attributions rest on a literature search of limited scope. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers designing entanglement tests | Real-valued witnesses are not enough, even after local filtering; one extra local qubit fixes it | The explicit counterexample is far too close to separable to observe |
| Researchers on real versus complex quantum theory | A sharp, single-observable instance where complex numbers cannot be moved into local preprocessing | Several real measurements with classical post-processing can still detect the state |
| Specialists in positive maps and witness geometry | A criterion through exposed points, and invariants separating exposed witnesses from the filtered real class | Part (ii) for a qubit and a ququart remains open |
| Research agents | Machine-readable claims, an agent index, exact state data and replayable exact checks with a failure test | The programs check constants and identities; the written proofs carry the theorems |

## Why the problem matters

Real and complex quantum theory make different predictions in network experiments, and the imaginary parts of quantum states have been studied as a resource of their own. The conjecture asked a sharper practical question: whether the complex phases needed for an entanglement test can always be moved out of the observable and into the choice of local basis or local filter. Local filters also define the standard classification of entangled states, so the answer says how much of entanglement detection survives in a real-number description once these natural local symmetries are used.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root, with Python 3.12, SymPy 1.14.0 and NumPy 2.3.5:

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B -O code/verify_witness.py --output results/verification_witness.json
python3 -I -B -O code/verify_chirality.py
python3 -I -B -O code/verify_qubit_ququart.py
python3 -I -B -O code/independent_tensor_check.py
python3 -I -B -O code/check_block_positivity.py
```

Each program runs in a few seconds; the first ends with `ALL 120 CHECKS PASSED`. `.github/ci/compare_output.py` compares fresh outputs with `results/` under the declared policy, and `ENVIRONMENT.txt` records the software used. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and the sources read, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. Decide whether part (ii) of the conjecture fails for a qubit paired with a four-level system, and more generally in which dimensions it fails.
2. Find counterexamples with much larger margins, ideally large enough to matter in an experiment, and map the noise tolerance across the Ha–Kye family.
3. Determine how many copies are needed when only local unitaries are allowed, and whether degree nine is the smallest separating invariant.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the PDF); the exact state and witness in `state.json`; five verification programs in `code/` with their recorded outputs in `results/`; `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text and data, MIT for code), the CI workflow with its comparison script, and SHA-256 sums.
