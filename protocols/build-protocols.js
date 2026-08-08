#!/usr/bin/env node
'use strict';
/*
 * build-protocols.js — the Productivity Protocols static-site builder.
 * Dependency-free (Node >= 16). Emits ./dist (i.e. protocols/dist), NEVER the
 * parent site's dist/. Timestamps derive from the git commit, not the clock, and
 * pack archives are deterministic, so a clean checkout rebuilds byte-for-byte.
 *
 * Output (mounted at /protocols/):
 *   index.html                     registry landing page (client-side filters)
 *   p/<id>/index.html              per-protocol page (both status ladders, downloads, install)
 *   downloads/<id>-<version>.tar   deterministic pack archive
 *   api/protocols.json             machine-readable registry (validates against registry.schema.json)
 *   api/<id>.json                  per-protocol machine record (contract + manifest)
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
const REGISTRY_SCHEMA = U.readJSON(path.join(ROOT, 'schema', 'registry.schema.json'));
const RECEIPT_SCHEMA = U.readJSON(path.join(ROOT, 'schema', 'receipt.schema.json'));

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const write = (rel, data) => {
  const p = path.join(DIST, rel);
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
// script-src 'self' forbids inline <script>, so the registry's behaviour lives in
// an external /protocols/assets/protocols.js; style-src allows the inline
// supplement below; img-src allows same-origin art plus the data: favicon.
const PAGE_CSP = [
  "default-src 'self'", "base-uri 'none'", "object-src 'none'", "form-action 'none'",
  "script-src 'self'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data:",
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
document.querySelectorAll('button.copy[data-target]').forEach(function (b) {
  b.addEventListener('click', function () {
    var t = document.getElementById(b.dataset.target);
    if (!t) return;
    navigator.clipboard.writeText(t.textContent).then(function () {
      var prev = b.textContent; b.textContent = 'Copied';
      setTimeout(function () { b.textContent = prev; }, 1200);
    });
  });
});
var reg = document.getElementById('reg');
if (reg) {
  var rowsEl = [].slice.call(reg.querySelectorAll('tbody tr'));
  var q = document.getElementById('q'), fl = document.getElementById('f-level'),
      fr = document.getElementById('f-risk'), fa = document.getElementById('f-assurance'),
      fe = document.getElementById('f-evidence'), cnt = document.getElementById('count');
  var apply = function () {
    var t = (q.value || '').toLowerCase(), n = 0;
    rowsEl.forEach(function (r) {
      var ok = (!t || r.dataset.text.indexOf(t) !== -1)
        && (!fl.value || r.dataset.level === fl.value)
        && (!fr.value || r.dataset.risk === fr.value)
        && (!fa.value || r.dataset.assurance === fa.value)
        && (!fe.value || r.dataset.evidence === fe.value);
      r.style.display = ok ? '' : 'none'; if (ok) n++;
    });
    cnt.textContent = n + ' of ' + rowsEl.length + ' protocols';
  };
  [q, fl, fr, fa, fe].forEach(function (el) { el.addEventListener('input', apply); });
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
.controls input{min-width:15rem}
.reg-table td .sub{font-family:var(--sans);font-size:.78rem;color:var(--muted);margin-top:.15rem}
.count-note{font-family:var(--sans);font-size:.85rem;color:var(--muted);margin:.7rem 0 0}
.muted{color:var(--muted)}
.small{font-size:.82rem}
`;

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
${social}
<script defer src="${BP}/assets/protocols.js?v=${JS_V}"></script>
<script type="application/ld+json">
${jsonldGraph(pageNode)}
</script>
<style>${SUPPLEMENT}</style>
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
    <p>${esc(CONFIG.sectionName)} publishes methods, not papers: open, tested workflows for using AI agents, each with its assurance and its honestly-measured benefit attached. Part of <a href="${BASE}/">${esc(SITE_NAME)}</a>.</p>
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
      const manifest = U.readJSON(path.join(dir, 'MANIFEST.json'));
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
        const rerrs = validate(RECEIPT_SCHEMA, receipt);
        if (rerrs.length) throw new Error(`${id}/RECEIPT.json is not schema-valid: ${rerrs.map(e => e.path + ' ' + e.msg).join('; ')}`);
        if (receipt.subject_id !== id) throw new Error(`${id}/RECEIPT.json subject_id '${receipt.subject_id}' does not match pack`);
        const failed = receipt.checks.filter(c => !c.passed).map(c => c.name);
        if (failed.length) throw new Error(`${id}/RECEIPT.json records failed gates (${failed.join(', ')}); refusing to publish`);
      }
      const assuranceStatus = receipt ? receipt.assurance_status : p.assurance_status;
      return { id, dir, p, manifest, assuranceStatus };
    });
}

function buildArchive(pack) {
  // Archive every manifest-listed file plus the MANIFEST itself, rooted at <id>/.
  const entries = pack.manifest.files.map(f => ({
    name: `${pack.id}/${f.path}`,
    data: fs.readFileSync(path.join(pack.dir, f.path))
  }));
  entries.push({ name: `${pack.id}/MANIFEST.json`, data: fs.readFileSync(path.join(pack.dir, 'MANIFEST.json')) });
  const buf = tar.build(entries, MTIME);
  const rel = `downloads/${pack.id}-${pack.p.version}.tar`;
  write(rel, buf);
  return { rel: `${BP}/${rel}`, sha256: U.sha256String(buf), bytes: buf.length };
}

function protocolPage(pack, dl) {
  const p = pack.p;
  const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;
  const list = a => `<ul>${(a || []).map(x => `<li>${esc(typeof x === 'string' ? x : JSON.stringify(x))}</li>`).join('')}</ul>`;
  const genericPrompt = (() => {
    const fp = path.join(pack.dir, 'adapters', 'generic-chat', 'prompt.md');
    return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : null;
  })();

  const statusPanel = `<div class="status-panel"><table>
${row('Protocol', `<code>${esc(p.id)}</code> v${esc(p.version)}`)}
${row('Assurance level', esc(p.assurance_level))}
${row('Risk class', esc(p.risk_class))}
${row('Privacy class', esc(p.privacy_class))}
${row('Protocol assurance', `${assuranceBadge(pack.assuranceStatus)} <span class="small muted">receipt-backed</span>`)}
${row('Productivity evidence', `${evidenceBadge(p.productivity_evidence)} <span class="small muted">benefit is measured, never assumed</span>`)}
${row('Last verified', esc(p.last_verified))}
${row('Download', `<a href="${dl.rel}"><code>${esc(p.id)}-${esc(p.version)}.tar</code></a> · <span class="small">sha256 <code>${dl.sha256}</code></span> · <span class="small muted">${dl.bytes} bytes</span>`)}
${row('Machine record', `<a href="${BP}/api/${esc(p.id)}.json">${esc(p.id)}.json</a>`)}
</table></div>`;

  const permRows = (p.permissions || []).map(x =>
    `<tr><td><code>${esc(x.action)}</code></td><td>${esc(x.resource)}</td><td>${esc(x.scope)}</td><td>${esc(x.why)}</td></tr>`).join('');
  const testRows = (p.acceptance_tests || []).map(t =>
    `<tr><td><code>${esc(t.id)}</code></td><td>${esc(t.kind)}</td><td>${esc(t.statement)}</td><td>${t.automated ? 'auto' : 'manual'}</td></tr>`).join('');
  const procRows = (p.procedure || []).map(s =>
    `<tr><td>${s.step}</td><td>${s.kernel_step}</td><td>${esc(s.action)}</td><td>${esc(s.check)}</td></tr>`).join('');

  const body = `
${statusPanel}

<h2>When to use it</h2>
<h3>Use when</h3>${list(p.use_when)}
<h3>Do not use when</h3>${list(p.do_not_use_when)}

<h2>Boundary and permissions</h2>
<table><thead><tr><th>Action</th><th>Resource</th><th>Scope</th><th>Why</th></tr></thead><tbody>${permRows}</tbody></table>
<h3>Prohibited</h3>${list(p.prohibited_actions)}
<h3>Human checkpoints</h3>${(p.human_checkpoints || []).length ? `<ul>${p.human_checkpoints.map(c => `<li><b>Before ${esc(c.before)}</b> — ${esc(c.why)}</li>`).join('')}</ul>` : '<p class="muted">None required at this risk level.</p>'}

<h2>Procedure</h2>
<table><thead><tr><th>#</th><th>Kernel</th><th>Action</th><th>Check</th></tr></thead><tbody>${procRows}</tbody></table>

<h2>Acceptance tests</h2>
<table><thead><tr><th>Id</th><th>Kind</th><th>Statement</th><th></th></tr></thead><tbody>${testRows}</tbody></table>

<h2>Install</h2>
<p>Three editions. The copy-and-run edition needs no installation.</p>
${genericPrompt ? `<details><summary>Copy-and-run edition (no install)</summary>
<button class="copy" data-target="cr">Copy</button>
<pre id="cr">${esc(genericPrompt)}</pre></details>` : ''}
<ul>
<li><b>Downloadable skill:</b> <a href="${dl.rel}">download the pack</a>, verify its sha256 against the value above, then install <code>SKILL.md</code> and the pack in a skills-compatible environment.</li>
<li><b>Connected workflow:</b> see the pack's <code>adapters/</code> for Claude, Codex, and local-agent notes. External writes default to preview-and-approve.</li>
</ul>

<h2>Evidence status</h2>
<p>Productivity evidence: ${evidenceBadge(p.productivity_evidence)}. This page states how the protocol works; it does not claim it improves your work unless the evidence status says so. See <a href="${BP}/status/">the two status ladders</a>.</p>`;
  const og = ASSET(`og/protocol-${p.id}.png`) || ASSET('og/protocols.png');
  return page(p.title, body, p.purpose, {
    canonical: `${BASE}${BP}/p/${p.id}/`,
    og,
    kicker: 'PRODUCTIVITY PROTOCOL',
    standfirst: p.purpose,
    backlink: { href: `${BP}/`, label: '← All protocols' }
  });
}

function indexPage(entries) {
  const rows = entries.map(e => `<tr data-level="${e.assurance_level}" data-risk="${e.risk_class}" data-assurance="${e.assurance_status}" data-evidence="${e.productivity_evidence}" data-text="${esc((e.id + ' ' + e.title + ' ' + e.purpose).toLowerCase())}">
<td><a href="${e.url}"><code>${esc(e.id)}</code></a><div class="sub">${esc(e.title)}</div></td>
<td class="small">${esc(e.purpose)}</td>
<td>${esc(e.assurance_level)}</td>
<td>${esc(e.risk_class)}</td>
<td>${assuranceBadge(e.assurance_status)}</td>
<td>${evidenceBadge(e.productivity_evidence)}</td>
<td><a class="small" href="${e.download}">.tar</a></td>
</tr>`).join('');

  const opts = (arr) => arr.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('');
  const body = `
<p>Every protocol carries two independent status values: <b>protocol assurance</b> (is it well built and safe?) and <b>productivity evidence</b> (does it help, and how do we know?). They are never merged, and a claim never exceeds the evidence. <a href="${BP}/status/">Read the two ladders.</a></p>

<div class="controls">
<label>Search<input id="q" placeholder="filter…"></label>
<label>Level<select id="f-level"><option value="">any</option>${opts(['quick', 'verified', 'institutional'])}</select></label>
<label>Risk<select id="f-risk"><option value="">any</option>${opts(['low', 'moderate', 'high', 'critical'])}</select></label>
<label>Assurance<select id="f-assurance"><option value="">any</option>${opts(ASSURANCE.states.map(s => s.id))}</select></label>
<label>Evidence<select id="f-evidence"><option value="">any</option>${opts(EVIDENCE.states.map(s => s.id))}</select></label>
</div>

<div class="table-wrap"><table id="reg" class="reg-table"><thead><tr><th>Protocol</th><th>Purpose</th><th>Level</th><th>Risk</th><th>Assurance</th><th>Evidence</th><th>Get</th></tr></thead>
<tbody>${rows}</tbody></table></div>
<p class="count-note"><span id="count"></span> · machine-readable: <a href="${BP}/api/protocols.json">protocols.json</a> · <a href="${BP}/api/registry.schema.json">schema</a> · <a href="${BP}/feed.json">feed</a></p>

<h2>How the library works</h2>
<ul>
<li><a href="${BP}/kernel/">The Verified Agent Work kernel</a> — the eight-step method every protocol instantiates.</li>
<li><a href="${BP}/status/">Two status ladders</a> — assurance and productivity evidence, kept separate.</li>
<li>Each pack ships a machine-readable contract, a skill, worked examples, tests, an evaluation design, adapters, a manifest of file hashes, and a receipt.</li>
</ul>`;
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

  const urls = [`${BASE}${BP}/`, `${BASE}${BP}/kernel/`, `${BASE}${BP}/status/`, ...entries.map(e => `${BASE}${e.url}`)];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u}</loc></url>`).join('\n')}
</urlset>\n`);

  const llms = `# ${CONFIG.sectionName}\n\n> ${CONFIG.tagline}\n\n${CONFIG.description}\n\n## Protocols\n\n` +
    entries.map(e => `- [${e.id} ${e.version}](${BASE}${e.url}) — ${e.purpose} (assurance: ${e.assurance_status}; evidence: ${e.productivity_evidence})`).join('\n') +
    `\n\n## Machine-readable\n\n- Registry: ${BASE}${BP}/api/protocols.json\n- Schemas: ${BASE}${BP}/api/\n- Kernel: ${BASE}${BP}/kernel/\n- Status ladders: ${BASE}${BP}/status/\n`;
  write('llms.txt', llms);
  write('llms-full.txt', llms + `\n## Note\n\nProductivity claims are gated by each protocol's productivity_evidence value. A protocol at NO_IMPACT_EVIDENCE makes no benefit claim.\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${BASE}${BP}/sitemap.xml\n`);
}

function copyReference() {
  // Copy schemas, status ladders, and kernel docs into dist for a self-contained candidate.
  for (const f of fs.readdirSync(path.join(ROOT, 'schema'))) write(`api/${f}`, fs.readFileSync(path.join(ROOT, 'schema', f)));
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
  const packs = loadPacks();
  const entries = [];
  for (const pack of packs) {
    const dl = buildArchive(pack);
    write(`p/${pack.id}/index.html`, protocolPage(pack, dl));
    const p = pack.p;
    // per-protocol machine record
    write(`api/${pack.id}.json`, JSON.stringify({ contract: p, manifest: pack.manifest }, null, 2) + '\n');
    entries.push({
      id: p.id, version: p.version, title: p.title, purpose: p.purpose,
      assurance_level: p.assurance_level, risk_class: p.risk_class, privacy_class: p.privacy_class,
      assurance_status: pack.assuranceStatus, productivity_evidence: p.productivity_evidence,
      tested_models: p.tested_models || [], last_verified: p.last_verified || null,
      network_required: pack.manifest.network_required,
      url: `${BP}/p/${p.id}/`, download: dl.rel, sha256: dl.sha256
    });
  }
  const registry = {
    schema_version: '1.0', site: CONFIG.sectionName, baseUrl: BASE,
    description: CONFIG.description, schema: `${BASE}${BP}/api/registry.schema.json`,
    generated: { sourceCommit: GIT.sourceCommit, sourceDate: GIT.sourceDate, builder: `build-protocols@${CONFIG.softwareVersion}` },
    count: entries.length, protocols: entries
  };
  const regErrs = validate(REGISTRY_SCHEMA, registry);
  if (regErrs.length) { console.error('registry failed its own schema:'); regErrs.forEach(e => console.error('  ' + e.path + ': ' + e.msg)); process.exit(1); }
  write('api/protocols.json', JSON.stringify(registry, null, 2) + '\n');
  write('index.html', indexPage(entries));
  copyReference();
  feeds(entries);
  console.log(`build-protocols: ${entries.length} protocols -> ${path.relative(process.cwd(), DIST)} (commit ${GIT.sourceCommit || 'local'})`);
}

if (require.main === module) main();
module.exports = { main };
