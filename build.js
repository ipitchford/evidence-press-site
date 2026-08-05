#!/usr/bin/env node
/*
 * Evidence Press — static site builder.
 * Dependency-free: runs on any Node ≥ 16. Usage: node build.js  → writes ./dist
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE = CONFIG.baseUrl.replace(/\/$/, '');
const SCHEMA_VERSION = '1.2';
const OBSERVATORY = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages', 'observatory.json'), 'utf8'));
const OBSERVATORY_BODY = fs.readFileSync(path.join(ROOT, 'pages', 'observatory.md'), 'utf8');
const OBSERVATORY_PLACEHOLDER = /^__OBSERVATORY_[A-Z0-9_]+__$/;

const sha256File = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const assetPath = url => path.join(ROOT, String(url).replace(/^\/+/, ''));
const finalValue = key => OBSERVATORY_PLACEHOLDER.test(String(OBSERVATORY[key] || '')) ? null : OBSERVATORY[key];
const OBSERVATORY_PUBLIC = {
  repositoryUrl: finalValue('repositoryUrl'),
  releaseUrl: finalValue('releaseUrl'),
  doi: finalValue('doi'),
  doiUrl: finalValue('doiUrl'),
  zenodoUrl: finalValue('zenodoUrl')
};
const OBSERVATORY_UNRESOLVED = Object.entries(OBSERVATORY)
  .filter(([, value]) => OBSERVATORY_PLACEHOLDER.test(String(value || '')))
  .map(([key]) => key);

for (const [key, value] of Object.entries(OBSERVATORY_PUBLIC)) {
  if (!value || key === 'doi') continue;
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error(`pages/observatory.json: ${key} is not a URL`); }
  if (parsed.protocol !== 'https:') throw new Error(`pages/observatory.json: ${key} must use https`);
}
if (OBSERVATORY_PUBLIC.doi && !/^10\.\d{4,9}\/.+/.test(OBSERVATORY_PUBLIC.doi)) {
  throw new Error('pages/observatory.json: doi is not a DOI');
}
if (OBSERVATORY_PUBLIC.doi && OBSERVATORY_PUBLIC.doiUrl !== `https://doi.org/${OBSERVATORY_PUBLIC.doi}`) {
  throw new Error('pages/observatory.json: doiUrl must be the canonical https://doi.org/ URL');
}

const OBSERVATORY_AUDIO_FILE = assetPath(OBSERVATORY.audio.url);
const OBSERVATORY_TRANSCRIPT_FILE = assetPath(OBSERVATORY.audio.transcriptUrl);
if (!fs.existsSync(OBSERVATORY_AUDIO_FILE)) throw new Error(`Missing Observatory audio: ${OBSERVATORY_AUDIO_FILE}`);
if (!fs.existsSync(OBSERVATORY_TRANSCRIPT_FILE)) throw new Error(`Missing Observatory transcript: ${OBSERVATORY_TRANSCRIPT_FILE}`);
const OBSERVATORY_AUDIO_BYTES = fs.statSync(OBSERVATORY_AUDIO_FILE).size;
const OBSERVATORY_TRANSCRIPT = fs.readFileSync(OBSERVATORY_TRANSCRIPT_FILE, 'utf8').trim();
if (OBSERVATORY_AUDIO_BYTES !== OBSERVATORY.audio.bytes) throw new Error('Observatory audio byte count does not match pages/observatory.json');
if (sha256File(OBSERVATORY_AUDIO_FILE) !== OBSERVATORY.audio.sha256) throw new Error('Observatory audio SHA-256 does not match pages/observatory.json');
if (sha256File(OBSERVATORY_TRANSCRIPT_FILE) !== OBSERVATORY.audio.transcriptSha256) throw new Error('Observatory transcript SHA-256 does not match pages/observatory.json');
const ASSURANCE = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages', 'assurance.json'), 'utf8'));
const ASSURANCE_RECORD = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages', 'assurance-projects.json'), 'utf8'));
const ASSURANCE_AUDIO_FILE = assetPath(ASSURANCE.audio.url);
const ASSURANCE_TRANSCRIPT_FILE = assetPath(ASSURANCE.audio.transcriptUrl);
if (!fs.existsSync(ASSURANCE_AUDIO_FILE)) throw new Error(`Missing assurance audio: ${ASSURANCE_AUDIO_FILE}`);
if (!fs.existsSync(ASSURANCE_TRANSCRIPT_FILE)) throw new Error(`Missing assurance transcript: ${ASSURANCE_TRANSCRIPT_FILE}`);
const ASSURANCE_TRANSCRIPT = fs.readFileSync(ASSURANCE_TRANSCRIPT_FILE, 'utf8').trim();
if (fs.statSync(ASSURANCE_AUDIO_FILE).size !== ASSURANCE.audio.bytes) throw new Error('Assurance audio byte count does not match pages/assurance.json');
if (sha256File(ASSURANCE_AUDIO_FILE) !== ASSURANCE.audio.sha256) throw new Error('Assurance audio SHA-256 does not match pages/assurance.json');
if (sha256File(ASSURANCE_TRANSCRIPT_FILE) !== ASSURANCE.audio.transcriptSha256) throw new Error('Assurance transcript SHA-256 does not match pages/assurance.json');
const OBSERVATORY_PIPELINE_FILE = path.join(ROOT, 'assets', 'art', 'observatory-pipeline.png');
const OBSERVATORY_PIPELINE_PROVENANCE = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'art', 'observatory-pipeline.provenance.json'), 'utf8'));
if (sha256File(OBSERVATORY_PIPELINE_FILE) !== OBSERVATORY_PIPELINE_PROVENANCE.sha256) throw new Error('Observatory pipeline SHA-256 does not match its provenance record');

/* ---------------------------------------------------------------- utils */
const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
const escAttr = esc;
const iso = d => new Date(d + 'T12:00:00Z').toISOString();
const rfc822 = d => new Date(d + 'T12:00:00Z').toUTCString();
const niceDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB',
  { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function write(rel, content) {
  const p = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

/* ------------------------------------------------- minimal markdown → html */
function inline(md) {
  const stash = [];
  let s = md.replace(/(`[^`]+`|\$[^$\n]+\$)/g, m => {
    stash.push(m); return ` ${stash.length - 1} `;
  });
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, u) =>
    `<img class="inline-img" src="${escAttr(u)}" alt="${escAttr(a)}">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) =>
    `<a href="${escAttr(u)}"${/^https?:/.test(u) ? ' rel="noopener"' : ''}>${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  s = s.replace(/ (\d+) /g, (m, i) => {
    const v = stash[+i];
    if (v === undefined) return m;
    if (v.startsWith('`')) return `<code>${esc(v.slice(1, -1))}</code>`;
    return esc(v);
  });
  return s;
}

function markdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const isTableRow = l => /^\s*\|.*\|\s*$/.test(l);
  while (i < lines.length) {
    let line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }
    if (/^```/.test(line)) {
      const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    if (/^\$\$\s*$/.test(line)) {
      const buf = []; i++;
      while (i < lines.length && !/^\$\$\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<div class="math">$$${esc(buf.join('\n'))}$$</div>`);
      continue;
    }
    const image = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*$/);
    if (image) {
      const [, alt, src, caption] = image;
      out.push(`<figure class="article-figure"><img src="${escAttr(src)}" alt="${escAttr(alt)}" loading="lazy"><figcaption>${inline(caption || alt)}</figcaption></figure>`);
      i++; continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const text = h[2].trim();
      const id = text.toLowerCase().replace(/\$[^$]*\$/g, '').replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-') || 'section';
      out.push(`<h${lvl} id="${id}">${inline(text)}</h${lvl}>`);
      i++; continue;
    }
    if (/^---+\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdown(buf.join('\n'))}</blockquote>`);
      continue;
    }
    if (isTableRow(line)) {
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(lines[i++]);
      const cells = r => r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      const header = cells(rows[0]);
      const body = rows.slice(/^[\s|:-]+$/.test(rows[1] || '') ? 2 : 1);
      let t = '<div class="table-wrap"><table><thead><tr>';
      t += header.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>';
      for (const r of body) t += '<tr>' + cells(r).map(c => `<td>${inline(c)}</td>`).join('') + '</tr>';
      t += '</tbody></table></div>';
      out.push(t);
      continue;
    }
    if (/^\s*-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        let item = lines[i++].replace(/^\s*-\s+/, '');
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*-\s+/.test(lines[i]))
          item += ' ' + lines[i++].trim();
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        let item = lines[i++].replace(/^\s*\d+\.\s+/, '');
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i]))
          item += ' ' + lines[i++].trim();
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }
    const buf = [line]; i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|-\s|\d+\.\s|>|\||```|\$\$|---|!\[)/.test(lines[i].trim()))
      buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

