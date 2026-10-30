// Print JSX for one element of a dumped page: node docs/plans/tools/fragment.js <Page> "<css selector>"
const fs = require('fs'), path = require('path');
const { parse } = require('next/dist/compiled/node-html-parser');
const { render, Ctx } = require('./proto2jsx');
const [page, sel] = process.argv.slice(2);
const dom = parse(fs.readFileSync(path.join(__dirname, '../dom', page + '.html'), 'utf8'), { comment: false, blockTextElements: { script: true, noscript: true, style: true } });
const src = fs.readFileSync(path.join(__dirname, '../../prototype', page + '.html'), 'utf8');
const el = dom.querySelector(sel);
console.log(render(el, new Ctx({ source: src, replace: [] }), 2).join('\n'));
