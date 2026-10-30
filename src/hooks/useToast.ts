'use client';

import { useState, useEffect, useCallback } from 'react';
import { ToastMessage } from '@/types/common';

const TOAST_EVENT = 'pm:toast';
const FLASH_KEY = 'pm:flash_toast';

export function showToast(
  message: string,
  type: ToastMessage['type'] = 'info',
  duration = 3200
) {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent(TOAST_EVENT, {
    detail: {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      message,
      duration,
    },
  });
  window.dispatchEvent(event);
}

export function setFlashToast(message: string, type: ToastMessage['type'] = 'ok') {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(FLASH_KEY, JSON.stringify({ message, type }));
  } catch {}
}

export function consumeFlashToast() {
  if (typeof window === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(FLASH_KEY);
    if (raw) {
      sessionStorage.removeItem(FLASH_KEY);
      const data = JSON.parse(raw);
      if (data?.message) {
        showToast(data.message, data.type || 'ok');
      }
    }
  } catch {}
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info', duration = 3200) => {
      showToast(message, type, duration);
    },
    []
  );

  useEffect(() => {
    // Consume any pending flash toast on mount
    consumeFlashToast();

    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      const newToast = customEvent.detail;
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismiss(newToast.id);
        }, newToast.duration);
      }
    };

    window.addEventListener(TOAST_EVENT, handleToastEvent);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToastEvent);
    };
  }, [dismiss]);

  return {
    toasts,
    toast,
    dismiss,
    success: (msg: string) => toast(msg, 'ok'),
    error: (msg: string) => toast(msg, 'error'),
    warn: (msg: string) => toast(msg, 'warn'),
    info: (msg: string) => toast(msg, 'info'),
  };
}
