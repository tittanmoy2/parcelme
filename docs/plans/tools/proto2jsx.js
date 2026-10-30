// Converts a prototype page (post-JS DOM dump in docs/plans/dom/) into a Next.js page.tsx + page.css.
// Usage (repo root): node docs/plans/tools/proto2jsx.js <PrototypePage> [--dry]
//   e.g. node docs/plans/tools/proto2jsx.js AdminTickets
// Regenerate dumps: see docs/plans/prototype-ui-port.md (section "Tools").
const fs = require('fs');
const path = require('path');
const { parse } = require('next/dist/compiled/node-html-parser');
const postcss = require('postcss');

const ROOT = path.resolve(__dirname, '../../..');
const DOM = path.join(ROOT, 'docs/plans/dom');
const SRC = path.join(ROOT, 'docs/prototype');

// Prototype page -> [URL, app dir (relative to src/app), mode, extra]
// mode: panel = page renders <main> (shell in layout); full = page renders whole body; rider = page renders .rp-app (+dialogs)
const PAGES = {
  Login: ['/login', '(auth)/login', 'full'],
  Register: ['/register', '(auth)/register', 'full'],
  OtpVerify: ['/verify-otp', '(auth)/verify-otp', 'full'],
  ForgotPassword: ['/forgot-password', '(auth)/forgot-password', 'full'],
  ResetPassword: ['/reset-password', '(auth)/reset-password', 'full'],
  index: ['/', null, 'full'],
  Landing: ['/', null, 'full'],
  Tracking: ['/track', '(public)/track', 'full'],
  Coverage: ['/coverage', '(public)/coverage', 'full'],
  Contact: ['/contact', '(public)/contact', 'full'],
  NotFound: ['/not-found', '(public)/not-found', 'full'],
  DesignSystem: ['/design-system', 'design-system', 'full'],
  MerchantDashboard: ['/merchant/dashboard', '(merchant)/merchant/dashboard', 'panel'],
  MerchantParcels: ['/merchant/parcels', '(merchant)/merchant/parcels', 'panel'],
  CreateParcel: ['/merchant/parcels/create', '(merchant)/merchant/parcels/create', 'panel'],
  MerchantBulkUpload: ['/merchant/parcels/bulk-upload', '(merchant)/merchant/parcels/bulk-upload', 'panel'],
  MerchantParcelDetails: ['/merchant/parcels/[id]', '(merchant)/merchant/parcels/[id]', 'panel', 'PM-2410-8F3K29'],
  MerchantPickups: ['/merchant/pickups', '(merchant)/merchant/pickups', 'panel'],
  MerchantPickupLocations: ['/merchant/pickup-locations', '(merchant)/merchant/pickup-locations', 'panel'],
  MerchantReturns: ['/merchant/returns', '(merchant)/merchant/returns', 'panel'],
  MerchantPayments: ['/merchant/finance/payments', '(merchant)/merchant/finance/payments', 'panel'],
  MerchantPayouts: ['/merchant/finance/payouts', '(merchant)/merchant/finance/payouts', 'panel'],
  MerchantInvoices: ['/merchant/finance/invoices', '(merchant)/merchant/finance/invoices', 'panel'],
  MerchantFraudCheck: ['/merchant/tools/fraud-check', '(merchant)/merchant/tools/fraud-check', 'panel'],
  MerchantApi: ['/merchant/tools/api-webhooks', '(merchant)/merchant/tools/api-webhooks', 'panel'],
  MerchantSettings: ['/merchant/settings', '(merchant)/merchant/settings', 'panel'],
  AdminDashboard: ['/admin/dashboard', '(admin)/admin/dashboard', 'panel'],
  AdminParcels: ['/admin/parcels', '(admin)/admin/parcels', 'panel'],
  AdminParcelDetails: ['/admin/parcels/[id]', '(admin)/admin/parcels/[id]', 'panel', 'PM-2410-8F3K29'],
  AdminPickups: ['/admin/operations/pickups', '(admin)/admin/operations/pickups', 'panel'],
  AdminAssign: ['/admin/operations/assign', '(admin)/admin/operations/assign', 'panel'],
  AdminHubs: ['/admin/operations/hubs', '(admin)/admin/operations/hubs', 'panel'],
  AdminHubTransfer: ['/admin/operations/hub-transfers', '(admin)/admin/operations/hub-transfers', 'panel'],
  AdminScan: ['/admin/operations/scan-station', '(admin)/admin/operations/scan-station', 'panel'],
  AdminMerchants: ['/admin/merchants', '(admin)/admin/merchants', 'panel'],
  AdminMerchantDetails: ['/admin/merchants/[id]', '(admin)/admin/merchants/[id]', 'panel', '11024'],
  AdminRiders: ['/admin/riders', '(admin)/admin/riders', 'panel'],
  AdminRiderDetails: ['/admin/riders/[id]', '(admin)/admin/riders/[id]', 'panel', 'R-1042'],
  AdminStaff: ['/admin/staff', '(admin)/admin/staff', 'panel'],
  AdminCod: ['/admin/finance/cod-reconciliation', '(admin)/admin/finance/cod-reconciliation', 'panel'],
  AdminPayouts: ['/admin/finance/payouts', '(admin)/admin/finance/payouts', 'panel'],
  AdminReports: ['/admin/analytics/reports', '(admin)/admin/analytics/reports', 'panel'],
  AdminTickets: ['/admin/support/tickets', '(admin)/admin/support/tickets', 'panel'],
  AdminPricing: ['/admin/settings/pricing', '(admin)/admin/settings/pricing', 'panel'],
  AdminCoverage: ['/admin/settings/coverage', '(admin)/admin/settings/coverage', 'panel'],
  AdminSms: ['/admin/settings/sms', '(admin)/admin/settings/sms', 'panel'],
  AdminBranding: ['/admin/settings/branding', '(admin)/admin/settings/branding', 'panel'],
  AdminLicense: ['/admin/settings/license', '(admin)/admin/settings/license', 'panel'],
  RiderToday: ['/rider/today', '(rider)/rider/today', 'rider'],
  RiderPickups: ['/rider/pickups', '(rider)/rider/pickups', 'rider'],
  RiderDelivery: ['/rider/delivery/[id]', '(rider)/rider/delivery/[id]', 'rider', 'PM-2410-8F3K29'],
  RiderFailed: ['/rider/delivery/[id]/failed', '(rider)/rider/delivery/[id]/failed', 'rider', 'PM-2410-8F3K29'],
  RiderScanner: ['/rider/scanner', '(rider)/rider/scanner', 'rider'],
  RiderCash: ['/rider/cash', '(rider)/rider/cash', 'rider'],
  RiderEarnings: ['/rider/earnings', '(rider)/rider/earnings', 'rider'],
};

