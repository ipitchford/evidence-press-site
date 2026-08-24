#!/usr/bin/env node
/* Renders YouTube thumbnails (2560×1440, JPEG) to both the repository and
 * the maintainer's central thumbnail library.
 *
 * Run at authoring time (needs Playwright + Chromium):
 *   node tools/make-thumb.js                     # every release
 *   node tools/make-thumb.js erdos-848-all-n     # just one
 *   node tools/make-thumb.js --missing            # only missing repo files
 *   node tools/make-thumb.js --check              # no rendering; CI-safe
 *
 * The committed copy lives in thumbs/ rather than assets/ because these are
 * for YouTube, not for the site: assets/ is copied wholesale into dist/ and
 * would publish them. Every render is also mirrored to ~/thumbs (or
 * EVIDENCE_PRESS_THUMBNAIL_DIR), giving the maintainer one upload-ready folder
 * without sacrificing repository provenance.
 *
 * Design rules, learned from the first thumbnail in this family:
 *   - The headline must survive being 210px wide in a YouTube sidebar, so it
 *     is short, huge, and carries one accent phrase.
 *   - The hero panel states the actual result. A thumbnail for a mathematics
 *     release should show the mathematics, not a stock motif.
 *   - Nothing important goes in the bottom-right: YouTube stamps the duration
 *     badge there.
 *   - Claim discipline applies to artwork too. These releases are unrefereed
 *     candidates and the thumbnails say so; no thumbnail may imply a result
 *     is settled when the release itself does not.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'thumbs');
const CENTRAL_OUT = process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || path.join(os.homedir(), 'thumbs');
const W = 1280;
const H = 720;
const LIMIT = 2 * 1024 * 1024;   /* YouTube rejects thumbnails above 2 MB */

const PALETTES = {
  /* Warm, classical — number theory. */
  oxblood: {
    from: '#2b0a17', to: '#7c1d42', glow: '#b91c5c',
    ink: '#fff1f2', dim: '#f9a8c4', accent: '#fbbf24', rule: '#e11d6b',
    panel: 'rgba(255,241,242,.06)', panelEdge: 'rgba(251,191,36,.42)'
  },
  /* Cool, structural — algebraic geometry. */
  pine: {
    from: '#04231e', to: '#0a5348', glow: '#0f766e',
    ink: '#ecfdf5', dim: '#7fd8c4', accent: '#fbbf24', rule: '#2dd4bf',
    panel: 'rgba(236,253,245,.06)', panelEdge: 'rgba(45,212,191,.42)'
  },
  /* Deep blue — computation and verification. */
  cobalt: {
    from: '#071a3d', to: '#164e8a', glow: '#2563eb',
    ink: '#eff6ff', dim: '#93c5fd', accent: '#fde047', rule: '#60a5fa',
    panel: 'rgba(239,246,255,.07)', panelEdge: 'rgba(253,224,71,.42)'
  },
  /* Purple — synthesis and conceptual work. */
  aubergine: {
    from: '#21102f', to: '#633177', glow: '#9333ea',
    ink: '#faf5ff', dim: '#d8b4fe', accent: '#facc15', rule: '#c084fc',
    panel: 'rgba(250,245,255,.07)', panelEdge: 'rgba(250,204,21,.42)'
  },
  /* Burnished brown — history, institutions and applied work. */
  bronze: {
    from: '#2b1608', to: '#7c3f12', glow: '#c2410c',
    ink: '#fff7ed', dim: '#fdba74', accent: '#fde047', rule: '#fb923c',
    panel: 'rgba(255,247,237,.07)', panelEdge: 'rgba(253,224,71,.42)'
  },
  /* Dark cyan — policy and empirical identification. */
  lagoon: {
    from: '#06202b', to: '#0e5a6f', glow: '#0891b2',
    ink: '#ecfeff', dim: '#a5f3fc', accent: '#facc15', rule: '#22d3ee',
    panel: 'rgba(236,254,255,.07)', panelEdge: 'rgba(250,204,21,.42)'
  }
};

const PALETTE_ROTATION = ['pine', 'oxblood', 'cobalt', 'aubergine', 'bronze', 'lagoon'];

/* One spec per video. `hero` is raw HTML so each release can state its own
   result in its own notation. */
