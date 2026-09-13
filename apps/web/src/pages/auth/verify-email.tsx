import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVerifyEmail, useResendVerification } from '@/features/auth/hooks';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';

  const [countdown, setCountdown] = useState(0);
  const [verified, setVerified] = useState(false);

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();

  // Auto-verify if token is in URL
  useEffect(() => {
    if (token && !verified) {
      verifyMutation.mutate(token, {
        onSuccess: () => {
          setVerified(true);
          setTimeout(() => navigate('/'), 3000);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    if (email && countdown === 0) {
      resendMutation.mutate(email);
      setCountdown(60);
    }
  };

  // ─── Token verification view ──────────────────────────────
  if (token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 animate-fade-in">
        <div
          className="w-full max-w-md p-8 rounded-2xl text-center"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-light)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {verifyMutation.isPending && (
            <>
              <Loader2
                className="w-16 h-16 mx-auto mb-6 animate-spin"
                style={{ color: 'var(--color-primary-light)' }}
              />
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Verifying your email...
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Please wait while we confirm your account.
              </p>
            </>
          )}

          {verified && (
            <>
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--color-success)' }} />
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Email Verified! 🎉
              </h1>
              <p
                className="mb-6"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Your account is now active. Redirecting you to the dashboard...
              </p>
              <Button id="btn-go-dashboard" onClick={() => navigate('/')}>
                Go to Dashboard
              </Button>
            </>
          )}

          {verifyMutation.isError && (
            <>
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                <Mail className="w-8 h-8" style={{ color: 'var(--color-error)' }} />
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Verification Failed
              </h1>
              <p
                className="mb-6"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                This link may be expired or invalid. Try requesting a new one.
              </p>
              <Button id="btn-back-login" variant="secondary" onClick={() => navigate('/auth/login')}>
                Back to Login
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── "Check your email" view ──────────────────────────────
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div
        className="w-full max-w-md p-8 rounded-2xl text-center animate-slide-up"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Animated mail icon */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <Mail
            className="w-10 h-10"
            style={{ color: 'var(--color-primary-light)' }}
          />
        </div>

        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Check your email
        </h1>
        <p
          className="mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          We sent a verification link to
        </p>
        {email && (
          <p
            className="font-medium mb-6"
            style={{ color: 'var(--color-primary-light)' }}
          >
            {email}
          </p>
        )}
        <p
          className="text-sm mb-8"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Click the link in the email to verify your account. The link expires in 24 hours.
        </p>

        {/* Resend button */}
        <Button
          id="btn-resend-email"
          variant="secondary"
          className="w-full"
          onClick={handleResend}
          disabled={countdown > 0}
          isLoading={resendMutation.isPending}
        >
          {countdown > 0
            ? `Resend in ${countdown}s`
            : 'Resend Verification Email'}
        </Button>

        {resendMutation.isSuccess && (
          <p
            className="mt-4 text-sm"
            style={{ color: 'var(--color-success)' }}
          >
            ✅ Verification email resent!
          </p>
        )}

        <p
          className="text-sm mt-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Wrong email?{' '}
          <button
            onClick={() => navigate('/auth/signup')}
            className="underline transition-colors hover:text-white"
            style={{ color: 'var(--color-primary-light)' }}
            id="link-change-email"
          >
            Sign up again
          </button>
        </p>
      </div>
    </div>
  );
}
