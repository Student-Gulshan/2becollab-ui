import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offersApi } from './api';
import { useAuthStore } from '@/stores/auth-store';
import {
  CreateOfferPayload,
  CounterOfferPayload,
  RespondOfferPayload,
} from '@2becollab/types';

export const OFFERS_KEYS = {
  all: ['offers'] as const,
  list: (type?: string) => [...OFFERS_KEYS.all, 'list', type || 'all'] as const,
  detail: (id: string) => [...OFFERS_KEYS.all, 'detail', id] as const,
};

export function useOffers(type?: 'received' | 'sent') {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: OFFERS_KEYS.list(type),
    queryFn: () => offersApi.getOffers(type),
    enabled: isAuthenticated,
  });
}

export function useOffer(id?: string) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: OFFERS_KEYS.detail(id || ''),
    queryFn: () => offersApi.getOfferById(id!),
    enabled: isAuthenticated && !!id,
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOfferPayload) => offersApi.createOffer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_KEYS.all });
    },
  });
}

export function useCounterOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      offerId,
      payload,
    }: {
      offerId: string;
      payload: CounterOfferPayload;
    }) => offersApi.counterOffer(offerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_KEYS.all });
    },
  });
}

export function useRespondOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      offerId,
      payload,
    }: {
      offerId: string;
      payload: RespondOfferPayload;
    }) => offersApi.respondOffer(offerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OFFERS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}
