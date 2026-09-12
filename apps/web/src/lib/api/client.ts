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

// Response interceptor — extract data or handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Will handle auth redirect in Chunk 2
        console.warn('Unauthorized — redirect to login');
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
