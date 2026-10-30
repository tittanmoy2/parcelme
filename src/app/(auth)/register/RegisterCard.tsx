'use client';

// Behaviour from initRegister() in docs/prototype/assets/js/public.js: three steps, each
// validated before the next, then the sign-up is stored and the OTP page takes over.
import { Fragment, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { showToast } from '@/hooks/useToast';
import { setFieldError, validateForm } from '@/components/ui/PrototypeBehaviour';
import { normId, type PendingRegistration } from '@/lib/services/authService';

const inp = 'box-border w-full h-12 py-0 px-3.5 border border-solid border-slate-300 rounded-12 bg-white font-sans text-15 font-medium leading-[normal] text-slate-900 focus:outline-none focus:border-brand-600 focus:shadow-[0_0_0_4px_var(--color-brand-100)]';
const lbl = 'flex flex-col gap-[7px] text-14 font-bold';
const grid = 'grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4';
const upTile = 'up relative flex items-center gap-3.5 p-4.5 border-2 border-dashed border-slate-300 rounded-14 bg-slate-50 cursor-pointer focus-within:outline-3 focus-within:outline-solid focus-within:outline-offset-2 focus-within:outline-brand-300 [&.done]:border-green-300 [&.done]:bg-green-50';

const STEPS = ['Account', 'Business & KYC', 'Payout method'];
const NEXT_LABEL = ['Continue', 'Continue to payout', 'Create account'];
const METHODS = [
  { value: 'bKash', hint: 'Personal or merchant wallet' },
  { value: 'Nagad', hint: 'Personal or merchant wallet' },
  { value: 'Bank', hint: 'Any bank in Bangladesh', label: 'Bank transfer' },
];

type UploadKey = 'nid' | 'license';

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export function RegisterCard() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const moved = useRef(false);

  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [method, setMethod] = useState('bKash');
  const [terms, setTerms] = useState(false);
  const [termsErr, setTermsErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState<Partial<Record<UploadKey, string>>>({ nid: 'nid-tanvir.jpg' });

  const bank = method === 'Bank';

  // After Back/Continue: bring the card into view and focus the step's first field.
  useEffect(() => {
    if (!moved.current) return;
    cardRef.current?.scrollIntoView({ block: 'start' });
    stepRefs.current[step - 1]
      ?.querySelector<HTMLElement>('input:not([type=radio]):not([type=file]):not([type=checkbox]), select')
      ?.focus({ preventScroll: true });
  }, [step]);

  function goTo(n: number) {
    moved.current = true;
    setStep(n);
  }

  function onBack() {
    if (step === 1) router.push('/');
    else goTo(step - 1);
  }

  function onUpload(key: UploadKey, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('That file is bigger than 5 MB', 'error');
      e.target.value = '';
      return;
    }
    setUploads((u) => ({ ...u, [key]: file.name }));
  }

  function onMethod(value: string) {
    setMethod(value);
    // Focus the first field of the group that just appeared, once it's rendered.
    requestAnimationFrame(() => {
      const group = document.getElementById(value === 'Bank' ? 'bankFields' : 'walletFields');
      group?.querySelector<HTMLElement>('input,select')?.focus();
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cur = stepRefs.current[step - 1];
    if (!cur || !validateForm(cur)) return;
    const el = e.currentTarget.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement & HTMLSelectElement>;
    if (step === 1 && el.password.value !== el.password2.value) {
      setFieldError(el.password2, 'Passwords do not match');
      el.password2.focus();
      return;
    }
    if (step === 2 && !uploads.nid) {
      showToast('Please upload your NID to continue', 'error');
      return;
    }
    if (step === 3) {
      if (bank && !/^\d{13,17}$/.test(el.acc.value.replace(/\s/g, ''))) {
        setFieldError(el.acc, 'Enter a 13–17 digit account number');
        el.acc.focus();
        return;
      }
      if (!terms) {
        setTermsErr(true);
        document.getElementById('regTerms')?.focus();
        return;
      }
    }
    if (step < 3) {
      goTo(step + 1);
      return;
    }
    const phone = normId(el.phone.value);
    storage.set<PendingRegistration>('pendingReg', {
      name: el.name.value.trim(), phone, email: el.email.value.trim(), password: el.password.value,
      business: el.business.value.trim(), area: el.area.value, address: el.address.value.trim(),
      payout: { method, account: bank ? el.acc.value : el.wallet.value, schedule: el.schedule.value },
    });
    storage.set('otp', { mode: 'register', phone });
    setBusy(true);
    setTimeout(() => router.push('/verify-otp?mode=register'), 400);
  }

  const uploadTile = (key: UploadKey, title: string, hint: string) => {
    const name = uploads[key];
    return (
      <label className={cn(upTile, name && 'done')} data-upload={key}>
        <span className={cn('ui flex items-center justify-center flex-none w-11 h-11 rounded-12', name ? 'bg-green-100' : 'bg-brand-50')}>
          {name ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.4" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg className="stroke-brand-600" width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          )}
        </span>
        <span className="flex-1 min-w-0 text-14">
          <b>{title}</b>
          <span className={cn('us block wrap-anywhere text-12.5', name ? 'text-green-800' : 'text-slate-600')}>
            {name ? `${name} · uploaded` : hint}
          </span>
        </span>
        <input className="absolute w-px h-px opacity-0" type="file" accept="image/*,.pdf" onChange={(e) => onUpload(key, e)} />
      </label>
    );
  };

  return (
    <div ref={cardRef} className="w-full max-w-[880px] border border-solid border-slate-200 rounded-24 bg-white overflow-hidden shadow-[0_30px_60px_-36px_rgba(15,23,42,.35)]" data-hook="register-card">
      <div className="flex flex-col gap-5.5 py-7 px-8 border-b border-b-slate-200 upto-520:py-5.5 upto-520:px-4.5">
        <div>
          <h1 className="m-0 text-28 font-extrabold tracking-[-0.025em]">Create your merchant account</h1>
          <p className="mt-1.5 mb-0 mx-0 text-slate-600">Takes about 2 minutes. Your account is reviewed within 24 hours.</p>
        </div>
        <ol className="flex flex-wrap items-center gap-3 p-0 m-0 list-none" id="regSteps" aria-label="Sign-up progress">
          {STEPS.map((t, i) => {
            const n = i + 1;
            return (
              <Fragment key={t}>
                {i > 0 && <li aria-hidden="true" className={cn('bar flex-1 h-0.5 min-w-7.5', i < step ? 'bg-green-600' : 'bg-slate-200')} />}
                <li className={cn('reg-step', n < step && 'done', n === step && 'cur')} data-step-ind={n} aria-current={n === step ? 'step' : undefined}>
                  <span className="c">{n < step ? CHECK : n}</span>
                  <span className="t">{t}</span>
                </li>
              </Fragment>
            );
          })}
        </ol>
      </div>
      <form className="flex flex-col gap-5 py-7 px-8 upto-520:py-5.5 upto-520:px-4.5" id="regForm" noValidate onSubmit={onSubmit}>
        <div ref={(d) => { stepRefs.current[0] = d; }} className="step flex flex-col gap-5" data-step="1" hidden={step !== 1}>
          <div className={grid}>
            <label className={lbl}>
              Your full name
              <input className={inp} name="name" required autoComplete="name" defaultValue="Tanvir Ahmed" />
            </label>
            <label className={lbl}>
              Mobile number
              <input className={inp} name="phone" required data-rule="phone" inputMode="tel" autoComplete="tel-national" placeholder="01XXX-XXXXXX" defaultValue="01712-345678" />
            </label>
          </div>
          <label className={lbl}>
            Email
            <small className="text-12.5 font-medium text-slate-600">Optional · for invoices</small>
            <input className={inp} name="email" type="email" autoComplete="email" placeholder="you@shop.com" />
          </label>
          <div className={grid}>
            <label className={lbl}>
              Password
              <span className="relative block">
                <input className={cn(inp, 'pr-12')} id="regPw" name="password" type={showPw ? 'text' : 'password'} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
                <button type="button" className="flex absolute top-1/2 right-1.5 p-2 border-0 bg-transparent cursor-pointer [transform:translateY(-50%)]" aria-label={showPw ? 'Hide password' : 'Show password'} aria-pressed={showPw} onClick={() => setShowPw((s) => !s)}>
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
            </label>
            <label className={lbl}>
              Confirm password
              <input className={inp} id="regPw2" name="password2" type={showPw ? 'text' : 'password'} required autoComplete="new-password" onInput={(e) => setFieldError(e.currentTarget, '')} />
            </label>
          </div>
          <p className="m-0 text-13 text-slate-600">We will send a 6-digit code to this number to verify it.</p>
        </div>

        <div ref={(d) => { stepRefs.current[1] = d; }} className="step flex flex-col gap-5" data-step="2" hidden={step !== 2}>
          <div className={grid}>
            <label className={lbl}>
              Business / shop name
              <input className={inp} name="business" required defaultValue="Shopnil Fashion" />
            </label>
            <label className={lbl}>
              Business type
              <select className={inp} name="type">
                <option>Online shop (Facebook / website)</option>
                <option>Physical shop</option>
                <option>Wholesaler / distributor</option>
                <option>Personal / individual</option>
              </select>
            </label>
          </div>
          <div className={grid}>
            <label className={lbl}>
              Product category
              <select className={inp} name="category">
                <option>Clothing &amp; fashion</option>
                <option>Electronics &amp; gadgets</option>
                <option>Beauty &amp; cosmetics</option>
                <option>Books &amp; stationery</option>
                <option>Food &amp; grocery</option>
                <option>Home &amp; lifestyle</option>
                <option>Other</option>
              </select>
            </label>
            <label className={lbl}>
              Average parcels per day
              <select className={inp} name="volume" defaultValue="20 – 50">
                <option>1 – 20</option>
                <option>20 – 50</option>
                <option>50 – 200</option>
                <option>200+</option>
              </select>
            </label>
          </div>
          <div className={grid}>
            <label className={lbl}>
              Facebook page / website
              <small className="text-12.5 font-medium text-slate-600">Optional</small>
              <input className={inp} name="web" placeholder="facebook.com/yourshop" />
            </label>
            <label className={lbl}>
              Pickup area
              <select className={inp} name="area">
                <option>Gulshan 1, Dhaka</option>
                <option>Gulshan 2, Dhaka</option>
                <option>Banani, Dhaka</option>
                <option>Dhanmondi, Dhaka</option>
                <option>Mirpur 10, Dhaka</option>
                <option>Uttara, Dhaka</option>
                <option>Mohammadpur, Dhaka</option>
                <option>Agrabad, Chattogram</option>
                <option>Zindabazar, Sylhet</option>
              </select>
            </label>
          </div>
          <label className={lbl}>
            Pickup address
            <input className={inp} name="address" required defaultValue="House 12, Road 5, Gulshan 1, Dhaka" />
          </label>
          <div className="flex flex-col gap-3">
            <div className="text-15 font-extrabold">Verification documents</div>
            <div className={grid}>
              {uploadTile('nid', 'NID (front & back)', 'Required · JPG, PNG or PDF, max 5 MB')}
              {uploadTile('license', 'Trade license', 'Optional · JPG, PNG or PDF, max 5 MB')}
            </div>
          </div>
        </div>

        <div ref={(d) => { stepRefs.current[2] = d; }} className="step flex flex-col gap-5" data-step="3" hidden={step !== 3}>
          <fieldset className="flex flex-col gap-3 min-w-0 p-0 m-0 border-0">
            <legend className="p-0 mb-3 text-15 font-extrabold">How should we pay your COD?</legend>
            <div className={grid} id="payMethods">
              {METHODS.map((m) => (
                <label key={m.value} className={cn('pay-opt', method === m.value && 'on')}>
                  <input type="radio" name="method" value={m.value} checked={method === m.value} onChange={() => onMethod(m.value)} />
                  <span>
                    <b>{m.label ?? m.value}</b>
                    <small>{m.hint}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className={grid} id="walletFields" hidden={bank}>
            <label className={lbl}>
              Wallet number
              <input className={inp} name="wallet" required={!bank} data-rule="phone" inputMode="tel" defaultValue="01712-345678" />
            </label>
            <label className={lbl}>
              Account holder name
              <input className={inp} name="holder" required={!bank} defaultValue="Tanvir Ahmed" />
            </label>
          </div>
          <div className={grid} id="bankFields" hidden={!bank}>
            <label className={lbl}>
              Bank name
              <select className={inp} name="bank">
                <option>BRAC Bank</option>
                <option>Dutch-Bangla Bank</option>
                <option>City Bank</option>
                <option>Eastern Bank</option>
                <option>Islami Bank</option>
              </select>
            </label>
            <label className={lbl}>
              Account number
              <input className={inp} name="acc" required={bank} inputMode="numeric" placeholder="13-17 digits" />
            </label>
            <label className={lbl}>
              Branch
              <input className={inp} name="branch" required={bank} placeholder="e.g. Gulshan" />
            </label>
            <label className={lbl}>
              Account name
              <input className={inp} name="accName" required={bank} defaultValue="Tanvir Ahmed" />
            </label>
          </div>
          <label className={lbl}>
            Payout schedule
            <select className={inp} name="schedule">
              <option>Daily (next working day)</option>
              <option>Twice a week</option>
              <option>Weekly</option>
            </select>
          </label>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-2.5 text-14 leading-[1.5] text-slate-700 cursor-pointer">
              <input
                className="flex-none w-4.5 h-4.5 mt-0.5 accent-brand-600"
                type="checkbox"
                id="regTerms"
                checked={terms}
                onChange={(e) => { setTerms(e.target.checked); if (e.target.checked) setTermsErr(false); }}
              />
              I agree to the
              <a className="font-bold" href="#">Terms of Service</a>
              and
              <a className="font-bold" href="#">Privacy Policy</a>
              .
            </label>
            <span className="terms-err text-12.5 font-semibold text-red-700" id="termsErr" hidden={!termsErr}>Please accept the terms to continue</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-1.5 mt-1 border-t border-t-slate-200">
          <button type="button" className="inline-flex items-center justify-center gap-2 h-12.5 mt-4 py-0 px-5.5 border border-solid rounded-14 font-sans text-15 leading-[normal] cursor-pointer border-slate-300 bg-white font-bold text-slate-900" id="regBack" onClick={onBack}>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button type="submit" className={cn('inline-flex items-center justify-center gap-2 h-12.5 mt-4 py-0 px-5.5 border border-solid rounded-14 font-sans text-15 leading-[normal] cursor-pointer border-brand-600 bg-brand-600 font-extrabold text-white hover:bg-brand-700', busy && 'btn-busy')} id="regNext" disabled={busy}>
            <span>{busy ? 'Sending code…' : NEXT_LABEL[step - 1]}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
