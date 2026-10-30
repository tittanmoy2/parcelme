// Side-by-side crop: node docs/plans/tools/sbs.js <Page> left top width height [scale]
const sharp = require('sharp'); const path = require('path');
const [p, l, t, w, h, sc = '0.6'] = process.argv.slice(2); const d = path.join(__dirname, '../shots/');
(async () => {
  const r = { left: +l, top: +t, width: +w, height: +h };
  const a = await sharp(d + p + '.1440.proto.png').extract(r).toBuffer();
  const b = await sharp(d + p + '.1440.next.png').extract(r).toBuffer();
  await sharp({ create: { width: +w * 2 + 20, height: +h, channels: 3, background: '#f0f' } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: +w + 20, top: 0 }])
    .png().toBuffer().then((buf) => sharp(buf).resize(Math.round((+w * 2 + 20) * +sc)).toFile(d + 'sbs.png'));
})();
