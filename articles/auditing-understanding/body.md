Here is a puzzle. Colour the whole numbers, starting from 1, each either red or blue. Can you do it so that no Pythagorean triple, such as 3, 4 and 5, ends up all one colour?

Marijn Heule, Oliver Kullmann and Victor Marek [showed in 2016](https://doi.org/10.1007/978-3-319-40970-2_15) that you can manage it for every number from 1 to 7,824. Add 7,825 and it becomes impossible. The statement fits in a sentence. The computer proof behind it ran to almost 200 terabytes: far too large for any one person to inspect line by line.

So does anyone understand that theorem? And as AI systems begin to produce proofs, models and predictions of their own, will we soon face results that are simply beyond human understanding?

This essay argues that the question is usually asked too quickly. **"Beyond human understanding" is a claim about minds. It needs evidence about minds.** And before that evidence can count, the test that produced it has to be checked too. A large file, an unfair exam question or one failed lesson can each look like a human limit while being nothing of the kind.

## Two mistakes that mirror each other

Start with the tempting mistake. A result is hard to inspect, so we treat it as if it were beyond question, or beyond us. We can call this the *opacity alibi*: letting "it's too complex to follow" stand in for asking what has actually been shown. The phrase describes a faulty step in reasoning, not anyone's motives.

The opposite mistake is just as real. Suppose a result is well supported, but nobody can tell the story of how it was found. Rejecting it for that reason alone is also an error. A proof can establish a theorem even if the search that found it has been lost.

Both mistakes skip the same job: looking at the particular claim and asking what supports it. The rest of this essay is about how to do that job. It takes three small examples, each showing one way a test can fake a human limit, and then asks what a fair test would look like.

## Trap one: mistaking size for difficulty

Picture a row of light switches. A tiny program answers one question: is an odd number of them on? Mathematicians call this *parity*. With three switches, the program needs just two simple steps, each comparing two values with an operation called exclusive-or.

Now play a trick. Take any extra calculation, do it twice, and combine the two identical copies with exclusive-or. Anything combined with itself this way gives zero, so the pair changes nothing. Add many such pairs and the program grows enormous, yet it still answers the same simple question.

This is not hypothetical arithmetic. In one worked example, a three-switch version padded this way takes 46 steps instead of 2. An eight-switch version takes 529 steps instead of 7. A computer check of every possible switch setting confirms that each padded program gives exactly the same answers as the short one.

The lesson is narrow but important. **The length of one description tells you nothing certain about the shortest possible explanation.** The same goes for the size of a proof file or the number of parameters in an AI model. Those numbers predict how hard a thing is to *read*. They do not, by themselves, measure how hard it is to *understand*.

Return to the Pythagorean triples. That 200-terabyte proof is a real obstacle to checking each step by hand. But understanding how the problem was encoded, how the proof was checked and why its overall design works is already a substantial achievement. That is not the same as remembering every line.

## Trap two: an explanation that only fits the examples

The switch puzzle hides a second trap. Suppose someone offers an explanation: "the program outputs one whenever *any* switch is on."

Show them all switches off, then each switch on by itself, and the explanation fits perfectly. Now turn on two switches. The "any" rule says one. Parity says zero. The explanation was wrong all along; the chosen examples just never exposed it.

How often does it fail? With three switches, it gets 3 of the remaining 4 settings wrong. With eight switches, it fails on 127 of the 247 settings that were never shown.

This matters for AI explanations. A good explanation should survive cases chosen to tell it apart from plausible rivals, not just the cases that made it sound convincing. Being able to repeat an explanation is not the same as being able to spot where it breaks.

Experiments with real people back this up. In [preregistered experiments with 3,800 participants](https://doi.org/10.1145/3411764.3445315), Forough Poursabzi-Sangdeh and colleagues showed people models presented in different ways. Clearer models with fewer features helped people predict what the model would say. But that did not straightforwardly help them decide when to rely on the model, or catch its mistakes.

Other researchers have found that the easy ways of testing explanations can mislead. [Zana Buçinca and colleagues](https://doi.org/10.1145/3377325.3377498) showed that simplified "proxy" tasks and people's own sense of understanding can give a misleading picture of how explanations perform in the decisions they are meant to support. "Easier to follow" and "better able to judge" need separate tests.

## Trap three: the question that has no right answer

The third trap is the most surprising, because here the person who refuses to answer may understand best.

Imagine two lights, X and Y. Every time you look, they agree: both on half the time, both off half the time. Now a question: if you force X on, what happens to Y?

Here are two mechanisms that would produce exactly those observations.

- **X controls Y.** A random coin flip sets X, and Y copies X.
- **Y controls X.** A random coin flip sets Y, and X copies Y.

Watching alone can never tell these apart. They produce identical records forever. But forcing X on gives different results. In the first world, Y always comes on. In the second, forcing X does nothing to Y, which still comes on only half the time.

![Two causal mechanisms side by side. On the left a signal controls X, which controls Y; on the right a signal controls Y, which controls X. Observations match, but forcing X on makes Y always on in the first and on half the time in the second.](/assets/articles/auditing-understanding-causal.svg "A constructed schematic, not experimental data. The two answers hold only if these are the only two mechanisms being considered.")

So if these are the only two possibilities, and all you have is the observations, the honest answer is: "Y is on with probability one-half or one, and the evidence cannot say which." This is a standard result in causal reasoning, set out by [Judea Pearl](https://doi.org/10.1214/09-SS057). It is not a new paradox.

Now picture an exam that secretly decides the first mechanism is correct, and marks "one" as right and everything else as wrong. That exam is not measuring understanding. It is measuring whether you guessed the examiner's hidden choice. The careful candidate who says "it can't be determined" would fail, despite being the one who understood the evidence.

**Before testing whether people understand, test whether the test rewards understanding.** Does it accept a correctly stated uncertainty? Can its own answer key survive scrutiny? A difficult interface or an unfair question should never become evidence of a difficult idea.

## What understanding would actually look like

If size, fluency and exam scores can all mislead, what should we look for instead? A useful approach is to split the single word "understand" into four separate questions.

| Question | What would answer it |
| --- | --- |
| **Is the result supported?** | A proof, certificate or experiment, with its assumptions and anything left unchecked stated plainly. |
| **What could the person see and use?** | The actual explanation, code, tools, time and help they had, not just a claim that the work was "open". |
| **What could they do with it?** | Apply it to a fresh case, repair a false claim, predict the effect of an intervention, or recognise where it stops applying. |
| **How far does the conclusion reach?** | Exactly which people, tasks and conditions were tested, and which were not. |

These are four questions, not four scores to add up. Keeping them apart prevents some common confusions.

- A certificate can show a theorem is true without teaching anyone why.
- An explanation can help a reader without describing how the result was actually found.
- A team using software can show real competence even if no individual could repeat the work unaided. That is still worth knowing, but it is a claim about the team and its tools.

None of this asks every scientist to rebuild every result from scratch. We rely on instruments and colleagues all the time, and rightly. The point is to describe that reliance accurately.

The same caution applies to research on AI itself. Anthropic's 2025 [circuit-tracing work](https://www.anthropic.com/research/tracing-thoughts-language-model) identified particular mechanisms inside one of its models, and was explicit that its findings covered the examples studied. Work like that supports claims about particular mechanisms. It shows neither complete understanding of the model nor that humans could never understand it.

## A failed lesson is not a limit of the species

Suppose, then, that we run a fair test, and nobody passes. Have we found a limit of human understanding?

Not yet. A failure in a study tells us about those people, those materials and those conditions. "No human could ever understand this" is a claim about every person, every possible explanation, every kind of training and every permitted tool. The first does not lead to the second without a lot more argument.

A little statistics makes the gap concrete. Imagine 300 people, sampled independently and tested under identical conditions, and not one succeeds. A [standard calculation](https://doi.org/10.1093/biomet/26.4.404) still leaves room for a success rate of up to about 1% in that population, at the usual 95% confidence level. With 30 people and no successes, the rate could be as high as about 9.5%.

That is a hypothetical calculation, not a real study. And notice what it covers: one population and one test. Change the explanation, the training, the tools or the people, and you are asking a different question.

There is also an asymmetry. Many failures can narrow a careful, limited claim. But a single genuine success can overturn a sweeping claim that nobody could succeed. So the right response to an apparent limit is to go looking for counterexamples: specialists, better notation, new ways of breaking the problem down, teams with tools.

Chess offers a hopeful example. [Lisa Schut and colleagues](https://doi.org/10.1073/pnas.2406675122) extracted concepts from AlphaZero, a chess-playing AI, and tried teaching them to four grandmasters using positions they had not seen. The study was small and its authors noted limitations, including sample size. But it makes one possibility concrete: knowledge found by a machine can become material for human learning, rather than proof that human learning has ended.

Some philosophers have argued for a much stronger idea. [Colin McGinn](https://doi.org/10.1093/mind/XCVIII.391.349) proposed that a kind of mind may be "cognitively closed" to certain properties: its way of forming concepts simply cannot reach them. That deserves serious debate. But it cannot be shown just by making a test hard enough that people fail it.

## Testing the test

These ideas are cheap to state and easy to get wrong in practice. A checklist of four questions could make reviewing slower without making it better. So the approach has to face the same standard it asks of AI claims.

Two experiments would be needed, and neither has been run yet.

1. **What helps people use a result?** Give people different packages: checkable evidence, an explanation, both, or matched comparison material. Then measure two things separately. Can they make good decisions about whether a claim is supported? And can they apply what they learned to fresh problems, once the help is taken away?
2. **Does the structured approach beat ordinary review?** Give reviewers the same evidence, tools and time, with and without the four-question audit. Include flawed work *and* sound work. Catching more errors does not count as progress if it comes from rejecting everything. False alarms, missed errors and time spent all go on the scorecard.

If ordinary review reaches the same decisions more cheaply, the audit should be simplified or dropped. A method that could only ever announce human failure would be badly designed for discovering where understanding really ends.

There is a wider worry, too. [Lisa Messeri and M. J. Crockett](https://doi.org/10.1038/s41586-024-07146-0) have warned that AI can give scientists an illusion of understanding, and can narrow the questions they choose to ask. Testing understanding directly, rather than assuming it, is one way to guard against both.

## What this means now

For anyone publishing, reviewing or reading AI-assisted science, a few habits follow.

- **State exactly what was shown,** and what checked it.
- **Say what a checker does and does not establish.** A verified proof of the wrong statement proves nothing about the right one.
- **Test explanations against cases that could break them,** not only the examples that inspired them.
- **Never turn a missing measurement into a reported failure.** If understanding was not tested, say so.

We may one day meet ideas that resist every explanation we can devise. Nothing here rules that out. But there is a large difference between "we have not yet found a way to teach this" and "this cannot be understood". The first is a research problem worth working on. The second, said too early, is an excuse to stop asking.

*The switch and light examples are constructed illustrations, and their step counts come from simple computer checks, not observations of people. The proposed experiments have not been run, and the audit's usefulness remains untested. This essay was prepared with AI assistance; it is commentary, not a new research result, and has not been externally peer reviewed.*
