## What this site is

Evidence Press is a small, independent press office for a specific and unusual kind of research output: new results released **with the complete evidence attached** — code, data, exact certificates, verification records — before any journal has seen them.

Each release corresponds to one archived deposit: a manuscript, its evidence package, and its verification records, frozen on [Zenodo](https://zenodo.org) with a DOI and mirrored in a public GitHub repository. The releases explain each paper twice — once in plain language, once for specialists — and state, without varnish, what has and has not been verified. The current releases are mathematical; the format is built for research generally, and future releases need not be.

## Articles are a different publication type

The [Articles](/articles/) section contains high-quality essays, commentary,
syntheses, research notes and institutional updates. An article has structured
sources, an explicit claim boundary and additive correction history, but it is
not required to carry a manuscript, repository, executable certificate or DOI.
Its appearance on Evidence Press therefore does not inherit the assurance state
of a research release. Where an article discusses a release, readers should
follow the link to that release's evidence package before relying on the claim.

## The verification ladder

Every result here occupies a precise rung on a ladder of assurance:

1. **Claimed** — someone asserts a result.
2. **Internally replayed** — the claim ships with complete evidence and scripts, and the authors' own replay of that evidence passes, including mutation and negative controls. *Every release on this site is at least here.*
3. **Independently reproduced** — a separate team, with separate code, reaches the same result. *No release on this site is here yet.*
4. **Formally verified** — the full argument, including the bridge from claim to computation, is checked by a proof assistant or equivalent machinery.
5. **Peer reviewed and accepted** — the research community has examined and absorbed the result.

The distance between rungs 2 and 3 is the whole point of this site. Internal replay is real evidence — it rules out large classes of error, and anyone can rerun it — but it is not independent verification, and mistakes of encoding (where the thing checked is subtly not the thing claimed) remain logically possible. Each release page carries a verification-status box saying exactly this, and lists the open problems whose solution would move it up the ladder.

## The ladder is shorthand; the matrix is the record

The ladder above is a useful summary, and it is how most people first think about assurance. It is also, strictly, wrong in one respect: the rungs are not a single ordering. Independent reproduction, formal verification and peer review answer *different questions*, and none sits above another.

- **Independent reproduction** asks whether someone else, working separately, reaches the same result.
- **Formal verification** asks whether a formalised statement is machine-checked — and it is only as strong as the formalisation and the trusted base beneath it. A verified theorem can still be the wrong theorem.
- **Peer review** asks whether experts, reading the argument, find it sound. Reviewers rarely rerun anything and almost never formalise anything.

A release can have any of these without the others. So the authoritative record for each release is not a rung but an **assurance matrix**: eight independent dimensions — archival availability, internal replay, independent rerun, independent reimplementation, formal verification, specialist review, editorial peer review, and data and environment reproducibility — each carrying its own state.

States are `passed`, `partial`, `failed`, `not assessed` or `not applicable`. The distinction between *not assessed* and *failed* is deliberate and load-bearing: almost every dimension on almost every release here is **not assessed**, which is a statement about what nobody has done yet, not a finding against the work.

The matrix is published with every release, in the `assurance` field of its [JSON record](/api/papers.json) and in its [RO-Crate package](/api/schema.json). The older `verification` booleans are still published for compatibility, but they are now *derived* from the matrix rather than asserted separately, so the two can never disagree.

## Corrections

When something published here turns out to be wrong, the correction is added, not substituted. The release keeps a dated entry recording what it previously said, what it now says, and why it changed. Quietly repairing a page would leave a reader unable to tell whether the version they saw was the wrong one.

Corrections are classified by what they touch — presentation, metadata, claim, or evidence — because "the page displayed a formula where a number should have been" and "the result is wrong" deserve very different reactions from a reader.

## Why publish before review?

Because the evidence is executable. A traditional preprint asks readers to trust prose; these releases ask readers to run code. Publishing the full evidence architecture early — with SHA-256 manifests, pinned environments, claim-to-evidence indexes, and deliberately mutated negative controls — lets anyone, human or machine, begin verification or refutation immediately. Refutation is a welcome outcome: a broken claim withdrawn quickly is a success of the format.

## How the research is produced

The research in the current releases was generated largely by AI systems (the specific models are credited on each release and in each Zenodo record), with human problem selection, mediation, and publication management. The project treats this as a fact to disclose prominently, not a claim of authority: AI authorship makes independent verification *more* important, not less, and the evidence packages are designed accordingly. Where releases depend on prior human results, those results are cited and, where necessary, pinned as explicit external dependencies with recorded hashes.

## Reading, listening, reusing

Each release offers several forms: the press page, the paper PDF, a narrated audio briefing of the plain-language summary, a Markdown version of the page, and structured metadata (JSON, BibTeX). Everything original on this site and in the releases is dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) — reuse, republish, or build on any of it without permission. Preserving the unrefereed framing when quoting results is a scholarly request, not a legal condition.

## Contact and corrections

Each release links to its GitHub repository; issues and pull requests there are the fastest route for corrections, refutations, or independent reproduction reports. Substantiated refutations will be reflected on the affected release page.
