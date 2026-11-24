import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// DOM-stub contract test; browser visual checks are separate.
const listeners={};
const store=new Map();
const root={innerHTML:'',addEventListener(type,handler){listeners[type]=handler;}};
const modal={innerHTML:'',replaceChildren(){this.innerHTML='';}};
globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
globalThis.window={scrollTo(){},addEventListener(){}};
globalThis.location={hash:'#home'};
globalThis.document={documentElement:{dataset:{},lang:'id'},getElementById:id=>({app:root,'modal-root':modal})[id]||null,querySelector:selector=>selector==='meta[name="theme-color"]'?{setAttribute(){}}:null,body:{classList:{add(){},remove(){}},appendChild(){}},createElement(){return {style:{},remove(){},setAttribute(){}};},addEventListener(){}};
globalThis.FormData=class {constructor(form){this.form=form;}entries(){return Object.entries(this.form.fields||{});}};
await import('../src/app.js');
function click(data,attr='action'){
 const el={dataset:data,classList:{contains(){return false;}}};
 listeners.click({target:{closest:selector=>selector===`[data-${attr}]`?el:null}});
}
async function submit(id,fields){await listeners.submit({preventDefault(){},target:{id,fields,querySelector(){return null;}}});}
click({auth:'register'},'auth');
await submit('auth-form',{name:'Nadia',email:'nadia@example.test',username:'nadia',password:'password-123',confirm:'password-123',campus:'Universitas Contoh',nim:''});
click({action:'xp-save',id:'fes-global'});
click({action:'xp-save',id:'essay-europe'});
click({page:'profile'},'page');
click({profileTab:'saved'},'profile-tab');
const savedHTML=root.innerHTML;
assert.equal((savedHTML.match(/gm-archive-opportunity/g)||[]).length,2,'Both saved opportunities use new compact cards');
assert.doesNotMatch(savedHTML,/xp-saved-card-body/, 'Do not keep problematic legacy flex wrapper');
assert.match(savedHTML,/data-action="xp-open-saved"/, 'Details remain accessible');
assert.match(savedHTML,/data-action="xp-save"[^>]*title="Hapus simpanan"/, 'Unsave control uses trash icon and title');
assert.match(savedHTML,/aria-label="Hapus Opportunity Futurepreneur Global Bootcamp 2027 dari simpanan"/, 'Icon-only action has an accessible name');
const targetCss=fs.readFileSync(new URL('../src/archive-fab.css',import.meta.url),'utf8');
assert.match(targetCss,/\.gm-fab-area:has\(\.mobile-fab:active\)/, 'Touch state shows label only while pressed');
assert.match(targetCss,/\.gm-fab-area:hover \.gm-fab-tooltip/, 'Pointer hover shows label');
assert.match(targetCss,/\(hover:hover\) and \(pointer:fine\)/, 'Hover only on hover-capable devices');
assert.match(targetCss,/opacity:0!important;visibility:hidden!important/, 'Tooltip hidden at rest');
click({action:'xp-save',id:'fes-global'});
assert.match(root.innerHTML,/Disimpan \(1\)/,'Unsaving opportunity updates count');
assert.doesNotMatch(root.innerHTML,/data-action="xp-open-saved" data-id="fes-global"/,'Removed opportunity no longer appears');
click({page:'home'},'page');
assert.match(root.innerHTML,/gm-fab-tooltip/, 'Home FAB remains');
click({action:'create-post'});
await submit('post-form',{title:'Diskusi UI',body:'Catatan singkat untuk menguji kartu simpanan.',category:'Lainnya'});
const account=JSON.parse([...store].find(([key])=>key.startsWith('growmate.account.v1.'))[1]);
const newPost=account.posts.find(post=>post.body.includes('Catatan singkat untuk menguji'));
assert.ok(newPost,'Postingan lokal tersimpan');
click({action:'save',id:newPost.id});
click({page:'profile'},'page');click({profileTab:'saved'},'profile-tab');
assert.match(root.innerHTML,/gm-archive-post/,'Saved posts use same compact archive layout');
assert.match(root.innerHTML,/Hapus postingan Diskusi UI dari simpanan/,'Saved post trash has accessible label');
click({action:'save',id:newPost.id});
assert.doesNotMatch(root.innerHTML,/Hapus postingan Diskusi UI dari simpanan/,'Removing saved post updates archive');
click({page:'learning'},'page');
assert.match(root.innerHTML,/gm-fab-tooltip/, 'Learning FAB remains');
click({page:'ask'},'page');
assert.match(root.innerHTML,/xp-floating-tip/, 'Ask space FAB remains');
click({page:'opportunity'},'page');
assert.match(root.innerHTML,/data-action="xp-share"/, 'Opportunity uses hero share CTA');
assert.doesNotMatch(root.innerHTML,/xp-share-fab/, 'Opportunity has no floating redundant CTA');
if (process.env.GM_VISUAL_FIXTURE) {
 // Static screenshot fixture from genuine app markup/styles; not shipped in ZIP.
 const sheets=['styles.css','experiences.css','learning-ux.css','refinements.css','polish.css','upgrades.css','archive-fab.css'];
 const inlineCSS=sheets.map(file=>fs.readFileSync(new URL(`../src/${file}`,import.meta.url),'utf8')).join('\n');
 const fixture=(markup)=>`<!doctype html><html lang="id"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${inlineCSS}</style></head><body><div id="app">${markup}</div></body></html>`;
 const dir=path.dirname(process.env.GM_VISUAL_FIXTURE);
 fs.writeFileSync(process.env.GM_VISUAL_FIXTURE,fixture(savedHTML));
 for(const route of ['home','learning','ask']){
  click({page:route},'page');
  fs.writeFileSync(path.join(dir,`visual-${route}.html`),fixture(root.innerHTML));
 }
}
console.log('PASS: compact saved archive, accessible trash, correct save toggle, hover/touch FAB contract and Opportunity CTA');
