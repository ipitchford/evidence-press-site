## Summary

**In one sentence.** With three or more categories, every category can look homophilous in groups at the same time; an exact formula says how strongly, and which budget blocks it.

**The setting.** Sociologists and network scientists measure *homophily* — people gathering with others like themselves — in group data: teams, meetings, conversations, the small clusters of children recorded by proximity sensors in a classroom. For a group of a fixed size, each category gets an *affinity ratio* at each count: how often its members find themselves in groups with one, two or more others of their own category, divided by how often a chosen baseline (chance) would put them there. A ratio above 1 means more than chance. A common test, *strict-majority homophily*, asks whether a category's ratios are above 1 at every count where it forms a majority of the group.

**What was known.** Veldt, Benson and Kleinberg (2023) proved that with only two categories the bookkeeping forbids natural kinds of simultaneous homophily: for example, with odd group sizes the two categories cannot both pass the strict-majority test, whatever the data. They asked how these limits change with more categories.

**What is proved.** For groups of one size, the paper answers that question:

- **Theorem 1 (the obstruction disappears).** With three or more categories, small changes that keep every category's participation fixed make every category's ratios rise with its count, all at once — even in connected, simple, regular networks. This turns an informal remark by Sarker, Northrup and Jadbabaie into a theorem.
- **Theorem 2 (an exact test).** A short list of inequalities decides which combinations of majority-group frequencies are possible at all.
- **Theorem 3 (a ceiling with a named bottleneck).** A closed-form ceiling $\lambda_{\max}$ says how far *all* majority ratios can rise together. It is the smallest of three budgets — the number of groups, each category's own participation and its complementary participation — so it also says which one blocks. All categories can pass if and only if $\lambda_{\max}>1$.
- **Two consequences in a few lines.** The ceiling gives a three-line certificate for the two-category odd-size impossibility of Veldt et al. (Corollary 2), and shows that when participation matches the baseline, the baseline must allow groups with no majority at all (Corollary 3).

**A school example.** In public proximity data from a Lyon primary school, the same 4,600 three-person groups give opposite verdicts depending on the labels. Labelled by the 10 pupil classrooms, **10 of 10 classrooms pass** the strict-majority test; merged into 5 school years, **0 of 5 years pass**. The years are *not* less segregated. Merging roughly doubles how often two of three members share a category by chance, while most same-year contact happens in groups drawn entirely from one year — so the two-of-three ratio falls below 1. The criterion is not monotone in segregation: a category whose groups were all pure would fail it too. Classroom 1A passes by a margin of two groups. The ceiling still leaves room (3.92 for classrooms, 2.07 for years), but coding the same groups as pupils versus teachers gives 0.641, below 1, as the two-category result requires.

**How sure we are.** Every theorem has a written proof in a 22-page paper, with exact and linear-programming checks. The school example is exploratory and descriptive. This is an unrefereed candidate; see the evidence section for what was and was not checked.

**Where to go next.** Specialists can continue to the summary below; the reporting checklist and the technical account follow; the evidence section lists limits.

## Summary for specialists

Setting: $q\ge2$ categories partition the population; groups have fixed size $k\ge2$; $N=(N_1,\dots,N_q)$ is a group's composition with law $P$ on $\mathcal S_{q,k}=\{n\in\mathbb Z_{\ge0}^q:\sum_cn_c=k\}$; $d_c=\mathbb E_PN_c$ is category $c$'s participation; $h_{ct}(P)=tP(N_c=t)/d_c$ is the share of $c$'s memberships in groups where $c$ has $t$ members, and $R_{ct}=h_{ct}/b_{ct}$ its affinity ratio against a baseline $b$. Strict majority means $t\ge r=\lfloor k/2\rfloor+1$.

