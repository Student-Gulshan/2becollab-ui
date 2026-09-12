import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <h1
        className="text-8xl font-bold mb-4 gradient-text"
      >
        404
      </h1>
      <p
        className="text-xl mb-8"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        This page doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          boxShadow: 'var(--shadow-glow)',
        }}
        id="btn-back-home"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </a>
    </div>
  );
}
