## Summary

Three people are to share a handful of indivisible items, each valuing them in their own way. **Pairwise maximin share** fairness (PMMS) asks something precise of every pair. Suppose two people pooled their items and one of them split the pool into two piles, knowing she would receive the worse pile. A division is PMMS if, for every pair, each person already has at least what she could guarantee herself that way.

In September 2026 three preprints showed that PMMS divisions need not exist. For three people the known counterexamples use nine items. This candidate settles the smallest size: **with at most eight items, a PMMS division always exists**, whenever each person's values add across items. Nine is therefore the least number of items in a three-person counterexample. The proof is computer-assisted, and its certificates can be checked by short programs.

## Summary for specialists

Let $v_1,v_2,v_3$ be nonnegative additive valuations on a set $M$ of $m\le 8$ goods. There is a complete allocation $(A_1,A_2,A_3)$, empty bundles allowed, with

$$v_i(A_i)\ \ge\ \mu_i(A_i\cup A_j)\qquad(i\ne j),$$

where agent $i$'s maximin share of a set $U$ of goods is

$$\mu_i(U)=\max_{T\subseteq U}\min\{v_i(T),\,v_i(U\setminus T)\}.$$

With the nine-good counterexamples of Gölz and of Bei, Lin, Liu, Luan and Tao, re-verified here over all $3^9$ allocations, this gives $m^\star=9$. Previously existence was known up to five goods (Amanatidis, Markakis and Ntokos) and had been certified up to seven, so $m^\star\in\{8,9\}$.

The paper also proves by hand a sufficient condition for PMMS with $3q-1$ goods: one agent whose valuation is $q$-balanced, and a second agent $c$ with $3v_c(P)\le v_c(M)$ for the top $q-1$ goods $P$ of the third. It strictly extends an earlier condition that needed two balanced agents.

## Technical account

A counterexample can be perturbed to one with positive, generic values. Each comparison $v_i(S)>v_i(T)$ becomes a Boolean variable for a sign vector in $\{-1,0,1\}^M$. Additivity enters through necessary rules: opposite vectors have opposite signs, and signs propagate under addition and halving. These rules do not characterise real valuations, which is harmless for a refutation: every real counterexample still yields a Boolean model.

Agent $i$ holding $D$ fails PMMS against $E$ exactly when $D\cup E$ splits into two parts each worth more to $i$ than $D$. Every allocation with three nonempty bundles must contain such a failure. Smaller-case existence enters as injected clauses: every sub-instance on four to seven goods has a PMMS allocation, re-proved in the same framework from a six-good base formula that uses no injected theorem.

The decisive step is a normal form. Drop one agent's least valuable good, take a PMMS allocation $B$ of the remaining seven goods that is best for that agent and Pareto-maximal, and relabel. The sizes of $B$ give four profiles: $(1,1,5)$, $(1,2,4)$, $(1,3,3)$ and $(2,2,3)$. The last three are split by which agent's least good was dropped, giving ten formulas. Each has 252,930 variables and about 8.4 million clauses, and each is refuted by an LRAT certificate. The written reduction is in Sections 2–4 and Appendix A of the paper. The certificates are the machine-checked part.

## Evidence, assurance and limitations

Every formula is rebuilt clause by clause from the paper's definitions by a separate verifier. It imports nothing from the generator, and for the six- and eight-good formulas the rebuilt clause set equals the formula exactly. CaDiCaL produced the proofs. They were trimmed to the steps the refutation needs, and each trimmed certificate was accepted by two checkers: `lrat-check` from drat-trim, written independently of this work, and a standard-library Python checker. Controls compare the generator's clauses with exact PMMS counts on random and Gölz-derived instances. The EFX existence theorem is not used.

This is producer-side assurance. The verifier and the Python checker were written by the same producer as the generator, so their independence is in implementation, not authorship. The reduction is argued in the text, not formalised in a proof assistant. No unaffiliated reproduction, specialist review or editorial peer review has taken place. Three adversarial model reviews and one external review of the PDF were actioned; none is peer review. Priority rests on a recorded literature search of 7–9 October 2026.

## Relationship to earlier work

Gölz remarked that, having found no three-agent counterexample with eight goods, he believed nine to be minimal or almost minimal; this candidate turns that expectation into a theorem. The closest methodological precedent is the SAT-based EFX work of Akrami, Mayorov, Mehlhorn, Srinivas and Weidenbach. They encode an order on subsets, formalise their reduction in Lean and check DRAT proofs. Here additive sign rules are used, the generated files themselves are re-derived, and LRAT proofs are checked twice. The approaches are complementary. The companion Evidence Press release on nine chores addresses a different fairness notion (EFX) for chores.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Fair-division researchers | The exact threshold for three-agent PMMS, a new sufficient condition, and hard eight-good instances that defeat natural constructions | Unrefereed; the proof is a certificate, not an explanation |
| SAT and verification researchers | A fully re-derivable encoding with trimmed LRAT certificates and a standalone clause verifier | Checked certificates establish only the encoded formulas; the bridge is the written reduction |
| Research agents and tool builders | A machine-indexed package: claim ledger, manifest, replay script, AI index | Preserve version, scope and the producer-side assurance boundary |

## Why the problem matters

PMMS is one of the strongest fairness notions for indivisible goods that seemed plausible for additive valuations; it implies envy-freeness up to any good for positive values. Once counterexamples appeared, the natural question was where existence stops. A sharp threshold tells algorithm designers exactly which instance sizes come with a guarantee. It also tells theorists where a structural explanation must work.

## How to inspect or reproduce the recorded checks

Start from **AI_INDEX.md** in the core archive. Unpack the archive, download the certificate files from the Zenodo record into one directory (proofs above 600 MB come in 400 MiB parts), and run `python3 -I place_proofs.py DIR`, which joins the parts and checks each digest. Then `python3 -I verify_bundle.py --out receipt.json` re-derives every formula, confirms the nine-good counterexamples and runs `lrat-check` on all fourteen certificates. It needs only Python, a C compiler and gzip, takes about an hour, and ends with `PASS_ALL_BUNDLE_CHECKS`. Any eight-good formula can also be regenerated deterministically and compared with its recorded SHA-256 digest.

## The most valuable next projects

The most useful next step is to reduce trust in this producer: an unaffiliated replay of the certificates, and a specialist reading of the normal-form reduction in Section 4, address different risks. A human-readable proof is a separate research problem; the hard instances in Section 6 show where any such argument must work, because the natural constructions each fail somewhere. Extending the method to four agents would need new ideas rather than more computation.

## What is in the evidence package

The paper and its LaTeX source; the generator, the clause verifier and both checkers; all fourteen formulas with variable dictionaries; the trimmed certificates with trimming logs, checker receipts and solver logs; the nine-good enumeration; the Section 6 instances and scripts; review reports and responses; a claim ledger, prior-art record, licence map, SHA-256 manifest and replay receipts. The core archive is on GitHub and Zenodo; the ten large certificates, about 33 GB in total, are separate files in the Zenodo record. The banner summarises the theorem's threshold and case split; the audio briefing is a communication aid, not additional evidence.