/* ----------------------------------------------------------- load papers */
const papersDir = path.join(ROOT, 'papers');
const papers = fs.readdirSync(papersDir)
  .filter(d => !d.startsWith('_') && fs.existsSync(path.join(papersDir, d, 'meta.json')))
  .map(d => {
    const meta = JSON.parse(fs.readFileSync(path.join(papersDir, d, 'meta.json'), 'utf8'));
    const body = fs.readFileSync(path.join(papersDir, d, 'body.md'), 'utf8');
    if (!meta.slug) meta.slug = d;
    const audioFile = path.join(ROOT, 'assets', 'audio', meta.slug + '.mp3');
    meta.audio = fs.existsSync(audioFile) ? { url: `/assets/audio/${meta.slug}.mp3`, bytes: fs.statSync(audioFile).size } : null;
    meta.art = fs.existsSync(path.join(ROOT, 'assets', 'art', meta.slug + '.svg')) ? `/assets/art/${meta.slug}.svg` : null;
    meta.og = fs.existsSync(path.join(ROOT, 'assets', 'og', meta.slug + '.png')) ? `/assets/og/${meta.slug}.png` : null;
    return { ...meta, body };
  })
  .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

const urlOf = p => `${BASE}/releases/${p.slug}/`;

/* ---------------------------------------------------------------- bibtex */
function bibtex(p) {
  const key = p.slug.replace(/[^a-z0-9]/g, '') + p.datePublished.slice(0, 4);
  const year = p.datePublished.slice(0, 4);
  return `@misc{${key},
  title        = {${p.title.replace(/[{}]/g, '')}},
  author       = {${p.authors.join(' and ')}},
  year         = {${year}},
  doi          = {${p.doi}},
  url          = {https://doi.org/${p.doi}},
  version      = {${p.version}},
  howpublished = {Zenodo},
  note         = {Unrefereed; internally replayed evidence package. Press page: ${urlOf(p)}}
}
`;
}

/* ------------------------------------------------------------- chrome */
function head({ title, description, canonical, jsonld, metaExtra = '', math = false, extraLinks = '' }) {
  return `<!DOCTYPE html>
<html lang="${CONFIG.language}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${escAttr(description)}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" type="application/rss+xml" title="${escAttr(CONFIG.siteName)}" href="${BASE}/feed.xml">
<link rel="alternate" type="application/feed+json" title="${escAttr(CONFIG.siteName)}" href="${BASE}/feed.json">
${extraLinks}<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23134e4a'/%3E%3Ctext x='50' y='66' font-size='46' text-anchor='middle' fill='%23fbbf24' font-family='Georgia'%3EE%CF%81%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="/assets/style.css?v=${CSS_V}">
${metaExtra}${math ? `<link rel="stylesheet" href="/assets/katex/katex.min.css">
<script defer src="/assets/katex/katex.min.js"></script>
<script defer src="/assets/katex/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]});"></script>
` : ''}<script type="application/ld+json">
${JSON.stringify(jsonld, null, 1)}
</script>
</head>
<body>
<header class="site-head">
  <div class="wrap">
    <a class="brand" href="/"><span class="brand-mark">E</span> ${esc(CONFIG.siteName)}</a>
    <nav>
      <a href="/">Releases</a>
      <a href="/about/">About</a>
      <a href="/observatory/">Observatory</a>
      <a href="/ai/">For AI agents</a>
      <a href="/feed.xml">RSS</a>
    </nav>
  </div>
</header>
<main>`;
}

const foot = `</main>
<footer class="site-foot">
  <div class="wrap">
    <p>${esc(CONFIG.siteName)} publishes plain-language and specialist briefings on new research released with complete, replayable evidence. Nothing here has been peer reviewed; every page says exactly what has and has not been checked.</p>
    <p>Site content is dedicated to the public domain under <a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="noopener">CC0 1.0</a>. Machine-readable: <a href="/api/papers.json">papers.json</a> · <a href="/api/schema.json">schema</a> · <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a> · <a href="/feed.xml">RSS</a> · <a href="/feed.json">JSON Feed</a> · <a href="/sitemap.xml">sitemap</a></p>
  </div>
</footer>
</body>
</html>`;

const copyScript = `<script>
document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
var t=document.getElementById(b.dataset.copy).innerText;
navigator.clipboard.writeText(t).then(function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o;},1600);});});});
</script>`;

/* ----------------------------------------------------------- JSON-LD */
function websiteNode() {
  return {
    '@type': 'WebSite', '@id': `${BASE}/#website`,
    url: `${BASE}/`, name: CONFIG.siteName, description: CONFIG.description,
    inLanguage: CONFIG.language,
    publisher: { '@type': 'Organization', '@id': `${BASE}/#org`, name: CONFIG.publisher, url: `${BASE}/` }
  };
}

