import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, RegisterPayload, LoginPayload, ResetPasswordPayload } from './api';
import { useAuthStore } from '@/stores/auth-store';

// ─── Query Keys ──────────────────────────────────────────────

export const authKeys = {
  me: ['auth', 'me'] as const,
};

// ─── Queries ─────────────────────────────────────────────────

export function useMe() {
  const { setUser, clearUser } = useAuthStore();

  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        const result = await authApi.getMe();
        if (result.data?.user) {
          setUser(result.data.user);
          return result.data.user;
        }
        clearUser();
        return null;
      } catch {
        clearUser();
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Mutations ───────────────────────────────────────────────

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (result) => {
      if (result.data?.user) {
        setUser(result.data.user);
        queryClient.setQueryData(authKeys.me, result.data.user);
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearUser();
      queryClient.removeQueries({ queryKey: authKeys.me });
      navigate('/');
    },
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: (result) => {
      if (result.data?.user) {
        setUser(result.data.user);
        queryClient.setQueryData(authKeys.me, result.data.user);
      }
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => authApi.resetPassword(data),
  });
}
