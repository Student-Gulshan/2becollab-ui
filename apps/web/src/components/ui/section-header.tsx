import React from 'react';
import { Badge } from './badge';

export interface SectionHeaderProps {
  badgeText?: string;
  badgeVariant?: 'primary' | 'secondary' | 'creator' | 'brand' | 'success' | 'warning';
  title: string;
  gradientText?: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  badgeText,
  badgeVariant = 'primary',
  title,
  gradientText,
  description,
  align = 'center',
  action,
  className = '',
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={`mb-12 sm:mb-16 ${
        isCentered ? 'text-center max-w-3xl mx-auto' : 'flex flex-col md:flex-row md:items-end justify-between gap-6'
      } ${className}`}
    >
      <div className={isCentered ? 'flex flex-col items-center' : 'max-w-2xl'}>
        {badgeText && (
          <div className="mb-4">
            <Badge variant={badgeVariant} badgeStyle="glow" dot>
              {badgeText}
            </Badge>
          </div>
        )}

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {title}{' '}
          {gradientText && (
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              {gradientText}
            </span>
          )}
        </h2>

        {description && (
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-4 md:mt-0 shrink-0">{action}</div>}
    </div>
  );
}
