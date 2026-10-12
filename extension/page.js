/* Only Flow's designated configuration response is eligible for adjustment. */
(() => {
  'use strict';
  if (window.__flowixInstalled || !globalThis.__flowixCore) return;
  Object.defineProperty(window, '__flowixInstalled', {value:true});
  const core = globalThis.__flowixCore;
  const status = {state:'waiting', transport:null, matched:0, modified:0, revision:core.config.revision};
  function publish() {
    if (document.documentElement) document.documentElement.setAttribute('data-flowix-status', JSON.stringify(status));
  }
  function handle(text, transport) {
    const result = core.transform(text);
    status.state = result.state;
    status.transport = transport;
    status.matched++;
    if (result.changed) status.modified++;
    publish();
    return result;
  }
  const proto = XMLHttpRequest.prototype;
  const open = proto.open;
  const selected = new WeakSet();
  const cached = new WeakMap();
  proto.open = function(method, url, ...args) {
    selected.delete(this);
    cached.delete(this);
    if (String(method).toUpperCase() === 'POST' && core.matches(url, location.href)) selected.add(this);
    return Reflect.apply(open, this, [method, url, ...args]);
  };
  for (const field of ['responseText','response']) {
    const original = Object.getOwnPropertyDescriptor(proto, field);
    if (!original?.get || !original.configurable) continue;
    Object.defineProperty(proto, field, {
      ...original,
      get() {
        const text = Reflect.apply(original.get, this, []);
        if (!selected.has(this) || typeof text !== 'string') return text;
        if (this.readyState === 3) return ''; // Do not expose an incomplete configuration frame.
        if (this.readyState !== 4 || this.status < 200 || this.status >= 300) return text;
        if (!cached.has(this)) cached.set(this, handle(text,'xhr').text);
        return cached.get(this);
      }
    });
  }
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    const response = await Reflect.apply(originalFetch, this, [input, init]);
    try {
      const url = typeof input === 'string' || input instanceof URL ? String(input) : input?.url;
      const method = init?.method || input?.method || 'GET';
      if (String(method).toUpperCase() !== 'POST' || !core.matches(url, location.href) || !response.ok) return response;
      const result = handle(await response.clone().text(),'fetch');
      if (!result.changed) return response;
      const headers = new Headers(response.headers);
      for (const key of ['content-length','content-encoding','etag']) headers.delete(key);
      const adjusted = new Response(result.text, {status:response.status, statusText:response.statusText, headers});
      for (const key of ['url','redirected','type']) Object.defineProperty(adjusted,key,{value:response[key]});
      return adjusted;
    } catch {
      status.state = 'read_error'; publish();
      return response;
    }
  };
  window.addEventListener('message', e => {
    if (e.source === window && e.origin === location.origin && e.data?.type === 'flowix:refresh-status') publish();
  });
  if (document.documentElement) publish();
  else document.addEventListener('DOMContentLoaded',publish,{once:true});
})();
