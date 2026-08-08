'use strict';
/*
 * A minimal, dependency-free JSON Schema validator supporting exactly the
 * keywords used by the Productivity Protocols schemas (draft 2020-12 subset):
 * type, required, properties, additionalProperties:false, items, enum, const,
 * pattern, minItems, maxItems, minLength, minimum, exclusiveMinimum, maximum,
 * format (date, date-time, uri), if/then/else,
 * and local $ref into $defs. It keeps the *.schema.json files authoritative so
 * validation rules are not duplicated in code.
 *
 * validate(schema, data) -> array of { path, msg } (empty means valid).
 * Licence: Apache-2.0.
 */

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (Number.isInteger(v)) return 'integer';
  if (typeof v === 'number') return 'number';
  return typeof v; // string | boolean | object
}

function matchesType(v, t) {
  if (t === 'number') return typeOf(v) === 'number' || typeOf(v) === 'integer';
  return typeOf(v) === t;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeOf(a) !== typeOf(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => deepEqual(x, b[i]));
  }
  if (a && typeof a === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every(k => deepEqual(a[k], b[k]));
  }
  return false;
}

function resolveRef(ref, root) {
  if (!ref.startsWith('#/')) throw new Error('unsupported $ref: ' + ref);
  const parts = ref.slice(2).split('/');
  let cur = root;
  for (const p of parts) cur = cur[p];
  if (!cur) throw new Error('unresolved $ref: ' + ref);
  return cur;
}

function isCalendarDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const year = Number(m[1]), month = Number(m[2]), day = Number(m[3]);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

function isDateTime(value) {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  if (!m || !isCalendarDate(m[1])) return false;
  const hour = Number(m[2]), minute = Number(m[3]), second = Number(m[4]);
  const offsetHour = m[6] == null ? 0 : Number(m[6]);
  const offsetMinute = m[7] == null ? 0 : Number(m[7]);
  return hour <= 23 && minute <= 59 && second <= 59 && offsetHour <= 23 && offsetMinute <= 59 &&
    !Number.isNaN(Date.parse(value));
}

function validate(schema, data, root, path, errors) {
  root = root || schema;
  path = path || '$';
  errors = errors || [];

  if (schema.$ref) {
    return validate(resolveRef(schema.$ref, root), data, root, path, errors);
  }

  // Evaluate the condition against an isolated error list: `if` selects a
  // branch but never contributes validation errors of its own. This is a
  // deliberately small addition, not a claim of full Draft 2020-12 support.
  if (schema.if) {
    const conditionMatches = validate(schema.if, data, root, path, []).length === 0;
    if (conditionMatches && schema.then) validate(schema.then, data, root, path, errors);
    if (!conditionMatches && schema.else) validate(schema.else, data, root, path, errors);
  }

  // type
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some(t => matchesType(data, t))) {
      errors.push({ path, msg: `expected type ${types.join('|')}, got ${typeOf(data)}` });
      return errors; // further checks unreliable
    }
  }

  // const / enum
  if ('const' in schema && !deepEqual(data, schema.const)) {
    errors.push({ path, msg: `expected const ${JSON.stringify(schema.const)}` });
  }
  if (schema.enum && !schema.enum.some(e => deepEqual(e, data))) {
    errors.push({ path, msg: `value ${JSON.stringify(data)} not in enum` });
  }

  const t = typeOf(data);

  if (t === 'string') {
    if (schema.minLength != null && data.length < schema.minLength)
      errors.push({ path, msg: `string shorter than minLength ${schema.minLength}` });
    if (schema.pattern && !new RegExp(schema.pattern).test(data))
      errors.push({ path, msg: `string does not match pattern ${schema.pattern}` });
    if (schema.format === 'date' && !isCalendarDate(data))
      errors.push({ path, msg: `not a real calendar date (YYYY-MM-DD)` });
    if (schema.format === 'date-time' && !isDateTime(data))
      errors.push({ path, msg: `not an RFC 3339 date-time with timezone` });
    if (schema.format === 'uri' && !/^[a-z][a-z0-9+.-]*:\/\//i.test(data))
      errors.push({ path, msg: `not a uri` });
  }

  if (t === 'number' || t === 'integer') {
    if (schema.minimum != null && data < schema.minimum)
      errors.push({ path, msg: `less than minimum ${schema.minimum}` });
    if (schema.exclusiveMinimum != null && data <= schema.exclusiveMinimum)
      errors.push({ path, msg: `not greater than exclusiveMinimum ${schema.exclusiveMinimum}` });
    if (schema.maximum != null && data > schema.maximum)
      errors.push({ path, msg: `greater than maximum ${schema.maximum}` });
  }

  if (t === 'array') {
    if (schema.minItems != null && data.length < schema.minItems)
      errors.push({ path, msg: `fewer than minItems ${schema.minItems}` });
    if (schema.maxItems != null && data.length > schema.maxItems)
      errors.push({ path, msg: `more than maxItems ${schema.maxItems}` });
    if (schema.items) {
      data.forEach((item, i) => validate(schema.items, item, root, `${path}[${i}]`, errors));
    }
  }

  if (t === 'object') {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in data)) errors.push({ path, msg: `missing required property '${key}'` });
      }
    }
    if (schema.properties) {
      for (const [key, sub] of Object.entries(schema.properties)) {
        if (key in data) validate(sub, data[key], root, `${path}.${key}`, errors);
      }
    }
    if (schema.additionalProperties === false && schema.properties) {
      const allowed = new Set(Object.keys(schema.properties));
      for (const key of Object.keys(data)) {
        if (!allowed.has(key)) errors.push({ path: `${path}.${key}`, msg: `additional property not allowed` });
      }
    }
  }

  return errors;
}

module.exports = { validate, deepEqual };
