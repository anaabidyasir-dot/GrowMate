import { CATEGORIES, PEERS } from './data.js';
import { escapeHTML as h } from './storage.js';

export function ownsMaterial(material, account) {
  return material?.authorId === 'me' || material?.ownerEmail === account?.me?.email ||
    (typeof material?.id === 'string' && material.id.startsWith('module-') && !material.authorId && !material.ownerEmail);
}

export function authorFor(material, account) {
  if (ownsMaterial(material, account)) {
    const me = account.me;
    return {name:me.name, subtitle:me.program || 'Mahasiswa', avatar:me.avatar || '', isSelf:true};
  }
  const sampleOwners={m1:'kenzie',m2:'aurelia',m3:'damian',m4:'kenzie',m5:'damian'};
  const peer = PEERS.find(person => person.id === (material?.authorId || sampleOwners[material?.id]));
  return peer ? {name:peer.name, subtitle:peer.program, avatar:peer.avatar, isSelf:false} :
    {name:'Kontributor GrowMate', subtitle:'Materi komunitas', avatar:'', isSelf:false};
}

export function ratingFor(material, account) {
  const value = Number(account?.moduleRatings?.[material.id] || 0);
  // Until there is a shared backend, ratings are only the current account's local rating.
  return {score:value>=1 && value<=5 ? Math.round(value) : 0, count:value>=1&&value<=5?1:0};
}

export function authorMarkup(material, account, compact=false) {
  const a=authorFor(material, account);
  const name=h(a.name), role=h(a.subtitle);
  const initials=h(a.name.split(/\s+/).slice(0,2).map(part=>part.charAt(0)).join('').toUpperCase());
  return `<div class="gm-author ${compact?'gm-author--compact':''}"><span class="gm-author-avatar">${a.avatar?`<img src="${h(a.avatar)}" alt="" loading="lazy">`:`<span>${initials}</span>`}</span><span class="gm-author-copy"><strong>${name}</strong><small>${role}</small></span>${a.isSelf?'<span class="gm-self-label">Kamu</span>':''}</div>`;
}

export function ratingMarkup(material, account, interactive=false) {
  const {score,count}=ratingFor(material,account),self=ownsMaterial(material,account);
  if (!interactive) {
    return `<span class="gm-rating" aria-label="${count?`Penilaian pribadimu ${score} dari 5 bintang`:'Belum ada penilaian'}"><span aria-hidden="true" class="gm-rating-star">${count?'★':'☆'}</span><span>${count?`${score},0 · Penilaianmu`:'Belum dinilai'}</span></span>`;
  }
  const buttons=Array.from({length:5},(_,i)=>{
    const n=i+1,filled=n<=score;
    return `<button type="button" data-action="material-rate" data-id="${h(material.id)}" data-score="${n}" ${self?'disabled title="Tidak dapat menilai materi sendiri"':''} aria-pressed="${score===n}" aria-label="Beri ${n} dari 5 bintang" class="gm-star-button ${filled?'is-filled':''}">${filled?'★':'☆'}</button>`;
  }).join('');
  return `<section class="gm-rating-panel" aria-label="Penilaian materi"><div><strong>Penilaian materi</strong><p>${self?'Kamu tidak bisa menilai materi yang kamu unggah.':count?`Penilaianmu: ${score} dari 5 bintang. Kamu bisa mengubahnya.`:'Belum ada penilaian. Beri nilai setelah mempelajari materinya.'}</p></div><div class="gm-star-controls" role="group" aria-label="Beri penilaian">${buttons}</div></section>`;
}

function chapterInput(value, index) {
  return `<div class="gm-chapter-field"><label><span>Bab ${index+1}</span><input name="chapter_${index}" maxlength="140" value="${h(value)}" placeholder="Contoh: Dasar percabangan if dan else" required></label><button class="gm-chapter-remove" type="button" data-action="material-chapter-remove" aria-label="Hapus bab ${index+1}" title="Hapus bab">×</button></div>`;
}

export function chapterFieldMarkup(index) { return chapterInput('',index); }

