'use client';

// Merchant sidebar, ported from the prototype's merchant pages (docs/prototype/MerchantParcels.html).
// The dashboard variant (MerchantDashboard.html) adds the returns badge and the help card; it and CreateParcel.html
// space the links wider and point the logo at the landing page.
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { authService } from '@/lib/services/authService';
import { activeHref } from '@/components/shell/activeHref';

const HREFS = ["/merchant/dashboard","/merchant/parcels/create","/merchant/parcels","/merchant/parcels/bulk-upload","/merchant/pickups","/merchant/pickup-locations","/merchant/returns","/merchant/finance/payments","/merchant/finance/payouts","/merchant/finance/invoices","/merchant/tools/fraud-check","/merchant/tools/api-webhooks","/merchant/settings"];

export function MerchantSidebar() {
  return <MerchantSidebarView pathname={usePathname()} />;
}

/** Rendered without a pathname as the Suspense fallback while the URL is unknown during prerendering. */
export function MerchantSidebarView({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const active = activeHref(pathname, HREFS);
  const dash = pathname === '/merchant/dashboard';
  const wide = dash || pathname === '/merchant/parcels/create';
  const navClass = (href: string) => cn('nav', href === active && 'on', dash && '[&_svg]:flex-none');
  return (
    <aside className={cn('flex flex-col flex-[1_1_248px] box-border max-w-full py-5 px-3.5 border-r border-r-slate-200 bg-white pm-drawer', wide ? 'gap-1' : 'gap-0.5', open && 'open')}>
      <div className="pm-logo-row">
        <Link className={cn('flex items-center gap-2.5 pt-1 pb-4.5 px-2.5', wide && 'text-slate-900')} href={wide ? '/' : '/merchant/dashboard'}>
          <svg width="29" height="34" viewBox="0 0 48 56" aria-hidden="true">
            <circle className="fill-navy" cx="26" cy="22" r="20" />
            <rect className="fill-navy" x="6" y="22" width="11" height="32" rx="5.5" />
            <rect className="fill-accent-600" x="17" y="13" width="18" height="18" rx="3" />
            <path d="M20 13h12a3 3 0 0 1 3 3v2H17v-2a3 3 0 0 1 3-3z" fill="#9A3412" />
            <rect x="24" y="13" width="4" height="18" fill="#FED7AA" opacity=".7" />
          </svg>
          <span className="text-24 font-extrabold tracking-[-0.045em] text-navy">
            percel
            <span className="text-accent-600">me</span>
          </span>
        </Link>
        <button type="button" className="pm-menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col gap-0.5" aria-label="Merchant">
        <Link className={navClass('/merchant/dashboard')} href="/merchant/dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
          Dashboard
        </Link>
        <div className="pt-3.5 pb-1.5 px-3 uppercase text-11.5 font-bold tracking-[.09em] text-slate-500">Shipments</div>
        <Link className={navClass('/merchant/parcels/create')} href="/merchant/parcels/create">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
          Create parcel
        </Link>
        <Link className={navClass('/merchant/parcels')} href="/merchant/parcels">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          All parcels
        </Link>
        <Link className={navClass('/merchant/parcels/bulk-upload')} href="/merchant/parcels/bulk-upload">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          Bulk upload
        </Link>
        <Link className={navClass('/merchant/pickups')} href="/merchant/pickups">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <path d="M15 18H9" />
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
            <circle cx="17" cy="18" r="2" />
            <circle cx="7" cy="18" r="2" />
          </svg>
          Pickup requests
        </Link>
        <Link className={navClass('/merchant/pickup-locations')} href="/merchant/pickup-locations">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Pickup locations
        </Link>
        <Link className={navClass('/merchant/returns')} href="/merchant/returns">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Returns
            {dash && <span className="py-0.5 px-2 ml-auto rounded-full bg-red-100 text-12 font-extrabold text-red-800" aria-label="6 returns waiting">6</span>}
        </Link>
        <div className="pt-3.5 pb-1.5 px-3 uppercase text-11.5 font-bold tracking-[.09em] text-slate-500">Finance</div>
        <Link className={navClass('/merchant/finance/payments')} href="/merchant/finance/payments">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </svg>
          Payments &amp; COD
        </Link>
        <Link className={navClass('/merchant/finance/payouts')} href="/merchant/finance/payouts">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          Payout history
        </Link>
        <Link className={navClass('/merchant/finance/invoices')} href="/merchant/finance/invoices">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
          Invoices
        </Link>
        <div className="pt-3.5 pb-1.5 px-3 uppercase text-11.5 font-bold tracking-[.09em] text-slate-500">Tools</div>
        <Link className={navClass('/merchant/tools/fraud-check')} href="/merchant/tools/fraud-check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          Fraud check
        </Link>
        <Link className={navClass('/merchant/tools/api-webhooks')} href="/merchant/tools/api-webhooks">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          API &amp; webhooks
        </Link>
        <Link className={navClass('/merchant/settings')} href="/merchant/settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 7h-9" />
            <path d="M14 17H5" />
            <circle cx="17" cy="17" r="3" />
            <circle cx="7" cy="7" r="3" />
          </svg>
          Settings
        </Link>
      </nav>
      {dash && (
        <div className="flex flex-col gap-2.5 p-4 mt-6 rounded-16 bg-brand-50">
          <b className="text-14">Need help?</b>
          <span className="text-13 leading-[1.5] text-slate-700">Your account manager: Farhana · 09610-000000</span>
          <a className="text-13 font-extrabold" href="#ticket">Open support ticket</a>
        </div>
      )}
      <button type="button" className="m-logout" onClick={() => { authService.logout(); router.push('/login'); }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
        Log out
      </button>
    </aside>
  );
}
