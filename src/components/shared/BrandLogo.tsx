import React from 'react';
import Link from 'next/link';

export interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'mark-only';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export function BrandLogo({
  variant = 'light',
  size = 'md',
  href = '/',
  className = '',
}: BrandLogoProps) {
  const iconDimensions = {
    sm: { width: 24, height: 28 },
    md: { width: 32, height: 38 },
    lg: { width: 44, height: 52 },
  }[size];

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  const subtextClasses = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[11px] tracking-wider',
    lg: 'text-xs tracking-widest',
  }[size];

  const isDark = variant === 'dark';

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon SVG */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 48 56"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="26" cy="22" r="20" fill={isDark ? '#FFFFFF' : '#10294A'} />
        <rect x="6" y="22" width="11" height="32" rx="5.5" fill={isDark ? '#FFFFFF' : '#10294A'} />
        <rect x="17" y="13" width="18" height="18" rx="3" fill="#EA580C" />
        <path d="M20 13h12a3 3 0 0 1 3 3v2H17v-2a3 3 0 0 1 3-3z" fill="#9A3412" />
        <rect x="24" y="13" width="4" height="18" fill="#FED7AA" opacity=".7" />
      </svg>

      {variant !== 'mark-only' && (
        <div className="flex flex-col leading-none">
          <div
            className={`font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-navy'
            } ${textClasses}`}
          >
            percel<span className={isDark ? 'text-accent-400' : 'text-accent-600'}>me</span>
          </div>
          <span
            className={`font-semibold uppercase text-slate-400 ${subtextClasses} mt-0.5`}
          >
            Courier & Delivery
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

