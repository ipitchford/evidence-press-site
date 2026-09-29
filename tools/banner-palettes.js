'use strict';
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '../data/BANNER_PALETTES.json');
// Backgrounds only: foreground colours can carry mathematical meaning.
const palettes = {
  indigo: ['#151a36', '#303d68'],
  oxblood: ['#301720', '#61313d'],
  petrol: ['#102b30', '#245057'],
  bronze: ['#302319', '#58442b'],
  plum: ['#291b35', '#51375e'],
  slate: ['#182b3a', '#365368']
};
function assign(registry, slug) {
  const existing = registry.assignments.find(x => x.slug === slug);
  if (existing) return existing.palette;
  const names = Object.keys(palettes);
  const last = registry.assignments.at(-1);
  const palette = names[(names.indexOf(last?.palette) + 1) % names.length];
  registry.assignments.push({ slug, palette });
  return palette;
}
function resolve(slug) {
  const registry = JSON.parse(fs.readFileSync(file, 'utf8'));
  const saved = registry.assignments.find(x => x.slug === slug);
  if (saved) return { name: saved.palette, colors: palettes[saved.palette] };
  // Historical unchanged art keeps its original palette. New art must rotate.
  if (registry.legacySlugs.includes(slug)) return null;
  const name = assign(registry, slug);
  fs.writeFileSync(file, JSON.stringify(registry, null, 2) + '\n');
  return { name, colors: palettes[name] };
}
function validate(registry, slugs, readSvg) {
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.legacySlugs) || !Array.isArray(registry.assignments))
    throw new Error('Invalid banner registry');
  const seen = new Set();
  for (const row of registry.assignments) {
    if (seen.has(row.slug) || !palettes[row.palette] || !slugs.includes(row.slug))
      throw new Error('Invalid or duplicate banner palette: ' + row.slug);
    seen.add(row.slug);
    const svg = readSvg(row.slug);
    const solidBackground = /<rect\b(?=[^>]*\bwidth="1200")(?=[^>]*\bheight="400")(?=[^>]*\bfill="#)[^>]*>/;
    if (solidBackground.test(svg)) throw new Error('Bespoke art hides shared palette: ' + row.slug);
    if (!svg.includes('data-banner-palette="' + row.palette + '"') ||
        !palettes[row.palette].every(c => svg.includes('stop-color="' + c + '"')))
      throw new Error('Regenerate registered banner: ' + row.slug);
  }
  for (let i = 1; i < registry.assignments.length; i++) {
    if (registry.assignments[i].palette === registry.assignments[i - 1].palette)
      throw new Error('Consecutive banner assignments must vary');
  }
  for (const slug of slugs) {
    if (!seen.has(slug) && !registry.legacySlugs.includes(slug))
      throw new Error('New banner needs a saved rotated palette: ' + slug);
  }
}
function check(root = path.join(__dirname, '..')) {
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/BANNER_PALETTES.json')));
  const slugs = fs.readdirSync(path.join(root, 'papers')).filter(s => fs.existsSync(path.join(root, 'papers', s, 'meta.json')));
  validate(registry, slugs, s => fs.readFileSync(path.join(root, 'assets/art', s + '.svg'), 'utf8'));
}
module.exports = { palettes, assign, resolve, validate, check };
