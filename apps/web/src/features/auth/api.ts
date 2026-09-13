import { apiClient } from '@/lib/api/client';
import type { ApiResponse, AuthResponse, UserResponse } from '@2becollab/types';

// ─── Auth API Functions ──────────────────────────────────────

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: 'CREATOR' | 'BUSINESS';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const authApi = {
  register: async (data: RegisterPayload) => {
    const res = await apiClient.post<ApiResponse<{ user: UserResponse; message: string }>>(
      '/auth/register',
      data,
    );
    return res.data;
  },

  login: async (data: LoginPayload) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post<ApiResponse>('/auth/logout');
    return res.data;
  },

  refresh: async () => {
    const res = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    return res.data;
  },

  verifyEmail: async (token: string) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-email', { token });
    return res.data;
  },

  resendVerification: async (email: string) => {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/resend-verification', { email });
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: ResetPasswordPayload) => {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', data);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<{ user: UserResponse }>>('/auth/me');
    return res.data;
  },

  getGoogleAuthUrl: (role: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    return `${apiUrl}/auth/google?state=${role}`;
  },
};

export function openGoogleAuthPopup(
  role: string,
  onSuccess: (user: UserResponse) => void,
  onFailure?: (error: string) => void,
) {
  const url = authApi.getGoogleAuthUrl(role);
  const width = 500;
  const height = 650;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

  const popup = window.open(
    url,
    'google_oauth_window',
    `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,resizable=yes`,
  );

  // If popup is blocked by browser, fallback to standard redirect
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    window.location.href = url;
    return;
  }

  popup.focus?.();

  // Listen for message from popup
  const messageListener = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data.user) {
      window.removeEventListener('message', messageListener);
      clearInterval(timer);
      onSuccess(event.data.user);
    } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
      window.removeEventListener('message', messageListener);
      clearInterval(timer);
      onFailure?.(event.data.error || 'Google authentication failed');
    }
  };

  window.addEventListener('message', messageListener);

  // Check if popup was closed by user
  const timer = setInterval(() => {
    if (popup.closed) {
      clearInterval(timer);
      window.removeEventListener('message', messageListener);
    }
  }, 800);
}

