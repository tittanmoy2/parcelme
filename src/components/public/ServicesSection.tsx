import React from 'react';

export function ServicesSection() {
  return (
    <section className="py-27.5 px-0" id="services">
      <div className="pub-wrap flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3.5 max-w-[620px]">
            <span className="uppercase text-13 font-bold tracking-[.1em] text-brand-600">
              Our services
            </span>
            <h2 className="m-0 text-[length:clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900">
              Everything your business needs to ship
            </h2>
          </div>
          <p className="max-w-[400px] m-0 text-17 leading-[1.6] text-slate-600">
            From a single parcel to thousands a day, one platform handles pickup, delivery, cash collection and returns.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
          <article className="bg-white border border-solid border-slate-200 rounded-20 transition duration-200 hover:border-brand-200 hover:shadow-[0_18px_40px_-18px_rgba(37,99,235,.35)] flex flex-col gap-4 p-7">
            <span className="flex items-center justify-center w-12 h-12 rounded-14 bg-brand-50">
              <svg
                className="stroke-brand-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
            </span>
            <h3 className="m-0 text-20 font-extrabold text-slate-900">Regular delivery</h3>
            <p className="m-0 text-15 leading-[1.6] text-slate-600">
              Nationwide door-to-door delivery in 24–72 hours with full tracking.
            </p>
          </article>

          <article className="bg-white border border-solid border-slate-200 rounded-20 transition duration-200 hover:border-brand-200 hover:shadow-[0_18px_40px_-18px_rgba(37,99,235,.35)] flex flex-col gap-4 p-7">
            <span className="flex items-center justify-center w-12 h-12 rounded-14 bg-accent-100">
              <svg
                className="stroke-accent-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            <h3 className="m-0 text-20 font-extrabold text-slate-900">Express &amp; same-day</h3>
            <p className="m-0 text-15 leading-[1.6] text-slate-600">
              Urgent parcels picked up and delivered the same day inside the city.
            </p>
          </article>

          <article className="bg-white border border-solid border-slate-200 rounded-20 transition duration-200 hover:border-brand-200 hover:shadow-[0_18px_40px_-18px_rgba(37,99,235,.35)] flex flex-col gap-4 p-7">
            <span className="flex items-center justify-center w-12 h-12 rounded-14 bg-green-100">
              <svg
                width="24"
                height="24"
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
            <h3 className="m-0 text-20 font-extrabold text-slate-900">Cash on delivery</h3>
            <p className="m-0 text-15 leading-[1.6] text-slate-600">
              We collect payment from your customer and pay you out to bank, bKash or Nagad.
            </p>
          </article>

          <article className="bg-white border border-solid border-slate-200 rounded-20 transition duration-200 hover:border-brand-200 hover:shadow-[0_18px_40px_-18px_rgba(37,99,235,.35)] flex flex-col gap-4 p-7">
            <span className="flex items-center justify-center w-12 h-12 rounded-14 bg-teal-100">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0F766E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </span>
            <h3 className="m-0 text-20 font-extrabold text-slate-900">Returns &amp; exchange</h3>
            <p className="m-0 text-15 leading-[1.6] text-slate-600">
              Failed or exchanged parcels come back to you, tracked and accounted for.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

