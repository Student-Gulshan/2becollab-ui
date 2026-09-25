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
  LayoutDashboard,
  Briefcase,
  Plus,
  MessageSquare,
  ArrowLeftRight,
  FileText,
  Menu,
  ArrowRight,
  ArrowUp,
  Store,
  Mail,
  MapPin,
  Send,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useUnreadCount } from '@/features/messages/hooks';
import { Logo } from '@/components/ui/logo';

export function RootLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();

  // Rehydrate session from cookie on app load
  useMe();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (getStartedRef.current && !getStartedRef.current.contains(e.target as Node)) {
        setGetStartedOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCreator = user?.role === 'CREATOR';
  const isBusiness = user?.role === 'BUSINESS';

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.unreadCount ?? 0;

  // Check if profile is incomplete
  const isProfileIncomplete =
    isAuthenticated &&
    user &&
    ((isCreator && (!user.creatorProfile?.headline || !user.creatorProfile?.niche?.length)) ||
      (isBusiness && (!user.businessProfile?.companyName || !user.businessProfile?.industry)));

  const publicProfileUrl = isCreator ? `/creators/${user?.id}` : `/businesses/${user?.id}`;

  const navLinks = [
    { label: 'For Brands', to: '/campaigns' },
    { label: 'For Creators', to: '/creators' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'About', href: '/#why-us' },
    { label: 'Resources', href: '/#faq' },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSent(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSent(false);
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17213B] font-sans">
      {/* Onboarding Profile Completion Banner */}
      {isProfileIncomplete && !bannerDismissed && (
        <div className="bg-gradient-to-r from-[#35118F] via-[#5125D8] to-[#35118F] text-white px-4 py-2 text-xs sm:text-sm font-medium border-b border-white/10 flex items-center justify-between z-50">
          <div className="max-w-[1360px] mx-auto flex items-center gap-2 flex-1 justify-center">
            <Sparkles className="w-4 h-4 text-purple-200 shrink-0" />
            <span>Your profile is incomplete! Complete your profile to get discovered.</span>
            <Link
              to="/profile/edit"
              className="underline font-bold text-white hover:text-purple-200 ml-2 transition-colors"
            >
              Set up profile &rarr;
            </Link>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="p-1 hover:bg-white/10 rounded transition-all text-purple-200 hover:text-white"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          HEADER / NAVBAR
          - Logo left
          - Centered nav links
          - Login & Glowing Get Started dropdown right
          - Consistent balanced max-w-[1360px] width
          ════════════════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/92 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(81,37,216,0.07)] border-b border-slate-100'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-100/80'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* LEFT — Exact 2BeCollab Logo */}
            <div className="flex items-center w-44 sm:w-52 shrink-0">
              <Logo size="md" />
            </div>

            {/* CENTER — Centered Navigation */}
            <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
              {navLinks.map((link) => {
                const Element = link.to ? Link : 'a';
                const props = link.to ? { to: link.to } : { href: link.href };
                return (
                  <Element
                    key={link.label}
                    {...(props as any)}
                    className="text-sm font-medium text-[#475569] hover:text-[#5125D8] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#5125D8] hover:after:w-full after:transition-all"
                  >
                    {link.label}
                  </Element>
                );
              })}

              {/* Authenticated extra navigation */}
              {isAuthenticated && (
                <>
                  {isCreator && (
                    <Link
                      to="/creator/dashboard"
                      className="text-xs font-bold text-[#5125D8] bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Creator Studio
                    </Link>
                  )}
                  <Link
                    to="/offers"
                    className="text-sm font-medium text-[#475569] hover:text-[#5125D8] transition-colors"
                  >
                    Offers
                  </Link>
                  <Link
                    to="/contracts"
                    className="text-sm font-medium text-[#475569] hover:text-[#5125D8] transition-colors"
                  >
                    Contracts
                  </Link>
                </>
              )}
            </nav>

            {/* RIGHT — Actions (Login + Get Started Cosmic Dropdown) */}
            <div className="flex items-center justify-end gap-3.5 w-52 sm:w-64 shrink-0">
              {isBusiness && (
                <Link
                  to="/brand/campaigns"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5125D8] hover:bg-[#4520B8] text-xs font-semibold text-white shadow-md shadow-[#5125D8]/15 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Campaign</span>
                </Link>
              )}

              {isAuthenticated && (
                <Link
                  to="/messages"
                  className="relative p-2 rounded-full text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-all"
                  title="Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#5125D8] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="btn-user-dropdown"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden"
                      style={{
                        background:
                          user.role === 'CREATOR'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : user.role === 'ADMIN'
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'linear-gradient(135deg, #5125D8, #6B3FF5)',
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
                    <span className="text-sm font-medium text-[#17213B] hidden sm:block max-w-[90px] truncate">
                      {user.fullName}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#687087] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200/80 shadow-2xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-semibold text-[#17213B] truncate">{user.fullName}</p>
                        <p className="text-[11px] text-[#687087] truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        {isCreator && (
                          <Link
                            to="/creator/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Creator Dashboard
                          </Link>
                        )}
                        {isBusiness && (
                          <Link
                            to="/brand/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Brand Dashboard
                          </Link>
                        )}
                        {isCreator ? (
                          <>
                            <Link
                              to="/creator/profile"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit Profile & Bio
                            </Link>
                            <Link
                              to="/creator/profile"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              Social Accounts & Portfolio
                            </Link>
                          </>
                        ) : isBusiness ? (
                          <>
                            <Link
                              to="/brand/profile"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Company Profile & Bio
                            </Link>
                            <Link
                              to="/brand/settings"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                            >
                              <Settings className="w-3.5 h-3.5" />
                              Brand Settings & Team
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/profile/edit?tab=profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Profile & Bio
                          </Link>
                        )}

                        {isBusiness && (
                          <>
                            <Link
                              to="/brand/campaigns"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                            >
                              <Briefcase className="w-3.5 h-3.5" />
                              My Campaigns
                            </Link>
                            <Link
                              to="/brand/campaigns"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Post Campaign
                            </Link>
                          </>
                        )}

                        <Link
                          to="/offers"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          Offers & Negotiation
                        </Link>

                        <Link
                          to="/contracts"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Contracts & Escrow
                        </Link>

                        {(isCreator || isBusiness) && (
                          <Link
                            to={publicProfileUrl}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Public Profile
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logoutMutation.mutate();
                          }}
                          disabled={logoutMutation.isPending}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated: Log In + Cosmic Glowing Get Started Dropdown */
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth/login"
                    className="hidden sm:inline-block text-sm font-semibold text-[#17213B] hover:text-[#5125D8] transition-colors px-2 py-1.5"
                  >
                    Log In
                  </Link>

                  {/* Get Started Dropdown Trigger with Cosmic Glow */}
                  <div className="relative" ref={getStartedRef}>
                    <button
                      id="btn-get-started-trigger"
                      onClick={() => setGetStartedOpen(!getStartedOpen)}
                      className="hidden sm:inline-flex btn-cosmic-purple px-5 py-2.5 text-sm font-semibold gap-2"
                      aria-haspopup="true"
                      aria-expanded={getStartedOpen}
                    >
                      <span>Get Started</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${getStartedOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Interactive Dropdown Menu */}
                    {getStartedOpen && (
                      <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-slate-100 shadow-[0_16px_48px_-8px_rgba(81,37,216,0.22)] p-2.5 z-50 animate-fade-in">
                        <div className="px-3 pt-2 pb-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#687087]">
                            Join 2BeCollab as
                          </p>
                        </div>

                        {/* Option 1: Brand */}
                        <Link
                          to="/auth/signup?role=BUSINESS"
                          onClick={() => setGetStartedOpen(false)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#FAF9FF] transition-all group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#F5F1FF] border border-[#E8E0FE] flex items-center justify-center text-[#5125D8] shrink-0 group-hover:bg-[#5125D8] group-hover:text-white transition-colors">
                            <Store className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-[#17213B] group-hover:text-[#5125D8] transition-colors flex items-center justify-between">
                              <span>Continue as a Brand</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                            <p className="text-xs text-[#687087] leading-snug mt-0.5 font-normal">
                              Discover creators and launch campaigns.
                            </p>
                          </div>
                        </Link>

                        {/* Option 2: Creator */}
                        <Link
                          to="/auth/signup?role=CREATOR"
                          onClick={() => setGetStartedOpen(false)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#FAF9FF] transition-all group cursor-pointer mt-1 border-t border-slate-50"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#F5F1FF] border border-[#E8E0FE] flex items-center justify-center text-[#5125D8] shrink-0 group-hover:bg-[#5125D8] group-hover:text-white transition-colors">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-[#17213B] group-hover:text-[#5125D8] transition-colors flex items-center justify-between">
                              <span>Continue as a Creator</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                            <p className="text-xs text-[#687087] leading-snug mt-0.5 font-normal">
                              Showcase your talent and explore opportunities.
                            </p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-xl text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-all cursor-pointer"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════
          MOBILE MENU OVERLAY
          ════════════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-[310px] max-w-[85vw] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <Logo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#687087] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-all"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navLinks.map((link) => {
                const Element = link.to ? Link : 'a';
                const props = link.to ? { to: link.to } : { href: link.href };
                return (
                  <Element
                    key={link.label}
                    {...(props as any)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#17213B] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                  >
                    {link.label}
                  </Element>
                );
              })}

              {isAuthenticated && (
                <>
                  <div className="pt-4 pb-2 px-4">
                    <span className="text-[10px] font-bold text-[#687087] uppercase tracking-wider">Account</span>
                  </div>
                  <Link
                    to="/offers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-[#17213B] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                  >
                    Offers
                  </Link>
                  <Link
                    to="/contracts"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-[#17213B] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                  >
                    Contracts
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-[#17213B] hover:text-[#5125D8] hover:bg-[#F5F1FF] transition-colors"
                  >
                    Messages
                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#5125D8] text-white text-[10px] font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </nav>

            <div className="px-6 py-6 border-t border-slate-100 space-y-2.5">
              {!isAuthenticated ? (
                <>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#687087] mb-1">
                    Get Started
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/auth/signup?role=BUSINESS');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-white text-xs bg-[#5125D8] hover:bg-[#4520B8] shadow-sm flex items-center justify-between"
                  >
                    <span>Continue as a Brand</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/auth/signup?role=CREATOR');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-[#5125D8] text-xs bg-[#F5F1FF] border border-[#E8E0FE] hover:bg-[#EDE7FE] flex items-center justify-between"
                  >
                    <span>Continue as a Creator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-xl font-semibold text-slate-700 text-xs border border-slate-200 hover:bg-slate-50 transition-all mt-2"
                  >
                    Log In
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutMutation.mutate();
                  }}
                  className="w-full py-3 rounded-full font-semibold text-red-500 text-sm border border-red-200 hover:bg-red-50 transition-all"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ════════════════════════════════════════════════════════════
          FOOTER (Clean, Spacious & Uncongested)
          - Simple, subtle smooth arch top transition
          - Clean 4-column layout with generous breathing room
          - Contact email: 2becollab@gmail.com
          - Single clean row of social links
          - Bottom bar: "Better Together", legal links, back-to-top button
          ════════════════════════════════════════════════════════════ */}
      <footer className="relative mt-12 overflow-hidden">
        {/* Subtle, Simple Smooth Arch Divider */}
        <div className="w-full overflow-hidden leading-none -mb-1 bg-white relative">
          <svg
            className="relative block w-full h-7 sm:h-10 text-[#160838]"
            viewBox="0 0 1440 40"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,24 Q720,0 1440,24 L1440,40 L0,40 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Main Footer Container */}
        <div
          className="text-slate-300 pt-10 sm:pt-14 pb-10 relative"
          style={{
            background: 'linear-gradient(180deg, #160838 0%, #1A083E 50%, #0B021B 100%)',
          }}
        >
          {/* Subtle Ambient Glowing Mesh */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#683BF8]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#5125D8]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Main Columns Grid: 4 Spacious Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">

              {/* Col 1: Brand & Newsletter (4 cols) */}
              <div className="lg:col-span-4">
                <div className="mb-4">
                  <Logo variant="white" size="md" />
                </div>
                <p className="text-sm text-slate-300/80 leading-relaxed max-w-sm mb-6 font-normal">
                  A new space for brands and creators to collaborate, create and grow.
                </p>

                {/* Newsletter Box */}
                <div className="max-w-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-300" />
                    <span>Subscribe to our newsletter</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 font-normal">
                    Get updates, tips and collaboration opportunities delivered to your inbox.
                  </p>

                  <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full bg-[#271052]/80 border border-purple-400/25 rounded-full pl-4 pr-11 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#5125D8] focus:ring-1 focus:ring-[#5125D8] transition-all"
                      required
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="absolute right-1 w-7 h-7 rounded-full bg-[#5125D8] hover:bg-[#683BF8] text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </form>
                  {newsletterSent && (
                    <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                      ✓ Subscribed! You will receive our latest updates.
                    </p>
                  )}
                </div>
              </div>

              {/* Col 2: For Brands (2.5 cols) */}
              <div className="lg:col-span-3 lg:pl-4">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-lg bg-[#3C1982] border border-purple-400/30 flex items-center justify-center text-purple-200">
                    <Briefcase className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Brands</h4>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                  <li>
                    <Link to="/campaigns" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>How It Works</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/creators" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>Find Creators</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/campaigns" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>Campaigns</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/campaigns" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>Pricing</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>Escrow Protection</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 3: For Creators (2.5 cols) */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-lg bg-[#3C1982] border border-purple-400/30 flex items-center justify-center text-purple-200">
                    <UserIcon className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Creators</h4>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                  <li>
                    <Link to="/creators" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>How It Works</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/campaigns" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>Brand Opportunities</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/creators" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>Creator Academy</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/creators" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>Community</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span>Help Center</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-purple-300 transition-all" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 4: Get In Touch (3 cols) */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-lg bg-[#3C1982] border border-purple-400/30 flex items-center justify-center text-purple-200">
                    <Send className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Get In Touch</h4>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-400 mb-5">
                  <a
                    href="mailto:2becollab@gmail.com"
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="group-hover:underline">2becollab@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>New Delhi, India</span>
                  </div>
                </div>

                {/* Single Clean Social Row */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-2">
                    {[
                      {
                        title: 'Instagram',
                        path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                      },
                      {
                        title: 'LinkedIn',
                        path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
                      },
                      {
                        title: 'YouTube',
                        path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
                      },
                      {
                        title: 'X',
                        path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                      },
                    ].map((social) => (
                      <a
                        key={social.title}
                        href="#"
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#5125D8] border border-white/10 hover:border-[#5125D8] flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                        title={social.title}
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d={social.path} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Better Together + Copyright + Policy + Back to top */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative">
              {/* Better Together Cursive Accent */}
              <div className="flex items-center gap-3">
                <span className="font-handwriting text-2xl text-purple-300 font-bold tracking-wider drop-shadow-sm">
                  Better Together
                </span>
                <span className="text-slate-600 hidden sm:inline">&bull;</span>
                <p>&copy; {new Date().getFullYear()} 2BeCollab. All rights reserved.</p>
              </div>

              <div className="flex items-center gap-6">
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Settings
                </a>
                <button
                  onClick={scrollToTop}
                  aria-label="Scroll to top"
                  className="w-8 h-8 rounded-full bg-[#5125D8] hover:bg-[#683BF8] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-[#5125D8]/40 hover:scale-110 ml-2"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
