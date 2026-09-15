import { z } from 'zod';

export const socialPlatformSearchEnum = z.enum([
  'INSTAGRAM',
  'YOUTUBE',
  'TIKTOK',
  'TWITTER',
  'LINKEDIN',
  'FACEBOOK',
  'OTHER',
]);

export const creatorSearchSchema = z.object({
  query: z.string().trim().optional(),
  niches: z
    .union([z.string().transform((val) => val.split(',').map((s) => s.trim())), z.array(z.string())])
    .optional(),
  platforms: z
    .union([
      z.string().transform((val) =>
        val
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter((s) =>
            ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'TWITTER', 'LINKEDIN', 'FACEBOOK', 'OTHER'].includes(s),
          ),
      ),
      z.array(socialPlatformSearchEnum),
    ])
    .optional(),
  minFollowers: z.coerce.number().min(0).optional(),
  maxFollowers: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  location: z.string().trim().optional(),
  sortBy: z.enum(['followers', 'rating', 'reviews', 'newest']).default('followers'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type CreatorSearchInput = z.infer<typeof creatorSearchSchema>;
