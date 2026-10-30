'use client';

// The admin dashboard header's buttons: hub picker, date, notifications and the account menu.
// Behaviour from initHeader() in docs/prototype/assets/js/admin-ops.js, styled with its ops-menu.
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { showToast } from '@/hooks/useToast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Popover, usePopover } from '@/components/ui/Popover';
import { authService } from '@/lib/services/authService';

const HUBS = [
  ['Tejgaon Central', 'Sorting hub · Dhaka'],
  ['Mirpur', 'Delivery hub · Dhaka'],
  ['Gulshan', 'Delivery hub · Dhaka'],
  ['Agrabad', 'Regional hub · Chattogram'],
  ['Zindabazar', 'Regional hub · Sylhet'],
  ['Rangpur Sadar', 'Regional hub · Rangpur'],
  ['Uttara', 'Delivery hub · Dhaka'],
  ['Dhanmondi', 'Delivery hub · Dhaka'],
  ['Rajshahi', 'Regional hub · Rajshahi'],
  ['Khulna', 'Regional hub · Khulna'],
  ['Barishal', 'Regional hub · Barishal'],
  ['Mymensingh', 'Regional hub · Mymensingh'],
];
const NOTIFS = [
  { t: '142 parcels delayed > 72h', s: 'Rangpur & Barishal hubs · 10 min ago', href: '/admin/parcels?status=athub' },
  { t: 'Bag TJ-RP-2410-02 short 3 parcels', s: 'Rangpur Sadar · 08:15 AM', href: '/admin/operations/hub-transfers' },
  { t: '23 pickup requests unassigned', s: 'Pickups · 25 min ago', href: '/admin/operations/pickups' },
  { t: 'Shahin Alam is almost full', s: '37 of 40 parcels · Mirpur hub', href: '/admin/operations/assign' },
  { t: '5 merchants waiting KYC', s: 'Oldest submitted 2 days ago', href: '/admin/merchants' },
];

const initials = (s: string) => s.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

function Item({ label, sub, on, dot, onClick }: { label: ReactNode; sub?: string; on?: boolean; dot?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className={cn('ops-mi', on && 'on')} role="menuitem" onClick={onClick}>
      {dot !== undefined && (dot ? <span className="dot" aria-label="Unread" /> : <span className="nodot" />)}
      <span>{label}{sub && <small>{sub}</small>}</span>
      {on && <span className="ck" aria-hidden="true">✓</span>}
    </button>
  );
}

export function AdminDashboardTools() {
  const router = useRouter();
  const [hubRef, hub] = usePopover();
  const [bellRef, bell] = usePopover();
  const [accountRef, account] = usePopover();

  const [session] = useLocalStorage<{ name?: string } | null>('session', null);
  const [storedHub, setHub] = useLocalStorage('admin:hub', '');
  const [notifRead, setNotifRead] = useLocalStorage('admin:notifRead', false);
  const me = session?.name || 'Karim Ahmed';
  const cur = storedHub === 'All hubs' ? '' : storedHub;

  function choose(h: string) {
    hub.close();
    setHub(h || 'All hubs');
    showToast(h ? `Showing ${h} hub` : 'Showing all hubs', 'info', 2000);
    document.dispatchEvent(new CustomEvent('ops:hub', { detail: h }));
  }
  const go = (href: string) => { bell.close(); account.close(); router.push(href); };

  return (
    <div className="flex items-center gap-2.5 ml-auto">
      <button ref={hubRef} className="flex items-center gap-2 h-11 py-0 px-3.5 border border-solid border-slate-300 rounded-12 bg-white font-sans text-14 font-bold leading-[normal] text-slate-900 cursor-pointer" type="button" aria-label="Choose hub" {...hub.anchorProps} onClick={hub.toggle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21h18" />
          <path d="M5 21V8l7-5 7 5v13" />
        </svg>
        {cur ? `${cur} hub` : 'All hubs'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <Popover anchorRef={hubRef} open={hub.open} onClose={hub.close} className="ops-menu" label="Hub">
        <h3>Hub</h3>
        <Item label="All hubs" sub={`${HUBS.length} hubs`} on={!cur} onClick={() => choose('')} />
        <div className="ops-sep" role="separator" />
        {HUBS.map(([name, sub]) => <Item key={name} label={name} sub={sub} on={cur === name} onClick={() => choose(name)} />)}
      </Popover>
      <button className="h-11 py-0 px-3.5 border border-solid border-slate-300 rounded-12 bg-white font-sans text-14 font-bold leading-[normal] text-slate-900 cursor-pointer" type="button" aria-label="Choose date range">
        Oct 10, 2026
      </button>
      <button ref={bellRef} className="flex items-center justify-center w-11 h-11 border border-solid border-slate-300 rounded-12 bg-white cursor-pointer relative" type="button" aria-label={notifRead ? 'Notifications' : `Notifications, ${NOTIFS.length} unread`} {...bell.anchorProps} onClick={bell.toggle}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <span className="ops-bell-dot" aria-hidden="true" hidden={notifRead} />
      </button>
      <Popover anchorRef={bellRef} open={bell.open} onClose={bell.close} className="ops-menu" align="right" label="Notifications">
        <h3>Notifications</h3>
        {NOTIFS.map((n) => <Item key={n.t} label={n.t} sub={n.s} dot={!notifRead} onClick={() => go(n.href)} />)}
        <div className="ops-sep" role="separator" />
        <Item
          label={notifRead ? 'All caught up' : 'Mark all as read'}
          onClick={() => { bell.close(); setNotifRead(true); showToast('Notifications marked as read', 'ok', 2000); }}
        />
      </Popover>
      <button ref={accountRef} type="button" className="av flex items-center justify-center flex-none w-11 h-11 rounded-12 bg-brand-100 text-13 font-extrabold text-brand-700 border-0 cursor-pointer [font-family:inherit]" aria-label={`Account menu for ${me}`} {...account.anchorProps} onClick={account.toggle}>
        {initials(me)}
      </button>
      <Popover anchorRef={accountRef} open={account.open} onClose={account.close} className="ops-menu" align="right" label="Account">
        <Item label={me} sub="Super admin · percelme Courier" />
        <div className="ops-sep" role="separator" />
        <Item label="Staff & roles" onClick={() => go('/admin/staff')} />
        <Item label="Branding & settings" onClick={() => go('/admin/settings/branding')} />
        <div className="ops-sep" role="separator" />
        <Item label="Log out" onClick={() => { authService.logout(); go('/login'); }} />
      </Popover>
    </div>
  );
}
