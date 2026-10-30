'use client';

// Admin tools bar (search, hub, notifications, account) on every admin page but the dashboard.
// Behaviour from docs/prototype/assets/js/admin-shell.js.
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { showToast } from '@/hooks/useToast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Popover, usePopover } from '@/components/ui/Popover';
import { PmDialog } from '@/components/ui/PmDialog';
import { authService } from '@/lib/services/authService';

const HUBS = ['Mirpur', 'Gulshan', 'Uttara', 'Dhanmondi', 'Agrabad', 'Sylhet', 'Rajshahi', 'Rangpur'];
const NOTIFS = [
  { id: 'n1', title: 'New merchant waiting for KYC', text: 'Trendy Hijab House submitted documents', href: '/admin/merchants/11024', time: '12 min ago' },
  { id: 'n2', title: 'Cash short at Uttara hub', text: 'Tariq Rahman deposited ৳ 500 less', href: '/admin/finance/cod-reconciliation', time: '40 min ago' },
  { id: 'n3', title: 'Urgent ticket TK-2210', text: 'COD not received for 3 parcels', href: '/admin/support/tickets', time: '1 h ago' },
  { id: 'n4', title: 'License renews in 27 days', text: 'Contact your account manager', href: '/admin/settings/license', time: 'today' },
];
const ACCOUNT_LINKS = [
  ['Overview', '/admin/dashboard'],
  ['My team & roles', '/admin/staff'],
  ['Branding', '/admin/settings/branding'],
  ['License & system', '/admin/settings/license'],
];

const initials = (s: string) => s.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

export function AdminTopBar() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [hubRef, hub] = usePopover();
  const [bellRef, bell] = usePopover();
  const [accountRef, account] = usePopover();
  const [confirmReset, setConfirmReset] = useState(false);

  const [session] = useLocalStorage<{ name?: string; role?: string } | null>('session', null);
  const [storedHub, setHub] = useLocalStorage('admin:hub', '');
  const [read, setRead] = useLocalStorage<string[]>('admin:notifs', []);
  const me = { name: session?.name || 'Karim Ahmed', role: !session?.role || session.role === 'admin' ? 'Owner / Super admin' : session.role };
  const curHub = storedHub || 'All hubs';
  const unread = NOTIFS.filter((n) => !read.includes(n.id)).length;

  // Ctrl/⌘ K jumps to search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !e.defaultPrevented) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function chooseHub(h: string) {
    setHub(h);
    hub.close();
    hubRef.current?.focus();
    // Page scripts listen for these: mg:hub ('All hubs' or a name) and ops:hub ('' = all).
    document.dispatchEvent(new CustomEvent('mg:hub', { detail: h }));
    document.dispatchEvent(new CustomEvent('ops:hub', { detail: h === 'All hubs' ? '' : h }));
    showToast(h === 'All hubs' ? 'Showing data from all hubs' : `Showing ${h} hub`, 'info', 2000);
  }

  function resetDemo() {
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('pm:admin:') || k === 'pm:branding').forEach((k) => localStorage.removeItem(k));
    } catch {}
    location.reload();
  }

  return (
    <section className="pm-top" aria-label="Admin tools">
      <form
        className="pm-search"
        role="search"
        data-real-submit=""
        onSubmit={(e) => {
          e.preventDefault();
          const v = searchRef.current?.value.trim();
          if (!v) { searchRef.current?.focus(); showToast('Type a tracking ID, phone or name to search', 'info', 2200); return; }
          router.push('/admin/parcels?q=' + encodeURIComponent(v));
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        {' '}
        <label className="pm-sr" htmlFor="pm-q">Search parcels, merchants, riders</label>
        {' '}
        <input ref={searchRef} id="pm-q" name="q" type="search" placeholder="Search parcel, merchant, rider…" autoComplete="off" />
        {' '}
        <kbd>Ctrl K</kbd>
      </form>
      <div className="pm-tools">
        <button ref={hubRef} type="button" className="pm-tb pm-hub" aria-label={`Hub: ${curHub}`} {...hub.anchorProps} onClick={hub.toggle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 21h18" />
            <path d="M5 21V8l7-5 7 5v13" />
          </svg>
          {curHub}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <Popover anchorRef={hubRef} open={hub.open} onClose={hub.close} className="pm-pop" label="Working hub">
          <div className="pm-ph">Working hub</div>
          {['All hubs', ...HUBS].map((h) => (
            <button key={h} type="button" className={cn('pm-opt', h === curHub && 'on')} onClick={() => chooseHub(h)}>{h}</button>
          ))}
        </Popover>
        {' '}
        <button ref={bellRef} type="button" className="pm-tb pm-bell" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} {...bell.anchorProps} onClick={bell.toggle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {unread > 0 && <span className="pm-dot" aria-hidden="true">{unread}</span>}
        </button>
        <Popover anchorRef={bellRef} open={bell.open} onClose={bell.close} className="pm-pop" align="right" width={340} label="Notifications">
          <div className="pm-ph">
            Notifications
            <button type="button" onClick={() => { setRead(NOTIFS.map((n) => n.id)); bell.close(); bellRef.current?.focus(); showToast('All notifications marked as read', 'ok', 2000); }}>Mark all read</button>
          </div>
          {NOTIFS.map((n) => (
            <Link key={n.id} className={cn('pm-ni', !read.includes(n.id) && 'unread')} href={n.href} onClick={() => { setRead((r) => [...new Set([...r, n.id])]); bell.close(); }}>
              <i />
              <span><b>{n.title}</b><small>{n.text} · {n.time}</small></span>
            </Link>
          ))}
        </Popover>
        {' '}
        <button ref={accountRef} type="button" className="pm-tb pm-av" aria-label={`Account menu for ${me.name}`} {...account.anchorProps} onClick={account.toggle}>{initials(me.name)}</button>
        <Popover anchorRef={accountRef} open={account.open} onClose={account.close} className="pm-pop" align="right" width={240} label="Account">
          <div className="pm-who"><b>{me.name}</b>{me.role}</div>
          <div className="pm-sep" />
          {ACCOUNT_LINKS.map(([t, h]) => (
            <Link key={h} className="pm-opt" href={h} onClick={account.close}>{t}</Link>
          ))}
          <button type="button" className="pm-opt" onClick={() => { account.close(); setConfirmReset(true); }}>Reset demo data</button>
          <div className="pm-sep" />
          <Link className="pm-opt bad" href="/login" onClick={() => { authService.logout(); account.close(); }}>Log out</Link>
        </Popover>
      </div>
      <PmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset admin demo data?"
        validate={false}
        onSubmit={resetDemo}
        footer={<><button type="button" className="pm-btn" onClick={() => setConfirmReset(false)}>Cancel</button><button type="submit" className="pm-btn danger">Reset</button></>}
      >
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#334155' }}>
          Every change made in the admin panel (parcels, merchants, riders, payouts, branding…) goes back to the original demo data.
        </p>
      </PmDialog>
    </section>
  );
}