- **Theorem 1 (constructive feasibility, $q\ge3$):** for any full-support baseline whose category participation matches $d$, a perturbation $P_\varepsilon=P_0+\varepsilon\Delta$ preserving every $d_c$ makes $R_{c1}<R_{c2}<\dots<R_{ck}$ with $R_{ck}>1$ for every category simultaneously, for all small $\varepsilon>0$. Proposition 2 preserves every individual's participation; Proposition 3 realises the pattern in connected, simple, regular finite hypergraphs at every rational composition. Proposition 1 (the binary boundary) is Veldt et al.'s *(proof)*
- **Theorem 2 (exact majority projection):** prescribed strict-majority probabilities $y_{ct}=P(N_c=t)$, $t\ge r$, are realisable at means $d$ iff a finite list of inequalities from Gale's supply–demand theorem holds (with additional pairwise constraints for odd $k$) *(proof; LP cross-check on 560 problems)*
- **Theorem 3 and Corollary 1 (sharp ceiling):** with floors $a_{ct}$, $A_0=\sum a_{ct}$, $T_c^0=\sum_tta_{ct}$, $S_c^0=\sum_t(k-t)a_{ct}$, $T^0=\sum_cT_c^0$,
$$\lambda_{\max}=\min\Big\{\tfrac1{A_0},\ \min_c\tfrac{d_c}{T_c^0},\ \min_c\tfrac{k-d_c}{T^0-T_c^0+S_c^0}\Big\},$$
attained by a law using only pure and two-category groups. With $a_{ct}=d_cb_{ct}/t$ it equals $\max_P\min_{c,t\ge r}R_{ct}$; for $q$ equal categories and a three-person multinomial baseline, $\lambda_{\max}=q^2/(3q-2)$ ($1,9/7,8/5,25/13$ for $q=2,\dots,5$) *(proof; LP cross-check on 864 problems)*
- **Corollary 2:** for $q=2$, odd $k$ and any realisable positive baseline, $\lambda_{\max}\le1$ for every activity profile; the more active category exhausts its complementary budget. This recovers the odd-size part of Veldt et al.'s Theorem 5 with an elementary certificate that quantifies the deficit *(proof; 999 exact random cases)*
- **Corollary 3:** at matched participation $\lambda_{\max}\le1/A_0$, where $A_0$ is the baseline probability of a strict majority; if every group has a majority, simultaneous strict-majority homophily is impossible for any $q$ *(proof; 466 exact random cases)*
- **Section 7 (exploratory):** observed-node hypergeometric baseline on 4,600 distinct triples: classrooms $R_2\in[1.015,2.145]$, years $R_2\in[0.512,0.808]$, $R_3$ large in both; 8–10/10 classrooms vs 0–1/5 years across four weighting/baseline specifications; $\lambda_{\max}=3.920819$ (classrooms), $2.065991$ (years), $3480040/5429603\approx0.641$ (pupils/teachers).

## The school example in one picture

![Two panels of affinity ratios for the same 4,600 distinct three-person proximity groups, labelled by the ten pupil classrooms (blue bars) and by the five merged school years (red bars), with a dashed line at the chance baseline of 1. Left panel, groups in which exactly two of three members share the category: all classroom bars are above 1, all school-year bars are below 1. Right panel, groups in which all three share the category, on a logarithmic scale: every bar is far above 1.](/assets/figures/multicategory-group-homophily-classroom-year-profiles.png "Affinity ratios in the same 4,600 triples by classroom (blue) and merged school year (red), against the observed-node hypergeometric baseline (dashed line = 1). Left: exactly two of three members share the category. Right: all three do (log scale). Teachers are a separate category throughout. Data: SocioPatterns primary-school contacts (Stehlé et al., 2011), via the Benson labelled hypergraph release; aggregated and classrooms merged. This figure is an adaptation licensed CC BY-NC-SA 3.0, not CC0.")

Every school year has strictly increasing ratios ($R_1<R_2<R_3$): the more same-year members a group has, the more overrepresented it is. The years fail only at two-of-three. Deleting every triple that mixes a year's two classrooms (65 to 263 per year) still leaves every year's two-of-three ratio below 1 (0.646 to 0.906), so mixing between a year's classrooms is not the cause. Replacing a same-classroom member by an outsider in just two of classroom 1A's 82 two-member triples would make it fail; the next most fragile classroom, 4B, needs 17 such changes.

