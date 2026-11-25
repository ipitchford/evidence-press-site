#!/usr/bin/env node
'use strict';
/* Standard, data-driven release art: banner (assets/art/<slug>.svg), OG card and
 * YouTube-style thumbnail from papers/<slug>/art.json. It replaces writing a
 * bespoke tools/<slug>-art.js per release; bespoke generators remain available
 * for releases whose figure needs a drawn mathematical object.
 *
 * papers/<slug>/art.json:
 *   {
 *     "description": "This image helps the reader understand ... (banner <desc>)",
 *     "kicker": "MATHEMATICS · GRAPHS",          // small caps line, optional
 *     "head": "A 351-vertex counterexample",       // banner headline
 *     "sub": "One sentence stating the result.",   // banner subline, optional
 *     "numbers": [ { "value": "350", "label": "edges per period" } ],  // 1-3 key numbers
 *     "tag": "UNREFEREED CANDIDATE"                // optional
 *   }
 *
 * Every text box is laid out in a fixed grid and its font size is reduced until
 * its conservative width estimate fits that box, so nothing can overflow the
 * 1200x400 banner or the 390px card; an input that cannot fit at the minimum
 * size is refused rather than drawn clipped. All text is XML-escaped.
 *
 * Usage: node tools/release-art.js <slug> [--render INSPECT_DIR] [--no-mirror]
 */
const fs = require('fs');
const path = require('path');
const { bannerSvg, escapeText, wellFormedErrors } = require('./svg-xml');

const W = 1200, H = 400, PAD = 56;
const SANS = 'Arial,Helvetica,sans-serif', SERIF = 'Georgia,serif';
const INK = '#f6f2ea', MUTED = '#d9d3dd', ACCENTS = ['#ffc36b', '#9fd3ff', '#a8e0b0'];
// Conservative advance-width factor (wide glyphs, digits, capitals) per font.
const ADVANCE = { [SANS]: 0.62, [SERIF]: 0.6 };

function fitSize(textValue, family, maxWidth, maxSize, minSize, label) {
  const chars = [...textValue].length;
  for (let size = maxSize; size >= minSize; size -= 1) {
    if (chars * size * ADVANCE[family] <= maxWidth) return size;
  }
  throw new Error(`art.json ${label} is too long to fit its banner box (${chars} characters); shorten it`);
}

function fitWrap(textValue, family, maxWidth, maxSize, minSize, maxLines, label) {
  for (let size = maxSize; size >= minSize; size -= 1) {
    try { return { size, lines: wrap(textValue, family, maxWidth, size, maxLines, label) }; } catch { /* smaller */ }
  }
  throw new Error(`art.json ${label} does not fit in ${maxLines} line(s) at ${minSize}px; shorten it`);
}

function wrap(textValue, family, maxWidth, size, maxLines, label) {
  const words = textValue.split(/\s+/).filter(Boolean), lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if ([...next].length * size * ADVANCE[family] <= maxWidth) line = next;
    else { if (line) lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines || lines.some(l => [...l].length * size * ADVANCE[family] > maxWidth)) {
    throw new Error(`art.json ${label} does not fit in ${maxLines} line(s); shorten it`);
  }
  return lines;
}

const t = (x, y, s, size, color, family = SANS, anchor = 'start', weight = 'normal') =>
  `<text class="og-hide" x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeText(s)}</text>`;

function validateSpec(spec, slug) {
  if (!spec || typeof spec !== 'object') throw new Error(`papers/${slug}/art.json must be an object`);
  for (const key of Object.keys(spec)) {
    if (!['description', 'kicker', 'head', 'sub', 'numbers', 'tag'].includes(key)) throw new Error(`art.json: unknown field ${key}`);
  }
  if (typeof spec.description !== 'string' || spec.description.length < 20) throw new Error('art.json description is required (what the image helps the reader understand)');
  if (typeof spec.head !== 'string' || !spec.head.trim()) throw new Error('art.json head is required');
  if (!Array.isArray(spec.numbers) || spec.numbers.length < 1 || spec.numbers.length > 3) throw new Error('art.json numbers must hold 1-3 entries');
  for (const n of spec.numbers) {
    if (!n || typeof n.value !== 'string' || !n.value.trim() || typeof n.label !== 'string' || !n.label.trim()) {
      throw new Error('art.json numbers entries need string value and label');
    }
  }
  for (const key of ['kicker', 'sub', 'tag']) if (spec[key] !== undefined && typeof spec[key] !== 'string') throw new Error(`art.json ${key} must be a string`);
}

