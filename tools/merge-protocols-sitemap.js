#!/usr/bin/env node
'use strict';
/*
 * merge-protocols-sitemap.js — fold the Productivity Protocols page URLs into the
 * MAIN sitemap.xml. The protocols subsystem is built by its own builder
 * (protocols/build-protocols.js) and ships its own sitemap at
 * dist/protocols/sitemap.xml; this step copies those page <loc>s into the main
 * dist/sitemap.xml so crawlers using /sitemap.xml (the one in robots.txt) discover
 * the protocol pages directly.
 *
 * Run AFTER build.js and after mounting protocols into dist/protocols (i.e. in
 * integrate.sh, before deploy). Idempotent: URLs already present are skipped.
 * Deterministic given the same inputs. No dependencies.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const mainPath = path.join(ROOT, 'dist', 'sitemap.xml');
const protoPath = path.join(ROOT, 'dist', 'protocols', 'sitemap.xml');

if (!fs.existsSync(mainPath)) { console.error('merge-protocols-sitemap: no dist/sitemap.xml — run build.js first'); process.exit(1); }
if (!fs.existsSync(protoPath)) { console.error('merge-protocols-sitemap: no dist/protocols/sitemap.xml — build + mount protocols first'); process.exit(1); }

const locs = text => [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
let main = fs.readFileSync(mainPath, 'utf8');
const protoLocs = locs(fs.readFileSync(protoPath, 'utf8'));
const present = new Set(locs(main));

// Match the main site's <lastmod> convention: use the build's commit date.
let lastmod = '';
try { const b = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist', 'api', 'build.json'), 'utf8')); if (b.sourceDate) lastmod = String(b.sourceDate).slice(0, 10); } catch { /* omit */ }

const toAdd = protoLocs.filter(u => !present.has(u));
if (!toAdd.length) { console.log('merge-protocols-sitemap: 0 added (all present).'); process.exit(0); }

const entries = toAdd.map(u => `  <url><loc>${u}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`).join('\n');
main = main.replace('</urlset>', `${entries}\n</urlset>`);
fs.writeFileSync(mainPath, main);
console.log(`merge-protocols-sitemap: added ${toAdd.length} /protocols/ URL(s) to dist/sitemap.xml (now ${present.size + toAdd.length} total).`);
