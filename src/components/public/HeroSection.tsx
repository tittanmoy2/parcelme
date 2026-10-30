'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const router = useRouter();
  const [trackId, setTrackId] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    router.push(`/track?id=${encodeURIComponent(trackId.trim())}`);
  };

  const handleDemoClick = (demoId: string) => {
    setTrackId(demoId);
    router.push(`/track?id=${encodeURIComponent(demoId)}`);
  };

  return (
    <section className="relative pt-16 pb-24 px-0">
      {/* Dot matrix background overlay */}
      <div
        className="absolute -top-30 bottom-0 inset-x-0 bg-[radial-gradient(var(--color-brand-100)_1.2px,transparent_1.2px)] [background-size:22px_22px] opacity-70 [mask-image:linear-gradient(180deg,#000_30%,transparent_90%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="pub-wrap flex relative flex-wrap items-center gap-14">
        {/* Left column: Hero content & tracking form */}
        <div className="flex flex-col flex-[1_1_520px] gap-6.5 min-w-0">
          <span className="inline-flex items-center self-start gap-2 py-[7px] pr-3.5 pl-2 border border-solid border-orange-200 rounded-full bg-accent-50 text-14 font-semibold text-orange-800">
            <span className="py-0.5 px-[9px] rounded-full bg-accent-500 text-12 font-extrabold text-stone-900">
              NEW
            </span>
            Same-day delivery inside Dhaka
          </span>

          <h1 className="m-0 text-[length:clamp(40px,5.6vw,68px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-slate-900">
            Parcels delivered
            <br />
            across <span className="text-brand-600">all 64 districts</span>, on time.
          </h1>

          <p className="max-w-[540px] m-0 text-19 leading-[1.65] text-slate-600">
            Book a pickup, track every step live and get your cash-on-delivery paid out fast. Built for online sellers and businesses in Bangladesh.
          </p>

          {/* Search / Track Form */}
          <form
            onSubmit={handleTrackSubmit}
            className="flex flex-wrap gap-2.5 max-w-[560px] p-2 border border-solid border-slate-300 rounded-18 bg-white shadow-[0_24px_48px_-24px_rgba(37,99,235,.45)]"
            role="search"
          >
            <label className="flex items-center flex-[1_1_240px] gap-2.5 py-0 px-3 cursor-text">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748B"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="sr-only">Tracking ID or phone number</span>
              <input
                className="flex-1 h-12 min-w-0 border-0 bg-transparent font-sans text-16 font-medium leading-[normal] text-slate-900 outline-none placeholder:text-slate-400"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                autoComplete="off"
                placeholder="Enter tracking ID or phone"
              />
            </label>
            <button
              className="flex items-center justify-center gap-2 h-13 py-0 px-6.5 border-0 rounded-12 bg-accent-500 hover:bg-accent-600 font-sans text-16 font-extrabold leading-[normal] text-stone-900 cursor-pointer max-[520px]:flex-[1_1_100%] max-[520px]:justify-center transition"
              type="submit"
            >
              Track parcel
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Demo trigger */}
          <p className="-mt-3 mx-0 mb-0 text-13 text-slate-600">
            Demo: try{' '}
            <button
              className="p-0 border-0 bg-transparent font-mono text-13 font-semibold leading-[normal] text-brand-700 underline cursor-pointer hover:text-brand-800"
              type="button"
              onClick={() => handleDemoClick('PM-2410-8F3K29')}
            >
              PM-2410-8F3K29
            </button>
          </p>

          {/* Trust points */}
          <div className="flex flex-wrap gap-5.5 text-14 font-semibold text-slate-700">
            <span className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.6"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Cash on delivery
            </span>
            <span className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.6"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Live SMS updates
            </span>
            <span className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.6"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              bKash / Nagad payout
            </span>
          </div>
        </div>

        {/* Right column: Hero Visual */}
        <div className="max-[520px]:min-h-[440px] relative flex-[1_1_440px] min-w-0 min-h-[520px]">
          {/* Blue background canvas with map curve */}
          <div className="absolute top-5 bottom-0 right-0 left-10 rounded-32 bg-brand-600 overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 480 500"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <g stroke="#3B82F6" strokeWidth="1" fill="none" opacity=".7">
                <path d="M0 80h480M0 160h480M0 240h480M0 320h480M0 400h480M80 0v500M160 0v500M240 0v500M320 0v500M400 0v500" />
              </g>
              <path
                d="M70 420 C 140 360, 120 260, 220 240 S 360 170, 400 80"
                stroke="#FED7AA"
                strokeWidth="5"
                strokeDasharray="2 12"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="70" cy="420" r="10" fill="#fff" />
              <circle cx="70" cy="420" r="22" fill="#fff" opacity=".2" />
              <circle className="fill-accent-500" cx="400" cy="80" r="12" />
              <circle className="fill-accent-500" cx="400" cy="80" r="28" opacity=".25" />
            </svg>
          </div>

          {/* Floating Card 1: Out for delivery tracker */}
          <div className="bg-white border border-solid border-slate-200 rounded-20 transition-all duration-200 hover:border-brand-200 flex absolute top-17.5 left-0 flex-col gap-4 w-[min(340px,86%)] p-5.5 shadow-[0_30px_60px_-20px_rgba(15,23,42,.35)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-14 font-semibold text-brand-700">PM-2410-8F3K29</span>
              <span className="inline-flex items-center gap-1.5 py-[5px] px-2.5 rounded-full bg-accent-100 text-12 font-bold text-orange-800">
                <span className="w-[7px] h-[7px] rounded-full bg-accent-600 animate-pulse" />
                Out for delivery
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="flex gap-3">
                <span className="flex-none w-3 h-3 mt-1 rounded-full bg-brand-600" />
                <div>
                  <div className="text-14 font-bold text-slate-900">Picked up · Gulshan hub</div>
                  <div className="text-13 text-slate-600">Today, 09:12 AM</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-none w-3 h-3 mt-1 rounded-full bg-brand-600" />
                <div>
                  <div className="text-14 font-bold text-slate-900">Reached Mirpur hub</div>
                  <div className="text-13 text-slate-600">Today, 11:40 AM</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-none w-3 h-3 mt-1 rounded-full bg-accent-500 shadow-[0_0_0_5px_var(--color-accent-100)]" />
                <div>
                  <div className="text-14 font-bold text-slate-900">Rider on the way</div>
                  <div className="text-13 text-slate-600">ETA 2:30 PM · Rakib H.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card 2: Cash on delivery payout */}
          <div className="bg-white border border-solid border-slate-200 rounded-20 transition-all duration-200 hover:border-brand-200 flex absolute bottom-7.5 right-0 items-center gap-3.5 w-[min(250px,64%)] p-4.5 shadow-[0_30px_60px_-20px_rgba(15,23,42,.35)]">
            <span className="flex items-center justify-center w-12 h-12 rounded-14 bg-green-100">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#15803D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
              </svg>
            </span>
            <div>
              <div className="text-13 font-semibold text-slate-600">COD paid out</div>
              <div className="text-22 font-extrabold text-slate-900">৳ 48,250</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

