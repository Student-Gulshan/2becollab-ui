import { apiClient } from '@/lib/api/client';
import {
  ServicePackageResponse,
  CreateServicePackagePayload,
  UpdateServicePackagePayload,
} from '@2becollab/types';

export const servicesApi = {
  getMyServices: async (): Promise<ServicePackageResponse[]> => {
    const res = await apiClient.get('/creators/me/services');
    return res.data.data;
  },

  createService: async (
    payload: CreateServicePackagePayload,
  ): Promise<ServicePackageResponse> => {
    const res = await apiClient.post('/creators/me/services', payload);
    return res.data.data;
  },

  updateService: async (
    id: string,
    payload: UpdateServicePackagePayload,
  ): Promise<ServicePackageResponse> => {
    const res = await apiClient.patch(`/creators/me/services/${id}`, payload);
    return res.data.data;
  },

  deleteService: async (id: string): Promise<{ success: boolean }> => {
    const res = await apiClient.delete(`/creators/me/services/${id}`);
    return res.data.data;
  },
};
