#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {buildIndex, makePacket, compareIndexes, validateIndex} = require('./atlas-memory');
function main(argv) {
  const command = argv.shift(), options = {};
  const allowed = {index: ['root', 'out'], query: ['index', 'request', 'root', 'out'], delta: ['old', 'new', 'out']}[command];
  if (!allowed) throw Error('Usage: atlas-agent.js index --root DIR | query --index FILE --request FILE [--root DIR] | delta --old FILE --new FILE; optional --out NEW_FILE');
  while (argv.length) {
    const flag = argv.shift();
    if (!flag.startsWith('--') || !allowed.includes(flag.slice(2)) || Object.hasOwn(options, flag.slice(2)) || !argv.length || argv[0].startsWith('--')) throw Error('Unknown, duplicate or missing option: ' + flag);
    options[flag.slice(2)] = argv.shift();
  }
  const read = key => { if (!options[key]) throw Error('--' + key + ' required'); return JSON.parse(fs.readFileSync(options[key], 'utf8')); };
  let result;
  if (command === 'index') result = buildIndex(path.resolve(options.root || path.join(__dirname, '..')));
  if (command === 'query') {
    const index = read('index');
    const errors = validateIndex(index, options.root && path.resolve(options.root));
    if (errors.length) throw Error(errors.join('\n'));
    result = makePacket(index, read('request'));
  }
  if (command === 'delta') result = compareIndexes(read('old'), read('new'));
  const text = JSON.stringify(result, null, 2) + '\n';
  if (options.out) fs.writeFileSync(options.out, text, {flag: 'wx'});
  else process.stdout.write(text);
}
if (require.main === module) try { main(process.argv.slice(2)); } catch (e) { console.error('atlas-agent: ' + e.message); process.exitCode = 1; }
module.exports = {main};
