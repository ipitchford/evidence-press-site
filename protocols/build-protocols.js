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

const CSS = `
:root{--ink:#1a1a1a;--bg:#ffffff;--mut:#5c5c5c;--line:#e2e2e2;--accent:#0b5cad;--soft:#f6f7f9;--code:#f0f1f3}
*{box-sizing:border-box}
body{margin:0;color:var(--ink);background:var(--bg);font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:960px;margin:0 auto;padding:0 20px}
header.site{border-bottom:1px solid var(--line);padding:22px 0}
header.site .kicker{font-size:13px;color:var(--mut);letter-spacing:.02em}
header.site h1{margin:.15em 0 .1em;font-size:26px}
header.site p{margin:.2em 0 0;color:var(--mut)}
main{padding:26px 0 60px}
h2{font-size:20px;margin:1.6em 0 .5em;border-bottom:1px solid var(--line);padding-bottom:.25em}
h3{font-size:16px;margin:1.3em 0 .4em}
code,.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.9em}
table{border-collapse:collapse;width:100%;margin:.6em 0;font-size:14px}
th,td{border:1px solid var(--line);padding:6px 9px;text-align:left;vertical-align:top}
th{background:var(--soft);font-weight:600}
.badge{display:inline-block;font:600 11px/1.4 ui-monospace,monospace;padding:2px 7px;border:1px solid var(--line);border-radius:3px;background:var(--soft);white-space:nowrap}
.badge.pos{border-color:#1f7a3d;color:#1f7a3d}
.badge.neg{border-color:#a3301f;color:#a3301f}
.badge.neu{color:var(--mut)}
.panel{border:1px solid var(--line);border-radius:5px;padding:14px 16px;background:var(--soft);margin:1em 0}
.panel table{margin:0;background:var(--bg)}
.controls{display:flex;flex-wrap:wrap;gap:10px;margin:1em 0}
.controls label{font-size:13px;color:var(--mut);display:flex;flex-direction:column;gap:3px}
.controls select,.controls input{font:14px inherit;padding:5px 7px;border:1px solid var(--line);border-radius:4px;background:var(--bg)}
pre{background:var(--code);border:1px solid var(--line);border-radius:5px;padding:12px;overflow:auto;font-size:13px}
.muted{color:var(--mut)}
.small{font-size:13px}
footer{border-top:1px solid var(--line);color:var(--mut);font-size:13px;padding:20px 0 40px;margin-top:30px}
button.copy{font:13px inherit;padding:5px 10px;border:1px solid var(--line);border-radius:4px;background:var(--bg);cursor:pointer}
details>summary{cursor:pointer;font-weight:600;margin:.5em 0}
@media (prefers-color-scheme:dark){
 :root{--ink:#e8e8e8;--bg:#141414;--mut:#9aa0a6;--line:#2c2c2c;--accent:#5aa2e6;--soft:#1c1c1c;--code:#1c1c1c}
}
`;

function page(title, body, desc) {
  return `<!doctype html>
<html lang="${CONFIG.language}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc || CONFIG.description)}">
<link rel="canonical" href="${BASE}${BP}/">
<style>${CSS}</style>
</head><body>
<header class="site"><div class="wrap">
<div class="kicker"><a href="${BP}/">${esc(CONFIG.sectionName)}</a> · a section of <a href="${BASE}/">${esc(CONFIG.parentSite)}</a></div>
<h1>${esc(title)}</h1>
</div></header>
<main><div class="wrap">${body}</div></main>
<footer><div class="wrap">
${esc(CONFIG.sectionName)} v${CONFIG.softwareVersion} · kernel v${CONFIG.kernelVersion} ·
build ${GIT.sourceCommit || 'local'} (${GIT.sourceDate || 'uncommitted'}) ·
content CC0-1.0, code Apache-2.0 ·
<a href="${BP}/api/protocols.json">registry JSON</a> · <a href="${BP}/llms.txt">llms.txt</a>
</div></footer>
</body></html>`;
}

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

  const statusPanel = `<div class="panel"><table>
${row('Protocol', `<code>${esc(p.id)}</code> v${esc(p.version)}`)}
${row('Purpose', esc(p.purpose))}
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
<p class="muted"><a href="${BP}/">← all protocols</a></p>
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
<p>Productivity evidence: ${evidenceBadge(p.productivity_evidence)}. This page states how the protocol works; it does not claim it improves your work unless the evidence status says so. See <a href="${BP}/status/">the two status ladders</a>.</p>

<script>
document.querySelectorAll('button.copy').forEach(b=>b.addEventListener('click',()=>{
  const t=document.getElementById(b.dataset.target);navigator.clipboard.writeText(t.textContent).then(()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1200)});
}));
</script>`;
  return page(p.title, body, p.purpose);
}

