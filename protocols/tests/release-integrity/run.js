#!/usr/bin/env node
'use strict';

/* Dependency-free mutation and localhost-readback tests for the release gate. */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const childProcess = require('child_process');
const http = require('http');

const REPO = path.resolve(__dirname, '..', '..');
const TOOL = path.join(REPO, 'tools', 'check-release-integrity.js');
const MUTATIONS = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'mutations.json'), 'utf8'));

function sha256(body) {
  return crypto.createHash('sha256').update(body).digest('hex');
}

function write(file, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
}

function writeJson(file, value) {
  write(file, JSON.stringify(value, null, 2) + '\n');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function octal(value, length) {
  return value.toString(8).padStart(length - 1, '0') + '\0';
}

function tarHeader(name, size, mtime) {
  const h = Buffer.alloc(512, 0);
  h.write(name, 0, 100, 'utf8');
  h.write(octal(0o644, 8), 100, 8, 'ascii');
  h.write(octal(0, 8), 108, 8, 'ascii');
  h.write(octal(0, 8), 116, 8, 'ascii');
  h.write(octal(size, 12), 124, 12, 'ascii');
  h.write(octal(mtime, 12), 136, 12, 'ascii');
  h.write('        ', 148, 8, 'ascii');
  h.write('0', 156, 1, 'ascii');
  h.write('ustar\0', 257, 6, 'ascii');
  h.write('00', 263, 2, 'ascii');
  let sum = 0;
  for (const byte of h) sum += byte;
  h.write(sum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'ascii');
  return h;
}

function tar(entries, mtime) {
  const parts = [];
  for (const entry of entries.slice().sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const body = Buffer.isBuffer(entry.body) ? entry.body : Buffer.from(entry.body);
    parts.push(tarHeader(entry.name, body.length, mtime), body);
    const padding = (512 - (body.length % 512)) % 512;
    if (padding) parts.push(Buffer.alloc(padding, 0));
  }
  parts.push(Buffer.alloc(1024, 0));
  return Buffer.concat(parts);
}

function fileRef(file, relative) {
  const body = fs.readFileSync(file);
  return { path: relative, sha256: sha256(body), bytes: body.length };
}

function makeFixture(root, source) {
  source = source || { commit: null, tree: null, date: null, dirty: null };
  const dist = path.join(root, 'dist');
  const id = 'alpha';
  const version = '1.0.0';
  const softwareVersion = '0.2.0-candidate.1';
  const assurance = 'EXAMPLE_CONFORMANCE_VALIDATED';
  const evidence = 'NO_IMPACT_EVIDENCE';
  const baseUrl = 'https://productivity-protocols.invalid';
  const basePath = '';
  const archiveRel = `downloads/${id}-${version}.tar`;
  const skillRel = `downloads/${id}-${version}-skill.tar`;
  const pageRel = `p/${id}/index.html`;
  const recordRel = `api/${id}.json`;
  const packFiles = [
    { path: 'LICENSE', body: Buffer.from('Fixture licence\n'), role: 'license' },
    { path: 'README.md', body: Buffer.from('# Alpha fixture\n'), role: 'doc' },
    { path: 'SKILL.md', body: Buffer.from('---\nname: alpha\ndescription: Fixture skill.\n---\n\n# Alpha\n'), role: 'skill' },
    { path: 'assets/template.md', body: Buffer.from('# Template\n'), role: 'asset' },
    { path: 'examples/example.md', body: Buffer.from('# Example\n'), role: 'example' },
    { path: 'tests/cases.json', body: Buffer.from('{"cases":[]}\n'), role: 'test' }
  ];
  const manifest = {
    schema_version: '1.0',
    pack_id: id,
    version,
    network_required: false,
    declared_permissions: ['read'],
    files: packFiles.map(file => ({ path: file.path, sha256: sha256(file.body), bytes: file.body.length, role: file.role }))
  };
  const manifestBody = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
  const receipt = {
    scope: 'protocol', subject_id: id, version,
    assurance_status: assurance, productivity_evidence: evidence,
    files_sha256: manifest.files.map(file => ({ path: file.path, sha256: file.sha256 }))
  };
  const receiptBody = Buffer.from(JSON.stringify(receipt, null, 2) + '\n');
  const mtime = source.date ? Math.floor(new Date(source.date).getTime() / 1000) : 0;
  const archive = tar([
    { name: `${id}/MANIFEST.json`, body: manifestBody },
    { name: `${id}/RECEIPT.json`, body: receiptBody },
    ...packFiles.map(file => ({ name: `${id}/${file.path}`, body: file.body }))
  ], mtime);
  write(path.join(dist, archiveRel), archive);
  const skillArchive = tar(packFiles.map(file => ({ name: `${id}/${file.path}`, body: file.body })), mtime);
  write(path.join(dist, skillRel), skillArchive);

  const record = {
    contract: {
      id,
      version,
      title: 'Alpha fixture',
      target_users: ['Fixture operators'],
      required_capabilities: ['instruction-following'],
      optional_tools: [{ name: 'file-read' }],
      productivity_evidence: evidence
    },
    achieved_assurance_status: assurance,
    manifest
  };
  writeJson(path.join(dist, recordRel), record);
  writeJson(path.join(dist, 'api', 'v2', `${id}.json`), record);

  const archiveUrl = `/downloads/${id}-${version}.tar`;
  const skillUrl = `/downloads/${id}-${version}-skill.tar`;
  const protocolUrl = `/p/${id}/`;
  const recordUrl = `/api/${id}.json`;
  write(path.join(dist, pageRel), [
    '<!doctype html>',
    `<title>${id} ${version}</title>`,
    `<p>${assurance}</p>`,
    `<p>${evidence}</p>`,
    `<a href="${archiveUrl}">archive</a>`,
    `<a href="${skillUrl}">skill archive</a>`,
    `<code>${sha256(skillArchive)}</code>`,
    `<a href="${recordUrl}">machine record</a>`,
    '<section id="copy-prompt">copy prompt</section>',
    '<section id="download-skill">download skill</section>',
    '<section id="download-pack">download pack</section>',
    ''
  ].join('\n'));

  const starterRel = `downloads/company-pilot-starter-${softwareVersion}.tar`;
  const starterUrl = `/${starterRel}`;
  const starterFiles = [
    { path: 'LICENSE', body: Buffer.from('content: CC0-1.0\ncode: Apache-2.0\n') },
    { path: 'company-pilot/DESIGN-AND-ANALYSIS.md', body: Buffer.from('# Design and analysis\n') },
    { path: 'company-pilot/LICENSE', body: Buffer.from('content: CC0-1.0\ncode: Apache-2.0\n') },
    { path: 'company-pilot/README.md', body: Buffer.from('# Company pilot starter\n') },
    { path: 'company-pilot/templates/pilot-plan.template.json', body: Buffer.from('{"schema_version":"2.0"}\n') },
    { path: 'protocols/document-to-action-plan/adapters/generic-chat/prompt.md', body: Buffer.from('# Prompt\n') },
    { path: 'schema/pilot-assignment.schema.json', body: Buffer.from('{}\n') },
    { path: 'schema/pilot-follow-up.schema.json', body: Buffer.from('{}\n') },
    { path: 'schema/pilot-observations.schema.json', body: Buffer.from('{}\n') },
    { path: 'schema/pilot-plan.schema.json', body: Buffer.from('{}\n') },
    { path: 'schema/pilot-task-bank.schema.json', body: Buffer.from('{}\n') },
    { path: 'tools/lib/jsonschema.js', body: Buffer.from("module.exports = {};\n") },
    { path: 'tools/lib/util.js', body: Buffer.from("module.exports = {};\n") },
    { path: 'tools/pilot-randomize.js', body: Buffer.from('// fixture\n') },
    { path: 'tools/pilot-summary.js', body: Buffer.from('// fixture\n') },
    { path: 'tools/pilot-tests.js', body: Buffer.from('// fixture\n') },
    { path: 'tools/pilot-validate.js', body: Buffer.from('// fixture\n') }
  ];
  const starterArchive = tar(starterFiles.map(file => ({
    name: `productivity-protocols-starter/${file.path}`,
    body: file.body
  })), mtime);
  write(path.join(dist, starterRel), starterArchive);
  for (const file of starterFiles) write(path.join(dist, 'start', 'files', file.path), file.body);
  write(path.join(dist, 'start', 'index.html'), [
    '<!doctype html>',
    '<title>Company starter kit</title>',
    `<a href="${starterUrl}">Download company starter kit</a>`,
    `<p>${starterFiles.length} local files · ${starterArchive.length} bytes</p>`,
    `<code>${sha256(starterArchive)}</code>`,
    '<a href="/start/files/LICENSE">LICENSE</a>',
    '<a href="/start/files/company-pilot/README.md">README.md</a>',
    '<a href="/start/files/company-pilot/DESIGN-AND-ANALYSIS.md">DESIGN-AND-ANALYSIS.md</a>',
    '<a href="/start/files/tools/pilot-validate.js">pilot-validate.js</a>',
    '<a href="/start/files/schema/pilot-plan.schema.json">pilot-plan.schema.json</a>',
    '<a href="/start/files/protocols/document-to-action-plan/adapters/generic-chat/prompt.md">prompt.md</a>',
    ''
  ].join('\n'));
  write(path.join(dist, 'index.html'), [
    '<!doctype html>',
    '<a href="/start/">Company starter kit</a>',
    `<a href="${protocolUrl}">${id}</a>`,
    `<a href="${protocolUrl}#copy-prompt">copy prompt</a>`,
    `<a href="${protocolUrl}#download-skill" data-skill-url="${skillUrl}">download skill</a>`,
    `<a href="${protocolUrl}#download-pack" data-pack-url="${archiveUrl}">download pack</a>`,
    `<a href="${archiveUrl}">download</a>`,
    ''
  ].join('\n'));

  const registry = {
    schema_version: '2.0',
    site: 'Productivity Protocols',
    baseUrl,
    description: 'fixture registry',
    schema: `${baseUrl}/api/v2/registry.schema.json`,
    generated: {
      sourceCommit: source.commit ? source.commit.slice(0, 7) : null,
      sourceDate: source.date,
      builder: `build-protocols@${softwareVersion}`,
      source_commit_full: source.commit,
      source_tree: source.tree,
      dirty: source.dirty
    },
    count: 1,
    protocols: [{
      id,
      version,
      title: 'Alpha fixture',
      purpose: 'Exercise the release-integrity checker.',
      assurance_level: 'quick',
      risk_class: 'low',
      privacy_class: 'public',
      assurance_status: assurance,
      productivity_evidence: evidence,
      task_tags: ['Alpha fixture'],
      audience_tags: ['Fixture operators'],
      required_tool_tags: ['instruction-following'],
      optional_tool_tags: ['file-read'],
      tested_models: [],
      last_verified: null,
      network_required: false,
      url: protocolUrl,
      skill_download: skillUrl,
      skill_sha256: sha256(skillArchive),
      skill_bytes: skillArchive.length,
      download: archiveUrl,
      sha256: sha256(archive)
    }]
  };
  writeJson(path.join(dist, 'api', 'protocols.json'), registry);
  writeJson(path.join(dist, 'api', 'v2', 'protocols.json'), registry);
  const schemaMirror = '{"$id":"https://productivity-protocols.invalid/api/v2/example.schema.json"}\n';
  write(path.join(dist, 'api', 'example.schema.json'), schemaMirror);
  write(path.join(dist, 'api', 'v2', 'example.schema.json'), schemaMirror);

  write(path.join(dist, 'sitemap.xml'), [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `<url><loc>${baseUrl}/</loc></url>`,
    `<url><loc>${baseUrl}/start/</loc></url>`,
    `<url><loc>${baseUrl}/kernel/</loc></url>`,
    `<url><loc>${baseUrl}/status/</loc></url>`,
    `<url><loc>${baseUrl}${protocolUrl}</loc></url>`,
    '</urlset>',
    ''
  ].join('\n'));

  const ledger = {
    $schema: './schema/publication-ledger.schema.json',
    schema_version: '2.0',
    ledger_id: 'productivity-protocols',
    ledger_revision: 1,
    release_status: 'candidate',
    published_at: null,
    site: { base_url: baseUrl, base_path: basePath },
    source: {
      commit: source.commit,
      tree: source.tree,
      date: source.date,
      dirty: source.dirty,
      builder: `build-protocols@${softwareVersion}`
    },
    surfaces: {
      index: fileRef(path.join(dist, 'index.html'), 'index.html'),
      registry: fileRef(path.join(dist, 'api', 'protocols.json'), 'api/protocols.json'),
      sitemap: fileRef(path.join(dist, 'sitemap.xml'), 'sitemap.xml')
    },
    starter: {
      software_version: softwareVersion,
      page: fileRef(path.join(dist, 'start', 'index.html'), 'start/index.html'),
      archive: fileRef(path.join(dist, starterRel), starterRel)
    },
    protocols: [{
      id,
      version,
      assurance_status: assurance,
      productivity_evidence: evidence,
      page: fileRef(path.join(dist, pageRel), pageRel),
      record: fileRef(path.join(dist, recordRel), recordRel),
      archive: fileRef(path.join(dist, archiveRel), archiveRel)
    }],
    note: 'Fixture ledger: byte identity is not evidence of protocol benefit or scientific truth.'
  };
  writeJson(path.join(root, 'PUBLISHED.json'), ledger);
}

function applyMutation(root, operation) {
  const dist = path.join(root, 'dist');
  if (operation === 'append-archive-byte') {
    fs.appendFileSync(path.join(dist, 'downloads', 'alpha-1.0.0.tar'), Buffer.from('x'));
  } else if (operation === 'remove-archive-receipt') {
    const file = path.join(dist, 'downloads', 'alpha-1.0.0.tar');
    const body = fs.readFileSync(file);
    const marker = Buffer.from('alpha/RECEIPT.json');
    const at = body.indexOf(marker);
    if (at < 0) throw new Error('fixture receipt marker not found');
    body[at + marker.length - 1] = 'X'.charCodeAt(0);
    write(file, body);
  } else if (operation === 'remove-skill-test') {
    const file = path.join(dist, 'downloads', 'alpha-1.0.0-skill.tar');
    const body = fs.readFileSync(file);
    const marker = Buffer.from('alpha/tests/cases.json');
    const at = body.indexOf(marker);
    if (at < 0) throw new Error('fixture skill test marker not found');
    body[at + marker.length - 1] = 'X'.charCodeAt(0);
    write(file, body);
  } else if (operation === 'remove-page') {
    fs.unlinkSync(path.join(dist, 'p', 'alpha', 'index.html'));
  } else if (operation === 'change-record-version') {
    const file = path.join(dist, 'api', 'alpha.json');
    const record = readJson(file);
    record.contract.version = '9.9.9';
    writeJson(file, record);
  } else if (operation === 'change-record-achieved-assurance') {
    const file = path.join(dist, 'api', 'alpha.json');
    const record = readJson(file);
    record.achieved_assurance_status = 'FIELD_READY';
    writeJson(file, record);
  } else if (operation === 'change-registry-status') {
    const file = path.join(dist, 'api', 'protocols.json');
    const registry = readJson(file);
    registry.protocols[0].assurance_status = 'FIELD_READY';
    writeJson(file, registry);
  } else if (operation === 'change-registry-task-tags') {
    const file = path.join(dist, 'api', 'protocols.json');
    const registry = readJson(file);
    registry.protocols[0].task_tags = ['Invented task'];
    writeJson(file, registry);
  } else if (operation === 'change-registry-audience-tags') {
    const file = path.join(dist, 'api', 'protocols.json');
    const registry = readJson(file);
    registry.protocols[0].audience_tags = ['Invented audience'];
    writeJson(file, registry);
  } else if (operation === 'change-registry-required-tool-tags') {
    const file = path.join(dist, 'api', 'protocols.json');
    const registry = readJson(file);
    registry.protocols[0].required_tool_tags = ['invented-required-tool'];
    writeJson(file, registry);
  } else if (operation === 'change-registry-optional-tool-tags') {
    const file = path.join(dist, 'api', 'protocols.json');
    const registry = readJson(file);
    registry.protocols[0].optional_tool_tags = ['invented-optional-tool'];
    writeJson(file, registry);
  } else if (operation === 'drop-sitemap-protocol') {
    const file = path.join(dist, 'sitemap.xml');
    const body = fs.readFileSync(file, 'utf8').replace('  <url><loc>https://productivity-protocols.invalid/p/alpha/</loc></url>\n', '');
    // Be insensitive to the fixture's indentation: the semantic URL must go.
    write(file, body.replace('<url><loc>https://productivity-protocols.invalid/p/alpha/</loc></url>\n', ''));
  } else if (operation === 'add-unledgered-archive') {
    write(path.join(dist, 'downloads', 'beta-1.0.0.tar'), Buffer.from('not ledgered'));
  } else if (operation === 'duplicate-ledger-id') {
    const file = path.join(root, 'PUBLISHED.json');
    const ledger = readJson(file);
    ledger.protocols.push(JSON.parse(JSON.stringify(ledger.protocols[0])));
    writeJson(file, ledger);
  } else if (operation === 'remove-starter-page') {
    fs.unlinkSync(path.join(dist, 'start', 'index.html'));
  } else if (operation === 'change-starter-page') {
    fs.appendFileSync(path.join(dist, 'start', 'index.html'), '<!-- changed -->\n');
  } else if (operation === 'change-starter-archive') {
    fs.appendFileSync(path.join(dist, 'downloads', 'company-pilot-starter-0.2.0-candidate.1.tar'), Buffer.from('x'));
  } else if (operation === 'remove-starter-license') {
    const ledger = readJson(path.join(root, 'PUBLISHED.json'));
    const mtime = ledger.source.date ? Math.floor(new Date(ledger.source.date).getTime() / 1000) : 0;
    const incomplete = tar([
      { name: 'productivity-protocols-starter/company-pilot/DESIGN-AND-ANALYSIS.md', body: Buffer.from('# Design\n') },
      { name: 'productivity-protocols-starter/company-pilot/README.md', body: Buffer.from('# Starter\n') }
    ], mtime);
    write(path.join(dist, 'downloads', 'company-pilot-starter-0.2.0-candidate.1.tar'), incomplete);
  } else if (operation === 'unsafe-starter-archive-path') {
    const ledger = readJson(path.join(root, 'PUBLISHED.json'));
    const mtime = ledger.source.date ? Math.floor(new Date(ledger.source.date).getTime() / 1000) : 0;
    const unsafe = tar([
      { name: 'productivity-protocols-starter/../escape.txt', body: Buffer.from('escape\n') },
      { name: 'productivity-protocols-starter/company-pilot/README.md', body: Buffer.from('# Starter\n') }
    ], mtime);
    write(path.join(dist, 'downloads', 'company-pilot-starter-0.2.0-candidate.1.tar'), unsafe);
  } else if (operation === 'drift-registry-full-commit') {
    const file = path.join(dist, 'api', 'protocols.json');
    const registry = readJson(file);
    registry.generated.source_commit_full = 'f'.repeat(40);
    writeJson(file, registry);
  } else if (operation === 'drift-registry-dirty') {
    const file = path.join(dist, 'api', 'protocols.json');
    const registry = readJson(file);
    registry.generated.dirty = registry.generated.dirty === true ? false : true;
    writeJson(file, registry);
  } else if (operation === 'remove-v2-registry-mirror') {
    fs.unlinkSync(path.join(dist, 'api', 'v2', 'protocols.json'));
  } else if (operation === 'change-v2-record-mirror') {
    fs.appendFileSync(path.join(dist, 'api', 'v2', 'alpha.json'), '\n');
  } else if (operation === 'change-v2-schema-mirror') {
    fs.appendFileSync(path.join(dist, 'api', 'v2', 'example.schema.json'), '\n');
  } else {
    throw new Error(`unknown mutation operation ${operation}`);
  }
}

function execTool(root, args) {
  return new Promise(resolve => {
    const child = childProcess.spawn(process.execPath, [TOOL, '--root', root, ...(args || [])], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('close', code => resolve({ code, stdout, stderr, output: stdout + stderr }));
  });
}

function git(root, args) {
  return childProcess.execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function tempRoot(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `pp-release-${label}-`));
}

async function main() {
  const roots = [];
  let passed = 0;
  let total = 0;
  async function test(name, fn) {
    total++;
    try {
      await fn();
      passed++;
      console.log(`  ✓ ${name}`);
    } catch (error) {
      console.error(`  ✗ ${name}: ${error.message}`);
    }
  }
  function root(label) { const value = tempRoot(label); roots.push(value); return value; }
  function assert(condition, message) { if (!condition) throw new Error(message); }

  try {
    await test('published schema exposes the Evidence Press v2 namespace and supports a root fixture mount', async () => {
      const schema = readJson(path.join(REPO, 'schema', 'publication-ledger.schema.json'));
      assert(schema.$id === 'https://evidencepress.org/protocols/api/v2/publication-ledger.schema.json', `unexpected schema $id ${schema.$id}`);
      assert(schema.properties.schema_version.const === '2.0', 'publication ledger schema version is not 2.0');
      assert(new RegExp(schema.properties.site.properties.base_path.pattern).test(''), 'schema does not accept the root-mounted empty base path');
      assert(new RegExp(schema.properties.source.properties.builder.pattern).test('build-protocols@0.2.0-candidate.1'), 'schema does not accept a semver prerelease builder');
      assert(schema.required.includes('starter'), 'publication ledger does not require the starter artifact');
      assert(schema.properties.source.required.includes('tree'), 'ledger source does not require its Git tree');
      assert(schema.properties.source.required.includes('dirty'), 'ledger source does not require explicit dirty state');
      const registrySchema = readJson(path.join(REPO, 'schema', 'registry.schema.json'));
      const registryEntry = registrySchema.properties.protocols.items;
      for (const field of ['task_tags', 'audience_tags', 'required_tool_tags', 'optional_tool_tags']) {
        assert(registryEntry.required.includes(field), `registry schema does not require ${field}`);
        assert(registryEntry.properties[field].type === 'array', `registry schema ${field} is not an array`);
        assert(registryEntry.properties[field].uniqueItems === true, `registry schema ${field} does not require unique tags`);
      }
      for (const field of ['skill_download', 'skill_sha256', 'skill_bytes']) {
        assert(registryEntry.required.includes(field), `registry schema does not require ${field}`);
      }
    });

    await test('root-mounted, non-Git fixture passes only in explicit candidate mode', async () => {
      const dir = root('candidate');
      makeFixture(dir);
      const result = await execTool(dir, ['--candidate']);
      assert(result.code === 0, result.output);
      assert(result.output.includes('not deploy authorisation'), 'candidate assurance warning was not printed');
      const production = await execTool(dir, []);
      assert(production.code === 1 && production.output.includes('not a Git worktree'), 'non-Git production source was not refused');
    });

    await test('dirty Git candidate passes only with dirty provenance recorded explicitly', async () => {
      const dir = root('dirty-candidate');
      git(dir, ['init', '-q']);
      git(dir, ['config', 'user.name', 'Release Integrity Test']);
      git(dir, ['config', 'user.email', 'release-integrity@example.invalid']);
      write(path.join(dir, '.gitignore'), '/dist/\n');
      write(path.join(dir, 'content.txt'), 'candidate source\n');
      git(dir, ['add', '.gitignore', 'content.txt']);
      git(dir, ['commit', '-q', '-m', 'candidate source']);
      write(path.join(dir, 'dirty-input.txt'), 'uncommitted build input\n');
      const commit = git(dir, ['rev-parse', 'HEAD']);
      const tree = git(dir, ['rev-parse', 'HEAD^{tree}']);
      const date = git(dir, ['show', '-s', '--format=%cI', commit]);
      makeFixture(dir, { commit, tree, date, dirty: true });
      const result = await execTool(dir, ['--candidate']);
      assert(result.code === 0, result.output);
      assert(result.output.includes('explicitly describe a build from a dirty source tree'), 'dirty provenance warning was not printed');
      const production = await execTool(dir, []);
      assert(production.code === 1 && production.output.includes('ledger.source.dirty must be false'), 'dirty ledger provenance was not refused in production mode');
    });

    for (const mutation of MUTATIONS) {
      await test(`mutation is rejected: ${mutation.id}`, async () => {
        const dir = root(mutation.id);
        makeFixture(dir);
        applyMutation(dir, mutation.operation);
        const result = await execTool(dir, ['--candidate']);
        assert(result.code === 1, `mutation unexpectedly passed\n${result.output}`);
        assert(result.output.includes(mutation.expected), `expected diagnostic ${JSON.stringify(mutation.expected)}\n${result.output}`);
      });
    }

    await test('clean production source passes; dirty and stale sources fail', async () => {
      const dir = root('git-source');
      git(dir, ['init', '-q']);
      git(dir, ['config', 'user.name', 'Release Integrity Test']);
      git(dir, ['config', 'user.email', 'release-integrity@example.invalid']);
      write(path.join(dir, '.gitignore'), '/dist/\n');
      write(path.join(dir, 'content.txt'), 'substantive build input\n');
      git(dir, ['add', '.gitignore', 'content.txt']);
      git(dir, ['commit', '-q', '-m', 'candidate source']);
      const commit = git(dir, ['rev-parse', 'HEAD']);
      const tree = git(dir, ['rev-parse', 'HEAD^{tree}']);
      const date = git(dir, ['show', '-s', '--format=%cI', commit]);
      makeFixture(dir, { commit, tree, date, dirty: false });
      git(dir, ['add', 'PUBLISHED.json']);
      git(dir, ['commit', '-q', '-m', 'release control ledger']);

      const clean = await execTool(dir, []);
      assert(clean.code === 0, clean.output);
      write(path.join(dir, 'scratch.txt'), 'dirty\n');
      const dirty = await execTool(dir, []);
      assert(dirty.code === 1 && dirty.output.includes('production source is dirty'), `dirty source was not refused\n${dirty.output}`);
      const dirtyCandidate = await execTool(dir, ['--candidate']);
      assert(dirtyCandidate.code === 0, dirtyCandidate.output);
      git(dir, ['add', 'scratch.txt']);
      git(dir, ['commit', '-q', '-m', 'substantive change after build']);
      const stale = await execTool(dir, []);
      assert(stale.code === 1 && stale.output.includes('production source is stale'), `stale clean source was not refused\n${stale.output}`);
    });

    await test('nested protocol source resolves provenance at the enclosing Git worktree', async () => {
      const top = root('nested-git-source');
      const dir = path.join(top, 'protocols');
      fs.mkdirSync(path.join(dir, 'schema'), { recursive: true });
      git(top, ['init', '-q']);
      git(top, ['config', 'user.name', 'Release Integrity Test']);
      git(top, ['config', 'user.email', 'release-integrity@example.invalid']);
      write(path.join(top, '.gitignore'), '/protocols/dist/\n');
      write(path.join(dir, 'site.config.json'), '{}\n');
      write(path.join(dir, 'schema', 'publication-ledger.schema.json'), '{}\n');
      write(path.join(dir, 'content.txt'), 'nested substantive build input\n');
      git(top, ['add', '.gitignore', 'protocols/site.config.json', 'protocols/schema/publication-ledger.schema.json', 'protocols/content.txt']);
      git(top, ['commit', '-q', '-m', 'nested candidate source']);
      const commit = git(top, ['rev-parse', 'HEAD']);
      const tree = git(top, ['rev-parse', 'HEAD^{tree}']);
      const date = git(top, ['show', '-s', '--format=%cI', commit]);
      makeFixture(dir, { commit, tree, date, dirty: false });
      git(top, ['add', 'protocols/PUBLISHED.json']);
      git(top, ['commit', '-q', '-m', 'nested release control ledger']);
      const clean = await execTool(dir, []);
      assert(clean.code === 0, clean.output);
      write(path.join(top, 'outside-subsystem.txt'), 'substantive host change\n');
      git(top, ['add', 'outside-subsystem.txt']);
      git(top, ['commit', '-q', '-m', 'host change after build']);
      const stale = await execTool(dir, []);
      assert(stale.code === 1 && stale.output.includes('production source is stale'),
        `host-level stale source was not refused\n${stale.output}`);
    });

    await test('unknown record/update mode is refused without changing the ledger', async () => {
      const dir = root('readonly');
      makeFixture(dir);
      const before = sha256(fs.readFileSync(path.join(dir, 'PUBLISHED.json')));
      const result = await execTool(dir, ['--candidate', '--record']);
      const after = sha256(fs.readFileSync(path.join(dir, 'PUBLISHED.json')));
      assert(result.code === 2 && result.output.includes('no record or update mode'), result.output);
      assert(before === after, 'checker mutated PUBLISHED.json');
    });

    await test('localhost exact readback passes and a one-byte live mutation fails', async () => {
      const dir = root('live');
      makeFixture(dir);
      let mutate = null;
      const server = http.createServer((req, res) => {
        const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
        const rel = pathname.replace(/^\/+/, '') || 'index.html';
        const file = path.resolve(path.join(dir, 'dist'), ...rel.split('/'));
        const dist = path.resolve(path.join(dir, 'dist'));
        if (!file.startsWith(dist + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
          res.statusCode = 404;
          return res.end('not found');
        }
        let body = fs.readFileSync(file);
        if (rel === mutate) body = Buffer.concat([body, Buffer.from('x')]);
        res.statusCode = 200;
        res.setHeader('content-length', body.length);
        res.end(body);
      });
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
      });
      try {
        const port = server.address().port;
        const liveBase = `http://127.0.0.1:${port}/`;
        const exact = await execTool(dir, ['--candidate', '--live', liveBase]);
        assert(exact.code === 0 && exact.output.includes('exact live readback passed'), exact.output);
        mutate = 'p/alpha/index.html';
        const changed = await execTool(dir, ['--candidate', '--live', liveBase]);
        assert(changed.code === 1 && changed.output.includes('live readback failed'), `mutated live page unexpectedly passed\n${changed.output}`);
        mutate = 'downloads/alpha-1.0.0-skill.tar';
        const changedSkill = await execTool(dir, ['--candidate', '--live', liveBase]);
        assert(changedSkill.code === 1 && changedSkill.output.includes('registry-bound candidate downloads/alpha-1.0.0-skill.tar'),
          `mutated live skill edition unexpectedly passed\n${changedSkill.output}`);
      } finally {
        await new Promise(resolve => server.close(resolve));
      }
    });
  } finally {
    for (const dir of roots) fs.rmSync(dir, { recursive: true, force: true });
  }

  console.log(`\nrelease-integrity tests: ${passed}/${total} passed`);
  if (passed !== total) process.exitCode = 1;
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
