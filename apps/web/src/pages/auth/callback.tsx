import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/stores/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/features/auth/hooks';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setStatus('error');
      setErrorMessage(
        error === 'access_denied'
          ? 'Google sign-in was canceled.'
          : decodeURIComponent(error) || 'Failed to authenticate with Google.'
      );
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await authApi.getMe();
        if (res.data?.user) {
          const user = res.data.user;
          setUser(user);
          queryClient.setQueryData(authKeys.me, user);
          setUserName(user.fullName);
          setStatus('success');

          // If opened in a popup window, notify the opener and close
          if (window.opener && window.opener !== window) {
            try {
              window.opener.postMessage(
                { type: 'GOOGLE_AUTH_SUCCESS', user },
                window.location.origin,
              );
              window.close();
              return;
            } catch {
              // Fallback to in-window redirect
            }
          }

          // Redirect to home (or dashboard) after brief success display
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1200);
        } else {
          setStatus('error');
          setErrorMessage('Could not retrieve user session. Please try logging in again.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message || 'Authentication session could not be established.',
        );
      }
    };

    fetchSession();
  }, [searchParams, setUser, queryClient, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Card variant="glass" padding="lg" className="w-full max-w-md text-center">
        {status === 'loading' && (
          <div className="space-y-6 py-8">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                  border: '1px solid var(--color-primary)',
                }}
              >
                <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Authenticating with Google...</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Please wait while we establish your secure session.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 py-8 animate-in fade-in zoom-in-95 duration-300">
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Welcome back{userName ? `, ${userName}` : ''}!
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Authentication successful. Redirecting you to 2BeCollab...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 py-6 animate-in fade-in duration-300">
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Sign In Failed</h2>
              <p className="text-sm text-red-400 mb-6">{errorMessage}</p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  onClick={() => navigate('/auth/signup')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Try Again
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Link
                  to="/auth/login"
                  className="text-sm font-medium transition-colors hover:text-white"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Go to Email Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
