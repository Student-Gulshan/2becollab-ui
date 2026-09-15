import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from './api';
import { useAuthStore } from '@/stores/auth-store';
import { authKeys } from '@/features/auth/hooks';
import type {
  UpdateCreatorProfilePayload,
  UpdateBusinessProfilePayload,
  UpdateUserPayload,
} from '@2becollab/types';

export const profileKeys = {
  me: ['profile', 'me'] as const,
  creatorMe: ['profile', 'creator', 'me'] as const,
  businessMe: ['profile', 'business', 'me'] as const,
  publicCreator: (id: string) => ['profile', 'creator', id] as const,
  publicBusiness: (id: string) => ['profile', 'business', id] as const,
};

// ─── Base User Queries ────────────────────────────────────────

export function useProfile() {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async () => {
      const res = await profileApi.getMe();
      if (res.data?.user) {
        setUser(res.data.user);
        return res.data.user;
      }
      return null;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => profileApi.updateMe(data),
    onSuccess: (res) => {
      if (res.data?.user) {
        setUser(res.data.user);
        queryClient.setQueryData(profileKeys.me, res.data.user);
        queryClient.setQueryData(authKeys.me, res.data.user);
      }
    },
  });
}

// ─── Creator Profile Hooks ────────────────────────────────────

export function useCreatorProfile() {
  return useQuery({
    queryKey: profileKeys.creatorMe,
    queryFn: async () => {
      const res = await profileApi.getCreatorMe();
      return res.data?.profile ?? null;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateCreatorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCreatorProfilePayload) => profileApi.updateCreatorMe(data),
    onSuccess: (res) => {
      if (res.data?.profile) {
        queryClient.setQueryData(profileKeys.creatorMe, res.data.profile);
        queryClient.invalidateQueries({ queryKey: profileKeys.me });
        queryClient.invalidateQueries({ queryKey: authKeys.me });
      }
    },
  });
}

export function usePublicCreator(id: string) {
  return useQuery({
    queryKey: profileKeys.publicCreator(id),
    queryFn: async () => {
      const res = await profileApi.getPublicCreator(id);
      return res.data?.profile ?? null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Business Profile Hooks ───────────────────────────────────

export function useBusinessProfile() {
  return useQuery({
    queryKey: profileKeys.businessMe,
    queryFn: async () => {
      const res = await profileApi.getBusinessMe();
      return res.data?.profile ?? null;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBusinessProfilePayload) => profileApi.updateBusinessMe(data),
    onSuccess: (res) => {
      if (res.data?.profile) {
        queryClient.setQueryData(profileKeys.businessMe, res.data.profile);
        queryClient.invalidateQueries({ queryKey: profileKeys.me });
        queryClient.invalidateQueries({ queryKey: authKeys.me });
      }
    },
  });
}

export function usePublicBusiness(id: string) {
  return useQuery({
    queryKey: profileKeys.publicBusiness(id),
    queryFn: async () => {
      const res = await profileApi.getPublicBusiness(id);
      return res.data?.profile ?? null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
