import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, id, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full px-4 py-3 rounded-xl text-sm transition-all duration-200
              outline-none
              ${icon ? 'pl-10' : ''}
              ${error ? 'ring-2 ring-red-500/50' : 'focus:ring-2 focus:ring-indigo-500/50'}
              ${className}
            `}
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
              color: 'var(--color-text-primary)',
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--color-error)' }}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
