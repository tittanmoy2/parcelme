# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Next.js version warning

This project runs **Next.js 16.4 / React 19.3** with `cacheComponents` and `partialPrefetching` enabled in [next.config.ts](next.config.ts). APIs and conventions differ from older Next.js. Before you write routing, caching, data-fetching or config code, read the matching guide in `node_modules/next/dist/docs/` and follow its deprecation notices. `next dev` regenerates [AGENTS.md](AGENTS.md); commit it as it is and don't strip the block it writes.

Because of `cacheComponents`, any client component that calls `usePathname()` from a layout must sit inside `<Suspense>`, or the `[id]` routes fail to build. The sidebars do this.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000 (Turbopack)
npm run build    # production build; also type-checks
npm run lint     # ESLint (flat config: next core-web-vitals + typescript)
npx tsc --noEmit # type-check only
```

The project has no test framework and no tests. Visual parity with the prototype is checked with `docs/plans/tools/vdiff.js` (see below).

## What this is

percelme is the frontend for a courier and parcel-delivery platform in Bangladesh (COD, bKash/Nagad, Taka currency). There is **no backend yet**.

- **Reference prototype:** `docs/prototype/*.html` (with `assets/tailwind.css`, `assets/core.js` and `assets/js/*.js`). It is the source of truth for the UI. `docs/prototype/` is its own nested git repository. The spec documents the commit messages refer to ("specification 02/03") are not in the repo.
- **Current state:** every prototype page is ported as a **static, pixel-matched page**: hard-coded content, no behaviour yet. The prototype's JS behaviour (filters, tabs, modals, popovers, toasts, forms) is the next phase. See `docs/plans/prototype-ui-port.md`.

## Architecture

**Route groups by user role** under `src/app/`. The prototype puts `data-area` / `data-page` on `<body>`; here they go on the first element inside `<body>`, and the CSS selectors were rewritten to match.
- `(admin)` and `(merchant)`: the layout renders the root `div[data-area]` and the sidebar (`src/components/admin/AdminSidebar.tsx` / `merchant/MerchantSidebar.tsx`). Each page renders its own `<main data-page="…">`. Admin pages, except the dashboard, start `<main>` with `<AdminTopBar />`.
- `(rider)`: the layout is `div[data-area="rider"]`, which stands in for the prototype's body and centres the phone frame. Each page renders `.rp-app` and `<RiderNav active="…" />`.
- `(public)` and `(auth)`: pass-through layouts. Each page renders its whole body root with `data-area` / `data-page`. The landing page (`(public)/page.tsx`) was hand-built from section components in `src/components/public/`. The other pages are generated.
- `app/not-found.tsx` re-exports `(public)/not-found`. `track/[id]` re-exports `track`.

**Generated pages.** Most `page.tsx` files were produced by `docs/plans/tools/proto2jsx.js` from post-JS DOM dumps of the prototype:
- Inline `style={{…}}` objects are intentional. They keep the prototype's cascade, where inline styles beat page `<style>` rules.
- A page's own CSS lives in a sibling `page.css`, scoped with `:where([data-page="X"])`.

Once a page gains hand-written behaviour, edit it directly; regenerating overwrites it.

**Styling:** Tailwind CSS v4, CSS-first, no `tailwind.config`. [src/app/globals.css](src/app/globals.css) is **generated** by `docs/plans/tools/build-globals.js` from the prototype's `tailwind.css`, so change the generator, not the file's prototype sections.
- **Preflight is off**, as in the prototype, so elements carry their own resets (`m-0`, `border-solid` and so on).
- The theme overrides Tailwind's palette with exact classic hexes: `navy`, `brand-*` (blue), `accent-*` (orange), `bkash`, `nagad`.
- Font sizes and radii are px-named (`text-13`, `rounded-14`).
- Custom variants: `upto-420…upto-900`, which are inclusive max-width, and `rider-frame`.
- Shared component classes: `.card`, `.crumb`, `pm-*` (modals, toasts, top bar, drawer), `rp-*` (rider), `m-*` (merchant), `ops-*` / `mg-*` (admin).
- Fonts come from `next/font` as `--font-jakarta` / `--font-fira`, feeding `--font-sans` / `--font-mono`.
- If the dev server serves stale CSS after `globals.css` is regenerated, change the file's content, not just its mtime.

**Data layer (mock, client-side only; not used by the static pages yet).** Services in `src/lib/services/*Service.ts` read and write `localStorage` through `src/lib/storage.ts`, using the `pm:` key prefix, the same as the prototype's `PM.store`. They fall back to seed data in `src/lib/mock-data/`. When a real API arrives, the service layer is where it plugs in. Domain types are in `src/types/`.

**Toasts** go through a global `CustomEvent` (`pm:toast`): call `showToast()` from `src/hooks/useToast.ts`, or `setFlashToast()` to show one after navigating. `<ToastContainer />` is in the root layout.

**Components:**
- `src/components/ui/`: primitives
- `src/components/shared/`: domain components
- Merge class names with `cn()` from `src/lib/utils.ts`

Use the `@/*` path alias for `src/*`.

## Task tracker

- **Done:** static 1:1 UI port of all prototype pages. Plan, tools and tracker are in `docs/plans/prototype-ui-port.md`.
- **Done:** `core.js`'s delegated handlers (`[data-modal-open]`, `[data-modal-close]`, `[data-toast]`, form submit with `data-validate` that fires `pm:submit`) live in `src/components/ui/PrototypeBehaviour.tsx`, mounted in the root layout. The dialogs already in the markup open and close; page code still has to handle `pm:submit` and open the dialogs that the area JS opens itself.
- **Done:** Register's 3-step flow (`src/app/(auth)/register/RegisterCard.tsx`, from `initRegister()` in `public.js`). It saves `pm:pendingReg` / `pm:otp` and goes to `/verify-otp?mode=register`.
- **Done:** OTP page (`src/app/(auth)/verify-otp/OtpForm.tsx`, from `initOtp()`; demo code `123456`) for `?mode=register|reset|login`. Register mode creates the account and session and opens `/merchant/dashboard`. Demo accounts, `pm:accounts`, `pm:passwords` and `pm:session` are in `src/lib/services/authService.ts`, for ForgotPassword / ResetPassword to reuse.
- **Done:** Login (`src/app/(auth)/login/LoginForm.tsx`, from `initLogin()`): role tabs, demo fill, password login to each role's home page, and "Log in with OTP" to `/verify-otp?mode=login`. All auth is mock (`localStorage`) until the backend exists. Swap `authService` for API calls then. Known gap: after a client-side navigation into the OTP page, the tab title stays the metadata title, not the per-mode one.
- **Next:** port behaviour from `docs/prototype/assets/js/*.js` page by page, wiring the pages to `src/lib/services`.
- **Done:** Merchant Settings (`src/app/(merchant)/merchant/settings/SettingsView.tsx`, from `initSettings()`). The section tabs follow the URL hash (`#payout`, `#security`, …). Profile, logo, switches, team and language persist as `pm:settings:*`. Modals use `src/components/ui/PmDialog.tsx`, the prototype's `<dialog class="pm-modal">` as a component. `useLocalStorage` now reads through `useSyncExternalStore`, which fixed its old `set-state-in-effect` lint error.
- **Done:** header popups. `src/components/ui/Popover.tsx` (`usePopover()` + `<Popover>`) stands in for `PM.popover` / merchant `dropdown()` / admin-ops `menu()`. It renders in place, not in `<body>`, so it keeps the `[data-area]` styles. Wired in `MerchantTopBar` (merchant dashboard header: search, notifications, account menu), `AdminTopBar` (hub, notifications, account, search, Ctrl K) and `AdminDashboardTools` (admin dashboard header). Log out (menus and merchant sidebar) uses `authService.logout()`. `SupportTicketDialog` sits in the merchant layout and opens from any `#ticket` link or `openSupportTicket()`. Not yet: the admin dashboard's own search box and Ctrl K.
- **Known lint errors:** `npm run lint` reports 17 `no-require-imports` errors, all in the Node scripts under `docs/plans/tools/`. `src/` has none.
- **Stop rule for long tasks:** when the user says weekly usage has reached about 75%, finish or revert the current unit of work, update this tracker and the plan, then stop.
