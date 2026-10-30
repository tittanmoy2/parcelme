import React from 'react';

export function HowItWorksSection() {
  return (
    <section className="py-25 px-0 border-t border-b border-t-slate-200 border-b-slate-200 bg-slate-50">
      <div className="pub-wrap flex flex-col gap-13">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <span className="uppercase text-13 font-bold tracking-[.1em] text-brand-600">
            How it works
          </span>
          <h2 className="m-0 text-[length:clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900">
            Ship in four simple steps
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5">
          <div className="flex flex-col gap-3.5 p-2">
            <span className="font-mono text-15 font-semibold text-brand-600">01</span>
            <div className="h-[3px] rounded-3 bg-brand-600" />
            <h3 className="m-0 text-19 font-extrabold text-slate-900">Create a parcel</h3>
            <p className="m-0 text-15 leading-[1.6] text-slate-600">
              Add it from the dashboard, upload a CSV or connect your store by API.
            </p>
          </div>
          <div className="flex flex-col gap-3.5 p-2">
            <span className="font-mono text-15 font-semibold text-brand-600">02</span>
            <div className="h-[3px] rounded-3 bg-brand-600" />
            <h3 className="m-0 text-19 font-extrabold text-slate-900">We pick it up</h3>
            <p className="m-0 text-15 leading-[1.6] text-slate-600">
              A rider collects from your shop or warehouse at your chosen time.
            </p>
          </div>
          <div className="flex flex-col gap-3.5 p-2">
            <span className="font-mono text-15 font-semibold text-brand-600">03</span>
            <div className="h-[3px] rounded-3 bg-brand-600" />
            <h3 className="m-0 text-19 font-extrabold text-slate-900">Track it live</h3>
            <p className="m-0 text-15 leading-[1.6] text-slate-600">
              You and your customer get SMS updates at every hub and handover.
            </p>
          </div>
          <div className="flex flex-col gap-3.5 p-2">
            <span className="font-mono text-15 font-semibold text-accent-600">04</span>
            <div className="h-[3px] rounded-3 bg-accent-500" />
            <h3 className="m-0 text-19 font-extrabold text-slate-900">Delivered &amp; paid</h3>
            <p className="m-0 text-15 leading-[1.6] text-slate-600">
              Customer receives with OTP; your COD lands in your account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

