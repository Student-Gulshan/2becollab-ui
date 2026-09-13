import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/features/auth/hooks';
import { openGoogleAuthPopup } from '@/features/auth/api';
import { useAuthStore } from '@/stores/auth-store';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'CREATOR';
  const isCreator = role === 'CREATOR';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      // TODO: Navigate to role-specific dashboard when built
      navigate('/');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Login failed. Please check your credentials.';
      setFormError(message);
    }
  };

  const { setUser } = useAuthStore();

  const handleGoogleLogin = () => {
    openGoogleAuthPopup(
      role,
      (user) => {
        setUser(user);
        navigate('/');
      },
      (error) => {
        setFormError(error);
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 animate-fade-in">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: isCreator
            ? 'radial-gradient(ellipse at 50% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          id="btn-back-role"
          onClick={() => navigate('/auth/choose-role')}
          className="flex items-center gap-2 mb-8 text-sm transition-colors duration-200 hover:text-white group"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Change role
        </button>

        {/* Card */}
        <div
          className="p-8 rounded-2xl animate-slide-up"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-light)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Role badge */}
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: isCreator
                  ? 'rgba(99, 102, 241, 0.1)'
                  : 'rgba(6, 182, 212, 0.1)',
                border: `1px solid ${isCreator ? 'rgba(99, 102, 241, 0.2)' : 'rgba(6, 182, 212, 0.2)'}`,
                color: isCreator ? 'var(--color-primary-light)' : 'var(--color-secondary)',
              }}
            >
              {isCreator ? '🎨 Creator' : '🏢 Brand'}
            </span>
          </div>

          {/* Header */}
          <h1
            className="text-2xl font-bold text-center mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Welcome back
          </h1>
          <p
            className="text-center text-sm mb-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Log in to your {isCreator ? 'creator' : 'brand'} account
          </p>

          {/* Google Login */}
          <Button
            id="btn-google-login"
            variant="secondary"
            size="lg"
            className="w-full mb-6"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              or continue with email
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: 'var(--color-error)',
                }}
              >
                {formError}
              </div>
            )}

            <Input
              id="input-email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to={`/auth/forgot-password?role=${role}`}
                className="text-xs transition-colors hover:underline"
                style={{ color: 'var(--color-primary-light)' }}
                id="link-forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              id="btn-login"
              type="submit"
              size="lg"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              Log In
            </Button>
          </form>

          {/* Sign up link */}
          <p
            className="text-center text-sm mt-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Don&apos;t have an account?{' '}
            <Link
              to={`/auth/signup?role=${role}`}
              className="font-medium transition-colors hover:underline"
              style={{ color: 'var(--color-primary-light)' }}
              id="link-signup"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
