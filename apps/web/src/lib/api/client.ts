import axios from 'axios';
import { config } from '@/app/config';

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Track if we're currently refreshing tokens
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor — handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status } = error.response;

      // If 401 and not already retrying, attempt token refresh
      if (status === 401 && !originalRequest._retry) {
        // Never retry refresh or auth check/login/register endpoints
        const isAuthEndpoint =
          originalRequest.url?.includes('/auth/refresh') ||
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/me');

        if (isAuthEndpoint) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Queue this request until refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return apiClient(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await apiClient.post('/auth/refresh');
          processQueue(null);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          // Only redirect if user is on a protected page, NEVER if already in /auth/*
          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.startsWith('/auth')
          ) {
            window.location.href = '/auth/choose-role';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) {
        console.warn('Forbidden — insufficient permissions');
      }

      if (status === 429) {
        console.warn('Rate limited — please try again later');
      }
    }

    return Promise.reject(error);
  },
);
