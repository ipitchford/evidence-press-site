#!/usr/bin/env node
'use strict';
/*
 * build-protocols.js — the Productivity Protocols static-site builder.
 * Dependency-free (Node >= 18). Emits ./dist (i.e. protocols/dist), NEVER the
 * parent site's dist/. Timestamps derive from the git commit, not the clock, and
 * pack archives are deterministic, so a clean checkout rebuilds byte-for-byte.
 *
 * Output (mounted at /protocols/):
 *   index.html                     registry landing page (client-side filters)
 *   p/<id>/index.html              per-protocol page (both status ladders, downloads, install)
 *   downloads/<id>-<version>.tar   deterministic pack archive
 *   api/protocols.json             machine-readable registry (validates against registry.schema.json)
 *   api/<id>.json                  per-protocol machine record (contract + achieved status + manifest)
 *   api/*.schema.json              the schemas
 *   status/*.json  kernel/*        copied for reference
 *   feed.json feed.xml llms.txt llms-full.txt sitemap.xml robots.txt
 *
 * Apache-2.0.
 */
const fs = require('fs');
const path = require('path');
const { load } = require('./tools/lib/yaml');
const { validate } = require('./tools/lib/jsonschema');
const tar = require('./tools/lib/tar');
const U = require('./tools/lib/util');

const ROOT = U.ROOT;
const DIST = path.join(ROOT, 'dist');
const CONFIG = U.readJSON(path.join(ROOT, 'site.config.json'));
const BASE = CONFIG.baseUrl.replace(/\/$/, '');
const BP = CONFIG.basePath.replace(/\/$/, ''); // /protocols
const GIT = U.gitIdentity();
const MTIME = GIT.sourceDate ? Math.floor(new Date(GIT.sourceDate).getTime() / 1000) : 0;
const ASSURANCE = U.readJSON(path.join(ROOT, 'status', 'protocol-assurance.json'));
const EVIDENCE = U.readJSON(path.join(ROOT, 'status', 'productivity-evidence.json'));
const PROTOCOL_SCHEMA = U.readJSON(path.join(ROOT, 'schema', 'protocol.schema.json'));
const MANIFEST_SCHEMA = U.readJSON(path.join(ROOT, 'schema', 'manifest.schema.json'));
const REGISTRY_SCHEMA = U.readJSON(path.join(ROOT, 'schema', 'registry.schema.json'));
const RECEIPT_SCHEMA = U.readJSON(path.join(ROOT, 'schema', 'receipt.schema.json'));

// Encode @ as an entity as well as the characters required by HTML. Cloudflare
// Email Address Obfuscation otherwise mistakes version identifiers such as
// `verified-agent-work@0.1.0` in displayed source for addresses, rewrites the
// reviewed HTML, and injects a decoder script on the production custom domain.
// textContent (used by copy/download actions) still reconstructs the exact @.
const esc = s => String(s).replace(/[&<>"@]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '@': '&#64;'
}[c]));
const write = (rel, data) => {
  if (typeof rel !== 'string' || !rel || rel.includes('\\') || path.posix.isAbsolute(rel)
      || path.posix.normalize(rel) !== rel || rel.split('/').includes('..')) {
    throw new Error(`refusing unsafe output path: ${rel}`);
  }
  const p = path.resolve(DIST, ...rel.split('/'));
  if (!p.startsWith(DIST + path.sep)) throw new Error(`output path escapes dist: ${rel}`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
};

const crypto = require('crypto');

// The main site's config — for the shared site name and Organization sameAs, so
// the header brand and entity identity match evidencepress.org exactly.
const MAIN_CONFIG = U.readJSON(path.join(ROOT, '..', 'site.config.json'));
const SITE_NAME = MAIN_CONFIG.siteName || CONFIG.parentSite || 'Evidence Press';
const SAME_AS = Array.isArray(MAIN_CONFIG.sameAs) ? MAIN_CONFIG.sameAs : [];

// Cache-busting content hash of the LIVE stylesheet. These pages mount under the
// same origin and link /assets/style.css directly (one stylesheet for the whole
// site — the section cannot drift from the main branding), so we hash the very
// same source file to keep the ?v= in step with build.js.
const assetHash = buf => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);
const CSS_V = assetHash(fs.readFileSync(path.join(ROOT, '..', 'assets', 'style.css')));

// The house security posture: the same strict per-page CSP the main pages emit.
// script-src and style-src 'self' forbid inline code, so the registry behaviour
// and protocol supplement live in external same-origin assets; img-src allows
// same-origin art plus the data: favicon.
const PAGE_CSP = [
  "default-src 'self'", "base-uri 'none'", "object-src 'none'", "form-action 'none'",
  "script-src 'self'", "style-src 'self'", "img-src 'self' data:",
  "font-src 'self'", "media-src 'self'", "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com", "manifest-src 'self'"
].join('; ');

// The Evidence Press favicon (teal tile, gold E-rho) — identical to the main site.
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23134e4a'/%3E%3Ctext x='50' y='66' font-size='46' text-anchor='middle' fill='%23fbbf24' font-family='Georgia'%3EE%CF%81%3C/text%3E%3C/svg%3E";

