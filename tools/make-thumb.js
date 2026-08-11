#!/usr/bin/env node
/* Renders YouTube thumbnails (2560×1440, JPEG) → thumbs/<slug>.jpg
 *
 * Run at authoring time (needs Playwright + Chromium):
 *   node tools/make-thumb.js                     # every slug with a spec
 *   node tools/make-thumb.js erdos-848-all-n     # just one
 *
 * Output lives in thumbs/ rather than assets/ because these are for YouTube,
 * not for the site: assets/ is copied wholesale into dist/ and would publish
 * them. Outputs are committed, as with the cover art and OG cards, so the
 * artwork accompanying a release is reproducible from the repository.
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
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'thumbs');
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
  }
};

/* One spec per video. `hero` is raw HTML so each release can state its own
   result in its own notation. */
const SPECS = {
  'sfs-identifiability-audit': {
    palette: 'pine',
    kicker: ['RESEARCH RELEASE · 11 AUGUST 2026', 'POPULATION GENETICS · V0.2.0'],
    head: ['What can a genome’s histogram', '<em>actually prove?</em>'],
    headSize: 60,
    sub: 'An exact identifiability theorem, certified bounds, and a pre-registered audit of the disputed 900,000-year-old human bottleneck.',
    tag: 'CERTIFIED BOUNDS · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">certified verdict, claimants’ own data</div>
      <div class="eq eq-sm">ratio ∈ <span class="hl">[0.16, 0.93]</span></div>
      <div class="note"><b>Depressed, not severe.</b> Certifiably below baseline — and certifiably far above the claimed crash to 0.05–0.1.</div>
      <div class="eq-foot">theorem · protocols · certificates · replay</div>`
  },
  'certified-commitment-horizons': {
    palette: 'pine',
    kicker: ['RESEARCH RELEASE · 8 AUGUST 2026', 'DYNAMIC LOT SIZING · V2.1.2'],
    head: ['How far can a plan', '<em>safely hold?</em>'],
    headSize: 64,
    sub: 'Exact-rational commitment horizons for forecast revisions in the Wagner–Whitin model, with replayable witnesses and explicit limits.',
    tag: 'EXACT CERTIFICATES · UNREFEREED CANDIDATE',
    hero: `
      <div class="eq-label">three-period strict example</div>
      <div class="eq eq-sm">ρ<sub>frozen</sub> = <span class="hl">3/2</span><br>ρ<sub>strong</sub> = <span class="hl">2</span></div>
      <div class="note">The tractable frozen certificate is a safe lower bound — but a partial-prefix certificate can be <b>strictly conservative</b>.</div>
      <div class="eq-foot">paper · exact code · witnesses · replay receipt</div>`
  },

  'certified-two-item-jrp': {
    palette: 'pine',
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

  'erdos-848-all-n': {
    palette: 'oxblood',
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
    palette: 'pine',
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
    palette: 'pine',
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
    palette: 'pine',
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
    palette: 'pine',
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

  'unique-answer-not-identified': {
    palette: 'pine',
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
  }
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
  const requested = new Set(process.argv.slice(2));
  const slugs = Object.keys(SPECS).filter(s => !requested.size || requested.has(s));
  if (!slugs.length) {
    console.error(`No spec for: ${[...requested].join(', ')}. Known: ${Object.keys(SPECS).join(', ')}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  const { chromium } = require('playwright');
  const browser = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME
    ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const tab = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });

  for (const slug of slugs) {
    /* Every thumbnail belongs to a real release: a spec whose slug has no
       paper is a typo, and silently rendering it would produce artwork for
       something that does not exist. */
    const metaPath = path.join(ROOT, 'papers', slug, 'meta.json');
    if (!fs.existsSync(metaPath)) throw new Error(`no release for spec "${slug}" (${metaPath})`);

    await tab.setContent(page(SPECS[slug]), { waitUntil: 'networkidle' });
    const file = path.join(OUT, slug + '.jpg');
    /* JPEG, not PNG: at 2560×1440 a PNG of this artwork lands around 2.0 MB,
       which is YouTube's hard upload limit — a later text edit could silently
       push it over and the upload would be rejected. Quality 94 is visually
       indistinguishable here and an order of magnitude clear of the ceiling.
       YouTube re-encodes every thumbnail anyway. */
    await tab.screenshot({ path: file, type: 'jpeg', quality: 94 });
    const bytes = fs.statSync(file).size;
    if (bytes > LIMIT) throw new Error(`${slug}: ${(bytes / 1048576).toFixed(2)} MB exceeds YouTube's ${(LIMIT / 1048576).toFixed(0)} MB limit`);
    console.log(`thumb: ${slug} → ${path.relative(ROOT, file)} ` +
      `(${W * 2}×${H * 2}, ${(bytes / 1024).toFixed(0)} kB, ${((bytes / LIMIT) * 100).toFixed(0)}% of limit)`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
