import { escapeHTML as h, saveAccount } from './storage.js';

// The directory lives in localStorage until GrowMate has an authenticated backend.
const STORE = 'growmate.campus.directory.v1';
const clean = (v, max = 90) => String(v ?? '').trim().slice(0, max);
const slug = v => clean(v).toLocaleLowerCase('id-ID').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 65);
const access = (ui) => ui.experience || (ui.experience = {});
// These three illustrative contact types are visible without institutional access.
// They never impersonate verified people or a connected campus account.
const EXAMPLE_CONTACTS = [
  {id:'example-campus:academic',name:'Layanan akademik',subtitle:'Jadwal, KRS, dan administrasi',category:'Campus'},
  {id:'example-campus:lecturer',name:'Dosen pembimbing',subtitle:'Bimbingan dan konsultasi akademik',category:'Campus'},
  {id:'example-campus:student',name:'Bagian kemahasiswaan',subtitle:'Kegiatan dan informasi mahasiswa',category:'Campus'}
];
export function exampleCampusContacts() { return EXAMPLE_CONTACTS.map(contact => ({...contact})); }


export function readCampusDirectory() {
  try {
    const value = JSON.parse(localStorage.getItem(STORE) || '[]');
    return Array.isArray(value) ? value.filter(c => c && typeof c.id === 'string' && Array.isArray(c.contacts) && Array.isArray(c.requests)) : [];
  } catch { return []; }
}
function writeDirectory(list) {
  try { localStorage.setItem(STORE, JSON.stringify(list)); return true; }
  catch { return false; }
}
function ownCampus(list, db) {
  return list.find(c => c.ownerEmail === db.me.email && db.me.role === 'campus');
}
function ensureCampus(list, db) {
  if (db.me.role !== 'campus') return null;
  let campus = ownCampus(list, db);
  if (!campus) {
    campus = { id: 'campus-' + slug(db.me.name), name: clean(db.me.name), ownerEmail: db.me.email, contacts: [], requests: [], announcements: [], classes: [] };
    if (list.some(c => c.id === campus.id)) campus.id += '-' + list.length;
    list.push(campus);
    writeDirectory(list);
  }
  return campus;
}
// Campus publications only appear for approved students (or the campus's own admin).
// This local-browser directory is never presented as a verified university integration.
export function linkedCampuses(db) {
  return readCampusDirectory().filter(c => (db.me.role === 'campus' && c.ownerEmail === db.me.email) ||
    c.requests.some(r => r.email === db.me.email && r.status === 'approved'));
}
export function campusPublications(db) {
  const campuses = linkedCampuses(db);
  return {
    alerts: campuses.flatMap(c => (c.announcements || []).map(x => ({...x, id:`campus-alert:${c.id}:${x.id}`, campusName:c.name, accent:'blue'}))),
    schedule: campuses.flatMap(c => (c.classes || []).map(x => ({...x, id:`campus-class:${c.id}:${x.id}`, campusName:c.name})))
  };
}

