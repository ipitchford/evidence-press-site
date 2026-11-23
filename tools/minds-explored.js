/* The learning atlases supply reviewed static files to the dependency-free host
 * build. Each edition has its own inventory, canonical URL and storage scope. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const editions = new Map([
  ['minds-explored', 'Minds Explored'],
  ['science-explored', 'Science Explored']
]);

function read(root, edition = 'minds-explored') {
  const brand = editions.get(edition);
  if (!brand) throw new Error('Unknown learning atlas: ' + edition);
  const dir = path.join(root, 'pages', edition);
  const input = path.join(dir, 'site');
  const m = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  if (m.brand !== brand || m.baseUrl !== 'https://evidencepress.org/' + edition + '/' || m.apiMetadataRefreshDeadline !== null)
    throw new Error(brand + ' publication boundary changed');

  const actual = [];
  function walk(folder, prefix = '') {
    for (const file of fs.readdirSync(folder, { withFileTypes: true })) {
      const rel = prefix + file.name;
      if (file.isDirectory()) walk(path.join(folder, file.name), rel + '/');
      else if (file.isFile()) actual.push(rel);
      else throw new Error(brand + ' unexpected file type: ' + rel);
    }
  }
  walk(input);
  const expected = m.files.map(file => file.path).sort();
  actual.sort();
  if (actual.length !== expected.length || actual.some((file, i) => file !== expected[i]))
    throw new Error(brand + ' file inventory differs');

  for (const file of m.files) {
    const bytes = fs.readFileSync(path.join(input, file.path));
    if (bytes.length !== file.bytes || crypto.createHash('sha256').update(bytes).digest('hex') !== file.sha256)
      throw new Error(brand + ' hash differs: ' + file.path);
  }
  return { dir, m };
}

function build(root, dist, edition = 'minds-explored') {
  const { dir } = read(root, edition);
  fs.cpSync(path.join(dir, 'site'), path.join(dist, edition), { recursive: true });
}

function routes(root, edition = 'minds-explored') {
  const { dir } = read(root, edition);
  const sitemap = fs.readFileSync(path.join(dir, 'site/sitemap.xml'), 'utf8');
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => ({ loc: match[1] }));
}

module.exports = { read, build, routes };
