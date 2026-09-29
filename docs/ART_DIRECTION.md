# Evidence Press art direction

## Three distinct jobs

* **Banner:** one scientifically informative and beautiful, subject-specific
  composition. Teach a result, structure or mechanism through the image itself.
  Concise explanatory labels, symbols and values are welcome when they help;
  do not duplicate the page title, disclaimer or evidence inventory. Keep
  essential scope distinctions visible, with fuller qualifications in accessible
  descriptions or captions. A schematic is not numerical evidence.
* **Explanatory figure:** teach one relationship with legible labels, units and
  a caption. Show actual data only when computed from the declared source.
* **Thumbnail/social card:** a short readable headline, calibrated status and a
  recognisable visual. Do not promote a thumbnail into a page banner.

## Positive references — the house benchmark

User-selected on 28 September 2026: preserve the combination of information and
visual craft already achieved by these covers. Inspect one relevant reference
before authoring, not the whole catalogue. These are design references, not
independent endorsements of their scientific claims.

| Reference | What to learn from it |
| --- | --- |
| [48-vertex cubic counterexample](../assets/art/txgraffiti-order48-successor.svg) | An intricate exact graph balanced with the immediately readable `50 → 48` and the invariant comparison; detail supports a clear hierarchy. |
| [Finite-sample affine diversification](../assets/art/finite-sample-affine-diversification.svg) | The uncertainty region and contrasting conclusions carry the explanation; colour, restrained labels and spacing make it readable. |
| [Combined support and moment atlas](../assets/art/cyclicity-support-fusion-atlas.svg) | A source-backed sequence of mathematical objects becomes a coherent composition, rather than unrelated decorative motifs. |

The original z20, affine-slice and Ramsey covers demonstrate image-led SVG art.
The Navier–Stokes article illustrates editorial artwork, explicitly distinguished
from simulation. The polynomial article illustrates exact plotted geometry.
Choose the approach for the subject, not whichever release was last edited.

## Authoring

Before drawing, complete **“This image helps the reader understand…”** with one
specific relationship and its source (theorem, formula, data or worked example).
Select the closest approved reference and adapt its design principles, not its
scientific content. Use house typography and palette, clear hierarchy, generous
spacing and deliberate contrast. Vary layouts with the subject; do not impose
one panel template. Depth, lighting and texture are optional tools, not a quota
for 3D effects or a substitute for information. Move dense technical detail into
an inline figure instead of making the banner a miniature slide deck.

Use the existing deterministic tools for exact diagrams. Use editorial image
generation when appropriate and available within the authorised budget; never
invent mathematical data. No additional paid service is required.

The new image-led compositions live in `tools/art-direction.js`; existing
generators remain supported. Vary composition and accents within the brand:
ordered objects, curves, networks, paired structures and trajectories are
different visual grammars, not a mandatory left-diagram/right-text template.
Keep fine detail secondary to a recognisable main form. Avoid needless panels,
badges, pseudo-3D, glow and scientific decoration unrelated to the subject.

Run `node tools/make-art.js <slug>` for only the changed covers, then regenerate
their Open Graph cards. Preserve existing thumbnail headlines/status unless
separately redesigning those assets. Never edit generated files alone.

## Acceptance, within existing media QA

### Fit and colour are shared contracts

Catalogue banners use the same native 3:1 frame in every card, including the
newest card. Never stretch the first card to 6:1, crop scientific labels, or add
slug-specific CSS fitting exceptions. The homepage uses equal-width cards.

Background families rotate through indigo, oxblood, petrol, bronze, plum and
slate via `tools/banner-palettes.js`. `make-art.js` saves each new assignment
in `data/BANNER_PALETTES.json`; commit it with the generated art. Saved choices
do not change when releases are reordered or rebuilt. The frozen legacy list
preserves unchanged historical artwork; never extend it to bypass the new-art
gate. Bespoke generators must use the same palette resolver. Foreground colours
can encode mathematical distinctions: do not recolour those merely for variety.
Reconcile concurrent palette allocations before merging so successive new
assignments differ. Regenerate only changed covers and their OG previews.

The normal build rejects missing/stale new palette assignments, and the existing
art test rejects a return to the first-card crop. In the existing browser pass,
inspect the **homepage itself**, not only the release page or an isolated image,
at 1440px and 390px. Verify full composition, edge-to-edge fit and varied recent
backgrounds. Include the first card; an image loading successfully is not a fit
test. These checks supplement, not replace, the two visual verdicts below.

Inspect every changed banner at full size, at its actual catalogue-card size,
and in the real page at desktop and 390px mobile width; inspect its social card
too. Compare with the selected reference. **Two separate verdicts must pass:**

* **Scientific usefulness:** the reader can identify the objects and learn a
  source-backed relationship from image and caption; geometry, labels, numbers,
  arrows and qualifications are accurate. No invented data or implied dynamics,
  causality, stability or certainty. Captions cannot rescue an empty stock image.
* **Visual quality:** polished composition, recognisable main form, balanced
  colour, typography and negative space. It teaches something when enlarged and
  remains visually coherent and attractive at card size. Essential labels stay
  legible; attractive rendering does not excuse missing information.

An accurate but clumsy diagram fails; a beautiful but empty picture fails.
Reject:

1. text/graphic collisions, clipped labels or lost content after cropping;
2. essential labels unreadable at actual display size;
3. a banner dominated by repeated headline/disclaimer text;
4. a stock motif or decorative chart implying unsupported measurements;
5. an image whose purpose cannot be explained in one sentence.

In the existing media/work receipt record the one-sentence brief and source,
selected reference, inspected assets/viewports, and separate short verdicts for
scientific usefulness and visual quality. Repair failures before publication;
an unresolved failure is not a pass. Add no separate report, reviewer panel,
paid tool requirement or extra review round. Automated tests check geometry,
loading and regeneration, not scientific usefulness or aesthetic quality; a
green build cannot replace looking at the images.
Do not introduce routine presentation notes into public scholarly corrections.
Apply prospectively to new or changed banners. This does not authorise a mass
redesign, regeneration of unchanged media or reopening research/DOI deposits.

## September 2026 repair boundary

Five recent slide-like release covers were selected for the initial repair:
Cooper–Spencer, quartic inverse coefficients, sharp bi-Lagrangian smoothness,
two-class transposition profiles and the biased-transposition counterexample.
This is not a claim that every historical image has been redesigned or approved.
Articles now retain the full source banner composition on mobile.
