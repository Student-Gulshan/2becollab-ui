import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  SocialAccountResponse,
  CreateSocialAccountPayload,
  UpdateSocialAccountPayload,
} from '@2becollab/types';

export const socialAccountsApi = {
  // List my social accounts
  list: async () => {
    const res = await apiClient.get<ApiResponse<{ accounts: SocialAccountResponse[] }>>(
      '/creators/me/social-accounts',
    );
    return res.data;
  },

  // Add a new social account
  create: async (data: CreateSocialAccountPayload) => {
    const res = await apiClient.post<
      ApiResponse<{ account: SocialAccountResponse; message: string }>
    >('/creators/me/social-accounts', data);
    return res.data;
  },

  // Update an existing social account
  update: async (id: string, data: UpdateSocialAccountPayload) => {
    const res = await apiClient.patch<
      ApiResponse<{ account: SocialAccountResponse; message: string }>
    >(`/creators/me/social-accounts/${id}`, data);
    return res.data;
  },

  // Delete a social account
  remove: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/creators/me/social-accounts/${id}`,
    );
    return res.data;
  },
};
