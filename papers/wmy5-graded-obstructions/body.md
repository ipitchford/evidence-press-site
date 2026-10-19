## Summary

The five-dimensional weak Markus–Yamabe problem asks for a polynomial vector field on $\mathbb R^5$ whose Jacobian has characteristic polynomial $(\lambda+1)^5$ everywhere but which nevertheless has two different zeros. Such a field would have locally stable linear behaviour at every point while failing global injectivity.

This paper does **not** construct one, and it does not prove that none exists. It instead closes three natural routes with exact evidence.

First, it starts from a known six-dimensional example and studies two ways of compressing its auxiliary variables into five dimensions. Within each displayed grading, the paper includes every permitted monomial. Exact certificates show that neither the 17-parameter parallel family nor the 16-parameter unequal-weight chain family can have the required constant spectrum.

The chain obstruction has a short core. Eight affine-linear coefficient equations force the remaining variables. Substitution into a ninth equation leaves the exact residual

$$
16{,}367{,}616,
$$

so the required equations cannot all hold.

Second, the paper studies a family of gradient maps related to a five-variable Hessian construction. A selected $15\times15$ coefficient minor has determinant

$$
-1{,}304{,}596{,}316{,}160\,\kappa^{15}r^{10}t^6.
$$

For nonzero $\kappa,r,t$, the nonconstant Hessian coefficient matrices therefore span all symmetric $5\times5$ matrices. No invertible affine source and target changes can make the Jacobian trace constant throughout this family.

These are reusable obstructions, not a solution of the unrestricted problem.

## Summary for specialists

Write $X=-\operatorname{Id}+H+\eta$. The target constant-spectrum condition becomes

$$
\det(LI_5-DH)=L^5.
$$

For the complete stated parallel bigraded ansatz, coefficient comparison reduces the characteristic identity to a polynomial ideal with an exact rational unit certificate. The same holds for the complete stated unequal-weight chain ansatz. In the latter family, the final 27 affine-linear coefficient equations admit a short contradiction: eight selected equations force the candidate parameter values and input 25 evaluates to $16{,}367{,}616$ rather than zero. The package includes both the original rational certificate and an independent standard-library replay of this shorter derivation.

For

$$
A_{r,t}=a(1+xy)^3+rxb(1+xy)^2-tx^3c
$$

and

$$
\Phi=\kappa A_{r,t}^2+d_0(x,y)+a d_1(x,y)+b d_2(x,y)+c d_3(x,y),
$$

the nonconstant coefficient matrices of $\operatorname{Hess}\Phi$ span $\operatorname{Sym}_5$ whenever $\kappa rt\ne0$. The arbitrary auxiliary-affine perturbation contributes only constant matrices in the relevant directions and cannot remove the selected nonconstant coefficient minor. If invertible source and target matrices made the transformed gradient have constant trace, their product would be orthogonal to all these coefficient matrices, forcing it to be zero—a contradiction.

Variation in $r,t$ records coordinate robustness, not a separate novelty claim. Neither theorem addresses nonlinear equivalence or polynomial fields outside the stated architectures.

## Technical account

The baseline six-dimensional field is reconstructed symbolically from its defining polynomials. The verifier expands its characteristic polynomial and checks all three listed zeros. A naive factor-sharing compression still preserves three zeros, but at the explicit point $(1,0,0,-1,0)$ its Jacobian has positive eigenvalue $-1+\sqrt6$ and so fails the Hurwitz requirement.

The two successful obstruction arguments are certificate-first. The checker independently differentiates the proposed maps, expands the characteristic polynomial and matches each certificate input to the resulting coefficient equations before accepting any rational identity. This prevents a certificate for the wrong ideal from passing merely because its arithmetic is internally consistent.

An independent grading audit enumerates all monomials allowed by the stated weights. It records 27 total coefficients for the parallel architecture and 28 for the chain architecture before the paper's normalisations and forced relations. These counts establish completeness only within the displayed grading assumptions.

The Hessian audit reconstructs the selected coefficient matrices symbolically. Its factored determinant is nonzero whenever $\kappa rt\ne0$, giving a uniform theorem over arbitrary lower terms affine in the three auxiliary variables.

## Evidence, assurance and limitations

The package contains the paper and source, exact rational certificates, a standard-library verifier, four mutation controls, the short-chain checker, monomial inventories, the symbolic Hessian-minor audit, recorded reports and an AI-readable index.

Ordinary and optimized Python executions passed. Four deliberate corruptions—wrong Jacobian inputs, a false intermediate identity, a changed unit target and a false final derivation—were all rejected. The replay command writes its transient report outside the extracted package, so running it does not mutate the manifest-bound historical receipt.

