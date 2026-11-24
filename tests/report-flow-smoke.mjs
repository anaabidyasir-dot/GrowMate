import assert from 'node:assert/strict';

const events = {}, records = new Map();
const root = {innerHTML:'', addEventListener(type, listener){events[type] = listener;}};
const modal = {innerHTML:'',replaceChildren(){this.innerHTML='';}};
globalThis.localStorage = {getItem:key=>records.get(key)??null,setItem:(key,value)=>records.set(key,String(value)),removeItem:key=>records.delete(key)};
globalThis.window = {addEventListener(){},scrollTo(){}};
globalThis.location = {href:'http://localhost:3000/#home',search:'',hash:'#home'};
globalThis.document = {documentElement:{dataset:{},setAttribute(){}},getElementById(id){return ({app:root,'modal-root':modal})[id]??null;},querySelector(selector){return selector==='.modal-panel'?{focus(){}}:null;},body:{classList:{add(){},remove(){}},appendChild(){}},createElement(){return {style:{},remove(){},setAttribute(){}};},addEventListener(){}};
globalThis.FormData = class {constructor(form){this.form=form;}entries(){return Object.entries(this.form.fields??{});}};
await import('../src/app.js');
function click(data,kind='action'){
  const el={dataset:data,classList:{contains(){return false;}}};
  const target={closest(selector){return selector===`[data-${kind}]`?el:null;}};
  events.click({target});
}
async function submit(id, fields){await events.submit({preventDefault(){},target:{id,fields,querySelector(){return {checked:false};}}});}
function db(){return JSON.parse([...records].find(([key])=>key.startsWith('growmate.account.v1.'))[1]);}
async function report(kind,id,hide){
  click({action:'community-report',kind,id});
  assert.match(root.innerHTML,/community-report-form/);
  await submit('community-report-form',{reason:'Spam atau promosi berulang',details:'Contoh laporan uji'});
  assert.match(modal.innerHTML,/community-report-hide-yes/);
  assert.match(modal.innerHTML,/community-report-hide-no/);
  click({action:hide?'community-report-hide-yes':'community-report-hide-no'});
}
click({auth:'register'},'auth');
await submit('auth-form',{name:'Tester Komunitas',email:'tester@example.test',username:'tester',password:'test-password-123',confirm:'test-password-123'});
assert.doesNotMatch(root.innerHTML,/data-action="community-hide"/,'hide actions are not displayed on post cards');
const initialPosts=db().posts.length;
await report('post','p1',false);
assert.equal(db().community.reports.length,1);
assert.equal(db().community.hidden.length,0,'No keeps reported post visible');
await report('post','p2',true);
assert.equal(db().community.hidden.some(entry=>entry.id==='p2'),true,'Yes hides reported post');
assert.equal(db().posts.length,initialPosts,'Hiding does not destroy posts');
click({page:'learning'},'page');
assert.doesNotMatch(root.innerHTML,/data-action="community-hide"/);
await report('material','m3',true);
assert.equal(db().community.hidden.some(entry=>entry.id==='m3'),true);
click({page:'opportunity'},'page');
assert.doesNotMatch(root.innerHTML,/data-action="community-hide"/);
assert.doesNotMatch(root.innerHTML,/Kompetisi Desain Antarmuka Mahasiswa|Diskusi Karier dan Portofolio Mahasiswa/);
await report('opportunity','fes-global',true);
assert.equal(db().community.hidden.some(entry=>entry.id==='fes-global'),true);
click({page:'home'},'page');
click({action:'peer',id:'almira'});
assert.match(modal.innerHTML,/Pengikut/);
assert.match(modal.innerHTML,/82<\/strong>/,'illustrative baseline followers appears in peer profile');
click({action:'peer-follow',id:'almira'});
assert.match(modal.innerHTML,/83<\/strong>/,'local follow updates illustrative count');
await report('user','almira',true);
assert.equal(db().community.blocked.includes('almira'),true,'Report-and-block removes member from view');
assert.equal(db().following.includes('almira'),false,'Block also removes local follow');
click({page:'settings'},'page');
click({action:'history-tab',value:'blocked'});
assert.match(root.innerHTML,/Tampilkan lagi/);
click({action:'community-unhide',kind:'post',id:'p2'});
assert.equal(db().community.hidden.some(entry=>entry.id==='p2'),false,'Restoring hidden content still works');
assert.equal(db().community.reports.length,5);
console.log('PASS: report -> optional hide/block for post, material, opportunity, account; follower count; no direct hide buttons; history restore');
