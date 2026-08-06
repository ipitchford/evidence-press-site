#!/usr/bin/env node
/* Renders the YouTube channel banner → thumbs/channel-banner.jpg
 *
 *   node tools/make-banner.js            # the banner
 *   node tools/make-banner.js --guides   # plus a copy with the safe area drawn
 *
 * YouTube crops this image differently on every device, from the full
 * 2560×1440 on a television down to a 1546×423 strip on a phone. Only that
 * centre strip is guaranteed to be seen, so the wordmark, tagline and address
 * live inside it and everything else — motif, gradient, grid — is bleed that
 * some viewers will never see. --guides renders the boundary so the placement
 * can be checked rather than assumed.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'thumbs');
const W = 2560;
const H = 1440;
const SAFE_W = 1546;          /* visible on every device, including phones */
const SAFE_H = 423;
const LIMIT = 6 * 1024 * 1024; /* YouTube rejects channel art above 6 MB */

const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const SITE = CONFIG.baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

/* House colours: the deep teal of the site's own hero band, so the channel
   reads as the site rather than as a third palette alongside the release
   thumbnails. One accent colour throughout. */
const C = {
  from: '#0a2c28', to: '#134e4a', glow: '#0f766e',
  ink: '#f0fdfa', dim: '#9fd8ce', accent: '#fbbf24', line: '#2dd4bf'
};

/* The braid: parallel paths that cross, one of them picked out in the accent
   colour. Carried over from the previous banner — it is the mark people have
   already seen, and there is no reason to spend the recognition. */
const braid = (flip) => `
<svg width="430" height="210" viewBox="0 0 430 210" fill="none" xmlns="http://www.w3.org/2000/svg"
     style="transform:scaleX(${flip ? -1 : 1})">
  <path d="M0 18 H150 C215 18 215 62 285 62 H430" stroke="${C.ink}" stroke-opacity=".22" stroke-width="2"/>
  <path d="M0 62 H150 C215 62 215 18 285 18 H430" stroke="${C.accent}" stroke-opacity=".85" stroke-width="2.5"/>
  <path d="M0 128 H160 C220 128 220 172 290 172 H430" stroke="${C.ink}" stroke-opacity=".18" stroke-width="2"/>
  <path d="M0 172 H160 C220 172 220 128 290 128 H430" stroke="${C.line}" stroke-opacity=".45" stroke-width="2"/>
</svg>`;

const page = (guides) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;
  background:linear-gradient(112deg, ${C.from} 0%, ${C.to} 72%, ${C.glow} 128%);
  font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;color:${C.ink}}
.grid{position:absolute;inset:0;opacity:.15;
  background-image:linear-gradient(${C.ink} 1px,transparent 1px),linear-gradient(90deg,${C.ink} 1px,transparent 1px);
  background-size:80px 80px;
  mask-image:radial-gradient(ellipse at 50% 50%,#000 22%,transparent 72%)}
.vig{position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 50%, ${C.glow}22 0%, transparent 58%)}

/* bleed: only desktop and television viewers see these */
.motif{position:absolute;top:50%;transform:translateY(-50%);opacity:.9}
.motif.l{left:60px}
.motif.r{right:60px}

/* the strip every viewer sees */
.safe{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  width:${SAFE_W}px;height:${SAFE_H}px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.lockup{display:flex;align-items:center;gap:30px}
.badge{width:96px;height:96px;border-radius:22px;background:${C.from};
  border:2px solid ${C.accent}66;display:flex;align-items:center;justify-content:center;
  font-size:56px;color:${C.accent};line-height:1}
h1{font-size:104px;line-height:1;letter-spacing:-.012em;font-weight:700}
.rule{width:520px;height:2px;background:${C.accent};opacity:.75;margin:34px 0 30px}
.tag{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:30px;
  line-height:1.45;color:${C.dim};max-width:1400px}
.site{margin-top:26px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:26px;letter-spacing:.19em;color:${C.accent}}

${guides ? `.guide{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  outline:3px dashed #ff4d6d;width:${SAFE_W}px;height:${SAFE_H}px;z-index:9}
.guide::after{content:"SAFE AREA 1546×423 — visible on all devices";position:absolute;
  top:-42px;left:0;color:#ff4d6d;font-family:ui-monospace,Menlo,monospace;font-size:22px;letter-spacing:.1em}
.guide2{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  outline:3px dashed #60a5fa;width:2560px;height:423px;z-index:9}
.guide2::after{content:"DESKTOP STRIP 2560×423";position:absolute;bottom:-42px;right:0;
  color:#60a5fa;font-family:ui-monospace,Menlo,monospace;font-size:22px;letter-spacing:.1em}` : ''}
</style></head><body>
<div class="grid"></div><div class="vig"></div>
<div class="motif l">${braid(false)}</div>
<div class="motif r">${braid(true)}</div>
${guides ? '<div class="guide2"></div><div class="guide"></div>' : ''}
<div class="safe">
  <div class="lockup"><div class="badge">E</div><h1>${CONFIG.siteName}</h1></div>
  <div class="rule"></div>
  <div class="tag">Press releases for new research — published with the evidence attached.<br>
    Every release explains one paper twice, and says exactly what has and has not been checked.</div>
  <div class="site">${SITE}</div>
</div>
</body></html>`;

(async () => {
  const withGuides = process.argv.includes('--guides');
  fs.mkdirSync(OUT, { recursive: true });

  const { chromium } = require('playwright');
  const browser = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME
    ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const tab = await browser.newPage({ viewport: { width: W, height: H } });

  const shots = [['channel-banner.jpg', false]];
  if (withGuides) shots.push(['channel-banner-guides.jpg', true]);

  for (const [name, guides] of shots) {
    await tab.setContent(page(guides), { waitUntil: 'networkidle' });
    const file = path.join(OUT, name);
    await tab.screenshot({ path: file, type: 'jpeg', quality: 94 });
    const bytes = fs.statSync(file).size;
    if (bytes > LIMIT) throw new Error(`${name}: ${(bytes / 1048576).toFixed(2)} MB exceeds YouTube's 6 MB limit`);
    console.log(`banner: ${path.relative(ROOT, file)} (${W}×${H}, ${(bytes / 1024).toFixed(0)} kB)`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
