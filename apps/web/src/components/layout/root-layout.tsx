import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useMe, useLogout } from '@/features/auth/hooks';
import {
  LogOut,
  User as UserIcon,
  ChevronDown,
  Edit3,
  ExternalLink,
  Sparkles,
  X,
  Share2,
  Layers,
} from 'lucide-react';

export function RootLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();

  // Rehydrate session from cookie on app load
  useMe();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const isCreator = user?.role === 'CREATOR';
  const isBusiness = user?.role === 'BUSINESS';

  // Check if profile is incomplete
  const isProfileIncomplete =
    isAuthenticated &&
    user &&
    ((isCreator && (!user.creatorProfile?.headline || !user.creatorProfile?.niche?.length)) ||
      (isBusiness && (!user.businessProfile?.companyName || !user.businessProfile?.industry)));

  const publicProfileUrl = isCreator
    ? `/creators/${user?.id}`
    : `/businesses/${user?.id}`;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Onboarding Profile Completion Banner */}
      {isProfileIncomplete && !bannerDismissed && (
        <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-emerald-900/90 text-white px-4 py-2.5 text-xs sm:text-sm font-medium border-b border-white/10 flex items-center justify-between z-50">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1 justify-center">
            <Sparkles className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>
              Your profile is incomplete! Complete your profile to get discovered and unlock full marketplace features.
            </span>
            <Link
              to="/profile/edit"
              className="underline font-bold text-emerald-300 hover:text-white ml-2 transition-colors"
            >
              Set up profile &rarr;
            </Link>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="p-1 hover:bg-white/10 rounded transition-all text-gray-300 hover:text-white"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header
        className="glass sticky top-0 z-40"
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="btn-user-dropdown"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden"
                      style={{
                        background:
                          user.role === 'CREATOR'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : user.role === 'ADMIN'
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      }}
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : user.fullName ? (
                        user.fullName[0]
                      ) : (
                        <UserIcon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="text-left hidden sm:block">
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
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile/edit?tab=profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                          Edit Profile & Bio
                        </Link>

                        {isCreator && (
                          <>
                            <Link
                              to="/profile/edit?tab=social"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Share2 className="w-3.5 h-3.5 text-purple-400" />
                              Social Accounts
                            </Link>

                            <Link
                              to="/profile/edit?tab=portfolio"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Layers className="w-3.5 h-3.5 text-sky-400" />
                              Portfolio Work
                            </Link>
                          </>
                        )}

                        {(isCreator || isBusiness) && (
                          <Link
                            to={publicProfileUrl}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                            View Public Profile
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-white/10 pt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logoutMutation.mutate();
                          }}
                          disabled={logoutMutation.isPending}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
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