const SPECS = {
  'txgraffiti-order48-successor': {
    palette: 'cobalt',
    kicker: ['RESEARCH RELEASE · 24 AUGUST 2026', 'GRAPH THEORY · V0.1.0-CANDIDATE'],
    head: ['A smaller', '<em>counterexample.</em>'],
    headSize: 72,
    sub: 'One exact 48-vertex cubic graph lowers the candidate-order upper bound, with a regenerated proof tree and explicit non-claims.',
    tag: 'CERTIFICATE-BACKED · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">candidate-order upper bound</div>
      <div class="eq"><span class="hl">50 → 48</span></div>
      <div class="note"><b>μ⋆ = 15 &lt; 16 = i</b><br>437,188-node exclusion tree</div>
      <div class="eq-foot">global minimality and uniqueness remain open</div>`
  },
  'exact-low-length-recht-re-inequalities': {
    palette: 'cobalt',
    kicker: ['CORRECTED RESEARCH RELEASE · 21 AUGUST 2026', 'RANDOM RESHUFFLING · V1.1.1-CANDIDATE'],
    head: ['One sampler.', '<em>Different answers.</em>'],
    headSize: 70,
    sub: 'Exact matrix inequalities meet a metric-aware theory of mean iterates, quadratic risk, fresh reshuffling and single shuffle.',
    tag: 'TWO-PAPER EXACT CANDIDATE · UNREFEREED',
    hero: `
      <div class="eq-label">same rational endpoint · opposite rankings</div>
      <div class="eq eq-sm">mean proxy: <span class="hl">RR worse</span><br>Gram risk: <span class="hl">RR better</span></div>
      <div class="note"><b>All fresh epochs certified.</b><br>Single shuffle wins after epoch one at the endpoint.</div>
      <div class="eq-foot">metric · protocol · stepsize · horizon</div>`
  },
  'cyclicity-support-fusion-atlas': {
    palette: 'lagoon',
    kicker: ['COMBINED RESEARCH SUCCESSOR · 21 AUGUST 2026', 'PERIODS AND MOMENTS · V0.7.0-CANDIDATE'],
    head: ['One phase.', '<em>Every amplitude.</em>'],
    headSize: 68,
    sub: 'Inverse support controls polynomial amplitudes and zero-cycles; low-rank factors classify endpoint moments; local inverse channels govern Laurent residues.',
    tag: 'UNREFEREED THEOREM CANDIDATE · NAMED IMPORTS',
    hero: `
      <div class="eq-label">primitive-amplitude support</div>
      <div class="eq eq-sm">q(P,A dx) = <span class="hl">|Σ(P;G)|</span></div>
      <div class="note"><b>rank zero ⇔ G ∈ C[P]</b><br>endpoint atlas for q(P) ≤ 3<br>exact Laurent local channel</div>
      <div class="eq-foot">specified-input criterion · no finite all-Laurent atlas</div>`
  },
  'finite-sample-affine-diversification': {
    palette: 'lagoon',
    kicker: ['RESEARCH RELEASE · 21 AUGUST 2026', 'PHYLOGENETICS · V0.3.0-CANDIDATE-R2'],
    head: ['Signal uncertainty.', 'Decision <em>honesty.</em>'],
    headSize: 66,
    sub: 'An exact fixed-stem confidence set is propagated through an affine identified set to three-valued decisions, with the failed CRABS utility gate preserved.',
    tag: 'UNREFEREED CANDIDATE · CONDITIONAL MODEL',
    hero: `
      <div class="eq-label">frozen CRABS utility gate</div>
      <div class="eq eq-sm"><span class="hl">532 / 3,840</span> = 13.854%</div>
      <div class="note"><b>H4 FAILED below 20%.</b><br>240/240 returned primary clouds missed an endpoint; 60 more were structural censors.</div>
      <div class="eq-foot">endpoint incompleteness ≠ broad decision utility</div>`
  },
  'wales-20mph-casualty-attribution': {
    palette: 'auto',
    kicker: ['RESEARCH RELEASE · 11 AUGUST 2026', 'POLICY IDENTIFICATION · V1.0.0'],
    head: ['A 28% fall.', '<em>Still not a causal effect.</em>'],
    headSize: 62,
    sub: 'The published aggregate is reproducible. The effect on roads that actually changed is not identified — not even in sign.',
    tag: 'CONSTRUCTIVE COUNTEREXAMPLE · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">same observed aggregate</div>
      <div class="eq eq-sm">2,402 → <span class="hl">1,725</span></div>
      <div class="note">Compatible affected-road effects:<br><b>−50% · 0% · +100%</b></div>
      <div class="eq-foot">hypothetical worlds · not estimates or bounds</div>`
  },
  'sfs-identifiability-audit': {
    palette: 'auto',
    kicker: ['CORRECTED RESEARCH RELEASE · 20 AUGUST 2026', 'POPULATION GENETICS · V0.3.3'],
    head: ['The same spectrum.', '<em>Opposite histories.</em>'],
    headSize: 68,
    sub: 'Two positive histories have the same exact finite expected SFS — but opposite values for one sharp calendar-window target.',
    tag: 'EXACT COLLISION · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">same exact expected SFS</div>
      <div class="eq eq-sm"><span class="hl">0.441</span> &lt; 1 &lt; <span class="hl">1.794</span></div>
      <div class="note"><b>One calendar target says depression; the other says expansion.</b> The observation cannot choose.</div>
      <div class="eq-foot">target-specific theorem · no human-bottleneck verdict</div>`
  },
  'certified-commitment-horizons': {
    palette: 'auto',
    kicker: ['REVISED RESEARCH RELEASE · 24 AUGUST 2026', 'DYNAMIC LOT SIZING · V3.0.0-CANDIDATE'],
    head: ['When does a plan', '<em>have to change?</em>'],
    headSize: 64,
    sub: 'Exact-rational commitment horizons, a repaired classical-model bridge and local optimal-face witnesses for forecast revisions.',
    tag: 'EXACT CERTIFICATES · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">safe lower certificate · exact boundary</div>
      <div class="eq eq-sm">ρ<sub>frozen</sub> = <span class="hl">3/2</span><br>ρ<sub>strong</sub> = <span class="hl">2</span></div>
      <div class="note"><b>At the nearest finite loss:</b><br>two optimal paths differ on one divergence–remergence interval.</div>
      <div class="eq-foot">classical bridge · exact code · witnesses · replay</div>`
  },

  'certified-two-item-jrp': {
    palette: 'auto',
    kicker: ['RESEARCH RELEASE · 8 AUGUST 2026', 'JOINT REPLENISHMENT · V1.2.0'],
    head: ['Two items.', 'One exact <em>gap.</em>'],
    headSize: 72,
    sub: 'Shared ordering costs make periodic schedules interact arithmetically. Exact certificates determine the sharp two-item independent-cap relaxation gap.',
    tag: 'EXACT CERTIFICATES · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">two independent frequency caps</div>
      <div class="eq eq-sm">Γ<sub>(2,□)</sub> = <span class="hl">γ</span><br>γ ≈ <span class="hl">1.11188959394</span></div>
      <div class="note">The exact feasible policy can cost up to <b>11.19% more</b> than the relaxation benchmark in the sharp two-item case. The unrestricted multi-item gap remains open.</div>
      <div class="eq-foot">finite exact enumeration · 212-cell rational cover · replay receipt</div>`
  },

  'certified-three-item-jrp-gap': {
    palette: 'auto',
    kicker: ['RESEARCH RELEASE · 22 AUGUST 2026', 'JOINT REPLENISHMENT · V0.3.1'],
    head: ['Three items.', 'A larger exact <em>gap.</em>'],
    headSize: 66,
    sub: 'A finite exact oracle separates the three-item lower bound from the two-item endpoint—and hands logistics teams a gated stress test, not a savings claim.',
    tag: 'EXACT CERTIFICATES · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">primitive calendar (3, 3, 2)</div>
      <div class="eq eq-sm">Γ<sub>(3,□)</sub> ≥ <span class="hl">1.1487291465</span></div>
      <div class="note"><b>49,981 primitive triples</b> plus every boundary regime and a strict tail certificate. The 14.8729% model gap is not an operational saving.</div>
      <div class="eq-foot">paper · exact archive · verifier · logistics field gates</div>`
  },

  'erdos-848-all-n': {
    palette: 'auto',
    kicker: ['PRESS RELEASE · 28 JULY 2026', 'ERDŐS PROBLEM 848 · V0.1'],
    head: ['An exact answer', 'for <em>every N</em>'],
    sub: 'The Erdős–Sárközy extremal problem, determined by certificate from the smallest cases all the way out to the asymptotic range.',
    tag: 'CERTIFICATE-BACKED · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">for every positive integer N</div>
      <div class="eq">f(N) = <span class="hl">⌊(N+18)/25⌋</span></div>
      <div class="bars">
        <div class="bar"><span style="width:22%"></span><b>1 → 10<sup>8</sup></b><i>colouring certificates</i></div>
        <div class="bar"><span style="width:41%"></span><b>10<sup>8</sup> → 10<sup>9</sup></b><i>structural decomposition</i></div>
        <div class="bar"><span style="width:60%"></span><b>10<sup>9</sup> → 10<sup>12</sup></b><i>short-shift envelopes</i></div>
        <div class="bar"><span style="width:79%"></span><b>10<sup>12</sup> → 2.64·10<sup>17</sup></b><i>rank envelopes</i></div>
        <div class="bar"><span style="width:100%"></span><b>2.64·10<sup>17</sup> → ∞</b><i>analytic threshold</i></div>
      </div>
      <div class="eq-foot">five overlapping regimes · no gaps</div>`
  },

  'degree-difference-affine-slices': {
    palette: 'auto',
    kicker: ['PRESS RELEASE · 28 JULY 2026', 'BINARY FORMS · V0.1'],
    head: ['The degree-difference', '<em>principle</em>'],
    headSize: 62,
    sub: 'Multiply two binary forms, record their resultant, and the Jacobian determinant collapses to something remarkably clean.',
    tag: 'AFFINE SLICES · KELLER MAPS · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">for Φ<sub>r,s</sub>(A, B) = (AB, Res(A, B))</div>
      <div class="eq eq-sm">det DΦ<sub>r,s</sub> =<br>(−1)<sup>s(r+1)</sup> <span class="hl">(r − s)</span> · Res(A,B)<sup>2</sup></div>
      <div class="note">One scalar governs the whole Jacobian: the
        <b>difference of the degrees</b>. When r&nbsp;=&nbsp;s it vanishes
        identically, whatever A and B are.</div>
      <div class="eq-foot">and the affine slices where Jacobian-conjecture questions live</div>`
  },

  'irreducible-pushforwards-quartic-transitions': {
    palette: 'auto',
    kicker: ['PRESS RELEASE · 1 AUGUST 2026', 'FURTER’S R(3) · V1.0.0'],
    head: ['What survives', 'a <em>failed proof?</em>'],
    sub: 'An attack on Furter’s R(3) stalled. Two of the methods built for it are proved, standalone and reusable elsewhere; the conjecture itself remains open.',
    tag: 'PUSHFORWARDS · QUARTIC TRANSITIONS · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">for the constrained quartic transition</div>
      <div class="eq">det = (9b/64) ·<br><span class="hl">(−3K<sup>3</sup> + K + 3b<sup>2</sup>)</span></div>
      <div class="note">Exact, not asymptotic. It vanishes on the aligned
        curve, giving <b>rank two away from the origin and rank one at
        it</b>.</div>
      <div class="eq-foot">and a divisor criterion forcing one reduced closed point upstairs</div>`
  },

  'reducible-incidence-divisors': {
    palette: 'auto',
    kicker: ['PRESS RELEASE · 28 JULY 2026', 'BINARY FORMS · V1.0'],
    head: ['When a divisor', '<em>breaks apart</em>'],
    headSize: 64,
    sub: 'Exactly when a natural family of incidence divisors splits into components — and a screening theorem narrowing where Jacobian-conjecture behaviour could live.',
    tag: 'TANGENT DEVELOPABLE · AFFINE SLICES · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">adjacent degrees (m, m+1), m ≥ 2</div>
      <div class="eq eq-sm">D<sub>ℓ</sub> is reducible ⇔<br>[ℓ] on the <span class="hl">tangent developable</span><br>of the rational normal curve</div>
      <div class="note">Three components on the curve, two on its first
        jets, <b>irreducible</b> beyond — one locus decides.</div>
      <div class="eq-foot">and a screening theorem: the affine slice is never A<sup>2m+1</sup></div>`
  },

  'smooth-point-certificates-polydegree-containments': {
    palette: 'auto',
    kicker: ['RESEARCH RELEASE · 9 AUGUST 2026', 'POLYDEGREE CONTAINMENTS · V0.4.1'],
    head: ['A determinant', 'becomes <em>geometry</em>'],
    headSize: 64,
    sub: 'A Jacobian interpretation turns an auxiliary algebraic test into a smooth-point certificate, with exact replay and explicit open limits.',
    tag: 'SMOOTH-POINT CERTIFICATE · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">Lewis–Perry–Straub determinant</div>
      <div class="eq eq-sm">a<sub>d,e</sub> = (−1)<sup>e</sup><br><span class="hl">det D(g<sub>d</sub>, …, g<sub>d+e−1</sub>)</span></div>
      <div class="note">On the partial zero locus: find one <b>smooth point</b> that avoids the next coefficient hypersurface.</div>
      <div class="eq-foot">proved identities · exact finite evidence · all-d affine theorem still open</div>`
  },

  'full-e3-column-polydegree-conjecture': {
    palette: 'auto',
    kicker: ['RESEARCH RELEASE · 12 AUGUST 2026', 'POLYDEGREE CONJECTURE · V0.1.0'],
    head: ['The full e = 3 column.', '<em>Every degree.</em>'],
    headSize: 64,
    sub: 'A smooth-point criterion, Fourier limits, exact finite checks and 97,033 Arb certificates join into one gap-free candidate proof.',
    tag: 'PRODUCER-SIDE REPLAY · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">candidate theorem · every integer d ≥ 2</div>
      <div class="eq eq-sm">𝒢<sub>(d+3)</sub> ⊆ <span class="hl" style="text-decoration:overline">𝒢<sub>(d,4)</sub></span></div>
      <div class="note">Exact symbolic and finite-field checks, interval certificates and a rational eventual envelope cover <b>all cases with no gaps</b>.</div>
      <div class="eq-foot">not independently rerun · not formally verified</div>`
  },

  'full-e4-polydegree-column': {
    palette: 'pine',
    kicker: ['RESEARCH RELEASE · 23 AUGUST 2026', 'POLYDEGREE CONJECTURE · V0.1.0-CANDIDATE'],
    head: ['The full e = 4 column.', '<em>Every degree.</em>'],
    headSize: 62,
    sub: 'An exact residue, 14,985 outward-rounded certificates and a uniform Fourier envelope form one gap-free candidate proof.',
    tag: 'PRODUCER-SIDE REPLAY · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">candidate theorem · every integer d ≥ 2</div>
      <div class="eq eq-sm">𝒢<sub>(d+4)</sub> ⊆ <span class="hl" style="text-decoration:overline">𝒢<sub>(d,5)</sub></span></div>
      <div class="note"><b>Four residue classes.</b><br>Exact branch · finite FLINT/Arb bridge · analytic tail from m = 5000.</div>
      <div class="eq-foot">not Furter R(3) · not monotone rigidity · not JC2 or HC4</div>`
  },

  's6-extension-results-candidate': {
    palette: 'cobalt',
    kicker: ['RESEARCH RELEASE · 24 AUGUST 2026', 'COMPLEX GEOMETRY · V0.1.0-CANDIDATE'],
    head: ['Interesting extensions.', '<em>One gate remains.</em>'],
    headSize: 62,
    sub: 'Exact arithmetic, a conductor criterion and conditional Hodge and deformation calculations around a claimed complex structure on S6.',
    tag: 'UNREFEREED CANDIDATE · SOURCE CONSTRUCTION UNVERIFIED',
    hero: `
      <div class="eq-label">conditional Hodge candidate</div>
      <div class="eq eq-sm">h<sup>1,1</sup> = <span class="hl">2</span><br>h<sup>1,2</sup> = <span class="hl">1</span></div>
      <div class="note"><b>First referee target:</b><br>conductor-adjoint nonvanishing</div>
      <div class="eq-foot">exact checks ≠ a verified complex S6</div>`
  },

  'unique-answer-not-identified': {
    palette: 'auto',
    kicker: ['RESEARCH RELEASE · 11 AUGUST 2026', 'IDENTIFICATION SYNTHESIS · V1.0.0-CANDIDATE'],
    head: ['One unique answer.', '<em>Still not identified.</em>'],
    headSize: 62,
    sub: 'A cross-field synthesis of APC models, epidemic surveillance, sign-restricted SVARs, and aerosol–climate calibration.',
    tag: 'FOUR FIELDS · SELECTOR LEDGER · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">the identifying question</div>
      <div class="eq eq-sm">θ ≠ θ′<br><span class="hl">P<sub>θ</sub> = P<sub>θ′</sub></span></div>
      <div class="note">A procedure can return one answer by fixing a default, penalty, rotation, or calibration convention. That can identify the <b>selector</b> without identifying the scientific effect.</div>
      <div class="eq-foot">identified set · selector ledger · eight-dimensional assurance</div>`
  },

  'aggregation-without-sufficiency': {
    palette: 'auto',
    kicker: ['RESEARCH RELEASE · 13 AUGUST 2026', 'IDENTIFICATION · V0.4.0'],
    head: ['The summary is correct.', '<em>The decision can still be wrong.</em>'],
    headSize: 57,
    sub: 'An aggregation licence tests whether a compact macro measure preserves the answer or action someone actually needs.',
    tag: 'AGGREGATION LICENCE · UNREFEREED PREPRINT',
    hero: `
      <div class="eq-label">same reported aggregate</div>
      <div class="eq eq-sm">A(x) = A(x′)<br><span class="hl">T(x) ≠ T(x′)</span></div>
      <div class="note">More precise measurement of A cannot recover information that aggregation discarded. Declare the <b>target, intervention, loss, tolerance, and expiry</b>.</div>
      <div class="eq-foot">economics · fisheries · epidemiology · producer-side checks</div>`
  },

  'bilateral-deficiency-regular-dim': {
    palette: 'auto',
    kicker: ['RESEARCH RELEASE · 9 AUGUST 2026', 'GRAPH THEORY × SAT · V1.0.1'],
    head: ['Bilateral deficiency', '<em>measures the gap</em>'],
    headSize: 62,
    sub: 'Residual SAT optimisation meets independent domination in regular graphs equipped with a dominating induced matching.',
    tag: 'REGULAR-DIM GRAPHS · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">within the stated regular-DIM class</div>
      <div class="eq eq-sm">β(F<sub>G</sub>) = <span class="hl">i(G) − μ*(G)</span></div>
      <div class="note">Connected cubic-DIM families have a <b>linear gap</b>. The order-50 minimum is DIM-qualified — not a claim about all cubic graphs.</div>
      <div class="eq-foot">exact code · finite certificates · partial Lean verification</div>`
  }
};

const escapeHtml = value => String(value == null ? '' : value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const truncate = (value, limit) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1).replace(/\s+\S*$/, '');
  return `${cut || text.slice(0, limit - 1)}…`;
};

const headline = value => {
  const text = truncate(value, 62);
  const words = text.split(/\s+/);
  if (words.length < 3) return [escapeHtml(text)];
  const target = text.length / 2;
  let width = 0;
  let splitAt = 1;
  for (let i = 0; i < words.length - 1; i++) {
    width += words[i].length + (i ? 1 : 0);
    if (Math.abs(width - target) < Math.abs(words.slice(0, splitAt).join(' ').length - target)) splitAt = i + 1;
  }
  return [
    escapeHtml(words.slice(0, splitAt).join(' ')),
    `<em>${escapeHtml(words.slice(splitAt).join(' '))}</em>`
  ];
};

const formatDate = value => {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.valueOf())) return String(value || '').toUpperCase();
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  }).format(date).toUpperCase();
};

const releaseRecords = () => fs.readdirSync(path.join(ROOT, 'papers'), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(ROOT, 'papers', entry.name, 'meta.json')))
  .map(entry => {
    const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', entry.name, 'meta.json'), 'utf8'));
    if (meta.slug !== entry.name) throw new Error(`release directory ${entry.name} disagrees with meta slug ${meta.slug}`);
    return meta;
  })
  .sort((a, b) => String(a.datePublished).localeCompare(String(b.datePublished)) || a.slug.localeCompare(b.slug));

const automaticSpec = (meta, index) => {
  const title = meta.shortTitle || meta.title;
  const topic = truncate((meta.keywords || []).slice(0, 2).join(' × ') || 'RESEARCH', 38).toUpperCase();
  const result = truncate((meta.keyResults || [])[0] || meta.oneLine || meta.abstract, 230);
  const status = String(meta.status || 'unrefereed-candidate').replace(/-/g, ' ').toUpperCase();
  const titleLength = String(title || '').length;
  return {
    palette: PALETTE_ROTATION[index % PALETTE_ROTATION.length],
    kicker: [`RESEARCH RELEASE · ${formatDate(meta.datePublished)}`, `${topic} · V${String(meta.version || '').toUpperCase()}`],
    head: headline(title),
    headSize: titleLength <= 28 ? 70 : titleLength <= 44 ? 60 : 50,
    sub: escapeHtml(truncate(meta.oneLine || meta.abstract, 175)),
    tag: status,
    hero: `
      <div class="eq-label">candidate result · exact scope in the paper</div>
      <div class="hero-title">${escapeHtml(truncate(meta.problem && meta.problem.name || topic, 86))}</div>
      <div class="note">${escapeHtml(result)}</div>
      <div class="eq-foot">paper · evidence package · replay information</div>`
  };
};

const resolvedSpec = (meta, index) => {
  const authored = SPECS[meta.slug];
  const spec = authored ? { ...authored } : automaticSpec(meta, index);
  if (!spec.palette || spec.palette === 'auto') {
    spec.palette = PALETTE_ROTATION[index % PALETTE_ROTATION.length];
  }
  if (!PALETTES[spec.palette]) throw new Error(`${meta.slug}: unknown palette ${spec.palette}`);
  return spec;
};

const jpegDimensions = file => {
  const data = fs.readFileSync(file);
  if (data[0] !== 0xff || data[1] !== 0xd8) throw new Error(`${file}: not a JPEG`);
  let offset = 2;
  while (offset + 8 < data.length) {
    if (data[offset] !== 0xff) { offset++; continue; }
    const marker = data[offset + 1];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = data.readUInt16BE(offset + 2);
    if (length < 2 || offset + length + 2 > data.length) throw new Error(`${file}: malformed JPEG marker`);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
    }
    offset += length + 2;
  }
  throw new Error(`${file}: dimensions not found`);
};

const verifyThumbnail = file => {
  if (!fs.existsSync(file)) throw new Error(`missing thumbnail: ${file}`);
  const bytes = fs.statSync(file).size;
  if (bytes > LIMIT) throw new Error(`${file}: ${(bytes / 1048576).toFixed(2)} MB exceeds YouTube's 2 MB limit`);
  const dimensions = jpegDimensions(file);
  if (dimensions.width !== W * 2 || dimensions.height !== H * 2) {
    throw new Error(`${file}: expected ${W * 2}×${H * 2}, got ${dimensions.width}×${dimensions.height}`);
  }
  return bytes;
};

const page = (spec) => {
  const p = PALETTES[spec.palette];
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;
  background:linear-gradient(118deg, ${p.from} 0%, ${p.to} 78%, ${p.glow} 130%);
  font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;color:${p.ink}}
/* faint measured grid, as on the release pages */
.grid{position:absolute;inset:0;opacity:.16;
  background-image:linear-gradient(${p.ink} 1px,transparent 1px),linear-gradient(90deg,${p.ink} 1px,transparent 1px);
  background-size:64px 64px;mask-image:radial-gradient(ellipse at 30% 45%,#000 30%,transparent 78%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 78% 50%, ${p.glow}26 0%, transparent 62%)}
.wrap{position:absolute;inset:0;padding:52px 60px;display:flex;flex-direction:column;justify-content:space-between}

.top{display:flex;justify-content:space-between;align-items:flex-start}
.brand{display:flex;align-items:center;gap:18px}
.badge{width:60px;height:60px;border-radius:14px;background:${p.from};border:1px solid ${p.panelEdge};
  display:flex;align-items:center;justify-content:center;font-size:34px;color:${p.accent}}
.brand span{font-size:34px;letter-spacing:.01em}
.kicker{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:19px;line-height:1.7;
  letter-spacing:.13em;color:${p.dim};text-align:right}

.mid{display:flex;gap:44px;align-items:center;margin-top:-10px}
.left{flex:1 1 56%;min-width:0}
h1{font-size:${spec.headSize || 76}px;line-height:1.06;font-weight:700;letter-spacing:-.015em}
h1 em{font-style:normal;color:${p.accent}}
.sub{margin-top:22px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:23px;
  line-height:1.45;color:${p.dim};max-width:26em}

.hero{flex:0 0 41%;background:${p.panel};border:1px solid ${p.panelEdge};border-radius:18px;padding:26px 28px}
.eq-label{font-family:ui-monospace,Menlo,monospace;font-size:15px;letter-spacing:.07em;color:${p.dim};margin-bottom:12px}
.eq{font-size:44px;line-height:1.25;letter-spacing:-.01em}
.eq.eq-sm{font-size:31px;line-height:1.35}
.eq .hl{color:${p.accent}}
.eq sup{font-size:.58em;vertical-align:super}
.eq sub{font-size:.62em;vertical-align:sub}
.eq-foot{margin-top:16px;font-family:ui-monospace,Menlo,monospace;font-size:14px;
  letter-spacing:.05em;color:${p.dim};line-height:1.5}
.hero-title{font-size:30px;line-height:1.15;color:${p.accent};margin:4px 0 14px}
.note{margin-top:16px;font-family:system-ui,sans-serif;font-size:17px;line-height:1.45;color:${p.ink}dd}
.note b{color:${p.accent}}
.bars{margin-top:16px;display:flex;flex-direction:column;gap:7px}
.bar{position:relative;font-family:ui-monospace,Menlo,monospace;font-size:12.5px;color:${p.dim};
  display:grid;grid-template-columns:1fr auto;align-items:center;gap:2px 12px;
  padding-bottom:7px;border-bottom:1px solid ${p.panelEdge}}
.bar span{grid-column:1/-1;display:block;height:5px;border-radius:3px;
  background:linear-gradient(90deg,${p.rule},${p.accent});margin-bottom:5px}
.bar b{grid-column:1;color:${p.ink};font-weight:600;letter-spacing:.04em}
.bar i{grid-column:2;font-style:normal;text-align:right}
.bar sup{font-size:.7em;vertical-align:super}

.foot{display:flex;justify-content:space-between;align-items:flex-end}
.tagwrap{display:flex;flex-direction:column;gap:12px}
.rule{width:190px;height:2px;background:${p.accent};opacity:.85}
.tag{font-family:ui-monospace,Menlo,monospace;font-size:17px;letter-spacing:.11em;color:${p.accent}}
.site{font-family:ui-monospace,Menlo,monospace;font-size:17px;letter-spacing:.05em;color:${p.dim};
  /* clear of YouTube's duration badge, which sits bottom-right */
  margin-right:150px}
</style></head><body>
<div class="grid"></div><div class="vig"></div>
<div class="wrap">
  <div class="top">
    <div class="brand"><div class="badge">E</div><span>Evidence Press</span></div>
    <div class="kicker">${spec.kicker.join('<br>')}</div>
  </div>
  <div class="mid">
    <div class="left">
      <h1>${spec.head.join('<br>')}</h1>
      <p class="sub">${spec.sub}</p>
    </div>
    <div class="hero">${spec.hero}</div>
  </div>
  <div class="foot">
    <div class="tagwrap"><div class="rule"></div><div class="tag">${spec.tag}</div></div>
    <div class="site">evidencepress.org</div>
  </div>
</div>
</body></html>`;
};

(async () => {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const missingOnly = args.includes('--missing');
  const unsupported = args.filter(arg => arg.startsWith('--') && !['--check', '--missing'].includes(arg));
  if (unsupported.length) throw new Error(`unsupported option(s): ${unsupported.join(', ')}`);

  const records = releaseRecords();
  const bySlug = new Map(records.map((meta, index) => [meta.slug, { meta, index }]));
  const requested = new Set(args.filter(arg => !arg.startsWith('--')));
  for (const slug of requested) if (!bySlug.has(slug)) throw new Error(`no release for "${slug}"`);
  let selected = records.filter(meta => !requested.size || requested.has(meta.slug));
  if (missingOnly) selected = selected.filter(meta => !fs.existsSync(path.join(OUT, `${meta.slug}.jpg`)));

  const requireCentral = process.env.EVIDENCE_PRESS_REQUIRE_CENTRAL_THUMBS === '1' ||
    (process.platform === 'darwin' && os.homedir() === '/Users/admin');
  if (checkOnly) {
    for (const meta of records) {
      const repoFile = path.join(OUT, `${meta.slug}.jpg`);
      verifyThumbnail(repoFile);
      if (requireCentral) {
        const centralFile = path.join(CENTRAL_OUT, `${meta.slug}.jpg`);
        verifyThumbnail(centralFile);
        if (!fs.readFileSync(repoFile).equals(fs.readFileSync(centralFile))) {
          throw new Error(`${meta.slug}: repository and central thumbnail bytes differ`);
        }
      }
    }
    console.log(`thumb check: ${records.length} releases complete` +
      (requireCentral ? `; central mirror exact at ${CENTRAL_OUT}` : '; central mirror not required on this host'));
    return;
  }

  if (!selected.length) {
    console.log('thumb: nothing to render');
    return;
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(CENTRAL_OUT, { recursive: true });

  const { chromium } = require('playwright');
  const browser = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME
    ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const tab = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });

  for (const meta of selected) {
    const slug = meta.slug;
    const index = bySlug.get(slug).index;
    const spec = resolvedSpec(meta, index);
    await tab.setContent(page(spec), { waitUntil: 'networkidle' });
    const layoutFailures = await tab.evaluate(({ width, height }) => {
      const selectors = ['.brand', '.kicker', 'h1', '.sub', '.hero', '.tag', '.site'];
      return selectors.flatMap(selector => [...document.querySelectorAll(selector)].flatMap(element => {
        const rect = element.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(element);
        const textRect = range.getBoundingClientRect();
        const failures = [];
        if (rect.left < -1 || rect.top < -1 || rect.right > width + 1 || rect.bottom > height + 1) {
          failures.push(`${selector} leaves viewport: ${JSON.stringify({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom })}`);
        }
        if (textRect.left < -1 || textRect.top < -1 || textRect.right > width + 1 || textRect.bottom > height + 1) {
          failures.push(`${selector} text leaves viewport: ` +
            JSON.stringify({ left: textRect.left, top: textRect.top, right: textRect.right, bottom: textRect.bottom }));
        }
        return failures;
      }));
    }, { width: W, height: H });
    if (layoutFailures.length) throw new Error(`${slug}: thumbnail layout failure:\n- ${layoutFailures.join('\n- ')}`);
    const file = path.join(OUT, slug + '.jpg');
    /* JPEG, not PNG: at 2560×1440 a PNG of this artwork lands around 2.0 MB,
       which is YouTube's hard upload limit — a later text edit could silently
       push it over and the upload would be rejected. Quality 94 is visually
       indistinguishable here and an order of magnitude clear of the ceiling.
       YouTube re-encodes every thumbnail anyway. */
    await tab.screenshot({ path: file, type: 'jpeg', quality: 94 });
    const bytes = verifyThumbnail(file);
    const centralFile = path.join(CENTRAL_OUT, path.basename(file));
    fs.copyFileSync(file, centralFile);
    if (!fs.readFileSync(file).equals(fs.readFileSync(centralFile))) throw new Error(`${slug}: central mirror copy mismatch`);
    console.log(`thumb: ${slug} → ${path.relative(ROOT, file)} + ${centralFile} ` +
      `(${W * 2}×${H * 2}, ${(bytes / 1024).toFixed(0)} kB, ${((bytes / LIMIT) * 100).toFixed(0)}% of limit, ${spec.palette})`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
