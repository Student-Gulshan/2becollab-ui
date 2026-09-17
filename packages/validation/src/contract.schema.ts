import { z } from 'zod';

export const updateContractStatusSchema = z.object({
  status: z.enum(['IN_REVIEW', 'COMPLETED', 'DISPUTED', 'CANCELLED']),
  reason: z.string().max(1000).optional(),
});

export type UpdateContractStatusInput = z.infer<typeof updateContractStatusSchema>;
