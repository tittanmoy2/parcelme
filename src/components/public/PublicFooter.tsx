import React from 'react';
import Link from 'next/link';

export function PublicFooter() {
  return (
    <footer className="pt-16 pb-8 px-0 bg-slate-900 text-white">
      <div className="pub-wrap flex flex-col gap-10">
        <div className="flex flex-wrap justify-between gap-10">
          {/* Company Branding & Address */}
          <div className="flex flex-col gap-3.5 max-w-80">
            <div className="flex items-center gap-2.5">
              <svg width="29" height="34" viewBox="0 0 48 56" aria-hidden="true">
                <circle cx="26" cy="22" r="20" fill="#FFFFFF" />
                <rect x="6" y="22" width="11" height="32" rx="5.5" fill="#FFFFFF" />
                <rect className="fill-accent-600" x="17" y="13" width="18" height="18" rx="3" />
                <path d="M20 13h12a3 3 0 0 1 3 3v2H17v-2a3 3 0 0 1 3-3z" fill="#9A3412" />
                <rect x="24" y="13" width="4" height="18" fill="#FED7AA" opacity=".7" />
              </svg>
              <span className="text-24 font-extrabold tracking-[-0.045em] text-white">
                percel<span className="text-accent-400">me</span>
              </span>
            </div>
            <p className="m-0 text-14 leading-[1.7] text-slate-300">
              Plot 18, Road 11, Banani, Dhaka-1213
              <br />
              Hotline: 09612-PERCEL (737235)
            </p>
          </div>

          {/* Links Grid */}
          <div className="[&_a]:text-14 [&_a]:text-slate-300 [&_a:hover]:text-white flex flex-wrap gap-14">
            <div className="flex flex-col gap-3">
              <b className="text-14">Company</b>
              <Link href="/contact">About us</Link>
              <Link href="/contact">Careers</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="flex flex-col gap-3">
              <b className="text-14">Services</b>
              <Link href="/#services">Regular delivery</Link>
              <Link href="/#services">Express</Link>
              <Link href="/#services">Cash on delivery</Link>
            </div>
            <div className="flex flex-col gap-3">
              <b className="text-14">Merchants</b>
              <Link href="/register">Create account</Link>
              <Link href="/#merchant">API docs</Link>
              <Link href="/track">Track parcel</Link>
            </div>
            <div className="flex flex-col gap-3">
              <b className="text-14">Legal</b>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/refund">Refund policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-wrap justify-between gap-3 pt-6 border-t border-t-slate-800 text-13 text-slate-400">
          <span>© 2026 percelme Ltd. All rights reserved.</span>
          <span>Powered by percelme</span>
        </div>
      </div>
    </footer>
  );
}

