import React from 'react';
import { Card } from './card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'cyan' | 'accent';
  className?: string;
}

const iconBgVariants: Record<string, string> = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  primary: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  accent: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

const valueGradients: Record<string, string> = {
  default: 'text-white',
  primary: 'bg-gradient-to-r from-indigo-300 via-indigo-200 to-indigo-400 bg-clip-text text-transparent',
  cyan: 'bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent',
  accent: 'bg-gradient-to-r from-amber-300 via-orange-200 to-amber-400 bg-clip-text text-transparent',
};

export function StatCard({
  value,
  label,
  description,
  change,
  isPositive = true,
  icon,
  variant = 'default',
  className = '',
}: StatCardProps) {
  return (
    <Card
      variant="interactive"
      padding="sm"
      className={`relative group ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border text-sm transition-transform group-hover:scale-110 ${
              iconBgVariants[variant] || iconBgVariants.default
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span
          className={`text-2xl sm:text-3xl font-black tracking-tight ${
            valueGradients[variant] || valueGradients.default
          }`}
        >
          {value}
        </span>
      </div>

      {(change || description) && (
        <div className="flex items-center gap-2 mt-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {change}
            </span>
          )}
          {description && (
            <span className="text-slate-400 truncate">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
}