| Group weighting | Baseline | Classrooms passing | School years passing |
|:--|:--|--:|--:|
| 4,600 distinct triples | Observed-node hypergeometric | 10/10 | 0/5 |
| 4,600 distinct triples | Participation-share multinomial | 9/10 | 1/5 |
| 9,262 timed triple records | Observed-node hypergeometric | 8/10 | 0/5 |
| 9,262 timed triple records | Participation-share multinomial | 9/10 | 0/5 |

## A reporting checklist for group homophily

The paper recommends reporting, alongside any group-homophily verdict:

1. the category partition, and any coarser or finer partition considered;
2. the group size, and how groups are weighted (distinct sets or occurrences);
3. the baseline, and whether category participation matches it;
4. each category's population share and participation share;
5. the full ratio profile $R_{c1},\dots,R_{ck}$, not only a pass/fail verdict;
6. the observed minimum majority ratio, the ceiling $\lambda_{\max}$ of Corollary 1 and the budget that binds.

Item 5 matters because a failure cannot by itself be read as weak homophily. Item 6 separates "could not have passed" from "did not pass". The package includes a small exact function, `mathematics/homophily_ceiling.py`, that returns the ceiling and its binding budget.

## Technical account

**Why two categories are stuck.** A three-person group with two members of A and one of B counts towards both categories' participation. With two categories and odd $k$, every group has exactly one majority category, so the majority memberships of one category are the minority memberships of the other. Fixing participation then ties the two categories' majority ratios together so that both cannot exceed 1.

**Why a third category frees them.** With $q\ge3$, groups with no strict majority (such as one member of each of A, B and C) exist and absorb participation. Theorem 1 builds explicit trades between compositions whose marginal increments raise each category's high counts and lower its low counts while every participation total stays fixed; Appendix A describes the affine space of composition marginals for $q\ge3$, which leaves room for such trades. A cyclic lift turns the weighted construction into a simple regular hypergraph (checked exactly on a 66-vertex example with ratios $65/88$ and $65/42$).

**Where the ceiling comes from.** Asking for $P(N_c=t)\ge\lambda a_{ct}$ in every majority event is a transport problem: majority groups must be supplied with members of every category. Disjointness of majority events gives the group-count budget; compulsory majority memberships give each category's own budget; the minority places in other categories' majority groups give the complementary budget. Maximum-flow/minimum-cut duality (Gale's theorem) shows only singleton receiver cuts matter, so these three families are also sufficient — the ceiling is exact and attained.

**What it does not cover.** The model allows every integer composition with real weights. Forbidden compositions, a fixed finite hypergraph with prescribed degrees, coupled group sizes and overlapping identities need additional constraints; the ceilings are then outer bounds.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/multicategory-group-homophily.txt) is available for reading.

