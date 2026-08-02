#!/usr/bin/env node
/* Renders 1200×630 Open Graph cards for the standalone pages in pages/
 * → assets/og/<name>.png
 * Run at authoring time (needs Playwright + Chromium): node tools/make-page-og.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'og');
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  {
    name: 'observatory',
    kicker: 'EVIDENCE PRESS · RESEARCH PROGRAMME',
    title: 'Policy Identification Observatory',
    sub: 'What the evidence supports · what it does not · which decisions survive',
    foot: ['Identification audits', 'Partial identification', 'Robust decisions'],
    art: 'observatory.svg'
  }
];

const html = p => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
* { margin:0; box-sizing:border-box; }
body { width:1200px; height:630px; background:#151a1e; font-family: Georgia, 'Times New Roman', serif; position:relative; overflow:hidden; }
.art { position:absolute; inset:0; opacity:.5; }
.art svg { width:1200px; height:630px; }
.grad { position:absolute; inset:0; background:linear-gradient(100deg, #151a1eee 38%, #151a1e55 75%, transparent); }
.content { position:absolute; inset:0; padding:64px 70px; display:flex; flex-direction:column; justify-content:space-between; }
.kicker { font-family:system-ui, sans-serif; font-size:22px; letter-spacing:.14em; color:#2dd4bf; font-weight:600; }
h1 { color:#faf7f2; font-size:${p.title.length > 40 ? 62 : 70}px; line-height:1.1; max-width:940px; font-weight:700; }
.sub { font-family:system-ui, sans-serif; font-size:26px; color:#ccfbf1; margin-top:18px; max-width:900px; line-height:1.35; }
.foot { font-family:system-ui, sans-serif; font-size:22px; color:#a8a29e; display:flex; gap:28px; }
.foot span { border-left:3px solid #f59e0b; padding-left:12px; }
</style></head><body>
<div class="art">${p.artSvg}</div>
<div class="grad"></div>
<div class="content">
  <div class="kicker">${p.kicker}</div>
  <div><h1>${p.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</h1><div class="sub">${p.sub}</div></div>
  <div class="foot">${p.foot.map(f => `<span>${f}</span>`).join('')}</div>
</div>
</body></html>`;

(async () => {
  const { chromium } = require('playwright');
  const launchOptions = process.env.EVIDENCE_PRESS_CHROME
    ? { executablePath: process.env.EVIDENCE_PRESS_CHROME }
    : {};
  const b = await chromium.launch(launchOptions);
  const page = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const p of PAGES) {
    const artPath = path.join(ROOT, 'assets', 'art', p.art || '');
    p.artSvg = p.art && fs.existsSync(artPath)
      ? fs.readFileSync(artPath, 'utf8')
        .replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ')
        .replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, '')  // captions belong to the page, not the card
      : '';
    await page.setContent(html(p), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT, p.name + '.png') });
    console.log('og:', p.name);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
