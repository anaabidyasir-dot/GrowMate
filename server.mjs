import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.svg':'image/svg+xml','.pdf':'application/pdf','.mp4':'video/mp4','.webm':'video/webm','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
const server = createServer(async (req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end('Method not allowed');return;}
  let path;
  try{path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Bad request');return;}
  const publicPath=path==='/'?'/index.html':path;
  const publicAsset=publicPath==='/index.html' ||
    (publicPath.startsWith('/src/') && /\.(?:js|css)$/.test(publicPath)) ||
    (publicPath.startsWith('/assets/') && /\.(?:png|webp|jpe?g|svg|pdf|mp4|webm|ico)$/.test(publicPath));
  if(!publicAsset || publicPath.split('/').some(part=>part.startsWith('.'))){
    res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
    res.end('Halaman tidak ditemukan');
    return;
  }
  const full = resolve(root,'.'+publicPath);
  if(full!==resolve(root,'index.html') && !full.startsWith(resolve(root)+sep)){res.writeHead(403);res.end('Forbidden');return;}
  try{
    const bytes=await readFile(full);
    res.writeHead(200,{'Content-Type':mime[extname(full)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Cross-Origin-Resource-Policy':'same-origin','Content-Security-Policy':"default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob: data:; frame-src 'self' blob:; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"});
    res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Halaman tidak ditemukan');}
});
server.listen(port,'127.0.0.1',()=>console.log(`GrowMate siap di http://localhost:${port}`));
