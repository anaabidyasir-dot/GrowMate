const STORE='attachments';
const DB='growmate.local.media.v1';
function open(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in globalThis))return reject(new Error('Penyimpanan berkas lokal tidak tersedia'));
    const request=indexedDB.open(DB,1);
    request.onupgradeneeded=()=>request.result.createObjectStore(STORE);
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}
export async function saveMedia(key,file){
  const db=await open();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE,'readwrite');
    transaction.objectStore(STORE).put(file,key);
    transaction.oncomplete=()=>{db.close();resolve()};
    transaction.onerror=()=>{db.close();reject(transaction.error)};
  });
}
export async function readMedia(key){
  const db=await open();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE,'readonly');
    const request=transaction.objectStore(STORE).get(key);
    request.onsuccess=()=>{db.close();resolve(request.result||null)};
    request.onerror=()=>{db.close();reject(request.error)};
  });
}
export async function removeMedia(key){
  const db=await open();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE,'readwrite');
    transaction.objectStore(STORE).delete(key);
    transaction.oncomplete=()=>{db.close();resolve()};
    transaction.onerror=()=>{db.close();reject(transaction.error)};
  });
}
