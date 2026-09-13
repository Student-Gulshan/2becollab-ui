import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useMe, useLogout } from '@/features/auth/hooks';
import { LogOut, User as UserIcon } from 'lucide-react';

export function RootLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();

  // Rehydrate session from cookie on app load
  useMe();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Header */}
      <header
        className="glass sticky top-0 z-50"
        style={{
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold"
              id="header-logo"
            >
              <span className="gradient-text">2Be</span>
              <span style={{ color: 'var(--color-text-primary)' }}>Collab</span>
            </Link>

            <nav className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass border border-white/10">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase"
                      style={{
                        background:
                          user.role === 'CREATOR'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : user.role === 'ADMIN'
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      }}
                    >
                      {user.fullName ? user.fullName[0] : <UserIcon className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white leading-tight">
                        {user.fullName}
                      </p>
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.2 rounded"
                        style={{
                          backgroundColor:
                            user.role === 'CREATOR'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : user.role === 'ADMIN'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(99, 102, 241, 0.2)',
                          color:
                            user.role === 'CREATOR'
                              ? '#34d399'
                              : user.role === 'ADMIN'
                              ? '#f87171'
                              : '#a5b4fc',
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    id="btn-header-logout"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth/login"
                    className="text-sm font-medium transition-colors hover:text-white px-3 py-1.5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Sign In
                  </Link>
                  <button
                    id="btn-get-started"
                    onClick={() => navigate('/auth/choose-role')}
                    className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                      boxShadow: 'var(--shadow-glow)',
                    }}
                  >
                    Get Started
                  </button>
                </div>
              )}
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
