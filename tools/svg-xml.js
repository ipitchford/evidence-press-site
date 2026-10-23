'use strict';
/* Shared SVG/XML helpers for the release-art generators.
 *
 * Browsers decode an <img src="….svg"> with a strict XML parser: one raw "<"
 * or bare "&" in a <desc> or attribute and the whole image silently fails to
 * render. The renewal-quantum-resetting-equilibration and
 * weniger-delta-nonreal-poles banners (22–23 Oct 2026) both shipped exactly
 * that defect. Every generated text node and attribute value therefore goes
 * through escapeText / escapeAttr, and tools/check-svg-wellformed.js refuses
 * any committed or built SVG that wellFormedErrors() rejects.
 *
 * wellFormedErrors() is a deliberately small, dependency-free checker for
 * XML 1.0 well-formedness plus Namespaces in XML 1.0 (bound prefixes,
 * qualified-name syntax, reserved bindings, duplicate expanded attribute
 * names), which browsers also enforce for SVG. No DTD validation and no
 * external entities. xmllint --noout exits 0 on namespace errors, so the
 * namespace rules are tested against a browser's DOMParser instead.
 */

const escapeText = value => String(value == null ? '' : value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = value => escapeText(value).replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/* Make a role="img" aria-hidden banner accessible: label it by an escaped <desc>. */
function withDescription(svg, description) {
  return svg.replace('role="img" aria-hidden="true"', 'role="img" aria-labelledby="art-description"')
    .replace('<defs>', `<desc id="art-description">${escapeText(description)}</desc><defs>`);
}

/* The labelled 1200×400 release banner: palette gradient, one accent glow, an
   escaped accessible <desc>, then the caller's drawing. glow = {color, cx, cy,
   r, opacity}; numbers are written exactly as given. */
function bannerSvg({ inner, description, background, glow }) {
  const W = 1200, H = 400, [c0, c1] = background.colors;
  const a = escapeAttr;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-banner-palette="${a(background.name)}" role="img" aria-labelledby="art-description">
<desc id="art-description">${escapeText(description)}</desc><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${a(c0)}"/><stop offset="1" stop-color="${a(c1)}"/>
</linearGradient>
<radialGradient id="glow" cx="${a(glow.cx)}" cy="${a(glow.cy)}" r="${a(glow.r)}">
<stop offset="0" stop-color="${a(glow.color)}" stop-opacity="${a(glow.opacity)}"/><stop offset="1" stop-color="${a(glow.color)}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${inner}
</svg>`;
}

const PREDEFINED = new Set(['amp', 'lt', 'gt', 'quot', 'apos']);
const NAME = /^[A-Za-z_:\u00C0-\uFFFF][A-Za-z0-9_:.\-\u00B7\u00C0-\uFFFF]*/;
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
const XMLNS_NS = 'http://www.w3.org/2000/xmlns/';
const decodeRefs = v => v.replace(/&(#x[0-9A-Fa-f]+|#[0-9]+|amp|lt|gt|quot|apos);/g, (_, r) =>
  r[0] === '#' ? String.fromCodePoint(r[1] === 'x' ? parseInt(r.slice(2), 16) : parseInt(r.slice(1), 10))
    : { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[r]);
const isXmlChar = c => c === 0x9 || c === 0xA || c === 0xD || (c >= 0x20 && c <= 0xD7FF) ||
  (c >= 0xE000 && c <= 0xFFFD) || (c >= 0x10000 && c <= 0x10FFFF);

/* options.root: required expanded name of the root element, as 'namespace|local'. */
function wellFormedErrors(xml, options = {}) {
  const errors = [];
  const src = String(xml).replace(/^\uFEFF/, '');
  const lineOf = i => src.slice(0, i).split('\n').length;
  const fail = (i, msg) => { errors.push(`line ${lineOf(i)}: ${msg}`); };
  const declared = new Set();

  for (let i = 0; i < src.length; i++) {
    const c = src.codePointAt(i);
    if (c > 0xFFFF) i++;
    if (!isXmlChar(c)) { fail(i, `character U+${c.toString(16).toUpperCase()} is not allowed in XML`); break; }
  }
  if (errors.length) return errors;

  // Character data and attribute values: "&" must start a valid reference.
  const checkRefs = (text, at, where) => {
    const re = /&([^;&<\s]*);?/g;
    let m;
    while ((m = re.exec(text))) {
      const body = m[1];
      if (!m[0].endsWith(';')) { fail(at + m.index, `bare "&" in ${where} (write &amp;)`); continue; }
      if (/^#x[0-9A-Fa-f]+$/.test(body) || /^#[0-9]+$/.test(body)) {
        const n = body[1] === 'x' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
        if (!isXmlChar(n)) fail(at + m.index, `character reference &${body}; is not an XML character`);
      } else if (!(NAME.test(body) && NAME.exec(body)[0] === body)) {
        fail(at + m.index, `malformed reference "&${body};" in ${where}`);
      } else if (!PREDEFINED.has(body) && !declared.has(body)) {
        fail(at + m.index, `undeclared entity &${body}; in ${where}`);
      }
    }
  };

  // Namespaces in XML 1.0: returns the in-scope prefix map for this element.
  const checkNamespaces = (name, attrs, at, parent) => {
    const scope = new Map(parent || [['xml', XML_NS]]);
    const qname = (q, where) => {
      const parts = q.split(':');
      if (parts.length > 2 || parts.some(p => !p)) { fail(at, `${where} "${q}" is not a valid qualified name`); return null; }
      return parts.length === 2 ? parts : [null, q];
    };
    for (const { attr, value } of attrs) {
      const uri = decodeRefs(value);
      if (attr === 'xmlns') {
        if (uri === XML_NS || uri === XMLNS_NS) fail(at, `<${name}>: the default namespace may not be ${uri}`);
        else scope.set('', uri);
      } else if (attr.startsWith('xmlns:')) {
        const parts = qname(attr, `<${name}>: attribute`);
        if (!parts) continue;
        const prefix = parts[1];
        if (prefix === 'xmlns') fail(at, `<${name}>: the xmlns prefix may not be declared`);
        else if (prefix === 'xml' ? uri !== XML_NS : uri === XML_NS || uri === XMLNS_NS) fail(at, `<${name}>: xmlns:${prefix} has a reserved binding`);
        else if (!uri) fail(at, `<${name}>: xmlns:${prefix}="" cannot undeclare a prefix in XML 1.0`);
        else scope.set(prefix, uri);
      }
    }
    const resolve = (q, where, element = false) => {
      const parts = qname(q, where);
      if (!parts) return null;
      if (!parts[0]) return `${element ? scope.get('') || '' : ''}|${parts[1]}`;
      if (!scope.has(parts[0])) { fail(at, `${where} "${q}" uses undeclared namespace prefix "${parts[0]}"`); return null; }
      return `${scope.get(parts[0])}|${parts[1]}`;
    };
    const elementName = resolve(name, 'element', true);
    if (!parent && options.root && elementName && elementName !== options.root)
      fail(at, `root element is {${elementName.replace('|', '}')}, expected {${options.root.replace('|', '}')}`);
    const expanded = new Map();
    for (const { attr } of attrs) {
      if (attr === 'xmlns' || attr.startsWith('xmlns:')) continue;
      const key = resolve(attr, `<${name}>: attribute`);
      if (!key) continue;
      if (expanded.has(key)) fail(at, `<${name}>: attributes ${expanded.get(key)} and ${attr} have the same expanded name`);
      expanded.set(key, attr);
    }
    return scope;
  };

  const stack = [];
  let roots = 0, seenDoctype = false, i = 0;
  if (src.startsWith('<?xml')) {
    const end = src.indexOf('?>');
    if (end < 0) return [`line 1: unterminated XML declaration`];
    if (!/^<\?xml(\s+[A-Za-z]+\s*=\s*("[^"]*"|'[^']*'))+\s*\?>$/.test(src.slice(0, end + 2))) fail(0, 'malformed XML declaration');
    i = end + 2;
  }
  while (i < src.length && errors.length < 20) {
    const lt = src.indexOf('<', i);
    const text = src.slice(i, lt < 0 ? src.length : lt);
    if (text) {
      if (!stack.length && /\S/.test(text)) fail(i, 'text outside the root element');
      if (text.includes(']]>')) fail(i + text.indexOf(']]>'), '"]]>" in character data');
      checkRefs(text, i, 'text');
    }
    if (lt < 0) break;
    i = lt;
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end < 0) { fail(i, 'unterminated comment'); break; }
      if (src.slice(i + 4, end).includes('--') || src[end - 1] === '-') fail(i, '"--" inside comment');
      i = end + 3;
    } else if (src.startsWith('<![CDATA[', i)) {
      if (!stack.length) fail(i, 'CDATA section outside the root element');
      const end = src.indexOf(']]>', i + 9);
      if (end < 0) { fail(i, 'unterminated CDATA section'); break; }
      i = end + 3;
    } else if (src.startsWith('<!DOCTYPE', i)) {
      if (seenDoctype || roots || stack.length) fail(i, 'misplaced DOCTYPE');
      seenDoctype = true;
      let j = i + 9, depth = 0, quote = null;
      for (; j < src.length; j++) {
        const ch = src[j];
        if (quote) { if (ch === quote) quote = null; }
        else if (ch === '"' || ch === "'") quote = ch;
        else if (ch === '[') depth++;
        else if (ch === ']') depth--;
        else if (ch === '>' && depth === 0) break;
      }
      if (j >= src.length) { fail(i, 'unterminated DOCTYPE'); break; }
      for (const m of src.slice(i, j).matchAll(/<!ENTITY\s+([^\s%]+)\s/g)) declared.add(m[1]);
      i = j + 1;
    } else if (src.startsWith('<?', i)) {
      const end = src.indexOf('?>', i + 2);
      if (end < 0) { fail(i, 'unterminated processing instruction'); break; }
      const target = (NAME.exec(src.slice(i + 2)) || [''])[0];
      if (!target || /^xml$/i.test(target)) fail(i, 'invalid processing instruction target');
      i = end + 2;
    } else if (src.startsWith('</', i)) {
      const name = (NAME.exec(src.slice(i + 2)) || [''])[0];
      const close = /^\s*>/.exec(src.slice(i + 2 + name.length));
      if (!name || !close) { fail(i, 'malformed end tag'); break; }
      const open = stack.pop();
      if (!open || open.name !== name) { fail(i, open ? `</${name}> closes <${open.name}>` : `stray </${name}>`); break; }
      i += 2 + name.length + close[0].length;
    } else {
      const name = (NAME.exec(src.slice(i + 1)) || [''])[0];
      if (!name) { fail(i, 'raw "<" that does not start a tag (write &lt;)'); break; }
      if (!stack.length) { roots++; if (roots > 1) fail(i, 'more than one root element'); }
      let j = i + 1 + name.length;
      const seen = new Set(), attrs = [];
      let selfClosing = false, ok = false;
      while (j < src.length) {
        const ws = /^\s*/.exec(src.slice(j))[0];
        j += ws.length;
        if (src[j] === '>') { j++; ok = true; break; }
        if (src.startsWith('/>', j)) { j += 2; ok = selfClosing = true; break; }
        if (!ws) { fail(j, `<${name}>: attributes must be separated by whitespace`); break; }
        const attr = (NAME.exec(src.slice(j)) || [''])[0];
        if (!attr) { fail(j, `<${name}>: malformed attribute`); break; }
        if (seen.has(attr)) fail(j, `<${name}>: duplicate attribute ${attr}`);
        seen.add(attr);
        j += attr.length;
        const eq = /^\s*=\s*/.exec(src.slice(j));
        if (!eq) { fail(j, `<${name}>: attribute ${attr} has no value`); break; }
        j += eq[0].length;
        const q = src[j];
        if (q !== '"' && q !== "'") { fail(j, `<${name}>: attribute ${attr} value is unquoted`); break; }
        const end = src.indexOf(q, j + 1);
        if (end < 0) { fail(j, `<${name}>: unterminated attribute ${attr}`); break; }
        const value = src.slice(j + 1, end);
        if (value.includes('<')) fail(j, `<${name}>: raw "<" in attribute ${attr} (write &lt;)`);
        checkRefs(value, j + 1, `attribute ${attr}`);
        attrs.push({ attr, value, at: j });
        j = end + 1;
      }
      if (!ok) {
        if (!errors.length) fail(i, `unterminated <${name}> tag`);
        errors[errors.length - 1] += ' (if this "<" is meant as text, write &lt;)';
        break;
      }
      const scope = checkNamespaces(name, attrs, i, stack.length ? stack[stack.length - 1].scope : null);
      if (!selfClosing) stack.push({ name, scope });
      i = j;
    }
  }
  if (!errors.length && stack.length) fail(src.length, `unclosed <${stack[stack.length - 1].name}>`);
  if (!errors.length && !roots) fail(0, 'no root element');
  return errors;
}

module.exports = { escapeText, escapeAttr, withDescription, bannerSvg, wellFormedErrors };
