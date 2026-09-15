import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  CampaignResponse,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  CampaignSearchQuery,
  CampaignSearchResponse,
  CampaignStatus,
} from '@2becollab/types';

export const campaignsApi = {
  // Discover public active campaigns
  search: async (params: CampaignSearchQuery) => {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('query', params.query);
    if (params.niche) searchParams.set('niche', params.niche);
    if (params.platform) searchParams.set('platform', params.platform);
    if (params.status) searchParams.set('status', params.status);
    if (params.minBudget !== undefined) searchParams.set('minBudget', String(params.minBudget));
    if (params.maxBudget !== undefined) searchParams.set('maxBudget', String(params.maxBudget));
    if (params.currency) searchParams.set('currency', params.currency);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString();
    const url = `/campaigns${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<ApiResponse<CampaignSearchResponse>>(url);
    return res.data;
  },

  // Get single campaign by ID
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<{ campaign: CampaignResponse }>>(
      `/campaigns/${id}`,
    );
    return res.data;
  },

  // Business: get my campaigns
  getMyCampaigns: async (status?: CampaignStatus) => {
    const url = `/campaigns/my${status ? `?status=${status}` : ''}`;
    const res = await apiClient.get<ApiResponse<{ campaigns: CampaignResponse[] }>>(url);
    return res.data;
  },

  // Business: create new campaign
  create: async (data: CreateCampaignPayload) => {
    const res = await apiClient.post<
      ApiResponse<{ campaign: CampaignResponse; message: string }>
    >('/campaigns', data);
    return res.data;
  },

  // Business: update campaign
  update: async (id: string, data: UpdateCampaignPayload) => {
    const res = await apiClient.patch<
      ApiResponse<{ campaign: CampaignResponse; message: string }>
    >(`/campaigns/${id}`, data);
    return res.data;
  },

  // Business: delete campaign
  remove: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/campaigns/${id}`,
    );
    return res.data;
  },
};
