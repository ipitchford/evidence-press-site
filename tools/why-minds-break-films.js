'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT_PATH = '/why-minds-break/films/';
const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const readSeries = root => JSON.parse(fs.readFileSync(path.join(root, 'pages/why-minds-break-films.json'), 'utf8'));

function routes(root, base) {
  const data = readSeries(root);
  return ['', ...data.episodes.map(e => `${e.slug}/`)].map(suffix => ({ loc: `${base}${ROOT_PATH}${suffix}`, lastmod: data.dateModified }));
}

function build({ root, base, head, write, markdown, esc, escAttr }) {
  const data = readSeries(root);
  if (data.episodes.length !== 11 || data.episodes.some((e, i) => e.number !== i + 1)) throw Error('The film companion requires all eleven distinct episodes in order.');
  const version = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex').slice(0, 12);
  const css = `/assets/why-minds-break-films.css?v=${version('assets/why-minds-break-films.css')}`;
  const js = `/assets/js/why-minds-break-films.js?v=${version('assets/js/why-minds-break-films.js')}`;
  const url = e => `https://www.youtube.com/watch?v=${e.youtubeId}`;
  const essayUrl = e => `${ROOT_PATH}${e.slug}/`;
  const sourceDir = path.join(root, 'pages/why-minds-break-films');
  const episodes = data.episodes.map(e => {
    if (!/^[A-Za-z0-9_-]{11}$/.test(e.youtubeId) || !/^[a-z0-9-]+$/.test(e.slug) || path.basename(e.essayFile) !== e.essayFile) throw Error(`Invalid film record: ${e.slug}`);
    const essay = fs.readFileSync(path.join(sourceDir, 'essays', e.essayFile), 'utf8').replace(/^# .*\n+/, '').trim();
    const transcript = fs.readFileSync(path.join(sourceDir, `${e.slug}.transcript.md`), 'utf8').trim();
    const wordCount = essay.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').split(/\s+/).length;
    if (wordCount < 1800) throw Error(`${e.slug}: the research essay is unexpectedly short.`);
    for (const asset of [e.poster, e.captions]) if (!fs.existsSync(path.join(root, asset))) throw Error(`Missing companion asset: ${asset}`);
    return { ...e, essay, transcript, wordCount, readingMinutes: Math.ceil(wordCount / 220) };
  });
  const disclaimer = `<aside class="wmb-disclaimer" aria-label="Medical information"><strong>Information, not medical advice.</strong> These films and essays explain research; they cannot diagnose a condition or choose treatment for you. Discuss personal concerns with a qualified health professional, and do not change prescribed treatment because of this material. If someone is in immediate danger or cannot stay safe, seek urgent local help.</aside>`;
  const footer = `</main><footer class="wmb-footer"><div class="wmb-shell"><p><strong>Evidence Press</strong> · A companion to <a href="/why-minds-break/">Why Minds Break</a> by Ian Pitchford.</p><p>The essays bring together research on causes, brain and body processes, and care. Sources are linked throughout. They were prepared with AI assistance and have not had independent clinical review. Evidence and recommendations can change.</p><p>People and scenes in the films are fictional AI-generated illustrations. Narration is synthetic. Original essay text is available under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>; the book retains its own copyright.</p><nav aria-label="Footer"><a href="${ROOT_PATH}">All films and essays</a><a href="${escAttr(data.playlistUrl)}">YouTube playlist</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer></body></html>`;
  const pageHead = (title, description, canonical, jsonld, extra = '') => head({
    title: `${title} · Evidence Press`, description, canonical, jsonld,
    extraLinks: `<link rel="stylesheet" href="${css}">\n<link rel="alternate" type="text/markdown" href="${canonical}index.md">\n${extra}`,
    metaExtra: `<meta property="og:type" content="website"><meta property="og:site_name" content="Evidence Press"><meta property="og:title" content="${escAttr(title)}"><meta property="og:description" content="${escAttr(description)}"><meta property="og:url" content="${escAttr(canonical)}"><meta property="og:image" content="${base}/assets/og/why-minds-break.png"><meta name="twitter:card" content="summary_large_image">\n`
  });
  const poster = e => `<a class="wmb-poster" data-play href="${url(e)}" aria-label="Play ${escAttr(e.title)}"><img src="${e.poster}" alt="" width="1280" height="720" fetchpriority="high"><span class="wmb-play"><span aria-hidden="true">▶</span> Play film</span><span class="wmb-duration">${time(e.duration)}</span></a>`;
  const chapters = e => e.chapters.map(c => `<a href="${url(e)}&amp;t=${Math.floor(c.start)}s" data-start="${Math.floor(c.start)}"><span>${time(c.start)}</span> ${esc(c.title)}</a>`).join('');
  const library = episodes.map(e => `<a class="wmb-episode" href="${essayUrl(e)}" data-episode="${e.number}"${e.number === 1 ? ' aria-current="true"' : ''}><img src="${e.poster}" width="128" height="72" alt="" loading="lazy"><span><strong>${esc(e.title)}</strong><small>${String(e.number).padStart(2, '0')} · ${time(e.duration)}</small></span></a>`).join('\n');
  const publicEpisodes = episodes.map(({ essay, transcript, essayFile, ...e }) => ({ ...e, youtubeUrl: url(e), essayUrl: essayUrl(e) }));
  const record = { title: data.title, description: data.description, url: `${base}${ROOT_PATH}`, datePublished: data.datePublished, dateModified: data.dateModified, playlistUrl: data.playlistUrl, channelUrl: data.channelUrl, educationalInformation: true, medicalAdvice: false, independentlyClinicallyReviewed: false, episodes: publicEpisodes };
  const first = episodes[0];
  const collectionLd = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: data.title, description: data.description, url: record.url, datePublished: data.datePublished, dateModified: data.dateModified, publisher: { '@type': 'Organization', name: 'Evidence Press', url: base }, about: { '@type': 'Book', name: 'Why Minds Break', url: `${base}/why-minds-break/` }, mainEntity: { '@type': 'ItemList', numberOfItems: episodes.length, itemListElement: episodes.map(e => ({ '@type': 'ListItem', position: e.number, name: e.title, url: `${base}${essayUrl(e)}` })) } };
  write('why-minds-break/films/index.html', `${pageHead(data.title, data.description, record.url, collectionLd, `<script defer src="${js}"></script>\n`)}
<div class="wmb-films wmb-shell" data-film-library>
<header class="wmb-intro"><p class="wmb-eyebrow"><a href="/why-minds-break/">A companion to the book</a> · Evidence Press</p><h1>Why Minds Break</h1><p class="wmb-standfirst">Eleven short films on why difficulties develop, what researchers understand about the brain and body, and care that can help.</p><p class="wmb-meta">11 films · 71 minutes · English captions · <a href="${data.playlistUrl}">Watch the playlist on YouTube</a></p></header>
<div class="wmb-layout"><section class="wmb-selected" aria-labelledby="wmb-title"><div id="wmb-player" class="wmb-player">${poster(first)}</div><p class="wmb-selection" id="wmb-selection">Episode 01 · ${time(first.duration)}</p><h2 id="wmb-title">${esc(first.title)}</h2><p id="wmb-description" class="wmb-description">${esc(first.description)}</p><div class="wmb-actions"><a class="wmb-primary" id="wmb-essay" href="${essayUrl(first)}">Read the research essay</a><a id="wmb-youtube" href="${url(first)}">Watch on YouTube</a><a id="wmb-captions" href="${first.captions}" download>Download captions</a></div><nav class="wmb-chapters" id="wmb-chapters" aria-label="Film chapters">${chapters(first)}</nav><details class="wmb-transcript"><summary>Read the film transcript</summary><div id="wmb-transcript">${markdown(first.transcript).replace(/ id="/g, ' id="transcript-')}</div></details><p class="wmb-player-note">Playing a film loads the YouTube player. You can also open each film directly on YouTube.</p>${disclaimer}</section><nav class="wmb-library" aria-label="Choose a film"><h2>Explore the films</h2>${library}</nav></div>
<section class="wmb-about"><h2>Go beyond the film</h2><p>Each research essay explains the fuller evidence on causes, brain and body processes, and treatment or support. It also sets out what remains uncertain. Major depression and persistent depression have separate essays; findings about one condition or treatment do not automatically apply to another.</p><p><a href="/why-minds-break/">Explore the book and its chapters →</a></p></section>
${episodes.map(e => `<template id="wmb-transcript-${e.number}">${markdown(e.transcript).replace(/ id="/g, ` id="transcript-${e.number}-`)}</template>`).join('\n')}
<script type="application/json" id="wmb-film-data">${JSON.stringify(publicEpisodes).replace(/</g, '\\u003c')}</script></div>${footer}`);
  write('why-minds-break/films/series.json', `${JSON.stringify(record, null, 2)}\n`);
  write('why-minds-break/films/index.md', `# ${data.title}\n\n${data.description}\n\nInformation, not medical advice. Consult a qualified health professional about personal concerns.\n\n${episodes.map(e => `## ${e.number}. ${e.title}\n\n${e.description}\n\n[Watch the film](${url(e)}) · [Read the research essay](${base}${essayUrl(e)})`).join('\n\n')}\n`);

  for (const e of episodes) {
    const essayHtml = markdown(e.essay);
    const headings = [...essayHtml.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)];
    const toc = headings.map(h => `<li><a href="#${escAttr(h[1])}">${h[2]}</a></li>`).join('');
    const canonical = `${base}${essayUrl(e)}`;
    const ld = { '@context': 'https://schema.org', '@type': 'WebPage', name: `${e.title}: causes, mechanisms and care`, description: e.description, url: canonical, datePublished: data.datePublished, dateModified: data.dateModified, isPartOf: { '@type': 'CollectionPage', name: data.title, url: record.url }, publisher: { '@type': 'Organization', name: 'Evidence Press', url: base }, inLanguage: 'en-GB' };
    const prev = episodes[e.number - 2], next = episodes[e.number];
    write(`why-minds-break/films/${e.slug}/index.html`, `${pageHead(`${e.title} — the research explained`, e.description, canonical, ld)}<article class="wmb-research wmb-shell"><header class="wmb-intro"><p class="wmb-eyebrow"><a href="${ROOT_PATH}#episode-${e.number}">Why Minds Break · Films and essays</a></p><h1>${esc(e.title)}</h1><p class="wmb-standfirst">${esc(e.description)}</p><p class="wmb-meta">The research explained · ${e.readingMinutes} minute read · Published 7 November 2026</p><div class="wmb-actions"><a class="wmb-primary" href="${ROOT_PATH}#episode-${e.number}">Watch the ${time(e.duration)} film</a><a href="${url(e)}">Open on YouTube</a></div></header>${disclaimer}<div class="wmb-reading-layout"><nav class="wmb-toc" aria-label="In this essay"><h2>In this essay</h2><ol>${toc}</ol></nav><div class="wmb-essay"><div class="wmb-essay-text">${essayHtml}</div><details class="wmb-transcript"><summary>Read the film transcript</summary><div>${markdown(e.transcript).replace(/ id="/g, ' id="transcript-')}</div></details><p class="wmb-editorial-note">About the evidence: these essays draw on targeted research syntheses with evidence cut-offs of 4–5 November 2026. Those syntheses used mainly English-language sources and some abstract-only evidence; they were not exhaustive systematic reviews. The linked sources give further detail about the people studied and the limits of the findings. This essay was written for the companion website and is not an extract from the book.</p><nav class="wmb-next" aria-label="Other essays">${prev ? `<a href="${essayUrl(prev)}" rel="prev">← ${esc(prev.title)}</a>` : '<span></span>'}<a href="${ROOT_PATH}">All eleven films and essays</a>${next ? `<a href="${essayUrl(next)}" rel="next">${esc(next.title)} →</a>` : '<span></span>'}</nav></div></div></article>${footer}`);
    write(`why-minds-break/films/${e.slug}/index.md`, `# ${e.title}\n\n${e.description}\n\nInformation, not medical advice. Discuss personal concerns with a qualified health professional.\n\n[Watch the film](${url(e)}) · [All films and essays](${record.url})\n\n${e.essay}\n\n---\n\nAI-assisted adaptation of supplied research; not independently clinically reviewed. Original essay text: CC0 1.0. Published 7 November 2026.\n`);
  }
}

module.exports = { build, routes };
