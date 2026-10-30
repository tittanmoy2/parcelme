'use client';

// Admin sidebar, ported from the prototype's admin pages (docs/prototype/AdminAssign.html).
// AdminDashboard and AdminParcels use a slightly taller variant of the links in the prototype.
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { activeHref } from '@/components/shell/activeHref';

const HREFS = ["/admin/dashboard","/admin/parcels","/admin/operations/pickups","/admin/operations/assign","/admin/operations/hubs","/admin/operations/hub-transfers","/admin/operations/scan-station","/admin/merchants","/admin/riders","/admin/staff","/admin/finance/cod-reconciliation","/admin/finance/payouts","/admin/analytics/reports","/admin/support/tickets","/admin/settings/pricing","/admin/settings/coverage","/admin/settings/sms","/admin/settings/branding","/admin/settings/license"];
const TALL = ['/admin/dashboard', '/admin/parcels'];

export function AdminSidebar() {
  return <AdminSidebarView pathname={usePathname()} />;
}

/** Rendered without a pathname as the Suspense fallback while the URL is unknown during prerendering. */
export function AdminSidebarView({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const active = activeHref(pathname, HREFS);
  const tall = pathname != null && TALL.includes(pathname);
  const navClass = (href: string) => cn('nav', href === active && 'on', tall && 'h-10.5');
  return (
    <aside className={cn('flex flex-col flex-[1_1_252px] box-border max-w-full py-5 px-3.5 bg-slate-900 pm-drawer', tall ? 'gap-0.5' : 'gap-px', open && 'open')}>
      <div className="pm-logo-row">
        <Link className={cn('flex items-center gap-2.5 pt-1 pb-3.5 px-2.5', tall && 'text-white')} href="/admin/dashboard">
          <svg width="29" height="34" viewBox="0 0 48 56" aria-hidden="true">
            <circle cx="26" cy="22" r="20" fill="#FFFFFF" />
            <rect x="6" y="22" width="11" height="32" rx="5.5" fill="#FFFFFF" />
            <rect className="fill-accent-600" x="17" y="13" width="18" height="18" rx="3" />
            <path d="M20 13h12a3 3 0 0 1 3 3v2H17v-2a3 3 0 0 1 3-3z" fill="#9A3412" />
            <rect x="24" y="13" width="4" height="18" fill="#FED7AA" opacity=".7" />
          </svg>
          <span className="text-24 font-extrabold tracking-[-0.045em] text-white">
            percel
            <span className="text-accent-400">me</span>
          </span>
          <span className="py-0.5 px-1.5 ml-auto border border-solid border-orange-900 rounded-6 text-10.5 font-extrabold tracking-[.08em] text-accent-300">
            ADMIN
          </span>
        </Link>
        <button type="button" className="pm-menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col gap-px" aria-label="Admin">
        <Link className={navClass('/admin/dashboard')} href="/admin/dashboard">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
          Overview
        </Link>
        <div className={cn('navh', tall && 'pt-4')}>Operations</div>
        <Link className={navClass('/admin/parcels')} href="/admin/parcels">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          Parcels
        </Link>
        <Link className={navClass('/admin/operations/pickups')} href="/admin/operations/pickups">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <path d="M15 18H9" />
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
            <circle cx="17" cy="18" r="2" />
            <circle cx="7" cy="18" r="2" />
          </svg>
          Pickups
        </Link>
        <Link className={navClass('/admin/operations/assign')} href="/admin/operations/assign">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Delivery assign
        </Link>
        <Link className={navClass('/admin/operations/hubs')} href="/admin/operations/hubs">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 21h18" />
            <path d="M5 21V8l7-5 7 5v13" />
            <path d="M9 21v-6h6v6" />
          </svg>
          Hubs
        </Link>
        <Link className={navClass('/admin/operations/hub-transfers')} href="/admin/operations/hub-transfers">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 3 4 7l4 4" />
            <path d="M4 7h16" />
            <path d="m16 21 4-4-4-4" />
            <path d="M20 17H4" />
          </svg>
          Hub transfer
        </Link>
        <Link className={navClass('/admin/operations/scan-station')} href="/admin/operations/scan-station">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <path d="M7 12h10" />
          </svg>
          Scan station
        </Link>
        <div className={cn('navh', tall && 'pt-4')}>People</div>
        <Link className={navClass('/admin/merchants')} href="/admin/merchants">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9h18l-2-5H5z" />
            <path d="M5 9v11h14V9" />
            <path d="M10 20v-6h4v6" />
          </svg>
          Merchants
        </Link>
        <Link className={navClass('/admin/riders')} href="/admin/riders">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18.5" cy="17.5" r="3.5" />
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="15" cy="5" r="1" />
            <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
          </svg>
          Riders
        </Link>
        <Link className={navClass('/admin/staff')} href="/admin/staff">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Staff &amp; roles
        </Link>
        <div className={cn('navh', tall && 'pt-4')}>Finance</div>
        <Link className={navClass('/admin/finance/cod-reconciliation')} href="/admin/finance/cod-reconciliation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </svg>
          COD reconciliation
        </Link>
        <Link className={navClass('/admin/finance/payouts')} href="/admin/finance/payouts">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          Merchant payouts
        </Link>
        <Link className={navClass('/admin/analytics/reports')} href="/admin/analytics/reports">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
          Reports
        </Link>
        <Link className={navClass('/admin/support/tickets')} href="/admin/support/tickets">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Support tickets
        </Link>
        <div className={cn('navh', tall && 'pt-4')}>Setup</div>
        <Link className={navClass('/admin/settings/pricing')} href="/admin/settings/pricing">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l8.59-8.59a1 1 0 0 0 0-1.41z" />
            <circle cx="7" cy="7" r="1.5" />
          </svg>
          Pricing &amp; zones
        </Link>
        <Link className={navClass('/admin/settings/coverage')} href="/admin/settings/coverage">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Coverage areas
        </Link>
        <Link className={navClass('/admin/settings/sms')} href="/admin/settings/sms">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="14" height="20" x="5" y="2" rx="2" />
            <path d="M12 18h.01" />
          </svg>
          SMS templates
        </Link>
        <Link className={navClass('/admin/settings/branding')} href="/admin/settings/branding">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="13.5" cy="6.5" r="1.5" />
            <circle cx="17.5" cy="10.5" r="1.5" />
            <circle cx="8.5" cy="7.5" r="1.5" />
            <circle cx="6.5" cy="12.5" r="1.5" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>
          Branding
        </Link>
        <Link className={navClass('/admin/settings/license')} href="/admin/settings/license">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="11" x="3" y="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          License &amp; system
        </Link>
      </nav>
    </aside>
  );
}
