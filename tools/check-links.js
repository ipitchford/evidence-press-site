#!/usr/bin/env node
'use strict';
/*
 * Internal link and asset checker for the built site.
 *
 * Walks every HTML file in dist/ and verifies that each same-site href, src,
 * and fragment target actually resolves. External links are listed but not
 * fetched: a build gate that depends on the reachability of other people's
 * servers fails for reasons that have nothing to do with the build.
 *
 * Run after `node build.js`. Exit 0 = every internal reference resolves.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE = CONFIG.baseUrl.replace(/\/$/, '');

const red = s => `\x1b[31m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(red('dist/ does not exist. Run `node build.js` first.'));
  process.exit(1);
}

function htmlFiles(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, found);
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

/* Resolution follows Cloudflare Pages, which is what actually serves this site:
   a file, or a directory with an index.html, or an extensionless path served
   from "<path>.html". That last rule is not cosmetic — Pages serves /foo from
   foo.html and 308-redirects /foo.html to /foo, so writing the extension into
   a link would add a redirect hop to every visit. Verified against the
   deployed site on 2026-08-05. */
function resolves(target) {
  const clean = target.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(DIST, 'index.html'));
  const asFile = path.join(DIST, clean);
  if (fs.existsSync(asFile)) {
    return fs.statSync(asFile).isDirectory()
      ? fs.existsSync(path.join(asFile, 'index.html'))
      : true;
  }
  return fs.existsSync(path.join(DIST, clean.replace(/\/$/, '') + '.html'));
}

const pages = htmlFiles(DIST);
const broken = [];
const fragmentsMissing = [];
let internal = 0;
let external = 0;

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = '/' + path.relative(DIST, file).replace(/\\/g, '/');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let value = match[1].replace(/&amp;/g, '&').trim();
    if (!value || value.startsWith('data:') || value.startsWith('mailto:')) continue;

    /* Absolute links back to our own canonical origin are internal. */
    if (value.startsWith(BASE)) value = value.slice(BASE.length) || '/';
    else if (/^https?:/i.test(value)) { external++; continue; }

    if (value.startsWith('#')) {
      const id = decodeURIComponent(value.slice(1));
      if (id && !ids.has(id)) fragmentsMissing.push(`${rel} → ${value}`);
      continue;
    }

    /* Resolve relative references against the page's own directory. */
    const absolute = value.startsWith('/')
      ? value
      : '/' + path.posix.normalize(path.posix.join(path.posix.dirname(rel), value));

    internal++;
    if (!resolves(absolute)) broken.push(`${rel} → ${match[1]}`);
  }
}

console.log(`Checked ${pages.length} pages: ${internal} internal references, ${external} external links (not fetched).`);

if (broken.length) {
  console.error(red(`\n${broken.length} internal reference(s) do not resolve:`));
  for (const b of broken.slice(0, 40)) console.error(red('  ' + b));
}
if (fragmentsMissing.length) {
  console.error(red(`\n${fragmentsMissing.length} same-page fragment(s) have no matching id:`));
  for (const f of fragmentsMissing.slice(0, 40)) console.error(red('  ' + f));
}

if (broken.length || fragmentsMissing.length) process.exit(1);
console.log(green('OK — every internal reference resolves.'));
