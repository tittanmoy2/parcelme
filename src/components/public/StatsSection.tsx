import React from 'react';

export function StatsSection() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="pub-wrap grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 py-11">
        <div>
          <div className="text-40 font-extrabold tracking-[-0.03em]">64</div>
          <div className="text-15 text-slate-300">Districts covered</div>
        </div>
        <div>
          <div className="text-40 font-extrabold tracking-[-0.03em]">24h</div>
          <div className="text-15 text-slate-300">Delivery inside Dhaka</div>
        </div>
        <div>
          <div className="text-40 font-extrabold tracking-[-0.03em] text-accent-300">[X]K+</div>
          <div className="text-15 text-slate-300">Active merchants</div>
        </div>
        <div>
          <div className="text-40 font-extrabold tracking-[-0.03em] text-accent-300">[X]M+</div>
          <div className="text-15 text-slate-300">Parcels delivered</div>
        </div>
      </div>
    </section>
  );
}

