import { apiClient } from '@/lib/api/client';
import {
  ContractResponse,
  ContractStatus,
} from '@2becollab/types';

export const contractsApi = {
  getContracts: async (status?: ContractStatus): Promise<ContractResponse[]> => {
    const res = await apiClient.get('/contracts', {
      params: status ? { status } : undefined,
    });
    return res.data.data;
  },

  getContractById: async (id: string): Promise<ContractResponse> => {
    const res = await apiClient.get(`/contracts/${id}`);
    return res.data.data;
  },

  updateStatus: async (
    id: string,
    status: ContractStatus,
    reason?: string,
  ): Promise<ContractResponse> => {
    const res = await apiClient.patch(`/contracts/${id}/status`, {
      status,
      reason,
    });
    return res.data.data;
  },
};
