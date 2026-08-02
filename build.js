#!/usr/bin/env node
/*
 * Evidence Press — static site builder.
 * Dependency-free: runs on any Node ≥ 16. Usage: node build.js  → writes ./dist
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE = CONFIG.baseUrl.replace(/\/$/, '');
const SCHEMA_VERSION = '1.2';

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
  return { '@context': 'https://schema.org', '@graph': graph.map(n => JSON.parse(JSON.stringify(n))) };
}

/* content-hash for cache-busting the stylesheet link */
const CSS_V = require('crypto').createHash('sha256')
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
function simplePage(rel, title, description, mdFile, type) {
  const jsonld = { '@context': 'https://schema.org', '@graph': [websiteNode(), {
    '@type': type, url: `${BASE}/${rel}`, name: title,
    isPartOf: { '@id': `${BASE}/#website` } }] };
  const html = `${head({ title: `${title} · ${CONFIG.siteName}`, description, canonical: `${BASE}/${rel}`, jsonld })}
<article class="release"><div class="wrap"><div class="prose">
  <h1>${esc(title)}</h1>
  <div class="body">
${markdown(fs.readFileSync(path.join(ROOT, 'pages', mdFile), 'utf8'))}
  </div>
</div></div></article>
${foot}`;
  write(rel + 'index.html', html);
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
    { loc: `${BASE}/about/` }, { loc: `${BASE}/ai/` },
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
    ])];
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
          relatedWorks: { type: 'array', items: { type: 'object', properties: { citation: { type: 'string' }, url: { type: 'string' } } } }
        }
      }
    }
  }, null, 2));
}

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

/api/*
  Access-Control-Allow-Origin: *
`);
papers.forEach(paperPage);
indexPage();
simplePage('about/', 'About this site', `What ${CONFIG.siteName} is, what these releases are, and how to verify or refute one.`, 'about.md', 'AboutPage');
simplePage('ai/', 'For AI agents and automated research tools', 'Machine-readable endpoints, metadata conventions, and follow-up problem lists for research agents.', 'ai.md', 'WebPage');
feeds();
sitemap();
llms();
api();
console.log(`Built ${papers.length} releases → dist/  (audio: ${papers.filter(p => p.audio).length}, art: ${papers.filter(p => p.art).length}, og: ${papers.filter(p => p.og).length})`);
