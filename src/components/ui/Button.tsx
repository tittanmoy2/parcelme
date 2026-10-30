import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'soft' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-4 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variantStyles = {
      primary:
        'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-100 shadow-sm',
      accent:
        'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-100 shadow-sm',
      secondary:
        'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-slate-100 shadow-sm',
      soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100 focus:ring-brand-100',
      danger:
        'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-100',
      ghost:
        'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-100',
    }[variant];

    const sizeStyles = {
      sm: 'h-9 px-3.5 text-xs rounded-[10px] gap-1.5',
      md: 'h-11 px-4.5 text-sm rounded-[12px] gap-2',
      lg: 'h-13 px-6 text-base rounded-[14px] gap-2.5',
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

