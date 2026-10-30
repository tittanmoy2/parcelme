'use client';

// Behaviour from initSettings() in docs/prototype/assets/js/merchant.js. The section tabs follow
// the URL hash (/merchant/settings#security), and settings persist in localStorage
// (pm:settings:*) until the backend exists.
import Link from 'next/link';
import { useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { showToast } from '@/hooks/useToast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PmDialog } from '@/components/ui/PmDialog';
import { setFieldError, validateForm } from '@/components/ui/PrototypeBehaviour';

const TABS = [
  { id: 'profile', label: 'Business profile' },
  { id: 'payout', label: 'Payout accounts' },
  { id: 'team', label: 'Team members' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'language', label: 'Language · ভাষা' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const btn = 'inline-flex items-center justify-center gap-2 h-11 py-0 px-4 border border-solid rounded-12 whitespace-nowrap font-sans text-14 font-bold leading-[normal] cursor-pointer';
const btnLight = cn(btn, 'border-slate-300 bg-white text-slate-900');
const btnPrimary = cn(btn, 'border-brand-600 bg-brand-600 text-white');
const tabCls = 'flex items-center gap-2.5 h-11 py-0 px-3.5 rounded-11 text-14 font-semibold text-slate-700 [&.on]:bg-white [&.on]:font-extrabold [&.on]:text-brand-700 [&.on]:shadow-[0_1px_3px_rgba(15,23,42,.1)] [&:not(.on)]:hover:text-brand-900 hover:bg-[#fff8] [&.on:hover]:bg-[#fff8]';
const panelCls = 'flex flex-col flex-[999_1_520px] gap-5 min-w-0';
const fld = 'flex flex-col gap-[7px] text-14 font-bold';
const inp = 'box-border w-full h-11.5 py-0 px-3.5 border border-solid border-slate-300 rounded-12 bg-white font-sans text-15 font-medium leading-[normal] text-slate-900';
const grid = 'grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4';
const rowCls = 'flex items-center gap-3.5 py-3.5 px-0 border-t border-t-slate-100';

/* ---------- section tabs, kept in the URL hash ---------- */

function subscribeHash(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
function useHashTab(): TabId {
  const hash = useSyncExternalStore(subscribeHash, () => location.hash.slice(1), () => '');
  return TABS.some((t) => t.id === hash) ? (hash as TabId) : 'profile';
}

/* ---------- demo data ---------- */

const PROFILE_SEED = {
  business: 'Shopnil Fashion',
  owner: 'Tanvir Ahmed',
  phone: '01712-345678',
  email: 'hello@shopnil.com.bd',
  facebook: 'facebook.com/shopnilfashion',
  website: 'shopnil.com.bd',
  address: 'House 12, Road 5, Gulshan 1, Dhaka 1212',
};
type Profile = typeof PROFILE_SEED;

// Stored as [name, role, access, avatarBg, avatarFg], the prototype's format.
type Member = [string, string, string, string, string];
const TEAM_SEED: Member[] = [
  ['Tanvir Ahmed', 'Owner', 'Full access', '#DBEAFE', '#1D4ED8'],
  ['Rahim Uddin', 'Staff', 'Create parcels, pickups', '#CCFBF1', '#115E59'],
  ['Mithila Khan', 'Accounts', 'Payments view only', '#FFEDD5', '#9A3412'],
];
const AV_TONE: Record<string, string> = {
  '#DBEAFE': 'bg-brand-100 text-brand-700',
  '#CCFBF1': 'bg-teal-100 text-teal-800',
  '#FFEDD5': 'bg-accent-100 text-orange-800',
  '#F1F5F9': 'bg-slate-100 text-slate-700',
};
const ROLES: Record<string, string> = {
  Staff: 'Create parcels, pickups',
  Accounts: 'Payments view only',
  Manager: 'Everything except payouts',
};

// Switch defaults as shipped in the markup; pm:settings:alerts overrides them.
const SWITCH_DEFAULTS: Record<string, boolean> = { delivered: true, failed: true, payout: true, summary: false, pickup: true, returns: true, twofa: true };
const ALERTS = [
  { key: 'delivered', title: 'Parcel delivered', sub: 'SMS to my customer', label: 'Parcel delivered alerts' },
  { key: 'failed', title: 'Delivery failed', sub: 'Email to me', label: 'Delivery failed alerts' },
  { key: 'payout', title: 'Payout sent', sub: 'SMS + email to me', label: 'Payout alerts' },
  { key: 'summary', title: 'Daily summary', sub: 'Email at 9 PM', label: 'Daily summary' },
  { key: 'pickup', title: 'Pickup rider assigned', sub: 'SMS to me', label: 'Pickup rider alerts' },
  { key: 'returns', title: 'Return ready at hub', sub: 'SMS to me', label: 'Return ready alerts' },
];

interface PayoutAccount { badge: string; name: string; detail: string; badgeCls: string; primary?: boolean }
const ACCOUNTS_SEED: PayoutAccount[] = [
  { badge: 'bK', name: 'bKash Merchant', detail: '017••••5678 · Tanvir Ahmed · verified', badgeCls: 'bg-bkash text-13 text-white', primary: true },
  { badge: 'BRAC', name: 'BRAC Bank', detail: 'A/C ••••••4410 · Gulshan branch · verified', badgeCls: 'bg-slate-100 text-12 text-slate-700' },
];

const METER = [
  ['bg-slate-200', ''],
  ['bg-red-600', 'Weak'],
  ['bg-[#EA580C]', 'Fair'],
  ['bg-[#2563EB]', 'Good'],
  ['bg-green-600', 'Strong'],
];

const initials = (s: string) => String(s || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const digits = (s: string) => s.replace(/\D/g, '');
const fmtPhone = (s: string) => { const d = digits(s); return d.length === 11 ? d.slice(0, 5) + '-' + d.slice(5) : s; };

interface Confirm { title: string; text: string; ok: string; danger?: boolean; onOk: () => void }

export function SettingsView() {
  const tab = useHashTab();

  const [saved, setSaved] = useLocalStorage<Profile>('settings:profile', PROFILE_SEED);
  const [draft, setDraft] = useState<Profile | null>(null);
  const profile = { ...PROFILE_SEED, ...saved, ...draft };
  const [logo, setLogo] = useLocalStorage<string | null>('settings:logo', null);
  const [alerts, setAlerts] = useLocalStorage<Record<string, boolean>>('settings:alerts', {});
  const [team, setTeam] = useLocalStorage<Member[]>('settings:team', TEAM_SEED);
  const [lang, setLang] = useLocalStorage<string>('settings:lang', 'en');
  const [accounts, setAccounts] = useState(ACCOUNTS_SEED);
  const [othersSignedOut, setOthersSignedOut] = useState(false);
  const [strength, setStrength] = useState<number | null>(null);

  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const profileRef = useRef<HTMLFormElement>(null);
  const passRef = useRef<HTMLFormElement>(null);
  const logoInRef = useRef<HTMLInputElement>(null);

  /* profile */
  function onProfileInput(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setDraft((d) => ({ ...profile, ...d, [name]: value }));
  }
  function saveProfile() {
    if (!profileRef.current || !validateForm(profileRef.current)) {
      showToast('Please fix the highlighted fields', 'error');
      return;
    }
    setSaved(profile);
    setDraft(null);
    showToast('Business profile saved', 'ok');
  }
  function clearProfileErrors() {
    profileRef.current?.querySelectorAll('.pm-err').forEach((e) => e.remove());
    profileRef.current?.querySelectorAll('.pm-invalid').forEach((e) => { e.classList.remove('pm-invalid'); e.removeAttribute('aria-invalid'); });
  }

  /* logo */
  function onLogo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(png|jpe?g)$/.test(file.type)) { showToast('Use a PNG or JPG image', 'error'); return; }
    if (file.size > 1024 * 1024) { showToast('Logo must be under 1 MB', 'error'); return; }
    const fr = new FileReader();
    fr.onload = () => {
      setLogo(fr.result as string);
      showToast('Logo updated. It will appear on new labels.', 'ok');
    };
    fr.readAsDataURL(file);
  }
  function removeLogo() {
    if (!logo) { showToast('No custom logo to remove', 'info'); return; }
    setConfirm({
      title: 'Remove logo?', text: 'Labels will show your business initials instead.', ok: 'Remove', danger: true,
      onOk: () => { setLogo(null); showToast('Logo removed', 'ok'); },
    });
  }

  /* switches */
  const isOn = (key: string) => (key in alerts ? alerts[key] : SWITCH_DEFAULTS[key]);
  function flip(key: string, label: string) {
    const v = !isOn(key);
    setAlerts((a) => ({ ...a, [key]: v }));
    showToast(`${label} turned ${v ? 'on' : 'off'}`, 'ok', 1800);
  }
  const toggle = (key: string, label: string) => (
    <span
      className="sw group relative flex-none w-11 h-6.5 rounded-full bg-slate-300 aria-checked:bg-brand-600 m-sw"
      role="switch"
      aria-checked={isOn(key)}
      aria-label={label}
      data-key={key}
      tabIndex={0}
      onClick={() => flip(key, label)}
      onKeyDown={(e: KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(key, label); } }}
    >
      <span className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.2)] group-aria-checked:left-auto group-aria-checked:right-[3px] rounded-[50%]" />
    </span>
  );
  const alertRow = (a: (typeof ALERTS)[number]) => (
    <div key={a.key} className={rowCls}>
      <div className="flex-1 text-14">
        <b>{a.title}</b>
        <div className="text-12.5 text-slate-600">{a.sub}</div>
      </div>
      {toggle(a.key, a.label)}
    </div>
  );

  /* team */
  function removeMember(i: number) {
    const m = team[i];
    setConfirm({
      title: `Remove ${m[0]}?`, text: 'They lose access to this merchant account right away.', ok: 'Remove member', danger: true,
      onOk: () => { setTeam((t) => t.filter((_, j) => j !== i)); showToast(`${m[0]} removed`, 'ok'); },
    });
  }
  function onInvite(f: HTMLFormElement) {
    const el = f.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement>;
    const role = el.role.value;
    setTeam((t) => [...t, [el.name.value.trim(), role, ROLES[role], '#F1F5F9', '#334155']]);
    setInviteOpen(false);
    showToast(`Invite sent to ${fmtPhone(el.phone.value)}`, 'ok');
  }
  const teamList = (full: boolean) =>
    team.map((m, i) => (
      <div key={`${m[0]}-${i}`} className="flex items-center gap-3 py-3 px-0 border-t border-t-slate-100">
        <span className={cn('flex items-center justify-center w-9.5 h-9.5 rounded-full text-13 font-extrabold', AV_TONE[m[3]] || AV_TONE['#F1F5F9'])}>{initials(m[0])}</span>
        <div className="flex-1 text-14">
          <b>{m[0]}</b>
          <div className="text-12.5 text-slate-600">{m[1] === 'Owner' ? 'Owner' : m[2]}</div>
        </div>
        {m[1] !== 'Owner' && (
          <>
            <span className="text-12 font-bold text-slate-600">{m[1]}</span>
            {full && <button type="button" className="m-btn sm text-red-800" aria-label={`Remove ${m[0]}`} onClick={() => removeMember(i)}>Remove</button>}
          </>
        )}
      </div>
    ));

  /* payout accounts */
  function onAddAccount(f: HTMLFormElement) {
    const el = f.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement>;
    const type = el.type.value;
    setAccounts((a) => [...a, {
      badge: type.slice(0, 4), name: type, badgeCls: 'bg-slate-100 text-12 text-slate-700',
      detail: `••••${digits(el.no.value).slice(-4)} · ${el.holder.value} · verifying`,
    }]);
    setAccountOpen(false);
    showToast('Account added. We will verify it with a ৳ 1 test payment.', 'ok', 4000);
  }

  /* security */
  function onPassInput(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setStrength(v ? Math.max(1, s) : null);
  }
  function onPassSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    if (!validateForm(f)) return;
    const el = f.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement>;
    const fail = (input: HTMLInputElement, msg: string) => { setFieldError(input, msg); input.focus(); };
    if (!/\d/.test(el.next.value) || !/[A-Za-z]/.test(el.next.value)) return fail(el.next, 'Use letters and at least one number');
    if (el.next.value === el.current.value) return fail(el.next, 'New password must be different from the current one');
    if (el.next.value !== el.confirm.value) return fail(el.confirm, 'Passwords do not match');
    f.reset();
    setStrength(null);
    showToast('Password changed. Other devices were signed out.', 'ok');
  }
  function signOutOthers() {
    setConfirm({
      title: 'Sign out other devices?', text: 'Everyone using this account on another phone or computer will need to sign in again.', ok: 'Sign out others',
      onOk: () => { setOthersSignedOut(true); showToast('Signed out of 2 other devices', 'ok'); },
    });
  }

  /* header save / cancel act on the open section */
  function onSave() {
    if (tab === 'profile') saveProfile();
    else if (tab === 'security') passRef.current?.requestSubmit();
    else showToast('Settings saved', 'ok');
  }
  function onCancel() {
    if (tab === 'profile') { setDraft(null); clearProfileErrors(); }
    if (tab === 'security') { passRef.current?.reset(); setStrength(null); }
    showToast('Changes discarded', 'info');
  }

  const panel = (id: TabId, children: ReactNode) => (
    <div className={panelCls} data-panel={id} hidden={tab !== id}>{children}</div>
  );
  const meter = strength == null ? METER[0] : METER[strength];

  return (
    <main className="flex flex-col flex-[999_1_560px] min-w-0" data-page="MerchantSettings">
      <header className="flex flex-wrap items-center gap-3.5 box-border min-h-18 py-3 px-7 border-b border-b-slate-200 bg-white">
        <div>
          <div className="crumb">Account</div>
          <h1 className="m-0 text-24 font-extrabold tracking-[-0.02em]">Settings</h1>
        </div>
        <div className="flex gap-2.5 ml-auto">
          <button className={btnLight} type="button" id="st-cancel" onClick={onCancel}>Cancel</button>
          <button className={btnPrimary} type="button" id="st-save" onClick={onSave}>Save changes</button>
        </div>
      </header>
      <div className="flex flex-wrap items-start gap-5 py-6 px-7">
        <nav className="flex flex-col flex-[1_1_220px] gap-1 max-w-full p-1.5 rounded-16 bg-slate-100" aria-label="Settings sections">
          {TABS.map((t) => (
            <a key={t.id} className={cn(tabCls, tab === t.id && 'on')} href={`#${t.id}`} data-tab={t.id} aria-current={tab === t.id ? 'page' : undefined}>
              {t.label}
            </a>
          ))}
        </nav>

        {panel('profile', (
          <>
            <form ref={profileRef} id="st-profile" noValidate className="card flex flex-col gap-4.5 p-6" onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
              <h2 className="m-0 text-17 font-extrabold">Business profile</h2>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center justify-center w-18 h-18 rounded-20 bg-accent-100 text-24 font-extrabold text-orange-800 overflow-hidden" id="st-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element -- a data: URL from the file picker */}
                  {logo ? <img src={logo} alt="Business logo" className="w-full h-full object-cover rounded-20" /> : initials(profile.business)}
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    <button className={cn(btnLight, 'h-9.5')} type="button" id="st-logo" onClick={() => logoInRef.current?.click()}>Upload logo</button>
                    <button className={cn(btn, 'h-9.5 border-slate-300 bg-white text-red-800')} type="button" id="st-logo-rm" onClick={removeLogo}>Remove</button>
                    <input ref={logoInRef} type="file" id="st-logo-in" accept="image/png,image/jpeg" className="pm-sr" tabIndex={-1} aria-hidden="true" onChange={onLogo} />
                  </div>
                  <span className="text-12.5 text-slate-600">Shown on your parcel labels. PNG or JPG, 400×400.</span>
                </div>
                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 ml-auto rounded-full bg-green-100 text-13 font-extrabold text-green-800">✓ KYC verified</span>
              </div>
              <div className={grid}>
                <label className={fld}>
                  Business name
                  <input className={inp} name="business" required value={profile.business} onChange={onProfileInput} />
                </label>
                <label className={fld}>
                  Owner name
                  <input className={inp} name="owner" required value={profile.owner} onChange={onProfileInput} />
                </label>
              </div>
              <div className={grid}>
                <label className={fld}>
                  Phone
                  <input className={inp} name="phone" type="tel" required data-rule="phone" value={profile.phone} onChange={onProfileInput} />
                </label>
                <label className={fld}>
                  Email
                  <input className={inp} name="email" type="email" required value={profile.email} onChange={onProfileInput} />
                </label>
              </div>
              <div className={grid}>
                <label className={fld}>
                  Facebook page
                  <input className={inp} name="facebook" value={profile.facebook} onChange={onProfileInput} />
                </label>
                <label className={fld}>
                  Website
                  <input className={inp} name="website" value={profile.website} onChange={onProfileInput} />
                </label>
              </div>
              <label className={fld}>
                Business address
                <input className={inp} name="address" required value={profile.address} onChange={onProfileInput} />
              </label>
            </form>
            <div className="flex flex-wrap gap-5">
              <section className="card flex flex-col flex-[1_1_300px] min-w-0 p-5.5">
                <h2 className="mt-0 mb-1.5 mx-0 text-17 font-extrabold">SMS &amp; email alerts</h2>
                {ALERTS.slice(0, 4).map(alertRow)}
              </section>
              <section className="card flex flex-col flex-[1_1_300px] min-w-0 p-5.5">
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="m-0 text-17 font-extrabold">Team members</h2>
                  <button className="p-1 border-0 bg-transparent font-sans text-13 font-extrabold leading-[normal] text-brand-700 cursor-pointer" type="button" onClick={() => setInviteOpen(true)}>+ Invite</button>
                </div>
                <div data-team="summary">{teamList(false)}</div>
              </section>
            </div>
          </>
        ))}

        {panel('payout', (
          <section className="card flex flex-col gap-3.5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <h2 className="m-0 text-17 font-extrabold">Payout accounts</h2>
              <button className={btnLight} type="button" onClick={() => setAccountOpen(true)}>+ Add account</button>
            </div>
            <div className="flex flex-col gap-3" id="st-accounts">
              {accounts.map((a, i) => (
                <div key={i} className={cn('flex items-center gap-3 rounded-14', a.primary ? 'p-3.5 border-2 border-solid border-brand-600 bg-brand-50' : 'p-[15px] border border-solid border-slate-200')}>
                  <span className={cn('flex items-center justify-center w-10 h-10 rounded-11 font-extrabold', a.badgeCls)}>{a.badge}</span>
                  <div className="flex-1">
                    <b>{a.name}</b>
                    <div className="text-12.5 text-slate-600">{a.detail}</div>
                  </div>
                  {a.primary && <span className="text-11.5 font-extrabold text-brand-700">PRIMARY</span>}
                </div>
              ))}
            </div>
            <p className="m-0 text-13 text-slate-600">
              Pick the primary account and the payout schedule on
              {' '}
              <Link className="font-bold" href="/merchant/finance/payments">Payments &amp; COD</Link>
              .
            </p>
          </section>
        ))}

        {panel('team', (
          <section className="card flex flex-col p-6">
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-1.5">
              <h2 className="m-0 text-17 font-extrabold">Team members</h2>
              <button className={btnPrimary} type="button" onClick={() => setInviteOpen(true)}>Invite member</button>
            </div>
            <div data-team="full">{teamList(true)}</div>
            <p className="mt-3.5 mb-0 mx-0 text-13 leading-[1.6] text-slate-600">
              <b>Staff</b> create parcels and pickups. <b>Accounts</b> see payments only. <b>Manager</b> can do everything except change payout accounts.
            </p>
          </section>
        ))}

        {panel('notifications', (
          <section className="card flex flex-col p-6">
            <h2 className="mt-0 mb-1.5 mx-0 text-17 font-extrabold">Notifications</h2>
            {ALERTS.map(alertRow)}
          </section>
        ))}

        {panel('security', (
          <>
            <form ref={passRef} id="st-pass" noValidate className="card flex flex-col gap-4 p-6" onSubmit={onPassSubmit}>
              <h2 className="m-0 text-17 font-extrabold">Change password</h2>
              <label className={fld}>
                Current password
                <input className={inp} type="password" name="current" required autoComplete="current-password" />
              </label>
              <div className={grid}>
                <label className={fld}>
                  New password
                  <input className={inp} type="password" name="next" required minLength={8} autoComplete="new-password" onChange={onPassInput} />
                </label>
                <label className={fld}>
                  Confirm new password
                  <input className={inp} type="password" name="confirm" required autoComplete="new-password" />
                </label>
              </div>
              <div className="flex items-center gap-2.5" id="st-meter">
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <i className={cn('block w-0 h-full [transition:width_.2s]', meter[0])} style={{ width: `${(strength ?? 0) * 25}%` }} />
                </div>
                <span className="min-w-12 text-12.5 font-bold text-slate-600" aria-live="polite">{meter[1]}</span>
              </div>
              <p className="m-0 text-13 text-slate-600">At least 8 characters with letters and a number.</p>
              <div>
                <button className={btnPrimary} type="submit">Update password</button>
              </div>
            </form>
            <section className="card flex flex-col p-6">
              <h2 className="mt-0 mb-1.5 mx-0 text-17 font-extrabold">Sign-in security</h2>
              <div className={rowCls}>
                <div className="flex-1 text-14">
                  <b>Two-step verification</b>
                  <div className="text-12.5 text-slate-600">OTP to {profile.phone} when signing in on a new device</div>
                </div>
                {toggle('twofa', 'Two-step verification')}
              </div>
              <div className="flex flex-col" id="st-sessions">
                <div className="flex items-center gap-3 py-3 px-0 border-t border-t-slate-100">
                  <div className="flex-1 text-14">
                    <b>This device</b>
                    <div className="text-12.5 text-slate-600">Chrome on Windows · Dhaka · now</div>
                  </div>
                  <span className="text-12 font-extrabold text-green-800">Active</span>
                </div>
                {!othersSignedOut && (
                  <>
                    <div className="flex items-center gap-3 py-3 px-0 border-t border-t-slate-100">
                      <div className="flex-1 text-14">
                        <b>Android phone</b>
                        <div className="text-12.5 text-slate-600">percelme app · Dhaka · 2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 px-0 border-t border-t-slate-100">
                      <div className="flex-1 text-14">
                        <b>Safari on iPhone</b>
                        <div className="text-12.5 text-slate-600">Chattogram · Oct 7</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="pt-3">
                <button className={btnLight} type="button" id="st-signout-all" onClick={signOutOthers}>Sign out other devices</button>
              </div>
            </section>
          </>
        ))}

        {panel('language', (
          <section className="card flex flex-col gap-3.5 p-6">
            <h2 className="m-0 text-17 font-extrabold">Language · ভাষা</h2>
            {[['en', 'English'], ['bn', 'বাংলা']].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2.5 text-15 font-semibold cursor-pointer">
                <input
                  className="w-4.5 h-4.5 accent-brand-600"
                  type="radio"
                  name="lang"
                  value={value}
                  checked={lang === value}
                  onChange={() => {
                    setLang(value);
                    showToast(value === 'bn' ? 'ভাষা বাংলা করা হয়েছে (প্রোটোটাইপে শুধু সংরক্ষিত)' : 'Language set to English', 'ok');
                  }}
                />
                {label}
              </label>
            ))}
            <p className="m-0 text-13 text-slate-600">Labels and SMS to your customers follow this language.</p>
          </section>
        ))}
      </div>

      <PmDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a team member"
        onSubmit={onInvite}
        footer={<><button type="button" className="m-btn" onClick={() => setInviteOpen(false)}>Cancel</button><button type="submit" className="m-btn p">Send invite</button></>}
      >
        <label className="m-fld">Full name<input className="m-in" name="name" required /></label>
        <label className="m-fld">
          Mobile number
          <input className="m-in" name="phone" required data-rule="phone" inputMode="tel" placeholder="01XXX-XXXXXX" />
          <small>We send them an SMS with a sign-in link</small>
        </label>
        <label className="m-fld">
          Role
          <select className="m-in" name="role">
            {Object.entries(ROLES).map(([r, d]) => <option key={r} value={r}>{r} · {d}</option>)}
          </select>
        </label>
      </PmDialog>

      <PmDialog
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        title="Add payout account"
        onSubmit={onAddAccount}
        footer={<><button type="button" className="m-btn" onClick={() => setAccountOpen(false)}>Cancel</button><button type="submit" className="m-btn p">Add account</button></>}
      >
        <label className="m-fld">
          Type
          <select className="m-in" name="type">
            <option>bKash</option>
            <option>Nagad</option>
            <option>Bank account</option>
          </select>
        </label>
        <label className="m-fld">Account / wallet number<input className="m-in" name="no" required inputMode="numeric" minLength={10} /></label>
        <label className="m-fld">Account holder name<input className="m-in" name="holder" required defaultValue={profile.owner} /></label>
      </PmDialog>

      <PmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.title}
        validate={false}
        onSubmit={() => { confirm?.onOk(); setConfirm(null); }}
        footer={<><button type="button" className="m-btn" onClick={() => setConfirm(null)}>Go back</button><button type="submit" className={cn('m-btn', confirm?.danger ? 'd' : 'p')}>{confirm?.ok}</button></>}
      >
        <p className="m-p">{confirm?.text}</p>
      </PmDialog>
    </main>
  );
}
