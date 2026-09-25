import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  Compass,
  Bookmark,
  Flame,
  MessageSquare,
  Wallet,
  BarChart3,
  User as UserIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/features/auth/hooks';
import { Logo } from '@/components/ui/logo';

interface CreatorDashboardLayoutProps {
  children: React.ReactNode;
}

export function CreatorDashboardLayout({ children }: CreatorDashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();
  const logoutMutation = useLogout();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close mobile sidebar on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      clearUser();
    }
    navigate('/auth/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/creator/dashboard' },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/creator/campaigns' },
    { id: 'discover', label: 'Discover', icon: Compass, path: '/creator/discover' },
    { id: 'bids', label: 'My Bids', icon: Bookmark, path: '/creator/bids' },
    { id: 'active', label: 'Active Campaigns', icon: Flame, path: '/creator/active' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/creator/messages', badge: 2 },
    { id: 'earnings', label: 'Earnings', icon: Wallet, path: '/creator/earnings' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/creator/analytics' },
    { id: 'profile', label: 'Profile', icon: UserIcon, path: '/creator/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/creator/settings' },
  ];

  const creatorName = user?.fullName || 'Arohi Sharma';
  const avatarSrc = user?.avatarUrl || '/images/avatar-creator-1.jpg';

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#17213B] flex flex-col font-sans selection:bg-purple-100 selection:text-[#5125D8]">
      {/* ════════════════════════════════════════════════════════════
          TOP NAVBAR
          ════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-xs">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/creator/dashboard" className="flex items-center gap-2.5">
            <Logo size="sm" variant="dark" />
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5125D8] border border-purple-200 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-[#5125D8]" />
              Creator Studio
            </span>
          </Link>
        </div>

        {/* Center: Search Field with Keyboard Shortcut Badge */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns, brands, or keywords..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-full focus:outline-none focus:border-[#5125D8] focus:bg-white focus:ring-2 focus:ring-[#5125D8]/10 transition-all text-[#17213B] placeholder:text-slate-400 font-medium"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 border border-slate-200 px-1.5 py-0.2 rounded-md bg-white">
              /
            </span>
          </div>
        </div>

        {/* Right: Notifications, Instagram, Profile Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Notification Bell */}
          <Link
            to="/creator/messages"
            className="relative p-2 rounded-full text-slate-600 hover:text-[#5125D8] hover:bg-purple-50 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </Link>

          {/* Social Quick Link */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors hidden sm:flex items-center justify-center"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200/80 hover:border-purple-300 bg-white hover:bg-slate-50/80 transition-all shadow-xs"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-200/80 bg-purple-100 flex items-center justify-center">
                <img
                  src={avatarSrc}
                  alt={creatorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-[#17213B] block leading-tight">
                  {creatorName}
                </span>
                <span className="text-[10px] text-[#5125D8] font-bold block leading-tight">
                  Profile 70%
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  userDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#17213B] truncate">{creatorName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email || 'creator@2becollab.com'}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/creator/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#5125D8] hover:bg-purple-50 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    View & Edit Profile
                  </Link>
                  <Link
                    to="/creator/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#5125D8] hover:bg-purple-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Account Settings
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#5125D8] hover:bg-purple-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit Public Site
                  </Link>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT AREA WITH FULLY FUNCTIONAL SIDEBAR
          ════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR: Desktop + Mobile Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 lg:static w-60 bg-white border-r border-slate-200/80 p-3.5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top: Mobile header & Navigation links */}
          <div className="space-y-4">
            <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-100">
              <Logo size="sm" variant="dark" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.id === 'dashboard' &&
                    (location.pathname === '/creator/dashboard' || location.pathname === '/creator'));

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all ${
                      isActive
                        ? 'bg-[#F3E8FF] text-[#5125D8] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#5125D8]' : 'text-slate-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && item.badge > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom of Sidebar: Creator Info Card & Log Out */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            {/* Creator Profile Mini Card */}
            <Link
              to="/creator/profile"
              className="p-2.5 rounded-2xl bg-purple-50/60 hover:bg-purple-50 border border-purple-100/70 flex items-center gap-2.5 transition-colors group"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-200 border border-purple-300 shrink-0">
                <img
                  src={avatarSrc}
                  alt={creatorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-[#17213B] truncate group-hover:text-[#5125D8] transition-colors">
                  {creatorName}
                </h4>
                <p className="text-[10px] text-[#5125D8] font-semibold truncate">
                  Creator • 70% Complete
                </p>
              </div>
            </Link>

            {/* Log Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Workspace Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
