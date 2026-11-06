// Page-weight check (gzip transfer sizes, headless Chromium).
// Usage: node scripts/measure-page-weight.js <site-root> </wild-programme/ or /SGE/> <page> [<page>...]
// Needs Playwright (require('playwright')). Pages are served from disk, requests to the
// github.io base are mapped to local files; anything else is blocked. Prints
// "page | total KB, requests | three biggest files | page errors". Compare with the
// budgets in PERFORMANCE.md. Run before and after a change and put both in the PR.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),zlib=require('zlib');
const root=process.argv[2],base=process.argv[3],pages=process.argv.slice(4);
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2','.woff':'font/woff','.mp3':'audio/mpeg'};
(async()=>{const b=await chromium.launch();
for(const p of pages){const ctx=await b.newContext({viewport:{width:1280,height:800}});const pg=await ctx.newPage();let tot=0,n=0,big=[];
await pg.route('**/*',async r=>{const u=new URL(r.request().url());let rel;
 if(u.hostname==='smith912000.github.io'&&u.pathname.startsWith(base))rel=u.pathname.slice(base.length);else if(u.hostname==='localhost')rel=u.pathname.slice(base.length);else return r.abort();
 rel=decodeURIComponent(rel);const f=path.join(root,rel);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){return r.fulfill({status:404,body:''})}
 let body=fs.readFileSync(f);const ext=path.extname(f);const ct=mime[ext]||'application/octet-stream';
 const t=/html|javascript|css|json|svg/.test(ct)?zlib.gzipSync(body).length:body.length;tot+=t;n++;big.push([t,rel]);
 r.fulfill({status:200,contentType:ct,body});});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
try{await pg.goto('https://smith912000.github.io'+base+p,{waitUntil:'load',timeout:20000});await pg.waitForTimeout(2500);}catch(e){errs.push('nav '+e.message.slice(0,60))}
big.sort((a,b)=>b[0]-a[0]);console.log(p,'|',Math.round(tot/1024)+'KB',n+'req','|',big.slice(0,3).map(x=>Math.round(x[0]/1024)+'K '+x[1].split('/').slice(-2).join('/')).join(', '),errs.length?'ERR '+errs[0]:'');await ctx.close();}
await b.close();})();