function articleJsonld(p) {
  const url = urlOf(p);
  const publicReviews = (p.reviews || []).filter(r => r.status === 'published');
  const graph = [
    websiteNode(),
    {
      '@type': 'ScholarlyArticle', '@id': `${url}#article`,
      headline: p.title, name: p.title, alternativeHeadline: p.shortTitle,
      abstract: p.abstract, description: p.oneLine,
      url, mainEntityOfPage: url,
      ...(p.og ? { image: BASE + p.og, thumbnailUrl: BASE + p.og } : {}),
      datePublished: p.datePublished, dateModified: p.dateModified || p.datePublished,
      version: p.version,
      identifier: [{ '@type': 'PropertyValue', propertyID: 'DOI', value: p.doi }],
      sameAs: [`https://doi.org/${p.doi}`, p.zenodoUrl, p.releaseUrl || p.repoUrl].filter(Boolean),
      author: p.authors.map(a => ({ '@type': 'Organization', name: a })),
      publisher: { '@id': `${BASE}/#org` },
      isPartOf: { '@id': `${BASE}/#website` },
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
      keywords: p.keywords.join(', '),
      inLanguage: CONFIG.language,
      creativeWorkStatus: 'Unrefereed — internally replayed evidence; not peer reviewed, not independently reproduced, not formally verified',
      about: p.problem ? [{ '@type': 'Thing', name: p.problem.name, ...(p.problem.url ? { sameAs: p.problem.url } : {}) }] : undefined,
      isBasedOn: { '@id': `${url}#code` },
      discussionUrl: p.repoUrl + '/issues',
      encoding: [
        ...(p.pdfUrl ? [{ '@type': 'MediaObject', '@id': `${url}#pdf`, contentUrl: p.pdfUrl, encodingFormat: 'application/pdf', name: `${p.shortTitle} — manuscript PDF` }] : []),
        { '@type': 'MediaObject', contentUrl: `${url}index.md`, encodingFormat: 'text/markdown', name: 'This release as Markdown' },
        { '@type': 'MediaObject', contentUrl: `${url}paper.json`, encodingFormat: 'application/json', name: 'Structured metadata record' }
      ],
      citation: (p.relatedWorks || []).map(w => ({ '@type': 'CreativeWork', name: w.citation, ...(w.url ? { url: w.url } : {}) }))
    },
    {
      '@type': 'SoftwareSourceCode', '@id': `${url}#code`,
      name: `${p.shortTitle} — evidence and replay package`,
      codeRepository: p.repoUrl,
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
      description: p.evidence,
      ...(p.releaseUrl ? { downloadUrl: p.releaseUrl } : {})
    },
    {
      '@type': 'Dataset', '@id': `${url}#deposit`,
      name: `${p.shortTitle} — archived deposit (Zenodo)`,
      url: p.zenodoUrl,
      identifier: `https://doi.org/${p.doi}`,
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
      description: `DOI-archived snapshot of the manuscript and evidence package for: ${p.title}`,
      creator: p.authors.map(a => ({ '@type': 'Organization', name: a })),
      includedInDataCatalog: { '@type': 'DataCatalog', name: 'Zenodo', url: 'https://zenodo.org' }
    }
  ];
  if (p.audio) graph.push({
    '@type': 'AudioObject', '@id': `${url}#audio`,
    name: `${p.shortTitle} — audio briefing`,
    contentUrl: BASE + p.audio.url, encodingFormat: 'audio/mpeg',
    contentSize: String(p.audio.bytes),
    description: `Narrated plain-language summary of: ${p.title}`,
    isPartOf: { '@id': `${url}#article` },
    license: 'https://creativecommons.org/publicdomain/zero/1.0/'
  });
  for (const m of p.media || []) {
    const yt = m.type === 'video' ? youtubeId(m.url) : null;
    graph.push({
      '@type': m.type === 'video' ? 'VideoObject' : 'AudioObject',
      name: m.name, description: m.description || undefined,
      ...(yt ? { url: m.url, embedUrl: `https://www.youtube-nocookie.com/embed/${yt}` } : { contentUrl: m.url }),
      isPartOf: { '@id': `${url}#article` }
    });
  }
  for (const r of publicReviews) {
    const reviewUrl = r.publication && r.publication.publicUrl
      ? r.publication.publicUrl
      : `${url}reviews/${r.reviewId}/`;
    graph.push({
      '@type': 'Review', '@id': `${url}#${r.reviewId}`,
      name: r.assessment && r.assessment.title ? r.assessment.title : r.reviewId,
      url: reviewUrl.startsWith('http') ? reviewUrl : `${BASE}${reviewUrl}`,
      datePublished: r.assessment && r.assessment.date,
      reviewBody: r.publication && r.publication.publicSummary,
      additionalProperty: r.assessment && r.assessment.recommendation ? [{
        '@type': 'PropertyValue', propertyID: 'recommendation', value: r.assessment.recommendation
      }] : undefined,
      author: { '@type': 'Person', name: (r.reviewer && r.reviewer.name) || 'Reviewer identity withheld' },
      itemReviewed: { '@id': `${url}#article` }
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph.map(n => JSON.parse(JSON.stringify(n))) };
}

/* content-hash for cache-busting the stylesheet link */
const CSS_V = crypto.createHash('sha256')
  .update(require('fs').readFileSync(__dirname + '/assets/style.css')).digest('hex').slice(0, 10);

/* YouTube URL -> video id (watch, youtu.be, embed, shorts, live) */
function youtubeId(u) {
  const m = String(u || '').match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

function citationMeta(p) {
  const lines = [
    ['citation_title', p.title],
    ...p.authors.map(a => ['citation_author', a]),
    ['citation_publication_date', p.datePublished.replace(/-/g, '/')],
    ['citation_online_date', p.datePublished.replace(/-/g, '/')],
    ['citation_doi', p.doi],
    ...(p.pdfUrl ? [['citation_pdf_url', p.pdfUrl]] : []),
    ['citation_abstract_html_url', urlOf(p)],
    ['citation_technical_report_institution', CONFIG.publisher],
    ['citation_language', 'en'],
    ['DC.title', p.title],
    ['DC.identifier', `https://doi.org/${p.doi}`],
    ['DC.date', p.datePublished],
    ['DC.language', 'en'],
    ['DC.rights', 'CC0-1.0'],
    ['og:type', 'article'],
    ['og:site_name', CONFIG.siteName],
    ['og:title', p.title],
    ['og:description', p.oneLine],
    ['og:url', urlOf(p)],
    ...(p.og ? [['og:image', BASE + p.og], ['og:image:width', '1200'], ['og:image:height', '630']] : []),
    ['article:published_time', iso(p.datePublished)],
    ['twitter:card', p.og ? 'summary_large_image' : 'summary'],
    ['twitter:title', p.title],
    ['twitter:description', p.oneLine],
    ...(p.og ? [['twitter:image', BASE + p.og]] : []),
    ['keywords', p.keywords.join(', ')]
  ];
  return lines.map(([k, v]) =>
    k.startsWith('og:') || k.startsWith('article:')
      ? `<meta property="${k}" content="${escAttr(v)}">`
      : `<meta name="${k}" content="${escAttr(v)}">`).join('\n') + '\n';
}

/* Signposting (FAIR) link relations */
function signposting(p) {
  const url = urlOf(p);
  return [
    `<link rel="cite-as" href="https://doi.org/${p.doi}">`,
    `<link rel="describedby" type="application/json" href="${url}paper.json">`,
    `<link rel="describedby" type="application/x-bibtex" href="${url}cite.bib">`,
    ...(p.pdfUrl ? [`<link rel="item" type="application/pdf" href="${escAttr(p.pdfUrl)}">`] : []),
    `<link rel="alternate" type="text/markdown" href="${url}index.md">`,
    `<link rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/">`
  ].join('\n') + '\n';
}

/* --------------------------------------------------------- paper pages */
function paperPage(p) {
  const url = urlOf(p);
  const publicReviews = (p.reviews || []).filter(r => r.status === 'published');
  const reviews = publicReviews.map(r => {
    const a = r.assessment || {};
    const summary = r.publication && r.publication.publicSummary;
    const href = r.publication && r.publication.publicUrl;
    return `<article class="review-card"><h3>${esc(a.title || r.reviewId)}</h3>
      <p class="review-meta">${esc(r.reviewClass || 'review')} · ${esc(a.date || 'undated')}${a.recommendation ? ` · recommendation: <strong>${esc(a.recommendation)}</strong>` : ''}${typeof a.confidence === 'number' ? ` · confidence: ${esc(String(a.confidence))}` : ''}</p>
      ${summary ? `<p>${inline(summary)}</p>` : ''}
      ${href ? `<p><a href="${escAttr(href)}" rel="noopener">Read the structured review</a></p>` : ''}
    </article>`;
  }).join('\n');
  const related = (p.relatedWorks || []).map(w =>
    `<li>${w.url ? `<a href="${escAttr(w.url)}" rel="noopener">${esc(w.citation)}</a>` : esc(w.citation)}</li>`).join('');
  const open = (p.openProblems || []).map(o => `<li>${inline(o)}</li>`).join('');
  const media = (p.media || []).map(m => {
    if (m.type === 'video') {
      const yt = youtubeId(m.url);
      if (yt) return `<figure class="media"><div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${yt}?rel=0" title="${escAttr(m.name)}" loading="lazy" allow="encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></div><figcaption>${esc(m.name)} · <a href="${escAttr(m.url)}" rel="noopener">Watch on YouTube</a></figcaption></figure>`;
      return `<figure class="media"><video controls preload="metadata" src="${escAttr(m.url)}"></video><figcaption>${esc(m.name)}</figcaption></figure>`;
    }
    return `<figure class="media"><audio controls preload="metadata" src="${escAttr(m.url)}"></audio><figcaption>${esc(m.name)}</figcaption></figure>`;
  }).join('\n');
  const ytVideo = (p.media || []).find(m => m.type === 'video' && youtubeId(m.url));

  const html = `${head({
    title: `${p.shortTitle} · ${CONFIG.siteName}`,
    description: p.oneLine,
    canonical: url,
    jsonld: articleJsonld(p),
    metaExtra: citationMeta(p),
    math: !!p.math,
    extraLinks: signposting(p)
  })}
<article class="release">
  <div class="wrap">
    ${p.art ? `<div class="cover"><img src="${p.art}" alt="" loading="eager"></div>` : ''}
    <p class="kicker">Press release · ${niceDate(p.datePublished)} · version ${esc(p.version.split(' ')[0])}</p>
    <h1>${esc(p.title)}</h1>
    <p class="standfirst">${inline(p.oneLine)}</p>
    ${p.audio || ytVideo ? `<div class="briefings">
    ${p.audio ? `<div class="listen">
      <button class="play" aria-label="Play audio briefing" data-audio="briefing-audio">▶</button>
      <div class="listen-meta"><strong>Listen to this briefing</strong><span>Narrated summary · AI-generated voice · MP3 · <a href="${p.audio.url}" download>download</a></span>
      <audio id="briefing-audio" preload="metadata" src="${p.audio.url}"></audio></div>
    </div>` : ''}
    ${ytVideo ? `<div class="listen watch">
      <a class="play" href="${escAttr(ytVideo.url)}" rel="noopener" aria-label="Watch the video briefing">▶</a>
      <div class="listen-meta"><strong>Watch this briefing</strong><span>Video summary · YouTube · <a href="${escAttr(ytVideo.url)}" rel="noopener">watch</a> · <a href="#media">play on this page</a></span></div>
    </div>` : ''}
    </div>` : ''}

    <div class="release-grid">
      <div class="body">
${markdown(p.body)}
${media ? `<section class="media-section"><h2 id="media">Media</h2>${media}</section>` : ''}
        ${open ? `<section class="followups"><h2 id="open-directions">Open directions for follow-up research</h2>
        <p class="note">Also available in <a href="${url}paper.json">machine-readable form</a> for research agents and follow-up projects.</p>
        <ol>${open}</ol></section>` : ''}

        <section class="verify"><h2 id="verification-status">Verification status</h2>
        <p>${inline(p.statusDetail)}</p></section>

        ${reviews ? `<section class="reviews"><h2 id="reviews">Reviews and assessments</h2>${reviews}</section>` : ''}

        ${related ? `<section class="related"><h2 id="sources-and-related-work">Sources and related work</h2><ul>${related}</ul></section>` : ''}

        <section class="cite"><h2 id="cite">Cite</h2>
          <div class="cite-card">
            <div class="cite-row"><span id="cite-apa">${esc(p.citeText)}</span><button class="copy" data-copy="cite-apa">Copy</button></div>
            <details><summary>BibTeX</summary>
              <div class="cite-row"><pre class="bib" id="cite-bib">${esc(bibtex(p).trim())}</pre><button class="copy" data-copy="cite-bib">Copy</button></div>
            </details>
            <p class="note">Also: <a href="${url}cite.bib">cite.bib</a> · <a href="${url}paper.json">paper.json</a> · <a href="${url}index.md">this page as Markdown</a></p>
          </div>
        </section>
      </div>

      <aside class="factbox" aria-label="Key facts and downloads">
        ${p.pdfUrl ? `<a class="btn-pdf" href="${escAttr(p.pdfUrl)}" rel="noopener">Read the paper (PDF)</a>` : ''}
        <dl>
          <dt>DOI</dt><dd><a href="https://doi.org/${escAttr(p.doi)}" rel="noopener">${esc(p.doi)}</a></dd>
          <dt>Archive</dt><dd><a href="${escAttr(p.zenodoUrl)}" rel="noopener">Zenodo deposit</a></dd>
          <dt>Code &amp; evidence</dt><dd><a href="${escAttr(p.repoUrl)}" rel="noopener">GitHub repository</a>${p.releaseUrl ? ` · <a href="${escAttr(p.releaseUrl)}" rel="noopener">release</a>` : ''}</dd>
          ${p.problem ? `<dt>Problem</dt><dd>${p.problem.url ? `<a href="${escAttr(p.problem.url)}" rel="noopener">${esc(p.problem.name)}</a>` : esc(p.problem.name)}</dd>` : ''}
          <dt>Version</dt><dd>${esc(p.version)}</dd>
          <dt>Licence</dt><dd><a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="noopener">CC0 1.0</a></dd>
          <dt>Status</dt><dd>Unrefereed · internally replayed; awaiting independent verification</dd>
          <dt>Machine-readable</dt><dd><a href="${url}paper.json">JSON</a> · <a href="${url}index.md">Markdown</a> · <a href="${url}cite.bib">BibTeX</a></dd>
        </dl>
      </aside>
    </div>
  </div>
</article>
${copyScript}
${p.audio ? `<script>
(function(){var b=document.querySelector('.play');if(!b)return;var a=document.getElementById(b.dataset.audio);
b.addEventListener('click',function(){if(a.paused){a.play();b.textContent='❚❚';}else{a.pause();b.textContent='▶';}});
a.addEventListener('ended',function(){b.textContent='▶';});})();
</script>` : ''}
${foot}`;
  write(`releases/${p.slug}/index.html`, html);
  write(`releases/${p.slug}/paper.json`, JSON.stringify(paperApi(p), null, 2));
  write(`releases/${p.slug}/cite.bib`, bibtex(p));
  write(`releases/${p.slug}/index.md`, releaseMarkdown(p));
}

function releaseMarkdown(p) {
  return `---
title: "${p.title.replace(/"/g, '\\"')}"
date: ${p.datePublished}
version: "${p.version}"
doi: ${p.doi}
pdf: ${p.pdfUrl || ''}
repository: ${p.repoUrl}
archive: ${p.zenodoUrl}
license: CC0-1.0
status: unrefereed (internally replayed; not peer reviewed, not independently reproduced, not formally verified)
---

# ${p.title}

${p.body}

## Open directions for follow-up research

${(p.openProblems || []).map(o => `- ${o}`).join('\n')}

## Verification status

${p.statusDetail}

## Sources and related work

${(p.relatedWorks || []).map(w => `- ${w.citation}${w.url ? ` <${w.url}>` : ''}`).join('\n')}
`;
}

function paperApi(p) {
  const publicReviews = (p.reviews || []).filter(r => r.status === 'published');
  return {
    schemaVersion: SCHEMA_VERSION,
    slug: p.slug, title: p.title, shortTitle: p.shortTitle,
    url: urlOf(p), oneLine: p.oneLine, abstract: p.abstract,
    datePublished: p.datePublished, dateModified: p.dateModified || p.datePublished,
    version: p.version, doi: p.doi, doiUrl: `https://doi.org/${p.doi}`,
    conceptDoi: p.conceptDoi || null,
    pdfUrl: p.pdfUrl || null, altPdfUrl: p.altPdfUrl || null,
    zenodoUrl: p.zenodoUrl, repoUrl: p.repoUrl, releaseUrl: p.releaseUrl || null,
    markdownUrl: `${urlOf(p)}index.md`, bibtexUrl: `${urlOf(p)}cite.bib`,
    audioUrl: p.audio ? BASE + p.audio.url : null,
    imageUrl: p.og ? BASE + p.og : null,
    coverArtUrl: p.art ? BASE + p.art : null,
    media: p.media || [],
    authors: p.authors, license: 'CC0-1.0',
    status: p.status || 'unrefereed-candidate',
    verification: {
      peerReviewed: false, independentlyReproduced: false,
      formallyVerified: false, internallyReplayed: true,
      detail: p.statusDetail
    },
    provenance: p.provenance || {
      aiGenerated: true,
      aiAssisted: true,
      generatedBy: p.authors,
      humanRole: 'problem selection, mediation, and publication management',
      disclosure: 'The mathematics/research in this release was generated by AI systems as credited; see the Zenodo record for full attribution.'
    },
    problem: p.problem || null,
    keywords: p.keywords,
    keyResults: p.keyResults || [],
    reviews: publicReviews,
    evidencePackage: p.evidence,
    openProblems: p.openProblems || [],
    relatedWorks: p.relatedWorks || []
  };
}

/* --------------------------------------------------------------- index */
function indexPage() {
  const cards = papers.map(p => `
  <article class="card" data-keywords="${escAttr(p.keywords.join(' ').toLowerCase())}">
    ${p.art ? `<a class="card-art" href="/releases/${p.slug}/" tabindex="-1" aria-hidden="true"><img src="${p.art}" alt="" loading="lazy"></a>` : ''}
    <div class="card-inner">
      <p class="card-date">${niceDate(p.datePublished)}</p>
      <h2><a href="/releases/${p.slug}/">${esc(p.shortTitle)}</a></h2>
      <p>${inline(p.oneLine)}</p>
      <p class="card-links">
        <a href="/releases/${p.slug}/">Release</a>
        ${p.pdfUrl ? `<a href="${escAttr(p.pdfUrl)}" rel="noopener">PDF</a>` : ''}
        <a href="https://doi.org/${escAttr(p.doi)}" rel="noopener">DOI</a>
        <a href="${escAttr(p.repoUrl)}" rel="noopener">Code</a>
        ${p.audio ? `<span class="has-audio" title="Audio briefing available">♪ audio</span>` : ''}
        ${(p.media || []).some(m => m.type === 'video') ? `<span class="has-audio" title="Video briefing available">▸ video</span>` : ''}
      </p>
    </div>
  </article>`).join('\n');

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      {
        '@type': 'CollectionPage', '@id': `${BASE}/#index`,
        url: `${BASE}/`, name: `${CONFIG.siteName} — releases`,
        isPartOf: { '@id': `${BASE}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: papers.map((p, i) => ({
            '@type': 'ListItem', position: i + 1, url: urlOf(p), name: p.title
          }))
        }
      }
    ]
  };

  const heroArt = `<svg viewBox="0 0 1200 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d3330"/><stop offset="1" stop-color="#134e4a"/></linearGradient></defs>
<rect width="1200" height="260" fill="url(#hg)"/>
${Array.from({ length: 9 }, (_, k) => {
    let d = `M -20 ${40 + k * 28}`;
    for (let x = 0; x <= 1220; x += 40) d += ` Q ${x + 20} ${40 + k * 28 + (k % 2 ? 18 : -18)} ${x + 40} ${40 + k * 28}`;
    return `<path d="${d}" fill="none" stroke="#2dd4bf" stroke-width="1" opacity="${(0.05 + k * 0.02).toFixed(2)}"/>`;
  }).join('')}
</svg>`;

  const html = `${head({
    title: `${CONFIG.siteName} — ${CONFIG.tagline}`,
    description: CONFIG.description, canonical: `${BASE}/`, jsonld,
    extraLinks: `<link rel="alternate" type="text/markdown" href="${BASE}/llms.txt">\n`
  })}
<section class="hero">
  <div class="hero-art">${heroArt}</div>
  <div class="wrap hero-inner">
    <h1>${esc(CONFIG.siteName)}</h1>
    <p class="standfirst">${esc(CONFIG.tagline)}. Each release explains one paper twice — once for curious readers, once for specialists — with the paper, code, data, and checks one click away.</p>
  </div>
</section>
<section class="wrap programme-band" aria-labelledby="programme-title">
  <h2 id="programme-title" class="sr-only">Standing programme</h2>
  <div class="programme-cards">
    <a class="programme-card" href="/observatory/">
      <p class="card-date">Research programme · 2 August 2026</p>
      <h3>Policy Identification Observatory</h3>
      <p>A standing agent-native research programme that determines what policy evidence supports, what it does not support, and which decisions remain defensible under uncertainty.</p>
      <p class="card-links"><span class="has-audio" title="Audio briefing available">♪ audio</span><span class="has-audio" title="Video briefing available">▸ video</span></p>
    </a>
    <a class="programme-card" href="/observatory/assurance/">
      <p class="card-date">Observatory essay · 4 August 2026</p>
      <h3>The Case for Assurance Infrastructure</h3>
      <p>Why checking AI-generated evidence, not producing it, binds government use of AI agents — four quantitative bounds, the research avenues that would relax the constraint, and sixteen ranked projects. Includes a plain-English companion essay.</p>
      <p class="card-links"><span class="has-audio" title="Audio briefing available">♪ audio</span><span class="has-audio" title="Video briefing available">▸ video</span></p>
    </a>
  </div>
</section>
<section class="wrap" aria-label="Releases">
  <div class="listhead">
    <h2 class="sr-only">All releases</h2>
    <input id="filter" type="search" placeholder="Filter by topic — e.g. Ramsey, SAT, affine, reshuffling" aria-label="Filter releases">
  </div>
  <div class="cards">${cards}</div>
</section>
<script>
(function(){var f=document.getElementById('filter');if(!f)return;
f.addEventListener('input',function(){var q=f.value.toLowerCase().trim();
document.querySelectorAll('.card').forEach(function(c){
c.style.display=!q||c.textContent.toLowerCase().includes(q)||(c.dataset.keywords||'').includes(q)?'':'none';});});})();
</script>
${foot}`;
  write('index.html', html);
}

/* --------------------------------------------------------------- pages */
/* ------------------------------------------ plain-English companion essay */
function companionParts(companion) {
  const raw = fs.readFileSync(path.join(ROOT, 'pages', companion.mdFile), 'utf8');
  const body = raw.replace(/^# .*\n+/, '').replace(/^## /gm, '### ');
  const html = `<details class="companion-essay">
<summary>${esc(companion.summaryTitle)}<span class="companion-note">${esc(companion.summaryNote)}</span></summary>
<div class="companion-body">${markdown(body).replace(/ id="/g, ' id="plain-')}</div>
</details>`;
  const md = `## ${companion.mdHeading}\n\n${body.trim()}\n\n`;
  return { html, md };
}

function simplePage(rel, title, description, mdFile, type, opts = {}) {
  const url = `${BASE}/${rel}`;
  const pageId = `${url}#page`;
  const associatedMedia = [
    ...(opts.audio ? [{ '@id': `${url}#audio` }] : []),
    ...(opts.video ? [{ '@id': `${url}#video` }] : [])
  ];
  const pageNode = {
    '@type': type, '@id': pageId, url, name: title, description,
    ...(opts.og ? { image: BASE + opts.og, thumbnailUrl: BASE + opts.og } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished, dateModified: opts.dateModified || opts.datePublished } : {}),
    ...(opts.sameAs && opts.sameAs.length ? { sameAs: opts.sameAs } : {}),
    ...(opts.identifier ? { identifier: opts.identifier } : {}),
    ...(associatedMedia.length ? { associatedMedia } : {}),
    inLanguage: CONFIG.language,
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    isPartOf: { '@id': `${BASE}/#website` }
  };
  const audioNode = opts.audio ? [{
    '@type': 'AudioObject', '@id': `${url}#audio`,
    name: opts.audio.name,
    description: opts.audio.description,
    contentUrl: BASE + opts.audio.url,
    encodingFormat: 'audio/mpeg',
    contentSize: String(opts.audio.bytes),
    duration: opts.audio.duration,
    uploadDate: opts.datePublished,
    inLanguage: CONFIG.language,
    transcript: opts.audio.transcript,
    identifier: { '@type': 'PropertyValue', propertyID: 'sha256', value: opts.audio.sha256 },
    isPartOf: { '@id': pageId },
    license: 'https://creativecommons.org/publicdomain/zero/1.0/'
  }] : [];
  const videoNode = opts.video ? [{
    '@type': 'VideoObject', '@id': `${url}#video`,
    name: opts.video.name,
    description: opts.video.description,
    url: opts.video.url,
    embedUrl: opts.video.embedUrl,
    thumbnailUrl: opts.video.thumbnailUrl,
    inLanguage: CONFIG.language,
    publisher: { '@id': `${BASE}/#org` },
    isPartOf: { '@id': pageId }
  }] : [];
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    websiteNode(), pageNode, ...(opts.extraNodes || []), ...audioNode, ...videoNode
  ] };
  const social = [
    ['og:type', opts.datePublished ? 'article' : 'website'],
    ['og:site_name', CONFIG.siteName],
    ['og:title', title], ['og:description', description], ['og:url', url],
    ...(opts.og ? [['og:image', BASE + opts.og], ['og:image:width', '1200'], ['og:image:height', '630']] : []),
    ...(opts.datePublished ? [['article:published_time', iso(opts.datePublished)]] : []),
    ['twitter:card', opts.og ? 'summary_large_image' : 'summary'],
    ['twitter:title', title], ['twitter:description', description],
    ...(opts.og ? [['twitter:image', BASE + opts.og]] : [])
  ].map(([k, v]) => k.startsWith('og:') || k.startsWith('article:')
    ? `<meta property="${k}" content="${escAttr(v)}">`
    : `<meta name="${k}" content="${escAttr(v)}">`).join('\n') + '\n';
  const extraLinks = [
    `<link rel="alternate" type="text/markdown" href="${url}index.md">`,
    ...(opts.machineRecord ? [`<link rel="describedby" type="application/json" href="${url}index.json">`] : []),
    ...(opts.audio ? [
      `<link rel="item" type="audio/mpeg" href="${BASE + opts.audio.url}">`,
      `<link rel="alternate" type="text/plain" href="${BASE + opts.audio.transcriptUrl}" title="Audio transcript">`
    ] : []),
    ...(opts.video ? [`<link rel="item" type="text/html" href="${escAttr(opts.video.url)}" title="Video overview">`] : []),
    ...(opts.citeAs ? [`<link rel="cite-as" href="${escAttr(opts.citeAs)}">`] : []),
    `<link rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/">`
  ].join('\n') + '\n';
  const audioHtml = opts.audio ? `<section class="standalone-audio" aria-labelledby="standalone-audio-title">
    <div class="standalone-audio-copy">
      <strong id="standalone-audio-title">Audio overview</strong>
      <span>${esc(opts.audio.durationLabel)} · AI-generated voice · transcript is the source text</span>
    </div>
    <audio controls preload="metadata" src="${escAttr(opts.audio.url)}">
      <a href="${escAttr(opts.audio.url)}" download>Download the MP3 briefing</a>
    </audio>
    <p class="audio-links"><a href="${escAttr(opts.audio.url)}" download>Download MP3</a> · <a href="${escAttr(opts.audio.transcriptUrl)}">Plain-text transcript</a></p>
    <details class="audio-transcript"><summary>Read the transcript on this page</summary><div>${markdown(opts.audio.transcript)}</div></details>
  </section>` : '';
  const briefingsHtml = opts.releaseLayout && (opts.audio || opts.video) ? `<div class="briefings">
    ${opts.audio ? `<div class="listen">
      <button class="play" aria-label="Play audio briefing" data-audio="standalone-briefing-audio">▶</button>
      <div class="listen-meta"><strong>Listen to this briefing</strong><span>${esc(opts.audio.durationLabel)} · AI-generated voice · <a href="${escAttr(opts.audio.url)}" download>download</a> · <a href="${escAttr(opts.audio.transcriptUrl)}">transcript</a></span>
      <audio id="standalone-briefing-audio" preload="metadata" src="${escAttr(opts.audio.url)}"></audio></div>
    </div>` : ''}
    ${opts.video ? `<div class="listen watch">
      <a class="play" href="${escAttr(opts.video.url)}" rel="noopener" aria-label="Watch the video briefing">▶</a>
      <div class="listen-meta"><strong>Watch this briefing</strong><span>Video overview · YouTube · <a href="${escAttr(opts.video.url)}" rel="noopener">watch</a> · <a href="#media">play on this page</a></span></div>
    </div>` : ''}
  </div>` : '';
  const videoHtml = opts.video ? `<section class="media-section"><h2 id="media">Media</h2>
    <figure class="media"><div class="video-embed"><iframe src="${escAttr(opts.video.embedUrl)}" title="${escAttr(opts.video.name)}" loading="lazy" allow="encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></div>
    <figcaption>${esc(opts.video.name)} · <a href="${escAttr(opts.video.url)}" rel="noopener">Watch on YouTube</a></figcaption></figure>
  </section>` : '';
  const resourcesHtml = opts.resources && opts.resources.length ? `<section class="page-resources" aria-labelledby="page-resources-title">
    <h2 id="page-resources-title">Use the public materials</h2>
    <div class="page-resource-grid">${opts.resources.map(resource => `<div class="page-resource">
      <strong>${esc(resource.label)}</strong>
      ${resource.url ? `<a href="${escAttr(resource.url)}" rel="noopener">${esc(resource.linkText || resource.url)}</a>` : '<span class="pending-link">Pending final publication metadata</span>'}
      ${resource.detail ? `<small>${esc(resource.detail)}</small>` : ''}
    </div>`).join('')}</div>
  </section>` : '';
  const resourcesAside = opts.resources && opts.resources.length ? `<aside class="factbox standalone-factbox" aria-label="Key facts and public materials">
    <h2>Use the public materials</h2>
    <dl>${opts.resources.map(resource => `<dt>${esc(resource.label)}</dt><dd>${resource.url ? `<a href="${escAttr(resource.url)}" rel="noopener">${esc(resource.linkText || resource.url)}</a>` : '<span class="pending-link">Pending final publication metadata</span>'}${resource.detail ? `<small class="fact-detail">${esc(resource.detail)}</small>` : ''}</dd>`).join('')}
      <dt>Licence</dt><dd><a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="noopener">CC0 1.0</a></dd>
      ${opts.sidebarStatus ? `<dt>Status</dt><dd>${esc(opts.sidebarStatus)}</dd>` : ''}
    </dl>
  </aside>` : '';
  const bodyHtml = `${markdown(fs.readFileSync(path.join(ROOT, 'pages', mdFile), 'utf8'))}${videoHtml}`;
  const companion = opts.companion ? companionParts(opts.companion) : { html: '', md: '' };
  const coverHtml = opts.art ? `<div class="cover"><img src="${opts.art}" alt="" loading="eager"></div>` : '';
  const headingHtml = `${opts.kicker ? `<p class="kicker">${esc(opts.kicker)}</p>` : ''}
    <h1>${esc(title)}</h1>
    ${opts.standfirst ? `<p class="standfirst">${inline(opts.standfirst)}</p>` : ''}`;
  const pageHtml = opts.releaseLayout ? `<article class="release standalone-release"><div class="wrap">
    ${coverHtml}
    ${headingHtml}
    ${briefingsHtml}
    <div class="release-grid"><div class="body">${companion.html}${bodyHtml}</div>${resourcesAside}</div>
  </div></article>` : `<article class="release"><div class="wrap"><div class="prose">
    ${coverHtml}
    ${headingHtml}
    ${audioHtml}
    ${resourcesHtml}
    <div class="body">${companion.html}${bodyHtml}</div>
  </div></div></article>`;
  const audioController = opts.releaseLayout && opts.audio ? `<script>
(function(){var b=document.querySelector('.play[data-audio]');if(!b)return;var a=document.getElementById(b.dataset.audio);
b.addEventListener('click',function(){if(a.paused){a.play();b.textContent='❚❚';}else{a.pause();b.textContent='▶';}});
a.addEventListener('ended',function(){b.textContent='▶';});})();
</script>` : '';
  const html = `${head({ title: `${title} · ${CONFIG.siteName}`, description, canonical: url, jsonld, metaExtra: social, extraLinks })}
${pageHtml}
${audioController}
${foot}`;
  write(rel + 'index.html', html);
  const resourceMarkdown = opts.resources && opts.resources.length
    ? `## Use the public materials\n\n${opts.resources.map(resource => `- ${resource.label}: ${resource.url || 'pending final publication metadata'}${resource.detail ? ` — ${resource.detail}` : ''}`).join('\n')}\n\n`
    : '';
  const audioMarkdown = opts.audio
    ? `## Audio overview\n\n- MP3: ${BASE + opts.audio.url}\n- Plain-text transcript: ${BASE + opts.audio.transcriptUrl}\n- Duration: ${opts.audio.durationLabel}\n- Voice: AI-generated; the transcript is the source text\n\n`
    : '';
  const videoMarkdown = opts.video
    ? `## Video overview\n\n- YouTube: ${opts.video.url}\n- Embedded player: ${url}#media\n\n`
    : '';
  write(rel + 'index.md', `---\ntitle: "${title.replace(/"/g, '\\"')}"\nurl: ${url}\nrepository: ${opts.repository || ''}\nrelease: ${opts.release || ''}\ndoi: ${opts.doi || ''}\nlicense: CC0-1.0\nstatus: ${opts.status || ''}\n---\n\n# ${title}\n\n${
    opts.standfirst ? opts.standfirst + '\n\n' : ''}${audioMarkdown}${videoMarkdown}${resourceMarkdown}${companion.md}${fs.readFileSync(path.join(ROOT, 'pages', mdFile), 'utf8')}`);
  if (opts.machineRecord) write(rel + 'index.json', JSON.stringify(opts.machineRecord, null, 2) + '\n');
}

/* --------------------------------------------------------- feeds etc. */
function feeds() {
  const items = papers.map(p => `  <item>
    <title>${esc(p.title)}</title>
    <link>${urlOf(p)}</link>
    <guid isPermaLink="true">${urlOf(p)}</guid>
    <pubDate>${rfc822(p.datePublished)}</pubDate>
    <description>${esc(p.abstract)}</description>${p.audio ? `
    <enclosure url="${BASE + p.audio.url}" length="${p.audio.bytes}" type="audio/mpeg"/>` : ''}
  </item>`).join('\n');
  write('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(CONFIG.siteName)}</title>
  <link>${BASE}/</link>
  <description>${esc(CONFIG.tagline)}</description>
  <language>en-gb</language>
  <lastBuildDate>${rfc822(papers[0].datePublished)}</lastBuildDate>
${items}
</channel>
</rss>
`);
  write('feed.json', JSON.stringify({
    version: 'https://jsonfeed.org/version/1.1',
    title: CONFIG.siteName, home_page_url: `${BASE}/`, feed_url: `${BASE}/feed.json`,
    description: CONFIG.tagline,
    items: papers.map(p => ({
      id: urlOf(p), url: urlOf(p), title: p.title,
      content_text: p.abstract, date_published: iso(p.datePublished),
      external_url: `https://doi.org/${p.doi}`, tags: p.keywords,
      ...(p.og ? { image: BASE + p.og } : {}),
      ...(p.audio ? { attachments: [{ url: BASE + p.audio.url, mime_type: 'audio/mpeg', size_in_bytes: p.audio.bytes }] } : {})
    }))
  }, null, 2));
}

