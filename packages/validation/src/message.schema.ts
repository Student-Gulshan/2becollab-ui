import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message cannot exceed 5000 characters'),
  attachments: z.any().optional(),
});

export const startConversationSchema = z.object({
  recipientId: z.string().uuid('Valid recipient ID required'),
  campaignId: z.string().uuid().optional(),
  initialMessage: z.string().max(5000).optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type StartConversationInput = z.infer<typeof startConversationSchema>;
