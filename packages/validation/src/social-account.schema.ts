import { z } from 'zod';

// ============================================
// Social Platform enum for validation
// ============================================

const socialPlatformEnum = z.enum([
  'INSTAGRAM',
  'YOUTUBE',
  'TIKTOK',
  'TWITTER',
  'LINKEDIN',
  'FACEBOOK',
  'OTHER',
]);

// ============================================
// Social Account Schemas
// ============================================

export const createSocialAccountSchema = z.object({
  platform: socialPlatformEnum,
  handle: z
    .string()
    .trim()
    .min(1, 'Handle is required')
    .max(100, 'Handle must be under 100 characters'),
  profileUrl: z
    .string()
    .trim()
    .url('Invalid profile URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
  followerCount: z
    .number()
    .int('Follower count must be a whole number')
    .min(0, 'Follower count cannot be negative')
    .max(1_000_000_000, 'Follower count too large')
    .optional()
    .nullable(),
  engagementRate: z
    .number()
    .min(0, 'Engagement rate cannot be negative')
    .max(100, 'Engagement rate cannot exceed 100%')
    .optional()
    .nullable(),
});

export const updateSocialAccountSchema = z.object({
  handle: z
    .string()
    .trim()
    .min(1, 'Handle is required')
    .max(100, 'Handle must be under 100 characters')
    .optional(),
  profileUrl: z
    .string()
    .trim()
    .url('Invalid profile URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
  followerCount: z
    .number()
    .int('Follower count must be a whole number')
    .min(0, 'Follower count cannot be negative')
    .max(1_000_000_000, 'Follower count too large')
    .optional()
    .nullable(),
  engagementRate: z
    .number()
    .min(0, 'Engagement rate cannot be negative')
    .max(100, 'Engagement rate cannot exceed 100%')
    .optional()
    .nullable(),
});

// ============================================
// Portfolio Item Schemas
// ============================================

export const createPortfolioItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(150, 'Title must be under 150 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be under 1000 characters')
    .optional()
    .nullable(),
  mediaUrl: z
    .string()
    .trim()
    .url('Invalid media URL')
    .max(500, 'Media URL is too long'),
  thumbnailUrl: z
    .string()
    .trim()
    .url('Invalid thumbnail URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
  externalUrl: z
    .string()
    .trim()
    .url('Invalid external URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
  category: z
    .string()
    .trim()
    .max(50, 'Category must be under 50 characters')
    .optional()
    .nullable(),
  platform: socialPlatformEnum.optional().nullable(),
  brandName: z
    .string()
    .trim()
    .max(100, 'Brand name must be under 100 characters')
    .optional()
    .nullable(),
  metrics: z
    .record(z.string(), z.number())
    .optional()
    .nullable(),
});

export const updatePortfolioItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(150, 'Title must be under 150 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be under 1000 characters')
    .optional()
    .nullable(),
  mediaUrl: z
    .string()
    .trim()
    .url('Invalid media URL')
    .max(500, 'Media URL is too long')
    .optional(),
  thumbnailUrl: z
    .string()
    .trim()
    .url('Invalid thumbnail URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
  externalUrl: z
    .string()
    .trim()
    .url('Invalid external URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
  category: z
    .string()
    .trim()
    .max(50, 'Category must be under 50 characters')
    .optional()
    .nullable(),
  platform: socialPlatformEnum.optional().nullable(),
  brandName: z
    .string()
    .trim()
    .max(100, 'Brand name must be under 100 characters')
    .optional()
    .nullable(),
  metrics: z
    .record(z.string(), z.number())
    .optional()
    .nullable(),
  sortOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

export const reorderPortfolioSchema = z.object({
  itemIds: z
    .array(z.string().uuid('Invalid portfolio item ID'))
    .min(1, 'At least one item is required')
    .max(20, 'Cannot reorder more than 20 items'),
});

// Inferred types
export type CreateSocialAccountInput = z.infer<typeof createSocialAccountSchema>;
export type UpdateSocialAccountInput = z.infer<typeof updateSocialAccountSchema>;
export type CreatePortfolioItemInput = z.infer<typeof createPortfolioItemSchema>;
export type UpdatePortfolioItemInput = z.infer<typeof updatePortfolioItemSchema>;
export type ReorderPortfolioInput = z.infer<typeof reorderPortfolioSchema>;
