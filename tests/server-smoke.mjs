import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const port=33567;
const server=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(port)},stdio:'ignore'});
const url=`http://127.0.0.1:${port}`;
try{
  let ready=false;
  for(let i=0;i<40;i++){
    await new Promise(resolve=>setTimeout(resolve,125));
    try{const res=await fetch(url);if(res.ok){ready=true;break;}}catch{}
  }
  assert.ok(ready,'server did not start');
  for(const path of ['/','/src/app.js','/src/community.css','/assets/growmate-logo.png']){
    const response=await fetch(url+path);assert.equal(response.status,200,path);
    assert.match(response.headers.get('content-security-policy')??'',/frame-ancestors/);
  }
  for(const path of ['/package.json','/README.md','/.git/config','/.env','/docs/SECURITY.md','/src/../package.json','/src/app.js.map']){
    const response=await fetch(url+path);assert.notEqual(response.status,200,path+' must not be public');
  }
  assert.equal((await fetch(url+'/src/app.js',{method:'HEAD'})).status,200);
  assert.equal((await fetch(url+'/',{method:'POST'})).status,405);
  console.log('PASS: server serves only static frontend assets, protects project files and sets response headers');
}finally{server.kill('SIGTERM');}
