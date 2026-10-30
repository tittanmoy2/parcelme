import React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
  theme?: 'default' | 'amber' | 'teal' | 'accent' | 'green' | 'dark';
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  theme = 'default',
  className,
  onClick,
}: StatCardProps) {
  const isDark = theme === 'dark';

  const themeStyles = {
    default: {
      card: 'bg-white border-slate-200 text-slate-900',
      iconBox: 'bg-brand-50 text-brand-600',
      title: 'text-slate-600',
    },
    amber: {
      card: 'bg-white border-slate-200 text-slate-900',
      iconBox: 'bg-amber-100 text-amber-700',
      title: 'text-slate-600',
    },
    teal: {
      card: 'bg-white border-slate-200 text-slate-900',
      iconBox: 'bg-teal-100 text-teal-700',
      title: 'text-slate-600',
    },
    accent: {
      card: 'bg-white border-slate-200 text-slate-900',
      iconBox: 'bg-accent-100 text-accent-600',
      title: 'text-slate-600',
    },
    green: {
      card: 'bg-white border-slate-200 text-slate-900',
      iconBox: 'bg-green-100 text-green-700',
      title: 'text-slate-600',
    },
    dark: {
      card: 'bg-slate-900 border-slate-900 text-white',
      iconBox: 'bg-slate-800 text-accent-300',
      title: 'text-slate-300',
    },
  }[theme];

  return (
    <div
      onClick={onClick}
      className={cn(
        'card kpi flex relative flex-col gap-2.5 p-4.5 rounded-[18px] border shadow-xs transition-shadow',
        themeStyles.card,
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
    >
      {/* Top Header Row: Title & Themed Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn('t text-13 font-semibold truncate', themeStyles.title)}>
          {title}
        </span>
        <span
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-[10px] shrink-0',
            themeStyles.iconBox
          )}
        >
          {icon}
        </span>
      </div>

      {/* Main KPI Value */}
      <div className="v text-28 font-extrabold tracking-[-0.02em] leading-tight">
        {value}
      </div>

      {/* Subtitle / Trend Badge */}
      {(trend || subtitle) && (
        <div className="flex items-center gap-2 text-12.5 leading-none">
          {trend && (
            <span
              className={cn(
                'font-bold inline-flex items-center gap-0.5',
                trend.positive
                  ? isDark
                    ? 'text-green-300'
                    : 'text-green-700'
                  : 'text-red-600'
              )}
            >
              <span>{trend.positive ? '▲' : '▼'}</span>
              <span>{trend.value}</span>
            </span>
          )}
          {subtitle && (
            <span
              className={cn(
                'truncate',
                isDark ? 'text-accent-300 font-semibold' : 'text-slate-500'
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

