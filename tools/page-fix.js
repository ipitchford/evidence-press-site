#!/usr/bin/env node
'use strict';
/*
 * page-fix.js — fast page-text correction mode for an existing release.
 *
 *   node tools/page-fix.js prepare --slug SLUG [--note TEXT [--pdf-slip]] [--date YYYY-MM-DD] [--dry-run]
 *        [--work DIR] [--cache DIR] [--receipt FILE]
 *   node tools/page-fix.js deploy --receipt FILE [--no-ci-wait]
 *   node tools/page-fix.js ci-followup --commit SHA
 *
 * Scope: wording/number slips in papers/SLUG/body.md or meta.json only. Any
 * other changed path, or any change to a DOI, version, PDF, archive or
 * repository field, is refused. A result-changing error needs a new version and
 * the full release route (tools/deploy.sh), which this tool never relaxes.
 *
 * prepare
 *   1. scope guard: only papers/SLUG/body.md|meta.json differ from the
 *      pre-edit commit (merge-base with origin/main, or --base);
 *   2. optional dated presentation correction note (--pdf-slip wording names
 *      the slip in the archived PDF and states no new version or DOI);
 *   3. baseline: a complete tree proven byte-identical to the live site
 *      (HTML by body, everything else by Cloudflare Pages ETag = asset hash);
 *   4. scoped build (build.js EP_PAGE_FIX_SLUG): only the release page and the
 *      generators that read release data (home/catalogue cards, atlas,
 *      applications, feeds, sitemap, llms, api records);
 *   4b. calibration: the same scoped build with the edit reverted must equal
 *      live byte-for-byte (stamps aside), so main carries nothing undeployed;
 *   5. assembly: baseline + regenerated files whose content really changed
 *      (build-identity stamps ignored). A regenerated file outside the release
 *      dependency set that differs => exit 3, FALLBACK to the full route;
 *   6. scoped REF-leak/public-text scan and link check of the changed files.
 *   Exit 0 = artifact ready; 3 = full build required; 1/2 = refused/error.
 *
 * deploy (correction mode only): requires the receipt's exact commit, clean and
 * pushed; rechecks the artifact; uploads with wrangler; reads every changed
 * file back byte-exact; then waits on the canonical CI for that commit as a
 * follow-up and reports loudly if it fails. Release deploys keep deploy.sh.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const LIVE = (process.env.EP_PAGE_FIX_LIVE || CONFIG.baseUrl).replace(/\/$/, '');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const SAFE_PATH = `${path.dirname(process.execPath)}:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin`;
const ALLOWED_SOURCE = slug => new RegExp(`^papers/${slug}/(body\\.md|meta\\.json)$`);
// Any meta key path matching this is research identity and may not change here.
const FORBIDDEN_KEY = /(^|\.)(doi|conceptDoi|version|pdfUrl|altPdfUrl|altPdfLabel|zenodoUrl|repoUrl|releaseUrl|archive[A-Za-z]*|sha256|slug|datePublished)(\.|$)/i;
const PDF_SLIP_SENTENCE = 'The archived PDF retains the original wording; no new version or DOI was issued.';

/* Outputs that the scoped generators write. Read from build.js: paperPage(p)
   writes releases/SLUG/*; indexPage, atlasPage, applicationsPage, feeds,
   sitemap (+robots, IndexNow key), llms and api write the rest. */
function dependencyPattern(slug) {
  return new RegExp('^(' + [
    `releases/${slug}/[^/]+`, 'index\\.html', 'atlas/[^/]+', 'atlas/tools/[^/]+',
    'applications/index\\.(html|md)', 'assets/applications-banner\\.svg',
    'assets/atlas-research/[^/]+', 'feed\\.(xml|json)', 'articles/feed\\.(xml|json)',
    'sitemap\\.xml', 'robots\\.txt', '[0-9a-f]{32}\\.txt', 'llms(-full)?\\.txt', 'api/.+'
  ].join('|') + ')$');
}

