import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Palette,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useLogin } from '@/features/auth/hooks';
import { openGoogleAuthPopup } from '@/features/auth/api';
import { useAuthStore } from '@/stores/auth-store';
import { getErrorMessage } from '@/lib/api/error';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramRole = searchParams.get('role');
  const [role, setRole] = useState<'CREATOR' | 'BUSINESS'>(
    paramRole === 'BUSINESS' ? 'BUSINESS' : 'CREATOR',
  );
  const isCreator = role === 'CREATOR';

  const { isAuthenticated, user, setUser } = useAuthStore();

  // If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'BUSINESS' || !isCreator) {
        navigate('/brand/dashboard');
      } else {
        navigate('/creator/dashboard');
      }
    }
  }, [isAuthenticated, user, isCreator, navigate]);

  // Keep state in sync if URL param changes
  useEffect(() => {
    if (paramRole === 'BUSINESS' || paramRole === 'CREATOR') {
      setRole(paramRole);
    }
  }, [paramRole]);

  const handleRoleChange = (newRole: 'CREATOR' | 'BUSINESS') => {
    setRole(newRole);
    setSearchParams({ role: newRole });
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in both email and password');
      return;
    }

    try {
      const res = await loginMutation.mutateAsync({ email, password });
      const loggedUser = res?.data?.user;
      if (loggedUser?.role === 'CREATOR' || (isCreator && loggedUser?.role !== 'BUSINESS')) {
        navigate('/creator/dashboard');
      } else {
        navigate('/brand/dashboard');
      }
    } catch (err: any) {
      setFormError(getErrorMessage(err, 'Login failed. Please check your credentials.'));
    }
  };

  const handleGoogleLogin = () => {
    openGoogleAuthPopup(
      role,
      (loggedUser) => {
        setUser(loggedUser);
        if (loggedUser.role === 'CREATOR' || (isCreator && loggedUser.role !== 'BUSINESS')) {
          navigate('/creator/dashboard');
        } else {
          navigate('/brand/dashboard');
        }
      },
      (error) => {
        setFormError(error);
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8F7FC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center selection:bg-purple-100 selection:text-[#5125D8]">
      {/* Unified Outer Frame (Inspired by reference design with site purple theme) */}
      <div className="max-w-[1140px] w-full bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-[#5125D8]/8 border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

        {/* ════════════════════════════════════════════════════════════
            LEFT PANEL: Deep Purple Brand Gradient Canvas (Classy & Clean)
            Logo at top, Welcome badge, Headline, 3 Step Cards at bottom
            ════════════════════════════════════════════════════════════ */}
        <div
          className="lg:col-span-6 relative p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden text-white"
          style={{
            background: 'linear-gradient(145deg, #160838 0%, #290D5E 40%, #3F1592 75%, #5125D8 100%)',
          }}
        >
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#7C4DFF]/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#5125D8]/40 blur-3xl pointer-events-none" />

          {/* Middle Typography Section */}
          <div className="relative z-10 my-10 lg:my-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-100 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Welcome Back</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-white leading-[1.1] mb-3">
              Continue your Journey
            </h1>

            <p className="text-xs sm:text-sm text-purple-100/90 font-normal leading-relaxed max-w-sm">
              Sign in to manage active partnerships, approve milestone deliverables, and track campaign growth.
            </p>
          </div>

          {/* Bottom 3 Step Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
            {/* Step 1: Active Card */}
            <div className="bg-white rounded-2xl p-4 text-[#17213B] shadow-xl">
              <div className="w-6 h-6 rounded-full bg-[#5125D8] text-white flex items-center justify-center text-xs font-bold mb-2.5">
                1
              </div>
              <h4 className="text-xs font-bold leading-tight text-[#17213B]">
                Access dashboard
              </h4>
              <p className="text-[10px] text-[#687087] mt-1 leading-snug">
                Review all your active campaigns
              </p>
            </div>

            {/* Step 2: Translucent Glass Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-white">
              <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold mb-2.5">
                2
              </div>
              <h4 className="text-xs font-bold leading-tight text-white">
                Live messaging
              </h4>
              <p className="text-[10px] text-purple-200 mt-1 leading-snug">
                Chat & agree on deliverables
              </p>
            </div>

            {/* Step 3: Translucent Glass Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-white">
              <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold mb-2.5">
                3
              </div>
              <h4 className="text-xs font-bold leading-tight text-white">
                Secure payouts
              </h4>
              <p className="text-[10px] text-purple-200 mt-1 leading-snug">
                Milestone release with zero hassle
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            RIGHT PANEL: Minimalist, Ultra-Clean White Form
            Classy inputs, single role selector, single button,
            single signup link below button, and single legal disclaimer
            ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">

            {/* Header: Title & Subtitle */}
            <h2 className="text-3xl font-black tracking-tight text-[#17213B] mb-1.5">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-[#687087] mb-6 font-normal">
              Sign in to your 2BeCollab account to continue.
            </p>

            {/* Role Switcher (Creator vs Brand) */}
            <div className="flex p-1 rounded-2xl bg-[#FAF9FF] border border-[#E8E0FE] mb-6">
              <button
                type="button"
                id="role-switch-login-creator"
                onClick={() => handleRoleChange('CREATOR')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCreator
                    ? 'bg-white text-[#5125D8] shadow-sm border border-[#E8E0FE]'
                    : 'text-[#687087] hover:text-[#17213B]'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-[#5125D8]" />
                <span>I'm a Creator</span>
              </button>
              <button
                type="button"
                id="role-switch-login-business"
                onClick={() => handleRoleChange('BUSINESS')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isCreator
                    ? 'bg-white text-[#5125D8] shadow-sm border border-[#E8E0FE]'
                    : 'text-[#687087] hover:text-[#17213B]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#5125D8]" />
                <span>I'm a Brand</span>
              </button>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="p-3 mb-4 rounded-xl text-xs font-medium bg-red-50 border border-red-200 text-red-600 animate-fade-in">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#17213B] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5125D8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-email-login"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF9FF]/60 border border-slate-200 text-xs sm:text-sm text-[#17213B] placeholder:text-slate-400 focus:outline-none focus:border-[#5125D8] focus:bg-white focus:ring-4 focus:ring-[#5125D8]/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password with Forgot Password Link */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#17213B]">
                    Password
                  </label>
                  <Link
                    to={`/auth/forgot-password?role=${role}`}
                    className="text-xs text-[#5125D8] font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5125D8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-password-login"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#FAF9FF]/60 border border-slate-200 text-xs sm:text-sm text-[#17213B] placeholder:text-slate-400 focus:outline-none focus:border-[#5125D8] focus:bg-white focus:ring-4 focus:ring-[#5125D8]/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#5125D8] transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Single Primary Continue Button */}
              <div className="pt-2">
                <button
                  id="btn-login"
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-[#5125D8] hover:bg-[#431DB8] shadow-lg shadow-[#5125D8]/25 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{loginMutation.isPending ? 'Logging In...' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Single Clean Signup Link (Directly below button, exactly like reference) */}
              <p className="text-center text-xs text-[#687087] pt-1 font-medium">
                Don't have an account?{' '}
                <Link
                  to={`/auth/signup?role=${role}`}
                  className="text-[#5125D8] font-bold hover:underline"
                >
                  Sign up
                </Link>
              </p>

              {/* Or Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-semibold text-slate-400">
                  Or
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Google Button */}
              <button
                type="button"
                id="btn-google-login"
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:border-[#5125D8]/40 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Single Legal Disclaimer (At the very bottom) */}
              <p className="text-[10px] text-center text-[#687087] pt-2 leading-relaxed font-normal">
                By logging in, you agree to our{' '}
                <a href="/terms" className="text-[#5125D8] font-semibold hover:underline">Terms of Service</a> and{' '}
                <a href="/privacy" className="text-[#5125D8] font-semibold hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
