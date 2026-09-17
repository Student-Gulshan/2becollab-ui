import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsApi } from './api';
import { useAuthStore } from '@/stores/auth-store';
import { ContractStatus } from '@2becollab/types';

export const CONTRACTS_KEYS = {
  all: ['contracts'] as const,
  list: (status?: string) => [...CONTRACTS_KEYS.all, 'list', status || 'all'] as const,
  detail: (id: string) => [...CONTRACTS_KEYS.all, 'detail', id] as const,
};

export function useContracts(status?: ContractStatus) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: CONTRACTS_KEYS.list(status),
    queryFn: () => contractsApi.getContracts(status),
    enabled: isAuthenticated,
  });
}

export function useContract(id?: string) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: CONTRACTS_KEYS.detail(id || ''),
    queryFn: () => contractsApi.getContractById(id!),
    enabled: isAuthenticated && !!id,
  });
}

export function useUpdateContractStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: ContractStatus;
      reason?: string;
    }) => contractsApi.updateStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACTS_KEYS.all });
    },
  });
}