/* Build stamps differ by commit; they are not page content. */
function normalize(rel, buf) {
  if (!/\.(html|json|md|txt|xml)$/.test(rel)) return buf;
  return Buffer.from(buf.toString('utf8')
    .replace(/<p class="build-identity">[\s\S]*?<\/p>/g, '<p class="build-identity">#</p>')
    .replace(/"(sourceCommit|sourceCommitFull|sourceDate)": "[^"]*"/g, '"$1": "#"'));
}

function args(argv) {
  const out = { _: argv[0] };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) throw new Error(`unexpected argument ${a}`);
    const key = a.slice(2);
    if (['pdf-slip', 'no-ci-wait', 'dry-run'].includes(key)) out[key] = true;
    else { if (i + 1 >= argv.length) throw new Error(`${a} needs a value`); out[key] = argv[++i]; }
  }
  return out;
}
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 }).trim();
const log = s => console.log(`==> ${s}`);
const loud = s => console.error(`\n\x1b[41m\x1b[97m ${s} \x1b[0m\n`);

function listFiles(dir) {
  const out = [];
  (function walk(d, rel) {
    for (const name of fs.readdirSync(d).sort()) {
      const f = path.join(d, name), r = rel ? `${rel}/${name}` : name, st = fs.lstatSync(f);
      if (st.isSymbolicLink()) throw new Error(`symlink in tree: ${r}`);
      if (st.isDirectory()) walk(f, r); else out.push(r);
    }
  })(dir, '');
  return out;
}
function treeDigest(dir) {
  const files = listFiles(dir);
  return { sha256: sha(files.map(f => `${f}\0${sha(fs.readFileSync(path.join(dir, f)))}`).join('\n')), count: files.length };
}

/* ---------------------------------------------------------- scope guard */
function flatten(v, prefix = '', out = new Map()) {
  if (v && typeof v === 'object') {
    for (const k of Object.keys(v)) flatten(v[k], prefix ? `${prefix}.${k}` : k, out);
    if (!Object.keys(v).length) out.set(prefix, JSON.stringify(v));
  } else out.set(prefix, JSON.stringify(v));
  return out;
}
function guardMeta(before, after) {
  const errors = [];
  const a = flatten(before), b = flatten(after);
  for (const key of new Set([...a.keys(), ...b.keys()])) {
    if (a.get(key) === b.get(key)) continue;
    if (FORBIDDEN_KEY.test(key)) errors.push(`research-identity field changed: ${key}`);
  }
  const oldC = before.corrections || [], newC = after.corrections || [];
  if (newC.length < oldC.length || oldC.some((c, i) => JSON.stringify(c) !== JSON.stringify(newC[i])))
    errors.push('existing corrections may only be appended to, never edited or removed');
  for (const c of newC.slice(oldC.length))
    if (c.scope !== 'presentation') errors.push(`new correction scope "${c.scope}" is not "presentation"; result-changing errors need the full route`);
  return errors;
}
function scopeGuard(slug, base) {
  const changed = new Set(git('diff', '--name-only', base, '--').split('\n').filter(Boolean));
  for (const f of git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean)) changed.add(f);
  const allowed = ALLOWED_SOURCE(slug);
  const errors = [...changed].filter(f => !allowed.test(f)).map(f => `edit outside papers/${slug}/body.md|meta.json: ${f}`);
  const metaPath = `papers/${slug}/meta.json`;
  if (changed.has(metaPath)) {
    const before = JSON.parse(git('show', `${base}:${metaPath}`));
    const after = JSON.parse(fs.readFileSync(path.join(ROOT, metaPath), 'utf8'));
    errors.push(...guardMeta(before, after));
  }
  return { changed: [...changed].sort(), errors };
}

