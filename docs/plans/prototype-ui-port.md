# Plan: port the prototype UI 1:1 into Next.js (static)

**Status: DONE (2026-10-24).** Every page in `docs/prototype/*.html` now has a static, pixel-matched Next.js page. Behaviour (filters, modals, storage) is not ported. That is the next phase.

## How it was done

Hand-porting 53 pages was replaced by a mechanical pipeline:

1. **DOM snapshots.** Headless Chrome runs each prototype page (JS included) and dumps the final DOM to `docs/plans/dom/<Page>.html`. This captures content the area scripts render (lists, the admin top bar, drawer markup, injected `<style>`).
2. **Converter.** `docs/plans/tools/proto2jsx.js` turns a dump into `src/app/<route>/page.tsx` (+ `page.css`):
   - Tailwind classes are copied verbatim.
   - Inline `style=""` becomes a `style={{}}` object. This is deliberate: it keeps the prototype's cascade exactly, because inline styles beat page `<style>` rules.
   - Page `<style>` blocks (including JS-injected ones) go to `page.css`, scoped with `:where([data-page="X"])`.
   - Links: `Foo.html?id=…` becomes the Next route (`Link`). Dialogs from the design are kept, and JS-created dialogs are dropped.
   - Whitespace between inline elements is kept as `{' '}`. `<pre>` is kept verbatim.
   - `value`/`checked`/`selected` become `defaultValue`/`defaultChecked`.
3. **Global CSS.** `docs/plans/tools/build-globals.js` generates `src/app/globals.css` from `docs/prototype/assets/tailwind.css`:
   - Preflight is OFF, as in the prototype.
   - Exact hex palette, px text sizes and radii, plus the `upto-*` / `rider-frame` / `hover` variants.
   - All shared `pm-*` / `rp-*` / `m-*` / `ops-*` / `mg-*` component classes.
   - `body[data-area]` selectors are rewritten to `[data-area]`.
4. **Shells.**
   - `(admin)` and `(merchant)` layouts render the root `div[data-area]` and the sidebar (`AdminSidebar` / `MerchantSidebar`, client, `usePathname` inside `Suspense`). Sidebar variants: admin dashboard/parcels use taller links; merchant dashboard/create-parcel use wider spacing, and the dashboard adds the badge and help card.
   - Each page renders its own `<main data-page>`.
   - Admin pages include `<AdminTopBar />`.
   - Rider pages render `.rp-app` with `<RiderNav active>`.
   - Public and auth pages render the whole body root with `data-area` / `data-page`.
5. **Verification.** `docs/plans/tools/vdiff.js` screenshots the prototype and the route and reports the % of differing pixels. The baseline is about 0.04% at 1440px and 0.21% at 390px (the Next dev badge). All pages are at baseline, except AdminHubTransfer (about 0.3%, from font-load timing in the headless screenshot; live measurements are identical).

## Tools (run from repo root)

| Task | Command |
|---|---|
| Re-dump one page's DOM | `"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --virtual-time-budget=3000 --window-size=1440,900 --dump-dom "file:///D:/Personal%20Projects/percelme/docs/prototype/X.html" > docs/plans/dom/X.html` |
| Regenerate a page | `node docs/plans/tools/proto2jsx.js X` (`--dry` to print) |
| JSX for one element | `node docs/plans/tools/fragment.js X "css selector"` |
| Regenerate globals.css | `node docs/plans/tools/build-globals.js` |
| Visual diff (dev server on :3000) | `node docs/plans/tools/vdiff.js --port 3000 [--w 390 --h 1400] X Y …` → `docs/plans/shots/` |
| Side-by-side crop | `node docs/plans/tools/sbs.js X left top width height [scale]` |

⚠ Regenerating a page overwrites manual edits to it. After the behaviour phase starts, edit pages by hand instead.
⚠ If the dev server serves stale CSS after `globals.css` changes, change the file's content (not just its mtime).

## Page tracker

`[x]` = ported and visually verified (1440px; 390px spot-checked on every area).

- Auth: [x] Login · [x] Register · [x] OtpVerify · [x] ForgotPassword · [x] ResetPassword
- Public: [x] index (landing, hand-built earlier; navbar `pub-hide-xs`, stats placeholders and hero shadow fixed to match) · [x] Tracking (`/track` and `/track/[id]`) · [x] Coverage · [x] Contact · [x] NotFound (`/not-found` and the app 404) · [x] DesignSystem
- Merchant (14): [x] all
- Admin (22): [x] all
- Rider (7): [x] all
- Skipped: `index_old.html`

## Next phase (started)

Done: the global handlers from `core.js` (modal open/close, `data-toast`, validated submit → `pm:submit`) are in `src/components/ui/PrototypeBehaviour.tsx`.

Port behaviour from `docs/prototype/assets/js/*.js` page by page:
- tabs and filters
- modals (`data-modal-open`)
- popovers (hub, notifications, account)
- toasts (`showToast`)
- forms

Pages will need `'use client'` (or client islands) and the data from `src/lib/services`.
