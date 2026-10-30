'use client';

import React, { useState, useId } from 'react';

const PICKUP_OPTIONS = ['Dhaka', 'Gazipur', 'Narayanganj', 'Chattogram', 'Sylhet'];
const DELIVERY_OPTIONS = [
  'Dhaka',
  'Gazipur',
  'Narayanganj',
  'Savar',
  'Chattogram',
  'Cumilla',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
];

const SUBURBS = ['Gazipur', 'Narayanganj', 'Savar'];
const isMetro = (city: string) => city === 'Dhaka' || SUBURBS.includes(city);

export function PricingSection() {
  const fromId = useId();
  const toId = useId();
  const weightId = useId();
  const codId = useId();

  const [from, setFrom] = useState('Dhaka');
  const [to, setTo] = useState('Chattogram');
  const [weight, setWeight] = useState('2');
  const [cod, setCod] = useState('1,500');
  const [service, setService] = useState<'regular' | 'express'>('regular');

  // Parse numerical inputs
  const parseNum = (val: string) => Number(val.replace(/[,\s৳]/g, ''));
  const w = parseNum(weight);
  const c = cod.trim() === '' ? 0 : parseNum(cod);

  // Validation
  const weightInvalid = isNaN(w) || w <= 0 || w > 30;
  const weightErr =
    isNaN(w) || w <= 0 ? 'Enter weight in kg' : w > 30 ? 'Max 30 kg per parcel' : '';

  const codInvalid = isNaN(c) || c < 0 || c > 100000;
  const codErr =
    isNaN(c) || c < 0 ? 'Enter an amount in taka' : c > 100000 ? 'Max ৳ 1,00,000' : '';

  const isFormValid = !weightInvalid && !codInvalid;

  // Pricing calculation
  const base = from === to ? 60 : isMetro(from) && isMetro(to) ? 80 : 120;
  const extraKg = Math.max(0, Math.ceil(w) - 1);
  const extra = extraKg * 20;
  const codFee = Math.round(c * 0.01);
  const express = service === 'express' ? 50 : 0;
  const total = base + extra + codFee + express;

  const parts: string[] = [`৳${base}`];
  if (extra > 0) parts.push(`৳${extra} extra kg`);
  if (codFee > 0) parts.push(`৳${codFee} COD`);
  if (express > 0) parts.push(`৳${express} express`);

  const breakdownText = isFormValid ? parts.join(' + ') : 'Fix the highlighted fields';
  const totalDisplay = isFormValid ? `৳ ${total.toLocaleString('en-IN')}` : '৳ —';

  const handleCodBlur = () => {
    const num = parseNum(cod);
    if (!isNaN(num) && num >= 0) {
      setCod(num.toLocaleString('en-IN'));
    }
  };

  return (
    <section className="py-27.5 px-0" id="pricing">
      <div className="pub-wrap flex flex-wrap items-start gap-12">
        {/* Left Column: Transparent pricing table */}
        <div className="flex flex-col flex-[1_1_380px] gap-5 min-w-0">
          <span className="uppercase text-13 font-bold tracking-[.1em] text-brand-600">
            Pricing
          </span>
          <h2 className="m-0 text-[length:clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900">
            Simple, transparent delivery charges
          </h2>
          <p className="m-0 text-17 leading-[1.6] text-slate-600">
            Pay per parcel. No setup fee, no monthly fee. Extra weight is charged per kg.
          </p>
          <div className="flex flex-col border border-solid border-slate-200 rounded-18 overflow-hidden bg-white">
            <div className="flex justify-between py-4.5 px-5.5 bg-slate-50 uppercase text-13 font-bold tracking-[.06em] text-slate-600">
              <span>Zone (up to 1 kg)</span>
              <span>Charge</span>
            </div>
            <div className="flex justify-between py-4.5 px-5.5 border-t border-t-slate-200">
              <span className="font-semibold text-slate-900">Inside Dhaka</span>
              <span className="font-extrabold text-slate-900">৳ 60</span>
            </div>
            <div className="flex justify-between py-4.5 px-5.5 border-t border-t-slate-200">
              <span className="font-semibold text-slate-900">Dhaka suburbs</span>
              <span className="font-extrabold text-slate-900">৳ 80</span>
            </div>
            <div className="flex justify-between py-4.5 px-5.5 border-t border-t-slate-200">
              <span className="font-semibold text-slate-900">Outside Dhaka</span>
              <span className="font-extrabold text-slate-900">৳ 120</span>
            </div>
            <div className="flex justify-between py-4.5 px-5.5 border-t border-t-slate-200 bg-accent-50">
              <span className="font-semibold text-slate-900">COD charge</span>
              <span className="font-extrabold text-orange-800">1%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Delivery Charge Calculator */}
        <form
          className="bg-white border border-solid border-slate-200 rounded-20 transition duration-200 hover:border-brand-200 flex flex-col flex-[1_1_420px] gap-4.5 min-w-0 p-8 shadow-[0_30px_60px_-30px_rgba(37,99,235,.4)]"
          id="calcForm"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          <h3 className="m-0 text-22 font-extrabold text-slate-900">Delivery charge calculator</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
            {/* Pickup from */}
            <label htmlFor={fromId} className="flex flex-col gap-[7px] text-14 font-semibold text-slate-900">
              Pickup from
              <select
                id={fromId}
                className="h-12 py-0 px-3 border border-solid border-slate-300 rounded-12 bg-white font-sans text-15 font-medium leading-[normal] text-slate-900 focus:outline-none focus:shadow-[0_0_0_4px_var(--color-brand-100)]"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {PICKUP_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {/* Deliver to */}
            <label htmlFor={toId} className="flex flex-col gap-[7px] text-14 font-semibold text-slate-900">
              Deliver to
              <select
                id={toId}
                className="h-12 py-0 px-3 border border-solid border-slate-300 rounded-12 bg-white font-sans text-15 font-medium leading-[normal] text-slate-900 focus:outline-none focus:shadow-[0_0_0_4px_var(--color-brand-100)]"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {DELIVERY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {/* Weight */}
            <label htmlFor={weightId} className="flex flex-col gap-[7px] text-14 font-semibold text-slate-900">
              Weight (kg)
              <input
                id={weightId}
                className={`box-border h-12 py-0 px-3.5 border border-solid rounded-12 font-sans text-15 font-medium leading-[normal] text-slate-900 focus:outline-none focus:border-brand-600 focus:shadow-[0_0_0_4px_var(--color-brand-100)] ${
                  weightErr ? 'border-red-700 bg-red-50/50' : 'border-slate-300'
                }`}
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                aria-invalid={!!weightErr}
              />
              {weightErr && (
                <span className="text-12.5 font-semibold text-red-700">{weightErr}</span>
              )}
            </label>

            {/* COD amount */}
            <label htmlFor={codId} className="flex flex-col gap-[7px] text-14 font-semibold text-slate-900">
              COD amount (৳)
              <input
                id={codId}
                className={`box-border h-12 py-0 px-3.5 border border-solid rounded-12 font-sans text-15 font-medium leading-[normal] text-slate-900 focus:outline-none focus:border-brand-600 focus:shadow-[0_0_0_4px_var(--color-brand-100)] ${
                  codErr ? 'border-red-700 bg-red-50/50' : 'border-slate-300'
                }`}
                inputMode="numeric"
                value={cod}
                onChange={(e) => setCod(e.target.value)}
                onBlur={handleCodBlur}
                aria-invalid={!!codErr}
              />
              {codErr && <span className="text-12.5 font-semibold text-red-700">{codErr}</span>}
            </label>
          </div>

          {/* Service Option Selection */}
          <fieldset className="flex flex-wrap gap-2.5 p-0 m-0 border-0">
            <legend className="mb-2 text-14 font-semibold text-slate-900">Service</legend>
            <label className={`svc-opt ${service === 'regular' ? 'on' : ''}`}>
              <input
                type="radio"
                name="svc"
                value="regular"
                checked={service === 'regular'}
                onChange={() => setService('regular')}
                className="focus:outline-none"
              />
              Regular
            </label>
            <label className={`svc-opt ${service === 'express' ? 'on' : ''}`}>
              <input
                type="radio"
                name="svc"
                value="express"
                checked={service === 'express'}
                onChange={() => setService('express')}
                className="focus:outline-none"
              />
              Express <span className="text-12.5 font-semibold text-slate-600">+৳50</span>
            </label>
          </fieldset>

          {/* Total & Breakdown Display */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5 px-5.5 rounded-16 bg-slate-900 text-white">
            <div>
              <div className="text-13 text-slate-300">Estimated charge</div>
              <div className="text-13 text-slate-300">{breakdownText}</div>
            </div>
            <output className="text-34 font-extrabold" aria-live="polite">
              {totalDisplay}
            </output>
          </div>
        </form>
      </div>
    </section>
  );
}

