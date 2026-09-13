import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
    color: 'white',
    boxShadow: 'var(--shadow-glow)',
  },
  secondary: {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
  },
  danger: {
    backgroundColor: 'var(--color-error)',
    color: 'white',
  },
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2 font-semibold
          transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${sizeClasses[size]}
          ${className}
        `}
        style={variantStyles[variant]}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          <span className="w-4 h-4">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
