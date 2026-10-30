import React from 'react';
import Link from 'next/link';

export function MerchantSection() {
  return (
    <section className="pt-0 pb-27.5 px-0" id="merchant">
      <div className="pub-wrap">
        <div className="flex relative flex-wrap items-center gap-12 p-[clamp(28px,5vw,64px)] rounded-32 bg-brand-900 text-white overflow-hidden shadow-2xl">
          {/* Decorative orange radial ring */}
          <div
            className="absolute -top-30 -right-30 w-[420px] h-[420px] border-[60px] border-solid border-[rgba(249,115,22,.18)] rounded-full pointer-events-none"
            aria-hidden="true"
          />

          {/* Left: Value Proposition */}
          <div className="flex relative flex-col flex-[1_1_380px] gap-5.5 min-w-0">
            <span className="uppercase text-13 font-bold tracking-[.1em] text-accent-300">
              For merchants
            </span>
            <h2 className="m-0 text-[length:clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
              Your whole delivery business in one dashboard
            </h2>
            <div className="flex flex-col gap-3.5 text-16 text-brand-100">
              <span className="flex items-center gap-3">
                <svg
                  className="stroke-accent-300"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.6"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Bulk upload hundreds of orders from Excel
              </span>
              <span className="flex items-center gap-3">
                <svg
                  className="stroke-accent-300"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.6"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Fraud check before you ship to a customer
              </span>
              <span className="flex items-center gap-3">
                <svg
                  className="stroke-accent-300"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.6"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Daily COD payout to bKash, Nagad or bank
              </span>
              <span className="flex items-center gap-3">
                <svg
                  className="stroke-accent-300"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.6"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                API &amp; WooCommerce integration
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="flex items-center h-13 py-0 px-6 rounded-12 bg-accent-500 hover:bg-accent-600 font-extrabold text-stone-900 transition"
                href="/register"
              >
                Open free account
              </Link>
              <Link
                className="flex items-center h-13 py-0 px-6 border border-solid border-brand-400 hover:bg-brand-800 rounded-12 font-bold text-white transition"
                href="/merchant/dashboard"
              >
                See dashboard
              </Link>
            </div>
          </div>

          {/* Right: Interactive Merchant Mini Dashboard Preview */}
          <div className="flex relative flex-col flex-[1_1_420px] gap-4 min-w-0 p-5 rounded-20 bg-white text-slate-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,.5)]">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">This week</span>
              <span className="text-13 text-slate-600">Oct 4 – Oct 10</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3.5 rounded-14 bg-brand-50">
                <div className="text-12 font-semibold text-brand-800">Parcels</div>
                <div className="text-24 font-extrabold text-brand-900">342</div>
              </div>
              <div className="p-3.5 rounded-14 bg-green-100">
                <div className="text-12 font-semibold text-green-800">Delivered</div>
                <div className="text-24 font-extrabold text-green-950">94%</div>
              </div>
              <div className="p-3.5 rounded-14 bg-accent-100">
                <div className="text-12 font-semibold text-orange-800">COD</div>
                <div className="text-24 font-extrabold text-orange-950">৳1.2L</div>
              </div>
            </div>
            <div className="flex items-end gap-2.5 h-[130px] py-0 px-1 border-b border-b-slate-200">
              <div className="flex-1 h-[45%] rounded-t-8 rounded-b-none bg-brand-200 transition-all hover:bg-brand-300" />
              <div className="flex-1 h-[62%] rounded-t-8 rounded-b-none bg-brand-200 transition-all hover:bg-brand-300" />
              <div className="flex-1 h-[54%] rounded-t-8 rounded-b-none bg-brand-200 transition-all hover:bg-brand-300" />
              <div className="flex-1 h-[80%] rounded-t-8 rounded-b-none bg-brand-200 transition-all hover:bg-brand-300" />
              <div className="flex-1 h-[70%] rounded-t-8 rounded-b-none bg-brand-200 transition-all hover:bg-brand-300" />
              <div className="flex-1 h-[96%] rounded-t-8 rounded-b-none bg-brand-600 shadow-md" />
              <div className="flex-1 h-[58%] rounded-t-8 rounded-b-none bg-brand-200 transition-all hover:bg-brand-300" />
            </div>
            <div className="flex justify-between py-0 px-1 text-12 text-slate-600 font-medium">
              <span>Sat</span>
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

