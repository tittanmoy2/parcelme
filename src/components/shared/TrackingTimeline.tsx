'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ParcelEvent, ParcelStatus } from '@/types/parcel';

export type TrackingStage =
  | 'pending'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned'
  | 'cancelled';

export interface TrackingStep {
  key: TrackingStage;
  label: string;
}

const DEFAULT_STAGES: TrackingStep[] = [
  { key: 'pending', label: 'Booked' },
  { key: 'picked_up', label: 'Picked up' },
  { key: 'in_transit', label: 'In transit' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export interface TrackingTimelineProps {
  currentStage: ParcelStatus;
  events?: ParcelEvent[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function TrackingTimeline({
  currentStage,
  events = [],
  orientation = 'horizontal',
  className,
}: TrackingTimelineProps) {
  const stageOrder: Record<string, number> = {
    pending: 1,
    picked_up: 2,
    in_transit: 3,
    out_for_delivery: 4,
    delivered: 5,
    returned: 4,
    cancelled: 1,
    on_hold: 3,
  };

  const currentLevel = stageOrder[currentStage] || 1;

  if (orientation === 'vertical') {
    return (
      <ol className={cn('p-0 m-0 list-none', className)}>
        {events && events.length > 0 ? (
          events.map((evt, idx) => {
            const isLast = idx === events.length - 1;
            const isCurrent = idx === 0;

            return (
              <li
                key={evt.id || idx}
                className="flex relative gap-4 pb-6.5 last:pb-0"
              >
                {!isLast && (
                  <span
                    className="absolute top-8 bottom-0 left-[15px] w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    'flex items-center justify-center flex-none w-8 h-8 rounded-full z-10',
                    isCurrent
                      ? 'bg-accent-500 shadow-[0_0_0_6px_var(--color-accent-100,#FFEDD5)] text-stone-900'
                      : 'bg-brand-100 text-brand-700'
                  )}
                >
                  {isCurrent ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <div className="flex flex-wrap justify-between flex-1 gap-2">
                  <div>
                    <h4 className="m-0 text-16 font-bold text-slate-900">
                      {evt.title}
                    </h4>
                    {evt.description && (
                      <p className="mt-1 mx-0 mb-0 text-14 text-slate-600">
                        {evt.description}
                      </p>
                    )}
                    {evt.hubName && (
                      <span className="inline-block mt-1 text-xs text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-md">
                        {evt.hubName}
                      </span>
                    )}
                  </div>
                  <time className="text-13 font-semibold whitespace-nowrap text-slate-500">
                    {evt.timestamp}
                  </time>
                </div>
              </li>
            );
          })
        ) : (
          DEFAULT_STAGES.map((st, idx) => {
            const stepLevel = idx + 1;
            const isCompleted = stepLevel < currentLevel;
            const isCurrent = stepLevel === currentLevel;
            const isLast = idx === DEFAULT_STAGES.length - 1;

            return (
              <li key={st.key} className="flex relative gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className={cn(
                      'absolute top-8 bottom-0 left-[15px] w-0.5',
                      isCompleted ? 'bg-brand-600' : 'bg-slate-200'
                    )}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    'flex items-center justify-center flex-none w-8 h-8 rounded-full z-10 transition-colors',
                    isCompleted && 'bg-brand-600 text-white',
                    isCurrent &&
                      'bg-accent-500 text-stone-900 shadow-[0_0_0_6px_var(--color-accent-100,#FFEDD5)]',
                    !isCompleted && !isCurrent && 'bg-slate-100 text-slate-400'
                  )}
                >
                  {isCompleted ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{stepLevel}</span>
                  )}
                </span>
                <div className="flex-1">
                  <h4
                    className={cn(
                      'm-0 text-15 font-bold',
                      isCurrent
                        ? 'text-orange-900'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    )}
                  >
                    {st.label}
                  </h4>
                </div>
              </li>
            );
          })
        )}
      </ol>
    );
  }

  // Horizontal Stepper
  return (
    <div className={cn('w-full flex flex-col gap-3', className)}>
      {/* Node & Bar Stepper */}
      <div className="flex items-center justify-between relative w-full">
        {DEFAULT_STAGES.map((st, idx) => {
          const stepLevel = idx + 1;
          const isCompleted = stepLevel < currentLevel;
          const isCurrent = stepLevel === currentLevel;
          const isLast = idx === DEFAULT_STAGES.length - 1;

          return (
            <React.Fragment key={st.key}>
              {/* Step Circle Node */}
              <div className="flex flex-col items-center relative z-10">
                <span
                  className={cn(
                    'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    isCompleted && 'bg-brand-600 text-white',
                    isCurrent &&
                      'bg-accent-500 text-stone-900 ring-4 ring-accent-100',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-slate-100 border border-slate-300 text-slate-400'
                  )}
                >
                  {isCompleted ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <span>{stepLevel}</span>
                  )}
                </span>
              </div>

              {/* Connecting Bar */}
              {!isLast && (
                <div className="flex-1 h-1 sm:h-1.5 mx-1 sm:mx-2 rounded-full overflow-hidden bg-slate-200">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      isCompleted ? 'w-full bg-brand-600' : 'w-0'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Labels Row */}
      <div className="flex justify-between text-xs sm:text-[13px] font-bold text-slate-500 px-0.5">
        {DEFAULT_STAGES.map((st, idx) => {
          const stepLevel = idx + 1;
          const isCompleted = stepLevel < currentLevel;
          const isCurrent = stepLevel === currentLevel;

          return (
            <span
              key={st.key}
              className={cn(
                'text-center transition-colors',
                isCompleted && 'text-brand-700',
                isCurrent && 'text-orange-800 font-extrabold',
                !isCompleted && !isCurrent && 'text-slate-400'
              )}
            >
              {st.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

