import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/features/auth/hooks';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const forgotMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    try {
      await forgotMutation.mutateAsync(email);
      setSent(true);
    } catch {
      // Still show success (don't reveal if email exists)
      setSent(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(99, 102, 241, 0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          id="btn-back-login-forgot"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-sm transition-colors duration-200 hover:text-white group"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div
          className="p-8 rounded-2xl animate-slide-up"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-light)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {sent ? (
            // Success state
            <div className="text-center">
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
                Check your email
              </h1>
              <p
                className="text-sm mb-6"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                If an account with <strong>{email}</strong> exists, we sent a password reset link.
              </p>
              <Button
                id="btn-back-to-login"
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            // Form state
            <>
              <div className="text-center mb-8">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  }}
                >
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Forgot password?
                </h1>
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="input-email-forgot"
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  autoComplete="email"
                />

                <Button
                  id="btn-send-reset"
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={forgotMutation.isPending}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
