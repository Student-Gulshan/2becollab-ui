import { z } from 'zod';

export const applyCampaignSchema = z.object({
  pitch: z.string().min(10, 'Pitch must be at least 10 characters').max(2000, 'Pitch cannot exceed 2000 characters'),
  proposedRate: z.number().positive('Proposed rate must be positive').optional(),
  currency: z.string().default('USD'),
});

export const inviteCreatorSchema = z.object({
  campaignId: z.string().uuid('Valid campaign ID required'),
  creatorProfileId: z.string().uuid('Valid creator profile ID required'),
  message: z.string().max(1000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
  reviewNotes: z.string().max(1000).optional(),
});

export const respondInvitationSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
});

export type ApplyCampaignInput = z.infer<typeof applyCampaignSchema>;
export type InviteCreatorInput = z.infer<typeof inviteCreatorSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type RespondInvitationInput = z.infer<typeof respondInvitationSchema>;