/* Returns { inner, boxes } — boxes are the laid-out text rectangles, exported so
   tests can assert containment independently of the fitting arithmetic. */
function layout(spec) {
  const boxes = [], parts = [];
  const leftW = 660, rightX = PAD + leftW + 36, rightW = W - PAD - rightX;
  const add = (x, y, s, size, color, family, anchor, weight, width) => {
    const w = [...s].length * size * ADVANCE[family];
    const x0 = anchor === 'middle' ? x - w / 2 : x;
    boxes.push({ x0, x1: x0 + w, y0: y - size, y1: y + size * 0.25, width });
    parts.push(t(x, y, s, size, color, family, anchor, weight));
  };
  let y = PAD + 24;
  if (spec.kicker) { const k = fitSize(spec.kicker, SANS, leftW, 17, 11, 'kicker'); add(PAD, y, spec.kicker, k, MUTED, SANS, 'start', 'bold', leftW); y += 22; }
  const { size: headSize, lines: headLines } = fitWrap(spec.head, SERIF, leftW, 40, 26, 2, 'head');
  for (const line of headLines) { y += headSize + 6; add(PAD, y, line, headSize, INK, SERIF, 'start', 'normal', leftW); }
  if (spec.sub) {
    const room = H - PAD - (spec.tag ? 36 : 0) - (y + 14);
    let fitted = null;
    for (let size = 20; size >= 14 && !fitted; size -= 1) {
      const lines = Math.floor(room / (size + 8));
      if (lines >= 1) try { fitted = { size, lines: wrap(spec.sub, SANS, leftW, size, lines, 'sub') }; } catch { /* smaller */ }
    }
    if (!fitted) throw new Error('art.json sub does not fit the banner; shorten it');
    const { size: subSize, lines: subLines } = fitted;
    y += 14;
    for (const line of subLines) { y += subSize + 8; add(PAD, y, line, subSize, MUTED, SANS, 'start', 'normal', leftW); }
  }
  if (spec.tag) { const g = fitSize(spec.tag, SANS, leftW, 15, 11, 'tag'); add(PAD, H - PAD, spec.tag, g, MUTED, SANS, 'start', 'bold', leftW); }
  // Number tiles, stacked down the right column.
  const n = spec.numbers.length, gap = 18, tileH = (H - 2 * PAD - gap * (n - 1)) / n;
  spec.numbers.forEach((item, i) => {
    const top = PAD + i * (tileH + gap), color = ACCENTS[i % ACCENTS.length], cx = rightX + rightW / 2;
    parts.push(`<rect x="${rightX}" y="${top.toFixed(1)}" width="${rightW}" height="${tileH.toFixed(1)}" rx="14" fill="#000" fill-opacity="0.22" stroke="${color}" stroke-opacity="0.55"/>`);
    const vSize = fitSize(item.value, SERIF, rightW - 40, Math.min(64, Math.floor(tileH * 0.5)), 18, `numbers[${i}].value`);
    const lSize = fitSize(item.label, SANS, rightW - 40, Math.min(20, Math.floor(tileH * 0.2)), 11, `numbers[${i}].label`);
    const block = vSize + 10 + lSize, vy = top + (tileH - block) / 2 + vSize * 0.85;
    add(cx, vy, item.value, vSize, color, SERIF, 'middle', 'normal', rightW - 40);
    add(cx, vy + 10 + lSize, item.label, lSize, INK, SANS, 'middle', 'normal', rightW - 40);
  });
  for (const b of boxes) {
    if (b.x0 < PAD - 0.5 || b.x1 > W - PAD + 0.5 || b.y0 < PAD - 30 || b.y1 > H - PAD + 20) throw new Error('layout escaped the banner safe area');
  }
  return { inner: parts.join('\n'), boxes };
}

