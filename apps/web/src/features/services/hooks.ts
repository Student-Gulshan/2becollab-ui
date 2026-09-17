import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from './api';
import {
  CreateServicePackagePayload,
  UpdateServicePackagePayload,
} from '@2becollab/types';

export const SERVICES_KEYS = {
  all: ['services'] as const,
  myServices: () => [...SERVICES_KEYS.all, 'my-services'] as const,
};

export function useMyServices() {
  return useQuery({
    queryKey: SERVICES_KEYS.myServices(),
    queryFn: () => servicesApi.getMyServices(),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePackagePayload) =>
      servicesApi.createService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEYS.myServices() });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateServicePackagePayload;
    }) => servicesApi.updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEYS.myServices() });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEYS.myServices() });
    },
  });
}
