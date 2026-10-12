import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const m=JSON.parse(fs.readFileSync('extension/manifest.json','utf8'));
assert.equal(m.manifest_version,3);
assert.deepEqual(m.permissions,['storage','scripting']);
assert.deepEqual(m.host_permissions,['https://flow.google.com/*']);
assert.equal(m.default_locale,'ru');
for(const file of [m.background.service_worker,m.action.default_popup,...Object.values(m.icons),...m.content_scripts.flatMap(x=>x.js),'core.js','page.js','popup/popup.js','popup/strings.js','popup/style.css'])assert.ok(fs.existsSync(path.join('extension',file)),file);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(path.join(dir,f.name)):[path.join(dir,f.name)]);}
for(const file of walk('extension').filter(x=>x.endsWith('.js')))execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
for(const locale of ['ru','en']){
 const messages=JSON.parse(fs.readFileSync(`extension/_locales/${locale}/messages.json`,'utf8'));
 for(const key of ['extensionName','extensionDescription'])assert.ok(messages[key]?.message);
 assert.ok(messages.extensionDescription.message.length<=132,'Chrome description limit');
}
console.log('Manifest, permissions, packaged files, locales and JS syntax validated.');