// ---------- links ----------
function mapHref(href) {
  const m = /^([A-Za-z]+)\.html(?:\?([^#]*))?(#.*)?$/.exec(href);
  if (!m) return null;
  const [, page, query = '', hash = ''] = m;
  const def = PAGES[page];
  if (!def) return null;
  let url = def[0];
  const params = new URLSearchParams(query);
  if (page === 'Tracking' && params.get('id')) {
    url = '/track/' + params.get('id');
    params.delete('id');
  } else if (url.includes('[id]')) {
    url = url.replace('[id]', params.get('id') || def[3] || 'demo');
    params.delete('id');
  }
  const rest = params.toString();
  return url + (rest ? '?' + rest : '') + hash;
}

// ---------- attributes ----------
const ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  minlength: 'minLength', colspan: 'colSpan', rowspan: 'rowSpan', autocomplete: 'autoComplete',
  autofocus: 'autoFocus', autocapitalize: 'autoCapitalize', autocorrect: 'autoCorrect', inputmode: 'inputMode', enterkeyhint: 'enterKeyHint', novalidate: 'noValidate',
  spellcheck: 'spellCheck', contenteditable: 'contentEditable', crossorigin: 'crossOrigin', srcset: 'srcSet',
  datetime: 'dateTime', playsinline: 'playsInline', autoplay: 'autoPlay', accesskey: 'accessKey',
  'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'accept-charset': 'acceptCharset', formnovalidate: 'formNoValidate',
  allowfullscreen: 'allowFullScreen', frameborder: 'frameBorder', cellpadding: 'cellPadding', cellspacing: 'cellSpacing',
};
const BOOL = new Set(['disabled', 'checked', 'selected', 'readonly', 'required', 'multiple', 'hidden', 'open', 'autofocus',
  'novalidate', 'muted', 'playsinline', 'autoplay', 'loop', 'controls', 'formnovalidate', 'allowfullscreen', 'default', 'inert']);
const SVG_CASE = Object.fromEntries(['preserveAspectRatio','viewBox','gradientUnits','gradientTransform','patternUnits','patternTransform','patternContentUnits','markerWidth','markerHeight','refX','refY','textLength','lengthAdjust','stdDeviation','baseFrequency','numOctaves','pathLength','startOffset','spreadMethod','clipPathUnits','maskUnits','maskContentUnits','filterUnits','primitiveUnits','tableValues','keySplines','keyTimes','calcMode','repeatCount','attributeName','preserveAlpha','edgeMode','surfaceScale','xChannelSelector','yChannelSelector'].map((a) => [a.toLowerCase(), a]));
const NUM = new Set(['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-level', 'aria-posinset', 'aria-setsize', 'aria-colcount', 'aria-rowcount', 'tabIndex', 'colSpan', 'rowSpan', 'maxLength', 'minLength', 'rows', 'cols', 'size', 'span', 'start']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

const fonts = (s) =>
  s.replace(/(['"])Plus Jakarta Sans\1,\s*sans-serif/g, 'var(--font-sans)')
    .replace(/(['"])Plus Jakarta Sans\1/g, 'var(--font-sans)')
    .replace(/(['"])Fira Code\1,\s*monospace/g, 'var(--font-mono)')
    .replace(/(['"])Fira Code\1/g, 'var(--font-mono)');

function splitDecls(s) {
  const out = [];
  let depth = 0, q = null, cur = '';
  for (const ch of s) {
    if (q) { if (ch === q) q = null; cur += ch; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((d) => d.trim()).filter(Boolean);
}

function styleObj(raw) {
  const parts = splitDecls(fonts(decode(raw))).map((d) => {
    const i = d.indexOf(':');
    let prop = d.slice(0, i).trim();
    const val = d.slice(i + 1).trim();
    if (!prop.startsWith('--')) {
      prop = prop.toLowerCase();
      if (prop.startsWith('-ms-')) prop = 'ms' + camel(prop.slice(3));
      else if (prop.startsWith('-')) prop = camel(prop.slice(1)).replace(/^./, (c) => c.toUpperCase());
      else prop = camel(prop);
    }
    const key = /^[A-Za-z_$][\w$]*$/.test(prop) ? prop : JSON.stringify(prop);
    return `${key}: ${JSON.stringify(val)}`;
  });
  const custom = parts.some((p) => p.startsWith('"--'));
  if (custom) styleObj.usedCast = true;
  return custom ? `{{ ${parts.join(', ')} } as CSSProperties}` : `{{ ${parts.join(', ')} }}`;
}

// ---------- JSX ----------
const INLINE_PARENTS = new Set(['a', 'span', 'b', 'strong', 'em', 'i', 'small', 'code', 'kbd', 'label', 'mark', 'abbr', 'u', 's', 'sup', 'sub', 'q', 'cite', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'button', 'summary', 'dt', 'dd', 'legend', 'option', 'caption', 'figcaption', 'blockquote', 'time']);
const BLOCKS = new Set(['div', 'p', 'section', 'header', 'footer', 'nav', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'aside', 'main', 'article', 'fieldset', 'dialog', 'option', 'optgroup', 'hr', 'figure', 'details', 'summary', 'dl', 'dt', 'dd', 'blockquote', 'colgroup', 'col', 'caption', 'legend', 'address', 'pre', 'template']);

function isFlexish(el) {
  const c = ' ' + (el.getAttribute('class') || '') + ' ';
  const st = (el.getAttribute('style') || '').replace(/\s/g, '');
  return /\s(inline-)?(flex|grid)\s/.test(c) || /display:(inline-)?(flex|grid)/.test(st);
}
function isBlockEl(el) {
  if (!el || el.nodeType !== 1) return false;
  const tag = el.rawTagName.toLowerCase();
  if (!BLOCKS.has(tag)) return false;
  const c = el.getAttribute('class') || '';
  const st = el.getAttribute('style') || '';
  return !/\binline/.test(c) && !/display:\s*inline/.test(st);
}

function escText(t) {
  // t is raw (entity-encoded) HTML text with whitespace already collapsed
  let s = t.replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;');
  if (/[{}]/.test(s)) s = s.replace(/[{}]/g, (c) => `{'${c}'}`);
  return s;
}

class Ctx {
  constructor(opts) { this.opts = opts; this.usesLink = false; this.imports = new Set(); }
}

function attrsJSX(el, ctx, tag) {
  const out = [];
  const attrs = el.attributes; // decoded values
  const raw = el.rawAttributes; // raw values
  let selectDefault = null;
  if (tag === 'select') {
    const sel = el.querySelectorAll('option').find((o) => o.hasAttribute('selected'));
    if (sel) selectDefault = sel.hasAttribute('value') ? sel.getAttribute('value') : decode(sel.text).trim();
  }
  for (const name of Object.keys(attrs)) {
    const lname = name.toLowerCase();
    let val = attrs[name];
    if (lname === 'style') { if (val.trim()) out.push(`style=${styleObj(raw[name])}`); continue; }
    if (lname === 'class') { val = val.replace(/\s+/g, ' ').trim(); if (!val) continue; out.push(`className=${JSON.stringify(val)}`); continue; }
    if (tag === 'option' && lname === 'selected') continue;
    if (lname === 'value' && (tag === 'textarea')) continue;
    if (lname === 'value' && tag === 'input' && !/^(button|checkbox|image|hidden|radio|reset|submit)$/i.test(attrs.type || '')) {
      out.push(`defaultValue=${JSON.stringify(val)}`); continue;
    }
    if (lname === 'checked' && tag === 'input') { out.push('defaultChecked'); continue; }
    if (lname === 'href' && ctx.linkTag) { out.push(`href=${JSON.stringify(ctx.linkTag)}`); continue; }
    let jname = ATTR[lname] || (lname.startsWith('aria-') || lname.startsWith('data-') ? lname : (lname.includes('-') || lname.includes(':') ? camel(lname.replace(':', '-')) : lname));
    if (ctx.inSvg && !ATTR[lname] && !lname.startsWith('aria-') && !lname.startsWith('data-')) jname = camel(lname.replace(':', '-'));
    if (SVG_CASE[lname]) jname = SVG_CASE[lname];
    if (BOOL.has(lname) && (val === '' || val.toLowerCase() === lname)) { out.push(jname); continue; }
    if (NUM.has(jname) && /^-?\d+$/.test(val)) { out.push(`${jname}={${val}}`); continue; }
    out.push(`${jname}=${JSON.stringify(val)}`);
  }
  if (selectDefault !== null) out.push(`defaultValue=${JSON.stringify(selectDefault)}`);
  if (tag === 'textarea' && (el.text || '').trim()) out.push(`defaultValue=${JSON.stringify(decode(el.text))}`);
  return out;
}

function shouldDrop(el, ctx) {
  const tag = el.rawTagName.toLowerCase();
  if (tag === 'script' || tag === 'style' || tag === 'link' || tag === 'meta' || tag === 'noscript') return true;
  const cls = el.getAttribute('class') || '';
  const id = el.getAttribute('id') || '';
  if (/\bpm-toasts\b/.test(cls) || id === 'm-print' || id === 'mg-print') return true;
  // Dialogs created at runtime by JS (not in the page source) are dropped; dialogs from the design stay.
  if (tag === 'dialog' && (!id || !ctx.opts.source.includes(`id="${id}"`))) return true;
  return false;
}

function render(el, ctx, indent) {
  const pad = '  '.repeat(indent);
  const tag0 = el.rawTagName;
  const tag = tag0.toLowerCase();
  for (const [sel, jsx] of ctx.opts.replace || []) {
    if (sel(el)) return [pad + jsx];
  }
  const prevSvg = ctx.inSvg, prevPre = ctx.inPre;
  if (tag === 'svg') ctx.inSvg = true;
  if (tag === 'pre') ctx.inPre = true;
  let outTag = ctx.inSvg ? tag0 : tag; // keep SVG camelCase tags (linearGradient, clipPath)
  ctx.linkTag = null;
  if (tag === 'a') {
    const href = el.getAttribute('href') || '';
    const mapped = mapHref(href);
    if (mapped) { ctx.linkTag = mapped; outTag = 'Link'; ctx.usesLink = true; }
  }
  const attrs = attrsJSX(el, ctx, tag);
  ctx.linkTag = null;
  let extra = (ctx.opts.rootAttrs && el === ctx.opts.rootEl) ? ctx.opts.rootAttrs : [];
  const open = `<${outTag}${[...attrs, ...extra].map((a) => ' ' + a).join('')}`;
  const kids = (tag === 'textarea') ? [] : renderChildren(el, ctx, indent + 1, tag);
  ctx.inSvg = prevSvg;
  ctx.inPre = prevPre;
  if (!kids.length || VOID.has(tag)) return [pad + open + ' />'];
  // Single short text child: keep on one line.
  if (kids.length === 1 && !kids[0].trim().startsWith('<') && (pad + open + kids[0].trim()).length < 150) {
    return [pad + open + '>' + kids[0].trim() + `</${outTag}>`];
  }
  return [pad + open + '>', ...kids, pad + `</${outTag}>`];
}

function renderChildren(el, ctx, indent, ptag) {
  const pad = '  '.repeat(indent);
  const nodes = el.childNodes.filter((n) => n.nodeType === 3 || (n.nodeType === 1 && !shouldDrop(n, ctx)));
  // tokens: {t:'el',n} | {t:'txt',s} | {t:'ws'}
  if (ctx.inPre) {
    // Preformatted: keep every character, text as string literals.
    return nodes.flatMap((n) => n.nodeType === 1 ? render(n, ctx, indent) : (n.rawText ? [pad + `{${JSON.stringify(decode(n.rawText))}}`] : []));
  }
  const toks = [];
  const pushWs = () => { if (toks.length && toks[toks.length - 1].t === 'ws') return; toks.push({ t: 'ws' }); };
  for (const n of nodes) {
    if (n.nodeType === 1) { toks.push({ t: 'el', n }); continue; }
    const raw = n.rawText;
    if (!raw) continue;
    const collapsed = raw.replace(/[ \t\n\r\f]+/g, ' ');
    if (collapsed === ' ') { pushWs(); continue; }
    if (collapsed.startsWith(' ')) pushWs();
    toks.push({ t: 'txt', s: collapsed.trim() });
    if (collapsed.endsWith(' ')) pushWs();
  }
  const out = [];
  const flex = isFlexish(el);
  const svg = ctx.inSvg;
  const inlineParent = INLINE_PARENTS.has(ptag) && !flex;
  toks.forEach((tk, i) => {
    if (tk.t === 'el') { out.push(...render(tk.n, ctx, indent)); return; }
    if (tk.t === 'txt') { out.push(pad + escText(tk.s)); return; }
    // whitespace
    if (svg || flex) return;
    const prev = toks[i - 1], next = toks[i + 1];
    if (!prev || !next) { if (inlineParent && (prev || next)) out.push(pad + "{' '}"); return; }
    const blockish = (t) => t.t === 'el' && isBlockEl(t.n);
    if (blockish(prev) || blockish(next)) return;
    out.push(pad + "{' '}");
  });
  return out;
}

// ---------- page CSS ----------
function pageCss(source, page, mode) {
  const blocks = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  if (!blocks.trim()) return '';
  const root = postcss.parse(blocks);
  // @layer blocks stay (cascade layers are document-wide, so these join the global base layer); rules inside get scoped too.
  root.walkComments((c) => c.remove());
  const scope = `[data-page="${page}"]`;
  root.walkRules((r) => {
    if (r.parent.type === 'atrule' && /keyframes/.test(r.parent.name)) return;
    const sels = r.selectors.flatMap((s) => {
      s = s.trim();
      if (/^(html|:root)\b/.test(s)) return [s];
      if (/^body$/.test(s)) return [];
      if (/^body\b/.test(s)) s = s.replace(/^body/, '').trim() || '*';
      if (mode === 'panel' && /^main\b/.test(s)) return [s.replace(/^main/, `main:where(${scope})`)];
      if (mode === 'panel' && /^\.(nav|navh)\b/.test(s)) return [];
      return [`:where(${scope}) ${s}`];
    });
    if (!sels.length) r.remove(); else r.selector = sels.join(',\n');
  });
  return `/* Page styles from docs/prototype/${page}.html, scoped to [data-page="${page}"] (generated by proto2jsx). */\n` + fonts(root.toString()).replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// ---------- main ----------
function convert(page, { dry = false } = {}) {
  const def = PAGES[page];
  if (!def) throw new Error('Unknown page ' + page);
  const [url, dir, mode] = def;
  const dom = parse(fs.readFileSync(path.join(DOM, page + '.html'), 'utf8'), { comment: false, blockTextElements: { script: true, noscript: true, style: true } });
  const source = fs.readFileSync(path.join(SRC, page + '.html'), 'utf8');
  const body = dom.querySelector('body');
  const area = body.getAttribute('data-area');
  const opts = { source, replace: [] };
  let roots;
  if (mode === 'panel') {
    roots = [body.querySelector('main')];
    opts.rootEl = roots[0];
    opts.rootAttrs = [`data-page="${page}"`];
    opts.replace.push([(e) => e.rawTagName === 'section' && /\bpm-top\b/.test(e.getAttribute('class') || ''), '<AdminTopBar />']);
  } else if (mode === 'rider') {
    roots = body.childNodes.filter((n) => n.nodeType === 1 && !shouldDrop(n, { opts }));
    opts.rootEl = roots.find((n) => /\brp-app\b/.test(n.getAttribute('class') || ''));
    opts.rootAttrs = [`data-page="${page}"`];
    opts.replace.push([(e) => e.rawTagName === 'nav' && /\brp-nav\b/.test(e.getAttribute('class') || ''), `<RiderNav active="${(dom.querySelector('nav.rp-nav .bn.on') || { text: '' }).text.trim()}" />`]);
  } else {
    roots = body.childNodes.filter((n) => n.nodeType === 1 && !shouldDrop(n, { opts }));
    opts.rootEl = roots[0];
    opts.rootAttrs = [`data-area="${area}"`, `data-page="${page}"`];
  }
  styleObj.usedCast = false;
  const ctx = new Ctx(opts);
  const lines = roots.flatMap((r) => render(r, ctx, roots.length > 1 ? 3 : 2));
  const css = pageCss(fs.readFileSync(path.join(DOM, page + '.html'), 'utf8'), page, mode); // dump: includes styles the area scripts inject
  const imports = [];
  if (styleObj.usedCast) { imports.push("import type { CSSProperties } from 'react';"); styleObj.usedCast = false; }
  if (ctx.usesLink) imports.push("import Link from 'next/link';");
  const joined = lines.join('\n');
  if (joined.includes('<AdminTopBar')) imports.push("import { AdminTopBar } from '@/components/admin/AdminTopBar';");
  if (joined.includes('<RiderNav')) imports.push("import { RiderNav } from '@/components/rider/RiderNav';");
  if (css) imports.push("import './page.css';");
  const fn = page.replace(/^index$/, 'Landing') + 'Page';
  const bodyJsx = roots.length > 1 ? `    <>\n${joined}\n    </>` : joined;
  const title = (source.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  const meta = title ? `\nexport const metadata = { title: ${JSON.stringify(decode(title))} };\n` : '';
  const tsx = `// Ported 1:1 from docs/prototype/${page}.html (static UI). Generated by docs/plans/tools/proto2jsx.js, then reviewed.\n${imports.join('\n')}${imports.length ? '\n' : ''}${meta}\nexport default function ${fn}() {\n  return (\n${bodyJsx}\n  );\n}\n`;
  if (dry) { process.stdout.write(tsx + '\n/* CSS */\n' + css); return; }
  const outDir = path.join(ROOT, 'src/app', dir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'page.tsx'), tsx);
  const cssPath = path.join(outDir, 'page.css');
  if (css) fs.writeFileSync(cssPath, css); else if (fs.existsSync(cssPath)) fs.unlinkSync(cssPath);
  console.log(`${page} -> src/app/${dir}/page.tsx (${tsx.length} chars${css ? ', +page.css' : ''})`);
}

module.exports = { convert, mapHref, PAGES, render, Ctx };
if (require.main === module) {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  for (const p of args.filter((a) => !a.startsWith('--'))) convert(p, { dry });
}
