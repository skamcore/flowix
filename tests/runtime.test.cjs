const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const core=require('../extension/core.js');
function frame(){const a=Array(32).fill(null);a[30]=false;const s=JSON.stringify([['wrb.fr','cPZSdc',JSON.stringify(a)]]);return ")]}'\n"+Buffer.byteLength(s)+'\n'+s+'\n';}
function sandbox(){
 const input=frame();let attribute;
 class XHR {open(){} }
 for(const key of ['response','responseText'])Object.defineProperty(XHR.prototype,key,{configurable:true,get(){return input;}});
 const window={fetch:async()=>new Response(input,{status:200,headers:{'content-type':'application/json'}}),addEventListener(){}};
 const context={__flowixCore:core,window,document:{documentElement:{setAttribute(_key,value){attribute=value;}},addEventListener(){}},XMLHttpRequest:XHR,location:{href:core.config.origin+'/',origin:core.config.origin},URL,Response,Headers};
 vm.runInNewContext(fs.readFileSync('extension/page.js','utf8'),context);
 return {window,XHR,input,status:()=>JSON.parse(attribute)};
}
const url=core.config.origin+core.config.endpoint+'?rpcids='+core.config.methodId;
test('first XHR is patched without asynchronous settings',()=>{
 const s=sandbox(),xhr=new s.XHR();xhr.readyState=4;xhr.status=200;xhr.open('POST',url);
 assert.notEqual(xhr.responseText,s.input);assert.equal(xhr.response,xhr.responseText);assert.equal(s.status().modified,1);
});
test('partial response withheld, unrelated XHR and errors untouched',()=>{
 const s=sandbox(),xhr=new s.XHR();xhr.readyState=3;xhr.status=200;xhr.open('POST',url);assert.equal(xhr.responseText,'');
 xhr.readyState=4;xhr.status=403;assert.equal(xhr.responseText,s.input);
 xhr.status=200;xhr.open('POST','https://example.com');assert.equal(xhr.responseText,s.input);
});
test('Fetch string, URL and Request receive the same adjustment',async()=>{
 for(const request of [url,new URL(url),new Request(url,{method:'POST'})]){
  const s=sandbox();const r=await s.window.fetch(request,request instanceof Request?undefined:{method:'POST'});
  assert.notEqual(await r.text(),s.input);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'application/json');assert.equal(s.status().transport,'fetch');
 }
});
test('unrelated fetch stays original',async()=>{
 const s=sandbox();assert.equal(await (await s.window.fetch('https://example.com',{method:'POST'})).text(),s.input);
});
test('install only once in a document',()=>{
 const s=sandbox();const original=s.window.fetch;
 const c={window:s.window,__flowixCore:core};vm.runInNewContext(fs.readFileSync('extension/page.js','utf8'),c);assert.equal(s.window.fetch,original);
});