- **Proofs.** Theorems 1–3, Propositions 2–3 and Corollaries 1–3 have written proofs in the 22-page paper; Proposition 1 is Veldt et al.'s and is credited. The underlying methods (finite differences, coupling geometry, flow duality) are standard; the paper claims the specialised homophily results.
- **Exact and LP checks.** `exact_verification.py` checks Theorem 1 on 42 exact cases ($q=3,4,5$, $k=2,\dots,8$); `cyclic_lift_check.py` builds the simple regular example; `corollary_checks.py` checks Corollaries 2–3 and the free-participation remark in exact arithmetic (999, 466 and 360 random cases); `independent_majority_verification.py` compares Theorems 2–3 with independent linear programmes (560 and 864 problems, no disagreements). These test the statements on finite examples; the universal statements rest on the proofs.
- **School data.** The tables were recomputed independently by a second parser from the public archives, and `aggregate_extensions.py` recomputes the profiles, the deletion counterfactual, the fragility counts and the pupil/teacher ceiling from released composition counts.
- **Controls and replay.** Every script uses explicit checks that exit non-zero on failure, also under Python's `-O` flag; a deliberately corrupted copy is detected. Rerun from fresh copies before release and again from the frozen archive, under normal and optimised Python, every regenerated receipt matched (the figure PDF differs only in its creation timestamp). The data-download route was not rerun at publication.
- **Review.** Five internal AI-assisted reviewer roles, an adversarial review and proof audit by a separate model, a proof audit and a clean replay led to one revision round, which added Corollaries 2–3, the mechanism and fragility analysis, the pupil/teacher ceiling and the reporting checklist; a re-review found no open correctness issue. A rating-free summary is in the package. None of this is peer review, independent reproduction or formal verification.
- **Limitations.** The results are about a descriptive, incidence-weighted measure: they say nothing about preferences, opportunity, influence or causes, and do not separate group-level effects from those inherited from pairwise contacts. The exact bounds assume a relaxed composition model, not fixed finite hypergraphs; supports with forbidden compositions are open. The school example covers one school over two days, with dependent clique-derived records and no sampling theory; verdicts flip under merging and some classroom ratios are near 1. The literature search was dated and bounded.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Network scientists and sociologists measuring homophily in group data | Compute, from participation and the baseline, whether all categories could have passed a strict-majority test at all, and which budget blocks it, before interpreting a failure | A bound for an idealised composition model; descriptive only; verdicts can change when categories are merged |
| Researchers designing group-homophily measures | An exact feasibility region and ceiling for any number of categories, and a reporting checklist | One group size at a time; forbidden compositions not covered |
| Theorists of higher-order networks | A constructive answer to the multicategory question of Veldt, Benson and Kleinberg and a short certificate for their odd-size result | Fixed finite hypergraphs with prescribed degrees remain open |
| Research agents | Machine-readable claims, an agent index and replayable exact checks | The checks corroborate; the theorems rest on the written proofs |

## Why the problem matters

Group data are increasingly used to study segregation in schools, workplaces and online communities, and higher-order homophily scores are reported category by category. If a category can fail a homophily test simply because the arithmetic forbids passing, or if merging categories can flip the verdict without any change in behaviour, readers can draw the wrong social conclusion. The ceiling and checklist make that distinction checkable.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, in a copy of the package root, with Python 3.12 and the versions in `requirements.txt` (numpy, scipy, matplotlib):

```sh
shasum -a 256 -c MANIFEST.sha256
python3 -I -B reproduce.py        # add -O for the optimised replay; no network
```

`reproduce.py` rewrites the JSON receipts and the Section 7 figure; compare them with the shipped files. `python3 reproduce.py --empirical` additionally downloads the two public archives (hash-checked) and rebuilds the school tables. `AI_INDEX.md` maps each result to its proof and checks, `VERIFICATION.md` says what each script establishes, and `REVIEW_SUMMARY.md` lists the objections raised in review and how each was handled.

## The most valuable next projects

1. Classify which strict-majority profiles are feasible when some group compositions are forbidden (structural zeros).
2. Decide feasibility and the ceiling for a fixed finite simple hypergraph with prescribed degrees.
3. Find a sharp ceiling for monotone (rather than majority) homophily, and extend the results to coupled group sizes.
4. Develop sampling theory so that intervals can be attached to observed ratios and ceilings.

## What is in the evidence package

The paper (PDF and Markdown source); the bibliography built from Crossref and arXiv records; the verification scripts and their receipts; the aggregate school tables, exact cell tables, sensitivity outputs and figures; a rating-free summary of the internal review (`REVIEW_SUMMARY.md`); the novelty audit, `VERIFICATION.md`, `AI_INDEX.md`, `RESEARCH_GATES.json`, `REPLAY_RECEIPT.md`, citation metadata, the CI workflow and `MANIFEST.sha256`. Raw third-party archives are not redistributed.

**Licences.** Text and mathematical content are CC0-1.0 and code is MIT, **except** the school-data-derived files (the tables and figures in `empirical_primary_school/`, the Section 7 figure — also shown above — and Appendix B), which are adaptations of SocioPatterns data licensed under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). Please credit the SocioPatterns collaboration and cite Stehlé et al. (2011), Gemmetto et al. (2014), Chodrow et al. (2021) and Benson et al. (2018) when using them. This remains an unrefereed candidate.
