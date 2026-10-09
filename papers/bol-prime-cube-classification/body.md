## Summary

For groups of prime-cube order, there are five possibilities up to relabelling. Relax the rule that brackets never matter, and more structures appear. This candidate counts them within the family of **centrally nilpotent right Bol loops**: eleven at order eight, and $p+10$ at order $p^3$ for every odd prime $p$.

It also supplies multiplication formulas and representatives, so the answer is a usable classification rather than a numerical census. The restriction matters: the paper does not classify the general trivial-centre branch of Bol loops.

## Summary for specialists

Under ordinary isomorphism, including the five groups,

$$N(2)=11.$$

For every odd prime $p$:

$$N(p)=p+10.$$

The nonassociative counts are six and $p+5$. Each nonassociative model has centre $C_p$ and quotient $C_p^2$. Its associator is $\alpha(u,v,w)=\lambda(u)\det(v,w)$. Normalising the nonzero covector to $(1,0)$ leaves parameters $(\kappa,A,B)$ and an explicitly evaluated residual action.

## Technical account

Classical collection identities produce a five-parameter central-extension model. The converse verifies that every parameter choice gives a right Bol loop; nonzero associator covector forces the specified kernel to be the **full centre**. That last step makes it characteristic, ensuring that the subsequent orbit calculation classifies ordinary loop isomorphism rather than merely marked extensions.

For $p>3$, the residual changes use $a,d\ne0$ and arbitrary $c$:

$$\kappa'=\kappa/a,\qquad B'=B/a^2.$$

$$A'=(aA+cB)/(a^2d).$$

When $\kappa\ne0$, the invariant $B/\kappa^2$ retains every nonzero field value. It is not reduced to square classes. The disjoint cases yield $(p-1)+2+2+2=p+5$ nonassociative classes.

At three the power rule has a cubic correction. In the model $Q_3(0,0,0)$, $x^3=y^3=1$ but $(xy)^3=z^2$. Consequently the transformed power parameter is $(aA+c(B-1))/d$, not the large-prime formula. The two small characteristics have their own complete tables.

The added structural corollary identifies the Bruck subclass by $\kappa=0$. The left nucleus is $C_p^2$ when $B=0$ and cyclic of order $p^2$ otherwise; the middle and right nuclei equal the centre. Every nonassociative model at order 27 has exponent nine.

## Evidence, assurance and limitations

The all-prime conclusion rests on the written reduction, construction, isomorphism and orbit arguments. Exact computations corroborate the formulas and representative counts at primes 2, 3, 5, 7 and 11. The supplied separately written referee checker was rerun; this is internal replay of model-assisted review material, not authenticated external peer review.

The shipped standard-library tests run normally and under optimized Python. They check explicit recognition maps against multiplication and reject a wrong characteristic-three formula and a corrupted central scaling. Finite checks do not establish the universal theorem by themselves.

No general trivial-centre classification, isotopy count, formal verification, verified external catalogue-ID correspondence or absolute priority is claimed. Some older literature remains incompletely accessible.

## Relationship to earlier work

Grishkov, Kinyon and Vojtěchovský supply the centre reduction, finite counts and the all-prime question. Chein and Goodaire supply the structural identities. Daly and Vojtěchovský developed the general extension-isomorphism machinery; de Barros and colleagues used related carry and orbit methods in a different loop variety. The contribution claimed here is the explicit all-prime evaluation in the stated Bol family, not invention of those methods.

## Who should care, and why

Finite-loop researchers can generate examples with specified structure and compare normalised parameters. Classification-software developers can use the exceptional small-prime cases as tests. The supplied program returns both a class representative and a change of generators, together with exponent, nucleus and stabilizer-derived automorphism information.

## Why the problem matters

A count at several small orders cannot settle a classification for every prime. Here the structural reduction explains how the family grows, while separating the exceptional power behaviour at two and three. Explicit representatives make the result available for further algebraic work.

## How to inspect or reproduce the recorded checks

Download the versioned evidence package and begin with `AI_INDEX.md`. With Python 3.10 or later:

```sh
python3 code/check_package.py
python3 -O code/check_package.py
python3 code/recognize.py 3 0 0 0
```

Recognition takes already-normalised parameters, not an arbitrary multiplication table. Its returned isomorphism maps the representative into the input model. `VERIFICATION.md` records the finite scopes and the distinction from the written proof.

## The most valuable next projects

Establish explicit correspondences with existing order-eight and order-27 catalogues, or explore higher prime powers with new completeness arguments. Neither extension follows merely from matching counts.

## What is in the evidence package

The nine-page paper and LaTeX/BibTeX source, exact diagnostic and recognition code, an invariant table, claim map, AI index, review response, prior-art record, component licences and hash manifest.
