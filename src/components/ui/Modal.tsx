'use client';

import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  closeOnBackdrop?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  className,
  closeOnBackdrop = true,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-[420px]',
    md: 'max-w-[560px]',
    lg: 'max-w-[720px]',
    xl: 'max-w-[900px]',
  }[size];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal Dialog Box matching prototype dialog.pm-modal */}
      <div
        className={cn(
          'relative w-full rounded-[20px] bg-white text-slate-900 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.5)] overflow-hidden flex flex-col max-h-[calc(100vh-48px)] z-10 animate-in fade-in zoom-in-95 duration-200',
          sizeClasses,
          className
        )}
      >
        {/* Header matching .pm-modal-h */}
        {(title || subtitle) && (
          <div className="flex items-center gap-3 px-5 py-4.5 sm:px-6 sm:py-5 border-b border-slate-200">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="m-0 text-lg sm:text-[18px] font-extrabold text-slate-900 tracking-tight leading-snug">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-0.5 text-xs sm:text-[13px] text-slate-500">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-xl transition-colors cursor-pointer shrink-0 ml-auto"
            >
              &times;
            </button>
          </div>
        )}

        {/* Body matching .pm-modal-b */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-4">
          {children}
        </div>

        {/* Footer matching .pm-modal-f */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 px-5 py-4 sm:px-6 sm:py-4.5 border-t border-slate-200 bg-slate-50/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