/* -------------------------------------------------------- correction note */
function correctionSummary(note, pdfSlip) {
  note = String(note || '').trim().replace(/\s+/g, ' ');
  if (!note) throw new Error('--note must not be empty');
  if (!/[.!?]$/.test(note)) note += '.';
  if (pdfSlip) {
    if (!/\b(PDF|archived)\b/i.test(note)) throw new Error('--pdf-slip: the note must name the slip in the archived PDF (mention the PDF)');
    return `${note} ${PDF_SLIP_SENTENCE}`;
  }
  return note;
}
function addCorrection(metaFile, date, summary) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('--date must be YYYY-MM-DD');
  const raw = fs.readFileSync(metaFile, 'utf8');
  const m = JSON.parse(raw);
  m.corrections = m.corrections || [];
  if (m.corrections.some(c => c.date === date && c.summary === summary)) return false;
  m.corrections.push({ date, scope: 'presentation', summary });
  if (Array.isArray(m.publicCorrectionIndexes)) m.publicCorrectionIndexes.push(m.corrections.length - 1);
  fs.writeFileSync(metaFile, JSON.stringify(m, null, 2) + '\n');
  return true;
}

/* ------------------------------------------------------ live equivalence */
function liveUrl(rel) {
  if (rel === 'index.html') return `${LIVE}/`;
  if (rel.endsWith('/index.html')) return `${LIVE}/${rel.slice(0, -'index.html'.length)}`;
  if (rel.endsWith('.html')) return `${LIVE}/${rel.slice(0, -5)}`;
  return `${LIVE}/${rel}`;
}
let blake3 = null;
function pagesHasher() {
  if (blake3 !== null) return blake3;
  blake3 = false;
  const roots = [];
  try { roots.push(execFileSync('npm', ['root', '-g'], { encoding: 'utf8', env: { ...process.env, PATH: SAFE_PATH } }).trim()); } catch (_) { /* none */ }
  for (const r of roots) {
    for (const p of [path.join(r, 'wrangler/node_modules/blake3-wasm'), path.join(r, 'blake3-wasm')]) {
      try { const { hash } = require(p); blake3 = (buf, rel) => hash(buf.toString('base64') + path.extname(rel).slice(1)).toString('hex').slice(0, 32); return blake3; } catch (_) { /* next */ }
    }
  }
  return blake3;
}
async function fetchRetry(url, opts, tries = 4) {
  for (let i = 1; ; i++) {
    try { return await fetch(url, opts); }
    catch (e) { if (i >= tries) throw e; await new Promise(r => setTimeout(r, 500 * i)); }
  }
}
/* Cloudflare email obfuscation rewrites served HTML at the edge (a random key
   per response). Undo it exactly so a live page compares to its built bytes. */
