// Local account controls, not server-backed authentication. Never trust the browser's
// role/credentials for real institutional access or personal information.
const CREDENTIALS = 'growmate.credentials.v2';
const ACCOUNT_PREFIX = 'growmate.account.v1.';
const SESSION = 'growmate.session.v1';
const DIRECTORY = 'growmate.campus.directory.v1';
const accountKey = email => ACCOUNT_PREFIX + encodeURIComponent(email.trim().toLowerCase());
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function records() {try {return JSON.parse(localStorage.getItem(CREDENTIALS)||'{}');}catch{return {};}}
function currentRecord(db, all) {return Object.values(all).find(x=>x.email===db.me.email);}
async function digest(password,salt){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),{name:'PBKDF2'},false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:120000,hash:'SHA-256'},key,256);
  return [...new Uint8Array(bits)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export async function changeLocalPassword(db, current, next, confirm) {
  const all=records(), rec=currentRecord(db,all);
  if(!rec || await digest(current,rec.salt)!==rec.hash) throw Error('Kata sandi saat ini tidak cocok.');
  if(next.length<8 || next.length>128) throw Error('Kata sandi baru harus 8–128 karakter.');
  if(next!==confirm) throw Error('Konfirmasi kata sandi belum cocok.');
  if(next===current) throw Error('Gunakan kata sandi baru yang berbeda.');
  const salt=crypto.randomUUID();const updated={...rec,salt,hash:await digest(next,salt)};
  all[rec.username]=updated;
  try {localStorage.setItem(CREDENTIALS,JSON.stringify(all));} catch {throw Error('Perubahan kata sandi gagal disimpan.');}
}
export async function changeLocalEmail(db, current, next) {
  const email=String(next||'').trim().toLowerCase(), old=db.me.email;
  if(!emailPattern.test(email) || email.length>120) throw Error('Masukkan alamat email yang valid.');
  if(email===old) throw Error('Alamat email baru sama dengan email saat ini.');
  const all=records(), rec=currentRecord(db,all);
  if(!rec || await digest(current,rec.salt)!==rec.hash) throw Error('Kata sandi saat ini tidak cocok.');
  if(Object.values(all).some(x=>x.email===email)) throw Error('Email sudah terdaftar di browser ini.');
  const copy=JSON.parse(JSON.stringify(db));copy.me.email=email;
  // Keep ownership checks working after the account address changes.
  for(const item of [...(copy.modules||[]),...(copy.opportunities||[]),...(copy.askGroups||[])]) {
    if(item.ownerEmail===old)item.ownerEmail=email;
  }
  const oldDirectory=localStorage.getItem(DIRECTORY), newDirectory=oldDirectory?JSON.parse(oldDirectory):[];
  for(const campus of newDirectory){
    if(campus.ownerEmail===old)campus.ownerEmail=email;
    for(const request of campus.requests||[])if(request.email===old)request.email=email;
  }
  all[rec.username]={...rec,email};
  const oldAccount=localStorage.getItem(accountKey(old));
  const oldCredentials=localStorage.getItem(CREDENTIALS);
  const oldSession=localStorage.getItem(SESSION);
  const oldNewAccount=localStorage.getItem(accountKey(email));
  try {
    localStorage.setItem(accountKey(email),JSON.stringify(copy));
    localStorage.setItem(CREDENTIALS,JSON.stringify(all));
    if(oldDirectory!==null)localStorage.setItem(DIRECTORY,JSON.stringify(newDirectory));
    localStorage.setItem(SESSION,JSON.stringify({email,name:copy.me.name}));
    localStorage.removeItem(accountKey(old));
  }catch {
    // Best-effort rollback of the exact keys touched by this operation.
    for(const [key,value] of [[accountKey(old),oldAccount],[accountKey(email),oldNewAccount],[CREDENTIALS,oldCredentials],[DIRECTORY,oldDirectory],[SESSION,oldSession]]){
      try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch{}
    }
    throw Error('Email tidak dapat diperbarui karena penyimpanan browser gagal.');
  }
  return copy;
}
