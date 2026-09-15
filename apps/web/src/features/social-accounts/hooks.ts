import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialAccountsApi } from './api';
import type { CreateSocialAccountPayload, UpdateSocialAccountPayload } from '@2becollab/types';

const SOCIAL_ACCOUNTS_KEY = ['social-accounts', 'me'];

export function useMySocialAccounts() {
  return useQuery({
    queryKey: SOCIAL_ACCOUNTS_KEY,
    queryFn: async () => {
      const res = await socialAccountsApi.list();
      return res.data?.accounts ?? [];
    },
  });
}

export function useAddSocialAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSocialAccountPayload) => socialAccountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_ACCOUNTS_KEY });
    },
  });
}

export function useUpdateSocialAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSocialAccountPayload }) =>
      socialAccountsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_ACCOUNTS_KEY });
    },
  });
}

export function useDeleteSocialAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialAccountsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_ACCOUNTS_KEY });
    },
  });
}
