import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  UserResponse,
  CreatorProfileResponse,
  BusinessProfileResponse,
  UpdateCreatorProfilePayload,
  UpdateBusinessProfilePayload,
  UpdateUserPayload,
} from '@2becollab/types';

export const profileApi = {
  // Base user profile
  getMe: async () => {
    const res = await apiClient.get<ApiResponse<{ user: UserResponse }>>('/users/me');
    return res.data;
  },

  updateMe: async (data: UpdateUserPayload) => {
    const res = await apiClient.patch<ApiResponse<{ user: UserResponse; message: string }>>('/users/me', data);
    return res.data;
  },

  // Creator profile
  getCreatorMe: async () => {
    const res = await apiClient.get<ApiResponse<{ profile: CreatorProfileResponse }>>('/creators/me');
    return res.data;
  },

  updateCreatorMe: async (data: UpdateCreatorProfilePayload) => {
    const res = await apiClient.patch<ApiResponse<{ profile: CreatorProfileResponse; message: string }>>('/creators/me', data);
    return res.data;
  },

  getPublicCreator: async (id: string) => {
    const res = await apiClient.get<ApiResponse<{ profile: CreatorProfileResponse }>>(`/creators/${id}`);
    return res.data;
  },

  // Business profile
  getBusinessMe: async () => {
    const res = await apiClient.get<ApiResponse<{ profile: BusinessProfileResponse }>>('/businesses/me');
    return res.data;
  },

  updateBusinessMe: async (data: UpdateBusinessProfilePayload) => {
    const res = await apiClient.patch<ApiResponse<{ profile: BusinessProfileResponse; message: string }>>('/businesses/me', data);
    return res.data;
  },

  getPublicBusiness: async (id: string) => {
    const res = await apiClient.get<ApiResponse<{ profile: BusinessProfileResponse }>>(`/businesses/${id}`);
    return res.data;
  },
};
