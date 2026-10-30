import React from 'react';
import { formatTaka } from '@/lib/formatters';

export interface TakaProps {
  amount: number | string | null | undefined;
  decimals?: boolean;
  className?: string;
  prefix?: boolean;
}

export function Taka({
  amount,
  decimals = false,
  className = '',
  prefix = true,
}: TakaProps) {
  const formatted = formatTaka(amount, decimals);
  const displayValue = prefix ? formatted : formatted.replace(/^৳\s*/, '');

  return (
    <span className={`font-semibold tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
}

