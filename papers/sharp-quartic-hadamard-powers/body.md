## Summary

Take a degree-four polynomial whose coefficients are all positive and whose
four roots are real. Now raise every coefficient to the same positive power,
leaving the powers of the variable unchanged. Which exponents guarantee that
the roots stay real, for every such polynomial?

This unrefereed candidate gives a sharp answer. Exponent one works because it
changes nothing. Immediately above one, some polynomials lose real roots.
Universal preservation returns at a threshold of about **1.147720381237014**,
and every larger exponent works. Above the threshold all four output roots
are distinct. At the threshold, a repeated output root is possible only when
all four input roots coincide.

The paper supplies a complete proposed proof, not a numerical search promoted
to a universal result. Exact code checks selected algebra and the threshold's
decimal enclosure. External mathematical reconstruction and specialist review
remain to be obtained.

## Summary for specialists

Let $\mathcal R_4$ contain degree-exactly-four polynomials
$f(x)=\sum_{k=0}^4 a_kx^k$ with $a_k>0$ and only real zeros, including
multiplicities. Define ordinary coefficient powers by
$T_pf(x)=\sum_{k=0}^4 a_k^p x^k$. The candidate proves

$$
\{p>0:T_p(\mathcal R_4)\subseteq\mathcal R_4\}
=\{1\}\cup[p_*,\infty),
$$

where $p_*>1$ is the unique root above one of

$$6^p-2\cdot4^p+2=0.$$

For $p>p_*$ every output has four distinct negative zeros. At $p=p_*$,
multiple output zeros occur exactly for $f(x)=c(x+r)^4$, $c,r>0$;
the normalized output factors as

$$ (x+1)^2\bigl(x^2+(4^{p_*}-2)x+1\bigr). $$

The statement uses ordinary, not binomial-normalized, coefficients. It does
not classify arbitrary degrees, zero-coefficient boundary inputs or general
coefficient functions. The retained secondary AIM identifier is context;
the originating page was not authenticated in the current audit.

## Technical account

The difficult step is showing that a symmetric example controls an
unsymmetrical, noncompact family. Reciprocal symmetry is **not** assumed of
the input.

First, Newton inequalities provide a deliberately nonsharp successful tail.
A two-sided root perturbation at a universally preserving exponent yields a
linear functional annihilating the input's repeated-root factor times a
specified polynomial space. This restricts which multiplicities can occur
when output roots collide.

Next, strict lower-degree preservation excludes failures whose input roots
separate into widely different scales. A last-failing-exponent argument then
forces any hypothetical failure above the proposed threshold to produce a
compact boundary input at a universal preserver. It does not assume that
the preservation set is connected or monotone.

For quartics, the boundary functional excludes all but multiplicity patterns
$(4)$ and $(2,2)$. Those remaining inputs become reciprocal after positive
rescaling. A reciprocal quartic reduces to a quadratic in $x+x^{-1}$, where
two explicit inequalities yield the sharp threshold. Closedness is invoked
only after preservation above the threshold has been established; a separate
boundary argument proves the equality classification.

## Evidence, assurance and limitations

The evidence is the complete written proof, a dependency map, exact auxiliary
algebra, rational threshold bounds, package-integrity controls, source audits
and a response to the supplied AI-assisted review. Publication checks include
fresh-extraction replay, optimized-mode refusal, PDF inspection and Linux CI.
Their dated receipts identify the exact scope and bytes checked.

The algebra checker does not prove the scale-escape or compactness lemmas.
Deliberately corrupted expressions are local controls, not whole-proof mutation
tests. The assertion-based algebra checker refuses optimized Python; the
separate package verifier uses explicit errors and continues to enforce hashes.

The five-role editorial process is producer-coordinated internal AI review.
It is not unaffiliated reproduction, formal verification, authenticated
specialist review or journal peer review. Some later full texts and the
original AIM page remained inaccessible. No absolute novelty, historical
priority, four-star grade or measured workflow impact is claimed.

## Relationship to earlier work

Wang and Zhang's 2013 paper already establishes cubic preservation, gives a
quartic counterexample, and supplies a degree-dependent sufficient tail.
Białas and Białas-Cież's 2017 comment concerns Hurwitz stability; the 2024
paper by Białas, Białas-Cież and Kudra also exhibits quartic failure at exponent
1.147. These are prior results, not new discoveries in this release.

The proposed contribution is the exact universal quartic endpoint and its
equality classification. Finite-free multiplicative convolution uses a
different binomial normalization. Kudra's 2026 idealizer preprint concerns fixed
linear multipliers preserving the left half-plane. Neither comparison by itself
establishes or refutes this nonlinear real-rootedness theorem, and inaccessible
subsidiary results remain a novelty-audit limitation.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers in real-rootedness and total positivity | A sharp low-degree test case for nonlinear coefficient preservers | Reconstruct the written universal argument and audit prior art |
| Analysts studying boundary and extremal arguments | A multiple-root functional and separated-scale reduction | Higher-degree hypotheses and boundary patterns need fresh proofs |
| Scientific-software reviewers | A compact exact replay and a clear code-to-claim map | Hashes and local controls do not certify the whole theorem |
| Interested readers | An example where making an exponent slightly larger destroys a property before it returns | The guarantee concerns every admissible quartic, not every individual polynomial's failure pattern |

## Why the problem matters

Real-rootedness links polynomial coefficients to strong structural
inequalities. Ordinary coefficient powers look simple but need not preserve
that structure for every real exponent. An exact endpoint identifies where
the universal guarantee begins, and the equality case identifies its sharp
boundary. The significance is a focused mathematical classification, not a
claim of field-wide impact or an all-degree solution.

## How to inspect or reproduce the recorded checks

Download the immutable evidence ZIP and its outer checksum. Verify the ZIP's
SHA-256, extract it into a fresh directory, and follow `README.md`. The pinned
Python dependencies are SymPy and mpmath. Run `verify_package.py --root .
--replay`; the expected receipt is `PASS` for package integrity and scoped
producer replay.

Read `EVIDENCE_MAP.md` before interpreting the output. The distinct checks of
the analytical argument are in the manuscript and review reports, not hidden
inside that status word. Rebuilding the PDF is optional for reading the proof
and requires Pandoc and pdfLaTeX; the archived PDF has its own exact hash.

## The most valuable next projects

1. Reconstruct the compactness and quartic boundary classification outside
   the producer workflow, and publish a scoped review or correction.
2. Complete the inaccessible-source and broader citation audit, including
   direct reconciliation with the originating AIM question.
3. Investigate a higher-degree critical-exponent theory. Degree five needs
   a threshold-relative scale argument and additional multiplicity cases;
   the present induction does not directly apply.
4. Formalize the analytical proof if the theorem survives specialist scrutiny.

The stretch assessment identifies the higher-degree programme as potentially
substantial, but it supplies neither a higher-degree theorem nor a credible
six-hour four-star closure estimate. It therefore does not enlarge this
release's claim.

## What is in the evidence package

The package contains the manuscript PDF, accessible Markdown and TeX source;
the exact algebra checker, integrity verifier and negative controls; pinned
requirements and Linux CI; structured claims and a machine entry point;
source, novelty, licensing and provenance records; the supplied-review
response; frozen internal editorial reports; a stretch assessment; and a
complete file manifest. Outer ZIP checksums and fresh-extraction replay
receipts are supplied as explicit sidecars. Original prose and records are
CC0; original executable code is MIT. Cited third-party material and the
externally supplied review are not relicensed or bundled.
