// ============================================
// Auth Validation Schemas — 2BeCollab Platform
// ============================================

import { z } from 'zod';
import { emailSchema, passwordSchema } from './index';

// Allowed roles for public registration (ADMIN/SUPPORT excluded)
const publicRoleSchema = z.enum(['CREATOR', 'BUSINESS'], {
  errorMap: () => ({ message: 'Role must be either CREATOR or BUSINESS' }),
});

// Register
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .trim(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: publicRoleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Forgot password
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset password
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Verify email
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
