# External composition-rigidity development: mathematical and scope audit

Date: 12 September 2026. Status: internal source review; external unrefereed candidate.

## Frozen source and editorial decision

The reviewed source is liqsweep, *Polynomial composition rigidity via critical
values*, at [commit b17b6b9f7440b12fd85df2c2db9c98209ecc174d](https://github.com/blueberryvertigo/polynomial-composition-rigidity/tree/b17b6b9f7440b12fd85df2c2db9c98209ecc174d).

| Object | SHA-256 |
|---|---|
| `rigidity.typ` | `8a6e152c797c227529e88572db140fcfb5b6c3ad61650c2a94fc6304cb334af6` |
| `proof.pdf` | `0e9662c12bba4204c12ce6e1a2140687d138d33a520f771320f87129879f445d` |
| Supplied interpretive article, not published here | `425b3e86d3a2ed4af3a665de3ff127f76cfd54ff7da4b5ff7e1c7bfa1b74f8f5` |

The internal mathematical reading found no load-bearing gap in the contact
bound or its stated rigidity consequence. This is a substantive source audit,
not just agreement with small computations. It is not formal verification,
unaffiliated specialist review, a priority determination, or independent replay
of any Evidence Press package. No external author's identity or unaffiliated
review history has been authenticated. The external source is linked rather
than redistributed or relicensed.

The supplied interpretive article needs major revision and is **not** published
by this update. Three separately scoped internal agents reviewed the core
mathematics, imported implications, and adversarial failure modes without
reading one another's reports. The core reviewer found no proof repair needed;
the other two required repairs to the article's implication and assurance
claims. The editorial synthesis accepts only the bounded release-page updates
described below. These are producer-coordinated AI reviews, not external review.

## Main mathematical chain

For a nonidentity composition of nonconstant complex polynomials
`F = f_s o ... o f_1`, with `F(0)=0` and `F'(0)=1`, Theorem 1.2 proposes

`ord_0(F-z) <= 1 + sum_i (deg(f_i)-1)`.

The following checks address the load-bearing argument.

1. **Attracting basins (Lemma 2.1).** If a polynomial attracting basin had no
   critical point, each iterate would give an unramified proper covering over
   a small disk in that basin. The disk is simply connected, so the inverse
   branch fixing the attracting point exists for every iterate. Its derivative
   grows as the reciprocal multiplier to the iterate power, whereas the basin
   is bounded by an escape disk. Cauchy's estimate contradicts that growth.
   The superattracting case already supplies a critical point. Forward
   invariance and disjointness of basins imply distinct critical values for
   different attracting fixed points.
2. **Perturbation (Lemma 3.1).** For `f=z+c*z^(k+1)+z^(k+2)*r(z)`, `c!=0`, the
   perturbation `(1+delta^k)*f` has k distinct nonzero fixed-point branches
   `z=delta*w(delta)`. The implicit-function theorem applies at the k simple
   roots of `1+c*w^k`. The printed exact derivative identity gives multipliers
   `1-k*delta^k+O(delta^(k+1))`, uniformly over this finite set. For small
   positive real delta, the triangle inequality puts them strictly inside the
   unit disk. Scalar multiplication preserves the number of critical values.
3. **Composition.** The chain rule gives
   `CV(a o b) subset CV(a) union a(CV(b))`; cardinalities are subadditive.
   The preceding perturbation bound and `#CV(f_i)<=deg(f_i)-1` give Theorem 1.2.
4. **Rigidity and characteristic zero.** The contact demanded by `R(m,n)` is
   at least `m+n+2`, while the degree bounds allow at most `m+n+1` unless the
   composition is the identity. Degree multiplication and normalization then
   force both factors to be the identity. An embedding of the finitely
   generated coefficient field into C extends the conclusion to any
   characteristic-zero field; an embedding of the entire ambient field is
   unnecessary.

The inverse-truncation consequence has the correct coefficient shift. The
homogeneous-parameter argument for the coefficient map gives finite freeness
and rank `binomial(m+n,m)` by the Cohen--Macaulay and Hilbert-series argument.
The sharpness corollary explicitly treats both prescribed degrees at least two;
it should not be described as including the excluded identity with two linear
factors.

## Imported implications and affected releases

[Furter, Theorem B](https://www.math.u-bordeaux.fr/~jpfurter/polynomialCompositionRigidityAndPlanePolynomialAutomorphisms.pdf)
gives the complete length-two closure equality conditional on `R(m,n)`, not
merely the singleton containment. Its following remark supplies one direction
of containment for arbitrary lengths; it does not give an arbitrary-length
closure classification. [Edo--van den Essen, Theorem 2.25(5)](https://arxiv.org/html/1304.3956v2)
gives the restricted Strong Factorial assertion for
`X_1...X_m*(mu_1*X_1+...+mu_m*X_m)` from all lower-width rigidity assertions.
It does not prove the unrestricted Strong Factorial Conjecture.

| Release | Consequence conditional on the external argument | Not established by that argument |
|---|---|---|
| Irreducible pushforwards and quartic transitions | Original R(3) target has an alternative proof | Deck-norm irreducibility; global contour, cycle, Stokes and period estimates |
| Furter R(3) through 299 | Universal challenge has a candidate answer | Replay of the finite certificates; specific Euler-socle identities; a finite-prime automaton |
| Full e=3 column | Containment follows from the general length-two theorem | Fourier estimates, interval implementation or smooth-point construction |
| Full e=4 column | Containment, e=5 and other fixed-column targets follow | Fourier/Arb proof, scoped Lean identity or conditional boundary theorem |
| Smooth-point certificates | Triple common-zero exclusion; next coefficient a unit in the two-equation affine quotient | Reducedness, everywhere Jacobian invertibility, predicted affine length |
| LPS structural reductions | Full-window radical condition; alternative containment route | Determinant nonmembership in the shorter-window radical; localized transversality and arithmetic obligations |
| O-01d0 polar fibres | Full four-coefficient window has only the origin as common zero | The polar ideal replacing the fourth coefficient by a derivative; the four structural gates |

The two PIC conditions must remain separate: the full-window radical equals
the origin ideal, but the determinant must lie **outside** the radical of the
shorter window. [Lewis--Perry--Straub, PIC and Theorems 3--4](https://arminstraub.com/downloads/pub/polydegree-conjecture.pdf)
give sufficient criteria, not a converse deriving their certificate geometry
from a containment. In particular, the O-01d0 fourth equation is
`partial_(x_2) h_(n+1)`, not `h_(n+3)`.

## Corrections to the interpretive article

- Remove the inference that failure of the general contact bound in positive
  characteristic makes all uniform finite-field proofs of fixed R(3)
  impossible. Its counterexample has degrees depending on p. The original
  fixed-prime zero-band obstruction keeps its narrower scope.
- Remove the assertion that the entire uniform e=3 affine theorem follows.
  Triple-zero exclusion makes the next coefficient a unit by Nullstellensatz;
  it does not prove reducedness, Jacobian invertibility or predicted length.
- Replace “independent confirmations” or “reproduce each other” by “different
  arguments for overlapping conclusions.” No unaffiliated rerun or
  reimplementation is supplied by that overlap.
- Keep downstream consequences conditional on the external candidate, rather
  than upgrading any release's independent-assurance dimensions.
- Replace the blanket statement that every case with minimum width at least
  three was open by a statement about the general family; Furter already
  reported bounded Gröbner checks.
- Do not describe the higher-length question as entirely untouched: Furter's
  theorem has a one-direction higher-length consequence, not a full
  classification.
- Do not certify novelty or independence from the article's informal search
  narrative. The repository currently has two commits, not one.
- Correct the finite Strong Factorial endpoint: two-map index n corresponds
  to starting exponent n+1, giving 2--300 plus the known exponent 1. The old
  endpoint 299 was an undercount, not a false claim in the smaller range.
- Correct the R3 page's Furter citation to volume 91(1), pages 180--202,
  verified against Crossref for DOI `10.1112/jlms/jdu064`.

## Computational diagnostic and its negative control

The supplied scripts printed no discrepancies in 400 exact rational random
compositions and 20,000 numerical trials, and their small Gröbner examples
matched the reported dimensions. Those are selected diagnostics, not tests of
every computable assertion or of the universal proof. The numerical script
uses NumPy roots and tolerance-based critical-value clustering, not certified
root isolation. The scripts primarily print failures rather than fail closed.

More importantly, the original Gröbner script calls pure powers in the leading
ideal a nilpotence check. The ideal `(x^2-x)` is a negative control: its leading
ideal contains `x^2`, but x is not nilpotent in the quotient. Positive weighted
homogeneity can repair the inference for these specific coefficient ideals,
but the advertised implementation did not check actual nilpotence.

The replacement bounded diagnostic [tools/verify-rigidity-small-cases.py](../tools/verify-rigidity-small-cases.py)
instead explicitly reduces variable powers modulo each Gröbner basis and
rejects that control. With SymPy 1.14.0 it passes ordinary and optimized Python
with identical output. For `(m,n)=(1,1),(1,2),(2,2),(1,3),(2,3),(3,3),(1,4),(2,4)`,
the quotient dimensions are respectively `2,3,6,4,10,20,5,15`; every variable has
an explicitly checked nilpotent power. The complete bounded result is in
[RIGIDITY_SMALL_CASES_2026-09-12.json](RIGIDITY_SMALL_CASES_2026-09-12.json).

```sh
python3 tools/verify-rigidity-small-cases.py
python3 -O tools/verify-rigidity-small-cases.py
```

These computations establish only the eight listed small-case predicates.
They do not prove the dynamical theorem, validate the archived Evidence Press
certificate implementations, or constitute unaffiliated reproduction.

## Publication scope

Only the seven existing release pages, their current machine-readable context,
and this audit are updated. Research versions, DOIs, archived manuscripts,
certificates, assurance ratings, audio and videos are preserved. Current pages
explicitly identify the media as release-time briefings. The supplied article
and external repository are not edited or published as new Evidence Press
objects. No emails, archive revisions or new DOI deposits are authorized by
this site update.
