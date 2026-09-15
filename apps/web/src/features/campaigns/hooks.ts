import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsApi } from './api';
import type {
  CampaignSearchQuery,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  CampaignStatus,
} from '@2becollab/types';

export function usePublicCampaigns(params: CampaignSearchQuery) {
  return useQuery({
    queryKey: ['campaigns', 'public', params],
    queryFn: async () => {
      const res = await campaignsApi.search(params);
      return res.data ?? { items: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    },
  });
}

export function useMyCampaigns(status?: CampaignStatus) {
  return useQuery({
    queryKey: ['campaigns', 'my', status],
    queryFn: async () => {
      const res = await campaignsApi.getMyCampaigns(status);
      return res.data?.campaigns ?? [];
    },
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const res = await campaignsApi.getById(id);
      return res.data?.campaign;
    },
    enabled: Boolean(id),
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignPayload) => campaignsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignPayload }) =>
      campaignsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
