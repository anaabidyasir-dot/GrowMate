import assert from 'node:assert/strict';

import {renderCampusAdmin, readCampusDirectory, campusPublications, renderCampusDialog, handleCampusSubmit, handleCampusClick} from '../src/campus.js';
import {changeLocalEmail, changeLocalPassword} from '../src/account-settings.js';

// Integration checks use the same localStorage API as the actual application.
const store=new Map();
globalThis.localStorage={
 getItem:k=>store.get(k)??null,
 setItem:(k,v)=>store.set(k,String(v)),
 removeItem:k=>store.delete(k)
};
globalThis.document={body:{classList:{add(){},remove(){}}},querySelector(){return null;}};
const toast=()=>{},render=()=>{};
let nextId=0;const createId=prefix=>prefix+'-'+(++nextId);
const admin={me:{name:'Kampus Test',email:'admin@test.dev',role:'campus'}};
const student={me:{name:'Rara',email:'student@test.dev',role:'student',program:'Informatika',semester:'2'}};
assert.match(renderCampusAdmin(admin,{}),/Pengingat untuk mahasiswa|Jadwal kuliah/);
const campus=readCampusDirectory()[0];
assert.ok(campus&&campus.contacts.length===0);
assert.equal(campusPublications(student).alerts.length,0,'Unapproved students must not see publications');
const aui={experience:{campusDialog:'alert',campusEditingId:null}};
assert.match(renderCampusDialog(admin,aui),/campus-alert-form/);
assert.equal(handleCampusSubmit({form:{id:'campus-alert-form'},v:{title:'Info <script>',body:'Periksa informasi KRS'},db:admin,ui:aui,render,toast,createId}),true);
assert.equal(readCampusDirectory()[0].announcements.length,1);
assert.doesNotMatch(renderCampusAdmin(admin,{}),/<script>/,'Campus input must be HTML escaped');
const cuid={experience:{campusDialog:'class'}};
handleCampusSubmit({form:{id:'campus-class-form'},v:{title:'Aljabar Linear',day:'Selasa',time:'09.00–11.00',place:'Kelas 2',topic:'Matriks'},db:admin,ui:cuid,render,toast,createId});
assert.equal(readCampusDirectory()[0].classes.length,1);
assert.equal(campusPublications(student).schedule.length,0);
const requestUi={experience:{selectedCampus:campus.id,campusDialog:'request'}};
handleCampusSubmit({form:{id:'campus-access-form'},v:{name:'Rara',program:'Informatika',semester:'2',reason:'Jadwal kelas'},ui:requestUi,db:student,render,toast,createId});
assert.equal(campusPublications(student).alerts.length,0);
const request=readCampusDirectory()[0].requests[0];
handleCampusClick({el:{dataset:{action:'campus-approve',id:request.id}},ui:{},db:admin,render,toast});
assert.equal(campusPublications(student).alerts[0].title,'Info <script>');
assert.equal(campusPublications(student).schedule[0].title,'Aljabar Linear');
const alertId=readCampusDirectory()[0].announcements[0].id;
const editUi={experience:{campusDialog:'alert',campusEditingId:alertId}};
handleCampusSubmit({form:{id:'campus-alert-form'},v:{title:'KRS diperbarui',body:'Informasi terbaru'},db:admin,ui:editUi,render,toast,createId});
assert.equal(readCampusDirectory()[0].announcements.length,1,'Editing must not duplicate reminders');
assert.equal(campusPublications(student).alerts[0].title,'KRS diperbarui');
handleCampusClick({el:{dataset:{action:'campus-alert-remove',id:alertId}},ui:{},db:admin,render,toast});
assert.equal(campusPublications(student).alerts.length,0);
handleCampusClick({el:{dataset:{action:'campus-revoke',id:request.id}},ui:{},db:admin,render,toast});
assert.equal(campusPublications(student).schedule.length,0,'Revoking access must hide classes');
console.log('PASS: campus publications, editing, escaping, approval and revocation');

async function hashPassword(password,salt){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),{name:'PBKDF2'},false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:120000,hash:'SHA-256'},key,256);
 return [...new Uint8Array(bits)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
const salt='testing-salt';const hash=await hashPassword('current-password',salt);
store.set('growmate.credentials.v2',JSON.stringify({rara:{username:'rara',name:'Rara',email:'student@test.dev',salt,hash,kind:'student'}}));
const account={me:{...student.me},modules:[{id:'module-own',ownerEmail:'student@test.dev'}],opportunities:[{id:'opp-own',ownerEmail:'student@test.dev'}],askGroups:[{id:'group-own',ownerEmail:'student@test.dev'}],posts:[],settings:{theme:'dark',language:'en'}};
store.set('growmate.account.v1.student%40test.dev',JSON.stringify(account));
store.set('growmate.session.v1',JSON.stringify({email:'student@test.dev',name:'Rara'}));
await assert.rejects(changeLocalPassword(account,'incorrect','new-password-123','new-password-123'),/tidak cocok/);
await changeLocalPassword(account,'current-password','new-password-123','new-password-123');
const newCredentials=JSON.parse(store.get('growmate.credentials.v2'));
assert.notEqual(newCredentials.rara.hash,hash,'Password hash must change');
await assert.rejects(changeLocalEmail(account,'current-password','new@test.dev'),/tidak cocok/);
const next=await changeLocalEmail(account,'new-password-123','new@test.dev');
assert.equal(next.me.email,'new@test.dev');
assert.equal(next.modules[0].ownerEmail,'new@test.dev');
assert.equal(next.opportunities[0].ownerEmail,'new@test.dev');
assert.equal(next.askGroups[0].ownerEmail,'new@test.dev');
assert.equal(JSON.parse(store.get('growmate.session.v1')).email,'new@test.dev');
assert.equal(store.has('growmate.account.v1.student%40test.dev'),false);
assert.equal(JSON.parse(store.get('growmate.credentials.v2')).rara.email,'new@test.dev');
assert.equal(readCampusDirectory()[0].requests[0].email,'new@test.dev');
assert.equal(next.settings.theme,'dark');
console.log('PASS: password verification, account email migration, ownership, session and campus references');
