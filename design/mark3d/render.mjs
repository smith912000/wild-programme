// Renders film.html to MP4, frame by frame through window.seek(t). three.js is served
// from node_modules (npm i three@0.186.1), so it works offline and in cloud sessions.
// node render.mjs [w] [h] [out.mp4] [fps]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const [,, w = '1920', h = '1080', out = 'mark3d.mp4', fps = '30'] = process.argv;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const three = path.dirname(fs.realpathSync(path.join(process.cwd(), 'node_modules/three/package.json')));
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': f.endsWith('.js') || f.endsWith('.mjs') ? 'text/javascript' : 'text/html' }); r.end(b); }); }).listen(0);
const port = srv.address().port;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.route('https://cdn.jsdelivr.net/npm/three@0.186.1/**', r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(three, r.request().url().split('three@0.186.1/')[1])) }));
await page.goto(`http://localhost:${port}/design/mark3d/film.html`);
await page.waitForFunction(() => window.READY === true);
const dur = await page.evaluate(() => window.FILM.dur), n = Math.round(dur * +fps);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', fps, '-c:v', 'png', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < n; i++) {
  await page.evaluate(t => window.seek(t), i / +fps);
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end(); await new Promise(r => ff.on('close', r));
await browser.close(); srv.close();
console.log('rendered', out, n, 'frames');
