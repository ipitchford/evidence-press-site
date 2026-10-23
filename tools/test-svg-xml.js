'use strict';
/* SVG escaping and well-formedness: unit tests and hostile controls.
 * The 22–23 Oct 2026 renewal and weniger banners shipped a raw "<" in <desc>
 * and browsers refused to render them; every case below fails without the
 * escaping in tools/svg-xml.js or without the checker. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const { escapeText, escapeAttr, withDescription, bannerSvg, wellFormedErrors } = require('./svg-xml');
const ROOT = path.join(__dirname, '..');
const ok = (svg, why) => assert.deepEqual(wellFormedErrors(svg), [], why);
const bad = (svg, pattern, why) => {
  const errors = wellFormedErrors(svg);
  assert.ok(errors.length, `${why}: should be rejected`);
  if (pattern) assert.match(errors.join('\n'), pattern, why);
};
const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'").replace(/&amp;/g, '&');

// 1. Escaping.
assert.equal(escapeText('a < b && c > d'), 'a &lt; b &amp;&amp; c &gt; d');
assert.equal(escapeText('&lt;'), '&amp;lt;', 'escaping is not idempotent: pass raw text, never pre-escaped');
assert.equal(escapeText(null), '');
assert.equal(escapeAttr(`"<'&>"`), '&quot;&lt;&apos;&amp;&gt;&quot;');
assert.equal(escapeText('h_j^2 ≤ 4 h_{j-1} h_{j+1} · δ₁ + e⁻ᵗ'), 'h_j^2 ≤ 4 h_{j-1} h_{j+1} · δ₁ + e⁻ᵗ', 'non-ASCII passes through');

// 2. The shared art helpers escape &, < and > in every text node and attribute.
const hostile = `p<2 & p>1; h_j^2 < 4 h_{j-1} h_{j+1}; "quoted" 'single' &nbsp; ]]> <desc>`;
const plain = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" role="img" aria-hidden="true">\n<defs></defs>\n<rect width="1" height="1"/>\n</svg>';
const described = withDescription(plain, hostile);
ok(described, 'withDescription output parses');
assert.ok(described.includes('aria-labelledby="art-description"') && !described.includes('aria-hidden'));
assert.equal(decode(/<desc id="art-description">([^<]*)<\/desc>/.exec(described)[1]), hostile, 'description round-trips');

const banner = bannerSvg({
  inner: '<circle cx="1" cy="1" r="1"/>',
  description: hostile,
  background: { name: `odd"<&>'name`, colors: ['#000"&', '<#111>'] },
  glow: { color: `a"<b>&'`, cx: '0.2', cy: '0.62', r: '0.45', opacity: '0.08' }
});
ok(banner, 'bannerSvg output parses with hostile description, palette name and colours');
assert.equal(decode(/<desc id="art-description">([^<]*)<\/desc>/.exec(banner)[1]), hostile);
assert.equal(decode(/data-banner-palette="([^"]*)"/.exec(banner)[1]), `odd"<&>'name`);
for (const m of banner.matchAll(/\s[\w:-]+="([^"]*)"/g)) assert.ok(!/[<>"]/.test(m[1]) && !/&(?!(amp|lt|gt|quot|apos);)/.test(m[1]), `attribute escaped: ${m[0]}`);
assert.ok(banner.endsWith('<circle cx="1" cy="1" r="1"/>\n</svg>'), 'drawing is inserted verbatim');

// 3. Every banner generator that uses the shared frame still reproduces its committed asset.
for (const [module, slug] of [['weniger-delta-art', 'weniger-delta-nonreal-poles'], ['renewal-resetting-art', 'renewal-quantum-resetting-equilibration'],
  ['stenger-art', 'logarithmic-stenger-matrix-stability']]) {
  const spec = require('./' + module);
  const committed = fs.readFileSync(path.join(ROOT, 'assets/art', slug + '.svg'), 'utf8');
  ok(committed, `${slug}: committed banner parses`);
  assert.ok(committed.includes(`<desc id="art-description">${escapeText(spec.description)}</desc>`), `${slug}: escaped accessible description`);
  assert.ok(committed.includes(spec.draw()), `${slug}: regenerate the committed banner`);
}

// 4. No generator interpolates unescaped text straight into <desc> or <title>.
for (const file of fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && !f.startsWith('test-'))) {
  const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
  for (const m of src.matchAll(/<(desc|title)\b[^>]*>\$\{([^}]*)\}/g))
    assert.match(m[2], /^(esc|escapeText|escapeHtml)\(/, `${file}: <${m[1]}> interpolates \${${m[2]}} without escaping`);
}

// 5. Checker hostile controls: the defect class that blanked the two banners, and its relatives.
const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" role="img"><desc id="d">${body}</desc><rect width="1" height="1"/></svg>`;
ok(wrap('plain text'), 'plain');
ok(wrap('a &lt; b &amp; c &gt; d &quot;q&quot; &apos;s&apos; &#38; &#x3C; &#8212;'), 'predefined and numeric references');
ok(wrap('a > b'), 'raw ">" is legal character data');
ok(wrap('<![CDATA[a < b & c]]>'), 'CDATA');
ok(`<?xml version="1.0" encoding="UTF-8"?>\n<!-- comment -->\n${wrap('x')}\n`, 'declaration, comment, trailing newline');
ok(`<!DOCTYPE svg [<!ENTITY ep "Evidence Press">]>${wrap('&ep;')}`, 'internally declared entity');
bad(wrap('n + beta is at most (sqrt(33) - 5)/2 when h_j^2 < 4 h_{j-1} h_{j+1}'), /raw "<"/, 'weniger-delta defect: raw "<" in desc');
bad(wrap('the band m > 1 is unstable; for 1<p<p* the bound'), /write &lt;/, 'renewal defect: raw "<" and ">" in desc');
bad(wrap('Q&A'), /bare "&"/, 'bare ampersand');
bad(wrap('&nbsp;'), /undeclared entity/, 'HTML-only entity');
bad(wrap('&#1;'), /not an XML character/, 'illegal character reference');
bad(wrap('a ]]> b'), /\]\]>/, '"]]>" in text');
bad(wrap('a \u0001 b'), /not allowed/, 'control character');
bad(wrap('<!-- a -- b -->'), /--/, 'double hyphen in comment');
bad('<svg><text x="a<b">t</text></svg>', /raw "<" in attribute/, 'raw "<" in attribute');
bad('<svg><text x="a&b">t</text></svg>', /bare "&"/, 'bare "&" in attribute');
bad('<svg><text x=1>t</text></svg>', /unquoted/, 'unquoted attribute');
bad('<svg><rect x="1" x="2"/></svg>', /duplicate attribute/, 'duplicate attribute');
bad('<svg><rect x="1"y="2"/></svg>', /whitespace/, 'attributes run together');
bad('<svg><g></svg>', /closes <g>/, 'mismatched end tag');
bad('<svg><g>', /unclosed/, 'unclosed element');
bad('<svg/><svg/>', /more than one root/, 'two roots');
bad('text<svg/>', /outside the root/, 'text before root');
bad('', /no root/, 'empty file');
bad('<svg><text>a</text', /malformed end tag/, 'truncated file');

// 6. The checker agrees with libxml2 where it is installed (not required in CI).
const lint = cp.spawnSync('xmllint', ['--version'], { encoding: 'utf8' });
if (lint.status === 0) {
  const cases = [wrap('a < b'), wrap('a & b'), wrap('a > b'), wrap('&nbsp;'), wrap('&amp;'), banner, described,
    '<svg><rect x="1" x="2"/></svg>', '<svg><g></svg>', '<svg/><svg/>', wrap('<![CDATA[<&>]]>')];
  for (const svg of cases) {
    const libxml = cp.spawnSync('xmllint', ['--noout', '-'], { input: svg }).status === 0;
    assert.equal(wellFormedErrors(svg).length === 0, libxml, `disagrees with xmllint on ${JSON.stringify(svg.slice(0, 80))}`);
  }
  console.log(`SVG XML: ${cases.length} cases agree with xmllint.`);
}
console.log('SVG XML: escaping helpers, shared banner frame and well-formedness checker passed.');
