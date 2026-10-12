(() => {
  'use strict';
  const allowed = new Set(['waiting','applied','already_allowed','schema_changed','invalid_frame','response_not_found','unsupported_response','read_error']);
  chrome.runtime.onMessage.addListener((message, sender, reply) => {
    if (sender.id !== chrome.runtime.id || message?.action !== 'tab-status') return;
    let data;
    try { data = JSON.parse(document.documentElement?.getAttribute('data-flowix-status') || 'null'); } catch {}
    reply({
      state: allowed.has(data?.state) ? data.state : 'not_loaded',
      transport: ['xhr','fetch'].includes(data?.transport) ? data.transport : null,
      matched: Number.isSafeInteger(data?.matched) ? Math.max(0, Math.min(data.matched,9999)) : 0,
      modified: Number.isSafeInteger(data?.modified) ? Math.max(0, Math.min(data.modified,9999)) : 0,
      revision: 1,
      blockedPage: location.pathname === '/unsupported-country'
    });
  });
})();
