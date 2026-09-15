import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  PortfolioItemResponse,
  CreatePortfolioItemPayload,
  UpdatePortfolioItemPayload,
} from '@2becollab/types';

export const portfolioApi = {
  // List my portfolio items
  list: async () => {
    const res = await apiClient.get<ApiResponse<{ items: PortfolioItemResponse[] }>>(
      '/creators/me/portfolio',
    );
    return res.data;
  },

  // Add a new portfolio item
  create: async (data: CreatePortfolioItemPayload) => {
    const res = await apiClient.post<
      ApiResponse<{ item: PortfolioItemResponse; message: string }>
    >('/creators/me/portfolio', data);
    return res.data;
  },

  // Update an existing portfolio item
  update: async (id: string, data: UpdatePortfolioItemPayload) => {
    const res = await apiClient.patch<
      ApiResponse<{ item: PortfolioItemResponse; message: string }>
    >(`/creators/me/portfolio/${id}`, data);
    return res.data;
  },

  // Delete a portfolio item
  remove: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/creators/me/portfolio/${id}`,
    );
    return res.data;
  },

  // Reorder portfolio items
  reorder: async (itemIds: string[]) => {
    const res = await apiClient.patch<ApiResponse<{ message: string }>>(
      '/creators/me/portfolio/reorder',
      { itemIds },
    );
    return res.data;
  },
};
