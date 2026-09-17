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

export const createServicePackageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  platform: platformEnum,
  format: z.string().min(2, 'Format is required (e.g. Reel, Short, Dedicated Video)').max(50),
  price: z.number().positive('Price must be greater than 0'),
  currency: z.string().default('USD'),
  deliveryDays: z.number().int().min(1, 'Delivery must be at least 1 day').max(90).default(7),
  revisions: z.number().int().min(0).max(10).default(1),
  features: z.array(z.string().max(100)).default([]),
  isActive: z.boolean().default(true),
});

export const updateServicePackageSchema = createServicePackageSchema.partial();

export type CreateServicePackageInput = z.infer<typeof createServicePackageSchema>;
export type UpdateServicePackageInput = z.infer<typeof updateServicePackageSchema>;