function banner(slug, spec, background) {
  validateSpec(spec, slug);
  const svg = bannerSvg({ inner: layout(spec).inner, description: spec.description, background,
    glow: { color: '#9fd3ff', cx: '0.8', cy: '0.4', r: '0.45', opacity: '0.07' } });
  const errors = wellFormedErrors(svg);
  if (errors.length) throw new Error(`generated banner is not well-formed: ${errors.join('; ')}`);
  return svg;
}

function thumbSpec(spec) {
  const esc = s => escapeText(s);
  const lead = spec.numbers[0];
  return {
    kicker: ['RESEARCH RELEASE', spec.kicker || ''].filter(Boolean),
    head: [esc(spec.head)], headSize: 50,
    sub: spec.sub || '', tag: spec.tag || 'UNREFEREED CANDIDATE',
    hero: `<div class="hero-title">${esc(lead.value)}</div><div class="note">${esc(lead.label)}</div>`
  };
}

module.exports = { banner, layout, validateSpec, thumbSpec, W, H, PAD };

if (require.main === module) (async () => {
  const vm = require('vm'), os = require('os');
  const ROOT = path.join(__dirname, '..');
  const slug = process.argv[2];
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error('usage: node tools/release-art.js <slug> [--render DIR] [--no-mirror]');
  const spec = JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', slug, 'art.json'), 'utf8'));
  const bp = require('./banner-palettes').resolve(slug);
  if (!bp) throw new Error(`no saved banner palette for ${slug}; assign one in data/BANNER_PALETTES.json`);
  const svg = banner(slug, spec, bp);
  fs.writeFileSync(path.join(ROOT, 'assets/art', slug + '.svg'), svg);
  console.log('art:', slug, 'banner palette', bp.name);
  const i = process.argv.indexOf('--render');
  if (i < 0) return;
  const inspect = process.argv[i + 1];
  fs.mkdirSync(inspect, { recursive: true });
  const { chromium } = require('playwright');
  const br = await chromium.launch(process.env.EVIDENCE_PRESS_CHROME ? { executablePath: process.env.EVIDENCE_PRESS_CHROME } : {});
  const shot = async (w, h, html, file, opts = {}) => {
    const p = await br.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.screenshot({ path: file, ...(opts.jpeg ? { type: 'jpeg', quality: 94 } : {}) });
    await p.close();
  };
  const body = (w, h, inner) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:${w}px;height:${h}px;background:#222}svg{width:${w}px;height:${h}px;display:block}</style></head><body>${inner}</body></html>`;
  await shot(1200, 400, body(1200, 400, svg), path.join(inspect, 'banner-full-2x.png'), { dpr: 2 });
  await shot(358, 119, body(358, 119, svg), path.join(inspect, 'banner-card-358-mobile.png'), { dpr: 2 });
  const og = fs.readFileSync(path.join(__dirname, 'make-og.js'), 'utf8');
  const ogHtml = vm.runInNewContext(og.slice(og.indexOf('const html = '), og.indexOf('\n(async () =>')) + '; html', {});
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'papers', slug, 'meta.json'), 'utf8'));
  const ogFile = path.join(ROOT, 'assets/og', slug + '.png');
  await shot(1200, 630, ogHtml(meta, svg.replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ')), ogFile);
  const th = fs.readFileSync(path.join(__dirname, 'make-thumb.js'), 'utf8');
  const palSrc = th.slice(th.indexOf('const PALETTES = '), th.indexOf('const savedPalettes'));
  const pageSrc = th.slice(th.indexOf('const page = (spec) =>'), th.indexOf('\n(async () =>'));
  const thumbPage = vm.runInNewContext(`const W = 1280, H = 720; ${palSrc}; ${pageSrc}; page`, {});
  const thumbFile = path.join(ROOT, 'thumbs', slug + '.jpg');
  await shot(1280, 720, thumbPage({ ...thumbSpec(spec), palette: require('./thumbnail-palettes').resolve(slug, true) }), thumbFile, { dpr: 2, jpeg: true });
  if (!process.argv.includes('--no-mirror')) {
    const central = path.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || path.join(os.homedir(), 'thumbs'), slug + '.jpg');
    if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
    fs.copyFileSync(thumbFile, central);
  }
  await br.close();
  console.log('rendered banner inspection PNGs, OG card and thumbnail');
})().catch(e => { console.error(e.message); process.exit(1); });
