Two mathematical operations can undo each other almost perfectly and still leave a trace. How long can that trace remain hidden?

That question sits behind a family of conjectures about polynomials: expressions built from powers such as $z$, $z^2$ and $z^3$. Several Evidence Press releases have approached it through exact calculations, certificates and specialised arguments. A new manuscript offers a general answer by looking at what happens when a polynomial acts repeatedly.

The manuscript, *Polynomial composition rigidity via critical values*, is credited to **liqsweep** in the [external repository](https://github.com/blueberryvertigo/polynomial-composition-rigidity/tree/b17b6b9f7440b12fd85df2c2db9c98209ecc174d). Evidence Press's internal mathematical review found no load-bearing gap in its central argument. It remains an unrefereed candidate; formal verification and unaffiliated specialist review have not been established. The account below explains the consequences of that argument, rather than announcing an externally verified theorem.

## An almost-perfect undoing

Imagine feeding a number into one formula, then feeding the answer into another. Mathematicians call this *composition*. The order matters: apply $b$ first, then $a$, and the result is written $a(b(z))$.

Take a pair small enough to multiply out by hand:

$$b(z)=z-z^2,\qquad a(z)=z+z^2.$$

One subtracts a square; the other adds a square. They sound like opposites. But the second formula squares the changed input, not the original number. Composing them gives

$$a(b(z))=z-2z^3+z^4.$$

The square terms cancel. The cubic term survives. Near zero, the combined operation resembles the identity formula, which simply returns $z$, but it does not equal it.

![An exact example: the coefficients are 1, 0, −2 and 1. The square term cancels; the first difference from the identity is cubic. This example does not prove the general bound.](/assets/articles/rigidity-cancellation.svg)

The question is how far such cancellation can go. Could clever choices of coefficients conceal the difference until a much higher power? The first surviving power measures the *order of contact* with the identity. It describes exact agreement between coefficients, not merely a small numerical error.

## The bound adds where degrees multiply

A polynomial's degree is its highest power with a nonzero coefficient. Composing degrees $p$ and $q$ produces degree $pq$. Two degree-ten polynomials therefore produce a degree-one-hundred polynomial.

The manuscript's bound is much smaller. If the composition fixes zero and has derivative one there, but is not the identity, its first difference from $z$ must appear no later than power

$$p+q-1.$$

For two degree-ten polynomials, the difference must appear by power nineteen, despite the composition reaching degree one hundred. For our two quadratics, it must appear by power three. The example reaches that limit exactly.

This is the rigidity in Furter's conjecture. Under the stated normalisation, if two polynomials agree with an undoing operation for more terms than the bound permits, there is no hidden later error: their composition must be the identity. If each factor itself fixes zero and has derivative one there, both factors must be the identity too.

The proposed theorem covers arbitrary degrees and even longer chains of polynomial compositions. Its force comes from one argument, not from checking every possible list of coefficients.

## Why repeating a formula helps

The proof takes a detour through complex dynamics, which studies what happens when a function acts again and again on complex numbers.

Some fixed points attract nearby inputs. Start sufficiently close, apply the polynomial repeatedly, and the outputs approach that fixed point. Different attracting fixed points have separate regions of attraction.

A classical fact constrains these regions. Each needs a critical point: an input where the polynomial's derivative vanishes. The polynomial sends that input to a *critical value*. Distinct attracting fixed points require distinct critical values.

Now suppose a polynomial agrees with the identity to an unusually high order near zero. The manuscript slightly changes the polynomial by multiplying its output by a number just above one. It shows that the high-order agreement then produces many nearby attracting fixed points. Each needs its own critical value. Too much agreement would demand more critical values than the polynomial has.

Composition supplies the other half of the argument. Its critical values can come only from the factors' critical values, or from passing those values through a later factor. Their number is therefore bounded by adding the factors' contributions. A degree-$p$ polynomial contributes at most $p-1$.

That count gives the contact bound. A question about cancelling coefficients becomes a question about how many attracting fixed points can be supported. The [manuscript](https://github.com/blueberryvertigo/polynomial-composition-rigidity/blob/b17b6b9f7440b12fd85df2c2db9c98209ecc174d/proof.pdf) supplies the analytic details that this outline leaves out.

## What changes for the earlier research?

The immediate impact is on a group of mathematical problems, rather than on a new technology or an industrial application.

[Furter's earlier work](https://www.math.u-bordeaux.fr/~jpfurter/polynomialCompositionRigidityAndPlanePolynomialAutomorphisms.pdf) connects rigidity to the geometry of reversible polynomial transformations of the plane. Such transformations can be built from simpler steps. Their degree lists help organise them into families. The closure question asks which other families can occur as limits.

Combined with Furter's theorem, the new argument gives the conjectured closure description for every length-two family. That includes the containment conclusions pursued in Evidence Press's [full e=3 column](/releases/full-e3-column-polydegree-conjecture/) and [full e=4 column](/releases/full-e4-polydegree-column/). It also covers the universal rigidity question behind [R(3) through 299](/releases/furter-r3-through-299/), whose recorded certificates cover a finite range. Here R(3) refers to one factor of degree at most four, not to a pair of cubic polynomials.

This changes the reason to pursue another case. If the general argument holds, extending a finite check from 299 to 300 no longer advances the unresolved universal question. A calculation might still test an implementation or reveal an explicit identity, but it needs that separate purpose.

The older work also asks questions that the new proof does not answer. An abstract existence or containment theorem need not provide the particular certificates, smooth points or determinant identities sought by a constructive approach. The [smooth-point](/releases/smooth-point-certificates-polydegree-containments/), [LPS](/releases/lps-structural-reductions/) and [polar-fibre](/releases/o01d0-polar-fibre-structural-reductions/) projects retain such obligations. Their conclusions cannot all be marked complete because one shared destination now has another route.

Nor does the argument give a complete classification for compositions of arbitrary length, or prove the unrestricted Strong Factorial Conjecture. An [existing connection](https://arxiv.org/html/1304.3956v2) yields a particular restricted factorial assertion. That qualification matters.

## The next useful question

For readers following the programme, the priority is now to scrutinise the general argument and separate its consequences from the extra structure that earlier methods were designed to expose. Evidence Press has [recorded that distinction](https://github.com/ipitchford/evidence-press-site/blob/5a7bf52d200b28916bf776d8dc59cd95d4892a6c/docs/RIGIDITY_EXTERNAL_REVIEW_2026-09-12.md) and updated seven relevant release pages. Their archived papers and certificates remain unchanged.

Agreement between different arguments is useful, but it does not itself establish independent verification. Neither does the length of a proof settle its correctness. Here the claim rests on a specific chain: high-order contact produces attracting points; attracting points require critical values; composition limits their number. Each link is available for inspection.

If that chain withstands scrutiny, researchers can stop treating degree after degree as a fresh obstacle to the same theorem. They can ask the harder follow-up: which features of the mathematical objects remain unexplained even after the general bound is known?

*This is an AI-assisted Evidence Press explainer, based on the source version reviewed on 12 September 2026. The diagrams and narration explain the argument; they add no mathematical evidence.*
