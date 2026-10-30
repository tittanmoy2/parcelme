'use client';

import React from 'react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => {
        const typeStyles = {
          ok: 'bg-emerald-600 text-white',
          error: 'bg-rose-600 text-white',
          warn: 'bg-amber-600 text-white',
          info: 'bg-navy text-white',
        }[t.type];

        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between rounded-xl px-4 py-3 shadow-lg text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-bottom-2',
              typeStyles
            )}
          >
            <span>{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss toast"
              className="ml-3 text-lg leading-none opacity-70 hover:opacity-100 cursor-pointer"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}

