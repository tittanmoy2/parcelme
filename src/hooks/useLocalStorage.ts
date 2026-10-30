'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { storage } from '@/lib/storage';

// Same-tab writes fire this; other tabs get the native 'storage' event.
const STORE_EVENT = 'pm:store';

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(STORE_EVENT, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(STORE_EVENT, cb);
  };
}

// A `pm:`-prefixed localStorage value as React state. The server and the first client render
// use `initialValue`, then the stored value takes over, so hydration never mismatches.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [initial] = useState(initialValue);
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try { return localStorage.getItem('pm:' + key); } catch { return null; }
    },
    () => null
  );

  const value = useMemo<T>(() => {
    if (raw == null) return initial;
    try { return JSON.parse(raw) as T; } catch { return initial; }
  }, [raw, initial]);

  const setValue = useCallback(
    (val: T | ((prev: T) => T)) => {
      const next = val instanceof Function ? val(storage.get<T>(key, initial)) : val;
      storage.set(key, next);
      window.dispatchEvent(new Event(STORE_EVENT));
    },
    [key, initial]
  );

  return [value, setValue];
}
