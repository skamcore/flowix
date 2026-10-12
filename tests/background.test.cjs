const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(options={}){
 let listener;const store={};let registrations=[];const navigations=[];
 const flow={id:10,url:'https://flow.google.com/project/123'};
 const chrome={
  storage:{local:{async get(defaults){return {...defaults,...store};},async set(next){if(options.slowDisable&&next.enabled===false)await new Promise(resolve=>setTimeout(resolve,20));Object.assign(store,next);}}},
  scripting:{async getRegisteredContentScripts(){return registrations;},async registerContentScripts(s){registrations=s;},async unregisterContentScripts(){registrations=[];}},
  tabs:{async query(){return [flow];},async sendMessage(){return {state:'applied',matched:1,modified:1,transport:'xhr',blockedPage:false};},async update(id,args){navigations.push(['update',id,args]);},async reload(id){if(options.closedTab)throw Error('No tab');navigations.push(['reload',id]);},async create(args){navigations.push(['create',args]);}},
  runtime:{id:'test',getManifest(){return {version:'0.1.0'};},onInstalled:{addListener(){}},onStartup:{addListener(){}},onMessage:{addListener(cb){listener=cb;}}}
 };
 vm.runInNewContext(fs.readFileSync('extension/background.js','utf8'),{chrome,console,URL});
 async function message(action,extra={},sender={id:'test'}){
  return new Promise(resolve=>{const result=listener({action,...extra},sender,resolve);if(result!==true)resolve(null);});
 }
 return {message,store,navigations,flow};
}
test('cold start registers once and defaults to Russian',async()=>{
 const s=setup(),r=await s.message('status');assert.equal(r.ok,true);assert.equal(r.data.registered,true);assert.equal(r.data.language,'ru');
});
test('toggle disables registration and reloads project without losing its URL',async()=>{
 const s=setup();await s.message('status');const r=await s.message('toggle',{enabled:false});assert.equal(r.data.registered,false);assert.equal(s.store.enabled,false);assert.equal(s.navigations[0][0],'reload');
});
test('retry escapes the refusal page',async()=>{
 const s=setup();s.flow.url='https://flow.google.com/unsupported-country';await s.message('retry');assert.equal(s.navigations[0][2].url,'https://flow.google.com/');
});
test('content scripts cannot issue controls; unknown language rejected',async()=>{
 const s=setup();assert.equal(await s.message('toggle',{enabled:false},{id:'test',tab:{id:10}}),null);
 assert.equal((await s.message('language',{language:'anything'})).ok,false);assert.equal(s.store.enabled,undefined);
});
test('language choice persisted without remote service',async()=>{
 const s=setup();const r=await s.message('language',{language:'en'});assert.equal(r.data.language,'en');assert.equal(s.store.language,'en');
});

test('concurrent toggles keep registration and stored state consistent',async()=>{
 const s=setup({slowDisable:true});await s.message('status');
 await Promise.all([s.message('toggle',{enabled:false}),s.message('toggle',{enabled:true})]);
 const r=await s.message('status');assert.equal(r.data.enabled,true);assert.equal(r.data.registered,true);
});
test('a disappearing tab does not report a successful setting change as failed',async()=>{
 const s=setup({closedTab:true});await s.message('status');
 const r=await s.message('toggle',{enabled:false});assert.equal(r.ok,true);assert.equal(r.data.enabled,false);assert.equal(r.data.registered,false);
});
