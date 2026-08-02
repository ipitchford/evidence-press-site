#!/usr/bin/env node
/* Renders 1200×630 Open Graph card PNGs → assets/og/<slug>.png
 * Run at authoring time (needs Playwright + Chromium): node tools/make-og.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'og');
const requested = new Set(process.argv.slice(2));
fs.mkdirSync(OUT, { recursive: true });

const html = (m, artSvg) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
* { margin:0; box-sizing:border-box; }
body { width:1200px; height:630px; background:#151a1e; font-family: Georgia, 'Times New Roman', serif; position:relative; overflow:hidden; }
.art { position:absolute; inset:0; opacity:.5; }
.art svg { width:1200px; height:630px; }
.art .art-caption { display:none; }
.grad { position:absolute; inset:0; background:linear-gradient(100deg, #151a1eee 38%, #151a1e55 75%, transparent); }
.content { position:absolute; inset:0; padding:64px 70px; display:flex; flex-direction:column; justify-content:space-between; }
.kicker { font-family:system-ui, sans-serif; font-size:22px; letter-spacing:.14em; color:#2dd4bf; font-weight:600; }
h1 { color:#faf7f2; font-size:${m.title.length > 80 ? 46 : 54}px; line-height:1.16; max-width:940px; font-weight:700; }
.foot { font-family:system-ui, sans-serif; font-size:22px; color:#a8a29e; display:flex; gap:28px; }
.foot b { color:#e7e5e4; font-weight:600; }
</style></head><body>
<div class="art">${artSvg}</div>
<div class="grad"></div>
<div class="content">
  <div class="kicker">EVIDENCE PRESS · RESEARCH RELEASE</div>
  <h1>${m.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</h1>
  <div class="foot"><span><b>DOI</b> ${m.doi}</span><span><b>${m.datePublished}</b></span><span>paper · code · evidence</span></div>
</div>
</body></html>`;

(async () => {
  const { chromium } = require('playwright');
  const launchOptions = process.env.EVIDENCE_PRESS_CHROME
    ? { executablePath: process.env.EVIDENCE_PRESS_CHROME }
    : {};
  const b = await chromium.launch(launchOptions);
  const page = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const dirs = fs.readdirSync(path.join(ROOT, 'papers')).filter(d => !d.startsWith('_'));
  for (const d of dirs) {
    const metaPath = path.join(ROOT, 'papers', d, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const m = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const slug = m.slug || d;
    if (requested.size && !requested.has(slug)) continue;
    const artPath = path.join(ROOT, 'assets', 'art', slug + '.svg');
    const art = fs.existsSync(artPath) ? fs.readFileSync(artPath, 'utf8').replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ') : '';
    await page.setContent(html(m, art), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT, slug + '.png') });
    console.log('og:', slug);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
