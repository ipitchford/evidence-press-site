// Node 18+ ESM resolution must enforce the same closure as CommonJS require.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { assertRequest, assertResolved } = require('./build-runtime-guard.js');
export async function resolve(specifier, context, nextResolve) {
  assertRequest(specifier);
  const resolved = await nextResolve(specifier, context);
  assertResolved(specifier, resolved.url);
  return resolved;
}
