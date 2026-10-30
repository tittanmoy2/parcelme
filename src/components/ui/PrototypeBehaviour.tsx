'use client';

import { useEffect } from 'react';
import { showToast } from '@/hooks/useToast';
import type { ToastMessage } from '@/types/common';

// Port of the delegated handlers in docs/prototype/assets/core.js. Ported pages keep the
// prototype's markup, so <dialog class="pm-modal" id="x"> opens from [data-modal-open="x"],
// closes from [data-modal-close], and [data-toast] buttons show a toast without page code.

export function openModal(id: string) {
  const d = document.getElementById(id);
  if (d instanceof HTMLDialogElement && !d.open) d.showModal();
}

export function closeModal(id?: string) {
  const d = id ? document.getElementById(id) : document.querySelector('dialog[open]');
  if (d instanceof HTMLDialogElement) d.close();
}

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// Required/phone/email/minlength checks for forms marked data-validate, as in PM.validate.
// Takes any container, so a multi-step form can validate just the visible step.
export function validateForm(form: HTMLElement) {
  let ok = true;
  form.querySelectorAll('.pm-err').forEach((e) => e.remove());
  form.querySelectorAll<Field>('input,select,textarea').forEach((el) => {
    el.classList.remove('pm-invalid');
    let msg = '';
    const v = (el.value || '').trim();
    const minLength = 'minLength' in el ? el.minLength : 0;
    if (el.required && !v) msg = 'This field is required';
    else if (v && el.dataset.rule === 'phone' && !/^01[3-9]\d{2}-?\d{6}$/.test(v)) msg = 'Enter a valid 11-digit mobile number';
    else if (v && el.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) msg = 'Enter a valid email';
    else if (minLength > 0 && v && v.length < minLength) msg = `At least ${minLength} characters`;
    if (msg) {
      ok = false;
      el.classList.add('pm-invalid');
      el.setAttribute('aria-invalid', 'true');
      const e = document.createElement('span');
      e.className = 'pm-err';
      e.textContent = msg;
      (el.closest('label') || el.parentElement)?.appendChild(e);
    } else el.removeAttribute('aria-invalid');
  });
  if (!ok) form.querySelector<Field>('.pm-invalid')?.focus();
  return ok;
}

// One inline error under a field, for checks validateForm doesn't cover (fieldError in public.js).
export function setFieldError(input: Field, msg: string) {
  const host = input.closest('label, .fld') || input.parentElement;
  host?.querySelectorAll('.pm-err').forEach((e) => e.remove());
  input.classList.toggle('pm-invalid', !!msg);
  if (msg) {
    input.setAttribute('aria-invalid', 'true');
    const e = document.createElement('span');
    e.className = 'pm-err';
    e.textContent = msg;
    host?.appendChild(e);
  } else input.removeAttribute('aria-invalid');
}

export function PrototypeBehaviour() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const open = target.closest<HTMLElement>('[data-modal-open]');
      if (open) {
        e.preventDefault();
        openModal(open.dataset.modalOpen!);
        return;
      }
      const close = target.closest<HTMLElement>('[data-modal-close]');
      if (close) {
        e.preventDefault();
        closeModal(close.dataset.modalClose || close.closest('dialog')?.id);
        return;
      }
      const t = target.closest<HTMLElement>('[data-toast]');
      if (t) {
        e.preventDefault();
        showToast(t.dataset.toast!, (t.dataset.toastType as ToastMessage['type']) || 'ok');
      }
    };

    // Forms never really submit yet: validate, then let page code listen for pm:submit.
    const onSubmit = (e: SubmitEvent) => {
      const f = e.target as HTMLFormElement;
      if (f.hasAttribute('data-real-submit')) return;
      e.preventDefault();
      if (f.hasAttribute('data-validate') && !validateForm(f)) return;
      f.dispatchEvent(new CustomEvent('pm:submit', { bubbles: true }));
    };

    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('submit', onSubmit);
    };
  }, []);

  return null;
}
