Evidence Press began publishing on 28 July 2026. It is run by one person working with AI systems, mainly Anthropic's Claude and OpenAI's models, for about fifty hours a week. This page records what that arrangement produced in its first twelve weeks, how, at what cost, and what the figures do not show. The person is not named: the case is about the method, not the individual.

## What was produced

Figures are as of 20 October 2026, from the site's public records.

| Output | Count | Public record |
|---|---|---|
| Research releases, each with a Zenodo DOI, public repository and evidence package | 166 | [Release index](/api/papers.json) |
| Releases whose evidence was replayed internally before publication | 163 | Each release's assurance record |
| Releases carrying public correction notices | 17 | Each release page |
| Recorded research attempts in the work ledger, including unfinished and stopped work | 147 | [Work ledger](/api/work-ledger.json) |
| Long-form articles | 7 | [Articles](/articles/) |
| Public explanatory films, and short videos | 171 and 127 | YouTube channel |
| Public repositories | 174 | GitHub |
| A puzzle book, in hardback and Kindle editions, with a paperback to follow | 1 | [Think Again](/think-again/) |

The running cost is around $500 a month, almost all of it AI subscriptions and API use. There are no staff and no office.

The order of magnitude is the point. The binding constraint has moved from producing work to checking it.

## The methods that carry the load

**Evidence first.** Every research result is published with what is needed to check it: code, data, certificates and a one-command replay. Publishing evidence is cheap for AI systems and expensive for people, so it is where they add most.

**A second model attacks the first.** Scripts, manuscripts and claims are reviewed by a different vendor's model, instructed to find errors rather than to confirm. In one recent film script the reviewer found a median of 0.000582 that had been read aloud as "five point eight two", an error of a factor of ten thousand.

**Parallel fact-checking.** For a recent article, three AI agents checked every substantive claim against primary sources at the same time: the original essay and data, the cited papers, and the original posts quoted. They found four claims that needed correcting before publication, including a widely repeated statistic attached to the wrong threshold.

**Automated gates.** No page is published until the site builds identically on three software versions, passes accessibility tests, and is checked against the live site so that nothing already published is lost. Recordings are transcribed back to text to catch dropped words.

**Templates and memory.** Each kind of output has a pipeline: a film template, a release workflow and an article workflow. The AI keeps durable notes between sessions, so decisions and corrections are not relearned. Twelve films for new releases were produced in under two days this way, each with its own script review and checks.

**The person decides.** Choosing what to work on, approving publication, judging quality and taking responsibility remain human work. The AI publishes, spends and contacts others only within authority the person has given.

## What the checks catch, and what they miss

The checks catch most errors of arithmetic, transcription, citation and consistency before publication. They do not make the research right. Seventeen releases carry public correction notices for errors found after publication, and none of the 166 releases has yet been peer reviewed or independently reproduced. Speed of production is not evidence of value: audience reach is still small, and whether the work matters to others is not yet known.

## What this does not show

- **It is one case, not an experiment.** There is no comparison with the same person working without AI, so the size of the gain cannot be stated precisely.
- **The person is unusual.** A research background and long editorial experience make the checking possible. Someone without that background might get much less from the same tools.
- **Volume is not quality.** Unrefereed candidates at scale are a different product from a few refereed papers.
- **Costs may change.** The figures rest on current subscription prices and promotional credits.

It is evidence that, for one kind of knowledge work, one person with current AI systems can produce a volume of checked output that would usually need a team, provided most of the effort goes into checking. The methods behind it are published on these pages so that others can test whether they work for their own tasks.

[Back to Productivity Protocols](/productivity/) · [Run the two-week self-test](/productivity/measure/)
