import { apiClient } from '@/lib/api/client';
import {
  CheckoutSessionResponse,
  ConfirmPaymentPayload,
  EscrowTransactionResponse,
} from '@2becollab/types';

export const paymentsApi = {
  getEscrowStatus: async (contractId: string): Promise<EscrowTransactionResponse | null> => {
    const res = await apiClient.get(`/contracts/${contractId}/payment`);
    return res.data.data;
  },

  createCheckout: async (
    contractId: string,
    paymentMethod: 'CARD' | 'MOCK_TEST' = 'MOCK_TEST',
  ): Promise<CheckoutSessionResponse> => {
    const res = await apiClient.post(`/contracts/${contractId}/payment/checkout`, {
      paymentMethod,
    });
    return res.data.data;
  },

  confirmPayment: async (
    contractId: string,
    payload: ConfirmPaymentPayload,
  ): Promise<{ contract: any; escrow: EscrowTransactionResponse }> => {
    const res = await apiClient.post(`/contracts/${contractId}/payment/confirm`, payload);
    return res.data.data;
  },

  releaseEscrow: async (contractId: string): Promise<EscrowTransactionResponse> => {
    const res = await apiClient.post(`/contracts/${contractId}/payment/release`);
    return res.data.data;
  },

  refundEscrow: async (contractId: string): Promise<EscrowTransactionResponse> => {
    const res = await apiClient.post(`/contracts/${contractId}/payment/refund`);
    return res.data.data;
  },
};
