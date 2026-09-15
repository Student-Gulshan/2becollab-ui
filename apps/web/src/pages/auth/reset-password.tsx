import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useResetPassword } from '@/features/auth/hooks';
import { getErrorMessage } from '@/lib/api/error';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const resetMutation = useResetPassword();

  const passwordChecks = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'One number', met: /[0-9]/.test(newPassword) },
  ];

  const allChecksMet = passwordChecks.every((c) => c.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!token) {
      setFormError('Invalid reset link. Please request a new one.');
      return;
    }

    if (!allChecksMet) {
      setFormError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await resetMutation.mutateAsync({ token, newPassword });
      setSuccess(true);
    } catch (err: any) {
      setFormError(getErrorMessage(err, 'Failed to reset password. The link may be expired.'));
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
        <button
          id="btn-back-login-reset"
          onClick={() => navigate('/auth/login')}
          className="flex items-center gap-2 mb-8 text-sm transition-colors duration-200 hover:text-white group"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to login
        </button>

        <div
          className="p-8 rounded-2xl animate-slide-up"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-light)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {success ? (
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
                Password Reset! 🎉
              </h1>
              <p
                className="text-sm mb-6"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Your password has been updated. You can now log in with your new password.
              </p>
              <Button
                id="btn-go-login"
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  }}
                >
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Set new password
                </h1>
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Enter your new password below.
                </p>
              </div>

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

                <div className="relative">
                  <Input
                    id="input-new-password"
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    autoComplete="new-password"
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

                {newPassword.length > 0 && (
                  <div className="space-y-1.5 pl-1">
                    {passwordChecks.map((check) => (
                      <div
                        key={check.label}
                        className="flex items-center gap-2 text-xs transition-colors"
                        style={{ color: check.met ? 'var(--color-success)' : 'var(--color-text-muted)' }}
                      >
                        {check.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {check.label}
                      </div>
                    ))}
                  </div>
                )}

                <Input
                  id="input-confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  error={
                    confirmPassword.length > 0 && !passwordsMatch
                      ? 'Passwords do not match'
                      : undefined
                  }
                  autoComplete="new-password"
                />

                <Button
                  id="btn-reset-password"
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={resetMutation.isPending}
                >
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
