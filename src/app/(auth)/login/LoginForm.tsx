'use client';

// Behaviour from initLogin() in docs/prototype/assets/js/public.js: role tabs, demo-account
// fill, field checks, password login against authService, and the hand-off to OTP login.
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { showToast } from '@/hooks/useToast';
import { authService, DEMO_ACCOUNTS, HOME, isPhone, normId, type Account } from '@/lib/services/authService';

type Tab = Account['tab'];
const TABS: Tab[] = ['merchant', 'staff', 'rider'];
const TAB_LABEL: Record<Tab, string> = { merchant: 'Merchant', staff: 'Staff', rider: 'Rider' };

const tabCls = 'flex-1 h-11 border-0 rounded-11 bg-transparent font-sans text-14 font-bold leading-[normal] text-slate-600 cursor-pointer aria-selected:bg-white aria-selected:text-slate-900 aria-selected:shadow-[0_1px_3px_rgba(15,23,42,.12)]';
const inputCls = 'flex-1 min-w-0 border-0 bg-transparent font-sans text-16 font-medium leading-[normal] text-slate-900 outline-none';

// Reset passwords live in pm:passwords, which only the browser has; the server shows the demo ones.
const noSubscribe = () => () => {};
const readPasswords = () => localStorage.getItem('pm:passwords') ?? '';