function sitemap() {
  const urls = [
    { loc: `${BASE}/`, lastmod: papers[0].dateModified || papers[0].datePublished },
    { loc: `${BASE}/about/` }, { loc: `${BASE}/observatory/`, lastmod: '2026-08-02' }, { loc: `${BASE}/observatory/assurance/`, lastmod: '2026-08-05' }, { loc: `${BASE}/ai/` },
    ...papers.map(p => ({ loc: urlOf(p), lastmod: p.dateModified || p.datePublished }))
  ];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`);
  const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'Google-Extended', 'PerplexityBot', 'Perplexity-User', 'CCBot', 'Amazonbot', 'Applebot-Extended', 'meta-externalagent', 'Bytespider', 'DuckAssistBot', 'cohere-ai'];
  write('robots.txt', `# ${CONFIG.siteName} — all crawlers and AI agents are welcome.
# Machine-readable index: ${BASE}/llms.txt  ·  Full data: ${BASE}/api/papers.json

User-agent: *
Allow: /

${bots.map(b => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${BASE}/sitemap.xml
`);
}

function llms() {
  const lines = [
    `# ${CONFIG.siteName}`, '',
    `> ${CONFIG.tagline}. Every release describes an unrefereed research result with an open, replayable evidence package (code, data, exact certificates, pinned environments, SHA-256 manifests) archived with a DOI. Nothing on this site is peer reviewed; each page states exactly what has and has not been verified, and lists open follow-up problems in machine-readable form.`, '',
    `Key endpoints: full JSON index at /api/papers.json (JSON Schema at /api/schema.json); per-release JSON at /releases/<slug>/paper.json; per-release Markdown at /releases/<slug>/index.md; per-release BibTeX at /releases/<slug>/cite.bib; RSS at /feed.xml; JSON Feed at /feed.json. Direct paper PDFs are in each release's metadata (pdfUrl).`, '',
    '## Releases', '',
    ...papers.map(p => `- [${p.shortTitle}](${urlOf(p)}): ${p.oneLine} (PDF: ${p.pdfUrl || 'n/a'}; DOI: https://doi.org/${p.doi}; code: ${p.repoUrl}; status: unrefereed)`),
    '',
    '## Machine-readable', '',
    `- [papers.json](${BASE}/api/papers.json): full structured index — titles, DOIs, PDF links, verification status, provenance, key results, keywords, media, and open follow-up problems for every release`,
    `- [schema.json](${BASE}/api/schema.json): JSON Schema for the index`,
    `- [llms-full.txt](${BASE}/llms-full.txt): complete text of every release in one Markdown file`,
    '',
    '## About', '',
    `- [About](${BASE}/about/): what these releases are, the verification ladder, and how to independently verify or refute one`,
    `- [Policy Identification Observatory](${BASE}/observatory/): the standing agent-native audit programme — case protocol, terminal statuses, identification and partial-identification outputs, robust-decision analysis, and how to refute or reproduce a case (JSON: ${BASE}/observatory/index.json; Markdown: ${BASE}/observatory/index.md; audio: ${BASE + OBSERVATORY.audio.url}; transcript: ${BASE + OBSERVATORY.audio.transcriptUrl}; video: ${OBSERVATORY.video.url}; repository: ${OBSERVATORY_PUBLIC.repositoryUrl || 'pending final publication metadata'}; versioned release: ${OBSERVATORY_PUBLIC.releaseUrl || 'pending final publication metadata'}; DOI: ${OBSERVATORY_PUBLIC.doiUrl || 'pending final publication metadata'})`,
    `- [The Case for Assurance Infrastructure](${BASE}/observatory/assurance/): why verification, not generation, binds government use of AI agents — four quantitative bounds, verification economics, research avenues, and sixteen ranked projects (Markdown: ${BASE}/observatory/assurance/index.md)`,
    `- [For AI agents](${BASE}/ai/): metadata conventions and suggested uses (verification, formalisation, follow-up research)`
  ];
  write('llms.txt', lines.join('\n') + '\n');

  const full = [`# ${CONFIG.siteName} — full text`, '',
    ...papers.flatMap(p => [
      `---`, '', `# ${p.title}`, '',
      `- URL: ${urlOf(p)}`, `- PDF: ${p.pdfUrl || 'n/a'}`, `- DOI: https://doi.org/${p.doi}`, `- Code: ${p.repoUrl}`,
      `- Published: ${p.datePublished} · Version: ${p.version} · Licence: CC0-1.0`,
      `- Status: unrefereed (internally replayed; not peer reviewed, not independently reproduced, not formally verified)`, '',
      p.body, '',
      `## Open directions (machine-readable copy at ${urlOf(p)}paper.json)`, '',
      ...(p.openProblems || []).map(o => `- ${o}`), ''
    ]),
    '---', '', `# ${OBSERVATORY.title}`, '',
    `- URL: ${BASE}/observatory/`,
    `- Machine record: ${BASE}/observatory/index.json`,
    `- Repository: ${OBSERVATORY_PUBLIC.repositoryUrl || 'pending final publication metadata'}`,
    `- Versioned release: ${OBSERVATORY_PUBLIC.releaseUrl || 'pending final publication metadata'}`,
    `- DOI: ${OBSERVATORY_PUBLIC.doiUrl || 'pending final publication metadata'}`,
    `- Audio: ${BASE + OBSERVATORY.audio.url}`,
    `- Transcript: ${BASE + OBSERVATORY.audio.transcriptUrl}`,
    `- Status: ${OBSERVATORY.status}`,
    `- Included case terminal status: ${OBSERVATORY.includedCase.terminalStatus}; truth certified: ${OBSERVATORY.includedCase.truthCertified}`, '',
    OBSERVATORY_BODY, ''
  ];
  write('llms-full.txt', full.join('\n'));
}

function api() {
  write('api/papers.json', JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    site: CONFIG.siteName, baseUrl: BASE,
    description: CONFIG.description,
    schema: `${BASE}/api/schema.json`,
    count: papers.length,
    papers: papers.map(paperApi)
  }, null, 2));
  write('api/schema.json', JSON.stringify({
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${BASE}/api/schema.json`,
    title: `${CONFIG.siteName} papers index`,
    type: 'object',
    required: ['schemaVersion', 'count', 'papers'],
    properties: {
      schemaVersion: { type: 'string' }, site: { type: 'string' }, baseUrl: { type: 'string' },
      description: { type: 'string' }, schema: { type: 'string' }, count: { type: 'integer' },
      papers: { type: 'array', items: { $ref: '#/$defs/paper' } }
    },
    $defs: {
      paper: {
        type: 'object',
        required: ['slug', 'title', 'url', 'doi', 'datePublished', 'version', 'authors', 'license', 'status', 'verification', 'keywords'],
        properties: {
          schemaVersion: { type: 'string' }, slug: { type: 'string' }, title: { type: 'string' },
          shortTitle: { type: 'string' }, url: { type: 'string', format: 'uri' },
          oneLine: { type: 'string' }, abstract: { type: 'string' },
          datePublished: { type: 'string', format: 'date' }, dateModified: { type: 'string', format: 'date' },
          version: { type: 'string' }, doi: { type: 'string' }, doiUrl: { type: 'string', format: 'uri' },
          conceptDoi: { type: ['string', 'null'] },
          pdfUrl: { type: ['string', 'null'], format: 'uri', description: 'Direct link to the manuscript PDF' },
          altPdfUrl: { type: ['string', 'null'], format: 'uri' },
          zenodoUrl: { type: 'string', format: 'uri' }, repoUrl: { type: 'string', format: 'uri' },
          releaseUrl: { type: ['string', 'null'], format: 'uri' },
          markdownUrl: { type: 'string', format: 'uri' }, bibtexUrl: { type: 'string', format: 'uri' },
          audioUrl: { type: ['string', 'null'], format: 'uri', description: 'Narrated plain-language briefing (MP3)' },
          imageUrl: { type: ['string', 'null'], format: 'uri' }, coverArtUrl: { type: ['string', 'null'], format: 'uri' },
          media: { type: 'array', items: { type: 'object', properties: { type: { enum: ['audio', 'video'] }, url: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' } } } },
          authors: { type: 'array', items: { type: 'string' } },
          license: { const: 'CC0-1.0' },
          status: { enum: ['unrefereed-candidate', 'unrefereed-preprint'] },
          verification: {
            type: 'object',
            required: ['peerReviewed', 'independentlyReproduced', 'formallyVerified', 'internallyReplayed'],
            properties: {
              peerReviewed: { type: 'boolean' }, independentlyReproduced: { type: 'boolean' },
              formallyVerified: { type: 'boolean' }, internallyReplayed: { type: 'boolean' },
              detail: { type: 'string' }
            }
          },
          provenance: { type: 'object', properties: { aiGenerated: { type: 'boolean' }, aiAssisted: { type: 'boolean' }, generatedBy: { type: 'array', items: { type: 'string' } }, humanRole: { type: 'string' }, disclosure: { type: 'string' } } },
          problem: { type: ['object', 'null'], properties: { name: { type: 'string' }, url: { type: 'string' } } },
          keywords: { type: 'array', items: { type: 'string' } },
          keyResults: { type: 'array', items: { type: 'string' } },
          evidencePackage: { type: 'string' },
          openProblems: { type: 'array', items: { type: 'string' }, description: 'Concrete follow-up research problems, well-posed enough to start on' },
          relatedWorks: { type: 'array', items: { type: 'object', properties: { citation: { type: 'string' }, url: { type: 'string' } } } },
          reviews: {
            type: 'array',
            description: 'Published reviews and assessments; draft or private records are excluded from public output.',
            items: {
              type: 'object',
              required: ['schemaVersion', 'reviewId', 'reviewClass', 'status', 'subject', 'assessment', 'assuranceImpact'],
              properties: {
                schemaVersion: { type: 'string' }, reviewId: { type: 'string' },
                reviewClass: { enum: ['editorial-assessment', 'external-review', 'independent-reproduction', 'formal-verification-report', 'research-assessment', 'correction-or-refutation'] },
                status: { enum: ['published', 'superseded', 'withdrawn', 'disputed'] },
                subject: { type: 'object', required: ['canonicalUrl', 'version', 'title'], properties: { canonicalUrl: { type: 'string', format: 'uri' }, doi: { type: ['string', 'null'] }, version: { type: 'string' }, releaseTag: { type: ['string', 'null'] }, title: { type: 'string' } } },
                reviewer: { type: 'object' }, assessment: { type: 'object' }, scope: { type: 'object' }, evidenceAssessment: { type: 'object' },
                findings: { type: 'array', items: { type: 'object' } }, requiredRevisions: { type: 'array', items: { type: 'object' } },
                limitationsAndNonClaims: { type: 'array', items: { type: 'string' } }, refCalibration: { type: 'object' }, editorialHandling: { type: 'object' }, provenance: { type: 'object' },
                assuranceImpact: { type: 'object', required: ['changesVerificationStatus', 'changesPeerReviewedFlag', 'changesIndependentReproductionFlag', 'changesFormalVerificationFlag'], properties: { changesVerificationStatus: { type: 'boolean' }, changesPeerReviewedFlag: { type: 'boolean' }, changesIndependentReproductionFlag: { type: 'boolean' }, changesFormalVerificationFlag: { type: 'boolean' }, explanation: { type: 'string' } } },
                publication: { type: 'object' }
              }
            }
          }
        }
      }
    }
  }, null, 2));
}

const OBSERVATORY_URL = `${BASE}/observatory/`;
const OBSERVATORY_VIDEO_ID = youtubeId(OBSERVATORY.video && OBSERVATORY.video.url);
if (!OBSERVATORY_VIDEO_ID) throw new Error('pages/observatory.json: video.url is not a supported YouTube URL');
if (OBSERVATORY.video.embedUrl !== `https://www.youtube-nocookie.com/embed/${OBSERVATORY_VIDEO_ID}?rel=0`) {
  throw new Error('pages/observatory.json: video.embedUrl must use the privacy-enhanced YouTube embed URL');
}
const OBSERVATORY_RESOURCES = [
  {
    label: 'Repository', url: OBSERVATORY_PUBLIC.repositoryUrl,
    linkText: 'GitHub repository', detail: 'Schemas, case records, validators, replay commands and tests.'
  },
  {
    label: 'Versioned release', url: OBSERVATORY_PUBLIC.releaseUrl,
    linkText: OBSERVATORY.releaseVersion, detail: 'Immutable release assets bound to the candidate version.'
  },
  {
    label: 'DOI archive', url: OBSERVATORY_PUBLIC.doiUrl,
    linkText: OBSERVATORY_PUBLIC.doi || 'Zenodo DOI', detail: 'Citable archived snapshot of the release.'
  },
  {
    label: 'Machine-readable record', url: `${OBSERVATORY_URL}index.json`,
    linkText: 'Observatory JSON', detail: 'Status, trust boundary, public links, audio metadata and hashes.'
  }
];
const OBSERVATORY_RECORD = {
  schemaVersion: OBSERVATORY.schemaVersion,
  recordType: 'research-infrastructure',
  title: OBSERVATORY.title,
  url: OBSERVATORY_URL,
  markdownUrl: `${OBSERVATORY_URL}index.md`,
  metadataUrl: `${OBSERVATORY_URL}index.json`,
  datePublished: OBSERVATORY.datePublished,
  dateModified: OBSERVATORY.dateModified,
  version: OBSERVATORY.releaseVersion,
  license: OBSERVATORY.license,
  status: OBSERVATORY.status,
  repositoryUrl: OBSERVATORY_PUBLIC.repositoryUrl,
  releaseUrl: OBSERVATORY_PUBLIC.releaseUrl,
  doi: OBSERVATORY_PUBLIC.doi,
  doiUrl: OBSERVATORY_PUBLIC.doiUrl,
  zenodoUrl: OBSERVATORY_PUBLIC.zenodoUrl,
  claimCeiling: OBSERVATORY.claimCeiling,
  includedCase: OBSERVATORY.includedCase,
  verification: OBSERVATORY.verification,
  releaseReadiness: {
    publicLinksFinal: OBSERVATORY_UNRESOLVED.length === 0,
    unresolvedFields: OBSERVATORY_UNRESOLVED
  },
  audio: {
    url: BASE + OBSERVATORY.audio.url,
    transcriptUrl: BASE + OBSERVATORY.audio.transcriptUrl,
    duration: OBSERVATORY.audio.duration,
    durationLabel: OBSERVATORY.audio.durationLabel,
    encodingFormat: 'audio/mpeg',
    bytes: OBSERVATORY_AUDIO_BYTES,
    sha256: OBSERVATORY.audio.sha256,
    transcriptSha256: OBSERVATORY.audio.transcriptSha256,
    voiceDisclosure: OBSERVATORY.audio.voiceDisclosure
  },
  video: {
    id: OBSERVATORY_VIDEO_ID,
    url: OBSERVATORY.video.url,
    embedUrl: OBSERVATORY.video.embedUrl,
    thumbnailUrl: OBSERVATORY.video.thumbnailUrl,
    name: OBSERVATORY.video.name,
    description: OBSERVATORY.video.description,
    publisher: OBSERVATORY.video.publisher,
    provider: OBSERVATORY.video.provider
  },
  artwork: {
    pipelineUrl: `${BASE}/assets/art/observatory-pipeline.png`,
    pipelineSha256: OBSERVATORY_PIPELINE_PROVENANCE.sha256,
    provenanceUrl: `${BASE}/assets/art/observatory-pipeline.provenance.json`
  },
  agentUse: [
    'Read this record and the repository AI index before using an included case.',
    'Inspect the terminal status, evidence boundary, claim ceiling and unresolved objections.',
    'Run the pinned replay commands; do not treat deterministic replay as independent reproduction or claim truth.',
    'Preserve identifiers, qualifications, provenance and supersession when reusing an output.'
  ]
};

/* ---------------------------------------------------------------- main */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });
write('_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Link: <${BASE}/llms.txt>; rel="alternate"; type="text/markdown"

/assets/*
  Cache-Control: public, max-age=604800

/releases/*/paper.json
  Access-Control-Allow-Origin: *

/observatory/index.json
  Access-Control-Allow-Origin: *

/assets/audio/*
  Access-Control-Allow-Origin: *

/api/*
  Access-Control-Allow-Origin: *
`);
papers.forEach(paperPage);
indexPage();
simplePage('about/', 'About this site', `What ${CONFIG.siteName} is, what these releases are, and how to verify or refute one.`, 'about.md', 'AboutPage');
simplePage('observatory/', 'Policy Identification Observatory', 'A standing agent-native research programme that determines what policy evidence supports, what it does not support, and which decisions remain defensible under uncertainty.', 'observatory.md', 'WebPage', {
  releaseLayout: true,
  art: '/assets/art/observatory.svg',
  og: fs.existsSync(path.join(ROOT, 'assets', 'og', 'observatory.png')) ? '/assets/og/observatory.png' : null,
  kicker: 'Research programme · foundational build complete · 2 August 2026',
  standfirst: 'A standing agent-native research programme for determining what policy evidence supports, what it does not support, and which decisions remain defensible under uncertainty.',
  datePublished: OBSERVATORY.datePublished,
  dateModified: OBSERVATORY.dateModified,
  sameAs: [OBSERVATORY_PUBLIC.repositoryUrl, OBSERVATORY_PUBLIC.releaseUrl, OBSERVATORY_PUBLIC.doiUrl, OBSERVATORY_PUBLIC.zenodoUrl].filter(Boolean),
  identifier: OBSERVATORY_PUBLIC.doi ? { '@type': 'PropertyValue', propertyID: 'DOI', value: OBSERVATORY_PUBLIC.doi } : OBSERVATORY.releaseVersion,
  citeAs: OBSERVATORY_PUBLIC.doiUrl,
  repository: OBSERVATORY_PUBLIC.repositoryUrl,
  release: OBSERVATORY_PUBLIC.releaseUrl,
  doi: OBSERVATORY_PUBLIC.doi,
  status: OBSERVATORY.status,
  sidebarStatus: 'Candidate research infrastructure; founding exemplar rejected for insufficient rigour.',
  resources: OBSERVATORY_RESOURCES,
  machineRecord: OBSERVATORY_RECORD,
  audio: {
    name: 'Policy Identification Observatory — audio overview',
    description: 'An accessible narrated introduction to the Observatory, its materials, trust boundary and safe reuse by people and research agents.',
    ...OBSERVATORY.audio,
    transcript: OBSERVATORY_TRANSCRIPT
  },
  video: OBSERVATORY.video,
  extraNodes: [{
    '@type': 'ResearchProject', '@id': `${BASE}/observatory/#programme`,
    name: 'Policy Identification Observatory',
    alternateName: 'PIO',
    url: `${BASE}/observatory/`,
    description: 'A standing agent-native research programme that determines what policy evidence supports, what it does not support, and which decisions remain defensible under uncertainty.',
    version: OBSERVATORY.releaseVersion,
    creativeWorkStatus: 'Candidate research infrastructure; included founding case is REJECTED_INSUFFICIENT_RIGOUR and is not truth-certified',
    sameAs: [OBSERVATORY_PUBLIC.repositoryUrl, OBSERVATORY_PUBLIC.releaseUrl, OBSERVATORY_PUBLIC.doiUrl, OBSERVATORY_PUBLIC.zenodoUrl].filter(Boolean),
    parentOrganization: { '@id': `${BASE}/#org` },
    knowsAbout: ['causal identification', 'partial identification', 'measurement and accounting audit', 'robust decision-making under model ambiguity', 'adversarial verification', 'agent-native research infrastructure'],
    subjectOf: [{ '@id': `${BASE}/observatory/#page` }, { '@id': `${BASE}/observatory/#audio` }, { '@id': `${BASE}/observatory/#video` }]
  },
  ...(OBSERVATORY_PUBLIC.repositoryUrl ? [{
    '@type': 'SoftwareSourceCode', '@id': `${BASE}/observatory/#software`,
    name: 'Policy Identification Observatory',
    codeRepository: OBSERVATORY_PUBLIC.repositoryUrl,
    ...(OBSERVATORY_PUBLIC.releaseUrl ? { downloadUrl: OBSERVATORY_PUBLIC.releaseUrl } : {}),
    version: OBSERVATORY.releaseVersion,
    license: 'https://creativecommons.org/publicdomain/zero/1.0/'
  }] : []),
  ...(OBSERVATORY_PUBLIC.zenodoUrl ? [{
    '@type': 'Dataset', '@id': `${BASE}/observatory/#deposit`,
    name: 'Policy Identification Observatory — archived candidate release',
    url: OBSERVATORY_PUBLIC.zenodoUrl,
    identifier: OBSERVATORY_PUBLIC.doiUrl,
    version: OBSERVATORY.releaseVersion,
    license: 'https://creativecommons.org/publicdomain/zero/1.0/'
  }] : [])]
});
simplePage('observatory/assurance/', 'The Case for Assurance Infrastructure', 'Why verification, not generation, binds government use of AI agents: four quantitative bounds, the verification cost evidence, research avenues that make assurance cheaper and more capable, and sixteen ranked projects.', 'assurance.md', 'WebPage', {
  releaseLayout: true,
  art: '/assets/art/assurance.svg',
  og: fs.existsSync(path.join(ROOT, 'assets', 'og', 'assurance.png')) ? '/assets/og/assurance.png' : null,
  kicker: 'Observatory essay \u00b7 4 August 2026',
  standfirst: 'The technical argument that checking AI-generated evidence, not producing it, is the binding constraint on government analysis; the research avenues that would relax it; and sixteen tractable projects, ranked by probability of delivery.',
  datePublished: ASSURANCE.datePublished,
  dateModified: ASSURANCE.dateModified,
  companion: {
    mdFile: 'assurance-plain.md',
    summaryTitle: 'Plain-English version: Who Checks the Machines?',
    summaryNote: 'The same argument without the technical machinery · about a 15-minute read · select to expand',
    mdHeading: 'Plain-English companion: Who Checks the Machines?'
  },
  sidebarStatus: 'Observatory essay. Every derived number independently recomputed and the argument adversarially reviewed before publication; probabilities are calibrated judgements, not measurements.',
  machineRecord: ASSURANCE_RECORD,
  resources: [
    { label: 'Read as Markdown', url: `${BASE}/observatory/assurance/index.md`, linkText: 'index.md', detail: 'The full essay in plain Markdown, for people and research agents.' },
    { label: 'Project record', url: `${BASE}/observatory/assurance/index.json`, linkText: 'index.json', detail: 'All 21 projects: full resolution criteria, per-judge scores, scoring definitions.' },
    { label: 'Audio briefing', url: `${BASE}/assets/audio/assurance.mp3`, linkText: 'assurance.mp3', detail: `${ASSURANCE.audio.durationLabel} \u00b7 AI-narrated \u00b7 SHA-256 receipt in pages/assurance.json.` },
    { label: 'Transcript', url: `${BASE}/assets/audio/assurance-transcript.txt`, linkText: 'assurance-transcript.txt', detail: 'The narration source text.' },
    { label: 'Comic', url: `${BASE}/assets/comics/who-checks-the-machines`, linkText: 'who-checks-the-machines', detail: 'The plain-English companion essay retold as a one-page comic. Every number in it is real.' },
    { label: 'Parent programme', url: `${BASE}/observatory/`, linkText: 'Policy Identification Observatory', detail: 'The standing agent-native audit programme this essay supports.' }
  ],
  audio: {
    name: 'The Case for Assurance Infrastructure \u2014 audio briefing',
    description: 'A narrated overview of the essay: the four bounds, the verification cost evidence, and the ranked research programme.',
    ...ASSURANCE.audio,
    transcript: ASSURANCE_TRANSCRIPT
  },
  video: ASSURANCE.video
});
simplePage('ai/', 'For AI agents and automated research tools', 'Machine-readable endpoints, metadata conventions, and follow-up problem lists for research agents.', 'ai.md', 'WebPage');
feeds();
sitemap();
llms();
api();
console.log(`Built ${papers.length} releases plus Observatory → dist/  (paper audio: ${papers.filter(p => p.audio).length}; Observatory audio: 1; art: ${papers.filter(p => p.art).length}; og: ${papers.filter(p => p.og).length})`);
