# Ordinary-domination follow-up: EP local replay

Date: 22 September 2026. Assessment by Evidence Press using GPT-6 Astra.
This is a subsequent-work receipt, not a revision of the original research archive.

## Exact sources and credit

- Koyar Afrasyab, [arXiv:2609.10783v1](https://arxiv.org/abs/2609.10783v1), submitted 9 September 2026. The ordinary-domination strengthening and supplied checker/enumeration are attributed to Afrasyab.
- Original EP graph: [v4.0.0-rc1](https://github.com/ipitchford/txgraffiti-conjecture3-resolution/tree/39012d1e1bb0df0826293244e54a9c995986a0fd), tag resolved to `39012d1e1bb0df0826293244e54a9c995986a0fd`, original DOI [10.5281/zenodo.21852504](https://doi.org/10.5281/zenodo.21852504).
- [Replay harness](replay.py) and [complete captured output including SHA-256 hashes](replay-output.txt).

## Observed results

All 75 labelled edges match between the EP edge list, EP JSON and preprint JSON. All 20 ordered signed clauses match the preprint JSON and the enumeration's hard-coded formula. Literal labels are 2(j-1) for negative and 2(j-1)+1 for positive literals; clause a has label 29+a. The structural checker reconstructs these edges and verifies the 16-vertex dominating witness and maximal matching of size 15.

The preprint's tree checker, run directly against EP's edge list, passed in normal and optimized Python: 893,049 nodes, 223,262 branches, 669,787 leaves, maximum depth 15. It excludes every dominating set of size at most 15. Three deliberately damaged trees (truncation, trailing byte, invalid magic) were rejected.

The exact enumeration passed in normal Python with assertions enabled: 1,048,576 clause subsets, 5,931 residual cases, all exact residual minima 16. Combined with the verified witness this supports gamma(G)=16. The 15-edge witness and the cubic bound ceil(75/5)=15 give gamma_e(G)=15.

## Semantic check and limitations

At a tree branch an undominated vertex must be covered by one of its four closed-neighbourhood vertices. The checker explores all four choices. A vertex already selected cannot neighbour an undominated vertex, so these choices cannot repeat a selected vertex. Its leaf tests reject an uncovered graph at budget 15 or when the remaining budget cannot cover the uncovered vertices at four per choice. Thus the checked proposition concerns ordinary domination, without an independence constraint. The enumeration is a second implementation route, not evidence of unaffiliated independence.

This is EP local replay on macOS arm64 with Python 3.14.7, not end-to-end formal verification, external specialist review, peer review or a rerun of every claim in EP v4. The original i(G)=16 result does not imply gamma(G)>=16. We did not regenerate the tree with the C++ generator or run every optional search script.

The supplied wrapper expects `dom15.tree.gz`, but the arXiv source contains `dom15.tree`; the checker supports the plain file, which was used unchanged. EP's JSON has a different schema (`order` rather than `n`), so feeding it directly to the preprint structural checker raises KeyError. Instead, the harness proves edge/formula identity and checks the unmodified preprint JSON; the tree checker consumes EP's edge list directly. Neither adaptation is hidden as a successful unchanged wrapper run.

## Separate minimality dependency

[Gupta, arXiv:2608.22498v1, Proposition 7](https://arxiv.org/html/2608.22498v1#S6) reduces the cubic order bound to satisfiability of a (3,2,2)-formula with at most 19 clauses. [Zhang, Peitl and Szeider, SAT 2024, Table 1](https://doi.org/10.4230/LIPIcs.SAT.2024.31) gives the requisite minimum unsatisfiable size 20, with polarity occurrences bounded above by two, not required equal to two.

The scope matches: an unmatched vertex with neighbours on three matching edges gives a clause; a matching endpoint supplies at most two occurrences of its polarity. Other unmatched vertices are covered by any transversal. Edge counting bounds unmatched vertices by floor(2n/5), hence at most 19 for cubic n<=48. Cubic graphs have even order. The resulting order-50 minimality is for gamma>gamma_e, not i>gamma_e. We inspected this dependency argument but did not reproduce the SAT classification. No unconditional all-cubic classification replay or uniqueness claim is made here.

## Reproduction

In a fresh directory download the version-pinned arXiv source and the two graph files, inspect the archive before extracting into `source/`, then put `replay.py` beside them:

```sh
curl -fL https://arxiv.org/src/2609.10783v1 -o arxiv-source.tar
curl -fL https://raw.githubusercontent.com/ipitchford/txgraffiti-conjecture3-resolution/39012d1e1bb0df0826293244e54a9c995986a0fd/counterexample.edgelist -o ep.edgelist
curl -fL https://raw.githubusercontent.com/ipitchford/txgraffiti-conjecture3-resolution/39012d1e1bb0df0826293244e54a9c995986a0fd/counterexample.json -o ep.json
mkdir source
tar -xf arxiv-source.tar -C source
python3 replay.py
```

Compare downloaded SHA-256 values with the captured output before executing downloaded code. The source archive hash records transport bytes; the individual checker and tree hashes bind the actual replay inputs. Research-source licences remain those of their respective archives; this receipt does not relicense them. EP's new receipt and harness follow the site's CC0 terms.
