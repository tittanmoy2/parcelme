import { storage } from '@/lib/storage';

// Demo accounts and session from docs/prototype/assets/js/public.js. Registered merchants
// (pm:accounts) and reset passwords (pm:passwords) are layered on top of the demo list.

export type Role = 'merchant' | 'admin' | 'rider';

export interface Account {
  role: Role;
  tab: 'merchant' | 'staff' | 'rider';
  id: string;
  password: string;
  name: string;
  business?: string;
}

export interface PendingRegistration {
  name: string;
  phone: string;
  email: string;
  password: string;
  business: string;
  area: string;
  address: string;
  payout: { method: string; account: string; schedule: string };
}

export interface OtpState {
  mode?: 'register' | 'reset' | 'login';
  phone?: string;
  verified?: boolean;
}

export const DEMO_ACCOUNTS: Account[] = [
  { role: 'merchant', tab: 'merchant', id: '01712-345678', password: 'password123', name: 'Tanvir Ahmed', business: 'Shopnil Fashion' },
  { role: 'admin', tab: 'staff', id: 'admin@percelme.com', password: 'admin123', name: 'Farhana Rahman' },
  { role: 'rider', tab: 'rider', id: '01811-223344', password: 'rider123', name: 'Rakib Hasan' },
];

export const HOME: Record<Role, string> = {
  merchant: '/merchant/dashboard',
  admin: '/admin/dashboard',
  rider: '/rider/today',
};

export const DEMO_OTP = '123456';

// '01712-345678', '+8801712345678', '1712345678' → '01712345678'; emails lower-cased.
export function normId(v: string) {
  v = String(v || '').trim().toLowerCase();
  if (v.includes('@')) return v;
  let d = v.replace(/\D/g, '');
  if (d.startsWith('880')) d = d.slice(3);
  if (d.length === 10 && d[0] === '1') d = '0' + d;
  return d;
}

export const isPhone = (d: string) => /^01[3-9]\d{8}$/.test(d);
export const fmtPhone = (d: string) => d.slice(0, 5) + '-' + d.slice(5);
export const maskPhone = (d: string) => (isPhone(d) ? d.slice(0, 5) + '-•••' + d.slice(8) : d);

export const authService = {
  accounts: (): Account[] => {
    const pw = storage.get<Record<string, string>>('passwords', {});
    const list = [...storage.get<Account[]>('accounts', []), ...DEMO_ACCOUNTS];
    return list.map((a) => ({ ...a, password: pw[normId(a.id)] || a.password }));
  },

  findAccount: (id: string): Account | undefined => {
    const n = normId(id);
    return authService.accounts().find((a) => normId(a.id) === n);
  },

  startSession: (acc: Account, extra?: Record<string, unknown>) => {
    const id = normId(acc.id);
    storage.set('session', {
      role: acc.role,
      name: acc.name,
      business: acc.business,
      phone: isPhone(id) ? fmtPhone(id) : undefined,
      email: acc.id.includes('@') ? acc.id : undefined,
      at: Date.now(),
      ...extra,
    });
  },

  logout: () => storage.remove('session'),

  // Turns the verified sign-up into a merchant account and logs it in.
  completeRegistration: (phone: string): Account => {
    const p = storage.get<Partial<PendingRegistration> | null>('pendingReg', null) ?? {
      name: 'Tanvir Ahmed', business: 'Shopnil Fashion', phone, password: 'password123',
    };
    const acc: Account = {
      role: 'merchant', tab: 'merchant', id: fmtPhone(p.phone || phone),
      password: p.password || '', name: p.name || '', business: p.business,
    };
    const list = storage.get<Account[]>('accounts', []).filter((a) => normId(a.id) !== normId(acc.id));
    storage.set('accounts', [acc, ...list]);
    const pw = storage.get<Record<string, string>>('passwords', {});
    delete pw[normId(acc.id)];
    storage.set('passwords', pw);
    authService.startSession(acc, { isNew: true });
    storage.remove('pendingReg');
    storage.remove('otp');
    return acc;
  },
};
