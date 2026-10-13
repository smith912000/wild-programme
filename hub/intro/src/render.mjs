import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
const [,, w='1920', h='1080', out='out.mp4', fps='30', crf='20', from='0', to=''] = process.argv;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.goto('file://' + path.resolve('film.html') + `?w=${w}&h=${h}`);
await page.waitForFunction(() => window.READY === true);
const dur = to ? +to : await page.evaluate(() => window.FILM.dur);
const n = Math.round((dur - +from) * +fps);
const ff = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-framerate',fps,'-c:v','png','-i','-',
  '-c:v','libx264','-preset','slow','-crf',crf,'-pix_fmt','yuv420p','-movflags','+faststart','-an',out], { stdio: ['pipe','inherit','inherit'] });
for (let i = 0; i < n; i++) {
  const t = +from + i / +fps;
  await page.evaluate(t => window.seek(t), t);
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('rendered', out, n, 'frames');