// The main-site navigation, reproduced so /protocols/ carries the same header.
// KEEP IN SYNC with build.js head(). These pages live under 'Productivity'.
const NAV = [
  ['/', 'Releases'], ['/about/', 'About'], ['/observatory/', 'Observatory'],
  ['/productivity/', 'Productivity'], ['/ai/', 'For AI agents'], ['/feed.xml', 'RSS']
];
const navHtml = () => NAV.map(([href, label]) =>
  `<a href="${href}"${href === '/productivity/' ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('\n      ');

// Registry behaviour served as an external script so the strict script-src holds
// (no inline JS). Guards on element presence so one file serves index + detail.
const PROTO_JS = `'use strict';
var copyText = function (value) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(value);
  return new Promise(function (resolve, reject) {
    var area = document.createElement('textarea');
    area.value = value; area.setAttribute('readonly', '');
    area.style.position = 'fixed'; area.style.opacity = '0';
    document.body.appendChild(area); area.select();
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    document.body.removeChild(area);
    if (copied) resolve(); else reject(new Error('copy unavailable'));
  });
};
var flashButton = function (button, message, delay) {
  var previous = button.textContent;
  button.textContent = message; button.setAttribute('aria-live', 'polite');
  setTimeout(function () { button.textContent = previous; }, delay || 1400);
};
document.querySelectorAll('button.copy[data-target]').forEach(function (b) {
  b.addEventListener('click', function () {
    var t = document.getElementById(b.dataset.target);
    if (!t) return;
    copyText(t.textContent).then(function () { flashButton(b, 'Copied'); })
      .catch(function () { flashButton(b, 'Copy unavailable', 1800); });
  });
});
document.querySelectorAll('button.download-text[data-target]').forEach(function (b) {
  b.addEventListener('click', function () {
    var t = document.getElementById(b.dataset.target);
    if (!t) return;
    var blob = new Blob([t.textContent], { type: b.dataset.mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = b.dataset.filename || 'download.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 0);
    flashButton(b, 'Downloaded');
  });
});
var reg = document.getElementById('reg');
if (reg) {
  var rowsEl = [].slice.call(reg.querySelectorAll('tbody tr'));
  var q = document.getElementById('q'), fl = document.getElementById('f-level'),
      fr = document.getElementById('f-risk'), fa = document.getElementById('f-assurance'),
      fe = document.getElementById('f-evidence'), ft = document.getElementById('f-task'),
      fu = document.getElementById('f-audience'), ftr = document.getElementById('f-required-tool'),
      fto = document.getElementById('f-optional-tool'), cnt = document.getElementById('count');
  var hasTag = function (row, name, value) {
    if (!value) return true;
    try { return JSON.parse(decodeURIComponent(row.dataset[name] || '%5B%5D')).indexOf(value) !== -1; }
    catch (_) { return false; }
  };
  var apply = function () {
    var t = (q.value || '').toLowerCase(), n = 0;
    rowsEl.forEach(function (r) {
      var ok = (!t || r.dataset.text.indexOf(t) !== -1)
        && (!fl.value || r.dataset.level === fl.value)
        && (!fr.value || r.dataset.risk === fr.value)
        && (!fa.value || r.dataset.assurance === fa.value)
        && (!fe.value || r.dataset.evidence === fe.value)
        && hasTag(r, 'taskTags', ft.value)
        && hasTag(r, 'audienceTags', fu.value)
        && hasTag(r, 'requiredToolTags', ftr.value)
        && hasTag(r, 'optionalToolTags', fto.value);
      r.style.display = ok ? '' : 'none'; if (ok) n++;
    });
    cnt.textContent = n + ' of ' + rowsEl.length + ' protocols';
  };
  [q, fl, fr, fa, fe, ft, fu, ftr, fto].forEach(function (el) { el.addEventListener('input', apply); });
  apply();
}
`;
const JS_V = assetHash(Buffer.from(PROTO_JS));

// A small supplement to the house stylesheet: ONLY the registry-specific
// components (status badges, the filter bar, the fact panel), all written in the
// house design tokens. Everything else — type, header, footer, tables, links,
// code — comes from /assets/style.css, so this section cannot drift off-brand.
const SUPPLEMENT = `
.protocols-page{padding:2.2rem 0 3rem}
.protocols-page .cover{border-radius:14px;overflow:hidden;margin-bottom:1.6rem;background:var(--dark)}
.protocols-page .cover img{width:100%;aspect-ratio:3/1;object-fit:cover}
.protocols-page h1{font-size:2.25rem;line-height:1.18;margin:0 0 .5rem;max-width:56rem}
.protocols-page .standfirst{font-size:1.18rem;color:var(--muted);margin:.25rem 0 1.4rem;max-width:52rem}
.protocols-page .backlink{font-family:var(--sans);font-size:.85rem;margin:0 0 .5rem}
.protocols-page>.body{max-width:none}
.protocols-page .body>p,.protocols-page .body>ul,.protocols-page .body>ol{max-width:52rem}
.protocols-page h2{font-size:1.42rem;margin:2.1rem 0 .6rem;border-bottom:1px solid var(--line);padding-bottom:.25rem}
.protocols-page h3{font-size:1.1rem;margin:1.4rem 0 .35rem}
.badge{display:inline-block;font-family:var(--mono);font-weight:600;font-size:.72rem;padding:.14em .5em;border:1px solid var(--line);border-radius:4px;background:#f3efe8;color:var(--muted);white-space:nowrap;letter-spacing:.01em}
.badge.pos{border-color:var(--accent-2);color:var(--accent);background:#f0fdfa}
.badge.neg{border-color:var(--amber);color:var(--amber);background:var(--amber-bg)}
.badge.neu{border-color:var(--line);color:var(--muted)}
.status-panel{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:.3rem 1rem;margin:1.2rem 0 1.6rem}
.status-panel table{margin:0;border:0;background:transparent;font-size:.92rem}
.status-panel th,.status-panel td{border:0;border-bottom:1px solid var(--line);padding:.6rem .3rem;vertical-align:top}
.status-panel tr:last-child th,.status-panel tr:last-child td{border-bottom:0}
.status-panel th{width:12rem;background:transparent;font-family:var(--sans);color:var(--muted);font-weight:700;font-size:.78rem}
.controls{display:flex;flex-wrap:wrap;gap:.9rem;margin:1.2rem 0;font-family:var(--sans)}
.controls label{font-size:.72rem;color:var(--muted);display:flex;flex-direction:column;gap:.28rem;text-transform:uppercase;letter-spacing:.05em}
.controls select,.controls input{font-family:var(--sans);font-size:.92rem;padding:.45rem .6rem;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);text-transform:none;letter-spacing:0}
.controls input{min-width:15rem}.controls select{max-width:24rem}
.reg-table td .sub{font-family:var(--sans);font-size:.78rem;color:var(--muted);margin-top:.15rem}
.facet-summary{font-family:var(--sans);font-size:.7rem;line-height:1.35;color:var(--muted);margin-top:.45rem;max-width:30rem}.facet-summary span{display:block;margin-top:.18rem}.facet-summary b{color:var(--ink)}
.action-links{list-style:none;margin:0;padding:0;font-family:var(--sans);font-size:.75rem}.action-links li{margin:.2rem 0}.action-links a{white-space:nowrap}
.count-note{font-family:var(--sans);font-size:.85rem;color:var(--muted);margin:.7rem 0 0}
.muted{color:var(--muted)}
.small{font-size:.82rem}
.registry-section{margin:1.5rem 0;padding:1rem 1.1rem;border:1px solid var(--line);border-radius:10px;background:var(--card)}.registry-section h2{margin:0 0 .35rem!important;padding:0!important;border:0!important}.registry-section p{margin:.3rem 0}.registry-section ul{margin:.55rem 0 .1rem}
.novice-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;margin:1rem 0 1.5rem}.novice-action{padding:1rem;border:1px solid var(--line);border-radius:10px;background:var(--card)}.novice-action h2{font-size:1.05rem;margin:0 0 .35rem!important;padding:0!important;border:0!important}.novice-action p{font-size:.86rem;margin:.35rem 0}.novice-action code{overflow-wrap:anywhere}.action-button{display:inline-block;margin:.25rem .3rem .25rem 0;padding:.55rem .72rem;border:1px solid var(--accent);border-radius:7px;background:var(--accent);color:#fff;font:700 .78rem var(--sans);text-decoration:none;cursor:pointer}.action-button:hover{background:var(--dark);color:#fff;text-decoration:underline}.source-details{margin:.7rem 0}.source-details pre{max-height:26rem;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}
.contribution-route{margin:2rem 0;padding:1rem 1.1rem;border:1px solid var(--accent-2);border-left:5px solid var(--accent-2);border-radius:10px;background:#f0fdfa}.contribution-route h2{margin:0 0 .4rem!important;padding:0!important;border:0!important}.contribution-route pre{max-height:30rem;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}
.starter-callout{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(17rem,.65fr);gap:1.4rem;align-items:center;margin:1.2rem 0 1.7rem;padding:1.25rem 1.4rem;border-radius:12px;background:var(--dark);color:#fff}
.starter-callout h2{margin:0 0 .35rem!important;padding:0!important;border:0!important;color:#fff}
.starter-callout p{margin:.25rem 0;color:#d5e5e2}
.starter-callout .button-link,.starter-download .button-link{display:inline-block;padding:.68rem .9rem;border-radius:8px;background:var(--accent-bright);color:var(--dark);font-family:var(--sans);font-weight:700;text-decoration:none}
.starter-callout .button-link:hover,.starter-download .button-link:hover{text-decoration:underline;background:#fff}
.stage-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;margin:1rem 0 1.5rem}
.stage-card{padding:.9rem;border:1px solid var(--line);border-top:4px solid var(--accent-2);border-radius:9px;background:var(--card)}
.stage-card h3{margin:0 0 .35rem;font-size:1rem}.stage-card p{margin:0;font-size:.88rem}.stage-card strong{display:block;margin-top:.45rem;color:var(--amber)}
.evidence-boundary{margin:1.2rem 0;padding:1rem 1.1rem;border:1px solid var(--amber);border-left:5px solid var(--amber);border-radius:9px;background:var(--amber-bg)}
.evidence-boundary h2{margin:0 0 .35rem!important;padding:0!important;border:0!important;font-size:1.12rem}.evidence-boundary p{margin:.3rem 0}
.starter-layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(18rem,.7fr);gap:1.2rem;align-items:start}
.starter-panel,.starter-download{padding:1rem 1.1rem;border:1px solid var(--line);border-radius:10px;background:var(--card)}
.starter-download{position:sticky;top:1rem;background:var(--dark);color:#fff}.starter-download h2{margin:0 0 .5rem!important;padding:0!important;border:0!important;color:#fff}.starter-download code{overflow-wrap:anywhere;color:#fff;background:transparent;padding:0;border-radius:0}.starter-download .small{color:#d5e5e2}
.starter-files{columns:2;column-gap:1.5rem}.starter-files li{break-inside:avoid;margin-bottom:.42rem}.starter-files span{display:block;color:var(--muted);font-family:var(--sans);font-size:.72rem}
@media(max-width:800px){.starter-callout,.starter-layout{grid-template-columns:1fr}.stage-grid{grid-template-columns:1fr 1fr}.novice-actions{grid-template-columns:1fr}.starter-download{position:static}.starter-files{columns:1}}
@media(max-width:640px){
  .status-panel{padding:.25rem .75rem}.status-panel table,.status-panel tbody{display:block;width:100%}.status-panel tr{display:grid;grid-template-columns:minmax(6.8rem,.65fr) minmax(0,1.35fr);width:100%}.status-panel th{width:auto}.status-panel td{min-width:0;overflow-wrap:anywhere}.status-panel code{white-space:normal;overflow-wrap:anywhere}
  .reg-table thead,.contract-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  .reg-table,.reg-table tbody,.reg-table tr,.reg-table td,.contract-table,.contract-table tbody,.contract-table tr,.contract-table td{display:block;width:100%}
  .reg-table,.contract-table{border:0}.reg-table tbody,.contract-table tbody{background:transparent}.reg-table tr,.contract-table tr{margin:0 0 .75rem;overflow:hidden;border:1px solid var(--line);border-radius:8px;background:var(--card)}
  .reg-table td,.contract-table td{display:grid;grid-template-columns:minmax(6.8rem,.7fr) minmax(0,1.3fr);gap:.65rem;padding:.5rem .6rem;border:0;border-bottom:1px solid var(--line);overflow-wrap:anywhere}
  .reg-table td:last-child,.contract-table td:last-child{border-bottom:0}.reg-table td::before,.contract-table td::before{content:attr(data-label);color:var(--muted);font-family:var(--sans);font-size:.7rem;font-weight:700;letter-spacing:.035em;text-transform:uppercase}
  .reg-table td .sub,.reg-table td .facet-summary,.reg-table td .action-links{grid-column:2}.reg-table .badge{white-space:normal;overflow-wrap:anywhere}
  .protocols-page .table-wrap{overflow:visible}
}
@media(max-width:520px){.stage-grid{grid-template-columns:1fr}.controls{display:block}.controls label{margin-bottom:.7rem}.controls input,.controls select{min-width:0;width:100%;max-width:100%}.reg-table{font-size:.78rem}}
`;
const SUPPLEMENT_V = assetHash(Buffer.from(SUPPLEMENT));

// JSON-LD graph: the main-site WebSite + Organization (shared @id + sameAs for
// entity disambiguation) plus this page's node.
function jsonldGraph(pageNode) {
  const org = {
    '@type': 'Organization', '@id': `${BASE}/#org`, name: CONFIG.publisher, url: `${BASE}/`,
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {})
  };
  const website = {
    '@type': 'WebSite', '@id': `${BASE}/#website`, url: `${BASE}/`, name: SITE_NAME,
    inLanguage: CONFIG.language, publisher: { '@id': `${BASE}/#org` }
  };
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [website, org, pageNode].map(n => JSON.parse(JSON.stringify(n)))
  }, null, 1);
}

// The branded page shell — the same head/header/footer chrome as the main site,
// linking the shared /assets/style.css. opts: { canonical, og, cover, kicker,
// standfirst, backlink:{href,label}, pageNode }.
function page(title, body, desc, opts = {}) {
  desc = desc || CONFIG.description;
  const canonical = opts.canonical || `${BASE}${BP}/`;
  const ogImg = opts.og ? `${BASE}${opts.og}` : null;
  const social = [
    ['og:type', 'website'], ['og:site_name', SITE_NAME],
    ['og:title', title], ['og:description', desc], ['og:url', canonical],
    ...(ogImg ? [['og:image', ogImg], ['og:image:width', '1200'], ['og:image:height', '630']] : []),
    ['twitter:card', ogImg ? 'summary_large_image' : 'summary'],
    ['twitter:title', title], ['twitter:description', desc],
    ...(ogImg ? [['twitter:image', ogImg]] : [])
  ].map(([k, v]) => k.startsWith('og:')
    ? `<meta property="${k}" content="${esc(v)}">`
    : `<meta name="${k}" content="${esc(v)}">`).join('\n');
  const pageNode = opts.pageNode || {
    '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: title, description: desc,
    ...(ogImg ? { image: ogImg } : {}), inLanguage: CONFIG.language,
    isPartOf: { '@id': `${BASE}/#website` },
    license: 'https://creativecommons.org/publicdomain/zero/1.0/'
  };
  const cover = opts.cover ? `<div class="cover"><img src="${opts.cover}" alt="" loading="eager"></div>` : '';
  const kicker = opts.kicker ? `<p class="kicker">${esc(opts.kicker)}</p>` : '';
  const backlink = opts.backlink ? `<p class="backlink"><a href="${opts.backlink.href}">${esc(opts.backlink.label)}</a></p>` : '';
  const standfirst = opts.standfirst ? `<p class="standfirst">${esc(opts.standfirst)}</p>` : '';
  return `<!DOCTYPE html>
<html lang="${CONFIG.language}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta http-equiv="Content-Security-Policy" content="${PAGE_CSP}">
<title>${esc(title)} · ${esc(SITE_NAME)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="/assets/style.css?v=${CSS_V}">
<link rel="stylesheet" href="${BP}/assets/protocols.css?v=${SUPPLEMENT_V}">
${social}
<script defer src="${BP}/assets/protocols.js?v=${JS_V}"></script>
<script type="application/ld+json">
${jsonldGraph(pageNode)}
</script>
</head>
<body>
<header class="site-head">
  <div class="wrap">
    <a class="brand" href="/"><span class="brand-mark">E</span> ${esc(SITE_NAME)}</a>
    <nav>
      ${navHtml()}
    </nav>
  </div>
</header>
<main>
<article class="release"><div class="wrap"><div class="protocols-page">
${cover}${backlink}${kicker}
<h1>${esc(title)}</h1>
${standfirst}
<div class="body">${body}</div>
</div></div></article>
</main>
<footer class="site-foot">
  <div class="wrap">
    <p>${esc(CONFIG.sectionName)} publishes bounded methods and the records needed to test them. Existing model benchmarks are not evidence of human or company productivity. Part of <a href="${BASE}/">${esc(SITE_NAME)}</a>.</p>
    <p>Machine-readable: <a href="${BP}/api/protocols.json">registry JSON</a> · <a href="${BP}/api/registry.schema.json">schema</a> · <a href="${BP}/feed.json">JSON Feed</a> · <a href="${BP}/llms.txt">llms.txt</a> · <a href="${BP}/sitemap.xml">sitemap</a>. Content CC0-1.0, code Apache-2.0.</p>
    <p class="build-identity">${esc(CONFIG.sectionName)} v${esc(CONFIG.softwareVersion)} · kernel v${esc(CONFIG.kernelVersion)} · build ${esc(GIT.sourceCommit || 'local')}${GIT.sourceDate ? ' · ' + esc(GIT.sourceDate.slice(0, 10)) : ''}</p>
  </div>
</footer>
</body>
</html>`;
}

// Resolve a main-site asset path (art/OG live in the parent site's assets/, which
// is served at /assets/ once /protocols/ is mounted). Returns null if absent, so
// a build never references a missing image.
const ASSET = rel => fs.existsSync(path.join(ROOT, '..', 'assets', rel)) ? `/assets/${rel}` : null;

function assuranceBadge(state) {
  const s = ASSURANCE.states.find(x => x.id === state) || {};
  const cls = s.polarity === 'terminal' ? 'neg' : 'neu';
  return `<span class="badge ${cls}" title="${esc(s.meaning || '')}">${esc(state)}</span>`;
}
function evidenceBadge(state) {
  const s = EVIDENCE.states.find(x => x.id === state) || {};
  const cls = s.polarity === 'positive' ? 'pos' : s.polarity === 'negative' ? 'neg' : 'neu';
  return `<span class="badge ${cls}" title="${esc(s.meaning || '')}">${esc(state)}</span>`;
}

// Registry facets are exact projections of contract fields, not an inferred
// taxonomy. Canonical ordering makes their machine representation stable and
// lets the release checker recompute the same values from each machine record.
const canonicalTags = values => [...new Set((values || []).map(String))].sort();
function registryTags(p) {
  return {
    task_tags: canonicalTags([p.title]),
    audience_tags: canonicalTags(p.target_users),
    required_tool_tags: canonicalTags(p.required_capabilities),
    optional_tool_tags: canonicalTags((p.optional_tools || []).map(tool => tool.name))
  };
}
const encodedTags = values => encodeURIComponent(JSON.stringify(values));

function validatePackReceipt(id, p, manifest, receipt) {
  const rerrs = validate(RECEIPT_SCHEMA, receipt);
  if (rerrs.length) throw new Error(`${id}/RECEIPT.json is not schema-valid: ${rerrs.map(e => e.path + ' ' + e.msg).join('; ')}`);
  if (receipt.scope !== 'protocol') throw new Error(`${id}/RECEIPT.json scope '${receipt.scope}' is not protocol`);
  if (receipt.subject_id !== id) throw new Error(`${id}/RECEIPT.json subject_id '${receipt.subject_id}' does not match pack`);
  if (receipt.version !== p.version) throw new Error(`${id}/RECEIPT.json version '${receipt.version}' does not match protocol ${p.version}`);
  if (receipt.productivity_evidence !== p.productivity_evidence) {
    throw new Error(`${id}/RECEIPT.json productivity_evidence '${receipt.productivity_evidence}' does not match protocol '${p.productivity_evidence}'`);
  }
  const failed = receipt.checks.filter(c => !c.passed).map(c => c.name);
  if (failed.length) throw new Error(`${id}/RECEIPT.json records failed gates (${failed.join(', ')}); refusing to publish`);

  if (!Array.isArray(receipt.files_sha256)) throw new Error(`${id}/RECEIPT.json does not bind manifest files`);
  const bound = new Map(receipt.files_sha256.map(file => [file.path, file.sha256]));
  if (bound.size !== receipt.files_sha256.length || bound.size !== manifest.files.length) {
    throw new Error(`${id}/RECEIPT.json file inventory does not equal MANIFEST.json`);
  }
  for (const file of manifest.files) {
    if (bound.get(file.path) !== file.sha256) {
      throw new Error(`${id}/RECEIPT.json hash for '${file.path}' does not equal MANIFEST.json`);
    }
  }
  return receipt.assurance_status;
}

function loadPacks() {
  return U.listPacks()
    .filter(id => {
      const has = fs.existsSync(path.join(U.packDir(id), 'MANIFEST.json'));
      if (!has) console.warn(`  (skipping ${id}: no MANIFEST.json — run make-manifest first)`);
      return has;
    })
    .map(id => {
      const dir = U.packDir(id);
      const p = load(fs.readFileSync(path.join(dir, 'protocol.yaml'), 'utf8'));
      const protocolErrors = validate(PROTOCOL_SCHEMA, p);
      if (protocolErrors.length) {
        throw new Error(`${id}/protocol.yaml is not schema-valid: ${protocolErrors.map(e => e.path + ' ' + e.msg).join('; ')}`);
      }
      if (p.id !== id) throw new Error(`${id}/protocol.yaml id '${p.id}' does not match its directory`);
      const manifest = U.readJSON(path.join(dir, 'MANIFEST.json'));
      const manifestErrors = validate(MANIFEST_SCHEMA, manifest);
      if (manifestErrors.length) {
        throw new Error(`${id}/MANIFEST.json is not schema-valid: ${manifestErrors.map(e => e.path + ' ' + e.msg).join('; ')}`);
      }
      if (manifest.pack_id !== id || manifest.version !== p.version) {
        throw new Error(`${id}/MANIFEST.json identity ${manifest.pack_id}@${manifest.version} does not match ${id}@${p.version}`);
      }
      // The receipt-backed status is authoritative: assurance is only what the
      // gates justify, not what the author wrote. Fall back to the contract.
      const receiptPath = path.join(dir, 'RECEIPT.json');
      let receipt = null;
      if (fs.existsSync(receiptPath)) {
        receipt = U.readJSON(receiptPath);
        // Do not consume an untrusted or malformed receipt: it must be schema-valid,
        // must be for THIS pack, and must record every gate as passed. (This detects
        // a malformed or mismatched receipt; it is not, on its own, proof against a
        // deliberate forgery — see KNOWN-LIMITATIONS.md on why a trusted receipt needs
        // CI issuance and signing.)
        validatePackReceipt(id, p, manifest, receipt);
      }
      const assuranceStatus = receipt ? receipt.assurance_status : p.assurance_status;
      return { id, dir, p, manifest, receipt, assuranceStatus };
    });
}

function buildArchive(pack) {
  // The full archive contains every manifest-listed source, the manifest, and
  // the terminal receipt. RECEIPT.json intentionally stays outside the manifest:
  // it binds that inventory, while the publication ledger binds the final tar.
  if (!pack.receipt) throw new Error(`${pack.id}/RECEIPT.json is required in a downloadable full pack`);
  const entries = pack.manifest.files.map(f => ({
    name: `${pack.id}/${f.path}`,
    data: fs.readFileSync(path.join(pack.dir, f.path))
  }));
  entries.push({ name: `${pack.id}/MANIFEST.json`, data: fs.readFileSync(path.join(pack.dir, 'MANIFEST.json')) });
  entries.push({ name: `${pack.id}/RECEIPT.json`, data: fs.readFileSync(path.join(pack.dir, 'RECEIPT.json')) });
  const buf = tar.build(entries, MTIME);
  const rel = `downloads/${pack.id}-${pack.p.version}.tar`;
  write(rel, buf);

  // Agent Skills edition: the exact SKILL.md plus its locally referenced
  // README/licence boundary, templates, examples, references, scripts and tests.
  // This is a real usable subset, distinct from both the bare client-side
  // SKILL.md and the full pack.
  const skillPaths = pack.manifest.files.map(file => file.path).filter(relative =>
    ['LICENSE', 'README.md', 'SKILL.md'].includes(relative)
      || /^(assets|examples|references|scripts|tests)\//.test(relative));
  if (!skillPaths.includes('SKILL.md')) throw new Error(`${pack.id}: manifest does not contain SKILL.md`);
  const skillEntries = skillPaths.map(relative => ({
    name: `${pack.id}/${relative}`,
    data: fs.readFileSync(path.join(pack.dir, relative))
  }));
  const skillBuf = tar.build(skillEntries, MTIME);
  const skillRel = `downloads/${pack.id}-${pack.p.version}-skill.tar`;
  write(skillRel, skillBuf);
  return {
    rel: `${BP}/${rel}`, sha256: U.sha256String(buf), bytes: buf.length,
    skillRel: `${BP}/${skillRel}`, skillSha256: U.sha256String(skillBuf),
    skillBytes: skillBuf.length, skillFiles: skillPaths.length
  };
}

function buildStarterKit() {
  const pilotRoot = path.join(ROOT, 'company-pilot');
  if (!fs.existsSync(pilotRoot)) return null;
  const selected = [
    { relative: 'LICENSE', source: path.join(ROOT, 'LICENSE') },
    ...U.walk(pilotRoot).map(relative => ({
      relative: `company-pilot/${relative}`,
      source: path.join(pilotRoot, relative)
    })),
    ...fs.readdirSync(path.join(ROOT, 'schema')).filter(name => /^pilot-.*\.schema\.json$/.test(name)).map(name => ({
      relative: `schema/${name}`,
      source: path.join(ROOT, 'schema', name)
    })),
    ...[
      'pilot-randomize.js', 'pilot-summary.js', 'pilot-tests.js', 'pilot-validate.js',
      'lib/jsonschema.js', 'lib/util.js'
    ].map(relative => ({ relative: `tools/${relative}`, source: path.join(ROOT, 'tools', relative) })),
    {
      relative: 'protocols/document-to-action-plan/adapters/generic-chat/prompt.md',
      source: path.join(ROOT, 'protocols', 'document-to-action-plan', 'adapters', 'generic-chat', 'prompt.md')
    }
  ].sort((a, b) => a.relative.localeCompare(b.relative));
  for (const file of selected) {
    if (!fs.existsSync(file.source) || !fs.statSync(file.source).isFile()) {
      throw new Error(`company starter dependency is missing: ${file.relative}`);
    }
  }
  const files = selected.map(file => file.relative);
  const entries = selected.map(file => ({
    name: `productivity-protocols-starter/${file.relative}`,
    data: fs.readFileSync(file.source)
  }));
  for (const file of selected) write(`start/files/${file.relative}`, fs.readFileSync(file.source));
  const data = tar.build(entries, MTIME);
  const relative = `downloads/company-pilot-starter-${CONFIG.softwareVersion}.tar`;
  write(relative, data);
  return { files, rel: `${BP}/${relative}`, sha256: U.sha256String(data), bytes: data.length };
}

function protocolPage(pack, dl) {
  const p = pack.p;
  const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;
  const list = a => `<ul>${(a || []).map(x => `<li>${esc(typeof x === 'string' ? x : JSON.stringify(x))}</li>`).join('')}</ul>`;
  const currentUse = p.id === CONFIG.firstTrial
    ? 'Candidate for bounded formative usability with approved copies or test material; not a proven productivity intervention.'
    : 'Inspection, local examples and method development only; not currently recommended as a company-impact intervention.';
  const genericPrompt = (() => {
    const fp = path.join(pack.dir, 'adapters', 'generic-chat', 'prompt.md');
    return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : null;
  })();
  const skillPath = path.join(pack.dir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) throw new Error(`${p.id}/SKILL.md is required for the novice download edition`);
  const skillText = fs.readFileSync(skillPath, 'utf8');
  const promptSourceId = `prompt-source-${p.id}`;
  const skillSourceId = `skill-source-${p.id}`;

  const statusPanel = `<div class="status-panel"><table>
${row('Protocol', `<code>${esc(p.id)}</code> v${esc(p.version)}`)}
${row('Assurance level', esc(p.assurance_level))}
${row('Risk class', esc(p.risk_class))}
${row('Privacy class', esc(p.privacy_class))}
${row('Intended audience', list(p.target_users))}
${row('Required capabilities', (p.required_capabilities || []).map(esc).join(', ') || '<span class="muted">none declared</span>')}
${row('Optional tools', (p.optional_tools || []).length ? p.optional_tools.map(tool => esc(tool.name)).join(', ') : '<span class="muted">none declared</span>')}
${row('Protocol assurance', `${assuranceBadge(pack.assuranceStatus)} <span class="small muted">receipt-backed engineering boundary</span>`)}
${row('Work evidence', `${evidenceBadge(p.productivity_evidence)} <span class="small muted">model output and company impact are not conflated</span>`)}
${row('Current recommended use', esc(currentUse))}
${row('Tested models', (p.tested_models || []).length ? (p.tested_models || []).map(esc).join(', ') : '<span class="muted">none — examples only</span>')}
${row('Tested environments', (p.tested_environments || []).length ? (p.tested_environments || []).map(esc).join('<br>') : '<span class="muted">none recorded</span>')}
${row('Adapter notes', 'Generic chat, Codex, Claude and local-agent guidance only; no plugin, MCP connector or connected integration is supplied.')}
${row('Network requirement', pack.manifest.network_required ? 'Declared by this pack.' : 'No network permission declared by the pack; any chosen AI service may still require a network and has its own data terms.')}
${row('Human time and company cost', '<span class="muted">Unmeasured in human use. Estimate and record locally before any feasibility run.</span>')}
${row('Last verified', esc(p.last_verified))}
${row('Download', `<a href="${dl.rel}"><code>${esc(p.id)}-${esc(p.version)}.tar</code></a> · <span class="small">sha256 <code>${dl.sha256}</code></span> · <span class="small muted">${dl.bytes} bytes</span>`)}
${row('Machine record', `<a href="${BP}/api/${esc(p.id)}.json">${esc(p.id)}.json</a>`)}
</table></div>`;

  const permRows = (p.permissions || []).map(x =>
    `<tr><td data-label="Action"><code>${esc(x.action)}</code></td><td data-label="Resource">${esc(x.resource)}</td><td data-label="Scope">${esc(x.scope)}</td><td data-label="Why">${esc(x.why)}</td></tr>`).join('');
  const testRows = (p.acceptance_tests || []).map(t =>
    `<tr><td data-label="Test"><code>${esc(t.id)}</code></td><td data-label="Kind">${esc(t.kind)}</td><td data-label="Statement">${esc(t.statement)}</td><td data-label="Check">${t.automated ? 'auto' : 'manual'}</td></tr>`).join('');
  const procRows = (p.procedure || []).map(s =>
    `<tr><td data-label="Step">${s.step}</td><td data-label="Kernel">${s.kernel_step}</td><td data-label="Action">${esc(s.action)}</td><td data-label="Check">${esc(s.check)}</td></tr>`).join('');
  const failureRows = (p.failure_modes || []).map(f =>
    `<tr><td data-label="Failure">${esc(f.mode)}</td><td data-label="How to detect it">${esc(f.detection)}</td><td data-label="Mitigation">${esc(f.mitigation)}</td></tr>`).join('');

  const body = `
${statusPanel}

<h2>When to use it</h2>
<h3>Use when</h3>${list(p.use_when)}
<h3>Do not use when</h3>${list(p.do_not_use_when)}

<h2>Boundary and permissions</h2>
<table class="contract-table"><thead><tr><th>Action</th><th>Resource</th><th>Scope</th><th>Why</th></tr></thead><tbody>${permRows}</tbody></table>
<h3>Prohibited</h3>${list(p.prohibited_actions)}
<h3>Human checkpoints</h3>${(p.human_checkpoints || []).length ? `<ul>${p.human_checkpoints.map(c => `<li><b>Before ${esc(c.before)}</b> — ${esc(c.why)}</li>`).join('')}</ul>` : '<p class="muted">None required at this risk level.</p>'}

<h2>When to stop and what can go wrong</h2>
<h3>Stop conditions</h3>${list(p.stop_conditions)}
<h3>Known failure modes</h3>
<table class="contract-table"><thead><tr><th>Failure</th><th>How to detect it</th><th>Mitigation</th></tr></thead><tbody>${failureRows}</tbody></table>

<h2>Procedure</h2>
<table class="contract-table"><thead><tr><th>#</th><th>Kernel</th><th>Action</th><th>Check</th></tr></thead><tbody>${procRows}</tbody></table>

<h2>Acceptance tests</h2>
<table class="contract-table"><thead><tr><th>Id</th><th>Kind</th><th>Statement</th><th></th></tr></thead><tbody>${testRows}</tbody></table>

<h2>Choose one way to start</h2>
<p>These are three distinct artefacts. If you are new to agents, begin with the prompt; use the skill only in a skills-compatible environment; use the full pack when you need its contract, examples, tests, integrity manifest and receipt.</p>
<div class="novice-actions">
  <section class="novice-action" id="copy-prompt"><h2>1. Copy the prompt</h2><p>No installation. Paste the bounded prompt into an approved agent and supply only approved material.</p>
    ${genericPrompt ? `<button type="button" class="copy action-button" data-target="${promptSourceId}">Copy prompt</button><details class="source-details"><summary>Review the exact prompt</summary><pre id="${promptSourceId}">${esc(genericPrompt)}</pre></details>` : '<p class="muted">No generic-chat prompt is included in this pack.</p>'}
  </section>
  <section class="novice-action" id="download-skill"><h2>2. Download the skill edition</h2><p>An Agent Skills-compatible deterministic archive containing the exact <code>SKILL.md</code>, README and licence plus its templates, examples, references, scripts and tests. It excludes the wider evaluation and adapter material.</p>
    <a class="action-button" href="${dl.skillRel}">Download skill .tar</a><p class="small">${dl.skillFiles} files · ${dl.skillBytes} bytes · SHA-256 <code>${dl.skillSha256}</code></p>
    <p class="small">Need only the source file? <button type="button" class="download-text action-button" data-target="${skillSourceId}" data-filename="SKILL.md" data-mime="text/markdown;charset=utf-8">Download exact SKILL.md</button></p>
    <details class="source-details"><summary>Review the exact SKILL.md</summary><pre id="${skillSourceId}">${esc(skillText)}</pre></details>
  </section>
  <section class="novice-action" id="download-pack"><h2>3. Download the full pack</h2><p>The deterministic archive contains the skill, contract, examples, tests, adapters, manifest and receipt.</p>
    <a class="action-button" href="${dl.rel}">Download full .tar</a><p class="small">Verify SHA-256 <code>${dl.sha256}</code>.</p>
  </section>
</div>
<p><b>Adapter notes (not a connected integration):</b> the full pack includes product and local-agent guidance under <code>adapters/</code>. Plugin or MCP execution remains deferred; no connector is installed or invoked by this pack. External writes default to preview-and-approve.</p>

<h2>Evidence status</h2>
<p>Work evidence: ${evidenceBadge(p.productivity_evidence)}. Existing live records are model-output benchmarks, not measurements of staff or company productivity. Any future result must state its setting, study stage, identification design, review status and claim boundary separately. See <a href="${BP}/status/">the two status ladders</a>.</p>`;
  const og = ASSET(`og/protocol-${p.id}.png`) || ASSET('og/protocols.png');
  return page(p.title, body, p.purpose, {
    canonical: `${BASE}${BP}/p/${p.id}/`,
    og,
    kicker: 'PRODUCTIVITY PROTOCOL',
    standfirst: p.purpose,
    backlink: { href: `${BP}/`, label: '← All protocols' }
  });
}

function indexPage(entries, proposalTemplate) {
  const rows = entries.map(e => `<tr data-level="${e.assurance_level}" data-risk="${e.risk_class}" data-assurance="${e.assurance_status}" data-evidence="${e.productivity_evidence}" data-task-tags="${encodedTags(e.task_tags)}" data-audience-tags="${encodedTags(e.audience_tags)}" data-required-tool-tags="${encodedTags(e.required_tool_tags)}" data-optional-tool-tags="${encodedTags(e.optional_tool_tags)}" data-text="${esc(([e.id, e.title, e.purpose, ...e.task_tags, ...e.audience_tags, ...e.required_tool_tags, ...e.optional_tool_tags].join(' ')).toLowerCase())}">
<td data-label="Protocol"><a href="${e.url}"><code>${esc(e.id)}</code></a><div class="sub">Task: ${esc(e.task_tags.join(', '))}</div></td>
<td data-label="Purpose" class="small">${esc(e.purpose)}<div class="facet-summary"><span><b>Audience:</b> ${esc(e.audience_tags.join(' · '))}</span><span><b>Required:</b> ${esc(e.required_tool_tags.join(', ') || 'none')}</span><span><b>Optional:</b> ${esc(e.optional_tool_tags.join(', ') || 'none')}</span></div></td>
<td data-label="Level">${esc(e.assurance_level)}</td>
<td data-label="Risk">${esc(e.risk_class)}</td>
<td data-label="Assurance">${assuranceBadge(e.assurance_status)}</td>
<td data-label="Work evidence">${evidenceBadge(e.productivity_evidence)}</td>
<td data-label="Start"><ul class="action-links"><li><a href="${e.url}#copy-prompt">Copy prompt</a></li><li><a href="${e.url}#download-skill" data-skill-url="${e.skill_download}">Skill edition</a></li><li><a href="${e.url}#download-pack" data-pack-url="${e.download}">Full pack</a></li></ul></td>
</tr>`).join('');

  const opts = (arr) => arr.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('');
  const facetValues = field => canonicalTags(entries.flatMap(entry => entry[field] || []));
  const dated = entries.filter(entry => entry.last_verified).sort((a, b) =>
    b.last_verified.localeCompare(a.last_verified) || a.title.localeCompare(b.title));
  const recentDates = canonicalTags(dated.map(entry => entry.last_verified)).sort().reverse().slice(0, 2);
  const recent = dated.filter(entry => recentDates.includes(entry.last_verified));
  const recentHtml = recent.length
    ? `<ul>${recent.map(entry => `<li><a href="${entry.url}">${esc(entry.title)}</a> — contract last verified <time datetime="${esc(entry.last_verified)}">${esc(entry.last_verified)}</time></li>`).join('')}</ul>`
    : '<p class="muted">No protocol has a recorded verification date in this build.</p>';
  const deprecated = entries.filter(entry => entry.assurance_status === 'DEPRECATED');
  const deprecatedHtml = deprecated.length
    ? `<ul>${deprecated.map(entry => `<li><a href="${entry.url}">${esc(entry.title)}</a> — ${assuranceBadge(entry.assurance_status)}</li>`).join('')}</ul>`
    : '<p class="muted">No protocols are marked <code>DEPRECATED</code> in this build.</p>';
  const body = `
<section class="starter-callout" aria-labelledby="starter-title"><div><h2 id="starter-title">New to AI agents? Begin with one bounded task.</h2><p>Use approved copies or test material, keep the agent read-only, and choose the evidence stage before inviting participants.</p></div><p><a class="button-link" href="${BP}/start/">Open the company starter →</a></p></section>

<h2>Evaluation programme — staged, not yet fielded</h2>
<p>This is a proposed progression for learning safely. It has not yet been run with company staff, and none of these stages currently establishes a company productivity effect.</p>
<section class="stage-grid" aria-label="Evidence stages">
  <section class="stage-card"><h3>1–5 people</h3><p>Formative usability: can people understand, operate and safely stop?</p><strong>No productivity estimate</strong></section>
  <section class="stage-card"><h3>6+ people</h3><p>Feasibility: can allocation, measurement, support and retention work?</p><strong>Effects remain exploratory</strong></section>
  <section class="stage-card"><h3>Controlled evaluation</h3><p>Use a justified, independently reviewed parallel design.</p><strong>Context-bound signal only</strong></section>
  <section class="stage-card"><h3>Organisational follow-up</h3><p>Observe governed ordinary use after a separate deployment decision.</p><strong>Not automatically causal</strong></section>
</section>

<aside class="evidence-boundary"><h2>What the existing evidence actually shows</h2><p>Three small version 0.1.0 predecessor model-output benchmarks found <code>NO_CLEAR_GAIN</code>. The changed 0.1.1 packs do not inherit those badges. No benchmark included human work, so staff time, accepted-output time, rework, cognitive burden, support labour, adoption and company outcomes remain unmeasured.</p></aside>

<p>Every protocol carries two independent status values: <b>protocol assurance</b> (is the pack well formed and what was checked?) and <b>work evidence</b> (what outcome was measured, in what setting, with what identification?). They are never merged, and a claim never exceeds the evidence. <a href="${BP}/status/">Read the two ladders.</a></p>

<div class="registry-section" id="recently-updated"><h2>Recently updated</h2><p class="small muted">Ordered from the contracts' <code>last_verified</code> dates. A verification date is not evidence of human use or field testing.</p>${recentHtml}</div>
<div class="registry-section" id="deprecated"><h2>Deprecated</h2>${deprecatedHtml}</div>

<div class="controls">
<label>Search<input id="q" placeholder="filter…"></label>
<label>Task<select id="f-task"><option value="">any</option>${opts(facetValues('task_tags'))}</select></label>
<label>Audience<select id="f-audience"><option value="">any</option>${opts(facetValues('audience_tags'))}</select></label>
<label>Required capability/tool<select id="f-required-tool"><option value="">any</option>${opts(facetValues('required_tool_tags'))}</select></label>
<label>Optional tool<select id="f-optional-tool"><option value="">any</option>${opts(facetValues('optional_tool_tags'))}</select></label>
<label>Level<select id="f-level"><option value="">any</option>${opts(['quick', 'verified', 'institutional'])}</select></label>
<label>Risk<select id="f-risk"><option value="">any</option>${opts(['low', 'moderate', 'high', 'critical'])}</select></label>
<label>Assurance<select id="f-assurance"><option value="">any</option>${opts(ASSURANCE.states.map(s => s.id))}</select></label>
<label>Work evidence<select id="f-evidence"><option value="">any</option>${opts(EVIDENCE.states.map(s => s.id))}</select></label>
</div>

<div class="table-wrap"><table id="reg" class="reg-table"><thead><tr><th>Protocol</th><th>Purpose and fit</th><th>Level</th><th>Risk</th><th>Assurance</th><th>Work evidence</th><th>Start</th></tr></thead>
<tbody>${rows}</tbody></table></div>
<p class="count-note"><span id="count"></span> · machine-readable: <a href="${BP}/api/protocols.json">protocols.json</a> · <a href="${BP}/api/registry.schema.json">schema</a> · <a href="${BP}/feed.json">feed</a></p>

<h2>How the library works</h2>
<ul>
<li><a href="${BP}/kernel/">The Verified Agent Work kernel</a> — the eight-step method every protocol instantiates.</li>
<li><a href="${BP}/status/">Two status ladders</a> — assurance and productivity evidence, kept separate.</li>
<li>Each pack ships a machine-readable contract, a skill, worked examples, tests, an evaluation design, adapters, a manifest of file hashes, and a receipt.</li>
<li>The YAML contract is not claimed as a new workflow language. The candidate contribution is the staged company adoption-and-evidence loop around it.</li>
</ul>

<section class="contribution-route" id="propose"><h2>Propose a recurring task</h2><p>The foundry starts with a real, repeated friction rather than an untested prompt. There is no connected submission endpoint in this candidate: open the existing proposal template below, complete it locally, and retain it for human review.</p>
<details><summary>Open the exact foundry proposal template</summary><p><button type="button" class="copy action-button" data-target="proposal-template-source">Copy template</button><button type="button" class="download-text action-button" data-target="proposal-template-source" data-filename="PROPOSAL_TEMPLATE.md" data-mime="text/markdown;charset=utf-8">Download template</button></p><pre id="proposal-template-source">${esc(proposalTemplate)}</pre></details></section>`;
  const og = ASSET('og/protocols.png');
  const cover = ASSET('art/productivity.svg');
  const pageNode = {
    '@type': 'CollectionPage', '@id': `${BASE}${BP}/#page`, url: `${BASE}${BP}/`,
    name: CONFIG.sectionName, description: CONFIG.description, inLanguage: CONFIG.language,
    ...(og ? { image: `${BASE}${og}` } : {}),
    isPartOf: { '@id': `${BASE}/#website` },
    license: 'https://creativecommons.org/publicdomain/zero/1.0/'
  };
  return page(CONFIG.sectionName, body, CONFIG.description, {
    canonical: `${BASE}${BP}/`, og, cover,
    kicker: 'EVIDENCE PRESS', standfirst: CONFIG.tagline, pageNode
  });
}

function startPage(starter) {
  const preferred = [
    'company-pilot/README.md', 'LICENSE', 'company-pilot/LICENSE',
    'company-pilot/DESIGN-AND-ANALYSIS.md',
    'company-pilot/templates/formative-usability-route.md',
    'company-pilot/templates/pilot-plan.template.json',
    'company-pilot/templates/task-bank.template.json',
    'company-pilot/templates/worker-information-and-consent.md',
    'company-pilot/templates/work-item-record.md',
    'company-pilot/templates/quality-rubric.md',
    'company-pilot/templates/incident-and-rollback-card.md',
    'company-pilot/templates/follow-up.template.json',
    'schema/pilot-plan.schema.json', 'tools/pilot-validate.js', 'tools/pilot-tests.js',
    'protocols/document-to-action-plan/adapters/generic-chat/prompt.md'
  ];
  const files = starter ? preferred.filter(file => starter.files.includes(file)).map(file =>
    `<li><a href="${BP}/start/files/${esc(file)}">${esc(file)}</a><span>plain source file</span></li>`
  ).join('') : '';
  const download = starter ? `<aside class="starter-download"><h2>Download the complete starter</h2><p><a class="button-link" href="${starter.rel}">Download deterministic .tar</a></p><p class="small">${starter.files.length} local files · ${starter.bytes} bytes</p><p class="small">SHA-256<br><code>${starter.sha256}</code></p></aside>`
    : '<aside class="evidence-boundary"><h2>Starter unavailable</h2><p>The company-pilot source folder was absent from this build.</p></aside>';
  const body = `
<aside class="evidence-boundary"><h2>Evidence boundary</h2><p>This kit supports formative usability and a bounded feasibility rehearsal. It does not make the protocol field-ready, turn a small crossover into an impact study, or establish that any company will benefit.</p></aside>
<h2>Staged evaluation programme — not yet fielded</h2>
<p>No company has yet run this programme with staff. The stages below are a prospective learning sequence, not evidence of adoption, productivity or impact.</p>
<section class="stage-grid" aria-label="Choose the evidence stage">
  <section class="stage-card"><h3>Formative usability</h3><p>Use with 1–5 consenting participants to find comprehension, operation, stopping and support problems.</p><strong>No effect estimate</strong></section>
  <section class="stage-card"><h3>Feasibility</h3><p>Use the frozen task bank and allocation records to rehearse recruitment, measurement, cost capture and retention.</p><strong>No powered benefit claim</strong></section>
  <section class="stage-card"><h3>Controlled signal</h3><p>Prepare a separate, justified and independently reviewed randomized parallel B–C design.</p><strong>Not supplied by this rehearsal</strong></section>
  <section class="stage-card"><h3>Field follow-up</h3><p>Observe use, burden, costs, errors and outcomes only after a separately governed deployment decision.</p><strong>Association is not causation</strong></section>
</section>
<div class="starter-layout"><div>
  <section class="starter-panel"><h2>Run it in this order</h2><ol>
    <li>Choose a routine, low-consequence task with a named owner and a result the team already knows how to judge.</li>
    <li>Record affected people, approved data location, retention, human approval, rollback and stop conditions before using an agent.</li>
    <li>Choose formative or feasibility. Do not promote either route into an adoption decision based on an estimated productivity effect.</li>
    <li>For feasibility, freeze the plan, task bank, configuration, prompts, rubric, allocation and analysis before work begins.</li>
    <li>Retain every planned work item, including missing, abandoned and technically failed items; record total human effort, tool cost, errors, burden and incidents separately.</li>
    <li>Review only the next-stage decision: continue one stage, revise and rerun, or stop.</li>
  </ol></section>
  <section class="starter-panel"><h2>Read before downloading</h2><ul class="starter-files">${files}</ul></section>
</div>${download}</div>`;
  return page('Company starter kit', body, 'A no-install formative route and facilitator-run feasibility kit for bounded AI-agent work.', {
    canonical: `${BASE}${BP}/start/`,
    og: ASSET('og/protocols.png'),
    kicker: 'PRODUCTIVITY PROTOCOLS · COMPANY STARTER',
    standfirst: 'Choose the evidence stage before inviting people. Learn first; compare only when the design can support it.',
    backlink: { href: `${BP}/`, label: '← All protocols' }
  });
}

function feeds(entries) {
  const items = entries.map(e => ({
    id: `${BASE}${e.url}`,
    url: `${BASE}${e.url}`,
    title: `${e.id} ${e.version}`,
    summary: e.purpose,
    date_modified: GIT.sourceDate || null
  }));
  write('feed.json', JSON.stringify({
    version: 'https://jsonfeed.org/version/1.1',
    title: `${CONFIG.sectionName}`,
    home_page_url: `${BASE}${BP}/`,
    feed_url: `${BASE}${BP}/feed.json`,
    description: CONFIG.description,
    items
  }, null, 2) + '\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(CONFIG.sectionName)}</title>
<link>${BASE}${BP}/</link>
<description>${esc(CONFIG.description)}</description>
${items.map(i => `<item><title>${esc(i.title)}</title><link>${i.url}</link><guid>${i.id}</guid><description>${esc(i.summary)}</description></item>`).join('\n')}
</channel></rss>\n`;
  write('feed.xml', rss);

  const urls = [`${BASE}${BP}/`, `${BASE}${BP}/start/`, `${BASE}${BP}/kernel/`, `${BASE}${BP}/status/`, ...entries.map(e => `${BASE}${e.url}`)];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u}</loc></url>`).join('\n')}
</urlset>\n`);

  const llms = `# ${CONFIG.sectionName}\n\n> ${CONFIG.tagline}\n\n${CONFIG.description}\n\n## Protocols\n\n` +
    entries.map(e => `- [${e.id} ${e.version}](${BASE}${e.url}) — ${e.purpose} (assurance: ${e.assurance_status}; evidence: ${e.productivity_evidence})`).join('\n') +
    `\n\n## Start\n\n- Company starter: ${BASE}${BP}/start/\n\n## Machine-readable\n\n- Registry: ${BASE}${BP}/api/protocols.json\n- Versioned schemas: ${BASE}${BP}/api/v2/\n- Kernel: ${BASE}${BP}/kernel/\n- Status ladders: ${BASE}${BP}/status/\n`;
  write('llms.txt', llms);
  write('llms-full.txt', llms + `\n## Note\n\nProductivity claims are gated by each protocol's productivity_evidence value. A protocol at NO_IMPACT_EVIDENCE makes no benefit claim.\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${BASE}${BP}/sitemap.xml\n`);
}

function copyReference() {
  // Copy schemas, status ladders, and kernel docs into dist for a self-contained candidate.
  for (const f of fs.readdirSync(path.join(ROOT, 'schema')).sort()) {
    const data = fs.readFileSync(path.join(ROOT, 'schema', f));
    write(`api/${f}`, data);
    write(`api/v2/${f}`, data);
  }
  const statusIndex = ['# Two status ladders', '', 'See ladders.md, protocol-assurance.json, productivity-evidence.json.'].join('\n');
  for (const f of fs.readdirSync(path.join(ROOT, 'status'))) write(`status/${f}`, fs.readFileSync(path.join(ROOT, 'status', f)));
  write('status/index.html', page('Two status ladders', `<pre>${esc(fs.readFileSync(path.join(ROOT, 'status', 'ladders.md'), 'utf8'))}</pre>`, 'Protocol assurance and productivity evidence, kept separate.', {
    canonical: `${BASE}${BP}/status/`, kicker: 'PRODUCTIVITY PROTOCOLS', og: ASSET('og/protocols.png'),
    backlink: { href: `${BP}/`, label: '← All protocols' }
  }));
  for (const f of fs.readdirSync(path.join(ROOT, 'kernel'))) write(`kernel/${f}`, fs.readFileSync(path.join(ROOT, 'kernel', f)));
  write('kernel/index.html', page('The Verified Agent Work kernel', `<pre>${esc(fs.readFileSync(path.join(ROOT, 'kernel', 'verified-agent-work.md'), 'utf8'))}</pre>`, 'The eight-step method every protocol instantiates.', {
    canonical: `${BASE}${BP}/kernel/`, kicker: 'PRODUCTIVITY PROTOCOLS', og: ASSET('og/protocols.png'),
    backlink: { href: `${BP}/`, label: '← All protocols' }
  }));
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  write('assets/protocols.js', PROTO_JS);  // external registry behaviour (strict CSP)
  write('assets/protocols.css', SUPPLEMENT);
  const packs = loadPacks();
  const entries = [];
  for (const pack of packs) {
    const dl = buildArchive(pack);
    write(`p/${pack.id}/index.html`, protocolPage(pack, dl));
    const p = pack.p;
    // per-protocol machine record
    const record = JSON.stringify({
      contract: p,
      achieved_assurance_status: pack.assuranceStatus,
      manifest: pack.manifest
    }, null, 2) + '\n';
    write(`api/${pack.id}.json`, record);
    write(`api/v2/${pack.id}.json`, record);
    entries.push({
      id: p.id, version: p.version, title: p.title, purpose: p.purpose,
      assurance_level: p.assurance_level, risk_class: p.risk_class, privacy_class: p.privacy_class,
      assurance_status: pack.assuranceStatus, productivity_evidence: p.productivity_evidence,
      tested_models: p.tested_models || [], last_verified: p.last_verified || null,
      ...registryTags(p),
      network_required: pack.manifest.network_required,
      url: `${BP}/p/${p.id}/`,
      skill_download: dl.skillRel, skill_sha256: dl.skillSha256, skill_bytes: dl.skillBytes,
      download: dl.rel, sha256: dl.sha256
    });
  }
  const registry = {
    schema_version: CONFIG.schemaVersion, site: CONFIG.sectionName, baseUrl: BASE,
    description: CONFIG.description, schema: `${BASE}${BP}/api/registry.schema.json`,
    generated: {
      sourceCommit: GIT.sourceCommit,
      sourceDate: GIT.sourceDate,
      builder: `build-protocols@${CONFIG.softwareVersion}`,
      source_commit_full: GIT.sourceCommitFull,
      source_tree: GIT.sourceTree,
      dirty: GIT.dirty
    },
    count: entries.length, protocols: entries
  };
  const regErrs = validate(REGISTRY_SCHEMA, registry);
  if (regErrs.length) { console.error('registry failed its own schema:'); regErrs.forEach(e => console.error('  ' + e.path + ': ' + e.msg)); process.exit(1); }
  const registryJSON = JSON.stringify(registry, null, 2) + '\n';
  write('api/protocols.json', registryJSON);
  write('api/v2/protocols.json', registryJSON);
  const starter = buildStarterKit();
  const proposalTemplate = fs.readFileSync(path.join(ROOT, 'foundry', 'PROPOSAL_TEMPLATE.md'), 'utf8');
  write('index.html', indexPage(entries, proposalTemplate));
  write('start/index.html', startPage(starter));
  copyReference();
  feeds(entries);
  console.log(`build-protocols: ${entries.length} protocols -> ${path.relative(process.cwd(), DIST)} (commit ${GIT.sourceCommit || 'local'})`);
}

if (require.main === module) main();
module.exports = { main, validatePackReceipt };
