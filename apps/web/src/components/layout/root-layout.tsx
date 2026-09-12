import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Header - will be expanded in later chunks */}
      <header
        className="glass sticky top-0 z-50"
        style={{
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="/"
              className="flex items-center gap-2 text-xl font-bold"
              id="header-logo"
            >
              <span className="gradient-text">2Be</span>
              <span style={{ color: 'var(--color-text-primary)' }}>Collab</span>
            </a>
            <nav className="flex items-center gap-4">
              <button
                id="btn-get-started"
                className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="py-8"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderTop: '1px solid var(--color-border-light)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              © 2026 2BeCollab. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="/terms" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--color-text-muted)' }}>Terms</a>
              <a href="/privacy" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--color-text-muted)' }}>Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
