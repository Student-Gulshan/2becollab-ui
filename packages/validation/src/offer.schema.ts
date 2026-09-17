import { z } from 'zod';

const platformEnum = z.enum([
  'INSTAGRAM',
  'YOUTUBE',
  'TIKTOK',
  'TWITTER',
  'LINKEDIN',
  'FACEBOOK',
  'OTHER',
]);

export const offerDeliverableSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Deliverable title required').max(100),
  platform: platformEnum.optional(),
  format: z.string().max(50).optional(),
  count: z.number().int().min(1).default(1),
  requirements: z.string().max(1000).optional(),
});

export const createOfferSchema = z.object({
  recipientId: z.string().uuid('Valid recipient ID required'),
  creatorProfileId: z.string().uuid('Valid creator profile ID required'),
  campaignId: z.string().uuid().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  description: z.string().max(3000).optional(),
  price: z.number().positive('Price must be greater than 0'),
  currency: z.string().default('USD'),
  deliverables: z.array(offerDeliverableSchema).min(1, 'At least 1 deliverable required'),
  revisionLimit: z.number().int().min(0).max(10).default(2),
  deadline: z.string().datetime().or(z.string().min(10)),
  usageRights: z.string().max(500).optional(),
  exclusivityDays: z.number().int().min(0).max(365).optional(),
  expiresAt: z.string().datetime().optional(),
});

export const counterOfferSchema = z.object({
  price: z.number().positive('Counter price must be greater than 0').optional(),
  deadline: z.string().datetime().or(z.string().min(10)).optional(),
  revisionLimit: z.number().int().min(0).max(10).optional(),
  deliverables: z.array(offerDeliverableSchema).optional(),
  counterReason: z.string().min(5, 'Please provide reason for counter-offer').max(1000),
  usageRights: z.string().max(500).optional(),
  exclusivityDays: z.number().int().min(0).max(365).optional(),
});

export const respondOfferSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT', 'WITHDRAW']),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type CounterOfferInput = z.infer<typeof counterOfferSchema>;
export type RespondOfferInput = z.infer<typeof respondOfferSchema>;
