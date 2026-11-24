/** Perilaku moderasi dan riwayat lokal. Tidak mengirim laporan atau pesan ke server. */
export const REPORT_REASONS = ['Spam atau promosi berulang', 'Pelecehan atau perundungan', 'Penipuan atau informasi menyesatkan', 'Konten berbahaya', 'Pelanggaran privasi', 'Lainnya'];
export const COMMUNITY_KINDS = ['user','post','material','opportunity'];
export function ensureCommunity(db){
  if(!db.community || typeof db.community !== 'object') db.community={};
  if(!Array.isArray(db.community.blocked)) db.community.blocked=[];
  if(!Array.isArray(db.community.hidden)) db.community.hidden=[];
  if(!Array.isArray(db.community.reports)) db.community.reports=[];
  if(!Array.isArray(db.community.activity)) db.community.activity=[];
  if(!Array.isArray(db.invites))db.invites=[];
  return db.community;
}
export function isBlocked(db,userId){return !!userId&&ensureCommunity(db).blocked.includes(userId);}
export function setBlocked(db,userId,blocked){
  if(!userId || userId==='me') return false;
  const c=ensureCommunity(db);c.blocked=c.blocked.filter(id=>id!==userId);
  if(blocked)c.blocked.push(userId);
  if(blocked){db.following=(db.following||[]).filter(id=>id!==userId);db.invites=(db.invites||[]).filter(id=>id!==userId);}
  logActivity(db,blocked?'blocked':'unblocked','user',userId);
  return true;
}
export function logActivity(db,action,kind,id){
  if(!COMMUNITY_KINDS.includes(kind)||typeof id!=='string'||id.length>180)return;
  const c=ensureCommunity(db);
  c.activity.unshift({action,kind,id,at:new Date().toISOString()});
  c.activity=c.activity.slice(0,160);
}
export function saveReport(db,kind,id,reason,details=''){
  if(!COMMUNITY_KINDS.includes(kind)||!id||!REPORT_REASONS.includes(reason))return false;
  const c=ensureCommunity(db);
  c.reports.unshift({id:typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`report-${Date.now()}`,kind,targetId:String(id).slice(0,180),reason,details:String(details).trim().slice(0,500),at:new Date().toISOString(),status:'local'});
  c.reports=c.reports.slice(0,100);
  return true;
}
export function isHidden(db,kind,id){return ensureCommunity(db).hidden.some(entry=>entry.kind===kind&&entry.id===id);}
export function setHidden(db,kind,id,hidden,title=''){
 if(!['post','material','opportunity'].includes(kind)||!id)return false;
 const c=ensureCommunity(db);
 c.hidden=c.hidden.filter(entry=>!(entry.kind===kind&&entry.id===id));
 if(hidden)c.hidden.unshift({kind,id,title:String(title||'').slice(0,130),at:new Date().toISOString()});
 logActivity(db,hidden?'hidden':'unhidden',kind,id);
 return true;
}
export function visibleAuthor(db,authorId){return !isBlocked(db,authorId);}
export function shareLink(kind,id){
  if(!['post','material','opportunity'].includes(kind)||!id)return '';
  const url=new URL(location.href);
  url.searchParams.delete('gm-group');
  url.searchParams.set('gm-share',kind);
  url.searchParams.set('id',id);
  url.hash=kind==='material'?'learning':kind==='opportunity'?'opportunity':'home';
  return url.href;
}
export function getIncomingShare(search=location.search){
  const p=new URLSearchParams(search),kind=p.get('gm-share'),id=p.get('id');
  return ['post','material','opportunity'].includes(kind)&&id&&id.length<=180?{kind,id}:null;
}
