import { HTMLAttributes, forwardRef } from 'react';

export type CardVariant = 'default' | 'glass' | 'interactive' | 'elevated' | 'gradient-border';
export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  glow?: boolean;
}

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  xs: 'p-3',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-8 sm:p-10',
};

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-[#141527]/80 border border-slate-800/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]',
  glass:
    'bg-[#181932]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
  interactive:
    'bg-[#16172e]/70 backdrop-blur-lg border border-slate-800/90 hover:border-indigo-500/40 hover:bg-[#1a1c38]/80 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.6),0_0_20px_rgba(99,102,241,0.15)] cursor-pointer transition-all duration-300',
  elevated:
    'bg-[#1b1c35] border border-slate-700/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]',
  'gradient-border':
    'relative bg-[#141528] before:absolute before:-inset-[1px] before:rounded-[inherit] before:bg-gradient-to-r before:from-indigo-500 before:via-cyan-500 before:to-purple-600 before:-z-10 before:opacity-50 hover:before:opacity-100 transition-all duration-300',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      glow = false,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl transition-all duration-300 overflow-hidden
          ${variantClasses[variant]}
          ${paddingClasses[padding]}
          ${glow ? 'shadow-[0_0_30px_rgba(99,102,241,0.2)] border-indigo-500/30' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export function CardHeader({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-1.5 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-xl font-bold tracking-tight text-white ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-slate-400 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`pt-4 mt-auto flex items-center border-t border-slate-800/80 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
