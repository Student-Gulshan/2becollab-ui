import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'accent'
  | 'cyan';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_28px_rgba(99,102,241,0.5)] border border-indigo-400/30',
  secondary:
    'bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 border border-slate-700/80 hover:border-slate-600 backdrop-blur-md shadow-sm',
  outline:
    'bg-transparent hover:bg-white/5 text-slate-200 border border-slate-700 hover:border-slate-500',
  ghost:
    'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent',
  danger:
    'bg-rose-600 hover:bg-rose-500 text-white shadow-sm hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]',
  accent:
    'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.35)]',
  cyan:
    'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  sm: 'px-4 py-2 text-xs font-semibold rounded-lg gap-2',
  md: 'px-6 py-2.5 text-sm font-semibold rounded-xl gap-2.5',
  lg: 'px-8 py-3.5 text-base font-semibold rounded-xl gap-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconRight,
      children,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-medium select-none
          transition-all duration-200 cursor-pointer
          hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          icon && <span className="inline-flex shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {!isLoading && iconRight && (
          <span className="inline-flex shrink-0">{iconRight}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
