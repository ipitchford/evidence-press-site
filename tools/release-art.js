#!/usr/bin/env node
'use strict';
/* Standard, data-driven release art: banner (assets/art/<slug>.svg), OG card and
 * YouTube-style thumbnail from papers/<slug>/art.json. It replaces writing a
 * bespoke tools/<slug>-art.js per release; bespoke generators remain available
 * for releases whose figure needs a drawn mathematical object.
 *
 * Figure mode (recommended default): art.json names ONE informative figure drawn
 * from the paper's own certified data or formulas (an SVG, or a PNG of at least
 * 2x the drawn size) stored beside it in papers/<slug>/. The banner frames that
 * figure as its main visual, with the title and a short caption on the left.
 *   {
 *     "description": "This image helps the reader understand ...",
 *     "kicker": "MATHEMATICS · GRAPH POLYNOMIALS",   // optional
 *     "head": "Reliability zeros of K_n",
 *     "caption": "One or two sentences saying what the figure shows.",
 *     "figure": "figure.svg",                        // file in papers/<slug>/
 *     "tag": "UNREFEREED CANDIDATE"                  // optional
 *   }
 * The figure is scaled to fit its panel exactly by its intrinsic aspect ratio;
 * a missing, unsafe (scripts, external references), low-resolution, oversized
 * or extreme-aspect figure is refused rather than drawn distorted or clipped.
 *
 * Number-box mode (fallback only, when no figure can be drawn):
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
 * Usage: node tools/release-art.js <slug> [--render INSPECT_DIR] [--no-mirror] [--dir PAPER_DIR] [--out OUTPUT_ROOT]
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
    if (!['description', 'kicker', 'head', 'sub', 'numbers', 'tag', 'figure', 'caption'].includes(key)) throw new Error(`art.json: unknown field ${key}`);
  }
  if (spec.figure !== undefined) {
    if (typeof spec.figure !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.(svg|png)$/.test(spec.figure)) throw new Error('art.json figure must be a plain .svg or .png file name in papers/<slug>/');
    if (spec.numbers !== undefined || spec.sub !== undefined) throw new Error('art.json figure mode takes caption, not numbers/sub');
    if (typeof spec.caption !== 'string' || !spec.caption.trim()) throw new Error('art.json caption is required with a figure');
  } else if (spec.caption !== undefined) throw new Error('art.json caption needs a figure');
  if (typeof spec.description !== 'string' || spec.description.length < 20) throw new Error('art.json description is required (what the image helps the reader understand)');
  if (typeof spec.head !== 'string' || !spec.head.trim()) throw new Error('art.json head is required');
  if (spec.figure !== undefined) return;
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

const FIG = { x: 468, y: 34, w: W - 34 - 468, h: H - 68, pad: 14 };
const MAX_FIGURE_BYTES = 1500000;

/* Reads a figure file and returns { mime, data, aspect, pxWidth }; refuses what
   it cannot place safely. */
