/* flowix: locally authored response transformer. No network or browser APIs. */
(function (root) {
  'use strict';
  const config = Object.freeze({
    revision: 1,
    origin: 'https://flow.google.com',
    endpoint: '/_/AiSandboxAngularFrontend/data/batchexecute',
    methodId: 'cPZSdc',
    index: 30,
    minimumItems: 32
  });
  function matches(value, base = config.origin) {
    try {
      const u = new URL(value, base);
      return u.origin === config.origin && u.pathname === config.endpoint &&
        u.searchParams.get('rpcids') === config.methodId;
    } catch { return false; }
  }
  function transform(text) {
    const unchanged = (state) => ({text, state, changed:false});
    if (typeof text !== 'string' || text.length > 2_000_000) return unchanged('unsupported_response');
    const rows = text.split('\n');
    let total = 0;
    let previous;
    try {
      for (let i = 1; i < rows.length; i++) {
        const serialized = rows[i].replace(/\r$/, '');
        if (!serialized.startsWith('[[')) continue;
        let frame;
        try { frame = JSON.parse(serialized); } catch { continue; }
        if (!Array.isArray(frame)) continue;
        let touched = false;
        for (const record of frame) {
          if (!Array.isArray(record) || record[0] !== 'wrb.fr' || record[1] !== config.methodId) continue;
          total++;
          const fields = JSON.parse(record[2]);
          if (!Array.isArray(fields) || fields.length < config.minimumItems ||
            (fields[config.index] !== null && typeof fields[config.index] !== 'boolean')) {
            return unchanged('schema_changed');
          }
          previous = fields[config.index];
          if (previous !== true) {
            fields[config.index] = true;
            record[2] = JSON.stringify(fields);
            touched = true;
          }
        }
        if (!touched) continue;
        const declared = rows[i-1].trim();
        if (!/^\d+$/.test(declared)) return unchanged('invalid_frame');
        const length = Number(declared);
        const byteLength = (s) => new TextEncoder().encode(s).length;
        const measure = [byteLength, (s) => s.length].find(f => {
          const padding = length - f(serialized);
          return padding >= 0 && padding <= 2;
        });
        if (!measure) return unchanged('invalid_frame');
        const replacement = JSON.stringify(frame);
        rows[i-1] = String(length + measure(replacement) - measure(serialized)) + (rows[i-1].endsWith('\r') ? '\r' : '');
        rows[i] = replacement + (rows[i].endsWith('\r') ? '\r' : '');
      }
    } catch { return unchanged('schema_changed'); }
    if (total !== 1) return unchanged('response_not_found');
    if (previous === true) return unchanged('already_allowed');
    return {text:rows.join('\n'), state:'applied', changed:true};
  }
  const api = Object.freeze({config, matches, transform});
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.defineProperty(root, '__flowixCore', {value:api, configurable:true});
})(globalThis);
