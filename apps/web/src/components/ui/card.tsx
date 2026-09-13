import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', children, className = '', style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: variant === 'glass' ? 'rgba(30, 30, 58, 0.6)' : 'var(--color-bg-card)',
      border: '1px solid var(--color-border-light)',
      boxShadow: 'var(--shadow-card)',
      ...(variant === 'glass' && {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'rgba(99, 102, 241, 0.1)',
      }),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={`
          rounded-2xl transition-all duration-300
          ${variant === 'interactive' ? 'hover:-translate-y-1 hover:shadow-lg cursor-pointer' : ''}
          ${paddingClasses[padding]}
          ${className}
        `}
        style={baseStyles}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
