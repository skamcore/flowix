'use strict';
(() => {
  const $=id=>document.getElementById(id);
  let latest=null;
  let language='ru';
  let busy=false;
  const phrases={
    ru:[['Меньше преград.','Больше идей.'],['Лови момент.','Создавай.'],['Твои идеи.','Твой поток.'],['Простор','для фантазии.']],
    en:[['Fewer barriers.','More ideas.'],['Feel inspired.','Start creating.'],['Your ideas.','Your flow.'],['Make room','for imagination.']]
  };
  let phraseIndex=0, phraseTimer;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let phraseAnimation=null, phraseRevision=0, renderedPhrase='';
  async function renderPhrase(animate=false) {
    const title=$('hero-title');
    const lines=phrases[language][phraseIndex];
    const key=language+phraseIndex;
    if(key===renderedPhrase) return;
    const revision=++phraseRevision;
    phraseAnimation?.cancel();
    const smooth=animate&&!reducedMotion.matches&&!document.hidden;
    if(smooth) {
      phraseAnimation=title.animate([{opacity:1},{opacity:0}],{duration:240,easing:'ease-in',fill:'forwards'});
      try { await phraseAnimation.finished; } catch { return; }
      if(revision!==phraseRevision) return;
    }
    title.replaceChildren(document.createTextNode(lines[0]),document.createElement('br'),document.createTextNode(lines[1]));
    renderedPhrase=key;
    phraseAnimation?.cancel();
    if(smooth) {
      phraseAnimation=title.animate([{opacity:0},{opacity:1}],{duration:360,easing:'ease-out'});
      try { await phraseAnimation.finished; } catch {}
    }
  }
  function schedulePhrase() {
    clearTimeout(phraseTimer);
    if(document.hidden) { phraseRevision++;phraseAnimation?.cancel();return; }
    phraseTimer=setTimeout(async()=>{
      phraseIndex=(phraseIndex+1)%phrases[language].length;
      await renderPhrase(true);
      if(!document.hidden) schedulePhrase();
    },8000);
  }
  document.addEventListener('visibilitychange',schedulePhrase);
  window.addEventListener('pagehide',()=>{clearTimeout(phraseTimer);phraseAnimation?.cancel();});
  schedulePhrase();
  async function send(action,extra={}) {
    const result=await chrome.runtime.sendMessage({action,...extra});
    if(!result?.ok) throw Error('operation_failed');
    return result.data;
  }
  function draw(snapshot) {
    latest=snapshot;
    language=snapshot.language==='en'?'en':'ru';
    const t=flowixText[language];
    renderPhrase();
    $('control-title').textContent=language==='ru'?'Расширение':'Extension';
    $('download-label').textContent=language==='ru'?'Диагностика':'Diagnostics';
    document.documentElement.lang=language;
    document.body.dataset.enabled=String(snapshot.enabled);
    $('language').textContent=language.toUpperCase();
    $('language').setAttribute('aria-label',t.switchLanguage);
    $('language').title=t.switchLanguage;
    $('state-label').textContent=snapshot.enabled?t.on:t.off;
    $('toggle').setAttribute('aria-checked',String(snapshot.enabled));
    $('toggle').setAttribute('aria-label',snapshot.enabled?t.disable:t.enable);
    $('toggle').title=snapshot.enabled?t.disable:t.enable;
    $('export').setAttribute('aria-label',t.download);
    $('export').title=t.download;
    $('export').removeAttribute('data-error');
  }
  async function operation(action,extra={}) {
    if(busy) return null;
    busy=true;
    for(const id of ['toggle','language','export']) $(id).disabled=true;
    $('announcement').textContent='';
    try {
      const snapshot=await send(action,extra);
      draw(snapshot);
      return snapshot;
    } catch {
      const message=flowixText[language].error;
      $('announcement').textContent=message;
      $('export').title=message;
      $('export').dataset.error='true';
      return null;
    } finally {
      busy=false;
      for(const id of ['toggle','language']) $(id).disabled=!latest;
      $('export').disabled=false;
    }
  }
  $('toggle').addEventListener('click',()=>operation('toggle',{enabled:!latest.enabled}));
  $('language').addEventListener('click',()=>operation('language',{language:language==='ru'?'en':'ru'}));
  $('export').addEventListener('click',async()=>{
    const snapshot=await operation('status');
    if(!snapshot) return;
    const safe={product:'flowix',version:snapshot.version,configRevision:snapshot.revision,enabled:snapshot.enabled,registered:snapshot.registered,state:snapshot.state,transport:snapshot.transport,matched:snapshot.matched,modified:snapshot.modified,blockedPage:snapshot.blockedPage};
    const url=URL.createObjectURL(new Blob([JSON.stringify(safe,null,2)+'\n'],{type:'application/json'}));
    const link=document.createElement('a');
    link.href=url;link.download='flowix-diagnostics.json';link.click();
    $('announcement').textContent=flowixText[language].saved;
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  });
  void operation('status');
})();
