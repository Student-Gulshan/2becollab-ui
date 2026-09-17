import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from './api';
import { useAuthStore } from '@/stores/auth-store';
import { ConfirmPaymentPayload } from '@2becollab/types';

export const PAYMENTS_KEYS = {
  all: ['payments'] as const,
  escrow: (contractId: string) => [...PAYMENTS_KEYS.all, 'escrow', contractId] as const,
};

export function useEscrowStatus(contractId?: string) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: PAYMENTS_KEYS.escrow(contractId || ''),
    queryFn: () => paymentsApi.getEscrowStatus(contractId!),
    enabled: isAuthenticated && !!contractId,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({
      contractId,
      paymentMethod = 'MOCK_TEST',
    }: {
      contractId: string;
      paymentMethod?: 'CARD' | 'MOCK_TEST';
    }) => paymentsApi.createCheckout(contractId, paymentMethod),
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      payload,
    }: {
      contractId: string;
      payload: ConfirmPaymentPayload;
    }) => paymentsApi.confirmPayment(contractId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_KEYS.escrow(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useReleaseEscrow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) => paymentsApi.releaseEscrow(contractId),
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_KEYS.escrow(contractId) });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useRefundEscrow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) => paymentsApi.refundEscrow(contractId),
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_KEYS.escrow(contractId) });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}
