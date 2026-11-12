'use strict';
/* Evidence Press site navigation: the one definition every builder reads.
 *
 * build.js (the main site and the InterPsych host step) and
 * protocols/build-protocols.js (/protocols/) render their header, breadcrumbs,
 * footer site map and slim cross-site bar from GROUPS, so the sections cannot
 * drift apart again. Minds Explored is a separately built application: its
 * slim bar mirrors GROUPS, and tools/test-site-nav.js checks the imported pages
 * against this file.
 *
 * Pure functions with no I/O and no clock, so the build stays byte-identical.
 * A section claims a page when the page path equals its href or starts with
 * one of its prefixes (href plus `also`); the longest prefix wins. */

const GROUPS = [
  {
    id: 'research', label: 'Research', href: '/research/', hub: true,
    standfirst: 'Research releases published with their evidence attached, the map that connects them, and the articles and policy work around them.',
    sections: [
      { label: 'Releases', title: 'All releases', href: '/', also: ['/releases/'],
        detail: 'Every research release, newest first, each with its paper, code, data and checks one click away.' },
      { label: 'Atlas', title: 'Evidence Atlas', href: '/atlas/',
        detail: 'How the releases connect: declared methods, clusters, lineages and internal citations, each with its basis and limits.' },
      { label: 'Applications', href: '/applications/',
        detail: 'A plain-English note on what each release could be used for in practice.' },
      { label: 'Articles', href: '/articles/',
        detail: 'Essays, commentary and research notes with sources and scope stated. Articles are not certificate-backed releases.' },
      { label: 'Observatory', title: 'Policy Identification Observatory', href: '/observatory/',
        detail: 'What policy evidence supports, what it does not, and which decisions remain defensible under uncertainty.' }
    ]
  },
  {
    id: 'learn', label: 'Learn', href: '/learn/', hub: true,
    standfirst: 'Open learning on mind, brain and behaviour, books of ideas and puzzles, and the archive behind the work.',
    sections: [
      { label: 'Minds Explored', href: '/minds-explored/',
        detail: 'University lectures on mind, brain and behaviour, organised into topic guides and learning paths.' },
      { label: 'Why Minds Break', href: '/why-minds-break/',
        detail: 'A book on the evolutionary and developmental roots of mental disorder, with free films and essays on common conditions.' },
      { label: 'Think Again', href: '/think-again/',
        detail: 'A book of 100 puzzles on the maths and science everyone should understand, with the sources for its facts listed puzzle by puzzle.' },
      { label: 'Thesis', title: 'Thesis and early papers', href: '/thesis/', also: ['/origins-of-violence/'],
        detail: 'The 2001 doctoral thesis on evolutionary developmental psychopathology, and a 2001 paper asking whether psychopathy is an adaptation.' },
      { label: 'InterPsych', title: 'InterPsych: a recovered history', href: '/interpsych/',
        detail: 'The history of InterPsych, founded in 1994 as one of the first international online networks for mental health professionals.' }
    ]
  },
  {
    id: 'practice', label: 'Practice', href: '/practice/', hub: true,
    standfirst: 'Methods for getting more done with AI, and ways to test whether they help on real work.',
    sections: [
      { label: 'Six habits', title: 'Productivity Protocols', href: '/productivity/',
        detail: 'Six working habits for getting more done with AI, each with a starter to copy.' },
      { label: 'Protocol library', href: '/protocols/',
        detail: 'Bounded methods for trialling AI agents on real work, each with its checks and evidence status.' },
      { label: 'Starter kit', href: '/protocols/start/',
        detail: 'One bounded first task for an organisation new to AI agents.' },
      { label: 'Case study', title: 'One person, a whole press', href: '/productivity/case-study/',
        detail: 'How one person runs Evidence Press with these habits.' },
      { label: 'Self-test', title: 'Measure the gains', href: '/productivity/measure/',
        detail: 'A two-week test of whether an AI method helps on recurring tasks, with an open results ledger.' },
      { label: 'Testing record', href: '/productivity/how-we-test/',
        detail: 'What has been measured so far, and a staged design for evaluating a method in an organisation.' }
    ]
  },
  {
    id: 'about', label: 'About', href: '/about/', hub: false,
    sections: [
      { label: 'About this site', href: '/about/' },
      { label: 'Operating model', href: '/operating-model/' },
      { label: 'Research metrics', href: '/research-metrics/' },
      { label: 'For AI agents', href: '/ai/' }
    ]
  },
  /* Shop sits beside Donate on every page: sales fund the research. The phone
     bar also carries a Shop link, so it is never hidden behind the Menu. */
  {
    id: 'shop', label: 'Shop', href: '/shop/', hub: false,
    sections: [
      { label: 'Prints and gifts', title: 'Evidence Press shop', href: '/shop/',
        detail: 'Posters, mugs and T-shirts made from the films’ pictures, the Think Again book, and partner books, puzzles and kits.' },
      { label: 'Bookshop', title: 'Minds Explored bookshop', href: '/minds-explored/shop/',
        detail: 'Annotated shelves of books on mind, brain and behaviour, led by Why Minds Break.' }
    ]
  }
];
const SHOP = GROUPS.find(g => g.id === 'shop');