The supplied review package also contained a separately organized SymPy reconstruction and byte-identical certificate regeneration. Those checks remained within the same coordinated AI-assisted workflow. They are not unaffiliated reproduction or external peer review.

The exact checks establish the finite identities and stated monomial inventories. They do not prove that the global five-dimensional problem has no solution. No proof assistant was used. Broader Wolfram Language searches are retained as exploratory evidence and are not promoted to standalone certificates. The source audit is targeted rather than exhaustive.

## Relationship to earlier work

[Castañeda, Honorato and Valenzuela-Henríquez](https://arxiv.org/abs/2608.05392) give a chain-based failure of the weak Markus–Yamabe conjecture in dimension 14 and discuss shortening mechanisms. The present work concerns two different, explicitly bounded five-variable compression architectures.

[liqsweep / blueberryvertigo](https://github.com/blueberryvertigo/ArXiv-tryouts) supplied the six-dimensional baseline formulas. This release independently expands the constant-spectrum identity and checks the three listed zeros before using that construction as a source.

[Meng and Yang](https://arxiv.org/abs/2607.22198v2) give the audited five-variable Hessian construction, while [Liu](https://arxiv.org/abs/2608.19112) supplies the broader Hesse-system language and coefficient-span context. The uniform minor calculation here is stated independently of the numerical coefficient of the source's term linear in $A$.

These comparisons delimit the contribution; they do not certify unconditional historical priority.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Polynomial-dynamics researchers | Two exact failures of natural five-variable compression routes | No global dimension-five conclusion follows |
| Jacobian and Hessian conjecture researchers | A uniform full-span obstruction stable under auxiliary-affine lower terms | It concerns affine source-target normalisation, not nonlinear equivalence |
| Computer-assisted proof developers | Small rational certificates, explicit negative controls and a transparent short contradiction | Exact replay checks the encoded bridge; it is not proof-assistant formalisation |
| Research agents exploring WMY5 | A machine-readable map of closed routes, assumptions and remaining search space | Search outside the stated gradings rather than generalising the exclusions without proof |

## Why the problem matters

Local spectral stability does not automatically control global polynomial dynamics. The weak Markus–Yamabe programme asks where that implication first fails and what algebraic structures permit failure. A construction in dimension five, or a genuine nonexistence theorem, would change the known boundary. Exact negative results are useful when they eliminate broad, natural construction templates and expose which assumptions must be abandoned next.

The contribution here is therefore architectural: it turns failed searches into certified information. Future work can avoid repeating the same compressions, reuse the coefficient equations as falsification tests and target nongraded or nonlinear mechanisms instead.

## How to inspect or reproduce the recorded checks

Read the theorem statements and scope qualifications in the PDF first. Then consult `AI_INDEX.md` and `CLAIMS.json` to map claims to evidence. From a fresh extraction, run:

```bash
python3 -I verify.py --report /tmp/wmy5-verification.json
python3 -O -I verify.py --report /tmp/wmy5-verification-opt.json
python3 -I test_mutations.py
python3 -O -I test_mutations.py
python3 -I check_chain_short_identity.py
python3 -O -I check_chain_short_identity.py
python3 discovery/grading_audit.py
python3 -O discovery/grading_audit.py
python3 discovery/generalized_hessian_check.py
python3 -O discovery/generalized_hessian_check.py
```

The expected outcomes are five exact-check groups passed, all four corruptions rejected, the chain residual $16{,}367{,}616$, inventory totals 27 and 28, and the factored Hessian determinant above. The [GitHub release](https://github.com/ipitchford/wmy5-graded-obstructions/releases/tag/v1.0.2) and [Zenodo record](https://zenodo.org/records/23478563) carry the frozen version-of-record assets. Version 1.0.2 is an archive-and-assurance-metadata successor: no theorem, proof, manuscript, certificate, verifier or scientific claim changed from the original release.

## The most valuable next projects

The strongest assurance step is an unaffiliated specialist audit of the family-completeness reductions and the coefficient-to-certificate bridge. A compact proof-assistant formalisation of the eight-forcing-equation chain contradiction is particularly tractable.

For new research, the useful target is not another small variation of the excluded gradings. The archive points toward genuinely different mechanisms: nongraded compressions, nonlinear equivalences, or constructions whose auxiliary coupling does not inherit the full Hessian-span obstruction. Any such proposal should first be tested against the exact coefficient and eigenvalue diagnostics released here.

## What is in the evidence package

The release includes the nine-page paper and LaTeX source, three rational ideal certificates, the Hessian coefficient-minor certificate, standalone exact polynomial code, mutation tests, the independent short-chain checker, symbolic grading and Hessian audits, replay reports, structured claim and status records, source and licensing files, provenance, assurance boundaries and an AI-readable index.
