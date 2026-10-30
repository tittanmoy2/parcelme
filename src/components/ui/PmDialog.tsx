'use client';

import { useEffect, useId, useRef, type FormEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { validateForm } from '@/components/ui/PrototypeBehaviour';

// The prototype's runtime modal (PM.modal / merchant.js modal()) as a component: a native
// <dialog class="pm-modal"> wrapping a form. Esc, × and Cancel all end in onClose.
// onSubmit runs after the required/phone/email checks pass.

interface PmDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  onSubmit?: (form: HTMLFormElement) => void;
  validate?: boolean;
  className?: string;
}

export function PmDialog({ open, onClose, title, children, footer, onSubmit, validate = true, className }: PmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.querySelector<HTMLElement>('.pm-modal-b input:not([type=hidden]):not([disabled]),.pm-modal-b select,.pm-modal-b textarea')?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validate && !validateForm(e.currentTarget)) return;
    onSubmit?.(e.currentTarget);
  }

  return (
    <dialog ref={ref} className={cn('pm-modal', className)} aria-labelledby={titleId} onClose={onClose}>
      {open && (
        <form noValidate onSubmit={handleSubmit}>
          <div className="pm-modal-h">
            <h2 id={titleId}>{title}</h2>
            <button type="button" aria-label="Close" onClick={onClose}>×</button>
          </div>
          <div className="pm-modal-b">{children}</div>
          <div className="pm-modal-f flex-wrap">{footer}</div>
        </form>
      )}
    </dialog>
  );
}
