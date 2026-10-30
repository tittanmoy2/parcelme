import React from 'react';
import { ParcelStatus } from '@/types/parcel';

export interface StatusBadgeProps {
  status: ParcelStatus;
  size?: 'sm' | 'md';
  className?: string;
  showDot?: boolean;
}

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  dot: string;
}

const STATUS_CONFIG_MAP: Record<ParcelStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    dot: 'bg-amber-600',
  },
  picked_up: {
    label: 'Picked up',
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    dot: 'bg-teal-600',
  },
  in_transit: {
    label: 'In transit',
    bg: 'bg-blue-100',
    text: 'text-brand-800',
    dot: 'bg-brand-600',
  },
  out_for_delivery: {
    label: 'Out for delivery',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    dot: 'bg-accent-600',
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-600',
  },
  returned: {
    label: 'Returned',
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-600',
  },
  on_hold: {
    label: 'On hold',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    dot: 'bg-slate-500',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    dot: 'bg-slate-400',
  },
};

export function StatusBadge({
  status,
  size = 'md',
  className = '',
  showDot = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG_MAP[status] || {
    label: status,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    dot: 'bg-slate-500',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1.5'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap select-none ${config.bg} ${config.text} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}

