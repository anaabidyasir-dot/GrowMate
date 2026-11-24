import assert from 'node:assert/strict';
import {compressCover} from '../src/cover-media.js';
const oldCreate=URL.createObjectURL, oldRevoke=URL.revokeObjectURL;
let revoked=false,drawn=false;
URL.createObjectURL=()=>'blob:cover-test';
URL.revokeObjectURL=()=>{revoked=true;};
globalThis.Image=class{
  naturalWidth=1200;naturalHeight=720;
  set src(value) { assert.equal(value,'blob:cover-test');queueMicrotask(()=>this.onload()); }
};
globalThis.document={createElement(type){assert.equal(type,'canvas');return {
  width:0,height:0,
  getContext(ctx){assert.equal(ctx,'2d');return {drawImage(){drawn=true;}};},
  toBlob(callback,type,quality){assert.equal(type,'image/jpeg');assert.equal(quality,.82);callback(new Blob(['compressed'],{type}));}
};}};
const original={type:'image/png',size:1500000};
const result=await compressCover(original);
assert.equal(result.type,'image/jpeg');
assert.equal(result.size,10);
assert.equal(revoked,true);
assert.equal(drawn,true);
await assert.rejects(compressCover({type:'text/plain',size:100}),/Gunakan gambar/);
await assert.rejects(compressCover({type:'image/png',size:9*1024*1024}),/8 MB/);
URL.createObjectURL=oldCreate;
URL.revokeObjectURL=oldRevoke;
console.log('PASS: pemrosesan cover image, ukuran, format, dan penyimpanan sebagai Blob');
