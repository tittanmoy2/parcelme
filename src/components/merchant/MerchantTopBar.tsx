'use client';

// The merchant dashboard's top bar: search, notifications and the account menu
// (initShell() in docs/prototype/assets/js/merchant.js).
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { showToast } from '@/hooks/useToast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Popover, usePopover } from '@/components/ui/Popover';
import { openSupportTicket } from '@/components/merchant/SupportTicketDialog';
import { authService } from '@/lib/services/authService';

const NOTES = [
  ['PM-2410-6B9Q77 delivered', 'Sadia Islam · ৳ 990 collected', '12 min ago', '/merchant/parcels/PM-2410-6B9Q77'],
  ['Pickup rider assigned', 'Jamal Khan · today 4 – 6 PM', '1 h ago', '/merchant/pickups'],
  ['6 returns ready at Gulshan hub', 'Confirm when you receive them', '3 h ago', '/merchant/returns'],
  ['Weekly payout scheduled', '৳ 84,620 to bKash on Sunday', 'Yesterday', '/merchant/finance/payouts'],
];

const initials = (s: string) => s.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function MerchantTopBar() {
  const router = useRouter();
  const [notifRef, notif] = usePopover();
  const [profileRef, profile] = usePopover();
  const [notifRead, setNotifRead] = useLocalStorage('merchant:notifRead', false);
  const [settings] = useLocalStorage<{ business?: string } | null>('settings:profile', null);
  const business = settings?.business || 'Shopnil Fashion';

  function logout() {
    authService.logout();
    router.push('/login');
  }

  return (
    <header className="flex items-center gap-3.5 h-18 py-0 px-7 border-b border-b-slate-200 bg-white">
      <label className="flex items-center flex-1 gap-2.5 h-11 max-w-[420px] py-0 px-3.5 rounded-12 bg-slate-100 upto-640:order-3 upto-640:flex-[1_1_100%] upto-640:max-w-none" id="m-search-wrap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="absolute w-px h-px overflow-hidden [clip:rect(0_0_0_0)]">Search parcels</span>
        <input
          className="flex-1 min-w-0 border-0 bg-transparent font-sans text-14 font-medium leading-[normal] outline-none"
          id="m-search"
          type="search"
          enterKeyHint="search"
          placeholder="Search by tracking ID, phone or name"
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            const q = e.currentTarget.value.trim();
            router.push('/merchant/parcels' + (q ? '?q=' + encodeURIComponent(q) : ''));
          }}
        />
      </label>
      <div className="flex items-center gap-2.5 ml-auto relative">
        <Link className="flex items-center gap-2 h-11 py-0 px-4.5 rounded-12 bg-accent-500 text-14 font-extrabold text-stone-900" href="/merchant/parcels/create">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Create parcel
        </Link>
        <button ref={notifRef} className="flex relative items-center justify-center w-11 h-11 border border-solid border-slate-200 rounded-12 bg-white cursor-pointer" type="button" id="m-notif" aria-label="Notifications" {...notif.anchorProps} onClick={notif.toggle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-[9px] right-2.5 w-2 h-2 border-2 border-solid border-white rounded-[50%] bg-accent-600" hidden={notifRead} />
        </button>
        <Popover anchorRef={notifRef} open={notif.open} onClose={notif.close} className="m-menu" align="right" label="Notifications">
          <div className="mh">
            <span>Notifications</span>
            <button type="button" className="m-btn sm" onClick={() => { setNotifRead(true); showToast('All notifications marked as read', 'ok'); }}>Mark all read</button>
          </div>
          {NOTES.map(([title, sub, when, href]) => (
            <Link key={title} className={cn('mn mi', notifRead && 'read')} role="menuitem" href={href} onClick={notif.close}>
              <i />
              <span><b>{title}</b><small>{sub} · {when}</small></span>
            </Link>
          ))}
        </Popover>
        <div className="relative">
          <button ref={profileRef} className="flex items-center gap-2.5 py-0 pr-0 pl-1.5 border-0 bg-transparent text-left text-inherit [font:inherit] cursor-pointer" type="button" id="m-profile" aria-label="Account menu" {...profile.anchorProps} onClick={profile.toggle}>
            <span className="flex items-center justify-center w-10 h-10 rounded-12 bg-accent-100 font-extrabold text-orange-800">{initials(business)}</span>
            <div className="m-hide-sm leading-[1.25]">
              <div className="text-14 font-extrabold" data-biz="">{business}</div>
              <div className="text-12 text-slate-600">Merchant · ID 10482</div>
            </div>
          </button>
          <Popover anchorRef={profileRef} open={profile.open} onClose={profile.close} className="m-menu" align="right" label="Account menu">
            <div className="mh">
              <span>{business}<br /><small className="font-medium text-slate-500">Merchant ID 10482</small></span>
            </div>
            <Link className="mi" role="menuitem" href="/merchant/settings" onClick={profile.close}>Account settings</Link>
            <Link className="mi" role="menuitem" href="/merchant/finance/payouts" onClick={profile.close}>Payout history</Link>
            <button type="button" className="mi" role="menuitem" onClick={() => { profile.close(); openSupportTicket(); }}>Contact support</button>
            <button type="button" className="mi text-red-800" role="menuitem" onClick={logout}>Log out</button>
          </Popover>
        </div>
      </div>
    </header>
  );
}