function cfDecodeHex(hex) {
  const key = parseInt(hex.slice(0, 2), 16);
  let out = '';
  for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  return decodeURIComponent(escape(out));
}
function undoEdgeRewrites(rel, buf) {
  if (!rel.endsWith('.html')) return buf;
  const text = buf.toString('utf8');
  if (!text.includes('/cdn-cgi/')) return buf;
  return Buffer.from(text
    .replace(/<script data-cfasync="false" src="\/cdn-cgi\/scripts\/[0-9a-f]+\/cloudflare-static\/email-decode\.min\.js"><\/script>/g, '')
    .replace(/<a href="\/cdn-cgi\/l\/email-protection" class="__cf_email__" data-cfemail="([0-9a-f]+)">\[email&#160;protected\]<\/a>/g, (_, h) => cfDecodeHex(h))
    .replace(/<span class="__cf_email__" data-cfemail="([0-9a-f]+)">\[email&#160;protected\]<\/span>/g, (_, h) => cfDecodeHex(h))
    .replace(/\/cdn-cgi\/l\/email-protection#([0-9a-f]+)/g, (_, h) => 'mailto:' + cfDecodeHex(h)));
}
/* Pages serves _headers as configuration, not as a file. It is produced only by
   the full build and is carried unchanged; its effect is spot-checked below. */
const NOT_SERVED = new Set(['_headers', '_redirects']);
async function liveMismatches(dir, files, { concurrency = 32 } = {}) {
  const hasher = pagesHasher();
  const bad = [];
  let i = 0, bodies = 0, etags = 0;
  async function one(rel) {
    if (NOT_SERVED.has(rel)) return;
    const local = fs.readFileSync(path.join(dir, rel));
    const url = liveUrl(rel);
    if (hasher && !rel.endsWith('.html')) {
      const res = await fetchRetry(url, { method: 'HEAD', redirect: 'follow', headers: { 'cache-control': 'no-cache' } });
      const etag = (res.headers.get('etag') || '').replace(/^W\//, '').replace(/"/g, '');
      if (res.ok && etag) { etags++; if (etag !== hasher(local, rel)) bad.push(`${rel} (etag)`); return; }
    }
    const res = await fetchRetry(url, { redirect: 'follow', headers: { 'cache-control': 'no-cache' } });
    const body = undoEdgeRewrites(rel, Buffer.from(await res.arrayBuffer()));
    bodies++;
    if (!(res.ok || rel === '404.html') || !body.equals(local)) bad.push(`${rel} (${res.status}${res.ok ? ', bytes' : ''})`);
  }
  await Promise.all(Array.from({ length: concurrency }, async () => { while (i < files.length) await one(files[i++]); }));
  return { bad, bodies, etags, hasher: Boolean(hasher) };
}

/* -------------------------------------------------------------- baseline */
function cacheDir(a) { return path.resolve(a.cache || process.env.EP_PAGE_FIX_CACHE || path.join(os.homedir(), 'PublicationWork', 'page-fix-cache')); }
function readPointer(cache) { try { return JSON.parse(fs.readFileSync(path.join(cache, 'current.json'), 'utf8')); } catch (_) { return null; } }
function buildBaselineAt(cache, commit) {
  const wt = path.join(cache, `worktree-${commit.slice(0, 12)}`);
  const out = path.join(cache, `baseline-${commit.slice(0, 12)}-full`);
  if (fs.existsSync(path.join(out, 'index.html'))) return out;
  log(`building full baseline at live commit ${commit.slice(0, 12)} (one-off per full deploy)`);
  if (!fs.existsSync(wt)) execFileSync('git', ['worktree', 'add', '--detach', wt, commit], { cwd: ROOT, stdio: 'inherit' });
  const env = { ...process.env, PATH: SAFE_PATH, REQUIRE_COMMITTED_MANIFESTS: '1' };
  try {
    const ledger = JSON.parse(fs.readFileSync(path.join(wt, 'protocols/PUBLISHED.json'), 'utf8'));
    if (ledger.source && ledger.source.dirty === false && /^[0-9a-f]{40}$/.test(ledger.source.commit || '')) env.PRODUCTIVITY_PROTOCOLS_SOURCE_COMMIT = ledger.source.commit;
  } catch (_) { /* unsealed */ }
  execFileSync('./protocols/deploy/integrate.sh', [], { cwd: wt, env, stdio: ['ignore', 'ignore', 'inherit'] });
  execFileSync('cp', ['-cR', path.join(wt, 'dist'), out]);
  return out;
}
async function ensureBaseline(cache, dryRun = false) {
  fs.mkdirSync(cache, { recursive: true });
  const buildRes = await fetchRetry(`${LIVE}/api/build.json`, { headers: { 'cache-control': 'no-cache' } });
  if (!buildRes.ok) throw new Error(`live build.json unreadable (${buildRes.status})`);
  const liveBuildBytes = Buffer.from(await buildRes.arrayBuffer());
  const liveBuild = JSON.parse(liveBuildBytes.toString('utf8'));
  const pointer = readPointer(cache);
  const candidates = [];
  if (pointer && pointer.liveBuildSha256 === sha(liveBuildBytes) && fs.existsSync(pointer.dir)) candidates.push({ dir: pointer.dir, sourceCommit: pointer.sourceCommit, from: 'last page-fix deployment' });
  candidates.push({ commit: liveBuild.sourceCommitFull, sourceCommit: liveBuild.sourceCommitFull, from: 'full build of live commit' });
  for (const c of candidates) {
    const dir = c.dir || buildBaselineAt(cache, c.commit);
    const files = listFiles(dir);
    const t = Date.now();
    const r = await liveMismatches(dir, files);
    log(`live equivalence (${c.from}): ${files.length} files, ${r.bodies} bodies + ${r.etags} ETags in ${((Date.now() - t) / 1000).toFixed(1)}s, ${r.bad.length} mismatches`);
    if (!r.bad.length) return { dir, sourceCommit: c.sourceCommit, liveBuildSha256: sha(liveBuildBytes), files, from: c.from };
    console.error(r.bad.slice(0, 20).map(s => `   differs from live: ${s}`).join('\n'));
    if (dryRun && c === candidates[candidates.length - 1]) return { dir, sourceCommit: c.sourceCommit, liveBuildSha256: sha(liveBuildBytes), files, from: c.from, drift: r.bad };
  }
  return null;
}

/* -------------------------------------------------------------- scoped checks */
function scopedScan(paths) {
  const r = spawnSync('python3', ['-B', path.join(__dirname, 'ref_leak_scanner.py'), ...paths],
    { cwd: ROOT, env: { ...process.env, PATH: SAFE_PATH }, encoding: 'utf8', maxBuffer: 32 << 20, timeout: 180000 });
  let report;
  try { report = JSON.parse(r.stdout); } catch (_) { throw new Error(`REF-leak/public-text scanner failed (exit ${r.status})`); }
  const findings = (report.findings || []).map(f => `${f.source}: ${f.rule}`);
  const errors = (report.errors || []).map(e => `${e.source}: extraction-or-input-failure`);
  return { ok: r.status === 0 && !findings.length && !errors.length, findings, errors, checked: (report.coverage && report.coverage.text_checked || []).length };
}

/* -------------------------------------------------------------- prepare */
async function prepare(a) {
  const t0 = Date.now(), timings = {};
  const lap = (k, s) => { timings[k] = +((Date.now() - s) / 1000).toFixed(1); };
  const slug = a.slug;
  if (!/^[a-z0-9-]+$/.test(slug || '') || !fs.existsSync(path.join(ROOT, 'papers', slug, 'meta.json'))) throw new Error('--slug must name an existing release');
  const cache = cacheDir(a);
  const work = path.resolve(a.work || path.join(cache, 'runs', `${slug}-${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}`));
  if (fs.existsSync(work) && fs.readdirSync(work).length) throw new Error(`--work must be new or empty: ${work}`);
  fs.mkdirSync(work, { recursive: true });

  let s = Date.now();
  log('1 baseline proven byte-identical to live');
  const dryRun = Boolean(a['dry-run']);
  const base = await ensureBaseline(cache, dryRun);
  lap('baselineLiveCheck', s);
  if (!base) { loud('FALLBACK: no baseline equals the live site; use the full build and tools/deploy.sh'); return 3; }
  if (base.drift) loud(`DRY RUN ONLY: live differs from the baseline in ${base.drift.length} file(s); this receipt can never deploy`);

  const preEdit = a.base || git('merge-base', 'HEAD', 'origin/main');
  log(`2 scope guard: only papers/${slug}/body.md|meta.json may differ from ${preEdit.slice(0, 12)}`);
  if (a.note) {
    const summary = correctionSummary(a.note, Boolean(a['pdf-slip']));
    const date = a.date || new Date().toISOString().slice(0, 10);
    if (addCorrection(path.join(ROOT, 'papers', slug, 'meta.json'), date, summary)) log(`   added ${date} presentation correction`);
  } else if (a['pdf-slip']) throw new Error('--pdf-slip needs --note');
  const guard = scopeGuard(slug, preEdit);
  if (guard.errors.length) { guard.errors.forEach(e => console.error(`REFUSED: ${e}`)); return 2; }
  if (!guard.changed.length) { console.error('REFUSED: no change to papers/' + slug); return 2; }

  const baseSm = fs.readFileSync(path.join(base.dir, 'sitemap.xml'), 'utf8');
  const scopedBuild = out => {
    const b = spawnSync(process.execPath, ['build.js'], { cwd: ROOT, env: { ...process.env, PATH: SAFE_PATH, EP_PAGE_FIX_SLUG: slug, EP_PAGE_FIX_OUT: out }, encoding: 'utf8', maxBuffer: 64 << 20 });
    if (b.status !== 0) { console.error(b.stderr.slice(-4000)); throw new Error('scoped build failed'); }
    // Fold the baseline /protocols/ sitemap entries back in, exactly as live has them.
    const sm = path.join(out, 'sitemap.xml'), newSm = fs.readFileSync(sm, 'utf8');
    const present = new Set([...newSm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
    const extra = baseSm.split('\n').filter(l => /<loc>[^<]*\/protocols\//.test(l) && !present.has(l.match(/<loc>([^<]+)<\/loc>/)[1]));
    if (extra.length) fs.writeFileSync(sm, newSm.replace('</urlset>', `${extra.join('\n')}\n</urlset>`));
    const differs = [];
    for (const rel of listFiles(out)) {
      const now = fs.readFileSync(path.join(out, rel)), basePath = path.join(base.dir, rel);
      const was = fs.existsSync(basePath) ? fs.readFileSync(basePath) : null;
      if (!(was && normalize(rel, was).equals(normalize(rel, now)))) differs.push(rel);
    }
    return differs;
  };

  log('3 calibration: scoped build WITHOUT the edit must reproduce live exactly');
  s = Date.now();
  const saved = guard.changed.map(f => [f, fs.readFileSync(path.join(ROOT, f))]);
  let drift;
  try {
    for (const [f] of saved) fs.writeFileSync(path.join(ROOT, f), execFileSync('git', ['show', `${preEdit}:${f}`], { cwd: ROOT, maxBuffer: 64 << 20 }));
    drift = scopedBuild(path.join(work, 'calibration'));
  } finally {
    for (const [f, bytes] of saved) fs.writeFileSync(path.join(ROOT, f), bytes);
  }
  lap('calibrationBuild', s);
  if (drift.length) { drift.slice(0, 20).forEach(f => console.error(`   undeployed source change reaches: ${f}`)); loud('FALLBACK: source without the edit does not reproduce live; full build required'); return 3; }

  log('4 scoped build WITH the edit (release page + shared release outputs)');
  s = Date.now();
  const scoped = path.join(work, 'scoped');
  const differs = scopedBuild(scoped);
  lap('scopedBuild', s);
  const dep = dependencyPattern(slug);
  const changed = differs.filter(f => dep.test(f)), outside = differs.filter(f => !dep.test(f));
  if (outside.length) { outside.forEach(f => console.error(`   outside the release dependency set: ${f}`)); loud('FALLBACK: full build required'); return 3; }
  s = Date.now();
  if (!changed.some(f => f.startsWith(`releases/${slug}/`))) { console.error('REFUSED: the edit changed no output of this release'); return 2; }
  const artifact = path.join(work, 'artifact');
  execFileSync('cp', ['-cR', base.dir, artifact]);
  for (const rel of changed) {
    fs.mkdirSync(path.dirname(path.join(artifact, rel)), { recursive: true });
    fs.copyFileSync(path.join(scoped, rel), path.join(artifact, rel));
  }
  lap('assemble', s);

  log(`5 scoped checks on ${changed.length} changed files`);
  s = Date.now();
  const sources = guard.changed.map(f => path.join(ROOT, f));
  const ref = scopedScan([...sources, ...changed.map(f => path.join(artifact, f))]);
  if (!ref.ok) { [...ref.findings, ...ref.errors].forEach(e => console.error(`   ${e}`)); console.error('REFUSED: REF-leak/public-text scan'); return 2; }
  console.log(`   REF-leak + public-text: ${ref.checked} inputs checked, no findings`);
  const only = path.join(work, 'changed-html.txt');
  fs.writeFileSync(only, changed.filter(f => f.endsWith('.html')).join('\n') + '\n');
  const links = spawnSync(process.execPath, [path.join(__dirname, 'check-links.js'), '--dist', artifact, '--only', only], { encoding: 'utf8' });
  process.stdout.write(links.stdout.split('\n').map(l => l && `   ${l}`).join('\n'));
  if (links.status !== 0) { console.error(links.stderr); console.error('REFUSED: link check'); return 2; }
  for (const f of changed.filter(f => f.endsWith('.json'))) JSON.parse(fs.readFileSync(path.join(artifact, f), 'utf8'));
  const hosting = spawnSync(process.execPath, [path.join(__dirname, 'check-static-hosting.js'), artifact], { encoding: 'utf8' });
  if (hosting.status !== 0) { console.error(hosting.stdout + hosting.stderr); console.error('REFUSED: static hosting boundary'); return 2; }
  lap('scopedChecks', s);

  const receiptFile = path.resolve(a.receipt || path.join(work, 'receipt.json'));
  const receipt = {
    kind: 'evidence-press-page-fix', version: 1, slug, liveBase: LIVE,
    deployable: !dryRun && !base.drift, baselineDrift: base.drift || [],
    sourceFiles: guard.changed, sourceBase: preEdit, liveSourceCommit: base.sourceCommit, headAtPrepare: git('rev-parse', 'HEAD'),
    sourceSha256: Object.fromEntries(guard.changed.map(f => [f, sha(fs.readFileSync(path.join(ROOT, f)))])),
    cache, baseline: { dir: base.dir, from: base.from, liveBuildSha256: base.liveBuildSha256 },
    artifact, artifactTree: treeDigest(artifact),
    changed: Object.fromEntries(changed.map(f => [f, sha(fs.readFileSync(path.join(artifact, f)))])),
    timings: { ...timings, total: +((Date.now() - t0) / 1000).toFixed(1) }
  };
  fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + '\n');
  console.log(`\nChanged outputs (${changed.length}):\n${changed.map(f => `   ${f}`).join('\n')}`);
  console.log(`Timings (s): ${JSON.stringify(receipt.timings)}`);
  console.log(`Receipt: ${receiptFile}`);
  return 0;
}

/* -------------------------------------------------------------- deploy */
async function readback(receipt) {
  const bad = [];
  for (const [rel, digest] of Object.entries(receipt.changed)) {
    const res = await fetchRetry(liveUrl(rel), { redirect: 'follow', headers: { 'cache-control': 'no-cache' } });
    const body = undoEdgeRewrites(rel, Buffer.from(await res.arrayBuffer()));
    if (!res.ok || sha(body) !== digest) bad.push(rel);
  }
  return bad;
}
function ciFollowup(commit, waitSeconds = Number(process.env.EP_PAGE_FIX_CI_WAIT_SECONDS || 2400)) {
  const { waitFor } = require('./check-deploy-ci');
  const fetchChecks = () => JSON.parse(execFileSync('gh', ['api', `repos/ipitchford/evidence-press-site/commits/${commit}/check-runs?per_page=100`, '--paginate', '--slurp'], { encoding: 'utf8', maxBuffer: 32 << 20 }));
  try {
    waitFor(commit, fetchChecks, { waitSeconds, pollSeconds: 30, log: m => console.log(`   CI: ${m}`) });
    console.log(`CI follow-up passed for ${commit}`);
    return 0;
  } catch (e) {
    loud(`CI FOLLOW-UP ${e.pending ? 'STILL PENDING' : 'FAILED'} FOR DEPLOYED PAGE FIX ${commit.slice(0, 12)}: ${e.message}`);
    console.error(e.pending ? `Resume: node tools/page-fix.js ci-followup --commit ${commit}` : 'The page is live. Repair the failure now (or redeploy the previous artifact).');
    return 4;
  }
}
async function deploy(a) {
  const receiptFile = path.resolve(a.receipt || '');
  const r = JSON.parse(fs.readFileSync(receiptFile, 'utf8'));
  if (r.kind !== 'evidence-press-page-fix') throw new Error('not a page-fix receipt');
  if (r.deployable !== true) throw new Error('REFUSED: dry-run receipt; run prepare without --dry-run');
  const head = git('rev-parse', 'HEAD');
  if (git('status', '--porcelain', '--untracked-files=no')) throw new Error('REFUSED: working tree is not clean; commit the correction first');
  for (const [f, d] of Object.entries(r.sourceSha256)) if (sha(fs.readFileSync(path.join(ROOT, f))) !== d) throw new Error(`REFUSED: ${f} changed since prepare`);
  const committed = git('diff', '--name-only', r.sourceBase, head).split('\n').filter(Boolean);
  if (committed.some(f => !ALLOWED_SOURCE(r.slug).test(f))) throw new Error('REFUSED: commit contains changes outside the page text');
  git('fetch', '-q', 'origin');
  if (!git('branch', '-r', '--contains', head)) throw new Error('REFUSED: push the commit first so CI runs on it');
  const tree = treeDigest(r.artifact);
  if (tree.sha256 !== r.artifactTree.sha256) throw new Error('REFUSED: artifact changed since prepare');
  const buildRes = await fetchRetry(`${LIVE}/api/build.json`, { headers: { 'cache-control': 'no-cache' } });
  if (sha(Buffer.from(await buildRes.arrayBuffer())) !== r.baseline.liveBuildSha256) throw new Error('REFUSED: live site was redeployed since prepare; run prepare again');
  const stale = await liveMismatches(r.baseline.dir, Object.keys(r.changed).filter(f => fs.existsSync(path.join(r.baseline.dir, f))));
  if (stale.bad.length) throw new Error(`REFUSED: live changed since prepare: ${stale.bad.join(', ')}`);

  const env = { ...process.env, PATH: SAFE_PATH };
  log('wrangler authentication');
  execFileSync('npx', ['wrangler', 'whoami'], { cwd: ROOT, env, stdio: ['ignore', 'ignore', 'inherit'] });
  log('deploy (page-fix mode: local checks passed; CI runs as follow-up)');
  execFileSync('npx', ['wrangler', 'pages', 'deploy', r.artifact, '--project-name', 'evidence-press', '--branch', 'main', '--commit-hash', head], { cwd: ROOT, env, stdio: 'inherit' });

  log('exact readback of changed files');
  let bad = [];
  for (let i = 1; i <= 8; i++) {
    bad = await readback(r);
    if (!bad.length) break;
    console.log(`   ${bad.length} not yet converged; retry ${i}/8 in 5s`);
    await new Promise(res => setTimeout(res, 5000));
  }
  if (bad.length) { loud(`READBACK MISMATCH: ${bad.join(', ')}`); return 1; }
  console.log(`   ${Object.keys(r.changed).length} changed files read back byte-exact`);

  const cache = r.cache;
  const keep = path.join(cache, `baseline-pagefix-${head.slice(0, 12)}`);
  if (!fs.existsSync(keep)) execFileSync('cp', ['-cR', r.artifact, keep]);
  fs.writeFileSync(path.join(cache, 'current.json'), JSON.stringify({ dir: keep, sourceCommit: head, liveBuildSha256: r.baseline.liveBuildSha256, slug: r.slug, deployedAt: new Date().toISOString() }, null, 2) + '\n');
  console.log('Page fix is live.');
  if (a['no-ci-wait']) { console.log(`CI follow-up not awaited. Run: node tools/page-fix.js ci-followup --commit ${head}`); return 0; }
  log(`CI follow-up on ${head.slice(0, 12)}`);
  return ciFollowup(head);
}

async function main() {
  const a = args(process.argv.slice(2));
  if (a._ === 'prepare') return prepare(a);
  if (a._ === 'deploy') return deploy(a);
  if (a._ === 'ci-followup') { if (!/^[0-9a-f]{40}$/.test(a.commit || '')) throw new Error('--commit SHA (40 hex)'); return ciFollowup(a.commit); }
  throw new Error('usage: page-fix.js prepare|deploy|ci-followup ...');
}
if (require.main === module) {
  main().then(code => { process.exitCode = code; }, e => { console.error(`page-fix: ${e.message}`); process.exitCode = 1; });
}
module.exports = { undoEdgeRewrites, cfDecodeHex, guardMeta, correctionSummary, addCorrection, normalize, dependencyPattern, liveUrl, PDF_SLIP_SENTENCE, ALLOWED_SOURCE };
