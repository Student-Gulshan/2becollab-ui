import { Link } from 'react-router-dom';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'white';
}

export function Logo({
  className = '',
  size = 'md',
  variant = 'dark',
}: LogoProps) {
  const heightClasses = {
    sm: 'h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-11',
  };

  const logoSrc = variant === 'white' ? '/images/logo-white.png' : '/images/logo.png';

  return (
    <Link
      to="/"
      className={`inline-flex items-center select-none group transition-opacity hover:opacity-90 ${className}`}
      id={variant === 'white' ? 'footer-logo' : 'header-logo'}
      aria-label="2BeCollab Home"
    >
      <img
        src={logoSrc}
        alt="2BeCollab"
        className={`${heightClasses[size]} w-auto object-contain shrink-0`}
        draggable={false}
      />
    </Link>
  );
}
