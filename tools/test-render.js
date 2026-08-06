#!/usr/bin/env node
'use strict';
/*
 * Regression tests for the markdown renderer in build.js.
 *
 * Runs the REAL inline()/markdown()/esc() extracted from build.js source —
 * not copies — so drift between tests and production is impossible.
 * No dependencies. Exit 0 = pass, exit 1 = failure (prints each case).
 *
 * Origin: 2026-08-05. The previous renderer used space-delimited integers as
 * stash placeholders; restoration matched ANY space-delimited integer, so a
 * literal integer in prose could be replaced by a stashed math/code token.
 * This corrupted the main theorem statement on the live Erdős 848 release
 * ("for every $N$ from 1 upwards" rendered the 1 as a duplicated formula).
 * These tests pin the repaired behaviour.
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'build.js'), 'utf8');

function extractFunction(name) {
  const start = src.indexOf(`function ${name}(`);
  if (start === -1) throw new Error(`test harness: cannot find function ${name} in build.js`);
  let i = src.indexOf('{', start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) throw new Error(`test harness: unbalanced braces extracting ${name}`);
  return src.slice(start, i + 1);
}

function extractConst(name) {
  const start = src.indexOf(`const ${name} =`);
  if (start === -1) throw new Error(`test harness: cannot find const ${name} in build.js`);
  const closer = "'&quot;');";
  const end = src.indexOf(closer, start);
  if (end === -1) throw new Error(`test harness: cannot find end of const ${name}`);
  return src.slice(start, end + closer.length);
}

/* Single-line `const NAME = ...;` declarations. */
function extractLine(name) {
  const start = src.indexOf(`const ${name} =`);
  if (start === -1) throw new Error(`test harness: cannot find const ${name} in build.js`);
  const end = src.indexOf('\n', start);
  return src.slice(start, end);
}

const harnessSrc = [
  extractConst('esc'),
  'const escAttr = esc;',
  extractLine('ALLOWED_SCHEMES'),
  extractFunction('safeUrl'),
  extractLine('INLINE_TOKEN'),
  extractFunction('inline'),
  extractFunction('markdown'),
  'return { esc, inline, markdown, safeUrl };'
].join('\n');

const { inline, markdown, safeUrl } = new Function(harnessSrc)();

