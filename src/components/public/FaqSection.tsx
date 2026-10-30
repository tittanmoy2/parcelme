'use client';

import React, { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: 'How fast do I get my COD money?',
    answer:
      'COD is paid out after delivery on your chosen schedule: daily or weekly, to bank, bKash or Nagad.',
  },
  {
    question: 'Can I schedule a pickup from my shop?',
    answer:
      'Yes. Save one or more pickup locations and request a pickup from your dashboard.',
  },
  {
    question: 'What happens if my customer refuses the parcel?',
    answer:
      'The parcel is marked as returned and sent back to you. You can see every return in your dashboard.',
  },
  {
    question: 'Do you have an API for my website?',
    answer:
      'Yes. Generate an API key from your merchant dashboard and create parcels straight from your store.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-25 px-0 border-t border-t-slate-200 bg-slate-50" id="faq">
      <div className="pub-wrap flex flex-wrap gap-12">
        {/* Left Column: Heading & Contact info */}
        <div className="flex flex-col flex-[1_1_300px] gap-3.5">
          <span className="uppercase text-13 font-bold tracking-[.1em] text-brand-600">
            FAQ
          </span>
          <h2 className="m-0 text-[length:clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900">
            Questions, answered
          </h2>
          <p className="m-0 text-16 leading-[1.6] text-slate-600">
            Still need help? Call us at 09612-PERCEL or email support@percelme.com.
          </p>
        </div>

        {/* Right Column: Accordion Items */}
        <div className="flex-[2_1_480px] min-w-0">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <details
                key={item.question}
                className="group py-5 px-0 border-b border-b-slate-200"
                open={isOpen}
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem(index);
                }}
              >
                <summary className="flex items-center justify-between gap-4 text-17 font-bold text-slate-900 cursor-pointer [list-style:none] hover:text-brand-700 transition [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <svg
                    className={`flex-none stroke-brand-600 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2.4"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 mb-0 mx-0 leading-[1.7] text-slate-600">
                  {item.answer}
                </p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

