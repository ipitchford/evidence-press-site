## Summary

**In one sentence.** Best–worst voting, one point for first place and minus one for last, can always turn sincere rankings back into the approval result.

**The question.** Some organisations elect by **approval voting**: each voter ticks every candidate they find acceptable, and the candidates with the most ticks win. Others ask voters to rank the candidates and award points by position; Borda counting is the best-known such **scoring rule**. Suppose the same sincere voters switched from ticking to ranking. Each would put every candidate they approved above every candidate they did not, but nothing fixes the order inside those two groups. Could a scoring rule then reproduce the approval result, for some sincere choice of rankings? If not, switching the ballot format can change the winner even when nobody changes their mind.

**What was known.** Zoi Terzopoulou, Jérôme Lang and William Zwicker (*Social Choice and Welfare*, 2025) set out this question. They allowed every ballot to be counted a fixed number of times, their device for letting one voter's ballot be split between several sincere rankings. They showed that Borda can always make all the approval winners win together, and that with three candidates no other scoring rule can; for four candidates they stated the shape any such rule must have (their note 11). They asked whether Borda is the only such rule for more candidates, and said they expected not; they believed that the four-candidate rule (2, 1, 1, 0) works, without a proof; and they conjectured that a simple family of inequalities on the scores decides when each approval winner can at least be elected on its own.

**What is new.**

| Result | In plain terms | Where |
|---|---|---|
| Best–worst voting recovers the approval winners | For any number of candidates, it makes all the approval winners, and no one else, win together once each ballot is counted at most one fewer times than there are candidates. One voter can force that many copies. The rule (2, 1, 1, 0) is best–worst voting with four candidates, so the original authors' belief was right, and Borda is not the only such rule | Theorem 5 |
| A fast test and complete lists | A polynomial-time test decides whether any rational scoring rule has the property. The paper lists every rule that does for four and five candidates, and every rational rule for six. For four candidates this completes the necessary condition of Terzopoulou, Lang and Zwicker; the five- and six-candidate lists are new. For six candidates the rules form a four-cornered region, cut out by two simple elections: one where a single candidate is unavoidably too strong, and one where a pair is | Theorems 8, 10, 12 |
| The conjecture for one designated winner holds | The inequalities they proved necessary are also sufficient whenever a ballot may be split between rankings, for any scores, and with whole copies for rational scores | Theorem 13 |
| Whole copies are not the same as splitting | With whole copies and irrational scores the conjecture can fail. In one election with eight candidates and five ballots, the designated candidate can win exactly when a parameter of the rule is a rational number, and the number of copies needed can be arbitrarily large | Theorem 15 |

**A small example you can check.** Take three candidates and one voter who approves x and y. Under best–worst voting a single ranking x y z gives scores (1, 0, −1), so only one of the two approval winners wins. Two copies of the ballot, ranked x y z and y x z, give (1, 1, −2): both approval winners win, and z loses.

**Limits.** The results are about whether sincere rankings *could* reproduce the approval result, not about what voters would actually submit, and they hold in the worst case, for every possible electorate. Irrational six-candidate rules remain open, and there is no general formula for every number of candidates. Borda already had the property, so the novelty lies in the second rule, the sharp copy count, the test and the lists. This is an unrefereed candidate; its assurance is internal AI-assisted review and exact computational checks only.

## Summary for specialists

The properties are FUPAC (all approval co-winners become co-winners after uniform replication) and FPAC (each approval winner separately), in the sense of Terzopoulou, Lang and Zwicker's Definitions 2 and 5.

- **Theorem 5** *(proof)*: best–worst voting has FUPAC with replication at most m − 1, sharp, and the winner set is exactly the approval winner set; it also has cautious approval compatibility (Corollary 7).
- **Theorem 8 and Lemma 9** *(proof)*: FUPAC is decidable in polynomial time for rational scoring vectors; every FUPAC rule is reflection symmetric.
- **Theorem 10** *(proof with exact certificates)*: the four- and five-candidate FUPAC rules are (2 + t, 1 + t, 1, 0) with rational 0 ≤ t ≤ 4 and (2 + 2t, 1 + 2t, 1 + t, 1, 0) with rational 0 ≤ t ≤ 3, up to positive affine change; the four-candidate necessity is from their note 11.
- **Theorem 12** *(proof with exact certificates)*: for six candidates, with gaps (g1, g2, g3, g2, g1) and g1 = 1, the rational region in (g2, g3) is the quadrilateral with corners (0, 0), (0, 3), (5/4, 11/2) and (4, 0).
- **Theorem 13 and Corollary 14** *(proof)*: the scalar inequalities of their Lemma 2 characterise split FPAC for real scores and FPAC for rational scores, proving the conjecture of their note 9 in the sense in which replication was introduced.
- **Theorem 15 and Corollary 16** *(proof)*: an eight-candidate family separates replication from splitting; finite replication succeeds exactly for rational parameter values, with unbounded copy counts.