let failures = 0;
function eq(label, actual, expected) {
  if (actual === expected) {
    console.log(`ok      ${label}`);
  } else {
    failures++;
    console.log(`FAIL    ${label}`);
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  actual  : ${JSON.stringify(actual)}`);
  }
}
function contains(label, actual, needle) {
  if (actual.includes(needle)) {
    console.log(`ok      ${label}`);
  } else {
    failures++;
    console.log(`FAIL    ${label}`);
    console.log(`  missing : ${JSON.stringify(needle)}`);
    console.log(`  in      : ${JSON.stringify(actual)}`);
  }
}

function throws(label, fn, needle) {
  try {
    fn();
    failures++;
    console.log(`FAIL    ${label}`);
    console.log('  expected a thrown error, none was thrown');
  } catch (e) {
    if (String(e.message).includes(needle)) {
      console.log(`ok      ${label}`);
    } else {
      failures++;
      console.log(`FAIL    ${label}`);
      console.log(`  error did not mention ${JSON.stringify(needle)}: ${e.message}`);
    }
  }
}

/* --- 1. The exact live-corruption case (Erdős 848 release, 2026-08-05) --- */
contains('erdos-848 theorem sentence keeps its literal 1',
  inline('for every $N$ from 1 upwards, the maximum is exactly $\\lfloor (N+18)/25 \\rfloor$.'),
  'from 1 upwards');

/* --- 2. External review reproduction case --- */
eq('review repro: integer before a math token survives',
  inline('For 0 use $x$.'),
  'For 0 use $x$.');

/* --- 3. Integers adjacent to code tokens --- */
eq('integer beside inline code survives',
  inline('use 0 with `npm test` now'),
  'use 0 with <code>npm test</code> now');

/* --- 4. Many integers, many tokens, same block --- */
eq('multiple prose integers with multiple stashed tokens',
  inline('cases 0 and 1 and 2 need $a$ then `b` then $c$ done'),
  'cases 0 and 1 and 2 need $a$ then <code>b</code> then $c$ done');

/* --- 5. Punctuation and position boundaries --- */
eq('token at string start', inline('`x` leads'), '<code>x</code> leads');
eq('token at string end', inline('ends with $y$'), 'ends with $y$');
eq('token flush against punctuation', inline('pair (`k`) and $m$.'), 'pair (<code>k</code>) and $m$.');
eq('token glued between words', inline('mid`c`word'), 'mid<code>c</code>word');

/* --- 6. Emphasis wrapping stashed tokens --- */
eq('bold around math token', inline('**bold $x$ text**'), '<strong>bold $x$ text</strong>');
eq('em around code token', inline('*em `c` text*'), '<em>em <code>c</code> text</em>');

/* --- 7. Sentinel injection: raw NULs in source cannot resurrect a stash --- */
eq('NUL bytes in source are stripped, never treated as sentinels',
  inline('evil \u0000' + '0\u0000 with $real$ math'),
  'evil 0 with $real$ math');

/* --- 8. Escaping still applies inside and outside tokens --- */
eq('HTML escapes outside tokens', inline('a < b & c'), 'a &lt; b &amp; c');
eq('HTML escapes inside code tokens', inline('run `a < b` now'), 'run <code>a &lt; b</code> now');

/* --- 9. Links and images unaffected --- */
eq('link with integer and token in same block',
  inline('see [item 3](https://example.org/p) plus `x` and 4 more'),
  'see <a href="https://example.org/p" rel="noopener">item 3</a> plus <code>x</code> and 4 more');

/* --- 10. markdown(): block-level golden test --- */
const goldenSrc = [
  '## Result 1 with $x$',
  '',
  'From 1 upwards the bound is $\\lfloor n/2 \\rfloor$ with 3 cases.',
  '',
  '- item 0 uses `code`',
  '- item 1 is plain',
  '',
  '| k | value |',
  '| - | ----- |',
  '| 0 | $v$   |'
].join('\n');
const goldenExpected = [
  '<h2 id="result-1-with">Result 1 with $x$</h2>',
  '<p>From 1 upwards the bound is $\\lfloor n/2 \\rfloor$ with 3 cases.</p>',
  '<ul><li>item 0 uses <code>code</code></li><li>item 1 is plain</li></ul>',
  '<div class="table-wrap"><table><thead><tr><th>k</th><th>value</th></tr></thead><tbody>' +
    '<tr><td>0</td><td>$v$</td></tr></tbody></table></div>'
].join('\n');
eq('markdown() golden: heading, paragraph, list, table with integers + tokens',
  markdown(goldenSrc), goldenExpected);

/* --- 11. Property sweep: every space-delimited integer 0..40 survives ---- */
{
  let bad = 0;
  for (let n = 0; n <= 40; n++) {
    const out = inline(`prefix ${n} suffix with $t0$ and $t1$ and \`t2\` end`);
    if (!out.includes(` ${n} `)) bad++;
  }
  eq('property: integers 0..40 all survive beside three stashed tokens', bad, 0);
}

/* --- 12. URI scheme allowlist: dangerous schemes fail the build --- */
throws('javascript: link is rejected at build time',
  () => inline('[click](javascript:alert(1))'), 'unsupported URI scheme');
throws('data: image is rejected at build time',
  () => inline('![x](data:text/html;base64,PHNjcmlwdD4=)'), 'unsupported URI scheme');
throws('vbscript: link is rejected at build time',
  () => inline('[x](vbscript:msgbox)'), 'unsupported URI scheme');
throws('file: link is rejected at build time',
  () => inline('[x](file:///etc/passwd)'), 'unsupported URI scheme');

eq('https link still renders with rel=noopener',
  inline('[a](https://example.org/x)'),
  '<a href="https://example.org/x" rel="noopener">a</a>');
eq('mailto link is allowed',
  inline('[mail](mailto:a@example.org)'),
  '<a href="mailto:a@example.org">mail</a>');
eq('root-relative link is allowed',
  inline('[rel](/releases/x/)'),
  '<a href="/releases/x/">rel</a>');
eq('fragment link is allowed',
  inline('[frag](#section)'),
  '<a href="#section">frag</a>');

/* --- 13. Currency is not maths (Pandoc digit rule) --- */
eq('USD range is left as text, not parsed as maths',
  inline('Medium: $290k–$430k. About 2 human FTE-years, $40k compute.'),
  'Medium: $290k–$430k. About 2 human FTE-years, $40k compute.');
eq('single USD amount is left as text',
  inline('costs $75k in total'),
  'costs $75k in total');
eq('maths beginning with a digit still renders',
  inline('bound $2^n$ holds'),
  'bound $2^n$ holds');
eq('maths adjacent to currency: both survive intact',
  inline('spend $40k to verify $x + y$ today'),
  'spend $40k to verify $x + y$ today');

console.log(failures === 0
  ? '\nALL RENDERER TESTS PASSED'
  : `\n${failures} RENDERER TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
