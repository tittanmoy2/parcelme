import React from 'react';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="py-22.5 px-0">
      <div className="pub-wrap">
        <div className="flex flex-wrap items-center justify-between gap-7 p-[clamp(28px,5vw,56px)] rounded-[28px] bg-accent-500">
          <div className="flex flex-col gap-2.5 max-w-[620px]">
            <h2 className="m-0 text-[length:clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-stone-900">
              Start shipping today
            </h2>
            <p className="m-0 text-18 leading-[1.6] text-orange-950">
              Create a free merchant account in two minutes. Your first pickup can be tomorrow.
            </p>
          </div>
          <Link
            className="flex items-center gap-2.5 h-14 py-0 px-7.5 rounded-14 bg-slate-900 text-17 font-extrabold text-white hover:bg-slate-800 transition"
            href="/register"
          >
            Create account
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
          </Link>
        </div>
      </div>
    </section>
  );
}
