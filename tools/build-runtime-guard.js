'use strict';
// The composite build is intentionally dependency-free. Browser/authoring
// dependencies may be installed for QA but must not silently enter its closure.
const Module = require('module');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { fileURLToPath } = require('url');
const sourceRoot = fs.realpathSync(path.resolve(__dirname, '..'));
const replayRoot = fs.realpathSync(process.cwd());
const isStarterReplay = path.basename(replayRoot) === 'productivity-protocols-starter' &&
  path.basename(path.dirname(replayRoot)).startsWith('productivity-protocols-starter-') &&
  fs.realpathSync(path.dirname(path.dirname(replayRoot))) === fs.realpathSync(os.tmpdir());
const isBuildReplay = path.basename(replayRoot).startsWith('pp-build-replay-') &&
  fs.realpathSync(path.dirname(replayRoot)) === fs.realpathSync(os.tmpdir());
function assertRequest(request) {
  if (!Module.isBuiltin(request) && !request.startsWith('.') && !path.isAbsolute(request) && !request.startsWith('file:')) {
    throw new Error(`composite build may not load package dependencies: ${request}`);
  }
}
function assertResolved(request, resolved) {
  if (Module.isBuiltin(resolved)) return;
  if (/[/\\]node_modules[/\\]/.test(`${request}\n${resolved}`)) throw new Error(`composite build may not load package dependencies: ${request}`);
  const file = fs.realpathSync(resolved.startsWith('file:') ? fileURLToPath(resolved) : resolved);
  const relative = path.relative(sourceRoot, file).split(path.sep).join('/');
  const inSource = relative !== '..' && !relative.startsWith('../') && !path.isAbsolute(relative);
  if (inSource && !/^(?:\.git|\.wrangler|test-results|playwright-report|dist|protocols\/dist)(?:\/|$)/.test(relative)) return;
  if (isStarterReplay && file.startsWith(replayRoot + path.sep)) return;
  // The mandatory A/B equivalence regression creates its own Git repository
  // from copies of the source. Admit only byte-identical source modules there,
  // not arbitrary code merely located under a convincing temporary directory.
  if (isBuildReplay && file.startsWith(replayRoot + path.sep)) {
    const originalFile = path.join(sourceRoot, path.relative(replayRoot, file));
    if (fs.existsSync(originalFile) && fs.lstatSync(originalFile).isFile() &&
        fs.readFileSync(originalFile).equals(fs.readFileSync(file))) return;
  }
  throw new Error(`module is outside the composite build closure: ${request}`);
}
const original = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  assertRequest(request);
  const resolved = original.call(this, request, parent, ...rest);
  assertResolved(request, resolved);
  return resolved;
};
module.exports = { assertRequest, assertResolved };
