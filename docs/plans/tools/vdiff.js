// Visual diff: screenshots the prototype page and the Next.js route with headless Chrome, then compares pixels.
// Usage (repo root, dev server running): node docs/plans/tools/vdiff.js [--port 3100] [--w 1440] [--h 1800] Page1 Page2 ...
// Output: docs/plans/shots/<Page>.<w>.{proto,next,diff}.png and a % of differing pixels per page.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');
const { PAGES, mapHref } = require('./proto2jsx');

const ROOT = path.resolve(__dirname, '../../..');
const OUT = path.join(ROOT, 'docs/plans/shots');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const port = opt('port', '3100'), W = +opt('w', '1440'), H = +opt('h', '1800');
fs.mkdirSync(OUT, { recursive: true });

function shot(url, file) {
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=4000',
    `--window-size=${W},${H}`, `--screenshot=${file}`, url], { stdio: 'ignore', timeout: 120000 });
}

(async () => {
  for (const page of args) {
    const def = PAGES[page];
    const proto = 'file:///' + path.join(ROOT, 'docs/prototype', page + '.html').replace(/\\/g, '/').replace(/ /g, '%20');
    const route = mapHref(page + '.html');
    const base = path.join(OUT, `${page}.${W}`);
    shot(proto, base + '.proto.png');
    shot(`http://localhost:${port}${route}`, base + '.next.png');
    const a = await sharp(base + '.proto.png').raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const b = await sharp(base + '.next.png').raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const { width, height } = a.info;
    const diff = Buffer.alloc(width * height * 4);
    let n = 0;
    for (let i = 0; i < width * height * 4; i += 4) {
      const d = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
      const hit = d > 48;
      if (hit) n++;
      const g = Math.round((a.data[i] + a.data[i + 1] + a.data[i + 2]) / 3 * 0.35 + 160);
      diff[i] = hit ? 255 : g; diff[i + 1] = hit ? 0 : g; diff[i + 2] = hit ? 0 : g; diff[i + 3] = 255;
    }
    await sharp(diff, { raw: { width, height, channels: 4 } }).png().toFile(base + '.diff.png');
    console.log(`${page.padEnd(24)} ${route.padEnd(36)} ${(100 * n / (width * height)).toFixed(2)}% differ`);
  }
})();
