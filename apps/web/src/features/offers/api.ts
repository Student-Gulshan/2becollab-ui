import { apiClient } from '@/lib/api/client';
import {
  OfferResponse,
  CreateOfferPayload,
  CounterOfferPayload,
  RespondOfferPayload,
} from '@2becollab/types';

export const offersApi = {
  getOffers: async (type?: 'received' | 'sent'): Promise<OfferResponse[]> => {
    const res = await apiClient.get('/offers', {
      params: type ? { type } : undefined,
    });
    return res.data.data;
  },

  getOfferById: async (id: string): Promise<OfferResponse> => {
    const res = await apiClient.get(`/offers/${id}`);
    return res.data.data;
  },

  createOffer: async (payload: CreateOfferPayload): Promise<OfferResponse> => {
    const res = await apiClient.post('/offers', payload);
    return res.data.data;
  },

  counterOffer: async (
    offerId: string,
    payload: CounterOfferPayload,
  ): Promise<OfferResponse> => {
    const res = await apiClient.post(`/offers/${offerId}/counter`, payload);
    return res.data.data;
  },

  respondOffer: async (
    offerId: string,
    payload: RespondOfferPayload,
  ): Promise<{ offer: OfferResponse; contract?: any }> => {
    const res = await apiClient.patch(`/offers/${offerId}/respond`, payload);
    return res.data.data;
  },
};
