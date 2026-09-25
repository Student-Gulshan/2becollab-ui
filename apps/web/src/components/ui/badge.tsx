import React from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'creator'
  | 'brand';

export type BadgeStyle = 'subtle' | 'outline' | 'glow' | 'solid';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  badgeStyle?: BadgeStyle;
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, Record<BadgeStyle, string>> = {
  primary: {
    subtle: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    outline: 'border border-indigo-400 text-indigo-300 bg-transparent',
    glow: 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.35)]',
    solid: 'bg-indigo-600 text-white',
  },
  secondary: {
    subtle: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    outline: 'border border-cyan-400 text-cyan-300 bg-transparent',
    glow: 'bg-cyan-600/20 text-cyan-200 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.35)]',
    solid: 'bg-cyan-600 text-white',
  },
  creator: {
    subtle: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    outline: 'border border-indigo-400 text-indigo-300 bg-transparent',
    glow: 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.35)]',
    solid: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
  },
  brand: {
    subtle: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    outline: 'border border-cyan-400 text-cyan-300 bg-transparent',
    glow: 'bg-cyan-600/20 text-cyan-200 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.35)]',
    solid: 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white',
  },
  success: {
    subtle: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    outline: 'border border-emerald-400 text-emerald-300 bg-transparent',
    glow: 'bg-emerald-600/20 text-emerald-200 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]',
    solid: 'bg-emerald-600 text-white',
  },
  warning: {
    subtle: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    outline: 'border border-amber-400 text-amber-300 bg-transparent',
    glow: 'bg-amber-600/20 text-amber-200 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.35)]',
    solid: 'bg-amber-600 text-white',
  },
  error: {
    subtle: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    outline: 'border border-rose-400 text-rose-300 bg-transparent',
    glow: 'bg-rose-600/20 text-rose-200 border border-rose-500/50 shadow-[0_0_12px_rgba(239,68,68,0.35)]',
    solid: 'bg-rose-600 text-white',
  },
  neutral: {
    subtle: 'bg-slate-700/40 text-slate-300 border border-slate-600/40',
    outline: 'border border-slate-600 text-slate-300 bg-transparent',
    glow: 'bg-slate-700/60 text-slate-200 border border-slate-500/40',
    solid: 'bg-slate-700 text-white',
  },
};

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-indigo-400',
  secondary: 'bg-cyan-400',
  creator: 'bg-indigo-400',
  brand: 'bg-cyan-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-rose-400',
  neutral: 'bg-slate-400',
};

export function Badge({
  variant = 'primary',
  badgeStyle = 'subtle',
  dot = false,
  icon,
  children,
  className = '',
  ...props
}: BadgeProps) {
  const currentStyles = variantStyles[variant]?.[badgeStyle] || variantStyles.primary.subtle;
  const currentDotColor = dotColors[variant] || 'bg-indigo-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors ${currentStyles} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${currentDotColor} animate-pulse`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