export function materialFormMarkup(material) {
  const edit=!!material;
  const chapters=Array.isArray(material?.content)&&material.content.length?material.content:[''];
  const categoryOptions=CATEGORIES.map(category=>`<option value="${h(category)}" ${category===(material?.category||CATEGORIES[0])?'selected':''}>${h(category)}</option>`).join('');
  return `<form id="material-form" class="gm-material-form stack-form">
    <div class="gm-form-intro"><strong>${edit?'Perbarui materi':'Informasi materi'}</strong><p>Isi judul yang mudah dicari, gambarkan isi materi, lalu susun bab satu per satu.</p></div>
    <div class="gm-form-grid"><label class="form-field gm-form-wide"><span>Judul materi <small>Wajib</small></span><input name="title" maxlength="110" value="${h(material?.title||'')}" placeholder="Contoh: Dasar JavaScript: percabangan dan perulangan" required></label>
    <label class="form-field"><span>Mata kuliah atau bidang <small>Wajib</small></span><select name="category">${categoryOptions}</select></label>
    <label class="form-field"><span>Estimasi durasi belajar (menit)</span><input name="duration" type="number" min="5" max="360" step="5" value="${Number(material?.duration)||30}" required></label>
    <label class="form-field gm-form-wide"><span>Ringkasan isi <small>Wajib</small></span><textarea name="summary" rows="3" maxlength="420" placeholder="Apa yang akan dipahami mahasiswa setelah mempelajari materi ini?" required>${h(material?.summary||'')}</textarea><small>Gunakan 1–2 kalimat yang menjelaskan manfaat materinya.</small></label></div>
    <div class="gm-chapters-top"><div><strong>Daftar bab</strong><p>Pisahkan topik menjadi bab. Setiap judul bisa kamu edit nanti.${edit?' Mengubah daftar bab akan mengatur ulang progres materi ini.':''}</p></div><button type="button" data-action="material-chapter-add" class="btn btn-outline btn-small">+ Tambah bab</button></div>
    <div id="gm-chapter-fields" class="gm-chapter-fields">${chapters.slice(0,12).map(chapterInput).join('')}</div>
    <div class="gm-upload-section"><label class="attachment-picker"><span>${edit?'Ganti lampiran (opsional)':'Lampiran materi (opsional)'}</span><input id="material-file" type="file" accept="application/pdf,.ppt,.pptx,video/mp4,video/webm"></label><small id="material-upload-status" class="upload-status">${edit&&material.attachmentName?`Saat ini: ${h(material.attachmentName)}. File baru menggantikan lampiran lama.`:'Unggah PDF, PPT, atau video maksimal 25 MB.'}</small>${edit&&(material.attachmentKey||material.attachment)?'<label class="gm-remove-attachment"><input type="checkbox" name="removeAttachment"> Hapus lampiran yang tersimpan</label>':''}</div>
    <button class="btn btn-primary form-submit" type="submit">${edit?'Simpan perubahan':'Terbitkan materi'}</button>
  </form>`;
}

export function parseMaterialInput(values) {
  const title=String(values.title||'').trim().slice(0,110);
  const summary=String(values.summary||'').trim().slice(0,420);
  const category=CATEGORIES.includes(values.category)?values.category:CATEGORIES[0];
  const duration=Number(values.duration);
  const chapters=Object.entries(values).filter(([key])=>/^chapter_\d+$/.test(key))
    .sort(([a],[b])=>Number(a.slice(8))-Number(b.slice(8))).map(([,value])=>String(value||'').trim().slice(0,140)).filter(Boolean).slice(0,12);
  if(!title||!summary||!chapters.length||!Number.isInteger(duration)||duration<5||duration>360)return null;
  return {title,summary,category,duration,content:chapters};
}

export function normalizeChapterInputs(host) {
  if (!host?.querySelectorAll) return;
  [...host.querySelectorAll('.gm-chapter-field')].forEach((row,index)=>{
    const label=row.querySelector('label > span'),input=row.querySelector('input'),remove=row.querySelector('.gm-chapter-remove');
    if(label) label.textContent=`Bab ${index+1}`;
    if(input) input.name=`chapter_${index}`;
    if(remove) remove.setAttribute('aria-label',`Hapus bab ${index+1}`);
  });
}