function indexPage(entries) {
  const rows = entries.map(e => `<tr data-level="${e.assurance_level}" data-risk="${e.risk_class}" data-assurance="${e.assurance_status}" data-evidence="${e.productivity_evidence}" data-text="${esc((e.id + ' ' + e.title + ' ' + e.purpose).toLowerCase())}">
<td><a href="${e.url}"><code>${esc(e.id)}</code></a><div class="small muted">${esc(e.title)}</div></td>
<td class="small">${esc(e.purpose)}</td>
<td>${esc(e.assurance_level)}</td>
<td>${esc(e.risk_class)}</td>
<td>${assuranceBadge(e.assurance_status)}</td>
<td>${evidenceBadge(e.productivity_evidence)}</td>
<td><a class="small" href="${e.download}">.tar</a></td>
</tr>`).join('');

  const opts = (arr) => arr.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('');
  const body = `
<p>${esc(CONFIG.description)}</p>
<p class="small muted">Every protocol carries two independent status values: <b>protocol assurance</b> (is it well built and safe?) and <b>productivity evidence</b> (does it help, and how do we know?). They are never merged. <a href="${BP}/status/">Read the ladders.</a></p>

<div class="controls">
<label>Search<input id="q" placeholder="filter…"></label>
<label>Level<select id="f-level"><option value="">any</option>${opts(['quick', 'verified', 'institutional'])}</select></label>
<label>Risk<select id="f-risk"><option value="">any</option>${opts(['low', 'moderate', 'high', 'critical'])}</select></label>
<label>Assurance<select id="f-assurance"><option value="">any</option>${opts(ASSURANCE.states.map(s => s.id))}</select></label>
<label>Evidence<select id="f-evidence"><option value="">any</option>${opts(EVIDENCE.states.map(s => s.id))}</select></label>
</div>

<table id="reg"><thead><tr><th>Protocol</th><th>Purpose</th><th>Level</th><th>Risk</th><th>Assurance</th><th>Evidence</th><th>Get</th></tr></thead>
<tbody>${rows}</tbody></table>
<p class="small muted"><span id="count"></span> · machine-readable: <a href="${BP}/api/protocols.json">protocols.json</a> · <a href="${BP}/api/registry.schema.json">schema</a> · <a href="${BP}/feed.json">feed</a></p>

<h2>How the library works</h2>
<ul>
<li><a href="${BP}/kernel/">The Verified Agent Work kernel</a> — the eight-step method every protocol instantiates.</li>
<li><a href="${BP}/status/">Two status ladders</a> — assurance and productivity evidence, kept separate.</li>
<li>Each pack ships a machine-readable contract, a skill, worked examples, tests, an evaluation design, adapters, a manifest of file hashes, and a receipt.</li>
</ul>

<script>
const rowsEl=[...document.querySelectorAll('#reg tbody tr')];
const q=document.getElementById('q'),fl=document.getElementById('f-level'),fr=document.getElementById('f-risk'),fa=document.getElementById('f-assurance'),fe=document.getElementById('f-evidence'),cnt=document.getElementById('count');
function apply(){const t=q.value.toLowerCase();let n=0;rowsEl.forEach(r=>{const ok=(!t||r.dataset.text.includes(t))&&(!fl.value||r.dataset.level===fl.value)&&(!fr.value||r.dataset.risk===fr.value)&&(!fa.value||r.dataset.assurance===fa.value)&&(!fe.value||r.dataset.evidence===fe.value);r.style.display=ok?'':'none';if(ok)n++});cnt.textContent=n+' of '+rowsEl.length+' protocols';}
[q,fl,fr,fa,fe].forEach(el=>el.addEventListener('input',apply));apply();
</script>`;
  return page(CONFIG.sectionName, body, CONFIG.description);
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
  write('status/index.html', page('Two status ladders', `<pre>${esc(fs.readFileSync(path.join(ROOT, 'status', 'ladders.md'), 'utf8'))}</pre>`, 'Protocol assurance and productivity evidence, kept separate.'));
  for (const f of fs.readdirSync(path.join(ROOT, 'kernel'))) write(`kernel/${f}`, fs.readFileSync(path.join(ROOT, 'kernel', f)));
  write('kernel/index.html', page('The Verified Agent Work kernel', `<pre>${esc(fs.readFileSync(path.join(ROOT, 'kernel', 'verified-agent-work.md'), 'utf8'))}</pre>`, 'The eight-step method every protocol instantiates.'));
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
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