const SUPPORT = { label: 'Donate', href: '/support/' };

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function normalise(pagePath) {
  let p = String(pagePath || '/').replace(/[?#].*$/, '');
  if (!p.startsWith('/')) p = '/' + p;
  return p.replace(/\/index\.html$/, '/');
}

function locate(pagePath) {
  const p = normalise(pagePath);
  let best = null;
  for (const group of GROUPS) {
    for (const section of group.sections) {
      for (const prefix of [section.href, ...(section.also || [])]) {
        const hit = p === prefix || (prefix !== '/' && p.startsWith(prefix));
        if (hit && (!best || prefix.length > best.prefix.length)) best = { group, section, prefix };
      }
    }
  }
  if (best) return { path: p, group: best.group, section: best.section };
  const group = GROUPS.find(g => g.href === p) || null;
  return { path: p, group, section: null };
}

/* aria-current: "page" for a link to this exact page, "true" for the group or
   section that contains it. CSS styles both as the current position. */
function current(href, here, inside) {
  if (href === here.path) return ' aria-current="page"';
  return inside ? ' aria-current="true"' : '';
}

function header(pagePath, { siteName = 'Evidence Press' } = {}) {
  const here = locate(pagePath);
  const groups = GROUPS.map(g =>
    `<a${g === SHOP ? ' class="shop-nav"' : ''} href="${g.href}"${current(g.href, here, here.group === g)}>${esc(g.label)}</a>`).join('');
  const menu = GROUPS.map(g => `<div class="site-menu-group"><a class="site-menu-head" href="${g.href}"${current(g.href, here, here.group === g)}>${esc(g.label)}</a><ul>${
    g.sections.map(s => `<li><a href="${s.href}"${current(s.href, here, here.section === s)}>${esc(s.label)}</a></li>`).join('')}</ul></div>`).join('');
  const sections = here.group ? `
  <nav class="site-sections" aria-label="${esc(here.group.label)} sections"><div class="wrap">${
    here.group.sections.map(s => `<a href="${s.href}"${current(s.href, here, here.section === s)}>${esc(s.label)}</a>`).join('')}</div></nav>` : '';
  return `<header class="site-head">
  <div class="wrap site-bar">
    <a class="brand" href="/"><span class="brand-mark">E</span> ${esc(siteName)}</a>
    <nav class="site-groups" aria-label="Main">${groups}</nav>
    <a class="shop-nav shop-nav-phone" href="${SHOP.href}"${current(SHOP.href, here, here.group === SHOP)}>${esc(SHOP.label)}</a>
    <a class="support-nav" href="${SUPPORT.href}"${current(SUPPORT.href, here, false)}>${esc(SUPPORT.label)}</a>
    <details class="site-menu"><summary>Menu</summary><nav class="site-menu-panel" aria-label="All sections">${menu}</nav></details>
  </div>${sections}
</header>`;
}

/* Breadcrumbs appear only below a section's own landing page; on a landing page
   the header's second row already says where the reader is. */
function breadcrumbs(pagePath, title, { siteName = 'Evidence Press' } = {}) {
  const here = locate(pagePath);
  if (!here.group || here.path === here.group.href) return '';
  if (here.section && here.path === here.section.href) return '';
  let label = String(title).replace(new RegExp(` · ${siteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '');
  if (here.section) label = label.replace(new RegExp(` · ${here.section.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '');
  const items = [`<li><a href="${here.group.href}">${esc(here.group.label)}</a></li>`];
  if (here.section && here.section.href !== here.group.href)
    items.push(`<li><a href="${here.section.href}">${esc(here.section.label)}</a></li>`);
  items.push(`<li aria-current="page">${esc(label)}</li>`);
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol class="wrap">${items.join('')}</ol></nav>`;
}

function footerMap() {
  return `<nav class="foot-map" aria-label="Site map">${GROUPS.map(g => `<div><p class="foot-map-head"><a href="${g.href}">${esc(g.label)}</a></p><ul>${
    g.sections.map(s => `<li><a href="${s.href}">${esc(s.title || s.label)}</a></li>`).join('')}</ul></div>`).join('')}</nav>`;
}

/* The slim cross-site bar for pages that keep their own design and stylesheet
   (InterPsych, Minds Explored). `origin` makes the links absolute when the
   host application rewrites root-relative paths. */
function bar(pagePath, { origin = '', siteName = 'Evidence Press' } = {}) {
  const here = locate(pagePath);
  return `<nav class="ep-bar" aria-label="${esc(siteName)}"><a class="ep-bar-brand" href="${origin}/">${esc(siteName)}</a><span class="ep-bar-groups">${
    GROUPS.map(g => `<a href="${origin}${g.href}"${here.group === g ? ' aria-current="true"' : ''}>${esc(g.label)}</a>`).join('')}</span></nav>`;
}

module.exports = { GROUPS, SUPPORT, SHOP, locate, header, breadcrumbs, footerMap, bar };
