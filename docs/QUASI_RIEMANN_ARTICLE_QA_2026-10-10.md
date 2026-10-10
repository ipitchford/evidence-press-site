# Quasi-Riemann article: media and source check (10 October 2026)

Article: `articles/how-a-language-model-proved-quasi-riemann/`. Media generator:
`tools/make-quasi-riemann-article-art.js` (`--check` verifies committed bytes;
run by `node tools/test-articles.js`). Supporting checks:
`docs/article-checks/how-a-language-model-proved-quasi-riemann/`.

## Banner

- **Brief.** This image helps the reader understand that the new zero-free
  region is a band of fixed width, whereas the classical unconditional region
  thins towards Re s = 1 as the height grows.
- **Sources.** Classical region σ ≥ 1 − 1/(5.558691 log t), t ≥ 2
  (Mossinghoff, Trudgian and Yang, arXiv:2212.06867, Theorem 1.3); the
  half-plane Re s > 7/8 (OpenAI Comparator challenge `QuasiRiemannHypothesis`
  at `openai/math` commit `fd4aeeb`); first 100 zero ordinates from
  `mpmath.zetazero(1..100)`, rounded to three decimals.
- **Selected reference.** Finite-sample affine diversification: the regions
  and their contrast carry the explanation.
- **Inspected.** Full size (1,200 px), phone frame (342 px), and in the built
  page at 1,440 px and 390 px.
- **Scientific usefulness: pass.** Coordinates are exact on a logarithmic
  height axis from 2 to 10⁶. The caption says that shading marks what is proved
  at every height. The label for the region between ½ and 7/8 says "no result
  valid at every height" rather than "open", because numerical verification
  covers the whole plotted range. The aqua region's dip below 7/8 for t below
  about 4.2 is real and is stated in the caption and description.
- **Visual quality: pass.** One recognisable form (band against thinning
  sliver), restrained labels, palette `slate` from the site resolver. The
  main label stays legible at phone width; secondary labels are carried by
  the caption.

## Explanatory figures

- **Verification layers** (`quasi-riemann-verification.svg`). Brief: the
  Comparator check links a nine-line challenge to a 2,924-module solution and
  certifies three things; outside reruns and the Evidence Press screen are
  separate, and the paper's prose is not certified. Sources: the challenge and
  configuration files, the closure audit, Goldblatt's and tomoto0's
  repositories. Scientific usefulness: pass. Visual quality: pass after
  shrinking one card label that overran its frame.
- **Route of the 11/12 proof** (`quasi-riemann-route.svg`). Brief: eight
  stages from the Möbius sum to the half-plane, with the three new moves
  marked. Source: the 5 October companion paper (`paper2.tex`), as summarised
  in the article. Logical order only; the discovery order is unrecorded.
  Scientific usefulness: pass. Visual quality: pass.
- Both figures were inspected at 800 px and in the page at 390 px. Small labels
  need zoom on a phone; the adjacent captions and prose carry the distinctions.

## Page

- No horizontal overflow at 390 px on this or any other article page after a
  site-wide rule letting long links wrap in article bodies
  (`.article-page .body a { overflow-wrap: anywhere; }`). Before the rule, full
  reference URLs widened this page to 499 px.
- Display mathematics renders through the existing KaTeX path inside
  scrollable `.math` blocks.

## Independent source review

A separate reviewer, without access to the drafting process, compared the
article with the original essay, the `openai/math` sources at `fd4aeeb` and the
logged evidence. Eight findings were repaired before publication: the count of
Comparator configurations with the second kernel disabled (all but two of 416
at `fd4aeeb`, not "402 of 405"); tomoto0's check described as a rebuild, not a
Comparator run; Jakob Glas's words restored to "broad consensus"; the
"amazing numerical coincidences" remark attributed to a friend quoted by
Lichtman; the tomoto0 bootstrap figure placed in context; "six steps" made
the article's own division; the banner's open-region label; and the checks
link, which needed the supporting commit pushed. Optional refinements adopted:
"squarefree primary n outside a fixed set of excluded primes"; the zero
detector's role in both stages of the 7/8 paper; "lines once comments are
removed"; ε restored in the route figure.

The claim cross-check (`code/crosscheck_claims.py`) passes all twenty claims
against the published article text.

## Narration

- OpenAI `gpt-4o-mini-tts`, `fable`, repository British profile, through the
  bundled speech CLI and `tools/make-article-audio.js`; 13 chunks, 2,009.54
  seconds, 16,076,972 bytes. Audio SHA-256:
  `a9d37ad4277a24a38dd42d0a0c193364b8f4b77e7ee737dcf6011446d5831edc`.
- The transcript reads the full main text and its qualifications, expands
  notation for speech, verbalises both tables, describes the two figures, and
  omits the source list and URLs. Commit hashes are read as dates.
- Every chunk was checked by a local Whisper `small.en` round trip in three
  passes (whole chunk, 20-second pieces, final 25 seconds), with the union of
  passes aligned word by word against the chunk input. The remaining unmatched
  spans are numbers transcribed as digits and the name de la Vallée Poussin.
- Speech synthesis repeatedly dropped short clauses at the ends of long chunks:
  "and that is quadratic", "The fourth is stamina", a section heading, and once
  a digit in "0.00083". One early chunk was also truncated by about a minute.
  The transcript was adjusted without changing meaning (joining two short
  paragraphs, binding headings to their paragraphs, giving the 1/1200 margin
  as a fraction only), and the affected chunks were regenerated and rechecked.
  Each final chunk is a single API output; none is an edited audio unit.
- Chunk speaking rates lie between 15.2 and 16.8 characters per second, which
  rules out further truncation of the kind found in the rejected take.
