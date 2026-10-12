'use strict';
const SCRIPT_ID = 'flowix-local';
const PATTERN = 'https://flow.google.com/*';
const HOME = 'https://flow.google.com/';
let serial = Promise.resolve();
let controls = Promise.resolve();
function updateRegistration(enabled) {
  const task = serial.then(async () => {
    const found = await chrome.scripting.getRegisteredContentScripts({ids:[SCRIPT_ID]});
    if (enabled && !found.length) await chrome.scripting.registerContentScripts([{
      id:SCRIPT_ID, matches:[PATTERN], js:['core.js','page.js'], world:'MAIN', runAt:'document_start', persistAcrossSessions:true
    }]);
    if (!enabled && found.length) await chrome.scripting.unregisterContentScripts({ids:[SCRIPT_ID]});
  });
  serial = task.catch(() => {});
  return task;
}
async function reconcile() {
  const stored = await chrome.storage.local.get({enabled:true, language:'ru'});
  await updateRegistration(stored.enabled !== false);
  return stored;
}
async function currentTab() {
  const [active] = await chrome.tabs.query({active:true,currentWindow:true});
  if (active?.url?.startsWith(HOME)) return active;
  return (await chrome.tabs.query({url:PATTERN}))[0] || null;
}
async function reloadFlow() {
  const tabs = await chrome.tabs.query({url:PATTERN});
  await Promise.allSettled(tabs.map(async tab => {
    if (new URL(tab.url).pathname === '/unsupported-country') await chrome.tabs.update(tab.id,{url:HOME});
    else await chrome.tabs.reload(tab.id);
  }));
}
const states = new Set(['waiting','applied','already_allowed','schema_changed','invalid_frame','response_not_found','unsupported_response','read_error','not_loaded']);
async function snapshot() {
  await serial;
  const stored = await chrome.storage.local.get({enabled:true,language:'ru'});
  const registered = (await chrome.scripting.getRegisteredContentScripts({ids:[SCRIPT_ID]})).length === 1;
  const tab = await currentTab();
  let observation = {state:tab ? 'not_loaded' : 'no_tab',matched:0,modified:0,transport:null,blockedPage:false};
  if (tab) {
    try {
      const r = await chrome.tabs.sendMessage(tab.id,{action:'tab-status'});
      observation = {
        state:states.has(r?.state)?r.state:'not_loaded',
        matched:Number.isSafeInteger(r?.matched)?Math.max(0,Math.min(r.matched,9999)):0,
        modified:Number.isSafeInteger(r?.modified)?Math.max(0,Math.min(r.modified,9999)):0,
        transport:['xhr','fetch'].includes(r?.transport)?r.transport:null,
        blockedPage:r?.blockedPage===true
      };
    } catch {}
  }
  return {enabled:stored.enabled!==false,language:stored.language==='en'?'en':'ru',registered,...observation,version:chrome.runtime.getManifest().version,revision:1};
}
chrome.runtime.onInstalled.addListener(() => {void reconcile().catch(console.error);});
chrome.runtime.onStartup.addListener(() => {void reconcile().catch(console.error);});
const ready = reconcile().catch(console.error);
chrome.runtime.onMessage.addListener((message,sender,reply) => {
  // Page content scripts cannot issue controls.
  if (sender.id!==chrome.runtime.id || sender.tab) return;
  const run = async () => {
    await ready;
    if(message?.action==='status') return snapshot();
    if(message?.action==='language') {
      if(!['ru','en'].includes(message.language)) throw Error('Invalid language');
      await chrome.storage.local.set({language:message.language}); return snapshot();
    }
    if(message?.action==='toggle') {
      if(typeof message.enabled!=='boolean') throw Error('Invalid state');
      await updateRegistration(message.enabled);
      await chrome.storage.local.set({enabled:message.enabled});
      await reloadFlow(); return snapshot();
    }
    if(message?.action==='retry') {
      await reconcile();
      const tab=await currentTab();
      if(tab) await chrome.tabs.update(tab.id,{url:HOME,active:true});
      else await chrome.tabs.create({url:HOME});
      return snapshot();
    }
    throw Error('Unknown action');
  };
  // Serialize the whole transaction, including persisted settings and tab reloads.
  const task = controls.then(run);
  controls = task.catch(() => {});
  task.then(data=>reply({ok:true,data}),()=>reply({ok:false,error:'operation_failed'}));
  return true;
});