**Known and new.** The question, the Borda result, the three-candidate uniqueness, the four-candidate necessary condition, the scalar inequalities and the conjecture are due to Terzopoulou, Lang and Zwicker. The question is a whole-profile version of the possible winner problem: Baumeister and Rothe showed that the possible winner problem is NP-complete for (2, 1, …, 1, 0) with arbitrary partial orders, and Kenig gave a polynomial network-flow algorithm when ballots are ordered layers, which includes approval ballots. The greedy box-intersection method is Edmonds's.

## Technical account

Each ballot can contribute any score vector from a box of possibilities, one for each way of ordering its two groups. Whether a chosen set of candidates can tie at the top then becomes a question of whether one box meets a sum of these shapes, and that question is answered by sorting, a classical idea from submodular optimisation due to Edmonds. For best–worst voting the inequalities that must hold reduce to counting ballots that are equal to a set of candidates or that cross it. Whole rankings are then recovered by a network-flow argument, which turns the counts back into first and last places.

For the classifications, the recognition test reduces FUPAC for a rational rule to finitely many linear programmes; the rule's boundary is then certified by exact rational dual solutions (found with a floating-point solver and checked exactly) and by witness elections that show the region cannot be larger.

## Evidence, assurance and limitations

- **Proofs.** Every result has a written proof in the 14-page paper, which opens with a context-first introduction and ends with limits, open problems and an AI-use statement. No proof assistant was used.
- **Computations.** All three scripts use exact integer or rational arithmetic. `code/verify_endpoints.py` checks the rational certificates: 3,600 inequalities for four candidates, 30,752 for five and 254,016 for each of three six-candidate corner rules, plus the two six-candidate witness elections and the eight-candidate counterexample. `code/verify_rational_fpac.py` checks the 18 + 18 signed vertex cases of the one-winner criterion. `code/check_best_worst.py` checks all one- and two-voter elections with three to five candidates. Only the exact checks are part of the proofs.
- **Tests that can fail.** No script relies on `assert`; each exits with an error on any failed check, also in Python's optimised mode. Changing one entry of the certificate file makes `verify_endpoints.py` fail.
- **Replay.** All three scripts were rerun from fresh copies before release and printed the expected results; GitHub CI reruns them on Linux and compares every printed line exactly.
- **Review.** A combined five-perspective Claude review panel, one revision round, a verification re-review and a proof audit. No Astra/Codex review ran for this release. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The results concern the existence of sincere rankings, not what voters would submit, and are worst-case. The six-candidate list covers rational rules and split ballots; irrational six-candidate rules are open, and there is no general formula for every number of candidates. This remains an unrefereed candidate.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Designers of voting procedures | Best–worst voting, like Borda, lets sincere rankings reproduce the approval winners, and the test checks any other rational rule | Says nothing about how real voters rank |
| Researchers in computational social choice | A sharp copy bound, a polynomial-time recognition test and classifications for four to six candidates | Irrational six-candidate rules and general m are open |
| Researchers on the possible winner problem | A whole-profile variant with a network-flow solution for best–worst voting | Worst-case statements only |
| Research agents | Machine-readable claims, an agent index and exact replayable checks with a failure test | The programs accompany written proofs; they do not replace them |

## Why the problem matters

Approval and ranked ballots are both in use, and organisations sometimes move between them. Knowing which scoring rules can always reproduce the approval result from sincere rankings tells a designer whether a change of ballot format alone could change the winner. The answer here is that Borda is not alone: best–worst voting also works, with a sharp bound on the copies needed.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, from the package root:

```sh
python3 -I -B -O code/verify_endpoints.py
python3 -m pip install sympy==1.14.0 && python3 -I -B -O code/verify_rational_fpac.py
python3 -I -B -O code/check_best_worst.py
```

Each prints `ALL CHECKS PASSED` and exits 0 within seconds; outputs compare exactly on every platform. `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary, and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## The most valuable next projects

1. An explicit description of the rules with the property for every number of candidates.
2. The behaviour of irrational rules inside the six-candidate region.
3. The least number of copies needed by the other rules with the property, and whether they, like Borda and best–worst voting, always make the winners exactly the approval winners.

## What is in the evidence package

The paper (LaTeX source `manuscript.tex` and the 14-page PDF); `code/verify_endpoints.py`, `code/verify_rational_fpac.py` and `code/check_best_worst.py`; `data/endpoint_certificates.json` (its SHA-256 digest is printed in the paper); `requirements.txt`; `refs.bib`; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
