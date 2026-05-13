import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const covers = [
  { file: 'cover1-neural',        url: 'http://localhost:5173/covers/cover1-neural.html' },
  { file: 'cover2-sleep-arch',    url: 'http://localhost:5173/covers/cover2-sleep-arch.html' },
  { file: 'cover3-sacred-science',url: 'http://localhost:5173/covers/cover3-sacred-science.html' },
]

const browser = await puppeteer.launch({ headless: 'new' })

for (const { file, url } of covers) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 600))   // let any JS (gamma wave) finish
  const out = path.join(__dirname, `${file}.png`)
  await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080 } })
  console.log(`✓  ${file}.png`)
  await page.close()
}

await browser.close()
