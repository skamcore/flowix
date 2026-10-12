const {test}=require('node:test');
const assert=require('node:assert/strict');
const {transform,matches,config}=require('../extension/core.js');
function fixture(value=false,opts={}){
 const fields=Array(opts.short?20:32).fill(null);fields[30]=value;
 if(opts.short)fields.length=20;
 fields[0]=opts.unicode?'Россия 🌊':'test';
 const frame=JSON.stringify([['wrb.fr',opts.method||config.methodId,JSON.stringify(fields)]]);
 const size=(opts.characters?frame.length:Buffer.byteLength(frame))+(opts.padding||0);
 return ")]}'\n\n"+size+'\n'+frame+'\n';
}
test('target only the specific same-origin method',()=>{
 assert.ok(matches(config.origin+config.endpoint+'?rpcids='+config.methodId));
 assert.ok(matches(config.endpoint+'?rpcids='+config.methodId));
 for(const url of ['https://evil.example'+config.endpoint+'?rpcids='+config.methodId,config.endpoint+'?rpcids=other','/other?rpcids='+config.methodId,'http://flow.google.com'+config.endpoint+'?rpcids='+config.methodId])assert.equal(matches(url),false);
});
test('false and null change to true with correct length',()=>{
 for(const flag of [false,null]){
  const r=transform(fixture(flag));assert.equal(r.state,'applied');assert.equal(r.changed,true);
  const rows=r.text.split('\n');assert.equal(Number(rows[2]),Buffer.byteLength(rows[3]));
  assert.equal(JSON.parse(JSON.parse(rows[3])[0][2])[30],true);
 }
});
test('already-true response is byte-identical',()=>{
 const input=fixture(true);const r=transform(input);assert.equal(r.text,input);assert.equal(r.state,'already_allowed');
});
test('UTF-8 and character-length framing with padding',()=>{
 for(const characters of [true,false])for(const padding of [0,1,2]){
  const r=transform(fixture(false,{unicode:true,characters,padding}));assert.equal(r.state,'applied');
  const rows=r.text.split('\n');assert.equal(Number(rows[2]),(characters?rows[3].length:Buffer.byteLength(rows[3]))+padding);
 }
});
test('reject schema changes, malformed data and ambiguous records',()=>{
 for(const input of [fixture('false'),fixture(false,{short:true}),fixture(false).replace('wrb.fr','other'),fixture(false)+fixture(false),fixture(false).replace(/\n\n\d+\n/,'\n\n999999\n')]){
  const r=transform(input);assert.equal(r.changed,false);assert.equal(r.text,input);
 }
});
test('non-text and large responses are not processed',()=>{
 assert.equal(transform(null).changed,false);assert.equal(transform('a'.repeat(2_000_001)).state,'unsupported_response');
});
test('preserve CRLF',()=>{
 const r=transform(fixture().replace(/\n/g,'\r\n'));assert.equal(r.state,'applied');assert.ok(r.text.includes('\r\n'));
});
module.exports={fixture};
