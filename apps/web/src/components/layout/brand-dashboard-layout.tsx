import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  Search as SearchIcon,
  FileText,
  Flame,
  MessageSquare,
  Wallet,
  BarChart3,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Briefcase,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/features/auth/hooks';
import { Logo } from '@/components/ui/logo';

interface BrandDashboardLayoutProps {
  children: React.ReactNode;
}

export function BrandDashboardLayout({ children }: BrandDashboardLayoutProps) {
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/brand/dashboard' },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/brand/campaigns' },
    { id: 'creators', label: 'Find Creators', icon: SearchIcon, path: '/brand/creators' },
    { id: 'bids', label: 'Proposals & Bids', icon: FileText, path: '/brand/bids', badge: 6 },
    { id: 'collaborations', label: 'Collaborations', icon: Flame, path: '/brand/collaborations', badge: 3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/brand/messages', badge: 2 },
    { id: 'escrow', label: 'Escrow & Wallet', icon: Wallet, path: '/brand/escrow' },
    { id: 'analytics', label: 'Analytics & ROI', icon: BarChart3, path: '/brand/analytics' },
    { id: 'profile', label: 'Company Profile', icon: Building2, path: '/brand/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/brand/settings' },
  ];

  const brandName = user?.fullName || 'LuxeGlow Paris';
  const brandAvatar = user?.avatarUrl || '/images/avatar-brand-1.jpg';

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

          <Link to="/brand/dashboard" className="flex items-center gap-2.5">
            <Logo size="sm" variant="dark" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5125D8] border border-purple-200 text-[11px] font-bold">
              <Briefcase className="w-3 h-3 text-[#5125D8]" />
              Brand Studio
            </span>
          </Link>
        </div>

        {/* Center: Search Field with Keyboard Shortcut Badge */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search creators, campaigns, bids, deliverables..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-full focus:outline-none focus:border-[#5125D8] focus:bg-white focus:ring-2 focus:ring-[#5125D8]/10 transition-all text-[#17213B] placeholder:text-slate-400 font-medium"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 border border-slate-200 px-1.5 py-0.2 rounded-md bg-white">
              /
            </span>
          </div>
        </div>

        {/* Right: Post Campaign Action, Notification Bell, Brand Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Post Campaign CTA */}
          <Link
            to="/brand/campaigns"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5125D8] hover:bg-[#431db8] text-white text-xs font-bold shadow-sm shadow-[#5125D8]/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Campaign</span>
          </Link>

          {/* Notification Bell */}
          <Link
            to="/brand/bids"
            className="relative p-2 rounded-full text-slate-600 hover:text-[#5125D8] hover:bg-purple-50 transition-colors"
            title="Applications & Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
              4
            </span>
          </Link>

          {/* Brand Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200/80 hover:border-purple-300 bg-white hover:bg-slate-50/80 transition-all shadow-xs"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-200/80 bg-purple-100 flex items-center justify-center shrink-0">
                <img
                  src={brandAvatar}
                  alt={brandName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-[#17213B] block leading-tight max-w-[120px] truncate">
                  {brandName}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block leading-tight">
                  Verified Brand
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
                  <p className="text-xs font-bold text-[#17213B] truncate">{brandName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email || 'brand@luxeglow.com'}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/brand/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#5125D8] hover:bg-purple-50 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Company Profile
                  </Link>
                  <Link
                    to="/brand/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#5125D8] hover:bg-purple-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Team & Billing
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
                    (location.pathname === '/brand/dashboard' || location.pathname === '/brand'));

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

          {/* Bottom of Sidebar: Brand Info Card & Log Out */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            {/* Brand Profile Mini Card */}
            <Link
              to="/brand/profile"
              className="p-2.5 rounded-2xl bg-purple-50/60 hover:bg-purple-50 border border-purple-100/70 flex items-center gap-2.5 transition-colors group"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-200 border border-purple-300 shrink-0">
                <img
                  src={brandAvatar}
                  alt={brandName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-[#17213B] truncate group-hover:text-[#5125D8] transition-colors">
                  {brandName}
                </h4>
                <p className="text-[10px] text-emerald-600 font-semibold truncate">
                  Brand • Verified Partner
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
