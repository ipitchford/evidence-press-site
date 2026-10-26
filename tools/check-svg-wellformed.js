#!/usr/bin/env node
/* Refuses any SVG that is not well-formed XML.
 *
 *   node tools/check-svg-wellformed.js            # every source SVG (release art, banners, figures)
 *   node tools/check-svg-wellformed.js --built    # every SVG in dist/
 *   node tools/check-svg-wellformed.js FILE...    # just these files
 *
 * A browser shows nothing at all for an <img> whose SVG fails to parse (or
 * whose root is not an SVG-namespace <svg>), so a single unescaped "<" in a
 * banner's <desc> blanks the release page's art.
 * See tools/svg-xml.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { wellFormedErrors } = require('./svg-xml');

const ROOT = path.join(__dirname, '..');
// An <img> renders nothing unless the root is <svg> in the SVG namespace.
const SVG_ROOT = 'http://www.w3.org/2000/svg|svg';
const SKIP = new Set(['.git', 'node_modules', 'dist', 'test-results', 'playwright-report']);

function walk(dir, skip, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, skip, out);
    else if (entry.isFile() && /\.svg$/i.test(entry.name)) out.push(file);
  }
  return out;
}

const args = process.argv.slice(2);
let files;
if (args.includes('--built')) {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) { console.error('dist/ does not exist; build the site first.'); process.exit(1); }
  files = walk(dist, new Set());
} else if (args.length) {
  files = args.map(f => path.resolve(f));
} else {
  files = walk(ROOT, SKIP);
}
files.sort();

let bad = 0;
for (const file of files) {
  const errors = wellFormedErrors(fs.readFileSync(file, 'utf8'), { root: SVG_ROOT });
  if (errors.length) {
    bad++;
    console.error(`${path.relative(ROOT, file)}: not well-formed XML`);
    for (const e of errors.slice(0, 5)) console.error(`  ${e}`);
  }
}
if (!files.length) { console.error('No SVG files found.'); process.exit(1); }
if (bad) {
  console.error(`${bad} of ${files.length} SVG files are not well-formed; browsers will refuse to render them. ` +
    'Escape &, < and > in generated text and attributes (tools/svg-xml.js).');
  process.exit(1);
}
console.log(`SVG well-formedness: ${files.length} file${files.length === 1 ? "" : "s"} parse${files.length === 1 ? "s" : ""} as XML.`);