function readFigure(file) {
  if (!fs.existsSync(file)) throw new Error(`art.json figure not found: ${file}`);
  const data = fs.readFileSync(file);
  if (data.length > MAX_FIGURE_BYTES) throw new Error(`figure is ${data.length} bytes; keep it under ${MAX_FIGURE_BYTES} (simplify the plot or rasterise dense layers)`);
  if (file.endsWith('.png')) {
    if (data.length < 24 || data.readUInt32BE(0) !== 0x89504e47 || data.toString('ascii', 12, 16) !== 'IHDR') throw new Error('figure is not a valid PNG');
    const w = data.readUInt32BE(16), h = data.readUInt32BE(20);
    return { mime: 'image/png', data, aspect: w / h, pxWidth: w };
  }
  const text = data.toString('utf8');
  if (/<script|<foreignObject|\son[a-z]+\s*=|(?:href|src)\s*=\s*["'](?!#|data:image\/(?:png|jpeg);base64,)/i.test(text)) throw new Error('figure SVG contains scripts, event handlers or external references');
  const errors = wellFormedErrors(text);
  if (errors.length) throw new Error(`figure SVG is not well-formed: ${errors[0]}`);
  const root = (text.match(/<svg\b[^>]*>/) || [''])[0];
  const vb = root.match(/viewBox\s*=\s*["']\s*[-\d.eE]+[\s,]+[-\d.eE]+[\s,]+([\d.eE]+)[\s,]+([\d.eE]+)/);
  const num = name => { const m = root.match(new RegExp(`\\s${name}\\s*=\\s*["']([\\d.]+)(?:pt|px)?["']`)); return m ? Number(m[1]) : NaN; };
  const [w, h] = vb ? [Number(vb[1]), Number(vb[2])] : [num('width'), num('height')];
  if (!(w > 0 && h > 0)) throw new Error('figure SVG needs a viewBox or numeric width/height');
  return { mime: 'image/svg+xml', data, aspect: w / h, pxWidth: Infinity };
}

/* Fits the figure inside the panel by its aspect ratio. Returns the placed box. */
function placeFigure(fig) {
  const iw = FIG.w - 2 * FIG.pad, ih = FIG.h - 2 * FIG.pad;
  let w = iw, h = iw / fig.aspect;
  if (h > ih) { h = ih; w = ih * fig.aspect; }
  if ((w * h) / (iw * ih) < 0.45) throw new Error(`figure aspect ratio ${fig.aspect.toFixed(2)} leaves most of the ${iw}x${ih} panel empty; redraw it nearer ${(iw / ih).toFixed(2)}:1`);
  if (fig.pxWidth < 2 * w) throw new Error(`PNG figure is ${fig.pxWidth}px wide; it needs at least ${Math.ceil(2 * w)}px (2x) for a sharp banner, or use SVG`);
  const x = FIG.x + FIG.pad + (iw - w) / 2, y = FIG.y + FIG.pad + (ih - h) / 2;
  if (x < FIG.x || y < FIG.y || x + w > FIG.x + FIG.w + 0.01 || y + h > FIG.y + FIG.h + 0.01) throw new Error('figure escaped its panel');
  return { x, y, w, h };
}

function figureUri(fig) { return `data:${fig.mime};base64,${fig.data.toString('base64')}`; }

function figureLayout(spec, fig) {
  const boxes = [], parts = [];
  const leftW = FIG.x - PAD - 30;
  const add = (x, y, s, size, color, family, weight, width) => {
    const w = [...s].length * size * ADVANCE[family];
    boxes.push({ x0: x, x1: x + w, y0: y - size, y1: y + size * 0.25, width });
    parts.push(t(x, y, s, size, color, family, 'start', weight));
  };
  let y = PAD + 10;
  if (spec.kicker) { const k = fitSize(spec.kicker, SANS, leftW, 15, 10, 'kicker'); add(PAD, y, spec.kicker, k, MUTED, SANS, 'bold', leftW); y += 16; }
  const { size: headSize, lines: headLines } = fitWrap(spec.head, SERIF, leftW, 38, 24, 3, 'head');
  for (const line of headLines) { y += headSize + 6; add(PAD, y, line, headSize, INK, SERIF, 'normal', leftW); }
  const room = H - PAD - (spec.tag ? 32 : 0) - (y + 16);
  let fitted = null;
  for (let size = 19; size >= 13 && !fitted; size -= 1) {
    const lines = Math.floor(room / (size + 7));
    if (lines >= 1) try { fitted = { size, lines: wrap(spec.caption, SANS, leftW, size, lines, 'caption') }; } catch { /* smaller */ }
  }
  if (!fitted) throw new Error('art.json caption does not fit beside the figure; shorten it');
  y += 16;
  for (const line of fitted.lines) { y += fitted.size + 7; add(PAD, y, line, fitted.size, MUTED, SANS, 'normal', leftW); }
  if (spec.tag) { const g = fitSize(spec.tag, SANS, leftW, 14, 10, 'tag'); add(PAD, H - PAD, spec.tag, g, ACCENTS[0], SANS, 'bold', leftW); }
  for (const b of boxes) if (b.x0 < PAD - 0.5 || b.x1 > FIG.x - 20 || b.y0 < 0 || b.y1 > H - PAD + 20) throw new Error('layout escaped the banner safe area');
  const p = placeFigure(fig);
  parts.push(`<rect x="${FIG.x}" y="${FIG.y}" width="${FIG.w}" height="${FIG.h}" rx="16" fill="#fbf8f2"/>`);
  parts.push(`<image x="${p.x.toFixed(2)}" y="${p.y.toFixed(2)}" width="${p.w.toFixed(2)}" height="${p.h.toFixed(2)}" preserveAspectRatio="xMidYMid meet" href="${figureUri(fig)}"/>`);
  return { inner: parts.join('\n'), boxes, figureBox: p };
}

function banner(slug, spec, background, figureDir) {
  validateSpec(spec, slug);
  const inner = spec.figure ? figureLayout(spec, readFigure(path.join(figureDir || path.join(__dirname, '..', 'papers', slug), spec.figure))).inner : layout(spec).inner;
  const svg = bannerSvg({ inner, description: spec.description, background,
    glow: { color: '#9fd3ff', cx: '0.8', cy: '0.4', r: '0.45', opacity: '0.07' } });
  const errors = wellFormedErrors(svg);
  if (errors.length) throw new Error(`generated banner is not well-formed: ${errors.join('; ')}`);
  return svg;
}

function thumbSpec(spec, fig) {
  const esc = s => escapeText(s);
  const base = { kicker: ['RESEARCH RELEASE', spec.kicker || ''].filter(Boolean), head: [esc(spec.head)], headSize: 50,
    sub: spec.sub || '', tag: spec.tag || 'UNREFEREED CANDIDATE' };
  if (spec.figure) {
    return { ...base, hero: `<img src="${figureUri(fig)}" alt="" style="display:block;width:100%;max-height:520px;object-fit:contain;background:#fbf8f2;border-radius:14px;padding:14px;box-sizing:border-box">` };
  }
  const lead = spec.numbers[0];
  return { ...base, hero: `<div class="hero-title">${esc(lead.value)}</div><div class="note">${esc(lead.label)}</div>` };
}

module.exports = { banner, layout, figureLayout, readFigure, placeFigure, validateSpec, thumbSpec, W, H, PAD, FIG };

if (require.main === module) (async () => {
  const vm = require('vm'), os = require('os');
  const ROOT = path.join(__dirname, '..');
  const slug = process.argv[2];
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error('usage: node tools/release-art.js <slug> [--render DIR] [--no-mirror]');
  const d = process.argv.indexOf('--dir');
  const paperDir = d > 0 ? path.resolve(process.argv[d + 1]) : path.join(ROOT, 'papers', slug);
  const spec = JSON.parse(fs.readFileSync(path.join(paperDir, 'art.json'), 'utf8'));
  const bp = require('./banner-palettes').resolve(slug);
  if (!bp) throw new Error(`no saved banner palette for ${slug}; assign one in data/BANNER_PALETTES.json`);
  const svg = banner(slug, spec, bp, paperDir);
  const o = process.argv.indexOf('--out');   // write outputs elsewhere (trial runs); implies --no-mirror
  const out = o > 0 ? path.resolve(process.argv[o + 1]) : ROOT;
  for (const dir of ['assets/art', 'assets/og', 'thumbs']) fs.mkdirSync(path.join(out, dir), { recursive: true });
  fs.writeFileSync(path.join(out, 'assets/art', slug + '.svg'), svg);
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
  const meta = JSON.parse(fs.readFileSync(path.join(paperDir, 'meta.json'), 'utf8'));
  const ogFile = path.join(out, 'assets/og', slug + '.png');
  await shot(1200, 630, ogHtml(meta, svg.replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ')), ogFile);
  const th = fs.readFileSync(path.join(__dirname, 'make-thumb.js'), 'utf8');
  const palSrc = th.slice(th.indexOf('const PALETTES = '), th.indexOf('const savedPalettes'));
  const pageSrc = th.slice(th.indexOf('const page = (spec) =>'), th.indexOf('\n(async () =>'));
  const thumbPage = vm.runInNewContext(`const W = 1280, H = 720; ${palSrc}; ${pageSrc}; page`, {});
  const thumbFile = path.join(out, 'thumbs', slug + '.jpg');
  await shot(1280, 720, thumbPage({ ...thumbSpec(spec, spec.figure && readFigure(path.join(paperDir, spec.figure))), palette: require('./thumbnail-palettes').resolve(slug, true) }), thumbFile, { dpr: 2, jpeg: true });
  if (!process.argv.includes('--no-mirror') && out === ROOT) {
    const central = path.join(process.env.EVIDENCE_PRESS_THUMBNAIL_DIR || path.join(os.homedir(), 'thumbs'), slug + '.jpg');
    if (fs.existsSync(central) && !fs.readFileSync(thumbFile).equals(fs.readFileSync(central))) throw new Error('central thumbnail exists; refusing to overwrite: ' + central);
    fs.copyFileSync(thumbFile, central);
  }
  await br.close();
  console.log('rendered banner inspection PNGs, OG card and thumbnail');
})().catch(e => { console.error(e.message); process.exit(1); });