export function LoginForm() {
  const router = useRouter();
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  const [role, setRole] = useState<Tab>('merchant');
  const [showPw, setShowPw] = useState(false);
  const [idErr, setIdErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(false);

  const pwJson = useSyncExternalStore(noSubscribe, readPasswords, () => '');
  const demoPassword = (a: Account) => {
    try { return (pwJson && JSON.parse(pwJson)[normId(a.id)]) || a.password; } catch { return a.password; }
  };

  // After a password reset, the reset page leaves the phone here to prefill.
  useEffect(() => {
    const last = storage.get<string | null>('lastLoginId', null);
    if (last && idRef.current && pwRef.current) {
      idRef.current.value = last;
      pwRef.current.value = '';
      storage.remove('lastLoginId');
    }
  }, []);

  function selectRole(r: Tab, focus = false) {
    setRole(r);
    setAlert('');
    if (focus) tabRefs.current[r]?.focus();
  }

  function onTabKey(i: number, e: KeyboardEvent<HTMLButtonElement>) {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    selectRole(TABS[(i + d + TABS.length) % TABS.length], true);
  }

  function fill(id: string) {
    const acc = authService.findAccount(id);
    if (!acc || !idRef.current || !pwRef.current) return;
    selectRole(acc.tab);
    idRef.current.value = acc.id;
    pwRef.current.value = acc.password;
    setIdErr('');
    setPwErr('');
    submitRef.current?.focus();
  }

  function checkId() {
    const v = idRef.current!.value.trim();
    let msg = '';
    if (!v) msg = 'Enter your phone number or email';
    else if (v.includes('@')) msg = /^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter a valid email address';
    else msg = isPhone(normId(v)) ? '' : 'Enter a valid 11-digit mobile number, e.g. 01712-345678';
    setIdErr(msg);
    return !msg;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAlert('');
    const id = idRef.current!, pw = pwRef.current!;
    const okId = checkId();
    const okPw = !!pw.value;
    setPwErr(okPw ? '' : 'Enter your password');
    if (!okId) { id.focus(); return; }
    if (!okPw) { pw.focus(); return; }
    const acc = authService.findAccount(id.value);
    if (!acc) {
      setAlert('No account found with this phone number or email. New here? Create a free merchant account.');
      id.focus();
      return;
    }
    if (acc.password !== pw.value) {
      setPwErr('Wrong password. Try again or use “Forgot password?”.');
      pw.select();
      return;
    }
    if (acc.tab !== role) {
      setAlert(`This is a ${TAB_LABEL[acc.tab]} account. Switch to the ${TAB_LABEL[acc.tab]} tab to log in.`);
      tabRefs.current[acc.tab]?.focus();
      return;
    }
    const remember = (e.currentTarget.elements.namedItem('remember') as HTMLInputElement).checked;
    authService.startSession(acc, { remember });
    setBusy(true);
    showToast(`Welcome back, ${acc.name.split(' ')[0]}!`, 'ok');
    setTimeout(() => router.push(HOME[acc.role]), 500);
  }

  function onOtpLogin() {
    setAlert('');
    const d = normId(idRef.current!.value);
    if (!isPhone(d)) {
      setIdErr('Enter your registered mobile number to get a code');
      idRef.current!.focus();
      return;
    }
    if (!authService.findAccount(d)) {
      setAlert('No account found with this phone number.');
      return;
    }
    storage.set('otp', { mode: 'login', phone: d });
    router.push('/verify-otp?mode=login');
  }

  const clearOn = (setErr: (m: string) => void) => () => { setErr(''); setAlert(''); };

  return (
    <form className="flex flex-col gap-5.5 w-full max-w-[420px]" id="loginForm" noValidate onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-32 font-extrabold tracking-[-0.025em]">Welcome back</h2>
        <p className="m-0 text-16 text-slate-600">Log in to your account to continue.</p>
      </div>
      <div className="flex gap-1 p-1 rounded-14 bg-slate-100" role="tablist" aria-label="Account type" id="roleTabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            ref={(b) => { tabRefs.current[t] = b; }}
            className={tabCls}
            type="button"
            role="tab"
            aria-selected={role === t}
            data-role={t}
            tabIndex={role === t ? 0 : -1}
            onClick={() => selectRole(t)}
            onKeyDown={(e) => onTabKey(i, e)}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-2 text-14 font-bold">
        Phone number or email
        <span className={cn('inp bg-white', idErr && 'pm-invalid')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <input ref={idRef} className={inputCls} id="loginId" name="id" autoComplete="username" defaultValue="01712-345678" aria-invalid={!!idErr || undefined} onInput={clearOn(setIdErr)} />
        </span>
        {idErr && <span className="pm-err">{idErr}</span>}
      </label>
      <label className="flex flex-col gap-2 text-14 font-bold">
        <span className="flex justify-between">
          Password
          <Link className="font-bold" href="/forgot-password">Forgot password?</Link>
        </span>
        <span className={cn('inp bg-white', pwErr && 'pm-invalid')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input ref={pwRef} className={inputCls} id="loginPw" name="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" defaultValue="password123" aria-invalid={!!pwErr || undefined} onInput={clearOn(setPwErr)} />
          <button className="flex p-1.5 border-0 bg-transparent cursor-pointer" type="button" aria-label={showPw ? 'Hide password' : 'Show password'} aria-pressed={showPw} onClick={() => setShowPw((s) => !s)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {showPw ? (
                <>
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <path d="m2 2 20 20" />
                </>
              ) : (
                <>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </span>
        {pwErr && <span className="pm-err">{pwErr}</span>}
      </label>
      <label className="flex items-center gap-2.5 text-14 font-semibold text-slate-700 cursor-pointer">
        <input className="w-4.5 h-4.5 accent-brand-600" type="checkbox" id="loginRemember" name="remember" defaultChecked />
        Keep me logged in
      </label>
      <div id="loginErr" className="py-3 px-3.5 rounded-12 bg-red-100 text-14 font-semibold leading-[1.5] text-red-800" role="alert" hidden={!alert}>{alert}</div>
      <button ref={submitRef} type="submit" className={cn('btn-primary', busy && 'btn-busy')}>
        {busy ? 'Logging in…' : 'Log in'}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
      <div className="flex items-center gap-3.5 text-13 font-semibold text-slate-600">
        <span className="flex-1 h-px bg-slate-200" />
        or
        <span className="flex-1 h-px bg-slate-200" />
      </div>
      <button className="h-13 border border-solid border-slate-300 rounded-14 bg-white font-sans text-15 font-bold leading-[normal] text-slate-900 cursor-pointer" type="button" id="otpLogin" onClick={onOtpLogin}>
        Log in with OTP
      </button>
      <p className="m-0 text-center text-15 text-slate-600">
        New merchant?
        {' '}
        <Link className="font-extrabold" href="/register">Create a free account</Link>
      </p>
      <aside className="demo-note flex items-start gap-3 py-3 px-3.5 border border-dashed border-accent-300 rounded-14 bg-accent-50 text-13 leading-[1.6] text-orange-900" aria-label="Demo accounts">
        <span className="flex-none py-0.5 px-2 rounded-full bg-accent-500 text-11 font-extrabold tracking-[.06em] text-stone-900 uppercase">Demo</span>
        <div className="flex-1 min-w-0" id="demoCreds">
          {DEMO_ACCOUNTS.map((a) => (
            <div key={a.id} className={a.tab === role ? 'font-bold' : undefined}>
              {TAB_LABEL[a.tab]}:
              {' '}
              <code>{a.id}</code>
              {' '}
              /
              {' '}
              <code>{demoPassword(a)}</code>
              {' '}
              <button type="button" onClick={() => fill(a.id)}>Fill</button>
            </div>
          ))}
          <div className="mt-1">Wrong password shows the error state.</div>
        </div>
      </aside>
    </form>
  );
}
