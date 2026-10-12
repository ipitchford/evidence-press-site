'use strict';
const fs = require('fs');
const path = require('path');
const rotation = ['pine', 'oxblood', 'cobalt', 'aubergine', 'bronze', 'lagoon'];
const file = path.join(__dirname, '../data/THUMBNAIL_PALETTES.json');
function load() {
  const registry = JSON.parse(fs.readFileSync(file, 'utf8'));
  const seen = new Set();
  for (const row of registry.assignments) {
    if (seen.has(row.slug) || !rotation.includes(row.palette)) throw new Error('Invalid thumbnail palette: ' + row.slug);
    seen.add(row.slug);
  }
  const recent = registry.assignments.filter(row => !row.legacy);
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].palette !== rotation[(rotation.indexOf(recent[i - 1].palette) + 1) % rotation.length])
      throw new Error('Thumbnail palette rotation broken: ' + recent[i].slug);
  }
  return registry;
}
function resolve(slug, allocate = false) {
  const registry = load();
  const saved = registry.assignments.find(row => row.slug === slug);
  if (saved) return saved.palette;
  if (!allocate) throw new Error('Generate thumbnail to allocate a saved palette: ' + slug);
  const last = registry.assignments.at(-1);
  const palette = rotation[(rotation.indexOf(last?.palette) + 1) % rotation.length];
  registry.assignments.push({slug, palette});
  fs.writeFileSync(file, JSON.stringify(registry, null, 2) + '\n');
  return palette;
}
module.exports = {resolve, load, rotation};
