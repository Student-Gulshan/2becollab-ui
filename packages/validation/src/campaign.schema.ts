import { z } from 'zod';

export const campaignStatusEnum = z.enum([
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
]);

export const campaignPlatformEnum = z.enum([
  'INSTAGRAM',
  'YOUTUBE',
  'TIKTOK',
  'TWITTER',
  'LINKEDIN',
  'FACEBOOK',
  'OTHER',
]);

export const campaignDeliverableSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, 'Deliverable title is required').max(100),
  platform: campaignPlatformEnum.optional(),
  format: z.string().trim().max(50).optional(),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').default(1),
  description: z.string().trim().max(500).optional(),
});

export const createCampaignSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Campaign title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Campaign description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  coverImageUrl: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
  niches: z.array(z.string()).default([]),
  platforms: z.array(campaignPlatformEnum).default([]),
  budgetMin: z.coerce.number().min(0, 'Minimum budget must be positive').optional(),
  budgetMax: z.coerce.number().min(0, 'Maximum budget must be positive').optional(),
  currency: z.string().default('USD'),
  deliverables: z.array(campaignDeliverableSchema).optional(),
  targetAudience: z.string().trim().max(500).optional(),
  requirements: z.string().trim().max(3000).optional(),
  location: z.string().trim().max(100).optional(),
  deadline: z.string().optional(),
  status: campaignStatusEnum.default('ACTIVE'),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const campaignSearchSchema = z.object({
  query: z.string().trim().optional(),
  niche: z.string().trim().optional(),
  platform: campaignPlatformEnum.optional(),
  status: campaignStatusEnum.optional(),
  minBudget: z.coerce.number().min(0).optional(),
  maxBudget: z.coerce.number().min(0).optional(),
  currency: z.string().optional(),
  sortBy: z.enum(['newest', 'budget', 'deadline']).default('newest'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CampaignSearchInput = z.infer<typeof campaignSearchSchema>;
