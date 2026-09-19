# Evidence Press art direction

## Three distinct jobs

* **Banner:** one image-led, subject-specific composition. Do not duplicate the
  page title, disclaimer or evidence inventory inside the image. Prefer no text;
  a necessary symbol is acceptable. Put explanatory qualifications in accessible
  descriptions or captions. A schematic is not numerical evidence.
* **Explanatory figure:** teach one relationship with legible labels, units and
  a caption. Show actual data only when computed from the declared source.
* **Thumbnail/social card:** a short readable headline, calibrated status and a
  recognisable visual. Do not promote a thumbnail into a page banner.

## Positive references

The original z20, affine-slice and Ramsey covers demonstrate image-led SVG art.
The Navier–Stokes article illustrates editorial artwork, explicitly distinguished
from simulation. The polynomial article illustrates exact plotted geometry.
Choose the approach for the subject, not whichever release was last edited.

## Authoring

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

## Acceptance, before publication

Inspect every changed image in the real page at desktop and 390px mobile width,
and inspect its social-card output. Compare with a positive reference. Reject:

1. text/graphic collisions, clipped labels or lost content after cropping;
2. essential labels unreadable at actual display size;
3. a banner dominated by repeated headline/disclaimer text;
4. a stock motif or decorative chart implying unsupported measurements;
5. an image whose purpose cannot be explained in one sentence.

Record which images and viewports were inspected and any unresolved exception
in the work receipt. Automated tests check geometry, loading and regeneration,
not aesthetic quality; a green build cannot replace looking at the images.
Do not introduce routine presentation notes into public scholarly corrections.

## September 2026 repair boundary

Five recent slide-like release covers were selected for the initial repair:
Cooper–Spencer, quartic inverse coefficients, sharp bi-Lagrangian smoothness,
two-class transposition profiles and the biased-transposition counterexample.
This is not a claim that every historical image has been redesigned or approved.
Articles now retain the full source banner composition on mobile.
