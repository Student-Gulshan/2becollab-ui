// ============================================
// Shared Validation Schemas — 2BeCollab Platform
// ============================================

import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address').toLowerCase().trim();

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// UUID validation
export const uuidSchema = z.string().uuid('Invalid ID format');

// Pagination
export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// Auth schemas
export * from './auth.schema';

// Profile schemas (Chunk 3)
export * from './profile.schema';

// Social Account & Portfolio schemas (Chunk 4)
export * from './social-account.schema';
