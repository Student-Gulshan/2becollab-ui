import { z } from 'zod';

export const updateCreatorProfileSchema = z.object({
  headline: z
    .string()
    .trim()
    .max(120, 'Headline must be under 120 characters')
    .optional()
    .nullable(),
  bio: z
    .string()
    .trim()
    .max(2000, 'Bio must be under 2000 characters')
    .optional()
    .nullable(),
  niche: z
    .array(z.string().trim().min(1, 'Niche cannot be empty').max(50, 'Niche name too long'))
    .max(10, 'You can specify up to 10 niches')
    .optional(),
  location: z
    .string()
    .trim()
    .max(100, 'Location must be under 100 characters')
    .optional()
    .nullable(),
  languages: z
    .array(z.string().trim().min(1).max(40))
    .max(10, 'You can specify up to 10 languages')
    .optional(),
  websiteUrl: z
    .string()
    .trim()
    .url('Invalid website URL')
    .max(255)
    .optional()
    .nullable()
    .or(z.literal('')),
  coverImageUrl: z
    .string()
    .trim()
    .url('Invalid cover image URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
});

export const updateBusinessProfileSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be under 100 characters')
    .optional()
    .nullable(),
  websiteUrl: z
    .string()
    .trim()
    .url('Invalid website URL')
    .max(255)
    .optional()
    .nullable()
    .or(z.literal('')),
  industry: z
    .string()
    .trim()
    .max(80, 'Industry must be under 80 characters')
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must be under 2000 characters')
    .optional()
    .nullable(),
  companySize: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable(),
  location: z
    .string()
    .trim()
    .max(100, 'Location must be under 100 characters')
    .optional()
    .nullable(),
  logoUrl: z
    .string()
    .trim()
    .url('Invalid logo URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
});

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters')
    .optional(),
  avatarUrl: z
    .string()
    .trim()
    .url('Invalid avatar URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
});

export type UpdateCreatorProfileInput = z.infer<typeof updateCreatorProfileSchema>;
export type UpdateBusinessProfileInput = z.infer<typeof updateBusinessProfileSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
