'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { cn } from '@/lib/utils';

// Dropdown anchored to a button, like PM.popover / merchant dropdown() / admin-ops menu():
// fixed coordinates so it escapes overflow:hidden cards, and closed by an outside click, Esc
// (focus returns to the button), a resize or a pick. It renders in place rather than in <body>
// so it stays inside [data-area] and keeps that area's link styles.
// The look comes from the prototype class passed in: pm-pop, ops-menu or m-menu.

// Returns the anchor ref apart from the state, so render code never reads a ref-holding object.
export function usePopover<T extends HTMLElement = HTMLButtonElement>() {
  const anchorRef = useRef<T>(null);
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);
  return [anchorRef, { open, toggle, close, anchorProps: { 'aria-haspopup': true, 'aria-expanded': open } as const }] as const;
}

interface PopoverProps {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  className: string;
  align?: 'left' | 'right';
  width?: number;
  label?: string;
  children: ReactNode;
}

export function Popover({ anchorRef, open, onClose, className, align = 'left', width, label, children }: PopoverProps) {
  const popRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pop = popRef.current, btn = anchorRef.current;
    if (!open || !pop || !btn) return;
    const r = btn.getBoundingClientRect();
    const w = pop.offsetWidth, vw = document.documentElement.clientWidth;
    pop.style.left = Math.max(8, Math.min(align === 'right' ? r.right - w : r.left, vw - w - 8)) + 'px';
    pop.style.top = r.bottom + 6 + 'px';
    pop.querySelector<HTMLElement>('button,a,input')?.focus();
  }, [open, align, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !anchorRef.current?.contains(t)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onClose();
      anchorRef.current?.focus();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onClose);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <div
      ref={popRef}
      className={cn(className)}
      role="menu"
      aria-label={label}
      style={{ position: 'fixed', right: 'auto', width }}
    >
      {children}
    </div>
  );
}
