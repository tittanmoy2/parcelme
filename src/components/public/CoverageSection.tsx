'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DIVISIONS = [
  { name: 'Dhaka', time: '24h', primary: true },
  { name: 'Chattogram', time: '48h' },
  { name: 'Rajshahi', time: '48h' },
  { name: 'Khulna', time: '48h' },
  { name: 'Sylhet', time: '48h' },
  { name: 'Barishal', time: '72h' },
  { name: 'Rangpur', time: '72h' },
  { name: 'Mymensingh', time: '48h' },
];

export function CoverageSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push('/coverage');
      return;
    }
    router.push(`/coverage?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="pt-0 pb-27.5 px-0" id="coverage">
      <div className="pub-wrap flex flex-col items-center gap-9 text-center">
        <div className="flex flex-col items-center gap-3.5">
          <span className="uppercase text-13 font-bold tracking-[.1em] text-brand-600">
            Coverage
          </span>
          <h2 className="m-0 text-[length:clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900">
            We deliver to every division
          </h2>
          <p className="max-w-[560px] m-0 text-17 leading-[1.6] text-slate-600">
            Home delivery in all 64 districts and 490+ upazilas. Search your area to check delivery time.
          </p>
        </div>

        {/* Division badges */}
        <div className="flex flex-wrap justify-center gap-3 max-w-[860px]">
          {DIVISIONS.map((d) =>
            d.primary ? (
              <Link
                key={d.name}
                className="py-3 px-5 rounded-full bg-brand-600 hover:bg-brand-700 font-bold text-white transition shadow-sm"
                href={`/coverage?div=${encodeURIComponent(d.name)}`}
              >
                {d.name} · {d.time}
              </Link>
            ) : (
              <Link
                key={d.name}
                className="py-3 px-5 border border-solid border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-full font-semibold text-slate-900 transition"
                href={`/coverage?div=${encodeURIComponent(d.name)}`}
              >
                {d.name} · {d.time}
              </Link>
            )
          )}
        </div>

        {/* Area search input */}
        <form className="w-[min(480px,100%)]" onSubmit={handleSearch} role="search">
          <label className="flex items-center gap-2.5 box-border w-full py-0 px-4 border border-solid border-slate-300 rounded-14 bg-white shadow-sm focus-within:border-brand-600 focus-within:shadow-[0_0_0_4px_var(--color-brand-100)] transition">
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
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="sr-only">Search your area</span>
            <input
              className="flex-1 h-13 min-w-0 border-0 bg-transparent font-sans text-16 font-medium leading-[normal] text-slate-900 outline-none placeholder:text-slate-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search thana or area, e.g. Mirpur 10"
              enterKeyHint="search"
            />
          </label>
        </form>
      </div>
    </section>
  );
}