export function campusContacts(db) {
  const list = readCampusDirectory();
  const visible = [];
  for (const c of list) {
    if (db.me.role === 'campus' && db.me.email === c.ownerEmail || c.requests.some(r => r.email === db.me.email && r.status === 'approved')) {
      for (const x of c.contacts) visible.push({ id: 'campus:' + c.id + ':' + x.id, name: x.name, category: 'Campus', subtitle: c.name + ' · ' + x.department, color: '#e8f1f8', ink: '#185c80' });
    }
  }
  return visible;
}
export function renderCampusAccess(db, ui) {
 const s=access(ui), list=readCampusDirectory(), expanded=s.campusExpanded!==false;
 const verified=campusContacts(db);
 return `<section class="xp-campus-box">
   <button class="xp-campus-toggle" type="button" data-action="campus-expand" aria-expanded="${expanded}">
     <span class="xp-campus-symbol" aria-hidden="true">▦</span>
     <span><strong>Ruang kampus</strong><small>Tanya layanan dan informasi akademik</small></span>
     <span class="xp-toggle-chevron" aria-hidden="true">${expanded?'⌃':'⌄'}</span>
   </button>
   ${expanded?`<div class="xp-campus-inside">
     <div class="xp-campus-contact-items" aria-label="Contoh kontak layanan kampus">
       ${EXAMPLE_CONTACTS.map(x=>`<button type="button" class="xp-campus-contact" data-action="xp-chat" data-id="${h(x.id)}"><span class="xp-campus-mini-avatar">${h(x.name.split(' ').map(y=>y[0]).join('').slice(0,2).toUpperCase())}</span><span><strong>${h(x.name)}</strong><small>${h(x.subtitle)}</small></span><span class="xp-campus-contact-chevron" aria-hidden="true">›</span></button>`).join('')}
     </div>
     ${verified.length?`<p class="xp-campus-subheading">Kontak dari kampus yang kamu akses</p>${verified.map(x=>`<button type="button" class="xp-campus-contact" data-action="xp-chat" data-id="${h(x.id)}"><span class="xp-campus-mini-avatar">KM</span><span><strong>${h(x.name)}</strong><small>${h(x.subtitle)}</small></span><span aria-hidden="true">›</span></button>`).join('')}`:''}
     ${list.length?`<div class="xp-campus-access-list"><p class="xp-campus-subheading">Akses institusi</p>${list.map(c=>{const own=db.me.role==='campus'&&db.me.email===c.ownerEmail,request=c.requests.find(r=>r.email===db.me.email),allowed=own||request?.status==='approved';return `<div class="xp-campus-entry"><div class="xp-campus-entry-top"><strong>${h(c.name)}</strong><small>${c.contacts.length} kontak</small></div>${allowed?`<p class="xp-campus-help">Akses aktif. Kontak tersedia dalam daftar di atas.</p>`:`<p class="xp-campus-help">${request?.status==='pending'?'Permintaan akses sedang ditinjau.':request?.status==='rejected'?'Permintaan terakhir tidak disetujui.':'Ajukan chat agar admin kampus dapat menambahkan akunmu ke daftar kontak.'}</p><button class="btn btn-outline btn-small" data-action="campus-request" data-id="${h(c.id)}" ${request?.status==='pending'?'disabled':''}>${request?.status==='pending'?'Menunggu tinjauan':'Ajukan chat'}</button>`}</div>`}).join('')}</div>`:''}
     ${!list.length&&db.me.role!=='campus'?`<div class="xp-campus-access-list gm-campus-chat-request"><p class="xp-campus-subheading">Belum ada institusi terhubung</p><p class="xp-campus-help">Kamu bisa menyiapkan permintaan chat ke layanan kampus. Permintaan disimpan di akun lokal sampai institusi bergabung.</p><button type="button" class="btn btn-outline btn-small" data-action="campus-example-request">Ajukan chat</button>${db.campusChatRequests?.length?`<small>${db.campusChatRequests.length} permintaan dicatat</small>`:''}</div>`:''}
     <p class="xp-campus-example-note">Contoh kontak untuk eksplorasi. Pesan belum terkirim ke layanan kampus sungguhan.</p>
   </div>`:''}
 </section>`;
}
export function renderCampusAdmin(db, ui) {
  const list = readCampusDirectory();
  const c = ensureCampus(list, db);
  if (!c) return '<main class="inner-page xp-page"><h1>Hanya untuk akun kampus</h1></main>';
  const waiting = c.requests.filter(r => r.status === 'pending');
  const admitted = c.requests.filter(r => r.status === 'approved');
  return `<main class="inner-page xp-page xp-admin"><header class="xp-heading"><div><p class="eyebrow">PENGELOLAAN INSTITUSI</p><h1>Admin kampus</h1><p>Kelola direktori layanan dan permintaan akses mahasiswa dari satu tempat.</p></div></header>
  <section class="xp-admin-intro"><div><span class="xp-admin-overline">DIREKTORI KAMPUS</span><h2>${h(c.name)}</h2><p>Informasi yang dicantumkan di sini dapat diakses mahasiswa setelah permintaannya disetujui.</p></div><button class="btn btn-primary" data-action="campus-contact-add">Tambah kontak</button></section>
  <div class="xp-admin-stats"><div><strong>${c.contacts.length}</strong><span>Kontak tersedia</span></div><div><strong>${waiting.length}</strong><span>Perlu ditinjau</span></div><div><strong>${admitted.length}</strong><span>Mahasiswa mendapat akses</span></div></div>
  <section class="xp-admin-section gm-admin-publish"><div class="xp-section-head"><div><h2>Pengingat untuk mahasiswa</h2><p>Pengumuman tampil di Beranda mahasiswa yang sudah disetujui.</p></div><button class="btn btn-outline btn-small" data-action="campus-alert-add">Tambah pengingat</button></div>
    ${(c.announcements||[]).length ? c.announcements.map(x=>`<article class="xp-admin-row"><div><strong>${h(x.title)}</strong><p>${h(x.body)}</p></div><div class="gm-admin-actions"><button class="btn btn-outline btn-small" data-action="campus-alert-edit" data-id="${h(x.id)}">Edit</button><button class="xp-delete-link" data-action="campus-alert-remove" data-id="${h(x.id)}">Hapus</button></div></article>`).join('') : '<div class="xp-admin-empty">Belum ada pengingat kampus.</div>'}
  </section>
  <section class="xp-admin-section gm-admin-publish"><div class="xp-section-head"><div><h2>Jadwal kuliah</h2><p>Jadwal yang ditambahkan tampil untuk mahasiswa dengan akses kampus yang disetujui.</p></div><button class="btn btn-outline btn-small" data-action="campus-class-add">Tambah jadwal</button></div>
    ${(c.classes||[]).length ? c.classes.map(x=>`<article class="xp-admin-row"><div><strong>${h(x.title)}</strong><small>${h(x.day||'')} · ${h(x.time)} · ${h(x.place)}</small><p>${h(x.topic||'')}</p></div><div class="gm-admin-actions"><button class="btn btn-outline btn-small" data-action="campus-class-edit" data-id="${h(x.id)}">Edit</button><button class="xp-delete-link" data-action="campus-class-remove" data-id="${h(x.id)}">Hapus</button></div></article>`).join('') : '<div class="xp-admin-empty">Belum ada jadwal kampus.</div>'}
  </section>
  <section class="xp-admin-section"><div class="xp-section-head"><div><h2>Permintaan akses</h2><p>Periksa data yang diajukan sebelum memberi akses.</p></div></div>${waiting.length ? waiting.map(r => `<article class="xp-admin-row"><div><strong>${h(r.name)}</strong><small>${h(r.email)} · ${h(r.program)} · ${h(r.semester)}</small>${r.studentNumber ? `<small>Nomor mahasiswa: ${h(r.studentNumber)}</small>` : ''}<p>${h(r.reason)}</p></div><div class="xp-admin-row-actions"><button class="btn btn-primary btn-small" data-action="campus-approve" data-id="${h(r.id)}">Setujui</button><button class="btn btn-outline btn-small" data-action="campus-reject" data-id="${h(r.id)}">Tolak</button></div></article>`).join('') : '<div class="xp-admin-empty">Tidak ada permintaan baru.</div>'}</section>
  <section class="xp-admin-section"><div class="xp-section-head"><div><h2>Daftar kontak kampus</h2><p>Tambahkan biro akademik, dosen, atau layanan yang boleh dihubungi mahasiswa.</p></div><button class="btn btn-outline btn-small" data-action="campus-contact-add">Tambah kontak</button></div>${c.contacts.length ? c.contacts.map(x => `<article class="xp-admin-row"><div><strong>${h(x.name)}</strong><small>${h(x.department)}</small><p>${h(x.description)}</p></div><button class="xp-delete-link" data-action="campus-contact-remove" data-id="${h(x.id)}" aria-label="Hapus ${h(x.name)}">Hapus</button></article>`).join('') : '<div class="xp-admin-empty">Belum ada kontak. Tambahkan kontak pertama untuk membangun direktori kampus.</div>'}</section>
  <section class="xp-admin-section"><div class="xp-section-head"><div><h2>Akses diberikan</h2><p>Kelola mahasiswa yang sudah disetujui.</p></div></div>${admitted.length ? admitted.map(r => `<article class="xp-admin-row"><div><strong>${h(r.name)}</strong><small>${h(r.email)} · ${h(r.program)}</small></div><button class="xp-delete-link" data-action="campus-revoke" data-id="${h(r.id)}">Cabut akses</button></article>`).join('') : '<div class="xp-admin-empty">Belum ada mahasiswa yang disetujui.</div>'}</section>
  <p class="xp-footnote">Direktori dan persetujuan akses disimpan pada browser ini. Identitas institusi belum diverifikasi melalui server.</p></main>`;
}
export function renderCampusDialog(db, ui) {
  const s = access(ui), list = readCampusDirectory();
  if (s.campusDialog === 'contact' && db.me.role === 'campus') return `<div class="xp-curtain" data-action="campus-close"><section class="xp-dialog" role="dialog" aria-modal="true" aria-label="Tambah kontak kampus" tabindex="-1"><div class="xp-dialog-head"><h2>Tambah kontak kampus</h2><button class="xp-x-button" data-action="campus-close" aria-label="Tutup" title="Tutup">×</button></div><form id="campus-contact-form" class="xp-form"><label>Nama kontak atau layanan<input name="name" required maxlength="90" placeholder="Contoh: Biro Akademik Fakultas Teknik"></label><label>Jenis kontak<select name="department"><option>Akademik</option><option>Dosen</option><option>Kemahasiswaan</option><option>Administrasi</option><option>Lainnya</option></select></label><label>Keterangan singkat<textarea name="description" maxlength="300" rows="3" placeholder="Apa saja yang dapat ditanyakan?" required></textarea></label><button class="btn btn-primary" type="submit">Simpan kontak</button></form></section></div>`;
  if ((s.campusDialog === 'alert' || s.campusDialog === 'class') && db.me.role === 'campus') {
    const c = ownCampus(list, db);
    if (!c) return '';
    const isAlert = s.campusDialog === 'alert', collection = isAlert ? (c.announcements || []) : (c.classes || []);
    const item = collection.find(x => x.id === s.campusEditingId), title = isAlert ? 'pengingat' : 'jadwal kuliah';
    return `<div class="xp-curtain" data-action="campus-close"><section class="xp-dialog" role="dialog" aria-modal="true" aria-label="${item?'Edit':'Tambah'} ${title}" tabindex="-1"><div class="xp-dialog-head"><h2>${item?'Edit':'Tambah'} ${title}</h2><button class="xp-x-button" data-action="campus-close" aria-label="Tutup" title="Tutup">×</button></div><form id="campus-${isAlert?'alert':'class'}-form" class="xp-form">
      <label>${isAlert?'Judul pengingat':'Nama mata kuliah'}<input name="title" maxlength="100" required value="${h(item?.title||'')}" placeholder="${isAlert?'Contoh: Pendaftaran KRS dibuka':'Contoh: Algoritma & Pemrograman'}"></label>
      ${isAlert?'':`<div class="xp-two-col"><label>Hari<select name="day">${['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'].map(day=>`<option ${day===item?.day?'selected':''}>${day}</option>`).join('')}</select></label><label>Waktu<input name="time" required maxlength="35" placeholder="08.00–09.40" value="${h(item?.time||'')}"></label></div><label>Ruang / tempat<input name="place" required maxlength="80" value="${h(item?.place||'')}" placeholder="Contoh: Gedung A-201"></label>`}
      <label>${isAlert?'Isi pengingat':'Topik / keterangan'}<textarea name="${isAlert?'body':'topic'}" rows="3" maxlength="${isAlert?350:200}" ${isAlert?'required':''} placeholder="${isAlert?'Informasi singkat untuk mahasiswa':'Materi kuliah (opsional)'}">${h(isAlert?item?.body||'':item?.topic||'')}</textarea></label>
      <div class="xp-dialog-actions"><button type="button" class="btn btn-outline" data-action="campus-close">Batal</button><button class="btn btn-primary" type="submit">Simpan ${title}</button></div><p class="xp-footnote">Informasi hanya dibagikan pada akun yang terhubung di browser yang sama. Bukan sinkronisasi sistem akademik resmi.</p>
    </form></section></div>`;
  }
  if (s.campusDialog === 'example-request')return `<div class="xp-curtain" data-action="campus-close"><section class="xp-dialog" role="dialog" aria-modal="true" aria-label="Ajukan chat kampus" tabindex="-1"><div class="xp-dialog-head"><h2>Ajukan chat</h2><button class="xp-x-button" data-action="campus-close" aria-label="Tutup" title="Tutup">×</button></div><form id="campus-example-chat-form" class="xp-form"><p class="xp-dialog-info">Pilih layanan yang ingin kamu hubungi. Permintaan disimpan dalam akunmu hingga ada institusi terhubung.</p><label>Tujuan chat<select name="service" required>${EXAMPLE_CONTACTS.map(x=>`<option value="${h(x.id)}">${h(x.name)}</option>`).join('')}</select></label><label>Pesan singkat<textarea name="message" maxlength="350" required rows="4" placeholder="Saya ingin menanyakan ..."></textarea></label><div class="xp-dialog-actions"><button class="btn btn-outline" type="button" data-action="campus-close">Batal</button><button class="btn btn-primary" type="submit">Simpan permintaan</button></div><p class="xp-footnote">Belum dikirim ke layanan kampus. Hanya tersimpan di perangkat ini.</p></form></section></div>`;
  if (s.campusDialog === 'request') {
    const c = list.find(x => x.id === s.selectedCampus);
    if (!c) return '';
    return `<div class="xp-curtain" data-action="campus-close"><section class="xp-dialog" role="dialog" aria-modal="true" aria-label="Ajukan chat kampus" tabindex="-1"><div class="xp-dialog-head"><h2>Ajukan chat ke ${h(c.name)}</h2><button class="xp-x-button" data-action="campus-close" aria-label="Tutup" title="Tutup">×</button></div><form id="campus-access-form" class="xp-form"><p class="xp-dialog-info">Admin kampus akan meninjau permintaan chat dan dapat menambahkan akunmu ke direktori kontak bila disetujui.</p><label>Nama lengkap<input name="name" required maxlength="90" value="${h(db.me.name)}"></label><label>Program studi<input name="program" required maxlength="90" value="${h(db.me.program || '')}" placeholder="Contoh: Informatika"></label><div class="xp-two-col"><label>Semester<input name="semester" required maxlength="30" value="${h(db.me.semester || '')}"></label><label>NIM (opsional)<input name="studentNumber" maxlength="35" value="${h(db.me.nim || '')}"></label></div><label>Pesan untuk admin kampus<textarea name="reason" required maxlength="400" rows="3" placeholder="Contoh: Saya membutuhkan informasi pengajuan surat akademik."></textarea></label><button class="btn btn-primary" type="submit">Ajukan chat</button><p class="xp-footnote">Dalam versi lokal, permintaan hanya dapat ditinjau oleh akun admin di browser yang sama. Jangan gunakan data mahasiswa asli untuk pengujian.</p></form></section></div>`;
  }
  return '';
}
export function handleCampusClick({el, event, ui, db, render, toast}) {
  const action = el?.dataset?.action;
  if (!action?.startsWith('campus-')) return false;
  const s = access(ui), list = readCampusDirectory(), c = ownCampus(list, db);
  const id = el.dataset.id;
  switch (action) {
    case 'campus-expand': s.campusExpanded = !s.campusExpanded; break;
    case 'campus-close': if (el.classList?.contains('xp-curtain') && el !== event?.target) return true; s.campusDialog = null; document.body?.classList?.remove('modal-open'); break;
    case 'campus-example-request':s.campusDialog='example-request';document.body?.classList?.add('modal-open');break;
    case 'campus-request': if (!list.some(x=>x.id===id)) return true; s.selectedCampus = id; s.campusDialog = 'request'; document.body?.classList?.add('modal-open'); break;
    case 'campus-contact-add': if(!c) return true; s.campusDialog = 'contact'; document.body?.classList?.add('modal-open'); break;
    case 'campus-alert-add': case 'campus-class-add': case 'campus-alert-edit': case 'campus-class-edit': {
      if (!c) return true;
      const kind=action.includes('alert')?'alert':'class';
      s.campusEditingId=action.endsWith('edit')?id:null;
      if (s.campusEditingId && !(kind==='alert'?(c.announcements||[]):(c.classes||[])).some(x=>x.id===id)) return true;
      s.campusDialog=kind;document.body?.classList?.add('modal-open');break;
    }
    case 'campus-alert-remove': case 'campus-class-remove': {
      if (!c) return true;
      if (typeof globalThis.confirm === 'function' && !globalThis.confirm('Hapus informasi ini dari daftar kampus?')) return true;
      const key=action.includes('alert')?'announcements':'classes';
      c[key]=(c[key]||[]).filter(x=>x.id!==id);
      if (!writeDirectory(list)) toast('Perubahan gagal disimpan.');break;
    }
    case 'campus-approve': case 'campus-reject': case 'campus-revoke': {
      if (!c) return true;
      const r = c.requests.find(x => x.id === id);
      if (!r) return true;
      r.status = action === 'campus-approve' ? 'approved' : action === 'campus-revoke' ? 'revoked' : 'rejected';
      if (!writeDirectory(list)) toast('Data kampus gagal disimpan.');
      break;
    }
    case 'campus-contact-remove': {
      if (!c) return true;
      c.contacts = c.contacts.filter(x => x.id !== id);
      if (!writeDirectory(list)) toast('Data kampus gagal disimpan.');
      break;
    }
    default: return false;
  }
  render();
  if (s.campusDialog) document.querySelector('.xp-dialog')?.focus();
  return true;
}
export function handleCampusSubmit({form, v, ui, db, render, toast, createId}) {
  if (!['campus-example-chat-form','campus-access-form','campus-contact-form','campus-alert-form','campus-class-form'].includes(form.id)) return false;
  const s = access(ui), list = readCampusDirectory();
  if(form.id==='campus-example-chat-form'){
    const service=clean(v.service,90),message=clean(v.message,350);
    if(!EXAMPLE_CONTACTS.some(x=>x.id===service)||!message){toast('Pilih layanan dan tulis pesan singkat.');return true;}
    db.campusChatRequests ||= [];
    db.campusChatRequests.unshift({id:createId('campus-chat'),service,message,at:new Date().toISOString(),status:'local'});
    db.campusChatRequests=db.campusChatRequests.slice(0,20);
    saveAccount(db);s.campusDialog=null;document.body?.classList?.remove('modal-open');render();toast('Permintaan chat disimpan. Menunggu kampus terhubung.');return true;
  }
  if (form.id === 'campus-alert-form' || form.id === 'campus-class-form') {
    const c=ownCampus(list,db);if (!c) return true;
    const isAlert=form.id==='campus-alert-form',key=isAlert?'announcements':'classes';
    const title=clean(v.title,100),body=clean(v.body,350),time=clean(v.time,35),place=clean(v.place,80);
    if(!title || (isAlert?!body:(!time||!place))) {toast('Lengkapi informasi wajib.');return true;}
    const values=isAlert?{title,body}:{title,day:clean(v.day,20),time,place,topic:clean(v.topic,200)};
    c[key] ||= [];
    const existing=c[key].find(x=>x.id===s.campusEditingId);
    if(existing) Object.assign(existing,values);
    else c[key].push({id:createId(isAlert?'alert':'class'),...values});
  } else if (form.id === 'campus-contact-form') {
    const c = ownCampus(list, db);
    if (!c) return true;
    if (!clean(v.name) || !clean(v.description, 300)) { toast('Isi nama dan keterangan kontak.'); return true; }
    c.contacts.push({id: createId('contact'), name: clean(v.name), department: clean(v.department, 40), description: clean(v.description, 300)});
  } else {
    const c = list.find(x => x.id === s.selectedCampus);
    if (!c || db.me.role === 'campus') return true;
    if (!clean(v.name) || !clean(v.program) || !clean(v.reason, 400) || !clean(v.semester,30)) {toast('Lengkapi data pengajuan.'); return true;}
    const existing = c.requests.find(x => x.email === db.me.email);
    if (existing?.status === 'approved' || existing?.status === 'pending') return true;
    if (existing) c.requests = c.requests.filter(x => x.email !== db.me.email);
    c.requests.push({id:createId('access'), email:db.me.email, name:clean(v.name), program:clean(v.program), semester:clean(v.semester,30), studentNumber:clean(v.studentNumber,35), reason:clean(v.reason,400), status:'pending'});
  }
  if (!writeDirectory(list)) {toast('Penyimpanan direktori tidak tersedia.');return true;}
  s.campusDialog = null; document.body?.classList?.remove('modal-open'); render();
  toast(form.id === 'campus-contact-form' ? 'Kontak kampus ditambahkan.' : form.id==='campus-access-form' ? 'Permintaan chat dicatat. Menunggu persetujuan admin kampus di perangkat ini.' : 'Informasi kampus disimpan pada browser ini.');
  return true;
}
export function closeCampusDialog(ui) { if (ui.experience) ui.experience.campusDialog = null; }
