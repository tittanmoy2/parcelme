// Builds src/app/globals.css from the prototype's assets/tailwind.css.
// Run from the repo root: node docs/plans/tools/build-globals.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
let css = fs.readFileSync(path.join(ROOT, 'docs/prototype/assets/tailwind.css'), 'utf8').replace(/\r\n/g, '\n');

const fonts = (s) =>
  s
    .replace(/'Plus Jakarta Sans',\s*sans-serif/g, 'var(--font-sans)')
    .replace(/'Fira Code',\s*monospace/g, 'var(--font-mono)');

// Header: no preflight (the prototype runs without it), automatic source detection.
css = css.replace(/^[\s\S]*?@layer theme, base, components, utilities;/, '@layer theme, base, components, utilities;');
css = css.replace('@import "tailwindcss/utilities.css" layer(utilities) source(none);', '@import "tailwindcss/utilities.css" layer(utilities);');
css = css.replace(/^@source .*$/m, '');
css = css.replace(/^\/\* Preflight .*$/m, '/* Preflight is OFF, as in the prototype. Elements carry their own resets. */');

// Keep Tailwind's default palette/sizes (other code uses them); the prototype's exact hexes override the same names.
css = css.replace(/^\s*--(color|text|radius)-\*: initial;\n/gm, '');
// Tokens the landing page uses that the prototype theme lacks.
css = css.replace('--text-28: 28px;', '--text-27: 27px;\n  --text-28: 28px;');
css = css.replace('--radius-32: 32px;', '--radius-28: 28px;\n  --radius-32: 32px;');
css = css.replace('--color-accent-600: #EA580C;', '--color-accent-600: #EA580C;\n  --color-accent-800: #9A3412;');

// The prototype puts data-area / data-page on <body>; here they sit on the first element inside <body>.
css = css.replace(':root:has(> body[data-area="public"])', ':root:has([data-area="public"])');
css = css.replace(/body:not\(\[data-page="Landing"\]\)/g, '[data-area]:not([data-page="Landing"])');
css = css.replace(/body\[data-(area|page)=/g, '[data-$1=');

css = fonts(css);
css = css.replace('--font-sans: var(--font-sans);', "--font-sans: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;").replace('--font-mono: var(--font-mono);', "--font-mono: var(--font-fira), 'Fira Code', monospace;");
css = css.replace('different, so the defaults are cleared and only the colours in use are defined.', 'different, so the colours in use are redefined here (other defaults stay available).');

const header = `/* Generated from docs/prototype/assets/tailwind.css by docs/plans/tools/build-globals.js.
   Edit the generator (or the prototype) rather than this file's prototype sections. */
`;
fs.writeFileSync(path.join(ROOT, 'src/app/globals.css'), header + css);
console.log('globals.css written', css.length);
