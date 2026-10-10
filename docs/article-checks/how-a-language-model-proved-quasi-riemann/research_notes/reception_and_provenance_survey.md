# Reception and provenance survey for family 003 (quasi-Riemann hypothesis)

Prepared 10 October 2026 by a research subagent; spot-checked by the main analysis. Labels: **[P]** fetched from the primary source; **[2nd]** secondary report not confirmed at source; **[NF]** searched for and not found. Items marked **[verified]** were independently re-fetched for the main essay.

**Correction made during reconciliation.** The survey originally stated that the 7/8 paper relies on OpenAI's cubic Gauss sum first-moment paper (family 023). The 7/8 paper's introduction says the opposite: the first-moment result "is also not used here". The essay treats the connection as one of shared machinery and likely discovery path, not logical dependence.

## How the result was obtained

- README: the vast majority of results came from a fixed procedure, averaging three hours of ChatGPT Pro thinking compute per result, over about 4,000 posed problems; the zeta zero-free work and the Hodge conjecture for abelian varieties with complex multiplication were exceptions; the 11/12 write-up was human-edited for readability. **[P, verified]**
- No reasoning summary was released for family 003. **[P, verified]**
- 6 October blog post: no exceptions named; average of three hours; ten reasoning summaries. **[P, verified]**
- 8 September Navier–Stokes post: training of a new internal model since 28 August; an effort from 1 September to evaluate it on all open Millennium Prize problems; on the order of 10,000 concurrent agents in the Navier–Stokes group; agents shifted from other Millennium problems. Riemann hypothesis not mentioned. **[P, verified]**
- Quanta (6 October): computations "very different in spirit" from Navier–Stokes; two exceptions (zeta, Hodge), both in pursuit of Millennium problems; otherwise nominal compute. **[P, verified]**
- Wired (6 October): OpenAI spokesperson says training of the new model began on 28 August. **[P, verified]**
- Scientific American (6 and 8 October): a spokesperson said most results came from a single prompt to a single agent; OpenAI did not release full prompts or run-time details. **[2nd]**
- Repository commits: initial commit 6 October; update 7 October; merge commit fd4aeeb, still HEAD on 10 October. **[P, verified]**
- Acer (@AcerFur; bio: Cambridge pure maths student, previously at OpenAI), 6 October: honour to have been part of the team; saw the model make progress first-hand; the proof should generalise to all unitary Hecke L-functions over any number field; "the method has a barrier at 3/4". **[P, verified]**
- Exception details, compute, duration, whether targeted, process description, model name: **[NF]**.

## Expert reception

- Alex Kontorovich (6 October): if a human had done this it would be an instant Fields Medal. **[P, verified]**
- Jared Duker Lichtman (6 and 8 October): the cubic family appears essential even for zeta; the Section 2 outline is readable; a friend mentioned "amazing numerical coincidences". **[P, verified]**
- Ben Green, Jakob Glas, Tim Santens, Álvaro Lozano-Robledo, via Proofs and Prompts (8–9 October): shocked; thought it out of reach or "science fiction"; "quasi-RH is huge! But it is not RH". **[P, verified]**
- MathOverflow 515849: Will Sawin places 003 among results agreeing with probabilistic heuristics, and notes a third, weaker quasi-RH proof inside the Artin primitive-root paper; Matt Young describes the 11/12 paper as a simplified 7/8 and the Siegel paper as independent; Pace Nielsen is surprised by three proofs with conventional technology. **[P, verified]**
- Hacker News: self-described number theorists call it Fields-level or larger. **[P, not re-checked]**
- Terence Tao: no comment specific to this result found; his 7 October blog post reposts the Association for Human Mathematics statement. **[P, not re-checked]**
- No published assessment found from Heath-Brown, Radziwiłł, Dunn, Goldmakher, Blomer, Sarnak, Soundararajan, Granville or Maynard. **[NF]**

## Independent Lean checks

- Dave Goldblatt: Comparator with OpenAI's configuration accepted; a second run with the nanoda kernel enabled accepted; axioms propext, Classical.choice, Quot.sound; closure 2,924 OpenAI modules (486,490 lines); caveats on single operator, out-of-sandbox build steps, s = 1. **[P, verified]**
- tomoto0: full rebuild of 2,924 modules, 0 errors, 252 minutes; static scan clean; hand checks of several propositions; 66/66 numerical checks; one slack constant; argues the apparatus cannot reach 1/2. **[P, verified]**
- Joseph M. Reilly: Siegel-zero challenge with nanoda passed. **[P, not re-checked]**
- OpenAI's own configuration files disable nanoda. **[P, verified]**

## Advisory group and errors

- Advisory Group on Mathematics and Artificial Intelligence (29 September guidelines): asks for model name, prompts, a summarised chain of thought, time taken and estimated compute cost for each result. **[P, verified]** None was published for family 003.
- history.md (7 October): three Hodge-related manuscripts withdrawn for a sign error; 14 others revised; none in family 003. **[P, verified]**
