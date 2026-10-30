'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-30 pt-4">
      <div className="pub-wrap">
        <nav
          className="flex items-center justify-between gap-4 py-2.5 pr-3 pl-4.5 border border-solid border-slate-200 rounded-18 bg-white/92 backdrop-blur-md shadow-[0_8px_24px_-16px_rgba(15,23,42,.25)]"
          aria-label="Main"
        >
          {/* Brand Logo */}
          <Link className="flex items-center gap-2.5 text-slate-900" href="/">
            <svg width="30" height="35" viewBox="0 0 48 56" aria-hidden="true">
              <circle className="fill-navy" cx="26" cy="22" r="20" />
              <rect className="fill-navy" x="6" y="22" width="11" height="32" rx="5.5" />
              <rect className="fill-accent-600" x="17" y="13" width="18" height="18" rx="3" />
              <path d="M20 13h12a3 3 0 0 1 3 3v2H17v-2a3 3 0 0 1 3-3z" fill="#9A3412" />
              <rect x="24" y="13" width="4" height="18" fill="#FED7AA" opacity=".7" />
            </svg>
            <span className="text-[25px] font-extrabold tracking-[-0.045em] text-navy">
              percel<span className="text-accent-600">me</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden min-[861px]:flex gap-6.5">
            <Link
              className="py-2.5 px-1 text-15 font-semibold text-slate-700 hover:text-brand-600 transition"
              href="/#services"
            >
              Services
            </Link>
            <Link
              className="py-2.5 px-1 text-15 font-semibold text-slate-700 hover:text-brand-600 transition"
              href="/#pricing"
            >
              Pricing
            </Link>
            <Link
              className="py-2.5 px-1 text-15 font-semibold text-slate-700 hover:text-brand-600 transition"
              href="/coverage"
            >
              Coverage
            </Link>
            <Link
              className="py-2.5 px-1 text-15 font-semibold text-slate-700 hover:text-brand-600 transition"
              href="/#merchant"
            >
              For Merchants
            </Link>
            <Link
              className="py-2.5 px-1 text-15 font-semibold text-slate-700 hover:text-brand-600 transition"
              href="/#faq"
            >
              FAQ
            </Link>
          </div>

          {/* Desktop & Mobile Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden min-[861px]:flex items-center h-11 py-0 px-4 text-15 font-bold text-slate-900 hover:text-brand-600 transition"
            >
              Log in
            </Link>
            <Link
              className="flex items-center h-11 py-0 px-4.5 rounded-12 bg-brand-600 hover:bg-brand-700 text-15 font-bold text-white transition shadow-sm pub-hide-xs"
              href="/register"
            >
              Become a merchant
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-[861px]:hidden flex items-center justify-center w-11 h-11 rounded-12 border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="min-[861px]:hidden mt-2 p-4 bg-white/98 backdrop-blur-md border border-slate-200 rounded-18 shadow-lg flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-15 font-semibold text-slate-800 hover:bg-slate-50 rounded-10"
              href="/#services"
            >
              Services
            </Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-15 font-semibold text-slate-800 hover:bg-slate-50 rounded-10"
              href="/#pricing"
            >
              Pricing
            </Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-15 font-semibold text-slate-800 hover:bg-slate-50 rounded-10"
              href="/coverage"
            >
              Coverage
            </Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-15 font-semibold text-slate-800 hover:bg-slate-50 rounded-10"
              href="/#merchant"
            >
              For Merchants
            </Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-15 font-semibold text-slate-800 hover:bg-slate-50 rounded-10"
              href="/#faq"
            >
              FAQ
            </Link>
            <div className="h-px bg-slate-200 my-1" />
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-15 font-bold text-slate-900 hover:bg-slate-50 rounded-10"
              href="/login"
            >
              Log in to Portal
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

