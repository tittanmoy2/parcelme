'use client';

// Behaviour from initOtp() in docs/prototype/assets/js/public.js: six digit boxes with typing,
// paste and arrow-key handling, the demo code check, a resend countdown, and what happens next
// for each mode (?mode=register | reset | login).
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ChangeEvent, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { showToast } from '@/hooks/useToast';
import { authService, DEMO_ACCOUNTS, DEMO_OTP, HOME, maskPhone, type OtpState } from '@/lib/services/authService';

const LEN = 6;
const RESEND_SECONDS = 38;

const COPY = {
  register: { title: 'Verify your phone', btn: 'Verify & continue', change: '/register' },
  reset: { title: 'Enter your reset code', btn: 'Verify code', change: '/forgot-password' },
  login: { title: 'Log in with OTP', btn: 'Verify & log in', change: '/login' },
};
type Mode = keyof typeof COPY;

// ?mode= and pm:otp only exist in the browser; the server renders the register copy.
const noSubscribe = () => () => {};
const readContext = () => `${new URLSearchParams(location.search).get('mode') ?? ''}\n${localStorage.getItem('pm:otp') ?? ''}`;

export function OtpForm() {
  const router = useRouter();
  const raw = useSyncExternalStore(noSubscribe, readContext, () => '\n');
  const { mode, phone, otp } = useMemo(() => {
    const [m, json] = raw.split('\n');
    let otp: OtpState = {};
    try { otp = json ? JSON.parse(json) : {}; } catch {}
    const mode: Mode = (m || otp.mode || 'register') in COPY ? ((m || otp.mode || 'register') as Mode) : 'register';
    return { mode, phone: otp.phone || '01712345678', otp };
  }, [raw]);
  const copy = COPY[mode];

  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(''));
  const [error, setError] = useState('');
  const [wrong, setWrong] = useState(false); // red boxes until the next keystroke
  const [wrongTick, setWrongTick] = useState(0); // bumped per wrong code; remounts the boxes so the shake replays
  const [verified, setVerified] = useState(false);
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [round, setRound] = useState(0);

  useEffect(() => {
    document.title = `${copy.title} · percelme`;
  }, [copy.title]);

  // Resend countdown; restarts when `round` changes.
  useEffect(() => {
    const iv = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) clearInterval(iv);
        return Math.max(0, l - 1);
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [round]);

  const focusBox = (i: number) => boxes.current[i]?.focus();

  function clearErr() {
    setWrong(false);
    setError('');
  }

  function verify(code: string) {
    if (verified) return;
    if (code.length < LEN) {
      setError(`Enter all ${LEN} digits of the code.`);
      focusBox(digits.findIndex((d) => !d));
      return;
    }
    if (code !== DEMO_OTP) {
      setError('That code is not correct. Check the SMS and try again.');
      setDigits(Array(LEN).fill(''));
      setWrong(true);
      setWrongTick((t) => t + 1);
      requestAnimationFrame(() => focusBox(0));
      return;
    }
    setVerified(true);
    if (mode === 'reset') {
      storage.set('otp', { ...otp, mode, phone, verified: true });
      setTimeout(() => router.push('/reset-password'), 300);
      return;
    }
    if (mode === 'login') {
      const acc = authService.findAccount(phone) || DEMO_ACCOUNTS[0];
      authService.startSession(acc);
      storage.remove('otp');
      showToast(`Welcome back, ${acc.name.split(' ')[0]}!`, 'ok');
      setTimeout(() => router.push(HOME[acc.role]), 500);
      return;
    }
    const acc = authService.completeRegistration(phone);
    showToast(`Phone verified. Welcome to percelme, ${acc.name.split(' ')[0]}!`, 'ok');
    setTimeout(() => router.push(HOME.merchant), 700);
  }

  // Spread typed or pasted digits from box `from` onward, then focus the next empty box.
  function fill(from: number, input: string) {
    const next = [...digits];
    input.split('').slice(0, LEN - from).forEach((d, i) => { next[from + i] = d; });
    setDigits(next);
    const empty = next.findIndex((d) => !d);
    focusBox(empty >= 0 ? empty : Math.min(from + input.length, LEN) - 1);
    if (empty < 0) verify(next.join(''));
  }

  function onChange(i: number, e: ChangeEvent<HTMLInputElement>) {
    clearErr();
    // A single keystroke replaces the box's digit; longer input (autofill, fast typing) is spread across boxes.
    const data = (e.nativeEvent as InputEvent).data;
    const input = (data && data.length === 1 ? data : e.target.value).replace(/\D/g, '');
    if (input) fill(i, input);
    else setDigits((d) => d.map((v, j) => (j === i ? '' : v)));
  }

  function onKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      e.preventDefault();
      setDigits((d) => d.map((v, j) => (j === i - 1 ? '' : v)));
      focusBox(i - 1);
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === 'ArrowRight' && i < LEN - 1) {
      e.preventDefault();
      focusBox(i + 1);
    }
  }

  function onPaste(i: number, e: ClipboardEvent<HTMLInputElement>) {
    const input = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!input) return;
    e.preventDefault();
    clearErr();
    fill(input.length >= LEN ? 0 : i, input);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    verify(digits.join(''));
  }

  function onResend() {
    clearErr();
    setLeft(RESEND_SECONDS);
    setRound((r) => r + 1);
    showToast(`A new code was sent to ${maskPhone(phone)}`, 'ok');
    focusBox(0);
  }

  return (
    <form className={cn('flex flex-col items-center gap-5 box-border w-full max-w-[460px] py-9 px-8 border border-solid border-slate-200 rounded-24 bg-white text-center shadow-[0_30px_60px_-36px_rgba(15,23,42,.35)]', wrong && 'otp-err')} id="otpForm" noValidate onSubmit={onSubmit}>
      <span className="flex items-center justify-center w-16 h-16 rounded-20 bg-brand-50">
        <svg className="stroke-brand-600" width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
      </span>
      <div>
        <h1 className="m-0 text-26 font-extrabold tracking-[-0.02em]" id="otpTitle">{copy.title}</h1>
        <p className="mt-2 mb-0 mx-0 leading-[1.6] text-slate-600">
          We sent a 6-digit code to
          {' '}
          <b className="text-slate-900" id="otpPhone">{maskPhone(phone)}</b>
          .
          {' '}
          <Link className="font-bold" id="otpChange" href={copy.change}>Change</Link>
        </p>
      </div>
      <fieldset key={wrongTick} className="flex justify-center gap-2 w-full min-w-0 max-w-[396px] p-0 m-0 border-0 in-[.otp-err]:animate-shake" id="otpBoxes">
        <legend className="absolute w-px h-px overflow-hidden [clip:rect(0_0_0_0)]">Verification code</legend>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { boxes.current[i] = el; }}
            className={cn('otp-box', d && 'filled')}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`Digit ${i + 1}`}
            autoFocus={i === 0}
            value={d}
            onChange={(e) => onChange(i, e)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={(e) => onPaste(i, e)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </fieldset>
      <div id="otpErr" className="box-border w-full py-3 px-3.5 rounded-12 bg-red-100 text-left text-14 font-semibold leading-[1.5] text-red-800" role="alert" hidden={!error}>{error}</div>
      <button type="submit" id="otpSubmit" className={cn('btn-primary', verified && 'btn-busy')}>{verified ? 'Verified ✓' : copy.btn}</button>
      <p className="m-0 text-14 text-slate-600" aria-live="polite">
        Didn&apos;t get the code?
        {' '}
        <span className="font-bold text-slate-900" id="otpTimer" hidden={left <= 0}>Resend in 0:{String(left).padStart(2, '0')}</span>
        <button type="button" id="otpResend" className="p-0 border-0 bg-transparent font-sans text-14 font-bold leading-[normal] text-brand-700 cursor-pointer hover:text-brand-900 hover:underline" hidden={left > 0} onClick={onResend}>
          Resend code
        </button>
      </p>
      <aside className="demo-note flex items-start gap-3 box-border w-full py-3 px-3.5 border border-dashed border-accent-300 rounded-14 bg-accent-50 text-left text-13 leading-[1.6] text-orange-900" aria-label="Demo code">
        <span className="flex-none py-0.5 px-2 rounded-full bg-accent-500 text-11 font-extrabold tracking-[.06em] text-stone-900 uppercase">Demo</span>
        <span>
          Use code
          {' '}
          <code>{DEMO_OTP}</code>
          . Any other code shows the error state.
        </span>
      </aside>
    </form>
  );
}
