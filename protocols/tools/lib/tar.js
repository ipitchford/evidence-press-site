'use strict';
/*
 * A minimal, deterministic POSIX ustar writer. Dependency-free. Produces
 * byte-identical archives given the same inputs (fixed uid/gid/mode, caller-
 * supplied mtime, sorted entries), so a downloadable pack has a stable SHA-256 a
 * third party can verify. Apache-2.0.
 *
 * build(entries, mtime) where entries = [{ name, data: Buffer }] (name < 100
 * bytes). Returns a Buffer.
 */

function octal(n, len) {
  // len includes the trailing NUL; produce (len-1) octal digits then NUL.
  return n.toString(8).padStart(len - 1, '0') + '\0';
}

function header(name, size, mtime) {
  const h = Buffer.alloc(512, 0);
  h.write(name, 0, 100, 'utf8');
  h.write(octal(0o644, 8), 100, 8, 'ascii');   // mode
  h.write(octal(0, 8), 108, 8, 'ascii');        // uid
  h.write(octal(0, 8), 116, 8, 'ascii');        // gid
  h.write(octal(size, 12), 124, 12, 'ascii');   // size
  h.write(octal(mtime, 12), 136, 12, 'ascii');  // mtime
  h.write('        ', 148, 8, 'ascii');         // chksum placeholder (spaces)
  h.write('0', 156, 1, 'ascii');                // typeflag: normal file
  h.write('ustar\0', 257, 6, 'ascii');          // magic
  h.write('00', 263, 2, 'ascii');               // version
  // checksum: sum of all header bytes with the checksum field as spaces
  let sum = 0;
  for (let i = 0; i < 512; i++) sum += h[i];
  h.write(sum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'ascii');
  return h;
}

function build(entries, mtime) {
  mtime = mtime || 0;
  const parts = [];
  for (const e of entries.slice().sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const data = Buffer.isBuffer(e.data) ? e.data : Buffer.from(e.data);
    parts.push(header(e.name, data.length, mtime));
    parts.push(data);
    const pad = (512 - (data.length % 512)) % 512;
    if (pad) parts.push(Buffer.alloc(pad, 0));
  }
  parts.push(Buffer.alloc(1024, 0)); // two zero blocks terminate the archive
  return Buffer.concat(parts);
}

module.exports = { build };
