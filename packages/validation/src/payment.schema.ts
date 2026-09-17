import { z } from 'zod';

export const createCheckoutSchema = z.object({
  paymentMethod: z.enum(['CARD', 'MOCK_TEST']).default('MOCK_TEST'),
});

export const confirmPaymentSchema = z.object({
  sessionId: z.string().min(1, 'Session ID required'),
  providerPaymentId: z.string().optional(),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
